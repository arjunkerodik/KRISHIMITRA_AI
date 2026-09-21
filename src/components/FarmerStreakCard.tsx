"use client";

import React from "react";
import Link from "next/link";
import { useApp } from "@/lib/store";
import {
  Flame,
  Trophy,
  CheckCircle2,
  Calendar,
  Sparkles,
  ChevronRight,
  Gift,
  Coins,
} from "lucide-react";

export const FarmerStreakCard: React.FC<{ compact?: boolean }> = ({ compact = false }) => {
  const { farmerStreak, creditsBalance, recordDailyActivity } = useApp();

  const daysOfWeek = ["M", "T", "W", "T", "F", "S", "S"];
  const currentStreakMod = Math.min(7, farmerStreak.currentStreak % 8 || 1);

  if (compact) {
    return (
      <Link
        href="/credits"
        className="p-3.5 rounded-2xl bg-black/50 backdrop-blur-xl border border-white/20 hover:border-rose-400/50 transition-all flex items-center justify-between text-white shadow-xl group"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-rose-500/20 border border-rose-500/40 flex items-center justify-center text-rose-400 shrink-0">
            <Flame className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-display font-bold text-sm text-white">
                {farmerStreak.currentStreak} Day Engagement Streak
              </span>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold">
                {creditsBalance} 🪙
              </span>
            </div>
            <p className="text-[11px] text-neutral-300">
              Next milestone: 7 Days (+100 KrishiMitra Credits)
            </p>
          </div>
        </div>

        <ChevronRight className="w-4 h-4 text-neutral-400 group-hover:text-rose-400 group-hover:translate-x-0.5 transition-all" />
      </Link>
    );
  }

  return (
    <div className="bg-black/50 backdrop-blur-xl rounded-3xl border border-white/20 p-6 shadow-2xl text-white space-y-4">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-white/15">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-rose-500/30 to-amber-500/20 border border-rose-400/40 flex items-center justify-center text-rose-400 shadow-lg shrink-0">
            <Flame className="w-7 h-7 animate-bounce" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-display font-bold text-lg text-white">
                KrishiMitra Farmer Engagement Streak
              </h3>
              <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-400/30">
                Active
              </span>
            </div>
            <p className="text-xs text-neutral-300 mt-0.5">
              Meaningful daily advisory tracking, disease scouting, and verified smart farming actions.
            </p>
          </div>
        </div>

        <div className="text-right flex sm:flex-col items-center sm:items-end justify-between sm:justify-start">
          <span className="text-[10px] text-neutral-400 uppercase font-bold tracking-wider">
            Current Record
          </span>
          <span className="font-display font-extrabold text-2xl text-rose-400">
            {farmerStreak.currentStreak} <span className="text-sm font-bold text-white">Days</span>
          </span>
        </div>
      </div>

      {/* 7-Day Visual Progress Track */}
      <div className="space-y-2">
        <div className="flex justify-between items-center text-xs">
          <span className="text-neutral-300 font-semibold">Weekly Milestone Tracker</span>
          <span className="text-emerald-300 font-bold font-mono">
            {currentStreakMod} / 7 Days Completed
          </span>
        </div>

        <div className="grid grid-cols-7 gap-2">
          {daysOfWeek.map((day, idx) => {
            const isFilled = idx < currentStreakMod;
            const isCurrent = idx === currentStreakMod - 1;
            return (
              <div
                key={idx}
                className={`py-2.5 rounded-xl border flex flex-col items-center justify-center text-xs font-bold transition-all ${
                  isFilled
                    ? "bg-gradient-to-b from-rose-500/30 to-amber-500/20 border-rose-400/60 text-white shadow-md shadow-rose-500/10"
                    : "bg-black/40 border-white/10 text-neutral-500"
                } ${isCurrent ? "ring-2 ring-amber-400 scale-105" : ""}`}
              >
                <span className="text-[10px] opacity-75">{day}</span>
                <span className="text-xs mt-0.5">{isFilled ? "🔥" : "⚪"}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Streak Milestones & Reward Unlocks */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
        <div className="p-3 rounded-2xl bg-black/40 border border-white/10 flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0 border border-amber-400/30">
            <Coins className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <span className="text-xs font-bold text-white block">7-Day Milestone</span>
            <span className="text-[10px] text-emerald-300 font-semibold">+100 KrishiMitra Credits</span>
          </div>
        </div>

        <div className="p-3 rounded-2xl bg-black/40 border border-white/10 flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-sky-500/20 text-sky-400 flex items-center justify-center shrink-0 border border-sky-400/30">
            <Trophy className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <span className="text-xs font-bold text-white block">14-Day Milestone</span>
            <span className="text-[10px] text-sky-300 font-semibold">+250 Credits + Badge</span>
          </div>
        </div>

        <div className="p-3 rounded-2xl bg-black/40 border border-white/10 flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center shrink-0 border border-purple-400/30">
            <Gift className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <span className="text-xs font-bold text-white block">30-Day Master</span>
            <span className="text-[10px] text-purple-300 font-semibold">Free Soil Test Coupon</span>
          </div>
        </div>
      </div>

    </div>
  );
};
