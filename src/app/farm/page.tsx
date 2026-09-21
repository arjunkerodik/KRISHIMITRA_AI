"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import Link from "next/link";
import { FarmerSidebar } from "@/components/FarmerSidebar";
import { useApp } from "@/lib/store";
import {
  Tractor,
  PlusCircle,
  MapPin,
  Calendar,
  Sparkles,
  Droplets,
  FlaskConical,
  CheckCircle2,
  TrendingUp,
  DollarSign,
  Activity,
  History,
  Clock,
  Layers,
  ShieldCheck,
  Edit3,
  Trash2,
  ScanLine,
  Bot,
  ArrowRight,
  BarChart3,
  FileSpreadsheet,
  AlertTriangle,
  Info,
  ChevronRight,
  CloudRain,
  Compass,
  Navigation,
  Check,
  X,
  Upload,
  Bug,
  Tag,
  Receipt,
  Scale,
  Building2,
  HelpCircle,
} from "lucide-react";
import { FarmRecommendation } from "@/lib/services/farmDecisionService";

// Verified Karnataka Districts for Dropdown
const KARNATAKA_DISTRICTS = [
  "Gadag",
  "Dharwad",
  "Kolar",
  "Belagavi",
  "Bengaluru Urban",
  "Bengaluru Rural",
  "Mysuru",
  "Davanagere",
  "Bagalkote",
  "Vijayapura",
  "Haveri",
  "Ballari",
  "Koppal",
  "Raichur",
  "Shivamogga",
  "Tumakuru",
  "Mandya",
  "Hassan",
  "Chikkamagaluru",
  "Chitradurga",
  "Chamarajanagara",
  "Kalaburagi",
  "Bidar",
  "Yadgir",
  "Udupi",
  "Dakshina Kannada",
  "Uttara Kannada",
  "Kodagu",
  "Ramanagara",
  "Chikkaballapura",
];

export default function MyFarmProfilePage() {
  const { showToast } = useApp();

  // Language Switcher: English | ಕನ್ನಡ
  const [lang, setLang] = useState<"en" | "kn">("en");

  // Multi-Farm List & Active Farm Selection
  const [farms, setFarms] = useState<any[]>([]);
  const [activeFarmId, setActiveFarmId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Active Farm Data & Sub-entities
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<
    "overview" | "crops" | "soil_water" | "activities" | "pests" | "financials" | "weather_markets" | "recommendations"
  >("overview");

  // Modals
  const [showAddFarmModal, setShowAddFarmModal] = useState(false);
  const [showAddCropModal, setShowAddCropModal] = useState(false);
  const [showUpdateStageModal, setShowUpdateStageModal] = useState(false);
  const [selectedCropForStage, setSelectedCropForStage] = useState<any>(null);
  const [showAddActivityModal, setShowAddActivityModal] = useState(false);
  const [showAddExpenseModal, setShowAddExpenseModal] = useState(false);
  const [showAddSaleModal, setShowAddSaleModal] = useState(false);
  const [showReportPestModal, setShowReportPestModal] = useState(false);
  const [showUpdateSoilModal, setShowUpdateSoilModal] = useState(false);

  // Add Farm Multi-Step Wizard State
  const [wizardStep, setWizardStep] = useState<number>(1);
  const [newFarmForm, setNewFarmForm] = useState({
    farm_name: "",
    total_area: "",
    area_unit: "Acres",
    ownership_type: "Owned",
    address: "",
    state: "Karnataka",
    district: "Gadag",
    taluk: "Gadag",
    village: "",
    pincode: "",
    // Location
    latitude: 15.426,
    longitude: 75.626,
    isGpsAcquired: false,
    // Soil
    soil_type: "Red Sandy Loam",
    test_date: new Date().toISOString().split("T")[0],
    ph: "",
    nitrogen: "",
    phosphorus: "",
    potassium: "",
    organic_carbon: "",
    // Water
    water_source: "Borewell",
    irrigation_method: "Drip Irrigation",
    storage_capacity: "",
    // Initial Crop
    has_crop: true,
    crop_name: "Onion",
    variety: "Red Bellary",
    sowing_date: new Date().toISOString().split("T")[0],
    current_stage: "Vegetative",
    crop_area: "",
  });
  const [gpsLoading, setGpsLoading] = useState(false);

  // Translations Dictionary
  const t = {
    en: {
      title: "My Farm Digital Profile",
      subtitle: "Comprehensive digital plot twin, soil fertility records, crop stage timeline, and farm economic ledger.",
      emptyTitle: "No farm has been added yet.",
      emptyDesc: "Register your real farm plot to activate soil NPK analysis, crop stage advisories, weather alerts, and APMC market arbitrage.",
      addFarmBtn: "+ Add My Farm",
      switchLang: "ಕನ್ನಡದಲ್ಲಿ ನೋಡಿ",
      farmSelect: "Active Farm:",
      completeness: "Farm Data Completeness",
      missingNotice: "Missing fields to reach 100%:",
      tabs: {
        overview: "Overview",
        crops: "Crops & Stages",
        soilWater: "Soil & Water",
        activities: "Activity Log",
        pests: "Pest & Disease",
        financials: "Expenses & Profit",
        weatherMarkets: "Weather & Markets",
        recommendations: "AI Agronomist",
      },
      quickStats: {
        totalArea: "Total Land Size",
        activeCrops: "Standing Crops",
        totalExpenses: "Recorded Expenses",
        netProfit: "Realized Net Profit",
        soilStatus: "Soil Health Status",
        waterSource: "Irrigation System",
      },
      actions: {
        addCrop: "+ Add Crop Plot",
        updateStage: "Update Stage",
        logActivity: "+ Log Activity",
        addExpense: "+ Record Expense",
        recordSale: "+ Record Harvest Sale",
        reportPest: "+ Report Pest / Disease",
        updateSoil: "+ Update Soil Test",
        deleteFarm: "Delete Farm",
      },
      wizard: {
        step1: "1. Basic Details",
        step2: "2. GPS Location",
        step3: "3. Soil Test",
        step4: "4. Water & Irrigation",
        step5: "5. Current Crop",
        step6: "6. Review & Save",
        useGps: "📍 Use My Current Location",
        acquiringGps: "Acquiring GPS Coordinates...",
        confirmLoc: "Confirm Location Coordinates",
        saveFarm: "Register Farm to Database",
        next: "Next Step →",
        back: "← Back",
      },
      notAvailable: "Data not available",
      noSoil: "Soil information has not been added yet.",
      noWater: "Irrigation information has not been added.",
      noCrops: "No standing crop has been added to this farm.",
      noActivities: "No field activities logged yet. Keep a record of your farm operations.",
      noPests: "No pest or disease attacks logged. Your field is currently clear.",
      noExpenses: "No expenses recorded yet. Track seeds, fertilizer, and labour costs.",
      noSales: "No harvest sales recorded yet.",
      profitMissing: "Profit cannot be calculated yet. Add your expenses and sales.",
    },
    kn: {
      title: "ನನ್ನ ಜಮೀನು ಡಿಜಿಟಲ್ ಪ್ರೊಫೈಲ್",
      subtitle: "ಸಂಪೂರ್ಣ ಜಮೀನಿನ ಡಿಜಿಟಲ್ ಮಾಹಿತಿ, ಮಣ್ಣು ಪರೀಕ್ಷೆ, ಬೆಳೆ ಹಂತಗಳ ವೇಳಾಪಟ್ಟಿ ಮತ್ತು ಖರ್ಚು-ವೆಚ್ಚದ ಲೆಕ್ಕ.",
      emptyTitle: "ಇನ್ನೂ ಯಾವುದೇ ಜಮೀನು ಸೇರಿಸಲಾಗಿಲ್ಲ.",
      emptyDesc: "ಮಣ್ಣಿನ NPK ವಿಶ್ಲೇಷಣೆ, ಹವಾಮಾನ ಮುನ್ಸೂಚನೆ ಮತ್ತು ಮಾರುಕಟ್ಟೆ ಧಾರಣೆ ಪಡೆಯಲು ನಿಮ್ಮ ಜಮೀನನ್ನು ನೋಂದಾಯಿಸಿ.",
      addFarmBtn: "+ ನನ್ನ ಜಮೀನು ಸೇರಿಸಿ",
      switchLang: "View in English",
      farmSelect: "ಆಯ್ಕೆಮಾಡಿದ ಜಮೀನು:",
      completeness: "ಮಾಹಿತಿ ಪೂರ್ಣತೆಯ ಪ್ರಮಾಣ",
      missingNotice: "100% ಪೂರ್ಣಗೊಳಿಸಲು ಬಾಕಿ ಇರುವ ಮಾಹಿತಿ:",
      tabs: {
        overview: "ಅವಲೋಕನ",
        crops: "ಬೆಳೆಗಳು ಮತ್ತು ಹಂತಗಳು",
        soilWater: "ಮಣ್ಣು ಮತ್ತು ನೀರು",
        activities: "ಚಟುವಟಿಕೆಗಳ ದಿನಚರಿ",
        pests: "ಕೀಟ ಮತ್ತು ರೋಗಗಳು",
        financials: "ಖರ್ಚು ಮತ್ತು ಲಾಭ",
        weatherMarkets: "ಹವಾಮಾನ & ಮಾರುಕಟ್ಟೆ",
        recommendations: "ಕೃಷಿ ಸಲಹೆಗಾರ (AI)",
      },
      quickStats: {
        totalArea: "ಒಟ್ಟು ಜಮೀನಿನ ವಿಸ್ತೀರ್ಣ",
        activeCrops: "ಹಾಲಿ ಬೆಳೆಗಳು",
        totalExpenses: "ಒಟ್ಟು ಖರ್ಚುಗಳು",
        netProfit: "ನಿವ್ವಳ ಲಾಭ",
        soilStatus: "ಮಣ್ಣಿನ ಆರೋಗ್ಯ",
        waterSource: "ನೀರಾವರಿ ವ್ಯವಸ್ಥೆ",
      },
      actions: {
        addCrop: "+ ಹೊಸ ಬೆಳೆ ಸೇರಿಸಿ",
        updateStage: "ಹಂತ ನವೀಕರಿಸಿ",
        logActivity: "+ ಚಟುವಟಿಕೆ ದಾಖಲಿಸಿ",
        addExpense: "+ ಖರ್ಚು ದಾಖಲಿಸಿ",
        recordSale: "+ ಮಾರಾಟ ದಾಖಲಿಸಿ",
        reportPest: "+ ರೋಗ/ಕೀಟ ವರದಿ ಮಾಡಿ",
        updateSoil: "+ ಮಣ್ಣು ಪರೀಕ್ಷೆ ನವೀಕರಿಸಿ",
        deleteFarm: "ಜಮೀನು ಅಳಿಸಿ",
      },
      wizard: {
        step1: "1. ಮೂಲ ವಿವರಗಳು",
        step2: "2. ಜಿಪಿಎಸ್ ಸ್ಥಳ",
        step3: "3. ಮಣ್ಣು ಪರೀಕ್ಷೆ",
        step4: "4. ನೀರಾವರಿ ವ್ಯವಸ್ಥೆ",
        step5: "5. ಹಾಲಿ ಬೆಳೆ",
        step6: "6. ಪರಿಶೀಲಿಸಿ & ಉಳಿಸಿ",
        useGps: "📍 ನನ್ನ ಸ್ಥಳವನ್ನು ಬಳಸಿ",
        acquiringGps: "ಜಿಪಿಎಸ್ ಪಡೆಯಲಾಗುತ್ತಿದೆ...",
        confirmLoc: "ಸ್ಥಳವನ್ನು ದೃಢೀಕರಿಸಿ",
        saveFarm: "ಜಮೀನನ್ನು ನೋಂದಾಯಿಸಿ",
        next: "ಮುಂದಿನ ಹಂತ →",
        back: "← ಹಿಂದಕ್ಕೆ",
      },
      notAvailable: "ಮಾಹಿತಿ ಲಭ್ಯವಿಲ್ಲ",
      noSoil: "ಮಣ್ಣಿನ ಪರೀಕ್ಷೆಯ ವಿವರಗಳನ್ನು ಇನ್ನೂ ಸೇರಿಸಲಾಗಿಲ್ಲ.",
      noWater: "ನೀರಾವರಿ ವಿವರಗಳನ್ನು ಇನ್ನೂ ಸೇರಿಸಲಾಗಿಲ್ಲ.",
      noCrops: "ಈ ಜಮೀನಿನಲ್ಲಿ ಯಾವುದೇ ಬೆಳೆ ದಾಖಲಾಗಿಲ್ಲ.",
      noActivities: "ಯಾವುದೇ ಕೃಷಿ ಚಟುವಟಿಕೆ ದಾಖಲಾಗಿಲ್ಲ.",
      noPests: "ಯಾವುದೇ ಕೀಟ ಅಥವಾ ರೋಗದ ಬಾಧೆ ದಾಖಲಾಗಿಲ್ಲ.",
      noExpenses: "ಖರ್ಚುಗಳನ್ನು ಇನ್ನೂ ದಾಖಲಿಸಲಾಗಿಲ್ಲ.",
      noSales: "ಬೆಳೆ ಮಾರಾಟವನ್ನು ಇನ್ನೂ ದಾಖಲಿಸಲಾಗಿಲ್ಲ.",
      profitMissing: "ಲಾಭವನ್ನು ಲೆಕ್ಕಹಾಕಲು ಖರ್ಚು ಮತ್ತು ಮಾರಾಟದ ವಿವರಗಳನ್ನು ಸೇರಿಸಿ.",
    },
  }[lang];

  // Fetch Farms on mount
  const loadFarms = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/farms");
      const data = await res.json();
      if (data.success && Array.isArray(data.farms)) {
        setFarms(data.farms);
        if (data.farms.length > 0 && !activeFarmId) {
          setActiveFarmId(data.farms[0].id);
        }
      }
    } catch (err) {
      console.error("Error loading farms:", err);
    } finally {
      setLoading(false);
    }
  }, [activeFarmId]);

  useEffect(() => {
    loadFarms();
  }, [loadFarms]);

  // Fetch active farm dashboard when activeFarmId changes
  useEffect(() => {
    if (!activeFarmId) {
      setDashboardData(null);
      return;
    }

    async function loadDashboard() {
      try {
        const res = await fetch(`/api/farms/${activeFarmId}/dashboard`);
        const data = await res.json();
        if (data.success && data.dashboard) {
          setDashboardData(data.dashboard);
        }
      } catch (err) {
        console.error("Error fetching farm dashboard:", err);
      }
    }

    loadDashboard();
  }, [activeFarmId]);

  // GPS Acquisition Handler for Wizard
  const handleAcquireGps = () => {
    if (!navigator.geolocation) {
      showToast("GPS Unavailable", "Browser geolocation is not supported.", "alert");
      return;
    }

    setGpsLoading(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        try {
          const res = await fetch("/api/location/resolve", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ latitude, longitude }),
          });
          const data = await res.json();

          if (data.success && data.resolved_location) {
            setNewFarmForm((prev) => ({
              ...prev,
              latitude,
              longitude,
              district: data.resolved_location.district,
              taluk: data.resolved_location.district,
              isGpsAcquired: true,
            }));
            showToast("📍 Location Locked", `GPS coordinates acquired for ${data.resolved_location.district}, Karnataka.`, "success");
          } else {
            setNewFarmForm((prev) => ({
              ...prev,
              latitude,
              longitude,
              isGpsAcquired: true,
            }));
            showToast("📍 GPS Locked", "Coordinates saved securely.", "success");
          }
        } catch (e) {
          setNewFarmForm((prev) => ({ ...prev, latitude, longitude, isGpsAcquired: true }));
        } finally {
          setGpsLoading(false);
        }
      },
      (err) => {
        setGpsLoading(false);
        showToast("GPS Notice", "Permission denied. Please select district manually.", "info");
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  // Submit New Farm Registration
  const handleSaveFarm = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newFarmForm.farm_name.trim()) {
      showToast("Required Field", "Please enter a farm name.", "alert");
      return;
    }

    const areaNum = parseFloat(newFarmForm.total_area);
    if (isNaN(areaNum) || areaNum <= 0) {
      showToast("Invalid Area", "Total farm area must be greater than 0.", "alert");
      return;
    }

    try {
      const payload: any = {
        farm_name: newFarmForm.farm_name.trim(),
        total_area: areaNum,
        area_unit: newFarmForm.area_unit,
        ownership_type: newFarmForm.ownership_type,
        address: newFarmForm.address,
        district: newFarmForm.district,
        taluk: newFarmForm.taluk || newFarmForm.district,
        village: newFarmForm.village,
        pincode: newFarmForm.pincode,
        location: {
          latitude: newFarmForm.latitude,
          longitude: newFarmForm.longitude,
          address: `${newFarmForm.village || ""}, ${newFarmForm.taluk}, ${newFarmForm.district}`,
        },
      };

      if (newFarmForm.soil_type) {
        payload.soil = {
          soil_type: newFarmForm.soil_type,
          test_date: newFarmForm.test_date,
          ph: newFarmForm.ph,
          nitrogen: newFarmForm.nitrogen,
          phosphorus: newFarmForm.phosphorus,
          potassium: newFarmForm.potassium,
          organic_carbon: newFarmForm.organic_carbon,
        };
      }

      if (newFarmForm.water_source) {
        payload.water = {
          water_source: newFarmForm.water_source,
          irrigation_method: newFarmForm.irrigation_method,
          storage_capacity: newFarmForm.storage_capacity,
        };
      }

      if (newFarmForm.has_crop && newFarmForm.crop_name) {
        payload.initial_crop = {
          crop_name: newFarmForm.crop_name,
          variety: newFarmForm.variety,
          sowing_date: newFarmForm.sowing_date,
          current_stage: newFarmForm.current_stage,
          area_acres: parseFloat(newFarmForm.crop_area) || areaNum,
        };
      }

      const res = await fetch("/api/farms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (data.success && data.farm) {
        showToast("Farm Registered", `"${data.farm.farm_name}" registered successfully.`, "success");
        setShowAddFarmModal(false);
        setWizardStep(1);
        await loadFarms();
        setActiveFarmId(data.farm.id);
      } else {
        showToast("Registration Failed", data.error || "Unable to save farm.", "alert");
      }
    } catch (err: any) {
      showToast("Error", err.message || "Failed to save farm.", "alert");
    }
  };

  // Delete Farm Handler
  const handleDeleteFarm = async (farmId: string) => {
    if (!confirm("Are you sure you want to delete this farm and all its records? This cannot be undone.")) {
      return;
    }

    try {
      const res = await fetch(`/api/farms/${farmId}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        showToast("Farm Deleted", "Farm records removed.", "info");
        const remaining = farms.filter((f) => f.id !== farmId);
        setFarms(remaining);
        setActiveFarmId(remaining.length > 0 ? remaining[0].id : null);
      }
    } catch (err) {
      showToast("Error", "Failed to delete farm.", "alert");
    }
  };

  // Active farm object
  const currentFarm = useMemo(() => {
    return farms.find((f) => f.id === activeFarmId) || null;
  }, [farms, activeFarmId]);

  return (
    <div className="min-h-screen bg-transparent py-6 px-3 sm:px-6 lg:px-8 text-white space-y-8">
      <div className="max-w-7xl mx-auto space-y-8">

        {/* Top Header & Language Switcher */}
        <div className="bg-black/45 backdrop-blur-xl rounded-3xl p-6 sm:p-8 border border-white/20 shadow-2xl space-y-4">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-xs font-medium text-brand-300">
                <span className="px-2.5 py-0.5 rounded-full bg-brand-500/30 border border-brand-400/40 text-brand-200 font-bold uppercase tracking-wider text-[11px]">
                  SIH26197 My Farm
                </span>
                <span>•</span>
                <span className="text-neutral-300">Farmer Digital Plot Registry</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-display font-bold text-white tracking-tight flex items-center gap-3">
                <Tractor className="w-8 h-8 text-brand-400 shrink-0" />
                {t.title}
              </h1>
              <p className="text-xs sm:text-sm text-neutral-300 max-w-3xl leading-relaxed">
                {t.subtitle}
              </p>
            </div>

            {/* Language & Actions */}
            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => setLang(lang === "en" ? "kn" : "en")}
                className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-xs font-semibold text-white transition-all shadow-md flex items-center gap-2"
              >
                🌐 {t.switchLang}
              </button>

              <button
                type="button"
                onClick={() => {
                  setWizardStep(1);
                  setShowAddFarmModal(true);
                }}
                className="px-5 py-2.5 rounded-xl bg-brand-500 hover:bg-brand-600 text-white font-semibold text-xs transition-all shadow-lg hover:shadow-brand-500/25 flex items-center gap-2"
              >
                <PlusCircle className="w-4 h-4" />
                {t.addFarmBtn}
              </button>
            </div>
          </div>

          {/* Farm Switcher Bar (when farms exist) */}
          {farms.length > 0 && (
            <div className="pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <span className="text-xs font-medium text-neutral-300">{t.farmSelect}</span>
                <div className="flex flex-wrap items-center gap-2">
                  {farms.map((f) => (
                    <button
                      key={f.id}
                      type="button"
                      onClick={() => setActiveFarmId(f.id)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                        activeFarmId === f.id
                          ? "bg-brand-500 text-white font-bold border border-brand-400 shadow-md"
                          : "bg-white/5 text-neutral-300 hover:bg-white/10 border border-white/10"
                      }`}
                    >
                      🌱 {f.farm_name} ({f.total_area} {f.area_unit || "Acres"})
                    </button>
                  ))}
                </div>
              </div>

              {currentFarm && (
                <button
                  type="button"
                  onClick={() => handleDeleteFarm(currentFarm.id)}
                  className="px-3 py-1.5 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 border border-rose-500/40 text-rose-300 text-xs font-medium transition-all flex items-center gap-1.5"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  {t.actions.deleteFarm}
                </button>
              )}
            </div>
          )}
        </div>

        {/* ============================================================ */}
        {/* CASE A: ZERO FARMS REGISTERED — TRUE CLEAN EMPTY STATE */}
        {/* ============================================================ */}
        {farms.length === 0 && !loading && (
          <div className="bg-black/45 backdrop-blur-xl rounded-3xl p-10 sm:p-16 border border-white/20 shadow-2xl text-center space-y-6 max-w-3xl mx-auto">
            <div className="w-20 h-20 mx-auto rounded-3xl bg-brand-500/20 border border-brand-400/40 flex items-center justify-center text-brand-300 shadow-inner">
              <Tractor className="w-10 h-10 animate-pulse" />
            </div>

            <div className="space-y-2">
              <h2 className="text-2xl sm:text-3xl font-bold font-display text-white">
                {t.emptyTitle}
              </h2>
              <p className="text-sm text-neutral-300 max-w-lg mx-auto leading-relaxed">
                {t.emptyDesc}
              </p>
            </div>

            <div className="pt-2">
              <button
                type="button"
                onClick={() => {
                  setWizardStep(1);
                  setShowAddFarmModal(true);
                }}
                className="px-8 py-4 rounded-2xl bg-brand-500 hover:bg-brand-600 text-white font-bold text-base transition-all shadow-xl hover:shadow-brand-500/30 hover:scale-105 inline-flex items-center gap-3"
              >
                <PlusCircle className="w-5 h-5" />
                {t.addFarmBtn}
              </button>
            </div>

            <div className="pt-6 border-t border-white/10 grid grid-cols-1 sm:grid-cols-3 gap-4 text-left">
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-1">
                <div className="text-brand-400 font-bold text-xs flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5" /> 1. Location & Soil
                </div>
                <p className="text-[11px] text-neutral-300">
                  GPS one-tap positioning and NPK soil test profile.
                </p>
              </div>
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-1">
                <div className="text-brand-400 font-bold text-xs flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5" /> 2. Crops & Stages
                </div>
                <p className="text-[11px] text-neutral-300">
                  Stage-by-stage agronomic and irrigation advisory.
                </p>
              </div>
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-1">
                <div className="text-brand-400 font-bold text-xs flex items-center gap-1.5">
                  <TrendingUp className="w-3.5 h-3.5" /> 3. Mandi & Profit
                </div>
                <p className="text-[11px] text-neutral-300">
                  Direct Karnataka APMC arbitrage and cost ledger.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* CASE B: ACTIVE FARM DASHBOARD — GROUNDED IN REAL DATA */}
        {/* ============================================================ */}
        {farms.length > 0 && dashboardData && (
          <div className="space-y-6">

            {/* Farm Overview Header Card & Completeness Bar */}
            <div className="bg-black/45 backdrop-blur-xl rounded-3xl p-6 border border-white/20 shadow-xl space-y-4">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <h2 className="text-xl font-bold text-white flex items-center gap-2">
                    🌾 {dashboardData.farm_profile.farm_name}
                    <span className="px-2.5 py-0.5 rounded-full bg-brand-500/20 text-brand-300 text-xs font-semibold border border-brand-400/30">
                      {dashboardData.farm_profile.ownership_type}
                    </span>
                  </h2>
                  <p className="text-xs text-neutral-300 flex items-center gap-2 mt-1">
                    <MapPin className="w-3.5 h-3.5 text-brand-400 shrink-0" />
                    {dashboardData.farm_profile.village ? `${dashboardData.farm_profile.village}, ` : ""}
                    {dashboardData.farm_profile.taluk}, {dashboardData.farm_profile.district}, {dashboardData.farm_profile.state}
                  </p>
                </div>

                {/* Completeness Bar */}
                <div className="bg-white/5 border border-white/10 rounded-2xl p-4 min-w-[280px] space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-neutral-200">{t.completeness}</span>
                    <span className="font-bold text-brand-400">{dashboardData.completeness.overallPercentage}%</span>
                  </div>
                  <div className="w-full bg-neutral-800 rounded-full h-2.5 overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-amber-500 to-emerald-400 h-2.5 rounded-full transition-all duration-500"
                      style={{ width: `${dashboardData.completeness.overallPercentage}%` }}
                    />
                  </div>
                  {dashboardData.completeness.missingSections.length > 0 && (
                    <p className="text-[10px] text-amber-300 truncate">
                      {t.missingNotice} {dashboardData.completeness.missingSections[0]}
                    </p>
                  )}
                </div>
              </div>

              {/* Navigation Tabs */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 pt-2 border-t border-white/10 text-xs">
                {(
                  [
                    { id: "overview", label: t.tabs.overview, icon: Activity },
                    { id: "crops", label: t.tabs.crops, icon: Layers },
                    { id: "soil_water", label: t.tabs.soilWater, icon: FlaskConical },
                    { id: "activities", label: t.tabs.activities, icon: Calendar },
                    { id: "pests", label: t.tabs.pests, icon: Bug },
                    { id: "financials", label: t.tabs.financials, icon: DollarSign },
                    { id: "weather_markets", label: t.tabs.weatherMarkets, icon: TrendingUp },
                    { id: "recommendations", label: t.tabs.recommendations, icon: Sparkles },
                  ] as const
                ).map((tab) => {
                  const Icon = tab.icon;
                  const isActive = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setActiveTab(tab.id)}
                      className={`px-3.5 py-2 rounded-xl font-medium transition-all whitespace-nowrap flex items-center gap-2 ${
                        isActive
                          ? "bg-brand-500 text-white font-bold shadow-md"
                          : "bg-white/5 text-neutral-300 hover:bg-white/10 hover:text-white"
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5" />
                      {tab.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* TAB 1: OVERVIEW */}
            {activeTab === "overview" && (
              <div className="space-y-6">
                {/* 4 Quick Stat Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="bg-black/40 backdrop-blur-md rounded-2xl p-5 border border-white/15 shadow-lg space-y-1">
                    <div className="text-neutral-400 text-xs flex items-center justify-between">
                      <span>{t.quickStats.totalArea}</span>
                      <Scale className="w-4 h-4 text-brand-400" />
                    </div>
                    <div className="text-2xl font-bold text-white">
                      {dashboardData.farm_profile.total_area} {dashboardData.farm_profile.area_unit}
                    </div>
                    <p className="text-[11px] text-neutral-300">
                      {dashboardData.farm_profile.ownership_type} holding in {dashboardData.farm_profile.district}
                    </p>
                  </div>

                  <div className="bg-black/40 backdrop-blur-md rounded-2xl p-5 border border-white/15 shadow-lg space-y-1">
                    <div className="text-neutral-400 text-xs flex items-center justify-between">
                      <span>{t.quickStats.activeCrops}</span>
                      <Layers className="w-4 h-4 text-emerald-400" />
                    </div>
                    <div className="text-2xl font-bold text-emerald-300">
                      {dashboardData.crops.count} Plots
                    </div>
                    <p className="text-[11px] text-neutral-300">
                      {dashboardData.crops.has_data ? dashboardData.crops.plots[0].crop_name : t.notAvailable}
                    </p>
                  </div>

                  <div className="bg-black/40 backdrop-blur-md rounded-2xl p-5 border border-white/15 shadow-lg space-y-1">
                    <div className="text-neutral-400 text-xs flex items-center justify-between">
                      <span>{t.quickStats.totalExpenses}</span>
                      <Receipt className="w-4 h-4 text-amber-400" />
                    </div>
                    <div className="text-2xl font-bold text-amber-300">
                      ₹{dashboardData.financials.profit_summary.totalProductionExpenses.toLocaleString("en-IN")}
                    </div>
                    <p className="text-[11px] text-neutral-300">
                      {dashboardData.financials.expense_count} recorded expense entries
                    </p>
                  </div>

                  <div className="bg-black/40 backdrop-blur-md rounded-2xl p-5 border border-white/15 shadow-lg space-y-1">
                    <div className="text-neutral-400 text-xs flex items-center justify-between">
                      <span>{t.quickStats.netProfit}</span>
                      <TrendingUp className="w-4 h-4 text-brand-400" />
                    </div>
                    <div className="text-2xl font-bold text-white">
                      {dashboardData.financials.profit_summary.hasSufficientData
                        ? `₹${dashboardData.financials.profit_summary.netProfit.toLocaleString("en-IN")}`
                        : "—"}
                    </div>
                    <p className="text-[11px] text-neutral-300 truncate">
                      {dashboardData.financials.profit_summary.hasSufficientData
                        ? `ROI: ${dashboardData.financials.profit_summary.roiPercentage}%`
                        : t.profitMissing}
                    </p>
                  </div>
                </div>

                {/* Primary Highlights Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Crops Card */}
                  <div className="bg-black/40 backdrop-blur-md rounded-3xl p-6 border border-white/20 shadow-xl space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-base font-bold text-white flex items-center gap-2">
                        <Layers className="w-5 h-5 text-emerald-400" />
                        Standing Crops & Lifecycle
                      </h3>
                      <button
                        type="button"
                        onClick={() => setShowAddCropModal(true)}
                        className="text-xs font-semibold text-brand-300 hover:text-brand-200"
                      >
                        {t.actions.addCrop}
                      </button>
                    </div>

                    {dashboardData.crops.has_data ? (
                      <div className="space-y-3">
                        {dashboardData.crops.plots.map((cp: any) => (
                          <div key={cp.id} className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="font-bold text-white text-sm">🌾 {cp.crop_name} ({cp.variety})</span>
                              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[11px] font-semibold border border-emerald-400/30">
                                {cp.current_stage}
                              </span>
                            </div>
                            <div className="grid grid-cols-2 text-xs text-neutral-300 gap-1">
                              <div>Sown: <span className="text-white font-medium">{cp.sowing_date}</span></div>
                              <div>Area: <span className="text-white font-medium">{cp.area_acres} Acres</span></div>
                            </div>
                            <div className="pt-2 flex justify-end">
                              <button
                                type="button"
                                onClick={() => {
                                  setSelectedCropForStage(cp);
                                  setShowUpdateStageModal(true);
                                }}
                                className="px-3 py-1 rounded-lg bg-brand-500/20 hover:bg-brand-500/30 border border-brand-400/30 text-brand-200 text-xs font-medium"
                              >
                                {t.actions.updateStage}
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="p-8 text-center bg-white/5 rounded-2xl border border-white/10 space-y-3">
                        <Layers className="w-8 h-8 text-neutral-400 mx-auto" />
                        <p className="text-xs text-neutral-300">{t.noCrops}</p>
                        <button
                          type="button"
                          onClick={() => setShowAddCropModal(true)}
                          className="px-4 py-2 rounded-xl bg-brand-500 hover:bg-brand-600 text-white font-semibold text-xs"
                        >
                          {t.actions.addCrop}
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Soil & Water Card */}
                  <div className="bg-black/40 backdrop-blur-md rounded-3xl p-6 border border-white/20 shadow-xl space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-base font-bold text-white flex items-center gap-2">
                        <FlaskConical className="w-5 h-5 text-amber-400" />
                        Soil Fertility & Irrigation
                      </h3>
                      <button
                        type="button"
                        onClick={() => setShowUpdateSoilModal(true)}
                        className="text-xs font-semibold text-brand-300 hover:text-brand-200"
                      >
                        {t.actions.updateSoil}
                      </button>
                    </div>

                    {dashboardData.soil.has_data ? (
                      <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-neutral-300">Soil Type: <strong className="text-white">{dashboardData.soil.latest_record.soil_type}</strong></span>
                          <span className="text-[11px] text-neutral-400">Tested: {dashboardData.soil.latest_record.test_date}</span>
                        </div>
                        <div className="grid grid-cols-4 gap-2 text-center text-xs">
                          <div className="p-2 rounded-xl bg-black/40 border border-white/10">
                            <div className="text-neutral-400 text-[10px]">pH</div>
                            <div className="font-bold text-brand-300">{dashboardData.soil.latest_record.ph || "—"}</div>
                          </div>
                          <div className="p-2 rounded-xl bg-black/40 border border-white/10">
                            <div className="text-neutral-400 text-[10px]">N (kg/ha)</div>
                            <div className="font-bold text-emerald-300">{dashboardData.soil.latest_record.nitrogen || "—"}</div>
                          </div>
                          <div className="p-2 rounded-xl bg-black/40 border border-white/10">
                            <div className="text-neutral-400 text-[10px]">P (kg/ha)</div>
                            <div className="font-bold text-amber-300">{dashboardData.soil.latest_record.phosphorus || "—"}</div>
                          </div>
                          <div className="p-2 rounded-xl bg-black/40 border border-white/10">
                            <div className="text-neutral-400 text-[10px]">K (kg/ha)</div>
                            <div className="font-bold text-sky-300">{dashboardData.soil.latest_record.potassium || "—"}</div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="p-6 text-center bg-white/5 rounded-2xl border border-white/10 space-y-2">
                        <FlaskConical className="w-7 h-7 text-neutral-400 mx-auto" />
                        <p className="text-xs text-neutral-300">{t.noSoil}</p>
                      </div>
                    )}

                    {dashboardData.water.has_data ? (
                      <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-1">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-neutral-300 flex items-center gap-1.5"><Droplets className="w-3.5 h-3.5 text-sky-400" /> Source:</span>
                          <strong className="text-white">{dashboardData.water.resources.water_source}</strong>
                        </div>
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-neutral-300">Method:</span>
                          <strong className="text-white">{dashboardData.water.resources.irrigation_method}</strong>
                        </div>
                      </div>
                    ) : (
                      <div className="p-4 text-center bg-white/5 rounded-2xl border border-white/10 text-xs text-neutral-300">
                        {t.noWater}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: CROPS */}
            {activeTab === "crops" && (
              <div className="bg-black/45 backdrop-blur-xl rounded-3xl p-6 sm:p-8 border border-white/20 shadow-xl space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-white">Standing Crop Plots</h3>
                    <p className="text-xs text-neutral-300">Track planting dates, phenological stages, and area allocation.</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowAddCropModal(true)}
                    className="px-4 py-2 rounded-xl bg-brand-500 hover:bg-brand-600 text-white font-semibold text-xs flex items-center gap-2"
                  >
                    <PlusCircle className="w-4 h-4" />
                    {t.actions.addCrop}
                  </button>
                </div>

                {dashboardData.crops.has_data ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {dashboardData.crops.plots.map((cp: any) => (
                      <div key={cp.id} className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-bold text-white text-base">🌾 {cp.crop_name}</h4>
                            <p className="text-xs text-neutral-300">Variety: {cp.variety} • {cp.farming_practice}</p>
                          </div>
                          <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-400/40">
                            {cp.current_stage}
                          </span>
                        </div>

                        <div className="grid grid-cols-2 gap-2 text-xs bg-black/40 p-3 rounded-xl border border-white/10">
                          <div>Sowing Date: <strong className="text-white block">{cp.sowing_date}</strong></div>
                          <div>Allocated Area: <strong className="text-white block">{cp.area_acres} Acres</strong></div>
                        </div>

                        <div className="flex justify-end gap-2 pt-2">
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedCropForStage(cp);
                              setShowUpdateStageModal(true);
                            }}
                            className="px-4 py-1.5 rounded-xl bg-brand-500 hover:bg-brand-600 text-white text-xs font-semibold"
                          >
                            Update Growth Stage
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-12 text-center bg-white/5 rounded-2xl border border-white/10 space-y-3">
                    <Layers className="w-10 h-10 text-neutral-400 mx-auto" />
                    <p className="text-sm text-neutral-300">{t.noCrops}</p>
                    <button
                      type="button"
                      onClick={() => setShowAddCropModal(true)}
                      className="px-5 py-2.5 rounded-xl bg-brand-500 hover:bg-brand-600 text-white font-semibold text-xs"
                    >
                      {t.actions.addCrop}
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* TAB 3: SOIL & WATER */}
            {activeTab === "soil_water" && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Soil Details */}
                <div className="bg-black/45 backdrop-blur-xl rounded-3xl p-6 sm:p-8 border border-white/20 shadow-xl space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-bold text-white">Soil Health & Nutrients</h3>
                      <p className="text-xs text-neutral-300">Measured laboratory soil test parameters.</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setShowUpdateSoilModal(true)}
                      className="px-3.5 py-1.5 rounded-xl bg-brand-500/20 hover:bg-brand-500/30 border border-brand-400/40 text-brand-200 text-xs font-semibold"
                    >
                      {t.actions.updateSoil}
                    </button>
                  </div>

                  {dashboardData.soil.has_data ? (
                    <div className="space-y-4">
                      {dashboardData.soil.all_records.map((sr: any) => (
                        <div key={sr.id} className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-3">
                          <div className="flex items-center justify-between text-xs">
                            <span className="font-bold text-white text-sm">🧪 {sr.soil_type}</span>
                            <span className="text-neutral-400">{sr.test_date}</span>
                          </div>
                          <div className="grid grid-cols-3 gap-2 text-center text-xs">
                            <div className="p-2.5 rounded-xl bg-black/40 border border-white/10">
                              <div className="text-neutral-400 text-[10px]">pH Reaction</div>
                              <div className="font-bold text-base text-white">{sr.ph || "—"}</div>
                            </div>
                            <div className="p-2.5 rounded-xl bg-black/40 border border-white/10">
                              <div className="text-neutral-400 text-[10px]">Nitrogen</div>
                              <div className="font-bold text-base text-emerald-300">{sr.nitrogen ? `${sr.nitrogen} kg/ha` : "—"}</div>
                            </div>
                            <div className="p-2.5 rounded-xl bg-black/40 border border-white/10">
                              <div className="text-neutral-400 text-[10px]">Phosphorus</div>
                              <div className="font-bold text-base text-amber-300">{sr.phosphorus ? `${sr.phosphorus} kg/ha` : "—"}</div>
                            </div>
                            <div className="p-2.5 rounded-xl bg-black/40 border border-white/10">
                              <div className="text-neutral-400 text-[10px]">Potassium</div>
                              <div className="font-bold text-base text-sky-300">{sr.potassium ? `${sr.potassium} kg/ha` : "—"}</div>
                            </div>
                            <div className="p-2.5 rounded-xl bg-black/40 border border-white/10">
                              <div className="text-neutral-400 text-[10px]">Organic Carbon</div>
                              <div className="font-bold text-base text-white">{sr.organic_carbon ? `${sr.organic_carbon}%` : "—"}</div>
                            </div>
                            <div className="p-2.5 rounded-xl bg-black/40 border border-white/10">
                              <div className="text-neutral-400 text-[10px]">Moisture</div>
                              <div className="font-bold text-base text-white">{sr.moisture ? `${sr.moisture}%` : "—"}</div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-10 text-center bg-white/5 rounded-2xl border border-white/10 space-y-3">
                      <FlaskConical className="w-8 h-8 text-neutral-400 mx-auto" />
                      <p className="text-xs text-neutral-300">{t.noSoil}</p>
                    </div>
                  )}
                </div>

                {/* Water & Irrigation Details */}
                <div className="bg-black/45 backdrop-blur-xl rounded-3xl p-6 sm:p-8 border border-white/20 shadow-xl space-y-6">
                  <div>
                    <h3 className="text-lg font-bold text-white">Water Resources & Irrigation</h3>
                    <p className="text-xs text-neutral-300">Irrigation infrastructure and storage capacity.</p>
                  </div>

                  {dashboardData.water.has_data ? (
                    <div className="p-6 rounded-2xl bg-white/5 border border-white/10 space-y-4">
                      <div className="grid grid-cols-2 gap-4 text-xs">
                        <div className="p-3.5 rounded-xl bg-black/40 border border-white/10">
                          <span className="text-neutral-400 block text-[11px]">Primary Water Source</span>
                          <strong className="text-white text-sm">{dashboardData.water.resources.water_source}</strong>
                        </div>
                        <div className="p-3.5 rounded-xl bg-black/40 border border-white/10">
                          <span className="text-neutral-400 block text-[11px]">Irrigation Method</span>
                          <strong className="text-white text-sm">{dashboardData.water.resources.irrigation_method}</strong>
                        </div>
                        <div className="p-3.5 rounded-xl bg-black/40 border border-white/10">
                          <span className="text-neutral-400 block text-[11px]">Water Availability</span>
                          <strong className="text-emerald-300 text-sm">{dashboardData.water.resources.irrigation_availability}</strong>
                        </div>
                        <div className="p-3.5 rounded-xl bg-black/40 border border-white/10">
                          <span className="text-neutral-400 block text-[11px]">Storage Capacity</span>
                          <strong className="text-white text-sm">{dashboardData.water.resources.storage_capacity} Liters</strong>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="p-10 text-center bg-white/5 rounded-2xl border border-white/10 space-y-3">
                      <Droplets className="w-8 h-8 text-neutral-400 mx-auto" />
                      <p className="text-xs text-neutral-300">{t.noWater}</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* TAB 4: ACTIVITIES */}
            {activeTab === "activities" && (
              <div className="bg-black/45 backdrop-blur-xl rounded-3xl p-6 sm:p-8 border border-white/20 shadow-xl space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-white">Digital Farm Journal</h3>
                    <p className="text-xs text-neutral-300">Chronological history of operations, spraying, fertigation, and labour tasks.</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowAddActivityModal(true)}
                    className="px-4 py-2 rounded-xl bg-brand-500 hover:bg-brand-600 text-white font-semibold text-xs flex items-center gap-2"
                  >
                    <PlusCircle className="w-4 h-4" />
                    {t.actions.logActivity}
                  </button>
                </div>

                {dashboardData.activities.has_data ? (
                  <div className="space-y-3">
                    {dashboardData.activities.recent.map((act: any) => (
                      <div key={act.id} className="p-4 rounded-2xl bg-white/5 border border-white/10 flex items-start justify-between gap-4">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="px-2.5 py-0.5 rounded-full bg-brand-500/20 text-brand-300 text-xs font-semibold border border-brand-400/30">
                              {act.activity_type}
                            </span>
                            <span className="text-xs text-neutral-400">{act.activity_date}</span>
                          </div>
                          {act.notes && <p className="text-xs text-white leading-relaxed">{act.notes}</p>}
                        </div>
                        {act.cost_inr > 0 && (
                          <div className="text-right">
                            <div className="text-xs text-neutral-400">Cost</div>
                            <div className="text-sm font-bold text-amber-300">₹{act.cost_inr.toLocaleString("en-IN")}</div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-12 text-center bg-white/5 rounded-2xl border border-white/10 space-y-3">
                    <Calendar className="w-10 h-10 text-neutral-400 mx-auto" />
                    <p className="text-sm text-neutral-300">{t.noActivities}</p>
                    <button
                      type="button"
                      onClick={() => setShowAddActivityModal(true)}
                      className="px-5 py-2.5 rounded-xl bg-brand-500 hover:bg-brand-600 text-white font-semibold text-xs"
                    >
                      {t.actions.logActivity}
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* TAB 5: PEST & DISEASE */}
            {activeTab === "pests" && (
              <div className="bg-black/45 backdrop-blur-xl rounded-3xl p-6 sm:p-8 border border-white/20 shadow-xl space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-white">Pest & Disease Scouting Log</h3>
                    <p className="text-xs text-neutral-300">Field scout observations with severity tags and AI-assisted triage labels.</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowReportPestModal(true)}
                    className="px-4 py-2 rounded-xl bg-rose-500 hover:bg-rose-600 text-white font-semibold text-xs flex items-center gap-2"
                  >
                    <Bug className="w-4 h-4" />
                    {t.actions.reportPest}
                  </button>
                </div>

                {dashboardData.pests.has_data ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {dashboardData.pests.recent.map((p: any) => (
                      <div key={p.id} className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-white text-sm">🐛 {p.pest_or_disease_name}</span>
                          <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${
                            p.severity === "Critical"
                              ? "bg-rose-500/20 text-rose-300 border-rose-400/40"
                              : "bg-amber-500/20 text-amber-300 border-amber-400/40"
                          }`}>
                            {p.severity}
                          </span>
                        </div>

                        <div className="text-xs text-neutral-300">
                          Date: <strong className="text-white">{p.observation_date}</strong> • Affected Area: <strong className="text-white">{p.affected_area_pct}%</strong>
                        </div>

                        {p.observation_notes && (
                          <p className="text-xs text-neutral-200 bg-black/30 p-2.5 rounded-xl border border-white/5">
                            {p.observation_notes}
                          </p>
                        )}

                        <div className="text-[11px] text-neutral-400 italic">
                          Assessment Type: <strong className="text-brand-300 not-italic">{p.assessment_label || "Field Scout Observation"}</strong>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-12 text-center bg-white/5 rounded-2xl border border-white/10 space-y-3">
                    <Bug className="w-10 h-10 text-neutral-400 mx-auto" />
                    <p className="text-sm text-neutral-300">{t.noPests}</p>
                    <button
                      type="button"
                      onClick={() => setShowReportPestModal(true)}
                      className="px-5 py-2.5 rounded-xl bg-rose-500 hover:bg-rose-600 text-white font-semibold text-xs"
                    >
                      {t.actions.reportPest}
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* TAB 6: FINANCIALS & PROFIT */}
            {activeTab === "financials" && (
              <div className="space-y-6">
                {/* Profit Result Banner */}
                <div className="bg-black/45 backdrop-blur-xl rounded-3xl p-6 sm:p-8 border border-white/20 shadow-xl space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-bold text-white">Farm Profitability & ROI Ledger</h3>
                      <p className="text-xs text-neutral-300">Computed strictly from real entered expenses and sales invoices.</p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => setShowAddExpenseModal(true)}
                        className="px-3.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-semibold"
                      >
                        {t.actions.addExpense}
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowAddSaleModal(true)}
                        className="px-3.5 py-1.5 rounded-xl bg-brand-500 hover:bg-brand-600 text-white text-xs font-semibold"
                      >
                        {t.actions.recordSale}
                      </button>
                    </div>
                  </div>

                  {dashboardData.financials.profit_summary.hasSufficientData ? (
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                      <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-center space-y-1">
                        <span className="text-xs text-neutral-400">Total Revenue (Sales)</span>
                        <div className="text-xl font-bold text-emerald-300">
                          ₹{dashboardData.financials.profit_summary.totalSalesRevenue.toLocaleString("en-IN")}
                        </div>
                      </div>
                      <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-center space-y-1">
                        <span className="text-xs text-neutral-400">Total Costs (Prod + Transit)</span>
                        <div className="text-xl font-bold text-amber-300">
                          ₹{dashboardData.financials.profit_summary.totalCost.toLocaleString("en-IN")}
                        </div>
                      </div>
                      <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-center space-y-1">
                        <span className="text-xs text-neutral-400">Net Realized Profit (ROI%)</span>
                        <div className="text-xl font-bold text-white">
                          ₹{dashboardData.financials.profit_summary.netProfit.toLocaleString("en-IN")}
                          <span className="text-xs text-brand-300 block font-medium">
                            ({dashboardData.financials.profit_summary.roiPercentage}% ROI)
                          </span>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="p-8 text-center bg-white/5 rounded-2xl border border-white/10 space-y-2">
                      <DollarSign className="w-8 h-8 text-neutral-400 mx-auto" />
                      <p className="text-xs text-neutral-300">{t.profitMissing}</p>
                    </div>
                  )}
                </div>

                {/* Expenses List */}
                <div className="bg-black/45 backdrop-blur-xl rounded-3xl p-6 sm:p-8 border border-white/20 shadow-xl space-y-4">
                  <h4 className="text-base font-bold text-white">Itemized Production Expenses</h4>
                  {dashboardData.financials.recent_expenses.length > 0 ? (
                    <div className="space-y-2">
                      {dashboardData.financials.recent_expenses.map((exp: any) => (
                        <div key={exp.id} className="p-3.5 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between text-xs">
                          <div>
                            <strong className="text-white block">{exp.category}</strong>
                            <span className="text-neutral-400">{exp.expense_date} {exp.description ? `• ${exp.description}` : ""}</span>
                          </div>
                          <div className="font-bold text-amber-300 text-sm">
                            ₹{exp.amount_inr.toLocaleString("en-IN")}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-neutral-400">{t.noExpenses}</p>
                  )}
                </div>
              </div>
            )}

            {/* TAB 7: WEATHER & MARKETS */}
            {activeTab === "weather_markets" && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Weather Telemetry */}
                <div className="bg-black/45 backdrop-blur-xl rounded-3xl p-6 sm:p-8 border border-white/20 shadow-xl space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                      <CloudRain className="w-5 h-5 text-sky-400" />
                      Hyperlocal Weather Station
                    </h3>
                    <Link
                      href="/weather"
                      className="text-xs font-semibold text-sky-300 hover:text-sky-200"
                    >
                      View Full Weather →
                    </Link>
                  </div>

                  {dashboardData.weather.available ? (
                    <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-3xl font-bold text-white">{dashboardData.weather.temperature_c}°C</div>
                          <span className="text-xs text-neutral-300">{dashboardData.weather.condition} ({dashboardData.weather.description})</span>
                        </div>
                        <div className="text-right text-xs text-neutral-300">
                          <div>Humidity: <strong className="text-white">{dashboardData.weather.humidity_pct}%</strong></div>
                          <div>Wind: <strong className="text-white">{dashboardData.weather.wind_speed_kmh} km/h</strong></div>
                        </div>
                      </div>
                      <p className="text-[11px] text-neutral-400 border-t border-white/10 pt-2">
                        Source: {dashboardData.weather.source} • Recorded: {new Date(dashboardData.weather.recorded_at).toLocaleTimeString()}
                      </p>
                    </div>
                  ) : (
                    <p className="text-xs text-neutral-400">{dashboardData.weather.message}</p>
                  )}
                </div>

                {/* Mandi Arbitrage Opportunities */}
                <div className="bg-black/45 backdrop-blur-xl rounded-3xl p-6 sm:p-8 border border-white/20 shadow-xl space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                      <Building2 className="w-5 h-5 text-brand-400" />
                      Nearby APMC Mandi Opportunities
                    </h3>
                    <Link
                      href="/market"
                      className="text-xs font-semibold text-brand-300 hover:text-brand-200"
                    >
                      Open Market Hub →
                    </Link>
                  </div>

                  {dashboardData.market_opportunities.length > 0 ? (
                    <div className="space-y-3">
                      {dashboardData.market_opportunities.map((m: any) => (
                        <div key={m.market_id} className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-white text-xs">🏪 {m.market}</span>
                            <span className="font-bold text-brand-300 text-xs">₹{m.modal_price}/qtl</span>
                          </div>
                          <div className="flex items-center justify-between text-[11px] text-neutral-400">
                            <span>Distance: {m.distance_km} km</span>
                            <span>Net Revenue: <strong className="text-white">₹{m.net_revenue?.toLocaleString("en-IN")}</strong></span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-neutral-400">No APMC mandi comparison available yet.</p>
                  )}
                </div>
              </div>
            )}

            {/* TAB 8: AI RECOMMENDATIONS */}
            {activeTab === "recommendations" && (
              <div className="bg-black/45 backdrop-blur-xl rounded-3xl p-6 sm:p-8 border border-white/20 shadow-xl space-y-6">
                <div>
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-brand-400" />
                    AI Agronomic Decision Support
                  </h3>
                  <p className="text-xs text-neutral-300">Recommendations generated strictly from your soil test, growth stage, weather, and mandi data.</p>
                </div>

                <div className="space-y-4">
                  {dashboardData.recommendations.map((rec: FarmRecommendation) => (
                    <div key={rec.id} className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="px-2.5 py-0.5 rounded-full bg-brand-500/20 text-brand-300 text-xs font-bold border border-brand-400/30">
                          {rec.category}
                        </span>
                        <span className="text-[11px] text-neutral-400">
                          Confidence: {(rec.confidenceScore * 100).toFixed(0)}%
                        </span>
                      </div>

                      <h4 className="font-bold text-white text-sm">{rec.title}</h4>
                      <p className="text-xs text-neutral-200 leading-relaxed">{rec.description}</p>

                      {rec.actionableSteps.length > 0 && (
                        <div className="p-3 bg-black/40 rounded-xl border border-white/10 space-y-1">
                          <span className="text-[11px] font-bold text-brand-300 block">Actionable Steps:</span>
                          <ul className="text-xs text-neutral-300 space-y-1 list-disc list-inside">
                            {rec.actionableSteps.map((step: string, idx: number) => (
                              <li key={idx}>{step}</li>
                            ))}
                          </ul>
                        </div>
                      )}

                      <div className="text-[11px] text-neutral-400">
                        Basis: <span className="text-neutral-300 italic">{rec.sourceBasis}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ============================================================ */}
        {/* MULTI-STEP ADD FARM WIZARD MODAL */}
        {/* ============================================================ */}
        {showAddFarmModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <div className="bg-neutral-900 border border-white/20 rounded-3xl p-6 sm:p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto space-y-6 shadow-2xl">
              
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div>
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <Tractor className="w-5 h-5 text-brand-400" />
                    Register New Farm Plot
                  </h3>
                  <p className="text-xs text-neutral-400">Step {wizardStep} of 5</p>
                </div>
                <button
                  type="button"
                  onClick={() => setShowAddFarmModal(false)}
                  className="text-neutral-400 hover:text-white p-1"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Progress Tracker */}
              <div className="grid grid-cols-5 gap-1.5 text-center text-[10px] font-medium">
                {["Details", "Location", "Soil", "Water", "Crop"].map((st, idx) => (
                  <div
                    key={st}
                    className={`py-1.5 rounded-lg transition-all ${
                      wizardStep === idx + 1
                        ? "bg-brand-500 text-white font-bold"
                        : wizardStep > idx + 1
                        ? "bg-brand-500/30 text-brand-200"
                        : "bg-white/5 text-neutral-500"
                    }`}
                  >
                    {st}
                  </div>
                ))}
              </div>

              <form onSubmit={handleSaveFarm} className="space-y-4">
                {/* STEP 1: BASIC DETAILS */}
                {wizardStep === 1 && (
                  <div className="space-y-4">
                    <div>
                      <label className="text-xs font-semibold text-neutral-300 block mb-1">
                        Farm Name <span className="text-rose-400">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Holur East Plot"
                        value={newFarmForm.farm_name}
                        onChange={(e) => setNewFarmForm({ ...newFarmForm, farm_name: e.target.value })}
                        className="w-full bg-black/40 border border-white/20 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-brand-400"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-semibold text-neutral-300 block mb-1">
                          Total Farm Area <span className="text-rose-400">*</span>
                        </label>
                        <input
                          type="number"
                          step="0.1"
                          min="0.1"
                          required
                          placeholder="e.g. 4.5"
                          value={newFarmForm.total_area}
                          onChange={(e) => setNewFarmForm({ ...newFarmForm, total_area: e.target.value })}
                          className="w-full bg-black/40 border border-white/20 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-brand-400"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-neutral-300 block mb-1">Unit</label>
                        <select
                          value={newFarmForm.area_unit}
                          onChange={(e) => setNewFarmForm({ ...newFarmForm, area_unit: e.target.value })}
                          className="w-full bg-black/40 border border-white/20 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-brand-400"
                        >
                          <option value="Acres" className="bg-neutral-900">Acres</option>
                          <option value="Hectares" className="bg-neutral-900">Hectares</option>
                          <option value="Guntas" className="bg-neutral-900">Guntas</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-semibold text-neutral-300 block mb-1">Ownership Type</label>
                        <select
                          value={newFarmForm.ownership_type}
                          onChange={(e) => setNewFarmForm({ ...newFarmForm, ownership_type: e.target.value })}
                          className="w-full bg-black/40 border border-white/20 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-brand-400"
                        >
                          <option value="Owned" className="bg-neutral-900">Owned Land</option>
                          <option value="Leased" className="bg-neutral-900">Leased Land</option>
                          <option value="Shared / Joint" className="bg-neutral-900">Shared / Joint</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-neutral-300 block mb-1">District</label>
                        <select
                          value={newFarmForm.district}
                          onChange={(e) => setNewFarmForm({ ...newFarmForm, district: e.target.value, taluk: e.target.value })}
                          className="w-full bg-black/40 border border-white/20 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-brand-400"
                        >
                          {KARNATAKA_DISTRICTS.map((d) => (
                            <option key={d} value={d} className="bg-neutral-900">{d}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>
                )}

                {/* STEP 2: LOCATION */}
                {wizardStep === 2 && (
                  <div className="space-y-4">
                    <div className="p-4 bg-white/5 rounded-2xl border border-white/10 text-center space-y-3">
                      <MapPin className="w-8 h-8 text-brand-400 mx-auto" />
                      <div>
                        <h4 className="font-bold text-white text-sm">Acquire Farm GPS Coordinates</h4>
                        <p className="text-xs text-neutral-400">Required for hyperlocal IMD weather and nearest APMC distance calculation.</p>
                      </div>
                      <button
                        type="button"
                        onClick={handleAcquireGps}
                        disabled={gpsLoading}
                        className="px-6 py-2.5 rounded-xl bg-brand-500 hover:bg-brand-600 text-white font-semibold text-xs flex items-center gap-2 mx-auto disabled:opacity-50"
                      >
                        <Navigation className="w-4 h-4" />
                        {gpsLoading ? t.wizard.acquiringGps : t.wizard.useGps}
                      </button>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-semibold text-neutral-300 block mb-1">Latitude</label>
                        <input
                          type="number"
                          step="0.0001"
                          value={newFarmForm.latitude}
                          onChange={(e) => setNewFarmForm({ ...newFarmForm, latitude: parseFloat(e.target.value) || 0 })}
                          className="w-full bg-black/40 border border-white/20 rounded-xl px-4 py-2 text-sm text-white"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-neutral-300 block mb-1">Longitude</label>
                        <input
                          type="number"
                          step="0.0001"
                          value={newFarmForm.longitude}
                          onChange={(e) => setNewFarmForm({ ...newFarmForm, longitude: parseFloat(e.target.value) || 0 })}
                          className="w-full bg-black/40 border border-white/20 rounded-xl px-4 py-2 text-sm text-white"
                        />
                      </div>
                    </div>
                    <p className="text-[11px] text-neutral-400 italic">
                      🔒 Privacy Notice: Coordinates are stored securely under Supabase RLS and are never exposed publicly.
                    </p>
                  </div>
                )}

                {/* STEP 3: SOIL INFORMATION */}
                {wizardStep === 3 && (
                  <div className="space-y-4">
                    <div>
                      <label className="text-xs font-semibold text-neutral-300 block mb-1">Soil Classification</label>
                      <select
                        value={newFarmForm.soil_type}
                        onChange={(e) => setNewFarmForm({ ...newFarmForm, soil_type: e.target.value })}
                        className="w-full bg-black/40 border border-white/20 rounded-xl px-4 py-2.5 text-sm text-white"
                      >
                        <option value="Red Sandy Loam" className="bg-neutral-900">Red Sandy Loam</option>
                        <option value="Black Cotton Soil" className="bg-neutral-900">Black Cotton Soil (Vertisol)</option>
                        <option value="Clay Loam" className="bg-neutral-900">Clay Loam</option>
                        <option value="Alluvial Soil" className="bg-neutral-900">Alluvial Soil</option>
                        <option value="Laterite Soil" className="bg-neutral-900">Laterite Soil</option>
                      </select>
                    </div>

                    <div className="grid grid-cols-3 gap-3">
                      <div>
                        <label className="text-[11px] font-semibold text-neutral-300 block mb-1">pH Level</label>
                        <input
                          type="number"
                          step="0.1"
                          placeholder="e.g. 6.8"
                          value={newFarmForm.ph}
                          onChange={(e) => setNewFarmForm({ ...newFarmForm, ph: e.target.value })}
                          className="w-full bg-black/40 border border-white/20 rounded-xl px-3 py-2 text-xs text-white"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] font-semibold text-neutral-300 block mb-1">Nitrogen (kg/ha)</label>
                        <input
                          type="number"
                          placeholder="e.g. 210"
                          value={newFarmForm.nitrogen}
                          onChange={(e) => setNewFarmForm({ ...newFarmForm, nitrogen: e.target.value })}
                          className="w-full bg-black/40 border border-white/20 rounded-xl px-3 py-2 text-xs text-white"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] font-semibold text-neutral-300 block mb-1">Phosphorus</label>
                        <input
                          type="number"
                          placeholder="e.g. 18"
                          value={newFarmForm.phosphorus}
                          onChange={(e) => setNewFarmForm({ ...newFarmForm, phosphorus: e.target.value })}
                          className="w-full bg-black/40 border border-white/20 rounded-xl px-3 py-2 text-xs text-white"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* STEP 4: WATER & IRRIGATION */}
                {wizardStep === 4 && (
                  <div className="space-y-4">
                    <div>
                      <label className="text-xs font-semibold text-neutral-300 block mb-1">Primary Water Source</label>
                      <select
                        value={newFarmForm.water_source}
                        onChange={(e) => setNewFarmForm({ ...newFarmForm, water_source: e.target.value })}
                        className="w-full bg-black/40 border border-white/20 rounded-xl px-4 py-2.5 text-sm text-white"
                      >
                        <option value="Borewell" className="bg-neutral-900">Borewell</option>
                        <option value="Open Well" className="bg-neutral-900">Open Well</option>
                        <option value="Canal Irrigation" className="bg-neutral-900">Canal Irrigation</option>
                        <option value="Rainfed" className="bg-neutral-900">Rainfed / Monsoon</option>
                        <option value="Farm Pond" className="bg-neutral-900">Farm Pond (Krishi Bhagya)</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-neutral-300 block mb-1">Irrigation Method</label>
                      <select
                        value={newFarmForm.irrigation_method}
                        onChange={(e) => setNewFarmForm({ ...newFarmForm, irrigation_method: e.target.value })}
                        className="w-full bg-black/40 border border-white/20 rounded-xl px-4 py-2.5 text-sm text-white"
                      >
                        <option value="Drip Irrigation" className="bg-neutral-900">Drip Irrigation</option>
                        <option value="Sprinkler" className="bg-neutral-900">Sprinkler</option>
                        <option value="Flood / Furrow" className="bg-neutral-900">Flood / Furrow</option>
                        <option value="Rainfed / No Irrigation" className="bg-neutral-900">Rainfed / No Irrigation</option>
                      </select>
                    </div>
                  </div>
                )}

                {/* STEP 5: CURRENT CROP */}
                {wizardStep === 5 && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-semibold text-neutral-300 block mb-1">Crop Name</label>
                        <input
                          type="text"
                          placeholder="e.g. Onion"
                          value={newFarmForm.crop_name}
                          onChange={(e) => setNewFarmForm({ ...newFarmForm, crop_name: e.target.value })}
                          className="w-full bg-black/40 border border-white/20 rounded-xl px-4 py-2 text-sm text-white"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-neutral-300 block mb-1">Variety</label>
                        <input
                          type="text"
                          placeholder="e.g. Red Bellary"
                          value={newFarmForm.variety}
                          onChange={(e) => setNewFarmForm({ ...newFarmForm, variety: e.target.value })}
                          className="w-full bg-black/40 border border-white/20 rounded-xl px-4 py-2 text-sm text-white"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-semibold text-neutral-300 block mb-1">Sowing Date</label>
                        <input
                          type="date"
                          value={newFarmForm.sowing_date}
                          onChange={(e) => setNewFarmForm({ ...newFarmForm, sowing_date: e.target.value })}
                          className="w-full bg-black/40 border border-white/20 rounded-xl px-4 py-2 text-sm text-white"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-neutral-300 block mb-1">Current Growth Stage</label>
                        <select
                          value={newFarmForm.current_stage}
                          onChange={(e) => setNewFarmForm({ ...newFarmForm, current_stage: e.target.value })}
                          className="w-full bg-black/40 border border-white/20 rounded-xl px-4 py-2 text-sm text-white"
                        >
                          <option value="Sowing / Seedling" className="bg-neutral-900">Sowing / Seedling</option>
                          <option value="Vegetative" className="bg-neutral-900">Vegetative (Active Growth)</option>
                          <option value="Flowering" className="bg-neutral-900">Flowering</option>
                          <option value="Fruiting / Grain Filling" className="bg-neutral-900">Fruiting / Grain Filling</option>
                          <option value="Maturity / Ready to Harvest" className="bg-neutral-900">Maturity / Ready to Harvest</option>
                        </select>
                      </div>
                    </div>
                  </div>
                )}

                {/* Modal Actions */}
                <div className="flex items-center justify-between pt-4 border-t border-white/10">
                  {wizardStep > 1 ? (
                    <button
                      type="button"
                      onClick={() => setWizardStep(wizardStep - 1)}
                      className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-semibold text-white"
                    >
                      {t.wizard.back}
                    </button>
                  ) : <div />}

                  {wizardStep < 5 ? (
                    <button
                      type="button"
                      onClick={() => setWizardStep(wizardStep + 1)}
                      className="px-5 py-2 rounded-xl bg-brand-500 hover:bg-brand-600 text-white text-xs font-semibold"
                    >
                      {t.wizard.next}
                    </button>
                  ) : (
                    <button
                      type="submit"
                      className="px-6 py-2.5 rounded-xl bg-brand-500 hover:bg-brand-600 text-white font-bold text-xs shadow-lg hover:shadow-brand-500/30"
                    >
                      {t.wizard.saveFarm}
                    </button>
                  )}
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
