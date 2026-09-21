"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  TrendingUp, 
  Search, 
  Filter, 
  AlertTriangle, 
  CheckCircle2, 
  ShieldAlert, 
  RefreshCw, 
  MapPin, 
  IndianRupee 
} from "lucide-react";
import { useApp } from "@/lib/store";

export default function AdminMarketsPage() {
  const { language } = useApp();

  const mandiArrivals = [
    {
      mandi: "Kolar APMC Yard",
      commodity: "Tomato (Hybrid)",
      arrivalsToday: "840 Tonnes",
      modalPrice: "₹2,200 / Qtl",
      mspBenchmark: "Market Driven",
      status: "Normal Flow",
      anomaly: "None"
    },
    {
      mandi: "Chikkaballapur APMC",
      commodity: "Groundnut (Pods)",
      arrivalsToday: "95 Tonnes",
      modalPrice: "₹6,700 / Qtl",
      mspBenchmark: "Govt MSP: ₹6,783",
      status: "MSP Anomaly Alert",
      anomaly: "Trading ₹83 below statutory MSP floor! Mandi secretary notified."
    },
    {
      mandi: "Yeshwanthpur (Bengaluru)",
      commodity: "Tomato (Hybrid)",
      arrivalsToday: "1,250 Tonnes",
      modalPrice: "₹2,350 / Qtl",
      mspBenchmark: "Market Driven",
      status: "High Demand",
      anomaly: "Interstate trader buying surge from Tamil Nadu"
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
              <span className="text-white font-semibold">APMC Mandi Price Control</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-display font-bold text-white flex items-center gap-3">
              <TrendingUp className="w-8 h-8 text-brand-400" />
              Statewide APMC Mandi Oversight & Price Integrity
            </h1>
            <p className="text-sm text-neutral-200 mt-1">
              Monitor daily arrivals, enforce Minimum Support Price (MSP) compliance, and detect trader cartelization anomalies.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 text-xs font-semibold text-white transition-all shadow-md">
              <RefreshCw className="w-3.5 h-3.5" />
              Sync e-NAM Core
            </button>
          </div>
        </div>

        {/* Mandi Anomaly Table */}
        <div className="bg-black/45 backdrop-blur-xl rounded-3xl p-6 border border-white/20 shadow-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/15 text-[11px] font-semibold text-neutral-300 uppercase tracking-wider">
                  <th className="py-3.5 px-4">APMC Market</th>
                  <th className="py-3.5 px-4">Commodity</th>
                  <th className="py-3.5 px-4">Daily Volume</th>
                  <th className="py-3.5 px-4">Modal Price</th>
                  <th className="py-3.5 px-4">MSP Compliance</th>
                  <th className="py-3.5 px-4">Market Status & Anomaly</th>
                  <th className="py-3.5 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10 text-xs text-neutral-200">
                {mandiArrivals.map((item, idx) => (
                  <tr key={idx} className="hover:bg-white/5 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-white">{item.mandi}</td>
                    <td className="py-3.5 px-4 text-neutral-200">{item.commodity}</td>
                    <td className="py-3.5 px-4 font-mono text-neutral-300">{item.arrivalsToday}</td>
                    <td className="py-3.5 px-4 font-mono font-bold text-white">{item.modalPrice}</td>
                    <td className="py-3.5 px-4 text-neutral-300">{item.mspBenchmark}</td>
                    <td className="py-3.5 px-4">
                      {item.anomaly !== "None" ? (
                        <div className="flex items-center gap-1.5 text-amber-300 font-medium">
                          <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                          <span>{item.anomaly}</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1.5 text-emerald-400">
                          <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                          <span>Optimal Price Spread</span>
                        </div>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 text-xs font-semibold text-white transition-all">
                        Inspect e-NAM
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
