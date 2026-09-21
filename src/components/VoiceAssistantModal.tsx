"use client";

import React, { useState } from "react";
import { useApp } from "@/lib/store";
import { generateCopilotResponse } from "@/lib/ai-engine";
import { Language } from "@/lib/i18n";
import {
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Languages,
  Sparkles,
  Bot,
  X,
  RotateCcw,
  CheckCircle2,
  MessageSquare
} from "lucide-react";

export const VoiceAssistantModal: React.FC<{ onClose?: () => void }> = ({ onClose }) => {
  const { language, setLanguage, activeFarm, showToast, t } = useApp();
  const [isListening, setIsListening] = useState<boolean>(false);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [transcript, setTranscript] = useState<string>("");
  const [aiResponseText, setAiResponseText] = useState<string>(
    "Tap the microphone and ask your question in your preferred language. (e.g. 'Should I irrigate today?')"
  );

  const startVoiceInput = () => {
    if (typeof window !== "undefined" && ("webkitSpeechRecognition" in window || "SpeechRecognition" in window)) {
      try {
        const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
        const recognition = new SpeechRecognition();
        const langMap: Record<Language, string> = {
          en: "en-IN",
          hi: "hi-IN",
          kn: "kn-IN",
          te: "te-IN",
          ta: "ta-IN",
          mr: "mr-IN",
        };
        recognition.lang = langMap[language] || "en-IN";
        recognition.interimResults = false;

        recognition.onstart = () => {
          setIsListening(true);
          setTranscript("Listening for speech in " + language.toUpperCase() + "...");
        };

        recognition.onresult = (event: any) => {
          const speechResult = event.results[0][0].transcript;
          setTranscript(speechResult);
          setIsListening(false);
          processQuery(speechResult);
        };

        recognition.onerror = () => {
          setIsListening(false);
          simulateSpeechRecognition("Should I irrigate today?");
        };

        recognition.onend = () => {
          setIsListening(false);
        };

        recognition.start();
      } catch {
        simulateSpeechRecognition("Should I irrigate today?");
      }
    } else {
      simulateSpeechRecognition("Should I irrigate today?");
    }
  };

  const simulateSpeechRecognition = (sampleText: string) => {
    setIsListening(true);
    setTranscript(`"${sampleText}"`);

    setTimeout(() => {
      setIsListening(false);
      processQuery(sampleText);
    }, 1000);
  };

  const processQuery = (queryText: string) => {
    const resp = generateCopilotResponse(queryText, activeFarm, language);
    const cleanText = resp.text.replace(/\*\*/g, "").replace(/#/g, "");
    setAiResponseText(cleanText);
    showToast("Voice Response Generated", undefined, "success");

    // Text to Speech
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const speakableText = cleanText.replace(/[*#•❌✅💧🔍⛔📈🛡️🏆💡]/g, " ").substring(0, 320);
      const utterance = new SpeechSynthesisUtterance(speakableText);
      const langMap: Record<Language, string> = {
        en: "en-IN",
        hi: "hi-IN",
        kn: "kn-IN",
        te: "te-IN",
        ta: "ta-IN",
        mr: "mr-IN",
      };
      utterance.lang = langMap[language] || "en-IN";
      utterance.rate = 0.95;
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleStopSpeech = () => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  const langButtons: { code: Language; label: string }[] = [
    { code: "en", label: "EN" },
    { code: "hi", label: "हिन्दी" },
    { code: "kn", label: "ಕನ್ನಡ" },
    { code: "te", label: "తెలుగు" },
    { code: "ta", label: "தமிழ்" },
    { code: "mr", label: "मराठी" },
  ];

  return (
    <div className="w-full max-w-2xl mx-auto bg-slate-900/90 backdrop-blur-2xl rounded-3xl border border-cyan-500/30 p-6 sm:p-8 shadow-2xl text-center flex flex-col items-center animate-in zoom-in-95 duration-150 text-white">
      {/* Top Bar */}
      <div className="w-full flex items-center justify-between pb-4 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-2xl bg-gradient-to-br from-cyan-500 to-emerald-600 text-white flex items-center justify-center shadow-lg border border-cyan-400/40">
            <Mic className="w-4 h-4" />
          </div>
          <span className="font-sans font-bold text-sm text-white">
            {t.nav?.voiceAssistant || "Voice Agriculture Assistant"}
          </span>
        </div>

        {/* Language selector */}
        <div className="flex flex-wrap items-center gap-1">
          {langButtons.map((l) => (
            <button
              key={l.code}
              onClick={() => setLanguage(l.code)}
              className={`px-2 py-0.5 rounded-lg text-[10px] font-mono font-bold transition-all ${
                language === l.code
                  ? "bg-cyan-600 text-white shadow-md border border-cyan-400/50"
                  : "bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white border border-slate-700"
              }`}
            >
              {l.label}
            </button>
          ))}
          {onClose && (
            <button
              onClick={onClose}
              className="p-1 ml-2 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      {/* Main Animated Mic Ring */}
      <div className="my-8 relative flex items-center justify-center">
        {isListening && (
          <div className="absolute w-36 h-36 rounded-full bg-rose-500/25 animate-ping pointer-events-none" />
        )}
        {isSpeaking && (
          <div className="absolute w-36 h-36 rounded-full bg-emerald-500/25 animate-pulse pointer-events-none" />
        )}

        <button
          onClick={() => (isSpeaking ? handleStopSpeech() : startVoiceInput())}
          className={`w-28 h-28 rounded-full flex flex-col items-center justify-center text-white shadow-2xl transition-all duration-300 transform active:scale-95 border-2 cursor-pointer ${
            isListening
              ? "bg-rose-500 shadow-rose-500/40 border-rose-400"
              : isSpeaking
              ? "bg-emerald-600 shadow-emerald-600/40 border-emerald-400"
              : "bg-gradient-to-br from-cyan-600 to-emerald-600 hover:from-cyan-500 hover:to-emerald-500 shadow-cyan-600/30 border-cyan-400/40"
          }`}
          aria-label="Toggle Voice Assistant"
        >
          {isListening ? (
            <MicOff className="w-10 h-10" />
          ) : isSpeaking ? (
            <Volume2 className="w-10 h-10 animate-bounce" />
          ) : (
            <Mic className="w-10 h-10" />
          )}
          <span className="text-[10px] font-mono font-bold mt-1 uppercase tracking-wider">
            {isListening ? "Listening" : isSpeaking ? "Speaking" : "Tap to Speak"}
          </span>
        </button>
      </div>

      {/* Live Transcript / Response Box */}
      <div className="w-full space-y-3">
        {transcript && (
          <div className="p-3 rounded-2xl bg-slate-950/70 border border-slate-800 text-xs text-slate-300 font-mono italic">
            You asked: {transcript}
          </div>
        )}

        <div className="p-4 rounded-2xl bg-slate-950/80 border border-cyan-500/30 text-xs text-slate-100 text-left leading-relaxed max-h-48 overflow-y-auto font-sans">
          <p className="whitespace-pre-wrap">{aiResponseText}</p>
        </div>
      </div>

      {/* Preset Quick Voice Commands */}
      <div className="mt-6 w-full pt-4 border-t border-slate-800">
        <span className="text-[10px] font-mono font-bold text-cyan-400 uppercase tracking-wider block mb-2">
          {`// Suggested Voice Queries (${language.toUpperCase()}):`}
        </span>
        <div className="flex flex-wrap justify-center gap-2">
          {[
            "Should I irrigate today?",
            "What is today's tomato mandi price?",
            "Why are my leaves turning yellow?",
            "How to get PMKSY drip subsidy?",
          ].map((prompt, idx) => (
            <button
              key={idx}
              onClick={() => simulateSpeechRecognition(prompt)}
              className="text-xs px-3 py-1.5 rounded-full bg-slate-800/80 hover:bg-cyan-950 hover:border-cyan-500/50 text-slate-200 hover:text-white border border-slate-700 transition-all font-medium cursor-pointer"
            >
              🎤 {prompt}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
