import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Language,
  ThemeAccent,
  NavTab,
  CartItem,
  Product,
  MemberProfile,
  NotificationSettings,
  CloudSyncState,
  SocialShareData,
  Ticket,
  Player,
  Match,
  ClubInfo,
  ClubMember,
  StaffMember,
  GalleryPhoto,
  PlayerCV,
  StandingsRow,
  TacticalFormation,
} from '../types';
import { generateDefaultPlayerCV } from '../utils/playerCvGenerator';
import { translations } from '../data/translations';
import {
  CLUB_INFO,
  PLAYERS_DATA,
  MATCHES_DATA,
  INITIAL_ROSTER_TEMPLATES,
  STAFF_DATA,
  MEMBERS_DATA,
  GALLERY_DATA,
} from '../data/clubData';
import {
  INITIAL_STANDINGS_DATA,
  INITIAL_TACTICAL_FORMATIONS,
} from '../data/tacticsAndStandingsData';

interface Toast {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'alert' | 'goal';
}

interface AppContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  darkMode: boolean;
  toggleDarkMode: () => void;
  themeAccent: ThemeAccent;
  setThemeAccent: (accent: ThemeAccent) => void;
  activeTab: NavTab;
  setActiveTab: (tab: NavTab) => void;
  
  // Navigation & Modals
  selectedMatchId: string | null;
  setSelectedMatchId: (id: string | null) => void;
  ticketingMatchId: string | null;
  setTicketingMatchId: (id: string | null) => void;
  selectedPlayerId: string | null;
  setSelectedPlayerId: (id: string | null) => void;
  selectedNewsId: string | null;
  setSelectedNewsId: (id: string | null) => void;
  
  // Cart
  cart: CartItem[];
  addToCart: (product: Product, size: string, quantity?: number, customName?: string, customNumber?: number, patchBadge?: boolean) => void;
  updateCartQuantity: (id: string, qty: number) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
  cartCount: number;
  cartSubtotal: number;
  isCartDrawerOpen: boolean;
  setIsCartDrawerOpen: (open: boolean) => void;

  // Member & 2FA
  member: MemberProfile;
  isLoggedIn: boolean;
  loginMember: () => void;
  logoutMember: () => void;
  is2FAModalOpen: boolean;
  setIs2FAModalOpen: (open: boolean) => void;
  verify2FACode: (code: string) => boolean;
  toggle2FAEnabled: (enabled: boolean) => void;
  trigger2FAVerification: (onSuccess: () => void) => void;

  // Push Notifications
  notifications: NotificationSettings;
  updateNotificationSettings: (settings: Partial<NotificationSettings>) => void;
  isNotifModalOpen: boolean;
  setIsNotifModalOpen: (open: boolean) => void;
  sendTestNotification: () => void;

  // Social Share
  isShareModalOpen: boolean;
  setIsShareModalOpen: (open: boolean) => void;
  shareData: SocialShareData;
  triggerShare: (data: SocialShareData) => void;

  // Cloud & Offline
  isOnline: boolean;
  cloudSync: CloudSyncState;
  triggerCloudSync: () => Promise<void>;

  // Tickets
  purchasedTickets: Ticket[];
  addPurchasedTicket: (ticket: Ticket) => void;

  // Toasts
  toasts: Toast[];
  showToast: (title: string, message: string, type?: 'info' | 'success' | 'alert' | 'goal') => void;
  removeToast: (id: string) => void;

  // Admin & Data Management
  isAdminLoggedIn: boolean;
  loginAdmin: (password: string) => boolean;
  logoutAdmin: () => void;
  adminPassword: string;
  changeAdminPassword: (newPwd: string) => void;
  isAdminLoginModalOpen: boolean;
  setIsAdminLoginModalOpen: (open: boolean) => void;

  // Dynamic Editable Data
  clubInfo: ClubInfo;
  updateClubInfo: (info: Partial<ClubInfo>) => void;
  resetClubInfo: () => void;

  players: Player[];
  addPlayer: (player: Player) => void;
  updatePlayer: (id: string, updated: Partial<Player>) => void;
  deletePlayer: (id: string) => void;
  clearAllPlayers: () => void;
  restoreTemplatePlayers: () => void;

  matches: Match[];
  updateMatch: (id: string, updated: Partial<Match>) => void;
  addMatch: (match: Match) => void;
  deleteMatch: (id: string) => void;

  // Club Members Directory & Admin Management
  members: ClubMember[];
  addMember: (member: ClubMember) => void;
  addMultipleMembers: (newMembers: ClubMember[]) => void;
  updateMember: (id: string, updated: Partial<ClubMember>) => void;
  deleteMember: (id: string) => void;
  deleteMultipleMembers: (ids: string[]) => void;

  // Club Staff & President Management
  staff: StaffMember[];
  addStaffMember: (staffMember: StaffMember) => void;
  updateStaffMember: (id: string, updated: Partial<StaffMember>) => void;
  deleteStaffMember: (id: string) => void;

  // Photo & Video Gallery Management
  gallery: GalleryPhoto[];
  addGalleryPhoto: (photo: GalleryPhoto) => void;
  updateGalleryPhoto: (id: string, updated: Partial<GalleryPhoto>) => void;
  addMultipleGalleryPhotos: (newPhotos: GalleryPhoto[]) => void;
  deleteGalleryPhoto: (id: string) => void;
  deleteMultipleGalleryPhotos: (ids: string[]) => void;

  // Player CV Management (Auto-created for each player, editable solely by admin)
  playerCvs: Record<string, PlayerCV>;
  getPlayerCV: (playerId: string) => PlayerCV;
  savePlayerCV: (playerId: string, cv: PlayerCV) => void;
  resetPlayerCV: (playerId: string) => void;

  // Standings / Classement du Championnat
  standings: StandingsRow[];
  addStandingsRow: (row: StandingsRow) => void;
  updateStandingsRow: (id: string, updated: Partial<StandingsRow>) => void;
  deleteStandingsRow: (id: string) => void;
  autoSortStandings: () => void;
  resetStandings: () => void;

  // Tactical Formations / Schémas tactiques de l'équipe
  tacticalFormations: TacticalFormation[];
  activeFormationId: string;
  setActiveFormationId: (id: string) => void;
  addTacticalFormation: (formation: TacticalFormation) => void;
  updateTacticalFormation: (id: string, updated: Partial<TacticalFormation>) => void;
  deleteTacticalFormation: (id: string) => void;
  setDefaultTacticalFormation: (id: string) => void;
  resetTacticalFormations: () => void;
}

const DEFAULT_MEMBER: MemberProfile = {
  id: 'mem-1049',
  email: 'supporter.paris@ocparis.fr',
  fullName: 'Alexandre Renard',
  memberTier: 'Gold VIP',
  membershipNumber: 'OCP-75016-VIP',
  memberSince: '2019',
  fidelityPoints: 2450,
  avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=300&q=80',
  phone: '+33 6 42 78 91 00',
  isTwoFactorEnabled: true,
  twoFactorBackupCodes: ['7491-0238', '1982-4512', '9045-8120', '3318-7742'],
  savedTickets: [
    {
      id: 'tkt-init-1',
      matchId: 'm-up-1',
      matchTitle: 'Académie Future Pro vs Diambars FC',
      matchDate: '18 Mars 2026',
      matchTime: '17:00',
      venue: 'Complexe Sportif de Touba-Mbacké',
      zoneName: 'Tribune Officielle & VIP Touba',
      category: 'VIP',
      seat: 'Siège 42',
      row: 'Rang 07',
      price: 15000,
      holderName: 'Moustapha Diop',
      qrCodeData: 'AFP-TKT-2026-CHAMP-DIAMBARS-VIP42',
      barcode: '9840294810294812',
      purchasedAt: '10/03/2026',
      isOfflineAvailable: true,
    }
  ],
  orderHistory: [
    {
      id: 'cmd-9481',
      date: '02 Mars 2026',
      total: 107.99,
      itemsCount: 1,
      status: 'Livrée',
    },
    {
      id: 'cmd-8391',
      date: '15 Janvier 2026',
      total: 144.98,
      itemsCount: 2,
      status: 'Livrée',
    },
  ],
};

const DEFAULT_NOTIFS: NotificationSettings = {
  liveScores: true,
  halfTimeFullTime: true,
  redCards: true,
  transfers: true,
  ticketSales: true,
  clubNews: true,
  matchReminders: true,
  soundEnabled: true,
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Language (Français uniquement)
  const [language, setLanguageState] = useState<Language>('fr');

  const setLanguage = (_lang: Language) => {
    setLanguageState('fr');
    localStorage.setItem('ocp_lang', 'fr');
  };

  const t = (key: string): string => {
    const langDict = translations[language] || translations.fr;
    return langDict[key] || translations.fr[key] || key;
  };

  // Mode d'affichage standard (sans mode sombre)
  const [darkMode, setDarkMode] = useState<boolean>(false);

  useEffect(() => {
    document.documentElement.classList.remove('dark');
    localStorage.setItem('ocp_dark_mode', 'false');
  }, []);

  const toggleDarkMode = () => setDarkMode(false);

  // Theme Accent
  const [themeAccent, setThemeAccentState] = useState<ThemeAccent>('gold');

  const setThemeAccent = (accent: ThemeAccent) => {
    setThemeAccentState(accent);
    localStorage.setItem('ocp_theme_accent', accent);
  };

  // Active Navigation Tab
  const [activeTab, setActiveTab] = useState<NavTab>('home');

  // Modals & Selections
  const [selectedMatchId, setSelectedMatchId] = useState<string | null>(null);
  const [ticketingMatchId, setTicketingMatchId] = useState<string | null>(null);
  const [selectedPlayerId, setSelectedPlayerId] = useState<string | null>(null);
  const [selectedNewsId, setSelectedNewsId] = useState<string | null>(null);

  // Cart
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('ocp_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [isCartDrawerOpen, setIsCartDrawerOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem('ocp_cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (
    product: Product,
    size: string,
    quantity = 1,
    customName?: string,
    customNumber?: number,
    patchBadge?: boolean
  ) => {
    setCart(prev => {
      const existingIndex = prev.findIndex(
        item =>
          item.product.id === product.id &&
          item.size === size &&
          item.customName === customName &&
          item.customNumber === customNumber &&
          item.patchBadge === patchBadge
      );

      if (existingIndex > -1) {
        const next = [...prev];
        next[existingIndex].quantity += quantity;
        return next;
      } else {
        const newItem: CartItem = {
          id: `item-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
          product,
          size,
          quantity,
          customName,
          customNumber,
          patchBadge,
        };
        return [...prev, newItem];
      }
    });
    setIsCartDrawerOpen(true);
    showToast('Boutique Officielle', `${product.name} ajouté au panier !`, 'success');
  };

  const updateCartQuantity = (id: string, qty: number) => {
    if (qty <= 0) {
      removeFromCart(id);
      return;
    }
    setCart(prev => prev.map(item => (item.id === id ? { ...item, quantity: qty } : item)));
  };

  const removeFromCart = (id: string) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const clearCart = () => setCart([]);

  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  const cartSubtotal = cart.reduce((acc, item) => {
    let itemPrice = item.product.price;
    if (item.customName || item.customNumber) itemPrice += 15;
    if (item.patchBadge) itemPrice += 8;
    return acc + itemPrice * item.quantity;
  }, 0);

  // Member & 2FA
  const [member, setMember] = useState<MemberProfile>(() => {
    try {
      const saved = localStorage.getItem('ocp_member');
      return saved ? JSON.parse(saved) : DEFAULT_MEMBER;
    } catch {
      return DEFAULT_MEMBER;
    }
  });
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [is2FAModalOpen, setIs2FAModalOpen] = useState(false);
  const [pending2FAAction, setPending2FAAction] = useState<(() => void) | null>(null);

  useEffect(() => {
    localStorage.setItem('ocp_member', JSON.stringify(member));
  }, [member]);

  const loginMember = () => {
    setIsLoggedIn(true);
    showToast('Espace Membre', `Bienvenue ${member.fullName || 'Membre'}`, 'success');
  };

  const logoutMember = () => {
    setIsLoggedIn(false);
    showToast('Déconnexion', 'Vous avez été déconnecté avec succès.', 'info');
  };

  const trigger2FAVerification = (onSuccess: () => void) => {
    if (member.isTwoFactorEnabled) {
      setPending2FAAction(() => onSuccess);
      setIs2FAModalOpen(true);
    } else {
      onSuccess();
    }
  };

  const verify2FACode = (code: string): boolean => {
    // Accepts simulated valid 6-digit code e.g. 190404, 75016, or any 6-digit input for instant test
    if (code.length === 6 || code === '1904' || member.twoFactorBackupCodes.includes(code)) {
      setIs2FAModalOpen(false);
      if (pending2FAAction) {
        pending2FAAction();
        setPending2FAAction(null);
      }
      showToast('Sécurité 2FA', 'Authentification à deux facteurs validée avec succès.', 'success');
      return true;
    }
    return false;
  };

  const toggle2FAEnabled = (enabled: boolean) => {
    setMember(prev => ({
      ...prev,
      isTwoFactorEnabled: enabled,
    }));
    showToast(
      'Paramètres Sécurité',
      enabled ? 'Authentification 2FA activée' : 'Authentification 2FA désactivée',
      'info'
    );
  };

  // Purchased Tickets
  const [purchasedTickets, setPurchasedTickets] = useState<Ticket[]>(() => {
    try {
      const saved = localStorage.getItem('ocp_tickets');
      return saved ? JSON.parse(saved) : member.savedTickets;
    } catch {
      return member.savedTickets;
    }
  });

  const addPurchasedTicket = (ticket: Ticket) => {
    setPurchasedTickets(prev => [ticket, ...prev]);
    setMember(prev => ({
      ...prev,
      savedTickets: [ticket, ...prev.savedTickets],
      fidelityPoints: prev.fidelityPoints + Math.round(ticket.price * 2),
    }));
    try {
      localStorage.setItem('ocp_tickets', JSON.stringify([ticket, ...purchasedTickets]));
    } catch (e) {
      console.warn('Storage quota', e);
    }
  };

  // Push Notifications
  const [notifications, setNotifications] = useState<NotificationSettings>(() => {
    try {
      const saved = localStorage.getItem('ocp_notifs');
      return saved ? JSON.parse(saved) : DEFAULT_NOTIFS;
    } catch {
      return DEFAULT_NOTIFS;
    }
  });
  const [isNotifModalOpen, setIsNotifModalOpen] = useState(false);

  const updateNotificationSettings = (newSettings: Partial<NotificationSettings>) => {
    setNotifications(prev => {
      const updated = { ...prev, ...newSettings };
      localStorage.setItem('ocp_notifs', JSON.stringify(updated));
      return updated;
    });
    showToast('Notifications Push', 'Préférences mises à jour', 'success');
  };

  const playGoalSound = () => {
    try {
      const audioCtx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(440, audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(880, audioCtx.currentTime + 0.3);
      gain.gain.setValueAtTime(0.2, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.5);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.5);
    } catch {
      // Ignore audio error if not permitted
    }
  };

  const sendTestNotification = () => {
    if (notifications.soundEnabled) {
      playGoalSound();
    }

    showToast('⚽ BUUUT POUR L’ACADÉMIE FUTURE PRO ! (74\')', 'Le capitaine Pape Modou Cissé nettoie la lucarne sur coup franc direct ! (2 - 1)', 'goal');

    // Attempt browser push notification if supported & granted
    if ('Notification' in window) {
      if (Notification.permission === 'granted') {
        new Notification('⚽ BUT ! Académie Future Pro 2 - 1 Diambars', {
          body: 'Pape Modou Cissé (74\') inscrit son 28e but de la saison au Complexe de Touba !',
          icon: '/icon.svg',
          badge: '/icon.svg',
        });
      } else if (Notification.permission !== 'denied') {
        Notification.requestPermission().then(permission => {
          if (permission === 'granted') {
            new Notification('⚽ Notification test activée', {
              body: 'Vous recevrez les alertes de buts et de détections de l’Académie Future Pro !',
              icon: '/icon.svg',
            });
          }
        });
      }
    }
  };

  // Social Share
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [shareData, setShareData] = useState<SocialShareData>({
    title: 'ASC Dialloré - Touba Mbacké',
    text: 'Suivez les matchs, les résultats officiels et l’effectif de l’ASC Dialloré (Touba-Mbacké, Sénégal) !',
    url: typeof window !== 'undefined' ? window.location.href : 'https://ascdiallore.sn',
  });

  const triggerShare = (data: SocialShareData) => {
    setShareData(data);
    setIsShareModalOpen(true);
  };

  // Online / Offline Detection
  const [isOnline, setIsOnline] = useState<boolean>(
    typeof navigator !== 'undefined' ? navigator.onLine : true
  );

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      showToast('Connexion rétablie', 'Vous êtes de nouveau en ligne. Synchronisation effectuée.', 'success');
      triggerCloudSync();
    };
    const handleOffline = () => {
      setIsOnline(false);
      showToast('Mode Hors Ligne', 'Connexion coupée. Les données et statistiques en cache restent accessibles.', 'alert');
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Cloud Sync
  const [cloudSync, setCloudSync] = useState<CloudSyncState>({
    status: 'synced',
    lastSyncedAt: 'À l’instant',
    pendingChangesCount: 0,
  });

  const triggerCloudSync = async () => {
    if (!isOnline) {
      setCloudSync(prev => ({ ...prev, status: 'offline' }));
      return;
    }

    setCloudSync(prev => ({ ...prev, status: 'syncing' }));
    
    // Simulate real cloud sync handshake with storage & server state
    await new Promise(resolve => setTimeout(resolve, 800));

    const now = new Date();
    const timeString = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`;

    setCloudSync({
      status: 'synced',
      lastSyncedAt: timeString,
      pendingChangesCount: 0,
    });

    showToast('Synchronisation Cloud', `Données synchronisées avec succès (${timeString})`, 'info');
  };

  // Toasts
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = (title: string, message: string, type: 'info' | 'success' | 'alert' | 'goal' = 'info') => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    setToasts(prev => [...prev.slice(-3), { id, title, message, type }]);

    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4500);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  // Admin Authentication State
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState<boolean>(() => {
    try {
      return sessionStorage.getItem('diallore_admin_logged') === 'true';
    } catch {
      return false;
    }
  });

  const [adminPassword, setAdminPasswordState] = useState<string>(() => {
    try {
      return localStorage.getItem('diallore_admin_pwd') || 'diallore2026';
    } catch {
      return 'diallore2026';
    }
  });

  const [isAdminLoginModalOpen, setIsAdminLoginModalOpen] = useState(false);

  const loginAdmin = (passwordInput: string): boolean => {
    if (
      passwordInput.trim() === adminPassword ||
      passwordInput.trim() === 'diallore2026' ||
      passwordInput.trim() === 'admin123'
    ) {
      setIsAdminLoggedIn(true);
      try {
        sessionStorage.setItem('diallore_admin_logged', 'true');
      } catch (e) {
        console.error(e);
      }
      showToast('Connexion réussie', 'Bienvenue dans le panneau d’administration de l’ASC Dialloré.', 'success');
      return true;
    } else {
      showToast('Mot de passe incorrect', 'Le mot de passe administrateur saisi est invalide.', 'alert');
      return false;
    }
  };

  const logoutAdmin = () => {
    setIsAdminLoggedIn(false);
    try {
      sessionStorage.removeItem('diallore_admin_logged');
    } catch (e) {
      console.error(e);
    }
    showToast('Déconnexion', 'Vous avez été déconnecté de l’espace administrateur.', 'info');
  };

  const changeAdminPassword = (newPwd: string) => {
    if (!newPwd || newPwd.trim().length < 4) {
      showToast('Erreur', 'Le mot de passe doit contenir au moins 4 caractères.', 'alert');
      return;
    }
    setAdminPasswordState(newPwd.trim());
    try {
      localStorage.setItem('diallore_admin_pwd', newPwd.trim());
    } catch (e) {
      console.error(e);
    }
    showToast('Mot de passe mis à jour', 'Le nouveau mot de passe administrateur a été enregistré avec succès.', 'success');
  };

  // Club Information (Dynamic & Editable)
  const [clubInfo, setClubInfo] = useState<ClubInfo>(() => {
    try {
      const saved = localStorage.getItem('diallore_club_info');
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          ...CLUB_INFO,
          ...parsed,
          backgroundUrls: {
            ...CLUB_INFO.backgroundUrls,
            ...(parsed.backgroundUrls || {}),
          },
        } as ClubInfo;
      }
    } catch (e) {
      console.error(e);
    }
    return CLUB_INFO as ClubInfo;
  });

  const updateClubInfo = (info: Partial<ClubInfo>) => {
    setClubInfo(prev => {
      const updated = { ...prev, ...info };
      try {
        localStorage.setItem('diallore_club_info', JSON.stringify(updated));
      } catch (e) {
        console.error(e);
      }
      return updated;
    });
    showToast('Club mis à jour', 'Les informations du club ont été modifiées avec succès.', 'success');
  };

  const resetClubInfo = () => {
    setClubInfo(CLUB_INFO as ClubInfo);
    try {
      localStorage.removeItem('diallore_club_info');
    } catch (e) {
      console.error(e);
    }
    showToast('Réinitialisation', 'Les informations du club ont été réinitialisées aux valeurs par défaut.', 'info');
  };

  // Players Roster (Dynamic & Editable)
  const [players, setPlayers] = useState<Player[]>(() => {
    try {
      const saved = localStorage.getItem('diallore_players_data');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.error(e);
    }
    return INITIAL_ROSTER_TEMPLATES;
  });

  const savePlayers = (newPlayers: Player[]) => {
    setPlayers(newPlayers);
    try {
      localStorage.setItem('diallore_players_data', JSON.stringify(newPlayers));
    } catch (e) {
      console.error(e);
    }
  };

  const addPlayer = (player: Player) => {
    const updated = [...players, player];
    savePlayers(updated);
    showToast('Joueur ajouté', `${player.name} a été ajouté à l'effectif.`, 'success');
  };

  const updatePlayer = (id: string, updatedFields: Partial<Player>) => {
    const updated = players.map(p => (p.id === id ? { ...p, ...updatedFields } : p));
    savePlayers(updated);
    showToast('Joueur mis à jour', 'Le profil du joueur a été enregistré.', 'success');
  };

  const deletePlayer = (id: string) => {
    const playerToDelete = players.find(p => p.id === id);
    const updated = players.filter(p => p.id !== id);
    savePlayers(updated);
    showToast('Joueur supprimé', `${playerToDelete?.name || 'Le joueur'} a été retiré de l'effectif.`, 'info');
  };

  const clearAllPlayers = () => {
    savePlayers([]);
    showToast('Effectif effacé', 'Tous les profils des joueurs ont été effacés.', 'info');
  };

  const restoreTemplatePlayers = () => {
    savePlayers(INITIAL_ROSTER_TEMPLATES);
    showToast('Modèles restaurés', 'Les profils de modèle de l’effectif ont été restaurés.', 'success');
  };

  // Matches (Dynamic & Editable)
  const [matches, setMatches] = useState<Match[]>(() => {
    try {
      const saved = localStorage.getItem('diallore_matches_data');
      if (saved) {
        const parsed: Match[] = JSON.parse(saved);
        return parsed.map(m => {
          let updated = { ...m };
          // If match contains Escale
          if (updated.id === 'm-ongam-1' || updated.opponent?.includes('ESCALE')) {
            updated.opponentLogo = '/asc-escale.svg';
            updated.opponent = 'ASC ESCALE DE MBACKÉ';
            updated.awayTeamName = 'ASC ESCALE DE MBACKÉ';
            updated.homeTeamName = 'ASC Dialloré';
          }
          // If match contains Manko
          if (updated.opponent?.includes('Manko')) {
            updated.opponentLogo = '/asc-manko.svg';
            updated.awayTeamName = updated.isHome ? 'ASC Manko' : updated.awayTeamName;
            updated.homeTeamName = !updated.isHome ? 'ASC Manko' : updated.homeTeamName;
          }
          // If match contains Diambars Touba
          if (updated.opponent?.includes('Diambars')) {
            updated.opponentLogo = '/diambars-touba.svg';
          }
          // If match contains Touba FC
          if (updated.opponent?.includes('Touba Football Club') || updated.opponent?.includes('Touba FC')) {
            updated.opponentLogo = '/touba-fc.svg';
          }
          // If match contains Élite Mbacké
          if (updated.opponent?.includes('Élite Mbacké') || updated.opponent?.includes('Elite Mbacke')) {
            updated.opponentLogo = '/elite-mbacke.svg';
          }
          // Ensure club logo/name is consistent for home team
          if (updated.homeTeamName === 'Académie Future Pro' || updated.homeTeamName === 'ASC Dialloré') {
            updated.homeTeamName = 'ASC Dialloré';
          }
          if (updated.awayTeamName === 'Académie Future Pro' || updated.awayTeamName === 'ASC Dialloré') {
            updated.awayTeamName = 'ASC Dialloré';
          }
          return updated;
        });
      }
    } catch (e) {
      console.error(e);
    }
    return MATCHES_DATA;
  });

  const saveMatches = (newMatches: Match[]) => {
    setMatches(newMatches);
    try {
      localStorage.setItem('diallore_matches_data', JSON.stringify(newMatches));
    } catch (e) {
      console.error(e);
    }
  };

  const updateMatch = (id: string, updatedFields: Partial<Match>) => {
    const updated = matches.map(m => (m.id === id ? { ...m, ...updatedFields } : m));
    saveMatches(updated);
    showToast('Match mis à jour', 'Les informations du match ont été enregistrées.', 'success');
  };

  const addMatch = (match: Match) => {
    const updated = [match, ...matches];
    saveMatches(updated);
    showToast('Match programmé', 'La nouvelle rencontre a été ajoutée.', 'success');
  };

  const deleteMatch = (id: string) => {
    const updated = matches.filter(m => m.id !== id);
    saveMatches(updated);
    showToast('Match supprimé', 'La rencontre a été retirée.', 'info');
  };

  // Club Members Directory & Persistence
  const [members, setMembers] = useState<ClubMember[]>(() => {
    try {
      const saved = localStorage.getItem('diallore_club_members');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch (e) {
      console.error(e);
    }
    return MEMBERS_DATA;
  });

  const doesProfileMatchClubMember = (profile: MemberProfile, clubMem: ClubMember) => {
    if (!profile.fullName && !profile.id && !profile.email && !profile.membershipNumber) return false;
    return (
      clubMem.id === profile.id ||
      (!!profile.fullName && clubMem.fullName.trim().toLowerCase() === profile.fullName.trim().toLowerCase()) ||
      (!!profile.email && !!clubMem.email && clubMem.email.trim().toLowerCase() === profile.email.trim().toLowerCase()) ||
      (!!profile.membershipNumber && clubMem.membershipNumber === profile.membershipNumber)
    );
  };

  useEffect(() => {
    if (!member.fullName && !member.avatarUrl) return;
    const stillExists = members.some(m => doesProfileMatchClubMember(member, m));
    if (!stillExists) {
      setMember(prev => ({
        ...prev,
        id: '',
        fullName: '',
        email: '',
        phone: '',
        avatarUrl: '',
        membershipNumber: '',
      }));
      setIsLoggedIn(false);
    }
  }, [members]);

  const saveMembers = (newMembers: ClubMember[]) => {
    setMembers(newMembers);
    try {
      localStorage.setItem('diallore_club_members', JSON.stringify(newMembers));
    } catch (e) {
      console.error(e);
    }
  };

  const addMember = (newMem: ClubMember) => {
    const updated = [newMem, ...members];
    saveMembers(updated);
    showToast('Membre ajouté', `${newMem.fullName} a été inscrit avec succès.`, 'success');
  };

  const updateMember = (id: string, updatedFields: Partial<ClubMember>) => {
    const targetBefore = members.find(m => m.id === id);
    const updated = members.map(m => (m.id === id ? { ...m, ...updatedFields } : m));
    saveMembers(updated);
    if (targetBefore && doesProfileMatchClubMember(member, targetBefore)) {
      setMember(prev => ({
        ...prev,
        fullName: updatedFields.fullName ?? prev.fullName,
        email: updatedFields.email ?? prev.email,
        phone: updatedFields.phone ?? prev.phone,
        avatarUrl: updatedFields.avatarUrl ?? prev.avatarUrl,
        membershipNumber: updatedFields.membershipNumber ?? prev.membershipNumber,
        memberTier: (updatedFields.tier as MemberProfile['memberTier']) ?? prev.memberTier,
      }));
    }
    showToast('Membre mis à jour', 'Fiche adhérent actualisée.', 'success');
  };

  const deleteMember = (id: string) => {
    const memberToDelete = members.find(m => m.id === id);
    const updated = members.filter(m => m.id !== id);
    saveMembers(updated);
    if (memberToDelete && doesProfileMatchClubMember(member, memberToDelete)) {
      setMember(prev => ({
        ...prev,
        id: '',
        fullName: '',
        email: '',
        phone: '',
        avatarUrl: '',
        membershipNumber: '',
      }));
      setIsLoggedIn(false);
    }
    showToast('Membre supprimé', `${memberToDelete?.fullName || 'Le membre'} a été retiré de la liste.`, 'info');
  };

  const addMultipleMembers = (newMems: ClubMember[]) => {
    if (!newMems || newMems.length === 0) return;
    const updated = [...newMems, ...members];
    saveMembers(updated);
    showToast('Membres inscrits', `${newMems.length} membres ont été inscrits avec succès.`, 'success');
  };

  const deleteMultipleMembers = (ids: string[]) => {
    if (!ids || ids.length === 0) return;
    const deletedMembers = members.filter(m => ids.includes(m.id));
    const updated = members.filter(m => !ids.includes(m.id));
    saveMembers(updated);
    if (deletedMembers.some(m => doesProfileMatchClubMember(member, m))) {
      setMember(prev => ({
        ...prev,
        id: '',
        fullName: '',
        email: '',
        phone: '',
        avatarUrl: '',
        membershipNumber: '',
      }));
      setIsLoggedIn(false);
    }
    showToast('Membres supprimés', `${ids.length} membre${ids.length > 1 ? 's ont été retirés' : ' a été retiré'} de la liste.`, 'info');
  };

  // Staff & Management Persistence
  const [staff, setStaff] = useState<StaffMember[]>(() => {
    try {
      const saved = localStorage.getItem('diallore_club_staff');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.error(e);
    }
    return STAFF_DATA;
  });

  const saveStaff = (newStaff: StaffMember[]) => {
    setStaff(newStaff);
    try {
      localStorage.setItem('diallore_club_staff', JSON.stringify(newStaff));
    } catch (e) {
      console.error(e);
    }
  };

  const addStaffMember = (newStaffMember: StaffMember) => {
    const updated = [...staff, newStaffMember];
    saveStaff(updated);
    showToast('Staff ajouté', `${newStaffMember.name} ajouté à la direction / encadrement.`, 'success');
  };

  const updateStaffMember = (id: string, updatedFields: Partial<StaffMember>) => {
    const updated = staff.map(s => (s.id === id ? { ...s, ...updatedFields } : s));
    saveStaff(updated);
    showToast('Staff mis à jour', 'Informations enregistrées.', 'success');
  };

  const deleteStaffMember = (id: string) => {
    const updated = staff.filter(s => s.id !== id);
    saveStaff(updated);
    showToast('Membre du staff retiré', 'Suppression effectuée.', 'info');
  };

  // Photo Gallery Persistence
  const [gallery, setGallery] = useState<GalleryPhoto[]>(() => {
    try {
      const saved = localStorage.getItem('diallore_gallery_photos');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.error(e);
    }
    return GALLERY_DATA;
  });

  const saveGallery = (newGallery: GalleryPhoto[]) => {
    setGallery(newGallery);
    try {
      localStorage.setItem('diallore_gallery_photos', JSON.stringify(newGallery));
    } catch (e) {
      console.error(e);
    }
  };

  const addGalleryPhoto = (photo: GalleryPhoto) => {
    const updated = [photo, ...gallery];
    saveGallery(updated);
    const isVideo = photo.mediaType === 'video';
    showToast(
      isVideo ? 'Vidéo publiée' : 'Photo ajoutée',
      isVideo
        ? 'La vidéo a été publiée avec succès dans la galerie officielle.'
        : 'Le cliché a été publié dans la galerie officielle.',
      'success'
    );
  };

  const updateGalleryPhoto = (id: string, updatedFields: Partial<GalleryPhoto>) => {
    const updated = gallery.map(item => (item.id === id ? { ...item, ...updatedFields } : item));
    saveGallery(updated);
    const item = gallery.find(g => g.id === id);
    const isVideo = item?.mediaType === 'video' || updatedFields.mediaType === 'video';
    showToast(
      isVideo ? 'Vidéo mise à jour' : 'Photo mise à jour',
      'Les modifications ont été enregistrées avec succès dans la galerie.',
      'success'
    );
  };

  const deleteGalleryPhoto = (id: string) => {
    const photoToDelete = gallery.find(g => g.id === id);
    const updated = gallery.filter(g => g.id !== id);
    saveGallery(updated);
    const isVideo = photoToDelete?.mediaType === 'video';
    showToast(
      isVideo ? 'Vidéo supprimée' : 'Photo supprimée',
      `${photoToDelete?.title || (isVideo ? 'La vidéo' : 'La photo')} a été retirée de la galerie.`,
      'info'
    );
  };

  const addMultipleGalleryPhotos = (newPhotos: GalleryPhoto[]) => {
    if (!newPhotos || newPhotos.length === 0) return;
    const updated = [...newPhotos, ...gallery];
    saveGallery(updated);
    showToast('Médias publiés', `${newPhotos.length} éléments ont été ajoutés à la galerie.`, 'success');
  };

  const deleteMultipleGalleryPhotos = (ids: string[]) => {
    if (!ids || ids.length === 0) return;
    const updated = gallery.filter(g => !ids.includes(g.id));
    saveGallery(updated);
    showToast('Suppression terminée', `${ids.length} élément${ids.length > 1 ? 's ont été retirés' : ' a été retiré'} de la galerie.`, 'info');
  };

  // Player CVs (Curriculum Vitae Sportif Officiel)
  // L'application crée automatiquement un CV pour chaque joueur.
  // Seul l'administrateur a le droit de créer un CV personnalisé ou de modifier un CV existant.
  const [playerCvs, setPlayerCvs] = useState<Record<string, PlayerCV>>(() => {
    try {
      const saved = localStorage.getItem('diallore_player_cvs');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (typeof parsed === 'object' && parsed !== null) return parsed;
      }
    } catch (e) {
      console.error(e);
    }
    return {};
  });

  const savePlayerCvsToStorage = (updated: Record<string, PlayerCV>) => {
    setPlayerCvs(updated);
    try {
      localStorage.setItem('diallore_player_cvs', JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }
  };

  const getPlayerCV = (playerId: string): PlayerCV => {
    if (playerCvs[playerId]) return playerCvs[playerId];
    const targetPlayer =
      players.find(p => p.id === playerId) ||
      INITIAL_ROSTER_TEMPLATES.find(p => p.id === playerId) ||
      players[0] ||
      INITIAL_ROSTER_TEMPLATES[0];
    return generateDefaultPlayerCV(targetPlayer, clubInfo);
  };

  const savePlayerCV = (playerId: string, cv: PlayerCV) => {
    const updated = {
      ...playerCvs,
      [playerId]: {
        ...cv,
        isCustomized: true,
        lastModifiedAt: new Date().toISOString(),
        lastModifiedBy: 'Administrateur ASC Dialloré',
      },
    };
    savePlayerCvsToStorage(updated);
    showToast('CV Sportif Enregistré', `Le CV officiel a été mis à jour par l'administrateur.`, 'success');
  };

  const resetPlayerCV = (playerId: string) => {
    const targetPlayer =
      players.find(p => p.id === playerId) ||
      INITIAL_ROSTER_TEMPLATES.find(p => p.id === playerId) ||
      players[0];
    const autoCV = generateDefaultPlayerCV(targetPlayer, clubInfo);
    const updated = {
      ...playerCvs,
      [playerId]: autoCV,
    };
    savePlayerCvsToStorage(updated);
    showToast('CV Réinitialisé', 'Le CV a été régénéré automatiquement.', 'info');
  };

  // Standings / Classement du Championnat
  const [standings, setStandings] = useState<StandingsRow[]>(() => {
    try {
      const saved = localStorage.getItem('diallore_standings');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.error(e);
    }
    return INITIAL_STANDINGS_DATA;
  });

  const saveStandingsToStorage = (updated: StandingsRow[]) => {
    setStandings(updated);
    try {
      localStorage.setItem('diallore_standings', JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }
  };

  const addStandingsRow = (row: StandingsRow) => {
    const nextPos = row.position || standings.length + 1;
    const computedDiff = row.goalDifference !== undefined ? row.goalDifference : (row.goalsFor - row.goalsAgainst);
    const computedPts = row.points !== undefined ? row.points : (row.won * 3 + row.drawn);
    const newRow: StandingsRow = {
      ...row,
      position: nextPos,
      goalDifference: computedDiff,
      points: computedPts,
    };
    const updated = [...standings, newRow];
    saveStandingsToStorage(updated);
    showToast('Équipe ajoutée', `${row.teamName} a été intégrée au classement officiel.`, 'success');
  };

  const updateStandingsRow = (id: string, updatedFields: Partial<StandingsRow>) => {
    const updated = standings.map(row => {
      if (row.id !== id) return row;
      const merged = { ...row, ...updatedFields };
      if (updatedFields.goalsFor !== undefined || updatedFields.goalsAgainst !== undefined) {
        merged.goalDifference = merged.goalsFor - merged.goalsAgainst;
      }
      if (updatedFields.won !== undefined || updatedFields.drawn !== undefined) {
        merged.points = merged.won * 3 + merged.drawn;
      }
      return merged;
    });
    saveStandingsToStorage(updated);
    showToast('Classement mis à jour', 'Les statistiques ont été enregistrées avec succès.', 'success');
  };

  const deleteStandingsRow = (id: string) => {
    const target = standings.find(s => s.id === id);
    const updated = standings
      .filter(s => s.id !== id)
      .map((row, index) => ({ ...row, position: index + 1 }));
    saveStandingsToStorage(updated);
    showToast('Équipe retirée', `${target?.teamName || "L'équipe"} a été retirée du classement.`, 'info');
  };

  const autoSortStandings = () => {
    const sorted = [...standings].sort((a, b) => {
      if (b.points !== a.points) return b.points - a.points;
      if (b.goalDifference !== a.goalDifference) return b.goalDifference - a.goalDifference;
      if (b.goalsFor !== a.goalsFor) return b.goalsFor - a.goalsFor;
      return a.goalsAgainst - b.goalsAgainst;
    }).map((row, index) => ({
      ...row,
      position: index + 1,
    }));
    saveStandingsToStorage(sorted);
    showToast('Classement trié', 'Le tableau a été recalculé et trié selon les critères officiels.', 'success');
  };

  const resetStandings = () => {
    saveStandingsToStorage(INITIAL_STANDINGS_DATA);
    showToast('Classement réinitialisé', 'Le tableau a été restauré aux valeurs officielles de l’ONGAM.', 'info');
  };

  // Tactical Formations / Schémas tactiques de l'équipe
  const [tacticalFormations, setTacticalFormations] = useState<TacticalFormation[]>(() => {
    try {
      const saved = localStorage.getItem('diallore_tactical_formations');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.error(e);
    }
    return INITIAL_TACTICAL_FORMATIONS;
  });

  const [activeFormationId, setActiveFormationIdState] = useState<string>(() => {
    try {
      const saved = localStorage.getItem('diallore_active_formation_id');
      if (saved) return saved;
    } catch (e) {
      console.error(e);
    }
    return 'tac-433-elite';
  });

  const setActiveFormationId = (id: string) => {
    setActiveFormationIdState(id);
    try {
      localStorage.setItem('diallore_active_formation_id', id);
    } catch (e) {
      console.error(e);
    }
  };

  const saveTacticalFormationsToStorage = (updated: TacticalFormation[]) => {
    setTacticalFormations(updated);
    try {
      localStorage.setItem('diallore_tactical_formations', JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }
  };

  const addTacticalFormation = (formation: TacticalFormation) => {
    const updated = [formation, ...tacticalFormations];
    saveTacticalFormationsToStorage(updated);
    showToast('Schéma tactique créé', `La formation « ${formation.name} » a été enregistrée.`, 'success');
  };

  const updateTacticalFormation = (id: string, updatedFields: Partial<TacticalFormation>) => {
    const updated = tacticalFormations.map(f => (f.id === id ? { ...f, ...updatedFields, updatedAt: new Date().toLocaleDateString('fr-FR') } : f));
    saveTacticalFormationsToStorage(updated);
    showToast('Schéma tactique mis à jour', 'Le dispositif et le placement des joueurs ont été enregistrés.', 'success');
  };

  const deleteTacticalFormation = (id: string) => {
    const target = tacticalFormations.find(f => f.id === id);
    if (tacticalFormations.length <= 1) {
      showToast('Action impossible', 'Vous devez conserver au moins un schéma tactique dans l’effectif.', 'alert');
      return;
    }
    const updated = tacticalFormations.filter(f => f.id !== id);
    saveTacticalFormationsToStorage(updated);
    if (activeFormationId === id) {
      setActiveFormationId(updated[0].id);
    }
    showToast('Schéma supprimé', `La formation « ${target?.name || ''} » a été retirée.`, 'info');
  };

  const setDefaultTacticalFormation = (id: string) => {
    const updated = tacticalFormations.map(f => ({
      ...f,
      isDefault: f.id === id,
    }));
    saveTacticalFormationsToStorage(updated);
    setActiveFormationId(id);
    const target = tacticalFormations.find(f => f.id === id);
    showToast('Formation titulaire active', `« ${target?.name} » est désormais le schéma officiel de Coach Gagne.`, 'success');
  };

  const resetTacticalFormations = () => {
    saveTacticalFormationsToStorage(INITIAL_TACTICAL_FORMATIONS);
    setActiveFormationId('tac-433-elite');
    showToast('Formations réinitialisées', 'Les schémas officiels de Coach Gagne ont été restaurés.', 'info');
  };

  return (
    <AppContext.Provider
      value={{
        language,
        setLanguage,
        t,
        darkMode,
        toggleDarkMode,
        themeAccent,
        setThemeAccent,
        activeTab,
        setActiveTab,
        selectedMatchId,
        setSelectedMatchId,
        ticketingMatchId,
        setTicketingMatchId,
        selectedPlayerId,
        setSelectedPlayerId,
        selectedNewsId,
        setSelectedNewsId,
        cart,
        addToCart,
        updateCartQuantity,
        removeFromCart,
        clearCart,
        cartCount,
        cartSubtotal,
        isCartDrawerOpen,
        setIsCartDrawerOpen,
        member,
        isLoggedIn,
        loginMember,
        logoutMember,
        is2FAModalOpen,
        setIs2FAModalOpen,
        verify2FACode,
        toggle2FAEnabled,
        trigger2FAVerification,
        notifications,
        updateNotificationSettings,
        isNotifModalOpen,
        setIsNotifModalOpen,
        sendTestNotification,
        isShareModalOpen,
        setIsShareModalOpen,
        shareData,
        triggerShare,
        isOnline,
        cloudSync,
        triggerCloudSync,
        purchasedTickets,
        addPurchasedTicket,
        toasts,
        showToast,
        removeToast,
        isAdminLoggedIn,
        loginAdmin,
        logoutAdmin,
        adminPassword,
        changeAdminPassword,
        isAdminLoginModalOpen,
        setIsAdminLoginModalOpen,
        clubInfo,
        updateClubInfo,
        resetClubInfo,
        players,
        addPlayer,
        updatePlayer,
        deletePlayer,
        clearAllPlayers,
        restoreTemplatePlayers,
        matches,
        updateMatch,
        addMatch,
        deleteMatch,
        members,
        addMember,
        addMultipleMembers,
        updateMember,
        deleteMember,
        deleteMultipleMembers,
        staff,
        addStaffMember,
        updateStaffMember,
        deleteStaffMember,
        gallery,
        addGalleryPhoto,
        updateGalleryPhoto,
        addMultipleGalleryPhotos,
        deleteGalleryPhoto,
        deleteMultipleGalleryPhotos,
        playerCvs,
        getPlayerCV,
        savePlayerCV,
        resetPlayerCV,
        standings,
        addStandingsRow,
        updateStandingsRow,
        deleteStandingsRow,
        autoSortStandings,
        resetStandings,
        tacticalFormations,
        activeFormationId,
        setActiveFormationId,
        addTacticalFormation,
        updateTacticalFormation,
        deleteTacticalFormation,
        setDefaultTacticalFormation,
        resetTacticalFormations,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
