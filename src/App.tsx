import React, { useState } from 'react';
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
      />

      {/* Main Content Area */}
      <main
        className={`flex-1 w-full mx-auto px-3 sm:px-6 py-4 sm:py-6 transition-all ${
          projectorMode ? 'max-w-[1920px] px-2 sm:px-4 py-2' : 'max-w-7xl'
        }`}
      >
        {activeTab === 'cutting_lab' && <CubeCuttingLabTab language={language} />}
        {activeTab === 'shapes_3d' && (
          <ShapeVisualizerTab language={language} projectorMode={projectorMode} />
        )}
        {activeTab === 'geometry_2d' && (
          <Geometry2DTab language={language} projectorMode={projectorMode} />
        )}
        {activeTab === 'dice_reasoning' && <DiceReasoningTab language={language} />}
        {activeTab === 'offline_solver' && <OfflineSolverTab language={language} />}
        {activeTab === 'quiz_practice' && <PracticeQuizTab language={language} />}
      </main>

      {/* Footer */}
      {!projectorMode && (
        <footer className="border-t border-slate-900 bg-slate-950/60 py-5 text-center text-xs text-slate-500">
          <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
            <span>
              {language === 'hi'
                ? '3D व 2D गणित ज्यामिति, क्षेत्रमिति व रीज़निंग लैब • 100% ऑफ़लाइन'
                : '3D & 2D Geometry, Mensuration & Reasoning Studio • 100% Offline'}
            </span>
            <span className="text-slate-600 font-mono">Interactive WebGL 3D & Vector SVG Engine</span>
          </div>
        </footer>
      )}
    </div>
  );
}
