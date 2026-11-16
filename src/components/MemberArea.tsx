import React, { useState } from 'react';
import {
  ShieldCheck,
  KeyRound,
  Clock,
  MapPin,
  Calendar,
  Cloud,
  RefreshCw,
  LogOut,
  ChevronRight,
  Sparkles,
  Users,
  Search,
  Plus,
  Trash2,
  Edit,
  Phone,
  Mail,
  UserCheck,
  X,
  Lock,
  ExternalLink,
  CheckCircle2,
  Filter,
  CheckSquare,
  Square,
  FileSpreadsheet,
  AlertTriangle,
  Upload,
  Camera,
  User,
  Eye,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { ClubMember } from '../types';
import { getAccentStyles } from '../utils/theme';
import { AdminQuickLoginModal } from './AdminQuickLoginModal';

export const MemberArea: React.FC = () => {
  const {
    members,
    addMember,
    addMultipleMembers,
    updateMember,
    deleteMember,
    deleteMultipleMembers,
    isAdminLoggedIn,
    member,
    isLoggedIn,
    logoutMember,
    loginMember,
    toggle2FAEnabled,
    setIs2FAModalOpen,
    cloudSync,
    triggerCloudSync,
    themeAccent,
    t,
    showToast,
    clubInfo,
    setActiveTab,
  } = useApp();

  const accent = getAccentStyles(themeAccent);

  // Main Tabs: 'list' (Annuaire complet des membres), 'security' (Sécurité & 2FA)
  const [activeTabState, setActiveTabState] = useState<'list' | 'security'>('list');

  // Search & Filter state for members list
  const [searchQuery, setSearchQuery] = useState('');
  const [tierFilter, setTierFilter] = useState<string>('all');
  const [cityFilter, setCityFilter] = useState<string>('all');

  // Multi-selection state for batch deletion
  const [selectedMemberIds, setSelectedMemberIds] = useState<string[]>([]);
  const [isBulkDeleteModalOpen, setIsBulkDeleteModalOpen] = useState(false);

  // Viewing Member Profile Modal State
  const [viewingMember, setViewingMember] = useState<ClubMember | null>(null);

  // Admin Quick Login Modal
  const [isAdminLoginModalOpen, setIsAdminLoginModalOpen] = useState(false);

  // Admin Add / Edit Member Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [addMode, setAddMode] = useState<'single' | 'batch'>('single');
  const [editingMember, setEditingMember] = useState<ClubMember | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Single Member Form Fields
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [membershipNumber, setMembershipNumber] = useState('');
  const [tier, setTier] = useState<ClubMember['tier']>('Adhérent');
  const [city, setCity] = useState('Mbacké & Touba');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [status, setStatus] = useState<ClubMember['status']>('Actif');
  const [joinedDate, setJoinedDate] = useState('');
  const [notes, setNotes] = useState('');

  // Batch Members Form State
  interface BatchMemberRow {
    fullName: string;
    tier: ClubMember['tier'];
    city: string;
    phone: string;
    email: string;
  }

  const [batchRows, setBatchRows] = useState<BatchMemberRow[]>([
    { fullName: '', tier: 'Adhérent', city: 'Touba & Mbacké', phone: '', email: '' },
    { fullName: '', tier: 'Supporter', city: 'Mbacké', phone: '', email: '' },
  ]);
  const [batchPasteText, setBatchPasteText] = useState('');
  const [batchInputType, setBatchInputType] = useState<'table' | 'paste'>('table');

  // Sample preset avatars for convenient selection
  const presetAvatars = [
    { label: 'Homme 1', url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80' },
    { label: 'Femme 1', url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80' },
    { label: 'Homme 2', url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80' },
    { label: 'Femme 2', url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80' },
    { label: 'Homme 3', url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=300&q=80' },
    { label: 'VIP', url: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=300&q=80' },
  ];

  const resetForm = () => {
    setFullName('');
    setEmail('');
    setPhone('');
    setMembershipNumber(`DIA-MBK-0${members.length + 1}`);
    setTier('Adhérent');
    setCity('Mbacké & Touba');
    setAvatarUrl(presetAvatars[0].url);
    setStatus('Actif');
    setJoinedDate(new Date().toLocaleDateString('fr-FR'));
    setNotes('');
    setEditingMember(null);
    setAddMode('single');
    setBatchRows([
      { fullName: '', tier: 'Adhérent', city: 'Touba & Mbacké', phone: '', email: '' },
      { fullName: '', tier: 'Supporter', city: 'Mbacké', phone: '', email: '' },
    ]);
    setBatchPasteText('');
  };

  const handleOpenAddModal = (mode: 'single' | 'batch' = 'single') => {
    resetForm();
    setAddMode(mode);
    setIsModalOpen(true);
  };

  // Open Edit Modal for a specific member
  const handleOpenEditModal = (m: ClubMember, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setViewingMember(null);
    setEditingMember(m);
    setAddMode('single');
    setFullName(m.fullName);
    setEmail(m.email || '');
    setPhone(m.phone || '');
    setMembershipNumber(m.membershipNumber);
    setTier(m.tier);
    setCity(m.city);
    setAvatarUrl(m.avatarUrl || presetAvatars[0].url);
    setStatus(m.status);
    setJoinedDate(m.joinedDate || new Date().toLocaleDateString('fr-FR'));
    setNotes(m.notes || '');
    setIsModalOpen(true);
  };

  // Avatar file upload from device
  const handleAvatarFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        showToast('Fichier trop volumineux', 'Veuillez choisir une image inférieure à 5 Mo.', 'alert');
        return;
      }
      const reader = new FileReader();
      reader.onload = ev => {
        if (ev.target?.result) {
          setAvatarUrl(ev.target.result as string);
          showToast('Photo chargée', 'La photo de profil a été mise à jour.', 'success');
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Add a row to batch table
  const addBatchRow = () => {
    setBatchRows([
      ...batchRows,
      { fullName: '', tier: 'Adhérent', city: 'Touba & Mbacké', phone: '', email: '' },
    ]);
  };

  const removeBatchRow = (index: number) => {
    if (batchRows.length <= 1) return;
    setBatchRows(batchRows.filter((_, i) => i !== index));
  };

  const updateBatchRow = (index: number, field: keyof BatchMemberRow, value: string) => {
    const updated = [...batchRows];
    updated[index] = { ...updated[index], [field]: value };
    setBatchRows(updated);
  };

  // Parse pasted lines: e.g. "Nom, Ville, Catégorie, Téléphone"
  const parseBatchPastedText = () => {
    const lines = batchPasteText
      .split('\n')
      .map(l => l.trim())
      .filter(l => l.length > 0);

    const parsed: BatchMemberRow[] = lines.map(line => {
      const parts = line.split(/[,;\t]/).map(p => p.trim());
      const name = parts[0] || '';
      const cityVal = parts[1] || 'Touba & Mbacké';
      let tierVal: ClubMember['tier'] = 'Adhérent';
      if (parts[2]) {
        const tLower = parts[2].toLowerCase();
        if (tLower.includes('vip') || tLower.includes('gold')) tierVal = 'Gold VIP';
        else if (tLower.includes('honneur')) tierVal = 'Membre d’Honneur';
        else if (tLower.includes('socio')) tierVal = 'Socio';
        else if (tLower.includes('supporter')) tierVal = 'Supporter';
      }
      const phoneVal = parts[3] || '';
      const emailVal = parts[4] || '';
      return { fullName: name, city: cityVal, tier: tierVal, phone: phoneVal, email: emailVal };
    });

    if (parsed.length > 0) {
      setBatchRows(parsed);
      setBatchInputType('table');
      showToast('Lignes importées', `${parsed.length} membres prêts à être enregistrés.`, 'success');
    }
  };

  const handleSaveMember = (e: React.FormEvent) => {
    e.preventDefault();

    // Mode Batch : Ajout de plusieurs membres
    if (addMode === 'batch') {
      const validRows = batchRows.filter(r => r.fullName.trim().length > 0);
      if (validRows.length === 0) {
        showToast('Aucun nom saisi', 'Veuillez saisir au moins un nom de membre dans la liste.', 'alert');
        return;
      }

      const newMembersList: ClubMember[] = validRows.map((r, idx) => {
        const randAvatar = presetAvatars[idx % presetAvatars.length].url;
        return {
          id: `mem-${Date.now()}-${idx}`,
          fullName: r.fullName.trim(),
          email: r.email.trim() || undefined,
          phone: r.phone.trim() || undefined,
          membershipNumber: `DIA-MBK-${(members.length + idx + 1).toString().padStart(3, '0')}`,
          tier: r.tier,
          city: r.city.trim() || 'Touba & Mbacké',
          avatarUrl: randAvatar,
          status: 'Actif',
          joinedDate: new Date().toLocaleDateString('fr-FR'),
        };
      });

      addMultipleMembers(newMembersList);
      setIsModalOpen(false);
      resetForm();
      return;
    }

    // Mode Single : Ajout ou modification du profil d'un membre
    if (!fullName.trim()) {
      showToast('Nom requis', 'Veuillez saisir le nom complet du membre.', 'alert');
      return;
    }

    if (editingMember) {
      const updatedFields: Partial<ClubMember> = {
        fullName: fullName.trim(),
        email: email.trim() || undefined,
        phone: phone.trim() || undefined,
        membershipNumber: membershipNumber.trim() || editingMember.membershipNumber,
        tier,
        city: city.trim(),
        avatarUrl: avatarUrl.trim() || editingMember.avatarUrl,
        status,
        joinedDate: joinedDate.trim() || editingMember.joinedDate,
        notes: notes.trim() || undefined,
      };

      updateMember(editingMember.id, updatedFields);

      // If this member was open in viewingMember modal, update it in real-time
      if (viewingMember && viewingMember.id === editingMember.id) {
        setViewingMember({
          ...viewingMember,
          ...updatedFields,
        });
      }

      setIsModalOpen(false);
      resetForm();
      showToast('Profil modifié', `Le profil de ${fullName.trim()} a été mis à jour avec succès.`, 'success');
      return;
    } else {
      const newMember: ClubMember = {
        id: `mem-${Date.now()}`,
        fullName: fullName.trim(),
        email: email.trim() || undefined,
        phone: phone.trim() || undefined,
        membershipNumber: membershipNumber.trim() || `DIA-MBK-${(members.length + 1).toString().padStart(3, '0')}`,
        tier,
        city: city.trim() || 'Touba & Mbacké',
        avatarUrl:
          avatarUrl.trim() ||
          presetAvatars[Math.floor(Math.random() * presetAvatars.length)].url,
        status,
        joinedDate: joinedDate.trim() || new Date().toLocaleDateString('fr-FR'),
        notes: notes.trim() || undefined,
      };

      addMember(newMember);
      setIsModalOpen(false);
      resetForm();
    }
  };

  const handleDeleteMember = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    deleteMember(id);
    setSelectedMemberIds(prev => prev.filter(item => item !== id));
    if (viewingMember?.id === id) {
      setViewingMember(null);
    }
    setDeleteConfirmId(null);
  };

  // Toggle selection for bulk actions
  const toggleSelectMember = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setSelectedMemberIds(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedMemberIds.length === filteredMembers.length) {
      setSelectedMemberIds([]);
    } else {
      setSelectedMemberIds(filteredMembers.map(m => m.id));
    }
  };

  const handleConfirmBulkDelete = () => {
    if (selectedMemberIds.length === 0) return;
    deleteMultipleMembers(selectedMemberIds);
    if (viewingMember && selectedMemberIds.includes(viewingMember.id)) {
      setViewingMember(null);
    }
    setSelectedMemberIds([]);
    setIsBulkDeleteModalOpen(false);
  };

  // Filtered members list
  const filteredMembers = members.filter(m => {
    const matchesTier = tierFilter === 'all' || m.tier === tierFilter;
    const matchesCity = cityFilter === 'all' || m.city.toLowerCase().includes(cityFilter.toLowerCase());
    const query = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !query ||
      m.fullName.toLowerCase().includes(query) ||
      m.membershipNumber.toLowerCase().includes(query) ||
      (m.email && m.email.toLowerCase().includes(query)) ||
      (m.phone && m.phone.toLowerCase().includes(query)) ||
      m.city.toLowerCase().includes(query);
    return matchesTier && matchesCity && matchesSearch;
  });

  const getTierBadgeStyle = (memberTier: ClubMember['tier']) => {
    switch (memberTier) {
      case 'Gold VIP':
        return 'bg-amber-500 text-slate-950 font-black border-amber-300';
      case 'Membre d’Honneur':
        return 'bg-purple-600 text-white font-bold border-purple-400/40';
      case 'Socio':
        return 'bg-blue-600 text-white font-bold border-blue-400/40';
      case 'Adhérent':
        return 'bg-emerald-600 text-white font-bold border-emerald-400/40';
      case 'Supporter':
      default:
        return 'bg-slate-700 text-white border-slate-600';
    }
  };

  const getStatusBadgeStyle = (status: ClubMember['status']) => {
    switch (status) {
      case 'Actif':
        return 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30';
      case 'En attente':
        return 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30';
      case 'Suspendu':
        return 'bg-rose-500/15 text-rose-600 dark:text-rose-400 border-rose-500/30';
      default:
        return 'bg-slate-500/15 text-slate-400 border-slate-500/30';
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in pb-20">
      {/* Top Banner Member Area */}
      <div className="relative rounded-3xl overflow-hidden bg-slate-950 border border-slate-800 p-6 sm:p-10 text-white shadow-2xl">
        {clubInfo.backgroundUrls?.memberBanner && (
          <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
            <img
              src={clubInfo.backgroundUrls.memberBanner}
              alt=""
              className="w-full h-full object-cover opacity-25 scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/90 to-amber-950/70" />
          </div>
        )}

        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-black bg-amber-500 text-slate-950 tracking-wider uppercase shadow-md flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5" />
              Communauté Officielle
            </span>
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-white/10 text-slate-200 border border-white/15">
              {members.length} Membres Enregistrés
            </span>
            {isAdminLoggedIn ? (
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                Mode Administrateur : Modification des profils activée
              </span>
            ) : (
              <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-slate-800/80 text-slate-400 border border-slate-700 flex items-center gap-1">
                <Lock className="w-3 h-3 text-amber-400" />
                Modification des profils réservée à l'administrateur
              </span>
            )}
          </div>

          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black font-serif tracking-tight text-white uppercase">
            Espace Membres <span className="text-amber-400">ASC Dialloré</span>
          </h1>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
            Consultez la liste officielle de tous les adhérents, supporters, socios et membres d'honneur. L'administrateur peut modifier le profil d'un membre (statut, coordonnées, photo, adhésion) à tout moment.
          </p>

          {/* Action Bar */}
          <div className="pt-2 flex flex-wrap items-center gap-3">
            {isAdminLoggedIn ? (
              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={() => handleOpenAddModal('single')}
                  className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs sm:text-sm font-black uppercase tracking-wider shadow-lg shadow-amber-500/30 flex items-center gap-2 transition"
                >
                  <Plus className="w-4 h-4 stroke-[3]" />
                  Ajouter un membre
                </button>

                <button
                  onClick={() => handleOpenAddModal('batch')}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs sm:text-sm font-bold flex items-center gap-2 border border-slate-700 transition"
                  title="Ajouter plusieurs membres en une seule fois"
                >
                  <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
                  <span>Ajouter plusieurs membres</span>
                </button>
              </div>
            ) : (
              <button
                onClick={() => setIsAdminLoginModalOpen(true)}
                className="px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs sm:text-sm font-bold flex items-center gap-2 shadow-lg transition"
              >
                <ShieldCheck className="w-4 h-4" />
                Connexion Administrateur
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-2xl p-1.5 shadow-sm overflow-x-auto no-scrollbar gap-1 max-w-md mx-auto">
        <button
          onClick={() => setActiveTabState('list')}
          className={`flex-1 py-2.5 px-4 text-xs font-bold rounded-xl transition flex items-center justify-center gap-2 whitespace-nowrap ${
            activeTabState === 'list'
              ? accent.bg
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Annuaire des Membres ({members.length})</span>
        </button>

        <button
          onClick={() => setActiveTabState('security')}
          className={`flex-1 py-2.5 px-4 text-xs font-bold rounded-xl transition flex items-center justify-center gap-2 whitespace-nowrap ${
            activeTabState === 'security'
              ? accent.bg
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <KeyRound className="w-4 h-4" />
          <span>Sécurité & 2FA</span>
        </button>
      </div>

      {/* ============================================================== */}
      {/* TAB 1: LISTE DE TOUT LES MEMBRES (ANNUAIRE OFFICIEL)          */}
      {/* ============================================================== */}
      {activeTabState === 'list' && (
        <div className="space-y-6">
          {/* Admin Notification Banner with Action Buttons */}
          {isAdminLoggedIn ? (
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-800 dark:text-emerald-300 text-xs">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                <span>
                  <strong>Administration Active :</strong> Vous pouvez <strong>changer le profil d'un membre</strong> (photo, statut, coordonnées, catégorie d'adhésion) via le bouton bleu <em>« Modifier le profil »</em> sur chaque fiche.
                </span>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <button
                  onClick={() => handleOpenAddModal('single')}
                  className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold flex items-center gap-1.5 shadow transition"
                >
                  <Plus className="w-3.5 h-3.5" />
                  +1 Membre
                </button>
                <button
                  onClick={() => handleOpenAddModal('batch')}
                  className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold flex items-center gap-1.5 shadow transition"
                >
                  <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" />
                  + Multiples
                </button>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-100 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-400">
              <span className="flex items-center gap-2">
                <Lock className="w-3.5 h-3.5 text-amber-500" />
                Seul l'administrateur peut modifier le profil d'un membre ou en ajouter/supprimer.
              </span>
              <button
                onClick={() => setIsAdminLoginModalOpen(true)}
                className="px-3 py-1 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold transition flex items-center gap-1 text-[11px]"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                Connexion Admin
              </button>
            </div>
          )}

          {/* Search & Filters Controls */}
          <div className="bg-white dark:bg-slate-900 p-4 sm:p-5 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
              {/* Search Field */}
              <div className="relative flex-1">
                <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Rechercher par nom, ville, n° d'adhérent..."
                  className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 border-none text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-amber-500 outline-none"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-white"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* City Filter & Multi-Select All Checkbox */}
              <div className="flex items-center gap-2">
                {isAdminLoggedIn && (
                  <button
                    onClick={handleSelectAll}
                    className="px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5 transition whitespace-nowrap"
                  >
                    {selectedMemberIds.length === filteredMembers.length && filteredMembers.length > 0 ? (
                      <CheckSquare className="w-4 h-4 text-amber-500" />
                    ) : (
                      <Square className="w-4 h-4 text-slate-400" />
                    )}
                    <span>
                      {selectedMemberIds.length === filteredMembers.length && filteredMembers.length > 0
                        ? 'Tout désélectionner'
                        : 'Tout sélectionner'}
                    </span>
                  </button>
                )}

                <div className="flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-slate-400 flex-shrink-0" />
                  <select
                    value={cityFilter}
                    onChange={e => setCityFilter(e.target.value)}
                    className="px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border-none text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-amber-500 outline-none"
                  >
                    <option value="all">Toutes les localités</option>
                    <option value="Touba">Touba</option>
                    <option value="Mbacké">Mbacké</option>
                    <option value="Diaspora">Diaspora</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Category / Tier Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pt-1">
              {[
                { id: 'all', label: 'Tous les membres', count: members.length },
                { id: 'Gold VIP', label: 'Gold VIP', count: members.filter(m => m.tier === 'Gold VIP').length },
                { id: 'Membre d’Honneur', label: 'Honneur', count: members.filter(m => m.tier === 'Membre d’Honneur').length },
                { id: 'Socio', label: 'Socios', count: members.filter(m => m.tier === 'Socio').length },
                { id: 'Adhérent', label: 'Adhérents', count: members.filter(m => m.tier === 'Adhérent').length },
                { id: 'Supporter', label: 'Supporters', count: members.filter(m => m.tier === 'Supporter').length },
              ].map(pill => {
                const isSelected = tierFilter === pill.id;
                return (
                  <button
                    key={pill.id}
                    onClick={() => setTierFilter(pill.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition flex items-center gap-1.5 ${
                      isSelected
                        ? `${accent.bg} shadow-md`
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                    }`}
                  >
                    <span>{pill.label}</span>
                    <span
                      className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                        isSelected ? 'bg-white/30 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-500 dark:text-slate-400'
                      }`}
                    >
                      {pill.count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Members Cards Grid */}
          {filteredMembers.length === 0 ? (
            <div className="p-12 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center mx-auto">
                <Users className="w-8 h-8" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Aucun membre ne correspond aux critères
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
                Modifiez vos termes de recherche ou réinitialisez les filtres pour afficher l'ensemble de la liste.
              </p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setTierFilter('all');
                  setCityFilter('all');
                }}
                className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-bold hover:bg-slate-200 transition"
              >
                Réinitialiser la recherche
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
              {filteredMembers.map(m => {
                const isSelected = selectedMemberIds.includes(m.id);
                const isDeleting = deleteConfirmId === m.id;

                return (
                  <div
                    key={m.id}
                    onClick={() => setViewingMember(m)}
                    className={`relative bg-white dark:bg-slate-900 rounded-3xl border transition-all duration-300 flex flex-col justify-between group p-5 shadow-sm hover:shadow-xl cursor-pointer hover:-translate-y-0.5 ${
                      isSelected
                        ? 'border-amber-500 ring-2 ring-amber-500/30 bg-amber-50/10 dark:bg-amber-950/10'
                        : 'border-slate-200 dark:border-slate-800 hover:border-amber-500/40'
                    }`}
                  >
                    <div>
                      {/* Top Header of Card */}
                      <div className="flex items-start justify-between gap-3 mb-3">
                        <div className="flex items-center gap-3">
                          {/* Selection Checkbox for Admin */}
                          {isAdminLoggedIn && (
                            <button
                              type="button"
                              onClick={e => toggleSelectMember(m.id, e)}
                              className="p-1 text-slate-400 hover:text-amber-500 transition z-10"
                              title={isSelected ? 'Désélectionner' : 'Sélectionner'}
                            >
                              {isSelected ? (
                                <CheckSquare className="w-5 h-5 text-amber-500" />
                              ) : (
                                <Square className="w-5 h-5 text-slate-400 group-hover:text-slate-600" />
                              )}
                            </button>
                          )}

                          <div
                            onClick={isAdminLoggedIn ? e => handleOpenEditModal(m, e) : undefined}
                            className={`relative w-12 h-12 rounded-2xl overflow-hidden border-2 border-amber-500/40 shadow-md flex-shrink-0 bg-slate-800 ${
                              isAdminLoggedIn ? 'cursor-pointer group/avatar' : ''
                            }`}
                            title={isAdminLoggedIn ? "Cliquer pour modifier la photo et le profil de ce membre" : undefined}
                          >
                            <img
                              src={m.avatarUrl || presetAvatars[0].url}
                              alt={m.fullName}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                            />
                            {isAdminLoggedIn && (
                              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover/avatar:opacity-100 transition-opacity flex items-center justify-center text-white">
                                <Edit className="w-3.5 h-3.5 text-amber-400" />
                              </div>
                            )}
                          </div>

                          <div>
                            <h3 className="text-sm sm:text-base font-black text-slate-900 dark:text-white group-hover:text-amber-500 transition-colors">
                              {m.fullName}
                            </h3>
                            <div className="flex items-center gap-1.5 mt-0.5">
                              <span className="font-mono text-[11px] font-bold text-slate-500 dark:text-slate-400">
                                {m.membershipNumber}
                              </span>
                              <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500" />
                              <span className={`text-[10px] px-1.5 py-0.2 rounded-full border font-semibold ${getStatusBadgeStyle(m.status)}`}>
                                {m.status}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Tier Badge */}
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[10px] uppercase tracking-wide border shadow-sm flex-shrink-0 ${getTierBadgeStyle(
                            m.tier
                          )}`}
                        >
                          {m.tier}
                        </span>
                      </div>

                      {/* Location & Details */}
                      <div className="space-y-1.5 text-xs text-slate-600 dark:text-slate-300 my-3 bg-slate-50 dark:bg-slate-800/50 p-3 rounded-2xl">
                        <div className="flex items-center gap-2">
                          <MapPin className="w-3.5 h-3.5 text-amber-500 flex-shrink-0" />
                          <span className="font-medium truncate">{m.city}</span>
                        </div>

                        {m.phone && (
                          <div className="flex items-center gap-2">
                            <Phone className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
                            <a href={`tel:${m.phone}`} onClick={e => e.stopPropagation()} className="hover:underline font-mono">
                              {m.phone}
                            </a>
                          </div>
                        )}

                        {m.email && (
                          <div className="flex items-center gap-2">
                            <Mail className="w-3.5 h-3.5 text-blue-500 flex-shrink-0" />
                            <span className="truncate">{m.email}</span>
                          </div>
                        )}

                        <div className="flex items-center gap-2 text-[11px] text-slate-400 pt-1 border-t border-slate-200/50 dark:border-slate-700/50">
                          <Calendar className="w-3 h-3 text-slate-400" />
                          <span>Adhérent depuis : {m.joinedDate}</span>
                        </div>
                      </div>

                      {/* Notes / Rôle associatif */}
                      {m.notes && (
                        <p className="text-xs text-slate-500 dark:text-slate-400 italic line-clamp-2 px-1">
                          « {m.notes} »
                        </p>
                      )}
                    </div>

                    {/* Card Footer: Quick action buttons */}
                    <div className="pt-3 mt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2" onClick={e => e.stopPropagation()}>
                      {isAdminLoggedIn ? (
                        <>
                          <button
                            onClick={e => handleOpenEditModal(m, e)}
                            className="flex-1 py-1.5 px-3 rounded-xl bg-blue-500/10 hover:bg-blue-600 hover:text-white text-blue-600 dark:text-blue-400 text-xs font-bold flex items-center justify-center gap-1.5 transition border border-blue-500/20"
                            title="Modifier le profil de ce membre"
                          >
                            <Edit className="w-3.5 h-3.5" />
                            <span>Modifier le profil</span>
                          </button>

                          {isDeleting ? (
                            <div className="flex items-center gap-1 bg-red-950/80 p-1 rounded-xl border border-red-500">
                              <button
                                onClick={e => handleDeleteMember(m.id, e)}
                                className="px-2 py-1 rounded-lg bg-red-600 hover:bg-red-500 text-white text-[11px] font-bold"
                              >
                                Confirmer ?
                              </button>
                              <button
                                onClick={e => {
                                  e.stopPropagation();
                                  setDeleteConfirmId(null);
                                }}
                                className="p-1 rounded-lg bg-slate-800 text-slate-300 text-xs"
                              >
                                <X className="w-3 h-3" />
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={e => {
                                e.stopPropagation();
                                setDeleteConfirmId(m.id);
                              }}
                              className="px-3 py-1.5 rounded-xl bg-red-500/10 hover:bg-red-600 hover:text-white text-red-600 dark:text-red-400 text-xs font-bold flex items-center gap-1.5 transition border border-red-500/20"
                              title="Supprimer ce membre (Admin)"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              <span className="hidden sm:inline">Supprimer</span>
                            </button>
                          )}
                        </>
                      ) : (
                        <button
                          onClick={() => setViewingMember(m)}
                          className="w-full py-1.5 px-3 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 text-xs font-bold flex items-center justify-center gap-1.5 transition"
                        >
                          <Eye className="w-3.5 h-3.5 text-amber-500" />
                          <span>Voir la fiche profil</span>
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

      {/* Floating Sticky Bulk Actions Bar for Members */}
      {isAdminLoggedIn && selectedMemberIds.length > 0 && activeTabState === 'list' && (
        <div className="fixed bottom-16 sm:bottom-6 inset-x-4 max-w-xl mx-auto z-40 bg-slate-950 text-white p-4 rounded-3xl border border-amber-500/50 shadow-2xl backdrop-blur-lg flex items-center justify-between gap-3 animate-in slide-in-from-bottom-5">
          <div className="flex items-center gap-2.5">
            <span className="w-8 h-8 rounded-xl bg-amber-500 text-slate-950 font-black flex items-center justify-center text-xs">
              {selectedMemberIds.length}
            </span>
            <span className="text-xs font-bold">
              {selectedMemberIds.length > 1 ? 'Membres sélectionnés' : 'Membre sélectionné'}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setSelectedMemberIds([])}
              className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition"
            >
              Annuler
            </button>
            <button
              onClick={() => setIsBulkDeleteModalOpen(true)}
              className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-black flex items-center gap-1.5 shadow-lg shadow-red-600/30 transition"
            >
              <Trash2 className="w-4 h-4" />
              <span>Supprimer ({selectedMemberIds.length})</span>
            </button>
          </div>
        </div>
      )}

      {/* Bulk Delete Confirmation Modal */}
      {isBulkDeleteModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-5 text-center">
            <div className="w-14 h-14 rounded-2xl bg-red-500/10 text-red-600 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-7 h-7" />
            </div>
            <div>
              <h3 className="text-lg font-black text-slate-900 dark:text-white">
                Supprimer {selectedMemberIds.length} membre{selectedMemberIds.length > 1 ? 's' : ''} ?
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Cette action supprimera définitivement les membres sélectionnés de l'annuaire du club.
              </p>
            </div>
            <div className="flex justify-center gap-3 pt-2">
              <button
                onClick={() => setIsBulkDeleteModalOpen(false)}
                className="px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold"
              >
                Annuler
              </button>
              <button
                onClick={handleConfirmBulkDelete}
                className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-black uppercase tracking-wider shadow-lg shadow-red-600/30"
              >
                Confirmer la suppression
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* DETAILED MEMBER PROFILE MODAL (FICHE PROFIL)                  */}
      {/* ============================================================== */}
      {viewingMember && (
        <div
          className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-in fade-in"
          onClick={() => setViewingMember(null)}
        >
          <div
            className="relative max-w-lg w-full bg-white dark:bg-slate-900 rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-2xl my-8 space-y-5"
            onClick={e => e.stopPropagation()}
          >
            {/* Header Banner */}
            <div className="relative bg-gradient-to-br from-slate-900 via-slate-950 to-amber-950 p-6 text-white overflow-hidden">
              <button
                onClick={() => setViewingMember(null)}
                className="absolute right-4 top-4 p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition z-10"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-4 relative z-10">
                <div className="relative w-20 h-20 rounded-2xl overflow-hidden border-2 border-amber-400 shadow-xl flex-shrink-0 bg-slate-800">
                  <img src={viewingMember.avatarUrl} alt={viewingMember.fullName} className="w-full h-full object-cover" />
                </div>
                <div className="space-y-1">
                  <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider shadow-sm ${getTierBadgeStyle(viewingMember.tier)}`}>
                    {viewingMember.tier}
                  </span>
                  <h3 className="text-xl font-black text-white font-serif">{viewingMember.fullName}</h3>
                  <div className="flex items-center gap-2 text-xs text-amber-300 font-mono">
                    <span>N° : {viewingMember.membershipNumber}</span>
                    <span>•</span>
                    <span className={`px-2 py-0.2 rounded-full text-[10px] ${getStatusBadgeStyle(viewingMember.status)}`}>
                      {viewingMember.status}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Profile Content */}
            <div className="p-6 pt-0 space-y-4">
              <div className="bg-slate-50 dark:bg-slate-800/60 p-4 rounded-2xl space-y-2.5 text-xs text-slate-700 dark:text-slate-300">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-amber-500" />
                    Localité / Ville :
                  </span>
                  <strong className="text-slate-900 dark:text-white">{viewingMember.city}</strong>
                </div>

                {viewingMember.phone && (
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400 flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5 text-emerald-500" />
                      Téléphone :
                    </span>
                    <a href={`tel:${viewingMember.phone}`} className="font-mono font-bold text-emerald-600 dark:text-emerald-400 hover:underline">
                      {viewingMember.phone}
                    </a>
                  </div>
                )}

                {viewingMember.email && (
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400 flex items-center gap-1.5">
                      <Mail className="w-3.5 h-3.5 text-blue-500" />
                      Email :
                    </span>
                    <span className="font-medium text-slate-900 dark:text-white">{viewingMember.email}</span>
                  </div>
                )}

                <div className="flex items-center justify-between pt-1 border-t border-slate-200 dark:border-slate-700">
                  <span className="text-slate-400 flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    Membre depuis :
                  </span>
                  <span className="font-semibold text-slate-900 dark:text-white">{viewingMember.joinedDate}</span>
                </div>
              </div>

              {viewingMember.notes && (
                <div className="p-3.5 rounded-2xl bg-amber-500/5 border border-amber-500/20 text-xs text-slate-600 dark:text-slate-300 italic">
                  <strong>Notes & Rôle associatif :</strong> « {viewingMember.notes} »
                </div>
              )}

              {/* Admin Actions directly on profile modal */}
              {isAdminLoggedIn ? (
                <div className="pt-2 flex flex-col sm:flex-row gap-2 border-t border-slate-100 dark:border-slate-800">
                  <button
                    onClick={() => handleOpenEditModal(viewingMember)}
                    className="flex-1 py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center justify-center gap-2 shadow transition"
                  >
                    <Edit className="w-4 h-4" />
                    <span>Modifier le profil de ce membre</span>
                  </button>

                  <button
                    onClick={() => handleDeleteMember(viewingMember.id)}
                    className="py-2.5 px-4 rounded-xl bg-red-500/10 hover:bg-red-600 hover:text-white text-red-600 dark:text-red-400 text-xs font-bold flex items-center justify-center gap-2 transition"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>Supprimer</span>
                  </button>
                </div>
              ) : (
                <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-2 border-t border-slate-100 dark:border-slate-800">
                  <button
                    type="button"
                    onClick={() => {
                      setViewingMember(null);
                      setIsAdminLoginModalOpen(true);
                    }}
                    className="text-xs text-amber-600 dark:text-amber-400 hover:underline font-bold flex items-center gap-1.5 transition py-1"
                  >
                    <Lock className="w-3.5 h-3.5" />
                    <span>Admin ? Se connecter pour modifier ce profil</span>
                  </button>

                  <button
                    onClick={() => setViewingMember(null)}
                    className="px-5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-800 dark:text-slate-200 text-xs font-bold transition w-full sm:w-auto"
                  >
                    Fermer
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* TAB 2: SÉCURITÉ & 2FA                                          */}
      {/* ============================================================== */}
      {activeTabState === 'security' && (
        <div className="max-w-2xl mx-auto bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
          <div className="flex items-center gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
              <KeyRound className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                Sécurité & Authentification à Deux Facteurs
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Protégez votre compte adhérent avec un code temporaire TOTP
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60">
            <div>
              <div className="text-sm font-bold text-slate-900 dark:text-white">
                Double Authentification (2FA)
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                {member.isTwoFactorEnabled ? 'Activé • Votre compte est sécurisé' : 'Désactivé • Recommandé'}
              </div>
            </div>

            <button
              onClick={() => toggle2FAEnabled(!member.isTwoFactorEnabled)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition shadow-sm ${
                member.isTwoFactorEnabled
                  ? 'bg-rose-500/10 text-rose-500 hover:bg-rose-500 hover:text-white'
                  : 'bg-emerald-600 text-white hover:bg-emerald-500'
              }`}
            >
              {member.isTwoFactorEnabled ? 'Désactiver' : 'Activer'}
            </button>
          </div>

          <div className="pt-2 flex justify-between items-center text-xs text-slate-400">
            <span>Dernière synchronisation cloud : {cloudSync.lastSyncedAt || 'En direct'}</span>
            <button
              onClick={triggerCloudSync}
              className="text-amber-500 hover:underline font-bold flex items-center gap-1"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Forcer la synchronisation
            </button>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* ADMIN ADD / EDIT MEMBER MODAL (SINGLE & BATCH MODES)           */}
      {/* ============================================================== */}
      {isModalOpen && isAdminLoggedIn && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
          <div className="relative max-w-2xl w-full bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-2xl my-8 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
              <div className="flex items-center gap-2.5">
                <div className={`w-10 h-10 rounded-2xl flex items-center justify-center ${editingMember ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400' : 'bg-amber-500/10 text-amber-500'}`}>
                  {editingMember ? <Edit className="w-5 h-5" /> : <Users className="w-5 h-5" />}
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
                    {editingMember
                      ? `Modifier le Profil du Membre : ${editingMember.fullName}`
                      : addMode === 'batch'
                      ? 'Ajouter plusieurs membres'
                      : 'Inscrire un nouveau membre'}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {editingMember
                      ? 'Changement des coordonnées, photo, statut et adhésion'
                      : 'Administration officielle des adhérents ASC Dialloré'}
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  setIsModalOpen(false);
                  resetForm();
                }}
                className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Mode switch (Single vs Batch) when creating only */}
            {!editingMember && (
              <div className="flex p-1 bg-slate-100 dark:bg-slate-800 rounded-2xl gap-1">
                <button
                  type="button"
                  onClick={() => setAddMode('single')}
                  className={`flex-1 py-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                    addMode === 'single'
                      ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm'
                      : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Membre unique</span>
                </button>
                <button
                  type="button"
                  onClick={() => setAddMode('batch')}
                  className={`flex-1 py-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                    addMode === 'batch'
                      ? 'bg-amber-500 text-slate-950 font-black shadow-sm'
                      : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <FileSpreadsheet className="w-3.5 h-3.5" />
                  <span>Plusieurs membres (Lot)</span>
                </button>
              </div>
            )}

            <form onSubmit={handleSaveMember} className="space-y-4">
              {/* ============================================ */}
              {/* SINGLE MEMBER / EDIT MEMBER MODE FORM        */}
              {/* ============================================ */}
              {addMode === 'single' && (
                <>
                  {/* Photo & Avatar Section */}
                  <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-100 dark:border-slate-800 space-y-3">
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                      Photo de profil du membre
                    </label>

                    <div className="flex flex-col sm:flex-row items-center gap-4">
                      {/* Avatar Live Preview */}
                      <div className="relative w-20 h-20 rounded-2xl overflow-hidden border-2 border-amber-500 shadow-md flex-shrink-0 bg-slate-900">
                        <img
                          src={avatarUrl || presetAvatars[0].url}
                          alt="Aperçu avatar"
                          className="w-full h-full object-cover"
                        />
                        <span className="absolute bottom-0 inset-x-0 bg-black/60 text-white text-[9px] font-bold text-center py-0.5">
                          Aperçu
                        </span>
                      </div>

                      {/* Photo inputs: Upload or URL */}
                      <div className="flex-1 w-full space-y-2">
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={avatarUrl}
                            onChange={e => setAvatarUrl(e.target.value)}
                            placeholder="URL de l'image (https://...)"
                            className="flex-1 px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-mono outline-none"
                          />
                          <label className="px-3 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold flex items-center gap-1.5 cursor-pointer transition shadow-sm whitespace-nowrap">
                            <Upload className="w-3.5 h-3.5" />
                            <span>Changer photo</span>
                            <input
                              type="file"
                              accept="image/*"
                              onChange={handleAvatarFileUpload}
                              className="hidden"
                            />
                          </label>
                        </div>

                        {/* Presets suggestions */}
                        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
                          <span className="text-[10px] text-slate-400 flex-shrink-0">Suggestions :</span>
                          {presetAvatars.map((p, idx) => (
                            <button
                              key={idx}
                              type="button"
                              onClick={() => setAvatarUrl(p.url)}
                              className={`w-6 h-6 rounded-full overflow-hidden border transition flex-shrink-0 ${
                                avatarUrl === p.url ? 'border-amber-500 ring-2 ring-amber-500/40 scale-110' : 'border-slate-300 opacity-60'
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

                  {/* Nom complet & N° d'adhérent */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                        Nom complet du membre *
                      </label>
                      <input
                        type="text"
                        required
                        value={fullName}
                        onChange={e => setFullName(e.target.value)}
                        placeholder="Ex: Babacar Diagne"
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
                        value={membershipNumber}
                        onChange={e => setMembershipNumber(e.target.value)}
                        placeholder="DIA-MBK-015"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 border-none text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-amber-500 outline-none font-mono font-bold"
                      />
                    </div>
                  </div>

                  {/* Catégorie & Statut */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                        Catégorie d'adhésion *
                      </label>
                      <select
                        value={tier}
                        onChange={e => setTier(e.target.value as ClubMember['tier'])}
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
                        Statut du compte *
                      </label>
                      <select
                        value={status}
                        onChange={e => setStatus(e.target.value as ClubMember['status'])}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 border-none text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-amber-500 outline-none font-medium"
                      >
                        <option value="Actif">Actif (en règle)</option>
                        <option value="En attente">En attente de validation</option>
                        <option value="Suspendu">Suspendu</option>
                      </select>
                    </div>
                  </div>

                  {/* Ville & Date d'adhésion */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                        Ville / Quartier *
                      </label>
                      <input
                        type="text"
                        required
                        value={city}
                        onChange={e => setCity(e.target.value)}
                        placeholder="Ex: Touba Mosquée, Mbacké Escale..."
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 border-none text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-amber-500 outline-none font-medium"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                        Date d'adhésion
                      </label>
                      <input
                        type="text"
                        value={joinedDate}
                        onChange={e => setJoinedDate(e.target.value)}
                        placeholder="JJ/MM/AAAA"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 border-none text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-amber-500 outline-none font-medium"
                      />
                    </div>
                  </div>

                  {/* Coordonnées : Téléphone & Email */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                        Téléphone (WhatsApp)
                      </label>
                      <input
                        type="tel"
                        value={phone}
                        onChange={e => setPhone(e.target.value)}
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
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        placeholder="membre@ascdiallore.sn"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 border-none text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-amber-500 outline-none"
                      />
                    </div>
                  </div>

                  {/* Notes / Rôle associatif */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Notes ou rôle associatif (optionnel)
                    </label>
                    <textarea
                      rows={2}
                      value={notes}
                      onChange={e => setNotes(e.target.value)}
                      placeholder="Membre d'honneur, responsable logistique, animateur supporters..."
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 border-none text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-amber-500 outline-none font-medium resize-none"
                    />
                  </div>
                </>
              )}

              {/* ============================================ */}
              {/* BATCH MEMBERS MODE FORM                      */}
              {/* ============================================ */}
              {addMode === 'batch' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                      Ajout de plusieurs membres simultanément
                    </span>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setBatchInputType('table')}
                        className={`text-[11px] px-2.5 py-1 rounded-lg font-bold transition ${
                          batchInputType === 'table' ? 'bg-amber-500 text-slate-950' : 'bg-slate-100 dark:bg-slate-800 text-slate-400'
                        }`}
                      >
                        Formulaire tableau
                      </button>
                      <button
                        type="button"
                        onClick={() => setBatchInputType('paste')}
                        className={`text-[11px] px-2.5 py-1 rounded-lg font-bold transition ${
                          batchInputType === 'paste' ? 'bg-amber-500 text-slate-950' : 'bg-slate-100 dark:bg-slate-800 text-slate-400'
                        }`}
                      >
                        Coller une liste
                      </button>
                    </div>
                  </div>

                  {batchInputType === 'paste' ? (
                    <div className="space-y-2">
                      <p className="text-[11px] text-slate-500 dark:text-slate-400">
                        Collez une ligne par membre au format : <code>Nom, Ville, Catégorie, Téléphone</code>
                      </p>
                      <textarea
                        rows={6}
                        value={batchPasteText}
                        onChange={e => setBatchPasteText(e.target.value)}
                        placeholder={`Moussa Ndiaye, Touba, Gold VIP, +221 77 123 45 67\nFatou Diop, Mbacké, Adhérent, +221 78 987 65 43\nIbrahima Fall, Diaspora, Socio, +33 6 12 34 56 78`}
                        className="w-full p-3 rounded-2xl bg-slate-100 dark:bg-slate-800 border-none text-xs text-slate-900 dark:text-white font-mono outline-none"
                      />
                      <button
                        type="button"
                        onClick={parseBatchPastedText}
                        className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold transition"
                      >
                        Charger dans le tableau
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
                      {batchRows.map((row, idx) => (
                        <div key={idx} className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-2xl space-y-2 border border-slate-100 dark:border-slate-800">
                          <div className="flex items-center justify-between">
                            <span className="text-[11px] font-bold text-amber-500">Membre #{idx + 1}</span>
                            {batchRows.length > 1 && (
                              <button
                                type="button"
                                onClick={() => removeBatchRow(idx)}
                                className="text-rose-500 hover:text-rose-400 text-xs font-bold"
                              >
                                Supprimer la ligne
                              </button>
                            )}
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            <input
                              type="text"
                              required
                              value={row.fullName}
                              onChange={e => updateBatchRow(idx, 'fullName', e.target.value)}
                              placeholder="Nom complet *"
                              className="px-3 py-2 rounded-xl bg-white dark:bg-slate-900 text-xs outline-none"
                            />
                            <select
                              value={row.tier}
                              onChange={e => updateBatchRow(idx, 'tier', e.target.value)}
                              className="px-3 py-2 rounded-xl bg-white dark:bg-slate-900 text-xs outline-none"
                            >
                              <option value="Supporter">Supporter</option>
                              <option value="Adhérent">Adhérent</option>
                              <option value="Gold VIP">Gold VIP</option>
                              <option value="Membre d’Honneur">Membre d’Honneur</option>
                              <option value="Socio">Socio</option>
                            </select>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            <input
                              type="text"
                              value={row.city}
                              onChange={e => updateBatchRow(idx, 'city', e.target.value)}
                              placeholder="Ville (Touba, Mbacké...)"
                              className="px-3 py-2 rounded-xl bg-white dark:bg-slate-900 text-xs outline-none"
                            />
                            <input
                              type="tel"
                              value={row.phone}
                              onChange={e => updateBatchRow(idx, 'phone', e.target.value)}
                              placeholder="Téléphone / WhatsApp"
                              className="px-3 py-2 rounded-xl bg-white dark:bg-slate-900 text-xs font-mono outline-none"
                            />
                          </div>
                        </div>
                      ))}

                      <button
                        type="button"
                        onClick={addBatchRow}
                        className="w-full py-2.5 rounded-2xl border-2 border-dashed border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-300 text-xs font-bold hover:border-amber-500 hover:text-amber-500 transition flex items-center justify-center gap-1.5"
                      >
                        <Plus className="w-4 h-4" />
                        <span>Ajouter un autre membre</span>
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* Submit Buttons */}
              <div className="pt-2 flex justify-end gap-2 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => {
                    setIsModalOpen(false);
                    resetForm();
                  }}
                  className="px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold hover:bg-slate-200 transition"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className={`px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider shadow-lg flex items-center gap-1.5 transition ${
                    editingMember
                      ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-blue-600/30'
                      : 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-amber-500/30'
                  }`}
                >
                  {editingMember ? (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Enregistrer les modifications du profil</span>
                    </>
                  ) : addMode === 'batch' ? (
                    <>
                      <Plus className="w-4 h-4 stroke-[3]" />
                      <span>{`Enregistrer les ${batchRows.filter(r => r.fullName.trim().length > 0).length || batchRows.length} membres`}</span>
                    </>
                  ) : (
                    <>
                      <Plus className="w-4 h-4 stroke-[3]" />
                      <span>Inscrire le membre</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Admin Quick Login Modal */}
      <AdminQuickLoginModal
        isOpen={isAdminLoginModalOpen}
        onClose={() => setIsAdminLoginModalOpen(false)}
        title="Connexion Administrateur Membres"
        description="Connectez-vous pour ajouter, modifier le profil ou supprimer des membres de l'ASC Dialloré."
      />
    </div>
  );
};
