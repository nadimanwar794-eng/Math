import React, { useState, useEffect } from 'react';
import { ActiveTab } from './types';
import { Navbar } from './components/Navbar';
import { CubeCuttingLabTab } from './components/CubeCuttingLabTab';
import { ShapeVisualizerTab } from './components/ShapeVisualizerTab';
import { Geometry2DTab } from './components/Geometry2DTab';
import { DiceReasoningTab } from './components/DiceReasoningTab';
import { PracticeQuizTab } from './components/PracticeQuizTab';
import { OfflineSolverTab } from './components/OfflineSolverTab';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('cutting_lab');
  const [language, setLanguage] = useState<'hi' | 'en'>('hi');
  const [projectorMode, setProjectorMode] = useState<boolean>(false);
  const [focusMode, setFocusMode] = useState<boolean>(false);

  // Keyboard shortcut: Press 'f' or 'F' (when not in input) to toggle focus mode
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.key.toLowerCase() === 'f' &&
        !['INPUT', 'TEXTAREA', 'SELECT'].includes((e.target as HTMLElement)?.tagName) &&
        !e.ctrlKey &&
        !e.metaKey
      ) {
        setFocusMode((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-indigo-500 selection:text-white transition-all">
      {/* Navigation Header */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        language={language}
        setLanguage={setLanguage}
        projectorMode={projectorMode}
        setProjectorMode={setProjectorMode}
        focusMode={focusMode}
        setFocusMode={setFocusMode}
      />

      {/* Main Content Area */}
      <main
        className={`flex-1 w-full mx-auto transition-all ${
          focusMode
            ? 'w-full max-w-[1920px] px-1 sm:px-3 py-1'
            : projectorMode
            ? 'max-w-[1920px] px-2 sm:px-4 py-2'
            : 'max-w-7xl px-2 sm:px-4 md:px-6 py-2 sm:py-4'
        }`}
      >
        {activeTab === 'cutting_lab' && (
          <CubeCuttingLabTab language={language} focusMode={focusMode} onToggleFocus={() => setFocusMode((p) => !p)} />
        )}
        {activeTab === 'shapes_3d' && (
          <ShapeVisualizerTab language={language} projectorMode={projectorMode} focusMode={focusMode} onToggleFocus={() => setFocusMode((p) => !p)} />
        )}
        {activeTab === 'geometry_2d' && (
          <Geometry2DTab language={language} projectorMode={projectorMode} />
        )}
        {activeTab === 'dice_reasoning' && <DiceReasoningTab language={language} />}
        {activeTab === 'offline_solver' && <OfflineSolverTab language={language} />}
        {activeTab === 'quiz_practice' && <PracticeQuizTab language={language} />}
      </main>

      {/* Footer */}
      {!projectorMode && !focusMode && (
        <footer className="border-t border-slate-900 bg-slate-950/60 py-3 text-center text-xs text-slate-500">
          <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
            <span>
              {language === 'hi'
                ? '3D व 2D गणित ज्यामिति, क्षेत्रमिति व रीज़निंग लैब • 100% ऑफ़लाइन'
                : '3D & 2D Geometry, Mensuration & Reasoning Studio • 100% Offline'}
            </span>
            <span className="text-slate-600 font-mono text-[11px]">
              {language === 'hi' ? 'फुल डायग्राम के लिए F दबाएं या "डायग्राम बड़ा करें" पर क्लिक करें' : 'Press F or click "Clean View" for full diagram'}
            </span>
          </div>
        </footer>
      )}
    </div>
  );
}

