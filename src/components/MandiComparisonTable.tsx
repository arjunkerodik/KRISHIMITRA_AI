"use client";

import React, { useState } from "react";
import { DEMO_MANDI_PRICES, MandiPrice } from "@/lib/demo-data";
import { useApp } from "@/lib/store";
import {
  Store,
  TrendingUp,
  Truck,
  ArrowUpDown,
  CheckCircle2,
  Sparkles,
  Info,
  MapPin,
  Coins,
  Calendar,
  Phone,
  Check,
  X,
  Scale,
  Calculator,
} from "lucide-react";

export const MandiComparisonTable: React.FC = () => {
  const { showToast, awardCredits } = useApp();
  const [quantityQtl, setQuantityQtl] = useState<number>(25);
  const [commodity, setCommodity] = useState<string>("Tomato");
  const [transportRatePerKm] = useState<number>(1.85); // ₹/km/qtl
  const [baseLoadingCost] = useState<number>(20); // ₹/qtl loading & toll
  const [bookingModalMandi, setBookingModalMandi] = useState<any | null>(null);
  const [bookingConfirmed, setBookingConfirmed] = useState(false);

  const calculateSpread = (mandi: MandiPrice) => {
    const transportTotalPerQtl = Math.round(mandi.distanceKm * transportRatePerKm + baseLoadingCost);
    const netReturnPerQtl = mandi.modalPrice - transportTotalPerQtl;
    const grossTotal = mandi.modalPrice * quantityQtl;
    const transportTotal = transportTotalPerQtl * quantityQtl;
    const netTotal = grossTotal - transportTotal;

    return {
      transportTotalPerQtl,
      netReturnPerQtl,
      grossTotal,
      transportTotal,
      netTotal,
    };
  };

  const calculatedMandis = DEMO_MANDI_PRICES.map((m) => ({
    ...m,
    calc: calculateSpread(m),
  })).sort((a, b) => b.calc.netTotal - a.calc.netTotal);

  const bestMandi = calculatedMandis[0];
  const localMandi = calculatedMandis.find((m) => m.distanceKm <= 15) || calculatedMandis[1];
  const netArbitrageGain = bestMandi.calc.netTotal - (localMandi?.calc.netTotal || 0);

  const handleConfirmBooking = (e: React.FormEvent) => {
    e.preventDefault();
    setBookingConfirmed(true);
    awardCredits("DAILY_ADVISORY_CHECKIN", `Booked APMC Logistics to ${bookingModalMandi.mandiName}`);
    showToast(
      "Transport Booking Requested!",
      `Assigned verified Karnataka Logistics mini-truck for ${bookingModalMandi.mandiName} dispatch. Contact SMS sent to driver.`,
      "success"
    );
    setTimeout(() => {
      setBookingConfirmed(false);
      setBookingModalMandi(null);
    }, 1800);
  };

  return (
    <div className="w-full bg-black/50 backdrop-blur-xl rounded-3xl border border-white/20 p-5 sm:p-7 shadow-2xl space-y-5 text-white">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-white/15">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="font-display font-bold text-xl text-white tracking-tight drop-shadow-sm flex items-center gap-2">
              <Calculator className="w-5 h-5 text-emerald-400" />
              <span>Where Should I Sell Today? (Net Realization Engine)</span>
            </h2>
            <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/40">
              Arbitrage Model
            </span>
          </div>
          <p className="text-xs text-white/70 mt-1">
            Compares verified APMC modal prices, road distances, and transport freight costs to calculate true take-home earnings.
          </p>
        </div>

        {/* Commodity and Quantity Slider */}
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <label className="text-xs text-white/70 font-medium">Commodity:</label>
            <select
              value={commodity}
              onChange={(e) => setCommodity(e.target.value)}
              className="text-xs rounded-xl bg-black/60 border border-white/20 px-3 py-2 text-white focus:ring-2 focus:ring-emerald-400 font-medium"
            >
              <option value="Tomato" className="bg-neutral-900 text-white">Tomato (Hybrid F1)</option>
              <option value="Groundnut" className="bg-neutral-900 text-white">Groundnut (Pods)</option>
              <option value="Capsicum" className="bg-neutral-900 text-white">Capsicum / Bell Pepper</option>
              <option value="Ragi" className="bg-neutral-900 text-white">Ragi / Finger Millet</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <label className="text-xs text-white/70 font-medium">Quantity:</label>
            <div className="flex items-center gap-1.5 bg-black/60 border border-white/20 px-3 py-1.5 rounded-xl">
              <span className="text-xs font-bold text-emerald-400 font-mono">{quantityQtl}</span>
              <span className="text-[11px] text-white/60">Qtl ({quantityQtl * 100} kg)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Quantity Slider Control */}
      <div className="p-4 rounded-2xl bg-black/40 backdrop-blur-md border border-white/15 space-y-1.5">
        <div className="flex justify-between text-xs text-white/80 font-medium">
          <span>Adjust Harvest Load Volume:</span>
          <span className="font-bold text-emerald-400 font-mono">{quantityQtl} Quintals ({quantityQtl * 100} kg)</span>
        </div>
        <input
          type="range"
          min="5"
          max="100"
          step="5"
          value={quantityQtl}
          onChange={(e) => setQuantityQtl(parseInt(e.target.value))}
          className="w-full accent-emerald-500 cursor-pointer"
        />
        <div className="flex justify-between text-[10px] text-white/50 font-mono">
          <span>5 Qtl (Small Mini-van)</span>
          <span>50 Qtl (Tata 407)</span>
          <span>100 Qtl (Full Truck)</span>
        </div>
      </div>

      {/* Best Arbitrage Callout Banner */}
      <div className="p-5 rounded-2xl bg-emerald-950/60 border border-emerald-500/40 backdrop-blur-md flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center gap-3.5">
          <div className="p-2.5 rounded-2xl bg-emerald-500 text-white shrink-0 shadow-md">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-300">
              Optimal APMC Arbitrage Recommendation
            </span>
            <p className="text-xs sm:text-sm font-semibold text-white mt-0.5">
              Sell in <strong>{bestMandi.mandiName}</strong> for an estimated net gain of{" "}
              <span className="text-emerald-300 font-bold font-mono">
                +₹{netArbitrageGain.toLocaleString()}
              </span>{" "}
              over local mandi after deducting ₹{bestMandi.calc.transportTotal.toLocaleString()} transport expenses.
            </p>
          </div>
        </div>

        <button
          onClick={() => setBookingModalMandi(bestMandi)}
          className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shrink-0 transition-all shadow-lg border border-emerald-400/40 cursor-pointer active:scale-98"
        >
          Book Mini-Truck Logistics
        </button>
      </div>

      {/* Comparison Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {calculatedMandis.map((m, idx) => {
          const isBest = idx === 0;
          return (
            <div
              key={m.id}
              className={`p-5 rounded-2xl border transition-all flex flex-col justify-between space-y-4 ${
                isBest
                  ? "bg-emerald-950/40 border-emerald-400/50 shadow-lg shadow-emerald-950/30"
                  : "bg-black/40 border-white/10"
              }`}
            >
              <div>
                <div className="flex items-center justify-between gap-1 mb-2">
                  <span className="text-[10px] font-bold uppercase text-white/50">
                    {m.distanceKm} km away
                  </span>
                  {isBest && (
                    <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/30 border border-emerald-400/40 text-emerald-200">
                      ★ Max Realization
                    </span>
                  )}
                </div>

                <h3 className="font-bold text-sm text-white">{m.mandiName}</h3>
                <p className="text-[11px] text-white/60">{(m as any).district || `APMC Yard • ${m.distanceKm} km`}</p>

                <div className="mt-3 space-y-1.5 p-3 rounded-xl bg-black/40 border border-white/5 text-xs font-mono">
                  <div className="flex justify-between">
                    <span className="text-white/50">Mandi Price:</span>
                    <span className="text-white font-bold">₹{m.modalPrice}/Qtl</span>
                  </div>
                  <div className="flex justify-between text-rose-300">
                    <span>Est. Transport:</span>
                    <span>-₹{m.calc.transportTotalPerQtl}/Qtl</span>
                  </div>
                  <div className="pt-1 border-t border-white/10 flex justify-between font-bold text-emerald-400">
                    <span>Net Take-Home:</span>
                    <span>₹{m.calc.netReturnPerQtl}/Qtl</span>
                  </div>
                </div>
              </div>

              <div>
                <div className="text-center py-1">
                  <span className="text-[10px] text-white/50 block">Net for {quantityQtl} Qtl</span>
                  <span className="text-lg font-bold font-mono text-emerald-300">
                    ₹{m.calc.netTotal.toLocaleString()}
                  </span>
                </div>

                <button
                  onClick={() => setBookingModalMandi(m)}
                  className="w-full mt-2 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold border border-white/15 transition-colors cursor-pointer"
                >
                  Select & Book Transport
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Transparent Calculation Formula Disclosure */}
      <div className="p-3.5 rounded-xl bg-black/30 border border-white/10 text-[11px] text-white/60 flex items-start gap-2">
        <Info className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
        <div>
          <span className="font-bold text-white/80">Estimation Model Disclosure:</span> Net realization is calculated using the formula:{" "}
          <code className="font-mono text-emerald-300">Net Return = (Modal Price × Qtl) - ((Distance × ₹1.85/km/qtl + ₹20 base) × Qtl)</code>.
          Figures are estimates grounded on verified daily APMC auctions and standard Karnataka freight benchmarks.
        </div>
      </div>

      {/* Transport Booking Modal */}
      {bookingModalMandi && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-black/90 backdrop-blur-2xl rounded-3xl border border-white/20 max-w-md w-full p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-100 text-white">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <h3 className="font-bold text-base text-white flex items-center gap-2">
                <Truck className="w-5 h-5 text-emerald-400" />
                <span>Book Transport to {bookingModalMandi.mandiName}</span>
              </h3>
              <button
                onClick={() => setBookingModalMandi(null)}
                className="p-1 rounded-lg text-white/60 hover:text-white hover:bg-white/10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleConfirmBooking} className="space-y-3 text-xs">
              <div className="p-3.5 rounded-2xl bg-black/50 border border-white/10 space-y-2">
                <div className="flex justify-between">
                  <span className="text-white/60">Destination:</span>
                  <span className="font-bold text-white">{bookingModalMandi.mandiName} ({bookingModalMandi.distanceKm} km)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/60">Produce Volume:</span>
                  <span className="font-bold text-emerald-300 font-mono">{quantityQtl} Quintals ({commodity})</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/60">Est. Freight Charge:</span>
                  <span className="font-bold text-rose-300 font-mono">₹{bookingModalMandi.calc.transportTotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between border-t border-white/10 pt-1.5">
                  <span className="text-white/80 font-semibold">Expected Net Payout:</span>
                  <span className="font-bold text-emerald-400 font-mono text-sm">₹{bookingModalMandi.calc.netTotal.toLocaleString()}</span>
                </div>
              </div>

              <div>
                <label className="text-[11px] text-white/60 block mb-1">Pickup Farm Address</label>
                <input
                  type="text"
                  defaultValue="Plot 4A, Narasapura Village, Kolar - 563133"
                  className="w-full p-2.5 rounded-xl bg-black/60 border border-white/20 text-white font-medium focus:outline-none focus:border-emerald-400"
                />
              </div>

              <div>
                <label className="text-[11px] text-white/60 block mb-1">Farmer Contact Phone</label>
                <input
                  type="text"
                  defaultValue="+91 98450 12345 (Ramesh Gowda)"
                  className="w-full p-2.5 rounded-xl bg-black/60 border border-white/20 text-white font-medium focus:outline-none focus:border-emerald-400"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setBookingModalMandi(null)}
                  className="px-4 py-2 rounded-xl bg-white/10 text-white hover:bg-white/20 border border-white/15"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={bookingConfirmed}
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold shadow-lg border border-emerald-400/40"
                >
                  {bookingConfirmed ? "Booking Confirmed ✓" : "Confirm Transport Booking"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
