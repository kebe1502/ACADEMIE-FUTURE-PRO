import React, { useState, useRef } from 'react';
import {
  X,
  Trophy,
  Share2,
  Calendar,
  Award,
  TrendingUp,
  Activity,
  Shield,
  Zap,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Minimize2,
  Maximize2,
  Flame,
  Star,
  Compass,
  FileText,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { INITIAL_ROSTER_TEMPLATES } from '../data/clubData';
import { getAccentStyles } from '../utils/theme';
import { getPlayerFullName, getPlayerFlag, getPlayerStats, getPlayerTrophies } from '../utils/playerHelpers';
import { PlayerCVModal } from './PlayerCVModal';

export const PlayerDetailModal: React.FC = () => {
  const { players, selectedPlayerId, setSelectedPlayerId, triggerShare, themeAccent, t, clubInfo } = useApp();
  const [activeTab, setActiveTab] = useState<'attributes' | 'stats' | 'bio'>('attributes');
  const [isCondensed, setIsCondensed] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isCVModalOpen, setIsCVModalOpen] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  if (!selectedPlayerId) return null;

  // Resolve player from dynamic players state or fallback to templates
  const player =
    players.find(p => p.id === selectedPlayerId) ||
    INITIAL_ROSTER_TEMPLATES.find(p => p.id === selectedPlayerId) ||
    players[0] ||
    INITIAL_ROSTER_TEMPLATES[0];

  if (!player) return null;

  const accent = getAccentStyles(themeAccent);
  const playerFullName = getPlayerFullName(player);
  const playerFlag = getPlayerFlag(player);
  const playerStats = getPlayerStats(player);
  const playerTrophies = getPlayerTrophies(player);

  // Safe fallback attributes (guaranteed never undefined)
  const safeAttributes = {
    pace: player.attributes?.pace ?? 85,
    shooting: player.attributes?.shooting ?? 82,
    passing: player.attributes?.passing ?? 80,
    dribbling: player.attributes?.dribbling ?? 84,
    defending: player.attributes?.defending ?? 58,
    physical: player.attributes?.physical ?? 78,
  };

  const attributesList = [
    { label: t('pace'), value: safeAttributes.pace, icon: Zap, color: 'from-amber-500 to-yellow-400' },
    { label: t('shooting'), value: safeAttributes.shooting, icon: TrendingUp, color: 'from-red-500 to-rose-400' },
    { label: t('passing'), value: safeAttributes.passing, icon: Activity, color: 'from-blue-500 to-sky-400' },
    { label: t('dribbling'), value: safeAttributes.dribbling, icon: Award, color: 'from-purple-500 to-indigo-400' },
    { label: t('defending'), value: safeAttributes.defending, icon: Shield, color: 'from-emerald-500 to-teal-400' },
    { label: t('physical'), value: safeAttributes.physical, icon: Trophy, color: 'from-orange-500 to-amber-400' },
  ];

  // Global rating index
  const overallRating = Math.round(
    (safeAttributes.pace +
      safeAttributes.shooting +
      safeAttributes.passing +
      safeAttributes.dribbling +
      safeAttributes.defending +
      safeAttributes.physical) /
      6
  );

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const top = e.currentTarget.scrollTop;
    setIsScrolled(top > 40);
  };

  const handleSharePlayer = () => {
    triggerShare({
      title: `${player.name} #${player.number} - ${clubInfo?.name || 'ASC Dialloré'}`,
      text: `Découvrez la fiche, les attributs et statistiques détaillées de ${playerFullName} (${player.positionDetail || player.position}) à l'${clubInfo?.name || 'ASC Dialloré'} !`,
      url: window.location.href,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-2 sm:p-4 animate-in fade-in overflow-hidden">
      <div className="w-full max-w-2xl rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden my-auto flex flex-col max-h-[94vh] transition-all duration-300 relative">
        
        {/* ========================================================= */}
        {/* BARRE FIXE EN HAUT : BANDEAU STICKY & CONTRÔLE DE SCROLL */}
        {/* ========================================================= */}
        <div
          className={`sticky top-0 z-30 transition-all duration-200 border-b border-slate-800 ${
            isScrolled || isCondensed
              ? 'bg-slate-950/95 backdrop-blur-md px-3 sm:px-5 py-2.5 shadow-lg'
              : 'bg-gradient-to-r from-slate-950 via-slate-900 to-emerald-950 px-4 sm:px-6 py-3'
          }`}
        >
          <div className="flex items-center justify-between gap-2 text-white">
            
            {/* Infos Joueur Condensées ou Identité */}
            <div className="flex items-center gap-2.5 min-w-0">
              {(isScrolled || isCondensed) ? (
                <div className="flex items-center gap-2.5 min-w-0 animate-in fade-in">
                  <div className="relative w-8 h-8 rounded-lg overflow-hidden border border-amber-500/80 bg-slate-850 flex-shrink-0">
                    <img
                      src={player.photoUrl}
                      alt={player.name}
                      className="w-full h-full object-cover object-top"
                      onError={(e) => {
                        (e.target as HTMLElement).style.display = 'none';
                      }}
                    />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5 truncate">
                      <span className="px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-400 font-mono font-black text-[10px]">
                        #{player.number}
                      </span>
                      <span className="font-extrabold text-xs sm:text-sm text-white truncate">
                        {playerFullName}
                      </span>
                      {player.isCaptain && (
                        <span className="hidden sm:inline px-1.5 py-0.2 rounded bg-amber-500 text-slate-950 font-black text-[9px]">
                          👑 Capitaine
                        </span>
                      )}
                    </div>
                    <p className="text-[10px] text-amber-400 font-semibold truncate">
                      {player.positionDetail || player.position} • Note: {overallRating}/99
                    </p>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-black bg-amber-500/20 text-amber-400 border border-amber-500/30 font-mono">
                    #{player.number} • {player.positionDetail || player.position}
                  </span>
                  {player.isCaptain && (
                    <span className="px-2 py-0.5 rounded-full bg-amber-500 text-slate-950 font-black text-[10px] shadow flex items-center gap-1">
                      👑 Capitaine
                    </span>
                  )}
                </div>
              )}
            </div>

            {/* Boutons d'Action & Bascule Compact / Détaillé */}
            <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
              <button
                type="button"
                onClick={() => setIsCondensed(!isCondensed)}
                className="px-2.5 py-1.5 rounded-xl bg-slate-800/90 hover:bg-slate-700 text-slate-300 hover:text-white transition text-xs font-bold flex items-center gap-1.5 border border-slate-700/80 shadow-sm"
                title={isCondensed ? "Agrandir l'en-tête détaillé" : "Réduire l'en-tête pour laisser toute la place à la carte résumé"}
              >
                {isCondensed ? (
                  <>
                    <Maximize2 className="w-3.5 h-3.5 text-amber-400" />
                    <span className="hidden sm:inline">Détaillé</span>
                  </>
                ) : (
                  <>
                    <Minimize2 className="w-3.5 h-3.5 text-amber-400" />
                    <span className="hidden sm:inline">Compact</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => setIsCVModalOpen(true)}
                className="px-2.5 py-1.5 rounded-xl bg-red-600 hover:bg-red-500 text-white transition text-xs font-black flex items-center gap-1.5 shadow-md shadow-red-600/30"
                title="Consulter le CV Sportif Officiel du Joueur"
              >
                <FileText className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">CV Sportif</span>
              </button>

              <button
                type="button"
                onClick={handleSharePlayer}
                className="p-1.5 sm:p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white transition"
                title="Partager ce joueur"
              >
                <Share2 className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => setSelectedPlayerId(null)}
                className="p-1.5 sm:p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white transition"
                title="Fermer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* ========================================================= */}
        {/* CORPS REGROUPÉ DANS LE DÉFILEMENT (FLUX DE SCROLL UNIQUE)  */}
        {/* Regroupe la section sombre & la carte résumé ensemble     */}
        {/* ========================================================= */}
        <div
          ref={scrollContainerRef}
          onScroll={handleScroll}
          className="overflow-y-auto flex-1 flex flex-col scroll-smooth"
        >
          {/* ------------------------------------------------------- */}
          {/* PARTIE 1 : SECTION SOMBRE (MODAL DÉTAILLÉ)             */}
          {/* Conserve rigoureusement ses couleurs dégradées sombres */}
          {/* ------------------------------------------------------- */}
          {!isCondensed && (
            <div className="relative bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950 text-white p-5 sm:p-6 border-b border-slate-800 flex-shrink-0 transition-all duration-300 overflow-hidden">
              {clubInfo.backgroundUrls?.modalPlayerBg && (
                <img
                  src={clubInfo.backgroundUrls.modalPlayerBg}
                  alt=""
                  className="absolute inset-0 w-full h-full object-cover opacity-20 pointer-events-none"
                />
              )}
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
                <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden border-2 border-amber-500 shadow-xl bg-slate-800 flex-shrink-0">
                  <img
                    src={player.photoUrl}
                    alt={player.name}
                    className="w-full h-full object-cover object-top"
                    onError={(e) => {
                      (e.target as HTMLElement).style.display = 'none';
                    }}
                  />
                  <span className="absolute bottom-1 right-1 px-1.5 py-0.5 rounded bg-slate-950/90 text-amber-400 font-mono text-xs font-black">
                    #{player.number}
                  </span>
                </div>

                <div className="flex-1 text-center sm:text-left">
                  <div className="flex items-center justify-center sm:justify-start gap-2">
                    <span className="text-xl">{playerFlag}</span>
                    <h2 className="text-xl sm:text-2xl font-black text-white">
                      {playerFullName}
                    </h2>
                  </div>
                  <p className="text-xs text-amber-400 font-semibold mt-0.5">
                    {player.nationality} • Né le {player.birthDate || '15/04/2005'} ({player.age} ans)
                  </p>

                  {(player.isCaptain || player.id === 'p1' || player.id === 'p-cisse') && (
                    <div className="mt-2 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 font-black text-[11px] shadow">
                      <span>👑</span>
                      <span>Capitaine & Buteur N°1 (28 buts)</span>
                    </div>
                  )}

                  {/* Badges Grid */}
                  <div className="mt-3 flex flex-wrap justify-center sm:justify-start gap-1.5 text-[11px] text-slate-300">
                    <span className="px-2 py-0.5 rounded-lg bg-slate-800 border border-slate-700">
                      Taille : {player.height || '1.83 m'}
                    </span>
                    <span className="px-2 py-0.5 rounded-lg bg-slate-800 border border-slate-700">
                      Poids : {player.weight || '74 kg'}
                    </span>
                    <span className="px-2 py-0.5 rounded-lg bg-slate-800 border border-slate-700">
                      Pied : {player.preferredFoot || 'Droit'}
                    </span>
                    <span className="px-2 py-0.5 rounded-lg bg-amber-500/10 text-amber-300 border border-amber-500/20 font-bold">
                      Valeur : {player.marketValue || '1.8 M€'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ------------------------------------------------------- */}
          {/* PARTIE 2 : SECTION CARTE RÉSUMÉ & ONGLETS              */}
          {/* Conserve rigoureusement ses couleurs claires / sombres  */}
          {/* ------------------------------------------------------- */}
          <div className="bg-white dark:bg-slate-900 flex-1 flex flex-col">
            
            {/* SOUS-ONGLETS DE NAVIGATION (STICKY PENDANT LE SCROLL) */}
            <div className="sticky top-0 z-20 flex border-b border-slate-200 dark:border-slate-800 bg-slate-50/95 dark:bg-slate-950/95 backdrop-blur-md px-4 flex-shrink-0">
              <button
                type="button"
                onClick={() => setActiveTab('attributes')}
                className={`py-3 px-4 text-xs font-extrabold border-b-2 transition flex items-center gap-1.5 ${
                  activeTab === 'attributes'
                    ? 'border-amber-500 text-amber-500 dark:text-amber-400'
                    : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-slate-300'
                }`}
              >
                <Zap className="w-3.5 h-3.5" />
                <span>Fiche & Attributs ({overallRating})</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('stats')}
                className={`py-3 px-4 text-xs font-extrabold border-b-2 transition flex items-center gap-1.5 ${
                  activeTab === 'stats'
                    ? 'border-amber-500 text-amber-500 dark:text-amber-400'
                    : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-slate-300'
                }`}
              >
                <Activity className="w-3.5 h-3.5" />
                <span>Statistiques Saison</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('bio')}
                className={`py-3 px-4 text-xs font-extrabold border-b-2 transition flex items-center gap-1.5 ${
                  activeTab === 'bio'
                    ? 'border-amber-500 text-amber-500 dark:text-amber-400'
                    : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-slate-300'
                }`}
              >
                <Trophy className="w-3.5 h-3.5" />
                <span>Biographie & Palmarès</span>
              </button>

              <button
                type="button"
                onClick={() => setIsCVModalOpen(true)}
                className="py-3 px-4 text-xs font-black border-b-2 border-transparent text-red-600 dark:text-red-400 hover:text-red-500 transition flex items-center gap-1.5 ml-auto"
                title="Consulter ou modifier le CV Sportif Officiel"
              >
                <FileText className="w-3.5 h-3.5 text-red-500" />
                <span>CV Sportif 📄</span>
              </button>
            </div>

            {/* CONTENU PRINCIPAL AVEC LA CARTE RÉSUMÉ PLEINEMENT DÉGAGÉE */}
            <div className="p-4 sm:p-6 space-y-6 flex-1">
              
              {/* 1. CARTE RÉSUMÉ & ATTRIBUTS */}
              {activeTab === 'attributes' && (
                <div className="space-y-5 animate-in fade-in">
                  
                  {/* Carte Résumé du Profil & Rôle Tactique */}
                  <div className="p-4 sm:p-5 rounded-3xl bg-gradient-to-r from-slate-900 via-slate-850 to-emerald-950 text-white border border-slate-800 shadow-md">
                    <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                      <div className="flex items-center gap-2">
                        <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                        <span className="text-xs font-black uppercase tracking-wider text-slate-200">
                          Carte Résumé du Profil & Rôle Tactique
                        </span>
                      </div>
                      <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-mono font-bold">
                        Note Globale : {overallRating}/99
                      </span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 text-center text-xs">
                      <div className="p-2.5 rounded-2xl bg-slate-800/60 border border-slate-700/60">
                        <span className="text-[10px] text-slate-400 block font-semibold">Poste de prédilection</span>
                        <span className="font-extrabold text-amber-400 text-xs mt-0.5 block">{player.positionDetail || player.position}</span>
                      </div>
                      <div className="p-2.5 rounded-2xl bg-slate-800/60 border border-slate-700/60">
                        <span className="text-[10px] text-slate-400 block font-semibold">Buts cette saison</span>
                        <span className="font-black text-rose-400 font-mono text-sm mt-0.5 block">{playerStats.goals} buts</span>
                      </div>
                      <div className="p-2.5 rounded-2xl bg-slate-800/60 border border-slate-700/60">
                        <span className="text-[10px] text-slate-400 block font-semibold">Passes décisives</span>
                        <span className="font-black text-blue-400 font-mono text-sm mt-0.5 block">{playerStats.assists} assists</span>
                      </div>
                      <div className="p-2.5 rounded-2xl bg-slate-800/60 border border-slate-700/60">
                        <span className="text-[10px] text-slate-400 block font-semibold">Vitesse de pointe</span>
                        <span className="font-black text-emerald-400 font-mono text-sm mt-0.5 block">{safeAttributes.pace}/99</span>
                      </div>
                    </div>
                  </div>

                  {/* Grille des 6 Attributs Athlétiques & Techniques */}
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
                        <Zap className="w-3.5 h-3.5 text-amber-500" />
                        <span>Attributs Athlétiques & Techniques FIFA / Pro</span>
                      </h4>
                      <span className="text-[11px] text-slate-500 dark:text-slate-400">Évaluation officielle de l'Académie</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {attributesList.map(attr => {
                        const Icon = attr.icon;
                        return (
                          <div
                            key={attr.label}
                            className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800 space-y-1.5 hover:border-amber-500/40 transition"
                          >
                            <div className="flex items-center justify-between text-xs font-bold">
                              <div className="flex items-center gap-1.5 text-slate-700 dark:text-slate-200">
                                <Icon className="w-3.5 h-3.5 text-amber-500" />
                                <span>{attr.label}</span>
                              </div>
                              <span className="text-amber-500 font-mono text-sm font-black">
                                {attr.value}/99
                              </span>
                            </div>
                            
                            <div className="h-2 w-full rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                              <div
                                className={`h-full bg-gradient-to-r ${attr.color} rounded-full transition-all duration-700`}
                                style={{ width: `${Math.min(attr.value, 100)}%` }}
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Qualités et Style de Jeu */}
                  <div className="p-4 rounded-2xl bg-amber-500/5 dark:bg-amber-500/10 border border-amber-500/20 space-y-2">
                    <h4 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
                      <Flame className="w-3.5 h-3.5 text-amber-500" />
                      <span>Points Forts & Profil Athlétique</span>
                    </h4>
                    <div className="flex flex-wrap gap-2 text-xs">
                      <span className="px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 font-bold shadow-sm">
                        ⚡ Vitesse d'accélération & percussion
                      </span>
                      <span className="px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 font-bold shadow-sm">
                        🎯 Sang-froid devant le but
                      </span>
                      <span className="px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 font-bold shadow-sm">
                        👑 Leadership & mental de vainqueur
                      </span>
                      <span className="px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 font-bold shadow-sm">
                        🌪️ Dribble éliminatoire & 1 contre 1
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* 2. STATISTIQUES SAISON */}
              {activeTab === 'stats' && (
                <div className="space-y-4 animate-in fade-in">
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800 text-center">
                      <span className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white font-mono">
                        {playerStats.matches}
                      </span>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 font-semibold">
                        {t('matches_played')}
                      </p>
                    </div>

                    <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-center">
                      <span className="text-2xl sm:text-3xl font-black text-amber-500 font-mono">
                        {playerStats.goals}
                      </span>
                      <p className="text-[11px] text-amber-600 dark:text-amber-400 mt-1 font-bold">
                        {t('goals_scored')}
                      </p>
                    </div>

                    <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800 text-center">
                      <span className="text-2xl sm:text-3xl font-black text-blue-500 font-mono">
                        {playerStats.assists}
                      </span>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 font-semibold">
                        {t('assists')}
                      </p>
                    </div>

                    <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800 text-center">
                      <span className="text-2xl sm:text-3xl font-black text-emerald-500 font-mono">
                        {playerStats.minutesPlayed}'
                      </span>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 font-semibold">
                        {t('minutes_played')}
                      </p>
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/30 border border-slate-200/80 dark:border-slate-800 space-y-2 text-xs">
                    <div className="flex justify-between py-1.5 border-b border-slate-200 dark:border-slate-800">
                      <span className="text-slate-500 dark:text-slate-400 font-medium">Précision des passes</span>
                      <span className="font-bold text-slate-900 dark:text-white font-mono">{playerStats.passAccuracy}%</span>
                    </div>
                    <div className="flex justify-between py-1.5 border-b border-slate-200 dark:border-slate-800">
                      <span className="text-slate-500 dark:text-slate-400 font-medium">Tacles réussis par match</span>
                      <span className="font-bold text-slate-900 dark:text-white font-mono">{player.tacklesPerGame || 1.1}</span>
                    </div>
                    <div className="flex justify-between py-1.5 border-b border-slate-200 dark:border-slate-800">
                      <span className="text-slate-500 dark:text-slate-400 font-medium">Cartons jaunes reçus</span>
                      <span className="font-bold text-amber-500 font-mono">{playerStats.yellowCards}</span>
                    </div>
                    <div className="flex justify-between py-1.5">
                      <span className="text-slate-500 dark:text-slate-400 font-medium">Cartons rouges</span>
                      <span className="font-bold text-rose-500 font-mono">{playerStats.redCards}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* 3. BIOGRAPHIE & PALMARÈS */}
              {activeTab === 'bio' && (
                <div className="space-y-4 animate-in fade-in">
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                      <Compass className="w-3.5 h-3.5 text-amber-500" />
                      <span>Parcours, Formation & Origines</span>
                    </h4>
                    <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-slate-800/40 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800">
                      {player.bio ||
                        `${playerFullName} est un talent d'élite formé sous les couleurs de l'Académie Future Pro (Touba-Mbacké). Reconnu pour sa rigueur tactique et son dévouement envers l'équipe.`}
                    </p>
                  </div>

                  {/* Trophies */}
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-2 flex items-center gap-1.5">
                      <Trophy className="w-4 h-4 text-amber-500" />
                      <span>Palmarès & Titres Remportés</span>
                    </h4>
                    <div className="space-y-1.5">
                      {playerTrophies.length > 0 ? (
                        playerTrophies.map((trophy, i) => (
                          <div
                            key={i}
                            className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300 font-medium"
                          >
                            <Award className="w-4 h-4 text-amber-500 flex-shrink-0" />
                            <span>{trophy}</span>
                          </div>
                        ))
                      ) : (
                        <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 text-xs text-slate-500">
                          Vainqueur du Tournoi Régional de Diourbel • Finaliste Coupe de Touba
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

            </div>
          </div>
        </div>

        {/* ========================================================= */}
        {/* PIED DE PAGE DU MODAL                                     */}
        {/* ========================================================= */}
        <div className="p-3 sm:p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/90 dark:bg-slate-950/90 flex items-center justify-between flex-shrink-0 text-xs">
          <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
            <span>Contrat jusqu'en <strong>{player.contractUntil || '2028'}</strong></span>
            <span>•</span>
            <span className="font-bold text-amber-500">{player.marketValue || '1.8 M€'}</span>
          </div>
          <button
            type="button"
            onClick={() => setSelectedPlayerId(null)}
            className="px-5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-950 font-bold transition shadow"
          >
            {t('close')}
          </button>
        </div>

        {/* Modale Officielle CV Sportif (Auto-créé + Modification Admin) */}
        <PlayerCVModal
          player={player}
          isOpen={isCVModalOpen}
          onClose={() => setIsCVModalOpen(false)}
        />
      </div>
    </div>
  );
};
