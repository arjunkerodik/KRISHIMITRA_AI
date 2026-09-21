"use client";

import React from "react";
import { FarmerSidebar } from "@/components/FarmerSidebar";
import { MandiComparisonTable } from "@/components/MandiComparisonTable";
import {
  Store,
  TrendingUp,
  Coins,
  Sparkles,
  Info,
  Calendar,
  Truck,
} from "lucide-react";

export default function MarketRecommendationPage() {
  return (
    <div className="min-h-screen flex bg-transparent text-white">
      <div className="hidden lg:block w-64 shrink-0">
        <div className="fixed top-16 bottom-0 w-64">
          <FarmerSidebar />
        </div>
      </div>

      <div className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="p-6 rounded-3xl bg-black/45 backdrop-blur-xl border border-white/20 shadow-xl flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-brand-500 text-white flex items-center justify-center shadow-lg shadow-brand-500/30">
              <Store className="w-6 h-6" />
            </div>
            <div>
              <h1 className="font-display font-bold text-2xl text-white tracking-tight drop-shadow-md">
                Mandi Price Arbitrage &quot;Where Should I Sell?&quot;
              </h1>
              <p className="text-xs sm:text-sm text-neutral-300">
                Comparing APMC modal rates with highway distance & freight expenses (Section 22 & 23).
              </p>
            </div>
          </div>
        </div>

        {/* Mandi Comparison Table Component */}
        <MandiComparisonTable />

        {/* 15-Day ML Price Forecasting Trend (Section 23) */}
        <div className="p-6 rounded-3xl bg-black/45 backdrop-blur-xl border border-white/20 shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-brand-300">
                Time-Series ML Pipeline
              </span>
              <h3 className="font-display font-bold text-base text-white">
                15-Day Tomato Price Forecast (Bengaluru & Kolar APMC)
              </h3>
            </div>
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/30 text-emerald-300 border border-emerald-400/30">
              Upward Trend Expected (+8.5%)
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-2xl bg-black/35 border border-white/15">
              <span className="text-xs font-bold text-neutral-400">Current Week Median</span>
              <div className="font-display font-bold text-2xl text-white mt-1">
                ₹2,650 <span className="text-xs font-normal text-neutral-400">/ qtl</span>
              </div>
              <span className="text-[10px] text-emerald-400 font-semibold">Active harvest arrivals</span>
            </div>

            <div className="p-4 rounded-2xl bg-black/35 border border-white/15">
              <span className="text-xs font-bold text-neutral-400">Next 7-10 Days Forecast</span>
              <div className="font-display font-bold text-2xl text-brand-400 mt-1">
                ₹2,750 - ₹2,920
              </div>
              <span className="text-[10px] text-neutral-300">Due to pre-festival urban procurement demand</span>
            </div>

            <div className="p-4 rounded-2xl bg-black/35 border border-white/15">
              <span className="text-xs font-bold text-neutral-400">AI Confidence Interval</span>
              <div className="font-display font-bold text-2xl text-white mt-1">
                87.2%
              </div>
              <span className="text-[10px] text-neutral-300">Based on 5-year APMC Agmarknet records</span>
            </div>
          </div>

          <div className="pt-2 text-[11px] text-neutral-300 flex items-center gap-1.5">
            <Info className="w-3.5 h-3.5 text-brand-400 shrink-0" />
            <span>Price forecasts are algorithmic estimates based on historical seasonality and should not be treated as legally guaranteed prices.</span>
          </div>
        </div>

      </div>
    </div>
  );
}
