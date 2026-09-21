"use client";

import React, { useState } from "react";
import Link from "next/link";
import { FarmerSidebar } from "@/components/FarmerSidebar";
import { InteractiveFarmMap } from "@/components/InteractiveFarmMap";
import { useApp } from "@/lib/store";
import {
  Map,
  Layers,
  Compass,
  Sparkles,
  Satellite,
  Droplets,
  FlaskConical,
  AlertTriangle,
  ArrowRight,
  ScanLine,
  Bot,
  Store,
  Warehouse,
  Wind,
  ShieldAlert,
} from "lucide-react";

export default function FarmMapPage() {
  const { activeFarm } = useApp();
  const [activeLayerMode, setActiveLayerMode] = useState<"gis" | "ndvi" | "soil_npk" | "risk">("gis");

  return (
    <div className="min-h-screen flex bg-transparent text-white">
      <div className="hidden lg:block w-64 shrink-0">
        <div className="fixed top-16 bottom-0 w-64">
          <FarmerSidebar />
        </div>
      </div>

      <div className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="p-6 rounded-3xl bg-black/45 backdrop-blur-xl border border-white/20 shadow-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-brand-500/80 border border-brand-400/50 text-white flex items-center justify-center shadow-lg">
              <Map className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-brand-500/20 text-brand-300 border border-brand-500/30">
                  SIH26197 GIS & Remote Sensing Map
                </span>
                <span className="text-xs text-neutral-300">
                  Plot: <strong className="text-white">{activeFarm.name}</strong> ({activeFarm.areaAcres} Ac)
                </span>
              </div>
              <h1 className="font-display font-black text-2xl sm:text-3xl text-white tracking-tight mt-0.5">
                GIS Smart Farm Map & Infrastructure
              </h1>
              <p className="text-xs sm:text-sm text-neutral-200">
                Visual boundary analytics, individual crop plots, soil heatmaps, APMC mandis, and cold chain facilities.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <Link
              href="/satellite"
              className="px-4 py-2.5 rounded-xl bg-purple-900/60 hover:bg-purple-800/80 border border-purple-400/40 text-purple-200 font-bold text-xs flex items-center gap-1.5 transition-colors shadow-lg"
            >
              <Satellite className="w-4 h-4 text-purple-300" />
              <span>Sentinel-2 NDVI</span>
            </Link>
            <Link
              href="/agricare"
              className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-lg border border-emerald-400/40 transition-all"
            >
              <ScanLine className="w-4 h-4 text-emerald-300" />
              <span>AgriCare Scanner</span>
            </Link>
          </div>
        </div>

        {/* Layer Mode Selector Ribbon */}
        <div className="p-3 rounded-2xl bg-black/45 backdrop-blur-xl border border-white/20 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 font-bold text-neutral-300">
            <Layers className="w-4 h-4 text-brand-400" />
            <span>Map Visualization Layer:</span>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {[
              { id: "gis", label: "🗺️ Infrastructure & Boundaries" },
              { id: "ndvi", label: "🛰️ Satellite Vegetation (NDVI)" },
              { id: "soil_npk", label: "🧪 Soil NPK Fertility Map" },
              { id: "risk", label: "⚠️ Disease & Rain Risk Zones" },
            ].map((m) => (
              <button
                key={m.id}
                onClick={() => setActiveLayerMode(m.id as any)}
                className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
                  activeLayerMode === m.id
                    ? "bg-brand-600 text-white shadow-md border border-brand-400/50"
                    : "bg-white/10 hover:bg-white/20 text-neutral-300"
                }`}
              >
                {m.label}
              </button>
            ))}
          </div>
        </div>

        {/* Interactive GIS Map Visualizer */}
        <InteractiveFarmMap />

        {/* Location-Based Farm Recommendations Panel (Section 3) */}
        <div className="p-6 rounded-3xl bg-black/45 backdrop-blur-xl border border-white/20 text-white shadow-2xl space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-400" />
              Spatial AI Recommendations for {activeFarm.village} ({activeFarm.district})
            </h2>
            <span className="text-xs text-brand-300 font-bold">Agro-Ecological Zone 5 (Eastern Dry Zone)</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-2xl bg-black/40 border border-brand-500/30 space-y-1.5">
              <span className="text-xs font-bold text-brand-300 uppercase tracking-wider block">
                Soil & Micro-Zone Context
              </span>
              <p className="text-xs text-neutral-200">
                Red sandy loam profile with 0.68% Organic Carbon. High permeability protects against standing water, but requires split potassium fertigation.
              </p>
              <Link href="/soil" className="text-[11px] text-brand-400 font-bold hover:underline flex items-center gap-1 mt-2">
                View Soil Health Card <ArrowRight className="w-3 h-3" />
              </Link>
            </div>

            <div className="p-4 rounded-2xl bg-black/40 border border-sky-500/30 space-y-1.5">
              <span className="text-xs font-bold text-sky-300 uppercase tracking-wider block">
                Cold Storage Proximity
              </span>
              <p className="text-xs text-neutral-200">
                Narasapura Agro Cold Chain facility located <strong>4.5 km</strong> away. Has 450 MT reserved horticultural chambers at ₹1.20/kg/month.
              </p>
              <Link href="/farm-to-market" className="text-[11px] text-sky-400 font-bold hover:underline flex items-center gap-1 mt-2">
                Book Cold Chamber Slot <ArrowRight className="w-3 h-3" />
              </Link>
            </div>

            <div className="p-4 rounded-2xl bg-black/40 border border-amber-500/30 space-y-1.5">
              <span className="text-xs font-bold text-amber-300 uppercase tracking-wider block">
                Best Mandi Route
              </span>
              <p className="text-xs text-neutral-200">
                NH-75 expressway gives direct 68 km access to Yeshwanthpur APMC. Current price spread yields <strong>+₹240/Qtl net profit</strong> over local yard.
              </p>
              <Link href="/market/recommendation" className="text-[11px] text-amber-400 font-bold hover:underline flex items-center gap-1 mt-2">
                View Price Comparison <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
