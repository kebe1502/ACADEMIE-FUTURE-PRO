import React, { useState } from 'react';
import {
  Bell,
  Globe,
  Cloud,
  CloudOff,
  RefreshCw,
  User,
  ShieldCheck,
  Menu,
  X,
  Calendar,
  Users,
  Image as ImageIcon,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { PWAInstallButton } from './PWAInstallButton';
import { Language, NavTab } from '../types';
import { getAccentStyles } from '../utils/theme';

export const Header: React.FC = () => {
  const {
    language,
    setLanguage,
    themeAccent,
    activeTab,
    setActiveTab,
    isLoggedIn,
    member,
    members,
    setIsNotifModalOpen,
    cloudSync,
    triggerCloudSync,
    isOnline,
    clubInfo,
    isAdminLoggedIn,
  } = useApp();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const activeProfileMember = isLoggedIn
    ? members.find(
        m =>
          m.id === member.id ||
          (!!member.fullName && m.fullName.trim().toLowerCase() === member.fullName.trim().toLowerCase()) ||
          (!!member.email && !!m.email && m.email.trim().toLowerCase() === member.email.trim().toLowerCase()) ||
          (!!member.membershipNumber && m.membershipNumber === member.membershipNumber)
      )
    : undefined;

  const accent = getAccentStyles(themeAccent);

  // Éléments de navigation avec libellés concis pour desktop afin d'éviter tout débordement
  const navItems: { id: NavTab; label: string; fullLabel: string; icon: React.FC<{ className?: string }> }[] = [
    { id: 'home', label: 'Accueil', fullLabel: 'Accueil', icon: Globe },
    { id: 'matches', label: 'Matchs', fullLabel: 'Calendrier & Matchs', icon: Calendar },
    { id: 'team', label: 'Équipe', fullLabel: 'Effectif, Staff & Présidence', icon: Users },
    { id: 'gallery', label: 'Galerie', fullLabel: 'Galerie Photos', icon: ImageIcon },
    { id: 'member', label: 'Membre', fullLabel: 'Membres & Adhérents', icon: User },
    { id: 'admin', label: 'Admin', fullLabel: 'Administration', icon: ShieldCheck },
  ];

  const languages: { code: Language; name: string; flag: string }[] = [
    { code: 'fr', name: 'Français', flag: '🇫🇷' },
  ];

  return (
    <header className="sticky top-0 z-30 w-full max-w-full overflow-x-hidden bg-white/95 dark:bg-slate-950/95 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800/80 transition-colors relative">
      {clubInfo.backgroundUrls?.headerBg && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <img src={clubInfo.backgroundUrls.headerBg} alt="" className="w-full h-full object-cover opacity-20 dark:opacity-25" />
          <div className="absolute inset-0 bg-white/80 dark:bg-slate-950/85 backdrop-blur-[2px]" />
        </div>
      )}
      <div className="w-full max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 relative z-10">
        <div className="flex items-center justify-between h-14 sm:h-16 gap-2 w-full">
          
          {/* Logo & Club Crest - Totalement fluide avec min-w-0 */}
          <div
            onClick={() => setActiveTab('home')}
            className="flex items-center gap-2 sm:gap-3 cursor-pointer select-none group flex-shrink min-w-0"
          >
            <div className="relative w-9 h-9 sm:w-11 sm:h-11 flex items-center justify-center rounded-2xl bg-white dark:bg-slate-900 border-2 border-red-500/40 dark:border-red-500/50 shadow-md group-hover:scale-105 transition-transform p-1 flex-shrink-0">
              <img
                src={clubInfo.logoUrl || '/icon.svg'}
                alt={clubInfo.name}
                className="w-full h-full object-contain"
              />
              <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500"></span>
              </span>
            </div>

            <div className="min-w-0">
              <div className="flex items-center gap-1.5 truncate">
                <span className="font-black text-xs sm:text-base tracking-tight text-slate-950 dark:text-white uppercase font-serif truncate">
                  {clubInfo.name}
                </span>
                <span className="hidden md:inline-block px-1.5 py-0.5 rounded-full text-[9px] font-black bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 whitespace-nowrap">
                  Cadets 2026
                </span>
              </div>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 tracking-wide hidden sm:block truncate">
                {clubInfo.city} • <span className="text-emerald-600 dark:text-emerald-400 font-semibold">{clubInfo.stadium}</span>
              </p>
            </div>
          </div>

          {/* Navigation Desktop : Actif uniquement sur grand écran (xl: >= 1280px) pour éviter tout débordement */}
          <nav className="hidden xl:flex items-center gap-1 flex-shrink-0">
            {navItems.map(item => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  id={`nav-link-${item.id}`}
                  onClick={() => setActiveTab(item.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-150 whitespace-nowrap ${
                    isActive
                      ? `${accent.bgLight} font-bold shadow-sm`
                      : 'text-slate-600 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-850'
                  }`}
                  title={item.fullLabel}
                >
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Outils & Actions Droite - Strictement adaptatif */}
          <div className="flex items-center gap-1 sm:gap-1.5 flex-shrink-0">
            
            {/* PWA Install Button (très grand écran seulement) */}
            <div className="hidden 2xl:block">
              <PWAInstallButton />
            </div>

            {/* Cloud Sync Status Pill (grand écran seulement) */}
            <button
              id="btn-cloud-sync"
              onClick={triggerCloudSync}
              title={`Cloud : ${cloudSync.status} • Dernière sync : ${cloudSync.lastSyncedAt}`}
              className="hidden 2xl:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-850 transition"
            >
              {cloudSync.status === 'syncing' ? (
                <RefreshCw className="w-3.5 h-3.5 text-blue-500 animate-spin" />
              ) : isOnline ? (
                <Cloud className="w-3.5 h-3.5 text-emerald-500" />
              ) : (
                <CloudOff className="w-3.5 h-3.5 text-amber-500" />
              )}
              <span className="text-[11px]">{cloudSync.lastSyncedAt}</span>
            </button>

            {/* Notifications Bell (sm+ seulement) */}
            <button
              id="btn-notif-modal"
              onClick={() => setIsNotifModalOpen(true)}
              className="hidden sm:flex relative p-1.5 rounded-lg text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              title="Préférences alertes et notifications push"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
            </button>

            {/* Member Profile Avatar - Affiché uniquement si le profil existe encore dans l'annuaire */}
            {activeProfileMember && (
              <button
                id="btn-header-member"
                onClick={() => setActiveTab('member')}
                className={`flex items-center gap-1.5 p-1 rounded-xl border transition flex-shrink-0 ${
                  activeTab === 'member'
                    ? 'border-amber-500 bg-amber-500/10'
                    : 'border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-850'
                }`}
                title={`${activeProfileMember.fullName} • Espace Membre`}
              >
                <div className="relative w-6 h-6 rounded-full overflow-hidden border border-amber-500/60 flex-shrink-0">
                  <img
                    src={activeProfileMember.avatarUrl}
                    alt={activeProfileMember.fullName}
                    className="w-full h-full object-cover"
                  />
                </div>
              </button>
            )}

            {/* Admin Entrance Button (grand écran seulement) */}
            <button
              id="btn-header-admin"
              onClick={() => setActiveTab('admin')}
              className={`hidden 2xl:flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border text-xs font-bold transition ${
                activeTab === 'admin'
                  ? 'bg-red-600 text-white border-red-500 shadow-md'
                  : isAdminLoggedIn
                  ? 'bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/30 hover:bg-red-500/20'
                  : 'border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
              title="Espace Administrateur"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-red-500" />
              <span>Admin</span>
              {isAdminLoggedIn && (
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              )}
            </button>

            {/* Bouton Hamburger - ACTIF dès que l'écran est inférieur à 1280px (xl:hidden) */}
            <button
              id="btn-mobile-menu-toggle"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="xl:hidden p-1.5 sm:p-2 rounded-xl bg-slate-100 dark:bg-slate-900 hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 transition flex-shrink-0"
              title="Menu et Navigation"
              aria-label="Menu principal"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

          </div>
        </div>

        {/* Panneau du Menu Mobile & Tablette (xl:hidden) */}
        {isMobileMenuOpen && (
          <div className="xl:hidden py-4 border-t border-slate-200 dark:border-slate-800 space-y-4 animate-in slide-in-from-top-2 duration-200">
            
            {/* Liens de navigation avec icônes et intitulés complets */}
            <div>
              <p className="text-[10px] font-black uppercase tracking-wider text-slate-400 mb-2 px-1">
                Navigation Principale
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {navItems.map(item => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        setActiveTab(item.id);
                        setIsMobileMenuOpen(false);
                      }}
                      className={`px-3 py-2.5 rounded-xl text-xs font-bold text-left transition flex items-center justify-between gap-1.5 ${
                        activeTab === item.id
                          ? `${accent.bgLight} font-black shadow-sm`
                          : 'bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800'
                      }`}
                    >
                      <div className="flex items-center gap-2 truncate">
                        <Icon className="w-4 h-4 text-amber-500 flex-shrink-0" />
                        <span className="truncate">{item.fullLabel}</span>
                      </div>
                      {activeTab === item.id && <span className="w-1.5 h-1.5 rounded-full bg-current flex-shrink-0" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Outils & Préférences repliés du Header */}
            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-3">
              <p className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                Préférences & Affichage
              </p>

              {/* Langue : Français uniquement */}
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-[11px] text-slate-500 font-semibold mr-1">Langue :</span>
                {languages.map(lang => (
                  <button
                    key={lang.code}
                    type="button"
                    onClick={() => setLanguage(lang.code)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold transition flex items-center gap-1 border ${
                      language === lang.code
                        ? 'bg-amber-500 text-slate-950 border-amber-500 shadow-sm'
                        : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    <span>{lang.flag}</span>
                    <span>{lang.name}</span>
                  </button>
                ))}
              </div>

              {/* Actions Rapides : Notifications, Admin */}
              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => {
                    setIsNotifModalOpen(true);
                    setIsMobileMenuOpen(false);
                  }}
                  className="flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-200"
                >
                  <Bell className="w-4 h-4 text-rose-500" />
                  <span>Notifications</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('admin');
                    setIsMobileMenuOpen(false);
                  }}
                  className="flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-red-600 text-white text-xs font-bold shadow"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>Espace Admin</span>
                </button>
              </div>

              {/* Cloud Sync & PWA */}
              <div className="flex items-center justify-between pt-1 text-[11px] text-slate-500">
                <button
                  type="button"
                  onClick={triggerCloudSync}
                  className="flex items-center gap-1.5 hover:text-slate-900 dark:hover:text-slate-200"
                >
                  {cloudSync.status === 'syncing' ? (
                    <RefreshCw className="w-3.5 h-3.5 text-blue-500 animate-spin" />
                  ) : (
                    <Cloud className="w-3.5 h-3.5 text-emerald-500" />
                  )}
                  <span>Sync Cloud : {cloudSync.lastSyncedAt}</span>
                </button>

                <PWAInstallButton />
              </div>

            </div>

          </div>
        )}

      </div>
    </header>
  );
};
