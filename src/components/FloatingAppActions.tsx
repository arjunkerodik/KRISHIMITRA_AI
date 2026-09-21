"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useApp } from "@/lib/store";
import { ScanLine, Mic, Sparkles, X, CheckCircle2, ChevronUp } from "lucide-react";
import { VoiceAssistantModal } from "./VoiceAssistantModal";

export const FloatingAppActions: React.FC = () => {
  const pathname = usePathname();
  const { actions, toggleActionCompleted, t } = useApp();
  const [showVoiceModal, setShowVoiceModal] = useState(false);
  const [showTodayMenu, setShowTodayMenu] = useState(false);

  // Hide on auth routes or login/signup/onboarding
  const isPublic = pathname === "/login" || pathname === "/signup" || pathname === "/onboarding";
  if (isPublic) return null;

  const pendingActions = actions.filter((a) => !a.completed);

  return (
    <>
      {/* Voice Assistant Modal launcher */}
      {showVoiceModal && (
        <VoiceAssistantModal onClose={() => setShowVoiceModal(false)} />
      )}

      {/* Floating Action Menu for Mobile App Viewports */}
      <div className="lg:hidden fixed bottom-16 right-4 z-40 flex flex-col items-end gap-2.5">
        
        {/* Today's Quick Actions Flyout */}
        {showTodayMenu && (
          <div className="bg-slate-950/95 backdrop-blur-2xl border border-slate-700/80 p-3.5 rounded-2xl shadow-2xl w-72 text-white animate-in zoom-in-90 fade-in duration-200 space-y-2 mb-1">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <div className="flex items-center gap-1.5 text-xs font-bold font-title text-emerald-300">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Today's Field Tasks ({pendingActions.length})</span>
              </div>
              <button
                onClick={() => setShowTodayMenu(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
              {actions.slice(0, 4).map((act) => (
                <div
                  key={act.id}
                  onClick={() => toggleActionCompleted(act.id)}
                  className={`p-2 rounded-xl border text-xs cursor-pointer transition-all flex items-start gap-2 ${
                    act.completed
                      ? "bg-emerald-950/20 border-emerald-500/30 text-slate-400 line-through"
                      : "bg-slate-900 border-slate-700 hover:border-emerald-500/50 text-white"
                  }`}
                >
                  <div className={`mt-0.5 w-4 h-4 rounded flex items-center justify-center shrink-0 border ${
                    act.completed ? "bg-emerald-500 border-emerald-400 text-slate-950" : "border-slate-500"
                  }`}>
                    {act.completed && <CheckCircle2 className="w-3 h-3" />}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-[11px] leading-snug">{act.title}</p>
                    <p className="text-[9px] text-slate-400 font-mono truncate">{act.reason || act.action}</p>
                  </div>
                </div>
              ))}
            </div>

            <Link
              href="/dashboard"
              onClick={() => setShowTodayMenu(false)}
              className="block text-center text-[10px] font-mono text-cyan-400 font-bold hover:underline pt-1"
            >
              Full Farm Action Plan →
            </Link>
          </div>
        )}

        {/* Quick Action Pills */}
        <div className="flex items-center gap-2">
          {/* Today Tasks Badge Button */}
          <button
            onClick={() => setShowTodayMenu(!showTodayMenu)}
            className="h-10 px-3 rounded-full bg-slate-900/90 border border-slate-700/80 text-white text-xs font-mono font-medium flex items-center gap-1.5 shadow-xl active:scale-95 transition-all backdrop-blur-xl"
            aria-label="Toggle Today's Farm Actions"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span className="text-[11px]">Tasks</span>
            {pendingActions.length > 0 && (
              <span className="w-4 h-4 rounded-full bg-rose-500 text-white text-[9px] font-bold flex items-center justify-center">
                {pendingActions.length}
              </span>
            )}
          </button>

          {/* Quick Voice Assistant FAB */}
          <button
            onClick={() => setShowVoiceModal(true)}
            className="w-11 h-11 rounded-full bg-gradient-to-tr from-cyan-600 to-emerald-500 text-white flex items-center justify-center shadow-xl ring-2 ring-emerald-400/40 hover:scale-105 active:scale-95 transition-all cursor-pointer"
            title="Ask FarmTalk AI Voice"
            aria-label="Open Voice Assistant"
          >
            <Mic className="w-5 h-5 text-slate-950" />
          </button>
        </div>
      </div>
    </>
  );
};
