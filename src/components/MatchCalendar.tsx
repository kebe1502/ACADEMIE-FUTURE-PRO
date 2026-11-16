import React, { useState } from 'react';
import {
  Calendar,
  Clock,
  MapPin,
  ChevronRight,
  Trophy,
  Activity,
  Filter,
  Edit,
  Trash2,
  Plus,
  Shield,
  ArrowRight,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { MATCHES_DATA } from '../data/clubData';
import { Match } from '../types';
import { getAccentStyles } from '../utils/theme';
import { TeamLogo } from './TeamLogo';

export const MatchCalendar: React.FC = () => {
  const {
    setSelectedMatchId,
    setActiveTab,
    themeAccent,
    t,
    matches,
    clubInfo,
    isAdminLoggedIn,
    deleteMatch,
    standings,
  } = useApp();

  const [mainView, setMainView] = useState<'matches' | 'standings'>('matches');
  const [matchToDelete, setMatchToDelete] = useState<Match | null>(null);
  const [statusFilter, setStatusFilter] = useState<'all' | 'upcoming' | 'finished'>('all');
  const [competitionFilter, setCompetitionFilter] = useState<string>('all');

  const accent = getAccentStyles(themeAccent);

  const filteredMatches = matches.filter(m => {
    const matchesStatus =
      statusFilter === 'all' ||
      (statusFilter === 'upcoming' && (m.status === 'upcoming' || m.status === 'live')) ||
      (statusFilter === 'finished' && m.status === 'finished');
    const matchesCompetition =
      competitionFilter === 'all' || m.competition.toLowerCase().includes(competitionFilter.toLowerCase());
    return matchesStatus && matchesCompetition;
  });

  const ongamMatch = matches.find(m => m.id === 'm-ongam-1') || matches[0];

  return (
    <div className="space-y-8 animate-in fade-in">
      {/* Header Banner */}
      <div className="relative rounded-3xl overflow-hidden bg-slate-950 border border-slate-800 p-6 sm:p-10 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        {/* Dynamic Background Image */}
        {clubInfo.backgroundUrls?.matchesBanner && (
          <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
            <img
              src={clubInfo.backgroundUrls.matchesBanner}
              alt=""
              className="w-full h-full object-cover opacity-25"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-950/90 via-slate-950/85 to-slate-950/90" />
          </div>
        )}
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-bold mb-3">
            <Calendar className="w-3.5 h-3.5" />
            <span>Calendrier & Résultats Officiels</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
            Calendrier & Résultats • {clubInfo.name}
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl">
            Retrouvez tous les matchs planifiés, programmés et terminés de l'<strong>{clubInfo.name}</strong>, dont le Championnat ONGAM et les tournois.
          </p>
        </div>

        {/* Quick Tournament & Last Match Status Pill & Admin Shortcut */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2.5 flex-shrink-0">
          {ongamMatch && (
            <div className="p-3 rounded-2xl bg-emerald-900/50 border border-emerald-700/60 text-xs text-white">
              <span className="text-[10px] text-emerald-300 block font-bold uppercase">{ongamMatch.round || '1ère Journée'}</span>
              <span className="font-extrabold text-sm text-amber-300">{clubInfo.name} {ongamMatch.homeScore ?? 3} - {ongamMatch.awayScore ?? 0} {ongamMatch.opponent}</span>
            </div>
          )}
          {isAdminLoggedIn && (
            <button
              onClick={() => setActiveTab('admin')}
              className="px-4 py-3 rounded-2xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold shadow-lg transition flex items-center gap-2"
            >
              <span>+ Planifier un Match (Admin)</span>
            </button>
          )}
        </div>
      </div>

      {/* Top Main View Toggle: Matchs vs Classement */}
      <div className="flex items-center justify-center sm:justify-start gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
        <button
          type="button"
          onClick={() => setMainView('matches')}
          className={`px-5 py-2.5 rounded-2xl text-xs font-black transition flex items-center gap-2 cursor-pointer ${
            mainView === 'matches'
              ? 'bg-red-600 text-white shadow-lg shadow-red-600/30'
              : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Calendar className="w-4 h-4" />
          <span>Calendrier des Rencontres</span>
        </button>

        <button
          type="button"
          onClick={() => setMainView('standings')}
          className={`px-5 py-2.5 rounded-2xl text-xs font-black transition flex items-center gap-2 cursor-pointer ${
            mainView === 'standings'
              ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/30'
              : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Trophy className="w-4 h-4" />
          <span>Classement Officiel ONGAM ({standings.length} clubs)</span>
        </button>
      </div>

      {mainView === 'standings' ? (
        /* ============================================================== */
        /* VUE CLASSEMENT DU CHAMPIONNAT POUR LES SUPPORTERS              */
        /* ============================================================== */
        <div className="space-y-6 animate-in fade-in">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-black text-slate-900 dark:text-white uppercase font-serif">
                  Classement Général • Championnat ONGAM Cadets 2026
                </span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 text-[10px] font-black border border-emerald-500/20">
                  Poule A Touba-Mbacké
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Mise à jour officielle certifiée • 3 pts par victoire, 1 pt par nul, 0 pt par défaite
              </p>
            </div>

            {isAdminLoggedIn && (
              <button
                type="button"
                onClick={() => setActiveTab('admin')}
                className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-black flex items-center gap-1.5 shadow-md shadow-amber-500/20 transition"
              >
                <Edit className="w-3.5 h-3.5" />
                <span>Gérer le Classement (Admin)</span>
              </button>
            )}
          </div>

          {/* Standings Table */}
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
                  {standings.map((row) => {
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

                        {/* Stats */}
                        <td className="py-3.5 px-3 text-center">{row.played}</td>
                        <td className="py-3.5 px-3 text-center text-emerald-600 dark:text-emerald-400 font-bold">{row.won}</td>
                        <td className="py-3.5 px-3 text-center text-amber-600 dark:text-amber-400">{row.drawn}</td>
                        <td className="py-3.5 px-3 text-center text-red-500">{row.lost}</td>
                        <td className="py-3.5 px-3 text-center text-slate-500 hidden sm:table-cell">{row.goalsFor}</td>
                        <td className="py-3.5 px-3 text-center text-slate-500 hidden sm:table-cell">{row.goalsAgainst}</td>
                        <td className="py-3.5 px-3 text-center font-bold">
                          <span className={row.goalDifference > 0 ? 'text-emerald-500 font-black' : row.goalDifference < 0 ? 'text-red-500' : 'text-slate-400'}>
                            {row.goalDifference > 0 ? `+${row.goalDifference}` : row.goalDifference}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-center font-black text-sm text-slate-900 dark:text-white">
                          {row.points}
                        </td>

                        {/* Form Icons */}
                        <td className="py-3.5 px-3 text-center hidden md:table-cell">
                          <div className="flex items-center justify-center gap-1">
                            {row.form && row.form.length > 0 ? (
                              row.form.map((res, idx) => (
                                <span
                                  key={idx}
                                  className={`w-4 h-4 rounded text-[9px] font-black flex items-center justify-center text-white ${
                                    res === 'V'
                                      ? 'bg-emerald-500'
                                      : res === 'N'
                                      ? 'bg-amber-500'
                                      : 'bg-red-500'
                                  }`}
                                >
                                  {res}
                                </span>
                              ))
                            ) : (
                              <span className="text-slate-400">—</span>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : (
        <>
          {/* Filter bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Status toggles */}
        <div className="flex rounded-2xl bg-white dark:bg-slate-900 p-1 border border-slate-200 dark:border-slate-800 w-full sm:w-auto">
          <button
            onClick={() => setStatusFilter('all')}
            className={`flex-1 sm:flex-none px-4 py-2 text-xs font-bold rounded-xl transition ${
              statusFilter === 'all' ? accent.bg : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            Tous les matchs
          </button>
          <button
            onClick={() => setStatusFilter('upcoming')}
            className={`flex-1 sm:flex-none px-4 py-2 text-xs font-bold rounded-xl transition ${
              statusFilter === 'upcoming' ? accent.bg : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            À venir (Tournoi)
          </button>
          <button
            onClick={() => setStatusFilter('finished')}
            className={`flex-1 sm:flex-none px-4 py-2 text-xs font-bold rounded-xl transition ${
              statusFilter === 'finished' ? accent.bg : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            Résultats (3 - 0 & 3 - 1)
          </button>
        </div>

        {/* Competition Dropdown */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-4 h-4 text-slate-400 hidden sm:block" />
          <select
            value={competitionFilter}
            onChange={e => setCompetitionFilter(e.target.value)}
            className="w-full sm:w-auto px-3 py-2 text-xs font-semibold rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white outline-none focus:border-amber-500"
          >
            <option value="all">Toutes compétitions</option>
            <option value="ONGAM">Championnat ONGAM / Cadets 2026</option>
            <option value="Tournoi">Tournoi des Académies de TOUBA-MBACKE</option>
            <option value="Amical">Dernier Match Amical & Pré-Tournoi</option>
          </select>
        </div>
      </div>

      {/* Match Cards List */}
      <div className="space-y-4">
        {filteredMatches.map(match => {
          const isFinished = match.status === 'finished';
          const isLive = match.status === 'live';

          return (
            <div
              key={match.id}
              className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 sm:p-6 shadow-sm hover:shadow-md transition-all space-y-4"
            >
              {/* Card Header */}
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-500/10 text-amber-500 border border-amber-500/20">
                    {match.competition}
                  </span>
                  <span className="text-xs text-slate-400 font-medium">
                    {match.round}
                  </span>
                </div>

                <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  <span>{match.date}</span>
                  {isLive ? (
                    <span className="px-2 py-0.2 rounded-full bg-rose-600 text-white font-black text-[10px] animate-pulse">
                      LIVE {match.liveMinute}'
                    </span>
                  ) : (
                    <span className="font-semibold">{match.time}</span>
                  )}
                </div>
              </div>

              {/* Match Opponents & Score: Strictly on the same line */}
              {(() => {
                const isOngam = match.id === 'm-ongam-1' || match.opponent?.includes('ESCALE');
                const homeLogo = isOngam
                  ? (clubInfo.logoUrl || '/icon.svg')
                  : match.isHome
                  ? (clubInfo.logoUrl || '/icon.svg')
                  : (match.opponentLogo || '/icon.svg');
                const awayLogo = isOngam
                  ? '/asc-escale.svg'
                  : match.isHome
                  ? (match.opponentLogo || '/icon.svg')
                  : (clubInfo.logoUrl || '/icon.svg');

                return (
                  <div className="flex flex-row items-center justify-between gap-2 sm:gap-4 py-2">
                    {/* Home Team */}
                    <div className="flex items-center gap-2 sm:gap-3 flex-1 justify-start min-w-0">
                      <TeamLogo
                        src={homeLogo}
                        teamName={match.homeTeamName}
                        isHomeClub={match.isHome || isOngam}
                        size="md"
                      />
                      <div className="min-w-0">
                        <h3 className="text-xs sm:text-base font-black text-slate-900 dark:text-white truncate">
                          {match.homeTeamName}
                        </h3>
                        <span className="text-[10px] sm:text-[11px] text-amber-500 font-semibold block whitespace-nowrap">Domicile</span>
                      </div>
                    </div>

                    {/* Score / VS Center - Exactly on the same line */}
                    <div className="px-3 sm:px-6 py-1.5 sm:py-2 rounded-2xl bg-slate-100 dark:bg-slate-800 text-center flex-shrink-0 whitespace-nowrap">
                      {isFinished || isLive ? (
                        <div className="space-y-0.5">
                          <div className="flex items-center justify-center gap-1.5 sm:gap-3 whitespace-nowrap">
                            <span className="text-xl sm:text-3xl font-black text-slate-950 dark:text-white font-mono">
                              {match.homeScore}
                            </span>
                            <span className="text-slate-400 font-light text-base sm:text-xl">-</span>
                            <span className="text-xl sm:text-3xl font-black text-slate-950 dark:text-white font-mono">
                              {match.awayScore}
                            </span>
                          </div>
                          {match.isForfeit && (
                            <span className="inline-block px-2 py-0.2 rounded-full bg-amber-500/20 text-amber-500 font-bold text-[8px] sm:text-[9px] uppercase tracking-wider whitespace-nowrap">
                              Forfait
                            </span>
                          )}
                        </div>
                      ) : (
                        <span className="text-xs font-extrabold text-amber-500 uppercase tracking-widest whitespace-nowrap">
                          VS
                        </span>
                      )}
                      <span className="text-[9px] sm:text-[10px] text-slate-400 block mt-0.5 whitespace-nowrap">
                        {match.isForfeit ? 'Victoire Forfait' : isFinished ? 'Score Final' : isLive ? 'Match en cours' : match.time}
                      </span>
                    </div>

                    {/* Away Team */}
                    <div className="flex items-center gap-2 sm:gap-3 flex-1 justify-end text-right min-w-0">
                      <div className="min-w-0">
                        <h3 className="text-xs sm:text-base font-black text-slate-900 dark:text-white truncate">
                          {match.awayTeamName}
                        </h3>
                        <span className="text-[10px] sm:text-[11px] text-slate-400 font-semibold block whitespace-nowrap">Extérieur</span>
                      </div>
                      <TeamLogo
                        src={awayLogo}
                        teamName={match.awayTeamName}
                        isHomeClub={!match.isHome && !isOngam}
                        size="md"
                      />
                    </div>
                  </div>
                );
              })()}

              {/* Card Footer Actions */}
              <div className="flex flex-col sm:flex-row items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800 gap-3">
                <span className="text-xs text-slate-500 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  {match.venue}
                </span>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <button
                    onClick={() => setSelectedMatchId(match.id)}
                    className={`flex-1 sm:flex-none px-4 py-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-sm ${
                      isFinished || isLive
                        ? 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-750 text-slate-800 dark:text-slate-200'
                        : `${accent.bg}`
                    }`}
                  >
                    {isFinished || isLive ? (
                      <>
                        <Activity className="w-3.5 h-3.5 text-amber-500" />
                        <span>{t('detailed_stats')}</span>
                      </>
                    ) : (
                      <>
                        <Calendar className="w-3.5 h-3.5" />
                        <span>Feuille de Match</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Admin Quick Action Controls */}
              {isAdminLoggedIn && (
                <div className="mt-3 pt-3 border-t border-red-500/20 bg-red-500/5 -mx-6 -mb-6 p-4 rounded-b-3xl flex flex-wrap items-center justify-between gap-2 text-xs">
                  <span className="font-extrabold text-red-600 dark:text-red-400 flex items-center gap-1 text-[11px] uppercase tracking-wider">
                    ⚙️ Options Administrateur
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setActiveTab('admin')}
                      className="px-3 py-1.5 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 transition flex items-center gap-1.5 shadow"
                    >
                      <Edit className="w-3.5 h-3.5 text-blue-400" />
                      <span>Modifier dans l'Admin</span>
                    </button>
                    <button
                      onClick={() => setMatchToDelete(match)}
                      className="px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition flex items-center gap-1.5 shadow"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Supprimer ce Match</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
      </>
      )}

      {/* In-App Delete Confirmation Modal (no window.confirm) */}
      {matchToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="w-full max-w-md rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl p-6 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-rose-500/10 text-rose-600 dark:text-rose-400 flex items-center justify-center flex-shrink-0 border border-rose-500/20">
                <Trash2 className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-black text-slate-900 dark:text-white">
                  Supprimer cette rencontre ?
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {matchToDelete.homeTeamName} vs {matchToDelete.awayTeamName} ({matchToDelete.date})
                </p>
              </div>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-300">
              Voulez-vous vraiment supprimer ce match du calendrier officiel ? Cette action est immédiate et irréversible.
            </p>

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
                className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-black shadow-lg transition flex items-center justify-center gap-1.5"
              >
                <Trash2 className="w-4 h-4" />
                <span>Confirmer la Suppression</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
