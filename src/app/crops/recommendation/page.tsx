"use client";

import React, { useState } from "react";
import { useApp } from "@/lib/store";
import { FarmerSidebar } from "@/components/FarmerSidebar";
import { calculateCropRecommendations, CropRecommendationResult } from "@/lib/ai-engine";
import {
  Sparkles,
  Sprout,
  TrendingUp,
  FlaskConical,
  CloudSun,
  Droplets,
  Coins,
  ShieldAlert,
  Info,
  CheckCircle2,
  Filter,
} from "lucide-react";

export default function CropRecommendationPage() {
  const { activeFarm, soilReport } = useApp();

  const [inputParams, setInputParams] = useState({
    nitrogen: soilReport.nitrogenKgHa,
    phosphorus: soilReport.phosphorusKgHa,
    potassium: soilReport.potassiumKgHa,
    ph: soilReport.ph,
    rainfallMm: 740,
    tempCelsius: 28,
    humidity: 72,
    soilType: activeFarm.soilType,
    season: "Kharif / Rabi",
  });

  const [cropList, setCropList] = useState<CropRecommendationResult[]>(
    calculateCropRecommendations({
      nitrogen: soilReport.nitrogenKgHa,
      phosphorus: soilReport.phosphorusKgHa,
      potassium: soilReport.potassiumKgHa,
      ph: soilReport.ph,
      rainfallMm: 740,
      tempCelsius: 28,
      soilType: activeFarm.soilType,
      season: "Kharif",
    })
  );

  const [selectedCrop, setSelectedCrop] = useState<CropRecommendationResult>(cropList[0]);

  const handleRecalculate = () => {
    const updated = calculateCropRecommendations({
      ...inputParams,
    });
    setCropList(updated);
    setSelectedCrop(updated[0]);
  };

  return (
    <div className="min-h-screen flex bg-transparent text-white">
      
      {/* Sidebar for Desktop */}
      <div className="hidden lg:block w-64 shrink-0">
        <div className="fixed top-16 bottom-0 w-64">
          <FarmerSidebar />
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
        
        {/* Header Banner */}
        <div className="p-6 rounded-3xl bg-black/45 backdrop-blur-xl border border-white/20 shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-brand-500/80 border border-brand-400/50 text-white flex items-center justify-center shadow-lg">
                <Sparkles className="w-5 h-5" />
              </div>
              <h1 className="font-display font-extrabold text-2xl text-white tracking-tight drop-shadow-sm">
                AI Crop Suitability & Profit Advisor
              </h1>
            </div>
            <p className="text-xs sm:text-sm text-neutral-200 mt-1">
              Multi-criteria decision model evaluating soil chemistry, seasonal monsoon envelope, and APMC market opportunities (Section 15).
            </p>
          </div>

          <span className="text-xs font-bold px-3 py-1 rounded-full bg-brand-900/60 border border-brand-400/40 text-brand-300 w-fit">
            Deterministic Random Forest Model
          </span>
        </div>

        {/* Input Parameters Config Panel */}
        <div className="p-5 rounded-2xl bg-black/45 backdrop-blur-xl border border-white/20 shadow-2xl">
          <div className="flex items-center justify-between pb-3 mb-4 border-b border-white/15">
            <span className="text-xs font-bold uppercase tracking-wider text-neutral-300">
              Calibrated Field Parameters ({activeFarm.name})
            </span>
            <button
              onClick={handleRecalculate}
              className="text-xs font-bold text-brand-300 hover:underline"
            >
              Recalculate Ranking
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3 text-xs">
            <div className="p-2.5 rounded-xl bg-black/40 border border-white/15">
              <span className="text-[10px] text-neutral-300 font-medium block">Nitrogen (N)</span>
              <span className="font-bold text-white">{inputParams.nitrogen} kg/ha</span>
            </div>
            <div className="p-2.5 rounded-xl bg-black/40 border border-white/15">
              <span className="text-[10px] text-neutral-300 font-medium block">Phosphorus (P)</span>
              <span className="font-bold text-white">{inputParams.phosphorus} kg/ha</span>
            </div>
            <div className="p-2.5 rounded-xl bg-black/40 border border-white/15">
              <span className="text-[10px] text-neutral-300 font-medium block">Potassium (K)</span>
              <span className="font-bold text-white">{inputParams.potassium} kg/ha</span>
            </div>
            <div className="p-2.5 rounded-xl bg-black/40 border border-white/15">
              <span className="text-[10px] text-neutral-300 font-medium block">Soil pH</span>
              <span className="font-bold text-white">{inputParams.ph} (Near Neutral)</span>
            </div>
            <div className="p-2.5 rounded-xl bg-black/40 border border-white/15">
              <span className="text-[10px] text-neutral-300 font-medium block">Annual Rain</span>
              <span className="font-bold text-white">{inputParams.rainfallMm} mm</span>
            </div>
            <div className="p-2.5 rounded-xl bg-black/40 border border-white/15">
              <span className="text-[10px] text-neutral-300 font-medium block">Season</span>
              <span className="font-bold text-brand-300">{inputParams.season}</span>
            </div>
          </div>
        </div>

        {/* Top 5 Recommended Crops Ranking */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Left: Ranked Crop List (5 Cols) */}
          <div className="lg:col-span-5 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-300 px-1">
              Top 5 Ranked Crops
            </h3>
            {cropList.map((crop, idx) => {
              const isSelected = selectedCrop.cropName === crop.cropName;
              return (
                <div
                  key={crop.cropName}
                  onClick={() => setSelectedCrop(crop)}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all duration-200 ${
                    isSelected
                      ? "border-brand-400 bg-brand-950/70 shadow-xl scale-[1.01]"
                      : "border-white/15 bg-black/45 backdrop-blur-xl hover:border-white/30"
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-3">
                      <span className="w-7 h-7 rounded-full bg-white/10 text-white font-bold text-xs flex items-center justify-center shrink-0 border border-white/10">
                        #{idx + 1}
                      </span>
                      <div>
                        <h4 className="font-display font-bold text-sm text-white">
                          {crop.cropName}
                        </h4>
                        <span className="text-[11px] text-neutral-300">{crop.variety}</span>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="font-display font-bold text-lg text-brand-300">
                        {crop.overallScore}%
                      </span>
                      <span className="text-[10px] text-neutral-300 block">Match Score</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right: Selected Crop Deep Explainability Inspector (7 Cols) */}
          <div className="lg:col-span-7 p-6 rounded-3xl bg-black/45 backdrop-blur-xl border border-white/20 shadow-2xl space-y-6">
            
            {/* Title & Overall Match */}
            <div className="flex items-start justify-between gap-4 pb-4 border-b border-white/15">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-brand-300">
                  {selectedCrop.season} Season Candidate
                </span>
                <h2 className="font-display font-bold text-2xl text-white mt-0.5">
                  {selectedCrop.cropName}
                </h2>
                <p className="text-xs text-neutral-300">Recommended Variety: {selectedCrop.variety}</p>
              </div>

              <div className="p-3 rounded-2xl bg-brand-950/60 border border-brand-400/40 text-center">
                <span className="font-display font-extrabold text-3xl text-brand-300">
                  {selectedCrop.overallScore}%
                </span>
                <span className="text-[10px] font-bold uppercase block text-brand-300">
                  Overall Suitability
                </span>
              </div>
            </div>

            {/* Financial Projections per Acre */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3 rounded-xl bg-black/40 border border-white/15">
                <span className="text-[10px] uppercase font-bold text-neutral-300 block">Yield / Acre</span>
                <span className="font-display font-bold text-base text-white">
                  {selectedCrop.expectedYieldQuintalPerAcre} Qtl
                </span>
              </div>
              <div className="p-3 rounded-xl bg-black/40 border border-white/15">
                <span className="text-[10px] uppercase font-bold text-neutral-300 block">Cost / Acre</span>
                <span className="font-display font-bold text-base text-red-300">
                  ₹{selectedCrop.estimatedCostPerAcre.toLocaleString()}
                </span>
              </div>
              <div className="p-3 rounded-xl bg-black/40 border border-white/15">
                <span className="text-[10px] uppercase font-bold text-neutral-300 block">Gross Revenue</span>
                <span className="font-display font-bold text-base text-white">
                  ₹{selectedCrop.estimatedRevenuePerAcre.toLocaleString()}
                </span>
              </div>
              <div className="p-3 rounded-xl bg-brand-950/60 border border-brand-400/40">
                <span className="text-[10px] uppercase font-bold text-brand-300 block">Net Profit</span>
                <span className="font-display font-bold text-base text-brand-300">
                  ₹{selectedCrop.estimatedNetProfitPerAcre.toLocaleString()}
                </span>
              </div>
            </div>

            {/* 4 Multi-Factor Suitability Bars */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-300">
                Scientific Compatibility Breakdown
              </h4>
              <div className="space-y-2 text-xs">
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-neutral-200 font-medium">Soil Chemistry & pH Compatibility</span>
                    <span className="font-mono font-bold text-brand-300">{selectedCrop.soilCompatibilityScore}%</span>
                  </div>
                  <div className="w-full h-2 bg-black/40 border border-white/10 rounded-full overflow-hidden">
                    <div className="h-full bg-brand-500 rounded-full" style={{ width: `${selectedCrop.soilCompatibilityScore}%` }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-neutral-200 font-medium">Climate & Temperature Envelope</span>
                    <span className="font-mono font-bold text-sky-300">{selectedCrop.climateCompatibilityScore}%</span>
                  </div>
                  <div className="w-full h-2 bg-black/40 border border-white/10 rounded-full overflow-hidden">
                    <div className="h-full bg-sky-400 rounded-full" style={{ width: `${selectedCrop.climateCompatibilityScore}%` }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-neutral-200 font-medium">Water Feasibility & Irrigation Supply</span>
                    <span className="font-mono font-bold text-emerald-300">{selectedCrop.waterFeasibilityScore}%</span>
                  </div>
                  <div className="w-full h-2 bg-black/40 border border-white/10 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-400 rounded-full" style={{ width: `${selectedCrop.waterFeasibilityScore}%` }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-neutral-200 font-medium">APMC Mandi Price Demand Index</span>
                    <span className="font-mono font-bold text-amber-300">{selectedCrop.marketDemandScore}%</span>
                  </div>
                  <div className="w-full h-2 bg-black/40 border border-white/10 rounded-full overflow-hidden">
                    <div className="h-full bg-amber-400 rounded-full" style={{ width: `${selectedCrop.marketDemandScore}%` }} />
                  </div>
                </div>
              </div>
            </div>

            {/* Why & Risk Disclaimers */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-300">
                Agronomic Rationale & Risk Warnings
              </h4>
              <ul className="space-y-1.5 text-xs">
                {selectedCrop.reasons.map((r, i) => (
                  <li key={i} className="flex items-start gap-2 text-neutral-200">
                    <CheckCircle2 className="w-3.5 h-3.5 text-brand-400 shrink-0 mt-0.5" />
                    <span>{r}</span>
                  </li>
                ))}
                {selectedCrop.risks.map((risk, i) => (
                  <li key={i} className="flex items-start gap-2 text-amber-300">
                    <ShieldAlert className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                    <span>Risk: {risk}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Disclaimer */}
            <div className="pt-3 border-t border-white/15 text-[11px] text-neutral-300 flex items-center gap-1.5">
              <Info className="w-3.5 h-3.5 text-brand-400 shrink-0" />
              <span>Model estimates are advisory predictions based on historical distributions and never guarantees of crop yield or price.</span>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
