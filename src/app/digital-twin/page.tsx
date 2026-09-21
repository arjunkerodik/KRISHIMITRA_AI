"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  Layers, 
  Sparkles, 
  Satellite, 
  Plane, 
  Droplets, 
  Activity, 
  Thermometer, 
  Wind, 
  Sun, 
  RefreshCw,
  Eye,
  Sliders,
  CheckCircle2,
  AlertTriangle
} from "lucide-react";
import { useApp } from "@/lib/store";
import { DigitalTwinViewer } from "@/components/DigitalTwinViewer";

export default function DigitalTwinPage() {
  const { language, activeFarm } = useApp();
  const [selectedOverlay, setSelectedOverlay] = useState<"all" | "ndvi" | "moisture" | "stress">("all");

  return (
    <div className="min-h-screen bg-transparent text-white py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Breadcrumb Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 p-6 rounded-3xl bg-black/45 backdrop-blur-xl border border-white/20 shadow-2xl">
          <div>
            <div className="flex items-center gap-2 text-xs font-medium text-neutral-300 mb-1">
              <Link href="/dashboard" className="hover:text-brand-300">Dashboard</Link>
              <span>/</span>
              <span className="text-white font-semibold">Field Digital Twin</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-display font-bold text-white flex items-center gap-3">
              <Layers className="w-8 h-8 text-brand-400" />
              Plot Digital Twin & Telemetry Visualizer
            </h1>
            <p className="text-sm text-neutral-200 mt-1">
              High-resolution 4-zone micro-climate modeling, drone multispectral orthomosaics, and real-time soil moisture sensors.
            </p>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            <Link
              href="/satellite"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 text-xs font-semibold text-white transition-all shadow-md"
            >
              <Satellite className="w-4 h-4 text-sky-400" />
              Sentinel-2 L2A Satellite Imagery
            </Link>
            <Link
              href="/irrigation"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 border border-brand-400/40 text-white text-xs font-semibold transition-all shadow-lg"
            >
              <Droplets className="w-4 h-4" />
              Smart Irrigation Controller
            </Link>
          </div>
        </div>

        {/* Digital Twin 4-Zone Live Component */}
        <DigitalTwinViewer />

        {/* Sensor Array Telemetry Matrix */}
        <div className="bg-black/45 backdrop-blur-xl rounded-3xl p-6 sm:p-8 border border-white/20 shadow-2xl space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/15">
            <div>
              <h3 className="text-xl font-bold font-display text-white flex items-center gap-2">
                <Activity className="w-5 h-5 text-brand-400" />
                IoT Soil Probe & Canopy Sensor Telemetry
              </h3>
              <p className="text-xs text-neutral-300 mt-1">
                Field nodes: LoRaWAN 865 MHz gateway transmitting every 15 minutes.
              </p>
            </div>
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-300 bg-emerald-950/60 px-3 py-1.5 rounded-xl border border-emerald-500/40">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
              Gateway Online: 4/4 Probes Synced
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-5 rounded-2xl bg-black/40 border border-white/15 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-neutral-300 uppercase tracking-wider">Zone A (North Ridge)</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-emerald-950/70 border border-emerald-500/40 text-emerald-200">Healthy</span>
              </div>
              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-neutral-300">Soil Moisture (15cm):</span>
                  <span className="font-bold text-white">68%</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-neutral-300">Soil Temp (10cm):</span>
                  <span className="font-bold text-white">24.2°C</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-neutral-300">Electrical Cond. (EC):</span>
                  <span className="font-bold text-white">0.42 dS/m</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-neutral-300">Battery Level:</span>
                  <span className="font-bold text-emerald-400">94%</span>
                </div>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-black/40 border border-white/15 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-neutral-300 uppercase tracking-wider">Zone B (East Incline)</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-amber-950/70 border border-amber-500/40 text-amber-200">Dry Edge</span>
              </div>
              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-neutral-300">Soil Moisture (15cm):</span>
                  <span className="font-bold text-amber-300">42% (Low)</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-neutral-300">Soil Temp (10cm):</span>
                  <span className="font-bold text-white">26.8°C</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-neutral-300">Electrical Cond. (EC):</span>
                  <span className="font-bold text-white">0.38 dS/m</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-neutral-300">Battery Level:</span>
                  <span className="font-bold text-emerald-400">89%</span>
                </div>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-black/40 border border-white/15 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-neutral-300 uppercase tracking-wider">Zone C (South Valley)</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-red-950/70 border border-red-500/40 text-red-200">Stress Detected</span>
              </div>
              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-neutral-300">Soil Moisture (15cm):</span>
                  <span className="font-bold text-white">74%</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-neutral-300">Canopy Temp (IR):</span>
                  <span className="font-bold text-red-300">29.1°C (Fever)</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-neutral-300">NDVI Stress Index:</span>
                  <span className="font-bold text-red-300">0.54 (Drop)</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-neutral-300">Battery Level:</span>
                  <span className="font-bold text-emerald-400">91%</span>
                </div>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-black/40 border border-white/15 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-neutral-300 uppercase tracking-wider">Zone D (West Flat)</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-emerald-950/70 border border-emerald-500/40 text-emerald-200">Optimal</span>
              </div>
              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-neutral-300">Soil Moisture (15cm):</span>
                  <span className="font-bold text-white">65%</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-neutral-300">Soil Temp (10cm):</span>
                  <span className="font-bold text-white">23.9°C</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-neutral-300">Electrical Cond. (EC):</span>
                  <span className="font-bold text-white">0.45 dS/m</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-neutral-300">Battery Level:</span>
                  <span className="font-bold text-emerald-400">96%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
