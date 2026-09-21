"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  AlertTriangle, 
  Search, 
  MapPin, 
  Radio, 
  ShieldAlert, 
  Send, 
  CheckCircle2, 
  Download,
  Flame
} from "lucide-react";
import { useApp } from "@/lib/store";

export default function AdminDiseasesPage() {
  const { language } = useApp();
  const [broadcastSent, setBroadcastSent] = useState(false);

  const diseaseClusters = [
    {
      id: "CLS-01",
      pathogen: "Early Blight (Alternaria solani)",
      hostCrop: "Tomato",
      district: "Kolar",
      hotspotTaluks: ["Vemagal (84 farms)", "Sugatur (62 farms)", "Mulbagal (35 farms)"],
      totalAffectedAcres: "410 Acres",
      severity: "High (Spread Rate +14% / day)",
      containmentStatus: "Advisory Broadcast Active",
      lastUpdated: "Today 08:30 IST"
    },
    {
      id: "CLS-02",
      pathogen: "Tomato Leaf Curl Virus (ToLCV) / Whitefly",
      hostCrop: "Tomato & Chilli",
      district: "Chikkaballapur",
      hotspotTaluks: ["Gauribidanur (110 farms)", "Chintamani (90 farms)"],
      totalAffectedAcres: "520 Acres",
      severity: "Critical (Yellow Vector Surge)",
      containmentStatus: "KVK Flying Squad Dispatched",
      lastUpdated: "Yesterday 18:00 IST"
    },
    {
      id: "CLS-03",
      pathogen: "Tikka Leaf Spot",
      hostCrop: "Groundnut",
      district: "Kolar",
      hotspotTaluks: ["Bangarapet (45 farms)", "KGF Rural (28 farms)"],
      totalAffectedAcres: "185 Acres",
      severity: "Moderate",
      containmentStatus: "Under Surveillance",
      lastUpdated: "2 days ago"
    }
  ];

  const handleBroadcast = () => {
    setBroadcastSent(true);
    setTimeout(() => setBroadcastSent(false), 4000);
  };

  return (
    <div className="min-h-screen bg-transparent text-white py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 p-6 rounded-3xl bg-black/45 backdrop-blur-xl border border-white/20 shadow-2xl">
          <div>
            <div className="flex items-center gap-2 text-xs font-medium text-neutral-300 mb-1">
              <Link href="/admin" className="hover:text-brand-300">Admin Portal</Link>
              <span>/</span>
              <span className="text-white font-semibold">Epidemiology & Outbreak Center</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-display font-bold text-white flex items-center gap-3">
              <AlertTriangle className="w-8 h-8 text-amber-400" />
              District Plant Pathology & Outbreak Command Center
            </h1>
            <p className="text-sm text-neutral-200 mt-1">
              Geospatial disease cluster heatmaps, automated early warning broadcasts, and containment zone logistics.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleBroadcast}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 border border-red-400/50 text-white font-bold text-sm transition-all shadow-lg"
            >
              <Radio className="w-4 h-4" />
              {broadcastSent ? "SMS / WhatsApp Warning Sent!" : "Broadcast Emergency Alert to 2,400+ Farmers"}
            </button>
          </div>
        </div>

        {/* Cluster List */}
        <div className="space-y-6">
          {diseaseClusters.map((cluster) => (
            <div
              key={cluster.id}
              className="bg-black/45 backdrop-blur-xl rounded-3xl p-6 sm:p-8 border border-white/20 shadow-2xl space-y-6"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/15">
                <div className="flex items-center gap-3">
                  <span className={`p-2.5 rounded-2xl text-white ${
                    cluster.severity.includes("Critical") ? "bg-red-600 border border-red-400/50" : "bg-amber-600 border border-amber-400/50"
                  }`}>
                    <ShieldAlert className="w-6 h-6" />
                  </span>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        cluster.severity.includes("Critical")
                          ? "bg-red-950/70 border border-red-500/40 text-red-200"
                          : "bg-amber-950/70 border border-amber-500/40 text-amber-200"
                      }`}>
                        {cluster.severity}
                      </span>
                      <span className="text-xs text-neutral-300">{cluster.district} District</span>
                    </div>
                    <h3 className="text-xl font-bold font-display text-white mt-1">
                      {cluster.pathogen} (Host: {cluster.hostCrop})
                    </h3>
                  </div>
                </div>

                <div className="text-xs font-semibold text-neutral-300">
                  Total Affected: <strong className="text-white">{cluster.totalAffectedAcres}</strong>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 rounded-2xl bg-black/40 border border-white/15">
                  <span className="text-xs font-semibold text-neutral-300 uppercase tracking-wider block mb-1">
                    Hotspot Taluks:
                  </span>
                  <div className="space-y-1 text-xs font-medium text-neutral-200">
                    {cluster.hotspotTaluks.map((t, idx) => (
                      <p key={idx}>• {t}</p>
                    ))}
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-black/40 border border-white/15">
                  <span className="text-xs font-semibold text-neutral-300 uppercase tracking-wider block mb-1">
                    Containment Action:
                  </span>
                  <p className="text-xs font-bold text-brand-300">{cluster.containmentStatus}</p>
                  <p className="text-[11px] text-neutral-300 mt-1">Free fungicide kit distribution enabled at Raitha Samparka Kendras (RSK).</p>
                </div>

                <div className="p-4 rounded-2xl bg-black/40 border border-white/15 flex flex-col justify-between">
                  <span className="text-xs font-semibold text-neutral-300 uppercase tracking-wider">
                    KVK Science Advisory:
                  </span>
                  <p className="text-xs text-neutral-200">
                    Mandatory 10-day preventive spray buffer around 3km cluster perimeter.
                  </p>
                  <span className="text-[10px] text-neutral-400">Updated: {cluster.lastUpdated}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
