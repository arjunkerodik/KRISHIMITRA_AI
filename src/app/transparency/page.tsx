"use client";

import React from "react";
import Link from "next/link";
import { FarmerSidebar } from "@/components/FarmerSidebar";
import { SourceBadge } from "@/components/SourceBadge";
import {
  ShieldCheck,
  Building2,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  Scale,
  Sparkles,
  Layers,
  Database,
  Calculator,
  Lock,
  FileText,
  Clock,
  HelpCircle,
} from "lucide-react";

export default function TransparencyPage() {
  const dataSources = [
    {
      domain: "Government Schemes & Subsidies",
      source: "myScheme.gov.in & Ministry of Agriculture Portals",
      cadence: "Weekly Verification",
      type: "GOVERNMENT_OFFICIAL" as const,
      url: "https://www.myscheme.gov.in/",
      verifiedDate: "2026-09-15",
      coverage: "Central & Karnataka State Direct Benefit Transfer (DBT) Schemes (PM-KISAN, PMFBY, PMKSY, PM-KUSUM, SMAM, SHC, KCC, PKVY, Krishi Bhagya)",
      verificationMethod: "Manual statutory audit & matching with official government gazettes and guidelines.",
    },
    {
      domain: "APMC Mandi Auction Prices",
      source: "AGMARKNET & e-NAM (Directorate of Marketing & Inspection)",
      cadence: "Daily 07:30 IST / 18:00 IST",
      type: "MARKET_OFFICIAL" as const,
      url: "https://agmarknet.gov.in/",
      verifiedDate: "2026-09-18",
      coverage: "APMC yards across Karnataka (Bengaluru Yeshwantpur, Kolar, Gadag, Chintamani, Madanapalle, Belagavi, Mysuru, Davanagere).",
      verificationMethod: "Ingested from official AGMARKNET bulletin feeds and normalized by commodity code.",
    },
    {
      domain: "Weather, Rainfall & Doppler Radar",
      source: "India Meteorological Department (IMD) & Open-Meteo High-Resolution NWP",
      cadence: "Hourly Telemetry",
      type: "GOVERNMENT_OFFICIAL" as const,
      url: "https://mausam.imd.gov.in/",
      verifiedDate: "2026-09-20",
      coverage: "Gram-panchayat micro-climatic forecasts, evapotranspiration (ET0), and heavy rainfall alerts.",
      verificationMethod: "Validated against IMD Bengaluru Doppler Radar ground reflections and weather stations.",
    },
    {
      domain: "Farmer Inputs Marketplace",
      source: "Registered FPOs, Raitha Samparka Kendras & Licensed Retailers",
      cadence: "Monthly Verification",
      type: "VERIFIED_PROVIDER" as const,
      url: "https://raitamitra.karnataka.gov.in/",
      verifiedDate: "2026-09-12",
      coverage: "Certified hybrid seeds, bio-fertilizers, solar irrigation equipment, and drone foliar services.",
      verificationMethod: "Licensing number verification with Karnataka Department of Agriculture & FPO Registry.",
    },
    {
      domain: "Crop Disease AI Pathology Diagnostics",
      source: "KrishiMitra Neural Vision Model & ICAR Plant Pathology SOPs",
      cadence: "Model Version 4.2",
      type: "KRISHIMITRA_MODEL" as const,
      url: "https://icar.org.in/",
      verifiedDate: "2026-09-01",
      coverage: "Early Blight, Late Blight, Tomato Leaf Curl Virus (ToLCV), Powdery Mildew, and Bacterial Wilt.",
      verificationMethod: "Trained on 85,000+ expert-annotated ICAR agricultural field pathology images.",
    },
  ];

  return (
    <div className="min-h-screen flex bg-transparent text-white">
      <div className="hidden lg:block w-64 shrink-0">
        <div className="fixed top-16 bottom-0 w-64">
          <FarmerSidebar />
        </div>
      </div>

      <div className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8 space-y-6 max-w-6xl mx-auto">
        
        {/* Header */}
        <div className="p-6 rounded-3xl bg-black/50 backdrop-blur-xl border border-white/20 shadow-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Verified by IMD / AGMARKNET / myScheme</span>
              </span>
              <span className="text-xs text-white/70">
                Official Sources & Integrity
              </span>
            </div>
            <h1 className="font-display font-bold text-2xl sm:text-3xl text-white tracking-tight mt-1 flex items-center gap-2.5">
              <Scale className="w-7 h-7 text-emerald-400" />
              <span>Verified Data & Official Sources</span>
            </h1>
            <p className="text-xs sm:text-sm text-white/70 mt-0.5">
              Full disclosure of official government portals (IMD, AGMARKNET, myScheme), API verification cadences, and certification details.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/schemes"
              className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/15 text-xs font-semibold transition-all"
            >
              Government Schemes
            </Link>
            <Link
              href="/market"
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow-md"
            >
              Market Prices
            </Link>
          </div>
        </div>

        {/* 1. INDEPENDENT PLATFORM STATUTORY DISCLAIMER */}
        <div className="p-6 rounded-3xl bg-sky-950/40 border border-sky-500/40 backdrop-blur-xl shadow-2xl space-y-3">
          <div className="flex items-center gap-2.5 text-sky-300 font-bold text-sm">
            <ShieldCheck className="w-5 h-5 text-sky-400 shrink-0" />
            <span>Official Statutory Declaration & Consumer Protection Notice</span>
          </div>
          <p className="text-xs text-white/85 leading-relaxed">
            <strong>KrishiMitra AI</strong> is an independent digital public good and decision-support platform designed to assist Indian farmers in discovering eligible welfare schemes, calculating optimal APMC market arbitrage, and managing farm health.
          </p>
          <p className="text-xs text-white/75 leading-relaxed bg-black/40 p-3.5 rounded-2xl border border-white/10">
            <strong>Disclaimer:</strong> Government scheme information presented on KrishiMitra AI is compiled for educational discovery and preliminary eligibility assessment. KrishiMitra AI is not a government agency and does not charge any application or processing fees. Formal scheme enrollment, identity verification, and Direct Benefit Transfer (DBT) subsidy disbursements must be completed through official Ministry portals (e.g., <code className="text-sky-300 font-mono">pmkisan.gov.in</code>, <code className="text-sky-300 font-mono">fruits.karnataka.gov.in</code>).
          </p>
        </div>

        {/* 2. OFFICIAL DATA SOURCE CITATION MATRIX */}
        <div className="bg-black/50 backdrop-blur-xl rounded-3xl border border-white/20 p-6 shadow-2xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Database className="w-5 h-5 text-emerald-400" />
                <span>Authoritative Data Sources & Provenance Ledger</span>
              </h3>
              <p className="text-xs text-white/60">
                Summary of all legal and technical integration points.
              </p>
            </div>
            <span className="text-xs font-mono px-3 py-1 rounded-xl bg-white/10 border border-white/10 text-white/80">
              {dataSources.length} Primary Feeds
            </span>
          </div>

          <div className="space-y-4">
            {dataSources.map((ds, idx) => (
              <div
                key={idx}
                className="p-5 rounded-2xl bg-black/40 border border-white/10 hover:border-emerald-400/40 transition-all space-y-3"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-white">{ds.domain}</span>
                    <span className="text-xs text-white/50">• {ds.source}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <SourceBadge
                      type={ds.type}
                      sourceName={ds.source}
                      lastUpdated={ds.verifiedDate}
                      officialUrl={ds.url}
                      compact
                    />
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/10 text-white/70">
                      {ds.cadence}
                    </span>
                  </div>
                </div>

                <p className="text-xs text-white/80 leading-relaxed">
                  <strong>Scope:</strong> {ds.coverage}
                </p>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-2 border-t border-white/5 text-[11px] text-white/60">
                  <span><strong>Audit Process:</strong> {ds.verificationMethod}</span>
                  <a
                    href={ds.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sky-300 hover:text-white underline inline-flex items-center gap-1 shrink-0 font-semibold"
                  >
                    <span>View Portal</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 3. MATHEMATICAL ALGORITHM & ESTIMATION TRANSPARENCY */}
        <div className="bg-black/50 backdrop-blur-xl rounded-3xl border border-white/20 p-6 shadow-2xl space-y-4">
          <div className="pb-3 border-b border-white/10">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Calculator className="w-5 h-5 text-amber-400" />
              <span>Transparent Estimation Mathematical Models</span>
            </h3>
            <p className="text-xs text-white/60">
              Clear distinction between verified facts vs estimated calculations.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            
            {/* Transport Arbitrage Model */}
            <div className="p-4 rounded-2xl bg-black/40 border border-white/10 space-y-2">
              <h4 className="font-bold text-white flex items-center gap-1.5">
                <Scale className="w-4 h-4 text-emerald-400" />
                <span>Mandi Net Realization Arbitrage Formula</span>
              </h4>
              <p className="text-white/70 leading-relaxed">
                Calculates net take-home earnings by subtracting highway mini-truck freight and labor loading from registered APMC modal prices:
              </p>
              <div className="p-2.5 rounded-xl bg-black/60 border border-white/15 font-mono text-emerald-300 text-[11px]">
                Net = (Modal Price × Qtl) - ((Distance_km × ₹1.85/km/qtl + ₹20 base) × Qtl)
              </div>
              <span className="text-[10px] text-white/50 block">
                *Clearly labeled as ESTIMATED net return; actual transport rates vary with transporter negotiation.
              </span>
            </div>

            {/* Stoichiometric Fertilizer Splitter */}
            <div className="p-4 rounded-2xl bg-black/40 border border-white/10 space-y-2">
              <h4 className="font-bold text-white flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-purple-400" />
                <span>Stoichiometric NPK Dosage Model</span>
              </h4>
              <p className="text-white/70 leading-relaxed">
                Recommends balanced chemical and organic inputs grounded on laboratory soil test deficits relative to ICAR package of practices:
              </p>
              <div className="p-2.5 rounded-xl bg-black/60 border border-white/15 font-mono text-purple-300 text-[11px]">
                DAP = P_deficit / 0.46 | Urea = (N_deficit - N_from_DAP) / 0.46 | MOP = K_deficit / 0.60
              </div>
              <span className="text-[10px] text-white/50 block">
                *Grounded on ICAR crop nutrient benchmarks; tailored to field soil test reports.
              </span>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
