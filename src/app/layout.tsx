import type { Metadata, Viewport } from "next";
import { Inter, Poppins, Outfit, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { AppProvider } from "@/lib/store";
import { Header } from "@/components/Header";
import { GlobalBackButton } from "@/components/GlobalBackButton";
import { MobileNav } from "@/components/MobileNav";
import { GlobalNatureCanvas } from "@/components/GlobalNatureCanvas";
import { AppInstallPrompt } from "@/components/AppInstallPrompt";
import { FloatingAppActions } from "@/components/FloatingAppActions";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  display: "swap",
});

const poppins = Poppins({
  variable: "--font-display",
  weight: ["400", "500", "600", "700", "800"],
  subsets: ["latin"],
  display: "swap",
});

const outfit = Outfit({
  variable: "--font-title",
  weight: ["400", "500", "600", "700", "800", "900"],
  subsets: ["latin"],
  display: "swap",
});

export const viewport: Viewport = {
  themeColor: "#052e16",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  viewportFit: "cover",
  userScalable: false,
};

export const metadata: Metadata = {
  metadataBase: new URL("https://krishimitra.com"),
  title: "KrishiMitra AI - Smart Farm Companion & Mandi Advisory",
  description: "Smart agricultural decision companion with verified AGMARKNET mandi rates, weather alerts, and AI crop advisory.",
  manifest: "/manifest.json",
  icons: {
    icon: "/favicon.ico",
    apple: "/favicon.ico",
  },
  openGraph: {
    title: "KrishiMitra AI App",
    description: "Smart Farm Companion & Mandi Advisory",
    url: "https://krishimitra.com",
    siteName: "KrishiMitra AI",
    type: "website",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "KrishiMitra AI",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable} ${poppins.variable} ${outfit.variable} dark h-full antialiased`}>
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/sw.js').then(function(reg) {
                    console.log('KrishiMitra PWA Service Worker registered:', reg.scope);
                  }).catch(function(err) {
                    console.log('KrishiMitra PWA Service Worker failed:', err);
                  });
                });
              }
            `,
          }}
        />
      </head>
      <body className="min-h-full flex flex-col bg-slate-950 text-slate-100 transition-colors relative selection:bg-emerald-500 selection:text-slate-950">
        <AppProvider>
          <GlobalNatureCanvas />
          <Header />
          <GlobalBackButton />
          <main className="flex-1 pb-24 lg:pb-0 relative z-10">{children}</main>
          <MobileNav />
          <FloatingAppActions />
          <AppInstallPrompt />
        </AppProvider>
      </body>
    </html>
  );
}
