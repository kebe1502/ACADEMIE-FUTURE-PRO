import React, { useState } from 'react';
import {
  Trophy,
  Plus,
  Edit,
  Trash2,
  ArrowUpDown,
  RotateCcw,
  CheckCircle2,
  X,
  Search,
  Filter,
  Shield,
  Award,
  Sparkles,
  Info,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { StandingsRow } from '../types';

export const AdminStandingsManager: React.FC = () => {
  const {
    standings,
    addStandingsRow,
    updateStandingsRow,
    deleteStandingsRow,
    autoSortStandings,
    resetStandings,
    clubInfo,
    showToast,
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCompetition, setSelectedCompetition] = useState<string>('all');
  
  // Modal State for Add / Edit
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRow, setEditingRow] = useState<StandingsRow | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Form fields
  const [teamName, setTeamName] = useState('');
  const [logoUrl, setLogoUrl] = useState('');
  const [competition, setCompetition] = useState('Championnat ONGAM Cadets 2026 - Poule A');
  const [played, setPlayed] = useState<number>(1);
  const [won, setWon] = useState<number>(1);
  const [drawn, setDrawn] = useState<number>(0);
  const [lost, setLost] = useState<number>(0);
  const [goalsFor, setGoalsFor] = useState<number>(3);
  const [goalsAgainst, setGoalsAgainst] = useState<number>(0);
  const [manualPoints, setManualPoints] = useState<string>('');
  const [isOurClub, setIsOurClub] = useState(false);
  const [formStr, setFormStr] = useState('V');
  const [notes, setNotes] = useState('');

  // Auto-calculated values
  const computedDiff = goalsFor - goalsAgainst;
  const computedPts = manualPoints !== '' ? parseInt(manualPoints, 10) || 0 : won * 3 + drawn;

  const competitionsList = Array.from(new Set(standings.map(s => s.competition || 'Championnat ONGAM'))).filter(Boolean);

  const filteredStandings = standings.filter(row => {
    const matchesSearch = row.teamName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesComp = selectedCompetition === 'all' || row.competition === selectedCompetition;
    return matchesSearch && matchesComp;
  });

  const handleOpenAdd = () => {
    setEditingRow(null);
    setTeamName('');
    setLogoUrl('');
    setCompetition(competitionsList[0] || 'Championnat ONGAM Cadets 2026 - Poule A');
    setPlayed(1);
    setWon(0);
    setDrawn(0);
    setLost(1);
    setGoalsFor(0);
    setGoalsAgainst(1);
    setManualPoints('');
    setIsOurClub(false);
    setFormStr('D');
    setNotes('');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (row: StandingsRow) => {
    setEditingRow(row);
    setTeamName(row.teamName);
    setLogoUrl(row.logoUrl || '');
    setCompetition(row.competition || 'Championnat ONGAM Cadets 2026 - Poule A');
    setPlayed(row.played);
    setWon(row.won);
    setDrawn(row.drawn);
    setLost(row.lost);
    setGoalsFor(row.goalsFor);
    setGoalsAgainst(row.goalsAgainst);
    setManualPoints(row.points.toString());
    setIsOurClub(Boolean(row.isOurClub));
    setFormStr(row.form ? row.form.join(',') : 'V');
    setNotes(row.notes || '');
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!teamName.trim()) {
      showToast('Erreur', 'Veuillez saisir le nom de l’équipe.', 'alert');
      return;
    }

    const parsedForm = formStr
      .split(',')
      .map(s => s.trim().toUpperCase())
      .filter(s => s === 'V' || s === 'N' || s === 'D') as ('V' | 'N' | 'D')[];

    const rowData: Omit<StandingsRow, 'id' | 'position'> = {
      teamName: teamName.trim(),
      logoUrl: logoUrl.trim() || undefined,
      competition: competition.trim(),
      played: Number(played) || 0,
      won: Number(won) || 0,
      drawn: Number(drawn) || 0,
      lost: Number(lost) || 0,
      goalsFor: Number(goalsFor) || 0,
      goalsAgainst: Number(goalsAgainst) || 0,
      goalDifference: computedDiff,
      points: computedPts,
      isOurClub: Boolean(isOurClub),
      form: parsedForm.length > 0 ? parsedForm : undefined,
      notes: notes.trim() || undefined,
    };

    if (editingRow) {
      updateStandingsRow(editingRow.id, rowData);
    } else {
      addStandingsRow({
        ...rowData,
        id: `std-${Date.now()}`,
        position: standings.length + 1,
      });
    }

    setIsModalOpen(false);
  };

  const leaderTeam = standings[0];
  const ourClubRow = standings.find(s => s.isOurClub || s.teamName.toLowerCase().includes('diallor'));

  return (
    <div className="space-y-6 animate-in fade-in">
      {/* Top Banner & Quick Stats */}
      <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30 text-xs font-bold">
            <Trophy className="w-3.5 h-3.5" />
            <span>Gestion Officielle des Classements</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black tracking-tight">
            Tableau du Championnat & Poules
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
            Créez, ajustez et mettez à jour les points, victoires, nuls, défaites et différence de buts de toutes les équipes du championnat de l’<strong>{clubInfo.name}</strong>.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={autoSortStandings}
            className="px-4 py-2.5 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-black flex items-center gap-2 shadow-lg transition"
            title="Trier automatiquement selon les points, la différence de buts et l'attaque"
          >
            <ArrowUpDown className="w-4 h-4" />
            <span>Trier Automatiquement</span>
          </button>

          <button
            type="button"
            onClick={handleOpenAdd}
            className="px-4 py-2.5 rounded-2xl bg-red-600 hover:bg-red-500 text-white text-xs font-black flex items-center gap-2 shadow-lg shadow-red-600/30 transition"
          >
            <Plus className="w-4 h-4" />
            <span>+ Ajouter une Équipe</span>
          </button>

          <button
            type="button"
            onClick={() => {
              if (window.confirm('Voulez-vous rétablir le classement officiel initial de l’ONGAM ?')) {
                resetStandings();
              }
            }}
            className="p-2.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition"
            title="Rétablir les données initiales"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Highlights Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Équipes engagées</span>
          <span className="text-2xl font-black text-slate-900 dark:text-white">{standings.length}</span>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Leader Actuel</span>
          <span className="text-base sm:text-lg font-black text-amber-500 truncate block">
            {leaderTeam?.teamName || '—'} ({leaderTeam?.points || 0} pts)
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Rang ASC Dialloré</span>
          <span className="text-xl sm:text-2xl font-black text-emerald-500">
            {ourClubRow ? `#${ourClubRow.position} (${ourClubRow.points} pts)` : 'Non classé'}
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Différence ASC Dialloré</span>
          <span className="text-xl sm:text-2xl font-black text-blue-500">
            {ourClubRow && ourClubRow.goalDifference > 0 ? `+${ourClubRow.goalDifference}` : (ourClubRow?.goalDifference || 0)}
          </span>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Rechercher une équipe..."
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs outline-none focus:border-amber-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-4 h-4 text-slate-400" />
          <select
            value={selectedCompetition}
            onChange={e => setSelectedCompetition(e.target.value)}
            className="w-full sm:w-auto px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold outline-none"
          >
            <option value="all">Toutes les poules / compétitions</option>
            {competitionsList.map(comp => (
              <option key={comp} value={comp}>{comp}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Table */}
      <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-950 text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider border-b border-slate-200 dark:border-slate-800">
                <th className="py-3.5 px-4 text-center w-14">Pos</th>
                <th className="py-3.5 px-4">Équipe</th>
                <th className="py-3.5 px-3 text-center">J</th>
                <th className="py-3.5 px-3 text-center">V</th>
                <th className="py-3.5 px-3 text-center">N</th>
                <th className="py-3.5 px-3 text-center">D</th>
                <th className="py-3.5 px-3 text-center hidden sm:table-cell">BP</th>
                <th className="py-3.5 px-3 text-center hidden sm:table-cell">BC</th>
                <th className="py-3.5 px-3 text-center">DIFF</th>
                <th className="py-3.5 px-4 text-center font-black text-slate-900 dark:text-white">PTS</th>
                <th className="py-3.5 px-3 text-center hidden md:table-cell">Forme</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-medium">
              {filteredStandings.map((row) => {
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
                    <td className="py-3 px-4 text-center">
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
                    <td className="py-3 px-4">
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
                              <span className="px-1.5 py-0.5 rounded-md bg-amber-500/20 text-amber-500 text-[10px] font-black uppercase">
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
                    <td className="py-3 px-3 text-center">{row.played}</td>
                    <td className="py-3 px-3 text-center text-emerald-600 dark:text-emerald-400 font-bold">{row.won}</td>
                    <td className="py-3 px-3 text-center text-amber-600 dark:text-amber-400">{row.drawn}</td>
                    <td className="py-3 px-3 text-center text-red-500">{row.lost}</td>
                    <td className="py-3 px-3 text-center text-slate-500 hidden sm:table-cell">{row.goalsFor}</td>
                    <td className="py-3 px-3 text-center text-slate-500 hidden sm:table-cell">{row.goalsAgainst}</td>
                    <td className="py-3 px-3 text-center font-bold">
                      <span className={row.goalDifference > 0 ? 'text-emerald-500 font-black' : row.goalDifference < 0 ? 'text-red-500' : 'text-slate-400'}>
                        {row.goalDifference > 0 ? `+${row.goalDifference}` : row.goalDifference}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center font-black text-sm text-slate-900 dark:text-white">
                      {row.points}
                    </td>

                    {/* Form Icons */}
                    <td className="py-3 px-3 text-center hidden md:table-cell">
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

                    {/* Actions */}
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleOpenEdit(row)}
                          className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-amber-500 hover:text-slate-950 text-slate-600 dark:text-slate-300 transition"
                          title="Modifier les statistiques de cette équipe"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>

                        <button
                          type="button"
                          onClick={() => setDeleteConfirmId(row.id)}
                          className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-red-600 hover:text-white text-slate-600 dark:text-slate-300 transition"
                          title="Retirer cette équipe du classement"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="w-full max-w-sm rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 shadow-2xl text-center space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-red-600/10 text-red-500 flex items-center justify-center mx-auto font-bold">
              <Trash2 className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-black text-slate-900 dark:text-white">Retirer du classement ?</h3>
              <p className="text-xs text-slate-500 mt-1">
                L’équipe sera supprimée du tableau et les positions suivantes seront automatiquement décalées.
              </p>
            </div>
            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setDeleteConfirmId(null)}
                className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-200"
              >
                Annuler
              </button>
              <button
                type="button"
                onClick={() => {
                  deleteStandingsRow(deleteConfirmId);
                  setDeleteConfirmId(null);
                }}
                className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-black"
              >
                Confirmer la suppression
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto animate-in fade-in">
          <div className="w-full max-w-lg rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 sm:p-7 shadow-2xl my-auto space-y-5">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center font-bold">
                  <Trophy className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900 dark:text-white">
                    {editingRow ? 'Modifier l’équipe au classement' : 'Ajouter une équipe au classement'}
                  </h3>
                  <p className="text-[11px] text-slate-400">Statistiques officielles du Championnat ONGAM</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Nom du club ou de l'ASC *
                  </label>
                  <input
                    type="text"
                    required
                    value={teamName}
                    onChange={e => setTeamName(e.target.value)}
                    placeholder="ex. ASC Dialloré, ASC Manko, Diambars FC..."
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs outline-none focus:border-amber-500 font-bold"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    URL du Logo / Blason (optionnel)
                  </label>
                  <input
                    type="text"
                    value={logoUrl}
                    onChange={e => setLogoUrl(e.target.value)}
                    placeholder="/icon.svg ou https://..."
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs outline-none"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Compétition / Poule
                  </label>
                  <input
                    type="text"
                    value={competition}
                    onChange={e => setCompetition(e.target.value)}
                    placeholder="Championnat ONGAM Cadets 2026 - Poule A"
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs outline-none"
                  />
                </div>

                <div className="sm:col-span-2 flex items-center gap-2 p-3 rounded-xl bg-amber-500/10 border border-amber-500/20">
                  <input
                    type="checkbox"
                    id="isOurClubCheckbox"
                    checked={isOurClub}
                    onChange={e => setIsOurClub(e.target.checked)}
                    className="w-4 h-4 accent-amber-500 cursor-pointer"
                  />
                  <label htmlFor="isOurClubCheckbox" className="text-xs font-bold text-amber-500 cursor-pointer">
                    C'est l'ASC Dialloré (Mettre en valeur dans le classement)
                  </label>
                </div>
              </div>

              {/* Stats Numerical Grid */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-3">
                <span className="text-[11px] font-black uppercase text-slate-400 block tracking-wider">
                  Bilan comptable
                </span>

                <div className="grid grid-cols-4 gap-2">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 mb-1">Joués (J)</label>
                    <input
                      type="number"
                      min="0"
                      value={played}
                      onChange={e => setPlayed(parseInt(e.target.value) || 0)}
                      className="w-full px-2 py-1.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-center font-bold text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-emerald-500 mb-1">Victoires (V)</label>
                    <input
                      type="number"
                      min="0"
                      value={won}
                      onChange={e => setWon(parseInt(e.target.value) || 0)}
                      className="w-full px-2 py-1.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-center font-bold text-xs text-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-amber-500 mb-1">Nuls (N)</label>
                    <input
                      type="number"
                      min="0"
                      value={drawn}
                      onChange={e => setDrawn(parseInt(e.target.value) || 0)}
                      className="w-full px-2 py-1.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-center font-bold text-xs text-amber-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-red-500 mb-1">Défaites (D)</label>
                    <input
                      type="number"
                      min="0"
                      value={lost}
                      onChange={e => setLost(parseInt(e.target.value) || 0)}
                      className="w-full px-2 py-1.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-center font-bold text-xs text-red-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-4 gap-2 pt-1">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 mb-1">Buts Pour (BP)</label>
                    <input
                      type="number"
                      min="0"
                      value={goalsFor}
                      onChange={e => setGoalsFor(parseInt(e.target.value) || 0)}
                      className="w-full px-2 py-1.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-center font-bold text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 mb-1">Buts Contre (BC)</label>
                    <input
                      type="number"
                      min="0"
                      value={goalsAgainst}
                      onChange={e => setGoalsAgainst(parseInt(e.target.value) || 0)}
                      className="w-full px-2 py-1.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-center font-bold text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-blue-500 mb-1">Différence (DIFF)</label>
                    <div className="w-full py-1.5 rounded-lg bg-blue-500/10 text-blue-500 text-center font-black text-xs border border-blue-500/20">
                      {computedDiff > 0 ? `+${computedDiff}` : computedDiff}
                    </div>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-amber-500 mb-1">Points (PTS)</label>
                    <div className="w-full py-1.5 rounded-lg bg-amber-500/10 text-amber-500 text-center font-black text-xs border border-amber-500/20">
                      {computedPts} pts
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Forme récente (ex: V,N,V)
                  </label>
                  <input
                    type="text"
                    value={formStr}
                    onChange={e => setFormStr(e.target.value)}
                    placeholder="V, N, D"
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Remarque officielle (optionnel)
                  </label>
                  <input
                    type="text"
                    value={notes}
                    onChange={e => setNotes(e.target.value)}
                    placeholder="Forfait 3-0, Pénalité..."
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-xs font-bold text-slate-600 dark:text-slate-300"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-black shadow-lg shadow-red-600/30 flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Enregistrer l'équipe</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
