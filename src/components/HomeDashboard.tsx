import React from 'react';
import { useThemeLanguage } from '../context/ThemeLanguageContext';
import {
  Sparkles,
  Edit3,
  Eye,
  Globe,
  Share2,
  Crown,
  CreditCard,
  Music,
  MapPin,
  CheckCircle2,
  BarChart2,
  Download,
  Smartphone,
  Monitor,
} from 'lucide-react';

export const HomeDashboard: React.FC = () => {
  const {
    invitation,
    language,
    setActiveTab,
    setIsPreviewOpen,
    setIsPaymentModalOpen,
    setIsAiModalOpen,
    setIsInstallModalOpen,
    setIsPublishModalOpen,
  } = useThemeLanguage();

  const isKh = language === 'kh';

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      {/* Bento Grid Header / Welcome Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Main Bento Hero Card (Col 8) */}
        <div className="lg:col-span-8 p-8 sm:p-10 rounded-3xl bg-[#1A1D23] border border-[#2D3139] shadow-2xl relative overflow-hidden flex flex-col justify-between space-y-6">
          <div className="absolute top-0 right-0 w-80 h-80 bg-[#D4AF37]/5 rounded-full blur-3xl pointer-events-none" />

          <div className="space-y-4 relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#D4AF37]/10 text-[#D4AF37] border border-[#D4AF37]/30 text-xs font-semibold">
              <Crown className="w-4 h-4 text-[#D4AF37]" />
              <span>{isKh ? 'សូមស្វាគមន៍មកកាន់ ធៀប Digital' : 'Welcome to Theab Digital'}</span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-bold font-serif text-[#E0E0E0] leading-tight">
              {isKh ? 'បង្កើតធៀបការឌីជីថល ស្ទីលខ្មែរប្រណិត Bento Grid' : 'Cambodian Digital Wedding Invitations'}
            </h1>

            <p className="text-sm text-[#8E9299] leading-relaxed max-w-xl">
              {isKh
                ? 'បង្កើត និងកែសម្រួលធៀបការឌីជីថលបែបទំនើប និងប្រពៃណីខ្មែរ មានតន្ត្រីអូតូផ្លេ, QR Code ABA ចងដៃ, ផែនទី Google Maps និងការឆ្លើយតប RSVP ងាយស្រួលផ្ញើជូនភ្ញៀវតាម Telegram'
                : 'Create & share luxury Khmer digital wedding cards with background music, ABA KHQR gifts, Google Maps, and guest RSVP.'}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 relative z-10 pt-2">
            <button
              onClick={() => setActiveTab('editor')}
              className="px-6 py-3 rounded-2xl bg-gradient-to-r from-[#D4AF37] to-[#AA8B2E] text-[#0F1115] font-bold text-xs sm:text-sm hover:brightness-110 transition-all shadow-lg flex items-center gap-2"
            >
              <Edit3 className="w-4 h-4 text-[#0F1115]" />
              <span>{isKh ? 'កែសម្រួលធៀបការឥឡូវនេះ' : 'Edit Invitation Now'}</span>
            </button>

            <button
              onClick={() => setIsPreviewOpen(true)}
              className="px-5 py-3 rounded-2xl bg-[#0F1115] hover:bg-[#2D3139] text-[#E0E0E0] font-semibold text-xs sm:text-sm transition-all border border-[#2D3139] shadow-md flex items-center gap-2"
            >
              <Eye className="w-4 h-4 text-[#D4AF37]" />
              <span>{isKh ? 'មើលទិដ្ឋភាព Live Preview' : 'Live Preview'}</span>
            </button>

            <button
              onClick={() => setIsAiModalOpen(true)}
              className="px-5 py-3 rounded-2xl bg-gradient-to-r from-purple-700 to-indigo-700 text-white font-semibold text-xs sm:text-sm hover:scale-102 transition-all shadow-md flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-amber-300 animate-pulse" />
              <span>{isKh ? 'AI ជួយសរសេរ' : 'AI Speech Writer'}</span>
            </button>
          </div>
        </div>

        {/* Bento Quick Status Side-Card (Col 4) */}
        <div className="lg:col-span-4 p-6 rounded-3xl bg-[#1A1D23] border border-[#2D3139] shadow-xl flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between border-b border-[#2D3139] pb-3">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs font-bold text-[#E0E0E0] uppercase tracking-wider">
                {isKh ? 'ស្ថានភាពផ្សាយផ្ទាល់' : 'Live Status'}
              </span>
            </div>
            <span className="text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 px-2.5 py-0.5 rounded-full font-semibold">
              Synced
            </span>
          </div>

          <div className="space-y-3">
            <div className="p-3.5 rounded-2xl bg-[#0F1115] border border-[#2D3139] flex items-center justify-between">
              <span className="text-xs text-[#8E9299]">{isKh ? 'អ្នកចូលមើល (Views)' : 'Total Views'}</span>
              <span className="text-sm font-mono font-bold text-[#D4AF37]">1,428</span>
            </div>

            <div className="p-3.5 rounded-2xl bg-[#0F1115] border border-[#2D3139] flex items-center justify-between">
              <span className="text-xs text-[#8E9299]">{isKh ? 'ភ្ញៀវបញ្ជាក់ RSVP' : 'RSVP Confirmed'}</span>
              <span className="text-sm font-mono font-bold text-emerald-400">124 {isKh ? 'នាក់' : 'guests'}</span>
            </div>

            <div className="p-3.5 rounded-2xl bg-[#0F1115] border border-[#2D3139] flex items-center justify-between">
              <span className="text-xs text-[#8E9299]">{isKh ? 'ចងដៃសរុប' : 'Total Gifts'}</span>
              <span className="text-sm font-mono font-bold text-[#D4AF37]">$1,850</span>
            </div>
          </div>

          <button
            onClick={() => setActiveTab('analytics')}
            className="w-full py-2.5 rounded-xl bg-[#2D3139] hover:bg-[#3A3F47] text-[#E0E0E0] font-semibold text-xs transition-all flex items-center justify-center gap-2"
          >
            <BarChart2 className="w-4 h-4 text-[#D4AF37]" />
            <span>{isKh ? 'មើលរបាយការណ៍លម្អិត' : 'View Full Analytics'}</span>
          </button>

          {/* Quick Actions: Publish Free & Install App */}
          <div className="pt-2 border-t border-[#2D3139] space-y-2">
            <button
              onClick={() => setIsPublishModalOpen(true)}
              className="w-full py-3 px-4 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer hover:scale-102"
            >
              <Share2 className="w-4 h-4 text-white" />
              <span>{isKh ? 'Publish & ចែករំលែក Link ឥតគិតថ្លៃ' : 'Publish & Share Link Free'}</span>
            </button>

            <button
              onClick={() => setIsInstallModalOpen(true)}
              className="w-full py-2.5 px-4 rounded-2xl bg-gradient-to-r from-[#D4AF37] via-[#FCF6BA] to-[#D4AF37] hover:brightness-110 text-[#0F1115] font-extrabold text-xs transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer hover:scale-102"
            >
              <Download className="w-4 h-4 text-[#0F1115]" />
              <span>{isKh ? 'ដំឡើង App លើទូរស័ព្ទ / កុំព្យូទ័រ' : 'Install App on Phone & PC'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Bento Active Wedding Card Details */}
      <div className="p-6 sm:p-8 rounded-3xl bg-[#1A1D23] border border-[#2D3139] shadow-xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#2D3139] pb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-[#D4AF37]/15 text-[#D4AF37] border border-[#D4AF37]/30 flex items-center justify-center font-bold">
              <Crown className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#D4AF37]">
                {isKh ? 'ធៀបការសកម្មរបស់អ្នក (Active Invitation)' : 'Active Wedding Invitation'}
              </span>
              <h2 className="text-xl font-bold font-serif text-[#E0E0E0]">
                {invitation.groomName} & {invitation.brideName}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-xs font-bold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>{isKh ? 'បានបោះពុម្ព (Published)' : 'Published'}</span>
            </span>
            <button
              onClick={() => setIsPaymentModalOpen(true)}
              className="px-3 py-1 rounded-full bg-gradient-to-r from-[#D4AF37] to-[#AA8B2E] text-[#0F1115] text-xs font-bold transition-all shadow-xs"
            >
              {invitation.templateType === 'premium' ? 'Premium Active' : 'Upgrade Premium'}
            </button>
          </div>
        </div>

        {/* Bento Grid Metadata Columns */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs text-[#8E9299]">
          <div className="p-4 rounded-2xl bg-[#0F1115] border border-[#2D3139] space-y-1.5">
            <p className="text-[10px] font-bold uppercase tracking-wider text-[#D4AF37]">
              {isKh ? 'កាលបរិច្ឆេទ & វេលាម៉ោង' : 'Wedding Date & Time'}
            </p>
            <p className="font-bold text-[#E0E0E0] text-sm">{invitation.weddingDateKhmer}</p>
            <p className="text-[11px] text-[#8E9299]">{invitation.lunarDateKhmer}</p>
            <p className="font-semibold text-[#D4AF37]">{invitation.timeKhmer}</p>
          </div>

          <div className="p-4 rounded-2xl bg-[#0F1115] border border-[#2D3139] space-y-1.5">
            <p className="text-[10px] font-bold uppercase tracking-wider text-[#D4AF37]">
              {isKh ? 'ទីតាំងរៀបអាពាហ៍ពិពាហ៍' : 'Venue Address'}
            </p>
            <p className="font-bold text-[#E0E0E0] text-sm">{invitation.venueName}</p>
            <p className="text-[11px] text-[#8E9299] line-clamp-2">{invitation.venueAddress}</p>
            <a
              href={invitation.googleMapUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 text-[#D4AF37] font-bold hover:underline mt-1"
            >
              <MapPin className="w-3 h-3" />
              <span>Google Maps Link</span>
            </a>
          </div>

          <div className="p-4 rounded-2xl bg-[#0F1115] border border-[#2D3139] space-y-1.5">
            <p className="text-[10px] font-bold uppercase tracking-wider text-[#D4AF37]">
              {isKh ? 'ចងដៃ & ABA KHQR' : 'Gift QR Code'}
            </p>
            <p className="font-bold text-[#E0E0E0] text-sm">{invitation.bankInfo?.bankName}</p>
            <p className="text-[11px] font-mono text-[#8E9299]">{invitation.bankInfo?.accountNumber}</p>
            <p className="font-semibold text-[#D4AF37]">{invitation.bankInfo?.accountName}</p>
          </div>
        </div>

        {/* Quick Action Buttons */}
        <div className="flex flex-wrap items-center gap-3 pt-2">
          <button
            onClick={() => setActiveTab('editor')}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#AA8B2E] text-[#0F1115] font-bold text-xs shadow-md transition-all flex items-center gap-1.5 hover:brightness-110"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>{isKh ? 'កែសម្រួលព័ត៌មាន' : 'Edit Details'}</span>
          </button>

          <button
            onClick={() => setActiveTab('guest_view')}
            className="px-4 py-2 rounded-xl bg-[#D4AF37]/10 text-[#D4AF37] border border-[#D4AF37]/30 font-bold text-xs hover:bg-[#D4AF37]/20 transition-all flex items-center gap-1.5"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>{isKh ? 'មើលធៀបការភ្ញៀវ' : 'Guest View'}</span>
          </button>

          <button
            onClick={() => setActiveTab('domain')}
            className="px-4 py-2 rounded-xl bg-[#0F1115] border border-[#2D3139] text-[#E0E0E0] font-bold text-xs hover:bg-[#2D3139] transition-all flex items-center gap-1.5"
          >
            <Globe className="w-3.5 h-3.5" />
            <span>Domain & SEO</span>
          </button>

          <button
            onClick={() => setActiveTab('analytics')}
            className="px-4 py-2 rounded-xl bg-[#0F1115] border border-[#2D3139] text-[#E0E0E0] font-bold text-xs hover:bg-[#2D3139] transition-all flex items-center gap-1.5"
          >
            <BarChart2 className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>{isKh ? 'មើលស្ថិតិ' : 'Analytics'}</span>
          </button>
        </div>
      </div>

      {/* Feature Highlights Bento Grid */}
      <div className="space-y-6">
        <h2 className="text-xl font-bold font-serif text-[#E0E0E0]">
          {isKh ? 'មុខងារពិសេសៗរបស់ ធៀប Digital' : 'Platform Key Features'}
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-6 rounded-3xl bg-[#1A1D23] border border-[#2D3139] shadow-md space-y-3 hover:border-[#D4AF37]/50 transition-all">
            <div className="w-10 h-10 rounded-2xl bg-[#D4AF37]/15 text-[#D4AF37] flex items-center justify-center font-bold border border-[#D4AF37]/30">
              <Globe className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-sm font-serif text-[#E0E0E0]">
              {isKh ? 'ពីរភាសា (ខ្មែរ & English)' : 'Multi-Language Support'}
            </h3>
            <p className="text-xs text-[#8E9299] leading-relaxed">
              {isKh
                ? 'ផ្លាស់ប្តូរភាសាខ្មែរ និងអង់គ្លេសបានភ្លាមៗ ងាយស្រួលសម្រាប់ភ្ញៀវជាតិ និងអន្តរជាតិ'
                : 'Switch smoothly between Khmer & English for local & international guests.'}
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-[#1A1D23] border border-[#2D3139] shadow-md space-y-3 hover:border-[#D4AF37]/50 transition-all">
            <div className="w-10 h-10 rounded-2xl bg-red-500/15 text-red-400 flex items-center justify-center font-bold border border-red-500/30">
              <CreditCard className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-sm font-serif text-[#E0E0E0]">
              {isKh ? 'ចងដៃតាម ABA KHQR' : 'ABA KHQR Gift Collection'}
            </h3>
            <p className="text-xs text-[#8E9299] leading-relaxed">
              {isKh
                ? 'បង្ហាញ KHQR ធនាគារ ABA ស្វ័យប្រវត្តិ ភ្ញៀវអាចចម្លងលេខគណនី ឬស្កែនវេរប្រាក់ចងដៃបានភ្លាមៗ'
                : 'Automatic ABA Bank KHQR integration with one-click copy account number.'}
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-[#1A1D23] border border-[#2D3139] shadow-md space-y-3 hover:border-[#D4AF37]/50 transition-all">
            <div className="w-10 h-10 rounded-2xl bg-purple-500/15 text-purple-400 flex items-center justify-center font-bold border border-purple-500/30">
              <Music className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-sm font-serif text-[#E0E0E0]">
              {isKh ? 'បទភ្លេងការ & តន្ត្រីអូតូផ្លេ' : 'Auto-Play Music & Videos'}
            </h3>
            <p className="text-xs text-[#8E9299] leading-relaxed">
              {isKh
                ? 'តន្ត្រីប្រពៃណីខ្មែរពិរោះៗ លេងអូតូពេលភ្ញៀវបើកធៀប និងអាច Upload វីដេអូការបាន'
                : 'Traditional Mohori background music & custom pre-wedding video player.'}
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-[#1A1D23] border border-[#2D3139] shadow-md space-y-3 hover:border-[#D4AF37]/50 transition-all">
            <div className="w-10 h-10 rounded-2xl bg-indigo-500/15 text-indigo-400 flex items-center justify-center font-bold border border-indigo-500/30">
              <Share2 className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-sm font-serif text-[#E0E0E0]">
              {isKh ? 'បង្កើត Link ភ្ញៀវផ្ទាល់ខ្លួន' : 'Personalized Guest Links'}
            </h3>
            <p className="text-xs text-[#8E9299] leading-relaxed">
              {isKh
                ? 'វាយបញ្ចូលឈ្មោះ ឬគោរមងារភ្ញៀវ ដើម្បីបង្កើត Link ពិសេសដែលមានឈ្មោះភ្ញៀវនៅលើធៀប'
                : 'Auto-generate guest links with personalized honorific titles & names.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
