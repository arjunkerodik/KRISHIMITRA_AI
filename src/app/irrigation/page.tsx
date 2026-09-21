"use client";

import React from "react";
import { FarmerSidebar } from "@/components/FarmerSidebar";
import { useApp } from "@/lib/store";
import {
  Droplets,
  CloudRain,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  Leaf,
  Info,
  Clock,
} from "lucide-react";

export default function IrrigationPage() {
  const { activeFarm } = useApp();

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
            <div className="w-10 h-10 rounded-2xl bg-sky-500 text-white flex items-center justify-center shadow-lg shadow-sky-500/30">
              <Droplets className="w-6 h-6" />
            </div>
            <div>
              <h1 className="font-display font-bold text-2xl text-white tracking-tight drop-shadow-md">
                Smart Irrigation & Water Intelligence
              </h1>
              <p className="text-xs sm:text-sm text-neutral-300">
                Evapotranspiration (ET0) & rain-synchronized drip valve scheduling (Section 20 & 66).
              </p>
            </div>
          </div>
        </div>

        {/* Irrigation Decision Card Banner */}
        <div className="p-6 rounded-3xl bg-gradient-to-r from-sky-900/80 via-sky-800/80 to-blue-900/80 backdrop-blur-xl border border-sky-400/30 text-white shadow-2xl space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-sky-300">
                Today&apos;s Automated Valve Advisory ({activeFarm.name})
              </span>
              <h2 className="font-display font-bold text-3xl mt-1 text-white drop-shadow-md">
                ❌ SKIP AFTERNOON IRRIGATION
              </h2>
            </div>
            <div className="p-4 rounded-2xl bg-black/40 border border-sky-400/30 text-center">
              <span className="font-display font-extrabold text-2xl text-amber-300">4,200 L</span>
              <span className="text-[10px] text-sky-200 block uppercase font-bold">Borewell Water Saved</span>
            </div>
          </div>

          <p className="text-xs sm:text-sm text-sky-100 leading-relaxed max-w-2xl">
            18.5 mm rainfall is forecasted around 4:30 PM today with an 84% probability. Soil moisture in {activeFarm.currentCrop} root zone is currently at 68% (optimal). Operating the drip line will cause root saturation and fertilizer leaching.
          </p>

          <div className="pt-2 flex items-center gap-4 text-xs font-semibold text-sky-200">
            <span className="flex items-center gap-1.5">
              <Clock className="w-4 h-4" /> Next Evaluation: Tomorrow 08:00 AM
            </span>
            <span className="flex items-center gap-1.5 text-emerald-300">
              <Leaf className="w-4 h-4" /> +15 Water Conservation Credits Earned
            </span>
          </div>
        </div>

        {/* Real-time Field Water Parameters */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-5 rounded-2xl bg-black/45 backdrop-blur-xl border border-white/20 shadow-xl">
            <span className="text-xs font-bold text-neutral-400 uppercase">Current Root Moisture</span>
            <div className="font-display font-bold text-3xl text-sky-400 mt-1">
              68%
            </div>
            <p className="text-xs text-neutral-300 mt-1">Field capacity threshold is 65%</p>
          </div>

          <div className="p-5 rounded-2xl bg-black/45 backdrop-blur-xl border border-white/20 shadow-xl">
            <span className="text-xs font-bold text-neutral-400 uppercase">Crop Evapotranspiration (ET0)</span>
            <div className="font-display font-bold text-3xl text-white mt-1">
              4.2 <span className="text-xs font-normal text-neutral-400">mm/day</span>
            </div>
            <p className="text-xs text-neutral-300 mt-1">Tomato Flowering Stage Demand</p>
          </div>

          <div className="p-5 rounded-2xl bg-black/45 backdrop-blur-xl border border-white/20 shadow-xl">
            <span className="text-xs font-bold text-neutral-400 uppercase">Cumulative Season Savings</span>
            <div className="font-display font-bold text-3xl text-emerald-400 mt-1">
              124,000 L
            </div>
            <p className="text-xs text-neutral-300 mt-1">₹2,840 Saved in electricity & pumping</p>
          </div>
        </div>

      </div>
    </div>
  );
}
