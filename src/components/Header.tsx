import React from 'react';
import { useThemeLanguage } from '../context/ThemeLanguageContext';
import {
  Crown,
  Globe,
  Sun,
  Moon,
  Sparkles,
  User as UserIcon,
  Eye,
  Edit3,
  CreditCard,
  BarChart2,
  Settings,
  Layout,
  ExternalLink,
  Download,
  Share2,
} from 'lucide-react';

export const Header: React.FC = () => {
  const {
    language,
    setLanguage,
    themeMode,
    toggleThemeMode,
    activeTab,
    setActiveTab,
    user,
    setIsAuthModalOpen,
    setIsPaymentModalOpen,
    setIsAiModalOpen,
    setIsPreviewOpen,
    setIsInstallModalOpen,
    setIsPublishModalOpen,
  } = useThemeLanguage();

  const isKh = language === 'kh';

  return (
    <header className="sticky top-0 z-40 bg-[#1A1D23]/95 backdrop-blur-md border-b border-[#2D3139] transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <div
            onClick={() => setActiveTab('home')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#D4AF37] to-[#AA8B2E] flex items-center justify-center text-[#0F1115] shadow-lg shadow-amber-900/20 group-hover:scale-105 transition-transform">
              <Crown className="w-5 h-5 text-[#0F1115]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-lg tracking-tight text-[#E0E0E0] font-serif">
                  Theab Digital
                </span>
                <span className="text-[10px] bg-[#D4AF37]/15 text-[#D4AF37] font-semibold px-2 py-0.5 rounded-full border border-[#D4AF37]/30">
                  ធៀប Digital
                </span>
              </div>
              <p className="text-[10px] text-[#8E9299]">
                {isKh ? 'វេទិកាធៀបការឌីជីថលហាយសូ' : 'Luxury Digital Wedding Platform'}
              </p>
            </div>
          </div>

          {/* Center Navigation Links */}
          <nav className="hidden xl:flex items-center gap-1 bg-[#0F1115] p-1.5 rounded-2xl border border-[#2D3139]">
            <button
              onClick={() => setActiveTab('home')}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all flex items-center gap-1.5 ${
                activeTab === 'home'
                  ? 'bg-[#D4AF37] text-[#0F1115] font-bold shadow-sm'
                  : 'text-[#8E9299] hover:text-[#E0E0E0]'
              }`}
            >
              <Layout className="w-3.5 h-3.5" />
              {isKh ? 'ទំព័រដើម' : 'Home'}
            </button>

            <button
              onClick={() => setActiveTab('editor')}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all flex items-center gap-1.5 ${
                activeTab === 'editor'
                  ? 'bg-[#D4AF37] text-[#0F1115] font-bold shadow-sm'
                  : 'text-[#8E9299] hover:text-[#E0E0E0]'
              }`}
            >
              <Edit3 className="w-3.5 h-3.5" />
              {isKh ? 'កែសម្រួលធៀប' : 'Editor'}
            </button>

            <button
              onClick={() => setActiveTab('guest_view')}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all flex items-center gap-1.5 ${
                activeTab === 'guest_view'
                  ? 'bg-[#D4AF37]/20 text-[#D4AF37] font-bold border border-[#D4AF37]/40 shadow-sm'
                  : 'text-[#8E9299] hover:text-[#E0E0E0]'
              }`}
            >
              <Eye className="w-3.5 h-3.5 text-[#D4AF37]" />
              {isKh ? 'មើលធៀបភ្ញៀវ' : 'Guest View'}
            </button>

            <button
              onClick={() => setActiveTab('templates')}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all flex items-center gap-1.5 ${
                activeTab === 'templates'
                  ? 'bg-[#D4AF37] text-[#0F1115] font-bold shadow-sm'
                  : 'text-[#8E9299] hover:text-[#E0E0E0]'
              }`}
            >
              {isKh ? 'គំរូធៀប' : 'Templates'}
            </button>

            <button
              onClick={() => setIsPaymentModalOpen(true)}
              className="px-3 py-1.5 rounded-xl text-xs font-medium transition-all text-[#8E9299] hover:text-[#E0E0E0] flex items-center gap-1.5"
            >
              <CreditCard className="w-3.5 h-3.5 text-red-400" />
              {isKh ? 'ទូទាត់ ABA' : 'ABA Payment'}
            </button>

            <button
              onClick={() => setActiveTab('domain')}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all flex items-center gap-1.5 ${
                activeTab === 'domain'
                  ? 'bg-[#D4AF37] text-[#0F1115] font-bold shadow-sm'
                  : 'text-[#8E9299] hover:text-[#E0E0E0]'
              }`}
            >
              <Globe className="w-3.5 h-3.5" />
              {isKh ? 'Domain & SEO' : 'Domain & SEO'}
            </button>

            <button
              onClick={() => setActiveTab('analytics')}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all flex items-center gap-1.5 ${
                activeTab === 'analytics'
                  ? 'bg-[#D4AF37] text-[#0F1115] font-bold shadow-sm'
                  : 'text-[#8E9299] hover:text-[#E0E0E0]'
              }`}
            >
              <BarChart2 className="w-3.5 h-3.5" />
              {isKh ? 'ស្ថិតិភ្ញៀវ' : 'Analytics'}
            </button>

            {user?.role === 'admin' && (
              <button
                onClick={() => setActiveTab('admin')}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all flex items-center gap-1.5 ${
                  activeTab === 'admin'
                    ? 'bg-purple-600 text-white shadow-sm'
                    : 'text-purple-400 hover:bg-purple-950/40'
                }`}
              >
                <Settings className="w-3.5 h-3.5" />
                {isKh ? 'Admin' : 'Admin'}
              </button>
            )}
          </nav>

          {/* Right Control Buttons */}
          <div className="flex items-center gap-2">
            {/* Publish Free Button */}
            <button
              onClick={() => setIsPublishModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-extrabold bg-emerald-600 hover:bg-emerald-500 text-white transition-all shadow-md cursor-pointer hover:scale-102"
              title="Publish & Share Link Free"
            >
              <Share2 className="w-3.5 h-3.5 text-white" />
              <span>{isKh ? 'Publish ឥតគិតថ្លៃ' : 'Publish Free'}</span>
            </button>

            {/* Install App Button */}
            <button
              onClick={() => setIsInstallModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-gradient-to-r from-[#D4AF37] to-[#AA8B2E] text-[#0F1115] hover:brightness-110 transition-all shadow-md cursor-pointer hover:scale-102"
              title="ដំឡើង App លើទូរស័ព្ទ/កុំព្យូទ័រ"
            >
              <Download className="w-3.5 h-3.5 text-[#0F1115]" />
              <span className="hidden sm:inline">{isKh ? 'ដំឡើង App' : 'Install App'}</span>
            </button>

            {/* Live Preview Button */}
            <button
              onClick={() => setIsPreviewOpen(true)}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-[#D4AF37] bg-[#D4AF37]/10 hover:bg-[#D4AF37]/20 border border-[#D4AF37]/30 transition-all shadow-xs"
              title="Live Preview Screen"
            >
              <ExternalLink className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>{isKh ? 'មើល Live Preview' : 'Live Preview'}</span>
            </button>

            {/* AI Assistant Button */}
            <button
              onClick={() => setIsAiModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:from-purple-700 hover:to-indigo-700 transition-all shadow-xs"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-200 animate-pulse" />
              <span className="hidden md:inline">{isKh ? 'AI ជួយសរសេរ' : 'AI Writer'}</span>
            </button>

            {/* Language Toggle Button */}
            <button
              onClick={() => setLanguage(isKh ? 'en' : 'kh')}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-bold bg-[#0F1115] border border-[#2D3139] text-[#E0E0E0] hover:bg-[#2D3139] transition-all"
              title="Switch Language"
            >
              <span>{isKh ? '🇰🇭 ខ្មែរ' : '🇬🇧 EN'}</span>
            </button>

            {/* Dark Mode Toggle */}
            <button
              onClick={toggleThemeMode}
              className="p-2 rounded-xl bg-[#0F1115] border border-[#2D3139] text-[#E0E0E0] hover:bg-[#2D3139] transition-all"
              title="Toggle Dark Mode"
            >
              {themeMode === 'light' ? (
                <Moon className="w-4 h-4 text-slate-400" />
              ) : (
                <Sun className="w-4 h-4 text-[#D4AF37]" />
              )}
            </button>

            {/* User Profile / Login */}
            {user ? (
              <div
                onClick={() => setIsAuthModalOpen(true)}
                className="flex items-center gap-2 pl-2 border-l border-[#2D3139] cursor-pointer"
              >
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-8 h-8 rounded-full border-2 border-[#D4AF37] object-cover"
                  referrerPolicy="no-referrer"
                />
                <div className="hidden lg:block text-left">
                  <p className="text-xs font-semibold text-[#E0E0E0] leading-none">
                    {user.name}
                  </p>
                  <p className="text-[10px] text-[#D4AF37] capitalize">
                    {user.plan} {user.role === 'admin' && '(Admin)'}
                  </p>
                </div>
              </div>
            ) : (
              <button
                onClick={() => setIsAuthModalOpen(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-gradient-to-r from-[#D4AF37] to-[#AA8B2E] text-[#0F1115] hover:brightness-110 transition-all"
              >
                <UserIcon className="w-3.5 h-3.5" />
                <span>{isKh ? 'ចូលគណនី' : 'Login'}</span>
              </button>
            )}
          </div>
        </div>

        {/* Mobile Secondary Menu */}
        <div className="xl:hidden flex items-center justify-between py-2 border-t border-[#2D3139] overflow-x-auto text-xs gap-2 no-scrollbar">
          <button
            onClick={() => setActiveTab('home')}
            className={`px-2.5 py-1 rounded-lg shrink-0 ${
              activeTab === 'home' ? 'bg-[#D4AF37] text-[#0F1115] font-bold' : 'text-[#8E9299]'
            }`}
          >
            {isKh ? 'ទំព័រដើម' : 'Home'}
          </button>
          <button
            onClick={() => setActiveTab('editor')}
            className={`px-2.5 py-1 rounded-lg shrink-0 ${
              activeTab === 'editor' ? 'bg-[#D4AF37] text-[#0F1115] font-bold' : 'text-[#8E9299]'
            }`}
          >
            {isKh ? 'កែសម្រួលធៀប' : 'Editor'}
          </button>
          <button
            onClick={() => setActiveTab('guest_view')}
            className={`px-2.5 py-1 rounded-lg shrink-0 ${
              activeTab === 'guest_view' ? 'bg-[#D4AF37]/20 text-[#D4AF37] font-bold' : 'text-[#8E9299]'
            }`}
          >
            {isKh ? 'មើលធៀប' : 'Guest View'}
          </button>
          <button
            onClick={() => setActiveTab('templates')}
            className={`px-2.5 py-1 rounded-lg shrink-0 ${
              activeTab === 'templates' ? 'bg-[#D4AF37] text-[#0F1115] font-bold' : 'text-[#8E9299]'
            }`}
          >
            {isKh ? 'គំរូធៀប' : 'Templates'}
          </button>
          <button
            onClick={() => setIsPaymentModalOpen(true)}
            className="px-2.5 py-1 rounded-lg shrink-0 text-red-400 font-medium"
          >
            {isKh ? 'ទូទាត់ ABA' : 'ABA Pay'}
          </button>
          <button
            onClick={() => setActiveTab('domain')}
            className={`px-2.5 py-1 rounded-lg shrink-0 ${
              activeTab === 'domain' ? 'bg-[#D4AF37] text-[#0F1115] font-bold' : 'text-[#8E9299]'
            }`}
          >
            Domain & SEO
          </button>
          <button
            onClick={() => setActiveTab('analytics')}
            className={`px-2.5 py-1 rounded-lg shrink-0 ${
              activeTab === 'analytics' ? 'bg-[#D4AF37] text-[#0F1115] font-bold' : 'text-[#8E9299]'
            }`}
          >
            {isKh ? 'ស្ថិតិ' : 'Analytics'}
          </button>
        </div>
      </div>
    </header>
  );
};
