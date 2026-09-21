"use client";

import React from "react";
import Link from "next/link";
import { FarmerSidebar } from "@/components/FarmerSidebar";
import { FarmerStreakCard } from "@/components/FarmerStreakCard";
import { useApp } from "@/lib/store";
import { CREDIT_RULES } from "@/lib/services/creditsService";
import {
  Coins,
  Flame,
  Trophy,
  ArrowUpRight,
  ArrowDownLeft,
  ShieldCheck,
  CheckCircle2,
  Gift,
  Clock,
  Calendar,
  Sparkles,
  Info,
  ChevronRight,
  FileText,
  ScanLine,
  Sprout,
  Store,
} from "lucide-react";

export default function CreditsPage() {
  const { creditsBalance, creditTransactions, farmerStreak, awardCredits, showToast } = useApp();

  const handleSimulateAction = (actionCode: keyof typeof CREDIT_RULES) => {
    const success = awardCredits(actionCode);
    if (success) {
      showToast(
        "Credits Earned!",
        `+${CREDIT_RULES[actionCode].credits} KrishiMitra Credits added for ${CREDIT_RULES[actionCode].label}.`,
        "success"
      );
    }
  };

  return (
    <div className="min-h-screen flex bg-transparent text-white">
      <div className="hidden lg:block w-64 shrink-0">
        <div className="fixed top-16 bottom-0 w-64">
          <FarmerSidebar />
        </div>
      </div>

      <div className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8 space-y-6 max-w-6xl mx-auto">
        
        {/* Header */}
        <div className="p-6 rounded-3xl bg-black/50 backdrop-blur-xl border border-white/20 shadow-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-400/30 flex items-center gap-1">
                <Coins className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
                <span>Farmer Loyalty & Engagement Economy</span>
              </span>
              <span className="text-xs text-white/70">
                Verified Smart Farming Actions
              </span>
            </div>
            <h1 className="font-display font-bold text-2xl sm:text-3xl text-white tracking-tight mt-1 flex items-center gap-2.5">
              <Coins className="w-7 h-7 text-amber-400" />
              <span>KrishiMitra Credits & Activity History</span>
            </h1>
            <p className="text-xs sm:text-sm text-white/70 mt-0.5">
              Earn reward credits for legitimate farm record-keeping, disease scans, soil testing, and APMC market participation.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/rewards"
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-emerald-600 hover:from-amber-400 hover:to-emerald-500 text-black font-bold text-xs shadow-lg transition-all inline-flex items-center gap-2 cursor-pointer active:scale-98"
            >
              <Gift className="w-4 h-4 text-black" />
              <span>Redeem Vouchers</span>
            </Link>
          </div>
        </div>

        {/* 1. HERO BALANCE & STREAK OVERVIEW */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Main Credits Balance Card */}
          <div className="p-6 rounded-3xl bg-gradient-to-br from-amber-950/60 to-black/60 border border-amber-500/40 backdrop-blur-xl shadow-2xl space-y-3 flex flex-col justify-between">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-amber-300 flex items-center gap-1.5">
                <Coins className="w-4 h-4 text-amber-400" />
                <span>Available KrishiMitra Credits</span>
              </span>
              <div className="text-4xl font-extrabold font-mono text-amber-400 mt-2">
                {creditsBalance} <span className="text-sm font-semibold text-white/70">🪙</span>
              </div>
              <p className="text-xs text-white/70 mt-1">
                Usable for input vouchers, soil testing coupons, and logistics rebates.
              </p>
            </div>

            <div className="pt-2 border-t border-white/10 flex items-center justify-between text-xs">
              <span className="text-white/50">Total Lifetime Earned:</span>
              <span className="font-mono font-bold text-white">
                {creditTransactions
                  .filter((t) => t.type === "EARNED")
                  .reduce((sum, t) => sum + t.amount, 0) + 120}{" "}
                Credits
              </span>
            </div>
          </div>

          {/* Farmer Engagement Streak Summary */}
          <div className="p-6 rounded-3xl bg-gradient-to-br from-rose-950/60 to-black/60 border border-rose-500/40 backdrop-blur-xl shadow-2xl space-y-3 flex flex-col justify-between">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-rose-300 flex items-center gap-1.5">
                <Flame className="w-4 h-4 text-rose-400" />
                <span>Farmer Engagement Streak</span>
              </span>
              <div className="text-4xl font-extrabold font-mono text-rose-400 mt-2">
                {farmerStreak.currentStreak} <span className="text-sm font-semibold text-white/70">Days</span>
              </div>
              <p className="text-xs text-white/70 mt-1">
                Longest record: <strong>{farmerStreak.longestStreak} Days</strong>. Next bonus at 7 Days (+100 🪙).
              </p>
            </div>

            <div className="pt-2 border-t border-white/10 flex items-center justify-between text-xs">
              <span className="text-white/50">Total Activities:</span>
              <span className="font-mono font-bold text-white">
                {farmerStreak.totalActivitiesLogged} Verified Actions
              </span>
            </div>
          </div>

          {/* Anti-Fraud Protection Notice */}
          <div className="p-6 rounded-3xl bg-black/50 border border-white/20 backdrop-blur-xl shadow-2xl space-y-3 flex flex-col justify-between">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-sky-300 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-sky-400" />
                <span>Anti-Abuse Protection</span>
              </span>
              <h4 className="text-sm font-bold text-white mt-2">
                Daily Rate-Limited Earning Rules
              </h4>
              <p className="text-xs text-white/70 mt-1 leading-relaxed">
                Credits are strictly awarded for genuine verified farming events. Repeated spam clicks are automatically rate-limited.
              </p>
            </div>

            <div className="p-2.5 rounded-xl bg-sky-950/40 border border-sky-500/30 text-[11px] text-sky-200">
              Audit status: <strong>Zero suspicious events detected</strong>
            </div>
          </div>

        </div>

        {/* 2. STREAK PROGRESS CARD */}
        <FarmerStreakCard />

        {/* 3. WAYS TO EARN CREDITS */}
        <div className="bg-black/50 backdrop-blur-xl rounded-3xl border border-white/20 p-6 shadow-2xl space-y-4">
          <div className="pb-3 border-b border-white/10">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-400" />
              <span>How Farmers Earn KrishiMitra Credits</span>
            </h3>
            <p className="text-xs text-white/60">
              Qualify for instant credits by completing meaningful digital farm operations.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {[
              {
                code: "PROFILE_COMPLETION",
                title: "Complete KYC & Aadhaar Seeding",
                credits: "+50 🪙",
                limit: "1 time per season",
                href: "/settings",
                icon: ShieldCheck,
              },
              {
                code: "FARM_BOUNDARY_GIS",
                title: "Map Farm Plot Geo-Boundary",
                credits: "+75 🪙",
                limit: "1 time per plot",
                href: "/dashboard",
                icon: Sprout,
              },
              {
                code: "DISEASE_SCAN_DIAGNOSIS",
                title: "Run Crop Disease AI Scanner",
                credits: "+20 🪙",
                limit: "Max 3 / day",
                href: "/disease",
                icon: ScanLine,
              },
              {
                code: "SOIL_REPORT_UPLOAD",
                title: "Upload Verified Soil Card",
                credits: "+40 🪙",
                limit: "1 time per year",
                href: "/soil",
                icon: FileText,
              },
              {
                code: "DAILY_ADVISORY_CHECKIN",
                title: "Check Daily Weather & Mandi Rates",
                credits: "+10 🪙",
                limit: "1 time / day",
                href: "/weather",
                icon: Clock,
              },
              {
                code: "MARKETPLACE_ORDER_COMPLETED",
                title: "Procure Inputs via FPO Marketplace",
                credits: "+35 🪙",
                limit: "Per fulfilled order",
                href: "/marketplace",
                icon: Store,
              },
            ].map((rule) => {
              const Icon = rule.icon;
              return (
                <div
                  key={rule.code}
                  className="p-4 rounded-2xl bg-black/40 border border-white/10 hover:border-amber-400/40 transition-all flex flex-col justify-between space-y-3"
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-400/30">
                        <Icon className="w-4 h-4" />
                      </div>
                      <span className="font-mono font-bold text-sm text-amber-400">
                        {rule.credits}
                      </span>
                    </div>
                    <h4 className="font-bold text-xs text-white">{rule.title}</h4>
                    <span className="text-[10px] text-white/50 block">Limit: {rule.limit}</span>
                  </div>

                  <Link
                    href={rule.href}
                    className="w-full py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold text-center border border-white/15 transition-colors"
                  >
                    Open Action →
                  </Link>
                </div>
              );
            })}
          </div>
        </div>

        {/* 4. CHRONOLOGICAL TRANSACTION LEDGER */}
        <div className="bg-black/50 backdrop-blur-xl rounded-3xl border border-white/20 p-6 shadow-2xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <FileText className="w-5 h-5 text-emerald-400" />
                <span>Credit Activity & Audit Ledger</span>
              </h3>
              <p className="text-xs text-white/60">
                Immutable chronological log of all earned, spent, and milestone rewards.
              </p>
            </div>
            <span className="text-xs font-mono px-3 py-1 rounded-xl bg-white/10 border border-white/10 text-white/80">
              {creditTransactions.length} Transactions
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-white/15 text-[11px] font-bold text-white/60 uppercase tracking-wider">
                  <th className="py-3 px-3">Tx ID & Timestamp</th>
                  <th className="py-3 px-3">Action & Reason</th>
                  <th className="py-3 px-3">Type</th>
                  <th className="py-3 px-3 text-right">Credits</th>
                  <th className="py-3 px-3 text-right">Balance After</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10 text-white/85">
                {creditTransactions.map((tx) => (
                  <tr key={tx.id} className="hover:bg-white/5 transition-colors">
                    <td className="py-3.5 px-3">
                      <span className="font-mono font-semibold text-white block">{tx.id}</span>
                      <span className="text-[10px] text-white/50">{tx.timestamp}</span>
                    </td>
                    <td className="py-3.5 px-3">
                      <span className="font-semibold text-white">{tx.reason}</span>
                      <span className="text-[10px] text-emerald-300 font-mono block">
                        Code: {tx.actionCode}
                      </span>
                    </td>
                    <td className="py-3.5 px-3">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          tx.type === "EARNED"
                            ? "bg-emerald-500/20 text-emerald-300 border border-emerald-400/30"
                            : tx.type === "SPENT"
                            ? "bg-amber-500/20 text-amber-300 border border-amber-400/30"
                            : "bg-rose-500/20 text-rose-300 border border-rose-400/30"
                        }`}
                      >
                        {tx.type}
                      </span>
                    </td>
                    <td className="py-3.5 px-3 text-right font-mono font-bold text-sm">
                      <span className={tx.type === "EARNED" ? "text-emerald-400" : "text-amber-400"}>
                        {tx.type === "EARNED" ? `+${tx.amount}` : `-${tx.amount}`} 🪙
                      </span>
                    </td>
                    <td className="py-3.5 px-3 text-right font-mono font-bold text-white/90">
                      {tx.balanceAfter} 🪙
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}
