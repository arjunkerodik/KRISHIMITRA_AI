"use client";

import React, { useState } from "react";
import Link from "next/link";
import { FarmerSidebar } from "@/components/FarmerSidebar";
import { useApp } from "@/lib/store";
import {
  ShoppingBag,
  BookOpen,
  Sprout,
  Store,
  CloudSun,
  Landmark,
  Search,
  CheckCircle2,
  Video,
  HelpCircle,
  Phone,
  Tag,
  Star,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  Package,
} from "lucide-react";

interface GuideItem {
  id: string;
  category: "guides" | "crops" | "schemes" | "market" | "weather" | "supplies" | "faqs";
  title: string;
  source: string;
  description: string;
  badge: string;
  linkText: string;
  linkHref: string;
}

export default function ResourcesPage() {
  const { activeFarm, showToast } = useApp();
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const categories = [
    { id: "all", label: "All Resources" },
    { id: "guides", label: "Farming Guides" },
    { id: "crops", label: "Crop Guides" },
    { id: "schemes", label: "Govt Schemes" },
    { id: "market", label: "Market Insights" },
    { id: "weather", label: "Weather Advisories" },
    { id: "supplies", label: "Certified Inputs" },
    { id: "faqs", label: "Videos & FAQs" },
  ];

  const resourceItems: GuideItem[] = [
    {
      id: "res-1",
      category: "guides",
      title: "ICAR Integrated Pest Management Guide for Tomato",
      source: "ICAR-IIHR Hessarghatta",
      description: "Standard operating procedures for managing Early Blight, Late Blight, and ToLCV vectors with biological and chemical controls.",
      badge: "ICAR Certified",
      linkText: "Read SOP Guide",
      linkHref: "/disease",
    },
    {
      id: "res-2",
      category: "crops",
      title: "Arka Rakshak F1 Hybrid Package of Practices",
      source: "Directorate of Horticulture, Karnataka",
      description: "Step-by-step nursery management, fertigation schedule, and flower-to-fruit set ratios for peri-urban horticulture.",
      badge: "High Yield",
      linkText: "View Crop Plan",
      linkHref: "/crop-calendar",
    },
    {
      id: "res-3",
      category: "schemes",
      title: "PMKSY 90% Micro-Irrigation Drip Subsidy Dossier",
      source: "Department of Agriculture & Farmers Welfare",
      description: "Eligibility checklist, quotation generation, and direct benefit transfer documentation for small & marginal farmers.",
      badge: "₹48,500 Benefit",
      linkText: "Check Eligibility",
      linkHref: "/schemes",
    },
    {
      id: "res-4",
      category: "market",
      title: "e-NAM & APMC Interstate Trading Handbook",
      source: "Ministry of Agriculture",
      description: "How to eliminate middleman commissions and trade farm harvest directly with Bengaluru, Kolar, and Chennai buyers.",
      badge: "Best Realization",
      linkText: "View APMC Rates",
      linkHref: "/market",
    },
    {
      id: "res-5",
      category: "weather",
      title: "IMD Doppler Weather Advisory & ET0 Irrigation Tables",
      source: "India Meteorological Department (Bengaluru Station)",
      description: "Calibrated rainfall probability interpretation and crop water evapotranspiration calculations.",
      badge: "Live Forecast",
      linkText: "Open Forecast",
      linkHref: "/weather",
    },
    {
      id: "res-6",
      category: "supplies",
      title: "IFFCO Water-Soluble 13:0:45 Potassium Nitrate",
      source: "IFFCO Farmer Center Kolar",
      description: "Certified water-soluble fertilizer for drip fertigation. Free delivery to Narasapura panchayat cluster.",
      badge: "₹1,450 / 25kg",
      linkText: "Order Input",
      linkHref: "#",
    },
    {
      id: "res-7",
      category: "faqs",
      title: "Video: How to Install Pheromone Traps for Fruit Borer",
      source: "UAS Bangalore Extension Video",
      description: "Step-by-step visual demonstration on trap height, lure replacement, and boundary density in tomato fields.",
      badge: "12 min Video",
      linkText: "Watch Video",
      linkHref: "/farmtalk",
    },
    {
      id: "res-8",
      category: "faqs",
      title: "Farmer FAQ: What to do if heavy rain follows fungicide spray?",
      source: "KVK Extension Q&A",
      description: "Explains rain-fast intervals (3 hours for systemic vs. contact fungicides) and when re-application is necessary.",
      badge: "FAQ",
      linkText: "Ask AI",
      linkHref: "/farmtalk",
    },
  ];

  const filtered = resourceItems.filter((item) => {
    const matchesCat = selectedCategory === "all" || item.category === selectedCategory;
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.source.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

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
                Farmer Knowledge & Resource Hub
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-1">
              Agricultural Guides & Resources
            </h1>
            <p className="text-sm text-white/70 mt-0.5">
              Curated package of practices, ICAR advisories, government subsidy guidelines, and video tutorials.
            </p>
          </div>

          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
            <input
              type="text"
              placeholder="Search guides, supplies, FAQs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full text-xs rounded-xl border border-white/20 bg-black/60 text-white placeholder-white/40 pl-9 pr-3 py-2.5 focus:outline-none focus:border-emerald-500"
            />
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap items-center gap-2">
          {categories.map((c) => (
            <button
              key={c.id}
              onClick={() => setSelectedCategory(c.id)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                selectedCategory === c.id
                  ? "bg-emerald-600 text-white shadow-lg border border-emerald-400/40"
                  : "bg-black/40 text-white/70 hover:bg-black/60 hover:text-white border border-white/10"
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>

        {/* Resource Items Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filtered.map((item) => (
            <div
              key={item.id}
              className="bg-black/50 backdrop-blur-xl rounded-3xl border border-white/20 p-6 shadow-2xl hover:border-emerald-500/50 transition-all flex flex-col justify-between text-white"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">
                    {item.source}
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    {item.badge}
                  </span>
                </div>

                <h3 className="text-sm font-bold text-white mb-2 leading-snug">
                  {item.title}
                </h3>
                <p className="text-xs text-white/70 leading-relaxed">
                  {item.description}
                </p>
              </div>

              <div className="pt-4 mt-4 border-t border-white/10 flex items-center justify-between">
                <span className="text-[11px] text-white/50">AgriCare Verified</span>
                <Link
                  href={item.linkHref}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-400 hover:text-emerald-300 transition-colors"
                >
                  <span>{item.linkText}</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
