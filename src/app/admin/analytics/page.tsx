"use client";

import React from "react";
import Link from "next/link";
import { 
  BarChart3, 
  Download 
} from "lucide-react";

export default function AdminAnalyticsPage() {

  return (
    <div className="min-h-screen bg-transparent text-white py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 p-6 rounded-3xl bg-black/45 backdrop-blur-xl border border-white/20 shadow-2xl">
          <div>
            <div className="flex items-center gap-2 text-xs font-medium text-neutral-300 mb-1">
              <Link href="/admin" className="hover:text-brand-300">Admin Portal</Link>
              <span>/</span>
              <span className="text-white font-semibold">Macro Agricultural Analytics</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-display font-bold text-white flex items-center gap-3">
              <BarChart3 className="w-8 h-8 text-brand-400" />
              Statewide Crop Production & Hydro-Agro Analytics
            </h1>
            <p className="text-sm text-neutral-200 mt-1">
              District-level yield forecasting, ground water table depletion monitoring, and crop diversification heatmaps.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 border border-brand-400/40 text-white text-xs font-semibold transition-all shadow-lg">
              <Download className="w-3.5 h-3.5" />
              Download Policy Brief (PDF)
            </button>
          </div>
        </div>

        {/* Macro KPIs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-2xl bg-black/45 backdrop-blur-xl border border-white/20 shadow-2xl">
            <span className="text-xs font-medium text-neutral-300">Total Cultivated Area (Kolar)</span>
            <div className="mt-2 text-2xl font-bold font-display text-white">
              1,84,500 Ha
            </div>
            <p className="text-xs text-brand-300 mt-1">Horticulture: 48.2%</p>
          </div>

          <div className="p-5 rounded-2xl bg-black/45 backdrop-blur-xl border border-white/20 shadow-2xl">
            <span className="text-xs font-medium text-neutral-300">Projected Tomato Yield</span>
            <div className="mt-2 text-2xl font-bold font-display text-emerald-400">
              4.2 Lakh MT
            </div>
            <p className="text-xs text-neutral-300 mt-1">+6.4% vs Previous Kharif</p>
          </div>

          <div className="p-5 rounded-2xl bg-black/45 backdrop-blur-xl border border-white/20 shadow-2xl">
            <span className="text-xs font-medium text-neutral-300">Average Water Table Depth</span>
            <div className="mt-2 text-2xl font-bold font-display text-amber-300">
              112.4 m
            </div>
            <p className="text-xs text-neutral-300 mt-1">Recharge: KC Valley treated water</p>
          </div>

          <div className="p-5 rounded-2xl bg-black/45 backdrop-blur-xl border border-white/20 shadow-2xl">
            <span className="text-xs font-medium text-neutral-300">PMFBY Claim Settlement Ratio</span>
            <div className="mt-2 text-2xl font-bold font-display text-white">
              98.4%
            </div>
            <p className="text-xs text-emerald-300 mt-1">Avg 14-day turnaround via AI</p>
          </div>
        </div>

        {/* Visual Charts Simulation */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-black/45 backdrop-blur-xl rounded-3xl p-6 sm:p-8 border border-white/20 shadow-2xl space-y-4">
            <h3 className="text-lg font-bold font-display text-white">
              Kolar District Crop Acreage Breakdown
            </h3>
            <div className="space-y-3 pt-2">
              <div>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span>Tomato & Solanaceous (Horticulture)</span>
                  <span className="font-mono text-neutral-300">42% (77,490 Ha)</span>
                </div>
                <div className="w-full h-3 rounded-full bg-black/40 border border-white/10 overflow-hidden">
                  <div className="h-full bg-red-500 rounded-full" style={{ width: "42%" }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span>Groundnut & Oilseeds</span>
                  <span className="font-mono text-neutral-300">24% (44,280 Ha)</span>
                </div>
                <div className="w-full h-3 rounded-full bg-black/40 border border-white/10 overflow-hidden">
                  <div className="h-full bg-amber-500 rounded-full" style={{ width: "24%" }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span>Finger Millet (Ragi) & Cereals</span>
                  <span className="font-mono text-neutral-300">22% (40,590 Ha)</span>
                </div>
                <div className="w-full h-3 rounded-full bg-black/40 border border-white/10 overflow-hidden">
                  <div className="h-full bg-brand-500 rounded-full" style={{ width: "22%" }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span>Mulberry & Sericulture</span>
                  <span className="font-mono text-neutral-300">12% (22,140 Ha)</span>
                </div>
                <div className="w-full h-3 rounded-full bg-black/40 border border-white/10 overflow-hidden">
                  <div className="h-full bg-emerald-500 rounded-full" style={{ width: "12%" }}></div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-black/45 backdrop-blur-xl rounded-3xl p-6 sm:p-8 border border-white/20 shadow-2xl space-y-4">
            <h3 className="text-lg font-bold font-display text-white">
              AI Decision Engine Adoption & Yield Uplift
            </h3>
            <div className="p-4 rounded-2xl bg-brand-950/60 border border-brand-400/40 text-xs space-y-2">
              <span className="font-bold text-brand-300 block">Agronomic Impact Summary:</span>
              <p className="text-neutral-200">
                Farmers following KrishiMitra AI&apos;s <strong>Today&apos;s Farm Plan</strong> daily action items achieved an average of <strong>+22.4% net yield gain</strong> and <strong>-28% reduction in unnecessary chemical spray costs</strong>.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
