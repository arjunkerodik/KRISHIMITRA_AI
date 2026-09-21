"use client";

import React, { useState, useRef } from "react";
import { useApp } from "@/lib/store";
import { DEMO_DISEASE_RECORDS, DiseaseRecord } from "@/lib/demo-data";
import {
  UploadCloud,
  Camera,
  ScanLine,
  CheckCircle2,
  AlertTriangle,
  ShieldCheck,
  Stethoscope,
  Sparkles,
  Info,
  RefreshCw,
  Calculator,
  Sliders,
  Check,
  ArrowRight,
} from "lucide-react";

interface DiseaseScannerProps {
  onScanComplete?: (result: DiseaseRecord) => void;
}

const SAMPLE_LEAF_PRESETS = [
  {
    id: "early-blight",
    title: "Tomato Early Blight",
    image: "https://images.unsplash.com/photo-1592417817098-8f3d6910985b?w=600&auto=format&fit=crop&q=80",
    recordIndex: 0,
  },
  {
    id: "late-blight",
    title: "Late Blight / Water-soaked",
    image: "https://images.unsplash.com/photo-1597848212624-a19eb35e2651?w=600&auto=format&fit=crop&q=80",
    recordIndex: 1,
  },
  {
    id: "tikka-spot",
    title: "Groundnut Tikka Leaf Spot",
    image: "https://images.unsplash.com/photo-1628352081506-83c43123ed6d?w=600&auto=format&fit=crop&q=80",
    recordIndex: 2,
  },
];

export const DiseaseScanner: React.FC<DiseaseScannerProps> = ({ onScanComplete }) => {
  const { activeFarm, showToast } = useApp();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [scanProgress, setScanProgress] = useState<number>(0);
  const [scanStage, setScanStage] = useState<string>("");
  const [scanResult, setScanResult] = useState<DiseaseRecord | null>(null);
  const [previewImage, setPreviewImage] = useState<string>(SAMPLE_LEAF_PRESETS[0].image);

  const handleStartScan = (imageOverride?: string, recordIndex = 0) => {
    if (imageOverride) {
      setPreviewImage(imageOverride);
    }
    setIsScanning(true);
    setScanResult(null);
    setScanProgress(20);
    setScanStage("Segmenting Leaf Mesophyll & Lesions...");

    setTimeout(() => {
      setScanProgress(60);
      setScanStage("Running ResNet-50 Pathology Classifier...");
    }, 600);

    setTimeout(() => {
      setScanProgress(90);
      setScanStage("Matching ICAR Integrated Pest Management Solutions...");
    }, 1100);

    setTimeout(() => {
      setScanProgress(100);
      setIsScanning(false);
      const res = DEMO_DISEASE_RECORDS[recordIndex] || DEMO_DISEASE_RECORDS[0];
      setScanResult(res);
      showToast(`Diagnosis: ${res.diseaseName}`, `Confidence: ${res.confidence}% (${res.severity} Severity)`, "success");
      if (onScanComplete) {
        onScanComplete(res);
      }
    }, 1600);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const url = event.target?.result as string;
        setPreviewImage(url);
        handleStartScan(url, 0);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* 1. CENTRAL UPLOAD & SCAN AREA */}
      <div className="bg-black/50 backdrop-blur-xl rounded-3xl border border-white/20 p-6 sm:p-8 shadow-2xl text-white">
        <div className="text-center max-w-xl mx-auto mb-6">
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            Scan Your Crop
          </h2>
          <p className="text-xs sm:text-sm text-white/70 mt-1">
            Upload a crop leaf image or use your device camera to diagnose diseases instantly with AI.
          </p>
        </div>

        {/* Upload Dropzone Container */}
        <div className="max-w-xl mx-auto border-2 border-dashed border-white/20 hover:border-emerald-500 rounded-2xl p-6 sm:p-8 text-center transition-all bg-black/40 relative">
          
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            accept="image/*"
            className="hidden"
          />

          {/* Current Preview or Icon */}
          <div className="relative w-44 h-44 mx-auto rounded-xl overflow-hidden mb-4 shadow-md border border-white/20 bg-black/50">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={previewImage}
              alt="Leaf Sample Preview"
              className="w-full h-full object-cover opacity-90"
            />
            {isScanning && (
              <div className="absolute inset-0 bg-emerald-950/70 backdrop-blur-xs flex flex-col items-center justify-center p-3 text-white">
                <div className="w-full bg-emerald-500 h-0.5 animate-scanline absolute left-0 right-0 shadow-[0_0_8px_#10b981]" />
                <RefreshCw className="w-6 h-6 animate-spin text-emerald-400 mb-2" />
                <span className="text-[11px] font-bold text-center">{scanStage}</span>
                <span className="text-xs font-mono text-emerald-300 mt-1">{scanProgress}%</span>
              </div>
            )}
          </div>

          {/* Upload & Camera Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={isScanning}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-lg transition-all cursor-pointer active:scale-98 border border-emerald-400/40"
            >
              <UploadCloud className="w-4 h-4" />
              <span>Upload Image</span>
            </button>

            <button
              onClick={() => handleStartScan(SAMPLE_LEAF_PRESETS[0].image, 0)}
              disabled={isScanning}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold shadow-md transition-all cursor-pointer border border-white/15"
            >
              <Camera className="w-4 h-4 text-emerald-400" />
              <span>Open Camera / Sample</span>
            </button>
          </div>

          {/* Quick Presets for Demo Testing */}
          <div className="mt-6 pt-4 border-t border-white/10 flex flex-wrap items-center justify-center gap-2">
            <span className="text-[11px] text-white/50 font-medium">Or test sample:</span>
            {SAMPLE_LEAF_PRESETS.map((p, idx) => (
              <button
                key={p.id}
                onClick={() => {
                  setPreviewImage(p.image);
                  handleStartScan(p.image, p.recordIndex);
                }}
                className="px-2.5 py-1 rounded-lg bg-white/10 border border-white/15 text-[11px] text-white/80 hover:border-emerald-400 hover:text-white transition-colors"
              >
                {p.title}
              </button>
            ))}
          </div>

        </div>
      </div>

      {/* 2. DIAGNOSIS RESULT SECTION */}
      {scanResult && (
        <div className="bg-black/50 backdrop-blur-xl rounded-3xl border border-white/20 p-6 sm:p-8 shadow-2xl animate-in fade-in duration-200 text-white">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  AI Diagnosis Confirmed
                </span>
                <span className="text-xs text-white/60">{new Date().toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</span>
              </div>
              <h2 className="text-2xl font-extrabold text-white mt-1">
                {scanResult.diseaseName}
              </h2>
              <p className="text-xs text-white/60 italic">
                Pathogen: {scanResult.scientificName}
              </p>
            </div>

            <div className="flex items-center gap-4">
              <div className="text-right">
                <span className="block text-[11px] text-white/50 uppercase font-semibold">Confidence</span>
                <span className="text-xl font-extrabold text-emerald-400">
                  {scanResult.confidence}%
                </span>
              </div>
              <div className="text-right">
                <span className="block text-[11px] text-white/50 uppercase font-semibold">Severity</span>
                <span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  {scanResult.severity}
                </span>
              </div>
            </div>
          </div>

          {/* Dual Track Recommendations */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            
            {/* Track 1: Organic / Biological IPM Controls */}
            <div className="p-5 rounded-2xl bg-emerald-950/40 border border-emerald-500/30">
              <div className="flex items-center gap-2 mb-3">
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
                <h3 className="text-sm font-bold text-emerald-300">
                  Track 1: Organic & Biological IPM Controls
                </h3>
              </div>
              <ul className="space-y-2 text-xs text-white/80">
                {(scanResult.immediateActions || []).map((item: string, idx: number) => (
                  <li key={idx} className="flex items-start gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Track 2: Chemical Fungicide Dosimetry */}
            <div className="p-5 rounded-2xl bg-black/40 border border-white/15">
              <div className="flex items-center gap-2 mb-3">
                <Stethoscope className="w-5 h-5 text-sky-400" />
                <h3 className="text-sm font-bold text-white">
                  Track 2: Chemical Dosimetry (Targeted)
                </h3>
              </div>
              <ul className="space-y-2 text-xs text-white/80">
                {(scanResult.preventiveActions || []).map((item: string, idx: number) => (
                  <li key={idx} className="flex items-start gap-2">
                    <Check className="w-3.5 h-3.5 text-sky-400 shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

          </div>

          {/* Dosage Calculation for Farm Acreage */}
          <div className="mt-6 p-4 rounded-2xl bg-black/40 border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2">
              <Calculator className="w-4 h-4 text-emerald-400 shrink-0" />
              <span className="text-white/80 font-medium">
                Dosage for {activeFarm.name} ({activeFarm.areaAcres} Acres): <strong className="text-white">1.25 kg Mancozeb 75% WP</strong> mixed in 500L water.
              </span>
            </div>
            <span className="text-[11px] text-white/50">
              CIB&RC Government Approved
            </span>
          </div>

        </div>
      )}

    </div>
  );
};
