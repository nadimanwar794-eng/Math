import React, { useState } from 'react';
import {
  Printer,
  Download,
  Share2,
  Copy,
  Check,
  FileCode,
  FileText,
  ChevronDown,
  Sparkles,
} from 'lucide-react';
import {
  downloadMHTMLFile,
  downloadOfflineHTMLFile,
  triggerPrint,
  shareContent,
} from '../utils/exportUtils';

interface ExportActionMenuProps {
  title: string;
  filename?: string;
  getHTMLContent: () => string;
  getPlainText?: () => string;
  language: 'hi' | 'en';
  extraStyles?: string;
  className?: string;
}

export const ExportActionMenu: React.FC<ExportActionMenuProps> = ({
  title,
  filename = 'geometry_solution',
  getHTMLContent,
  getPlainText,
  language,
  extraStyles,
  className = '',
}) => {
  const [copied, setCopied] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [statusMsg, setStatusMsg] = useState<string | null>(null);

  const showStatus = (msg: string) => {
    setStatusMsg(msg);
    setTimeout(() => setStatusMsg(null), 2500);
  };

  const handlePrint = () => {
    setDropdownOpen(false);
    triggerPrint();
  };

  const handleDownloadMHTML = () => {
    setDropdownOpen(false);
    const html = getHTMLContent();
    downloadMHTMLFile(filename, title, html, extraStyles);
    showStatus(language === 'hi' ? 'MHTML फ़ाइल डाउनलोड हो गई!' : 'MHTML file downloaded!');
  };

  const handleDownloadHTML = () => {
    setDropdownOpen(false);
    const html = getHTMLContent();
    downloadOfflineHTMLFile(filename, title, html, extraStyles);
    showStatus(language === 'hi' ? 'ऑफ़लाइन HTML फ़ाइल डाउनलोड हो गई!' : 'Offline HTML file downloaded!');
  };

  const handleCopyText = async () => {
    const text = getPlainText ? getPlainText() : title;
    await navigator.clipboard.writeText(text);
    setCopied(true);
    showStatus(language === 'hi' ? 'टेक्स्ट कॉपी हो गया!' : 'Text copied!');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = async () => {
    setDropdownOpen(false);
    const text = getPlainText ? getPlainText() : title;
    const ok = await shareContent(title, text);
    if (ok) {
      showStatus(language === 'hi' ? 'शेयर विकल्प खुला' : 'Share opened');
    }
  };

  return (
    <div className={`relative inline-flex items-center gap-1.5 ${className}`}>
      {/* Toast feedback */}
      {statusMsg && (
        <div className="absolute -top-10 left-1/2 -translate-x-1/2 z-50 bg-emerald-600 text-white font-medium text-xs px-3 py-1 rounded-lg shadow-lg whitespace-nowrap animate-fade-in pointer-events-none">
          {statusMsg}
        </div>
      )}

      {/* Primary Print / PDF Button */}
      <button
        onClick={handlePrint}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md transition-all active:scale-95"
        title={language === 'hi' ? 'प्रिंट / PDF के रूप में सेव करें' : 'Print / Save as PDF'}
      >
        <Printer className="w-3.5 h-3.5" />
        <span>{language === 'hi' ? 'प्रिंट / PDF' : 'Print / PDF'}</span>
      </button>

      {/* MHTML / HTML Download Dropdown Button */}
      <div className="relative">
        <button
          onClick={() => setDropdownOpen((prev) => !prev)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 text-xs font-semibold shadow-md transition-all active:scale-95"
          title={language === 'hi' ? 'मोबाइल में डाउनलोड (MHTML / HTML)' : 'Download Options (MHTML / HTML)'}
        >
          <Download className="w-3.5 h-3.5 text-amber-400" />
          <span>{language === 'hi' ? 'डाउनलोड (MHTML)' : 'Download'}</span>
          <ChevronDown className="w-3 h-3 text-slate-400" />
        </button>

        {/* Dropdown Menu */}
        {dropdownOpen && (
          <>
            <div
              className="fixed inset-0 z-40"
              onClick={() => setDropdownOpen(false)}
            />
            <div className="absolute right-0 mt-1.5 w-64 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl p-1.5 z-50 text-xs space-y-1 animate-scale-up">
              <div className="px-2.5 py-1.5 text-[11px] font-bold text-slate-400 border-b border-slate-800 flex items-center justify-between">
                <span>{language === 'hi' ? 'मोबाइल में डाउनलोड / सेव' : 'Direct Mobile Download'}</span>
                <span className="text-[10px] text-amber-400 font-mono">100% Offline</span>
              </div>

              {/* 1. MHTML Option */}
              <button
                onClick={handleDownloadMHTML}
                className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg hover:bg-indigo-950/80 text-left text-slate-200 hover:text-white transition-all group"
              >
                <div className="w-6 h-6 rounded-md bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold font-mono text-[10px] shrink-0 group-hover:scale-110 transition-transform">
                  MHT
                </div>
                <div className="flex-1">
                  <div className="font-bold text-slate-100 flex items-center gap-1">
                    <span>{language === 'hi' ? 'MHTML वेब आर्काइव (.mhtml)' : 'MHTML Web Archive (.mhtml)'}</span>
                  </div>
                  <div className="text-[10px] text-slate-400">
                    {language === 'hi' ? 'मोबाइल में बिना इंटरनेट खुलेगा' : 'Single offline file for mobile'}
                  </div>
                </div>
              </button>

              {/* 2. HTML Standalone Option */}
              <button
                onClick={handleDownloadHTML}
                className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg hover:bg-indigo-950/80 text-left text-slate-200 hover:text-white transition-all group"
              >
                <div className="w-6 h-6 rounded-md bg-blue-500/20 text-blue-400 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                  <FileCode className="w-3.5 h-3.5" />
                </div>
                <div className="flex-1">
                  <div className="font-bold text-slate-100">
                    {language === 'hi' ? 'ऑफ़लाइन वेबपेज (.html)' : 'Offline Webpage (.html)'}
                  </div>
                  <div className="text-[10px] text-slate-400">
                    {language === 'hi' ? 'किसी भी ब्राउज़र में सीधे खुलेगा' : 'Open directly in any browser'}
                  </div>
                </div>
              </button>

              {/* 3. Print / Save as PDF */}
              <button
                onClick={handlePrint}
                className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg hover:bg-indigo-950/80 text-left text-slate-200 hover:text-white transition-all group"
              >
                <div className="w-6 h-6 rounded-md bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                  <Printer className="w-3.5 h-3.5" />
                </div>
                <div className="flex-1">
                  <div className="font-bold text-slate-100">
                    {language === 'hi' ? 'प्रिंट / PDF के रूप में सेव' : 'Print / Save as PDF'}
                  </div>
                  <div className="text-[10px] text-slate-400">
                    {language === 'hi' ? 'मोबाइल में PDF डाउनलोड करें' : 'Print dialog / PDF export'}
                  </div>
                </div>
              </button>

              {/* 4. Share to WhatsApp / Apps */}
              <button
                onClick={handleShare}
                className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg hover:bg-indigo-950/80 text-left text-slate-200 hover:text-white transition-all group"
              >
                <div className="w-6 h-6 rounded-md bg-purple-500/20 text-purple-400 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                  <Share2 className="w-3.5 h-3.5" />
                </div>
                <div className="flex-1">
                  <div className="font-bold text-slate-100">
                    {language === 'hi' ? 'मोबाइल शेयर (WhatsApp / Drive)' : 'Share (WhatsApp / Drive)'}
                  </div>
                  <div className="text-[10px] text-slate-400">
                    {language === 'hi' ? 'ऐप्स में सीधे भेजें' : 'Share to mobile apps'}
                  </div>
                </div>
              </button>
            </div>
          </>
        )}
      </div>

      {/* Quick Copy Text Button */}
      <button
        onClick={handleCopyText}
        className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700 text-xs font-medium transition-all active:scale-95"
        title={language === 'hi' ? 'पूरा हल टेक्स्ट कॉपी करें' : 'Copy text to clipboard'}
      >
        {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
        <span className="hidden sm:inline">
          {copied ? (language === 'hi' ? 'कॉपी हुआ' : 'Copied') : (language === 'hi' ? 'कॉपी' : 'Copy')}
        </span>
      </button>
    </div>
  );
};
