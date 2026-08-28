import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

const DeveloperSetup3DCanvas = ({ isModal = false, themeMode = 'cyber' }) => {
  const mountRef = useRef(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // Canvas Size
    const width = container.clientWidth || (isModal ? 700 : 450);
    const height = container.clientHeight || (isModal ? 500 : 400);

    // Scene
    const scene = new THREE.Scene();

    // Camera
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 2.2, 7.0);
    camera.lookAt(0, 0.5, 0);

    // Renderer
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    container.appendChild(renderer.domElement);

    // Theme Colors
    const getTheme = () => {
      if (themeMode === 'matrix') {
        return { primary: 0x22c55e, secondary: 0x15803d, screenGlow: 0x22c55e, codeKeyword: '#4ade80', codeVar: '#86efac', codeString: '#fde047' };
      }
      if (themeMode === 'rgb') {
        return { primary: 0xec4899, secondary: 0x8b5cf6, screenGlow: 0xf43f5e, codeKeyword: '#ff79c6', codeVar: '#50fa7b', codeString: '#f1fa8c' };
      }
      return { primary: 0xa855f7, secondary: 0x6366f1, screenGlow: 0x38bdf8, codeKeyword: '#c084fc', codeVar: '#38bdf8', codeString: '#fbbf24' }; // cyber
    };
    const theme = getTheme();

    // =========================================================================
    // DYNAMIC IDE CODE CANVAS TEXTURE GENERATOR
    // =========================================================================
    const createIDECanvasTexture = (isLeftScreen = false) => {
      const codeCanvas = document.createElement('canvas');
      codeCanvas.width = 1024;
      codeCanvas.height = 512;
      const ctx = codeCanvas.getContext('2d');

      const drawIDE = (offsetY = 0, cursorVisible = true) => {
        // VS Code Dark Background
        ctx.fillStyle = '#0f111a';
        ctx.fillRect(0, 0, 1024, 512);

        // Top Window Header Bar
        ctx.fillStyle = '#181a26';
        ctx.fillRect(0, 0, 1024, 44);

        // Window Controls (Red, Yellow, Green dots)
        ctx.fillStyle = '#ef4444'; ctx.beginPath(); ctx.arc(24, 22, 7, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = '#eab308'; ctx.beginPath(); ctx.arc(44, 22, 7, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = '#22c55e'; ctx.beginPath(); ctx.arc(64, 22, 7, 0, Math.PI * 2); ctx.fill();

        // IDE Tab Title
        ctx.fillStyle = '#222536';
        ctx.fillRect(90, 8, 240, 36);
        ctx.fillStyle = '#a78bfa';
        ctx.font = 'bold 16px monospace';
        ctx.fillText(isLeftScreen ? '⚙️ database_sync.rs' : '⚡ App.jsx - XpensiveFilms', 105, 32);

        // Line Numbers Column Sidebar
        ctx.fillStyle = '#141622';
        ctx.fillRect(0, 44, 60, 468);
        ctx.fillStyle = '#4b5563';
        ctx.font = '15px monospace';
        for (let i = 1; i <= 16; i++) {
          ctx.fillText(String(i).padStart(2, ' '), 18, 44 + i * 28);
        }

        // Code Lines Content
        const codeLines = isLeftScreen ? [
          { tokens: [{ t: 'use ', c: '#f43f5e' }, { t: 'supabase::storage::', c: '#a78bfa' }, { t: 'Bucket;', c: '#38bdf8' }] },
          { tokens: [{ t: 'async fn ', c: '#f43f5e' }, { t: 'optimize_cdn_cache', c: '#60a5fa' }, { t: '() {', c: '#e5e7eb' }] },
          { tokens: [{ t: '    let ', c: '#f43f5e' }, { t: 'cache ', c: '#38bdf8' }, { t: '= ', c: '#f43f5e' }, { t: 'Bucket::connect(', c: '#e5e7eb' }, { t: '"cdn_media"', c: '#fde047' }, { t: ');', c: '#e5e7eb' }] },
          { tokens: [{ t: '    cache.', c: '#e5e7eb' }, { t: 'purge_expired_tokens', c: '#60a5fa' }, { t: '().await;', c: '#e5e7eb' }] },
          { tokens: [{ t: '    println!(', c: '#f43f5e' }, { t: '"[OK] Storage Invalidation Done"', c: '#fde047' }, { t: ');', c: '#e5e7eb' }] },
          { tokens: [{ t: '}', c: '#e5e7eb' }] },
          { tokens: [] },
          { tokens: [{ t: '// System RLS Database Sync', c: '#6b7280' }] },
          { tokens: [{ t: 'pub struct ', c: '#f43f5e' }, { t: 'ClusterConfig ', c: '#38bdf8' }, { t: '{ status: ', c: '#e5e7eb' }, { t: 'u32 ', c: '#a78bfa' }, { t: '}', c: '#e5e7eb' }] },
        ] : [
          { tokens: [{ t: 'import ', c: '#c084fc' }, { t: '{ useState, useEffect } ', c: '#38bdf8' }, { t: 'from ', c: '#c084fc' }, { t: "'react'", c: '#fde047' }, { t: ';', c: '#9ca3af' }] },
          { tokens: [{ t: 'import ', c: '#c084fc' }, { t: 'XpensiveFilmsEngine ', c: '#38bdf8' }, { t: 'from ', c: '#c084fc' }, { t: "'./studio'", c: '#fde047' }, { t: ';', c: '#9ca3af' }] },
          { tokens: [] },
          { tokens: [{ t: 'export const ', c: '#c084fc' }, { t: 'App ', c: '#60a5fa' }, { t: '= () => {', c: '#f3f4f6' }] },
          { tokens: [{ t: '  const ', c: '#c084fc' }, { t: '[status, setStatus] ', c: '#38bdf8' }, { t: '= ', c: '#c084fc' }, { t: 'useState(', c: '#f3f4f6' }, { t: '"MAINTENANCE"', c: '#fde047' }, { t: ');', c: '#f3f4f6' }] },
          { tokens: [{ t: '  const ', c: '#c084fc' }, { t: '[progress, setProgress] ', c: '#38bdf8' }, { t: '= ', c: '#c084fc' }, { t: 'useState(', c: '#f3f4f6' }, { t: '98', c: '#fb923c' }, { t: ');', c: '#f3f4f6' }] },
          { tokens: [] },
          { tokens: [{ t: '  // Auto Sync 4K Video Pipelines & Storage CDN', c: '#6b7280' }] },
          { tokens: [{ t: '  useEffect', c: '#60a5fa' }, { t: '(() => {', c: '#f3f4f6' }] },
          { tokens: [{ t: '    XpensiveFilmsEngine.', c: '#f3f4f6' }, { t: 'optimizeMediaClusters', c: '#60a5fa' }, { t: '();', c: '#f3f4f6' }] },
          { tokens: [{ t: '    console.', c: '#f3f4f6' }, { t: 'log', c: '#60a5fa' }, { t: '(', c: '#f3f4f6' }, { t: '"[STUDIO] 4K Video Pipeline Ready!"', c: '#fde047' }, { t: ');', c: '#f3f4f6' }] },
          { tokens: [{ t: '  }, []);', c: '#f3f4f6' }] },
          { tokens: [] },
          { tokens: [{ t: '  return ', c: '#c084fc' }, { t: '<', c: '#9ca3af' }, { t: 'StudioLayout ', c: '#38bdf8' }, { t: 'live', c: '#c084fc' }, { t: '={', c: '#9ca3af' }, { t: 'true', c: '#fb923c' }, { t: '} />;', c: '#9ca3af' }] },
          { tokens: [{ t: '};', c: '#f3f4f6' }] }
        ];

        // Draw Code Line Tokens
        let yPos = 75 - offsetY;
        codeLines.forEach((line, index) => {
          let xPos = 80;
          ctx.font = 'bold 17px "Fira Code", monospace';
          line.tokens.forEach((token) => {
            ctx.fillStyle = token.c;
            ctx.fillText(token.t, xPos, yPos);
            xPos += ctx.measureText(token.t).width;
          });

          // Draw Blinking Cursor at active line
          if (index === 10 && cursorVisible && !isLeftScreen) {
            ctx.fillStyle = '#38bdf8';
            ctx.fillRect(xPos + 4, yPos - 16, 10, 20);
          }
          yPos += 28;
        });
      };

      drawIDE(0, true);
      const texture = new THREE.CanvasTexture(codeCanvas);
      texture.drawIDE = drawIDE;
      texture.codeCanvas = codeCanvas;
      return texture;
    };

    // Create Textures for screens
    const centerScreenTexture = createIDECanvasTexture(false);
    const leftScreenTexture = createIDECanvasTexture(true);

    // Main Workstation Scene Group
    const setupGroup = new THREE.Group();
    scene.add(setupGroup);

    // 1. DESK TOP (Metallic / Dark Glass)
    const deskGeo = new THREE.BoxGeometry(4.8, 0.15, 2.4);
    const deskMat = new THREE.MeshStandardMaterial({
      color: 0x181a24,
      roughness: 0.2,
      metalness: 0.8,
    });
    const desk = new THREE.Mesh(deskGeo, deskMat);
    desk.position.set(0, -0.075, 0);
    setupGroup.add(desk);

    // Desk Legs
    const legGeo = new THREE.CylinderGeometry(0.06, 0.06, 2.2, 16);
    const legMat = new THREE.MeshStandardMaterial({ color: 0x11111b, metalness: 0.9, roughness: 0.1 });
    const legPositions = [
      [-2.2, -1.15, -1],
      [2.2, -1.15, -1],
      [-2.2, -1.15, 1],
      [2.2, -1.15, 1],
    ];
    legPositions.forEach(([x, y, z]) => {
      const leg = new THREE.Mesh(legGeo, legMat);
      leg.position.set(x, y, z);
      setupGroup.add(leg);
    });

    // 2. DUAL ULTRA-WIDE CURVED MONITORS WITH REAL IDE DISPLAY TEXTURES
    // Main Center Monitor Frame
    const screenFrameGeo = new THREE.BoxGeometry(3.0, 1.5, 0.08);
    const screenFrameMat = new THREE.MeshStandardMaterial({ color: 0x09090d, roughness: 0.3 });
    const mainScreenFrame = new THREE.Mesh(screenFrameGeo, screenFrameMat);
    mainScreenFrame.position.set(0, 1.15, -0.6);
    setupGroup.add(mainScreenFrame);

    // Glowing Code Screen Surface (Textured with Real IDE Code)
    const centerDisplayMat = new THREE.MeshBasicMaterial({
      map: centerScreenTexture,
      transparent: false,
    });
    const mainScreenDisplay = new THREE.Mesh(new THREE.PlaneGeometry(2.88, 1.38), centerDisplayMat);
    mainScreenDisplay.position.set(0, 1.15, -0.55);
    setupGroup.add(mainScreenDisplay);

    // Center Monitor Stand
    const standGeo = new THREE.BoxGeometry(0.4, 0.8, 0.3);
    const standMat = new THREE.MeshStandardMaterial({ color: 0x27272a, metalness: 0.8 });
    const stand = new THREE.Mesh(standGeo, standMat);
    stand.position.set(0, 0.4, -0.7);
    setupGroup.add(stand);

    // Left Side Curved Monitor
    const leftFrameGeo = new THREE.BoxGeometry(1.8, 1.3, 0.06);
    const leftScreenFrame = new THREE.Mesh(leftFrameGeo, screenFrameMat);
    leftScreenFrame.position.set(-2.2, 1.05, -0.2);
    leftScreenFrame.rotation.y = Math.PI / 5;
    setupGroup.add(leftScreenFrame);

    const leftDisplayMat = new THREE.MeshBasicMaterial({
      map: leftScreenTexture,
      transparent: false,
    });
    const leftScreenDisplay = new THREE.Mesh(new THREE.PlaneGeometry(1.7, 1.2), leftDisplayMat);
    leftScreenDisplay.position.set(-2.16, 1.05, -0.16);
    leftScreenDisplay.rotation.y = Math.PI / 5;
    setupGroup.add(leftScreenDisplay);

    // 3. DEVELOPER AVATAR / CHARACTER
    const devGroup = new THREE.Group();
    devGroup.position.set(0, 0, 0.8);

    // Ergonomic Chair
    const seatGeo = new THREE.CylinderGeometry(0.7, 0.7, 0.15, 32);
    const chairMat = new THREE.MeshStandardMaterial({ color: 0x181825, roughness: 0.4 });
    const seat = new THREE.Mesh(seatGeo, chairMat);
    seat.position.set(0, -0.5, 0.2);
    devGroup.add(seat);

    const chairBackGeo = new THREE.BoxGeometry(1.1, 1.3, 0.15);
    const chairBack = new THREE.Mesh(chairBackGeo, chairMat);
    chairBack.position.set(0, 0.2, 0.8);
    devGroup.add(chairBack);

    // Developer Torso (Hoodie)
    const bodyGeo = new THREE.CylinderGeometry(0.45, 0.55, 1.1, 16);
    const hoodieMat = new THREE.MeshStandardMaterial({ color: theme.secondary, roughness: 0.6 });
    const body = new THREE.Mesh(bodyGeo, hoodieMat);
    body.position.set(0, 0.2, 0.3);
    devGroup.add(body);

    // Developer Head (Cyber VR Headset)
    const headGeo = new THREE.SphereGeometry(0.35, 32, 32);
    const skinMat = new THREE.MeshStandardMaterial({ color: 0xf43f5e, roughness: 0.3 });
    const head = new THREE.Mesh(headGeo, skinMat);
    head.position.set(0, 0.95, 0.3);
    devGroup.add(head);

    // VR Glasses
    const vrGeo = new THREE.BoxGeometry(0.42, 0.16, 0.22);
    const vrMat = new THREE.MeshStandardMaterial({
      color: theme.primary,
      emissive: theme.primary,
      emissiveIntensity: 0.9,
      roughness: 0.1,
    });
    const vrGoggles = new THREE.Mesh(vrGeo, vrMat);
    vrGoggles.position.set(0, 0.98, 0.08);
    devGroup.add(vrGoggles);

    // Typing Arms
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

    // 4. MECHANICAL RGB KEYBOARD
    const kbGeo = new THREE.BoxGeometry(1.4, 0.06, 0.5);
    const kbMat = new THREE.MeshStandardMaterial({ color: 0x11111b, roughness: 0.2 });
    const keyboard = new THREE.Mesh(kbGeo, kbMat);
    keyboard.position.set(0, 0.03, 0.3);
    setupGroup.add(keyboard);

    // RGB Underglow Light
    const kbLight = new THREE.PointLight(theme.primary, 2, 2);
    kbLight.position.set(0, 0.1, 0.3);
    setupGroup.add(kbLight);

    // 5. DEV DESK ACCESSORIES
    // Steaming Coffee Mug
    const mugGeo = new THREE.CylinderGeometry(0.12, 0.12, 0.28, 16);
    const mugMat = new THREE.MeshStandardMaterial({ color: 0xf43f5e, roughness: 0.3 });
    const mug = new THREE.Mesh(mugGeo, mugMat);
    mug.position.set(1.4, 0.14, 0.2);
    setupGroup.add(mug);

    // Steam Particles
    const steamGeo = new THREE.BufferGeometry();
    const steamCount = 15;
    const steamPos = new Float32Array(steamCount * 3);
    for (let i = 0; i < steamCount * 3; i += 3) {
      steamPos[i] = 1.4 + (Math.random() - 0.5) * 0.1;
      steamPos[i + 1] = 0.3 + Math.random() * 0.4;
      steamPos[i + 2] = 0.2 + (Math.random() - 0.5) * 0.1;
    }
    steamGeo.setAttribute('position', new THREE.BufferAttribute(steamPos, 3));
    const steamMat = new THREE.PointsMaterial({
      size: 0.04,
      color: 0xffffff,
      transparent: true,
      opacity: 0.4,
    });
    const steamParticles = new THREE.Points(steamGeo, steamMat);
    setupGroup.add(steamParticles);

    // RGB PC Chassis
    const pcGeo = new THREE.BoxGeometry(0.7, 1.4, 1.2);
    const pcMat = new THREE.MeshStandardMaterial({ color: 0x09090d, roughness: 0.2, metalness: 0.8 });
    const pcTower = new THREE.Mesh(pcGeo, pcMat);
    pcTower.position.set(1.8, 0.7, -0.4);
    setupGroup.add(pcTower);

    // PC Fan LED Light
    const pcFanLight = new THREE.PointLight(theme.secondary, 3, 3);
    pcFanLight.position.set(1.8, 0.7, -0.1);
    setupGroup.add(pcFanLight);

    // 6. FLOATING MATRIX / CODE PARTICLE RAIN
    const particleCount = 150;
    const particleGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount * 3; i += 3) {
      positions[i] = (Math.random() - 0.5) * 10;
      positions[i + 1] = Math.random() * 6;
      positions[i + 2] = (Math.random() - 0.5) * 8;
    }
    particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const particleMat = new THREE.PointsMaterial({
      size: 0.06,
      color: theme.screenGlow,
      transparent: true,
      opacity: 0.75,
    });
    const particlePoints = new THREE.Points(particleGeo, particleMat);
    scene.add(particlePoints);

    // LIGHTING
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.65);
    scene.add(ambientLight);

    const screenGlowLight = new THREE.PointLight(theme.screenGlow, 4, 6);
    screenGlowLight.position.set(0, 1.15, -0.2);
    scene.add(screenGlowLight);

    const topLight = new THREE.PointLight(theme.primary, 3, 10);
    topLight.position.set(0, 4, 2);
    scene.add(topLight);

    // Mouse Drag Controls
    let mouseX = 0;
    let mouseY = 0;
    let isMouseDown = false;
    let prevMousePos = { x: 0, y: 0 };

    const handleMouseMove = (e) => {
      const rect = container.getBoundingClientRect();
      const x = e.clientX - rect.left - width / 2;
      const y = e.clientY - rect.top - height / 2;

      if (isMouseDown) {
        const deltaX = e.clientX - prevMousePos.x;
        const deltaY = e.clientY - prevMousePos.y;
        setupGroup.rotation.y += deltaX * 0.008;
        setupGroup.rotation.x += deltaY * 0.008;
        prevMousePos = { x: e.clientX, y: e.clientY };
      } else {
        mouseX = (x / width) * 2;
        mouseY = -(y / height) * 2;
      }
    };

    const handleMouseDown = (e) => {
      isMouseDown = true;
      prevMousePos = { x: e.clientX, y: e.clientY };
    };

    const handleMouseUp = () => {
      isMouseDown = false;
    };

    container.addEventListener('mousemove', handleMouseMove);
    container.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);

    // Animation Loop
    let animationId;
    let clock = new THREE.Clock();
    let cursorTimer = 0;
    let cursorVisible = true;

    const animate = () => {
      animationId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Blinking Cursor Timer
      cursorTimer += 0.016;
      if (cursorTimer > 0.4) {
        cursorTimer = 0;
        cursorVisible = !cursorVisible;
        centerScreenTexture.drawIDE(0, cursorVisible);
        centerScreenTexture.needsUpdate = true;
      }

      // Continuous typing motion
      if (!isMouseDown) {
        setupGroup.rotation.y = Math.sin(elapsedTime * 0.5) * 0.12 + mouseX * 0.2;
        setupGroup.rotation.x = Math.cos(elapsedTime * 0.3) * 0.05 + mouseY * 0.1;
      }

      // Arm typing vibrations
      leftArm.rotation.x = -Math.PI / 4 + Math.sin(elapsedTime * 15) * 0.03;
      rightArm.rotation.x = -Math.PI / 4 + Math.cos(elapsedTime * 15) * 0.03;

      // Steam floating up
      const positionsArr = steamGeo.attributes.position.array;
      for (let i = 1; i < steamCount * 3; i += 3) {
        positionsArr[i] += 0.004;
        if (positionsArr[i] > 0.8) positionsArr[i] = 0.3;
      }
      steamGeo.attributes.position.needsUpdate = true;

      // Falling code particles
      const rainArr = particleGeo.attributes.position.array;
      for (let i = 1; i < particleCount * 3; i += 3) {
        rainArr[i] -= 0.02;
        if (rainArr[i] < 0) rainArr[i] = 6;
      }
      particleGeo.attributes.position.needsUpdate = true;

      // Pulse PC fan light & glow
      pcFanLight.intensity = 2 + Math.sin(elapsedTime * 4) * 1.5;
      screenGlowLight.intensity = 3.5 + Math.cos(elapsedTime * 8) * 0.8;

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationId);
      container.removeEventListener('mousemove', handleMouseMove);
      container.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      centerScreenTexture.dispose();
      leftScreenTexture.dispose();
      renderer.dispose();
    };
  }, [isModal, themeMode]);

  return (
    <div
      ref={mountRef}
      className="relative w-full h-full flex items-center justify-center cursor-grab active:cursor-grabbing select-none"
    />
  );
};

export default DeveloperSetup3DCanvas;
