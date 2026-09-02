import React, { useState } from 'react';
import { ThreeCanvas } from './ThreeCanvas';
import { Award, Box, Check, Dices, HelpCircle, Layers, Lightbulb, Play, RotateCw, Sparkles } from 'lucide-react';

interface DiceReasoningTabProps {
  language: 'hi' | 'en';
}

export const DiceReasoningTab: React.FC<DiceReasoningTabProps> = ({ language }) => {
  const [subTab, setSubTab] = useState<'standard_vs_ordinary' | 'opposite_solver' | 'open_dice'>('opposite_solver');

  // Dice Values: [Top, Bottom, Front, Back, Left, Right]
  const [diceValues, setDiceValues] = useState<[number, number, number, number, number, number]>([1, 6, 2, 5, 3, 4]);
  const [isUnfolded, setIsUnfolded] = useState(false);
  const [unfoldProgress, setUnfoldProgress] = useState(0);

  // Multi-View Problem State
  const [view1, setView1] = useState<{ top: number; front: number; right: number }>({ top: 1, front: 2, right: 3 });
  const [view2, setView2] = useState<{ top: number; front: number; right: number }>({ top: 1, front: 4, right: 5 });
  const [selectedTarget, setSelectedTarget] = useState<number>(2);

  // Standard opposite pairs for standard dice
  const standardOpposites: Record<number, number> = { 1: 6, 2: 5, 3: 4, 4: 3, 5: 2, 6: 1 };

  // Calculate opposite face based on reasoning rules between View 1 and View 2
  const calculateOppositeRules = () => {
    const v1 = [view1.top, view1.front, view1.right];
    const v2 = [view2.top, view2.front, view2.right];

    const common = v1.filter((x) => v2.includes(x));

    if (common.length === 1) {
      const c = common[0];
      // Clockwise from common face in view 1:
      // Arrange cyclic order
      return {
        rule: 'one_common',
        commonFace: c,
        ruleTitleHi: 'नियम 1: एक सतह समान (One Face Common Rule)',
        ruleTitleEn: 'Rule 1: One Common Face (Clockwise Method)',
        explanationHi: `दोनों पासों में अंक ${c} कॉमन है। कॉमन अंक से घड़ी की दिशा (Clockwise) में घूमें:\n• पासा 1: ${v1.join(' → ')}\n• पासा 2: ${v2.join(' → ')}\nअतः संगत अंक एक-दूसरे के विपरीत होंगे!`,
        explanationEn: `Number ${c} is common. Rotate clockwise from ${c} in both dice:\n• Dice 1: ${v1.join(' → ')}\n• Dice 2: ${v2.join(' → ')}\nTherefore corresponding numbers are opposites!`,
        pairs: [
          { a: v1[1], b: v2[1] },
          { a: v1[2], b: v2[2] },
        ],
      };
    } else if (common.length === 2) {
      const rem1 = v1.find((x) => !v2.includes(x))!;
      const rem2 = v2.find((x) => !v1.includes(x))!;
      return {
        rule: 'two_common',
        commonFaces: common,
        ruleTitleHi: 'नियम 2: दो सतह समान (Two Faces Common Rule)',
        ruleTitleEn: 'Rule 2: Two Common Faces Rule',
        explanationHi: `दोनों पासों में दो अंक (${common.join(', ')}) कॉमन हैं।\nनियम के अनुसार, बची हुई तीसरी सतहें एक-दूसरे के विपरीत (Opposite) होती हैं:\n• ${rem1} के विपरीत ${rem2} होगा!`,
        explanationEn: `Two faces (${common.join(', ')}) are common in both views.\nAccording to rule, the remaining third faces are always opposite:\n• ${rem1} is opposite to ${rem2}!`,
        pairs: [{ a: rem1, b: rem2 }],
      };
    } else {
      return {
        rule: 'no_common',
        ruleTitleHi: 'मानक पासा नियम (Standard Dice Rule)',
        ruleTitleEn: 'Standard Dice Rule (Sum = 7)',
        explanationHi: 'यदि कोई सतह कॉमन न हो और पासा मानक (Standard) हो, तो विपरीत सतहों का योग 7 होता है (1↔6, 2↔5, 3↔4).',
        explanationEn: 'If standard dice, sum of opposite faces is always 7 (1↔6, 2↔5, 3↔4).',
        pairs: [
          { a: 1, b: 6 },
          { a: 2, b: 5 },
          { a: 3, b: 4 },
        ],
      };
    }
  };

  const reasoningResult = calculateOppositeRules();

  return (
    <div className="space-y-6">
      {/* Sub Tab Navigation */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-2 flex flex-wrap gap-2 backdrop-blur-md">
        <button
          onClick={() => {
            setSubTab('opposite_solver');
            setIsUnfolded(false);
          }}
          className={`flex-1 min-w-[140px] py-2.5 px-4 rounded-xl text-xs font-semibold transition-all flex items-center justify-center gap-2 ${
            subTab === 'opposite_solver'
              ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/25'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
          }`}
        >
          <Dices className="w-4 h-4" />
          {language === 'hi' ? 'विपरीत फलक विश्लेषक (Opposite Solver)' : 'Opposite Face Solver'}
        </button>

        <button
          onClick={() => {
            setSubTab('open_dice');
            setIsUnfolded(true);
            setUnfoldProgress(0.7);
          }}
          className={`flex-1 min-w-[140px] py-2.5 px-4 rounded-xl text-xs font-semibold transition-all flex items-center justify-center gap-2 ${
            subTab === 'open_dice'
              ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/25'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
          }`}
        >
          <Layers className="w-4 h-4" />
          {language === 'hi' ? 'खुला पासा (Open Dice 3D Folding)' : 'Open Dice Net & 3D Fold'}
        </button>

        <button
          onClick={() => {
            setSubTab('standard_vs_ordinary');
            setIsUnfolded(false);
          }}
          className={`flex-1 min-w-[140px] py-2.5 px-4 rounded-xl text-xs font-semibold transition-all flex items-center justify-center gap-2 ${
            subTab === 'standard_vs_ordinary'
              ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/25'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
          }`}
        >
          <Lightbulb className="w-4 h-4" />
          {language === 'hi' ? 'मानक vs सामान्य पासा (Concepts)' : 'Standard vs Ordinary Dice'}
        </button>
      </div>

      {/* Main Interactive Views */}
      {subTab === 'opposite_solver' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left: 3D Dice Simulation Canvas */}
          <div className="lg:col-span-7 flex flex-col space-y-4">
            <div className="h-[420px] sm:h-[480px]">
              <ThreeCanvas
                mode="dice"
                diceParams={{
                  diceValues,
                  isUnfolded: false,
                  unfoldProgress: 0,
                }}
                language={language}
              />
            </div>

            {/* Quick Test Presets */}
            <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-3 flex flex-wrap items-center justify-between gap-2 text-xs">
              <span className="text-slate-400 font-medium">
                {language === 'hi' ? 'परीक्षा प्रश्न प्रीसेट:' : 'Exam Presets:'}
              </span>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setView1({ top: 3, front: 1, right: 2 });
                    setView2({ top: 3, front: 5, right: 4 });
                  }}
                  className="px-2.5 py-1 rounded bg-indigo-950/80 text-indigo-300 border border-indigo-800/60 hover:bg-indigo-900"
                >
                  1-Common Face (SSC CGL)
                </button>
                <button
                  onClick={() => {
                    setView1({ top: 2, front: 4, right: 1 });
                    setView2({ top: 2, front: 4, right: 6 });
                  }}
                  className="px-2.5 py-1 rounded bg-emerald-950/80 text-emerald-300 border border-emerald-800/60 hover:bg-emerald-900"
                >
                  2-Common Faces (Railway)
                </button>
              </div>
            </div>
          </div>

          {/* Right: Dual View Configurator & Logic Steps */}
          <div className="lg:col-span-5 flex flex-col space-y-4">
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 sm:p-5">
              <h4 className="text-sm font-semibold text-white mb-3 flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <Dices className="w-4 h-4 text-indigo-400" />
                  {language === 'hi' ? 'पासे की दो स्थितियां सेट करें' : 'Set 2 Dice Positions'}
                </span>
                <span className="text-xs text-indigo-400 font-mono">Position A & B</span>
              </h4>

              {/* View 1 Controls */}
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 mb-3">
                <div className="text-xs font-semibold text-indigo-300 mb-2">
                  {language === 'hi' ? 'पासा दृश्य 1 (Position 1):' : 'Dice View 1:'}
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="text-[10px] text-slate-400 block mb-1">Top (ऊपर)</label>
                    <input
                      type="number"
                      min="1"
                      max="6"
                      value={view1.top}
                      onChange={(e) => setView1({ ...view1, top: parseInt(e.target.value) || 1 })}
                      className="w-full bg-slate-900 border border-slate-700 rounded p-1.5 text-center text-xs font-mono font-bold text-white"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-400 block mb-1">Front (सामने)</label>
                    <input
                      type="number"
                      min="1"
                      max="6"
                      value={view1.front}
                      onChange={(e) => setView1({ ...view1, front: parseInt(e.target.value) || 1 })}
                      className="w-full bg-slate-900 border border-slate-700 rounded p-1.5 text-center text-xs font-mono font-bold text-white"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-400 block mb-1">Right (दाएं)</label>
                    <input
                      type="number"
                      min="1"
                      max="6"
                      value={view1.right}
                      onChange={(e) => setView1({ ...view1, right: parseInt(e.target.value) || 1 })}
                      className="w-full bg-slate-900 border border-slate-700 rounded p-1.5 text-center text-xs font-mono font-bold text-white"
                    />
                  </div>
                </div>
              </div>

              {/* View 2 Controls */}
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                <div className="text-xs font-semibold text-emerald-300 mb-2">
                  {language === 'hi' ? 'पासा दृश्य 2 (Position 2):' : 'Dice View 2:'}
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="text-[10px] text-slate-400 block mb-1">Top (ऊपर)</label>
                    <input
                      type="number"
                      min="1"
                      max="6"
                      value={view2.top}
                      onChange={(e) => setView2({ ...view2, top: parseInt(e.target.value) || 1 })}
                      className="w-full bg-slate-900 border border-slate-700 rounded p-1.5 text-center text-xs font-mono font-bold text-white"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-400 block mb-1">Front (सामने)</label>
                    <input
                      type="number"
                      min="1"
                      max="6"
                      value={view2.front}
                      onChange={(e) => setView2({ ...view2, front: parseInt(e.target.value) || 1 })}
                      className="w-full bg-slate-900 border border-slate-700 rounded p-1.5 text-center text-xs font-mono font-bold text-white"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-400 block mb-1">Right (दाएं)</label>
                    <input
                      type="number"
                      min="1"
                      max="6"
                      value={view2.right}
                      onChange={(e) => setView2({ ...view2, right: parseInt(e.target.value) || 1 })}
                      className="w-full bg-slate-900 border border-slate-700 rounded p-1.5 text-center text-xs font-mono font-bold text-white"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Reasoning Rule Solution Breakdown */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 sm:p-5 space-y-3">
              <h4 className="text-xs font-semibold text-amber-400 uppercase tracking-wider flex items-center gap-2">
                <Sparkles className="w-4 h-4" />
                {language === 'hi' ? reasoningResult.ruleTitleHi : reasoningResult.ruleTitleEn}
              </h4>

              <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-800 text-xs text-slate-300 whitespace-pre-line font-sans leading-relaxed">
                {language === 'hi' ? reasoningResult.explanationHi : reasoningResult.explanationEn}
              </div>

              {/* Found Opposite Pairs */}
              <div className="space-y-1.5">
                <div className="text-[11px] font-semibold text-slate-400">
                  {language === 'hi' ? 'प्राप्त विपरीत जोड़े (Opposite Pairs):' : 'Determined Opposite Pairs:'}
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {reasoningResult.pairs.map((p, idx) => (
                    <div
                      key={idx}
                      className="p-2.5 rounded-xl bg-indigo-950/50 border border-indigo-800/60 flex items-center justify-between"
                    >
                      <span className="w-7 h-7 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-bold text-xs font-mono">
                        {p.a}
                      </span>
                      <span className="text-xs text-indigo-300 font-bold">⟷</span>
                      <span className="w-7 h-7 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-bold text-xs font-mono">
                        {p.b}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Open Dice Net Unfold & 3D Folding Mode */}
      {subTab === 'open_dice' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-7 flex flex-col space-y-4">
            <div className="h-[440px] sm:h-[500px]">
              <ThreeCanvas
                mode="dice"
                diceParams={{
                  diceValues: [1, 6, 2, 5, 3, 4],
                  isUnfolded: true,
                  unfoldProgress,
                }}
                language={language}
              />
            </div>

            {/* Fold / Unfold Interactive Slider */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4">
              <div className="flex justify-between items-center text-xs font-medium mb-1.5">
                <span className="text-slate-300 flex items-center gap-2">
                  <RotateCw className="w-4 h-4 text-indigo-400" />
                  {language === 'hi'
                    ? 'पासा मोड़ने / खोलने का एनीमेशन (Fold / Unfold Net):'
                    : 'Fold / Unfold 3D Animation:'}
                </span>
                <span className="font-mono text-indigo-400 font-bold">
                  {unfoldProgress === 0
                    ? language === 'hi'
                      ? '3D पासा (Closed)'
                      : 'Closed Box'
                    : unfoldProgress === 1
                    ? language === 'hi'
                      ? 'खुला पासा (Flat Net)'
                      : 'Flat Net'
                    : `${Math.round(unfoldProgress * 100)}%`}
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.02"
                value={unfoldProgress}
                onChange={(e) => setUnfoldProgress(parseFloat(e.target.value))}
                className="w-full accent-indigo-500 bg-slate-800 h-2.5 rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-500 mt-1">
                <span>{language === 'hi' ? 'बंद 3D पासा (Folded)' : 'Folded Cube'}</span>
                <span>{language === 'hi' ? 'आधा मुड़ा हुआ' : 'Midway'}</span>
                <span>{language === 'hi' ? 'पूरा खुला नेट (2D Net)' : 'Flat Unfolded Net'}</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 flex flex-col space-y-4">
            {/* 2D Open Dice Net Pattern Card */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 sm:p-5">
              <h4 className="text-sm font-semibold text-white mb-3">
                {language === 'hi' ? 'खुला पासा (Open Dice Rules & Net)' : 'Open Dice Net Rules'}
              </h4>

              {/* 2D Cross Net Diagram */}
              <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 flex justify-center">
                <div className="grid grid-cols-4 gap-1 w-48 text-center text-xs font-mono font-bold">
                  <div></div>
                  <div className="bg-indigo-600 text-white p-3 rounded-lg border border-indigo-400 shadow">1 (Top)</div>
                  <div></div>
                  <div></div>

                  <div className="bg-emerald-600 text-white p-3 rounded-lg border border-emerald-400 shadow">3 (Left)</div>
                  <div className="bg-blue-600 text-white p-3 rounded-lg border border-blue-400 shadow">2 (Front)</div>
                  <div className="bg-amber-600 text-white p-3 rounded-lg border border-amber-400 shadow">4 (Right)</div>
                  <div className="bg-purple-600 text-white p-3 rounded-lg border border-purple-400 shadow">5 (Back)</div>

                  <div></div>
                  <div className="bg-red-600 text-white p-3 rounded-lg border border-red-400 shadow">6 (Bottom)</div>
                  <div></div>
                  <div></div>
                </div>
              </div>

              {/* Rules summary */}
              <div className="mt-4 space-y-2 text-xs text-slate-300">
                <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 flex items-start gap-2">
                  <span className="text-indigo-400 font-bold">•</span>
                  <p>
                    <strong className="text-white">
                      {language === 'hi' ? 'एकांतर फलक नियम (Alternate Face Rule):' : 'Alternate Face Rule:'}
                    </strong>{' '}
                    {language === 'hi'
                      ? 'एक सीधी रेखा में एक बॉक्स छोड़कर अगला बॉक्स हमेशा विपरीत (Opposite) होता है। जैसे 1 ⟷ 6 और 3 ⟷ 4.'
                      : 'Skipping one box in a straight line gives the opposite face. (1 ⟷ 6, 3 ⟷ 4).'}
                  </p>
                </div>

                <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 flex items-start gap-2">
                  <span className="text-indigo-400 font-bold">•</span>
                  <p>
                    <strong className="text-white">
                      {language === 'hi' ? 'Z-नियम (Z-Rule):' : 'Z-Rule for Corners:'}
                    </strong>{' '}
                    {language === 'hi'
                      ? 'Z-आकार के दोनों सिरों पर मौजूद फलक विपरीत होते हैं। जैसे 2 ⟷ 5.'
                      : 'The two ends of a Z-shape pattern are opposite to each other (2 ⟷ 5).'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Standard vs Ordinary Dice Concept Guide */}
      {subTab === 'standard_vs_ordinary' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-slate-900/90 border border-indigo-900/50 rounded-2xl p-5 space-y-3">
            <div className="flex items-center gap-2">
              <span className="w-8 h-8 rounded-xl bg-indigo-600/30 border border-indigo-400 text-indigo-300 flex items-center justify-center font-bold text-sm">
                1
              </span>
              <h4 className="text-base font-bold text-white">
                {language === 'hi' ? 'मानक पासा (Standard Dice)' : 'Standard Dice (मानक पासा)'}
              </h4>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              {language === 'hi'
                ? 'मानक पासा वह होता है जिसमें किन्हीं भी दो विपरीत सतहों (Opposite Faces) का योग हमेशा 7 होता है।'
                : 'A Standard Dice is one where the sum of any two opposite faces is always exactly 7.'}
            </p>

            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-2 text-xs">
              <div className="font-semibold text-indigo-300">
                {language === 'hi' ? 'नियम और पहचान:' : 'Key Rules & Identification:'}
              </div>
              <ul className="space-y-1.5 text-slate-300">
                <li className="flex items-center justify-between">
                  <span>1 के विपरीत:</span> <span className="font-mono font-bold text-white">6 (1 + 6 = 7)</span>
                </li>
                <li className="flex items-center justify-between">
                  <span>2 के विपरीत:</span> <span className="font-mono font-bold text-white">5 (2 + 5 = 7)</span>
                </li>
                <li className="flex items-center justify-between">
                  <span>3 के विपरीत:</span> <span className="font-mono font-bold text-white">4 (3 + 4 = 7)</span>
                </li>
                <li className="text-amber-400 text-[11px] pt-1">
                  ⚠️ {language === 'hi' ? 'किन्हीं भी 2 पास वाली (पड़ोसी) सतहों का योग 7 नहीं हो सकता!' : 'No two adjacent visible faces sum to 7!'}
                </li>
              </ul>
            </div>
          </div>

          <div className="bg-slate-900/90 border border-emerald-900/50 rounded-2xl p-5 space-y-3">
            <div className="flex items-center gap-2">
              <span className="w-8 h-8 rounded-xl bg-emerald-600/30 border border-emerald-400 text-emerald-300 flex items-center justify-center font-bold text-sm">
                2
              </span>
              <h4 className="text-base font-bold text-white">
                {language === 'hi' ? 'सामान्य / साधारण पासा (Ordinary Dice)' : 'Ordinary / General Dice (साधारण पासा)'}
              </h4>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              {language === 'hi'
                ? 'साधारण पासा वह होता है जिसमें दिखने वाली किन्हीं भी दो निकटवर्ती (पड़ोसी) सतहों का योग 7 हो जाता है।'
                : 'An Ordinary / General dice is one where the sum of any two adjacent visible faces equals 7.'}
            </p>

            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-2 text-xs">
              <div className="font-semibold text-emerald-300">
                {language === 'hi' ? 'नियम और पहचान:' : 'Key Rules & Identification:'}
              </div>
              <ul className="space-y-1.5 text-slate-300">
                <li>• यदि दिखने वाली सतहों में (4, 3) या (5, 2) या (6, 1) दिख जाए, तो वह साधारण पासा है।</li>
                <li>• इसमें विपरीत सतह निश्चित नहीं होती, जब तक अन्य स्थितियां न दी गई हों।</li>
                <li>• इसमें 1-Common Face या 2-Common Face नियम लगाकर विपरीत सतह ज्ञात की जाती है।</li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
