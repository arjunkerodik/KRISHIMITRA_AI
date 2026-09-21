"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  IndianRupee, 
  PlusCircle, 
  Download, 
  UploadCloud, 
  Filter, 
  Calendar, 
  Tag, 
  Trash2,
  CheckCircle2,
  PieChart,
  FileSpreadsheet
} from "lucide-react";
import { useApp } from "@/lib/store";

export default function FinanceExpensesPage() {
  const { language, activeFarm, showToast, awardCredits } = useApp();
  const [expenseList, setExpenseList] = useState([
    { id: 1, date: "08 Sep 2024", category: "Fertilizers", desc: "Urea (2 bags) + DAP (1 bag) from Kolar Agro Kendra", amount: 2850, mode: "UPI / PhonePe", plot: "Plot 1 (Tomato)" },
    { id: 2, date: "04 Sep 2024", category: "Pesticides", desc: "Mancozeb 75% WP (1 kg) prophylactic spray", amount: 650, mode: "Cash", plot: "Plot 1 (Tomato)" },
    { id: 3, date: "28 Aug 2024", category: "Labour", desc: "4 Workers - Weeding & Trellis Staking (1 Day)", amount: 1600, mode: "Cash", plot: "Plot 1 (Tomato)" },
    { id: 4, date: "20 Aug 2024", category: "Diesel / Energy", desc: "Borewell generator fuel (20 Litres)", amount: 1960, mode: "UPI", plot: "All Plots" },
    { id: 5, date: "12 Aug 2024", category: "Seeds & Nursery", desc: "Arka Rakshak F1 Hybrid Tomato Seedlings (6,000 plants)", amount: 7200, mode: "Bank Transfer", plot: "Plot 1 (Tomato)" }
  ]);

  const [showAddModal, setShowAddModal] = useState(false);
  const [newCategory, setNewCategory] = useState("Fertilizers");
  const [newDesc, setNewDesc] = useState("");
  const [newAmount, setNewAmount] = useState("");

  const totalExpense = expenseList.reduce((acc, curr) => acc + curr.amount, 0);

  const handleAddExpense = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAmount) return;
    const expenseAmt = parseFloat(newAmount) || 0;
    setExpenseList([
      {
        id: Date.now(),
        date: "Today",
        category: newCategory,
        desc: newDesc || `${newCategory} Purchase`,
        amount: expenseAmt,
        mode: "Cash / UPI",
        plot: "Plot 1 (Tomato)"
      },
      ...expenseList
    ]);
    awardCredits("DAILY_ADVISORY_CHECKIN", `Recorded ${newCategory} expense of ₹${expenseAmt}`);
    showToast(`Recorded ₹${expenseAmt} expense (+10 KrishiMitra Credits earned!)`, "success");
    setNewDesc("");
    setNewAmount("");
    setShowAddModal(false);
  };

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
              <span className="text-white font-semibold">Itemized Expense Ledger</span>
            </div>
            <h1 className="text-3xl font-display font-bold text-white flex items-center gap-3 drop-shadow-md">
              <IndianRupee className="w-8 h-8 text-brand-400" />
              Itemized Farm Expense Ledger & Cost Accounting
            </h1>
            <p className="text-sm text-neutral-300 mt-1">
              Track input expenses per acre, categorize cash flows, and generate NABARD / KCC audit-ready expense sheets.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowAddModal(true)}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-brand-500 hover:bg-brand-600 text-white font-medium text-sm transition-all shadow-lg shadow-brand-500/30 cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" />
              Record New Expense
            </button>
          </div>
        </div>

        {/* Overview Banner */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-5 rounded-2xl bg-black/45 backdrop-blur-xl border border-white/20 shadow-xl">
            <span className="text-xs font-medium text-neutral-400">Season Total Expenses (Tomato Plot 1)</span>
            <div className="mt-1 text-2xl font-bold font-display text-white">
              ₹{totalExpense.toLocaleString()}
            </div>
            <p className="text-xs text-neutral-300 mt-1">₹{(totalExpense / 2.5).toFixed(0)} / acre</p>
          </div>

          <div className="p-5 rounded-2xl bg-black/45 backdrop-blur-xl border border-white/20 shadow-xl">
            <span className="text-xs font-medium text-neutral-400">Highest Cost Category</span>
            <div className="mt-1 text-2xl font-bold font-display text-white">
              Seeds & Nursery
            </div>
            <p className="text-xs text-brand-300 mt-1">₹7,200 (50.5% of total)</p>
          </div>

          <div className="p-5 rounded-2xl bg-black/45 backdrop-blur-xl border border-white/20 shadow-xl">
            <span className="text-xs font-medium text-neutral-400">KCC Budget Headroom</span>
            <div className="mt-1 text-2xl font-bold font-display text-emerald-400">
              ₹85,740 Avail.
            </div>
            <p className="text-xs text-neutral-300 mt-1">KCC Limit: ₹1,00,000 @ 4% Interest</p>
          </div>
        </div>

        {/* Add Modal */}
        {showAddModal && (
          <div className="p-6 rounded-3xl bg-black/60 backdrop-blur-xl border border-brand-400/40 shadow-2xl space-y-4">
            <h3 className="text-base font-bold text-white">Add Expense Transaction</h3>
            <form onSubmit={handleAddExpense} className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-xs">
              <div>
                <label className="font-semibold text-neutral-200 block mb-1">Category:</label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  className="w-full rounded-xl bg-black/50 border border-white/20 p-2 text-white"
                >
                  <option className="bg-neutral-900 text-white">Fertilizers</option>
                  <option className="bg-neutral-900 text-white">Pesticides</option>
                  <option className="bg-neutral-900 text-white">Labour</option>
                  <option className="bg-neutral-900 text-white">Seeds & Nursery</option>
                  <option className="bg-neutral-900 text-white">Diesel / Energy</option>
                  <option className="bg-neutral-900 text-white">Machinery Rental</option>
                  <option className="bg-neutral-900 text-white">Transport</option>
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className="font-semibold text-neutral-200 block mb-1">Description / Item:</label>
                <input
                  type="text"
                  placeholder="e.g. 2 bags Neem Coated Urea"
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  className="w-full rounded-xl bg-black/40 border border-white/20 p-2 text-white placeholder-neutral-400"
                />
              </div>

              <div>
                <label className="font-semibold text-neutral-200 block mb-1">Amount (₹):</label>
                <input
                  type="number"
                  placeholder="₹ Amount"
                  value={newAmount}
                  onChange={(e) => setNewAmount(e.target.value)}
                  className="w-full rounded-xl bg-black/40 border border-white/20 p-2 text-white font-bold"
                  required
                />
              </div>

              <div className="sm:col-span-4 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-brand-500 text-white text-xs font-semibold hover:bg-brand-600 shadow-lg shadow-brand-500/30 cursor-pointer"
                >
                  Save Transaction
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Expense List Table */}
        <div className="bg-black/45 backdrop-blur-xl rounded-3xl p-6 border border-white/20 shadow-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/10 text-[11px] font-semibold text-neutral-300 uppercase tracking-wider">
                  <th className="py-3.5 px-4">Date</th>
                  <th className="py-3.5 px-4">Category</th>
                  <th className="py-3.5 px-4">Description / Supplier</th>
                  <th className="py-3.5 px-4">Plot</th>
                  <th className="py-3.5 px-4">Payment Mode</th>
                  <th className="py-3.5 px-4 text-right">Amount (₹)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10 text-xs text-neutral-200">
                {expenseList.map((item) => (
                  <tr key={item.id} className="hover:bg-white/5 transition-colors">
                    <td className="py-3.5 px-4 font-semibold text-white flex items-center gap-2">
                      <Calendar className="w-3.5 h-3.5 text-neutral-400" />
                      {item.date}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-white/10 border border-white/10 text-neutral-200">
                        {item.category}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-medium text-white">{item.desc}</td>
                    <td className="py-3.5 px-4 text-neutral-300">{item.plot}</td>
                    <td className="py-3.5 px-4 text-neutral-300">{item.mode}</td>
                    <td className="py-3.5 px-4 text-right font-mono font-bold text-white">
                      ₹{item.amount.toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
