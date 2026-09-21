"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  FlaskConical, 
  UploadCloud, 
  Sparkles, 
  CheckCircle2, 
  AlertTriangle, 
  ArrowRight, 
  Calculator, 
  Download, 
  FileSpreadsheet, 
  RotateCcw,
  Layers,
  Leaf
} from "lucide-react";
import { useApp } from "@/lib/store";
import { SoilHealthCard } from "@/components/SoilHealthCard";

export default function SoilReportPage() {
  const { language, activeFarm } = useApp();
  const [cropType, setCropType] = useState("Tomato (Hybrid F1)");
  const [plotArea, setPlotArea] = useState(2.5);
  const [soilN, setSoilN] = useState(210);
  const [soilP, setSoilP] = useState(18);
  const [soilK, setSoilK] = useState(290);
  const [targetYield, setTargetYield] = useState(28); // tonnes/acre

  // Stoichiometric calculations
  // Benchmark for tomato: 280 N, 35 P, 260 K for 30t/ac target yield
  const nDeficit = Math.max(0, 280 - soilN);
  const pDeficit = Math.max(0, 35 - soilP);
  const kDeficit = Math.max(0, 260 - soilK);

  // Fertilizer recommendations:
  // Urea (46% N) -> nDeficit / 0.46
  // DAP (18% N, 46% P)
  // MOP (60% K2O)
  const dapReqKgPerAc = Math.round(pDeficit > 0 ? (pDeficit / 0.46) : 0);
  const nSuppliedByDap = Math.round(dapReqKgPerAc * 0.18);
  const remainingN = Math.max(0, nDeficit - nSuppliedByDap);
  const ureaReqKgPerAc = Math.round(remainingN / 0.46);
  const mopReqKgPerAc = Math.round(kDeficit > 0 ? (kDeficit / 0.60) : 0);

  const totalDapKg = Math.round(dapReqKgPerAc * plotArea);
  const totalUreaKg = Math.round(ureaReqKgPerAc * plotArea);
  const totalMopKg = Math.round(mopReqKgPerAc * plotArea);

  const totalCost = Math.round(
    (totalUreaKg * 6.5) + (totalDapKg * 27) + (totalMopKg * 34)
  );

  return (
    <div className="min-h-screen bg-transparent py-8 px-4 sm:px-6 lg:px-8 text-white">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Breadcrumb & Heading */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-medium text-white/60 mb-1">
              <Link href="/dashboard" className="hover:text-brand-300">Dashboard</Link>
              <span>/</span>
              <Link href="/soil" className="hover:text-brand-300">Soil Hub</Link>
              <span>/</span>
              <span className="text-white font-semibold">Stoichiometric Fertilizer Engine</span>
            </div>
            <h1 className="text-3xl font-display font-bold text-white flex items-center gap-3">
              <Calculator className="w-8 h-8 text-brand-400" />
              Soil Stoichiometric Advisory & OCR Calculator
            </h1>
            <p className="text-sm text-white/70 mt-1">
              Precision NPK balancing based on Soil Health Card data, crop uptake constants, and fertilizer stoichiometric equivalents.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/soil"
              className="px-4 py-2 rounded-xl bg-black/40 hover:bg-white/10 border border-white/20 text-xs font-semibold text-white transition-all backdrop-blur-md"
            >
              Back to Soil Hub
            </Link>
          </div>
        </div>

        {/* Top Interactive Component */}
        <SoilHealthCard />

        {/* Stoichiometric Fertilizer Dosimetry Workbench */}
        <div className="bg-black/45 backdrop-blur-xl rounded-3xl p-6 sm:p-8 border border-white/20 shadow-2xl space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
            <div>
              <div className="flex items-center gap-2">
                <span className="p-2 rounded-xl bg-brand-500/20 text-brand-300">
                  <Sparkles className="w-5 h-5" />
                </span>
                <h3 className="text-xl font-bold font-display text-white">
                  Custom Fertilizer Dosimetry & Basal / Top-Dress Splitter
                </h3>
              </div>
              <p className="text-xs text-white/70 mt-1">
                Calculates precise multi-split application schedule to minimize leaching, volatilization losses, and avoid fertilizer burn.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Input Controls */}
            <div className="space-y-4 p-5 rounded-2xl bg-black/40 backdrop-blur-md border border-white/10">
              <h4 className="font-bold text-sm text-white uppercase tracking-wider">
                1. Adjust Parameters
              </h4>

              <div>
                <label className="text-xs font-semibold text-white/80 block mb-1">
                  Target Crop:
                </label>
                <select
                  value={cropType}
                  onChange={(e) => setCropType(e.target.value)}
                  className="w-full text-xs rounded-xl bg-black/60 border border-white/20 px-3 py-2 text-white focus:ring-2 focus:ring-brand-500"
                >
                  <option className="bg-neutral-900">Tomato (Hybrid F1)</option>
                  <option className="bg-neutral-900">Groundnut (TMV-2)</option>
                  <option className="bg-neutral-900">Capsicum / Bell Pepper</option>
                  <option className="bg-neutral-900">Ragi / Finger Millet</option>
                  <option className="bg-neutral-900">Paddy / Rice</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-white/80 block mb-1">
                  Plot Area (Acres):
                </label>
                <input
                  type="number"
                  step="0.5"
                  value={plotArea}
                  onChange={(e) => setPlotArea(parseFloat(e.target.value) || 1)}
                  className="w-full text-xs rounded-xl bg-black/60 border border-white/20 px-3 py-2 text-white focus:ring-2 focus:ring-brand-500 font-mono"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-white/80 block mb-1">
                  Target Expected Yield (t/Ac):
                </label>
                <input
                  type="number"
                  value={targetYield}
                  onChange={(e) => setTargetYield(parseInt(e.target.value) || 20)}
                  className="w-full text-xs rounded-xl bg-black/60 border border-white/20 px-3 py-2 text-white focus:ring-2 focus:ring-brand-500 font-mono"
                />
              </div>

              <div className="pt-2 space-y-3">
                <span className="text-[11px] font-semibold text-white/60 uppercase tracking-wider block">
                  Soil Test Values (kg/ha):
                </span>
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="text-[10px] text-white/60 block mb-0.5">Avail. N</label>
                    <input
                      type="number"
                      value={soilN}
                      onChange={(e) => setSoilN(parseInt(e.target.value) || 0)}
                      className="w-full text-xs rounded-lg bg-black/60 border border-white/20 p-1.5 text-center font-mono font-bold text-white"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-white/60 block mb-0.5">Avail. P</label>
                    <input
                      type="number"
                      value={soilP}
                      onChange={(e) => setSoilP(parseInt(e.target.value) || 0)}
                      className="w-full text-xs rounded-lg bg-black/60 border border-white/20 p-1.5 text-center font-mono font-bold text-white"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-white/60 block mb-0.5">Avail. K</label>
                    <input
                      type="number"
                      value={soilK}
                      onChange={(e) => setSoilK(parseInt(e.target.value) || 0)}
                      className="w-full text-xs rounded-lg bg-black/60 border border-white/20 p-1.5 text-center font-mono font-bold text-white"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Calculated Prescription & Schedule */}
            <div className="lg:col-span-2 space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 rounded-2xl bg-brand-900/30 border border-brand-500/30 backdrop-blur-md">
                  <span className="text-xs font-bold text-brand-300 uppercase tracking-wider block">
                    Neem Coated Urea
                  </span>
                  <div className="mt-2 flex items-baseline gap-1">
                    <span className="text-2xl font-bold font-display text-white">{totalUreaKg}</span>
                    <span className="text-xs text-white/60">kg ({Math.round(totalUreaKg / 45)} bags)</span>
                  </div>
                  <p className="text-[11px] text-white/60 mt-1">{ureaReqKgPerAc} kg/acre total</p>
                </div>

                <div className="p-4 rounded-2xl bg-amber-900/30 border border-amber-500/30 backdrop-blur-md">
                  <span className="text-xs font-bold text-amber-300 uppercase tracking-wider block">
                    Di-Ammonium Phosphate (DAP)
                  </span>
                  <div className="mt-2 flex items-baseline gap-1">
                    <span className="text-2xl font-bold font-display text-white">{totalDapKg}</span>
                    <span className="text-xs text-white/60">kg ({Math.round(totalDapKg / 50)} bags)</span>
                  </div>
                  <p className="text-[11px] text-white/60 mt-1">{dapReqKgPerAc} kg/acre total</p>
                </div>

                <div className="p-4 rounded-2xl bg-sky-900/30 border border-sky-500/30 backdrop-blur-md">
                  <span className="text-xs font-bold text-sky-300 uppercase tracking-wider block">
                    Muriate of Potash (MOP)
                  </span>
                  <div className="mt-2 flex items-baseline gap-1">
                    <span className="text-2xl font-bold font-display text-white">{totalMopKg}</span>
                    <span className="text-xs text-white/60">kg ({Math.round(totalMopKg / 50)} bags)</span>
                  </div>
                  <p className="text-[11px] text-white/60 mt-1">{mopReqKgPerAc} kg/acre total</p>
                </div>
              </div>

              {/* Application Timeline Schedule */}
              <div className="p-5 rounded-2xl bg-black/40 backdrop-blur-md border border-white/10 space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-sm text-white flex items-center gap-2">
                    <Layers className="w-4 h-4 text-brand-400" />
                    Split Application Schedule ({cropType})
                  </h4>
                  <span className="text-xs font-bold text-brand-300">
                    Est. Fertilizer Budget: ₹{totalCost.toLocaleString()}
                  </span>
                </div>

                <div className="space-y-3">
                  <div className="p-3.5 rounded-xl bg-black/30 border border-white/10 flex items-start justify-between gap-4">
                    <div>
                      <span className="text-xs font-bold text-brand-300">
                        1. Basal Application (At Transplanting)
                      </span>
                      <p className="text-xs text-white/70 mt-0.5">
                        100% DAP ({totalDapKg} kg) + 30% Urea ({Math.round(totalUreaKg * 0.3)} kg) + 50% MOP ({Math.round(totalMopKg * 0.5)} kg) + 5 tonnes Farm Yard Manure (FYM).
                      </p>
                    </div>
                    <span className="text-[11px] font-semibold text-white/50 shrink-0">Day 0</span>
                  </div>

                  <div className="p-3.5 rounded-xl bg-black/30 border border-white/10 flex items-start justify-between gap-4">
                    <div>
                      <span className="text-xs font-bold text-amber-300">
                        2. 1st Top Dressing (Vegetative Peak)
                      </span>
                      <p className="text-xs text-white/70 mt-0.5">
                        35% Urea ({Math.round(totalUreaKg * 0.35)} kg) side-dressed 5cm away from plant stems, followed by light irrigation.
                      </p>
                    </div>
                    <span className="text-[11px] font-semibold text-white/50 shrink-0">Day 25 - 30</span>
                  </div>

                  <div className="p-3.5 rounded-xl bg-black/30 border border-white/10 flex items-start justify-between gap-4">
                    <div>
                      <span className="text-xs font-bold text-emerald-300">
                        3. 2nd Top Dressing (Flowering & Early Fruit Set)
                      </span>
                      <p className="text-xs text-white/70 mt-0.5">
                        Remaining 35% Urea ({Math.round(totalUreaKg * 0.35)} kg) + Remaining 50% MOP ({Math.round(totalMopKg * 0.5)} kg) for fruit weight and lycopene synthesis.
                      </p>
                    </div>
                    <span className="text-[11px] font-semibold text-white/50 shrink-0">Day 45 - 50</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
