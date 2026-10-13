import React, { useState } from 'react';
import { useThemeLanguage } from '../context/ThemeLanguageContext';
import { Globe, Search, Share2, Check } from 'lucide-react';

export const DomainSeoModal: React.FC = () => {
  const { invitation, updateInvitation, language } = useThemeLanguage();
  const [copied, setCopied] = useState(false);
  const isKh = language === 'kh';

  const fullUrl = `https://${invitation.domainCustom || 'theab.digital/' + invitation.slug}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(fullUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-lg space-y-6">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-amber-100 dark:bg-amber-950 text-amber-600 dark:text-amber-400">
            <Globe className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold font-serif text-slate-900 dark:text-white">
              {isKh ? 'កំណត់ Domain ផ្ទាល់ខ្លួន & SEO' : 'Custom Domain & SEO Config'}
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {isKh
                ? 'កំណត់អាសយដ្ឋាន Website និងការង្ហាញលើ Facebook / Telegram ឱ្យមានភាពទាក់ទាញ'
                : 'Configure custom subdomains & social share cards'}
            </p>
          </div>
        </div>

        {/* Custom Domain Input */}
        <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-800">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              {isKh ? 'អាសយដ្ឋាន Domain ផ្ទាល់ខ្លួន (Custom Domain / Subdomain)' : 'Custom Subdomain'}
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={invitation.domainCustom || ''}
                onChange={(e) => updateInvitation({ domainCustom: e.target.value })}
                className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 dark:text-white font-mono text-xs"
                placeholder="monkongprak-eiseavhan.theab.digital"
              />
              <button
                onClick={handleCopy}
                className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-semibold text-xs shrink-0 flex items-center gap-1.5"
              >
                {copied ? <Check className="w-4 h-4" /> : <Share2 className="w-4 h-4" />}
                <span>{copied ? (isKh ? 'បានចម្លង' : 'Copied') : (isKh ? 'ចម្លង' : 'Copy')}</span>
              </button>
            </div>
          </div>

          {/* SEO Metadata */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                {isKh ? 'SEO Title (ចំណងជើងចែករំលែក)' : 'SEO Title'}
              </label>
              <input
                type="text"
                value={invitation.seoTitle || ''}
                onChange={(e) => updateInvitation({ seoTitle: e.target.value })}
                className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                {isKh ? 'SEO Description (ការពិពណ៌នា)' : 'SEO Description'}
              </label>
              <input
                type="text"
                value={invitation.seoDescription || ''}
                onChange={(e) => updateInvitation({ seoDescription: e.target.value })}
                className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 dark:text-white"
              />
            </div>
          </div>

          {/* Social Share Card Preview */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-3">
            <p className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <Search className="w-4 h-4 text-amber-500" />
              <span>{isKh ? 'ទិដ្ឋភាពបង្ហាញលើ Facebook / Telegram Share Card' : 'Social Share Card Preview'}</span>
            </p>

            <div className="bg-white dark:bg-slate-900 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 max-w-md shadow-md">
              <div className="h-40 bg-slate-200 overflow-hidden">
                <img
                  src={invitation.coverImage}
                  alt="Share Card Preview"
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="p-3">
                <p className="text-[10px] text-slate-400 font-mono uppercase">theab.digital</p>
                <p className="text-xs font-bold font-serif text-slate-900 dark:text-white mt-0.5">
                  {invitation.seoTitle || invitation.title}
                </p>
                <p className="text-[11px] text-slate-500 line-clamp-2 mt-1">
                  {invitation.seoDescription || invitation.formalInvitationText}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
