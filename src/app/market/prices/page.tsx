"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  TrendingUp, 
  Search, 
  Filter, 
  Calendar, 
  ArrowUpRight, 
  ArrowDownRight, 
  RefreshCw, 
  Download,
  MapPin
} from "lucide-react";
import { useApp } from "@/lib/store";

export default function MarketPricesPage() {
  const { language } = useApp();
  const [searchCommodity, setSearchCommodity] = useState("");
  const [selectedState, setSelectedState] = useState("Karnataka");

  const mandiPrices = [
    {
      mandi: "Kolar APMC Market",
      state: "Karnataka",
      district: "Kolar",
      commodity: "Tomato (Hybrid)",
      minPrice: 1950,
      modalPrice: 2200,
      maxPrice: 2450,
      unit: "₹ / Qtl",
      arrivals: "840 Tonnes",
      trend: "up",
      change: "+₹180 (8.9%)",
      updatedAt: "Today, 08:30 AM"
    },
    {
      mandi: "Yeshwanthpur APMC",
      state: "Karnataka",
      district: "Bengaluru Urban",
      commodity: "Tomato (Hybrid)",
      minPrice: 2100,
      modalPrice: 2350,
      maxPrice: 2600,
      unit: "₹ / Qtl",
      arrivals: "1,250 Tonnes",
      trend: "up",
      change: "+₹220 (10.3%)",
      updatedAt: "Today, 09:15 AM"
    },
    {
      mandi: "Chintamani APMC",
      state: "Karnataka",
      district: "Chikkaballapur",
      commodity: "Tomato (Hybrid)",
      minPrice: 1800,
      modalPrice: 2050,
      maxPrice: 2250,
      unit: "₹ / Qtl",
      arrivals: "450 Tonnes",
      trend: "down",
      change: "-₹50 (2.4%)",
      updatedAt: "Today, 08:00 AM"
    },
    {
      mandi: "Madanapalle Market",
      state: "Andhra Pradesh",
      district: "Annamayya",
      commodity: "Tomato (Hybrid)",
      minPrice: 2250,
      modalPrice: 2500,
      maxPrice: 2750,
      unit: "₹ / Qtl",
      arrivals: "2,100 Tonnes",
      trend: "up",
      change: "+₹300 (13.6%)",
      updatedAt: "Today, 09:45 AM"
    },
    {
      mandi: "Kolar APMC Market",
      state: "Karnataka",
      district: "Kolar",
      commodity: "Groundnut (Pods)",
      minPrice: 6200,
      modalPrice: 6850,
      maxPrice: 7200,
      unit: "₹ / Qtl",
      arrivals: "120 Tonnes",
      trend: "up",
      change: "+₹67 above MSP (₹6,783)",
      updatedAt: "Today, 07:45 AM"
    },
    {
      mandi: "Chikkaballapur APMC",
      state: "Karnataka",
      district: "Chikkaballapur",
      commodity: "Groundnut (Pods)",
      minPrice: 6100,
      modalPrice: 6700,
      maxPrice: 7050,
      unit: "₹ / Qtl",
      arrivals: "95 Tonnes",
      trend: "down",
      change: "-₹83 below MSP",
      updatedAt: "Today, 08:15 AM"
    },
    {
      mandi: "Kolar APMC Market",
      state: "Karnataka",
      district: "Kolar",
      commodity: "Finger Millet / Ragi",
      minPrice: 3850,
      modalPrice: 4350,
      maxPrice: 4500,
      unit: "₹ / Qtl",
      arrivals: "60 Tonnes",
      trend: "up",
      change: "+₹60 above MSP (₹4,290)",
      updatedAt: "Today, 07:30 AM"
    }
  ];

  const filteredPrices = mandiPrices.filter((p) => {
    return p.commodity.toLowerCase().includes(searchCommodity.toLowerCase()) ||
      p.mandi.toLowerCase().includes(searchCommodity.toLowerCase()) ||
      p.district.toLowerCase().includes(searchCommodity.toLowerCase());
  });

  return (
    <div className="min-h-screen bg-transparent py-8 px-4 sm:px-6 lg:px-8 text-white">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Breadcrumb Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-medium text-neutral-300 mb-1">
              <Link href="/dashboard" className="hover:text-brand-400">Dashboard</Link>
              <span>/</span>
              <Link href="/market" className="hover:text-brand-400">Market Hub</Link>
              <span>/</span>
              <span className="text-white font-semibold">Live APMC Mandi Tickers</span>
            </div>
            <h1 className="text-3xl font-display font-bold text-white flex items-center gap-3 drop-shadow-md">
              <TrendingUp className="w-8 h-8 text-brand-400" />
              Real-time APMC Mandi Commodity Prices
            </h1>
            <p className="text-sm text-neutral-300 mt-1">
              Direct Agmarknet & e-NAM data feed synchronization with district-level arrivals and minimum support price (MSP) benchmarks.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-semibold text-white transition-all cursor-pointer">
              <RefreshCw className="w-3.5 h-3.5" />
              Sync Agmarknet API
            </button>
            <Link
              href="/market/recommendation"
              className="px-4 py-2 rounded-xl bg-brand-500 hover:bg-brand-600 text-white text-xs font-semibold transition-all shadow-lg shadow-brand-500/30 cursor-pointer"
            >
              Run Arbitrage Calculator
            </Link>
          </div>
        </div>

        {/* Search Bar */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search commodity (e.g. Tomato, Groundnut), Mandi or District..."
              value={searchCommodity}
              onChange={(e) => setSearchCommodity(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-black/45 backdrop-blur-xl border border-white/20 text-xs text-white placeholder-neutral-400 focus:ring-2 focus:ring-brand-400"
            />
          </div>
        </div>

        {/* Mandi Price Table */}
        <div className="bg-black/45 backdrop-blur-xl rounded-3xl p-6 border border-white/20 shadow-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/10 text-[11px] font-semibold text-neutral-300 uppercase tracking-wider">
                  <th className="py-3.5 px-4">Commodity</th>
                  <th className="py-3.5 px-4">Mandi & District</th>
                  <th className="py-3.5 px-4 text-right">Min Price</th>
                  <th className="py-3.5 px-4 text-right">Modal Price (Avg)</th>
                  <th className="py-3.5 px-4 text-right">Max Price</th>
                  <th className="py-3.5 px-4 text-center">Arrivals</th>
                  <th className="py-3.5 px-4 text-right">Daily Change</th>
                  <th className="py-3.5 px-4 text-right">Updated</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10 text-xs text-neutral-200">
                {filteredPrices.map((item, idx) => (
                  <tr key={idx} className="hover:bg-white/5 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-white">
                      {item.commodity}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-white">{item.mandi}</div>
                      <div className="text-[11px] text-neutral-400 flex items-center gap-1">
                        <MapPin className="w-3 h-3" /> {item.district}, {item.state}
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-right font-mono text-neutral-400">₹{item.minPrice}</td>
                    <td className="py-3.5 px-4 text-right font-mono font-bold text-base text-white">
                      ₹{item.modalPrice}
                    </td>
                    <td className="py-3.5 px-4 text-right font-mono text-neutral-400">₹{item.maxPrice}</td>
                    <td className="py-3.5 px-4 text-center font-mono text-neutral-300">{item.arrivals}</td>
                    <td className="py-3.5 px-4 text-right font-mono font-semibold">
                      <span className={item.change.startsWith("+") ? "text-emerald-400" : "text-red-400"}>
                        {item.change}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right text-neutral-400 font-mono text-[11px]">{item.updatedAt}</td>
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
