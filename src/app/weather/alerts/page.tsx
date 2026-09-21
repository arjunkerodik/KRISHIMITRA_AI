"use client";

import React from "react";
import Link from "next/link";
import { FarmerSidebar } from "@/components/FarmerSidebar";
import { 
  CloudRain, 
  AlertTriangle, 
  CheckCircle2, 
  ArrowRight,
  ShieldCheck,
  ChevronLeft,
} from "lucide-react";
import { useApp } from "@/lib/store";

export default function WeatherAlertsPage() {
  const { activeFarm } = useApp();

  const extremeAlerts = [
    {
      id: "al-rain",
      type: "Heavy Convective Rainfall Warning",
      level: "Orange Alert (IMD)",
      validTill: "Today 16:00 - 21:00 IST",
      expectedMetrics: "35 - 55 mm Rainfall with 45 km/h Wind Gusts",
      impactCrops: "Tomato (Plot 1) - Risk of fruit splitting, bacterial spot & soil waterlogging",
      immediateActions: [
        "HOLD all scheduled drip irrigation immediately (save 400L pump power).",
        "Clear drainage furrows between raised beds to ensure zero standing water.",
        "Postpone Mancozeb / fungicide spraying until rain cessation to prevent chemical wash-off."
      ]
    },
    {
      id: "al-heat",
      type: "High Daytime Thermal Stress Advisory",
      level: "Yellow Alert",
      validTill: "Next 3 Days (11:30 - 15:30 IST daily)",
      expectedMetrics: "Day Temp: 34.5°C (4°C above seasonal normal)",
      impactCrops: "Tomato & Capsicum - High flower abortion & blossom end rot risk",
      immediateActions: [
        "Deliver light morning drip pulse (20 mins) before 08:30 AM to maintain root turgor.",
        "Ensure mulch coverage is intact across all beds to suppress root zone overheating."
      ]
    }
  ];

  return (
    <div className="min-h-screen flex bg-transparent">
      <div className="hidden lg:block w-64 shrink-0">
        <div className="fixed top-16 bottom-0 w-64">
          <FarmerSidebar />
        </div>
      </div>

      <div className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="bg-black/50 backdrop-blur-xl rounded-3xl border border-white/20 p-6 shadow-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-white">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                IMD Radar Warning System
              </span>
              <span className="text-xs text-white/70">{activeFarm.district} District</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-1">
              Weather Warnings & Crop Protocols
            </h1>
          </div>

          <Link
            href="/weather"
            className="inline-flex items-center gap-1 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold transition-all border border-white/15 cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Back to 7-Day Forecast</span>
          </Link>
        </div>

        {/* Live Alerts List */}
        <div className="space-y-6">
          {extremeAlerts.map((alert) => (
            <div
              key={alert.id}
              className="bg-black/50 backdrop-blur-xl rounded-3xl p-6 border border-white/20 shadow-2xl space-y-4 text-white hover:border-amber-500/40 transition-all"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-white/10">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/30 shadow-sm">
                    <AlertTriangle className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-300 border border-amber-500/30 uppercase">
                      {alert.level}
                    </span>
                    <h3 className="text-base font-bold text-white mt-1">
                      {alert.type}
                    </h3>
                  </div>
                </div>
                <span className="text-xs text-white/60 font-medium">{alert.validTill}</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="p-3.5 rounded-2xl bg-black/40 border border-white/10">
                  <span className="text-white/50 font-semibold block mb-0.5">Forecasted Intensity:</span>
                  <span className="text-white font-bold">{alert.expectedMetrics}</span>
                </div>
                <div className="p-3.5 rounded-2xl bg-black/40 border border-white/10">
                  <span className="text-white/50 font-semibold block mb-0.5">Affected Crops:</span>
                  <span className="text-white font-semibold">{alert.impactCrops}</span>
                </div>
              </div>

              <div>
                <h4 className="text-xs font-bold text-amber-300 uppercase tracking-wider mb-2">
                  Immediate Required Field Actions:
                </h4>
                <ul className="space-y-1.5 text-xs text-white/80">
                  {alert.immediateActions.map((act, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span>{act}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
