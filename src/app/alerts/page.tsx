"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { FarmerSidebar } from "@/components/FarmerSidebar";
import { useApp } from "@/lib/store";
import {
  Bell,
  AlertTriangle,
  CloudRain,
  Droplets,
  Wind,
  Sun,
  Thermometer,
  Shield,
  CheckCircle2,
  Calendar,
  Filter,
  MapPin,
  Sparkles,
  ArrowRight,
  ShieldAlert,
  Clock,
  PhoneCall,
  Share2,
  ChevronRight,
  Info,
  Layers,
  Settings,
  RefreshCw,
  Sliders,
  CheckCheck,
  Check,
  Radio,
  XCircle,
} from "lucide-react";
import {
  AppNotification,
  WeatherAlert,
  NotificationPreference,
  AlertCategory,
  AlertSeverity,
} from "@/lib/types/weather";

export default function AlertsPage() {
  const { activeFarm, showToast, language } = useApp();
  const isKn = language === "kn";

  const [loading, setLoading] = useState(true);
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [alerts, setAlerts] = useState<WeatherAlert[]>([]);
  const [preferences, setPreferences] = useState<NotificationPreference | null>(null);

  // Tabs: all, unread, weather, farm, irrigation, warnings, history, preferences
  const [activeTab, setActiveTab] = useState<
    "all" | "unread" | "weather" | "irrigation" | "warnings" | "history" | "preferences"
  >("all");

  // History Filter
  const [historySeverityFilter, setHistorySeverityFilter] = useState<string>("ALL");
  const [historyCategoryFilter, setHistoryCategoryFilter] = useState<string>("ALL");

  // Load Alerts & Notifications from API
  const loadAlertsData = useCallback(async () => {
    setLoading(true);
    try {
      // 1. Fetch live evaluated alerts
      const alertsRes = await fetch(`/api/weather/alerts?farm_id=${activeFarm.id}&lat=${activeFarm.latitude}&lng=${activeFarm.longitude}`);
      const alertsJson = await alertsRes.json();
      if (alertsJson.success && Array.isArray(alertsJson.data)) {
        setAlerts(alertsJson.data);
      }

      // 2. Fetch Notifications
      const notifRes = await fetch(`/api/notifications?userId=demo_farmer_01`);
      const notifJson = await notifRes.json();
      if (notifJson.success && Array.isArray(notifJson.data)) {
        setNotifications(notifJson.data);
      }

      // 3. Fetch Preferences
      const prefRes = await fetch(`/api/notifications/preferences?userId=demo_farmer_01`);
      const prefJson = await prefRes.json();
      if (prefJson.success && prefJson.data) {
        setPreferences(prefJson.data);
      }
    } catch (err: any) {
      console.error("Failed to load alerts feed:", err);
    } finally {
      setLoading(false);
    }
  }, [activeFarm.id, activeFarm.latitude, activeFarm.longitude]);

  useEffect(() => {
    loadAlertsData();
  }, [loadAlertsData]);

  // Mark single notification as read
  const handleMarkRead = async (id: string) => {
    try {
      await fetch(`/api/notifications/${id}/read?userId=demo_farmer_01`, { method: "PATCH" });
      setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, is_read: true } : n)));
    } catch {
      showToast("Error", "Could not mark notification as read.", "alert");
    }
  };

  // Mark all as read
  const handleMarkAllRead = async () => {
    try {
      const res = await fetch(`/api/notifications/read-all`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: "demo_farmer_01" }),
      });
      const json = await res.json();
      if (json.success) {
        setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
        showToast(
          isKn ? "ಎಲ್ಲವನ್ನೂ ಓದಲಾಗಿದೆ" : "All Marked as Read",
          isKn ? "ಎಲ್ಲಾ ಎಚ್ಚರಿಕೆಗಳನ್ನು ಓದಲಾಗಿದೆ ಎಂದು ಗುರುತಿಸಲಾಗಿದೆ." : "All notifications marked as read.",
          "success"
        );
      }
    } catch {
      showToast("Error", "Failed to mark all as read.", "alert");
    }
  };

  // Save Preferences
  const handleSavePreferences = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!preferences) return;

    try {
      const res = await fetch(`/api/notifications/preferences`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: "demo_farmer_01", preferences }),
      });
      const json = await res.json();
      if (json.success) {
        showToast(
          isKn ? "ಆದ್ಯತೆಗಳನ್ನು ಉಳಿಸಲಾಗಿದೆ" : "Preferences Saved",
          isKn ? "ನಿಮ್ಮ ಅಧಿಸೂಚನೆ ಆದ್ಯತೆಗಳನ್ನು ಅಪ್‌ಡೇಟ್ ಮಾಡಲಾಗಿದೆ." : "Your alert preferences have been updated.",
          "success"
        );
      }
    } catch {
      showToast("Error", "Failed to save preferences.", "alert");
    }
  };

  // Filtered Notifications based on active tab
  const filteredNotifications = notifications.filter((n) => {
    if (activeTab === "unread") return !n.is_read;
    if (activeTab === "weather") return n.type === "WEATHER_ALERT" || n.type === "RAIN_ALERT" || n.type === "HEAT_ALERT" || n.type === "WIND_ALERT";
    if (activeTab === "irrigation") return n.type === "IRRIGATION_ALERT";
    if (activeTab === "warnings") return n.type === "OFFICIAL_WARNING";
    return true; // "all"
  });

  const unreadCount = notifications.filter((n) => !n.is_read).length;

  return (
    <div className="min-h-screen flex bg-transparent">
      {/* Sidebar */}
      <div className="hidden lg:block w-64 shrink-0">
        <div className="fixed top-16 bottom-0 w-64">
          <FarmerSidebar />
        </div>
      </div>

      <div className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto text-white">
        
        {/* Header */}
        <div className="p-6 rounded-3xl bg-black/45 backdrop-blur-xl border border-white/20 shadow-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/80 border border-amber-400/50 text-white flex items-center justify-center shadow-lg">
              <Bell className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-display font-bold text-2xl text-white tracking-tight">
                  {isKn ? "ಸ್ಮಾರ್ಟ್ ಹವಾಮಾನ ಮತ್ತು ಕೃಷಿ ಎಚ್ಚರಿಕೆಗಳು" : "Smart Weather & Farm Alerts Center"}
                </h1>
                {unreadCount > 0 ? (
                  <span className="px-2.5 py-0.5 rounded-full bg-red-950/80 border border-red-400/40 text-red-300 text-xs font-bold">
                    {unreadCount} {isKn ? "ಹೊಸತು" : "Unread"}
                  </span>
                ) : (
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-950/80 border border-emerald-400/40 text-emerald-300 text-[11px] font-bold">
                    {isKn ? "ಎಲ್ಲವನ್ನೂ ಓದಲಾಗಿದೆ" : "All Caught Up"}
                  </span>
                )}
              </div>
              <p className="text-xs sm:text-sm text-neutral-200">
                📍 {activeFarm.name} ({activeFarm.village}, {activeFarm.district}) • {activeFarm.currentCrop} ({activeFarm.cropStage || "Flowering"})
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllRead}
                className="px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 text-xs font-bold text-white transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <CheckCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>{isKn ? "ಎಲ್ಲವನ್ನೂ ಓದಿದೆ ಎಂದು ಗುರುತಿಸಿ" : "Mark All Read"}</span>
              </button>
            )}

            <button
              onClick={loadAlertsData}
              disabled={loading}
              className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 text-white transition-all cursor-pointer"
              title="Refresh"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin text-amber-400" : ""}`} />
            </button>

            <Link
              href="/weather"
              className="px-4 py-2 rounded-xl bg-sky-600/80 hover:bg-sky-500 border border-sky-400/50 text-white text-xs font-bold transition-all flex items-center gap-1.5 shadow-md"
            >
              <CloudRain className="w-3.5 h-3.5" />
              <span>{isKn ? "ಹವಾಮಾನ ಡ್ಯಾಶ್‌ಬೋರ್ಡ್" : "Weather Dashboard"}</span>
            </Link>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 border-b border-white/15">
          {[
            { id: "all", label: isKn ? `ಎಲ್ಲಾ (${notifications.length})` : `All Alerts (${notifications.length})`, icon: Bell },
            { id: "unread", label: isKn ? `ಓದದಿರುವವು (${unreadCount})` : `Unread (${unreadCount})`, icon: AlertTriangle },
            { id: "weather", label: isKn ? "ಹವಾಮಾನ ಎಚ್ಚರಿಕೆಗಳು" : "Weather Hazards", icon: CloudRain },
            { id: "irrigation", label: isKn ? "ನೀರಾವರಿ ಸಲಹೆಗಳು" : "Irrigation Advisories", icon: Droplets },
            { id: "warnings", label: isKn ? "ಅಧಿಕೃತ ಸೂಚನೆಗಳು" : "Official Warnings", icon: Radio },
            { id: "history", label: isKn ? "ಎಚ್ಚರಿಕೆ ಇತಿಹಾಸ" : "Alert History", icon: Clock },
            { id: "preferences", label: isKn ? "ಆದ್ಯತೆಗಳು & ಸೆಟ್ಟಿಂಗ್ಸ್" : "Preferences", icon: Settings },
          ].map((tab) => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                  active
                    ? "bg-amber-600 text-white shadow-lg border border-amber-400/50"
                    : "bg-black/30 hover:bg-white/10 text-neutral-300 border border-white/10"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* TAB: NOTIFICATIONS FEED (ALL, UNREAD, WEATHER, IRRIGATION, WARNINGS) */}
        {activeTab !== "history" && activeTab !== "preferences" && (
          <div className="space-y-4">
            {loading && notifications.length === 0 ? (
              <div className="p-16 rounded-3xl bg-black/45 backdrop-blur-xl border border-white/20 text-center space-y-3">
                <RefreshCw className="w-8 h-8 text-amber-400 animate-spin mx-auto" />
                <p className="text-sm font-semibold text-neutral-300">
                  {isKn ? "ಎಚ್ಚರಿಕೆಗಳನ್ನು ಲೋಡ್ ಮಾಡಲಾಗುತ್ತಿದೆ..." : "Loading smart farm alert feed..."}
                </p>
              </div>
            ) : filteredNotifications.length === 0 ? (
              <div className="p-16 rounded-3xl bg-black/45 backdrop-blur-xl border border-white/20 text-center space-y-3">
                <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
                <h3 className="font-bold text-base text-white">
                  {isKn ? "ನಿಮ್ಮ ಜಮೀನಿಗೆ ಯಾವುದೇ ಸಕ್ರಿಯ ಎಚ್ಚರಿಕೆಗಳಿಲ್ಲ" : "No Active Alerts for Your Farm"}
                </h3>
                <p className="text-xs text-neutral-400 max-w-md mx-auto">
                  {isKn
                    ? "ಹವಾಮಾನ ಸ್ಥಿತಿಯು ಸುರಕ್ಷಿತ ಮಿತಿಯಲ್ಲಿದೆ. ಹೊಸ ಹವಾಮಾನ ಬದಲಾವಣೆಗಳು ಅಥವಾ ಮಳೆ ನಿರೀಕ್ಷೆಯಿದ್ದರೆ ಇಲ್ಲಿ ಎಚ್ಚರಿಕೆ ಪ್ರಕಟವಾಗುತ್ತದೆ."
                    : "Observed weather conditions are within safe agronomic parameters. Hyperlocal alerts will trigger automatically if extreme conditions are forecast."}
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredNotifications.map((notif) => (
                  <div
                    key={notif.id}
                    className={`p-5 rounded-3xl backdrop-blur-xl border transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                      !notif.is_read
                        ? "bg-black/60 border-amber-500/50 shadow-2xl"
                        : "bg-black/35 border-white/15 opacity-85"
                    }`}
                  >
                    <div className="flex items-start gap-3.5">
                      <div
                        className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 border mt-0.5 ${
                          notif.severity === "SEVERE"
                            ? "bg-red-950/80 text-red-300 border-red-500/50"
                            : notif.severity === "WARNING"
                            ? "bg-amber-950/80 text-amber-300 border-amber-500/50"
                            : notif.severity === "ADVISORY"
                            ? "bg-sky-950/80 text-sky-300 border-sky-500/50"
                            : "bg-emerald-950/80 text-emerald-300 border-emerald-500/50"
                        }`}
                      >
                        {notif.type === "RAIN_ALERT" ? (
                          <CloudRain className="w-5 h-5" />
                        ) : notif.type === "WIND_ALERT" ? (
                          <Wind className="w-5 h-5" />
                        ) : notif.type === "HEAT_ALERT" ? (
                          <Sun className="w-5 h-5" />
                        ) : notif.type === "IRRIGATION_ALERT" ? (
                          <Droplets className="w-5 h-5" />
                        ) : (
                          <AlertTriangle className="w-5 h-5" />
                        )}
                      </div>

                      <div className="space-y-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <h4 className="font-bold text-sm text-white">
                            {isKn ? (notif.title_kn || notif.title) : notif.title}
                          </h4>
                          <span
                            className={`text-[10px] font-extrabold px-2 py-0.2 rounded-full border ${
                              notif.severity === "SEVERE"
                                ? "bg-red-900/60 text-red-200 border-red-400"
                                : notif.severity === "WARNING"
                                ? "bg-amber-900/60 text-amber-200 border-amber-400"
                                : "bg-sky-900/60 text-sky-200 border-sky-400"
                            }`}
                          >
                            {notif.severity}
                          </span>
                          {!notif.is_read && (
                            <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
                          )}
                        </div>

                        <p className="text-xs text-neutral-300 leading-relaxed">
                          {isKn ? (notif.message_kn || notif.message) : notif.message}
                        </p>

                        <div className="flex items-center gap-3 pt-1 text-[11px] text-neutral-400">
                          <span>
                            {new Date(notif.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                          </span>
                          <span>•</span>
                          <span>{notif.type.replace(/_/g, " ")}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0 pt-2 md:pt-0">
                      {!notif.is_read && (
                        <button
                          onClick={() => handleMarkRead(notif.id)}
                          className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-neutral-300 hover:text-white text-xs font-semibold transition-all border border-white/10 cursor-pointer"
                        >
                          {isKn ? "ಓದಿದೆ" : "Mark Read"}
                        </button>
                      )}

                      {notif.action_href && (
                        <Link
                          href={notif.action_href}
                          className="px-3.5 py-1.5 rounded-xl bg-brand-600 hover:bg-brand-500 border border-brand-400/40 text-white text-xs font-bold transition-all flex items-center gap-1 shadow-md"
                        >
                          <span>{isKn ? "ಕ್ರಿಯೆ" : "View"}</span>
                          <ArrowRight className="w-3 h-3" />
                        </Link>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB: ALERT HISTORY */}
        {activeTab === "history" && (
          <div className="p-6 rounded-3xl bg-black/45 backdrop-blur-xl border border-white/20 shadow-2xl space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-white/15">
              <div>
                <h3 className="font-display font-bold text-base text-white flex items-center gap-2">
                  <Clock className="w-4 h-4 text-amber-400" />
                  {isKn ? "ಕೃಷಿ ಹವಾಮಾನ ಎಚ್ಚರಿಕೆಗಳ ಇತಿಹಾಸ" : "Historical Weather & Decision Alert Logs"}
                </h3>
                <p className="text-xs text-neutral-300">
                  {isKn ? "ಹಿಂದಿನ ಎಲ್ಲಾ ಹವಾಮಾನ ಘಟನೆಗಳು ಮತ್ತು ಕೃಷಿ ಸಲಹೆಗಳ ದಾಖಲೆ." : "Searchable compliance record of previous weather advisories and risk alerts."}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <select
                  value={historySeverityFilter}
                  onChange={(e) => setHistorySeverityFilter(e.target.value)}
                  className="px-3 py-1.5 rounded-xl bg-black/50 border border-white/20 text-white text-xs font-semibold focus:outline-none"
                >
                  <option value="ALL">All Severities</option>
                  <option value="SEVERE">Severe Only</option>
                  <option value="WARNING">Warning Only</option>
                  <option value="ADVISORY">Advisory Only</option>
                  <option value="INFO">Info Only</option>
                </select>
              </div>
            </div>

            {alerts.length === 0 ? (
              <div className="p-12 text-center text-xs text-neutral-400">
                {isKn ? "ಯಾವುದೇ ಹಿಂದಿನ ಎಚ್ಚರಿಕೆಗಳ ದಾಖಲೆ ಇಲ್ಲ." : "No historical alert records recorded."}
              </div>
            ) : (
              <div className="space-y-3">
                {alerts.map((al) => (
                  <div
                    key={al.id}
                    className="p-4 rounded-2xl bg-black/40 border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-white">{isKn ? (al.title_kn || al.title) : al.title}</span>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/10 text-neutral-300">
                          {al.category}
                        </span>
                      </div>
                      <p className="text-neutral-300">{isKn ? (al.message_kn || al.message) : al.message}</p>
                    </div>

                    <div className="text-right shrink-0 text-neutral-400 space-y-0.5">
                      <div>Issued: {new Date(al.issued_at).toLocaleDateString()}</div>
                      <span className="text-[10px] px-2 py-0.2 rounded bg-emerald-950/80 text-emerald-300 border border-emerald-500/40">
                        {al.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB: PREFERENCES & QUIET HOURS */}
        {activeTab === "preferences" && preferences && (
          <div className="p-6 rounded-3xl bg-black/45 backdrop-blur-xl border border-white/20 shadow-2xl space-y-5 max-w-3xl">
            <div className="pb-2 border-b border-white/15">
              <h3 className="font-display font-bold text-base text-white flex items-center gap-2">
                <Settings className="w-4 h-4 text-amber-400" />
                {isKn ? "ಎಚ್ಚರಿಕೆ ಆದ್ಯತೆಗಳು & ಸೆಟ್ಟಿಂಗ್ಸ್" : "Alert Preferences & Quiet Hours"}
              </h3>
              <p className="text-xs text-neutral-300">
                {isKn
                  ? "ಯಾವ ರೀತಿಯ ಹವಾಮಾನ ಎಚ್ಚರಿಕೆಗಳನ್ನು ನೀವು ಸ್ವೀಕರಿಸಲು ಬಯಸುತ್ತೀರಿ ಎಂಬುದನ್ನು ಆಯ್ಕೆಮಾಡಿ."
                  : "Configure which categories of meteorological and irrigation alerts you want to receive."}
              </p>
            </div>

            <form onSubmit={handleSavePreferences} className="space-y-5 text-xs">
              {/* Alert Category Switches */}
              <div className="space-y-3">
                <span className="text-xs font-bold text-neutral-200 uppercase tracking-wider block">
                  {isKn ? "ಎಚ್ಚರಿಕೆ ವಿಭಾಗಗಳು:" : "Alert Categories:"}
                </span>

                {[
                  { key: "rain_alerts", label: isKn ? "ಮಳೆ ಮತ್ತು ಬಿರುಗಾಳಿ ಎಚ್ಚರಿಕೆಗಳು" : "Heavy Rain & Precipitation Alerts", desc: "Alert when rainfall exceeds 15mm/hr or 45mm/day." },
                  { key: "wind_alerts", label: isKn ? "ಗಾಳಿಯ ವೇಗ ಮತ್ತು ಸಿಂಪಡಣೆ ಎಚ್ಚರಿಕೆಗಳು" : "High Wind & Spraying Advisories", desc: "Warn against foliar pesticide spraying when wind > 22 km/h." },
                  { key: "extreme_temp_alerts", label: isKn ? "ತೀವ್ರ ತಾಪಮಾನ / ಬಿಸಿಲಿನ ಎಚ್ಚರಿಕೆಗಳು" : "Extreme Heat & Thermal Stress", desc: "Warn when temperature exceeds 35.5°C to protect flowering crops." },
                  { key: "irrigation_alerts", label: isKn ? "ಸ್ಮಾರ್ಟ್ ನೀರಾವರಿ ಸಲಹೆಗಳು" : "Smart Irrigation Advisories", desc: "Advise holding drip irrigation cycles when rain is forecast." },
                  { key: "official_warnings", label: isKn ? "ಸರ್ಕಾರಿ / IMD ಅಧಿಕೃತ ಎಚ್ಚರಿಕೆಗಳು" : "Government & IMD Official Warnings", desc: "Direct district-level severe weather broadcast notices." },
                ].map((item) => (
                  <div
                    key={item.key}
                    className="p-3.5 rounded-2xl bg-black/40 border border-white/10 flex items-center justify-between gap-3"
                  >
                    <div>
                      <div className="font-bold text-sm text-white">{item.label}</div>
                      <p className="text-neutral-400 text-[11px]">{item.desc}</p>
                    </div>

                    <label className="relative inline-flex items-center cursor-pointer shrink-0">
                      <input
                        type="checkbox"
                        checked={(preferences as any)[item.key]}
                        onChange={(e) =>
                          setPreferences({ ...preferences, [item.key]: e.target.checked })
                        }
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-neutral-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-500"></div>
                    </label>
                  </div>
                ))}
              </div>

              {/* Delivery Channels */}
              <div className="space-y-3 pt-2 border-t border-white/10">
                <span className="text-xs font-bold text-neutral-200 uppercase tracking-wider block">
                  {isKn ? "ವಿತರಣಾ ಮಾರ್ಗಗಳು:" : "Notification Channels:"}
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="p-3 rounded-2xl bg-black/40 border border-white/10 flex items-center justify-between">
                    <div>
                      <span className="font-bold text-white block">🔔 {isKn ? "ಇನ್-ಆ್ಯಪ್ ಅಧಿಸೂಚನೆಗಳು" : "In-App Alerts"}</span>
                      <span className="text-[10px] text-emerald-300">{isKn ? "ಸಕ್ರಿಯವಾಗಿದೆ" : "Always Active"}</span>
                    </div>
                    <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  </div>

                  <div className="p-3 rounded-2xl bg-black/40 border border-white/10 flex items-center justify-between">
                    <div>
                      <span className="font-bold text-white block">💬 {isKn ? "ವಾಟ್ಸಾಪ್ ಫ್ಲ್ಯಾಶ್ ಎಚ್ಚರಿಕೆಗಳು" : "WhatsApp Flash Alerts"}</span>
                      <span className="text-[10px] text-neutral-400">+91 98452 11029</span>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={preferences.whatsapp_enabled}
                        onChange={(e) =>
                          setPreferences({ ...preferences, whatsapp_enabled: e.target.checked })
                        }
                        className="sr-only peer"
                      />
                      <div className="w-9 h-5 bg-neutral-700 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-500"></div>
                    </label>
                  </div>
                </div>
              </div>

              {/* Quiet Hours */}
              <div className="p-4 rounded-2xl bg-black/40 border border-white/10 space-y-3 pt-2">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-bold text-white text-sm block">🌙 {isKn ? "ಶಾಂತ ಸಮಯ (Quiet Hours)" : "Quiet Hours"}</span>
                    <span className="text-[11px] text-neutral-400">
                      {isKn ? "ರಾತ್ರಿಯ ವೇಳೆ ಅನಗತ್ಯ ಎಚ್ಚರಿಕೆಗಳನ್ನು ಮ್ಯೂಟ್ ಮಾಡುತ್ತದೆ (ತೀವ್ರ ಎಚ್ಚರಿಕೆ ಹೊರತುಪಡಿಸಿ)." : "Suppresses non-critical advisories during night hours."}
                    </span>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={preferences.quiet_hours_enabled}
                      onChange={(e) =>
                        setPreferences({ ...preferences, quiet_hours_enabled: e.target.checked })
                      }
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-neutral-700 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-500"></div>
                  </label>
                </div>

                {preferences.quiet_hours_enabled && (
                  <div className="grid grid-cols-2 gap-3 pt-2">
                    <div>
                      <label className="text-[10px] text-neutral-400 block mb-1">Start Time</label>
                      <input
                        type="time"
                        value={preferences.quiet_hours_start}
                        onChange={(e) => setPreferences({ ...preferences, quiet_hours_start: e.target.value })}
                        className="w-full p-2 rounded-xl bg-black/60 border border-white/20 text-white text-xs font-mono"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-neutral-400 block mb-1">End Time</label>
                      <input
                        type="time"
                        value={preferences.quiet_hours_end}
                        onChange={(e) => setPreferences({ ...preferences, quiet_hours_end: e.target.value })}
                        className="w-full p-2 rounded-xl bg-black/60 border border-white/20 text-white text-xs font-mono"
                      />
                    </div>
                  </div>
                )}
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-2xl bg-amber-600 hover:bg-amber-500 border border-amber-400/40 text-white font-bold text-xs shadow-lg transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <Check className="w-4 h-4" />
                <span>{isKn ? "ಆದ್ಯತೆಗಳನ್ನು ಉಳಿಸಿ" : "Save Alert Preferences"}</span>
              </button>
            </form>
          </div>
        )}

      </div>
    </div>
  );
}
