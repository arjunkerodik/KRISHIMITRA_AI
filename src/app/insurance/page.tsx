"use client";

import React, { useState } from "react";
import { FarmerSidebar } from "@/components/FarmerSidebar";
import { useApp } from "@/lib/store";
import {
  ShieldCheck,
  FileCheck,
  AlertCircle,
  Camera,
  CheckCircle2,
  Calendar,
  Sparkles,
  Info,
  Clock,
  ArrowRight,
} from "lucide-react";

export default function InsurancePage() {
  const { activeFarm } = useApp();
  const [claimSubmitted, setClaimSubmitted] = useState<boolean>(false);
  const [claimData, setClaimData] = useState({
    calamityType: "Localized Inundation / Heavy Rain",
    lossDate: "2026-09-10",
    damagePercent: 35,
    description: "Afternoon thunderstorm caused localized waterlogging in lower Zone B.",
  });

  const handleSubmitClaim = (e: React.FormEvent) => {
    e.preventDefault();
    setClaimSubmitted(true);
  };

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
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h1 className="font-display font-bold text-2xl text-white tracking-tight drop-shadow-md">
                Crop Insurance & PMFBY Claim Assistant
              </h1>
              <p className="text-xs sm:text-sm text-neutral-300">
                Pradhan Mantri Fasal Bima Yojana Policy & 72-Hour Claim Filing Desk (Section 26 & 69).
              </p>
            </div>
          </div>
        </div>

        {/* Active Policy Summary Card */}
        <div className="p-6 rounded-3xl bg-black/45 backdrop-blur-xl border border-white/20 shadow-xl space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-white/10">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-brand-300">
                Active Insurance Cover (Kharif 2026)
              </span>
              <h3 className="font-display font-bold text-lg text-white">
                Policy #PMFBY-KA-2026-889104
              </h3>
            </div>
            <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-500/30 text-emerald-300 border border-emerald-400/30">
              ✓ Policy Active
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
            <div className="p-3.5 rounded-2xl bg-black/35 border border-white/15">
              <span className="text-neutral-400 block font-medium">Insured Crop</span>
              <span className="font-bold text-base text-white">{activeFarm.currentCrop} (2.5 Ac)</span>
            </div>
            <div className="p-3.5 rounded-2xl bg-black/35 border border-white/15">
              <span className="text-neutral-400 block font-medium">Sum Insured</span>
              <span className="font-bold text-base text-emerald-400">₹1,62,500</span>
            </div>
            <div className="p-3.5 rounded-2xl bg-black/35 border border-white/15">
              <span className="text-neutral-400 block font-medium">Farmer Premium Paid</span>
              <span className="font-bold text-base text-white">₹3,250 (2.0%)</span>
            </div>
            <div className="p-3.5 rounded-2xl bg-black/35 border border-white/15">
              <span className="text-neutral-400 block font-medium">Valid Period</span>
              <span className="font-bold text-base text-white">Aug - Nov 2026</span>
            </div>
          </div>
        </div>

        {/* Guided Step-by-Step Claim Assistant (Section 69) */}
        <div className="p-6 rounded-3xl bg-black/45 backdrop-blur-xl border border-white/20 shadow-xl space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <div>
              <h2 className="font-display font-bold text-lg text-white">
                🚨 File Localized Calamity Claim (Within 72 Hours)
              </h2>
              <p className="text-xs text-neutral-300">
                Mandatory under PMFBY guidelines to trigger insurance surveyor field inspection.
              </p>
            </div>
          </div>

          {!claimSubmitted ? (
            <form onSubmit={handleSubmitClaim} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-neutral-200 block mb-1">
                    Calamity / Damage Type:
                  </label>
                  <select
                    value={claimData.calamityType}
                    onChange={(e) => setClaimData({ ...claimData, calamityType: e.target.value })}
                    className="w-full text-xs font-semibold p-3 rounded-xl border border-white/20 bg-black/50 text-white"
                  >
                    <option className="bg-neutral-900 text-white" value="Localized Inundation / Heavy Rain">Localized Inundation / Excess Rain</option>
                    <option className="bg-neutral-900 text-white" value="Hailstorm Damage">Hailstorm Damage</option>
                    <option className="bg-neutral-900 text-white" value="Post-Harvest Cyclone">Post-Harvest Spoilage (Unseasonal Rain)</option>
                    <option className="bg-neutral-900 text-white" value="Severe Pest Epidemic">Severe Widespread Pest Attack</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-neutral-200 block mb-1">
                    Date of Calamity Occurrence:
                  </label>
                  <input
                    type="date"
                    value={claimData.lossDate}
                    onChange={(e) => setClaimData({ ...claimData, lossDate: e.target.value })}
                    className="w-full text-xs font-semibold p-3 rounded-xl border border-white/20 bg-black/40 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-neutral-200 block mb-1">
                  Estimated Crop Loss Percentage: ({claimData.damagePercent}%)
                </label>
                <input
                  type="range"
                  min="10"
                  max="100"
                  value={claimData.damagePercent}
                  onChange={(e) => setClaimData({ ...claimData, damagePercent: Number(e.target.value) })}
                  className="w-full accent-red-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-neutral-200 block mb-1">
                  Damage Description & Symptoms:
                </label>
                <textarea
                  rows={3}
                  value={claimData.description}
                  onChange={(e) => setClaimData({ ...claimData, description: e.target.value })}
                  className="w-full text-xs p-3 rounded-xl border border-white/20 bg-black/40 text-white"
                />
              </div>

              <div className="p-4 rounded-2xl border-2 border-dashed border-white/20 text-center bg-black/30">
                <Camera className="w-8 h-8 text-neutral-400 mx-auto mb-2" />
                <span className="text-xs font-bold text-white block">
                  Attach Geo-Tagged Crop Damage Photos
                </span>
                <p className="text-[11px] text-neutral-300 mt-0.5">
                  2 photos attached: `damage_zoneB_01.jpg`, `waterlog_plot1.jpg`
                </p>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-red-600/30 transition-colors cursor-pointer"
              >
                <span>Submit Official Claim Notice to Insurance Officer</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          ) : (
            <div className="p-6 rounded-2xl bg-black/50 border border-emerald-400/40 text-center space-y-3 animate-fade-in">
              <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />
              <h3 className="font-display font-bold text-lg text-white">
                Claim Acknowledgement #CLM-2026-9042 Generated
              </h3>
              <p className="text-xs text-neutral-200 max-w-md mx-auto">
                Notice dispatched to Kolar District Agriculture Joint Director and Insurance Field Surveyor. Spot survey appointment scheduled within 72 hours.
              </p>
            </div>
          )}

          <div className="text-[11px] text-neutral-300 flex items-center gap-1.5">
            <Info className="w-3.5 h-3.5 text-sky-400 shrink-0" />
            <span>KrishiMitra AI guides filing and creates standardized surveyor dossiers but does not directly adjudicate financial disbursements.</span>
          </div>
        </div>

      </div>
    </div>
  );
}
