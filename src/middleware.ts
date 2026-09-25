import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

/**
 * KrishiMitra AI — Route Guard Middleware
 *
 * Rules:
 *  /admin/*           → must be authenticated + role === 'admin' | 'super_admin'
 *  /onboarding        → must be authenticated (redirects away if profile complete)
 *  /login             → skip (public)
 *  /api/auth/*        → skip (public auth endpoints)
 *  /api/whatsapp/*    → skip (webhook — verified by Meta token, not Supabase session)
 *  everything else    → must be authenticated; redirect to /login if not
 */
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // ── Public routes — no auth required ──────────────────────
  const publicRoutes = [
    "/login",
    "/signup",
    "/api/auth",
    "/api/whatsapp/webhook",
    "/_next",
    "/favicon.ico",
    "/icon-192.png",
    "/icon-512.png",
    "/manifest.json",
    "/sw.js",
    "/nature-farm-bg.jpg",
  ];

  const isPublic = publicRoutes.some((r) => pathname.startsWith(r));
  if (isPublic) return NextResponse.next();

  // ── Create a Supabase server client (reads cookies) ────────
  let response = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // ── Get session ────────────────────────────────────────────
  const {
    data: { session },
  } = await supabase.auth.getSession();

  // Not authenticated → redirect to login
  if (!session) {
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = "/login";
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // ── Admin-only routes ──────────────────────────────────────
  if (pathname.startsWith("/admin")) {
    const { data: profile } = await supabase
      .from("farmer_profiles")
      .select("role")
      .eq("id", session.user.id)
      .single();

    const role = profile?.role;
    if (role !== "admin" && role !== "super_admin") {
      // Farmer tried to access admin — redirect to home
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths EXCEPT:
     * - _next/static (static files)
     * - _next/image (image optimization)
     * - favicon, icons, public assets
     */
    "/((?!_next/static|_next/image|favicon.ico|icon-|manifest.json|sw.js|nature-farm-bg).*)",
  ],
};
