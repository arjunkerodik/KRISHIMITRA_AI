"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useApp } from "@/lib/store";
import {
  Home,
  Sprout,
  Bot,
  Store,
  MoreHorizontal,
  LayoutDashboard,
  Landmark,
  ShoppingBag,
  Coins,
  Settings,
  ScanLine,
  CloudSun,
  X,
  ChevronRight,
  Shield,
} from "lucide-react";

export const MobileNav: React.FC = () => {
  const pathname = usePathname();
  const { unreadNotificationsCount, role, t } = useApp();
  const [isMoreOpen, setIsMoreOpen] = useState(false);

  const isPublic = pathname === "/login" || pathname === "/signup" || pathname === "/onboarding";
  if (isPublic) return null;

  const primaryItems = [
    { href: "/", label: t.nav?.overview || "Home", icon: Home },
    { href: "/crops", label: t.nav?.cropAdvisor || "My Crop", icon: Sprout },
    { href: "/farmtalk", label: "Ask AI", icon: Bot, highlight: true },
    { href: "/market", label: t.nav?.market || "Market", icon: Store },
  ];

  const moreItems = [
    { href: "/dashboard", label: t.nav?.digitalTwin || "My Farm", icon: LayoutDashboard, desc: "Field health & today's plan" },
    { href: "/schemes", label: t.nav?.schemes || "Govt Schemes", icon: Landmark, desc: "DBT & subsidies" },
    { href: "/marketplace", label: t.nav?.marketplace || "Marketplace", icon: ShoppingBag, desc: "Seeds & fertilizers" },
    { href: "/disease", label: t.nav?.diseaseScanner || "Crop Scanner", icon: ScanLine, desc: "AI pest & disease check" },
    { href: "/weather", label: t.nav?.weather || "Weather", icon: CloudSun, desc: "Rain forecast & radar" },
    { href: "/credits", label: t.nav?.credits || "Credits", icon: Coins, desc: "Earn & redeem vouchers" },
    { href: "/settings", label: t.nav?.settings || "Settings", icon: Settings, desc: "Language & profile" },
    ...(role === "admin"
      ? [{ href: "/admin", label: t.nav?.admin || "Admin Desk", icon: Shield, desc: "Extension moderation" }]
      : []),
  ];

  return (
    <>
      {/* 1. Quick More Drawer / Bottom Sheet */}
      {isMoreOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex flex-col justify-end bg-black/70 backdrop-blur-sm animate-in fade-in duration-150">
          <div 
            className="flex-1"
            onClick={() => setIsMoreOpen(false)}
            aria-label="Close menu backdrop"
          />
          <div className="bg-slate-950 border-t border-slate-800 rounded-t-3xl p-5 shadow-2xl max-h-[80vh] overflow-y-auto animate-in slide-in-from-bottom duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800/80 mb-4">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
                  All Services
                </h3>
              </div>
              <button
                onClick={() => setIsMoreOpen(false)}
                className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-850 cursor-pointer"
                aria-label="Close menu"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {moreItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsMoreOpen(false)}
                    className={`flex items-center justify-between p-3.5 rounded-2xl border transition-all ${
                      isActive
                        ? "bg-emerald-500/20 border-emerald-400/40 text-emerald-300"
                        : "bg-slate-900/80 border-slate-800 text-slate-200 hover:bg-slate-850"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-xl ${isActive ? "bg-emerald-500/30 text-emerald-300" : "bg-slate-800 text-slate-400"}`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-white">{item.label}</div>
                        <div className="text-[10px] text-slate-400">{item.desc}</div>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-500" />
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* 2. Fixed 5-Item Bottom Bar */}
      <nav 
        aria-label="Mobile Navigation Bar"
        className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-slate-950/95 backdrop-blur-2xl border-t border-slate-800/80 px-3 pt-2 pb-[max(0.6rem,env(safe-area-inset-bottom))] shadow-[0_-8px_30px_rgba(0,0,0,0.6)] text-white select-none"
      >
        <div className="flex items-center justify-around max-w-md mx-auto relative">
          {primaryItems.slice(0, 2).map((item) => {
            const isActive = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex flex-col items-center py-1 px-3 rounded-xl transition-all relative group ${
                  isActive ? "text-emerald-400 font-bold" : "text-slate-400 hover:text-white"
                }`}
              >
                {isActive && (
                  <span className="absolute -top-2 w-6 h-1 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
                )}
                <Icon className={`w-5 h-5 transition-transform group-active:scale-90 ${isActive ? "scale-110" : ""}`} />
                <span className="text-[10px] font-mono mt-1 tracking-tight">{item.label}</span>
              </Link>
            );
          })}

          {/* Highlight Center Item: Ask AI (FarmTalk) */}
          <Link
            href="/farmtalk"
            className="flex flex-col items-center -mt-6 group focus:outline-none"
          >
            <div className="relative">
              <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-emerald-500 to-teal-400 blur-sm opacity-75 group-hover:opacity-100 animate-pulse transition-opacity" />
              <div className="relative w-13 h-13 rounded-full bg-gradient-to-tr from-emerald-600 to-teal-500 text-slate-950 flex items-center justify-center shadow-xl ring-4 ring-slate-950 group-hover:scale-105 active:scale-95 transition-all">
                <Bot className="w-6 h-6 stroke-[2.2] text-slate-950" />
                {unreadNotificationsCount > 0 && (
                  <span className="absolute top-1 right-1 w-2.5 h-2.5 rounded-full bg-rose-500 ring-2 ring-slate-950 animate-pulse" />
                )}
              </div>
            </div>
            <span className={`text-[10px] font-mono font-bold mt-1 tracking-tight ${pathname === "/farmtalk" ? "text-emerald-300" : "text-emerald-400"}`}>
              Ask AI
            </span>
          </Link>

          {/* Market Link */}
          {primaryItems.slice(3, 4).map((item) => {
            const isActive = pathname.startsWith(item.href);
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex flex-col items-center py-1 px-3 rounded-xl transition-all relative group ${
                  isActive ? "text-emerald-400 font-bold" : "text-slate-400 hover:text-white"
                }`}
              >
                {isActive && (
                  <span className="absolute -top-2 w-6 h-1 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
                )}
                <Icon className={`w-5 h-5 transition-transform group-active:scale-90 ${isActive ? "scale-110" : ""}`} />
                <span className="text-[10px] font-mono mt-1 tracking-tight">{item.label}</span>
              </Link>
            );
          })}

          {/* More Toggle Button */}
          <button
            onClick={() => setIsMoreOpen(!isMoreOpen)}
            className={`flex flex-col items-center py-1 px-3 rounded-xl transition-all relative group cursor-pointer ${
              isMoreOpen || ["/schemes", "/marketplace", "/credits", "/settings", "/dashboard", "/disease", "/weather"].some(p => pathname.startsWith(p))
                ? "text-emerald-400 font-bold"
                : "text-slate-400 hover:text-white"
            }`}
            aria-label="Open More Menu"
          >
            <MoreHorizontal className="w-5 h-5 transition-transform group-active:scale-90" />
            <span className="text-[10px] font-mono mt-1 tracking-tight">More</span>
          </button>
        </div>
      </nav>
    </>
  );
};
