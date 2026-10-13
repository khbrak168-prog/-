import React, { useState } from 'react';
import { useThemeLanguage } from '../context/ThemeLanguageContext';
import { X, Smartphone, Tablet, Monitor } from 'lucide-react';
import { PublicWeddingWebsite } from './PublicWeddingWebsite';

export const LivePreviewModal: React.FC = () => {
  const { isPreviewOpen, setIsPreviewOpen, language } = useThemeLanguage();
  const [device, setDevice] = useState<'mobile' | 'tablet' | 'desktop'>('mobile');

  if (!isPreviewOpen) return null;

  const isKh = language === 'kh';

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-[#0F1115]/95 backdrop-blur-md animate-in fade-in">
      {/* Top Controls Toolbar */}
      <div className="flex items-center justify-between px-6 py-3 bg-[#1A1D23] border-b border-[#2D3139] text-[#E0E0E0] shrink-0">
        <div className="flex items-center gap-3">
          <span className="font-bold font-serif text-sm text-[#D4AF37]">
            {isKh ? 'មើល Live Preview ធៀបការ Bento Grid' : 'Live Invitation Preview'}
          </span>
          <span className="text-xs text-[#8E9299] border-l border-[#2D3139] pl-3">
            {device === 'mobile' && 'iPhone 15 Pro (390 x 844)'}
            {device === 'tablet' && 'iPad Air (820 x 1180)'}
            {device === 'desktop' && 'Desktop Full Width'}
          </span>
        </div>

        {/* Device Mode Switcher */}
        <div className="flex items-center gap-1 bg-[#0F1115] p-1 rounded-xl border border-[#2D3139]">
          <button
            onClick={() => setDevice('mobile')}
            className={`p-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
              device === 'mobile' ? 'bg-[#D4AF37] text-[#0F1115] font-bold shadow-2xs' : 'text-[#8E9299] hover:text-[#E0E0E0]'
            }`}
          >
            <Smartphone className="w-4 h-4" />
            <span className="hidden sm:inline">Mobile</span>
          </button>

          <button
            onClick={() => setDevice('tablet')}
            className={`p-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
              device === 'tablet' ? 'bg-[#D4AF37] text-[#0F1115] font-bold shadow-2xs' : 'text-[#8E9299] hover:text-[#E0E0E0]'
            }`}
          >
            <Tablet className="w-4 h-4" />
            <span className="hidden sm:inline">Tablet</span>
          </button>

          <button
            onClick={() => setDevice('desktop')}
            className={`p-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
              device === 'desktop' ? 'bg-[#D4AF37] text-[#0F1115] font-bold shadow-2xs' : 'text-[#8E9299] hover:text-[#E0E0E0]'
            }`}
          >
            <Monitor className="w-4 h-4" />
            <span className="hidden sm:inline">Desktop</span>
          </button>
        </div>

        <button
          onClick={() => setIsPreviewOpen(false)}
          className="p-1.5 rounded-full bg-[#2D3139] hover:bg-[#3A3F47] text-[#E0E0E0] transition-all"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Frame Wrapper */}
      <div className="flex-1 overflow-auto p-4 sm:p-8 flex items-center justify-center">
        <div
          className={`transition-all duration-300 bg-[#1A1D23] rounded-3xl overflow-hidden shadow-2xl border-4 border-[#2D3139] relative ${
            device === 'mobile' ? 'w-[390px] h-[780px]' : ''
          } ${device === 'tablet' ? 'w-[768px] h-[950px]' : ''} ${
            device === 'desktop' ? 'w-full max-w-6xl h-[90vh]' : ''
          }`}
        >
          <div className="h-full overflow-y-auto no-scrollbar">
            <PublicWeddingWebsite isEmbeddedPreview={true} />
          </div>
        </div>
      </div>
    </div>
  );
};
