"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useApp } from "@/lib/store";
import { FarmerSidebar } from "@/components/FarmerSidebar";
import {
  Sprout,
  MapPin,
  CloudSun,
  ScanLine,
  Store,
  Bot,
  Sparkles,
  Volume2,
  VolumeX,
  ArrowRight,
  TrendingUp,
  Calendar,
  CheckCircle2,
  AlertTriangle,
  ChevronRight,
} from "lucide-react";

export default function DashboardPage() {
  const { user, activeFarm, language, showToast } = useApp();
  const [isSpeakingPlan, setIsSpeakingPlan] = useState(false);

  // Voice speech synthesis for today's AI recommendation
  const handleSpeakPlan = () => {
    if (!("speechSynthesis" in window)) {
      showToast("Voice Unavailable", "Speech synthesis is not supported on this browser.", "info");
      return;
    }
    if (isSpeakingPlan) {
      window.speechSynthesis.cancel();
      setIsSpeakingPlan(false);
      return;
    }
    window.speechSynthesis.cancel();

    const planText = language === "hi"
      ? `नमस्ते ${user.name}. आपके ${activeFarm.name} खेत के लिए आज की एआई सलाह: आज शाम को 18 मिलीमीटर भारी बारिश का अनुमान है, इसलिए ड्रिप सिंचाई रोक दें। आर्द्रता 88% होने के कारण लेट ब्लाइट का खतरा है, एग्रीकेयर से पत्ते की जांच करें।`
      : language === "kn"
      ? `ನಮಸ್ಕಾರ ${user.name}. ನಿಮ್ಮ ${activeFarm.name} ಜಮೀನಿಗೆ ಇಂದಿನ ಎಐ ಕೃಷಿ ಸಲಹೆ: ಇಂದು ಸಂಜೆ ಮಳೆ ಸಾಧ್ಯತೆ ಇರುವುದರಿಂದ ಹನಿ ನೀರಾವರಿ ನಿಲ್ಲಿಸಿ. ತೇವಾಂಶ ಹೆಚ್ಚಿರುವುದರಿಂದ ರೋಗ ಪತ್ತೆಗಾಗಿ ಅಗ್ರಿಕೇರ್ ಸ್ಕ್ಯಾನರ್ ಬಳಸಿ.`
      : `Good day ${user.name}. Today's AI recommendation for ${activeFarm.name}: Skip afternoon drip irrigation as 18.5mm rainfall is forecast at 4:30 PM. High humidity (88%) elevates Early Blight risk—check lower leaf canopy.`;

    const utterance = new SpeechSynthesisUtterance(planText);
    utterance.lang = language === "hi" ? "hi-IN" : language === "kn" ? "kn-IN" : "en-IN";
    utterance.rate = 0.95;
    utterance.onend = () => setIsSpeakingPlan(false);
    utterance.onerror = () => setIsSpeakingPlan(false);
    setIsSpeakingPlan(true);
    window.speechSynthesis.speak(utterance);
  };

  const quickActions = [
    {
      id: "scan",
      label: "Scan Crop",
      description: "AI Disease Diagnosis",
      href: "/disease",
      icon: ScanLine,
      color: "bg-emerald-600 hover:bg-emerald-700 text-white",
    },
    {
      id: "weather",
      label: "View Weather",
      description: "7-Day Doppler Forecast",
      href: "/weather",
      icon: CloudSun,
      color: "bg-sky-600 hover:bg-sky-700 text-white",
    },
    {
      id: "market",
      label: "Check Market",
      description: "Live APMC Realization",
      href: "/market",
      icon: Store,
      color: "bg-amber-600 hover:bg-amber-700 text-white",
    },
    {
      id: "farmtalk",
      label: "Ask FarmTalk AI",
      description: "Smart Crop Copilot",
      href: "/farmtalk",
      icon: Bot,
      color: "bg-purple-600 hover:bg-purple-700 text-white",
    },
  ];

  return (
    <div className="min-h-screen flex bg-transparent text-white">
      
      {/* Desktop Left Sidebar */}
      <div className="hidden lg:block w-64 shrink-0">
        <div className="fixed top-16 bottom-0 w-64">
          <FarmerSidebar />
        </div>
      </div>

      {/* Main Dashboard Content */}
      <div className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto space-y-6">
        
        {/* 1. TOP GREETING & CONTEXT HEADER */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-black/50 backdrop-blur-xl rounded-3xl border border-white/20 p-6 shadow-2xl">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2">
              <span>Good Morning, {user.name.split(" ")[0]} 👋</span>
            </h1>
            <p className="text-sm text-white/75 mt-1 font-medium">
              Here&apos;s what&apos;s happening on your farm today.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/crop-calendar"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-400/30 hover:bg-emerald-500/30 transition-colors shadow-sm"
            >
              <Calendar className="w-4 h-4 text-emerald-400" />
              <span>Day 33 • Flowering Stage</span>
            </Link>

            <button
              onClick={handleSpeakPlan}
              className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                isSpeakingPlan
                  ? "bg-amber-500/30 text-amber-200 border-amber-400/50"
                  : "bg-black/40 hover:bg-white/10 text-white border-white/20 shadow-xs"
              }`}
              title="Listen to today's AI advice"
            >
              {isSpeakingPlan ? <VolumeX className="w-4 h-4 text-amber-300 animate-pulse" /> : <Volume2 className="w-4 h-4 text-white/80" />}
              <span className="hidden sm:inline">{isSpeakingPlan ? "Stop Audio" : "Listen Advice"}</span>
            </button>
          </div>
        </div>

        {/* 2. TODAY'S MAIN OVERVIEW GRID (FARM OVERVIEW & WEATHER) */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          
          {/* LEFT / MAIN: Farm Overview */}
          <div className="md:col-span-7 bg-black/50 backdrop-blur-xl rounded-3xl border border-white/20 p-6 shadow-2xl flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between gap-2 pb-4 border-b border-white/10">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 flex items-center justify-center">
                    <Sprout className="w-4 h-4" />
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-white">Farm Overview</h2>
                    <p className="text-xs text-white/60 flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-emerald-400" />
                      <span>{activeFarm.village}, {activeFarm.district}</span>
                    </p>
                  </div>
                </div>

                <Link
                  href="/crop-calendar"
                  className="text-xs font-bold text-emerald-400 hover:text-emerald-300 inline-flex items-center gap-1"
                >
                  <span>Farm Plan</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-4">
                <div>
                  <span className="block text-[11px] font-medium text-white/50 uppercase tracking-wider">Farm Name</span>
                  <span className="text-sm font-bold text-white">{activeFarm.name}</span>
                </div>
                <div>
                  <span className="block text-[11px] font-medium text-white/50 uppercase tracking-wider">Standing Crop</span>
                  <span className="text-sm font-bold text-white">{activeFarm.currentCrop}</span>
                </div>
                <div>
                  <span className="block text-[11px] font-medium text-white/50 uppercase tracking-wider">Plot Area</span>
                  <span className="text-sm font-bold text-white">{activeFarm.areaAcres} Acres</span>
                </div>
                <div>
                  <span className="block text-[11px] font-medium text-white/50 uppercase tracking-wider">Current Stage</span>
                  <span className="text-sm font-bold text-emerald-400">Flowering</span>
                </div>
              </div>
            </div>

            {/* AI Highlight Banner inside Overview */}
            <div className="p-3.5 rounded-2xl bg-black/40 border border-white/15 text-xs text-white/90 font-medium">
              <strong className="text-emerald-300">Today&apos;s Priority: </strong>
              <span>Postpone evening drip irrigation — 18.5mm rain expected around 4:30 PM (84% probability).</span>
            </div>
          </div>

          {/* RIGHT: Today's Weather */}
          <div className="md:col-span-5 bg-black/50 backdrop-blur-xl rounded-3xl border border-white/20 p-6 shadow-2xl flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between gap-2 pb-4 border-b border-white/10">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-sky-500/20 border border-sky-400/30 text-sky-300 flex items-center justify-center">
                    <CloudSun className="w-4 h-4" />
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-white">Today&apos;s Weather</h2>
                    <p className="text-xs text-white/60">IMD Doppler • Live Station</p>
                  </div>
                </div>

                <Link
                  href="/weather"
                  className="text-xs font-bold text-sky-400 hover:text-sky-300 inline-flex items-center gap-1"
                >
                  <span>Forecast</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              <div className="flex items-center justify-between py-4">
                <div>
                  <span className="text-3xl sm:text-4xl font-extrabold text-white">30°C</span>
                  <span className="block text-xs font-medium text-white/70 mt-0.5">Partly Cloudy • Rain PM</span>
                </div>
                <div className="text-right space-y-1 text-xs">
                  <div className="text-white/80">
                    <span className="text-white/50">Rain Prob: </span>
                    <span className="font-bold text-sky-300">84% (18.5 mm)</span>
                  </div>
                  <div className="text-white/80">
                    <span className="text-white/50">Humidity: </span>
                    <span className="font-bold text-white">88% (High)</span>
                  </div>
                  <div className="text-white/80">
                    <span className="text-white/50">Wind: </span>
                    <span className="font-bold text-white">12 km/h WSW</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-white/10 flex items-center justify-between text-xs text-white/60">
              <span>Spray Window: Safe before 1:30 PM</span>
              <span className="text-emerald-400 font-medium">Synced 10m ago</span>
            </div>
          </div>

        </div>

        {/* 3. CROP HEALTH SECTION */}
        <div className="bg-black/50 backdrop-blur-xl rounded-3xl border border-white/20 p-6 shadow-2xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-white">Crop Health Status</h2>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-400/40">
                  Healthy
                </span>
              </div>
              <p className="text-xs text-white/70 mt-0.5">
                Vegetative index (NDVI 0.78) and soil moisture are within optimal range for {activeFarm.currentCrop}.
              </p>
            </div>

            <div className="flex items-center gap-3 self-start sm:self-auto">
              <span className="text-2xl font-extrabold text-emerald-400">86%</span>
              <Link
                href="/crops"
                className="text-xs font-bold px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors border border-white/15"
              >
                View Details
              </Link>
            </div>
          </div>

          {/* Progress Bar Visual Indicator */}
          <div className="w-full bg-white/10 rounded-full h-3 overflow-hidden border border-white/10">
            <div
              className="bg-emerald-500 h-3 rounded-full transition-all duration-500"
              style={{ width: "86%" }}
            />
          </div>

          <div className="grid grid-cols-3 gap-4 pt-4 mt-4 border-t border-white/10 text-center text-xs">
            <div>
              <span className="block text-white/50">Nitrogen Level</span>
              <span className="font-bold text-white">195 kg/ha (Medium)</span>
            </div>
            <div>
              <span className="block text-white/50">Soil Moisture</span>
              <span className="font-bold text-emerald-400">32% (Optimal)</span>
            </div>
            <div>
              <span className="block text-white/50">Disease Threat</span>
              <span className="font-bold text-amber-400">Early Blight Risk</span>
            </div>
          </div>
        </div>

        {/* 4. QUICK ACTIONS (EXACTLY 4 CLEAN ACTION BUTTONS) */}
        <div>
          <h2 className="text-sm font-bold uppercase tracking-wider text-white/80 mb-3 drop-shadow-sm">
            Quick Actions
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {quickActions.map((action) => {
              const Icon = action.icon;
              return (
                <Link
                  key={action.id}
                  href={action.href}
                  className={`flex flex-col items-start p-4 rounded-2xl shadow-xl hover:shadow-2xl transition-all active:scale-98 cursor-pointer border ${action.color}`}
                >
                  <div className="p-2 rounded-xl bg-white/20 mb-3">
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-sm font-bold block text-white">{action.label}</span>
                  <span className="text-[11px] text-white/80 mt-0.5 block">{action.description}</span>
                </Link>
              );
            })}
          </div>
        </div>

        {/* 5. RECENT FARM ACTIVITY / UPDATES (CLEAN TIMELINE) */}
        <div className="bg-black/50 backdrop-blur-xl rounded-3xl border border-white/20 p-6 shadow-2xl">
          <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-4">
            <h2 className="text-base font-bold text-white">Recent Farm Updates</h2>
            <Link href="/weather/alerts" className="text-xs text-emerald-400 font-semibold hover:underline">
              View All
            </Link>
          </div>

          <div className="divide-y divide-white/10 text-xs">
            <div className="py-3 flex items-start gap-3">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white">Fertigation Completed</span>
                  <span className="text-white/50">Today, 08:30 AM</span>
                </div>
                <p className="text-white/70 mt-0.5">Applied 13:0:45 Potassium Nitrate (3kg/acre) for flower setting.</p>
              </div>
            </div>

            <div className="py-3 flex items-start gap-3">
              <AlertTriangle className="w-4 h-4 text-amber-400 mt-0.5 shrink-0" />
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white">Weather Alert: Evening Thunderstorm</span>
                  <span className="text-white/50">Forecast 04:30 PM</span>
                </div>
                <p className="text-white/70 mt-0.5">18.5mm rain expected with gusty winds. Avoid spraying chemical pesticides after 2 PM.</p>
              </div>
            </div>

            <div className="py-3 flex items-start gap-3">
              <TrendingUp className="w-4 h-4 text-sky-400 mt-0.5 shrink-0" />
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white">Market Price Surge: Tomato</span>
                  <span className="text-white/50">Yesterday</span>
                </div>
                <p className="text-white/70 mt-0.5">Bengaluru APMC price rose to ₹2,780/Qtl. Net realization increased by +₹380/Qtl.</p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
