"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  Bug, 
  ShieldCheck, 
  AlertTriangle, 
  Sparkles, 
  Search, 
  Filter, 
  Layers, 
  Droplets, 
  Activity, 
  ArrowRight,
  ChevronRight,
  Info,
  CheckCircle2,
  Calendar
} from "lucide-react";
import { useApp } from "@/lib/store";

export default function PestsPage() {
  const { language, activeFarm } = useApp();
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<"catalog" | "traps" | "alerts">("catalog");

  const pestCatalog = [
    {
      id: "pest-1",
      name: "Tomato Fruit Borer (Helicoverpa armigera)",
      kannada: "ಟೊಮೆಟೊ ಕಾಯಿ ಕೊರೆಯುವ ಹುಳು",
      crops: ["Tomato", "Chilli", "Gram", "Cotton"],
      severity: "High",
      type: "Lepidoptera Larva",
      symptoms: "Circular bore holes on fruits with larval excreta, flower drop, premature fruit rot.",
      etl: "1 larva per plant or 5% fruit damage in random sample.",
      biologicalControl: [
        "Spray HaNPV (Helicoverpa Nuclear Polyhedrosis Virus) @ 250 LE/ha with jaggery 0.5%",
        "Release egg parasitoid Trichogramma pretiosum @ 1,00,000/ha (5-6 releases)",
        "Install 5 Pheromone Traps (Helilure) per acre for monitoring"
      ],
      chemicalControl: [
        "Chlorantraniliprole 18.5% SC @ 0.3 ml/L (Pre-harvest interval: 3 days)",
        "Emamectin Benzoate 5% SG @ 0.4 g/L",
        "Flubendiamide 39.35% M/M SC @ 0.2 ml/L"
      ],
      trapSetup: "Install yellow delta traps with Helilure 30cm above crop canopy. Replace septa every 21 days."
    },
    {
      id: "pest-2",
      name: "Whitefly (Bemisia tabaci)",
      kannada: "ಬಿಳಿ ನೊಣ",
      crops: ["Tomato", "Cotton", "Brinjal", "Okra", "Papaya"],
      severity: "Critical (Virus Vector)",
      type: "Sucking Pest / Vector",
      symptoms: "Chlorotic spots on leaves, honeydew excretion causing sooty mold, vector for Tomato Leaf Curl Virus (ToLCV).",
      etl: "5 - 8 adults per leaf across top, middle, bottom leaves.",
      biologicalControl: [
        "Install Yellow Sticky Traps @ 15-20 traps/acre at crop canopy level",
        "Spray Neem Oil (Azadirachtin 10,000 ppm) @ 2 ml/L",
        "Conserve Chrysoperla carnea (Green lacewing predators)"
      ],
      chemicalControl: [
        "Diafenthiuron 50% WP @ 1.2 g/L",
        "Spiromesifen 22.9% SC @ 1.0 ml/L",
        "Acetamiprid 20% SP @ 0.2 g/L"
      ],
      trapSetup: "Bright yellow sheets coated with castor oil / polybutene placed at 1 meter spacing on windward edges."
    },
    {
      id: "pest-3",
      name: "Tuta absoluta (Tomato Pinworm / Leafminer)",
      kannada: "ಟೊಮೆಟೊ ಎಲೆ ಸುರಂಗ ಕೊರೆಯುವ ಹುಳು",
      crops: ["Tomato", "Potato", "Brinjal"],
      severity: "Critical",
      type: "Micro-lepidopteran",
      symptoms: "Irregular transparent serpentine mines in leaf mesophyll; pin-hole punctures on fruit calyx.",
      etl: "3 - 5 moths per pheromone trap per week or 1 mined leaf per 10 plants.",
      biologicalControl: [
        "Mass trapping using Tuta absoluta pheromone lures (Tutalure) @ 12-16 traps/acre",
        "Spray Bacillus thuringiensis (Bt) kurstaki @ 1.5 g/L in evening hours",
        "Predatory mirid bug Nesidiocoris tenuis conservation"
      ],
      chemicalControl: [
        "Spinetoram 11.7% SC @ 0.8 ml/L",
        "Chlorantraniliprole 18.5% SC @ 0.3 ml/L",
        "Abamectin 1.9% EC @ 0.5 ml/L"
      ],
      trapSetup: "Water pan pheromone traps placed at ground level / 20cm height with water + few drops of vegetable oil."
    },
    {
      id: "pest-4",
      name: "Groundnut Aphids & Leaf Miner (Aphis craccivora)",
      kannada: "ಕಡಲೆಕಾಯಿ ಸೀಡೆ ಮತ್ತು ಎಲೆ ಸುರಂಗ ಹುಳು",
      crops: ["Groundnut", "Cowpea", "Bean"],
      severity: "Medium",
      type: "Sucking Pest",
      symptoms: "Curling of tender leaflets, stunted growth, transmission of Peanut Stripe Virus.",
      etl: "10% infested plants with colonies at terminal shoots.",
      biologicalControl: [
        "Ladybird beetle (Coccinella septempunctata) grubs release",
        "Spray 5% NSKE (Neem Seed Kernel Extract)",
        "Intercrop with Pearl Millet / Bajra in 4:1 row ratio"
      ],
      chemicalControl: [
        "Imidacloprid 17.8% SL @ 0.3 ml/L",
        "Dimethoate 30% EC @ 1.7 ml/L"
      ],
      trapSetup: "Yellow sticky sheets @ 10 per acre along border rows."
    }
  ];

  const regionalAlerts = [
    {
      id: "al-1",
      pest: "Tuta absoluta Warning",
      district: "Kolar & Chikkaballapur",
      threatLevel: "High Alert",
      date: "Active (Next 7 Days)",
      advisory: "Elevated night temperatures (21°C) and relative humidity (68%) favour rapid generation cycles. Farmers are advised to inspect underside of leaves immediately and activate Tutalure traps."
    },
    {
      id: "al-2",
      pest: "Whitefly Vector Surge",
      district: "Bangalore Rural & Kolar Border",
      threatLevel: "Moderate Alert",
      date: "Watch Stage",
      advisory: "Dry spell over past 4 days has stimulated whitefly population. Spray Neem oil 10,000 ppm as prophylactic measure to protect from Leaf Curl Virus."
    }
  ];

  const filteredPests = pestCatalog.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.crops.some(c => c.toLowerCase().includes(searchQuery.toLowerCase())) ||
      p.symptoms.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = selectedCategory === "all" || p.severity.toLowerCase().includes(selectedCategory.toLowerCase());
    return matchesSearch && matchesCat;
  });

  return (
    <div className="min-h-screen bg-transparent py-8 px-4 sm:px-6 lg:px-8 text-white">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-medium text-white/60 mb-1">
              <Link href="/dashboard" className="hover:text-brand-300">Dashboard</Link>
              <span>/</span>
              <span className="text-white font-semibold">Integrated Pest Management (IPM)</span>
            </div>
            <h1 className="text-3xl font-display font-bold text-white flex items-center gap-3">
              <Bug className="w-8 h-8 text-amber-400" />
              Integrated Pest Management (IPM) Hub
            </h1>
            <p className="text-sm text-white/70 mt-1">
              Economic Threshold Level (ETL) decision rules, biological controls, pheromone trap deployment, and safe chemical dosages.
            </p>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            <Link
              href="/disease/analyze"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-medium text-sm transition-all shadow-lg shadow-brand-600/30 cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              AI Leaf Camera Scanner
            </Link>
          </div>
        </div>

        {/* Pest Outbreak Bulletin Bar */}
        <div className="p-4 rounded-2xl bg-amber-950/40 border border-amber-500/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <span className="p-2 rounded-xl bg-amber-500 text-white shrink-0 shadow-lg shadow-amber-500/30">
              <AlertTriangle className="w-5 h-5" />
            </span>
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-amber-300">
                ICAR-KVK Kolar Pest Outbreak Bulletin (This Week)
              </span>
              <p className="text-xs text-white/80 mt-0.5">
                Elevated <strong>Tuta absoluta</strong> trap counts recorded in Mulbagal & Srinivasapur blocks. Activate pheromone mass trapping.
              </p>
            </div>
          </div>
          <button
            onClick={() => setActiveTab("alerts")}
            className="px-3.5 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold shrink-0 transition-all cursor-pointer"
          >
            View Regional Alerts
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 border-b border-white/10 pb-2">
          <button
            onClick={() => setActiveTab("catalog")}
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
              activeTab === "catalog"
                ? "bg-brand-600 text-white shadow-lg shadow-brand-600/30"
                : "text-white/60 hover:text-white hover:bg-white/5"
            }`}
          >
            Pest Database & ETL Prescriptions
          </button>
          <button
            onClick={() => setActiveTab("traps")}
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
              activeTab === "traps"
                ? "bg-brand-600 text-white shadow-lg shadow-brand-600/30"
                : "text-white/60 hover:text-white hover:bg-white/5"
            }`}
          >
            Pheromone & Sticky Trap Protocols
          </button>
          <button
            onClick={() => setActiveTab("alerts")}
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
              activeTab === "alerts"
                ? "bg-brand-600 text-white shadow-lg shadow-brand-600/30"
                : "text-white/60 hover:text-white hover:bg-white/5"
            }`}
          >
            Regional Outbreak Alerts
          </button>
        </div>

        {/* Tab 1: Pest Database */}
        {activeTab === "catalog" && (
          <div className="space-y-6">
            {/* Search & Filters */}
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-white/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search by pest name, crop (Tomato, Groundnut...), or symptoms..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-black/50 border border-white/20 text-xs text-white placeholder-white/40 focus:ring-2 focus:ring-brand-500"
                />
              </div>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                aria-label="Filter Pests by Severity"
                className="text-xs rounded-xl bg-black/60 border border-white/20 px-4 py-2.5 text-white focus:ring-2 focus:ring-brand-500"
              >
                <option value="all" className="bg-neutral-900">All Severity Levels</option>
                <option value="critical" className="bg-neutral-900">Critical</option>
                <option value="high" className="bg-neutral-900">High</option>
                <option value="medium" className="bg-neutral-900">Medium</option>
              </select>
            </div>

            {/* Pest Cards Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {filteredPests.map((pest) => (
                <div
                  key={pest.id}
                  className="bg-black/45 backdrop-blur-xl rounded-3xl p-6 border border-white/20 shadow-2xl space-y-5 hover:border-brand-400/50 transition-all"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          pest.severity.includes("Critical")
                            ? "bg-red-900/50 border border-red-500/40 text-red-300"
                            : pest.severity.includes("High")
                            ? "bg-amber-900/50 border border-amber-500/40 text-amber-300"
                            : "bg-blue-900/50 border border-blue-500/40 text-blue-300"
                        }`}>
                          {pest.severity}
                        </span>
                        <span className="text-xs text-white/60">{pest.type}</span>
                      </div>
                      <h3 className="text-lg font-bold font-display text-white mt-1.5">
                        {pest.name}
                      </h3>
                      <p className="text-xs text-white/70 font-medium">
                        {pest.kannada}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2 text-xs">
                    <div className="p-3 rounded-xl bg-black/30 border border-white/10">
                      <span className="font-bold text-white block mb-0.5">
                        Damage Symptoms:
                      </span>
                      <p className="text-white/70">{pest.symptoms}</p>
                    </div>

                    <div className="p-3 rounded-xl bg-amber-950/30 border border-amber-500/30">
                      <span className="font-bold text-amber-300 block mb-0.5">
                        Economic Threshold Level (ETL):
                      </span>
                      <p className="text-amber-200/90">{pest.etl}</p>
                    </div>
                  </div>

                  {/* Biological & Chemical Recommendations */}
                  <div className="space-y-3 pt-2">
                    <div>
                      <span className="text-[11px] font-bold text-emerald-300 uppercase tracking-wider flex items-center gap-1.5 mb-1.5">
                        <ShieldCheck className="w-3.5 h-3.5" />
                        1. Biological & Cultural Controls (Recommended First)
                      </span>
                      <ul className="space-y-1 text-xs text-white/80">
                        {pest.biologicalControl.map((bio, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <span className="text-emerald-400 font-bold">•</span>
                            <span>{bio}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <span className="text-[11px] font-bold text-white/80 uppercase tracking-wider flex items-center gap-1.5 mb-1.5">
                        <Droplets className="w-3.5 h-3.5 text-blue-400" />
                        2. Chemical Spray Dosages (If above ETL only)
                      </span>
                      <ul className="space-y-1 text-xs text-white/80">
                        {pest.chemicalControl.map((chem, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <span className="text-blue-400 font-bold">•</span>
                            <span>{chem}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 2: Trap Protocols */}
        {activeTab === "traps" && (
          <div className="bg-black/45 backdrop-blur-xl rounded-3xl p-6 sm:p-8 border border-white/20 shadow-2xl space-y-6">
            <h3 className="text-xl font-bold font-display text-white">
              Pheromone & Optical Trap Deployment Protocols
            </h3>
            <p className="text-xs text-white/70">
              Low-cost, zero-residue monitoring and mass trapping strategies approved by ICAR and Central Insecticides Board.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-5 rounded-2xl bg-black/40 backdrop-blur-md border border-white/10 space-y-3">
                <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-400/30 uppercase tracking-wider">
                  Helilure Funnel Trap
                </span>
                <h4 className="font-bold text-white text-base">Fruit Borer Pheromone Trap</h4>
                <p className="text-xs text-white/70">
                  Target: Male Helicoverpa armigera moths. Place 5 traps/acre at 30cm above crop canopy. Count weekly.
                </p>
                <div className="pt-2 text-[11px] text-white/50 space-y-1">
                  <p>• Replace lure every 21 days.</p>
                  <p>• Clean collection bag weekly.</p>
                  <p>• Cost: ~₹90 per trap unit.</p>
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-black/40 backdrop-blur-md border border-white/10 space-y-3">
                <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-sky-500/20 text-sky-300 border border-sky-400/30 uppercase tracking-wider">
                  Yellow Sticky Sheets
                </span>
                <h4 className="font-bold text-white text-base">Whitefly & Aphid Optical Traps</h4>
                <p className="text-xs text-white/70">
                  Attracts sucking pests with 580nm yellow wavelength. Place 15-20 sheets/acre at top canopy level.
                </p>
                <div className="pt-2 text-[11px] text-white/50 space-y-1">
                  <p>• Coat with castor oil or grease.</p>
                  <p>• Drastically reduces virus transmission.</p>
                  <p>• Cost: ~₹15 per sheet.</p>
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-black/40 backdrop-blur-md border border-white/10 space-y-3">
                <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-purple-500/20 text-purple-300 border border-purple-400/30 uppercase tracking-wider">
                  Water Pan Tutalure Trap
                </span>
                <h4 className="font-bold text-white text-base">Tuta absoluta Pinworm Trap</h4>
                <p className="text-xs text-white/70">
                  Water tray with 2 drops oil and central Tutalure lure. Place 12-16 traps/acre for mass suppression.
                </p>
                <div className="pt-2 text-[11px] text-white/50 space-y-1">
                  <p>• Mass catches hundreds of males daily.</p>
                  <p>• Refill water evaporation every 3 days.</p>
                  <p>• Cost: ~₹110 per unit.</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Regional Alerts */}
        {activeTab === "alerts" && (
          <div className="space-y-4">
            {regionalAlerts.map((al) => (
              <div
                key={al.id}
                className="bg-black/45 backdrop-blur-xl rounded-3xl p-6 border border-white/20 shadow-2xl flex flex-col sm:flex-row sm:items-start justify-between gap-4"
              >
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-red-900/50 border border-red-500/40 text-red-300">
                      {al.threatLevel}
                    </span>
                    <span className="text-xs font-semibold text-white/70">{al.district}</span>
                    <span className="text-xs text-white/50">• {al.date}</span>
                  </div>
                  <h4 className="text-base font-bold font-display text-white">{al.pest}</h4>
                  <p className="text-xs text-white/80 max-w-3xl leading-relaxed">{al.advisory}</p>
                </div>
                <button className="px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-semibold shrink-0 transition-all cursor-pointer">
                  Request KVK Field Visit
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
