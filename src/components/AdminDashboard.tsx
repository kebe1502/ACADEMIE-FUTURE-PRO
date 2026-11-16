import React, { useState, useRef, useEffect } from 'react';
import {
  ShieldCheck,
  Lock,
  Unlock,
  KeyRound,
  User,
  Users,
  Plus,
  Trash2,
  Edit,
  Save,
  RotateCcw,
  Upload,
  Image as ImageIcon,
  CheckCircle2,
  AlertTriangle,
  Trophy,
  Calendar,
  Sparkles,
  Eye,
  EyeOff,
  LogOut,
  Sliders,
  Check,
  Flag,
  MapPin,
  ExternalLink,
  Phone,
  Mail,
  Search,
  Filter,
  Camera,
  X,
  Briefcase,
  Crown,
  Award,
  Stethoscope,
  FileText,
  Compass,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Player, Match, ClubInfo, ClubMember, StaffMember } from '../types';
import { getAccentStyles } from '../utils/theme';
import { INITIAL_ROSTER_TEMPLATES } from '../data/clubData';
import { PlayerCVModal } from './PlayerCVModal';
import { AdminStandingsManager } from './AdminStandingsManager';
import { AdminTacticsManager } from './AdminTacticsManager';

export const AdminDashboard: React.FC = () => {
  const {
    isAdminLoggedIn,
    loginAdmin,
    logoutAdmin,
    adminPassword,
    changeAdminPassword,
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
    updateMember,
    deleteMember,
    staff,
    addStaffMember,
    updateStaffMember,
    deleteStaffMember,
    gallery,
    themeAccent,
    setActiveTab,
    showToast,
  } = useApp();

  const accent = getAccentStyles(themeAccent);

  // Login Form State
  const [passwordInput, setPasswordInput] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState('');

  // Verrouillage et réinitialisation automatique du formulaire dès que l'accès admin est verrouillé
  useEffect(() => {
    if (!isAdminLoggedIn) {
      setPasswordInput('');
      setLoginError('');
    }
  }, [isAdminLoggedIn]);

  // Active Admin Sub-Tab
  const [activeAdminTab, setActiveAdminTab] = useState<'players' | 'members' | 'staff' | 'club' | 'backgrounds' | 'matches' | 'standings' | 'tactics' | 'security'>('players');

  // Member Management State
  const [editingAdminMember, setEditingAdminMember] = useState<ClubMember | null>(null);
  const [isAdminMemberModalOpen, setIsAdminMemberModalOpen] = useState(false);
  const [adminMemberSearch, setAdminMemberSearch] = useState('');
  const [adminMemberTierFilter, setAdminMemberTierFilter] = useState('all');
  const [adminMemberDeleteConfirmId, setAdminMemberDeleteConfirmId] = useState<string | null>(null);

  const [memberFullName, setMemberFullName] = useState('');
  const [memberEmail, setMemberEmail] = useState('');
  const [memberPhone, setMemberPhone] = useState('');
  const [memberNumber, setMemberNumber] = useState('');
  const [memberTier, setMemberTier] = useState<ClubMember['tier']>('Adhérent');
  const [memberCity, setMemberCity] = useState('Touba & Mbacké');
  const [memberAvatarUrl, setMemberAvatarUrl] = useState('');
  const [memberStatus, setMemberStatus] = useState<ClubMember['status']>('Actif');
  const [memberJoinedDate, setMemberJoinedDate] = useState('');
  const [memberNotes, setMemberNotes] = useState('');

  const memberPresetAvatars = [
    { label: 'Portrait 1', url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80' },
    { label: 'Portrait 2', url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80' },
    { label: 'Portrait 3', url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80' },
    { label: 'Portrait 4', url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80' },
    { label: 'Portrait 5', url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=300&q=80' },
    { label: 'VIP', url: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=300&q=80' },
  ];

  const handleOpenEditMemberModal = (m: ClubMember) => {
    setEditingAdminMember(m);
    setMemberFullName(m.fullName);
    setMemberEmail(m.email || '');
    setMemberPhone(m.phone || '');
    setMemberNumber(m.membershipNumber);
    setMemberTier(m.tier);
    setMemberCity(m.city);
    setMemberAvatarUrl(m.avatarUrl || memberPresetAvatars[0].url);
    setMemberStatus(m.status);
    setMemberJoinedDate(m.joinedDate || new Date().toLocaleDateString('fr-FR'));
    setMemberNotes(m.notes || '');
    setIsAdminMemberModalOpen(true);
  };

  const handleOpenAddMemberModal = () => {
    setEditingAdminMember(null);
    setMemberFullName('');
    setMemberEmail('');
    setMemberPhone('');
    setMemberNumber(`DIA-MBK-${(members.length + 1).toString().padStart(3, '0')}`);
    setMemberTier('Adhérent');
    setMemberCity('Touba & Mbacké');
    setMemberAvatarUrl(memberPresetAvatars[0].url);
    setMemberStatus('Actif');
    setMemberJoinedDate(new Date().toLocaleDateString('fr-FR'));
    setMemberNotes('');
    setIsAdminMemberModalOpen(true);
  };

  const handleMemberAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        showToast('Fichier trop volumineux', 'Veuillez choisir une image inférieure à 5 Mo.', 'alert');
        return;
      }
      const reader = new FileReader();
      reader.onload = ev => {
        if (ev.target?.result) {
          setMemberAvatarUrl(ev.target.result as string);
          showToast('Photo chargée', 'La photo de profil a été mise à jour.', 'success');
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveAdminMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!memberFullName.trim()) {
      showToast('Nom requis', 'Veuillez renseigner le nom complet du membre.', 'alert');
      return;
    }
    if (editingAdminMember) {
      updateMember(editingAdminMember.id, {
        fullName: memberFullName.trim(),
        email: memberEmail.trim() || undefined,
        phone: memberPhone.trim() || undefined,
        membershipNumber: memberNumber.trim() || editingAdminMember.membershipNumber,
        tier: memberTier,
        city: memberCity.trim(),
        avatarUrl: memberAvatarUrl.trim() || editingAdminMember.avatarUrl,
        status: memberStatus,
        joinedDate: memberJoinedDate.trim() || editingAdminMember.joinedDate,
        notes: memberNotes.trim() || undefined,
      });
      setIsAdminMemberModalOpen(false);
      showToast('Profil modifié', `Le profil de ${memberFullName.trim()} a été mis à jour avec succès.`, 'success');
    } else {
      const newMem: ClubMember = {
        id: `mem-${Date.now()}`,
        fullName: memberFullName.trim(),
        email: memberEmail.trim() || undefined,
        phone: memberPhone.trim() || undefined,
        membershipNumber: memberNumber.trim() || `DIA-MBK-${(members.length + 1).toString().padStart(3, '0')}`,
        tier: memberTier,
        city: memberCity.trim() || 'Touba & Mbacké',
        avatarUrl: memberAvatarUrl.trim() || memberPresetAvatars[0].url,
        status: memberStatus,
        joinedDate: memberJoinedDate.trim() || new Date().toLocaleDateString('fr-FR'),
        notes: memberNotes.trim() || undefined,
      };
      addMember(newMem);
      setIsAdminMemberModalOpen(false);
      showToast('Membre inscrit', `${memberFullName.trim()} a été inscrit avec succès.`, 'success');
    }
  };

  // =========================================================
  // GESTION DU STAFF TECHNIQUE, DIRECTION & PRÉSIDENCE
  // =========================================================
  const [editingAdminStaff, setEditingAdminStaff] = useState<StaffMember | null>(null);
  const [isAdminStaffModalOpen, setIsAdminStaffModalOpen] = useState(false);
  const [adminStaffSearch, setAdminStaffSearch] = useState('');
  const [adminStaffCategoryFilter, setAdminStaffCategoryFilter] = useState('all');
  const [adminStaffDeleteConfirmId, setAdminStaffDeleteConfirmId] = useState<string | null>(null);

  // Form Fields Staff
  const [staffName, setStaffName] = useState('');
  const [staffTitle, setStaffTitle] = useState('');
  const [staffRole, setStaffRole] = useState('');
  const [staffCategory, setStaffCategory] = useState<StaffMember['category']>('technical');
  const [staffPhotoUrl, setStaffPhotoUrl] = useState('');
  const [staffBio, setStaffBio] = useState('');
  const [staffPhone, setStaffPhone] = useState('');
  const [staffEmail, setStaffEmail] = useState('');
  const [staffDiploma, setStaffDiploma] = useState('');
  const [staffStatus, setStaffStatus] = useState<StaffMember['status']>('Actif');
  const [staffNationality, setStaffNationality] = useState('Sénégalaise');
  const [staffJoinedDate, setStaffJoinedDate] = useState('2024');

  // Presets Staff
  const staffPresetPortraits = [
    { label: 'Coach Principal', url: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=600&q=80', role: 'Entraîneur Principal' },
    { label: 'Entraîneur Adjoint', url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=600&q=80', role: 'Coach Adjoint' },
    { label: 'Directeur Technique', url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=600&q=80', role: 'Directeur Technique' },
    { label: 'Dirigeante / Vice-Présidente', url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=600&q=80', role: 'Direction & Finances' },
    { label: 'Staff Médical / Kiné', url: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=600&q=80', role: 'Pôle Médical' },
    { label: 'Préparateur Physique', url: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=600&q=80', role: 'Préparation Athlétique' },
    { label: 'Secrétariat Général', url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80', role: 'Administration' },
  ];

  // Presets Présidence (Homme & Femme)
  const presidentPresetPortraits = [
    { label: 'Président (Costume Officiel 1)', url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80', gender: 'Homme' },
    { label: 'Présidente (Portrait Officiel 1)', url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=600&q=80', gender: 'Femme' },
    { label: 'Président (Costume Sombre 2)', url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=600&q=80', gender: 'Homme' },
    { label: 'Présidente (Portrait Équipe 2)', url: 'https://images.unsplash.com/photo-1580894732479-7108920beee1?auto=format&fit=crop&w=600&q=80', gender: 'Femme' },
  ];

  // Form Fields Présidence
  const [isAdminPresidentModalOpen, setIsAdminPresidentModalOpen] = useState(false);
  const [adminPresName, setAdminPresName] = useState(clubInfo.president || 'El Hadji Ousseynou Fall');
  const [adminPresTitle, setAdminPresTitle] = useState(clubInfo.presidentTitle || 'Président');
  const [adminPresPhotoUrl, setAdminPresPhotoUrl] = useState(clubInfo.presidentPhotoUrl || '');
  const [adminPresWord, setAdminPresWord] = useState(clubInfo.presidentWord || '');
  const [adminPresPhone, setAdminPresPhone] = useState('+221 77 500 12 34');
  const [adminPresEmail, setAdminPresEmail] = useState('presidence@ascdiallore.sn');

  // Player CV Management State in Admin
  const [adminPlayerCVTarget, setAdminPlayerCVTarget] = useState<Player | null>(null);
  const [isAdminPlayerCVModalOpen, setIsAdminPlayerCVModalOpen] = useState(false);

  const handleOpenAddStaffModal = () => {
    setEditingAdminStaff(null);
    setStaffName('');
    setStaffTitle('Entraîneur Adjoint');
    setStaffRole('Encadrement Technique des Cadets');
    setStaffCategory('technical');
    setStaffPhotoUrl(staffPresetPortraits[1].url);
    setStaffBio('');
    setStaffPhone('+221 77 000 00 00');
    setStaffEmail('staff@ascdiallore.sn');
    setStaffDiploma('Licence B CAF');
    setStaffStatus('Actif');
    setStaffNationality('Sénégalaise');
    setStaffJoinedDate('2024');
    setIsAdminStaffModalOpen(true);
  };

  const handleOpenEditStaffModal = (s: StaffMember) => {
    setEditingAdminStaff(s);
    setStaffName(s.name);
    setStaffTitle(s.title);
    setStaffRole(s.role);
    setStaffCategory(s.category);
    setStaffPhotoUrl(s.photoUrl);
    setStaffBio(s.bio || '');
    setStaffPhone(s.phone || '');
    setStaffEmail(s.email || '');
    setStaffDiploma(s.diploma || '');
    setStaffStatus(s.status || 'Actif');
    setStaffNationality(s.nationality || 'Sénégalaise');
    setStaffJoinedDate(s.joinedDate || '2024');
    setIsAdminStaffModalOpen(true);
  };

  const handleStaffPhotoFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        showToast('Fichier trop lourd', 'Veuillez choisir une image inférieure à 10 Mo.', 'alert');
        return;
      }
      const reader = new FileReader();
      reader.onload = ev => {
        if (ev.target?.result) {
          setStaffPhotoUrl(ev.target.result as string);
          showToast('Photo chargée', 'La photo officielle du staff a été chargée.', 'success');
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePresidentPhotoFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        showToast('Fichier trop lourd', 'Veuillez choisir une image inférieure à 10 Mo.', 'alert');
        return;
      }
      const reader = new FileReader();
      reader.onload = ev => {
        if (ev.target?.result) {
          setAdminPresPhotoUrl(ev.target.result as string);
          showToast('Photo chargée', 'La photo officielle de la présidence a été chargée.', 'success');
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveStaffMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!staffName.trim()) {
      showToast('Nom requis', 'Veuillez saisir le nom du membre du staff.', 'alert');
      return;
    }

    if (editingAdminStaff) {
      updateStaffMember(editingAdminStaff.id, {
        name: staffName.trim(),
        title: staffTitle.trim() || 'Membre du Staff',
        role: staffRole.trim() || 'Encadrement',
        category: staffCategory,
        photoUrl: staffPhotoUrl.trim() || editingAdminStaff.photoUrl,
        bio: staffBio.trim() || undefined,
        phone: staffPhone.trim() || undefined,
        email: staffEmail.trim() || undefined,
        diploma: staffDiploma.trim() || undefined,
        status: staffStatus,
        nationality: staffNationality.trim() || 'Sénégalaise',
        joinedDate: staffJoinedDate.trim() || undefined,
      });

      // Si le membre édité est le président, synchroniser clubInfo
      if (staffCategory === 'president') {
        updateClubInfo({
          president: staffName.trim(),
          presidentTitle: staffTitle.includes('Présidente') ? 'Présidente' : 'Président',
          presidentPhotoUrl: staffPhotoUrl.trim() || clubInfo.presidentPhotoUrl,
          presidentWord: staffBio.trim() || clubInfo.presidentWord,
        });
      }

      setIsAdminStaffModalOpen(false);
      showToast('Staff mis à jour', `Le profil et la photo de ${staffName.trim()} ont été enregistrés.`, 'success');
    } else {
      const newStaff: StaffMember = {
        id: `staff-${Date.now()}`,
        name: staffName.trim(),
        title: staffTitle.trim() || 'Membre du Staff',
        role: staffRole.trim() || 'Encadrement',
        category: staffCategory,
        photoUrl: staffPhotoUrl.trim() || staffPresetPortraits[0].url,
        bio: staffBio.trim() || undefined,
        phone: staffPhone.trim() || undefined,
        email: staffEmail.trim() || undefined,
        diploma: staffDiploma.trim() || undefined,
        status: staffStatus,
        nationality: staffNationality.trim() || 'Sénégalaise',
        joinedDate: staffJoinedDate.trim() || undefined,
        order: staff.length + 1,
      };
      addStaffMember(newStaff);
      setIsAdminStaffModalOpen(false);
      showToast('Staff ajouté', `${staffName.trim()} a été intégré à la direction / encadrement.`, 'success');
    }
  };

  const handleOpenEditPresidentModal = () => {
    setAdminPresName(clubInfo.president || 'El Hadji Ousseynou Fall');
    setAdminPresTitle(clubInfo.presidentTitle || 'Président');
    setAdminPresPhotoUrl(clubInfo.presidentPhotoUrl || presidentPresetPortraits[0].url);
    setAdminPresWord(clubInfo.presidentWord || '');
    setIsAdminPresidentModalOpen(true);
  };

  const handleSavePresidentModal = (e: React.FormEvent) => {
    e.preventDefault();
    updateClubInfo({
      president: adminPresName.trim(),
      presidentTitle: adminPresTitle.trim(),
      presidentPhotoUrl: adminPresPhotoUrl.trim() || clubInfo.presidentPhotoUrl,
      presidentWord: adminPresWord.trim() || clubInfo.presidentWord,
    });
    // Synchroniser l'entrée correspondante dans le staff
    const presStaff = staff.find(s => s.category === 'president');
    if (presStaff) {
      updateStaffMember(presStaff.id, {
        name: adminPresName.trim(),
        title: `${adminPresTitle.trim()} de l'${clubInfo.name}`,
        photoUrl: adminPresPhotoUrl.trim() || presStaff.photoUrl,
        bio: adminPresWord.trim() || presStaff.bio,
        phone: adminPresPhone.trim() || presStaff.phone,
        email: adminPresEmail.trim() || presStaff.email,
      });
    }
    setIsAdminPresidentModalOpen(false);
    showToast('Présidence mise à jour', 'La photo officielle et le profil de la présidence ont été enregistrés.', 'success');
  };

  const handleOpenPlayerCVAdmin = (p: Player) => {
    setAdminPlayerCVTarget(p);
    setIsAdminPlayerCVModalOpen(true);
  };

  // Player Form / Edit State
  const [editingPlayer, setEditingPlayer] = useState<Player | null>(null);
  const [isPlayerModalOpen, setIsPlayerModalOpen] = useState(false);
  const [playerSearchQuery, setPlayerSearchQuery] = useState('');

  // Player Form Fields
  const [pName, setPName] = useState('');
  const [pFirstName, setPFirstName] = useState('');
  const [pLastName, setPLastName] = useState('');
  const [pNumber, setPNumber] = useState<number>(10);
  const [pPosition, setPPosition] = useState<'GK' | 'DEF' | 'MID' | 'ATT'>('ATT');
  const [pPositionDetail, setPPositionDetail] = useState('');
  const [pRoleTag, setPRoleTag] = useState('AT');
  const [pAge, setPAge] = useState<number>(20);
  const [pHeight, setPHeight] = useState('1.80 m');
  const [pWeight, setPWeight] = useState('74 kg');
  const [pPreferredFoot, setPPreferredFoot] = useState('Droit');
  const [pMarketValue, setPMarketValue] = useState('750 k€');
  const [pPhotoUrl, setPPhotoUrl] = useState('');
  const [pBio, setPBio] = useState('');
  const [pIsCaptain, setPIsCaptain] = useState(false);
  const [pIsTopScorer, setPIsTopScorer] = useState(false);
  const [pAppearances, setPAppearances] = useState<number>(20);
  const [pGoals, setPGoals] = useState<number>(5);
  const [pAssists, setPAssists] = useState<number>(4);

  // Match Form / Edit State
  const [editingMatch, setEditingMatch] = useState<Match | null>(null);
  const [isMatchModalOpen, setIsMatchModalOpen] = useState(false);
  const [matchSearchQuery, setMatchSearchQuery] = useState('');
  const [matchFilterStatus, setMatchFilterStatus] = useState<'all' | 'upcoming' | 'finished' | 'live'>('all');
  const [mOpponent, setMOpponent] = useState('');
  const [mOpponentShort, setMOpponentShort] = useState('');
  const [mOpponentLogo, setMOpponentLogo] = useState('');
  const [mCompetition, setMCompetition] = useState('');
  const [mRound, setMRound] = useState('');
  const [mDate, setMDate] = useState('');
  const [mTime, setMTime] = useState('');
  const [mVenue, setMVenue] = useState('');
  const [mStatus, setMStatus] = useState<'upcoming' | 'live' | 'finished'>('upcoming');
  const [mIsHome, setMIsHome] = useState<boolean>(true);
  const [mHomeScore, setMHomeScore] = useState<number>(0);
  const [mAwayScore, setMAwayScore] = useState<number>(0);
  const [mIsForfeit, setMIsForfeit] = useState(false);
  const [mForfeitReason, setMForfeitReason] = useState('');
  const [mForfeitNote, setMForfeitNote] = useState('');
  const [mTicketPrice, setMTicketPrice] = useState<number>(1000);
  const [mTicketsAvailable, setMTicketsAvailable] = useState<boolean>(true);

  // In-App Deletion Confirmation Modals (guaranteed to work inside iframes)
  const [matchToDelete, setMatchToDelete] = useState<Match | null>(null);
  const [playerToDelete, setPlayerToDelete] = useState<Player | null>(null);
  const [isClearAllPlayersModalOpen, setIsClearAllPlayersModalOpen] = useState(false);
  const [isClearPlannedMatchesModalOpen, setIsClearPlannedMatchesModalOpen] = useState(false);

  // Club Form State
  const [clubName, setClubName] = useState(clubInfo.name);
  const [clubShortName, setClubShortName] = useState(clubInfo.shortName);
  const [clubSlogan, setClubSlogan] = useState(clubInfo.slogan);
  const [clubLogoUrl, setClubLogoUrl] = useState(clubInfo.logoUrl || '/icon.svg');
  const [clubStadium, setClubStadium] = useState(clubInfo.stadium);
  const [clubCity, setClubCity] = useState(clubInfo.city);
  const [clubCoach, setClubCoach] = useState(clubInfo.coach);
  const [clubCoachRole, setClubCoachRole] = useState(clubInfo.coachRole);
  const [clubCoachBio, setClubCoachBio] = useState(clubInfo.coachBio);
  const [clubCoachPhotoUrl, setClubCoachPhotoUrl] = useState(clubInfo.coachPhotoUrl || '');
  const [clubCaptain, setClubCaptain] = useState(clubInfo.captain);
  const [clubTopScorer, setClubTopScorer] = useState(clubInfo.topScorer);
  const [clubCurrentStatus, setClubCurrentStatus] = useState(clubInfo.currentStatus);
  const [clubBannerBg, setClubBannerBg] = useState(clubInfo.bannerBackgroundUrl || '/diallore-team-banner.jpg');
  const [clubHeaderBg, setClubHeaderBg] = useState(clubInfo.headerBackgroundUrl || '/diallore-team-banner.jpg');

  // Multi-section background URLs (12 distinct sections/parts of the site)
  const [bgHomeHero, setBgHomeHero] = useState(clubInfo.backgroundUrls?.homeHero || clubInfo.bannerBackgroundUrl || '/diallore-team-banner.jpg');
  const [bgHomeNextMatch, setBgHomeNextMatch] = useState(clubInfo.backgroundUrls?.homeNextMatch || 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=1600&q=80');
  const [bgHomeOngamEvent, setBgHomeOngamEvent] = useState(clubInfo.backgroundUrls?.homeOngamEvent || 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=1600&q=80');
  const [bgHeader, setBgHeader] = useState(clubInfo.backgroundUrls?.headerBg || clubInfo.headerBackgroundUrl || '');
  const [bgMatches, setBgMatches] = useState(clubInfo.backgroundUrls?.matchesBanner || 'https://images.unsplash.com/photo-1522778119026-d647f0596c20?auto=format&fit=crop&w=1600&q=80');
  const [bgTeam, setBgTeam] = useState(clubInfo.backgroundUrls?.teamBanner || '/diallore-team-banner.jpg');
  const [bgMember, setBgMember] = useState(clubInfo.backgroundUrls?.memberBanner || 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=1600&q=80');
  const [bgNews, setBgNews] = useState(clubInfo.backgroundUrls?.newsBanner || 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=1600&q=80');
  const [bgFooter, setBgFooter] = useState(clubInfo.backgroundUrls?.footerBg || 'https://images.unsplash.com/photo-1517649763962-0c623266ddc0?auto=format&fit=crop&w=1600&q=80');
  const [bgModalMatch, setBgModalMatch] = useState(clubInfo.backgroundUrls?.modalMatchBg || 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=1600&q=80');
  const [bgModalPlayer, setBgModalPlayer] = useState(clubInfo.backgroundUrls?.modalPlayerBg || '/diallore-team-banner.jpg');
  const [bgGlobal, setBgGlobal] = useState(clubInfo.backgroundUrls?.appGlobalBg || '');

  // Master URL for applying background to ALL sections at once
  const [masterBgUrl, setMasterBgUrl] = useState('');
  const masterBgInputRef = useRef<HTMLInputElement>(null);

  // Sub-section filter in the backgrounds tab
  const [selectedBgSection, setSelectedBgSection] = useState<string>('all');

  // Sync state if clubInfo changes
  useEffect(() => {
    setClubBannerBg(clubInfo.bannerBackgroundUrl || '/diallore-team-banner.jpg');
    setClubHeaderBg(clubInfo.headerBackgroundUrl || '/diallore-team-banner.jpg');
    if (clubInfo.backgroundUrls) {
      setBgHomeHero(clubInfo.backgroundUrls.homeHero || clubInfo.bannerBackgroundUrl || '/diallore-team-banner.jpg');
      setBgHomeNextMatch(clubInfo.backgroundUrls.homeNextMatch || '');
      setBgHomeOngamEvent(clubInfo.backgroundUrls.homeOngamEvent || '');
      setBgHeader(clubInfo.backgroundUrls.headerBg || clubInfo.headerBackgroundUrl || '');
      setBgMatches(clubInfo.backgroundUrls.matchesBanner || '');
      setBgTeam(clubInfo.backgroundUrls.teamBanner || '');
      setBgMember(clubInfo.backgroundUrls.memberBanner || '');
      setBgNews(clubInfo.backgroundUrls.newsBanner || '');
      setBgFooter(clubInfo.backgroundUrls.footerBg || '');
      setBgModalMatch(clubInfo.backgroundUrls.modalMatchBg || '');
      setBgModalPlayer(clubInfo.backgroundUrls.modalPlayerBg || '');
      setBgGlobal(clubInfo.backgroundUrls.appGlobalBg || '');
    }
  }, [clubInfo]);

  // Password Change State
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Hidden File Inputs
  const logoFileInputRef = useRef<HTMLInputElement>(null);
  const bannerBgInputRef = useRef<HTMLInputElement>(null);
  const headerBgInputRef = useRef<HTMLInputElement>(null);
  const playerPhotoInputRef = useRef<HTMLInputElement>(null);
  const coachPhotoInputRef = useRef<HTMLInputElement>(null);
  const opponentLogoInputRef = useRef<HTMLInputElement>(null);

  // Preset Backgrounds
  const presetBackgrounds = [
    {
      title: "Effectif Officiel Équipe (Touba-Mbacké)",
      description: "Photo originale de l'effectif des joueurs sur le terrain d'entraînement en terre battue",
      url: "/diallore-team-banner.jpg",
    },
    {
      title: "Académie & Jeunesse au Cœur",
      description: "Ambiance footballistique africaine chaleureuse",
      url: "https://images.unsplash.com/photo-1517649763962-0c623266ddc0?auto=format&fit=crop&w=1600&q=80",
    },
    {
      title: "Stade & Match Nocturne",
      description: "Éclairage projecteur et pelouse sous les projecteurs",
      url: "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=1600&q=80",
    },
    {
      title: "Pelouse & Ballon Moderne",
      description: "Ambiance compétition professionnelle",
      url: "https://images.unsplash.com/photo-1522778119026-d647f0596c20?auto=format&fit=crop&w=1600&q=80",
    },
  ];

  // Preset Logos
  const presetLogos = [
    { label: 'Logo Officiel ASC Dialloré (Phénix & Ailes)', url: '/icon.svg' },
    { label: 'Logo ASC Escale de Mbacké', url: '/asc-escale.svg' },
    { label: 'Logo ASC Manko (Lion d\'Or)', url: '/asc-manko.svg' },
    { label: 'Logo Touba Football Club', url: '/touba-fc.svg' },
    { label: 'Logo Élite Mbacké Baol', url: '/elite-mbacke.svg' },
    { label: 'Logo Académie Diambars Touba', url: '/diambars-touba.svg' },
  ];

  // Handle Admin Login
  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    if (!passwordInput) {
      setLoginError('Veuillez saisir votre mot de passe administrateur.');
      return;
    }
    const success = loginAdmin(passwordInput);
    if (!success) {
      setLoginError('Mot de passe administrateur incorrect.');
    } else {
      setPasswordInput('');
    }
  };

  // Handle Logo Upload from PC / Phone
  const handleFileUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    setter: (val: string) => void
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        showToast('Fichier trop volumineux', 'Veuillez choisir une image inférieure à 2 Mo.', 'alert');
        return;
      }
      const reader = new FileReader();
      reader.onload = evt => {
        if (evt.target?.result) {
          setter(evt.target.result as string);
          showToast('Image chargée', 'Le fichier a été converti et prévisualisé avec succès.', 'success');
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Open Player Modal for Create
  const handleOpenCreatePlayer = () => {
    setEditingPlayer(null);
    setPName('');
    setPFirstName('');
    setPLastName('');
    setPNumber(players.length + 1);
    setPPosition('ATT');
    setPPositionDetail('Attaquant (AT)');
    setPRoleTag('AT');
    setPAge(20);
    setPHeight('1.80 m');
    setPWeight('74 kg');
    setPPreferredFoot('Droit');
    setPMarketValue('750 k€');
    setPPhotoUrl('https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80');
    setPBio('');
    setPIsCaptain(false);
    setPIsTopScorer(false);
    setPAppearances(0);
    setPGoals(0);
    setPAssists(0);
    setIsPlayerModalOpen(true);
  };

  // Open Player Modal for Edit
  const handleOpenEditPlayer = (p: Player) => {
    setEditingPlayer(p);
    setPName(p.name);
    setPFirstName(p.firstName || '');
    setPLastName(p.lastName || '');
    setPNumber(p.number);
    setPPosition((p.position as any) || 'ATT');
    setPPositionDetail(p.positionDetail || '');
    setPRoleTag(
      p.positionDetail?.includes('DC') ? 'DC' :
      p.positionDetail?.includes('DD') ? 'DD' :
      p.positionDetail?.includes('DG') ? 'DG' :
      p.positionDetail?.includes('MD') ? 'MD' :
      p.positionDetail?.includes('MO') ? 'MO' :
      p.positionDetail?.includes('AT') ? 'AT' :
      p.positionDetail?.includes('AG') ? 'AG' :
      p.positionDetail?.includes('AD') ? 'AD' :
      p.position === 'GK' ? 'GK' : 'AT'
    );
    setPAge(p.age || 20);
    setPHeight(p.height || '1.80 m');
    setPWeight(p.weight || '74 kg');
    setPPreferredFoot(p.preferredFoot || 'Droit');
    setPMarketValue(p.marketValue || '750 k€');
    setPPhotoUrl(p.photoUrl || '');
    setPBio(p.bio || '');
    setPIsCaptain(Boolean(p.isCaptain));
    setPIsTopScorer(Boolean(p.isTopScorer));
    setPAppearances(p.appearances || 0);
    setPGoals(p.goals || 0);
    setPAssists(p.assists || 0);
    setIsPlayerModalOpen(true);
  };

  // Save Player (Create or Update)
  const handleSavePlayer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pName.trim()) {
      showToast('Erreur', 'Veuillez saisir le nom du joueur.', 'alert');
      return;
    }

    const fullPositionDetail = pPositionDetail.trim() || `${pRoleTag} • ${pPosition}`;

    const playerData: Player = {
      id: editingPlayer?.id || `p-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      name: pName.trim(),
      firstName: pFirstName.trim() || pName.split(' ')[0] || '',
      lastName: pLastName.trim() || pName.split(' ').slice(1).join(' ') || '',
      fullName: pName.trim(),
      number: Number(pNumber) || 1,
      position: pPosition,
      positionDetail: fullPositionDetail,
      nationality: 'Sénégalaise',
      countryCode: 'SN',
      flag: '🇸🇳',
      age: Number(pAge) || 20,
      birthDate: editingPlayer?.birthDate || '2005-01-01',
      height: pHeight || '1.80 m',
      weight: pWeight || '73 kg',
      preferredFoot: pPreferredFoot,
      marketValue: pMarketValue || '600 k€',
      contractUntil: '2028',
      joinedYear: editingPlayer?.joinedYear || 2022,
      photoUrl: pPhotoUrl.trim() || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80',
      appearances: Number(pAppearances) || 0,
      minutesPlayed: (Number(pAppearances) || 0) * 85,
      goals: Number(pGoals) || 0,
      assists: Number(pAssists) || 0,
      passAccuracy: 88,
      tacklesPerGame: 2.1,
      yellowCards: 1,
      redCards: 0,
      attributes: editingPlayer?.attributes || {
        pace: 88,
        shooting: 85,
        passing: 84,
        dribbling: 87,
        defending: 65,
        physical: 82,
      },
      bio: pBio.trim() || `Joueur talentueux évoluant sous les couleurs de l'ASC Dialloré sous les ordres de Coach Gagne.`,
      previousClubs: editingPlayer?.previousClubs || ['ASC Dialloré'],
      honors: editingPlayer?.honors || ['Championnat ONGAM 2026'],
      isCaptain: pIsCaptain,
      isTopScorer: pIsTopScorer,
    };

    if (editingPlayer) {
      updatePlayer(editingPlayer.id, playerData);
    } else {
      addPlayer(playerData);
    }

    setIsPlayerModalOpen(false);
  };

  // Save Club Information
  const handleSaveClubInfo = (e: React.FormEvent) => {
    e.preventDefault();
    updateClubInfo({
      name: clubName.trim(),
      shortName: clubShortName.trim(),
      slogan: clubSlogan.trim(),
      logoUrl: clubLogoUrl.trim(),
      stadium: clubStadium.trim(),
      city: clubCity.trim(),
      president: adminPresName.trim(),
      presidentTitle: adminPresTitle.trim(),
      presidentPhotoUrl: adminPresPhotoUrl.trim(),
      presidentWord: adminPresWord.trim(),
      coach: clubCoach.trim(),
      coachRole: clubCoachRole.trim(),
      coachBio: clubCoachBio.trim(),
      coachPhotoUrl: clubCoachPhotoUrl.trim(),
      captain: clubCaptain.trim(),
      topScorer: clubTopScorer.trim(),
      currentStatus: clubCurrentStatus.trim(),
      bannerBackgroundUrl: clubBannerBg.trim(),
      headerBackgroundUrl: clubHeaderBg.trim(),
    });

    const presStaff = staff.find(s => s.category === 'president');
    if (presStaff) {
      updateStaffMember(presStaff.id, {
        name: adminPresName.trim(),
        title: `${adminPresTitle.trim()} de l'${clubName.trim()}`,
        photoUrl: adminPresPhotoUrl.trim() || presStaff.photoUrl,
        bio: adminPresWord.trim() || presStaff.bio,
      });
    }
  };

  // Open Match Modal for Creating a New Planned Match
  const handleOpenCreateMatch = () => {
    setEditingMatch(null);
    setMOpponent('');
    setMOpponentShort('');
    setMOpponentLogo('/asc-escale.svg');
    setMCompetition('Championnat ONGAM / Cadets 2026');
    setMRound('2ème Journée');
    setMDate('Vendredi 02 Octobre 2026');
    setMTime('09:00');
    setMVenue(clubInfo.stadium || 'TERIANN ÉCOLE NDIAGALAK');
    setMStatus('upcoming');
    setMIsHome(true);
    setMHomeScore(0);
    setMAwayScore(0);
    setMIsForfeit(false);
    setMForfeitReason('');
    setMForfeitNote('');
    setMTicketPrice(1000);
    setMTicketsAvailable(true);
    setIsMatchModalOpen(true);
  };

  // Open Match Modal for Edit
  const handleOpenEditMatch = (m: Match) => {
    setEditingMatch(m);
    setMOpponent(m.opponent);
    setMOpponentShort(m.opponentShort || m.opponent);
    setMOpponentLogo(m.opponentLogo || '');
    setMCompetition(m.competition);
    setMRound(m.round || '1ère Journée');
    setMDate(m.date);
    setMTime(m.time);
    setMVenue(m.venue);
    setMStatus(m.status);
    setMIsHome(m.isHome ?? true);
    setMHomeScore(m.homeScore ?? 0);
    setMAwayScore(m.awayScore ?? 0);
    setMIsForfeit(Boolean(m.isForfeit));
    setMForfeitReason(m.forfeitReason || '');
    setMForfeitNote(m.forfeitNote || '');
    setMTicketPrice(m.ticketPriceFrom ?? 1000);
    setMTicketsAvailable(m.ticketsAvailable ?? true);
    setIsMatchModalOpen(true);
  };

  // Apply one background image to ALL 14 sections/parts of the app simultaneously
  const handleApplyMasterBg = (url: string) => {
    const cleanUrl = url.trim();
    if (!cleanUrl) {
      showToast('Image requise', 'Veuillez saisir une URL ou téléverser une image.', 'alert');
      return;
    }
    setBgHomeHero(cleanUrl);
    setBgHomeNextMatch(cleanUrl);
    setBgHomeOngamEvent(cleanUrl);
    setBgHeader(cleanUrl);
    setBgMatches(cleanUrl);
    setBgTeam(cleanUrl);
    setBgMember(cleanUrl);
    setBgNews(cleanUrl);
    setBgFooter(cleanUrl);
    setBgModalMatch(cleanUrl);
    setBgModalPlayer(cleanUrl);
    setBgGlobal(cleanUrl);

    updateClubInfo({
      bannerBackgroundUrl: cleanUrl,
      headerBackgroundUrl: cleanUrl,
      backgroundUrls: {
        homeHero: cleanUrl,
        homeNextMatch: cleanUrl,
        homeOngamEvent: cleanUrl,
        headerBg: cleanUrl,
        matchesBanner: cleanUrl,
        teamBanner: cleanUrl,
        memberBanner: cleanUrl,
        newsBanner: cleanUrl,
        footerBg: cleanUrl,
        modalMatchBg: cleanUrl,
        modalPlayerBg: cleanUrl,
        appGlobalBg: cleanUrl,
      },
    });
    showToast('Toutes les parties mises à jour !', 'L’arrière-plan a été appliqué instantanément à TOUTES les 12 parties du site.', 'success');
  };

  // Save all 12 background sections together
  const handleSaveAllBackgrounds = () => {
    updateClubInfo({
      bannerBackgroundUrl: bgHomeHero.trim(),
      headerBackgroundUrl: bgHeader.trim(),
      backgroundUrls: {
        homeHero: bgHomeHero.trim(),
        homeNextMatch: bgHomeNextMatch.trim(),
        homeOngamEvent: bgHomeOngamEvent.trim(),
        headerBg: bgHeader.trim(),
        matchesBanner: bgMatches.trim(),
        teamBanner: bgTeam.trim(),
        memberBanner: bgMember.trim(),
        newsBanner: bgNews.trim(),
        footerBg: bgFooter.trim(),
        modalMatchBg: bgModalMatch.trim(),
        modalPlayerBg: bgModalPlayer.trim(),
        appGlobalBg: bgGlobal.trim(),
      },
    });
    showToast('Tous les arrières-plans enregistrés', 'Les visuels des 12 parties du site ont été enregistrés avec succès.', 'success');
  };

  // Save Match (Create or Update)
  const handleSaveMatch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!mOpponent.trim()) {
      showToast('Nom requis', "Veuillez renseigner le nom de l'équipe adverse.", 'alert');
      return;
    }

    const oppLower = mOpponent.trim().toLowerCase();
    let resolvedOppLogo = mOpponentLogo.trim();
    if (!resolvedOppLogo || resolvedOppLogo === '/icon.svg') {
      if (oppLower.includes('escale')) resolvedOppLogo = '/asc-escale.svg';
      else if (oppLower.includes('manko')) resolvedOppLogo = '/asc-manko.svg';
      else if (oppLower.includes('touba')) resolvedOppLogo = '/touba-fc.svg';
      else if (oppLower.includes('élite') || oppLower.includes('elite')) resolvedOppLogo = '/elite-mbacke.svg';
      else if (oppLower.includes('diambars')) resolvedOppLogo = '/diambars-touba.svg';
      else resolvedOppLogo = '/asc-escale.svg';
    }

    const homeTeam = mIsHome ? clubInfo.name : mOpponent.trim();
    const awayTeam = mIsHome ? mOpponent.trim() : clubInfo.name;

    const isForfeit = Boolean(mIsForfeit);
    const finalStatus = isForfeit ? 'finished' : mStatus;
    const finalHomeScore = isForfeit
      ? (mIsHome ? 3 : 0)
      : (finalStatus === 'upcoming' ? undefined : Number(mHomeScore ?? 0));
    const finalAwayScore = isForfeit
      ? (mIsHome ? 0 : 3)
      : (finalStatus === 'upcoming' ? undefined : Number(mAwayScore ?? 0));

    const matchDate = mDate.trim() || 'Prochainement';
    const matchTime = mTime.trim() || '16:30';
    const matchVenue = mVenue.trim() || clubInfo.stadium || 'TERIANN ÉCOLE NDIAGALAK';

    const matchData: Match = {
      id: editingMatch ? editingMatch.id : `m-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      competition: mCompetition.trim() || 'Championnat ONGAM / Cadets 2026',
      competitionBadge: editingMatch?.competitionBadge || '🏆',
      round: mRound.trim() || 'Phase Régulière',
      date: matchDate,
      time: matchTime,
      timestamp: editingMatch?.timestamp || Date.now(),
      isHome: mIsHome,
      opponent: mOpponent.trim(),
      opponentShort: mOpponentShort.trim() || mOpponent.trim().substring(0, 4).toUpperCase(),
      opponentLogo: resolvedOppLogo,
      venue: matchVenue,
      status: finalStatus,
      homeScore: finalHomeScore,
      awayScore: finalAwayScore,
      homeTeamName: homeTeam,
      awayTeamName: awayTeam,
      isForfeit: isForfeit,
      forfeitWinner: isForfeit ? (mIsHome ? 'home' : 'away') : undefined,
      forfeitReason: isForfeit ? (mForfeitReason.trim() || "L'adversaire ne s'est pas présenté au terrain officiel.") : undefined,
      forfeitNote: isForfeit ? mForfeitNote.trim() : undefined,
      ticketPriceFrom: Number(mTicketPrice) || 1000,
      ticketsAvailable: mTicketsAvailable,
      attendance: editingMatch?.attendance || '850 spectateurs',
      referee: editingMatch?.referee || 'Commission Arbitrage ONGAM',
      stats: editingMatch?.stats || {
        possessionHome: isForfeit ? (mIsHome ? 100 : 0) : 55,
        possessionAway: isForfeit ? (mIsHome ? 0 : 100) : 45,
        xGHome: isForfeit ? 3.0 : 1.8,
        xGAway: isForfeit ? 0.0 : 0.7,
        shotsHome: isForfeit ? 3 : 12,
        shotsAway: isForfeit ? 0 : 5,
        shotsOnTargetHome: isForfeit ? 3 : 7,
        shotsOnTargetAway: isForfeit ? 0 : 2,
        passAccuracyHome: 86,
        passAccuracyAway: 78,
        cornersHome: 5,
        cornersAway: 3,
        foulsHome: 8,
        foulsAway: 11,
        offsidesHome: 2,
        offsidesAway: 1,
        yellowCardsHome: 1,
        yellowCardsAway: 2,
        redCardsHome: 0,
        redCardsAway: 0,
        savesHome: 2,
        savesAway: 4,
      },
      lineupHome: editingMatch?.lineupHome || [],
      lineupAway: editingMatch?.lineupAway || [],
      formationHome: editingMatch?.formationHome || '4-3-3',
      formationAway: editingMatch?.formationAway || '4-4-2',
    };

    try {
      if (editingMatch) {
        updateMatch(editingMatch.id, matchData);
        showToast('Match enregistré', `La rencontre contre ${matchData.opponent} a été mise à jour.`, 'success');
      } else {
        addMatch(matchData);
        showToast('Match enregistré', `Nouveau match contre ${matchData.opponent} planifié avec succès !`, 'success');
      }
      setIsMatchModalOpen(false);
    } catch (err) {
      console.error(err);
      showToast('Erreur', 'Impossible de sauvegarder le match.', 'alert');
    }
  };

  // Change Password
  const handleChangePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      showToast('Erreur', 'Les deux mots de passe ne correspondent pas.', 'alert');
      return;
    }
    changeAdminPassword(newPassword);
    setNewPassword('');
    setConfirmPassword('');
  };

  // Filtered Players
  const filteredPlayers = players.filter(p =>
    p.name.toLowerCase().includes(playerSearchQuery.toLowerCase()) ||
    (p.positionDetail && p.positionDetail.toLowerCase().includes(playerSearchQuery.toLowerCase())) ||
    String(p.number).includes(playerSearchQuery)
  );

  // Filtered Matches
  const filteredMatches = matches.filter(m => {
    const matchesFilter =
      matchFilterStatus === 'all' ||
      (matchFilterStatus === 'upcoming' && m.status === 'upcoming') ||
      (matchFilterStatus === 'finished' && m.status === 'finished') ||
      (matchFilterStatus === 'live' && m.status === 'live');

    const matchesSearch =
      !matchSearchQuery ||
      m.opponent.toLowerCase().includes(matchSearchQuery.toLowerCase()) ||
      m.competition.toLowerCase().includes(matchSearchQuery.toLowerCase()) ||
      m.venue.toLowerCase().includes(matchSearchQuery.toLowerCase()) ||
      (m.round && m.round.toLowerCase().includes(matchSearchQuery.toLowerCase()));

    return matchesFilter && matchesSearch;
  });

  const upcomingMatchesCount = matches.filter(m => m.status === 'upcoming').length;
  const finishedMatchesCount = matches.filter(m => m.status === 'finished').length;
  const liveMatchesCount = matches.filter(m => m.status === 'live').length;

  // -------------------------------------------------------------
  // VIEW 1: NOT LOGGED IN -> LOGIN PAGE
  // -------------------------------------------------------------
  if (!isAdminLoggedIn) {
    return (
      <div className="max-w-md mx-auto my-12 animate-in fade-in">
        <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="p-8 bg-gradient-to-br from-slate-950 via-red-950 to-slate-900 text-white text-center relative">
            <div className="w-16 h-16 rounded-2xl bg-red-600/30 border-2 border-red-500/50 text-red-400 flex items-center justify-center mx-auto mb-4 shadow-xl">
              <Lock className="w-8 h-8" />
            </div>
            <h1 className="text-2xl font-black tracking-tight">
              Connexion Administrateur
            </h1>
            <p className="text-xs text-slate-300 mt-2 max-w-xs mx-auto">
              Accès réservé à la direction pour modifier l'effectif des joueurs, le nom de l'équipe, le logo et les matchs.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleLoginSubmit} className="p-6 sm:p-8 space-y-5">
            {loginError && (
              <div className="p-3 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-400 text-xs flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                <span>{loginError}</span>
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                <span>Mot de passe administrateur</span>
              </label>
              <div className="relative">
                <KeyRound className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={passwordInput}
                  onChange={e => setPasswordInput(e.target.value)}
                  placeholder="Entrez le mot de passe admin..."
                  className="w-full pl-10 pr-10 py-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white text-sm outline-none focus:border-red-500 transition font-mono"
                  autoFocus
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 rounded-2xl bg-red-600 hover:bg-red-700 active:scale-[0.98] text-white font-black text-sm shadow-xl shadow-red-600/30 transition flex items-center justify-center gap-2"
            >
              <Unlock className="w-4 h-4" />
              <span>Se Connecter à l'Administration</span>
            </button>

            <div className="pt-2 border-t border-slate-100 dark:border-slate-800 text-center">
              <button
                type="button"
                onClick={() => setActiveTab('home')}
                className="text-xs font-bold text-slate-500 hover:text-slate-900 dark:hover:text-slate-300 transition"
              >
                ← Retourner au site public
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // VIEW 2: LOGGED IN -> FULL ADMIN DASHBOARD
  // -------------------------------------------------------------
  return (
    <div className="space-y-8 animate-in fade-in pb-16">
      {/* Top Banner with Admin Bar */}
      <div className="rounded-3xl bg-gradient-to-r from-red-950 via-slate-900 to-slate-950 border border-red-800/40 p-6 sm:p-8 text-white shadow-xl">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-red-600 text-white flex items-center justify-center shadow-lg border border-red-400/40 flex-shrink-0">
              <ShieldCheck className="w-8 h-8" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-black uppercase">
                  ● Connecté en Administrateur
                </span>
                <span className="text-xs text-slate-400">
                  {clubInfo.name}
                </span>
              </div>
              <h1 className="text-xl sm:text-3xl font-black mt-1">
                Espace de Gestion & Administration
              </h1>
              <p className="text-xs text-slate-300 mt-0.5">
                Modifiez librement l'effectif des joueurs, le nom de l'équipe, le logo et les rencontres.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={() => setActiveTab('team')}
              className="flex-1 sm:flex-none px-4 py-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-200 text-xs font-bold transition flex items-center justify-center gap-1.5"
            >
              <span>Voir l'Effectif</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={logoutAdmin}
              className="flex-1 sm:flex-none px-4 py-2 rounded-xl bg-rose-600/20 hover:bg-rose-600/30 text-rose-300 border border-rose-500/30 text-xs font-bold transition flex items-center justify-center gap-1.5"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Déconnexion</span>
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-3 overflow-x-auto no-scrollbar">
        <button
          onClick={() => setActiveAdminTab('players')}
          className={`px-4 py-2.5 rounded-2xl text-xs font-black transition flex items-center gap-2 ${
            activeAdminTab === 'players'
              ? 'bg-red-600 text-white shadow-lg shadow-red-600/30'
              : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Gestion des Joueurs ({players.length})</span>
        </button>

        <button
          onClick={() => setActiveAdminTab('members')}
          className={`px-4 py-2.5 rounded-2xl text-xs font-black transition flex items-center gap-2 ${
            activeAdminTab === 'members'
              ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/30'
              : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Users className="w-4 h-4 text-amber-500" />
          <span>Gestion des Membres ({members.length})</span>
        </button>

        <button
          onClick={() => setActiveAdminTab('staff')}
          className={`px-4 py-2.5 rounded-2xl text-xs font-black transition flex items-center gap-2 ${
            activeAdminTab === 'staff'
              ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/30'
              : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Briefcase className="w-4 h-4 text-emerald-400" />
          <span>Staff & Direction ({staff.length})</span>
        </button>

        <button
          onClick={() => setActiveAdminTab('club')}
          className={`px-4 py-2.5 rounded-2xl text-xs font-black transition flex items-center gap-2 ${
            activeAdminTab === 'club'
              ? 'bg-red-600 text-white shadow-lg shadow-red-600/30'
              : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <ImageIcon className="w-4 h-4" />
          <span>Identité du Club & Logo</span>
        </button>

        <button
          onClick={() => setActiveAdminTab('backgrounds')}
          className={`px-4 py-2.5 rounded-2xl text-xs font-black transition flex items-center gap-2 ${
            activeAdminTab === 'backgrounds'
              ? 'bg-red-600 text-white shadow-lg shadow-red-600/30'
              : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Sliders className="w-4 h-4" />
          <span>Arrières-plans & Visuels</span>
        </button>

        <button
          onClick={() => setActiveAdminTab('matches')}
          className={`px-4 py-2.5 rounded-2xl text-xs font-black transition flex items-center gap-2 ${
            activeAdminTab === 'matches'
              ? 'bg-red-600 text-white shadow-lg shadow-red-600/30'
              : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Calendar className="w-4 h-4" />
          <span>Matchs & Adversaires</span>
        </button>

        <button
          onClick={() => setActiveAdminTab('standings')}
          className={`px-4 py-2.5 rounded-2xl text-xs font-black transition flex items-center gap-2 ${
            activeAdminTab === 'standings'
              ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/30'
              : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Trophy className="w-4 h-4 text-amber-500" />
          <span>Classement Championnat</span>
        </button>

        <button
          onClick={() => setActiveAdminTab('tactics')}
          className={`px-4 py-2.5 rounded-2xl text-xs font-black transition flex items-center gap-2 ${
            activeAdminTab === 'tactics'
              ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/30'
              : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Compass className="w-4 h-4 text-emerald-400" />
          <span>Schémas & Formations</span>
        </button>

        <button
          onClick={() => setActiveAdminTab('security')}
          className={`px-4 py-2.5 rounded-2xl text-xs font-black transition flex items-center gap-2 ${
            activeAdminTab === 'security'
              ? 'bg-red-600 text-white shadow-lg shadow-red-600/30'
              : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Lock className="w-4 h-4" />
          <span>Sécurité & Mot de Passe</span>
        </button>
      </div>

      {/* Quick Navigation to specialized club management sections */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <button
          onClick={() => setActiveAdminTab('standings')}
          className="p-3.5 rounded-2xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-left transition flex items-center justify-between group"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-bold">
              <Trophy className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-black text-slate-900 dark:text-white">
                Classement Championnat
              </div>
              <div className="text-[11px] text-amber-600 dark:text-amber-400">
                Points, victoires, buts & poules
              </div>
            </div>
          </div>
          <span className="text-xs text-amber-500 font-bold group-hover:translate-x-1 transition-transform">→</span>
        </button>

        <button
          onClick={() => setActiveAdminTab('tactics')}
          className="p-3.5 rounded-2xl bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-left transition flex items-center justify-between group"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold">
              <Compass className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-black text-slate-900 dark:text-white">
                Schémas & Formations
              </div>
              <div className="text-[11px] text-emerald-600 dark:text-emerald-400">
                4-3-3, 4-2-3-1, titulaires & terrain
              </div>
            </div>
          </div>
          <span className="text-xs text-emerald-500 font-bold group-hover:translate-x-1 transition-transform">→</span>
        </button>

        <button
          onClick={() => setActiveAdminTab('members')}
          className="p-3.5 rounded-2xl bg-slate-500/10 hover:bg-slate-500/20 border border-slate-500/30 text-left transition flex items-center justify-between group"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-700 text-white flex items-center justify-center font-bold">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-black text-slate-900 dark:text-white">
                Membres & Adhérents
              </div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400">
                {members.length} inscrits • Profils & statut
              </div>
            </div>
          </div>
          <span className="text-xs text-slate-400 font-bold group-hover:translate-x-1 transition-transform">→</span>
        </button>

        <button
          onClick={() => setActiveAdminTab('staff')}
          className="p-3.5 rounded-2xl bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-left transition flex items-center justify-between group"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-red-600 text-white flex items-center justify-center font-bold">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-black text-slate-900 dark:text-white">
                Staff & Direction
              </div>
              <div className="text-[11px] text-red-600 dark:text-red-400">
                {staff.length} membres • Coach Gagne
              </div>
            </div>
          </div>
          <span className="text-xs text-red-500 font-bold group-hover:translate-x-1 transition-transform">→</span>
        </button>
      </div>

      {/* ========================================================= */}
      {/* TAB 1: GESTION DES JOUEURS                                */}
      {/* ========================================================= */}
      {activeAdminTab === 'players' && (
        <div className="space-y-6">
          {/* Header Action Bar */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
            <div>
              <h2 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
                <span>Effectif des Joueurs</span>
                <span className="px-2 py-0.5 rounded-full bg-red-500/10 text-red-600 dark:text-red-400 text-xs font-mono">
                  {players.length} joueur{players.length > 1 ? 's' : ''}
                </span>
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                {players.length === 0
                  ? "Tous les profils ont été effacés selon votre demande. Cliquez sur \"Ajouter un Joueur\" pour créer le profil de chacun ou restaurer les gabarits."
                  : "Vous pouvez modifier chaque joueur individuellement (nom, profil, poste, photo...) ou en ajouter de nouveaux."}
              </p>
            </div>

            <div className="flex items-center gap-2 flex-wrap w-full sm:w-auto">
              <button
                onClick={handleOpenCreatePlayer}
                className="px-4 py-2.5 rounded-2xl bg-red-600 hover:bg-red-700 text-white text-xs font-black shadow-lg shadow-red-600/30 transition flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>Ajouter un Joueur</span>
              </button>

              {players.length > 0 && (
                <button
                  onClick={() => setIsClearAllPlayersModalOpen(true)}
                  className="px-3.5 py-2.5 rounded-2xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-900 text-xs font-bold hover:bg-rose-100 transition flex items-center gap-1.5"
                  title="Effacer tous les profils de joueurs"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Effacer Tout</span>
                </button>
              )}

              {players.length === 0 && (
                <button
                  onClick={restoreTemplatePlayers}
                  className="px-3.5 py-2.5 rounded-2xl bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 border border-amber-300 dark:border-amber-800 text-xs font-bold hover:bg-amber-100 transition flex items-center gap-1.5"
                  title="Restaurer les 19 joueurs de Coach Gagne en un clic"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Restaurer Roster Coach Gagne (19)</span>
                </button>
              )}
            </div>
          </div>

          {/* Search Bar if Players Exist */}
          {players.length > 0 && (
            <div className="relative max-w-md">
              <input
                type="text"
                placeholder="Rechercher un joueur à modifier (nom, poste, numéro...)"
                value={playerSearchQuery}
                onChange={e => setPlayerSearchQuery(e.target.value)}
                className="w-full px-4 py-2.5 text-xs rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white outline-none focus:border-red-500 shadow-sm"
              />
            </div>
          )}

          {/* Empty Roster State */}
          {players.length === 0 ? (
            <div className="text-center py-16 px-6 rounded-3xl bg-white dark:bg-slate-900 border-2 border-dashed border-slate-300 dark:border-slate-800 space-y-4">
              <div className="w-16 h-16 rounded-3xl bg-red-50 dark:bg-red-950/40 text-red-500 mx-auto flex items-center justify-center">
                <Users className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-black text-slate-900 dark:text-white">
                Tous les profils des joueurs ont été effacés
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto">
                L'effectif est actuellement vierge. Vous pouvez dès maintenant envoyer ou enregistrer la fiche de chaque joueur avec son nom, poste (DC, DD, DG, MD, MO, AT, AG, AD, GK), photo et caractéristiques.
              </p>
              <div className="flex items-center justify-center gap-3 pt-2">
                <button
                  onClick={handleOpenCreatePlayer}
                  className="px-5 py-3 rounded-2xl bg-red-600 hover:bg-red-700 text-white text-xs font-black shadow-lg transition flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  <span>Créer le Premier Joueur</span>
                </button>
                <button
                  onClick={restoreTemplatePlayers}
                  className="px-4 py-3 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-200 text-xs font-bold transition flex items-center gap-2"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Restaurer les 19 Joueurs</span>
                </button>
              </div>
            </div>
          ) : (
            /* Players Grid */
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredPlayers.map(p => (
                <div
                  key={p.id}
                  className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 shadow-sm hover:shadow-md transition flex flex-col justify-between space-y-3"
                >
                  <div className="flex items-start gap-3">
                    <div className="relative w-16 h-16 rounded-2xl overflow-hidden bg-slate-800 flex-shrink-0 border border-slate-200 dark:border-slate-700">
                      <img src={p.photoUrl} alt={p.name} className="w-full h-full object-cover object-top" />
                      <span className="absolute bottom-0 right-0 px-1 rounded-tl bg-slate-950/90 text-amber-400 font-mono text-[10px] font-black">
                        #{p.number}
                      </span>
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1">
                        <span className="px-1.5 py-0.2 rounded bg-red-500/10 text-red-600 dark:text-red-400 font-black text-[9px] uppercase">
                          {p.position}
                        </span>
                        {p.isCaptain && (
                          <span className="px-1.5 py-0.2 rounded bg-amber-500 text-slate-950 font-black text-[9px]">
                            Capitaine
                          </span>
                        )}
                      </div>
                      <h4 className="text-sm font-black text-slate-900 dark:text-white truncate mt-0.5">
                        {p.name}
                      </h4>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                        {p.positionDetail}
                      </p>
                      <p className="text-[10px] text-slate-400 font-mono mt-0.5">
                        {p.age} ans • {p.marketValue}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                    <button
                      onClick={() => handleOpenEditPlayer(p)}
                      className="flex-1 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-750 text-slate-800 dark:text-slate-200 text-xs font-bold transition flex items-center justify-center gap-1.5"
                    >
                      <Edit className="w-3.5 h-3.5 text-blue-500" />
                      <span>Modifier</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleOpenPlayerCVAdmin(p)}
                      className="py-1.5 px-2.5 rounded-xl bg-red-600/10 hover:bg-red-600 text-red-600 hover:text-white dark:bg-red-500/10 dark:text-red-400 dark:hover:bg-red-600 dark:hover:text-white text-xs font-bold transition flex items-center justify-center gap-1"
                      title="Créer ou modifier le CV Sportif officiel de ce joueur"
                    >
                      <FileText className="w-3.5 h-3.5" />
                      <span>CV</span>
                    </button>

                    <button
                      onClick={() => setPlayerToDelete(p)}
                      className="p-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 transition"
                      title="Supprimer ce joueur"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB: GESTION DES MEMBRES & CHANGEMENT DE PROFIL           */}
      {/* ========================================================= */}
      {activeAdminTab === 'members' && (
        <div className="space-y-6">
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
                  <Users className="w-5 h-5 text-amber-500" />
                  <span>Gestion des Membres & Profils ({members.length})</span>
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  En tant qu'administrateur, vous avez la possibilité de <strong>changer le profil d'un membre</strong> (nom, photo/avatar, numéro, catégorie, statut, ville, téléphone, notes), d'inscrire de nouveaux membres ou de les supprimer.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={handleOpenAddMemberModal}
                  className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-black uppercase tracking-wider shadow-lg shadow-amber-500/30 flex items-center gap-2 transition"
                >
                  <Plus className="w-4 h-4 stroke-[3]" />
                  <span>+ Inscrire un membre</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('member')}
                  className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold flex items-center gap-2 transition"
                >
                  <ExternalLink className="w-4 h-4 text-amber-500" />
                  <span>Voir l'espace public</span>
                </button>
              </div>
            </div>

            {/* Quick summary counters */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
              <div className="p-3 rounded-2xl bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/40 text-amber-800 dark:text-amber-300">
                <div className="text-[11px] font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">Total Adhérents</div>
                <div className="text-xl font-black">{members.length}</div>
              </div>
              <div className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/40 text-emerald-800 dark:text-emerald-300">
                <div className="text-[11px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">Statut Actif</div>
                <div className="text-xl font-black">{members.filter(m => m.status === 'Actif').length}</div>
              </div>
              <div className="p-3 rounded-2xl bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900/40 text-blue-800 dark:text-blue-300">
                <div className="text-[11px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">Gold VIP & Socios</div>
                <div className="text-xl font-black">{members.filter(m => m.tier === 'Gold VIP' || m.tier === 'Socio' || m.tier === 'Membre d’Honneur').length}</div>
              </div>
              <div className="p-3 rounded-2xl bg-purple-50 dark:bg-purple-950/20 border border-purple-200 dark:border-purple-900/40 text-purple-800 dark:text-purple-300">
                <div className="text-[11px] font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400">Supporters</div>
                <div className="text-xl font-black">{members.filter(m => m.tier === 'Supporter' || m.tier === 'Adhérent').length}</div>
              </div>
            </div>

            {/* Filter and Search Bar */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2">
              <div className="relative flex-1">
                <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={adminMemberSearch}
                  onChange={e => setAdminMemberSearch(e.target.value)}
                  placeholder="Rechercher par nom, ville, n° d'adhérent..."
                  className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 border-none text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-amber-500 outline-none"
                />
              </div>

              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-slate-400" />
                <select
                  value={adminMemberTierFilter}
                  onChange={e => setAdminMemberTierFilter(e.target.value)}
                  className="px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300 border-none outline-none focus:ring-2 focus:ring-amber-500"
                >
                  <option value="all">Toutes formules ({members.length})</option>
                  <option value="Supporter">Supporter</option>
                  <option value="Adhérent">Adhérent</option>
                  <option value="Gold VIP">Gold VIP</option>
                  <option value="Membre d’Honneur">Membre d’Honneur</option>
                  <option value="Socio">Socio</option>
                </select>
              </div>
            </div>
          </div>

          {/* Members Grid with Profile Edit & Delete */}
          {members
            .filter(m => {
              const matchesSearch =
                m.fullName.toLowerCase().includes(adminMemberSearch.toLowerCase()) ||
                m.membershipNumber.toLowerCase().includes(adminMemberSearch.toLowerCase()) ||
                m.city.toLowerCase().includes(adminMemberSearch.toLowerCase());
              const matchesTier = adminMemberTierFilter === 'all' || m.tier === adminMemberTierFilter;
              return matchesSearch && matchesTier;
            }).length === 0 ? (
            <div className="text-center py-12 p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <Users className="w-12 h-12 text-slate-400 mx-auto mb-2 opacity-50" />
              <p className="text-sm font-bold text-slate-600 dark:text-slate-300">Aucun membre ne correspond à votre recherche</p>
              <button
                onClick={() => {
                  setAdminMemberSearch('');
                  setAdminMemberTierFilter('all');
                }}
                className="mt-3 px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-bold text-amber-500"
              >
                Réinitialiser les filtres
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {members
                .filter(m => {
                  const matchesSearch =
                    m.fullName.toLowerCase().includes(adminMemberSearch.toLowerCase()) ||
                    m.membershipNumber.toLowerCase().includes(adminMemberSearch.toLowerCase()) ||
                    m.city.toLowerCase().includes(adminMemberSearch.toLowerCase());
                  const matchesTier = adminMemberTierFilter === 'all' || m.tier === adminMemberTierFilter;
                  return matchesSearch && matchesTier;
                })
                .map(m => {
                  const isDeleting = adminMemberDeleteConfirmId === m.id;
                  return (
                    <div
                      key={m.id}
                      className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm hover:shadow-md transition flex flex-col justify-between"
                    >
                      <div>
                        {/* Member Header */}
                        <div className="flex items-start justify-between gap-3 mb-3">
                          <div className="flex items-center gap-3">
                            <div
                              onClick={() => handleOpenEditMemberModal(m)}
                              className="relative w-12 h-12 rounded-2xl overflow-hidden border-2 border-amber-500/40 shadow bg-slate-800 flex-shrink-0 cursor-pointer group/avatar"
                              title="Cliquer pour modifier la photo / profil"
                            >
                              <img
                                src={m.avatarUrl || memberPresetAvatars[0].url}
                                alt={m.fullName}
                                className="w-full h-full object-cover group-hover/avatar:scale-105 transition-transform"
                              />
                              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover/avatar:opacity-100 transition-opacity flex items-center justify-center text-white">
                                <Edit className="w-3.5 h-3.5 text-amber-400" />
                              </div>
                            </div>

                            <div>
                              <h3 className="text-sm font-black text-slate-900 dark:text-white">
                                {m.fullName}
                              </h3>
                              <div className="flex items-center gap-1.5 mt-0.5">
                                <span className="font-mono text-[11px] font-bold text-slate-500 dark:text-slate-400">
                                  {m.membershipNumber}
                                </span>
                                <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                <span className="text-[10px] px-1.5 py-0.2 rounded-full font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                                  {m.status}
                                </span>
                              </div>
                            </div>
                          </div>

                          <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 flex-shrink-0">
                            {m.tier}
                          </span>
                        </div>

                        {/* Member Meta */}
                        <div className="space-y-1.5 text-xs text-slate-600 dark:text-slate-300 my-3 bg-slate-50 dark:bg-slate-850 p-3 rounded-2xl">
                          <div className="flex items-center gap-2">
                            <MapPin className="w-3.5 h-3.5 text-amber-500 flex-shrink-0" />
                            <span className="font-medium truncate">{m.city}</span>
                          </div>
                          {m.phone && (
                            <div className="flex items-center gap-2 font-mono">
                              <Phone className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
                              <span>{m.phone}</span>
                            </div>
                          )}
                          {m.email && (
                            <div className="flex items-center gap-2">
                              <Mail className="w-3.5 h-3.5 text-blue-500 flex-shrink-0" />
                              <span className="truncate">{m.email}</span>
                            </div>
                          )}
                          <div className="flex items-center gap-2 text-[11px] text-slate-400 pt-1 border-t border-slate-200/50 dark:border-slate-800">
                            <Calendar className="w-3 h-3 text-slate-400" />
                            <span>Inscrit le : {m.joinedDate}</span>
                          </div>
                        </div>

                        {m.notes && (
                          <p className="text-xs text-slate-500 dark:text-slate-400 italic line-clamp-2 px-1 mb-2">
                            « {m.notes} »
                          </p>
                        )}
                      </div>

                      {/* Admin Actions Footer */}
                      <div className="pt-3 mt-3 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => handleOpenEditMemberModal(m)}
                          className="flex-1 py-2 px-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow transition"
                        >
                          <Edit className="w-3.5 h-3.5" />
                          <span>Modifier le profil</span>
                        </button>

                        {isDeleting ? (
                          <div className="flex items-center gap-1 bg-red-950/80 p-1 rounded-xl border border-red-500">
                            <button
                              type="button"
                              onClick={() => {
                                deleteMember(m.id);
                                setAdminMemberDeleteConfirmId(null);
                              }}
                              className="px-2 py-1 rounded-lg bg-red-600 hover:bg-red-500 text-white text-[11px] font-bold"
                            >
                              Confirmer
                            </button>
                            <button
                              type="button"
                              onClick={() => setAdminMemberDeleteConfirmId(null)}
                              className="p-1 rounded-lg bg-slate-800 text-slate-300 text-xs"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={() => setAdminMemberDeleteConfirmId(m.id)}
                            className="p-2 rounded-xl bg-red-500/10 hover:bg-red-600 hover:text-white text-red-600 dark:text-red-400 text-xs font-bold transition border border-red-500/20"
                            title="Supprimer ce membre"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
            </div>
          )}
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB: GESTION DU STAFF TECHNIQUE, DIRECTION & PRÉSIDENCE   */}
      {/* ========================================================= */}
      {activeAdminTab === 'staff' && (
        <div className="space-y-6">
          {/* Header Action Bar */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-emerald-500" />
                  <span>Direction, Staff Technique & Présidence ({staff.length})</span>
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  L'administrateur peut modifier la photo officielle du Président / de la Présidente et de chaque membre du staff avec les mêmes options que les joueurs (photo, rôle, diplômes, coordonnées, biographie, statut).
                </p>
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                <button
                  type="button"
                  onClick={handleOpenEditPresidentModal}
                  className="px-4 py-2.5 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-black transition flex items-center gap-2 shadow-md shadow-amber-500/20"
                >
                  <Crown className="w-4 h-4" />
                  <span>Modifier la Présidence</span>
                </button>
                <button
                  type="button"
                  onClick={handleOpenAddStaffModal}
                  className="px-4 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black transition flex items-center gap-2 shadow-md shadow-emerald-600/20"
                >
                  <Plus className="w-4 h-4" />
                  <span>Ajouter au Staff</span>
                </button>
              </div>
            </div>

            {/* Presidential Official Card Highlight */}
            <div className="p-6 rounded-3xl bg-gradient-to-br from-slate-950 via-slate-900 to-amber-950/40 text-white border border-amber-500/40 shadow-xl relative overflow-hidden flex flex-col md:flex-row items-center gap-6">
              <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

              <div
                onClick={handleOpenEditPresidentModal}
                className="relative w-28 h-28 sm:w-36 sm:h-36 rounded-3xl overflow-hidden border-2 border-amber-400 shadow-2xl flex-shrink-0 cursor-pointer group bg-slate-800"
                title="Cliquer pour changer la photo officielle du Président / de la Présidente"
              >
                <img
                  src={
                    clubInfo.presidentPhotoUrl ||
                    presidentPresetPortraits[0].url
                  }
                  alt={clubInfo.president || 'Présidence'}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-1 text-[11px] font-bold text-white p-2 text-center backdrop-blur-xs">
                  <Camera className="w-5 h-5 text-amber-400" />
                  <span>Changer la Photo</span>
                </div>
                <span className="absolute bottom-1 inset-x-1 text-center px-1.5 py-0.5 rounded-md bg-amber-500 text-slate-950 text-[9px] font-black uppercase tracking-wider shadow">
                  {clubInfo.presidentTitle || 'Président'} Officiel
                </span>
              </div>

              <div className="space-y-2 flex-1 text-center md:text-left">
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
                  <span className="px-3 py-1 rounded-full bg-amber-500 text-slate-950 text-xs font-black uppercase tracking-wider flex items-center gap-1.5 shadow">
                    <Crown className="w-3.5 h-3.5" />
                    {clubInfo.presidentTitle || 'Président'} de l'{clubInfo.name}
                  </span>
                  <span className="text-xs text-amber-300 font-semibold">Direction Générale & Représentation</span>
                </div>

                <h3 className="text-2xl font-black text-white font-serif">
                  {clubInfo.president || 'El Hadji Ousseynou Fall'}
                </h3>

                <p className="text-xs text-slate-300 italic bg-white/5 p-3 rounded-2xl border border-white/10 max-w-2xl leading-relaxed">
                  « {clubInfo.presidentWord || "Le football unit nos cœurs ❤️ • Ensemble pour la jeunesse et la victoire !"} »
                </p>

                <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-xs text-slate-300 pt-1">
                  <span className="flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-amber-400" />
                    <span>{adminPresPhone}</span>
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-amber-400" />
                    <span>{adminPresEmail}</span>
                  </span>
                </div>
              </div>

              <div className="flex-shrink-0">
                <button
                  type="button"
                  onClick={handleOpenEditPresidentModal}
                  className="px-4 py-2.5 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-black transition flex items-center gap-2 shadow"
                >
                  <Edit className="w-4 h-4" />
                  <span>Changer Photo & Profil</span>
                </button>
              </div>
            </div>

            {/* Summary Statistics of Staff */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Total Effectif Staff</span>
                <span className="text-xl font-black text-slate-900 dark:text-white font-mono">{staff.length}</span>
              </div>
              <div className="p-3.5 rounded-2xl bg-red-500/10 border border-red-500/20">
                <span className="text-[10px] font-bold text-red-500 uppercase tracking-wider block">Pôle Technique</span>
                <span className="text-xl font-black text-red-600 dark:text-red-400 font-mono">
                  {staff.filter(s => s.category === 'technical').length}
                </span>
              </div>
              <div className="p-3.5 rounded-2xl bg-blue-500/10 border border-blue-500/20">
                <span className="text-[10px] font-bold text-blue-500 uppercase tracking-wider block">Administration</span>
                <span className="text-xl font-black text-blue-600 dark:text-blue-400 font-mono">
                  {staff.filter(s => s.category === 'administration').length}
                </span>
              </div>
              <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20">
                <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-wider block">Pôle Médical</span>
                <span className="text-xl font-black text-emerald-600 dark:text-emerald-400 font-mono">
                  {staff.filter(s => s.category === 'medical').length}
                </span>
              </div>
            </div>

            {/* Filter & Search Bar */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
              <div className="relative flex-1">
                <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={adminStaffSearch}
                  onChange={e => setAdminStaffSearch(e.target.value)}
                  placeholder="Rechercher par nom, titre, rôle, diplôme ou contact..."
                  className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white placeholder-slate-400 outline-none"
                />
              </div>

              <select
                value={adminStaffCategoryFilter}
                onChange={e => setAdminStaffCategoryFilter(e.target.value)}
                className="px-4 py-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white font-bold outline-none"
              >
                <option value="all">Tous les pôles du Staff ({staff.length})</option>
                <option value="technical">Pôle Technique & Coachs</option>
                <option value="administration">Direction & Administration</option>
                <option value="medical">Pôle Médical & Soins</option>
                <option value="president">Présidence</option>
              </select>
            </div>
          </div>

          {/* Grid of Staff Members */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {staff
              .filter(s => {
                if (adminStaffCategoryFilter !== 'all' && s.category !== adminStaffCategoryFilter) {
                  return false;
                }
                const query = adminStaffSearch.toLowerCase().trim();
                if (!query) return true;
                return (
                  s.name.toLowerCase().includes(query) ||
                  s.title.toLowerCase().includes(query) ||
                  s.role.toLowerCase().includes(query) ||
                  (s.diploma && s.diploma.toLowerCase().includes(query)) ||
                  (s.phone && s.phone.includes(query)) ||
                  (s.email && s.email.toLowerCase().includes(query))
                );
              })
              .map(member => {
                const isDeleting = adminStaffDeleteConfirmId === member.id;
                return (
                  <div
                    key={member.id}
                    className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
                  >
                    <div>
                      {/* Photo & Identity Header */}
                      <div className="flex items-start gap-4 mb-3">
                        <div
                          onClick={() => handleOpenEditStaffModal(member)}
                          className="relative w-16 h-16 rounded-2xl overflow-hidden border-2 border-slate-200 dark:border-slate-700 shadow-md flex-shrink-0 cursor-pointer group/photo bg-slate-800"
                          title="Cliquer pour changer la photo officielle de ce membre"
                        >
                          <img
                            src={member.photoUrl}
                            alt={member.name}
                            className="w-full h-full object-cover group-hover/photo:scale-110 transition-transform"
                          />
                          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover/photo:opacity-100 transition-opacity flex items-center justify-center text-white backdrop-blur-xs">
                            <Camera className="w-5 h-5 text-amber-400" />
                          </div>
                        </div>

                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-1.5 flex-wrap mb-1">
                            <span
                              className={`px-2 py-0.5 rounded-md text-[10px] uppercase tracking-wider font-bold ${
                                member.category === 'president'
                                  ? 'bg-amber-500 text-slate-950'
                                  : member.category === 'technical'
                                  ? 'bg-red-600 text-white'
                                  : member.category === 'medical'
                                  ? 'bg-emerald-600 text-white'
                                  : 'bg-blue-600 text-white'
                              }`}
                            >
                              {member.category === 'president'
                                ? 'Présidence'
                                : member.category === 'technical'
                                ? 'Technique'
                                : member.category === 'medical'
                                ? 'Médical'
                                : 'Administration'}
                            </span>
                            {member.status && (
                              <span className="px-1.5 py-0.2 rounded text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-semibold">
                                {member.status}
                              </span>
                            )}
                          </div>

                          <h4 className="text-sm font-black text-slate-900 dark:text-white truncate">
                            {member.name}
                          </h4>
                          <p className="text-xs font-bold text-red-600 dark:text-red-400 truncate">
                            {member.title}
                          </p>
                        </div>
                      </div>

                      {/* Role & Diploma */}
                      <div className="space-y-1 my-2">
                        <p className="text-xs text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/40 p-2.5 rounded-xl line-clamp-2">
                          {member.bio || member.role}
                        </p>
                        {member.diploma && (
                          <div className="flex items-center gap-1 text-[11px] text-amber-600 dark:text-amber-400 font-semibold">
                            <Award className="w-3.5 h-3.5 text-amber-500" />
                            <span>{member.diploma}</span>
                          </div>
                        )}
                      </div>

                      {/* Contacts */}
                      <div className="space-y-1 text-xs text-slate-500 dark:text-slate-400 pt-1">
                        {member.phone && (
                          <div className="flex items-center gap-1.5 font-mono">
                            <Phone className="w-3 h-3 text-emerald-500" />
                            <span>{member.phone}</span>
                          </div>
                        )}
                        {member.email && (
                          <div className="flex items-center gap-1.5 truncate">
                            <Mail className="w-3 h-3 text-blue-500" />
                            <span className="truncate">{member.email}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="pt-3 mt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
                      <button
                        type="button"
                        onClick={() => handleOpenEditStaffModal(member)}
                        className="flex-1 py-1.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-750 text-slate-700 dark:text-slate-300 text-xs font-bold flex items-center justify-center gap-1.5 transition"
                      >
                        <Edit className="w-3.5 h-3.5 text-blue-500" />
                        <span>Modifier Profil & Photo</span>
                      </button>

                      {isDeleting ? (
                        <div className="flex items-center gap-1 bg-red-950/80 p-1 rounded-xl border border-red-500">
                          <button
                            type="button"
                            onClick={() => {
                              deleteStaffMember(member.id);
                              setAdminStaffDeleteConfirmId(null);
                            }}
                            className="px-2 py-1 rounded-lg bg-red-600 hover:bg-red-500 text-white text-[11px] font-bold"
                          >
                            Confirmer ?
                          </button>
                          <button
                            type="button"
                            onClick={() => setAdminStaffDeleteConfirmId(null)}
                            className="p-1 rounded-lg bg-slate-800 text-slate-300 text-xs"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => setAdminStaffDeleteConfirmId(member.id)}
                          className="p-2 rounded-xl bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 text-xs font-bold transition"
                          title="Supprimer ce membre du staff"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 2: IDENTITÉ DU CLUB, NOM ET LOGO                      */}
      {/* ========================================================= */}
      {activeAdminTab === 'club' && (
        <form onSubmit={handleSaveClubInfo} className="space-y-6">
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
            <div>
              <h2 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
                <ImageIcon className="w-5 h-5 text-red-500" />
                <span>Logo Officiel & Identité de l'Équipe</span>
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                L'administrateur peut modifier le nom de l'équipe, changer le logo (téléversement de fichier ou URL), le slogan, le terrain officiel et les informations du coach.
              </p>
            </div>

            {/* Logo Preview and Upload Section */}
            <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-4">
              <label className="text-xs font-bold text-slate-900 dark:text-white block">
                Logo / Blason Officiel de l'Équipe :
              </label>

              <div className="flex flex-col sm:flex-row items-center gap-6">
                {/* Logo Preview */}
                <div className="w-24 h-24 rounded-3xl bg-white dark:bg-slate-900 border-2 border-red-500 p-2 shadow-xl flex items-center justify-center flex-shrink-0">
                  <img
                    src={clubLogoUrl || '/icon.svg'}
                    alt="Logo Aperçu"
                    className="w-full h-full object-contain"
                  />
                </div>

                <div className="space-y-2 flex-1 w-full">
                  <div className="flex items-center gap-2 flex-wrap">
                    <button
                      type="button"
                      onClick={() => logoFileInputRef.current?.click()}
                      className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-black transition flex items-center gap-2 shadow"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      <span>Téléverser une image (PNG, SVG, JPG)</span>
                    </button>
                    <input
                      ref={logoFileInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={e => handleFileUpload(e, setClubLogoUrl)}
                    />
                    <button
                      type="button"
                      onClick={() => setClubLogoUrl('/icon.svg')}
                      className="px-3 py-2 rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold hover:bg-slate-300 transition"
                    >
                      Rétablir Blason Dialloré
                    </button>
                  </div>

                  <div className="space-y-1">
                    <span className="text-[11px] text-slate-400">Ou saisir une URL d'image personnalisée :</span>
                    <input
                      type="text"
                      value={clubLogoUrl}
                      onChange={e => setClubLogoUrl(e.target.value)}
                      placeholder="https://.../mon-logo.png ou /icon.svg"
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white outline-none focus:border-red-500 font-mono"
                    />
                  </div>
                </div>
              </div>

              {/* Quick Presets */}
              <div className="pt-2 border-t border-slate-200 dark:border-slate-800">
                <span className="text-[11px] font-bold text-slate-400 block mb-2">Logos prédéfinis :</span>
                <div className="flex items-center gap-2 flex-wrap">
                  {presetLogos.map(preset => (
                    <button
                      key={preset.label}
                      type="button"
                      onClick={() => setClubLogoUrl(preset.url)}
                      className="px-2.5 py-1 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-[11px] font-medium text-slate-700 dark:text-slate-300 hover:border-red-500 transition flex items-center gap-1.5"
                    >
                      <img src={preset.url} alt="" className="w-3.5 h-3.5 object-contain" />
                      <span>{preset.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Club Name & Slogan */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Nom Officiel du Club / de l'Équipe
                </label>
                <input
                  type="text"
                  value={clubName}
                  onChange={e => setClubName(e.target.value)}
                  placeholder="ex: ASC Dialloré"
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white outline-none focus:border-red-500 font-bold"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Nom Court / Initiales
                </label>
                <input
                  type="text"
                  value={clubShortName}
                  onChange={e => setClubShortName(e.target.value)}
                  placeholder="ex: ASCD"
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white outline-none focus:border-red-500"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Slogan Officiel & Devises
              </label>
              <input
                type="text"
                value={clubSlogan}
                onChange={e => setClubSlogan(e.target.value)}
                placeholder="ex: Du talent à la victoire • Le Football unit les cœurs ❤️ • Ensemble pour la jeunesse !"
                className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white outline-none focus:border-red-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Terrain & Stade Officiel
                </label>
                <input
                  type="text"
                  value={clubStadium}
                  onChange={e => setClubStadium(e.target.value)}
                  placeholder="ex: TERIANN ÉCOLE NDIAGALAK"
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white outline-none focus:border-red-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Ville / Localité
                </label>
                <input
                  type="text"
                  value={clubCity}
                  onChange={e => setClubCity(e.target.value)}
                  placeholder="ex: Mbacké & Touba"
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white outline-none focus:border-red-500"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Statut Actuel / Bannière du Championnat
              </label>
              <input
                type="text"
                value={clubCurrentStatus}
                onChange={e => setClubCurrentStatus(e.target.value)}
                placeholder="ex: CHAMPIONNAT ONGAM/CADETS 2026 : Victoire par Forfait (3 - 0) face à l’ASC ESCALE DE MBACKÉ !"
                className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white outline-none focus:border-red-500"
              />
            </div>

            {/* Coach Section */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-3">
              <span className="text-xs font-bold text-red-600 dark:text-red-400 uppercase tracking-wider block">
                Encadrement Technique & Coach :
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] text-slate-500 block mb-1">Nom du Coach</label>
                  <input
                    type="text"
                    value={clubCoach}
                    onChange={e => setClubCoach(e.target.value)}
                    placeholder="Coach Gagne"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white outline-none focus:border-red-500"
                  />
                </div>
                <div>
                  <label className="text-[11px] text-slate-500 block mb-1">Rôle du Coach</label>
                  <input
                    type="text"
                    value={clubCoachRole}
                    onChange={e => setClubCoachRole(e.target.value)}
                    placeholder="Entraîneur Principal / Coach en Chef"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white outline-none focus:border-red-500"
                  />
                </div>
              </div>
              <div>
                <label className="text-[11px] text-slate-500 block mb-1">Biographie & Philosophie du Coach</label>
                <textarea
                  rows={2}
                  value={clubCoachBio}
                  onChange={e => setClubCoachBio(e.target.value)}
                  className="w-full p-2.5 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white outline-none focus:border-red-500"
                />
              </div>
            </div>

            {/* Section Présidence Officielle & Photo */}
            <div className="p-5 rounded-2xl bg-amber-500/5 dark:bg-slate-950 border border-amber-500/30 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-amber-500 uppercase tracking-wider flex items-center gap-1.5">
                  <Crown className="w-4 h-4" />
                  <span>Présidence Officielle du Club (Président ou Présidente)</span>
                </span>
                <button
                  type="button"
                  onClick={handleOpenEditPresidentModal}
                  className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold transition flex items-center gap-1.5"
                >
                  <Edit className="w-3.5 h-3.5" />
                  <span>Changer la Photo Officielle</span>
                </button>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-5">
                <div
                  onClick={handleOpenEditPresidentModal}
                  className="w-20 h-20 rounded-2xl overflow-hidden border-2 border-amber-400 shadow-md flex-shrink-0 cursor-pointer group bg-slate-800 relative"
                  title="Cliquer pour changer la photo officielle"
                >
                  <img
                    src={adminPresPhotoUrl || presidentPresetPortraits[0].url}
                    alt="Présidence"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white backdrop-blur-xs">
                    <Camera className="w-4 h-4 text-amber-400" />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 flex-1 w-full">
                  <div>
                    <label className="text-[11px] text-slate-500 block mb-1">Titre Officiel</label>
                    <select
                      value={adminPresTitle}
                      onChange={e => setAdminPresTitle(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white outline-none font-bold"
                    >
                      <option value="Président">Président</option>
                      <option value="Présidente">Présidente</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[11px] text-slate-500 block mb-1">Nom Complet</label>
                    <input
                      type="text"
                      value={adminPresName}
                      onChange={e => setAdminPresName(e.target.value)}
                      placeholder="Ex: El Hadji Ousseynou Fall"
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white outline-none font-bold"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Backgrounds Gateway Card */}
            <div className="p-5 rounded-2xl bg-gradient-to-r from-red-950/40 via-slate-900/60 to-amber-950/40 border border-red-500/30 space-y-3">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-red-600/30 border border-red-500/40 text-red-400 flex items-center justify-center flex-shrink-0">
                    <Sliders className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-xs sm:text-sm font-black text-white">
                      Arrières-plans de Toutes les Parties du Site (14 parties configurables)
                    </h3>
                    <p className="text-[11px] text-slate-400">
                      Vous pouvez changer l'arrière-plan de chaque partie individuellement, ou appliquer un même visuel à l'ensemble du site en 1 clic.
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setActiveAdminTab('backgrounds')}
                  className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-black shadow transition flex items-center gap-1.5 whitespace-nowrap flex-shrink-0"
                >
                  <Sliders className="w-3.5 h-3.5" />
                  <span>Gérer les 14 arrières-plans →</span>
                </button>
              </div>
            </div>

            {/* Submit Bar */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={() => {
                  if (window.confirm("Rétablir les informations par défaut du club ?")) {
                    resetClubInfo();
                    setClubName(clubInfo.name);
                    setClubLogoUrl('/icon.svg');
                  }
                }}
                className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 text-xs font-bold transition"
              >
                Rétablir Valeurs Initiales
              </button>

              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-black shadow-lg shadow-red-600/30 transition flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                <span>Enregistrer les Modifications du Club</span>
              </button>
            </div>
          </div>
        </form>
      )}

      {/* ========================================================= */}
      {/* TAB: GESTION DES ARRIÈRES-PLANS DE TOUTES LES PARTIES DU SITE */}
      {/* ========================================================= */}
      {activeAdminTab === 'backgrounds' && (
        <div className="space-y-6">
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
                  <Sliders className="w-5 h-5 text-red-500" />
                  <span>Personnalisation des Arrières-plans de Toutes les Parties (12 parties)</span>
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-2xl leading-relaxed">
                  L'administrateur peut modifier l'arrière-plan de <strong>TOUTES les parties qui existent</strong> en un seul clic ou personnaliser chaque partie individuellement (Accueil, Matchs, Effectif, Membre, Actualités, Header, Footer, Modales...).
                </p>
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                <button
                  type="button"
                  onClick={handleSaveAllBackgrounds}
                  className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-black shadow-lg shadow-red-600/30 transition flex items-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  <span>Enregistrer Tout (12 parties)</span>
                </button>
              </div>
            </div>

            {/* ========================================================= */}
            {/* MASTER CHANGER: APPLIQUER À TOUTES LES PARTIES EN 1 CLIC */}
            {/* ========================================================= */}
            <div className="p-5 sm:p-6 rounded-3xl bg-gradient-to-r from-red-950 via-slate-900 to-amber-950 border-2 border-red-500/40 text-white shadow-xl space-y-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-red-600 flex items-center justify-center text-white shadow-lg flex-shrink-0">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm sm:text-base font-black tracking-tight">
                      ⚡ Appliquer un Arrière-plan Identique à TOUTES les Parties du Site en 1 Clic
                    </h3>
                    <p className="text-xs text-slate-300">
                      Vous n'êtes pas limité à une seule partie : diffusez la même image de fond sur l'intégralité du site (12 parties simultanées) ou ajustez chacune en détail.
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center pt-1">
                <div className="md:col-span-8 flex items-center gap-2">
                  <input
                    type="text"
                    value={masterBgUrl}
                    onChange={e => setMasterBgUrl(e.target.value)}
                    placeholder="Saisir une URL d'image (ex: /diallore-team-banner.jpg ou https://...)"
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-red-500/30 bg-slate-900/90 text-white outline-none focus:border-red-400 font-mono shadow-inner"
                  />
                  <label className="px-3.5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer whitespace-nowrap border border-slate-700">
                    <Upload className="w-4 h-4 text-red-400" />
                    <span className="hidden sm:inline">Téléverser</span>
                    <input
                      ref={masterBgInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={e => handleFileUpload(e, url => {
                        setMasterBgUrl(url);
                        handleApplyMasterBg(url);
                      })}
                    />
                  </label>
                </div>

                <div className="md:col-span-4 flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleApplyMasterBg(masterBgUrl)}
                    className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-500 hover:to-amber-500 text-white text-xs font-black shadow-lg shadow-red-600/30 transition flex items-center justify-center gap-2 active:scale-95"
                  >
                    <Check className="w-4 h-4" />
                    <span>Appliquer aux 12 parties</span>
                  </button>
                </div>
              </div>

              {/* Quick Preset Buttons for Master Changer */}
              <div className="pt-2 border-t border-red-900/40 flex items-center gap-2 flex-wrap">
                <span className="text-[11px] text-amber-300 font-bold">Suggestions rapides :</span>
                {[
                  { label: "Photo Officielle Équipe (Touba-Mbacké)", url: "/diallore-team-banner.jpg" },
                  { label: "Stade & Match Nocturne", url: "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=1600&q=80" },
                  { label: "Pelouse & Compétition", url: "https://images.unsplash.com/photo-1522778119026-d647f0596c20?auto=format&fit=crop&w=1600&q=80" },
                  { label: "Ambiance Supporters", url: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=1600&q=80" },
                ].map(pre => (
                  <button
                    key={pre.label}
                    type="button"
                    onClick={() => {
                      setMasterBgUrl(pre.url);
                      handleApplyMasterBg(pre.url);
                    }}
                    className="text-[10px] px-2.5 py-1 rounded-lg bg-slate-900/80 hover:bg-red-900/40 border border-red-500/20 text-slate-200 hover:text-white transition flex items-center gap-1.5"
                  >
                    <span>{pre.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Quick Section Filter Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-2 pt-1 border-b border-slate-200 dark:border-slate-800">
              {[
                { id: 'all', label: 'Toutes les parties (12)' },
                { id: 'homeHero', label: '1. Accueil (Institut)' },
                { id: 'homeNextMatch', label: '2. Grand Rendez-vous' },
                { id: 'homeOngamEvent', label: '3. Victoire Forfait ONGAM' },
                { id: 'headerBg', label: '4. En-tête Navigation (Header)' },
                { id: 'matchesBanner', label: '5. Matchs & Calendrier' },
                { id: 'teamBanner', label: '6. Effectif des Joueurs' },
                { id: 'memberBanner', label: '7. Espace Membre' },
                { id: 'newsBanner', label: '8. Actualités' },
                { id: 'footerBg', label: '9. Bas de page (Footer)' },
                { id: 'modalMatchBg', label: '10. Modale Détails Match' },
                { id: 'modalPlayerBg', label: '11. Modale Fiche Joueur' },
                { id: 'appGlobalBg', label: '12. Fond Global du Site' },
              ].map(sec => (
                <button
                  key={sec.id}
                  type="button"
                  onClick={() => setSelectedBgSection(sec.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition ${
                    selectedBgSection === sec.id
                      ? 'bg-red-600 text-white shadow'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
                >
                  {sec.label}
                </button>
              ))}
            </div>

            {/* Grille de configuration de toutes les parties */}
            <div className="space-y-6">

              {/* 1. Accueil : Institut de Formation */}
              {(selectedBgSection === 'all' || selectedBgSection === 'homeHero') && (
                <div className="p-5 rounded-3xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-4">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <div>
                      <span className="text-xs font-black text-red-600 dark:text-red-400 uppercase tracking-wider block">
                        Partie 1 : Bannière d'Accueil « Institut de Formation & Football »
                      </span>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                        Grand bandeau institutionnel visible en haut de la page d'accueil.
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleApplyMasterBg(bgHomeHero)}
                        className="px-2.5 py-1 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 text-[11px] font-bold hover:bg-amber-500/20 transition"
                        title="Appliquer cette image à toutes les autres parties"
                      >
                        Diffuser aux 14 parties
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setBgHomeHero('/diallore-team-banner.jpg');
                          updateClubInfo({
                            bannerBackgroundUrl: '/diallore-team-banner.jpg',
                            backgroundUrls: { ...(clubInfo.backgroundUrls || {}), homeHero: '/diallore-team-banner.jpg' },
                          });
                          showToast('Restauré', 'Photo officielle originale rétablie.', 'info');
                        }}
                        className="px-3 py-1.5 rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold hover:bg-slate-300 transition flex items-center gap-1.5"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span>Photo originale Touba</span>
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                    <div className="md:col-span-5 h-36 rounded-2xl overflow-hidden bg-slate-900 border border-slate-300 dark:border-slate-700 relative shadow-inner">
                      <img src={bgHomeHero || '/diallore-team-banner.jpg'} alt="" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-gradient-to-r from-slate-950/70 to-transparent pointer-events-none" />
                      <span className="absolute bottom-2 left-3 px-2 py-0.5 rounded bg-red-600 text-white text-[9px] font-black uppercase">
                        Aperçu Accueil
                      </span>
                    </div>

                    <div className="md:col-span-7 space-y-3">
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          value={bgHomeHero}
                          onChange={e => setBgHomeHero(e.target.value)}
                          placeholder="/diallore-team-banner.jpg ou URL https://..."
                          className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white outline-none focus:border-red-500 font-mono"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            updateClubInfo({
                              bannerBackgroundUrl: bgHomeHero.trim(),
                              backgroundUrls: { ...(clubInfo.backgroundUrls || {}), homeHero: bgHomeHero.trim() },
                            });
                            showToast('Appliqué', 'Arrière-plan accueil mis à jour.', 'success');
                          }}
                          className="px-3 py-2 rounded-xl bg-slate-900 dark:bg-slate-800 text-white text-xs font-bold whitespace-nowrap"
                        >
                          Appliquer
                        </button>
                      </div>

                      <div className="flex items-center gap-2 flex-wrap">
                        <label className="px-3 py-1.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow">
                          <Upload className="w-3.5 h-3.5" />
                          <span>Téléverser depuis l'appareil</span>
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={e => handleFileUpload(e, url => {
                              setBgHomeHero(url);
                              updateClubInfo({
                                bannerBackgroundUrl: url,
                                backgroundUrls: { ...(clubInfo.backgroundUrls || {}), homeHero: url },
                              });
                            })}
                          />
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* 2. Accueil : Prochain Grand Rendez-vous */}
              {(selectedBgSection === 'all' || selectedBgSection === 'homeNextMatch') && (
                <div className="p-5 rounded-3xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-4">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <div>
                      <span className="text-xs font-black text-amber-500 uppercase tracking-wider block">
                        Partie 2 : Cadre « Prochain Match au Calendrier » (Accueil)
                      </span>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                        Arrière-plan du bloc de match phare avec compte à rebours et réservation de billet.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleApplyMasterBg(bgHomeNextMatch)}
                      className="px-2.5 py-1 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 text-[11px] font-bold hover:bg-amber-500/20 transition"
                      title="Appliquer cette image à toutes les autres parties"
                    >
                      Diffuser aux 14 parties
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                    <div className="md:col-span-5 h-36 rounded-2xl overflow-hidden bg-slate-900 border border-slate-300 dark:border-slate-700 relative shadow-inner">
                      <img src={bgHomeNextMatch} alt="" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-gradient-to-r from-slate-950/80 to-transparent pointer-events-none" />
                      <span className="absolute bottom-2 left-3 px-2 py-0.5 rounded bg-amber-500 text-slate-950 text-[9px] font-black uppercase">
                        Aperçu Grand Rendez-vous
                      </span>
                    </div>

                    <div className="md:col-span-7 space-y-3">
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          value={bgHomeNextMatch}
                          onChange={e => setBgHomeNextMatch(e.target.value)}
                          placeholder="URL image grand rendez-vous..."
                          className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white outline-none focus:border-red-500 font-mono"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            updateClubInfo({
                              backgroundUrls: { ...(clubInfo.backgroundUrls || {}), homeNextMatch: bgHomeNextMatch.trim() },
                            });
                            showToast('Appliqué', 'Arrière-plan Grand Rendez-vous mis à jour.', 'success');
                          }}
                          className="px-3 py-2 rounded-xl bg-slate-900 dark:bg-slate-800 text-white text-xs font-bold whitespace-nowrap"
                        >
                          Appliquer
                        </button>
                      </div>

                      <div className="flex items-center gap-2 flex-wrap">
                        <label className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-black transition flex items-center gap-1.5 cursor-pointer shadow">
                          <Upload className="w-3.5 h-3.5" />
                          <span>Téléverser depuis l'appareil</span>
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={e => handleFileUpload(e, url => {
                              setBgHomeNextMatch(url);
                              updateClubInfo({
                                backgroundUrls: { ...(clubInfo.backgroundUrls || {}), homeNextMatch: url },
                              });
                            })}
                          />
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* 3. Accueil : Bannière Spéciale Victoire Par Forfait ONGAM */}
              {(selectedBgSection === 'all' || selectedBgSection === 'homeOngamEvent') && (
                <div className="p-5 rounded-3xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-4">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <div>
                      <span className="text-xs font-black text-emerald-500 uppercase tracking-wider block">
                        Partie 3 : Bannière « Victoire par Forfait (3 - 0) face à l’ASC ESCALE »
                      </span>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                        Arrière-plan de la section spéciale commémorant la victoire officielle homologuée 3-0.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleApplyMasterBg(bgHomeOngamEvent)}
                      className="px-2.5 py-1 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[11px] font-bold hover:bg-emerald-500/20 transition"
                      title="Appliquer cette image à toutes les autres parties"
                    >
                      Diffuser aux 14 parties
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                    <div className="md:col-span-5 h-36 rounded-2xl overflow-hidden bg-slate-900 border border-slate-300 dark:border-slate-700 relative shadow-inner">
                      <img src={bgHomeOngamEvent} alt="" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-gradient-to-r from-emerald-950/80 to-transparent pointer-events-none" />
                      <span className="absolute bottom-2 left-3 px-2 py-0.5 rounded bg-emerald-600 text-white text-[9px] font-black uppercase">
                        Aperçu Forfait ONGAM
                      </span>
                    </div>

                    <div className="md:col-span-7 space-y-3">
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          value={bgHomeOngamEvent}
                          onChange={e => setBgHomeOngamEvent(e.target.value)}
                          placeholder="URL image de fond forfait ONGAM..."
                          className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white outline-none focus:border-red-500 font-mono"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            updateClubInfo({
                              backgroundUrls: { ...(clubInfo.backgroundUrls || {}), homeOngamEvent: bgHomeOngamEvent.trim() },
                            });
                            showToast('Appliqué', 'Arrière-plan victoire forfait mis à jour.', 'success');
                          }}
                          className="px-3 py-2 rounded-xl bg-slate-900 dark:bg-slate-800 text-white text-xs font-bold whitespace-nowrap"
                        >
                          Appliquer
                        </button>
                      </div>

                      <div className="flex items-center gap-2 flex-wrap">
                        <label className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow">
                          <Upload className="w-3.5 h-3.5" />
                          <span>Téléverser depuis l'appareil</span>
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={e => handleFileUpload(e, url => {
                              setBgHomeOngamEvent(url);
                              updateClubInfo({
                                backgroundUrls: { ...(clubInfo.backgroundUrls || {}), homeOngamEvent: url },
                              });
                            })}
                          />
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* 4. En-tête Navigation (Header) */}
              {(selectedBgSection === 'all' || selectedBgSection === 'headerBg') && (
                <div className="p-5 rounded-3xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-4">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <div>
                      <span className="text-xs font-black text-cyan-600 dark:text-cyan-400 uppercase tracking-wider block">
                        Partie 4 : En-tête de Navigation (Header supérieur)
                      </span>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                        Fond filigrane visible sous la barre de menu sticky en haut de l'écran.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleApplyMasterBg(bgHeader)}
                      className="px-2.5 py-1 rounded-xl bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 text-[11px] font-bold hover:bg-cyan-500/20 transition"
                      title="Appliquer cette image à toutes les autres parties"
                    >
                      Diffuser aux 14 parties
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                    <div className="md:col-span-5 h-36 rounded-2xl overflow-hidden bg-slate-900 border border-slate-300 dark:border-slate-700 relative shadow-inner">
                      {bgHeader ? (
                        <img src={bgHeader} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-slate-500 text-xs">
                          Translucide par défaut
                        </div>
                      )}
                      <span className="absolute bottom-2 left-3 px-2 py-0.5 rounded bg-cyan-600 text-white text-[9px] font-black uppercase">
                        Aperçu Header
                      </span>
                    </div>

                    <div className="md:col-span-7 space-y-3">
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          value={bgHeader}
                          onChange={e => setBgHeader(e.target.value)}
                          placeholder="URL image de fond du menu header..."
                          className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white outline-none focus:border-red-500 font-mono"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            updateClubInfo({
                              headerBackgroundUrl: bgHeader.trim(),
                              backgroundUrls: { ...(clubInfo.backgroundUrls || {}), headerBg: bgHeader.trim() },
                            });
                            showToast('Appliqué', 'Arrière-plan en-tête header mis à jour.', 'success');
                          }}
                          className="px-3 py-2 rounded-xl bg-slate-900 dark:bg-slate-800 text-white text-xs font-bold whitespace-nowrap"
                        >
                          Appliquer
                        </button>
                      </div>

                      <div className="flex items-center gap-2 flex-wrap">
                        <label className="px-3 py-1.5 rounded-xl bg-cyan-600 hover:bg-cyan-700 text-white text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow">
                          <Upload className="w-3.5 h-3.5" />
                          <span>Téléverser depuis l'appareil</span>
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={e => handleFileUpload(e, url => {
                              setBgHeader(url);
                              updateClubInfo({
                                headerBackgroundUrl: url,
                                backgroundUrls: { ...(clubInfo.backgroundUrls || {}), headerBg: url },
                              });
                            })}
                          />
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* 5. Matchs & Calendrier */}
              {(selectedBgSection === 'all' || selectedBgSection === 'matchesBanner') && (
                <div className="p-5 rounded-3xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-4">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <div>
                      <span className="text-xs font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-wider block">
                        Partie 5 : Onglet « Matchs & Calendrier »
                      </span>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                        Bannière d'en-tête de la page officielle du calendrier des matchs.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleApplyMasterBg(bgMatches)}
                      className="px-2.5 py-1 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[11px] font-bold hover:bg-emerald-500/20 transition"
                      title="Appliquer cette image à toutes les autres parties"
                    >
                      Diffuser aux 14 parties
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                    <div className="md:col-span-5 h-36 rounded-2xl overflow-hidden bg-slate-900 border border-slate-300 dark:border-slate-700 relative shadow-inner">
                      <img src={bgMatches} alt="" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-gradient-to-r from-emerald-950/80 to-transparent pointer-events-none" />
                      <span className="absolute bottom-2 left-3 px-2 py-0.5 rounded bg-emerald-600 text-white text-[9px] font-black uppercase">
                        Aperçu Matchs
                      </span>
                    </div>

                    <div className="md:col-span-7 space-y-3">
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          value={bgMatches}
                          onChange={e => setBgMatches(e.target.value)}
                          placeholder="URL image de fond des matchs..."
                          className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white outline-none focus:border-red-500 font-mono"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            updateClubInfo({
                              backgroundUrls: { ...(clubInfo.backgroundUrls || {}), matchesBanner: bgMatches.trim() },
                            });
                            showToast('Appliqué', 'Arrière-plan Matchs & Calendrier mis à jour.', 'success');
                          }}
                          className="px-3 py-2 rounded-xl bg-slate-900 dark:bg-slate-800 text-white text-xs font-bold whitespace-nowrap"
                        >
                          Appliquer
                        </button>
                      </div>

                      <div className="flex items-center gap-2 flex-wrap">
                        <label className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow">
                          <Upload className="w-3.5 h-3.5" />
                          <span>Téléverser depuis l'appareil</span>
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={e => handleFileUpload(e, url => {
                              setBgMatches(url);
                              updateClubInfo({
                                backgroundUrls: { ...(clubInfo.backgroundUrls || {}), matchesBanner: url },
                              });
                            })}
                          />
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* 6. Effectif & Joueurs */}
              {(selectedBgSection === 'all' || selectedBgSection === 'teamBanner') && (
                <div className="p-5 rounded-3xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-4">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <div>
                      <span className="text-xs font-black text-rose-600 dark:text-rose-400 uppercase tracking-wider block">
                        Partie 6 : Onglet « Équipe & Effectif des Joueurs »
                      </span>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                        Bannière d'en-tête de la liste de l'effectif des joueurs et fiches techniques.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleApplyMasterBg(bgTeam)}
                      className="px-2.5 py-1 rounded-xl bg-rose-500/10 text-rose-600 dark:text-rose-400 text-[11px] font-bold hover:bg-rose-500/20 transition"
                      title="Appliquer cette image à toutes les autres parties"
                    >
                      Diffuser aux 14 parties
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                    <div className="md:col-span-5 h-36 rounded-2xl overflow-hidden bg-slate-900 border border-slate-300 dark:border-slate-700 relative shadow-inner">
                      <img src={bgTeam || '/diallore-team-banner.jpg'} alt="" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-gradient-to-r from-red-950/80 to-transparent pointer-events-none" />
                      <span className="absolute bottom-2 left-3 px-2 py-0.5 rounded bg-red-600 text-white text-[9px] font-black uppercase">
                        Aperçu Effectif
                      </span>
                    </div>

                    <div className="md:col-span-7 space-y-3">
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          value={bgTeam}
                          onChange={e => setBgTeam(e.target.value)}
                          placeholder="URL image de fond de l'effectif..."
                          className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white outline-none focus:border-red-500 font-mono"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            updateClubInfo({
                              backgroundUrls: { ...(clubInfo.backgroundUrls || {}), teamBanner: bgTeam.trim() },
                            });
                            showToast('Appliqué', 'Arrière-plan Effectif & Joueurs mis à jour.', 'success');
                          }}
                          className="px-3 py-2 rounded-xl bg-slate-900 dark:bg-slate-800 text-white text-xs font-bold whitespace-nowrap"
                        >
                          Appliquer
                        </button>
                      </div>

                      <div className="flex items-center gap-2 flex-wrap">
                        <label className="px-3 py-1.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow">
                          <Upload className="w-3.5 h-3.5" />
                          <span>Téléverser depuis l'appareil</span>
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={e => handleFileUpload(e, url => {
                              setBgTeam(url);
                              updateClubInfo({
                                backgroundUrls: { ...(clubInfo.backgroundUrls || {}), teamBanner: url },
                              });
                            })}
                          />
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* 7. Espace Membre */}
              {(selectedBgSection === 'all' || selectedBgSection === 'memberBanner') && (
                <div className="p-5 rounded-3xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-4">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <div>
                      <span className="text-xs font-black text-indigo-500 uppercase tracking-wider block">
                        Partie 7 : Onglet « Espace Membre & Abonnés »
                      </span>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                        Bannière d'en-tête de l'annuaire des membres et de l'espace adhérents.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleApplyMasterBg(bgMember)}
                      className="px-2.5 py-1 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-[11px] font-bold hover:bg-indigo-500/20 transition"
                      title="Appliquer cette image à toutes les autres parties"
                    >
                      Diffuser aux 12 parties
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                    <div className="md:col-span-5 h-36 rounded-2xl overflow-hidden bg-slate-900 border border-slate-300 dark:border-slate-700 relative shadow-inner">
                      <img src={bgMember} alt="" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-gradient-to-r from-indigo-950/80 to-transparent pointer-events-none" />
                      <span className="absolute bottom-2 left-3 px-2 py-0.5 rounded bg-indigo-600 text-white text-[9px] font-black uppercase">
                        Aperçu Membre
                      </span>
                    </div>

                    <div className="md:col-span-7 space-y-3">
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          value={bgMember}
                          onChange={e => setBgMember(e.target.value)}
                          placeholder="URL image de fond de l'espace membre..."
                          className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white outline-none focus:border-red-500 font-mono"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            updateClubInfo({
                              backgroundUrls: { ...(clubInfo.backgroundUrls || {}), memberBanner: bgMember.trim() },
                            });
                            showToast('Appliqué', 'Arrière-plan Espace Membre mis à jour.', 'success');
                          }}
                          className="px-3 py-2 rounded-xl bg-slate-900 dark:bg-slate-800 text-white text-xs font-bold whitespace-nowrap"
                        >
                          Appliquer
                        </button>
                      </div>

                      <div className="flex items-center gap-2 flex-wrap">
                        <label className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow">
                          <Upload className="w-3.5 h-3.5" />
                          <span>Téléverser depuis l'appareil</span>
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={e => handleFileUpload(e, url => {
                              setBgMember(url);
                              updateClubInfo({
                                backgroundUrls: { ...(clubInfo.backgroundUrls || {}), memberBanner: url },
                              });
                            })}
                          />
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* 8. Actualités */}
              {(selectedBgSection === 'all' || selectedBgSection === 'newsBanner') && (
                <div className="p-5 rounded-3xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-4">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <div>
                      <span className="text-xs font-black text-blue-500 uppercase tracking-wider block">
                        Partie 8 : Onglet « Actualités & Flux Direct »
                      </span>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                        Bannière d'en-tête de la revue de presse et des communiqués du club.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleApplyMasterBg(bgNews)}
                      className="px-2.5 py-1 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 text-[11px] font-bold hover:bg-blue-500/20 transition"
                      title="Appliquer cette image à toutes les autres parties"
                    >
                      Diffuser aux 12 parties
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                    <div className="md:col-span-5 h-36 rounded-2xl overflow-hidden bg-slate-900 border border-slate-300 dark:border-slate-700 relative shadow-inner">
                      <img src={bgNews} alt="" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-950/80 to-transparent pointer-events-none" />
                      <span className="absolute bottom-2 left-3 px-2 py-0.5 rounded bg-blue-600 text-white text-[9px] font-black uppercase">
                        Aperçu Actualités
                      </span>
                    </div>

                    <div className="md:col-span-7 space-y-3">
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          value={bgNews}
                          onChange={e => setBgNews(e.target.value)}
                          placeholder="URL image de fond des actualités..."
                          className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white outline-none focus:border-red-500 font-mono"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            updateClubInfo({
                              backgroundUrls: { ...(clubInfo.backgroundUrls || {}), newsBanner: bgNews.trim() },
                            });
                            showToast('Appliqué', 'Arrière-plan Actualités mis à jour.', 'success');
                          }}
                          className="px-3 py-2 rounded-xl bg-slate-900 dark:bg-slate-800 text-white text-xs font-bold whitespace-nowrap"
                        >
                          Appliquer
                        </button>
                      </div>

                      <div className="flex items-center gap-2 flex-wrap">
                        <label className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow">
                          <Upload className="w-3.5 h-3.5" />
                          <span>Téléverser depuis l'appareil</span>
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={e => handleFileUpload(e, url => {
                              setBgNews(url);
                              updateClubInfo({
                                backgroundUrls: { ...(clubInfo.backgroundUrls || {}), newsBanner: url },
                              });
                            })}
                          />
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* 9. Footer / Bas de page */}
              {(selectedBgSection === 'all' || selectedBgSection === 'footerBg') && (
                <div className="p-5 rounded-3xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-4">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <div>
                      <span className="text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
                        Partie 9 : Bas de Page (Footer officiel)
                      </span>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                        Arrière-plan discret affiché en fond du pied de page sur toutes les sections.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleApplyMasterBg(bgFooter)}
                      className="px-2.5 py-1 rounded-xl bg-slate-500/10 text-slate-600 dark:text-slate-400 text-[11px] font-bold hover:bg-slate-500/20 transition"
                      title="Appliquer cette image à toutes les autres parties"
                    >
                      Diffuser aux 12 parties
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                    <div className="md:col-span-5 h-36 rounded-2xl overflow-hidden bg-slate-900 border border-slate-300 dark:border-slate-700 relative shadow-inner">
                      <img src={bgFooter} alt="" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-slate-950/80 pointer-events-none" />
                      <span className="absolute bottom-2 left-3 px-2 py-0.5 rounded bg-slate-700 text-white text-[9px] font-black uppercase">
                        Aperçu Bas de page
                      </span>
                    </div>

                    <div className="md:col-span-7 space-y-3">
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          value={bgFooter}
                          onChange={e => setBgFooter(e.target.value)}
                          placeholder="URL image de fond du pied de page..."
                          className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white outline-none focus:border-red-500 font-mono"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            updateClubInfo({
                              backgroundUrls: { ...(clubInfo.backgroundUrls || {}), footerBg: bgFooter.trim() },
                            });
                            showToast('Appliqué', 'Arrière-plan Bas de page mis à jour.', 'success');
                          }}
                          className="px-3 py-2 rounded-xl bg-slate-900 dark:bg-slate-800 text-white text-xs font-bold whitespace-nowrap"
                        >
                          Appliquer
                        </button>
                      </div>

                      <div className="flex items-center gap-2 flex-wrap">
                        <label className="px-3 py-1.5 rounded-xl bg-slate-700 hover:bg-slate-600 text-white text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow">
                          <Upload className="w-3.5 h-3.5" />
                          <span>Téléverser depuis l'appareil</span>
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={e => handleFileUpload(e, url => {
                              setBgFooter(url);
                              updateClubInfo({
                                backgroundUrls: { ...(clubInfo.backgroundUrls || {}), footerBg: url },
                              });
                            })}
                          />
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* 10. Modale Match & Statistiques Détaillées */}
              {(selectedBgSection === 'all' || selectedBgSection === 'modalMatchBg') && (
                <div className="p-5 rounded-3xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-4">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <div>
                      <span className="text-xs font-black text-rose-500 uppercase tracking-wider block">
                        Partie 10 : Modale « Feuille de Match & Statistiques »
                      </span>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                        Arrière-plan immersif en haut de la fenêtre pop-up des détails d'une rencontre.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleApplyMasterBg(bgModalMatch)}
                      className="px-2.5 py-1 rounded-xl bg-rose-500/10 text-rose-600 dark:text-rose-400 text-[11px] font-bold hover:bg-rose-500/20 transition"
                      title="Appliquer cette image à toutes les autres parties"
                    >
                      Diffuser aux 12 parties
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                    <div className="md:col-span-5 h-36 rounded-2xl overflow-hidden bg-slate-900 border border-slate-300 dark:border-slate-700 relative shadow-inner">
                      <img src={bgModalMatch} alt="" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-slate-950/70 pointer-events-none" />
                      <span className="absolute bottom-2 left-3 px-2 py-0.5 rounded bg-rose-600 text-white text-[9px] font-black uppercase">
                        Aperçu Modale Match
                      </span>
                    </div>

                    <div className="md:col-span-7 space-y-3">
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          value={bgModalMatch}
                          onChange={e => setBgModalMatch(e.target.value)}
                          placeholder="URL image de fond de la modale match..."
                          className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white outline-none focus:border-red-500 font-mono"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            updateClubInfo({
                              backgroundUrls: { ...(clubInfo.backgroundUrls || {}), modalMatchBg: bgModalMatch.trim() },
                            });
                            showToast('Appliqué', 'Arrière-plan modale match mis à jour.', 'success');
                          }}
                          className="px-3 py-2 rounded-xl bg-slate-900 dark:bg-slate-800 text-white text-xs font-bold whitespace-nowrap"
                        >
                          Appliquer
                        </button>
                      </div>

                      <div className="flex items-center gap-2 flex-wrap">
                        <label className="px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow">
                          <Upload className="w-3.5 h-3.5" />
                          <span>Téléverser depuis l'appareil</span>
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={e => handleFileUpload(e, url => {
                              setBgModalMatch(url);
                              updateClubInfo({
                                backgroundUrls: { ...(clubInfo.backgroundUrls || {}), modalMatchBg: url },
                              });
                            })}
                          />
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* 11. Modale Fiche Détaillée Joueur */}
              {(selectedBgSection === 'all' || selectedBgSection === 'modalPlayerBg') && (
                <div className="p-5 rounded-3xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-4">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <div>
                      <span className="text-xs font-black text-amber-600 dark:text-amber-400 uppercase tracking-wider block">
                        Partie 11 : Modale « Fiche Technique du Joueur »
                      </span>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                        Arrière-plan en bandeau haut de la carte de profil d'un joueur.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleApplyMasterBg(bgModalPlayer)}
                      className="px-2.5 py-1 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 text-[11px] font-bold hover:bg-amber-500/20 transition"
                      title="Appliquer cette image à toutes les autres parties"
                    >
                      Diffuser aux 12 parties
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                    <div className="md:col-span-5 h-36 rounded-2xl overflow-hidden bg-slate-900 border border-slate-300 dark:border-slate-700 relative shadow-inner">
                      <img src={bgModalPlayer} alt="" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-slate-950/70 pointer-events-none" />
                      <span className="absolute bottom-2 left-3 px-2 py-0.5 rounded bg-amber-600 text-white text-[9px] font-black uppercase">
                        Aperçu Modale Joueur
                      </span>
                    </div>

                    <div className="md:col-span-7 space-y-3">
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          value={bgModalPlayer}
                          onChange={e => setBgModalPlayer(e.target.value)}
                          placeholder="URL image de fond de la modale joueur..."
                          className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white outline-none focus:border-red-500 font-mono"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            updateClubInfo({
                              backgroundUrls: { ...(clubInfo.backgroundUrls || {}), modalPlayerBg: bgModalPlayer.trim() },
                            });
                            showToast('Appliqué', 'Arrière-plan modale joueur mis à jour.', 'success');
                          }}
                          className="px-3 py-2 rounded-xl bg-slate-900 dark:bg-slate-800 text-white text-xs font-bold whitespace-nowrap"
                        >
                          Appliquer
                        </button>
                      </div>

                      <div className="flex items-center gap-2 flex-wrap">
                        <label className="px-3 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow">
                          <Upload className="w-3.5 h-3.5" />
                          <span>Téléverser depuis l'appareil</span>
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={e => handleFileUpload(e, url => {
                              setBgModalPlayer(url);
                              updateClubInfo({
                                backgroundUrls: { ...(clubInfo.backgroundUrls || {}), modalPlayerBg: url },
                              });
                            })}
                          />
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* 12. Fond Global de l'Application */}
              {(selectedBgSection === 'all' || selectedBgSection === 'appGlobalBg') && (
                <div className="p-5 rounded-3xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-4">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <div>
                      <span className="text-xs font-black text-purple-600 dark:text-purple-400 uppercase tracking-wider block">
                        Partie 12 : Arrière-plan Global de l'Application (Fond d'écran général)
                      </span>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                        Image en filigrane fixe en fond d'écran de l'ensemble du site.
                      </p>
                    </div>
                    {bgGlobal && (
                      <button
                        type="button"
                        onClick={() => {
                          setBgGlobal('');
                          updateClubInfo({
                            backgroundUrls: { ...(clubInfo.backgroundUrls || {}), appGlobalBg: '' },
                          });
                          showToast('Effacé', 'Fond d’écran global retiré (fond par défaut réactivé).', 'info');
                        }}
                        className="px-3 py-1.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 text-xs font-bold hover:bg-rose-100 transition"
                      >
                        Retirer le fond global
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                    <div className="md:col-span-5 h-36 rounded-2xl overflow-hidden bg-slate-900 border border-slate-300 dark:border-slate-700 relative shadow-inner">
                      {bgGlobal ? (
                        <img src={bgGlobal} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center text-slate-500 text-xs p-4 text-center">
                          <span>Aucun fond personnalisé</span>
                          <span className="text-[10px] text-slate-600 mt-1">Fond classique clair/sombre actif</span>
                        </div>
                      )}
                      <span className="absolute bottom-2 left-3 px-2 py-0.5 rounded bg-purple-600 text-white text-[9px] font-black uppercase">
                        Aperçu Fond Global
                      </span>
                    </div>

                    <div className="md:col-span-7 space-y-3">
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          value={bgGlobal}
                          onChange={e => setBgGlobal(e.target.value)}
                          placeholder="URL image de fond global de l'application..."
                          className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white outline-none focus:border-red-500 font-mono"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            updateClubInfo({
                              backgroundUrls: { ...(clubInfo.backgroundUrls || {}), appGlobalBg: bgGlobal.trim() },
                            });
                            showToast('Appliqué', 'Fond global de l’application mis à jour.', 'success');
                          }}
                          className="px-3 py-2 rounded-xl bg-slate-900 dark:bg-slate-800 text-white text-xs font-bold whitespace-nowrap"
                        >
                          Appliquer
                        </button>
                      </div>

                      <div className="flex items-center gap-2 flex-wrap">
                        <label className="px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow">
                          <Upload className="w-3.5 h-3.5" />
                          <span>Téléverser depuis l'appareil</span>
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={e => handleFileUpload(e, url => {
                              setBgGlobal(url);
                              updateClubInfo({
                                backgroundUrls: { ...(clubInfo.backgroundUrls || {}), appGlobalBg: url },
                              });
                            })}
                          />
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              )}

            </div>

            {/* Note d'aide Administrateur */}
            <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-start gap-3">
              <Sparkles className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
              <div className="text-xs text-slate-700 dark:text-slate-300 space-y-1">
                <p className="font-bold text-amber-900 dark:text-amber-300">
                  Liberté totale de personnalisation pour l'administrateur :
                </p>
                <p>
                  Chaque partie du site (14 parties au total) peut avoir son propre arrière-plan distinct, ou vous pouvez diffuser un arrière-plan à l'ensemble du site en un clic avec le bouton « Appliquer aux 14 parties ». Les images téléversées depuis votre téléphone ou ordinateur sont enregistrées immédiatement et persistées dans la base locale du club.
                </p>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 3: GESTION DES MATCHS & ADVERSAIRES                   */}
      {/* ========================================================= */}
      {activeAdminTab === 'matches' && (
        <div className="space-y-6">
          {/* Header Action Bar */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
            <div>
              <h2 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
                <Calendar className="w-5 h-5 text-red-500" />
                <span>Gestion & Planification des Matchs</span>
                <span className="px-2 py-0.5 rounded-full bg-red-500/10 text-red-600 dark:text-red-400 text-xs font-mono font-bold">
                  {matches.length} rencontre{matches.length > 1 ? 's' : ''}
                </span>
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Planifiez de nouveaux matchs à venir ou modifiez les rencontres existantes (adversaire, date, heure, lieu, scores, forfait).
              </p>
            </div>

            <div className="flex items-center gap-2 flex-wrap flex-shrink-0">
              {upcomingMatchesCount > 0 && (
                <button
                  onClick={() => setIsClearPlannedMatchesModalOpen(true)}
                  className="px-3.5 py-2.5 rounded-2xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-900/60 hover:bg-rose-100 dark:hover:bg-rose-900/40 text-xs font-bold transition flex items-center gap-1.5"
                  title="Supprimer tous les matchs planifiés"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Supprimer les Matchs Planifiés ({upcomingMatchesCount})</span>
                </button>
              )}

              <button
                onClick={handleOpenCreateMatch}
                className="px-5 py-2.5 rounded-2xl bg-red-600 hover:bg-red-700 text-white text-xs font-black shadow-lg shadow-red-600/30 transition flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                <span>Planifier / Enregistrer un Match</span>
              </button>
            </div>
          </div>

          {/* Filter Pills & Search Bar */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
              <button
                onClick={() => setMatchFilterStatus('all')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                  matchFilterStatus === 'all'
                    ? 'bg-red-600 text-white shadow'
                    : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                Tous ({matches.length})
              </button>

              <button
                onClick={() => setMatchFilterStatus('upcoming')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                  matchFilterStatus === 'upcoming'
                    ? 'bg-blue-600 text-white shadow'
                    : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                📅 Planifiés / À venir ({upcomingMatchesCount})
              </button>

              <button
                onClick={() => setMatchFilterStatus('finished')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                  matchFilterStatus === 'finished'
                    ? 'bg-emerald-600 text-white shadow'
                    : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                🏁 Terminés ({finishedMatchesCount})
              </button>

              <button
                onClick={() => setMatchFilterStatus('live')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                  matchFilterStatus === 'live'
                    ? 'bg-amber-600 text-white shadow'
                    : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                🟢 En Direct ({liveMatchesCount})
              </button>
            </div>

            <div className="relative w-full sm:w-72">
              <input
                type="text"
                placeholder="Rechercher (adversaire, compétition, lieu)..."
                value={matchSearchQuery}
                onChange={e => setMatchSearchQuery(e.target.value)}
                className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white outline-none focus:border-red-500 shadow-sm"
              />
            </div>
          </div>

          {/* Matches List */}
          {filteredMatches.length === 0 ? (
            <div className="text-center py-12 px-6 rounded-3xl bg-white dark:bg-slate-900 border-2 border-dashed border-slate-300 dark:border-slate-800 space-y-3">
              <div className="w-14 h-14 rounded-2xl bg-red-50 dark:bg-red-950/40 text-red-500 mx-auto flex items-center justify-center">
                <Calendar className="w-7 h-7" />
              </div>
              <h3 className="text-base font-black text-slate-900 dark:text-white">
                Aucune rencontre trouvée
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
                {matches.length === 0
                  ? "Aucun match n'est enregistré pour l'instant. Cliquez ci-dessous pour planifier votre première rencontre."
                  : "Aucun match ne correspond aux filtres ou à votre recherche."}
              </p>
              <button
                onClick={handleOpenCreateMatch}
                className="px-5 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold transition inline-flex items-center gap-2 shadow"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Planifier un Match Maintenant</span>
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredMatches.map(m => (
                <div
                  key={m.id}
                  className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition flex flex-col lg:flex-row items-start lg:items-center justify-between gap-5"
                >
                  <div className="space-y-2 flex-1 w-full">
                    {/* Top Badges */}
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="px-2.5 py-0.5 rounded-full bg-red-500/10 text-red-600 dark:text-red-400 text-[10px] font-black uppercase tracking-wider border border-red-500/20">
                        {m.competition}
                      </span>

                      {m.round && (
                        <span className="px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-[10px] font-bold">
                          {m.round}
                        </span>
                      )}

                      {m.status === 'upcoming' && (
                        <span className="px-2.5 py-0.5 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 text-[10px] font-black uppercase border border-blue-500/20">
                          📅 Planifié / À venir
                        </span>
                      )}

                      {m.status === 'live' && (
                        <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10px] font-black uppercase border border-emerald-500/20 animate-pulse">
                          🟢 En Direct ({m.liveMinute || 45}')
                        </span>
                      )}

                      {m.status === 'finished' && (
                        <span className="px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-[10px] font-black uppercase">
                          🏁 Terminé
                        </span>
                      )}

                      {m.isForfeit && (
                        <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-700 dark:text-amber-400 text-[10px] font-black uppercase border border-amber-500/30">
                          🏆 Forfait (3 - 0)
                        </span>
                      )}

                      <span className="px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 text-[10px] font-medium">
                        {m.isHome ? '🏠 Domicile' : '✈️ Extérieur'}
                      </span>
                    </div>

                    {/* Clash Faceoff */}
                    <div className="flex items-center gap-4 flex-wrap pt-1">
                      <div className="flex items-center gap-2">
                        <span className="font-extrabold text-base text-slate-900 dark:text-white">
                          {m.homeTeamName}
                        </span>
                      </div>

                      <div className="px-3 py-1 rounded-xl bg-slate-900 text-amber-400 font-mono font-black text-sm tracking-widest shadow-inner">
                        {m.status === 'upcoming' ? 'VS' : `${m.homeScore ?? 0} : ${m.awayScore ?? 0}`}
                      </div>

                      <div className="flex items-center gap-2">
                        {m.opponentLogo && (
                          <img src={m.opponentLogo} alt="" className="w-6 h-6 object-contain" />
                        )}
                        <span className="font-extrabold text-base text-slate-900 dark:text-white">
                          {m.opponent}
                        </span>
                      </div>
                    </div>

                    {/* Venue & Date Details */}
                    <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400 flex-wrap">
                      <span className="flex items-center gap-1 font-semibold text-slate-700 dark:text-slate-300">
                        <Calendar className="w-3.5 h-3.5 text-red-500" />
                        {m.date} à {m.time}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" />
                        {m.venue}
                      </span>
                    </div>

                    {m.isForfeit && m.forfeitReason && (
                      <p className="text-[11px] text-amber-600 dark:text-amber-400 font-semibold bg-amber-500/10 p-2 rounded-xl border border-amber-500/20">
                        Motif officiel : {m.forfeitReason}
                      </p>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 w-full lg:w-auto flex-shrink-0 pt-2 lg:pt-0 border-t lg:border-t-0 border-slate-100 dark:border-slate-800">
                    <button
                      onClick={() => handleOpenEditMatch(m)}
                      className="flex-1 lg:flex-none px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold shadow transition flex items-center justify-center gap-1.5"
                    >
                      <Edit className="w-3.5 h-3.5" />
                      <span>Modifier</span>
                    </button>

                    <button
                      onClick={() => setMatchToDelete(m)}
                      className="px-3.5 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-900/60 text-xs font-bold transition flex items-center gap-1.5"
                      title="Supprimer ce match"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Supprimer</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB: GESTION DU CLASSEMENT DU CHAMPIONNAT                 */}
      {/* ========================================================= */}
      {activeAdminTab === 'standings' && <AdminStandingsManager />}

      {/* ========================================================= */}
      {/* TAB: GESTION DES SCHÉMAS TACTIQUES & FORMATIONS           */}
      {/* ========================================================= */}
      {activeAdminTab === 'tactics' && <AdminTacticsManager />}

      {/* ========================================================= */}
      {/* TAB 4: SÉCURITÉ & MOT DE PASSE ADMIN                      */}
      {/* ========================================================= */}
      {activeAdminTab === 'security' && (
        <div className="max-w-xl mx-auto p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
          <div>
            <h2 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
              <KeyRound className="w-5 h-5 text-red-500" />
              <span>Modifier le Mot de Passe Administrateur</span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Personnalisez votre mot de passe d'accès pour sécuriser l'administration.
            </p>
          </div>

          <form onSubmit={handleChangePasswordSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Nouveau mot de passe
              </label>
              <input
                type="password"
                value={newPassword}
                onChange={e => setNewPassword(e.target.value)}
                placeholder="Au moins 4 caractères..."
                className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white outline-none focus:border-red-500"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Confirmer le nouveau mot de passe
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                placeholder="Répétez le mot de passe..."
                className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white outline-none focus:border-red-500"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-black shadow transition flex items-center justify-center gap-2"
            >
              <Save className="w-4 h-4" />
              <span>Enregistrer le Nouveau Mot de Passe</span>
            </button>
          </form>

          <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 text-xs text-slate-500 space-y-1">
              <p className="font-bold text-slate-700 dark:text-slate-300">Sécurité de l'accès :</p>
              <p>• Conservez précieusement votre mot de passe administrateur personnalisé.</p>
              <p>• Ne le communiquez qu'aux membres autorisés de la direction du club.</p>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL: AJOUTER / MODIFIER UN JOUEUR                       */}
      {/* ========================================================= */}
      {isPlayerModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-3 sm:p-4 overflow-y-auto">
          <div className="w-full max-w-2xl rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col">
            <div className="p-5 sm:p-6 bg-gradient-to-r from-red-950 to-slate-900 text-white flex items-center justify-between border-b border-red-900/40">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-red-600 text-white">
                  <User className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black">
                    {editingPlayer ? `Modifier ${editingPlayer.name}` : 'Ajouter un Nouveau Joueur'}
                  </h3>
                  <p className="text-xs text-slate-300">
                    Renseignez toutes les informations et le profil du joueur
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsPlayerModalOpen(false)}
                className="p-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white transition"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSavePlayer} className="p-6 space-y-5 overflow-y-auto flex-1">
              {/* Photo Input and Preview */}
              <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                <div className="w-18 h-18 rounded-2xl overflow-hidden bg-slate-800 border-2 border-red-500 flex-shrink-0">
                  <img
                    src={pPhotoUrl || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80'}
                    alt="Aperçu"
                    className="w-full h-full object-cover object-top"
                  />
                </div>
                <div className="flex-1 space-y-1.5">
                  <span className="text-xs font-bold text-slate-900 dark:text-white block">
                    Photo du joueur :
                  </span>
                  <div className="flex items-center gap-2 flex-wrap">
                    <button
                      type="button"
                      onClick={() => playerPhotoInputRef.current?.click()}
                      className="px-3 py-1.5 rounded-xl bg-red-600 text-white text-xs font-bold hover:bg-red-700 transition flex items-center gap-1.5"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      <span>Téléverser Photo</span>
                    </button>
                    <input
                      ref={playerPhotoInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={e => handleFileUpload(e, setPPhotoUrl)}
                    />
                  </div>
                  <input
                    type="text"
                    value={pPhotoUrl}
                    onChange={e => setPPhotoUrl(e.target.value)}
                    placeholder="Ou coller une URL d'image..."
                    className="w-full px-3 py-1.5 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-mono"
                  />
                </div>
              </div>

              {/* Name & Number */}
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
                <div className="sm:col-span-8 space-y-1">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Nom Complet du Joueur *
                  </label>
                  <input
                    type="text"
                    value={pName}
                    onChange={e => setPName(e.target.value)}
                    placeholder="ex: Ousmane Kebe, Baye Ablaye Dieng..."
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-bold outline-none focus:border-red-500"
                    required
                  />
                </div>
                <div className="sm:col-span-4 space-y-1">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Numéro de Maillot (#)
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={99}
                    value={pNumber}
                    onChange={e => setPNumber(Number(e.target.value))}
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-mono font-bold outline-none focus:border-red-500"
                  />
                </div>
              </div>

              {/* Position and Role Tag */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Ligne Principale
                  </label>
                  <select
                    value={pPosition}
                    onChange={e => setPPosition(e.target.value as any)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-bold outline-none focus:border-red-500"
                  >
                    <option value="GK">Gardien (GK)</option>
                    <option value="DEF">Défenseur (DEF)</option>
                    <option value="MID">Milieu (MID)</option>
                    <option value="ATT">Attaquant (ATT)</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Rôle Abrégé (Badge)
                  </label>
                  <select
                    value={pRoleTag}
                    onChange={e => {
                      setPRoleTag(e.target.value);
                      if (e.target.value === 'DC') setPPositionDetail('Défenseur Central (DC)');
                      if (e.target.value === 'DD') setPPositionDetail('Défenseur Droit (DD)');
                      if (e.target.value === 'DG') setPPositionDetail('Défenseur Gauche (DG)');
                      if (e.target.value === 'MD') setPPositionDetail('Milieu Défensif (MD)');
                      if (e.target.value === 'MO') setPPositionDetail('Milieu Offensif (MO)');
                      if (e.target.value === 'AT') setPPositionDetail('Attaquant / Buteur (AT)');
                      if (e.target.value === 'AG') setPPositionDetail('Ailier Gauche (AG)');
                      if (e.target.value === 'AD') setPPositionDetail('Ailier Droit (AD)');
                      if (e.target.value === 'GK') setPPositionDetail('Gardien de but (GK)');
                    }}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-bold outline-none focus:border-red-500 font-mono"
                  >
                    <option value="DC">DC (Défenseur Central)</option>
                    <option value="DD">DD (Défenseur Droit)</option>
                    <option value="DG">DG (Défenseur Gauche)</option>
                    <option value="MD">MD (Milieu Défensif)</option>
                    <option value="MO">MO (Milieu Offensif)</option>
                    <option value="AT">AT (Attaquant / Buteur)</option>
                    <option value="AG">AG (Ailier Gauche)</option>
                    <option value="AD">AD (Ailier Droit)</option>
                    <option value="GK">GK (Gardien de but)</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Poste Détaillé
                  </label>
                  <input
                    type="text"
                    value={pPositionDetail}
                    onChange={e => setPPositionDetail(e.target.value)}
                    placeholder="ex: Défenseur Central (DC)"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white outline-none focus:border-red-500"
                  />
                </div>
              </div>

              {/* Physical details */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-500">Âge</label>
                  <input
                    type="number"
                    value={pAge}
                    onChange={e => setPAge(Number(e.target.value))}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-500">Taille</label>
                  <input
                    type="text"
                    value={pHeight}
                    onChange={e => setPHeight(e.target.value)}
                    placeholder="1.82 m"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-500">Poids</label>
                  <input
                    type="text"
                    value={pWeight}
                    onChange={e => setPWeight(e.target.value)}
                    placeholder="75 kg"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-500">Pied Fort</label>
                  <select
                    value={pPreferredFoot}
                    onChange={e => setPPreferredFoot(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                  >
                    <option value="Droit">Droit</option>
                    <option value="Gauche">Gauche</option>
                    <option value="Ambidextre">Ambidextre</option>
                  </select>
                </div>
              </div>

              {/* Captain & Top scorer check */}
              <div className="flex items-center gap-6 p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-900 dark:text-white">
                  <input
                    type="checkbox"
                    checked={pIsCaptain}
                    onChange={e => setPIsCaptain(e.target.checked)}
                    className="w-4 h-4 text-red-600 rounded"
                  />
                  <span>👑 Capitaine de l'Équipe</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-900 dark:text-white">
                  <input
                    type="checkbox"
                    checked={pIsTopScorer}
                    onChange={e => setPIsTopScorer(e.target.checked)}
                    className="w-4 h-4 text-red-600 rounded"
                  />
                  <span>⚽ Buteur N°1</span>
                </label>
              </div>

              {/* Stats: Matches, Goals, Assists */}
              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-500">Matchs Joués</label>
                  <input
                    type="number"
                    value={pAppearances}
                    onChange={e => setPAppearances(Number(e.target.value))}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-mono"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-500">Buts Marqués</label>
                  <input
                    type="number"
                    value={pGoals}
                    onChange={e => setPGoals(Number(e.target.value))}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-mono"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-500">Passes Décisives</label>
                  <input
                    type="number"
                    value={pAssists}
                    onChange={e => setPAssists(Number(e.target.value))}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-mono"
                  />
                </div>
              </div>

              {/* Bio */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Biographie & Profil du Joueur
                </label>
                <textarea
                  rows={3}
                  value={pBio}
                  onChange={e => setPBio(e.target.value)}
                  placeholder="Décrivez les qualités, l'histoire et les atouts du joueur..."
                  className="w-full p-3 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white outline-none focus:border-red-500"
                />
              </div>

              {/* Submit Buttons */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsPlayerModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-bold hover:bg-slate-200 transition"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-black shadow-lg transition flex items-center gap-1.5"
                >
                  <Save className="w-4 h-4" />
                  <span>Enregistrer le Joueur</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL: PLANIFIER / MODIFIER UN MATCH                       */}
      {/* ========================================================= */}
      {isMatchModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-3 sm:p-4 overflow-y-auto">
          <div className="w-full max-w-2xl rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col">
            <div className="p-5 sm:p-6 bg-gradient-to-r from-red-950 to-slate-900 text-white flex items-center justify-between border-b border-red-900/40">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-red-600 text-white">
                  <Calendar className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black">
                    {editingMatch ? `Modifier la Rencontre (${editingMatch.opponent})` : 'Planifier & Enregistrer un Nouveau Match'}
                  </h3>
                  <p className="text-xs text-slate-300">
                    {editingMatch
                      ? "Modifiez l'adversaire, son logo, le score, la date et le statut du match"
                      : "Programmez une nouvelle rencontre officielle ou amicale avec tous ses détails"}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsMatchModalOpen(false)}
                className="p-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white transition"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveMatch} className="p-6 space-y-4 overflow-y-auto flex-1">
              {/* Statut & Rôle Domicile / Extérieur */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Statut du Match *
                  </label>
                  <select
                    value={mStatus}
                    onChange={e => setMStatus(e.target.value as any)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-bold outline-none focus:border-red-500"
                  >
                    <option value="upcoming">📅 Match Planifié / À venir</option>
                    <option value="live">🟢 Match En Direct</option>
                    <option value="finished">🏁 Match Terminé / Joué</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Terrain & Lieu
                  </label>
                  <select
                    value={mIsHome ? 'home' : 'away'}
                    onChange={e => setMIsHome(e.target.value === 'home')}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-bold outline-none focus:border-red-500"
                  >
                    <option value="home">🏠 À Domicile ({clubInfo.name} reçoit)</option>
                    <option value="away">✈️ À l'Extérieur ({clubInfo.name} en déplacement)</option>
                  </select>
                </div>
              </div>

              {/* Adversaire: Nom & Logo */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Nom de l'Équipe Adverse *
                  </label>
                  <input
                    type="text"
                    value={mOpponent}
                    onChange={e => {
                      const val = e.target.value;
                      setMOpponent(val);
                      // Auto-detect known club logo if current logo is empty or default
                      const lower = val.toLowerCase();
                      if (lower.includes('escale')) setMOpponentLogo('/asc-escale.svg');
                      else if (lower.includes('manko')) setMOpponentLogo('/asc-manko.svg');
                      else if (lower.includes('touba')) setMOpponentLogo('/touba-fc.svg');
                      else if (lower.includes('élite') || lower.includes('elite')) setMOpponentLogo('/elite-mbacke.svg');
                      else if (lower.includes('diambars')) setMOpponentLogo('/diambars-touba.svg');
                    }}
                    placeholder="ex: ASC ESCALE DE MBACKÉ"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-bold outline-none focus:border-red-500"
                  />
                  <div className="pt-1 flex items-center gap-1.5 flex-wrap">
                    <span className="text-[10px] text-slate-400 font-bold">Clubs locaux :</span>
                    {[
                      { name: 'ASC ESCALE DE MBACKÉ', logo: '/asc-escale.svg' },
                      { name: 'ASC Manko', logo: '/asc-manko.svg' },
                      { name: 'Touba Football Club', logo: '/touba-fc.svg' },
                      { name: 'Élite Mbacké Baol', logo: '/elite-mbacke.svg' },
                      { name: 'Académie Diambars Touba', logo: '/diambars-touba.svg' },
                    ].map(adv => (
                      <button
                        key={adv.name}
                        type="button"
                        onClick={() => {
                          setMOpponent(adv.name);
                          setMOpponentShort(adv.name.split(' ')[0].substring(0, 4).toUpperCase());
                          setMOpponentLogo(adv.logo);
                        }}
                        className={`text-[10px] px-2 py-0.5 rounded transition flex items-center gap-1 ${
                          mOpponent === adv.name
                            ? 'bg-red-600 text-white font-bold'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-red-500'
                        }`}
                      >
                        <img src={adv.logo} alt="" className="w-2.5 h-2.5 object-contain" />
                        <span>{adv.name.split(' ')[0]}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Logo de l'Adversaire
                  </label>
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center p-1 flex-shrink-0 shadow-sm">
                      <img src={mOpponentLogo || '/asc-escale.svg'} alt="" className="w-full h-full object-contain" />
                    </div>
                    <input
                      type="text"
                      value={mOpponentLogo}
                      onChange={e => setMOpponentLogo(e.target.value)}
                      placeholder="/asc-escale.svg ou URL"
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-mono"
                    />
                    <button
                      type="button"
                      onClick={() => opponentLogoInputRef.current?.click()}
                      className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 transition flex-shrink-0"
                      title="Téléverser image"
                    >
                      <Upload className="w-4 h-4" />
                    </button>
                    <input
                      ref={opponentLogoInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={e => handleFileUpload(e, setMOpponentLogo)}
                    />
                  </div>
                  <div className="flex items-center gap-1.5 pt-1">
                    <span className="text-[10px] text-slate-400">Logos rapides :</span>
                    {[
                      { label: 'Escale', url: '/asc-escale.svg' },
                      { label: 'Manko', url: '/asc-manko.svg' },
                      { label: 'Touba FC', url: '/touba-fc.svg' },
                      { label: 'Élite', url: '/elite-mbacke.svg' },
                      { label: 'Diambars', url: '/diambars-touba.svg' },
                    ].map(l => (
                      <button
                        key={l.label}
                        type="button"
                        onClick={() => setMOpponentLogo(l.url)}
                        className="text-[9px] px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-red-500 font-semibold"
                      >
                        {l.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Compétition & Journée */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Compétition *
                  </label>
                  <input
                    type="text"
                    value={mCompetition}
                    onChange={e => setMCompetition(e.target.value)}
                    placeholder="ex: Championnat ONGAM / Cadets 2026"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white outline-none focus:border-red-500 font-medium"
                  />
                  <div className="pt-1 flex items-center gap-1.5 flex-wrap">
                    {['Championnat ONGAM / Cadets 2026', 'Tournoi TOUBA-MBACKÉ', 'Match Amical'].map(comp => (
                      <button
                        key={comp}
                        type="button"
                        onClick={() => setMCompetition(comp)}
                        className={`text-[10px] px-2 py-0.5 rounded transition ${
                          mCompetition === comp
                            ? 'bg-red-600 text-white font-bold'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-red-500'
                        }`}
                      >
                        {comp.split(' ')[0]} {comp.split(' ')[1] || ''}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Journée / Phase
                  </label>
                  <input
                    type="text"
                    value={mRound}
                    onChange={e => setMRound(e.target.value)}
                    placeholder="ex: 1ère Journée, 2ème Journée, Finale..."
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white outline-none focus:border-red-500"
                  />
                  <div className="pt-1 flex items-center gap-1 flex-wrap">
                    {['1ère Journée', '2ème Journée', '3ème Journée', 'Phase de Poules', 'Quart de Finale', 'Demi-Finale', 'Finale'].map(r => (
                      <button
                        key={r}
                        type="button"
                        onClick={() => setMRound(r)}
                        className={`text-[10px] px-1.5 py-0.5 rounded transition ${
                          mRound === r
                            ? 'bg-red-600 text-white font-bold'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-red-500'
                        }`}
                      >
                        {r}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Date, Heure & Stade */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center justify-between">
                    <span>Date du Match *</span>
                    <span className="text-[10px] text-slate-400">Calendrier ou texte</span>
                  </label>
                  <div className="space-y-1.5">
                    <input
                      type="date"
                      onChange={e => {
                        const iso = e.target.value;
                        if (iso) {
                          const parts = iso.split('-');
                          const d = new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
                          const dayNames = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];
                          const monthNames = [
                            'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
                            'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
                          ];
                          const formatted = `${dayNames[d.getDay()]} ${String(parts[2]).padStart(2, '0')} ${monthNames[Number(parts[1]) - 1]} ${parts[0]}`;
                          setMDate(formatted);
                        }
                      }}
                      className="w-full px-2.5 py-1.5 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white outline-none focus:border-red-500 font-mono text-[11px]"
                    />
                    <input
                      type="text"
                      value={mDate}
                      onChange={e => setMDate(e.target.value)}
                      placeholder="ex: Vendredi 02 Octobre 2026"
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white outline-none focus:border-red-500 font-semibold"
                    />
                  </div>
                  <div className="flex items-center gap-1 flex-wrap pt-0.5">
                    {[
                      { label: 'Ce Vendredi', val: 'Vendredi 02 Octobre 2026' },
                      { label: 'Ce Samedi', val: 'Samedi 03 Octobre 2026' },
                      { label: 'Ce Dimanche', val: 'Dimanche 04 Octobre 2026' },
                    ].map(p => (
                      <button
                        key={p.label}
                        type="button"
                        onClick={() => setMDate(p.val)}
                        className="text-[9px] px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-red-500"
                      >
                        {p.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Heure du Coup d'Envoi *
                  </label>
                  <input
                    type="text"
                    value={mTime}
                    onChange={e => setMTime(e.target.value)}
                    placeholder="ex: 09:00 ou 16:30"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white outline-none focus:border-red-500 font-mono font-bold"
                  />
                  <div className="flex items-center gap-1 flex-wrap pt-0.5">
                    {['09:00', '15:30', '16:00', '16:30', '17:00'].map(t => (
                      <button
                        key={t}
                        type="button"
                        onClick={() => setMTime(t)}
                        className={`text-[10px] px-1.5 py-0.5 rounded font-mono transition ${
                          mTime === t
                            ? 'bg-red-600 text-white font-bold'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-red-500'
                        }`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Stade & Terrain Officiel *
                  </label>
                  <input
                    type="text"
                    value={mVenue}
                    onChange={e => setMVenue(e.target.value)}
                    placeholder="ex: TERIANN ÉCOLE NDIAGALAK"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white outline-none focus:border-red-500 font-medium"
                  />
                  <div className="flex items-center gap-1 flex-wrap pt-0.5">
                    {[
                      'TERIANN ÉCOLE NDIAGALAK',
                      'Stade Gaoussou Diarra, Mbacké',
                      'Complexe Touba-Mbacké',
                    ].map(st => (
                      <button
                        key={st}
                        type="button"
                        onClick={() => setMVenue(st)}
                        className="text-[9px] px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-red-500 truncate max-w-[140px]"
                        title={st}
                      >
                        {st.split(' ')[0]} {st.split(' ')[1] || ''}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Scores (si terminé ou en cours) */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900 dark:text-white">
                    Scores de la Rencontre :
                  </span>
                  <span className="text-[11px] text-slate-400">
                    {mStatus === 'upcoming' ? '(Non requis pour un match planifié à venir)' : '(Requis pour match terminé ou en cours)'}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-500">
                      Score Domicile ({mIsHome ? clubInfo.name : (mOpponent || 'Adversaire')})
                    </label>
                    <input
                      type="number"
                      min={0}
                      value={mHomeScore}
                      onChange={e => setMHomeScore(Number(e.target.value))}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-mono font-black text-center text-sm"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-500">
                      Score Extérieur ({mIsHome ? (mOpponent || 'Adversaire') : clubInfo.name})
                    </label>
                    <input
                      type="number"
                      min={0}
                      value={mAwayScore}
                      onChange={e => setMAwayScore(Number(e.target.value))}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-mono font-black text-center text-sm"
                    />
                  </div>
                </div>
              </div>

              {/* Option Spéciale Forfait */}
              <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 space-y-3">
                <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-900 dark:text-white">
                  <input
                    type="checkbox"
                    checked={mIsForfeit}
                    onChange={e => {
                      const checked = e.target.checked;
                      setMIsForfeit(checked);
                      if (checked) {
                        setMStatus('finished');
                        if (mIsHome) {
                          setMHomeScore(3);
                          setMAwayScore(0);
                        } else {
                          setMHomeScore(0);
                          setMAwayScore(3);
                        }
                        if (!mForfeitReason) {
                          setMForfeitReason("L'adversaire ne s'est pas présenté au terrain officiel.");
                        }
                      }
                    }}
                    className="w-4 h-4 text-emerald-600 rounded"
                  />
                  <span>🏆 Homologation Victoire par Forfait (3 - 0)</span>
                </label>

                {mIsForfeit && (
                  <div className="space-y-2 pt-2 border-t border-amber-500/20 animate-in fade-in">
                    <div className="space-y-1">
                      <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-300">
                        Motif officiel du forfait consigné par le corps arbitral :
                      </label>
                      <input
                        type="text"
                        value={mForfeitReason}
                        onChange={e => setMForfeitReason(e.target.value)}
                        placeholder="L'adversaire ne s'est pas présenté au terrain TERIANN ÉCOLE NDIAGALAK."
                        className="w-full px-3 py-2 text-xs rounded-xl border border-amber-500/30 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Submit & Delete Buttons */}
              <div className="flex items-center justify-between gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
                {editingMatch ? (
                  <button
                    type="button"
                    onClick={() => {
                      setIsMatchModalOpen(false);
                      setMatchToDelete(editingMatch);
                    }}
                    className="px-4 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-900/60 text-xs font-bold transition flex items-center gap-1.5"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>Supprimer ce match</span>
                  </button>
                ) : (
                  <div />
                )}

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setIsMatchModalOpen(false)}
                    className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-bold hover:bg-slate-200 transition"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-black shadow-lg transition flex items-center gap-1.5"
                  >
                    <Save className="w-4 h-4" />
                    <span>{editingMatch ? 'Enregistrer les Modifications' : 'Enregistrer le Match Planifié'}</span>
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL: CONFIRMATION DE SUPPRESSION D'UN MATCH            */}
      {/* ========================================================= */}
      {matchToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="w-full max-w-md rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl p-6 space-y-5">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-rose-500/10 text-rose-600 dark:text-rose-400 flex items-center justify-center flex-shrink-0 border border-rose-500/20">
                <Trash2 className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-black text-slate-900 dark:text-white">
                  Supprimer cette rencontre ?
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Cette action retirera définitivement le match du calendrier et de la billetterie.
                </p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-1.5 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-400">Match :</span>
                <span className="font-extrabold text-slate-900 dark:text-white">
                  {matchToDelete.homeTeamName} vs {matchToDelete.awayTeamName}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-400">Statut :</span>
                <span className="font-bold text-blue-600 dark:text-blue-400">
                  {matchToDelete.status === 'upcoming' ? '📅 Match Planifié' : matchToDelete.status === 'live' ? '🟢 En direct' : '🏁 Terminé'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-400">Date & Lieu :</span>
                <span className="text-slate-700 dark:text-slate-300">
                  {matchToDelete.date} à {matchToDelete.time} • {matchToDelete.venue}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-400">Compétition :</span>
                <span className="text-slate-700 dark:text-slate-300">
                  {matchToDelete.competition} {matchToDelete.round ? `(${matchToDelete.round})` : ''}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setMatchToDelete(null)}
                className="flex-1 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold transition"
              >
                Annuler
              </button>
              <button
                type="button"
                onClick={() => {
                  deleteMatch(matchToDelete.id);
                  setMatchToDelete(null);
                }}
                className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-black shadow-lg shadow-rose-600/30 transition flex items-center justify-center gap-1.5"
              >
                <Trash2 className="w-4 h-4" />
                <span>Supprimer Définitivement</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL: SUPPRIMER TOUS LES MATCHS PLANIFIÉS                */}
      {/* ========================================================= */}
      {isClearPlannedMatchesModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="w-full max-w-md rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl p-6 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-rose-500/10 text-rose-600 dark:text-rose-400 flex items-center justify-center flex-shrink-0 border border-rose-500/20">
                <Trash2 className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-black text-slate-900 dark:text-white">
                  Supprimer tous les matchs planifiés ?
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Tous les matchs à venir programmés ({upcomingMatchesCount}) seront retirés. Les matchs déjà terminés seront conservés.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setIsClearPlannedMatchesModalOpen(false)}
                className="flex-1 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold transition"
              >
                Annuler
              </button>
              <button
                type="button"
                onClick={() => {
                  matches.filter(m => m.status === 'upcoming').forEach(m => deleteMatch(m.id));
                  setIsClearPlannedMatchesModalOpen(false);
                  showToast('Matchs planifiés supprimés', 'Tous les matchs à venir ont été retirés.', 'info');
                }}
                className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-black shadow-lg shadow-rose-600/30 transition flex items-center justify-center gap-1.5"
              >
                <Trash2 className="w-4 h-4" />
                <span>Supprimer les Planifiés</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL: CONFIRMATION DE SUPPRESSION D'UN JOUEUR           */}
      {/* ========================================================= */}
      {playerToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="w-full max-w-md rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl p-6 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-rose-500/10 text-rose-600 dark:text-rose-400 flex items-center justify-center flex-shrink-0 border border-rose-500/20">
                <Trash2 className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-black text-slate-900 dark:text-white">
                  Supprimer ce joueur ?
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {playerToDelete.name} (#{playerToDelete.number}, {playerToDelete.positionDetail}) sera retiré de l'effectif.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setPlayerToDelete(null)}
                className="flex-1 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold transition"
              >
                Annuler
              </button>
              <button
                type="button"
                onClick={() => {
                  deletePlayer(playerToDelete.id);
                  setPlayerToDelete(null);
                }}
                className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-black shadow-lg shadow-rose-600/30 transition flex items-center justify-center gap-1.5"
              >
                <Trash2 className="w-4 h-4" />
                <span>Supprimer Définitivement</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL: EFFACER TOUS LES PROFILS DE JOUEURS                */}
      {/* ========================================================= */}
      {isClearAllPlayersModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="w-full max-w-md rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl p-6 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-rose-500/10 text-rose-600 dark:text-rose-400 flex items-center justify-center flex-shrink-0 border border-rose-500/20">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-black text-slate-900 dark:text-white">
                  Effacer tous les profils de joueurs ?
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Tous les profils des joueurs actuels seront effacés. Vous pourrez ajouter de nouveaux profils à tout moment.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setIsClearAllPlayersModalOpen(false)}
                className="flex-1 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold transition"
              >
                Annuler
              </button>
              <button
                type="button"
                onClick={() => {
                  clearAllPlayers();
                  setIsClearAllPlayersModalOpen(false);
                }}
                className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-black shadow-lg shadow-rose-600/30 transition flex items-center justify-center gap-1.5"
              >
                <Trash2 className="w-4 h-4" />
                <span>Effacer Tout</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL: MODIFIER LE PROFIL D'UN MEMBRE (ADMIN)             */}
      {/* ========================================================= */}
      {isAdminMemberModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
          <div className="relative max-w-xl w-full bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-2xl my-8 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                  <Edit className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
                    {editingAdminMember ? `Modifier le Profil de ${editingAdminMember.fullName}` : 'Inscrire un Nouveau Membre'}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Mise à jour officielle de la fiche adhérent ASC Dialloré
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsAdminMemberModalOpen(false)}
                className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveAdminMember} className="space-y-4">
              {/* Photo & Avatar Section */}
              <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-100 dark:border-slate-800 space-y-3">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                  Photo de profil du membre
                </label>

                <div className="flex flex-col sm:flex-row items-center gap-4">
                  <div className="relative w-20 h-20 rounded-2xl overflow-hidden border-2 border-amber-500 shadow-md flex-shrink-0 bg-slate-900">
                    <img
                      src={memberAvatarUrl || memberPresetAvatars[0].url}
                      alt="Aperçu avatar"
                      className="w-full h-full object-cover"
                    />
                    <span className="absolute bottom-0 inset-x-0 bg-black/60 text-white text-[9px] font-bold text-center py-0.5">
                      Aperçu
                    </span>
                  </div>

                  <div className="flex-1 w-full space-y-2">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={memberAvatarUrl}
                        onChange={e => setMemberAvatarUrl(e.target.value)}
                        placeholder="URL de la photo (https://...)"
                        className="flex-1 px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-mono outline-none"
                      />
                      <label className="px-3 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold flex items-center gap-1.5 cursor-pointer transition shadow-sm whitespace-nowrap">
                        <Upload className="w-3.5 h-3.5" />
                        <span>Téléverser</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleMemberAvatarUpload}
                          className="hidden"
                        />
                      </label>
                    </div>

                    <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
                      <span className="text-[10px] text-slate-400 flex-shrink-0">Portraits :</span>
                      {memberPresetAvatars.map((p, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => setMemberAvatarUrl(p.url)}
                          className={`w-6 h-6 rounded-full overflow-hidden border transition flex-shrink-0 ${
                            memberAvatarUrl === p.url ? 'border-amber-500 ring-2 ring-amber-500/40 scale-110' : 'border-slate-300 opacity-60'
                          }`}
                          title={p.label}
                        >
                          <img src={p.url} alt={p.label} className="w-full h-full object-cover" />
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Full Name & Membership Number */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Nom complet *
                  </label>
                  <input
                    type="text"
                    required
                    value={memberFullName}
                    onChange={e => setMemberFullName(e.target.value)}
                    placeholder="Ex: Cheikh Diop"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 border-none text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-amber-500 outline-none font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Numéro d'adhérent *
                  </label>
                  <input
                    type="text"
                    required
                    value={memberNumber}
                    onChange={e => setMemberNumber(e.target.value)}
                    placeholder="DIA-MBK-015"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 border-none text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-amber-500 outline-none font-mono font-bold"
                  />
                </div>
              </div>

              {/* Tier & Status */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Formule d'adhésion *
                  </label>
                  <select
                    value={memberTier}
                    onChange={e => setMemberTier(e.target.value as ClubMember['tier'])}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 border-none text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-amber-500 outline-none font-medium"
                  >
                    <option value="Supporter">Supporter</option>
                    <option value="Adhérent">Adhérent</option>
                    <option value="Gold VIP">Gold VIP</option>
                    <option value="Membre d’Honneur">Membre d’Honneur</option>
                    <option value="Socio">Socio</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Statut du profil *
                  </label>
                  <select
                    value={memberStatus}
                    onChange={e => setMemberStatus(e.target.value as ClubMember['status'])}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 border-none text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-amber-500 outline-none font-medium"
                  >
                    <option value="Actif">Actif (en règle)</option>
                    <option value="En attente">En attente de validation</option>
                    <option value="Suspendu">Suspendu</option>
                  </select>
                </div>
              </div>

              {/* City & Joined Date */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Ville / Localité *
                  </label>
                  <input
                    type="text"
                    required
                    value={memberCity}
                    onChange={e => setMemberCity(e.target.value)}
                    placeholder="Touba & Mbacké"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 border-none text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-amber-500 outline-none font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Date d'adhésion
                  </label>
                  <input
                    type="text"
                    value={memberJoinedDate}
                    onChange={e => setMemberJoinedDate(e.target.value)}
                    placeholder="JJ/MM/AAAA"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 border-none text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-amber-500 outline-none font-medium"
                  />
                </div>
              </div>

              {/* Phone & Email */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Téléphone (WhatsApp)
                  </label>
                  <input
                    type="tel"
                    value={memberPhone}
                    onChange={e => setMemberPhone(e.target.value)}
                    placeholder="+221 77 000 00 00"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 border-none text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-amber-500 outline-none font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    value={memberEmail}
                    onChange={e => setMemberEmail(e.target.value)}
                    placeholder="membre@ascdiallore.sn"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 border-none text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-amber-500 outline-none"
                  />
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Notes ou rôle associatif (optionnel)
                </label>
                <textarea
                  rows={2}
                  value={memberNotes}
                  onChange={e => setMemberNotes(e.target.value)}
                  placeholder="Membre d'honneur, animateur supporters, etc."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 border-none text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-amber-500 outline-none font-medium resize-none"
                />
              </div>

              {/* Actions */}
              <div className="pt-2 flex justify-end gap-2 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAdminMemberModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold hover:bg-slate-200 transition"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-black uppercase tracking-wider shadow-lg shadow-blue-600/30 flex items-center gap-1.5 transition"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{editingAdminMember ? 'Enregistrer les modifications' : 'Inscrire le membre'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL: ADMIN MODIFIER / AJOUTER MEMBRE DU STAFF          */}
      {/* ========================================================= */}
      {isAdminStaffModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-in fade-in">
          <div className="relative max-w-xl w-full bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-2xl my-8 space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
                  <Briefcase className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900 dark:text-white">
                    {editingAdminStaff ? 'Modifier le Membre du Staff' : 'Ajouter un Membre au Staff'}
                  </h3>
                  <p className="text-xs text-slate-400">Direction, encadrement technique et médical</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsAdminStaffModalOpen(false)}
                className="p-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveStaffMember} className="space-y-4">
              {/* Photo Upload & Presets */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-3">
                <label className="text-xs font-bold text-slate-900 dark:text-white block">
                  Photo Officielle du Membre du Staff :
                </label>

                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-2xl overflow-hidden border-2 border-emerald-500 shadow-md flex-shrink-0 bg-slate-800">
                    <img
                      src={staffPhotoUrl || staffPresetPortraits[0].url}
                      alt="Aperçu Staff"
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="space-y-1.5 flex-1">
                    <div className="flex items-center gap-2">
                      <label className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow">
                        <Upload className="w-3.5 h-3.5" />
                        <span>Téléverser depuis l'appareil</span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={handleStaffPhotoFileUpload}
                        />
                      </label>
                    </div>
                    <input
                      type="text"
                      value={staffPhotoUrl}
                      onChange={e => setStaffPhotoUrl(e.target.value)}
                      placeholder="Ou coller une URL d'image..."
                      className="w-full px-3 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-mono text-[11px] outline-none"
                    />
                  </div>
                </div>

                {/* Preset Portraits */}
                <div>
                  <span className="text-[10px] font-bold text-slate-400 block mb-1">Portraits prédéfinis recommandés :</span>
                  <div className="grid grid-cols-4 sm:grid-cols-7 gap-1.5">
                    {staffPresetPortraits.map((preset, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => {
                          setStaffPhotoUrl(preset.url);
                          if (!staffTitle) setStaffTitle(preset.role);
                        }}
                        className={`relative rounded-xl overflow-hidden border-2 transition p-0.5 ${
                          staffPhotoUrl === preset.url
                            ? 'border-emerald-500 ring-2 ring-emerald-500/30'
                            : 'border-transparent hover:border-slate-400'
                        }`}
                        title={preset.label}
                      >
                        <img src={preset.url} alt={preset.label} className="w-full h-10 object-cover rounded-lg" />
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Nom & Titre */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Nom complet *
                  </label>
                  <input
                    type="text"
                    required
                    value={staffName}
                    onChange={e => setStaffName(e.target.value)}
                    placeholder="Ex: Cheikh Tidiane Diop"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-bold outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Titre officiel *
                  </label>
                  <input
                    type="text"
                    required
                    value={staffTitle}
                    onChange={e => setStaffTitle(e.target.value)}
                    placeholder="Ex: Entraîneur Principal, Secrétaire Général"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-bold outline-none"
                  />
                </div>
              </div>

              {/* Pôle & Rôle */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Pôle / Département *
                  </label>
                  <select
                    value={staffCategory}
                    onChange={e => setStaffCategory(e.target.value as StaffMember['category'])}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-bold outline-none"
                  >
                    <option value="technical">Pôle Technique & Coachs</option>
                    <option value="administration">Direction & Administration</option>
                    <option value="medical">Pôle Médical & Soins</option>
                    <option value="president">Présidence Officielle</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Rôle & Missions clés
                  </label>
                  <input
                    type="text"
                    value={staffRole}
                    onChange={e => setStaffRole(e.target.value)}
                    placeholder="Ex: Pôle Formation des Cadets, Méthodologie"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs outline-none"
                  />
                </div>
              </div>

              {/* Diplôme & Statut */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Diplôme / Certification
                  </label>
                  <input
                    type="text"
                    value={staffDiploma}
                    onChange={e => setStaffDiploma(e.target.value)}
                    placeholder="Ex: Licence B CAF, Médecin du Sport"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Statut / Disponibilité
                  </label>
                  <select
                    value={staffStatus}
                    onChange={e => setStaffStatus(e.target.value as StaffMember['status'])}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs outline-none"
                  >
                    <option value="Actif">Actif</option>
                    <option value="En mission">En mission</option>
                    <option value="Honoraire">Honoraire</option>
                  </select>
                </div>
              </div>

              {/* Téléphone & Email */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Téléphone (WhatsApp)
                  </label>
                  <input
                    type="tel"
                    value={staffPhone}
                    onChange={e => setStaffPhone(e.target.value)}
                    placeholder="+221 77 000 00 00"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-mono outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Email officiel
                  </label>
                  <input
                    type="email"
                    value={staffEmail}
                    onChange={e => setStaffEmail(e.target.value)}
                    placeholder="staff@ascdiallore.sn"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs outline-none"
                  />
                </div>
              </div>

              {/* Biographie */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Biographie / Parcours & Palmarès
                </label>
                <textarea
                  rows={2}
                  value={staffBio}
                  onChange={e => setStaffBio(e.target.value)}
                  placeholder="Parcours professionnel, années d'expérience et engagement auprès du club..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs outline-none resize-none leading-relaxed"
                />
              </div>

              {/* Submit Buttons */}
              <div className="pt-2 flex justify-end gap-2 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAdminStaffModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-bold"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black uppercase tracking-wider shadow-lg shadow-emerald-600/30 flex items-center gap-1.5 transition"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{editingAdminStaff ? 'Enregistrer les modifications' : 'Ajouter au Staff'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL: ADMIN MODIFIER PHOTO & PROFIL DE LA PRÉSIDENCE    */}
      {/* ========================================================= */}
      {isAdminPresidentModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-in fade-in">
          <div className="relative max-w-lg w-full bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-amber-500/40 shadow-2xl my-8 space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center font-bold">
                  <Crown className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900 dark:text-white">
                    Photo & Profil Officiel de la Présidence
                  </h3>
                  <p className="text-xs text-slate-400">Président ou Présidente de l'ASC Dialloré</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsAdminPresidentModalOpen(false)}
                className="p-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSavePresidentModal} className="space-y-4">
              {/* Photo Upload & Presets */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-3">
                <label className="text-xs font-bold text-slate-900 dark:text-white block">
                  Photo Officielle de la Présidence :
                </label>

                <div className="flex items-center gap-4">
                  <div className="w-20 h-20 rounded-2xl overflow-hidden border-2 border-amber-400 shadow-md flex-shrink-0 bg-slate-800">
                    <img
                      src={adminPresPhotoUrl || presidentPresetPortraits[0].url}
                      alt="Présidence"
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="space-y-2 flex-1">
                    <label className="px-3.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-black flex items-center gap-1.5 cursor-pointer shadow transition inline-flex">
                      <Upload className="w-3.5 h-3.5" />
                      <span>Téléverser depuis l'appareil</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handlePresidentPhotoFileUpload}
                      />
                    </label>

                    <input
                      type="text"
                      value={adminPresPhotoUrl}
                      onChange={e => setAdminPresPhotoUrl(e.target.value)}
                      placeholder="Ou coller une URL d'image officielle..."
                      className="w-full px-3 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-mono text-[11px] outline-none"
                    />
                  </div>
                </div>

                {/* Presets Homme & Femme */}
                <div>
                  <span className="text-[10px] font-bold text-slate-400 block mb-1.5">
                    Portraits officiels de référence (Homme / Femme) :
                  </span>
                  <div className="grid grid-cols-4 gap-2">
                    {presidentPresetPortraits.map((preset, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => {
                          setAdminPresPhotoUrl(preset.url);
                          if (preset.gender === 'Femme') {
                            setAdminPresTitle('Présidente');
                          } else {
                            setAdminPresTitle('Président');
                          }
                        }}
                        className={`relative rounded-xl overflow-hidden border-2 transition p-0.5 ${
                          adminPresPhotoUrl === preset.url
                            ? 'border-amber-500 ring-2 ring-amber-500/30'
                            : 'border-transparent hover:border-slate-400'
                        }`}
                        title={preset.label}
                      >
                        <img src={preset.url} alt={preset.label} className="w-full h-12 object-cover rounded-lg" />
                        <span className="block text-[9px] font-bold text-slate-500 truncate mt-0.5 text-center">
                          {preset.gender}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Titre & Nom */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Titre Officiel *
                  </label>
                  <select
                    value={adminPresTitle}
                    onChange={e => setAdminPresTitle(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-bold outline-none"
                  >
                    <option value="Président">Président</option>
                    <option value="Présidente">Présidente</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Nom Complet de la Présidence *
                  </label>
                  <input
                    type="text"
                    required
                    value={adminPresName}
                    onChange={e => setAdminPresName(e.target.value)}
                    placeholder="Ex: El Hadji Ousseynou Fall"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-bold outline-none"
                  />
                </div>
              </div>

              {/* Téléphone & Email */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Téléphone Présidence
                  </label>
                  <input
                    type="tel"
                    value={adminPresPhone}
                    onChange={e => setAdminPresPhone(e.target.value)}
                    placeholder="+221 77 500 12 34"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-mono outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Email Présidence
                  </label>
                  <input
                    type="email"
                    value={adminPresEmail}
                    onChange={e => setAdminPresEmail(e.target.value)}
                    placeholder="presidence@ascdiallore.sn"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs outline-none"
                  />
                </div>
              </div>

              {/* Mot officiel */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Mot officiel de la Présidence
                </label>
                <textarea
                  rows={3}
                  value={adminPresWord}
                  onChange={e => setAdminPresWord(e.target.value)}
                  placeholder="Discours aux supporters, jeunes joueurs et partenaires..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs outline-none resize-none leading-relaxed"
                />
              </div>

              {/* Submit Buttons */}
              <div className="pt-2 flex justify-end gap-2 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAdminPresidentModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-bold"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-black uppercase tracking-wider shadow-lg shadow-amber-500/30 flex items-center gap-1.5 transition"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Enregistrer la Présidence</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL: ADMIN PLAYER CV MODAL (CRÉER / MODIFIER UN CV)    */}
      {/* ========================================================= */}
      {adminPlayerCVTarget && (
        <PlayerCVModal
          player={adminPlayerCVTarget}
          isOpen={isAdminPlayerCVModalOpen}
          onClose={() => {
            setIsAdminPlayerCVModalOpen(false);
            setAdminPlayerCVTarget(null);
          }}
        />
      )}
    </div>
  );
};
