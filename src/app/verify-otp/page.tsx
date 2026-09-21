"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  KeyRound, 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  RotateCcw,
  MessageSquare
} from "lucide-react";
import { useApp } from "@/lib/store";

export default function VerifyOtpPage() {
  const router = useRouter();
  const { language } = useApp();
  const [otp, setOtp] = useState(["7", "2", "9", "4", "1", "0"]);
  const [isVerifying, setIsVerifying] = useState(false);

  const handleOtpChange = (index: number, val: string) => {
    if (val.length > 1) return;
    const newOtp = [...otp];
    newOtp[index] = val;
    setOtp(newOtp);
  };

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    setIsVerifying(true);
    setTimeout(() => {
      router.push("/onboarding");
    }, 600);
  };

  return (
    <div className="min-h-screen bg-transparent flex flex-col justify-center py-12 sm:px-6 lg:px-8 text-white">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center space-y-2">
        <Link href="/" className="inline-flex items-center gap-2">
          <div className="w-10 h-10 rounded-2xl bg-brand-600 flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-brand-600/30">
            🌾
          </div>
          <span className="text-2xl font-bold font-display tracking-tight text-white">
            KrishiMitra AI
          </span>
        </Link>
        <h2 className="text-2xl font-bold font-display text-white">
          Enter 6-Digit OTP
        </h2>
        <p className="text-xs text-white/70">
          We sent a verification code to <strong>+91 98450 12345</strong> via SMS & WhatsApp.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-black/45 backdrop-blur-xl py-8 px-6 sm:px-10 rounded-3xl border border-white/20 shadow-2xl space-y-6">
          <form onSubmit={handleVerify} className="space-y-6">
            <div className="flex justify-center gap-2">
              {otp.map((digit, idx) => (
                <input
                  key={idx}
                  type="text"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOtpChange(idx, e.target.value)}
                  className="w-11 h-12 text-center text-lg font-bold font-mono rounded-xl bg-black/50 border border-white/20 text-white focus:ring-2 focus:ring-brand-500"
                />
              ))}
            </div>

            <div className="p-3 rounded-xl bg-brand-900/30 border border-brand-500/30 text-xs text-brand-300 flex items-center gap-2">
              <Sparkles className="w-4 h-4 shrink-0" />
              <span>SIH Demo Mode: Pre-filled with valid OTP (729410).</span>
            </div>

            <button
              type="submit"
              disabled={isVerifying}
              className="w-full py-3.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-lg shadow-brand-600/20 cursor-pointer"
            >
              <span>{isVerifying ? "Verifying Credentials..." : "Verify & Continue to Farm Setup"}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="flex items-center justify-between text-xs text-white/60 pt-2 border-t border-white/10">
            <button className="text-brand-400 font-semibold hover:underline flex items-center gap-1">
              <RotateCcw className="w-3.5 h-3.5" /> Resend OTP
            </button>
            <Link href="/login" className="hover:underline text-white/70">
              Change Mobile Number
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
