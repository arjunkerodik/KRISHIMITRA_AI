"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { FarmerSidebar } from "@/components/FarmerSidebar";
import { useApp } from "@/lib/store";
import { generateCopilotResponse } from "@/lib/ai-engine";
import {
  Bot,
  Mic,
  MicOff,
  Send,
  Volume2,
  VolumeX,
  Sparkles,
  MessageSquare,
  Sprout,
  Droplets,
  CloudRain,
  Store,
  Landmark,
  CheckCircle2,
  ChevronRight,
  PlusCircle,
  HelpCircle,
  ShieldCheck,
  BookOpen,
} from "lucide-react";

interface ChatMessage {
  id: string;
  sender: "ai" | "user";
  text: string;
  timestamp: string;
  suggestions?: string[];
  citation?: {
    source: string;
    title: string;
    authority: string;
  };
}

export default function FarmTalkPage() {
  const { activeFarm, soilReport, user, language, showToast, t } = useApp();

  const suggestedQuestionsByLang: Record<string, string[]> = {
    en: [
      "What should I do for my tomato crop today?",
      "Will rain affect my crop today?",
      "When should I irrigate my plot?",
      "Which APMC mandi has the best price?",
      "What government subsidies am I eligible for?",
    ],
    hi: [
      "आज मेरी फसल के लिए क्या कार्य करना चाहिए?",
      "क्या आज बारिश से फसल प्रभावित होगी?",
      "खेत में सिंचाई कब करनी चाहिए?",
      "किस मंडी में टमाटर का सबसे अच्छा भाव है?",
      "मुझे कौन सी सरकारी योजनाओं का लाभ मिल सकता है?",
    ],
    kn: [
      "ಇಂದು ನನ್ನ ಟೊಮೆಟೊ ಬೆಳೆಗೆ ಏನು ಮಾಡಬೇಕು?",
      "ಇಂದು ಮಳೆ ಬಂದರೆ ಬೆಳೆಗೆ ತೊಂದರೆಯಾಗುತ್ತದೆಯೇ?",
      "ನೀರಾವರಿ ಯಾವಾಗ ಮಾಡಬೇಕು?",
      "ಯಾವ ಮಾರುಕಟ್ಟೆಯಲ್ಲಿ ಉತ್ತಮ ಧಾರಣೆ ಇದೆ?",
      "ನನಗೆ ಯಾವ ಸರ್ಕಾರಿ ಸಬ್ಸಿಡಿಗಳು ಲಭ್ಯವಿವೆ?",
    ],
    te: [
      "ఈరోజు నా పంటకు ఏమి చేయాలి?",
      "ఈరోజు వర్షం వల్ల పంటకు నష్టం జరుగుతుందా?",
      "పొలానికి నీరు ఎప్పుడు పెట్టాలి?",
      "ఏ మార్కెట్‌లో మంచి ధర లభిస్తుంది?",
      "నాకు ఏ ప్రభుత్వ పథకాలు వర్తిస్తాయి?",
    ],
    ta: [
      "இன்று என் பயிருக்கு என்ன செய்ய வேண்டும்?",
      "இன்றைய மழை பயிரை பாதிக்குமா?",
      "எப்போது நீர்ப்பாசனம் செய்ய வேண்டும்?",
      "எந்த சந்தையில் நல்ல விலை கிடைக்கும்?",
      "எனக்கு என்ன அரசு மானியங்கள் கிடைக்கும்?",
    ],
    mr: [
      "आज माझ्या पिकासाठी काय करावे?",
      "आजच्या पावसाने पिकावर परिणाम होईल का?",
      "पिकाला पाणी कधी द्यावे?",
      "कोणत्या बाजार समितीत चांगला भाव आहे?",
      "मला कोणत्या सरकारी योजनांचा लाभ मिळेल?",
    ],
  };

  const initialQuestions = suggestedQuestionsByLang[language] || suggestedQuestionsByLang.en;

  const getGreeting = () => {
    if (language === "hi") {
      return `नमस्ते ${user.name}! मैं फार्मटॉक सॉवरेन एआई सलाहकार हूँ। मैं आपके ${activeFarm.name} के ${activeFarm.currentCrop} भूखंड, मिट्टी परीक्षण (pH ${soilReport.ph}), मौसम और एगमार्कनेट मंडी भाव से जुड़ा हुआ हूँ। मैं आपकी क्या मदद कर सकता हूँ?`;
    }
    if (language === "kn") {
      return `ನಮಸ್ಕಾರ ${user.name}! ನಾನು ಫಾರ್ಮ್‌ಟಾಕ್ ಕೃಷಿ ಎಐ ಸಹಾಯಕ. ನಿಮ್ಮ ${activeFarm.name} ಜಮೀನಿನ ${activeFarm.currentCrop} ಬೆಳೆ, ಮಣ್ಣಿನ ವರದಿ (pH ${soilReport.ph}), ಹವಾಮಾನ ಮತ್ತು ಮಾರುಕಟ್ಟೆ ದರಗಳೊಂದಿಗೆ ಸಂಪರ್ಕ ಹೊಂದಿದ್ದೇನೆ. ನಾನು ನಿಮಗೆ ಹೇಗೆ ಸಹಾಯ ಮಾಡಲಿ?`;
    }
    if (language === "te") {
      return `నమస్కారం ${user.name}! నేను ఫామ్‌టాక్ AI సలహాదారుని. మీ ${activeFarm.name} పొలం, మట్టి పరీక్ష (pH ${soilReport.ph}), వాతావరణం మరియు మార్కెట్ సమాచారంతో సేవ చేయడానికి సిద్ధంగా ఉన్నాను. నేను మీకు ఎలా సహాయపడగలను?`;
    }
    if (language === "ta") {
      return `வணக்கம் ${user.name}! நான் ஃபார்ம்டாக் AI விவசாய ஆலோசகர். உங்கள் ${activeFarm.name} பண்ணை, மண் வளம் (pH ${soilReport.ph}), வானிலை மற்றும் சந்தை நிலவரங்களுடன் உதவ தயாராக உள்ளேன். நான் உங்களுக்கு எப்படி உதவ முடியும்?`;
    }
    if (language === "mr") {
      return `नमस्कार ${user.name}! मी फार्मटॉक एआय कृषी सल्लागार आहे. आपल्या ${activeFarm.name} शेतातील ${activeFarm.currentCrop} पीक, माती परीक्षण (pH ${soilReport.ph}) व बाजारभावासह मार्गदर्शन करण्यास तयार आहे. मी काय मदत करू?`;
    }
    return `Hello ${user.name}! I am FarmTalk AI, your sovereign agronomic decision assistant for ${activeFarm.name}. I am connected to your ${activeFarm.currentCrop} plot telemetry, soil health data (pH ${soilReport.ph}), live IMD weather, and AGMARKNET mandi feeds. How can I help you today?`;
  };

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "msg_init",
      sender: "ai",
      text: getGreeting(),
      timestamp: "Just now",
      suggestions: initialQuestions.slice(0, 3),
      citation: {
        source: "ICAR-IIHR & UAS Bangalore Agronomic Advisory Corpus",
        title: "Integrated Crop & Weather Management Framework",
        authority: "Indian Council of Agricultural Research",
      },
    },
  ]);

  const [inputText, setInputText] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [speakingId, setSpeakingId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = (textToSend?: string) => {
    const query = textToSend || inputText;
    if (!query.trim()) return;

    const userMsg: ChatMessage = {
      id: `usr_${Date.now()}`,
      sender: "user",
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText("");

    // Instant deterministic agronomic response (Zero LLM delay / Zero external fail points)
    setTimeout(() => {
      const copilotRes = generateCopilotResponse(query, activeFarm, language);
      const topCitation = copilotRes.citations && copilotRes.citations[0];

      const aiMsg: ChatMessage = {
        id: `ai_${Date.now()}`,
        sender: "ai",
        text: copilotRes.text,
        timestamp: copilotRes.timestamp,
        suggestions: copilotRes.suggestedFollowUps,
        citation: topCitation ? {
          source: topCitation.source,
          title: topCitation.title,
          authority: topCitation.authority,
        } : undefined,
      };

      setMessages((prev) => [...prev, aiMsg]);
    }, 250);
  };

  // Multilingual Voice Playback
  const handleSpeak = (id: string, text: string) => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    if (speakingId === id) {
      window.speechSynthesis.cancel();
      setSpeakingId(null);
      return;
    }
    window.speechSynthesis.cancel();
    const cleanText = text.replace(/[*#•❌✅💧🔍⛔📈🛡️🏆💡]/g, " ");
    const utterance = new SpeechSynthesisUtterance(cleanText);
    const langMap: Record<string, string> = {
      en: "en-IN",
      hi: "hi-IN",
      kn: "kn-IN",
      te: "te-IN",
      ta: "ta-IN",
      mr: "mr-IN",
    };
    utterance.lang = langMap[language] || "en-IN";
    utterance.rate = 0.95;
    utterance.onend = () => setSpeakingId(null);
    utterance.onerror = () => setSpeakingId(null);
    setSpeakingId(id);
    window.speechSynthesis.speak(utterance);
  };

  // Multilingual Speech Recognition
  const toggleVoiceInput = () => {
    if (typeof window === "undefined") return;
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      showToast("Voice Input", "Voice recognition is not supported on this browser.", "info");
      return;
    }

    if (isListening) {
      setIsListening(false);
      return;
    }

    const recognition = new SpeechRecognition();
    const langMap: Record<string, string> = {
      en: "en-IN",
      hi: "hi-IN",
      kn: "kn-IN",
      te: "te-IN",
      ta: "ta-IN",
      mr: "mr-IN",
    };
    recognition.lang = langMap[language] || "en-IN";
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => {
      setIsListening(true);
      showToast("Listening...", "Speak your farming question now.", "info");
    };

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setInputText(transcript);
      setIsListening(false);
      handleSend(transcript);
    };

    recognition.onerror = () => setIsListening(false);
    recognition.onend = () => setIsListening(false);
    recognition.start();
  };

  return (
    <div className="min-h-screen flex bg-transparent">
      <div className="hidden lg:block w-64 shrink-0">
        <div className="fixed top-16 bottom-0 w-64">
          <FarmerSidebar />
        </div>
      </div>

      <div className="flex-1 min-w-0 p-4 sm:p-6 max-w-6xl mx-auto flex flex-col h-[calc(100vh-4.5rem)]">
        
        {/* Main AI Chat Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-5 flex-1 min-h-0">
          
          {/* LEFT: Suggested Questions & Farm Context */}
          <div className="hidden md:flex md:col-span-4 flex-col bg-slate-900/85 backdrop-blur-xl rounded-2xl border border-cyan-500/25 p-4 shadow-2xl justify-between text-white">
            <div className="space-y-4">
              <div className="flex items-center gap-2.5 pb-3 border-b border-slate-800">
                <div className="w-8 h-8 rounded-xl bg-cyan-950/80 border border-cyan-500/40 text-cyan-300 flex items-center justify-center shadow-[0_0_10px_rgba(6,182,212,0.2)]">
                  <Bot className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-sm font-bold text-white">{t.farmtalk?.title || "FarmTalk AI"}</h2>
                  <p className="text-[10px] font-mono text-cyan-400">{activeFarm.name} ({activeFarm.areaAcres} Ac)</p>
                </div>
              </div>

              <div>
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-cyan-400 block mb-2">
                  {"// " + (t.farmtalk?.suggestedQueries || "Suggested Queries")}
                </span>
                <div className="space-y-1.5">
                  {initialQuestions.map((q, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSend(q)}
                      className="w-full text-left p-2.5 rounded-xl bg-slate-950/60 hover:bg-cyan-950/40 hover:border-cyan-500/40 text-xs text-slate-200 hover:text-white transition-all border border-slate-800 cursor-pointer"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Farm Telemetry Status */}
            <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800/80 text-[11px] font-mono text-slate-300 space-y-1.5">
              <div className="flex justify-between">
                <span className="text-slate-400">Crop:</span>
                <strong className="text-emerald-400">{activeFarm.currentCrop}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Stage:</span>
                <strong className="text-cyan-300">Day 33 Flowering</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Soil pH:</span>
                <strong className="text-amber-300">{soilReport.ph} (Optimal)</strong>
              </div>
              <div className="flex justify-between pt-1 border-t border-slate-800 text-[10px]">
                <span className="text-slate-400">Engine:</span>
                <span className="text-emerald-400 font-bold">Deterministic ICAR RAG</span>
              </div>
            </div>
          </div>

          {/* RIGHT: Chat Stream & Interactive Input */}
          <div className="md:col-span-8 flex flex-col bg-slate-900/85 backdrop-blur-xl rounded-2xl border border-cyan-500/25 shadow-2xl overflow-hidden text-white">
            
            {/* Chat Top Banner */}
            <div className="p-3.5 px-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-cyan-500 to-emerald-600 text-white flex items-center justify-center shadow-lg border border-cyan-400/30">
                  <Sparkles className="w-3.5 h-3.5" />
                </div>
                <div>
                  <h1 className="text-xs font-bold text-white flex items-center gap-1.5">
                    <span>{t.farmtalk?.title || "FarmTalk Sovereign AI"}</span>
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                    </span>
                  </h1>
                  <p className="text-[10px] font-mono text-cyan-400">{t.farmtalk?.instantIntelligence || "100% Instant Deterministic Response"}</p>
                </div>
              </div>

              <span className="text-[10px] font-mono px-2.5 py-1 rounded bg-cyan-950/60 text-cyan-300 font-semibold border border-cyan-500/30">
                ICAR • KAU • TNAU
              </span>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 p-4 overflow-y-auto space-y-4">
              {messages.map((msg) => {
                const isAi = msg.sender === "ai";
                return (
                  <div
                    key={msg.id}
                    className={`flex items-start gap-2.5 ${isAi ? "" : "flex-row-reverse"}`}
                  >
                    <div
                      className={`w-7 h-7 rounded-xl flex items-center justify-center shrink-0 text-xs font-bold ${
                        isAi
                          ? "bg-cyan-600 text-white shadow-md border border-cyan-400/40"
                          : "bg-emerald-600 text-white shadow-md border border-emerald-400/40"
                      }`}
                    >
                      {isAi ? <Bot className="w-3.5 h-3.5" /> : "You"}
                    </div>

                    <div className="max-w-[88%] space-y-2">
                      <div
                        className={`p-3.5 rounded-2xl text-xs leading-relaxed ${
                          isAi
                            ? "bg-slate-950/80 text-slate-100 border border-slate-800 whitespace-pre-line shadow-lg"
                            : "bg-emerald-700/80 text-white shadow-lg whitespace-pre-line border border-emerald-500/40"
                        }`}
                      >
                        {msg.text}
                      </div>

                      {/* Official Authority Citation */}
                      {isAi && msg.citation && (
                        <div className="p-2 rounded-lg bg-cyan-950/40 border border-cyan-500/20 text-[10px] font-mono text-cyan-300 flex items-start gap-1.5">
                          <BookOpen className="w-3 h-3 text-cyan-400 shrink-0 mt-0.5" />
                          <div>
                            <span className="font-bold text-cyan-200">{msg.citation.title}</span> — {msg.citation.source} ({msg.citation.authority})
                          </div>
                        </div>
                      )}

                      {/* Audio Playback Trigger */}
                      {isAi && (
                        <div className="flex items-center gap-2 pt-0.5">
                          <button
                            onClick={() => handleSpeak(msg.id, msg.text)}
                            className="inline-flex items-center gap-1 text-[10px] font-mono text-slate-400 hover:text-cyan-400 transition-colors cursor-pointer"
                          >
                            {speakingId === msg.id ? (
                              <>
                                <VolumeX className="w-3 h-3 text-cyan-400 animate-pulse" />
                                <span className="text-cyan-400">Stop Speech</span>
                              </>
                            ) : (
                              <>
                                <Volume2 className="w-3 h-3 text-slate-400" />
                                <span>Listen in {language.toUpperCase()}</span>
                              </>
                            )}
                          </button>
                        </div>
                      )}

                      {/* Follow-up Quick Action Chips */}
                      {msg.suggestions && msg.suggestions.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 pt-1">
                          {msg.suggestions.map((sug, i) => (
                            <button
                              key={i}
                              onClick={() => handleSend(sug)}
                              className="px-2.5 py-1 rounded-lg bg-slate-950/70 hover:bg-cyan-950/60 hover:border-cyan-500/40 text-[10px] text-slate-300 hover:text-cyan-200 font-medium transition-colors border border-slate-800 cursor-pointer"
                            >
                              {sug}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>

            {/* Message Input Form */}
            <div className="p-3 sm:p-3.5 border-t border-slate-800 bg-slate-950/80">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSend();
                }}
                className="flex items-center gap-2"
              >
                <button
                  type="button"
                  onClick={toggleVoiceInput}
                  className={`p-2.5 rounded-xl border transition-all cursor-pointer ${
                    isListening
                      ? "bg-rose-500 text-white border-rose-400 animate-pulse"
                      : "bg-slate-900 text-slate-300 border-slate-700 hover:bg-slate-800 hover:text-white"
                  }`}
                  title="Speak in your language"
                >
                  {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                </button>

                <input
                  type="text"
                  placeholder={t.farmtalk?.askPlaceholder || "Ask in your language..."}
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  className="flex-1 text-xs rounded-xl border border-slate-700 bg-slate-900/90 text-white placeholder-slate-500 px-3.5 py-2.5 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 font-sans"
                />

                <button
                  type="submit"
                  disabled={!inputText.trim()}
                  className="p-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-emerald-600 hover:from-cyan-500 hover:to-emerald-500 disabled:opacity-30 text-white shadow-lg transition-colors cursor-pointer border border-cyan-400/40"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
