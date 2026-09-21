"use client";

import React from "react";
import { FarmerSidebar } from "@/components/FarmerSidebar";
import { DiseaseScanner } from "@/components/DiseaseScanner";
import { ScanLine, ShieldCheck } from "lucide-react";
import { useApp } from "@/lib/store";

export default function DiseasePage() {
  const { activeFarm } = useApp();

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
                AI Vision Diagnostic Core
              </span>
              <span className="text-xs text-white/70">
                {activeFarm.currentCrop} Plot • {activeFarm.village}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-1">
              AI Crop Pathology & Leaf Scanner
            </h1>
            <p className="text-sm text-white/70 mt-0.5">
              Identify 48+ crop fungal, bacterial, and viral diseases with instant organic and chemical dosage guidance.
            </p>
          </div>
        </div>

        {/* Dedicated Scanner Component */}
        <DiseaseScanner />

      </div>
    </div>
  );
}
