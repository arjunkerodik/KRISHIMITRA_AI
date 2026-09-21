"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  Users, 
  Search, 
  Filter, 
  Download, 
  CheckCircle2, 
  AlertTriangle, 
  MapPin, 
  Phone, 
  FileText,
  ShieldCheck,
  ChevronRight
} from "lucide-react";
import { useApp } from "@/lib/store";

export default function AdminFarmersPage() {
  const { language } = useApp();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedVillage, setSelectedVillage] = useState("all");

  const farmerList = [
    {
      id: "FRM-KA-001",
      name: "Ramesh Gowda",
      phone: "+91 98450 12345",
      village: "Vemagal, Kolar",
      landArea: "4.0 Acres",
      primaryCrop: "Tomato (Hybrid) & Groundnut",
      kycStatus: "Aadhaar e-KYC Verified",
      riskLevel: "Low (24/100)",
      schemesActive: ["PM-KISAN", "PMKSY", "PMFBY"],
      soilScore: "78 / 100",
      registeredOn: "12 Jan 2024"
    },
    {
      id: "FRM-KA-002",
      name: "Suresh Kumar",
      phone: "+91 94481 98765",
      village: "Sugatur, Kolar",
      landArea: "2.5 Acres",
      primaryCrop: "Capsicum & Marigold",
      kycStatus: "Aadhaar e-KYC Verified",
      riskLevel: "Moderate (45/100)",
      schemesActive: ["PM-KISAN", "NHM Polyhouse"],
      soilScore: "71 / 100",
      registeredOn: "04 Feb 2024"
    },
    {
      id: "FRM-KA-003",
      name: "Manjula Devi",
      phone: "+91 97312 34567",
      village: "Narsapura, Kolar",
      landArea: "1.8 Acres",
      primaryCrop: "Ragi & Mulberry",
      kycStatus: "Pending Bank Link",
      riskLevel: "High (68/100)",
      schemesActive: ["PM-KISAN"],
      soilScore: "62 / 100",
      registeredOn: "19 Mar 2024"
    },
    {
      id: "FRM-KA-004",
      name: "Anand Reddy",
      phone: "+91 98452 77889",
      village: "Srinivasapur, Kolar",
      landArea: "6.5 Acres",
      primaryCrop: "Mango (Alphonso) & Tomato",
      kycStatus: "Aadhaar e-KYC Verified",
      riskLevel: "Low (18/100)",
      schemesActive: ["PM-KISAN", "MIDH Mango Hub", "PMKSY"],
      soilScore: "84 / 100",
      registeredOn: "28 Jan 2024"
    }
  ];

  const filteredFarmers = farmerList.filter((f) => {
    const matchesSearch = f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.phone.includes(searchQuery) ||
      f.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.primaryCrop.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesVillage = selectedVillage === "all" || f.village.toLowerCase().includes(selectedVillage.toLowerCase());
    return matchesSearch && matchesVillage;
  });

  return (
    <div className="min-h-screen bg-transparent text-white py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 p-6 rounded-3xl bg-black/45 backdrop-blur-xl border border-white/20 shadow-2xl">
          <div>
            <div className="flex items-center gap-2 text-xs font-medium text-neutral-300 mb-1">
              <Link href="/admin" className="hover:text-brand-300">Admin Portal</Link>
              <span>/</span>
              <span className="text-white font-semibold">Farmer Registry & Aadhaar e-KYC</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-display font-bold text-white flex items-center gap-3">
              <Users className="w-8 h-8 text-brand-400" />
              District Farmer Registry & Agronomic Census
            </h1>
            <p className="text-sm text-neutral-200 mt-1">
              Centralized farmer profile registry with Bhoomi land title integration, risk index monitoring, and DBT scheme auditing.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 text-xs font-semibold text-white transition-all">
              <Download className="w-3.5 h-3.5" />
              Export NIC Format (CSV)
            </button>
            <Link
              href="/admin"
              className="px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 border border-brand-400/40 text-white text-xs font-semibold transition-all shadow-md"
            >
              Back to Admin Hub
            </Link>
          </div>
        </div>

        {/* Search & Village Filter */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-neutral-300 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by Farmer Name, Phone, Kisan ID (FRM-KA-...), or Crop..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-black/45 backdrop-blur-xl border border-white/20 text-xs text-white placeholder-neutral-400 focus:ring-2 focus:ring-brand-400"
            />
          </div>
          <select
            value={selectedVillage}
            onChange={(e) => setSelectedVillage(e.target.value)}
            aria-label="Filter Farmers by Gram Panchayat / Village"
            className="text-xs rounded-xl bg-black/45 backdrop-blur-xl border border-white/20 px-4 py-2.5 text-white focus:ring-2 focus:ring-brand-400"
          >
            <option value="all" className="bg-neutral-900 text-white">All Villages (Kolar)</option>
            <option value="vemagal" className="bg-neutral-900 text-white">Vemagal</option>
            <option value="sugatur" className="bg-neutral-900 text-white">Sugatur</option>
            <option value="narsapura" className="bg-neutral-900 text-white">Narsapura</option>
            <option value="srinivasapur" className="bg-neutral-900 text-white">Srinivasapur</option>
          </select>
        </div>

        {/* Farmer Registry Table */}
        <div className="bg-black/45 backdrop-blur-xl rounded-3xl p-6 border border-white/20 shadow-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/15 text-[11px] font-semibold text-neutral-300 uppercase tracking-wider">
                  <th className="py-3.5 px-4">Kisan ID & Farmer</th>
                  <th className="py-3.5 px-4">Village / Location</th>
                  <th className="py-3.5 px-4">Land & Standing Crop</th>
                  <th className="py-3.5 px-4">Aadhaar e-KYC</th>
                  <th className="py-3.5 px-4 text-center">Soil Score</th>
                  <th className="py-3.5 px-4 text-center">Risk Index</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10 text-xs text-neutral-200">
                {filteredFarmers.map((f) => (
                  <tr key={f.id} className="hover:bg-white/5 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-white">{f.name}</div>
                      <div className="text-[11px] text-neutral-400 font-mono">{f.id} • {f.phone}</div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="text-neutral-200">{f.village}</div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-white">{f.landArea}</div>
                      <div className="text-[11px] text-neutral-300">{f.primaryCrop}</div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        f.kycStatus.includes("Verified")
                          ? "bg-emerald-950/70 border border-emerald-500/40 text-emerald-200"
                          : "bg-amber-950/70 border border-amber-500/40 text-amber-200"
                      }`}>
                        <ShieldCheck className="w-3 h-3" />
                        {f.kycStatus}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-center font-mono font-semibold text-white">
                      {f.soilScore}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        f.riskLevel.includes("Low")
                          ? "bg-emerald-950/70 border border-emerald-500/40 text-emerald-200"
                          : f.riskLevel.includes("Moderate")
                          ? "bg-amber-950/70 border border-amber-500/40 text-amber-200"
                          : "bg-red-950/70 border border-red-500/40 text-red-200"
                      }`}>
                        {f.riskLevel}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button className="text-brand-300 hover:underline font-semibold text-xs">
                        View Dossier
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
