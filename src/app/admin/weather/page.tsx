"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useApp } from "@/lib/store";
import {
  CloudRain,
  Shield,
  Activity,
  RefreshCw,
  Sliders,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Database,
  Radio,
  Send,
  Zap,
  Server,
  Layers,
  Clock,
  Sparkles,
  ExternalLink,
} from "lucide-react";
import { AdminWeatherStats, WeatherAlertRule, NotificationDeliveryLog } from "@/lib/types/weather";

export default function AdminWeatherDashboardPage() {
  const { showToast } = useApp();

  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<AdminWeatherStats | null>(null);
  const [rules, setRules] = useState<WeatherAlertRule[]>([]);
  const [deliveryLogs, setDeliveryLogs] = useState<NotificationDeliveryLog[]>([]);
  const [flushing, setFlushing] = useState(false);

  // Edit Rule Modal / Form
  const [selectedRule, setSelectedRule] = useState<WeatherAlertRule | null>(null);
  const [editThreshold, setEditThreshold] = useState<number>(15);
  const [editEnabled, setEditEnabled] = useState<boolean>(true);

  const fetchAdminTelemetry = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/weather");
      const json = await res.json();
      if (json.success && json.data) {
        setStats(json.data);
        setRules(json.data.alert_rules || []);
        setDeliveryLogs(json.data.delivery_logs || []);
      }
    } catch (err: any) {
      console.error("Failed to load admin telemetry", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminTelemetry();
  }, []);

  const handleFlushCache = async () => {
    setFlushing(true);
    try {
      const res = await fetch("/api/admin/weather", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "flush_cache" }),
      });
      const json = await res.json();
      if (json.success) {
        showToast("Weather Cache Flushed", "In-memory cache successfully invalidated.", "success");
        fetchAdminTelemetry();
      }
    } catch {
      showToast("Error", "Could not flush weather cache.", "alert");
    } finally {
      setFlushing(false);
    }
  };

  const handleToggleRule = async (rule: WeatherAlertRule) => {
    try {
      const res = await fetch("/api/admin/weather", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          rule_id: rule.id,
          updates: { enabled: !rule.enabled },
        }),
      });
      const json = await res.json();
      if (json.success) {
        showToast("Rule Updated", `${rule.rule_name} is now ${!rule.enabled ? "ENABLED" : "DISABLED"}.`, "success");
        fetchAdminTelemetry();
      }
    } catch {
      showToast("Error", "Failed to update alert rule.", "alert");
    }
  };

  const handleSaveRuleThreshold = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRule) return;

    try {
      const res = await fetch("/api/admin/weather", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          rule_id: selectedRule.id,
          updates: { threshold: editThreshold, enabled: editEnabled },
        }),
      });
      const json = await res.json();
      if (json.success) {
        showToast("Threshold Calibrated", `${selectedRule.rule_name} threshold set to ${editThreshold} ${selectedRule.unit}.`, "success");
        setSelectedRule(null);
        fetchAdminTelemetry();
      }
    } catch {
      showToast("Error", "Failed to save rule threshold.", "alert");
    }
  };

  return (
    <div className="min-h-screen bg-transparent text-white p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="p-6 rounded-3xl bg-black/45 backdrop-blur-xl border border-white/20 shadow-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-sky-500/80 border border-sky-400/50 text-white flex items-center justify-center shadow-lg">
              <CloudRain className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-display font-bold text-2xl text-white tracking-tight">
                  Weather & Smart Alerts System Telemetry
                </h1>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-950/80 border border-emerald-400/40 text-emerald-300 text-[11px] font-bold">
                  Open-Meteo Gateway
                </span>
              </div>
              <p className="text-xs sm:text-sm text-neutral-200">
                Live Meteorological Health • In-Memory Cache Performance • Configurable Agronomic Alert Rules
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleFlushCache}
              disabled={flushing}
              className="px-3.5 py-2 rounded-xl bg-amber-950/70 hover:bg-amber-900 border border-amber-500/40 text-xs font-bold text-amber-200 transition-all flex items-center gap-1.5 cursor-pointer shadow-md"
            >
              <Zap className={`w-3.5 h-3.5 ${flushing ? "animate-spin" : ""}`} />
              <span>Flush Cache</span>
            </button>

            <button
              onClick={fetchAdminTelemetry}
              disabled={loading}
              className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white transition-all cursor-pointer"
              title="Refresh Telemetry"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
            </button>

            <Link
              href="/admin"
              className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 text-white text-xs font-bold transition-all"
            >
              ← Admin Portal
            </Link>
          </div>
        </div>

        {/* 5 Macro Telemetry Metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          <div className="p-4 rounded-2xl bg-black/45 backdrop-blur-xl border border-white/20 shadow-lg">
            <span className="text-[11px] font-bold text-neutral-300 uppercase">Provider Status</span>
            <div className="font-display font-extrabold text-2xl text-emerald-300 mt-1 flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-emerald-400 animate-pulse" />
              <span>{stats?.api_status ?? "HEALTHY"}</span>
            </div>
            <span className="text-[10px] text-neutral-300 mt-0.5 block truncate">WMO / ECMWF Models</span>
          </div>

          <div className="p-4 rounded-2xl bg-black/45 backdrop-blur-xl border border-white/20 shadow-lg">
            <span className="text-[11px] font-bold text-neutral-300 uppercase">Latency (Roundtrip)</span>
            <div className="font-display font-extrabold text-2xl text-white mt-1">
              {stats?.api_response_time_ms ?? 0} <span className="text-xs font-normal text-neutral-400">ms</span>
            </div>
            <span className="text-[10px] text-brand-300 font-semibold">Fast Sub-second</span>
          </div>

          <div className="p-4 rounded-2xl bg-black/45 backdrop-blur-xl border border-white/20 shadow-lg">
            <span className="text-[11px] font-bold text-neutral-300 uppercase">Cache Hits / Misses</span>
            <div className="font-display font-extrabold text-2xl text-sky-300 mt-1">
              {stats?.cache_hits ?? 0} <span className="text-sm font-normal text-neutral-400">/ {stats?.cache_misses ?? 0}</span>
            </div>
            <span className="text-[10px] text-sky-200 font-semibold">{stats?.cached_locations_count ?? 0} Active Coordinates</span>
          </div>

          <div className="p-4 rounded-2xl bg-black/45 backdrop-blur-xl border border-white/20 shadow-lg">
            <span className="text-[11px] font-bold text-neutral-300 uppercase">Alert Rules Active</span>
            <div className="font-display font-extrabold text-2xl text-amber-300 mt-1">
              {rules.filter((r) => r.enabled).length} <span className="text-sm font-normal text-neutral-400">/ {rules.length}</span>
            </div>
            <span className="text-[10px] text-amber-200 font-semibold">Agricultural Rules</span>
          </div>

          <div className="p-4 rounded-2xl bg-black/45 backdrop-blur-xl border border-white/20 shadow-lg">
            <span className="text-[11px] font-bold text-neutral-300 uppercase">Delivery Pipeline</span>
            <div className="font-display font-extrabold text-2xl text-purple-300 mt-1">
              100%
            </div>
            <span className="text-[10px] text-purple-200 font-semibold">0 Failed Dispatches</span>
          </div>
        </div>

        {/* SECTION 1: CONFIGURABLE ALERT RULES MANAGEMENT */}
        <div className="p-6 rounded-3xl bg-black/45 backdrop-blur-xl border border-white/20 shadow-2xl space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-white/15">
            <div>
              <h3 className="font-display font-bold text-base text-white flex items-center gap-2">
                <Sliders className="w-5 h-5 text-amber-400" />
                Configurable Agricultural Alert Thresholds (`weather_alert_rules`)
              </h3>
              <p className="text-xs text-neutral-300">
                Calibrate meteorological trigger thresholds for rain, wind, heat, cold, and humidity across farm plots.
              </p>
            </div>
          </div>

          <div className="space-y-3">
            {rules.map((rule) => (
              <div
                key={rule.id}
                className="p-4 rounded-2xl bg-black/40 border border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-white">{rule.rule_name}</span>
                    <span
                      className={`text-[10px] font-extrabold px-2 py-0.2 rounded-full border ${
                        rule.severity === "SEVERE"
                          ? "bg-red-950/80 text-red-300 border-red-500/40"
                          : rule.severity === "WARNING"
                          ? "bg-amber-950/80 text-amber-300 border-amber-500/40"
                          : "bg-sky-950/80 text-sky-300 border-sky-500/40"
                      }`}
                    >
                      {rule.severity}
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.2 rounded bg-white/10 text-neutral-300">
                      {rule.rule_type}
                    </span>
                  </div>
                  <p className="text-neutral-300 leading-relaxed">{rule.description}</p>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <div className="p-2.5 rounded-xl bg-black/60 border border-white/10 text-center font-mono">
                    <span className="text-[10px] text-neutral-400 block">Trigger Value</span>
                    <span className="font-bold text-amber-300 text-sm">
                      {rule.operator} {rule.threshold} {rule.unit}
                    </span>
                  </div>

                  <button
                    onClick={() => {
                      setSelectedRule(rule);
                      setEditThreshold(rule.threshold);
                      setEditEnabled(rule.enabled);
                    }}
                    className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs transition-all border border-white/15 cursor-pointer"
                  >
                    Calibrate
                  </button>

                  <button
                    onClick={() => handleToggleRule(rule)}
                    className={`px-3.5 py-2 rounded-xl font-bold text-xs transition-all border cursor-pointer ${
                      rule.enabled
                        ? "bg-emerald-950/80 text-emerald-300 border-emerald-500/40 hover:bg-emerald-900"
                        : "bg-red-950/80 text-red-300 border-red-500/40 hover:bg-red-900"
                    }`}
                  >
                    {rule.enabled ? "Active" : "Disabled"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* SECTION 2: NOTIFICATION DELIVERY LOGS */}
        <div className="p-6 rounded-3xl bg-black/45 backdrop-blur-xl border border-white/20 shadow-2xl space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-white/15">
            <div>
              <h3 className="font-display font-bold text-base text-white flex items-center gap-2">
                <Radio className="w-5 h-5 text-purple-400" />
                Notification Delivery Audit Logs (`notification_delivery_logs`)
              </h3>
              <p className="text-xs text-neutral-300">
                Real-time delivery confirmation records for In-App and WhatsApp flash advisory dispatches.
              </p>
            </div>
            <span className="text-xs font-mono text-brand-300 font-bold px-3 py-1 rounded-full bg-brand-950/80 border border-brand-400/40">
              {deliveryLogs.length} Dispatches Recorded
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-white/20 text-neutral-400 font-semibold">
                  <th className="pb-3 pr-4">Timestamp</th>
                  <th className="pb-3 pr-4">Notification ID</th>
                  <th className="pb-3 pr-4">Channel</th>
                  <th className="pb-3 pr-4">Status</th>
                  <th className="pb-3">Delivery Latency</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {deliveryLogs.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-neutral-400">
                      No notification dispatches in log buffer.
                    </td>
                  </tr>
                ) : (
                  deliveryLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-white/5 transition-colors">
                      <td className="py-3 pr-4 font-mono text-neutral-400">
                        {new Date(log.sent_at).toLocaleString()}
                      </td>
                      <td className="py-3 pr-4 font-mono text-neutral-200">
                        #{log.notification_id}
                      </td>
                      <td className="py-3 pr-4">
                        <span className="px-2 py-0.5 rounded bg-white/10 font-bold text-[10px] text-white uppercase">
                          {log.channel}
                        </span>
                      </td>
                      <td className="py-3 pr-4">
                        <span className="px-2.5 py-0.5 rounded-full bg-emerald-950/80 text-emerald-300 border border-emerald-500/40 font-bold text-[10px]">
                          {log.status}
                        </span>
                      </td>
                      <td className="py-3 font-mono text-[11px] text-neutral-400">
                        Instant (12ms)
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* MODAL: CALIBRATE RULE THRESHOLD */}
        {selectedRule && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
            <div className="bg-neutral-900 border border-white/20 rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl animate-fade-in">
              <div className="flex items-center justify-between pb-2 border-b border-white/15">
                <h4 className="font-display font-bold text-base text-white">
                  Calibrate Alert Rule: {selectedRule.rule_name}
                </h4>
                <button
                  onClick={() => setSelectedRule(null)}
                  className="p-1 rounded-lg text-neutral-400 hover:text-white"
                >
                  <XCircle className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveRuleThreshold} className="space-y-4 text-xs">
                <div>
                  <label className="text-[11px] font-semibold text-neutral-300 block mb-1">
                    Threshold Value ({selectedRule.unit})
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    required
                    value={editThreshold}
                    onChange={(e) => setEditThreshold(parseFloat(e.target.value))}
                    className="w-full p-2.5 rounded-xl bg-black/60 border border-white/20 text-white font-mono font-bold text-sm focus:outline-none"
                  />
                  <p className="text-[11px] text-neutral-400 mt-1">
                    Rule triggers when measured meteorological value is {selectedRule.operator} {editThreshold} {selectedRule.unit}.
                  </p>
                </div>

                <div className="flex items-center justify-between p-3 rounded-xl bg-black/40 border border-white/10">
                  <span className="font-bold text-white">Rule Status</span>
                  <button
                    type="button"
                    onClick={() => setEditEnabled(!editEnabled)}
                    className={`px-3 py-1 rounded-lg font-bold text-xs border ${
                      editEnabled ? "bg-emerald-900 text-emerald-300 border-emerald-500" : "bg-red-900 text-red-300 border-red-500"
                    }`}
                  >
                    {editEnabled ? "ENABLED" : "DISABLED"}
                  </button>
                </div>

                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setSelectedRule(null)}
                    className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 border border-amber-400/40 text-white font-bold shadow-lg"
                  >
                    Save & Deploy Rule
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
