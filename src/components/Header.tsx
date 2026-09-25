"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useApp, UserRole } from "@/lib/store";
import { Language } from "@/lib/i18n";
import {
  Sprout,
  Globe,
  Sun,
  Moon,
  Bell,
  User,
  Sparkles,
  Menu,
  X,
  CheckCircle2,
  AlertTriangle,
  Info,
  LogOut,
  ChevronDown,
  Radio,
  Coins,
  Activity,
  Layers,
  MapPin,
  Clock,
  LayoutDashboard,
  Landmark,
  ShoppingBag,
  Settings,
  Shield,
  MoreHorizontal,
} from "lucide-react";

interface HeaderProps {
  onToggleMobileMenu?: () => void;
  isMobileMenuOpen?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  onToggleMobileMenu,
  isMobileMenuOpen: externalMobileMenuOpen,
}) => {
  const pathname = usePathname();
  const router = useRouter();
  const {
    role,
    setRole,
    user,
    language,
    setLanguage,
    t,
    isDarkMode,
    toggleDarkMode,
    notifications,
    unreadNotificationsCount,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    creditsBalance,
    offlineStatus,
  } = useApp();

  const [localMobileMenuOpen, setLocalMobileMenuOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showLangMenu, setShowLangMenu] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const [timeStr, setTimeStr] = useState<string>("");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeStr(
        now.toLocaleTimeString("en-IN", {
          hour12: false,
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          timeZone: "Asia/Kolkata",
        }) + " IST"
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const isMobileMenuOpen = externalMobileMenuOpen ?? localMobileMenuOpen;
  const toggleMobileMenu = () => {
    if (onToggleMobileMenu) {
      onToggleMobileMenu();
    } else {
      setLocalMobileMenuOpen(!localMobileMenuOpen);
    }
  };

  const primaryNavLinks = [
    { href: "/", label: t.nav?.overview || "Home" },
    { href: "/farmtalk", label: t.nav?.farmtalk || "Ask AI (FarmTalk)" },
    { href: "/crops", label: t.nav?.cropAdvisor || "My Crop" },
    { href: "/market", label: t.nav?.market || "Market" },
  ];

  const moreLinks = [
    { href: "/dashboard", label: t.nav?.digitalTwin || "My Farm", icon: LayoutDashboard, desc: "Field status & live advisory" },
    { href: "/schemes", label: t.nav?.schemes || "Govt Schemes", icon: Landmark, desc: "Subsidies & DBT benefits" },
    { href: "/marketplace", label: t.nav?.marketplace || "Marketplace", icon: ShoppingBag, desc: "Seeds, fertilizers & inputs" },
    { href: "/credits", label: t.nav?.credits || "Credits & Rewards", icon: Coins, desc: "Earn tokens & claim vouchers" },
    { href: "/settings", label: t.nav?.settings || "Settings", icon: Settings, desc: "Language & farmer profile" },
    ...(role === "admin"
      ? [{ href: "/admin", label: t.nav?.admin || "Admin Desk", icon: Shield, desc: "Price feed & verification moderation" }]
      : []),
  ];

  const languages: { code: Language; label: string; native: string }[] = [
    { code: "en", label: "English", native: "English" },
    { code: "hi", label: "Hindi", native: "हिन्दी" },
    { code: "kn", label: "Kannada", native: "ಕನ್ನಡ" },
    { code: "te", label: "Telugu", native: "తెలుగు" },
    { code: "ta", label: "Tamil", native: "தமிழ்" },
    { code: "mr", label: "Marathi", native: "मराठी" },
  ];

  const roles: { role: UserRole; label: string }[] = [
    { role: "farmer", label: "Farmer (Ramesh)" },
    { role: "expert", label: "Agri Expert (Dr. Rao)" },
    { role: "admin", label: "Admin (Extension)" },
  ];

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-slate-950/85 backdrop-blur-2xl border-b border-slate-800/80 text-white transition-all shadow-[0_4px_30px_rgba(0,0,0,0.5)] pt-[max(0rem,env(safe-area-inset-top))]">
      
      {/* 1. TOP STATUS STRIP — plain language, no jargon */}
      <div className="hidden md:flex items-center justify-between px-4 sm:px-6 lg:px-8 py-1 bg-slate-900/90 border-b border-slate-800/60 text-[10px] font-mono text-slate-400 tracking-wider">
        <div className="flex items-center gap-4">
          {/* Connection status */}
          <div className={`flex items-center gap-1.5 font-bold ${offlineStatus?.isOffline ? "text-amber-400" : "text-emerald-400"}`}>
            <span className="relative flex h-2 w-2">
              <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${offlineStatus?.isOffline ? "bg-amber-400" : "bg-emerald-400"}`}></span>
              <span className={`relative inline-flex rounded-full h-2 w-2 ${offlineStatus?.isOffline ? "bg-amber-500" : "bg-emerald-500"}`}></span>
            </span>
            <span>
              {offlineStatus?.isOffline
                ? `Offline — showing saved data`
                : "Mandi prices: Live"}
            </span>
          </div>
          <span className="text-slate-600">|</span>
          <div className="flex items-center gap-1 text-slate-300">
            <MapPin className="w-3 h-3 text-cyan-400" />
            <span>{user?.district || "Gadag, Karnataka"}</span>
          </div>
          <span className="text-slate-600">|</span>
          <div className="flex items-center gap-1 text-emerald-400">
            <Activity className="w-3 h-3" />
            <span>Verified by IMD · AGMARKNET · myScheme</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 text-amber-300 font-semibold bg-amber-950/60 px-2 py-0.5 rounded border border-amber-500/30">
            <Clock className="w-3 h-3" />
            <span>{timeStr || "IST"}</span>
          </div>
          <Link
            href="/credits"
            className="flex items-center gap-1 text-emerald-300 font-bold bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/30 hover:bg-emerald-900/60 transition-colors"
          >
            <Coins className="w-3 h-3 text-amber-400" />
            <span>{creditsBalance} Credits</span>
          </Link>
        </div>
      </div>

      {/* 2. MAIN NAVIGATION BAR */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-15 flex items-center justify-between gap-4">
        
        {/* LEFT: App Logo (Farmer Centered) */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={toggleMobileMenu}
            className="lg:hidden p-2 rounded-lg text-white/80 hover:bg-slate-800 transition-colors focus:outline-none"
            aria-label="Toggle navigation menu"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-cyan-600 flex items-center justify-center text-white shadow-lg shadow-emerald-500/20 group-hover:scale-105 transition-all border border-emerald-400/40">
              <Sprout className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="font-sans font-extrabold text-base text-white tracking-tight leading-none block group-hover:text-emerald-300 transition-colors">
                KrishiMitra AI
              </span>
              <span className="text-[10px] tracking-wider text-emerald-400 block font-semibold">
                Smart Farmer Companion
              </span>
            </div>
          </Link>
        </div>

        {/* CENTER: Main Navigation Links (4 Primary Items + More Drawer) */}
        <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
          {primaryNavLinks.map((link) => {
            const active = isActive(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  active
                    ? "text-emerald-300 bg-emerald-950/60 border border-emerald-500/40 shadow-[0_0_12px_rgba(16,185,129,0.2)] font-mono"
                    : "text-slate-300 hover:text-white hover:bg-slate-800/70 border border-transparent"
                }`}
              >
                {link.label}
              </Link>
            );
          })}

          {/* More Menu Dropdown */}
          <div className="relative">
            <button
              onClick={() => {
                setShowMoreMenu(!showMoreMenu);
                setShowNotifications(false);
                setShowLangMenu(false);
                setShowProfileMenu(false);
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1 transition-all cursor-pointer ${
                showMoreMenu || moreLinks.some((l) => isActive(l.href))
                  ? "text-emerald-300 bg-slate-850 border border-emerald-500/30"
                  : "text-slate-300 hover:text-white hover:bg-slate-800/70 border border-transparent"
              }`}
            >
              <span>More</span>
              <ChevronDown className={`w-3.5 h-3.5 transition-transform ${showMoreMenu ? "rotate-180" : ""}`} />
            </button>

            {showMoreMenu && (
              <div className="absolute left-0 mt-2 w-64 bg-slate-950/95 backdrop-blur-2xl rounded-2xl shadow-2xl border border-slate-700/80 p-2 z-50 animate-in fade-in zoom-in-95 duration-100 space-y-1">
                <div className="px-3 py-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Additional Services
                </div>
                {moreLinks.map((item) => {
                  const Icon = item.icon;
                  const active = isActive(item.href);
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setShowMoreMenu(false)}
                      className={`flex items-start gap-2.5 p-2 rounded-xl text-xs transition-colors ${
                        active
                          ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                          : "text-slate-200 hover:bg-white/10"
                      }`}
                    >
                      <Icon className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                      <div>
                        <div className="font-semibold text-white">{item.label}</div>
                        <div className="text-[10px] text-slate-400 leading-tight">{item.desc}</div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        </nav>

        {/* RIGHT: Actions, Notifications, Language, Profile & CTA */}
        <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
          
          {/* Primary CTA: Ask FarmTalk AI */}
          <Link
            href="/farmtalk"
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-semibold shadow-md shadow-emerald-900/30 border border-emerald-400/30 transition-all active:scale-98"
          >
            <Sparkles className="w-3.5 h-3.5 text-emerald-200" />
            <span>FarmTalk AI</span>
          </Link>

          {/* Language Switcher */}
          <div className="relative">
            <button
              onClick={() => {
                setShowLangMenu(!showLangMenu);
                setShowNotifications(false);
                setShowProfileMenu(false);
              }}
              className="p-2 rounded-xl text-white/80 hover:bg-white/10 flex items-center gap-1 text-xs font-semibold transition-colors border border-white/10"
              aria-label="Change language"
            >
              <Globe className="w-4 h-4 text-emerald-400" />
              <span className="uppercase text-[11px] hidden sm:inline">{language}</span>
            </button>

            {showLangMenu && (
              <div className="absolute right-0 mt-2 w-44 bg-black/85 backdrop-blur-2xl rounded-2xl shadow-2xl border border-white/20 py-1.5 z-50 animate-in fade-in zoom-in-95 duration-100 text-white">
                <div className="px-3.5 py-1.5 text-[10px] font-bold text-white/50 uppercase tracking-wider">
                  Language
                </div>
                {languages.map((l) => (
                  <button
                    key={l.code}
                    onClick={() => {
                      setLanguage(l.code);
                      setShowLangMenu(false);
                    }}
                    className={`w-full text-left px-3.5 py-2 text-xs flex items-center justify-between hover:bg-white/10 transition-colors ${
                      language === l.code ? "text-emerald-300 font-bold bg-emerald-500/20" : "text-white/85"
                    }`}
                  >
                    <span>{l.native}</span>
                    <span className="text-[10px] text-white/50">{l.label}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Theme Toggle */}
          <button
            onClick={toggleDarkMode}
            className="p-2 rounded-xl text-white/80 hover:bg-white/10 transition-colors border border-white/10"
            aria-label="Toggle Theme"
          >
            {isDarkMode ? <Sun className="w-4 h-4 text-amber-300" /> : <Moon className="w-4 h-4 text-white/80" />}
          </button>

          {/* Notifications Dropdown */}
          <div className="relative">
            <button
              onClick={() => {
                setShowNotifications(!showNotifications);
                setShowLangMenu(false);
                setShowProfileMenu(false);
              }}
              className="p-2 rounded-xl text-white/80 hover:bg-white/10 relative transition-colors border border-white/10"
              aria-label="Notifications"
            >
              <Bell className="w-4 h-4" />
              {unreadNotificationsCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-black" />
              )}
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 sm:w-88 bg-black/85 backdrop-blur-2xl rounded-2xl shadow-2xl border border-white/20 py-2 z-50 text-white animate-in fade-in zoom-in-95 duration-100">
                <div className="px-4 py-2 border-b border-white/10 flex items-center justify-between">
                  <span className="font-semibold text-xs text-white">Notifications</span>
                  {unreadNotificationsCount > 0 && (
                    <button
                      onClick={markAllNotificationsAsRead}
                      className="text-[11px] text-emerald-400 font-medium hover:underline"
                    >
                      Mark all read
                    </button>
                  )}
                </div>
                <div className="max-h-72 overflow-y-auto divide-y divide-white/10">
                  {notifications.length === 0 ? (
                    <div className="p-4 text-center text-xs text-white/50">No new alerts</div>
                  ) : (
                    notifications.map((n) => (
                      <div
                        key={n.id}
                        onClick={() => markNotificationAsRead(n.id)}
                        className={`p-3 hover:bg-white/10 cursor-pointer transition-colors ${
                          !n.read ? "bg-emerald-500/10" : ""
                        }`}
                      >
                        <div className="flex items-start gap-2.5">
                          <div className="mt-0.5 shrink-0">
                            {n.type === "warning" && <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />}
                            {n.type === "alert" && <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />}
                            {n.type === "success" && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
                            {n.type === "info" && <Info className="w-3.5 h-3.5 text-sky-400" />}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-1">
                              <h4 className="text-xs font-semibold text-white truncate">{n.title}</h4>
                              <span className="text-[10px] text-white/50 shrink-0">{n.timestamp}</span>
                            </div>
                            <p className="text-[11px] text-white/70 mt-0.5 line-clamp-2">{n.message}</p>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
                <div className="p-2 border-t border-white/10 text-center">
                  <Link
                    href="/weather/alerts"
                    onClick={() => setShowNotifications(false)}
                    className="text-xs text-emerald-400 font-medium hover:underline"
                  >
                    View all weather & farm alerts
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* Farmer Profile / Role Menu */}
          <div className="relative">
            <button
              onClick={() => {
                setShowProfileMenu(!showProfileMenu);
                setShowNotifications(false);
                setShowLangMenu(false);
              }}
              className="flex items-center gap-2 p-1.5 sm:px-2.5 sm:py-1 rounded-xl border border-white/15 bg-black/40 hover:bg-white/10 transition-colors"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={user.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"}
                alt={user.name}
                className="w-6 h-6 rounded-full object-cover ring-1 ring-emerald-400"
              />
              <span className="text-xs font-medium text-white hidden sm:inline">
                {user.name.split(" ")[0]}
              </span>
              <ChevronDown className="w-3 h-3 text-white/60 hidden sm:inline" />
            </button>

            {showProfileMenu && (
              <div className="absolute right-0 mt-2 w-56 bg-black/85 backdrop-blur-2xl rounded-2xl shadow-2xl border border-white/20 py-1.5 z-50 animate-in fade-in zoom-in-95 duration-100 text-white">
                <div className="px-3.5 py-2 border-b border-white/10">
                  <p className="text-xs font-bold text-white truncate">{user.name}</p>
                  <p className="text-[11px] text-emerald-300 capitalize">{role} · {user.district}</p>
                </div>

                <div className="py-1">
                  <Link
                    href="/settings"
                    onClick={() => setShowProfileMenu(false)}
                    className="flex items-center gap-2 px-3.5 py-2 text-xs text-white/85 hover:bg-white/10 transition-colors touch-target"
                  >
                    <User className="w-3.5 h-3.5 text-emerald-400" />
                    <span>My Profile & Settings</span>
                  </Link>
                  {role === "admin" && (
                    <Link
                      href="/admin"
                      onClick={() => setShowProfileMenu(false)}
                      className="flex items-center gap-2 px-3.5 py-2 text-xs text-purple-300 hover:bg-white/10 transition-colors touch-target"
                    >
                      <Shield className="w-3.5 h-3.5 text-purple-400" />
                      <span>Admin Dashboard</span>
                    </Link>
                  )}
                </div>

                <div className="pt-1 border-t border-white/10">
                  <Link
                    href="/login"
                    onClick={() => setShowProfileMenu(false)}
                    className="flex items-center gap-2 px-3.5 py-2 text-xs text-rose-400 hover:bg-rose-950/40 transition-colors touch-target"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Sign Out</span>
                  </Link>
                </div>
              </div>
            )}
          </div>

        </div>
      </div>

      {/* MOBILE DRAWER NAVIGATION */}
      {isMobileMenuOpen && (
        <div className="lg:hidden border-t border-white/15 bg-black/90 backdrop-blur-2xl px-4 pt-3 pb-6 space-y-3 shadow-2xl animate-in slide-in-from-top-2 duration-150 text-white">
          <div className="space-y-1">
            <div className="px-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              Farmer Menu
            </div>
            {primaryNavLinks.map((link) => {
              const active = isActive(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setLocalMobileMenuOpen(false)}
                  className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                    active
                      ? "text-emerald-300 bg-emerald-500/20 border border-emerald-400/30 font-semibold"
                      : "text-white/80 hover:bg-white/10"
                  }`}
                >
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </div>

          <div className="pt-2 border-t border-slate-800 space-y-1">
            <div className="px-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              More Services
            </div>
            <div className="grid grid-cols-2 gap-2">
              {moreLinks.map((link) => {
                const Icon = link.icon;
                const active = isActive(link.href);
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setLocalMobileMenuOpen(false)}
                    className={`flex items-center gap-2 p-2.5 rounded-xl text-xs font-medium transition-colors border ${
                      active
                        ? "text-emerald-300 bg-emerald-500/20 border-emerald-400/30 font-semibold"
                        : "text-white/80 bg-slate-900/60 border-slate-800 hover:bg-white/10"
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span className="truncate">{link.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>

          <div className="pt-2">
            <Link
              href="/farmtalk"
              onClick={() => setLocalMobileMenuOpen(false)}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white text-sm font-semibold shadow-md active:scale-98 transition-transform"
            >
              <Sparkles className="w-4 h-4 text-emerald-100" />
              <span>Ask FarmTalk AI</span>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};
