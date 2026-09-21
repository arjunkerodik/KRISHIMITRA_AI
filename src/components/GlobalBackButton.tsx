"use client";

import React from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Home, ChevronRight, LayoutDashboard } from "lucide-react";

export const GlobalBackButton: React.FC = () => {
  const pathname = usePathname();
  const router = useRouter();

  // Don't show on root landing page
  if (pathname === "/") return null;

  const handleGoBack = () => {
    if (typeof window !== "undefined" && window.history.length > 1) {
      router.back();
    } else {
      router.push(pathname === "/dashboard" ? "/" : "/dashboard");
    }
  };

  const formatRouteName = (path: string) => {
    const clean = path.replace("/", "").replace(/-/g, " ");
    if (!clean) return "Dashboard";
    return clean
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  return (
    <div className="w-full bg-black/55 backdrop-blur-md border-b border-white/10 text-white z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 flex items-center justify-between gap-3 text-xs">
        
        {/* Left: Back Action & Breadcrumb Trail */}
        <div className="flex items-center gap-2.5 overflow-x-auto scrollbar-none">
          <button
            onClick={handleGoBack}
            className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-black/50 hover:bg-white/15 text-white font-semibold transition-all shadow-xs cursor-pointer border border-white/15 shrink-0"
            title="Go to previous page"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-emerald-400" />
            <span>Back</span>
          </button>

          {/* Breadcrumb path */}
          <div className="hidden sm:flex items-center gap-1.5 text-white/60 text-[11px] shrink-0 font-medium">
            <Link href="/" className="hover:text-emerald-300 transition-colors flex items-center gap-1">
              <Home className="w-3 h-3 text-emerald-400" />
              <span>Home</span>
            </Link>
            <ChevronRight className="w-3 h-3 text-white/30" />
            <Link href="/dashboard" className="hover:text-emerald-300 transition-colors">
              Dashboard
            </Link>
            {pathname !== "/dashboard" && (
              <>
                <ChevronRight className="w-3 h-3 text-white/30" />
                <span className="text-emerald-300 font-semibold truncate max-w-[200px]">
                  {formatRouteName(pathname)}
                </span>
              </>
            )}
          </div>
        </div>

        {/* Right: Quick Direct Return Links */}
        <div className="flex items-center gap-2 shrink-0">
          {pathname !== "/dashboard" && (
            <Link
              href="/dashboard"
              className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-black/50 hover:bg-white/15 text-white text-[11px] font-semibold transition-colors border border-white/15"
            >
              <LayoutDashboard className="w-3 h-3 text-emerald-400" />
              <span className="hidden md:inline">Dashboard</span>
            </Link>
          )}
        </div>

      </div>
    </div>
  );
};
