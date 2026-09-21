"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useApp } from "@/lib/store";
import {
  LayoutDashboard,
  Sprout,
  ScanLine,
  Store,
  Bot,
  CloudSun,
} from "lucide-react";

export const MobileNav: React.FC = () => {
  const pathname = usePathname();
  const { unreadNotificationsCount } = useApp();

  const isPublic = pathname === "/login" || pathname === "/signup" || pathname === "/onboarding";
  if (isPublic) return null;

  const items = [
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/crops", label: "Crops", icon: Sprout },
    { href: "/disease", label: "Scanner", icon: ScanLine, highlight: true },
    { href: "/weather", label: "Weather", icon: CloudSun },
    { href: "/market", label: "Market", icon: Store },
    { href: "/farmtalk", label: "FarmTalk", icon: Bot },
  ];

  return (
    <nav 
      aria-label="Mobile Navigation Bar"
      className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-slate-950/90 backdrop-blur-2xl border-t border-slate-800/80 px-2 pt-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] shadow-[0_-8px_30px_rgba(0,0,0,0.6)] text-white select-none"
    >
      <div className="flex items-center justify-around max-w-md mx-auto relative">
        {items.map((item) => {
          const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href));
          const Icon = item.icon;

          if (item.highlight) {
            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex flex-col items-center -mt-6 group focus:outline-none"
              >
                <div className="relative">
                  <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-emerald-500 to-teal-400 blur-sm opacity-70 group-hover:opacity-100 animate-pulse transition-opacity" />
                  <div className="relative w-12 h-12 rounded-full bg-gradient-to-tr from-emerald-600 to-teal-500 text-slate-950 flex items-center justify-center shadow-xl ring-4 ring-slate-950 group-hover:scale-105 active:scale-95 transition-all">
                    <Icon className="w-6 h-6 stroke-[2.2]" />
                  </div>
                </div>
                <span className={`text-[10px] font-mono font-bold mt-1 tracking-tight ${isActive ? "text-emerald-300" : "text-emerald-400/90"}`}>
                  {item.label}
                </span>
              </Link>
            );
          }

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center py-1 px-2.5 rounded-xl transition-all relative group ${
                isActive
                  ? "text-emerald-400 font-bold"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              {/* Active Pill Indicator Line */}
              {isActive && (
                <span className="absolute -top-2 w-6 h-1 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
              )}
              
              <div className="relative">
                <Icon className={`w-5 h-5 transition-transform group-active:scale-90 ${isActive ? "scale-110" : ""}`} />
                {item.href === "/farmtalk" && unreadNotificationsCount > 0 && (
                  <span className="absolute -top-1 -right-1.5 w-2.5 h-2.5 rounded-full bg-rose-500 ring-2 ring-slate-950 animate-pulse" />
                )}
              </div>
              <span className="text-[10px] font-mono mt-1 tracking-tight">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};
