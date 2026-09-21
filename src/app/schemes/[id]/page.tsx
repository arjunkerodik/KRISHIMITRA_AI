"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  Building2,
  CheckCircle2,
  FileText,
  Download,
  ArrowRight,
  Sparkles,
  ShieldCheck,
  AlertCircle,
  IndianRupee,
  ExternalLink,
  ChevronRight,
  Phone,
  Mail,
  Calendar,
  X,
  Info,
  Layers,
} from "lucide-react";
import { useApp } from "@/lib/store";
import {
  VERIFIED_GOVERNMENT_SCHEMES,
  VerifiedGovtScheme,
} from "@/lib/services/governmentSchemesData";
import { SourceBadge } from "@/components/SourceBadge";

export default function SchemeDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { activeFarm, showToast, awardCredits } = useApp();
  const schemeId = params?.id as string;

  // Match scheme by ID, codeName, or slug fallback
  const scheme: VerifiedGovtScheme =
    VERIFIED_GOVERNMENT_SCHEMES.find(
      (s) =>
        s.id.toLowerCase() === schemeId?.toLowerCase() ||
        s.codeName.toLowerCase() === schemeId?.toLowerCase() ||
        s.id.replace("sch_", "") === schemeId?.toLowerCase()
    ) ||
    (schemeId === "pm-kisan" ? VERIFIED_GOVERNMENT_SCHEMES[0] : null) ||
    (schemeId === "pmksy-drip" ? VERIFIED_GOVERNMENT_SCHEMES[2] : null) ||
    VERIFIED_GOVERNMENT_SCHEMES[0];

  const [showApplyModal, setShowApplyModal] = useState(false);

  const handleProceedToOfficialPortal = () => {
    const url = scheme.officialApplicationUrl || scheme.officialPortal;
    awardCredits("DAILY_ADVISORY_CHECKIN", `Explored official application for ${scheme.codeName}`, scheme.id);
    showToast(
      "Navigating to Official Government Portal",
      `Redirecting to ${scheme.officialPortal}. Complete your official DBT application securely.`,
      "info"
    );
    window.open(url, "_blank", "noopener,noreferrer");
    setShowApplyModal(false);
  };

  return (
    <div className="min-h-screen bg-transparent py-8 px-4 sm:px-6 lg:px-8 text-white">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Breadcrumbs & Navigation */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-medium text-white/60 mb-1">
              <Link href="/dashboard" className="hover:text-emerald-300">Dashboard</Link>
              <span>/</span>
              <Link href="/schemes" className="hover:text-emerald-300">Government Schemes</Link>
              <span>/</span>
              <span className="text-white font-semibold truncate max-w-xs">{scheme.codeName}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-display font-bold text-white flex items-center gap-3">
              <Building2 className="w-8 h-8 text-emerald-400 shrink-0" />
              <span>{scheme.title}</span>
            </h1>
            <p className="text-xs sm:text-sm text-emerald-300 font-medium mt-1">
              {scheme.ministry} • {scheme.department}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/schemes"
              className="px-4 py-2 rounded-xl bg-black/40 hover:bg-white/10 border border-white/20 text-xs font-semibold text-white transition-all backdrop-blur-md"
            >
              ← Back to All Schemes
            </Link>
          </div>
        </div>

        {/* Hero Highlight Card */}
        <div className="p-6 sm:p-8 rounded-3xl bg-emerald-950/40 border border-emerald-500/40 text-white shadow-2xl backdrop-blur-xl space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-3 py-1 rounded-full bg-white/10 text-xs font-semibold border border-white/15">
                {scheme.level} Scheme
              </span>
              <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold border border-emerald-400/30">
                {scheme.category}
              </span>
              {scheme.stateApplicability.map((st, i) => (
                <span key={i} className="px-2.5 py-1 rounded-full bg-sky-500/20 text-sky-300 text-xs font-mono border border-sky-400/30">
                  {st}
                </span>
              ))}
            </div>

            <SourceBadge
              type="GOVERNMENT_OFFICIAL"
              sourceName={scheme.department}
              lastUpdated={scheme.lastVerified}
              officialUrl={scheme.officialPortal}
            />
          </div>

          <div>
            <span className="text-xs font-bold text-emerald-300 uppercase tracking-wider">
              Direct Financial Assistance & Benefits
            </span>
            <div className="text-xl sm:text-2xl font-bold font-display mt-1 text-white">
              {scheme.benefits}
            </div>
            {scheme.maxFinancialAssistance && (
              <div className="mt-1 text-xs text-emerald-300 font-mono">
                Maximum Financial Assistance: <strong>{scheme.maxFinancialAssistance}</strong>
              </div>
            )}
          </div>

          <p className="text-xs sm:text-sm text-white/80 leading-relaxed max-w-4xl bg-black/30 p-4 rounded-2xl border border-white/10">
            {scheme.shortDescription}
          </p>

          <div className="pt-2 flex items-center gap-3 flex-wrap">
            {scheme.officialApplicationUrl ? (
              <button
                onClick={() => setShowApplyModal(true)}
                className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-all shadow-lg shadow-emerald-600/30 inline-flex items-center gap-2 cursor-pointer"
              >
                <span>Apply Officially on Government Portal</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </button>
            ) : (
              <span className="px-4 py-2 rounded-xl bg-neutral-800 text-neutral-400 text-xs font-medium border border-neutral-700">
                Official Application Link Not Verified
              </span>
            )}

            <a
              href={scheme.officialPortal}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2.5 rounded-xl bg-black/40 hover:bg-white/10 border border-white/20 text-white text-xs font-semibold inline-flex items-center gap-1.5 transition-all"
            >
              <span>View Official Department Portal</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>

            <a
              href={scheme.mySchemeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2.5 rounded-xl bg-sky-950/50 hover:bg-sky-900/50 border border-sky-400/40 text-sky-200 text-xs font-semibold inline-flex items-center gap-1.5 transition-all"
            >
              <span>myScheme.gov.in Guide</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {/* 2 Column Details: Eligibility & Application Procedure */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Eligibility & Required Documents */}
          <div className="bg-black/45 backdrop-blur-xl rounded-3xl p-6 sm:p-8 border border-white/20 shadow-2xl space-y-6">
            <h3 className="text-lg font-bold font-display text-white flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
              Eligibility Checklist & Criteria
            </h3>

            <div className="space-y-3">
              {scheme.eligibility.map((crit: string, idx: number) => (
                <div key={idx} className="flex items-start gap-3 p-3.5 rounded-xl bg-black/30 border border-white/10 text-xs">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span className="text-white/85 leading-relaxed">{crit}</span>
                </div>
              ))}
            </div>

            <h4 className="text-sm font-bold text-white pt-2 flex items-center gap-2">
              <FileText className="w-4 h-4 text-sky-400" />
              Required Verification Documents:
            </h4>
            <div className="space-y-2">
              {scheme.documentsRequired.map((doc: string, idx: number) => (
                <div key={idx} className="flex items-center justify-between p-3.5 rounded-xl bg-sky-950/30 border border-sky-500/30 text-xs">
                  <span className="font-medium text-sky-200 flex items-center gap-2">
                    <FileText className="w-3.5 h-3.5 text-sky-400" /> {doc}
                  </span>
                  <span className="text-[10px] font-bold text-sky-300 uppercase">
                    Mandatory
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Official Step-by-Step Procedure & Helplines */}
          <div className="bg-black/45 backdrop-blur-xl rounded-3xl p-6 sm:p-8 border border-white/20 shadow-2xl space-y-6">
            <h3 className="text-lg font-bold font-display text-white flex items-center gap-2">
              <Layers className="w-5 h-5 text-emerald-400" />
              Official Step-by-Step Application Procedure
            </h3>

            <div className="space-y-3">
              {scheme.applicationProcess.map((step: string, idx: number) => (
                <div key={idx} className="p-3.5 rounded-xl bg-black/30 border border-white/10 text-xs text-white/85 leading-relaxed">
                  {step}
                </div>
              ))}
            </div>

            {/* Helpline Contact Card */}
            <div className="p-5 rounded-2xl bg-black/40 border border-white/10 space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-300 flex items-center gap-1.5">
                <Phone className="w-4 h-4 text-emerald-400" />
                <span>Nodal Ministry Helpline & Support</span>
              </h4>
              <div className="space-y-1.5 text-xs text-white/80 font-mono">
                <div>Helpline: <strong className="text-white">{scheme.helplinePhone}</strong></div>
                {scheme.helplineEmail && (
                  <div>Email: <strong className="text-white">{scheme.helplineEmail}</strong></div>
                )}
                <div>Official Portal: <a href={scheme.officialPortal} target="_blank" rel="noreferrer" className="text-sky-300 underline">{scheme.officialPortal}</a></div>
              </div>
            </div>

          </div>
        </div>

      </div>

      {/* Official Portal Redirection Disclosure Modal */}
      {showApplyModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-black/90 backdrop-blur-2xl rounded-3xl border border-white/25 max-w-xl w-full p-6 sm:p-8 shadow-2xl space-y-5 animate-in fade-in zoom-in-95 duration-150 text-white">
            
            <div className="flex items-start justify-between gap-3 pb-3 border-b border-white/15">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-sky-300">
                  Official Government Redirection
                </span>
                <h3 className="text-lg font-bold font-display text-white mt-0.5">
                  {scheme.title}
                </h3>
              </div>
              <button
                onClick={() => setShowApplyModal(false)}
                className="p-1.5 rounded-xl text-white/60 hover:text-white hover:bg-white/10 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-4 rounded-2xl bg-sky-950/40 border border-sky-500/30 text-sky-100 space-y-2">
                <div className="flex items-center gap-2 font-bold text-sky-300">
                  <ShieldCheck className="w-4 h-4 text-sky-400" />
                  <span>Navigating to Verified Official Application Portal</span>
                </div>
                <p className="text-white/80 leading-relaxed">
                  You are being redirected from <strong>KrishiMitra AI</strong> to the genuine portal hosted by <strong>{scheme.ministry}</strong>:
                </p>
                <div className="p-2.5 rounded-xl bg-black/60 border border-white/15 font-mono text-[11px] text-emerald-300 break-all">
                  {scheme.officialApplicationUrl || scheme.officialPortal}
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-black/40 border border-white/10 space-y-2">
                <span className="font-bold text-white block">
                  Please have the following documents ready:
                </span>
                <ul className="space-y-1 text-white/70">
                  {scheme.documentsRequired.slice(0, 3).map((d, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span>{d}</span>
                    </li>
                  ))}
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>Aadhaar-linked mobile for OTP authentication</span>
                  </li>
                </ul>
              </div>

              <p className="text-[11px] text-white/60">
                KrishiMitra AI provides free discovery and farmer guidance. Your official application and Direct Benefit Transfer (DBT) will be processed directly on the Government of India portal.
              </p>
            </div>

            <div className="pt-2 flex items-center justify-end gap-3">
              <button
                onClick={() => setShowApplyModal(false)}
                className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold border border-white/15 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleProceedToOfficialPortal}
                className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-lg border border-emerald-400/40 inline-flex items-center gap-2 cursor-pointer transition-all active:scale-98"
              >
                <span>Proceed to Official Portal</span>
                <ExternalLink className="w-4 h-4" />
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
