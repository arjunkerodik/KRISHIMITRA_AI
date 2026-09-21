"use client";

import React, { useState } from "react";
import { useApp } from "@/lib/store";
import {
  Layers,
  Satellite,
  Droplets,
  AlertTriangle,
  CheckCircle2,
  ScanLine,
  Sparkles,
  Camera,
  Info,
  Play,
  RotateCw,
  Wind,
  Download,
  X,
  Radio,
  Zap,
} from "lucide-react";

export const DigitalTwinViewer: React.FC = () => {
  const { activeFarm, showToast } = useApp();
  const [activeLayer, setActiveLayer] = useState<"ndvi" | "moisture" | "drone" | "ndre">("ndvi");
  const [selectedZone, setSelectedZone] = useState<string>("zone_b");
  const [isDroneScanning, setIsDroneScanning] = useState<boolean>(false);
  const [droneProgress, setDroneProgress] = useState<number>(0);
  const [showDroneModal, setShowDroneModal] = useState<boolean>(false);
  const [valveActive, setValveActive] = useState<boolean>(false);

  const zones = [
    {
      id: "zone_a",
      name: "Zone A (North)",
      area: "0.8 Acres",
      ndvi: 0.82,
      ndre: 0.74,
      moisture: 68,
      status: "Optimal Canopy Health",
      statusColor: "text-emerald-300 bg-emerald-500/20 border-emerald-500/30",
      notes: "Dense green foliage with vigorous vegetative growth.",
      action: "Maintain current drip fertigation schedule.",
    },
    {
      id: "zone_b",
      name: "Zone B (North-East)",
      area: "0.6 Acres",
      ndvi: 0.58,
      ndre: 0.49,
      moisture: 82,
      status: "Moderate Stress / High Moisture",
      statusColor: "text-rose-300 bg-rose-500/20 border-rose-500/30",
      notes: "High overnight relative humidity (88%) created early blight susceptibility.",
      action: "Scout lower canopy for circular target-board leaf lesions.",
    },
    {
      id: "zone_c",
      name: "Zone C (South-West)",
      area: "0.6 Acres",
      ndvi: 0.76,
      ndre: 0.69,
      moisture: 64,
      status: "Healthy / Flowering",
      statusColor: "text-emerald-300 bg-emerald-500/20 border-emerald-500/30",
      notes: "Optimal flower set. Balanced potassium absorption.",
      action: "Plan scheduled micronutrient spray for Thursday.",
    },
    {
      id: "zone_d",
      name: "Zone D (South-East)",
      area: "0.5 Acres",
      ndvi: 0.49,
      ndre: 0.41,
      moisture: 42,
      status: "Water Stress / Emitter Clog",
      statusColor: "text-amber-300 bg-amber-500/20 border-amber-500/30",
      notes: "Soil moisture dropped to 42% (below 60% threshold).",
      action: "Check lateral drip line 18 for emitter sand blockages.",
    },
  ];

  const current = zones.find((z) => z.id === selectedZone) || zones[1];

  const handleTriggerDroneScan = () => {
    setShowDroneModal(true);
    setIsDroneScanning(true);
    setDroneProgress(0);

    const interval = setInterval(() => {
      setDroneProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsDroneScanning(false);
          showToast(
            "Drone Field Survey Completed",
            "Flight #DF-928 mapped 2.5 acres. 18 multispectral images uploaded & stitched.",
            "success"
          );
          return 100;
        }
        return prev + 15;
      });
    }, 400);
  };

  const handleToggleValve = () => {
    const nextState = !valveActive;
    setValveActive(nextState);
    if (nextState) {
      showToast("Solenoid Valve 4 Activated", "15-minute micro-pulse initiated for Zone D (South-East)", "success");
    } else {
      showToast("Solenoid Valve 4 Stopped", "Zone D irrigation pulse closed manually.", "info");
    }
  };

  const handleExportMap = () => {
    showToast("Spectral Map Exported", "Generated High-Res Sentinel-2 NDVI & Thermal Overlay (PNG)", "success");
  };

  return (
    <div className="w-full bg-black/45 backdrop-blur-xl rounded-3xl border border-white/20 p-5 sm:p-6 shadow-2xl text-white">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/15">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="font-display font-bold text-xl text-white tracking-tight drop-shadow-md">
              Farm Digital Twin & Multispectral Spatial Map
            </h2>
            <span className="text-xs px-2.5 py-0.5 rounded-lg font-semibold bg-sky-500/25 text-sky-200 border border-sky-400/30">
              Sentinel-2 & Drone • Section 30 & 31
            </span>
          </div>
          <p className="text-xs text-neutral-300 mt-1">
            Visual field simulation for {activeFarm.name} ({activeFarm.areaAcres} Acres, {activeFarm.currentCrop})
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={handleTriggerDroneScan}
            className="px-3.5 py-2 rounded-xl bg-white/15 hover:bg-white/25 text-white text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer shadow-md border border-white/20"
          >
            <Camera className="w-3.5 h-3.5 text-lime-400" />
            <span>🚁 Drone Scan</span>
          </button>

          <button
            onClick={handleExportMap}
            className="px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer border border-white/15"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Map</span>
          </button>
        </div>
      </div>

      {/* Layer Mode Toggle Bar */}
      <div className="flex items-center justify-between gap-2 mt-4 flex-wrap">
        <div className="flex items-center gap-1.5 bg-black/40 p-1 rounded-xl border border-white/15 text-xs">
          <button
            onClick={() => setActiveLayer("ndvi")}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-colors ${
              activeLayer === "ndvi" ? "bg-brand-600 text-white shadow-sm" : "text-neutral-300 hover:text-white"
            }`}
          >
            🌿 NDVI Index
          </button>
          <button
            onClick={() => setActiveLayer("ndre")}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-colors ${
              activeLayer === "ndre" ? "bg-emerald-600 text-white shadow-sm" : "text-neutral-300 hover:text-white"
            }`}
          >
            🌱 NDRE Chlorophyll
          </button>
          <button
            onClick={() => setActiveLayer("moisture")}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-colors ${
              activeLayer === "moisture" ? "bg-sky-600 text-white shadow-sm" : "text-neutral-300 hover:text-white"
            }`}
          >
            💧 Soil Moisture
          </button>
          <button
            onClick={() => setActiveLayer("drone")}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-colors ${
              activeLayer === "drone" ? "bg-white/20 text-white shadow-sm" : "text-neutral-300 hover:text-white"
            }`}
          >
            🚁 Drone RGB
          </button>
        </div>

        <div className="text-[11px] text-neutral-300 font-mono">
          Last Pass: Sentinel-2 (Today 09:45 AM) • 10m Ground Resolution
        </div>
      </div>

      {/* Main Twin Canvas & Zone Cards */}
      <div className="mt-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left: Interactive 2D Field Grid Map (7 Cols) */}
        <div className="lg:col-span-7 space-y-3">
          <div className="relative aspect-4/3 rounded-2xl overflow-hidden border-2 border-white/20 bg-black/80 p-3 grid grid-cols-2 gap-3 shadow-inner">
            
            {/* Zone A */}
            <div
              onClick={() => setSelectedZone("zone_a")}
              className={`p-4 rounded-xl cursor-pointer transition-all duration-300 flex flex-col justify-between border-2 ${
                selectedZone === "zone_a" ? "border-white ring-2 ring-brand-400 scale-[1.02]" : "border-brand-500/50"
              } ${
                activeLayer === "ndvi"
                  ? "bg-gradient-to-br from-brand-600/80 to-brand-800/90 text-white"
                  : activeLayer === "ndre"
                  ? "bg-gradient-to-br from-emerald-600/80 to-emerald-800/90 text-white"
                  : activeLayer === "moisture"
                  ? "bg-gradient-to-br from-sky-600/80 to-sky-800/90 text-white"
                  : "bg-[url('/nature-farm-bg.jpg')] bg-cover bg-center text-white"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-display font-bold text-xs">Zone A (North)</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-black/50 backdrop-blur-sm">
                  {activeLayer === "ndvi" ? "NDVI 0.82" : activeLayer === "ndre" ? "NDRE 0.74" : activeLayer === "moisture" ? "68% Moisture" : "RGB 4K"}
                </span>
              </div>
              <span className="text-[10px] text-white/80">0.8 Acres • Optimal Canopy</span>
            </div>

            {/* Zone B (High Alert) */}
            <div
              onClick={() => setSelectedZone("zone_b")}
              className={`p-4 rounded-xl cursor-pointer transition-all duration-300 flex flex-col justify-between border-2 ${
                selectedZone === "zone_b" ? "border-white ring-2 ring-danger-400 scale-[1.02]" : "border-danger-500/50"
              } ${
                activeLayer === "ndvi"
                  ? "bg-gradient-to-br from-amber-600/80 to-danger-800/90 text-white"
                  : activeLayer === "ndre"
                  ? "bg-gradient-to-br from-amber-700/80 to-danger-900/90 text-white"
                  : activeLayer === "moisture"
                  ? "bg-gradient-to-br from-sky-800/90 to-sky-950/90 text-white"
                  : "bg-[url('/nature-farm-bg.jpg')] bg-cover bg-bottom text-white"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-display font-bold text-xs flex items-center gap-1">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-300 animate-bounce" />
                  Zone B (NE)
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-black/50 backdrop-blur-sm">
                  {activeLayer === "ndvi" ? "NDVI 0.58" : activeLayer === "ndre" ? "NDRE 0.49" : activeLayer === "moisture" ? "82% Moisture" : "RGB 4K"}
                </span>
              </div>
              <span className="text-[10px] text-amber-200 font-semibold">0.6 Acres • Moisture Stress</span>
            </div>

            {/* Zone C */}
            <div
              onClick={() => setSelectedZone("zone_c")}
              className={`p-4 rounded-xl cursor-pointer transition-all duration-300 flex flex-col justify-between border-2 ${
                selectedZone === "zone_c" ? "border-white ring-2 ring-brand-400 scale-[1.02]" : "border-brand-500/50"
              } ${
                activeLayer === "ndvi"
                  ? "bg-gradient-to-br from-brand-600/80 to-brand-700/90 text-white"
                  : activeLayer === "ndre"
                  ? "bg-gradient-to-br from-emerald-600/80 to-emerald-700/90 text-white"
                  : activeLayer === "moisture"
                  ? "bg-gradient-to-br from-sky-600/80 to-sky-700/90 text-white"
                  : "bg-[url('/nature-farm-bg.jpg')] bg-cover bg-left text-white"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-display font-bold text-xs">Zone C (SW)</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-black/50 backdrop-blur-sm">
                  {activeLayer === "ndvi" ? "NDVI 0.76" : activeLayer === "ndre" ? "NDRE 0.69" : activeLayer === "moisture" ? "64% Moisture" : "RGB 4K"}
                </span>
              </div>
              <span className="text-[10px] text-white/80">0.6 Acres • Flowering Active</span>
            </div>

            {/* Zone D */}
            <div
              onClick={() => setSelectedZone("zone_d")}
              className={`p-4 rounded-xl cursor-pointer transition-all duration-300 flex flex-col justify-between border-2 ${
                selectedZone === "zone_d" ? "border-white ring-2 ring-amber-400 scale-[1.02]" : "border-amber-500/50"
              } ${
                activeLayer === "ndvi"
                  ? "bg-gradient-to-br from-amber-600/80 to-amber-700/90 text-white"
                  : activeLayer === "ndre"
                  ? "bg-gradient-to-br from-lime-600/80 to-lime-700/90 text-white"
                  : activeLayer === "moisture"
                  ? "bg-gradient-to-br from-sky-500/80 to-sky-600/90 text-white"
                  : "bg-[url('/nature-farm-bg.jpg')] bg-cover bg-right text-white"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-display font-bold text-xs">Zone D (SE)</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-black/50 backdrop-blur-sm">
                  {activeLayer === "ndvi" ? "NDVI 0.49" : activeLayer === "ndre" ? "NDRE 0.41" : activeLayer === "moisture" ? "42% Moisture" : "RGB 4K"}
                </span>
              </div>
              <span className="text-[10px] text-amber-200">0.5 Acres • Dry Spot / Emitter Clog</span>
            </div>

          </div>

          <div className="flex items-center justify-between text-[11px] text-neutral-300 px-1">
            <span>Spectral Bands: B4 (Red: 665nm) & B8 (NIR: 842nm)</span>
            <span className="font-mono">Pixel Calibration: Radiometrically Terrain Corrected</span>
          </div>
        </div>

        {/* Right: Selected Zone Inspector (5 Cols) */}
        <div className="lg:col-span-5 p-5 rounded-2xl border border-white/15 bg-black/40 backdrop-blur-md space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">
                Active Zone Telemetry
              </span>
              <h3 className="font-display font-bold text-base text-white">
                {current.name}
              </h3>
            </div>
            <span className="text-xs font-mono font-bold text-neutral-300">
              {current.area}
            </span>
          </div>

          {/* Metrics */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 rounded-xl bg-black/50 border border-white/15">
              <span className="text-[10px] text-neutral-400 uppercase font-bold block">Vegetation NDVI</span>
              <span className="font-display font-bold text-xl text-white">
                {current.ndvi}
              </span>
              <span className="text-[10px] text-neutral-400 block">Scale: -1.0 to +1.0</span>
            </div>

            <div className="p-3 rounded-xl bg-black/50 border border-white/15">
              <span className="text-[10px] text-neutral-400 uppercase font-bold block">Soil Moisture</span>
              <span className={`font-display font-bold text-xl ${
                current.moisture > 75 ? "text-danger-400" : current.moisture < 50 ? "text-amber-400" : "text-sky-400"
              }`}>
                {current.moisture}%
              </span>
              <span className="text-[10px] text-neutral-400 block">Field Capacity: 65%</span>
            </div>
          </div>

          {/* Diagnosis & Direct Action */}
          <div className="p-3.5 rounded-xl bg-black/50 border border-white/15 space-y-2.5 text-xs">
            <div>
              <span className="font-bold text-neutral-200">Diagnostic Note:</span>
              <p className="text-neutral-300 mt-0.5">{current.notes}</p>
            </div>
            <div className="pt-2 border-t border-white/10 text-lime-300 font-semibold">
              <span>👉 Recommendation: </span>
              <span>{current.action}</span>
            </div>
          </div>

          {/* Zone D Specific Solenoid Valve Trigger */}
          {selectedZone === "zone_d" && (
            <div className="p-3.5 rounded-xl bg-sky-500/20 border border-sky-400/30 space-y-2 animate-fade-in">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-sky-200 flex items-center gap-1.5">
                  <Droplets className="w-4 h-4 text-sky-400" />
                  <span>Lateral Valve 4 (Zone D)</span>
                </span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  valveActive ? "bg-emerald-500 text-white animate-pulse" : "bg-white/15 text-white"
                }`}>
                  {valveActive ? "VALVE OPEN (15m Pulse)" : "VALVE CLOSED"}
                </span>
              </div>
              <p className="text-[11px] text-sky-200">
                Remotely flush drip lateral 4 to clear silt blockage and balance moisture to 65%.
              </p>
              <button
                onClick={handleToggleValve}
                className={`w-full py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                  valveActive
                    ? "bg-danger-600 hover:bg-danger-700 text-white"
                    : "bg-sky-600 hover:bg-sky-500 text-white shadow-md border border-sky-400/40"
                }`}
              >
                {valveActive ? "Close Lateral Valve" : "⚡ Trigger Remote Valve Flush"}
              </button>
            </div>
          )}

          {/* General Action Button */}
          <div className="pt-2">
            <button
              onClick={() => showToast("Inspection Task Created", `Field inspection scheduled for ${current.name}`, "info")}
              className="w-full py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs transition-colors shadow-md cursor-pointer border border-brand-400/40"
            >
              Add Zone Scout Task to Today's Plan
            </button>
          </div>
        </div>

      </div>

      {/* Drone Survey HUD Modal */}
      {showDroneModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-fade-in">
          <div className="bg-black/90 text-white rounded-3xl max-w-lg w-full p-6 border border-white/25 shadow-2xl space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-white/15">
              <div className="flex items-center gap-2">
                <Radio className="w-5 h-5 text-emerald-400 animate-pulse" />
                <h3 className="font-display font-bold text-lg">
                  Autonomous Drone HUD Live Stream
                </h3>
              </div>
              <button
                onClick={() => setShowDroneModal(false)}
                className="p-1 rounded-lg hover:bg-white/15 text-neutral-300"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Video Viewfinder Mockup */}
            <div className="relative aspect-16/9 rounded-2xl overflow-hidden bg-black border border-white/15 flex flex-col justify-between p-3">
              {/* HUD Top Bar */}
              <div className="flex items-center justify-between text-[11px] font-mono text-emerald-400">
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-danger-500 animate-ping" /> REC [4K 60FPS]
                </span>
                <span>ALT: 45.2m • SPD: 11.4m/s</span>
                <span>BAT: 94% 🔋</span>
              </div>

              {/* Crosshair Target */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-24 h-24 border border-emerald-400/40 rounded-full flex items-center justify-center">
                  <div className="w-3 h-3 bg-emerald-400/80 rounded-full animate-ping" />
                </div>
              </div>

              {/* HUD Bottom Bar */}
              <div className="flex items-center justify-between text-[10px] font-mono text-white/80 bg-black/60 backdrop-blur-sm p-2 rounded-lg">
                <span>GPS: 13.1362° N, 78.1291° E</span>
                <span>WAYPOINT: {Math.min(12, Math.round((droneProgress / 100) * 12))} / 12</span>
                <span>PHOTOS: {Math.round((droneProgress / 100) * 18)} Captured</span>
              </div>
            </div>

            {/* Scanning Progress Bar */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-mono">
                <span>Mission Progress</span>
                <span className="text-emerald-400 font-bold">{droneProgress}%</span>
              </div>
              <div className="w-full h-2.5 rounded-full bg-white/15 overflow-hidden">
                <div
                  className="h-full bg-emerald-500 transition-all duration-300"
                  style={{ width: `${droneProgress}%` }}
                />
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <span className="text-xs text-neutral-400 font-mono">
                {isDroneScanning ? "Scanning Field Polygons..." : "Survey Ready for Photogrammetry Stitching"}
              </span>
              <button
                onClick={() => setShowDroneModal(false)}
                className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-colors cursor-pointer border border-emerald-400/40"
              >
                {isDroneScanning ? "Minimize HUD" : "View Orthomosaic Report"}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
