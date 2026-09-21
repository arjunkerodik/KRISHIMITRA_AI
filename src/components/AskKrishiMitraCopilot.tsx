"use client";

import React, { useState, useRef, useEffect } from "react";
import { useApp } from "@/lib/store";
import { generateCopilotResponse, AIChatMessage } from "@/lib/ai-engine";
import {
  Bot,
  Send,
  Sparkles,
  User,
  Mic,
  MicOff,
  Volume2,
  ShieldCheck,
  RefreshCw,
  CheckCircle2,
  X
} from "lucide-react";

export const AskKrishiMitraCopilot: React.FC = () => {
  const { activeFarm, language, showToast } = useApp();
  const [messages, setMessages] = useState<AIChatMessage[]>([
    {
      id: "welcome",
      sender: "assistant",
      text: `**Hello! I am your AgriCare AI Copilot.** 🌾\n\nI am synced with **${activeFarm.name}** (${activeFarm.currentCrop}, ${activeFarm.village}, Kolar).\n\nHow can I assist your field operations today? Ask about irrigation timing, disease diagnosis, APMC prices, or subsidy matching.`,
      timestamp: "Just now",
      suggestedFollowUps: [
        "Should I irrigate today?",
        "Why are my tomato leaves yellow?",
        "Where should I sell my tomatoes today?",
        "What government schemes am I eligible for?",
      ],
    },
  ]);
  const [inputQuery, setInputQuery] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isListening, setIsListening] = useState<boolean>(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = (textToSend?: string) => {
    const text = textToSend || inputQuery;
    if (!text.trim()) return;

    const userMsg: AIChatMessage = {
      id: `user_${Date.now()}`,
      sender: "user",
      text: text,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputQuery("");
    setIsLoading(true);

    setTimeout(() => {
      const assistantMsg = generateCopilotResponse(text, activeFarm);
      setMessages((prev) => [...prev, assistantMsg]);
      setIsLoading(false);
    }, 700);
  };

  const handleVoiceToggle = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      showToast("Voice Input", "Voice recognition not supported on this browser.", "info");
      return;
    }

    if (isListening) {
      setIsListening(false);
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = language === "hi" ? "hi-IN" : language === "kn" ? "kn-IN" : "en-IN";
    recognition.interimResults = false;

    recognition.onstart = () => {
      setIsListening(true);
      showToast("Listening...", "Speak your farming question now.", "info");
    };

    recognition.onresult = (event: any) => {
      const speechResult = event.results[0][0].transcript;
      setInputQuery(speechResult);
      setIsListening(false);
      handleSendMessage(speechResult);
    };

    recognition.onerror = () => setIsListening(false);
    recognition.onend = () => setIsListening(false);
    recognition.start();
  };

  return (
    <div className="bg-black/50 backdrop-blur-xl rounded-3xl border border-white/20 shadow-2xl flex flex-col h-[520px] overflow-hidden text-white">
      
      {/* Header */}
      <div className="p-4 border-b border-white/10 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-purple-600 text-white flex items-center justify-center shadow-md border border-purple-400/30">
            <Bot className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white">AgriCare Copilot</h3>
            <p className="text-[11px] text-white/60">Context: {activeFarm.name}</p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 p-4 overflow-y-auto space-y-3 text-xs">
        {messages.map((msg) => {
          const isAssistant = msg.sender === "assistant";
          return (
            <div
              key={msg.id}
              className={`flex items-start gap-2.5 ${isAssistant ? "" : "flex-row-reverse"}`}
            >
              <div
                className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 text-[10px] font-bold ${
                  isAssistant ? "bg-purple-600 text-white shadow-sm" : "bg-emerald-600 text-white shadow-sm"
                }`}
              >
                {isAssistant ? <Bot className="w-3.5 h-3.5" /> : "You"}
              </div>

              <div className="max-w-[85%] space-y-2">
                <div
                  className={`p-3.5 rounded-2xl leading-relaxed whitespace-pre-line ${
                    isAssistant
                      ? "bg-black/60 text-white/90 border border-white/15 shadow-md"
                      : "bg-emerald-600 text-white shadow-md border border-emerald-400/30"
                  }`}
                >
                  {msg.text}
                </div>

                {isAssistant && msg.suggestedFollowUps && msg.suggestedFollowUps.length > 0 && (
                  <div className="flex flex-wrap gap-1 pt-1">
                    {msg.suggestedFollowUps.map((sug, i) => (
                      <button
                        key={i}
                        onClick={() => handleSendMessage(sug)}
                        className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-[10px] text-white/80 hover:text-white font-medium border border-white/10 transition-colors cursor-pointer"
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

        {isLoading && (
          <div className="flex items-center gap-2 text-white/50 text-xs pl-8">
            <RefreshCw className="w-3.5 h-3.5 animate-spin text-purple-400" />
            <span>Formulating agronomic advisory...</span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Form */}
      <div className="p-3 border-t border-white/10 bg-black/40">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="flex items-center gap-2"
        >
          <button
            type="button"
            onClick={handleVoiceToggle}
            className={`p-2 rounded-xl border cursor-pointer transition-all ${
              isListening ? "bg-rose-500 text-white border-rose-400 animate-pulse" : "bg-white/10 text-white/80 border-white/15 hover:bg-white/20 hover:text-white"
            }`}
          >
            {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
          </button>

          <input
            type="text"
            placeholder="Ask anything..."
            value={inputQuery}
            onChange={(e) => setInputQuery(e.target.value)}
            className="flex-1 text-xs rounded-xl border border-white/20 bg-black/60 text-white placeholder-white/40 px-3 py-2 focus:outline-none focus:border-emerald-500"
          />

          <button
            type="submit"
            disabled={!inputQuery.trim()}
            className="p-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 text-white cursor-pointer border border-emerald-400/40 shadow-md"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>

    </div>
  );
};
