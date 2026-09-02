import React from 'react';
import { ActiveTab } from '../types';
import {
  Box,
  Brain,
  Calculator,
  Compass,
  Dices,
  Globe,
  Layers,
  Maximize2,
  Minimize2,
  Tv,
} from 'lucide-react';

interface NavbarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  language: 'hi' | 'en';
  setLanguage: (lang: 'hi' | 'en') => void;
  projectorMode: boolean;
  setProjectorMode: (val: boolean) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  language,
  setLanguage,
  projectorMode,
  setProjectorMode,
}) => {
  const [isFullscreen, setIsFullscreen] = React.useState(false);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  const tabs: { id: ActiveTab; labelHi: string; labelEn: string; icon: React.ReactNode }[] = [
    {
      id: 'cutting_lab',
      labelHi: 'घन/घनाभ काटना',
      labelEn: 'Cube Slicing Lab',
      icon: <Layers className="w-4 h-4" />,
    },
    {
      id: 'shapes_3d',
      labelHi: '3D ठोस (बेलन, शंकु)',
      labelEn: '3D Solids (Belan, Sanku)',
      icon: <Box className="w-4 h-4" />,
    },
    {
      id: 'geometry_2d',
      labelHi: '2D ज्यामिति व चतुर्भुज',
      labelEn: '2D Geometry & Quads',
      icon: <Compass className="w-4 h-4 text-emerald-400" />,
    },
    {
      id: 'dice_reasoning',
      labelHi: 'पासा रीज़निंग',
      labelEn: 'Dice Reasoning',
      icon: <Dices className="w-4 h-4" />,
    },
    {
      id: 'offline_solver',
      labelHi: 'ऑफ़लाइन सॉल्वर',
      labelEn: 'Offline Solver',
      icon: <Calculator className="w-4 h-4 text-indigo-400" />,
    },
    {
      id: 'quiz_practice',
      labelHi: 'अभ्यास क्विज़',
      labelEn: 'Quiz Practice',
      icon: <Brain className="w-4 h-4" />,
    },
  ];

  return (
    <header className="sticky top-0 z-50 bg-slate-950/90 backdrop-blur-xl border-b border-slate-800/80">
      <div className={`${projectorMode ? 'w-full px-4 sm:px-6' : 'max-w-7xl mx-auto px-4 sm:px-6'} py-2.5 transition-all`}>
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-2.5">
          {/* Brand Logo & Title */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-md shadow-indigo-500/25">
                <Box className="w-5 h-5" />
              </div>
              <div>
                <h1 className="text-sm sm:text-base font-extrabold text-white tracking-tight flex items-center gap-2">
                  <span>3D Math Shapes & Geometry Lab</span>
                  <span className="text-[10px] font-semibold bg-indigo-950 text-indigo-400 border border-indigo-800/60 px-2 py-0.2 rounded-full">
                    Studio
                  </span>
                </h1>
                <p className="text-[10px] text-slate-400">
                  {language === 'hi'
                    ? 'बेलन, शंकु, घन, घनाभ, समचतुर्भुज, पासा काटना व रीज़निंग'
                    : 'Parametric Geometry, Cube Slicing & Reasoning Studio'}
                </p>
              </div>
            </div>

            {/* Mobile Actions: 16:9 Toggle & Language */}
            <div className="flex items-center gap-1.5 lg:hidden">
              <button
                id="btn-projector-toggle-mobile"
                onClick={() => setProjectorMode(!projectorMode)}
                className={`p-1.5 rounded-lg border text-xs font-medium flex items-center gap-1 ${
                  projectorMode
                    ? 'bg-amber-500/20 border-amber-500/50 text-amber-300'
                    : 'bg-slate-900 border-slate-700 text-slate-300'
                }`}
                title="16:9 Projector Mode"
              >
                <Tv className="w-4 h-4" />
                <span>16:9</span>
              </button>

              <button
                onClick={() => setLanguage(language === 'hi' ? 'en' : 'hi')}
                className="px-2 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs text-slate-300 font-medium flex items-center gap-1"
              >
                <Globe className="w-3.5 h-3.5 text-indigo-400" />
                <span>{language === 'hi' ? 'EN' : 'हिंदी'}</span>
              </button>
            </div>
          </div>

          {/* Desktop Navigation Tabs & Controls */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 lg:pb-0">
            {/* Tabs List */}
            <div className="flex items-center gap-1 bg-slate-900/90 p-1 rounded-xl border border-slate-800">
              {tabs.map((tab) => {
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    id={`nav-tab-${tab.id}`}
                    onClick={() => setActiveTab(tab.id)}
                    className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                      isActive
                        ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/25'
                        : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                    }`}
                  >
                    {tab.icon}
                    <span>{language === 'hi' ? tab.labelHi : tab.labelEn}</span>
                  </button>
                );
              })}
            </div>

            {/* Global 16:9 Projector / Smartboard Mode Button */}
            <div className="hidden lg:flex items-center gap-1.5">
              <button
                id="btn-projector-toggle"
                onClick={() => setProjectorMode(!projectorMode)}
                className={`px-3 py-1.5 rounded-xl border text-xs font-bold flex items-center gap-2 transition-all shadow-sm ${
                  projectorMode
                    ? 'bg-amber-500/20 border-amber-400/80 text-amber-300 ring-2 ring-amber-400/30'
                    : 'bg-slate-900 hover:bg-slate-800 border-slate-700/80 text-slate-300 hover:text-white'
                }`}
                title="16:9 Widescreen Projector Mode"
              >
                <Tv className={`w-4 h-4 ${projectorMode ? 'text-amber-400' : 'text-slate-400'}`} />
                <span>{language === 'hi' ? '16:9 प्रोजेक्टर मोड' : '16:9 Projector'}</span>
                {projectorMode && (
                  <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                )}
              </button>

              {/* Fullscreen Button */}
              <button
                id="btn-fullscreen-toggle"
                onClick={toggleFullscreen}
                className="p-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700/80 text-slate-300 hover:text-white transition-all"
                title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
              >
                {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
              </button>

              {/* Language Switcher */}
              <button
                id="btn-language-toggle"
                onClick={() => setLanguage(language === 'hi' ? 'en' : 'hi')}
                className="px-2.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700/80 text-xs text-slate-300 font-medium flex items-center gap-1.5 transition-all shadow-sm"
              >
                <Globe className="w-3.5 h-3.5 text-indigo-400" />
                <span className="font-semibold">{language === 'hi' ? 'English' : 'हिंदी'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
