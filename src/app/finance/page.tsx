"use client";

import React from "react";
import { FarmerSidebar } from "@/components/FarmerSidebar";
import { FarmFinanceLedger } from "@/components/FarmFinanceLedger";
import {
  Wallet,
  TrendingUp,
  CreditCard,
  Landmark,
  Sparkles,
} from "lucide-react";

export default function FinancePage() {
  return (
    <div className="min-h-screen flex bg-transparent text-white">
      <div className="hidden lg:block w-64 shrink-0">
        <div className="fixed top-16 bottom-0 w-64">
          <FarmerSidebar />
        </div>
      </div>

      <div className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="p-6 rounded-3xl bg-black/45 backdrop-blur-xl border border-white/20 shadow-xl flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-brand-500 text-white flex items-center justify-center shadow-lg shadow-brand-500/30">
              <Wallet className="w-6 h-6" />
            </div>
            <div>
              <h1 className="font-display font-bold text-2xl text-white tracking-tight drop-shadow-md">
                Farm Financial Ledger & Profit Simulator
              </h1>
              <p className="text-xs sm:text-sm text-neutral-300">
                Cost-per-acre economics, revenue tracking, and what-if simulation (Section 27 & 28).
              </p>
            </div>
          </div>
        </div>

        {/* Ledger & Simulator Component */}
        <FarmFinanceLedger />

      </div>
    </div>
  );
}
