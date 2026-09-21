"use client";

import React from "react";
import { useApp } from "@/lib/store";
import {
  ShieldAlert,
  CloudRain,
  Bug,
  Droplets,
  Store,
  ScanLine,
  CheckCircle2,
  AlertTriangle,
  Info,
} from "lucide-react";

export const RiskScoreMeter: React.FC = () => {
  const { activeFarm } = useApp();

  const riskScore = activeFarm.riskScore || 28;

  const getRiskLabel = (score: number) => {
    if (score < 35) return { label: "Low Risk (Safe)", color: "text-brand-600 dark:text-brand-400", bg: "bg-brand-50 dark:bg-brand-950/40 border-brand-200" };
    if (score < 65) return { label: "Moderate Risk", color: "text-alert-600 dark:text-alert-400", bg: "bg-alert-50 dark:bg-alert-950/40 border-alert-200" };
    return { label: "High Risk (Critical)", color: "text-danger-600 dark:text-danger-400", bg: "bg-danger-50 dark:bg-danger-950/40 border-danger-200" };
  };

  const status = getRiskLabel(riskScore);

  const breakdowns = [
    { title: "Disease Risk", score: 42, icon: ScanLine, color: "bg-danger-500", note: "Overnight 88% humidity" },
    { title: "Weather Volatility", score: 35, icon: CloudRain, color: "bg-alert-500", note: "Afternoon thunderstorm" },
    { title: "Market Volatility", score: 25, icon: Store, color: "bg-alert-400", note: "Tomato price spread" },
    { title: "Pest Pressure", score: 18, icon: Bug, color: "bg-brand-500", note: "Low whitefly trap counts" },
    { title: "Water Supply Risk", score: 12, icon: Droplets, color: "bg-sky-500", note: "Borewell + Drip assured" },
  ];

  return (
    <div className="w-full bg-black/45 backdrop-blur-xl rounded-3xl border border-white/20 p-5 sm:p-6 shadow-2xl text-white">
      
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-white/15">
        <div className="flex items-center gap-2">
          <ShieldAlert className="w-5 h-5 text-lime-400" />
          <h3 className="font-display font-bold text-base text-white">
            Explainable Farm Risk Index
          </h3>
        </div>
        <span className="text-[10px] uppercase tracking-wider font-bold px-2.5 py-0.5 rounded-lg bg-white/10 text-neutral-300 border border-white/10">
          Section 32
        </span>
      </div>

      {/* Main Score Dial */}
      <div className="my-4 flex items-center justify-between gap-4 p-4 rounded-2xl bg-black/40 border border-white/15 backdrop-blur-md">
        <div>
          <span className="text-xs font-semibold text-neutral-300 uppercase tracking-wider block">
            Composite Risk
          </span>
          <div className="flex items-baseline gap-1.5 my-1">
            <span className="font-display font-extrabold text-3xl text-white drop-shadow-md">
              {riskScore}
            </span>
            <span className="text-xs font-bold text-neutral-400">/ 100</span>
          </div>
          <span className="text-xs font-bold px-2.5 py-0.5 rounded-full border bg-lime-500/20 text-lime-300 border-lime-400/30">
            {status.label}
          </span>
        </div>

        {/* Mini Meter Bar */}
        <div className="w-32 sm:w-44 space-y-1.5">
          <div className="flex justify-between text-[10px] text-neutral-300 font-mono">
            <span>0 (Safe)</span>
            <span>100 (Risk)</span>
          </div>
          <div className="w-full h-3 bg-white/15 rounded-full overflow-hidden flex border border-white/10">
            <div
              className="h-full bg-brand-500 transition-all duration-500"
              style={{ width: `${riskScore}%` }}
            />
          </div>
        </div>
      </div>

      {/* Breakdown Factors */}
      <div className="space-y-2.5">
        <h4 className="text-[11px] font-bold uppercase tracking-wider text-neutral-300">
          Category Risk Vectors
        </h4>
        {breakdowns.map((b) => {
          const Icon = b.icon;
          return (
            <div key={b.title} className="flex items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2 min-w-0">
                <Icon className="w-3.5 h-3.5 text-lime-400 shrink-0" />
                <span className="text-neutral-200 font-medium truncate">
                  {b.title}
                </span>
                <span className="text-[10px] text-neutral-400 hidden sm:inline">({b.note})</span>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <div className="w-20 h-1.5 bg-white/15 rounded-full overflow-hidden">
                  <div className={`h-full ${b.color}`} style={{ width: `${b.score}%` }} />
                </div>
                <span className="font-mono text-[11px] font-bold text-white w-6 text-right">
                  {b.score}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Top Mitigation Advice */}
      <div className="mt-4 pt-3 border-t border-white/15 flex items-start gap-2 text-[11px] text-neutral-300">
        <CheckCircle2 className="w-3.5 h-3.5 text-lime-400 shrink-0 mt-0.5" />
        <span>
          <strong className="text-white">Top Risk Mitigation:</strong> Scout Zone B for early blight fungal lesions following overnight high relative humidity.
        </span>
      </div>

    </div>
  );
};
