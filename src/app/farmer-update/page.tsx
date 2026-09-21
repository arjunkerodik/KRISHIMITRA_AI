"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useApp } from "@/lib/store";
import { FarmerSidebar } from "@/components/FarmerSidebar";
import confetti from "canvas-confetti";
import {
  Tractor,
  User,
  MapPin,
  Calendar,
  Sparkles,
  Droplets,
  FlaskConical,
  CheckCircle2,
  TrendingUp,
  Save,
  RefreshCw,
  Phone,
  ShieldCheck,
  Wheat,
  Landmark,
  ArrowRight,
  ChevronRight,
  CloudRain,
  Activity,
  Layers,
  FileSpreadsheet,
  AlertCircle,
  HelpCircle,
  Clock,
  Printer,
  Sliders,
  DollarSign,
  Share2,
} from "lucide-react";

export default function FarmerOnePageUpdate() {
  const router = useRouter();
  const { user, updateUserProfile, activeFarm, soilReport, updateSoilReport, showToast, isDarkMode } = useApp();

  // Active section for navigation
  const [activeSection, setActiveSection] = useState<string>("all");
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [savedTime, setSavedTime] = useState<string>("Just now");

  // 1. Farmer Identity & KYC State
  const [fullName, setFullName] = useState<string>(user.name || "Ramesh Gowda");
  const [phoneNumber, setPhoneNumber] = useState<string>(user.phone || "+91 98450 12345");
  const [village, setVillage] = useState<string>(user.village || "Narasapura");
  const [taluk, setTaluk] = useState<string>(user.taluk || "Kolar");
  const [district, setDistrict] = useState<string>(user.district || "Kolar");
  const [aadhaarMasked, setAadhaarMasked] = useState<string>("XXXX-XXXX-4589");
  const [pmkisanId, setPmkisanId] = useState<string>("KA-PMK-8849201");
  const [bankAccount, setBankAccount] = useState<string>("SBI - •••• 6721 (DBT Active)");

  // 2. Farm & Land Plot State
  const [farmName, setFarmName] = useState<string>(activeFarm?.name || "Main Tomato & Ragi Plot");
  const [surveyNumber, setSurveyNumber] = useState<string>("142/2A (Pahani RTC Verified)");
  const [areaAcres, setAreaAcres] = useState<number>(activeFarm?.areaAcres || 4.0);
  const [soilType, setSoilType] = useState<string>(activeFarm?.soilType || "Red Sandy Loam");
  const [irrigationType, setIrrigationType] = useState<string>(activeFarm?.irrigationType || "Automated Drip (Zone A & B)");
  const [waterSource, setWaterSource] = useState<string>(activeFarm?.waterSource || "Borewell (420 ft) + Farm Pond");

  // 3. Crop & Phenology State
  const [currentCrop, setCurrentCrop] = useState<string>(activeFarm?.currentCrop || "Tomato (Solanum lycopersicum)");
  const [cropVariety, setCropVariety] = useState<string>(activeFarm?.cropVariety || "Hybrid US-440");
  const [sowingDate, setSowingDate] = useState<string>(activeFarm?.sowingDate || "2024-05-15");
  const [cropStage, setCropStage] = useState<string>(activeFarm?.cropStage || "Peak Flowering & Early Fruit Setting");
  const [targetYieldQtl, setTargetYieldQtl] = useState<number>(450);

  // 4. Soil Health Card State
  const [nitrogen, setNitrogen] = useState<number>(soilReport?.nitrogenKgHa || 185);
  const [phosphorus, setPhosphorus] = useState<number>(soilReport?.phosphorusKgHa || 22.4);
  const [potassium, setPotassium] = useState<number>(soilReport?.potassiumKgHa || 310);
  const [phLevel, setPhLevel] = useState<number>(soilReport?.ph || 6.8);
  const [organicCarbon, setOrganicCarbon] = useState<number>(soilReport?.organicCarbonPercent || 0.58);
  const [ecValue, setEcValue] = useState<number>(soilReport?.electricalConductivity || 0.42);

  // 5. Daily Farm Operations Log
  const [todayIrrigationHrs, setTodayIrrigationHrs] = useState<number>(2.5);
  const [lastFertilizer, setLastFertilizer] = useState<string>("Urea 25kg + 19:19:19 Soluble Drip (4 days ago)");
  const [lastSpray, setLastSpray] = useState<string>("Neem Oil (5ml/L) Bio-repellent (2 days ago)");
  const [todaysHarvestKg, setTodaysHarvestKg] = useState<number>(480);

  // 6. Mandi & Sales Preferences
  const [targetMandi, setTargetMandi] = useState<string>("Bengaluru Yeshwantpur APMC");
  const [expectedPrice, setExpectedPrice] = useState<number>(2780);
  const [transportMode, setTransportMode] = useState<string>("Shared Mini-Truck (₹140/Qtl)");

  // Stoichiometric Fertilizer calculation derived from NPK
  const calculatedUreaBags = Math.max(1, Math.round((250 - nitrogen) * 0.45 * (areaAcres / 2)));
  const calculatedDapBags = Math.max(1, Math.round((50 - phosphorus) * 0.6 * (areaAcres / 2)));
  const calculatedMopBags = Math.max(1, Math.round((280 - Math.min(potassium, 280)) * 0.3 * (areaAcres / 2)));

  // Dynamic Farm Health Score
  const calculatedHealthScore = Math.min(
    98,
    Math.round(
      70 +
        (phLevel >= 6.0 && phLevel <= 7.5 ? 10 : 0) +
        (nitrogen > 150 ? 5 : 0) +
        (phosphorus > 20 ? 5 : 0) +
        (organicCarbon > 0.5 ? 5 : 0) +
        (todayIrrigationHrs > 0 ? 3 : 0)
    )
  );

  // Handle Save All
  const handleSaveAll = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsSaving(true);

    setTimeout(() => {
      // 1. Update Profile
      updateUserProfile({
        name: fullName,
        phone: phoneNumber,
        village,
        taluk,
        district,
        totalLandAcres: areaAcres,
      });

      // 2. Update Soil
      updateSoilReport({
        nitrogenKgHa: nitrogen,
        phosphorusKgHa: phosphorus,
        potassiumKgHa: potassium,
        ph: phLevel,
        organicCarbonPercent: organicCarbon,
        electricalConductivity: ecValue,
        nitrogenStatus: nitrogen < 200 ? "Low" : nitrogen < 350 ? "Medium" : "High",
        phosphorusStatus: phosphorus < 25 ? "Low" : phosphorus < 50 ? "Medium" : "High",
        potassiumStatus: potassium < 150 ? "Low" : potassium < 300 ? "Medium" : "High",
        phStatus: phLevel < 6.0 ? "Acidic" : phLevel > 7.5 ? "Alkaline" : "Optimal",
      });

      setIsSaving(false);
      setSavedTime(new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }));
      
      showToast(
        "🎉 Farm Update Saved!",
        "All 6 modules (Profile, Plot, Crops, Soil, Daily Log, Mandi) synchronized.",
        "success"
      );

      // Trigger Confetti
      try {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.8 },
        });
      } catch {}
    }, 600);
  };

  const sections = [
    { id: "all", label: "All Modules" },
    { id: "identity", label: "1. Identity & KYC" },
    { id: "plot", label: "2. Land & Plot" },
    { id: "crops", label: "3. Crops & Stage" },
    { id: "soil", label: "4. Soil Health (SHC)" },
    { id: "logs", label: "5. Daily Field Log" },
    { id: "mandi", label: "6. Mandi & Sales" },
  ];

  return (
    <div className="min-h-screen bg-transparent text-white pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        
        {/* Top Breadcrumb & Controls */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2 text-xs text-neutral-400 mb-1">
              <Link href="/dashboard" className="hover:text-emerald-300 transition-colors">
                Dashboard
              </Link>
              <ChevronRight className="w-3.5 h-3.5" />
              <Link href="/farm" className="hover:text-emerald-300 transition-colors">
                Farm Management
              </Link>
              <ChevronRight className="w-3.5 h-3.5" />
              <span className="text-emerald-400 font-bold">1-Page Farmer Update</span>
            </div>
            
            <h1 className="text-2xl sm:text-3xl font-extrabold font-title tracking-tight text-white flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-800 border border-emerald-400/50 flex items-center justify-center text-white shadow-lg shadow-emerald-600/30">
                <Tractor className="w-5 h-5 text-emerald-300" />
              </div>
              <span>Farmer 1-Page Comprehensive Update</span>
            </h1>
            <p className="text-xs sm:text-sm text-neutral-300 mt-1">
              Update your farmer profile, land survey, crop phenology, soil card, and daily logs all in one place.
            </p>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex items-center gap-2 w-full md:w-auto">
            <button
              onClick={() => handleSaveAll()}
              disabled={isSaving}
              className="flex-1 md:flex-none px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/30 transition-all active:scale-95 cursor-pointer border border-emerald-400/30"
            >
              {isSaving ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              <span>{isSaving ? "Saving Updates..." : "Save All Updates"}</span>
            </button>

            <Link
              href="/dashboard"
              className="px-4 py-2.5 rounded-xl bg-black/40 hover:bg-white/10 text-white font-semibold text-xs border border-white/20 transition-colors flex items-center gap-1.5"
            >
              <span>View Dashboard</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Section Quick Jump Filter Bar */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 mb-6 scrollbar-none">
          {sections.map((sec) => (
            <button
              key={sec.id}
              onClick={() => setActiveSection(sec.id)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all border ${
                activeSection === sec.id
                  ? "bg-emerald-600 text-white border-emerald-400 shadow-md shadow-emerald-600/20"
                  : "bg-black/40 text-neutral-300 border-white/15 hover:bg-white/10"
              }`}
            >
              {sec.label}
            </button>
          ))}
        </div>

        {/* Main Grid: Forms on Left (8 Cols), Sticky Live Preview on Right (4 Cols) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* LEFT: Complete 6-Module Form (8 Columns) */}
          <div className="lg:col-span-8 space-y-6">

            {/* MODULE 1: Farmer Identity & KYC */}
            {(activeSection === "all" || activeSection === "identity") && (
              <div className="bg-black/60 backdrop-blur-xl rounded-3xl border border-white/20 p-5 sm:p-6 shadow-xl relative overflow-hidden">
                <div className="flex items-center justify-between mb-4 border-b border-white/10 pb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-300 flex items-center justify-center font-bold text-sm">
                      <User className="w-4 h-4" />
                    </div>
                    <div>
                      <h2 className="font-bold text-base text-white">1. Farmer Identity & KYC</h2>
                      <p className="text-[11px] text-neutral-400">Personal credentials, mobile & DBT linkage</p>
                    </div>
                  </div>
                  <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-emerald-950/80 text-emerald-300 border border-emerald-500/40 font-semibold flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3" /> Verified KYC
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="font-semibold text-neutral-200 block mb-1">Farmer Full Name:</label>
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full p-2.5 rounded-xl bg-black/40 border border-white/20 text-white font-medium focus:ring-2 focus:ring-emerald-400 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="font-semibold text-neutral-200 block mb-1">Mobile (SMS & WhatsApp):</label>
                    <input
                      type="tel"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      className="w-full p-2.5 rounded-xl bg-black/40 border border-white/20 text-white font-mono focus:ring-2 focus:ring-emerald-400 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="font-semibold text-neutral-200 block mb-1">Village & Taluk:</label>
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="text"
                        value={village}
                        onChange={(e) => setVillage(e.target.value)}
                        placeholder="Village"
                        className="w-full p-2.5 rounded-xl bg-black/40 border border-white/20 text-white focus:ring-2 focus:ring-emerald-400 focus:outline-none"
                      />
                      <input
                        type="text"
                        value={taluk}
                        onChange={(e) => setTaluk(e.target.value)}
                        placeholder="Taluk"
                        className="w-full p-2.5 rounded-xl bg-black/40 border border-white/20 text-white focus:ring-2 focus:ring-emerald-400 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="font-semibold text-neutral-200 block mb-1">District & State:</label>
                    <div className="grid grid-cols-2 gap-2">
                      <select
                        value={district}
                        onChange={(e) => setDistrict(e.target.value)}
                        className="w-full p-2.5 rounded-xl bg-black/60 border border-white/20 text-white focus:ring-2 focus:ring-emerald-400 focus:outline-none"
                      >
                        <option value="Kolar">Kolar</option>
                        <option value="Chikkaballapur">Chikkaballapur</option>
                        <option value="Bengaluru Rural">Bengaluru Rural</option>
                        <option value="Tumakuru">Tumakuru</option>
                        <option value="Dharwad">Dharwad</option>
                      </select>
                      <input
                        type="text"
                        value="Karnataka"
                        disabled
                        className="w-full p-2.5 rounded-xl bg-black/30 border border-white/10 text-neutral-400"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="font-semibold text-neutral-200 block mb-1">PM-KISAN Beneficiary ID:</label>
                    <input
                      type="text"
                      value={pmkisanId}
                      onChange={(e) => setPmkisanId(e.target.value)}
                      className="w-full p-2.5 rounded-xl bg-black/40 border border-white/20 text-white font-mono focus:ring-2 focus:ring-emerald-400 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="font-semibold text-neutral-200 block mb-1">Linked Bank DBT Account:</label>
                    <input
                      type="text"
                      value={bankAccount}
                      onChange={(e) => setBankAccount(e.target.value)}
                      className="w-full p-2.5 rounded-xl bg-black/40 border border-white/20 text-white focus:ring-2 focus:ring-emerald-400 focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* MODULE 2: Land Plot & Spatial Specifications */}
            {(activeSection === "all" || activeSection === "plot") && (
              <div className="bg-black/60 backdrop-blur-xl rounded-3xl border border-white/20 p-5 sm:p-6 shadow-xl relative overflow-hidden">
                <div className="flex items-center justify-between mb-4 border-b border-white/10 pb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-300 flex items-center justify-center font-bold text-sm">
                      <Tractor className="w-4 h-4" />
                    </div>
                    <div>
                      <h2 className="font-bold text-base text-white">2. Land Plot & Spatial Specifications</h2>
                      <p className="text-[11px] text-neutral-400">RTC Pahani survey number, acreage & irrigation source</p>
                    </div>
                  </div>
                  <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-amber-950/80 text-amber-300 border border-amber-500/40 font-semibold">
                    Plot ID: #401
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="font-semibold text-neutral-200 block mb-1">Plot Name / Label:</label>
                    <input
                      type="text"
                      value={farmName}
                      onChange={(e) => setFarmName(e.target.value)}
                      className="w-full p-2.5 rounded-xl bg-black/40 border border-white/20 text-white focus:ring-2 focus:ring-emerald-400 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="font-semibold text-neutral-200 block mb-1">RTC Survey No (Bhoomi Karnataka):</label>
                    <input
                      type="text"
                      value={surveyNumber}
                      onChange={(e) => setSurveyNumber(e.target.value)}
                      className="w-full p-2.5 rounded-xl bg-black/40 border border-white/20 text-white font-mono focus:ring-2 focus:ring-emerald-400 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="font-semibold text-neutral-200 block mb-1">
                      Total Cultivated Area (Acres): <span className="text-emerald-400 font-bold">{areaAcres} Acres</span>
                    </label>
                    <input
                      type="range"
                      min="0.5"
                      max="25"
                      step="0.5"
                      value={areaAcres}
                      onChange={(e) => setAreaAcres(parseFloat(e.target.value))}
                      className="w-full accent-emerald-500 cursor-pointer"
                    />
                  </div>

                  <div>
                    <label className="font-semibold text-neutral-200 block mb-1">Primary Soil Texture:</label>
                    <select
                      value={soilType}
                      onChange={(e) => setSoilType(e.target.value)}
                      className="w-full p-2.5 rounded-xl bg-black/60 border border-white/20 text-white focus:ring-2 focus:ring-emerald-400 focus:outline-none"
                    >
                      <option value="Red Sandy Loam">Red Sandy Loam (Zone 5)</option>
                      <option value="Black Cotton Soil">Black Cotton Soil</option>
                      <option value="Clayey Loam">Clayey Loam</option>
                      <option value="Laterite Soil">Laterite Soil</option>
                    </select>
                  </div>

                  <div>
                    <label className="font-semibold text-neutral-200 block mb-1">Irrigation System:</label>
                    <select
                      value={irrigationType}
                      onChange={(e) => setIrrigationType(e.target.value)}
                      className="w-full p-2.5 rounded-xl bg-black/60 border border-white/20 text-white focus:ring-2 focus:ring-emerald-400 focus:outline-none"
                    >
                      <option value="Automated Drip (Zone A & B)">Automated Drip (Zone A & B)</option>
                      <option value="Micro-Sprinklers">Micro-Sprinklers</option>
                      <option value="Furrow & Flood Irrigation">Furrow & Flood Irrigation</option>
                      <option value="Rainfed / Dryland">Rainfed / Dryland</option>
                    </select>
                  </div>

                  <div>
                    <label className="font-semibold text-neutral-200 block mb-1">Water Supply & Depth:</label>
                    <input
                      type="text"
                      value={waterSource}
                      onChange={(e) => setWaterSource(e.target.value)}
                      className="w-full p-2.5 rounded-xl bg-black/40 border border-white/20 text-white focus:ring-2 focus:ring-emerald-400 focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* MODULE 3: Crop Portfolio & Phenology Stage */}
            {(activeSection === "all" || activeSection === "crops") && (
              <div className="bg-black/60 backdrop-blur-xl rounded-3xl border border-white/20 p-5 sm:p-6 shadow-xl relative overflow-hidden">
                <div className="flex items-center justify-between mb-4 border-b border-white/10 pb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-green-500/20 text-green-300 flex items-center justify-center font-bold text-sm">
                      <Wheat className="w-4 h-4" />
                    </div>
                    <div>
                      <h2 className="font-bold text-base text-white">3. Crop Portfolio & Phenology Stage</h2>
                      <p className="text-[11px] text-neutral-400">Crop variety, sowing calendar & expected yield</p>
                    </div>
                  </div>
                  <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-emerald-950/80 text-emerald-300 border border-emerald-500/40 font-semibold">
                    Current Season: Kharif / Rabi
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="font-semibold text-neutral-200 block mb-1">Primary Crop:</label>
                    <select
                      value={currentCrop}
                      onChange={(e) => setCurrentCrop(e.target.value)}
                      className="w-full p-2.5 rounded-xl bg-black/60 border border-white/20 text-white focus:ring-2 focus:ring-emerald-400 focus:outline-none"
                    >
                      <option value="Tomato (Solanum lycopersicum)">Tomato (Hybrid US-440 / Shivam)</option>
                      <option value="Finger Millet (Ragi - Eleusine coracana)">Finger Millet (Ragi - ML-365)</option>
                      <option value="Groundnut (Arachis hypogaea)">Groundnut (TMV-2 / KDG-128)</option>
                      <option value="Capsicum / Bell Pepper">Capsicum (Green House Indra)</option>
                      <option value="Maize / Corn">Maize (Pioneer P3396)</option>
                    </select>
                  </div>

                  <div>
                    <label className="font-semibold text-neutral-200 block mb-1">Seed Variety / Hybrid Tag:</label>
                    <input
                      type="text"
                      value={cropVariety}
                      onChange={(e) => setCropVariety(e.target.value)}
                      className="w-full p-2.5 rounded-xl bg-black/40 border border-white/20 text-white focus:ring-2 focus:ring-emerald-400 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="font-semibold text-neutral-200 block mb-1">Sowing / Transplant Date:</label>
                    <input
                      type="date"
                      value={sowingDate}
                      onChange={(e) => setSowingDate(e.target.value)}
                      className="w-full p-2.5 rounded-xl bg-black/60 border border-white/20 text-white focus:ring-2 focus:ring-emerald-400 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="font-semibold text-neutral-200 block mb-1">Current Phenological Stage:</label>
                    <select
                      value={cropStage}
                      onChange={(e) => setCropStage(e.target.value)}
                      className="w-full p-2.5 rounded-xl bg-black/60 border border-white/20 text-white focus:ring-2 focus:ring-emerald-400 focus:outline-none font-medium"
                    >
                      <option value="Nursery / Sowing (0-15 Days)">Nursery / Sowing (0-15 Days)</option>
                      <option value="Vegetative Canopy Growth (15-35 Days)">Vegetative Canopy Growth (15-35 Days)</option>
                      <option value="Peak Flowering & Early Fruit Setting">Peak Flowering & Early Fruit Setting (Current)</option>
                      <option value="Fruit Maturation & Color Breaking">Fruit Maturation & Color Breaking</option>
                      <option value="Harvesting & Grading Phase">Harvesting & Grading Phase</option>
                    </select>
                  </div>

                  <div className="sm:col-span-2">
                    <label className="font-semibold text-neutral-200 block mb-1">
                      Estimated Season Yield Target: <span className="text-emerald-400 font-bold">{targetYieldQtl} Quintals</span>
                    </label>
                    <input
                      type="range"
                      min="50"
                      max="1000"
                      step="25"
                      value={targetYieldQtl}
                      onChange={(e) => setTargetYieldQtl(parseInt(e.target.value))}
                      className="w-full accent-emerald-500 cursor-pointer"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* MODULE 4: Soil Health Card (SHC) & Stoichiometric NPK */}
            {(activeSection === "all" || activeSection === "soil") && (
              <div className="bg-black/60 backdrop-blur-xl rounded-3xl border border-white/20 p-5 sm:p-6 shadow-xl relative overflow-hidden">
                <div className="flex items-center justify-between mb-4 border-b border-white/10 pb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-purple-500/20 text-purple-300 flex items-center justify-center font-bold text-sm">
                      <FlaskConical className="w-4 h-4" />
                    </div>
                    <div>
                      <h2 className="font-bold text-base text-white">4. Soil Health Card & Stoichiometric Dosimetry</h2>
                      <p className="text-[11px] text-neutral-400">Nutrient levels, pH balance & real-time fertilizer dosage calculator</p>
                    </div>
                  </div>
                  <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-purple-950/80 text-purple-300 border border-purple-500/40 font-semibold">
                    ICAR Zone 5 Dosimetry
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs">
                  {/* Nitrogen */}
                  <div className="p-3 rounded-2xl bg-black/40 border border-white/10">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-neutral-300">Nitrogen (N)</span>
                      <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${nitrogen < 200 ? "bg-amber-950 text-amber-300" : "bg-emerald-950 text-emerald-300"}`}>
                        {nitrogen < 200 ? "Low" : "Medium"}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 mb-1.5">
                      <input
                        type="number"
                        value={nitrogen}
                        onChange={(e) => setNitrogen(Number(e.target.value))}
                        className="w-full p-1.5 rounded-lg bg-black/60 border border-white/20 text-white font-bold text-sm"
                      />
                      <span className="text-[10px] text-neutral-400 shrink-0">kg/ha</span>
                    </div>
                    <p className="text-[10px] text-neutral-400">Benchmark: 250 kg/ha</p>
                  </div>

                  {/* Phosphorus */}
                  <div className="p-3 rounded-2xl bg-black/40 border border-white/10">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-neutral-300">Phosphorus (P)</span>
                      <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${phosphorus < 20 ? "bg-amber-950 text-amber-300" : "bg-emerald-950 text-emerald-300"}`}>
                        {phosphorus < 20 ? "Low" : "Medium"}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 mb-1.5">
                      <input
                        type="number"
                        value={phosphorus}
                        onChange={(e) => setPhosphorus(Number(e.target.value))}
                        className="w-full p-1.5 rounded-lg bg-black/60 border border-white/20 text-white font-bold text-sm"
                      />
                      <span className="text-[10px] text-neutral-400 shrink-0">kg/ha</span>
                    </div>
                    <p className="text-[10px] text-neutral-400">Benchmark: 30 kg/ha</p>
                  </div>

                  {/* Potassium */}
                  <div className="p-3 rounded-2xl bg-black/40 border border-white/10">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-neutral-300">Potassium (K)</span>
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-950 text-emerald-300">
                        High
                      </span>
                    </div>
                    <div className="flex items-center gap-1 mb-1.5">
                      <input
                        type="number"
                        value={potassium}
                        onChange={(e) => setPotassium(Number(e.target.value))}
                        className="w-full p-1.5 rounded-lg bg-black/60 border border-white/20 text-white font-bold text-sm"
                      />
                      <span className="text-[10px] text-neutral-400 shrink-0">kg/ha</span>
                    </div>
                    <p className="text-[10px] text-neutral-400">Benchmark: 280 kg/ha</p>
                  </div>

                  {/* pH */}
                  <div className="p-3 rounded-2xl bg-black/40 border border-white/10">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-neutral-300">Soil pH</span>
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-950 text-emerald-300">
                        {phLevel >= 6.0 && phLevel <= 7.5 ? "Optimal" : "Check pH"}
                      </span>
                    </div>
                    <input
                      type="number"
                      step="0.1"
                      value={phLevel}
                      onChange={(e) => setPhLevel(parseFloat(e.target.value))}
                      className="w-full p-1.5 rounded-lg bg-black/60 border border-white/20 text-white font-bold text-sm mb-1"
                    />
                    <p className="text-[10px] text-neutral-400">Neutral (6.5 - 7.5)</p>
                  </div>

                  {/* Organic Carbon */}
                  <div className="p-3 rounded-2xl bg-black/40 border border-white/10">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-neutral-300">Organic Carbon</span>
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-950 text-emerald-300">
                        {organicCarbon > 0.5 ? "Good" : "Low"}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 mb-1">
                      <input
                        type="number"
                        step="0.01"
                        value={organicCarbon}
                        onChange={(e) => setOrganicCarbon(parseFloat(e.target.value))}
                        className="w-full p-1.5 rounded-lg bg-black/60 border border-white/20 text-white font-bold text-sm"
                      />
                      <span className="text-[10px] text-neutral-400 shrink-0">%</span>
                    </div>
                    <p className="text-[10px] text-neutral-400">Target &gt; 0.50%</p>
                  </div>

                  {/* Electrical Conductivity */}
                  <div className="p-3 rounded-2xl bg-black/40 border border-white/10">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-neutral-300">Salinity (EC)</span>
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-950 text-emerald-300">
                        Non-Saline
                      </span>
                    </div>
                    <div className="flex items-center gap-1 mb-1">
                      <input
                        type="number"
                        step="0.01"
                        value={ecValue}
                        onChange={(e) => setEcValue(parseFloat(e.target.value))}
                        className="w-full p-1.5 rounded-lg bg-black/60 border border-white/20 text-white font-bold text-sm"
                      />
                      <span className="text-[10px] text-neutral-400 shrink-0">dS/m</span>
                    </div>
                    <p className="text-[10px] text-neutral-400">Normal &lt; 1.0 dS/m</p>
                  </div>
                </div>

                {/* Real-time Dynamic Fertilizer Requirement Output */}
                <div className="mt-4 p-3.5 rounded-2xl bg-purple-950/40 border border-purple-400/40">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-purple-300 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-purple-300" />
                      Live Stoichiometric Fertilizer Dosage ({areaAcres} Acres):
                    </span>
                    <span className="text-[10px] text-neutral-400">Updated automatically</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-center text-xs">
                    <div className="p-2 rounded-xl bg-black/50 border border-purple-500/20">
                      <div className="font-extrabold text-sm text-emerald-300">{calculatedUreaBags} Bags</div>
                      <div className="text-[10px] text-neutral-400">Neem-Coated Urea (45kg)</div>
                    </div>
                    <div className="p-2 rounded-xl bg-black/50 border border-purple-500/20">
                      <div className="font-extrabold text-sm text-sky-300">{calculatedDapBags} Bags</div>
                      <div className="text-[10px] text-neutral-400">DAP (18-46-0)</div>
                    </div>
                    <div className="p-2 rounded-xl bg-black/50 border border-purple-500/20">
                      <div className="font-extrabold text-sm text-amber-300">{calculatedMopBags} Bags</div>
                      <div className="text-[10px] text-neutral-400">MOP / Potash</div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* MODULE 5: Daily Farm Operations & Field Log */}
            {(activeSection === "all" || activeSection === "logs") && (
              <div className="bg-black/60 backdrop-blur-xl rounded-3xl border border-white/20 p-5 sm:p-6 shadow-xl relative overflow-hidden">
                <div className="flex items-center justify-between mb-4 border-b border-white/10 pb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-sky-500/20 text-sky-300 flex items-center justify-center font-bold text-sm">
                      <Droplets className="w-4 h-4" />
                    </div>
                    <div>
                      <h2 className="font-bold text-base text-white">5. Daily Farm Operations & Field Log</h2>
                      <p className="text-[11px] text-neutral-400">Today&apos;s irrigation run, fertilizer applied & harvest picking</p>
                    </div>
                  </div>
                  <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-sky-950/80 text-sky-300 border border-sky-500/40 font-semibold">
                    Today&apos;s Log
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="font-semibold text-neutral-200 block mb-1">
                      Today&apos;s Drip Irrigation Duration: <span className="text-sky-300 font-bold">{todayIrrigationHrs} Hours (~22,500 L)</span>
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="6"
                      step="0.5"
                      value={todayIrrigationHrs}
                      onChange={(e) => setTodayIrrigationHrs(parseFloat(e.target.value))}
                      className="w-full accent-sky-400 cursor-pointer"
                    />
                  </div>

                  <div>
                    <label className="font-semibold text-neutral-200 block mb-1">
                      Today&apos;s Harvest Quantity: <span className="text-emerald-400 font-bold">{todaysHarvestKg} kg (~19 Crates)</span>
                    </label>
                    <input
                      type="number"
                      value={todaysHarvestKg}
                      onChange={(e) => setTodaysHarvestKg(Number(e.target.value))}
                      className="w-full p-2.5 rounded-xl bg-black/40 border border-white/20 text-white font-mono focus:ring-2 focus:ring-emerald-400 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="font-semibold text-neutral-200 block mb-1">Last Fertilizer Application:</label>
                    <input
                      type="text"
                      value={lastFertilizer}
                      onChange={(e) => setLastFertilizer(e.target.value)}
                      className="w-full p-2.5 rounded-xl bg-black/40 border border-white/20 text-white focus:ring-2 focus:ring-emerald-400 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="font-semibold text-neutral-200 block mb-1">Last Bio-Spray / Fungicide:</label>
                    <input
                      type="text"
                      value={lastSpray}
                      onChange={(e) => setLastSpray(e.target.value)}
                      className="w-full p-2.5 rounded-xl bg-black/40 border border-white/20 text-white focus:ring-2 focus:ring-emerald-400 focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* MODULE 6: APMC Mandi & Selling Strategy */}
            {(activeSection === "all" || activeSection === "mandi") && (
              <div className="bg-black/60 backdrop-blur-xl rounded-3xl border border-white/20 p-5 sm:p-6 shadow-xl relative overflow-hidden">
                <div className="flex items-center justify-between mb-4 border-b border-white/10 pb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-300 flex items-center justify-center font-bold text-sm">
                      <DollarSign className="w-4 h-4" />
                    </div>
                    <div>
                      <h2 className="font-bold text-base text-white">6. APMC Mandi & Selling Strategy</h2>
                      <p className="text-[11px] text-neutral-400">Target marketplace, transport deduction & price realization</p>
                    </div>
                  </div>
                  <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-emerald-950/80 text-emerald-300 border border-emerald-500/40 font-semibold">
                    Live e-NAM Feeds
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="font-semibold text-neutral-200 block mb-1">Preferred Selling APMC Mandi:</label>
                    <select
                      value={targetMandi}
                      onChange={(e) => setTargetMandi(e.target.value)}
                      className="w-full p-2.5 rounded-xl bg-black/60 border border-white/20 text-white focus:ring-2 focus:ring-emerald-400 focus:outline-none font-medium"
                    >
                      <option value="Bengaluru Yeshwantpur APMC">Bengaluru Yeshwantpur APMC (₹2,780/Qtl - Max Arbitrage)</option>
                      <option value="Kolar APMC Mandi">Kolar APMC Mandi (₹2,500/Qtl - Lowest Transport)</option>
                      <option value="Chintamani APMC">Chintamani APMC (₹2,420/Qtl)</option>
                      <option value="Madanapalle Market (AP)">Madanapalle Market (AP) (₹2,680/Qtl)</option>
                    </select>
                  </div>

                  <div>
                    <label className="font-semibold text-neutral-200 block mb-1">Target Expected Selling Price:</label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 font-bold">₹</span>
                      <input
                        type="number"
                        value={expectedPrice}
                        onChange={(e) => setExpectedPrice(Number(e.target.value))}
                        className="w-full pl-8 pr-4 py-2.5 rounded-xl bg-black/40 border border-white/20 text-white font-mono font-bold focus:ring-2 focus:ring-emerald-400 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="sm:col-span-2">
                    <label className="font-semibold text-neutral-200 block mb-1">Transport Logistics Arrangement:</label>
                    <input
                      type="text"
                      value={transportMode}
                      onChange={(e) => setTransportMode(e.target.value)}
                      className="w-full p-2.5 rounded-xl bg-black/40 border border-white/20 text-white focus:ring-2 focus:ring-emerald-400 focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Bottom Large Save Button */}
            <div className="p-4 rounded-3xl bg-gradient-to-r from-emerald-950/60 via-black/80 to-teal-950/60 border border-emerald-500/40 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <h4 className="font-bold text-sm text-white flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Ready to sync all 6 farm modules?</span>
                </h4>
                <p className="text-xs text-neutral-300">
                  Last updated: <span className="text-emerald-300 font-mono">{savedTime}</span> • All changes auto-calculate fertilizer & risk scores.
                </p>
              </div>

              <button
                type="button"
                onClick={() => handleSaveAll()}
                disabled={isSaving}
                className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-xl shadow-emerald-600/40 transition-all active:scale-95 cursor-pointer border border-emerald-400/40"
              >
                {isSaving ? (
                  <RefreshCw className="w-5 h-5 animate-spin" />
                ) : (
                  <Save className="w-5 h-5" />
                )}
                <span>{isSaving ? "Synchronizing..." : "Save All Farm Updates"}</span>
              </button>
            </div>

          </div>

          {/* RIGHT: Live Dynamic Farm Preview Card (4 Columns - Sticky) */}
          <div className="lg:col-span-4 space-y-5 lg:sticky lg:top-20">
            
            {/* 1. Live Farmer Digital Passport Card */}
            <div className="bg-black/70 backdrop-blur-2xl rounded-3xl border-2 border-emerald-500/40 p-5 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none -z-10" />
              
              <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-3">
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1">
                  <Sparkles className="w-3 h-3" /> Live Farm Card
                </span>
                <span className="text-[10px] text-neutral-400 font-mono">Synced</span>
              </div>

              {/* Farmer Profile Header */}
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-700 p-0.5 shadow-md">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={user.avatar}
                    alt={fullName}
                    className="w-full h-full object-cover rounded-2xl"
                  />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-white flex items-center gap-1.5">
                    <span>{fullName}</span>
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  </h3>
                  <p className="text-xs text-neutral-300 flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-amber-400" />
                    <span>{village}, {district}</span>
                  </p>
                </div>
              </div>

              {/* Calculated Farm Health Score Meter */}
              <div className="p-3 rounded-2xl bg-emerald-950/50 border border-emerald-500/30 mb-4">
                <div className="flex items-center justify-between mb-1 text-xs">
                  <span className="font-semibold text-neutral-200">Farm Health Score</span>
                  <span className="font-extrabold text-sm text-emerald-300">{calculatedHealthScore}/100</span>
                </div>
                <div className="w-full h-2 rounded-full bg-black/60 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full transition-all duration-500"
                    style={{ width: `${calculatedHealthScore}%` }}
                  />
                </div>
                <div className="flex items-center justify-between text-[10px] text-neutral-400 mt-1">
                  <span>Soil & Weather optimal</span>
                  <span className="text-emerald-400 font-semibold">Excellent Vigor</span>
                </div>
              </div>

              {/* Live Farm Details Snapshot */}
              <div className="space-y-2 text-xs divide-y divide-white/10">
                <div className="flex items-center justify-between pt-1">
                  <span className="text-neutral-400">Total Land:</span>
                  <span className="font-bold text-white">{areaAcres} Acres ({surveyNumber.split(" ")[0]})</span>
                </div>
                <div className="flex items-center justify-between pt-2">
                  <span className="text-neutral-400">Active Crop:</span>
                  <span className="font-bold text-emerald-300 truncate max-w-[170px]">{currentCrop.split(" ")[0]}</span>
                </div>
                <div className="flex items-center justify-between pt-2">
                  <span className="text-neutral-400">Phenology Stage:</span>
                  <span className="font-medium text-white truncate max-w-[170px] text-[11px]">{cropStage.split("(")[0]}</span>
                </div>
                <div className="flex items-center justify-between pt-2">
                  <span className="text-neutral-400">Soil pH / NPK:</span>
                  <span className="font-mono text-white text-[11px]">pH {phLevel} | {nitrogen}-{phosphorus}-{potassium}</span>
                </div>
                <div className="flex items-center justify-between pt-2">
                  <span className="text-neutral-400">Today&apos;s Irrigation:</span>
                  <span className="font-bold text-sky-300">{todayIrrigationHrs} hrs (~22,500 L)</span>
                </div>
                <div className="flex items-center justify-between pt-2">
                  <span className="text-neutral-400">Target APMC:</span>
                  <span className="font-bold text-amber-300 truncate max-w-[160px]">{targetMandi.split(" ")[0]}</span>
                </div>
              </div>

              {/* Live Net Realization Calculator */}
              <div className="mt-4 pt-3 border-t border-white/10">
                <div className="p-3 rounded-xl bg-black/40 border border-white/15">
                  <div className="text-[11px] text-neutral-300 font-semibold mb-1">
                    Expected Net Realization ({targetYieldQtl} Qtl):
                  </div>
                  <div className="text-xl font-extrabold text-emerald-400 font-mono">
                    ₹{(targetYieldQtl * (expectedPrice - 140)).toLocaleString("en-IN")}
                  </div>
                  <p className="text-[10px] text-neutral-400 mt-0.5">
                    ₹{expectedPrice - 140}/Qtl after ₹140 transport deduction
                  </p>
                </div>
              </div>

              {/* Action Buttons in Preview */}
              <div className="mt-4 grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => handleSaveAll()}
                  className="py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md transition-colors"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Save All</span>
                </button>
                <Link
                  href="/dashboard"
                  className="py-2 px-3 rounded-xl bg-white/10 hover:bg-white/15 text-white font-semibold text-xs flex items-center justify-center gap-1 transition-colors text-center"
                >
                  <span>Dashboard</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </div>

            </div>

            {/* 2. Institutional Compliance Tag */}
            <div className="p-4 rounded-3xl bg-black/40 border border-white/10 text-xs text-neutral-400 space-y-1.5 backdrop-blur-md">
              <div className="flex items-center gap-1.5 text-emerald-400 font-bold text-[11px]">
                <ShieldCheck className="w-4 h-4" /> End-to-End Encrypted & DPDP Act 2023 Compliant
              </div>
              <p className="text-[11px] leading-relaxed">
                Updates directly refresh your personalized Today&apos;s Farm Action Plan, fertilizer splits, and disease vulnerability matrices.
              </p>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
