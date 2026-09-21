"use client";

import React, { useState } from "react";
import { useApp } from "@/lib/store";
import {
  Map,
  Layers,
  Store,
  FlaskConical,
  Warehouse,
  CloudRain,
  AlertTriangle,
  Tractor,
  Compass,
  Maximize2,
  CheckCircle2,
} from "lucide-react";

export const InteractiveFarmMap: React.FC = () => {
  const { activeFarm } = useApp();

  const [layers, setLayers] = useState({
    boundary: true,
    mandis: true,
    soilLabs: true,
    coldStorage: true,
    weatherAlerts: true,
    diseaseHotspots: false,
  });

  const [selectedPoint, setSelectedPoint] = useState<{
    name: string;
    type: string;
    distance: string;
    details: string;
  } | null>({
    name: activeFarm.name,
    type: "Active Farm Boundary",
    distance: "0 km",
    details: `${activeFarm.areaAcres} Acres • ${activeFarm.soilType} • ${activeFarm.currentCrop} (Day 33)`,
  });

  const toggleLayer = (key: keyof typeof layers) => {
    setLayers((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const mapPoints = [
    {
      id: "farm_home",
      name: activeFarm.name,
      type: "Farm",
      x: 48,
      y: 52,
      color: "bg-brand-500 ring-4 ring-brand-300",
      distance: "0 km",
      details: `${activeFarm.areaAcres} Acres • ${activeFarm.currentCrop} • Sowing Day 33`,
      layer: "boundary",
    },
    {
      id: "mandi_kolar",
      name: "Kolar APMC Market Yard",
      type: "APMC Mandi",
      x: 62,
      y: 42,
      color: "bg-amber-500",
      distance: "14 km East",
      details: "Modal Price: ₹2,450/qtl • Daily Arrival: 450 tons",
      layer: "mandis",
    },
    {
      id: "mandi_bengaluru",
      name: "Bengaluru Yeshwantpur APMC",
      type: "APMC Mandi",
      x: 18,
      y: 75,
      color: "bg-amber-500",
      distance: "68 km West",
      details: "Modal Price: ₹2,780/qtl (+₹280 spread) • High Buyer Volume",
      layer: "mandis",
    },
    {
      id: "soil_lab",
      name: "ICAR-KVK District Soil Testing Lab",
      type: "Soil Testing Lab",
      x: 58,
      y: 36,
      color: "bg-earth-500",
      distance: "16 km",
      details: "NPK & Micro-nutrient testing • Standard turn-around 48 hours",
      layer: "soilLabs",
    },
    {
      id: "cold_storage",
      name: "Narasapura Agro Cold Chain Facility",
      type: "Cold Storage & Warehouse",
      x: 42,
      y: 58,
      color: "bg-sky-500",
      distance: "4.5 km",
      details: "Capacity: 2,500 MT • Controlled Atmosphere for Horticulture",
      layer: "coldStorage",
    },
    {
      id: "weather_zone",
      name: "Kolar East Precipitation Alert Zone",
      type: "Weather Alert",
      x: 52,
      y: 48,
      color: "bg-sky-400 animate-ping",
      distance: "Hyperlocal",
      details: "Thunderstorms expected at 4:30 PM (18.5mm rainfall)",
      layer: "weatherAlerts",
    },
    {
      id: "disease_hotspot",
      name: "Chikkaballapur Tomato Leaf Curl Cluster",
      type: "Community Disease Alert",
      x: 35,
      y: 28,
      color: "bg-danger-500 ring-4 ring-danger-300 animate-pulse",
      distance: "22 km North",
      details: "14 verified farmer reports of Begomovirus (Whitefly vector active)",
      layer: "diseaseHotspots",
    },
  ];

  return (
    <div className="w-full bg-black/45 backdrop-blur-xl rounded-3xl border border-white/20 p-5 sm:p-6 shadow-2xl text-white">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/15">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="font-display font-bold text-xl text-white tracking-tight drop-shadow-md">
              Interactive GIS Farm Map
            </h2>
            <span className="text-xs px-2.5 py-0.5 rounded-lg font-semibold bg-brand-500/25 text-lime-200 border border-brand-400/30">
              Spatial Intelligence • Section 29
            </span>
          </div>
          <p className="text-xs text-neutral-300 mt-1">
            GPS Boundary: [13.1367° N, 78.1348° E] • Survey No. 42/1, Narasapura, Kolar
          </p>
        </div>

        {/* Legend / Quick Filter */}
        <div className="flex flex-wrap items-center gap-1.5 text-xs">
          <button
            onClick={() => toggleLayer("boundary")}
            className={`px-2.5 py-1 rounded-lg border font-medium transition-all ${
              layers.boundary ? "bg-brand-600 text-white border-brand-400/40 shadow-sm" : "bg-white/10 text-neutral-300 border-white/10 hover:bg-white/20 hover:text-white"
            }`}
          >
            🌾 Farm
          </button>
          <button
            onClick={() => toggleLayer("mandis")}
            className={`px-2.5 py-1 rounded-lg border font-medium transition-all ${
              layers.mandis ? "bg-amber-600 text-white border-amber-400/40 shadow-sm" : "bg-white/10 text-neutral-300 border-white/10 hover:bg-white/20 hover:text-white"
            }`}
          >
            🏪 Mandis
          </button>
          <button
            onClick={() => toggleLayer("weatherAlerts")}
            className={`px-2.5 py-1 rounded-lg border font-medium transition-all ${
              layers.weatherAlerts ? "bg-sky-600 text-white border-sky-400/40 shadow-sm" : "bg-white/10 text-neutral-300 border-white/10 hover:bg-white/20 hover:text-white"
            }`}
          >
            ⛅ Weather
          </button>
          <button
            onClick={() => toggleLayer("soilLabs")}
            className={`px-2.5 py-1 rounded-lg border font-medium transition-all ${
              layers.soilLabs ? "bg-amber-700 text-white border-amber-500/40 shadow-sm" : "bg-white/10 text-neutral-300 border-white/10 hover:bg-white/20 hover:text-white"
            }`}
          >
            🧪 Labs
          </button>
          <button
            onClick={() => toggleLayer("diseaseHotspots")}
            className={`px-2.5 py-1 rounded-lg border font-medium transition-all ${
              layers.diseaseHotspots ? "bg-red-600 text-white border-red-400/40 shadow-sm" : "bg-white/10 text-neutral-300 border-white/10 hover:bg-white/20 hover:text-white"
            }`}
          >
            ⚠️ Hotspots
          </button>
        </div>
      </div>

      {/* Map Viewport Canvas Mockup */}
      <div className="relative w-full h-[420px] rounded-2xl overflow-hidden mt-4 border border-white/15 bg-black/80 shadow-inner select-none">
        
        {/* Background Satellite Tile Visual Grid */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:40px_40px]" />

        {/* Farm Boundary Polygon Overlay */}
        {layers.boundary && (
          <svg className="absolute inset-0 w-full h-full pointer-events-none">
            <polygon
              points="180,140 310,130 340,240 190,260"
              className="fill-brand-500/25 stroke-lime-400 stroke-2"
              strokeDasharray="4 2"
            />
            <text x="210" y="200" className="fill-white text-[11px] font-bold tracking-wider">
              {activeFarm.name} (2.5 Ac)
            </text>
          </svg>
        )}

        {/* Interactive Points of Interest */}
        {mapPoints.map((pt) => {
          if (!layers[pt.layer as keyof typeof layers]) return null;
          const isSelected = selectedPoint?.name === pt.name;
          return (
            <div
              key={pt.id}
              onClick={() => setSelectedPoint(pt)}
              style={{ left: `${pt.x}%`, top: `${pt.y}%` }}
              className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer group z-10 transition-transform hover:scale-125"
            >
              <div
                className={`w-4 h-4 rounded-full ${pt.color} ${
                  isSelected ? "ring-4 ring-white scale-125" : ""
                }`}
              />
              <div className="absolute top-5 left-1/2 -translate-x-1/2 bg-black/85 backdrop-blur-md text-white px-2 py-0.5 rounded text-[10px] whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity border border-white/20 pointer-events-none">
                {pt.name}
              </div>
            </div>
          );
        })}

        {/* Map Compass & Scale */}
        <div className="absolute top-3 right-3 bg-black/70 backdrop-blur-md p-2 rounded-xl border border-white/20 text-xs font-mono flex items-center gap-1.5 shadow-lg text-white">
          <Compass className="w-4 h-4 text-lime-400 animate-spin" />
          <span className="font-bold">N</span>
        </div>

        {/* Bottom Floating Info Card */}
        {selectedPoint && (
          <div className="absolute bottom-3 left-3 right-3 sm:right-auto sm:max-w-md bg-black/85 backdrop-blur-xl p-3.5 rounded-2xl border border-white/25 shadow-2xl z-20 animate-fade-in text-white">
            <div className="flex items-start justify-between gap-2">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-lime-300">
                  {selectedPoint.type} • {selectedPoint.distance}
                </span>
                <h4 className="font-display font-bold text-sm text-white mt-0.5">
                  {selectedPoint.name}
                </h4>
                <p className="text-xs text-neutral-300 mt-1">
                  {selectedPoint.details}
                </p>
              </div>
            </div>
          </div>
        )}

      </div>

    </div>
  );
};
