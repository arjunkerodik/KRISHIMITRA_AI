"use client";

import React, { useState } from "react";
import {
  User,
  FlaskConical,
  CloudRain,
  Store,
  Cpu,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  TrendingUp,
  Droplets,
  ScanLine,
} from "lucide-react";

export const DecisionEngineGraph: React.FC = () => {
  const [activeNode, setActiveNode] = useState<string>("engine");

  const nodes = [
    {
      id: "farmer",
      title: "Farmer & Land",
      subtitle: "2.5 Ac • Red Loam • Kolar",
      icon: User,
      color: "border-emerald-500/40 text-emerald-300 bg-black/50",
      description: "Landholding size, crop variety (Arka Rakshak Tomato), sowing day 33, drip irrigation geometry.",
    },
    {
      id: "soil",
      title: "Soil Chemistry",
      subtitle: "N:195 (L) • P:42 • pH 6.8",
      icon: FlaskConical,
      color: "border-amber-500/40 text-amber-300 bg-black/50",
      description: "Real-time stoichiometric NPK balance, organic carbon 0.58%, electrical conductivity, soil moisture index.",
    },
    {
      id: "weather",
      title: "Live Hyperlocal Weather",
      subtitle: "Rain 84% (18.5mm) • Gusts 22k",
      icon: CloudRain,
      color: "border-sky-500/40 text-sky-300 bg-black/50",
      description: "Hourly rain probability window (4:30 PM), overnight relative humidity (88%), wind speed for spray timing.",
    },
    {
      id: "market",
      title: "APMC Mandi Arbitrage",
      subtitle: "Bengaluru ₹2,780 vs Kolar ₹2,450",
      icon: Store,
      color: "border-amber-500/40 text-amber-300 bg-black/50",
      description: "Distance vs transport cost optimization, modal price trends, net estimated return per quintal.",
    },
  ];

  const outputs = [
    {
      title: "1. Skip Irrigation Cycle",
      sub: "18.5mm rain expected at 4:30 PM (Saves 4,200L water)",
      icon: Droplets,
      badge: "Water & Root Protection",
      badgeColor: "bg-sky-500/20 border border-sky-400/30 text-sky-300",
    },
    {
      title: "2. Scout Zone B Lower Canopy",
      sub: "Overnight 88% humidity spiked early blight fungal risk",
      icon: ScanLine,
      badge: "IPM Disease Prevention",
      badgeColor: "bg-rose-500/20 border border-rose-400/30 text-rose-300",
    },
    {
      title: "3. Bengaluru APMC Route (₹2,650 Net)",
      sub: "+₹240/qtl extra profit over local mandi after transport",
      icon: TrendingUp,
      badge: "+₹240/Qtl Margin",
      badgeColor: "bg-emerald-500/20 border border-emerald-400/30 text-emerald-300",
    },
  ];

  return (
    <div className="w-full bg-black/45 backdrop-blur-xl rounded-3xl border border-white/20 p-6 sm:p-8 shadow-2xl overflow-hidden text-white">
      
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto mb-8">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-500/20 text-lime-300 border border-brand-400/30 text-xs font-semibold mb-3">
          <Sparkles className="w-3.5 h-3.5 text-lime-400 animate-pulse" />
          <span>Section 81.3 • Interactive AI Decision Flow</span>
        </div>
        <h3 className="font-display font-bold text-2xl sm:text-3xl text-white tracking-tight drop-shadow-md">
          How Raw Data Becomes <span className="text-lime-400">Action</span>
        </h3>
        <p className="text-sm text-neutral-300 mt-2 font-medium">
          Click any data stream below to see how our deterministic AI orchestration engine calculates today&apos;s daily farm plan.
        </p>
      </div>

      {/* Interactive Node Graph */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        
        {/* Left Inputs (4 Columns) */}
        <div className="lg:col-span-4 space-y-3">
          <div className="text-[11px] font-bold uppercase tracking-wider text-neutral-300 mb-2 px-1">
            Input Streams (Multi-Modal)
          </div>
          {nodes.map((node) => {
            const Icon = node.icon;
            const isSelected = activeNode === node.id;
            return (
              <div
                key={node.id}
                onClick={() => setActiveNode(node.id)}
                className={`p-3.5 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
                  isSelected
                    ? "border-brand-400 bg-black/60 shadow-lg scale-[1.02]"
                    : "border-white/15 bg-black/35 hover:border-white/30"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-black/60 border border-white/20 flex items-center justify-center shrink-0">
                    <Icon className="w-5 h-5 text-lime-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-display font-bold text-xs text-white truncate">
                      {node.title}
                    </h4>
                    <p className="text-[11px] font-mono text-neutral-300 truncate">
                      {node.subtitle}
                    </p>
                  </div>
                  <div className="w-2.5 h-2.5 rounded-full bg-lime-400 animate-ping shrink-0" />
                </div>
              </div>
            );
          })}
        </div>

        {/* Center: AI Decision Engine Hub (4 Columns) */}
        <div className="lg:col-span-4 flex flex-col items-center justify-center p-6 rounded-2xl bg-black/75 text-white border border-brand-400/50 relative shadow-2xl overflow-hidden group">
          
          {/* Background animated SVG grid lines */}
          <div className="absolute inset-0 bg-[radial-gradient(#3f8f45_1px,transparent_1px)] [background-size:16px_16px] opacity-25" />
          
          <div className="w-16 h-16 rounded-2xl bg-brand-500/20 border-2 border-brand-400 flex items-center justify-center text-lime-400 mb-4 animate-node-glow">
            <Cpu className="w-8 h-8" />
          </div>

          <span className="font-display font-bold text-base text-white tracking-wide text-center">
            AI Farm Decision Engine
          </span>
          <p className="text-[11px] text-lime-300 font-mono mt-1 text-center">
            Deterministic + RAG Synthesis
          </p>

          <div className="mt-4 w-full p-3 rounded-lg bg-black/80 border border-white/15 text-[11px] text-neutral-200 leading-relaxed font-sans">
            {activeNode === "engine" && (
              <span>Aggregating real-time agronomic rules, soil chemistry, and localized weather models.</span>
            )}
            {activeNode === "farmer" && (
              <span>Analyzing crop duration: Day 33 (Flowering stage) requires high potassium and low foliage moisture.</span>
            )}
            {activeNode === "soil" && (
              <span>Phosphorus and pH 6.8 are balanced; low nitrogen corrected via scheduled fertigation window.</span>
            )}
            {activeNode === "weather" && (
              <span>Rain probability (84%) triggers automatic irrigation bypass rule & chemical spray postponement.</span>
            )}
            {activeNode === "market" && (
              <span>Transport spread optimization: +₹240/qtl net margin identified at Bengaluru APMC.</span>
            )}
          </div>

          <div className="mt-4 flex items-center gap-1.5 text-[11px] font-semibold text-lime-400">
            <span>Executing 18 tool rules</span>
            <ArrowRight className="w-3 h-3 animate-pulse" />
          </div>
        </div>

        {/* Right Outputs: Today's Personalized Action Plan (4 Columns) */}
        <div className="lg:col-span-4 space-y-3">
          <div className="text-[11px] font-bold uppercase tracking-wider text-neutral-300 mb-2 px-1">
            Personalized Farm Plan (Actions)
          </div>
          {outputs.map((out, idx) => {
            const Icon = out.icon;
            return (
              <div
                key={idx}
                className="p-3.5 rounded-xl border border-white/15 bg-black/40 backdrop-blur-md shadow-lg hover:border-brand-400/40 transition-colors"
              >
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-brand-500/20 text-lime-400 flex items-center justify-center shrink-0 mt-0.5 border border-brand-400/30">
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1 mb-1">
                      <h4 className="font-display font-bold text-xs text-white">
                        {out.title}
                      </h4>
                      <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded ${out.badgeColor}`}>
                        {out.badge}
                      </span>
                    </div>
                    <p className="text-[11px] text-neutral-300 leading-snug">
                      {out.sub}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

      </div>

      {/* Footer explanation */}
      <div className="mt-6 pt-4 border-t border-white/15 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-neutral-300">
        <span className="flex items-center gap-1.5">
          <CheckCircle2 className="w-4 h-4 text-lime-400" />
          Zero numerical hallucinations: All agricultural calculations backed by verified ICAR/UAS agronomic models.
        </span>
        <span className="text-neutral-400 text-[11px] font-mono">
          Last computed: Today 08:30 AM
        </span>
      </div>

    </div>
  );
};
