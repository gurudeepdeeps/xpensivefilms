import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

const Maintenance3DCanvas = ({ isModal = false, colorMode = 'neon' }) => {
  const mountRef = useRef(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // Dimensions
    const width = container.clientWidth || (isModal ? 600 : 400);
    const height = container.clientHeight || (isModal ? 450 : 400);

    // Scene
    const scene = new THREE.Scene();

    // Camera
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.z = isModal ? 6 : 5;

    // Renderer
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // Color Theme Palette
    const getColors = () => {
      if (colorMode === 'gold') return { primary: 0xf59e0b, secondary: 0xd97706, glow: 0xfef08a };
      if (colorMode === 'red') return { primary: 0xef4444, secondary: 0x991b1b, glow: 0xfca5a5 };
      return { primary: 0xff2a5f, secondary: 0x6366f1, glow: 0x38bdf8 }; // neon
    };
    const colors = getColors();

    // Central 3D Aperture / Orb Object Group
    const mainGroup = new THREE.Group();
    scene.add(mainGroup);

    // 1. Inner Core Glowing Icosahedron
    const coreGeo = new THREE.IcosahedronGeometry(0.9, 2);
    const coreMat = new THREE.MeshStandardMaterial({
      color: colors.primary,
      wireframe: false,
      roughness: 0.2,
      metalness: 0.8,
      emissive: colors.primary,
      emissiveIntensity: 0.6,
    });
    const coreMesh = new THREE.Mesh(coreGeo, coreMat);
    mainGroup.add(coreMesh);

    // 2. Wireframe Outer Shell
    const shellGeo = new THREE.IcosahedronGeometry(1.3, 1);
    const shellMat = new THREE.MeshBasicMaterial({
      color: colors.glow,
      wireframe: true,
      transparent: true,
      opacity: 0.35,
    });
    const shellMesh = new THREE.Mesh(shellGeo, shellMat);
    mainGroup.add(shellMesh);

    // 3. Rotating Outer Aperture Rings
    const ring1Geo = new THREE.TorusGeometry(1.7, 0.03, 16, 100);
    const ringMat1 = new THREE.MeshStandardMaterial({
      color: colors.secondary,
      metalness: 0.9,
      roughness: 0.1,
    });
    const ring1 = new THREE.Mesh(ring1Geo, ringMat1);
    ring1.rotation.x = Math.PI / 3;
    mainGroup.add(ring1);

    const ring2Geo = new THREE.TorusGeometry(2.1, 0.02, 16, 100);
    const ringMat2 = new THREE.MeshStandardMaterial({
      color: colors.glow,
      metalness: 0.9,
      roughness: 0.1,
    });
    const ring2 = new THREE.Mesh(ring2Geo, ringMat2);
    ring2.rotation.y = Math.PI / 4;
    mainGroup.add(ring2);

    const ring3Geo = new THREE.TorusGeometry(2.5, 0.015, 16, 100);
    const ringMat3 = new THREE.MeshBasicMaterial({
      color: colors.primary,
      wireframe: true,
      transparent: true,
      opacity: 0.5,
    });
    const ring3 = new THREE.Mesh(ring3Geo, ringMat3);
    ring3.rotation.x = -Math.PI / 4;
    mainGroup.add(ring3);

    // 4. Floating Particles Field
    const particleCount = isModal ? 120 : 80;
    const particleGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount * 3; i += 3) {
      positions[i] = (Math.random() - 0.5) * 12;
      positions[i + 1] = (Math.random() - 0.5) * 12;
      positions[i + 2] = (Math.random() - 0.5) * 12;
    }
    particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const particleMat = new THREE.PointsMaterial({
      size: 0.05,
      color: colors.glow,
      transparent: true,
      opacity: 0.8,
    });
    const particlePoints = new THREE.Points(particleGeo, particleMat);
    scene.add(particlePoints);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);

    const pointLight1 = new THREE.PointLight(colors.primary, 3, 20);
    pointLight1.position.set(4, 4, 4);
    scene.add(pointLight1);

    const pointLight2 = new THREE.PointLight(colors.secondary, 3, 20);
    pointLight2.position.set(-4, -4, -2);
    scene.add(pointLight2);

    // Interaction mouse variables
    let mouseX = 0;
    let mouseY = 0;
    let targetRotationX = 0;
    let targetRotationY = 0;

    let isMouseDown = false;
    let prevMousePos = { x: 0, y: 0 };

    const handleMouseMove = (e) => {
      const rect = container.getBoundingClientRect();
      const x = e.clientX - rect.left - width / 2;
      const y = e.clientY - rect.top - height / 2;

      if (isModal && isMouseDown) {
        const deltaX = e.clientX - prevMousePos.x;
        const deltaY = e.clientY - prevMousePos.y;
        mainGroup.rotation.y += deltaX * 0.01;
        mainGroup.rotation.x += deltaY * 0.01;
        prevMousePos = { x: e.clientX, y: e.clientY };
      } else {
        mouseX = (x / width) * 2;
        mouseY = -(y / height) * 2;
      }
    };

    const handleMouseDown = (e) => {
      if (isModal) {
        isMouseDown = true;
        prevMousePos = { x: e.clientX, y: e.clientY };
      }
    };

    const handleMouseUp = () => {
      if (isModal) isMouseDown = false;
    };

    const domTarget = isModal ? container : window;
    domTarget.addEventListener('mousemove', handleMouseMove);
    if (isModal) {
      container.addEventListener('mousedown', handleMouseDown);
      window.addEventListener('mouseup', handleMouseUp);
    }

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
    let animationFrameId;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Continuous Idle Rotations
      if (!isMouseDown) {
        targetRotationY = mouseX * 0.5;
        targetRotationX = mouseY * 0.5;
        mainGroup.rotation.y += 0.005 + (targetRotationY - mainGroup.rotation.y) * 0.05;
        mainGroup.rotation.x += 0.003 + (targetRotationX - mainGroup.rotation.x) * 0.05;
      }

      coreMesh.rotation.y = elapsedTime * 0.4;
      coreMesh.rotation.z = elapsedTime * 0.2;
      shellMesh.rotation.y = -elapsedTime * 0.2;
      ring1.rotation.z = elapsedTime * 0.5;
      ring2.rotation.z = -elapsedTime * 0.3;
      ring3.rotation.y = elapsedTime * 0.6;
      particlePoints.rotation.y = elapsedTime * 0.05;

      // Pulse core brightness slightly
      coreMat.emissiveIntensity = 0.5 + Math.sin(elapsedTime * 3) * 0.2;

      renderer.render(scene, camera);
    };

    animate();

    // Cleanup
    return () => {
      cancelAnimationFrame(animationFrameId);
      domTarget.removeEventListener('mousemove', handleMouseMove);
      if (isModal) {
        container.removeEventListener('mousedown', handleMouseDown);
        window.removeEventListener('mouseup', handleMouseUp);
      }
      window.removeEventListener('resize', handleResize);
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [isModal, colorMode]);

  return (
    <div
      ref={mountRef}
      className={`relative w-full h-full flex items-center justify-center ${
        isModal ? 'cursor-grab active:cursor-grabbing' : ''
      }`}
    />
  );
};

export default Maintenance3DCanvas;
