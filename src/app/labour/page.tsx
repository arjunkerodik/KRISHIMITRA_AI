"use client";

import React, { useState } from "react";
import { FarmerSidebar } from "@/components/FarmerSidebar";
import { useApp } from "@/lib/store";
import {
  Briefcase,
  Users,
  PlusCircle,
  Calendar,
  CheckCircle2,
  Wallet,
  X,
  Trash2,
  Radio,
  Sparkles,
} from "lucide-react";

export default function LabourPage() {
  const { activeFarm, showToast } = useApp();
  const [showAddModal, setShowAddModal] = useState<boolean>(false);

  const [tasks, setTasks] = useState([
    { id: "1", task: "Bamboo Staking & Tying", labourers: 4, dailyWage: 450, total: 1800, date: "2026-08-28", status: "Completed" },
    { id: "2", task: "Manual Weeding (Zone A & B)", labourers: 6, dailyWage: 400, total: 2400, date: "2026-09-02", status: "Completed" },
    { id: "3", task: "Foliar Spray & Pruning", labourers: 2, dailyWage: 500, total: 1000, date: "2026-09-07", status: "Completed" },
    { id: "4", task: "First Picking & Crating", labourers: 8, dailyWage: 450, total: 3600, date: "2026-10-24", status: "Scheduled" },
  ]);

  const [newTask, setNewTask] = useState({
    task: "Mulch Laying & Drip Repair",
    labourers: "3",
    dailyWage: "450",
    date: new Date().toISOString().split("T")[0],
    status: "Scheduled",
  });

  const totalLabourCost = tasks.reduce((sum, t) => sum + t.total, 0);

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    const lCount = Number(newTask.labourers);
    const wage = Number(newTask.dailyWage);
    if (!lCount || !wage) return;

    const entry = {
      id: `task-${Date.now()}`,
      task: newTask.task,
      labourers: lCount,
      dailyWage: wage,
      total: lCount * wage,
      date: newTask.date,
      status: newTask.status,
    };

    setTasks([...tasks, entry]);
    setShowAddModal(false);
    showToast("Labour Operation Logged", `Added "${entry.task}" with ${entry.labourers} workers. Total wage: ₹${entry.total.toLocaleString()}`, "success");
  };

  const handleToggleStatus = (id: string) => {
    setTasks(
      tasks.map((t) => {
        if (t.id === id) {
          const next = t.status === "Completed" ? "Scheduled" : "Completed";
          showToast("Status Updated", `Task marked as ${next}.`, "info");
          return { ...t, status: next };
        }
        return t;
      })
    );
  };

  const handleDeleteTask = (id: string) => {
    setTasks(tasks.filter((t) => t.id !== id));
    showToast("Task Removed", "Labour log entry deleted.", "info");
  };

  const handleBroadcastRequirement = () => {
    showToast(
      "SMS Broadcast Sent to Village Groups",
      "Notice for 8 harvest pickers dispatched to Narasapura Panchayat labor WhatsApp group.",
      "success"
    );
  };

  return (
    <div className="min-h-screen flex bg-transparent text-white">
      <div className="hidden lg:block w-64 shrink-0">
        <div className="fixed top-16 bottom-0 w-64">
          <FarmerSidebar />
        </div>
      </div>

      <div className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
        <div className="p-6 rounded-3xl bg-black/45 backdrop-blur-xl border border-white/20 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-amber-600 text-white flex items-center justify-center shadow-lg shadow-amber-600/30">
              <Briefcase className="w-6 h-6" />
            </div>
            <div>
              <h1 className="font-display font-bold text-2xl text-white tracking-tight drop-shadow-md">
                Farm Labour & Wage Management
              </h1>
              <p className="text-xs sm:text-sm text-neutral-300">
                Directly synchronized with Farm Finance cost-per-acre ledger (Section 68).
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={handleBroadcastRequirement}
              className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Radio className="w-3.5 h-3.5 text-brand-400 animate-pulse" />
              <span>Broadcast Need (SMS)</span>
            </button>

            <button
              onClick={() => setShowAddModal(true)}
              className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-amber-600/30 transition-colors cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Log Field Crew</span>
            </button>
          </div>
        </div>

        {/* Summary KPIs */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-5 rounded-2xl bg-black/45 backdrop-blur-xl border border-white/20 shadow-xl">
            <span className="text-xs font-bold text-neutral-400 uppercase">Total Season Labour Spend</span>
            <div className="font-display font-bold text-2xl text-white mt-1">
              ₹{totalLabourCost.toLocaleString()}
            </div>
            <span className="text-[11px] text-neutral-300 mt-0.5 block">₹{Math.round(totalLabourCost / activeFarm.areaAcres).toLocaleString()}/acre</span>
          </div>

          <div className="p-5 rounded-2xl bg-black/45 backdrop-blur-xl border border-white/20 shadow-xl">
            <span className="text-xs font-bold text-neutral-400 uppercase">Cumulative Man-Days</span>
            <div className="font-display font-bold text-2xl text-amber-400 mt-1">
              {tasks.reduce((sum, t) => sum + t.labourers, 0)} Man-Days
            </div>
            <span className="text-[11px] text-neutral-300 mt-0.5 block">Across {tasks.length} Operations</span>
          </div>

          <div className="p-5 rounded-2xl bg-black/45 backdrop-blur-xl border border-white/20 shadow-xl">
            <span className="text-xs font-bold text-neutral-400 uppercase">Regional Wage Standard</span>
            <div className="font-display font-bold text-2xl text-brand-400 mt-1">
              ₹400 - ₹500
            </div>
            <span className="text-[11px] text-brand-300 mt-0.5 block">Kolar District Horticulture Norm</span>
          </div>
        </div>

        {/* Tasks Table */}
        <div className="p-6 rounded-3xl bg-black/45 backdrop-blur-xl border border-white/20 shadow-2xl overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-white/10 text-neutral-300 uppercase font-semibold">
                <th className="py-2.5 px-3">Field Operation Task</th>
                <th className="py-2.5 px-3">Date</th>
                <th className="py-2.5 px-3">Crew Size</th>
                <th className="py-2.5 px-3">Daily Wage Rate</th>
                <th className="py-2.5 px-3">Total Wage</th>
                <th className="py-2.5 px-3">Status</th>
                <th className="py-2.5 px-3 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {tasks.map((t) => (
                <tr key={t.id} className="hover:bg-white/5 transition-colors">
                  <td className="py-3 px-3 font-bold text-white">{t.task}</td>
                  <td className="py-3 px-3 font-mono text-neutral-400">{t.date}</td>
                  <td className="py-3 px-3 font-semibold text-neutral-200">{t.labourers} workers</td>
                  <td className="py-3 px-3 text-neutral-300">₹{t.dailyWage}/day</td>
                  <td className="py-3 px-3 font-bold text-brand-400">₹{t.total.toLocaleString()}</td>
                  <td className="py-3 px-3">
                    <button
                      onClick={() => handleToggleStatus(t.id)}
                      className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full cursor-pointer transition-colors ${
                        t.status === "Completed"
                          ? "bg-emerald-500/30 text-emerald-300 border border-emerald-400/30"
                          : "bg-amber-500/30 text-amber-300 border border-amber-400/30"
                      }`}
                    >
                      {t.status === "Completed" ? "✓ Completed" : "⏳ Scheduled"}
                    </button>
                  </td>
                  <td className="py-3 px-3 text-center">
                    <button
                      onClick={() => handleDeleteTask(t.id)}
                      className="p-1 rounded-lg hover:bg-white/10 text-neutral-400 hover:text-red-400 cursor-pointer"
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

      {/* Add Labour Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fade-in text-white">
          <div className="bg-black/85 backdrop-blur-xl rounded-3xl max-w-md w-full p-6 border border-white/20 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-amber-400" />
                <h3 className="font-display font-bold text-lg text-white">
                  Log Field Labour Operation
                </h3>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-1 rounded-lg hover:bg-white/10 text-neutral-300 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateTask} className="space-y-3 text-xs">
              <div>
                <label className="font-semibold block mb-1">Operation Description:</label>
                <input
                  type="text"
                  required
                  value={newTask.task}
                  onChange={(e) => setNewTask({ ...newTask, task: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-white/20 bg-black/40 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-semibold block mb-1">Labourers Count:</label>
                  <input
                    type="number"
                    required
                    value={newTask.labourers}
                    onChange={(e) => setNewTask({ ...newTask, labourers: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-white/20 bg-black/40 text-white font-mono"
                  />
                </div>

                <div>
                  <label className="font-semibold block mb-1">Daily Wage (₹/day):</label>
                  <input
                    type="number"
                    required
                    value={newTask.dailyWage}
                    onChange={(e) => setNewTask({ ...newTask, dailyWage: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-white/20 bg-black/40 text-white font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold block mb-1">Scheduled Date:</label>
                <input
                  type="date"
                  value={newTask.date}
                  onChange={(e) => setNewTask({ ...newTask, date: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-white/20 bg-black/40 text-white"
                />
              </div>

              <div className="p-3 rounded-2xl bg-black/40 border border-amber-400/30 text-xs flex justify-between font-bold text-amber-300">
                <span>Calculated Wage Payout:</span>
                <span>₹{(Number(newTask.labourers) * Number(newTask.dailyWage)).toLocaleString()}</span>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-neutral-300 font-semibold hover:bg-white/10 rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-lg shadow-amber-600/30 cursor-pointer"
                >
                  Save Log
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
