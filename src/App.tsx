import React from 'react';
import { ThemeLanguageProvider, useThemeLanguage } from './context/ThemeLanguageContext';
import { Header } from './components/Header';
import { HomeDashboard } from './components/HomeDashboard';
import { InvitationEditor } from './components/InvitationEditor';
import { PublicWeddingWebsite } from './components/PublicWeddingWebsite';
import { TemplateStore } from './components/TemplateStore';
import { DomainSeoModal } from './components/DomainSeoModal';
import { AnalyticsView } from './components/AnalyticsView';
import { AdminDashboard } from './components/AdminDashboard';
import { AuthModal } from './components/AuthModal';
import { AiWeddingAssistantModal } from './components/AiWeddingAssistantModal';
import { PaymentModal } from './components/PaymentModal';
import { LivePreviewModal } from './components/LivePreviewModal';
import { InstallAppModal } from './components/InstallAppModal';
import { PublishModal } from './components/PublishModal';

const AppContent: React.FC = () => {
  const { activeTab, setActiveTab, isInstallModalOpen, setIsInstallModalOpen, language } = useThemeLanguage();
  const isKh = language === 'kh';
  const isGuestView = activeTab === 'guest_view';

  return (
    <div className="min-h-screen bg-[#0F1115] text-[#E0E0E0] selection:bg-[#D4AF37]/30 selection:text-amber-200 flex flex-col font-sans transition-colors duration-200">
      {!isGuestView && <Header />}

      <main className="flex-1">
        {activeTab === 'home' && <HomeDashboard />}
        {activeTab === 'editor' && <InvitationEditor />}
        {activeTab === 'guest_view' && <PublicWeddingWebsite />}
        {activeTab === 'templates' && <TemplateStore />}
        {activeTab === 'domain' && <DomainSeoModal />}
        {activeTab === 'analytics' && <AnalyticsView />}
        {activeTab === 'admin' && <AdminDashboard />}
      </main>

      {/* Discreet host control button when in guest view */}
      {isGuestView && (
        <div className="fixed top-3 left-3 z-50">
          <button
            onClick={() => setActiveTab('home')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/70 hover:bg-black/95 text-amber-300 border border-amber-500/40 text-[11px] font-bold shadow-lg backdrop-blur-xs transition-all cursor-pointer opacity-30 hover:opacity-100 hover:scale-105"
            title="ត្រឡប់ទៅផ្ទាំង Dashboard / Editor"
          >
            <span>← {isKh ? 'ត្រឡប់ទៅ Admin' : 'Back to Admin'}</span>
          </button>
        </div>
      )}

      {/* Global Modals */}
      <AuthModal />
      <AiWeddingAssistantModal />
      <PaymentModal />
      <LivePreviewModal />
      <InstallAppModal isOpen={isInstallModalOpen} onClose={() => setIsInstallModalOpen(false)} />
      <PublishModal />
    </div>
  );
};

export default function App() {
  return (
    <ThemeLanguageProvider>
      <AppContent />
    </ThemeLanguageProvider>
  );
}
