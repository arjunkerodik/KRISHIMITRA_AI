"use client";

import React, { useState } from "react";
import Link from "next/link";
import { FarmerSidebar } from "@/components/FarmerSidebar";
import { 
  FlaskConical, 
  MapPin, 
  CheckCircle2, 
  ArrowRight, 
  Download, 
  Building2,
  Phone,
  Droplets,
  ChevronRight
} from "lucide-react";
import { useApp } from "@/lib/store";
import { SoilHealthCard } from "@/components/SoilHealthCard";

export default function SoilPage() {
  const { activeFarm } = useApp();
  const [activeTab, setActiveTab] = useState<"card" | "labs">("card");

  const soilLabs = [
    {
      id: "lab-1",
      name: "District Soil Testing Laboratory (KVK Kolar)",
      type: "Government (ICAR-KVK)",
      distance: "8.4 km",
      address: "Agricultural Science Centre, Tamaka, Kolar, Karnataka 563103",
      contact: "+91 8152 243 120",
      turnaround: "48 - 72 hours",
      cost: "₹30 / sample (Subsidized)",
      services: ["Standard NPK", "Micronutrients (Zn, B, Fe)", "Soil pH & EC", "Organic Carbon %"]
    },
    {
      id: "lab-2",
      name: "UAS Bangalore Regional Testing Center",
      type: "State Agricultural University",
      distance: "24.6 km",
      address: "Chintamani Main Road, Srinivasapur, Karnataka 563135",
      contact: "+91 8157 289 441",
      turnaround: "24 - 48 hours",
      cost: "₹50 / sample",
      services: ["12-Parameter Complete Assay", "Biological Activity", "Water Salinity Test"]
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
                Soil Health Card (SHC) System
              </span>
              <span className="text-xs text-white/70">{activeFarm.name}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-1">
              Soil Health & Stoichiometric Dosimetry
            </h1>
            <p className="text-sm text-white/70 mt-0.5">
              Precision NPK balancing and basal/top-dress split schedules tailored to your {activeFarm.currentCrop} plot.
            </p>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setActiveTab("card")}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                activeTab === "card"
                  ? "bg-emerald-600 text-white shadow-lg border border-emerald-400/40"
                  : "bg-black/40 text-white/70 hover:bg-black/60 hover:text-white border border-white/10"
              }`}
            >
              Soil Health Card
            </button>
            <button
              onClick={() => setActiveTab("labs")}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                activeTab === "labs"
                  ? "bg-emerald-600 text-white shadow-lg border border-emerald-400/40"
                  : "bg-black/40 text-white/70 hover:bg-black/60 hover:text-white border border-white/10"
              }`}
            >
              Nearby Labs ({soilLabs.length})
            </button>
          </div>
        </div>

        {activeTab === "card" ? (
          <SoilHealthCard />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {soilLabs.map((lab) => (
              <div
                key={lab.id}
                className="bg-black/50 backdrop-blur-xl rounded-3xl border border-white/20 p-6 shadow-2xl flex flex-col justify-between text-white hover:border-emerald-500/50 transition-all"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-xs font-bold text-emerald-400">{lab.type}</span>
                    <span className="text-xs text-white/60">{lab.distance}</span>
                  </div>
                  <h3 className="text-base font-bold text-white mb-2">{lab.name}</h3>
                  <p className="text-xs text-white/70 mb-3">{lab.address}</p>

                  <div className="space-y-1.5 p-3.5 rounded-2xl bg-black/40 border border-white/10 text-xs">
                    <div className="flex justify-between"><span className="text-white/50">Testing Fee:</span><strong className="text-emerald-400">{lab.cost}</strong></div>
                    <div className="flex justify-between"><span className="text-white/50">Turnaround Time:</span><span className="text-white/80">{lab.turnaround}</span></div>
                    <div className="flex justify-between"><span className="text-white/50">Helpline:</span><span className="text-white/80">{lab.contact}</span></div>
                  </div>
                </div>

                <div className="pt-4 mt-4 border-t border-white/10">
                  <a
                    href={`tel:${lab.contact.replace(/[^0-9]/g, "")}`}
                    className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-lg transition-all border border-emerald-400/40 cursor-pointer"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>Call Lab for Appointment</span>
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
