"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useApp } from "@/lib/store";
import {
  CheckCircle2,
  Circle,
  Droplets,
  CloudSun,
  ScanLine,
  TrendingUp,
  FlaskConical,
  Clock,
  Sparkles,
  AlertCircle,
  HelpCircle,
  PlusCircle,
  ArrowRight,
  Sliders,
  Check,
  X
} from "lucide-react";

export const TodayFarmPlan: React.FC = () => {
  const { actions, toggleActionCompleted, addAction, activeFarm, t, showToast } = useApp();
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskCategory, setNewTaskCategory] = useState<"irrigation" | "disease" | "weather" | "market" | "nutrient">("nutrient");
  const [newTaskPriority, setNewTaskPriority] = useState<"high" | "medium" | "low">("medium");
  const [newTaskReason, setNewTaskReason] = useState("");

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "irrigation":
        return <Droplets className="w-4 h-4 text-sky-600" />;
      case "disease":
        return <ScanLine className="w-4 h-4 text-rose-600" />;
      case "weather":
        return <CloudSun className="w-4 h-4 text-amber-600" />;
      case "market":
        return <TrendingUp className="w-4 h-4 text-emerald-600" />;
      case "nutrient":
        return <FlaskConical className="w-4 h-4 text-emerald-600" />;
      default:
        return <Sparkles className="w-4 h-4 text-emerald-600" />;
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "high":
        return (
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-rose-500/20 text-rose-300 border border-rose-500/30">
            High Priority
          </span>
        );
      case "medium":
        return (
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-300 border border-amber-500/30">
            Medium
          </span>
        );
      default:
        return (
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-white/10 text-white/70 border border-white/10">
            Advisory
          </span>
        );
    }
  };

  const completedCount = actions.filter((a) => a.completed).length;

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;

    addAction({
      title: newTaskTitle,
      category: newTaskCategory,
      priority: newTaskPriority,
      action: newTaskTitle,
      reason: newTaskReason || "Scheduled as part of routine field operations.",
      timeframe: "Today",
      completed: false
    });

    setNewTaskTitle("");
    setNewTaskReason("");
    setShowAddModal(false);
    showToast("Task Added", `Added new task to today's action plan.`, "success");
  };

  return (
    <div className="bg-black/50 backdrop-blur-xl rounded-3xl border border-white/20 p-6 shadow-2xl text-white space-y-4">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-white">
              Today&apos;s Farm Action Plan
            </h2>
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              {completedCount} of {actions.length} Done
            </span>
          </div>
          <p className="text-xs text-white/70 mt-0.5">
            {activeFarm.name} ({activeFarm.currentCrop}) • Day 33 Flowering Stage
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold transition-all border border-white/15 self-start sm:self-auto cursor-pointer"
        >
          <PlusCircle className="w-3.5 h-3.5 text-emerald-400" />
          <span>Add Custom Task</span>
        </button>
      </div>

      {/* Task List */}
      <div className="space-y-3">
        {actions.map((act) => (
          <div
            key={act.id}
            className={`p-4 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
              act.completed
                ? "bg-black/30 border-white/10 opacity-60"
                : "bg-black/40 border-white/15 hover:border-emerald-500/50 shadow-lg"
            }`}
          >
            <div className="flex items-start gap-3">
              <button
                onClick={() => toggleActionCompleted(act.id)}
                className="mt-0.5 cursor-pointer text-white/50 hover:text-emerald-400 transition-colors"
              >
                {act.completed ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                ) : (
                  <Circle className="w-5 h-5 text-white/30" />
                )}
              </button>

              <div>
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-xl bg-white/10 border border-white/10">
                    {getCategoryIcon(act.category)}
                  </div>
                  <h3
                    className={`text-sm font-bold ${
                      act.completed ? "line-through text-white/40" : "text-white"
                    }`}
                  >
                    {act.title}
                  </h3>
                  {getPriorityBadge(act.priority)}
                </div>
                <p className="text-xs text-white/70 mt-1 max-w-xl">
                  {act.reason}
                </p>
              </div>
            </div>

            <div className="self-end sm:self-center shrink-0">
              <button
                onClick={() => toggleActionCompleted(act.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  act.completed
                    ? "bg-white/10 text-white/40 border border-white/5"
                    : "bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg border border-emerald-400/40"
                }`}
              >
                {act.completed ? "Completed" : "Mark Done"}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal: Add Task */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-black/90 backdrop-blur-2xl rounded-3xl border border-white/20 max-w-md w-full p-6 shadow-2xl space-y-4 text-white">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <h3 className="font-bold text-base text-white">Add Farm Task</h3>
              <button onClick={() => setShowAddModal(false)} className="p-1 rounded-lg text-white/60 hover:text-white hover:bg-white/10 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateTask} className="space-y-3 text-xs">
              <div>
                <label className="block text-emerald-400 font-semibold mb-1">Task Title</label>
                <input
                  type="text"
                  placeholder="e.g. Inspect drip filter valves"
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                  className="w-full text-xs rounded-xl border border-white/20 p-2.5 bg-black/60 text-white placeholder-white/40 focus:outline-none focus:border-emerald-500"
                  required
                />
              </div>

              <div>
                <label className="block text-emerald-400 font-semibold mb-1">Category</label>
                <select
                  value={newTaskCategory}
                  onChange={(e) => setNewTaskCategory(e.target.value as any)}
                  className="w-full text-xs rounded-xl border border-white/20 p-2.5 bg-black/60 text-white focus:outline-none focus:border-emerald-500"
                >
                  <option value="irrigation">Irrigation</option>
                  <option value="nutrient">Nutrition / Fertigation</option>
                  <option value="disease">Disease / Pest Scouting</option>
                  <option value="weather">Weather Preparedness</option>
                  <option value="market">Harvest & Mandi Dispatch</option>
                </select>
              </div>

              <div>
                <label className="block text-emerald-400 font-semibold mb-1">Reason / Instructions</label>
                <textarea
                  placeholder="e.g. Flush line with clean water before fertigation run."
                  value={newTaskReason}
                  onChange={(e) => setNewTaskReason(e.target.value)}
                  rows={2}
                  className="w-full text-xs rounded-xl border border-white/20 p-2.5 bg-black/60 text-white placeholder-white/40 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="pt-3 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/15 text-xs font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-lg border border-emerald-400/40 cursor-pointer"
                >
                  Add Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
