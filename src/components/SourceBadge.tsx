"use client";

import React from "react";
import { ShieldCheck, CheckCircle2, AlertTriangle, Clock, ExternalLink, Sparkles, Building2 } from "lucide-react";

export type VerificationType = 
  | "GOVERNMENT_OFFICIAL" 
  | "MARKET_OFFICIAL" 
  | "VERIFIED_PROVIDER" 
  | "KRISHIMITRA_MODEL" 
  | "PENDING_VERIFICATION" 
  | "EXPIRED"
  | "VERIFIED_ALL";

interface SourceBadgeProps {
  type: VerificationType;
  sourceName?: string;
  lastUpdated?: string;
  officialUrl?: string;
  className?: string;
  compact?: boolean;
}

export const SourceBadge: React.FC<SourceBadgeProps> = ({
  type,
  sourceName,
  lastUpdated,
  officialUrl,
  className = "",
  compact = false,
}) => {
  const getBadgeConfig = () => {
    switch (type) {
      case "GOVERNMENT_OFFICIAL":
        return {
          icon: Building2,
          label: "Official Government Source",
          sub: sourceName || "myScheme.gov.in / Ministry of Agriculture",
          bg: "bg-sky-500/15 border-sky-400/35 text-sky-200",
          iconColor: "text-sky-400",
          tagBg: "bg-sky-500/25 text-sky-200 border-sky-400/40",
        };
      case "MARKET_OFFICIAL":
        return {
          icon: CheckCircle2,
          label: "Verified Market Feed",
          sub: sourceName || "e-NAM / AGMARKNET Daily Trading Yard",
          bg: "bg-emerald-500/15 border-emerald-400/35 text-emerald-200",
          iconColor: "text-emerald-400",
          tagBg: "bg-emerald-500/25 text-emerald-200 border-emerald-400/40",
        };
      case "VERIFIED_PROVIDER":
        return {
          icon: ShieldCheck,
          label: "Verified Agri Provider",
          sub: sourceName || "FPO / Licensed Input Retailer",
          bg: "bg-emerald-500/15 border-emerald-400/35 text-emerald-200",
          iconColor: "text-emerald-400",
          tagBg: "bg-emerald-500/25 text-emerald-200 border-emerald-400/40",
        };
      case "KRISHIMITRA_MODEL":
        return {
          icon: Sparkles,
          label: "KrishiMitra Advisory Model",
          sub: sourceName || "ICAR Stoichiometric & Distance Estimation",
          bg: "bg-purple-500/15 border-purple-400/35 text-purple-200",
          iconColor: "text-purple-400",
          tagBg: "bg-purple-500/25 text-purple-200 border-purple-400/40",
        };
      case "PENDING_VERIFICATION":
        return {
          icon: AlertTriangle,
          label: "Pending Verification",
          sub: sourceName || "Under FPO / Admin Document Audit",
          bg: "bg-amber-500/15 border-amber-400/35 text-amber-200",
          iconColor: "text-amber-400",
          tagBg: "bg-amber-500/25 text-amber-200 border-amber-400/40",
        };
      case "VERIFIED_ALL":
        return {
          icon: ShieldCheck,
          label: "Verified Data",
          sub: sourceName || "IMD • AGMARKNET • myScheme",
          bg: "bg-emerald-500/15 border-emerald-400/35 text-emerald-200",
          iconColor: "text-emerald-400",
          tagBg: "bg-emerald-500/25 text-emerald-200 border-emerald-400/40",
        };
      case "EXPIRED":
        return {
          icon: Clock,
          label: "Expired / Archived",
          sub: sourceName || "Past Validity Date",
          bg: "bg-rose-500/15 border-rose-400/35 text-rose-200",
          iconColor: "text-rose-400",
          tagBg: "bg-rose-500/25 text-rose-200 border-rose-400/40",
        };
    }
  };

  const config = getBadgeConfig();
  const Icon = config.icon;

  if (compact) {
    return (
      <span
        className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-lg text-[10px] font-bold border backdrop-blur-md shadow-xs ${config.bg} ${className}`}
        title={`Source: ${config.sub}${lastUpdated ? ` • Last Updated: ${lastUpdated}` : ""}`}
      >
        <Icon className={`w-3 h-3 ${config.iconColor}`} />
        <span>{config.label}</span>
      </span>
    );
  }

  return (
    <div
      className={`inline-flex flex-wrap items-center justify-between gap-2 px-3 py-1.5 rounded-xl border backdrop-blur-md text-xs shadow-sm ${config.bg} ${className}`}
    >
      <div className="flex items-center gap-2">
        <Icon className={`w-3.5 h-3.5 shrink-0 ${config.iconColor}`} />
        <div>
          <div className="flex items-center gap-1.5">
            <span className="font-bold">{config.label}</span>
            {lastUpdated && (
              <span className="text-[10px] opacity-75 font-mono">
                • {lastUpdated}
              </span>
            )}
          </div>
          <span className="text-[10px] opacity-85 block leading-tight">
            {config.sub}
          </span>
        </div>
      </div>

      {officialUrl && (
        <a
          href={officialUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-white/10 hover:bg-white/20 text-[10px] font-bold text-white border border-white/15 transition-colors cursor-pointer"
        >
          <span>View Source</span>
          <ExternalLink className="w-2.5 h-2.5" />
        </a>
      )}
    </div>
  );
};

export const VerifiedAuthorityBadge: React.FC<{
  source?: "IMD" | "AGMARKNET" | "MYSCHEME" | "ALL";
  className?: string;
}> = ({ source = "ALL", className = "" }) => {
  const text =
    source === "IMD"
      ? "Verified by IMD"
      : source === "AGMARKNET"
      ? "Verified by AGMARKNET"
      : source === "MYSCHEME"
      ? "Verified by myScheme"
      : "Verified by IMD / AGMARKNET / myScheme";

  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-emerald-950/60 border border-emerald-500/30 text-emerald-300 ${className}`}
      title={text}
    >
      <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" />
      <span>{text}</span>
    </span>
  );
};
