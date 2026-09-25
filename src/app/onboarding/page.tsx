"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useApp } from "@/lib/store";
import { Language } from "@/lib/i18n";
import confetti from "canvas-confetti";
import {
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Sprout,
  MapPin,
} from "lucide-react";

// ── Types ──────────────────────────────────────────────────────

interface OnboardingData {
  preferredLanguage: Language;
  name: string;
  village: string;
  district: string;
  state: string;
  landSizeAcres: number | "";
  primaryCrop: string;
}

// ── Language options ───────────────────────────────────────────

const LANGUAGES: { code: Language; script: string; name: string; flag: string }[] = [
  { code: "kn", script: "ಕನ್ನಡ", name: "Kannada", flag: "🇮🇳" },
  { code: "hi", script: "हिन्दी", name: "Hindi",   flag: "🇮🇳" },
  { code: "te", script: "తెలుగు", name: "Telugu",   flag: "🇮🇳" },
  { code: "ta", script: "தமிழ்", name: "Tamil",    flag: "🇮🇳" },
  { code: "mr", script: "मराठी",  name: "Marathi",  flag: "🇮🇳" },
  { code: "en", script: "English", name: "English", flag: "🌐" },
];

// ── Crop grid options ──────────────────────────────────────────

const CROPS = [
  { id: "tomato",     label: "Tomato",    emoji: "🍅" },
  { id: "paddy",      label: "Paddy",     emoji: "🌾" },
  { id: "maize",      label: "Maize",     emoji: "🌽" },
  { id: "groundnut",  label: "Groundnut", emoji: "🥜" },
  { id: "cotton",     label: "Cotton",    emoji: "🌿" },
  { id: "sugarcane",  label: "Sugarcane", emoji: "🎋" },
  { id: "sunflower",  label: "Sunflower", emoji: "🌻" },
  { id: "onion",      label: "Onion",     emoji: "🧅" },
  { id: "potato",     label: "Potato",    emoji: "🥔" },
  { id: "banana",     label: "Banana",    emoji: "🍌" },
  { id: "mango",      label: "Mango",     emoji: "🥭" },
  { id: "coconut",    label: "Coconut",   emoji: "🥥" },
  { id: "chilli",     label: "Chilli",    emoji: "🌶️" },
  { id: "brinjal",    label: "Brinjal",   emoji: "🍆" },
  { id: "wheat",      label: "Wheat",     emoji: "🌾" },
  { id: "soybean",    label: "Soybean",   emoji: "🫘" },
];

// ── Labels by language ──────────────────────────────────────────

const STEP_LABELS: Record<Language, {
  langStep: string;
  infoStep: string;
  cropStep: string;
  doneStep: string;
  nameLabel: string;
  villageLabel: string;
  districtLabel: string;
  landLabel: string;
  cropLabel: string;
  continueBtn: string;
  backBtn: string;
}> = {
  en: {
    langStep: "Choose your language",
    infoStep: "Tell us about yourself",
    cropStep: "What do you grow?",
    doneStep: "You're all set! 🎉",
    nameLabel: "Your name",
    villageLabel: "Village name",
    districtLabel: "District",
    landLabel: "Land size (acres)",
    cropLabel: "Tap your main crop",
    continueBtn: "Continue",
    backBtn: "Back",
  },
  kn: {
    langStep: "ನಿಮ್ಮ ಭಾಷೆ ಆಯ್ಕೆ ಮಾಡಿ",
    infoStep: "ನಿಮ್ಮ ಬಗ್ಗೆ ತಿಳಿಸಿ",
    cropStep: "ನೀವು ಏನು ಬೆಳೆಯುತ್ತೀರಿ?",
    doneStep: "ಸಿದ್ಧ! 🎉",
    nameLabel: "ನಿಮ್ಮ ಹೆಸರು",
    villageLabel: "ಗ್ರಾಮ",
    districtLabel: "ಜಿಲ್ಲೆ",
    landLabel: "ಭೂಮಿ ಗಾತ್ರ (ಎಕರೆ)",
    cropLabel: "ನಿಮ್ಮ ಮುಖ್ಯ ಬೆಳೆ ಮೇಲೆ ಟ್ಯಾಪ್ ಮಾಡಿ",
    continueBtn: "ಮುಂದೆ",
    backBtn: "ಹಿಂದೆ",
  },
  hi: {
    langStep: "अपनी भाषा चुनें",
    infoStep: "अपने बारे में बताएं",
    cropStep: "आप क्या उगाते हैं?",
    doneStep: "तैयार! 🎉",
    nameLabel: "आपका नाम",
    villageLabel: "गांव",
    districtLabel: "जिला",
    landLabel: "जमीन का आकार (एकड़)",
    cropLabel: "अपनी मुख्य फसल चुनें",
    continueBtn: "आगे",
    backBtn: "वापस",
  },
  te: {
    langStep: "మీ భాష ఎంచుకోండి",
    infoStep: "మీ గురించి చెప్పండి",
    cropStep: "మీరు ఏమి పండిస్తారు?",
    doneStep: "సిద్ధం! 🎉",
    nameLabel: "మీ పేరు",
    villageLabel: "గ్రామం",
    districtLabel: "జిల్లా",
    landLabel: "భూమి పరిమాణం (ఎకరాలు)",
    cropLabel: "మీ ప్రధాన పంట నొక్కండి",
    continueBtn: "కొనసాగించు",
    backBtn: "వెనకకు",
  },
  ta: {
    langStep: "உங்கள் மொழியை தேர்வு செய்யுங்கள்",
    infoStep: "உங்களைப் பற்றி சொல்லுங்கள்",
    cropStep: "நீங்கள் என்ன பயிரிடுகிறீர்கள்?",
    doneStep: "தயார்! 🎉",
    nameLabel: "உங்கள் பெயர்",
    villageLabel: "கிராமம்",
    districtLabel: "மாவட்டம்",
    landLabel: "நிலம் அளவு (ஏக்கர்)",
    cropLabel: "உங்கள் பயிரை தேர்வு செய்யுங்கள்",
    continueBtn: "தொடரவும்",
    backBtn: "பின்னால்",
  },
  mr: {
    langStep: "आपली भाषा निवडा",
    infoStep: "आपल्याबद्दल सांगा",
    cropStep: "तुम्ही काय पिकवता?",
    doneStep: "तयार! 🎉",
    nameLabel: "तुमचे नाव",
    villageLabel: "गाव",
    districtLabel: "जिल्हा",
    landLabel: "जमिनीचा आकार (एकर)",
    cropLabel: "मुख्य पीक टॅप करा",
    continueBtn: "पुढे",
    backBtn: "मागे",
  },
};

// ── Component ───────────────────────────────────────────────────

export default function OnboardingPage() {
  const router = useRouter();
  const { addFarm, setLanguage, updateUserProfile } = useApp();

  const [currentStep, setCurrentStep] = useState<1 | 2 | 3 | 4>(1);
  const [formData, setFormData] = useState<OnboardingData>({
    preferredLanguage: "kn",
    name: "",
    village: "",
    district: "",
    state: "Karnataka",
    landSizeAcres: "",
    primaryCrop: "",
  });

  const labels = STEP_LABELS[formData.preferredLanguage];

  const handleNext = () => {
    if (currentStep < 4) {
      if (currentStep === 1) {
        setLanguage(formData.preferredLanguage);
      }
      setCurrentStep((prev) => (prev + 1) as 1 | 2 | 3 | 4);
    } else {
      // Step 4 — save & go home
      completeOnboarding();
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => (prev - 1) as 1 | 2 | 3 | 4);
    }
  };

  const completeOnboarding = async () => {
    try {
      confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
    } catch {}

    updateUserProfile({
      name: formData.name || "Farmer",
      village: formData.village,
      district: formData.district,
      state: formData.state,
    });

    if (formData.landSizeAcres && formData.primaryCrop) {
      addFarm({
        farmerId: "current_user",
        farmerName: formData.name || "Farmer",
        name: `${formData.village || "My"} Farm`,
        village: formData.village,
        district: formData.district,
        state: formData.state,
        pincode: "",
        latitude: 0,
        longitude: 0,
        areaAcres: Number(formData.landSizeAcres),
        soilType: "Unknown",
        irrigationType: "rain-fed",
        waterSource: "Rain",
        currentCrop: formData.primaryCrop,
        cropVariety: "",
        sowingDate: "",
        cropStage: "Vegetative",
        healthScore: 80,
        riskScore: 20,
        boundary: [],
      });
    }

    // Mark onboarding complete in Supabase (best-effort, non-blocking)
    try {
      await fetch("/api/auth/complete-onboarding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          preferredLanguage: formData.preferredLanguage,
          name: formData.name,
          village: formData.village,
          district: formData.district,
          landSizeAcres: formData.landSizeAcres,
          primaryCrops: formData.primaryCrop ? [formData.primaryCrop] : [],
        }),
      });
    } catch {}

    router.replace("/");
  };

  // ── Step validations ──────────────────────────────────────

  const canProceed = () => {
    if (currentStep === 1) return !!formData.preferredLanguage;
    if (currentStep === 2) return !!formData.name && !!formData.village;
    if (currentStep === 3) return !!formData.primaryCrop;
    return true;
  };

  const progressPct = ((currentStep - 1) / 3) * 100;

  return (
    <div className="min-h-screen bg-transparent text-white flex flex-col">
      {/* Progress bar */}
      <div className="fixed top-0 left-0 right-0 h-1.5 bg-slate-800 z-50">
        <div
          className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-500"
          style={{ width: `${progressPct}%` }}
        />
      </div>

      <div className="flex-1 flex flex-col items-center justify-center px-4 py-16 max-w-sm mx-auto w-full">

        {/* Step indicator */}
        <div className="flex items-center gap-1.5 mb-6">
          {[1, 2, 3, 4].map((s) => (
            <div
              key={s}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                s < currentStep
                  ? "w-6 bg-emerald-500"
                  : s === currentStep
                  ? "w-8 bg-emerald-400"
                  : "w-4 bg-slate-700"
              }`}
            />
          ))}
        </div>

        {/* ── STEP 1: Language ────────────────────────────── */}
        {currentStep === 1 && (
          <div className="w-full space-y-5 animate-in fade-in duration-300">
            <div className="text-center mb-2">
              <span className="text-3xl mb-2 block">🌐</span>
              <h1 className="text-xl font-bold text-white">{labels.langStep}</h1>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {LANGUAGES.map((l) => (
                <button
                  key={l.code}
                  onClick={() => setFormData((prev) => ({ ...prev, preferredLanguage: l.code }))}
                  className={`flex flex-col items-center justify-center p-4 rounded-2xl border-2 transition-all touch-target min-h-[80px] ${
                    formData.preferredLanguage === l.code
                      ? "border-emerald-400 bg-emerald-500/20 text-emerald-300"
                      : "border-slate-700 bg-slate-900/60 text-slate-300 hover:border-slate-500"
                  }`}
                >
                  <span className="text-2xl font-bold">{l.script}</span>
                  <span className="text-xs mt-1 text-slate-400">{l.name}</span>
                  {formData.preferredLanguage === l.code && (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-1" />
                  )}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ── STEP 2: Name + Village ──────────────────────── */}
        {currentStep === 2 && (
          <div className="w-full space-y-4 animate-in fade-in duration-300">
            <div className="text-center mb-2">
              <span className="text-3xl mb-2 block">👤</span>
              <h1 className="text-xl font-bold text-white">{labels.infoStep}</h1>
            </div>

            <div>
              <label className="block text-xs text-slate-400 mb-1 font-medium">{labels.nameLabel}</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData((p) => ({ ...p, name: e.target.value }))}
                placeholder="Ramesh Gowda"
                className="w-full bg-slate-900/80 border border-slate-700 rounded-xl px-4 py-3 text-white text-sm focus:border-emerald-500 outline-none min-h-[48px] transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs text-slate-400 mb-1 font-medium">
                <MapPin className="w-3.5 h-3.5 inline mr-1 text-cyan-400" />
                {labels.villageLabel}
              </label>
              <input
                type="text"
                value={formData.village}
                onChange={(e) => setFormData((p) => ({ ...p, village: e.target.value }))}
                placeholder="Narasapura"
                className="w-full bg-slate-900/80 border border-slate-700 rounded-xl px-4 py-3 text-white text-sm focus:border-emerald-500 outline-none min-h-[48px] transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs text-slate-400 mb-1 font-medium">{labels.districtLabel}</label>
              <input
                type="text"
                value={formData.district}
                onChange={(e) => setFormData((p) => ({ ...p, district: e.target.value }))}
                placeholder="Kolar"
                className="w-full bg-slate-900/80 border border-slate-700 rounded-xl px-4 py-3 text-white text-sm focus:border-emerald-500 outline-none min-h-[48px] transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs text-slate-400 mb-1 font-medium">{labels.landLabel}</label>
              <input
                type="number"
                inputMode="decimal"
                value={formData.landSizeAcres}
                onChange={(e) =>
                  setFormData((p) => ({ ...p, landSizeAcres: e.target.value === "" ? "" : parseFloat(e.target.value) }))
                }
                placeholder="2.5"
                step="0.5"
                min="0.1"
                className="w-full bg-slate-900/80 border border-slate-700 rounded-xl px-4 py-3 text-white text-sm focus:border-emerald-500 outline-none min-h-[48px] transition-colors"
              />
              <p className="text-[10px] text-slate-500 mt-1">Optional — helps personalise govt scheme suggestions</p>
            </div>
          </div>
        )}

        {/* ── STEP 3: Crop Selection ──────────────────────── */}
        {currentStep === 3 && (
          <div className="w-full space-y-4 animate-in fade-in duration-300">
            <div className="text-center mb-2">
              <span className="text-3xl mb-2 block">🌱</span>
              <h1 className="text-xl font-bold text-white">{labels.cropStep}</h1>
              <p className="text-xs text-slate-400 mt-1">{labels.cropLabel}</p>
            </div>

            <div className="grid grid-cols-4 gap-2">
              {CROPS.map((crop) => (
                <button
                  key={crop.id}
                  onClick={() => setFormData((p) => ({ ...p, primaryCrop: crop.id }))}
                  className={`flex flex-col items-center justify-center p-2.5 rounded-2xl border-2 transition-all touch-target min-h-[72px] ${
                    formData.primaryCrop === crop.id
                      ? "border-emerald-400 bg-emerald-500/20 scale-105 shadow-lg shadow-emerald-500/20"
                      : "border-slate-700 bg-slate-900/60 hover:border-slate-500 active:scale-95"
                  }`}
                  aria-label={crop.label}
                  aria-pressed={formData.primaryCrop === crop.id}
                >
                  <span className="text-2xl leading-none">{crop.emoji}</span>
                  <span className="text-[10px] text-slate-300 mt-1 leading-tight text-center">
                    {crop.label}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ── STEP 4: Done ────────────────────────────────── */}
        {currentStep === 4 && (
          <div className="w-full text-center space-y-5 animate-in fade-in duration-300">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-emerald-500 to-teal-400 flex items-center justify-center mx-auto shadow-xl shadow-emerald-500/30">
              <Sprout className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-2xl font-extrabold text-white">{labels.doneStep}</h1>
            <p className="text-sm text-slate-300 leading-relaxed max-w-xs mx-auto">
              {formData.preferredLanguage === "kn"
                ? "ಕೃಷಿಮಿತ್ರ ನಿಮ್ಮ ಜೊತೆ ಇದೆ. ಪ್ರತಿ ದಿನ ಅತ್ಯುತ್ತಮ ಸಲಹೆ ನೀಡುತ್ತೇವೆ."
                : formData.preferredLanguage === "hi"
                ? "KrishiMitra आपके साथ है। हर दिन बेहतर सलाह मिलेगी।"
                : "KrishiMitra is ready. You'll get daily tips for your crop, mandi prices, and weather alerts."}
            </p>

            <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 text-sm text-left space-y-1.5">
              {formData.name && (
                <div className="flex items-center gap-2 text-emerald-300">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>{formData.name}</span>
                </div>
              )}
              {formData.village && (
                <div className="flex items-center gap-2 text-slate-300">
                  <CheckCircle2 className="w-4 h-4 shrink-0 text-cyan-400" />
                  <span>{formData.village}, {formData.district}</span>
                </div>
              )}
              {formData.primaryCrop && (
                <div className="flex items-center gap-2 text-slate-300">
                  <CheckCircle2 className="w-4 h-4 shrink-0 text-amber-400" />
                  <span className="capitalize">
                    {CROPS.find((c) => c.id === formData.primaryCrop)?.emoji}{" "}
                    {CROPS.find((c) => c.id === formData.primaryCrop)?.label}
                  </span>
                </div>
              )}
            </div>

            <p className="text-[11px] text-slate-500">
              You can add land size, crop variety & more from Settings later.
            </p>
          </div>
        )}

        {/* ── Navigation buttons ────────────────────────────── */}
        <div className="flex gap-3 mt-7 w-full">
          {currentStep > 1 && currentStep < 4 && (
            <button
              onClick={handleBack}
              className="flex items-center gap-1.5 px-4 py-3 rounded-xl border border-slate-700 text-slate-300 text-sm font-medium hover:bg-slate-800 transition-colors touch-target"
            >
              <ArrowLeft className="w-4 h-4" />
              {labels.backBtn}
            </button>
          )}
          <button
            onClick={handleNext}
            disabled={!canProceed()}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold text-sm transition-all active:scale-98 shadow-lg shadow-emerald-900/40 touch-target"
          >
            <span>{currentStep === 4 ? (formData.preferredLanguage === "kn" ? "ಮುಂದೆ ಹೋಗಿ" : "Go to App") : labels.continueBtn}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <p className="text-[10px] text-slate-600 text-center mt-4">
          Step {currentStep} of 4 — takes about 60 seconds
        </p>
      </div>
    </div>
  );
}
