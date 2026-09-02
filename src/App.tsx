import React, { useState, useEffect } from 'react';
import { ActiveTab } from './types';
import { Navbar } from './components/Navbar';
import { CubeCuttingLabTab } from './components/CubeCuttingLabTab';
import { ShapeVisualizerTab } from './components/ShapeVisualizerTab';
import { Geometry2DTab } from './components/Geometry2DTab';
import { DiceReasoningTab } from './components/DiceReasoningTab';
import { PracticeQuizTab } from './components/PracticeQuizTab';
import { OfflineSolverTab } from './components/OfflineSolverTab';
import { OfflineIndicator } from './components/OfflineIndicator';
import {
  Box,
  Brain,
  Calculator,
  Compass,
  Dices,
  Layers,
  Sparkles,
} from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('cutting_lab');
  const [language, setLanguage] = useState<'hi' | 'en'>('hi');
  const [projectorMode, setProjectorMode] = useState<boolean>(false);
  const [focusMode, setFocusMode] = useState<boolean>(false);
  const [diagramOnlyMode, setDiagramOnlyMode] = useState<boolean>(false);

  // Keyboard shortcut: Press 'Escape' to exit diagram-only mode, or 'd'/'f' to toggle
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const isInput = ['INPUT', 'TEXTAREA', 'SELECT'].includes((e.target as HTMLElement)?.tagName);
      if (isInput) return;

      if (e.key === 'Escape' && diagramOnlyMode) {
        setDiagramOnlyMode(false);
      } else if (e.key.toLowerCase() === 'd' && !e.ctrlKey && !e.metaKey) {
        setDiagramOnlyMode((prev) => {
          const next = !prev;
          if (next && (activeTab === 'offline_solver' || activeTab === 'quiz_practice')) {
            setActiveTab('shapes_3d');
          }
          return next;
        });
      } else if (e.key.toLowerCase() === 'f' && !e.ctrlKey && !e.metaKey) {
        setFocusMode((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [diagramOnlyMode, activeTab]);

  const handleToggleDiagramOnly = () => {
    setDiagramOnlyMode((prev) => {
      const next = !prev;
      if (next && (activeTab === 'offline_solver' || activeTab === 'quiz_practice')) {
        setActiveTab('shapes_3d');
      }
      return next;
    });
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-indigo-500 selection:text-white transition-all">
      {/* Navigation Header - completely hidden in diagramOnlyMode */}
      {!diagramOnlyMode && (
        <Navbar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          language={language}
          setLanguage={setLanguage}
          projectorMode={projectorMode}
          setProjectorMode={setProjectorMode}
          focusMode={focusMode}
          setFocusMode={setFocusMode}
          diagramOnlyMode={diagramOnlyMode}
          onToggleDiagramOnly={handleToggleDiagramOnly}
        />
      )}

      {/* Main Content Area */}
      <main
        className={`flex-1 w-full mx-auto transition-all ${
          diagramOnlyMode
            ? 'w-screen h-screen fixed inset-0 z-50 p-0 m-0 overflow-hidden bg-slate-950'
            : focusMode
            ? 'w-full max-w-[1920px] px-1 sm:px-3 py-1'
            : projectorMode
            ? 'max-w-[1920px] px-2 sm:px-4 py-2'
            : 'max-w-7xl px-2 sm:px-4 md:px-6 py-2 sm:py-4'
        }`}
      >
        {activeTab === 'cutting_lab' && (
          <CubeCuttingLabTab
            language={language}
            focusMode={focusMode}
            onToggleFocus={() => setFocusMode((p) => !p)}
            diagramOnlyMode={diagramOnlyMode}
            onToggleDiagramOnly={handleToggleDiagramOnly}
            onCancelDiagramOnly={() => setDiagramOnlyMode(false)}
            onSelectTab={setActiveTab}
          />
        )}
        {activeTab === 'shapes_3d' && (
          <ShapeVisualizerTab
            language={language}
            projectorMode={projectorMode}
            focusMode={focusMode}
            onToggleFocus={() => setFocusMode((p) => !p)}
            diagramOnlyMode={diagramOnlyMode}
            onToggleDiagramOnly={handleToggleDiagramOnly}
            onCancelDiagramOnly={() => setDiagramOnlyMode(false)}
            onSelectTab={setActiveTab}
          />
        )}
        {activeTab === 'geometry_2d' && (
          <Geometry2DTab
            language={language}
            projectorMode={projectorMode}
            diagramOnlyMode={diagramOnlyMode}
            onToggleDiagramOnly={handleToggleDiagramOnly}
            onCancelDiagramOnly={() => setDiagramOnlyMode(false)}
            onSelectTab={setActiveTab}
          />
        )}
        {activeTab === 'dice_reasoning' && (
          <DiceReasoningTab
            language={language}
            diagramOnlyMode={diagramOnlyMode}
            onToggleDiagramOnly={handleToggleDiagramOnly}
            onCancelDiagramOnly={() => setDiagramOnlyMode(false)}
            onSelectTab={setActiveTab}
          />
        )}
        {activeTab === 'offline_solver' && <OfflineSolverTab language={language} />}
        {activeTab === 'quiz_practice' && <PracticeQuizTab language={language} />}
      </main>

      {/* Connectivity & Offline Status Indicator - hidden in diagramOnlyMode */}
      {!diagramOnlyMode && <OfflineIndicator language={language} />}

      {/* Interactive Footer & Quick Module Selector - hidden in diagramOnlyMode */}
      {!diagramOnlyMode && !projectorMode && !focusMode && (
        <footer className="border-t border-slate-900 bg-slate-950/80 backdrop-blur-md py-3 sm:py-4 text-xs text-slate-400">
          <div className="max-w-7xl mx-auto px-4 flex flex-col gap-3">
            {/* Quick 2D, 3D, Dice, Cube Slicing Module Selector in Footer */}
            <div className="flex flex-wrap items-center justify-between gap-2 p-2 sm:p-2.5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-md">
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-300 px-2 py-0.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>{language === 'hi' ? 'त्वरित चयन / नेविगेशन:' : 'Quick Select:'}</span>
              </div>

              <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                {[
                  { id: 'geometry_2d' as ActiveTab, nameHi: '📐 2D ज्यामिति', nameEn: '📐 2D Geometry' },
                  { id: 'shapes_3d' as ActiveTab, nameHi: '📦 3D ठोस', nameEn: '📦 3D Solids' },
                  { id: 'dice_reasoning' as ActiveTab, nameHi: '🎲 पासा (Dice)', nameEn: '🎲 Dice Reasoning' },
                  { id: 'cutting_lab' as ActiveTab, nameHi: '🧊 घन काटना', nameEn: '🧊 Cube Slicing' },
                  { id: 'offline_solver' as ActiveTab, nameHi: '🧮 सॉल्वर', nameEn: '🧮 Solver' },
                  { id: 'quiz_practice' as ActiveTab, nameHi: '🧠 क्विज़', nameEn: '🧠 Quiz' },
                ].map((item) => {
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setActiveTab(item.id)}
                      className={`px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                        isActive
                          ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30 ring-1 ring-indigo-400'
                          : 'bg-slate-950 text-slate-300 hover:text-white hover:bg-slate-800 border border-slate-800'
                      }`}
                    >
                      <span>{language === 'hi' ? item.nameHi : item.nameEn}</span>
                      {isActive && (
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Bottom Credits & Info */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-slate-500 pt-0.5 text-center sm:text-left">
              <span>
                {language === 'hi'
                  ? '3D व 2D गणित ज्यामिति, क्षेत्रमिति व रीज़निंग लैब • 100% ऑफ़लाइन'
                  : '3D & 2D Geometry, Mensuration & Reasoning Studio • 100% Offline'}
              </span>
              <span className="text-slate-600 font-mono text-[11px]">
                {language === 'hi'
                  ? 'सिर्फ डायग्राम के लिए "केवल डायग्राम मोड" बटन या "D" दबाएं'
                  : 'Press D or click "Only Diagram Mode" for pure fullscreen diagram'}
              </span>
            </div>
          </div>
        </footer>
      )}
    </div>
  );
}


