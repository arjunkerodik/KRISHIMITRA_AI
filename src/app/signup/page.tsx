"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  Sprout, 
  Phone, 
  User, 
  MapPin, 
  ShieldCheck, 
  Sparkles, 
  ArrowRight, 
  CheckCircle2,
  Lock
} from "lucide-react";
import { useApp } from "@/lib/store";

export default function SignupPage() {
  const router = useRouter();
  const { language } = useApp();
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [state, setState] = useState("Karnataka");
  const [district, setDistrict] = useState("Kolar");
  const [taluk, setTaluk] = useState("Kolar");
  const [aadhaarNumber, setAadhaarNumber] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      router.push("/verify-otp");
    }, 600);
  };

  return (
    <div className="min-h-screen bg-transparent flex flex-col justify-center py-12 sm:px-6 lg:px-8 text-white">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center space-y-2">
        <Link href="/" className="inline-flex items-center gap-2">
          <div className="w-10 h-10 rounded-2xl bg-brand-500 flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-brand-500/40">
            🌾
          </div>
          <span className="text-2xl font-bold font-display tracking-tight text-white drop-shadow-md">
            KrishiMitra AI
          </span>
        </Link>
        <h2 className="text-2xl font-bold font-display text-white drop-shadow-md">
          Create Your Farmer Account
        </h2>
        <p className="text-xs text-neutral-300">
          Join 2,400+ farmers in Kolar receiving daily precision advisories.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-black/50 backdrop-blur-xl py-8 px-6 sm:px-10 rounded-3xl border border-white/20 shadow-2xl space-y-6">
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div>
              <label className="font-semibold text-neutral-200 block mb-1">
                Full Name (as in Aadhaar / Land RTC):
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="e.g. Ramesh Gowda"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-black/40 border border-white/20 text-xs text-white placeholder-neutral-400 focus:ring-2 focus:ring-brand-400"
                  required
                />
              </div>
            </div>

            <div>
              <label className="font-semibold text-neutral-200 block mb-1">
                Mobile Number (for SMS & WhatsApp Advisories):
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="tel"
                  placeholder="+91 98450 12345"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-black/40 border border-white/20 text-xs text-white placeholder-neutral-400 focus:ring-2 focus:ring-brand-400 font-mono"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-semibold text-neutral-200 block mb-1">State:</label>
                <select
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  className="w-full rounded-xl bg-black/50 border border-white/20 p-2 text-white"
                >
                  <option className="bg-neutral-900 text-white">Karnataka</option>
                  <option className="bg-neutral-900 text-white">Andhra Pradesh</option>
                  <option className="bg-neutral-900 text-white">Tamil Nadu</option>
                  <option className="bg-neutral-900 text-white">Maharashtra</option>
                </select>
              </div>

              <div>
                <label className="font-semibold text-neutral-200 block mb-1">District:</label>
                <select
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  className="w-full rounded-xl bg-black/50 border border-white/20 p-2 text-white"
                >
                  <option className="bg-neutral-900 text-white">Kolar</option>
                  <option className="bg-neutral-900 text-white">Chikkaballapur</option>
                  <option className="bg-neutral-900 text-white">Bengaluru Rural</option>
                  <option className="bg-neutral-900 text-white">Tumakuru</option>
                </select>
              </div>
            </div>

            <div>
              <label className="font-semibold text-neutral-200 block mb-1">
                Aadhaar Number (Optional for 1-Click DBT auto-seeding):
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="XXXX XXXX XXXX (Masked)"
                  value={aadhaarNumber}
                  onChange={(e) => setAadhaarNumber(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-black/40 border border-white/20 text-xs text-white placeholder-neutral-400 focus:ring-2 focus:ring-brand-400 font-mono"
                />
              </div>
            </div>

            <div className="p-3 rounded-xl bg-black/40 border border-white/10 text-[11px] text-neutral-300 space-y-1">
              <p className="flex items-center gap-1 text-emerald-400 font-medium">
                <ShieldCheck className="w-3.5 h-3.5 shrink-0" /> End-to-end encrypted with DPDP Act 2023 compliance.
              </p>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 rounded-xl bg-brand-500 hover:bg-brand-600 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-lg shadow-brand-500/30 cursor-pointer"
            >
              <span>{isSubmitting ? "Generating 6-digit OTP..." : "Send Verification OTP"}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="text-center text-xs text-neutral-300">
            Already have an account?{" "}
            <Link href="/login" className="font-bold text-brand-400 hover:underline">
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
