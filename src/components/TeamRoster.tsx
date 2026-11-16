import React, { useState } from 'react';
import {
  Users,
  Search,
  ArrowUpDown,
  Flame,
  Award,
  Shield,
  ShieldCheck,
  Zap,
  UserCheck,
  Compass,
  CheckCircle2,
  Crown,
  Briefcase,
  Stethoscope,
  Phone,
  Mail,
  Plus,
  Trash2,
  Edit,
  X,
  Upload,
  Calendar,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { COACH_INFO, CLUB_INFO } from '../data/clubData';
import { Player, StaffMember } from '../types';
import { getAccentStyles } from '../utils/theme';
import { getPlayerFullName, getPlayerFlag, getPlayerStats } from '../utils/playerHelpers';

export const TeamRoster: React.FC = () => {
  const {
    setSelectedPlayerId,
    themeAccent,
    t,
    players,
    clubInfo,
    updateClubInfo,
    staff,
    addStaffMember,
    updateStaffMember,
    deleteStaffMember,
    isAdminLoggedIn,
    setActiveTab,
    showToast,
    tacticalFormations,
    activeFormationId,
    setActiveFormationId,
  } = useApp();

  const accent = getAccentStyles(themeAccent);

  // Sub-tab view: 'all' | 'staff' | 'players' | 'tactics'
  const [viewTab, setViewTab] = useState<'all' | 'staff' | 'players' | 'tactics'>('all');

  // Players filtering state
  const [positionFilter, setPositionFilter] = useState<string>('all');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'number' | 'goals' | 'value'>('number');

  // Staff filtering & admin modals
  const [staffCategoryFilter, setStaffCategoryFilter] = useState<string>('all');
  const [isStaffModalOpen, setIsStaffModalOpen] = useState(false);
  const [editingStaff, setEditingStaff] = useState<StaffMember | null>(null);
  const [staffDeleteConfirmId, setStaffDeleteConfirmId] = useState<string | null>(null);

  // Staff Form fields
  const [sName, setSName] = useState('');
  const [sTitle, setSTitle] = useState('');
  const [sRole, setSRole] = useState('');
  const [sCategory, setSCategory] = useState<StaffMember['category']>('technical');
  const [sPhotoUrl, setSPhotoUrl] = useState('');
  const [sBio, setSBio] = useState('');
  const [sPhone, setSPhone] = useState('');
  const [sEmail, setSEmail] = useState('');
  const [sDiploma, setSDiploma] = useState('');
  const [sStatus, setSStatus] = useState<StaffMember['status']>('Actif');

  // President Edit Modal
  const [isPresidentModalOpen, setIsPresidentModalOpen] = useState(false);
  const [presName, setPresName] = useState(clubInfo.president || 'El Hadji Ousseynou Fall');
  const [presTitle, setPresTitle] = useState(clubInfo.presidentTitle || 'Président');
  const [presPhotoUrl, setPresPhotoUrl] = useState(clubInfo.presidentPhotoUrl || '');
  const [presWord, setPresWord] = useState(clubInfo.presidentWord || '');
  const [presPhone, setPresPhone] = useState('+221 77 500 12 34');
  const [presEmail, setPresEmail] = useState('presidence@ascdiallore.sn');

  // Presets for President and Staff photos
  const presidentPresets = [
    { label: 'Président (Homme 1)', url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80' },
    { label: 'Présidente (Femme 1)', url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=600&q=80' },
    { label: 'Président (Homme 2)', url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=600&q=80' },
    { label: 'Présidente (Femme 2)', url: 'https://images.unsplash.com/photo-1580894732479-7108920beee1?auto=format&fit=crop&w=600&q=80' },
  ];

  const staffPresets = [
    { label: 'Coach Principal', url: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=600&q=80' },
    { label: 'Coach Adjoint', url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=600&q=80' },
    { label: 'Dirigeante / Admin', url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80' },
    { label: 'Staff Médical', url: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=600&q=80' },
  ];

  const handlePresidentPhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        showToast('Fichier volumineux', 'Veuillez choisir une image inférieure à 10 Mo.', 'alert');
        return;
      }
      const reader = new FileReader();
      reader.onload = ev => {
        if (ev.target?.result) {
          setPresPhotoUrl(ev.target.result as string);
          showToast('Photo chargée', 'La photo officielle du Président / de la Présidente a été chargée.', 'success');
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleStaffPhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        showToast('Fichier volumineux', 'Veuillez choisir une image inférieure à 10 Mo.', 'alert');
        return;
      }
      const reader = new FileReader();
      reader.onload = ev => {
        if (ev.target?.result) {
          setSPhotoUrl(ev.target.result as string);
          showToast('Photo chargée', 'La photo officielle a été chargée.', 'success');
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const mainCategories: { id: string; label: string; count: number }[] = [
    { id: 'all', label: 'Tous les joueurs', count: players.length },
    {
      id: 'GK',
      label: 'Gardiens (GK)',
      count: players.filter(p => p.position === 'GK').length,
    },
    {
      id: 'DEF',
      label: 'Défenseurs (DC, DD, DG)',
      count: players.filter(p => p.position === 'DEF').length,
    },
    {
      id: 'MID',
      label: 'Milieux (MD, MO)',
      count: players.filter(p => p.position === 'MID').length,
    },
    {
      id: 'ATT',
      label: 'Attaquants (AT, AG, AD)',
      count: players.filter(p => p.position === 'ATT').length,
    },
  ];

  const specificRoles: { id: string; label: string; tag: string }[] = [
    { id: 'all', label: 'Tous les postes', tag: 'ALL' },
    { id: 'DC', label: 'Défenseur Central', tag: 'DC' },
    { id: 'DD', label: 'Défenseur Droit', tag: 'DD' },
    { id: 'DG', label: 'Défenseur Gauche', tag: 'DG' },
    { id: 'MD', label: 'Milieu Défensif', tag: 'MD' },
    { id: 'MO', label: 'Milieu Offensif', tag: 'MO' },
    { id: 'AT', label: 'Attaquant / Buteur', tag: 'AT' },
    { id: 'AG', label: 'Ailier Gauche', tag: 'AG' },
    { id: 'AD', label: 'Ailier Droit', tag: 'AD' },
    { id: 'GK', label: 'Gardien de but', tag: 'GK' },
  ];

  const getPlayerRoleTag = (player: Player): string => {
    const detail = (player.positionDetail || '').toUpperCase();
    if (detail.includes('(DC)')) return 'DC';
    if (detail.includes('(DD)')) return 'DD';
    if (detail.includes('(DG)')) return 'DG';
    if (detail.includes('(MD)')) return 'MD';
    if (detail.includes('(MO)')) return 'MO';
    if (detail.includes('(AT)')) return 'AT';
    if (detail.includes('(AG)')) return 'AG';
    if (detail.includes('(AD)')) return 'AD';
    if (player.position === 'GK' || detail.includes('(GK)')) return 'GK';
    return player.position;
  };

  const getRoleBadgeStyle = (tag: string) => {
    switch (tag) {
      case 'DC':
        return 'bg-blue-600/90 text-white border-blue-400/40';
      case 'DD':
        return 'bg-cyan-600/90 text-white border-cyan-400/40';
      case 'DG':
        return 'bg-indigo-600/90 text-white border-indigo-400/40';
      case 'MD':
        return 'bg-emerald-600/90 text-white border-emerald-400/40';
      case 'MO':
        return 'bg-teal-600/90 text-white border-teal-400/40';
      case 'AD':
        return 'bg-amber-500 text-slate-950 border-amber-300 font-black';
      case 'AG':
        return 'bg-rose-600/90 text-white border-rose-400/40';
      case 'AT':
        return 'bg-red-600/90 text-white border-red-400/40';
      case 'GK':
        return 'bg-purple-600/90 text-white border-purple-400/40';
      default:
        return 'bg-slate-700 text-white border-slate-600';
    }
  };

  const filteredPlayers = players.filter(p => {
    const roleTag = getPlayerRoleTag(p);
    const matchesCategory = positionFilter === 'all' || p.position === positionFilter;
    const matchesRole = roleFilter === 'all' || roleTag === roleFilter || (roleFilter === 'GK' && p.position === 'GK');
    const fullName = getPlayerFullName(p);
    const matchesSearch =
      fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.number.toString().includes(searchQuery) ||
      (p.positionDetail && p.positionDetail.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (p.bio && p.bio.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesRole && matchesSearch;
  });

  // Staff members (excluding president if listed separately, or displaying president as category 'president')
  const presidentMember =
    staff.find(s => s.category === 'president') || {
      id: 'staff-pres-default',
      name: clubInfo.president || 'El Hadji Ousseynou Fall',
      title: `${clubInfo.presidentTitle || 'Président'} de l'${clubInfo.name}`,
      role: 'Présidence & Direction Générale',
      category: 'president' as const,
      photoUrl:
        clubInfo.presidentPhotoUrl ||
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80',
      bio:
        clubInfo.presidentWord ||
        "Président dévoué au rayonnement sportif et citoyen de l’ASC Dialloré à Mbacké et Touba.",
      phone: '+221 77 500 12 34',
      email: 'presidence@ascdiallore.sn',
      order: 1,
    };

  const nonPresidentStaff = staff.filter(s => s.category !== 'president');

  const filteredStaff = nonPresidentStaff.filter(s => {
    if (staffCategoryFilter === 'all') return true;
    return s.category === staffCategoryFilter;
  });

  const handleOpenAddStaff = () => {
    setEditingStaff(null);
    setSName('');
    setSTitle('Entraîneur Adjoint');
    setSRole('Encadrement Technique');
    setSCategory('technical');
    setSPhotoUrl(staffPresets[0].url);
    setSBio('');
    setSPhone('+221 77 000 00 00');
    setSEmail('staff@ascdiallore.sn');
    setSDiploma('Licence B CAF');
    setSStatus('Actif');
    setIsStaffModalOpen(true);
  };

  const handleOpenEditStaff = (s: StaffMember) => {
    setEditingStaff(s);
    setSName(s.name);
    setSTitle(s.title);
    setSRole(s.role);
    setSCategory(s.category);
    setSPhotoUrl(s.photoUrl);
    setSBio(s.bio || '');
    setSPhone(s.phone || '');
    setSEmail(s.email || '');
    setSDiploma(s.diploma || '');
    setSStatus(s.status || 'Actif');
    setIsStaffModalOpen(true);
  };

  const handleSaveStaff = (e: React.FormEvent) => {
    e.preventDefault();
    if (!sName.trim()) {
      showToast('Nom requis', 'Veuillez saisir le nom du membre du staff.', 'alert');
      return;
    }

    if (editingStaff) {
      updateStaffMember(editingStaff.id, {
        name: sName.trim(),
        title: sTitle.trim(),
        role: sRole.trim(),
        category: sCategory,
        photoUrl: sPhotoUrl.trim() || editingStaff.photoUrl,
        bio: sBio.trim() || undefined,
        phone: sPhone.trim() || undefined,
        email: sEmail.trim() || undefined,
        diploma: sDiploma.trim() || undefined,
        status: sStatus,
      });
      // Sync president if edited
      if (sCategory === 'president') {
        updateClubInfo({
          president: sName.trim(),
          presidentTitle: sTitle.includes('Présidente') ? 'Présidente' : 'Président',
          presidentPhotoUrl: sPhotoUrl.trim() || clubInfo.presidentPhotoUrl,
          presidentWord: sBio.trim() || clubInfo.presidentWord,
        });
      }
      setIsStaffModalOpen(false);
      showToast('Staff mis à jour', `Le profil et la photo de ${sName.trim()} ont été enregistrés.`, 'success');
    } else {
      const newStaff: StaffMember = {
        id: `staff-${Date.now()}`,
        name: sName.trim(),
        title: sTitle.trim() || 'Membre du Staff',
        role: sRole.trim() || 'Encadrement',
        category: sCategory,
        photoUrl:
          sPhotoUrl.trim() ||
          staffPresets[0].url,
        bio: sBio.trim() || undefined,
        phone: sPhone.trim() || undefined,
        email: sEmail.trim() || undefined,
        diploma: sDiploma.trim() || undefined,
        status: sStatus,
        order: staff.length + 1,
      };
      addStaffMember(newStaff);
      setIsStaffModalOpen(false);
      showToast('Staff ajouté', `${sName.trim()} a été intégré au staff.`, 'success');
    }
  };

  const handleSavePresident = (e: React.FormEvent) => {
    e.preventDefault();
    updateClubInfo({
      president: presName.trim(),
      presidentTitle: presTitle.trim(),
      presidentPhotoUrl: presPhotoUrl.trim() || clubInfo.presidentPhotoUrl,
      presidentWord: presWord.trim() || clubInfo.presidentWord,
    });
    // Also sync the president entry in staff array if present
    const presStaff = staff.find(s => s.category === 'president');
    if (presStaff) {
      updateStaffMember(presStaff.id, {
        name: presName.trim(),
        title: `${presTitle.trim()} de l'${clubInfo.name}`,
        photoUrl: presPhotoUrl.trim() || presStaff.photoUrl,
        bio: presWord.trim() || presStaff.bio,
        phone: presPhone.trim() || presStaff.phone,
        email: presEmail.trim() || presStaff.email,
      });
    }
    setIsPresidentModalOpen(false);
    showToast('Présidence mise à jour', 'La photo officielle et les informations ont été enregistrées.', 'success');
  };

  const getStaffCategoryBadge = (cat: StaffMember['category']) => {
    switch (cat) {
      case 'president':
        return 'bg-amber-500 text-slate-950 font-black border-amber-300';
      case 'technical':
        return 'bg-red-600 text-white font-bold border-red-400/40';
      case 'medical':
        return 'bg-emerald-600 text-white font-bold border-emerald-400/40';
      case 'administration':
      default:
        return 'bg-blue-600 text-white font-bold border-blue-400/40';
    }
  };

  const getStaffCategoryLabel = (cat: StaffMember['category']) => {
    switch (cat) {
      case 'president':
        return 'Présidence';
      case 'technical':
        return 'Staff Technique';
      case 'medical':
        return 'Médical & Santé';
      case 'administration':
        return 'Direction & Administration';
      default:
        return cat;
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in pb-16">
      {/* 1. Master Team Header Banner */}
      <div className="relative rounded-3xl overflow-hidden bg-slate-950 border border-slate-800 p-6 sm:p-10 text-white shadow-2xl">
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          <img
            src={clubInfo.backgroundUrls?.teamBanner || '/diallore-team-banner.jpg'}
            alt=""
            className="w-full h-full object-cover opacity-25 scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/90 to-red-950/70" />
        </div>

        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-black bg-red-600 text-white tracking-wider uppercase shadow-md flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5" />
              Effectif & Staff Officiel
            </span>
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-white/10 text-slate-200 border border-white/15">
              Saison Cadets 2026
            </span>
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
              {players.length} Joueurs • {staff.length} Staff
            </span>
          </div>

          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black font-serif tracking-tight text-white uppercase">
            Équipe de l'<span className="text-red-500">{clubInfo.name}</span>
          </h1>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
            Découvrez la Présidence, l'encadrement technique dirigé par Coach Gagne, ainsi que les jeunes talents cadets prêts à hisser haut les couleurs de Touba-Mbacké.
          </p>

          {/* Quick Sub-navigation buttons */}
          <div className="pt-2 flex flex-wrap items-center gap-2.5">
            <button
              onClick={() => setViewTab('all')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                viewTab === 'all'
                  ? 'bg-red-600 text-white shadow-lg'
                  : 'bg-white/10 text-slate-200 hover:bg-white/20'
              }`}
            >
              <span>Vue Complète (Tous)</span>
            </button>

            <button
              onClick={() => setViewTab('staff')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                viewTab === 'staff'
                  ? 'bg-amber-500 text-slate-950 font-black shadow-lg'
                  : 'bg-white/10 text-slate-200 hover:bg-white/20'
              }`}
            >
              <Crown className="w-3.5 h-3.5" />
              <span>Présidence & Staff ({staff.length})</span>
            </button>

            <button
              onClick={() => setViewTab('players')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                viewTab === 'players'
                  ? 'bg-red-600 text-white shadow-lg'
                  : 'bg-white/10 text-slate-200 hover:bg-white/20'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>Joueurs ({players.length})</span>
            </button>

            <button
              onClick={() => setViewTab('tactics')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                viewTab === 'tactics'
                  ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/30'
                  : 'bg-white/10 text-slate-200 hover:bg-white/20'
              }`}
            >
              <Compass className="w-3.5 h-3.5" />
              <span>Schémas Tactiques ({tacticalFormations.length})</span>
            </button>
          </div>
        </div>
      </div>

      {/* ============================================================== */}
      {/* SECTION: LA PRÉSIDENCE (LE PRÉSIDENT OU LA PRÉSIDENTE)         */}
      {/* ============================================================== */}
      {(viewTab === 'all' || viewTab === 'staff') && (
        <div className="bg-gradient-to-br from-slate-950 via-slate-900 to-amber-950/40 rounded-3xl p-6 sm:p-8 border border-amber-500/30 text-white shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col lg:flex-row items-center gap-6 sm:gap-8">
            {/* President Portrait */}
            <div
              onClick={
                isAdminLoggedIn
                  ? () => {
                      setPresName(clubInfo.president || 'El Hadji Ousseynou Fall');
                      setPresTitle(clubInfo.presidentTitle || 'Président');
                      setPresPhotoUrl(clubInfo.presidentPhotoUrl || '');
                      setPresWord(clubInfo.presidentWord || '');
                      setIsPresidentModalOpen(true);
                    }
                  : undefined
              }
              className={`relative w-36 h-36 sm:w-44 sm:h-44 rounded-3xl overflow-hidden border-2 border-amber-400 shadow-2xl flex-shrink-0 group ${
                isAdminLoggedIn ? 'cursor-pointer' : ''
              }`}
              title={isAdminLoggedIn ? "Cliquer pour changer la photo officielle du Président / de la Présidente" : undefined}
            >
              <img
                src={
                  clubInfo.presidentPhotoUrl ||
                  presidentMember.photoUrl ||
                  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80'
                }
                alt={clubInfo.president || presidentMember.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              {isAdminLoggedIn && (
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-1 text-[11px] font-bold text-white p-2 text-center backdrop-blur-xs">
                  <Edit className="w-5 h-5 text-amber-400" />
                  <span>Changer la Photo</span>
                </div>
              )}
              <span className="absolute bottom-2 left-2 right-2 text-center px-2 py-0.5 rounded-lg bg-amber-500 text-slate-950 text-[10px] font-black uppercase tracking-wider shadow">
                {clubInfo.presidentTitle || 'Président'} Officiel
              </span>
            </div>

            {/* President Description & Mot */}
            <div className="space-y-3 flex-1 text-center lg:text-left">
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2">
                <span className="px-3 py-1 rounded-full bg-amber-500 text-slate-950 text-xs font-black uppercase tracking-wider flex items-center gap-1.5 shadow-md">
                  <Crown className="w-3.5 h-3.5" />
                  {clubInfo.presidentTitle || 'Président'} de l'{clubInfo.name}
                </span>
                <span className="text-xs text-amber-300 font-semibold">Direction Générale & Haute Représentation</span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-black text-white font-serif">
                {clubInfo.president || presidentMember.name}
              </h2>

              <p className="text-xs sm:text-sm text-slate-300 italic leading-relaxed bg-white/5 p-4 rounded-2xl border border-white/10 max-w-2xl">
                « {clubInfo.presidentWord || presidentMember.bio || "Le football unit nos cœurs ❤️ • Ensemble pour la jeunesse et la victoire !"} »
              </p>

              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 text-xs text-slate-300 pt-1">
                <span className="flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-amber-400" />
                  <span>{presidentMember.phone || '+221 77 500 12 34'}</span>
                </span>
                <span>•</span>
                <span className="flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-amber-400" />
                  <span>{presidentMember.email || 'presidence@ascdiallore.sn'}</span>
                </span>
              </div>
            </div>

            {/* Admin Edit President Button */}
            {isAdminLoggedIn && (
              <div className="flex-shrink-0">
                <button
                  onClick={() => {
                    setPresName(clubInfo.president || 'El Hadji Ousseynou Fall');
                    setPresTitle(clubInfo.presidentTitle || 'Président');
                    setPresPhotoUrl(clubInfo.presidentPhotoUrl || '');
                    setPresWord(clubInfo.presidentWord || '');
                    setIsPresidentModalOpen(true);
                  }}
                  className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-black flex items-center gap-2 shadow-lg transition"
                >
                  <Edit className="w-4 h-4" />
                  <span>Modifier la Présidence</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* SECTION: LE STAFF TECHNIQUE & DIRECTION                        */}
      {/* ============================================================== */}
      {(viewTab === 'all' || viewTab === 'staff') && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-red-500" />
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white uppercase font-serif">
                  Le Staff Technique & Direction
                </h2>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Encadrement sportif, préparation physique, soins médicaux et bureau exécutif de l'ASC Dialloré.
              </p>
            </div>

            <div className="flex items-center gap-2">
              {/* Category Filter Pills for Staff */}
              <select
                value={staffCategoryFilter}
                onChange={e => setStaffCategoryFilter(e.target.value)}
                className="px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white font-medium outline-none"
              >
                <option value="all">Tous les pôles du staff</option>
                <option value="technical">Pôle Technique & Coachs</option>
                <option value="administration">Pôle Administration & Finances</option>
                <option value="medical">Pôle Médical & Soins</option>
              </select>

              {isAdminLoggedIn && (
                <button
                  onClick={handleOpenAddStaff}
                  className="px-3.5 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold flex items-center gap-1.5 shadow transition flex-shrink-0"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Ajouter au Staff</span>
                </button>
              )}
            </div>
          </div>

          {/* Coach Gagne Spotlight Banner */}
          <div className="relative rounded-3xl overflow-hidden bg-slate-950 border border-slate-800 p-6 sm:p-8 text-white shadow-xl flex flex-col lg:flex-row items-center justify-between gap-6">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 text-center sm:text-left">
              <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden border-2 border-red-500 shadow-md flex-shrink-0">
                <img
                  src={COACH_INFO.photoUrl}
                  alt={COACH_INFO.name}
                  className="w-full h-full object-cover"
                />
                <span className="absolute bottom-0 inset-x-0 bg-red-600 text-white text-[9px] font-black text-center py-0.5 uppercase tracking-wider">
                  Coach en Chef
                </span>
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-center sm:justify-start gap-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-red-500/20 text-red-400 border border-red-500/30 text-xs font-bold">
                    {COACH_INFO.role}
                  </span>
                  <span className="text-xs text-slate-400">{COACH_INFO.flag} {COACH_INFO.nationality}</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-black text-white">
                  {COACH_INFO.name}
                </h3>
                <p className="text-xs text-slate-300 max-w-xl">
                  {COACH_INFO.bio}
                </p>
                <div className="flex items-center justify-center sm:justify-start gap-3 pt-1 text-xs text-amber-400 font-semibold flex-wrap">
                  <span>📋 Dispositif : {COACH_INFO.formation}</span>
                  <span>•</span>
                  <span>🏟️ Terrain : TERIANN ÉCOLE NDIAGALAK</span>
                </div>
              </div>
            </div>

            <div className="w-full lg:w-auto bg-slate-900/80 border border-slate-800 rounded-2xl p-4 space-y-2 text-xs">
              <p className="font-bold text-red-400 uppercase tracking-wider text-[11px]">
                Principes Tactiques de Coach Gagne :
              </p>
              <ul className="space-y-1 text-slate-300 text-[11px]">
                <li className="flex items-center gap-1.5">
                  <span className="text-red-400">▸</span> Charnière axiale de fer (Baye Ablaye & Cheikh Dieng)
                </li>
                <li className="flex items-center gap-1.5">
                  <span className="text-red-400">▸</span> Dédoublements latéraux (Ousmane Kebe & Sidy)
                </li>
                <li className="flex items-center gap-1.5">
                  <span className="text-red-400">▸</span> Maîtrise & pressing au milieu (Baye Saliou, Latif & Alpha)
                </li>
                <li className="flex items-center gap-1.5">
                  <span className="text-red-400">▸</span> Percussion : Pape Modou Cissé, Cheikh Mbaye, Fallou Cissé
                </li>
              </ul>
            </div>
          </div>

          {/* Staff Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredStaff.map(member => {
              const isDeleting = staffDeleteConfirmId === member.id;
              return (
                <div
                  key={member.id}
                  className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
                >
                  <div>
                    <div className="flex items-start gap-4 mb-3">
                      <div
                        onClick={isAdminLoggedIn ? () => handleOpenEditStaff(member) : undefined}
                        className={`relative w-16 h-16 rounded-2xl overflow-hidden border-2 border-slate-200 dark:border-slate-700 shadow-md flex-shrink-0 bg-slate-800 ${
                          isAdminLoggedIn ? 'cursor-pointer group/photo' : ''
                        }`}
                        title={isAdminLoggedIn ? "Cliquer pour modifier la photo et le profil de ce membre" : undefined}
                      >
                        <img
                          src={member.photoUrl}
                          alt={member.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        />
                        {isAdminLoggedIn && (
                          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover/photo:opacity-100 transition-opacity flex items-center justify-center text-white backdrop-blur-xs">
                            <Edit className="w-4 h-4 text-amber-400" />
                          </div>
                        )}
                      </div>

                      <div className="min-w-0 flex-1">
                        <span
                          className={`inline-block px-2 py-0.5 rounded-md text-[10px] uppercase tracking-wider border mb-1 ${getStaffCategoryBadge(
                            member.category
                          )}`}
                        >
                          {getStaffCategoryLabel(member.category)}
                        </span>
                        <h4 className="text-sm sm:text-base font-black text-slate-900 dark:text-white truncate">
                          {member.name}
                        </h4>
                        <p className="text-xs font-bold text-red-600 dark:text-red-400 truncate">
                          {member.title}
                        </p>
                        {member.diploma && (
                          <span className="inline-block mt-1 px-1.5 py-0.2 rounded text-[10px] bg-amber-500/10 text-amber-600 dark:text-amber-400 font-semibold border border-amber-500/20">
                            {member.diploma}
                          </span>
                        )}
                      </div>
                    </div>

                    <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2 my-2 bg-slate-50 dark:bg-slate-800/40 p-2.5 rounded-xl">
                      {member.bio || member.role}
                    </p>

                    <div className="space-y-1 text-xs text-slate-500 dark:text-slate-400 pt-1">
                      {member.phone && (
                        <div className="flex items-center gap-1.5">
                          <Phone className="w-3 h-3 text-emerald-500" />
                          <span className="font-mono">{member.phone}</span>
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

                  {/* Admin Edit & Delete buttons */}
                  {isAdminLoggedIn && (
                    <div className="pt-3 mt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
                      <button
                        onClick={() => handleOpenEditStaff(member)}
                        className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 text-xs font-bold flex items-center gap-1.5 transition"
                      >
                        <Edit className="w-3.5 h-3.5 text-blue-500" />
                        <span>Modifier</span>
                      </button>

                      {isDeleting ? (
                        <div className="flex items-center gap-1 bg-red-950/80 p-1 rounded-xl border border-red-500">
                          <button
                            onClick={() => {
                              deleteStaffMember(member.id);
                              setStaffDeleteConfirmId(null);
                            }}
                            className="px-2 py-1 rounded-lg bg-red-600 hover:bg-red-500 text-white text-[11px] font-bold"
                          >
                            Confirmer ?
                          </button>
                          <button
                            onClick={() => setStaffDeleteConfirmId(null)}
                            className="p-1 rounded-lg bg-slate-800 text-slate-300 text-xs"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setStaffDeleteConfirmId(member.id)}
                          className="px-3 py-1.5 rounded-xl bg-red-500/10 hover:bg-red-600 hover:text-white text-red-600 dark:text-red-400 text-xs font-bold flex items-center gap-1.5 transition"
                          title="Supprimer du staff (Admin)"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Supprimer</span>
                        </button>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* SECTION: L'EFFECTIF DES JOUEURS (CADETS 2026)                   */}
      {/* ============================================================== */}
      {(viewTab === 'all' || viewTab === 'players') && (
        <div className="space-y-6 pt-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-red-500" />
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white uppercase font-serif">
                  Effectif des Joueurs (Cadets 2026)
                </h2>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                La génération montante de l'ASC Dialloré disputant le Championnat ONGAM/Cadets.
              </p>
            </div>

            <span className="px-3 py-1 rounded-full text-xs font-bold bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20 self-start sm:self-auto">
              {filteredPlayers.length} Joueurs affichés
            </span>
          </div>

          {/* Filter & Search Bar */}
          <div className="space-y-4">
            {/* Main Category Filter Pills */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
              {mainCategories.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => {
                    setPositionFilter(cat.id);
                    setRoleFilter('all');
                  }}
                  className={`px-4 py-2.5 rounded-2xl text-xs font-bold whitespace-nowrap transition flex items-center gap-2 ${
                    positionFilter === cat.id
                      ? 'bg-red-600 text-white shadow-md'
                      : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <span>{cat.label}</span>
                  <span
                    className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                      positionFilter === cat.id
                        ? 'bg-white/30 text-white'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                    }`}
                  >
                    {cat.count}
                  </span>
                </button>
              ))}
            </div>

            {/* Specific Roles Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
              <span className="text-[11px] font-bold text-slate-400 flex items-center gap-1 px-2 whitespace-nowrap">
                <Compass className="w-3.5 h-3.5 text-red-500" />
                Poste précis :
              </span>
              {specificRoles.map(r => (
                <button
                  key={r.id}
                  onClick={() => setRoleFilter(r.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition ${
                    roleFilter === r.id
                      ? 'bg-amber-500 text-slate-950 shadow-md font-black'
                      : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800 hover:bg-slate-100'
                  }`}
                >
                  {r.tag !== 'ALL' && <span className="font-mono mr-1">[{r.tag}]</span>}
                  {r.label}
                </button>
              ))}
            </div>

            {/* Search Input */}
            <div className="relative">
              <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Rechercher par nom (Pape Modou, Cheikh...), numéro de maillot (#10) ou poste..."
                className="w-full pl-11 pr-4 py-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs sm:text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-red-500 outline-none shadow-sm"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* Players Grid */}
          {filteredPlayers.length === 0 ? (
            <div className="p-12 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-red-500/10 text-red-500 flex items-center justify-center mx-auto">
                <Users className="w-8 h-8" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Aucun joueur ne correspond aux filtres
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
                Essayez d'ajuster les filtres de poste ou de réinitialiser la barre de recherche.
              </p>
              <button
                onClick={() => {
                  setPositionFilter('all');
                  setRoleFilter('all');
                  setSearchQuery('');
                }}
                className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-bold hover:bg-slate-200 transition"
              >
                Réinitialiser la sélection
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredPlayers.map(player => {
                const roleTag = getPlayerRoleTag(player);
                const badgeStyle = getRoleBadgeStyle(roleTag);

                return (
                  <div
                    key={player.id}
                    onClick={() => setSelectedPlayerId(player.id)}
                    className="group bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm hover:shadow-2xl hover:border-red-500/50 transition-all duration-300 cursor-pointer flex flex-col justify-between"
                  >
                    {/* Photo Top Container */}
                    <div className="relative aspect-[4/5] bg-gradient-to-b from-slate-800 to-slate-950 overflow-hidden">
                      <img
                        src={player.photoUrl}
                        alt={player.name}
                        className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                      />

                      {/* Number Badge & Captain Badge */}
                      <div className="absolute top-3 right-3 flex flex-col items-end gap-1.5">
                        <div className="w-10 h-10 rounded-2xl bg-slate-950/80 backdrop-blur-md border border-amber-500/50 flex items-center justify-center font-mono text-base font-black text-amber-400 shadow-md">
                          #{player.number}
                        </div>
                        {player.isCaptain && (
                          <span className="px-2 py-0.5 rounded-full bg-amber-500 text-slate-950 text-[9px] font-black uppercase tracking-wider shadow-lg border border-amber-300">
                            👑 Capitaine
                          </span>
                        )}
                        {player.isTopScorer && (
                          <span className="px-2 py-0.5 rounded-full bg-red-600 text-white text-[9px] font-black uppercase tracking-wider shadow-lg border border-red-400">
                            ⚽ Buteur N°1
                          </span>
                        )}
                      </div>

                      {/* Role Pill & Nationality */}
                      <div className="absolute bottom-3 left-3 flex flex-wrap items-center gap-1.5">
                        <span className={`px-2.5 py-1 rounded-lg text-[11px] font-black tracking-wide border shadow-md ${badgeStyle}`}>
                          {roleTag} • {player.position}
                        </span>
                        <span className="px-2 py-0.5 rounded-lg bg-slate-950/80 backdrop-blur-md text-white text-xs font-semibold flex items-center gap-1 shadow">
                          <span>{getPlayerFlag(player)}</span>
                        </span>
                      </div>
                    </div>

                    {/* Body Info */}
                    <div className="p-4 sm:p-5 space-y-3">
                      <div>
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] font-bold text-red-600 dark:text-red-400 uppercase tracking-wider">
                            {roleTag} • {player.positionDetail?.split('•')[0]?.trim()}
                          </span>
                          <span className="text-[11px] text-slate-400 font-mono">
                            #{player.number}
                          </span>
                        </div>

                        <h3 className="text-base font-extrabold text-slate-900 dark:text-white group-hover:text-red-500 transition mt-0.5">
                          {getPlayerFullName(player)}
                        </h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          {player.age} ans • {player.height} • {player.preferredFoot}
                        </p>
                      </div>

                      {/* Quick Key Stats Bar */}
                      <div className="grid grid-cols-3 gap-1.5 p-2 rounded-2xl bg-slate-50 dark:bg-slate-800/60 text-center text-xs">
                        <div>
                          <span className="text-[10px] text-slate-400 block">Matchs</span>
                          <span className="font-bold text-slate-900 dark:text-white font-mono">{getPlayerStats(player).matches}</span>
                        </div>
                        <div>
                          <span className="text-[10px] text-slate-400 block">Buts</span>
                          <span className="font-bold text-red-500 font-mono">{getPlayerStats(player).goals}</span>
                        </div>
                        <div>
                          <span className="text-[10px] text-slate-400 block">Passes</span>
                          <span className="font-bold text-blue-500 font-mono">{getPlayerStats(player).assists}</span>
                        </div>
                      </div>

                      <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-red-500 dark:text-red-400 font-bold">
                        <span>Fiche & Attributs</span>
                        <span>→</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ============================================================== */}
      {/* SECTION: SCHÉMAS TACTIQUES & FORMATIONS DE COACH GAGNE        */}
      {/* ============================================================== */}
      {(viewTab === 'all' || viewTab === 'tactics') && (
        <div className="space-y-6">
          {/* Header Bar */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-full text-xs font-black bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 uppercase tracking-wider flex items-center gap-1.5">
                  <Compass className="w-3.5 h-3.5" />
                  Tactique & Dispositifs
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 text-xs font-bold">
                  {tacticalFormations.length} Schémas enregistrés
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                Dispositifs Tactiques de l'Équipe
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                Placement officiel des 11 titulaires et principes de jeu définis par Coach Gagne pour la saison.
              </p>
            </div>

            {isAdminLoggedIn && (
              <button
                type="button"
                onClick={() => setActiveTab('admin')}
                className="px-4 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black flex items-center gap-2 shadow-lg shadow-emerald-600/30 transition cursor-pointer"
              >
                <Edit className="w-4 h-4" />
                <span>Gérer les Schémas (Admin)</span>
              </button>
            )}
          </div>

          {/* Formations Selector Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
            {tacticalFormations.map(formation => {
              const isActive = formation.id === activeFormationId;
              return (
                <button
                  key={formation.id}
                  type="button"
                  onClick={() => setActiveFormationId(formation.id)}
                  className={`px-4 py-3 rounded-2xl text-xs font-black whitespace-nowrap transition flex items-center gap-2 cursor-pointer ${
                    isActive
                      ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/30'
                      : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <span className="font-mono text-sm px-1.5 py-0.5 rounded-lg bg-black/20">
                    {formation.system}
                  </span>
                  <span>{formation.name}</span>
                  {formation.isDefault && (
                    <span className="px-2 py-0.5 rounded-full bg-amber-400 text-slate-950 text-[10px] font-black">
                      Titulaire
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Selected Formation Details & Tactical Pitch */}
          {(() => {
            const formation =
              tacticalFormations.find(f => f.id === activeFormationId) ||
              tacticalFormations[0];
            if (!formation) return null;

            return (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Left Column: Interactive Pitch */}
                <div className="lg:col-span-7 bg-slate-950 rounded-3xl p-5 sm:p-6 border border-slate-800 shadow-2xl space-y-4">
                  <div className="flex items-center justify-between text-white border-b border-slate-800 pb-3">
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full bg-emerald-400 animate-pulse" />
                      <span className="text-xs font-black uppercase tracking-wider text-emerald-400">
                        Terrain Tactique • {formation.system}
                      </span>
                    </div>
                    <span className="text-[11px] font-mono text-slate-400">
                      Dispositif de Match Officiel
                    </span>
                  </div>

                  {/* 2D Football Pitch */}
                  <div className="relative aspect-[3/4] sm:aspect-[4/5] w-full rounded-2xl overflow-hidden border-2 border-emerald-500/40 bg-gradient-to-b from-emerald-800 via-emerald-700 to-emerald-900 shadow-inner select-none">
                    {/* Pitch Turf Stripes */}
                    <div className="absolute inset-0 opacity-15 pointer-events-none flex flex-col">
                      {Array.from({ length: 10 }).map((_, i) => (
                        <div
                          key={i}
                          className={`flex-1 ${i % 2 === 0 ? 'bg-black' : 'bg-transparent'}`}
                        />
                      ))}
                    </div>

                    {/* Pitch Lines */}
                    <div className="absolute inset-3 border-2 border-white/60 rounded-lg pointer-events-none">
                      {/* Center line */}
                      <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-white/60 -translate-y-1/2" />
                      {/* Center circle */}
                      <div className="absolute top-1/2 left-1/2 w-28 h-28 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white/60" />
                      {/* Center dot */}
                      <div className="absolute top-1/2 left-1/2 w-2 h-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/80" />
                      {/* Top Penalty Area (Opponent) */}
                      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-44 h-24 border-2 border-t-0 border-white/60" />
                      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-20 h-10 border-2 border-t-0 border-white/60" />
                      {/* Bottom Penalty Area (Our Goal) */}
                      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-44 h-24 border-2 border-b-0 border-white/60" />
                      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-20 h-10 border-2 border-b-0 border-white/60" />
                      {/* Penalty Dot Bottom */}
                      <div className="absolute bottom-16 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-white/80" />
                    </div>

                    {/* Starters markers */}
                    {formation.starters.map(st => {
                      const isCaptain = st.playerNumber === 10 || st.label.toLowerCase().includes('capitaine');
                      const isGk = st.role === 'GK';

                      return (
                        <div
                          key={st.id}
                          style={{
                            left: `${st.x}%`,
                            top: `${100 - st.y}%`,
                          }}
                          className="absolute -translate-x-1/2 -translate-y-1/2 z-10 flex flex-col items-center group cursor-pointer"
                          onClick={() => {
                            if (st.playerId) setSelectedPlayerId(st.playerId);
                          }}
                        >
                          {/* Jersey Circle */}
                          <div
                            className={`w-9 h-9 sm:w-11 sm:h-11 rounded-full flex items-center justify-center font-black text-xs sm:text-sm shadow-xl border-2 transition-transform duration-200 group-hover:scale-110 ${
                              isGk
                                ? 'bg-amber-400 text-slate-950 border-amber-200 ring-2 ring-amber-500/40'
                                : 'bg-red-600 text-white border-white ring-2 ring-red-500/40'
                            }`}
                          >
                            #{st.playerNumber}
                          </div>

                          {/* Player Name Pill */}
                          <div className="mt-1 px-2 py-0.5 rounded-md bg-slate-950/85 backdrop-blur-md text-white text-[10px] sm:text-[11px] font-bold shadow-md whitespace-nowrap border border-white/10 group-hover:border-amber-400 transition-colors flex items-center gap-1">
                            {isCaptain && <span>👑</span>}
                            <span>{st.playerName}</span>
                          </div>

                          {/* Role Tag */}
                          <span className="text-[9px] font-black text-emerald-300 uppercase tracking-wider drop-shadow">
                            {st.role}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Right Column: Tactics Card & Instructions */}
                <div className="lg:col-span-5 space-y-4">
                  <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
                    <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                      <div>
                        <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                          Système Tactique
                        </span>
                        <h3 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
                          <span>{formation.name}</span>
                        </h3>
                      </div>
                      <span className="px-3 py-1 rounded-xl bg-emerald-500/10 text-emerald-500 font-mono text-sm font-black border border-emerald-500/20">
                        {formation.system}
                      </span>
                    </div>

                    <div>
                      <span className="text-xs font-bold text-slate-400 block mb-1">
                        Dispositif & Style de Jeu
                      </span>
                      <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                        {formation.description}
                      </p>
                    </div>

                    {formation.coachNotes && (
                      <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 space-y-1">
                        <span className="text-[11px] font-black text-amber-500 uppercase tracking-wider flex items-center gap-1.5">
                          <Crown className="w-3.5 h-3.5" />
                          Consignes de Coach Gagne
                        </span>
                        <p className="text-xs text-slate-700 dark:text-slate-300 italic leading-relaxed">
                          « {formation.coachNotes} »
                        </p>
                      </div>
                    )}

                    {formation.keyPrinciples && formation.keyPrinciples.length > 0 && (
                      <div className="space-y-2">
                        <span className="text-xs font-bold text-slate-400 block">
                          Principes Clés sur le Terrain
                        </span>
                        <ul className="space-y-1.5">
                          {formation.keyPrinciples.map((principle, idx) => (
                            <li
                              key={idx}
                              className="text-xs text-slate-700 dark:text-slate-300 flex items-start gap-2"
                            >
                              <span className="text-emerald-500 font-bold mt-0.5">✓</span>
                              <span>{principle}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                      <span className="text-[11px] font-bold text-slate-400 block mb-2">
                        11 Titulaires Alignés :
                      </span>
                      <div className="grid grid-cols-2 gap-1.5 max-h-56 overflow-y-auto pr-1">
                        {formation.starters.map(st => (
                          <div
                            key={st.id}
                            onClick={() => {
                              if (st.playerId) setSelectedPlayerId(st.playerId);
                            }}
                            className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs hover:border-emerald-500/40 cursor-pointer transition"
                          >
                            <div className="flex items-center gap-1.5 min-w-0">
                              <span className="font-mono font-bold text-red-500 text-[11px]">
                                #{st.playerNumber}
                              </span>
                              <span className="font-bold text-slate-800 dark:text-slate-200 truncate text-[11px]">
                                {st.playerName}
                              </span>
                            </div>
                            <span className="px-1.5 py-0.5 rounded text-[9px] font-black bg-emerald-500/10 text-emerald-500">
                              {st.role}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })()}
        </div>
      )}
      {/* ============================================================== */}
      {isStaffModalOpen && isAdminLoggedIn && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
          <div className="relative max-w-lg w-full bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-2xl my-8 space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-2xl bg-red-500/10 text-red-500 flex items-center justify-center">
                  <Briefcase className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900 dark:text-white">
                    {editingStaff ? 'Modifier le membre du staff' : 'Ajouter un membre au staff'}
                  </h3>
                  <p className="text-xs text-slate-400">Direction et encadrement technique</p>
                </div>
              </div>
              <button
                onClick={() => setIsStaffModalOpen(false)}
                className="p-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-400"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveStaff} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Nom & Prénom *
                </label>
                <input
                  type="text"
                  required
                  value={sName}
                  onChange={e => setSName(e.target.value)}
                  placeholder="Ex: Cheikh Tidiane Diop"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Titre officiel *
                  </label>
                  <input
                    type="text"
                    required
                    value={sTitle}
                    onChange={e => setSTitle(e.target.value)}
                    placeholder="Ex: Entraîneur Adjoint"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Pôle / Catégorie *
                  </label>
                  <select
                    value={sCategory}
                    onChange={e => setSCategory(e.target.value as StaffMember['category'])}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs outline-none"
                  >
                    <option value="technical">Technique & Coachs</option>
                    <option value="administration">Direction & Administration</option>
                    <option value="medical">Médical & Kiné</option>
                  </select>
                </div>
              </div>

              {/* Photo Upload & Presets */}
              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-2.5">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                  Photo Officielle du Staff
                </label>
                <div className="flex items-center gap-3">
                  <div className="w-14 h-14 rounded-2xl overflow-hidden border-2 border-emerald-500 shadow flex-shrink-0 bg-slate-800">
                    <img
                      src={sPhotoUrl || staffPresets[0].url}
                      alt="Aperçu Staff"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 space-y-1">
                    <label className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer shadow">
                      <Upload className="w-3.5 h-3.5" />
                      <span>Téléverser Photo</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleStaffPhotoUpload}
                      />
                    </label>
                    <input
                      type="text"
                      value={sPhotoUrl}
                      onChange={e => setSPhotoUrl(e.target.value)}
                      placeholder="Ou coller une URL d'image..."
                      className="w-full px-3 py-1 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-[11px] font-mono outline-none"
                    />
                  </div>
                </div>

                {/* Presets */}
                <div>
                  <span className="text-[10px] font-bold text-slate-400 block mb-1">Portraits recommandés :</span>
                  <div className="grid grid-cols-4 gap-1.5">
                    {staffPresets.map((preset, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setSPhotoUrl(preset.url)}
                        className={`p-0.5 rounded-xl border-2 transition overflow-hidden ${
                          sPhotoUrl === preset.url
                            ? 'border-emerald-500 ring-2 ring-emerald-500/30'
                            : 'border-transparent hover:border-slate-400'
                        }`}
                        title={preset.label}
                      >
                        <img src={preset.url} alt={preset.label} className="w-full h-9 object-cover rounded-lg" />
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Diplôme & Statut */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Diplôme / Titre officiel
                  </label>
                  <input
                    type="text"
                    value={sDiploma}
                    onChange={e => setSDiploma(e.target.value)}
                    placeholder="Ex: Licence B CAF, Médecin du Sport"
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Statut du membre
                  </label>
                  <select
                    value={sStatus}
                    onChange={e => setSStatus(e.target.value as StaffMember['status'])}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs outline-none"
                  >
                    <option value="Actif">Actif</option>
                    <option value="En mission">En mission</option>
                    <option value="Honoraire">Honoraire</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Téléphone
                  </label>
                  <input
                    type="text"
                    value={sPhone}
                    onChange={e => setSPhone(e.target.value)}
                    placeholder="+221 77 000 00 00"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-mono outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    value={sEmail}
                    onChange={e => setSEmail(e.target.value)}
                    placeholder="staff@ascdiallore.sn"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Bio / Responsabilités
                </label>
                <textarea
                  rows={2}
                  value={sBio}
                  onChange={e => setSBio(e.target.value)}
                  placeholder="Missions, schémas de jeu ou encadrement spécifique..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs outline-none resize-none"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsStaffModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-bold"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-red-600 text-white text-xs font-black uppercase tracking-wider"
                >
                  {editingStaff ? 'Enregistrer' : 'Ajouter au Staff'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MODAL: ADMIN EDIT PRESIDENT / PRÉSIDENTE                       */}
      {/* ============================================================== */}
      {isPresidentModalOpen && isAdminLoggedIn && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
          <div className="relative max-w-lg w-full bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-2xl my-8 space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center">
                  <Crown className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900 dark:text-white">
                    Gestion de la Présidence Officielle
                  </h3>
                  <p className="text-xs text-slate-400">Président ou Présidente de l'ASC Dialloré</p>
                </div>
              </div>
              <button
                onClick={() => setIsPresidentModalOpen(false)}
                className="p-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-400"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSavePresident} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Titre officiel *
                  </label>
                  <select
                    value={presTitle}
                    onChange={e => setPresTitle(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-bold outline-none"
                  >
                    <option value="Président">Président</option>
                    <option value="Présidente">Présidente</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Nom complet de la Présidence *
                  </label>
                  <input
                    type="text"
                    required
                    value={presName}
                    onChange={e => setPresName(e.target.value)}
                    placeholder="Ex: El Hadji Ousseynou Fall"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs outline-none font-bold"
                  />
                </div>
              </div>

              {/* Photo Upload & Presets */}
              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-2.5">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                  Photo officielle du Président / de la Présidente
                </label>
                <div className="flex items-center gap-3">
                  <div className="w-16 h-16 rounded-2xl overflow-hidden border-2 border-amber-400 shadow flex-shrink-0 bg-slate-800">
                    <img
                      src={presPhotoUrl || presidentPresets[0].url}
                      alt="Présidence"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 space-y-1">
                    <label className="px-3.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-black inline-flex items-center gap-1.5 cursor-pointer shadow">
                      <Upload className="w-3.5 h-3.5" />
                      <span>Téléverser Photo</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handlePresidentPhotoUpload}
                      />
                    </label>
                    <input
                      type="text"
                      value={presPhotoUrl}
                      onChange={e => setPresPhotoUrl(e.target.value)}
                      placeholder="Ou coller une URL d'image..."
                      className="w-full px-3 py-1 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-[11px] font-mono outline-none"
                    />
                  </div>
                </div>

                {/* Presets Homme & Femme */}
                <div>
                  <span className="text-[10px] font-bold text-slate-400 block mb-1">Portraits recommandés (Homme / Femme) :</span>
                  <div className="grid grid-cols-4 gap-1.5">
                    {presidentPresets.map((preset, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => {
                          setPresPhotoUrl(preset.url);
                          if (preset.label.includes('Femme')) {
                            setPresTitle('Présidente');
                          } else {
                            setPresTitle('Président');
                          }
                        }}
                        className={`p-0.5 rounded-xl border-2 transition overflow-hidden ${
                          presPhotoUrl === preset.url
                            ? 'border-amber-500 ring-2 ring-amber-500/30'
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

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Mot officiel de la Présidence
                </label>
                <textarea
                  rows={3}
                  value={presWord}
                  onChange={e => setPresWord(e.target.value)}
                  placeholder="Message aux supporters, adhérents et jeunes joueurs..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs outline-none resize-none"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsPresidentModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-bold"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-black uppercase tracking-wider"
                >
                  Enregistrer les modifications
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
