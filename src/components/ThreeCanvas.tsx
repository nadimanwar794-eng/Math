import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { CubeCutParams, MiniCubeData, ShapeParams } from '../types';
import { generateMiniCubes } from '../utils/mathFormulas';

interface ThreeCanvasProps {
  mode: 'shape' | 'cube_cutting' | 'dice';
  shapeParams?: ShapeParams;
  cubeCutParams?: CubeCutParams;
  diceParams?: {
    diceValues: [number, number, number, number, number, number]; // [top, bottom, front, back, left, right]
    isUnfolded: boolean;
    unfoldProgress: number; // 0 to 1
  };
  selectedCube?: MiniCubeData | null;
  onSelectMiniCube?: (cube: MiniCubeData | null) => void;
  language?: 'hi' | 'en';
}

export const ThreeCanvas: React.FC<ThreeCanvasProps> = ({
  mode,
  shapeParams,
  cubeCutParams,
  diceParams,
  selectedCube,
  onSelectMiniCube,
  language = 'hi',
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const mainGroupRef = useRef<THREE.Group | null>(null);
  const meshMapRef = useRef<Map<string, { mesh: THREE.Mesh; data: MiniCubeData }>>(new Map());
  const hoveredMeshRef = useRef<THREE.Mesh | null>(null);

  const [isRotating, setIsRotating] = useState(false);
  const isRotatingRef = useRef(false);
  isRotatingRef.current = isRotating;

  // Track mouse drag for orbit
  const isDraggingRef = useRef(false);
  const previousMousePositionRef = useRef({ x: 0, y: 0 });
  const cameraSphericalRef = useRef({ radius: 14, theta: Math.PI / 4, phi: Math.PI / 3 });

  // Initialize Scene, Camera, Renderer
  useEffect(() => {
    if (!mountRef.current) return;

    const width = mountRef.current.clientWidth || 500;
    const height = mountRef.current.clientHeight || 450;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#030712'); // Deep slate/black
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    rendererRef.current = renderer;

    mountRef.current.replaceChildren(renderer.domElement);

    // Grid Helper
    const gridHelper = new THREE.GridHelper(20, 20, 0x3b82f6, 0x1e293b);
    gridHelper.position.y = -4;
    scene.add(gridHelper);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.85);
    scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight(0xffffff, 1.2);
    dirLight1.position.set(12, 18, 15);
    dirLight1.castShadow = true;
    dirLight1.shadow.mapSize.width = 1024;
    dirLight1.shadow.mapSize.height = 1024;
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0x60a5fa, 0.6);
    dirLight2.position.set(-10, -8, -10);
    scene.add(dirLight2);

    const pointLight = new THREE.PointLight(0xa855f7, 0.8, 30);
    pointLight.position.set(0, 10, 0);
    scene.add(pointLight);

    // Main Group
    const mainGroup = new THREE.Group();
    scene.add(mainGroup);
    mainGroupRef.current = mainGroup;

    // Update Camera position based on spherical coords
    const updateCameraPos = () => {
      const { radius, theta, phi } = cameraSphericalRef.current;
      camera.position.x = radius * Math.sin(phi) * Math.sin(theta);
      camera.position.y = radius * Math.cos(phi);
      camera.position.z = radius * Math.sin(phi) * Math.cos(theta);
      camera.lookAt(0, 0, 0);
    };
    updateCameraPos();

    // Mouse / Touch Handlers for 3D Orbit & Zoom
    const dom = renderer.domElement;

    const onMouseDown = (e: MouseEvent) => {
      isDraggingRef.current = true;
      previousMousePositionRef.current = { x: e.clientX, y: e.clientY };
    };

    const onMouseMove = (e: MouseEvent) => {
      if (isDraggingRef.current) {
        const deltaX = e.clientX - previousMousePositionRef.current.x;
        const deltaY = e.clientY - previousMousePositionRef.current.y;

        cameraSphericalRef.current.theta -= deltaX * 0.008;
        cameraSphericalRef.current.phi = Math.max(
          0.05,
          Math.min(Math.PI - 0.05, cameraSphericalRef.current.phi - deltaY * 0.008)
        );

        updateCameraPos();
        previousMousePositionRef.current = { x: e.clientX, y: e.clientY };
      }
    };

    const onMouseUp = () => {
      isDraggingRef.current = false;
    };

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      cameraSphericalRef.current.radius = Math.max(
        4,
        Math.min(35, cameraSphericalRef.current.radius + e.deltaY * 0.02)
      );
      updateCameraPos();
    };

    // Touch Support
    let touchStartDist = 0;
    const onTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        isDraggingRef.current = true;
        previousMousePositionRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      } else if (e.touches.length === 2) {
        const dx = e.touches[0].clientX - e.touches[1].clientX;
        const dy = e.touches[0].clientY - e.touches[1].clientY;
        touchStartDist = Math.sqrt(dx * dx + dy * dy);
      }
    };

    const onTouchMove = (e: TouchEvent) => {
      if (e.touches.length === 1 && isDraggingRef.current) {
        const deltaX = e.touches[0].clientX - previousMousePositionRef.current.x;
        const deltaY = e.touches[0].clientY - previousMousePositionRef.current.y;

        cameraSphericalRef.current.theta -= deltaX * 0.01;
        cameraSphericalRef.current.phi = Math.max(
          0.05,
          Math.min(Math.PI - 0.05, cameraSphericalRef.current.phi - deltaY * 0.01)
        );

        updateCameraPos();
        previousMousePositionRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      } else if (e.touches.length === 2 && touchStartDist > 0) {
        const dx = e.touches[0].clientX - e.touches[1].clientX;
        const dy = e.touches[0].clientY - e.touches[1].clientY;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const factor = (touchStartDist - dist) * 0.05;
        cameraSphericalRef.current.radius = Math.max(4, Math.min(35, cameraSphericalRef.current.radius + factor));
        updateCameraPos();
        touchStartDist = dist;
      }
    };

    const onTouchEnd = () => {
      isDraggingRef.current = false;
      touchStartDist = 0;
    };

    dom.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    dom.addEventListener('wheel', onWheel, { passive: false });
    dom.addEventListener('touchstart', onTouchStart);
    dom.addEventListener('touchmove', onTouchMove);
    dom.addEventListener('touchend', onTouchEnd);

    // Raycasting for mini-cube click
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const onClick = (e: MouseEvent) => {
      const rect = dom.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(mainGroup.children, true);

      if (intersects.length > 0) {
        const hit = intersects[0].object as THREE.Mesh;
        const match = Array.from(meshMapRef.current.entries()).find(([, item]) => item.mesh === hit);
        if (match && onSelectMiniCube) {
          onSelectMiniCube(match[1].data);
        }
      }
    };

    dom.addEventListener('click', onClick);

    // Resize Observer
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const w = entry.contentRect.width;
        const h = entry.contentRect.height;
        if (w > 0 && h > 0 && cameraRef.current && rendererRef.current) {
          cameraRef.current.aspect = w / h;
          cameraRef.current.updateProjectionMatrix();
          rendererRef.current.setSize(w, h);
        }
      }
    });
    resizeObserver.observe(mountRef.current);

    // Animation Render Loop
    let animationFrameId: number;
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      if (isRotatingRef.current && mainGroupRef.current) {
        mainGroupRef.current.rotation.y += 0.008;
      }

      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      resizeObserver.disconnect();
      dom.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      dom.removeEventListener('wheel', onWheel);
      dom.removeEventListener('touchstart', onTouchStart);
      dom.removeEventListener('touchmove', onTouchMove);
      dom.removeEventListener('touchend', onTouchEnd);
      dom.removeEventListener('click', onClick);
      renderer.dispose();
    };
  }, []);

  // Update 3D Objects when parameters change
  useEffect(() => {
    const mainGroup = mainGroupRef.current;
    if (!mainGroup) return;

    // Clear existing objects
    while (mainGroup.children.length > 0) {
      const obj = mainGroup.children[0];
      mainGroup.remove(obj);
      if ((obj as THREE.Mesh).geometry) (obj as THREE.Mesh).geometry.dispose();
    }
    meshMapRef.current.clear();

    if (mode === 'shape' && shapeParams) {
      renderMathShape(mainGroup, shapeParams);
    } else if (mode === 'cube_cutting' && cubeCutParams) {
      renderCubeCutting(mainGroup, cubeCutParams, selectedCube, meshMapRef);
    } else if (mode === 'dice' && diceParams) {
      renderDiceScene(mainGroup, diceParams);
    }
  }, [mode, shapeParams, cubeCutParams, diceParams, selectedCube]);

  return (
    <div className="relative w-full h-full min-h-[380px] sm:min-h-[460px] rounded-2xl overflow-hidden border border-slate-800 bg-slate-950 shadow-2xl flex flex-col">
      {/* 3D WebGL Canvas Container */}
      <div ref={mountRef} className="w-full h-full flex-1 cursor-grab active:cursor-grabbing" />

      {/* Floating Control Overlay */}
      <div className="absolute top-3 left-3 flex flex-wrap items-center gap-2 pointer-events-auto">
        <button
          id="btn-toggle-rotation"
          onClick={() => setIsRotating(!isRotating)}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium backdrop-blur-md border transition-all flex items-center gap-1.5 ${
            isRotating
              ? 'bg-indigo-600/80 border-indigo-400 text-white shadow-lg shadow-indigo-500/20'
              : 'bg-slate-900/80 border-slate-700 text-slate-300 hover:bg-slate-800'
          }`}
        >
          <span className={`inline-block w-2 h-2 rounded-full ${isRotating ? 'bg-emerald-400 animate-pulse' : 'bg-slate-500'}`} />
          {isRotating ? (language === 'hi' ? 'घूर्णन रोकें' : 'Stop Auto-Rotate') : (language === 'hi' ? '3D घूर्णन शुरू' : 'Auto Rotate')}
        </button>

        <button
          id="btn-reset-camera"
          onClick={() => {
            if (cameraRef.current) {
              cameraSphericalRef.current = { radius: 14, theta: Math.PI / 4, phi: Math.PI / 3 };
              const { radius, theta, phi } = cameraSphericalRef.current;
              cameraRef.current.position.x = radius * Math.sin(phi) * Math.sin(theta);
              cameraRef.current.position.y = radius * Math.cos(phi);
              cameraRef.current.position.z = radius * Math.sin(phi) * Math.cos(theta);
              cameraRef.current.lookAt(0, 0, 0);
              if (mainGroupRef.current) {
                mainGroupRef.current.rotation.set(0, 0, 0);
              }
            }
          }}
          className="px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-900/80 hover:bg-slate-800 border border-slate-700 text-slate-300 backdrop-blur-md transition-all"
        >
          {language === 'hi' ? 'कैमरा रीसेट' : 'Reset View'}
        </button>

        {/* Quick Zoom Buttons */}
        <div className="flex items-center rounded-lg bg-slate-900/80 border border-slate-700 backdrop-blur-md overflow-hidden">
          <button
            title="Zoom In"
            onClick={() => {
              cameraSphericalRef.current.radius = Math.max(4, cameraSphericalRef.current.radius - 2);
              if (cameraRef.current) {
                const { radius, theta, phi } = cameraSphericalRef.current;
                cameraRef.current.position.x = radius * Math.sin(phi) * Math.sin(theta);
                cameraRef.current.position.y = radius * Math.cos(phi);
                cameraRef.current.position.z = radius * Math.sin(phi) * Math.cos(theta);
                cameraRef.current.lookAt(0, 0, 0);
              }
            }}
            className="px-2.5 py-1.5 text-xs text-slate-300 hover:text-white hover:bg-slate-800 border-r border-slate-700 font-bold"
          >
            +
          </button>
          <button
            title="Zoom Out"
            onClick={() => {
              cameraSphericalRef.current.radius = Math.min(35, cameraSphericalRef.current.radius + 2);
              if (cameraRef.current) {
                const { radius, theta, phi } = cameraSphericalRef.current;
                cameraRef.current.position.x = radius * Math.sin(phi) * Math.sin(theta);
                cameraRef.current.position.y = radius * Math.cos(phi);
                cameraRef.current.position.z = radius * Math.sin(phi) * Math.cos(theta);
                cameraRef.current.lookAt(0, 0, 0);
              }
            }}
            className="px-2.5 py-1.5 text-xs text-slate-300 hover:text-white hover:bg-slate-800 font-bold"
          >
            -
          </button>
        </div>

        {mode === 'shape' && (shapeParams?.explodedParts || 0) > 0 && (
          <span className="px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/40 backdrop-blur-md animate-pulse">
            {language === 'hi' ? '⚡ अलग-अलग भाग दृश्य (Exploded 3D)' : '⚡ Exploded Parts 3D'}
          </span>
        )}
      </div>

      {/* Interactive Helper Legend & Tips */}
      <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between pointer-events-none text-[11px] text-slate-400 bg-slate-900/60 backdrop-blur-md px-3 py-1.5 rounded-lg border border-slate-800/80">
        <span className="flex items-center gap-1.5">
          <span className="text-indigo-400 font-semibold">🖱️ Drag:</span> {language === 'hi' ? 'घुमाएं (Rotate)' : 'Rotate'} | <span className="text-indigo-400 font-semibold">Scroll:</span> {language === 'hi' ? 'ज़ूम (Zoom)' : 'Zoom'}
        </span>
        {mode === 'cube_cutting' && (
          <span className="text-amber-400 font-medium hidden sm:inline">
            {language === 'hi' ? '👆 किसी भी टुकड़े पर क्लिक करके जांचें' : '👆 Click any mini-cube to inspect'}
          </span>
        )}
      </div>
    </div>
  );
};

// ============================================================================
// Canvas Text Sprite for 3D Annotations
// ============================================================================
function createTextSprite(text: string, bgColor: string = '#0f172a', textColor: string = '#38bdf8'): THREE.Sprite {
  const canvas = document.createElement('canvas');
  canvas.width = 400;
  canvas.height = 100;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    ctx.fillStyle = bgColor;
    ctx.strokeStyle = '#475569';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.roundRect(8, 8, 384, 84, 18);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = textColor;
    ctx.font = 'bold 24px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(text, 200, 50);
  }
  const texture = new THREE.CanvasTexture(canvas);
  texture.minFilter = THREE.LinearFilter;
  const spriteMaterial = new THREE.SpriteMaterial({ map: texture, transparent: true, depthTest: false });
  const sprite = new THREE.Sprite(spriteMaterial);
  sprite.scale.set(3.4, 0.85, 1);
  return sprite;
}

// ============================================================================
// Shape 3D Renderer (Belan, Sanku, Ghan, Ghanabh, Gola, Ardhgola, Chhinnak)
// With Full Exploded Parts / Deconstruction Support
// ============================================================================
function renderMathShape(group: THREE.Group, params: ShapeParams) {
  const {
    type,
    radius,
    radiusOuter = 5,
    radiusTop = 0,
    height,
    length,
    width,
    color,
    wireframe,
    transparent,
    opacity,
    explodedParts = 0,
    showLabels = true,
    unrollNet = false,
  } = params;

  const baseMaterial = new THREE.MeshStandardMaterial({
    color: color || '#3b82f6',
    wireframe: wireframe,
    transparent: transparent,
    opacity: transparent ? opacity : 1,
    roughness: 0.25,
    metalness: 0.2,
    side: THREE.DoubleSide,
  });

  const edgeMaterial = new THREE.LineBasicMaterial({ color: 0xffffff, linewidth: 2, transparent: true, opacity: 0.6 });

  // Auto-scale normalization so large user values (e.g. radius 100, length 500) fit comfortably in view
  const maxDim = Math.max(
    radius || 1,
    radiusOuter || 1,
    height || 1,
    length || 1,
    width || 1
  );
  const scale = maxDim > 8 ? 6 / maxDim : 1;

  const sRadius = (radius || 1) * scale;
  const sRadiusOuter = (radiusOuter || radius * 1.5 || 1.5) * scale;
  const sRadiusTop = (radiusTop || 0.1) * scale;
  const sHeight = (height || 1) * scale;
  const sLength = (length || 1) * scale;
  const sWidth = (width || 1) * scale;

  const isExploded = explodedParts > 0.01;
  const explodeDist = explodedParts * 2.8;

  // --------------------------------------------------------------------------
  // 1. CYLINDER (बेलन) - Exploded: Top circular lid, Bottom circular lid, Curved Surface
  // --------------------------------------------------------------------------
  if (type === 'cylinder' && isExploded) {
    const lidHeight = Math.max(0.08, sHeight * 0.05);

    // Top Lid (ऊपरी वृत्ताकार सिरा: π r²)
    const topGeom = new THREE.CylinderGeometry(sRadius, sRadius, lidHeight, 48);
    const topMat = new THREE.MeshStandardMaterial({
      color: '#10b981', // emerald
      wireframe,
      transparent,
      opacity: transparent ? opacity : 0.95,
      roughness: 0.3,
      metalness: 0.2,
    });
    const topMesh = new THREE.Mesh(topGeom, topMat);
    const topY = sHeight / 2 + explodeDist + lidHeight / 2;
    topMesh.position.y = topY;
    topMesh.castShadow = true;
    group.add(topMesh);
    group.add(new THREE.LineSegments(new THREE.EdgesGeometry(topGeom), edgeMaterial).translateY(topY));

    // Bottom Lid (निचला वृत्ताकार सिरा: π r²)
    const botGeom = new THREE.CylinderGeometry(sRadius, sRadius, lidHeight, 48);
    const botMat = new THREE.MeshStandardMaterial({
      color: '#06b6d4', // cyan
      wireframe,
      transparent,
      opacity: transparent ? opacity : 0.95,
      roughness: 0.3,
      metalness: 0.2,
    });
    const botMesh = new THREE.Mesh(botGeom, botMat);
    const botY = -sHeight / 2 - explodeDist - lidHeight / 2;
    botMesh.position.y = botY;
    botMesh.castShadow = true;
    group.add(botMesh);
    group.add(new THREE.LineSegments(new THREE.EdgesGeometry(botGeom), edgeMaterial).translateY(botY));

    // Curved Surface (वक्र पृष्ठ: 2πrh)
    if (unrollNet) {
      // Unrolled into flat rectangular sheet
      const rectWidth = 2 * Math.PI * sRadius;
      const rectGeom = new THREE.PlaneGeometry(rectWidth, sHeight, 32, 16);
      const rectMat = new THREE.MeshStandardMaterial({
        color: color || '#3b82f6',
        side: THREE.DoubleSide,
        wireframe,
        transparent,
        opacity: transparent ? opacity : 0.9,
      });
      const rectMesh = new THREE.Mesh(rectGeom, rectMat);
      rectMesh.position.z = sRadius + explodeDist * 0.4;
      group.add(rectMesh);
      group.add(new THREE.LineSegments(new THREE.EdgesGeometry(rectGeom), edgeMaterial).translateZ(rectMesh.position.z));
    } else {
      // Open hollow mantle tube
      const mantleGeom = new THREE.CylinderGeometry(sRadius, sRadius, sHeight, 48, 16, true);
      const mantleMat = new THREE.MeshStandardMaterial({
        color: color || '#3b82f6',
        wireframe,
        transparent,
        opacity: transparent ? opacity : 0.9,
        roughness: 0.25,
        metalness: 0.2,
        side: THREE.DoubleSide,
      });
      const mantleMesh = new THREE.Mesh(mantleGeom, mantleMat);
      mantleMesh.castShadow = true;
      group.add(mantleMesh);
      group.add(new THREE.LineSegments(new THREE.EdgesGeometry(mantleGeom), edgeMaterial));
    }

    if (showLabels) {
      const topSprite = createTextSprite('ऊपरी सिरा (Top: π r²)', '#064e3b', '#34d399');
      topSprite.position.set(0, topY + 0.8, 0);
      group.add(topSprite);

      const midSprite = createTextSprite(
        unrollNet ? 'खुला वक्र पृष्ठ (2πr × h)' : 'वक्र पृष्ठ (CSA: 2πrh)',
        '#1e1b4b',
        '#818cf8'
      );
      midSprite.position.set(0, 0, sRadius + 1.2);
      group.add(midSprite);

      const botSprite = createTextSprite('निचला सिरा (Base: π r²)', '#083344', '#22d3ee');
      botSprite.position.set(0, botY - 0.8, 0);
      group.add(botSprite);
    }
    return;
  }

  // --------------------------------------------------------------------------
  // 2. HOLLOW CYLINDER (खोखला बेलन / पाइप) - Exploded
  // --------------------------------------------------------------------------
  if (type === 'hollow_cylinder' && isExploded) {
    const ringHeight = Math.max(0.08, sHeight * 0.05);

    // Helper to build 2D ring geometry
    const makeRingGeom = () => {
      const arcShape = new THREE.Shape();
      arcShape.absarc(0, 0, sRadiusOuter, 0, Math.PI * 2, false);
      const holePath = new THREE.Path();
      holePath.absarc(0, 0, sRadius, 0, Math.PI * 2, true);
      arcShape.holes.push(holePath);
      const extrudeSettings = { depth: ringHeight, bevelEnabled: false, curveSegments: 48 };
      const g = new THREE.ExtrudeGeometry(arcShape, extrudeSettings);
      g.center();
      g.rotateX(Math.PI / 2);
      return g;
    };

    // Top Ring
    const topRingGeom = makeRingGeom();
    const topRingMat = new THREE.MeshStandardMaterial({ color: '#10b981', side: THREE.DoubleSide });
    const topRingMesh = new THREE.Mesh(topRingGeom, topRingMat);
    const topY = sHeight / 2 + explodeDist;
    topRingMesh.position.y = topY;
    group.add(topRingMesh);
    group.add(new THREE.LineSegments(new THREE.EdgesGeometry(topRingGeom), edgeMaterial).translateY(topY));

    // Bottom Ring
    const botRingGeom = makeRingGeom();
    const botRingMat = new THREE.MeshStandardMaterial({ color: '#06b6d4', side: THREE.DoubleSide });
    const botRingMesh = new THREE.Mesh(botRingGeom, botRingMat);
    const botY = -sHeight / 2 - explodeDist;
    botRingMesh.position.y = botY;
    group.add(botRingMesh);
    group.add(new THREE.LineSegments(new THREE.EdgesGeometry(botRingGeom), edgeMaterial).translateY(botY));

    // Outer Tube
    const outerGeom = new THREE.CylinderGeometry(sRadiusOuter, sRadiusOuter, sHeight, 48, 16, true);
    const outerMat = new THREE.MeshStandardMaterial({ color: color || '#3b82f6', side: THREE.DoubleSide, opacity: 0.85, transparent: true });
    const outerMesh = new THREE.Mesh(outerGeom, outerMat);
    group.add(outerMesh);
    group.add(new THREE.LineSegments(new THREE.EdgesGeometry(outerGeom), edgeMaterial));

    // Inner Tube
    const innerGeom = new THREE.CylinderGeometry(sRadius, sRadius, sHeight, 48, 16, true);
    const innerMat = new THREE.MeshStandardMaterial({ color: '#f59e0b', side: THREE.DoubleSide, opacity: 0.9, transparent: true });
    const innerMesh = new THREE.Mesh(innerGeom, innerMat);
    group.add(innerMesh);
    group.add(new THREE.LineSegments(new THREE.EdgesGeometry(innerGeom), edgeMaterial));

    if (showLabels) {
      const topSprite = createTextSprite('ऊपरी वलय π(R² - r²)', '#064e3b', '#34d399');
      topSprite.position.set(0, topY + 0.8, 0);
      group.add(topSprite);

      const outSprite = createTextSprite('बाह्य वक्र पृष्ठ (2πRh)', '#1e1b4b', '#818cf8');
      outSprite.position.set(0, 0, sRadiusOuter + 1.2);
      group.add(outSprite);

      const botSprite = createTextSprite('निचला वलय π(R² - r²)', '#083344', '#22d3ee');
      botSprite.position.set(0, botY - 0.8, 0);
      group.add(botSprite);
    }
    return;
  }

  // --------------------------------------------------------------------------
  // 3. CONE (शंकु) - Exploded: Base Circle & Conical Curved Surface
  // --------------------------------------------------------------------------
  if (type === 'cone' && isExploded) {
    const lidHeight = Math.max(0.08, sHeight * 0.05);

    // Conical mantle (no base)
    const coneGeom = new THREE.ConeGeometry(sRadius, sHeight, 48, 16, true);
    const coneMat = new THREE.MeshStandardMaterial({ color: color || '#f59e0b', side: THREE.DoubleSide });
    const coneMesh = new THREE.Mesh(coneGeom, coneMat);
    const coneY = explodeDist * 0.8;
    coneMesh.position.y = coneY;
    group.add(coneMesh);
    group.add(new THREE.LineSegments(new THREE.EdgesGeometry(coneGeom), edgeMaterial).translateY(coneY));

    // Base Disc
    const baseGeom = new THREE.CylinderGeometry(sRadius, sRadius, lidHeight, 48);
    const baseMat = new THREE.MeshStandardMaterial({ color: '#10b981' });
    const baseMesh = new THREE.Mesh(baseGeom, baseMat);
    const baseY = -sHeight / 2 - explodeDist - lidHeight / 2;
    baseMesh.position.y = baseY;
    group.add(baseMesh);
    group.add(new THREE.LineSegments(new THREE.EdgesGeometry(baseGeom), edgeMaterial).translateY(baseY));

    if (showLabels) {
      const topSprite = createTextSprite('वक्र पृष्ठ (CSA: πrl)', '#451a03', '#fbbf24');
      topSprite.position.set(0, coneY + sHeight / 2 + 0.8, 0);
      group.add(topSprite);

      const botSprite = createTextSprite('आधार वृत्त (Base: πr²)', '#064e3b', '#34d399');
      botSprite.position.set(0, baseY - 0.8, 0);
      group.add(botSprite);
    }
    return;
  }

  // --------------------------------------------------------------------------
  // 4. FRUSTUM (छिन्नक / बाल्टी) - Exploded: Top circle, Bottom circle, Slant body
  // --------------------------------------------------------------------------
  if (type === 'frustum' && isExploded) {
    const lidHeight = Math.max(0.08, sHeight * 0.05);

    // Top Circle
    const topGeom = new THREE.CylinderGeometry(sRadiusTop, sRadiusTop, lidHeight, 48);
    const topMat = new THREE.MeshStandardMaterial({ color: '#f97316' });
    const topMesh = new THREE.Mesh(topGeom, topMat);
    const topY = sHeight / 2 + explodeDist + lidHeight / 2;
    topMesh.position.y = topY;
    group.add(topMesh);
    group.add(new THREE.LineSegments(new THREE.EdgesGeometry(topGeom), edgeMaterial).translateY(topY));

    // Bottom Circle
    const botGeom = new THREE.CylinderGeometry(sRadius, sRadius, lidHeight, 48);
    const botMat = new THREE.MeshStandardMaterial({ color: '#10b981' });
    const botMesh = new THREE.Mesh(botGeom, botMat);
    const botY = -sHeight / 2 - explodeDist - lidHeight / 2;
    botMesh.position.y = botY;
    group.add(botMesh);
    group.add(new THREE.LineSegments(new THREE.EdgesGeometry(botGeom), edgeMaterial).translateY(botY));

    // Lateral Mantle
    const bodyGeom = new THREE.CylinderGeometry(sRadiusTop, sRadius, sHeight, 48, 16, true);
    const bodyMat = new THREE.MeshStandardMaterial({ color: color || '#3b82f6', side: THREE.DoubleSide });
    const bodyMesh = new THREE.Mesh(bodyGeom, bodyMat);
    group.add(bodyMesh);
    group.add(new THREE.LineSegments(new THREE.EdgesGeometry(bodyGeom), edgeMaterial));

    if (showLabels) {
      const topSprite = createTextSprite('ऊपरी सिरा (π r₂²)', '#431407', '#fb923c');
      topSprite.position.set(0, topY + 0.8, 0);
      group.add(topSprite);

      const midSprite = createTextSprite('वक्र पृष्ठ π(r₁ + r₂)l', '#1e1b4b', '#818cf8');
      midSprite.position.set(0, 0, sRadius + 1.2);
      group.add(midSprite);

      const botSprite = createTextSprite('निचला सिरा (π r₁²)', '#064e3b', '#34d399');
      botSprite.position.set(0, botY - 0.8, 0);
      group.add(botSprite);
    }
    return;
  }

  // --------------------------------------------------------------------------
  // 5. CUBE & CUBOID (घन व घनाभ) - Exploded 6 Faces Outward
  // --------------------------------------------------------------------------
  if ((type === 'cube' || type === 'cuboid') && isExploded) {
    const l = sLength;
    const h = type === 'cube' ? sLength : sHeight;
    const w = type === 'cube' ? sLength : sWidth;

    const faces = [
      // Top (+Y)
      { geom: new THREE.PlaneGeometry(l, w), pos: [0, h / 2 + explodeDist, 0], rot: [-Math.PI / 2, 0, 0], color: '#10b981', label: type === 'cube' ? 'ऊपर (a²)' : 'ऊपरी फलक (l × b)' },
      // Bottom (-Y)
      { geom: new THREE.PlaneGeometry(l, w), pos: [0, -h / 2 - explodeDist, 0], rot: [Math.PI / 2, 0, 0], color: '#06b6d4', label: type === 'cube' ? 'नीचे (a²)' : 'निचला फलक (l × b)' },
      // Front (+Z)
      { geom: new THREE.PlaneGeometry(l, h), pos: [0, 0, w / 2 + explodeDist], rot: [0, 0, 0], color: '#f59e0b', label: type === 'cube' ? 'सामने (a²)' : 'सामने (l × h)' },
      // Back (-Z)
      { geom: new THREE.PlaneGeometry(l, h), pos: [0, 0, -w / 2 - explodeDist], rot: [0, Math.PI, 0], color: '#ec4899', label: type === 'cube' ? 'पीछे (a²)' : 'पीछे (l × h)' },
      // Right (+X)
      { geom: new THREE.PlaneGeometry(w, h), pos: [l / 2 + explodeDist, 0, 0], rot: [0, Math.PI / 2, 0], color: '#8b5cf6', label: type === 'cube' ? 'दायां (a²)' : 'दायां फलक (b × h)' },
      // Left (-X)
      { geom: new THREE.PlaneGeometry(w, h), pos: [-l / 2 - explodeDist, 0, 0], rot: [0, -Math.PI / 2, 0], color: '#6366f1', label: type === 'cube' ? 'बायां (a²)' : 'बायां फलक (b × h)' },
    ];

    faces.forEach((f) => {
      const mat = new THREE.MeshStandardMaterial({ color: f.color, side: THREE.DoubleSide, roughness: 0.3 });
      const mesh = new THREE.Mesh(f.geom, mat);
      mesh.position.set(f.pos[0], f.pos[1], f.pos[2]);
      mesh.rotation.set(f.rot[0], f.rot[1], f.rot[2]);
      group.add(mesh);
      const edge = new THREE.LineSegments(new THREE.EdgesGeometry(f.geom), edgeMaterial);
      edge.position.set(f.pos[0], f.pos[1], f.pos[2]);
      edge.rotation.set(f.rot[0], f.rot[1], f.rot[2]);
      group.add(edge);

      if (showLabels) {
        const sprite = createTextSprite(f.label, '#0f172a', '#f8fafc');
        sprite.position.set(
          f.pos[0] * 1.25,
          f.pos[1] * 1.25 + (f.pos[1] > 0 ? 0.6 : f.pos[1] < 0 ? -0.6 : 0),
          f.pos[2] * 1.25 + (f.pos[2] > 0 ? 0.6 : f.pos[2] < 0 ? -0.6 : 0)
        );
        group.add(sprite);
      }
    });
    return;
  }

  // --------------------------------------------------------------------------
  // 6. HEMISPHERE (अर्धगोला) - Exploded: Curved Dome & Flat Circular Base
  // --------------------------------------------------------------------------
  if (type === 'hemisphere' && isExploded) {
    // Curved Dome
    const domeGeom = new THREE.SphereGeometry(sRadius, 48, 48, 0, Math.PI * 2, 0, Math.PI / 2);
    const domeMat = new THREE.MeshStandardMaterial({ color: color || '#14b8a6', side: THREE.DoubleSide });
    const domeMesh = new THREE.Mesh(domeGeom, domeMat);
    const domeY = explodeDist * 0.8;
    domeMesh.position.y = domeY;
    group.add(domeMesh);
    group.add(new THREE.LineSegments(new THREE.EdgesGeometry(domeGeom), edgeMaterial).translateY(domeY));

    // Flat Base Circle
    const baseGeom = new THREE.CircleGeometry(sRadius, 48);
    const baseMat = new THREE.MeshStandardMaterial({ color: '#f59e0b', side: THREE.DoubleSide });
    const baseMesh = new THREE.Mesh(baseGeom, baseMat);
    baseMesh.rotation.x = Math.PI / 2;
    const baseY = -explodeDist * 0.8;
    baseMesh.position.y = baseY;
    group.add(baseMesh);
    group.add(new THREE.LineSegments(new THREE.EdgesGeometry(baseGeom), edgeMaterial).translateY(baseY).rotateX(Math.PI / 2));

    if (showLabels) {
      const topSprite = createTextSprite('वक्र पृष्ठ (CSA: 2πr²)', '#042f2e', '#2dd4bf');
      topSprite.position.set(0, domeY + sRadius + 0.6, 0);
      group.add(topSprite);

      const botSprite = createTextSprite('समतल आधार (Base: πr²)', '#451a03', '#fbbf24');
      botSprite.position.set(0, baseY - 0.8, 0);
      group.add(botSprite);
    }
    return;
  }

  // --------------------------------------------------------------------------
  // 7. SPHERE (गोला) - Exploded: 2 Hemispheres + Center Equatorial Slice Plate
  // --------------------------------------------------------------------------
  if (type === 'sphere' && isExploded) {
    // Top Hemisphere
    const topGeom = new THREE.SphereGeometry(sRadius, 48, 48, 0, Math.PI * 2, 0, Math.PI / 2);
    const topMat = new THREE.MeshStandardMaterial({ color: color || '#ec4899', side: THREE.DoubleSide });
    const topMesh = new THREE.Mesh(topGeom, topMat);
    const topY = explodeDist * 0.8;
    topMesh.position.y = topY;
    group.add(topMesh);
    group.add(new THREE.LineSegments(new THREE.EdgesGeometry(topGeom), edgeMaterial).translateY(topY));

    // Bottom Hemisphere
    const botGeom = new THREE.SphereGeometry(sRadius, 48, 48, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2);
    const botMat = new THREE.MeshStandardMaterial({ color: '#a855f7', side: THREE.DoubleSide });
    const botMesh = new THREE.Mesh(botGeom, botMat);
    const botY = -explodeDist * 0.8;
    botMesh.position.y = botY;
    group.add(botMesh);
    group.add(new THREE.LineSegments(new THREE.EdgesGeometry(botGeom), edgeMaterial).translateY(botY));

    // Center Equatorial Disc
    const centerGeom = new THREE.CircleGeometry(sRadius, 48);
    const centerMat = new THREE.MeshStandardMaterial({ color: '#06b6d4', side: THREE.DoubleSide });
    const centerMesh = new THREE.Mesh(centerGeom, centerMat);
    centerMesh.rotation.x = Math.PI / 2;
    group.add(centerMesh);
    group.add(new THREE.LineSegments(new THREE.EdgesGeometry(centerGeom), edgeMaterial).rotateX(Math.PI / 2));

    if (showLabels) {
      const topSprite = createTextSprite('उत्तरी अर्धगोला (2πr²)', '#500724', '#f472b6');
      topSprite.position.set(0, topY + sRadius + 0.6, 0);
      group.add(topSprite);

      const midSprite = createTextSprite('केंद्रीय काट वृत्त (πr²)', '#083344', '#22d3ee');
      midSprite.position.set(0, 0, sRadius + 1.2);
      group.add(midSprite);

      const botSprite = createTextSprite('दक्षिणी अर्धगोला (2πr²)', '#3b0764', '#c084fc');
      botSprite.position.set(0, botY - sRadius - 0.6, 0);
      group.add(botSprite);
    }
    return;
  }

  // --------------------------------------------------------------------------
  // Default Solid Rendering (when explodedParts === 0)
  // --------------------------------------------------------------------------
  let geom: THREE.BufferGeometry;

  switch (type) {
    case 'cylinder': {
      geom = new THREE.CylinderGeometry(sRadius, sRadius, sHeight, 48, 16, false);
      break;
    }
    case 'hollow_cylinder': {
      const arcShape = new THREE.Shape();
      arcShape.absarc(0, 0, sRadiusOuter, 0, Math.PI * 2, false);
      const holePath = new THREE.Path();
      holePath.absarc(0, 0, sRadius, 0, Math.PI * 2, true);
      arcShape.holes.push(holePath);

      const extrudeSettings = {
        depth: sHeight,
        bevelEnabled: false,
        curveSegments: 48,
      };
      geom = new THREE.ExtrudeGeometry(arcShape, extrudeSettings);
      geom.center();
      geom.rotateX(Math.PI / 2);
      break;
    }
    case 'cone': {
      geom = new THREE.ConeGeometry(sRadius, sHeight, 48, 16, false);
      break;
    }
    case 'cube': {
      geom = new THREE.BoxGeometry(sLength, sLength, sLength, 8, 8, 8);
      break;
    }
    case 'cuboid': {
      geom = new THREE.BoxGeometry(sLength, sHeight, sWidth, 8, 8, 8);
      break;
    }
    case 'sphere': {
      geom = new THREE.SphereGeometry(sRadius, 48, 48);
      break;
    }
    case 'hemisphere': {
      geom = new THREE.SphereGeometry(sRadius, 48, 48, 0, Math.PI * 2, 0, Math.PI / 2);
      break;
    }
    case 'frustum': {
      geom = new THREE.CylinderGeometry(Math.max(0.05, sRadiusTop), sRadius, sHeight, 48, 16, false);
      break;
    }
    case 'prism': {
      geom = new THREE.CylinderGeometry(sLength * 0.6, sLength * 0.6, sHeight, 3, 1, false);
      break;
    }
    case 'pyramid': {
      geom = new THREE.ConeGeometry(sLength * 0.707, sHeight, 4, 1, false);
      geom.rotateY(Math.PI / 4);
      break;
    }
    default:
      geom = new THREE.BoxGeometry(3, 3, 3);
  }

  const mesh = new THREE.Mesh(geom, baseMaterial);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  group.add(mesh);

  // Add Edges / Outline
  const edges = new THREE.EdgesGeometry(geom);
  const line = new THREE.LineSegments(edges, edgeMaterial);
  group.add(line);

  // Add Dimension Measurement Annotations (Height / Radius line markers)
  if (params.showDimensions) {
    addDimensionLines(group, params);
  }
}

function addDimensionLines(group: THREE.Group, params: ShapeParams) {
  const lineMat = new THREE.LineBasicMaterial({ color: 0xf59e0b, linewidth: 2 });
  const points: THREE.Vector3[] = [];

  if (params.type === 'cylinder' || params.type === 'cone' || params.type === 'frustum') {
    const h = params.height;
    const r = params.radius;

    // Height vertical line in center
    points.push(new THREE.Vector3(0, -h / 2, 0));
    points.push(new THREE.Vector3(0, h / 2, 0));

    // Base radius line
    points.push(new THREE.Vector3(0, -h / 2, 0));
    points.push(new THREE.Vector3(r, -h / 2, 0));
  } else if (params.type === 'cube') {
    const l = params.length;
    // Length line
    points.push(new THREE.Vector3(-l / 2, -l / 2, l / 2 + 0.2));
    points.push(new THREE.Vector3(l / 2, -l / 2, l / 2 + 0.2));
  } else if (params.type === 'cuboid') {
    const l = params.length;
    const h = params.height;
    const w = params.width;
    points.push(new THREE.Vector3(-l / 2, -h / 2, w / 2 + 0.2));
    points.push(new THREE.Vector3(l / 2, -h / 2, w / 2 + 0.2));
  }

  if (points.length > 0) {
    const lineGeom = new THREE.BufferGeometry().setFromPoints(points);
    const dimLine = new THREE.LineSegments(lineGeom, lineMat);
    group.add(dimLine);
  }
}

// ============================================================================
// Cube / Cuboid Cutting & Coloring Reasoning Renderer
// ============================================================================
function renderCubeCutting(
  group: THREE.Group,
  params: CubeCutParams,
  selectedCube: MiniCubeData | null | undefined,
  meshMapRef: React.MutableRefObject<Map<string, { mesh: THREE.Mesh; data: MiniCubeData }>>
) {
  const { miniCubes } = generateMiniCubes(params);

  const countX = params.isCuboid ? params.nx : params.n;
  const countY = params.isCuboid ? params.ny : params.n;
  const countZ = params.isCuboid ? params.nz : params.n;

  const cubeSize = 1.0;
  const gap = 0.08 + params.explosion * 1.2; // Exploded separation distance

  const offsetX = ((countX - 1) * (cubeSize + gap)) / 2;
  const offsetY = ((countY - 1) * (cubeSize + gap)) / 2;
  const offsetZ = ((countZ - 1) * (cubeSize + gap)) / 2;

  const innerColor = '#475569'; // slate-600 unpainted inner core

  const colorHexMap: Record<string, string> = {
    red: '#ef4444',
    blue: '#3b82f6',
    green: '#10b981',
    yellow: '#eab308',
    purple: '#a855f7',
    orange: '#f97316',
    pink: '#ec4899',
    cyan: '#06b6d4',
    white: '#f8fafc',
    black: '#0f172a',
  };

  const getHex = (c: string) => colorHexMap[c.toLowerCase()] || c || innerColor;

  miniCubes.forEach((cubeData) => {
    if (!cubeData.isVisible) return;

    const posX = cubeData.x * (cubeSize + gap) - offsetX;
    const posY = cubeData.y * (cubeSize + gap) - offsetY;
    const posZ = cubeData.z * (cubeSize + gap) - offsetZ;

    // Build 6 materials for the 6 faces of BoxGeometry:
    // [0: Right (+x), 1: Left (-x), 2: Top (+y), 3: Bottom (-y), 4: Front (+z), 5: Back (-z)]
    const rightPaint = cubeData.paintedFaces.find((f) => f.face === 'right');
    const leftPaint = cubeData.paintedFaces.find((f) => f.face === 'left');
    const topPaint = cubeData.paintedFaces.find((f) => f.face === 'top');
    const bottomPaint = cubeData.paintedFaces.find((f) => f.face === 'bottom');
    const frontPaint = cubeData.paintedFaces.find((f) => f.face === 'front');
    const backPaint = cubeData.paintedFaces.find((f) => f.face === 'back');

    const isSelected = selectedCube?.id === cubeData.id;
    const isHighlighted = cubeData.isHighlighted;

    const createFaceMat = (paint?: { face: string; color: string }) => {
      let faceColor = paint ? getHex(paint.color) : innerColor;
      let opacity = 1.0;
      let emissive = new THREE.Color(0x000000);

      if (isSelected) {
        emissive = new THREE.Color(0xf59e0b); // glowing gold
      } else if (isHighlighted) {
        if (cubeData.type === 'corner') emissive = new THREE.Color(0x221100);
        else if (cubeData.type === 'edge') emissive = new THREE.Color(0x001122);
      } else {
        opacity = 0.15; // Dim non-matching cubes when filtered
      }

      return new THREE.MeshStandardMaterial({
        color: faceColor,
        roughness: 0.3,
        metalness: 0.15,
        transparent: opacity < 1.0,
        opacity: opacity,
        emissive: emissive,
        emissiveIntensity: isSelected ? 0.6 : 0.2,
      });
    };

    const materials = [
      createFaceMat(rightPaint),
      createFaceMat(leftPaint),
      createFaceMat(topPaint),
      createFaceMat(bottomPaint),
      createFaceMat(frontPaint),
      createFaceMat(backPaint),
    ];

    const geom = new THREE.BoxGeometry(cubeSize, cubeSize, cubeSize);
    const mesh = new THREE.Mesh(geom, materials);
    mesh.position.set(posX, posY, posZ);
    mesh.castShadow = true;
    mesh.receiveShadow = true;

    // Outline / Edges
    const edgesGeom = new THREE.EdgesGeometry(geom);
    const edgesMat = new THREE.LineBasicMaterial({
      color: isSelected ? 0xffea00 : isHighlighted ? 0xffffff : 0x334155,
      linewidth: isSelected ? 3 : 1,
      transparent: true,
      opacity: isHighlighted ? 0.7 : 0.2,
    });
    const edgeLines = new THREE.LineSegments(edgesGeom, edgesMat);
    mesh.add(edgeLines);

    group.add(mesh);
    meshMapRef.current.set(cubeData.id, { mesh, data: cubeData });
  });
}

// ============================================================================
// Dice Scene Renderer (3D Dice with Pips/Dots, Fold / Unfold Net Mode)
// ============================================================================
function renderDiceScene(
  group: THREE.Group,
  params: { diceValues: [number, number, number, number, number, number]; isUnfolded: boolean; unfoldProgress: number }
) {
  const { diceValues, isUnfolded, unfoldProgress } = params;
  const [topVal, bottomVal, frontVal, backVal, leftVal, rightVal] = diceValues;

  // Create canvas texture with dice pips or numbers
  const createDiceTexture = (value: number, bgColor = '#f8fafc', dotColor = '#dc2626') => {
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 256;
    const ctx = canvas.getContext('2d');
    if (!ctx) return new THREE.CanvasTexture(canvas);

    // Background
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, 256, 256);

    // Border
    ctx.strokeStyle = '#cbd5e1';
    ctx.lineWidth = 12;
    ctx.strokeRect(6, 6, 244, 244);

    // Draw Dots / Pips
    ctx.fillStyle = value === 1 ? '#ef4444' : dotColor; // 1 is traditionally red

    const drawDot = (x: number, y: number, r = 22) => {
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fill();
    };

    const c = 128;
    const l = 64;
    const r = 192;
    const t = 64;
    const b = 192;

    if (value === 1) {
      drawDot(c, c, 32);
    } else if (value === 2) {
      drawDot(l, t);
      drawDot(r, b);
    } else if (value === 3) {
      drawDot(l, t);
      drawDot(c, c);
      drawDot(r, b);
    } else if (value === 4) {
      drawDot(l, t);
      drawDot(r, t);
      drawDot(l, b);
      drawDot(r, b);
    } else if (value === 5) {
      drawDot(l, t);
      drawDot(r, t);
      drawDot(c, c);
      drawDot(l, b);
      drawDot(r, b);
    } else if (value === 6) {
      drawDot(l, t);
      drawDot(r, t);
      drawDot(l, c);
      drawDot(r, c);
      drawDot(l, b);
      drawDot(r, b);
    } else {
      // Number text if > 6 or custom
      ctx.fillStyle = '#1e293b';
      ctx.font = 'bold 110px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(String(value), c, c);
    }

    const texture = new THREE.CanvasTexture(canvas);
    return texture;
  };

  if (!isUnfolded || unfoldProgress === 0) {
    // Standard 3D Assembled Dice Box
    const materials = [
      new THREE.MeshStandardMaterial({ map: createDiceTexture(rightVal), roughness: 0.2 }),
      new THREE.MeshStandardMaterial({ map: createDiceTexture(leftVal), roughness: 0.2 }),
      new THREE.MeshStandardMaterial({ map: createDiceTexture(topVal), roughness: 0.2 }),
      new THREE.MeshStandardMaterial({ map: createDiceTexture(bottomVal), roughness: 0.2 }),
      new THREE.MeshStandardMaterial({ map: createDiceTexture(frontVal), roughness: 0.2 }),
      new THREE.MeshStandardMaterial({ map: createDiceTexture(backVal), roughness: 0.2 }),
    ];

    const geom = new THREE.BoxGeometry(3.5, 3.5, 3.5);
    const mesh = new THREE.Mesh(geom, materials);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    group.add(mesh);
  } else {
    // Unfolded Open Net in 3D cross pattern
    // Center face is Front, Top attached above, Bottom attached below, Left attached left, Right attached right, Back attached to Right
    const size = 2.2;
    const progress = unfoldProgress; // 0 to 1

    const createFacePlane = (val: number, label: string) => {
      const geom = new THREE.PlaneGeometry(size, size);
      const mat = new THREE.MeshStandardMaterial({
        map: createDiceTexture(val),
        side: THREE.DoubleSide,
        roughness: 0.2,
      });
      const plane = new THREE.Mesh(geom, mat);
      return plane;
    };

    // Center Face (Front)
    const centerMesh = createFacePlane(frontVal, 'Front');
    group.add(centerMesh);

    // Top Face (Flaps up 90 deg)
    const topMesh = createFacePlane(topVal, 'Top');
    topMesh.position.set(0, size * progress, 0);
    topMesh.rotation.x = -((1 - progress) * (Math.PI / 2));
    group.add(topMesh);

    // Bottom Face (Flaps down 90 deg)
    const bottomMesh = createFacePlane(bottomVal, 'Bottom');
    bottomMesh.position.set(0, -size * progress, 0);
    bottomMesh.rotation.x = (1 - progress) * (Math.PI / 2);
    group.add(bottomMesh);

    // Left Face (Flaps left 90 deg)
    const leftMesh = createFacePlane(leftVal, 'Left');
    leftMesh.position.set(-size * progress, 0, 0);
    leftMesh.rotation.y = (1 - progress) * (Math.PI / 2);
    group.add(leftMesh);

    // Right Face (Flaps right 90 deg)
    const rightMesh = createFacePlane(rightVal, 'Right');
    rightMesh.position.set(size * progress, 0, 0);
    rightMesh.rotation.y = -((1 - progress) * (Math.PI / 2));
    group.add(rightMesh);

    // Back Face (Flaps past right)
    const backMesh = createFacePlane(backVal, 'Back');
    backMesh.position.set(size * 2 * progress, 0, 0);
    group.add(backMesh);
  }
}
