import React, { forwardRef } from 'react';
import { Player, PlayerCV, ClubInfo } from '../types';
import { getPlayerFullName } from '../utils/playerHelpers';
import { DialloreLogoSvg } from './DialloreLogoSvg';

interface OfficialPlayerCvCardProps {
  player: Player;
  cv: PlayerCV;
  clubInfo: ClubInfo;
}

/**
 * Composant de CV Sportif Officiel inspiré du design exact fourni par l'utilisateur
 * (Référence : a298d75b69d5a848159d0643060a981f.jpg) :
 * - Fond sombre texturé avec lignes ondulées en haut
 * - Grand nom doré en typographie élégante
 * - Logo officiel de l'ASC Dialloré (vectoriel inline garanti sans erreur CORS)
 * - Ruban doré "FOOTBALLEUR"
 * - Cadre ovale organique à bordure vert-lime / or pour la photo officielle du joueur
 * - Colonne gauche : ⚽ À propos, encadré contact à bande dorée, ⚽ Compétences
 * - Colonne droite : ⚽ Formations, ⚽ Expérience Professionnelle (timeline avec puces dorées)
 * - Section inférieure : Pelouse de stade verte photoréaliste avec ballon de football au centre,
 *   encadré Compétences Techniques à gauche et encadré Langues Étrangères à droite.
 */
export const OfficialPlayerCvCard = forwardRef<HTMLDivElement, OfficialPlayerCvCardProps>(
  ({ player, cv, clubInfo }, ref) => {
    const playerFullName = getPlayerFullName(player);

    // Extraction prénom / nom
    const firstName = player.firstName || player.name.split(' ')[0] || 'Joueur';
    const lastName = player.lastName || player.name.split(' ').slice(1).join(' ') || '';

    // Compétences par défaut ou personnalisées
    const skillsList = cv.strengths && cv.strengths.length > 0
      ? cv.strengths
      : [
          'Rigueur & Discipline tactique',
          'Dynamisme & Explosivité',
          'Engagement physique total',
          'Sens des responsabilités & Leadership',
          'Adaptabilité aux consignes du coach',
          'Connaissances approfondies du jeu',
          'Finition & Précision face au but',
          'Endurance & Récupération rapide',
        ];

    // Formations (années complètes)
    const formations = [
      {
        title: 'ACADÉMIE ASC DIALLORÉ',
        period: '2022 - 2024',
        desc: 'Formation élite avancée, perfectionnement tactique, préparation athlétique de haute intensité et maîtrise des transitions offensives.',
      },
      {
        title: 'CENTRE DE FORMATION JEUNES MBACKÉ',
        period: '2020 - 2022',
        desc: 'Apprentissage des fondamentaux du football moderne, motricité, coordination, esprit d’équipe et respect des valeurs sportives.',
      },
    ];

    const defaultPeriods = ['2024 - 2026', '2022 - 2024', '2020 - 2022'];

    // Expériences professionnelles / compétitions en club (avec années complètes normalisées)
    const rawExperiences = cv.careerHistory && cv.careerHistory.length > 0
      ? cv.careerHistory
      : [
          {
            period: '2024 - 2026',
            category: 'Senior Élite Navétanes',
            clubOrSchool: clubInfo?.name || 'ASC Dialloré',
            roleAndAchievements: `Joueur titulaire (${player.appearances || 28} matchs, ${player.goals || 28} buts, ${player.assists || 15} passes décisives). Championnat officiel ONGAM Touba-Mbacké.`,
          },
          {
            period: '2022 - 2024',
            category: 'Titulaire Régional',
            clubOrSchool: 'Sélection Zonale de Mbacké',
            roleAndAchievements: 'Participation aux tournois majeurs, demi-finaliste régional et distinction de meilleur espoir offensif de la zone.',
          },
          {
            period: '2020 - 2022',
            category: 'Catégorie Espoirs',
            clubOrSchool: 'Académie Future Pro',
            roleAndAchievements: 'Intégration au groupe premier, travail individualisé sous la supervision directe du staff technique.',
          },
        ];

    const experiences = rawExperiences.map((exp, i) => {
      let p = (exp.period || defaultPeriods[i] || '2024 - 2026').replace(/[–—/]/g, '-').trim();
      p = p.replace(/(^|\s|-)([12]\d)($|\s|-)/g, (m, pre, yr, post) => `${pre}20${yr}${post}`);
      p = p.replace(/\s*-\s*/g, ' - ');
      return {
        ...exp,
        period: p,
      };
    });

    return (
      <div
        ref={ref}
        id="official-player-cv-template"
        className="w-full max-w-[820px] mx-auto bg-[#141518] text-white shadow-2xl overflow-hidden font-sans relative flex flex-col justify-between"
      >
        {/* ============================================================== */}
        {/* SECTION SUPÉRIEURE : EN-TÊTE SOMBRE AVEC ONDULATIONS & PHOTO  */}
        {/* ============================================================== */}
        <div className="relative pt-8 px-8 sm:px-10 pb-6 overflow-hidden">
          {/* Lignes ondulées décoratives abstraites en filigrane (haut gauche) */}
          <svg
            className="absolute top-0 left-0 w-80 h-44 opacity-25 pointer-events-none"
            viewBox="0 0 400 200"
            fill="none"
          >
            <path d="M-50,20 C100,80 200,10 350,120" stroke="#94A3B8" strokeWidth="1.2" />
            <path d="M-50,40 C110,100 210,30 360,140" stroke="#94A3B8" strokeWidth="1.2" />
            <path d="M-50,60 C120,120 220,50 370,160" stroke="#94A3B8" strokeWidth="1.2" />
            <path d="M-50,80 C130,140 230,70 380,180" stroke="#94A3B8" strokeWidth="1.2" />
            <path d="M-50,100 C140,160 240,90 390,200" stroke="#94A3B8" strokeWidth="1.2" />
          </svg>

          {/* Grille Flex supérieure : Nom & Logo à gauche / Photo ovale à droite */}
          <div className="flex flex-col sm:flex-row items-center sm:items-start justify-between gap-6 relative z-10">
            {/* Colonne Nom & Ruban FOOTBALLEUR */}
            <div className="flex-1 text-center sm:text-left pt-2">
              {/* Logo du Club & Nom officiel (Vectoriel Inline garanti) */}
              <div className="flex items-center justify-center sm:justify-start gap-2.5 mb-3">
                <DialloreLogoSvg className="w-10 h-10 object-contain drop-shadow" />
                <span className="text-[11px] font-black uppercase tracking-widest text-[#EAB308]">
                  {clubInfo?.name || 'ASC DIALLORÉ'} • TOUBA MBACKÉ
                </span>
              </div>

              {/* Nom en grand, style GAETAN Ferland */}
              <h1 className="text-3xl sm:text-4xl lg:text-[40px] font-black tracking-wide text-[#F5C242] uppercase font-serif leading-tight">
                {firstName} <span className="font-normal capitalize text-white sm:text-[#F5C242]">{lastName}</span>
              </h1>

              {/* Ruban jaune/doré FOOTBALLEUR qui s'adapte à la largeur du texte (width: fit-content, white-space: nowrap) */}
              <div
                className="mt-3.5 inline-flex items-center w-fit max-w-full whitespace-nowrap bg-[#F5C242] text-black font-black text-xs sm:text-sm tracking-[0.25em] uppercase py-2 px-5 shadow-md border-r-4 border-amber-600 rounded-xs"
                style={{ width: 'fit-content', whiteSpace: 'nowrap' }}
              >
                <span>F O O T B A L L E U R</span>
                {player.positionDetail && (
                  <span className="font-bold text-[10px] sm:text-xs tracking-normal ml-2.5 text-slate-950 border-l border-black/40 pl-2.5 whitespace-nowrap">
                    {player.positionDetail}
                  </span>
                )}
              </div>
            </div>

            {/* Photo officielle dans son cadre ovale organique (Vert-lime / Or) */}
            <div className="relative flex-shrink-0">
              {/* Croissant / Accent lime-or à l'arrière */}
              <div
                className="absolute -top-1 -right-1 w-36 h-44 sm:w-44 sm:h-52 bg-[#84CC16] opacity-70"
                style={{
                  borderRadius: '50% 50% 46% 54% / 58% 56% 44% 42%',
                }}
              />

              {/* Cadre ovale contenant la photo */}
              <div
                className="relative w-36 h-44 sm:w-44 sm:h-52 overflow-hidden border-4 border-[#84CC16] bg-slate-900 shadow-2xl z-10"
                style={{
                  borderRadius: '50% 50% 46% 54% / 58% 56% 44% 42%',
                }}
              >
                <img
                  src={player.photoUrl || '/original-team-photo.jpg'}
                  alt={playerFullName}
                  crossOrigin="anonymous"
                  className="w-full h-full object-cover object-top"
                  onError={(e) => {
                    // Fallback propre en cas d'erreur de chargement
                    (e.target as HTMLImageElement).src = '/original-team-photo.jpg';
                  }}
                />
              </div>

              {/* Numéro officiel de maillot en badge discret */}
              <div className="absolute -bottom-2 -left-2 z-20 px-2.5 py-1 rounded-lg bg-[#EAB308] text-slate-950 font-black text-xs shadow-md">
                #{player.number}
              </div>
            </div>
          </div>
        </div>

        {/* ============================================================== */}
        {/* SECTION CENTRALE : 2 COLONNES (À PROPOS / FORMATIONS / EXP)   */}
        {/* ============================================================== */}
        <div className="px-8 sm:px-10 py-4 grid grid-cols-1 md:grid-cols-12 gap-8 relative z-10">
          {/* ----------------- COLONNE GAUCHE (5 / 12) ----------------- */}
          <div className="md:col-span-5 space-y-6">
            {/* 1. À propos */}
            <div>
              <div className="flex items-center gap-2 text-white font-bold text-sm tracking-wider uppercase mb-2">
                <span className="text-base">⚽</span>
                <span className="font-serif">À propos</span>
              </div>
              <p className="text-[11.5px] leading-relaxed text-slate-300 text-justify">
                {cv.summary || player.bio ||
                  `Joueur talentueux, discipliné et engagé au sein de l'${clubInfo?.name || "ASC Dialloré"}. Doté d'une excellente vision de jeu et d'une rigueur tactique exemplaire, il se distingue par sa vitesse d'exécution, son efficacité dans les duels et sa contribution décisive aux objectifs de l'équipe.`}
              </p>
            </div>

            {/* 2. Bloc Coordonnées de Contact (Avec barre dorée à gauche) */}
            <div className="relative pl-5 py-2.5 border-l-4 border-[#F5C242] space-y-2.5 text-[11px] text-slate-200">
              <div className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full bg-white text-slate-900 flex items-center justify-center font-bold text-xs flex-shrink-0">
                  📞
                </div>
                <span className="font-semibold tracking-wide">
                  {cv.contactReferent?.officialPhone || '+221 77 123 45 67'}
                </span>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full bg-white text-slate-900 flex items-center justify-center font-bold text-xs flex-shrink-0">
                  @
                </div>
                <span className="font-semibold tracking-wide truncate">
                  {cv.contactReferent?.officialEmail || 'contact@ascdiallore.sn'}
                </span>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full bg-white text-slate-900 flex items-center justify-center font-bold text-xs flex-shrink-0">
                  📍
                </div>
                <span className="font-semibold tracking-wide">
                  Touba Mbacké, Sénégal
                </span>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full bg-amber-400 text-slate-950 flex items-center justify-center font-bold text-xs flex-shrink-0">
                  ⚽
                </div>
                <span className="font-semibold tracking-wide">
                  Licence ONGAM #{cv.contactReferent?.licenceNumber || 'DK-MBK-2025'}
                </span>
              </div>
            </div>

            {/* 3. Compétences */}
            <div>
              <div className="flex items-center gap-2 text-white font-bold text-sm tracking-wider uppercase mb-2.5">
                <span className="text-base">⚽</span>
                <span className="font-serif">COMPÉTENCES</span>
              </div>
              <ul className="space-y-1.5 text-[11px] text-slate-300">
                {skillsList.map((skill, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="text-[#F5C242] font-black">-</span>
                    <span>{skill}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* ----------------- COLONNE DROITE (7 / 12) ----------------- */}
          <div className="md:col-span-7 space-y-6">
            {/* 1. Formations */}
            <div>
              <div className="flex items-center gap-2 text-white font-bold text-sm tracking-wider uppercase mb-3">
                <span className="text-base">⚽</span>
                <span className="font-serif">FORMATIONS</span>
              </div>

              <div className="space-y-3.5">
                {formations.map((f, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="mt-1 w-3.5 h-3.5 rounded-full border-2 border-[#F5C242] bg-[#F5C242]/20 flex items-center justify-center flex-shrink-0">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#F5C242]" />
                    </div>
                    <div>
                      <h4 className="text-xs font-black text-white tracking-wide uppercase">
                        {f.title} <span className="text-[#F5C242] font-mono font-bold">({f.period})</span>
                      </h4>
                      <p className="text-[11px] text-slate-300 leading-relaxed mt-0.5">
                        {f.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 2. Expérience Professionnelle */}
            <div>
              <div className="flex items-center gap-2 text-white font-bold text-sm tracking-wider uppercase mb-3">
                <span className="text-base">⚽</span>
                <span className="font-serif">EXPÉRIENCE PROFESSIONNELLE</span>
              </div>

              {/* Ligne verticale de timeline continue */}
              <div className="relative pl-5 border-l border-[#F5C242]/60 space-y-4 ml-1.5">
                {experiences.map((exp, i) => (
                  <div key={i} className="relative">
                    {/* Puce dorée sur la ligne */}
                    <div className="absolute -left-[27px] top-1 w-3.5 h-3.5 rounded-full border-2 border-[#F5C242] bg-slate-900 flex items-center justify-center">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#F5C242]" />
                    </div>
                    <div>
                      <h4 className="text-xs font-black text-[#F5C242] tracking-wide">
                        {exp.period} : Footballeur ({exp.category})
                      </h4>
                      <p className="text-[11px] text-slate-300 leading-relaxed mt-0.5">
                        {exp.roleAndAchievements ||
                          `Évolution au sein de ${exp.clubOrSchool}. Participation active aux compétitions majeures et respect rigoureux du projet sportif.`}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ============================================================== */}
        {/* SECTION INFÉRIEURE : PELOUSE VERTE, BALLON DE FOOT & ENCADRÉS */}
        {/* ============================================================== */}
        <div className="relative mt-4 pt-6 pb-6 px-8 sm:px-10 overflow-hidden bg-[#153420] border-t-2 border-[#84CC16]">
          {/* Image de fond de pelouse intégrée */}
          <img
            src="/soccer-ball-grass.jpg"
            alt="Pelouse stade"
            crossOrigin="anonymous"
            className="absolute inset-0 w-full h-full object-cover opacity-85"
            onError={(e) => {
              (e.target as HTMLElement).style.display = 'none';
            }}
          />
          <div className="absolute inset-0 bg-black/40" />

          {/* Grille : Boîte Compétences Techniques (gauche) / Ballon au centre / Boîte Langues (droite) */}
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
            {/* Boîte Translucide Gauche : Compétences Techniques */}
            <div className="flex-1 w-full p-4 rounded-xl bg-[#0c0d10]/90 border border-white/20 shadow-xl text-white">
              <h4 className="text-xs font-black text-[#F5C242] uppercase tracking-wider mb-2 font-serif border-b border-white/10 pb-1">
                COMPÉTENCES TECHNIQUES
              </h4>
              <ul className="space-y-1 text-[11px] text-slate-200">
                <li className="flex items-center gap-1.5">
                  <span className="text-[#84CC16]">✔</span>
                  <span>Contrôle orienté & Dribble en vitesse</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <span className="text-[#84CC16]">✔</span>
                  <span>Puissance & Précision de frappe</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <span className="text-[#84CC16]">✔</span>
                  <span>Vitesse max : <strong>{cv.physicalMetrics?.speedKmH || '33.8 km/h'}</strong></span>
                </li>
                <li className="flex items-center gap-1.5">
                  <span className="text-[#84CC16]">✔</span>
                  <span>Endurance VMA : <strong>{cv.physicalMetrics?.staminaVma || '19.5 km/h'}</strong></span>
                </li>
                <li className="flex items-center gap-1.5">
                  <span className="text-[#84CC16]">✔</span>
                  <span>Évaluation Staff Scout : <strong>{cv.coachEvaluation?.ratingOutOf100 || 88} / 100</strong></span>
                </li>
              </ul>
            </div>

            {/* Ballon de Football central 3D */}
            <div className="flex-shrink-0 flex items-center justify-center">
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-slate-900 border-2 border-white/60 p-1 shadow-2xl flex items-center justify-center">
                <span className="text-5xl sm:text-6xl drop-shadow-2xl">⚽</span>
              </div>
            </div>

            {/* Boîte Translucide Droite : Langues & Profil */}
            <div className="flex-1 w-full p-4 rounded-xl bg-[#0c0d10]/90 border border-white/20 shadow-xl text-white">
              <h4 className="text-xs font-black text-[#F5C242] uppercase tracking-wider mb-2 font-serif border-b border-white/10 pb-1">
                LANGUES & PROFIL
              </h4>
              <ul className="space-y-1 text-[11px] text-slate-200">
                <li className="flex items-center gap-2">
                  <span className="text-[#F5C242] text-xs">■</span>
                  <span>Wolof - Langue maternelle</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-[#F5C242] text-xs">■</span>
                  <span>Français - Courant</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-[#F5C242] text-xs">■</span>
                  <span>Anglais - Technique / Sportif</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-[#F5C242] text-xs">■</span>
                  <span>Pied fort : <strong>{cv.dominantFoot || player.preferredFoot || 'Droit'}</strong></span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-[#F5C242] text-xs">■</span>
                  <span>Gabarit : <strong>{player.height} • {player.weight}</strong></span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
  }
);

OfficialPlayerCvCard.displayName = 'OfficialPlayerCvCard';
