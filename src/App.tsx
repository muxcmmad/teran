import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  Search,
  X,
  Sun,
  Moon,
  Bell,
  BellOff,
  User,
  BookOpen,
  Bookmark,
  ArrowLeft,
  ArrowUp,
  ArrowDown,
  Trash2,
  Share2,
  UserPlus,
  Send,
  Edit2,
  Camera,
  AtSign,
  CircleUserRound,
  Check,
  RotateCw,
  FlipHorizontal2,
  Repeat2,
  MoreHorizontal,
  Users,
  ChevronLeft,
  ChevronRight,
  Copy,
  ExternalLink,
  Volume2,
  Mail,
  Hand,
  MonitorSmartphone,
  Eye,
  EyeOff,
  Lock,
  LogOut,
  QrCode,
  Palette,
  Forward,
  Reply,
  Link2,
  Play,
} from 'lucide-react';
import QRCode from 'qrcode';

interface ProfileColorPreset {
  id: string;
  primary: string;
}

const PROFILE_COLOR_PRESETS: ProfileColorPreset[] = [
  { id: 'solid-coral', primary: '#c95d53' },
  { id: 'solid-amber', primary: '#cc7e33' },
  { id: 'solid-purple', primary: '#956fd1' },
  { id: 'solid-green', primary: '#47a12f' },
  { id: 'solid-teal', primary: '#3e9fb3' },
  { id: 'solid-blue', primary: '#4893d8' },
  { id: 'solid-pink', primary: '#c45d8b' },
  { id: 'solid-slate', primary: '#8f99a3' },
];

const AUTHOR_FIXED_COLORS: Record<string, string> = {
  '@azizbek': '#4893d8',
  '@nilufar': '#956fd1',
  '@sardor': '#47a12f',
  '@kamola': '#c45d8b',
  '@jasur': '#cc7e33',
  '@zamira': '#3e9fb3',
};

interface Profile {
  name: string;
  firstName?: string;
  lastName?: string;
  username: string;
  bio: string;
  avatar?: string;
}

interface PostReplyRef {
  postId: string;
  title: string;
  excerpt: string;
  quoteText?: string;
  content?: string;
  date?: string;
  readTime?: string;
  bio?: string;
  avatar?: string;
  authorName: string;
  authorUsername?: string;
}

interface PostLinkPreview {
  url: string;
  domain: string;
  title?: string;
  description?: string;
  imageUrl?: string;
  embeddable?: boolean;
}

interface Post {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  date: string;
  timestamp?: number;
  wordCount?: number;
  readTime?: string;
  authorName?: string;
  authorUsername?: string;
  authorEmail?: string;
  bio?: string;
  avatar?: string;
  replyTo?: PostReplyRef;
  linkPreview?: PostLinkPreview;
}

interface Follower {
  name: string;
  username: string;
  bio?: string;
  avatar?: string;
}

interface NotificationItem {
  id: string;
  text: string;
  time: string;
  type: 'follow' | 'post' | 'follower' | 'system';
  targetUsername?: string;
  targetPostId?: string;
  read?: boolean;
}

interface AuthorMeta {
  name: string;
  username: string;
  email: string;
  bio: string;
  baseFollowers: number;
  avatar?: string;
}

interface OsNotificationPayload {
  id: string;
  notificationId?: string;
  senderName: string;
  senderUsername?: string;
  avatar?: string;
  message: string;
  actionLabel: string;
  targetPostId?: string;
  targetUsername?: string;
}

interface SessionItem {
  id: string;
  device: string;
  appInfo: string;
  location: string;
  lastActive: string;
  isCurrent: boolean;
}

const DEFAULT_PROFILE: Profile = {
  name: 'Muhammad',
  username: '@muhcmmad',
  bio: 'muxcmmad@gmail.com xabaringizni shu yerda qoldiring 📬',
  avatar: '',
};

const KNOWN_AUTHORS: Record<string, AuthorMeta> = {
  '@azizbek': {
    name: 'Azizbek Karimov',
    username: '@azizbek',
    email: 'azizbek.karimov@gmail.com',
    bio: 'Dasturlash va zamonaviy texnologiyalar haqida yozaman.',
    baseFollowers: 12,
  },
  '@nilufar': {
    name: 'Nilufar Rahimova',
    username: '@nilufar',
    email: 'nilufar.rahimova@gmail.com',
    bio: 'Adabiyot va she’riyat shaydosi.',
    baseFollowers: 8,
  },
  '@sardor': {
    name: 'Sardorbek',
    username: '@sardor',
    email: 'sardorbek.uz@gmail.com',
    bio: 'Kitobxon va hikoyalar muxlisi.',
    baseFollowers: 2,
  },
  '@kamola': {
    name: 'Kamola Karimova',
    username: '@kamola',
    email: 'kamola.karimova@gmail.com',
    bio: 'Falsafa, psixologiya va inson ruhiyati haqida mulohazalar.',
    baseFollowers: 4,
  },
  '@jasur': {
    name: 'Jasur Aliyev',
    username: '@jasur',
    email: 'jasur.aliyev@gmail.com',
    bio: 'Sayohat, tabiat va hayotiy qiziqarli xotiralar.',
    baseFollowers: 6,
  },
  '@zamira': {
    name: 'Zamira',
    username: '@zamira',
    email: 'zamira.adabiyot@gmail.com',
    bio: 'Adabiyot va falsafa ixlosmandi.',
    baseFollowers: 5,
  },
};

const DEFAULT_COMMUNITY_POSTS: Post[] = [
  {
    id: 'c1',
    authorName: 'Azizbek Karimov',
    authorUsername: '@azizbek',
    bio: 'Dasturlash va zamonaviy texnologiyalar haqida yozaman.',
    title: 'Dasturlashda soddalik siri',
    excerpt: 'Murakkab tizimlarni yaratishdan oldin ularni soddalashtirishni o‘rganish kerak...',
    content:
      "Dasturlashda soddalik siri\n\nMurakkab tizimlarni yaratishdan oldin ularni soddalashtirishni o‘rganish kerak. Har bir qator kod o‘z qiymatiga ega bo‘lishi shart. Yaxshi dasturchi ko‘p kod yozgan emas, balki eng kam va tushunarli kod bilan eng to‘g‘ri yechim bergan mutaxassisdir.\n\nKo‘pincha yosh dasturchilar oddiy vazifani ham murakkab arxitektura, keraksiz kutubxonalar va ortiqcha qatlamlar bilan og‘irlashtirib yuborishadi. Oradan bir necha oy o‘tib, o‘sha kodni hatto muallifning o‘zi ham qiynalib tushunadi.\n\nAsl mahorat esa har bir ortiqcha detalni olib tashlab, faqat mohiyatni qoldira olishdadir. Sodda kod — kam xato, tez o‘qilish va xotirjam jamoaviy ish demakdir.",
    date: '10-noyabr, 2026',
    timestamp: 1731235200000,
    wordCount: 92,
    readTime: '2 daqiqa',
  },
  {
    id: 'c2',
    authorName: 'Nilufar Rahimova',
    authorUsername: '@nilufar',
    bio: 'Adabiyot va she’riyat shaydosi.',
    title: 'Kuzgi shahar nafaslari',
    excerpt: 'Barglarning to‘kilishi va tonggi havo kishiga o‘zgacha ilhom bag‘ishlaydi...',
    content:
      "Kuzgi shahar nafaslari\n\nBarglarning to‘kilishi va tonggi havo kishiga o‘zgacha ilhom bag‘ishlaydi. Issiq choy idishini qo‘lga olib, derazadan tashqariga boqishning o‘zi bir olam zavq. Har bir faslning o‘z ohangi bor, lekin kuz sukunatining ovozi boshqacha yangraydi.\n\nShahar ko‘chalari erta tongda hali uyg‘onmagan paytda sariq yaproqlar ustida yurish insonga vaqtning qadrini eslatadi. Shoshilayotgan odamlar, qahvaxonalardan taralayotgan hid va uzoqdan eshitilayotgan tramvay ovozi bir butun hikoyaga aylanadi.\n\nBalki baxt ham aynan shunday kichik, ammo yurakka yaqin lahzalarni payqay olishdadir. Bugun telefoningizni cho‘ntakka solib, atrofga bir oz e’tibor bilan qarang.",
    date: '8-noyabr, 2026',
    timestamp: 1731062400000,
    wordCount: 98,
    readTime: '3 daqiqa',
  },
  {
    id: 'c3',
    authorName: 'Kamola Karimova',
    authorUsername: '@kamola',
    bio: 'Falsafa, psixologiya va inson ruhiyati haqida mulohazalar.',
    title: 'Sukunatda fikrlash san’ati',
    excerpt: 'Har kuni shovqin-suron ichida o‘z ichki ovozimizni yo‘qotib qo‘yamiz...',
    content:
      "Sukunatda fikrlash san’ati\n\nHar kuni shovqin-suron ichida o‘z ichki ovozimizni yo‘qotib qo‘yamiz. Kuniga hech bo‘lmaganda 15 daqiqa gadjetlarsiz yolg‘iz qolish inson ruhiyatini tiniqlashtiradi va yangi g‘oyalarga yo‘l ochadi.\n\nZamonaviy dunyoda eng qiyin ish — hech qayerga shoshilmasdan o‘tirib o‘z fikrlarimizni tinglashdir. Xabarlar, yangiliklar va bildirishnomalar oqimi ongimizni tinimsiz band qilib turadi, natijada aslida nima istayotganimizni unutib qo‘yamiz.\n\nSukunat bo‘shliq emas, u javoblar tug‘iladigan makondir. Bir varaq qog‘oz oling va hech kimga ko‘rsatish uchun emas, faqat o‘zingizni tushunish uchun bir necha jumla yozib ko‘ring.",
    date: '5-noyabr, 2026',
    timestamp: 1730803200000,
    wordCount: 95,
    readTime: '2 daqiqa',
  },
];

const DEFAULT_NOTIFICATIONS: NotificationItem[] = [
  { id: 'n1', text: '@azizbek sizga obuna bo\'ldi va yangi hikoya chop etdi.', time: '2 soat oldin', type: 'follow', targetUsername: '@azizbek', read: false },
  { id: 'n2', text: '@nilufar yangi hikoya yozdi: "Kuzgi shahar nafaslari"', time: 'Kecha', type: 'post', targetPostId: 'c2', read: false },
  { id: 'n3', text: '@sardor (obunachingiz) sizga obuna bo\'ldi.', time: '3 kun oldin', type: 'follower', targetUsername: '@sardor', read: false },
];

const NEW_RECOMMENDED_POOL: Omit<Post, 'id' | 'date' | 'timestamp'>[] = [
  {
    authorName: 'Jasur Aliyev',
    authorUsername: '@jasur',
    bio: 'Sayohat, tabiat va hayotiy qiziqarli xotiralar.',
    title: 'Tonggi yulduz va yo‘l iztirobi',
    excerpt: 'Har bir uzoq safar o‘zingizga qilgan ichki sayohatdan boshlanadi...',
    content: "Tonggi yulduz va yo‘l iztirobi\n\nHar bir uzoq safar o‘zingizga qilgan ichki sayohatdan boshlanadi. Tonggi sovuq havo, yo‘l chetidagi jimjitlik va oldinda kutayotgan noma'lum manzillar insonga o'zgacha quvvat beradi.\n\nKo'pchiligimiz kunlik tashvishlar bilan band bo'lib, tabiatning bu buyuk sukunatini unutib qo'yamiz. Aslida esa hayot shoshilinch qadamlarda emas, balki to'xtab nafas olgan lahzalarimizda o'lchanadi.",
    wordCount: 84,
    readTime: '2 daqiqa',
  },
  {
    authorName: 'Zamira',
    authorUsername: '@zamira',
    bio: 'Adabiyot va falsafa ixlosmandi.',
    title: 'Kitoblar va vaqt oqimi',
    excerpt: 'Sahifalarni varaqlash — bu boshqa davrlarga sayohat qilish demakdir...',
    content: "Kitoblar va vaqt oqimi\n\nSahifalarni varaqlash — bu boshqa davrlarga sayohat qilish demakdir. Har bir muallif o'z hayot tajribasini qog'ozga muhrlab, kelajak avlodlarga qoldiradi.\n\nO'qigan kitoblarimiz bizni boyitadi, dunyoqarashimizni kengaytiradi va eng qiyin damlarda to'g'ri yo'l topishga yordam beradi. Kitob o'qish odati — bu o'zingizga qilingan eng yaxshi sarmoyadir.",
    wordCount: 79,
    readTime: '2 daqiqa',
  },
  {
    authorName: 'Kamola Karimova',
    authorUsername: '@kamola',
    bio: 'Falsafa, psixologiya va inson ruhiyati haqida mulohazalar.',
    title: 'Ichki xotirjamlikni topish sirli yo‘li',
    excerpt: 'Tashqi dunyodagi tartibsizlikni o‘zgartira olmasak ham, ichki olamimizni tartibga solishimiz mumkin...',
    content: "Ichki xotirjamlikni topish sirli yo‘li\n\nTashqi dunyodagi tartibsizlikni o‘zgartira olmasak ham, ichki olamimizni tartibga solishimiz mumkin. Buning uchun ko'p narsa kerak emas — shunchaki ortiqcha kutishlardan voz kechish va hozirgi lahzada yashashni o'rganish kifoya.\n\nHar tong uyg'onganda bugungi kun uchun shukr qilish, kichik quvonchlarga e'tibor qaratish ruhiy salomatligimizning eng muhim garovidir.",
    wordCount: 88,
    readTime: '2 daqiqa',
  },
];

const DEFAULT_FOLLOWERS: Follower[] = [
  { name: 'Sardorbek', username: '@sardor', bio: 'Kitobxon va hikoyalar muxlisi.' },
  { name: 'Kamola Karimova', username: '@kamola', bio: 'Falsafa, psixologiya va inson ruhiyati haqida mulohazalar.' },
  { name: 'Jasur Aliyev', username: '@jasur', bio: 'Sayyohlik, tabiat go\'zalligi va hayotiy qaydlar.' },
];

export default function App() {
  // Theme state
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    return localStorage.getItem('theme') === 'dark';
  });

  // Profile state
  const [profile, setProfile] = useState<Profile>(() => {
    const saved = localStorage.getItem('user_profile');
    return saved ? JSON.parse(saved) : DEFAULT_PROFILE;
  });

  // User posts
  const [posts, setPosts] = useState<Post[]>(() => {
    const saved = localStorage.getItem('user_posts');
    return saved ? JSON.parse(saved) : [];
  });

  // Community posts
  const [communityPosts, setCommunityPosts] = useState<Post[]>(() => {
    const saved = localStorage.getItem('community_posts');
    return saved ? JSON.parse(saved) : DEFAULT_COMMUNITY_POSTS;
  });

  const [feedRefreshNonce, setFeedRefreshNonce] = useState(0);

  // Subscribed authors
  const [subscribedAuthors, setSubscribedAuthors] = useState<string[]>(() => {
    const saved = localStorage.getItem('subscribed_authors');
    return saved ? JSON.parse(saved) : ['@azizbek', '@nilufar'];
  });

  // Post share, view, and save counts for recommendation ranking
  const [shareCounts, setShareCounts] = useState<Record<string, number>>(() => {
    const saved = localStorage.getItem('post_share_counts');
    return saved ? JSON.parse(saved) : { c1: 15, c2: 8, c3: 5 };
  });

  const [viewCounts, setViewCounts] = useState<Record<string, number>>(() => {
    try {
      const saved = localStorage.getItem('post_view_counts');
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return { c1: 124, c2: 76, c3: 52 };
  });

  const [saveCounts, setSaveCounts] = useState<Record<string, number>>(() => {
    try {
      const saved = localStorage.getItem('post_save_counts');
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return { c1: 4, c2: 2, c3: 1 };
  });

  const [savedPostIds, setSavedPostIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('saved_post_ids');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch {
      // ignore
    }
    return [];
  });

  // Followers
  const [followers] = useState<Follower[]>(DEFAULT_FOLLOWERS);

  // Notifications
  const [notifications, setNotifications] = useState<NotificationItem[]>(() => {
    const saved = localStorage.getItem('user_notifications');
    if (saved) {
      try {
        const parsed = JSON.parse(saved) as NotificationItem[];
        if (Array.isArray(parsed)) {
          const seenIds = new Set<string>();
          const seenTexts = new Set<string>();
          return parsed
            .filter(item => {
              if (!item || !item.id) return false;
              const lower = (item.text || '').toLowerCase();
              if (lower.includes('izoh') || lower.includes('javob')) return false;
              if (seenIds.has(item.id) || seenTexts.has(item.text)) return false;
              seenIds.add(item.id);
              seenTexts.add(item.text);
              return true;
            });
        }
      } catch {
        // fallback below
      }
    }
    return DEFAULT_NOTIFICATIONS;
  });

  // Navigation & view states
  const [currentBottomTab, setCurrentBottomTab] = useState<'all' | 'following'>('all');
  const [currentFeedTab, setCurrentFeedTab] = useState<'all' | 'following'>('all');

  // Search state
  const [searchQuery, setSearchQuery] = useState('');

  // Editor states
  const MIN_STORY_CHARS = 500;
  const [editorText, setEditorText] = useState('');
  const [activePostId, setActivePostId] = useState<string | null>(null);
  const [storyLengthError, setStoryLengthError] = useState('');
  const composerRef = useRef<HTMLTextAreaElement | null>(null);

  // Reader state
  const [viewingPost, setViewingPost] = useState<Post | null>(null);

  // Feed card UI states
  const [openMenuPostId, setOpenMenuPostId] = useState<string | null>(null);

  // Drawer & Modal states
  const [isProfileDrawerOpen, setIsProfileDrawerOpen] = useState(false);
  const [isProfileEditMode, setIsProfileEditMode] = useState(false);
  const [profileSubView, setProfileSubView] = useState<'main' | 'following' | 'followers' | 'blocked' | 'sessions'>('main');
  const [profileTab, setProfileTab] = useState<'general' | 'notifications' | 'security'>('general');
  const [isEditingNameModal, setIsEditingNameModal] = useState(false);
  const [isEditingUsernameModal, setIsEditingUsernameModal] = useState(false);
  const [isEditingEmailModal, setIsEditingEmailModal] = useState(false);
  const [loginEmailStep, setLoginEmailStep] = useState<'enter' | 'verify'>('enter');
  const [emailCodeDigits, setEmailCodeDigits] = useState<string[]>(['', '', '', '', '', '']);
  const [generatedEmailCode, setGeneratedEmailCode] = useState('');
  const [emailCodeError, setEmailCodeError] = useState('');
  const emailCodeInputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const [editFirstName, setEditFirstName] = useState('');
  const [editLastName, setEditLastName] = useState('');
  const [nameError, setNameError] = useState('');
  const [newUsernameInput, setNewUsernameInput] = useState(profile.username.replace('@', ''));
  const [usernameError, setUsernameError] = useState('');
  const [loginEmail, setLoginEmail] = useState<string>(() => {
    return localStorage.getItem('login_email') || 'muxcmmad@gmail.com';
  });
  const [emailInput, setEmailInput] = useState('');
  const [emailError, setEmailError] = useState('');
  const [defaultInterfaceScale, setDefaultInterfaceScale] = useState<boolean>(() => {
    const saved = localStorage.getItem('default_interface_scale');
    return saved !== null ? saved === 'true' : true;
  });
  const [interfaceScale, setInterfaceScale] = useState<number>(() => {
    const saved = Number(localStorage.getItem('interface_scale'));
    return Number.isFinite(saved) && saved >= 75 && saved <= 200 ? saved : 100;
  });
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem('is_authenticated') === 'true';
  });
  const [accountPassword, setAccountPassword] = useState<string>(() => {
    return localStorage.getItem('account_password') || '123456';
  });
  const [isPasswordCustomized, setIsPasswordCustomized] = useState<boolean>(() => {
    return localStorage.getItem('password_customized') === 'true';
  });
  const [loginUsernameInput, setLoginUsernameInput] = useState('');
  const [loginPasswordInput, setLoginPasswordInput] = useState('');
  const [loginShowPassword, setLoginShowPassword] = useState(false);
  const [loginFormError, setLoginFormError] = useState('');

  const [isChangePasswordModalOpen, setIsChangePasswordModalOpen] = useState(false);
  const [passwordModalStep, setPasswordModalStep] = useState<'send' | 'verify' | 'new_password'>('send');
  const [passwordCodeDigits, setPasswordCodeDigits] = useState<string[]>(['', '', '', '', '', '']);
  const [passwordGeneratedCode, setPasswordGeneratedCode] = useState('');
  const [passwordCodeError, setPasswordCodeError] = useState('');
  const [passwordResendCooldown, setPasswordResendCooldown] = useState(0);
  const passwordCodeInputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const [newPasswordInput, setNewPasswordInput] = useState('');
  const [confirmNewPasswordInput, setConfirmNewPasswordInput] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [newPasswordError, setNewPasswordError] = useState('');

  const [isAccountDeleted, setIsAccountDeleted] = useState<boolean>(() => {
    return localStorage.getItem('account_deleted') === 'true';
  });
  const [accountJustDeletedNotice, setAccountJustDeletedNotice] = useState(false);
  const [isDeleteAccountModalOpen, setIsDeleteAccountModalOpen] = useState(false);
  const [deleteAccountModalStep, setDeleteAccountModalStep] = useState<'send' | 'verify' | 'confirm'>('send');
  const [deleteAccountCodeDigits, setDeleteAccountCodeDigits] = useState<string[]>(['', '', '', '', '', '']);
  const [deleteAccountGeneratedCode, setDeleteAccountGeneratedCode] = useState('');
  const [deleteAccountCodeError, setDeleteAccountCodeError] = useState('');
  const [deleteAccountResendCooldown, setDeleteAccountResendCooldown] = useState(0);
  const deleteAccountCodeInputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const [regNameInput, setRegNameInput] = useState('');
  const [regUsernameInput, setRegUsernameInput] = useState('');
  const [regEmailInput, setRegEmailInput] = useState('');
  const [regPasswordInput, setRegPasswordInput] = useState('');
  const [regShowPassword, setRegShowPassword] = useState(false);
  const [regFormError, setRegFormError] = useState('');
  const [profilePhotos, setProfilePhotos] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('user_profile_photos');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch {
      // ignore
    }
    return profile.avatar ? [profile.avatar] : [];
  });
  const [photoLightbox, setPhotoLightbox] = useState<{
    photos: string[];
    index: number;
    name: string;
    initials: string;
    isOwn?: boolean;
  } | null>(null);
  const [isQrModalOpen, setIsQrModalOpen] = useState(false);
  const [qrCopied, setQrCopied] = useState(false);
  const [isAuthorQrOpen, setIsAuthorQrOpen] = useState(false);
  const [authorQrCopied, setAuthorQrCopied] = useState(false);
  const [authorLinkCopied, setAuthorLinkCopied] = useState(false);
  const [copiedAuthorEmail, setCopiedAuthorEmail] = useState(false);
  const [isAuthorStoriesViewOpen, setIsAuthorStoriesViewOpen] = useState(false);
  const [isSavedStoriesViewOpen, setIsSavedStoriesViewOpen] = useState(false);
  const [storiesReturnToOwnProfile, setStoriesReturnToOwnProfile] = useState(false);
  const [postOriginAuthor, setPostOriginAuthor] = useState<{ username: string; storiesView: boolean; fromOwnProfile?: boolean } | null>(null);
  const [postOriginSaved, setPostOriginSaved] = useState(false);
  const [replyingToPost, setReplyingToPost] = useState<Post | null>(null);
  const [replyQuoteText, setReplyQuoteText] = useState<string>('');
  const [isQuotePickerOpen, setIsQuotePickerOpen] = useState(false);
  const [quoteSelectionDraft, setQuoteSelectionDraft] = useState<string>('');
  const [readerSelectionPopup, setReaderSelectionPopup] = useState<{ text: string; top: number; left: number } | null>(null);
  const [highlightedReplyQuote, setHighlightedReplyQuote] = useState<{ postId: string; text: string; color: string } | null>(null);
  const [composerLinkPreview, setComposerLinkPreview] = useState<PostLinkPreview | null>(null);
  const [composerPreviewSourceUrl, setComposerPreviewSourceUrl] = useState<string>('');
  const [isLoadingLinkPreview, setIsLoadingLinkPreview] = useState(false);
  const [failedPreviewImages, setFailedPreviewImages] = useState<Record<string, boolean>>({});
  const [hydratedLinkPreviews, setHydratedLinkPreviews] = useState<Record<string, PostLinkPreview>>({});
  const attemptedHydrateUrlsRef = useRef<Set<string>>(new Set());
  const [linkImageLightbox, setLinkImageLightbox] = useState<{
    imageUrl: string;
    title?: string;
    description?: string;
    domain: string;
    linkUrl: string;
    embeddable?: boolean;
    post?: Post;
  } | null>(null);
  const [ytEmbedFailed, setYtEmbedFailed] = useState(false);
  const readerContentRef = useRef<HTMLDivElement | null>(null);
  const storyEndRef = useRef<HTMLDivElement | null>(null);
  const quotePickerContentRef = useRef<HTMLDivElement | null>(null);
  const highlightedQuoteRef = useRef<HTMLElement | null>(null);
  const [isColorPreviewModalOpen, setIsColorPreviewModalOpen] = useState(false);
  const [profileNameColorId, setProfileNameColorId] = useState<string>(() => {
    const saved = localStorage.getItem('profile_name_color_id') || '';
    if (saved === 'grad-rose') return 'solid-pink';
    if (saved.startsWith('grad-')) return saved.replace(/^grad-/, 'solid-');
    return saved;
  });
  const [mutedAuthors, setMutedAuthors] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('muted_authors');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch {
      // ignore
    }
    return [];
  });
  const [blockedUsers, setBlockedUsers] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('blocked_users');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch {
      // ignore
    }
    return [];
  });
  const [activeSessions, setActiveSessions] = useState<SessionItem[]>(() => {
    try {
      const saved = localStorage.getItem('active_sessions');
      if (saved) {
        const parsed = JSON.parse(saved) as SessionItem[];
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // ignore
    }
    const ua = typeof navigator !== 'undefined' ? navigator.userAgent : '';
    const isMobile = /Android|iPhone|iPad|Mobile/i.test(ua);
    const os = /Windows/i.test(ua)
      ? 'Windows'
      : /Mac/i.test(ua)
      ? 'macOS'
      : /Android/i.test(ua)
      ? 'Android'
      : /iPhone|iPad/i.test(ua)
      ? 'iOS'
      : 'Linux';
    const browser = /Edg/i.test(ua)
      ? 'Edge'
      : /Chrome/i.test(ua)
      ? 'Chrome'
      : /Firefox/i.test(ua)
      ? 'Firefox'
      : /Safari/i.test(ua)
      ? 'Safari'
      : 'Brauzer';
    return [
      {
        id: 'session-current',
        device: isMobile ? `Mobil qurilma (${os})` : `Kompyuter (${os})`,
        appInfo: `${browser} · Veb-ilova 1.0`,
        location: "Toshkent, O'zbekiston",
        lastActive: 'onlayn',
        isCurrent: true,
      },
      {
        id: 'session-secondary',
        device: isMobile ? 'Kompyuter (Windows)' : 'Mobil qurilma (Android)',
        appInfo: 'Chrome · Mobil veb',
        location: "Toshkent, O'zbekiston",
        lastActive: 'Kecha, 21:40',
        isCurrent: false,
      },
    ];
  });

  // Avatar cropper states
  const [cropperImageSrc, setCropperImageSrc] = useState<string | null>(null);
  const [cropNaturalSize, setCropNaturalSize] = useState<{ width: number; height: number }>({ width: 0, height: 0 });
  const [cropStageSize, setCropStageSize] = useState<{ width: number; height: number }>({ width: 400, height: 480 });
  const [cropBox, setCropBox] = useState<{ x: number; y: number; size: number }>({ x: 0, y: 0, size: 200 });
  const [cropRotation, setCropRotation] = useState<number>(0);
  const [cropFlipH, setCropFlipH] = useState<boolean>(false);
  const cropStageRef = useRef<HTMLDivElement | null>(null);
  const cropDragRef = useRef<{
    mode: 'move' | 'tl' | 'tr' | 'bl' | 'br' | null;
    startX: number;
    startY: number;
    origBox: { x: number; y: number; size: number };
  }>({
    mode: null,
    startX: 0,
    startY: 0,
    origBox: { x: 0, y: 0, size: 200 },
  });

  const [isPostsDrawerOpen, setIsPostsDrawerOpen] = useState(false);
  const [isNotificationsModalOpen, setIsNotificationsModalOpen] = useState(false);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [searchModalQuery, setSearchModalQuery] = useState('');

  // Author profile view state
  const [viewingAuthorUsername, setViewingAuthorUsername] = useState<string | null>(null);

  // Delete confirmation state
  const [postToDelete, setPostToDelete] = useState<string | null>(null);

  // Real OS Notification permission state (no fake in-app popups when unpermitted)
  const [notificationPermission, setNotificationPermission] = useState<'default' | 'granted' | 'denied' | 'unsupported'>(() => {
    if (typeof window === 'undefined' || !('Notification' in window)) return 'unsupported';
    return Notification.permission;
  });
  const [isInIframe] = useState(() => {
    if (typeof window === 'undefined') return false;
    try {
      return window.self !== window.top;
    } catch {
      return true;
    }
  });
  const [isNotificationBlockedHelpOpen, setIsNotificationBlockedHelpOpen] = useState(false);

  // Telegram-style Notification Preferences (persisted in localStorage)
  const [desktopNotificationsEnabled, setDesktopNotificationsEnabled] = useState<boolean>(() => {
    const saved = localStorage.getItem('notif_desktop_enabled');
    return saved !== null ? saved === 'true' : true;
  });
  const [allowSound, setAllowSound] = useState<boolean>(() => {
    const saved = localStorage.getItem('notif_allow_sound');
    return saved !== null ? saved === 'true' : true;
  });
  const [notifVolume, setNotifVolume] = useState<number>(() => {
    const saved = localStorage.getItem('notif_volume');
    if (saved === null) return 100;
    const parsed = Number(saved);
    return Number.isFinite(parsed) ? Math.min(100, Math.max(0, Math.round(parsed))) : 100;
  });
  const allowSoundRef = useRef(allowSound);
  const notifVolumeRef = useRef(notifVolume);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const chimeWavUrlRef = useRef<string | null>(null);
  const [showNotifName, setShowNotifName] = useState<boolean>(() => {
    const saved = localStorage.getItem('notif_show_name');
    return saved !== null ? saved === 'true' : true;
  });
  const [showNotifText, setShowNotifText] = useState<boolean>(() => {
    const saved = localStorage.getItem('notif_show_text');
    return saved !== null ? saved === 'true' : true;
  });
  const [notifCorner, setNotifCorner] = useState<'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'>(() => {
    const saved = localStorage.getItem('notif_corner');
    if (saved === 'top-left' || saved === 'top-right' || saved === 'bottom-left' || saved === 'bottom-right') {
      return saved;
    }
    return 'bottom-right';
  });
  const [notifCount, setNotifCount] = useState<number>(() => {
    const saved = Number(localStorage.getItem('notif_count'));
    return saved >= 1 && saved <= 5 ? saved : 1;
  });
  const osNotifSlotRef = useRef(0);

  const hasScheduledInitialPopupRef = useRef(false);
  const shownPopupNotifIdsRef = useRef<Set<string>>((() => {
    try {
      const saved = localStorage.getItem('shown_popup_notif_ids');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return new Set<string>(parsed);
      }
    } catch {
      // ignore
    }
    return new Set<string>();
  })());

  // Sync theme
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      document.body.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      document.body.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  // Persist storage
  useEffect(() => {
    localStorage.setItem('user_profile', JSON.stringify(profile));
  }, [profile]);

  useEffect(() => {
    localStorage.setItem('user_posts', JSON.stringify(posts));
  }, [posts]);

  useEffect(() => {
    localStorage.setItem('subscribed_authors', JSON.stringify(subscribedAuthors));
  }, [subscribedAuthors]);

  useEffect(() => {
    localStorage.setItem('post_share_counts', JSON.stringify(shareCounts));
  }, [shareCounts]);

  useEffect(() => {
    localStorage.setItem('post_view_counts', JSON.stringify(viewCounts));
  }, [viewCounts]);

  useEffect(() => {
    localStorage.setItem('post_save_counts', JSON.stringify(saveCounts));
  }, [saveCounts]);

  useEffect(() => {
    localStorage.setItem('saved_post_ids', JSON.stringify(savedPostIds));
  }, [savedPostIds]);

  useEffect(() => {
    localStorage.setItem('user_notifications', JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem('notif_desktop_enabled', String(desktopNotificationsEnabled));
  }, [desktopNotificationsEnabled]);

  useEffect(() => {
    allowSoundRef.current = allowSound;
    localStorage.setItem('notif_allow_sound', String(allowSound));
  }, [allowSound]);

  useEffect(() => {
    notifVolumeRef.current = notifVolume;
    localStorage.setItem('notif_volume', String(notifVolume));
  }, [notifVolume]);

  useEffect(() => {
    const unlockAudio = () => {
      try {
        const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
        if (!AudioCtx) return;
        if (!audioCtxRef.current || audioCtxRef.current.state === 'closed') {
          audioCtxRef.current = new AudioCtx();
        }
        if (audioCtxRef.current.state === 'suspended') {
          void audioCtxRef.current.resume().catch(() => {});
        }
      } catch {
        // ignore audio init restrictions
      }
    };
    window.addEventListener('pointerdown', unlockAudio, { passive: true });
    window.addEventListener('keydown', unlockAudio, { passive: true });
    window.addEventListener('touchstart', unlockAudio, { passive: true });
    return () => {
      window.removeEventListener('pointerdown', unlockAudio);
      window.removeEventListener('keydown', unlockAudio);
      window.removeEventListener('touchstart', unlockAudio);
    };
  }, []);

  useEffect(() => {
    localStorage.setItem('notif_show_name', String(showNotifName));
  }, [showNotifName]);

  useEffect(() => {
    localStorage.setItem('notif_show_text', String(showNotifText));
  }, [showNotifText]);

  useEffect(() => {
    localStorage.setItem('notif_corner', notifCorner);
  }, [notifCorner]);

  useEffect(() => {
    localStorage.setItem('notif_count', String(notifCount));
  }, [notifCount]);

  useEffect(() => {
    localStorage.setItem('login_email', loginEmail);
  }, [loginEmail]);

  useEffect(() => {
    localStorage.setItem('blocked_users', JSON.stringify(blockedUsers));
  }, [blockedUsers]);

  useEffect(() => {
    localStorage.setItem('muted_authors', JSON.stringify(mutedAuthors));
  }, [mutedAuthors]);

  useEffect(() => {
    localStorage.setItem('active_sessions', JSON.stringify(activeSessions));
  }, [activeSessions]);

  useEffect(() => {
    localStorage.setItem('default_interface_scale', String(defaultInterfaceScale));
    localStorage.setItem('interface_scale', String(interfaceScale));
    const effective = defaultInterfaceScale ? 100 : interfaceScale;
    document.documentElement.style.fontSize = `${(effective / 100) * 16}px`;
  }, [defaultInterfaceScale, interfaceScale]);

  useEffect(() => {
    localStorage.setItem('is_authenticated', String(isAuthenticated));
  }, [isAuthenticated]);

  useEffect(() => {
    localStorage.setItem('account_password', accountPassword);
  }, [accountPassword]);

  useEffect(() => {
    localStorage.setItem('password_customized', String(isPasswordCustomized));
  }, [isPasswordCustomized]);

  useEffect(() => {
    localStorage.setItem('account_deleted', String(isAccountDeleted));
  }, [isAccountDeleted]);

  useEffect(() => {
    try {
      localStorage.setItem('user_profile_photos', JSON.stringify(profilePhotos));
    } catch {
      // ignore storage quota errors
    }
  }, [profilePhotos]);

  useEffect(() => {
    if (!photoLightbox) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setPhotoLightbox(null);
      } else if (e.key === 'ArrowLeft' && photoLightbox.photos.length > 1) {
        setPhotoLightbox(prev =>
          prev ? { ...prev, index: (prev.index - 1 + prev.photos.length) % prev.photos.length } : null
        );
      } else if (e.key === 'ArrowRight' && photoLightbox.photos.length > 1) {
        setPhotoLightbox(prev =>
          prev ? { ...prev, index: (prev.index + 1) % prev.photos.length } : null
        );
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [photoLightbox]);

  useEffect(() => {
    setYtEmbedFailed(false);
    if (!linkImageLightbox) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setLinkImageLightbox(null);
      }
    };
    const handleMessage = (e: MessageEvent) => {
      if (!e.origin.includes('youtube.com') && !e.origin.includes('youtube-nocookie.com')) return;
      try {
        const data = typeof e.data === 'string' ? JSON.parse(e.data) : e.data;
        if (data && data.event === 'onError') {
          setYtEmbedFailed(true);
        }
      } catch {
        // ignore non-JSON messages
      }
    };
    window.addEventListener('keydown', handleKey);
    window.addEventListener('message', handleMessage);
    return () => {
      window.removeEventListener('keydown', handleKey);
      window.removeEventListener('message', handleMessage);
    };
  }, [linkImageLightbox]);

  useEffect(() => {
    localStorage.setItem('profile_name_color_id', profileNameColorId);
  }, [profileNameColorId]);

  const activeNamePreset = useMemo(
    () => PROFILE_COLOR_PRESETS.find(c => c.id === profileNameColorId) || null,
    [profileNameColorId]
  );

  const getPresetTextStyle = (preset: ProfileColorPreset | null): React.CSSProperties | undefined => {
    if (!preset) return undefined;
    return { color: preset.primary };
  };

  const getAuthorNameStyle = (username?: string): React.CSSProperties | undefined => {
    if (!username || username.toLowerCase() === profile.username.toLowerCase()) {
      return getPresetTextStyle(activeNamePreset);
    }
    const lower = username.toLowerCase();
    if (AUTHOR_FIXED_COLORS[lower]) {
      return { color: AUTHOR_FIXED_COLORS[lower] };
    }
    let hash = 0;
    for (let i = 0; i < lower.length; i++) {
      hash = (hash * 31 + lower.charCodeAt(i)) >>> 0;
    }
    return { color: PROFILE_COLOR_PRESETS[hash % PROFILE_COLOR_PRESETS.length].primary };
  };

  const getAuthorQrColor = (username?: string): string => {
    if (!username || username.toLowerCase() === profile.username.toLowerCase()) {
      return activeNamePreset ? activeNamePreset.primary : '#3390ec';
    }
    return String(getAuthorNameStyle(username)?.color || '#3390ec');
  };

  const getAuthorReplyColor = (username?: string): string => {
    if (!username || username.toLowerCase() === profile.username.toLowerCase()) {
      return activeNamePreset ? activeNamePreset.primary : '#3390ec';
    }
    return String(getAuthorNameStyle(username)?.color || '#3390ec');
  };

  const hexToRgba = (hex: string, alpha: number): string => {
    const clean = hex.replace('#', '');
    if (clean.length !== 6) return `rgba(51, 144, 236, ${alpha})`;
    const r = parseInt(clean.slice(0, 2), 16);
    const g = parseInt(clean.slice(2, 4), 16);
    const b = parseInt(clean.slice(4, 6), 16);
    if (Number.isNaN(r) || Number.isNaN(g) || Number.isNaN(b)) {
      return `rgba(51, 144, 236, ${alpha})`;
    }
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  };

  useEffect(() => {
    if (!isQrModalOpen && !isAuthorQrOpen && !isAuthorStoriesViewOpen && !isSavedStoriesViewOpen && !isQuotePickerOpen && !isColorPreviewModalOpen && !isDeleteAccountModalOpen) return;
    const onEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (isQuotePickerOpen) setIsQuotePickerOpen(false);
        else if (isAuthorQrOpen) setIsAuthorQrOpen(false);
        else if (isAuthorStoriesViewOpen) {
          setIsAuthorStoriesViewOpen(false);
          if (storiesReturnToOwnProfile) {
            setViewingAuthorUsername(null);
            setIsProfileDrawerOpen(true);
            setStoriesReturnToOwnProfile(false);
          }
        }
        else if (isSavedStoriesViewOpen) {
          setIsSavedStoriesViewOpen(false);
          setIsProfileDrawerOpen(true);
        }
        if (isQrModalOpen) setIsQrModalOpen(false);
        if (isColorPreviewModalOpen) setIsColorPreviewModalOpen(false);
        if (isDeleteAccountModalOpen) setIsDeleteAccountModalOpen(false);
      }
    };
    window.addEventListener('keydown', onEsc);
    return () => window.removeEventListener('keydown', onEsc);
  }, [isQrModalOpen, isAuthorQrOpen, isAuthorStoriesViewOpen, isSavedStoriesViewOpen, isQuotePickerOpen, storiesReturnToOwnProfile, isColorPreviewModalOpen, isDeleteAccountModalOpen]);

  useEffect(() => {
    if (!readerSelectionPopup) return;
    const onSelectionChange = () => {
      const sel = window.getSelection()?.toString().trim() || '';
      if (!sel) {
        setReaderSelectionPopup(null);
      }
    };
    document.addEventListener('selectionchange', onSelectionChange);
    return () => document.removeEventListener('selectionchange', onSelectionChange);
  }, [readerSelectionPopup]);

  useEffect(() => {
    if (!viewingPost || !highlightedReplyQuote || highlightedReplyQuote.postId !== viewingPost.id) return;
    const timer = setTimeout(() => {
      highlightedQuoteRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 80);
    return () => clearTimeout(timer);
  }, [viewingPost?.id, highlightedReplyQuote]);

  const extractFirstUrl = (text: string): string => {
    const match = text.match(/(?:https?:\/\/|www\.)[^\s<>"'`]+/i);
    if (!match) return '';
    const cleaned = match[0].replace(/[.,;:!?)]+$/, '');
    return /^www\./i.test(cleaned) ? `https://${cleaned}` : cleaned;
  };

  const extractYoutubeVideoId = (rawUrl: string): string => {
    if (!rawUrl) return '';
    try {
      const parsed = new URL(rawUrl);
      const host = parsed.hostname.toLowerCase();
      let videoId = '';
      if (host === 'youtu.be') {
        videoId = parsed.pathname.slice(1).split('/')[0] || '';
      } else if (host === 'youtube.com' || host.endsWith('.youtube.com')) {
        const parts = parsed.pathname.split('/').filter(Boolean);
        if (parts[0] === 'shorts' || parts[0] === 'live' || parts[0] === 'embed' || parts[0] === 'v') {
          videoId = parts[1] || '';
        } else {
          videoId = parsed.searchParams.get('v') || '';
        }
      }
      return videoId && /^[a-zA-Z0-9_-]{6,20}$/.test(videoId) ? videoId : '';
    } catch {
      return '';
    }
  };

  useEffect(() => {
    const detectedUrl = extractFirstUrl(editorText);
    if (!detectedUrl) {
      setComposerLinkPreview(null);
      setComposerPreviewSourceUrl('');
      setIsLoadingLinkPreview(false);
      return;
    }

    let cancelled = false;
    setIsLoadingLinkPreview(true);
    const timer = setTimeout(async () => {
      try {
        const res = await fetch(`/api/link-preview?url=${encodeURIComponent(detectedUrl)}`);
        if (!res.ok) throw new Error('Preview error');
        const data = (await res.json()) as PostLinkPreview;
        if (!cancelled) {
          setComposerLinkPreview(data && data.url ? data : null);
          setComposerPreviewSourceUrl(detectedUrl);
        }
      } catch {
        if (!cancelled) {
          try {
            const parsed = new URL(detectedUrl);
            setComposerLinkPreview({
              url: parsed.href,
              domain: parsed.hostname.replace(/^www\./i, ''),
              title: parsed.hostname.replace(/^www\./i, ''),
            });
            setComposerPreviewSourceUrl(detectedUrl);
          } catch {
            setComposerLinkPreview(null);
            setComposerPreviewSourceUrl('');
          }
        }
      } finally {
        if (!cancelled) {
          setIsLoadingLinkPreview(false);
        }
      }
    }, 350);

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [editorText]);

  const isPlaceholderYoutubePreview = (preview?: PostLinkPreview): boolean => {
    if (!preview || !extractYoutubeVideoId(preview.url)) return false;
    const t = (preview.title || '').trim().toLowerCase();
    return (
      !t ||
      t === 'youtube.com' ||
      t === 'youtu.be' ||
      t === 'youtube video' ||
      typeof preview.embeddable !== 'boolean'
    );
  };

  const getPostLinkPreview = (post: Post): PostLinkPreview | undefined => {
    const candidateUrl = post.linkPreview?.url || extractFirstUrl(post.content);
    if (candidateUrl && hydratedLinkPreviews[candidateUrl]) {
      return hydratedLinkPreviews[candidateUrl];
    }
    if (post.linkPreview?.imageUrl) return post.linkPreview;
    return post.linkPreview;
  };

  useEffect(() => {
    const urlsToFetch: string[] = [];
    const considerPost = (p: Post) => {
      const needsYtUpgrade = isPlaceholderYoutubePreview(p.linkPreview);
      if (p.linkPreview?.imageUrl && !needsYtUpgrade) return;
      const targetUrl = p.linkPreview?.url || extractFirstUrl(p.content);
      if (!targetUrl) return;
      if (hydratedLinkPreviews[targetUrl] || attemptedHydrateUrlsRef.current.has(targetUrl)) return;
      if (!urlsToFetch.includes(targetUrl)) {
        urlsToFetch.push(targetUrl);
      }
    };

    if (viewingPost) considerPost(viewingPost);
    posts.slice(0, 20).forEach(considerPost);

    if (urlsToFetch.length === 0) return;

    let cancelled = false;
    urlsToFetch.slice(0, 6).forEach(targetUrl => {
      attemptedHydrateUrlsRef.current.add(targetUrl);
      void (async () => {
        try {
          const res = await fetch(`/api/link-preview?url=${encodeURIComponent(targetUrl)}`);
          if (!res.ok) return;
          const data = (await res.json()) as PostLinkPreview;
          if (cancelled || !data || !data.url) return;
          setHydratedLinkPreviews(prev => ({ ...prev, [targetUrl]: data }));
          if (data.imageUrl || data.description || (data.title && data.title !== data.domain) || typeof data.embeddable === 'boolean') {
            setPosts(prevPosts =>
              prevPosts.map(item => {
                const itemUrl = item.linkPreview?.url || extractFirstUrl(item.content);
                if (itemUrl === targetUrl && (!item.linkPreview?.imageUrl || isPlaceholderYoutubePreview(item.linkPreview))) {
                  return { ...item, linkPreview: data };
                }
                return item;
              })
            );
            setViewingPost(prevViewing => {
              if (!prevViewing) return prevViewing;
              const viewingUrl = prevViewing.linkPreview?.url || extractFirstUrl(prevViewing.content);
              if (viewingUrl === targetUrl && (!prevViewing.linkPreview?.imageUrl || isPlaceholderYoutubePreview(prevViewing.linkPreview))) {
                return { ...prevViewing, linkPreview: data };
              }
              return prevViewing;
            });
          }
        } catch {
          // ignore offline/transient link fetch errors
        }
      })();
    });

    return () => {
      cancelled = true;
    };
  }, [posts, viewingPost, hydratedLinkPreviews]);

  useEffect(() => {
    if (!isAuthenticated || typeof window === 'undefined') return;
    const params = new URLSearchParams(window.location.search);
    const targetUser = params.get('u');
    if (targetUser) {
      const normalized = targetUser.startsWith('@') ? targetUser : `@${targetUser}`;
      if (normalized.toLowerCase() === profile.username.toLowerCase()) {
        setIsProfileDrawerOpen(true);
      } else {
        setViewingAuthorUsername(normalized);
      }
      params.delete('u');
      const nextUrl = `${window.location.pathname}${params.toString() ? `?${params.toString()}` : ''}`;
      window.history.replaceState({}, '', nextUrl);
    }
  }, [isAuthenticated, profile.username]);

  const buildQrMatrixForUsername = (username: string) => {
    try {
      const cleanUser = username.replace(/^@/, '');
      const origin = typeof window !== 'undefined' ? window.location.origin : 'https://minimalist.uz';
      const targetUrl = `${origin}/?u=${encodeURIComponent(cleanUser)}`;
      const qr = QRCode.create(targetUrl, { errorCorrectionLevel: 'M' });
      const size = qr.modules.size;
      const data = qr.modules.data;
      const rows: boolean[][] = [];
      for (let r = 0; r < size; r++) {
        const row: boolean[] = [];
        for (let c = 0; c < size; c++) {
          row.push(Boolean(data[r * size + c]));
        }
        rows.push(row);
      }
      return { size, rows, targetUrl };
    } catch {
      return { size: 0, rows: [] as boolean[][], targetUrl: '' };
    }
  };

  const qrMatrix = useMemo(() => buildQrMatrixForUsername(profile.username), [profile.username]);
  const authorQrMatrix = useMemo(
    () => (viewingAuthorUsername ? buildQrMatrixForUsername(viewingAuthorUsername) : { size: 0, rows: [] as boolean[][], targetUrl: '' }),
    [viewingAuthorUsername]
  );

  const shareOrDownloadQrCard = async (
    matrix: { size: number; rows: boolean[][]; targetUrl: string },
    displayName: string,
    username: string,
    accentColor = '#3390ec'
  ) => {
    if (!matrix.size) return;
    try {
      const canvas = document.createElement('canvas');
      const W = 720;
      const H = 880;
      canvas.width = W;
      canvas.height = H;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      ctx.fillStyle = '#1f1f1f';
      ctx.fillRect(0, 0, W, H);

      const cardX = 95;
      const cardY = 120;
      const cardW = 530;
      const cardH = 630;
      const radius = 48;
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.moveTo(cardX + radius, cardY);
      ctx.lineTo(cardX + cardW - radius, cardY);
      ctx.quadraticCurveTo(cardX + cardW, cardY, cardX + cardW, cardY + radius);
      ctx.lineTo(cardX + cardW, cardY + cardH - radius);
      ctx.quadraticCurveTo(cardX + cardW, cardY + cardH, cardX + cardW - radius, cardY + cardH);
      ctx.lineTo(cardX + radius, cardY + cardH);
      ctx.quadraticCurveTo(cardX, cardY + cardH, cardX, cardY + cardH - radius);
      ctx.lineTo(cardX, cardY + radius);
      ctx.quadraticCurveTo(cardX, cardY, cardX + radius, cardY);
      ctx.closePath();
      ctx.fill();

      const qrPad = 48;
      const qrBox = cardW - qrPad * 2;
      const cell = qrBox / matrix.size;
      const startX = cardX + qrPad;
      const startY = cardY + 46;

      ctx.fillStyle = accentColor;
      for (let r = 0; r < matrix.size; r++) {
        for (let c = 0; c < matrix.size; c++) {
          if (!matrix.rows[r][c]) continue;
          ctx.beginPath();
          ctx.roundRect(startX + c * cell, startY + r * cell, cell * 0.92, cell * 0.92, cell * 0.32);
          ctx.fill();
        }
      }

      ctx.fillStyle = accentColor;
      ctx.font = 'bold 38px Inter, system-ui, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(username.toUpperCase(), W / 2, cardY + cardH - 52);

      const blob = await new Promise<Blob | null>(resolve => canvas.toBlob(resolve, 'image/png'));
      if (!blob) return;
      const file = new File([blob], `qr-${username.replace(/^@/, '')}.png`, { type: 'image/png' });

      if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
        try {
          await navigator.share({
            title: `${displayName} (${username})`,
            text: matrix.targetUrl,
            files: [file],
          });
          return;
        } catch {
          // fallback to download
        }
      }

      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `qr-${username.replace(/^@/, '')}.png`;
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      // ignore canvas export restrictions
    }
  };

  useEffect(() => {
    if (!isChangePasswordModalOpen || passwordModalStep !== 'verify' || passwordResendCooldown <= 0) return;
    const timer = setTimeout(() => {
      setPasswordResendCooldown(prev => Math.max(0, prev - 1));
    }, 1000);
    return () => clearTimeout(timer);
  }, [isChangePasswordModalOpen, passwordModalStep, passwordResendCooldown]);

  useEffect(() => {
    if (!isDeleteAccountModalOpen || deleteAccountModalStep !== 'verify' || deleteAccountResendCooldown <= 0) return;
    const timer = setTimeout(() => {
      setDeleteAccountResendCooldown(prev => Math.max(0, prev - 1));
    }, 1000);
    return () => clearTimeout(timer);
  }, [isDeleteAccountModalOpen, deleteAccountModalStep, deleteAccountResendCooldown]);

  // Auto-resize bottom composer textarea up to the bottom edge of the search header
  useEffect(() => {
    const updateHeight = () => {
      const el = composerRef.current;
      if (!el) return;
      const viewportH = window.visualViewport?.height ?? window.innerHeight;
      const hasContextStrip = Boolean(activePostId);
      const reserved = 80 + (hasContextStrip ? 34 : 0);
      const maxH = Math.max(120, viewportH - reserved);
      el.style.maxHeight = `${maxH}px`;
      el.style.height = 'auto';
      el.style.height = `${Math.min(el.scrollHeight, maxH)}px`;
    };

    updateHeight();
    window.addEventListener('resize', updateHeight);
    window.visualViewport?.addEventListener('resize', updateHeight);
    return () => {
      window.removeEventListener('resize', updateHeight);
      window.visualViewport?.removeEventListener('resize', updateHeight);
    };
  }, [editorText, viewingPost, activePostId]);

  useEffect(() => {
    if (!openMenuPostId) return;
    const closeMenu = () => setOpenMenuPostId(null);
    window.addEventListener('click', closeMenu);
    return () => window.removeEventListener('click', closeMenu);
  }, [openMenuPostId]);

  const createAvatarIconUrl = (name: string, existingAvatar?: string) => {
    if (existingAvatar) return existingAvatar;
    try {
      const canvas = document.createElement('canvas');
      canvas.width = 96;
      canvas.height = 96;
      const ctx = canvas.getContext('2d');
      if (!ctx) return undefined;
      ctx.fillStyle = '#3390ec';
      ctx.beginPath();
      ctx.arc(48, 48, 48, 0, Math.PI * 2);
      ctx.fill();
      const initials =
        name
          .split(' ')
          .map(n => n[0])
          .filter(Boolean)
          .join('')
          .substring(0, 2)
          .toUpperCase() || 'M';
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 36px Inter, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(initials, 48, 50);
      return canvas.toDataURL('image/png');
    } catch {
      return undefined;
    }
  };

  const getNotificationWavUrl = () => {
    if (chimeWavUrlRef.current) return chimeWavUrlRef.current;
    const sampleRate = 22050;
    const duration = 0.32;
    const numSamples = Math.floor(sampleRate * duration);
    const buffer = new ArrayBuffer(44 + numSamples * 2);
    const view = new DataView(buffer);

    const writeStr = (offset: number, str: string) => {
      for (let i = 0; i < str.length; i++) {
        view.setUint8(offset + i, str.charCodeAt(i));
      }
    };

    writeStr(0, 'RIFF');
    view.setUint32(4, 36 + numSamples * 2, true);
    writeStr(8, 'WAVE');
    writeStr(12, 'fmt ');
    view.setUint32(16, 16, true);
    view.setUint16(20, 1, true);
    view.setUint16(22, 1, true);
    view.setUint32(24, sampleRate, true);
    view.setUint32(28, sampleRate * 2, true);
    view.setUint16(32, 2, true);
    view.setUint16(34, 16, true);
    writeStr(36, 'data');
    view.setUint32(40, numSamples * 2, true);

    for (let i = 0; i < numSamples; i++) {
      const t = i / sampleRate;
      let sample = 0;
      if (t < 0.11) {
        const env = Math.sin((Math.PI * t) / 0.11) * Math.exp(-t * 14);
        sample += Math.sin(2 * Math.PI * 659.25 * t) * 0.7 * env;
        sample += Math.sin(2 * Math.PI * 1318.5 * t) * 0.25 * env;
      }
      if (t >= 0.08) {
        const t2 = t - 0.08;
        const env2 = Math.min(1, t2 / 0.015) * Math.exp(-t2 * 13);
        sample += Math.sin(2 * Math.PI * 987.77 * t2) * 0.75 * env2;
        sample += Math.sin(2 * Math.PI * 1975.53 * t2) * 0.22 * env2;
      }
      const clamped = Math.max(-1, Math.min(1, sample));
      view.setInt16(44 + i * 2, clamped * 32767, true);
    }

    const bytes = new Uint8Array(buffer);
    let binary = '';
    for (let i = 0; i < bytes.length; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    const url = `data:audio/wav;base64,${btoa(binary)}`;
    chimeWavUrlRef.current = url;
    return url;
  };

  const playNotificationSound = (volumeOverride?: number) => {
    const targetVolume =
      typeof volumeOverride === 'number'
        ? volumeOverride
        : allowSoundRef.current
        ? notifVolumeRef.current
        : 0;
    const ratio = Math.min(1, Math.max(0, targetVolume / 100));
    if (ratio <= 0) return;

    const perceptualGain = Math.pow(ratio, 1.35);

    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        if (!audioCtxRef.current || audioCtxRef.current.state === 'closed') {
          audioCtxRef.current = new AudioCtx();
        }
        const ctx = audioCtxRef.current;
        if (ctx.state === 'suspended') {
          void ctx.resume().catch(() => {});
        }
        if (ctx.state === 'running') {
          const now = ctx.currentTime;
          const peak = Math.max(0.008, perceptualGain * 0.45);

          // Birinchi nota (E5)
          const osc1 = ctx.createOscillator();
          const gain1 = ctx.createGain();
          osc1.type = 'sine';
          osc1.frequency.setValueAtTime(659.25, now);
          gain1.gain.setValueAtTime(0.0001, now);
          gain1.gain.linearRampToValueAtTime(peak, now + 0.015);
          gain1.gain.exponentialRampToValueAtTime(0.0001, now + 0.13);
          osc1.connect(gain1);
          gain1.connect(ctx.destination);
          osc1.start(now);
          osc1.stop(now + 0.14);

          // Ikkinchi nota (B5)
          const osc2 = ctx.createOscillator();
          const gain2 = ctx.createGain();
          osc2.type = 'sine';
          osc2.frequency.setValueAtTime(987.77, now + 0.08);
          gain2.gain.setValueAtTime(0.0001, now + 0.08);
          gain2.gain.linearRampToValueAtTime(peak * 1.05, now + 0.098);
          gain2.gain.exponentialRampToValueAtTime(0.0001, now + 0.31);
          osc2.connect(gain2);
          gain2.connect(ctx.destination);
          osc2.start(now + 0.08);
          osc2.stop(now + 0.32);
          return;
        }
      }
    } catch {
      // fallback to HTMLAudioElement below
    }

    try {
      const audio = new Audio(getNotificationWavUrl());
      audio.volume = Math.min(1, Math.max(0, perceptualGain));
      void audio.play().catch(() => {});
    } catch {
      // ignore audio restrictions
    }
  };

  const showRealOsNotification = async (
    item: Omit<OsNotificationPayload, 'id'> & { id?: string },
    opts?: { skipSound?: boolean }
  ): Promise<boolean> => {
    if (typeof window === 'undefined' || !('Notification' in window)) return false;
    if (item.targetUsername && mutedAuthors.includes(item.targetUsername)) return false;
    if (!desktopNotificationsEnabled || Notification.permission !== 'granted') return false;

    const shouldPlaySound = !opts?.skipSound && allowSoundRef.current && notifVolumeRef.current > 0;
    const iconUrl = createAvatarIconUrl(item.senderName, item.avatar);
    const titleText = showNotifName ? item.senderName : 'Yangi bildirishnoma';
    const bodyText = showNotifText ? item.message : 'Sizda yangi xabar bor';
    const slotTag = `notif-slot-${osNotifSlotRef.current % Math.max(1, notifCount)}`;
    osNotifSlotRef.current += 1;

    const options: NotificationOptions = {
      body: bodyText,
      icon: iconUrl,
      badge: iconUrl,
      tag: slotTag,
      silent: !allowSoundRef.current || notifVolumeRef.current <= 0,
    };

    const handleOpen = () => {
      window.focus();
      if (item.notificationId) {
        setNotifications(prev =>
          prev.map(n => (n.id === item.notificationId ? { ...n, read: true } : n))
        );
      }
      if (item.targetPostId) {
        const post = allPosts.find(p => p.id === item.targetPostId);
        if (post) {
          openCommunityPost(post);
          return;
        }
      }
      if (item.targetUsername) {
        openAuthorProfileByUsername(item.targetUsername);
      }
    };

    try {
      const n = new Notification(titleText, options);
      if (shouldPlaySound) {
        playNotificationSound();
      }
      n.onclick = () => {
        n.close();
        handleOpen();
      };
      return true;
    } catch {
      // Mobil brauzerlar (Android Chrome) ServiceWorkerRegistration.showNotification talab qiladi
      try {
        if ('serviceWorker' in navigator) {
          const reg =
            (await navigator.serviceWorker.getRegistration()) ||
            (await navigator.serviceWorker.register('/sw.js'));
          await reg.showNotification(titleText, options);
          if (shouldPlaySound) {
            playNotificationSound();
          }
          return true;
        }
      } catch {
        return false;
      }
    }
    return false;
  };

  const requestSystemNotifications = async () => {
    if (typeof window === 'undefined' || !('Notification' in window)) {
      setNotificationPermission('unsupported');
      return;
    }

    try {
      const perm = await Notification.requestPermission();
      setNotificationPermission(perm);

      if (perm === 'granted') {
        setDesktopNotificationsEnabled(true);
        setIsNotificationBlockedHelpOpen(false);
        if ('serviceWorker' in navigator) {
          navigator.serviceWorker.register('/sw.js').catch(() => {});
        }
        await showRealOsNotification({
          id: `welcome-os-${Date.now()}`,
          senderName: 'Bildirishnomalar yoqildi',
          message: "Endi yangi xabarlar kompyuterda pastdan, telefonda esa tepadan keladi.",
          actionLabel: "KO'RISH",
        });
      } else {
        setIsNotificationBlockedHelpOpen(true);
      }
    } catch {
      setNotificationPermission(Notification.permission);
      setIsNotificationBlockedHelpOpen(true);
    }
  };

  const sendTestOsNotification = async () => {
    if (typeof window === 'undefined' || !('Notification' in window)) return;
    if (Notification.permission !== 'granted') {
      await requestSystemNotifications();
      return;
    }
    const sampleItem: OsNotificationPayload = {
      id: `test-${Date.now()}`,
      senderName: 'Azizbek Karimov',
      senderUsername: '@azizbek',
      message: "Yangi hikoyani o'qing!",
      actionLabel: "O'QISH",
      targetPostId: 'c1',
      targetUsername: '@azizbek',
    };
    await showRealOsNotification(sampleItem);
  };

  const markPopupNotifShown = (key: string) => {
    if (!key) return;
    shownPopupNotifIdsRef.current.add(key);
    try {
      const arr = Array.from(shownPopupNotifIdsRef.current).slice(-100);
      localStorage.setItem('shown_popup_notif_ids', JSON.stringify(arr));
    } catch {
      // ignore storage quota errors
    }
  };

  const triggerOsNotification = (
    item: Omit<OsNotificationPayload, 'id'> & { id?: string },
    opts?: { playSound?: boolean }
  ) => {
    const id = item.id || `tg-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
    const dedupeKey = item.notificationId || id;
    if (shownPopupNotifIdsRef.current.has(dedupeKey)) {
      return;
    }
    markPopupNotifShown(dedupeKey);

    if ((opts?.playSound ?? true) && allowSoundRef.current && notifVolumeRef.current > 0) {
      playNotificationSound();
    }

    if (typeof window === 'undefined' || !('Notification' in window)) return;
    if (Notification.permission !== 'granted') return;

    const nextItem: OsNotificationPayload = { ...item, id };
    void showRealOsNotification(nextItem, { skipSound: true });
  };

  useEffect(() => {
    if (typeof window === 'undefined' || !('Notification' in window)) return;

    const syncPermission = () => {
      const current = Notification.permission;
      setNotificationPermission(current);
      if (current === 'granted') {
        setIsNotificationBlockedHelpOpen(false);
        if ('serviceWorker' in navigator) {
          navigator.serviceWorker.register('/sw.js').catch(() => {});
        }
      }
    };

    syncPermission();
    window.addEventListener('focus', syncPermission);
    document.addEventListener('visibilitychange', syncPermission);

    let permStatus: PermissionStatus | null = null;
    if ('permissions' in navigator && typeof navigator.permissions?.query === 'function') {
      navigator.permissions
        .query({ name: 'notifications' as PermissionName })
        .then(status => {
          permStatus = status;
          status.onchange = syncPermission;
        })
        .catch(() => {});
    }

    return () => {
      window.removeEventListener('focus', syncPermission);
      document.removeEventListener('visibilitychange', syncPermission);
      if (permStatus) {
        permStatus.onchange = null;
      }
    };
  }, []);

  // Har bir o'qilmagan bildirishnomani faqat ruxsat berilganda bir marta haqiqiy tizim bildirishnomasi sifatida chiqarish
  useEffect(() => {
    if (hasScheduledInitialPopupRef.current) return;
    hasScheduledInitialPopupRef.current = true;

    const initialTimer = setTimeout(() => {
      if (typeof window === 'undefined' || !('Notification' in window)) return;
      if (Notification.permission !== 'granted') return;

      const unshownUnread = notifications.filter(
        n => !n.read && !shownPopupNotifIdsRef.current.has(n.id)
      );
      if (unshownUnread.length === 0) return;

      const latest = unshownUnread[0];
      const username = latest.targetUsername || (latest.targetPostId === 'c2' ? '@nilufar' : '@azizbek');
      const known = KNOWN_AUTHORS[username];
      const post = latest.targetPostId ? allPosts.find(p => p.id === latest.targetPostId) : undefined;

      triggerOsNotification(
        {
          id: `notif-${latest.id}`,
          notificationId: latest.id,
          senderName: known?.name || post?.authorName || username.replace('@', ''),
          senderUsername: username,
          avatar: known?.avatar || post?.avatar,
          message: latest.text,
          actionLabel: latest.type === 'post' ? "O'QISH" : "KO'RISH",
          targetPostId: latest.targetPostId,
          targetUsername: latest.targetUsername,
        },
        { playSound: false }
      );
    }, 900);

    return () => {
      clearTimeout(initialTimer);
    };
  }, []);

  const toggleDarkMode = () => {
    setIsDarkMode(prev => !prev);
  };

  // Has unread notifications
  const hasUnreadNotifications = useMemo(() => {
    return notifications.some(n => !n.read);
  }, [notifications]);

  // Profile initials
  const profileInitials = useMemo(() => {
    return profile.name
      .split(' ')
      .map(n => n[0])
      .filter(Boolean)
      .join('')
      .substring(0, 2)
      .toUpperCase() || 'M';
  }, [profile.name]);

  // Word and character counts in editor
  const wordCount = useMemo(() => {
    const trimmed = editorText.trim();
    return trimmed ? trimmed.split(/\s+/).length : 0;
  }, [editorText]);

  const storyCharCount = useMemo(() => editorText.trim().length, [editorText]);

  // Unified all posts list: User posts + community posts
  const allPosts = useMemo(() => {
    const normalizedUserPosts = posts.map(p => ({
      ...p,
      authorName: profile.name || p.authorName,
      authorUsername: profile.username || p.authorUsername,
      avatar: profile.avatar || p.avatar,
      readTime: p.readTime || `${Math.max(1, Math.ceil((p.wordCount || 10) / 160))} daqiqa`,
    }));

    const combined = [...normalizedUserPosts, ...communityPosts];
    return combined.sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));
  }, [posts, communityPosts, profile]);

  const getRecommendationScore = (post: Post): number => {
    const views = viewCounts[post.id] || 0;
    const shares = shareCounts[post.id] || 0;
    const saves = saveCounts[post.id] || 0;
    const userSavedBoost = savedPostIds.includes(post.id) ? 500 : 0;
    return userSavedBoost + saves * 120 + views * 2 + shares * 5;
  };

  // Filtered and recommended posts in feed
  const displayedFeedPosts = useMemo(() => {
    let list = allPosts.filter(p => !p.authorUsername || !blockedUsers.includes(p.authorUsername));
    if (currentFeedTab === 'following') {
      list = list.filter(p => p.authorUsername && subscribedAuthors.includes(p.authorUsername));
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(
        p =>
          p.title.toLowerCase().includes(q) ||
          (p.authorName && p.authorName.toLowerCase().includes(q)) ||
          (p.authorUsername && p.authorUsername.toLowerCase().includes(q)) ||
          p.content.toLowerCase().includes(q)
      );
    } else {
      // Recommendation sorting: saved stories climb fastest, then most viewed & shared
      list.sort((a, b) => {
        const scoreDiff = getRecommendationScore(b) - getRecommendationScore(a);
        if (scoreDiff !== 0) {
          return scoreDiff;
        }
        return (b.timestamp || 0) - (a.timestamp || 0);
      });
    }

    return list;
  }, [allPosts, blockedUsers, currentFeedTab, subscribedAuthors, searchQuery, shareCounts, viewCounts, saveCounts, savedPostIds]);

  const maskEmail = (email: string) => {
    const parts = email.split('@');
    if (parts.length !== 2) return email;
    const [local, domain] = parts;
    if (local.length <= 2) return `${local[0] || ''}****@${domain}`;
    return `${local.slice(0, 2)}****${local.slice(-1)}@${domain}`;
  };

  const toggleBlockUser = (username: string) => {
    if (!username || username === profile.username) return;
    setBlockedUsers(prev => {
      if (prev.includes(username)) {
        return prev.filter(u => u !== username);
      }
      setSubscribedAuthors(subs => subs.filter(u => u !== username));
      return [...prev, username];
    });
  };

  const toggleMuteAuthor = (username: string) => {
    if (!username || username === profile.username) return;
    setMutedAuthors(prev =>
      prev.includes(username) ? prev.filter(u => u !== username) : [...prev, username]
    );
  };

  const terminateSession = (sessionId: string) => {
    setActiveSessions(prev => prev.filter(s => s.isCurrent || s.id !== sessionId));
  };

  const terminateAllOtherSessions = () => {
    setActiveSessions(prev => prev.filter(s => s.isCurrent));
  };

  const sendEmailVerificationCode = (targetEmail: string) => {
    const code = String(Math.floor(100000 + Math.random() * 900000));
    setGeneratedEmailCode(code);
    setEmailCodeDigits(['', '', '', '', '', '']);
    setEmailCodeError('');
    setLoginEmailStep('verify');

    const nowTime = new Date();
    const formattedTime = `${String(nowTime.getHours()).padStart(2, '0')}:${String(nowTime.getMinutes()).padStart(2, '0')}`;
    const notifId = `notif-email-${Date.now()}`;
    setNotifications(prev => [
      {
        id: notifId,
        text: `${targetEmail} uchun tasdiqlash kodi: ${code}`,
        time: formattedTime,
        type: 'system',
        read: false,
      },
      ...prev,
    ]);
    if (allowSoundRef.current && notifVolumeRef.current > 0) {
      playNotificationSound();
    }
    setTimeout(() => {
      emailCodeInputRefs.current[0]?.focus();
    }, 60);
  };

  const saveLoginEmail = () => {
    const trimmed = emailInput.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      setEmailError("To'g'ri elektron pochta manzilini kiriting");
      return;
    }
    setEmailError('');
    sendEmailVerificationCode(trimmed);
  };

  const verifyEmailOtpDigits = (digits: string[]) => {
    const joined = digits.join('');
    if (joined.length < 6) return;
    if (joined === generatedEmailCode) {
      setLoginEmail(emailInput.trim());
      setEmailCodeError('');
      setIsEditingEmailModal(false);
      setLoginEmailStep('enter');
    } else {
      setEmailCodeError("Tasdiqlash kodi noto'g'ri, qayta tekshiring");
    }
  };

  const handleLoginSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    const enteredUser = loginUsernameInput.trim().toLowerCase().replace(/^@/, '');
    const expectedUser = profile.username.trim().toLowerCase().replace(/^@/, '');
    if (!enteredUser || !loginPasswordInput) {
      setLoginFormError('Foydalanuvchi nomi va parolni kiriting');
      return;
    }
    if (enteredUser !== expectedUser || loginPasswordInput !== accountPassword) {
      setLoginFormError("Foydalanuvchi nomi yoki parol noto'g'ri");
      return;
    }
    setLoginFormError('');
    setLoginPasswordInput('');
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setIsProfileDrawerOpen(false);
    setViewingPost(null);
    setLoginUsernameInput('');
    setLoginPasswordInput('');
    setLoginFormError('');
    setIsAuthenticated(false);
  };

  const openChangePasswordModal = () => {
    setPasswordModalStep('send');
    setPasswordCodeDigits(['', '', '', '', '', '']);
    setPasswordCodeError('');
    setPasswordResendCooldown(0);
    setNewPasswordInput('');
    setConfirmNewPasswordInput('');
    setNewPasswordError('');
    setShowNewPassword(false);
    setIsChangePasswordModalOpen(true);
  };

  const sendPasswordGmailCode = () => {
    const code = String(Math.floor(100000 + Math.random() * 900000));
    setPasswordGeneratedCode(code);
    setPasswordCodeDigits(['', '', '', '', '', '']);
    setPasswordCodeError('');
    setPasswordResendCooldown(60);
    setPasswordModalStep('verify');

    const nowTime = new Date();
    const formattedTime = `${String(nowTime.getHours()).padStart(2, '0')}:${String(nowTime.getMinutes()).padStart(2, '0')}`;
    const notifId = `notif-pwd-${Date.now()}`;
    setNotifications(prev => [
      {
        id: notifId,
        text: `Gmail (${loginEmail}) ga parol tasdiqlash kodi yuborildi: ${code}`,
        time: formattedTime,
        type: 'system',
        read: false,
      },
      ...prev,
    ]);
    if (allowSoundRef.current && notifVolumeRef.current > 0) {
      playNotificationSound();
    }
    setTimeout(() => {
      passwordCodeInputRefs.current[0]?.focus();
    }, 60);
  };

  const verifyPasswordGmailCode = (digits: string[]) => {
    const joined = digits.join('');
    if (joined.length < 6) return;
    if (joined === passwordGeneratedCode) {
      setPasswordCodeError('');
      setNewPasswordError('');
      setPasswordModalStep('new_password');
    } else {
      setPasswordCodeError("Tasdiqlash kodi noto'g'ri, Gmail xabarini qayta tekshiring");
    }
  };

  const saveNewPassword = () => {
    if (newPasswordInput.length < 6) {
      setNewPasswordError("Yangi parol kamida 6 ta belgidan iborat bo'lishi kerak");
      return;
    }
    if (newPasswordInput !== confirmNewPasswordInput) {
      setNewPasswordError('Parollar bir-biriga mos kelmadi');
      return;
    }
    setAccountPassword(newPasswordInput);
    setIsPasswordCustomized(true);
    setNewPasswordError('');
    setIsChangePasswordModalOpen(false);
    setPasswordModalStep('send');

    const nowTime = new Date();
    const formattedTime = `${String(nowTime.getHours()).padStart(2, '0')}:${String(nowTime.getMinutes()).padStart(2, '0')}`;
    setNotifications(prev => [
      {
        id: `notif-pwd-done-${Date.now()}`,
        text: "Hisob parolingiz muvaffaqiyatli o'zgartirildi.",
        time: formattedTime,
        type: 'system',
        read: false,
      },
      ...prev,
    ]);
    if (!isAuthenticated) {
      setLoginUsernameInput(profile.username);
      setLoginPasswordInput('');
      setLoginFormError('');
    }
  };

  const openDeleteAccountModal = () => {
    setDeleteAccountModalStep('send');
    setDeleteAccountCodeDigits(['', '', '', '', '', '']);
    setDeleteAccountCodeError('');
    setDeleteAccountResendCooldown(0);
    setIsDeleteAccountModalOpen(true);
  };

  const sendDeleteAccountGmailCode = () => {
    const code = String(Math.floor(100000 + Math.random() * 900000));
    setDeleteAccountGeneratedCode(code);
    setDeleteAccountCodeDigits(['', '', '', '', '', '']);
    setDeleteAccountCodeError('');
    setDeleteAccountResendCooldown(60);
    setDeleteAccountModalStep('verify');

    const nowTime = new Date();
    const formattedTime = `${String(nowTime.getHours()).padStart(2, '0')}:${String(nowTime.getMinutes()).padStart(2, '0')}`;
    setNotifications(prev => [
      {
        id: `notif-del-acc-${Date.now()}`,
        text: `Gmail (${loginEmail}) ga hisobni o'chirish kodi yuborildi: ${code}`,
        time: formattedTime,
        type: 'system',
        read: false,
      },
      ...prev,
    ]);
    if (allowSoundRef.current && notifVolumeRef.current > 0) {
      playNotificationSound();
    }
    setTimeout(() => {
      deleteAccountCodeInputRefs.current[0]?.focus();
    }, 60);
  };

  const verifyDeleteAccountGmailCode = (digits: string[]) => {
    const joined = digits.join('');
    if (joined.length < 6) return;
    if (joined === deleteAccountGeneratedCode) {
      setDeleteAccountCodeError('');
      setDeleteAccountModalStep('confirm');
    } else {
      setDeleteAccountCodeError("Tasdiqlash kodi noto'g'ri, Gmail xabarini qayta tekshiring");
    }
  };

  const confirmDeleteAccount = () => {
    setIsDeleteAccountModalOpen(false);
    setDeleteAccountModalStep('send');
    setIsProfileDrawerOpen(false);
    setIsProfileEditMode(false);
    setIsPostsDrawerOpen(false);
    setIsNotificationsModalOpen(false);
    setIsSearchModalOpen(false);
    setViewingPost(null);
    setViewingAuthorUsername(null);

    setPosts([]);
    setProfile({ name: '', bio: '', username: '', avatar: '' });
    setProfilePhotos([]);
    setSubscribedAuthors([]);
    setBlockedUsers([]);
    setMutedAuthors([]);
    setNotifications([]);
    setShareCounts({});
    setViewCounts({});
    setSaveCounts({});
    setSavedPostIds([]);
    setIsSavedStoriesViewOpen(false);
    setPostOriginSaved(false);
    setReplyingToPost(null);
    setReplyQuoteText('');
    setIsQuotePickerOpen(false);
    setReaderSelectionPopup(null);
    setHighlightedReplyQuote(null);
    setComposerLinkPreview(null);
    setComposerPreviewSourceUrl('');
    localStorage.removeItem('post_comments');
    setProfileNameColorId('');
    setAccountPassword('123456');
    setIsPasswordCustomized(false);
    setLoginUsernameInput('');
    setLoginPasswordInput('');
    setLoginFormError('');
    setRegNameInput('');
    setRegUsernameInput('');
    setRegEmailInput('');
    setRegPasswordInput('');
    setRegFormError('');
    setIsAccountDeleted(true);
    setAccountJustDeletedNotice(true);
    setIsAuthenticated(false);
  };

  const handleRegisterNewAccount = (e?: React.FormEvent) => {
    e?.preventDefault();
    const trimmedName = regNameInput.trim();
    const cleanedUser = regUsernameInput.trim().replace(/^@+/, '').toLowerCase();
    const trimmedEmail = regEmailInput.trim();

    if (!trimmedName) {
      setRegFormError('Ismingizni kiriting');
      return;
    }
    if (!/^[a-z0-9_]{4,24}$/.test(cleanedUser)) {
      setRegFormError("Foydalanuvchi nomi 4-24 ta lotin harf, raqam yoki '_' dan iborat bo'lsin");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      setRegFormError("To'g'ri Gmail manzilini kiriting");
      return;
    }
    if (regPasswordInput.length < 6) {
      setRegFormError("Parol kamida 6 ta belgidan iborat bo'lishi kerak");
      return;
    }

    setProfile({
      name: trimmedName,
      bio: '',
      username: `@${cleanedUser}`,
      avatar: '',
    });
    setLoginEmail(trimmedEmail);
    setAccountPassword(regPasswordInput);
    setIsPasswordCustomized(true);
    setIsAccountDeleted(false);
    setAccountJustDeletedNotice(false);
    setRegFormError('');
    setRegPasswordInput('');
    setIsAuthenticated(true);
  };

  // Author details resolver
  const viewingAuthorData = useMemo(() => {
    if (!viewingAuthorUsername) return null;

    if (viewingAuthorUsername.toLowerCase() === profile.username.toLowerCase()) {
      return {
        name: profile.name,
        username: profile.username,
        bio: profile.bio,
        avatar: profile.avatar,
        postsCount: posts.length,
        followersCount: followers.length,
        isSelf: true,
      };
    }

    const known =
      KNOWN_AUTHORS[viewingAuthorUsername] ||
      Object.values(KNOWN_AUTHORS).find(a => a.username.toLowerCase() === viewingAuthorUsername.toLowerCase());
    const canonicalUsername = known?.username || viewingAuthorUsername;
    const authorPosts = allPosts.filter(
      p => p.authorUsername?.toLowerCase() === canonicalUsername.toLowerCase()
    );
    const authorName = known?.name || authorPosts[0]?.authorName || canonicalUsername.replace(/^@/, '') || 'Muallif';
    const bio = known?.bio || authorPosts[0]?.bio || 'Minimalist ijodkor.';
    const isSubbed = subscribedAuthors.some(u => u.toLowerCase() === canonicalUsername.toLowerCase());
    const baseFollowers = known?.baseFollowers || 3;
    const followersCount = baseFollowers + (isSubbed ? 1 : 0);

    return {
      name: authorName,
      username: canonicalUsername,
      bio,
      avatar: known?.avatar || authorPosts[0]?.avatar,
      postsCount: authorPosts.length,
      followersCount,
      isSelf: false,
    };
  }, [viewingAuthorUsername, profile, posts, followers, allPosts, subscribedAuthors]);

  // Toggle subscribe
  const toggleSubscribe = (e: React.MouseEvent, username: string) => {
    e.stopPropagation();
    if (username === profile.username) {
      return;
    }
    if (subscribedAuthors.includes(username)) {
      setSubscribedAuthors(prev => prev.filter(u => u !== username));
    } else {
      setSubscribedAuthors(prev => [...prev, username]);
    }
  };

  const refreshAllStoriesFeed = () => {
    setCurrentFeedTab('all');
    setCurrentBottomTab('all');
    setViewingPost(null);
    setPostOriginAuthor(null);
    setPostOriginSaved(false);
    setFeedRefreshNonce(prev => prev + 1);

    const poolItem = NEW_RECOMMENDED_POOL[Math.floor(Math.random() * NEW_RECOMMENDED_POOL.length)];
    const now = Date.now();
    const nowTimeObj = new Date();
    const monthsUz = ['yanvar', 'fevral', 'mart', 'aprel', 'may', 'iyun', 'iyul', 'avgust', 'sentabr', 'oktabr', 'noyabr', 'dekabr'];
    const formattedDate = `${nowTimeObj.getDate()}-${monthsUz[nowTimeObj.getMonth()]}, ${nowTimeObj.getFullYear()}`;

    const newPost: Post = {
      id: `rec-${now}`,
      ...poolItem,
      date: formattedDate,
      timestamp: now,
    };

    setCommunityPosts(prev => [
      newPost,
      ...prev
        .filter(
          p =>
            !p.id.startsWith('rec-') ||
            savedPostIds.includes(p.id) ||
            posts.some(u => u.replyTo?.postId === p.id) ||
            replyingToPost?.id === p.id
        )
        .slice(0, 20),
    ]);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const switchBottomTab = (tab: 'all' | 'following') => {
    if (tab === 'all') {
      refreshAllStoriesFeed();
      return;
    }
    setCurrentBottomTab(tab);
    setCurrentFeedTab(tab);
    setViewingPost(null);
    setPostOriginAuthor(null);
    setPostOriginSaved(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const cancelWriting = () => {
    setActivePostId(null);
    setReplyingToPost(null);
    setReplyQuoteText('');
    setIsQuotePickerOpen(false);
    setComposerLinkPreview(null);
    setComposerPreviewSourceUrl('');
    setEditorText('');
    setStoryLengthError('');
  };

  const publishPost = () => {
    const rawContent = editorText.trim();
    if (!rawContent) {
      return;
    }
    if (rawContent.length < MIN_STORY_CHARS) {
      const remaining = MIN_STORY_CHARS - rawContent.length;
      setStoryLengthError(`Hikoya kamida ${MIN_STORY_CHARS} ta belgidan iborat bo'lishi kerak (yana ${remaining} ta belgi kiriting)`);
      composerRef.current?.focus();
      return;
    }
    setStoryLengthError('');

    const cleanLines = rawContent.split('\n').map(l => l.trim()).filter(Boolean);
    const firstLine = cleanLines[0] || 'Sarlavha';
    const title = firstLine.length > 90 ? firstLine.slice(0, 75).trimEnd() + '...' : firstLine;
    const bodyLines = cleanLines.slice(1).join('\n');
    const body = bodyLines || rawContent;
    const excerpt = body.length > 120 ? body.substring(0, 120) + '...' : body;
    const count = rawContent.split(/\s+/).length;
    const readMinutes = Math.max(1, Math.ceil(count / 160));
    const readTime = `${readMinutes} daqiqa`;

    const activeUrl = extractFirstUrl(rawContent);
    let resolvedLinkPreview: PostLinkPreview | undefined = undefined;
    let needsAsyncPreview = false;
    if (activeUrl) {
      if (composerLinkPreview && (composerPreviewSourceUrl === activeUrl || composerLinkPreview.url === activeUrl)) {
        resolvedLinkPreview = composerLinkPreview;
        if (!composerLinkPreview.imageUrl && !composerLinkPreview.description) {
          needsAsyncPreview = true;
        }
      } else {
        needsAsyncPreview = true;
        try {
          const parsed = new URL(activeUrl);
          resolvedLinkPreview = {
            url: parsed.href,
            domain: parsed.hostname.replace(/^www\./i, ''),
            title: parsed.hostname.replace(/^www\./i, ''),
          };
        } catch {
          resolvedLinkPreview = undefined;
        }
      }
    }

    const now = new Date();
    const monthsUz = ['yanvar', 'fevral', 'mart', 'aprel', 'may', 'iyun', 'iyul', 'avgust', 'sentabr', 'oktabr', 'noyabr', 'dekabr'];
    const formattedDate = `${now.getDate()}-${monthsUz[now.getMonth()]}, ${now.getFullYear()}`;
    const targetPostId = activePostId || Date.now().toString();

    if (activePostId) {
      setPosts(prev =>
        prev.map(p =>
          p.id === activePostId
            ? {
                ...p,
                title,
                excerpt,
                content: rawContent,
                wordCount: count,
                readTime,
                authorName: profile.name,
                authorUsername: profile.username,
                authorEmail: loginEmail,
                linkPreview: resolvedLinkPreview,
              }
            : p
        )
      );
      setActivePostId(null);
    } else {
      const newPost: Post = {
        id: targetPostId,
        title,
        excerpt,
        content: rawContent,
        date: formattedDate,
        timestamp: Date.now(),
        wordCount: count,
        readTime,
        authorName: profile.name,
        authorUsername: profile.username,
        authorEmail: loginEmail,
        bio: profile.bio,
        avatar: profile.avatar,
        linkPreview: resolvedLinkPreview,
        replyTo: replyingToPost
          ? {
              postId: replyingToPost.id,
              title: replyingToPost.title,
              excerpt: replyingToPost.excerpt || replyingToPost.content.slice(0, 120),
              quoteText: replyQuoteText.trim() || undefined,
              content: replyingToPost.content,
              date: replyingToPost.date,
              readTime: replyingToPost.readTime,
              bio: replyingToPost.bio,
              avatar: replyingToPost.avatar,
              authorName: replyingToPost.authorName || profile.name,
              authorUsername: replyingToPost.authorUsername,
            }
          : undefined,
      };
      setPosts(prev => [newPost, ...prev]);
    }

    if (needsAsyncPreview && activeUrl) {
      void (async () => {
        try {
          const res = await fetch(`/api/link-preview?url=${encodeURIComponent(activeUrl)}`);
          if (!res.ok) return;
          const freshPreview = (await res.json()) as PostLinkPreview;
          if (!freshPreview || !freshPreview.url) return;
          setHydratedLinkPreviews(prev => ({ ...prev, [activeUrl]: freshPreview }));
          setPosts(prev =>
            prev.map(p => (p.id === targetPostId ? { ...p, linkPreview: freshPreview } : p))
          );
        } catch {
          // ignore network errors
        }
      })();
    }

    setEditorText('');
    setReplyingToPost(null);
    setReplyQuoteText('');
    setIsQuotePickerOpen(false);
    setComposerLinkPreview(null);
    setComposerPreviewSourceUrl('');
    setViewingPost(null);
    setPostOriginAuthor(null);
    setCurrentBottomTab('all');
    setCurrentFeedTab('all');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const editPost = (id: string) => {
    const post = posts.find(p => p.id === id);
    if (!post) return;
    const effectivePreview = getPostLinkPreview(post);
    setActivePostId(post.id);
    setReplyingToPost(null);
    setReplyQuoteText('');
    setIsQuotePickerOpen(false);
    setComposerLinkPreview(effectivePreview || null);
    setComposerPreviewSourceUrl(effectivePreview?.url || '');
    setEditorText(post.content);
    setIsPostsDrawerOpen(false);
    setIsProfileDrawerOpen(false);
    setIsAuthorStoriesViewOpen(false);
    setIsAuthorQrOpen(false);
    setViewingAuthorUsername(null);
    setStoriesReturnToOwnProfile(false);
    setPostOriginAuthor(null);
    setPostOriginSaved(false);
    setViewingPost(null);
    setTimeout(() => composerRef.current?.focus(), 50);
  };

  const confirmDeletePost = () => {
    if (!postToDelete) return;
    setPosts(prev => prev.filter(p => p.id !== postToDelete));
    if (viewingPost && viewingPost.id === postToDelete) {
      closeReader();
    }
    setPostToDelete(null);
  };

  const resolveMentionUsername = (mention: string): string => {
    const normalized = mention.startsWith('@') ? mention : `@${mention}`;
    const lower = normalized.toLowerCase();
    if (profile.username.toLowerCase() === lower) return profile.username;
    const knownKey = Object.keys(KNOWN_AUTHORS).find(k => k.toLowerCase() === lower);
    if (knownKey) return knownKey;
    const postMatch = allPosts.find(p => p.authorUsername?.toLowerCase() === lower)?.authorUsername;
    if (postMatch) return postMatch;
    const followerMatch = followers.find(f => f.username.toLowerCase() === lower)?.username;
    if (followerMatch) return followerMatch;
    return normalized;
  };

  const openAuthorProfileByUsername = (username: string) => {
    const canonical = resolveMentionUsername(username);
    setIsPostsDrawerOpen(false);
    setIsAuthorStoriesViewOpen(false);
    setIsSavedStoriesViewOpen(false);
    setStoriesReturnToOwnProfile(false);
    setPostOriginAuthor(null);
    setPostOriginSaved(false);
    setViewingAuthorUsername(canonical);
  };

  const toggleSavePost = (post: Post) => {
    const alreadySaved = savedPostIds.includes(post.id);
    if (alreadySaved) {
      setSavedPostIds(prev => prev.filter(id => id !== post.id));
      setSaveCounts(prev => ({
        ...prev,
        [post.id]: Math.max(0, (prev[post.id] || 1) - 1),
      }));
    } else {
      setSavedPostIds(prev => [post.id, ...prev.filter(id => id !== post.id)]);
      setSaveCounts(prev => ({
        ...prev,
        [post.id]: (prev[post.id] || 0) + 1,
      }));
    }
  };

  const openCommunityPost = (
    post: Post,
    originAuthor: { username: string; storiesView: boolean; fromOwnProfile?: boolean } | null = null,
    fromSavedList = false,
    highlightQuote: { text: string; color: string } | null = null
  ) => {
    setViewCounts(prev => ({
      ...prev,
      [post.id]: (prev[post.id] || 0) + 1,
    }));
    setPostOriginAuthor(originAuthor);
    setPostOriginSaved(fromSavedList);
    setReaderSelectionPopup(null);
    setCopiedAuthorEmail(false);
    setHighlightedReplyQuote(highlightQuote ? { postId: post.id, ...highlightQuote } : null);
    setViewingPost(post);
    setActivePostId(null);
    setEditorText('');
    if (!highlightQuote) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const closeReader = () => {
    setViewingPost(null);
    setReaderSelectionPopup(null);
    setCopiedAuthorEmail(false);
    setHighlightedReplyQuote(null);
    setEditorText('');
    if (postOriginSaved) {
      setPostOriginSaved(false);
      setIsSavedStoriesViewOpen(true);
      return;
    }
    if (postOriginAuthor) {
      setStoriesReturnToOwnProfile(Boolean(postOriginAuthor.fromOwnProfile));
      setViewingAuthorUsername(postOriginAuthor.username);
      setIsAuthorStoriesViewOpen(postOriginAuthor.storiesView);
      setPostOriginAuthor(null);
    }
  };

  const startReplyToPost = (post: Post, explicitQuote?: string) => {
    let selectedQuote = explicitQuote?.trim() || '';
    if (!selectedQuote && readerContentRef.current) {
      const sel = window.getSelection();
      const raw = sel ? sel.toString().trim() : '';
      if (raw && sel && sel.rangeCount > 0) {
        const range = sel.getRangeAt(0);
        if (readerContentRef.current.contains(range.commonAncestorContainer)) {
          selectedQuote = raw;
        }
      }
    }
    setActivePostId(null);
    setReplyingToPost(post);
    setReplyQuoteText(selectedQuote);
    setReaderSelectionPopup(null);
    setTimeout(() => composerRef.current?.focus(), 50);
  };

  const openQuotePicker = () => {
    if (!replyingToPost) return;
    setQuoteSelectionDraft(replyQuoteText || replyingToPost.title);
    setIsQuotePickerOpen(true);
  };

  const handleReaderTextSelection = () => {
    const sel = window.getSelection();
    const raw = sel ? sel.toString().trim() : '';
    if (!raw || !sel || sel.rangeCount === 0 || !readerContentRef.current) {
      setReaderSelectionPopup(null);
      return;
    }
    const range = sel.getRangeAt(0);
    if (!readerContentRef.current.contains(range.commonAncestorContainer)) {
      setReaderSelectionPopup(null);
      return;
    }
    const rect = range.getBoundingClientRect();
    const top = Math.max(64, rect.top - 42);
    const left = Math.min(window.innerWidth - 90, Math.max(90, rect.left + rect.width / 2));
    setReaderSelectionPopup({ text: raw, top, left });
  };

  const handleQuotePickerSelection = () => {
    const sel = window.getSelection();
    const raw = sel ? sel.toString().trim() : '';
    if (!raw || !sel || sel.rangeCount === 0 || !quotePickerContentRef.current) return;
    const range = sel.getRangeAt(0);
    if (quotePickerContentRef.current.contains(range.commonAncestorContainer)) {
      setQuoteSelectionDraft(raw);
    }
  };

  const openReplyTarget = (replyRef: PostReplyRef) => {
    setIsAuthorStoriesViewOpen(false);
    setIsSavedStoriesViewOpen(false);
    setIsAuthorQrOpen(false);
    setViewingAuthorUsername(null);
    const targetText = (replyRef.quoteText || replyRef.title || replyRef.excerpt || '').trim();
    const targetColor = getAuthorReplyColor(replyRef.authorUsername);
    const highlightPayload = targetText ? { text: targetText, color: targetColor } : null;

    const existing = allPosts.find(p => p.id === replyRef.postId);
    if (existing) {
      openCommunityPost(existing, null, false, highlightPayload);
      return;
    }
    const fallbackPost: Post = {
      id: replyRef.postId,
      title: replyRef.title,
      excerpt: replyRef.excerpt,
      content: replyRef.content || replyRef.excerpt || replyRef.title,
      date: replyRef.date || '',
      readTime: replyRef.readTime,
      bio: replyRef.bio,
      avatar: replyRef.avatar,
      authorName: replyRef.authorName,
      authorUsername: replyRef.authorUsername,
    };
    openCommunityPost(fallbackPost, null, false, highlightPayload);
  };

  const buildEmailHref = (email: string, subject?: string): { href: string; isExternal: boolean } => {
    const lower = email.toLowerCase();
    if (lower.endsWith('@gmail.com') || lower.endsWith('@googlemail.com')) {
      const suParam = subject ? `&su=${encodeURIComponent(subject)}` : '';
      return {
        href: `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(email)}${suParam}`,
        isExternal: true,
      };
    }
    const subjectParam = subject ? `?subject=${encodeURIComponent(subject)}` : '';
    return {
      href: `mailto:${email}${subjectParam}`,
      isExternal: false,
    };
  };

  const renderTextWithLinks = (text: string) => {
    if (!text) return text;
    const tokenRegex =
      /((?:https?:\/\/|www\.)[^\s<>"'`]+)|([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})|(@[a-zA-Z0-9_]{2,32})/gi;
    const nodes: React.ReactNode[] = [];
    let lastIndex = 0;
    let match: RegExpExecArray | null;
    let keyIdx = 0;

    while ((match = tokenRegex.exec(text)) !== null) {
      const fullMatch = match[0];
      const startIndex = match.index;

      if (match[3] && startIndex > 0 && /[a-zA-Z0-9._%+-]/.test(text[startIndex - 1])) {
        continue;
      }

      if (startIndex > lastIndex) {
        nodes.push(<React.Fragment key={`t-${keyIdx++}`}>{text.slice(lastIndex, startIndex)}</React.Fragment>);
      }

      if (match[1]) {
        const trailingMatch = fullMatch.match(/([.,;:!?)]+)$/);
        const cleanUrl = trailingMatch ? fullMatch.slice(0, -trailingMatch[1].length) : fullMatch;
        const trailing = trailingMatch ? trailingMatch[1] : '';
        const href = /^www\./i.test(cleanUrl) ? `https://${cleanUrl}` : cleanUrl;
        nodes.push(
          <React.Fragment key={`u-${keyIdx++}`}>
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              onClick={e => e.stopPropagation()}
              className="text-[#3390ec] hover:underline [overflow-wrap:anywhere]"
            >
              {cleanUrl}
            </a>
            {trailing}
          </React.Fragment>
        );
      } else if (match[2]) {
        const trailingMatch = fullMatch.match(/([.,;:!?)]+)$/);
        const cleanEmail = trailingMatch ? fullMatch.slice(0, -trailingMatch[1].length) : fullMatch;
        const trailing = trailingMatch ? trailingMatch[1] : '';
        const { href, isExternal } = buildEmailHref(cleanEmail);
        nodes.push(
          <React.Fragment key={`e-${keyIdx++}`}>
            <a
              href={href}
              target={isExternal ? '_blank' : undefined}
              rel={isExternal ? 'noopener noreferrer' : undefined}
              onClick={e => e.stopPropagation()}
              className="text-[#3390ec] hover:underline [overflow-wrap:anywhere]"
              title="Gmail orqali xabar yozish"
            >
              {cleanEmail}
            </a>
            {trailing}
          </React.Fragment>
        );
      } else if (match[3]) {
        const canonical = resolveMentionUsername(fullMatch);
        const nameStyle = getAuthorNameStyle(canonical);
        const colorStyle = nameStyle?.color ? { color: nameStyle.color } : { color: '#3390ec' };
        nodes.push(
          <span
            key={`m-${keyIdx++}`}
            role="link"
            tabIndex={0}
            style={colorStyle}
            onClick={e => {
              e.preventDefault();
              e.stopPropagation();
              openAuthorProfileByUsername(canonical);
            }}
            onKeyDown={e => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                e.stopPropagation();
                openAuthorProfileByUsername(canonical);
              }
            }}
            className="font-medium hover:underline cursor-pointer"
            title={`${canonical} profilini ochish`}
          >
            {fullMatch}
          </span>
        );
      }

      lastIndex = startIndex + fullMatch.length;
    }

    if (nodes.length === 0) return text;
    if (lastIndex < text.length) {
      nodes.push(<React.Fragment key={`t-${keyIdx++}`}>{text.slice(lastIndex)}</React.Fragment>);
    }
    return nodes;
  };

  const renderHighlightedStoryContent = (post: Post) => {
    const content = post.content;
    if (!highlightedReplyQuote || highlightedReplyQuote.postId !== post.id || !highlightedReplyQuote.text) {
      return renderTextWithLinks(content);
    }

    const query = highlightedReplyQuote.text.trim();
    if (!query) return renderTextWithLinks(content);

    let matchStart = content.indexOf(query);
    let matchEnd = matchStart !== -1 ? matchStart + query.length : -1;

    if (matchStart === -1) {
      const normalizedQuery = query.replace(/\.{3}$/, '').trim();
      if (normalizedQuery.length >= 2) {
        const escaped = normalizedQuery.replace(/[.*+?^${}()|[\]\\]/g, '\\$&').replace(/\s+/g, '\\s+');
        try {
          const regex = new RegExp(escaped);
          const match = regex.exec(content);
          if (match) {
            matchStart = match.index;
            matchEnd = match.index + match[0].length;
          }
        } catch {
          // ignore regex fallback failure
        }
      }
    }

    if (matchStart === -1 || matchEnd <= matchStart) {
      return renderTextWithLinks(content);
    }

    const hlColor = highlightedReplyQuote.color || '#3390ec';
    return (
      <>
        {renderTextWithLinks(content.slice(0, matchStart))}
        <mark
          ref={highlightedQuoteRef}
          style={{
            backgroundColor: hexToRgba(hlColor, isDarkMode ? 0.34 : 0.22),
            boxShadow: `inset 0 -2px 0 ${hexToRgba(hlColor, isDarkMode ? 0.75 : 0.55)}`,
            color: 'inherit',
            boxDecorationBreak: 'clone',
            WebkitBoxDecorationBreak: 'clone',
          }}
          className="rounded px-1 py-0.5 transition-colors"
        >
          {renderTextWithLinks(content.slice(matchStart, matchEnd))}
        </mark>
        {renderTextWithLinks(content.slice(matchEnd))}
      </>
    );
  };

  const renderLinkPreviewCard = (
    preview: PostLinkPreview,
    compact = false,
    post?: Post,
    onImageOpenPost?: () => void
  ) => {
    const youtubeVideoId = extractYoutubeVideoId(preview.url);
    const showImage = Boolean(preview.imageUrl && !failedPreviewImages[preview.imageUrl]);
    const canZoomHere = !compact;
    return (
      <div
        onClick={e => e.stopPropagation()}
        className="block rounded-xl overflow-hidden border border-neutral-200/80 dark:border-neutral-800 bg-neutral-100/70 dark:bg-neutral-900/90 transition-colors min-w-0"
      >
        {showImage && (
          <button
            type="button"
            onClick={e => {
              e.preventDefault();
              e.stopPropagation();
              if (canZoomHere) {
                setLinkImageLightbox({
                  imageUrl: preview.imageUrl!,
                  title: preview.title,
                  description: preview.description,
                  domain: preview.domain,
                  linkUrl: preview.url,
                  embeddable: preview.embeddable,
                  post,
                });
              } else if (onImageOpenPost) {
                onImageOpenPost();
              } else if (post) {
                openCommunityPost(post);
              }
            }}
            className={`w-full overflow-hidden bg-neutral-200/70 dark:bg-neutral-800 block group/previewimg relative focus:outline-none ${
              canZoomHere ? (youtubeVideoId ? 'cursor-pointer' : 'cursor-zoom-in') : 'cursor-pointer'
            } ${compact ? 'max-h-52 sm:max-h-60' : 'max-h-72 sm:max-h-[380px]'}`}
            title={
              canZoomHere
                ? youtubeVideoId
                  ? "Videoni shu yerda ko'rish"
                  : "Rasmni kattalashtirib ko'rish"
                : "To'liq sahifada o'qish"
            }
          >
            <img
              src={preview.imageUrl}
              alt={preview.title || preview.domain}
              loading="lazy"
              referrerPolicy="no-referrer"
              onError={() =>
                setFailedPreviewImages(prev => ({
                  ...prev,
                  [preview.imageUrl!]: true,
                }))
              }
              className="w-full h-full max-h-72 sm:max-h-[380px] object-cover block group-hover/previewimg:brightness-95 transition-all"
            />
            {youtubeVideoId && (
              <span className="pointer-events-none absolute inset-0 flex items-center justify-center bg-black/15 group-hover/previewimg:bg-black/25 transition-colors">
                <span className="w-12 h-12 rounded-full bg-black/70 backdrop-blur-xs flex items-center justify-center shadow-lg">
                  <Play className="w-5 h-5 text-white fill-white ml-0.5" />
                </span>
              </span>
            )}
          </button>
        )}
        {canZoomHere ? (
          <a
            href={preview.url}
            target="_blank"
            rel="noopener noreferrer"
            onClick={e => e.stopPropagation()}
            className="block px-3 py-2 space-y-0.5 min-w-0 hover:bg-neutral-200/50 dark:hover:bg-neutral-800/60 transition-colors no-underline"
          >
            {preview.title && (
              <p className="text-[13px] font-medium text-neutral-900 dark:text-neutral-100 leading-snug line-clamp-2 [overflow-wrap:anywhere]">
                {preview.title}
              </p>
            )}
            {preview.description && (
              <p className="text-[12px] text-neutral-500 dark:text-neutral-400 leading-snug line-clamp-2 [overflow-wrap:anywhere]">
                {preview.description}
              </p>
            )}
            <div className="flex items-center space-x-1 text-[11px] text-neutral-400 dark:text-neutral-500 pt-0.5 truncate">
              <ExternalLink className="w-3 h-3 shrink-0" />
              <span className="truncate">{preview.domain}</span>
            </div>
          </a>
        ) : (
          <button
            type="button"
            onClick={e => {
              e.preventDefault();
              e.stopPropagation();
              if (onImageOpenPost) {
                onImageOpenPost();
              } else if (post) {
                openCommunityPost(post);
              }
            }}
            className="block w-full text-left px-3 py-2 space-y-0.5 min-w-0 hover:bg-neutral-200/50 dark:hover:bg-neutral-800/60 transition-colors cursor-pointer"
            title="To'liq sahifada o'qish"
          >
            {preview.title && (
              <p className="text-[13px] font-medium text-neutral-900 dark:text-neutral-100 leading-snug line-clamp-2 [overflow-wrap:anywhere]">
                {preview.title}
              </p>
            )}
            {preview.description && (
              <p className="text-[12px] text-neutral-500 dark:text-neutral-400 leading-snug line-clamp-2 [overflow-wrap:anywhere]">
                {preview.description}
              </p>
            )}
            <div className="flex items-center space-x-1 text-[11px] text-neutral-400 dark:text-neutral-500 pt-0.5 truncate">
              <ExternalLink className="w-3 h-3 shrink-0" />
              <span className="truncate">{preview.domain}</span>
            </div>
          </button>
        )}
      </div>
    );
  };

  const renderReplyQuote = (replyRef: PostReplyRef) => {
    const replyColor = getAuthorReplyColor(replyRef.authorUsername);
    const quoteSnippet = (replyRef.quoteText || replyRef.title || replyRef.excerpt || '').trim();
    const canNavigate = Boolean(viewingPost);
    return (
      <div
        role={canNavigate ? 'button' : undefined}
        tabIndex={canNavigate ? 0 : undefined}
        onClick={canNavigate ? (e) => {
          e.stopPropagation();
          openReplyTarget(replyRef);
        } : undefined}
        onKeyDown={canNavigate ? (e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            e.stopPropagation();
            openReplyTarget(replyRef);
          }
        } : undefined}
        style={{
          borderLeftColor: replyColor,
          backgroundColor: hexToRgba(replyColor, isDarkMode ? 0.18 : 0.11),
        }}
        className={`border-l-[3px] rounded-md px-2.5 py-1.5 select-none min-w-0 ${
          canNavigate ? 'cursor-pointer transition-all hover:brightness-95 dark:hover:brightness-110' : ''
        }`}
        title={canNavigate ? `${replyRef.authorName} hikoyasiga o'tish` : undefined}
      >
        <div className="flex items-center space-x-1 text-[12px] font-semibold leading-tight truncate" style={{ color: replyColor }}>
          <Reply className="w-3 h-3 shrink-0" />
          <span className="truncate">{replyRef.authorName}</span>
        </div>
        {quoteSnippet && (
          <p className="text-[12.5px] text-neutral-700 dark:text-neutral-200 line-clamp-3 leading-snug mt-0.5 whitespace-pre-line [overflow-wrap:anywhere]">
            {quoteSnippet}
          </p>
        )}
      </div>
    );
  };

  const handleComposerSubmit = () => {
    publishPost();
  };

  const handleNotificationClick = (n: NotificationItem) => {
    setNotifications(prev => prev.map(item => (item.id === n.id ? { ...item, read: true } : item)));
    setIsNotificationsModalOpen(false);

    if (n.type === 'follow' || n.type === 'follower') {
      if (n.targetUsername) {
        openAuthorProfileByUsername(n.targetUsername);
      } else {
        switchBottomTab('following');
      }
    } else if (n.type === 'post' && n.targetPostId) {
      const post = allPosts.find(p => p.id === n.targetPostId);
      if (post) {
        openCommunityPost(post);
      }
    }
  };

  const openNotifications = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    setIsNotificationsModalOpen(true);
  };

  const clearAllNotifications = () => {
    setNotifications([]);
  };

  const deleteNotification = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const openEditNameModal = () => {
    if (profile.firstName !== undefined) {
      setEditFirstName(profile.firstName);
      setEditLastName(profile.lastName || '');
    } else {
      const parts = profile.name.trim().split(/\s+/);
      setEditFirstName(parts[0] || '');
      setEditLastName(parts.slice(1).join(' '));
    }
    setNameError('');
    setIsEditingNameModal(true);
  };

  const saveName = () => {
    const first = editFirstName.trim();
    const last = editLastName.trim();
    if (!first) {
      setNameError('Iltimos, ism kiriting');
      return;
    }
    setNameError('');
    const fullName = [first, last].filter(Boolean).join(' ');
    setProfile(prev => ({
      ...prev,
      name: fullName,
      firstName: first,
      lastName: last,
    }));
    setPosts(prev =>
      prev.map(p => ({
        ...p,
        authorName: fullName,
      }))
    );
    setIsEditingNameModal(false);
  };

  const handleBioChange = (value: string) => {
    const trimmed = value.slice(0, 70);
    setProfile(prev => ({ ...prev, bio: trimmed }));
    setPosts(prev =>
      prev.map(p => ({
        ...p,
        bio: trimmed,
      }))
    );
  };

  const saveUsername = () => {
    const raw = newUsernameInput.trim().replace('@', '');
    if (raw.length < 5) {
      setUsernameError("Kamida 5 ta belgidan iborat bo'lishi kerak");
      return;
    }
    setUsernameError('');
    const formatted = `@${raw}`;
    setProfile(prev => ({ ...prev, username: formatted }));
    setPosts(prev =>
      prev.map(p => ({
        ...p,
        authorUsername: formatted,
      }))
    );
    setIsEditingUsernameModal(false);
  };

  // Measure crop stage dynamically when open
  useEffect(() => {
    if (!cropperImageSrc) return;
    const measure = () => {
      if (cropStageRef.current) {
        const rect = cropStageRef.current.getBoundingClientRect();
        if (rect.width > 0 && rect.height > 0) {
          setCropStageSize({ width: rect.width, height: rect.height });
        }
      }
    };
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, [cropperImageSrc]);

  const cropGeometry = useMemo(() => {
    if (!cropNaturalSize.width || !cropNaturalSize.height) {
      return { rotW: 1, rotH: 1, fitScale: 1, dispW: 200, dispH: 200 };
    }
    const isSwapped = cropRotation % 180 !== 0;
    const rotW = isSwapped ? cropNaturalSize.height : cropNaturalSize.width;
    const rotH = isSwapped ? cropNaturalSize.width : cropNaturalSize.height;
    const availW = Math.max(160, cropStageSize.width - 24);
    const availH = Math.max(160, cropStageSize.height - 24);
    const fitScale = Math.min(availW / rotW, availH / rotH);
    return {
      rotW,
      rotH,
      fitScale,
      dispW: rotW * fitScale,
      dispH: rotH * fitScale,
    };
  }, [cropNaturalSize, cropRotation, cropStageSize]);

  // Keep crop box centered/clamped inside image bounds when stage or rotation changes
  const initOrClampCropBox = (dispW: number, dispH: number, reset: boolean) => {
    const minSide = Math.min(dispW, dispH);
    const minCrop = Math.min(72, minSide);
    if (reset) {
      const size = Math.max(minCrop, minSide * 0.85);
      setCropBox({
        x: (dispW - size) / 2,
        y: (dispH - size) / 2,
        size,
      });
    } else {
      setCropBox(prev => {
        const size = Math.min(minSide, Math.max(minCrop, prev.size));
        const x = Math.min(Math.max(0, prev.x), Math.max(0, dispW - size));
        const y = Math.min(Math.max(0, prev.y), Math.max(0, dispH - size));
        return { x, y, size };
      });
    }
  };

  useEffect(() => {
    if (!cropperImageSrc || !cropNaturalSize.width) return;
    initOrClampCropBox(cropGeometry.dispW, cropGeometry.dispH, false);
  }, [cropGeometry.dispW, cropGeometry.dispH, cropperImageSrc, cropNaturalSize.width]);

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = event => {
      const result = event.target?.result as string;
      const img = new Image();
      img.onload = () => {
        setCropNaturalSize({ width: img.naturalWidth, height: img.naturalHeight });
        setCropRotation(0);
        setCropFlipH(false);
        setCropperImageSrc(result);
        // Estimate initial stage size before ref measures
        const estW = Math.max(200, window.innerWidth - 56);
        const estH = Math.max(240, window.innerHeight - 190);
        const fit = Math.min(estW / img.naturalWidth, estH / img.naturalHeight);
        const dW = img.naturalWidth * fit;
        const dH = img.naturalHeight * fit;
        const size = Math.min(dW, dH) * 0.85;
        setCropBox({ x: (dW - size) / 2, y: (dH - size) / 2, size });
      };
      img.src = result;
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const startCropDrag = (mode: 'move' | 'tl' | 'tr' | 'bl' | 'br', e: React.PointerEvent<HTMLElement>) => {
    e.stopPropagation();
    e.currentTarget.setPointerCapture(e.pointerId);
    cropDragRef.current = {
      mode,
      startX: e.clientX,
      startY: e.clientY,
      origBox: { ...cropBox },
    };
  };

  const moveCropDrag = (e: React.PointerEvent<HTMLElement>) => {
    const { mode, startX, startY, origBox } = cropDragRef.current;
    if (!mode) return;
    const dx = e.clientX - startX;
    const dy = e.clientY - startY;
    const { dispW, dispH } = cropGeometry;
    const minCrop = Math.min(64, Math.min(dispW, dispH));

    if (mode === 'move') {
      const nextX = Math.min(Math.max(0, origBox.x + dx), Math.max(0, dispW - origBox.size));
      const nextY = Math.min(Math.max(0, origBox.y + dy), Math.max(0, dispH - origBox.size));
      setCropBox({ ...origBox, x: nextX, y: nextY });
      return;
    }

    if (mode === 'br') {
      const ax = origBox.x;
      const ay = origBox.y;
      const maxS = Math.min(dispW - ax, dispH - ay);
      const rawS = origBox.size + (Math.abs(dx) > Math.abs(dy) ? dx : dy);
      const size = Math.min(maxS, Math.max(minCrop, rawS));
      setCropBox({ x: ax, y: ay, size });
    } else if (mode === 'tl') {
      const ax = origBox.x + origBox.size;
      const ay = origBox.y + origBox.size;
      const maxS = Math.min(ax, ay);
      const rawS = origBox.size - (Math.abs(dx) > Math.abs(dy) ? dx : dy);
      const size = Math.min(maxS, Math.max(minCrop, rawS));
      setCropBox({ x: ax - size, y: ay - size, size });
    } else if (mode === 'tr') {
      const ax = origBox.x;
      const ay = origBox.y + origBox.size;
      const maxS = Math.min(dispW - ax, ay);
      const rawS = origBox.size + (Math.abs(dx) > Math.abs(dy) ? dx : -dy);
      const size = Math.min(maxS, Math.max(minCrop, rawS));
      setCropBox({ x: ax, y: ay - size, size });
    } else if (mode === 'bl') {
      const ax = origBox.x + origBox.size;
      const ay = origBox.y;
      const maxS = Math.min(ax, dispH - ay);
      const rawS = origBox.size + (Math.abs(dx) > Math.abs(dy) ? -dx : dy);
      const size = Math.min(maxS, Math.max(minCrop, rawS));
      setCropBox({ x: ax - size, y: ay, size });
    }
  };

  const endCropDrag = (e: React.PointerEvent<HTMLElement>) => {
    if (cropDragRef.current.mode) {
      cropDragRef.current.mode = null;
      try {
        e.currentTarget.releasePointerCapture(e.pointerId);
      } catch {
        // ignore if already released
      }
    }
  };

  const handleCropRotate = () => {
    const nextRot = (cropRotation + 90) % 360;
    setCropRotation(nextRot);
    const isSwapped = nextRot % 180 !== 0;
    const rotW = isSwapped ? cropNaturalSize.height : cropNaturalSize.width;
    const rotH = isSwapped ? cropNaturalSize.width : cropNaturalSize.height;
    const availW = Math.max(160, cropStageSize.width - 24);
    const availH = Math.max(160, cropStageSize.height - 24);
    const fit = Math.min(availW / rotW, availH / rotH);
    initOrClampCropBox(rotW * fit, rotH * fit, true);
  };

  const saveCroppedAvatar = () => {
    if (!cropperImageSrc) return;
    const img = new Image();
    img.onload = () => {
      const { rotW, rotH, fitScale } = cropGeometry;
      const srcCanvas = document.createElement('canvas');
      srcCanvas.width = rotW;
      srcCanvas.height = rotH;
      const srcCtx = srcCanvas.getContext('2d');
      if (!srcCtx) return;

      srcCtx.save();
      srcCtx.translate(rotW / 2, rotH / 2);
      srcCtx.rotate((cropRotation * Math.PI) / 180);
      srcCtx.scale(cropFlipH ? -1 : 1, 1);
      srcCtx.drawImage(img, -img.naturalWidth / 2, -img.naturalHeight / 2);
      srcCtx.restore();

      const OUT_SIZE = 400;
      const outCanvas = document.createElement('canvas');
      outCanvas.width = OUT_SIZE;
      outCanvas.height = OUT_SIZE;
      const outCtx = outCanvas.getContext('2d');
      if (!outCtx) return;

      const sx = cropBox.x / fitScale;
      const sy = cropBox.y / fitScale;
      const sSize = cropBox.size / fitScale;
      outCtx.drawImage(srcCanvas, sx, sy, sSize, sSize, 0, 0, OUT_SIZE, OUT_SIZE);

      const croppedDataUrl = outCanvas.toDataURL('image/jpeg', 0.9);
      setProfile(prev => ({ ...prev, avatar: croppedDataUrl }));
      setProfilePhotos(prev => [croppedDataUrl, ...prev.filter(p => p !== croppedDataUrl)].slice(0, 12));
      setPosts(prev => prev.map(p => ({ ...p, avatar: croppedDataUrl })));
      setCropperImageSrc(null);
    };
    img.src = cropperImageSrc;
  };

  const copyPostShareLink = async (post: Post) => {
    setShareCounts(prev => ({
      ...prev,
      [post.id]: (prev[post.id] || 0) + 1,
    }));

    const shareData = {
      title: post.title,
      text: `${post.title} — ${post.authorName || 'Muallif'}\n\n${post.excerpt}`,
      url: `${window.location.origin}/#${post.id}`,
    };

    if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
      try {
        await navigator.share(shareData);
        return;
      } catch (err) {
        if ((err as Error).name !== 'AbortError') {
          // fallback
        }
      }
    }

    if (navigator.clipboard) {
      try {
        await navigator.clipboard.writeText(`${window.location.origin}/#${post.id}`);
      } catch {
        // ignore clipboard error
      }
    }
  };

  return (
    <>
      {!isAuthenticated ? (
        <div className="min-h-screen bg-white dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 font-sans antialiased flex flex-col justify-between px-4 py-6 transition-colors duration-300">
          <div className="max-w-md w-full mx-auto flex justify-end">
            <button
              type="button"
              onClick={toggleDarkMode}
              className="p-2 text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100 transition-colors rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-900 cursor-pointer"
              title={isDarkMode ? "Kunduzgi rejim" : "Tungi rejim"}
            >
              {isDarkMode ? <Sun className="w-4 h-4 text-amber-500" /> : <Moon className="w-4 h-4 text-neutral-700" />}
            </button>
          </div>

          <div className="max-w-sm w-full mx-auto my-auto py-8">
            <div className="text-center space-y-2 mb-8">
              <div className="w-12 h-12 rounded-2xl bg-neutral-100 dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 mx-auto flex items-center justify-center mb-4">
                {isAccountDeleted ? (
                  <User className="w-5 h-5 text-neutral-800 dark:text-neutral-200" />
                ) : (
                  <Lock className="w-5 h-5 text-neutral-800 dark:text-neutral-200" />
                )}
              </div>
              <h1 className="font-serif text-3xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100">
                Minimalist
              </h1>
              <p className="text-xs sm:text-[13px] text-neutral-500 dark:text-neutral-400">
                {isAccountDeleted
                  ? "Hisobingiz o'chirilgan. Davom etish uchun yangi hisob yarating"
                  : 'Saytga kirish uchun foydalanuvchi nomi va parolingizni kiriting'}
              </p>
            </div>

            {accountJustDeletedNotice && isAccountDeleted && (
              <div className="mb-5 px-3.5 py-2.5 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200/80 dark:border-red-900/50 text-xs text-red-600 dark:text-red-400 text-center">
                Oldingi hisobingiz va barcha ma&apos;lumotlaringiz butunlay o&apos;chirildi.
              </div>
            )}

            {isAccountDeleted ? (
              <form onSubmit={handleRegisterNewAccount} className="space-y-3.5">
                <div>
                  <label className="block text-xs font-medium text-neutral-600 dark:text-neutral-400 mb-1.5">
                    Ismingiz
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      autoFocus
                      value={regNameInput}
                      onChange={e => {
                        setRegNameInput(e.target.value);
                        if (regFormError) setRegFormError('');
                      }}
                      placeholder="Masalan: Muhammad"
                      className="w-full pl-10 pr-3.5 py-2.5 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 focus:border-neutral-900 dark:focus:border-neutral-300 rounded-xl text-sm text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 focus:outline-none transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-neutral-600 dark:text-neutral-400 mb-1.5">
                    Foydalanuvchi nomi
                  </label>
                  <div className="relative">
                    <AtSign className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={regUsernameInput}
                      onChange={e => {
                        setRegUsernameInput(e.target.value);
                        if (regFormError) setRegFormError('');
                      }}
                      placeholder="username"
                      className="w-full pl-10 pr-3.5 py-2.5 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 focus:border-neutral-900 dark:focus:border-neutral-300 rounded-xl text-sm text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 focus:outline-none transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-neutral-600 dark:text-neutral-400 mb-1.5">
                    Gmail manzili
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      value={regEmailInput}
                      onChange={e => {
                        setRegEmailInput(e.target.value);
                        if (regFormError) setRegFormError('');
                      }}
                      placeholder="example@gmail.com"
                      className="w-full pl-10 pr-3.5 py-2.5 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 focus:border-neutral-900 dark:focus:border-neutral-300 rounded-xl text-sm text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 focus:outline-none transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-neutral-600 dark:text-neutral-400 mb-1.5">
                    Parol
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type={regShowPassword ? 'text' : 'password'}
                      value={regPasswordInput}
                      onChange={e => {
                        setRegPasswordInput(e.target.value);
                        if (regFormError) setRegFormError('');
                      }}
                      placeholder="Kamida 6 ta belgi"
                      className="w-full pl-10 pr-10 py-2.5 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 focus:border-neutral-900 dark:focus:border-neutral-300 rounded-xl text-sm text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 focus:outline-none transition-colors"
                    />
                    <button
                      type="button"
                      onClick={() => setRegShowPassword(prev => !prev)}
                      className="p-1 text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 absolute right-2.5 top-1/2 -translate-y-1/2 cursor-pointer"
                      aria-label={regShowPassword ? 'Parolni yashirish' : "Parolni ko'rsatish"}
                    >
                      {regShowPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {regFormError && <p className="text-xs text-red-500 font-medium">{regFormError}</p>}

                <button
                  type="submit"
                  className="w-full py-2.5 bg-neutral-900 hover:bg-neutral-800 dark:bg-neutral-100 dark:hover:bg-neutral-200 text-white dark:text-neutral-900 text-sm font-medium rounded-xl transition-colors cursor-pointer"
                >
                  Yangi hisob yaratish
                </button>
              </form>
            ) : (
              <>
                <form onSubmit={handleLoginSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-medium text-neutral-600 dark:text-neutral-400 mb-1.5">
                      Foydalanuvchi nomi
                    </label>
                    <div className="relative">
                      <AtSign className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        autoFocus
                        autoComplete="username"
                        value={loginUsernameInput}
                        onChange={e => {
                          setLoginUsernameInput(e.target.value);
                          if (loginFormError) setLoginFormError('');
                        }}
                        placeholder={profile.username}
                        className="w-full pl-10 pr-3.5 py-2.5 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 focus:border-neutral-900 dark:focus:border-neutral-300 rounded-xl text-sm text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 focus:outline-none transition-colors"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-neutral-600 dark:text-neutral-400 mb-1.5">
                      Parol
                    </label>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type={loginShowPassword ? 'text' : 'password'}
                        autoComplete="current-password"
                        value={loginPasswordInput}
                        onChange={e => {
                          setLoginPasswordInput(e.target.value);
                          if (loginFormError) setLoginFormError('');
                        }}
                        placeholder="••••••••"
                        className="w-full pl-10 pr-10 py-2.5 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 focus:border-neutral-900 dark:focus:border-neutral-300 rounded-xl text-sm text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 focus:outline-none transition-colors"
                      />
                      <button
                        type="button"
                        onClick={() => setLoginShowPassword(prev => !prev)}
                        className="p-1 text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 absolute right-2.5 top-1/2 -translate-y-1/2 cursor-pointer"
                        aria-label={loginShowPassword ? 'Parolni yashirish' : "Parolni ko'rsatish"}
                      >
                        {loginShowPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {loginFormError && (
                    <p className="text-xs text-red-500 font-medium">{loginFormError}</p>
                  )}

                  <button
                    type="submit"
                    className="w-full py-2.5 bg-neutral-900 hover:bg-neutral-800 dark:bg-neutral-100 dark:hover:bg-neutral-200 text-white dark:text-neutral-900 text-sm font-medium rounded-xl transition-colors cursor-pointer"
                  >
                    Kirish
                  </button>

                  <div className="flex items-center justify-center pt-1">
                    <button
                      type="button"
                      onClick={openChangePasswordModal}
                      className="text-xs font-medium text-[#3390ec] hover:underline cursor-pointer"
                    >
                      Parolni unutdingizmi? (Gmail orqali tiklash)
                    </button>
                  </div>
                </form>

                {!isPasswordCustomized && (
                  <p className="mt-6 text-center text-[11px] text-neutral-400">
                    Boshlang&apos;ich kirish: <span className="font-medium text-neutral-600 dark:text-neutral-300">{profile.username}</span> · <span className="font-mono font-medium text-neutral-600 dark:text-neutral-300">{accountPassword}</span>
                  </p>
                )}
              </>
            )}
          </div>

          <div className="h-6" />
        </div>
      ) : (
        <div className="min-h-full bg-white lg:bg-[#f4f4f2] dark:bg-neutral-950 dark:lg:bg-[#09090b] text-neutral-900 dark:text-neutral-100 font-sans antialiased selection:bg-neutral-200 dark:selection:bg-neutral-800 flex flex-col justify-between transition-colors duration-300">
      {/* Yuqori Navigatsiya Paneli */}
      <header className="sticky top-0 z-30 bg-white/95 dark:bg-neutral-950/95 backdrop-blur-md border-b border-neutral-100 dark:border-neutral-800/80">
        {/* Asosiy lenta qidiruv va boshqaruv paneli */}
        <div className="max-w-5xl mx-auto px-4 sm:px-8 lg:px-12 h-14 flex items-center justify-between gap-2">
          <div className="flex items-center space-x-1 sm:space-x-2 min-w-0 flex-1">
            <button
              onClick={() => setIsSearchModalOpen(true)}
              className="p-2 -ml-2 text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100 transition-colors rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-900 cursor-pointer flex items-center space-x-1.5 shrink-0"
              title="Qidirish"
              aria-label="Qidirish"
            >
              <Search className="w-4 h-4" />
              <span className="hidden min-[440px]:inline text-xs text-neutral-400">Qidirish...</span>
            </button>

            <div className="h-4 w-px bg-neutral-200 dark:bg-neutral-800 shrink-0" />
            <nav className="flex items-center space-x-0.5 sm:space-x-1 text-xs font-sans min-w-0">
              <button
                onClick={refreshAllStoriesFeed}
                className={`transition-colors py-1.5 px-2 sm:px-2.5 rounded-lg cursor-pointer whitespace-nowrap ${
                  !viewingPost && currentBottomTab === 'all'
                    ? 'text-neutral-900 dark:text-neutral-100 font-semibold'
                    : 'text-neutral-400 hover:text-neutral-800 dark:hover:text-neutral-200'
                }`}
              >
                Barcha hikoyalar
              </button>
              <button
                onClick={() => switchBottomTab('following')}
                className={`transition-colors py-1.5 px-2 sm:px-2.5 rounded-lg cursor-pointer whitespace-nowrap ${
                  !viewingPost && currentBottomTab === 'following'
                    ? 'text-neutral-900 dark:text-neutral-100 font-semibold'
                    : 'text-neutral-400 hover:text-neutral-800 dark:hover:text-neutral-200'
                }`}
              >
                Obunalar
              </button>
            </nav>
          </div>

          <div className="flex items-center space-x-0.5 sm:space-x-1.5 shrink-0">
            <button
              onClick={() => setIsPostsDrawerOpen(true)}
              className="p-1.5 sm:p-2 text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100 transition-colors rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-900 cursor-pointer"
              title="Mening hikoyalarim"
              aria-label="Mening hikoyalarim"
            >
              <BookOpen className="w-4 h-4" />
            </button>

            <button
              onClick={toggleDarkMode}
              className="p-1.5 sm:p-2 text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100 transition-colors rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-900 cursor-pointer"
              title={isDarkMode ? "Kunduzgi rejim" : "Tungi rejim"}
            >
              {isDarkMode ? <Sun className="w-4 h-4 text-amber-500" /> : <Moon className="w-4 h-4 text-neutral-700" />}
            </button>

            <button
              onClick={openNotifications}
              className="relative p-1.5 sm:p-2 text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100 transition-colors rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-900 cursor-pointer"
              title="Bildirishnomalar"
            >
              <Bell className="w-4 h-4" />
              {hasUnreadNotifications && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-neutral-900 dark:bg-neutral-100 rounded-full animate-pulse"></span>
              )}
            </button>

            <button
              onClick={() => {
                setIsProfileEditMode(false);
                setProfileSubView('main');
                setIsProfileDrawerOpen(true);
              }}
              className="p-1.5 sm:p-2 text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100 transition-colors rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-900 cursor-pointer"
              title="Profil ma'lumotlari"
            >
              <User className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Asosiy Kontent Maydoni */}
      <main className={`flex-1 max-w-5xl w-full mx-auto px-4 sm:px-8 lg:px-12 flex flex-col pb-24 sm:pb-28 lg:bg-white dark:lg:bg-neutral-950 lg:border-x lg:border-neutral-200/75 dark:lg:border-neutral-800/80 ${viewingPost ? 'pt-0' : 'pt-3 sm:pt-5 lg:pt-6'}`}>
        {viewingPost ? (
          /* To'liq o'qish sahifasi (Reader) */
          (() => {
            const isUserPost = viewingPost.authorUsername === profile.username;
            const isSubbed = viewingPost.authorUsername ? subscribedAuthors.includes(viewingPost.authorUsername) : false;
            const authorLetter = (viewingPost.authorName ? viewingPost.authorName[0] : profileInitials).toUpperCase();
            const authorBio = isUserPost
              ? profile.bio
              : (viewingPost.authorUsername && KNOWN_AUTHORS[viewingPost.authorUsername]?.bio) || viewingPost.bio || '';
            const authorGmail = isUserPost
              ? loginEmail
              : (viewingPost.authorUsername && KNOWN_AUTHORS[viewingPost.authorUsername]?.email) ||
                viewingPost.authorEmail ||
                `${(viewingPost.authorUsername || viewingPost.authorName || 'muallif')
                  .replace(/^@/, '')
                  .toLowerCase()
                  .replace(/[^a-z0-9._]/g, '') || 'muallif'}@gmail.com`;
            const recommendedStories = allPosts
              .filter(p => p.id !== viewingPost.id && (!p.authorUsername || !blockedUsers.includes(p.authorUsername)))
              .sort((a, b) => {
                const scoreDiff = getRecommendationScore(b) - getRecommendationScore(a);
                if (scoreDiff !== 0) return scoreDiff;
                return (b.timestamp || 0) - (a.timestamp || 0);
              })
              .slice(0, 5);
            const seriesAuthorUsername = postOriginAuthor?.username || (isUserPost ? profile.username : undefined);
            const authorSeriesPosts =
              seriesAuthorUsername && (postOriginAuthor || isUserPost)
                ? allPosts.filter(p => p.authorUsername === seriesAuthorUsername)
                : [];
            const currentSeriesIndex = authorSeriesPosts.findIndex(p => p.id === viewingPost.id);
            const prevSeriesPost = currentSeriesIndex > 0 ? authorSeriesPosts[currentSeriesIndex - 1] : null;
            const nextSeriesPost =
              currentSeriesIndex >= 0 && currentSeriesIndex < authorSeriesPosts.length - 1
                ? authorSeriesPosts[currentSeriesIndex + 1]
                : null;
            const isViewingSaved = savedPostIds.includes(viewingPost.id);

            return (
              <div className="flex flex-col flex-1 font-sans">
                {/* Hikoyaning doim tepada turadigan ixcham sarlavha paneli */}
                <div className="sticky top-14 z-20 -mx-4 sm:-mx-8 lg:-mx-12 px-4 sm:px-8 lg:px-12 py-2.5 sm:py-3 bg-white/95 dark:bg-neutral-950/95 backdrop-blur-md border-b border-neutral-100 dark:border-neutral-800/80 flex items-center justify-between gap-2.5">
                  <div className="flex items-center space-x-2.5 min-w-0 flex-1">
                    <button
                      onClick={closeReader}
                      className="p-1.5 -ml-1.5 text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors cursor-pointer flex items-center space-x-1 text-xs shrink-0"
                      title="Orqaga"
                      aria-label="Orqaga"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      <span className="hidden sm:inline">Orqaga</span>
                    </button>

                    <div className="h-4 w-px bg-neutral-200 dark:bg-neutral-800 shrink-0" />

                    <div
                      onClick={() => viewingPost.authorUsername && openAuthorProfileByUsername(viewingPost.authorUsername)}
                      className="w-8 h-8 bg-neutral-200 dark:bg-neutral-800 rounded-full shrink-0 flex items-center justify-center font-bold text-xs cursor-pointer hover:opacity-85 text-neutral-800 dark:text-neutral-200 overflow-hidden"
                    >
                      {viewingPost.avatar ? (
                        <img src={viewingPost.avatar} alt="" className="w-full h-full object-cover" />
                      ) : (
                        authorLetter
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-x-1.5 min-w-0">
                        <span
                          onClick={() => viewingPost.authorUsername && openAuthorProfileByUsername(viewingPost.authorUsername)}
                          className="font-semibold text-[13px] text-neutral-900 dark:text-neutral-100 cursor-pointer hover:underline truncate"
                          style={getAuthorNameStyle(viewingPost.authorUsername)}
                        >
                          {viewingPost.authorName || profile.name}
                        </span>
                        {!isUserPost && viewingPost.authorUsername && (
                          <>
                            <span className="text-neutral-400 text-[11px] shrink-0">·</span>
                            <button
                              onClick={e => toggleSubscribe(e, viewingPost.authorUsername!)}
                              className={`text-[11px] font-medium cursor-pointer hover:underline shrink-0 ${
                                isSubbed ? 'text-neutral-400' : 'text-[#3390ec]'
                              }`}
                            >
                              {isSubbed ? 'Obunadasiz' : "Obuna bo'lish"}
                            </button>
                          </>
                        )}
                      </div>
                      <p className="text-[11px] text-neutral-500 dark:text-neutral-400 truncate leading-tight">
                        {authorBio ? `${authorBio} · ` : ''}
                        {viewingPost.date}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-1 shrink-0">
                    <button
                      type="button"
                      onClick={() => toggleSavePost(viewingPost)}
                      className={`px-2 py-1 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors cursor-pointer flex items-center space-x-1 text-xs ${
                        isViewingSaved
                          ? 'text-[#3390ec]'
                          : 'text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100'
                      }`}
                      title={isViewingSaved ? 'Saqlangandan olib tashlash' : 'Saqlash'}
                      aria-label={isViewingSaved ? 'Saqlangandan olib tashlash' : 'Saqlash'}
                    >
                      <Bookmark className={`w-3.5 h-3.5 ${isViewingSaved ? 'fill-current' : ''}`} />
                      <span>{saveCounts[viewingPost.id] || 0}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => copyPostShareLink(viewingPost)}
                      className="px-2 py-1 text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors cursor-pointer flex items-center space-x-1 text-xs"
                      title="Uzatish"
                      aria-label="Uzatish"
                    >
                      <Repeat2 className="w-3.5 h-3.5" />
                      <span>{shareCounts[viewingPost.id] || 0}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => startReplyToPost(viewingPost)}
                      className={`px-2 py-1 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors cursor-pointer flex items-center space-x-1 text-xs ${
                        replyingToPost?.id === viewingPost.id
                          ? 'text-[#3390ec]'
                          : 'text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100'
                      }`}
                      title="Javob berish"
                      aria-label="Javob berish"
                    >
                      <Reply className="w-3.5 h-3.5" />
                      <span>{allPosts.filter(p => p.replyTo?.postId === viewingPost.id).length}</span>
                    </button>
                  </div>
                </div>

                {/* Telegram-uslubidagi javob berilgan hikoya iqtibosi */}
                {viewingPost.replyTo && (
                  <div className="pt-3.5">
                    {renderReplyQuote(viewingPost.replyTo)}
                  </div>
                )}

                {/* WhatsApp-uslubidagi havola va rasm ko'rinishi */}
                {(() => {
                  const viewingPreview = getPostLinkPreview(viewingPost);
                  return viewingPreview ? (
                    <div className={viewingPost.replyTo ? 'pt-2.5' : 'pt-3.5'}>
                      {renderLinkPreviewCard(viewingPreview, false, viewingPost)}
                    </div>
                  ) : null;
                })()}

                {/* Asosiy matn (matnni belgilab javob berish qo'llab-quvvatlanadi) */}
                <div
                  ref={readerContentRef}
                  onMouseUp={handleReaderTextSelection}
                  onTouchEnd={handleReaderTextSelection}
                  onKeyUp={handleReaderTextSelection}
                  className={`text-[15.5px] sm:text-[16.5px] lg:text-[17px] font-normal text-neutral-900 dark:text-neutral-100 leading-[1.7] lg:leading-[1.8] whitespace-pre-line [overflow-wrap:anywhere] select-text ${viewingPost.replyTo || viewingPost.linkPreview ? 'pt-3 sm:pt-4' : 'pt-4 sm:pt-5'} pb-5`}
                >
                  {renderHighlightedStoryContent(viewingPost)}
                </div>

                {readerSelectionPopup && (
                  <button
                    type="button"
                    onMouseDown={e => {
                      e.preventDefault();
                      e.stopPropagation();
                      startReplyToPost(viewingPost, readerSelectionPopup.text);
                      window.getSelection()?.removeAllRanges();
                    }}
                    style={{
                      top: `${readerSelectionPopup.top}px`,
                      left: `${readerSelectionPopup.left}px`,
                    }}
                    className="fixed -translate-x-1/2 z-50 px-3 py-1.5 rounded-full bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 shadow-lg text-xs font-medium flex items-center space-x-1.5 cursor-pointer hover:opacity-95 transition-opacity"
                  >
                    <Reply className="w-3.5 h-3.5" />
                    <span>Javob berish</span>
                  </button>
                )}

                {/* Hikoya ostidagi ko'rishlar soni va muallif uchun Tahrirlash / O'chirish */}
                <div className="flex flex-wrap items-center justify-between gap-3 pb-3">
                  <div className="flex items-center space-x-1.5 text-xs text-neutral-400 dark:text-neutral-500">
                    <Eye className="w-3.5 h-3.5" />
                    <span className="tabular-nums">{viewCounts[viewingPost.id] || 1} marta ko&apos;rilgan</span>
                  </div>

                  {isUserPost && (
                    <div className="flex items-center space-x-3 text-xs font-sans">
                      <button
                        type="button"
                        onClick={() => editPost(viewingPost.id)}
                        className="text-neutral-600 dark:text-neutral-300 hover:underline cursor-pointer flex items-center space-x-1"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                        <span>Tahrirlash</span>
                      </button>
                      <span className="text-neutral-300 dark:text-neutral-700">•</span>
                      <button
                        type="button"
                        onClick={() => setPostToDelete(viewingPost.id)}
                        className="text-red-500 hover:underline cursor-pointer"
                      >
                        O&apos;chirish
                      </button>
                    </div>
                  )}
                </div>

                {/* Hikoyaning eng tagida muallifning Gmail manzili */}
                <div ref={storyEndRef} className="scroll-mb-28 pb-4">
                  {authorGmail && (
                    <div className="rounded-xl border border-neutral-200/80 dark:border-neutral-800 bg-neutral-50/80 dark:bg-neutral-900/45 px-3.5 py-2.5 flex flex-wrap items-center justify-between gap-2.5">
                      <div className="flex items-center gap-2.5 min-w-0 flex-1">
                        <div className="w-8 h-8 rounded-lg bg-white dark:bg-neutral-900 border border-neutral-200/70 dark:border-neutral-800 flex items-center justify-center text-neutral-600 dark:text-neutral-300 shrink-0">
                          <Mail className="w-4 h-4 stroke-[1.75]" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-[11px] text-neutral-500 dark:text-neutral-400 leading-tight">
                            Muallifga xabar yozish uchun Gmail
                          </p>
                          {(() => {
                            const { href, isExternal } = buildEmailHref(authorGmail, viewingPost.title);
                            return (
                              <a
                                href={href}
                                target={isExternal ? '_blank' : undefined}
                                rel={isExternal ? 'noopener noreferrer' : undefined}
                                className="text-xs sm:text-[13px] font-medium text-[#2563eb] dark:text-[#60a5fa] hover:underline truncate block"
                              >
                                {authorGmail}
                              </a>
                            );
                          })()}
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={async () => {
                          try {
                            await navigator.clipboard.writeText(authorGmail);
                            setCopiedAuthorEmail(true);
                            setTimeout(() => setCopiedAuthorEmail(false), 1800);
                          } catch {
                            // ignore clipboard failure
                          }
                        }}
                        className="p-2 rounded-lg border border-neutral-200/80 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors cursor-pointer shrink-0"
                        title="Gmail manzilini nusxalash"
                        aria-label="Gmail manzilini nusxalash"
                      >
                        {copiedAuthorEmail ? (
                          <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>
                  )}
                </div>

                {/* Muallif hikoyalari bo'yicha Orqaga / Keyingi tugmalari */}
                {authorSeriesPosts.length > 1 && currentSeriesIndex !== -1 && (
                  <section className="py-4 border-t border-neutral-100 dark:border-neutral-800/80">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-medium text-neutral-500 dark:text-neutral-400 tabular-nums">
                        Hikoyalar ({currentSeriesIndex + 1} / {authorSeriesPosts.length})
                      </span>

                      <div className="flex items-center space-x-2">
                        <button
                          type="button"
                          disabled={!prevSeriesPost}
                          onClick={() =>
                            prevSeriesPost &&
                            openCommunityPost(prevSeriesPost, postOriginAuthor, postOriginSaved)
                          }
                          className={`px-2.5 py-1.5 rounded-lg border text-xs flex items-center space-x-1 transition-colors ${
                            prevSeriesPost
                              ? 'border-neutral-200 dark:border-neutral-800 text-neutral-700 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-900 cursor-pointer'
                              : 'border-neutral-100 dark:border-neutral-900 text-neutral-300 dark:text-neutral-700 cursor-not-allowed'
                          }`}
                        >
                          <ChevronLeft className="w-3.5 h-3.5" />
                          <span>Orqaga</span>
                        </button>

                        <button
                          type="button"
                          disabled={!nextSeriesPost}
                          onClick={() =>
                            nextSeriesPost &&
                            openCommunityPost(nextSeriesPost, postOriginAuthor, postOriginSaved)
                          }
                          className={`px-2.5 py-1.5 rounded-lg border text-xs flex items-center space-x-1 transition-colors ${
                            nextSeriesPost
                              ? 'border-neutral-200 dark:border-neutral-800 text-[#3390ec] hover:bg-[#3390ec]/10 cursor-pointer'
                              : 'border-neutral-100 dark:border-neutral-900 text-neutral-300 dark:text-neutral-700 cursor-not-allowed'
                          }`}
                        >
                          <span>Keyingi</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </section>
                )}

                {/* Pastda tavsiya etilgan boshqa hikoyalar */}
                {recommendedStories.length > 0 && (
                  <section className="pt-4 border-t border-neutral-100 dark:border-neutral-800/80 space-y-1.5">
                    <h3 className="text-xs font-medium uppercase tracking-wider text-neutral-400 dark:text-neutral-500 pb-0.5">
                      Tavsiya etilgan hikoyalar
                    </h3>
                    <div className="divide-y divide-neutral-100 dark:divide-neutral-800/80">
                      {recommendedStories.map(rec => {
                        const recAuthorLetter = (rec.authorName ? rec.authorName[0] : 'M').toUpperCase();

                        return (
                          <article
                            key={rec.id}
                            onClick={() =>
                              openCommunityPost(
                                rec,
                                rec.authorUsername === postOriginAuthor?.username ? postOriginAuthor : null,
                                false
                              )
                            }
                            className="py-3 first:pt-1.5 last:pb-0 cursor-pointer group space-y-1.5"
                          >
                            <div className="flex items-center justify-between gap-2 text-xs">
                              <div className="flex items-center space-x-2 min-w-0">
                                <div
                                  onClick={e => {
                                    e.stopPropagation();
                                    if (rec.authorUsername) openAuthorProfileByUsername(rec.authorUsername);
                                  }}
                                  className="w-6 h-6 rounded-full bg-neutral-200 dark:bg-neutral-800 flex items-center justify-center font-bold text-[10px] text-neutral-800 dark:text-neutral-200 overflow-hidden shrink-0"
                                >
                                  {rec.avatar ? (
                                    <img src={rec.avatar} alt="" className="w-full h-full object-cover" />
                                  ) : (
                                    recAuthorLetter
                                  )}
                                </div>
                                <span
                                  onClick={e => {
                                    e.stopPropagation();
                                    if (rec.authorUsername) openAuthorProfileByUsername(rec.authorUsername);
                                  }}
                                  className="font-semibold text-[13px] text-neutral-900 dark:text-neutral-100 hover:underline truncate"
                                  style={getAuthorNameStyle(rec.authorUsername)}
                                >
                                  {rec.authorName || profile.name}
                                </span>
                              </div>
                              <div className="flex items-center space-x-2 text-[11px] text-neutral-400 shrink-0">
                                <span>{rec.date}</span>
                                {rec.readTime && (
                                  <>
                                    <span>·</span>
                                    <span>{rec.readTime}</span>
                                  </>
                                )}
                              </div>
                            </div>

                            {rec.replyTo && renderReplyQuote(rec.replyTo)}

                            <p className="text-[13.5px] font-normal text-neutral-700 dark:text-neutral-300 leading-relaxed whitespace-pre-line line-clamp-3 [overflow-wrap:anywhere]">
                              {rec.content}
                            </p>
                          </article>
                        );
                      })}
                    </div>
                  </section>
                )}

                {/* Hikoyaning boshiga chiqish va eng pastiga tushish tezkor tugmalari */}
                <div
                  className={`fixed right-3.5 sm:right-6 xl:right-[max(1.25rem,calc(50vw-35.75rem))] z-25 flex flex-col gap-1.5 transition-all ${
                    replyingToPost || composerLinkPreview || activePostId ? 'bottom-32 sm:bottom-36' : 'bottom-20 sm:bottom-22'
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                    className="w-10 h-10 rounded-xl bg-white/90 dark:bg-neutral-900/90 backdrop-blur-md border border-neutral-200/90 dark:border-neutral-800 text-neutral-700 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 hover:text-neutral-900 dark:hover:text-white shadow-sm flex items-center justify-center transition-colors cursor-pointer"
                    title="Hikoyaning boshiga chiqish"
                    aria-label="Hikoyaning boshiga chiqish"
                  >
                    <ArrowUp className="w-4 h-4 stroke-[2]" />
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (storyEndRef.current) {
                        storyEndRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' });
                      } else {
                        window.scrollTo({
                          top: document.documentElement.scrollHeight,
                          behavior: 'smooth',
                        });
                      }
                    }}
                    className="w-10 h-10 rounded-xl bg-white/90 dark:bg-neutral-900/90 backdrop-blur-md border border-neutral-200/90 dark:border-neutral-800 text-neutral-700 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 hover:text-neutral-900 dark:hover:text-white shadow-sm flex items-center justify-center transition-colors cursor-pointer"
                    title="Hikoyaning eng pastiga tushish"
                    aria-label="Hikoyaning eng pastiga tushish"
                  >
                    <ArrowDown className="w-4 h-4 stroke-[2]" />
                  </button>
                </div>
              </div>
            );
          })()
        ) : (
          /* Lenta (Feed) bo'limi */
          <div className="flex flex-col space-y-6">
            <div className="divide-y divide-neutral-100 dark:divide-neutral-800/80">
              {displayedFeedPosts.length === 0 ? (
                <div className="text-center py-12 space-y-2">
                  <p className="text-sm text-neutral-400">Hikoyalar topilmadi.</p>
                  {currentFeedTab === 'following' && (
                    <p className="text-xs text-neutral-400">
                      Siz obuna bo'lgan mualliflar hikoyalari bu yerda chiqadi.{' '}
                      <button onClick={() => setCurrentFeedTab('all')} className="underline hover:text-neutral-700 dark:hover:text-neutral-300">
                        Barcha hikoyalar
                      </button>{' '}
                      bo'limidan mualliflarga obuna bo'lishingiz mumkin.
                    </p>
                  )}
                </div>
              ) : (
                displayedFeedPosts.map(post => {
                  const isUserPost = post.authorUsername === profile.username;
                  const isSubbed = post.authorUsername ? subscribedAuthors.includes(post.authorUsername) : false;
                  const authorLetter = (post.authorName ? post.authorName[0] : 'M').toUpperCase();
                  const authorBio = isUserPost
                    ? profile.bio
                    : (post.authorUsername && KNOWN_AUTHORS[post.authorUsername]?.bio) || post.bio || '';

                  const MAX_COLLAPSED_CHARS = 280;
                  const MAX_COLLAPSED_LINES = 4;
                  const compactContent = post.content.replace(/\n{2,}/g, '\n');
                  const lines = compactContent.split('\n');
                  const needsTruncation = compactContent.length > MAX_COLLAPSED_CHARS || lines.length > MAX_COLLAPSED_LINES;
                  const displayContent = (() => {
                    if (!needsTruncation) return compactContent;
                    const slicedLines = lines.slice(0, MAX_COLLAPSED_LINES).join('\n');
                    if (slicedLines.length > MAX_COLLAPSED_CHARS) {
                      return slicedLines.slice(0, MAX_COLLAPSED_CHARS).trimEnd() + '... ';
                    }
                    return slicedLines.trimEnd() + '... ';
                  })();

                  const isMenuOpen = openMenuPostId === post.id;

                  return (
                    <article key={post.id} className="py-3.5 sm:py-4.5 first:pt-1 space-y-1.5 sm:space-y-2 font-sans">
                      {/* Muallif Sarlavhasi + Amallar menyusi */}
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-start space-x-2.5 min-w-0 flex-1">
                          <div
                            onClick={() => post.authorUsername && openAuthorProfileByUsername(post.authorUsername)}
                            className="w-9 h-9 bg-neutral-200 dark:bg-neutral-800 rounded-full shrink-0 flex items-center justify-center font-bold text-xs cursor-pointer hover:opacity-85 text-neutral-800 dark:text-neutral-200 overflow-hidden"
                          >
                            {post.avatar ? (
                              <img src={post.avatar} alt="" className="w-full h-full object-cover" />
                            ) : (
                              authorLetter
                            )}
                          </div>

                          <div className="min-w-0 flex-1">
                            <div className="flex items-center flex-wrap gap-x-1.5 leading-snug">
                              <span
                                onClick={() => post.authorUsername && openAuthorProfileByUsername(post.authorUsername)}
                                className="font-semibold text-[13.5px] text-neutral-900 dark:text-neutral-100 cursor-pointer hover:underline truncate max-w-[180px] sm:max-w-xs"
                                style={getAuthorNameStyle(post.authorUsername)}
                              >
                                {post.authorName}
                              </span>

                              {isUserPost ? (
                                <span className="text-[11px] text-neutral-400">· Siz</span>
                              ) : (
                                post.authorUsername && (
                                  <>
                                    <span className="text-neutral-400 text-xs">·</span>
                                    <button
                                      type="button"
                                      onClick={e => toggleSubscribe(e, post.authorUsername!)}
                                      className={`text-[13px] font-medium cursor-pointer hover:underline ${
                                        isSubbed ? 'text-neutral-400' : 'text-[#3390ec]'
                                      }`}
                                    >
                                      {isSubbed ? 'Obunadasiz' : "Obuna bo'lish"}
                                    </button>
                                  </>
                                )
                              )}
                            </div>

                            <p className="text-xs text-neutral-500 dark:text-neutral-400 truncate mt-0.5">
                              {authorBio ? `${authorBio} · ` : ''}
                              {post.date}
                            </p>
                          </div>
                        </div>

                        <div className="relative shrink-0 -mr-1">
                          <button
                            type="button"
                            onClick={e => {
                              e.stopPropagation();
                              setOpenMenuPostId(prev => (prev === post.id ? null : post.id));
                            }}
                            className="p-1.5 rounded-full text-neutral-400 hover:text-neutral-800 dark:hover:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800/80 transition-colors cursor-pointer"
                            title="Boshqa amallar"
                          >
                            <MoreHorizontal className="w-4 h-4" />
                          </button>

                          {isMenuOpen && (
                            <div
                              onClick={e => e.stopPropagation()}
                              className="absolute right-0 top-full mt-1.5 w-48 bg-white dark:bg-neutral-900 border border-neutral-100 dark:border-neutral-800 rounded-xl shadow-xl py-1.5 z-30 text-xs"
                            >
                              <button
                                type="button"
                                onClick={() => {
                                  setOpenMenuPostId(null);
                                  openCommunityPost(post);
                                }}
                                className="w-full px-3.5 py-2 text-left text-neutral-700 dark:text-neutral-200 hover:bg-neutral-50 dark:hover:bg-neutral-800 flex items-center space-x-2 cursor-pointer"
                              >
                                <BookOpen className="w-3.5 h-3.5 text-neutral-400" />
                                <span>To'liq sahifada o'qish</span>
                              </button>

                              <button
                                type="button"
                                onClick={() => {
                                  setOpenMenuPostId(null);
                                  copyPostShareLink(post);
                                }}
                                className="w-full px-3.5 py-2 text-left text-neutral-700 dark:text-neutral-200 hover:bg-neutral-50 dark:hover:bg-neutral-800 flex items-center space-x-2 cursor-pointer"
                              >
                                <Share2 className="w-3.5 h-3.5 text-neutral-400" />
                                <span>Havolani nusxalash</span>
                              </button>

                              {!isUserPost && post.authorUsername && (
                                <button
                                  type="button"
                                  onClick={() => {
                                    setOpenMenuPostId(null);
                                    openAuthorProfileByUsername(post.authorUsername!);
                                  }}
                                  className="w-full px-3.5 py-2 text-left text-neutral-700 dark:text-neutral-200 hover:bg-neutral-50 dark:hover:bg-neutral-800 flex items-center space-x-2 cursor-pointer"
                                >
                                  <User className="w-3.5 h-3.5 text-neutral-400" />
                                  <span>Muallif profili</span>
                                </button>
                              )}

                              {isUserPost && (
                                <>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setOpenMenuPostId(null);
                                      editPost(post.id);
                                    }}
                                    className="w-full px-3.5 py-2 text-left text-neutral-700 dark:text-neutral-200 hover:bg-neutral-50 dark:hover:bg-neutral-800 flex items-center space-x-2 cursor-pointer"
                                  >
                                    <Edit2 className="w-3.5 h-3.5 text-neutral-400" />
                                    <span>Tahrirlash</span>
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setOpenMenuPostId(null);
                                      setPostToDelete(post.id);
                                    }}
                                    className="w-full px-3.5 py-2 text-left text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 flex items-center space-x-2 cursor-pointer"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                    <span>O'chirish</span>
                                  </button>
                                </>
                              )}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Telegram-uslubidagi javob berilgan hikoya iqtibosi */}
                      {post.replyTo && renderReplyQuote(post.replyTo)}

                      {/* WhatsApp-uslubidagi havola va rasm ko'rinishi */}
                      {(() => {
                        const feedPreview = getPostLinkPreview(post);
                        return feedPreview ? renderLinkPreviewCard(feedPreview, true, post) : null;
                      })()}

                      {/* Telegram-style toza ko'p qatorli matn + inline (davomini o'qish) */}
                      <div className="text-[15px] lg:text-[15.5px] font-normal leading-[1.55] lg:leading-[1.65] text-neutral-900 dark:text-neutral-100 whitespace-pre-line [overflow-wrap:anywhere] min-w-0">
                        {renderTextWithLinks(displayContent)}
                        {needsTruncation && (
                          <button
                            type="button"
                            onClick={e => {
                              e.stopPropagation();
                              openCommunityPost(post);
                            }}
                            className="text-[#3390ec] hover:underline font-normal cursor-pointer inline"
                          >
                            (davomini o'qish)
                          </button>
                        )}
                      </div>
                    </article>
                  );
                })
              )}
            </div>
          </div>
        )}
      </main>

      {/* Pastki Xabar-uslubidagi Yozish Oynasi (Lentada va hikoya o'qishda hikoya yozish/tahrirlash uchun) */}
      <div className="fixed bottom-0 inset-x-0 bg-white/95 dark:bg-neutral-950/95 backdrop-blur-md border-t border-neutral-100 dark:border-neutral-800/80 z-20">
        {activePostId && (
          <div className="max-w-5xl mx-auto px-4 sm:px-8 lg:px-12 py-1.5 border-b border-neutral-100 dark:border-neutral-800/80 flex items-center justify-between text-xs font-sans">
            <span className="text-[#3390ec] font-medium flex items-center space-x-1.5">
              <Edit2 className="w-3.5 h-3.5" />
              <span>Hikoyani tahrirlamoqdasiz</span>
            </span>
            <button
              type="button"
              onClick={cancelWriting}
              className="text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 p-0.5 cursor-pointer"
              title="Bekor qilish"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {replyingToPost && !activePostId && (() => {
          const replyColor = getAuthorReplyColor(replyingToPost.authorUsername);
          const replyAuthorName = replyingToPost.authorName || profile.name;
          const previewText = (replyQuoteText || replyingToPost.title).trim();
          return (
            <div className="max-w-5xl mx-auto px-4 sm:px-8 lg:px-12 pt-1.5">
              <div
                style={{
                  borderLeftColor: replyColor,
                  backgroundColor: hexToRgba(replyColor, isDarkMode ? 0.18 : 0.11),
                }}
                className="border-l-[3px] rounded-md px-2.5 py-1.5 flex items-center justify-between gap-2 text-xs font-sans"
              >
                <div
                  role="button"
                  tabIndex={0}
                  onClick={openQuotePicker}
                  onKeyDown={e => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      openQuotePicker();
                    }
                  }}
                  className="min-w-0 flex-1 cursor-pointer hover:opacity-85 transition-opacity"
                  title="Matnni belgilash uchun ustiga bosing"
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center space-x-1 font-semibold leading-tight truncate" style={{ color: replyColor }}>
                      <Reply className="w-3 h-3 shrink-0" />
                      <span className="truncate">{replyAuthorName}</span>
                    </div>
                    <span className="text-[10.5px] text-neutral-400 dark:text-neutral-400 shrink-0">
                      Matn belgilash
                    </span>
                  </div>
                  <p className="text-neutral-600 dark:text-neutral-300 truncate mt-0.5 text-[11.5px]">
                    {previewText}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setReplyingToPost(null);
                    setReplyQuoteText('');
                    setIsQuotePickerOpen(false);
                  }}
                  className="text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 p-0.5 cursor-pointer shrink-0"
                  title="Bekor qilish"
                  aria-label="Bekor qilish"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })()}

        {storyLengthError && storyCharCount < MIN_STORY_CHARS && (
          <div className="max-w-5xl mx-auto px-4 sm:px-8 lg:px-12 py-1.5 border-b border-amber-100 dark:border-amber-900/40 bg-amber-50/70 dark:bg-amber-950/20 flex items-center justify-between text-xs font-sans text-amber-700 dark:text-amber-300">
            <span>{storyLengthError}</span>
            <button
              type="button"
              onClick={() => setStoryLengthError('')}
              className="text-amber-500 hover:text-amber-700 dark:hover:text-amber-200 p-0.5 cursor-pointer shrink-0 ml-2"
              title="Yopish"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {(isLoadingLinkPreview || composerLinkPreview) && (
          <div className="max-w-5xl mx-auto px-4 sm:px-8 lg:px-12 pt-1.5">
            <div className="rounded-lg border border-neutral-200/80 dark:border-neutral-800 bg-neutral-100/80 dark:bg-neutral-900/90 px-2.5 py-1.5 flex items-center gap-2.5 text-xs font-sans">
              {isLoadingLinkPreview && !composerLinkPreview ? (
                <div className="flex items-center space-x-2 text-neutral-500 dark:text-neutral-400 min-w-0 flex-1 py-0.5">
                  <Link2 className="w-3.5 h-3.5 text-[#3390ec] animate-pulse shrink-0" />
                  <span className="truncate">Havola ma&apos;lumotlari yuklanmoqda...</span>
                </div>
              ) : composerLinkPreview ? (
                <div className="flex items-center space-x-2.5 min-w-0 flex-1">
                  {composerLinkPreview.imageUrl && !failedPreviewImages[composerLinkPreview.imageUrl] && (
                    <button
                      type="button"
                      onClick={() =>
                        setLinkImageLightbox({
                          imageUrl: composerLinkPreview.imageUrl!,
                          title: composerLinkPreview.title,
                          description: composerLinkPreview.description,
                          domain: composerLinkPreview.domain,
                          linkUrl: composerLinkPreview.url,
                          embeddable: composerLinkPreview.embeddable,
                        })
                      }
                      className="shrink-0 rounded overflow-hidden cursor-zoom-in focus:outline-none"
                      title="Rasmni kattalashtirib ko'rish"
                    >
                      <img
                        src={composerLinkPreview.imageUrl}
                        alt=""
                        referrerPolicy="no-referrer"
                        onError={() =>
                          setFailedPreviewImages(prev => ({
                            ...prev,
                            [composerLinkPreview.imageUrl!]: true,
                          }))
                        }
                        className="w-10 h-10 object-cover bg-neutral-200 dark:bg-neutral-800 block"
                      />
                    </button>
                  )}
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-neutral-900 dark:text-neutral-100 truncate text-[12px]">
                      {composerLinkPreview.title || composerLinkPreview.domain}
                    </p>
                    <p className="text-[11px] text-neutral-400 truncate">
                      {composerLinkPreview.domain}
                    </p>
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        )}

        {/* Telegram xabar yozish oynasidek sodda pastki panel */}
        <div className="max-w-5xl mx-auto px-4 sm:px-8 lg:px-12 py-2.5 flex items-end gap-3 font-sans">
          <button
            type="button"
            onClick={() => {
              setIsProfileEditMode(false);
              setProfileSubView('main');
              setIsProfileDrawerOpen(true);
            }}
            className="w-9 h-9 rounded-full shrink-0 bg-neutral-200 dark:bg-neutral-800 flex items-center justify-center font-bold text-xs text-neutral-800 dark:text-neutral-200 overflow-hidden cursor-pointer hover:opacity-90 transition-opacity"
            title={profile.name}
          >
            {profile.avatar ? (
              <img src={profile.avatar} alt={profile.name} className="w-full h-full object-cover" />
            ) : (
              profileInitials
            )}
          </button>

          <textarea
            ref={composerRef}
            rows={1}
            value={editorText}
            onChange={e => {
              const nextVal = e.target.value;
              setEditorText(nextVal);
              const nextLen = nextVal.trim().length;
              if (nextLen === 0 || nextLen >= MIN_STORY_CHARS) {
                if (storyLengthError) setStoryLengthError('');
              } else if (storyLengthError) {
                setStoryLengthError(`Hikoya kamida ${MIN_STORY_CHARS} ta belgidan iborat bo'lishi kerak (yana ${MIN_STORY_CHARS - nextLen} ta belgi kiriting)`);
              }
            }}
            onKeyDown={e => {
              if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
                e.preventDefault();
                handleComposerSubmit();
              }
            }}
            placeholder="Hikoya yozing (kamida 500 belgi)..."
            className="flex-1 bg-transparent border-none resize-none focus:outline-none text-sm sm:text-[15.5px] leading-6 text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 dark:placeholder-neutral-500 py-1.5 overflow-y-auto"
          />

          <div className="flex items-center space-x-1.5 shrink-0 pb-1">
            {storyCharCount > 0 && (
              <span
                className={`text-[11px] tabular-nums mr-0.5 ${
                  storyCharCount < MIN_STORY_CHARS
                    ? 'text-amber-600 dark:text-amber-400 font-medium'
                    : 'text-neutral-400'
                }`}
              >
                {storyCharCount < MIN_STORY_CHARS ? `${storyCharCount}/${MIN_STORY_CHARS}` : `${wordCount} so'z`}
              </span>
            )}
            <button
              type="button"
              onClick={handleComposerSubmit}
              disabled={storyCharCount === 0}
              className={`p-2 rounded-full transition-all cursor-pointer active:scale-95 ${
                storyCharCount >= MIN_STORY_CHARS
                  ? 'text-[#3390ec] hover:bg-blue-50 dark:hover:bg-neutral-900'
                  : 'text-neutral-300 dark:text-neutral-700 cursor-default'
              }`}
              title={
                storyCharCount > 0 && storyCharCount < MIN_STORY_CHARS
                  ? `Kamida ${MIN_STORY_CHARS} ta belgi kiriting (${storyCharCount}/${MIN_STORY_CHARS})`
                  : activePostId
                  ? 'Yangilash (Ctrl+Enter)'
                  : 'Chop etish (Ctrl+Enter)'
              }
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Minimalist Adabiy Studio Profil Paneli */}
      {isProfileDrawerOpen && (
        <div
          onClick={() => {
            setIsProfileDrawerOpen(false);
            setIsProfileEditMode(false);
            setProfileSubView('main');
            setIsQrModalOpen(false);
          }}
          className="fixed inset-0 bg-black/30 dark:bg-black/60 backdrop-blur-xs z-40 transition-opacity"
        ></div>
      )}
      <div
        className={`fixed top-0 right-0 bottom-0 w-full max-w-[410px] bg-white dark:bg-neutral-950 border-l border-neutral-200/80 dark:border-neutral-800 z-50 transform transition-transform duration-300 ease-in-out flex flex-col overflow-hidden ${
          isProfileDrawerOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <input
          type="file"
          id="avatar-upload-input"
          accept="image/*"
          className="hidden"
          onChange={handleAvatarUpload}
        />

        {/* Header */}
        <div className="px-4 py-3 border-b border-neutral-100 dark:border-neutral-800/80 flex items-center justify-between font-sans shrink-0 bg-white/95 dark:bg-neutral-950/95">
          <div className="flex items-center space-x-2.5 min-w-0">
            <button
              onClick={() => {
                if (isProfileEditMode) {
                  setIsProfileEditMode(false);
                } else if (profileSubView !== 'main') {
                  setProfileSubView('main');
                } else {
                  setIsProfileDrawerOpen(false);
                }
              }}
              className="p-1.5 -ml-1 text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors cursor-pointer shrink-0"
              title="Orqaga"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h3 className="font-semibold text-[15px] tracking-tight text-neutral-900 dark:text-neutral-100 truncate">
              {isProfileEditMode
                ? 'Profilni tahrirlash'
                : profileSubView === 'following'
                ? `Obunalarim (${subscribedAuthors.length})`
                : profileSubView === 'followers'
                ? `Obunachilarim (${followers.length})`
                : profileSubView === 'blocked'
                ? `Bloklanganlar (${blockedUsers.length})`
                : profileSubView === 'sessions'
                ? `Faol seanslar (${activeSessions.length})`
                : 'Profil'}
            </h3>
          </div>
          <div className="flex items-center space-x-1 shrink-0">
            {isProfileEditMode ? (
              <button
                onClick={() => {
                  setIsProfileEditMode(false);
                }}
                className="px-3 py-1.5 text-xs font-medium bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 hover:opacity-90 rounded-lg transition-opacity cursor-pointer inline-flex items-center gap-1.5 whitespace-nowrap"
                title="Saqlash"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Tayyor</span>
              </button>
            ) : (
              profileSubView === 'main' && (
                <button
                  onClick={() => {
                    setProfileSubView('main');
                    setIsProfileEditMode(true);
                  }}
                  className="px-2.5 py-1.5 text-xs font-medium text-neutral-600 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800/80 transition-colors cursor-pointer inline-flex items-center gap-1.5 whitespace-nowrap"
                  title="Profilni tahrirlash"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                  <span>Tahrirlash</span>
                </button>
              )
            )}
            <button
              onClick={() => {
                setIsProfileDrawerOpen(false);
                setIsProfileEditMode(false);
                setProfileSubView('main');
                setIsQrModalOpen(false);
              }}
              className="p-1.5 text-neutral-400 hover:text-neutral-800 dark:hover:text-neutral-200 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
              title="Yopish"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto font-sans">
          {/* Profil Hero (Yangi mualliflik kartasi) */}
          {(isProfileEditMode || profileSubView === 'main') && (
            <div className="bg-neutral-50/85 dark:bg-neutral-900/50 border-b border-neutral-200/70 dark:border-neutral-800/80 px-5 pt-5 pb-4 space-y-4">
              <div className="flex items-start gap-4">
                <div className="relative w-16 h-16 shrink-0">
                  <button
                    type="button"
                    onClick={() => {
                      const list =
                        profilePhotos.length > 0
                          ? profilePhotos
                          : profile.avatar
                          ? [profile.avatar]
                          : [];
                      setPhotoLightbox({
                        photos: list,
                        index: 0,
                        name: profile.name,
                        initials: profileInitials,
                        isOwn: true,
                      });
                    }}
                    className="w-16 h-16 bg-neutral-200 dark:bg-neutral-800 rounded-2xl overflow-hidden flex items-center justify-center text-neutral-800 dark:text-neutral-200 font-semibold text-xl ring-1 ring-black/5 dark:ring-white/10 cursor-pointer hover:opacity-90 transition-opacity"
                    title="Profil rasmini kattalashtirib ko'rish"
                  >
                    {profile.avatar ? (
                      <img src={profile.avatar} alt={profile.name} className="w-full h-full object-cover" />
                    ) : (
                      <span>{profileInitials}</span>
                    )}
                  </button>
                  {isProfileEditMode && (
                    <button
                      onClick={() => document.getElementById('avatar-upload-input')?.click()}
                      className="absolute -bottom-1 -right-1 w-6.5 h-6.5 bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 rounded-lg flex items-center justify-center shadow-sm ring-2 ring-white dark:ring-neutral-950 cursor-pointer transition-transform active:scale-95"
                      title="Rasm yuklash"
                    >
                      <Camera className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                <div className="min-w-0 flex-1 pt-0.5 space-y-1">
                  <div className="flex items-center justify-between gap-2">
                    <h2
                      className="font-semibold text-[17px] tracking-tight text-neutral-900 dark:text-neutral-100 truncate"
                      style={getPresetTextStyle(activeNamePreset)}
                    >
                      {profile.name}
                    </h2>
                    {!isProfileEditMode && (
                      <button
                        type="button"
                        onClick={() => {
                          setQrCopied(false);
                          setIsQrModalOpen(true);
                        }}
                        className="p-1.5 text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white hover:bg-neutral-200/70 dark:hover:bg-neutral-800 rounded-lg transition-colors cursor-pointer shrink-0"
                        title="QR kod"
                        aria-label="QR kod"
                      >
                        <QrCode className="w-4 h-4 stroke-[1.75]" />
                      </button>
                    )}
                  </div>

                  <p className="text-xs text-neutral-500 dark:text-neutral-400 truncate">
                    <span className="text-[#2563eb] dark:text-[#60a5fa] font-medium">{profile.username}</span>
                    <span className="mx-1.5 text-neutral-300 dark:text-neutral-700" aria-hidden="true">·</span>
                    <span className="tabular-nums">{posts.length} hikoya</span>
                    <span className="mx-1.5 text-neutral-300 dark:text-neutral-700" aria-hidden="true">·</span>
                    <span className="tabular-nums">{followers.length} obunachi</span>
                  </p>

                  {!isProfileEditMode && profile.bio && (
                    <p className="text-xs text-neutral-600 dark:text-neutral-300 leading-relaxed line-clamp-2 pt-0.5">
                      {profile.bio}
                    </p>
                  )}
                </div>
              </div>

              {!isProfileEditMode && profileSubView === 'main' && (
                <div className="grid grid-cols-4 gap-1.5">
                  <button
                    type="button"
                    onClick={() => {
                      setIsProfileDrawerOpen(false);
                      setStoriesReturnToOwnProfile(true);
                      setViewingAuthorUsername(profile.username);
                      setIsAuthorStoriesViewOpen(true);
                    }}
                    className="py-2 px-1.5 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200/70 dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700 flex flex-col items-center justify-center gap-0.5 transition-colors cursor-pointer"
                  >
                    <span className="text-[13px] font-semibold text-neutral-900 dark:text-neutral-100 tabular-nums">
                      {posts.length}
                    </span>
                    <span className="text-[10.5px] text-neutral-500 dark:text-neutral-400 whitespace-nowrap">
                      Hikoyalar
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setIsProfileDrawerOpen(false);
                      setIsSavedStoriesViewOpen(true);
                    }}
                    className="py-2 px-1.5 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200/70 dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700 flex flex-col items-center justify-center gap-0.5 transition-colors cursor-pointer"
                  >
                    <span className="text-[13px] font-semibold text-neutral-900 dark:text-neutral-100 tabular-nums">
                      {savedPostIds.length}
                    </span>
                    <span className="text-[10.5px] text-neutral-500 dark:text-neutral-400 whitespace-nowrap">
                      Saqlash
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setProfileSubView('following')}
                    className="py-2 px-1.5 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200/70 dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700 flex flex-col items-center justify-center gap-0.5 transition-colors cursor-pointer"
                  >
                    <span className="text-[13px] font-semibold text-neutral-900 dark:text-neutral-100 tabular-nums">
                      {subscribedAuthors.length}
                    </span>
                    <span className="text-[10.5px] text-neutral-500 dark:text-neutral-400 whitespace-nowrap">
                      Obunalar
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setProfileSubView('followers')}
                    className="py-2 px-1.5 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200/70 dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700 flex flex-col items-center justify-center gap-0.5 transition-colors cursor-pointer"
                  >
                    <span className="text-[13px] font-semibold text-neutral-900 dark:text-neutral-100 tabular-nums">
                      {followers.length}
                    </span>
                    <span className="text-[10.5px] text-neutral-500 dark:text-neutral-400 whitespace-nowrap">
                      Obunachi
                    </span>
                  </button>
                </div>
              )}
            </div>
          )}

          {isProfileEditMode ? (
            <div className="p-4 space-y-4">
              {/* Bio tahrirlash kartasi */}
              <div className="rounded-xl border border-neutral-200/80 dark:border-neutral-800 bg-neutral-50/60 dark:bg-neutral-900/50 px-3.5 py-2.5 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-medium text-neutral-500 dark:text-neutral-400">Bio</span>
                  <span
                    className={`text-[11px] tabular-nums ${
                      70 - profile.bio.length < 0 ? 'text-red-500 font-medium' : 'text-neutral-400'
                    }`}
                  >
                    {70 - profile.bio.length}
                  </span>
                </div>
                <textarea
                  rows={2}
                  maxLength={70}
                  value={profile.bio}
                  onChange={e => handleBioChange(e.target.value)}
                  placeholder="O'zingiz haqingizda yozing..."
                  className="w-full bg-transparent text-xs sm:text-[13px] text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 focus:outline-none resize-none leading-relaxed"
                />
                <p className="text-[11px] text-neutral-400 leading-relaxed pt-1 border-t border-neutral-200/60 dark:border-neutral-800">
                  Masalan: Toshkentlik 23 yoshli yozuvchi va dizayner.
                </p>
              </div>

              {/* Tahrirlash qatorlari: Ism, Foydalanuvchi nomi, Ism rangi */}
              <div className="rounded-xl border border-neutral-200/80 dark:border-neutral-800 divide-y divide-neutral-100 dark:divide-neutral-800/70 overflow-hidden">
                <button
                  type="button"
                  onClick={openEditNameModal}
                  className="w-full px-4 py-3.5 flex items-center justify-between hover:bg-neutral-50 dark:hover:bg-neutral-900/60 transition-colors cursor-pointer text-left"
                >
                  <div className="flex items-center space-x-3">
                    <CircleUserRound className="w-4.5 h-4.5 text-neutral-500 dark:text-neutral-400 stroke-[1.75]" />
                    <span className="text-xs sm:text-[13px] text-neutral-800 dark:text-neutral-200">Ism</span>
                  </div>
                  <span className="text-xs sm:text-[13px] text-[#2563eb] dark:text-[#60a5fa] font-medium truncate max-w-[165px]">
                    {profile.name}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setNewUsernameInput(profile.username.replace('@', ''));
                    setUsernameError('');
                    setIsEditingUsernameModal(true);
                  }}
                  className="w-full px-4 py-3.5 flex items-center justify-between hover:bg-neutral-50 dark:hover:bg-neutral-900/60 transition-colors cursor-pointer text-left"
                >
                  <div className="flex items-center space-x-3">
                    <AtSign className="w-4.5 h-4.5 text-neutral-500 dark:text-neutral-400 stroke-[1.75]" />
                    <span className="text-xs sm:text-[13px] text-neutral-800 dark:text-neutral-200">Foydalanuvchi nomi</span>
                  </div>
                  <span className="text-xs sm:text-[13px] text-[#2563eb] dark:text-[#60a5fa] font-medium truncate max-w-[165px]">
                    {profile.username}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setIsColorPreviewModalOpen(true)}
                  className="w-full px-4 py-3.5 flex items-center justify-between hover:bg-neutral-50 dark:hover:bg-neutral-900/60 transition-colors cursor-pointer text-left"
                >
                  <div className="flex items-center space-x-3">
                    <Palette className="w-4.5 h-4.5 text-neutral-500 dark:text-neutral-400 stroke-[1.75]" />
                    <span className="text-xs sm:text-[13px] text-neutral-800 dark:text-neutral-200">Ism rangi</span>
                  </div>
                  <span
                    className="w-5 h-5 rounded-md border border-neutral-200 dark:border-neutral-700 shrink-0"
                    style={{ backgroundColor: activeNamePreset ? activeNamePreset.primary : '#2563eb' }}
                  />
                </button>
              </div>
            </div>
          ) : profileSubView === 'following' ? (
            /* Obunalarim ro'yxati */
            <div className="divide-y divide-neutral-100 dark:divide-neutral-800/70">
              {subscribedAuthors.length === 0 ? (
                <div className="px-6 py-12 text-center space-y-1.5">
                  <p className="text-xs sm:text-[13px] text-neutral-500 dark:text-neutral-400">
                    Siz hali hech kimga obuna bo'lmagansiz.
                  </p>
                </div>
              ) : (
                subscribedAuthors.map(username => {
                  const known = KNOWN_AUTHORS[username];
                  const fallbackPost = allPosts.find(p => p.authorUsername === username);
                  const authorName = known?.name || fallbackPost?.authorName || username.replace('@', '');
                  const authorBio = known?.bio || fallbackPost?.bio || '';
                  const authorAvatar = known?.avatar || fallbackPost?.avatar;
                  const initials = authorName
                    .split(' ')
                    .map(n => n[0])
                    .filter(Boolean)
                    .join('')
                    .substring(0, 2)
                    .toUpperCase();

                  return (
                    <div
                      key={username}
                      onClick={() => {
                        setProfileSubView('main');
                        setIsProfileDrawerOpen(false);
                        openAuthorProfileByUsername(username);
                      }}
                      className="px-5 py-3.5 flex items-center justify-between gap-3 hover:bg-neutral-50 dark:hover:bg-neutral-900/50 transition-colors cursor-pointer"
                    >
                      <div className="flex items-center space-x-3 min-w-0 flex-1">
                        <div className="w-10 h-10 bg-neutral-200 dark:bg-neutral-800 rounded-xl flex items-center justify-center font-semibold text-xs text-neutral-800 dark:text-neutral-200 shrink-0 overflow-hidden">
                          {authorAvatar ? (
                            <img src={authorAvatar} alt={authorName} className="w-full h-full object-cover" />
                          ) : (
                            <span>{initials || 'M'}</span>
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p
                            className="text-xs sm:text-[13px] font-semibold text-neutral-900 dark:text-neutral-100 truncate"
                            style={getAuthorNameStyle(username)}
                          >
                            {authorName}
                          </p>
                          <p className="text-[11px] text-[#2563eb] dark:text-[#60a5fa] truncate">{username}</p>
                          {authorBio && (
                            <p className="text-[11px] text-neutral-400 truncate mt-0.5">{authorBio}</p>
                          )}
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={e => toggleSubscribe(e, username)}
                        className="px-2.5 py-1 rounded-lg text-[11px] font-medium bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors cursor-pointer shrink-0 whitespace-nowrap"
                      >
                        Obunadasiz
                      </button>
                    </div>
                  );
                })
              )}
            </div>
          ) : profileSubView === 'followers' ? (
            /* Obunachilarim ro'yxati */
            <div className="divide-y divide-neutral-100 dark:divide-neutral-800/70">
              {followers.length === 0 ? (
                <div className="px-6 py-12 text-center space-y-1.5">
                  <p className="text-xs sm:text-[13px] text-neutral-500 dark:text-neutral-400">
                    Hozircha obunachilaringiz yo'q.
                  </p>
                </div>
              ) : (
                followers.map(follower => {
                  const isSubbed = subscribedAuthors.includes(follower.username);
                  const initials = follower.name
                    .split(' ')
                    .map(n => n[0])
                    .filter(Boolean)
                    .join('')
                    .substring(0, 2)
                    .toUpperCase();

                  return (
                    <div
                      key={follower.username}
                      onClick={() => {
                        setProfileSubView('main');
                        setIsProfileDrawerOpen(false);
                        openAuthorProfileByUsername(follower.username);
                      }}
                      className="px-5 py-3.5 flex items-center justify-between gap-3 hover:bg-neutral-50 dark:hover:bg-neutral-900/50 transition-colors cursor-pointer"
                    >
                      <div className="flex items-center space-x-3 min-w-0 flex-1">
                        <div className="w-10 h-10 bg-neutral-200 dark:bg-neutral-800 rounded-xl flex items-center justify-center font-semibold text-xs text-neutral-800 dark:text-neutral-200 shrink-0 overflow-hidden">
                          {follower.avatar ? (
                            <img src={follower.avatar} alt={follower.name} className="w-full h-full object-cover" />
                          ) : (
                            <span>{initials || 'M'}</span>
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p
                            className="text-xs sm:text-[13px] font-semibold text-neutral-900 dark:text-neutral-100 truncate"
                            style={getAuthorNameStyle(follower.username)}
                          >
                            {follower.name}
                          </p>
                          <p className="text-[11px] text-[#2563eb] dark:text-[#60a5fa] truncate">{follower.username}</p>
                          {follower.bio && (
                            <p className="text-[11px] text-neutral-400 truncate mt-0.5">{follower.bio}</p>
                          )}
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={e => toggleSubscribe(e, follower.username)}
                        className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-colors cursor-pointer shrink-0 whitespace-nowrap ${
                          isSubbed
                            ? 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-700'
                            : 'bg-[#2563eb]/10 text-[#2563eb] dark:text-[#60a5fa] hover:bg-[#2563eb]/20'
                        }`}
                      >
                        {isSubbed ? 'Obunadasiz' : "Obuna bo'lish"}
                      </button>
                    </div>
                  );
                })
              )}
            </div>
          ) : profileSubView === 'blocked' ? (
            /* Bloklangan foydalanuvchilar ro'yxati */
            <div className="divide-y divide-neutral-100 dark:divide-neutral-800/70">
              {blockedUsers.length === 0 ? (
                <div className="px-6 py-12 text-center space-y-2">
                  <div className="w-11 h-11 rounded-xl bg-neutral-100 dark:bg-neutral-900 text-neutral-400 mx-auto flex items-center justify-center">
                    <Hand className="w-5 h-5" />
                  </div>
                  <p className="text-xs sm:text-[13px] font-medium text-neutral-700 dark:text-neutral-300">
                    Bloklangan foydalanuvchilar yo'q
                  </p>
                  <p className="text-[11px] text-neutral-400 leading-relaxed">
                    Muallif profiliga kirib, keraksiz foydalanuvchilarni bloklashingiz mumkin.
                  </p>
                </div>
              ) : (
                blockedUsers.map(username => {
                  const known = KNOWN_AUTHORS[username];
                  const fallbackPost = allPosts.find(p => p.authorUsername === username);
                  const authorName = known?.name || fallbackPost?.authorName || username.replace('@', '');
                  const authorAvatar = known?.avatar || fallbackPost?.avatar;
                  const initials = authorName
                    .split(' ')
                    .map(n => n[0])
                    .filter(Boolean)
                    .join('')
                    .substring(0, 2)
                    .toUpperCase();

                  return (
                    <div
                      key={username}
                      className="px-5 py-3.5 flex items-center justify-between gap-3 hover:bg-neutral-50 dark:hover:bg-neutral-900/50 transition-colors"
                    >
                      <div className="flex items-center space-x-3 min-w-0 flex-1">
                        <div className="w-10 h-10 bg-neutral-200 dark:bg-neutral-800 rounded-xl flex items-center justify-center font-semibold text-xs text-neutral-800 dark:text-neutral-200 shrink-0 overflow-hidden">
                          {authorAvatar ? (
                            <img src={authorAvatar} alt={authorName} className="w-full h-full object-cover" />
                          ) : (
                            <span>{initials || 'M'}</span>
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p
                            className="text-xs sm:text-[13px] font-semibold text-neutral-900 dark:text-neutral-100 truncate"
                            style={getAuthorNameStyle(username)}
                          >
                            {authorName}
                          </p>
                          <p className="text-[11px] text-neutral-400 truncate">{username}</p>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => toggleBlockUser(username)}
                        className="px-2.5 py-1 rounded-lg text-[11px] font-medium bg-[#2563eb]/10 text-[#2563eb] dark:text-[#60a5fa] hover:bg-[#2563eb]/20 transition-colors cursor-pointer shrink-0 whitespace-nowrap"
                      >
                        Blokdan chiqarish
                      </button>
                    </div>
                  );
                })
              )}
            </div>
          ) : profileSubView === 'sessions' ? (
            /* Faol seanslar ro'yxati */
            <div className="p-4 space-y-4">
              <div className="rounded-xl border border-neutral-200/80 dark:border-neutral-800 overflow-hidden">
                <div className="px-4 py-2.5 bg-neutral-50/80 dark:bg-neutral-900/60 border-b border-neutral-100 dark:border-neutral-800">
                  <p className="text-[11.5px] font-semibold text-neutral-700 dark:text-neutral-300">Ushbu qurilma</p>
                </div>
                <div className="divide-y divide-neutral-100 dark:divide-neutral-800/70">
                  {activeSessions
                    .filter(s => s.isCurrent)
                    .map(s => (
                      <div key={s.id} className="px-4 py-3.5 flex items-start space-x-3">
                        <div className="w-9 h-9 rounded-lg bg-[#2563eb]/10 text-[#2563eb] dark:text-[#60a5fa] flex items-center justify-center shrink-0 mt-0.5">
                          <MonitorSmartphone className="w-4.5 h-4.5" />
                        </div>
                        <div className="min-w-0 flex-1 space-y-0.5">
                          <p className="text-xs sm:text-[13px] font-semibold text-neutral-900 dark:text-neutral-100 truncate">
                            {s.device}
                          </p>
                          <p className="text-[11px] text-neutral-600 dark:text-neutral-300 truncate">{s.appInfo}</p>
                          <p className="text-[11px] text-neutral-400 truncate">
                            {s.location} · <span className="text-[#2563eb] dark:text-[#60a5fa] font-medium">{s.lastActive}</span>
                          </p>
                        </div>
                      </div>
                    ))}
                </div>
              </div>

              {activeSessions.some(s => !s.isCurrent) && (
                <div className="rounded-xl border border-neutral-200/80 dark:border-neutral-800 overflow-hidden">
                  <div className="px-4 py-2.5 bg-neutral-50/80 dark:bg-neutral-900/60 border-b border-neutral-100 dark:border-neutral-800 flex items-center justify-between gap-2">
                    <p className="text-[11.5px] font-semibold text-neutral-700 dark:text-neutral-300">Boshqa qurilmalar</p>
                    <button
                      type="button"
                      onClick={terminateAllOtherSessions}
                      className="text-[11px] font-medium text-red-500 hover:underline cursor-pointer whitespace-nowrap"
                    >
                      Barchasini yakunlash
                    </button>
                  </div>

                  <div className="divide-y divide-neutral-100 dark:divide-neutral-800/70">
                    {activeSessions
                      .filter(s => !s.isCurrent)
                      .map(s => (
                        <div key={s.id} className="px-4 py-3.5 flex items-start justify-between gap-3">
                          <div className="flex items-start space-x-3 min-w-0 flex-1">
                            <div className="w-9 h-9 rounded-lg bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 flex items-center justify-center shrink-0 mt-0.5">
                              <MonitorSmartphone className="w-4.5 h-4.5" />
                            </div>
                            <div className="min-w-0 flex-1 space-y-0.5">
                              <p className="text-xs sm:text-[13px] font-semibold text-neutral-900 dark:text-neutral-100 truncate">
                                {s.device}
                              </p>
                              <p className="text-[11px] text-neutral-600 dark:text-neutral-300 truncate">{s.appInfo}</p>
                              <p className="text-[11px] text-neutral-400 truncate">
                                {s.location} · {s.lastActive}
                              </p>
                            </div>
                          </div>

                          <button
                            type="button"
                            onClick={() => terminateSession(s.id)}
                            className="px-2.5 py-1 rounded-lg text-[11px] font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors cursor-pointer shrink-0 whitespace-nowrap"
                          >
                            Yakunlash
                          </button>
                        </div>
                      ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* Asosiy studio bo'limlari: Segmentli 3 ta qulay bo'lim */
            <div className="pb-6">
              {/* Segmentli navigatsiya */}
              <div className="px-4 pt-3.5 pb-1">
                <div className="grid grid-cols-3 gap-1 p-1 rounded-xl bg-neutral-100/90 dark:bg-neutral-900 border border-neutral-200/50 dark:border-neutral-800">
                  {[
                    { id: 'general' as const, label: 'Umumiy' },
                    { id: 'notifications' as const, label: 'Bildirishnoma' },
                    { id: 'security' as const, label: 'Xavfsizlik' },
                  ].map(tab => {
                    const active = profileTab === tab.id;
                    return (
                      <button
                        key={tab.id}
                        type="button"
                        onClick={() => setProfileTab(tab.id)}
                        className={`py-1.5 px-2 rounded-lg text-[11.5px] font-medium transition-all cursor-pointer whitespace-nowrap truncate ${
                          active
                            ? 'bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 shadow-xs'
                            : 'text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-200'
                        }`}
                      >
                        {tab.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {profileTab === 'general' ? (
                <div className="px-4 pt-3 space-y-4">
                  {/* Shaxsiy ma'lumotlar guruhi */}
                  <div className="rounded-xl border border-neutral-200/80 dark:border-neutral-800 bg-white dark:bg-neutral-900/30 divide-y divide-neutral-100 dark:divide-neutral-800/70 overflow-hidden">
                    <div className="px-4 py-3 space-y-0.5">
                      <span className="block text-[11px] text-neutral-400">Bio</span>
                      <p className="text-xs sm:text-[13px] text-neutral-900 dark:text-neutral-100 leading-relaxed">
                        {profile.bio || "Bio qo'shilmagan"}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={openEditNameModal}
                      className="w-full px-4 py-3 flex items-center justify-between gap-3 hover:bg-neutral-50 dark:hover:bg-neutral-900/60 transition-colors cursor-pointer text-left"
                    >
                      <div className="min-w-0 space-y-0.5">
                        <span className="block text-[11px] text-neutral-400">Ism</span>
                        <p
                          className="text-xs sm:text-[13px] font-medium text-neutral-900 dark:text-neutral-100 truncate"
                          style={getPresetTextStyle(activeNamePreset)}
                        >
                          {profile.name}
                        </p>
                      </div>
                      <ChevronRight className="w-4 h-4 text-neutral-400 shrink-0" />
                    </button>

                    <div className="px-4 py-3 flex items-center justify-between gap-3">
                      <button
                        type="button"
                        onClick={() => {
                          setNewUsernameInput(profile.username.replace('@', ''));
                          setUsernameError('');
                          setIsEditingUsernameModal(true);
                        }}
                        className="min-w-0 flex-1 text-left space-y-0.5 cursor-pointer group"
                      >
                        <span className="block text-[11px] text-neutral-400">Foydalanuvchi nomi</span>
                        <p className="text-xs sm:text-[13px] text-[#2563eb] dark:text-[#60a5fa] font-medium truncate group-hover:underline">
                          {profile.username}
                        </p>
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setQrCopied(false);
                          setIsQrModalOpen(true);
                        }}
                        className="px-2.5 py-1.5 rounded-lg bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200/80 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-200 text-[11px] font-medium inline-flex items-center gap-1.5 transition-colors cursor-pointer shrink-0 whitespace-nowrap"
                        title="QR kod"
                      >
                        <QrCode className="w-3.5 h-3.5" />
                        <span>QR</span>
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={() => setIsColorPreviewModalOpen(true)}
                      className="w-full px-4 py-3 flex items-center justify-between hover:bg-neutral-50 dark:hover:bg-neutral-900/60 transition-colors cursor-pointer text-left"
                    >
                      <div className="flex items-center space-x-3">
                        <Palette className="w-4.5 h-4.5 text-neutral-500 dark:text-neutral-400 stroke-[1.75]" />
                        <span className="text-xs sm:text-[13px] text-neutral-800 dark:text-neutral-200">
                          Ism rangi
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        {activeNamePreset && (
                          <span
                            className="w-4.5 h-4.5 rounded-md border border-neutral-200 dark:border-neutral-700"
                            style={{ backgroundColor: activeNamePreset.primary }}
                          />
                        )}
                        <ChevronRight className="w-4 h-4 text-neutral-400" />
                      </div>
                    </button>
                  </div>

                  {/* Interfeys masshtabi */}
                  <div className="rounded-xl border border-neutral-200/80 dark:border-neutral-800 bg-white dark:bg-neutral-900/30 p-3.5 space-y-3">
                    <div className="flex items-center justify-between gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          const next = !defaultInterfaceScale;
                          setDefaultInterfaceScale(next);
                          if (next) {
                            setInterfaceScale(100);
                          }
                        }}
                        className="flex items-center justify-between w-full cursor-pointer text-left"
                      >
                        <div className="flex items-center space-x-2.5">
                          <Eye className="w-4 h-4 text-neutral-500 dark:text-neutral-400 stroke-[1.75]" />
                          <span className="text-xs sm:text-[13px] text-neutral-800 dark:text-neutral-200">
                            Standart masshtab
                          </span>
                        </div>
                        <span
                          className={`relative inline-flex h-4.5 w-8.5 shrink-0 items-center rounded-full transition-colors ${
                            defaultInterfaceScale ? 'bg-neutral-900 dark:bg-white' : 'bg-neutral-300 dark:bg-neutral-700'
                          }`}
                        >
                          <span
                            className={`inline-block h-3.5 w-3.5 rounded-full shadow-xs transition-transform ${
                              defaultInterfaceScale
                                ? 'translate-x-4.5 bg-white dark:bg-neutral-900'
                                : 'translate-x-0.5 bg-white'
                            }`}
                          />
                        </span>
                      </button>
                    </div>

                    {(() => {
                      const effectiveScale = defaultInterfaceScale ? 100 : interfaceScale;
                      const scalePercent = ((effectiveScale - 75) / (200 - 75)) * 100;
                      return (
                        <div className="flex items-center gap-3 pt-1">
                          <div className="relative flex-1 h-5 flex items-center select-none">
                            <div className="w-full h-[3px] rounded-full bg-neutral-200 dark:bg-neutral-700 overflow-hidden">
                              <div
                                className="h-full rounded-full bg-neutral-900 dark:bg-neutral-100 transition-[width] duration-75"
                                style={{ width: `${scalePercent}%` }}
                              />
                            </div>
                            <div
                              className="pointer-events-none absolute top-1/2 -translate-y-1/2 w-3.5 h-3.5 rounded-full bg-neutral-900 dark:bg-white shadow-xs transition-[left] duration-75"
                              style={{ left: `calc(${scalePercent}% - ${(scalePercent / 100) * 14}px)` }}
                            />
                            <input
                              type="range"
                              min={75}
                              max={200}
                              step={5}
                              value={effectiveScale}
                              aria-label="Interfeys masshtabi"
                              onChange={e => {
                                const nextScale = Math.min(200, Math.max(75, Number(e.target.value)));
                                setInterfaceScale(nextScale);
                                setDefaultInterfaceScale(nextScale === 100);
                              }}
                              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10 m-0"
                            />
                          </div>
                          <span className="text-xs font-medium tabular-nums text-neutral-700 dark:text-neutral-300 w-10 text-right shrink-0">
                            {effectiveScale}%
                          </span>
                        </div>
                      );
                    })()}
                  </div>

                  {/* Hisobdan chiqish / O'chirish */}
                  <div className="rounded-xl border border-neutral-200/80 dark:border-neutral-800 divide-y divide-neutral-100 dark:divide-neutral-800/70 overflow-hidden">
                    <button
                      type="button"
                      onClick={handleLogout}
                      className="w-full px-4 py-3 flex items-center space-x-3 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-900/60 transition-colors cursor-pointer text-left"
                    >
                      <LogOut className="w-4 h-4 stroke-[1.75]" />
                      <span className="text-xs sm:text-[13px] font-medium">Hisobdan chiqish</span>
                    </button>

                    <button
                      type="button"
                      onClick={openDeleteAccountModal}
                      className="w-full px-4 py-3 flex items-center space-x-3 text-red-500 hover:bg-red-50/70 dark:hover:bg-red-950/25 transition-colors cursor-pointer text-left"
                    >
                      <Trash2 className="w-4 h-4 stroke-[1.75]" />
                      <span className="text-xs sm:text-[13px] font-medium">Hisobni o&apos;chirish</span>
                    </button>
                  </div>
                </div>
              ) : profileTab === 'notifications' ? (
                <div className="px-4 pt-3 space-y-4">
                  {/* Minimalist Bildirishnoma Namuna Karta (Telegram yashil fonisiz) */}
                  <div className="rounded-xl border border-neutral-200/80 dark:border-neutral-800 bg-neutral-50/90 dark:bg-neutral-900/60 p-3.5 space-y-3">
                    <div className="flex items-center justify-between text-[11px] text-neutral-500 dark:text-neutral-400">
                      <span className="font-medium">Xabarnoma ko&apos;rinishi</span>
                      <span>
                        {notifCorner === 'top-left'
                          ? 'Yuqori chap'
                          : notifCorner === 'top-right'
                          ? "Yuqori o'ng"
                          : notifCorner === 'bottom-left'
                          ? 'Pastki chap'
                          : "Pastki o'ng"}
                      </span>
                    </div>

                    <div className="bg-white dark:bg-neutral-950 border border-neutral-200/80 dark:border-neutral-800 rounded-xl p-3 shadow-xs flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center font-semibold text-xs text-neutral-800 dark:text-neutral-200 shrink-0 overflow-hidden">
                        {profile.avatar ? (
                          <img src={profile.avatar} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <span>{profileInitials}</span>
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-[12.5px] font-semibold text-neutral-900 dark:text-neutral-100 truncate leading-snug">
                          {showNotifName ? profile.name : 'Yangi bildirishnoma'}
                        </p>
                        <p className="text-[11.5px] text-neutral-500 dark:text-neutral-400 truncate leading-snug">
                          {showNotifText ? "Yangi hikoyangiz juda yoqdi!" : 'Sizda yangi xabar bor'}
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-1.5">
                      <button
                        type="button"
                        onClick={() => setShowNotifName(prev => !prev)}
                        className={`px-2.5 py-1.5 rounded-lg border text-[11.5px] font-medium flex items-center justify-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap ${
                          showNotifName
                            ? 'bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 border-neutral-900 dark:border-white'
                            : 'bg-white dark:bg-neutral-900 text-neutral-600 dark:text-neutral-300 border-neutral-200 dark:border-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-800'
                        }`}
                      >
                        <Check className={`w-3.5 h-3.5 ${showNotifName ? 'opacity-100' : 'opacity-35'}`} />
                        <span>Ismni ko&apos;rsatish</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setShowNotifText(prev => !prev)}
                        className={`px-2.5 py-1.5 rounded-lg border text-[11.5px] font-medium flex items-center justify-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap ${
                          showNotifText
                            ? 'bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 border-neutral-900 dark:border-white'
                            : 'bg-white dark:bg-neutral-900 text-neutral-600 dark:text-neutral-300 border-neutral-200 dark:border-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-800'
                        }`}
                      >
                        <Check className={`w-3.5 h-3.5 ${showNotifText ? 'opacity-100' : 'opacity-35'}`} />
                        <span>Matnni ko&apos;rsatish</span>
                      </button>
                    </div>
                  </div>

                  {/* Ish stoli bildirishnomalari va Ovoz */}
                  <div className="rounded-xl border border-neutral-200/80 dark:border-neutral-800 bg-white dark:bg-neutral-900/30 divide-y divide-neutral-100 dark:divide-neutral-800/70 overflow-hidden">
                    <div>
                      {isInIframe && notificationPermission !== 'granted' && notificationPermission !== 'unsupported' ? (
                        <a
                          href={typeof window !== 'undefined' ? window.location.href : '/'}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-full px-4 py-3 flex items-center justify-between hover:bg-neutral-50 dark:hover:bg-neutral-900/60 transition-colors cursor-pointer text-left"
                        >
                          <div className="flex items-center space-x-3">
                            <Bell className="w-4.5 h-4.5 text-neutral-500 dark:text-neutral-400 stroke-[1.75]" />
                            <div>
                              <span className="block text-xs sm:text-[13px] text-neutral-800 dark:text-neutral-200">
                                Ish stoli bildirishnomalari
                              </span>
                              <span className="inline-flex items-center gap-1 text-[10.5px] text-[#2563eb] dark:text-[#60a5fa]">
                                <span>Alohida oynada ruxsat berish</span>
                                <ExternalLink className="w-3 h-3" />
                              </span>
                            </div>
                          </div>
                          <span className="relative inline-flex h-4.5 w-8.5 shrink-0 items-center rounded-full bg-neutral-300 dark:bg-neutral-700 transition-colors">
                            <span className="inline-block h-3.5 w-3.5 translate-x-0.5 rounded-full bg-white shadow-xs transition-transform" />
                          </span>
                        </a>
                      ) : (
                        <button
                          type="button"
                          onClick={() => {
                            if (notificationPermission === 'granted') {
                              setDesktopNotificationsEnabled(prev => !prev);
                            } else if (notificationPermission === 'denied') {
                              setIsNotificationBlockedHelpOpen(prev => !prev);
                            } else {
                              void requestSystemNotifications();
                            }
                          }}
                          className="w-full px-4 py-3 flex items-center justify-between hover:bg-neutral-50 dark:hover:bg-neutral-900/60 transition-colors cursor-pointer text-left"
                        >
                          <div className="flex items-center space-x-3">
                            <Bell className="w-4.5 h-4.5 text-neutral-500 dark:text-neutral-400 stroke-[1.75]" />
                            <span className="text-xs sm:text-[13px] text-neutral-800 dark:text-neutral-200">
                              Ish stoli bildirishnomalari
                            </span>
                          </div>
                          <span
                            className={`relative inline-flex h-4.5 w-8.5 shrink-0 items-center rounded-full transition-colors ${
                              notificationPermission === 'granted' && desktopNotificationsEnabled
                                ? 'bg-neutral-900 dark:bg-white'
                                : 'bg-neutral-300 dark:bg-neutral-700'
                            }`}
                          >
                            <span
                              className={`inline-block h-3.5 w-3.5 rounded-full shadow-xs transition-transform ${
                                notificationPermission === 'granted' && desktopNotificationsEnabled
                                  ? 'translate-x-4.5 bg-white dark:bg-neutral-900'
                                  : 'translate-x-0.5 bg-white'
                              }`}
                            />
                          </span>
                        </button>
                      )}

                      {!isInIframe && notificationPermission === 'denied' && isNotificationBlockedHelpOpen && (
                        <div className="px-4 pb-3 pt-1 text-[11px] text-neutral-500 dark:text-neutral-400 leading-relaxed bg-neutral-50/70 dark:bg-neutral-950/40">
                          Brauzer manzil satri chap tomonidagi qulf/sozlama belgisini bosing va{' '}
                          <span className="font-medium text-neutral-700 dark:text-neutral-300">Bildirishnomalar</span>ga ruxsat bering.
                        </div>
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        const next = !allowSound;
                        setAllowSound(next);
                        if (next) {
                          const targetVol = notifVolume > 0 ? notifVolume : 100;
                          if (notifVolume === 0) setNotifVolume(targetVol);
                          playNotificationSound(targetVol);
                        }
                      }}
                      className="w-full px-4 py-3 flex items-center justify-between hover:bg-neutral-50 dark:hover:bg-neutral-900/60 transition-colors cursor-pointer text-left"
                    >
                      <div className="flex items-center space-x-3">
                        <Volume2 className="w-4.5 h-4.5 text-neutral-500 dark:text-neutral-400 stroke-[1.75]" />
                        <span className="text-xs sm:text-[13px] text-neutral-800 dark:text-neutral-200">
                          Ovozga ruxsat berish
                        </span>
                      </div>
                      <span
                        className={`relative inline-flex h-4.5 w-8.5 shrink-0 items-center rounded-full transition-colors ${
                          allowSound ? 'bg-neutral-900 dark:bg-white' : 'bg-neutral-300 dark:bg-neutral-700'
                        }`}
                      >
                        <span
                          className={`inline-block h-3.5 w-3.5 rounded-full shadow-xs transition-transform ${
                            allowSound ? 'translate-x-4.5 bg-white dark:bg-neutral-900' : 'translate-x-0.5 bg-white'
                          }`}
                        />
                      </span>
                    </button>

                    {(() => {
                      const displayVolume = allowSound ? notifVolume : 0;
                      return (
                        <div className="px-4 py-3 space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-medium text-neutral-700 dark:text-neutral-300">
                              Ovoz balandligi
                            </span>
                            <span className="text-xs font-medium tabular-nums text-neutral-600 dark:text-neutral-400">
                              {displayVolume}%
                            </span>
                          </div>
                          <div className="relative h-5 flex items-center select-none">
                            <div className="w-full h-[3px] rounded-full bg-neutral-200 dark:bg-neutral-700 overflow-hidden">
                              <div
                                className="h-full rounded-full bg-neutral-900 dark:bg-neutral-100 transition-[width] duration-75"
                                style={{ width: `${displayVolume}%` }}
                              />
                            </div>
                            <div
                              className="pointer-events-none absolute top-1/2 -translate-y-1/2 w-3.5 h-3.5 rounded-full bg-neutral-900 dark:bg-white shadow-xs transition-[left] duration-75"
                              style={{ left: `calc(${displayVolume}% - ${(displayVolume / 100) * 14}px)` }}
                            />
                            <input
                              type="range"
                              min={0}
                              max={100}
                              step={1}
                              value={displayVolume}
                              aria-label="Ovoz balandligi"
                              onChange={e => {
                                const nextVol = Math.min(100, Math.max(0, Number(e.target.value)));
                                setNotifVolume(nextVol);
                                if (nextVol === 0) {
                                  setAllowSound(false);
                                } else if (!allowSound) {
                                  setAllowSound(true);
                                }
                              }}
                              onPointerUp={e => {
                                const nextVol = Math.min(100, Math.max(0, Number(e.currentTarget.value)));
                                if (nextVol > 0) {
                                  playNotificationSound(nextVol);
                                }
                              }}
                              onKeyUp={e => {
                                if (['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Home', 'End'].includes(e.key)) {
                                  const nextVol = Math.min(100, Math.max(0, Number(e.currentTarget.value)));
                                  if (nextVol > 0) {
                                    playNotificationSound(nextVol);
                                  }
                                }
                              }}
                              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10 m-0"
                            />
                          </div>
                        </div>
                      );
                    })()}
                  </div>

                  {/* Minimalist Joylashuv va Soni boshqaruvi (Kompyuter rasmsiz, aniq panjarali) */}
                  <div className="rounded-xl border border-neutral-200/80 dark:border-neutral-800 bg-white dark:bg-neutral-900/30 p-3.5 space-y-4">
                    <div className="space-y-2">
                      <p className="text-xs font-medium text-neutral-700 dark:text-neutral-300">
                        Ekrandagi joylashuvi
                      </p>
                      <div className="rounded-xl border border-neutral-200/80 dark:border-neutral-800 bg-neutral-100/70 dark:bg-neutral-900 p-2 grid grid-cols-2 gap-2">
                        {[
                          { id: 'top-left' as const, label: 'Yuqori chap' },
                          { id: 'top-right' as const, label: "Yuqori o'ng" },
                          { id: 'bottom-left' as const, label: 'Pastki chap' },
                          { id: 'bottom-right' as const, label: "Pastki o'ng" },
                        ].map(item => {
                          const active = notifCorner === item.id;
                          return (
                            <button
                              key={item.id}
                              type="button"
                              onClick={() => setNotifCorner(item.id)}
                              className={`h-11 px-3 rounded-lg text-[11.5px] font-medium flex items-center justify-between transition-all cursor-pointer border ${
                                active
                                  ? 'bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 border-neutral-900 dark:border-white shadow-xs'
                                  : 'bg-white dark:bg-neutral-950 text-neutral-600 dark:text-neutral-400 border-neutral-200/70 dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700'
                              }`}
                            >
                              <span className="truncate">{item.label}</span>
                              <span
                                className={`w-2 h-2 rounded-xs shrink-0 ${
                                  active ? 'bg-white dark:bg-neutral-900' : 'bg-neutral-300 dark:bg-neutral-700'
                                }`}
                              />
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <p className="text-xs font-medium text-neutral-700 dark:text-neutral-300">
                        Bir vaqtdagi bildirishnomalar soni
                      </p>
                      <div className="grid grid-cols-5 gap-1 p-1 rounded-lg bg-neutral-100 dark:bg-neutral-900">
                        {[1, 2, 3, 4, 5].map(num => {
                          const active = notifCount === num;
                          return (
                            <button
                              key={num}
                              type="button"
                              onClick={() => setNotifCount(num)}
                              className={`py-1.5 rounded-md text-xs tabular-nums transition-colors cursor-pointer ${
                                active
                                  ? 'bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white font-semibold shadow-xs'
                                  : 'text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-200'
                              }`}
                            >
                              {num}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                /* Tab: Xavfsizlik */
                <div className="px-4 pt-3 space-y-4">
                  <div className="rounded-xl border border-neutral-200/80 dark:border-neutral-800 bg-white dark:bg-neutral-900/30 divide-y divide-neutral-100 dark:divide-neutral-800/70 overflow-hidden">
                    <button
                      type="button"
                      onClick={openChangePasswordModal}
                      className="w-full px-4 py-3.5 flex items-center justify-between hover:bg-neutral-50 dark:hover:bg-neutral-900/60 transition-colors cursor-pointer text-left"
                    >
                      <div className="flex items-center space-x-3">
                        <Lock className="w-4.5 h-4.5 text-neutral-500 dark:text-neutral-400 stroke-[1.75]" />
                        <span className="text-xs sm:text-[13px] text-neutral-800 dark:text-neutral-200">
                          Parolni o&apos;zgartirish
                        </span>
                      </div>
                      <span className="text-xs text-[#2563eb] dark:text-[#60a5fa] font-medium whitespace-nowrap">
                        {isPasswordCustomized ? "O'zgartirish" : "O'rnatilgan"}
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setEmailInput('');
                        setEmailError('');
                        setEmailCodeError('');
                        setEmailCodeDigits(['', '', '', '', '', '']);
                        setLoginEmailStep('enter');
                        setIsEditingEmailModal(true);
                      }}
                      className="w-full px-4 py-3.5 flex items-center justify-between hover:bg-neutral-50 dark:hover:bg-neutral-900/60 transition-colors cursor-pointer text-left"
                    >
                      <div className="flex items-center space-x-3">
                        <Mail className="w-4.5 h-4.5 text-neutral-500 dark:text-neutral-400 stroke-[1.75]" />
                        <span className="text-xs sm:text-[13px] text-neutral-800 dark:text-neutral-200">
                          Kirish emaili
                        </span>
                      </div>
                      <span className="text-xs text-neutral-500 dark:text-neutral-400 font-medium truncate max-w-[165px]">
                        {maskEmail(loginEmail)}
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setProfileSubView('blocked')}
                      className="w-full px-4 py-3.5 flex items-center justify-between hover:bg-neutral-50 dark:hover:bg-neutral-900/60 transition-colors cursor-pointer text-left"
                    >
                      <div className="flex items-center space-x-3">
                        <Hand className="w-4.5 h-4.5 text-neutral-500 dark:text-neutral-400 stroke-[1.75]" />
                        <span className="text-xs sm:text-[13px] text-neutral-800 dark:text-neutral-200">
                          Bloklangan foydalanuvchilar
                        </span>
                      </div>
                      <div className="flex items-center space-x-1.5">
                        <span className="text-xs text-neutral-500 dark:text-neutral-400 font-medium tabular-nums">
                          {blockedUsers.length}
                        </span>
                        <ChevronRight className="w-4 h-4 text-neutral-400" />
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setProfileSubView('sessions')}
                      className="w-full px-4 py-3.5 flex items-center justify-between hover:bg-neutral-50 dark:hover:bg-neutral-900/60 transition-colors cursor-pointer text-left"
                    >
                      <div className="flex items-center space-x-3">
                        <MonitorSmartphone className="w-4.5 h-4.5 text-neutral-500 dark:text-neutral-400 stroke-[1.75]" />
                        <span className="text-xs sm:text-[13px] text-neutral-800 dark:text-neutral-200">
                          Faol seanslar
                        </span>
                      </div>
                      <div className="flex items-center space-x-1.5">
                        <span className="text-xs text-neutral-500 dark:text-neutral-400 font-medium tabular-nums">
                          {activeSessions.length}
                        </span>
                        <ChevronRight className="w-4 h-4 text-neutral-400" />
                      </div>
                    </button>
                  </div>

                  <p className="px-1 text-[11px] text-neutral-400 dark:text-neutral-500 leading-relaxed">
                    Kirish emaili va parolni tasdiqlash orqali hisobingizni himoyalang hamda keraksiz faol qurilmalarni bir bosishda yakunlang.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Mening profilim uchun ism rangidagi markaziy QR Kod Modali */}
      {isQrModalOpen && (() => {
        const selfQrColor = getAuthorQrColor(profile.username);
        return (
          <div
            onClick={() => setIsQrModalOpen(false)}
            className="fixed inset-0 z-[75] bg-black/45 backdrop-blur-[1px] flex items-center justify-center p-4 font-sans select-none"
          >
            <div
              onClick={e => e.stopPropagation()}
              className="relative w-full max-w-[310px] rounded-2xl bg-[#1f1f1f] shadow-2xl px-5 pt-11 pb-4 flex flex-col items-center justify-between"
            >
              <button
                type="button"
                onClick={() => setIsQrModalOpen(false)}
                className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
                aria-label="Yopish"
              >
                <X className="w-4.5 h-4.5" />
              </button>

              <div className="bg-white rounded-[22px] shadow-xl px-5 pt-5 pb-4 w-[210px] flex flex-col items-center">
                {qrMatrix.size > 0 && (
                  <svg
                    viewBox={`0 0 ${qrMatrix.size} ${qrMatrix.size}`}
                    className="w-full h-auto"
                    shapeRendering="geometricPrecision"
                  >
                    {[
                      { x: 0, y: 0 },
                      { x: qrMatrix.size - 7, y: 0 },
                      { x: 0, y: qrMatrix.size - 7 },
                    ].map((pos, idx) => (
                      <g key={idx}>
                        <rect
                          x={pos.x + 0.5}
                          y={pos.y + 0.5}
                          width={6}
                          height={6}
                          rx={1.8}
                          fill="none"
                          stroke={selfQrColor}
                          strokeWidth={1}
                        />
                        <rect
                          x={pos.x + 2}
                          y={pos.y + 2}
                          width={3}
                          height={3}
                          rx={1}
                          fill={selfQrColor}
                        />
                      </g>
                    ))}

                    {qrMatrix.rows.map((row, r) =>
                      row.map((on, c) => {
                        if (!on) return null;
                        const inTopLeft = r < 7 && c < 7;
                        const inTopRight = r < 7 && c >= qrMatrix.size - 7;
                        const inBottomLeft = r >= qrMatrix.size - 7 && c < 7;
                        if (inTopLeft || inTopRight || inBottomLeft) return null;

                        return (
                          <rect
                            key={`${r}-${c}`}
                            x={c + 0.06}
                            y={r + 0.06}
                            width={0.88}
                            height={0.88}
                            rx={0.35}
                            fill={selfQrColor}
                          />
                        );
                      })
                    )}
                  </svg>
                )}

                <p
                  className="mt-2 text-center font-bold tracking-wide uppercase text-sm truncate max-w-full"
                  style={{ color: selfQrColor }}
                >
                  {profile.username}
                </p>
              </div>

              <div className="mt-4 w-full flex items-center justify-between px-1">
                <button
                  type="button"
                  onClick={async () => {
                    try {
                      await navigator.clipboard.writeText(qrMatrix.targetUrl);
                      setQrCopied(true);
                      setTimeout(() => setQrCopied(false), 1800);
                    } catch {
                      // ignore clipboard failure
                    }
                  }}
                  className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
                  title="Havolani nusxalash"
                  aria-label="Havolani nusxalash"
                >
                  {qrCopied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                </button>

                <button
                  type="button"
                  onClick={() => shareOrDownloadQrCard(qrMatrix, profile.name, profile.username, selfQrColor)}
                  className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
                  title="QR kodni ulashish yoki yuklab olish"
                  aria-label="QR kodni ulashish yoki yuklab olish"
                >
                  <Share2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        );
      })()}

      {/* Ism rangi ko'rinishi modali */}
      {isColorPreviewModalOpen && (
        <div
          onClick={() => setIsColorPreviewModalOpen(false)}
          className="fixed inset-0 z-[75] bg-black/45 dark:bg-black/65 backdrop-blur-xs flex items-center justify-center p-4 font-sans"
        >
          <div
            onClick={e => e.stopPropagation()}
            className="bg-white dark:bg-neutral-900 border border-neutral-100 dark:border-neutral-800 rounded-2xl w-full max-w-[360px] shadow-2xl overflow-hidden"
          >
            {/* Sarlavha */}
            <div className="px-5 pt-4 pb-3 flex items-center justify-between">
              <h3 className="text-[15px] font-semibold text-neutral-900 dark:text-neutral-100">
                Ism rangi
              </h3>
              <button
                type="button"
                onClick={() => setIsColorPreviewModalOpen(false)}
                className="p-1 text-neutral-400 hover:text-neutral-800 dark:hover:text-neutral-200 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
                aria-label="Yopish"
              >
                <X className="w-4.5 h-4.5" />
              </button>
            </div>

            {/* Ko'rinish namunasi maydoni (faqat Ism) */}
            <div className="bg-neutral-100/85 dark:bg-neutral-950/75 border-y border-neutral-100 dark:border-neutral-800 py-7 px-5 flex flex-col items-center justify-center">
              <div className="w-full max-w-[280px] bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 rounded-2xl p-3.5 shadow-sm flex items-center gap-3">
                <div className="w-10 h-10 rounded-full shrink-0 bg-neutral-200 dark:bg-neutral-800 overflow-hidden flex items-center justify-center text-xs font-bold text-neutral-800 dark:text-neutral-200">
                  {profile.avatar ? (
                    <img src={profile.avatar} alt={profile.name} className="w-full h-full object-cover" />
                  ) : (
                    <span>{profileInitials}</span>
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p
                    className="text-sm font-semibold text-neutral-900 dark:text-neutral-100 truncate"
                    style={getPresetTextStyle(activeNamePreset)}
                  >
                    {profile.name}
                  </p>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400 truncate mt-0.5">
                    {profile.bio || 'Sizning ismingiz shunday ko‘rinadi'}
                  </p>
                </div>
              </div>
            </div>

            {/* 8 ta bir xil rang palitrasi */}
            <div className="px-5 py-4">
              <div className="grid grid-cols-8 gap-2 justify-items-center">
                {PROFILE_COLOR_PRESETS.map(preset => {
                  const isActive = activeNamePreset?.id === preset.id;
                  return (
                    <button
                      key={preset.id}
                      type="button"
                      onClick={() => setProfileNameColorId(preset.id)}
                      className={`w-8 h-8 rounded-full transition-transform cursor-pointer flex items-center justify-center ${
                        isActive
                          ? 'ring-2 ring-[#3390ec] ring-offset-2 ring-offset-white dark:ring-offset-neutral-900 scale-105'
                          : 'hover:scale-105'
                      }`}
                      style={{ backgroundColor: preset.primary }}
                      aria-label={`Rang ${preset.id}`}
                    >
                      {isActive && <Check className="w-3.5 h-3.5 text-white drop-shadow-sm stroke-[2.75]" />}
                    </button>
                  );
                })}
              </div>

              <div className="mt-4 pt-3 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setProfileNameColorId('')}
                  className="text-xs text-neutral-500 hover:text-neutral-800 dark:text-neutral-400 dark:hover:text-neutral-200 transition-colors cursor-pointer"
                >
                  Standart rangni qaytarish
                </button>
                <button
                  type="button"
                  onClick={() => setIsColorPreviewModalOpen(false)}
                  className="px-4 py-1.5 rounded-lg bg-[#3390ec] hover:bg-[#2b7fd4] text-white text-xs font-medium transition-colors cursor-pointer"
                >
                  Saqlash
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Ismni tahrirlash modali (O'zbek tilida) */}
      {isEditingNameModal && (
        <div
          onClick={() => setIsEditingNameModal(false)}
          className="fixed inset-0 bg-black/40 backdrop-blur-xs z-60 flex items-center justify-center p-4"
        >
          <div
            onClick={e => e.stopPropagation()}
            className="bg-white dark:bg-neutral-900 border border-neutral-100 dark:border-neutral-800 rounded-xl w-full max-w-xs p-5 shadow-2xl space-y-5 font-sans"
          >
            <h3 className="font-semibold text-base text-neutral-900 dark:text-neutral-100">Ismni tahrirlash</h3>

            <div className="space-y-4">
              <div>
                <label className="block text-[11px] font-medium text-[#3390ec] mb-1">Ism</label>
                <input
                  type="text"
                  autoFocus
                  value={editFirstName}
                  onChange={e => {
                    setEditFirstName(e.target.value);
                    if (nameError) setNameError('');
                  }}
                  onKeyDown={e => e.key === 'Enter' && saveName()}
                  className="w-full pb-1.5 bg-transparent border-b-2 border-[#3390ec] text-sm text-neutral-900 dark:text-neutral-100 focus:outline-none"
                />
                {nameError && <p className="text-[11px] text-red-500 mt-1">{nameError}</p>}
              </div>

              <div>
                <label className="block text-[11px] font-medium text-neutral-400 mb-1">Familiya</label>
                <input
                  type="text"
                  value={editLastName}
                  onChange={e => setEditLastName(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && saveName()}
                  placeholder="Familiya"
                  className="w-full pb-1.5 bg-transparent border-b border-neutral-200 dark:border-neutral-700 focus:border-[#3390ec] text-sm text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 focus:outline-none transition-colors"
                />
              </div>
            </div>

            <div className="flex justify-end space-x-2 pt-1">
              <button
                onClick={() => setIsEditingNameModal(false)}
                className="px-3.5 py-1.5 text-xs font-medium text-[#3390ec] hover:bg-blue-50 dark:hover:bg-neutral-800 rounded-lg cursor-pointer transition-colors"
              >
                Bekor qilish
              </button>
              <button
                onClick={saveName}
                className="px-3.5 py-1.5 text-xs font-medium text-[#3390ec] hover:bg-blue-50 dark:hover:bg-neutral-800 rounded-lg cursor-pointer transition-colors"
              >
                Saqlash
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Foydalanuvchi nomini tahrirlash modali (O'zbek tilida) */}
      {isEditingUsernameModal && (
        <div
          onClick={() => setIsEditingUsernameModal(false)}
          className="fixed inset-0 bg-black/40 backdrop-blur-xs z-60 flex items-center justify-center p-4"
        >
          <div
            onClick={e => e.stopPropagation()}
            className="bg-white dark:bg-neutral-900 border border-neutral-100 dark:border-neutral-800 rounded-xl w-full max-w-xs overflow-hidden shadow-2xl font-sans"
          >
            <div className="p-5 space-y-4">
              <h3 className="font-semibold text-base text-neutral-900 dark:text-neutral-100">Foydalanuvchi nomi</h3>
              <div>
                <label className="block text-[11px] font-medium text-[#3390ec] mb-1">@foydalanuvchi_nomi</label>
                <input
                  type="text"
                  autoFocus
                  value={newUsernameInput}
                  onChange={e => {
                    setNewUsernameInput(e.target.value);
                    if (usernameError) setUsernameError('');
                  }}
                  onKeyDown={e => e.key === 'Enter' && saveUsername()}
                  placeholder="foydalanuvchi_nomi"
                  className="w-full pb-1.5 bg-transparent border-b-2 border-[#3390ec] text-sm text-neutral-900 dark:text-neutral-100 focus:outline-none"
                />
                {usernameError && <p className="text-[11px] text-red-500 mt-1">{usernameError}</p>}
              </div>
            </div>

            <div className="bg-neutral-50 dark:bg-neutral-950/50 px-5 pt-4 pb-3 border-t border-neutral-100 dark:border-neutral-800 space-y-3">
              <p className="text-[11px] text-neutral-400 leading-relaxed">
                Siz o'zingizga foydalanuvchi nomini tanlashingiz mumkin. Shunday qilsangiz, boshqalar sizni shu nom orqali osongina topa oladi.
                <br /><br />
                Lotin harflari (a-z), raqamlar (0-9) va pastki chiziq (_) dan foydalanish mumkin. Minimal uzunlik — 5 ta belgi.
              </p>
              <div className="flex justify-end space-x-2">
                <button
                  onClick={() => setIsEditingUsernameModal(false)}
                  className="px-3.5 py-1.5 text-xs font-medium text-[#3390ec] hover:bg-blue-50 dark:hover:bg-neutral-800 rounded-lg cursor-pointer transition-colors"
                >
                  Bekor qilish
                </button>
                <button
                  onClick={saveUsername}
                  className="px-3.5 py-1.5 text-xs font-medium text-[#3390ec] hover:bg-blue-50 dark:hover:bg-neutral-800 rounded-lg cursor-pointer transition-colors"
                >
                  Saqlash
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2-bosqichli Kirish elektron pochtasini o'zgartirish modali (Telegram uslubida) */}
      {isEditingEmailModal && (
        <div
          onClick={() => setIsEditingEmailModal(false)}
          className="fixed inset-0 bg-black/40 backdrop-blur-xs z-60 flex items-center justify-center p-4"
        >
          <div
            onClick={e => e.stopPropagation()}
            className="bg-white dark:bg-neutral-900 border border-neutral-100 dark:border-neutral-800 rounded-xl w-full max-w-[360px] overflow-hidden shadow-2xl font-sans"
          >
            {/* Modal sarlavha paneli */}
            <div className="px-4 py-3.5 border-b border-neutral-100 dark:border-neutral-800 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <button
                  type="button"
                  onClick={() => {
                    if (loginEmailStep === 'verify') {
                      setLoginEmailStep('enter');
                      setEmailCodeError('');
                    } else {
                      setIsEditingEmailModal(false);
                    }
                  }}
                  className="p-1 -ml-1 text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors cursor-pointer"
                  aria-label="Orqaga"
                >
                  <ArrowLeft className="w-4.5 h-4.5" />
                </button>
                <h3 className="font-semibold text-[15px] text-neutral-900 dark:text-neutral-100">
                  Kirish emaili
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsEditingEmailModal(false)}
                className="p-1 text-neutral-400 hover:text-neutral-800 dark:hover:text-neutral-200 transition-colors cursor-pointer"
                aria-label="Yopish"
              >
                <X className="w-4.5 h-4.5" />
              </button>
            </div>

            <div className="px-7 py-6 flex flex-col items-center text-center">
              {/* Pochta qutisi SVG illyustratsiyasi */}
              <div className="mb-4">
                <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                  <rect x="28" y="42" width="8" height="14" rx="2" fill="#B89B6A" />
                  <path d="M12 24C12 16.268 18.268 10 26 10H40C47.732 10 54 16.268 54 24V42C54 43.1046 53.1046 44 52 44H14C12.8954 44 12 43.1046 12 42V24Z" fill="#239CE6" />
                  <path d="M12 24C12 16.268 18.268 10 26 10C33.732 10 40 16.268 40 24V44H14C12.8954 44 12 43.1046 12 42V24Z" fill="#171E26" />
                  <path d="M26 14C20.4772 14 16 18.4772 16 24V40H36V24C36 18.4772 31.5228 14 26 14Z" fill="#0F141A" />
                  <rect x="44" y="23" width="12" height="5" rx="1.5" fill="#E62222" />
                  <rect x="51" y="23" width="5" height="12" rx="1.5" fill="#E62222" />
                  <circle cx="44" cy="25.5" r="2.2" fill="#8C1D1D" />
                  <path d="M35 15H46C48 15 50 17 50 19" stroke="#7AD3FF" strokeWidth="2.2" strokeLinecap="round" />
                </svg>
              </div>

              {loginEmailStep === 'enter' ? (
                <div className="w-full space-y-5">
                  <div className="space-y-1.5">
                    <h4 className="text-[17px] font-semibold text-neutral-900 dark:text-neutral-100">
                      Yangi email kiriting
                    </h4>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed">
                      Tasdiqlash kodlari SMS orqali emas, elektron pochta orqali yuboriladi. O&apos;zingiz kira oladigan email manzilini kiriting.
                    </p>
                  </div>

                  <div className="text-left pt-2">
                    <label className="block text-[12px] font-medium text-[#3390ec] mb-1.5">
                      Kirish emailini kiriting
                    </label>
                    <input
                      type="email"
                      autoFocus
                      value={emailInput}
                      onChange={e => {
                        setEmailInput(e.target.value);
                        if (emailError) setEmailError('');
                      }}
                      onKeyDown={e => e.key === 'Enter' && saveLoginEmail()}
                      placeholder="example@gmail.com"
                      className="w-full pb-2 bg-transparent border-b-2 border-[#3390ec] text-sm text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 focus:outline-none"
                    />
                    {emailError && <p className="text-[11px] text-red-500 mt-1.5">{emailError}</p>}
                  </div>

                  <button
                    type="button"
                    onClick={saveLoginEmail}
                    className="w-full py-2.5 bg-[#3390ec] hover:bg-[#2a81d8] text-white text-sm font-medium rounded-lg transition-colors cursor-pointer shadow-xs"
                  >
                    Tasdiqlash
                  </button>
                </div>
              ) : (
                <div className="w-full space-y-5">
                  <div className="space-y-1.5">
                    <h4 className="text-[17px] font-semibold text-neutral-900 dark:text-neutral-100">
                      Yangi emailingizni tekshiring
                    </h4>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed">
                      Biz <span className="text-neutral-700 dark:text-neutral-300 font-medium">{emailInput.trim()}</span> manziliga yuborgan kodni kiriting
                    </p>
                  </div>

                  {/* 6 xonali OTP kiritish katakchalari */}
                  <div className="flex items-center justify-center gap-2 pt-1">
                    {emailCodeDigits.map((digit, idx) => (
                      <input
                        key={idx}
                        ref={el => {
                          emailCodeInputRefs.current[idx] = el;
                        }}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        value={digit}
                        aria-label={`Kod raqami ${idx + 1}`}
                        onChange={e => {
                          const val = e.target.value.replace(/\D/g, '').slice(-1);
                          const next = [...emailCodeDigits];
                          next[idx] = val;
                          setEmailCodeDigits(next);
                          if (emailCodeError) setEmailCodeError('');
                          if (val && idx < 5) {
                            emailCodeInputRefs.current[idx + 1]?.focus();
                          }
                          if (next.every(d => d !== '')) {
                            verifyEmailOtpDigits(next);
                          }
                        }}
                        onKeyDown={e => {
                          if (e.key === 'Backspace' && !emailCodeDigits[idx] && idx > 0) {
                            const next = [...emailCodeDigits];
                            next[idx - 1] = '';
                            setEmailCodeDigits(next);
                            emailCodeInputRefs.current[idx - 1]?.focus();
                          }
                        }}
                        onPaste={e => {
                          e.preventDefault();
                          const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
                          if (!pasted) return;
                          const next = Array.from({ length: 6 }, (_, i) => pasted[i] || '');
                          setEmailCodeDigits(next);
                          if (emailCodeError) setEmailCodeError('');
                          const focusIdx = Math.min(5, pasted.length);
                          emailCodeInputRefs.current[focusIdx]?.focus();
                          if (pasted.length === 6) {
                            verifyEmailOtpDigits(next);
                          }
                        }}
                        className={`w-10 h-12 rounded-lg text-center text-base font-semibold tabular-nums border-2 transition-colors focus:outline-none ${
                          emailCodeError
                            ? 'border-red-400 bg-red-50/40 dark:bg-red-950/30 text-neutral-900 dark:text-neutral-100'
                            : 'border-neutral-200 dark:border-neutral-700 bg-neutral-100/80 dark:bg-neutral-800/80 focus:border-[#3390ec] focus:bg-white dark:focus:bg-neutral-900 text-neutral-900 dark:text-neutral-100'
                        }`}
                      />
                    ))}
                  </div>

                  {emailCodeError && (
                    <p className="text-[11px] text-red-500 -mt-2">{emailCodeError}</p>
                  )}

                  <div className="pt-1 space-y-1.5">
                    <p className="text-[11px] text-neutral-400">
                      Tasdiqlash kodi:{' '}
                      <span className="font-mono font-semibold text-[#3390ec] select-all">
                        {generatedEmailCode}
                      </span>
                    </p>
                    <button
                      type="button"
                      onClick={() => sendEmailVerificationCode(emailInput.trim())}
                      className="text-xs font-medium text-[#3390ec] hover:underline cursor-pointer"
                    >
                      Kodni qayta yuborish
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Telegram-style Rasmni Joylashtirish (Avatar Cropper) Modali */}
      {cropperImageSrc && (
        <div className="fixed inset-0 bg-neutral-950/92 backdrop-blur-xl z-60 flex flex-col items-center justify-between py-5 px-4 select-none font-sans">
          <div className="text-center space-y-0.5">
            <h3 className="text-sm font-semibold text-white">Rasmni joylashtirish</h3>
            <p className="text-[11px] text-neutral-400">Doirani sudrang yoki burchaklaridan o'lchamini o'zgartiring</p>
          </div>

          {/* Crop Stage */}
          <div
            ref={cropStageRef}
            className="relative w-full flex-1 my-3 flex items-center justify-center overflow-hidden"
          >
            {/* Bounded Photo Box */}
            <div
              style={{
                width: cropGeometry.dispW,
                height: cropGeometry.dispH,
              }}
              className="relative overflow-hidden shadow-2xl"
            >
              <img
                src={cropperImageSrc}
                alt="Yuklangan rasm"
                draggable={false}
                style={{
                  position: 'absolute',
                  left: '50%',
                  top: '50%',
                  width: cropNaturalSize.width * cropGeometry.fitScale,
                  height: cropNaturalSize.height * cropGeometry.fitScale,
                  marginLeft: -(cropNaturalSize.width * cropGeometry.fitScale) / 2,
                  marginTop: -(cropNaturalSize.height * cropGeometry.fitScale) / 2,
                  maxWidth: 'none',
                  maxHeight: 'none',
                  transform: `rotate(${cropRotation}deg) scaleX(${cropFlipH ? -1 : 1})`,
                  transformOrigin: 'center center',
                }}
                className="pointer-events-none select-none"
              />

              {/* Interactive Resizable & Movable Crop Frame */}
              <div
                style={{
                  left: cropBox.x,
                  top: cropBox.y,
                  width: cropBox.size,
                  height: cropBox.size,
                }}
                onPointerDown={e => startCropDrag('move', e)}
                onPointerMove={moveCropDrag}
                onPointerUp={endCropDrag}
                onPointerCancel={endCropDrag}
                className="absolute touch-none cursor-move"
              >
                {/* Dimmed overlay outside circle + circular border + 3x3 grid */}
                <div
                  style={{ boxShadow: '0 0 0 9999px rgba(0, 0, 0, 0.55)' }}
                  className="w-full h-full rounded-full border border-white/90 overflow-hidden relative pointer-events-none"
                >
                  <div className="absolute inset-x-0 top-1/3 h-px bg-white/25" />
                  <div className="absolute inset-x-0 top-2/3 h-px bg-white/25" />
                  <div className="absolute inset-y-0 left-1/3 w-px bg-white/25" />
                  <div className="absolute inset-y-0 left-2/3 w-px bg-white/25" />
                </div>

                {/* Top-Left Resize Handle */}
                <div
                  onPointerDown={e => startCropDrag('tl', e)}
                  onPointerMove={moveCropDrag}
                  onPointerUp={endCropDrag}
                  onPointerCancel={endCropDrag}
                  className="absolute -top-2 -left-2 w-7 h-7 cursor-nwse-resize touch-none flex items-start justify-start p-1.5"
                  title="O'lchamni o'zgartirish"
                >
                  <span className="w-4 h-4 border-t-[2.5px] border-l-[2.5px] border-white block" />
                </div>

                {/* Top-Right Resize Handle */}
                <div
                  onPointerDown={e => startCropDrag('tr', e)}
                  onPointerMove={moveCropDrag}
                  onPointerUp={endCropDrag}
                  onPointerCancel={endCropDrag}
                  className="absolute -top-2 -right-2 w-7 h-7 cursor-nesw-resize touch-none flex items-start justify-end p-1.5"
                  title="O'lchamni o'zgartirish"
                >
                  <span className="w-4 h-4 border-t-[2.5px] border-r-[2.5px] border-white block" />
                </div>

                {/* Bottom-Left Resize Handle */}
                <div
                  onPointerDown={e => startCropDrag('bl', e)}
                  onPointerMove={moveCropDrag}
                  onPointerUp={endCropDrag}
                  onPointerCancel={endCropDrag}
                  className="absolute -bottom-2 -left-2 w-7 h-7 cursor-nesw-resize touch-none flex items-end justify-start p-1.5"
                  title="O'lchamni o'zgartirish"
                >
                  <span className="w-4 h-4 border-b-[2.5px] border-l-[2.5px] border-white block" />
                </div>

                {/* Bottom-Right Resize Handle */}
                <div
                  onPointerDown={e => startCropDrag('br', e)}
                  onPointerMove={moveCropDrag}
                  onPointerUp={endCropDrag}
                  onPointerCancel={endCropDrag}
                  className="absolute -bottom-2 -right-2 w-7 h-7 cursor-nwse-resize touch-none flex items-end justify-end p-1.5"
                  title="O'lchamni o'zgartirish"
                >
                  <span className="w-4 h-4 border-b-[2.5px] border-r-[2.5px] border-white block" />
                </div>
              </div>
            </div>
          </div>

          {/* Telegram-style Bottom Pill Toolbar */}
          <div className="bg-neutral-900/95 border border-neutral-800 rounded-full px-4 py-2 flex items-center space-x-3 sm:space-x-5 shadow-2xl">
            <button
              type="button"
              onClick={() => setCropperImageSrc(null)}
              className="px-2 py-1 text-xs font-medium text-neutral-300 hover:text-white transition-colors cursor-pointer"
            >
              Bekor qilish
            </button>

            <div className="flex items-center space-x-2 border-x border-neutral-800 px-3">
              <button
                type="button"
                onClick={() => setCropFlipH(prev => !prev)}
                className={`p-1.5 rounded-full transition-colors cursor-pointer ${
                  cropFlipH ? 'text-[#3390ec] bg-white/10' : 'text-neutral-300 hover:text-white hover:bg-white/10'
                }`}
                title="Akslantirish"
              >
                <FlipHorizontal2 className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={handleCropRotate}
                className="p-1.5 text-neutral-300 hover:text-white hover:bg-white/10 rounded-full transition-colors cursor-pointer"
                title="90° aylantirish"
              >
                <RotateCw className="w-4 h-4" />
              </button>
            </div>

            <button
              type="button"
              onClick={saveCroppedAvatar}
              className="px-2 py-1 text-xs font-semibold text-[#3390ec] hover:text-[#55a8f8] transition-colors cursor-pointer whitespace-nowrap"
            >
              Rasmni o'rnatish
            </button>
          </div>
        </div>
      )}

      {/* Mening Hikoyalarim Ro'yxati Modali */}
      {isPostsDrawerOpen && (
        <div
          onClick={() => setIsPostsDrawerOpen(false)}
          className="fixed inset-0 bg-black/30 dark:bg-black/60 backdrop-blur-xs z-40 transition-opacity"
        ></div>
      )}
      <div
        className={`fixed top-0 right-0 bottom-0 w-full max-w-sm bg-white dark:bg-neutral-900 border-l border-neutral-100 dark:border-neutral-800 z-50 transform transition-transform duration-300 ease-in-out flex flex-col ${
          isPostsDrawerOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="p-6 border-b border-neutral-100 dark:border-neutral-800 flex items-center justify-between font-sans">
          <h3 className="font-bold text-sm tracking-wide uppercase">Mening Hikoyalarim ({posts.length})</h3>
          <button
            onClick={() => setIsPostsDrawerOpen(false)}
            className="text-neutral-400 hover:text-neutral-800 dark:hover:text-neutral-200 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-6 flex-1 overflow-y-auto space-y-6 font-serif">
          {posts.length === 0 ? (
            <p className="text-xs text-neutral-400 text-center py-8 font-sans">Hozircha hikoyalaringiz yo'q.</p>
          ) : (
            posts.map(post => {
              const drawerPreview = getPostLinkPreview(post);
              const openFromDrawer = () => {
                setIsPostsDrawerOpen(false);
                openCommunityPost({
                  ...post,
                  authorName: profile.name,
                  authorUsername: profile.username,
                  avatar: profile.avatar,
                });
              };
              return (
                <div key={post.id} className="border-b border-neutral-100 dark:border-neutral-800 pb-4 last:border-none min-w-0 font-sans space-y-2">
                  <p className="text-[11px] text-neutral-400">{post.date}</p>
                  {drawerPreview && renderLinkPreviewCard(drawerPreview, true, post, openFromDrawer)}
                  <p
                    onClick={openFromDrawer}
                    className="text-xs font-normal text-neutral-800 dark:text-neutral-200 line-clamp-3 leading-relaxed cursor-pointer hover:opacity-80 [overflow-wrap:anywhere]"
                  >
                    {renderTextWithLinks(post.content)}
                  </p>
                  <div className="flex items-center space-x-3 text-[11px] font-sans pt-0.5">
                  <button onClick={() => editPost(post.id)} className="text-neutral-600 dark:text-neutral-300 hover:underline cursor-pointer flex items-center space-x-1">
                    <Edit2 className="w-3 h-3" />
                    <span>Tahrirlash</span>
                  </button>
                  <span className="text-neutral-300">•</span>
                  <button
                    onClick={() => setPostToDelete(post.id)}
                    className="text-red-500 hover:underline cursor-pointer"
                  >
                    O'chirish
                  </button>
                </div>
              </div>
              );
            })
          )}
        </div>
      </div>

      {/* O'chirishni tasdiqlash modali */}
      {postToDelete && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs z-[80] flex items-center justify-center p-4">
          <div className="bg-white dark:bg-neutral-900 border border-neutral-100 dark:border-neutral-800 rounded-2xl w-full max-w-xs p-5 shadow-2xl space-y-4 font-sans text-center">
            <div className="w-10 h-10 bg-red-100 dark:bg-red-950/60 text-red-500 rounded-full mx-auto flex items-center justify-center">
              <Trash2 className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-neutral-900 dark:text-neutral-100">Hikoyani o'chirish</h4>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">Ushbu hikoya butunlay o'chiriladi. Qayta tiklab bo'lmaydi.</p>
            </div>
            <div className="flex space-x-2 pt-2">
              <button
                onClick={() => setPostToDelete(null)}
                className="flex-1 py-1.5 bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 rounded-lg text-xs font-medium cursor-pointer"
              >
                Bekor qilish
              </button>
              <button
                onClick={confirmDeletePost}
                className="flex-1 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-medium cursor-pointer"
              >
                O'chirish
              </button>
            </div>
          </div>
        </div>
      )}


      {/* Boshqa Muallif Profili To'liq Ekran Sahifasi (Yangi Minimalist Adabiy Studio Dizaynida) */}
      {viewingAuthorData && (
        <div className="fixed inset-0 bg-white dark:bg-neutral-950 z-50 flex flex-col font-sans">
          {/* Header */}
          <div className="border-b border-neutral-100 dark:border-neutral-800/80 bg-white/95 dark:bg-neutral-950/95">
            <div className="max-w-3xl w-full mx-auto px-4 sm:px-8 py-3 flex items-center justify-between">
              <div className="flex items-center space-x-2.5">
                <button
                  type="button"
                  onClick={() => {
                    setIsAuthorQrOpen(false);
                    setIsAuthorStoriesViewOpen(false);
                    setViewingAuthorUsername(null);
                  }}
                  className="p-1.5 -ml-1 text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
                  title="Orqaga"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
                <h3 className="font-semibold text-[15px] tracking-tight text-neutral-900 dark:text-neutral-100">
                  Muallif profili
                </h3>
              </div>
              <button
                type="button"
                onClick={() => {
                  setIsAuthorQrOpen(false);
                  setIsAuthorStoriesViewOpen(false);
                  setViewingAuthorUsername(null);
                }}
                className="p-1.5 text-neutral-400 hover:text-neutral-800 dark:hover:text-neutral-200 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
                title="Yopish"
                aria-label="Yopish"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            <div className="max-w-3xl w-full mx-auto px-4 sm:px-8 py-5 space-y-5 pb-12">
              {/* Muallif Studio Kartasi */}
              <div className="rounded-2xl border border-neutral-200/80 dark:border-neutral-800 bg-neutral-50/75 dark:bg-neutral-900/50 p-5 space-y-4">
                <div className="flex items-start gap-4">
                  <button
                    type="button"
                    onClick={() => {
                      const initials =
                        viewingAuthorData.name
                          .split(' ')
                          .map(n => n[0])
                          .filter(Boolean)
                          .join('')
                          .substring(0, 2)
                          .toUpperCase() || 'M';
                      const list = viewingAuthorData.isSelf
                        ? profilePhotos.length > 0
                          ? profilePhotos
                          : viewingAuthorData.avatar
                          ? [viewingAuthorData.avatar]
                          : []
                        : viewingAuthorData.avatar
                        ? [viewingAuthorData.avatar]
                        : [];
                      setPhotoLightbox({
                        photos: list,
                        index: 0,
                        name: viewingAuthorData.name,
                        initials,
                        isOwn: viewingAuthorData.isSelf,
                      });
                    }}
                    className="w-18 h-18 bg-neutral-200 dark:bg-neutral-800 rounded-2xl shrink-0 flex items-center justify-center text-neutral-800 dark:text-neutral-200 font-semibold text-2xl overflow-hidden cursor-pointer hover:opacity-90 transition-opacity ring-1 ring-black/5 dark:ring-white/10"
                    title="Profil rasmini kattalashtirib ko'rish"
                  >
                    {viewingAuthorData.avatar ? (
                      <img src={viewingAuthorData.avatar} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <span>
                        {viewingAuthorData.name
                          .split(' ')
                          .map(n => n[0])
                          .filter(Boolean)
                          .join('')
                          .substring(0, 2)
                          .toUpperCase() || 'M'}
                      </span>
                    )}
                  </button>

                  <div className="min-w-0 flex-1 space-y-1">
                    <div className="flex items-center justify-between gap-2">
                      <h2
                        className="font-semibold text-lg tracking-tight text-neutral-900 dark:text-neutral-100 leading-tight truncate"
                        style={getAuthorNameStyle(viewingAuthorData.username)}
                      >
                        {viewingAuthorData.name}
                      </h2>
                      <button
                        type="button"
                        onClick={() => {
                          setAuthorQrCopied(false);
                          setIsAuthorQrOpen(true);
                        }}
                        className="p-1.5 text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white hover:bg-neutral-200/70 dark:hover:bg-neutral-800 rounded-lg transition-colors cursor-pointer shrink-0"
                        title="QR kod"
                        aria-label="QR kod"
                      >
                        <QrCode className="w-4 h-4 stroke-[1.75]" />
                      </button>
                    </div>

                    <div className="flex flex-wrap items-center gap-x-1.5 gap-y-0.5 text-xs text-neutral-500 dark:text-neutral-400">
                      <button
                        type="button"
                        onClick={async () => {
                          try {
                            await navigator.clipboard.writeText(authorQrMatrix.targetUrl);
                            setAuthorLinkCopied(true);
                            setTimeout(() => setAuthorLinkCopied(false), 1800);
                          } catch {
                            // ignore clipboard failure
                          }
                        }}
                        className="text-[#2563eb] dark:text-[#60a5fa] font-medium hover:underline cursor-pointer"
                        title="Profil havolasini nusxalash"
                      >
                        {authorLinkCopied ? 'Havola nusxalandi!' : viewingAuthorData.username}
                      </button>
                      <span className="text-neutral-300 dark:text-neutral-700" aria-hidden="true">·</span>
                      <span className="tabular-nums">{viewingAuthorData.followersCount} obunachi</span>
                      <span className="text-neutral-300 dark:text-neutral-700" aria-hidden="true">·</span>
                      <span className="tabular-nums">
                        {allPosts.filter(p => p.authorUsername === viewingAuthorData.username).length} hikoya
                      </span>
                    </div>

                    <p className="text-xs sm:text-[13px] text-neutral-700 dark:text-neutral-300 leading-relaxed whitespace-pre-line pt-1">
                      {viewingAuthorData.bio || "Bio qo'shilmagan"}
                    </p>
                  </div>
                </div>

                {/* Tezkor harakatlar qatori */}
                {!viewingAuthorData.isSelf ? (
                  <div className="grid grid-cols-3 gap-2 pt-1">
                    {(() => {
                      const isMuted = mutedAuthors.includes(viewingAuthorData.username);
                      const isSubbed = subscribedAuthors.includes(viewingAuthorData.username);
                      return (
                        <>
                          <button
                            type="button"
                            onClick={e => toggleSubscribe(e, viewingAuthorData.username)}
                            className={`py-2 px-3 rounded-xl text-xs font-medium flex items-center justify-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap ${
                              isSubbed
                                ? 'bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 text-neutral-800 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800'
                                : 'bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 hover:opacity-90'
                            }`}
                          >
                            {isSubbed ? (
                              <Check className="w-3.5 h-3.5 shrink-0" />
                            ) : (
                              <UserPlus className="w-3.5 h-3.5 shrink-0" />
                            )}
                            <span>{isSubbed ? 'Obunadasiz' : "Obuna bo'lish"}</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              setStoriesReturnToOwnProfile(false);
                              setIsAuthorStoriesViewOpen(true);
                            }}
                            className="py-2 px-3 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700 text-xs font-medium text-neutral-800 dark:text-neutral-200 flex items-center justify-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap"
                          >
                            <BookOpen className="w-3.5 h-3.5 shrink-0 stroke-[1.75]" />
                            <span>Hikoyalar</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => toggleMuteAuthor(viewingAuthorData.username)}
                            className={`py-2 px-3 rounded-xl border text-xs font-medium flex items-center justify-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap ${
                              isMuted
                                ? 'bg-[#2563eb]/10 border-[#2563eb]/30 text-[#2563eb] dark:text-[#60a5fa]'
                                : 'bg-white dark:bg-neutral-900 border-neutral-200/80 dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700 text-neutral-700 dark:text-neutral-300'
                            }`}
                          >
                            {isMuted ? (
                              <BellOff className="w-3.5 h-3.5 shrink-0" />
                            ) : (
                              <Bell className="w-3.5 h-3.5 shrink-0" />
                            )}
                            <span>{isMuted ? 'Ovozsiz' : "Ovozini o'chirish"}</span>
                          </button>
                        </>
                      );
                    })()}
                  </div>
                ) : (
                  <div className="pt-1">
                    <button
                      type="button"
                      onClick={() => {
                        setStoriesReturnToOwnProfile(false);
                        setIsAuthorStoriesViewOpen(true);
                      }}
                      className="w-full py-2 px-3 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700 text-xs font-medium text-neutral-800 dark:text-neutral-200 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <BookOpen className="w-3.5 h-3.5 stroke-[1.75]" />
                      <span>Hikoyalar</span>
                    </button>
                  </div>
                )}
              </div>

              {/* Ulashish va Bloklash amallari */}
              <div className="rounded-xl border border-neutral-200/80 dark:border-neutral-800 bg-white dark:bg-neutral-900/30 divide-y divide-neutral-100 dark:divide-neutral-800/70 overflow-hidden">
                <button
                  type="button"
                  onClick={async () => {
                    if (navigator.share) {
                      try {
                        await navigator.share({
                          title: `${viewingAuthorData.name} (${viewingAuthorData.username})`,
                          url: authorQrMatrix.targetUrl,
                        });
                        return;
                      } catch {
                        // fallback to clipboard
                      }
                    }
                    try {
                      await navigator.clipboard.writeText(authorQrMatrix.targetUrl);
                      setAuthorLinkCopied(true);
                      setTimeout(() => setAuthorLinkCopied(false), 1800);
                    } catch {
                      // ignore
                    }
                  }}
                  className="w-full px-4 py-3 flex items-center space-x-3 hover:bg-neutral-50 dark:hover:bg-neutral-900/60 transition-colors cursor-pointer text-left"
                >
                  <Forward className="w-4.5 h-4.5 text-neutral-500 dark:text-neutral-400 stroke-[1.75]" />
                  <span className="text-xs sm:text-[13px] text-neutral-800 dark:text-neutral-200">
                    {authorLinkCopied ? 'Havola nusxalandi!' : 'Ushbu profilni ulashish'}
                  </span>
                </button>

                {!viewingAuthorData.isSelf && (
                  <button
                    type="button"
                    onClick={() => toggleBlockUser(viewingAuthorData.username)}
                    className="w-full px-4 py-3 flex items-center space-x-3 hover:bg-neutral-50 dark:hover:bg-neutral-900/60 transition-colors cursor-pointer text-left"
                  >
                    <Hand
                      className={`w-4.5 h-4.5 stroke-[1.75] ${
                        blockedUsers.includes(viewingAuthorData.username)
                          ? 'text-[#2563eb] dark:text-[#60a5fa]'
                          : 'text-neutral-500 dark:text-neutral-400'
                      }`}
                    />
                    <span
                      className={`text-xs sm:text-[13px] ${
                        blockedUsers.includes(viewingAuthorData.username)
                          ? 'text-[#2563eb] dark:text-[#60a5fa] font-medium'
                          : 'text-neutral-800 dark:text-neutral-200'
                      }`}
                    >
                      {blockedUsers.includes(viewingAuthorData.username)
                        ? 'Foydalanuvchini blokdan chiqarish'
                        : 'Foydalanuvchini bloklash'}
                    </span>
                  </button>
                )}
              </div>

              {/* So'nggi hikoyasi */}
              <div className="space-y-2.5">
                <h4 className="text-xs font-semibold text-neutral-500 dark:text-neutral-400 px-1">
                  So&apos;nggi hikoyasi
                </h4>
                {(() => {
                  const latestPost = allPosts.find(p => p.authorUsername === viewingAuthorData.username);
                  if (!latestPost) {
                    return (
                      <div className="rounded-xl border border-neutral-200/70 dark:border-neutral-800 px-4 py-6 text-center">
                        <p className="text-xs text-neutral-400 font-sans">Hozircha hikoyalar yo&apos;q.</p>
                      </div>
                    );
                  }
                  const latestPreview = getPostLinkPreview(latestPost);
                  const openLatestPost = () => {
                    setIsAuthorQrOpen(false);
                    setIsAuthorStoriesViewOpen(false);
                    setViewingAuthorUsername(null);
                    openCommunityPost(latestPost, {
                      username: viewingAuthorData.username,
                      storiesView: false,
                    });
                  };
                  return (
                    <div
                      onClick={openLatestPost}
                      className="rounded-xl border border-neutral-200/80 dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700 bg-white dark:bg-neutral-900/30 p-3.5 cursor-pointer group space-y-2.5 min-w-0 transition-colors"
                    >
                      {latestPreview && renderLinkPreviewCard(latestPreview, true, latestPost, openLatestPost)}
                      <p className="text-xs sm:text-[13px] font-normal text-neutral-700 dark:text-neutral-300 line-clamp-2 [overflow-wrap:anywhere] leading-relaxed">
                        {renderTextWithLinks(latestPost.content)}
                      </p>
                      <p className="text-[11px] font-sans text-neutral-400">{latestPost.date}</p>
                    </div>
                  );
                })()}
              </div>
            </div>
          </div>

          {/* Boshqa foydalanuvchi profili uchun o'z ism rangidagi markaziy QR kod oynasi */}
          {isAuthorQrOpen && (() => {
            const authorQrColor = getAuthorQrColor(viewingAuthorData.username);
            return (
              <div
                onClick={() => setIsAuthorQrOpen(false)}
                className="fixed inset-0 z-[70] bg-black/45 backdrop-blur-[1px] flex items-center justify-center p-4 font-sans select-none"
              >
                <div
                  onClick={e => e.stopPropagation()}
                  className="relative w-full max-w-[310px] rounded-2xl bg-[#1f1f1f] shadow-2xl px-5 pt-11 pb-4 flex flex-col items-center justify-between"
                >
                  <button
                    type="button"
                    onClick={() => setIsAuthorQrOpen(false)}
                    className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
                    aria-label="Yopish"
                  >
                    <X className="w-4.5 h-4.5" />
                  </button>

                  <div className="bg-white rounded-[22px] shadow-xl px-5 pt-5 pb-4 w-[210px] flex flex-col items-center">
                    {authorQrMatrix.size > 0 && (
                      <svg
                        viewBox={`0 0 ${authorQrMatrix.size} ${authorQrMatrix.size}`}
                        className="w-full h-auto"
                        shapeRendering="geometricPrecision"
                      >
                        {[
                          { x: 0, y: 0 },
                          { x: authorQrMatrix.size - 7, y: 0 },
                          { x: 0, y: authorQrMatrix.size - 7 },
                        ].map((pos, idx) => (
                          <g key={idx}>
                            <rect
                              x={pos.x + 0.5}
                              y={pos.y + 0.5}
                              width={6}
                              height={6}
                              rx={1.8}
                              fill="none"
                              stroke={authorQrColor}
                              strokeWidth={1}
                            />
                            <rect
                              x={pos.x + 2}
                              y={pos.y + 2}
                              width={3}
                              height={3}
                              rx={1}
                              fill={authorQrColor}
                            />
                          </g>
                        ))}

                        {authorQrMatrix.rows.map((row, r) =>
                          row.map((on, c) => {
                            if (!on) return null;
                            const inTopLeft = r < 7 && c < 7;
                            const inTopRight = r < 7 && c >= authorQrMatrix.size - 7;
                            const inBottomLeft = r >= authorQrMatrix.size - 7 && c < 7;
                            if (inTopLeft || inTopRight || inBottomLeft) return null;

                            return (
                              <rect
                                key={`${r}-${c}`}
                                x={c + 0.06}
                                y={r + 0.06}
                                width={0.88}
                                height={0.88}
                                rx={0.35}
                                fill={authorQrColor}
                              />
                            );
                          })
                        )}
                      </svg>
                    )}

                    <p
                      className="mt-2 text-center font-bold tracking-wide uppercase text-sm truncate max-w-full"
                      style={{ color: authorQrColor }}
                    >
                      {viewingAuthorData.username}
                    </p>
                  </div>

                  <div className="mt-4 w-full flex items-center justify-between px-1">
                    <button
                      type="button"
                      onClick={async () => {
                        try {
                          await navigator.clipboard.writeText(authorQrMatrix.targetUrl);
                          setAuthorQrCopied(true);
                          setTimeout(() => setAuthorQrCopied(false), 1800);
                        } catch {
                          // ignore clipboard failure
                        }
                      }}
                      className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
                      title="Havolani nusxalash"
                      aria-label="Havolani nusxalash"
                    >
                      {authorQrCopied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        shareOrDownloadQrCard(
                          authorQrMatrix,
                          viewingAuthorData.name,
                          viewingAuthorData.username,
                          authorQrColor
                        )
                      }
                      className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
                      title="QR kodni ulashish yoki yuklab olish"
                      aria-label="QR kodni ulashish yoki yuklab olish"
                    >
                      <Share2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })()}
          {/* Muallifning alohida hikoyalar oynasi */}
          {isAuthorStoriesViewOpen && (() => {
            const authorStories = allPosts.filter(p => p.authorUsername === viewingAuthorData.username);
            const authorInitials =
              viewingAuthorData.name
                .split(' ')
                .map(n => n[0])
                .filter(Boolean)
                .join('')
                .substring(0, 2)
                .toUpperCase() || 'M';

            return (
              <div className="fixed inset-0 bg-white dark:bg-neutral-950 z-[65] flex flex-col font-sans">
                <div className="border-b border-neutral-100 dark:border-neutral-800">
                  <div className="max-w-5xl w-full mx-auto px-4 sm:px-8 lg:px-12 py-3.5 flex items-center justify-between gap-3">
                    <div className="flex items-center space-x-3 min-w-0">
                      <button
                        type="button"
                        onClick={() => {
                          setIsAuthorStoriesViewOpen(false);
                          if (storiesReturnToOwnProfile) {
                            setViewingAuthorUsername(null);
                            setIsProfileDrawerOpen(true);
                            setStoriesReturnToOwnProfile(false);
                          }
                        }}
                        className="p-1.5 -ml-1 text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors cursor-pointer shrink-0"
                        title="Orqaga"
                        aria-label="Orqaga"
                      >
                        <ArrowLeft className="w-5 h-5" />
                      </button>
                      <div className="w-9 h-9 rounded-full bg-neutral-200 dark:bg-neutral-800 flex items-center justify-center font-bold text-xs text-neutral-800 dark:text-neutral-200 overflow-hidden shrink-0">
                        {viewingAuthorData.avatar ? (
                          <img src={viewingAuthorData.avatar} alt="" className="w-full h-full object-cover" />
                        ) : (
                          authorInitials
                        )}
                      </div>
                      <div className="min-w-0">
                        <h3
                          className="font-semibold text-sm sm:text-[15px] text-neutral-900 dark:text-neutral-100 truncate"
                          style={getAuthorNameStyle(viewingAuthorData.username)}
                        >
                          {viewingAuthorData.name}
                        </h3>
                        <p className="text-[11px] text-neutral-400">
                          Hikoyalar ({authorStories.length})
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        setStoriesReturnToOwnProfile(false);
                        setIsAuthorStoriesViewOpen(false);
                        setIsAuthorQrOpen(false);
                        setViewingAuthorUsername(null);
                      }}
                      className="p-1.5 text-neutral-400 hover:text-neutral-800 dark:hover:text-neutral-200 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors cursor-pointer shrink-0"
                      title="Yopish"
                      aria-label="Yopish"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto overflow-x-hidden">
                  <div className="max-w-5xl w-full mx-auto px-4 sm:px-8 lg:px-12 py-6">
                    {authorStories.length === 0 ? (
                      <div className="text-center py-20 space-y-2">
                        <div className="w-12 h-12 rounded-2xl bg-neutral-100 dark:bg-neutral-900 text-neutral-400 mx-auto flex items-center justify-center">
                          <BookOpen className="w-5 h-5" />
                        </div>
                        <p className="text-sm text-neutral-500 dark:text-neutral-400">
                          Hozircha hikoyalar yo&apos;q.
                        </p>
                      </div>
                    ) : (
                      <div className="divide-y divide-neutral-100 dark:divide-neutral-800/80">
                        {authorStories.map(p => (
                            <article
                              key={p.id}
                              onClick={() => {
                                setIsAuthorStoriesViewOpen(false);
                                setIsAuthorQrOpen(false);
                                setViewingAuthorUsername(null);
                                openCommunityPost(p, {
                                  username: viewingAuthorData.username,
                                  storiesView: true,
                                  fromOwnProfile: storiesReturnToOwnProfile,
                                });
                              }}
                              className="py-5 first:pt-0 last:pb-0 cursor-pointer group space-y-2 min-w-0"
                            >
                              <div className="flex items-center justify-between text-[11px] text-neutral-400">
                                <span>{p.date}</span>
                                {p.readTime && <span>{p.readTime}</span>}
                              </div>
                              {p.replyTo && renderReplyQuote(p.replyTo)}
                              {(() => {
                                const itemPreview = getPostLinkPreview(p);
                                return itemPreview
                                  ? renderLinkPreviewCard(itemPreview, true, p, () => {
                                      setIsAuthorStoriesViewOpen(false);
                                      setIsAuthorQrOpen(false);
                                      setViewingAuthorUsername(null);
                                      openCommunityPost(p, {
                                        username: viewingAuthorData.username,
                                        storiesView: true,
                                        fromOwnProfile: storiesReturnToOwnProfile,
                                      });
                                    })
                                  : null;
                              })()}
                              <p className="text-[15px] font-normal text-neutral-800 dark:text-neutral-200 leading-relaxed whitespace-pre-line line-clamp-4 [overflow-wrap:anywhere]">
                                {renderTextWithLinks(p.content)}
                              </p>
                              {viewingAuthorData.isSelf && (
                                <div
                                  onClick={e => e.stopPropagation()}
                                  className="flex items-center space-x-3 text-[11px] font-sans pt-1"
                                >
                                  <button
                                    type="button"
                                    onClick={() => editPost(p.id)}
                                    className="text-neutral-600 dark:text-neutral-300 hover:underline cursor-pointer flex items-center space-x-1"
                                  >
                                    <Edit2 className="w-3 h-3" />
                                    <span>Tahrirlash</span>
                                  </button>
                                  <span className="text-neutral-300 dark:text-neutral-700">•</span>
                                  <button
                                    type="button"
                                    onClick={() => setPostToDelete(p.id)}
                                    className="text-red-500 hover:underline cursor-pointer"
                                  >
                                    O&apos;chirish
                                  </button>
                                </div>
                              )}
                            </article>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })()}
        </div>
      )}

      {/* Saqlangan hikoyalar to'liq ekran sahifasi */}
      {isSavedStoriesViewOpen && (() => {
        const savedStoriesList = savedPostIds
          .map(id => allPosts.find(p => p.id === id))
          .filter((p): p is Post => Boolean(p && (!p.authorUsername || !blockedUsers.includes(p.authorUsername))));

        return (
          <div className="fixed inset-0 bg-white dark:bg-neutral-950 z-[65] flex flex-col font-sans">
            <div className="border-b border-neutral-100 dark:border-neutral-800">
              <div className="max-w-5xl w-full mx-auto px-4 sm:px-8 lg:px-12 py-3.5 flex items-center justify-between gap-3">
                <div className="flex items-center space-x-3 min-w-0">
                  <button
                    type="button"
                    onClick={() => {
                      setIsSavedStoriesViewOpen(false);
                      setIsProfileDrawerOpen(true);
                    }}
                    className="p-1.5 -ml-1 text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors cursor-pointer shrink-0"
                    title="Orqaga"
                    aria-label="Orqaga"
                  >
                    <ArrowLeft className="w-5 h-5" />
                  </button>
                  <div className="w-9 h-9 rounded-full bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center text-neutral-800 dark:text-neutral-200 shrink-0">
                    <Bookmark className="w-4 h-4 stroke-[1.75]" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-semibold text-sm sm:text-[15px] text-neutral-900 dark:text-neutral-100 truncate">
                      Saqlash
                    </h3>
                    <p className="text-[11px] text-neutral-400">
                      Saqlangan hikoyalar ({savedStoriesList.length})
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setIsSavedStoriesViewOpen(false)}
                  className="p-1.5 text-neutral-400 hover:text-neutral-800 dark:hover:text-neutral-200 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors cursor-pointer shrink-0"
                  title="Yopish"
                  aria-label="Yopish"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto overflow-x-hidden">
              <div className="max-w-5xl w-full mx-auto px-4 sm:px-8 lg:px-12 py-6">
                {savedStoriesList.length === 0 ? (
                  <div className="text-center py-20 space-y-2">
                    <div className="w-12 h-12 rounded-2xl bg-neutral-100 dark:bg-neutral-900 text-neutral-400 mx-auto flex items-center justify-center">
                      <Bookmark className="w-5 h-5" />
                    </div>
                    <p className="text-sm text-neutral-500 dark:text-neutral-400">
                      Hozircha saqlangan hikoyalar yo&apos;q.
                    </p>
                  </div>
                ) : (
                  <div className="divide-y divide-neutral-100 dark:divide-neutral-800/80">
                    {savedStoriesList.map(p => (
                        <article
                          key={p.id}
                          onClick={() => {
                            setIsSavedStoriesViewOpen(false);
                            openCommunityPost(p, null, true);
                          }}
                          className="py-5 first:pt-0 last:pb-0 cursor-pointer group space-y-2 min-w-0"
                        >
                          <div className="flex items-center justify-between gap-2 text-[11px] text-neutral-400">
                            <span
                              className="font-semibold text-xs truncate"
                              style={getAuthorNameStyle(p.authorUsername)}
                            >
                              {p.authorName || profile.name}
                            </span>
                            <div className="flex items-center space-x-2 shrink-0">
                              <span>{p.date}</span>
                              {p.readTime && (
                                <>
                                  <span>·</span>
                                  <span>{p.readTime}</span>
                                </>
                              )}
                            </div>
                          </div>
                          {p.replyTo && renderReplyQuote(p.replyTo)}
                          {(() => {
                            const itemPreview = getPostLinkPreview(p);
                            return itemPreview
                              ? renderLinkPreviewCard(itemPreview, true, p, () => {
                                  setIsSavedStoriesViewOpen(false);
                                  openCommunityPost(p, null, true);
                                })
                              : null;
                          })()}
                          <p className="text-[15px] font-normal text-neutral-800 dark:text-neutral-200 leading-relaxed whitespace-pre-line line-clamp-4 [overflow-wrap:anywhere]">
                            {renderTextWithLinks(p.content)}
                          </p>
                        </article>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      })()}

      {/* Javob beriladigan matnni qo'lda belgilash modali */}
      {isQuotePickerOpen && replyingToPost && (() => {
        const replyColor = getAuthorReplyColor(replyingToPost.authorUsername);
        const replyAuthorName = replyingToPost.authorName || profile.name;
        const paragraphs = replyingToPost.content.split('\n').filter(line => line.trim().length > 0);
        const activeQuote = quoteSelectionDraft.trim();

        return (
          <div
            onClick={() => setIsQuotePickerOpen(false)}
            className="fixed inset-0 bg-black/50 backdrop-blur-xs z-[70] flex items-center justify-center p-4 font-sans"
          >
            <div
              onClick={e => e.stopPropagation()}
              className="bg-white dark:bg-neutral-900 border border-neutral-100 dark:border-neutral-800 rounded-2xl w-full max-w-lg max-h-[85vh] shadow-2xl flex flex-col overflow-hidden"
            >
              <div className="px-4 sm:px-5 py-3.5 border-b border-neutral-100 dark:border-neutral-800 flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <h3 className="font-semibold text-sm sm:text-[15px] text-neutral-900 dark:text-neutral-100 truncate">
                    Javob matnini belgilang
                  </h3>
                  <p className="text-[11.5px] text-neutral-500 dark:text-neutral-400 truncate mt-0.5">
                    Hikoyadan istalgan matnni belgilang yoki paragraf ustiga bosing
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsQuotePickerOpen(false)}
                  className="p-1.5 text-neutral-400 hover:text-neutral-800 dark:hover:text-neutral-200 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors cursor-pointer shrink-0"
                  aria-label="Yopish"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div
                ref={quotePickerContentRef}
                onMouseUp={handleQuotePickerSelection}
                onTouchEnd={handleQuotePickerSelection}
                onKeyUp={handleQuotePickerSelection}
                className="flex-1 overflow-y-auto overflow-x-hidden px-4 sm:px-5 py-4 space-y-2.5 text-sm sm:text-[15px] leading-relaxed text-neutral-900 dark:text-neutral-100 select-text cursor-text"
              >
                {paragraphs.map((para, idx) => {
                  const trimmedPara = para.trim();
                  const isParaExact = activeQuote === trimmedPara;
                  const matchIdx =
                    activeQuote.length >= 2 && !isParaExact ? trimmedPara.indexOf(activeQuote) : -1;

                  return (
                    <p
                      key={idx}
                      onClick={() => {
                        const sel = window.getSelection()?.toString().trim() || '';
                        if (!sel) {
                          setQuoteSelectionDraft(trimmedPara);
                        }
                      }}
                      style={
                        isParaExact
                          ? { backgroundColor: hexToRgba(replyColor, isDarkMode ? 0.24 : 0.15) }
                          : undefined
                      }
                      className="rounded-md px-2 py-1 -mx-2 transition-colors hover:bg-neutral-100/70 dark:hover:bg-neutral-800/50 [overflow-wrap:anywhere]"
                    >
                      {matchIdx !== -1 ? (
                        <>
                          {trimmedPara.slice(0, matchIdx)}
                          <mark
                            style={{
                              backgroundColor: hexToRgba(replyColor, isDarkMode ? 0.34 : 0.24),
                              color: 'inherit',
                            }}
                            className="rounded px-0.5"
                          >
                            {trimmedPara.slice(matchIdx, matchIdx + activeQuote.length)}
                          </mark>
                          {trimmedPara.slice(matchIdx + activeQuote.length)}
                        </>
                      ) : (
                        trimmedPara
                      )}
                    </p>
                  );
                })}
              </div>

              <div className="px-4 sm:px-5 py-3.5 border-t border-neutral-100 dark:border-neutral-800 bg-neutral-50/70 dark:bg-neutral-950/60 space-y-3">
                <div
                  style={{
                    borderLeftColor: replyColor,
                    backgroundColor: hexToRgba(replyColor, isDarkMode ? 0.18 : 0.11),
                  }}
                  className="border-l-[3px] rounded-md px-2.5 py-2"
                >
                  <div className="flex items-center space-x-1 text-[12px] font-semibold leading-tight" style={{ color: replyColor }}>
                    <Reply className="w-3 h-3 shrink-0" />
                    <span className="truncate">{replyAuthorName}</span>
                  </div>
                  <p className="text-[12.5px] text-neutral-700 dark:text-neutral-200 line-clamp-3 leading-snug mt-0.5 whitespace-pre-line">
                    {activeQuote || replyingToPost.title}
                  </p>
                </div>

                <div className="flex items-center justify-between gap-2">
                  <button
                    type="button"
                    onClick={() => setQuoteSelectionDraft(replyingToPost.title)}
                    className="text-xs text-neutral-500 hover:text-neutral-800 dark:text-neutral-400 dark:hover:text-neutral-200 transition-colors cursor-pointer"
                  >
                    Sarlavhani olish
                  </button>

                  <div className="flex items-center space-x-2">
                    <button
                      type="button"
                      onClick={() => setIsQuotePickerOpen(false)}
                      className="px-3.5 py-1.5 rounded-lg text-xs font-medium text-neutral-600 dark:text-neutral-300 hover:bg-neutral-200/70 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
                    >
                      Bekor qilish
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setReplyQuoteText(activeQuote);
                        setIsQuotePickerOpen(false);
                        setTimeout(() => composerRef.current?.focus(), 50);
                      }}
                      className="px-4 py-1.5 rounded-lg bg-[#3390ec] hover:bg-[#2b7fd4] text-white text-xs font-medium transition-colors cursor-pointer"
                    >
                      Belgilash
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      })()}

      {/* Bildirishnomalar To'liq Ekran Sahifasi */}
      {isNotificationsModalOpen && (
        <div className="fixed inset-0 bg-white dark:bg-neutral-950 z-50 flex flex-col font-sans">
          <div className="max-w-5xl w-full mx-auto px-4 sm:px-8 lg:px-12 py-4 border-b border-neutral-100 dark:border-neutral-800 flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setIsNotificationsModalOpen(false)}
                className="p-1.5 -ml-1 text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
                title="Orqaga"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
              <h3 className="font-bold text-sm tracking-wide">
                Bildirishnomalar {notifications.length > 0 && `(${notifications.length})`}
              </h3>
            </div>

            {notifications.length > 0 && (
              <button
                onClick={clearAllNotifications}
                className="text-xs text-neutral-400 hover:text-red-500 transition-colors cursor-pointer"
              >
                Barchasini tozalash
              </button>
            )}
          </div>

          <div className="max-w-5xl w-full mx-auto px-4 sm:px-8 lg:px-12 py-6 flex-1 overflow-y-auto space-y-5">
            {notifications.length === 0 ? (
              <div className="text-center py-24 space-y-3">
                <div className="w-12 h-12 bg-neutral-100 dark:bg-neutral-900 text-neutral-400 rounded-2xl mx-auto flex items-center justify-center">
                  <Bell className="w-5 h-5 stroke-[1.75]" />
                </div>
                <h4 className="font-semibold text-sm text-neutral-800 dark:text-neutral-200">
                  Hozircha yangi bildirishnomalar yo'q
                </h4>
                <p className="text-xs text-neutral-400 max-w-sm mx-auto">
                  Sizga yangi obunachilar qo'shilganda yoki obunadagi ijodkorlar yangi hikoya chop etganda bildirishnomalar shu yerda ko'rinadi.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {notifications.map(n => {
                  const isFollow = n.type === 'follow' || n.type === 'follower';

                  return (
                    <div
                      key={n.id}
                      onClick={() => handleNotificationClick(n)}
                      className="group p-4 bg-neutral-50 dark:bg-neutral-900/60 hover:bg-neutral-100 dark:hover:bg-neutral-900 border border-neutral-100 dark:border-neutral-800/80 rounded-2xl flex items-start justify-between gap-4 cursor-pointer transition-all"
                    >
                      <div className="flex items-start space-x-3.5">
                        <div
                          className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                            isFollow
                              ? 'bg-neutral-200 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200'
                              : 'bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900'
                          }`}
                        >
                          {isFollow ? <UserPlus className="w-4 h-4" /> : <BookOpen className="w-4 h-4" />}
                        </div>
                        <div className="space-y-1">
                          <p className="text-xs sm:text-sm font-medium text-neutral-800 dark:text-neutral-200 leading-snug">
                            {n.text}
                          </p>
                          <span className="text-[11px] text-neutral-400 block">{n.time}</span>
                        </div>
                      </div>

                      <button
                        onClick={e => deleteNotification(e, n.id)}
                        className="opacity-0 group-hover:opacity-100 p-1.5 text-neutral-400 hover:text-red-500 rounded-lg transition-opacity cursor-pointer shrink-0"
                        title="O'chirish"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* To'liq ekran Qidiruv oynasi (Author profile on top, posts below) */}
      {isSearchModalOpen && (
        <div className="fixed inset-0 bg-white dark:bg-neutral-950 z-50 flex flex-col font-sans">
          <div className="max-w-5xl w-full mx-auto px-4 sm:px-8 lg:px-12 py-4 border-b border-neutral-100 dark:border-neutral-800 flex items-center space-x-3">
            <button
              onClick={() => setIsSearchModalOpen(false)}
              className="p-1.5 -ml-1 text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
              title="Orqaga"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <div className="flex-1 relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-neutral-400">
                <Search className="w-4 h-4" />
              </div>
              <input
                type="text"
                autoFocus
                value={searchModalQuery}
                onChange={e => setSearchModalQuery(e.target.value)}
                placeholder="Muallif ismi yoki sarlavha bo'yicha qidirish..."
                className="w-full pl-9 pr-8 py-2 bg-neutral-100 dark:bg-neutral-900 border border-transparent focus:border-neutral-300 dark:focus:border-neutral-700 rounded-xl text-xs text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 focus:outline-none transition-all"
              />
              {searchModalQuery && (
                <button
                  onClick={() => setSearchModalQuery('')}
                  className="absolute inset-y-0 right-0 pr-2.5 flex items-center text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          <div className="max-w-5xl w-full mx-auto px-4 sm:px-8 lg:px-12 py-6 flex-1 overflow-y-auto space-y-8">
            {!searchModalQuery.trim() ? (
              <div className="text-center py-20 space-y-2">
                <p className="text-xs text-neutral-400">Qidirish uchun muallif ismi yoki hikoya sarlavhasini kiriting</p>
              </div>
            ) : (() => {
              const q = searchModalQuery.toLowerCase().trim();

              const matchingAuthorsMap = new Map<string, { name: string; username: string; bio: string; avatar?: string }>();

              if (profile.name.toLowerCase().includes(q) || profile.username.toLowerCase().includes(q)) {
                matchingAuthorsMap.set(profile.username, {
                  name: profile.name,
                  username: profile.username,
                  bio: profile.bio,
                  avatar: profile.avatar,
                });
              }

              Object.values(KNOWN_AUTHORS).forEach(author => {
                if (author.name.toLowerCase().includes(q) || author.username.toLowerCase().includes(q)) {
                  matchingAuthorsMap.set(author.username, author);
                }
              });

              allPosts.forEach(p => {
                if (p.authorName && p.authorUsername && (p.authorName.toLowerCase().includes(q) || p.authorUsername.toLowerCase().includes(q))) {
                  if (!matchingAuthorsMap.has(p.authorUsername)) {
                    matchingAuthorsMap.set(p.authorUsername, {
                      name: p.authorName,
                      username: p.authorUsername,
                      bio: p.bio || 'Minimalist ijodkor.',
                      avatar: p.avatar,
                    });
                  }
                }
              });

              const matchingAuthors = Array.from(matchingAuthorsMap.values());
              const matchingPosts = allPosts.filter(p => p.title.toLowerCase().includes(q) || p.content.toLowerCase().includes(q));

              if (matchingAuthors.length === 0 && matchingPosts.length === 0) {
                return (
                  <div className="text-center py-20 space-y-2">
                    <p className="text-xs text-neutral-400">Hech qanday natija topilmadi.</p>
                  </div>
                );
              }

              return (
                <div className="space-y-8">
                  {/* Matching Authors Section (Appears first above posts) */}
                  {matchingAuthors.length > 0 && (
                    <div className="space-y-4">
                      <h4 className="font-bold text-xs uppercase tracking-wider text-neutral-400">Mualliflar</h4>
                      <div className="space-y-3">
                        {matchingAuthors.map(author => {
                          const authorPostsCount = allPosts.filter(p => p.authorUsername === author.username).length;
                          const authorLetter = (author.name ? author.name[0] : 'M').toUpperCase();
                          return (
                            <div
                              key={author.username}
                              onClick={() => {
                                setIsSearchModalOpen(false);
                                openAuthorProfileByUsername(author.username);
                              }}
                              className="p-4 bg-neutral-50 dark:bg-neutral-900/60 hover:bg-neutral-100 dark:hover:bg-neutral-900 border border-neutral-100 dark:border-neutral-800/80 rounded-2xl flex items-center justify-between cursor-pointer transition-all"
                            >
                              <div className="flex items-center space-x-3.5">
                                <div className="w-10 h-10 bg-neutral-200 dark:bg-neutral-800 rounded-full overflow-hidden flex items-center justify-center font-bold text-sm text-neutral-800 dark:text-neutral-200 shrink-0">
                                  {author.avatar ? (
                                    <img src={author.avatar} alt="" className="w-full h-full object-cover" />
                                  ) : (
                                    authorLetter
                                  )}
                                </div>
                                <div>
                                  <h4
                                    className="font-bold text-xs sm:text-sm text-neutral-900 dark:text-neutral-100 hover:underline"
                                    style={getAuthorNameStyle(author.username)}
                                  >
                                    {author.name}
                                  </h4>
                                  <p className="text-[11px] text-neutral-400">{author.username} • {authorPostsCount} ta hikoya</p>
                                </div>
                              </div>
                              <span className="text-xs font-medium text-neutral-500 hover:underline">Ko'rish</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Matching Posts Section (Appears below authors) */}
                  <div className="space-y-4">
                    <h4 className="font-bold text-xs uppercase tracking-wider text-neutral-400">Hikoyalar ({matchingPosts.length})</h4>
                    <div className="space-y-6 font-serif">
                      {matchingPosts.length === 0 ? (
                        <p className="text-xs text-neutral-400 font-sans">Hikoyalar topilmadi.</p>
                      ) : (
                        matchingPosts.map(post => {
                          const searchPreview = getPostLinkPreview(post);
                          const openFromSearch = () => {
                            setIsSearchModalOpen(false);
                            openCommunityPost(post);
                          };
                          return (
                            <div
                              key={post.id}
                              onClick={openFromSearch}
                              className="border-b border-neutral-100 dark:border-neutral-800 pb-6 last:border-none cursor-pointer group space-y-2 min-w-0 font-sans"
                            >
                              <div className="text-xs text-neutral-400 flex items-center space-x-2">
                                <span className="font-medium" style={getAuthorNameStyle(post.authorUsername)}>
                                  {post.authorName}
                                </span>
                                <span>•</span>
                                <span>{post.date}</span>
                              </div>
                              {searchPreview && renderLinkPreviewCard(searchPreview, true, post, openFromSearch)}
                              <p className="text-sm font-normal text-neutral-800 dark:text-neutral-200 line-clamp-3 leading-relaxed [overflow-wrap:anywhere]">
                                {renderTextWithLinks(post.content)}
                              </p>
                            </div>
                          );
                        })
                      )}
                    </div>
                  </div>
                </div>
              );
            })()}
          </div>
        </div>
      )}

        </div>
      )}

      {/* 3-bosqichli Gmail orqali parolni o'zgartirish / tiklash modali */}
      {isChangePasswordModalOpen && (
        <div
          onClick={() => setIsChangePasswordModalOpen(false)}
          className="fixed inset-0 bg-black/45 backdrop-blur-xs z-60 flex items-center justify-center p-4"
        >
          <div
            onClick={e => e.stopPropagation()}
            className="bg-white dark:bg-neutral-900 border border-neutral-100 dark:border-neutral-800 rounded-xl w-full max-w-[370px] overflow-hidden shadow-2xl font-sans"
          >
            {/* Sarlavha paneli */}
            <div className="px-4 py-3.5 border-b border-neutral-100 dark:border-neutral-800 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <button
                  type="button"
                  onClick={() => {
                    if (passwordModalStep === 'verify') {
                      setPasswordModalStep('send');
                      setPasswordCodeError('');
                    } else if (passwordModalStep === 'new_password') {
                      setPasswordModalStep('verify');
                      setNewPasswordError('');
                    } else {
                      setIsChangePasswordModalOpen(false);
                    }
                  }}
                  className="p-1 -ml-1 text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors cursor-pointer"
                  aria-label="Orqaga"
                >
                  <ArrowLeft className="w-4.5 h-4.5" />
                </button>
                <h3 className="font-semibold text-[15px] text-neutral-900 dark:text-neutral-100">
                  Parolni o&apos;zgartirish
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsChangePasswordModalOpen(false)}
                className="p-1 text-neutral-400 hover:text-neutral-800 dark:hover:text-neutral-200 transition-colors cursor-pointer"
                aria-label="Yopish"
              >
                <X className="w-4.5 h-4.5" />
              </button>
            </div>

            <div className="px-6 py-6">
              {passwordModalStep === 'send' && (
                <div className="flex flex-col items-center text-center space-y-5">
                  <div className="w-14 h-14 rounded-2xl bg-[#3390ec]/10 flex items-center justify-center">
                    <Lock className="w-7 h-7 text-[#3390ec]" />
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-[17px] font-semibold text-neutral-900 dark:text-neutral-100">
                      Gmail orqali tasdiqlash
                    </h4>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed">
                      Xavfsizlik uchun parolni o&apos;zgartirishda Gmail manzilingizga (
                      <span className="font-medium text-neutral-700 dark:text-neutral-300">{maskEmail(loginEmail)}</span>
                      ) 6 xonali tasdiqlash kodi yuboriladi.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={sendPasswordGmailCode}
                    className="w-full py-2.5 bg-[#3390ec] hover:bg-[#2a81d8] text-white text-sm font-medium rounded-lg transition-colors cursor-pointer shadow-xs"
                  >
                    Gmailga kod yuborish
                  </button>
                </div>
              )}

              {passwordModalStep === 'verify' && (
                <div className="flex flex-col items-center text-center space-y-4">
                  <div className="space-y-1">
                    <h4 className="text-[17px] font-semibold text-neutral-900 dark:text-neutral-100">
                      Gmail kodini kiriting
                    </h4>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed">
                      <span className="font-medium text-neutral-700 dark:text-neutral-300">{loginEmail}</span> manziliga yuborilgan 6 xonali tasdiqlash kodini kiriting
                    </p>
                  </div>

                  {/* Gmail xabari ko'rinishidagi tasdiqlash xati */}
                  <div className="w-full text-left rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950/60 p-3 space-y-2">
                    <div className="flex items-center justify-between text-[11px]">
                      <div className="flex items-center gap-1.5 font-semibold text-neutral-800 dark:text-neutral-200">
                        <span className="w-4 h-4 rounded-sm bg-red-500 text-white text-[10px] font-bold flex items-center justify-center">
                          G
                        </span>
                        <span>Minimalist Xavfsizlik</span>
                      </div>
                      <span className="text-neutral-400">hozir</span>
                    </div>
                    <p className="text-[11px] text-neutral-500 dark:text-neutral-400">
                      Parolingizni o&apos;zgartirish uchun tasdiqlash kodi:
                    </p>
                    <div className="flex items-center justify-between bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 rounded-lg px-3 py-1.5">
                      <span className="font-mono text-base font-bold tracking-[0.25em] text-[#3390ec] select-all">
                        {passwordGeneratedCode}
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          if (navigator.clipboard) {
                            void navigator.clipboard.writeText(passwordGeneratedCode).catch(() => {});
                          }
                        }}
                        className="text-[11px] font-medium text-neutral-500 hover:text-[#3390ec] cursor-pointer flex items-center gap-1"
                      >
                        <Copy className="w-3 h-3" />
                        <span>Nusxalash</span>
                      </button>
                    </div>
                  </div>

                  {/* 6 ta OTP katakchasi */}
                  <div className="flex items-center justify-center gap-2 pt-1">
                    {passwordCodeDigits.map((digit, idx) => (
                      <input
                        key={idx}
                        ref={el => {
                          passwordCodeInputRefs.current[idx] = el;
                        }}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        value={digit}
                        aria-label={`Gmail tasdiqlash kodi ${idx + 1}`}
                        onChange={e => {
                          const val = e.target.value.replace(/\D/g, '').slice(-1);
                          const next = [...passwordCodeDigits];
                          next[idx] = val;
                          setPasswordCodeDigits(next);
                          if (passwordCodeError) setPasswordCodeError('');
                          if (val && idx < 5) {
                            passwordCodeInputRefs.current[idx + 1]?.focus();
                          }
                          if (next.every(d => d !== '')) {
                            verifyPasswordGmailCode(next);
                          }
                        }}
                        onKeyDown={e => {
                          if (e.key === 'Backspace' && !passwordCodeDigits[idx] && idx > 0) {
                            const next = [...passwordCodeDigits];
                            next[idx - 1] = '';
                            setPasswordCodeDigits(next);
                            passwordCodeInputRefs.current[idx - 1]?.focus();
                          }
                        }}
                        onPaste={e => {
                          e.preventDefault();
                          const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
                          if (!pasted) return;
                          const next = Array.from({ length: 6 }, (_, i) => pasted[i] || '');
                          setPasswordCodeDigits(next);
                          if (passwordCodeError) setPasswordCodeError('');
                          const focusIdx = Math.min(5, pasted.length);
                          passwordCodeInputRefs.current[focusIdx]?.focus();
                          if (pasted.length === 6) {
                            verifyPasswordGmailCode(next);
                          }
                        }}
                        className={`w-10 h-12 rounded-lg text-center text-base font-semibold tabular-nums border-2 transition-colors focus:outline-none ${
                          passwordCodeError
                            ? 'border-red-400 bg-red-50/40 dark:bg-red-950/30 text-neutral-900 dark:text-neutral-100'
                            : 'border-neutral-200 dark:border-neutral-700 bg-neutral-100/80 dark:bg-neutral-800/80 focus:border-[#3390ec] focus:bg-white dark:focus:bg-neutral-900 text-neutral-900 dark:text-neutral-100'
                        }`}
                      />
                    ))}
                  </div>

                  {passwordCodeError && (
                    <p className="text-[11px] text-red-500">{passwordCodeError}</p>
                  )}

                  <div className="pt-1">
                    {passwordResendCooldown > 0 ? (
                      <p className="text-[11px] text-neutral-400 tabular-nums">
                        {passwordResendCooldown} soniyadan keyin qayta yuborish mumkin
                      </p>
                    ) : (
                      <button
                        type="button"
                        onClick={sendPasswordGmailCode}
                        className="text-xs font-medium text-[#3390ec] hover:underline cursor-pointer"
                      >
                        Kodni qayta yuborish
                      </button>
                    )}
                  </div>
                </div>
              )}

              {passwordModalStep === 'new_password' && (
                <div className="space-y-4">
                  <div className="text-center space-y-1.5">
                    <div className="w-11 h-11 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 mx-auto flex items-center justify-center mb-2">
                      <Check className="w-5 h-5 stroke-[2.5]" />
                    </div>
                    <h4 className="text-[17px] font-semibold text-neutral-900 dark:text-neutral-100">
                      Yangi parol o&apos;rnating
                    </h4>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400">
                      Kamida 6 ta belgidan iborat yangi parol kiriting
                    </p>
                  </div>

                  <div className="space-y-3.5 pt-1">
                    <div>
                      <label className="block text-[12px] font-medium text-[#3390ec] mb-1">
                        Yangi parol
                      </label>
                      <div className="relative">
                        <input
                          type={showNewPassword ? 'text' : 'password'}
                          autoFocus
                          value={newPasswordInput}
                          onChange={e => {
                            setNewPasswordInput(e.target.value);
                            if (newPasswordError) setNewPasswordError('');
                          }}
                          placeholder="Kamida 6 ta belgi"
                          className="w-full pr-8 pb-1.5 bg-transparent border-b-2 border-[#3390ec] text-sm text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 focus:outline-none"
                        />
                        <button
                          type="button"
                          onClick={() => setShowNewPassword(prev => !prev)}
                          className="p-1 text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 absolute right-0 top-0 cursor-pointer"
                          aria-label={showNewPassword ? 'Yashirish' : "Ko'rsatish"}
                        >
                          {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-[12px] font-medium text-neutral-500 dark:text-neutral-400 mb-1">
                        Yangi parolni tasdiqlang
                      </label>
                      <input
                        type={showNewPassword ? 'text' : 'password'}
                        value={confirmNewPasswordInput}
                        onChange={e => {
                          setConfirmNewPasswordInput(e.target.value);
                          if (newPasswordError) setNewPasswordError('');
                        }}
                        onKeyDown={e => e.key === 'Enter' && saveNewPassword()}
                        placeholder="Parolni qayta kiriting"
                        className="w-full pb-1.5 bg-transparent border-b border-neutral-200 dark:border-neutral-700 focus:border-[#3390ec] text-sm text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 focus:outline-none transition-colors"
                      />
                    </div>

                    {newPasswordError && (
                      <p className="text-[11px] text-red-500">{newPasswordError}</p>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={saveNewPassword}
                    className="w-full py-2.5 bg-[#3390ec] hover:bg-[#2a81d8] text-white text-sm font-medium rounded-lg transition-colors cursor-pointer shadow-xs"
                  >
                    Parolni saqlash
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 3-bosqichli Gmail orqali hisobni o'chirish modali */}
      {isDeleteAccountModalOpen && (
        <div
          onClick={() => setIsDeleteAccountModalOpen(false)}
          className="fixed inset-0 bg-black/45 backdrop-blur-xs z-60 flex items-center justify-center p-4"
        >
          <div
            onClick={e => e.stopPropagation()}
            className="bg-white dark:bg-neutral-900 border border-neutral-100 dark:border-neutral-800 rounded-xl w-full max-w-[370px] overflow-hidden shadow-2xl font-sans"
          >
            {/* Sarlavha paneli */}
            <div className="px-4 py-3.5 border-b border-neutral-100 dark:border-neutral-800 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <button
                  type="button"
                  onClick={() => {
                    if (deleteAccountModalStep === 'verify') {
                      setDeleteAccountModalStep('send');
                      setDeleteAccountCodeError('');
                    } else if (deleteAccountModalStep === 'confirm') {
                      setDeleteAccountModalStep('verify');
                    } else {
                      setIsDeleteAccountModalOpen(false);
                    }
                  }}
                  className="p-1 -ml-1 text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors cursor-pointer"
                  aria-label="Orqaga"
                >
                  <ArrowLeft className="w-4.5 h-4.5" />
                </button>
                <h3 className="font-semibold text-[15px] text-neutral-900 dark:text-neutral-100">
                  Hisobni o&apos;chirish
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsDeleteAccountModalOpen(false)}
                className="p-1 text-neutral-400 hover:text-neutral-800 dark:hover:text-neutral-200 transition-colors cursor-pointer"
                aria-label="Yopish"
              >
                <X className="w-4.5 h-4.5" />
              </button>
            </div>

            <div className="px-6 py-6">
              {deleteAccountModalStep === 'send' && (
                <div className="flex flex-col items-center text-center space-y-5">
                  <div className="w-14 h-14 rounded-2xl bg-red-500/10 flex items-center justify-center">
                    <Trash2 className="w-7 h-7 text-red-500" />
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-[17px] font-semibold text-neutral-900 dark:text-neutral-100">
                      Gmail orqali tasdiqlash
                    </h4>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed">
                      Hisobingiz o&apos;chirilsa, barcha hikoyalaringiz va profil ma&apos;lumotlaringiz butunlay yo&apos;qoladi. Tasdiqlash uchun Gmail manzilingizga (
                      <span className="font-medium text-neutral-700 dark:text-neutral-300">{maskEmail(loginEmail)}</span>
                      ) 6 xonali kod yuboriladi.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={sendDeleteAccountGmailCode}
                    className="w-full py-2.5 bg-red-500 hover:bg-red-600 text-white text-sm font-medium rounded-lg transition-colors cursor-pointer shadow-xs"
                  >
                    Gmailga kod yuborish
                  </button>
                </div>
              )}

              {deleteAccountModalStep === 'verify' && (
                <div className="flex flex-col items-center text-center space-y-4">
                  <div className="space-y-1">
                    <h4 className="text-[17px] font-semibold text-neutral-900 dark:text-neutral-100">
                      Gmail kodini kiriting
                    </h4>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed">
                      <span className="font-medium text-neutral-700 dark:text-neutral-300">{loginEmail}</span> manziliga yuborilgan 6 xonali tasdiqlash kodini kiriting
                    </p>
                  </div>

                  {/* Gmail xabari ko'rinishidagi tasdiqlash xati */}
                  <div className="w-full text-left rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950/60 p-3 space-y-2">
                    <div className="flex items-center justify-between text-[11px]">
                      <div className="flex items-center gap-1.5 font-semibold text-neutral-800 dark:text-neutral-200">
                        <span className="w-4 h-4 rounded-sm bg-red-500 text-white text-[10px] font-bold flex items-center justify-center">
                          G
                        </span>
                        <span>Minimalist Xavfsizlik</span>
                      </div>
                      <span className="text-neutral-400">hozir</span>
                    </div>
                    <p className="text-[11px] text-neutral-500 dark:text-neutral-400">
                      Hisobingizni butunlay o&apos;chirish uchun tasdiqlash kodi:
                    </p>
                    <div className="flex items-center justify-between bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 rounded-lg px-3 py-1.5">
                      <span className="font-mono text-base font-bold tracking-[0.25em] text-red-500 select-all">
                        {deleteAccountGeneratedCode}
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          if (navigator.clipboard) {
                            void navigator.clipboard.writeText(deleteAccountGeneratedCode).catch(() => {});
                          }
                        }}
                        className="text-[11px] font-medium text-neutral-500 hover:text-red-500 cursor-pointer flex items-center gap-1"
                      >
                        <Copy className="w-3 h-3" />
                        <span>Nusxalash</span>
                      </button>
                    </div>
                  </div>

                  {/* 6 ta OTP katakchasi */}
                  <div className="flex items-center justify-center gap-2 pt-1">
                    {deleteAccountCodeDigits.map((digit, idx) => (
                      <input
                        key={idx}
                        ref={el => {
                          deleteAccountCodeInputRefs.current[idx] = el;
                        }}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        value={digit}
                        aria-label={`Hisobni o'chirish Gmail kodi ${idx + 1}`}
                        onChange={e => {
                          const val = e.target.value.replace(/\D/g, '').slice(-1);
                          const next = [...deleteAccountCodeDigits];
                          next[idx] = val;
                          setDeleteAccountCodeDigits(next);
                          if (deleteAccountCodeError) setDeleteAccountCodeError('');
                          if (val && idx < 5) {
                            deleteAccountCodeInputRefs.current[idx + 1]?.focus();
                          }
                          if (next.every(d => d !== '')) {
                            verifyDeleteAccountGmailCode(next);
                          }
                        }}
                        onKeyDown={e => {
                          if (e.key === 'Backspace' && !deleteAccountCodeDigits[idx] && idx > 0) {
                            const next = [...deleteAccountCodeDigits];
                            next[idx - 1] = '';
                            setDeleteAccountCodeDigits(next);
                            deleteAccountCodeInputRefs.current[idx - 1]?.focus();
                          }
                        }}
                        onPaste={e => {
                          e.preventDefault();
                          const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
                          if (!pasted) return;
                          const next = Array.from({ length: 6 }, (_, i) => pasted[i] || '');
                          setDeleteAccountCodeDigits(next);
                          if (deleteAccountCodeError) setDeleteAccountCodeError('');
                          const focusIdx = Math.min(5, pasted.length);
                          deleteAccountCodeInputRefs.current[focusIdx]?.focus();
                          if (pasted.length === 6) {
                            verifyDeleteAccountGmailCode(next);
                          }
                        }}
                        className={`w-10 h-12 rounded-lg text-center text-base font-semibold tabular-nums border-2 transition-colors focus:outline-none ${
                          deleteAccountCodeError
                            ? 'border-red-400 bg-red-50/40 dark:bg-red-950/30 text-neutral-900 dark:text-neutral-100'
                            : 'border-neutral-200 dark:border-neutral-700 bg-neutral-100/80 dark:bg-neutral-800/80 focus:border-red-500 focus:bg-white dark:focus:bg-neutral-900 text-neutral-900 dark:text-neutral-100'
                        }`}
                      />
                    ))}
                  </div>

                  {deleteAccountCodeError && (
                    <p className="text-[11px] text-red-500">{deleteAccountCodeError}</p>
                  )}

                  <div className="pt-1">
                    {deleteAccountResendCooldown > 0 ? (
                      <p className="text-[11px] text-neutral-400 tabular-nums">
                        {deleteAccountResendCooldown} soniyadan keyin qayta yuborish mumkin
                      </p>
                    ) : (
                      <button
                        type="button"
                        onClick={sendDeleteAccountGmailCode}
                        className="text-xs font-medium text-[#3390ec] hover:underline cursor-pointer"
                      >
                        Kodni qayta yuborish
                      </button>
                    )}
                  </div>
                </div>
              )}

              {deleteAccountModalStep === 'confirm' && (
                <div className="space-y-4">
                  <div className="text-center space-y-1.5">
                    <div className="w-12 h-12 rounded-full bg-red-500/10 text-red-500 mx-auto flex items-center justify-center mb-2">
                      <Trash2 className="w-5 h-5" />
                    </div>
                    <h4 className="text-[17px] font-semibold text-neutral-900 dark:text-neutral-100">
                      Hisobni o&apos;chirishni tasdiqlang
                    </h4>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed">
                      Kod tasdiqlandi. <span className="font-medium text-neutral-800 dark:text-neutral-200">{profile.username}</span> hisobi, {posts.length} ta hikoya va barcha sozlamalar qaytarib bo&apos;lmaydigan tarzda o&apos;chiriladi.
                    </p>
                  </div>

                  <div className="flex items-center gap-2.5 pt-1">
                    <button
                      type="button"
                      onClick={() => setIsDeleteAccountModalOpen(false)}
                      className="flex-1 py-2.5 rounded-lg border border-neutral-200 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800 text-xs font-medium transition-colors cursor-pointer"
                    >
                      Bekor qilish
                    </button>
                    <button
                      type="button"
                      onClick={confirmDeleteAccount}
                      className="flex-1 py-2.5 rounded-lg bg-red-500 hover:bg-red-600 text-white text-xs font-medium transition-colors cursor-pointer shadow-xs"
                    >
                      Ha, hisobni o&apos;chirish
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Profil rasmini kattalashtirib ko'rish oynasi (Telegram uslubida) */}
      {photoLightbox && (
        <div
          onClick={() => setPhotoLightbox(null)}
          className="fixed inset-0 bg-black/85 backdrop-blur-xs z-[70] flex flex-col items-center justify-center p-4 font-sans select-none"
        >
          {/* Yuqori boshqaruv paneli */}
          <div
            onClick={e => e.stopPropagation()}
            className="absolute top-4 left-4 right-4 flex items-center justify-between text-white"
          >
            <div className="text-xs font-medium text-white/80 tabular-nums px-2">
              {photoLightbox.photos.length > 1
                ? `${photoLightbox.index + 1} / ${photoLightbox.photos.length}`
                : ''}
            </div>

            <div className="flex items-center space-x-2">
              {photoLightbox.isOwn && photoLightbox.photos.length > 0 && (
                <>
                  {photoLightbox.photos[photoLightbox.index] !== profile.avatar && (
                    <button
                      type="button"
                      onClick={() => {
                        const chosen = photoLightbox.photos[photoLightbox.index];
                        setProfile(prev => ({ ...prev, avatar: chosen }));
                        setPosts(prev => prev.map(p => ({ ...p, avatar: chosen })));
                      }}
                      className="px-3 py-1.5 rounded-full bg-white/15 hover:bg-white/25 text-xs font-medium text-white transition-colors cursor-pointer"
                    >
                      Asosiy qilish
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => {
                      const target = photoLightbox.photos[photoLightbox.index];
                      const nextPhotos = photoLightbox.photos.filter((_, i) => i !== photoLightbox.index);
                      setProfilePhotos(nextPhotos);
                      if (profile.avatar === target) {
                        const fallbackAvatar = nextPhotos[0] || '';
                        setProfile(prev => ({ ...prev, avatar: fallbackAvatar }));
                        setPosts(prev => prev.map(p => ({ ...p, avatar: fallbackAvatar })));
                      }
                      if (nextPhotos.length === 0) {
                        setPhotoLightbox(null);
                      } else {
                        setPhotoLightbox(prev =>
                          prev
                            ? {
                                ...prev,
                                photos: nextPhotos,
                                index: Math.min(prev.index, nextPhotos.length - 1),
                              }
                            : null
                        );
                      }
                    }}
                    className="p-2 rounded-full bg-white/15 hover:bg-red-500/80 text-white transition-colors cursor-pointer"
                    title="Rasmni o'chirish"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </>
              )}
              <button
                type="button"
                onClick={() => setPhotoLightbox(null)}
                className="p-2 rounded-full bg-white/15 hover:bg-white/25 text-white transition-colors cursor-pointer"
                aria-label="Yopish"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Kattalashtirilgan rasm konteyneri */}
          <div
            onClick={e => e.stopPropagation()}
            className="relative max-w-[min(88vw,520px)] w-full aspect-square bg-neutral-900 rounded-sm overflow-hidden shadow-2xl flex items-center justify-center"
          >
            {photoLightbox.photos.length > 0 ? (
              <img
                src={photoLightbox.photos[photoLightbox.index]}
                alt={photoLightbox.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-neutral-800 flex items-center justify-center text-white text-6xl font-bold">
                {photoLightbox.initials}
              </div>
            )}

            {/* Pastki qismdagi ism yozuvi */}
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-black/75 via-black/30 to-transparent flex items-end justify-center pb-5 px-4">
              <p className="text-white text-lg font-semibold tracking-tight drop-shadow-sm truncate">
                {photoLightbox.name}
              </p>
            </div>

            {/* Bir nechta rasm bo'lsa chap/o'ng tugmalar */}
            {photoLightbox.photos.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={() =>
                    setPhotoLightbox(prev =>
                      prev ? { ...prev, index: (prev.index - 1 + prev.photos.length) % prev.photos.length } : null
                    )
                  }
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/45 hover:bg-black/70 text-white flex items-center justify-center transition-colors cursor-pointer"
                  aria-label="Oldingi rasm"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setPhotoLightbox(prev =>
                      prev ? { ...prev, index: (prev.index + 1) % prev.photos.length } : null
                    )
                  }
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/45 hover:bg-black/70 text-white flex items-center justify-center transition-colors cursor-pointer"
                  aria-label="Keyingi rasm"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </>
            )}
          </div>
        </div>
      )}

      {/* WhatsApp-uslubidagi havola rasmini kattalashtirib ko'rish (pastida qisqa matni va davomini o'qish bilan) */}
      {linkImageLightbox && (() => {
        const targetPost = linkImageLightbox.post;
        const rawCaptionSource = targetPost
          ? targetPost.content
              .replace(/https?:\/\/[^\s<>"'`]+/gi, ' ')
              .replace(/\s+/g, ' ')
              .trim() || targetPost.content.replace(/\s+/g, ' ').trim()
          : (linkImageLightbox.description || '').replace(/\s+/g, ' ').trim();

        const maxSnippetChars = 155;
        let snippetText = rawCaptionSource;
        let isClipped = false;
        if (snippetText.length > maxSnippetChars) {
          const cut = snippetText.slice(0, maxSnippetChars);
          const lastSpace = cut.lastIndexOf(' ');
          snippetText = (lastSpace > 90 ? cut.slice(0, lastSpace) : cut).trimEnd();
          isClipped = true;
        }

        return (
          <div
            onClick={() => setLinkImageLightbox(null)}
            className="fixed inset-0 z-[90] bg-black/95 backdrop-blur-xs flex flex-col justify-between select-none font-sans"
          >
            {/* Yuqori panel */}
            <div
              onClick={e => e.stopPropagation()}
              className="flex items-center justify-between px-4 sm:px-6 py-3.5 text-white shrink-0"
            >
              <div className="flex items-center space-x-3 min-w-0">
                {targetPost ? (
                  <>
                    <div className="w-8 h-8 rounded-full bg-white/10 overflow-hidden flex items-center justify-center text-xs font-medium shrink-0">
                      {targetPost.avatar ? (
                        <img src={targetPost.avatar} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <span>{(targetPost.authorName || profile.name)[0]?.toUpperCase() || 'M'}</span>
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="text-[13.5px] font-medium truncate leading-tight">
                        {targetPost.authorName || profile.name}
                      </p>
                      <p className="text-[11.5px] text-white/60 truncate">
                        {targetPost.date} · {linkImageLightbox.domain}
                      </p>
                    </div>
                  </>
                ) : (
                  <div className="min-w-0">
                    <p className="text-[13.5px] font-medium truncate">
                      {linkImageLightbox.domain}
                    </p>
                  </div>
                )}
              </div>

              <div className="flex items-center space-x-2 shrink-0">
                <a
                  href={linkImageLightbox.linkUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-2.5 py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white text-xs flex items-center space-x-1.5 transition-colors no-underline"
                  title="Havolani ochish"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Havola</span>
                </a>
                <button
                  type="button"
                  onClick={() => setLinkImageLightbox(null)}
                  className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
                  aria-label="Yopish"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Markaziy kattalashtirilgan rasm yoki YouTube video pleyer */}
            <div className="flex-1 min-h-0 flex items-center justify-center px-3 sm:px-8 py-2">
              {(() => {
                const ytId = extractYoutubeVideoId(linkImageLightbox.linkUrl);
                if (ytId && linkImageLightbox.embeddable !== false && !ytEmbedFailed) {
                  return (
                    <div
                      onClick={e => e.stopPropagation()}
                      className="w-full max-w-4xl aspect-video bg-black rounded-md overflow-hidden shadow-2xl"
                    >
                      <iframe
                        src={`https://www.youtube.com/embed/${ytId}?autoplay=1&rel=0&enablejsapi=1&playsinline=1`}
                        title={linkImageLightbox.title || 'YouTube video'}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        allowFullScreen
                        onLoad={e => {
                          try {
                            e.currentTarget.contentWindow?.postMessage(
                              JSON.stringify({ event: 'listening', id: 1 }),
                              '*'
                            );
                          } catch {
                            // ignore cross-origin postMessage init errors
                          }
                        }}
                        className="w-full h-full border-0"
                      />
                    </div>
                  );
                }
                if (ytId) {
                  return (
                    <div
                      onClick={e => e.stopPropagation()}
                      className="relative w-full max-w-4xl aspect-video bg-neutral-950 rounded-md overflow-hidden shadow-2xl flex items-center justify-center"
                    >
                      <img
                        src={linkImageLightbox.imageUrl}
                        alt={linkImageLightbox.title || linkImageLightbox.domain}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover opacity-55"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/45 to-black/35 flex flex-col items-center justify-center px-4 text-center space-y-3">
                        <a
                          href={linkImageLightbox.linkUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-full bg-white text-neutral-900 hover:bg-neutral-100 text-sm font-medium shadow-lg transition-colors no-underline"
                        >
                          <Play className="w-4 h-4 fill-neutral-900 shrink-0" />
                          <span>YouTube&apos;da tomosha qilish</span>
                          <ExternalLink className="w-3.5 h-3.5 text-neutral-500 shrink-0" />
                        </a>
                        <p className="text-xs text-white/75 max-w-md">
                          Video egasi boshqa saytlarda ijro etishni cheklagan
                        </p>
                      </div>
                    </div>
                  );
                }
                return (
                  <img
                    src={linkImageLightbox.imageUrl}
                    alt={linkImageLightbox.title || linkImageLightbox.domain}
                    referrerPolicy="no-referrer"
                    onClick={e => e.stopPropagation()}
                    className="max-w-full max-h-full object-contain rounded-sm shadow-2xl"
                  />
                );
              })()}
            </div>

            {/* Pastki qisqa matn va (davomini o'qish) */}
            <div
              onClick={e => e.stopPropagation()}
              className="shrink-0 bg-gradient-to-t from-black via-black/90 to-transparent px-4 sm:px-8 pt-4 pb-5"
            >
              <div className="max-w-2xl mx-auto text-center space-y-1">
                {linkImageLightbox.title && (
                  <p className="text-[13px] font-medium text-white/95 line-clamp-1 [overflow-wrap:anywhere]">
                    {linkImageLightbox.title}
                  </p>
                )}
                {(snippetText || targetPost) && (
                  <p className="text-[13.5px] sm:text-sm font-normal text-white/85 leading-relaxed [overflow-wrap:anywhere]">
                    {snippetText}
                    {isClipped ? '... ' : targetPost ? ' ' : ''}
                    {targetPost && (
                      <button
                        type="button"
                        onClick={() => {
                          const selectedPost = targetPost;
                          setLinkImageLightbox(null);
                          if (!viewingPost || viewingPost.id !== selectedPost.id) {
                            openCommunityPost(selectedPost);
                          }
                        }}
                        className="text-[#58a6ff] hover:underline font-normal cursor-pointer inline"
                      >
                        (davomini o&apos;qish)
                      </button>
                    )}
                  </p>
                )}
              </div>
            </div>
          </div>
        );
      })()}

    </>
  );
}
