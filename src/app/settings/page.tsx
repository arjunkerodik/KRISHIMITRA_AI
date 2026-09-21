"use client";

import React, { useState } from "react";
import { FarmerSidebar } from "@/components/FarmerSidebar";
import { useApp } from "@/lib/store";
import { Language } from "@/lib/i18n";
import {
  Settings,
  User,
  Globe,
  Sun,
  Moon,
  Download,
  ShieldCheck,
  CheckCircle2,
  Bell,
  Tractor,
  MapPin,
  FileSpreadsheet,
} from "lucide-react";

export default function SettingsPage() {
  const {
    user,
    language,
    setLanguage,
    isDarkMode,
    toggleDarkMode,
    activeFarm,
    showToast,
  } = useApp();

  const [downloadSuccess, setDownloadSuccess] = useState<string | null>(null);

  const [notificationsEnabled, setNotificationsEnabled] = useState({
    sms: true,
    whatsapp: true,
    weatherAlerts: true,
    priceAlerts: true,
  });

  const handleExportCSV = () => {
    const csvContent = `data:text/csv;charset=utf-8,Farm,Farmer,Village,District,Crop,AreaAcres,SoilType,NitrogenKgHa,PhosphorusKgHa,PotassiumKgHa,PH\n${activeFarm.name},${user.name},${activeFarm.village},${activeFarm.district},${activeFarm.currentCrop},${activeFarm.areaAcres},${activeFarm.soilType},195,42,285,6.8`;
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `agricare_farm_data_${activeFarm.id}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setDownloadSuccess("Farm ledger & soil parameters exported as CSV!");
    setTimeout(() => setDownloadSuccess(null), 3000);
  };

  return (
    <div className="min-h-screen flex bg-transparent">
      <div className="hidden lg:block w-64 shrink-0">
        <div className="fixed top-16 bottom-0 w-64">
          <FarmerSidebar />
        </div>
      </div>

      <div className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="bg-black/50 backdrop-blur-xl rounded-3xl border border-white/20 p-6 shadow-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-white">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                Verified Digital Farmer Profile
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-1">
              Profile & Account Settings
            </h1>
          </div>

          <button
            onClick={handleExportCSV}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold shadow-md transition-all border border-white/15 cursor-pointer"
          >
            <Download className="w-4 h-4 text-emerald-400" />
            <span>Export Farm Data</span>
          </button>
        </div>

        {downloadSuccess && (
          <div className="p-3.5 rounded-2xl bg-emerald-950/50 border border-emerald-500/40 text-xs text-emerald-300 font-semibold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>{downloadSuccess}</span>
          </div>
        )}

        {/* 1. PERSONAL INFORMATION & KYC */}
        <div className="bg-black/50 backdrop-blur-xl rounded-3xl border border-white/20 p-6 shadow-2xl space-y-4 text-white">
          <div className="flex items-center gap-2 pb-3 border-b border-white/10">
            <User className="w-5 h-5 text-emerald-400" />
            <h2 className="text-base font-bold text-white">
              Personal Information & KYC
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div className="p-3.5 rounded-2xl bg-black/40 border border-white/10">
              <span className="block text-white/50 font-medium mb-0.5">Farmer Full Name</span>
              <span className="font-bold text-white text-sm">{user.name}</span>
            </div>

            <div className="p-3.5 rounded-2xl bg-black/40 border border-white/10">
              <span className="block text-white/50 font-medium mb-0.5">Farmer ID / PM-KISAN</span>
              <span className="font-mono font-bold text-white text-sm">{(user as any)?.pmkisanId || "KA-PMK-8849201"}</span>
            </div>

            <div className="p-3.5 rounded-2xl bg-black/40 border border-white/10">
              <span className="block text-white/50 font-medium mb-0.5">Registered Mobile</span>
              <span className="font-mono font-semibold text-white text-sm">{user.phone || "+91 98450 12345"}</span>
            </div>
          </div>
        </div>

        {/* 2. FARM INFORMATION */}
        <div className="bg-black/50 backdrop-blur-xl rounded-3xl border border-white/20 p-6 shadow-2xl space-y-4 text-white">
          <div className="flex items-center gap-2 pb-3 border-b border-white/10">
            <Tractor className="w-5 h-5 text-emerald-400" />
            <h2 className="text-base font-bold text-white">
              Farm Information & Landholding
            </h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
            <div className="p-3.5 rounded-2xl bg-black/40 border border-white/10">
              <span className="block text-white/50 font-medium mb-0.5">Farm Plot Name</span>
              <span className="font-bold text-white">{activeFarm.name}</span>
            </div>

            <div className="p-3.5 rounded-2xl bg-black/40 border border-white/10">
              <span className="block text-white/50 font-medium mb-0.5">Total Area</span>
              <span className="font-bold text-white">{activeFarm.areaAcres} Acres</span>
            </div>

            <div className="p-3.5 rounded-2xl bg-black/40 border border-white/10">
              <span className="block text-white/50 font-medium mb-0.5">Standing Crop</span>
              <span className="font-bold text-emerald-400">{activeFarm.currentCrop}</span>
            </div>

            <div className="p-3.5 rounded-2xl bg-black/40 border border-white/10">
              <span className="block text-white/50 font-medium mb-0.5">Soil Type</span>
              <span className="font-bold text-white">{activeFarm.soilType}</span>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-black/40 border border-white/10 text-xs flex items-center gap-2">
            <MapPin className="w-4 h-4 text-emerald-400 shrink-0" />
            <span className="text-white/80">
              Location: <strong className="text-white">{activeFarm.village}</strong>, {(activeFarm as any).taluk || activeFarm.district}, {activeFarm.district}, Karnataka
            </span>
          </div>
        </div>

        {/* 3. NOTIFICATION SETTINGS */}
        <div className="bg-black/50 backdrop-blur-xl rounded-3xl border border-white/20 p-6 shadow-2xl space-y-4 text-white">
          <div className="flex items-center gap-2 pb-3 border-b border-white/10">
            <Bell className="w-5 h-5 text-emerald-400" />
            <h2 className="text-base font-bold text-white">
              Notification & Alert Channels
            </h2>
          </div>

          <div className="space-y-3 text-xs">
            <label className="flex items-center justify-between p-3.5 rounded-2xl bg-black/40 border border-white/10 cursor-pointer hover:border-emerald-500/30 transition-all">
              <div>
                <span className="font-bold text-white block">IMD Weather & Rain Warning Alerts</span>
                <span className="text-white/50 text-[11px]">Instant alert when rainfall above 15mm is forecast within 4 hours</span>
              </div>
              <input
                type="checkbox"
                checked={notificationsEnabled.weatherAlerts}
                onChange={(e) => setNotificationsEnabled({ ...notificationsEnabled, weatherAlerts: e.target.checked })}
                className="w-4 h-4 accent-emerald-500 rounded"
              />
            </label>

            <label className="flex items-center justify-between p-3.5 rounded-2xl bg-black/40 border border-white/10 cursor-pointer hover:border-emerald-500/30 transition-all">
              <div>
                <span className="font-bold text-white block">APMC Mandi Price Surge Alerts</span>
                <span className="text-white/50 text-[11px]">Notify when regional tomato wholesale prices rise by &gt; 5%</span>
              </div>
              <input
                type="checkbox"
                checked={notificationsEnabled.priceAlerts}
                onChange={(e) => setNotificationsEnabled({ ...notificationsEnabled, priceAlerts: e.target.checked })}
                className="w-4 h-4 accent-emerald-500 rounded"
              />
            </label>

            <label className="flex items-center justify-between p-3.5 rounded-2xl bg-black/40 border border-white/10 cursor-pointer hover:border-emerald-500/30 transition-all">
              <div>
                <span className="font-bold text-white block">WhatsApp Daily Advisory Digest</span>
                <span className="text-white/50 text-[11px]">Receive prioritized 3-point action plan at 6:30 AM every morning</span>
              </div>
              <input
                type="checkbox"
                checked={notificationsEnabled.whatsapp}
                onChange={(e) => setNotificationsEnabled({ ...notificationsEnabled, whatsapp: e.target.checked })}
                className="w-4 h-4 accent-emerald-500 rounded"
              />
            </label>
          </div>
        </div>

        {/* 4. LANGUAGE & PREFERENCES */}
        <div className="bg-black/50 backdrop-blur-xl rounded-3xl border border-white/20 p-6 shadow-2xl space-y-4 text-white">
          <div className="flex items-center gap-2 pb-3 border-b border-white/10">
            <Globe className="w-5 h-5 text-emerald-400" />
            <h2 className="text-base font-bold text-white">
              Language & Accessibility Settings
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block text-emerald-400 font-semibold mb-1.5 uppercase tracking-wider text-[11px]">
                Preferred Language
              </label>
              <div className="flex gap-2">
                {[
                  { code: "en", label: "English" },
                  { code: "hi", label: "हिन्दी (Hindi)" },
                  { code: "kn", label: "ಕನ್ನಡ (Kannada)" },
                ].map((l) => (
                  <button
                    key={l.code}
                    onClick={() => setLanguage(l.code as Language)}
                    className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                      language === l.code
                        ? "bg-emerald-600 text-white shadow-lg border border-emerald-400/40"
                        : "bg-black/40 text-white/70 hover:bg-black/60 hover:text-white border border-white/10"
                    }`}
                  >
                    {l.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-emerald-400 font-semibold mb-1.5 uppercase tracking-wider text-[11px]">
                Theme Appearance
              </label>
              <button
                onClick={toggleDarkMode}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold transition-all cursor-pointer border border-white/15"
              >
                {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-white/80" />}
                <span>{isDarkMode ? "Dark Theme Active" : "Light Theme Active"}</span>
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
