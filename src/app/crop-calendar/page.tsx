"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { FarmerSidebar } from "@/components/FarmerSidebar";
import { useApp } from "@/lib/store";
import {
  FlaskConical,
  Bug,
  ScanLine,
  Droplets,
} from "lucide-react";

export default function FarmPlanPage() {
  const router = useRouter();
  const { activeFarm, showToast } = useApp();

  const [tasks, setTasks] = useState([
    {
      id: "t1",
      category: "Irrigation",
      name: "Skip Evening Drip Irrigation",
      description: "Localized heavy rain (18.5mm) forecasted around 4:30 PM with 84% probability. Save energy and avoid root hypoxia.",
      status: "Scheduled",
      actionText: "Postpone Cycle",
      icon: Droplets,
      color: "text-sky-400 bg-sky-500/20 border border-sky-400/30",
      statusColor: "bg-sky-500/20 text-sky-300 border border-sky-500/30",
    },
    {
      id: "t2",
      category: "Nutrition",
      name: "Water-Soluble Fertigation (13:0:45)",
      description: "Apply 3 kg/acre Potassium Nitrate + Boron 20% (1g/L) to prevent flower drop and stimulate fruit setting.",
      status: "Action Needed",
      actionText: "Mark as Done",
      icon: FlaskConical,
      color: "text-emerald-400 bg-emerald-500/20 border border-emerald-400/30",
      statusColor: "bg-amber-500/20 text-amber-300 border border-amber-500/30",
    },
    {
      id: "t3",
      category: "Pest Monitoring",
      name: "Fruit Borer & Whitefly Scouting",
      description: "Inspect underside of top canopy leaves and install 4 pheromone traps/acre (Helilure) across boundary rows.",
      status: "Routine Check",
      actionText: "Open Guide",
      icon: Bug,
      color: "text-amber-400 bg-amber-500/20 border border-amber-400/30",
      statusColor: "bg-white/10 text-white/70 border border-white/10",
    },
    {
      id: "t4",
      category: "Disease Monitoring",
      name: "Early Blight Prophylactic Foliar Check",
      description: "Relative humidity reached 88% overnight. Inspect lower mature leaves for concentric brown bullseye rings.",
      status: "High Alert",
      actionText: "Scan Leaf Now",
      icon: ScanLine,
      color: "text-rose-400 bg-rose-500/20 border border-rose-400/30",
      statusColor: "bg-rose-500/20 text-rose-300 border border-rose-500/30",
    },
  ]);

  const handleTaskAction = (taskId: string, actionText: string) => {
    if (actionText === "Scan Leaf Now") {
      router.push("/disease");
      return;
    }
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, status: "Completed", actionText: "Completed" } : t))
    );
    showToast("Task Updated", `Task marked as completed in farm ledger.`, "success");
  };

  const lifecycleStages = [
    { name: "Nursery & Seed Sowing", days: "Day 1 - 10", status: "Completed", date: "Aug 08" },
    { name: "Transplanting & Staking", days: "Day 11 - 20", status: "Completed", date: "Aug 18" },
    { name: "Vegetative Growth", days: "Day 21 - 30", status: "Completed", date: "Aug 28" },
    { name: "Flowering & Early Fruit Set", days: "Day 31 - 50", status: "Current Active", date: "Sep 08 - Sep 28" },
    { name: "Fruit Enlargement", days: "Day 51 - 75", status: "Upcoming", date: "Sep 29 - Oct 23" },
    { name: "Harvest Picking", days: "Day 76 - 90", status: "Upcoming", date: "Oct 24 - Nov 08" },
  ];

  return (
    <div className="min-h-screen flex bg-transparent">
      <div className="hidden lg:block w-64 shrink-0">
        <div className="fixed top-16 bottom-0 w-64">
          <FarmerSidebar />
        </div>
      </div>

      <div className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="bg-black/50 backdrop-blur-xl rounded-3xl border border-white/20 p-6 shadow-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-white">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                Day 33 of 90 Days
              </span>
              <span className="text-xs text-white/70">{activeFarm.name}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-1">
              Farm Plan: Flowering & Early Fruit Set
            </h1>
            <p className="text-sm text-white/70 mt-0.5">
              Daily task schedule generated dynamically by agronomic AI models.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/disease"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-lg transition-all"
            >
              <ScanLine className="w-3.5 h-3.5" />
              <span>Scan Crop</span>
            </Link>
          </div>
        </div>

        {/* 1. TODAY'S TASKS TIMELINE */}
        <div className="bg-black/50 backdrop-blur-xl rounded-3xl border border-white/20 p-6 shadow-2xl text-white">
          <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-6">
            <div>
              <h2 className="text-lg font-bold text-white">Today&apos;s Action Tasks</h2>
              <p className="text-xs text-white/70">Prioritized actions for maximum yield protection.</p>
            </div>
            <span className="text-xs font-medium text-emerald-400">
              {tasks.filter((t) => t.status === "Completed").length} of {tasks.length} Completed
            </span>
          </div>

          <div className="space-y-4">
            {tasks.map((task) => {
              const Icon = task.icon;
              const isCompleted = task.status === "Completed";

              return (
                <div
                  key={task.id}
                  className={`p-4 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                    isCompleted
                      ? "bg-black/30 border-white/10 opacity-60"
                      : "bg-black/40 border-white/15 hover:border-emerald-500/50 shadow-lg"
                  }`}
                >
                  <div className="flex items-start gap-3.5">
                    <div className="p-2.5 rounded-xl shrink-0 bg-white/10 border border-white/10 text-emerald-400">
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold text-white/50 uppercase tracking-wider">
                          {task.category}
                        </span>
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-white/10 text-emerald-300 border border-white/10">
                          {task.status}
                        </span>
                      </div>
                      <h3 className="text-sm font-bold text-white mt-0.5">
                        {task.name}
                      </h3>
                      <p className="text-xs text-white/70 mt-1 max-w-xl leading-relaxed">
                        {task.description}
                      </p>
                    </div>
                  </div>

                  <div className="self-end sm:self-center shrink-0">
                    <button
                      onClick={() => handleTaskAction(task.id, task.actionText)}
                      disabled={isCompleted}
                      className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                        isCompleted
                          ? "bg-white/10 text-white/40 cursor-not-allowed border border-white/5"
                          : "bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg cursor-pointer active:scale-98 border border-emerald-400/40"
                      }`}
                    >
                      {task.actionText}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 2. CROP LIFECYCLE PROGRESS */}
        <div className="bg-black/50 backdrop-blur-xl rounded-3xl border border-white/20 p-6 shadow-2xl text-white">
          <h2 className="text-base font-bold text-white mb-4">
            Full Crop Lifecycle Stages
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {lifecycleStages.map((stage, idx) => {
              const isCurrent = stage.status === "Current Active";
              const isDone = stage.status === "Completed";

              return (
                <div
                  key={idx}
                  className={`p-3.5 rounded-2xl border text-xs ${
                    isCurrent
                      ? "bg-emerald-950/50 border-emerald-500/40 font-medium"
                      : isDone
                      ? "bg-black/40 border-white/10 text-white/80"
                      : "bg-black/20 border-white/5 text-white/40"
                  }`}
                >
                  <div className="flex items-center justify-between gap-1 mb-1">
                    <span className="font-bold text-white">{stage.name}</span>
                    <span
                      className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                        isCurrent
                          ? "bg-emerald-600 text-white border border-emerald-400/40"
                          : isDone
                          ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                          : "bg-white/10 text-white/50"
                      }`}
                    >
                      {stage.status}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-white/60">
                    <span>{stage.days}</span>
                    <span>{stage.date}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
}
