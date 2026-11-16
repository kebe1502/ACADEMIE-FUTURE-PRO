import React, { useState, useRef } from 'react';
import {
  X,
  FileText,
  Share2,
  Edit,
  RotateCcw,
  CheckCircle2,
  Award,
  Zap,
  Shield,
  Activity,
  User,
  Calendar,
  Phone,
  Mail,
  Lock,
  Plus,
  Trash2,
  Sparkles,
  Compass,
  Star,
  ExternalLink,
  Download,
  Copy,
  Check,
  Send,
  Loader2,
  MessageCircle,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Player, PlayerCV, CareerMilestone } from '../types';
import { generateDefaultPlayerCV } from '../utils/playerCvGenerator';
import { getAccentStyles } from '../utils/theme';
import { getPlayerFullName, getPlayerFlag } from '../utils/playerHelpers';
import {
  exportPlayerCvToPdfDirect,
  generatePlayerCvShareText,
} from '../utils/playerCvPdf';
import { OfficialPlayerCvCard } from './OfficialPlayerCvCard';

interface PlayerCVModalProps {
  player: Player;
  isOpen: boolean;
  onClose: () => void;
}

export const PlayerCVModal: React.FC<PlayerCVModalProps> = ({ player, isOpen, onClose }) => {
  const {
    isAdminLoggedIn,
    clubInfo,
    themeAccent,
    triggerShare,
    showToast,
    playerCvs,
    savePlayerCV,
    resetPlayerCV,
  } = useApp();

  const accent = getAccentStyles(themeAccent);

  // Référence pour capture html2canvas du modèle officiel (a298d75b69d5a848159d0643060a981f.jpg)
  const cvCardRef = useRef<HTMLDivElement>(null);

  // States for PDF Export and Sharing (Print removed as requested)
  const [isExportingPdf, setIsExportingPdf] = useState(false);
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedText, setCopiedText] = useState(false);

  // Retrieve existing or generate automatic CV
  const existingCV = playerCvs?.[player.id] || generateDefaultPlayerCV(player, clubInfo);

  // View vs Edit Mode (only available if admin is logged in)
  const [isEditing, setIsEditing] = useState(false);

  // Form states for Admin Editing
  const [editTitle, setEditTitle] = useState(existingCV.title);
  const [editSummary, setEditSummary] = useState(existingCV.summary);
  const [editDominantFoot, setEditDominantFoot] = useState(existingCV.dominantFoot);
  const [editSecondaryPositions, setEditSecondaryPositions] = useState(existingCV.secondaryPositions.join(', '));
  const [editStrengths, setEditStrengths] = useState(existingCV.strengths);
  const [newStrengthInput, setNewStrengthInput] = useState('');
  const [editWorkAreas, setEditWorkAreas] = useState(existingCV.areasOfImprovement || []);
  const [newWorkAreaInput, setNewWorkAreaInput] = useState('');
  const [editSpeedKmH, setEditSpeedKmH] = useState(existingCV.physicalMetrics.speedKmH);
  const [editVerticalJump, setEditVerticalJump] = useState(existingCV.physicalMetrics.verticalJumpCm || '65 cm');
  const [editVMA, setEditVMA] = useState(existingCV.physicalMetrics.staminaVma || '19.0 km/h');
  const [editBodyFat, setEditBodyFat] = useState(existingCV.physicalMetrics.bodyFatPercent || '9.5 %');
  const [editCoachRating, setEditCoachRating] = useState(existingCV.coachEvaluation.ratingOutOf100);
  const [editTechnicalComments, setEditTechnicalComments] = useState(existingCV.coachEvaluation.technicalComments);
  const [editTacticalMaturity, setEditTacticalMaturity] = useState(existingCV.coachEvaluation.tacticalMaturity);
  const [editAttitude, setEditAttitude] = useState(existingCV.coachEvaluation.attitudeAndDiscipline);
  const [editSchool, setEditSchool] = useState(existingCV.educationAndLanguages.schoolLevel || '');
  const [editLanguages, setEditLanguages] = useState(existingCV.educationAndLanguages.languages.join(', '));
  const [editDistinctions, setEditDistinctions] = useState(existingCV.keyDistinctions);
  const [newDistinctionInput, setNewDistinctionInput] = useState('');
  const [editCareerHistory, setEditCareerHistory] = useState<CareerMilestone[]>(existingCV.careerHistory);

  if (!isOpen) return null;

  const playerFullName = getPlayerFullName(player);
  const playerFlag = getPlayerFlag(player);

  const handleOpenEdit = () => {
    if (!isAdminLoggedIn) {
      showToast('Accès restreint', 'Seul l’administrateur officiel peut modifier le CV d’un joueur.', 'alert');
      return;
    }
    const current = playerCvs?.[player.id] || generateDefaultPlayerCV(player, clubInfo);
    setEditTitle(current.title);
    setEditSummary(current.summary);
    setEditDominantFoot(current.dominantFoot);
    setEditSecondaryPositions(current.secondaryPositions.join(', '));
    setEditStrengths([...current.strengths]);
    setEditWorkAreas([...(current.areasOfImprovement || [])]);
    setEditSpeedKmH(current.physicalMetrics.speedKmH);
    setEditVerticalJump(current.physicalMetrics.verticalJumpCm || '65 cm');
    setEditVMA(current.physicalMetrics.staminaVma || '19.0 km/h');
    setEditBodyFat(current.physicalMetrics.bodyFatPercent || '9.5 %');
    setEditCoachRating(current.coachEvaluation.ratingOutOf100);
    setEditTechnicalComments(current.coachEvaluation.technicalComments);
    setEditTacticalMaturity(current.coachEvaluation.tacticalMaturity);
    setEditAttitude(current.coachEvaluation.attitudeAndDiscipline);
    setEditSchool(current.educationAndLanguages.schoolLevel || '');
    setEditLanguages(current.educationAndLanguages.languages.join(', '));
    setEditDistinctions([...current.keyDistinctions]);
    setEditCareerHistory([...current.careerHistory]);
    setIsEditing(true);
  };

  const handleSaveCV = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAdminLoggedIn) return;

    const updatedCV: PlayerCV = {
      playerId: player.id,
      generatedAt: existingCV.generatedAt || new Date().toISOString(),
      lastModifiedAt: new Date().toISOString(),
      lastModifiedBy: 'Administrateur ASC Dialloré',
      isCustomized: true,
      title: editTitle.trim() || `CV Sportif Officiel • ${player.name}`,
      summary: editSummary.trim(),
      dominantFoot: editDominantFoot.trim(),
      secondaryPositions: editSecondaryPositions
        .split(',')
        .map(s => s.trim())
        .filter(Boolean),
      careerHistory: editCareerHistory,
      strengths: editStrengths.filter(Boolean),
      areasOfImprovement: editWorkAreas.filter(Boolean),
      physicalMetrics: {
        speedKmH: editSpeedKmH.trim(),
        verticalJumpCm: editVerticalJump.trim(),
        staminaVma: editVMA.trim(),
        bodyFatPercent: editBodyFat.trim(),
      },
      coachEvaluation: {
        evaluator: existingCV.coachEvaluation.evaluator || `Coach Gagne (Entraîneur Principal)`,
        ratingOutOf100: Number(editCoachRating) || 85,
        technicalComments: editTechnicalComments.trim(),
        tacticalMaturity: editTacticalMaturity.trim(),
        attitudeAndDiscipline: editAttitude.trim(),
      },
      educationAndLanguages: {
        schoolLevel: editSchool.trim(),
        languages: editLanguages
          .split(',')
          .map(s => s.trim())
          .filter(Boolean),
      },
      keyDistinctions: editDistinctions.filter(Boolean),
      contactReferent: existingCV.contactReferent,
    };

    savePlayerCV(player.id, updatedCV);
    setIsEditing(false);
    showToast('CV Sportif Enregistré', `Le CV officiel de ${player.name} a été mis à jour par l'administrateur.`, 'success');
  };

  const handleResetToAuto = () => {
    if (!isAdminLoggedIn) return;
    resetPlayerCV(player.id);
    setIsEditing(false);
    showToast('CV Réinitialisé', 'Le CV a été régénéré automatiquement avec les données officielles du club.', 'info');
  };

  // 1. Exporter en PDF Officiel Direct (Rendu Canvas A4 instantané sans écran noir)
  const handleExportPDF = async () => {
    try {
      setIsExportingPdf(true);
      showToast('Génération PDF...', `Création du document officiel de ${player.name}...`, 'info');
      await exportPlayerCvToPdfDirect(player, existingCV, clubInfo);
      showToast('CV Téléchargé !', `Le fichier PDF officiel de ${player.name} a été exporté avec succès.`, 'success');
    } catch (error) {
      console.error('Erreur export PDF direct:', error);
      showToast('Erreur Export', 'Une erreur est survenue lors de l’export PDF. Veuillez réessayer.', 'alert');
    } finally {
      setIsExportingPdf(false);
    }
  };

  // 2. Copier le lien direct vers le joueur / CV
  const handleCopyLinkOnly = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url);
    setCopiedLink(true);
    showToast('Lien Copié', 'Le lien direct vers le profil et le CV a été copié.', 'success');
    setTimeout(() => setCopiedLink(false), 2000);
  };

  // 3. Copier le dossier texte complet pour message aux recruteurs
  const handleCopyFullText = () => {
    const text = generatePlayerCvShareText(player, existingCV, clubInfo);
    navigator.clipboard.writeText(text);
    setCopiedText(true);
    showToast('Dossier CV Copié', 'Le résumé complet officiel a été copié dans votre presse-papier.', 'success');
    setTimeout(() => setCopiedText(false), 2000);
  };

  // 4. Partager sur WhatsApp directement avec message pré-rempli
  const handleWhatsAppShare = () => {
    const text = generatePlayerCvShareText(player, existingCV, clubInfo);
    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(text + '\n\n🔗 ' + window.location.href)}`;
    window.open(url, '_blank');
  };

  // 5. Partage système natif
  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `CV Sportif Officiel - ${player.name} (#${player.number}) - ${clubInfo.name}`,
          text: generatePlayerCvShareText(player, existingCV, clubInfo),
          url: window.location.href,
        });
      } catch {
        // Annulé par l'utilisateur
      }
    } else {
      handleWhatsAppShare();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-2 sm:p-4 overflow-y-auto animate-in fade-in">
      <div className="w-full max-w-4xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl overflow-hidden my-auto flex flex-col max-h-[95vh] relative">
        
        {/* Top Header Bar */}
        <div className="p-4 sm:p-5 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-red-600 text-white flex items-center justify-center font-bold shadow-md shadow-red-600/30">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white uppercase font-serif">
                  CV Sportif Officiel
                </h3>
                {existingCV.isCustomized ? (
                  <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 text-[10px] font-bold">
                    ✓ Certifié & Personnalisé par l'Admin
                  </span>
                ) : (
                  <span className="px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 text-[10px] font-bold flex items-center gap-1">
                    <Sparkles className="w-3 h-3" />
                    Créé automatiquement
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Fiche officielle de détection et parcours sportif • {playerFullName} (#{player.number})
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {/* Admin Edit Button */}
            {isAdminLoggedIn ? (
              <button
                type="button"
                onClick={isEditing ? () => setIsEditing(false) : handleOpenEdit}
                className="px-3 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-black flex items-center gap-1.5 shadow transition cursor-pointer"
              >
                <Edit className="w-3.5 h-3.5" />
                <span>{isEditing ? 'Voir le CV' : 'Modifier le CV (Admin)'}</span>
              </button>
            ) : (
              <span className="hidden sm:inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-200/60 dark:bg-slate-800 text-slate-500 dark:text-slate-400 text-[11px] font-semibold">
                <Lock className="w-3 h-3 text-slate-400" />
                Seule l'admin peut modifier
              </span>
            )}

            {/* Télécharger PDF Officiel (Avec Photo du joueur & Logo du club) */}
            <button
              type="button"
              onClick={handleExportPDF}
              disabled={isExportingPdf}
              className="px-3.5 py-2 rounded-xl bg-red-600 hover:bg-red-500 disabled:opacity-50 text-white text-xs font-black flex items-center gap-1.5 shadow-md shadow-red-600/30 transition cursor-pointer"
              title="Télécharger le fichier PDF officiel (Format A4 avec photo et logo)"
            >
              {isExportingPdf ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Download className="w-4 h-4" />
              )}
              <span>
                {isExportingPdf ? 'Génération...' : 'Exporter PDF'}
              </span>
            </button>

            {/* Partager le CV */}
            <button
              type="button"
              onClick={() => setIsShareOpen(true)}
              className="p-2 sm:px-3 sm:py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black flex items-center gap-1.5 shadow-md shadow-emerald-600/20 transition cursor-pointer"
              title="Partager le CV (WhatsApp, Lien, Dossier)"
            >
              <Share2 className="w-4 h-4" />
              <span className="hidden sm:inline">Partager</span>
            </button>

            {/* Fermer */}
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-400 transition cursor-pointer"
              title="Fermer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-8 overflow-y-auto flex-1 space-y-6">
          {/* ============================================================== */}
          {/* MODE ÉDITION ADMIN : SEULE L'ADMIN PEUT CRÉER / MODIFIER UN CV */}
          {/* ============================================================== */}
          {isEditing && isAdminLoggedIn ? (
            <form onSubmit={handleSaveCV} className="space-y-6">
              <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <Edit className="w-5 h-5 text-amber-500 flex-shrink-0" />
                  <div>
                    <h4 className="text-xs font-bold text-amber-500 uppercase tracking-wider">
                      Édition Réservée à l'Administrateur
                    </h4>
                    <p className="text-[11px] text-slate-600 dark:text-slate-300">
                      Vous personnalisez le CV officiel de ce joueur. Toutes les modifications seront visibles sur la fiche publique et téléchargeables.
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleResetToAuto}
                  className="px-3 py-1.5 rounded-xl bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 text-xs font-bold flex items-center gap-1.5 flex-shrink-0 transition"
                  title="Revenir aux valeurs générées automatiquement"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Régénérer automatique</span>
                </button>
              </div>

              {/* Titre & Résumé */}
              <div className="space-y-4 p-5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
                  <User className="w-4 h-4 text-red-500" />
                  <span>Présentation & Profil de Carrière</span>
                </h4>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Titre du document officiel :
                  </label>
                  <input
                    type="text"
                    value={editTitle}
                    onChange={e => setEditTitle(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs outline-none font-bold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Résumé de profil / Scouting report :
                  </label>
                  <textarea
                    rows={3}
                    value={editSummary}
                    onChange={e => setEditSummary(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs outline-none resize-none leading-relaxed"
                    placeholder="Synthèse du profil, qualités athlétiques, style de jeu et mentalité..."
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Pied fort :
                    </label>
                    <input
                      type="text"
                      value={editDominantFoot}
                      onChange={e => setEditDominantFoot(e.target.value)}
                      placeholder="Droit, Gauche, Ambidextre..."
                      className="w-full px-3.5 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Postes secondaires (séparés par des virgules) :
                    </label>
                    <input
                      type="text"
                      value={editSecondaryPositions}
                      onChange={e => setEditSecondaryPositions(e.target.value)}
                      placeholder="Ex: Ailier Gauche, Milieu Offensif..."
                      className="w-full px-3.5 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Points Forts & Axes de Travail */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-3">
                  <h4 className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Points Forts & Qualités Clés</span>
                  </h4>
                  <div className="space-y-1.5">
                    {editStrengths.map((st, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <input
                          type="text"
                          value={st}
                          onChange={e => {
                            const updated = [...editStrengths];
                            updated[idx] = e.target.value;
                            setEditStrengths(updated);
                          }}
                          className="flex-1 px-3 py-1.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs outline-none"
                        />
                        <button
                          type="button"
                          onClick={() => setEditStrengths(editStrengths.filter((_, i) => i !== idx))}
                          className="p-1.5 rounded-lg bg-rose-500/10 text-rose-500 hover:bg-rose-500/20"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                  <div className="flex items-center gap-2 pt-1">
                    <input
                      type="text"
                      value={newStrengthInput}
                      onChange={e => setNewStrengthInput(e.target.value)}
                      placeholder="Ajouter une qualité..."
                      className="flex-1 px-3 py-1.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        if (newStrengthInput.trim()) {
                          setEditStrengths([...editStrengths, newStrengthInput.trim()]);
                          setNewStrengthInput('');
                        }
                      }}
                      className="px-2.5 py-1.5 rounded-lg bg-emerald-600 text-white text-xs font-bold flex items-center gap-1"
                    >
                      <Plus className="w-3 h-3" />
                      <span>Ajouter</span>
                    </button>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-3">
                  <h4 className="text-xs font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Compass className="w-4 h-4" />
                    <span>Axes de Progression</span>
                  </h4>
                  <div className="space-y-1.5">
                    {editWorkAreas.map((wa, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <input
                          type="text"
                          value={wa}
                          onChange={e => {
                            const updated = [...editWorkAreas];
                            updated[idx] = e.target.value;
                            setEditWorkAreas(updated);
                          }}
                          className="flex-1 px-3 py-1.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs outline-none"
                        />
                        <button
                          type="button"
                          onClick={() => setEditWorkAreas(editWorkAreas.filter((_, i) => i !== idx))}
                          className="p-1.5 rounded-lg bg-rose-500/10 text-rose-500 hover:bg-rose-500/20"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                  <div className="flex items-center gap-2 pt-1">
                    <input
                      type="text"
                      value={newWorkAreaInput}
                      onChange={e => setNewWorkAreaInput(e.target.value)}
                      placeholder="Ajouter un axe de travail..."
                      className="flex-1 px-3 py-1.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        if (newWorkAreaInput.trim()) {
                          setEditWorkAreas([...editWorkAreas, newWorkAreaInput.trim()]);
                          setNewWorkAreaInput('');
                        }
                      }}
                      className="px-2.5 py-1.5 rounded-lg bg-amber-600 text-white text-xs font-bold flex items-center gap-1"
                    >
                      <Plus className="w-3 h-3" />
                      <span>Ajouter</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Données Physiques */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-3">
                <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
                  <Zap className="w-4 h-4 text-amber-500" />
                  <span>Métriques Physiques & Tests de Terrain</span>
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 mb-1">Vitesse de pointe</label>
                    <input
                      type="text"
                      value={editSpeedKmH}
                      onChange={e => setEditSpeedKmH(e.target.value)}
                      className="w-full px-3 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs outline-none font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 mb-1">Détente verticale</label>
                    <input
                      type="text"
                      value={editVerticalJump}
                      onChange={e => setEditVerticalJump(e.target.value)}
                      className="w-full px-3 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs outline-none font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 mb-1">VMA (Endurance)</label>
                    <input
                      type="text"
                      value={editVMA}
                      onChange={e => setEditVMA(e.target.value)}
                      className="w-full px-3 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs outline-none font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 mb-1">Masse grasse</label>
                    <input
                      type="text"
                      value={editBodyFat}
                      onChange={e => setEditBodyFat(e.target.value)}
                      className="w-full px-3 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs outline-none font-bold"
                    />
                  </div>
                </div>
              </div>

              {/* Évaluation Coach Gagne */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-red-600 dark:text-red-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Award className="w-4 h-4" />
                    <span>Évaluation Technique & Note du Staff</span>
                  </h4>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-600 dark:text-slate-300">Note Globale :</span>
                    <input
                      type="number"
                      min={60}
                      max={99}
                      value={editCoachRating}
                      onChange={e => setEditCoachRating(Number(e.target.value))}
                      className="w-16 px-2.5 py-1 rounded-lg bg-red-600 text-white font-black text-xs text-center outline-none"
                    />
                    <span className="text-xs font-bold text-red-500">/ 100</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 mb-1">Commentaire technique du Coach :</label>
                    <textarea
                      rows={2}
                      value={editTechnicalComments}
                      onChange={e => setEditTechnicalComments(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs outline-none resize-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 mb-1">Maturité tactique :</label>
                    <input
                      type="text"
                      value={editTacticalMaturity}
                      onChange={e => setEditTacticalMaturity(e.target.value)}
                      className="w-full px-3 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 mb-1">Attitude & Discipline :</label>
                    <input
                      type="text"
                      value={editAttitude}
                      onChange={e => setEditAttitude(e.target.value)}
                      className="w-full px-3 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Formations & Langues */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Niveau scolaire / Études :
                  </label>
                  <input
                    type="text"
                    value={editSchool}
                    onChange={e => setEditSchool(e.target.value)}
                    placeholder="Lycée de Mbacké, etc."
                    className="w-full px-3.5 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Langues parlées (séparées par virgules) :
                  </label>
                  <input
                    type="text"
                    value={editLanguages}
                    onChange={e => setEditLanguages(e.target.value)}
                    placeholder="Wolof, Français, Anglais..."
                    className="w-full px-3.5 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs outline-none"
                  />
                </div>
              </div>

              {/* Save & Cancel Buttons */}
              <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-xs font-bold transition"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-black uppercase tracking-wider shadow-lg shadow-red-600/30 transition flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Enregistrer le CV Officiel</span>
                </button>
              </div>
            </form>
          ) : (
            /* ============================================================== */
            /* MODE VUE : CV SPORTIF OFFICIEL EXACT a298d75b69d5a848159d0643060a981f.jpg */
            /* ============================================================== */
            <div className="space-y-5">
              {/* Barre d'Actions Rapides : Exporter en PDF & Partager (AUCUN BOUTON IMPRIMER) */}
              <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-md">
                <div className="flex items-center gap-2.5 text-center sm:text-left">
                  <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center font-bold">
                    <Award className="w-4 h-4" />
                  </div>
                  <div>
                    <h5 className="text-xs font-black text-white uppercase font-serif tracking-wider">
                      CV Sportif Officiel • {playerFullName}
                    </h5>
                    <p className="text-[11px] text-slate-400">
                      Modèle officiel certifié avec logo club, photo joueur, ruban FOOTBALLEUR et pelouse de stade
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-wrap justify-center sm:justify-end w-full sm:w-auto">
                  <button
                    type="button"
                    onClick={handleExportPDF}
                    disabled={isExportingPdf}
                    className="px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 disabled:opacity-50 text-white text-xs font-black flex items-center gap-2 shadow-lg shadow-red-600/30 transition cursor-pointer"
                  >
                    {isExportingPdf ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Download className="w-4 h-4" />
                    )}
                    <span>{isExportingPdf ? 'Génération du PDF...' : 'Télécharger en PDF (Format A4)'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setIsShareOpen(true)}
                    className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black flex items-center gap-2 shadow-lg shadow-emerald-600/20 transition cursor-pointer"
                  >
                    <Share2 className="w-4 h-4" />
                    <span>Partager le CV</span>
                  </button>
                </div>
              </div>

              {/* Rendu fidèle et capturable du CV Sportif (avec ref pour export PDF) */}
              <div className="rounded-3xl overflow-hidden border border-slate-800 shadow-2xl bg-[#141518]">
                <OfficialPlayerCvCard
                  ref={cvCardRef}
                  player={player}
                  cv={existingCV}
                  clubInfo={clubInfo}
                />
              </div>

              {/* Barre inférieure de fin de page */}
              <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex flex-wrap items-center justify-between gap-3">
                <span className="text-xs text-slate-400">
                  Archivé & certifié conforme par la Direction Sportive • ASC Dialloré Touba-Mbacké
                </span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleExportPDF}
                    disabled={isExportingPdf}
                    className="px-3.5 py-2 rounded-xl bg-red-600 hover:bg-red-500 disabled:opacity-50 text-white text-xs font-black flex items-center gap-1.5 shadow transition cursor-pointer"
                  >
                    {isExportingPdf ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Download className="w-3.5 h-3.5" />}
                    <span>Télécharger PDF</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsShareOpen(true)}
                    className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black flex items-center gap-1.5 shadow transition cursor-pointer"
                  >
                    <Share2 className="w-3.5 h-3.5" />
                    <span>Partager</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ============================================================== */}
      {/* MODALE DÉDIÉE DE PARTAGE DU CV SPORTIF (WHATSAPP, LIEN, DOSSIER) */}
      {/* ============================================================== */}
      {isShareOpen && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="w-full max-w-md rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
                  <Share2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900 dark:text-white">
                    Partager le CV Sportif
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Transmettre la fiche officielle aux recruteurs et clubs
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsShareOpen(false)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Fiche d'Aperçu Joueur */}
            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex items-center gap-3">
              <img
                src={player.photoUrl}
                alt={player.name}
                className="w-12 h-12 rounded-xl object-cover border border-red-500"
              />
              <div className="flex-1 min-w-0">
                <h4 className="text-xs font-black text-slate-900 dark:text-white truncate">
                  {playerFullName} (#{player.number})
                </h4>
                <p className="text-[11px] text-red-600 dark:text-red-400 font-bold truncate">
                  {player.positionDetail || player.position} • {clubInfo.name}
                </p>
                <span className="text-[10px] text-slate-500 font-mono">
                  Licence #{existingCV.contactReferent.licenceNumber}
                </span>
              </div>
            </div>

            {/* Actions Majeures de Partage */}
            <div className="space-y-2.5">
              {/* WhatsApp direct */}
              <button
                type="button"
                onClick={handleWhatsAppShare}
                className="w-full py-3 px-4 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black flex items-center justify-center gap-2 shadow-md shadow-emerald-600/30 transition cursor-pointer"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Envoyer sur WhatsApp avec fiche complète</span>
              </button>

              {/* Copier le dossier texte complet */}
              <button
                type="button"
                onClick={handleCopyFullText}
                className="w-full py-2.5 px-4 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold flex items-center justify-center gap-2 transition cursor-pointer border border-slate-200 dark:border-slate-700"
              >
                {copiedText ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                <span>{copiedText ? 'Dossier CV Copié !' : 'Copier le résumé complet du CV (Texte)'}</span>
              </button>

              {/* Copier le lien direct */}
              <button
                type="button"
                onClick={handleCopyLinkOnly}
                className="w-full py-2.5 px-4 rounded-2xl bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold flex items-center justify-center gap-2 transition cursor-pointer border border-slate-200 dark:border-slate-800"
              >
                {copiedLink ? <Check className="w-4 h-4 text-emerald-500" /> : <ExternalLink className="w-4 h-4" />}
                <span>{copiedLink ? 'Lien Copié !' : 'Copier le lien direct de la page'}</span>
              </button>

              {/* Partage natif / autre */}
              {typeof navigator !== 'undefined' && 'share' in navigator && (
                <button
                  type="button"
                  onClick={handleNativeShare}
                  className="w-full py-2.5 px-4 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-black flex items-center justify-center gap-2 transition cursor-pointer shadow"
                >
                  <Send className="w-4 h-4" />
                  <span>Partager via d'autres applications</span>
                </button>
              )}
            </div>

            {/* Réseaux Sociaux rapides */}
            <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
              <span className="text-[10px] uppercase font-bold text-slate-400 block mb-2 text-center">
                Ou partager sur les réseaux
              </span>
              <div className="grid grid-cols-4 gap-2">
                <a
                  href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(`Découvrez le CV Sportif officiel de ${player.name} (${player.position}) à l'${clubInfo.name} !`)}&url=${encodeURIComponent(window.location.href)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-2 rounded-xl bg-black text-white text-[11px] font-bold text-center hover:opacity-80 transition"
                >
                  𝕏 Twitter
                </a>
                <a
                  href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-2 rounded-xl bg-blue-600 text-white text-[11px] font-bold text-center hover:opacity-80 transition"
                >
                  Facebook
                </a>
                <a
                  href={`https://t.me/share/url?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(`CV Sportif Officiel • ${player.name} - ${clubInfo.name}`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-2 rounded-xl bg-sky-500 text-white text-[11px] font-bold text-center hover:opacity-80 transition"
                >
                  Telegram
                </a>
                <a
                  href={`mailto:?subject=${encodeURIComponent(`CV Sportif Officiel - ${player.name}`)}&body=${encodeURIComponent(generatePlayerCvShareText(player, existingCV, clubInfo))}`}
                  className="py-2 rounded-xl bg-slate-700 text-white text-[11px] font-bold text-center hover:opacity-80 transition"
                >
                  Email
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
