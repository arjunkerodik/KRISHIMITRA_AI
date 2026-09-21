"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  VERIFIED_GOVERNMENT_SCHEMES,
  VerifiedGovtScheme,
} from "@/lib/services/governmentSchemesData";
import { useApp } from "@/lib/store";
import { SourceBadge } from "@/components/SourceBadge";
import {
  Landmark,
  ShieldCheck,
  CheckCircle2,
  Search,
  Filter,
  FileText,
  ExternalLink,
  Phone,
  Mail,
  Calendar,
  IndianRupee,
  Info,
  Building2,
  AlertCircle,
  HelpCircle,
  X,
  Sparkles,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

export const SchemeMatcher: React.FC = () => {
  const { activeFarm, showToast, awardCredits } = useApp();
  const [filterCategory, setFilterCategory] = useState<string>("All");
  const [filterLevel, setFilterLevel] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedSchemeForApply, setSelectedSchemeForApply] = useState<VerifiedGovtScheme | null>(null);
  const [expandedSchemeId, setExpandedSchemeId] = useState<string | null>(null);

  const categories = [
    "All",
    "Direct Benefit",
    "Irrigation",
    "Insurance",
    "Solar Energy",
    "Farm Machinery",
    "Credit & Finance",
    "Soil Health",
    "Organic & Natural Farming",
    "Horticulture",
  ];

  const levels = ["All", "Central", "State"];

  // Filter schemes
  const filteredSchemes = VERIFIED_GOVERNMENT_SCHEMES.filter((scheme) => {
    const matchesCategory =
      filterCategory === "All" || scheme.category === filterCategory;
    const matchesLevel =
      filterLevel === "All" || scheme.level === filterLevel;
    const matchesSearch =
      scheme.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      scheme.codeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      scheme.ministry.toLowerCase().includes(searchQuery.toLowerCase()) ||
      scheme.benefits.toLowerCase().includes(searchQuery.toLowerCase()) ||
      scheme.shortDescription.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesCategory && matchesLevel && matchesSearch;
  });

  const handleOpenOfficialApplyModal = (scheme: VerifiedGovtScheme) => {
    setSelectedSchemeForApply(scheme);
  };

  const handleProceedToOfficialPortal = () => {
    if (!selectedSchemeForApply) return;
    const url = selectedSchemeForApply.officialApplicationUrl || selectedSchemeForApply.officialPortal;
    
    // Award legitimate credits for engaging with verified government scheme
    awardCredits("DAILY_ADVISORY_CHECKIN", `Explored ${selectedSchemeForApply.codeName} on Official Portal`, selectedSchemeForApply.id);
    
    showToast(
      "Opening Official Government Portal",
      `Redirecting to ${selectedSchemeForApply.officialPortal}. Complete your official DBT application securely.`,
      "info"
    );

    window.open(url, "_blank", "noopener,noreferrer");
    setSelectedSchemeForApply(null);
  };

  return (
    <div className="space-y-6">
      
      {/* 1. CONTROLS: SEARCH, CATEGORIES & LEVEL FILTERS */}
      <div className="bg-black/50 backdrop-blur-xl rounded-3xl border border-white/20 p-6 shadow-2xl text-white space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-white/10">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Landmark className="w-5 h-5 text-emerald-400" />
                Verified Government Schemes & Subsidies
              </h2>
              <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-sky-500/20 text-sky-300 border border-sky-400/30">
                Official Sources Only
              </span>
            </div>
            <p className="text-xs text-white/70 mt-1">
              Curated from <strong>myScheme.gov.in</strong> and Central/State Agriculture Ministries. Matched with your <strong>{activeFarm.name} ({activeFarm.areaAcres} Ac, {activeFarm.district})</strong> profile.
            </p>
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40" />
            <input
              type="text"
              placeholder="Search by scheme name, subsidy, ministry..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full text-xs rounded-xl border border-white/20 bg-black/60 text-white placeholder-white/40 pl-10 pr-3.5 py-2.5 focus:outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-500/20 transition-all"
            />
          </div>
        </div>

        {/* Level & Category Filters */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold text-white/50 mr-1">Level:</span>
          {levels.map((lvl) => (
            <button
              key={lvl}
              onClick={() => setFilterLevel(lvl)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                filterLevel === lvl
                  ? "bg-sky-600 text-white shadow-md border border-sky-400/40"
                  : "bg-black/40 text-white/70 hover:bg-white/10 hover:text-white border border-white/10"
              }`}
            >
              {lvl === "All" ? "All Levels" : `${lvl} Schemes`}
            </button>
          ))}

          <div className="h-4 w-px bg-white/15 mx-2 hidden sm:block" />

          <span className="text-xs font-semibold text-white/50 mr-1">Category:</span>
          <div className="flex flex-wrap gap-1.5">
            {categories.map((c) => (
              <button
                key={c}
                onClick={() => setFilterCategory(c)}
                className={`px-3 py-1 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                  filterCategory === c
                    ? "bg-emerald-500/25 text-emerald-300 border border-emerald-400/40 font-bold"
                    : "text-white/65 hover:text-white hover:bg-white/10 border border-transparent"
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 2. TRANSPARENCY NOTICE BANNER */}
      <div className="p-4 rounded-2xl bg-sky-950/40 border border-sky-500/30 text-sky-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs backdrop-blur-md">
        <div className="flex items-center gap-3">
          <Info className="w-5 h-5 text-sky-400 shrink-0" />
          <div>
            <span className="font-bold text-sky-300 block">
              Official Application Transparency Guarantee
            </span>
            <p className="text-white/80 text-[11px] mt-0.5">
              KrishiMitra AI never charges any fees for government schemes. All application buttons open official portals (e.g., pmkisan.gov.in, fruits.karnataka.gov.in, agrimachinery.nic.in).
            </p>
          </div>
        </div>
        <a
          href="https://www.myscheme.gov.in/"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-sky-600/60 hover:bg-sky-500 text-white font-semibold text-[11px] shrink-0 border border-sky-400/40 transition-all cursor-pointer"
        >
          <span>myScheme.gov.in</span>
          <ExternalLink className="w-3 h-3" />
        </a>
      </div>

      {/* 3. SCHEMES LIST */}
      <div className="space-y-6">
        {filteredSchemes.length === 0 ? (
          <div className="bg-black/40 backdrop-blur-xl rounded-3xl border border-white/15 p-12 text-center text-white space-y-3">
            <Landmark className="w-10 h-10 text-white/40 mx-auto" />
            <h3 className="text-base font-bold text-white">No Schemes Found</h3>
            <p className="text-xs text-white/60 max-w-md mx-auto">
              No government schemes match the selected category or search term. Try resetting your filters.
            </p>
            <button
              onClick={() => {
                setFilterCategory("All");
                setFilterLevel("All");
                setSearchQuery("");
              }}
              className="px-4 py-2 rounded-xl bg-emerald-600 text-white text-xs font-semibold hover:bg-emerald-500 transition-colors"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          filteredSchemes.map((scheme) => {
            const isExpanded = expandedSchemeId === scheme.id;

            return (
              <div
                key={scheme.id}
                className="bg-black/50 backdrop-blur-xl rounded-3xl border border-white/20 p-6 shadow-2xl text-white space-y-5 hover:border-emerald-500/40 transition-all"
              >
                {/* Header Row */}
                <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                  <div className="space-y-1.5">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-sky-500/20 text-sky-300 border border-sky-400/30">
                        {scheme.level} Scheme
                      </span>
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                        {scheme.category}
                      </span>
                      {scheme.stateApplicability.map((st, i) => (
                        <span key={i} className="px-2 py-0.5 rounded-md text-[10px] font-mono bg-white/10 text-white/70 border border-white/10">
                          {st}
                        </span>
                      ))}
                    </div>

                    <h3 className="text-lg sm:text-xl font-bold font-display text-white tracking-tight">
                      {scheme.title}
                    </h3>

                    <p className="text-xs text-emerald-300 font-medium flex items-center gap-1.5">
                      <Building2 className="w-3.5 h-3.5 text-emerald-400" />
                      <span>{scheme.ministry} • {scheme.department}</span>
                    </p>
                  </div>

                  {/* Verification Badge & Last Updated */}
                  <div className="shrink-0 flex flex-col items-start lg:items-end gap-1.5">
                    <SourceBadge
                      type="GOVERNMENT_OFFICIAL"
                      sourceName={scheme.department}
                      lastUpdated={scheme.lastVerified}
                      officialUrl={scheme.officialPortal}
                    />
                    {scheme.deadlineText && (
                      <span className="text-[10px] text-amber-300 font-medium flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-amber-400" />
                        {scheme.deadlineText}
                      </span>
                    )}
                  </div>
                </div>

                {/* Short Description */}
                <p className="text-xs sm:text-sm text-white/80 leading-relaxed bg-black/30 p-3.5 rounded-2xl border border-white/10">
                  {scheme.shortDescription}
                </p>

                {/* Benefit Highlight & Financial Assistance */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-500/30 space-y-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-300 flex items-center gap-1">
                      <IndianRupee className="w-3 h-3 text-emerald-400" />
                      Direct Scheme Financial Benefits
                    </span>
                    <p className="text-xs sm:text-sm font-bold text-white">
                      {scheme.benefits}
                    </p>
                    {scheme.maxFinancialAssistance && (
                      <div className="pt-1 text-[11px] text-emerald-300 font-mono">
                        Max Assistance: <strong>{scheme.maxFinancialAssistance}</strong>
                      </div>
                    )}
                  </div>

                  <div className="p-4 rounded-2xl bg-sky-950/40 border border-sky-500/30 space-y-1.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-sky-300 flex items-center gap-1">
                      <Phone className="w-3 h-3 text-sky-400" />
                      Official Helpline & Support
                    </span>
                    <p className="text-xs font-semibold text-white font-mono">
                      {scheme.helplinePhone}
                    </p>
                    {scheme.helplineEmail && (
                      <p className="text-[11px] text-white/70 font-mono">
                        Email: {scheme.helplineEmail}
                      </p>
                    )}
                    <div className="pt-1 flex items-center gap-3">
                      <a
                        href={scheme.officialPortal}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[11px] text-sky-300 hover:text-white underline inline-flex items-center gap-1 font-semibold"
                      >
                        Official Portal <ExternalLink className="w-3 h-3" />
                      </a>
                      <a
                        href={scheme.mySchemeUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[11px] text-emerald-300 hover:text-white underline inline-flex items-center gap-1 font-semibold"
                      >
                        myScheme Guide <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </div>
                </div>

                {/* Collapsible Detailed Section: Eligibility, Documents & Process */}
                {isExpanded && (
                  <div className="space-y-4 pt-2 border-t border-white/10 animate-in fade-in duration-150">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      
                      {/* Eligibility Checklist */}
                      <div className="p-4 rounded-2xl bg-black/40 border border-white/10 space-y-2.5">
                        <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                          <span>Eligibility Criteria</span>
                        </h4>
                        <ul className="space-y-1.5 text-xs text-white/80">
                          {scheme.eligibility.map((crit, idx) => (
                            <li key={idx} className="flex items-start gap-2">
                              <span className="text-emerald-400 font-bold">•</span>
                              <span>{crit}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Required Documents */}
                      <div className="p-4 rounded-2xl bg-black/40 border border-white/10 space-y-2.5">
                        <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                          <FileText className="w-4 h-4 text-sky-400" />
                          <span>Required Documents Checklist</span>
                        </h4>
                        <ul className="space-y-1.5 text-xs text-white/80">
                          {scheme.documentsRequired.map((doc, idx) => (
                            <li key={idx} className="flex items-start gap-2">
                              <span className="text-sky-400 font-bold">✓</span>
                              <span>{doc}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    {/* Step-by-Step Official Application Process */}
                    <div className="p-4 rounded-2xl bg-black/40 border border-white/10 space-y-2.5">
                      <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                        <ShieldCheck className="w-4 h-4 text-emerald-400" />
                        <span>Official Step-by-Step Application Procedure</span>
                      </h4>
                      <ol className="space-y-1.5 text-xs text-white/80">
                        {scheme.applicationProcess.map((step, idx) => (
                          <li key={idx} className="p-2 rounded-xl bg-black/30 border border-white/5">
                            {step}
                          </li>
                        ))}
                      </ol>
                    </div>
                  </div>
                )}

                {/* Card Actions Footer */}
                <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-t border-white/10">
                  <button
                    onClick={() => setExpandedSchemeId(isExpanded ? null : scheme.id)}
                    className="inline-flex items-center gap-1 text-xs text-white/70 hover:text-white font-semibold transition-colors cursor-pointer"
                  >
                    <span>{isExpanded ? "Hide Full Eligibility & Documents" : "View Full Eligibility & Documents"}</span>
                    {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>

                  <div className="flex items-center gap-2 flex-wrap">
                    <Link
                      href={`/schemes/${scheme.id}`}
                      className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold border border-white/15 transition-all cursor-pointer"
                    >
                      View Scheme Dossier
                    </Link>

                    {scheme.officialApplicationUrl ? (
                      <button
                        onClick={() => handleOpenOfficialApplyModal(scheme)}
                        className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-lg shadow-emerald-600/30 border border-emerald-400/40 inline-flex items-center gap-1.5 transition-all active:scale-98 cursor-pointer"
                      >
                        <span>Apply Officially</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </button>
                    ) : (
                      <span className="px-4 py-2 rounded-xl bg-neutral-800 text-neutral-400 text-xs font-medium border border-neutral-700">
                        Official link not verified
                      </span>
                    )}
                  </div>
                </div>

              </div>
            );
          })
        )}
      </div>

      {/* 4. OFFICIAL APPLICATION PORTAL DISCLOSURE MODAL */}
      {selectedSchemeForApply && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-black/90 backdrop-blur-2xl rounded-3xl border border-white/25 max-w-xl w-full p-6 sm:p-8 shadow-2xl space-y-5 animate-in fade-in zoom-in-95 duration-150 text-white">
            
            <div className="flex items-start justify-between gap-3 pb-3 border-b border-white/15">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-sky-300">
                  Official Government Redirection
                </span>
                <h3 className="text-lg font-bold font-display text-white mt-0.5">
                  {selectedSchemeForApply.title}
                </h3>
              </div>
              <button
                onClick={() => setSelectedSchemeForApply(null)}
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
                  You are being redirected from <strong>KrishiMitra AI</strong> to the genuine portal hosted by <strong>{selectedSchemeForApply.ministry}</strong>:
                </p>
                <div className="p-2.5 rounded-xl bg-black/60 border border-white/15 font-mono text-[11px] text-emerald-300 break-all">
                  {selectedSchemeForApply.officialApplicationUrl || selectedSchemeForApply.officialPortal}
                </div>
              </div>

              {/* Pre-submission Checklist */}
              <div className="p-4 rounded-2xl bg-black/40 border border-white/10 space-y-2">
                <span className="font-bold text-white block">
                  Please have the following ready on the government portal:
                </span>
                <ul className="space-y-1 text-white/70">
                  {selectedSchemeForApply.documentsRequired.slice(0, 3).map((d, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span>{d}</span>
                    </li>
                  ))}
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>Aadhaar-linked mobile for OTP verification</span>
                  </li>
                </ul>
              </div>

              <p className="text-[11px] text-white/60">
                KrishiMitra AI does not charge application fees or store your government credentials. All submissions remain governed directly by the concerned Department.
              </p>
            </div>

            <div className="pt-2 flex items-center justify-end gap-3">
              <button
                onClick={() => setSelectedSchemeForApply(null)}
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
};
