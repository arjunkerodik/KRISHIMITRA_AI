"use client";

import React, { useEffect, useRef } from "react";
import Image from "next/image";

export function GlobalNatureCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
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
      layer: number;
    }

    // Particle Dandelion & Bio-Luminescent Spore Structure
    interface Spore {
      x: number;
      y: number;
      radius: number;
      vx: number;
      vy: number;
      alpha: number;
      driftPhase: number;
      colorType: "gold" | "cyan" | "emerald";
    }

    const blades: Blade[] = [];
    const spores: Spore[] = [];
    const bladePalette = [
      { color: "rgba(16, 185, 129, 0.88)", highlight: "rgba(52, 211, 153, 0.95)" },  // Emerald
      { color: "rgba(5, 150, 105, 0.92)",  highlight: "rgba(110, 231, 183, 0.9)" },   // Lush Deep Green
      { color: "rgba(6, 182, 212, 0.82)",  highlight: "rgba(103, 232, 249, 0.95)" },  // Cyan Glow Green
      { color: "rgba(4, 120, 87, 0.95)",   highlight: "rgba(167, 243, 208, 0.9)" },   // Forest Base
      { color: "rgba(13, 148, 136, 0.85)", highlight: "rgba(94, 234, 212, 0.95)" },  // Teal Glow
    ];

    const initBlades = () => {
      blades.length = 0;
      const bladeCount = Math.floor(width / 3.4);
      for (let i = 0; i < bladeCount; i++) {
        const pal = bladePalette[Math.floor(Math.random() * bladePalette.length)];
        const layer = Math.random() < 0.35 ? 0 : Math.random() < 0.7 ? 1 : 2;
        const layerHeightFactor = layer === 0 ? 0.65 : layer === 1 ? 0.85 : 1.0;

        blades.push({
          x: (i * width) / bladeCount + (Math.random() * 6 - 3),
          baseHeight: (height * 0.24 + Math.random() * (height * 0.15)) * layerHeightFactor,
          width: (2.4 + Math.random() * 3.4) * layerHeightFactor,
          lean: (Math.random() - 0.5) * 18,
          curve: (Math.random() - 0.5) * 14,
          phase: Math.random() * Math.PI * 2,
          frequency: 0.8 + Math.random() * 0.7,
          color: pal.color,
          highlight: pal.highlight,
          layer,
        });
      }

      // Initialize golden sun spores + cyan bio-luminescent particles
      spores.length = 0;
      for (let s = 0; s < 75; s++) {
        const randType = Math.random();
        const colorType: Spore["colorType"] = randType < 0.5 ? "gold" : randType < 0.8 ? "cyan" : "emerald";
        spores.push({
          x: Math.random() * width,
          y: Math.random() * height,
          radius: 1.2 + Math.random() * 2.4,
          vx: 0.35 + Math.random() * 0.75,
          vy: -0.2 - Math.random() * 0.5,
          alpha: 0.3 + Math.random() * 0.65,
          driftPhase: Math.random() * Math.PI * 2,
          colorType,
        });
      }
    };

    initBlades();

    // Mouse interaction for natural wind sway
    let mouseX = -1000;
    let mouseY = -1000;
    let mouseVx = 0;
    let lastMouseX = 0;

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      mouseVx = (e.clientX - lastMouseX) * 0.3;
      lastMouseX = e.clientX;
    };

    const handleMouseLeave = () => {
      mouseX = -1000;
      mouseY = -1000;
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    window.addEventListener("mouseleave", handleMouseLeave, { passive: true });

    let time = 0;

    const render = () => {
      time += 0.02;
      ctx.clearRect(0, 0, width, height);

      // 1. Render Floating Sunlight Spores & Bio Particles
      for (let s = 0; s < spores.length; s++) {
        const spore = spores[s];
        spore.x += spore.vx + Math.sin(time + spore.driftPhase) * 0.5;
        spore.y += spore.vy + Math.cos(time * 0.75 + spore.driftPhase) * 0.3;

        if (spore.x > width + 20) spore.x = -20;
        if (spore.y < -20) spore.y = height + 20;

        ctx.beginPath();
        ctx.arc(spore.x, spore.y, spore.radius, 0, Math.PI * 2);

        if (spore.colorType === "gold") {
          ctx.fillStyle = `rgba(254, 240, 138, ${spore.alpha * 0.85})`;
          ctx.shadowColor = "rgba(250, 204, 21, 0.9)";
        } else if (spore.colorType === "cyan") {
          ctx.fillStyle = `rgba(165, 243, 252, ${spore.alpha * 0.85})`;
          ctx.shadowColor = "rgba(6, 182, 212, 0.9)";
        } else {
          ctx.fillStyle = `rgba(167, 243, 208, ${spore.alpha * 0.85})`;
          ctx.shadowColor = "rgba(16, 185, 129, 0.9)";
        }

        ctx.shadowBlur = 10;
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      // 2. Render Layered Grass Blades (Back to Front)
      const layers = [0, 1, 2];
      for (const currentLayer of layers) {
        for (let i = 0; i < blades.length; i++) {
          const b = blades[i];
          if (b.layer !== currentLayer) continue;

          const globalWind =
            Math.sin(time * b.frequency + b.x * 0.007) * 20 +
            Math.cos(time * 0.45 + b.x * 0.003) * 12;

          let mouseDisplacement = 0;
          const distToMouse = Math.abs(b.x - mouseX);
          if (distToMouse < 200 && mouseY > height * 0.45) {
            const influence = 1 - distToMouse / 200;
            mouseDisplacement = (b.x > mouseX ? 1 : -1) * influence * 35 + mouseVx * influence * 15;
          }

          const tipSway = globalWind + mouseDisplacement + b.lean;
          const tipX = b.x + tipSway;
          const tipY = height - b.baseHeight;
          const controlX = b.x + tipSway * 0.45 + b.curve;
          const controlY = height - b.baseHeight * 0.45;

          ctx.beginPath();
          ctx.moveTo(b.x - b.width / 2, height);
          ctx.quadraticCurveTo(controlX - b.width / 4, controlY, tipX, tipY);
          ctx.quadraticCurveTo(controlX + b.width / 4, controlY, b.x + b.width / 2, height);
          ctx.closePath();

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
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseleave", handleMouseLeave);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="fixed inset-0 w-full h-full pointer-events-none -z-20 overflow-hidden select-none bg-slate-950" aria-hidden="true">
      {/* 1. Cyber Polar Command Center Dual Radial Dots Matrix Grid */}
      <div className="absolute inset-0 bg-[radial-gradient(#0891b2_1.2px,transparent_1.2px)] [background-size:24px_24px] opacity-35 z-2" />
      <div className="absolute inset-0 bg-[radial-gradient(#10b981_1.2px,transparent_1.2px)] [background-size:48px_48px] opacity-20 z-2" />

      {/* 2. Dynamic Scanning Radar Beam Effect */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-500/5 to-transparent h-48 w-full animate-scanline z-3 pointer-events-none opacity-40" />

      {/* 3. Ambient Celestial Auroras & Digital Twin Orbital Glows */}
      <div className="absolute -top-40 left-1/4 w-[700px] h-[700px] bg-cyan-500/15 rounded-full blur-[150px] pointer-events-none z-3 animate-pulse" />
      <div className="absolute top-1/3 -right-40 w-[600px] h-[600px] bg-emerald-500/15 rounded-full blur-[140px] pointer-events-none z-3" />
      <div className="absolute -bottom-40 left-10 w-[650px] h-[650px] bg-teal-500/15 rounded-full blur-[150px] pointer-events-none z-3" />
      <div className="absolute top-1/2 left-1/3 w-[500px] h-[500px] bg-amber-500/10 rounded-full blur-[160px] pointer-events-none z-3" />

      {/* 4. Photorealistic Farmland Depth Layer */}
      <div className="absolute inset-0 w-full h-full opacity-45 mix-blend-screen">
        <Image
          src="/nature-farm-bg.jpg"
          alt="Lush Nature Farmland Background"
          fill
          priority
          unoptimized
          className="object-cover object-center transform scale-105 animate-nature-subtle-pan"
        />
      </div>

      {/* 5. Glowing Sun & Holographic Optical Rings */}
      <div className="absolute top-[5%] right-[14%] sm:right-[18%] w-72 h-72 sm:w-96 sm:h-96 pointer-events-none z-4">
        <div className="absolute inset-0 rounded-full bg-cyan-200/25 blur-3xl animate-pulse" />
        <div className="absolute inset-10 rounded-full bg-amber-200/35 blur-2xl" />
        <div className="absolute -inset-10 rounded-full border border-cyan-400/25 blur-xs scale-110 animate-spin-slow" />
        <div className="absolute -inset-20 rounded-full border border-dashed border-emerald-400/20 scale-125 animate-spin-slow" style={{ animationDirection: "reverse", animationDuration: "50s" }} />
      </div>

      {/* 6. Flying Horizon Dynamics */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-10 opacity-35">
        <div className="absolute top-[26%] sm:top-[22%] animate-bird-flight-1">
          <svg className="w-12 h-10 text-cyan-300 drop-shadow-[0_0_8px_rgba(6,182,212,0.6)]" viewBox="0 0 100 60" fill="currentColor">
            <path className="origin-center animate-bird-wing-flap" d="M 50 40 Q 25 10 0 16 Q 28 35 50 42 Q 72 35 100 16 Q 75 10 50 40 Z" />
          </svg>
        </div>
      </div>

      {/* 7. Canvas for Fluid Grass Waving & Bioluminescent Spores */}
      <canvas
        ref={canvasRef}
        className="absolute bottom-0 inset-x-0 w-full h-[38%] pointer-events-none z-15 opacity-70"
      />

      {/* 8. Deep Command Center Vignette Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/70 to-slate-950/35 pointer-events-none z-16" />
    </div>
  );
}
