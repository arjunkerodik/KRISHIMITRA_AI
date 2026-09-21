"use client";

import React from "react";
import Link from "next/link";
import {
  Sprout,
  Sparkles,
  CloudSun,
  Store,
  Bot,
  ArrowRight,
  CheckCircle2,
  TrendingUp,
  ShieldCheck,
  Smartphone,
  Activity,
  Droplets,
  Calendar,
  Landmark,
} from "lucide-react";
import { useApp } from "@/lib/store";

export default function HomePage() {
  const { user, activeFarm, t } = useApp();

  const features = [
    {
      id: "weather",
      title: t.nav?.weather || "Weather Forecast",
      description: "Real-time IMD radar, precipitation windows, and rainfall forecasts.",
      href: "/weather",
      icon: CloudSun,
      color: "text-sky-400 bg-sky-500/20 border border-sky-400/30",
    },
    {
      id: "crops",
      title: t.nav?.cropAdvisor || "Crop Guidance",
      description: "Personalized agronomic advisory, nutrient dosage & soil NPK balance.",
      href: "/crops",
      icon: Sprout,
      color: "text-emerald-400 bg-emerald-500/20 border border-emerald-400/30",
    },
    {
      id: "market",
      title: t.nav?.market || "Mandi Insights",
      description: "Live AGMARKNET modal rates and transportation profit arbitrage.",
      href: "/market",
      icon: Store,
      color: "text-amber-400 bg-amber-500/20 border border-amber-400/30",
    },
    {
      id: "schemes",
      title: t.nav?.schemes || "Govt Schemes",
      description: "100% verified DBT sovereign schemes from myScheme.gov.in.",
      href: "/schemes",
      icon: Landmark,
      color: "text-purple-400 bg-purple-500/20 border border-purple-400/30",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-transparent text-white">
      
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden py-14 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            
            {/* Left Column: Heading & CTAs */}
            <div className="lg:col-span-7 space-y-6">
              
              {/* Top Pill Label */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/80 backdrop-blur-md text-cyan-300 text-xs font-mono font-bold tracking-wide uppercase border border-cyan-500/30 shadow-[0_0_15px_rgba(6,182,212,0.2)]">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>{t.telemetry?.satelliteStatus || "SOVEREIGN AGRI PLATFORM"}</span>
              </div>

              {/* Large Heading */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.15] drop-shadow-md">
                {t.appName || "KrishiMitra AI"}{" "}
                <span className="bg-gradient-to-r from-cyan-400 via-emerald-400 to-teal-300 bg-clip-text text-transparent">
                  {t.telemetry?.commandCenter || "Operations Command"}
                </span>
              </h1>

              {/* Description */}
              <p className="text-base sm:text-lg text-slate-200 max-w-2xl leading-relaxed font-medium drop-shadow-sm">
                {t.appTagline || "Sovereign AI Smart Agriculture & Digital Twin Command Center"}
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3.5 pt-2">
                <Link
                  href="/dashboard"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-cyan-600 to-emerald-600 hover:from-cyan-500 hover:to-emerald-500 text-white font-bold text-sm shadow-[0_0_20px_rgba(6,182,212,0.3)] border border-cyan-400/40 transition-all active:scale-98 cursor-pointer"
                >
                  <span>{t.nav?.dashboard || "Explore Digital Twin"}</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <Link
                  href="/farmtalk"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-slate-900/80 hover:bg-slate-850 backdrop-blur-xl border border-cyan-500/40 text-cyan-300 hover:text-white font-bold text-sm shadow-xl transition-all cursor-pointer font-mono"
                >
                  <Sparkles className="w-4 h-4 text-cyan-400" />
                  <span>{t.nav?.farmtalk || "FarmTalk AI"}</span>
                </Link>
              </div>

              {/* Trust badges */}
              <div className="flex flex-wrap items-center gap-3 pt-4 text-xs font-mono text-slate-300">
                <div className="flex items-center gap-1.5 bg-slate-900/80 backdrop-blur-md px-3 py-1.5 rounded-xl border border-cyan-500/20 shadow-md">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>{t.dashboard?.todaysPlan || "Personalized Farm Plan"}</span>
                </div>
                <div className="flex items-center gap-1.5 bg-slate-900/80 backdrop-blur-md px-3 py-1.5 rounded-xl border border-cyan-500/20 shadow-md">
                  <CheckCircle2 className="w-4 h-4 text-cyan-400" />
                  <span>{t.telemetry?.mandiSync || "Live APMC Mandi Feeds"}</span>
                </div>
                <div className="flex items-center gap-1.5 bg-slate-900/80 backdrop-blur-md px-3 py-1.5 rounded-xl border border-cyan-500/20 shadow-md">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>{t.schemes?.centralGovt || "Verified DBT Portals"}</span>
                </div>
              </div>

            </div>

            {/* Right Column: Realistic Farm & Smart Agriculture Preview */}
            <div className="lg:col-span-5">
              <div className="relative mx-auto max-w-md lg:max-w-none">
                
                {/* Clean Image Container */}
                <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-cyan-500/30 bg-slate-900/80 aspect-[4/3]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=800&auto=format&fit=crop&q=80"
                    alt="Farmer using smart agriculture technology in green farm field"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/30 to-transparent" />

                  {/* Floating Live Card Overlay */}
                  <div className="absolute bottom-4 left-4 right-4 p-4 rounded-2xl bg-slate-950/85 backdrop-blur-xl border border-cyan-500/30 shadow-2xl text-white">
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                        <span className="text-xs font-mono font-bold text-white">
                          {activeFarm.name} • {t.telemetry?.live || "LIVE"}
                        </span>
                      </div>
                      <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-md bg-emerald-500/20 border border-emerald-400/40 text-emerald-300">
                        86% {t.dashboard?.farmHealthScore || "HEALTH"}
                      </span>
                    </div>

                    <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-800 text-center font-mono">
                      <div>
                        <span className="block text-[10px] text-slate-400">{t.dashboard?.cropStage || "Stage"}</span>
                        <span className="text-xs font-bold text-white">Day 33</span>
                      </div>
                      <div>
                        <span className="block text-[10px] text-slate-400">{t.nav?.weather || "Weather"}</span>
                        <span className="text-xs font-bold text-cyan-300">30°C • Rain PM</span>
                      </div>
                      <div>
                        <span className="block text-[10px] text-slate-400">{t.nav?.market || "Mandi"}</span>
                        <span className="text-xs font-bold text-emerald-400">₹2,780/Q</span>
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 2. FEATURE SECTION */}
      <section id="features" className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {features.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.id}
                href={item.href}
                className="bg-slate-900/80 hover:bg-slate-900/95 backdrop-blur-xl rounded-2xl border border-cyan-500/20 hover:border-cyan-500/50 p-5 shadow-xl transition-all flex flex-col justify-between group cursor-pointer"
              >
                <div>
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3 transition-transform group-hover:scale-105 shadow-md bg-cyan-950/60 border border-cyan-500/30 text-cyan-400">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-sm font-bold text-white mb-1 group-hover:text-cyan-300 transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    {item.description}
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-[11px] font-mono text-cyan-400 font-semibold">
                  <span>{t.actions?.viewDetails || "Explore Hub"}</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            );
          })}
        </div>
      </section>

    </div>
  );
}
