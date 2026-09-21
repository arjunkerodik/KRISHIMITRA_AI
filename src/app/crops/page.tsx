"use client";

import React, { useState } from "react";
import Link from "next/link";
import { FarmerSidebar } from "@/components/FarmerSidebar";
import { useApp } from "@/lib/store";
import {
  Sprout,
  ScanLine,
  Droplets,
  FlaskConical,
  Bug,
  ShieldCheck,
  Calendar,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  Search,
  Filter,
  Layers,
  ChevronRight,
} from "lucide-react";

export default function CropsPage() {
  const { activeFarm, farms, setActiveFarmId } = useApp();
  const [activeTab, setActiveTab] = useState<"overview" | "health" | "disease" | "nutrition" | "irrigation">("overview");
  const [seasonFilter, setSeasonFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const myCrops = [
    {
      id: "crop-1",
      name: "Tomato (Solanum lycopersicum)",
      variety: "Hybrid F1 (Arka Rakshak)",
      area: `${activeFarm.areaAcres} Acres`,
      stage: "Day 33 • Flowering & Fruit Set",
      healthStatus: "Healthy",
      healthScore: 86,
      sowingDate: activeFarm.sowingDate || "08 Aug 2026",
      expectedHarvest: "08 Nov 2026",
      image: "https://images.unsplash.com/photo-1592841200221-a6898f307baa?w=600&auto=format&fit=crop&q=80",
    },
    {
      id: "crop-2",
      name: "Groundnut (Arachis hypogaea)",
      variety: "TMV-2 (Drought Tolerant)",
      area: "1.5 Acres",
      stage: "Day 54 • Pod Development",
      healthStatus: "Optimal",
      healthScore: 92,
      sowingDate: "15 Jul 2026",
      expectedHarvest: "25 Oct 2026",
      image: "https://images.unsplash.com/photo-1628352081506-83c43123ed6d?w=600&auto=format&fit=crop&q=80",
    },
  ];

  const recommendedCatalog = [
    {
      id: "rc-1",
      name: "Tomato (Hybrid F1 Arka Rakshak)",
      season: "Kharif & Rabi",
      duration: "120 - 140 Days",
      suitabilityScore: 94,
      waterNeed: "Medium (450 mm)",
      profitPotential: "₹1.8 - 2.4 Lakh/Acre",
      desc: "Triple disease-resistant (ToLCV, Bacterial Wilt, Early Blight) with high yield.",
    },
    {
      id: "rc-2",
      name: "Groundnut (TMV-2)",
      season: "Kharif",
      duration: "105 - 115 Days",
      suitabilityScore: 88,
      waterNeed: "Low (350 mm)",
      profitPotential: "₹55,000 - 70,000/Acre",
      desc: "Excellent legume for soil nitrogen fixing and guaranteed state MSP procurement.",
    },
    {
      id: "rc-3",
      name: "Finger Millet / Ragi (GPU-28)",
      season: "Kharif (Monsoon)",
      duration: "110 - 120 Days",
      suitabilityScore: 82,
      waterNeed: "Very Low (300 mm)",
      profitPotential: "₹45,000 - 60,000/Acre",
      desc: "Super-grain with high drought resistance and zero pest vulnerability.",
    },
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
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                {myCrops.length} Standing Crops
              </span>
              <span className="text-xs text-white/70">{activeFarm.name}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-1">
              Crop Management & Health Hub
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/disease"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-lg transition-all"
            >
              <ScanLine className="w-3.5 h-3.5" />
              <span>Scan Crop Leaf</span>
            </Link>
          </div>
        </div>

        {/* 1. MY CROPS SECTION */}
        <div>
          <h2 className="text-sm font-bold uppercase tracking-wider text-emerald-400 mb-3">
            My Standing Crops
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {myCrops.map((crop) => (
              <div
                key={crop.id}
                className="bg-black/50 backdrop-blur-xl rounded-3xl border border-white/20 overflow-hidden shadow-2xl hover:border-emerald-500/50 transition-all flex flex-col justify-between text-white"
              >
                <div>
                  <div className="relative h-44 w-full bg-black/40">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={crop.image}
                      alt={crop.name}
                      className="w-full h-full object-cover opacity-90 hover:opacity-100 transition-opacity"
                    />
                    <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-black/80 backdrop-blur-md text-emerald-400 border border-emerald-500/30 text-xs font-bold shadow-md">
                      {crop.healthStatus} ({crop.healthScore}%)
                    </div>
                  </div>

                  <div className="p-5">
                    <h3 className="text-base font-bold text-white">{crop.name}</h3>
                    <p className="text-xs text-white/70">{crop.variety}</p>

                    <div className="grid grid-cols-2 gap-3 mt-4 pt-4 border-t border-white/10 text-xs">
                      <div>
                        <span className="block text-[11px] text-white/50">Area</span>
                        <span className="font-bold text-white">{crop.area}</span>
                      </div>
                      <div>
                        <span className="block text-[11px] text-white/50">Stage</span>
                        <span className="font-bold text-emerald-400">{crop.stage}</span>
                      </div>
                      <div>
                        <span className="block text-[11px] text-white/50">Planted On</span>
                        <span className="font-semibold text-white/90">{crop.sowingDate}</span>
                      </div>
                      <div>
                        <span className="block text-[11px] text-white/50">Est. Harvest</span>
                        <span className="font-semibold text-white/90">{crop.expectedHarvest}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-black/40 border-t border-white/10 flex items-center justify-between text-xs">
                  <Link
                    href="/crop-calendar"
                    className="text-emerald-400 font-semibold hover:text-emerald-300 transition-colors"
                  >
                    View Farm Plan Timeline →
                  </Link>
                  <Link
                    href="/disease"
                    className="text-white/80 font-medium hover:text-white transition-colors"
                  >
                    Diagnose Health
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 2. CROP HEALTH & ADVISORY TABS */}
        <div className="bg-black/50 backdrop-blur-xl rounded-3xl border border-white/20 p-6 shadow-2xl text-white">
          <div className="flex items-center justify-between pb-4 border-b border-white/10">
            <h2 className="text-base font-bold text-white">Crop Health & Action Center</h2>
          </div>

          {/* Clean Tab Pills */}
          <div className="flex flex-wrap gap-2 pt-4 pb-6">
            {(["overview", "health", "disease", "nutrition", "irrigation"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold capitalize transition-all cursor-pointer ${
                  activeTab === tab
                    ? "bg-emerald-600 text-white shadow-lg border border-emerald-400/40"
                    : "bg-black/40 text-white/70 hover:bg-black/60 hover:text-white border border-white/10"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="text-xs text-white/80 leading-relaxed">
            {activeTab === "overview" && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-black/40 border border-white/10">
                  <span className="font-bold text-white text-sm block mb-1">Crop Phenology Status</span>
                  <p className="text-white/70">
                    Tomato crop is in peak flowering (33 days after transplanting). Flower retention rate is 88%, which is optimal for hybrid F1.
                  </p>
                </div>
                <div className="p-4 rounded-2xl bg-black/40 border border-white/10">
                  <span className="font-bold text-white text-sm block mb-1">Vegetation Vigor (NDVI)</span>
                  <p className="text-white/70">
                    Sentinel-2 calibrated NDVI is 0.78 (High chlorophyll density). No significant canopy stress detected across Zones A-D.
                  </p>
                </div>
              </div>
            )}

            {activeTab === "health" && (
              <div className="space-y-3">
                <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-500/30">
                  <span className="font-bold text-emerald-300 block mb-1">Overall Health Score: 86/100</span>
                  <p className="text-white/80">
                    Roots and stems are strong. Mild humidity stress noted in lower canopy; biological prophylaxis recommended.
                  </p>
                </div>
              </div>
            )}

            {activeTab === "disease" && (
              <div className="space-y-3">
                <div className="p-4 rounded-2xl bg-amber-950/40 border border-amber-500/30">
                  <span className="font-bold text-amber-300 block mb-1">Early Blight Risk Alert</span>
                  <p className="text-white/80 mb-2">
                    Relative humidity (88%) overnight creates high spore germination risk for <em>Alternaria solani</em>.
                  </p>
                  <Link href="/disease" className="text-emerald-400 font-bold hover:underline">
                    Run Camera Leaf Diagnosis →
                  </Link>
                </div>
              </div>
            )}

            {activeTab === "nutrition" && (
              <div className="space-y-3">
                <div className="p-4 rounded-2xl bg-black/40 border border-white/10">
                  <span className="font-bold text-white block mb-1">Foliar Fertigation Schedule</span>
                  <p className="text-white/70">
                    Apply 13:0:45 Potassium Nitrate (3kg/acre) + Micronutrient mix (Boron 20% @ 1g/L) for fruit sizing.
                  </p>
                </div>
              </div>
            )}

            {activeTab === "irrigation" && (
              <div className="space-y-3">
                <div className="p-4 rounded-2xl bg-sky-950/40 border border-sky-500/30">
                  <span className="font-bold text-sky-300 block mb-1">Evapotranspiration (ET0) Advisory</span>
                  <p className="text-white/80">
                    Postpone today&apos;s evening drip cycle due to 18.5mm rainfall. Resume standard 45-min morning cycle on Sunday.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* 3. RECOMMENDED CROP CATALOG */}
        <div className="bg-black/50 backdrop-blur-xl rounded-3xl border border-white/20 p-6 shadow-2xl text-white">
          <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-4">
            <div>
              <h2 className="text-base font-bold text-white">Recommended Varieties for {activeFarm.district}</h2>
              <p className="text-xs text-white/70">Calibrated for local soil type and monsoon patterns.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {recommendedCatalog.map((item) => (
              <div
                key={item.id}
                className="p-4 rounded-2xl bg-black/40 border border-white/10 flex flex-col justify-between hover:border-emerald-500/40 transition-all"
              >
                <div>
                  <div className="flex items-center justify-between gap-1 mb-2">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                      {item.suitabilityScore}% Match
                    </span>
                    <span className="text-[10px] text-white/50">{item.season}</span>
                  </div>
                  <h3 className="text-sm font-bold text-white mb-1">{item.name}</h3>
                  <p className="text-[11px] text-white/70 leading-relaxed">{item.desc}</p>
                </div>

                <div className="mt-3 pt-3 border-t border-white/10 text-[11px]">
                  <span className="block font-semibold text-emerald-400">{item.profitPotential}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
