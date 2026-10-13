import React, { useState } from 'react';
import { useThemeLanguage } from '../context/ThemeLanguageContext';
import { X, Sparkles, Send, Copy, Check, Heart, Feather } from 'lucide-react';

export const AiWeddingAssistantModal: React.FC = () => {
  const { isAiModalOpen, setIsAiModalOpen, language, updateInvitation, invitation } =
    useThemeLanguage();
  const [promptInput, setPromptInput] = useState('');
  const [typeSelect, setTypeSelect] = useState<'speech' | 'vow' | 'guest_title'>('speech');
  const [isLoading, setIsLoading] = useState(false);
  const [aiResult, setAiResult] = useState('');
  const [copied, setCopied] = useState(false);

  if (!isAiModalOpen) return null;

  const isKh = language === 'kh';

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setAiResult('');

    try {
      const res = await fetch('/api/ai-wedding-assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt:
            promptInput ||
            `សូមសរសេរពាក្យអញ្ជើញអាពាហ៍ពិពាហ៍ផ្លូវការខ្មែរយ៉ាងប្រណិតសម្រាប់កូនប្រុស ${invitation.groomName} និងកូនស្រី ${invitation.brideName}`,
          type: typeSelect,
          language: language,
        }),
      });

      const data = await res.json();
      if (data.result) {
        setAiResult(data.result);
      } else if (data.error) {
        setAiResult(`Error: ${data.error}`);
      }
    } catch (err: any) {
      setAiResult(`Failed to generate: ${err?.message || 'Server error'}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleApplyToInvitation = () => {
    if (!aiResult) return;
    if (typeSelect === 'speech') {
      updateInvitation({ formalInvitationText: aiResult });
    } else if (typeSelect === 'guest_title') {
      updateInvitation({ guestHonorifics: aiResult });
    } else if (typeSelect === 'vow') {
      updateInvitation({ thankYouMessage: aiResult });
    }
    setIsAiModalOpen(false);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(aiResult);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in">
      <div className="bg-white dark:bg-slate-900 border border-amber-300 dark:border-amber-900/60 rounded-3xl max-w-lg w-full p-6 shadow-2xl relative overflow-hidden max-h-[90vh] flex flex-col">
        {/* Top Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-purple-100 dark:bg-purple-950 text-purple-600 dark:text-purple-300">
              <Sparkles className="w-5 h-5 animate-spin-slow" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white font-serif">
                {isKh ? 'AI ជំនួយការសរសេរធៀបការ' : 'AI Wedding Speech Writer'}
              </h2>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                {isKh ? 'បង្កើតពាក្យពេចន៍ផ្លូវការ និងពាក្យជូនពរយ៉ាងប្រណិត' : 'Generate formal Cambodian speeches & quotes'}
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsAiModalOpen(false)}
            className="p-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="py-4 space-y-4 overflow-y-auto flex-1">
          {/* Quick Preset Buttons */}
          <div className="flex flex-wrap gap-2 text-xs">
            <button
              onClick={() => {
                setTypeSelect('speech');
                setPromptInput(
                  `សូមសរសេរលិខិតអញ្ជើញផ្លូវការខ្មែរ សម្រាប់កូនប្រុស ${invitation.groomName} និងកូនស្រី ${invitation.brideName} ឱ្យមានភាពពិរោះរណ្តំ និងថ្លៃថ្នូរ`
                );
              }}
              className={`px-3 py-1.5 rounded-xl border transition-all flex items-center gap-1 ${
                typeSelect === 'speech'
                  ? 'bg-purple-600 text-white border-purple-600 font-semibold'
                  : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
              }`}
            >
              <Feather className="w-3.5 h-3.5" />
              <span>{isKh ? 'លិខិតអញ្ជើញ' : 'Invitation Speech'}</span>
            </button>

            <button
              onClick={() => {
                setTypeSelect('vow');
                setPromptInput(
                  `សូមសរសេរសារថ្លែងអំណរគុណ និងពាក្យសច្ចាប្រណិធានស្នេហាកក់ក្តៅ សម្រាប់ថ្ងៃរៀបការ`
                );
              }}
              className={`px-3 py-1.5 rounded-xl border transition-all flex items-center gap-1 ${
                typeSelect === 'vow'
                  ? 'bg-purple-600 text-white border-purple-600 font-semibold'
                  : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
              }`}
            >
              <Heart className="w-3.5 h-3.5" />
              <span>{isKh ? 'សារអរគុណ & ស្នេហា' : 'Romantic Vows'}</span>
            </button>

            <button
              onClick={() => {
                setTypeSelect('guest_title');
                setPromptInput(
                  `សូមរៀបរាប់គោរមង្ត និងពាក្យអញ្ជើញភ្ញៀវកិត្តិយសជាន់ខ្ពស់ខ្មែរ (សម្តេច, ឯកឧត្តម, លោកជំទាវ, ឧកញ៉ា...)`
                );
              }}
              className={`px-3 py-1.5 rounded-xl border transition-all flex items-center gap-1 ${
                typeSelect === 'guest_title'
                  ? 'bg-purple-600 text-white border-purple-600 font-semibold'
                  : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
              }`}
            >
              <span>{isKh ? 'គោរមងារភ្ញៀវ' : 'Guest Honorifics'}</span>
            </button>
          </div>

          <form onSubmit={handleGenerate} className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                {isKh ? 'ការណែនាំដល់ AI (Custom Prompt)' : 'Instructions for AI'}
              </label>
              <textarea
                value={promptInput}
                onChange={(e) => setPromptInput(e.target.value)}
                rows={3}
                className="w-full p-3 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:outline-hidden focus:border-purple-500 dark:text-white"
                placeholder={
                  isKh
                    ? 'ឧទាហរណ៍៖ សូមសរសេរពាក្យអញ្ជើញផ្លូវការបែបប្រពៃណីខ្មែរ...'
                    : 'Write a sweet and respectful invitation message...'
                }
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-amber-600 hover:from-purple-700 hover:to-indigo-700 text-white font-semibold text-xs shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <Sparkles className="w-4 h-4 animate-spin" />
                  <span>{isKh ? 'កំពុងបង្កើតអត្ថបទ...' : 'Generating with Gemini...'}</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>{isKh ? 'បង្កើតអត្ថបទភ្លាមៗ' : 'Generate Now'}</span>
                </>
              )}
            </button>
          </form>

          {aiResult && (
            <div className="p-4 rounded-2xl bg-amber-50/70 dark:bg-slate-800/80 border border-amber-200 dark:border-slate-700 relative group animate-in fade-in">
              <div className="flex items-center justify-between mb-2 pb-2 border-b border-amber-200/60 dark:border-slate-700">
                <span className="text-[11px] font-bold text-amber-800 dark:text-amber-300 uppercase tracking-wider">
                  {isKh ? 'លទ្ធផល AI' : 'Generated Result'}
                </span>
                <button
                  onClick={handleCopy}
                  className="flex items-center gap-1 text-[11px] text-slate-600 dark:text-slate-300 hover:text-purple-600"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? (isKh ? 'បានចម្លង' : 'Copied') : (isKh ? 'ចម្លង' : 'Copy')}</span>
                </button>
              </div>

              <p className="text-xs text-slate-800 dark:text-slate-200 leading-relaxed font-serif whitespace-pre-line">
                {aiResult}
              </p>

              <button
                onClick={handleApplyToInvitation}
                className="mt-3 w-full py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-semibold text-xs transition-all shadow-xs"
              >
                {isKh ? 'ដាក់បញ្ចូលក្នុងធៀបការភ្លាមៗ' : 'Apply to Invitation Card'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
