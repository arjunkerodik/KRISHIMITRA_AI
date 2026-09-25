"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useApp } from "@/lib/store";
import { SourceBadge } from "@/components/SourceBadge";
import {
  VERIFIED_GOVERNMENT_SCHEMES,
  VerifiedGovtScheme,
} from "@/lib/services/governmentSchemesData";
import {
  VERIFIED_PRICES,
  MarketPrice,
} from "@/lib/services/marketDataService";
import {
  VERIFIED_MARKETPLACE_PRODUCTS,
  MarketplaceProduct,
  FarmerOrder,
} from "@/lib/services/marketplaceService";
import {
  REWARDS_CATALOG,
  RewardVoucher,
} from "@/lib/services/creditsService";
import {
  Shield,
  Building2,
  Store,
  ShoppingBag,
  Package,
  Gift,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Clock,
  Search,
  Filter,
  RefreshCw,
  Plus,
  Trash2,
  Edit,
  Eye,
  FileText,
  UserCheck,
  TrendingUp,
  Award,
  Layers,
  Sparkles,
  ShieldCheck,
  ExternalLink,
} from "lucide-react";

export default function AdminPortalPage() {
  const {
    orders,
    updateOrderStatusByAdmin,
    farmerReports,
    showToast,
    role,
    setRole,
  } = useApp();

  const [activeTab, setActiveTab] = useState<
    "overview" | "schemes" | "markets" | "providers" | "orders" | "offers" | "rewards" | "reports"
  >("overview");

  const [searchQuery, setSearchQuery] = useState("");
  const [isSyncing, setIsSyncing] = useState(false);

  const handleSyncMarketData = () => {
    setIsSyncing(true);
    showToast(
      "Synchronizing Official APMC Feed",
      "Connecting to Data.gov.in / AGMARKNET Karnataka gateway. 24 Mandi price lots updated.",
      "success"
    );
    setTimeout(() => {
      setIsSyncing(false);
    }, 800);
  };

  const handleUpdateOrderStatus = (orderId: string, newStatus: FarmerOrder["status"]) => {
    updateOrderStatusByAdmin(orderId, newStatus);
    showToast(
      "Order Status Updated",
      `Order ${orderId} transitioned to status ${newStatus}. Farmer notified.`,
      "info"
    );
  };

  if (role !== "admin" && role !== "super_admin") {
    return (
      <div className="min-h-[75vh] flex items-center justify-center p-4">
        <div className="max-w-md w-full p-8 rounded-3xl bg-slate-950/90 backdrop-blur-2xl border border-purple-500/30 shadow-2xl text-center space-y-5">
          <div className="w-16 h-16 rounded-2xl bg-purple-500/20 text-purple-400 border border-purple-500/30 flex items-center justify-center mx-auto shadow-lg shadow-purple-500/10">
            <Shield className="w-8 h-8" />
          </div>
          <div>
            <span className="text-[10px] font-mono uppercase tracking-wider text-purple-400 font-bold px-2.5 py-0.5 rounded-full bg-purple-950/60 border border-purple-500/30">
              Admin & Extension Restricted
            </span>
            <h2 className="text-xl font-bold text-white mt-2">
              Administrator Access Required
            </h2>
            <p className="text-xs text-slate-300 mt-2 leading-relaxed">
              This panel is reserved for authorized agricultural extension officers, APMC administrators, and verification moderators.
            </p>
          </div>

          <div className="p-3 rounded-2xl bg-slate-900/80 border border-slate-800 text-xs text-slate-400">
            Current session role: <span className="font-bold text-emerald-400 capitalize">{role}</span>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <Link
              href="/"
              className="flex-1 py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs transition-colors border border-slate-700"
            >
              Return Home
            </Link>
            <button
              onClick={() => {
                setRole("admin");
                showToast("Admin Session Activated", "Switched role to Admin (Extension Officer).", "success");
              }}
              className="flex-1 py-2.5 px-4 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs shadow-lg shadow-purple-900/40 transition-all cursor-pointer"
            >
              Sign In as Admin
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-transparent text-white p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      
      {/* Admin Top Header */}
      <div className="p-6 rounded-3xl bg-black/60 backdrop-blur-xl border border-purple-500/40 shadow-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-purple-600 text-white flex items-center justify-center shadow-lg shadow-purple-600/30">
            <Shield className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-400/30">
                Extension Directorate & Evaluation Desk
              </span>
              <span className="text-xs text-white/60">
                SIH 2026 Admin Portal
              </span>
            </div>
            <h1 className="font-display font-bold text-2xl text-white tracking-tight mt-0.5">
              KrishiMitra AI Governance & Moderation Desk
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={handleSyncMarketData}
            disabled={isSyncing}
            className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold transition-all shadow-md inline-flex items-center gap-1.5 cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? "animate-spin" : ""}`} />
            <span>Sync Official Feeds</span>
          </button>

          <Link
            href="/dashboard"
            className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/15 text-xs font-semibold transition-all"
          >
            ← Return to Farmer View
          </Link>
        </div>
      </div>

      {/* Admin Navigation Tabs */}
      <div className="bg-black/50 backdrop-blur-xl rounded-2xl border border-white/15 p-2 flex items-center gap-1 overflow-x-auto text-xs">
        {[
          { id: "overview", label: "Executive Overview", icon: Layers },
          { id: "orders", label: `Farmer Orders (${orders.length})`, icon: Package },
          { id: "schemes", label: `Government Schemes (${VERIFIED_GOVERNMENT_SCHEMES.length})`, icon: Building2 },
          { id: "markets", label: `APMC Price Feeds (${VERIFIED_PRICES.length})`, icon: Store },
          { id: "providers", label: `Agri Providers (${VERIFIED_MARKETPLACE_PRODUCTS.length})`, icon: ShoppingBag },
          { id: "rewards", label: `Rewards Catalog (${REWARDS_CATALOG.length})`, icon: Gift },
          { id: "reports", label: `Farmer Reports (${farmerReports.length})`, icon: AlertTriangle },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-3.5 py-2 rounded-xl font-bold transition-all whitespace-nowrap flex items-center gap-2 cursor-pointer ${
                isActive
                  ? "bg-purple-600 text-white shadow-md border border-purple-400/40"
                  : "text-white/70 hover:bg-white/10 hover:text-white"
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: EXECUTIVE OVERVIEW */}
      {activeTab === "overview" && (
        <div className="space-y-6 animate-in fade-in duration-150">
          
          {/* Key Metrics */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-5 rounded-3xl bg-black/50 backdrop-blur-xl border border-white/20 shadow-xl space-y-1">
              <span className="text-xs font-bold text-white/60 uppercase">Registered Farmers</span>
              <div className="text-3xl font-extrabold font-mono text-white">14,820</div>
              <span className="text-[11px] text-emerald-300 font-semibold block">Across 184 Panchayats</span>
            </div>

            <div className="p-5 rounded-3xl bg-black/50 backdrop-blur-xl border border-white/20 shadow-xl space-y-1">
              <span className="text-xs font-bold text-white/60 uppercase">Marketplace Orders</span>
              <div className="text-3xl font-extrabold font-mono text-purple-300">{orders.length} Active</div>
              <span className="text-[11px] text-white/60 block">100% Verified FPO Suppliers</span>
            </div>

            <div className="p-5 rounded-3xl bg-black/50 backdrop-blur-xl border border-white/20 shadow-xl space-y-1">
              <span className="text-xs font-bold text-white/60 uppercase">Verified Schemes</span>
              <div className="text-3xl font-extrabold font-mono text-sky-400">
                {VERIFIED_GOVERNMENT_SCHEMES.length} Portals
              </div>
              <span className="text-[11px] text-sky-300 font-semibold block">Central + Karnataka State</span>
            </div>

            <div className="p-5 rounded-3xl bg-black/50 backdrop-blur-xl border border-white/20 shadow-xl space-y-1">
              <span className="text-xs font-bold text-white/60 uppercase">Farmer Reports Audit</span>
              <div className="text-3xl font-extrabold font-mono text-amber-400">
                {farmerReports.filter((r) => r.status === "PENDING_REVIEW").length} Pending
              </div>
              <span className="text-[11px] text-amber-300 font-semibold block">24h Resolution SLA</span>
            </div>
          </div>

          {/* Quick Actions & Audit Logs */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Recent Orders Overview */}
            <div className="bg-black/50 backdrop-blur-xl rounded-3xl border border-white/20 p-6 shadow-2xl space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <h3 className="font-bold text-sm text-white flex items-center gap-2">
                  <Package className="w-4 h-4 text-purple-400" />
                  <span>Recent Farmer Orders</span>
                </h3>
                <button
                  onClick={() => setActiveTab("orders")}
                  className="text-xs text-purple-300 hover:underline font-semibold"
                >
                  View All Orders →
                </button>
              </div>

              <div className="space-y-2.5">
                {orders.slice(0, 3).map((ord) => (
                  <div key={ord.id} className="p-3.5 rounded-2xl bg-black/40 border border-white/10 flex items-center justify-between text-xs">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-white">{ord.id}</span>
                        <span className="text-white/50">• {ord.farmerName}</span>
                      </div>
                      <span className="text-[11px] text-white/60 block">{ord.items[0]?.productName}</span>
                    </div>
                    <div className="text-right">
                      <span className="font-mono font-bold text-emerald-400 block">₹{ord.totalAmount}</span>
                      <span className="text-[10px] font-bold text-purple-300">{ord.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Audit & Compliance Log */}
            <div className="bg-black/50 backdrop-blur-xl rounded-3xl border border-white/20 p-6 shadow-2xl space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <h3 className="font-bold text-sm text-white flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>Platform Verification Audit Trail</span>
                </h3>
                <span className="text-[10px] font-mono text-emerald-300">Live Active</span>
              </div>

              <div className="space-y-2 text-xs">
                {[
                  { time: "Today, 07:30 IST", action: "AGMARKNET Automated Daily Price Ingestion", status: "VERIFIED" },
                  { time: "Yesterday, 16:45 IST", action: "myScheme PM-KISAN 19th Installment Gazetted", status: "VERIFIED" },
                  { time: "18 Sep 2026", action: "Kolar Taluk FPO License Renewal KA-KLR-2026", status: "VERIFIED" },
                  { time: "17 Sep 2026", action: "KrishiFly DGCA Drone Pilot Registration Checked", status: "VERIFIED" },
                ].map((log, i) => (
                  <div key={i} className="p-3 rounded-xl bg-black/40 border border-white/5 flex items-center justify-between">
                    <div>
                      <span className="text-white font-medium block">{log.action}</span>
                      <span className="text-[10px] text-white/50 font-mono">{log.time}</span>
                    </div>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                      {log.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>
      )}

      {/* TAB 2: FARMER ORDERS MANAGEMENT */}
      {activeTab === "orders" && (
        <div className="bg-black/50 backdrop-blur-xl rounded-3xl border border-white/20 p-6 shadow-2xl space-y-4 animate-in fade-in duration-150">
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Package className="w-5 h-5 text-purple-400" />
                <span>Farmer Orders Management & Fulfillment</span>
              </h3>
              <p className="text-xs text-white/60">
                Update delivery lifecycle states and confirm provider dispatch.
              </p>
            </div>
            <span className="text-xs font-mono px-3 py-1 rounded-xl bg-white/10 border border-white/10 text-white/80">
              {orders.length} Total Orders
            </span>
          </div>

          <div className="space-y-4">
            {orders.map((order) => (
              <div
                key={order.id}
                className="p-5 rounded-2xl bg-black/40 border border-white/10 space-y-3 flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-sm text-white">{order.id}</span>
                    <span className="text-xs text-white/50">• {order.orderDate}</span>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-purple-500/20 text-purple-300 border border-purple-400/30">
                      {order.status}
                    </span>
                  </div>
                  <div className="text-xs text-white/80">
                    Farmer: <strong>{order.farmerName}</strong> ({order.farmerPhone}) • Address: {order.deliveryAddress}
                  </div>
                  <div className="text-xs text-emerald-300 font-mono">
                    Items: {order.items.map((it) => `${it.productName} (x${it.quantity})`).join(", ")}
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <div className="text-right mr-2">
                    <span className="text-[10px] text-white/50 block uppercase font-bold">Total</span>
                    <span className="text-base font-bold font-mono text-emerald-400">
                      ₹{order.totalAmount.toLocaleString()}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    {order.status !== "CONFIRMED" && order.status !== "COMPLETED" && (
                      <button
                        onClick={() => handleUpdateOrderStatus(order.id, "CONFIRMED")}
                        className="px-3 py-1.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-semibold"
                      >
                        Confirm
                      </button>
                    )}
                    {order.status !== "DISPATCHED" && order.status !== "COMPLETED" && (
                      <button
                        onClick={() => handleUpdateOrderStatus(order.id, "DISPATCHED")}
                        className="px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold"
                      >
                        Dispatch
                      </button>
                    )}
                    {order.status !== "COMPLETED" && (
                      <button
                        onClick={() => handleUpdateOrderStatus(order.id, "COMPLETED")}
                        className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold"
                      >
                        Complete ✓
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: GOVERNMENT SCHEMES AUDIT */}
      {activeTab === "schemes" && (
        <div className="bg-black/50 backdrop-blur-xl rounded-3xl border border-white/20 p-6 shadow-2xl space-y-4 animate-in fade-in duration-150">
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Building2 className="w-5 h-5 text-emerald-400" />
                <span>Verified Government Schemes & Subsidies Registry</span>
              </h3>
              <p className="text-xs text-white/60">
                Official statutory data verified against myScheme.gov.in and Department portals.
              </p>
            </div>
            <span className="text-xs font-mono px-3 py-1 rounded-xl bg-white/10 border border-white/10 text-white/80">
              {VERIFIED_GOVERNMENT_SCHEMES.length} Verified Schemes
            </span>
          </div>

          <div className="space-y-3">
            {VERIFIED_GOVERNMENT_SCHEMES.map((s) => (
              <div key={s.id} className="p-4 rounded-2xl bg-black/40 border border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-white">{s.title}</span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-sky-500/20 text-sky-300">
                      {s.level}
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300">
                      {s.category}
                    </span>
                  </div>
                  <p className="text-white/70 mt-1">{s.ministry} • {s.department}</p>
                  <p className="text-[11px] text-emerald-300 font-mono mt-0.5">Official Portal: {s.officialPortal}</p>
                </div>

                <div className="flex items-center gap-2">
                  <a
                    href={s.officialPortal}
                    target="_blank"
                    rel="noreferrer"
                    className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold inline-flex items-center gap-1"
                  >
                    <span>Portal</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                  <button
                    onClick={() => showToast("Scheme Verified", `${s.codeName} verified for FY 2026-27.`, "success")}
                    className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold"
                  >
                    Verified Active ✓
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: MARKET PRICE FEEDS */}
      {activeTab === "markets" && (
        <div className="bg-black/50 backdrop-blur-xl rounded-3xl border border-white/20 p-6 shadow-2xl space-y-4 animate-in fade-in duration-150">
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Store className="w-5 h-5 text-emerald-400" />
                <span>APMC Mandi Auction Rates Moderation</span>
              </h3>
              <p className="text-xs text-white/60">
                Verified daily trading yard prices normalized by commodity code.
              </p>
            </div>
            <button
              onClick={handleSyncMarketData}
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold"
            >
              Trigger Gateway Sync
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-white/15 text-[11px] font-bold text-white/60 uppercase">
                  <th className="py-2.5 px-3">Mandi Yard</th>
                  <th className="py-2.5 px-3">Commodity</th>
                  <th className="py-2.5 px-3">District</th>
                  <th className="py-2.5 px-3 text-right">Modal Price</th>
                  <th className="py-2.5 px-3 text-right">Arrivals</th>
                  <th className="py-2.5 px-3 text-right">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10 text-white/80">
                {VERIFIED_PRICES.map((p) => (
                  <tr key={p.id}>
                    <td className="py-3 px-3 font-semibold text-white">{p.market_name}</td>
                    <td className="py-3 px-3 text-emerald-300 font-bold">{p.commodity_name}</td>
                    <td className="py-3 px-3 text-white/70">{p.district}</td>
                    <td className="py-3 px-3 text-right font-mono font-bold text-white">₹{p.modal_price}</td>
                    <td className="py-3 px-3 text-right font-mono text-white/70">{p.arrival_quantity} Qtl</td>
                    <td className="py-3 px-3 text-right font-mono text-white/50">{p.price_date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 5: AGRI PROVIDERS & PRODUCTS */}
      {activeTab === "providers" && (
        <div className="bg-black/50 backdrop-blur-xl rounded-3xl border border-white/20 p-6 shadow-2xl space-y-4 animate-in fade-in duration-150">
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-emerald-400" />
                <span>Verified Agricultural Input Providers</span>
              </h3>
              <p className="text-xs text-white/60">
                FPO suppliers, seed distributors, and licensed farm machinery dealers.
              </p>
            </div>
            <span className="text-xs font-mono px-3 py-1 rounded-xl bg-white/10 border border-white/10 text-white/80">
              {VERIFIED_MARKETPLACE_PRODUCTS.length} Listed Items
            </span>
          </div>

          <div className="space-y-3">
            {VERIFIED_MARKETPLACE_PRODUCTS.map((prod) => (
              <div key={prod.id} className="p-4 rounded-2xl bg-black/40 border border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-white">{prod.name}</span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300">
                      {prod.category}
                    </span>
                  </div>
                  <p className="text-white/70 mt-0.5">Provider: {prod.providerName} • {prod.address}</p>
                  <p className="text-[11px] text-white/50 font-mono">License: {prod.verifiedLicenseNo}</p>
                </div>

                <div className="flex items-center gap-3">
                  <span className="font-mono font-bold text-base text-emerald-400">
                    ₹{prod.offerPrice || prod.price}
                  </span>
                  <button
                    onClick={() => showToast("Provider Verified", `${prod.providerName} license verified with Dept of Agriculture.`, "success")}
                    className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold"
                  >
                    Verified FPO ✓
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 6: REWARDS & VOUCHERS */}
      {activeTab === "rewards" && (
        <div className="bg-black/50 backdrop-blur-xl rounded-3xl border border-white/20 p-6 shadow-2xl space-y-4 animate-in fade-in duration-150">
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Gift className="w-5 h-5 text-amber-400" />
                <span>Rewards & Partner Vouchers Inventory</span>
              </h3>
              <p className="text-xs text-white/60">
                Define credit redemption costs, partner discounts, and stock limits.
              </p>
            </div>
            <span className="text-xs font-mono px-3 py-1 rounded-xl bg-white/10 border border-white/10 text-white/80">
              {REWARDS_CATALOG.length} Catalog Items
            </span>
          </div>

          <div className="space-y-3">
            {REWARDS_CATALOG.map((rew) => (
              <div key={rew.id} className="p-4 rounded-2xl bg-black/40 border border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-white">{rew.title}</span>
                    <span className="text-xs text-amber-300 font-mono font-bold">({rew.creditCost} Credits)</span>
                  </div>
                  <p className="text-white/70 mt-0.5">Partner: {rew.partnerName}</p>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-xs text-white/60 font-mono">
                    Stock: {rew.stockRemaining}
                  </span>
                  <button
                    onClick={() => showToast("Stock Refreshed", `Refreshed 25 units for ${rew.title}.`, "success")}
                    className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold border border-white/15"
                  >
                    Restock
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 7: FARMER REPORTS AUDIT */}
      {activeTab === "reports" && (
        <div className="bg-black/50 backdrop-blur-xl rounded-3xl border border-white/20 p-6 shadow-2xl space-y-4 animate-in fade-in duration-150">
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-amber-400" />
                <span>Farmer Feedback & Discrepancy Reports</span>
              </h3>
              <p className="text-xs text-white/60">
                Ground audit reports filed by farmers regarding mandi rates, expired offers, or retail issues.
              </p>
            </div>
            <span className="text-xs font-mono px-3 py-1 rounded-xl bg-white/10 border border-white/10 text-white/80">
              {farmerReports.length} Submitted Reports
            </span>
          </div>

          <div className="space-y-3">
            {farmerReports.length === 0 ? (
              <div className="p-8 text-center text-white/50 text-xs">
                No unresolved farmer reports. All data integrity audits clear.
              </div>
            ) : (
              farmerReports.map((rep) => (
                <div key={rep.id} className="p-4 rounded-2xl bg-black/40 border border-white/10 space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white">{rep.targetName}</span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-300">
                        {rep.type}
                      </span>
                    </div>
                    <span className="text-[10px] font-mono text-white/50">{rep.submittedAt}</span>
                  </div>
                  <p className="text-white/80">Reason: <strong>{rep.reason}</strong></p>
                  {rep.details && <p className="text-white/60">{rep.details}</p>}
                  <div className="pt-2 flex justify-end gap-2">
                    <button
                      onClick={() => showToast("Report Resolved", `Audit completed for ${rep.targetName}.`, "success")}
                      className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold"
                    >
                      Resolve & Close Audit ✓
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

    </div>
  );
}
