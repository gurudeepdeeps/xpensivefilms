import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { Terminal, Code2 } from 'lucide-react';

const DeveloperSetup3DCanvas = ({ isModal = false, themeMode = 'cyber' }) => {
  const mountRef = useRef(null);
  const [webGlSupported, setWebGlSupported] = useState(true);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // Check WebGL Availability
    const checkWebGL = () => {
      try {
        const canvas = document.createElement('canvas');
        return !!(window.WebGLRenderingContext && (canvas.getContext('webgl') || canvas.getContext('experimental-webgl')));
      } catch (e) {
        return false;
      }
    };

    if (!checkWebGL()) {
      setWebGlSupported(false);
      return;
    }

    // Measure Container Dimensions safely
    let width = container.clientWidth || (isModal ? 650 : 380);
    let height = container.clientHeight || (isModal ? 450 : 350);

    if (width <= 0) width = 360;
    if (height <= 0) height = 320;

    // Detect Mobile Devices
    const isMobile = window.innerWidth <= 768;

    // Scene & Camera
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, isMobile ? 2.6 : 2.2, isMobile ? 8.2 : 7.0);
    camera.lookAt(0, 0.5, 0);

    // WebGL Renderer with Safety Try/Catch
    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({ alpha: true, antialias: !isMobile });
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, isMobile ? 1.5 : 2));
      container.appendChild(renderer.domElement);
    } catch (err) {
      console.warn("WebGL Initialization Exception:", err);
      setWebGlSupported(false);
      return;
    }

    // Theme Colors
    const getTheme = () => {
      if (themeMode === 'matrix') {
        return { primary: 0x22c55e, secondary: 0x15803d, screenGlow: 0x22c55e };
      }
      if (themeMode === 'rgb') {
        return { primary: 0xec4899, secondary: 0x8b5cf6, screenGlow: 0xf43f5e };
      }
      return { primary: 0xa855f7, secondary: 0x6366f1, screenGlow: 0x38bdf8 }; // cyber
    };
    const theme = getTheme();

    // =========================================================================
    // DYNAMIC IDE CODE CANVAS TEXTURE GENERATOR
    // =========================================================================
    const createIDECanvasTexture = (isLeftScreen = false) => {
      const codeCanvas = document.createElement('canvas');
      codeCanvas.width = isMobile ? 512 : 1024;
      codeCanvas.height = isMobile ? 256 : 512;
      const ctx = codeCanvas.getContext('2d');

      const drawIDE = (offsetY = 0, cursorVisible = true) => {
        const cW = codeCanvas.width;
        const cH = codeCanvas.height;

        ctx.fillStyle = '#0f111a';
        ctx.fillRect(0, 0, cW, cH);

        // Header Bar
        ctx.fillStyle = '#181a26';
        ctx.fillRect(0, 0, cW, 40);

        ctx.fillStyle = '#ef4444'; ctx.beginPath(); ctx.arc(20, 20, 5, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = '#eab308'; ctx.beginPath(); ctx.arc(36, 20, 5, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = '#22c55e'; ctx.beginPath(); ctx.arc(52, 20, 5, 0, Math.PI * 2); ctx.fill();

        ctx.fillStyle = '#a78bfa';
        ctx.font = 'bold 14px monospace';
        ctx.fillText(isLeftScreen ? '⚙️ database_sync.rs' : '⚡ App.jsx - XpensiveFilms', 70, 26);

        // Code Lines
        const codeLines = isLeftScreen ? [
          { tokens: [{ t: 'use ', c: '#f43f5e' }, { t: 'supabase::storage::', c: '#a78bfa' }, { t: 'Bucket;', c: '#38bdf8' }] },
          { tokens: [{ t: 'async fn ', c: '#f43f5e' }, { t: 'optimize_cdn_cache', c: '#60a5fa' }, { t: '() {', c: '#e5e7eb' }] },
          { tokens: [{ t: '    let ', c: '#f43f5e' }, { t: 'cache ', c: '#38bdf8' }, { t: '= ', c: '#f43f5e' }, { t: 'Bucket::connect();', c: '#e5e7eb' }] },
          { tokens: [{ t: '    println!(', c: '#f43f5e' }, { t: '"[OK] Storage Invalidation Done"', c: '#fde047' }, { t: ');', c: '#e5e7eb' }] },
          { tokens: [{ t: '}', c: '#e5e7eb' }] },
        ] : [
          { tokens: [{ t: 'import ', c: '#c084fc' }, { t: '{ useState, useEffect } ', c: '#38bdf8' }, { t: 'from ', c: '#c084fc' }, { t: "'react'", c: '#fde047' }, { t: ';', c: '#9ca3af' }] },
          { tokens: [{ t: 'export const ', c: '#c084fc' }, { t: 'App ', c: '#60a5fa' }, { t: '= () => {', c: '#f3f4f6' }] },
          { tokens: [{ t: '  const ', c: '#c084fc' }, { t: '[status, setStatus] ', c: '#38bdf8' }, { t: '= ', c: '#c084fc' }, { t: 'useState(', c: '#f3f4f6' }, { t: '"MAINTENANCE"', c: '#fde047' }, { t: ');', c: '#f3f4f6' }] },
          { tokens: [{ t: '  // Sync 4K Video Pipelines & Storage CDN', c: '#6b7280' }] },
          { tokens: [{ t: '  useEffect', c: '#60a5fa' }, { t: '(() => { ', c: '#f3f4f6' }, { t: 'optimizeMediaClusters(); ', c: '#60a5fa' }, { t: '}, []);', c: '#f3f4f6' }] },
          { tokens: [{ t: '  return ', c: '#c084fc' }, { t: '<', c: '#9ca3af' }, { t: 'StudioLayout ', c: '#38bdf8' }, { t: 'live', c: '#c084fc' }, { t: '={', c: '#9ca3af' }, { t: 'true', c: '#fb923c' }, { t: '} />;', c: '#9ca3af' }] },
          { tokens: [{ t: '};', c: '#f3f4f6' }] }
        ];

        let yPos = 65 - offsetY;
        codeLines.forEach((line, index) => {
          let xPos = 20;
          ctx.font = 'bold 14px "Fira Code", monospace';
          line.tokens.forEach((token) => {
            ctx.fillStyle = token.c;
            ctx.fillText(token.t, xPos, yPos);
            xPos += ctx.measureText(token.t).width;
          });

          if (index === 4 && cursorVisible && !isLeftScreen) {
            ctx.fillStyle = '#38bdf8';
            ctx.fillRect(xPos + 4, yPos - 14, 8, 16);
          }
          yPos += 24;
        });
      };

      drawIDE(0, true);
      const texture = new THREE.CanvasTexture(codeCanvas);
      texture.drawIDE = drawIDE;
      return texture;
    };

    const centerScreenTexture = createIDECanvasTexture(false);
    const leftScreenTexture = createIDECanvasTexture(true);

    // Setup Group
    const setupGroup = new THREE.Group();
    scene.add(setupGroup);

    // Desk Top
    const deskGeo = new THREE.BoxGeometry(4.8, 0.15, 2.4);
    const deskMat = new THREE.MeshStandardMaterial({ color: 0x181a24, roughness: 0.2, metalness: 0.8 });
    const desk = new THREE.Mesh(deskGeo, deskMat);
    desk.position.set(0, -0.075, 0);
    setupGroup.add(desk);

    // Desk Legs
    const legGeo = new THREE.CylinderGeometry(0.06, 0.06, 2.2, 16);
    const legMat = new THREE.MeshStandardMaterial({ color: 0x11111b, metalness: 0.9 });
    [[-2.2, -1.15, -1], [2.2, -1.15, -1], [-2.2, -1.15, 1], [2.2, -1.15, 1]].forEach(([x, y, z]) => {
      const leg = new THREE.Mesh(legGeo, legMat);
      leg.position.set(x, y, z);
      setupGroup.add(leg);
    });

    // Center Monitor Frame & Textured Screen
    const screenFrameGeo = new THREE.BoxGeometry(3.0, 1.5, 0.08);
    const screenFrameMat = new THREE.MeshStandardMaterial({ color: 0x09090d, roughness: 0.3 });
    const mainScreenFrame = new THREE.Mesh(screenFrameGeo, screenFrameMat);
    mainScreenFrame.position.set(0, 1.15, -0.6);
    setupGroup.add(mainScreenFrame);

    const mainScreenDisplay = new THREE.Mesh(
      new THREE.PlaneGeometry(2.88, 1.38),
      new THREE.MeshBasicMaterial({ map: centerScreenTexture })
    );
    mainScreenDisplay.position.set(0, 1.15, -0.55);
    setupGroup.add(mainScreenDisplay);

    // Stand
    const stand = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.8, 0.3), new THREE.MeshStandardMaterial({ color: 0x27272a, metalness: 0.8 }));
    stand.position.set(0, 0.4, -0.7);
    setupGroup.add(stand);

    // Left Side Monitor
    const leftScreenFrame = new THREE.Mesh(new THREE.BoxGeometry(1.8, 1.3, 0.06), screenFrameMat);
    leftScreenFrame.position.set(-2.2, 1.05, -0.2);
    leftScreenFrame.rotation.y = Math.PI / 5;
    setupGroup.add(leftScreenFrame);

    const leftScreenDisplay = new THREE.Mesh(
      new THREE.PlaneGeometry(1.7, 1.2),
      new THREE.MeshBasicMaterial({ map: leftScreenTexture })
    );
    leftScreenDisplay.position.set(-2.16, 1.05, -0.16);
    leftScreenDisplay.rotation.y = Math.PI / 5;
    setupGroup.add(leftScreenDisplay);

    // Developer Character
    const devGroup = new THREE.Group();
    devGroup.position.set(0, 0, 0.8);

    const chairMat = new THREE.MeshStandardMaterial({ color: 0x181825, roughness: 0.4 });
    const seat = new THREE.Mesh(new THREE.CylinderGeometry(0.7, 0.7, 0.15, 32), chairMat);
    seat.position.set(0, -0.5, 0.2);
    devGroup.add(seat);

    const chairBack = new THREE.Mesh(new THREE.BoxGeometry(1.1, 1.3, 0.15), chairMat);
    chairBack.position.set(0, 0.2, 0.8);
    devGroup.add(chairBack);

    const hoodieMat = new THREE.MeshStandardMaterial({ color: theme.secondary, roughness: 0.6 });
    const body = new THREE.Mesh(new THREE.CylinderGeometry(0.45, 0.55, 1.1, 16), hoodieMat);
    body.position.set(0, 0.2, 0.3);
    devGroup.add(body);

    const head = new THREE.Mesh(new THREE.SphereGeometry(0.35, 32, 32), new THREE.MeshStandardMaterial({ color: 0xf43f5e }));
    head.position.set(0, 0.95, 0.3);
    devGroup.add(head);

    const vrGoggles = new THREE.Mesh(
      new THREE.BoxGeometry(0.42, 0.16, 0.22),
      new THREE.MeshStandardMaterial({ color: theme.primary, emissive: theme.primary, emissiveIntensity: 0.9 })
    );
    vrGoggles.position.set(0, 0.98, 0.08);
    devGroup.add(vrGoggles);

    const armGeo = new THREE.CylinderGeometry(0.1, 0.1, 0.7, 16);
    const leftArm = new THREE.Mesh(armGeo, hoodieMat);
    leftArm.position.set(-0.55, 0.15, -0.05);
    leftArm.rotation.z = Math.PI / 4;
    leftArm.rotation.x = -Math.PI / 4;
    devGroup.add(leftArm);

    const rightArm = new THREE.Mesh(armGeo, hoodieMat);
    rightArm.position.set(0.55, 0.15, -0.05);
    rightArm.rotation.z = -Math.PI / 4;
    rightArm.rotation.x = -Math.PI / 4;
    devGroup.add(rightArm);

    setupGroup.add(devGroup);

    // Keyboard & Mug
    const keyboard = new THREE.Mesh(new THREE.BoxGeometry(1.4, 0.06, 0.5), new THREE.MeshStandardMaterial({ color: 0x11111b }));
    keyboard.position.set(0, 0.03, 0.3);
    setupGroup.add(keyboard);

    const mug = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 0.28, 16), new THREE.MeshStandardMaterial({ color: 0xf43f5e }));
    mug.position.set(1.4, 0.14, 0.2);
    setupGroup.add(mug);

    // PC Tower
    const pcTower = new THREE.Mesh(new THREE.BoxGeometry(0.7, 1.4, 1.2), new THREE.MeshStandardMaterial({ color: 0x09090d, metalness: 0.8 }));
    pcTower.position.set(1.8, 0.7, -0.4);
    setupGroup.add(pcTower);

    // Particles
    const particleCount = isMobile ? 60 : 120;
    const particleGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount * 3; i += 3) {
      positions[i] = (Math.random() - 0.5) * 8;
      positions[i + 1] = Math.random() * 5;
      positions[i + 2] = (Math.random() - 0.5) * 6;
    }
    particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const particlePoints = new THREE.Points(particleGeo, new THREE.PointsMaterial({ size: 0.05, color: theme.screenGlow, transparent: true, opacity: 0.7 }));
    scene.add(particlePoints);

    // Lighting
    scene.add(new THREE.AmbientLight(0xffffff, 0.7));
    const screenLight = new THREE.PointLight(theme.screenGlow, 3.5, 6);
    screenLight.position.set(0, 1.15, -0.2);
    scene.add(screenLight);

    // Mouse & Touch Controls
    let mouseX = 0, mouseY = 0, isMouseDown = false;
    let prevMousePos = { x: 0, y: 0 };

    const getPos = (e) => {
      if (e.touches && e.touches.length > 0) {
        return { x: e.touches[0].clientX, y: e.touches[0].clientY };
      }
      return { x: e.clientX, y: e.clientY };
    };

    const handlePointerMove = (e) => {
      const pos = getPos(e);
      const rect = container.getBoundingClientRect();
      const x = pos.x - rect.left - width / 2;
      const y = pos.y - rect.top - height / 2;

      if (isMouseDown) {
        const deltaX = pos.x - prevMousePos.x;
        const deltaY = pos.y - prevMousePos.y;
        setupGroup.rotation.y += deltaX * 0.008;
        setupGroup.rotation.x += deltaY * 0.008;
        prevMousePos = pos;
      } else {
        mouseX = (x / width) * 2;
        mouseY = -(y / height) * 2;
      }
    };

    const handlePointerDown = (e) => {
      isMouseDown = true;
      prevMousePos = getPos(e);
    };

    const handlePointerUp = () => { isMouseDown = false; };

    container.addEventListener('mousemove', handlePointerMove);
    container.addEventListener('mousedown', handlePointerDown);
    container.addEventListener('touchstart', handlePointerDown, { passive: true });
    container.addEventListener('touchmove', handlePointerMove, { passive: true });
    window.addEventListener('mouseup', handlePointerUp);
    window.addEventListener('touchend', handlePointerUp);

    // Resize Handler
    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      if (w > 0 && h > 0) {
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h);
      }
    };
    window.addEventListener('resize', handleResize);

    // Animation Loop
    let animationId, clock = new THREE.Clock(), cursorTimer = 0, cursorVisible = true;

    const animate = () => {
      animationId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      cursorTimer += 0.016;
      if (cursorTimer > 0.45) {
        cursorTimer = 0;
        cursorVisible = !cursorVisible;
        centerScreenTexture.drawIDE(0, cursorVisible);
        centerScreenTexture.needsUpdate = true;
      }

      if (!isMouseDown) {
        setupGroup.rotation.y = Math.sin(elapsedTime * 0.5) * 0.1 + mouseX * 0.15;
        setupGroup.rotation.x = Math.cos(elapsedTime * 0.3) * 0.04 + mouseY * 0.08;
      }

      leftArm.rotation.x = -Math.PI / 4 + Math.sin(elapsedTime * 15) * 0.03;
      rightArm.rotation.x = -Math.PI / 4 + Math.cos(elapsedTime * 15) * 0.03;

      const rainArr = particleGeo.attributes.position.array;
      for (let i = 1; i < particleCount * 3; i += 3) {
        rainArr[i] -= 0.02;
        if (rainArr[i] < 0) rainArr[i] = 5;
      }
      particleGeo.attributes.position.needsUpdate = true;

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationId);
      container.removeEventListener('mousemove', handlePointerMove);
      container.removeEventListener('mousedown', handlePointerDown);
      container.removeEventListener('touchstart', handlePointerDown);
      container.removeEventListener('touchmove', handlePointerMove);
      window.removeEventListener('mouseup', handlePointerUp);
      window.removeEventListener('touchend', handlePointerUp);
      window.removeEventListener('resize', handleResize);
      if (renderer && renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      centerScreenTexture.dispose();
      leftScreenTexture.dispose();
      if (renderer) renderer.dispose();
    };
  }, [isModal, themeMode]);

  // Fallback CSS Animated 3D Card if WebGL is unavailable on older mobile GPU
  if (!webGlSupported) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center bg-gradient-to-b from-[#131424] to-[#0a0b12] rounded-3xl border border-white/10 space-y-4">
        <div className="w-16 h-16 rounded-2xl bg-purple-500/20 border border-purple-500/30 flex items-center justify-center text-purple-400 animate-pulse">
          <Terminal className="w-8 h-8" />
        </div>
        <div>
          <h4 className="text-lg font-bold text-white flex items-center justify-center gap-2">
            <Code2 className="w-5 h-5 text-purple-400" /> Developer Workspace
          </h4>
          <p className="text-xs text-gray-400 mt-1 max-w-xs">
            Lead developer active in IDE compiling React 7 & Supabase production sync.
          </p>
        </div>
        <div className="w-full max-w-xs bg-[#07080f] p-3 rounded-xl border border-white/5 font-mono text-[11px] text-left text-gray-300 space-y-1">
          <div className="text-purple-400 font-bold">⚡ App.jsx - XpensiveFilms</div>
          <div className="text-emerald-400">✓ 2091 modules transformed</div>
          <div className="text-amber-400">● Status: MAINTENANCE UNTIL SEPT 6</div>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={mountRef}
      className="relative w-full h-full flex items-center justify-center cursor-grab active:cursor-grabbing select-none"
    />
  );
};

export default DeveloperSetup3DCanvas;
