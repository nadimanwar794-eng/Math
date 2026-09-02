import React, { useState } from 'react';
import { Bot, HelpCircle, Loader2, Send, Sparkles, Wand2 } from 'lucide-react';

interface AiSolverTabProps {
  language: 'hi' | 'en';
}

export const AiSolverTab: React.FC<AiSolverTabProps> = ({ language }) => {
  const [question, setQuestion] = useState('');
  const [loading, setLoading] = useState(false);
  const [solution, setSolution] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const sampleQuestions = [
    {
      hi: 'एक 5 सेमी के घन को बाहर से नीले रंग से रंगा गया और 1 सेमी के टुकड़ों में काटा गया। 1, 2 और 3 सतह रंगे घनों की संख्या बताओ।',
      en: 'A 5 cm cube is painted blue and cut into 1 cm cubes. Find number of 1-face, 2-face and 3-face painted cubes.',
    },
    {
      hi: 'एक बेलन (Cylinder) की त्रिज्या 7 सेमी और ऊंचाई 10 सेमी है। इसका आयतन और कुल पृष्ठ क्षेत्रफल ज्ञात करें।',
      en: 'A cylinder has radius 7 cm and height 10 cm. Find its volume and total surface area.',
    },
    {
      hi: 'एक घनाभ की लंबाई 12 सेमी, चौड़ाई 9 सेमी और ऊंचाई 8 सेमी है। इसके सबसे लंबे विकर्ण की लंबाई क्या होगी?',
      en: 'A cuboid has length 12 cm, width 9 cm and height 8 cm. What is the length of its longest diagonal?',
    },
    {
      hi: 'पासे (Dice) में जब दो फलक उभयनिष्ठ (Common) हों, तो विपरीत सतह कैसे पहचानी जाती है? नियम समझाइए।',
      en: 'In dice reasoning, how do we find opposite faces when two faces are common? Explain the rule.',
    },
  ];

  const handleSolve = async (promptText?: string) => {
    const q = promptText || question;
    if (!q.trim()) return;

    setLoading(true);
    setError(null);
    setSolution(null);

    try {
      const res = await fetch('/api/ai/solve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: q, language }),
      });

      const data = await res.json();
      if (data.answer) {
        setSolution(data.answer);
      } else {
        setError(data.error || 'Failed to solve question');
      }
    } catch (err: any) {
      setError(err.message || 'Network error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-600/30 border border-indigo-400/50 flex items-center justify-center text-indigo-400">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
              {language === 'hi' ? 'AI गणित व रीज़निंग डाउट सॉल्वर' : 'AI Math & Reasoning Solver'}
              <span className="text-[10px] font-semibold bg-indigo-950 text-indigo-400 border border-indigo-800 px-2 py-0.5 rounded-full">
                Gemini 3.7
              </span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              {language === 'hi'
                ? 'घन, घनाभ, पासा, बेलन, शंकु से जुड़ा कोई भी प्रश्न हिंदी या अंग्रेजी में पूछें।'
                : 'Ask any 3D geometry mensuration or reasoning question with step-by-step proof.'}
            </p>
          </div>
        </div>
      </div>

      {/* Input Box */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 sm:p-5 backdrop-blur-md space-y-3">
        <textarea
          rows={3}
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder={
            language === 'hi'
              ? 'यहाँ अपना गणित या रीज़निंग प्रश्न लिखें... (जैसे: एक 6 सेमी घन को काटा गया...)'
              : 'Type your math or reasoning question here...'
          }
          className="w-full bg-slate-950 border border-slate-700/80 rounded-xl p-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all resize-none"
        />

        <div className="flex justify-between items-center">
          <span className="text-[11px] text-slate-400">
            {language === 'hi' ? '💡 शॉर्टकट, सूत्र व 3D स्टेप्स के साथ उत्तर मिलेगा' : '💡 With formulas and shortcuts'}
          </span>
          <button
            onClick={() => handleSolve()}
            disabled={loading || !question.trim()}
            className="px-5 py-2.5 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white shadow-lg shadow-indigo-500/25 transition-all flex items-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                {language === 'hi' ? 'हल किया जा रहा है...' : 'Solving...'}
              </>
            ) : (
              <>
                <Send className="w-3.5 h-3.5" />
                {language === 'hi' ? 'स्टेप-बाय-स्टेप हल करें' : 'Solve Step-by-Step'}
              </>
            )}
          </button>
        </div>
      </div>

      {/* Sample Question Prompts */}
      <div className="space-y-2">
        <div className="text-xs font-semibold text-slate-400">
          {language === 'hi' ? 'उदाहरण प्रश्न (क्लिक करके तुरंत हल देखें):' : 'Popular Exam Questions:'}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {sampleQuestions.map((q, idx) => (
            <button
              key={idx}
              onClick={() => {
                setQuestion(language === 'hi' ? q.hi : q.en);
                handleSolve(language === 'hi' ? q.hi : q.en);
              }}
              className="p-3 text-left bg-slate-900/60 hover:bg-slate-800/80 border border-slate-800 rounded-xl text-xs text-slate-300 transition-all flex items-start gap-2 group"
            >
              <Wand2 className="w-3.5 h-3.5 text-indigo-400 mt-0.5 group-hover:rotate-12 transition-transform" />
              <span>{language === 'hi' ? q.hi : q.en}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Solution Display Area */}
      {solution && (
        <div className="bg-slate-900/95 border border-indigo-900/60 rounded-2xl p-5 sm:p-6 backdrop-blur-md shadow-2xl space-y-3 animate-in fade-in duration-300">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5 uppercase tracking-wide">
              <Sparkles className="w-4 h-4" />
              {language === 'hi' ? 'विस्तृत हल व 3D ट्रिक (Detailed Solution)' : 'Detailed Solution & Shortcuts'}
            </span>
          </div>

          <div className="text-xs sm:text-sm text-slate-200 leading-relaxed font-sans whitespace-pre-line space-y-2">
            {solution}
          </div>
        </div>
      )}

      {error && (
        <div className="p-4 rounded-xl bg-rose-950/80 border border-rose-800 text-xs text-rose-300">
          {error}
        </div>
      )}
    </div>
  );
};
