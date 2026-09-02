import React, { useState } from 'react';
import {
  solveMathProblemOffline,
  OFFLINE_FORMULA_BANK,
  REVERSE_SOLVER_PRESETS,
  ReversePresetDef,
  OfflineSolution,
} from '../utils/mathEngineOffline';
import {
  Calculator,
  Search,
  BookOpen,
  CheckCircle2,
  Lightbulb,
  Cpu,
  ArrowRight,
  ShieldCheck,
  Target,
  FileSpreadsheet,
  Sliders,
  Check,
  HelpCircle,
  Copy,
} from 'lucide-react';

interface OfflineSolverTabProps {
  language: 'hi' | 'en';
}

const SAMPLE_QUESTIONS_HI = [
  'एक आयत का क्षेत्रफल 120 सेमी² और लंबाई 15 सेमी है, इसकी चौड़ाई, परिमाप और विकर्ण ज्ञात करें।',
  'एक बेलन का आयतन 1540 सेमी³ और त्रिज्या 7 सेमी है, इसकी ऊंचाई व वक्र पृष्ठ निकालें।',
  'एक वर्ग का क्षेत्रफल 144 सेमी² है, इसकी भुजा, परिमाप और विकर्ण क्या होगा?',
  'एक शंकु का आयतन 314 सेमी³ और ऊंचाई 12 सेमी है, इसकी त्रिज्या व तिर्यक ऊंचाई ज्ञात करें।',
  'एक समचतुर्भुज का क्षेत्रफल 96 सेमी² और एक विकर्ण 16 सेमी है, दूसरा विकर्ण व भुजा बताएं।',
  'एक घनाभ का आयतन 720 सेमी³, लंबाई 12 सेमी और चौड़ाई 10 सेमी है, ऊंचाई ज्ञात करें।',
  'एक समलंब चतुर्भुज का क्षेत्रफल 120 सेमी², ऊंचाई 8 सेमी और एक भुजा 12 सेमी है, दूसरी भुजा बताएं।',
  'एक 6 सेमी भुजा वाले रंगे हुए घन को 1 सेमी के छोटे घनों में काटा गया। 2 सतह रंगे घन कितने होंगे?',
  'एक मानक पासे में 3 के विपरीत कौन सा अंक होगा?',
];

const SAMPLE_QUESTIONS_EN = [
  'A rectangle has area 120 sq cm and length 15 cm. Find its breadth, perimeter and diagonal.',
  'A cylinder has volume 1540 cu cm and radius 7 cm. Find its height and curved surface area.',
  'A square has area 144 sq cm. Find its side, perimeter and diagonal.',
  'A cone has volume 314 cu cm and height 12 cm. Find its radius and slant height.',
  'A rhombus has area 96 sq cm and one diagonal 16 cm. Find the other diagonal and side.',
  'A cuboid has volume 720 cu cm, length 12 cm and breadth 10 cm. Find height.',
  'A trapezium has area 120 sq cm, height 8 cm and one parallel side 12 cm. Find the other side.',
  'A painted cube of side 6 cm is cut into 1 cm cubes. How many have 2 faces painted?',
  'In a standard dice, which number is opposite to 3?',
];

export const OfflineSolverTab: React.FC<OfflineSolverTabProps> = ({ language }) => {
  const [activeMode, setActiveMode] = useState<'reverse_calculator' | 'smart_solver' | 'formula_bank'>('reverse_calculator');

  // Reverse / Target Preset Solver State
  const [selectedPresetId, setSelectedPresetId] = useState<string>(REVERSE_SOLVER_PRESETS[0].id);
  const currentPreset = REVERSE_SOLVER_PRESETS.find((p) => p.id === selectedPresetId) || REVERSE_SOLVER_PRESETS[0];

  const [presetInputs, setPresetInputs] = useState<Record<string, number>>(() => {
    const init: Record<string, number> = {};
    REVERSE_SOLVER_PRESETS[0].inputs.forEach((inp) => {
      init[inp.key] = inp.defaultVal;
    });
    return init;
  });

  const handleSelectPreset = (preset: ReversePresetDef) => {
    setSelectedPresetId(preset.id);
    const newInputs: Record<string, number> = {};
    preset.inputs.forEach((inp) => {
      newInputs[inp.key] = inp.defaultVal;
    });
    setPresetInputs(newInputs);
    setSolution(preset.solve(newInputs));
  };

  const handlePresetInputChange = (key: string, val: number) => {
    const updated = { ...presetInputs, [key]: val };
    setPresetInputs(updated);
    setSolution(currentPreset.solve(updated));
  };

  // Natural Language Solver State
  const [query, setQuery] = useState(
    language === 'hi'
      ? 'एक आयत का क्षेत्रफल 120 सेमी² और लंबाई 15 सेमी है, इसकी चौड़ाई क्या होगी?'
      : 'A rectangle has area 120 sq cm and length 15 cm. Find its breadth.'
  );

  const [solution, setSolution] = useState<OfflineSolution | null>(() =>
    REVERSE_SOLVER_PRESETS[0].solve({ area: 120, length: 15 })
  );

  const [formulaSearch, setFormulaSearch] = useState('');
  const [copied, setCopied] = useState(false);

  const handleSolveTextQuery = (qToSolve?: string) => {
    const text = qToSolve || query;
    if (!text.trim()) return;
    const res = solveMathProblemOffline(text);
    setSolution(res);
  };

  const copySolutionToClipboard = () => {
    if (!solution) return;
    const text = [
      `=== ${language === 'hi' ? solution.titleHi : solution.titleEn} ===`,
      `[${language === 'hi' ? 'दिया गया है' : 'Given Data'}]:`,
      ...solution.givenData.map((d) => `• ${language === 'hi' ? d.labelHi : d.labelEn}: ${d.value}`),
      solution.toFindHi ? `[${language === 'hi' ? 'ज्ञात करना है' : 'To Find'}]: ${language === 'hi' ? solution.toFindHi : solution.toFindEn}` : '',
      `\n[${language === 'hi' ? 'चरणबद्ध हल' : 'Step-by-Step Solution'}]:`,
      ...(language === 'hi' ? solution.stepsHi : solution.stepsEn).map((s) => `${s}`),
      `\n[${language === 'hi' ? 'अंतिम उत्तर' : 'Final Answer'}]: ${language === 'hi' ? solution.finalAnswerHi : solution.finalAnswerEn}`,
      `\n[${language === 'hi' ? 'प्रयुक्त सूत्र' : 'Formulas'}]: ${solution.formulasUsed.join(', ')}`,
    ].filter(Boolean).join('\n');

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const filteredFormulas = OFFLINE_FORMULA_BANK.filter(
    (f) =>
      f.nameHi.toLowerCase().includes(formulaSearch.toLowerCase()) ||
      f.nameEn.toLowerCase().includes(formulaSearch.toLowerCase()) ||
      f.formula.toLowerCase().includes(formulaSearch.toLowerCase()) ||
      f.category.toLowerCase().includes(formulaSearch.toLowerCase())
  );

  return (
    <div className="flex flex-col gap-6 p-4 max-w-7xl mx-auto">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 text-emerald-400 text-xs font-semibold uppercase tracking-wider mb-2">
              <ShieldCheck className="w-4 h-4" />
              <span>{language === 'hi' ? '100% ऑफ़लाइन गणित सॉल्वर (किताब की तरह स्टेप-बाय-स्टेप)' : '100% Offline Step-by-Step Textbook Solver'}</span>
            </div>
            <h1 className="text-xl md:text-2xl font-bold text-white tracking-tight">
              {language === 'hi'
                ? 'व्युत्क्रम समीकरण व ज्यामिति सॉल्वर (Missing Value Finder)'
                : 'Inverse Formula & Geometry Step-by-Step Solver'}
            </h1>
            <p className="text-xs md:text-sm text-slate-400 mt-1 max-w-3xl">
              {language === 'hi'
                ? 'क्षेत्रफल, आयतन, लंबाई या परिमाप में से कोई भी मान दिया हो तो अज्ञात राशि (चौड़ाई, ऊंचाई, त्रिज्या, भुजा) को NCERT/किताब की तरह चरणबद्ध हल करें।'
                : 'Calculate missing variables (breadth, height, radius, side) when Area, Volume, or Perimeter is given, formatted with textbook mathematical derivations.'}
            </p>
          </div>

          {/* Mode Switcher */}
          <div className="flex flex-wrap rounded-xl bg-slate-950 p-1 border border-slate-800 shrink-0">
            <button
              id="btn-mode-reverse"
              onClick={() => {
                setActiveMode('reverse_calculator');
                setSolution(currentPreset.solve(presetInputs));
              }}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                activeMode === 'reverse_calculator'
                  ? 'bg-indigo-600 text-white shadow-lg'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Target className="w-3.5 h-3.5" />
              <span>{language === 'hi' ? 'व्युत्क्रम कैलकुलेटर' : 'Reverse Solver'}</span>
            </button>
            <button
              id="btn-mode-smart"
              onClick={() => {
                setActiveMode('smart_solver');
                handleSolveTextQuery();
              }}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                activeMode === 'smart_solver'
                  ? 'bg-indigo-600 text-white shadow-lg'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Calculator className="w-3.5 h-3.5" />
              <span>{language === 'hi' ? 'प्रश्न लिख कर हल करें' : 'Text Query Solver'}</span>
            </button>
            <button
              id="btn-mode-formulas"
              onClick={() => setActiveMode('formula_bank')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                activeMode === 'formula_bank'
                  ? 'bg-indigo-600 text-white shadow-lg'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>{language === 'hi' ? 'सूत्र बैंक' : 'Formula Bank'}</span>
            </button>
          </div>
        </div>
      </div>

      {activeMode === 'reverse_calculator' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* LEFT: Preset Category Selector & Inputs */}
          <div className="lg:col-span-5 flex flex-col gap-4">
            {/* Shape / Target Problem Selector */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-xl">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-300 mb-3 flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-indigo-400" />
                  {language === 'hi' ? 'आकृति व अज्ञात राशि चुनें:' : 'Select Problem Type:'}
                </span>
                <span className="text-[10px] text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20">
                  {REVERSE_SOLVER_PRESETS.length} Presets
                </span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-64 overflow-y-auto pr-1">
                {REVERSE_SOLVER_PRESETS.map((p) => {
                  const isSelected = p.id === selectedPresetId;
                  return (
                    <button
                      key={p.id}
                      onClick={() => handleSelectPreset(p)}
                      className={`p-2.5 rounded-xl text-left border transition-all text-xs flex flex-col justify-between ${
                        isSelected
                          ? 'bg-indigo-600/20 border-indigo-500 text-white shadow-md'
                          : 'bg-slate-950/60 border-slate-800/80 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                      }`}
                    >
                      <div className="font-semibold text-slate-200">
                        {language === 'hi' ? p.shapeHi : p.shapeEn}
                      </div>
                      <div className="text-[11px] text-indigo-300 font-mono mt-0.5">
                        ज्ञात: {language === 'hi' ? p.targetNameHi : p.targetNameEn}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Input Values Card */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-300 flex items-center gap-2">
                  <Calculator className="w-4 h-4 text-emerald-400" />
                  <span>{language === 'hi' ? 'दिए गए मान (Given Parameters):' : 'Enter Given Values:'}</span>
                </h3>
                <span className="text-[11px] text-emerald-400 font-mono">
                  {currentPreset.category}
                </span>
              </div>

              <div className="space-y-3.5">
                {currentPreset.inputs.map((inp) => {
                  const val = presetInputs[inp.key] ?? inp.defaultVal;
                  return (
                    <div key={inp.key} className="space-y-1.5 bg-slate-950/60 p-3 rounded-xl border border-slate-800/60">
                      <div className="flex justify-between items-center text-xs">
                        <label className="font-medium text-slate-300 flex items-center gap-1.5">
                          <span className="w-5 h-5 rounded bg-indigo-950 text-indigo-400 flex items-center justify-center font-mono font-bold text-[11px] border border-indigo-800/50">
                            {inp.symbol}
                          </span>
                          <span>{language === 'hi' ? inp.labelHi : inp.labelEn}</span>
                        </label>
                        <span className="text-[11px] font-mono text-slate-400">{inp.unit}</span>
                      </div>

                      <div className="flex items-center gap-3">
                        <input
                          type="range"
                          min={inp.key === 'area' || inp.key === 'volume' ? '10' : '1'}
                          max={inp.key === 'area' || inp.key === 'volume' ? '2000' : '50'}
                          step="1"
                          value={val}
                          onChange={(e) => handlePresetInputChange(inp.key, parseFloat(e.target.value) || 1)}
                          className="w-full accent-indigo-500 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
                        />
                        <input
                          type="number"
                          value={val}
                          onChange={(e) => handlePresetInputChange(inp.key, parseFloat(e.target.value) || 0)}
                          className="w-24 p-2 bg-slate-900 border border-slate-700 rounded-lg text-xs font-mono font-bold text-white text-right focus:border-indigo-500 focus:outline-none"
                        />
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="pt-1">
                <button
                  onClick={() => setSolution(currentPreset.solve(presetInputs))}
                  className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all shadow-lg shadow-indigo-950 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Cpu className="w-4 h-4" />
                  <span>{language === 'hi' ? 'किताब की तरह स्टेप-बाय-स्टेप हल करें' : 'Recalculate Steps'}</span>
                </button>
              </div>
            </div>
          </div>

          {/* RIGHT: Step-by-Step Textbook Solution Display */}
          <div className="lg:col-span-7">
            {solution && <SolutionDisplayCard solution={solution} language={language} onCopy={copySolutionToClipboard} copied={copied} />}
          </div>
        </div>
      )}

      {activeMode === 'smart_solver' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* LEFT: Text Query Input & Sample Problems */}
          <div className="lg:col-span-5 flex flex-col gap-4">
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-xl">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2 flex items-center gap-2">
                <Calculator className="w-4 h-4 text-indigo-400" />
                <span>{language === 'hi' ? 'अपना प्रश्न या संख्याएं दर्ज करें' : 'Enter Problem or Numbers'}</span>
              </label>

              <div className="relative mt-2">
                <textarea
                  rows={4}
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder={
                    language === 'hi'
                      ? 'जैसे: एक आयत का क्षेत्रफल 120 और लंबाई 15 है चौड़ाई क्या होगी?'
                      : 'e.g. A rectangle has area 120 and length 15 find breadth'
                  }
                  className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs md:text-sm text-slate-200 placeholder-slate-600 focus:border-indigo-500 focus:outline-none resize-none leading-relaxed"
                />
              </div>

              <div className="flex items-center justify-between mt-3">
                <button
                  id="btn-solve-offline"
                  onClick={() => handleSolveTextQuery()}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition-all shadow-lg shadow-indigo-950 cursor-pointer"
                >
                  <Cpu className="w-4 h-4" />
                  <span>{language === 'hi' ? 'ऑफ़लाइन हल करें' : 'Solve Step-by-Step'}</span>
                </button>

                <button
                  onClick={() => {
                    setQuery('');
                    setSolution(null);
                  }}
                  className="text-xs text-slate-500 hover:text-slate-300 font-medium"
                >
                  {language === 'hi' ? 'साफ करें' : 'Clear'}
                </button>
              </div>
            </div>

            {/* Quick Sample Questions Card */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-xl">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-2">
                <Lightbulb className="w-4 h-4 text-amber-400" />
                <span>{language === 'hi' ? 'उदाहरण प्रश्न (क्लिक करके तुरंत हल करें)' : 'Sample Questions (Click to solve)'}</span>
              </h3>

              <div className="space-y-2 max-h-96 overflow-y-auto pr-1">
                {(language === 'hi' ? SAMPLE_QUESTIONS_HI : SAMPLE_QUESTIONS_EN).map((q, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setQuery(q);
                      handleSolveTextQuery(q);
                    }}
                    className="w-full text-left p-2.5 rounded-xl bg-slate-950/60 hover:bg-slate-800/80 border border-slate-800/80 text-xs text-slate-300 hover:text-white transition-all flex items-start gap-2"
                  >
                    <ArrowRight className="w-3.5 h-3.5 text-indigo-400 shrink-0 mt-0.5" />
                    <span>{q}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT: Step-by-Step Offline Solution Display */}
          <div className="lg:col-span-7">
            {solution ? (
              <SolutionDisplayCard solution={solution} language={language} onCopy={copySolutionToClipboard} copied={copied} />
            ) : (
              <div className="h-full min-h-[300px] flex flex-col items-center justify-center bg-slate-900/50 border border-dashed border-slate-800 rounded-2xl p-6 text-center text-slate-500">
                <Calculator className="w-12 h-12 mb-3 text-slate-700" />
                <p className="text-sm">
                  {language === 'hi'
                    ? 'बाईं ओर अपना प्रश्न दर्ज करें या उदाहरण प्रश्न पर क्लिक करें।'
                    : 'Enter your question on the left or click any sample problem.'}
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {activeMode === 'formula_bank' && (
        /* FORMULA BANK / CHEATSHEET TAB */
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-2xl space-y-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pb-3 border-b border-slate-800">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-indigo-400" />
              <span>{language === 'hi' ? 'सम्पूर्ण सूत्र बैंक व व्युत्क्रम रूपांतरण (All Formulas & Inverse Rules)' : 'Universal Formula & Inverse Rule Cheatsheet'}</span>
            </h2>

            {/* Search Input */}
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="text"
                value={formulaSearch}
                onChange={(e) => setFormulaSearch(e.target.value)}
                placeholder={language === 'hi' ? 'सूत्र खोजें (जैसे: आयत, बेलन)...' : 'Search formulas...'}
                className="w-full pl-9 pr-3 py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 placeholder-slate-600 focus:border-indigo-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {filteredFormulas.map((item, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-xl bg-slate-950 border border-slate-800/80 hover:border-slate-700 transition-all space-y-2"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white">
                    {language === 'hi' ? item.nameHi : item.nameEn}
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                    {item.category}
                  </span>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-900 text-indigo-300 font-mono text-xs font-semibold leading-relaxed overflow-x-auto">
                  {item.formula}
                </div>
                <p className="text-[11px] text-slate-400">
                  {language === 'hi' ? item.descriptionHi : item.descriptionEn}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// -------------------------------------------------------------
// Subcomponent: Textbook-Style Solution Display Card
// -------------------------------------------------------------

interface SolutionDisplayCardProps {
  solution: OfflineSolution;
  language: 'hi' | 'en';
  onCopy: () => void;
  copied: boolean;
}

const SolutionDisplayCard: React.FC<SolutionDisplayCardProps> = ({ solution, language, onCopy, copied }) => {
  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-2xl space-y-5">
      {/* Solution Header */}
      <div className="border-b border-slate-800 pb-3 flex items-start justify-between gap-3">
        <div>
          <span className="text-[11px] font-mono px-2.5 py-0.5 rounded-md bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            {solution.category}
          </span>
          <h2 className="text-base md:text-lg font-bold text-white mt-1.5 leading-snug">
            {language === 'hi' ? solution.titleHi : solution.titleEn}
          </h2>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={onCopy}
            className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white bg-slate-950 border border-slate-800 px-2.5 py-1.5 rounded-lg transition-all"
            title="Copy Solution"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? (language === 'hi' ? 'कॉपी हो गया' : 'Copied') : (language === 'hi' ? 'हल कॉपी करें' : 'Copy')}</span>
          </button>
          <span className="flex items-center gap-1 text-emerald-400 text-xs bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1.5 rounded-lg font-medium">
            <CheckCircle2 className="w-3.5 h-3.5" />
            100% Offline
          </span>
        </div>
      </div>

      {/* Given Data & To Find Badges (Textbook Header Section) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
          <div className="text-[11px] font-semibold text-slate-400 mb-2 uppercase tracking-wider">
            {language === 'hi' ? '1. दिया गया है (Given Data):' : '1. Given Information:'}
          </div>
          <div className="flex flex-wrap gap-2">
            {solution.givenData.map((d, i) => (
              <div
                key={i}
                className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-300 flex items-center gap-1.5"
              >
                <span className="text-slate-400">{language === 'hi' ? d.labelHi : d.labelEn}:</span>
                <span className="text-indigo-400 font-mono font-bold">{d.value}</span>
              </div>
            ))}
          </div>
        </div>

        {solution.toFindHi && (
          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
            <div className="text-[11px] font-semibold text-slate-400 mb-2 uppercase tracking-wider">
              {language === 'hi' ? '2. ज्ञात करना है (To Find):' : '2. To Calculate:'}
            </div>
            <div className="text-xs font-semibold text-amber-300 font-mono">
              {language === 'hi' ? solution.toFindHi : solution.toFindEn}
            </div>
          </div>
        )}
      </div>

      {/* Step-by-Step Textbook Derivation */}
      <div>
        <div className="text-xs font-semibold text-slate-400 mb-2 flex items-center justify-between">
          <span>{language === 'hi' ? '3. चरणबद्ध बीजगणितीय हल (Step-by-Step Derivation):' : '3. Step-by-Step Solution:'}</span>
          <span className="text-[11px] text-slate-500 font-normal">NCERT / Textbook Method</span>
        </div>
        <div className="space-y-2">
          {(language === 'hi' ? solution.stepsHi : solution.stepsEn).map((step, idx) => (
            <div
              key={idx}
              className="p-3 rounded-xl bg-slate-950/90 border border-slate-800/90 text-xs md:text-sm font-mono text-slate-200 leading-relaxed flex items-start gap-2.5"
            >
              <span className="w-5 h-5 rounded-full bg-indigo-950 text-indigo-400 border border-indigo-800/60 flex items-center justify-center text-[10px] shrink-0 mt-0.5">
                {idx + 1}
              </span>
              <span className="flex-1">{step}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Final Answer Banner */}
      <div className="p-4 rounded-xl bg-gradient-to-r from-emerald-950/40 via-slate-950 to-indigo-950/40 border border-emerald-500/30 shadow-lg">
        <div className="text-[11px] font-semibold text-emerald-400 uppercase tracking-wider mb-1 flex items-center gap-1.5">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{language === 'hi' ? '4. अंतिम उत्तर व निष्कर्ष (Final Result)' : '4. Final Result & Answer'}</span>
        </div>
        <div className="text-sm md:text-base font-bold text-white font-mono leading-relaxed mt-1">
          {language === 'hi' ? solution.finalAnswerHi : solution.finalAnswerEn}
        </div>
      </div>

      {/* Formulas Used */}
      <div>
        <div className="text-xs font-semibold text-slate-400 mb-1.5">
          {language === 'hi' ? 'प्रयुक्त सूत्र (Formulas Used):' : 'Applied Formulas:'}
        </div>
        <div className="flex flex-wrap gap-2">
          {solution.formulasUsed.map((f, i) => (
            <span
              key={i}
              className="px-2.5 py-1 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 font-mono text-xs font-medium"
            >
              {f}
            </span>
          ))}
        </div>
      </div>

      {/* Optional Exam Tips */}
      {solution.tipsHi && (
        <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs flex items-start gap-2">
          <Lightbulb className="w-4 h-4 shrink-0 mt-0.5 text-amber-400" />
          <span>{language === 'hi' ? solution.tipsHi : solution.tipsEn}</span>
        </div>
      )}
    </div>
  );
};
