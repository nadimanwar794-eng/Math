import React, { useState } from 'react';
import {
  BookOpen,
  CheckCircle2,
  Copy,
  Check,
  Printer,
  Sparkles,
  Lightbulb,
  Target,
  FileText,
  HelpCircle,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Share2,
} from 'lucide-react';
import { OfflineSolution } from '../utils/mathEngineOffline';

interface TextbookWhitePageProps {
  solution: OfflineSolution;
  language: 'hi' | 'en';
  questionText?: string;
}

export const TextbookWhitePage: React.FC<TextbookWhitePageProps> = ({
  solution,
  language,
  questionText,
}) => {
  const [paperStyle, setPaperStyle] = useState<'plain' | 'ruled' | 'grid'>('plain');
  const [fontSizeLevel, setFontSizeLevel] = useState<number>(1); // 0: compact, 1: standard, 2: large
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    const text = [
      `=== ${language === 'hi' ? solution.titleHi : solution.titleEn} ===`,
      questionText ? `[${language === 'hi' ? 'प्रश्न' : 'Question'}]: ${questionText}` : '',
      `[${language === 'hi' ? 'दिया गया है' : 'Given Data'}]:`,
      ...solution.givenData.map((d) => `  • ${language === 'hi' ? d.labelHi : d.labelEn} = ${d.value}`),
      solution.toFindHi ? `[${language === 'hi' ? 'ज्ञात करना है' : 'To Find'}]: ${language === 'hi' ? solution.toFindHi : solution.toFindEn}` : '',
      `\n[${language === 'hi' ? 'सूत्र' : 'Formulas Used'}]: ${solution.formulasUsed.join(', ')}`,
      `\n[${language === 'hi' ? 'चरणबद्ध हल' : 'Step-by-Step Derivation'}]:`,
      ...(language === 'hi' ? solution.stepsHi : solution.stepsEn).map((s, i) => `  (${i + 1}) ${s}`),
      `\n[${language === 'hi' ? 'अंतिम उत्तर' : 'Final Answer'}]: ${language === 'hi' ? solution.finalAnswerHi : solution.finalAnswerEn}`,
      solution.tipsHi ? `\n[${language === 'hi' ? 'किताब की टिप्पणी' : 'Note'}]: ${language === 'hi' ? solution.tipsHi : solution.tipsEn}` : '',
    ].filter(Boolean).join('\n');

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  const fontSizes = [
    { container: 'text-xs', heading: 'text-sm md:text-base', formula: 'text-xs', step: 'text-xs' },
    { container: 'text-sm', heading: 'text-base md:text-lg', formula: 'text-xs md:text-sm', step: 'text-xs md:text-sm' },
    { container: 'text-base', heading: 'text-lg md:text-xl', formula: 'text-sm md:text-base', step: 'text-sm md:text-base' },
  ];

  const currentFontSize = fontSizes[fontSizeLevel];

  // Paper background patterns
  const getPaperBgClasses = () => {
    if (paperStyle === 'ruled') {
      return 'bg-white bg-[linear-gradient(#e5e7eb_1px,transparent_1px)] [background-size:100%_28px]';
    }
    if (paperStyle === 'grid') {
      return 'bg-white bg-[linear-gradient(to_right,#e5e7eb_1px,transparent_1px),linear-gradient(to_bottom,#e5e7eb_1px,transparent_1px)] [background-size:20px_20px]';
    }
    return 'bg-[#ffffff]';
  };

  return (
    <div className="w-full flex flex-col space-y-3">
      {/* Textbook Page Toolbar */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-2.5 flex flex-wrap items-center justify-between gap-2 shadow-md">
        <div className="flex items-center gap-1.5 text-xs text-slate-300">
          <BookOpen className="w-4 h-4 text-indigo-400" />
          <span className="font-bold text-white">
            {language === 'hi' ? 'श्वेत पुस्तक पृष्ठ (Textbook Page View)' : 'White Textbook Page View'}
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          {/* Paper style selector */}
          <div className="flex bg-slate-950 rounded-lg p-0.5 border border-slate-800 text-[11px]">
            <button
              onClick={() => setPaperStyle('plain')}
              className={`px-2 py-1 rounded-md transition-all ${
                paperStyle === 'plain'
                  ? 'bg-indigo-600 text-white font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {language === 'hi' ? 'कोरा पृष्ठ' : 'Plain'}
            </button>
            <button
              onClick={() => setPaperStyle('ruled')}
              className={`px-2 py-1 rounded-md transition-all ${
                paperStyle === 'ruled'
                  ? 'bg-indigo-600 text-white font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {language === 'hi' ? 'रूल्ड नोटबुक' : 'Ruled'}
            </button>
            <button
              onClick={() => setPaperStyle('grid')}
              className={`px-2 py-1 rounded-md transition-all ${
                paperStyle === 'grid'
                  ? 'bg-indigo-600 text-white font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {language === 'hi' ? 'ग्राफ शीट' : 'Grid'}
            </button>
          </div>

          {/* Font Size Adjust */}
          <div className="flex items-center bg-slate-950 rounded-lg border border-slate-800 text-slate-400 p-0.5">
            <button
              onClick={() => setFontSizeLevel((l) => Math.max(0, l - 1))}
              disabled={fontSizeLevel === 0}
              className="p-1 hover:text-white disabled:opacity-30"
              title="A-"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span className="text-[10px] font-mono px-1 font-bold text-indigo-300">
              {fontSizeLevel === 0 ? 'स्मॉल' : fontSizeLevel === 1 ? 'मानक' : 'बड़ा'}
            </span>
            <button
              onClick={() => setFontSizeLevel((l) => Math.min(2, l + 1))}
              disabled={fontSizeLevel === 2}
              className="p-1 hover:text-white disabled:opacity-30"
              title="A+"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Action Buttons */}
          <button
            onClick={handleCopy}
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-950 hover:bg-slate-800 text-slate-300 border border-slate-800 text-[11px] font-medium transition-all"
            title="Copy Solution"
          >
            {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
            <span>{copied ? (language === 'hi' ? 'कॉपी हुआ' : 'Copied') : (language === 'hi' ? 'कॉपी' : 'Copy')}</span>
          </button>

          <button
            onClick={handlePrint}
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-[11px] font-semibold transition-all shadow"
            title="Print Page"
          >
            <Printer className="w-3 h-3" />
            <span>{language === 'hi' ? 'प्रिंट / PDF' : 'Print'}</span>
          </button>
        </div>
      </div>

      {/* =================================================================== */}
      {/* THE WHITE TEXTBOOK PAGE ITSELF                                      */}
      {/* =================================================================== */}
      <div
        id="printable-textbook-page"
        className={`w-full ${getPaperBgClasses()} text-slate-900 border-2 border-slate-300 rounded-2xl shadow-2xl overflow-hidden transition-all duration-200 relative`}
      >
        {/* Textbook Top Ribbon & Book Header */}
        <div className="bg-slate-100 border-b-2 border-slate-300 px-5 py-3 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded bg-indigo-900 text-white font-mono font-bold text-[10px] tracking-wider uppercase shadow-sm">
              {solution.category || 'MENSURATION & GEOMETRY'}
            </span>
            <span className="text-xs font-serif font-bold text-slate-700">
              {language === 'hi' ? 'हल किया गया प्रामाणिक उदाहरण' : 'Fully Solved Standard Example'}
            </span>
          </div>

          <div className="text-[11px] font-serif italic text-slate-500 flex items-center gap-1">
            <span>📖</span>
            <span>{language === 'hi' ? 'पाठ्यपुस्तक विधि (Textbook Method)' : 'Textbook Method'}</span>
          </div>
        </div>

        {/* Page Content with Left Red Margin Rule */}
        <div className="relative p-5 sm:p-7 md:p-9 space-y-6">
          {/* Authentic Left Red Margin Line for Notebook feel */}
          <div className="absolute top-0 bottom-0 left-3 sm:left-4 w-[2px] bg-red-400/60 pointer-events-none" />

          {/* Section 0: Chapter Title & Problem Statement */}
          <div className="ml-2 sm:ml-4 border-b-2 border-slate-200 pb-4">
            <div className="flex items-center gap-2 mb-1">
              <span className="w-6 h-6 rounded-full bg-indigo-700 text-white flex items-center justify-center font-bold text-xs font-serif">
                Q
              </span>
              <h2 className={`${currentFontSize.heading} font-serif font-bold text-slate-950 tracking-tight`}>
                {language === 'hi' ? solution.titleHi : solution.titleEn}
              </h2>
            </div>

            {questionText && (
              <div className="mt-2.5 p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm font-serif text-slate-800 leading-relaxed italic">
                <span className="font-bold text-slate-950 not-italic mr-1">
                  {language === 'hi' ? 'प्रश्न:' : 'Problem:'}
                </span>
                {questionText}
              </div>
            )}
          </div>

          {/* Section 1: Given Data (दिया गया है) */}
          <div className="ml-2 sm:ml-4 space-y-2">
            <div className="flex items-center gap-1.5 text-xs font-bold font-serif text-slate-900 uppercase tracking-wider">
              <CheckCircle2 className="w-4 h-4 text-indigo-700" />
              <span>{language === 'hi' ? '1. दिया गया है (Given Data):' : '1. Given Parameters:'}</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5">
              {solution.givenData.map((d, idx) => (
                <div
                  key={idx}
                  className="bg-blue-50/70 border border-blue-200 rounded-xl p-2.5 flex flex-col justify-between shadow-xs"
                >
                  <span className="text-[11px] font-medium text-slate-600 font-serif">
                    {language === 'hi' ? d.labelHi : d.labelEn}
                  </span>
                  <span className="text-xs sm:text-sm font-mono font-bold text-indigo-950 mt-1">
                    {d.value}
                  </span>
                </div>
              ))}
            </div>

            {solution.toFindHi && (
              <div className="mt-2 p-2.5 rounded-xl bg-amber-50/80 border border-amber-200 text-xs font-serif text-amber-950 flex items-center gap-2">
                <Target className="w-4 h-4 text-amber-700 shrink-0" />
                <div>
                  <span className="font-bold mr-1">
                    {language === 'hi' ? 'ज्ञात करना है (To Find):' : 'To Find:'}
                  </span>
                  <span className="font-semibold underline decoration-amber-600">
                    {language === 'hi' ? solution.toFindHi : solution.toFindEn}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Section 2: Formulas & Theorems (प्रयुक्त सूत्र) */}
          <div className="ml-2 sm:ml-4 space-y-2">
            <div className="flex items-center gap-1.5 text-xs font-bold font-serif text-slate-900 uppercase tracking-wider">
              <BookOpen className="w-4 h-4 text-amber-700" />
              <span>{language === 'hi' ? '2. मानक सूत्र (Standard Formulas Applied):' : '2. Key Formulas:'}</span>
            </div>

            <div className="bg-amber-50/90 border-2 border-amber-300 rounded-xl p-3.5 space-y-1.5 shadow-sm">
              <div className="flex flex-wrap gap-2">
                {solution.formulasUsed.map((f, i) => (
                  <div
                    key={i}
                    className="px-3 py-1 rounded-lg bg-white border border-amber-300 font-mono font-bold text-xs sm:text-sm text-amber-950 shadow-xs"
                  >
                    {f}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Section 3: Step-by-Step Textbook Derivation (चरणबद्ध हल) */}
          <div className="ml-2 sm:ml-4 space-y-3">
            <div className="flex items-center gap-1.5 text-xs font-bold font-serif text-slate-900 uppercase tracking-wider">
              <FileText className="w-4 h-4 text-emerald-700" />
              <span>{language === 'hi' ? '3. विस्तृत चरणबद्ध हल (Step-by-Step Derivation):' : '3. Derivation & Calculations:'}</span>
            </div>

            <div className="space-y-2.5">
              {(language === 'hi' ? solution.stepsHi : solution.stepsEn).map((step, idx) => (
                <div
                  key={idx}
                  className="p-3 sm:p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-mono text-xs sm:text-sm leading-relaxed shadow-xs flex items-start gap-2.5"
                >
                  <span className="w-6 h-6 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  <div className="flex-1 whitespace-pre-line font-medium text-slate-900">
                    {step}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section 4: Highlighted Final Boxed Answer (अंतिम उत्तर) */}
          <div className="ml-2 sm:ml-4">
            <div className="bg-emerald-50 border-2 border-emerald-600 rounded-2xl p-4 sm:p-5 shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="space-y-1">
                <div className="flex items-center gap-1.5 text-emerald-800 font-bold text-xs uppercase tracking-wider">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>{language === 'hi' ? '★ अभीष्ट अंतिम उत्तर (Final Result)' : '★ Final Answer'}</span>
                </div>
                <div className="text-base sm:text-lg md:text-xl font-bold font-mono text-emerald-950 leading-relaxed">
                  {language === 'hi' ? solution.finalAnswerHi : solution.finalAnswerEn}
                </div>
              </div>

              <div className="shrink-0 px-3 py-1.5 rounded-xl bg-emerald-600 text-white font-serif font-bold text-xs text-center shadow">
                {language === 'hi' ? 'इति सिद्धम् / Q.E.D.' : 'Solved & Verified'}
              </div>
            </div>
          </div>

          {/* Section 5: Book Pro-Tip & Rules (किताब की विशेष टिप्पणी) */}
          {solution.tipsHi && (
            <div className="ml-2 sm:ml-4 p-3.5 rounded-xl bg-indigo-50/80 border border-indigo-200 flex items-start gap-2.5 text-xs font-serif text-indigo-950">
              <Lightbulb className="w-4 h-4 text-indigo-700 shrink-0 mt-0.5" />
              <div className="leading-relaxed">
                <strong className="text-indigo-900 mr-1">
                  {language === 'hi' ? 'विशेष पुस्तक नोट (Important Note):' : 'Key Note:'}
                </strong>
                {language === 'hi' ? solution.tipsHi : solution.tipsEn}
              </div>
            </div>
          )}

          {/* Page Footer */}
          <div className="ml-2 sm:ml-4 pt-4 border-t border-slate-200 flex justify-between items-center text-[10px] font-mono text-slate-500">
            <span>© 3D Geometry & Reasoning Master • 100% Offline Textbook Standard</span>
            <span>Page 1 of 1</span>
          </div>
        </div>
      </div>
    </div>
  );
};
