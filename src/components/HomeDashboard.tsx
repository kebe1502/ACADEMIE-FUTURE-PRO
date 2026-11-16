import React from 'react';
import {
  Flame,
  Calendar,
  ArrowRight,
  Trophy,
  Users,
  ShieldCheck,
  Shield,
  Zap,
  TrendingUp,
  MapPin,
  Clock,
  Radio,
  Palmtree,
  Sun,
  Award,
  Activity,
  GraduationCap,
  BookOpen,
  Target,
  Sparkles,
  ChevronRight,
  Compass,
  CheckCircle2,
  Building2,
  Globe2,
  Crown,
  Image as ImageIcon,
  Edit,
  Layers,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { MATCHES_DATA, PLAYERS_DATA, NEWS_DATA, CLUB_INFO } from '../data/clubData';
import { getAccentStyles } from '../utils/theme';
import { getPlayerFullName, getPlayerFlag, getPlayerStats } from '../utils/playerHelpers';
import { MatchPosterBanner } from './MatchPosterBanner';

export const HomeDashboard: React.FC = () => {
  const {
    setActiveTab,
    setSelectedMatchId,
    setSelectedPlayerId,
    setSelectedNewsId,
    themeAccent,
    t,
    players,
    matches,
    clubInfo,
    members,
    staff,
    gallery,
    isAdminLoggedIn,
    standings,
    tacticalFormations,
    activeFormationId,
    setActiveFormationId,
  } = useApp();

  const accent = getAccentStyles(themeAccent);

  const ongamMatch = matches.find(m => m.id === 'm-ongam-1');
  const lastMatch = matches.find(m => m.id === 'm-last-manko') || matches[0];
  const nextBigMatch = matches.find(m => m.status === 'upcoming') || matches[1] || matches[0];
  const starPlayer = players.find(p => p.isCaptain) || players[0] || null;
  const otherTalents = players.filter(p => p.id !== starPlayer?.id).slice(0, 3);

  const currentFormation =
    tacticalFormations?.find(f => f.id === activeFormationId) ||
    tacticalFormations?.find(f => f.isDefault) ||
    tacticalFormations?.[0];

  const ourClubRow = standings?.find(s => s.isOurClub || s.teamName.toLowerCase().includes('diallor')) || standings?.[0];

  return (
    <div className="space-y-12 animate-in fade-in">
      
      {/* ========================================================= */}
      {/* 1. BANDEAU INSTITUTIONNEL HAUT DE GAMME (STYLE DIAMBARS)   */}
      {/* "Faire du football un moteur d'éducation & d'excellence"   */}
      {/* ========================================================= */}
      <div className="relative rounded-3xl overflow-hidden bg-slate-950 border border-slate-800 shadow-2xl p-6 sm:p-10 lg:p-12 text-white min-h-[480px] flex items-center">
        {/* Arrière-plan dynamique et modifiable par l'Admin : Effectif officiel / Arrière-plan du club */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          <img
            src={clubInfo.backgroundUrls?.homeHero || clubInfo.bannerBackgroundUrl || '/diallore-team-banner.jpg'}
            alt="Effectif officiel des jeunes joueurs de l'ASC Dialloré sur le terrain de Touba-Mbacké"
            className="w-full h-full object-cover object-[center_35%]"
            referrerPolicy="no-referrer"
          />
          {/* Léger voile translucide dégradé sur le côté gauche uniquement pour permettre une lecture parfaite des textes tout en laissant toute la photo à découvert */}
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950/80 via-slate-950/40 to-transparent pointer-events-none" />
          <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-slate-950/80 to-transparent pointer-events-none" />
        </div>

        {/* Soft background lighting / glow */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-red-600/10 rounded-full blur-3xl pointer-events-none z-0" />
        <div className="absolute bottom-0 left-0 w-[350px] h-[350px] bg-amber-500/10 rounded-full blur-3xl pointer-events-none z-0" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          <div className="lg:col-span-8 space-y-4 text-center lg:text-left">
            {/* Academy Institutional Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-red-600/35 text-red-100 border border-red-500/50 text-xs font-black tracking-widest uppercase shadow-lg backdrop-blur-md">
              <GraduationCap className="w-4 h-4 text-amber-400" />
              <span>Institut de Formation & de Football • Touba-Mbacké</span>
            </div>

            {/* Slogan Diambars Style */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight drop-shadow-[0_3px_10px_rgba(0,0,0,0.85)]">
              Faire du football un <br className="hidden sm:inline" />
              <span className="bg-gradient-to-r from-amber-400 via-yellow-300 to-red-400 bg-clip-text text-transparent">
                moteur d'éducation
              </span>{' '}
              et d'excellence
            </h1>

            <p className="text-sm sm:text-base text-white/95 max-w-2xl leading-relaxed drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)] font-medium">
              Inspirée par la vision des plus grandes académies comme l'<strong>Institut Diambars</strong>, l'<strong>{clubInfo.name}</strong> forme l'élite de demain : des athlètes rigoureux, instruits et dotés de valeurs citoyennes exemplaires, prêts pour le football professionnel national et international.
            </p>

            {/* Quick action buttons */}
            <div className="pt-2 flex flex-wrap items-center justify-center lg:justify-start gap-3">
              <button
                onClick={() => setActiveTab('team')}
                className="px-6 py-3.5 rounded-2xl bg-red-600 hover:bg-red-500 text-white text-xs font-black transition flex items-center gap-2 shadow-lg shadow-red-950/60 active:scale-95"
              >
                <Users className="w-4 h-4" />
                <span>Explorer l'Effectif & les Joueurs</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={() => setActiveTab('matches')}
                className="px-6 py-3.5 rounded-2xl bg-slate-900/90 hover:bg-slate-800 text-slate-200 text-xs font-bold border border-slate-700/80 transition flex items-center gap-2 shadow backdrop-blur-md"
              >
                <Calendar className="w-4 h-4 text-amber-400" />
                <span>Calendrier Officiel 2026</span>
              </button>

              <a
                href="#classement-section"
                className="px-5 py-3.5 rounded-2xl bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 text-xs font-bold border border-amber-500/40 transition flex items-center gap-1.5 backdrop-blur-md"
              >
                <Trophy className="w-3.5 h-3.5 text-amber-400" />
                <span>Classement (1er)</span>
              </a>

              <a
                href="#tactique-section"
                className="px-5 py-3.5 rounded-2xl bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-300 text-xs font-bold border border-emerald-500/40 transition flex items-center gap-1.5 backdrop-blur-md"
              >
                <Compass className="w-3.5 h-3.5 text-emerald-400" />
                <span>Schéma Tactique</span>
              </a>

              <button
                onClick={() => setActiveTab('member')}
                className="px-5 py-3.5 rounded-2xl bg-white/10 hover:bg-white/15 text-slate-200 text-xs font-bold border border-white/15 transition flex items-center gap-1.5 backdrop-blur-md"
              >
                <Users className="w-3.5 h-3.5 text-slate-300" />
                <span>Espace Membres</span>
              </button>
            </div>
          </div>

          {/* Right Highlights Pill / Institute Identity */}
          <div className="lg:col-span-4 flex justify-center">
            <div className="w-full max-w-sm rounded-3xl bg-slate-950/85 border border-slate-700/80 p-6 shadow-2xl backdrop-blur-xl space-y-4">
              <div className="flex items-center gap-3.5 border-b border-slate-800 pb-4">
                <div className="w-14 h-14 rounded-2xl bg-white dark:bg-slate-950 border-2 border-red-500/50 flex items-center justify-center shadow-lg p-2 flex-shrink-0">
                  <img src={clubInfo.logoUrl || '/icon.svg'} alt={clubInfo.name} className="w-full h-full object-contain" />
                </div>
                <div>
                  <h3 className="text-base font-black text-white">{clubInfo.name}</h3>
                  <p className="text-xs text-amber-400 font-semibold">Fondation {clubInfo.foundedYear} • Touba-Mbacké</p>
                  <p className="text-[11px] text-slate-400">Pôle Cadets, Juniors & Élite</p>
                </div>
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-800/60 border border-slate-700/50">
                  <span className="text-slate-400">Programme Sport-Études</span>
                  <span className="font-black text-emerald-400">100% Réussite</span>
                </div>
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-800/60 border border-slate-700/50">
                  <span className="text-slate-400">Entraîneur Principal</span>
                  <span className="font-bold text-white">{clubInfo.coach}</span>
                </div>
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-800/60 border border-slate-700/50">
                  <span className="text-slate-400">Dernier résultat</span>
                  <span className="font-black text-amber-400">3 - 0 (Victoire par forfait)</span>
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-center text-xs text-emerald-300 font-medium">
                « Éduquer par la passion du jeu et hisser les talents vers l'élite. »
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* ========================================================= */}
      {/* 2. LES 4 PILIERS DU MODÈLE DIAMBARS                        */}
      {/* ========================================================= */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
          <div>
            <span className="text-xs font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-widest">
              L'ADN de l'Institut
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
              Les 4 Piliers de l'Académie
            </h2>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Une méthodologie intégrale inspirée des standards mondiaux
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* Pilier 1: Sport-Études */}
          <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:border-emerald-500/50 transition space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center border border-emerald-500/20">
              <BookOpen className="w-6 h-6" />
            </div>
            <h3 className="text-base font-black text-slate-900 dark:text-white">
              Sport-Études & Éducation
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              La scolarité est prioritaire. Chaque académicien bénéficie d'un suivi pédagogique rigoureux pour garantir son diplôme et son avenir hors du terrain.
            </p>
          </div>

          {/* Pilier 2: Pôle Performance Tactique */}
          <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:border-amber-500/50 transition space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center border border-amber-500/20">
              <Target className="w-6 h-6" />
            </div>
            <h3 className="text-base font-black text-slate-900 dark:text-white">
              Pôle Performance & Tactique
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Méthode d'entraînement axée sur le jeu de transition rapide, la maîtrise technique, la préparation athlétique et l'analyse vidéo sous la houlette de Coach Gagne.
            </p>
          </div>

          {/* Pilier 3: Vivier & Détection Baol */}
          <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:border-blue-500/50 transition space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center border border-blue-500/20">
              <Compass className="w-6 h-6" />
            </div>
            <h3 className="text-base font-black text-slate-900 dark:text-white">
              Détection & Vivier de Talents
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Un réseau de recruteurs présent à Touba, Mbacké, Diourbel et dans tout le Sénégal pour identifier et couver les jeunes prodiges dès leur plus jeune âge.
            </p>
          </div>

          {/* Pilier 4: Tremplin Professionnel */}
          <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:border-purple-500/50 transition space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center border border-purple-500/20">
              <Globe2 className="w-6 h-6" />
            </div>
            <h3 className="text-base font-black text-slate-900 dark:text-white">
              Passerelle Professionnelle
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Mise en visibilité des talents auprès des clubs de Ligue 1 sénégalaise et des championnats internationaux pour propulser nos diplômés au plus haut niveau.
            </p>
          </div>

        </div>
      </div>

      {/* ========================================================= */}
      {/* 3. MATCH POSTER OFFICIEL & ANNONCES                       */}
      {/* ========================================================= */}
      <MatchPosterBanner />

      {/* Bannière Victoire par Forfait 3-0 */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-emerald-950 via-slate-900 to-amber-950 border border-emerald-700/60 p-5 sm:p-7 text-white shadow-xl">
        {clubInfo.backgroundUrls?.homeOngamEvent && (
          <img
            src={clubInfo.backgroundUrls.homeOngamEvent}
            alt=""
            className="absolute inset-0 w-full h-full object-cover opacity-20 pointer-events-none"
          />
        )}
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-5 relative z-10">
          <div className="flex items-start sm:items-center gap-4">
            <div className="p-3.5 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex-shrink-0">
              <Trophy className="w-7 h-7 text-amber-400" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-black uppercase tracking-wider border border-emerald-500/40">
                  ✅ Victoire par Forfait (3 - 0)
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[10px] font-black uppercase tracking-wider border border-amber-500/40">
                  🏆 Championnat ONGAM/Cadets 2026 • 1ère Journée
                </span>
                <span className="text-xs font-bold text-slate-300">
                  Mbacké • Teriann École Ndiagalak (25 Sept. 09H00)
                </span>
              </div>
              <h2 className="text-base sm:text-xl font-black tracking-tight mt-1.5 text-white">
                {clubInfo.name} gagne par forfait ({ongamMatch?.homeScore || 3} - {ongamMatch?.awayScore || 0}) face à {ongamMatch?.opponent || 'l’ASC ESCALE DE MBACKÉ'} !
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 max-w-2xl mt-1 leading-relaxed">
                L’<strong>{ongamMatch?.opponent || 'ASC ESCALE DE MBACKÉ'}</strong> ne s’est pas présentée au TERIANN ÉCOLE NDIAGALAK ce Vendredi 25 Septembre 2026 à 09H00. Le corps arbitral officiel a consigné le forfait : l’<strong>{clubInfo.name}</strong> remporte la partie sur tapis vert ({ongamMatch?.homeScore || 3} - {ongamMatch?.awayScore || 0}) et empoche ses 3 premiers points de la saison.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 flex-wrap flex-shrink-0">
            <button
              onClick={() => setSelectedMatchId('m-ongam-1')}
              className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black transition flex items-center gap-1.5 shadow-md active:scale-95"
            >
              <Trophy className="w-3.5 h-3.5" />
              <span>Feuille du match (3 - 0)</span>
            </button>
            <button
              onClick={() => setSelectedMatchId(lastMatch.id)}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-slate-700 transition flex items-center gap-1.5 shadow-md"
            >
              <span>Match Amical (3 - 1)</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
            {starPlayer && (
              <button
                onClick={() => setSelectedPlayerId(starPlayer.id)}
                className="px-4 py-2.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 text-xs font-bold border border-amber-500/40 transition flex items-center gap-1.5 shadow-md"
              >
                <Zap className="w-3.5 h-3.5 text-amber-400" />
                <span>Fiche & Attributs Capitaine</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ========================================================= */}
      {/* 4. CLASSEMENT OFFICIEL DU CHAMPIONNAT (STANDINGS)         */}
      {/* ========================================================= */}
      <div id="classement-section" className="space-y-6 scroll-mt-24">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 text-amber-500 text-xs font-black uppercase tracking-wider border border-amber-500/20 mb-2">
              <Trophy className="w-3.5 h-3.5" />
              <span>Championnat ONGAM Cadets 2026 • Poule A</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              Classement Officiel du Championnat
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
              Position en direct de l'ASC Dialloré et des clubs rivaux de Touba-Mbacké.
            </p>
          </div>

          <div className="flex items-center gap-2.5 flex-wrap">
            <button
              onClick={() => setActiveTab('matches')}
              className="px-4 py-2.5 rounded-xl bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 dark:hover:bg-slate-700 text-white text-xs font-bold border border-slate-700 transition flex items-center gap-1.5 shadow"
            >
              <Calendar className="w-3.5 h-3.5 text-amber-400" />
              <span>Calendrier & Résultats</span>
            </button>
            {isAdminLoggedIn && (
              <button
                onClick={() => setActiveTab('admin')}
                className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-black transition flex items-center gap-1.5 shadow-md shadow-amber-500/20"
              >
                <Edit className="w-3.5 h-3.5" />
                <span>Gérer le Classement (Admin)</span>
              </button>
            )}
          </div>
        </div>

        {/* Quick Highlights Cards for our Club */}
        {ourClubRow && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-4 rounded-2xl bg-gradient-to-br from-amber-500/15 to-amber-600/5 border border-amber-500/30">
              <span className="text-[11px] font-bold text-amber-500 uppercase tracking-wider block">
                Position Actuelle
              </span>
              <div className="flex items-baseline gap-1.5 mt-1">
                <span className="text-2xl font-black text-amber-500 font-mono">
                  {ourClubRow.position === 1 ? '1er' : `${ourClubRow.position}e`}
                </span>
                <span className="text-xs text-slate-500 dark:text-slate-400 font-bold">
                  {ourClubRow.position === 1 ? '• Leader' : 'au classement'}
                </span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                Points Inscrits
              </span>
              <div className="flex items-baseline gap-1.5 mt-1">
                <span className="text-2xl font-black text-slate-900 dark:text-white font-mono">
                  {ourClubRow.points}
                </span>
                <span className="text-xs text-emerald-500 font-bold">PTS</span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                Bilan (V - N - D)
              </span>
              <div className="flex items-baseline gap-1 mt-1 font-mono font-black text-slate-900 dark:text-white text-lg">
                <span className="text-emerald-500">{ourClubRow.won}V</span>
                <span className="text-slate-400">-</span>
                <span className="text-slate-400">{ourClubRow.drawn}N</span>
                <span className="text-slate-400">-</span>
                <span className="text-red-500">{ourClubRow.lost}D</span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                Différence de Buts
              </span>
              <div className="flex items-baseline gap-1.5 mt-1 font-mono">
                <span className="text-2xl font-black text-emerald-500">
                  {ourClubRow.goalDifference > 0 ? `+${ourClubRow.goalDifference}` : ourClubRow.goalDifference}
                </span>
                <span className="text-[11px] text-slate-400 font-normal">
                  ({ourClubRow.goalsFor} BP / {ourClubRow.goalsAgainst} BC)
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Standings Table Card */}
        <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-950 text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider border-b border-slate-200 dark:border-slate-800">
                  <th className="py-3.5 px-4 text-center w-14">Pos</th>
                  <th className="py-3.5 px-4">Club / Équipe</th>
                  <th className="py-3.5 px-3 text-center">J</th>
                  <th className="py-3.5 px-3 text-center">V</th>
                  <th className="py-3.5 px-3 text-center">N</th>
                  <th className="py-3.5 px-3 text-center">D</th>
                  <th className="py-3.5 px-3 text-center hidden sm:table-cell">BP</th>
                  <th className="py-3.5 px-3 text-center hidden sm:table-cell">BC</th>
                  <th className="py-3.5 px-3 text-center">DIFF</th>
                  <th className="py-3.5 px-4 text-center font-black text-slate-900 dark:text-white">PTS</th>
                  <th className="py-3.5 px-3 text-center hidden md:table-cell">Forme</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-medium">
                {standings && standings.length > 0 ? (
                  standings.map((row) => {
                    const isFirst = row.position === 1;
                    const isPodium = row.position <= 3;
                    const isCurrentClub = Boolean(row.isOurClub || row.teamName.toLowerCase().includes('diallor'));

                    return (
                      <tr
                        key={row.id}
                        className={`transition-colors ${
                          isCurrentClub
                            ? 'bg-amber-500/10 dark:bg-amber-500/15 font-bold hover:bg-amber-500/20'
                            : 'hover:bg-slate-50 dark:hover:bg-slate-800/50'
                        }`}
                      >
                        {/* Position Badge */}
                        <td className="py-3.5 px-4 text-center">
                          <span
                            className={`inline-flex items-center justify-center w-6 h-6 rounded-lg text-xs font-black ${
                              isFirst
                                ? 'bg-amber-500 text-slate-950 shadow-sm shadow-amber-500/40'
                                : isPodium
                                ? 'bg-blue-600 text-white'
                                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                            }`}
                          >
                            {row.position}
                          </span>
                        </td>

                        {/* Team Name & Crest */}
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-3">
                            <div className="w-7 h-7 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center overflow-hidden flex-shrink-0 border border-slate-200 dark:border-slate-700">
                              {row.logoUrl ? (
                                <img src={row.logoUrl} alt={row.teamName} className="w-full h-full object-contain p-0.5" />
                              ) : (
                                <Shield className="w-4 h-4 text-slate-400" />
                              )}
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <span className={`text-xs font-extrabold ${isCurrentClub ? 'text-amber-500' : 'text-slate-900 dark:text-white'}`}>
                                  {row.teamName}
                                </span>
                                {isCurrentClub && (
                                  <span className="px-1.5 py-0.5 rounded-md bg-amber-500 text-slate-950 text-[10px] font-black uppercase">
                                    Notre Club
                                  </span>
                                )}
                              </div>
                              {row.notes && (
                                <span className="text-[10px] text-slate-400 block font-normal">
                                  {row.notes}
                                </span>
                              )}
                            </div>
                          </div>
                        </td>

                        <td className="py-3.5 px-3 text-center text-slate-600 dark:text-slate-300 font-mono">{row.played}</td>
                        <td className="py-3.5 px-3 text-center text-emerald-600 dark:text-emerald-400 font-bold font-mono">{row.won}</td>
                        <td className="py-3.5 px-3 text-center text-slate-500 font-mono">{row.drawn}</td>
                        <td className="py-3.5 px-3 text-center text-red-500 font-mono">{row.lost}</td>
                        <td className="py-3.5 px-3 text-center text-slate-500 hidden sm:table-cell font-mono">{row.goalsFor}</td>
                        <td className="py-3.5 px-3 text-center text-slate-500 hidden sm:table-cell font-mono">{row.goalsAgainst}</td>
                        <td className="py-3.5 px-3 text-center font-bold font-mono">
                          <span className={row.goalDifference > 0 ? 'text-emerald-600 dark:text-emerald-400' : row.goalDifference < 0 ? 'text-red-500' : 'text-slate-400'}>
                            {row.goalDifference > 0 ? `+${row.goalDifference}` : row.goalDifference}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-center">
                          <span className="inline-block px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 font-black text-slate-900 dark:text-white font-mono text-sm">
                            {row.points}
                          </span>
                        </td>
                        <td className="py-3.5 px-3 text-center hidden md:table-cell">
                          <div className="flex items-center justify-center gap-1">
                            {row.form && row.form.length > 0 ? (
                              row.form.map((res, i) => (
                                <span
                                  key={i}
                                  className={`w-4 h-4 rounded-full text-[9px] font-black flex items-center justify-center text-white ${
                                    res === 'V'
                                      ? 'bg-emerald-500'
                                      : res === 'N'
                                      ? 'bg-slate-400'
                                      : 'bg-red-500'
                                  }`}
                                >
                                  {res}
                                </span>
                              ))
                            ) : (
                              <span className="text-slate-400 text-[10px]">-</span>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={11} className="py-8 text-center text-slate-400">
                      Aucune donnée de classement disponible.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="p-3.5 bg-slate-50 dark:bg-slate-950/70 border-t border-slate-200 dark:border-slate-800 text-[11px] text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-2">
            <span>Règle : 3 pts par victoire, 1 pt par match nul • Les 2 premiers se qualifient pour les demi-finales départementales.</span>
            <button
              onClick={() => setActiveTab('matches')}
              className="text-amber-500 font-bold hover:underline flex items-center gap-1 flex-shrink-0"
            >
              Consulter le calendrier complet des rencontres <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* ========================================================= */}
      {/* 5. SCHÉMA TACTIQUE & LE 11 DE DÉPART (COACH GAGNE)         */}
      {/* ========================================================= */}
      {currentFormation && (
        <div id="tactique-section" className="space-y-6 scroll-mt-24">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-500 text-xs font-black uppercase tracking-wider border border-emerald-500/20 mb-2">
                <Compass className="w-3.5 h-3.5" />
                <span>Tactique de Match • Coach Gagne</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                Schéma Tactique & 11 de Départ
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
                Dispositif officiel de l'ASC Dialloré sur le terrain, titulaires et principes de jeu pour la victoire.
              </p>
            </div>

            <div className="flex items-center gap-2.5 flex-wrap">
              <button
                onClick={() => setActiveTab('team')}
                className="px-4 py-2.5 rounded-xl bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 dark:hover:bg-slate-700 text-white text-xs font-bold border border-slate-700 transition flex items-center gap-1.5 shadow"
              >
                <Users className="w-3.5 h-3.5 text-emerald-400" />
                <span>Effectif Complet ({players.length})</span>
              </button>
              {isAdminLoggedIn && (
                <button
                  onClick={() => setActiveTab('admin')}
                  className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black transition flex items-center gap-1.5 shadow-md shadow-emerald-600/20"
                >
                  <Edit className="w-3.5 h-3.5" />
                  <span>Gérer les Schémas (Admin)</span>
                </button>
              )}
            </div>
          </div>

          {/* Formations Selector Pills if multiple */}
          {tacticalFormations && tacticalFormations.length > 1 && (
            <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
              {tacticalFormations.map(formation => {
                const isActive = formation.id === currentFormation.id;
                return (
                  <button
                    key={formation.id}
                    type="button"
                    onClick={() => setActiveFormationId(formation.id)}
                    className={`px-4 py-2.5 rounded-2xl text-xs font-black whitespace-nowrap transition flex items-center gap-2 cursor-pointer ${
                      isActive
                        ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/30'
                        : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    <span className="font-mono text-xs px-1.5 py-0.5 rounded-md bg-black/20">
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
          )}

          {/* Pitch & Strategy Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left Column: Interactive 2D Pitch */}
            <div className="lg:col-span-7 bg-slate-950 rounded-3xl p-5 sm:p-6 border border-slate-800 shadow-2xl space-y-4">
              <div className="flex items-center justify-between text-white border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-xs font-black uppercase tracking-wider text-emerald-400">
                    Terrain Officiel • Système {currentFormation.system}
                  </span>
                </div>
                <span className="text-[11px] font-mono text-slate-400">
                  {currentFormation.starters?.length || 11} Joueurs Titulaires
                </span>
              </div>

              {/* 2D Football Pitch */}
              <div className="relative aspect-[3/4] sm:aspect-[4/5] w-full rounded-2xl overflow-hidden border-2 border-emerald-500/40 bg-gradient-to-b from-emerald-800 via-emerald-700 to-emerald-900 shadow-inner select-none">
                {/* Pitch Stripes */}
                <div className="absolute inset-0 opacity-15 pointer-events-none flex flex-col">
                  {Array.from({ length: 10 }).map((_, i) => (
                    <div
                      key={i}
                      className={`flex-1 ${i % 2 === 0 ? 'bg-black' : 'bg-transparent'}`}
                    />
                  ))}
                </div>

                {/* Pitch Markings */}
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
                  {/* Bottom penalty spot */}
                  <div className="absolute bottom-16 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-white/80" />
                </div>

                {/* Starters markers */}
                {currentFormation.starters?.map(st => {
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

              <p className="text-[11px] text-slate-400 text-center">
                💡 Cliquez sur un titulaire pour ouvrir sa fiche officielle, son poste et ses attributs.
              </p>
            </div>

            {/* Right Column: Tactical Instructions & Principles */}
            <div className="lg:col-span-5 space-y-4">
              <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                      Dispositif Officiel
                    </span>
                    <h3 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
                      <span>{currentFormation.name}</span>
                    </h3>
                  </div>
                  <span className="px-3 py-1 rounded-xl bg-emerald-500/10 text-emerald-500 font-mono text-sm font-black border border-emerald-500/20">
                    {currentFormation.system}
                  </span>
                </div>

                <div>
                  <span className="text-xs font-bold text-slate-400 block mb-1">
                    Philosophie & Style de Jeu
                  </span>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    {currentFormation.description}
                  </p>
                </div>

                {currentFormation.coachNotes && (
                  <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 space-y-1">
                    <span className="text-[11px] font-black text-amber-500 uppercase tracking-wider flex items-center gap-1.5">
                      <Crown className="w-3.5 h-3.5" />
                      Consignes de Vestiaire • Coach Gagne
                    </span>
                    <p className="text-xs text-slate-700 dark:text-slate-300 italic leading-relaxed">
                      « {currentFormation.coachNotes} »
                    </p>
                  </div>
                )}

                {currentFormation.keyPrinciples && currentFormation.keyPrinciples.length > 0 && (
                  <div className="space-y-2">
                    <span className="text-xs font-bold text-slate-400 block">
                      Principes Clés sur le Terrain
                    </span>
                    <ul className="space-y-1.5">
                      {currentFormation.keyPrinciples.map((principle, idx) => (
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

                <div className="pt-2 flex flex-col gap-2">
                  <button
                    onClick={() => setActiveTab('team')}
                    className="w-full py-3 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-black transition flex items-center justify-center gap-2 shadow-md"
                  >
                    <Users className="w-4 h-4" />
                    <span>Découvrir tout l'effectif des joueurs ({players.length})</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>

                  {starPlayer && (
                    <button
                      onClick={() => setSelectedPlayerId(starPlayer.id)}
                      className="w-full py-3 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold transition flex items-center justify-center gap-2"
                    >
                      <Zap className="w-3.5 h-3.5 text-amber-400" />
                      <span>Fiche du Capitaine ({getPlayerFullName(starPlayer)})</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 4. STATISTIQUES D'IMPACT DE L'ACADÉMIE                    */}
      {/* ========================================================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="p-4 sm:p-5 rounded-2xl sm:rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-3 sm:gap-4 min-w-0">
          <div className="p-3 sm:p-3.5 rounded-2xl bg-emerald-500/10 text-emerald-500 flex-shrink-0">
            <GraduationCap className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          <div className="min-w-0 flex-1 overflow-hidden">
            <span className="text-xl sm:text-2xl lg:text-3xl font-black text-slate-900 dark:text-white font-mono block truncate">100%</span>
            <p className="text-xs text-slate-500 font-medium truncate">Réussite Scolaire</p>
          </div>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl sm:rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-3 sm:gap-4 min-w-0">
          <div className="p-3 sm:p-3.5 rounded-2xl bg-amber-500/10 text-amber-500 flex-shrink-0">
            <Award className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          <div className="min-w-0 flex-1 overflow-hidden">
            <span className="text-xl sm:text-2xl lg:text-3xl font-black text-slate-900 dark:text-white font-mono block truncate">28 Buts</span>
            <p className="text-xs text-slate-500 font-medium truncate">Pape Modou Cissé</p>
          </div>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl sm:rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-3 sm:gap-4 min-w-0">
          <div className="p-3 sm:p-3.5 rounded-2xl bg-blue-500/10 text-blue-500 flex-shrink-0">
            <Users className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          <div className="min-w-0 flex-1 overflow-hidden">
            <span className="text-xl sm:text-2xl lg:text-3xl font-black text-slate-900 dark:text-white font-mono block truncate">+200</span>
            <p className="text-xs text-slate-500 font-medium truncate">Jeunes Encadrés</p>
          </div>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl sm:rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-3 sm:gap-4 min-w-0">
          <div className="p-3 sm:p-3.5 rounded-2xl bg-red-500/10 text-red-500 flex-shrink-0">
            <ShieldCheck className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          <div className="min-w-0 flex-1 overflow-hidden">
            <span className="text-xl sm:text-2xl lg:text-3xl font-black text-slate-900 dark:text-white font-mono block truncate">{players.length} Joueur{players.length > 1 ? 's' : ''}</span>
            <p className="text-xs text-slate-500 font-medium truncate">Effectif Actuel</p>
          </div>
        </div>
      </div>

      {/* ========================================================= */}
      {/* 5. LES PÉPITES DE L'ACADÉMIE & ACCÈS DIRECT FICHE         */}
      {/* ========================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Star Player Spotlight (Pape Modou Cissé) */}
        {starPlayer && (
          <div className="lg:col-span-6 rounded-3xl bg-white dark:bg-slate-900 border-2 border-amber-500/40 p-6 sm:p-8 shadow-xl flex flex-col justify-between space-y-6">
            <div className="flex items-center justify-between">
              <span className="px-3 py-1 rounded-full text-xs font-black bg-amber-500 text-slate-950 uppercase tracking-wider shadow">
                ⭐ Capitaine & Buteur N°1
              </span>
              <span className="text-xs text-emerald-600 dark:text-emerald-400 font-bold font-mono">
                #{starPlayer.number} • {starPlayer.positionDetail || starPlayer.position}
              </span>
            </div>

            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5">
              <div className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-2xl overflow-hidden border-2 border-amber-500 shadow-xl bg-slate-800 flex-shrink-0">
                <img
                  src={starPlayer.photoUrl}
                  alt={starPlayer.name}
                  className="w-full h-full object-cover object-top"
                  onError={(e) => {
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                />
                <span className="absolute bottom-1 right-1 px-1.5 py-0.5 rounded bg-slate-950/90 text-amber-400 font-mono text-xs font-black">
                  #{starPlayer.number}
                </span>
              </div>

              <div className="text-center sm:text-left">
                <div className="flex items-center justify-center sm:justify-start gap-1.5">
                  <span className="text-xl">{getPlayerFlag(starPlayer)}</span>
                  <h3 className="text-xl font-black text-slate-900 dark:text-white">
                    {getPlayerFullName(starPlayer)}
                  </h3>
                </div>
                <p className="text-xs text-amber-500 font-bold mt-0.5">
                  Capitaine emblématique • {starPlayer.age} ans • {starPlayer.preferredFoot}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 line-clamp-2">
                  {starPlayer.bio}
                </p>
              </div>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-3 gap-2 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 text-center">
              <div>
                <span className="text-[10px] text-slate-400 block font-semibold">Buts</span>
                <span className="text-xl font-black text-amber-500 font-mono">{getPlayerStats(starPlayer).goals}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block font-semibold">Passes</span>
                <span className="text-xl font-black text-blue-500 font-mono">{getPlayerStats(starPlayer).assists}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block font-semibold">Vitesse</span>
                <span className="text-xl font-black text-emerald-500 font-mono">{starPlayer.attributes?.pace || 96}/99</span>
              </div>
            </div>

            {/* BOUTON OFFICIEL: OUVRE LA FICHE & ATTRIBUTS */}
            <button
              onClick={() => setSelectedPlayerId(starPlayer.id)}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-black text-xs transition flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 active:scale-95"
            >
              <Zap className="w-4 h-4" />
              <span>Consulter la Fiche & Attributs de Pape Modou</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Other Academy Prodigies Spotlight */}
        <div className="lg:col-span-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-sm space-y-5">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <div>
              <span className="text-xs font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-widest">
                Vivier de Talents
              </span>
              <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
                Les Pépites de l'Académie
              </h3>
            </div>
            <button
              onClick={() => setActiveTab('team')}
              className="text-xs font-bold text-amber-500 hover:underline flex items-center gap-1"
            >
              Tout l'effectif ({players.length}) <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {otherTalents.map((player) => (
              <div
                key={player.id}
                onClick={() => setSelectedPlayerId(player.id)}
                className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800 hover:border-emerald-500/50 cursor-pointer transition group"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-12 h-12 rounded-xl overflow-hidden bg-slate-800 border border-slate-700 flex-shrink-0">
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
                      <span className="text-xs font-black text-slate-900 dark:text-white group-hover:text-amber-500 transition truncate">
                        {getPlayerFullName(player)}
                      </span>
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-500 border border-amber-500/20 font-mono">
                        #{player.number}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate mt-0.5">
                      {player.positionDetail || player.position} • {player.age} ans
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 flex-shrink-0 text-right">
                  <div>
                    <span className="text-[10px] text-slate-400 block font-semibold">Note / 99</span>
                    <span className="text-sm font-black text-emerald-500 font-mono">
                      {Math.round(((player.attributes?.pace || 80) + (player.attributes?.shooting || 75)) / 2)}
                    </span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-amber-500 group-hover:translate-x-1 transition" />
                </div>
              </div>
            ))}
          </div>

          <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-800 dark:text-emerald-300 flex items-center justify-between">
            <span className="font-medium">Chaque joueur dispose d'une fiche complète et d'attributs chiffrés.</span>
            <button
              onClick={() => setActiveTab('team')}
              className="font-bold underline text-emerald-700 dark:text-emerald-400 ml-2"
            >
              Voir fiches
            </button>
          </div>
        </div>

      </div>

      {/* ========================================================= */}
      {/* 6. PROCHAIN MATCH AU CALENDRIER                           */}
      {/* ========================================================= */}
      <div className="relative rounded-3xl overflow-hidden bg-slate-950 border border-slate-800 shadow-2xl p-6 sm:p-10 text-white">
        {/* Dynamic Background Image */}
        {clubInfo.backgroundUrls?.homeNextMatch && (
          <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
            <img
              src={clubInfo.backgroundUrls.homeNextMatch}
              alt=""
              className="w-full h-full object-cover opacity-25"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/80 to-slate-950/70" />
          </div>
        )}
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7 space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30 text-xs font-black tracking-wider uppercase">
              <Trophy className="w-3.5 h-3.5" />
              <span>{nextBigMatch.competition} • {nextBigMatch.round}</span>
            </div>

            <h2 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight">
              {nextBigMatch.homeTeamName}{' '}
              <span className="text-amber-500 font-serif italic">vs</span>{' '}
              {nextBigMatch.awayTeamName}
            </h2>

            <p className="text-xs sm:text-sm text-slate-300 max-w-lg leading-relaxed">
              Prochaine grande affiche au calendrier officiel après la victoire par forfait (3 - 0) lors de la 1ère Journée du Championnat ONGAM !
            </p>

            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400 pt-1">
              <span className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-emerald-400" />
                {nextBigMatch.date} à {nextBigMatch.time}
              </span>
              <span className="flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-emerald-400" />
                {nextBigMatch.venue}
              </span>
            </div>

            <div className="pt-2 flex flex-wrap gap-3">
              <button
                onClick={() => setSelectedMatchId(nextBigMatch.id)}
                className="px-6 py-3 rounded-2xl bg-red-600 hover:bg-red-500 text-white text-xs font-black transition flex items-center gap-2 shadow-lg active:scale-95"
              >
                <span>Détails & Feuille de Match</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={() => setActiveTab('matches')}
                className="px-5 py-3 rounded-2xl bg-slate-800/80 hover:bg-slate-700 text-white text-xs font-bold border border-slate-700 transition"
              >
                Voir le Calendrier Complet
              </button>
            </div>
          </div>

          <div className="lg:col-span-5 flex justify-center">
            <div className="w-full max-w-sm rounded-3xl bg-slate-900/90 border border-slate-700/80 p-6 shadow-2xl backdrop-blur-md space-y-4 text-center">
              <div className="flex flex-row items-center justify-around gap-2 whitespace-nowrap">
                <div className="flex flex-col items-center flex-1 min-w-0">
                  <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-white border-2 border-red-500/50 flex items-center justify-center shadow-lg p-2 flex-shrink-0">
                    <img src={clubInfo.logoUrl || '/icon.svg'} alt={clubInfo.name} className="w-full h-full object-contain" />
                  </div>
                  <span className="text-xs font-extrabold text-white mt-2 truncate max-w-full">{clubInfo.name}</span>
                  <span className="text-[10px] text-amber-400 font-bold whitespace-nowrap">Touba-Mbacké (Rouge & Blanc)</span>
                </div>

                <span className="text-2xl font-black text-amber-500 font-mono px-2 sm:px-3 flex-shrink-0">VS</span>

                <div className="flex flex-col items-center flex-1 min-w-0">
                  <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-white border-2 border-blue-600 flex items-center justify-center p-1.5 shadow-lg overflow-hidden flex-shrink-0">
                    {nextBigMatch.opponentLogo.startsWith('/') || nextBigMatch.opponentLogo.startsWith('http') ? (
                      <img src={nextBigMatch.opponentLogo} alt={nextBigMatch.opponent} className="w-full h-full object-contain" />
                    ) : (
                      <span className="text-3xl">{nextBigMatch.opponentLogo}</span>
                    )}
                  </div>
                  <span className="text-xs font-extrabold text-white mt-2 truncate max-w-full">{nextBigMatch.opponentShort}</span>
                  <span className="text-[10px] text-blue-400 font-bold whitespace-nowrap">Mbacké</span>
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-slate-950/60 border border-slate-800 text-xs text-slate-300">
                <p className="font-semibold text-emerald-400">📍 {nextBigMatch.venue}</p>
                <p className="text-[11px] text-slate-400 mt-0.5">Venez nombreux soutenir l'équipe au stade !</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================= */}
      {/* ESPACE CLUB : MEMBRES, GALERIE ET PRÉSIDENCE & STAFF       */}
      {/* ========================================================= */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Card 1: Espace Membres */}
        <div
          onClick={() => setActiveTab('member')}
          className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm hover:shadow-xl transition-all cursor-pointer group flex flex-col justify-between hover:-translate-y-1"
        >
          <div className="space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center font-bold">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] font-bold text-amber-500 uppercase tracking-widest block">
                Communauté Officielle
              </span>
              <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white group-hover:text-amber-500 transition-colors">
                Espace Membres
              </h3>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Consultez l'annuaire des {members.length} adhérents enregistrés. Les administrateurs peuvent ajouter ou supprimer un membre.
            </p>
          </div>

          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-bold text-amber-500">
            <span>Accéder aux Membres</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        {/* Card 2: Galerie Photos */}
        <div
          onClick={() => setActiveTab('gallery')}
          className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm hover:shadow-xl transition-all cursor-pointer group flex flex-col justify-between hover:-translate-y-1"
        >
          <div className="space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-red-500/10 text-red-500 flex items-center justify-center font-bold">
              <ImageIcon className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] font-bold text-red-500 uppercase tracking-widest block">
                Médiathèque Officielle
              </span>
              <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white group-hover:text-red-500 transition-colors">
                Galerie Photos
              </h3>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Photos des joueurs, du staff, des matchs et des supporters. Seul l'administrateur peut publier ou supprimer des clichés.
            </p>
          </div>

          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-bold text-red-500">
            <span>Découvrir la Galerie ({gallery.length})</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        {/* Card 3: Staff & Présidence */}
        <div
          onClick={() => setActiveTab('team')}
          className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm hover:shadow-xl transition-all cursor-pointer group flex flex-col justify-between hover:-translate-y-1"
        >
          <div className="space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center font-bold">
              <Crown className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest block">
                Direction & Encadrement
              </span>
              <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white group-hover:text-emerald-500 transition-colors">
                Staff & {clubInfo.presidentTitle || 'Président'}
              </h3>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Rencontrez le {clubInfo.presidentTitle || 'Président'} ({clubInfo.president}), Coach Gagne et tout le staff technique et médical.
            </p>
          </div>

          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-bold text-emerald-500">
            <span>Voir l'Organigramme</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </div>

      {/* ========================================================= */}
      {/* 7. ACTUALITÉS & VIE DE L'INSTITUT                         */}
      {/* ========================================================= */}
      <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
          <div>
            <span className="text-xs font-black text-amber-500 uppercase tracking-widest">
              Actualités & Détections
            </span>
            <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
              <Flame className="w-5 h-5 text-amber-500" />
              La Vie de l'Institut
            </h2>
          </div>
          <button
            onClick={() => setActiveTab('news')}
            className="text-xs font-bold text-amber-500 hover:underline flex items-center gap-1"
          >
            Toutes les actualités <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {NEWS_DATA.slice(0, 3).map(article => (
            <div
              key={article.id}
              onClick={() => setSelectedNewsId(article.id)}
              className="rounded-2xl border border-slate-100 dark:border-slate-800 hover:border-emerald-500/50 bg-slate-50/50 dark:bg-slate-800/30 overflow-hidden cursor-pointer transition group flex flex-col justify-between"
            >
              <div className="h-40 overflow-hidden bg-slate-800">
                <img
                  src={article.imageUrl}
                  alt={article.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                />
              </div>

              <div className="p-4 space-y-2 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 text-[10px] font-bold text-amber-500 uppercase">
                    <span>{article.category}</span>
                    <span className="text-slate-400">• {article.publishedAt}</span>
                  </div>
                  <h4 className="text-sm font-extrabold text-slate-900 dark:text-white group-hover:text-emerald-500 transition mt-1 line-clamp-2">
                    {article.title}
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mt-1">
                    {article.summary}
                  </p>
                </div>

                <div className="pt-2">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedNewsId(article.id);
                    }}
                    className="inline-flex items-center text-xs font-bold text-emerald-600 hover:text-emerald-700 gap-1 group-hover:translate-x-1 transition cursor-pointer"
                  >
                    <span>Lire l'article</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
