import React, { useState, useRef } from 'react';
import {
  X,
  Trophy,
  Calendar,
  MapPin,
  Users,
  Shield,
  Clock,
  Share2,
  Activity,
  UserCheck,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Minimize2,
  Maximize2,
  Sparkles,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { MATCHES_DATA } from '../data/clubData';
import { Match, MatchStats } from '../types';

export const MatchDetailModal: React.FC = () => {
  const { selectedMatchId, setSelectedMatchId, triggerShare, t, matches, clubInfo } = useApp();
  const [activeSubTab, setActiveSubTab] = useState<'stats' | 'timeline' | 'lineups'>('stats');
  const [isCondensed, setIsCondensed] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  if (!selectedMatchId) return null;

  const match = matches.find(m => m.id === selectedMatchId) || MATCHES_DATA.find(m => m.id === selectedMatchId) || matches[0];
  if (!match) return null;

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const top = e.currentTarget.scrollTop;
    setIsScrolled(top > 40);
  };

  // Dedicated official match logic for ONGAM / Escale de Mbacké forfeit match
  const isOngamForfeitMatch = match.id === 'm-ongam-1' || match.opponent?.includes('ESCALE');

  const homeName = isOngamForfeitMatch ? (match.homeTeamName || clubInfo.name) : match.homeTeamName;
  const awayName = isOngamForfeitMatch ? 'ASC ESCALE DE MBACKÉ' : match.awayTeamName;

  // Strict preservation of official team logos:
  // Home team: always club logo (/icon.svg or customized clubInfo.logoUrl)
  // Away team: resolves official SVG for ASC Escale, ASC Manko, Diambars, Touba FC, etc.
  const resolveOpponentLogo = (opp?: string, customLogo?: string) => {
    if (customLogo && (customLogo.startsWith('/') || customLogo.startsWith('http') || customLogo.startsWith('data:'))) {
      return customLogo;
    }
    const norm = (opp || '').toLowerCase();
    if (norm.includes('escale')) return '/asc-escale.svg';
    if (norm.includes('manko')) return '/asc-manko.svg';
    if (norm.includes('diambars')) return '/diambars-touba.svg';
    if (norm.includes('touba')) return '/touba-fc.svg';
    if (norm.includes('elite') || norm.includes('élite')) return '/elite-mbacke.svg';
    return clubInfo.logoUrl || '/icon.svg';
  };

  const opponentLogoResolved = resolveOpponentLogo(match.opponent, match.opponentLogo);

  const homeLogo = isOngamForfeitMatch
    ? (clubInfo.logoUrl || '/icon.svg')
    : match.isHome
    ? (clubInfo.logoUrl || '/icon.svg')
    : opponentLogoResolved;

  const awayLogo = isOngamForfeitMatch
    ? '/asc-escale.svg'
    : match.isHome
    ? opponentLogoResolved
    : (clubInfo.logoUrl || '/icon.svg');

  const stats: MatchStats = match.stats || {
    possessionHome: 60,
    possessionAway: 40,
    xGHome: 2.1,
    xGAway: 0.8,
    shotsHome: 14,
    shotsAway: 6,
    shotsOnTargetHome: 8,
    shotsOnTargetAway: 2,
    cornersHome: 7,
    cornersAway: 3,
    foulsHome: 11,
    foulsAway: 15,
    yellowCardsHome: 1,
    yellowCardsAway: 3,
    redCardsHome: 0,
    redCardsAway: 0,
    passesHome: 485,
    passesAway: 312,
    passAccuracyHome: 86,
    passAccuracyAway: 78,
  };

  const comparisonStats = [
    { label: t('possession'), home: `${stats.possessionHome}%`, away: `${stats.possessionAway}%`, homeVal: stats.possessionHome, awayVal: stats.possessionAway },
    { label: t('expected_goals'), home: stats.xGHome.toFixed(1), away: stats.xGAway.toFixed(1), homeVal: stats.xGHome, awayVal: stats.xGAway },
    { label: t('total_shots'), home: stats.shotsHome, away: stats.shotsAway, homeVal: stats.shotsHome, awayVal: stats.shotsAway },
    { label: t('shots_on_target'), home: stats.shotsOnTargetHome, away: stats.shotsOnTargetAway, homeVal: stats.shotsOnTargetHome, awayVal: stats.shotsOnTargetAway },
    { label: t('corners'), home: stats.cornersHome, away: stats.cornersAway, homeVal: stats.cornersHome, awayVal: stats.cornersAway },
    { label: t('fouls'), home: stats.foulsHome, away: stats.foulsAway, homeVal: stats.foulsHome, awayVal: stats.foulsAway },
    { label: t('pass_accuracy'), home: `${stats.passAccuracyHome}%`, away: `${stats.passAccuracyAway}%`, homeVal: stats.passAccuracyHome, awayVal: stats.passAccuracyAway },
    { label: t('yellow_cards'), home: stats.yellowCardsHome, away: stats.yellowCardsAway, homeVal: stats.yellowCardsHome, awayVal: stats.yellowCardsAway },
    { label: t('red_cards'), home: stats.redCardsHome, away: stats.redCardsAway, homeVal: stats.redCardsHome, awayVal: stats.redCardsAway },
  ];

  const handleShareMatch = () => {
    triggerShare({
      title: `${homeName} ${match.homeScore ?? ''} - ${match.awayScore ?? ''} ${awayName}`,
      text: `Feuille de match officielle & Forfait homologué (3-0) : ${match.competition} (${match.date}).`,
      url: window.location.href,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm p-2 sm:p-4 animate-in fade-in overflow-hidden">
      <div className="w-full max-w-3xl rounded-2xl sm:rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden my-auto flex flex-col max-h-[94vh] sm:max-h-[90vh] relative">
        
        {/* ========================================================= */}
        {/* BARRE FIXE EN HAUT : BANDEAU STICKY & ACTIONS RESPONSIVES */}
        {/* ========================================================= */}
        <div
          className={`sticky top-0 z-30 transition-all duration-200 border-b border-slate-800 ${
            isScrolled || isCondensed
              ? 'bg-slate-950/95 backdrop-blur-md px-3 sm:px-5 py-2 sm:py-2.5 shadow-lg'
              : 'bg-gradient-to-r from-slate-950 via-slate-900 to-indigo-950 px-3 sm:px-6 py-2.5 sm:py-3'
          }`}
        >
          <div className="flex items-center justify-between gap-2 text-white">
            
            <div className="flex items-center gap-2 truncate min-w-0">
              <span className="px-2 sm:px-2.5 py-0.5 rounded-full text-[10px] sm:text-xs font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30 whitespace-nowrap flex-shrink-0">
                {match.competition}
              </span>
              
              {(isScrolled || isCondensed) && (
                <div className="flex items-center gap-1.5 sm:gap-2 truncate animate-in fade-in min-w-0">
                  <div className="w-5 h-5 rounded-md bg-white p-0.5 flex-shrink-0 shadow">
                    <img src={homeLogo} alt="" className="w-full h-full object-contain" />
                  </div>
                  <span className="font-extrabold text-white text-[11px] sm:text-sm truncate">
                    {homeName}
                  </span>
                  <span className="px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-mono font-black text-[11px] sm:text-xs border border-emerald-500/30 whitespace-nowrap flex-shrink-0">
                    {match.homeScore ?? '3'} - {match.awayScore ?? '0'}
                  </span>
                  <div className="w-5 h-5 rounded-md bg-white p-0.5 flex-shrink-0 shadow">
                    <img src={awayLogo} alt="" className="w-full h-full object-contain" />
                  </div>
                  <span className="font-extrabold text-white text-[11px] sm:text-sm truncate hidden xs:inline">
                    {awayName}
                  </span>
                </div>
              )}
            </div>

            <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
              <button
                type="button"
                onClick={() => setIsCondensed(!isCondensed)}
                className="px-2 sm:px-2.5 py-1.5 rounded-xl bg-slate-800/90 hover:bg-slate-700 text-slate-300 hover:text-white transition text-[11px] sm:text-xs font-bold flex items-center gap-1 sm:gap-1.5 border border-slate-700/80 shadow-sm"
                title={isCondensed ? "Agrandir le bandeau du match" : "Condenser le bandeau pour faciliter le défilement"}
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
                onClick={handleShareMatch}
                className="p-1.5 sm:p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white transition"
                title="Partager ce match"
              >
                <Share2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </button>

              <button
                type="button"
                onClick={() => setSelectedMatchId(null)}
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
        {/* ========================================================= */}
        <div
          ref={scrollContainerRef}
          onScroll={handleScroll}
          className="overflow-y-auto flex-1 flex flex-col scroll-smooth"
        >
          {/* PARTIE 1 : BANNIÈRE DU MATCH - LOGOS OFFICIELS STRICTEMENT PRÉSERVÉS */}
          {!isCondensed && (
            <div className="relative bg-gradient-to-r from-slate-950 via-slate-900 to-indigo-950 text-white p-4 sm:p-6 lg:p-7 border-b border-slate-800 flex-shrink-0 transition-all duration-300 overflow-hidden">
              {clubInfo.backgroundUrls?.modalMatchBg && (
                <img
                  src={clubInfo.backgroundUrls.modalMatchBg}
                  alt=""
                  className="absolute inset-0 w-full h-full object-cover opacity-20 pointer-events-none"
                />
              )}
              
              {/* Face-à-face strictement aligné sur une seule ligne et 100% responsive */}
              <div className="flex flex-row items-center justify-between sm:justify-around gap-2 sm:gap-4 text-center">
                
                {/* Équipe Domicile : ASC Dialloré */}
                <div className="flex-1 flex flex-col items-center min-w-0">
                  {/* Boîtier officiel blanc à bordure rouge aux couleurs du club */}
                  <div className="relative w-14 h-14 sm:w-20 sm:h-20 lg:w-24 lg:h-24 rounded-2xl sm:rounded-3xl bg-white p-2 shadow-2xl border-2 sm:border-4 border-red-500 flex items-center justify-center flex-shrink-0 transition-transform hover:scale-105">
                    <img
                      src={homeLogo}
                      alt={homeName}
                      className="w-full h-full object-contain"
                    />
                    <span className="absolute -bottom-2 px-1.5 sm:px-2 py-0.5 rounded-full bg-red-600 text-white text-[8px] sm:text-[9px] font-black uppercase tracking-wider shadow whitespace-nowrap">
                      Vainqueur (3 pts)
                    </span>
                  </div>
                  <h3 className="mt-2.5 sm:mt-3 text-xs sm:text-base font-extrabold text-white uppercase tracking-wider truncate max-w-full">
                    {homeName}
                  </h3>
                  <span className="text-[9px] sm:text-[11px] text-amber-400 font-semibold whitespace-nowrap">
                    Domicile
                  </span>
                </div>

                {/* Bloc Score Central - Verrouillé sur la même ligne */}
                <div className="flex flex-col items-center px-1 sm:px-4 flex-shrink-0">
                  {match.status === 'live' ? (
                    <span className="px-2 sm:px-2.5 py-0.5 rounded-full bg-rose-600 text-white text-[8px] sm:text-[10px] font-black animate-pulse uppercase whitespace-nowrap">
                      EN DIRECT {match.liveMinute}'
                    </span>
                  ) : match.isForfeit ? (
                    <span className="px-2 sm:px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[8px] sm:text-[10px] font-extrabold uppercase tracking-widest whitespace-nowrap">
                      FORFAIT
                    </span>
                  ) : match.status === 'finished' ? (
                    <span className="text-[9px] sm:text-[11px] font-bold text-slate-400 uppercase tracking-wider whitespace-nowrap">
                      Score Final
                    </span>
                  ) : (
                    <span className="text-xs font-bold text-amber-400 whitespace-nowrap">
                      {match.time}
                    </span>
                  )}

                  <div className="my-1 flex items-center justify-center gap-1.5 sm:gap-3 whitespace-nowrap">
                    <span className="text-3xl sm:text-5xl font-black text-emerald-400 font-mono tracking-wider drop-shadow-[0_0_15px_rgba(52,211,153,0.6)]">
                      {match.homeScore ?? '3'}
                    </span>
                    <span className="text-xl sm:text-3xl text-slate-500 font-mono font-light">
                      -
                    </span>
                    <span className="text-3xl sm:text-5xl font-black text-emerald-400 font-mono tracking-wider drop-shadow-[0_0_15px_rgba(52,211,153,0.6)]">
                      {match.awayScore ?? '0'}
                    </span>
                  </div>

                  <span className="text-[8px] sm:text-[10px] text-slate-400 whitespace-nowrap">
                    {match.isForfeit ? 'Score officiel homologué (3-0)' : match.date}
                  </span>
                </div>

                {/* Équipe Extérieure : ASC ESCALE DE MBACKÉ */}
                <div className="flex-1 flex flex-col items-center min-w-0">
                  {/* Boîtier officiel blanc éclatant à bordure ardoise comme sur l'affiche */}
                  <div className="relative w-14 h-14 sm:w-20 sm:h-20 lg:w-24 lg:h-24 rounded-2xl sm:rounded-3xl bg-white p-2 shadow-2xl border-2 sm:border-4 border-slate-700 flex items-center justify-center flex-shrink-0 transition-transform hover:scale-105">
                    <img
                      src={awayLogo}
                      alt={awayName}
                      className="w-full h-full object-contain"
                    />
                    <span className="absolute -bottom-2 px-1.5 sm:px-2 py-0.5 rounded-full bg-slate-700 text-slate-300 text-[8px] sm:text-[9px] font-black uppercase tracking-wider shadow whitespace-nowrap">
                      Forfait (Absent)
                    </span>
                  </div>
                  <h3 className="mt-2.5 sm:mt-3 text-xs sm:text-base font-extrabold text-white uppercase tracking-wider truncate max-w-full">
                    {awayName}
                  </h3>
                  <span className="text-[9px] sm:text-[11px] text-slate-400 font-semibold whitespace-nowrap">
                    Extérieur
                  </span>
                </div>
              </div>

              {/* Lieu, Arbitrage & Présence du Match */}
              <div className="mt-4 pt-3 border-t border-slate-800/80 flex flex-wrap items-center justify-center gap-2 sm:gap-4 text-[10px] sm:text-xs text-slate-400">
                <span className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-amber-400" />
                  {match.venue}
                </span>
                {match.attendance && (
                  <span className="flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-blue-400" />
                    {match.attendance}
                  </span>
                )}
                {match.referee && (
                  <span className="flex items-center gap-1.5">
                    <Shield className="w-3.5 h-3.5 text-emerald-400" />
                    Arbitre : {match.referee}
                  </span>
                )}
              </div>
            </div>
          )}

          {/* PARTIE 2 : SOUS-ONGLETS & CONTENU STATISTIQUES */}
          <div className="bg-white dark:bg-slate-900 flex-1 flex flex-col">
            
            {/* Modal Navigation Sub-tabs (Sticky & Défilable horizontalement sur mobile) */}
            <div className="sticky top-0 z-20 flex border-b border-slate-200 dark:border-slate-800 bg-slate-50/95 dark:bg-slate-950/95 backdrop-blur-md px-2 sm:px-4 flex-shrink-0 overflow-x-auto no-scrollbar">
              <button
                type="button"
                onClick={() => setActiveSubTab('stats')}
                className={`py-2.5 sm:py-3 px-3 sm:px-4 text-[11px] sm:text-xs font-bold border-b-2 transition whitespace-nowrap ${
                  activeSubTab === 'stats'
                    ? 'border-amber-500 text-amber-500'
                    : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-slate-300'
                }`}
              >
                Statistiques Comparatives
              </button>
              <button
                type="button"
                onClick={() => setActiveSubTab('timeline')}
                className={`py-2.5 sm:py-3 px-3 sm:px-4 text-[11px] sm:text-xs font-bold border-b-2 transition whitespace-nowrap ${
                  activeSubTab === 'timeline'
                    ? 'border-amber-500 text-amber-500'
                    : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-slate-300'
                }`}
              >
                Temps Forts ({match.events?.length || 0})
              </button>
              <button
                type="button"
                onClick={() => setActiveSubTab('lineups')}
                className={`py-2.5 sm:py-3 px-3 sm:px-4 text-[11px] sm:text-xs font-bold border-b-2 transition whitespace-nowrap ${
                  activeSubTab === 'lineups'
                    ? 'border-amber-500 text-amber-500'
                    : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-slate-300'
                }`}
              >
                Compositions & Notes
              </button>
            </div>

            {/* Corps du contenu défilable */}
            <div className="p-4 sm:p-6 lg:p-7 space-y-6 flex-1">
              
              {/* Forfeit Alert Box */}
              {match.isForfeit && (
                <div className="p-4 rounded-2xl bg-amber-500/10 border-2 border-amber-500/40 text-amber-900 dark:text-amber-100 space-y-2 shadow-sm">
                  <div className="flex items-center gap-2 font-black text-xs sm:text-sm text-amber-600 dark:text-amber-400">
                    <Trophy className="w-4 h-4 flex-shrink-0" />
                    <span>Victoire officielle par Forfait (3 - 0) • 3 Points au Classement</span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    {match.forfeitReason || "L’équipe adverse ne s'est pas présentée au terrain. Conformément aux règlements officiels de l'ONGAM et de la FSF, l'ASC Dialloré remporte le match avec 3 buts homologués et 3 points."}
                  </p>
                  <div className="flex items-center gap-2 text-[11px] text-amber-500 font-bold pt-1">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Homologué par le Délégué et le Corps Arbitral ONGAM</span>
                  </div>
                </div>
              )}

              {/* 1. Comparison Stats Tab */}
              {activeSubTab === 'stats' && (
                <div className="space-y-4 animate-in fade-in">
                  <div className="space-y-3.5">
                    {comparisonStats.map((item, index) => {
                      const total = (typeof item.homeVal === 'number' && typeof item.awayVal === 'number') 
                        ? (item.homeVal + item.awayVal) || 1 
                        : 1;
                      const homePercent = (Number(item.homeVal) / total) * 100;
                      
                      return (
                        <div key={index} className="space-y-1.5">
                          <div className="flex justify-between items-center text-xs font-bold">
                            <span className="text-emerald-500 font-mono text-xs sm:text-sm">{item.home}</span>
                            <span className="text-slate-600 dark:text-slate-400 uppercase text-[10px] sm:text-[11px] tracking-wider text-center">
                              {item.label}
                            </span>
                            <span className="text-blue-500 font-mono text-xs sm:text-sm">{item.away}</span>
                          </div>
                          
                          {/* Dual Progress Bar */}
                          <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden flex">
                            <div 
                              className="bg-emerald-500 h-full transition-all duration-500" 
                              style={{ width: `${homePercent}%` }}
                            />
                            <div 
                              className="bg-blue-500 h-full transition-all duration-500" 
                              style={{ width: `${100 - homePercent}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* 2. Timeline Tab */}
              {activeSubTab === 'timeline' && (
                <div className="space-y-4 animate-in fade-in">
                  {match.events && match.events.length > 0 ? (
                    <div className="relative border-l-2 border-slate-200 dark:border-slate-800 ml-3 sm:ml-4 space-y-5 py-2">
                      {match.events.map((event, index) => (
                        <div key={index} className="relative pl-5 sm:pl-6 group">
                          {/* Dot on timeline */}
                          <div className={`absolute -left-2.5 top-0.5 w-5 h-5 rounded-full border-2 border-white dark:border-slate-900 flex items-center justify-center text-[10px] ${
                            event.type === 'goal' 
                              ? 'bg-amber-500 text-slate-950 font-black' 
                              : event.type === 'card'
                              ? 'bg-red-500 text-white'
                              : 'bg-slate-500 text-white'
                          }`}>
                            {event.type === 'goal' ? '⚽' : event.type === 'card' ? '🟨' : '🔄'}
                          </div>

                          <div className="flex items-center justify-between gap-2">
                            <div className="flex items-center gap-2 truncate">
                              <span className="text-xs font-mono font-bold text-amber-500">
                                {event.minute}'
                              </span>
                              <span className="text-xs sm:text-sm font-extrabold text-slate-900 dark:text-white truncate">
                                {event.player}
                              </span>
                              {event.assist && (
                                <span className="text-xs text-slate-400 hidden sm:inline">
                                  (Passe : {event.assist})
                                </span>
                              )}
                            </div>
                            <span className="text-[10px] sm:text-[11px] font-semibold text-slate-400 whitespace-nowrap">
                              {event.team === 'home' ? homeName : awayName}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-10 text-slate-500 text-xs">
                      Aucun événement de jeu (Match homologué par forfait).
                    </div>
                  )}
                </div>
              )}

              {/* 3. Lineups Tab */}
              {activeSubTab === 'lineups' && (
                <div className="space-y-5 animate-in fade-in">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs font-semibold text-slate-500 gap-1">
                    <span>Dispositif Tactique Future Pro ({match.formationHome || '4-3-3'})</span>
                    <span className="text-emerald-500 font-bold">Note moyenne de l'équipe : 8.4/10</span>
                  </div>

                  {/* Pitch Visualizer - Responsive Aspect Ratio */}
                  <div className="relative w-full aspect-[16/10] bg-emerald-800 rounded-2xl overflow-hidden border-2 sm:border-4 border-emerald-900 shadow-inner p-2 sm:p-3 flex flex-col justify-between">
                    {/* Grass stripes */}
                    <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(0,0,0,0.06)_50%,transparent_50%)] bg-[length:100%_30px] sm:bg-[length:100%_40px] pointer-events-none" />

                    {/* Pitch Markings */}
                    <div className="absolute inset-1.5 sm:inset-2 border-2 border-white/40 rounded-xl pointer-events-none" />
                    <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-white/40 pointer-events-none -translate-y-1/2" />
                    <div className="absolute top-1/2 left-1/2 w-16 h-16 sm:w-24 sm:h-24 rounded-full border-2 border-white/40 pointer-events-none -translate-x-1/2 -translate-y-1/2" />
                    
                    {/* Penalty Area Top */}
                    <div className="absolute top-1.5 sm:top-2 left-1/2 -translate-x-1/2 w-32 sm:w-48 h-12 sm:h-18 border-2 border-white/40 border-t-0 pointer-events-none" />
                    {/* Penalty Area Bottom */}
                    <div className="absolute bottom-1.5 sm:bottom-2 left-1/2 -translate-x-1/2 w-32 sm:w-48 h-12 sm:h-18 border-2 border-white/40 border-b-0 pointer-events-none" />

                    {/* Players Placed on Pitch */}
                    {match.lineupHome && match.lineupHome.length > 0 ? (
                      match.lineupHome.map(p => (
                        <div
                          key={p.id}
                          style={{
                            position: 'absolute',
                            left: `${p.y}%`,
                            top: `${p.x}%`,
                            transform: 'translate(-50%, -50%)',
                          }}
                          className="flex flex-col items-center cursor-pointer group z-10"
                        >
                          <div className="relative w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-slate-950 border-2 border-amber-400 text-white font-bold text-[9px] sm:text-[11px] flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
                            {p.number}
                            {p.isCaptain && (
                              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-amber-500 text-slate-950 text-[7px] sm:text-[8px] font-black flex items-center justify-center">
                                C
                              </span>
                            )}
                          </div>
                          <span className="mt-0.5 text-[8px] sm:text-[10px] font-bold text-white bg-slate-900/90 px-1 rounded shadow truncate max-w-[55px] sm:max-w-[70px]">
                            {p.name}
                          </span>
                          <span className="text-[7px] sm:text-[8px] font-bold text-emerald-300">
                            ⭐ {p.rating}
                          </span>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-12 text-white font-bold">
                        Composition officielle 4-3-3
                      </div>
                    )}
                  </div>

                  {/* Substitutions & Bench Note */}
                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-400 space-y-1">
                    <p className="font-bold text-slate-900 dark:text-white">Remplaçants & Entrées en jeu :</p>
                    <p>• G. Santos (67' - Note: 7.8) • M. Rossi (75' - Note: 7.2) • T. Mendy (82')</p>
                  </div>
                </div>
              )}

            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-3 sm:p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-950/80 flex items-center justify-between flex-shrink-0">
          <span className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400">
            Source : ONGAM • FSF Officiel
          </span>
          <button
            type="button"
            onClick={() => setSelectedMatchId(null)}
            className="px-5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-950 text-xs font-bold transition shadow"
          >
            {t('close')}
          </button>
        </div>

      </div>
    </div>
  );
};
