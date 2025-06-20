"use client";

import { useEffect, useRef } from "react";
import type * as THREEType from "three";

export const ArenaBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sceneRef = useRef<THREEType.Scene | null>(null);
  const rendererRef = useRef<THREEType.WebGLRenderer | null>(null);
  const animationRef = useRef<number | null>(null);

  useEffect(() => {
    const loadThreeJS = async () => {
      // Dynamically import Three.js
      const THREE = await import("three");

      if (!canvasRef.current) return;

      // Scene setup
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
      );
      const renderer = new THREE.WebGLRenderer({
        canvas: canvasRef.current,
        antialias: true,
        alpha: true,
      });

      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.setClearColor(0x000000, 0);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

      sceneRef.current = scene;
      rendererRef.current = renderer;

      // Create grid
      const gridSize = 50;
      const gridDivisions = 100;

      // Main grid
      const gridHelper = new THREE.GridHelper(
        gridSize,
        gridDivisions,
        0x00ffff,
        0x0066cc
      );
      gridHelper.position.y = -2;
      scene.add(gridHelper);

      // Rotating grid
      const gridHelper2 = new THREE.GridHelper(
        gridSize,
        gridDivisions,
        0xff00ff,
        0x660066
      );
      gridHelper2.position.y = -1.5;
      gridHelper2.rotation.y = Math.PI / 4;
      scene.add(gridHelper2);

      // Particles
      const particlesGeometry = new THREE.BufferGeometry();
      const particlesCount = 200;
      const positions = new Float32Array(particlesCount * 3);
      const colors = new Float32Array(particlesCount * 3);

      for (let i = 0; i < particlesCount * 3; i += 3) {
        positions[i] = (Math.random() - 0.5) * 100;
        positions[i + 1] = Math.random() * 20;
        positions[i + 2] = (Math.random() - 0.5) * 100;

        // Colors: blue to purple to pink
        const hue = Math.random() * 0.3 + 0.5; // 0.5 to 0.8
        const color = new THREE.Color().setHSL(hue, 1, 0.6);
        colors[i] = color.r;
        colors[i + 1] = color.g;
        colors[i + 2] = color.b;
      }

      particlesGeometry.setAttribute(
        "position",
        new THREE.BufferAttribute(positions, 3)
      );
      particlesGeometry.setAttribute(
        "color",
        new THREE.BufferAttribute(colors, 3)
      );

      const particlesMaterial = new THREE.PointsMaterial({
        size: 0.3,
        vertexColors: true,
        transparent: true,
        opacity: 1.0,
        blending: THREE.AdditiveBlending,
      });

      const particles = new THREE.Points(particlesGeometry, particlesMaterial);
      scene.add(particles);

      // Floating symbols
      const symbolGeometry = new THREE.RingGeometry(0.5, 0.8, 8);
      const symbolMaterial = new THREE.MeshBasicMaterial({
        color: 0x00ffff,
        transparent: true,
        opacity: 0.9,
        side: THREE.DoubleSide,
      });

      for (let i = 0; i < 10; i++) {
        const symbol = new THREE.Mesh(symbolGeometry, symbolMaterial);
        symbol.position.set(
          (Math.random() - 0.5) * 50,
          Math.random() * 10 + 5,
          (Math.random() - 0.5) * 50
        );
        symbol.rotation.x = Math.random() * Math.PI;
        symbol.rotation.y = Math.random() * Math.PI;
        scene.add(symbol);
      }

      // Lighting
      const ambientLight = new THREE.AmbientLight(0x404040, 0.4);
      scene.add(ambientLight);

      const directionalLight = new THREE.DirectionalLight(0x00ffff, 0.6);
      directionalLight.position.set(10, 10, 5);
      scene.add(directionalLight);

      // Camera position
      camera.position.set(0, 8, 15);
      camera.lookAt(0, 0, 0);

      // Mouse interaction
      let mouseX = 0;
      let mouseY = 0;

      const handleMouseMove = (event: MouseEvent) => {
        mouseX = (event.clientX / window.innerWidth) * 2 - 1;
        mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
      };

      window.addEventListener("mousemove", handleMouseMove);

      // Animation
      const animate = () => {
        animationRef.current = requestAnimationFrame(animate);

        // Rotate grids
        gridHelper.rotation.y += 0.002;
        gridHelper2.rotation.y -= 0.003;

        // Animate particles
        const positions = particles.geometry.attributes.position
          .array as Float32Array;
        for (let i = 1; i < positions.length; i += 3) {
          positions[i] += Math.sin(Date.now() * 0.001 + i) * 0.01;
        }
        particles.geometry.attributes.position.needsUpdate = true;

        // Camera movement based on mouse
        camera.position.x += (mouseX * 2 - camera.position.x) * 0.02;
        camera.position.y += (mouseY * 2 + 8 - camera.position.y) * 0.02;
        camera.lookAt(0, 0, 0);

        renderer.render(scene, camera);
      };

      animate();

      // Handle resize
      const handleResize = () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
      };

      window.addEventListener("resize", handleResize);

      return () => {
        window.removeEventListener("mousemove", handleMouseMove);
        window.removeEventListener("resize", handleResize);
        if (animationRef.current) {
          cancelAnimationFrame(animationRef.current);
        }
      };
    };

    loadThreeJS();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  return (
    <>
      <canvas
        ref={canvasRef}
        className="fixed inset-0 w-full h-full -z-10"
        style={{
          background:
            "linear-gradient(180deg, #0a0a0a 0%, #1a0a2e 50%, #16213e 100%)",
        }}
      />
      {/* Dark overlay */}
      <div
        className="fixed inset-0 w-full h-full pointer-events-none -z-9"
        style={{
          background: "rgba(10, 10, 20, 0.55)",
        }}
      />
    </>
  );
};
