import React, { createContext, useContext, useState, useEffect } from 'react';
import { WeddingInvitation, User, Language, ThemeMode } from '../types';
import { defaultInvitation, initialUser } from '../data/mockData';

interface ThemeLanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  themeMode: ThemeMode;
  setThemeMode: (mode: ThemeMode) => void;
  toggleThemeMode: () => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  invitation: WeddingInvitation;
  setInvitation: React.Dispatch<React.SetStateAction<WeddingInvitation>>;
  updateInvitation: (updates: Partial<WeddingInvitation>) => void;
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  guestNameOverride: string;
  setGuestNameOverride: (name: string) => void;
  isPreviewOpen: boolean;
  setIsPreviewOpen: (open: boolean) => void;
  isAiModalOpen: boolean;
  setIsAiModalOpen: (open: boolean) => void;
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;
  isPaymentModalOpen: boolean;
  setIsPaymentModalOpen: (open: boolean) => void;
  isInstallModalOpen: boolean;
  setIsInstallModalOpen: (open: boolean) => void;
  isPublishModalOpen: boolean;
  setIsPublishModalOpen: (open: boolean) => void;
}

const ThemeLanguageContext = createContext<ThemeLanguageContextType | undefined>(undefined);

export const ThemeLanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('kh');
  const [themeMode, setThemeMode] = useState<ThemeMode>('dark');
  const [activeTab, setActiveTab] = useState<string>('home');
  const [invitation, setInvitation] = useState<WeddingInvitation>(defaultInvitation);
  const [user, setUser] = useState<User | null>(initialUser);
  const [guestNameOverride, setGuestNameOverride] = useState<string>('');
  const [isPreviewOpen, setIsPreviewOpen] = useState<boolean>(false);
  const [isAiModalOpen, setIsAiModalOpen] = useState<boolean>(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState<boolean>(false);
  const [isInstallModalOpen, setIsInstallModalOpen] = useState<boolean>(false);
  const [isPublishModalOpen, setIsPublishModalOpen] = useState<boolean>(false);

  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const viewParam = params.get('view');
      const guestParam = params.get('guest');
      const invitationParam = params.get('invitation');

      if (guestParam) {
        setGuestNameOverride(decodeURIComponent(guestParam));
      }

      if (viewParam === 'invitation' || viewParam === 'guest' || invitationParam) {
        setActiveTab('guest_view');
      }
    } catch (e) {
      console.error('Error parsing URL query params', e);
    }
  }, []);

  useEffect(() => {
    if (themeMode === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [themeMode]);

  const toggleThemeMode = () => {
    setThemeMode((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  const updateInvitation = (updates: Partial<WeddingInvitation>) => {
    setInvitation((prev) => ({
      ...prev,
      ...updates,
    }));
  };

  return (
    <ThemeLanguageContext.Provider
      value={{
        language,
        setLanguage,
        themeMode,
        setThemeMode,
        toggleThemeMode,
        activeTab,
        setActiveTab,
        invitation,
        setInvitation,
        updateInvitation,
        user,
        setUser,
        guestNameOverride,
        setGuestNameOverride,
        isPreviewOpen,
        setIsPreviewOpen,
        isAiModalOpen,
        setIsAiModalOpen,
        isAuthModalOpen,
        setIsAuthModalOpen,
        isPaymentModalOpen,
        setIsPaymentModalOpen,
        isInstallModalOpen,
        setIsInstallModalOpen,
        isPublishModalOpen,
        setIsPublishModalOpen,
      }}
    >
      {children}
    </ThemeLanguageContext.Provider>
  );
};

export const useThemeLanguage = () => {
  const context = useContext(ThemeLanguageContext);
  if (!context) {
    throw new Error('useThemeLanguage must be used within a ThemeLanguageProvider');
  }
  return context;
};
