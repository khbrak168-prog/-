import React, { useState } from 'react';
import { useThemeLanguage } from '../context/ThemeLanguageContext';
import { X, Globe, Share2, Copy, Check, Send, QrCode, ExternalLink, Sparkles, Heart, ShieldCheck, Download, UserPlus, Eye } from 'lucide-react';

export const PublishModal: React.FC = () => {
  const { isPublishModalOpen, setIsPublishModalOpen, language, invitation } = useThemeLanguage();
  const isKh = language === 'kh';

  const [copiedGeneral, setCopiedGeneral] = useState(false);
  const [copiedPersonal, setCopiedPersonal] = useState(false);
  const [customGuestName, setCustomGuestName] = useState('');

  const originUrl = window.location.origin;
  const generalGuestUrl = `${originUrl}?view=invitation`;
  const personalizedGuestUrl = customGuestName.trim()
    ? `${originUrl}?view=invitation&guest=${encodeURIComponent(customGuestName.trim())}`
    : generalGuestUrl;

  if (!isPublishModalOpen) return null;

  const handleCopyGeneral = () => {
    navigator.clipboard.writeText(generalGuestUrl);
    setCopiedGeneral(true);
    setTimeout(() => setCopiedGeneral(false), 2000);
  };

  const handleCopyPersonal = () => {
    navigator.clipboard.writeText(personalizedGuestUrl);
    setCopiedPersonal(true);
    setTimeout(() => setCopiedPersonal(false), 2000);
  };

  const groomKh = invitation?.groomName || 'ម៉ុន គង់ប្រាក់';
  const brideKh = invitation?.brideName || 'អុី សៀវហ័ន';

  const handleTelegramShare = () => {
    const text = isKh
      ? `សូមអញ្ជើញមកចូលរួមពិធីអាពាហ៍ពិពាហ៍រវាង ${groomKh} & ${brideKh}\nសូមចុច Link ខាងក្រោមដើម្បីបើកមើលធៀបការ ៖`
      : `You are cordially invited to the wedding of ${groomKh} & ${brideKh}\nClick link to open invitation:`;
    window.open(`https://t.me/share/url?url=${encodeURIComponent(personalizedGuestUrl)}&text=${encodeURIComponent(text)}`, '_blank');
  };

  const handleFacebookShare = () => {
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(personalizedGuestUrl)}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xs p-4 animate-in fade-in">
      <div className="bg-[#1A1D23] border border-[#D4AF37]/60 rounded-3xl max-w-xl w-full p-6 shadow-2xl relative overflow-hidden text-white max-h-[92vh] overflow-y-auto">
        <button
          onClick={() => setIsPublishModalOpen(false)}
          className="absolute top-4 right-4 p-2 rounded-full bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer z-10"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Badge */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 text-xs font-bold mb-3">
            <ShieldCheck className="w-4 h-4" />
            <span>{isKh ? 'Publish ដោយឥតគិតថ្លៃ ១០០%' : '100% Free Publish & Hosting'}</span>
          </div>
          <h2 className="text-2xl font-bold font-serif text-[#FCF6BA]">
            {isKh ? 'Link សម្រាប់ផ្ញើទៅកាន់ភ្ញៀវ' : 'Guest Invitation Share Links'}
          </h2>
          <p className="text-xs text-slate-300 mt-1 max-w-md mx-auto">
            {isKh
              ? 'ពេលភ្ញៀវចុចលើ Link នេះ ពួកគាត់នឹងឃើញតែផ្ទាំងធៀបការដ៏ស្រស់ស្អាត (មិនឃើញកន្លែងកែ Admin ឡើយ)'
              : 'Guests who open this link will ONLY see the wedding invitation card view (without admin editor controls)'}
          </p>
        </div>

        {/* 1. General Guest Link Box */}
        <div className="p-4 rounded-2xl bg-black/60 border border-[#D4AF37]/40 space-y-2.5 mb-5 shadow-inner">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-[#D4AF37] uppercase tracking-wider flex items-center gap-1.5">
              <Globe className="w-4 h-4" />
              <span>{isKh ? '១. Link ទូទៅសម្រាប់ភ្ញៀវទាំងអស់ (General Link) :' : '1. General Link for All Guests:'}</span>
            </label>
            <a
              href={generalGuestUrl}
              target="_blank"
              rel="noreferrer"
              className="text-[11px] text-amber-400 hover:underline flex items-center gap-1 font-semibold"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>{isKh ? 'សាកល្បងបើកមើល' : 'Preview'}</span>
            </a>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="text"
              readOnly
              value={generalGuestUrl}
              className="w-full px-3.5 py-2.5 text-xs font-mono rounded-xl bg-slate-900 border border-slate-700 text-slate-200 outline-hidden select-all"
            />
            <button
              onClick={handleCopyGeneral}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#AA8B2E] text-[#0F1115] font-extrabold text-xs shrink-0 flex items-center gap-1.5 hover:brightness-110 transition-all cursor-pointer shadow-md"
            >
              {copiedGeneral ? (
                <>
                  <Check className="w-4 h-4 text-[#0F1115]" />
                  <span>{isKh ? 'បានចម្លង!' : 'Copied!'}</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 text-[#0F1115]" />
                  <span>{isKh ? 'ចម្លង Link' : 'Copy'}</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* 2. Personalized Link Box */}
        <div className="p-4 rounded-2xl bg-gradient-to-br from-amber-950/40 via-black/60 to-slate-900/80 border border-amber-500/40 space-y-3 mb-5">
          <label className="text-xs font-bold text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
            <UserPlus className="w-4 h-4 text-[#D4AF37]" />
            <span>{isKh ? '២. បង្កើត Link ដាក់ឈ្មោះភ្ញៀវម្នាក់ៗ (Personalized Link) :' : '2. Create Personalized Guest Link:'}</span>
          </label>

          <div className="space-y-1.5">
            <p className="text-[11px] text-slate-300">
              {isKh
                ? 'វាយឈ្មោះភ្ញៀវខាងក្រោម ដើម្បីឱ្យពេលភ្ញៀវបើក Link ឃើញឈ្មោះរបស់គាត់ផ្ទាល់ ៖'
                : 'Enter guest name below to show personalized greeting on their card:'}
            </p>
            <input
              type="text"
              placeholder={isKh ? 'ឧទាហរណ៍៖ ឯកឧត្តម សុខ សាន ឬ លោកពូ វុទ្ធី ...' : 'e.g. Mr. John & Family'}
              value={customGuestName}
              onChange={(e) => setCustomGuestName(e.target.value)}
              className="w-full px-3.5 py-2 text-xs rounded-xl bg-slate-900 border border-amber-500/30 text-[#FCF6BA] placeholder-slate-500 focus:outline-hidden focus:border-[#D4AF37]"
            />
          </div>

          {customGuestName.trim() && (
            <div className="pt-2 border-t border-slate-800 space-y-2">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  readOnly
                  value={personalizedGuestUrl}
                  className="w-full px-3 py-2 text-xs font-mono rounded-xl bg-slate-900 border border-slate-700 text-amber-200 outline-hidden select-all"
                />
                <button
                  onClick={handleCopyPersonal}
                  className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs shrink-0 flex items-center gap-1.5 transition-all cursor-pointer shadow-md"
                >
                  {copiedPersonal ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span>{isKh ? 'បានចម្លង!' : 'Copied!'}</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      <span>{isKh ? 'ចម្លង' : 'Copy'}</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Share Card Preview (Facebook / Telegram) */}
        <div className="p-4 rounded-2xl bg-[#111317] border border-amber-500/30 space-y-2.5 mb-5">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>{isKh ? 'ទិដ្ឋភាពបង្ហាញលើ Facebook / Telegram (Share Card Preview) :' : 'Facebook / Telegram Share Card Preview:'}</span>
            </span>
            <span className="text-[10px] bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded-full font-mono">
              theab.digital
            </span>
          </div>

          <div className="rounded-xl overflow-hidden border border-slate-700/80 bg-slate-900/90 shadow-lg">
            <div className="relative h-36 sm:h-44 w-full bg-slate-800 overflow-hidden">
              <img
                src={invitation.coverPhotoVertical || "https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=1200&auto=format&fit=crop&q=80"}
                alt="Wedding Preview"
                className="w-full h-full object-cover object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex items-end p-3">
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-[#D4AF37] text-slate-950 shadow-xs">
                  theab.digital
                </span>
              </div>
            </div>
            <div className="p-3.5 space-y-1 bg-[#181B20]">
              <p className="text-[11px] text-amber-400/90 font-mono uppercase tracking-wider">THEAB.DIGITAL</p>
              <h4 className="text-sm sm:text-base font-bold font-serif text-[#FCF6BA] leading-snug">
                {isKh
                  ? `ធៀបការឌីជីថល ${groomKh} & ${brideKh}`
                  : `Wedding Invitation ${groomKh} & ${brideKh}`}
              </h4>
              <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed font-light">
                {isKh
                  ? `សូមគោរពអញ្ជើញចូលរួមជាអធិបតី និងជាភ្ញៀវកិត្តិយស ក្នុងពិធីអាពាហ៍ពិពាហ៍កូនប្រុសស្រី ${groomKh} & ${brideKh}`
                  : `You are cordially invited to celebrate the wedding of ${groomKh} & ${brideKh}`}
              </p>
            </div>
          </div>
        </div>

        {/* Quick Social Share */}
        <div className="space-y-2 mb-6">
          <p className="text-xs font-bold text-slate-300">
            {isKh ? 'ផ្ញើទៅកាន់ Telegram ឬ Facebook ភ្លាមៗ ៖' : 'Instant Social Share:'}
          </p>

          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={handleTelegramShare}
              className="py-3 px-4 rounded-xl bg-[#229ED9] hover:bg-[#1C82B3] text-white font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md hover:scale-102"
            >
              <Send className="w-4 h-4" />
              <span>{isKh ? 'ផ្ញើតាម Telegram' : 'Share on Telegram'}</span>
            </button>

            <button
              onClick={handleFacebookShare}
              className="py-3 px-4 rounded-xl bg-[#1877F2] hover:bg-[#0E52A7] text-white font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md hover:scale-102"
            >
              <Share2 className="w-4 h-4" />
              <span>{isKh ? 'ចែករំលែកលើ FB' : 'Share on Facebook'}</span>
            </button>
          </div>
        </div>

        {/* QR Code Section */}
        <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 text-center space-y-3 mb-6">
          <p className="text-xs font-bold text-[#FCF6BA] flex items-center justify-center gap-1.5">
            <QrCode className="w-4 h-4 text-[#D4AF37]" />
            <span>{isKh ? 'QR Code សម្រាប់ភ្ញៀវ Scan បើកមើលធៀបការ' : 'QR Code for Guests'}</span>
          </p>
          <div className="w-36 h-36 bg-white p-2 rounded-2xl mx-auto shadow-md">
            <img
              src={`https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(personalizedGuestUrl)}`}
              alt="Invitation QR Code"
              className="w-full h-full object-contain rounded-lg"
            />
          </div>
          <p className="text-[11px] text-slate-400">
            {isKh
              ? 'ភ្ញៀវអាចប្រើកាមេរ៉ាទូរស័ព្ទ Scan រូបនេះដើម្បីបើកមើលធៀបការភ្លាមៗ!'
              : 'Guests can scan this QR code with their mobile phone camera to open the letter!'}
          </p>
        </div>

        <div className="mt-4 pt-4 border-t border-slate-800 text-center">
          <button
            onClick={() => setIsPublishModalOpen(false)}
            className="w-full py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs transition-colors cursor-pointer"
          >
            {isKh ? 'យល់ព្រម (បិទ)' : 'Done'}
          </button>
        </div>
      </div>
    </div>
  );
};
