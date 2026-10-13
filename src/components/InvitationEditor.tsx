import React, { useState, useRef } from 'react';
import { useThemeLanguage } from '../context/ThemeLanguageContext';
import { presetMusicTracks, defaultProgramItems } from '../data/mockData';
import { ProgramItem, GalleryItem, MusicTrack, GuestRecordItem } from '../types';
import { getYouTubeEmbedUrl, getYouTubeVideoId } from '../utils/youtube';
import {
  Users,
  Calendar,
  MapPin,
  Music,
  Image,
  Palette,
  CreditCard,
  Share2,
  Plus,
  Trash2,
  Sparkles,
  Check,
  Copy,
  ExternalLink,
  MessageSquare,
  Clock,
  Video,
  HandHeart,
  Upload,
  Save,
  Search,
  Download,
  Send,
  Edit2,
  X,
  Filter,
  CheckCircle2,
  ListPlus,
  Phone,
  UserPlus,
  FileSpreadsheet,
  Play,
  Pause,
  Volume2,
  VolumeX,
  ListMusic,
  Link,
} from 'lucide-react';

export const InvitationEditor: React.FC = () => {
  const { invitation, updateInvitation, language, setIsAiModalOpen, setIsPreviewOpen } =
    useThemeLanguage();

  const [activeSubTab, setActiveSubTab] = useState<
    'couple' | 'date_venue' | 'speech' | 'agenda' | 'media' | 'theme' | 'bank' | 'credits' | 'guest_link'
  >('couple');

  const [customGuestInput, setCustomGuestInput] = useState('សម្តេច ទ្រង់ ឯកឧត្តម លោកជំទាវ');
  const [copiedLink, setCopiedLink] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Guest Manager States
  const [guestSearch, setGuestSearch] = useState('');
  const [guestCategoryFilter, setGuestCategoryFilter] = useState<string>('all');
  const [guestStatusFilter, setGuestStatusFilter] = useState<string>('all');

  const [newGuestName, setNewGuestName] = useState('');
  const [newGuestPhone, setNewGuestPhone] = useState('');
  const [newGuestCategory, setNewGuestCategory] = useState<NonNullable<GuestRecordItem['category']> >('general');
  const [newGuestCount, setNewGuestCount] = useState<number>(1);
  const [newGuestNotes, setNewGuestNotes] = useState('');
  const [editingGuestId, setEditingGuestId] = useState<string | null>(null);

  const [showBulkImport, setShowBulkImport] = useState(false);
  const [bulkNamesInput, setBulkNamesInput] = useState('');
  const [bulkCategory, setBulkCategory] = useState<NonNullable<GuestRecordItem['category']> >('general');

  const [copiedGuestId, setCopiedGuestId] = useState<string | null>(null);
  const [copiedAllLinks, setCopiedAllLinks] = useState(false);

  // Custom Music Track Manager States
  const [showAddUrlMusic, setShowAddUrlMusic] = useState(false);
  const [customMusicUrl, setCustomMusicUrl] = useState('');
  const [customMusicTitle, setCustomMusicTitle] = useState('');
  const [customMusicArtist, setCustomMusicArtist] = useState('');
  const [editingTrackId, setEditingTrackId] = useState<string | null>(null);
  const [editTrackTitle, setEditTrackTitle] = useState('');
  const [editTrackArtist, setEditTrackArtist] = useState('');
  const [playingTrackId, setPlayingTrackId] = useState<string | null>(null);
  const audioPreviewRef = useRef<HTMLAudioElement | null>(null);

  const isKh = language === 'kh';

  // Category helper
  const getCategoryName = (cat?: string) => {
    switch (cat) {
      case 'groom_family':
        return isKh ? 'សាច់ញាតិខាងប្រុស' : "Groom's Family";
      case 'bride_family':
        return isKh ? 'សាច់ញាតិខាងស្រី' : "Bride's Family";
      case 'friends':
        return isKh ? 'មិត្តភក្តិ' : 'Friends';
      case 'colleagues':
        return isKh ? 'សហការី' : 'Colleagues';
      case 'vip':
        return isKh ? 'ភ្ញៀវកិត្តិយស VIP' : 'VIP Guests';
      default:
        return isKh ? 'ភ្ញៀវទូទៅ' : 'General Guests';
    }
  };

  // Helper to generate guest url
  const getGuestLink = (guestName: string) => {
    return `${window.location.origin}?invitation=${invitation.slug}&guest=${encodeURIComponent(guestName)}`;
  };

  // Add / Edit Single Guest Handler
  const handleAddSingleGuest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGuestName.trim()) return;
    const currentList = invitation.guestList || [];

    if (editingGuestId) {
      const updated = currentList.map((item) =>
        item.id === editingGuestId
          ? {
              ...item,
              name: newGuestName.trim(),
              phone: newGuestPhone.trim(),
              category: newGuestCategory,
              guestCount: newGuestCount,
              notes: newGuestNotes.trim(),
            }
          : item
      );
      updateInvitation({ guestList: updated });
      setEditingGuestId(null);
    } else {
      const newRecord: GuestRecordItem = {
        id: 'g-' + Date.now() + '-' + Math.random().toString(36).substr(2, 4),
        name: newGuestName.trim(),
        phone: newGuestPhone.trim(),
        category: newGuestCategory,
        guestCount: newGuestCount,
        notes: newGuestNotes.trim(),
        status: 'pending',
        createdAt: new Date().toISOString(),
      };
      updateInvitation({ guestList: [newRecord, ...currentList] });
    }

    setNewGuestName('');
    setNewGuestPhone('');
    setNewGuestCount(1);
    setNewGuestNotes('');
  };

  // Start Editing Guest
  const handleStartEditGuest = (guest: GuestRecordItem) => {
    setEditingGuestId(guest.id);
    setNewGuestName(guest.name);
    setNewGuestPhone(guest.phone || '');
    setNewGuestCategory(guest.category || 'general');
    setNewGuestCount(guest.guestCount || 1);
    setNewGuestNotes(guest.notes || '');
  };

  // Cancel Editing Guest
  const handleCancelEditGuest = () => {
    setEditingGuestId(null);
    setNewGuestName('');
    setNewGuestPhone('');
    setNewGuestCount(1);
    setNewGuestNotes('');
  };

  // Bulk Add Guests ( unlimited )
  const handleBulkAddGuests = () => {
    if (!bulkNamesInput.trim()) return;
    const rawLines = bulkNamesInput
      .split('\n')
      .map((l) => l.trim())
      .filter(Boolean);
    if (rawLines.length === 0) return;

    const currentList = invitation.guestList || [];
    const newItems: GuestRecordItem[] = rawLines.map((nameStr, idx) => ({
      id: 'gbulk-' + Date.now() + '-' + idx + '-' + Math.random().toString(36).substr(2, 3),
      name: nameStr,
      category: bulkCategory,
      guestCount: 1,
      status: 'pending',
      createdAt: new Date().toISOString(),
    }));

    updateInvitation({ guestList: [...newItems, ...currentList] });
    setBulkNamesInput('');
    setShowBulkImport(false);
  };

  // Delete Guest
  const handleDeleteGuest = (id: string) => {
    const currentList = invitation.guestList || [];
    updateInvitation({ guestList: currentList.filter((g) => g.id !== id) });
  };

  // Clear All Guests
  const handleClearAllGuests = () => {
    if (
      window.confirm(
        isKh
          ? 'តើអ្នកពិតជាចង់លុបបញ្ជីឈ្មោះភ្ញៀវទាំងអស់មែនទេ?'
          : 'Are you sure you want to clear the entire guest list?'
      )
    ) {
      updateInvitation({ guestList: [] });
    }
  };

  // Toggle Guest Status
  const handleToggleGuestStatus = (id: string) => {
    const currentList = invitation.guestList || [];
    const updated = currentList.map((g) =>
      g.id === id ? { ...g, status: (g.status === 'sent' ? 'pending' : 'sent') as any } : g
    );
    updateInvitation({ guestList: updated });
  };

  // Copy Single Link
  const handleCopySingleGuestLink = (guestId: string, guestName: string) => {
    const url = getGuestLink(guestName);
    navigator.clipboard.writeText(url);
    setCopiedGuestId(guestId);
    setTimeout(() => setCopiedGuestId(null), 2000);
  };

  // Telegram Direct Share
  const handleShareTelegram = (guestName: string) => {
    const link = getGuestLink(guestName);
    const msg = `សូមគោរពអញ្ជើញ ${guestName} ចូលរួមពិធីអាពាហ៍ពិពាហ៍របស់យើងខ្ញុំ! ចូលមើលធៀបការឌីជីថល៖\n${link}`;
    const telegramUrl = `https://t.me/share/url?url=${encodeURIComponent(link)}&text=${encodeURIComponent(msg)}`;
    window.open(telegramUrl, '_blank');
  };

  // Export CSV File
  const handleExportCSV = () => {
    const list = invitation.guestList || [];
    if (list.length === 0) return;
    let csvContent = 'data:text/csv;charset=utf-8,\uFEFF';
    csvContent += 'លេខ,ឈ្មោះភ្ញៀវ,ក្រុម/ប្រភេទ,លេខទូរស័ព្ទ,ចំនួនកៅអី,ស្ថានភាព,តំណភ្ជាប់រៀបការ\n';
    list.forEach((g, idx) => {
      const link = getGuestLink(g.name);
      const catName = getCategoryName(g.category);
      const statusStr = g.status === 'sent' ? 'បានផ្ញើរួច' : 'មិនទាន់ផ្ញើ';
      csvContent += `${idx + 1},"${g.name}","${catName}","${g.phone || ''}",${g.guestCount || 1},"${statusStr}","${link}"\n`;
    });
    const encodedUri = encodeURI(csvContent);
    const downloadLink = document.createElement('a');
    downloadLink.setAttribute('href', encodedUri);
    downloadLink.setAttribute('download', ` wedding_guest_list_${invitation.slug}.csv`);
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  };

  // Copy All Links
  const handleCopyAllLinks = () => {
    const list = invitation.guestList || [];
    if (list.length === 0) return;
    const formatted = list
      .map((g, idx) => `${idx + 1}. ${g.name}: ${getGuestLink(g.name)}`)
      .join('\n');
    navigator.clipboard.writeText(formatted);
    setCopiedAllLinks(true);
    setTimeout(() => setCopiedAllLinks(false), 2500);
  };

  const handleSave = () => {
    setSaveSuccess(true);
    setTimeout(() => {
      setSaveSuccess(false);
    }, 2500);
  };

  // Venue Image File Upload Handler
  const handleVenueImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          updateInvitation({ venueImage: reader.result });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const renderSaveFooterBar = (sectionNameKh: string, sectionNameEn: string) => (
    <div className="pt-6 border-t border-[#2D3139] flex flex-col sm:flex-row items-center justify-between gap-4 mt-8">
      <div className="flex items-center gap-2 text-xs text-[#8E9299]">
        <Check className="w-4 h-4 text-emerald-400" />
        <span>
          {isKh
            ? `ទិន្នន័យផ្នែក "${sectionNameKh}" ត្រូវបានរក្សាទុកស្វ័យប្រវត្តិ`
            : `Section "${sectionNameEn}" settings automatically saved`}
        </span>
      </div>

      <button
        type="button"
        onClick={handleSave}
        className={`w-full sm:w-auto px-6 py-2.5 rounded-xl font-bold text-xs transition-all shadow-lg flex items-center justify-center gap-2 ${
          saveSuccess
            ? 'bg-emerald-500 text-white border border-emerald-400'
            : 'bg-[#D4AF37] hover:brightness-110 text-[#0F1115] border border-[#D4AF37]'
        }`}
      >
        {saveSuccess ? (
          <>
            <Check className="w-4 h-4 text-white" />
            <span>{isKh ? 'រក្សាទុកបានជោគជ័យ!' : 'Saved Successfully!'}</span>
          </>
        ) : (
          <>
            <Save className="w-4 h-4" />
            <span>{isKh ? 'រក្សាទុកទិន្នន័យ (Save Changes)' : 'Save Changes'}</span>
          </>
        )}
      </button>
    </div>
  );

  // Agenda Program Item Handlers
  const currentProgramItems = invitation.programItems || defaultProgramItems;

  const handleAddProgramItem = (dayNumber: number) => {
    const newItem: ProgramItem = {
      id: `prog-${Date.now()}`,
      day: dayNumber,
      dateStr: dayNumber === 1 ? 'ថ្ងៃទី១៣ ខែមករា ឆ្នាំ២០២៧' : 'ថ្ងៃទី១៤ ខែមករា ឆ្នាំ២០២៧',
      time: '០៧:៣០ នាទីព្រឹក',
      title: 'កម្មវិធីមង្គលការថ្មី',
      description: 'ពិពណ៌នាកម្មវិធីអាពាហ៍ពិពាហ៍',
      icon: 'rings',
    };
    updateInvitation({ programItems: [...currentProgramItems, newItem] });
  };

  const handleUpdateProgramItem = (id: string, updatedFields: Partial<ProgramItem>) => {
    const updatedList = currentProgramItems.map((item) =>
      item.id === id ? { ...item, ...updatedFields } : item
    );
    updateInvitation({ programItems: updatedList });
  };

  const handleDeleteProgramItem = (id: string) => {
    const updatedList = currentProgramItems.filter((item) => item.id !== id);
    updateInvitation({ programItems: updatedList });
  };

  // Media File Upload Handlers (Cover, Gallery, Audio MP3, Bank QR)
  const handleCoverUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        updateInvitation({ coverImage: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGalleryUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const newItems: GalleryItem[] = [];
      let loadedCount = 0;
      Array.from(files).forEach((file: File) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          newItems.push({
            id: `photo-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
            url: reader.result as string,
            caption: 'រូបថតអាពាហ៍ពិពាហ៍',
          });
          loadedCount++;
          if (loadedCount === files.length) {
            updateInvitation({ gallery: [...(invitation.gallery || []), ...newItems] });
          }
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const handleAudioFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const fileList: File[] = Array.from(files);
      const newTracks: MusicTrack[] = [];
      let loadedCount = 0;

      fileList.forEach((file: File, index: number) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          const track: MusicTrack = {
            id: `custom-mp3-${Date.now()}-${index}-${Math.random().toString(36).substring(2, 5)}`,
            title: file.name.replace(/\.[^/.]+$/, ''),
            artist: 'បទចម្រៀងអាប់ឡូត',
            url: reader.result as string,
            isPreset: false,
          };
          newTracks.push(track);
          loadedCount++;

          if (loadedCount === fileList.length) {
            const currentCustom = invitation.customMusicTracks || [];
            const updatedCustom = [...currentCustom, ...newTracks];
            updateInvitation({
              customMusicTracks: updatedCustom,
              backgroundMusic: newTracks[0] || invitation.backgroundMusic,
            });
          }
        };
        reader.readAsDataURL(file);
      });
      e.target.value = '';
    }
  };

  const handleAddCustomUrlTrack = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customMusicUrl.trim()) return;
    const newTrack: MusicTrack = {
      id: `custom-url-${Date.now()}`,
      title: customMusicTitle.trim() || 'បទចម្រៀងផ្ទាល់ខ្លួន',
      artist: customMusicArtist.trim() || 'Custom MP3 Link',
      url: customMusicUrl.trim(),
      isPreset: false,
    };
    const currentCustom = invitation.customMusicTracks || [];
    const updatedCustom = [...currentCustom, newTrack];
    updateInvitation({
      customMusicTracks: updatedCustom,
      backgroundMusic: newTrack,
    });
    setCustomMusicUrl('');
    setCustomMusicTitle('');
    setCustomMusicArtist('');
    setShowAddUrlMusic(false);
  };

  const handleDeleteCustomTrack = (trackId: string) => {
    const currentCustom = invitation.customMusicTracks || [];
    const updatedCustom = currentCustom.filter((t) => t.id !== trackId);
    let nextActive = invitation.backgroundMusic;
    if (invitation.backgroundMusic?.id === trackId) {
      nextActive = updatedCustom[0] || presetMusicTracks[0];
    }
    updateInvitation({
      customMusicTracks: updatedCustom,
      backgroundMusic: nextActive,
    });
  };

  const handleSaveEditedTrack = (trackId: string) => {
    const currentCustom = invitation.customMusicTracks || [];
    const updatedCustom = currentCustom.map((t) =>
      t.id === trackId
        ? {
            ...t,
            title: editTrackTitle.trim() || t.title,
            artist: editTrackArtist.trim() || t.artist,
          }
        : t
    );
    let updatedActive = invitation.backgroundMusic;
    if (invitation.backgroundMusic?.id === trackId) {
      updatedActive = {
        ...invitation.backgroundMusic,
        title: editTrackTitle.trim() || invitation.backgroundMusic.title,
        artist: editTrackArtist.trim() || invitation.backgroundMusic.artist,
      };
    }
    updateInvitation({
      customMusicTracks: updatedCustom,
      backgroundMusic: updatedActive,
    });
    setEditingTrackId(null);
  };

  const togglePlayTrackPreview = (trackUrl: string, trackId: string) => {
    if (playingTrackId === trackId) {
      if (audioPreviewRef.current) {
        audioPreviewRef.current.pause();
      }
      setPlayingTrackId(null);
    } else {
      if (audioPreviewRef.current) {
        audioPreviewRef.current.pause();
      }
      const newAudio = new Audio(trackUrl);
      audioPreviewRef.current = newAudio;
      newAudio
        .play()
        .then(() => {
          setPlayingTrackId(trackId);
        })
        .catch((err) => {
          console.warn('Audio preview error:', err);
          setPlayingTrackId(null);
        });
      newAudio.onended = () => {
        setPlayingTrackId(null);
      };
    }
  };

  const handleQrUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        updateInvitation({
          bankInfo: {
            ...(invitation.bankInfo || { bankName: 'ABA Bank', accountName: '', accountNumber: '' }),
            qrImageUrl: reader.result as string,
          },
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCoupleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        updateInvitation({
          coupleLogoImage: reader.result as string,
          showCoupleLogoImage: true,
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleEnvelopeBgUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        updateInvitation({ envelopeBgImage: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleEnvelopeBgVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        updateInvitation({ envelopeBgVideo: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCoverPhotoVerticalUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        updateInvitation({ coverPhotoVertical: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCoverVideoVerticalUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        updateInvitation({ coverVideoVertical: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCustomFrameUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        updateInvitation({ customFrameImage: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const shareableUrl = `${window.location.origin}?invitation=${invitation.slug}&guest=${encodeURIComponent(
    customGuestInput
  )}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareableUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Editor Main Header Banner */}
      <div className="mb-8 p-6 rounded-3xl bg-[#1A1D23] border border-[#2D3139] text-[#E0E0E0] shadow-xl flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#D4AF37]/15 text-[#D4AF37] border border-[#D4AF37]/30 text-xs font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>{isKh ? 'កែសម្រួលធៀបការ ឌីជីថល Bento Grid' : 'Digital Wedding Editor'}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold font-serif text-[#E0E0E0]">
            {invitation.title || 'អាពាហ៍ពិពាហ៍កូនប្រុសស្រី'}
          </h1>
          <p className="text-xs sm:text-sm text-[#8E9299] mt-1 max-w-xl">
            {isKh
              ? 'កែសម្រួលព័ត៌មានកូនប្រុសស្រី អាណាព្យាបាល កាលបរិច្ឆេទ កម្មវិធីការ និងស្ទីលប្រណិតៗបានតាមចិត្ត'
              : 'Customize couple details, parents, dates, agenda schedule, music, and luxury themes'}
          </p>
        </div>

        <div className="flex items-center gap-3 relative z-10 shrink-0">
          <button
            type="button"
            onClick={handleSave}
            className={`px-4 py-2.5 rounded-xl font-bold text-xs transition-all shadow-md flex items-center gap-2 border ${
              saveSuccess
                ? 'bg-emerald-600 text-white border-emerald-400'
                : 'bg-emerald-600 hover:bg-emerald-500 text-white border-emerald-500'
            }`}
          >
            {saveSuccess ? <Check className="w-4 h-4 text-white" /> : <Save className="w-4 h-4 text-emerald-100" />}
            <span>{saveSuccess ? (isKh ? 'បានរក្សាទុក!' : 'Saved!') : (isKh ? 'រក្សាទុកទិន្នន័យ' : 'Save')}</span>
          </button>

          <button
            onClick={() => setIsAiModalOpen(true)}
            className="px-4 py-2.5 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-semibold text-xs transition-all border border-purple-500/40 shadow-md flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4 text-amber-200 animate-pulse" />
            <span>{isKh ? 'AI ជួយសរសេរ' : 'AI Writer'}</span>
          </button>

          <button
            onClick={() => setIsPreviewOpen(true)}
            className="px-4 py-2.5 rounded-xl bg-[#D4AF37] text-[#0F1115] font-bold text-xs hover:brightness-110 transition-all shadow-md flex items-center gap-2"
          >
            <ExternalLink className="w-4 h-4 text-[#0F1115]" />
            <span>{isKh ? 'មើល Live Preview' : 'Live Preview'}</span>
          </button>
        </div>
      </div>

      {/* Editor Multi-Tab Navigation Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 no-scrollbar">
        <button
          onClick={() => setActiveSubTab('couple')}
          className={`px-4 py-2.5 rounded-2xl text-xs font-semibold shrink-0 transition-all flex items-center gap-2 border ${
            activeSubTab === 'couple'
              ? 'bg-[#D4AF37] text-[#0F1115] border-[#D4AF37] font-bold shadow-md'
              : 'bg-[#1A1D23] border-[#2D3139] text-[#8E9299] hover:text-[#E0E0E0] hover:border-[#D4AF37]/50'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>{isKh ? 'សាម៉ីខ្លួន & អាណាព្យាបាល' : 'Couple & Parents'}</span>
        </button>

        <button
          onClick={() => setActiveSubTab('date_venue')}
          className={`px-4 py-2.5 rounded-2xl text-xs font-semibold shrink-0 transition-all flex items-center gap-2 border ${
            activeSubTab === 'date_venue'
              ? 'bg-[#D4AF37] text-[#0F1115] border-[#D4AF37] font-bold shadow-md'
              : 'bg-[#1A1D23] border-[#2D3139] text-[#8E9299] hover:text-[#E0E0E0] hover:border-[#D4AF37]/50'
          }`}
        >
          <Calendar className="w-4 h-4" />
          <span>{isKh ? 'ថ្ងៃខែ & ទីតាំង' : 'Date & Venue'}</span>
        </button>

        <button
          onClick={() => setActiveSubTab('speech')}
          className={`px-4 py-2.5 rounded-2xl text-xs font-semibold shrink-0 transition-all flex items-center gap-2 border ${
            activeSubTab === 'speech'
              ? 'bg-[#D4AF37] text-[#0F1115] border-[#D4AF37] font-bold shadow-md'
              : 'bg-[#1A1D23] border-[#2D3139] text-[#8E9299] hover:text-[#E0E0E0] hover:border-[#D4AF37]/50'
          }`}
        >
          <MessageSquare className="w-4 h-4" />
          <span>{isKh ? 'លិខិតអញ្ជើញ' : 'Formal Speech'}</span>
        </button>

        <button
          onClick={() => setActiveSubTab('agenda')}
          className={`px-4 py-2.5 rounded-2xl text-xs font-semibold shrink-0 transition-all flex items-center gap-2 border ${
            activeSubTab === 'agenda'
              ? 'bg-[#D4AF37] text-[#0F1115] border-[#D4AF37] font-bold shadow-md'
              : 'bg-[#1A1D23] border-[#2D3139] text-[#8E9299] hover:text-[#E0E0E0] hover:border-[#D4AF37]/50'
          }`}
        >
          <Clock className="w-4 h-4" />
          <span>{isKh ? 'របៀបវារៈកម្មវិធី' : 'Schedule Agenda'}</span>
        </button>

        <button
          onClick={() => setActiveSubTab('media')}
          className={`px-4 py-2.5 rounded-2xl text-xs font-semibold shrink-0 transition-all flex items-center gap-2 border ${
            activeSubTab === 'media'
              ? 'bg-[#D4AF37] text-[#0F1115] border-[#D4AF37] font-bold shadow-md'
              : 'bg-[#1A1D23] border-[#2D3139] text-[#8E9299] hover:text-[#E0E0E0] hover:border-[#D4AF37]/50'
          }`}
        >
          <Image className="w-4 h-4" />
          <span>{isKh ? 'រូបថត តន្ត្រី & វីដេអូ' : 'Media & Music'}</span>
        </button>

        <button
          onClick={() => setActiveSubTab('theme')}
          className={`px-4 py-2.5 rounded-2xl text-xs font-semibold shrink-0 transition-all flex items-center gap-2 border ${
            activeSubTab === 'theme'
              ? 'bg-[#D4AF37] text-[#0F1115] border-[#D4AF37] font-bold shadow-md'
              : 'bg-[#1A1D23] border-[#2D3139] text-[#8E9299] hover:text-[#E0E0E0] hover:border-[#D4AF37]/50'
          }`}
        >
          <Palette className="w-4 h-4" />
          <span>{isKh ? 'ពណ៌ & ពុម្ពអក្សរ' : 'Theme & Fonts'}</span>
        </button>

        <button
          onClick={() => setActiveSubTab('bank')}
          className={`px-4 py-2.5 rounded-2xl text-xs font-semibold shrink-0 transition-all flex items-center gap-2 border ${
            activeSubTab === 'bank'
              ? 'bg-[#D4AF37] text-[#0F1115] border-[#D4AF37] font-bold shadow-md'
              : 'bg-[#1A1D23] border-[#2D3139] text-[#8E9299] hover:text-[#E0E0E0] hover:border-[#D4AF37]/50'
          }`}
        >
          <CreditCard className="w-4 h-4" />
          <span>{isKh ? 'ចងដៃ & ABA QR' : 'Gift & ABA QR'}</span>
        </button>

        <button
          onClick={() => setActiveSubTab('credits')}
          className={`px-4 py-2.5 rounded-2xl text-xs font-semibold shrink-0 transition-all flex items-center gap-2 border ${
            activeSubTab === 'credits'
              ? 'bg-[#D4AF37] text-[#0F1115] border-[#D4AF37] font-bold shadow-md'
              : 'bg-[#1A1D23] border-[#2D3139] text-[#8E9299] hover:text-[#E0E0E0] hover:border-[#D4AF37]/50'
          }`}
        >
          <HandHeart className="w-4 h-4 text-amber-400" />
          <span>{isKh ? 'ថ្លែងអំណរគុណ & អ្នកបង្កើត' : 'Credits & Branding'}</span>
        </button>

        <button
          onClick={() => setActiveSubTab('guest_link')}
          className={`px-4 py-2.5 rounded-2xl text-xs font-semibold shrink-0 transition-all flex items-center gap-2 border ${
            activeSubTab === 'guest_link'
              ? 'bg-[#D4AF37] text-[#0F1115] border-[#D4AF37] font-bold shadow-md'
              : 'bg-[#1A1D23] border-[#2D3139] text-[#8E9299] hover:text-[#E0E0E0] hover:border-[#D4AF37]/50'
          }`}
        >
          <Share2 className="w-4 h-4 text-purple-400" />
          <span>{isKh ? 'បង្កើតលីងភ្ញៀវ' : 'Guest Personal Link'}</span>
        </button>
      </div>

      {/* Editor Section Panels */}
      <div className="bg-[#1A1D23] rounded-3xl p-6 sm:p-8 border border-[#2D3139] shadow-lg text-[#E0E0E0]">
        {/* TAB 1: COUPLE & PARENTS */}
        {activeSubTab === 'couple' && (
          <div className="space-y-6">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white font-serif border-b pb-3 border-slate-100 dark:border-slate-800">
              {isKh ? 'ព័ត៌មានអាណាព្យាបាល និងសាម៉ីខ្លួន' : 'Parents & Couple Information'}
            </h2>

            {/* Header Monogram Logo & Greeting Title (កន្លែង ឝ - ឡូហ្គោ និងចំណងជើងក្បាលធៀប) */}
            <div className="p-5 rounded-2xl bg-amber-500/10 border border-amber-500/40 space-y-4">
              {/* Monogram Symbol / Logo Upload */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold text-amber-800 dark:text-amber-300 uppercase tracking-wider">
                    {isKh ? 'កន្លែង ឝ - អក្សរឡូហ្គោ ឬ អាប់ឡូតរូបភាពឡូហ្គោ (Monogram Symbol / Upload Logo)' : 'Logo / Monogram Badge'}
                  </label>
                  {invitation.coupleLogoImage && (
                    <button
                      type="button"
                      onClick={() => updateInvitation({ coupleLogoImage: '' })}
                      className="text-xs text-red-500 hover:text-red-700 font-bold flex items-center gap-1 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>{isKh ? 'លុបរូបឡូហ្គោ' : 'Remove Logo'}</span>
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Monogram Text Input (e.g., ឝ) */}
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300">
                      {isKh ? '១. កែប្រែអក្សរឡូហ្គោ (Symbol):' : '1. Monogram Symbol:'}
                    </label>
                    <div className="flex items-center gap-2">
                      <span className="text-xl font-serif text-amber-500 font-bold px-3 py-1.5 bg-amber-500/20 rounded-xl border border-amber-500/40 shrink-0">
                        {invitation.monogramText || 'ឝ'}
                      </span>
                      <input
                        type="text"
                        value={invitation.monogramText ?? 'ឝ'}
                        onChange={(e) => updateInvitation({ monogramText: e.target.value })}
                        className="w-full px-3 py-2 text-xs font-bold rounded-xl border border-amber-300 dark:border-amber-700 bg-white dark:bg-slate-900 dark:text-white"
                        placeholder="ឝ"
                      />
                    </div>
                  </div>

                  {/* Logo Image Upload Button */}
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300">
                      {isKh ? '២. ឬអាប់ឡូតរូបភាព ឡូហ្គោ:' : '2. Or Upload Logo Image:'}
                    </label>
                    <div className="flex gap-2">
                      <label className="px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer shrink-0 shadow-xs">
                        <Upload className="w-4 h-4" />
                        <span>{isKh ? 'អាប់ឡូត' : 'Upload'}</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleCoupleLogoUpload}
                          className="hidden"
                        />
                      </label>
                      <input
                        type="url"
                        value={invitation.coupleLogoImage || ''}
                        onChange={(e) => updateInvitation({ coupleLogoImage: e.target.value, showCoupleLogoImage: true })}
                        placeholder="https://... (URL រូបឡូហ្គោ)"
                        className="w-full px-3 py-2 text-xs rounded-xl border border-amber-300 dark:border-amber-700 bg-white dark:bg-slate-900 font-mono dark:text-white"
                      />
                    </div>
                  </div>
                </div>

                {/* Logo Preview */}
                {invitation.coupleLogoImage && (
                  <div className="mt-2 p-2 bg-black/40 rounded-2xl border border-amber-500/30 text-center max-w-xs mx-auto">
                    <p className="text-[10px] text-amber-400 font-bold mb-1">{isKh ? 'រូបភាពឡូហ្គោដែលបានកំណត់:' : 'Active Logo:'}</p>
                    <img
                      src={invitation.coupleLogoImage}
                      alt="Logo Preview"
                      className="max-h-20 object-contain mx-auto filter drop-shadow-[0_2px_8px_rgba(212,175,55,0.4)]"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                )}
              </div>

              {/* Header Greeting Title */}
              <div className="pt-3 border-t border-amber-500/20 space-y-1.5">
                <label className="block text-xs font-bold text-amber-700 dark:text-amber-400">
                  {isKh ? 'ចំណងជើងក្បាលធៀប (Header Greeting Banner Title)' : 'Header Greeting Banner Title'}
                </label>
                <input
                  type="text"
                  value={invitation.greetingHeaderTitle ?? 'សិរីសួស្តីអាពាហ៍ពិពាហ៍'}
                  onChange={(e) => updateInvitation({ greetingHeaderTitle: e.target.value })}
                  className="w-full px-3.5 py-2 text-sm font-bold rounded-xl border border-amber-400 dark:border-amber-600 bg-white dark:bg-slate-900 dark:text-white"
                  placeholder="សិរីសួស្តីអាពាហ៍ពិពាហ៍"
                />
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  {isKh
                    ? 'អត្ថបទក្បាលធៀបបង្ហាញខាងលើគេបង្អស់ (ឧទាហរណ៍៖ សិរីសួស្តីអាពាហ៍ពិពាហ៍, ពិធីភ្ជាប់ពាក្យ, សិរីមង្គលអាពាហ៍ពិពាហ៍)'
                    : 'Header text shown at top of the cover card (e.g. សិរីសួស្តីអាពាហ៍ពិពាហ៍, ពិធីភ្ជាប់ពាក្យ)'}
                </p>
              </div>
            </div>

            {/* Open Envelope Background Image & Video (រូបភាព ឬ វីដេអូ ផ្ទៃខាងក្រោយ បើកធៀបការ) */}
            <div className="p-5 rounded-2xl bg-amber-500/10 border border-amber-500/40 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-amber-500/20 pb-2">
                <label className="block text-xs font-bold text-amber-800 dark:text-amber-300 uppercase tracking-wider">
                  {isKh ? 'ផ្ទៃខាងក្រោយ បើកធៀបការ - រូបភាព ឬ វីដេអូ (Open Invitation Envelope Background)' : 'Open Envelope Background (Image / Video)'}
                </label>
                <div className="flex items-center gap-2">
                  {invitation.envelopeBgVideo && (
                    <button
                      type="button"
                      onClick={() => updateInvitation({ envelopeBgVideo: '' })}
                      className="text-xs text-red-500 hover:text-red-700 font-bold flex items-center gap-1 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>{isKh ? 'លុបវីដេអូ' : 'Remove Video'}</span>
                    </button>
                  )}
                  {invitation.envelopeBgImage && (
                    <button
                      type="button"
                      onClick={() => updateInvitation({ envelopeBgImage: '' })}
                      className="text-xs text-red-500 hover:text-red-700 font-bold flex items-center gap-1 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>{isKh ? 'លុបរូបភាព' : 'Remove Image'}</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Option 1: Background Image */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-amber-800 dark:text-amber-300 flex items-center gap-1.5">
                  <Upload className="w-3.5 h-3.5 text-amber-600" />
                  <span>{isKh ? '១. រូបភាពផ្ទៃខាងក្រោយ (Background Image):' : '1. Background Image:'}</span>
                </span>
                <div className="flex flex-col sm:flex-row gap-2">
                  <label className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer shrink-0 shadow-xs">
                    <Upload className="w-4 h-4" />
                    <span>{isKh ? 'ជ្រើសរើសរូបភាព' : 'Choose Image'}</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleEnvelopeBgUpload}
                      className="hidden"
                    />
                  </label>
                  <input
                    type="url"
                    value={invitation.envelopeBgImage || ''}
                    onChange={(e) => updateInvitation({ envelopeBgImage: e.target.value })}
                    placeholder="https://... (URL រូបភាព)"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-amber-300 dark:border-amber-700 bg-white dark:bg-slate-900 font-mono dark:text-white"
                  />
                </div>
              </div>

              {/* Option 2: Background Video */}
              <div className="space-y-2 pt-2 border-t border-amber-500/20">
                <span className="text-xs font-bold text-amber-800 dark:text-amber-300 flex items-center gap-1.5">
                  <Video className="w-3.5 h-3.5 text-purple-600" />
                  <span>{isKh ? '២. វីដេអូផ្ទៃខាងក្រោយ (Background Video - MP4/WebM):' : '2. Background Video:'}</span>
                </span>
                <div className="flex flex-col sm:flex-row gap-2">
                  <label className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer shrink-0 shadow-xs">
                    <Upload className="w-4 h-4" />
                    <span>{isKh ? 'អាប់ឡូតវីដេអូ' : 'Upload Video'}</span>
                    <input
                      type="file"
                      accept="video/*"
                      onChange={handleEnvelopeBgVideoUpload}
                      className="hidden"
                    />
                  </label>
                  <input
                    type="url"
                    value={invitation.envelopeBgVideo || ''}
                    onChange={(e) => updateInvitation({ envelopeBgVideo: e.target.value })}
                    placeholder="https://... (URL វីដេអូ MP4/WebM)"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-amber-300 dark:border-amber-700 bg-white dark:bg-slate-900 font-mono dark:text-white"
                  />
                </div>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 italic">
                  * ប្រសិនបើមានអាប់ឡូតវីដេអូ វានឹងរត់ជា motion ផ្ទៃខាងក្រោយយ៉ាងស្អាតលើផ្ទាំង "បើកធៀបការ"
                </p>
              </div>

              {/* Live Preview Card */}
              {invitation.envelopeBgVideo || invitation.envelopeBgImage ? (
                <div className="relative rounded-2xl border-2 border-amber-500/50 overflow-hidden h-36 flex items-center justify-center text-center p-4 shadow-md bg-black">
                  {invitation.envelopeBgVideo ? (
                    <video
                      src={invitation.envelopeBgVideo}
                      autoPlay
                      loop
                      muted
                      playsInline
                      className="absolute inset-0 w-full h-full object-cover filter brightness-75"
                    />
                  ) : (
                    <div
                      className="absolute inset-0 w-full h-full bg-cover bg-center"
                      style={{ backgroundImage: `url(${invitation.envelopeBgImage})` }}
                    />
                  )}
                  <div className="absolute inset-0 bg-black/50" />
                  <div className="relative z-10 text-white space-y-1">
                    <p className="text-[10px] uppercase font-bold text-[#D4AF37] tracking-widest">{invitation.greetingHeaderTitle || 'សិរីសួស្តីអាពាហ៍ពិពាហ៍'}</p>
                    <p className="text-sm font-bold">{invitation.groomName} & {invitation.brideName}</p>
                    <span className="inline-block px-3 py-0.5 rounded-full bg-[#D4AF37] text-black text-[10px] font-bold">
                      {invitation.envelopeBgVideo
                        ? (isKh ? 'គំរូវីដេអូផ្ទៃខាងក្រោយ បើកធៀបការ' : 'Envelope Video Background Preview')
                        : (isKh ? 'គំរូរូបភាពផ្ទៃខាងក្រោយ បើកធៀបការ' : 'Envelope Image Background Preview')}
                    </span>
                  </div>
                </div>
              ) : (
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  {isKh
                    ? 'អាប់ឡូតរូបភាព ឬ វីដេអូ ដើម្បីប្រើជាផ្ទៃខាងក្រោយ (Background) លើផ្ទាំង "បើកធៀបការ"'
                    : 'Upload or set an image or video URL as custom background for the Open Invitation modal.'}
                </p>
              )}
            </div>

            {/* Large Vertical Cover Photo & Video (រូបភាព ឬ វីដេអូ Cover ធំ បញ្ឈរ ទំហំ Facebook/Story) */}
            <div className="p-5 rounded-2xl bg-amber-500/10 border border-amber-500/40 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <label className="block text-xs font-bold text-amber-800 dark:text-amber-300 uppercase tracking-wider">
                    {isKh ? 'រូបភាព/វីដេអូ Cover ធំ បញ្ឈរ (Large Vertical Cover Media)' : 'Large Vertical Cover Photo / Video'}
                  </label>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                    {isKh ? 'បង្ហាញលើផ្ទាំង "បើកធៀបការ" (Facebook Story / 3:4 / 9:16 Format)' : 'Displayed on the Open Invitation card'}
                  </p>
                </div>

                {/* Show/Hide Toggle (ប៊ូតុងបិទ/បើក) */}
                <label className="flex items-center gap-2 cursor-pointer bg-amber-500/20 px-3 py-1.5 rounded-xl border border-amber-500/40 hover:bg-amber-500/30 transition-all">
                  <span className="text-xs font-bold text-amber-900 dark:text-amber-200">
                    {invitation.showCoverPhotoVertical !== false ? (isKh ? 'បើក (ON)' : 'ON') : (isKh ? 'បិទ (OFF)' : 'OFF')}
                  </span>
                  <input
                    type="checkbox"
                    checked={invitation.showCoverPhotoVertical !== false}
                    onChange={(e) => updateInvitation({ showCoverPhotoVertical: e.target.checked })}
                    className="w-4 h-4 rounded text-amber-600 focus:ring-amber-500 cursor-pointer"
                  />
                </label>
              </div>

              {invitation.showCoverPhotoVertical !== false && (
                <div className="space-y-4 pt-2 border-t border-amber-500/20">
                  {/* Upload Image Option */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                        {isKh ? '១. រូបថត Cover បញ្ឈរ (Vertical Image):' : '1. Vertical Image:'}
                      </span>
                      {invitation.coverPhotoVertical && (
                        <button
                          type="button"
                          onClick={() => updateInvitation({ coverPhotoVertical: '' })}
                          className="text-xs text-red-500 hover:text-red-700 font-bold flex items-center gap-1 cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>{isKh ? 'លុបរូប' : 'Remove'}</span>
                        </button>
                      )}
                    </div>
                    <div className="flex flex-col sm:flex-row gap-2">
                      <label className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer shrink-0 shadow-xs">
                        <Upload className="w-4 h-4" />
                        <span>{isKh ? 'ជ្រើសរើសរូបភាពបញ្ឈរ' : 'Upload Image'}</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleCoverPhotoVerticalUpload}
                          className="hidden"
                        />
                      </label>
                      <input
                        type="url"
                        value={invitation.coverPhotoVertical || ''}
                        onChange={(e) => updateInvitation({ coverPhotoVertical: e.target.value })}
                        placeholder="https://... (URL រូបភាព)"
                        className="w-full px-3 py-2 text-xs rounded-xl border border-amber-300 dark:border-amber-700 bg-white dark:bg-slate-900 font-mono dark:text-white"
                      />
                    </div>
                  </div>

                  {/* Upload Video Option */}
                  <div className="space-y-2 pt-2 border-t border-amber-500/20">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-amber-800 dark:text-amber-300 flex items-center gap-1.5">
                        <Video className="w-4 h-4 text-amber-500" />
                        <span>{isKh ? '២. វីដេអូ Cover បញ្ឈរ (Vertical Video - MP4/WebM):' : '2. Vertical Video:'}</span>
                      </span>
                      {invitation.coverVideoVertical && (
                        <button
                          type="button"
                          onClick={() => updateInvitation({ coverVideoVertical: '' })}
                          className="text-xs text-red-500 hover:text-red-700 font-bold flex items-center gap-1 cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>{isKh ? 'លុបវីដេអូ' : 'Remove'}</span>
                        </button>
                      )}
                    </div>
                    <div className="flex flex-col sm:flex-row gap-2">
                      <label className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer shrink-0 shadow-xs">
                        <Upload className="w-4 h-4" />
                        <span>{isKh ? 'អាប់ឡូតវីដេអូ MP4' : 'Upload MP4 Video'}</span>
                        <input
                          type="file"
                          accept="video/*"
                          onChange={handleCoverVideoVerticalUpload}
                          className="hidden"
                        />
                      </label>
                      <input
                        type="url"
                        value={invitation.coverVideoVertical || ''}
                        onChange={(e) => updateInvitation({ coverVideoVertical: e.target.value })}
                        placeholder="https://... (URL វីដេអូ MP4/WebM)"
                        className="w-full px-3 py-2 text-xs rounded-xl border border-amber-300 dark:border-amber-700 bg-white dark:bg-slate-900 font-mono dark:text-white"
                      />
                    </div>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 italic">
                      * ប្រសិនបើមានវីដេអូ ប្រព័ន្ធនឹងបង្ហាញវីដេអូអូតូ motion លើយ៉ាងស្អាតលើ "បើកធៀបការ"
                    </p>
                  </div>

                  {/* Preset Photo Frames Option (ជ្រើសរើសស៊ុមរូបថតប្រណិត) */}
                  <div className="space-y-3 pt-3 border-t border-amber-500/20">
                    <label className="block text-xs font-bold text-amber-800 dark:text-amber-300 uppercase tracking-wider">
                      {isKh ? '៣. ជ្រើសរើសស៊ុមរូបថតប្រណិត (Select Photo Frame Style):' : '3. Select Photo Frame Style:'}
                    </label>

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {[
                        { id: 'gold-royal', nameKh: '👑 ស៊ុមមាសរាជវាំង', nameEn: 'Royal Gold' },
                        { id: 'khmer-kbach', nameKh: '🏛️ ស៊ុមខ្មែរក្បូរក្បាច់', nameEn: 'Khmer Kbach' },
                        { id: 'floral-gold', nameKh: '🌸 ស៊ុមផ្កាមាស', nameEn: 'Floral Gold' },
                        { id: 'heart-arch', nameKh: '💖 ស៊ុមរាងកោងបេះដូង', nameEn: 'Heart Arch' },
                        { id: 'glowing-pearl', nameKh: '🌟 ស៊ុមពន្លឺចែងចាំង', nameEn: 'Glowing Pearl' },
                        { id: 'none', nameKh: '🖼️ គ្មានស៊ុម (Minimal)', nameEn: 'No Frame' },
                      ].map((frame) => {
                        const isSelected = (invitation.coverFrameStyle || 'gold-royal') === frame.id;
                        return (
                          <button
                            key={frame.id}
                            type="button"
                            onClick={() => updateInvitation({ coverFrameStyle: frame.id as any })}
                            className={`p-2.5 rounded-xl border-2 text-xs font-bold transition-all text-center cursor-pointer flex flex-col items-center justify-center gap-1 ${
                              isSelected
                                ? 'bg-amber-500 text-slate-950 border-amber-400 font-extrabold shadow-md scale-102'
                                : 'bg-white/80 dark:bg-slate-900/80 border-amber-300/60 dark:border-amber-700/60 hover:bg-amber-100 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200'
                            }`}
                          >
                            <span>{isKh ? frame.nameKh : frame.nameEn}</span>
                          </button>
                        );
                      })}
                    </div>

                    {/* Custom Frame Overlay Upload Option */}
                    <div className="pt-2">
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300">
                          {isKh ? 'ឬអាប់ឡូតស៊ុមផ្ទាល់ខ្លួន (Custom Frame PNG Overlay):' : 'Or Custom Frame Overlay (PNG):'}
                        </span>
                        {invitation.customFrameImage && (
                          <button
                            type="button"
                            onClick={() => updateInvitation({ customFrameImage: '' })}
                            className="text-xs text-red-500 hover:text-red-700 font-bold flex items-center gap-1 cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>{isKh ? 'លុបស៊ុម' : 'Remove Custom Frame'}</span>
                          </button>
                        )}
                      </div>

                      <div className="flex flex-col sm:flex-row gap-2">
                        <label className="px-3.5 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer shrink-0 shadow-xs">
                          <Upload className="w-4 h-4" />
                          <span>{isKh ? 'អាប់ឡូតស៊ុម PNG' : 'Upload PNG Frame'}</span>
                          <input
                            type="file"
                            accept="image/png, image/*"
                            onChange={handleCustomFrameUpload}
                            className="hidden"
                          />
                        </label>
                        <input
                          type="url"
                          value={invitation.customFrameImage || ''}
                          onChange={(e) => updateInvitation({ customFrameImage: e.target.value })}
                          placeholder="https://... (URL ស៊ុមរូបភាព PNG)"
                          className="w-full px-3 py-2 text-xs rounded-xl border border-amber-300 dark:border-amber-700 bg-white dark:bg-slate-900 font-mono dark:text-white"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Aspect Ratio Selection */}
                  <div className="space-y-3 pt-3 border-t border-amber-500/20">
                    <label className="block text-xs font-bold text-amber-800 dark:text-amber-300 uppercase tracking-wider">
                      {isKh ? '៤. ជ្រើសរើសទំហំសាមាត្ររូបភាព/វីដេអូ (Cover Aspect Ratio):' : '4. Select Cover Aspect Ratio:'}
                    </label>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {[
                        { id: '3:4', labelKh: 'ទំហំបញ្ឈរ 3:4', subKh: '3:4 (ពេញនិយម)', aspectClass: 'aspect-[3/4]' },
                        { id: '2:3', labelKh: 'ទំហំបញ្ឈរ 2:3', subKh: '2:3 (Classic)', aspectClass: 'aspect-[2/3]' },
                        { id: '9:16', labelKh: 'ទំហំបញ្ឈរវែង 9:16', subKh: '9:16 (Story Full)', aspectClass: 'aspect-[9/16]' },
                        { id: '1:1', labelKh: 'ទំហំការ៉េ 1:1', subKh: '1:1 (Square)', aspectClass: 'aspect-square' },
                      ].map((item) => {
                        const isSelected = (invitation.coverAspectRatio || '3:4') === item.id;
                        return (
                          <button
                            key={item.id}
                            type="button"
                            onClick={() => updateInvitation({ coverAspectRatio: item.id as any })}
                            className={`p-2.5 rounded-xl border-2 text-xs font-bold transition-all text-center cursor-pointer flex flex-col items-center justify-center gap-1 ${
                              isSelected
                                ? 'bg-amber-500 text-slate-950 border-amber-400 font-extrabold shadow-md scale-102'
                                : 'bg-white/80 dark:bg-slate-900/80 border-amber-300/60 dark:border-amber-700/60 hover:bg-amber-100 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200'
                            }`}
                          >
                            <div className={`w-5 border-2 border-current rounded-xs mb-0.5 ${item.aspectClass}`} />
                            <span className="text-xs">{item.labelKh}</span>
                            <span className="text-[10px] opacity-80 font-normal">{item.subKh}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Previews */}
                  {(invitation.coverVideoVertical || invitation.coverPhotoVertical) && (
                    <div className="p-3 bg-black/50 rounded-2xl border border-amber-500/40 text-center max-w-xs mx-auto space-y-2">
                      <p className="text-[10px] text-amber-400 font-bold">
                        {isKh ? 'ផ្ទាំងបង្ហាញលទ្ធផលជាក់ស្តែង (Live Frame Preview):' : 'Live Frame Preview:'}
                      </p>
                      <div className="relative max-w-[200px] mx-auto">
                        <div
                          className={`relative overflow-hidden transition-all ${
                            invitation.coverFrameStyle === 'khmer-kbach'
                              ? 'p-2 rounded-xl bg-[#1A140E] border-2 border-[#D4AF37] shadow-lg'
                              : invitation.coverFrameStyle === 'floral-gold'
                              ? 'p-2 rounded-2xl bg-gradient-to-tr from-[#2C2117] via-[#18120B] to-[#2C2117] border-2 border-[#E6C687]'
                              : invitation.coverFrameStyle === 'heart-arch'
                              ? 'p-2 rounded-t-[50px] rounded-b-lg bg-gradient-to-b from-[#281C14] to-[#0E0B08] border-2 border-[#D4AF37]'
                              : invitation.coverFrameStyle === 'glowing-pearl'
                              ? 'p-1.5 rounded-xl bg-black border-2 border-amber-200 shadow-[0_0_15px_rgba(255,223,128,0.8)]'
                              : invitation.coverFrameStyle === 'none'
                              ? 'p-0.5 rounded-lg border border-[#D4AF37]/30'
                              : /* gold-royal */ 'p-2 rounded-xl bg-[#14100C] border-2 border-double border-[#D4AF37]'
                          }`}
                        >
                          {invitation.coverVideoVertical ? (
                            <video
                              src={invitation.coverVideoVertical}
                              autoPlay
                              loop
                              muted
                              playsInline
                              controls
                              className={`w-full object-cover rounded-lg shadow-md mx-auto ${
                                invitation.coverAspectRatio === '2:3'
                                  ? 'aspect-[2/3] max-h-52'
                                  : invitation.coverAspectRatio === '9:16'
                                  ? 'aspect-[9/16] max-h-60'
                                  : invitation.coverAspectRatio === '1:1'
                                  ? 'aspect-square max-h-44'
                                  : 'aspect-[3/4] max-h-48'
                              }`}
                            />
                          ) : (
                            <img
                              src={invitation.coverPhotoVertical}
                              alt="Vertical Cover Preview"
                              className={`w-full object-cover rounded-lg shadow-md mx-auto ${
                                invitation.coverAspectRatio === '2:3'
                                  ? 'aspect-[2/3] max-h-52'
                                  : invitation.coverAspectRatio === '9:16'
                                  ? 'aspect-[9/16] max-h-60'
                                  : invitation.coverAspectRatio === '1:1'
                                  ? 'aspect-square max-h-44'
                                  : 'aspect-[3/4] max-h-48'
                              }`}
                              referrerPolicy="no-referrer"
                            />
                          )}

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
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Groom Side Parents */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-amber-50/50 dark:bg-slate-800/50 p-5 rounded-2xl border border-amber-200/50 dark:border-slate-700">
              <div className="md:col-span-2">
                <h3 className="text-xs font-bold text-amber-800 dark:text-amber-300 uppercase tracking-wider">
                  {isKh ? 'អាណាព្យាបាលខាងប្រុស (Groom Side Parents)' : 'Groom Parents'}
                </h3>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  {isKh ? 'ឈ្មោះឪពុកខាងប្រុស' : 'Groom Father Name'}
                </label>
                <input
                  type="text"
                  value={invitation.groomFatherName}
                  onChange={(e) => updateInvitation({ groomFatherName: e.target.value })}
                  className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  {isKh ? 'ឈ្មោះម្តាយខាងប្រុស' : 'Groom Mother Name'}
                </label>
                <input
                  type="text"
                  value={invitation.groomMotherName}
                  onChange={(e) => updateInvitation({ groomMotherName: e.target.value })}
                  className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 dark:text-white"
                />
              </div>
            </div>

            {/* Bride Side Parents */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-pink-50/50 dark:bg-slate-800/50 p-5 rounded-2xl border border-pink-200/50 dark:border-slate-700">
              <div className="md:col-span-2">
                <h3 className="text-xs font-bold text-pink-800 dark:text-pink-300 uppercase tracking-wider">
                  {isKh ? 'អាណាព្យាបាលខាងស្រី (Bride Side Parents)' : 'Bride Parents'}
                </h3>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  {isKh ? 'ឈ្មោះឪពុកខាងស្រី' : 'Bride Father Name'}
                </label>
                <input
                  type="text"
                  value={invitation.brideFatherName}
                  onChange={(e) => updateInvitation({ brideFatherName: e.target.value })}
                  className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  {isKh ? 'ឈ្មោះម្តាយខាងស្រី' : 'Bride Mother Name'}
                </label>
                <input
                  type="text"
                  value={invitation.brideMotherName}
                  onChange={(e) => updateInvitation({ brideMotherName: e.target.value })}
                  className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 dark:text-white"
                />
              </div>
            </div>

            {/* Groom & Bride Details & Custom Logo Emblem */}
            <div className="space-y-4 bg-slate-50 dark:bg-slate-800/80 p-5 rounded-2xl border border-slate-200 dark:border-slate-700">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    {isKh ? 'ឈ្មោះកូនប្រុស (Groom Name)' : 'Groom Name'}
                  </label>
                  <input
                    type="text"
                    value={invitation.groomName}
                    onChange={(e) => updateInvitation({ groomName: e.target.value })}
                    className="w-full px-3.5 py-2 text-sm font-semibold rounded-xl border border-amber-300 dark:border-amber-700 bg-white dark:bg-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    {isKh ? 'ឈ្មោះកូនស្រី (Bride Name)' : 'Bride Name'}
                  </label>
                  <input
                    type="text"
                    value={invitation.brideName}
                    onChange={(e) => updateInvitation({ brideName: e.target.value })}
                    className="w-full px-3.5 py-2 text-sm font-semibold rounded-xl border border-amber-300 dark:border-amber-700 bg-white dark:bg-slate-900 dark:text-white"
                  />
                </div>
              </div>

              {/* Upload Couple Logo Image (រូបភាពឡូហ្គោឈ្មោះសាម៉ីខ្លួន) */}
              <div className="pt-3 border-t border-slate-200 dark:border-slate-700 space-y-2">
                <label className="block text-xs font-bold text-amber-600 dark:text-amber-400">
                  {isKh ? 'អាប់ឡូតរូបភាព ឡូហ្គោឈ្មោះសាម៉ីខ្លួន (Upload Couple Logo/Emblem Image)' : 'Upload Couple Logo Image'}
                </label>
                <div className="flex flex-col sm:flex-row gap-2">
                  <label className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer shrink-0 shadow-xs">
                    <Upload className="w-4 h-4" />
                    <span>{isKh ? 'ជ្រើសរើសរូបភាពឡូហ្គោ' : 'Choose Logo Image'}</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleCoupleLogoUpload}
                      className="hidden"
                    />
                  </label>
                  <input
                    type="url"
                    value={invitation.coupleLogoImage || ''}
                    onChange={(e) => updateInvitation({ coupleLogoImage: e.target.value, showCoupleLogoImage: true })}
                    placeholder="https://..."
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 font-mono dark:text-white"
                  />
                  {invitation.coupleLogoImage && (
                    <button
                      type="button"
                      onClick={() => updateInvitation({ coupleLogoImage: '' })}
                      className="px-3 py-2 rounded-xl bg-red-100 dark:bg-red-950/50 text-red-600 dark:text-red-400 font-bold text-xs hover:bg-red-200 shrink-0 cursor-pointer"
                    >
                      {isKh ? 'លុប' : 'Clear'}
                    </button>
                  )}
                </div>

                {invitation.coupleLogoImage && (
                  <div className="p-3 rounded-xl bg-black/40 border border-amber-500/30 text-center max-w-xs mx-auto">
                    <p className="text-[10px] text-amber-400 font-bold mb-1">{isKh ? 'រូបភាពឡូហ្គោដែលបានអាប់ឡូត:' : 'Uploaded Logo:'}</p>
                    <img
                      src={invitation.coupleLogoImage}
                      alt="Couple Logo Preview"
                      className="max-h-24 object-contain mx-auto filter drop-shadow-[0_2px_8px_rgba(212,175,55,0.4)]"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                )}
              </div>

              {/* Toggle Switches for Showing/Hiding Text Name & Logo */}
              <div className="pt-3 border-t border-slate-200 dark:border-slate-700 space-y-2">
                <label className="block text-xs font-bold text-slate-800 dark:text-slate-200">
                  {isKh ? 'ប៊ូតុង បើក/បិទ ការបង្ហាញ (Display Toggles for Text & Logo)' : 'Display Toggles'}
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Toggle Text Name */}
                  <button
                    type="button"
                    onClick={() =>
                      updateInvitation({
                        showCoupleTextName: invitation.showCoupleTextName === false ? true : false,
                      })
                    }
                    className={`p-3 rounded-2xl border text-left flex items-center justify-between gap-3 transition-all cursor-pointer ${
                      invitation.showCoupleTextName !== false
                        ? 'bg-amber-500/15 border-amber-500 text-amber-800 dark:text-amber-300 ring-1 ring-amber-500'
                        : 'bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-700 text-slate-500'
                    }`}
                  >
                    <div>
                      <p className="text-xs font-bold">{isKh ? 'បង្ហាញឈ្មោះជាអក្សរ' : 'Show Text Names'}</p>
                      <p className="text-[10px] opacity-75">{invitation.showCoupleTextName !== false ? (isKh ? 'បើក (Active)' : 'Active') : (isKh ? 'បិទ (Hidden)' : 'Hidden')}</p>
                    </div>
                    <div className={`w-10 h-6 rounded-full p-0.5 transition-colors ${
                      invitation.showCoupleTextName !== false ? 'bg-amber-500' : 'bg-slate-300 dark:bg-slate-700'
                    }`}>
                      <div className={`w-5 h-5 rounded-full bg-white shadow-md transform transition-transform ${
                        invitation.showCoupleTextName !== false ? 'translate-x-4' : 'translate-x-0'
                      }`} />
                    </div>
                  </button>

                  {/* Toggle Logo Image */}
                  <button
                    type="button"
                    onClick={() =>
                      updateInvitation({
                        showCoupleLogoImage: invitation.showCoupleLogoImage === false ? true : false,
                      })
                    }
                    className={`p-3 rounded-2xl border text-left flex items-center justify-between gap-3 transition-all cursor-pointer ${
                      invitation.showCoupleLogoImage !== false
                        ? 'bg-amber-500/15 border-amber-500 text-amber-800 dark:text-amber-300 ring-1 ring-amber-500'
                        : 'bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-700 text-slate-500'
                    }`}
                  >
                    <div>
                      <p className="text-xs font-bold">{isKh ? 'បង្ហាញរូបភាពឡូហ្គោ' : 'Show Logo Image'}</p>
                      <p className="text-[10px] opacity-75">{invitation.showCoupleLogoImage !== false ? (isKh ? 'បើក (Active)' : 'Active') : (isKh ? 'បិទ (Hidden)' : 'Hidden')}</p>
                    </div>
                    <div className={`w-10 h-6 rounded-full p-0.5 transition-colors ${
                      invitation.showCoupleLogoImage !== false ? 'bg-amber-500' : 'bg-slate-300 dark:bg-slate-700'
                    }`}>
                      <div className={`w-5 h-5 rounded-full bg-white shadow-md transform transition-transform ${
                        invitation.showCoupleLogoImage !== false ? 'translate-x-4' : 'translate-x-0'
                      }`} />
                    </div>
                  </button>
                </div>
              </div>

              {/* Font Selector for Couple Names */}
              <div className="pt-2 border-t border-slate-200 dark:border-slate-700">
                <label className="block text-xs font-bold text-amber-500 mb-1.5">
                  {isKh ? 'ជ្រើសរើសពុម្ពអក្សរខ្មែរសម្រាប់ឈ្មោះសាម៉ីខ្លួន (Groom & Bride Font)' : 'Groom & Bride Khmer Font'}
                </label>
                <select
                  value={invitation.groomBrideFont || 'muol'}
                  onChange={(e) => updateInvitation({ groomBrideFont: e.target.value })}
                  className="w-full p-2.5 text-sm rounded-xl border border-amber-500/50 bg-white dark:bg-slate-900 dark:text-white font-semibold"
                >
                  <option value="muol">ពុម្ពអក្សរ មុល (Moul - ខ្មែរប្រពៃណី)</option>
                  <option value="battambang">ពុម្ពអក្សរ បាត់ដំបង (Battambang)</option>
                  <option value="siemreap">ពុម្ពអក្សរ សៀមរាប (Siemreap)</option>
                  <option value="kantumruuy">ពុម្ពអក្សរ កណ្ដុររុយ (Kantumruy Pro)</option>
                  <option value="koulen">ពុម្ពអក្សរ គូលែន (Koulen Bold)</option>
                  <option value="bayon">ពុម្ពអក្សរ បាយ័ន (Bayon)</option>
                  <option value="dangrek">ពុម្ពអក្សរ ដងរែក (Dangrek)</option>
                  <option value="preahvihear">ពុម្ពអក្សរ ព្រះវិហារ (Preahvihear)</option>
                  <option value="taprom">ពុម្ពអក្សរ តាព្រហ្ម (Taprom Decorative)</option>
                  <option value="content">ពុម្ពអក្សរ ក nội dung (Content Serif)</option>
                </select>
              </div>

              {/* Font Size Adjustments Section (កែប្រែទំហំអក្សរ) */}
              <div className="pt-4 border-t border-slate-200 dark:border-slate-700 space-y-4">
                <label className="block text-xs font-bold text-amber-800 dark:text-amber-300 uppercase tracking-wider">
                  {isKh ? 'កែប្រែទំហំអក្សរឈ្មោះ (Font Size Adjustments)' : 'Font Size Adjustments'}
                </label>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Couple Font Size Slider */}
                  <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
                    <div className="flex justify-between items-center">
                      <label className="text-xs font-bold text-slate-800 dark:text-slate-200">
                        {isKh ? 'ទំហំអក្សរឈ្មោះកូនប្រុសកូនស្រី:' : 'Couple Names Font Size:'}
                      </label>
                      <span className="text-xs font-mono font-bold text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded-md">
                        {invitation.coupleFontSize || 24}px
                      </span>
                    </div>
                    <input
                      type="range"
                      min={16}
                      max={48}
                      step={1}
                      value={invitation.coupleFontSize || 24}
                      onChange={(e) => updateInvitation({ coupleFontSize: parseInt(e.target.value) })}
                      className="w-full accent-amber-500 cursor-pointer"
                    />
                    <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                      <span>16px ({isKh ? 'តូច' : 'Small'})</span>
                      <span>24px ({isKh ? 'មធ្យម' : 'Normal'})</span>
                      <span>48px ({isKh ? 'ធំ' : 'Large'})</span>
                    </div>
                  </div>

                  {/* Guest Name Font Size Slider */}
                  <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
                    <div className="flex justify-between items-center">
                      <label className="text-xs font-bold text-slate-800 dark:text-slate-200">
                        {isKh ? 'ទំហំអក្សរឈ្មោះភ្ញៀវ (លើធៀប):' : 'Guest Name Font Size:'}
                      </label>
                      <span className="text-xs font-mono font-bold text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded-md">
                        {invitation.guestNameFontSize || 18}px
                      </span>
                    </div>
                    <input
                      type="range"
                      min={12}
                      max={36}
                      step={1}
                      value={invitation.guestNameFontSize || 18}
                      onChange={(e) => updateInvitation({ guestNameFontSize: parseInt(e.target.value) })}
                      className="w-full accent-amber-500 cursor-pointer"
                    />
                    <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                      <span>12px ({isKh ? 'តូច' : 'Small'})</span>
                      <span>18px ({isKh ? 'មធ្យម' : 'Normal'})</span>
                      <span>36px ({isKh ? 'ធំ' : 'Large'})</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* LIVE GOLD METALLIC PREVIEW CARD */}
            <div className="p-6 rounded-2xl bg-gradient-to-b from-[#241E17] to-[#14100C] border-2 border-[#D4AF37] text-center shadow-xl space-y-3">
              <span className="text-[10px] uppercase tracking-widest text-[#D4AF37] font-bold block">
                {isKh ? 'ការបង្ហាញគំរូឈ្មោះពណ៌មាសប្រណិត' : 'Prominent Gold Metallic Preview'}
              </span>
              <div className="inline-block px-3 py-1 rounded-full bg-[#D4AF37]/15 text-[#D4AF37] border border-[#D4AF37]/40 text-xs font-bold">
                {invitation.greetingHeaderTitle || 'សិរីសួស្តីអាពាហ៍ពិពាហ៍'}
              </div>

              {/* Logo Preview if uploaded and enabled */}
              {invitation.coupleLogoImage && invitation.showCoupleLogoImage !== false && (
                <div className="my-2 max-w-xs mx-auto p-2 bg-black/40 rounded-2xl border border-[#D4AF37]/40">
                  <img
                    src={invitation.coupleLogoImage}
                    alt="Couple Logo"
                    className="max-h-28 object-contain mx-auto filter drop-shadow-[0_2px_8px_rgba(212,175,55,0.5)]"
                    referrerPolicy="no-referrer"
                  />
                </div>
              )}

              {/* Text Names Preview Side-by-Side (ទទឹមគ្នា) if enabled */}
              {(invitation.showCoupleTextName !== false || !invitation.coupleLogoImage || invitation.showCoupleLogoImage === false) && (
                <div className="grid grid-cols-2 gap-2 items-center my-2 relative py-2 border-t border-amber-500/30 pt-3">
                  <div className="text-center pr-2">
                    <p className="text-[10px] text-amber-500 font-bold uppercase">{invitation.groomTitle || 'កូនប្រុសនាម'}</p>
                    <h3 className={`text-lg sm:text-2xl font-black text-gold-gradient drop-shadow-md leading-tight ${
                      invitation.groomBrideFont === 'battambang' ? 'font-battambang' :
                      invitation.groomBrideFont === 'siemreap' ? 'font-siemreap' :
                      invitation.groomBrideFont === 'kantumruuy' ? 'font-kantumruy' :
                      invitation.groomBrideFont === 'koulen' ? 'font-koulen' :
                      invitation.groomBrideFont === 'bayon' ? 'font-bayon' :
                      invitation.groomBrideFont === 'dangrek' ? 'font-dangrek' :
                      invitation.groomBrideFont === 'preahvihear' ? 'font-preahvihear' :
                      invitation.groomBrideFont === 'taprom' ? 'font-taprom' :
                      invitation.groomBrideFont === 'content' ? 'font-content' : 'font-moul'
                    }`}>
                      {invitation.groomName || 'កូនប្រុស'}
                    </h3>
                  </div>

                  <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
                    <div className="w-7 h-7 rounded-full bg-amber-500 text-slate-900 font-black flex items-center justify-center text-xs shadow-md border border-white">
                      &
                    </div>
                  </div>

                  <div className="text-center pl-2">
                    <p className="text-[10px] text-amber-500 font-bold uppercase">{invitation.brideTitle || 'កូនស្រីនាម'}</p>
                    <h3 className={`text-lg sm:text-2xl font-black text-gold-gradient drop-shadow-md leading-tight ${
                      invitation.groomBrideFont === 'battambang' ? 'font-battambang' :
                      invitation.groomBrideFont === 'siemreap' ? 'font-siemreap' :
                      invitation.groomBrideFont === 'kantumruuy' ? 'font-kantumruy' :
                      invitation.groomBrideFont === 'koulen' ? 'font-koulen' :
                      invitation.groomBrideFont === 'bayon' ? 'font-bayon' :
                      invitation.groomBrideFont === 'dangrek' ? 'font-dangrek' :
                      invitation.groomBrideFont === 'preahvihear' ? 'font-preahvihear' :
                      invitation.groomBrideFont === 'taprom' ? 'font-taprom' :
                      invitation.groomBrideFont === 'content' ? 'font-content' : 'font-moul'
                    }`}>
                      {invitation.brideName || 'កូនស្រី'}
                    </h3>
                  </div>
                </div>
              )}
            </div>

            {renderSaveFooterBar('សាម៉ីខ្លួន & អាណាព្យាបាល', 'Couple & Parents')}
          </div>
        )}

        {/* TAB 2: DATE & VENUE */}
        {activeSubTab === 'date_venue' && (
          <div className="space-y-6">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white font-serif border-b pb-3 border-slate-100 dark:border-slate-800">
              {isKh ? 'កាលបរិច្ឆេទ & ទីតាំងរៀបអាពាហ៍ពិពាហ៍' : 'Wedding Date & Venue Location'}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  {isKh ? 'កាលបរិច្ឆេទ (ភាសាខ្មែរ)' : 'Wedding Date (Khmer Text)'}
                </label>
                <input
                  type="text"
                  value={invitation.weddingDateKhmer}
                  onChange={(e) => updateInvitation({ weddingDateKhmer: e.target.value })}
                  className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  {isKh ? 'ថ្ងៃខែចន្ទគតិខ្មែរ (Lunar Calendar)' : 'Khmer Lunar Date'}
                </label>
                <input
                  type="text"
                  value={invitation.lunarDateKhmer}
                  onChange={(e) => updateInvitation({ lunarDateKhmer: e.target.value })}
                  className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  {isKh ? 'វេលាម៉ោង (Time Text)' : 'Time Text'}
                </label>
                <input
                  type="text"
                  value={invitation.timeKhmer}
                  onChange={(e) => updateInvitation({ timeKhmer: e.target.value })}
                  className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  {isKh ? 'ឈ្មោះទីតាំង (Venue Name)' : 'Venue Name'}
                </label>
                <input
                  type="text"
                  value={invitation.venueName}
                  onChange={(e) => updateInvitation({ venueName: e.target.value })}
                  className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 dark:text-white"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  {isKh ? 'អាសយដ្ឋានពេញ (Full Venue Address)' : 'Full Address'}
                </label>
                <textarea
                  rows={2}
                  value={invitation.venueAddress}
                  onChange={(e) => updateInvitation({ venueAddress: e.target.value })}
                  className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 dark:text-white"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 flex items-center justify-between">
                  <span>{isKh ? 'តំណភ្ជាប់ Google Maps URL' : 'Google Maps Link'}</span>
                  <a
                    href={invitation.googleMapUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-amber-600 dark:text-amber-400 hover:underline flex items-center gap-1 text-[11px]"
                  >
                    <MapPin className="w-3 h-3" />
                    <span>{isKh ? 'សាកល្បងបើកផែនទី' : 'Test Link'}</span>
                  </a>
                </label>
                <input
                  type="url"
                  value={invitation.googleMapUrl}
                  onChange={(e) => updateInvitation({ googleMapUrl: e.target.value })}
                  className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 dark:text-white font-mono text-xs"
                />
              </div>

              {/* Venue Image Upload Section */}
              <div className="md:col-span-2 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-amber-700 dark:text-amber-400 flex items-center gap-1.5 uppercase tracking-wider">
                    <Image className="w-4 h-4 text-amber-500" />
                    <span>{isKh ? 'រូបថតទីតាំង ឬ ផែនទីទីតាំងរៀបកម្មវិធី (Venue Location Image)' : 'Venue / Map Image'}</span>
                  </label>
                  {invitation.venueImage && (
                    <button
                      type="button"
                      onClick={() => updateInvitation({ venueImage: '' })}
                      className="text-xs text-red-500 hover:text-red-600 flex items-center gap-1 font-semibold"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>{isKh ? 'លុបរូប' : 'Remove Image'}</span>
                    </button>
                  )}
                </div>

                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  {isKh
                    ? 'អ្នកអាចអាប់ឡូតរូបថតទីតាំង (Upload image file) ឬ វាយបញ្ចូល Link រូបភាពទីតាំងរៀបការបាន៖'
                    : 'Upload a venue photo/map image file or enter an image URL:'}
                </p>

                <div className="flex flex-col sm:flex-row gap-2">
                  <label className="px-4 py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs rounded-xl cursor-pointer transition-all flex items-center justify-center gap-2 shrink-0 shadow-xs">
                    <Upload className="w-4 h-4" />
                    <span>{isKh ? 'អាប់ឡូតរូបភាព (Upload File)' : 'Upload Image File'}</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleVenueImageUpload}
                      className="hidden"
                    />
                  </label>

                  <input
                    type="url"
                    value={invitation.venueImage || ''}
                    onChange={(e) => updateInvitation({ venueImage: e.target.value })}
                    placeholder="https://example.com/venue-map.jpg"
                    className="flex-1 px-3.5 py-2 text-xs font-mono rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 dark:text-white"
                  />
                </div>

                {/* Preview Box */}
                {invitation.venueImage && (
                  <div className="mt-2 rounded-xl overflow-hidden border border-amber-500/40 relative aspect-16/9 max-h-48 bg-slate-900 flex items-center justify-center">
                    <img
                      src={invitation.venueImage}
                      alt="Venue Preview"
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                )}
              </div>
            </div>

            {renderSaveFooterBar('ថ្ងៃខែ & ទីតាំង', 'Date & Venue')}
          </div>
        )}

        {/* TAB 3: FORMAL SPEECH & TEXTS */}
        {activeSubTab === 'speech' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b pb-3 border-slate-100 dark:border-slate-800">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white font-serif">
                {isKh ? 'លិខិតអញ្ជើញ & សារផ្លូវការ' : 'Formal Invitation Text'}
              </h2>
              <button
                onClick={() => setIsAiModalOpen(true)}
                className="px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-semibold text-xs transition-all flex items-center gap-1.5 shadow-xs"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-200" />
                <span>{isKh ? 'បង្កើតដោយ AI' : 'Generate with AI'}</span>
              </button>
            </div>

            <div>
              <label className="block text-xs font-bold text-amber-500 mb-1.5">
                {isKh ? 'ជ្រើសរើសពុម្ពអក្សរខ្មែរសម្រាប់លិខិតអញ្ជើញ (Speech Khmer Font)' : 'Formal Speech Font'}
              </label>
              <select
                value={invitation.speechFont || 'kantumruuy'}
                onChange={(e) => updateInvitation({ speechFont: e.target.value })}
                className="w-full p-2.5 text-sm rounded-xl border border-amber-500/50 bg-white dark:bg-slate-900 dark:text-white font-semibold mb-4"
              >
                <option value="kantumruuy">ពុម្ពអក្សរ កណ្ដុររុយ (Kantumruy Pro - ស្រួលអានបំផុត)</option>
                <option value="battambang">ពុម្ពអក្សរ បាត់ដំបង (Battambang)</option>
                <option value="siemreap">ពុម្ពអក្សរ សៀមរាប (Siemreap)</option>
                <option value="content">ពុម្ពអក្សរ ក nội dung (Content Serif)</option>
                <option value="muol">ពុម្ពអក្សរ មុល (Moul - ខ្មែរប្រពៃណី)</option>
                <option value="preahvihear">ពុម្ពអក្សរ ព្រះវិហារ (Preahvihear)</option>
                <option value="koulen">ពុម្ពអក្សរ គូលែន (Koulen)</option>
                <option value="bayon">ពុម្ពអក្សរ បាយ័ន (Bayon)</option>
                <option value="dangrek">ពុម្ពអក្សរ ដងរែក (Dangrek)</option>
                <option value="taprom">ពុម្ពអក្សរ តាព្រហ្ម (Taprom)</option>
              </select>

              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                {isKh ? 'អត្ថបទលិខិតអញ្ជើញផ្លូវការ (Formal Invitation Text)' : 'Formal Speech Text'}
              </label>
              <textarea
                rows={5}
                value={invitation.formalInvitationText}
                onChange={(e) => updateInvitation({ formalInvitationText: e.target.value })}
                className="w-full p-3 text-sm leading-relaxed rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 dark:text-white font-serif"
              />
            </div>

            {/* LIVE PREVIEW OF FORMAL SPEECH */}
            <div className="p-6 rounded-2xl bg-gradient-to-b from-[#241E17] via-[#1A1510] to-[#14100C] border-2 border-[#D4AF37]/80 text-center shadow-xl space-y-3">
              <span className="text-[10px] uppercase tracking-widest text-[#D4AF37] font-bold">
                {isKh ? 'ការបង្ហាញគំរូលិខិតអញ្ជើញក្នុងកាតមាសប្រណិត' : 'Gold Card Speech Preview'}
              </span>
              <p className={`text-xs sm:text-sm leading-relaxed text-[#F3E5C8] whitespace-pre-line p-4 rounded-xl bg-[#0F1115]/80 border border-[#D4AF37]/40 ${
                invitation.speechFont === 'battambang' ? 'font-battambang' :
                invitation.speechFont === 'siemreap' ? 'font-siemreap' :
                invitation.speechFont === 'content' ? 'font-content' :
                invitation.speechFont === 'muol' ? 'font-moul' :
                invitation.speechFont === 'preahvihear' ? 'font-preahvihear' :
                invitation.speechFont === 'koulen' ? 'font-koulen' :
                invitation.speechFont === 'bayon' ? 'font-bayon' :
                invitation.speechFont === 'dangrek' ? 'font-dangrek' :
                invitation.speechFont === 'taprom' ? 'font-taprom' : 'font-kantumruy'
              }`}>
                {invitation.formalInvitationText}
              </p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                {isKh ? 'គោរមងារភ្ញៀវអញ្ជើញ (Guest Honorific Titles)' : 'Guest Honorific Titles'}
              </label>
              <input
                type="text"
                value={invitation.guestHonorifics}
                onChange={(e) => updateInvitation({ guestHonorifics: e.target.value })}
                className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                {isKh ? 'សារថ្លែងអំណរគុណ (Thank You Message)' : 'Thank You Message'}
              </label>
              <textarea
                rows={2}
                value={invitation.thankYouMessage}
                onChange={(e) => updateInvitation({ thankYouMessage: e.target.value })}
                className="w-full p-3 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                {isKh ? 'សារសូមខន្តីអភ័យទោស (Apology & Blessings)' : 'Apology & Blessings'}
              </label>
              <textarea
                rows={3}
                value={invitation.apologyMessage}
                onChange={(e) => updateInvitation({ apologyMessage: e.target.value })}
                className="w-full p-3 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 dark:text-white"
              />
            </div>

            {renderSaveFooterBar('លិខិតអញ្ជើញ & សារ', 'Formal Speech')}
          </div>
        )}

        {/* TAB 4: SCHEDULE AGENDA */}
        {activeSubTab === 'agenda' && (
          <div className="space-y-6">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white font-serif border-b pb-3 border-slate-100 dark:border-slate-800">
              {isKh ? 'របៀបវារៈកម្មវិធីពិធីការ (Program Schedule)' : 'Wedding Program Schedule'}
            </h2>

            <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/40 text-xs text-amber-900 dark:text-amber-200">
              {isKh
                ? 'អ្នកអាចកែសម្រួលម៉ោង ជ្រើសរើសរូបតំណាងពិធី (Icons) បន្ថែម ឬលុបកម្មវិធីនីមួយៗបានយ៉ាងងាយស្រួល!'
                : 'Customizable timeline for traditional ceremonies. Edit titles, times, and icons for each program item!'}
            </div>

            {/* DAY 1 PROGRAM ITEMS */}
            <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-4">
              <div className="flex items-center justify-between border-b pb-3 border-slate-200 dark:border-slate-700">
                <h3 className="text-sm font-bold text-amber-600 dark:text-amber-400 font-serif">
                  {isKh ? 'ថ្ងៃទី១ ៖ ថ្ងៃសែនសីរិមង្គល' : 'Day 1 Ceremonies'}
                </h3>
                <button
                  onClick={() => handleAddProgramItem(1)}
                  className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs flex items-center gap-1 shadow-sm cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>{isKh ? 'បន្ថែមកម្មវិធីថ្ងៃទី១' : 'Add Day 1 Event'}</span>
                </button>
              </div>

              <div className="space-y-3">
                {currentProgramItems
                  .filter((item) => item.day === 1)
                  .map((item) => (
                    <div
                      key={item.id}
                      className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3 shadow-xs"
                    >
                      <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
                        {/* Icon Picker */}
                        <div className="sm:col-span-2">
                          <label className="block text-[10px] font-bold text-slate-500 mb-1">
                            {isKh ? 'រូបតំណាង' : 'Icon'}
                          </label>
                          <select
                            value={item.icon || 'rings'}
                            onChange={(e) => handleUpdateProgramItem(item.id, { icon: e.target.value })}
                            className="w-full p-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 dark:text-white"
                          >
                            <option value="rings">💍 ចិញ្ចៀន (Rings)</option>
                            <option value="haircut">🌸 កាត់សក់ (Haircut)</option>
                            <option value="tea">🍵 សំពះផ្ទឹម (Tea)</option>
                            <option value="monk">🕯️ សូត្រមន្ត (Monks)</option>
                            <option value="procession">🥁 ហែជំនូន (Procession)</option>
                            <option value="dinner">🥂 ពិសាអាហារ (Dinner)</option>
                            <option value="music">🎵 តន្ត្រី (Music)</option>
                            <option value="photo">📸 រូបថត (Photos)</option>
                            <option value="blessing">📜 ពរជ័យ (Blessing)</option>
                          </select>
                        </div>

                        {/* Title */}
                        <div className="sm:col-span-6">
                          <label className="block text-[10px] font-bold text-slate-500 mb-1">
                            {isKh ? 'ឈ្មោះកម្មវិធីពិធីការ' : 'Program Title'}
                          </label>
                          <input
                            type="text"
                            value={item.title}
                            onChange={(e) => handleUpdateProgramItem(item.id, { title: e.target.value })}
                            className="w-full px-3 py-2 text-xs font-semibold rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 dark:text-white"
                          />
                        </div>

                        {/* Time */}
                        <div className="sm:col-span-3">
                          <label className="block text-[10px] font-bold text-slate-500 mb-1">
                            {isKh ? 'វេលាម៉ោង' : 'Time'}
                          </label>
                          <input
                            type="text"
                            value={item.time}
                            onChange={(e) => handleUpdateProgramItem(item.id, { time: e.target.value })}
                            className="w-full px-3 py-2 text-xs font-bold text-amber-600 rounded-xl border border-amber-300 dark:border-amber-700 bg-white dark:bg-slate-900"
                          />
                        </div>

                        {/* Delete */}
                        <div className="sm:col-span-1 text-right sm:text-center pt-2 sm:pt-4">
                          <button
                            onClick={() => handleDeleteProgramItem(item.id)}
                            className="p-2 rounded-xl text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors cursor-pointer"
                            title="Delete Event"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      {/* Quick Time Preset Buttons */}
                      <div className="flex flex-wrap items-center gap-1.5 pt-1">
                        <span className="text-[10px] text-slate-400 font-semibold mr-1">
                          {isKh ? 'ជ្រើសម៉ោងលឿន:' : 'Quick Time:'}
                        </span>
                        {['០៦:០០ នាទីព្រឹក', '០៧:០០ នាទីព្រឹក', '០៧:៣០ នាទីព្រឹក', '០៨:០០ នាទីព្រឹក', '០២:០០ នាទីរសៀល', '០៥:៣០ នាទីល្ងាច'].map((t) => (
                          <button
                            key={t}
                            onClick={() => handleUpdateProgramItem(item.id, { time: t })}
                            className="px-2 py-0.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-[10px] font-semibold text-slate-700 dark:text-slate-300 hover:bg-amber-100 hover:text-amber-800 transition-all cursor-pointer border border-slate-200 dark:border-slate-700"
                          >
                            {t}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
              </div>
            </div>

            {/* DAY 2 PROGRAM ITEMS */}
            <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-4">
              <div className="flex items-center justify-between border-b pb-3 border-slate-200 dark:border-slate-700">
                <h3 className="text-sm font-bold text-amber-600 dark:text-amber-400 font-serif">
                  {isKh ? 'ថ្ងៃទី២ ៖ ថ្ងៃសិរីអាពាហ៍ពិពាហ៍' : 'Day 2 Main Ceremony'}
                </h3>
                <button
                  onClick={() => handleAddProgramItem(2)}
                  className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs flex items-center gap-1 shadow-sm cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>{isKh ? 'បន្ថែមកម្មវិធីថ្ងៃទី២' : 'Add Day 2 Event'}</span>
                </button>
              </div>

              <div className="space-y-3">
                {currentProgramItems
                  .filter((item) => item.day === 2)
                  .map((item) => (
                    <div
                      key={item.id}
                      className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3 shadow-xs"
                    >
                      <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
                        {/* Icon Picker */}
                        <div className="sm:col-span-2">
                          <label className="block text-[10px] font-bold text-slate-500 mb-1">
                            {isKh ? 'រូបតំណាង' : 'Icon'}
                          </label>
                          <select
                            value={item.icon || 'rings'}
                            onChange={(e) => handleUpdateProgramItem(item.id, { icon: e.target.value })}
                            className="w-full p-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 dark:text-white"
                          >
                            <option value="rings">💍 ចិញ្ចៀន (Rings)</option>
                            <option value="haircut">🌸 កាត់សក់ (Haircut)</option>
                            <option value="tea">🍵 សំពះផ្ទឹម (Tea)</option>
                            <option value="monk">🕯️ សូត្រមន្ត (Monks)</option>
                            <option value="procession">🥁 ហែជំនូន (Procession)</option>
                            <option value="dinner">🥂 ពិសាអាហារ (Dinner)</option>
                            <option value="music">🎵 តន្ត្រី (Music)</option>
                            <option value="photo">📸 រូបថត (Photos)</option>
                            <option value="blessing">📜 ពរជ័យ (Blessing)</option>
                          </select>
                        </div>

                        {/* Title */}
                        <div className="sm:col-span-6">
                          <label className="block text-[10px] font-bold text-slate-500 mb-1">
                            {isKh ? 'ឈ្មោះកម្មវិធីពិធីការ' : 'Program Title'}
                          </label>
                          <input
                            type="text"
                            value={item.title}
                            onChange={(e) => handleUpdateProgramItem(item.id, { title: e.target.value })}
                            className="w-full px-3 py-2 text-xs font-semibold rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 dark:text-white"
                          />
                        </div>

                        {/* Time */}
                        <div className="sm:col-span-3">
                          <label className="block text-[10px] font-bold text-slate-500 mb-1">
                            {isKh ? 'វេលាម៉ោង' : 'Time'}
                          </label>
                          <input
                            type="text"
                            value={item.time}
                            onChange={(e) => handleUpdateProgramItem(item.id, { time: e.target.value })}
                            className="w-full px-3 py-2 text-xs font-bold text-amber-600 rounded-xl border border-amber-300 dark:border-amber-700 bg-white dark:bg-slate-900"
                          />
                        </div>

                        {/* Delete */}
                        <div className="sm:col-span-1 text-right sm:text-center pt-2 sm:pt-4">
                          <button
                            onClick={() => handleDeleteProgramItem(item.id)}
                            className="p-2 rounded-xl text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors cursor-pointer"
                            title="Delete Event"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      {/* Quick Time Preset Buttons */}
                      <div className="flex flex-wrap items-center gap-1.5 pt-1">
                        <span className="text-[10px] text-slate-400 font-semibold mr-1">
                          {isKh ? 'ជ្រើសម៉ោងលឿន:' : 'Quick Time:'}
                        </span>
                        {['០៦:៣០ នាទីព្រឹក', '០៧:០០ នាទីព្រឹក', '០៧:៣០ នាទីព្រឹក', '០៨:០០ នាទីព្រឹក', '០៨:៣០ នាទីព្រឹក', '១០:៣០ នាទីព្រឹក', '១២:០០ នាទីថ្ងៃត្រង់', '០៥:០០ នាទីល្ងាច'].map((t) => (
                          <button
                            key={t}
                            onClick={() => handleUpdateProgramItem(item.id, { time: t })}
                            className="px-2 py-0.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-[10px] font-semibold text-slate-700 dark:text-slate-300 hover:bg-amber-100 hover:text-amber-800 transition-all cursor-pointer border border-slate-200 dark:border-slate-700"
                          >
                            {t}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
              </div>
            </div>

            {renderSaveFooterBar('របៀបវារៈកម្មវិធី', 'Program Schedule')}
          </div>
        )}

        {/* TAB 5: MEDIA & MUSIC & VIDEO */}
        {activeSubTab === 'media' && (
          <div className="space-y-6">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white font-serif border-b pb-3 border-slate-100 dark:border-slate-800">
              {isKh ? 'រូបថត Cover, Gallery, Video & Background Music (MP3)' : 'Media & Music Settings'}
            </h2>

            {/* Cover Image Section */}
            <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-3">
              <label className="block text-xs font-bold text-slate-800 dark:text-slate-200">
                {isKh ? 'រូបថតគម្រប់អាពាហ៍ពិពាហ៍ (Cover Image)' : 'Cover Image'}
              </label>

              <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
                <label className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs flex items-center justify-center gap-2 cursor-pointer transition-all shadow-xs shrink-0">
                  <Upload className="w-4 h-4" />
                  <span>{isKh ? 'អាប់ឡូតរូបថត Cover (Choose Image)' : 'Upload Cover File'}</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleCoverUpload}
                    className="hidden"
                  />
                </label>
                <input
                  type="url"
                  value={invitation.coverImage}
                  onChange={(e) => updateInvitation({ coverImage: e.target.value })}
                  placeholder="https://..."
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 dark:text-white font-mono"
                />
              </div>

              {invitation.coverImage && (
                <div className="h-40 rounded-2xl overflow-hidden border-2 border-amber-500/40 relative shadow-md">
                  <img
                    src={invitation.coverImage}
                    alt="Cover Preview"
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-2 left-2 px-2.5 py-1 rounded-full bg-black/70 text-amber-300 text-[10px] font-bold">
                    {isKh ? 'គំរូរូបគម្រប់' : 'Cover Preview'}
                  </div>
                </div>
              )}
            </div>

            {/* Gallery Photos Upload Section */}
            <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 dark:border-slate-700 pb-3">
                <div>
                  <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider flex items-center gap-2">
                    <span>{isKh ? 'អាល់ប៊ុមរូបថតការ (Pre-wedding Photo Gallery)' : 'Photo Gallery'}</span>
                    <span className="px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 text-[10px] font-mono font-bold">
                      {(invitation.gallery || []).length} {isKh ? 'សន្លឹក' : 'photos'}
                    </span>
                  </h3>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                    {isKh ? 'អាប់ឡូតរូបថតច្រើនសន្លឹកចូលក្នុងធៀបការឌីជីថល និងកែសម្រួលទំហំបញ្ឈរ' : 'Upload photo collection for guests to view'}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <label className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-xs transition-all">
                    <Upload className="w-4 h-4" />
                    <span>{isKh ? 'អាប់ឡូតរូបថត (Upload Photos)' : 'Upload Photos'}</span>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleGalleryUpload}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              {/* Aspect Ratio & Layout Customization */}
              <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
                <label className="block text-xs font-bold text-slate-800 dark:text-slate-200">
                  {isKh ? 'ទម្រង់ទំហំរូបថតអាល់ប៊ុម (Photo Aspect Ratio & Layout):' : 'Photo Aspect Ratio:'}
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { id: '3/4', labelKh: 'ទំហំបញ្ឈរ 3:4 (ពេញនិយម)', labelEn: 'Portrait 3:4' },
                    { id: '2/3', labelKh: 'ទំហំបញ្ឈរ 2:3 (Classic)', labelEn: 'Portrait 2:3' },
                    { id: '9/16', labelKh: 'ទំហំបញ្ឈរវែង 9:16 (Story)', labelEn: 'Full Vertical 9:16' },
                    { id: '1/1', labelKh: 'ទំហំការ៉េ 1:1 (Square)', labelEn: 'Square 1:1' },
                  ].map((ratio) => {
                    const isSelected = (invitation.galleryAspectRatio || '3/4') === ratio.id;
                    return (
                      <button
                        key={ratio.id}
                        type="button"
                        onClick={() => updateInvitation({ galleryAspectRatio: ratio.id as any })}
                        className={`p-2.5 rounded-xl border text-left text-xs font-semibold transition-all cursor-pointer ${
                          isSelected
                            ? 'border-amber-500 bg-amber-500/10 text-amber-700 dark:text-amber-300 ring-2 ring-amber-500/30'
                            : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                        }`}
                      >
                        <div className="font-bold">{isKh ? ratio.labelKh : ratio.labelEn}</div>
                        <div className="text-[10px] text-slate-400 font-mono mt-0.5">{ratio.id}</div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Gallery Grid with Portrait Preview & Caption Input */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 pt-2">
                {(invitation.gallery || []).map((photo, idx) => {
                  const aspectClass =
                    invitation.galleryAspectRatio === '2/3'
                      ? 'aspect-[2/3]'
                      : invitation.galleryAspectRatio === '9/16'
                      ? 'aspect-[9/16]'
                      : invitation.galleryAspectRatio === '1/1'
                      ? 'aspect-square'
                      : 'aspect-[3/4]';

                  return (
                    <div
                      key={photo.id}
                      className="group relative rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-xs flex flex-col"
                    >
                      <div className={`relative w-full ${aspectClass} overflow-hidden bg-slate-100 dark:bg-slate-950`}>
                        <img
                          src={photo.url}
                          alt={photo.caption || 'Gallery photo'}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          referrerPolicy="no-referrer"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            const updated = (invitation.gallery || []).filter((p) => p.id !== photo.id);
                            updateInvitation({ gallery: updated });
                          }}
                          className="absolute top-2 right-2 p-1.5 rounded-full bg-rose-600 text-white opacity-90 hover:opacity-100 cursor-pointer shadow-md transition-all"
                          title="Remove Photo"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                        <div className="absolute bottom-1 left-1.5 px-2 py-0.5 rounded-md bg-black/60 text-white text-[9px] font-mono">
                          #{idx + 1}
                        </div>
                      </div>

                      {/* Caption Input */}
                      <div className="p-2 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900">
                        <input
                          type="text"
                          value={photo.caption || ''}
                          onChange={(e) => {
                            const updated = (invitation.gallery || []).map((p) =>
                              p.id === photo.id ? { ...p, caption: e.target.value } : p
                            );
                            updateInvitation({ gallery: updated });
                          }}
                          placeholder={isKh ? 'ចំណងជើងរូបថត...' : 'Photo caption...'}
                          className="w-full px-2 py-1 text-[11px] rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-800 dark:text-slate-200 outline-none focus:border-amber-500"
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Pre-wedding Video Embed */}
            <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 dark:border-slate-700 pb-3">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-xl bg-rose-500 text-white shadow-xs">
                    <Video className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
                      {isKh ? 'វីដេអូអាពាហ៍ពិពាហ៍ (Pre-wedding Video Link)' : 'Pre-wedding Video Embed'}
                    </h3>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                      {isKh ? 'គាំទ្រតំណរភ្ជាប់ YouTube គ្រប់ប្រភេទ (youtu.be, watch, shorts)' : 'Supports all YouTube URLs (youtu.be, watch, shorts)'}
                    </p>
                  </div>
                </div>

                {invitation.videoUrl && (
                  <a
                    href={getYouTubeEmbedUrl(invitation.videoUrl)}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold hover:bg-slate-300 dark:hover:bg-slate-600 transition-all self-start sm:self-auto"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>{isKh ? 'បើកមើលលើ YouTube' : 'Open YouTube'}</span>
                  </a>
                )}
              </div>

              {/* URL Input */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                  {isKh ? 'វាយបញ្ចូល ឬបិទភ្ជាប់ (Paste YouTube Link):' : 'Paste YouTube Link:'}
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={invitation.videoUrl}
                    onChange={(e) => {
                      const inputUrl = e.target.value;
                      const formattedEmbed = getYouTubeEmbedUrl(inputUrl);
                      updateInvitation({ videoUrl: formattedEmbed || inputUrl });
                    }}
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 dark:text-white font-mono outline-none focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20"
                    placeholder="https://youtu.be/qQwq0J8VQ48?si=7mGVDe8aFssNVvD0"
                  />
                </div>

                {/* Quick Link Presets / Examples */}
                <div className="flex flex-wrap items-center gap-2 pt-1">
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                    {isKh ? 'តំណភ្ជាប់គំរូ:' : 'Sample Link:'}
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      const link = 'https://youtu.be/qQwq0J8VQ48?si=7mGVDe8aFssNVvD0';
                      updateInvitation({ videoUrl: getYouTubeEmbedUrl(link) });
                    }}
                    className="px-2.5 py-1 rounded-lg bg-rose-500/10 hover:bg-rose-500 hover:text-white text-rose-600 dark:text-rose-300 font-mono text-[10px] font-bold transition-all cursor-pointer"
                  >
                    youtu.be/qQwq0J8VQ48
                  </button>
                </div>
              </div>

              {/* Live Video Preview Box */}
              {invitation.videoUrl ? (
                <div className="space-y-2 pt-2 border-t border-slate-200 dark:border-slate-700">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-amber-500" />
                      <span>{isKh ? 'ផ្ទាំងមើលវីដេអូសាកល្បង (Live Video Preview)' : 'Live Video Preview'}</span>
                    </span>
                    {getYouTubeVideoId(invitation.videoUrl) && (
                      <span className="px-2 py-0.5 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 font-mono text-[10px] font-bold">
                        ID: {getYouTubeVideoId(invitation.videoUrl)}
                      </span>
                    )}
                  </div>

                  <div className="relative rounded-2xl overflow-hidden border-2 border-rose-500/40 bg-black aspect-video shadow-lg">
                    <iframe
                      src={getYouTubeEmbedUrl(invitation.videoUrl)}
                      title="Pre-wedding video preview"
                      className="w-full h-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                </div>
              ) : (
                <div className="p-4 text-center rounded-xl border border-dashed border-slate-300 dark:border-slate-700 text-slate-400 text-xs">
                  {isKh ? 'មិនទាន់មានវីដេអូ YouTube នៅឡើយ។ សូមបិទភ្ជាប់តំណរភ្ជាប់ YouTube ខាងលើ!' : 'No YouTube video added yet. Paste a link above to preview.'}
                </div>
              )}
            </div>

            {/* Background Music & MP3 Upload Section */}
            <div className="p-5 rounded-2xl bg-amber-50/60 dark:bg-slate-800/60 border border-amber-200 dark:border-slate-700 space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-amber-200/60 dark:border-slate-700 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-amber-500 text-white shadow-xs">
                    <Music className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                      {isKh ? 'តន្ត្រីកំដររោង (Background Music & Saved MP3 Tracks)' : 'Background Music & Saved MP3 Tracks'}
                    </h3>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                      {isKh ? 'អាចអាប់ឡូតបទចម្រៀង MP3 បានច្រើនបទ និងរក្សាទុកក្នុងបញ្ជីជ្រើសរើស' : 'Upload & manage multiple MP3 tracks'}
                    </p>
                  </div>
                </div>

                <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-800 dark:text-slate-200 bg-white dark:bg-slate-900 px-3 py-1.5 rounded-xl border border-amber-300 dark:border-slate-700 shadow-xs self-start sm:self-auto">
                  <input
                    type="checkbox"
                    checked={invitation.musicAutoPlay}
                    onChange={(e) => updateInvitation({ musicAutoPlay: e.target.checked })}
                    className="rounded text-amber-600 focus:ring-amber-500 w-4 h-4 cursor-pointer"
                  />
                  <span>{isKh ? 'លេងតន្ត្រីអូតូ (Auto Play)' : 'Auto Play Music'}</span>
                </label>
              </div>

              {/* Current Active Music Track Banner */}
              <div className="p-4 rounded-xl bg-gradient-to-r from-amber-500/20 via-amber-500/10 to-amber-500/20 border-2 border-amber-500/50 dark:bg-slate-900 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => invitation.backgroundMusic?.url && togglePlayTrackPreview(invitation.backgroundMusic.url, invitation.backgroundMusic.id)}
                    className="p-3 rounded-full bg-amber-500 text-white hover:bg-amber-600 cursor-pointer shadow-md transition-transform active:scale-95 shrink-0"
                    title={playingTrackId === invitation.backgroundMusic?.id ? 'Pause Preview' : 'Play Preview'}
                  >
                    {playingTrackId === invitation.backgroundMusic?.id ? (
                      <Pause className="w-5 h-5 animate-pulse" />
                    ) : (
                      <Play className="w-5 h-5 ml-0.5" />
                    )}
                  </button>
                  <div>
                    <div className="inline-flex items-center gap-1.5 text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md bg-amber-500 text-white tracking-wider mb-1">
                      <Sparkles className="w-3 h-3" />
                      <span>{isKh ? 'បទកំពុងលេងលើធៀបការ (Active Background Track)' : 'Active Background Track'}</span>
                    </div>
                    <p className="text-xs font-bold text-slate-900 dark:text-white line-clamp-1">
                      {invitation.backgroundMusic?.title || 'មិនទាន់ជ្រើសរើស'}
                    </p>
                    <p className="text-[11px] text-slate-600 dark:text-slate-400">
                      {invitation.backgroundMusic?.artist || 'Unknown Artist'}
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-[10px] font-mono text-amber-700 dark:text-amber-300 font-bold px-2.5 py-1 rounded-lg bg-amber-100 dark:bg-amber-950/60 border border-amber-300 dark:border-amber-800/60 inline-block">
                    {(invitation.customMusicTracks || []).length + presetMusicTracks.length} {isKh ? 'បទក្នុងបញ្ជី' : 'tracks total'}
                  </span>
                </div>
              </div>

              {/* Upload Multiple MP3s & Add Link Actions */}
              <div className="space-y-3">
                <div className="flex flex-wrap items-center gap-2.5">
                  <label className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs flex items-center gap-2 cursor-pointer transition-all shadow-xs">
                    <Upload className="w-4 h-4" />
                    <span>{isKh ? 'អាប់ឡូតបទ MP3 ច្រើនបទ (Upload Multiple MP3s)' : 'Upload MP3 Files'}</span>
                    <input
                      type="file"
                      accept="audio/mp3,audio/wav,audio/m4a,audio/*"
                      multiple
                      onChange={handleAudioFileUpload}
                      className="hidden"
                    />
                  </label>

                  <button
                    type="button"
                    onClick={() => setShowAddUrlMusic(!showAddUrlMusic)}
                    className="px-4 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 hover:border-amber-500 text-slate-800 dark:text-slate-200 font-bold text-xs flex items-center gap-2 transition-all cursor-pointer"
                  >
                    <Link className="w-4 h-4 text-amber-600" />
                    <span>{isKh ? 'បន្ថែមតាម Link Audio/URL' : 'Add via Audio URL'}</span>
                  </button>
                </div>

                {/* Form to add custom track via MP3 Link */}
                {showAddUrlMusic && (
                  <form onSubmit={handleAddCustomUrlTrack} className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-amber-300 dark:border-slate-700 space-y-3 animate-in fade-in">
                    <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">
                      {isKh ? 'បន្ថែមបទចម្រៀងតាមរយៈ Link / Direct MP3 URL' : 'Add Track via Audio Link'}
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <input
                        type="text"
                        value={customMusicTitle}
                        onChange={(e) => setCustomMusicTitle(e.target.value)}
                        placeholder={isKh ? 'ចំណងជើងបទចម្រៀង (Song Title)' : 'Song Title'}
                        className="px-3 py-1.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 dark:text-white"
                        required
                      />
                      <input
                        type="text"
                        value={customMusicArtist}
                        onChange={(e) => setCustomMusicArtist(e.target.value)}
                        placeholder={isKh ? 'ឈ្មោះអ្នកចម្រៀង/វង់តន្ត្រី (Artist Name)' : 'Artist Name'}
                        className="px-3 py-1.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 dark:text-white"
                      />
                    </div>
                    <input
                      type="url"
                      value={customMusicUrl}
                      onChange={(e) => setCustomMusicUrl(e.target.value)}
                      placeholder="https://example.com/song.mp3"
                      className="w-full px-3 py-1.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 dark:text-white font-mono"
                      required
                    />
                    <div className="flex justify-end gap-2 pt-1">
                      <button
                        type="button"
                        onClick={() => setShowAddUrlMusic(false)}
                        className="px-3 py-1.5 rounded-lg border border-slate-300 text-xs text-slate-600 dark:text-slate-300"
                      >
                        {isKh ? 'បោះបង់' : 'Cancel'}
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs"
                      >
                        {isKh ? 'រក្សាទុកបទចម្រៀង' : 'Save Track'}
                      </button>
                    </div>
                  </form>
                )}
              </div>

              {/* Saved Custom Tracks Library List */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
                    <ListMusic className="w-4 h-4 text-amber-600" />
                    <span>{isKh ? 'បញ្ជីបទចម្រៀងផ្ទាល់ខ្លួនដែលបានរក្សាទុក (Custom Saved Library)' : 'Custom Saved Tracks Library'}</span>
                  </h4>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">
                    {(invitation.customMusicTracks || []).length} {isKh ? 'បទ' : 'items'}
                  </span>
                </div>

                {(invitation.customMusicTracks || []).length === 0 ? (
                  <div className="p-4 text-center rounded-xl border border-dashed border-slate-300 dark:border-slate-700 text-slate-500 text-xs">
                    {isKh ? 'មិនទាន់មានបទចម្រៀងផ្ទាល់ខ្លួននៅឡើយ។ សូមចុច "អាប់ឡូតបទ MP3" ដើម្បីបន្ថែម!' : 'No custom tracks saved yet. Click "Upload MP3 Files" above to add songs.'}
                  </div>
                ) : (
                  <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                    {(invitation.customMusicTracks || []).map((track) => {
                      const isActive = invitation.backgroundMusic?.id === track.id;
                      const isEditing = editingTrackId === track.id;

                      return (
                        <div
                          key={track.id}
                          className={`p-3 rounded-xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 ${
                            isActive
                              ? 'bg-amber-50 dark:bg-slate-900 border-amber-500 ring-2 ring-amber-500/30'
                              : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800'
                          }`}
                        >
                          <div className="flex items-center gap-3 min-w-0 flex-1">
                            {/* Preview play button */}
                            <button
                              type="button"
                              onClick={() => togglePlayTrackPreview(track.url, track.id)}
                              className={`p-2 rounded-lg cursor-pointer transition-all shrink-0 ${
                                playingTrackId === track.id
                                  ? 'bg-amber-500 text-white'
                                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-amber-100'
                              }`}
                              title="Play/Pause Preview"
                            >
                              {playingTrackId === track.id ? (
                                <Pause className="w-4 h-4 animate-pulse" />
                              ) : (
                                <Play className="w-4 h-4 ml-0.5" />
                              )}
                            </button>

                            {isEditing ? (
                              <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-2">
                                <input
                                  type="text"
                                  value={editTrackTitle}
                                  onChange={(e) => setEditTrackTitle(e.target.value)}
                                  className="px-2 py-1 text-xs rounded border border-slate-300 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                                  placeholder="Track Title"
                                />
                                <input
                                  type="text"
                                  value={editTrackArtist}
                                  onChange={(e) => setEditTrackArtist(e.target.value)}
                                  className="px-2 py-1 text-xs rounded border border-slate-300 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                                  placeholder="Artist"
                                />
                              </div>
                            ) : (
                              <div className="min-w-0 flex-1">
                                <div className="flex items-center gap-2">
                                  <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
                                    {track.title}
                                  </p>
                                  {isActive && (
                                    <span className="px-2 py-0.5 rounded-full bg-amber-500 text-white text-[9px] font-bold">
                                      {isKh ? 'សកម្ម' : 'Active'}
                                    </span>
                                  )}
                                </div>
                                <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate">
                                  {track.artist}
                                </p>
                              </div>
                            )}
                          </div>

                          <div className="flex items-center gap-1.5 self-end sm:self-auto shrink-0">
                            {isEditing ? (
                              <button
                                type="button"
                                onClick={() => handleSaveEditedTrack(track.id)}
                                className="px-2.5 py-1 rounded-lg bg-emerald-600 text-white text-xs font-bold flex items-center gap-1 cursor-pointer"
                              >
                                <Check className="w-3.5 h-3.5" />
                                <span>{isKh ? 'រក្សាទុក' : 'Save'}</span>
                              </button>
                            ) : (
                              <>
                                {!isActive && (
                                  <button
                                    type="button"
                                    onClick={() => updateInvitation({ backgroundMusic: track })}
                                    className="px-2.5 py-1 rounded-lg bg-amber-500/10 hover:bg-amber-500 hover:text-white text-amber-700 dark:text-amber-300 text-xs font-bold transition-all cursor-pointer"
                                  >
                                    {isKh ? 'ជ្រើសជាបទសកម្ម' : 'Set Active'}
                                  </button>
                                )}
                                <button
                                  type="button"
                                  onClick={() => {
                                    setEditingTrackId(track.id);
                                    setEditTrackTitle(track.title);
                                    setEditTrackArtist(track.artist);
                                  }}
                                  className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                                  title="Edit Title & Artist"
                                >
                                  <Edit2 className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleDeleteCustomTrack(track.id)}
                                  className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 cursor-pointer"
                                  title="Delete Track"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* System Preset Mohori Collection */}
              <div className="space-y-2 pt-2 border-t border-amber-200/60 dark:border-slate-700">
                <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
                  {isKh ? 'បទចម្រៀងប្រព័ន្ធ (System Preset Traditional Tracks)' : 'System Preset Mohori Tracks'}
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {presetMusicTracks.map((track) => {
                    const isActive = invitation.backgroundMusic?.id === track.id;
                    return (
                      <div
                        key={track.id}
                        className={`p-2.5 rounded-xl border transition-all flex items-center justify-between gap-2 ${
                          isActive
                            ? 'bg-amber-500 text-white border-amber-500 shadow-xs'
                            : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200'
                        }`}
                      >
                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-bold truncate">{track.title}</p>
                          <p className={`text-[10px] truncate ${isActive ? 'text-amber-100' : 'text-slate-400'}`}>
                            {track.artist}
                          </p>
                        </div>

                        <div className="flex items-center gap-1 shrink-0">
                          <button
                            type="button"
                            onClick={() => togglePlayTrackPreview(track.url, track.id)}
                            className={`p-1.5 rounded-lg transition-all cursor-pointer ${
                              isActive
                                ? 'bg-white/20 hover:bg-white/30 text-white'
                                : 'bg-slate-100 dark:bg-slate-800 hover:bg-amber-100 text-slate-700'
                            }`}
                            title="Preview Track"
                          >
                            {playingTrackId === track.id ? (
                              <Pause className="w-3.5 h-3.5 animate-pulse" />
                            ) : (
                              <Play className="w-3.5 h-3.5" />
                            )}
                          </button>
                          {!isActive && (
                            <button
                              type="button"
                              onClick={() => updateInvitation({ backgroundMusic: track })}
                              className="px-2 py-1 rounded-lg bg-amber-500/10 text-amber-700 dark:text-amber-300 font-bold text-[10px] hover:bg-amber-500 hover:text-white transition-all cursor-pointer"
                            >
                              {isKh ? 'ជ្រើស' : 'Select'}
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {renderSaveFooterBar('រូបថត តន្ត្រី & វីដេអូ', 'Media & Music')}
          </div>
        )}

        {/* TAB 6: THEME & FONTS */}
        {activeSubTab === 'theme' && (
          <div className="space-y-6">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white font-serif border-b pb-3 border-slate-100 dark:border-slate-800">
              {isKh ? 'ជម្រើសពណ៌ប្រណិត & ពុម្ពអក្សរខ្មែរ (Luxury Colors & Khmer Fonts)' : 'Theme Color & Khmer Fonts'}
            </h2>

            {/* Preset Color Palettes */}
            <div>
              <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-3">
                {isKh ? 'កំណត់ពុម្ពពណ៌ Theme (Preset Palettes)' : 'Preset Theme Palettes'}
              </label>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                <button
                  type="button"
                  onClick={() => updateInvitation({ themeColor: 'gold' })}
                  className={`p-3 rounded-2xl border text-center transition-all cursor-pointer ${
                    invitation.themeColor === 'gold'
                      ? 'ring-2 ring-amber-500 border-amber-500 bg-amber-50 dark:bg-amber-950/40'
                      : 'border-slate-200 dark:border-slate-700'
                  }`}
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-amber-500 to-yellow-300 mx-auto mb-1.5 shadow-xs" />
                  <span className="text-xs font-bold block text-slate-800 dark:text-slate-200">
                    {isKh ? 'ពណ៍មាស (Gold)' : 'Royal Gold'}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => updateInvitation({ themeColor: 'rose' })}
                  className={`p-3 rounded-2xl border text-center transition-all cursor-pointer ${
                    invitation.themeColor === 'rose'
                      ? 'ring-2 ring-pink-500 border-pink-500 bg-pink-50 dark:bg-pink-950/40'
                      : 'border-slate-200 dark:border-slate-700'
                  }`}
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-pink-500 to-rose-300 mx-auto mb-1.5 shadow-xs" />
                  <span className="text-xs font-bold block text-slate-800 dark:text-slate-200">
                    {isKh ? 'រ៉ូសហ្គូល (Rose Gold)' : 'Rose Gold'}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => updateInvitation({ themeColor: 'burgundy' })}
                  className={`p-3 rounded-2xl border text-center transition-all cursor-pointer ${
                    invitation.themeColor === 'burgundy'
                      ? 'ring-2 ring-red-700 border-red-700 bg-red-50 dark:bg-red-950/40'
                      : 'border-slate-200 dark:border-slate-700'
                  }`}
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-red-900 to-red-600 mx-auto mb-1.5 shadow-xs" />
                  <span className="text-xs font-bold block text-slate-800 dark:text-slate-200">
                    {isKh ? 'ប៊ឺហ្គនឌី (Burgundy)' : 'Royal Burgundy'}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => updateInvitation({ themeColor: 'emerald' })}
                  className={`p-3 rounded-2xl border text-center transition-all cursor-pointer ${
                    invitation.themeColor === 'emerald'
                      ? 'ring-2 ring-emerald-600 border-emerald-600 bg-emerald-50 dark:bg-emerald-950/40'
                      : 'border-slate-200 dark:border-slate-700'
                  }`}
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-emerald-700 to-emerald-400 mx-auto mb-1.5 shadow-xs" />
                  <span className="text-xs font-bold block text-slate-800 dark:text-slate-200">
                    {isKh ? 'មរកត (Emerald)' : 'Emerald Khmer'}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => updateInvitation({ themeColor: 'navy' })}
                  className={`p-3 rounded-2xl border text-center transition-all cursor-pointer ${
                    invitation.themeColor === 'navy'
                      ? 'ring-2 ring-indigo-800 border-indigo-800 bg-indigo-50 dark:bg-indigo-950/40'
                      : 'border-slate-200 dark:border-slate-700'
                  }`}
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-slate-900 to-indigo-900 mx-auto mb-1.5 shadow-xs" />
                  <span className="text-xs font-bold block text-slate-800 dark:text-slate-200">
                    {isKh ? 'ខៀវប្រណិត (Navy Gold)' : 'Royal Navy'}
                  </span>
                </button>
              </div>
            </div>

            {/* Custom Color Pickers */}
            <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-4">
              <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
                {isKh ? 'កែច្នៃពណ៌ផ្ទាល់ខ្លួន (Custom Hex Color Picker)' : 'Custom Hex Colors'}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    {isKh ? 'ពណ៌ចម្បង (Primary Accent)' : 'Primary Color'}
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={invitation.customPrimaryColor || '#D4AF37'}
                      onChange={(e) => updateInvitation({ customPrimaryColor: e.target.value })}
                      className="w-10 h-10 rounded-xl border border-slate-300 dark:border-slate-700 cursor-pointer p-0.5 bg-white"
                    />
                    <input
                      type="text"
                      value={invitation.customPrimaryColor || '#D4AF37'}
                      onChange={(e) => updateInvitation({ customPrimaryColor: e.target.value })}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 dark:text-white font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    {isKh ? 'ពណ៌ផ្ទៃខាងក្រោយ (Background Color)' : 'Background Color'}
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={invitation.customBgColor || '#FAF7F2'}
                      onChange={(e) => updateInvitation({ customBgColor: e.target.value })}
                      className="w-10 h-10 rounded-xl border border-slate-300 dark:border-slate-700 cursor-pointer p-0.5 bg-white"
                    />
                    <input
                      type="text"
                      value={invitation.customBgColor || '#FAF7F2'}
                      onChange={(e) => updateInvitation({ customBgColor: e.target.value })}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 dark:text-white font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    {isKh ? 'ពណ៌អក្សរ (Text Color)' : 'Text Color'}
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={invitation.customTextColor || '#241E17'}
                      onChange={(e) => updateInvitation({ customTextColor: e.target.value })}
                      className="w-10 h-10 rounded-xl border border-slate-300 dark:border-slate-700 cursor-pointer p-0.5 bg-white"
                    />
                    <input
                      type="text"
                      value={invitation.customTextColor || '#241E17'}
                      onChange={(e) => updateInvitation({ customTextColor: e.target.value })}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 dark:text-white font-mono"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Khmer Fonts Configurator */}
            <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-4">
              <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
                {isKh ? 'ជ្រើសរើសពុម្ពអក្សរខ្មែរ (Khmer Fonts Selection)' : 'Khmer Fonts Configuration'}
              </h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    {isKh ? 'ពុម្ពអក្សរទូទៅក្នុងធៀប (Global Body Font)' : 'Global Body Font'}
                  </label>
                  <select
                    value={invitation.fontFamily || 'kantumruuy'}
                    onChange={(e) => updateInvitation({ fontFamily: e.target.value })}
                    className="w-full p-2.5 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 dark:text-white font-semibold"
                  >
                    <option value="kantumruuy">ពុម្ពអក្សរ កណ្ដុររុយ (Kantumruy Pro)</option>
                    <option value="battambang">ពុម្ពអក្សរ បាត់ដំបង (Battambang)</option>
                    <option value="siemreap">ពុម្ពអក្សរ សៀមរាប (Siemreap)</option>
                    <option value="content">ពុម្ពអក្សរ ក nội dung (Content Serif)</option>
                    <option value="preahvihear">ពុម្ពអក្សរ ព្រះវិហារ (Preahvihear)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    {isKh ? 'ពុម្ពអក្សរឈ្មោះសាម៉ីខ្លួន (Groom & Bride Font)' : 'Groom & Bride Name Font'}
                  </label>
                  <select
                    value={invitation.groomBrideFont || 'muol'}
                    onChange={(e) => updateInvitation({ groomBrideFont: e.target.value })}
                    className="w-full p-2.5 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 dark:text-white font-semibold"
                  >
                    <option value="muol">ពុម្ពអក្សរ មុល (Moul - ខ្មែរប្រពៃណី)</option>
                    <option value="battambang">ពុម្ពអក្សរ បាត់ដំបង (Battambang)</option>
                    <option value="siemreap">ពុម្ពអក្សរ សៀមរាប (Siemreap)</option>
                    <option value="kantumruuy">ពុម្ពអក្សរ កណ្ដុររុយ (Kantumruy Pro)</option>
                    <option value="koulen">ពុម្ពអក្សរ គូលែន (Koulen)</option>
                    <option value="bayon">ពុម្ពអក្សរ បាយ័ន (Bayon)</option>
                    <option value="dangrek">ពុម្ពអក្សរ ដងរែក (Dangrek)</option>
                    <option value="preahvihear">ពុម្ពអក្សរ ព្រះវិហារ (Preahvihear)</option>
                    <option value="taprom">ពុម្ពអក្សរ តាព្រហ្ម (Taprom)</option>
                    <option value="content">ពុម្ពអក្សរ ក nội dung (Content)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    {isKh ? 'ពុម្ពអក្សរលិខិតអញ្ជើញ (Formal Speech Font)' : 'Formal Speech Font'}
                  </label>
                  <select
                    value={invitation.speechFont || 'kantumruuy'}
                    onChange={(e) => updateInvitation({ speechFont: e.target.value })}
                    className="w-full p-2.5 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 dark:text-white font-semibold"
                  >
                    <option value="kantumruuy">ពុម្ពអក្សរ កណ្ដុររុយ (Kantumruy Pro)</option>
                    <option value="battambang">ពុម្ពអក្សរ បាត់ដំបង (Battambang)</option>
                    <option value="siemreap">ពុម្ពអក្សរ សៀមរាប (Siemreap)</option>
                    <option value="content">ពុម្ពអក្សរ ក nội dung (Content Serif)</option>
                    <option value="muol">ពុម្ពអក្សរ មុល (Moul)</option>
                    <option value="preahvihear">ពុម្ពអក្សរ ព្រះវិហារ (Preahvihear)</option>
                  </select>
                </div>
              </div>
            </div>

            {renderSaveFooterBar('ពណ៌ & ពុម្ពអក្សរ', 'Theme & Fonts')}
          </div>
        )}

        {/* TAB 7: BANK & ABA GIFT QR */}
        {activeSubTab === 'bank' && (
          <div className="space-y-6">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white font-serif border-b pb-3 border-slate-100 dark:border-slate-800">
              {isKh ? 'ព័ត៌មានចងដៃ & QR Code ធនាគារ ABA' : 'Gift QR Code & Banking'}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  {isKh ? 'ឈ្មោះធនាគារ (Bank Name)' : 'Bank Name'}
                </label>
                <input
                  type="text"
                  value={invitation.bankInfo?.bankName || 'ABA Bank'}
                  onChange={(e) =>
                    updateInvitation({
                      bankInfo: { ...(invitation.bankInfo || { accountName: '', accountNumber: '', qrImageUrl: '' }), bankName: e.target.value },
                    })
                  }
                  className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  {isKh ? 'ឈ្មោះម្ចាស់គណនី (Account Name)' : 'Account Name'}
                </label>
                <input
                  type="text"
                  value={invitation.bankInfo?.accountName || ''}
                  onChange={(e) =>
                    updateInvitation({
                      bankInfo: { ...(invitation.bankInfo || { bankName: 'ABA Bank', accountNumber: '', qrImageUrl: '' }), accountName: e.target.value },
                    })
                  }
                  className="w-full px-3.5 py-2 text-sm font-semibold rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  {isKh ? 'លេខគណនី (Account Number)' : 'Account Number'}
                </label>
                <input
                  type="text"
                  value={invitation.bankInfo?.accountNumber || ''}
                  onChange={(e) =>
                    updateInvitation({
                      bankInfo: { ...(invitation.bankInfo || { bankName: 'ABA Bank', accountName: '', qrImageUrl: '' }), accountNumber: e.target.value },
                    })
                  }
                  className="w-full px-3.5 py-2 text-sm font-mono font-bold rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 dark:text-white"
                />
              </div>

              {/* ABA QR File Upload */}
              <div>
                <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1">
                  {isKh ? 'អាប់ឡូតរូបភាព ABA KHQR (Upload Image File)' : 'Upload ABA KHQR Image'}
                </label>
                <div className="flex flex-col sm:flex-row gap-2">
                  <label className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer shrink-0 shadow-xs">
                    <Upload className="w-4 h-4" />
                    <span>{isKh ? 'ជ្រើសរើសរូប QR' : 'Choose QR File'}</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleQrUpload}
                      className="hidden"
                    />
                  </label>
                  <input
                    type="url"
                    value={invitation.bankInfo?.qrImageUrl || ''}
                    onChange={(e) =>
                      updateInvitation({
                        bankInfo: { ...(invitation.bankInfo || { bankName: 'ABA Bank', accountName: '', accountNumber: '' }), qrImageUrl: e.target.value },
                      })
                    }
                    placeholder="https://..."
                    className="w-full px-3 py-1.5 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 font-mono"
                  />
                </div>
              </div>
            </div>

            {/* ABA QR Code Live Card Preview */}
            {invitation.bankInfo?.qrImageUrl && (
              <div className="p-5 rounded-2xl bg-[#005E82] text-white text-center space-y-3 shadow-lg max-w-xs mx-auto border-2 border-white/20">
                <p className="text-xs font-bold uppercase tracking-wider">{invitation.bankInfo.bankName || 'ABA BANK'} KHQR</p>
                <div className="w-44 h-44 bg-white p-2 rounded-xl mx-auto shadow-md flex items-center justify-center">
                  <img
                    src={invitation.bankInfo.qrImageUrl}
                    alt="ABA QR"
                    className="w-full h-full object-contain rounded-lg"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div>
                  <p className="text-sm font-bold">{invitation.bankInfo.accountName}</p>
                  <p className="text-xs font-mono opacity-80">{invitation.bankInfo.accountNumber}</p>
                </div>
              </div>
            )}

            {renderSaveFooterBar('ចងដៃ & ABA QR', 'Gift & Banking')}
          </div>
        )}

        {/* TAB 8: ACKNOWLEDGEMENTS & CREATOR BRANDING */}
        {activeSubTab === 'credits' && (
          <div className="space-y-6">
            <h2 className="text-lg font-bold text-[#E0E0E0] font-serif border-b pb-3 border-[#2D3139]">
              {isKh ? 'កែសម្រួលព័ត៌មានថ្លែងអំណរគុណ និងអ្នកបង្កើត (E-THEAP)' : 'Acknowledgements & Creator Branding'}
            </h2>

            {/* Acknowledgements Section */}
            <div className="p-5 rounded-2xl bg-[#241E17] border border-[#D4AF37]/40 space-y-4 shadow-md">
              <h3 className="text-xs font-bold text-[#D4AF37] uppercase tracking-wider flex items-center gap-2">
                <HandHeart className="w-4 h-4 text-[#D4AF37]" />
                <span>{isKh ? 'ផ្នែកសូមថ្លែងអំណរគុណ (Acknowledgements / Sponsors)' : 'Acknowledgements / Sponsors'}</span>
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-xs font-semibold text-[#D4AF37] mb-1">
                    {isKh ? 'ចំណងជើងផ្នែកថ្លែងអំណរគុណ (Acknowledgement Title)' : 'Title'}
                  </label>
                  <input
                    type="text"
                    value={invitation.acknowledgementTitle || ''}
                    onChange={(e) => updateInvitation({ acknowledgementTitle: e.target.value })}
                    className="w-full px-3.5 py-2 text-sm rounded-xl border border-[#2D3139] bg-[#14100C] text-[#F3E5C8] focus:border-[#D4AF37] outline-none"
                    placeholder="សូមថ្លែងអំណរគុណ"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#8E9299] mb-1">
                    {isKh ? 'សម្លៀកបំពាក់ និងដេគ័រ (Clothing & Decor Sponsor)' : 'Clothing & Decor'}
                  </label>
                  <input
                    type="text"
                    value={invitation.decorSponsor || ''}
                    onChange={(e) => updateInvitation({ decorSponsor: e.target.value })}
                    className="w-full px-3.5 py-2 text-sm rounded-xl border border-[#2D3139] bg-[#14100C] text-[#F3E5C8] focus:border-[#D4AF37] outline-none"
                    placeholder="Image Hunter / Perfect Studio"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#8E9299] mb-1">
                    {isKh ? 'ថតរូប និងវីដេអូ (Photography & Video Team)' : 'Photography & Video'}
                  </label>
                  <input
                    type="text"
                    value={invitation.photographySponsor || ''}
                    onChange={(e) => updateInvitation({ photographySponsor: e.target.value })}
                    className="w-full px-3.5 py-2 text-sm rounded-xl border border-[#2D3139] bg-[#14100C] text-[#F3E5C8] focus:border-[#D4AF37] outline-none"
                    placeholder="ក្រុមការងាររៀបចំអាពាហ៍ពិពាហ៍ សុភមង្គល"
                  />
                </div>
              </div>
            </div>

            {/* Creator Branding Section */}
            <div className="p-5 rounded-2xl bg-[#14100C] border border-[#2D3139] space-y-4 shadow-md">
              <h3 className="text-xs font-bold text-[#D4AF37] uppercase tracking-wider">
                {isKh ? 'ព័ត៌មានអ្នកបង្កើតធៀបការ (E-THEAP Digital Invitation Branding)' : 'Creator Branding'}
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#8E9299] mb-1">
                    {isKh ? 'អក្សរ Logo សម្គាល់ (e.g. E)' : 'Logo Symbol'}
                  </label>
                  <input
                    type="text"
                    value={invitation.creatorLogoText || ''}
                    onChange={(e) => updateInvitation({ creatorLogoText: e.target.value })}
                    className="w-full px-3.5 py-2 text-sm font-bold text-center rounded-xl border border-[#2D3139] bg-[#1D1711] text-[#D4AF37] focus:border-[#D4AF37] outline-none"
                    placeholder="E"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#8E9299] mb-1">
                    {isKh ? 'ឈ្មោះម៉ាក/អ្នកបង្កើត (Creator Brand Name)' : 'Brand Name'}
                  </label>
                  <input
                    type="text"
                    value={invitation.creatorBrandName || ''}
                    onChange={(e) => updateInvitation({ creatorBrandName: e.target.value })}
                    className="w-full px-3.5 py-2 text-sm font-semibold rounded-xl border border-[#2D3139] bg-[#1D1711] text-[#F3E5C8] focus:border-[#D4AF37] outline-none"
                    placeholder="បង្កើតដោយ E-THEAP"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#8E9299] mb-1">
                    {isKh ? 'ពាក្យស្លោក/ការពិពណ៌នា (Creator Description)' : 'Creator Description'}
                  </label>
                  <input
                    type="text"
                    value={invitation.creatorDescription || ''}
                    onChange={(e) => updateInvitation({ creatorDescription: e.target.value })}
                    className="w-full px-3.5 py-2 text-sm rounded-xl border border-[#2D3139] bg-[#1D1711] text-[#F3E5C8] focus:border-[#D4AF37] outline-none"
                    placeholder="យើងខ្ញុំបង្កើតធៀបការឌីជីថល ស្អាត ប្រណិត និងទាន់សម័យ"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#8E9299] mb-1">
                    {isKh ? 'លេខទូរស័ព្ទទំនាក់ទំនង (Contact Phone)' : 'Contact Phone'}
                  </label>
                  <input
                    type="text"
                    value={invitation.creatorPhone || ''}
                    onChange={(e) => updateInvitation({ creatorPhone: e.target.value })}
                    className="w-full px-3.5 py-2 text-sm font-mono font-bold rounded-xl border border-[#2D3139] bg-[#1D1711] text-[#D4AF37] focus:border-[#D4AF37] outline-none"
                    placeholder="096 739 9063"
                  />
                </div>
              </div>
            </div>

            {renderSaveFooterBar('ថ្លែងអំណរគុណ & អ្នកបង្កើត', 'Credits & Branding')}
          </div>
        )}

        {/* TAB 9: UNLIMITED GUEST LIST RECORDING & SHARE LINK MANAGER */}
        {activeSubTab === 'guest_link' && (
          <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b pb-4 border-slate-100 dark:border-slate-800">
              <div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white font-serif flex items-center gap-2">
                  <Users className="w-5 h-5 text-amber-500" />
                  <span>{isKh ? 'កត់ត្រា និងបង្កើតលីងបញ្ជីឈ្មោះភ្ញៀវ (មិនកំណត់ចំនួន)' : 'Unlimited Guest List & Link Manager'}</span>
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  {isKh
                    ? 'បន្ថែមឈ្មោះភ្ញៀវម្នាក់ៗ ឬ អាប់ឡូតបញ្ជីឈ្មោះម្ដងច្រើននាក់ពី Excel/Telegram ដោយសេរីមិនកំណត់ចំនួន!'
                    : 'Log unlimited guest names, import bulk lists from Excel/Word, and share unique personalized links.'}
                </p>
              </div>

              {/* Action Buttons Toolbar */}
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => setShowBulkImport(!showBulkImport)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-xs ${
                    showBulkImport
                      ? 'bg-purple-600 text-white'
                      : 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/30 hover:bg-purple-500/20'
                  }`}
                >
                  <ListPlus className="w-4 h-4" />
                  <span>{isKh ? 'បន្ថែមម្ដងច្រើននាក់ (Bulk Import)' : 'Bulk Add Guests'}</span>
                </button>

                <button
                  type="button"
                  onClick={handleExportCSV}
                  disabled={(invitation.guestList || []).length === 0}
                  className="px-3.5 py-2 rounded-xl text-xs font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/20 transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed shadow-xs"
                >
                  <FileSpreadsheet className="w-4 h-4" />
                  <span>{isKh ? 'ទាញយក CSV/Excel' : 'Export CSV'}</span>
                </button>

                <button
                  type="button"
                  onClick={handleCopyAllLinks}
                  disabled={(invitation.guestList || []).length === 0}
                  className="px-3.5 py-2 rounded-xl text-xs font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/30 hover:bg-amber-500/20 transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed shadow-xs"
                >
                  {copiedAllLinks ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                  <span>{copiedAllLinks ? (isKh ? 'បានចម្លងទាំងអស់' : 'Copied All') : (isKh ? 'ចម្លងលីងទាំងអស់' : 'Copy All Links')}</span>
                </button>
              </div>
            </div>

            {/* Summary Statistics Bar */}
            {(() => {
              const allList = invitation.guestList || [];
              const totalGuests = allList.length;
              const totalSent = allList.filter((g) => g.status === 'sent').length;
              const totalPending = allList.filter((g) => g.status === 'pending' || !g.status).length;
              const totalSeats = allList.reduce((sum, g) => sum + (g.guestCount || 1), 0);

              return (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-800 dark:text-amber-300">
                    <p className="text-[11px] font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider">
                      {isKh ? '👥 ភ្ញៀវសរុប (Total)' : 'Total Guests'}
                    </p>
                    <p className="text-xl font-extrabold font-serif mt-1">{totalGuests} <span className="text-xs font-normal font-sans">{isKh ? 'នាក់' : 'persons'}</span></p>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-800 dark:text-emerald-300">
                    <p className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
                      {isKh ? '✉️ បានផ្ញើរួច (Sent)' : 'Invitations Sent'}
                    </p>
                    <p className="text-xl font-extrabold font-serif mt-1">{totalSent} <span className="text-xs font-normal font-sans">{isKh ? 'នាក់' : 'sent'}</span></p>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-orange-500/10 border border-orange-500/30 text-orange-800 dark:text-orange-300">
                    <p className="text-[11px] font-bold text-orange-600 dark:text-orange-400 uppercase tracking-wider">
                      {isKh ? '⏳ មិនទាន់ផ្ញើ (Pending)' : 'Pending Links'}
                    </p>
                    <p className="text-xl font-extrabold font-serif mt-1">{totalPending} <span className="text-xs font-normal font-sans">{isKh ? 'នាក់' : 'pending'}</span></p>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-purple-500/10 border border-purple-500/30 text-purple-800 dark:text-purple-300">
                    <p className="text-[11px] font-bold text-purple-600 dark:text-purple-400 uppercase tracking-wider">
                      {isKh ? '🎟️ កៅអីរំពឹងទុក (Seats)' : 'Expected Seats'}
                    </p>
                    <p className="text-xl font-extrabold font-serif mt-1">{totalSeats} <span className="text-xs font-normal font-sans">{isKh ? 'កៅអី' : 'seats'}</span></p>
                  </div>
                </div>
              );
            })()}

            {/* Bulk Import Expandable Box */}
            {showBulkImport && (
              <div className="p-5 rounded-2xl bg-purple-950/40 border-2 border-purple-500/50 space-y-4 animate-fadeIn">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-purple-200 flex items-center gap-2">
                    <UserPlus className="w-4 h-4 text-purple-400" />
                    <span>{isKh ? 'អាប់ឡូត/បញ្ចូលឈ្មោះភ្ញៀវច្រើននាក់ (Bulk Import Guest Names)' : 'Bulk Import Guest Names'}</span>
                  </h3>
                  <button
                    type="button"
                    onClick={() => setShowBulkImport(false)}
                    className="p-1 text-purple-300 hover:text-white cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <p className="text-xs text-purple-200/80 leading-relaxed">
                  {isKh
                    ? 'ចម្លង (Copy) បញ្ជីឈ្មោះភ្ញៀវពី Excel, Word, ឬ Telegram រួចបិទ (Paste) ចុះក្រោមក្នុងមួយជួរមួយឈ្មោះ។ ប្រព័ន្ធនឹងកត់ត្រា និងបង្កើតលីងជូនភ្ញៀវគ្រប់គ្នាស្វ័យប្រវត្តិ!'
                    : 'Paste names line-by-line from Excel, Word, or messages. Links will be generated automatically for each guest.'}
                </p>

                <div className="space-y-3">
                  <div className="flex flex-col sm:flex-row gap-3">
                    <div className="w-full sm:w-1/2">
                      <label className="block text-xs font-semibold text-purple-200 mb-1">
                        {isKh ? 'ជ្រើសរើសក្រុម/ប្រភេទសម្រាប់បញ្ជីនេះ:' : 'Select Default Category:'}
                      </label>
                      <select
                        value={bulkCategory}
                        onChange={(e) => setBulkCategory(e.target.value as any)}
                        className="w-full px-3 py-2 text-xs font-bold rounded-xl border border-purple-500/40 bg-slate-900 text-white"
                      >
                        <option value="general">{isKh ? 'ភ្ញៀវទូទៅ' : 'General Guests'}</option>
                        <option value="groom_family">{isKh ? 'សាច់ញាតិខាងប្រុស' : "Groom's Family"}</option>
                        <option value="bride_family">{isKh ? 'សាច់ញាតិខាងស្រី' : "Bride's Family"}</option>
                        <option value="friends">{isKh ? 'មិត្តភក្តិ' : 'Friends'}</option>
                        <option value="colleagues">{isKh ? 'សហការី' : 'Colleagues'}</option>
                        <option value="vip">{isKh ? 'ភ្ញៀវកិត្តិយស VIP' : 'VIP Guests'}</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-purple-200 mb-1">
                      {isKh ? 'បញ្ជីឈ្មោះភ្ញៀវ (ម្នាក់ក្នុងមួយជួរ):' : 'Paste Names (One per line):'}
                    </label>
                    <textarea
                      rows={5}
                      value={bulkNamesInput}
                      onChange={(e) => setBulkNamesInput(e.target.value)}
                      placeholder={`ឯកឧត្តម សុខ ចាន់\nលោកជំទាវ មីនា\nលោក សុភា និងភរិយា\nកញ្ញា រតនា...`}
                      className="w-full p-3 text-xs font-medium rounded-xl border border-purple-500/40 bg-slate-900 text-white placeholder-slate-500 outline-none focus:border-purple-400 font-mono"
                    />
                  </div>

                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setShowBulkImport(false)}
                      className="px-4 py-2 rounded-xl text-xs font-bold text-slate-300 hover:bg-slate-800 cursor-pointer"
                    >
                      {isKh ? 'បោះបង់' : 'Cancel'}
                    </button>
                    <button
                      type="button"
                      onClick={handleBulkAddGuests}
                      disabled={!bulkNamesInput.trim()}
                      className="px-5 py-2 rounded-xl text-xs font-bold bg-purple-600 hover:bg-purple-500 text-white shadow-md flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                    >
                      <Plus className="w-4 h-4" />
                      <span>{isKh ? 'រក្សាទុកបញ្ជីឈ្មោះទាំងអស់' : 'Import All Names'}</span>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Single Add / Edit Guest Form */}
            <form
              onSubmit={handleAddSingleGuest}
              className="p-5 rounded-2xl bg-amber-500/10 border border-amber-500/40 space-y-4"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold text-amber-800 dark:text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
                  <UserPlus className="w-4 h-4 text-amber-500" />
                  <span>
                    {editingGuestId
                      ? isKh ? 'កែប្រែព័ត៌មានភ្ញៀវ' : 'Edit Guest Details'
                      : isKh ? '១. បន្ថែមឈ្មោះភ្ញៀវថ្មី (Add Single Guest)' : '1. Add Single Guest'}
                  </span>
                </h3>

                {editingGuestId && (
                  <button
                    type="button"
                    onClick={handleCancelEditGuest}
                    className="text-xs font-bold text-red-500 hover:text-red-700 flex items-center gap-1 cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                    <span>{isKh ? 'បោះបង់ការកែប្រែ' : 'Cancel Edit'}</span>
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {/* Name */}
                <div className="space-y-1 lg:col-span-2">
                  <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300">
                    {isKh ? 'ឈ្មោះ / គោរមងារភ្ញៀវ *' : 'Guest Name / Title *'}
                  </label>
                  <input
                    type="text"
                    required
                    value={newGuestName}
                    onChange={(e) => setNewGuestName(e.target.value)}
                    placeholder="ឧទាហរណ៍៖ ឯកឧត្តម សុខ ចាន់"
                    className="w-full px-3.5 py-2 text-xs font-bold rounded-xl border border-amber-300 dark:border-amber-700 bg-white dark:bg-slate-900 dark:text-white"
                  />
                </div>

                {/* Category */}
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300">
                    {isKh ? 'ក្រុម/ប្រភេទភ្ញៀវ' : 'Group/Category'}
                  </label>
                  <select
                    value={newGuestCategory}
                    onChange={(e) => setNewGuestCategory(e.target.value as any)}
                    className="w-full px-3.5 py-2 text-xs font-bold rounded-xl border border-amber-300 dark:border-amber-700 bg-white dark:bg-slate-900 dark:text-white"
                  >
                    <option value="general">{isKh ? 'ភ្ញៀវទូទៅ' : 'General Guests'}</option>
                    <option value="groom_family">{isKh ? 'សាច់ញាតិខាងប្រុស' : "Groom's Family"}</option>
                    <option value="bride_family">{isKh ? 'សាច់ញាតិខាងស្រី' : "Bride's Family"}</option>
                    <option value="friends">{isKh ? 'មិត្តភក្តិ' : 'Friends'}</option>
                    <option value="colleagues">{isKh ? 'សហការី' : 'Colleagues'}</option>
                    <option value="vip">{isKh ? 'ភ្ញៀវកិត្តិយស VIP' : 'VIP Guests'}</option>
                  </select>
                </div>

                {/* Phone */}
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300">
                    {isKh ? 'លេខទូរស័ព្ទ (ជម្រើស)' : 'Phone Number (Optional)'}
                  </label>
                  <input
                    type="text"
                    value={newGuestPhone}
                    onChange={(e) => setNewGuestPhone(e.target.value)}
                    placeholder="012 345 678"
                    className="w-full px-3.5 py-2 text-xs font-mono font-bold rounded-xl border border-amber-300 dark:border-amber-700 bg-white dark:bg-slate-900 dark:text-white"
                  />
                </div>

                {/* Seats */}
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300">
                    {isKh ? 'ចំនួនកៅអី/មនុស្ស' : 'Expected Seats'}
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={20}
                    value={newGuestCount}
                    onChange={(e) => setNewGuestCount(parseInt(e.target.value) || 1)}
                    className="w-full px-3.5 py-2 text-xs font-bold rounded-xl border border-amber-300 dark:border-amber-700 bg-white dark:bg-slate-900 dark:text-white"
                  />
                </div>

                {/* Notes */}
                <div className="space-y-1 lg:col-span-2">
                  <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300">
                    {isKh ? 'កំណត់ចំណាំ / តុលេខ (ជម្រើស)' : 'Notes / Table No. (Optional)'}
                  </label>
                  <input
                    type="text"
                    value={newGuestNotes}
                    onChange={(e) => setNewGuestNotes(e.target.value)}
                    placeholder="ឧទាហរណ៍៖ តុលេខ 1, VIP..."
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-amber-300 dark:border-amber-700 bg-white dark:bg-slate-900 dark:text-white"
                  />
                </div>

                {/* Submit Button */}
                <div className="lg:col-span-1 flex items-end">
                  <button
                    type="submit"
                    className="w-full py-2.5 px-4 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>
                      {editingGuestId
                        ? isKh ? 'បច្ចុប្បន្នភាព' : 'Update'
                        : isKh ? 'កត់ត្រាឈ្មោះ' : 'Save Guest'}
                    </span>
                  </button>
                </div>
              </div>
            </form>

            {/* Filter & Search Toolbar */}
            <div className="flex flex-col sm:flex-row items-center gap-3 bg-slate-100 dark:bg-slate-900 p-3 rounded-2xl border border-slate-200 dark:border-slate-800">
              {/* Search */}
              <div className="relative w-full sm:w-1/3">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={guestSearch}
                  onChange={(e) => setGuestSearch(e.target.value)}
                  placeholder={isKh ? 'ស្វែងរកឈ្មោះ ឬ លេខទូរស័ព្ទ...' : 'Search name or phone...'}
                  className="w-full pl-9 pr-3 py-1.5 text-xs font-semibold rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 dark:text-white outline-none"
                />
              </div>

              {/* Category Filter */}
              <div className="w-full sm:w-1/3 flex items-center gap-2">
                <Filter className="w-4 h-4 text-slate-400 shrink-0" />
                <select
                  value={guestCategoryFilter}
                  onChange={(e) => setGuestCategoryFilter(e.target.value)}
                  className="w-full py-1.5 px-3 text-xs font-semibold rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 dark:text-white"
                >
                  <option value="all">{isKh ? 'គ្រប់ក្រុមទាំងអស់' : 'All Categories'}</option>
                  <option value="general">{isKh ? 'ភ្ញៀវទូទៅ' : 'General Guests'}</option>
                  <option value="groom_family">{isKh ? 'សាច់ញាតិខាងប្រុស' : "Groom's Family"}</option>
                  <option value="bride_family">{isKh ? 'សាច់ញាតិខាងស្រី' : "Bride's Family"}</option>
                  <option value="friends">{isKh ? 'មិត្តភក្តិ' : 'Friends'}</option>
                  <option value="colleagues">{isKh ? 'សហការី' : 'Colleagues'}</option>
                  <option value="vip">{isKh ? 'ភ្ញៀវកិត្តិយស VIP' : 'VIP Guests'}</option>
                </select>
              </div>

              {/* Status Filter */}
              <div className="w-full sm:w-1/3">
                <select
                  value={guestStatusFilter}
                  onChange={(e) => setGuestStatusFilter(e.target.value)}
                  className="w-full py-1.5 px-3 text-xs font-semibold rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 dark:text-white"
                >
                  <option value="all">{isKh ? 'គ្រប់ស្ថានភាពទាំងអស់' : 'All Status'}</option>
                  <option value="sent">{isKh ? 'បានផ្ញើរួច' : 'Sent Only'}</option>
                  <option value="pending">{isKh ? 'មិនទាន់ផ្ញើ' : 'Pending Only'}</option>
                </select>
              </div>

              {/* Clear All button if list has items */}
              {(invitation.guestList || []).length > 0 && (
                <button
                  type="button"
                  onClick={handleClearAllGuests}
                  className="px-3 py-1.5 text-xs text-red-500 hover:text-red-700 font-bold shrink-0 flex items-center gap-1 cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>{isKh ? 'លុបទាំងអស់' : 'Clear All'}</span>
                </button>
              )}
            </div>

            {/* Guest List Display Table / Cards */}
            {(() => {
              const allList = invitation.guestList || [];
              const filteredList = allList.filter((g) => {
                const matchesSearch =
                  !guestSearch.trim() ||
                  g.name.toLowerCase().includes(guestSearch.toLowerCase()) ||
                  (g.phone && g.phone.includes(guestSearch)) ||
                  (g.notes && g.notes.toLowerCase().includes(guestSearch.toLowerCase()));

                const matchesCategory =
                  guestCategoryFilter === 'all' || g.category === guestCategoryFilter;

                const matchesStatus =
                  guestStatusFilter === 'all' || g.status === guestStatusFilter;

                return matchesSearch && matchesCategory && matchesStatus;
              });

              if (allList.length === 0) {
                return (
                  <div className="p-12 text-center rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-dashed border-slate-300 dark:border-slate-800 space-y-3">
                    <Users className="w-10 h-10 text-slate-400 mx-auto" />
                    <p className="text-sm font-bold text-slate-700 dark:text-slate-300">
                      {isKh ? 'មិនទាន់មានឈ្មោះភ្ញៀវត្រូវបានកត់ត្រានៅឡើយទេ' : 'No guests recorded yet'}
                    </p>
                    <p className="text-xs text-slate-500">
                      {isKh
                        ? 'សូមប្រើប្រាស់ទម្រង់ខាងលើ ឬ ប៊ូតុង "បន្ថែមម្ដងច្រើននាក់ (Bulk Import)" ដើម្បីកត់ត្រាឈ្មោះភ្ញៀវដោយសេរី!'
                        : 'Use the form above or Bulk Import to start logging your guest list.'}
                    </p>
                  </div>
                );
              }

              if (filteredList.length === 0) {
                return (
                  <div className="p-8 text-center rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800">
                    <p className="text-xs font-bold text-slate-500">
                      {isKh ? 'រកមិនឃើញឈ្មោះភ្ញៀវដែលត្រូវនឹងការស្វែងរកនេះទេ' : 'No guest records found for this filter.'}
                    </p>
                  </div>
                );
              }

              return (
                <div className="space-y-3">
                  <div className="flex justify-between items-center text-xs font-bold text-slate-500 px-1">
                    <span>{isKh ? `បង្ហាញ ${filteredList.length} ក្នុងចំណោម ${allList.length} នាក់` : `Showing ${filteredList.length} of ${allList.length} guests`}</span>
                  </div>

                  <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-300 font-bold border-b border-slate-200 dark:border-slate-800">
                        <tr>
                          <th className="py-3 px-3">#</th>
                          <th className="py-3 px-3">{isKh ? 'ឈ្មោះ/គោរមងារភ្ញៀវ' : 'Guest Name'}</th>
                          <th className="py-3 px-3">{isKh ? 'ក្រុម/ប្រភេទ' : 'Group'}</th>
                          <th className="py-3 px-3">{isKh ? 'ទូរស័ព្ទ/កៅអី' : 'Phone/Seats'}</th>
                          <th className="py-3 px-3">{isKh ? 'ស្ថានភាព' : 'Status'}</th>
                          <th className="py-3 px-3 text-center">{isKh ? 'សកម្មភាពចម្លង & ផ្ញើ' : 'Actions & Share'}</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200 dark:divide-slate-800 bg-white dark:bg-slate-950">
                        {filteredList.map((guest, index) => {
                          const guestLink = getGuestLink(guest.name);
                          const isSent = guest.status === 'sent';
                          return (
                            <tr key={guest.id} className="hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors">
                              <td className="py-3 px-3 font-mono font-bold text-slate-400">{index + 1}</td>
                              <td className="py-3 px-3 font-bold text-slate-900 dark:text-white">
                                <div className="font-serif text-sm">{guest.name}</div>
                                {guest.notes && (
                                  <span className="text-[10px] font-normal text-amber-600 dark:text-amber-400 block">
                                    📝 {guest.notes}
                                  </span>
                                )}
                              </td>
                              <td className="py-3 px-3">
                                <span className="inline-block px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[10px] font-bold">
                                  {getCategoryName(guest.category)}
                                </span>
                              </td>
                              <td className="py-3 px-3 font-mono text-slate-600 dark:text-slate-300">
                                {guest.phone || '—'}
                                <span className="block text-[10px] text-purple-500 font-sans font-bold">
                                  🎟️ {guest.guestCount || 1} {isKh ? 'កៅអី' : 'seats'}
                                </span>
                              </td>
                              <td className="py-3 px-3">
                                <button
                                  type="button"
                                  onClick={() => handleToggleGuestStatus(guest.id)}
                                  className={`px-2.5 py-1 rounded-full text-[10px] font-bold flex items-center gap-1 cursor-pointer transition-all ${
                                    isSent
                                      ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/40'
                                      : 'bg-orange-500/20 text-orange-600 dark:text-orange-400 border border-orange-500/40'
                                  }`}
                                >
                                  {isSent ? <CheckCircle2 className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                                  <span>{isSent ? (isKh ? 'បានផ្ញើរួច' : 'Sent') : (isKh ? 'មិនទាន់ផ្ញើ' : 'Pending')}</span>
                                </button>
                              </td>
                              <td className="py-3 px-3">
                                <div className="flex items-center justify-center gap-1.5">
                                  {/* Copy Link */}
                                  <button
                                    type="button"
                                    onClick={() => handleCopySingleGuestLink(guest.id, guest.name)}
                                    title={isKh ? 'ចម្លងលីងភ្ញៀវនេះ' : 'Copy Guest Link'}
                                    className="p-1.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-600 dark:text-amber-400 transition-all cursor-pointer"
                                  >
                                    {copiedGuestId === guest.id ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                                  </button>

                                  {/* Telegram Share */}
                                  <button
                                    type="button"
                                    onClick={() => handleShareTelegram(guest.name)}
                                    title={isKh ? 'ផ្ញើតាម Telegram' : 'Share to Telegram'}
                                    className="p-1.5 rounded-lg bg-sky-500/10 hover:bg-sky-500/20 text-sky-500 transition-all cursor-pointer"
                                  >
                                    <Send className="w-3.5 h-3.5" />
                                  </button>

                                  {/* Edit */}
                                  <button
                                    type="button"
                                    onClick={() => handleStartEditGuest(guest)}
                                    title={isKh ? 'កែប្រែ' : 'Edit'}
                                    className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-600 dark:text-slate-300 transition-all cursor-pointer"
                                  >
                                    <Edit2 className="w-3.5 h-3.5" />
                                  </button>

                                  {/* Delete */}
                                  <button
                                    type="button"
                                    onClick={() => handleDeleteGuest(guest.id)}
                                    title={isKh ? 'លុប' : 'Delete'}
                                    className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-500 transition-all cursor-pointer"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              );
            })()}

            {renderSaveFooterBar('បញ្ជីឈ្មោះភ្ញៀវ', 'Guest List Manager')}
          </div>
        )}
      </div>

      {/* FLOATING SAVE SUCCESS TOAST */}
      {saveSuccess && (
        <div className="fixed bottom-6 right-6 z-50 px-5 py-3 rounded-2xl bg-emerald-600 text-white shadow-2xl border border-emerald-400 flex items-center gap-3 animate-bounce">
          <Check className="w-5 h-5 text-white" />
          <span className="text-xs font-bold font-serif">
            {isKh ? 'រក្សាទុកទិន្នន័យបានជោគជ័យ!' : 'Changes Saved Successfully!'}
          </span>
        </div>
      )}
    </div>
  );
};
