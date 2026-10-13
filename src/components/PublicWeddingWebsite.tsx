import React, { useState, useEffect, useRef } from 'react';
import { useThemeLanguage } from '../context/ThemeLanguageContext';
import { getYouTubeEmbedUrl } from '../utils/youtube';
import confetti from 'canvas-confetti';
import {
  Volume2,
  VolumeX,
  Play,
  Pause,
  MapPin,
  Calendar,
  Clock,
  Heart,
  Gift,
  Copy,
  Check,
  Send,
  MessageCircle,
  ExternalLink,
  Sparkles,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Globe,
  ArrowRight,
  ArrowLeft,
  RotateCcw,
  SkipForward,
  Music,
  X,
  Image as ImageIcon,
  Home,
  Plus,
  Minus,
  UserCheck,
  Smile,
  HandHeart,
} from 'lucide-react';
import { defaultProgramItems, presetMusicTracks } from '../data/mockData';

interface PublicWeddingWebsiteProps {
  isEmbeddedPreview?: boolean;
}

export const PublicWeddingWebsite: React.FC<PublicWeddingWebsiteProps> = ({
  isEmbeddedPreview = false,
}) => {
  const { invitation, language, setLanguage, guestNameOverride } = useThemeLanguage();

  // Intro Modal State
  const [hasOpenedIntro, setHasOpenedIntro] = useState(false);
  const [isPlayingMusic, setIsPlayingMusic] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const contentRef = useRef<HTMLDivElement | null>(null);

  // Gallery Lightbox Modal State
  const [activePhotoIndex, setActivePhotoIndex] = useState<number | null>(null);

  // Music selector menu
  const [showMusicMenu, setShowMusicMenu] = useState(false);
  const [currentTrack, setCurrentTrack] = useState(invitation.backgroundMusic || presetMusicTracks[0]);

  // Countdown timer
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  // RSVP Form State
  const [rsvpName, setRsvpName] = useState('');
  const [rsvpAttendance, setRsvpAttendance] = useState<'attending' | 'declined' | 'maybe'>('attending');
  const [rsvpGuests, setRsvpGuests] = useState(1);
  const [rsvpPhone, setRsvpPhone] = useState('');
  const [rsvpWishes, setRsvpWishes] = useState('');
  const [rsvpSubmitted, setRsvpSubmitted] = useState(false);

  // Local Wishes State
  const [wishesList, setWishesList] = useState(invitation.rsvpList || []);

  // Copy Account Number Feedback
  const [copiedAccount, setCopiedAccount] = useState(false);

  const isKh = language === 'kh';

  const getFontClass = (fontKey?: string) => {
    switch (fontKey) {
      case 'muol': return 'font-moul';
      case 'battambang': return 'font-battambang';
      case 'siemreap': return 'font-siemreap';
      case 'kantumruuy': return 'font-kantumruy';
      case 'koulen': return 'font-koulen';
      case 'bayon': return 'font-bayon';
      case 'dangrek': return 'font-dangrek';
      case 'preahvihear': return 'font-preahvihear';
      case 'taprom': return 'font-taprom';
      case 'content': return 'font-content';
      default: return 'font-moul';
    }
  };

  const groomBrideFontClass = getFontClass(invitation.groomBrideFont || invitation.primaryFont || 'muol');
  const speechFontClass = getFontClass(invitation.speechFont || 'kantumruuy');
  const primaryFontClass = getFontClass(invitation.primaryFont || 'muol');

  // Local Guest Input on Card Overlay
  const [guestInputOnCard, setGuestInputOnCard] = useState('');

  // Effective Guest Name
  const effectiveGuestName =
    guestInputOnCard || guestNameOverride || invitation.guestHonorifics || 'សម្តេច ទ្រង់ ឯកឧត្តម លោកជំទាវ';

  // Audio Handler
  useEffect(() => {
    if (invitation.backgroundMusic?.url) {
      setCurrentTrack(invitation.backgroundMusic);
    }
  }, [invitation.backgroundMusic]);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleOpenInvitationWithMusic = () => {
    setHasOpenedIntro(true);
    if (audioRef.current) {
      audioRef.current
        .play()
        .then(() => setIsPlayingMusic(true))
        .catch(() => setIsPlayingMusic(false));
    }
    // Launch celebratory confetti
    confetti({
      particleCount: 100,
      spread: 80,
      origin: { y: 0.6 },
    });
  };

  const handleSkipAndScrollDown = () => {
    setHasOpenedIntro(true);
    setTimeout(() => {
      const targetSec =
        document.getElementById('speech-section') ||
        document.getElementById('location-section') ||
        document.getElementById('agenda-section') ||
        document.getElementById('hero-section');
      if (targetSec) {
        targetSec.scrollIntoView({ behavior: 'smooth' });
      } else {
        window.scrollTo({ top: window.innerHeight, behavior: 'smooth' });
      }
    }, 100);
  };

  const toggleMusic = () => {
    if (audioRef.current) {
      if (isPlayingMusic) {
        audioRef.current.pause();
        setIsPlayingMusic(false);
      } else {
        audioRef.current
          .play()
          .then(() => setIsPlayingMusic(true))
          .catch(() => {});
      }
    }
  };

  // Countdown Calculation
  useEffect(() => {
    const targetDate = new Date('2027-01-14T17:00:00').getTime();

    const updateTimer = () => {
      const now = new Date().getTime();
      const diff = targetDate - now;

      if (diff > 0) {
        setTimeLeft({
          days: Math.floor(diff / (1000 * 60 * 60 * 24)),
          hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((diff % (1000 * 60)) / 1000),
        });
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleCopyAccount = () => {
    navigator.clipboard.writeText(invitation.bankInfo?.accountNumber || '000 888 999');
    setCopiedAccount(true);
    setTimeout(() => setCopiedAccount(false), 2000);
  };

  const handleRsvpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rsvpName) return;

    const newRsvp = {
      id: `rsvp-${Date.now()}`,
      guestName: rsvpName,
      guestCount: rsvpGuests,
      attendance: rsvpAttendance,
      phone: rsvpPhone,
      wishes: rsvpWishes || 'សូមជូនពរកូនប្រុសស្រីមានសុភមង្គលរហូតដល់ចាស់តោងកង!',
      createdAt: new Date().toISOString(),
    };

    setWishesList([newRsvp, ...wishesList]);
    setRsvpSubmitted(true);

    confetti({
      particleCount: 120,
      spread: 90,
      origin: { y: 0.5 },
    });
  };

  const galleryList = invitation.gallery || [];

  return (
    <div className="min-h-screen bg-[#18140F] text-[#E8DCC4] font-serif selection:bg-[#D4AF37] selection:text-[#0F1115] relative pb-28 overflow-x-hidden">
      {/* Background Audio Player */}
      <audio ref={audioRef} src={currentTrack.url} loop preload="auto" />

      {/* TOP FLOATING CONTROLS (Sticky Header with Language, Back, Skip & Music Controls) */}
      <div className="fixed top-3 left-3 right-3 sm:top-4 sm:left-4 sm:right-4 z-50 flex items-center justify-between max-w-5xl mx-auto pointer-events-none">
        <div className="pointer-events-auto flex items-center gap-1.5 sm:gap-2">
          {/* Back to Cover button (ត្រឡប់) - permanently attached after opening letter */}
          {hasOpenedIntro && (
            <button
              onClick={() => {
                setHasOpenedIntro(false);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="px-3 py-1.5 sm:px-3.5 sm:py-1.5 rounded-full bg-[#1A140E]/95 backdrop-blur-md border border-[#D4AF37] text-xs font-bold shadow-2xl text-[#FCF6BA] hover:bg-[#D4AF37] hover:text-[#0F1115] transition-all flex items-center gap-1 cursor-pointer hover:scale-105 active:scale-95"
              title="ត្រឡប់ទៅផ្ទាំងដើម / Return to Cover"
            >
              <RotateCcw className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>{isKh ? 'ត្រឡប់' : 'Back'}</span>
            </button>
          )}

          {/* Skip button (រំលង) - permanently attached after opening letter */}
          <button
            onClick={handleSkipAndScrollDown}
            className="px-3 py-1.5 sm:px-3.5 sm:py-1.5 rounded-full bg-gradient-to-r from-[#D4AF37] via-[#FCF6BA] to-[#D4AF37] hover:brightness-110 text-[#0F1115] font-extrabold text-xs shadow-2xl transition-all hover:scale-105 active:scale-95 flex items-center gap-1 cursor-pointer"
            title="រំលងទៅមើលព័ត៌មានអាពាហ៍ពិពាហ៍ / Skip to Content"
          >
            <SkipForward className="w-3.5 h-3.5 text-[#0F1115]" />
            <span>{isKh ? 'រំលង' : 'Skip'}</span>
          </button>

          {/* Language toggle */}
          <button
            onClick={() => setLanguage(isKh ? 'en' : 'kh')}
            className="px-2.5 py-1.5 sm:px-3 sm:py-1.5 rounded-full bg-[#1A140E]/95 backdrop-blur-md border border-[#D4AF37]/60 text-xs font-bold shadow-xl text-[#D4AF37] flex items-center gap-1 hover:scale-105 transition-all cursor-pointer"
          >
            <Globe className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span className="hidden sm:inline">{isKh ? '🇰🇭 ខ្មែរ' : '🇬🇧 EN'}</span>
            <span className="sm:hidden">{isKh ? '🇰🇭' : '🇬🇧'}</span>
          </button>
        </div>

        <div className="pointer-events-auto flex items-center gap-1.5 sm:gap-2">

          {/* Playlist Selector Menu */}
          <div className="relative">
            <button
              onClick={() => setShowMusicMenu(!showMusicMenu)}
              className="px-3 py-1.5 rounded-full bg-[#2A231A]/90 backdrop-blur-md border border-[#D4AF37]/60 text-[#D4AF37] shadow-xl hover:scale-105 transition-all flex items-center gap-1.5 text-xs font-bold cursor-pointer"
              title="Select Music Track"
            >
              <Music className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span className="max-w-[100px] sm:max-w-[140px] truncate">{currentTrack?.title || 'Music Track'}</span>
            </button>

            {/* Playlist Dropdown Drawer */}
            {showMusicMenu && (
              <div className="absolute top-10 right-0 w-72 bg-[#1C1712] border-2 border-[#D4AF37] rounded-2xl p-3 shadow-2xl z-50 text-left space-y-2 animate-in fade-in">
                <div className="flex items-center justify-between border-b border-[#D4AF37]/30 pb-2">
                  <span className="text-xs font-bold text-[#FCF6BA] uppercase tracking-wider flex items-center gap-1.5">
                    <Music className="w-3.5 h-3.5 text-[#D4AF37]" />
                    <span>{isKh ? 'បញ្ជីបទចម្រៀងអាពាហ៍ពិពាហ៍' : 'Wedding Playlist'}</span>
                  </span>
                  <button
                    onClick={() => setShowMusicMenu(false)}
                    className="text-[#D4AF37] hover:text-white p-0.5 rounded-full cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="space-y-1.5 max-h-60 overflow-y-auto pr-1">
                  {[...(invitation.customMusicTracks || []), ...presetMusicTracks].map((track) => {
                    const isSelected = currentTrack?.id === track.id;
                    return (
                      <button
                        key={track.id}
                        type="button"
                        onClick={() => {
                          setCurrentTrack(track);
                          setShowMusicMenu(false);
                          if (audioRef.current) {
                            audioRef.current.src = track.url;
                            audioRef.current.play().then(() => setIsPlayingMusic(true)).catch(() => {});
                          }
                        }}
                        className={`w-full text-left p-2.5 rounded-xl transition-all flex items-center justify-between gap-2 cursor-pointer ${
                          isSelected
                            ? 'bg-[#D4AF37]/25 border border-[#D4AF37] text-[#FCF6BA] font-bold shadow-xs'
                            : 'hover:bg-[#2A231A] text-[#E8DCC4] border border-transparent'
                        }`}
                      >
                        <div className="min-w-0 flex-1">
                          <p className="text-xs truncate">{track.title}</p>
                          <p className="text-[10px] text-[#A69B88] truncate">{track.artist}</p>
                        </div>
                        {isSelected && isPlayingMusic && (
                          <Volume2 className="w-4 h-4 text-[#D4AF37] animate-pulse shrink-0" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          <button
            onClick={toggleMusic}
            className="p-2.5 rounded-full bg-[#2A231A]/90 border border-[#D4AF37]/60 text-[#D4AF37] shadow-xl hover:scale-110 transition-all flex items-center justify-center cursor-pointer"
            title="Play/Pause Background Music"
          >
            {isPlayingMusic ? (
              <Volume2 className="w-4 h-4 animate-pulse text-[#D4AF37]" />
            ) : (
              <VolumeX className="w-4 h-4 text-[#8E9299]" />
            )}
          </button>
        </div>
      </div>

      {/* INTRO OVERLAY MODAL (Video Royal Gold Cover Card) */}
      {!hasOpenedIntro && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0C0A08]/95 backdrop-blur-md p-4 overflow-y-auto animate-in fade-in">
          <div
            className="bg-gradient-to-b from-[#241E17] via-[#1A1510] to-[#14100C] border-2 border-[#D4AF37] rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl text-center relative overflow-hidden bg-cover bg-center my-auto"
            style={
              invitation.envelopeBgImage && !invitation.envelopeBgVideo
                ? { backgroundImage: `url(${invitation.envelopeBgImage})` }
                : undefined
            }
          >
            {/* Background Video for Envelope Modal */}
            {invitation.envelopeBgVideo ? (
              <video
                src={invitation.envelopeBgVideo}
                autoPlay
                loop
                muted
                playsInline
                className="absolute inset-0 w-full h-full object-cover z-0 filter brightness-90"
              />
            ) : null}

            {/* Dark overlay for readability if envelope bg image or video is present */}
            {(invitation.envelopeBgVideo || invitation.envelopeBgImage) && (
              <div className="absolute inset-0 bg-[#0C0A08]/80 backdrop-blur-[2px] z-0" />
            )}

            <div className="relative z-10">
              {/* Royal Gold Kbach Corner Ornaments */}
              <div className="w-8 h-8 border-t-2 border-l-2 border-[#D4AF37] absolute -top-3 -left-3" />
              <div className="w-8 h-8 border-t-2 border-r-2 border-[#D4AF37] absolute -top-3 -right-3" />
              <div className="w-8 h-8 border-b-2 border-l-2 border-[#D4AF37] absolute -bottom-3 -left-3" />
              <div className="w-8 h-8 border-b-2 border-r-2 border-[#D4AF37] absolute -bottom-3 -right-3" />

              <p className="text-sm sm:text-base uppercase tracking-widest text-gold-gradient font-black mb-1 drop-shadow-md">
                {invitation.greetingHeaderTitle || 'សិរីសួស្តីអាពាហ៍ពិពាហ៍'}
              </p>

              {/* Couple Logo Image */}
              {invitation.coupleLogoImage && invitation.showCoupleLogoImage !== false && (
                <div className="my-2 max-w-[200px] mx-auto p-1 bg-black/40 rounded-2xl border border-[#D4AF37]/40 shadow-md">
                  <img
                    src={invitation.coupleLogoImage}
                    alt="Couple Logo"
                    className="w-full max-h-28 object-contain mx-auto filter drop-shadow-[0_2px_8px_rgba(212,175,55,0.4)]"
                    referrerPolicy="no-referrer"
                  />
                </div>
              )}

              {/* Couple Text Name */}
              {(invitation.showCoupleTextName !== false || !invitation.coupleLogoImage || invitation.showCoupleLogoImage === false) && (
                <h2
                  style={invitation.coupleFontSize ? { fontSize: `${Math.min(invitation.coupleFontSize, 32)}px` } : undefined}
                  className={`text-2xl sm:text-3xl font-black text-gold-gradient mb-2 drop-shadow-lg ${groomBrideFontClass}`}
                >
                  {invitation.groomName} & {invitation.brideName}
                </h2>
              )}

              {/* Large Vertical Facebook Story Cover Photo/Video with Customizable Preset Frames (រូបcover ធំ រូបបញ្ឈរ/វីដេអូ ព្រមទាំងស៊ុមរូបថតប្រណិត) */}
              {invitation.showCoverPhotoVertical !== false && (invitation.coverVideoVertical || invitation.coverPhotoVertical || invitation.coverImage) && (
                <div className="my-3 max-w-[240px] sm:max-w-[260px] mx-auto relative group">
                  {/* Frame Container switch according to coverFrameStyle */}
                  <div
                    className={`relative overflow-hidden transition-all duration-300 ${
                      invitation.coverFrameStyle === 'khmer-kbach'
                        ? 'p-2.5 rounded-2xl bg-[#1A140E] border-2 border-[#D4AF37] shadow-[0_0_30px_rgba(212,175,55,0.6)]'
                        : invitation.coverFrameStyle === 'floral-gold'
                        ? 'p-2.5 rounded-3xl bg-gradient-to-tr from-[#2C2117] via-[#18120B] to-[#2C2117] border-2 border-[#E6C687] shadow-xl'
                        : invitation.coverFrameStyle === 'heart-arch'
                        ? 'p-2.5 rounded-t-[80px] rounded-b-2xl bg-gradient-to-b from-[#281C14] to-[#0E0B08] border-4 border-[#D4AF37] shadow-[0_0_20px_rgba(212,175,55,0.4)]'
                        : invitation.coverFrameStyle === 'glowing-pearl'
                        ? 'p-2 rounded-2xl bg-black/90 border-2 border-amber-200 shadow-[0_0_35px_rgba(255,223,128,0.85)] animate-pulse'
                        : invitation.coverFrameStyle === 'none'
                        ? 'p-1 rounded-xl bg-black/40 border border-[#D4AF37]/30 shadow-md'
                        : /* Default: 'gold-royal' */
                          'p-2.5 rounded-2xl bg-gradient-to-b from-[#2A2218] via-[#14100C] to-[#0A0806] border-4 border-double border-[#D4AF37] shadow-[0_0_25px_rgba(212,175,55,0.5)]'
                    }`}
                  >
                    {/* Frame Corner Accents based on style */}
                    {invitation.coverFrameStyle === 'heart-arch' ? (
                      <div className="absolute top-2 left-1/2 -translate-x-1/2 text-xs text-[#FCF6BA] z-10 font-bold">
                        💖
                      </div>
                    ) : invitation.coverFrameStyle === 'floral-gold' ? (
                      <>
                        <div className="absolute top-1.5 left-1.5 text-xs text-[#E6C687] z-10">🌸</div>
                        <div className="absolute top-1.5 right-1.5 text-xs text-[#E6C687] z-10">🌸</div>
                        <div className="absolute bottom-1.5 left-1.5 text-xs text-[#E6C687] z-10">🌸</div>
                        <div className="absolute bottom-1.5 right-1.5 text-xs text-[#E6C687] z-10">🌸</div>
                      </>
                    ) : invitation.coverFrameStyle === 'khmer-kbach' ? (
                      <>
                        <div className="absolute top-1 left-1 w-5 h-5 border-t-2 border-l-2 border-[#FCF6BA] bg-[#D4AF37]/20 z-10 rounded-tl-md" />
                        <div className="absolute top-1 right-1 w-5 h-5 border-t-2 border-r-2 border-[#FCF6BA] bg-[#D4AF37]/20 z-10 rounded-tr-md" />
                        <div className="absolute bottom-1 left-1 w-5 h-5 border-b-2 border-l-2 border-[#FCF6BA] bg-[#D4AF37]/20 z-10 rounded-bl-md" />
                        <div className="absolute bottom-1 right-1 w-5 h-5 border-b-2 border-r-2 border-[#FCF6BA] bg-[#D4AF37]/20 z-10 rounded-br-md" />
                      </>
                    ) : invitation.coverFrameStyle !== 'none' ? (
                      <>
                        <div className="absolute top-2 left-2 w-5 h-5 border-t-2 border-l-2 border-[#D4AF37] z-10" />
                        <div className="absolute top-2 right-2 w-5 h-5 border-t-2 border-r-2 border-[#D4AF37] z-10" />
                        <div className="absolute bottom-2 left-2 w-5 h-5 border-b-2 border-l-2 border-[#D4AF37] z-10" />
                        <div className="absolute bottom-2 right-2 w-5 h-5 border-b-2 border-r-2 border-[#D4AF37] z-10" />
                      </>
                    ) : null}

                    {/* Media Video or Image */}
                    {(() => {
                      const ratioClass =
                        invitation.coverAspectRatio === '2:3'
                          ? 'aspect-[2/3] max-h-72 sm:max-h-96'
                          : invitation.coverAspectRatio === '9:16'
                          ? 'aspect-[9/16] max-h-80 sm:max-h-[420px]'
                          : invitation.coverAspectRatio === '1:1'
                          ? 'aspect-[1/1] max-h-60 sm:max-h-72'
                          : /* 3:4 default */ 'aspect-[3/4] max-h-64 sm:max-h-80';

                      const frameRadiusClass =
                        invitation.coverFrameStyle === 'heart-arch'
                          ? 'rounded-t-[70px] rounded-b-xl'
                          : 'rounded-xl';

                      return invitation.coverVideoVertical ? (
                        <video
                          src={invitation.coverVideoVertical}
                          autoPlay
                          loop
                          muted
                          playsInline
                          className={`w-full object-cover shadow-inner filter brightness-105 ${ratioClass} ${frameRadiusClass}`}
                        />
                      ) : (
                        <img
                          src={invitation.coverPhotoVertical || invitation.coverImage}
                          alt="Vertical Cover Portrait"
                          className={`w-full object-cover shadow-inner filter brightness-105 ${ratioClass} ${frameRadiusClass}`}
                          referrerPolicy="no-referrer"
                        />
                      );
                    })()}

                    {/* Custom Overlay Frame Image if uploaded */}
                    {invitation.customFrameImage && (
                      <img
                        src={invitation.customFrameImage}
                        alt="Custom Frame Overlay"
                        className="absolute inset-0 w-full h-full object-cover pointer-events-none z-20"
                        referrerPolicy="no-referrer"
                      />
                    )}
                  </div>
                </div>
              )}

              {/* Traditional Cambodian Guest Name Box (កន្លែងទុកដាក់ និងលោតបង្ហាញឈ្មោះភ្ញៀវ) DIRECTLY ABOVE Open Invitation Button */}
              <div className="my-4 p-4 rounded-2xl bg-gradient-to-b from-[#1C1712]/95 to-[#0F1115]/98 backdrop-blur-md border-2 border-[#D4AF37]/80 shadow-2xl relative text-center">
                <div className="w-4 h-4 border-t-2 border-l-2 border-[#D4AF37] absolute top-1.5 left-1.5" />
                <div className="w-4 h-4 border-t-2 border-r-2 border-[#D4AF37] absolute top-1.5 right-1.5" />
                <div className="w-4 h-4 border-b-2 border-l-2 border-[#D4AF37] absolute bottom-1.5 left-1.5" />
                <div className="w-4 h-4 border-b-2 border-r-2 border-[#D4AF37] absolute bottom-1.5 right-1.5" />

                {/* Honorific Title Ribbon */}
                <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#D4AF37]/20 border border-[#D4AF37]/60 text-[#D4AF37] text-[11px] font-bold uppercase tracking-wider mb-2 shadow-xs">
                  <span>សូមគោរពអញ្ជើញ</span>
                </div>

                {/* Honorific Titles List - Only show if NO specific guest name is loaded or typed */}
                {!(guestInputOnCard || guestNameOverride) && (
                  <p className="text-[10px] text-[#D4AF37]/80 font-serif leading-relaxed px-2 mb-2">
                    {invitation.guestHonorifics || 'សម្តេច ទ្រង់ ឯកឧត្តម លោកជំទាវ លោកអ្នកឧកញ៉ា អ្នកឧកញ៉ា ឧកញ៉ា លោក លោកស្រី អ្នកនាង កញ្ញា'}
                  </p>
                )}

                {/* Interactive Dynamic Guest Name Input / Popup Display Box */}
                <div className="relative mt-2">
                  <input
                    type="text"
                    value={guestInputOnCard || guestNameOverride || ''}
                    onChange={(e) => setGuestInputOnCard(e.target.value)}
                    placeholder={invitation.guestHonorifics || 'សម្តេច ទ្រង់ ឯកឧត្តម លោកជំទាវ... (ឬ វាយបញ្ចូលឈ្មោះភ្ញៀវទីនេះ)'}
                    style={invitation.guestNameFontSize ? { fontSize: `${invitation.guestNameFontSize}px` } : undefined}
                    className="w-full text-center py-2.5 px-3 rounded-xl bg-gradient-to-r from-black/90 via-[#1A140E]/95 to-black/90 border-2 border-[#D4AF37] text-gold-bright font-extrabold text-base sm:text-lg font-serif shadow-lg tracking-wide focus:border-[#FCF6BA] focus:ring-2 focus:ring-[#D4AF37]/50 outline-none transition-all placeholder:text-[#D4AF37]/40 placeholder:text-xs"
                  />

                  {(guestInputOnCard || guestNameOverride) && (
                    <div className="mt-1.5 text-[10px] text-[#FCF6BA] font-bold flex items-center justify-center gap-1 animate-pulse">
                      <Sparkles className="w-3 h-3 text-[#D4AF37]" />
                      <span>{isKh ? 'ឈ្មោះភ្ញៀវកិត្តិយសត្រូវបានកំណត់យ៉ាងប្រណិត' : 'Personalized Guest Name Active'}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Main Open Invitation Button directly below Guest Name Card */}
              <button
                onClick={handleOpenInvitationWithMusic}
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-[#D4AF37] via-[#FCF6BA] to-[#D4AF37] hover:brightness-110 text-[#0F1115] font-extrabold text-sm sm:text-base shadow-2xl transition-all transform hover:scale-102 flex items-center justify-center gap-2 cursor-pointer mt-2 border border-[#FFF8DC]/40"
              >
                <Sparkles className="w-5 h-5 text-[#0F1115]" />
                <span>{isKh ? 'បើកធៀបការ (Open Invitation)' : 'Open Invitation with Music'}</span>
              </button>

              {/* Action buttons: រំលង (Skip) & ត្រឡប់ (Back) */}
              <div className="grid grid-cols-2 gap-2.5 mt-3 pt-3 border-t border-[#D4AF37]/30">
                <button
                  onClick={handleSkipAndScrollDown}
                  className="py-2.5 px-3 rounded-xl bg-[#2A231A]/90 hover:bg-[#3D3223] border border-[#D4AF37]/60 text-[#D4AF37] font-extrabold text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-md hover:scale-102"
                  title="រំលងទៅមើលព័ត៌មានធៀប"
                >
                  <SkipForward className="w-4 h-4 text-[#D4AF37]" />
                  <span>{isKh ? 'រំលង' : 'Skip'}</span>
                </button>

                <button
                  onClick={handleSkipAndScrollDown}
                  className="py-2.5 px-3 rounded-xl bg-[#2A231A]/90 hover:bg-[#3D3223] border border-[#D4AF37]/60 text-[#E8DCC4] hover:text-[#FCF6BA] font-extrabold text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-md hover:scale-102"
                  title="ត្រឡប់ / បន្តទៅមុខ"
                >
                  <RotateCcw className="w-4 h-4 text-[#D4AF37]" />
                  <span>{isKh ? 'ត្រឡប់' : 'Back'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* HERO / COVER CARD SECTION */}
      <section id="hero-section" className="relative min-h-screen flex flex-col items-center justify-center pt-16 pb-12 px-4 text-center">
        {/* Ornate Gold Bordered Card Frame */}
        <div className="relative max-w-xl w-full mx-auto p-8 sm:p-12 rounded-3xl bg-gradient-to-b from-[#241E17] via-[#1C1712] to-[#14100C] border-2 border-[#D4AF37] shadow-2xl space-y-6">
          {/* Top Monogram Logo Badge */}
          <div className="w-20 h-20 rounded-full bg-[#14100C] border-2 border-[#D4AF37] flex items-center justify-center mx-auto text-[#D4AF37] shadow-lg relative overflow-hidden">
            {invitation.coupleLogoImage && invitation.showCoupleLogoImage !== false ? (
              <img
                src={invitation.coupleLogoImage}
                alt="Couple Logo"
                className="w-full h-full object-contain p-2 rounded-full filter drop-shadow-[0_2px_8px_rgba(212,175,55,0.5)]"
                referrerPolicy="no-referrer"
              />
            ) : (
              <span className="font-serif font-bold text-xl tracking-tighter text-[#D4AF37]">
                {invitation.monogramText || 'ឝ'}
              </span>
            )}
          </div>

          <div className="inline-flex items-center gap-2 px-5 py-1.5 rounded-full bg-gradient-to-r from-amber-500/20 via-[#D4AF37]/30 to-amber-500/20 text-gold-bright border-2 border-[#D4AF37]/60 text-xs sm:text-sm font-black shadow-md">
            <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span className="text-gold-gradient">{invitation.greetingHeaderTitle || 'សិរីសួស្តីអាពាហ៍ពិពាហ៍'}</span>
          </div>

          {/* Parents Section (Side-by-Side ទទឹមគ្នា on phone & desktop) */}
          <div className="grid grid-cols-2 gap-2 sm:gap-4 my-4 text-xs font-serif border-y border-[#D4AF37]/40 py-5 bg-[#0F1115]/60 rounded-2xl px-2 sm:px-4 shadow-inner">
            <div className="space-y-1 text-center border-r border-[#D4AF37]/30 pr-2">
              <p className="text-[10px] sm:text-xs uppercase font-bold text-[#D4AF37] tracking-wider mb-1">
                {isKh ? 'អាណាព្យាបាលខាងប្រុស' : 'Groom Parents'}
              </p>
              <p className={`font-bold text-sm sm:text-base text-gold-bright drop-shadow-md leading-snug ${primaryFontClass}`}>
                {invitation.groomFatherName}
              </p>
              <p className={`font-bold text-sm sm:text-base text-gold-bright drop-shadow-md leading-snug ${primaryFontClass}`}>
                {invitation.groomMotherName}
              </p>
            </div>

            <div className="space-y-1 text-center pl-2">
              <p className="text-[10px] sm:text-xs uppercase font-bold text-[#D4AF37] tracking-wider mb-1">
                {isKh ? 'អាណាព្យាបាលខាងស្រី' : 'Bride Parents'}
              </p>
              <p className={`font-bold text-sm sm:text-base text-gold-bright drop-shadow-md leading-snug ${primaryFontClass}`}>
                {invitation.brideFatherName}
              </p>
              <p className={`font-bold text-sm sm:text-base text-gold-bright drop-shadow-md leading-snug ${primaryFontClass}`}>
                {invitation.brideMotherName}
              </p>
            </div>
          </div>

          {/* Couple Names Display & Custom Logo Image */}
          <div className="space-y-4 py-2">
            {/* Display Couple Logo Image if uploaded & enabled */}
            {invitation.coupleLogoImage && invitation.showCoupleLogoImage !== false && (
              <div className="max-w-xs mx-auto p-2 bg-black/40 rounded-2xl border border-[#D4AF37]/40 shadow-xl">
                <img
                  src={invitation.coupleLogoImage}
                  alt="Couple Logo"
                  className="w-full max-h-48 object-contain mx-auto filter drop-shadow-[0_4px_12px_rgba(212,175,55,0.5)]"
                  referrerPolicy="no-referrer"
                />
              </div>
            )}

            {/* Display Couple Text Names Side-by-Side (ទទឹមគ្នា) if enabled */}
            {(invitation.showCoupleTextName !== false || !invitation.coupleLogoImage || invitation.showCoupleLogoImage === false) && (
              <div className="grid grid-cols-2 gap-2 sm:gap-4 items-center my-3 relative py-2">
                {/* Groom Column */}
                <div className="text-center space-y-1 pr-3">
                  <p className="text-[10px] sm:text-xs text-[#D4AF37] font-bold tracking-widest uppercase">
                    {invitation.groomTitle || 'កូនប្រុសនាម'}
                  </p>
                  <h1
                    style={invitation.coupleFontSize ? { fontSize: `${invitation.coupleFontSize}px` } : undefined}
                    className={`text-2xl sm:text-4xl font-black text-gold-gradient drop-shadow-lg transition-all leading-tight ${groomBrideFontClass}`}
                  >
                    {invitation.groomName}
                  </h1>
                </div>

                {/* Center Ampersand Badge */}
                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
                  <div className="w-8 h-8 sm:w-11 sm:h-11 rounded-full bg-gradient-to-tr from-[#BF953F] via-[#FCF6BA] to-[#B38728] text-[#0F1115] font-black flex items-center justify-center text-xs sm:text-lg shadow-gold-glow border-2 border-[#F3E5C8]">
                    &
                  </div>
                </div>

                {/* Bride Column */}
                <div className="text-center space-y-1 pl-3">
                  <p className="text-[10px] sm:text-xs text-[#D4AF37] font-bold tracking-widest uppercase">
                    {invitation.brideTitle || 'កូនស្រីនាម'}
                  </p>
                  <h1
                    style={invitation.coupleFontSize ? { fontSize: `${invitation.coupleFontSize}px` } : undefined}
                    className={`text-2xl sm:text-4xl font-black text-gold-gradient drop-shadow-lg transition-all leading-tight ${groomBrideFontClass}`}
                  >
                    {invitation.brideName}
                  </h1>
                </div>
              </div>
            )}
          </div>

          {/* Personalized Guest Badge */}
          <div className="p-4 rounded-2xl bg-[#0F1115]/80 border border-[#D4AF37]/50 text-xs">
            <span className="text-[#8E9299] block mb-1">
              {isKh ? 'យើងខ្ញុំមានកិត្តិយសសូមគោរពអញ្ជើញ' : 'We Cordially Invite'}
            </span>
            <p className="text-base font-bold text-[#D4AF37] font-serif">
              {effectiveGuestName}
            </p>
          </div>

          {/* Date & Time */}
          <div className="space-y-1 text-xs font-serif text-[#E0D0A6]">
            <p className="font-bold text-[#D4AF37] text-sm">{invitation.weddingDateKhmer}</p>
            <p className="text-[11px] opacity-80">{invitation.lunarDateKhmer}</p>
            <p className="font-semibold text-[#D4AF37]">{invitation.timeKhmer}</p>
            <p className="text-[#8E9299] mt-1">{invitation.venueAddress}</p>
          </div>
        </div>
      </section>

      {/* FORMAL INVITATION SPEECH SECTION */}
      <section id="speech-section" ref={contentRef} className="py-12 px-4 max-w-2xl mx-auto text-center">
        <div className="p-8 sm:p-10 rounded-3xl bg-gradient-to-b from-[#241E17] via-[#1A1510] to-[#14100C] border-2 border-[#D4AF37]/60 shadow-2xl space-y-5 relative overflow-hidden">
          <div className="w-14 h-14 rounded-full bg-[#D4AF37]/15 border border-[#D4AF37] flex items-center justify-center mx-auto text-[#D4AF37] shadow-gold-glow">
            <Sparkles className="w-7 h-7 text-[#D4AF37]" />
          </div>
          <h2 className={`text-2xl font-bold text-gold-gradient drop-shadow ${primaryFontClass}`}>
            {isKh ? 'សេចក្តីថ្លែងអញ្ជើញ & សារផ្លូវការ' : 'Formal Invitation Speech'}
          </h2>
          <div className="p-6 rounded-2xl bg-[#0F1115]/80 border border-[#D4AF37]/30 shadow-inner">
            <p className={`text-sm sm:text-base leading-relaxed text-[#F3E5C8] whitespace-pre-line ${speechFontClass}`}>
              {invitation.formalInvitationText}
            </p>
          </div>
        </div>
      </section>

      {/* LOCATION & GOOGLE MAPS SECTION */}
      <section id="location-section" className="py-12 px-4 max-w-2xl mx-auto text-center">
        <div className="p-8 rounded-3xl bg-[#241E17] border border-[#D4AF37]/50 shadow-xl space-y-5">
          <div className="w-12 h-12 rounded-full bg-[#D4AF37]/15 text-[#D4AF37] border border-[#D4AF37]/40 flex items-center justify-center mx-auto">
            <MapPin className="w-6 h-6" />
          </div>

          <div>
            <h2 className="text-xl font-bold font-serif text-[#D4AF37]">
              {isKh ? 'ទីតាំងរៀបកម្មវិធី' : 'Venue Location'}
            </h2>
            <p className="text-base font-bold text-[#F3E5C8] mt-2 font-serif">
              {invitation.venueName}
            </p>
            <p className="text-xs text-[#8E9299] max-w-md mx-auto mt-1 leading-relaxed">
              {invitation.venueAddress}
            </p>
          </div>

          {/* VENUE LOCATION PHOTO / MAP IMAGE */}
          {invitation.venueImage && (
            <div className="my-4 max-w-md mx-auto rounded-2xl overflow-hidden border-2 border-[#D4AF37]/50 shadow-xl bg-[#0F1115] group">
              <img
                src={invitation.venueImage}
                alt={invitation.venueName || 'Venue Location'}
                className="w-full h-auto max-h-72 object-cover group-hover:scale-105 transition-transform duration-300"
                referrerPolicy="no-referrer"
              />
            </div>
          )}

          <a
            href={invitation.googleMapUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-[#D4AF37] to-[#AA8B2E] text-[#0F1115] font-bold text-xs shadow-lg transition-all hover:brightness-110 cursor-pointer"
          >
            <ExternalLink className="w-4 h-4 text-[#0F1115]" />
            <span>{isKh ? 'តភ្ជាប់ទៅកាន់ផែនទី (Google Maps)' : 'Open Google Maps'}</span>
          </a>
        </div>
      </section>

      {/* PROGRAM SCHEDULE TIMELINE SECTION */}
      <section id="agenda-section" className="py-12 px-4 max-w-2xl mx-auto">
        <div className="p-8 rounded-3xl bg-gradient-to-b from-[#241E17] to-[#14100C] border-2 border-[#D4AF37]/60 shadow-2xl space-y-6">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#D4AF37]/15 text-[#D4AF37] text-xs font-bold mb-2 border border-[#D4AF37]/30">
              <Clock className="w-3.5 h-3.5" />
              <span>{isKh ? 'កម្មវិធីការប្រពៃណីខ្មែរ' : 'Traditional Wedding Schedule'}</span>
            </div>
            <h2 className={`text-2xl font-bold text-gold-gradient drop-shadow ${primaryFontClass}`}>
              {isKh ? 'របៀបវារៈកម្មវិធីពិធីការ' : 'Program Schedule'}
            </h2>
          </div>

          {/* Render Active Program Items */}
          {(() => {
            const activeItems = invitation.programItems || defaultProgramItems;
            const day1Items = activeItems.filter((i) => i.day === 1);
            const day2Items = activeItems.filter((i) => i.day === 2);

            const getEventIcon = (iconKey?: string, index: number = 0) => {
              if (iconKey === 'rings') return '💍';
              if (iconKey === 'haircut') return '🌸';
              if (iconKey === 'tea') return '🍵';
              if (iconKey === 'monk') return '🕯️';
              if (iconKey === 'procession') return '🥁';
              if (iconKey === 'dinner') return '🥂';
              if (iconKey === 'music') return '🎵';
              if (iconKey === 'photo') return '📸';
              if (iconKey === 'blessing') return '📜';
              const fallbacks = ['💍', '🌸', '🍵', '🕯️', '🥁', '🥂', '🎵', '📸'];
              return fallbacks[index % fallbacks.length];
            };

            return (
              <div className="space-y-6">
                {/* DAY 1 */}
                {day1Items.length > 0 && (
                  <div className="space-y-3">
                    <div className="p-3 rounded-xl bg-[#0F1115] border border-[#D4AF37]/40 text-[#D4AF37] font-bold text-xs flex items-center justify-between shadow-inner">
                      <span className="font-serif font-bold text-gold-bright">{isKh ? 'ថ្ងៃទី១ ៖ ថ្ងៃសែនសីរិមង្គល' : 'Day 1 Ceremony'}</span>
                      <span className="text-[10px] font-normal text-[#8E9299]">{isKh ? 'ពិធីសែនក្រុងពាលី' : 'Blessings'}</span>
                    </div>

                    <div className="space-y-3 pl-3 border-l-2 border-[#D4AF37]">
                      {day1Items.map((item, idx) => (
                        <div
                          key={item.id || idx}
                          className="p-4 rounded-2xl bg-[#14100C] border border-[#382D20] hover:border-[#D4AF37]/60 transition-all shadow-md relative flex items-start gap-3"
                        >
                          <div className="w-10 h-10 rounded-full bg-[#2A2117] border border-[#D4AF37]/50 flex items-center justify-center text-lg shrink-0 shadow-inner">
                            {getEventIcon(item.icon, idx)}
                          </div>
                          <div className="flex-1">
                            <span className="inline-block px-2.5 py-0.5 rounded-md bg-[#D4AF37]/20 text-[#D4AF37] text-[11px] font-bold mb-1 border border-[#D4AF37]/30">
                              {item.time}
                            </span>
                            <h3 className={`text-sm font-bold text-[#F3E5C8] ${primaryFontClass}`}>
                              {item.title}
                            </h3>
                            {item.description && (
                              <p className="text-xs text-[#A8A298] mt-1 leading-relaxed">
                                {item.description}
                              </p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* DAY 2 */}
                {day2Items.length > 0 && (
                  <div className="space-y-3 pt-2">
                    <div className="p-3 rounded-xl bg-[#0F1115] border border-[#D4AF37]/40 text-[#D4AF37] font-bold text-xs flex items-center justify-between shadow-inner">
                      <span className="font-serif font-bold text-gold-bright">{isKh ? 'ថ្ងៃទី២ ៖ ថ្ងៃសិរីអាពាហ៍ពិពាហ៍' : 'Day 2 Main Ceremony'}</span>
                      <span className="text-[10px] font-normal text-[#8E9299]">{isKh ? 'ថ្ងៃសិរីមង្គល' : 'Main Wedding'}</span>
                    </div>

                    <div className="space-y-3 pl-3 border-l-2 border-[#D4AF37]">
                      {day2Items.map((item, idx) => (
                        <div
                          key={item.id || idx}
                          className="p-4 rounded-2xl bg-[#14100C] border border-[#382D20] hover:border-[#D4AF37]/60 transition-all shadow-md relative flex items-start gap-3"
                        >
                          <div className="w-10 h-10 rounded-full bg-[#2A2117] border border-[#D4AF37]/50 flex items-center justify-center text-lg shrink-0 shadow-inner">
                            {getEventIcon(item.icon, idx + 3)}
                          </div>
                          <div className="flex-1">
                            <span className="inline-block px-2.5 py-0.5 rounded-md bg-[#D4AF37]/20 text-[#D4AF37] text-[11px] font-bold mb-1 border border-[#D4AF37]/30">
                              {item.time}
                            </span>
                            <h3 className={`text-sm font-bold text-[#F3E5C8] ${primaryFontClass}`}>
                              {item.title}
                            </h3>
                            {item.description && (
                              <p className="text-xs text-[#A8A298] mt-1 leading-relaxed">
                                {item.description}
                              </p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })()}
        </div>
      </section>

      {/* PHOTO GALLERY & LIGHTBOX SECTION */}
      <section id="gallery-section" className="py-12 px-4 max-w-2xl mx-auto text-center">
        <div className="p-8 rounded-3xl bg-[#241E17] border border-[#D4AF37]/50 shadow-xl space-y-6">
          <div>
            <h2 className="text-xl font-bold font-serif text-[#D4AF37]">
              {isKh ? 'ពិធីក្រកសល / រូបថតមង្គលការ' : 'Photo Gallery'}
            </h2>
            <p className="text-xs text-[#8E9299] mt-1">
              {isKh ? 'ចុចលើរូបថតដើម្បីមើលទំហំធំ full screen' : 'Click any photo to view in full screen'}
            </p>
          </div>

          {/* Photo Grid */}
          {(() => {
            const aspectClass =
              invitation.galleryAspectRatio === '2/3'
                ? 'aspect-[2/3]'
                : invitation.galleryAspectRatio === '9/16'
                ? 'aspect-[9/16]'
                : invitation.galleryAspectRatio === '1/1'
                ? 'aspect-square'
                : 'aspect-[3/4]'; // Default portrait 3:4

            return (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3.5">
                {galleryList.map((img, idx) => (
                  <div
                    key={img.id}
                    onClick={() => setActivePhotoIndex(idx)}
                    className={`group relative rounded-2xl overflow-hidden border-2 border-[#D4AF37]/50 ${aspectClass} cursor-pointer hover:border-[#FCF6BA] hover:shadow-2xl transition-all duration-300 bg-black/40`}
                  >
                    <img
                      src={img.url}
                      alt={img.caption || 'Wedding Photo'}
                      className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60 group-hover:opacity-20 transition-opacity" />
                    {img.caption && (
                      <div className="absolute bottom-2 left-1.5 right-1.5 text-[10px] text-[#FCF6BA] font-serif font-bold truncate text-center drop-shadow-md bg-black/70 py-1 px-1.5 rounded-md border border-[#D4AF37]/40 backdrop-blur-xs">
                        {img.caption}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            );
          })()}

          {/* Video Highlight Player */}
          {invitation.videoUrl && (
            <div className="mt-6 rounded-2xl overflow-hidden shadow-2xl border-2 border-[#D4AF37]/60 aspect-video bg-black/80">
              <iframe
                src={getYouTubeEmbedUrl(invitation.videoUrl)}
                title="Pre-wedding video"
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          )}
        </div>
      </section>

      {/* FULL-SCREEN LIGHTBOX MODAL */}
      {activePhotoIndex !== null && galleryList[activePhotoIndex] && (
        <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex flex-col items-center justify-between p-4 animate-in fade-in">
          {/* Top Bar */}
          <div className="w-full max-w-xl flex items-center justify-between text-[#E0D0A6] text-xs pt-2 px-2">
            <span>
              {activePhotoIndex + 1} / {galleryList.length}
            </span>
            <button
              onClick={() => setActivePhotoIndex(null)}
              className="p-2 rounded-full bg-[#2A231A] text-[#D4AF37] hover:bg-[#382F23] cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Image Container */}
          <div className="relative max-w-xl w-full flex-1 flex items-center justify-center my-4">
            <img
              src={galleryList[activePhotoIndex].url}
              alt="Gallery Preview"
              className="max-h-[80vh] w-auto object-contain rounded-2xl border-2 border-[#D4AF37]/60 shadow-2xl"
            />

            {/* Prev Button */}
            {galleryList.length > 1 && (
              <button
                onClick={() =>
                  setActivePhotoIndex(
                    (activePhotoIndex - 1 + galleryList.length) % galleryList.length
                  )
                }
                className="absolute left-2 p-3 rounded-full bg-[#14100C]/80 border border-[#D4AF37]/50 text-[#D4AF37] hover:bg-[#D4AF37] hover:text-[#0F1115] transition-all cursor-pointer"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
            )}

            {/* Next Button */}
            {galleryList.length > 1 && (
              <button
                onClick={() =>
                  setActivePhotoIndex((activePhotoIndex + 1) % galleryList.length)
                }
                className="absolute right-2 p-3 rounded-full bg-[#14100C]/80 border border-[#D4AF37]/50 text-[#D4AF37] hover:bg-[#D4AF37] hover:text-[#0F1115] transition-all cursor-pointer"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            )}
          </div>

          <p className="text-xs text-[#D4AF37] pb-2 font-serif text-center">
            {galleryList[activePhotoIndex].caption || 'រូបថតសិរីមង្គល'}
          </p>
        </div>
      )}

      {/* COUNTDOWN TIMER SECTION */}
      <section id="countdown-section" className="py-12 px-4 max-w-2xl mx-auto text-center">
        <div className="p-8 rounded-3xl bg-[#241E17] border border-[#D4AF37]/50 shadow-xl space-y-4">
          <h2 className="text-xl font-bold font-serif text-[#D4AF37]">
            {isKh ? 'សូមរង់ចាំថ្ងៃការពិសេស' : 'Countdown to Special Day'}
          </h2>

          <div className="grid grid-cols-4 gap-2 sm:gap-3 max-w-md mx-auto pt-2">
            <div className="p-3.5 rounded-2xl bg-[#14100C] border border-[#D4AF37]/40 text-[#D4AF37] shadow-inner">
              <span className="text-2xl font-bold block text-[#F3E5C8] font-mono">{timeLeft.days}</span>
              <span className="text-[10px] uppercase text-[#8E9299]">{isKh ? 'ថ្ងៃ' : 'Days'}</span>
            </div>
            <div className="p-3.5 rounded-2xl bg-[#14100C] border border-[#D4AF37]/40 text-[#D4AF37] shadow-inner">
              <span className="text-2xl font-bold block text-[#F3E5C8] font-mono">{timeLeft.hours}</span>
              <span className="text-[10px] uppercase text-[#8E9299]">{isKh ? 'ម៉ោង' : 'Hours'}</span>
            </div>
            <div className="p-3.5 rounded-2xl bg-[#14100C] border border-[#D4AF37]/40 text-[#D4AF37] shadow-inner">
              <span className="text-2xl font-bold block text-[#F3E5C8] font-mono">{timeLeft.minutes}</span>
              <span className="text-[10px] uppercase text-[#8E9299]">{isKh ? 'នាទី' : 'Mins'}</span>
            </div>
            <div className="p-3.5 rounded-2xl bg-[#14100C] border border-[#D4AF37]/40 text-[#D4AF37] shadow-inner">
              <span className="text-2xl font-bold block text-[#F3E5C8] font-mono">{timeLeft.seconds}</span>
              <span className="text-[10px] uppercase text-[#8E9299]">{isKh ? 'វិនាទី' : 'Secs'}</span>
            </div>
          </div>
        </div>
      </section>

      {/* ABA KHQR GIFT CODE SECTION */}
      <section id="gift-section" className="py-12 px-4 max-w-md mx-auto text-center">
        <div className="p-8 rounded-3xl bg-[#241E17] border border-[#D4AF37]/50 shadow-xl space-y-5">
          <div className="w-12 h-12 rounded-full bg-[#D4AF37] text-[#0F1115] flex items-center justify-center mx-auto shadow-md">
            <Gift className="w-6 h-6" />
          </div>

          <div>
            <h2 className="text-xl font-bold font-serif text-[#D4AF37]">
              {isKh ? 'ចំណងដៃ QR CODE' : 'Gift KHQR'}
            </h2>
            <p className="text-xs text-[#8E9299] mt-1">
              {invitation.bankInfo?.note || 'សូមអរគុណយ៉ាងជ្រាលជ្រៅសម្រាប់កាដូចងដៃសិរីមង្គល!'}
            </p>
          </div>

          {/* ABA KHQR Display Box */}
          <div className="p-4 bg-[#0F1115] border border-[#D4AF37]/60 rounded-2xl text-white space-y-3 shadow-lg">
            <span className="text-xs font-bold tracking-wider text-[#D4AF37] uppercase block">
              {invitation.bankInfo?.bankName || 'ABA BANK (KHQR)'}
            </span>
            <div className="w-48 h-48 mx-auto bg-white p-2 rounded-xl border border-[#D4AF37]">
              <img
                src={invitation.bankInfo?.qrImageUrl}
                alt="ABA KHQR Code"
                className="w-full h-full object-cover rounded-lg"
                referrerPolicy="no-referrer"
              />
            </div>
            <p className="font-bold text-sm tracking-wide text-[#F3E5C8]">
              {invitation.bankInfo?.accountName}
            </p>
            <div className="flex items-center justify-center gap-2 bg-[#2A231A] p-2 rounded-xl text-xs font-mono text-[#D4AF37]">
              <span>{invitation.bankInfo?.accountNumber}</span>
              <button
                onClick={handleCopyAccount}
                className="p-1 hover:bg-[#D4AF37]/20 rounded transition-all cursor-pointer"
                title="Copy Account Number"
              >
                {copiedAccount ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* RSVP FORM SECTION */}
      <section id="rsvp-section" className="py-12 px-4 max-w-2xl mx-auto">
        <div className="p-8 rounded-3xl bg-[#241E17] border border-[#D4AF37]/50 shadow-xl space-y-6">
          <div className="text-center">
            <h2 className="text-xl font-bold font-serif text-[#D4AF37]">
              {isKh ? 'សូមបញ្ជាក់ការចូលរួម' : 'RSVP Attendance'}
            </h2>
            <p className="text-xs text-[#8E9299] mt-1">
              {isKh ? 'សូមបញ្ជាក់ការចូលរួមដើម្បីអោយម្ចាស់ដើមការរៀបចំកន្លែង' : 'Please confirm your attendance'}
            </p>
          </div>

          {rsvpSubmitted ? (
            <div className="text-center py-6 space-y-2 animate-in fade-in">
              <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/40">
                <Check className="w-6 h-6" />
              </div>
              <h3 className="text-sm font-bold text-[#F3E5C8] font-serif">
                {isKh ? 'បានបញ្ជាក់ការចូលរួមជោគជ័យ!' : 'RSVP Submitted!'}
              </h3>
              <p className="text-xs text-[#8E9299]">
                {isKh ? 'សូមអរគុណយ៉ាងជ្រាលជ្រៅ!' : 'Thank you so much!'}
              </p>
            </div>
          ) : (
            <form onSubmit={handleRsvpSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#D4AF37] mb-1">
                  {isKh ? 'ឈ្មោះរបស់អ្នក (Your Name)' : 'Your Name'}
                </label>
                <input
                  type="text"
                  required
                  value={rsvpName}
                  onChange={(e) => setRsvpName(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-[#2D2318] bg-[#14100C] text-[#F3E5C8] focus:border-[#D4AF37] outline-none"
                  placeholder="ឧទាហរណ៍៖ លោក ចាន់ សុខ"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#D4AF37] mb-1">
                    {isKh ? 'ការចូលរួម' : 'Attendance'}
                  </label>
                  <select
                    value={rsvpAttendance}
                    onChange={(e) => setRsvpAttendance(e.target.value as any)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-[#2D2318] bg-[#14100C] text-[#F3E5C8] focus:border-[#D4AF37] outline-none"
                  >
                    <option value="attending">{isKh ? 'ចូលរួម (Attending)' : 'Attending'}</option>
                    <option value="declined">{isKh ? 'សុំអភ័យទោស (Declined)' : 'Declined'}</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#D4AF37] mb-1">
                    {isKh ? 'ចំនួនមនុស្ស' : 'Guests Count'}
                  </label>
                  <div className="flex items-center justify-between px-3 py-1.5 rounded-xl border border-[#2D2318] bg-[#14100C]">
                    <button
                      type="button"
                      onClick={() => setRsvpGuests(Math.max(1, rsvpGuests - 1))}
                      className="p-1 rounded bg-[#2A231A] text-[#D4AF37] hover:bg-[#382F23] cursor-pointer"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="text-xs font-bold text-[#F3E5C8]">
                      {rsvpGuests} {isKh ? 'នាក់' : 'guest(s)'}
                    </span>
                    <button
                      type="button"
                      onClick={() => setRsvpGuests(rsvpGuests + 1)}
                      className="p-1 rounded bg-[#2A231A] text-[#D4AF37] hover:bg-[#382F23] cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#AA8B2E] text-[#0F1115] font-bold text-xs shadow-md transition-all flex items-center justify-center gap-1.5 hover:brightness-110 cursor-pointer"
              >
                <Send className="w-3.5 h-3.5 text-[#0F1115]" />
                <span>{isKh ? 'ផ្ញើការឆ្លើយតប (RSVP)' : 'Submit RSVP'}</span>
              </button>
            </form>
          )}
        </div>
      </section>

      {/* GUEST WISHES BOARD SECTION */}
      <section id="wishes-section" className="py-12 px-4 max-w-2xl mx-auto">
        <div className="p-8 rounded-3xl bg-[#241E17] border border-[#D4AF37]/50 shadow-xl space-y-6">
          <div className="text-center">
            <h2 className="text-xl font-bold font-serif text-[#D4AF37]">
              {isKh ? 'សារជូនពរ (WISH)' : 'Guest Wishes Board'}
            </h2>
            <p className="text-xs text-[#8E9299] mt-1">
              {isKh ? 'សូមសរសេរសារជូនពរកូនប្រុសស្រី' : 'Leave your blessings message'}
            </p>
          </div>

          <div className="space-y-3">
            <textarea
              rows={3}
              value={rsvpWishes}
              onChange={(e) => setRsvpWishes(e.target.value)}
              className="w-full p-3 text-xs rounded-xl border border-[#2D2318] bg-[#14100C] text-[#F3E5C8] focus:border-[#D4AF37] outline-none"
              placeholder="សូមជូនពរកូនប្រុសស្រីមានសុភមង្គលរហូតដល់ចាស់តោងកង..."
            />
            <button
              onClick={() => {
                if (rsvpWishes) {
                  const newW = {
                    id: `w-${Date.now()}`,
                    guestName: rsvpName || 'ភ្ញៀវកិត្តិយស',
                    guestCount: 1,
                    attendance: 'attending' as const,
                    phone: '',
                    wishes: rsvpWishes,
                    createdAt: new Date().toISOString(),
                  };
                  setWishesList([newW, ...wishesList]);
                  setRsvpWishes('');
                  confetti({ particleCount: 70, spread: 60 });
                }
              }}
              className="w-full py-2.5 rounded-xl bg-[#2A231A] hover:bg-[#382F23] text-[#D4AF37] border border-[#D4AF37]/40 font-bold text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{isKh ? 'ផ្ញើសារជូនពរ' : 'Post Wish'}</span>
            </button>
          </div>

          {/* Wishes List Feed */}
          <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1 no-scrollbar">
            {wishesList.map((item) => (
              <div
                key={item.id}
                className="p-3.5 rounded-2xl bg-[#14100C] border border-[#2D2318] space-y-1"
              >
                <div className="flex items-center justify-between text-[11px]">
                  <span className="font-bold text-[#D4AF37] font-serif">{item.guestName}</span>
                  <span className="text-[10px] text-[#8E9299]">
                    {new Date(item.createdAt || Date.now()).toLocaleDateString('en-GB')}
                  </span>
                </div>
                <p className="text-xs text-[#E0D0A6] font-serif italic">
                  "{item.wishes}"
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ACKNOWLEDGEMENTS SECTION */}
      <section id="thanks-section" className="py-12 px-4 max-w-2xl mx-auto text-center">
        <div className="p-8 rounded-3xl bg-[#241E17] border border-[#D4AF37]/50 shadow-xl space-y-4">
          <HandHeart className="w-7 h-7 text-[#D4AF37] mx-auto" />
          <h2 className="text-xl font-bold font-serif text-[#D4AF37]">
            {invitation.acknowledgementTitle || (isKh ? 'សូមថ្លែងអំណរគុណ' : 'Acknowledgements')}
          </h2>
          <div className="space-y-3 text-xs text-[#E0D0A6] font-serif border-t border-[#D4AF37]/30 pt-4">
            <p>
              <span className="text-[#D4AF37] font-bold">{isKh ? 'សម្លៀកបំពាក់ និងដេគ័រ ៖ ' : 'Stylist & Decor: '}</span>
              {invitation.decorSponsor || 'Image Hunter / Perfect Studio'}
            </p>
            <p>
              <span className="text-[#D4AF37] font-bold">{isKh ? 'ថតរូប និងវីដេអូ ៖ ' : 'Photography: '}</span>
              {invitation.photographySponsor || 'ក្រុមការងាររៀបចំអាពាហ៍ពិពាហ៍ សុភមង្គល'}
            </p>
          </div>
        </div>
      </section>

      {/* E-THEAP CREATOR BRANDING FOOTER */}
      <footer id="footer-section" className="py-12 px-4 text-center border-t border-[#D4AF37]/30">
        <div className="max-w-md mx-auto space-y-3">
          <div className="w-12 h-12 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37] flex items-center justify-center mx-auto text-[#D4AF37] font-bold font-serif text-lg">
            {invitation.creatorLogoText || 'E'}
          </div>
          <p className="text-xs font-bold text-[#D4AF37] uppercase tracking-widest">
            {invitation.creatorBrandName || 'បង្កើតដោយ E-THEAP'}
          </p>
          <p className="text-[11px] text-[#8E9299]">
            {invitation.creatorDescription || (isKh ? 'យើងខ្ញុំបង្កើតធៀបការឌីជីថល ស្អាត ប្រណិត និងទាន់សម័យ' : 'Luxury Cambodian Digital Wedding Invitations')}
          </p>
          <p className="text-xs font-mono text-[#D4AF37] font-bold">
            {invitation.creatorPhone || '096 739 9063'}
          </p>
        </div>
      </footer>

      {/* FLOATING BOTTOM DOCK NAVBAR (Video Match 100%) */}
      <div className="fixed bottom-3 left-1/2 -translate-x-1/2 z-50 max-w-lg w-[95%] sm:w-auto">
        <div className="bg-[#1D1711]/95 backdrop-blur-md border border-[#D4AF37]/60 rounded-full shadow-2xl px-3 py-2 flex items-center justify-around gap-1 sm:gap-2 text-[10px] text-[#E0D0A6]">
          <button
            onClick={() => scrollToSection('hero-section')}
            className="p-2 rounded-full hover:bg-[#D4AF37]/20 hover:text-[#D4AF37] transition-all cursor-pointer flex flex-col items-center"
            title="Home / Cover"
          >
            <Home className="w-4 h-4 text-[#D4AF37]" />
          </button>

          <button
            onClick={() => scrollToSection('location-section')}
            className="p-2 rounded-full hover:bg-[#D4AF37]/20 hover:text-[#D4AF37] transition-all cursor-pointer flex flex-col items-center"
            title="Location / Map"
          >
            <MapPin className="w-4 h-4 text-[#D4AF37]" />
          </button>

          <button
            onClick={() => scrollToSection('agenda-section')}
            className="p-2 rounded-full hover:bg-[#D4AF37]/20 hover:text-[#D4AF37] transition-all cursor-pointer flex flex-col items-center"
            title="Agenda / Schedule"
          >
            <Calendar className="w-4 h-4 text-[#D4AF37]" />
          </button>

          <button
            onClick={() => scrollToSection('gallery-section')}
            className="p-2 rounded-full hover:bg-[#D4AF37]/20 hover:text-[#D4AF37] transition-all cursor-pointer flex flex-col items-center"
            title="Photo Gallery"
          >
            <ImageIcon className="w-4 h-4 text-[#D4AF37]" />
          </button>

          <button
            onClick={() => scrollToSection('countdown-section')}
            className="p-2 rounded-full hover:bg-[#D4AF37]/20 hover:text-[#D4AF37] transition-all cursor-pointer flex flex-col items-center"
            title="Countdown"
          >
            <Clock className="w-4 h-4 text-[#D4AF37]" />
          </button>

          <button
            onClick={() => scrollToSection('gift-section')}
            className="p-2 rounded-full hover:bg-[#D4AF37]/20 hover:text-[#D4AF37] transition-all cursor-pointer flex flex-col items-center"
            title="ABA Gift KHQR"
          >
            <Gift className="w-4 h-4 text-[#D4AF37]" />
          </button>

          <button
            onClick={() => scrollToSection('rsvp-section')}
            className="p-2 rounded-full hover:bg-[#D4AF37]/20 hover:text-[#D4AF37] transition-all cursor-pointer flex flex-col items-center"
            title="RSVP Attendance"
          >
            <UserCheck className="w-4 h-4 text-[#D4AF37]" />
          </button>

          <button
            onClick={() => scrollToSection('wishes-section')}
            className="p-2 rounded-full hover:bg-[#D4AF37]/20 hover:text-[#D4AF37] transition-all cursor-pointer flex flex-col items-center"
            title="Wishes"
          >
            <Smile className="w-4 h-4 text-[#D4AF37]" />
          </button>

          <button
            onClick={() => scrollToSection('thanks-section')}
            className="p-2 rounded-full hover:bg-[#D4AF37]/20 hover:text-[#D4AF37] transition-all cursor-pointer flex flex-col items-center"
            title="Acknowledgements"
          >
            <HandHeart className="w-4 h-4 text-[#D4AF37]" />
          </button>
        </div>
      </div>
    </div>
  );
};

