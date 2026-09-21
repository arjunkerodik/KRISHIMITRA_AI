"use client";

import React, { useState } from "react";
import { FarmerSidebar } from "@/components/FarmerSidebar";
import { useApp } from "@/lib/store";
import {
  Stethoscope,
  Send,
  Camera,
  CheckCircle2,
} from "lucide-react";

export default function ExpertRequestPage() {
  const { activeFarm, showToast, awardCredits } = useApp();
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [formData, setFormData] = useState({
    title: "Possible Early Blight on Lower Foliage",
    crop: activeFarm.currentCrop,
    description: "Leaves in Zone B exhibit brown concentric target spots following 3 days of high humidity. Attached photo shows leaf underside.",
    urgency: "Normal (48h)",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    awardCredits("DISEASE_SCAN_DIAGNOSIS", "Expert Consultation Ticket Dispatched to ICAR-KVK");
    showToast("Ticket #EXP-4819 dispatched to Dr. K. N. Rao (+20 Credits earned!)", "success");
  };

  return (
    <div className="min-h-screen flex bg-transparent text-white">
      <div className="hidden lg:block w-64 shrink-0">
        <div className="fixed top-16 bottom-0 w-64">
          <FarmerSidebar />
        </div>
      </div>

      <div className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8 space-y-6 max-w-4xl mx-auto">
        <div className="p-6 rounded-3xl bg-black/45 backdrop-blur-xl border border-white/20 shadow-2xl flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-sky-500/80 border border-sky-400/50 text-white flex items-center justify-center shadow-lg">
              <Stethoscope className="w-6 h-6" />
            </div>
            <div>
              <h1 className="font-display font-bold text-2xl text-white tracking-tight drop-shadow-sm">
                Agricultural Expert Consultation
              </h1>
              <p className="text-xs sm:text-sm text-neutral-200">
                Direct ticketing desk connecting you with KVK plant pathologists & agronomists (Section 37).
              </p>
            </div>
          </div>
        </div>

        <div className="p-6 rounded-3xl bg-black/45 backdrop-blur-xl border border-white/20 shadow-2xl">
          {!submitted ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-neutral-200 block mb-1">
                    Problem Title:
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full text-xs p-3 rounded-xl border border-white/20 bg-black/50 text-white focus:outline-none focus:ring-2 focus:ring-brand-400"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-neutral-200 block mb-1">
                    Affected Crop & Stage:
                  </label>
                  <input
                    type="text"
                    value={`${formData.crop} (Flowering - Day 33)`}
                    readOnly
                    className="w-full text-xs p-3 rounded-xl border border-white/15 bg-black/30 text-neutral-300"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-neutral-200 block mb-1">
                  Detailed Issue Description:
                </label>
                <textarea
                  rows={4}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full text-xs p-3 rounded-xl border border-white/20 bg-black/50 text-white focus:outline-none focus:ring-2 focus:ring-brand-400"
                />
              </div>

              <div className="p-4 rounded-2xl border-2 border-dashed border-white/20 text-center bg-black/30">
                <Camera className="w-8 h-8 text-neutral-400 mx-auto mb-1" />
                <span className="text-xs font-bold text-white block">
                  Attached AI Diagnostic Leaf Scan (#DIS-934)
                </span>
                <p className="text-[10px] text-neutral-300">
                  AI Context automatically attached: Soil NPK (195/42/285), Weather (88% humidity).
                </p>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg border border-brand-400/40 transition-all cursor-pointer"
              >
                <Send className="w-4 h-4" />
                <span>Submit Ticket to Dr. Rao (ICAR-KVK Kolar)</span>
              </button>
            </form>
          ) : (
            <div className="p-8 text-center space-y-3 animate-fade-in">
              <CheckCircle2 className="w-12 h-12 text-brand-400 mx-auto" />
              <h3 className="font-display font-bold text-lg text-white">
                Ticket #EXP-4819 Successfully Dispatched
              </h3>
              <p className="text-xs text-neutral-200 max-w-md mx-auto">
                Assigned to Dr. K. N. Rao (Senior Plant Pathologist, KVK Kolar). You will receive an SMS and in-app notification when the advisory is published.
              </p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
