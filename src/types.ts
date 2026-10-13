export type Language = 'kh' | 'en';
export type ThemeMode = 'light' | 'dark';

export type UserRole = 'guest' | 'user' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  plan: 'free' | 'premium';
  avatar?: string;
}

export interface ProgramItem {
  id: string;
  day: number;
  dateStr: string; // e.g. "ថ្ងៃទី១៣ ខែមករា ឆ្នាំ២០២៧"
  time: string; // e.g. "២:០០ នាទីរសៀល"
  title: string; // e.g. "ពិធីសែនក្រុងពាលី"
  description?: string;
  icon?: string;
}

export interface GalleryItem {
  id: string;
  url: string;
  caption?: string;
}

export interface MusicTrack {
  id: string;
  title: string;
  artist: string;
  url: string;
  isPreset?: boolean;
}

export interface BankInfo {
  bankName: string;
  accountName: string;
  accountNumber: string;
  qrImageUrl: string;
  note?: string;
}

export interface RsvpResponse {
  id: string;
  guestName: string;
  guestCount: number;
  attendance: 'attending' | 'declined' | 'maybe';
  phone: string;
  wishes: string;
  createdAt: string;
}

export interface GuestRecordItem {
  id: string;
  name: string;
  category?: 'groom_family' | 'bride_family' | 'friends' | 'colleagues' | 'vip' | 'general';
  phone?: string;
  guestCount?: number; // Estimated seats / guests
  status?: 'pending' | 'sent' | 'opened' | 'attending' | 'declined';
  notes?: string;
  createdAt?: string;
}

export interface WeddingInvitation {
  id: string;
  slug: string; // e.g., "monkongprak-eiseavhan"
  title: string;
  // Parents
  groomFatherName: string;
  groomMotherName: string;
  brideFatherName: string;
  brideMotherName: string;
  // Couple
  groomName: string;
  brideName: string;
  groomTitle?: string; // e.g. "កូនប្រុសនាម"
  brideTitle?: string; // e.g. "កូនស្រីនាម"
  coupleLogoImage?: string; // Uploaded custom logo image for couple
  showCoupleTextName?: boolean; // Toggle to show/hide text name (defaults to true)
  showCoupleLogoImage?: boolean; // Toggle to show/hide logo image (defaults to true)
  // Date & Time
  greetingHeaderTitle?: string; // e.g. "សិរីសួស្តីអាពាហ៍ពិពាហ៍"
  monogramText?: string; // Custom emblem monogram text/symbol (e.g. "ឝ" or "S&H")
  envelopeBgImage?: string; // Custom background image for the Open Invitation envelope card
  envelopeBgVideo?: string; // Custom background video (MP4/WebM) for the Open Invitation envelope card
  coverPhotoVertical?: string; // Large vertical portrait cover photo (Facebook Story / 3:4 format)
  coverVideoVertical?: string; // Large vertical cover video (MP4/WebM or Video URL)
  coverAspectRatio?: '3:4' | '2:3' | '9:16' | '1:1'; // Aspect ratio options for cover photo/video
  showCoverPhotoVertical?: boolean; // Toggle to show/hide vertical cover media (defaults to true)
  coverFrameStyle?: 'gold-royal' | 'khmer-kbach' | 'floral-gold' | 'heart-arch' | 'glowing-pearl' | 'none'; // Preset photo frame styles (ស៊ុមរូបថត)
  customFrameImage?: string; // Custom PNG frame overlay image URL
  weddingDate: string; // e.g. "2027-01-14T17:00:00"
  weddingDateKhmer: string; // e.g. "ថ្ងៃព្រហស្បតិ៍ ទី១៤ ខែមករា ឆ្នាំ២០២៧"
  lunarDateKhmer: string; // e.g. "ត្រូវនឹងថ្ងៃ៧កើត ខែ មិគសិរ-បុស្ស ឆ្នាំមមី ព.ស.២៥៧០"
  timeKhmer: string; // e.g. "វេលាម៉ោង ០៥:០០ នាទីល្ងាច"
  // Venue
  venueName: string; // e.g. "គេហដ្ឋានខាងស្រី"
  venueAddress: string; // e.g. "នៅ ភូមិថ្មសំលៀង ឃុំត្រពាំងគង ស្រុកសំរោងទង ខេត្តកំពង់ស្ពឺ"
  googleMapUrl: string; // e.g. "https://maps.app.goo.gl/r31fMaBuQwyisbg18?g_st=it"
  embedMapUrl?: string;
  venueImage?: string; // Photo or Map image of the venue location
  // Speech & Custom texts
  formalInvitationText: string;
  guestHonorifics: string; // e.g. "សម្តេច ទ្រង់ ឯកឧត្តម លោកជំទាវ..."
  thankYouMessage: string;
  apologyMessage: string;
  // Acknowledgements & Creator Branding
  acknowledgementTitle?: string;
  decorSponsor?: string;
  photographySponsor?: string;
  creatorLogoText?: string;
  creatorBrandName?: string;
  creatorDescription?: string;
  creatorPhone?: string;
  // Media
  coverImage: string;
  gallery: GalleryItem[];
  galleryAspectRatio?: '3/4' | '2/3' | '9/16' | '1/1' | 'auto';
  programItems?: ProgramItem[];
  videoUrl: string;
  backgroundMusic: MusicTrack;
  customMusicTracks?: MusicTrack[];
  musicAutoPlay: boolean;
  // Style & Theme
  themeColor: 'gold' | 'rose' | 'emerald' | 'burgundy' | 'navy' | 'darkgold' | 'royal' | 'custom';
  primaryFont: 'muol' | 'battambang' | 'siemreap' | 'kantumruuy' | 'koulen' | 'bayon' | 'dangrek' | 'preahvihear' | 'taprom' | 'content' | 'inter';
  groomBrideFont?: string;
  coupleFontSize?: number; // e.g. 18 to 48px
  guestNameFontSize?: number; // e.g. 12 to 32px
  speechFont?: string;
  customPrimaryColor?: string;
  customBgColor?: string;
  customTextColor?: string;
  templateId: string;
  templateType: 'free' | 'premium';
  // Bank / Gift
  bankInfo: BankInfo;
  // Guest RSVPs, Directory & Wishes
  guestList?: GuestRecordItem[];
  rsvpList: RsvpResponse[];
  rsvpEnabled: boolean;
  // Settings
  domainCustom?: string;
  seoTitle?: string;
  seoDescription?: string;
  seoImage?: string;
  viewsCount: number;
  published: boolean;
}

export interface TemplateItem {
  id: string;
  nameKhmer: string;
  nameEnglish: string;
  type: 'free' | 'premium';
  priceUsd: number;
  thumbnail: string;
  previewUrl?: string;
  themeColor: string;
  description: string;
  features: string[];
}

export interface PaymentRecord {
  id: string;
  userId: string;
  invitationId: string;
  amount: number;
  khqrCode: string;
  status: 'pending' | 'approved' | 'rejected';
  receiptImage?: string;
  createdAt: string;
  transactionRef: string;
}
