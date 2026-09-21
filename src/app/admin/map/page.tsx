"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  MapPin, 
  Layers, 
  Satellite, 
  Radio, 
  Activity, 
  ShieldAlert, 
  Sparkles, 
  Search 
} from "lucide-react";
import { useApp } from "@/lib/store";
import { InteractiveFarmMap } from "@/components/InteractiveFarmMap";

export default function AdminMapPage() {
  const { language } = useApp();

  return (
    <div className="min-h-screen bg-transparent text-white py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 p-6 rounded-3xl bg-black/45 backdrop-blur-xl border border-white/20 shadow-2xl">
          <div>
            <div className="flex items-center gap-2 text-xs font-medium text-neutral-300 mb-1">
              <Link href="/admin" className="hover:text-brand-300">Admin Portal</Link>
              <span>/</span>
              <span className="text-white font-semibold">GIS Command Map</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-display font-bold text-white flex items-center gap-3">
              <Layers className="w-8 h-8 text-brand-400" />
              District GIS Command Map & Spatial Cluster Intelligence
            </h1>
            <p className="text-sm text-neutral-200 mt-1">
              Live geospatial overlay across Kolar taluks: farm plot boundaries, APMC mandis, cold storage hubs, KVK labs, and active disease outbreaks.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/admin"
              className="px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 border border-brand-400/40 text-white text-xs font-semibold transition-all shadow-md"
            >
              Back to Admin Hub
            </Link>
          </div>
        </div>

        {/* Full Interactive Farm GIS Map */}
        <InteractiveFarmMap />
      </div>
    </div>
  );
}
