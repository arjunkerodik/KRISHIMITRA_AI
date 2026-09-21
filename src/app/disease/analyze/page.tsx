"use client";

import React from "react";
import { FarmerSidebar } from "@/components/FarmerSidebar";
import { DiseaseScanner } from "@/components/DiseaseScanner";
import { DEMO_DISEASE_RECORDS } from "@/lib/demo-data";
import {
  ScanLine,
  ShieldAlert,
  Stethoscope,
  BookOpen,
  Info,
  AlertTriangle,
} from "lucide-react";

export default function DiseaseAnalyzePage() {
  return (
    <div className="min-h-screen flex bg-transparent text-white">
      <div className="hidden lg:block w-64 shrink-0">
        <div className="fixed top-16 bottom-0 w-64">
          <FarmerSidebar />
        </div>
      </div>

      <div className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="p-6 rounded-3xl bg-black/45 backdrop-blur-xl border border-white/20 shadow-2xl">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-red-500/80 border border-red-400/50 text-white flex items-center justify-center shadow-lg">
              <ScanLine className="w-6 h-6" />
            </div>
            <div>
              <h1 className="font-display font-bold text-2xl text-white tracking-tight drop-shadow-sm">
                Leaf Disease Diagnostic Scanner
              </h1>
              <p className="text-xs sm:text-sm text-neutral-200 mt-0.5">
                Computer vision pathology model calibrated on 50,000+ Indian crop disease image datasets (Section 17).
              </p>
            </div>
          </div>
        </div>

        {/* Scanner Component */}
        <DiseaseScanner />

        {/* Common Crop Diseases in Current Region Knowledge Section */}
        <div className="p-6 rounded-3xl bg-black/45 backdrop-blur-xl border border-white/20 shadow-2xl space-y-4">
          <h2 className="font-display font-bold text-base text-white flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-brand-400" />
            <span>Pathology Knowledge Base • Regional Alerts</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {DEMO_DISEASE_RECORDS.map((dis) => (
              <div
                key={dis.id}
                className="p-4 rounded-2xl border border-white/15 bg-black/40 space-y-2.5"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-brand-300">
                      {dis.cropName} Pathogen
                    </span>
                    <h3 className="font-display font-bold text-sm text-white">
                      {dis.diseaseName}
                    </h3>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-950/70 border border-red-500/40 text-red-200">
                    {dis.severity}
                  </span>
                </div>

                <p className="text-xs text-neutral-200">
                  {dis.symptoms[0]}
                </p>

                <div className="text-[11px] text-brand-300 font-semibold bg-black/50 p-2.5 rounded-xl border border-white/15">
                  🛡️ Primary IPM Action: {dis.immediateActions[0]}
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
