"use client";

import React from "react";
import { FarmerSidebar } from "@/components/FarmerSidebar";
import { useApp } from "@/lib/store";
import {
  Bell,
  CheckCircle2,
  AlertTriangle,
  Info,
  Clock,
} from "lucide-react";

export default function NotificationsPage() {
  const { notifications, markAllNotificationsAsRead, markNotificationAsRead } = useApp();

  return (
    <div className="min-h-screen flex bg-transparent">
      <div className="hidden lg:block w-64 shrink-0">
        <div className="fixed top-16 bottom-0 w-64">
          <FarmerSidebar />
        </div>
      </div>

      <div className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8 space-y-6 max-w-5xl mx-auto text-white">
        <div className="p-6 rounded-3xl bg-black/45 backdrop-blur-xl border border-white/20 shadow-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-brand-600 text-white flex items-center justify-center shadow-lg">
              <Bell className="w-6 h-6" />
            </div>
            <div>
              <h1 className="font-display font-bold text-2xl text-white tracking-tight">
                Notifications & Emergency Alerts Feed
              </h1>
              <p className="text-xs sm:text-sm text-white/70">
                Real-time weather alerts, disease warnings, scheme updates, and expert responses (Section 35).
              </p>
            </div>
          </div>

          <button
            onClick={markAllNotificationsAsRead}
            className="text-xs font-bold text-brand-300 hover:underline w-fit cursor-pointer"
          >
            Mark all as read
          </button>
        </div>

        <div className="space-y-3">
          {notifications.map((n) => (
            <div
              key={n.id}
              onClick={() => markNotificationAsRead(n.id)}
              className={`p-5 rounded-2xl border transition-all cursor-pointer backdrop-blur-md ${
                !n.read
                  ? "bg-black/55 border-brand-400/60 shadow-xl ring-1 ring-brand-400/40 text-white"
                  : "bg-black/35 border-white/10 opacity-75 hover:opacity-100 text-white/80"
              }`}
            >
              <div className="flex items-start gap-3.5">
                <div className="mt-0.5">
                  {n.type === "warning" && <AlertTriangle className="w-5 h-5 text-amber-400" />}
                  {n.type === "alert" && <AlertTriangle className="w-5 h-5 text-red-400" />}
                  {n.type === "success" && <CheckCircle2 className="w-5 h-5 text-emerald-400" />}
                  {n.type === "info" && <Info className="w-5 h-5 text-sky-400" />}
                </div>

                <div className="flex-1">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <h3 className="font-display font-bold text-sm text-white">
                      {n.title}
                    </h3>
                    <span className="text-[11px] text-white/50 font-mono flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {n.timestamp}
                    </span>
                  </div>
                  <p className="text-xs text-white/70 leading-relaxed">
                    {n.message}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
