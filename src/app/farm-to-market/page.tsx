"use client";

import React, { useState } from "react";
import { FarmerSidebar } from "@/components/FarmerSidebar";
import { useApp } from "@/lib/store";
import {
  Store,
  Warehouse,
  Truck,
  Factory,
  Calendar,
  CheckCircle2,
  ArrowRight,
  Coins,
  Package,
  ThermometerSnowflake,
} from "lucide-react";

export default function FarmToMarketPage() {
  const { activeFarm, showToast } = useApp();
  const [activeStep, setActiveStep] = useState<number>(1);
  const [selectedStorage, setSelectedStorage] = useState<string | null>(null);
  const [selectedTransport, setSelectedTransport] = useState<string | null>(null);
  const [bookingDone, setBookingDone] = useState<boolean>(false);

  const steps = [
    { num: 1, title: "Harvest Planning", icon: Calendar, desc: "Brix & maturity picking window" },
    { num: 2, title: "Cold Storage", icon: Warehouse, desc: "WDRA certified humidity storage" },
    { num: 3, title: "Sorting & Processing", icon: Factory, desc: "Grading lines & agro-processing" },
    { num: 4, title: "Reefer Transport", icon: Truck, desc: "GPS refrigerated logistics" },
    { num: 5, title: "Market Arbitrage", icon: Store, desc: "APMC & FPO price matching" },
    { num: 6, title: "Direct Sale / Contract", icon: Coins, desc: "Instant e-NAM escrow payment" },
  ];

  const storageFacilities = [
    {
      id: "STR-01",
      name: "Kolar Mega Agri Cold Chain Hub",
      distance: "8.5 km from farm",
      capacity: "5,000 MT (420 MT Available)",
      tempRange: "8°C - 12°C (Controlled Atmosphere)",
      rate: "₹1.80 / kg / month",
      rating: 4.8,
      subsidized: "50% MIDH Subsidy Applicable",
    },
    {
      id: "STR-02",
      name: "Narasapura Warehouse & Silos",
      distance: "14 km from farm",
      capacity: "12,000 MT (Dry Pod & Grain)",
      tempRange: "Ambient Aerated Silo",
      rate: "₹0.90 / kg / month",
      rating: 4.6,
      subsidized: "WDRA Negotiable Warehouse Receipt (NWR)",
    },
  ];

  const transportFleet = [
    {
      id: "TRP-01",
      vehicle: "Tata 407 Reefer Cold Van (3.5 Tonne)",
      driver: "Venkatesh Murthy",
      rating: 4.9,
      estRate: "₹2,400 (Farm to Bengaluru APMC)",
      eta: "Available in 45 mins",
      phone: "+91 98451 44556",
    },
    {
      id: "TRP-02",
      vehicle: "Mahindra Bolero Maxi Truck (1.8 Tonne)",
      driver: "Sridhar Gowda",
      rating: 4.7,
      estRate: "₹1,200 (Farm to Kolar Mandi)",
      eta: "Available in 20 mins",
      phone: "+91 97314 99881",
    },
  ];

  const buyerBids = [
    {
      buyer: "Ninjacart Supply Chain Hub",
      volume: "50 Quintals Tomato Grade A",
      priceOffered: "₹2,450 / Qtl",
      pickup: "Farmgate Pickup Included",
      paymentTerms: "Instant UPI on QC Pass",
    },
    {
      buyer: "Reliance Retail Agri Division",
      volume: "80 Quintals Semi-Ripe",
      priceOffered: "₹2,380 / Qtl",
      pickup: "Kolar Cold Hub Depot",
      paymentTerms: "T+24h Bank NEFT",
    },
    {
      buyer: "Kolar Horticulture Farmers Producer Co. (FPO)",
      volume: "100 Quintals (All Grades)",
      priceOffered: "₹2,300 / Qtl + 4% Dividend",
      pickup: "Local FPO Centre",
      paymentTerms: "Immediate Cash / DBT",
    },
  ];

  const handleBookStorage = (storageName: string) => {
    setSelectedStorage(storageName);
    showToast("Storage Slot Reserved", `Reserved 40 crates at ${storageName}. Booking code: #WH-8491.`, "success");
  };

  const handleBookLogistics = (vehicleName: string) => {
    setSelectedTransport(vehicleName);
    showToast("Vehicle Dispatched", `Transport confirmed with driver. Vehicle will arrive at ${activeFarm.name} within 45 mins.`, "success");
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
        <div className="p-6 rounded-3xl bg-black/45 backdrop-blur-xl border border-white/20 shadow-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-brand-500/80 border border-brand-400/50 text-white flex items-center justify-center shadow-lg">
              <Package className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="font-display font-bold text-2xl text-white tracking-tight drop-shadow-sm">
                  Farm-to-Market Post-Harvest Management
                </h1>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-brand-900/70 border border-brand-400/40 text-brand-300">
                  Section 10 • SIH26197
                </span>
              </div>
              <p className="text-xs sm:text-sm text-neutral-200 mt-0.5">
                Complete post-harvest continuum: Harvest → Storage → Processing → Transport → Market → Direct Sale.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <span className="text-[10px] text-neutral-300 uppercase block font-semibold">Post-Harvest Loss Prevention</span>
              <span className="text-sm font-bold text-emerald-400">-34% Spoilage Savings</span>
            </div>
          </div>
        </div>

        {/* 6-Step Visual Process Bar */}
        <div className="p-5 rounded-3xl bg-black/45 backdrop-blur-xl border border-white/20 shadow-2xl overflow-x-auto">
          <div className="flex items-center justify-between min-w-[700px] gap-2">
            {steps.map((s, idx) => {
              const Icon = s.icon;
              const isCurrent = activeStep === s.num;
              const isPast = activeStep > s.num;

              return (
                <React.Fragment key={s.num}>
                  <button
                    onClick={() => setActiveStep(s.num)}
                    className={`flex-1 p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                      isCurrent
                        ? "bg-brand-600 border-brand-400 shadow-xl ring-2 ring-brand-500/50"
                        : isPast
                        ? "bg-black/40 border-emerald-500/50 text-emerald-200"
                        : "bg-black/30 border-white/10 hover:border-white/25 text-neutral-300"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className={`text-[10px] font-bold uppercase ${isCurrent ? "text-brand-200" : isPast ? "text-emerald-300" : "text-neutral-400"}`}>
                        Step {s.num}
                      </span>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="font-bold text-xs text-white truncate">{s.title}</div>
                    <div className="text-[10px] text-neutral-300 truncate mt-0.5">{s.desc}</div>
                  </button>
                  {idx < steps.length - 1 && (
                    <ArrowRight className="w-4 h-4 text-white/30 shrink-0" />
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>

        {/* Step-Specific Deep Interactive Workspace */}
        {activeStep === 1 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 rounded-3xl bg-black/45 backdrop-blur-xl border border-white/20 shadow-2xl space-y-4">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-brand-400" />
                <h3 className="font-display font-bold text-lg text-white">
                  Optimal Harvest Timing for {activeFarm.currentCrop}
                </h3>
              </div>
              <p className="text-xs text-neutral-200">
                AI harvest readiness forecast based on growing degree days, sunshine hours, and current fruit firmness.
              </p>
              <div className="p-4 rounded-2xl bg-black/40 border border-white/15 space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-neutral-300">Recommended Picking Window:</span>
                  <strong className="text-brand-300">Early Morning (6:00 AM - 9:30 AM)</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-300">Optimal Maturity Stage:</span>
                  <strong className="text-white">Breaker / Turning Pink (30% color)</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-300">Expected Field Yield:</span>
                  <strong className="text-emerald-400">120 - 140 Crates (approx 3.2 Tonnes)</strong>
                </div>
              </div>
              <button
                onClick={() => setActiveStep(2)}
                className="w-full py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 border border-brand-400/40 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg"
              >
                <span>Proceed to Cold Storage Booking</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 rounded-3xl bg-black/45 backdrop-blur-xl border border-white/20 shadow-2xl space-y-4">
              <div className="flex items-center gap-2">
                <ThermometerSnowflake className="w-5 h-5 text-sky-400" />
                <h3 className="font-display font-bold text-lg text-white">
                  Pre-Cooling & Spoilage Prevention Advisory
                </h3>
              </div>
              <ul className="space-y-2 text-xs text-neutral-200">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>Harvest during cool morning hours to minimize field heat absorption.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>Use plastic ventilated crates with corrugated liner instead of gunny bags to prevent compression damage.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>Hydro-cool or shade-stack within 2 hours of picking to extend shelf-life by 7 additional days.</span>
                </li>
              </ul>
            </div>
          </div>
        )}

        {activeStep === 2 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-display font-bold text-lg text-white flex items-center gap-2">
                <Warehouse className="w-5 h-5 text-brand-400" />
                Nearby Cold Storage & Warehouse Network
              </h3>
              <span className="text-xs text-neutral-300">Live Space Availability</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {storageFacilities.map((st) => (
                <div
                  key={st.id}
                  className="p-6 rounded-3xl bg-black/45 backdrop-blur-xl border border-white/20 shadow-2xl space-y-3 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span className="text-[10px] font-bold text-brand-300 uppercase tracking-wider block">
                          {st.distance}
                        </span>
                        <h4 className="font-bold text-base text-white">{st.name}</h4>
                      </div>
                      <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-950/70 border border-emerald-500/40 text-emerald-200">
                        ⭐ {st.rating}
                      </span>
                    </div>

                    <div className="space-y-1 text-xs text-neutral-200 mt-3">
                      <div className="flex justify-between">
                        <span className="text-neutral-300">Capacity:</span>
                        <strong className="text-white">{st.capacity}</strong>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-neutral-300">Temperature Control:</span>
                        <strong className="text-white">{st.tempRange}</strong>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-neutral-300">Storage Rate:</span>
                        <strong className="text-brand-300 font-mono">{st.rate}</strong>
                      </div>
                      <div className="text-[11px] text-emerald-300 font-medium pt-1">
                        ✓ {st.subsidized}
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => handleBookStorage(st.name)}
                    className="w-full py-2 rounded-xl bg-brand-600 hover:bg-brand-500 border border-brand-400/40 text-white font-bold text-xs transition-all shadow-md mt-3"
                  >
                    {selectedStorage === st.name ? "✓ Reserved Slot" : "Reserve Storage Bay"}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeStep === 3 && (
          <div className="p-6 rounded-3xl bg-black/45 backdrop-blur-xl border border-white/20 shadow-2xl space-y-4">
            <div className="flex items-center gap-2">
              <Factory className="w-5 h-5 text-brand-400" />
              <h3 className="font-display font-bold text-lg text-white">
                Food Processing & Value Addition Options
              </h3>
            </div>
            <p className="text-xs text-neutral-200">
              When fresh mandi prices drop, convert excess produce into value-added items with higher profit margins.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div className="p-4 rounded-2xl bg-black/40 border border-white/15 space-y-2">
                <h4 className="font-bold text-sm text-white">Tomato Puree & Paste Unit</h4>
                <p className="text-neutral-300">Kolar District Food Park • Capacity: 20 MT/day</p>
                <div className="font-bold text-emerald-400 font-mono">Value Uplift: +45% per kg</div>
              </div>
              <div className="p-4 rounded-2xl bg-black/40 border border-white/15 space-y-2">
                <h4 className="font-bold text-sm text-white">Solar Tunnel Dehydration</h4>
                <p className="text-neutral-300">FPO Community Dryer • Sun-dried tomato slices</p>
                <div className="font-bold text-emerald-400 font-mono">Shelf Life: 9 Months</div>
              </div>
              <div className="p-4 rounded-2xl bg-black/40 border border-white/15 space-y-2">
                <h4 className="font-bold text-sm text-white">Optical Sorting & Grading Line</h4>
                <p className="text-neutral-300">Export Grade A Sorting • 4 size bins</p>
                <div className="font-bold text-emerald-400 font-mono">Premium: +₹300/Qtl</div>
              </div>
            </div>
          </div>
        )}

        {activeStep === 4 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-display font-bold text-lg text-white flex items-center gap-2">
                <Truck className="w-5 h-5 text-brand-400" />
                On-Demand Farm Logistics & Reefer Transport
              </h3>
              <span className="text-xs text-neutral-300">Instant Driver Dispatch</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {transportFleet.map((tp) => (
                <div
                  key={tp.id}
                  className="p-6 rounded-3xl bg-black/45 backdrop-blur-xl border border-white/20 shadow-2xl space-y-3 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h4 className="font-bold text-base text-white">{tp.vehicle}</h4>
                        <span className="text-xs text-neutral-300 block">Driver: {tp.driver}</span>
                      </div>
                      <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-950/70 border border-emerald-500/40 text-emerald-200">
                        ⭐ {tp.rating}
                      </span>
                    </div>

                    <div className="space-y-1 text-xs text-neutral-200 mt-3">
                      <div className="flex justify-between">
                        <span className="text-neutral-300">Estimated Freight:</span>
                        <strong className="text-brand-300 font-mono">{tp.estRate}</strong>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-neutral-300">Availability:</span>
                        <strong className="text-emerald-400">{tp.eta}</strong>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-neutral-300">Driver Contact:</span>
                        <strong className="text-white">{tp.phone}</strong>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => handleBookLogistics(tp.vehicle)}
                    className="w-full py-2 rounded-xl bg-brand-600 hover:bg-brand-500 border border-brand-400/40 text-white font-bold text-xs transition-all shadow-md mt-3"
                  >
                    {selectedTransport === tp.vehicle ? "✓ Truck Booked & Dispatched" : "Book Truck Now"}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {(activeStep === 5 || activeStep === 6) && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-display font-bold text-lg text-white flex items-center gap-2">
                <Store className="w-5 h-5 text-brand-400" />
                Live Buyer Contract Bids & Mandi Arbitrage Board
              </h3>
              <span className="text-xs text-emerald-400 font-semibold">e-NAM Escrow Guaranteed</span>
            </div>

            <div className="space-y-3">
              {buyerBids.map((bid, idx) => (
                <div
                  key={idx}
                  className="p-5 rounded-2xl bg-black/45 backdrop-blur-xl border border-white/20 shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-sm text-white">{bid.buyer}</h4>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-brand-950/60 border border-brand-400/40 text-brand-300">
                        {bid.pickup}
                      </span>
                    </div>
                    <p className="text-neutral-300">Requirement: <strong>{bid.volume}</strong></p>
                    <p className="text-neutral-400 text-[11px]">Payment: {bid.paymentTerms}</p>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <span className="text-[10px] text-neutral-400 uppercase font-bold block">Bid Offer</span>
                      <span className="font-display font-bold text-lg text-emerald-400">{bid.priceOffered}</span>
                    </div>
                    <button
                      onClick={() => showToast("Direct Sale Initiated", `Contract with ${bid.buyer} locked. e-NAM Escrow transaction created.`, "success")}
                      className="px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 border border-brand-400/40 text-white font-bold text-xs shadow-lg transition-all"
                    >
                      Accept Bid & Sell
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
