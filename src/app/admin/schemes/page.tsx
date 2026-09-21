"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  Building2, 
  Search, 
  Filter, 
  CheckCircle2, 
  Clock, 
  IndianRupee, 
  Download, 
  ShieldCheck 
} from "lucide-react";
import { useApp } from "@/lib/store";

export default function AdminSchemesPage() {
  const { language } = useApp();

  const schemeApplications = [
    {
      appId: "APP-PMKSY-2024-8812",
      farmerName: "Ramesh Gowda",
      village: "Vemagal, Kolar",
      scheme: "PMKSY (Drip Irrigation 90% Subsidy)",
      appliedAmount: "₹48,500",
      status: "Inspection Scheduled",
      officer: "K. Murthy (AAO Vemagal)",
      submissionDate: "05 Sep 2024"
    },
    {
      appId: "APP-PMKISAN-2024-4190",
      farmerName: "Suresh Kumar",
      village: "Sugatur, Kolar",
      scheme: "PM-KISAN (Installment 18)",
      appliedAmount: "₹2,000",
      status: "DBT Approved",
      officer: "Automated NPCI Mapper",
      submissionDate: "01 Sep 2024"
    },
    {
      appId: "APP-KUSUM-2024-1104",
      farmerName: "Anand Reddy",
      village: "Srinivasapur, Kolar",
      scheme: "PM-KUSUM (7.5 HP Solar Pump)",
      appliedAmount: "₹1,85,000 (60% Subsidy)",
      status: "Vendor Allotted",
      officer: "BESCOM Solar Cell",
      submissionDate: "28 Aug 2024"
    },
    {
      appId: "APP-PMFBY-2024-3091",
      farmerName: "Manjula Devi",
      village: "Narsapura, Kolar",
      scheme: "PMFBY (Groundnut Crop Loss Claim)",
      appliedAmount: "₹24,000",
      status: "Satellite Damage Verified (72%)",
      officer: "AIC of India Surveyor",
      submissionDate: "15 Aug 2024"
    }
  ];

  return (
    <div className="min-h-screen bg-transparent text-white py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 p-6 rounded-3xl bg-black/45 backdrop-blur-xl border border-white/20 shadow-2xl">
          <div>
            <div className="flex items-center gap-2 text-xs font-medium text-neutral-300 mb-1">
              <Link href="/admin" className="hover:text-brand-300">Admin Portal</Link>
              <span>/</span>
              <span className="text-white font-semibold">Government Scheme Applications</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-display font-bold text-white flex items-center gap-3">
              <Building2 className="w-8 h-8 text-brand-400" />
              District Scheme Applications & DBT Sanction Workbench
            </h1>
            <p className="text-sm text-neutral-200 mt-1">
              Review beneficiary eligibility, trigger AAO field inspections, and clear Direct Benefit Transfer subsidy disbursements.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 text-xs font-semibold text-white transition-all shadow-md">
              <Download className="w-3.5 h-3.5" />
              Export Sanction Order (PFMS)
            </button>
          </div>
        </div>

        {/* Scheme Table */}
        <div className="bg-black/45 backdrop-blur-xl rounded-3xl p-6 border border-white/20 shadow-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/15 text-[11px] font-semibold text-neutral-300 uppercase tracking-wider">
                  <th className="py-3.5 px-4">Application ID</th>
                  <th className="py-3.5 px-4">Beneficiary</th>
                  <th className="py-3.5 px-4">Scheme & Subsidy</th>
                  <th className="py-3.5 px-4">Subsidy Amount</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4">Assigned Officer</th>
                  <th className="py-3.5 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10 text-xs text-neutral-200">
                {schemeApplications.map((app) => (
                  <tr key={app.appId} className="hover:bg-white/5 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-semibold text-white">
                      {app.appId}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-white">{app.farmerName}</div>
                      <div className="text-[11px] text-neutral-400">{app.village}</div>
                    </td>
                    <td className="py-3.5 px-4 font-medium text-neutral-200">
                      {app.scheme}
                    </td>
                    <td className="py-3.5 px-4 font-mono font-bold text-emerald-400">
                      {app.appliedAmount}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-brand-950/60 border border-brand-400/40 text-brand-300">
                        {app.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-neutral-300">{app.officer}</td>
                    <td className="py-3.5 px-4 text-right">
                      <button className="px-3 py-1.5 rounded-xl bg-brand-600 hover:bg-brand-500 border border-brand-400/40 text-white text-xs font-semibold transition-all shadow-md">
                        Approve DBT
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
