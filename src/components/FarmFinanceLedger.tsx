"use client";

import React, { useState } from "react";
import { DEMO_FINANCE_SUMMARY } from "@/lib/demo-data";
import { useApp } from "@/lib/store";
import {
  Wallet,
  TrendingUp,
  PlusCircle,
  Sparkles,
  Calculator,
  ArrowRight,
  PieChart,
  CheckCircle2,
  DollarSign,
  Download,
  Trash2,
  X,
  Sliders,
} from "lucide-react";

export const FarmFinanceLedger: React.FC = () => {
  const { showToast, activeFarm } = useApp();
  const [activeTab, setActiveTab] = useState<"ledger" | "simulator">("ledger");
  const [simulatedCrop, setSimulatedCrop] = useState<string>("Tomato");
  const [simulatedAcres, setSimulatedAcres] = useState<number>(2.5);
  const [customPriceOverride, setCustomPriceOverride] = useState<number | null>(null);

  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [transactions, setTransactions] = useState([
    { id: "tx-1", date: "2026-08-10", type: "Expense", category: "Nursery & Seeds", amount: 14500, notes: "Arka Rakshak F1 hybrid pro-trays (12,000 seedlings)" },
    { id: "tx-2", date: "2026-08-18", type: "Expense", category: "Field Prep & FYM", amount: 22000, notes: "Tractor ploughing 4 hrs + 4 tons farmyard manure" },
    { id: "tx-3", date: "2026-08-25", type: "Expense", category: "Drip Line & Mulch", amount: 18000, notes: "Silver-black 25 micron mulch film + inline drip" },
    { id: "tx-4", date: "2026-09-02", type: "Expense", category: "Fertilizer & NPK", amount: 24800, notes: "Basal SSP 150kg + 19:19:19 water soluble 50kg" },
    { id: "tx-5", date: "2026-09-07", type: "Expense", category: "Labor & Staking", amount: 28500, notes: "Bamboo staking, tying, and weeding crew (8 workers)" },
    { id: "tx-6", date: "2026-09-09", type: "Revenue", category: "Early Picking Sale", amount: 48000, notes: "First 18 crates sold at Bengaluru APMC @ ₹2,650/qtl" },
  ]);

  const [newTx, setNewTx] = useState({
    type: "Expense",
    category: "Fertilizer & NPK",
    amount: "",
    date: new Date().toISOString().split("T")[0],
    notes: "",
  });

  const cropSimulationData: Record<string, { yieldQtl: number; priceQtl: number; costAcre: number }> = {
    Tomato: { yieldQtl: 180, priceQtl: 2450, costAcre: 48000 },
    Groundnut: { yieldQtl: 12, priceQtl: 6000, costAcre: 18000 },
    "Sweet Corn": { yieldQtl: 60, priceQtl: 1600, costAcre: 22000 },
    Capsicum: { yieldQtl: 90, priceQtl: 3200, costAcre: 52000 },
  };

  const sim = cropSimulationData[simulatedCrop] || cropSimulationData.Tomato;
  const activePrice = customPriceOverride !== null ? customPriceOverride : sim.priceQtl;
  const simTotalYield = sim.yieldQtl * simulatedAcres;
  const simTotalRevenue = simTotalYield * activePrice;
  const simTotalCost = sim.costAcre * simulatedAcres;
  const simNetProfit = simTotalRevenue - simTotalCost;

  const totalExp = transactions.filter((t) => t.type === "Expense").reduce((sum, t) => sum + t.amount, 0);
  const totalRev = transactions.filter((t) => t.type === "Revenue").reduce((sum, t) => sum + t.amount, 0);
  const netTakeHome = totalRev - totalExp;

  const handleAddTransaction = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTx.amount || isNaN(Number(newTx.amount))) return;

    const entry = {
      id: `tx-${Date.now()}`,
      date: newTx.date,
      type: newTx.type,
      category: newTx.category,
      amount: Number(newTx.amount),
      notes: newTx.notes || "Logged via digital farm ledger",
    };

    setTransactions([entry, ...transactions]);
    setShowAddModal(false);
    setNewTx({
      type: "Expense",
      category: "Fertilizer & NPK",
      amount: "",
      date: new Date().toISOString().split("T")[0],
      notes: "",
    });

    showToast("Transaction Logged", `₹${entry.amount.toLocaleString()} ${entry.type.toLowerCase()} added under ${entry.category}`, "success");
  };

  const handleDeleteTransaction = (id: string) => {
    setTransactions(transactions.filter((t) => t.id !== id));
    showToast("Transaction Deleted", "Ledger entry removed and totals recalculated.", "info");
  };

  const handleDownloadCSV = () => {
    const headers = ["Date", "Type", "Category", "Amount (INR)", "Notes"];
    const rows = transactions.map((t) => [t.date, t.type, t.category, t.amount, `"${t.notes.replace(/"/g, '""')}"`]);
    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `KrishiMitra_Farm_Ledger_${activeFarm.name.replace(/\s+/g, "_")}_2026.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showToast("CSV Exported", "Farm financial ledger downloaded to your device.", "success");
  };

  return (
    <div className="w-full bg-black/45 backdrop-blur-xl rounded-3xl border border-white/20 p-5 sm:p-6 shadow-2xl text-white">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="font-display font-bold text-xl text-white tracking-tight">
              Digital Farm Ledger & Economics
            </h2>
            <span className="text-xs px-2.5 py-0.5 rounded-full font-semibold bg-brand-500/20 text-brand-300 border border-brand-500/30">
              Economics • Section 27 & 28
            </span>
          </div>
          <p className="text-xs text-white/70 mt-1">
            Track expenses, harvest revenue, and run what-if profit scenarios.
          </p>
        </div>

        {/* Tab switcher and Actions */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center gap-1.5 bg-black/40 p-1 rounded-xl border border-white/10 text-xs">
            <button
              onClick={() => setActiveTab("ledger")}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-colors cursor-pointer ${
                activeTab === "ledger" ? "bg-brand-600 text-white shadow-sm" : "text-white/60 hover:text-white"
              }`}
            >
              📒 Farm Ledger
            </button>
            <button
              onClick={() => setActiveTab("simulator")}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-colors cursor-pointer ${
                activeTab === "simulator" ? "bg-brand-600 text-white shadow-sm" : "text-white/60 hover:text-white"
              }`}
            >
              🔮 What-If Simulator
            </button>
          </div>

          {activeTab === "ledger" && (
            <div className="flex items-center gap-1.5">
              <button
                onClick={handleDownloadCSV}
                title="Download CSV"
                className="p-2 rounded-xl bg-black/40 hover:bg-white/10 border border-white/10 text-white transition-colors"
              >
                <Download className="w-4 h-4" />
              </button>

              <button
                onClick={() => setShowAddModal(true)}
                className="px-3.5 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition-colors cursor-pointer"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>Log Transaction</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {activeTab === "ledger" ? (
        <div className="mt-6 space-y-6">
          
          {/* Key Metric Highlights */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
            <div className="p-4 rounded-2xl bg-black/40 backdrop-blur-md border border-white/10">
              <span className="text-[10px] uppercase tracking-wider font-bold text-white/60 block">Total Expenses</span>
              <span className="font-display font-bold text-xl text-red-400">
                ₹{totalExp.toLocaleString()}
              </span>
              <span className="text-[10px] text-white/50 block mt-0.5">₹{Math.round(totalExp / activeFarm.areaAcres).toLocaleString()}/acre</span>
            </div>

            <div className="p-4 rounded-2xl bg-black/40 backdrop-blur-md border border-white/10">
              <span className="text-[10px] uppercase tracking-wider font-bold text-white/60 block">Logged Revenue</span>
              <span className="font-display font-bold text-xl text-emerald-400">
                ₹{totalRev.toLocaleString()}
              </span>
              <span className="text-[10px] text-white/50 block mt-0.5">₹{Math.round(totalRev / activeFarm.areaAcres).toLocaleString()}/acre</span>
            </div>

            <div className="p-4 rounded-2xl bg-brand-900/30 backdrop-blur-md border border-brand-500/30">
              <span className="text-[10px] uppercase tracking-wider font-bold text-brand-300 block">Current Cashflow Balance</span>
              <span className={`font-display font-bold text-xl ${netTakeHome >= 0 ? "text-emerald-400" : "text-amber-400"}`}>
                {netTakeHome >= 0 ? `+₹${netTakeHome.toLocaleString()}` : `-₹${Math.abs(netTakeHome).toLocaleString()}`}
              </span>
              <span className="text-[10px] text-brand-300/70 block mt-0.5">{transactions.length} entries recorded</span>
            </div>

            <div className="p-4 rounded-2xl bg-black/40 backdrop-blur-md border border-white/10">
              <span className="text-[10px] uppercase tracking-wider font-bold text-white/60 block">Projected Full Margin</span>
              <span className="font-display font-bold text-xl text-white">
                67.7%
              </span>
              <span className="text-[10px] text-brand-400 block mt-0.5">High Harvest Forecast</span>
            </div>
          </div>

          {/* Transactions Table */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white/60">
              Logged Farm Expenses & Revenue Stream ({transactions.length} Transactions)
            </h4>

            <div className="overflow-x-auto border border-white/10 rounded-2xl bg-black/30 backdrop-blur-md">
              <table className="w-full text-left text-xs text-white">
                <thead>
                  <tr className="border-b border-white/10 bg-black/40 text-white/60 uppercase font-semibold text-[11px]">
                    <th className="py-2.5 px-3">Date</th>
                    <th className="py-2.5 px-3">Type</th>
                    <th className="py-2.5 px-3">Category</th>
                    <th className="py-2.5 px-3">Notes</th>
                    <th className="py-2.5 px-3 text-right">Amount</th>
                    <th className="py-2.5 px-3 text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10">
                  {transactions.map((t) => (
                    <tr key={t.id} className="hover:bg-white/5 transition-colors">
                      <td className="py-3 px-3 font-mono text-white/60">{t.date}</td>
                      <td className="py-3 px-3">
                        <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                          t.type === "Revenue" ? "bg-emerald-900/60 text-emerald-300 border border-emerald-500/40" : "bg-red-900/60 text-red-300 border border-red-500/40"
                        }`}>
                          {t.type}
                        </span>
                      </td>
                      <td className="py-3 px-3 font-semibold text-white">{t.category}</td>
                      <td className="py-3 px-3 text-white/70 truncate max-w-xs">{t.notes}</td>
                      <td className={`py-3 px-3 font-bold font-display text-sm text-right ${
                        t.type === "Revenue" ? "text-emerald-400" : "text-white"
                      }`}>
                        {t.type === "Revenue" ? `+₹${t.amount.toLocaleString()}` : `-₹${t.amount.toLocaleString()}`}
                      </td>
                      <td className="py-3 px-3 text-center">
                        <button
                          onClick={() => handleDeleteTransaction(t.id)}
                          className="p-1.5 rounded-lg hover:bg-white/10 text-white/50 hover:text-red-400 transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      ) : (
        /* What-If Simulator */
        <div className="mt-6 space-y-6">
          <div className="p-4 rounded-2xl bg-black/40 backdrop-blur-md border border-white/10 grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="text-xs font-semibold text-white/80 block mb-1.5">
                Simulate Growing Crop:
              </label>
              <select
                value={simulatedCrop}
                onChange={(e) => {
                  setSimulatedCrop(e.target.value);
                  setCustomPriceOverride(null);
                }}
                className="w-full text-xs font-bold rounded-xl border border-white/20 bg-black/60 text-white p-2.5"
              >
                <option value="Tomato" className="bg-neutral-900 text-white">🍅 Tomato (Arka Rakshak)</option>
                <option value="Groundnut" className="bg-neutral-900 text-white">🥜 Groundnut (TMV 2)</option>
                <option value="Sweet Corn" className="bg-neutral-900 text-white">🌽 Sweet Corn (Sugar 75)</option>
                <option value="Capsicum" className="bg-neutral-900 text-white">🫑 Capsicum (Indra)</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-white/80 block mb-1.5">
                Allocated Land Area:
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="range"
                  min="0.5"
                  max="10"
                  step="0.5"
                  value={simulatedAcres}
                  onChange={(e) => setSimulatedAcres(Number(e.target.value))}
                  className="w-full accent-brand-500"
                />
                <span className="font-bold text-xs text-white min-w-16">
                  {simulatedAcres} Acres
                </span>
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-white/80 block mb-1.5">
                Expected APMC Price (₹/Qtl):
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="range"
                  min={Math.round(sim.priceQtl * 0.5)}
                  max={Math.round(sim.priceQtl * 1.8)}
                  step="50"
                  value={activePrice}
                  onChange={(e) => setCustomPriceOverride(Number(e.target.value))}
                  className="w-full accent-brand-500"
                />
                <span className="font-bold text-xs text-brand-400 min-w-16">
                  ₹{activePrice}
                </span>
              </div>
            </div>
          </div>

          {/* Simulation Output Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-2xl border border-white/10 bg-black/40 backdrop-blur-md">
              <span className="text-[10px] font-bold text-white/60 uppercase">Estimated Yield</span>
              <div className="font-display font-bold text-xl text-white mt-1">
                {simTotalYield.toLocaleString()} <span className="text-xs font-normal">Quintals</span>
              </div>
              <span className="text-[10px] text-white/50">@ {sim.yieldQtl} Qtl / acre</span>
            </div>

            <div className="p-4 rounded-2xl border border-white/10 bg-black/40 backdrop-blur-md">
              <span className="text-[10px] font-bold text-white/60 uppercase">Estimated Cultivation Cost</span>
              <div className="font-display font-bold text-xl text-red-400 mt-1">
                ₹{simTotalCost.toLocaleString()}
              </div>
              <span className="text-[10px] text-white/50">@ ₹{sim.costAcre.toLocaleString()}/acre</span>
            </div>

            <div className="p-4 rounded-2xl border-2 border-brand-500/80 bg-brand-900/30 backdrop-blur-md">
              <span className="text-[10px] font-bold text-brand-300 uppercase">Projected Net Profit</span>
              <div className="font-display font-bold text-2xl text-brand-300 mt-1">
                ₹{simNetProfit.toLocaleString()}
              </div>
              <span className="text-[10px] text-brand-400 font-semibold">
                ₹{Math.round(simNetProfit / simulatedAcres).toLocaleString()} / acre
              </span>
            </div>
          </div>

          <div className="text-[11px] text-white/60 flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-brand-400 shrink-0" />
            <span>Simulated figures are estimates based on regional historical APMC price medians and UAS Bangalore cost norms.</span>
          </div>
        </div>
      )}

      {/* Add Transaction Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fade-in">
          <div className="bg-black/85 backdrop-blur-2xl rounded-3xl max-w-md w-full p-6 border border-white/20 shadow-2xl space-y-4 text-white">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-2">
                <Wallet className="w-5 h-5 text-brand-400" />
                <h3 className="font-display font-bold text-lg text-white">
                  Log Farm Transaction
                </h3>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-1.5 rounded-lg hover:bg-white/10 text-white/60 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddTransaction} className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-white/80 block mb-1">
                  Transaction Type:
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setNewTx({ ...newTx, type: "Expense" })}
                    className={`py-2 rounded-xl font-bold transition-all cursor-pointer ${
                      newTx.type === "Expense" ? "bg-red-600 text-white shadow-lg" : "bg-white/10 text-white/70 hover:bg-white/15"
                    }`}
                  >
                    Expense (-)
                  </button>
                  <button
                    type="button"
                    onClick={() => setNewTx({ ...newTx, type: "Revenue" })}
                    className={`py-2 rounded-xl font-bold transition-all cursor-pointer ${
                      newTx.type === "Revenue" ? "bg-emerald-600 text-white shadow-lg" : "bg-white/10 text-white/70 hover:bg-white/15"
                    }`}
                  >
                    Revenue (+)
                  </button>
                </div>
              </div>

              <div>
                <label className="font-semibold text-white/80 block mb-1">
                  Category:
                </label>
                <select
                  value={newTx.category}
                  onChange={(e) => setNewTx({ ...newTx, category: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-white/20 bg-black/60 text-white"
                >
                  {newTx.type === "Expense" ? (
                    <>
                      <option className="bg-neutral-900">Fertilizer & NPK</option>
                      <option className="bg-neutral-900">Labor & Weeding</option>
                      <option className="bg-neutral-900">Pesticides & Fungicide</option>
                      <option className="bg-neutral-900">Nursery & Seeds</option>
                      <option className="bg-neutral-900">Diesel & Tractor Hire</option>
                      <option className="bg-neutral-900">Irrigation & Electricity</option>
                    </>
                  ) : (
                    <>
                      <option className="bg-neutral-900">Mandi Harvest Payout</option>
                      <option className="bg-neutral-900">Direct Wholesaler Sale</option>
                      <option className="bg-neutral-900">Govt Scheme Subsidy</option>
                      <option className="bg-neutral-900">PMFBY Insurance Claim</option>
                    </>
                  )}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-semibold text-white/80 block mb-1">
                    Amount (₹):
                  </label>
                  <input
                    type="number"
                    required
                    placeholder="e.g. 5000"
                    value={newTx.amount}
                    onChange={(e) => setNewTx({ ...newTx, amount: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-white/20 bg-black/60 text-white placeholder-white/40 font-mono"
                  />
                </div>

                <div>
                  <label className="font-semibold text-white/80 block mb-1">
                    Date:
                  </label>
                  <input
                    type="date"
                    value={newTx.date}
                    onChange={(e) => setNewTx({ ...newTx, date: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-white/20 bg-black/60 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-white/80 block mb-1">
                  Description / Invoice Note:
                </label>
                <input
                  type="text"
                  placeholder="e.g. 2 bags Urea from Kolar Agro Kendra"
                  value={newTx.notes}
                  onChange={(e) => setNewTx({ ...newTx, notes: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-white/20 bg-black/60 text-white placeholder-white/40"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl text-white/70 hover:bg-white/10 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold shadow-md transition-all cursor-pointer"
                >
                  Save Transaction
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
