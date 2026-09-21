"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  Users, 
  MessageSquare, 
  Video, 
  Phone, 
  Calendar, 
  Clock, 
  CheckCircle2, 
  AlertTriangle, 
  ArrowRight,
  Camera,
  FileText
} from "lucide-react";
import { useApp } from "@/lib/store";

export default function ExpertRequestsPage() {
  const { language } = useApp();
  const [activeFilter, setActiveFilter] = useState("all");

  const advisoryRequests = [
    {
      id: "REQ-2024-912",
      farmerName: "Ramesh Gowda",
      village: "Vemagal, Kolar",
      crop: "Tomato (Hybrid Arka Rakshak - Plot 1)",
      category: "Plant Pathology / Early Blight",
      urgency: "Urgent",
      submittedTime: "15 mins ago",
      notes: "Dark concentric spots visible on lower leaves after 2 days of rain. Requested confirmation before spraying Mancozeb.",
      photoAttached: true,
      status: "Waiting for Scientist Review"
    },
    {
      id: "REQ-2024-884",
      farmerName: "Suresh Kumar",
      village: "Sugatur, Kolar",
      crop: "Capsicum (Polyhouse)",
      category: "Nutrient Deficiency (Calcium Blossom End Rot)",
      urgency: "Normal",
      submittedTime: "2 hours ago",
      notes: "Black necrotic patches on bottom of capsicum fruits. pH is 6.5.",
      photoAttached: true,
      status: "Scheduled for Video Call (Tomorrow 11:00 AM)"
    },
    {
      id: "REQ-2024-762",
      farmerName: "Manjula Devi",
      village: "Narsapura, Kolar",
      crop: "Groundnut (Plot 2)",
      category: "Aphids / Sucking Pest",
      urgency: "Normal",
      submittedTime: "Yesterday",
      notes: "Colonies on terminal buds. Looking for organic neem formulations.",
      photoAttached: false,
      status: "Prescription Sent (Completed)"
    }
  ];

  return (
    <div className="min-h-screen bg-transparent text-white py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 p-6 rounded-3xl bg-black/45 backdrop-blur-xl border border-white/20 shadow-2xl">
          <div>
            <div className="flex items-center gap-2 text-xs font-medium text-neutral-300 mb-1">
              <Link href="/expert" className="hover:text-brand-300">Expert Portal</Link>
              <span>/</span>
              <span className="text-white font-semibold">Farmer Tele-Advisory Queue</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-display font-bold text-white flex items-center gap-3">
              <Users className="w-8 h-8 text-brand-400" />
              ICAR-KVK Scientist Diagnostic & Consultation Queue
            </h1>
            <p className="text-sm text-neutral-200 mt-1">
              Review AI diagnostic leaf scans, prescribe digital IPM prescriptions, and conduct scheduled video consultations.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/expert"
              className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 text-white text-xs font-semibold transition-all shadow-md"
            >
              Back to Expert Hub
            </Link>
          </div>
        </div>

        {/* Advisory Queue List */}
        <div className="space-y-6">
          {advisoryRequests.map((req) => (
            <div
              key={req.id}
              className="bg-black/45 backdrop-blur-xl rounded-3xl p-6 sm:p-8 border border-white/20 shadow-2xl space-y-5"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/15">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-brand-300">{req.id}</span>
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      req.urgency === "Urgent"
                        ? "bg-red-950/70 border border-red-500/40 text-red-200"
                        : "bg-sky-950/70 border border-sky-500/40 text-sky-200"
                    }`}>
                      {req.urgency}
                    </span>
                    <span className="text-xs text-neutral-400">• {req.submittedTime}</span>
                  </div>
                  <h3 className="text-lg font-bold font-display text-white">
                    {req.farmerName} — {req.village}
                  </h3>
                  <p className="text-xs text-neutral-300 font-medium">{req.crop}</p>
                </div>

                <div className="text-xs font-bold text-brand-300 bg-brand-950/60 border border-brand-400/40 px-3 py-1.5 rounded-xl">
                  {req.status}
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-black/40 border border-white/15 text-xs space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white">Category: {req.category}</span>
                  {req.photoAttached && (
                    <span className="flex items-center gap-1 text-[11px] text-brand-300 font-medium">
                      <Camera className="w-3.5 h-3.5" /> High-Res Leaf Photo Attached
                    </span>
                  )}
                </div>
                <p className="text-neutral-200">{req.notes}</p>
              </div>

              <div className="flex items-center gap-3 pt-2 flex-wrap">
                <button className="px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 border border-brand-400/40 text-white text-xs font-semibold inline-flex items-center gap-1.5 transition-all shadow-md">
                  <FileText className="w-3.5 h-3.5" /> Issue Digital Prescription
                </button>
                <button className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 text-white text-xs font-semibold inline-flex items-center gap-1.5 transition-all">
                  <Video className="w-3.5 h-3.5 text-brand-400" /> Start Tele-Video Call
                </button>
                <button className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 text-white text-xs font-semibold inline-flex items-center gap-1.5 transition-all">
                  <Phone className="w-3.5 h-3.5 text-emerald-400" /> Call on Phone
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
