import React, { useState } from 'react';
import { useThemeLanguage } from '../context/ThemeLanguageContext';
import { sampleTemplates } from '../data/mockData';
import { Check, Sparkles, CreditCard, ExternalLink } from 'lucide-react';

export const TemplateStore: React.FC = () => {
  const { language, setIsPaymentModalOpen, updateInvitation, setIsPreviewOpen } =
    useThemeLanguage();
  const [filter, setFilter] = useState<'all' | 'free' | 'premium'>('all');

  const isKh = language === 'kh';

  const filtered = sampleTemplates.filter((t) => {
    if (filter === 'free') return t.type === 'free';
    if (filter === 'premium') return t.type === 'premium';
    return true;
  });

  const handleSelectTemplate = (tpl: (typeof sampleTemplates)[0]) => {
    updateInvitation({
      templateId: tpl.id,
      templateType: tpl.type,
    });
    if (tpl.type === 'premium') {
      setIsPaymentModalOpen(true);
    } else {
      setIsPreviewOpen(true);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Title Header */}
      <div className="text-center max-w-2xl mx-auto mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 text-xs font-bold mb-2">
          <Sparkles className="w-3.5 h-3.5 text-amber-600" />
          <span>{isKh ? 'បណ្តុំគំរូធៀបការប្រណិត' : 'Wedding Invitation Templates'}</span>
        </div>
        <h1 className="text-3xl font-bold font-serif text-slate-900 dark:text-white">
          {isKh ? 'ជ្រើសរើសគំរូធៀបការ (Free & Premium)' : 'Choose Your Template Style'}
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
          {isKh
            ? 'មានទាំងគំរូឥតគិតថ្លៃ និងគំរូប្រណិតហាយសូ តន្ត្រីអូតូផ្លេ និង ABA KHQR ស្វ័យប្រវត្តិ'
            : 'Select from elegant free styles or high-luxury premium themes'}
        </p>

        {/* Filter Switches */}
        <div className="flex items-center justify-center gap-2 mt-6">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
              filter === 'all'
                ? 'bg-amber-500 text-white shadow-xs'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
            }`}
          >
            {isKh ? 'ទាំងអស់' : 'All Templates'}
          </button>
          <button
            onClick={() => setFilter('free')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
              filter === 'free'
                ? 'bg-amber-500 text-white shadow-xs'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
            }`}
          >
            {isKh ? 'ឥតគិតថ្លៃ (Free)' : 'Free Templates'}
          </button>
          <button
            onClick={() => setFilter('premium')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
              filter === 'premium'
                ? 'bg-amber-500 text-white shadow-xs'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
            }`}
          >
            {isKh ? 'ប្រណិត (Premium)' : 'Premium Templates'}
          </button>
        </div>
      </div>

      {/* Grid Display */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {filtered.map((tpl) => (
          <div
            key={tpl.id}
            className="bg-white dark:bg-slate-900 rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-lg hover:shadow-xl transition-all flex flex-col group"
          >
            <div className="relative aspect-4/3 overflow-hidden bg-slate-100">
              <img
                src={tpl.thumbnail}
                alt={tpl.nameKhmer}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                referrerPolicy="no-referrer"
              />
              <div className="absolute top-3 right-3">
                {tpl.type === 'premium' ? (
                  <span className="px-3 py-1 rounded-full bg-amber-500 text-white text-[11px] font-bold shadow-md">
                    ${tpl.priceUsd} (Premium)
                  </span>
                ) : (
                  <span className="px-3 py-1 rounded-full bg-emerald-500 text-white text-[11px] font-bold shadow-md">
                    FREE
                  </span>
                )}
              </div>
            </div>

            <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
              <div>
                <h3 className="font-bold text-base font-serif text-slate-900 dark:text-white">
                  {isKh ? tpl.nameKhmer : tpl.nameEnglish}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                  {tpl.description}
                </p>

                <div className="mt-3 space-y-1">
                  {tpl.features.map((f, i) => (
                    <div key={i} className="flex items-center gap-1.5 text-[11px] text-slate-600 dark:text-slate-300">
                      <Check className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                      <span>{f}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => handleSelectTemplate(tpl)}
                  className="flex-1 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-1.5"
                >
                  {tpl.type === 'premium' ? (
                    <>
                      <CreditCard className="w-3.5 h-3.5" />
                      <span>{isKh ? 'ទិញប្រើប្រាស់' : 'Buy Template'}</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>{isKh ? 'ជ្រើសរើសប្រើ' : 'Use Template'}</span>
                    </>
                  )}
                </button>

                <button
                  onClick={() => setIsPreviewOpen(true)}
                  className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 transition-all"
                  title="Preview"
                >
                  <ExternalLink className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
