"use client";

import React from "react";
import { FarmerSidebar } from "@/components/FarmerSidebar";
import {
  Leaf,
  Droplets,
} from "lucide-react";

export default function CarbonWaterPage() {

  return (
    <div className="min-h-screen flex bg-transparent text-white">
      <div className="hidden lg:block w-64 shrink-0">
        <div className="fixed top-16 bottom-0 w-64">
          <FarmerSidebar />
        </div>
      </div>

      <div className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
        <div className="p-6 rounded-3xl bg-black/45 backdrop-blur-xl border border-white/20 shadow-2xl flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-brand-500/80 border border-brand-400/50 text-white flex items-center justify-center shadow-lg">
              <Leaf className="w-6 h-6" />
            </div>
            <div>
              <h1 className="font-display font-bold text-2xl text-white tracking-tight drop-shadow-sm">
                Carbon Credits & Water Conservation Tracker
              </h1>
              <p className="text-xs sm:text-sm text-neutral-200">
                Verifiable regenerative farming metrics & sustainability grants (Section 65 & 66).
              </p>
            </div>
          </div>
        </div>

        {/* 2 Big Credit Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Carbon Card */}
          <div className="p-6 rounded-3xl bg-black/45 backdrop-blur-xl border border-white/20 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Leaf className="w-5 h-5 text-emerald-400" />
                <h3 className="font-display font-bold text-base text-white">
                  Soil Carbon Sequestration
                </h3>
              </div>
              <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-brand-950/60 text-brand-300 border border-brand-400/40">
                Estimated Score
              </span>
            </div>

            <div className="flex items-baseline gap-2">
              <span className="font-display font-extrabold text-4xl text-brand-300">
                2.84
              </span>
              <span className="text-xs text-neutral-300 font-bold">Tons CO2e Sequestered / Year</span>
            </div>

            <p className="text-xs text-neutral-200">
              Practices logged: Drip fertigation, organic vermicompost incorporation (2 tons), and minimum tillage in Plot 1.
            </p>

            <div className="p-3 rounded-xl bg-black/40 border border-white/15 text-xs flex items-center justify-between">
              <span className="text-neutral-300">Estimated Carbon Credit Value:</span>
              <span className="font-bold text-brand-300 font-mono">₹3,400 / Year</span>
            </div>
          </div>

          {/* Water Conservation Card */}
          <div className="p-6 rounded-3xl bg-black/45 backdrop-blur-xl border border-white/20 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Droplets className="w-5 h-5 text-sky-400" />
                <h3 className="font-display font-bold text-base text-white">
                  Water Stewardship Rebates
                </h3>
              </div>
              <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-sky-950/60 text-sky-300 border border-sky-400/40">
                Verified Savings
              </span>
            </div>

            <div className="flex items-baseline gap-2">
              <span className="font-display font-extrabold text-4xl text-sky-300">
                124,000
              </span>
              <span className="text-xs text-neutral-300 font-bold">Litres Borewell Water Saved</span>
            </div>

            <p className="text-xs text-neutral-200">
              Achieved via 28 automated rainfall-synchronized irrigation hold decisions this season.
            </p>

            <div className="p-3 rounded-xl bg-black/40 border border-white/15 text-xs flex items-center justify-between">
              <span className="text-neutral-300">Energy & Pumping Cost Saved:</span>
              <span className="font-bold text-sky-300 font-mono">₹2,840</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
