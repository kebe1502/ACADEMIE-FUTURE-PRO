import React, { useState } from 'react';
import {
  Compass,
  Plus,
  Edit,
  Trash2,
  CheckCircle2,
  X,
  Star,
  Shield,
  RotateCcw,
  Users,
  Target,
  ChevronRight,
  Info,
  Check,
  Award,
  Sparkles,
  Sliders,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { TacticalFormation, TacticalStarter } from '../types';

export const AdminTacticsManager: React.FC = () => {
  const {
    tacticalFormations,
    activeFormationId,
    setActiveFormationId,
    addTacticalFormation,
    updateTacticalFormation,
    deleteTacticalFormation,
    setDefaultTacticalFormation,
    resetTacticalFormations,
    players,
    clubInfo,
    showToast,
  } = useApp();

  const currentFormation =
    tacticalFormations.find(f => f.id === activeFormationId) ||
    tacticalFormations[0];

  // Quick player assignment modal
  const [selectedStarterForSwap, setSelectedStarterForSwap] = useState<TacticalStarter | null>(null);

  // Full Formation Create/Edit Modal State
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingFormation, setEditingFormation] = useState<TacticalFormation | null>(null);

  // Form fields for modal
  const [formName, setFormName] = useState('');
  const [formSystem, setFormSystem] = useState('4-3-3');
  const [formStyle, setFormStyle] = useState<TacticalFormation['style']>('offensif');
  const [formDescription, setFormDescription] = useState('');
  const [formCoachNotes, setFormCoachNotes] = useState('');
  const [formPrinciplesStr, setFormPrinciplesStr] = useState('');

  // Delete confirmation
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Helper to generate default starter coordinates for standard formations
  const generatePresetStarters = (system: string): TacticalStarter[] => {
    switch (system) {
      case '4-2-3-1':
        return [
          { id: 'p-1', positionIndex: 1, role: 'GK', label: 'Gardien Titulaire', playerName: 'Serigne Fallou Diop', playerNumber: 1, x: 50, y: 10 },
          { id: 'p-2', positionIndex: 2, role: 'DD', label: 'Latéral Droit', playerName: 'Ousmane Kebe', playerNumber: 2, x: 85, y: 28 },
          { id: 'p-3', positionIndex: 3, role: 'DC', label: 'Défenseur Central Droit', playerName: 'Baye Ablaye Dieng', playerNumber: 4, x: 63, y: 24 },
          { id: 'p-4', positionIndex: 4, role: 'DC', label: 'Défenseur Central Gauche', playerName: 'Cheikh Dieng', playerNumber: 5, x: 37, y: 24 },
          { id: 'p-5', positionIndex: 5, role: 'DG', label: 'Latéral Gauche', playerName: 'Sidy', playerNumber: 3, x: 15, y: 28 },
          { id: 'p-6', positionIndex: 6, role: 'MD', label: 'Pivot Défensif 1', playerName: 'Baye Saliou', playerNumber: 6, x: 38, y: 46 },
          { id: 'p-7', positionIndex: 7, role: 'MD', label: 'Pivot Défensif 2', playerName: 'Latif', playerNumber: 8, x: 62, y: 46 },
          { id: 'p-8', positionIndex: 8, role: 'MO', label: 'Meneur Axial N°10', playerName: 'Baye Cheikh Gadiaga', playerNumber: 15, x: 50, y: 65 },
          { id: 'p-9', positionIndex: 9, role: 'AD', label: 'Ailier Droit', playerName: 'Pape Modou Cissé', playerNumber: 10, x: 84, y: 76 },
          { id: 'p-10', positionIndex: 10, role: 'AG', label: 'Ailier Gauche', playerName: 'Takha Neymar', playerNumber: 11, x: 16, y: 76 },
          { id: 'p-11', positionIndex: 11, role: 'BU', label: 'Avant-Centre', playerName: 'Cheikh Mbaye', playerNumber: 9, x: 50, y: 88 },
        ];
      case '3-5-2':
        return [
          { id: 'p-1', positionIndex: 1, role: 'GK', label: 'Gardien Titulaire', playerName: 'Serigne Fallou Diop', playerNumber: 1, x: 50, y: 10 },
          { id: 'p-2', positionIndex: 2, role: 'DC', label: 'Axial Droit', playerName: 'Souleymane', playerNumber: 12, x: 74, y: 25 },
          { id: 'p-3', positionIndex: 3, role: 'DC', label: 'Axial Libéro', playerName: 'Baye Ablaye Dieng', playerNumber: 4, x: 50, y: 22 },
          { id: 'p-4', positionIndex: 4, role: 'DC', label: 'Axial Gauche', playerName: 'Cheikh Dieng', playerNumber: 5, x: 26, y: 25 },
          { id: 'p-5', positionIndex: 5, role: 'MD', label: 'Piston Droit', playerName: 'Ousmane Kebe', playerNumber: 2, x: 90, y: 54 },
          { id: 'p-6', positionIndex: 6, role: 'MC', label: 'Milieu Central Droit', playerName: 'Baye Saliou', playerNumber: 6, x: 62, y: 48 },
          { id: 'p-7', positionIndex: 7, role: 'MC', label: 'Milieu Central Gauche', playerName: 'Latif', playerNumber: 8, x: 38, y: 48 },
          { id: 'p-8', positionIndex: 8, role: 'MG', label: 'Piston Gauche', playerName: 'Sidy', playerNumber: 3, x: 10, y: 54 },
          { id: 'p-9', positionIndex: 9, role: 'MO', label: 'Meneur Libre', playerName: 'Aliou', playerNumber: 14, x: 50, y: 68 },
          { id: 'p-10', positionIndex: 10, role: 'BU', label: 'Attaquant Droit', playerName: 'Pape Modou Cissé', playerNumber: 10, x: 66, y: 86 },
          { id: 'p-11', positionIndex: 11, role: 'BU', label: 'Attaquant Gauche', playerName: 'Cheikh Mbaye', playerNumber: 9, x: 34, y: 86 },
        ];
      case '4-4-2':
        return [
          { id: 'p-1', positionIndex: 1, role: 'GK', label: 'Gardien Titulaire', playerName: 'Serigne Fallou Diop', playerNumber: 1, x: 50, y: 10 },
          { id: 'p-2', positionIndex: 2, role: 'DD', label: 'Latéral Droit', playerName: 'Ousmane Kebe', playerNumber: 2, x: 86, y: 28 },
          { id: 'p-3', positionIndex: 3, role: 'DC', label: 'Défenseur Central Droit', playerName: 'Baye Ablaye Dieng', playerNumber: 4, x: 63, y: 24 },
          { id: 'p-4', positionIndex: 4, role: 'DC', label: 'Défenseur Central Gauche', playerName: 'Cheikh Dieng', playerNumber: 5, x: 37, y: 24 },
          { id: 'p-5', positionIndex: 5, role: 'DG', label: 'Latéral Gauche', playerName: 'Sidy', playerNumber: 3, x: 14, y: 28 },
          { id: 'p-6', positionIndex: 6, role: 'MD', label: 'Milieu Droit', playerName: 'Pape Modou Cissé', playerNumber: 10, x: 86, y: 58 },
          { id: 'p-7', positionIndex: 7, role: 'MC', label: 'Milieu Axial 1', playerName: 'Baye Saliou', playerNumber: 6, x: 62, y: 50 },
          { id: 'p-8', positionIndex: 8, role: 'MC', label: 'Milieu Axial 2', playerName: 'Latif', playerNumber: 8, x: 38, y: 50 },
          { id: 'p-9', positionIndex: 9, role: 'MG', label: 'Milieu Gauche', playerName: 'Fallou Cissé', playerNumber: 7, x: 14, y: 58 },
          { id: 'p-10', positionIndex: 10, role: 'BU', label: 'Attaquant Pivot', playerName: 'Cheikh Mbaye', playerNumber: 9, x: 38, y: 85 },
          { id: 'p-11', positionIndex: 11, role: 'BU', label: 'Attaquant Finisseur', playerName: 'Bouna Diagne', playerNumber: 19, x: 62, y: 85 },
        ];
      case '4-3-3':
      default:
        return [
          { id: 'p-1', positionIndex: 1, role: 'GK', label: 'Gardien Titulaire', playerName: 'Serigne Fallou Diop', playerNumber: 1, x: 50, y: 10 },
          { id: 'p-2', positionIndex: 2, role: 'DD', label: 'Latéral Droit', playerName: 'Ousmane Kebe', playerNumber: 2, x: 86, y: 28 },
          { id: 'p-3', positionIndex: 3, role: 'DC', label: 'Défenseur Central Droit', playerName: 'Baye Ablaye Dieng', playerNumber: 4, x: 63, y: 24 },
          { id: 'p-4', positionIndex: 4, role: 'DC', label: 'Défenseur Central Gauche', playerName: 'Cheikh Dieng', playerNumber: 5, x: 37, y: 24 },
          { id: 'p-5', positionIndex: 5, role: 'DG', label: 'Latéral Gauche', playerName: 'Sidy', playerNumber: 3, x: 14, y: 28 },
          { id: 'p-6', positionIndex: 6, role: 'MD', label: 'Sentinelle Défensive', playerName: 'Baye Saliou', playerNumber: 6, x: 50, y: 46 },
          { id: 'p-7', positionIndex: 7, role: 'MC', label: 'Milieu Relayeurs', playerName: 'Latif', playerNumber: 8, x: 32, y: 58 },
          { id: 'p-8', positionIndex: 8, role: 'MO', label: 'Milieu Créateur', playerName: 'Aliou', playerNumber: 14, x: 68, y: 62 },
          { id: 'p-9', positionIndex: 9, role: 'AD', label: 'Ailier Droit (Capitaine)', playerName: 'Pape Modou Cissé', playerNumber: 10, x: 84, y: 80 },
          { id: 'p-10', positionIndex: 10, role: 'AG', label: 'Ailier Gauche', playerName: 'Fallou Cissé', playerNumber: 7, x: 16, y: 80 },
          { id: 'p-11', positionIndex: 11, role: 'BU', label: 'Buteur / Renard', playerName: 'Cheikh Mbaye', playerNumber: 9, x: 50, y: 86 },
        ];
    }
  };

  const handleOpenAdd = () => {
    setEditingFormation(null);
    setFormName('Nouveau Dispositif Tactique');
    setFormSystem('4-3-3');
    setFormStyle('offensif');
    setFormDescription('Dispositif tactique préparé sous les consignes de Coach Gagne.');
    setFormCoachNotes('Application rigoureuse du bloc défensif et utilisation de la vitesse de transition.');
    setFormPrinciplesStr('Pressing haut, Jeu rapide en un-deux, Concentration maximale sur coups de pied arrêtés');
    setIsEditModalOpen(true);
  };

  const handleOpenEdit = (formation: TacticalFormation) => {
    setEditingFormation(formation);
    setFormName(formation.name);
    setFormSystem(formation.system);
    setFormStyle(formation.style);
    setFormDescription(formation.description);
    setFormCoachNotes(formation.coachNotes || '');
    setFormPrinciplesStr(formation.keyPrinciples ? formation.keyPrinciples.join(', ') : '');
    setIsEditModalOpen(true);
  };

  const handleSaveFormation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) {
      showToast('Erreur', 'Veuillez saisir un nom pour ce schéma tactique.', 'alert');
      return;
    }

    const principles = formPrinciplesStr
      .split(',')
      .map(p => p.trim())
      .filter(Boolean);

    if (editingFormation) {
      updateTacticalFormation(editingFormation.id, {
        name: formName.trim(),
        system: formSystem,
        style: formStyle,
        description: formDescription.trim(),
        coachNotes: formCoachNotes.trim(),
        keyPrinciples: principles.length > 0 ? principles : ['Discipline tactique', 'Jeu en transition'],
      });
    } else {
      const newFormation: TacticalFormation = {
        id: `tac-${Date.now()}`,
        name: formName.trim(),
        system: formSystem,
        style: formStyle,
        isDefault: false,
        description: formDescription.trim(),
        coachNotes: formCoachNotes.trim(),
        keyPrinciples: principles.length > 0 ? principles : ['Discipline tactique', 'Transitions rapides'],
        starters: generatePresetStarters(formSystem),
        updatedAt: new Date().toLocaleDateString('fr-FR'),
      };
      addTacticalFormation(newFormation);
      setActiveFormationId(newFormation.id);
    }

    setIsEditModalOpen(false);
  };

  // Assign a player from squad to the selected starter position
  const handleAssignPlayer = (playerId: string) => {
    if (!selectedStarterForSwap || !currentFormation) return;
    const targetPlayer = players.find(p => p.id === playerId);
    if (!targetPlayer) return;

    const updatedStarters = currentFormation.starters.map(st => {
      if (st.id === selectedStarterForSwap.id) {
        return {
          ...st,
          playerId: targetPlayer.id,
          playerName: targetPlayer.name,
          playerNumber: targetPlayer.number,
        };
      }
      return st;
    });

    updateTacticalFormation(currentFormation.id, {
      starters: updatedStarters,
    });

    setSelectedStarterForSwap(null);
    showToast('Joueur titularisé', `${targetPlayer.name} (#${targetPlayer.number}) assigné au poste ${selectedStarterForSwap.role}.`, 'success');
  };

  const styleBadgeColors: Record<TacticalFormation['style'], string> = {
    offensif: 'bg-red-500/10 text-red-500 border-red-500/30',
    equilibre: 'bg-blue-500/10 text-blue-500 border-blue-500/30',
    defensif: 'bg-slate-500/10 text-slate-400 border-slate-500/30',
    possession: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/30',
    'contre-attaque': 'bg-amber-500/10 text-amber-500 border-amber-500/30',
  };

  return (
    <div className="space-y-6 animate-in fade-in">
      {/* Top Banner */}
      <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-bold">
            <Compass className="w-3.5 h-3.5" />
            <span>Direction Technique & Schémas Tactiques</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black tracking-tight">
            Dispositifs Tactiques & Formations de Coach Gagne
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
            Configurez les schémas de jeu de l'<strong>{clubInfo.name}</strong> (4-3-3, 4-2-3-1, 3-5-2), assignez les titulaires sur le terrain et définissez les consignes de match.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={handleOpenAdd}
            className="px-4 py-2.5 rounded-2xl bg-red-600 hover:bg-red-500 text-white text-xs font-black flex items-center gap-2 shadow-lg shadow-red-600/30 transition"
          >
            <Plus className="w-4 h-4" />
            <span>+ Nouveau Schéma Tactique</span>
          </button>

          <button
            type="button"
            onClick={() => {
              if (window.confirm('Voulez-vous restaurer les schémas tactiques officiels de Coach Gagne ?')) {
                resetTacticalFormations();
              }
            }}
            className="p-2.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition"
            title="Rétablir les schémas par défaut"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Formation Selector Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {tacticalFormations.map(formation => {
          const isActive = formation.id === activeFormationId;
          return (
            <button
              key={formation.id}
              type="button"
              onClick={() => setActiveFormationId(formation.id)}
              className={`px-4 py-3 rounded-2xl text-xs font-bold transition flex items-center gap-2.5 flex-shrink-0 cursor-pointer ${
                isActive
                  ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/20 font-black'
                  : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <span className={`px-2 py-0.5 rounded-lg text-[10px] font-mono font-black ${
                isActive ? 'bg-slate-950 text-amber-400' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
              }`}>
                {formation.system}
              </span>
              <span>{formation.name}</span>
              {formation.isDefault && (
                <Star className={`w-3.5 h-3.5 fill-current ${isActive ? 'text-slate-950' : 'text-amber-500'}`} />
              )}
            </button>
          );
        })}
      </div>

      {/* Main Tactical Studio: 2 Columns (Pitch on Left, Details & Starters on Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* ============================================================== */}
        {/* COLONNE GAUCHE (7 / 12) : TERRAIN 2D DE FOOTBALL               */}
        {/* ============================================================== */}
        <div className="lg:col-span-7 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 sm:p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-black text-slate-900 dark:text-white uppercase font-serif">
                  {currentFormation?.name}
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-black bg-amber-500/10 text-amber-500 border border-amber-500/20">
                  {currentFormation?.system}
                </span>
              </div>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Cliquez sur un jeton pour modifier le titulaire assigné à ce poste
              </p>
            </div>

            <div className="flex items-center gap-1.5">
              {!currentFormation?.isDefault && (
                <button
                  type="button"
                  onClick={() => currentFormation && setDefaultTacticalFormation(currentFormation.id)}
                  className="px-3 py-1.5 rounded-xl bg-amber-500/15 hover:bg-amber-500 text-amber-500 hover:text-slate-950 border border-amber-500/30 text-[11px] font-bold transition flex items-center gap-1"
                  title="Définir comme schéma titulaire pour tous les matchs"
                >
                  <Star className="w-3 h-3" />
                  <span>Activer en Titulaire</span>
                </button>
              )}

              <button
                type="button"
                onClick={() => currentFormation && handleOpenEdit(currentFormation)}
                className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-600 dark:text-slate-300 transition"
                title="Modifier les détails du schéma"
              >
                <Edit className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => currentFormation && setDeleteConfirmId(currentFormation.id)}
                className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-red-600 hover:text-white text-slate-600 dark:text-slate-300 transition"
                title="Supprimer ce schéma"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* 2D PITCH CONTAINER */}
          <div className="relative w-full aspect-[4/5] sm:aspect-[3/4] max-h-[580px] mx-auto rounded-2xl overflow-hidden shadow-2xl border-4 border-[#1e4d2b] select-none bg-[#174224]">
            {/* Pelouse rayée réaliste */}
            <div
              className="absolute inset-0 opacity-90"
              style={{
                backgroundImage: 'repeating-linear-gradient(to bottom, #174224 0px, #174224 40px, #1a4a28 40px, #1a4a28 80px)',
              }}
            />

            {/* Field Lines (White SVG markings) */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none stroke-white/60" strokeWidth="2" fill="none">
              {/* Outer boundary */}
              <rect x="12" y="12" width="calc(100% - 24px)" height="calc(100% - 24px)" />

              {/* Halfway line */}
              <line x1="12" y1="50%" x2="calc(100% - 12px)" y2="50%" />

              {/* Center Circle & Spot */}
              <circle cx="50%" cy="50%" r="48" />
              <circle cx="50%" cy="50%" r="3" fill="white" />

              {/* Bottom Goal Area (Notre but) */}
              <rect x="25%" y="calc(100% - 75px)" width="50%" height="63px" />
              <rect x="36%" y="calc(100% - 38px)" width="28%" height="26px" />
              <circle cx="50%" cy="calc(100% - 50px)" r="2.5" fill="white" />
              <path d="M 40% calc(100% - 75px) A 35 35 0 0 1 60% calc(100% - 75px)" />

              {/* Top Goal Area (But adverse) */}
              <rect x="25%" y="12px" width="50%" height="63px" />
              <rect x="36%" y="12px" width="28%" height="26px" />
              <circle cx="50%" cy="50px" r="2.5" fill="white" />
              <path d="M 40% 75px A 35 35 0 0 0 60% 75px" />
            </svg>

            {/* Direction Arrow */}
            <div className="absolute top-2 left-1/2 -translate-x-1/2 px-2.5 py-0.5 rounded-full bg-black/40 text-white/80 text-[10px] font-bold tracking-wider uppercase pointer-events-none flex items-center gap-1">
              <span>Sens de l'attaque</span>
              <span>▲</span>
            </div>

            {/* Player Tokens positioned at x%, y% */}
            {currentFormation?.starters.map(starter => {
              const isGK = starter.role === 'GK';
              const isCaptain = starter.playerName.toLowerCase().includes('pape modou');

              return (
                <div
                  key={starter.id}
                  onClick={() => setSelectedStarterForSwap(starter)}
                  className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer group z-20 flex flex-col items-center"
                  style={{
                    left: `${starter.x}%`,
                    top: `${100 - starter.y}%`, // Invert Y so 0 is our goal at bottom, 100 is opponent goal at top
                  }}
                >
                  {/* Jersey circle with number */}
                  <div
                    className={`relative w-9 h-9 sm:w-11 sm:h-11 rounded-full flex items-center justify-center font-black text-xs sm:text-sm shadow-xl transition-all duration-200 group-hover:scale-115 border-2 ${
                      isGK
                        ? 'bg-amber-400 text-slate-950 border-white'
                        : isCaptain
                        ? 'bg-red-600 text-white border-amber-400 ring-2 ring-amber-400/60'
                        : 'bg-slate-950 text-white border-white'
                    }`}
                  >
                    <span>{starter.playerNumber}</span>

                    {/* Role badge top right */}
                    <span
                      className={`absolute -top-1 -right-1 px-1 rounded-sm text-[8px] font-black uppercase shadow ${
                        isGK
                          ? 'bg-slate-900 text-amber-300'
                          : 'bg-amber-500 text-slate-950'
                      }`}
                    >
                      {starter.role}
                    </span>

                    {/* Captain armband indicator */}
                    {isCaptain && (
                      <span className="absolute -bottom-1 -left-1 px-1 rounded bg-amber-400 text-slate-950 text-[8px] font-black">
                        C
                      </span>
                    )}
                  </div>

                  {/* Player Name Tag */}
                  <div className="mt-1 px-2 py-0.5 rounded-md bg-black/75 backdrop-blur-sm text-white text-[10px] font-extrabold max-w-[90px] sm:max-w-[110px] truncate shadow text-center border border-white/20 group-hover:bg-amber-500 group-hover:text-slate-950 transition-colors">
                    {starter.playerName.split(' ').slice(0, 2).join(' ')}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ============================================================== */}
        {/* COLONNE DROITE (5 / 12) : DÉTAILS DU SCHÉMA & TITULAIRES      */}
        {/* ============================================================== */}
        <div className="lg:col-span-5 space-y-5">
          {/* Overview Card */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <span className={`px-2.5 py-1 rounded-xl text-xs font-black uppercase border ${styleBadgeColors[currentFormation?.style || 'offensif']}`}>
                Style {currentFormation?.style}
              </span>
              {currentFormation?.isDefault ? (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-amber-500 text-slate-950 text-xs font-black shadow-sm">
                  <Star className="w-3 h-3 fill-current" />
                  <span>Schéma Titulaire Officiel</span>
                </span>
              ) : (
                <span className="text-xs text-slate-400">Schéma Alternatif</span>
              )}
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              {currentFormation?.description}
            </p>

            {currentFormation?.coachNotes && (
              <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-xs space-y-1">
                <span className="font-bold text-amber-500 flex items-center gap-1.5 uppercase text-[10px] tracking-wider">
                  <Info className="w-3.5 h-3.5" />
                  Consignes de vestiaire (Coach Gagne)
                </span>
                <p className="text-slate-700 dark:text-slate-200 italic leading-relaxed">
                  « {currentFormation.coachNotes} »
                </p>
              </div>
            )}

            {/* Key Principles */}
            {currentFormation?.keyPrinciples && currentFormation.keyPrinciples.length > 0 && (
              <div>
                <h4 className="text-[11px] font-black uppercase text-slate-400 tracking-wider mb-2">
                  Principes clés de jeu
                </h4>
                <ul className="space-y-1.5 text-xs text-slate-700 dark:text-slate-300">
                  {currentFormation.keyPrinciples.map((pr, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-emerald-500 font-bold">✔</span>
                      <span>{pr}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Starters 11 List */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-sm space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2.5">
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-2">
                <Users className="w-4 h-4 text-red-500" />
                <span>Les 11 Titulaires du Dispositif</span>
              </h3>
              <span className="text-[11px] font-bold text-slate-400">11 / 11 joueurs</span>
            </div>

            <div className="divide-y divide-slate-100 dark:divide-slate-800/60 max-h-[360px] overflow-y-auto pr-1">
              {currentFormation?.starters.map((starter) => (
                <div
                  key={starter.id}
                  onClick={() => setSelectedStarterForSwap(starter)}
                  className="py-2 flex items-center justify-between gap-2 hover:bg-slate-50 dark:hover:bg-slate-800/40 px-2 rounded-xl cursor-pointer transition"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className="w-6 h-6 rounded-lg bg-slate-950 text-white font-black text-xs flex items-center justify-center flex-shrink-0">
                      {starter.playerNumber}
                    </span>
                    <div className="min-w-0">
                      <span className="text-xs font-bold text-slate-900 dark:text-white truncate block">
                        {starter.playerName}
                      </span>
                      <span className="text-[10px] text-slate-400 truncate block">
                        {starter.label}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 flex-shrink-0">
                    <span className="px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-500 font-bold text-[10px]">
                      {starter.role}
                    </span>
                    <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* QUICK PLAYER ASSIGNMENT MODAL */}
      {selectedStarterForSwap && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="w-full max-w-md rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <div>
                <h3 className="text-base font-black text-slate-900 dark:text-white">
                  Assigner au poste : {selectedStarterForSwap.role} ({selectedStarterForSwap.label})
                </h3>
                <p className="text-xs text-slate-400">
                  Titulaire actuel : <strong>{selectedStarterForSwap.playerName} (#{selectedStarterForSwap.playerNumber})</strong>
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedStarterForSwap(null)}
                className="p-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-1.5 max-h-72 overflow-y-auto pr-1">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
                Sélectionner un joueur de l'effectif :
              </span>
              {players.map(p => {
                const isSelected = p.id === selectedStarterForSwap.playerId || p.name === selectedStarterForSwap.playerName;
                return (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => handleAssignPlayer(p.id)}
                    className={`w-full p-2.5 rounded-2xl flex items-center justify-between text-left transition ${
                      isSelected
                        ? 'bg-amber-500 text-slate-950 font-black'
                        : 'bg-slate-50 dark:bg-slate-800/60 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <span className={`w-6 h-6 rounded-lg text-xs font-black flex items-center justify-center ${
                        isSelected ? 'bg-slate-950 text-white' : 'bg-slate-200 dark:bg-slate-700'
                      }`}>
                        {p.number}
                      </span>
                      <div>
                        <span className="text-xs font-bold block">{p.name}</span>
                        <span className="text-[10px] opacity-75">{p.positionDetail || p.position}</span>
                      </div>
                    </div>
                    {isSelected && <Check className="w-4 h-4 text-slate-950" />}
                  </button>
                );
              })}
            </div>

            <div className="pt-2 text-right">
              <button
                type="button"
                onClick={() => setSelectedStarterForSwap(null)}
                className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-bold text-slate-600 dark:text-slate-300"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CREATE / EDIT FORMATION MODAL */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto animate-in fade-in">
          <div className="w-full max-w-lg rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 sm:p-7 shadow-2xl my-auto space-y-5">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center font-bold">
                  <Compass className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900 dark:text-white">
                    {editingFormation ? 'Modifier le schéma tactique' : 'Créer un nouveau schéma tactique'}
                  </h3>
                  <p className="text-[11px] text-slate-400">Configuration officielle de Coach Gagne</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsEditModalOpen(false)}
                className="p-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveFormation} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Nom du schéma tactique *
                </label>
                <input
                  type="text"
                  required
                  value={formName}
                  onChange={e => setFormName(e.target.value)}
                  placeholder="ex: 4-3-3 Offensif Élite, 4-2-3-1 Équilibré..."
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs outline-none focus:border-amber-500 font-bold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Système de jeu
                  </label>
                  <select
                    value={formSystem}
                    onChange={e => setFormSystem(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold outline-none"
                  >
                    <option value="4-3-3">4-3-3</option>
                    <option value="4-2-3-1">4-2-3-1</option>
                    <option value="3-5-2">3-5-2</option>
                    <option value="4-4-2">4-4-2</option>
                    <option value="3-4-3">3-4-3</option>
                    <option value="5-3-2">5-3-2</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Style d'animation
                  </label>
                  <select
                    value={formStyle}
                    onChange={e => setFormStyle(e.target.value as TacticalFormation['style'])}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold outline-none"
                  >
                    <option value="offensif">Offensif</option>
                    <option value="possession">Possession</option>
                    <option value="contre-attaque">Contre-attaque</option>
                    <option value="equilibre">Équilibré</option>
                    <option value="defensif">Défensif</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Description du plan de jeu
                </label>
                <textarea
                  rows={2}
                  value={formDescription}
                  onChange={e => setFormDescription(e.target.value)}
                  placeholder="Objectifs stratégiques du schéma..."
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Consignes de vestiaire (Coach Gagne)
                </label>
                <textarea
                  rows={2}
                  value={formCoachNotes}
                  onChange={e => setFormCoachNotes(e.target.value)}
                  placeholder="Instructions spécifiques données aux joueurs..."
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Principes clés de jeu (séparés par virgules)
                </label>
                <input
                  type="text"
                  value={formPrinciplesStr}
                  onChange={e => setFormPrinciplesStr(e.target.value)}
                  placeholder="Pressing haut, Jeu rapide en un-deux, Transitions fulgurantes..."
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-200"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-black shadow-lg shadow-red-600/30 flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Enregistrer le schéma</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="w-full max-w-sm rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 shadow-2xl text-center space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-red-600/10 text-red-500 flex items-center justify-center mx-auto font-bold">
              <Trash2 className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-black text-slate-900 dark:text-white">Supprimer ce schéma tactique ?</h3>
              <p className="text-xs text-slate-500 mt-1">
                Cette formation sera définitivement retirée des tactiques de l'équipe.
              </p>
            </div>
            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setDeleteConfirmId(null)}
                className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-bold text-slate-600 dark:text-slate-300"
              >
                Annuler
              </button>
              <button
                type="button"
                onClick={() => {
                  deleteTacticalFormation(deleteConfirmId);
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
    </div>
  );
};
