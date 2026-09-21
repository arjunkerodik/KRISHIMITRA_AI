"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  DollarSign, 
  TrendingUp, 
  Sparkles, 
  Layers, 
  Sliders, 
  IndianRupee, 
  ArrowRight,
  PieChart,
  BarChart3,
  CheckCircle2,
  AlertTriangle
} from "lucide-react";
import { useApp } from "@/lib/store";

export default function FinanceProfitPage() {
  const { language, activeFarm } = useApp();

  const [plotArea, setPlotArea] = useState(2.5);
  const [expectedYieldPerAc, setExpectedYieldPerAc] = useState(26); // tonnes/ac
  const [expectedPricePerQtl, setExpectedPricePerQtl] = useState(2200); // ₹/qtl
  const [inputCostPerAc, setInputCostPerAc] = useState(38000); // ₹/ac

  // 1 tonne = 10 quintals
  const totalYieldQuintals = Math.round(plotArea * expectedYieldPerAc * 10);
  const grossRevenue = totalYieldQuintals * expectedPricePerQtl;
  const totalCost = Math.round(plotArea * inputCostPerAc);
  const netProfit = grossRevenue - totalCost;
  const netProfitPerAc = Math.round(netProfit / plotArea);
  const roiPercent = totalCost > 0 ? Math.round((netProfit / totalCost) * 100) : 0;
  const breakEvenPrice = totalYieldQuintals > 0 ? Math.round(totalCost / totalYieldQuintals) : 0;

  return (
    <div className="min-h-screen bg-transparent py-8 px-4 sm:px-6 lg:px-8 text-white">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-medium text-neutral-300 mb-1">
              <Link href="/dashboard" className="hover:text-brand-400">Dashboard</Link>
              <span>/</span>
              <Link href="/finance" className="hover:text-brand-400">Finance Hub</Link>
              <span>/</span>
              <span className="text-white font-semibold">What-If Profitability Simulator</span>
            </div>
            <h1 className="text-3xl font-display font-bold text-white flex items-center gap-3 drop-shadow-md">
              <TrendingUp className="w-8 h-8 text-brand-400" />
              What-If Farm Economics & Sensitivity Simulator
            </h1>
            <p className="text-sm text-neutral-300 mt-1">
              Simulate price volatility, yield variances, and cost fluctuations to forecast net profit and break-even thresholds.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/finance"
              className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-semibold text-white transition-all cursor-pointer"
            >
              Back to Finance Hub
            </Link>
          </div>
        </div>

        {/* Simulator Workbench */}
        <div className="bg-black/45 backdrop-blur-xl rounded-3xl p-6 sm:p-8 border border-white/20 shadow-2xl space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Input Controls */}
            <div className="p-6 rounded-2xl bg-black/35 border border-white/15 space-y-5">
              <h3 className="font-bold text-sm text-white uppercase tracking-wider flex items-center gap-2">
                <Sliders className="w-4 h-4 text-brand-400" />
                Scenario Parameters
              </h3>

              <div>
                <div className="flex justify-between text-xs font-semibold mb-1 text-neutral-200">
                  <span>Plot Size:</span>
                  <span>{plotArea} Acres</span>
                </div>
                <input
                  type="range"
                  min="0.5"
                  max="10"
                  step="0.5"
                  value={plotArea}
                  onChange={(e) => setPlotArea(parseFloat(e.target.value))}
                  className="w-full accent-brand-500"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold mb-1 text-neutral-200">
                  <span>Expected Yield:</span>
                  <span>{expectedYieldPerAc} Tonnes / Acre</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="40"
                  step="1"
                  value={expectedYieldPerAc}
                  onChange={(e) => setExpectedYieldPerAc(parseInt(e.target.value))}
                  className="w-full accent-brand-500"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold mb-1 text-neutral-200">
                  <span>Realized Market Price:</span>
                  <span>₹{expectedPricePerQtl} / Qtl</span>
                </div>
                <input
                  type="range"
                  min="800"
                  max="4500"
                  step="50"
                  value={expectedPricePerQtl}
                  onChange={(e) => setExpectedPricePerQtl(parseInt(e.target.value))}
                  className="w-full accent-brand-500"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold mb-1 text-neutral-200">
                  <span>Total Input Cost / Acre:</span>
                  <span>₹{inputCostPerAc.toLocaleString()}</span>
                </div>
                <input
                  type="range"
                  min="20000"
                  max="80000"
                  step="1000"
                  value={inputCostPerAc}
                  onChange={(e) => setInputCostPerAc(parseInt(e.target.value))}
                  className="w-full accent-brand-500"
                />
              </div>

              <div className="p-3.5 rounded-xl bg-black/40 border border-brand-400/30 text-xs space-y-1">
                <span className="font-bold text-brand-300 block">Break-even Threshold:</span>
                <p className="text-neutral-200">
                  Minimum price needed to cover all costs: <strong>₹{breakEvenPrice} / Qtl</strong>
                </p>
              </div>
            </div>

            {/* Financial Results Display */}
            <div className="lg:col-span-2 space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-5 rounded-2xl bg-black/35 border border-white/15">
                  <span className="text-xs font-semibold text-neutral-400">Gross Revenue</span>
                  <div className="text-2xl font-bold font-display text-white mt-1">
                    ₹{grossRevenue.toLocaleString()}
                  </div>
                  <p className="text-[11px] text-neutral-400 mt-1">{totalYieldQuintals} Quintals Total Yield</p>
                </div>

                <div className="p-5 rounded-2xl bg-black/35 border border-white/15">
                  <span className="text-xs font-semibold text-neutral-400">Total Cultivation Cost</span>
                  <div className="text-2xl font-bold font-display text-red-400 mt-1">
                    ₹{totalCost.toLocaleString()}
                  </div>
                  <p className="text-[11px] text-neutral-400 mt-1">₹{inputCostPerAc.toLocaleString()} / acre</p>
                </div>

                <div className="p-5 rounded-2xl bg-emerald-500/20 border border-emerald-400/40">
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-300">
                    Net Projected Profit
                  </span>
                  <div className="text-3xl font-bold font-display text-emerald-400 mt-1">
                    ₹{netProfit.toLocaleString()}
                  </div>
                  <p className="text-xs font-bold text-emerald-300 mt-1">
                    +{roiPercent}% Return on Investment
                  </p>
                </div>
              </div>

              {/* Sensitivity Matrix Table */}
              <div className="p-6 rounded-2xl bg-black/35 border border-white/15 space-y-4">
                <h4 className="font-bold text-sm text-white">
                  Price vs Yield Sensitivity Matrix (Net Profit per Acre)
                </h4>

                <div className="overflow-x-auto">
                  <table className="w-full text-center text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-white/10 text-[10px] text-neutral-300 uppercase">
                        <th className="py-2 text-left">Yield (t/Ac) \ Price</th>
                        <th className="py-2">₹1,500/Qtl</th>
                        <th className="py-2">₹2,000/Qtl</th>
                        <th className="py-2">₹2,500/Qtl</th>
                        <th className="py-2">₹3,000/Qtl</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/10">
                      {[18, 24, 30].map((y) => (
                        <tr key={y}>
                          <td className="py-2 text-left font-bold text-white">{y} Tonnes</td>
                          {[1500, 2000, 2500, 3000].map((p) => {
                            const revAc = y * 10 * p;
                            const profAc = revAc - inputCostPerAc;
                            return (
                              <td key={p} className={`py-2 font-mono font-bold ${
                                profAc > 0 ? "text-emerald-400" : "text-red-400"
                              }`}>
                                ₹{profAc.toLocaleString()}
                              </td>
                            );
                          })}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
