"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useApp } from "@/lib/store";
import {
  Shield,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Building,
  Plus,
  Search,
  Filter,
  RefreshCw,
  Eye,
  FileText,
  Calendar,
  Clock,
  ExternalLink,
  MapPin,
  Phone,
  Mail,
  Award,
  Layers,
  Star,
  Activity,
  UserCheck,
  Send,
  Lock,
  Radio,
  Trash2,
  Sparkles,
} from "lucide-react";
import {
  ServiceProvider,
  OfficialNotice,
  ImportantDate,
  ServiceRequest,
  ServiceFeedback,
  SupportAuditLog,
  ServiceRequestStatus,
  ProviderVerificationStatus,
} from "@/lib/types/support";

export default function AdminSupportHubPage() {
  const { showToast, user } = useApp();

  const [activeTab, setActiveTab] = useState<
    "overview" | "providers" | "notices" | "dates" | "requests" | "feedback" | "audit"
  >("overview");

  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<any>(null);
  const [providers, setProviders] = useState<ServiceProvider[]>([]);
  const [serviceRequests, setServiceRequests] = useState<ServiceRequest[]>([]);
  const [notices, setNotices] = useState<OfficialNotice[]>([]);
  const [dates, setDates] = useState<ImportantDate[]>([]);
  const [feedbackList, setFeedbackList] = useState<ServiceFeedback[]>([]);
  const [auditLogs, setAuditLogs] = useState<SupportAuditLog[]>([]);

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState("");
  const [providerFilter, setProviderFilter] = useState<string>("ALL");
  const [requestFilter, setRequestFilter] = useState<string>("ALL");

  // Notice creation form
  const [noticeForm, setNoticeForm] = useState({
    title: "",
    description: "",
    category: "Advisory" as OfficialNotice["category"],
    state: "Karnataka",
    district: "Kolar",
    source_name: "Karnataka State Dept of Agriculture (KSDA)",
    source_url: "https://raitamitra.karnataka.gov.in",
    valid_from: new Date().toISOString().split("T")[0],
    valid_until: new Date(Date.now() + 30 * 86400000).toISOString().split("T")[0],
  });

  // Date creation form
  const [dateForm, setDateForm] = useState({
    title: "",
    description: "",
    category: "SchemeDeadline" as ImportantDate["category"],
    state: "Karnataka",
    district: "Kolar",
    start_date: new Date().toISOString().split("T")[0],
    deadline: new Date(Date.now() + 45 * 86400000).toISOString().split("T")[0],
    source_name: "Pradhan Mantri Fasal Bima Yojana (PMFBY)",
    source_url: "https://pmfby.gov.in",
  });

  // Request update state
  const [selectedRequest, setSelectedRequest] = useState<ServiceRequest | null>(null);
  const [updateStatus, setUpdateStatus] = useState<ServiceRequestStatus>("ACCEPTED");
  const [statusRemarks, setStatusRemarks] = useState("");

  const fetchAdminData = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/support");
      const json = await res.json();
      if (json.success && json.data) {
        setStats(json.data);
        setProviders(json.data.providers || []);
        setServiceRequests(json.data.service_requests || []);
        setNotices(json.data.notices || []);
        setDates(json.data.dates || []);
        setFeedbackList(json.data.feedback || []);
        setAuditLogs(json.data.audit_logs || []);
      }
    } catch (err) {
      console.error("Failed to load admin support data", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  const handleVerifyProvider = async (providerId: string, newStatus: ProviderVerificationStatus) => {
    try {
      const res = await fetch("/api/admin/support", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          adminId: user.id || "admin_user_01",
          provider_id: providerId,
          status: newStatus,
        }),
      });
      const json = await res.json();
      if (json.success) {
        showToast(
          "Provider Status Updated",
          `Provider status changed to ${newStatus}.`,
          "success"
        );
        fetchAdminData();
      } else {
        showToast("Update Failed", json.error || "Could not update status", "alert");
      }
    } catch (err: any) {
      showToast("Error", err.message, "alert");
    }
  };

  const handleCreateNotice = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!noticeForm.title || !noticeForm.description) {
      showToast("Missing Fields", "Please enter notice title and description.", "warning");
      return;
    }

    try {
      const res = await fetch("/api/admin/support", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          adminId: user.id || "admin_user_01",
          action: "create_notice",
          notice: {
            ...noticeForm,
            published_at: new Date().toISOString(),
            verification_status: "VERIFIED",
            verified_at: new Date().toISOString(),
            verified_by: "District Agriculture Officer (Admin)",
          },
        }),
      });
      const json = await res.json();
      if (json.success) {
        showToast("Official Notice Published", "Verified advisory is now visible to farmers.", "success");
        setNoticeForm({
          title: "",
          description: "",
          category: "Advisory",
          state: "Karnataka",
          district: "Kolar",
          source_name: "Karnataka State Dept of Agriculture (KSDA)",
          source_url: "https://raitamitra.karnataka.gov.in",
          valid_from: new Date().toISOString().split("T")[0],
          valid_until: new Date(Date.now() + 30 * 86400000).toISOString().split("T")[0],
        });
        fetchAdminData();
      }
    } catch (err: any) {
      showToast("Error", err.message, "alert");
    }
  };

  const handleCreateDate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!dateForm.title || !dateForm.deadline) {
      showToast("Missing Fields", "Please enter date title and deadline.", "warning");
      return;
    }

    try {
      const res = await fetch("/api/admin/support", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          adminId: user.id || "admin_user_01",
          action: "create_date",
          date: {
            ...dateForm,
            verified_at: new Date().toISOString(),
          },
        }),
      });
      const json = await res.json();
      if (json.success) {
        showToast("Important Date Added", "Verified deadline now visible in farmer calendars.", "success");
        setDateForm({
          title: "",
          description: "",
          category: "SchemeDeadline",
          state: "Karnataka",
          district: "Kolar",
          start_date: new Date().toISOString().split("T")[0],
          deadline: new Date(Date.now() + 45 * 86400000).toISOString().split("T")[0],
          source_name: "Pradhan Mantri Fasal Bima Yojana (PMFBY)",
          source_url: "https://pmfby.gov.in",
        });
        fetchAdminData();
      }
    } catch (err: any) {
      showToast("Error", err.message, "alert");
    }
  };

  const handleUpdateRequestStatus = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRequest) return;

    try {
      const res = await fetch("/api/admin/support", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          adminId: user.id || "admin_user_01",
          action: "update_request_status",
          request_id: selectedRequest.id,
          status: updateStatus,
          remarks: statusRemarks,
        }),
      });
      const json = await res.json();
      if (json.success) {
        showToast(
          "Request Status Updated",
          `Request #${selectedRequest.id} marked as ${updateStatus}. Notification sent to farmer.`,
          "success"
        );
        setSelectedRequest(null);
        setStatusRemarks("");
        fetchAdminData();
      }
    } catch (err: any) {
      showToast("Error", err.message, "alert");
    }
  };

  const filteredProviders = providers.filter((p) => {
    if (providerFilter !== "ALL" && p.verification_status !== providerFilter) return false;
    if (!searchQuery) return true;
    return (
      p.organization_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.district.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.taluk.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  const filteredRequests = serviceRequests.filter((r) => {
    if (requestFilter !== "ALL" && r.status !== requestFilter) return false;
    if (!searchQuery) return true;
    return (
      r.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.service_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.location.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  return (
    <div className="min-h-screen bg-transparent text-white p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="p-6 rounded-3xl bg-black/45 backdrop-blur-xl border border-white/20 shadow-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/80 border border-amber-400/50 text-white flex items-center justify-center shadow-lg">
              <Shield className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-display font-bold text-2xl text-white tracking-tight">
                  Support Hub — Government Administration & Verification
                </h1>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-950/80 border border-emerald-400/40 text-emerald-300 text-[11px] font-bold">
                  Strict Zero-Fake Mode
                </span>
              </div>
              <p className="text-xs sm:text-sm text-neutral-200">
                Authorized Governance: Verify Service Providers • Review Farmer Bookings • Publish Official Notices • Audit Trail
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={fetchAdminData}
              disabled={loading}
              className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white transition-all cursor-pointer"
              title="Refresh Data"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
            </button>
            <Link
              href="/support"
              className="px-4 py-2 rounded-xl bg-brand-600/80 hover:bg-brand-500 border border-brand-400/50 text-white text-xs font-bold transition-all"
            >
              ← Farmer Support View
            </Link>
          </div>
        </div>

        {/* 6 Macro System Metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          <div className="p-4 rounded-2xl bg-black/45 backdrop-blur-xl border border-white/20 shadow-lg">
            <span className="text-[11px] font-bold text-neutral-300 uppercase">Vault Documents</span>
            <div className="font-display font-extrabold text-2xl text-white mt-1">
              {stats?.total_documents ?? 0}
            </div>
            <span className="text-[10px] text-brand-300 font-semibold">Encrypted RLS</span>
          </div>

          <div className="p-4 rounded-2xl bg-black/45 backdrop-blur-xl border border-white/20 shadow-lg">
            <span className="text-[11px] font-bold text-neutral-300 uppercase">Scheme Apps</span>
            <div className="font-display font-extrabold text-2xl text-amber-300 mt-1">
              {stats?.total_applications ?? 0}
            </div>
            <span className="text-[10px] text-amber-200 font-semibold">Tracked Live</span>
          </div>

          <div className="p-4 rounded-2xl bg-black/45 backdrop-blur-xl border border-white/20 shadow-lg">
            <span className="text-[11px] font-bold text-neutral-300 uppercase">Service Requests</span>
            <div className="font-display font-extrabold text-2xl text-sky-300 mt-1">
              {stats?.total_service_requests ?? 0}
            </div>
            <span className="text-[10px] text-sky-200 font-semibold">Soil & Machinery</span>
          </div>

          <div className="p-4 rounded-2xl bg-black/45 backdrop-blur-xl border border-white/20 shadow-lg">
            <span className="text-[11px] font-bold text-neutral-300 uppercase">Verified Providers</span>
            <div className="font-display font-extrabold text-2xl text-emerald-300 mt-1">
              {stats?.total_verified_providers ?? 0}
            </div>
            <span className="text-[10px] text-emerald-200 font-semibold">{stats?.total_pending_providers ?? 0} Pending</span>
          </div>

          <div className="p-4 rounded-2xl bg-black/45 backdrop-blur-xl border border-white/20 shadow-lg">
            <span className="text-[11px] font-bold text-neutral-300 uppercase">Official Notices</span>
            <div className="font-display font-extrabold text-2xl text-purple-300 mt-1">
              {stats?.total_notices ?? 0}
            </div>
            <span className="text-[10px] text-purple-200 font-semibold">Verified Govt</span>
          </div>

          <div className="p-4 rounded-2xl bg-black/45 backdrop-blur-xl border border-white/20 shadow-lg">
            <span className="text-[11px] font-bold text-neutral-300 uppercase">Audit Events</span>
            <div className="font-display font-extrabold text-2xl text-neutral-200 mt-1">
              {auditLogs.length}
            </div>
            <span className="text-[10px] text-neutral-400 font-semibold">Immutable Trail</span>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 border-b border-white/15">
          {[
            { id: "overview", label: "Overview", icon: Layers },
            { id: "providers", label: `Providers (${providers.length})`, icon: Building },
            { id: "requests", label: `Service Requests (${serviceRequests.length})`, icon: UserCheck },
            { id: "notices", label: `Official Notices (${notices.length})`, icon: Radio },
            { id: "dates", label: `Important Dates (${dates.length})`, icon: Calendar },
            { id: "feedback", label: `Feedback (${feedbackList.length})`, icon: Star },
            { id: "audit", label: `Audit Log (${auditLogs.length})`, icon: Shield },
          ].map((tab) => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                  active
                    ? "bg-brand-600 text-white shadow-lg border border-brand-400/50"
                    : "bg-black/30 hover:bg-white/10 text-neutral-300 border border-white/10"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* TAB 1: OVERVIEW */}
        {activeTab === "overview" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Quick Actions Panel */}
            <div className="p-6 rounded-3xl bg-black/45 backdrop-blur-xl border border-white/20 shadow-2xl space-y-4">
              <h3 className="font-display font-bold text-base text-white flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-brand-400" />
                Administrative Command Centre
              </h3>
              <p className="text-xs text-neutral-300">
                All data displayed is synchronized with Supabase PostgreSQL. Only verified government officers and agriculture centres can provide service quotes.
              </p>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <button
                  onClick={() => setActiveTab("notices")}
                  className="p-3.5 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/15 text-left transition-all cursor-pointer group"
                >
                  <Radio className="w-5 h-5 text-purple-400 mb-2 group-hover:scale-110 transition-transform" />
                  <div className="font-bold text-xs text-white">Publish Advisory</div>
                  <div className="text-[11px] text-neutral-400 mt-0.5">Broadcast verified notice</div>
                </button>

                <button
                  onClick={() => setActiveTab("dates")}
                  className="p-3.5 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/15 text-left transition-all cursor-pointer group"
                >
                  <Calendar className="w-5 h-5 text-amber-400 mb-2 group-hover:scale-110 transition-transform" />
                  <div className="font-bold text-xs text-white">Add Deadline</div>
                  <div className="text-[11px] text-neutral-400 mt-0.5">Scheme/Insurance window</div>
                </button>

                <button
                  onClick={() => setActiveTab("providers")}
                  className="p-3.5 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/15 text-left transition-all cursor-pointer group"
                >
                  <Building className="w-5 h-5 text-emerald-400 mb-2 group-hover:scale-110 transition-transform" />
                  <div className="font-bold text-xs text-white">Verify Centres</div>
                  <div className="text-[11px] text-neutral-400 mt-0.5">Approve RSK & Labs</div>
                </button>

                <button
                  onClick={() => setActiveTab("requests")}
                  className="p-3.5 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/15 text-left transition-all cursor-pointer group"
                >
                  <UserCheck className="w-5 h-5 text-sky-400 mb-2 group-hover:scale-110 transition-transform" />
                  <div className="font-bold text-xs text-white">Farmer Requests</div>
                  <div className="text-[11px] text-neutral-400 mt-0.5">Update booking status</div>
                </button>
              </div>
            </div>

            {/* Recent Audit Activities */}
            <div className="p-6 rounded-3xl bg-black/45 backdrop-blur-xl border border-white/20 shadow-2xl space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-display font-bold text-base text-white flex items-center gap-2">
                  <Shield className="w-5 h-5 text-brand-400" />
                  Live Security & Audit Logs
                </h3>
                <button
                  onClick={() => setActiveTab("audit")}
                  className="text-xs text-brand-300 hover:underline font-semibold"
                >
                  View All ({auditLogs.length})
                </button>
              </div>

              <div className="space-y-2.5 max-h-80 overflow-y-auto pr-1">
                {auditLogs.length === 0 ? (
                  <div className="p-8 text-center text-xs text-neutral-400">No audit events recorded yet.</div>
                ) : (
                  auditLogs.slice(0, 8).map((log) => (
                    <div
                      key={log.id}
                      className="p-3 rounded-xl bg-black/40 border border-white/10 flex items-start justify-between gap-2 text-xs"
                    >
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-[11px] text-brand-300">{log.action}</span>
                          <span className="text-[10px] px-1.5 py-0.2 rounded bg-white/10 text-neutral-300">
                            {log.entity_type}
                          </span>
                        </div>
                        <p className="text-[11px] text-neutral-400">
                          Actor: <strong className="text-white">{log.actor_id}</strong> ({log.actor_role})
                        </p>
                      </div>
                      <span className="text-[10px] text-neutral-400 font-mono shrink-0">
                        {new Date(log.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>

          </div>
        )}

        {/* TAB 2: PROVIDERS MANAGEMENT */}
        {activeTab === "providers" && (
          <div className="p-6 rounded-3xl bg-black/45 backdrop-blur-xl border border-white/20 shadow-2xl space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="font-display font-bold text-lg text-white">
                  Verified Agricultural Service Providers
                </h3>
                <p className="text-xs text-neutral-300">
                  Only VERIFIED providers appear in the farmer-facing locator. Suspended or unverified providers are immediately hidden.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <select
                  value={providerFilter}
                  onChange={(e) => setProviderFilter(e.target.value)}
                  className="text-xs font-semibold px-3 py-2 rounded-xl bg-black/50 border border-white/20 text-white focus:outline-none"
                >
                  <option value="ALL">All Statuses</option>
                  <option value="VERIFIED">Verified Only</option>
                  <option value="PENDING">Pending Only</option>
                  <option value="SUSPENDED">Suspended Only</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredProviders.length === 0 ? (
                <div className="col-span-2 p-12 text-center text-sm text-neutral-400">
                  No service providers match this filter.
                </div>
              ) : (
                filteredProviders.map((p) => (
                  <div
                    key={p.id}
                    className="p-4 rounded-2xl bg-black/40 border border-white/15 space-y-3 flex flex-col justify-between"
                  >
                    <div className="space-y-2">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-bold text-sm text-white">{p.organization_name}</h4>
                            <span
                              className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full border ${
                                p.verification_status === "VERIFIED"
                                  ? "bg-emerald-950/80 text-emerald-300 border-emerald-500/40"
                                  : p.verification_status === "PENDING"
                                  ? "bg-amber-950/80 text-amber-300 border-amber-500/40"
                                  : "bg-red-950/80 text-red-300 border-red-500/40"
                              }`}
                            >
                              {p.verification_status}
                            </span>
                          </div>
                          <p className="text-xs text-brand-300 font-semibold">{p.provider_type.replace(/_/g, " ")}</p>
                        </div>
                      </div>

                      <div className="text-xs text-neutral-300 space-y-1">
                        <div className="flex items-center gap-1.5">
                          <MapPin className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
                          <span>{p.address}, {p.taluk}, {p.district}</span>
                        </div>
                        {p.phone && (
                          <div className="flex items-center gap-1.5">
                            <Phone className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
                            <span>{p.phone}</span>
                          </div>
                        )}
                        {p.verified_by && (
                          <div className="text-[11px] text-neutral-400">
                            Verified by: <strong className="text-neutral-200">{p.verified_by}</strong> on {new Date(p.verified_at || "").toLocaleDateString()}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 pt-2 border-t border-white/10">
                      {p.verification_status !== "VERIFIED" && (
                        <button
                          onClick={() => handleVerifyProvider(p.id, "VERIFIED")}
                          className="flex-1 py-1.5 rounded-xl bg-emerald-600/80 hover:bg-emerald-500 text-white text-xs font-bold transition-all border border-emerald-400/40 cursor-pointer"
                        >
                          ✓ Verify & Publish
                        </button>
                      )}
                      {p.verification_status !== "SUSPENDED" && (
                        <button
                          onClick={() => handleVerifyProvider(p.id, "SUSPENDED")}
                          className="py-1.5 px-3 rounded-xl bg-red-950/70 hover:bg-red-900 text-red-300 text-xs font-bold transition-all border border-red-500/40 cursor-pointer"
                        >
                          Suspend
                        </button>
                      )}
                      {p.verification_status !== "PENDING" && (
                        <button
                          onClick={() => handleVerifyProvider(p.id, "PENDING")}
                          className="py-1.5 px-3 rounded-xl bg-amber-950/70 hover:bg-amber-900 text-amber-300 text-xs font-bold transition-all border border-amber-500/40 cursor-pointer"
                        >
                          Reset
                        </button>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* TAB 3: SERVICE REQUESTS REVIEW */}
        {activeTab === "requests" && (
          <div className="p-6 rounded-3xl bg-black/45 backdrop-blur-xl border border-white/20 shadow-2xl space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="font-display font-bold text-lg text-white">
                  Farmer Agricultural Service Requests & Bookings
                </h3>
                <p className="text-xs text-neutral-300">
                  Review soil testing, machinery rental, and transport bookings submitted by farmers.
                </p>
              </div>

              <select
                value={requestFilter}
                onChange={(e) => setRequestFilter(e.target.value)}
                className="text-xs font-semibold px-3 py-2 rounded-xl bg-black/50 border border-white/20 text-white focus:outline-none"
              >
                <option value="ALL">All Requests</option>
                <option value="REQUESTED">Requested Only</option>
                <option value="ACCEPTED">Accepted Only</option>
                <option value="SCHEDULED">Scheduled Only</option>
                <option value="IN_PROGRESS">In Progress Only</option>
                <option value="COMPLETED">Completed Only</option>
                <option value="REJECTED">Rejected Only</option>
              </select>
            </div>

            <div className="space-y-3">
              {filteredRequests.length === 0 ? (
                <div className="p-12 text-center text-sm text-neutral-400">
                  No service requests found for this filter.
                </div>
              ) : (
                filteredRequests.map((r) => (
                  <div
                    key={r.id}
                    className="p-4 rounded-2xl bg-black/40 border border-white/15 flex flex-col md:flex-row md:items-center justify-between gap-4"
                  >
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-white">{r.service_name}</span>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/10 text-neutral-300">
                          #{r.id}
                        </span>
                        <span
                          className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border ${
                            r.status === "COMPLETED"
                              ? "bg-emerald-950/80 text-emerald-300 border-emerald-500/40"
                              : r.status === "REJECTED"
                              ? "bg-red-950/80 text-red-300 border-red-500/40"
                              : "bg-sky-950/80 text-sky-300 border-sky-500/40"
                          }`}
                        >
                          {r.status}
                        </span>
                      </div>
                      <p className="text-xs text-neutral-300">
                        Location: <strong className="text-white">{r.location}</strong> • Preferred Date: <strong className="text-brand-300">{r.requested_date}</strong>
                      </p>
                      {r.description && (
                        <p className="text-xs text-neutral-400 italic">
                          "{r.description}"
                        </p>
                      )}
                    </div>

                    <button
                      onClick={() => {
                        setSelectedRequest(r);
                        setUpdateStatus(r.status);
                      }}
                      className="px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold transition-all border border-brand-400/40 cursor-pointer shrink-0"
                    >
                      Update Status / Schedule →
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* TAB 4: OFFICIAL NOTICES DESK */}
        {activeTab === "notices" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Notice Publisher Form */}
            <div className="lg:col-span-5 p-6 rounded-3xl bg-black/45 backdrop-blur-xl border border-white/20 shadow-2xl space-y-4">
              <h3 className="font-display font-bold text-base text-white flex items-center gap-2">
                <Radio className="w-5 h-5 text-purple-400" />
                Publish Verified Official Notice
              </h3>
              <p className="text-xs text-neutral-300">
                Government notices must include an official source URL and verification metadata before publishing.
              </p>

              <form onSubmit={handleCreateNotice} className="space-y-3 text-xs">
                <div>
                  <label className="text-[11px] font-semibold text-neutral-300 block mb-1">Notice Title</label>
                  <input
                    type="text"
                    required
                    value={noticeForm.title}
                    onChange={(e) => setNoticeForm({ ...noticeForm, title: e.target.value })}
                    placeholder="e.g. Free Soil Health Card Testing Camp Announcement"
                    className="w-full p-2.5 rounded-xl bg-black/50 border border-white/20 text-white focus:outline-none focus:ring-1 focus:ring-brand-400"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-neutral-300 block mb-1">Description / Advisory Text</label>
                  <textarea
                    rows={3}
                    required
                    value={noticeForm.description}
                    onChange={(e) => setNoticeForm({ ...noticeForm, description: e.target.value })}
                    placeholder="Official advisory guidelines for farmers..."
                    className="w-full p-2.5 rounded-xl bg-black/50 border border-white/20 text-white focus:outline-none focus:ring-1 focus:ring-brand-400"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[11px] font-semibold text-neutral-300 block mb-1">Category</label>
                    <select
                      value={noticeForm.category}
                      onChange={(e) => setNoticeForm({ ...noticeForm, category: e.target.value as any })}
                      className="w-full p-2.5 rounded-xl bg-black/50 border border-white/20 text-white focus:outline-none"
                    >
                      <option value="Advisory">Govt Advisory</option>
                      <option value="Announcement">District Announcement</option>
                      <option value="Weather">Weather Advisory</option>
                      <option value="CropNotice">Crop Notification</option>
                      <option value="Scheme">Scheme Update</option>
                      <option value="General">General Notice</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold text-neutral-300 block mb-1">District</label>
                    <input
                      type="text"
                      value={noticeForm.district}
                      onChange={(e) => setNoticeForm({ ...noticeForm, district: e.target.value })}
                      className="w-full p-2.5 rounded-xl bg-black/50 border border-white/20 text-white focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[11px] font-semibold text-neutral-300 block mb-1">Valid From</label>
                    <input
                      type="date"
                      value={noticeForm.valid_from}
                      onChange={(e) => setNoticeForm({ ...noticeForm, valid_from: e.target.value })}
                      className="w-full p-2 rounded-xl bg-black/50 border border-white/20 text-white focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-semibold text-neutral-300 block mb-1">Valid Until</label>
                    <input
                      type="date"
                      value={noticeForm.valid_until}
                      onChange={(e) => setNoticeForm({ ...noticeForm, valid_until: e.target.value })}
                      className="w-full p-2 rounded-xl bg-black/50 border border-white/20 text-white focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-neutral-300 block mb-1">Official Source URL</label>
                  <input
                    type="url"
                    value={noticeForm.source_url}
                    onChange={(e) => setNoticeForm({ ...noticeForm, source_url: e.target.value })}
                    className="w-full p-2 rounded-xl bg-black/50 border border-white/20 text-white focus:outline-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 border border-purple-400/40 text-white font-bold text-xs shadow-lg transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  <span>Publish Verified Notice</span>
                </button>
              </form>
            </div>

            {/* List of Published Notices */}
            <div className="lg:col-span-7 p-6 rounded-3xl bg-black/45 backdrop-blur-xl border border-white/20 shadow-2xl space-y-4">
              <h3 className="font-display font-bold text-base text-white">
                Active Verified Official Notices ({notices.length})
              </h3>

              <div className="space-y-3 max-h-[600px] overflow-y-auto pr-1">
                {notices.map((n) => (
                  <div
                    key={n.id}
                    className="p-4 rounded-2xl bg-black/40 border border-white/15 space-y-2"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-sm text-white">{n.title}</span>
                          <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-purple-950/80 border border-purple-400/40 text-purple-300">
                            {n.category.replace(/_/g, " ")}
                          </span>
                        </div>
                        <p className="text-xs text-neutral-300 mt-1">{n.description}</p>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-white/10 text-[11px] text-neutral-400">
                      <span>Source: <strong className="text-white">{n.source_name}</strong></span>
                      <span>Valid: {n.valid_from} to {n.valid_until}</span>
                      {n.source_url && (
                        <a
                          href={n.source_url}
                          target="_blank"
                          rel="noreferrer"
                          className="text-purple-300 hover:underline flex items-center gap-1"
                        >
                          <span>Portal</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* TAB 5: IMPORTANT DATES DESK */}
        {activeTab === "dates" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Date Creator Form */}
            <div className="lg:col-span-5 p-6 rounded-3xl bg-black/45 backdrop-blur-xl border border-white/20 shadow-2xl space-y-4">
              <h3 className="font-display font-bold text-base text-white flex items-center gap-2">
                <Calendar className="w-5 h-5 text-amber-400" />
                Add Verified Agricultural Deadline
              </h3>

              <form onSubmit={handleCreateDate} className="space-y-3 text-xs">
                <div>
                  <label className="text-[11px] font-semibold text-neutral-300 block mb-1">Title</label>
                  <input
                    type="text"
                    required
                    value={dateForm.title}
                    onChange={(e) => setDateForm({ ...dateForm, title: e.target.value })}
                    placeholder="e.g. Rabi Season Crop Insurance Last Date"
                    className="w-full p-2.5 rounded-xl bg-black/50 border border-white/20 text-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-neutral-300 block mb-1">Description</label>
                  <textarea
                    rows={2}
                    value={dateForm.description}
                    onChange={(e) => setDateForm({ ...dateForm, description: e.target.value })}
                    placeholder="Official deadline details..."
                    className="w-full p-2.5 rounded-xl bg-black/50 border border-white/20 text-white focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[11px] font-semibold text-neutral-300 block mb-1">Category</label>
                    <select
                      value={dateForm.category}
                      onChange={(e) => setDateForm({ ...dateForm, category: e.target.value as any })}
                      className="w-full p-2.5 rounded-xl bg-black/50 border border-white/20 text-white focus:outline-none"
                    >
                      <option value="SchemeDeadline">Scheme Deadline</option>
                      <option value="InsuranceDeadline">Insurance Window</option>
                      <option value="ApplicationWindow">Application Window</option>
                      <option value="CropDeadline">Crop Advisory</option>
                      <option value="Camp">Agricultural Camp</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[11px] font-semibold text-neutral-300 block mb-1">Deadline Date</label>
                    <input
                      type="date"
                      required
                      value={dateForm.deadline}
                      onChange={(e) => setDateForm({ ...dateForm, deadline: e.target.value })}
                      className="w-full p-2.5 rounded-xl bg-black/50 border border-white/20 text-white focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-neutral-300 block mb-1">Source Name</label>
                  <input
                    type="text"
                    value={dateForm.source_name}
                    onChange={(e) => setDateForm({ ...dateForm, source_name: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-black/50 border border-white/20 text-white focus:outline-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 border border-amber-400/40 text-white font-bold text-xs shadow-lg transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  <span>Publish Important Date</span>
                </button>
              </form>
            </div>

            {/* List of Dates */}
            <div className="lg:col-span-7 p-6 rounded-3xl bg-black/45 backdrop-blur-xl border border-white/20 shadow-2xl space-y-4">
              <h3 className="font-display font-bold text-base text-white">
                Verified Agricultural Dates ({dates.length})
              </h3>

              <div className="space-y-3 max-h-[600px] overflow-y-auto pr-1">
                {dates.map((d) => (
                  <div
                    key={d.id}
                    className="p-4 rounded-2xl bg-black/40 border border-white/15 flex items-start justify-between gap-3"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-white">{d.title}</span>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-950/80 border border-amber-500/40 text-amber-300">
                          {d.category.replace(/_/g, " ")}
                        </span>
                      </div>
                      <p className="text-xs text-neutral-300">{d.description}</p>
                      <div className="text-[11px] text-neutral-400 pt-1">
                        Source: <strong className="text-white">{d.source_name}</strong>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <div className="text-xs font-mono font-bold text-amber-300">{d.deadline}</div>
                      <span className="text-[10px] text-neutral-400">Deadline</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* TAB 6: FEEDBACK REVIEW */}
        {activeTab === "feedback" && (
          <div className="p-6 rounded-3xl bg-black/45 backdrop-blur-xl border border-white/20 shadow-2xl space-y-4">
            <h3 className="font-display font-bold text-base text-white">
              Farmer Service Ratings & Quality Feedback ({feedbackList.length})
            </h3>

            {feedbackList.length === 0 ? (
              <div className="p-12 text-center text-sm text-neutral-400">
                No farmer feedback submitted yet.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {feedbackList.map((fb) => (
                  <div
                    key={fb.id}
                    className="p-4 rounded-2xl bg-black/40 border border-white/15 space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1 text-amber-400">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${i < fb.rating ? "fill-amber-400 text-amber-400" : "text-neutral-600"}`}
                          />
                        ))}
                      </div>
                      <span className="text-[10px] text-neutral-400 font-mono">
                        {new Date(fb.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    {fb.feedback && (
                      <p className="text-xs text-neutral-200 italic">"{fb.feedback}"</p>
                    )}
                    <div className="text-[10px] text-neutral-400 pt-1 border-t border-white/10 flex justify-between">
                      <span>Request: <strong className="text-white">#{fb.request_id}</strong></span>
                      <span>Farmer ID: <strong className="text-white">{fb.user_id}</strong></span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 7: IMMUTABLE AUDIT LOG */}
        {activeTab === "audit" && (
          <div className="p-6 rounded-3xl bg-black/45 backdrop-blur-xl border border-white/20 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-display font-bold text-base text-white flex items-center gap-2">
                  <Shield className="w-5 h-5 text-brand-400" />
                  Support Hub Audit Trail (`support_audit_logs`)
                </h3>
                <p className="text-xs text-neutral-300">
                  Compliance and traceability record for all document, application, request, and verification events.
                </p>
              </div>
              <span className="text-xs font-mono font-bold text-brand-300 px-3 py-1 rounded-full bg-brand-950/80 border border-brand-400/40">
                {auditLogs.length} Events Logged
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-white/20 text-neutral-400 font-semibold">
                    <th className="pb-3 pr-4">Timestamp</th>
                    <th className="pb-3 pr-4">Action</th>
                    <th className="pb-3 pr-4">Entity Type</th>
                    <th className="pb-3 pr-4">Actor</th>
                    <th className="pb-3">Metadata</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10">
                  {auditLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-white/5 transition-colors">
                      <td className="py-3 pr-4 font-mono text-neutral-400 whitespace-nowrap">
                        {new Date(log.timestamp).toLocaleString()}
                      </td>
                      <td className="py-3 pr-4 font-bold text-brand-300 whitespace-nowrap">
                        {log.action}
                      </td>
                      <td className="py-3 pr-4">
                        <span className="px-2 py-0.5 rounded bg-white/10 font-mono text-[11px] text-neutral-200">
                          {log.entity_type}
                        </span>
                      </td>
                      <td className="py-3 pr-4 text-neutral-300 whitespace-nowrap">
                        {log.actor_id} ({log.actor_role})
                      </td>
                      <td className="py-3 font-mono text-[11px] text-neutral-400 max-w-xs truncate">
                        {JSON.stringify(log.metadata || {})}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* MODAL: UPDATE SERVICE REQUEST STATUS */}
        {selectedRequest && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
            <div className="bg-neutral-900 border border-white/20 rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl animate-fade-in">
              <div className="flex items-center justify-between pb-2 border-b border-white/15">
                <h4 className="font-display font-bold text-base text-white">
                  Update Service Request #{selectedRequest.id}
                </h4>
                <button
                  onClick={() => setSelectedRequest(null)}
                  className="p-1 rounded-lg text-neutral-400 hover:text-white"
                >
                  <XCircle className="w-5 h-5" />
                </button>
              </div>

              <div className="text-xs text-neutral-300 space-y-1">
                <div>Service: <strong className="text-white">{selectedRequest.service_name}</strong></div>
                <div>Farmer Location: <strong className="text-white">{selectedRequest.location}</strong></div>
                <div>Requested Date: <strong className="text-brand-300">{selectedRequest.requested_date}</strong></div>
              </div>

              <form onSubmit={handleUpdateRequestStatus} className="space-y-3 text-xs">
                <div>
                  <label className="text-[11px] font-semibold text-neutral-300 block mb-1">Change Status</label>
                  <select
                    value={updateStatus}
                    onChange={(e) => setUpdateStatus(e.target.value as ServiceRequestStatus)}
                    className="w-full p-2.5 rounded-xl bg-black/50 border border-white/20 text-white focus:outline-none"
                  >
                    <option value="REQUESTED">REQUESTED (Pending Review)</option>
                    <option value="ACCEPTED">ACCEPTED (Centre Approved)</option>
                    <option value="SCHEDULED">SCHEDULED (Date Confirmed)</option>
                    <option value="IN_PROGRESS">IN_PROGRESS (Technician Onsite)</option>
                    <option value="COMPLETED">COMPLETED (Service Delivered)</option>
                    <option value="REJECTED">REJECTED</option>
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-neutral-300 block mb-1">
                    Official Remarks / Instructions for Farmer
                  </label>
                  <textarea
                    rows={3}
                    value={statusRemarks}
                    onChange={(e) => setStatusRemarks(e.target.value)}
                    placeholder="e.g. Technician Shri Suresh (9845012345) assigned. Please keep 500g topsoil sample ready at field."
                    className="w-full p-2.5 rounded-xl bg-black/50 border border-white/20 text-white focus:outline-none"
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setSelectedRequest(null)}
                    className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 border border-brand-400/40 text-white font-bold shadow-lg"
                  >
                    Confirm & Notify Farmer
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
