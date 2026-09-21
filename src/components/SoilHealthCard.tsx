"use client";

import React, { useState } from "react";
import { useApp } from "@/lib/store";
import {
  FlaskConical,
  Upload,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Sparkles,
  Info,
  RefreshCw,
  Sliders,
  Calendar,
  X,
  ChevronDown,
  Download,
} from "lucide-react";

export const SoilHealthCard: React.FC = () => {
  const { soilReport, updateSoilReport, activeFarm, showToast } = useApp();
  const [isOCRProcessing, setIsOCRProcessing] = useState<boolean>(false);
  const [showAdjustModal, setShowAdjustModal] = useState<boolean>(false);

  // Local state for interactive slider adjustment
  const [adjN, setAdjN] = useState(soilReport.nitrogenKgHa);
  const [adjP, setAdjP] = useState(soilReport.phosphorusKgHa);
  const [adjK, setAdjK] = useState(soilReport.potassiumKgHa);
  const [adjPH, setAdjPH] = useState(soilReport.ph);
  const [adjOC, setAdjOC] = useState(soilReport.organicCarbonPercent);

  const calculateHealthScore = (n: number, p: number, k: number, ph: number, oc: number) => {
    let score = 50;
    score += Math.min(20, (n / 280) * 20);
    score += Math.min(10, (p / 35) * 10);
    score += Math.min(10, (k / 200) * 10);
    if (ph >= 6.2 && ph <= 7.5) score += 10;
    else if (ph >= 5.5 && ph <= 8.5) score += 5;
    score += Math.min(10, (oc / 0.75) * 10);
    return Math.min(100, Math.round(score));
  };

  const getRecommendations = (n: number, p: number, k: number, ph: number) => {
    const recs: string[] = [];
    const nDeficit = 280 - n;
    if (nDeficit > 0) {
      const ureaKg = Math.round((nDeficit / 0.46) * 1.5);
      recs.push(`Nitrogen Deficit (${nDeficit} kg/ha): Apply ${ureaKg} kg Urea in 3 split doses across vegetative, flowering, and fruit set.`);
    } else {
      recs.push("Nitrogen is optimal: Withhold additional chemical urea to avoid succulent vegetative overgrowth.");
    }

    if (p < 25) {
      recs.push(`Phosphorus Low (${p} kg/ha): Apply 75 kg Single Super Phosphate (SSP) as basal placement near root zone.`);
    } else {
      recs.push(`Phosphorus Balanced (${p} kg/ha): Maintain current maintenance dose with organic compost.`);
    }

    if (k < 200) {
      recs.push(`Potassium Deficit (${k} kg/ha): Apply 40 kg MOP or foliar spray SOP (13:0:45) during fruit swelling.`);
    } else {
      recs.push(`Potassium High (${k} kg/ha): Sufficient for strong tomato fruit walls and enhanced shipping shelf-life.`);
    }

    return recs;
  };

  const handleApplyAdjustments = () => {
    const newScore = calculateHealthScore(adjN, adjP, adjK, adjPH, adjOC);
    const newRecs = getRecommendations(adjN, adjP, adjK, adjPH);

    updateSoilReport({
      nitrogenKgHa: adjN,
      nitrogenStatus: adjN < 200 ? "Low" : adjN > 300 ? "High" : "Medium",
      phosphorusKgHa: adjP,
      phosphorusStatus: adjP < 20 ? "Low" : adjP > 40 ? "High" : "Medium",
      potassiumKgHa: adjK,
      potassiumStatus: adjK < 180 ? "Low" : adjK > 280 ? "High" : "Medium",
      ph: adjPH,
      organicCarbonPercent: adjOC,
      soilHealthIndex: newScore,
      recommendations: newRecs,
    });

    setShowAdjustModal(false);
    showToast("Soil Parameters Updated", `Custom NPK values applied. Health Score: ${newScore}/100`, "success");
  };

  return (
    <div className="space-y-6">
      
      {/* 1. MAIN CARD HEADER */}
      <div className="bg-black/50 backdrop-blur-xl rounded-3xl border border-white/20 p-6 shadow-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-white">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              Lab Verified: {soilReport.labName || "KVK Kolar Laboratory"}
            </span>
            <span className="text-xs text-white/60">Tested: {soilReport.testDate || "14 Jul 2024"}</span>
          </div>
          <h2 className="text-xl font-bold text-white mt-1">
            Soil Health Card • {activeFarm.name}
          </h2>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowAdjustModal(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold transition-all border border-white/15 cursor-pointer"
          >
            <Sliders className="w-3.5 h-3.5 text-emerald-400" />
            <span>Adjust NPK Sliders</span>
          </button>
        </div>
      </div>

      {/* 2. PARAMETERS GRID */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
        
        {/* Nitrogen */}
        <div className="bg-black/50 backdrop-blur-xl rounded-3xl border border-white/20 p-4 shadow-2xl text-center text-white">
          <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider block mb-1">
            Nitrogen (N)
          </span>
          <span className="text-2xl font-extrabold text-white">
            {soilReport.nitrogenKgHa}
          </span>
          <span className="text-[10px] text-white/50 block">kg/ha</span>
          <span className="mt-2 inline-block px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
            {soilReport.nitrogenStatus || "Medium"}
          </span>
        </div>

        {/* Phosphorus */}
        <div className="bg-black/50 backdrop-blur-xl rounded-3xl border border-white/20 p-4 shadow-2xl text-center text-white">
          <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider block mb-1">
            Phosphorus (P)
          </span>
          <span className="text-2xl font-extrabold text-white">
            {soilReport.phosphorusKgHa}
          </span>
          <span className="text-[10px] text-white/50 block">kg/ha</span>
          <span className="mt-2 inline-block px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
            {soilReport.phosphorusStatus || "Optimal"}
          </span>
        </div>

        {/* Potassium */}
        <div className="bg-black/50 backdrop-blur-xl rounded-3xl border border-white/20 p-4 shadow-2xl text-center text-white">
          <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider block mb-1">
            Potassium (K)
          </span>
          <span className="text-2xl font-extrabold text-white">
            {soilReport.potassiumKgHa}
          </span>
          <span className="text-[10px] text-white/50 block">kg/ha</span>
          <span className="mt-2 inline-block px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
            {soilReport.potassiumStatus || "High"}
          </span>
        </div>

        {/* pH */}
        <div className="bg-black/50 backdrop-blur-xl rounded-3xl border border-white/20 p-4 shadow-2xl text-center text-white">
          <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider block mb-1">
            Soil pH
          </span>
          <span className="text-2xl font-extrabold text-white">
            {soilReport.ph}
          </span>
          <span className="text-[10px] text-white/50 block">Acidity Scale</span>
          <span className="mt-2 inline-block px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
            Neutral (Optimal)
          </span>
        </div>

        {/* Organic Carbon */}
        <div className="bg-black/50 backdrop-blur-xl rounded-3xl border border-white/20 p-4 shadow-2xl text-center col-span-2 sm:col-span-1 text-white">
          <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider block mb-1">
            Organic Carbon
          </span>
          <span className="text-2xl font-extrabold text-white">
            {soilReport.organicCarbonPercent}%
          </span>
          <span className="text-[10px] text-white/50 block">Target &gt; 0.75%</span>
          <span className="mt-2 inline-block px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
            Moderate
          </span>
        </div>

      </div>

      {/* 3. PRECISION FERTIGATION RECOMMENDATIONS */}
      <div className="bg-black/50 backdrop-blur-xl rounded-3xl border border-white/20 p-6 shadow-2xl text-white">
        <h3 className="text-base font-bold text-white mb-3">
          Fertilizer Split Dosage Schedule (Stoichiometric Model)
        </h3>
        <ul className="space-y-2.5 text-xs text-white/80">
          {(soilReport.recommendations || []).map((rec: string, idx: number) => (
            <li key={idx} className="flex items-start gap-2.5 p-3.5 rounded-2xl bg-black/40 border border-white/10">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span>{rec}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* 4. MODAL: ADJUST PARAMETERS */}
      {showAdjustModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-black/90 backdrop-blur-2xl rounded-3xl border border-white/20 max-w-md w-full p-6 shadow-2xl space-y-4 text-white">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <h3 className="font-bold text-base text-white">Adjust Soil NPK Parameters</h3>
              <button onClick={() => setShowAdjustModal(false)} className="p-1 rounded-lg text-white/60 hover:text-white hover:bg-white/10 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <div className="flex justify-between font-bold mb-1">
                  <span>Nitrogen (N): {adjN} kg/ha</span>
                  <span className="text-white/50">Target 280</span>
                </div>
                <input
                  type="range"
                  min="100"
                  max="400"
                  value={adjN}
                  onChange={(e) => setAdjN(Number(e.target.value))}
                  className="w-full accent-emerald-500"
                />
              </div>

              <div>
                <div className="flex justify-between font-bold mb-1">
                  <span>Phosphorus (P): {adjP} kg/ha</span>
                  <span className="text-white/50">Target 35</span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="60"
                  value={adjP}
                  onChange={(e) => setAdjP(Number(e.target.value))}
                  className="w-full accent-emerald-500"
                />
              </div>

              <div>
                <div className="flex justify-between font-bold mb-1">
                  <span>Potassium (K): {adjK} kg/ha</span>
                  <span className="text-white/50">Target 220</span>
                </div>
                <input
                  type="range"
                  min="80"
                  max="450"
                  value={adjK}
                  onChange={(e) => setAdjK(Number(e.target.value))}
                  className="w-full accent-emerald-500"
                />
              </div>

              <div>
                <div className="flex justify-between font-bold mb-1">
                  <span>Soil pH: {adjPH}</span>
                  <span className="text-white/50">Ideal 6.5 - 7.5</span>
                </div>
                <input
                  type="range"
                  min="4.5"
                  max="9.0"
                  step="0.1"
                  value={adjPH}
                  onChange={(e) => setAdjPH(Number(e.target.value))}
                  className="w-full accent-emerald-500"
                />
              </div>
            </div>

            <div className="pt-3 flex justify-end gap-2">
              <button
                onClick={() => setShowAdjustModal(false)}
                className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/15 text-xs font-semibold cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleApplyAdjustments}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-lg border border-emerald-400/40 cursor-pointer"
              >
                Save & Recalculate
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
