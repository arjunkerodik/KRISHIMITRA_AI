"use client";

import React, { useState, useEffect } from "react";
import { Download, X, Smartphone, Sparkles, CheckCircle2, Share } from "lucide-react";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export const AppInstallPrompt: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showBanner, setShowBanner] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);
  const [showIOSModal, setShowIOSModal] = useState(false);

  useEffect(() => {
    // Check if already running in standalone app mode
    const isInStandalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      (window.navigator as any).standalone === true;

    if (isInStandalone) {
      setIsStandalone(true);
      return;
    }

    // Detect iOS
    const userAgent = window.navigator.userAgent.toLowerCase();
    const iosDevice = /iphone|ipad|ipod/.test(userAgent);
    setIsIOS(iosDevice);

    // Listen for PWA beforeinstallprompt
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      // Check if user previously dismissed in this session
      const dismissed = sessionStorage.getItem("krishimitra_pwa_dismissed");
      if (!dismissed) {
        setShowBanner(true);
      }
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    // Show banner on iOS if not dismissed
    if (iosDevice && !sessionStorage.getItem("krishimitra_pwa_dismissed")) {
      setShowBanner(true);
    }

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === "accepted") {
        setShowBanner(false);
        setDeferredPrompt(null);
      }
    } else if (isIOS) {
      setShowIOSModal(true);
    }
  };

  const handleDismiss = () => {
    setShowBanner(false);
    sessionStorage.setItem("krishimitra_pwa_dismissed", "true");
  };

  if (isStandalone || !showBanner) return null;

  return (
    <>
      {/* Floating Bottom App Install Bar */}
      <div className="fixed bottom-20 lg:bottom-6 right-4 left-4 lg:left-auto lg:max-w-md z-50 animate-in fade-in slide-in-from-bottom-4 duration-300">
        <div className="bg-slate-950/95 backdrop-blur-2xl border border-emerald-500/40 p-3.5 rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.8)] text-white relative flex items-center justify-between gap-3">
          
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-700 flex items-center justify-center shrink-0 shadow-lg ring-2 ring-emerald-400/30">
              <Smartphone className="w-5 h-5 text-white" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold font-title text-emerald-300 tracking-wide truncate">
                  Install KrishiMitra App
                </span>
                <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-200 border border-emerald-400/30">
                  OFFLINE
                </span>
              </div>
              <p className="text-[11px] text-slate-300 truncate">
                Instant access to field alerts & scanner
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handleInstallClick}
              className="px-3 py-1.5 text-xs font-bold font-mono rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-slate-950 flex items-center gap-1.5 shadow-md active:scale-95 transition-all cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Install</span>
            </button>
            <button
              onClick={handleDismiss}
              className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              aria-label="Dismiss app install banner"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* iOS Add to Home Screen Instructions Modal */}
      {showIOSModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl p-6 max-w-sm w-full text-white space-y-4 shadow-2xl relative animate-in zoom-in-95 duration-200">
            <button
              onClick={() => setShowIOSModal(false)}
              className="absolute top-4 right-4 p-1.5 rounded-full bg-slate-800 text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500 flex items-center justify-center text-slate-950 font-bold text-xl">
                🌾
              </div>
              <div>
                <h3 className="font-title font-bold text-base text-white">
                  Install on iPhone / iPad
                </h3>
                <p className="text-xs text-slate-400">Safari Web App Guide</p>
              </div>
            </div>

            <div className="space-y-3 pt-2 text-xs text-slate-300">
              <div className="flex items-start gap-2.5 p-2.5 rounded-xl bg-slate-800/80 border border-slate-700">
                <span className="font-mono text-emerald-400 font-bold text-sm">1.</span>
                <p>
                  Tap the <strong className="text-emerald-300 flex inline-flex items-center gap-1"><Share className="w-3.5 h-3.5" /> Share</strong> button in your Safari toolbar.
                </p>
              </div>

              <div className="flex items-start gap-2.5 p-2.5 rounded-xl bg-slate-800/80 border border-slate-700">
                <span className="font-mono text-emerald-400 font-bold text-sm">2.</span>
                <p>
                  Scroll down and select <strong className="text-white">"Add to Home Screen"</strong>.
                </p>
              </div>

              <div className="flex items-start gap-2.5 p-2.5 rounded-xl bg-slate-800/80 border border-slate-700">
                <span className="font-mono text-emerald-400 font-bold text-sm">3.</span>
                <p>
                  Tap <strong className="text-emerald-300">"Add"</strong> in the top right to launch KrishiMitra as a full native app!
                </p>
              </div>
            </div>

            <button
              onClick={() => setShowIOSModal(false)}
              className="w-full py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs font-mono transition-colors"
            >
              Got it!
            </button>
          </div>
        </div>
      )}
    </>
  );
};
