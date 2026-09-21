"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useApp } from "@/lib/store";
import {
  Stethoscope,
  CheckCircle2,
  AlertCircle,
  Camera,
  Send,
  User,
  FlaskConical,
  CloudRain,
  Sparkles,
  ArrowRight,
  Calendar,
  X,
  PlusCircle,
  Phone,
} from "lucide-react";

export default function ExpertPortalPage() {
  const { showToast } = useApp();
  const [activeCase, setActiveCase] = useState<string>("case_1");
  const [replyText, setReplyText] = useState<string>(
    "Confirming early stage Alternaria solani. Recommend removing bottom 20cm foliage immediately and spraying Mancozeb 75% WP @ 2.5 g/L during early dry morning hours. Hold afternoon irrigation."
  );
  const [resolved, setResolved] = useState<boolean>(false);
  const [showOfficerModal, setShowOfficerModal] = useState<boolean>(false);
  const [officerDate, setOfficerDate] = useState<string>("2026-09-12");
  const [selectedOfficer, setSelectedOfficer] = useState<string>("Dr. Anitha K. (Horticulture Officer)");

  const cases = [
    {
      id: "case_1",
      ticketId: "#EXP-4819",
      farmerName: "Ramesh Gowda",
      village: "Narasapura, Kolar",
      crop: "Tomato (Arka Rakshak)",
      stage: "Flowering (Day 33)",
      issue: "Concentric ring brown spots on lower leaves after heavy humidity.",
      aiDiagnosis: "Early Blight (Alternaria solani) • 93.4% Confidence",
      priority: "High",
      time: "25 mins ago",
      image: "https://images.unsplash.com/photo-1592417817098-8f3d6910985b?w=400&auto=format&fit=crop&q=80",
    },
    {
      id: "case_2",
      ticketId: "#EXP-4820",
      farmerName: "Suresh Patil",
      village: "Chikkaballapur",
      crop: "Groundnut (TMV 2)",
      stage: "Pegging (Day 35)",
      issue: "Dark brown halo spots on upper leaves.",
      aiDiagnosis: "Tikka Leaf Spot (Cercospora arachidicola) • 91.2% Confidence",
      priority: "Medium",
      time: "2 hours ago",
      image: "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=400&auto=format&fit=crop&q=80",
    },
  ];

  const current = cases.find((c) => c.id === activeCase) || cases[0];

  const handleDispatchAdvisory = () => {
    setResolved(true);
    showToast(
      "Advisory Dispatched to Farmer",
      `Official KVK Pathologist recommendation sent to ${current.farmerName} via SMS and in-app alert.`,
      "success"
    );
  };

  const handleScheduleOfficerVisit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowOfficerModal(false);
    showToast(
      "Field Officer Visit Scheduled",
      `${selectedOfficer} dispatched for on-site spot survey at ${current.village} on ${officerDate}.`,
      "success"
    );
  };

  return (
    <div className="min-h-screen bg-transparent text-white p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="p-6 rounded-3xl bg-black/45 backdrop-blur-xl border border-white/20 shadow-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-sky-500/80 border border-sky-400/50 text-white flex items-center justify-center shadow-lg">
              <Stethoscope className="w-6 h-6" />
            </div>
            <div>
              <h1 className="font-display font-bold text-2xl text-white tracking-tight drop-shadow-sm">
                KVK Agricultural Expert Advisory Desk
              </h1>
              <p className="text-xs sm:text-sm text-neutral-200">
                Dr. K. N. Rao (Senior Horticultural Pathologist, ICAR-KVK Kolar) • Section 42
              </p>
            </div>
          </div>

          <Link
            href="/dashboard"
            className="px-4 py-2 rounded-xl bg-white/10 text-white hover:bg-white/20 border border-white/15 text-xs font-bold transition-all w-fit"
          >
            ← Switch to Farmer View
          </Link>
        </div>

        {/* 2-Column Triage Desk */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Left: Pending Tickets Queue (4 Cols) */}
          <div className="lg:col-span-4 space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-neutral-300 px-1">
              Active Triage Queue (2 Cases)
            </span>
            {cases.map((c) => {
              const isSelected = activeCase === c.id;
              return (
                <div
                  key={c.id}
                  onClick={() => { setActiveCase(c.id); setResolved(false); }}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                    isSelected
                      ? "border-sky-400 bg-sky-950/60 shadow-xl scale-[1.01]"
                      : "border-white/15 bg-black/45 backdrop-blur-xl hover:border-white/30"
                  }`}
                >
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <span className="font-mono text-xs font-bold text-sky-300">
                      {c.ticketId}
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-950/70 border border-red-500/40 text-red-200">
                      {c.priority} Priority
                    </span>
                  </div>
                  <h4 className="font-display font-bold text-sm text-white">
                    {c.farmerName} • {c.crop}
                  </h4>
                  <p className="text-xs text-neutral-300 truncate mt-0.5">{c.issue}</p>
                  <span className="text-[10px] text-neutral-400 block mt-2">{c.time}</span>
                </div>
              );
            })}
          </div>

          {/* Right: Case Deep Inspection Workspace (8 Cols) */}
          <div className="lg:col-span-8 p-6 rounded-3xl bg-black/45 backdrop-blur-xl border border-white/20 shadow-2xl space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-white/15">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-300">
                  Case Dossier: {current.ticketId}
                </span>
                <h3 className="font-display font-bold text-lg text-white">
                  {current.farmerName} ({current.village})
                </h3>
              </div>
              <span className="text-xs font-bold px-3 py-1 rounded-full bg-brand-900/60 border border-brand-400/40 text-brand-300">
                {current.crop} ({current.stage})
              </span>
            </div>

            {/* Attached Photo & AI Diagnostic */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
              <div className="relative aspect-4/3 rounded-2xl overflow-hidden border border-white/20 bg-black/50">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={current.image}
                  alt="Farmer submitted leaf"
                  className="w-full h-full object-cover"
                />
                <span className="absolute bottom-2 left-2 text-[10px] font-mono bg-black/80 text-white px-2 py-0.5 rounded border border-white/10">
                  Leaf Sample Photo
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-black/40 border border-white/15 space-y-2 text-xs">
                <span className="text-[10px] font-bold uppercase tracking-wider text-brand-300 block">
                  AI Computer Vision Diagnosis:
                </span>
                <p className="font-bold text-white text-sm">
                  {current.aiDiagnosis}
                </p>
                <div className="pt-2 border-t border-white/15 space-y-1 text-neutral-200 text-[11px]">
                  <p>• Soil NPK: 195 / 42 / 285 kg/ha</p>
                  <p>• Overnight Relative Humidity: 88%</p>
                  <p>• Borewell Irrigation Drip line active</p>
                </div>
              </div>
            </div>

            {/* Expert Response Formulation */}
            {!resolved ? (
              <div className="space-y-3 pt-2">
                <label className="text-xs font-bold uppercase tracking-wider text-neutral-300 block">
                  Official KVK Pathologist Advisory Response:
                </label>
                <textarea
                  rows={4}
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  className="w-full text-xs p-3.5 rounded-2xl border border-white/20 bg-black/50 text-white focus:outline-none focus:ring-2 focus:ring-brand-400 font-sans"
                />
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <button
                    onClick={handleDispatchAdvisory}
                    className="px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg border border-brand-400/40 transition-all cursor-pointer"
                  >
                    <Send className="w-4 h-4" />
                    <span>Dispatch Verified Advisory to Farmer</span>
                  </button>
                  <button
                    onClick={() => setShowOfficerModal(true)}
                    className="px-4 py-2.5 rounded-xl border border-white/20 hover:bg-white/10 text-xs font-semibold text-white cursor-pointer transition-all"
                  >
                    Recommend Field Officer Visit
                  </button>
                </div>
              </div>
            ) : (
              <div className="p-4 rounded-2xl bg-brand-950/60 border border-brand-400/50 text-center text-xs text-brand-300 font-bold flex items-center justify-center gap-2 animate-fade-in">
                <CheckCircle2 className="w-5 h-5 text-brand-400" />
                <span>Advisory sent to {current.farmerName} via SMS and in-app alert. Case marked Resolved.</span>
              </div>
            )}

          </div>

        </div>

      </div>

      {/* Field Officer Visit Scheduling Modal */}
      {showOfficerModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-fade-in">
          <div className="bg-black/85 backdrop-blur-xl rounded-3xl max-w-md w-full p-6 border border-white/20 shadow-2xl space-y-4 text-white">
            <div className="flex items-center justify-between pb-3 border-b border-white/15">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-brand-400" />
                <h3 className="font-display font-bold text-lg text-white">
                  Dispatch Extension Officer
                </h3>
              </div>
              <button
                onClick={() => setShowOfficerModal(false)}
                className="p-1 rounded-lg hover:bg-white/10 text-neutral-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleScheduleOfficerVisit} className="space-y-3 text-xs">
              <div>
                <label className="font-semibold block mb-1 text-neutral-200">Target Farm & Farmer:</label>
                <input
                  type="text"
                  disabled
                  value={`${current.farmerName} (${current.village}) - ${current.crop}`}
                  className="w-full p-2.5 rounded-xl border border-white/20 bg-black/40 text-neutral-300"
                />
              </div>

              <div>
                <label className="font-semibold block mb-1 text-neutral-200">Assign Extension Officer:</label>
                <select
                  value={selectedOfficer}
                  onChange={(e) => setSelectedOfficer(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-white/20 bg-black/50 text-white"
                >
                  <option value="Dr. Anitha K. (Horticulture Officer - Kolar Block)" className="bg-neutral-900 text-white">Dr. Anitha K. (Horticulture Officer - Kolar Block)</option>
                  <option value="Mr. Venkatesh M. (Plant Protection Specialist)" className="bg-neutral-900 text-white">Mr. Venkatesh M. (Plant Protection Specialist)</option>
                  <option value="Ms. Priya R. (Gram Panchayat Agronomist)" className="bg-neutral-900 text-white">Ms. Priya R. (Gram Panchayat Agronomist)</option>
                </select>
              </div>

              <div>
                <label className="font-semibold block mb-1 text-neutral-200">Inspection Appointment Date:</label>
                <input
                  type="date"
                  value={officerDate}
                  onChange={(e) => setOfficerDate(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-white/20 bg-black/50 text-white"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowOfficerModal(false)}
                  className="px-4 py-2 text-neutral-300 hover:text-white font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs shadow-md border border-brand-400/40 cursor-pointer"
                >
                  Confirm Assignment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
