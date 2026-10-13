import React, { useState, useEffect } from 'react';
import { useThemeLanguage } from '../context/ThemeLanguageContext';
import { X, Smartphone, Monitor, Download, Share, PlusSquare, ArrowRight, CheckCircle2, QrCode } from 'lucide-react';

interface InstallAppModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const InstallAppModal: React.FC<InstallAppModalProps> = ({ isOpen, onClose }) => {
  const { language } = useThemeLanguage();
  const isKh = language === 'kh';
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [activeDeviceTab, setActiveDeviceTab] = useState<'mobile' | 'desktop'>('mobile');

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setIsInstalled(true);
      }
      setDeferredPrompt(null);
    } else {
      alert(
        isKh
          ? 'សូមអនុវត្តតាមការណែនាំខាងក្រោមដើម្បីដំឡើង App ទៅលើអេក្រង់ទូរស័ព្ទ ឬ កុំព្យូទ័ររបស់អ្នក!'
          : 'Please follow the instructions below to add this app to your Home Screen / Desktop!'
      );
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xs p-4 animate-in fade-in">
      <div className="bg-[#1A1D23] border border-[#D4AF37]/50 rounded-3xl max-w-lg w-full p-6 shadow-2xl relative overflow-hidden text-white max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center mb-6">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#D4AF37] to-[#AA8B2E] text-[#0F1115] flex items-center justify-center mx-auto mb-3 shadow-lg shadow-amber-900/30">
            <Download className="w-7 h-7" />
          </div>
          <h2 className="text-xl font-bold font-serif text-[#FCF6BA]">
            {isKh ? 'ដំឡេីង App លើទូរស័ព្ទ និង កុំព្យូទ័រ' : 'Install App on Phone & PC'}
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            {isKh
              ? 'រក្សាទុក E-THEAP លើអេក្រង់ដើម (Home Screen) ដើម្បីបើកប្រើប្រាស់បានលឿនដូច App ធម្មតា'
              : 'Save E-THEAP to your Home Screen or Desktop for fast 1-click access'}
          </p>
        </div>

        {/* Direct Install Button if supported */}
        {deferredPrompt && (
          <div className="mb-6 p-4 rounded-2xl bg-gradient-to-r from-[#D4AF37] to-[#AA8B2E] text-[#0F1115] text-center shadow-xl">
            <p className="text-xs font-black uppercase tracking-wider mb-2">
              {isKh ? '⚡ អាចដំឡើងភ្លាមៗបាន' : '⚡ Direct Install Available'}
            </p>
            <button
              onClick={handleInstallClick}
              className="w-full py-3 px-4 rounded-xl bg-[#0F1115] hover:bg-black text-[#FCF6BA] font-extrabold text-sm transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md hover:scale-102"
            >
              <Download className="w-4 h-4 text-[#D4AF37]" />
              <span>{isKh ? 'ចុចទីនេះដើម្បីដំឡើង App ឥឡូវនេះ' : 'Click Here to Install App Now'}</span>
            </button>
          </div>
        )}

        {isInstalled && (
          <div className="mb-6 p-3.5 rounded-2xl bg-emerald-950/60 border border-emerald-500/60 text-emerald-300 text-xs font-semibold flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            <span>
              {isKh
                ? 'កម្មវិធីបានដំឡើងរួចរាល់នៅលើទូរស័ព្ទ/កុំព្យូទ័ររបស់អ្នក!'
                : 'App is already installed on your device!'}
            </span>
          </div>
        )}

        {/* Device Switcher Tabs */}
        <div className="grid grid-cols-2 gap-2 p-1 bg-black/40 rounded-2xl border border-slate-800 mb-5">
          <button
            onClick={() => setActiveDeviceTab('mobile')}
            className={`py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
              activeDeviceTab === 'mobile'
                ? 'bg-[#D4AF37] text-[#0F1115] shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Smartphone className="w-4 h-4" />
            <span>{isKh ? 'ទូរស័ព្ទដៃ (Mobile)' : 'Mobile Phone'}</span>
          </button>

          <button
            onClick={() => setActiveDeviceTab('desktop')}
            className={`py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
              activeDeviceTab === 'desktop'
                ? 'bg-[#D4AF37] text-[#0F1115] shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Monitor className="w-4 h-4" />
            <span>{isKh ? 'កុំព្យូទ័រ (Desktop)' : 'Computer (PC/Mac)'}</span>
          </button>
        </div>

        {/* Mobile Instructions */}
        {activeDeviceTab === 'mobile' && (
          <div className="space-y-4 text-xs">
            {/* iOS Safari */}
            <div className="p-4 rounded-2xl bg-slate-900/90 border border-amber-500/30 space-y-2">
              <div className="flex items-center justify-between text-amber-300 font-bold">
                <span className="flex items-center gap-1.5">
                  <Smartphone className="w-4 h-4" />
                  <span>iPhone / iPad (Safari Browser)</span>
                </span>
                <span className="text-[10px] bg-amber-500/20 px-2 py-0.5 rounded-full">iOS</span>
              </div>
              <ol className="list-decimal list-inside space-y-1.5 text-slate-300 leading-relaxed">
                <li>
                  {isKh ? (
                    <>
                      ចុចប៊ូតុង <Share className="w-3.5 h-3.5 inline text-amber-400 mx-1" /> <strong>Share</strong> នៅខាងក្រោមអេក្រង់ Safari
                    </>
                  ) : (
                    <>
                      Tap the <Share className="w-3.5 h-3.5 inline text-amber-400 mx-1" /> <strong>Share</strong> button at the bottom of Safari
                    </>
                  )}
                </li>
                <li>
                  {isKh ? (
                    <>
                      អូសចុះក្រោម រួចជ្រើសរើស <PlusSquare className="w-3.5 h-3.5 inline text-amber-400 mx-1" /> <strong>Add to Home Screen</strong> (បន្ថែមទៅអេក្រង់ដើម)
                    </>
                  ) : (
                    <>
                      Scroll down and tap <PlusSquare className="w-3.5 h-3.5 inline text-amber-400 mx-1" /> <strong>Add to Home Screen</strong>
                    </>
                  )}
                </li>
                <li>
                  {isKh ? (
                    <>ចុច <strong>Add</strong> នៅជ្រុងខាងស្តាំលើ ជាការស្រេច!</>
                  ) : (
                    <>Tap <strong>Add</strong> in the top right corner. Done!</>
                  )}
                </li>
              </ol>
            </div>

            {/* Android Chrome */}
            <div className="p-4 rounded-2xl bg-slate-900/90 border border-emerald-500/30 space-y-2">
              <div className="flex items-center justify-between text-emerald-300 font-bold">
                <span className="flex items-center gap-1.5">
                  <Smartphone className="w-4 h-4" />
                  <span>Android (Chrome Browser)</span>
                </span>
                <span className="text-[10px] bg-emerald-500/20 px-2 py-0.5 rounded-full">Android</span>
              </div>
              <ol className="list-decimal list-inside space-y-1.5 text-slate-300 leading-relaxed">
                <li>
                  {isKh ? (
                    <>ចុចសញ្ញាចុចបី <strong>(⋮)</strong> នៅជ្រុងខាងលើនៃ Chrome</>
                  ) : (
                    <>Tap the three dots menu <strong>(⋮)</strong> at top right of Chrome</>
                  )}
                </li>
                <li>
                  {isKh ? (
                    <>ជ្រើសរើស <strong>"Add to Home screen"</strong> ឬ <strong>"Install app"</strong></>
                  ) : (
                    <>Select <strong>"Add to Home screen"</strong> or <strong>"Install app"</strong></>
                  )}
                </li>
                <li>
                  {isKh ? (
                    <>ចុច <strong>Install</strong> ដើម្បីបន្ថែមរូបតំណាង App លើអេក្រង់ទូរស័ព្ទ</>
                  ) : (
                    <>Confirm by clicking <strong>Install</strong></>
                  )}
                </li>
              </ol>
            </div>
          </div>
        )}

        {/* Desktop Instructions */}
        {activeDeviceTab === 'desktop' && (
          <div className="space-y-4 text-xs">
            <div className="p-4 rounded-2xl bg-slate-900/90 border border-amber-500/30 space-y-2">
              <div className="flex items-center justify-between text-amber-300 font-bold">
                <span className="flex items-center gap-1.5">
                  <Monitor className="w-4 h-4" />
                  <span>Chrome / Edge / Brave (Windows & Mac)</span>
                </span>
                <span className="text-[10px] bg-amber-500/20 px-2 py-0.5 rounded-full">PC / Mac</span>
              </div>
              <ol className="list-decimal list-inside space-y-1.5 text-slate-300 leading-relaxed">
                <li>
                  {isKh ? (
                    <>មើលនៅខាងស្តាំនៃ Address Bar (កន្លែងវាយ URL) នឹងឃើញរូបតំណាង <Download className="w-3.5 h-3.5 inline text-amber-400 mx-1" /> <strong>Install App</strong></>
                  ) : (
                    <>Look at the right side of the URL Address Bar for the <Download className="w-3.5 h-3.5 inline text-amber-400 mx-1" /> <strong>Install App</strong> icon</>
                  )}
                </li>
                <li>
                  {isKh ? (
                    <>ចុចលើរូបតំណាងនោះ រួចចុច <strong>Install</strong></>
                  ) : (
                    <>Click the icon and select <strong>Install</strong></>
                  )}
                </li>
                <li>
                  {isKh ? (
                    <>កម្មវិធីនឹងបង្ហាញនៅលើ Desktop និង Taskbar កុំព្យូទ័ររបស់អ្នកភ្លាមៗ!</>
                  ) : (
                    <>The app will now appear directly on your Desktop and Taskbar!</>
                  )}
                </li>
              </ol>
            </div>
          </div>
        )}

        <div className="mt-6 pt-4 border-t border-slate-800 text-center">
          <button
            onClick={onClose}
            className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs transition-colors cursor-pointer"
          >
            {isKh ? 'យល់ព្រម (បិទ)' : 'Close'}
          </button>
        </div>
      </div>
    </div>
  );
};
