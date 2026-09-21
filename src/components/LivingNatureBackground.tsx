"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Wind, Sun, Volume2, VolumeX, Sparkles, Sliders } from "lucide-react";

interface LivingNatureProps {
  className?: string;
  showControls?: boolean;
}

export function LivingNatureBackground({ className = "", showControls = false }: LivingNatureProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [windSpeed, setWindSpeed] = useState<number>(1.2);
  const [ambientAudio, setAmbientAudio] = useState<boolean>(false);
  const [showPanel, setShowPanel] = useState<boolean>(false);
  const audioContextRef = useRef<AudioContext | null>(null);
  const audioNodesRef = useRef<any[]>([]);

  // Toggle synthesized nature ambient breeze sound using Web Audio API (no external file required!)
  const toggleAmbientSound = () => {
    if (!ambientAudio) {
      try {
        const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
        if (!AudioCtx) return;
        const ctx = new AudioCtx();
        audioContextRef.current = ctx;

        // Create pink noise buffer for soft rustling wind sound
        const bufferSize = ctx.sampleRate * 2;
        const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const output = noiseBuffer.getChannelData(0);
        let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
        for (let i = 0; i < bufferSize; i++) {
          const white = Math.random() * 2 - 1;
          b0 = 0.99886 * b0 + white * 0.0555179;
          b1 = 0.99332 * b1 + white * 0.0750759;
          b2 = 0.96900 * b2 + white * 0.1538520;
          b3 = 0.86650 * b3 + white * 0.3104856;
          b4 = 0.55000 * b4 + white * 0.5329522;
          b5 = -0.7616 * b5 - white * 0.0168980;
          output[i] = b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362;
          output[i] *= 0.04; // Gentle volume
          b6 = white * 0.115926;
        }

        const whiteNoise = ctx.createBufferSource();
        whiteNoise.buffer = noiseBuffer;
        whiteNoise.loop = true;

        // Low-pass filter for soft wind sound
        const filter = ctx.createBiquadFilter();
        filter.type = "lowpass";
        filter.frequency.value = 400;

        const gainNode = ctx.createGain();
        gainNode.gain.setValueAtTime(0.08, ctx.currentTime);

        whiteNoise.connect(filter);
        filter.connect(gainNode);
        gainNode.connect(ctx.destination);

        whiteNoise.start();
        audioNodesRef.current = [whiteNoise, filter, gainNode];
        setAmbientAudio(true);
      } catch (err) {
        console.warn("Audio Context init notice:", err);
      }
    } else {
      if (audioContextRef.current) {
        audioContextRef.current.close().catch(() => {});
        audioContextRef.current = null;
      }
      setAmbientAudio(false);
    }
  };

  useEffect(() => {
    return () => {
      if (audioContextRef.current) {
        audioContextRef.current.close().catch(() => {});
      }
    };
  }, []);

  // Canvas Grass Waving & Spores Physics Engine
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || window.innerWidth);
    let height = (canvas.height = canvas.parentElement?.clientHeight || window.innerHeight);

    const handleResize = () => {
      if (!canvas || !canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = canvas.parentElement.clientHeight;
      initBlades();
    };

    window.addEventListener("resize", handleResize);

    // Grass Blade Structure
    interface Blade {
      x: number;
      baseHeight: number;
      width: number;
      lean: number;
      curve: number;
      phase: number;
      frequency: number;
      color: string;
      highlight: string;
      layer: number; // 0=back, 1=mid, 2=front
    }

    // Particle Dandelion Spore Structure
    interface Spore {
      x: number;
      y: number;
      radius: number;
      vx: number;
      vy: number;
      alpha: number;
      driftPhase: number;
    }

    const blades: Blade[] = [];
    const spores: Spore[] = [];
    const bladePalette = [
      { color: "rgba(34, 139, 34, 0.85)", highlight: "rgba(124, 252, 0, 0.9)" },     // Forest / Lime
      { color: "rgba(46, 160, 67, 0.9)",  highlight: "rgba(163, 230, 53, 0.95)" },    // Emerald / Spring
      { color: "rgba(22, 101, 52, 0.92)", highlight: "rgba(132, 204, 22, 0.9)" },     // Deep Green
      { color: "rgba(65, 117, 5, 0.88)",  highlight: "rgba(190, 242, 100, 0.95)" },   // Golden Sunlit Green
      { color: "rgba(20, 83, 45, 0.95)",  highlight: "rgba(74, 222, 128, 0.85)" },    // Lush Base
    ];

    const initBlades = () => {
      blades.length = 0;
      const bladeCount = Math.floor(width / 3.5); // Dense grass coverage
      for (let i = 0; i < bladeCount; i++) {
        const pal = bladePalette[Math.floor(Math.random() * bladePalette.length)];
        const layer = Math.random() < 0.35 ? 0 : Math.random() < 0.7 ? 1 : 2;
        const layerHeightFactor = layer === 0 ? 0.65 : layer === 1 ? 0.85 : 1.0;

        blades.push({
          x: (i * width) / bladeCount + (Math.random() * 6 - 3),
          baseHeight: (height * 0.32 + Math.random() * (height * 0.18)) * layerHeightFactor,
          width: (2.5 + Math.random() * 3.5) * layerHeightFactor,
          lean: (Math.random() - 0.5) * 20,
          curve: (Math.random() - 0.5) * 15,
          phase: Math.random() * Math.PI * 2,
          frequency: 0.8 + Math.random() * 0.7,
          color: pal.color,
          highlight: pal.highlight,
          layer,
        });
      }

      // Initialize golden sun spores / pollen
      spores.length = 0;
      for (let s = 0; s < 45; s++) {
        spores.push({
          x: Math.random() * width,
          y: Math.random() * height,
          radius: 1.0 + Math.random() * 2.2,
          vx: 0.4 + Math.random() * 0.8,
          vy: -0.2 - Math.random() * 0.5,
          alpha: 0.2 + Math.random() * 0.6,
          driftPhase: Math.random() * Math.PI * 2,
        });
      }
    };

    initBlades();

    // Mouse Wind Ripple Interaction
    let mouseX = -1000;
    let mouseY = -1000;
    let mouseVx = 0;
    let lastMouseX = 0;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const currentX = e.clientX - rect.left;
      mouseX = currentX;
      mouseY = e.clientY - rect.top;
      mouseVx = (currentX - lastMouseX) * 0.3;
      lastMouseX = currentX;
    };

    const handleMouseLeave = () => {
      mouseX = -1000;
      mouseY = -1000;
    };

    canvas.addEventListener("mousemove", handleMouseMove);
    canvas.addEventListener("mouseleave", handleMouseLeave);

    let time = 0;

    const render = () => {
      time += 0.022 * windSpeed;
      ctx.clearRect(0, 0, width, height);

      // 1. Render Golden Sunlight Motes & Floating Dandelion Spores
      for (let s = 0; s < spores.length; s++) {
        const spore = spores[s];
        spore.x += spore.vx * windSpeed + Math.sin(time + spore.driftPhase) * 0.5;
        spore.y += spore.vy + Math.cos(time * 0.8 + spore.driftPhase) * 0.3;

        // Wrap around screen
        if (spore.x > width + 20) spore.x = -20;
        if (spore.y < -20) spore.y = height + 20;

        ctx.beginPath();
        ctx.arc(spore.x, spore.y, spore.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(254, 240, 138, ${spore.alpha * 0.75})`;
        ctx.shadowColor = "rgba(250, 204, 21, 0.8)";
        ctx.shadowBlur = 8;
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      // 2. Render Layered Grass Blades (Back to Front)
      const layers = [0, 1, 2];
      for (const currentLayer of layers) {
        for (let i = 0; i < blades.length; i++) {
          const b = blades[i];
          if (b.layer !== currentLayer) continue;

          // Natural wind wave calculation (compound sine waves for organic turbulence)
          const globalWind =
            Math.sin(time * b.frequency + b.x * 0.008) * 22 * windSpeed +
            Math.cos(time * 0.5 + b.x * 0.003) * 12 * windSpeed;

          // Mouse proximity breeze displacement
          let mouseDisplacement = 0;
          const distToMouse = Math.abs(b.x - mouseX);
          if (distToMouse < 180 && mouseY > height * 0.4) {
            const influence = 1 - distToMouse / 180;
            mouseDisplacement = (b.x > mouseX ? 1 : -1) * influence * 35 + mouseVx * influence * 15;
          }

          const tipSway = globalWind + mouseDisplacement + b.lean;
          const tipX = b.x + tipSway;
          const tipY = height - b.baseHeight;
          const controlX = b.x + tipSway * 0.45 + b.curve;
          const controlY = height - b.baseHeight * 0.45;

          // Draw realistic tapered grass blade
          ctx.beginPath();
          ctx.moveTo(b.x - b.width / 2, height);
          ctx.quadraticCurveTo(controlX - b.width / 4, controlY, tipX, tipY);
          ctx.quadraticCurveTo(controlX + b.width / 4, controlY, b.x + b.width / 2, height);
          ctx.closePath();

          // Smooth gradient along blade (dark root -> vibrant sunlit tip)
          const grad = ctx.createLinearGradient(b.x, height, tipX, tipY);
          grad.addColorStop(0, b.color);
          grad.addColorStop(0.65, b.highlight);
          grad.addColorStop(1, "rgba(234, 255, 150, 0.95)");

          ctx.fillStyle = grad;
          ctx.fill();
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", handleResize);
      canvas.removeEventListener("mousemove", handleMouseMove);
      canvas.removeEventListener("mouseleave", handleMouseLeave);
      cancelAnimationFrame(animationFrameId);
    };
  }, [windSpeed]);

  return (
    <div className={`absolute inset-0 w-full h-full overflow-hidden select-none ${className}`}>
      {/* 1. Photorealistic Nature Background Image */}
      <div className="absolute inset-0 w-full h-full">
        <Image
          src="/nature-farm-bg.jpg"
          alt="Lush Green Nature Farmland Background"
          fill
          priority
          unoptimized
          className="object-cover object-center transform scale-105 animate-nature-subtle-pan"
        />
      </div>

      {/* 2. Realistic Glowing Sun Flare & Sun Rays */}
      <div className="absolute top-[6%] right-[15%] sm:right-[20%] w-64 h-64 sm:w-96 sm:h-96 pointer-events-none z-1">
        {/* Core Sun Glow */}
        <div className="absolute inset-0 rounded-full bg-yellow-200/60 blur-3xl animate-pulse" />
        <div className="absolute inset-10 rounded-full bg-white/80 blur-2xl" />
        {/* Radiating Optical Flare Ring */}
        <div className="absolute -inset-10 rounded-full border border-yellow-200/40 blur-xs scale-110 animate-spin-slow" />
        <div className="absolute top-1/2 -left-28 w-[450px] h-1.5 bg-gradient-to-r from-transparent via-yellow-100/50 to-transparent transform -rotate-25 blur-xs" />
      </div>

      {/* 3. Flying Birds Animation Across the Middle Horizon */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-10">
        
        {/* Bird 1: Leading Soaring Hawk / Swallow */}
        <div className="absolute top-[30%] sm:top-[26%] animate-bird-flight-1">
          <svg
            className="w-10 h-8 sm:w-12 sm:h-10 text-neutral-900 drop-shadow-[0_2px_6px_rgba(0,0,0,0.6)]"
            viewBox="0 0 100 60"
            fill="currentColor"
          >
            {/* Animated Wing Flap */}
            <path
              className="origin-center animate-bird-wing-flap"
              d="M 50 40 Q 25 12 0 18 Q 28 35 50 42 Q 72 35 100 18 Q 75 12 50 40 Z"
            />
          </svg>
        </div>

        {/* Bird 2: Graceful Companion Bird Flying Slightly Higher */}
        <div className="absolute top-[20%] sm:top-[18%] animate-bird-flight-2">
          <svg
            className="w-8 h-6 sm:w-9 sm:h-7 text-neutral-900 drop-shadow-[0_2px_5px_rgba(0,0,0,0.5)] opacity-90"
            viewBox="0 0 100 60"
            fill="currentColor"
          >
            <path
              className="origin-center animate-bird-wing-flap-fast"
              d="M 50 38 Q 28 8 0 14 Q 26 32 50 40 Q 74 32 100 14 Q 72 8 50 38 Z"
            />
          </svg>
        </div>

        {/* Bird 3: Distant Horizon Bird */}
        <div className="absolute top-[36%] animate-bird-flight-3">
          <svg
            className="w-6 h-4 text-neutral-800 opacity-75 drop-shadow-sm"
            viewBox="0 0 100 60"
            fill="currentColor"
          >
            <path
              className="origin-center animate-bird-wing-flap"
              d="M 50 40 Q 25 16 0 20 Q 28 35 50 42 Q 72 35 100 20 Q 75 16 50 40 Z"
            />
          </svg>
        </div>
      </div>

      {/* 4. Canvas for Fluid Grass Waving & Sunlight Spore Particles */}
      <canvas
        ref={canvasRef}
        className="absolute bottom-0 inset-x-0 w-full h-[55%] pointer-events-auto cursor-crosshair z-15"
      />

      {/* 5. Soft Atmospheric Depth Vignette */}
      <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/20 via-transparent to-black/10 pointer-events-none z-15" />

      {/* 6. Optional Floating Interactive Nature Controls */}
      {showControls && (
        <div className="absolute bottom-4 right-4 z-30 flex items-center gap-2">
          <button
            onClick={() => setShowPanel(!showPanel)}
            className="p-2.5 rounded-full bg-black/70 backdrop-blur-xl border border-white/20 text-white hover:bg-black/90 shadow-lg transition-all"
            title="Living Nature Controls"
          >
            <Sliders className="w-4 h-4 text-emerald-400" />
          </button>

          <button
            onClick={toggleAmbientSound}
            className={`p-2.5 rounded-full backdrop-blur-xl border transition-all shadow-lg ${
              ambientAudio
                ? "bg-emerald-600 text-white border-emerald-400 animate-pulse"
                : "bg-black/70 border-white/20 text-white hover:bg-black/90"
            }`}
            title={ambientAudio ? "Mute Farm Breeze Sound" : "Listen to Gentle Farm Breeze Sound"}
          >
            {ambientAudio ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>

          {showPanel && (
            <div className="p-4 rounded-2xl bg-black/85 backdrop-blur-xl border border-white/20 shadow-2xl space-y-3 text-xs w-64 animate-fade-in text-white">
              <div className="flex items-center justify-between font-bold text-white">
                <span className="flex items-center gap-1.5">
                  <Wind className="w-3.5 h-3.5 text-emerald-400" /> Wind Velocity
                </span>
                <span className="text-emerald-300 font-mono">{windSpeed.toFixed(1)}x</span>
              </div>
              <input
                type="range"
                min="0.3"
                max="2.5"
                step="0.1"
                value={windSpeed}
                onChange={(e) => setWindSpeed(parseFloat(e.target.value))}
                className="w-full accent-emerald-500 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-white/60 font-medium">
                <span>Gentle Breeze</span>
                <span>Active Wind</span>
                <span>Gale Ripple</span>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
