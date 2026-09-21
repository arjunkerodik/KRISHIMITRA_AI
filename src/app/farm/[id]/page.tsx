"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { 
  Tractor, 
  MapPin, 
  Layers, 
  Droplets, 
  FlaskConical, 
  Sparkles, 
  Calendar, 
  ArrowRight,
  TrendingUp,
  Activity,
  CheckCircle2,
  AlertTriangle,
  ChevronRight
} from "lucide-react";
import { useApp } from "@/lib/store";
import { RiskScoreMeter } from "@/components/RiskScoreMeter";
import { DigitalTwinViewer } from "@/components/DigitalTwinViewer";

export default function FarmDetailPage() {
  const params = useParams();
  const { language, farms, activeFarm } = useApp();
  const farmId = params.id as string;

  const farm = farms.find(f => f.id === farmId) || activeFarm;

  return (
    <div className="min-h-screen bg-transparent text-white py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Breadcrumb & Plot Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 p-6 rounded-3xl bg-black/45 backdrop-blur-xl border border-white/20 shadow-2xl">
          <div>
            <div className="flex items-center gap-2 text-xs font-medium text-neutral-300 mb-1">
              <Link href="/dashboard" className="hover:text-brand-300">Dashboard</Link>
              <span>/</span>
              <Link href="/farm" className="hover:text-brand-300">Farms</Link>
              <span>/</span>
              <span className="text-white font-semibold">{farm.name}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-display font-bold text-white flex items-center gap-3">
              <Tractor className="w-8 h-8 text-brand-400" />
              {farm.name} — Plot Specification & Diagnostics
            </h1>
            <p className="text-sm text-neutral-200 mt-1 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-neutral-300" />
              {farm.village}, {farm.district}, {farm.state} • {farm.areaAcres} Acres Total Area • Soil Type: {farm.soilType}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/crops/recommendation"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-sm transition-all shadow-lg border border-brand-400/40"
            >
              <Sparkles className="w-4 h-4" />
              Optimize Plot Decisions
            </Link>
          </div>
        </div>

        {/* Plot KPI Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 rounded-2xl bg-black/45 backdrop-blur-xl border border-white/20 shadow-2xl">
            <span className="text-xs font-medium text-neutral-300">Current Standing Crop</span>
            <div className="mt-1 text-lg font-bold font-display text-white">
              {farm.currentCrop}
            </div>
            <p className="text-xs text-brand-300 mt-1">Stage: {farm.cropStage}</p>
          </div>

          <div className="p-4 rounded-2xl bg-black/45 backdrop-blur-xl border border-white/20 shadow-2xl">
            <span className="text-xs font-medium text-neutral-300">Irrigation Setup</span>
            <div className="mt-1 text-lg font-bold font-display text-white">
              {farm.irrigationType}
            </div>
            <p className="text-xs text-emerald-300 mt-1">{farm.waterSource}</p>
          </div>

          <div className="p-4 rounded-2xl bg-black/45 backdrop-blur-xl border border-white/20 shadow-2xl">
            <span className="text-xs font-medium text-neutral-300">Crop Health Index</span>
            <div className="mt-1 text-lg font-bold font-display text-emerald-400">
              {farm.healthScore} / 100
            </div>
            <p className="text-xs text-neutral-300 mt-1">Risk Score: {farm.riskScore}/100</p>
          </div>

          <div className="p-4 rounded-2xl bg-black/45 backdrop-blur-xl border border-white/20 shadow-2xl">
            <span className="text-xs font-medium text-neutral-300">PMFBY Crop Insurance</span>
            <div className="mt-1 text-lg font-bold font-display text-emerald-400 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4" /> Active Policy
            </div>
            <p className="text-xs text-neutral-300 mt-1">Sum Insured: ₹1,50,000</p>
          </div>
        </div>

        {/* Digital Twin Viewer Component */}
        <DigitalTwinViewer />

        {/* Risk Breakdown Component */}
        <RiskScoreMeter />
      </div>
    </div>
  );
}
