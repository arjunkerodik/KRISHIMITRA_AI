"use client";

import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";

export const LowPolyFarmland3D: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [hasWebGL, setHasWebGL] = useState(true);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    // Check reduced motion preference
    if (typeof window !== "undefined") {
      const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
      if (mediaQuery.matches) {
        setReducedMotion(true);
        return;
      }
    }

    const container = containerRef.current;
    if (!container) return;

    let scene: THREE.Scene;
    let camera: THREE.PerspectiveCamera;
    let renderer: THREE.WebGLRenderer;
    let particles: THREE.Points;
    let farmMesh: THREE.Mesh;
    let animationFrameId: number;

    try {
      // 1. Scene setup
      scene = new THREE.Scene();
      scene.fog = new THREE.FogExp2(0x0f1712, 0.04);

      // 2. Camera setup
      const aspect = container.clientWidth / container.clientHeight;
      camera = new THREE.PerspectiveCamera(45, aspect, 0.1, 100);
      camera.position.set(0, 5.5, 12);
      camera.lookAt(0, 0, 0);

      // 3. Renderer setup
      renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: "low-power" });
      renderer.setSize(container.clientWidth, container.clientHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
      container.appendChild(renderer.domElement);

      // 4. Lighting
      const ambientLight = new THREE.AmbientLight(0xd4e9d7, 1.2);
      scene.add(ambientLight);

      const sunLight = new THREE.DirectionalLight(0xfff4d6, 2.0);
      sunLight.position.set(8, 12, 6);
      scene.add(sunLight);

      const fillLight = new THREE.DirectionalLight(0x3f8f45, 0.8);
      fillLight.position.set(-6, 4, -4);
      scene.add(fillLight);

      // 5. Stylized Low-Poly Rolling Farmland Geometry
      const groundGeo = new THREE.PlaneGeometry(36, 36, 18, 18);
      const posAttr = groundGeo.attributes.position;
      
      // Introduce low-poly undulations & furrow rows
      for (let i = 0; i < posAttr.count; i++) {
        const x = posAttr.getX(i);
        const y = posAttr.getY(i);
        // Create rolling hill formula + crop ridges
        const z = Math.sin(x * 0.35) * 0.8 + Math.cos(y * 0.35) * 0.8 + Math.sin(x * 1.5) * 0.15;
        posAttr.setZ(i, z);
      }
      groundGeo.computeVertexNormals();

      const groundMat = new THREE.MeshLambertMaterial({
        color: 0x2e6b33, // Brand green tone
        flatShading: true,
      });

      farmMesh = new THREE.Mesh(groundGeo, groundMat);
      farmMesh.rotation.x = -Math.PI / 2.3;
      farmMesh.position.y = -1.5;
      scene.add(farmMesh);

      // 6. Low-poly crop row clusters (Mini low-poly plants)
      const cropGeo = new THREE.ConeGeometry(0.2, 0.6, 4);
      const cropMat = new THREE.MeshLambertMaterial({ color: 0x4aa44f, flatShading: true });
      const instancedCrops = new THREE.InstancedMesh(cropGeo, cropMat, 120);
      const dummy = new THREE.Object3D();

      let idx = 0;
      for (let r = -4; r <= 4; r += 1.2) {
        for (let c = -6; c <= 6; c += 1.1) {
          if (idx < 120) {
            dummy.position.set(c + (Math.random() * 0.2), -0.8 + (Math.sin(c * 0.35) * 0.4), r * 0.8);
            dummy.scale.setScalar(0.8 + Math.random() * 0.4);
            dummy.rotation.y = Math.random() * Math.PI;
            dummy.updateMatrix();
            instancedCrops.setMatrixAt(idx++, dummy.matrix);
          }
        }
      }
      scene.add(instancedCrops);

      // 7. Drifting Pollen / Leaf particles
      const particleCount = 45;
      const particleGeo = new THREE.BufferGeometry();
      const particlePos = new Float32Array(particleCount * 3);

      for (let i = 0; i < particleCount * 3; i += 3) {
        particlePos[i] = (Math.random() - 0.5) * 20;
        particlePos[i + 1] = Math.random() * 8;
        particlePos[i + 2] = (Math.random() - 0.5) * 20;
      }

      particleGeo.setAttribute("position", new THREE.BufferAttribute(particlePos, 3));
      const particleMat = new THREE.PointsMaterial({
        color: 0xe8d7be,
        size: 0.12,
        transparent: true,
        opacity: 0.7,
      });

      particles = new THREE.Points(particleGeo, particleMat);
      scene.add(particles);

      // 8. Animation Loop with slow parallax
      const clock = new THREE.Clock();

      const animate = () => {
        animationFrameId = requestAnimationFrame(animate);
        const delta = clock.getDelta();
        const elapsedTime = clock.getElapsedTime();

        // Slow terrain gentle breathe
        farmMesh.rotation.z = Math.sin(elapsedTime * 0.15) * 0.02;

        // Particle drifting
        const positions = particles.geometry.attributes.position.array as Float32Array;
        for (let i = 1; i < particleCount * 3; i += 3) {
          positions[i] -= delta * 0.35;
          if (positions[i] < 0) positions[i] = 8;
        }
        particles.geometry.attributes.position.needsUpdate = true;

        renderer.render(scene, camera);
      };

      animate();

      // Handle Resize
      const handleResize = () => {
        if (!container) return;
        camera.aspect = container.clientWidth / container.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(container.clientWidth, container.clientHeight);
      };

      window.addEventListener("resize", handleResize);

      return () => {
        window.removeEventListener("resize", handleResize);
        cancelAnimationFrame(animationFrameId);
        if (renderer?.domElement && container.contains(renderer.domElement)) {
          container.removeChild(renderer.domElement);
        }
        renderer?.dispose();
      };
    } catch {
      setHasWebGL(false);
    }
  }, [reducedMotion]);

  if (reducedMotion || !hasWebGL) {
    return (
      <div
        className="absolute inset-0 w-full h-full bg-cover bg-center opacity-40 mix-blend-overlay"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=1600&auto=format&fit=crop&q=80')`,
        }}
        aria-hidden="true"
      />
    );
  }

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 w-full h-full pointer-events-none opacity-60 dark:opacity-45"
      aria-hidden="true"
    />
  );
};
