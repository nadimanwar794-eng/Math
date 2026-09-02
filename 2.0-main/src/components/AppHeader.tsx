import React, { useState } from 'react';
import { PWAInstallButton } from './PWAInstallButton';
import {
  Box,
  Compass,
  Layers,
  Sparkles,
  Calculator,
  Brain,
  Maximize2,
  Minimize2,
  Globe,
  Dices,
  Eye,
  Check,
} from 'lucide-react';
import { ShapeType, Geometry2DShapeType } from '../types';

export type DimensionMode = '3d' | '2d';
export type ViewMode = 'visualizer' | 'qa_solver';

export type Shape3DChoice =
  | 'cube_lab'
  | 'dice_reasoning'
  | ShapeType;

export type Shape2DChoice = Geometry2DShapeType;

interface AppHeaderProps {
  dimension: DimensionMode;
  setDimension: (dim: DimensionMode) => void;
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
  selected3DShape: Shape3DChoice;
  setSelected3DShape: (shape: Shape3DChoice) => void;
  selected2DShape: Shape2DChoice;
  setSelected2DShape: (shape: Shape2DChoice) => void;
  language: 'hi' | 'en';
  setLanguage: (lang: 'hi' | 'en') => void;
  diagramOnlyMode: boolean;
  onToggleDiagramOnly: () => void;
}

export const AppHeader: React.FC<AppHeaderProps> = ({
  dimension,
  setDimension,
  viewMode,
  setViewMode,
  selected3DShape,
  setSelected3DShape,
  selected2DShape,
  setSelected2DShape,
  language,
  setLanguage,
  diagramOnlyMode,
  onToggleDiagramOnly,
}) => {
  const [isFullscreen, setIsFullscreen] = useState(false);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  // 3D Shapes list (Default is cube_lab)
  const shapes3D: { id: Shape3DChoice; nameHi: string; nameEn: string; icon: string; badgeHi?: string; badgeEn?: string }[] = [
    { id: 'cube_lab', nameHi: '🧊 घन-घनाभ रीज़निंग लैब', nameEn: '🧊 Cube-Cuboid Lab', icon: '🧊', badgeHi: 'डिफ़ॉल्ट', badgeEn: 'Default' },
    { id: 'dice_reasoning', nameHi: '🎲 पासा रीज़निंग व नेट', nameEn: '🎲 Dice Reasoning', icon: '🎲' },
    { id: 'cylinder', nameHi: '🛢️ बेलन (Cylinder)', nameEn: '🛢️ Cylinder', icon: '🛢️' },
    { id: 'hollow_cylinder', nameHi: '🔘 खोखला बेलन', nameEn: '🔘 Hollow Cylinder', icon: '🔘' },
    { id: 'cone', nameHi: '🍦 शंकु (Cone)', nameEn: '🍦 Cone', icon: '🍦' },
    { id: 'sphere', nameHi: '🔮 गोला (Sphere)', nameEn: '🔮 Sphere', icon: '🔮' },
    { id: 'hemisphere', nameHi: '🥣 अर्धगोला', nameEn: '🥣 Hemisphere', icon: '🥣' },
    { id: 'frustum', nameHi: '🏺 छिन्नक (Frustum)', nameEn: '🏺 Frustum', icon: '🏺' },
    { id: 'prism', nameHi: '🔺 प्रिज्म (Prism)', nameEn: '🔺 Prism', icon: '🔺' },
    { id: 'pyramid', nameHi: '⛺ पिरामिड (Pyramid)', nameEn: '⛺ Pyramid', icon: '⛺' },
    { id: 'wheel', nameHi: '⚙️ पहिया / रोलर', nameEn: '⚙️ Wheel / Roller', icon: '⚙️' },
  ];

  // 2D Shapes list (Default is square)
  const shapes2D: { id: Shape2DChoice; nameHi: string; nameEn: string; icon: string }[] = [
    { id: 'square', nameHi: '🔲 वर्ग (Square)', nameEn: '🔲 Square', icon: '🔲' },
    { id: 'rectangle', nameHi: '▭ आयत (Rectangle)', nameEn: '▭ Rectangle', icon: '▭' },
    { id: 'rhombus', nameHi: '🔷 समचतुर्भुज (Rhombus)', nameEn: '🔷 Rhombus', icon: '🔷' },
    { id: 'parallelogram', nameHi: '▱ समांतर चतुर्भुज', nameEn: '▱ Parallelogram', icon: '▱' },
    { id: 'trapezium', nameHi: '⏢ समलंब चतुर्भुज', nameEn: '⏢ Trapezium', icon: '⏢' },
    { id: 'circle', nameHi: '🔘 वृत्त (Circle)', nameEn: '🔘 Circle', icon: '🔘' },
    { id: 'semicircle', nameHi: '🌓 अर्धवृत्त', nameEn: '🌓 Semicircle', icon: '🌓' },
    { id: 'ring', nameHi: '⭕ वलय / रिंग', nameEn: '⭕ Ring / Annulus', icon: '⭕' },
    { id: 'equilateral_triangle', nameHi: '📐 समबाहु त्रिभुज', nameEn: '📐 Equilateral Δ', icon: '📐' },
    { id: 'right_triangle', nameHi: '📐 समकोण त्रिभुज', nameEn: '📐 Right Δ (90°)', icon: '📐' },
    { id: 'scalene_triangle', nameHi: '📐 विषमबाहु (हीरोन)', nameEn: '📐 Scalene Δ', icon: '📐' },
    { id: 'path_rectangle', nameHi: '🛣️ रास्ते (Pathway)', nameEn: '🛣️ Paths', icon: '🛣️' },
    { id: 'running_track', nameHi: '🏃 रनिंग ट्रैक', nameEn: '🏃 Running Track', icon: '🏃' },
    { id: 'kite', nameHi: '🪁 पतंग (Kite)', nameEn: '🪁 Kite', icon: '🪁' },
  ];

  return (
    <header className="w-full bg-slate-900/95 backdrop-blur-md border-b border-slate-800/80 sticky top-0 z-40 shadow-lg">
      {/* 1. TOP BRANDING & PRIMARY CONTROLS BAR */}
      <div className="max-w-7xl mx-auto px-2 sm:px-4 py-2 sm:py-2.5 flex flex-wrap items-center justify-between gap-2.5">
        {/* Logo & Title */}
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-indigo-700 flex items-center justify-center text-white font-bold shadow-md shadow-indigo-600/30 ring-1 ring-white/20">
            {dimension === '3d' ? (
              <Box className="w-5 h-5 animate-pulse" />
            ) : (
              <Compass className="w-5 h-5 animate-pulse" />
            )}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base sm:text-lg font-extrabold tracking-tight text-white">
                {language === 'hi' ? 'गणित 3D व 2D स्टूडियो' : 'Math 3D & 2D Studio'}
              </h1>
              <span className="hidden sm:inline-block px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                100% Offline
              </span>
            </div>
            <p className="text-[11px] text-slate-400 leading-tight hidden xs:block">
              {language === 'hi'
                ? 'घन-घनाभ रीज़निंग • 3D ठोस • 2D क्षेत्रमिति • Q&A सॉल्वर'
                : 'Cube-Cuboid Reasoning • 3D Solids • 2D Mensuration • Q&A Solver'}
            </p>
          </div>
        </div>

        {/* PRIMARY FILTERS: 1. Dimension (3D vs 2D) & 2. View Mode (Visualizer vs Q&A Solver) */}
        <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
          {/* PRIMARY DIMENSION FILTER (3D vs 2D) */}
          <div className="flex items-center p-0.5 sm:p-1 rounded-xl bg-slate-950/90 border border-slate-800 shadow-inner">
            <button
              id="filter-3d-btn"
              onClick={() => setDimension('3d')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                dimension === '3d'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/40 ring-1 ring-indigo-400'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <Box className="w-3.5 h-3.5" />
              <span>3D {language === 'hi' ? 'ठोस व रीज़निंग' : 'Solids & Reasoning'}</span>
            </button>
            <button
              id="filter-2d-btn"
              onClick={() => setDimension('2d')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                dimension === '2d'
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/40 ring-1 ring-emerald-400'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <Compass className="w-3.5 h-3.5" />
              <span>2D {language === 'hi' ? 'समतल व क्षेत्रमिति' : '2D Mensuration'}</span>
            </button>
          </div>

          {/* MODE TOGGLE: Visualizer Lab vs Q&A Solver */}
          <div className="flex items-center p-0.5 sm:p-1 rounded-xl bg-slate-950/90 border border-slate-800 shadow-inner">
            <button
              id="mode-visualizer-btn"
              onClick={() => setViewMode('visualizer')}
              className={`px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                viewMode === 'visualizer'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/40 ring-1 ring-blue-400'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span className="hidden sm:inline">
                {language === 'hi' ? '3D/2D विज़ुअलाइज़र' : 'Visualizer Lab'}
              </span>
              <span className="sm:hidden">{language === 'hi' ? 'विज़ुअलाइज़र' : 'Lab'}</span>
            </button>
            <button
              id="mode-qa-solver-btn"
              onClick={() => setViewMode('qa_solver')}
              className={`px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                viewMode === 'qa_solver'
                  ? 'bg-amber-600 text-white shadow-md shadow-amber-600/40 ring-1 ring-amber-400'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <Calculator className="w-3.5 h-3.5 text-yellow-200" />
              <span>{language === 'hi' ? 'Q&A व सॉल्वर' : 'Q&A Solver'}</span>
            </button>
          </div>

          {/* UTILITY ACTIONS: Language + Fullscreen */}
          <div className="flex items-center gap-1">
            <button
              id="lang-toggle-btn"
              onClick={() => setLanguage(language === 'hi' ? 'en' : 'hi')}
              className="px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold flex items-center gap-1.5 border border-slate-700/80 transition-all cursor-pointer"
              title="Toggle Language / भाषा बदलें"
            >
              <Globe className="w-3.5 h-3.5 text-cyan-400" />
              <span>{language === 'hi' ? 'English' : 'हिन्दी'}</span>
            </button>

            <button
              id="fullscreen-toggle-btn"
              onClick={toggleFullscreen}
              className="p-1.5 sm:p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700/80 transition-all cursor-pointer"
              title="Toggle Fullscreen"
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>

            <PWAInstallButton language={language} />
          </div>
        </div>
      </div>

      {/* 2. SECONDARY FILTER BAR (AAKRITI / SHAPES SUB-FILTER - ONLY VISIBLE IN VISUALIZER MODE) */}
      {viewMode === 'visualizer' && (
        <div className="w-full bg-slate-950/80 border-t border-slate-800/60 px-2 sm:px-4 py-1.5 overflow-x-auto no-scrollbar shadow-inner">
          <div className="max-w-7xl mx-auto flex items-center gap-1.5 sm:gap-2 min-w-max">
            <div className="flex items-center gap-1 text-[11px] font-bold text-slate-400 uppercase tracking-wider pr-1">
              <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
              <span>{dimension === '3d' ? (language === 'hi' ? '3D आकृतियां:' : '3D Shapes:') : (language === 'hi' ? '2D आकृतियां:' : '2D Shapes:')}</span>
            </div>

            {dimension === '3d'
              ? shapes3D.map((item) => {
                  const isSelected = selected3DShape === item.id;
                  return (
                    <button
                      key={item.id}
                      id={`shape-3d-${item.id}`}
                      onClick={() => {
                        setSelected3DShape(item.id);
                      }}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap ${
                        isSelected
                          ? 'bg-gradient-to-r from-indigo-600 to-indigo-500 text-white shadow-md shadow-indigo-600/30 ring-1 ring-indigo-300'
                          : 'bg-slate-900/90 text-slate-300 hover:text-white hover:bg-slate-800 border border-slate-800'
                      }`}
                    >
                      <span>{language === 'hi' ? item.nameHi : item.nameEn}</span>
                      {item.badgeHi && (
                        <span className="px-1.5 py-0.2 rounded-full text-[9px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                          {language === 'hi' ? item.badgeHi : item.badgeEn}
                        </span>
                      )}
                      {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />}
                    </button>
                  );
                })
              : shapes2D.map((item) => {
                  const isSelected = selected2DShape === item.id;
                  return (
                    <button
                      key={item.id}
                      id={`shape-2d-${item.id}`}
                      onClick={() => {
                        setSelected2DShape(item.id);
                      }}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap ${
                        isSelected
                          ? 'bg-gradient-to-r from-emerald-600 to-emerald-500 text-white shadow-md shadow-emerald-600/30 ring-1 ring-emerald-300'
                          : 'bg-slate-900/90 text-slate-300 hover:text-white hover:bg-slate-800 border border-slate-800'
                      }`}
                    >
                      <span>{language === 'hi' ? item.nameHi : item.nameEn}</span>
                      {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />}
                    </button>
                  );
                })}
          </div>
        </div>
      )}
    </header>
  );
};
