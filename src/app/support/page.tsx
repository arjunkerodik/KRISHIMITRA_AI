"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import Link from "next/link";
import { FarmerSidebar } from "@/components/FarmerSidebar";
import { useApp } from "@/lib/store";
import confetti from "canvas-confetti";
import {
  HelpCircle,
  FileText,
  Landmark,
  FileCheck2,
  DollarSign,
  Bell,
  Calendar,
  Tractor,
  MapPin,
  User,
  Star,
  Search,
  Filter,
  PlusCircle,
  Upload,
  Eye,
  Download,
  Trash2,
  Edit3,
  CheckCircle2,
  Clock,
  AlertTriangle,
  ChevronRight,
  ChevronDown,
  X,
  ExternalLink,
  ShieldCheck,
  Send,
  Sparkles,
  PhoneCall,
  Globe,
  Navigation,
  RefreshCw,
  Building,
  Check,
  Layers,
  ArrowRight,
  MessageSquare,
  Shield,
  Award,
} from "lucide-react";
import {
  FarmerDocument,
  DocumentType,
  SchemeApplication,
  ApplicationStatus,
  FarmerBenefit,
  OfficialNotice,
  ImportantDate,
  ServiceRequest,
  RequestStatus,
  ServiceProvider,
  SupportService,
  SupportNotification,
  SupportDashboardSummary,
} from "@/lib/types/support";
import { DEMO_SCHEMES } from "@/lib/demo-data";

export default function SupportHubPage() {
  const { user, activeFarm, farms, showToast } = useApp();

  // Language state (English / ಕನ್ನಡ)
  const [lang, setLang] = useState<"en" | "kn">("en");

  // Navigation Tabs: dashboard overview or specific section
  const [activeTab, setActiveTab] = useState<
    | "overview"
    | "documents"
    | "applications"
    | "services"
    | "requests"
    | "notices"
    | "dates"
    | "benefits"
    | "profile"
  >("overview");

  // Global Search & Filters
  const [globalSearch, setGlobalSearch] = useState<string>("");
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>("All");

  // Dashboard Data State
  const [dashboardSummary, setDashboardSummary] = useState<SupportDashboardSummary | null>(null);
  const [documents, setDocuments] = useState<FarmerDocument[]>([]);
  const [applications, setApplications] = useState<SchemeApplication[]>([]);
  const [benefits, setBenefits] = useState<FarmerBenefit[]>([]);
  const [serviceRequests, setServiceRequests] = useState<ServiceRequest[]>([]);
  const [notices, setNotices] = useState<OfficialNotice[]>([]);
  const [importantDates, setImportantDates] = useState<ImportantDate[]>([]);
  const [masterServices, setMasterServices] = useState<SupportService[]>([]);
  const [nearbyProviders, setNearbyProviders] = useState<(ServiceProvider & { distanceKm?: number })[]>([]);
  const [notifications, setNotifications] = useState<SupportNotification[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Geolocation State
  const [userCoords, setUserCoords] = useState<{ lat: number; lng: number }>({ lat: 13.1367, lng: 78.1292 });
  const [detectedLocation, setDetectedLocation] = useState<string>("Kolar Taluk, Kolar District, Karnataka");
  const [isLocating, setIsLocating] = useState<boolean>(false);

  // Modals State
  const [showUploadModal, setShowUploadModal] = useState<boolean>(false);
  const [showNewAppModal, setShowNewAppModal] = useState<boolean>(false);
  const [showNewRequestModal, setShowNewRequestModal] = useState<boolean>(false);
  const [showTimelineModal, setShowTimelineModal] = useState<SchemeApplication | null>(null);
  const [showFeedbackModal, setShowFeedbackModal] = useState<ServiceRequest | null>(null);
  const [showNotificationsModal, setShowNotificationsModal] = useState<boolean>(false);

  // Form: Upload Document
  const [docName, setDocName] = useState<string>("");
  const [docType, setDocType] = useState<DocumentType>("soil_report");
  const [docFarmId, setDocFarmId] = useState<string>("");
  const [selectedFileMock, setSelectedFileMock] = useState<{ name: string; size: number; type: string } | null>(null);

  // Form: Apply Scheme
  const [selectedSchemeId, setSelectedSchemeId] = useState<string>("");
  const [appRemarks, setAppRemarks] = useState<string>("");

  // Form: New Service Request
  const [reqServiceId, setReqServiceId] = useState<string>("soil_testing");
  const [reqDate, setReqDate] = useState<string>("2026-09-15");
  const [reqLocation, setReqLocation] = useState<string>("Sri Lakshmi Farm, Narasapura, Kolar");
  const [reqDescription, setReqDescription] = useState<string>("");
  const [reqPriority, setReqPriority] = useState<"LOW" | "NORMAL" | "HIGH" | "URGENT">("NORMAL");

  // Form: Feedback
  const [fbRating, setFbRating] = useState<number>(5);
  const [fbComments, setFbComments] = useState<string>("");

  // Rename Doc State
  const [renamingDocId, setRenamingDocId] = useState<string | null>(null);
  const [renamingDocNewName, setRenamingDocNewName] = useState<string>("");

  const currentUserId = user?.name ? `user_${user.name.toLowerCase().replace(/\s+/g, "_")}` : "user_farmer_default";

  // Translations Dictionary
  const t = useMemo(() => {
    return {
      en: {
        title: "Support Hub",
        subtitle: "Manage your agricultural services, documents and applications",
        overview: "Overview",
        documents: "Document Vault",
        applications: "Application Tracker",
        services: "Govt Services & Locator",
        requests: "Service Requests",
        notices: "Official Notices",
        dates: "Important Dates",
        benefits: "Benefits & Subsidies",
        profile: "Support Profile",
        noRecords: "No records yet",
        searchPlaceholder: "Search documents, applications, services, notices...",
        useCurrentLocation: "Use My Current Location",
        useFarmLocation: "Use My Farm Location",
        manualLocation: "Manual Location",
        uploadDocument: "Upload Document",
        applyScheme: "Apply for Scheme",
        requestService: "Request a Service",
        verified: "VERIFIED",
        emptyDocs: "No documents uploaded to your secure vault yet.",
        emptyApps: "No government scheme applications submitted yet.",
        emptyRequests: "No service requests created yet.",
        emptyNotices: "No verified notices available for your region at this time.",
        emptyDates: "No verified upcoming dates or deadlines.",
        emptyBenefits: "No approved benefits recorded yet. Submit scheme applications to track disbursals.",
      },
      kn: {
        title: "ಸಹಾಯ ಕೇಂದ್ರ",
        subtitle: "ನಿಮ್ಮ ಕೃಷಿ ಸೇವೆಗಳು, ದಾಖಲೆಗಳು ಮತ್ತು ಸರ್ಕಾರಿ ಅರ್ಜಿಗಳ ಸಮಗ್ರ ನಿರ್ವಹಣೆ",
        overview: "ಮುಖಪುಟ",
        documents: "ದಾಖಲೆಗಳ ಖಜಾನೆ",
        applications: "ಅರ್ಜಿಗಳ ಸ್ಥಿತಿ",
        services: "ಸರ್ಕಾರಿ ಸೇವೆಗಳು",
        requests: "ಸೇವಾ ವಿನಂತಿಗಳು",
        notices: "ಅಧಿಕೃತ ಸೂಚನೆಗಳು",
        dates: "ಪ್ರಮುಖ ದಿನಾಂಕಗಳು",
        benefits: "ಪ್ರಯೋಜನಗಳು",
        profile: "ಸಹಾಯ ವಿವರ",
        noRecords: "ಯಾವುದೇ ದಾಖಲೆಗಳಿಲ್ಲ",
        searchPlaceholder: "ದಾಖಲೆಗಳು, ಅರ್ಜಿಗಳು, ಸೇವೆಗಳು, ಸೂಚನೆಗಳನ್ನು ಹುಡುಕಿ...",
        useCurrentLocation: "ನನ್ನ ಪ್ರಸ್ತುತ ಸ್ಥಳ ಬಳಸಿ",
        useFarmLocation: "ನನ್ನ ಜಮೀನಿನ ಸ್ಥಳ ಬಳಸಿ",
        manualLocation: "ಸ್ಥಳವನ್ನು ನಮೂದಿಸಿ",
        uploadDocument: "ದಾಖಲೆ ಅಪ್ಲೋಡ್ ಮಾಡಿ",
        applyScheme: "ಯೋಜನೆಗೆ ಅರ್ಜಿ ಸಲ್ಲಿಸಿ",
        requestService: "ಸೇವೆಗೆ ವಿನಂತಿಸಿ",
        verified: "ಪ್ರಮಾಣೀಕೃತ",
        emptyDocs: "ನಿಮ್ಮ ಸುರಕ್ಷಿತ ಖಜಾನೆಯಲ್ಲಿ ಇನ್ನೂ ಯಾವುದೇ ದಾಖಲೆಗಳನ್ನು ಅಪ್ಲೋಡ್ ಮಾಡಲಾಗಿಲ್ಲ.",
        emptyApps: "ಇನ್ನೂ ಯಾವುದೇ ಸರ್ಕಾರಿ ಯೋಜನೆಗೆ ಅರ್ಜಿ ಸಲ್ಲಿಸಲಾಗಿಲ್ಲ.",
        emptyRequests: "ಯಾವುದೇ ಸೇವಾ ವಿನಂತಿಗಳನ್ನು ರಚಿಸಲಾಗಿಲ್ಲ.",
        emptyNotices: "ನಿಮ್ಮ ಪ್ರದೇಶಕ್ಕೆ ಸದ್ಯಕ್ಕೆ ಯಾವುದೇ ಹೊಸ ಅಧಿಕೃತ ಸೂಚನೆಗಳಿಲ್ಲ.",
        emptyDates: "ಯಾವುದೇ ಮುಂಬರುವ ಕೊನೆಯ ದಿನಾಂಕಗಳಿಲ್ಲ.",
        emptyBenefits: "ಯಾವುದೇ ಸಬ್ಸಿಡಿ ವಿವರಗಳಿಲ್ಲ. ಯೋಜನೆಗಳಿಗೆ ಅರ್ಜಿ ಸಲ್ಲಿಸಿ ಇಲ್ಲಿ ಪರಿಶೀಲಿಸಿ.",
      },
    }[lang];
  }, [lang]);

  // Load All Support Hub Data
  const loadSupportData = useCallback(async () => {
    setIsLoading(true);
    try {
      // 1. Dashboard summary
      const sumRes = await fetch(`/api/support/dashboard?userId=${currentUserId}`);
      const sumJson = await sumRes.json();
      if (sumJson.success) setDashboardSummary(sumJson.data);

      // 2. Documents
      const docsRes = await fetch(`/api/support/documents?userId=${currentUserId}`);
      const docsJson = await docsRes.json();
      if (docsJson.success) setDocuments(docsJson.data);

      // 3. Applications
      const appsRes = await fetch(`/api/support/applications?userId=${currentUserId}`);
      const appsJson = await appsRes.json();
      if (appsJson.success) setApplications(appsJson.data);

      // 4. Benefits
      const benRes = await fetch(`/api/support/benefits?userId=${currentUserId}`);
      const benJson = await benRes.json();
      if (benJson.success) setBenefits(benJson.data);

      // 5. Service requests
      const reqRes = await fetch(`/api/support/service-requests?userId=${currentUserId}`);
      const reqJson = await reqRes.json();
      if (reqJson.success) setServiceRequests(reqJson.data);

      // 6. Notices
      const notRes = await fetch(`/api/support/notices?district=Kolar`);
      const notJson = await notRes.json();
      if (notJson.success) setNotices(notJson.data);

      // 7. Important Dates
      const dateRes = await fetch(`/api/support/important-dates`);
      const dateJson = await dateRes.json();
      if (dateJson.success) setImportantDates(dateJson.data);

      // 8. Master Services & Nearby Providers
      const servRes = await fetch(`/api/support/services`);
      const servJson = await servRes.json();
      if (servJson.success) {
        setMasterServices(servJson.data.services || []);
      }

      // 9. Nearby services by GPS
      const nearRes = await fetch(`/api/support/services/nearby?lat=${userCoords.lat}&lng=${userCoords.lng}`);
      const nearJson = await nearRes.json();
      if (nearJson.success) {
        setNearbyProviders(nearJson.data || []);
        if (nearJson.userLocation?.formattedAddress) {
          setDetectedLocation(nearJson.userLocation.formattedAddress);
        }
      }

      // 10. Notifications
      const notifRes = await fetch(`/api/support/notifications?userId=${currentUserId}`);
      const notifJson = await notifRes.json();
      if (notifJson.success) setNotifications(notifJson.data);
    } catch (err) {
      console.warn("Support data load notice:", err);
    } finally {
      setIsLoading(false);
    }
  }, [currentUserId, userCoords.lat, userCoords.lng]);

  useEffect(() => {
    loadSupportData();
  }, [loadSupportData]);

  // Geolocation Handler
  const handleDetectLocation = () => {
    if (!navigator.geolocation) {
      showToast("Geolocation Unavailable", "Browser geolocation is not supported on this device.", "warning");
      return;
    }

    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        setUserCoords({ lat, lng });

        try {
          const res = await fetch(`/api/support/services/nearby?lat=${lat}&lng=${lng}`);
          const json = await res.json();
          if (json.success) {
            setNearbyProviders(json.data);
            if (json.userLocation?.formattedAddress) {
              setDetectedLocation(json.userLocation.formattedAddress);
            }
            showToast("GPS Location Resolved", `Nearby verified services updated for ${json.userLocation?.district || "your region"}.`, "success");
          }
        } catch {
          showToast("Location Detected", "Coordinates updated.", "info");
        } finally {
          setIsLocating(false);
        }
      },
      (err) => {
        setIsLocating(false);
        showToast("Location Permission Denied", "Using saved farm location (Kolar, Karnataka).", "info");
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  // Upload Document Handler
  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!docName.trim()) {
      showToast("Error", "Please enter a document name.", "warning");
      return;
    }

    try {
      const res = await fetch(`/api/support/documents`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: currentUserId,
          document_name: docName,
          document_type: docType,
          farm_id: docFarmId || (activeFarm?.id ? activeFarm.id : null),
          file_size: selectedFileMock?.size || 1024 * 140,
          mime_type: selectedFileMock?.type || "application/pdf",
        }),
      });

      const json = await res.json();
      if (json.success) {
        showToast("Document Secured in Vault", `${json.data.document_name} encrypted and stored in private vault.`, "success");
        setShowUploadModal(false);
        setDocName("");
        setSelectedFileMock(null);
        loadSupportData();
      }
    } catch {
      showToast("Upload Failed", "Could not complete document upload.", "alert");
    }
  };

  // Rename Document Handler
  const handleRenameSubmit = async (docId: string) => {
    if (!renamingDocNewName.trim()) return;
    try {
      const res = await fetch(`/api/support/documents/${docId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: currentUserId, newName: renamingDocNewName }),
      });
      const json = await res.json();
      if (json.success) {
        showToast("Document Renamed", "Updated document name.", "success");
        setRenamingDocId(null);
        setRenamingDocNewName("");
        loadSupportData();
      }
    } catch {
      showToast("Error", "Failed to rename document.", "alert");
    }
  };

  // Delete Document Handler
  const handleDeleteDoc = async (docId: string, docName: string) => {
    if (!confirm(`Are you sure you want to delete ${docName}?`)) return;
    try {
      const res = await fetch(`/api/support/documents/${docId}?userId=${currentUserId}`, {
        method: "DELETE",
      });
      const json = await res.json();
      if (json.success) {
        showToast("Document Deleted", `${docName} removed from vault.`, "info");
        loadSupportData();
      }
    } catch {
      showToast("Error", "Failed to delete document.", "alert");
    }
  };

  // Submit Scheme Application
  const handleApplySchemeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const scheme = DEMO_SCHEMES.find((s) => s.id === selectedSchemeId);
    if (!scheme) {
      showToast("Select Scheme", "Please choose a verified government scheme.", "warning");
      return;
    }

    try {
      const res = await fetch(`/api/support/applications`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: currentUserId,
          scheme_id: scheme.id,
          scheme_name: scheme.title,
          farm_id: activeFarm?.id || null,
          remarks: appRemarks || "Submitted via KrishiMitra Support Hub",
          documents: documents.map((d) => d.file_path),
        }),
      });

      const json = await res.json();
      if (json.success) {
        try {
          confetti({ particleCount: 70, spread: 70, origin: { y: 0.6 } });
        } catch {}

        showToast(
          "Application Submitted! 🏛️",
          `Application Reference: ${json.data.application_reference_number}. Transmitted to Agriculture Directorate.`,
          "success"
        );
        setShowNewAppModal(false);
        setSelectedSchemeId("");
        setAppRemarks("");
        loadSupportData();
      }
    } catch {
      showToast("Error", "Failed to submit scheme application.", "alert");
    }
  };

  // Submit Service Request
  const handleServiceRequestSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const serv = masterServices.find((s) => s.id === reqServiceId) || masterServices[0];

    try {
      const res = await fetch(`/api/support/service-requests`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: currentUserId,
          farm_id: activeFarm?.id || null,
          farm_name: activeFarm?.name || "Sri Lakshmi Farm - Plot 1",
          service_id: serv?.id || "soil_testing",
          service_name: serv?.name || "Official Soil Testing",
          location: reqLocation,
          latitude: userCoords.lat,
          longitude: userCoords.lng,
          requested_date: reqDate,
          description: reqDescription || "Request for agricultural extension service",
          priority: reqPriority,
        }),
      });

      const json = await res.json();
      if (json.success) {
        showToast("Service Request Placed! 🚜", `Request ID: ${json.data.id}. Notified local extension office.`, "success");
        setShowNewRequestModal(false);
        setReqDescription("");
        loadSupportData();
      }
    } catch {
      showToast("Error", "Failed to place service request.", "alert");
    }
  };

  // Submit Service Feedback
  const handleFeedbackSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!showFeedbackModal) return;

    try {
      const res = await fetch(`/api/support/feedback`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: currentUserId,
          request_id: showFeedbackModal.id,
          provider_id: showFeedbackModal.provider_id || "prov_kolar_ada",
          rating: fbRating,
          feedback: fbComments,
        }),
      });

      const json = await res.json();
      if (json.success) {
        showToast("Feedback Submitted", "Thank you! Your verified rating helps improve agricultural extension.", "success");
        setShowFeedbackModal(null);
        setFbComments("");
        setFbRating(5);
      }
    } catch {
      showToast("Error", "Failed to submit feedback.", "alert");
    }
  };

  // Mark notification read
  const handleMarkNotifRead = async (notifId: string) => {
    await fetch(`/api/support/notifications/${notifId}/read?userId=${currentUserId}`, { method: "PATCH" });
    setNotifications((prev) => prev.map((n) => (n.id === notifId ? { ...n, is_read: true } : n)));
  };

  // Filtered Documents
  const filteredDocuments = useMemo(() => {
    return documents.filter((d) => {
      const matchSearch =
        d.document_name.toLowerCase().includes(globalSearch.toLowerCase()) ||
        d.document_type.toLowerCase().includes(globalSearch.toLowerCase());
      const matchCat =
        selectedCategoryFilter === "All" || d.document_type.toLowerCase() === selectedCategoryFilter.toLowerCase();
      return matchSearch && matchCat;
    });
  }, [documents, globalSearch, selectedCategoryFilter]);

  return (
    <div className="min-h-screen flex bg-transparent text-white">
      {/* Sidebar */}
      <div className="hidden lg:block w-64 shrink-0">
        <div className="fixed top-16 bottom-0 w-64">
          <FarmerSidebar />
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
        
        {/* ============================================================ */}
        {/* TOP HEADER & BILINGUAL CONTROLS */}
        {/* ============================================================ */}
        <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-emerald-950/80 via-black/85 to-teal-950/80 backdrop-blur-xl border border-emerald-500/30 shadow-2xl relative overflow-hidden">
          <div className="absolute -right-12 -bottom-12 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 text-xs font-bold">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-300" />
                <span>Farmer Support Hub • ರೈತ ಸಹಾಯ ಕೇಂದ್ರ</span>
                <span className="text-emerald-400">•</span>
                <span className="text-amber-300">Section 33 & 41 Compliant</span>
              </div>

              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black font-title tracking-tight text-white drop-shadow-md flex items-center gap-3">
                <span>{t.title}</span>
                <span className="text-sm sm:text-base font-normal px-3 py-0.5 rounded-xl bg-white/10 text-emerald-200 border border-white/15">
                  {lang === "en" ? "ರೈತ ಸೇವೆಗಳು" : "Farmer Services"}
                </span>
              </h1>

              <p className="text-xs sm:text-sm text-neutral-300 max-w-2xl leading-relaxed">
                {t.subtitle}
              </p>
            </div>

            {/* Action Bar: Language Toggle, Notifications & New Actions */}
            <div className="flex items-center gap-3 shrink-0 flex-wrap">
              
              {/* Language Switcher */}
              <div className="flex items-center p-1 rounded-xl bg-black/60 border border-white/20">
                <button
                  onClick={() => setLang("en")}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    lang === "en" ? "bg-emerald-500 text-white shadow-md" : "text-neutral-300 hover:text-white"
                  }`}
                >
                  English
                </button>
                <button
                  onClick={() => setLang("kn")}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    lang === "kn" ? "bg-emerald-500 text-white shadow-md" : "text-neutral-300 hover:text-white"
                  }`}
                >
                  ಕನ್ನಡ
                </button>
              </div>

              {/* Notification Bell */}
              <button
                onClick={() => setShowNotificationsModal(true)}
                className="relative p-2.5 rounded-xl bg-black/60 border border-white/20 hover:bg-white/10 text-white transition-colors cursor-pointer"
                title="Support Notifications"
              >
                <Bell className="w-4 h-4 text-amber-300" />
                {notifications.filter((n) => !n.is_read).length > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-500 text-white text-[9px] font-black flex items-center justify-center animate-pulse">
                    {notifications.filter((n) => !n.is_read).length}
                  </span>
                )}
              </button>

              {/* Quick Action Button */}
              <button
                onClick={() => setShowUploadModal(true)}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-bold text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-emerald-500/20 transition-all cursor-pointer"
              >
                <Upload className="w-4 h-4" />
                <span>{t.uploadDocument}</span>
              </button>
            </div>
          </div>

          {/* Location Bar */}
          <div className="mt-6 pt-4 border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2 text-neutral-300">
              <MapPin className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Location Context: <strong>{detectedLocation}</strong></span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleDetectLocation}
                disabled={isLocating}
                className="px-3 py-1 rounded-lg bg-white/10 hover:bg-white/20 border border-white/15 text-emerald-300 font-bold flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50"
              >
                <Navigation className={`w-3.5 h-3.5 ${isLocating ? "animate-spin" : ""}`} />
                <span>{isLocating ? "Locating..." : t.useCurrentLocation}</span>
              </button>
            </div>
          </div>
        </div>

        {/* ============================================================ */}
        {/* GLOBAL SEARCH & HORIZONTAL TAB NAVIGATOR */}
        {/* ============================================================ */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row items-center gap-3 justify-between">
            
            {/* Search Bar */}
            <div className="relative w-full sm:w-96">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
              <input
                type="text"
                value={globalSearch}
                onChange={(e) => setGlobalSearch(e.target.value)}
                placeholder={t.searchPlaceholder}
                className="w-full pl-10 pr-4 py-2 rounded-xl bg-black/50 border border-white/20 text-xs sm:text-sm text-white placeholder-neutral-400 focus:outline-none focus:border-emerald-400 transition-colors"
              />
            </div>

            {/* Quick Actions */}
            <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
              <button
                onClick={() => setShowNewAppModal(true)}
                className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/15 border border-white/20 text-white text-xs font-bold flex items-center gap-1.5 shrink-0 cursor-pointer"
              >
                <FileCheck2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>{t.applyScheme}</span>
              </button>

              <button
                onClick={() => setShowNewRequestModal(true)}
                className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/15 border border-white/20 text-white text-xs font-bold flex items-center gap-1.5 shrink-0 cursor-pointer"
              >
                <Tractor className="w-3.5 h-3.5 text-amber-400" />
                <span>{t.requestService}</span>
              </button>
            </div>
          </div>

          {/* Tab Navigation Pill Bar */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {[
              { id: "overview", label: t.overview, icon: HelpCircle },
              { id: "documents", label: t.documents, icon: FileText, count: documents.length },
              { id: "applications", label: t.applications, icon: FileCheck2, count: applications.length },
              { id: "services", label: t.services, icon: Landmark, count: nearbyProviders.length },
              { id: "requests", label: t.requests, icon: Tractor, count: serviceRequests.length },
              { id: "notices", label: t.notices, icon: Bell, count: notices.length },
              { id: "dates", label: t.dates, icon: Calendar, count: importantDates.length },
              { id: "benefits", label: t.benefits, icon: DollarSign, count: benefits.length },
              { id: "profile", label: t.profile, icon: User },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`px-4 py-2 rounded-2xl text-xs sm:text-sm font-bold flex items-center gap-2 shrink-0 transition-all cursor-pointer ${
                    isActive
                      ? "bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-md shadow-emerald-500/20"
                      : "bg-black/40 border border-white/15 text-neutral-300 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                  {typeof tab.count === "number" && tab.count > 0 && (
                    <span className="px-1.5 py-0.2 rounded-full bg-white/20 text-[10px] font-black">
                      {tab.count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* ============================================================ */}
        {/* TAB 1: OVERVIEW DASHBOARD (10 Core Pillar Cards) */}
        {/* ============================================================ */}
        {activeTab === "overview" && (
          <div className="space-y-6">
            
            {/* 10 Core Pillar Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              
              {/* 1. Document Vault */}
              <div
                onClick={() => setActiveTab("documents")}
                className="p-5 rounded-3xl bg-black/50 backdrop-blur-xl border border-white/15 hover:border-emerald-400/50 transition-all cursor-pointer group shadow-xl flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 flex items-center justify-center">
                      <FileText className="w-5 h-5" />
                    </div>
                    {documents.length > 0 ? (
                      <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-bold">
                        {documents.length} Files
                      </span>
                    ) : (
                      <span className="text-[11px] text-neutral-400 italic">{t.noRecords}</span>
                    )}
                  </div>

                  <div>
                    <h3 className="font-bold text-base text-white group-hover:text-emerald-300 transition-colors">
                      {lang === "en" ? "1. Secure Document Vault" : "1. ಸುರಕ್ಷಿತ ದಾಖಲೆಗಳ ಖಜಾನೆ"}
                    </h3>
                    <p className="text-xs text-neutral-300 mt-1">
                      Private storage for Soil Test Reports, RTC Land records, crop records, and insurance certificates.
                    </p>
                  </div>
                </div>

                <div className="pt-4 border-t border-white/10 mt-4 flex items-center justify-between text-xs text-emerald-400 font-bold">
                  <span>Manage Documents</span>
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>

              {/* 2. Govt Services & Locator */}
              <div
                onClick={() => setActiveTab("services")}
                className="p-5 rounded-3xl bg-black/50 backdrop-blur-xl border border-white/15 hover:border-emerald-400/50 transition-all cursor-pointer group shadow-xl flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 rounded-2xl bg-teal-500/20 border border-teal-400/40 text-teal-300 flex items-center justify-center">
                      <Landmark className="w-5 h-5" />
                    </div>
                    <span className="px-2.5 py-1 rounded-full bg-teal-500/20 text-teal-300 border border-teal-500/30 text-xs font-bold">
                      {nearbyProviders.length} Verified
                    </span>
                  </div>

                  <div>
                    <h3 className="font-bold text-base text-white group-hover:text-teal-300 transition-colors">
                      {lang === "en" ? "2. Government Services Locator" : "2. ಸರ್ಕಾರಿ ಸೇವಾ ಕೇಂದ್ರಗಳು"}
                    </h3>
                    <p className="text-xs text-neutral-300 mt-1">
                      Find verified Assistant Director of Agriculture offices, Soil Labs, RSKs, APMC Mandis, and KVKs.
                    </p>
                  </div>
                </div>

                <div className="pt-4 border-t border-white/10 mt-4 flex items-center justify-between text-xs text-teal-400 font-bold">
                  <span>Locate Services</span>
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>

              {/* 3. Application Tracker */}
              <div
                onClick={() => setActiveTab("applications")}
                className="p-5 rounded-3xl bg-black/50 backdrop-blur-xl border border-white/15 hover:border-emerald-400/50 transition-all cursor-pointer group shadow-xl flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 rounded-2xl bg-cyan-500/20 border border-cyan-400/40 text-cyan-300 flex items-center justify-center">
                      <FileCheck2 className="w-5 h-5" />
                    </div>
                    {applications.length > 0 ? (
                      <span className="px-2.5 py-1 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-xs font-bold">
                        {applications.length} Active
                      </span>
                    ) : (
                      <span className="text-[11px] text-neutral-400 italic">{t.noRecords}</span>
                    )}
                  </div>

                  <div>
                    <h3 className="font-bold text-base text-white group-hover:text-cyan-300 transition-colors">
                      {lang === "en" ? "3. Scheme Application Tracker" : "3. ಸರ್ಕಾರಿ ಅರ್ಜಿಗಳ ಸ್ಥಿತಿ"}
                    </h3>
                    <p className="text-xs text-neutral-300 mt-1">
                      Real-time multi-stage visual timeline for PM-KISAN, PMKSY drip subsidy, and state schemes.
                    </p>
                  </div>
                </div>

                <div className="pt-4 border-t border-white/10 mt-4 flex items-center justify-between text-xs text-cyan-400 font-bold">
                  <span>Track Applications</span>
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>

              {/* 4. Benefits & Subsidies */}
              <div
                onClick={() => setActiveTab("benefits")}
                className="p-5 rounded-3xl bg-black/50 backdrop-blur-xl border border-white/15 hover:border-emerald-400/50 transition-all cursor-pointer group shadow-xl flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-400/40 text-amber-300 flex items-center justify-center">
                      <DollarSign className="w-5 h-5" />
                    </div>
                    {benefits.length > 0 ? (
                      <span className="px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-bold">
                        {benefits.length} Benefits
                      </span>
                    ) : (
                      <span className="text-[11px] text-neutral-400 italic">{t.noRecords}</span>
                    )}
                  </div>

                  <div>
                    <h3 className="font-bold text-base text-white group-hover:text-amber-300 transition-colors">
                      {lang === "en" ? "4. Benefits & Subsidy Tracker" : "4. ಸಬ್ಸಿಡಿ ಮತ್ತು ಪರಿಹಾರ ಖಾತೆ"}
                    </h3>
                    <p className="text-xs text-neutral-300 mt-1">
                      Direct tracking of DBT approvals, subsidy sanction letters, and DBT bank account credits.
                    </p>
                  </div>
                </div>

                <div className="pt-4 border-t border-white/10 mt-4 flex items-center justify-between text-xs text-amber-400 font-bold">
                  <span>View Benefits</span>
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>

              {/* 5. Official Farmer Notices */}
              <div
                onClick={() => setActiveTab("notices")}
                className="p-5 rounded-3xl bg-black/50 backdrop-blur-xl border border-white/15 hover:border-emerald-400/50 transition-all cursor-pointer group shadow-xl flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 rounded-2xl bg-purple-500/20 border border-purple-400/40 text-purple-300 flex items-center justify-center">
                      <Bell className="w-5 h-5" />
                    </div>
                    {notices.length > 0 ? (
                      <span className="px-2.5 py-1 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30 text-xs font-bold">
                        {notices.length} Verified
                      </span>
                    ) : (
                      <span className="text-[11px] text-neutral-400 italic">{t.noRecords}</span>
                    )}
                  </div>

                  <div>
                    <h3 className="font-bold text-base text-white group-hover:text-purple-300 transition-colors">
                      {lang === "en" ? "5. Official Farmer Notices" : "5. ಅಧಿಕೃತ ಸರ್ಕಾರಿ ಪ್ರಕಟಣೆಗಳು"}
                    </h3>
                    <p className="text-xs text-neutral-300 mt-1">
                      Grounded government advisories, IMD meteorological notices, and district agricultural orders.
                    </p>
                  </div>
                </div>

                <div className="pt-4 border-t border-white/10 mt-4 flex items-center justify-between text-xs text-purple-400 font-bold">
                  <span>Read Notices</span>
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>

              {/* 6. Agricultural Important Dates */}
              <div
                onClick={() => setActiveTab("dates")}
                className="p-5 rounded-3xl bg-black/50 backdrop-blur-xl border border-white/15 hover:border-emerald-400/50 transition-all cursor-pointer group shadow-xl flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 rounded-2xl bg-rose-500/20 border border-rose-400/40 text-rose-300 flex items-center justify-center">
                      <Calendar className="w-5 h-5" />
                    </div>
                    {importantDates.length > 0 ? (
                      <span className="px-2.5 py-1 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30 text-xs font-bold">
                        {importantDates.length} Deadlines
                      </span>
                    ) : (
                      <span className="text-[11px] text-neutral-400 italic">{t.noRecords}</span>
                    )}
                  </div>

                  <div>
                    <h3 className="font-bold text-base text-white group-hover:text-rose-300 transition-colors">
                      {lang === "en" ? "6. Important Dates & Deadlines" : "6. ಕೃಷಿ ಪ್ರಮುಖ ದಿನಾಂಕಗಳು"}
                    </h3>
                    <p className="text-xs text-neutral-300 mt-1">
                      Cut-off dates for PMFBY crop insurance enrollment, PM-KISAN eKYC, and soil health camps.
                    </p>
                  </div>
                </div>

                <div className="pt-4 border-t border-white/10 mt-4 flex items-center justify-between text-xs text-rose-400 font-bold">
                  <span>View Deadlines</span>
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>

              {/* 7. Service Requests */}
              <div
                onClick={() => setActiveTab("requests")}
                className="p-5 rounded-3xl bg-black/50 backdrop-blur-xl border border-white/15 hover:border-emerald-400/50 transition-all cursor-pointer group shadow-xl flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 rounded-2xl bg-brand-500/20 border border-brand-400/40 text-brand-300 flex items-center justify-center">
                      <Tractor className="w-5 h-5" />
                    </div>
                    {serviceRequests.length > 0 ? (
                      <span className="px-2.5 py-1 rounded-full bg-brand-500/20 text-brand-300 border border-brand-500/30 text-xs font-bold">
                        {serviceRequests.length} Requests
                      </span>
                    ) : (
                      <span className="text-[11px] text-neutral-400 italic">{t.noRecords}</span>
                    )}
                  </div>

                  <div>
                    <h3 className="font-bold text-base text-white group-hover:text-emerald-300 transition-colors">
                      {lang === "en" ? "7. Agricultural Service Requests" : "7. ಕೃಷಿ ಸೇವಾ ವಿನಂತಿಗಳು"}
                    </h3>
                    <p className="text-xs text-neutral-300 mt-1">
                      Direct request placement for Soil Testing, CHC machinery, transport, and extension agronomists.
                    </p>
                  </div>
                </div>

                <div className="pt-4 border-t border-white/10 mt-4 flex items-center justify-between text-xs text-brand-400 font-bold">
                  <span>Manage Requests</span>
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>

              {/* 8. My Support Profile */}
              <div
                onClick={() => setActiveTab("profile")}
                className="p-5 rounded-3xl bg-black/50 backdrop-blur-xl border border-white/15 hover:border-emerald-400/50 transition-all cursor-pointer group shadow-xl flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 rounded-2xl bg-indigo-500/20 border border-indigo-400/40 text-indigo-300 flex items-center justify-center">
                      <User className="w-5 h-5" />
                    </div>
                    <span className="px-2.5 py-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-xs font-bold">
                      Active
                    </span>
                  </div>

                  <div>
                    <h3 className="font-bold text-base text-white group-hover:text-indigo-300 transition-colors">
                      {lang === "en" ? "8. My Support Profile" : "8. ನನ್ನ ಸಹಾಯ ವಿವರ"}
                    </h3>
                    <p className="text-xs text-neutral-300 mt-1">
                      Farmer verification status, registered land records linkage, and language preferences.
                    </p>
                  </div>
                </div>

                <div className="pt-4 border-t border-white/10 mt-4 flex items-center justify-between text-xs text-indigo-400 font-bold">
                  <span>View Profile</span>
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>

              {/* 9. Administration & Verification (Admin Quick Link) */}
              <div className="p-5 rounded-3xl bg-gradient-to-br from-neutral-900 via-black to-neutral-950 border border-white/15 hover:border-amber-400/50 transition-all shadow-xl flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-400/40 text-amber-300 flex items-center justify-center">
                      <Shield className="w-5 h-5" />
                    </div>
                    <span className="px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-bold">
                      Governance
                    </span>
                  </div>

                  <div>
                    <h3 className="font-bold text-base text-white">
                      {lang === "en" ? "Admin Support Management" : "ಆಡಳಿತ ಮತ್ತು ಪರಿಶೀಲನೆ"}
                    </h3>
                    <p className="text-xs text-neutral-300 mt-1">
                      Agriculture Directorate portal for provider verification, official notices, and audit logging.
                    </p>
                  </div>
                </div>

                <Link
                  href="/admin/support"
                  className="pt-4 border-t border-white/10 mt-4 flex items-center justify-between text-xs text-amber-400 font-bold hover:underline"
                >
                  <span>Open Admin Portal</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>

            </div>

          </div>
        )}

        {/* ============================================================ */}
        {/* TAB 2: SECURE DOCUMENT VAULT */}
        {/* ============================================================ */}
        {activeTab === "documents" && (
          <div className="space-y-6">
            <div className="p-6 rounded-3xl bg-black/50 backdrop-blur-xl border border-white/15 shadow-xl space-y-4">
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="font-bold text-lg text-white flex items-center gap-2">
                    <FileText className="w-5 h-5 text-emerald-400" />
                    <span>{lang === "en" ? "Secure Farmer Document Vault" : "ಸುರಕ್ಷಿತ ಕೃಷಿ ದಾಖಲೆಗಳ ಖಜಾನೆ"}</span>
                  </h3>
                  <p className="text-xs text-neutral-300">
                    Private storage encrypted with authenticated user isolation. Documents are never exposed publicly.
                  </p>
                </div>

                <button
                  onClick={() => setShowUploadModal(true)}
                  className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs flex items-center gap-1.5 shadow-lg shadow-emerald-500/20 transition-all cursor-pointer w-fit"
                >
                  <Upload className="w-4 h-4" />
                  <span>Upload Document</span>
                </button>
              </div>

              {/* Document Type Filter Tabs */}
              <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none text-xs">
                {[
                  { id: "All", label: "All Documents" },
                  { id: "soil_report", label: "Soil Test Reports" },
                  { id: "land_record_rtc", label: "RTC / Pahani" },
                  { id: "crop_record", label: "Crop Records" },
                  { id: "insurance_policy", label: "Insurance Policies" },
                  { id: "scheme_doc", label: "Scheme Dossiers" },
                  { id: "receipt_invoice", label: "Receipts & Invoices" },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setSelectedCategoryFilter(item.id)}
                    className={`px-3 py-1.5 rounded-xl font-semibold shrink-0 transition-colors cursor-pointer ${
                      selectedCategoryFilter === item.id
                        ? "bg-emerald-500 text-white shadow-md font-bold"
                        : "bg-white/5 border border-white/10 text-neutral-300 hover:bg-white/10"
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>

              {/* Documents List or Clean Empty State */}
              {filteredDocuments.length === 0 ? (
                <div className="p-12 text-center rounded-2xl bg-black/40 border border-white/10 space-y-3">
                  <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 text-neutral-400 flex items-center justify-center mx-auto">
                    <FileText className="w-7 h-7 text-neutral-400" />
                  </div>
                  <h4 className="font-bold text-base text-white">{t.noRecords}</h4>
                  <p className="text-xs text-neutral-400 max-w-md mx-auto">
                    {t.emptyDocs}
                  </p>
                  <button
                    onClick={() => setShowUploadModal(true)}
                    className="px-4 py-2 rounded-xl bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 hover:bg-emerald-500/30 text-xs font-bold transition-colors cursor-pointer"
                  >
                    + Add First Document
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {filteredDocuments.map((doc) => (
                    <div
                      key={doc.id}
                      className="p-4 rounded-2xl bg-white/5 border border-white/10 hover:border-emerald-400/40 transition-all space-y-3"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 flex items-center justify-center shrink-0">
                            <FileText className="w-5 h-5" />
                          </div>
                          <div className="min-w-0">
                            {renamingDocId === doc.id ? (
                              <div className="flex items-center gap-2">
                                <input
                                  type="text"
                                  value={renamingDocNewName}
                                  onChange={(e) => setRenamingDocNewName(e.target.value)}
                                  className="px-2 py-1 rounded bg-black/80 border border-emerald-400 text-xs text-white"
                                />
                                <button
                                  onClick={() => handleRenameSubmit(doc.id)}
                                  className="px-2 py-1 rounded bg-emerald-500 text-white text-[10px] font-bold"
                                >
                                  Save
                                </button>
                                <button
                                  onClick={() => setRenamingDocId(null)}
                                  className="px-2 py-1 rounded bg-white/10 text-neutral-300 text-[10px]"
                                >
                                  Cancel
                                </button>
                              </div>
                            ) : (
                              <h4 className="font-bold text-sm text-white truncate">{doc.document_name}</h4>
                            )}
                            <span className="text-[10px] text-neutral-400 block uppercase font-mono mt-0.5">
                              {doc.document_type.replace(/_/g, " ")} • {(doc.file_size / 1024).toFixed(1)} KB
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-1.5 shrink-0">
                          <button
                            onClick={() => {
                              showToast("Document Preview", `Viewing verified copy of ${doc.document_name}`, "info");
                            }}
                            className="p-1.5 rounded-lg bg-white/5 hover:bg-white/15 text-neutral-300 hover:text-white transition-colors cursor-pointer"
                            title="View Document"
                          >
                            <Eye className="w-4 h-4" />
                          </button>

                          <button
                            onClick={() => {
                              showToast("Document Download", `Downloading ${doc.document_name}...`, "success");
                            }}
                            className="p-1.5 rounded-lg bg-white/5 hover:bg-white/15 text-neutral-300 hover:text-white transition-colors cursor-pointer"
                            title="Download Signed Copy"
                          >
                            <Download className="w-4 h-4 text-emerald-400" />
                          </button>

                          <button
                            onClick={() => {
                              setRenamingDocId(doc.id);
                              setRenamingDocNewName(doc.document_name);
                            }}
                            className="p-1.5 rounded-lg bg-white/5 hover:bg-white/15 text-neutral-300 hover:text-white transition-colors cursor-pointer"
                            title="Rename"
                          >
                            <Edit3 className="w-4 h-4 text-amber-300" />
                          </button>

                          <button
                            onClick={() => handleDeleteDoc(doc.id, doc.document_name)}
                            className="p-1.5 rounded-lg bg-white/5 hover:bg-red-500/20 text-neutral-300 hover:text-red-400 transition-colors cursor-pointer"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4 text-red-400" />
                          </button>
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-[11px] text-neutral-400 pt-2 border-t border-white/5">
                        <span>Uploaded: {doc.uploaded_at.split("T")[0]}</span>
                        <span className="text-emerald-400 font-bold">✓ Private & Verified</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}

            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* TAB 3: GOVERNMENT SCHEME APPLICATION TRACKER */}
        {/* ============================================================ */}
        {activeTab === "applications" && (
          <div className="space-y-6">
            <div className="p-6 rounded-3xl bg-black/50 backdrop-blur-xl border border-white/15 shadow-xl space-y-4">
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="font-bold text-lg text-white flex items-center gap-2">
                    <FileCheck2 className="w-5 h-5 text-cyan-400" />
                    <span>{lang === "en" ? "Government Scheme Application Tracker" : "ಸರ್ಕಾರಿ ಯೋಜನೆಗಳ ಅರ್ಜಿ ಸ್ಥಿತಿ"}</span>
                  </h3>
                  <p className="text-xs text-neutral-300">
                    Track the real-time progress of your applications submitted to Central & Karnataka state agriculture directorate.
                  </p>
                </div>

                <button
                  onClick={() => setShowNewAppModal(true)}
                  className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-lg shadow-cyan-600/20 transition-all cursor-pointer w-fit"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>Apply for New Scheme</span>
                </button>
              </div>

              {/* Applications List or Clean Empty State */}
              {applications.length === 0 ? (
                <div className="p-12 text-center rounded-2xl bg-black/40 border border-white/10 space-y-3">
                  <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 text-neutral-400 flex items-center justify-center mx-auto">
                    <FileCheck2 className="w-7 h-7 text-neutral-400" />
                  </div>
                  <h4 className="font-bold text-base text-white">{t.noRecords}</h4>
                  <p className="text-xs text-neutral-400 max-w-md mx-auto">
                    {t.emptyApps}
                  </p>
                  <button
                    onClick={() => setShowNewAppModal(true)}
                    className="px-4 py-2 rounded-xl bg-cyan-500/20 border border-cyan-400/40 text-cyan-300 hover:bg-cyan-500/30 text-xs font-bold transition-colors cursor-pointer"
                  >
                    + Submit First Scheme Application
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {applications.map((app) => (
                    <div
                      key={app.id}
                      className="p-5 rounded-3xl bg-white/5 border border-white/10 hover:border-cyan-400/40 transition-all shadow-md flex flex-col md:flex-row md:items-center justify-between gap-6"
                    >
                      <div className="space-y-2.5">
                        <div className="flex items-center gap-2.5 flex-wrap">
                          <span className="font-mono text-xs font-bold px-2.5 py-0.5 rounded-md bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                            {app.application_reference_number}
                          </span>

                          <span
                            className={`px-2.5 py-0.5 rounded-md text-xs font-bold ${
                              app.status === "APPROVED"
                                ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                                : app.status === "DOCUMENT_REQUIRED"
                                ? "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                                : "bg-cyan-500/20 text-cyan-300 border border-cyan-500/30"
                            }`}
                          >
                            ● {app.status.replace(/_/g, " ")}
                          </span>

                          <span className="text-xs text-neutral-400">
                            Submitted: {app.submission_date}
                          </span>
                        </div>

                        <div>
                          <h4 className="font-bold text-base text-white">{app.scheme_name}</h4>
                          {app.required_action && (
                            <p className="text-xs text-amber-300 mt-1 flex items-center gap-1.5">
                              <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                              <span>{app.required_action}</span>
                            </p>
                          )}
                        </div>

                        <div className="text-xs text-neutral-400">
                          Last Updated: {app.last_updated.split("T")[0]} • Remarks: {app.remarks || "Under review"}
                        </div>
                      </div>

                      {/* Right Action: Timeline Trigger */}
                      <button
                        onClick={() => setShowTimelineModal(app)}
                        className="px-4 py-2 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-400/40 text-cyan-300 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer shrink-0 w-fit"
                      >
                        <Clock className="w-4 h-4" />
                        <span>View Visual Timeline</span>
                      </button>
                    </div>
                  ))}
                </div>
              )}

            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* TAB 4: GOVERNMENT SERVICES & SERVICE LOCATOR */}
        {/* ============================================================ */}
        {activeTab === "services" && (
          <div className="space-y-6">
            <div className="p-6 rounded-3xl bg-black/50 backdrop-blur-xl border border-white/15 shadow-xl space-y-6">
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="font-bold text-lg text-white flex items-center gap-2">
                    <Landmark className="w-5 h-5 text-teal-400" />
                    <span>{lang === "en" ? "Verified Government & Extension Services Locator" : "ಸರ್ಕಾರಿ ಮತ್ತು ವಿಸ್ತರಣಾ ಸೇವಾ ಕೇಂದ್ರಗಳ ಶೋಧಕ"}</span>
                  </h3>
                  <p className="text-xs text-neutral-300">
                    Official agricultural centers verified by Karnataka Department of Agriculture with verified contact numbers.
                  </p>
                </div>

                <button
                  onClick={handleDetectLocation}
                  disabled={isLocating}
                  className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-lg shadow-teal-600/20 transition-all cursor-pointer w-fit disabled:opacity-50"
                >
                  <Navigation className="w-4 h-4" />
                  <span>{isLocating ? "Locating..." : "Refresh Location"}</span>
                </button>
              </div>

              {/* Verified Providers List */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {nearbyProviders.map((prov) => (
                  <div
                    key={prov.id}
                    className="p-5 rounded-2xl bg-white/5 border border-white/10 hover:border-teal-400/40 transition-all space-y-3 flex flex-col justify-between"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between gap-2">
                        <span className="px-2.5 py-0.5 rounded-md bg-teal-500/20 text-teal-300 border border-teal-500/30 text-[10px] font-bold uppercase">
                          {prov.provider_type}
                        </span>
                        {typeof prov.distanceKm === "number" && (
                          <span className="text-xs font-bold text-amber-300 flex items-center gap-1">
                            <MapPin className="w-3.5 h-3.5" />
                            <span>{prov.distanceKm} km away</span>
                          </span>
                        )}
                      </div>

                      <h4 className="font-bold text-sm text-white">{prov.organization_name}</h4>
                      <p className="text-xs text-neutral-300 leading-relaxed">{prov.address}</p>
                    </div>

                    <div className="pt-3 border-t border-white/10 space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        {prov.phone && (
                          <a
                            href={`tel:${prov.phone}`}
                            className="text-teal-300 font-bold flex items-center gap-1 hover:underline"
                          >
                            <PhoneCall className="w-3.5 h-3.5" />
                            <span>{prov.phone}</span>
                          </a>
                        )}

                        {prov.website && (
                          <a
                            href={prov.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-neutral-300 hover:text-white flex items-center gap-1 text-[11px]"
                          >
                            <Globe className="w-3.5 h-3.5 text-teal-400" />
                            <span>Official Portal</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        )}
                      </div>

                      <div className="flex items-center justify-between text-[10px] text-neutral-400 pt-1">
                        <span>Verified: {prov.verified_by || "Dept of Agriculture"}</span>
                        <span className="text-emerald-400 font-bold">✓ Official Center</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* TAB 5: AGRICULTURAL SERVICE REQUESTS */}
        {/* ============================================================ */}
        {activeTab === "requests" && (
          <div className="space-y-6">
            <div className="p-6 rounded-3xl bg-black/50 backdrop-blur-xl border border-white/15 shadow-xl space-y-4">
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="font-bold text-lg text-white flex items-center gap-2">
                    <Tractor className="w-5 h-5 text-emerald-400" />
                    <span>{lang === "en" ? "Agricultural Service Requests & Bookings" : "ಕೃಷಿ ಸೇವಾ ವಿನಂತಿಗಳು ಮತ್ತು ಬುಕಿಂಗ್"}</span>
                  </h3>
                  <p className="text-xs text-neutral-300">
                    Place requests for Soil Testing, Custom Machinery, Transport, Storage, or Extension Visits.
                  </p>
                </div>

                <button
                  onClick={() => setShowNewRequestModal(true)}
                  className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs flex items-center gap-1.5 shadow-lg shadow-emerald-500/20 transition-all cursor-pointer w-fit"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>Request a Service</span>
                </button>
              </div>

              {/* Service Requests List or Clean Empty State */}
              {serviceRequests.length === 0 ? (
                <div className="p-12 text-center rounded-2xl bg-black/40 border border-white/10 space-y-3">
                  <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 text-neutral-400 flex items-center justify-center mx-auto">
                    <Tractor className="w-7 h-7 text-neutral-400" />
                  </div>
                  <h4 className="font-bold text-base text-white">{t.noRecords}</h4>
                  <p className="text-xs text-neutral-400 max-w-md mx-auto">
                    {t.emptyRequests}
                  </p>
                  <button
                    onClick={() => setShowNewRequestModal(true)}
                    className="px-4 py-2 rounded-xl bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 hover:bg-emerald-500/30 text-xs font-bold transition-colors cursor-pointer"
                  >
                    + Place First Service Request
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {serviceRequests.map((req) => (
                    <div
                      key={req.id}
                      className="p-5 rounded-3xl bg-white/5 border border-white/10 hover:border-emerald-400/40 transition-all shadow-md flex flex-col md:flex-row md:items-center justify-between gap-6"
                    >
                      <div className="space-y-2.5">
                        <div className="flex items-center gap-2.5 flex-wrap">
                          <span className="font-mono text-xs font-bold px-2.5 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                            {req.id}
                          </span>

                          <span
                            className={`px-2.5 py-0.5 rounded-md text-xs font-bold ${
                              req.status === "COMPLETED"
                                ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                                : req.status === "SCHEDULED" || req.status === "IN_PROGRESS"
                                ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/30"
                                : "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                            }`}
                          >
                            ● {req.status}
                          </span>

                          <span className="text-xs text-neutral-400">
                            Preferred Date: {req.requested_date}
                          </span>
                        </div>

                        <div>
                          <h4 className="font-bold text-base text-white">{req.service_name}</h4>
                          <p className="text-xs text-neutral-300 mt-0.5">{req.description}</p>
                        </div>

                        <div className="text-xs text-neutral-400 flex items-center gap-3">
                          <span>Plot: {req.farm_name || "Primary Farm"}</span>
                          <span>•</span>
                          <span>Priority: {req.priority}</span>
                        </div>
                      </div>

                      {/* Right Action: Feedback if completed */}
                      {req.status === "COMPLETED" && (
                        <button
                          onClick={() => setShowFeedbackModal(req)}
                          className="px-4 py-2 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-400/40 text-amber-300 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer shrink-0 w-fit"
                        >
                          <Star className="w-4 h-4" />
                          <span>Submit Feedback</span>
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              )}

            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* TAB 6: OFFICIAL FARMER NOTICES */}
        {/* ============================================================ */}
        {activeTab === "notices" && (
          <div className="space-y-6">
            <div className="p-6 rounded-3xl bg-black/50 backdrop-blur-xl border border-white/15 shadow-xl space-y-4">
              
              <div>
                <h3 className="font-bold text-lg text-white flex items-center gap-2">
                  <Bell className="w-5 h-5 text-purple-400" />
                  <span>{lang === "en" ? "Verified Official Farmer Notices" : "ಅಧಿಕೃತ ಸರ್ಕಾರಿ ಪ್ರಕಟಣೆಗಳು"}</span>
                </h3>
                <p className="text-xs text-neutral-300">
                  Government circulars, weather advisories, and scheme announcements verified by state authorities.
                </p>
              </div>

              {notices.length === 0 ? (
                <div className="p-12 text-center rounded-2xl bg-black/40 border border-white/10 space-y-3">
                  <h4 className="font-bold text-base text-white">{t.noRecords}</h4>
                  <p className="text-xs text-neutral-400">{t.emptyNotices}</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {notices.map((n) => (
                    <div
                      key={n.id}
                      className="p-5 rounded-2xl bg-white/5 border border-white/10 hover:border-purple-400/40 transition-all space-y-3"
                    >
                      <div className="flex items-center justify-between gap-3 flex-wrap">
                        <div className="flex items-center gap-2">
                          <span className="px-2.5 py-0.5 rounded-md bg-purple-500/20 text-purple-300 border border-purple-500/30 text-xs font-bold">
                            {n.category}
                          </span>
                          <span className="text-xs text-neutral-400">
                            Published: {n.published_at.split("T")[0]}
                          </span>
                        </div>

                        <span className="text-xs font-bold text-emerald-400 flex items-center gap-1">
                          <ShieldCheck className="w-4 h-4" />
                          <span>Verified by {n.source_name}</span>
                        </span>
                      </div>

                      <div>
                        <h4 className="font-bold text-base text-white">
                          {lang === "kn" && n.title_kn ? n.title_kn : n.title}
                        </h4>
                        <p className="text-xs text-neutral-300 mt-1 leading-relaxed">
                          {lang === "kn" && n.description_kn ? n.description_kn : n.description}
                        </p>
                      </div>

                      <div className="flex items-center justify-between text-xs pt-2 border-t border-white/10">
                        <span className="text-neutral-400">Valid until: {n.valid_until}</span>
                        {n.source_url && (
                          <a
                            href={n.source_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-purple-300 hover:text-white flex items-center gap-1 font-bold"
                          >
                            <span>Official Source Link</span>
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}

            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* TAB 7: AGRICULTURAL IMPORTANT DATES */}
        {/* ============================================================ */}
        {activeTab === "dates" && (
          <div className="space-y-6">
            <div className="p-6 rounded-3xl bg-black/50 backdrop-blur-xl border border-white/15 shadow-xl space-y-4">
              
              <div>
                <h3 className="font-bold text-lg text-white flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-rose-400" />
                  <span>{lang === "en" ? "Agricultural Important Dates & Cut-Offs" : "ಕೃಷಿ ಪ್ರಮುಖ ದಿನಾಂಕಗಳು ಮತ್ತು ಗಡುವು"}</span>
                </h3>
                <p className="text-xs text-neutral-300">
                  Verified official dates for insurance enrollment, government scheme application windows, and camps.
                </p>
              </div>

              {importantDates.length === 0 ? (
                <div className="p-12 text-center rounded-2xl bg-black/40 border border-white/10 space-y-3">
                  <h4 className="font-bold text-base text-white">{t.noRecords}</h4>
                  <p className="text-xs text-neutral-400">{t.emptyDates}</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {importantDates.map((d) => {
                    const isUpcoming = new Date(d.deadline) >= new Date();
                    return (
                      <div
                        key={d.id}
                        className="p-5 rounded-2xl bg-white/5 border border-white/10 hover:border-rose-400/40 transition-all space-y-3 flex flex-col justify-between"
                      >
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="px-2.5 py-0.5 rounded-md bg-rose-500/20 text-rose-300 border border-rose-500/30 text-[11px] font-bold">
                              {d.category}
                            </span>
                            <span
                              className={`px-2 py-0.5 rounded text-[10px] font-black ${
                                isUpcoming
                                  ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                                  : "bg-red-500/20 text-red-300 border border-red-500/30"
                              }`}
                            >
                              {isUpcoming ? "UPCOMING" : "EXPIRED"}
                            </span>
                          </div>

                          <h4 className="font-bold text-sm text-white">
                            {lang === "kn" && d.title_kn ? d.title_kn : d.title}
                          </h4>
                          <p className="text-xs text-neutral-300 leading-relaxed">
                            {lang === "kn" && d.description_kn ? d.description_kn : d.description}
                          </p>
                        </div>

                        <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs">
                          <div className="text-rose-300 font-bold">
                            Deadline: <strong>{d.deadline}</strong>
                          </div>
                          <span className="text-[10px] text-neutral-400">Source: {d.source_name}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* TAB 8: BENEFITS & SUBSIDIES TRACKER */}
        {/* ============================================================ */}
        {activeTab === "benefits" && (
          <div className="space-y-6">
            <div className="p-6 rounded-3xl bg-black/50 backdrop-blur-xl border border-white/15 shadow-xl space-y-4">
              
              <div>
                <h3 className="font-bold text-lg text-white flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-amber-400" />
                  <span>{lang === "en" ? "My Subsidies & Benefits Ledger" : "ನನ್ನ ಸಬ್ಸಿಡಿ ಮತ್ತು ಪರಿಹಾರ ಖಾತೆ"}</span>
                </h3>
                <p className="text-xs text-neutral-300">
                  Real records of financial subsidies, input grants, and direct benefit transfers credited to your account.
                </p>
              </div>

              {benefits.length === 0 ? (
                <div className="p-12 text-center rounded-2xl bg-black/40 border border-white/10 space-y-3">
                  <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 text-neutral-400 flex items-center justify-center mx-auto">
                    <DollarSign className="w-7 h-7 text-neutral-400" />
                  </div>
                  <h4 className="font-bold text-base text-white">{t.noRecords}</h4>
                  <p className="text-xs text-neutral-400 max-w-md mx-auto">
                    {t.emptyBenefits}
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {benefits.map((b) => (
                    <div
                      key={b.id}
                      className="p-5 rounded-2xl bg-white/5 border border-white/10 hover:border-amber-400/40 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                    >
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 text-[11px] font-bold">
                            {b.benefit_type}
                          </span>
                          <span className="text-xs font-bold text-emerald-400">
                            Status: {b.status}
                          </span>
                        </div>
                        <h4 className="font-bold text-sm text-white">{b.scheme_name}</h4>
                        <p className="text-xs text-neutral-400">Source: {b.source}</p>
                      </div>

                      <div className="text-right">
                        <span className="text-[10px] text-neutral-400 block uppercase font-bold">Benefit Amount</span>
                        <span className="text-base font-black text-amber-300">
                          {typeof b.approved_amount === "number"
                            ? `₹${b.approved_amount.toLocaleString()}`
                            : "Eligibility verification in progress"}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}

            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* TAB 9: MY SUPPORT PROFILE */}
        {/* ============================================================ */}
        {activeTab === "profile" && (
          <div className="space-y-6">
            <div className="p-6 sm:p-8 rounded-3xl bg-black/50 backdrop-blur-xl border border-white/15 shadow-xl space-y-6 max-w-3xl">
              
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-3xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white flex items-center justify-center font-bold text-2xl shadow-lg">
                  {user?.name ? user.name.slice(0, 2).toUpperCase() : "KM"}
                </div>
                <div>
                  <h3 className="font-bold text-xl text-white">{user?.name || "Ramesh Gowda"}</h3>
                  <p className="text-xs text-neutral-300">
                    {user?.village || "Narasapura"}, {user?.taluk || "Kolar"}, {user?.district || "Kolar"} • Karnataka
                  </p>
                  <span className="inline-flex items-center gap-1 text-[11px] text-emerald-400 font-bold mt-1">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Aadhaar & DBT Verified Farmer</span>
                  </span>
                </div>
              </div>

              {/* Profile Details Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs pt-4 border-t border-white/10">
                <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10">
                  <span className="text-neutral-400 block text-[10px] uppercase font-bold">Registered Mobile</span>
                  <span className="text-sm font-bold text-white font-mono mt-0.5 block">{user?.phone || "+91 98450 12345"}</span>
                </div>

                <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10">
                  <span className="text-neutral-400 block text-[10px] uppercase font-bold">Language Preference</span>
                  <span className="text-sm font-bold text-white mt-0.5 block">{lang === "en" ? "English" : "ಕನ್ನಡ (Kannada)"}</span>
                </div>

                <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10">
                  <span className="text-neutral-400 block text-[10px] uppercase font-bold">Primary Registered Plot</span>
                  <span className="text-sm font-bold text-white mt-0.5 block">{activeFarm?.name || "Sri Lakshmi Farm - Plot 1 (2.5 Acres)"}</span>
                </div>

                <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10">
                  <span className="text-neutral-400 block text-[10px] uppercase font-bold">Total Plots Registered</span>
                  <span className="text-sm font-bold text-emerald-300 mt-0.5 block">{farms.length > 0 ? `${farms.length} Plots` : "1 Primary Farm"}</span>
                </div>
              </div>

              {/* Link to My Farm */}
              <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-500/30 flex items-center justify-between text-xs">
                <div>
                  <span className="font-bold text-white block">Need to update land boundaries or soil data?</span>
                  <span className="text-neutral-300">Detailed crop cycles and plots are managed under My Farm.</span>
                </div>
                <Link
                  href="/farm"
                  className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold transition-colors shrink-0"
                >
                  Go to My Farm
                </Link>
              </div>

            </div>
          </div>
        )}

      </div>

      {/* ============================================================ */}
      {/* MODAL 1: UPLOAD DOCUMENT */}
      {/* ============================================================ */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="relative w-full max-w-lg bg-neutral-900 border border-emerald-500/40 rounded-3xl shadow-2xl text-white p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Upload className="w-5 h-5 text-emerald-400" />
                <h3 className="font-bold text-base text-white">Secure Document Upload</h3>
              </div>
              <button
                onClick={() => setShowUploadModal(false)}
                className="w-7 h-7 rounded-full bg-white/10 text-neutral-300 flex items-center justify-center cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            <form onSubmit={handleUploadSubmit} className="space-y-4 text-xs">
              <div>
                <label className="text-neutral-300 font-bold block mb-1">Document Name / Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Soil Test Report - Plot 1 (August 2026)"
                  value={docName}
                  onChange={(e) => setDocName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-black/60 border border-white/20 text-white focus:outline-none focus:border-emerald-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-neutral-300 font-bold block mb-1">Document Category</label>
                  <select
                    value={docType}
                    onChange={(e) => setDocType(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl bg-black/60 border border-white/20 text-white focus:outline-none focus:border-emerald-400"
                  >
                    <option value="soil_report">Soil Test Report</option>
                    <option value="land_record_rtc">Land Record / RTC (Pahani)</option>
                    <option value="crop_record">Crop Sowing Record</option>
                    <option value="insurance_policy">Insurance Policy</option>
                    <option value="scheme_doc">Scheme Application Doc</option>
                    <option value="receipt_invoice">Receipt / Invoice</option>
                    <option value="certificate">Certificate</option>
                    <option value="other">Other Agricultural Doc</option>
                  </select>
                </div>

                <div>
                  <label className="text-neutral-300 font-bold block mb-1">Linked Farm Plot</label>
                  <select
                    value={docFarmId}
                    onChange={(e) => setDocFarmId(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-black/60 border border-white/20 text-white focus:outline-none focus:border-emerald-400"
                  >
                    <option value="">General (All Plots)</option>
                    {farms.map((f) => (
                      <option key={f.id} value={f.id}>
                        {f.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Drag and Drop Zone */}
              <div
                onClick={() => {
                  setSelectedFileMock({
                    name: `${docName || "document"}.pdf`,
                    size: 1024 * 220,
                    type: "application/pdf",
                  });
                  showToast("File Attached", "Selected verified document file.", "info");
                }}
                className="p-6 rounded-2xl border-2 border-dashed border-white/20 hover:border-emerald-400/60 bg-black/40 text-center space-y-2 cursor-pointer transition-colors"
              >
                <Upload className="w-8 h-8 text-emerald-400 mx-auto" />
                <span className="font-bold text-white block">Click to Browse or Drop Document File</span>
                <span className="text-[10px] text-neutral-400 block">Supported: PDF, JPG, PNG, WEBP, DOCX (Max 15MB)</span>
                {selectedFileMock && (
                  <span className="inline-block px-3 py-1 rounded-lg bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-500/30">
                    Attached: {selectedFileMock.name}
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowUploadModal(false)}
                  className="w-1/2 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-1/2 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold shadow-lg shadow-emerald-500/30 transition-colors cursor-pointer"
                >
                  Encrypt & Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* MODAL 2: APPLY FOR SCHEME */}
      {/* ============================================================ */}
      {showNewAppModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="relative w-full max-w-lg bg-neutral-900 border border-cyan-500/40 rounded-3xl shadow-2xl text-white p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileCheck2 className="w-5 h-5 text-cyan-400" />
                <h3 className="font-bold text-base text-white">Apply for Government Scheme</h3>
              </div>
              <button
                onClick={() => setShowNewAppModal(false)}
                className="w-7 h-7 rounded-full bg-white/10 text-neutral-300 flex items-center justify-center cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            <form onSubmit={handleApplySchemeSubmit} className="space-y-4 text-xs">
              <div>
                <label className="text-neutral-300 font-bold block mb-1">Select Verified Scheme</label>
                <select
                  required
                  value={selectedSchemeId}
                  onChange={(e) => setSelectedSchemeId(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-black/60 border border-white/20 text-white focus:outline-none focus:border-cyan-400"
                >
                  <option value="">-- Choose Official Scheme --</option>
                  {DEMO_SCHEMES.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.title} ({s.category})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-neutral-300 font-bold block mb-1">Farmer Remarks / Application Notes</label>
                <textarea
                  rows={3}
                  placeholder="Specify land survey number, required subsidy component, or previous DBT reference..."
                  value={appRemarks}
                  onChange={(e) => setAppRemarks(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-black/60 border border-white/20 text-white focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div className="p-3 rounded-xl bg-cyan-950/40 border border-cyan-500/30 text-[11px] text-neutral-300 space-y-1">
                <span className="font-bold text-cyan-300 block">Automatic Vault Attachment</span>
                <span>Your verified RTC/Pahani and Soil Test documents will be automatically attached from your vault.</span>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowNewAppModal(false)}
                  className="w-1/2 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-1/2 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-700 text-white font-bold shadow-lg shadow-cyan-600/30 transition-colors cursor-pointer"
                >
                  Submit Application
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* MODAL 3: REQUEST A SERVICE */}
      {/* ============================================================ */}
      {showNewRequestModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="relative w-full max-w-lg bg-neutral-900 border border-emerald-500/40 rounded-3xl shadow-2xl text-white p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Tractor className="w-5 h-5 text-emerald-400" />
                <h3 className="font-bold text-base text-white">Request Agricultural Service</h3>
              </div>
              <button
                onClick={() => setShowNewRequestModal(false)}
                className="w-7 h-7 rounded-full bg-white/10 text-neutral-300 flex items-center justify-center cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            <form onSubmit={handleServiceRequestSubmit} className="space-y-4 text-xs">
              <div>
                <label className="text-neutral-300 font-bold block mb-1">Service Type</label>
                <select
                  value={reqServiceId}
                  onChange={(e) => setReqServiceId(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-black/60 border border-white/20 text-white focus:outline-none focus:border-emerald-400"
                >
                  {masterServices.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name} ({s.category})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-neutral-300 font-bold block mb-1">Preferred Date</label>
                  <input
                    type="date"
                    required
                    value={reqDate}
                    onChange={(e) => setReqDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-black/60 border border-white/20 text-white focus:outline-none focus:border-emerald-400"
                  />
                </div>
                <div>
                  <label className="text-neutral-300 font-bold block mb-1">Priority</label>
                  <select
                    value={reqPriority}
                    onChange={(e) => setReqPriority(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl bg-black/60 border border-white/20 text-white focus:outline-none focus:border-emerald-400"
                  >
                    <option value="NORMAL">Normal</option>
                    <option value="HIGH">High Priority</option>
                    <option value="URGENT">Urgent (Crop Risk)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-neutral-300 font-bold block mb-1">Service Location / Farm Address</label>
                <input
                  type="text"
                  required
                  value={reqLocation}
                  onChange={(e) => setReqLocation(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-black/60 border border-white/20 text-white focus:outline-none focus:border-emerald-400"
                />
              </div>

              <div>
                <label className="text-neutral-300 font-bold block mb-1">Requirement Details</label>
                <textarea
                  rows={2}
                  placeholder="Specify soil sample count, machinery hours, or transport load..."
                  value={reqDescription}
                  onChange={(e) => setReqDescription(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-black/60 border border-white/20 text-white focus:outline-none focus:border-emerald-400"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowNewRequestModal(false)}
                  className="w-1/2 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-1/2 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold shadow-lg shadow-emerald-500/30 transition-colors cursor-pointer"
                >
                  Place Request
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* MODAL 4: VISUAL APPLICATION TIMELINE */}
      {/* ============================================================ */}
      {showTimelineModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="relative w-full max-w-lg bg-neutral-900 border border-cyan-500/40 rounded-3xl shadow-2xl text-white p-6 space-y-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-cyan-400" />
                <h3 className="font-bold text-base text-white">Application Progress Timeline</h3>
              </div>
              <button
                onClick={() => setShowTimelineModal(null)}
                className="w-7 h-7 rounded-full bg-white/10 text-neutral-300 flex items-center justify-center cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="p-3.5 rounded-2xl bg-black/60 border border-white/10 space-y-1 text-xs">
              <span className="font-mono text-cyan-300 font-bold">{showTimelineModal.application_reference_number}</span>
              <h4 className="font-bold text-sm text-white">{showTimelineModal.scheme_name}</h4>
              <p className="text-neutral-400">Current Status: <strong className="text-white">{showTimelineModal.status}</strong></p>
            </div>

            {/* Visual Timeline Steps */}
            <div className="space-y-4 pl-4 border-l-2 border-cyan-500/40 text-xs">
              {showTimelineModal.history && showTimelineModal.history.length > 0 ? (
                showTimelineModal.history.map((step, idx) => (
                  <div key={step.id || idx} className="relative space-y-1">
                    <span className="absolute -left-[23px] top-1 w-3.5 h-3.5 rounded-full bg-cyan-400 ring-4 ring-cyan-950" />
                    <div className="font-bold text-cyan-300 flex items-center justify-between">
                      <span>{step.status.replace(/_/g, " ")}</span>
                      <span className="text-[10px] text-neutral-400 font-normal">{step.changed_at.split("T")[0]}</span>
                    </div>
                    <p className="text-neutral-300 text-[11px]">{step.remarks}</p>
                    <span className="text-[9px] text-neutral-500 block">By: {step.changed_by}</span>
                  </div>
                ))
              ) : (
                <div className="relative space-y-1">
                  <span className="absolute -left-[23px] top-1 w-3.5 h-3.5 rounded-full bg-cyan-400 ring-4 ring-cyan-950" />
                  <div className="font-bold text-cyan-300">SUBMITTED</div>
                  <p className="text-neutral-300 text-[11px]">Application logged and forwarded to Taluk Assistant Director of Agriculture.</p>
                </div>
              )}
            </div>

            <button
              onClick={() => setShowTimelineModal(null)}
              className="w-full py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs transition-colors cursor-pointer"
            >
              Close Timeline
            </button>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* MODAL 5: SERVICE FEEDBACK */}
      {/* ============================================================ */}
      {showFeedbackModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="relative w-full max-w-md bg-neutral-900 border border-amber-500/40 rounded-3xl shadow-2xl text-white p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Star className="w-5 h-5 text-amber-400" />
                <h3 className="font-bold text-base text-white">Rate Completed Service</h3>
              </div>
              <button
                onClick={() => setShowFeedbackModal(null)}
                className="w-7 h-7 rounded-full bg-white/10 text-neutral-300 flex items-center justify-center cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            <form onSubmit={handleFeedbackSubmit} className="space-y-4 text-xs">
              <div>
                <span className="text-neutral-300 font-bold block mb-1">Service: {showFeedbackModal.service_name}</span>
                <span className="text-neutral-400 text-[11px]">Provider: {showFeedbackModal.provider_name}</span>
              </div>

              {/* Star Selector */}
              <div>
                <label className="text-neutral-300 font-bold block mb-1.5">Rating (1 to 5 Stars)</label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setFbRating(star)}
                      className="p-1.5 transition-transform hover:scale-125 cursor-pointer"
                    >
                      <Star
                        className={`w-6 h-6 ${
                          star <= fbRating ? "fill-amber-400 text-amber-400" : "text-neutral-600"
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-neutral-300 font-bold block mb-1">Feedback & Suggestions</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Share details on service timeliness, technician behavior, and quality..."
                  value={fbComments}
                  onChange={(e) => setFbComments(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-black/60 border border-white/20 text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowFeedbackModal(null)}
                  className="w-1/2 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-1/2 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold shadow-lg shadow-amber-500/30 transition-colors cursor-pointer"
                >
                  Submit Rating
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* MODAL 6: SUPPORT NOTIFICATIONS DRAWER */}
      {/* ============================================================ */}
      {showNotificationsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="relative w-full max-w-lg bg-neutral-900 border border-emerald-500/40 rounded-3xl shadow-2xl text-white p-6 space-y-4 max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <Bell className="w-5 h-5 text-amber-400" />
                <h3 className="font-bold text-base text-white">Support Activity Notifications</h3>
              </div>
              <button
                onClick={() => setShowNotificationsModal(false)}
                className="w-7 h-7 rounded-full bg-white/10 text-neutral-300 flex items-center justify-center cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            {notifications.length === 0 ? (
              <div className="p-8 text-center text-xs text-neutral-400">
                No unread support notifications at this time.
              </div>
            ) : (
              <div className="space-y-3 text-xs">
                {notifications.map((n) => (
                  <div
                    key={n.id}
                    className={`p-3.5 rounded-2xl border transition-all ${
                      n.is_read
                        ? "bg-white/5 border-white/10 text-neutral-400"
                        : "bg-emerald-950/40 border-emerald-500/40 text-white shadow-md"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-bold text-white flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                        <span>{n.title}</span>
                      </span>
                      <span className="text-[10px] text-neutral-400">{n.created_at.split("T")[0]}</span>
                    </div>
                    <p className="text-neutral-300 text-[11px] mt-1">{n.message}</p>
                    {!n.is_read && (
                      <button
                        onClick={() => handleMarkNotifRead(n.id)}
                        className="text-[10px] text-emerald-400 hover:text-emerald-300 font-bold mt-2 cursor-pointer"
                      >
                        Mark as Read
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
}
