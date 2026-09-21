"use client";

import React, { useState } from "react";
import Link from "next/link";
import { FarmerSidebar } from "@/components/FarmerSidebar";
import { useApp } from "@/lib/store";
import {
  RewardVoucher,
  ClaimedVoucher,
} from "@/lib/services/creditsService";
import {
  Gift,
  Coins,
  ShieldCheck,
  CheckCircle2,
  Clock,
  QrCode,
  Tag,
  Building2,
  AlertCircle,
  ExternalLink,
  X,
  Sparkles,
  Award,
  Flame,
} from "lucide-react";

export default function RewardsPage() {
  const {
    creditsBalance,
    rewardsCatalog,
    claimedVouchers,
    claimRewardVoucher,
    showToast,
  } = useApp();

  const [selectedVoucherForQR, setSelectedVoucherForQR] = useState<ClaimedVoucher | null>(null);

  const handleClaim = (voucher: RewardVoucher) => {
    if (creditsBalance < voucher.creditCost) {
      showToast(
        "Insufficient Credits",
        `You need ${voucher.creditCost} KrishiMitra Credits to claim this voucher. Current balance: ${creditsBalance} 🪙.`,
        "alert"
      );
      return;
    }

    const res = claimRewardVoucher(voucher.id);
    if (res.success && res.voucher) {
      showToast(
        "Voucher Claimed Successfully!",
        `Claimed ${voucher.title}. Coupon Code: ${res.voucher.couponCode}.`,
        "success"
      );
      setSelectedVoucherForQR(res.voucher);
    } else {
      showToast("Claim Notice", res.message, "warning");
    }
  };

  return (
    <div className="min-h-screen flex bg-transparent text-white">
      <div className="hidden lg:block w-64 shrink-0">
        <div className="fixed top-16 bottom-0 w-64">
          <FarmerSidebar />
        </div>
      </div>

      <div className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8 space-y-6 max-w-6xl mx-auto">
        
        {/* Header */}
        <div className="p-6 rounded-3xl bg-black/50 backdrop-blur-xl border border-white/20 shadow-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                <Award className="w-3.5 h-3.5 text-emerald-400" />
                <span>Verified Partner Agricultural Vouchers</span>
              </span>
              <span className="text-xs text-white/70">
                IFFCO, ICAR-KVK & FPO Empaneled
              </span>
            </div>
            <h1 className="font-display font-bold text-2xl sm:text-3xl text-white tracking-tight mt-1 flex items-center gap-2.5">
              <Gift className="w-7 h-7 text-emerald-400" />
              <span>Loyalty Rewards & Voucher Redemption</span>
            </h1>
            <p className="text-xs sm:text-sm text-white/70 mt-0.5">
              Redeem your earned KrishiMitra Credits for bio-fertilizer discounts, 100% free soil tests, seed rebates, and drone pilot spraying coupons.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/credits"
              className="px-4 py-2.5 rounded-xl bg-amber-500/20 border border-amber-400/40 text-amber-300 text-xs font-bold transition-all inline-flex items-center gap-2 shadow-md"
            >
              <Coins className="w-4 h-4 text-amber-400" />
              <span>Balance: {creditsBalance} 🪙</span>
            </Link>
          </div>
        </div>

        {/* 1. ACTIVE CLAIMED VOUCHERS (IF ANY) */}
        {claimedVouchers.length > 0 && (
          <div className="bg-black/50 backdrop-blur-xl rounded-3xl border border-emerald-500/30 p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-2">
                <QrCode className="w-5 h-5 text-emerald-400" />
                <h3 className="text-base font-bold text-white">
                  My Active Claimed Coupons & Vouchers ({claimedVouchers.length})
                </h3>
              </div>
              <span className="text-xs text-emerald-300 font-semibold">
                Show at authorized retail counters
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {claimedVouchers.map((v) => (
                <div
                  key={v.claimId}
                  className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-500/40 flex flex-col justify-between space-y-3"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <span className="text-[10px] font-bold uppercase text-emerald-300">
                        {v.partnerName}
                      </span>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/30 text-emerald-200 border border-emerald-400/40">
                        {v.status}
                      </span>
                    </div>

                    <h4 className="font-bold text-sm text-white">{v.voucherTitle}</h4>

                    <div className="mt-3 p-3 rounded-xl bg-black/60 border border-dashed border-emerald-400/50 flex items-center justify-between">
                      <div>
                        <span className="text-[10px] text-white/50 uppercase block">Coupon Code</span>
                        <span className="font-mono font-extrabold text-base text-amber-300 tracking-wider">
                          {v.couponCode}
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] text-white/50 block">Value</span>
                        <span className="text-xs font-bold text-emerald-300 font-mono">
                          {v.discountValue}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-white/10 flex items-center justify-between text-[11px] text-white/60">
                    <span>Expires: <strong className="text-white">{v.expiresAt}</strong></span>
                    <button
                      onClick={() => setSelectedVoucherForQR(v)}
                      className="text-emerald-300 font-bold hover:underline inline-flex items-center gap-1 cursor-pointer"
                    >
                      <QrCode className="w-3.5 h-3.5" />
                      <span>View Retail QR Code</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 2. REWARDS CATALOG GRID */}
        <div className="bg-black/50 backdrop-blur-xl rounded-3xl border border-white/20 p-6 shadow-2xl space-y-4">
          <div className="pb-3 border-b border-white/10">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-400" />
              <span>Available Partner Rewards & Subsidy Vouchers</span>
            </h3>
            <p className="text-xs text-white/60">
              Guaranteed non-governmental agricultural input rebates verified by partner organizations.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {rewardsCatalog.map((rew) => {
              const canAfford = creditsBalance >= rew.creditCost;

              return (
                <div
                  key={rew.id}
                  className="bg-black/40 backdrop-blur-md rounded-2xl border border-white/15 p-5 flex flex-col justify-between hover:border-emerald-400/40 transition-all space-y-4 text-white"
                >
                  <div>
                    <div className="flex items-center justify-between gap-1 mb-2">
                      <span className="px-2 py-0.5 rounded-lg text-[10px] font-bold bg-white/10 text-emerald-300 border border-white/10">
                        {rew.category}
                      </span>
                      <span className="text-[10px] font-mono text-white/50">
                        {rew.stockRemaining} Available
                      </span>
                    </div>

                    <h4 className="font-bold text-sm text-white leading-snug">
                      {rew.title}
                    </h4>

                    <p className="text-[11px] text-emerald-300 font-semibold mt-1 flex items-center gap-1">
                      <Building2 className="w-3.5 h-3.5 text-emerald-400" />
                      <span>{rew.partnerName}</span>
                    </p>

                    <p className="text-xs text-white/70 mt-2 leading-relaxed">
                      {rew.description}
                    </p>

                    {/* Terms Checklist */}
                    <div className="mt-3 space-y-1 bg-black/50 p-2.5 rounded-xl border border-white/5 text-[11px] text-white/60">
                      <span className="font-bold text-white/80 block">Eligibility & Rules:</span>
                      {rew.termsAndConditions.map((t, idx) => (
                        <p key={idx}>• {t}</p>
                      ))}
                    </div>
                  </div>

                  {/* Pricing & Claim Button */}
                  <div className="pt-3 border-t border-white/10 space-y-2">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-[10px] text-white/50 uppercase block">Required Credits</span>
                        <span className="text-lg font-mono font-bold text-amber-400">
                          {rew.creditCost} 🪙
                        </span>
                      </div>

                      <div className="text-right">
                        <span className="text-[10px] text-white/50 uppercase block">Rebate Value</span>
                        <span className="text-xs font-bold text-emerald-300 font-mono">
                          {rew.discountValue}
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() => handleClaim(rew)}
                      className={`w-full py-2.5 rounded-xl text-xs font-bold transition-all shadow-md flex items-center justify-center gap-1.5 cursor-pointer active:scale-98 ${
                        canAfford
                          ? "bg-emerald-600 hover:bg-emerald-500 text-white border border-emerald-400/40"
                          : "bg-white/10 text-white/40 border border-white/10 hover:bg-white/15"
                      }`}
                    >
                      <Gift className="w-3.5 h-3.5" />
                      <span>{canAfford ? "Claim Voucher Now" : `Need ${rew.creditCost - creditsBalance} More Credits`}</span>
                    </button>
                  </div>

                </div>
              );
            })}
          </div>
        </div>

      </div>

      {/* QR Code Presentation Modal */}
      {selectedVoucherForQR && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-black/95 backdrop-blur-2xl rounded-3xl border border-white/25 max-w-sm w-full p-6 shadow-2xl text-center space-y-4 animate-in fade-in zoom-in-95 duration-150 text-white">
            
            <div className="flex items-center justify-between pb-2 border-b border-white/10">
              <span className="text-xs font-bold text-emerald-300">Retailer Coupon Pass</span>
              <button
                onClick={() => setSelectedVoucherForQR(null)}
                className="p-1 rounded-lg text-white/60 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* QR Simulation Box */}
            <div className="bg-white p-4 rounded-2xl w-48 h-48 mx-auto flex flex-col items-center justify-center shadow-lg">
              <QrCode className="w-36 h-36 text-black" />
            </div>

            <div>
              <span className="font-mono font-extrabold text-lg text-amber-300 tracking-wider block">
                {selectedVoucherForQR.couponCode}
              </span>
              <h4 className="font-bold text-sm text-white mt-1">
                {selectedVoucherForQR.voucherTitle}
              </h4>
              <p className="text-[11px] text-emerald-300 font-semibold mt-0.5">
                {selectedVoucherForQR.discountValue} • {selectedVoucherForQR.partnerName}
              </p>
              <span className="text-[10px] text-white/50 block mt-1">
                Valid until {selectedVoucherForQR.expiresAt}
              </span>
            </div>

            <button
              onClick={() => setSelectedVoucherForQR(null)}
              className="w-full py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold border border-white/15"
            >
              Done / Return to Catalog
            </button>

          </div>
        </div>
      )}

    </div>
  );
}
