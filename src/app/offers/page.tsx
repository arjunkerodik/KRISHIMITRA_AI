"use client";

import React, { useState } from "react";
import Link from "next/link";
import { FarmerSidebar } from "@/components/FarmerSidebar";
import { useApp } from "@/lib/store";
import { SourceBadge } from "@/components/SourceBadge";
import {
  Tag,
  Percent,
  Clock,
  MapPin,
  Building2,
  Phone,
  ShieldCheck,
  AlertTriangle,
  ShoppingCart,
  CheckCircle2,
  ExternalLink,
  Search,
  Filter,
  X,
  Sparkles,
  Info,
} from "lucide-react";
import {
  VERIFIED_MARKETPLACE_PRODUCTS,
  MarketplaceProduct,
} from "@/lib/services/marketplaceService";

export default function OffersPage() {
  const { addToCart, showToast, submitFarmerReport } = useApp();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [reportOfferModal, setReportOfferModal] = useState<MarketplaceProduct | null>(null);
  const [reportReason, setReportReason] = useState("Price discrepancy / Not honored by shop");
  const [reportDetails, setReportDetails] = useState("");

  const todayStr = new Date().toISOString().split("T")[0];

  // Filter only products that have genuine offers and are not expired
  const activeOffers = VERIFIED_MARKETPLACE_PRODUCTS.filter((p) => {
    if (!p.offerPrice || !p.offerDiscountPercent || !p.offerExpiry) return false;
    const isNotExpired = p.offerExpiry >= todayStr;
    const matchesCategory = selectedCategory === "All" || p.category === selectedCategory;
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.providerName.toLowerCase().includes(searchQuery.toLowerCase());
    return isNotExpired && matchesCategory && matchesSearch;
  });

  const categories = [
    "All",
    "Seeds",
    "Fertilizers",
    "Organic Inputs",
    "Machinery",
    "Crop Protection",
    "Local Agricultural Services",
  ];

  const handleReportSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reportOfferModal) return;

    submitFarmerReport({
      type: "EXPIRED_OFFER",
      targetId: reportOfferModal.id,
      targetName: reportOfferModal.name,
      reason: reportReason,
      details: reportDetails,
    });

    showToast(
      "Offer Report Received",
      `Report filed for ${reportOfferModal.name}. Our district extension admin will audit this provider within 24 hours.`,
      "warning"
    );

    setReportOfferModal(null);
    setReportDetails("");
  };

  return (
    <div className="min-h-screen flex bg-transparent text-white">
      <div className="hidden lg:block w-64 shrink-0">
        <div className="fixed top-16 bottom-0 w-64">
          <FarmerSidebar />
        </div>
      </div>

      <div className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="p-6 rounded-3xl bg-black/50 backdrop-blur-xl border border-white/20 shadow-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-400/30 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>Verified Seasonal Discounts & Rebates</span>
              </span>
              <span className="text-xs text-white/70">
                FPO & Raitha Seva Kendra Partners
              </span>
            </div>
            <h1 className="font-display font-bold text-2xl sm:text-3xl text-white tracking-tight mt-1 flex items-center gap-2.5">
              <Tag className="w-7 h-7 text-amber-400" />
              <span>Farmer Offers & Discounts Hub</span>
            </h1>
            <p className="text-xs sm:text-sm text-white/70 mt-0.5">
              Genuine seasonal input subsidies and partner FPO promotions. All offers have strict validity dates and verified stock.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/marketplace"
              className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/15 text-xs font-bold transition-all"
            >
              ← Full Marketplace
            </Link>
            <Link
              href="/rewards"
              className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow-lg border border-emerald-400/40"
            >
              KrishiMitra Rewards
            </Link>
          </div>
        </div>

        {/* 1. CONTROLS: SEARCH & CATEGORY FILTERS */}
        <div className="bg-black/50 backdrop-blur-xl rounded-3xl border border-white/20 p-6 shadow-2xl space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-white/10">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Filter className="w-4 h-4 text-amber-400" />
                <span>Filter Active Offers</span>
              </h3>
              <p className="text-xs text-white/60">
                Only authenticated offers from verified sellers. Expired offers are auto-purged.
              </p>
            </div>

            <div className="relative w-full md:w-80">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40" />
              <input
                type="text"
                placeholder="Search offer discounts, seeds, fertilizers..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full text-xs rounded-xl border border-white/20 bg-black/60 text-white placeholder-white/40 pl-10 pr-3.5 py-2.5 focus:outline-none focus:border-amber-400"
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-1.5">
            {categories.map((c) => (
              <button
                key={c}
                onClick={() => setSelectedCategory(c)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  selectedCategory === c
                    ? "bg-amber-600 text-white shadow-md border border-amber-400/40"
                    : "bg-black/40 text-white/70 hover:bg-white/10 hover:text-white border border-white/10"
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        {/* 2. OFFERS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {activeOffers.map((p) => {
            const discountAmount = p.price - (p.offerPrice || p.price);

            return (
              <div
                key={p.id}
                className="bg-black/50 backdrop-blur-xl rounded-3xl border border-white/20 p-5 shadow-2xl flex flex-col justify-between hover:border-amber-400/50 transition-all text-white space-y-4 group relative overflow-hidden"
              >
                {/* Ribbon Tag */}
                <div className="absolute top-4 right-4 z-10">
                  <span className="px-3 py-1 rounded-full text-xs font-black uppercase bg-gradient-to-r from-amber-500 to-rose-500 text-black shadow-lg">
                    {p.offerDiscountPercent}% OFF
                  </span>
                </div>

                <div>
                  <div className="relative rounded-2xl overflow-hidden h-40 bg-black/40 border border-white/10 mb-3">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={p.imageUrl}
                      alt={p.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute bottom-2 left-2 flex items-center gap-1.5">
                      <span className="px-2 py-0.5 rounded-lg text-[10px] font-bold bg-black/80 backdrop-blur-md text-amber-300 border border-amber-400/40 flex items-center gap-1">
                        <Clock className="w-3 h-3 text-amber-400" />
                        <span>Valid until {p.offerExpiry}</span>
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 text-[11px] text-emerald-300 font-semibold mb-1">
                    <Building2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span className="truncate">{p.providerName}</span>
                  </div>

                  <h3 className="font-bold text-sm text-white line-clamp-2">
                    {p.name}
                  </h3>

                  {/* Pricing Box */}
                  <div className="mt-2.5 p-3 rounded-2xl bg-black/40 border border-white/10 flex items-baseline justify-between">
                    <div>
                      <div className="flex items-baseline gap-2">
                        <span className="text-2xl font-extrabold font-mono text-amber-400">
                          ₹{p.offerPrice}
                        </span>
                        <span className="text-xs text-white/50 line-through font-mono">
                          ₹{p.price}
                        </span>
                      </div>
                      <span className="text-[10px] text-white/60 block font-semibold text-emerald-300">
                        You Save ₹{discountAmount} ({p.unit})
                      </span>
                    </div>

                    <span className="text-[10px] font-semibold text-emerald-300 bg-emerald-500/20 px-2 py-0.5 rounded-full border border-emerald-500/30">
                      {p.availability}
                    </span>
                  </div>

                  {/* Terms */}
                  {p.offerTerms && (
                    <div className="mt-3 space-y-1 text-[11px] text-white/70 bg-black/30 p-2.5 rounded-xl border border-white/5">
                      <span className="font-bold text-white/90 block">Terms & Conditions:</span>
                      {p.offerTerms.map((t, idx) => (
                        <p key={idx}>• {t}</p>
                      ))}
                    </div>
                  )}

                  <div className="mt-2 flex items-center gap-1.5 text-[11px] text-white/60">
                    <MapPin className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                    <span className="truncate">{p.address}</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="pt-3 border-t border-white/10 space-y-2">
                  <div className="grid grid-cols-2 gap-2">
                    <a
                      href={`tel:${p.contactPhone}`}
                      className="py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold border border-white/15 flex items-center justify-center gap-1"
                    >
                      <Phone className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Call Seller</span>
                    </a>

                    <button
                      onClick={() => {
                        addToCart(p, 1);
                        showToast("Offer Claimed to Cart", `${p.name} added at discounted price ₹${p.offerPrice}.`, "success");
                      }}
                      className="py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold shadow-lg border border-amber-400/40 flex items-center justify-center gap-1 cursor-pointer active:scale-98"
                    >
                      <ShoppingCart className="w-3.5 h-3.5" />
                      <span>Order Now</span>
                    </button>
                  </div>

                  <button
                    onClick={() => setReportOfferModal(p)}
                    className="w-full text-center text-[10px] text-rose-300 hover:text-rose-200 transition-colors cursor-pointer pt-1"
                  >
                    🚩 Report Incorrect Price or Expired Offer
                  </button>
                </div>

              </div>
            );
          })}
        </div>

      </div>

      {/* 3. REPORT OFFER MODAL */}
      {reportOfferModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-black/90 backdrop-blur-2xl rounded-3xl border border-white/25 max-w-md w-full p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-150 text-white">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <h3 className="font-bold text-base text-white flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-amber-400" />
                <span>Report Marketplace Offer</span>
              </h3>
              <button
                onClick={() => setReportOfferModal(null)}
                className="p-1 rounded-lg text-white/60 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleReportSubmit} className="space-y-3 text-xs">
              <div className="p-3 rounded-xl bg-black/50 border border-white/10">
                <span className="text-white/60 block text-[10px]">Product / Offer:</span>
                <span className="font-bold text-white">{reportOfferModal.name}</span>
                <span className="text-[11px] text-white/50 block">By: {reportOfferModal.providerName}</span>
              </div>

              <div>
                <label className="text-[11px] text-white/70 block mb-1">Reason for Reporting</label>
                <select
                  value={reportReason}
                  onChange={(e) => setReportReason(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-black/60 border border-white/20 text-white font-medium focus:outline-none focus:border-amber-400"
                >
                  <option value="Price discrepancy / Not honored by shop">Price discrepancy / Not honored by shop</option>
                  <option value="Offer expired but still shown">Offer expired but still shown</option>
                  <option value="Out of stock / Fake listing">Out of stock / Fake listing</option>
                  <option value="Poor product quality / Counterfeit">Poor product quality / Counterfeit</option>
                  <option value="Incorrect seller contact details">Incorrect seller contact details</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] text-white/70 block mb-1">Additional Details (Optional)</label>
                <textarea
                  rows={3}
                  value={reportDetails}
                  onChange={(e) => setReportDetails(e.target.value)}
                  placeholder="Describe your experience with the retailer..."
                  className="w-full p-2.5 rounded-xl bg-black/60 border border-white/20 text-white text-xs focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setReportOfferModal(null)}
                  className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold shadow-lg border border-rose-400/40"
                >
                  Submit Audit Report
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
