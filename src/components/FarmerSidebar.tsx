"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useApp } from "@/lib/store";
import {
  LayoutDashboard,
  Tractor,
  Sparkles,
  ScanLine,
  CloudSun,
  Store,
  Landmark,
  CalendarDays,
  Bot,
  ShoppingBag,
  HelpCircle,
  Settings,
  ChevronRight,
  ShieldCheck,
  Map,
  Package,
  Coins,
  Gift,
  Tag,
  Scale,
  Shield,
  Layers,
} from "lucide-react";

interface SidebarProps {
  onCloseMobile?: () => void;
}

export const FarmerSidebar: React.FC<SidebarProps> = ({ onCloseMobile }) => {
  const pathname = usePathname();
  const { activeFarm, farms, setActiveFarmId, creditsBalance, farmerStreak, t } = useApp();

  const navigationSections = [
    {
      title: `// ${t.sectors?.fieldTelemetry || "FIELD TELEMETRY & PLOTS"}`,
      items: [
        { href: "/dashboard", label: t.nav?.digitalTwin || "Digital Twin", icon: LayoutDashboard },
        { href: "/crops", label: t.nav?.cropAdvisor || "Standing Crops", icon: Tractor },
        { href: "/crop-calendar", label: t.nav?.cropCalendar || "Field Plan", icon: CalendarDays },
        { href: "/disease", label: t.nav?.diseaseScanner || "Pathology Scanner", icon: ScanLine },
        { href: "/weather", label: t.nav?.weather || "Weather Radar", icon: CloudSun },
        { href: "/soil", label: t.nav?.soilHealth || "Soil Health Card", icon: Layers },
      ],
    },
    {
      title: `// ${t.sectors?.mandisEconomics || "MANDIS & ECONOMICS"}`,
      items: [
        { href: "/market", label: t.nav?.market || "APMC Mandi Rates", icon: Store },
        { href: "/schemes", label: t.nav?.schemes || "Govt Schemes (DBT)", icon: Landmark },
        { href: "/marketplace", label: t.nav?.marketplace || "Verified Inputs", icon: ShoppingBag },
        { href: "/offers", label: t.schemes?.subsidy || "Subsidies & Offers", icon: Tag },
        { href: "/orders", label: t.marketplace?.orderNow || "Order Tracking", icon: Package },
      ],
    },
    {
      title: `// ${t.sectors?.loyaltyRewards || "LOYALTY & REWARDS"}`,
      items: [
        { href: "/credits", label: `${t.nav?.credits || "Credits"} (${creditsBalance} 🪙)`, icon: Coins },
        { href: "/rewards", label: t.credits?.redeemVoucher || "Rewards Catalog", icon: Gift },
      ],
    },
    {
      title: `// ${t.sectors?.governanceAi || "GOVERNANCE & AI"}`,
      items: [
        { href: "/farmtalk", label: t.nav?.farmtalk || "FarmTalk AI", icon: Bot, highlight: true },
        { href: "/transparency", label: t.nav?.transparency || "Data Provenance", icon: Scale },
        { href: "/admin", label: t.nav?.admin || "Governance Desk", icon: Shield },
        { href: "/settings", label: t.nav?.settings || "Profile & KYC", icon: Settings },
      ],
    },
  ];

  const isActive = (href: string) => {
    if (href === "/dashboard") return pathname === "/dashboard";
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  return (
    <aside className="w-64 h-full flex flex-col bg-slate-950/85 backdrop-blur-2xl border-r border-slate-800/80 text-white select-none shadow-2xl">
      
      {/* Active Farm Switcher Header */}
      <div className="p-4 border-b border-slate-800/70">
        <label className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 block mb-1.5">
          {"// Active Farm Sector"}
        </label>
        <div className="relative">
          <select
            value={activeFarm.id}
            onChange={(e) => setActiveFarmId(e.target.value)}
            className="w-full text-xs font-mono font-semibold rounded-xl border border-slate-700 bg-slate-900/90 text-white p-2.5 pr-8 focus:outline-none focus:ring-2 focus:ring-cyan-500/40 focus:border-cyan-400 cursor-pointer appearance-none"
          >
            {farms.map((f) => (
              <option key={f.id} value={f.id} className="bg-slate-900 text-white">
                {f.name} ({f.areaAcres} Ac - {f.currentCrop})
              </option>
            ))}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2.5 text-slate-400">
            <ChevronRight className="w-3.5 h-3.5 rotate-90" />
          </div>
        </div>
      </div>

      {/* Navigation Sections */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-5">
        {navigationSections.map((section, idx) => (
          <div key={idx}>
            <div className="px-3 mb-1.5 text-[10px] font-mono font-bold uppercase tracking-wider text-cyan-400/70">
              {section.title}
            </div>
            <div className="space-y-0.5">
              {section.items.map((item) => {
                const active = isActive(item.href);
                const Icon = item.icon;

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={onCloseMobile}
                    className={`flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all group ${
                      active
                        ? "bg-cyan-950/60 border border-cyan-500/40 text-cyan-300 font-mono shadow-[0_0_12px_rgba(6,182,212,0.15)]"
                        : "text-slate-300 hover:text-white hover:bg-slate-900/60 border border-transparent"
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <Icon
                        className={`w-4 h-4 shrink-0 transition-colors ${
                          active
                            ? "text-cyan-400"
                            : "text-slate-400 group-hover:text-white"
                        }`}
                      />
                      <span className="truncate">{item.label}</span>
                    </div>
                    {item.highlight && (
                      <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-cyan-500/20 border border-cyan-400/40 text-cyan-200">
                        AI
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Footer Info Card with Loyalty Streak */}
      <div className="p-3 border-t border-slate-800/70 space-y-2">
        <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <span className="text-amber-400 font-bold font-mono">{creditsBalance} 🪙</span>
            <span className="text-slate-600">•</span>
            <span className="text-rose-400 font-bold font-mono">{farmerStreak.currentStreak} 🔥 Streak</span>
          </div>
          <Link href="/credits" className="text-[10px] text-cyan-400 font-mono font-bold hover:underline">
            Ledger →
          </Link>
        </div>

        <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800/80 text-slate-300">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-[10px] font-mono font-bold text-emerald-300">Sovereign Data Verified</span>
          </div>
          <p className="text-[9px] font-mono text-slate-400 mt-0.5">
            myScheme • AGMARKNET • IMD WMO
          </p>
        </div>
      </div>
    </aside>
  );
};
