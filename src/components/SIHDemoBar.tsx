"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useApp } from "@/lib/store";
import {
  Sparkles,
  ShieldCheck,
  Trophy,
  UserCheck,
  Building2,
  Store,
  ShoppingBag,
  Coins,
  ChevronRight,
  Flame,
  Info,
  CheckCircle2,
} from "lucide-react";

export const SIHDemoBar: React.FC = () => {
  const { role, setRole, creditsBalance, farmerStreak, isDemoMode, toggleDemoMode, showToast } = useApp();
  const [isOpen, setIsOpen] = useState(false);

  const demoScenarios = [
    {
      id: "scen_1",
      title: "1. Verified Schemes & Official Apply",
      desc: "myScheme.gov.in integration with official government portal redirects",
      href: "/schemes",
    },
    {
      id: "scen_2",
      title: "2. e-NAM Market Arbitrage Engine",
      desc: "Live APMC prices, transport net realization calculation & 30-day trends",
      href: "/market",
    },
    {
      id: "scen_3",
      title: "3. Agri-Inputs Marketplace & Order",
      desc: "Verified FPO inputs, genuine seasonal offers, add to cart & place order",
      href: "/marketplace",
    },
    {
      id: "scen_4",
      title: "4. KrishiMitra Credits & Rewards",
      desc: "Farmer engagement streak, credit ledger & coupon voucher redemption",
      href: "/rewards",
    },
    {
      id: "scen_5",
      title: "5. Admin & Verification Portal",
      desc: "Moderate providers, verify schemes, update order lifecycle & anti-fraud",
      href: "/admin",
    },
    {
      id: "scen_6",
      title: "6. Data Sources & Transparency",
      desc: "Official API citations, verification cadences, and SIH compliance disclosure",
      href: "/transparency",
    },
  ];

  return (
    <div className="sticky top-0 z-50 bg-black/80 backdrop-blur-xl border-b border-emerald-500/30 text-white text-xs px-3 sm:px-6 py-2 shadow-2xl transition-all">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
        
        {/* Left: SIH Badge & Mode Indicator */}
        <div className="flex items-center gap-2">
          <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 text-[10px] font-black uppercase tracking-wider flex items-center gap-1 shadow-sm">
            <Trophy className="w-3 h-3 text-amber-400" />
            <span>SIH 2026 Finals Prototype</span>
          </span>

          <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-lg bg-sky-500/15 border border-sky-400/30 text-sky-200 text-[11px] font-semibold">
            <ShieldCheck className="w-3.5 h-3.5 text-sky-400" />
            <span>Official Government & e-NAM Data Verified</span>
          </span>
        </div>

        {/* Center: Live Loyalty Metric Badges */}
        <div className="flex items-center gap-3">
          <Link
            href="/credits"
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-amber-500/15 border border-amber-400/40 text-amber-300 font-bold hover:bg-amber-500/25 transition-colors cursor-pointer"
            title="View KrishiMitra Credits Ledger"
          >
            <Coins className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
            <span>{creditsBalance} Credits</span>
          </Link>

          <Link
            href="/credits"
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-rose-500/15 border border-rose-400/40 text-rose-300 font-bold hover:bg-rose-500/25 transition-colors cursor-pointer"
            title="Farmer Engagement Streak"
          >
            <Flame className="w-3.5 h-3.5 text-rose-400" />
            <span>{farmerStreak.currentStreak} Day Streak</span>
          </Link>
        </div>

        {/* Right: Quick Role Switcher & Scenario Guide Dropdown */}
        <div className="flex items-center gap-2">
          <div className="flex items-center bg-black/60 rounded-xl p-0.5 border border-white/15 text-[11px]">
            <button
              onClick={() => {
                setRole("farmer");
                showToast("Switched to Farmer Mode", "Viewing as Ramesh Gowda (4.0 Ac, Kolar)", "info");
              }}
              className={`px-2.5 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                role === "farmer"
                  ? "bg-emerald-600 text-white shadow-sm"
                  : "text-neutral-300 hover:text-white"
              }`}
            >
              👨‍🌾 Farmer
            </button>
            <button
              onClick={() => {
                setRole("admin");
                showToast("Switched to Admin / Evaluator Mode", "Access to SIH verification & moderation desk", "info");
              }}
              className={`px-2.5 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                role === "admin"
                  ? "bg-purple-600 text-white shadow-sm"
                  : "text-neutral-300 hover:text-white"
              }`}
            >
              🛡️ Admin / Jury
            </button>
          </div>

          <button
            onClick={() => setIsOpen(!isOpen)}
            className="px-2.5 py-1 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 text-white font-bold flex items-center gap-1 transition-colors cursor-pointer"
          >
            <Sparkles className="w-3 h-3 text-amber-300" />
            <span className="hidden md:inline">Demo Scenarios</span>
            <span>▾</span>
          </button>
        </div>

      </div>

      {/* Expandable Judge Scenario Menu */}
      {isOpen && (
        <div className="max-w-7xl mx-auto mt-2 pt-2 border-t border-white/15 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 animate-in fade-in slide-in-from-top-2 duration-150 pb-1">
          {demoScenarios.map((scen) => (
            <Link
              key={scen.id}
              href={scen.href}
              onClick={() => setIsOpen(false)}
              className="p-2.5 rounded-xl bg-black/60 hover:bg-black/90 border border-white/15 hover:border-emerald-400/60 transition-all flex items-center justify-between group cursor-pointer"
            >
              <div className="min-w-0 pr-2">
                <span className="font-bold text-white group-hover:text-emerald-300 block truncate">
                  {scen.title}
                </span>
                <span className="text-[10px] text-neutral-300 block truncate">
                  {scen.desc}
                </span>
              </div>
              <ChevronRight className="w-3.5 h-3.5 text-neutral-400 group-hover:text-emerald-400 shrink-0" />
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};
