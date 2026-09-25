"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Sprout,
  Phone,
  ArrowRight,
  CheckCircle2,
  Sparkles,
  Mic,
  ChevronLeft,
  Loader2,
  ShieldCheck,
} from "lucide-react";
import { useApp } from "@/lib/store";

type LoginStep = "phone" | "otp";

// Crop emojis for visual warmth on the login screen
const CROP_ICONS = ["🌾", "🍅", "🥦", "🌽", "🥭", "🍋", "🧅", "🫘"];

export default function LoginPage() {
  const router = useRouter();
  const { setRole, language, t } = useApp();

  const [step, setStep] = useState<LoginStep>("phone");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [resendCountdown, setResendCountdown] = useState(0);

  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Start resend countdown when OTP step begins
  useEffect(() => {
    if (step === "otp") {
      setResendCountdown(30);
      const interval = setInterval(() => {
        setResendCountdown((prev) => {
          if (prev <= 1) { clearInterval(interval); return 0; }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [step]);

  // ── Send OTP ───────────────────────────────────────────────

  const handlePhoneSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    const cleanPhone = phone.trim().replace(/\s/g, "");
    if (!cleanPhone || cleanPhone.length < 10) {
      setErrorMsg("Please enter a valid 10-digit mobile number.");
      return;
    }

    const fullPhone = cleanPhone.startsWith("+") ? cleanPhone : `+91${cleanPhone}`;

    setIsLoading(true);
    try {
      const res = await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: fullPhone }),
      });
      const data = await res.json();

      if (!data.success) {
        setErrorMsg(data.error || "Could not send OTP. Please try again.");
        return;
      }

      // In demo mode, auto-fill the OTP for convenience
      if (data.demo_otp) {
        setOtp(data.demo_otp.split(""));
      }

      setStep("otp");
    } catch {
      setErrorMsg("Network error. Check your connection and try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // ── OTP input handling ────────────────────────────────────

  const handleOtpChange = (index: number, val: string) => {
    if (!/^\d*$/.test(val)) return; // digits only
    const next = [...otp];
    next[index] = val.slice(-1);
    setOtp(next);
    if (val && index < 5) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  // ── Verify OTP ────────────────────────────────────────────

  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    const token = otp.join("");
    if (token.length < 6) {
      setErrorMsg("Please enter the 6-digit OTP.");
      return;
    }

    const cleanPhone = phone.trim().replace(/\s/g, "");
    const fullPhone = cleanPhone.startsWith("+") ? cleanPhone : `+91${cleanPhone}`;

    setIsLoading(true);
    try {
      const res = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: fullPhone, token }),
      });
      const data = await res.json();

      if (!data.success) {
        setErrorMsg(data.error || "Invalid OTP. Please try again.");
        return;
      }

      // Mark first session as done (for PWA install prompt deferral)
      try { localStorage.setItem("km_first_session_done", "1"); } catch {}

      // Update role in client store (synced from DB in production)
      setRole(data.session?.user?.role || "farmer");

      // Route based on whether onboarding is complete
      if (data.isNewUser || !data.onboardingCompleted) {
        router.replace("/onboarding");
      } else {
        router.replace("/");
      }
    } catch {
      setErrorMsg("Network error. Check your connection and try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // ── Resend OTP ────────────────────────────────────────────

  const handleResend = async () => {
    if (resendCountdown > 0) return;
    const cleanPhone = phone.trim().replace(/\s/g, "");
    const fullPhone = cleanPhone.startsWith("+") ? cleanPhone : `+91${cleanPhone}`;
    setOtp(["", "", "", "", "", ""]);
    setIsLoading(true);
    try {
      await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: fullPhone }),
      });
      setResendCountdown(30);
      const interval = setInterval(() => {
        setResendCountdown((prev) => {
          if (prev <= 1) { clearInterval(interval); return 0; }
          return prev - 1;
        });
      }, 1000);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-transparent text-white">
      {/* Background crop icons */}
      <div className="fixed inset-0 pointer-events-none select-none overflow-hidden z-0">
        {CROP_ICONS.map((icon, i) => (
          <span
            key={i}
            className="absolute text-4xl opacity-[0.06]"
            style={{
              top: `${10 + (i * 11) % 80}%`,
              left: `${(i * 13) % 90}%`,
              transform: `rotate(${i * 30}deg)`,
            }}
          >
            {icon}
          </span>
        ))}
      </div>

      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 py-10">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 mb-8 group">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-xl shadow-emerald-500/30 group-hover:scale-105 transition-all">
            <Sprout className="w-7 h-7 text-white" />
          </div>
          <div>
            <span className="font-extrabold text-xl text-white block leading-none">
              KrishiMitra AI
            </span>
            <span className="text-xs text-emerald-400 font-medium">
              Smart Farmer Companion
            </span>
          </div>
        </Link>

        {/* Card */}
        <div className="w-full max-w-sm bg-slate-950/80 backdrop-blur-2xl border border-slate-800/80 rounded-3xl p-6 shadow-2xl">

          {step === "phone" && (
            <>
              <div className="mb-6 text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-400/30 mb-3">
                  <Phone className="w-6 h-6 text-emerald-400" />
                </div>
                <h1 className="text-xl font-bold text-white">Enter your mobile number</h1>
                <p className="text-sm text-slate-400 mt-1">
                  We'll send a 6-digit OTP to verify your number
                </p>
              </div>

              <form onSubmit={handlePhoneSubmit} className="space-y-4">
                <div className="flex items-center gap-2 bg-slate-900/80 border border-slate-700 rounded-2xl px-4 py-3 focus-within:border-emerald-500/60 transition-colors">
                  <span className="text-sm font-mono text-slate-400 shrink-0">+91</span>
                  <span className="text-slate-600">|</span>
                  <input
                    id="phone-input"
                    type="tel"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    maxLength={10}
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
                    placeholder="98450 12345"
                    className="flex-1 bg-transparent text-white text-base font-mono outline-none placeholder-slate-600 min-h-[44px]"
                    autoFocus
                  />
                  {phone.length === 10 && (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  )}
                </div>

                {errorMsg && (
                  <p className="text-xs text-rose-400 text-center">{errorMsg}</p>
                )}

                <button
                  type="submit"
                  disabled={isLoading || phone.length < 10}
                  className="w-full touch-target flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold text-sm transition-all active:scale-98 shadow-lg shadow-emerald-900/40"
                >
                  {isLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      <span>Send OTP</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>

              {/* Admin login link */}
              <p className="text-center text-xs text-slate-500 mt-5">
                Admin officer?{" "}
                <button
                  onClick={() => {
                    setRole("admin");
                    router.push("/admin");
                  }}
                  className="text-purple-400 hover:underline font-medium"
                >
                  Admin login →
                </button>
              </p>
            </>
          )}

          {step === "otp" && (
            <>
              <div className="mb-6 text-center">
                <button
                  onClick={() => { setStep("phone"); setErrorMsg(""); }}
                  className="flex items-center gap-1 text-xs text-slate-400 hover:text-white mb-4 mx-auto transition-colors"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                  <span>Change number</span>
                </button>

                <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-400/30 mb-3">
                  <ShieldCheck className="w-6 h-6 text-emerald-400" />
                </div>
                <h1 className="text-xl font-bold text-white">Enter OTP</h1>
                <p className="text-sm text-slate-400 mt-1">
                  Sent to <span className="text-emerald-300 font-mono">+91 {phone}</span>
                </p>
              </div>

              <form onSubmit={handleOtpSubmit} className="space-y-5">
                {/* 6-box OTP input */}
                <div className="flex gap-2 justify-center" aria-label="Enter 6-digit OTP">
                  {otp.map((digit, i) => (
                    <input
                      key={i}
                      id={`otp-${i}`}
                      ref={(el) => { otpRefs.current[i] = el; }}
                      type="text"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOtpChange(i, e.target.value)}
                      onKeyDown={(e) => handleOtpKeyDown(i, e)}
                      className="w-11 h-14 text-center text-xl font-bold font-mono rounded-xl bg-slate-900 border border-slate-700 text-white focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 transition-all caret-emerald-400"
                      autoFocus={i === 0}
                    />
                  ))}
                </div>

                {errorMsg && (
                  <p className="text-xs text-rose-400 text-center">{errorMsg}</p>
                )}

                <button
                  type="submit"
                  disabled={isLoading || otp.join("").length < 6}
                  className="w-full touch-target flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold text-sm transition-all active:scale-98 shadow-lg shadow-emerald-900/40"
                >
                  {isLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 text-emerald-200" />
                      <span>Verify & Enter</span>
                    </>
                  )}
                </button>

                <p className="text-center text-xs text-slate-500">
                  Didn't get the OTP?{" "}
                  {resendCountdown > 0 ? (
                    <span className="text-slate-400">Resend in {resendCountdown}s</span>
                  ) : (
                    <button
                      type="button"
                      onClick={handleResend}
                      className="text-emerald-400 hover:underline font-medium"
                    >
                      Resend OTP
                    </button>
                  )}
                </p>
              </form>
            </>
          )}
        </div>

        {/* Trust badges */}
        <div className="flex flex-wrap items-center justify-center gap-3 mt-6 text-[11px] text-slate-400">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Verified by IMD & AGMARKNET</span>
          </div>
          <span className="text-slate-700">•</span>
          <div className="flex items-center gap-1.5">
            <Mic className="w-3.5 h-3.5 text-cyan-400" />
            <span>Works in Kannada, Hindi, Telugu</span>
          </div>
        </div>
      </div>
    </div>
  );
}
