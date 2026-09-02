import React, { useState, useEffect } from 'react';
import { ShapeType, Geometry2DShapeType } from './types';
import { AppHeader, DimensionMode, ViewMode, Shape3DChoice, Shape2DChoice } from './components/AppHeader';
import { CubeCuttingLabTab } from './components/CubeCuttingLabTab';
import { ShapeVisualizerTab } from './components/ShapeVisualizerTab';
import { Geometry2DTab } from './components/Geometry2DTab';
import { DiceReasoningTab } from './components/DiceReasoningTab';
import { QASolverView } from './components/QASolverView';
import { OfflineIndicator } from './components/OfflineIndicator';

export default function App() {
  // 1. Primary Dimension Filter (Default is 3D)
  const [dimension, setDimension] = useState<DimensionMode>('3d');

  // 2. View Mode: Visualizer Lab vs Q&A Solver
  const [viewMode, setViewMode] = useState<ViewMode>('visualizer');

  // 3. Secondary Shape Filter (Default for 3D is 'cube_lab' - Cube & Cuboid Reasoning Lab)
  const [selected3DShape, setSelected3DShape] = useState<Shape3DChoice>('cube_lab');
  const [selected2DShape, setSelected2DShape] = useState<Shape2DChoice>('square');

  // 4. Localization & Display Modes
  const [language, setLanguage] = useState<'hi' | 'en'>('hi');
  const [projectorMode, setProjectorMode] = useState<boolean>(false);
  const [focusMode, setFocusMode] = useState<boolean>(false);
  const [diagramOnlyMode, setDiagramOnlyMode] = useState<boolean>(false);

  // Keyboard shortcuts: 'Escape' to exit diagram-only, 'd' for diagram only, 'f' for focus
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const isInput = ['INPUT', 'TEXTAREA', 'SELECT'].includes((e.target as HTMLElement)?.tagName);
      if (isInput) return;

      if (e.key === 'Escape' && diagramOnlyMode) {
        setDiagramOnlyMode(false);
      } else if (e.key.toLowerCase() === 'd' && !e.ctrlKey && !e.metaKey) {
        setDiagramOnlyMode((prev) => !prev);
      } else if (e.key.toLowerCase() === 'f' && !e.ctrlKey && !e.metaKey) {
        setFocusMode((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [diagramOnlyMode]);

  const handleToggleDiagramOnly = () => {
    setDiagramOnlyMode((prev) => !prev);
  };

  // Open Q&A Solver pre-selected for a specific shape
  const handleOpenQASolverForShape = (shapeId?: string) => {
    setViewMode('qa_solver');
    if (shapeId) {
      if (dimension === '3d') {
        setSelected3DShape(shapeId as Shape3DChoice);
      } else {
        setSelected2DShape(shapeId as Shape2DChoice);
      }
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-indigo-500 selection:text-white transition-all">
      {/* 1. Sleek Navigation Header with Primary & Secondary Filter Hierarchy */}
      {!diagramOnlyMode && (
        <AppHeader
          dimension={dimension}
          setDimension={(dim) => {
            setDimension(dim);
          }}
          viewMode={viewMode}
          setViewMode={setViewMode}
          selected3DShape={selected3DShape}
          setSelected3DShape={(shape) => {
            setSelected3DShape(shape);
            if (viewMode === 'qa_solver') {
              // keep in solver or allow visualizer
            }
          }}
          selected2DShape={selected2DShape}
          setSelected2DShape={(shape) => {
            setSelected2DShape(shape);
          }}
          language={language}
          setLanguage={setLanguage}
          diagramOnlyMode={diagramOnlyMode}
          onToggleDiagramOnly={handleToggleDiagramOnly}
        />
      )}

      {/* 2. Main Content Area */}
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
        {/* VIEW MODE: Q&A & STEP-BY-STEP PROBLEM SOLVER */}
        {viewMode === 'qa_solver' && (
          <QASolverView
            language={language}
            defaultDimension={dimension}
            initialShapeId={
              dimension === '3d'
                ? selected3DShape === 'cube_lab'
                  ? 'cube_cutting'
                  : selected3DShape === 'dice_reasoning'
                  ? 'cube'
                  : selected3DShape
                : selected2DShape
            }
          />
        )}

        {/* VIEW MODE: 3D/2D VISUALIZER & INTERACTIVE LAB */}
        {viewMode === 'visualizer' && dimension === '3d' && (
          <>
            {/* 1. Default: Cube & Cuboid Slicing and Reasoning Lab */}
            {selected3DShape === 'cube_lab' && (
              <CubeCuttingLabTab
                language={language}
                focusMode={focusMode}
                onToggleFocus={() => setFocusMode((p) => !p)}
                diagramOnlyMode={diagramOnlyMode}
                onToggleDiagramOnly={handleToggleDiagramOnly}
                onCancelDiagramOnly={() => setDiagramOnlyMode(false)}
                onSelectTab={() => {}}
              />
            )}

            {/* 2. Dice Reasoning & 3D Net Unfolding */}
            {selected3DShape === 'dice_reasoning' && (
              <DiceReasoningTab
                language={language}
                diagramOnlyMode={diagramOnlyMode}
                onToggleDiagramOnly={handleToggleDiagramOnly}
                onCancelDiagramOnly={() => setDiagramOnlyMode(false)}
                onSelectTab={() => {}}
              />
            )}

            {/* 3. 3D Solids (Cylinder, Hollow Cylinder, Cone, Sphere, Hemisphere, Frustum, Prism, Pyramid, Wheel) */}
            {selected3DShape !== 'cube_lab' && selected3DShape !== 'dice_reasoning' && (
              <ShapeVisualizerTab
                language={language}
                projectorMode={projectorMode}
                focusMode={focusMode}
                onToggleFocus={() => setFocusMode((p) => !p)}
                diagramOnlyMode={diagramOnlyMode}
                onToggleDiagramOnly={handleToggleDiagramOnly}
                onCancelDiagramOnly={() => setDiagramOnlyMode(false)}
                onSelectTab={() => {}}
                selectedShapeType={selected3DShape as ShapeType}
                onSelectShapeType={(s) => setSelected3DShape(s)}
                onOpenQASolver={handleOpenQASolverForShape}
              />
            )}
          </>
        )}

        {/* VIEW MODE: 2D GEOMETRY & MENSURATION */}
        {viewMode === 'visualizer' && dimension === '2d' && (
          <Geometry2DTab
            language={language}
            projectorMode={projectorMode}
            diagramOnlyMode={diagramOnlyMode}
            onToggleDiagramOnly={handleToggleDiagramOnly}
            onCancelDiagramOnly={() => setDiagramOnlyMode(false)}
            onSelectTab={() => {}}
            selectedShapeType={selected2DShape}
            onSelectShapeType={(s) => setSelected2DShape(s)}
            onOpenQASolver={handleOpenQASolverForShape}
          />
        )}
      </main>

      {/* Connectivity & Offline Status Indicator */}
      {!diagramOnlyMode && <OfflineIndicator language={language} />}

      {/* Clean, Lightweight, Professional Footer */}
      {!diagramOnlyMode && !projectorMode && !focusMode && (
        <footer className="border-t border-slate-900/90 bg-slate-950/90 backdrop-blur-md py-3 text-xs text-slate-400">
          <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-slate-500 text-center sm:text-left">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              <span className="text-slate-400 font-medium">
                {language === 'hi'
                  ? 'गणित 3D व 2D ज्यामिति, क्षेत्रमिति व रीज़निंग स्टूडियो'
                  : 'Math 3D & 2D Geometry, Mensuration & Reasoning Studio'}
              </span>
              <span className="text-slate-600">•</span>
              <span className="text-indigo-400 font-mono text-[11px]">100% Offline Engine</span>
            </div>

            <div className="flex items-center gap-2 text-slate-500 text-[11px]">
              <span>
                {language === 'hi'
                  ? 'शॉर्टकट: केवल डायग्राम के लिए "D" दबाएं'
                  : 'Shortcut: Press "D" for Diagram-Only Mode'}
              </span>
            </div>
          </div>
        </footer>
      )}
    </div>
  );
}
