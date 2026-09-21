"use client";

import React, { useState } from "react";
import {
  MessageSquare,
  Send,
  CheckCheck,
  Smartphone,
  Sparkles,
  Bot,
  Paperclip,
  Mic,
  Camera,
  Volume2,
} from "lucide-react";
import { useApp } from "@/lib/store";

export const WhatsAppBotSimulator: React.FC = () => {
  const { showToast } = useApp();
  const [chatHistory, setChatHistory] = useState<Array<{ sender: "bot" | "user"; text: string; time: string; image?: string }>>([
    {
      sender: "bot",
      text: `🌾 *KrishiMitra WhatsApp AI Assistant*

Namaste Ramesh ji! Reply with a number or send a leaf photo:

1️⃣ Today's Farm Plan & Rain Advisory
2️⃣ Should I irrigate today?
3️⃣ Best APMC Mandi Price (Tomato)
4️⃣ Check Govt Schemes & Subsidies
5️⃣ Ask Any Agri Question

📸 *Tip:* Attach a photo of diseased leaf for instant pathology diagnosis!`,
      time: "08:30 AM",
    },
  ]);
  const [userInput, setUserInput] = useState<string>("");
  const [isTyping, setIsTyping] = useState<boolean>(false);

  const handleSend = (textToSend?: string, attachedImg?: string) => {
    const text = textToSend !== undefined ? textToSend : userInput;
    if (!text.trim() && !attachedImg) return;

    const time = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    const userMsg = { sender: "user" as const, text, time, image: attachedImg };
    setChatHistory((prev) => [...prev, userMsg]);
    setUserInput("");
    setIsTyping(true);

    setTimeout(() => {
      let botReply = "";
      const t = text.trim();

      if (attachedImg) {
        botReply = `🔬 *AI Leaf Disease Diagnosis Complete:*

🌿 *Crop:* Tomato (Solanum lycopersicum)
⚠️ *Pathogen:* Early Blight (*Alternaria solani*)
📊 *Confidence:* 94.2%

📋 *Immediate Treatment Plan:*
1. Remove infected lower leaves (bottom 20cm).
2. Spray *Mancozeb 75% WP* @ 2.5 g/L water during morning dry hours.
3. Skip afternoon irrigation due to 4:30 PM thunderstorm forecast.

Reply *EXPERT* to escalate this image to KVK Pathologist Dr. K. N. Rao.`;
      } else if (t === "1") {
        botReply = `📋 *Today's Farm Plan (Sri Lakshmi Farm):*

1. ❌ *Skip Irrigation:* 18.5mm rain predicted at 4:30 PM today (84% chance).
2. 🔍 *Scout Zone B:* Check lower leaves for Early Blight.
3. ⛔ *Hold Sprays:* High wind gusts (22 km/h).
4. 📈 *Mandi:* Bengaluru is paying ₹2,780/qtl (+₹240 net profit after transport).

Reply *2* for water details or *0* for main menu.`;
      } else if (t === "2") {
        botReply = `💧 *Smart Irrigation Advisory (Tomato):*

❌ *DO NOT IRRIGATE TODAY.*

• Rain forecast: 18.5mm (84% probability)
• Soil moisture: 68% (Optimal field capacity)
• Water saved: 4,200 Litres

Next sensor check: Tomorrow at 8:00 AM.`;
      } else if (t === "3") {
        botReply = `📈 *Tomato APMC Rates Today:*

🏆 *Bengaluru Yeshwantpur:* ₹2,780/qtl
(Net take-home after ₹130 transport: *₹2,650/qtl*)

• *Kolar Mandi:* ₹2,450/qtl (Net ₹2,410)
• *Chintamani:* ₹2,320/qtl

👉 Take harvest to Bengaluru for +₹240/qtl higher net profit!`;
      } else if (t === "4") {
        botReply = `🏛️ *Matched Government Schemes:*

1. *PM-KISAN:* ₹6,000/yr (Active)
2. *PMKSY 55% Drip Grant:* Eligible for Plot 2 expansion.
3. *PM-KUSUM 60% Solar Pump:* Eligible.

Reply *APPLY* for instant direct benefit transfer link.`;
      } else {
        botReply = `🌾 *KrishiMitra AI Agronomist:*
Understood. For your 2.5 Acre tomato crop in Kolar, afternoon rain will provide sufficient moisture. Monitor for high relative humidity fungal pathogens.

Reply *0* for Main Menu or attach a leaf photo anytime.`;
      }

      setIsTyping(false);
      setChatHistory((prev) => [...prev, { sender: "bot", text: botReply, time }]);
    }, 900);
  };

  const handleSimulatePhotoUpload = () => {
    const sampleLeafUrl = "https://images.unsplash.com/photo-1592417817098-8f3d6910985b?w=400&auto=format&fit=crop&q=80";
    handleSend("Attached: leaf_sample_zoneB.jpg", sampleLeafUrl);
    showToast("Photo Sent to WhatsApp Bot", "Image uploaded. Running computer vision pathology inference...", "info");
  };

  const handlePlayVoice = (text: string) => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const clean = text.replace(/[*_#]/g, "");
      const utterance = new SpeechSynthesisUtterance(clean);
      utterance.rate = 1.0;
      window.speechSynthesis.speak(utterance);
      showToast("Audio Voice Playback", "Playing audio message via speech synthesizer", "info");
    }
  };

  return (
    <div className="w-full bg-black/45 backdrop-blur-xl rounded-3xl border border-white/20 p-5 sm:p-6 shadow-2xl text-white">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/15">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="font-display font-bold text-xl text-white tracking-tight drop-shadow-md">
              WhatsApp & SMS Zero-App Rural Bot
            </h2>
            <span className="text-xs px-2.5 py-0.5 rounded-lg font-semibold bg-brand-500/25 text-lime-200 border border-brand-400/30">
              Low-Bandwidth Rural Access • Section 61
            </span>
          </div>
          <p className="text-xs text-neutral-300 mt-1">
            Simulating 2-way WhatsApp Business API & SMS channel for farmers with basic smartphones or 2G connections.
          </p>
        </div>
      </div>

      {/* Smartphone Mockup */}
      <div className="mt-6 max-w-sm mx-auto rounded-[36px] p-3 bg-black/80 shadow-2xl border-4 border-white/20 backdrop-blur-md">
        <div className="rounded-[28px] overflow-hidden bg-[#121b22] flex flex-col h-[520px] border border-white/10">
          
          {/* WhatsApp Header */}
          <div className="bg-[#1f2c34] text-white p-3 flex items-center justify-between shadow border-b border-white/10">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center font-bold text-xs">
                🌾
              </div>
              <div>
                <h4 className="font-bold text-xs leading-tight">KrishiMitra AI Bot ✓</h4>
                <span className="text-[10px] text-lime-400 block font-semibold">Official Agri Advisory Desk</span>
              </div>
            </div>

            <button
              onClick={handleSimulatePhotoUpload}
              title="Simulate Photo Upload"
              className="p-1.5 rounded-full bg-white/20 hover:bg-white/30 text-white transition-colors"
            >
              <Camera className="w-4 h-4" />
            </button>
          </div>

          {/* Chat Bubble Area */}
          <div className="flex-1 overflow-y-auto p-3 space-y-2.5 text-xs font-sans">
            {chatHistory.map((m, idx) => (
              <div
                key={idx}
                className={`flex ${m.sender === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[85%] rounded-lg p-2.5 shadow-sm text-xs ${
                    m.sender === "user"
                      ? "bg-[#005c4b] text-white rounded-tr-none border border-emerald-500/30"
                      : "bg-[#202c33] text-neutral-100 rounded-tl-none border border-white/10"
                  }`}
                >
                  {m.image && (
                    <div className="mb-2 rounded-lg overflow-hidden max-h-36 bg-black">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={m.image} alt="Leaf upload" className="w-full h-full object-cover" />
                    </div>
                  )}
                  <p className="whitespace-pre-line leading-relaxed">{m.text}</p>
                  <div className="flex items-center justify-between gap-1 mt-1.5 pt-1 border-t border-white/10 text-[9px] text-neutral-400">
                    <button
                      onClick={() => handlePlayVoice(m.text)}
                      className="hover:text-lime-300 flex items-center gap-1 font-semibold text-neutral-300"
                    >
                      <Volume2 className="w-3 h-3 text-lime-400" /> Listen
                    </button>
                    <div className="flex items-center gap-1">
                      <span>{m.time}</span>
                      {m.sender === "user" && <CheckCheck className="w-3 h-3 text-sky-400" />}
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-[#202c33] border border-white/10 rounded-lg p-2 text-[11px] text-neutral-300 rounded-tl-none flex items-center gap-1.5 animate-pulse">
                  <span>KrishiMitra AI is typing...</span>
                </div>
              </div>
            )}
          </div>

          {/* Quick Menu Click Buttons */}
          <div className="p-2 bg-[#1f2c34] border-t border-white/10 flex gap-1.5 overflow-x-auto">
            <button
              onClick={() => handleSend("1")}
              className="text-[10px] px-2 py-1 rounded bg-white/15 text-white font-bold shrink-0 shadow-sm hover:bg-brand-600 border border-white/10"
            >
              1️⃣ Plan
            </button>
            <button
              onClick={() => handleSend("2")}
              className="text-[10px] px-2 py-1 rounded bg-white/15 text-white font-bold shrink-0 shadow-sm hover:bg-brand-600 border border-white/10"
            >
              2️⃣ Water
            </button>
            <button
              onClick={() => handleSend("3")}
              className="text-[10px] px-2 py-1 rounded bg-white/15 text-white font-bold shrink-0 shadow-sm hover:bg-brand-600 border border-white/10"
            >
              3️⃣ Mandi
            </button>
            <button
              onClick={() => handleSend("4")}
              className="text-[10px] px-2 py-1 rounded bg-white/15 text-white font-bold shrink-0 shadow-sm hover:bg-brand-600 border border-white/10"
            >
              4️⃣ Schemes
            </button>
            <button
              onClick={handleSimulatePhotoUpload}
              className="text-[10px] px-2 py-1 rounded bg-amber-500/30 text-amber-200 border border-amber-400/40 font-bold shrink-0 shadow-sm"
            >
              📸 Send Leaf Photo
            </button>
          </div>

          {/* Input Box */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="p-2 bg-[#1f2c34] flex items-center gap-1.5 border-t border-white/10"
          >
            <button
              type="button"
              onClick={handleSimulatePhotoUpload}
              title="Attach leaf photo"
              className="p-2 rounded-full hover:bg-white/10 text-neutral-300"
            >
              <Paperclip className="w-4 h-4" />
            </button>

            <input
              type="text"
              placeholder="Type number (1-5) or ask question..."
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              className="flex-1 text-xs rounded-full bg-black/60 text-white placeholder-neutral-400 px-3 py-2 focus:outline-none border border-white/15"
            />
            <button
              type="submit"
              className="w-8 h-8 rounded-full bg-brand-600 text-white flex items-center justify-center shrink-0 cursor-pointer shadow border border-brand-400/40"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>

        </div>
      </div>

    </div>
  );
};
