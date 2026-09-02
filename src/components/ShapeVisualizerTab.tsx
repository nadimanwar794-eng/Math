import React, { useEffect, useState } from 'react';
import { ShapeParams, ShapeType } from '../types';
import { calculateShapeMetrics } from '../utils/mathFormulas';
import { ThreeCanvas } from './ThreeCanvas';
import {
  Box,
  Calculator,
  Check,
  ChevronDown,
  ChevronUp,
  Copy,
  Expand,
  Layers,
  Maximize2,
  Minimize2,
  Play,
  RotateCcw,
  Sparkles,
  Split,
  Tv,
  Wand2,
  X,
} from 'lucide-react';

interface ShapeVisualizerTabProps {
  language: 'hi' | 'en';
  projectorMode?: boolean;
  focusMode?: boolean;
  onToggleFocus?: () => void;
  diagramOnlyMode?: boolean;
  onToggleDiagramOnly?: () => void;
  onCancelDiagramOnly?: () => void;
}

export const ShapeVisualizerTab: React.FC<ShapeVisualizerTabProps> = ({
  language,
  projectorMode = false,
  focusMode = false,
  onToggleFocus,
  diagramOnlyMode = false,
  onToggleDiagramOnly,
  onCancelDiagramOnly,
}) => {
  const [params, setParams] = useState<ShapeParams>({
    type: 'cylinder',
    radius: 4,
    radiusOuter: 5,
    radiusTop: 2,
    height: 7,
    length: 5,
    width: 4,
    color: '#3b82f6',
    wireframe: false,
    transparent: false,
    opacity: 0.75,
    showDimensions: true,
    showCrossSection: false,
    explodedParts: 0,
    showLabels: true,
    unrollNet: false,
    unfoldStep: 0,
    unfoldProgress: 0,
  });

  const [viewLayout, setViewLayout] = useState<'split' | 'widescreen169'>(projectorMode ? 'widescreen169' : 'split');

  useEffect(() => {
    if (projectorMode) {
      setViewLayout('widescreen169');
    }
  }, [projectorMode]);
  const [isAutoExploding, setIsAutoExploding] = useState(false);
  const [isAutoUnfolding, setIsAutoUnfolding] = useState(false);
  const [copiedFormula, setCopiedFormula] = useState<string | null>(null);
  const [isCompactSettingsOpen, setIsCompactSettingsOpen] = useState(false);

  const metrics = calculateShapeMetrics(params);

  // Helper for shape unfold steps
  const getShapeUnfoldSteps = (type: ShapeType, lang: 'hi' | 'en') => {
    switch (type) {
      case 'cube':
      case 'cuboid':
        return [
          { step: 0, label: lang === 'hi' ? '3D ठोस (Solid Box)' : 'Solid Box', desc: lang === 'hi' ? 'सभी 6 फलक जुड़े हुए 3D रूप में' : 'All 6 faces closed in 3D' },
          { step: 1, label: lang === 'hi' ? 'चरण 1: ऊपरी फलक (Top Face)' : 'Step 1: Top Face', desc: lang === 'hi' ? 'ऊपरी फलक 90° ऊपर 2D में खुला' : 'Top face unfolds upward' },
          { step: 2, label: lang === 'hi' ? 'चरण 2: निचला फलक (Bottom Face)' : 'Step 2: Bottom Face', desc: lang === 'hi' ? 'निचला फलक 90° नीचे 2D में खुला' : 'Bottom face unfolds downward' },
          { step: 3, label: lang === 'hi' ? 'चरण 3: बायां फलक (Left Face)' : 'Step 3: Left Face', desc: lang === 'hi' ? 'बायां फलक 90° बाईं ओर खुला' : 'Left face unfolds to the left' },
          { step: 4, label: lang === 'hi' ? 'चरण 4: दायां फलक (Right Face)' : 'Step 4: Right Face', desc: lang === 'hi' ? 'दायां फलक 90° दाईं ओर खुला' : 'Right face unfolds to the right' },
          { step: 5, label: lang === 'hi' ? 'चरण 5: पूर्ण 2D क्रॉस नेट (Full Net)' : 'Step 5: Full 2D Net', desc: lang === 'hi' ? 'पीछे का फलक खुला (कुल क्षेत्रफल = 2(lb+bh+hl))' : 'Back face opens, full 2D cross net formed' },
        ];
      case 'cylinder':
        return [
          { step: 0, label: lang === 'hi' ? '3D बंद बेलन (Solid Cylinder)' : 'Solid Cylinder', desc: lang === 'hi' ? 'पूर्ण 3D बेलन (ठोस)' : 'Complete 3D cylinder' },
          { step: 1, label: lang === 'hi' ? 'चरण 1: ऊपरी वृत्त सिरा (Top: πr²)' : 'Step 1: Top Circle (πr²)', desc: lang === 'hi' ? 'ऊपरी वृत्ताकार ढक्कन अलग होकर 2D में आ गया' : 'Top lid detaches into 2D' },
          { step: 2, label: lang === 'hi' ? 'चरण 2: निचला आधार वृत्त (Base: πr²)' : 'Step 2: Base Circle (πr²)', desc: lang === 'hi' ? 'निचला आधार वृत्त अलग होकर 2D में आ गया' : 'Bottom base detaches into 2D' },
          { step: 3, label: lang === 'hi' ? 'चरण 3: वक्र पृष्ठ खुला (Unrolling)' : 'Step 3: Unrolling Mantle', desc: lang === 'hi' ? 'वक्र पृष्ठ सीम से खुलना शुरू हुआ' : 'Curved mantle begins unrolling' },
          { step: 4, label: lang === 'hi' ? 'चरण 4: पूर्ण 2D आयत नेट (2πr × h)' : 'Step 4: Full 2D Sheet Net', desc: lang === 'hi' ? 'पूर्ण समतल 2D नेट (आयताकार शीट 2πr×h + 2 वृत्त πr²)' : 'Full 2D Net: 2πr × h rectangle + 2 circles' },
        ];
      case 'cone':
        return [
          { step: 0, label: lang === 'hi' ? '3D बंद शंकु (Solid Cone)' : 'Solid Cone', desc: lang === 'hi' ? 'पूर्ण 3D शंकु' : 'Complete 3D cone' },
          { step: 1, label: lang === 'hi' ? 'चरण 1: आधार वृत्त (Base: πr²)' : 'Step 1: Base Circle (πr²)', desc: lang === 'hi' ? 'आधार वृत्त समतल 2D में खुला' : 'Base circle unfolds flat' },
          { step: 2, label: lang === 'hi' ? 'चरण 2: वक्र पृष्ठ खुला (Sector: πrl)' : 'Step 2: Unrolling Sector (πrl)', desc: lang === 'hi' ? 'शंकु का वक्र पृष्ठ तिर्यक रेखा पर कटकर त्रिज्यखंड बना' : 'Slant mantle opens into circular sector' },
          { step: 3, label: lang === 'hi' ? 'चरण 3: पूर्ण 2D नेट (Sector + Base)' : 'Step 3: Full 2D Net', desc: lang === 'hi' ? 'कुल पृष्ठीय क्षेत्रफल = πrl + πr²' : 'Total 2D Surface Net = πrl + πr²' },
        ];
      case 'pyramid':
        return [
          { step: 0, label: lang === 'hi' ? '3D बंद पिरामिड (Solid Pyramid)' : 'Solid Pyramid', desc: lang === 'hi' ? 'पूर्ण 3D पिरामिड' : 'Complete 3D pyramid' },
          { step: 1, label: lang === 'hi' ? 'चरण 1: सामने का त्रिभुज खुला' : 'Step 1: Front Triangle', desc: lang === 'hi' ? 'सामने का त्रिभुजाकार फलक नीचे 2D में खुला' : 'Front triangle unfolds down' },
          { step: 2, label: lang === 'hi' ? 'चरण 2: पीछे का त्रिभुज खुला' : 'Step 2: Back Triangle', desc: lang === 'hi' ? 'पीछे का त्रिभुजाकार फलक ऊपर 2D में खुला' : 'Back triangle unfolds up' },
          { step: 3, label: lang === 'hi' ? 'चरण 3: बायां त्रिभुज खुला' : 'Step 3: Left Triangle', desc: lang === 'hi' ? 'बायां त्रिभुजाकार फलक बाईं ओर खुला' : 'Left triangle unfolds left' },
          { step: 4, label: lang === 'hi' ? 'चरण 4: दायां त्रिभुज खुला' : 'Step 4: Right Triangle', desc: lang === 'hi' ? 'दायां त्रिभुजाकार फलक दाईं ओर खुला' : 'Right triangle unfolds right' },
          { step: 5, label: lang === 'hi' ? 'चरण 5: पूर्ण 2D स्टार नेट (Star Net)' : 'Step 5: Full 2D Star Net', desc: lang === 'hi' ? 'केंद्रीय वर्ग a² + 4 समद्विबाहु त्रिभुज' : 'Central square a² + 4 triangle petals' },
        ];
      case 'prism':
        return [
          { step: 0, label: lang === 'hi' ? '3D बंद प्रिज्म (Solid Prism)' : 'Solid Prism', desc: lang === 'hi' ? 'पूर्ण 3D प्रिज्म' : 'Complete 3D prism' },
          { step: 1, label: lang === 'hi' ? 'चरण 1: ऊपरी त्रिभुज सिरा खुला' : 'Step 1: Top Triangle', desc: lang === 'hi' ? 'ऊपरी त्रिभुजाकार सिरा ऊपर खुला' : 'Top triangular lid unfolds' },
          { step: 2, label: lang === 'hi' ? 'चरण 2: निचला त्रिभुज आधार खुला' : 'Step 2: Bottom Triangle', desc: lang === 'hi' ? 'निचला त्रिभुजाकार आधार नीचे खुला' : 'Bottom triangle unfolds' },
          { step: 3, label: lang === 'hi' ? 'चरण 3: बायां आयताकार फलक खुला' : 'Step 3: Left Rectangle', desc: lang === 'hi' ? 'बायां आयत 90° बाईं ओर खुला' : 'Left rectangle unfolds' },
          { step: 4, label: lang === 'hi' ? 'चरण 4: दायां आयताकार फलक खुला' : 'Step 4: Right Rectangle', desc: lang === 'hi' ? 'दायां आयत 90° दाईं ओर खुला' : 'Right rectangle unfolds' },
          { step: 5, label: lang === 'hi' ? 'चरण 5: पूर्ण 2D प्रिज्म नेट (Full Net)' : 'Step 5: Full 2D Net', desc: lang === 'hi' ? '3 संलग्न आयत + 2 त्रिभुज' : '3 adjacent rectangles + 2 triangular caps' },
        ];
      case 'frustum':
        return [
          { step: 0, label: lang === 'hi' ? '3D बंद छिन्नक (Solid Frustum)' : 'Solid Frustum', desc: lang === 'hi' ? 'पूर्ण 3D बाल्टी/छिन्नक' : 'Complete 3D frustum' },
          { step: 1, label: lang === 'hi' ? 'चरण 1: ऊपरी वृत्त सिरा (πr₂²)' : 'Step 1: Top Circle (πr₂²)', desc: lang === 'hi' ? 'ऊपरी छोटा वृत्ताकार सिरा खुला' : 'Top circle unfolds' },
          { step: 2, label: lang === 'hi' ? 'चरण 2: निचला आधार वृत्त (πr₁²)' : 'Step 2: Base Circle (πr₁²)', desc: lang === 'hi' ? 'निचला बड़ा वृत्ताकार सिरा खुला' : 'Bottom circle unfolds' },
          { step: 3, label: lang === 'hi' ? 'चरण 3: तिर्यक वक्र पृष्ठ खुला' : 'Step 3: Lateral Band Unrolls', desc: lang === 'hi' ? 'वक्र पृष्ठ वलयाकार त्रिज्यखंड के रूप में खुला' : 'Slanted mantle opens into annular sector' },
          { step: 4, label: lang === 'hi' ? 'चरण 4: पूर्ण 2D नेट (Full Net)' : 'Step 4: Full 2D Net', desc: lang === 'hi' ? 'कुल क्षेत्रफल = π(r₁+r₂)l + πr₁² + πr₂²' : 'Total Area = π(r₁+r₂)l + πr₁² + πr₂²' },
        ];
      default:
        return [
          { step: 0, label: lang === 'hi' ? '3D ठोस (Solid)' : 'Solid', desc: lang === 'hi' ? 'पूर्ण 3D आकृति' : 'Solid 3D shape' },
          { step: 1, label: lang === 'hi' ? 'घटक विखंडन (Exploded)' : 'Exploded Parts', desc: lang === 'hi' ? '3D घटक अलग-अलग' : 'Separated 3D components' },
          { step: 2, label: lang === 'hi' ? '2D समतल रूपांतरण (2D Net)' : '2D Transformation', desc: lang === 'hi' ? 'क्षेत्रफल व आयतन संबंध' : 'Surface area breakdown' },
        ];
    }
  };

  const unfoldSteps = getShapeUnfoldSteps(params.type, language);
  const currentUnfoldStep = params.unfoldStep ?? 0;

  // Auto-unfold animation step loop
  useEffect(() => {
    if (!isAutoUnfolding) return;
    const maxS = unfoldSteps.length - 1;
    const timer = setInterval(() => {
      setParams((prev) => {
        const curStep = prev.unfoldStep ?? 0;
        const nextStep = curStep >= maxS ? 0 : curStep + 1;
        return {
          ...prev,
          unfoldStep: nextStep,
          unfoldProgress: nextStep / maxS,
        };
      });
    }, 1600);
    return () => clearInterval(timer);
  }, [isAutoUnfolding, unfoldSteps.length]);

  // Auto-deconstruct oscillation loop
  useEffect(() => {
    if (!isAutoExploding) return;
    let dir = 1;
    const timer = setInterval(() => {
      setParams((prev) => {
        let next = (prev.explodedParts || 0) + 0.025 * dir;
        if (next >= 0.85) {
          next = 0.85;
          dir = -1;
        } else if (next <= 0.02) {
          next = 0;
          dir = 1;
        }
        return { ...prev, explodedParts: Number(next.toFixed(3)) };
      });
    }, 45);
    return () => clearInterval(timer);
  }, [isAutoExploding]);

  const shapeList: { type: ShapeType; nameHi: string; nameEn: string; icon: string; defaultParams: Partial<ShapeParams> }[] = [
    {
      type: 'cylinder',
      nameHi: 'बेलन (Cylinder)',
      nameEn: 'Cylinder',
      icon: '🛢️',
      defaultParams: { radius: 4, height: 7, color: '#3b82f6' },
    },
    {
      type: 'hollow_cylinder',
      nameHi: 'खोखला बेलन (Hollow)',
      nameEn: 'Hollow Cylinder',
      icon: '🔘',
      defaultParams: { radius: 3, radiusOuter: 5, height: 8, color: '#06b6d4' },
    },
    {
      type: 'cone',
      nameHi: 'शंकु (Cone)',
      nameEn: 'Cone',
      icon: '🍦',
      defaultParams: { radius: 3, height: 4, color: '#f59e0b' },
    },
    {
      type: 'cube',
      nameHi: 'घन (Cube)',
      nameEn: 'Cube',
      icon: '🧊',
      defaultParams: { length: 5, color: '#10b981' },
    },
    {
      type: 'cuboid',
      nameHi: 'घनाभ (Cuboid)',
      nameEn: 'Cuboid',
      icon: '📦',
      defaultParams: { length: 6, width: 4, height: 3, color: '#8b5cf6' },
    },
    {
      type: 'sphere',
      nameHi: 'गोला (Sphere)',
      nameEn: 'Sphere',
      icon: '🔮',
      defaultParams: { radius: 4.5, color: '#ec4899' },
    },
    {
      type: 'hemisphere',
      nameHi: 'अर्धगोला (Hemisphere)',
      nameEn: 'Hemisphere',
      icon: '🥣',
      defaultParams: { radius: 4.5, color: '#14b8a6' },
    },
    {
      type: 'frustum',
      nameHi: 'छिन्नक (Frustum)',
      nameEn: 'Frustum',
      icon: '🪣',
      defaultParams: { radius: 4.5, radiusTop: 2, height: 6, color: '#f97316' },
    },
    {
      type: 'prism',
      nameHi: 'प्रिज्म (Prism)',
      nameEn: 'Triangular Prism',
      icon: '📐',
      defaultParams: { length: 5, height: 7, color: '#a855f7' },
    },
    {
      type: 'pyramid',
      nameHi: 'पिरामिड (Pyramid)',
      nameEn: 'Square Pyramid',
      icon: '⛺',
      defaultParams: { length: 5, height: 6, color: '#eab308' },
    },
  ];

  const handleSelectShape = (shape: (typeof shapeList)[0]) => {
    setParams((prev) => ({
      ...prev,
      type: shape.type,
      ...shape.defaultParams,
    }));
  };

  const copyText = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedFormula(id);
    setTimeout(() => setCopiedFormula(null), 2000);
  };

  const r = params.radius;
  const h = params.height;
  const topBaseArea = Math.PI * r * r;
  const botBaseArea = Math.PI * r * r;
  const csaArea = 2 * Math.PI * r * h;
  const tsaArea = csaArea + topBaseArea + botBaseArea;

  // =========================================================================
  // ONLY DIAGRAM MODE (ZEN DIAGRAM VIEW)
  // Everything else is hidden, only the 3D solid diagram is shown with a single cancel button
  // =========================================================================
  if (diagramOnlyMode) {
    const currentShape = shapeList.find((s) => s.type === params.type);
    return (
      <div className="fixed inset-0 z-[9999] w-screen h-screen bg-slate-950 flex flex-col justify-center items-center overflow-hidden select-none">
        {/* Full Viewport 3D Canvas */}
        <div className="w-full h-full">
          <ThreeCanvas
            mode="shape"
            shapeParams={params}
            language={language}
          />
        </div>

        {/* 1. Only Button to Cancel / Exit Diagram Mode */}
        <div className="absolute top-4 right-4 z-50 flex items-center gap-2">
          <button
            id="btn-cancel-diagram-mode-shape"
            onClick={onCancelDiagramOnly}
            className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-red-600 hover:bg-red-500 text-white font-bold text-xs sm:text-sm shadow-2xl border-2 border-white/20 transition-all hover:scale-105 cursor-pointer backdrop-blur-md"
            title="Exit Diagram Mode"
          >
            <X className="w-4 h-4 sm:w-5 sm:h-5" />
            <span>{language === 'hi' ? 'डायग्राम मोड बंद करें (Esc)' : 'Exit Diagram Mode (Esc)'}</span>
          </button>
        </div>

        {/* Floating Title Badge at Top Left */}
        <div className="absolute top-4 left-4 z-40 bg-slate-900/90 backdrop-blur-md border border-slate-700/80 rounded-full px-4 py-2 text-xs font-bold text-white flex items-center gap-2 shadow-xl pointer-events-none">
          <span className="w-2.5 h-2.5 rounded-full bg-indigo-400 animate-pulse" />
          <span>{currentShape?.nameHi || params.type} (3D Diagram)</span>
        </div>

        {/* Minimal Floating Explode Slider at Bottom Center if deconstructible */}
        {(params.type === 'cylinder' || params.type === 'cone' || params.type === 'frustum' || params.type === 'cube' || params.type === 'cuboid') && (
          <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-40 bg-slate-900/85 backdrop-blur-md border border-slate-700/80 rounded-2xl px-4 py-2 flex items-center gap-3 text-xs text-white shadow-2xl">
            <span className="text-slate-300 font-semibold">{language === 'hi' ? 'घटक पृथक्करण:' : 'Deconstruct:'}</span>
            <input
              type="range"
              min="0"
              max="1"
              step="0.02"
              value={params.explodedParts || 0}
              onChange={(e) => setParams({ ...params, explodedParts: parseFloat(e.target.value) })}
              className="w-28 sm:w-36 accent-indigo-500 h-1.5 cursor-pointer"
            />
            <span className="font-mono text-indigo-400 font-bold">{Math.round((params.explodedParts || 0) * 100)}%</span>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Top Header & Layout Mode Switcher */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-2.5 sm:p-3 backdrop-blur-md flex flex-wrap items-center justify-between gap-2 shadow-lg">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-indigo-600/20 border border-indigo-500/40 flex items-center justify-center text-lg shrink-0">
            📐
          </div>
          <div>
            <h2 className="text-sm sm:text-base font-bold text-white flex items-center gap-1.5">
              <span>{language === 'hi' ? '3D ठोस व घटक पृथक्करण' : '3D Geometry & Deconstruction'}</span>
              <span className="text-[10px] font-mono font-normal px-1.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                100% Offline
              </span>
            </h2>
            <p className="text-[11px] text-slate-400 hidden sm:block">
              {language === 'hi'
                ? 'बेलन, शंकु, घन, घनाभ के सभी भागों (वक्र पृष्ठ, आधार) को 3D में अलग करके समझें'
                : 'Deconstruct solids into lateral surface, top & bottom bases'}
            </p>
          </div>
        </div>

        {/* View Mode Switcher (16:9 Screen vs Split View + Only Diagram) */}
        <div className="flex items-center gap-1.5">
          <button
            id="btn-trigger-only-diagram-shapes"
            onClick={onToggleDiagramOnly}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold bg-emerald-950/90 hover:bg-emerald-900 border border-emerald-500/50 text-emerald-300 hover:text-white transition-all shadow-sm cursor-pointer"
            title={language === 'hi' ? 'केवल डायग्राम मोड (बाकी सब छिपाएं)' : 'Only Diagram Mode'}
          >
            <Maximize2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>{language === 'hi' ? 'केवल डायग्राम' : 'Only Diagram'}</span>
          </button>

          <div className="flex items-center gap-1 p-0.5 bg-slate-950 border border-slate-800 rounded-lg">
            <button
              id="btn-mode-split"
              onClick={() => setViewLayout('split')}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium transition-all ${
                viewLayout === 'split'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Split className="w-3.5 h-3.5" />
              <span>{language === 'hi' ? 'विभाजित' : 'Split'}</span>
            </button>

            <button
              id="btn-mode-169"
              onClick={() => setViewLayout('widescreen169')}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold transition-all ${
                viewLayout === 'widescreen169'
                  ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md shadow-indigo-500/20'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Tv className="w-3.5 h-3.5 text-cyan-300" />
              <span>{language === 'hi' ? '16:9 स्क्रीन' : '16:9 View'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Shape Selector Ribbon */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-2 sm:p-2.5 backdrop-blur-md">
        <div className="flex items-center justify-between mb-1.5 px-1">
          <h3 className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
            <Box className="w-3.5 h-3.5 text-indigo-400" />
            <span>{language === 'hi' ? '3D ठोस आकृति चुनें' : 'Select 3D Shape'}</span>
          </h3>
          <span className="text-[10px] text-slate-400">
            {language === 'hi' ? 'पार्ट्स अलग करके देखें' : 'Click to deconstruct'}
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 lg:grid-cols-10 gap-1.5 sm:gap-2">
          {shapeList.map((shape) => {
            const isSelected = params.type === shape.type;
            return (
              <button
                key={shape.type}
                id={`btn-shape-${shape.type}`}
                onClick={() => handleSelectShape(shape)}
                className={`flex flex-col items-center justify-center p-2 sm:p-2.5 rounded-xl border text-center transition-all ${
                  isSelected
                    ? 'bg-indigo-600/30 border-indigo-400 text-white shadow-lg shadow-indigo-500/20 scale-[1.03]'
                    : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:bg-slate-800/80 hover:border-slate-700'
                }`}
              >
                <span className="text-xl sm:text-2xl mb-0.5">{shape.icon}</span>
                <span className="text-[11px] font-semibold tracking-tight truncate w-full">
                  {language === 'hi' ? shape.nameHi.split(' ')[0] : shape.nameEn.split(' ')[0]}
                </span>
                <span className="text-[9px] text-slate-400 font-normal truncate w-full">
                  {language === 'hi' ? shape.nameHi.split(' ')[1] || '' : shape.nameEn.split(' ')[1] || ''}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 16:9 WIDESCREEN CINEMATIC MODE */}
      {viewLayout === 'widescreen169' ? (
        <div className="space-y-4">
          {/* Main 16:9 Aspect Ratio 3D Canvas Box */}
          <div className="relative w-full aspect-[16/9] min-h-[460px] max-h-[76vh] bg-slate-950 rounded-3xl overflow-hidden border border-slate-700 shadow-2xl">
            <ThreeCanvas mode="shape" shapeParams={params} language={language} />

            {/* Floating Top-Right Mini Stats in 16:9 Mode */}
            <div className="absolute top-3 right-3 hidden sm:flex items-center gap-2 pointer-events-auto bg-slate-900/85 backdrop-blur-md p-1.5 px-3 rounded-2xl border border-slate-700/80 text-xs shadow-xl">
              <div className="flex flex-col">
                <span className="text-[10px] text-slate-400 font-medium">{language === 'hi' ? 'आयतन (Vol)' : 'Vol'}</span>
                <span className="text-white font-mono font-bold">{metrics.volume.toFixed(1)} cm³</span>
              </div>
              <div className="w-[1px] h-6 bg-slate-700 mx-1" />
              <div className="flex flex-col">
                <span className="text-[10px] text-emerald-400 font-medium">{language === 'hi' ? 'वक्र पृष्ठ (CSA)' : 'CSA'}</span>
                <span className="text-emerald-300 font-mono font-bold">{metrics.curvedSurfaceArea.toFixed(1)} cm²</span>
              </div>
              <div className="w-[1px] h-6 bg-slate-700 mx-1" />
              <div className="flex flex-col">
                <span className="text-[10px] text-amber-400 font-medium">{language === 'hi' ? 'कुल पृष्ठ (TSA)' : 'TSA'}</span>
                <span className="text-amber-300 font-mono font-bold">{metrics.totalSurfaceArea.toFixed(1)} cm²</span>
              </div>
            </div>

            {/* Floating Bottom-Center Quick Deconstruct Bar */}
            <div className="absolute bottom-12 left-1/2 -translate-x-1/2 w-[92%] sm:w-auto max-w-3xl bg-slate-900/90 backdrop-blur-md p-2.5 sm:px-4 rounded-2xl border border-indigo-500/40 shadow-2xl flex flex-wrap items-center justify-between sm:justify-center gap-3 text-xs pointer-events-auto">
              <div className="flex items-center gap-2">
                <span className="text-amber-300 font-bold flex items-center gap-1">
                  ⚡ {language === 'hi' ? 'पार्ट्स अलग करें:' : 'Separate Parts:'}
                </span>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={params.explodedParts || 0}
                  onChange={(e) => {
                    setIsAutoExploding(false);
                    setParams({ ...params, explodedParts: parseFloat(e.target.value) });
                  }}
                  className="w-24 sm:w-36 accent-amber-400 bg-slate-800 h-2 rounded-lg cursor-pointer"
                />
                <span className="font-mono text-amber-300 font-bold w-10 text-right">
                  {Math.round((params.explodedParts || 0) * 100)}%
                </span>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => {
                    setIsAutoExploding(false);
                    setParams({ ...params, explodedParts: (params.explodedParts || 0) > 0.4 ? 0 : 0.85 });
                  }}
                  className="px-2.5 py-1 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 font-medium"
                >
                  {(params.explodedParts || 0) > 0.4
                    ? language === 'hi'
                      ? '🔄 जोड़ें'
                      : 'Assemble'
                    : language === 'hi'
                    ? '💥 अलग करें'
                    : 'Explode'}
                </button>

                <button
                  onClick={() => setIsAutoExploding(!isAutoExploding)}
                  className={`px-2.5 py-1 rounded-lg font-medium border flex items-center gap-1 ${
                    isAutoExploding
                      ? 'bg-emerald-600 text-white border-emerald-400 animate-pulse'
                      : 'bg-slate-800 text-slate-300 hover:text-white border-slate-700'
                  }`}
                >
                  <Play className="w-3 h-3" />
                  {isAutoExploding ? (language === 'hi' ? 'रोकें' : 'Pause') : (language === 'hi' ? 'ऑटो लूप' : 'Auto Loop')}
                </button>

                {params.type === 'cylinder' && (
                  <button
                    onClick={() => setParams({ ...params, unrollNet: !params.unrollNet })}
                    className={`px-2.5 py-1 rounded-lg font-medium border transition-all ${
                      params.unrollNet
                        ? 'bg-cyan-600 text-white border-cyan-400'
                        : 'bg-slate-800 text-cyan-300 border-slate-700 hover:bg-slate-700'
                    }`}
                  >
                    {params.unrollNet
                      ? language === 'hi'
                        ? 'खोखला बेलन'
                        : 'Tube View'
                      : language === 'hi'
                      ? 'खुला आयत (2πr×h)'
                      : 'Unroll 2D Sheet'}
                  </button>
                )}

                <label className="flex items-center gap-1 cursor-pointer text-slate-300 hover:text-white ml-1">
                  <input
                    type="checkbox"
                    checked={params.showLabels !== false}
                    onChange={(e) => setParams({ ...params, showLabels: e.target.checked })}
                    className="rounded border-slate-700 text-indigo-600"
                  />
                  <span>{language === 'hi' ? '3D लेबल' : '3D Labels'}</span>
                </label>
              </div>
            </div>
          </div>

          {/* Compact 16:9 Quick Setting Panel (Collapsible / Sleek) */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 backdrop-blur-md">
            <div className="flex items-center justify-between">
              <h4 className="text-xs sm:text-sm font-semibold text-slate-200 flex items-center gap-2">
                <Layers className="w-4 h-4 text-indigo-400" />
                {language === 'hi' ? 'त्वरित माप व नियंत्रण (Compact Controls)' : 'Quick Dimension Controls'}
              </h4>
              <button
                onClick={() => setIsCompactSettingsOpen(!isCompactSettingsOpen)}
                className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1 font-medium"
              >
                {isCompactSettingsOpen ? (language === 'hi' ? 'छोटा करें' : 'Collapse') : (language === 'hi' ? 'विस्तार करें' : 'Expand All')}
                {isCompactSettingsOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
              </button>
            </div>

            {/* Compact Dimension Sliders in 16:9 mode */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mt-3">
              {/* Radius */}
              {(params.type === 'cylinder' ||
                params.type === 'hollow_cylinder' ||
                params.type === 'cone' ||
                params.type === 'sphere' ||
                params.type === 'hemisphere' ||
                params.type === 'frustum') && (
                <div className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800/80">
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-300 font-medium">{language === 'hi' ? 'त्रिज्या (r):' : 'Radius (r):'}</span>
                    <span className="text-indigo-400 font-mono font-bold">{params.radius} cm</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="range"
                      min="0.5"
                      max="100"
                      step="0.5"
                      value={params.radius}
                      onChange={(e) => setParams({ ...params, radius: parseFloat(e.target.value) })}
                      className="w-full accent-indigo-500 bg-slate-800 h-1.5 rounded-lg cursor-pointer"
                    />
                    <input
                      type="number"
                      min="0.1"
                      step="0.5"
                      value={params.radius}
                      onChange={(e) => setParams({ ...params, radius: Math.max(0.1, parseFloat(e.target.value) || 1) })}
                      className="w-14 px-1.5 py-0.5 text-xs bg-slate-900 border border-slate-700 rounded text-white font-mono text-center"
                    />
                  </div>
                </div>
              )}

              {/* Outer Radius */}
              {params.type === 'hollow_cylinder' && (
                <div className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800/80">
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-300 font-medium">{language === 'hi' ? 'बाहरी त्रिज्या (R):' : 'Outer R:'}</span>
                    <span className="text-cyan-400 font-mono font-bold">{params.radiusOuter || 5} cm</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="range"
                      min="1"
                      max="100"
                      step="0.5"
                      value={params.radiusOuter || 5}
                      onChange={(e) => setParams({ ...params, radiusOuter: parseFloat(e.target.value) })}
                      className="w-full accent-cyan-500 bg-slate-800 h-1.5 rounded-lg cursor-pointer"
                    />
                    <input
                      type="number"
                      min="0.1"
                      step="0.5"
                      value={params.radiusOuter || 5}
                      onChange={(e) =>
                        setParams({ ...params, radiusOuter: Math.max(0.1, parseFloat(e.target.value) || 1) })
                      }
                      className="w-14 px-1.5 py-0.5 text-xs bg-slate-900 border border-slate-700 rounded text-white font-mono text-center"
                    />
                  </div>
                </div>
              )}

              {/* Height */}
              {(params.type === 'cylinder' ||
                params.type === 'hollow_cylinder' ||
                params.type === 'cone' ||
                params.type === 'cuboid' ||
                params.type === 'frustum' ||
                params.type === 'prism' ||
                params.type === 'pyramid') && (
                <div className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800/80">
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-300 font-medium">{language === 'hi' ? 'ऊंचाई (h):' : 'Height (h):'}</span>
                    <span className="text-indigo-400 font-mono font-bold">{params.height} cm</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="range"
                      min="1"
                      max="100"
                      step="0.5"
                      value={params.height}
                      onChange={(e) => setParams({ ...params, height: parseFloat(e.target.value) })}
                      className="w-full accent-indigo-500 bg-slate-800 h-1.5 rounded-lg cursor-pointer"
                    />
                    <input
                      type="number"
                      min="0.1"
                      step="0.5"
                      value={params.height}
                      onChange={(e) => setParams({ ...params, height: Math.max(0.1, parseFloat(e.target.value) || 1) })}
                      className="w-14 px-1.5 py-0.5 text-xs bg-slate-900 border border-slate-700 rounded text-white font-mono text-center"
                    />
                  </div>
                </div>
              )}

              {/* Length */}
              {(params.type === 'cube' ||
                params.type === 'cuboid' ||
                params.type === 'prism' ||
                params.type === 'pyramid') && (
                <div className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800/80">
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-300 font-medium">
                      {params.type === 'cube' ? (language === 'hi' ? 'भुजा (a):' : 'Side (a):') : (language === 'hi' ? 'लंबाई (l):' : 'Length (l):')}
                    </span>
                    <span className="text-emerald-400 font-mono font-bold">{params.length} cm</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="range"
                      min="1"
                      max="100"
                      step="0.5"
                      value={params.length}
                      onChange={(e) => setParams({ ...params, length: parseFloat(e.target.value) })}
                      className="w-full accent-emerald-500 bg-slate-800 h-1.5 rounded-lg cursor-pointer"
                    />
                    <input
                      type="number"
                      min="0.1"
                      step="0.5"
                      value={params.length}
                      onChange={(e) => setParams({ ...params, length: Math.max(0.1, parseFloat(e.target.value) || 1) })}
                      className="w-14 px-1.5 py-0.5 text-xs bg-slate-900 border border-slate-700 rounded text-white font-mono text-center"
                    />
                  </div>
                </div>
              )}

              {/* Width for Cuboid */}
              {params.type === 'cuboid' && (
                <div className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800/80">
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-300 font-medium">{language === 'hi' ? 'चौड़ाई (b):' : 'Breadth (b):'}</span>
                    <span className="text-purple-400 font-mono font-bold">{params.width} cm</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="range"
                      min="1"
                      max="100"
                      step="0.5"
                      value={params.width}
                      onChange={(e) => setParams({ ...params, width: parseFloat(e.target.value) })}
                      className="w-full accent-purple-500 bg-slate-800 h-1.5 rounded-lg cursor-pointer"
                    />
                    <input
                      type="number"
                      min="0.1"
                      step="0.5"
                      value={params.width}
                      onChange={(e) => setParams({ ...params, width: Math.max(0.1, parseFloat(e.target.value) || 1) })}
                      className="w-14 px-1.5 py-0.5 text-xs bg-slate-900 border border-slate-700 rounded text-white font-mono text-center"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        /* STANDARD SPLIT VIEW (Left 3D Canvas, Right Detailed Controls & Math Engine) */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: 3D Interactive Canvas & Exploded Tools */}
          <div className="lg:col-span-7 flex flex-col space-y-4">
            <div className="h-[430px] sm:h-[500px]">
              <ThreeCanvas mode="shape" shapeParams={params} language={language} />
            </div>

            {/* 3D to 2D Step-by-Step Net Unfolding Studio */}
            <div className="bg-slate-900/95 border border-indigo-500/40 rounded-2xl p-4 shadow-2xl backdrop-blur-md">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-base">📦➡️📄</span>
                  <div>
                    <h4 className="text-xs sm:text-sm font-bold text-indigo-300">
                      {language === 'hi'
                        ? '3D से 2D नेट अनफोल्डिंग लैब (Step-by-Step 3D to 2D Net)'
                        : 'Step-by-Step 3D to 2D Net Unfolding Studio'}
                    </h4>
                    <p className="text-[11px] text-slate-400">
                      {unfoldSteps[currentUnfoldStep]?.desc || (language === 'hi' ? 'ठोस से समतल 2D नेट' : 'Solid to 2D flat net')}
                    </p>
                  </div>
                </div>
                <span className="text-xs font-mono font-bold text-indigo-400 bg-indigo-950/80 px-2.5 py-1 rounded-lg border border-indigo-800/60">
                  {language === 'hi' ? `चरण ${currentUnfoldStep}/${unfoldSteps.length - 1}` : `Step ${currentUnfoldStep}/${unfoldSteps.length - 1}`}
                </span>
              </div>

              {/* Step Pills */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-1.5 my-3">
                {unfoldSteps.map((s) => (
                  <button
                    key={s.step}
                    onClick={() => {
                      setIsAutoUnfolding(false);
                      setIsAutoExploding(false);
                      setParams({
                        ...params,
                        unfoldStep: s.step,
                        unfoldProgress: s.step / (unfoldSteps.length - 1),
                        explodedParts: 0,
                      });
                    }}
                    className={`px-2 py-1.5 rounded-lg text-xs font-medium border text-center transition-all truncate ${
                      currentUnfoldStep === s.step
                        ? 'bg-indigo-600 text-white border-indigo-400 shadow-md shadow-indigo-600/30'
                        : 'bg-slate-800/80 text-slate-300 border-slate-700/80 hover:bg-slate-700 hover:text-white'
                    }`}
                    title={s.label}
                  >
                    {s.label}
                  </button>
                ))}
              </div>

              {/* Smooth Progress Slider */}
              <div className="space-y-2 pt-1">
                <div className="flex justify-between text-xs text-slate-400">
                  <span>{language === 'hi' ? '3D ठोस (0%)' : '3D Solid (0%)'}</span>
                  <span className="text-indigo-300 font-mono font-bold">
                    {Math.round((params.unfoldProgress || (currentUnfoldStep / (unfoldSteps.length - 1))) * 100)}% {language === 'hi' ? 'खुला हुआ' : 'Unfolded'}
                  </span>
                  <span>{language === 'hi' ? 'समतल 2D नेट (100%)' : 'Flat 2D Net (100%)'}</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={params.unfoldProgress !== undefined ? params.unfoldProgress : currentUnfoldStep / (unfoldSteps.length - 1)}
                  onChange={(e) => {
                    setIsAutoUnfolding(false);
                    setIsAutoExploding(false);
                    const val = parseFloat(e.target.value);
                    const stepIdx = Math.round(val * (unfoldSteps.length - 1));
                    setParams({
                      ...params,
                      unfoldProgress: val,
                      unfoldStep: stepIdx,
                      explodedParts: 0,
                    });
                  }}
                  className="w-full accent-indigo-400 bg-slate-800 h-2 rounded-lg cursor-pointer"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center justify-between gap-2 pt-3 text-xs border-t border-slate-800/80 mt-3">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      setIsAutoUnfolding(false);
                      const prevS = Math.max(0, currentUnfoldStep - 1);
                      setParams({
                        ...params,
                        unfoldStep: prevS,
                        unfoldProgress: prevS / (unfoldSteps.length - 1),
                        explodedParts: 0,
                      });
                    }}
                    disabled={currentUnfoldStep === 0}
                    className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-slate-300 border border-slate-700 font-medium transition-all"
                  >
                    {language === 'hi' ? '◀ पिछला फलक' : '◀ Prev Face'}
                  </button>
                  <button
                    onClick={() => {
                      setIsAutoUnfolding(false);
                      const nextS = Math.min(unfoldSteps.length - 1, currentUnfoldStep + 1);
                      setParams({
                        ...params,
                        unfoldStep: nextS,
                        unfoldProgress: nextS / (unfoldSteps.length - 1),
                        explodedParts: 0,
                      });
                    }}
                    disabled={currentUnfoldStep === unfoldSteps.length - 1}
                    className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white border border-indigo-400 font-medium transition-all"
                  >
                    {language === 'hi' ? 'अगला फलक खोलें ▶' : 'Next Face ▶'}
                  </button>
                  <button
                    onClick={() => setIsAutoUnfolding(!isAutoUnfolding)}
                    className={`px-3 py-1.5 rounded-lg font-medium border flex items-center gap-1.5 transition-all ${
                      isAutoUnfolding
                        ? 'bg-emerald-600 text-white border-emerald-400 animate-pulse'
                        : 'bg-slate-800 text-indigo-300 hover:text-white border-slate-700'
                    }`}
                  >
                    <Play className="w-3.5 h-3.5" />
                    {isAutoUnfolding
                      ? (language === 'hi' ? 'एनीमेशन रोकें' : 'Stop Animation')
                      : (language === 'hi' ? 'ऑटो 3D ➔ 2D लूप' : 'Auto 3D ➔ 2D Loop')}
                  </button>
                </div>

                <button
                  onClick={() => {
                    setIsAutoUnfolding(false);
                    setParams({
                      ...params,
                      unfoldStep: 0,
                      unfoldProgress: 0,
                      explodedParts: 0,
                      unrollNet: false,
                    });
                  }}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 font-medium transition-all"
                >
                  {language === 'hi' ? '🔄 3D ठोस बंद करें' : '🔄 Close to 3D'}
                </button>
              </div>
            </div>

            {/* Exploded Parts Controller Card */}
            <div className="bg-slate-900/90 border border-amber-900/40 rounded-2xl p-4 shadow-xl backdrop-blur-md">
              <div className="flex items-center justify-between mb-2.5">
                <h4 className="text-xs sm:text-sm font-bold text-amber-300 flex items-center gap-2">
                  <span>⚡</span>
                  {language === 'hi'
                    ? '3D घटक पृथक्करण (Separate & Deconstruct 3D Parts)'
                    : 'Exploded View & Component Separation'}
                </h4>
                <span className="text-xs font-mono font-bold text-amber-400 bg-amber-950/80 px-2 py-0.5 rounded border border-amber-800/60">
                  {Math.round((params.explodedParts || 0) * 100)}% {language === 'hi' ? 'अलग' : 'Separated'}
                </span>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    value={params.explodedParts || 0}
                    onChange={(e) => {
                      setIsAutoExploding(false);
                      setIsAutoUnfolding(false);
                      setParams({ ...params, explodedParts: parseFloat(e.target.value) });
                    }}
                    className="w-full accent-amber-400 bg-slate-800 h-2.5 rounded-lg cursor-pointer"
                  />
                </div>

                <div className="flex flex-wrap items-center justify-between gap-2 pt-1 text-xs">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        setIsAutoExploding(false);
                        setIsAutoUnfolding(false);
                        setParams({ ...params, explodedParts: 0.85, unfoldStep: 0, unfoldProgress: 0 });
                      }}
                      className="px-3 py-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 font-medium transition-all"
                    >
                      {language === 'hi' ? '💥 सारे पार्ट्स अलग करें' : '💥 Separate All Parts'}
                    </button>
                    <button
                      onClick={() => {
                        setIsAutoExploding(false);
                        setParams({ ...params, explodedParts: 0 });
                      }}
                      className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 font-medium transition-all"
                    >
                      {language === 'hi' ? '🔄 वापस जोड़ें (Assemble)' : '🔄 Assemble Solid'}
                    </button>
                    <button
                      onClick={() => setIsAutoExploding(!isAutoExploding)}
                      className={`px-3 py-1.5 rounded-lg font-medium border flex items-center gap-1.5 transition-all ${
                        isAutoExploding
                          ? 'bg-emerald-600 text-white border-emerald-400 animate-pulse'
                          : 'bg-slate-800 text-slate-300 hover:text-white border-slate-700'
                      }`}
                    >
                      <Play className="w-3.5 h-3.5" />
                      {isAutoExploding ? (language === 'hi' ? 'एनीमेशन रोकें' : 'Stop Animation') : (language === 'hi' ? 'ऑटो डीकंस्ट्रक्ट लूप' : 'Auto Loop')}
                    </button>
                  </div>

                  {params.type === 'cylinder' && (
                    <button
                      onClick={() => setParams({ ...params, unrollNet: !params.unrollNet })}
                      className={`px-3 py-1.5 rounded-lg font-medium border transition-all ${
                        params.unrollNet
                          ? 'bg-cyan-600 text-white border-cyan-400'
                          : 'bg-slate-800 text-cyan-300 border-slate-700 hover:bg-slate-700'
                      }`}
                    >
                      {params.unrollNet
                        ? language === 'hi'
                          ? 'खोखला बेलन (Tube)'
                          : 'Tube View'
                        : language === 'hi'
                        ? 'खुला आयताकार वक्र पृष्ठ (2πr×h)'
                        : 'Unroll 2D Sheet'}
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Canvas View Toggles */}
            <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-3 flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2">
                <label className="text-slate-400">{language === 'hi' ? 'रंग (Color):' : 'Color:'}</label>
                <input
                  type="color"
                  value={params.color}
                  onChange={(e) => setParams({ ...params, color: e.target.value })}
                  className="w-7 h-7 rounded-md cursor-pointer border border-slate-700 bg-transparent"
                />
              </div>

              <div className="flex items-center gap-3 sm:gap-4">
                <label className="flex items-center gap-1.5 cursor-pointer text-slate-300 hover:text-white">
                  <input
                    type="checkbox"
                    checked={params.showLabels !== false}
                    onChange={(e) => setParams({ ...params, showLabels: e.target.checked })}
                    className="rounded border-slate-700 text-indigo-600 focus:ring-indigo-500"
                  />
                  {language === 'hi' ? '3D लेबल (Labels)' : '3D Labels'}
                </label>

                <label className="flex items-center gap-1.5 cursor-pointer text-slate-300 hover:text-white">
                  <input
                    type="checkbox"
                    checked={params.wireframe}
                    onChange={(e) => setParams({ ...params, wireframe: e.target.checked })}
                    className="rounded border-slate-700 text-indigo-600 focus:ring-indigo-500"
                  />
                  {language === 'hi' ? 'जालीदार (Wireframe)' : 'Wireframe'}
                </label>

                <label className="flex items-center gap-1.5 cursor-pointer text-slate-300 hover:text-white">
                  <input
                    type="checkbox"
                    checked={params.transparent}
                    onChange={(e) => setParams({ ...params, transparent: e.target.checked })}
                    className="rounded border-slate-700 text-indigo-600 focus:ring-indigo-500"
                  />
                  {language === 'hi' ? 'पारदर्शी (Transparent)' : 'Transparent'}
                </label>
              </div>
            </div>
          </div>

          {/* Right Column: Parameters Input & Step-by-Step Calculation Engine */}
          <div className="lg:col-span-5 flex flex-col space-y-4">
            {/* Dimension Inputs Card */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 sm:p-5">
              <h4 className="text-sm font-semibold text-white mb-3 flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <Layers className="w-4 h-4 text-indigo-400" />
                  {language === 'hi' ? 'माप दर्ज करें (Input Dimensions)' : 'Set Dimensions'}
                </span>
                <span className="text-[11px] font-normal px-2 py-0.5 rounded bg-indigo-950/80 text-indigo-300 border border-indigo-800/60">
                  {params.type.toUpperCase()}
                </span>
              </h4>

              <div className="space-y-3.5">
                {/* Radius Input for Cylinder, Hollow Cylinder, Cone, Sphere, Hemisphere, Frustum */}
                {(params.type === 'cylinder' ||
                  params.type === 'hollow_cylinder' ||
                  params.type === 'cone' ||
                  params.type === 'sphere' ||
                  params.type === 'hemisphere' ||
                  params.type === 'frustum') && (
                  <div>
                    <div className="flex justify-between text-xs font-medium mb-1">
                      <span className="text-slate-300">
                        {params.type === 'hollow_cylinder'
                          ? language === 'hi'
                            ? 'आंतरिक त्रिज्या (Inner r):'
                            : 'Inner Radius (r):'
                          : language === 'hi'
                          ? 'त्रिज्या (Radius r):'
                          : 'Radius (r):'}
                      </span>
                      <span className="text-indigo-400 font-mono font-bold">{params.radius} cm</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <input
                        type="range"
                        min="0.5"
                        max="100"
                        step="0.5"
                        value={params.radius}
                        onChange={(e) => setParams({ ...params, radius: parseFloat(e.target.value) })}
                        className="w-full accent-indigo-500 bg-slate-800 h-2 rounded-lg cursor-pointer"
                      />
                      <input
                        type="number"
                        min="0.1"
                        step="0.5"
                        value={params.radius}
                        onChange={(e) => setParams({ ...params, radius: Math.max(0.1, parseFloat(e.target.value) || 1) })}
                        className="w-16 px-2 py-1 text-xs bg-slate-950 border border-slate-700 rounded-lg text-white font-mono text-center"
                      />
                    </div>
                  </div>
                )}

                {/* Hollow Cylinder Outer Radius */}
                {params.type === 'hollow_cylinder' && (
                  <div>
                    <div className="flex justify-between text-xs font-medium mb-1">
                      <span className="text-slate-300">
                        {language === 'hi' ? 'बाहरी त्रिज्या (Outer R):' : 'Outer Radius (R):'}
                      </span>
                      <span className="text-cyan-400 font-mono font-bold">{params.radiusOuter || 5} cm</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <input
                        type="range"
                        min="1"
                        max="100"
                        step="0.5"
                        value={params.radiusOuter || 5}
                        onChange={(e) => setParams({ ...params, radiusOuter: parseFloat(e.target.value) })}
                        className="w-full accent-cyan-500 bg-slate-800 h-2 rounded-lg cursor-pointer"
                      />
                      <input
                        type="number"
                        min="0.1"
                        step="0.5"
                        value={params.radiusOuter || 5}
                        onChange={(e) =>
                          setParams({ ...params, radiusOuter: Math.max(0.1, parseFloat(e.target.value) || 1) })
                        }
                        className="w-16 px-2 py-1 text-xs bg-slate-950 border border-slate-700 rounded-lg text-white font-mono text-center"
                      />
                    </div>
                  </div>
                )}

                {/* Frustum Top Radius */}
                {params.type === 'frustum' && (
                  <div>
                    <div className="flex justify-between text-xs font-medium mb-1">
                      <span className="text-slate-300">
                        {language === 'hi' ? 'ऊपरी त्रिज्या (Top Radius r2):' : 'Top Radius (r2):'}
                      </span>
                      <span className="text-orange-400 font-mono font-bold">{params.radiusTop} cm</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <input
                        type="range"
                        min="0.5"
                        max="50"
                        step="0.5"
                        value={params.radiusTop}
                        onChange={(e) => setParams({ ...params, radiusTop: parseFloat(e.target.value) })}
                        className="w-full accent-orange-500 bg-slate-800 h-2 rounded-lg cursor-pointer"
                      />
                      <input
                        type="number"
                        min="0.1"
                        step="0.5"
                        value={params.radiusTop}
                        onChange={(e) =>
                          setParams({ ...params, radiusTop: Math.max(0.1, parseFloat(e.target.value) || 1) })
                        }
                        className="w-16 px-2 py-1 text-xs bg-slate-950 border border-slate-700 rounded-lg text-white font-mono text-center"
                      />
                    </div>
                  </div>
                )}

                {/* Height Input for Cylinder, Hollow Cylinder, Cone, Cuboid, Frustum, Prism, Pyramid */}
                {(params.type === 'cylinder' ||
                  params.type === 'hollow_cylinder' ||
                  params.type === 'cone' ||
                  params.type === 'cuboid' ||
                  params.type === 'frustum' ||
                  params.type === 'prism' ||
                  params.type === 'pyramid') && (
                  <div>
                    <div className="flex justify-between text-xs font-medium mb-1">
                      <span className="text-slate-300">
                        {language === 'hi' ? 'ऊंचाई (Height h):' : 'Height (h):'}
                      </span>
                      <span className="text-indigo-400 font-mono font-bold">{params.height} cm</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <input
                        type="range"
                        min="1"
                        max="100"
                        step="0.5"
                        value={params.height}
                        onChange={(e) => setParams({ ...params, height: parseFloat(e.target.value) })}
                        className="w-full accent-indigo-500 bg-slate-800 h-2 rounded-lg cursor-pointer"
                      />
                      <input
                        type="number"
                        min="0.1"
                        step="0.5"
                        value={params.height}
                        onChange={(e) => setParams({ ...params, height: Math.max(0.1, parseFloat(e.target.value) || 1) })}
                        className="w-16 px-2 py-1 text-xs bg-slate-950 border border-slate-700 rounded-lg text-white font-mono text-center"
                      />
                    </div>
                  </div>
                )}

                {/* Length for Cube, Cuboid, Prism, Pyramid */}
                {(params.type === 'cube' ||
                  params.type === 'cuboid' ||
                  params.type === 'prism' ||
                  params.type === 'pyramid') && (
                  <div>
                    <div className="flex justify-between text-xs font-medium mb-1">
                      <span className="text-slate-300">
                        {params.type === 'cube' || params.type === 'prism' || params.type === 'pyramid'
                          ? language === 'hi'
                            ? 'आधार भुजा (Base Side a):'
                            : 'Base Side (a):'
                          : language === 'hi'
                          ? 'लंबाई (Length l):'
                          : 'Length (l):'}
                      </span>
                      <span className="text-emerald-400 font-mono font-bold">{params.length} cm</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <input
                        type="range"
                        min="1"
                        max="100"
                        step="0.5"
                        value={params.length}
                        onChange={(e) => setParams({ ...params, length: parseFloat(e.target.value) })}
                        className="w-full accent-emerald-500 bg-slate-800 h-2 rounded-lg cursor-pointer"
                      />
                      <input
                        type="number"
                        min="0.1"
                        step="0.5"
                        value={params.length}
                        onChange={(e) => setParams({ ...params, length: Math.max(0.1, parseFloat(e.target.value) || 1) })}
                        className="w-16 px-2 py-1 text-xs bg-slate-950 border border-slate-700 rounded-lg text-white font-mono text-center"
                      />
                    </div>
                  </div>
                )}

                {/* Width for Cuboid */}
                {params.type === 'cuboid' && (
                  <div>
                    <div className="flex justify-between text-xs font-medium mb-1">
                      <span className="text-slate-300">
                        {language === 'hi' ? 'चौड़ाई (Breadth/Width b):' : 'Breadth / Width (b):'}
                      </span>
                      <span className="text-purple-400 font-mono font-bold">{params.width} cm</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <input
                        type="range"
                        min="1"
                        max="100"
                        step="0.5"
                        value={params.width}
                        onChange={(e) => setParams({ ...params, width: parseFloat(e.target.value) })}
                        className="w-full accent-purple-500 bg-slate-800 h-2 rounded-lg cursor-pointer"
                      />
                      <input
                        type="number"
                        min="0.1"
                        step="0.5"
                        value={params.width}
                        onChange={(e) => setParams({ ...params, width: Math.max(0.1, parseFloat(e.target.value) || 1) })}
                        className="w-16 px-2 py-1 text-xs bg-slate-950 border border-slate-700 rounded-lg text-white font-mono text-center"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Calculated Output Stats */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-slate-900/90 border border-indigo-900/50 rounded-xl p-3 relative overflow-hidden">
                <div className="text-[11px] font-medium text-indigo-300">
                  {language === 'hi' ? 'आयतन (Volume)' : 'Volume (V)'}
                </div>
                <div className="text-xl font-mono font-bold text-white mt-1">
                  {metrics.volume.toFixed(2)}{' '}
                  <span className="text-xs font-normal text-slate-400">cm³</span>
                </div>
                <div className="text-[10px] text-slate-400 mt-0.5">
                  {(params.type === 'cylinder' && 'π × r² × h') ||
                    (params.type === 'cone' && '(1/3)π × r² × h') ||
                    (params.type === 'cube' && 'a³') ||
                    (params.type === 'cuboid' && 'l × b × h') ||
                    (params.type === 'sphere' && '(4/3)π × r³') ||
                    (params.type === 'hemisphere' && '(2/3)π × r³') ||
                    '(1/3)πh(r1²+r2²+r1r2)'}
                </div>
              </div>

              <div className="bg-slate-900/90 border border-emerald-900/50 rounded-xl p-3">
                <div className="text-[11px] font-medium text-emerald-300">
                  {language === 'hi' ? 'वक्र पृष्ठ (CSA / LSA)' : 'Curved Area (CSA)'}
                </div>
                <div className="text-xl font-mono font-bold text-white mt-1">
                  {metrics.curvedSurfaceArea.toFixed(2)}{' '}
                  <span className="text-xs font-normal text-slate-400">cm²</span>
                </div>
                <div className="text-[10px] text-slate-400 mt-0.5">
                  {(params.type === 'cylinder' && '2 × π × r × h') ||
                    (params.type === 'cone' && 'π × r × l') ||
                    (params.type === 'cube' && '4 × a²') ||
                    (params.type === 'cuboid' && '2h(l + b)') ||
                    '4 × π × r²'}
                </div>
              </div>

              <div className="bg-slate-900/90 border border-amber-900/50 rounded-xl p-3">
                <div className="text-[11px] font-medium text-amber-300">
                  {language === 'hi' ? 'कुल पृष्ठ (TSA)' : 'Total Area (TSA)'}
                </div>
                <div className="text-xl font-mono font-bold text-white mt-1">
                  {metrics.totalSurfaceArea.toFixed(2)}{' '}
                  <span className="text-xs font-normal text-slate-400">cm²</span>
                </div>
                <div className="text-[10px] text-slate-400 mt-0.5">
                  {(params.type === 'cylinder' && '2πr(r + h)') ||
                    (params.type === 'cone' && 'πr(l + r)') ||
                    (params.type === 'cube' && '6 × a²') ||
                    (params.type === 'cuboid' && '2(lb + bh + hl)') ||
                    '4πr²'}
                </div>
              </div>

              <div className="bg-slate-900/90 border border-purple-900/50 rounded-xl p-3">
                <div className="text-[11px] font-medium text-purple-300">
                  {metrics.slantHeight
                    ? language === 'hi'
                      ? 'तिर्यक ऊंचाई (Slant Height l)'
                      : 'Slant Height (l)'
                    : metrics.spaceDiagonal
                    ? language === 'hi'
                      ? 'विकर्ण (Space Diagonal)'
                      : 'Space Diagonal (d)'
                    : language === 'hi'
                    ? 'व्यास (Diameter)'
                    : 'Diameter (d)'}
                </div>
                <div className="text-xl font-mono font-bold text-white mt-1">
                  {(metrics.slantHeight || metrics.spaceDiagonal || params.radius * 2).toFixed(2)}{' '}
                  <span className="text-xs font-normal text-slate-400">cm</span>
                </div>
                <div className="text-[10px] text-slate-400 mt-0.5">
                  {metrics.slantHeight ? '√(r² + h²)' : metrics.spaceDiagonal ? '√(l² + b² + h²)' : '2 × r'}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Special Deconstructed Components Breakdown Card (For Belan & other shapes) */}
      {params.type === 'cylinder' && (
        <div className="bg-slate-900/90 border border-indigo-900/60 rounded-2xl p-4 sm:p-5 backdrop-blur-md">
          <h4 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
            <span className="text-lg">🛢️</span>
            {language === 'hi'
              ? 'बेलन के अलग-अलग भागों का सचित्र गणितीय विश्लेषण (Parts Breakdown)'
              : 'Cylinder Deconstructed Parts Analysis'}
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {/* Top Base Lid */}
            <div className="p-3.5 rounded-xl bg-slate-950/70 border border-emerald-500/40">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                  {language === 'hi' ? '1. ऊपरी वृत्ताकार सिरा' : '1. Top Circular Base'}
                </span>
                <span className="text-xs font-mono font-bold text-emerald-300">πr²</span>
              </div>
              <p className="text-xs text-slate-300 mt-1.5 font-mono">
                = π × {r}² = {topBaseArea.toFixed(2)} cm²
              </p>
              <p className="text-[11px] text-slate-400 mt-1">
                {language === 'hi' ? 'ऊपर का ढक्कन (वृत्ताकार आधार)' : 'Top circular lid disk'}
              </p>
            </div>

            {/* Curved Surface */}
            <div className="p-3.5 rounded-xl bg-slate-950/70 border border-indigo-500/40">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-indigo-400 flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-indigo-400" />
                  {language === 'hi' ? '2. वक्र पृष्ठ (खुला आयत)' : '2. Curved Lateral Mantle'}
                </span>
                <span className="text-xs font-mono font-bold text-indigo-300">2πrh</span>
              </div>
              <p className="text-xs text-slate-300 mt-1.5 font-mono">
                = 2 × π × {r} × {h} = {csaArea.toFixed(2)} cm²
              </p>
              <p className="text-[11px] text-slate-400 mt-1">
                {language === 'hi' ? 'लंबाई 2πr (परिधि) × ऊंचाई h' : 'Unrolls into rectangle: 2πr × h'}
              </p>
            </div>

            {/* Bottom Base Lid */}
            <div className="p-3.5 rounded-xl bg-slate-950/70 border border-cyan-500/40">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-cyan-400 flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-cyan-400" />
                  {language === 'hi' ? '3. निचला वृत्ताकार सिरा' : '3. Bottom Circular Base'}
                </span>
                <span className="text-xs font-mono font-bold text-cyan-300">πr²</span>
              </div>
              <p className="text-xs text-slate-300 mt-1.5 font-mono">
                = π × {r}² = {botBaseArea.toFixed(2)} cm²
              </p>
              <p className="text-[11px] text-slate-400 mt-1">
                {language === 'hi' ? 'नीचे का तला (वृत्ताकार आधार)' : 'Bottom circular base disk'}
              </p>
            </div>
          </div>

          <div className="mt-3 p-3 rounded-xl bg-indigo-950/40 border border-indigo-800/50 flex flex-wrap items-center justify-between gap-2 text-xs">
            <span className="text-indigo-200 font-medium">
              💡 {language === 'hi' ? 'कुल पृष्ठीय क्षेत्रफल (TSA) = वक्र पृष्ठ + दोनों सिरों का क्षेत्रफल' : 'Total Surface Area (TSA) = CSA + 2 × Base Area'}
            </span>
            <span className="font-mono text-emerald-300 font-bold">
              TSA = {csaArea.toFixed(2)} + 2 × {topBaseArea.toFixed(2)} = {tsaArea.toFixed(2)} cm²
            </span>
          </div>
        </div>
      )}

      {/* Formulas Reference Table & Step-by-step Solution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Formulas Cheat-Sheet */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 sm:p-5">
          <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-3 flex items-center justify-between">
            <span>{language === 'hi' ? 'सूत्र निर्देशिका (Formula Reference)' : 'Formulas Reference'}</span>
            <span className="text-[10px] text-indigo-400 font-normal">Click to copy</span>
          </h4>
          <div className="space-y-1.5">
            {Object.entries(language === 'hi' ? metrics.formulasHi : metrics.formulasEn).map(([key, formula]) => (
              <div
                key={key}
                onClick={() => copyText(formula, key)}
                className="flex items-center justify-between p-2.5 rounded-lg bg-slate-950/70 hover:bg-slate-800/80 border border-slate-800/60 cursor-pointer transition-all text-xs"
              >
                <span className="text-slate-300 font-medium">{key}</span>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-indigo-300 bg-indigo-950/60 px-2 py-0.5 rounded border border-indigo-800/40">
                    {formula}
                  </span>
                  {copiedFormula === key ? (
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                  ) : (
                    <Copy className="w-3.5 h-3.5 text-slate-500 hover:text-slate-300" />
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Step-by-Step Derivation Card */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 sm:p-5 backdrop-blur-md">
          <h4 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
            <Calculator className="w-4 h-4 text-emerald-400" />
            {language === 'hi'
              ? 'स्टेप-बाय-स्टेप गणना (Detailed Steps)'
              : 'Detailed Step-by-Step Derivation'}
          </h4>

          <div className="space-y-2">
            {(language === 'hi' ? metrics.stepsHi : metrics.stepsEn).map((step, idx) => (
              <div
                key={idx}
                className="flex items-start gap-3 p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/80 text-xs text-slate-200"
              >
                <span className="flex-shrink-0 w-5 h-5 rounded-full bg-indigo-950 text-indigo-400 border border-indigo-700/60 flex items-center justify-center font-bold text-[11px]">
                  {idx + 1}
                </span>
                <p className="font-mono pt-0.5">{step}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
