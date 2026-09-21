"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useApp } from "@/lib/store";
import { Language } from "@/lib/i18n";
import confetti from "canvas-confetti";
import {
  Sprout,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  UploadCloud,
  Tractor,
  MapPin,
  Calendar,
  Sparkles,
  Droplets,
  FlaskConical,
} from "lucide-react";

export default function OnboardingPage() {
  const router = useRouter();
  const { addFarm, setLanguage, updateUserProfile } = useApp();

  const [currentStep, setCurrentStep] = useState<number>(1);
  const totalSteps = 14;

  const [formData, setFormData] = useState({
    name: "Ramesh Gowda",
    mobile: "+91 98450 12345",
    location: "Kolar, Karnataka",
    state: "Karnataka",
    district: "Kolar",
    village: "Narasapura",
    landSize: 2.5,
    soilType: "Red Sandy Loam",
    irrigationType: "Drip Irrigation",
    currentCrop: "Tomato",
    cropVariety: "Arka Rakshak (F1 Hybrid)",
    sowingDate: "2026-08-08",
    preferredLanguage: "en" as Language,
    soilReportFile: "soil_sample_kolar_2026.pdf",
  });

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep((prev) => prev + 1);
    } else {
      // Step 14 Completed: Trigger Confetti & Save Farm
      try {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
        });
      } catch {}

      updateUserProfile({
        name: formData.name,
        phone: formData.mobile,
        village: formData.village,
        district: formData.district,
        state: formData.state,
      });

      addFarm({
        farmerId: "farmer_001",
        farmerName: formData.name,
        name: `${formData.village} - Main Plot`,
        village: formData.village,
        district: formData.district,
        state: formData.state,
        pincode: "563133",
        latitude: 13.1367,
        longitude: 78.1348,
        areaAcres: Number(formData.landSize),
        soilType: formData.soilType,
        irrigationType: formData.irrigationType,
        waterSource: "Borewell + Pond",
        currentCrop: formData.currentCrop,
        cropVariety: formData.cropVariety,
        sowingDate: formData.sowingDate,
        cropStage: "Flowering & Early Fruit Set",
        healthScore: 90,
        riskScore: 25,
        boundary: [
          { lat: 13.1365, lng: 78.1340 },
          { lat: 13.1375, lng: 78.1342 },
          { lat: 13.1378, lng: 78.1358 },
          { lat: 13.1363, lng: 78.1356 },
        ],
      });

      setTimeout(() => {
        router.push("/dashboard");
      }, 1500);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  return (
    <div className="min-h-[88vh] flex items-center justify-center p-4 sm:p-6 lg:p-8 bg-transparent text-white">
      <div className="w-full max-w-xl bg-black/50 backdrop-blur-xl rounded-3xl border border-white/20 p-6 sm:p-8 shadow-2xl">
        
        {/* Progress bar */}
        <div className="mb-6">
          <div className="flex items-center justify-between text-xs font-semibold text-neutral-300 mb-2">
            <span>Step {currentStep} of {totalSteps}</span>
            <span className="text-brand-300 font-bold">
              {Math.round((currentStep / totalSteps) * 100)}% Setup Completed
            </span>
          </div>
          <div className="w-full h-2 bg-black/40 border border-white/10 rounded-full overflow-hidden">
            <div
              className="h-full bg-brand-500 transition-all duration-300 rounded-full"
              style={{ width: `${(currentStep / totalSteps) * 100}%` }}
            />
          </div>
        </div>

        {/* Step Views */}
        <div className="min-h-[220px] flex flex-col justify-center">
          {currentStep === 1 && (
            <div className="space-y-3 animate-fade-in">
              <span className="text-xs font-bold uppercase tracking-wider text-brand-300">Step 1: Identity</span>
              <h2 className="font-display font-bold text-2xl text-white drop-shadow-md">
                What is your full name?
              </h2>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. Ramesh Gowda"
                className="w-full text-base font-semibold p-3.5 rounded-xl border border-white/20 bg-black/40 text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-brand-400"
              />
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-3 animate-fade-in">
              <span className="text-xs font-bold uppercase tracking-wider text-brand-300">Step 2: Contact</span>
              <h2 className="font-display font-bold text-2xl text-white drop-shadow-md">
                Enter your mobile number
              </h2>
              <input
                type="tel"
                value={formData.mobile}
                onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                placeholder="+91 98450 12345"
                className="w-full text-base font-semibold p-3.5 rounded-xl border border-white/20 bg-black/40 text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-brand-400 font-mono"
              />
              <p className="text-xs text-neutral-300">Used for MSG91 OTP verification & WhatsApp alerts.</p>
            </div>
          )}

          {currentStep === 3 && (
            <div className="space-y-3 animate-fade-in">
              <span className="text-xs font-bold uppercase tracking-wider text-brand-300">Step 3: Geography</span>
              <h2 className="font-display font-bold text-2xl text-white drop-shadow-md">
                Farm GPS / Region
              </h2>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder="Narasapura, Kolar (13.1367° N, 78.1348° E)"
                className="w-full text-base font-semibold p-3.5 rounded-xl border border-white/20 bg-black/40 text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-brand-400"
              />
            </div>
          )}

          {currentStep === 4 && (
            <div className="space-y-3 animate-fade-in">
              <span className="text-xs font-bold uppercase tracking-wider text-brand-300">Step 4: State</span>
              <h2 className="font-display font-bold text-2xl text-white drop-shadow-md">
                Select your state
              </h2>
              <select
                value={formData.state}
                onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                className="w-full text-base font-semibold p-3.5 rounded-xl border border-white/20 bg-black/50 text-white focus:outline-none"
              >
                <option className="bg-neutral-900 text-white" value="Karnataka">Karnataka</option>
                <option className="bg-neutral-900 text-white" value="Maharashtra">Maharashtra</option>
                <option className="bg-neutral-900 text-white" value="Andhra Pradesh">Andhra Pradesh</option>
                <option className="bg-neutral-900 text-white" value="Tamil Nadu">Tamil Nadu</option>
                <option className="bg-neutral-900 text-white" value="Telangana">Telangana</option>
                <option className="bg-neutral-900 text-white" value="Madhya Pradesh">Madhya Pradesh</option>
                <option className="bg-neutral-900 text-white" value="Punjab">Punjab</option>
              </select>
            </div>
          )}

          {currentStep === 5 && (
            <div className="space-y-3 animate-fade-in">
              <span className="text-xs font-bold uppercase tracking-wider text-brand-300">Step 5: District</span>
              <h2 className="font-display font-bold text-2xl text-white drop-shadow-md">
                Enter your district
              </h2>
              <input
                type="text"
                value={formData.district}
                onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                placeholder="e.g. Kolar"
                className="w-full text-base font-semibold p-3.5 rounded-xl border border-white/20 bg-black/40 text-white"
              />
            </div>
          )}

          {currentStep === 6 && (
            <div className="space-y-3 animate-fade-in">
              <span className="text-xs font-bold uppercase tracking-wider text-brand-300">Step 6: Village</span>
              <h2 className="font-display font-bold text-2xl text-white drop-shadow-md">
                Village / Gram Panchayat
              </h2>
              <input
                type="text"
                value={formData.village}
                onChange={(e) => setFormData({ ...formData, village: e.target.value })}
                placeholder="e.g. Narasapura"
                className="w-full text-base font-semibold p-3.5 rounded-xl border border-white/20 bg-black/40 text-white"
              />
            </div>
          )}

          {currentStep === 7 && (
            <div className="space-y-3 animate-fade-in">
              <span className="text-xs font-bold uppercase tracking-wider text-brand-300">Step 7: Land Area</span>
              <h2 className="font-display font-bold text-2xl text-white drop-shadow-md">
                Total Landholding Size (Acres)
              </h2>
              <input
                type="number"
                step="0.5"
                value={formData.landSize}
                onChange={(e) => setFormData({ ...formData, landSize: Number(e.target.value) })}
                className="w-full text-base font-semibold p-3.5 rounded-xl border border-white/20 bg-black/40 text-white"
              />
            </div>
          )}

          {currentStep === 8 && (
            <div className="space-y-3 animate-fade-in">
              <span className="text-xs font-bold uppercase tracking-wider text-brand-300">Step 8: Soil Type</span>
              <h2 className="font-display font-bold text-2xl text-white drop-shadow-md">
                Primary Soil Classification
              </h2>
              <select
                value={formData.soilType}
                onChange={(e) => setFormData({ ...formData, soilType: e.target.value })}
                className="w-full text-base font-semibold p-3.5 rounded-xl border border-white/20 bg-black/50 text-white"
              >
                <option className="bg-neutral-900 text-white" value="Red Sandy Loam">Red Sandy Loam (Optimal for Vegetables)</option>
                <option className="bg-neutral-900 text-white" value="Black Cotton Clay">Black Cotton Soil (Vertisol)</option>
                <option className="bg-neutral-900 text-white" value="Alluvial Soil">Alluvial Soil</option>
                <option className="bg-neutral-900 text-white" value="Laterite Soil">Laterite Soil</option>
              </select>
            </div>
          )}

          {currentStep === 9 && (
            <div className="space-y-3 animate-fade-in">
              <span className="text-xs font-bold uppercase tracking-wider text-brand-300">Step 9: Irrigation</span>
              <h2 className="font-display font-bold text-2xl text-white drop-shadow-md">
                Irrigation Infrastructure
              </h2>
              <select
                value={formData.irrigationType}
                onChange={(e) => setFormData({ ...formData, irrigationType: e.target.value })}
                className="w-full text-base font-semibold p-3.5 rounded-xl border border-white/20 bg-black/50 text-white"
              >
                <option className="bg-neutral-900 text-white" value="Drip Irrigation">Drip Irrigation (In-line pressure regulated)</option>
                <option className="bg-neutral-900 text-white" value="Micro-Sprinkler">Micro-Sprinkler</option>
                <option className="bg-neutral-900 text-white" value="Flood / Furrow">Flood / Furrow Irrigation</option>
                <option className="bg-neutral-900 text-white" value="Rainfed">Rainfed (No assured source)</option>
              </select>
            </div>
          )}

          {currentStep === 10 && (
            <div className="space-y-3 animate-fade-in">
              <span className="text-xs font-bold uppercase tracking-wider text-brand-300">Step 10: Crop</span>
              <h2 className="font-display font-bold text-2xl text-white drop-shadow-md">
                What crop are you currently growing?
              </h2>
              <input
                type="text"
                value={formData.currentCrop}
                onChange={(e) => setFormData({ ...formData, currentCrop: e.target.value })}
                placeholder="e.g. Tomato, Groundnut, Maize"
                className="w-full text-base font-semibold p-3.5 rounded-xl border border-white/20 bg-black/40 text-white"
              />
            </div>
          )}

          {currentStep === 11 && (
            <div className="space-y-3 animate-fade-in">
              <span className="text-xs font-bold uppercase tracking-wider text-brand-300">Step 11: Variety</span>
              <h2 className="font-display font-bold text-2xl text-white drop-shadow-md">
                Crop Variety / Hybrid Name
              </h2>
              <input
                type="text"
                value={formData.cropVariety}
                onChange={(e) => setFormData({ ...formData, cropVariety: e.target.value })}
                placeholder="e.g. Arka Rakshak (F1), US-440, TMV 2"
                className="w-full text-base font-semibold p-3.5 rounded-xl border border-white/20 bg-black/40 text-white"
              />
            </div>
          )}

          {currentStep === 12 && (
            <div className="space-y-3 animate-fade-in">
              <span className="text-xs font-bold uppercase tracking-wider text-brand-300">Step 12: Calendar</span>
              <h2 className="font-display font-bold text-2xl text-white drop-shadow-md">
                Sowing / Transplanting Date
              </h2>
              <input
                type="date"
                value={formData.sowingDate}
                onChange={(e) => setFormData({ ...formData, sowingDate: e.target.value })}
                className="w-full text-base font-semibold p-3.5 rounded-xl border border-white/20 bg-black/40 text-white"
              />
            </div>
          )}

          {currentStep === 13 && (
            <div className="space-y-3 animate-fade-in">
              <span className="text-xs font-bold uppercase tracking-wider text-brand-300">Step 13: Language</span>
              <h2 className="font-display font-bold text-2xl text-white drop-shadow-md">
                Preferred AI Language
              </h2>
              <div className="grid grid-cols-3 gap-3">
                {(["en", "hi", "kn"] as const).map((l) => (
                  <button
                    key={l}
                    onClick={() => {
                      setFormData({ ...formData, preferredLanguage: l });
                      setLanguage(l);
                    }}
                    className={`p-4 rounded-xl border font-bold text-sm transition-all ${
                      formData.preferredLanguage === l
                        ? "border-brand-400 bg-brand-500/40 text-white shadow-lg"
                        : "border-white/20 bg-black/30 text-neutral-300 hover:bg-white/10"
                    }`}
                  >
                    {l === "en" ? "English" : l === "hi" ? "हिन्दी" : "ಕನ್ನಡ"}
                  </button>
                ))}
              </div>
            </div>
          )}

          {currentStep === 14 && (
            <div className="space-y-4 text-center animate-fade-in">
              <div className="w-16 h-16 rounded-3xl bg-brand-500/30 border border-brand-400/40 text-brand-300 flex items-center justify-center mx-auto shadow-lg shadow-brand-500/30">
                <Sparkles className="w-8 h-8 animate-spin" />
              </div>
              <h2 className="font-display font-extrabold text-2xl text-white drop-shadow-md">
                Your Digital Farm is Ready!
              </h2>
              <p className="text-xs sm:text-sm text-neutral-200 max-w-md mx-auto">
                KrishiMitra AI has calibrated weather alerts, APMC market feeds, and today&apos;s personalized farm action plan for {formData.name} in {formData.village}, {formData.district}.
              </p>
            </div>
          )}
        </div>

        {/* Navigation Buttons */}
        <div className="mt-8 pt-4 border-t border-white/10 flex items-center justify-between">
          <button
            onClick={handleBack}
            disabled={currentStep === 1}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-neutral-300 disabled:opacity-30 hover:bg-white/10 transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" /> Previous
          </button>

          <button
            onClick={handleNext}
            className="px-6 py-2.5 rounded-xl bg-brand-500 hover:bg-brand-600 text-white text-xs font-bold transition-colors flex items-center gap-1.5 shadow-lg shadow-brand-500/30 cursor-pointer"
          >
            <span>{currentStep === totalSteps ? "Enter Dashboard" : "Continue"}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
}
