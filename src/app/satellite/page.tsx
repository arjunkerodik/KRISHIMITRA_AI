"use client";

import React from "react";
import { FarmerSidebar } from "@/components/FarmerSidebar";
import { DigitalTwinViewer } from "@/components/DigitalTwinViewer";
import {
  Satellite,
  Camera,
  Wind,
  CheckCircle2,
  AlertTriangle,
  Info,
  Sparkles,
} from "lucide-react";

export default function SatellitePage() {
  return (
    <div className="min-h-screen flex bg-transparent">
      <div className="hidden lg:block w-64 shrink-0">
        <div className="fixed top-16 bottom-0 w-64">
          <FarmerSidebar />
        </div>
      </div>

      <div className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto text-white">
        <div className="p-6 rounded-3xl bg-black/45 backdrop-blur-xl border border-white/20 shadow-2xl flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-sky-500 text-white flex items-center justify-center shadow-lg">
              <Satellite className="w-6 h-6" />
            </div>
            <div>
              <h1 className="font-display font-bold text-2xl text-white tracking-tight">
                Satellite NDVI & Drone Intelligence
              </h1>
              <p className="text-xs sm:text-sm text-white/70">
                Sentinel-2 multispectral vegetation index & drone scout scheduler (Section 30 & 67).
              </p>
            </div>
          </div>
        </div>

        {/* Digital Twin / NDVI Component */}
        <DigitalTwinViewer />

        {/* Drone Spray Scheduling Helper (Section 67) */}
        <div className="p-6 rounded-3xl bg-black/45 backdrop-blur-xl border border-white/20 shadow-2xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-brand-300">
                Drone Operations Safety Module
              </span>
              <h3 className="font-display font-bold text-base text-white">
                🚁 Agri-Drone Spraying Window Evaluator
              </h3>
            </div>
            <span className="text-xs font-bold px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-400/30">
              ⚠️ Unfavorable Wind Today
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-amber-950/40 border border-amber-500/40 text-xs space-y-2 backdrop-blur-md">
            <div className="flex items-center gap-2 text-amber-300 font-bold">
              <Wind className="w-4 h-4 text-amber-400" />
              <span>Drone Flight Warning: Wind speed is currently 22 km/h (Safe threshold is &lt; 15 km/h).</span>
            </div>
            <p className="text-white/80 leading-relaxed">
              Operating drone sprayers today will result in 40%+ droplet drift outside plot boundaries and rain at 4:30 PM will wash off active ingredients.
            </p>
            <span className="text-brand-300 font-bold block pt-1">
              👉 Next Safe Drone Window: Thursday 06:30 AM to 09:30 AM (Wind: 8 km/h, Clear Sky).
            </span>
          </div>
        </div>

      </div>
    </div>
  );
}
