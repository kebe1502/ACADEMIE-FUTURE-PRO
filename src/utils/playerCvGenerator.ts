import { Player, PlayerCV, ClubInfo } from '../types';

/**
 * Générateur automatique de CV sportif officiel pour chaque joueur.
 * L'application crée automatiquement un CV complet, riche et structuré pour chaque joueur.
 * Seul l'administrateur peut ensuite créer un CV sur-mesure ou modifier le CV existant.
 */
export const generateDefaultPlayerCV = (player: Player, clubInfo?: ClubInfo): PlayerCV => {
  const currentYear = new Date().getFullYear();
  const birthYear = player.birthDate ? parseInt(player.birthDate.split('-')[0], 10) : currentYear - (player.age || 18);
  const clubName = clubInfo?.name || "ASC Dialloré";
  const city = clubInfo?.city || "Mbacké - Touba";

  // Derive secondary positions based on primary position
  let secondaryPositions: string[] = [];
  let defaultStrengths: string[] = [];
  let defaultWorkAreas: string[] = [];
  let speedKmH = "31.8 km/h";
  let verticalJump = "65 cm";
  let staminaVma = "19.0 km/h";
  let technicalSummary = "";
  let tacticalMaturity = "Bonne compréhension des consignes collectives et rigueur dans le repli.";

  const pos = (player.position || '').toUpperCase();

  if (pos.includes('GK') || pos.includes('GARDIEN')) {
    secondaryPositions = ['Dernier Rempart', 'Relanceur Court'];
    defaultStrengths = [
      'Réflexes sur la ligne et détente explosive',
      'Communication et autorité dans la surface',
      'Jeu au pied précis et relances rapides',
      'Capacité à stopper les tirs à bout portant',
    ];
    defaultWorkAreas = ['Sorties aériennes sur coups de pied arrêtés excentrés'];
    speedKmH = '28.5 km/h';
    verticalJump = '74 cm';
    staminaVma = '17.5 km/h';
    technicalSummary = `Gardien d'envergure, rassurant pour sa charnière centrale et très réactif sur les frappes à mi-distance.`;
    tacticalMaturity = 'Capacité à commander sa défense et à lire les trajectoires profondes.';
  } else if (pos.includes('DEF') || pos.includes('DÉF')) {
    secondaryPositions = ['Défenseur Central', 'Latéral Polyvalent', 'Milieu Défensif'];
    defaultStrengths = [
      'Puissance athlétique et domination dans les duels',
      'Interceptions propres et anticipation des passes adverses',
      'Jeu de tête défensif et offensif sur CPA',
      'Qualité de relance courte et diagonale',
    ];
    defaultWorkAreas = ['Vitesse de réaction lors des transitions rapides adverses'];
    speedKmH = '32.1 km/h';
    verticalJump = '71 cm';
    staminaVma = '19.2 km/h';
    technicalSummary = `Défenseur rigoureux doté d'un excellent sens du timing dans les interventions et d'une présence physique imposante.`;
    tacticalMaturity = 'Excellent alignement de la ligne de hors-jeu et discipline tactique irréprochable.';
  } else if (pos.includes('MID') || pos.includes('MIL')) {
    secondaryPositions = ['Milieu Relayeur (Box-to-box)', 'Meneur de Jeu', 'Milieu Récupérateur'];
    defaultStrengths = [
      'Volume de jeu exceptionnel et endurance tout au long des 90 minutes',
      'Vision panoramique et précision des passes courtes et longues',
      'Pressing haut et récupération active du ballon',
      'Protection de balle sous pression et orientation du jeu',
    ];
    defaultWorkAreas = ['Finition et apport statistique devant le but'];
    speedKmH = '32.8 km/h';
    verticalJump = '66 cm';
    staminaVma = '20.2 km/h';
    technicalSummary = `Véritable plaque tournante de l'entrejeu, alliant finesse technique et impact physique dans l'orientation offensive.`;
    tacticalMaturity = 'Maîtrise du tempo du match, sait temporiser ou accélérer le jeu quand la situation le commande.';
  } else {
    // Attackers / Wingers
    secondaryPositions = ['Ailier Percutant', 'Avant-Centre', 'Second Attaquant'];
    defaultStrengths = [
      'Accélération foudroyante et vitesse de pointe en rupture',
      'Qualité de dribble en un-contre-un et élimination',
      'Instinct de buteur et finition devant le filet',
      'Appels tranchants dans le dos de la défense adverse',
    ];
    defaultWorkAreas = ['Replacement défensif à la perte du ballon'];
    speedKmH = '33.9 km/h';
    verticalJump = '69 cm';
    staminaVma = '19.4 km/h';
    technicalSummary = `Attaquant véloce et incisif, capable de débloquer une rencontre sur un exploit individuel ou une course en profondeur.`;
    tacticalMaturity = 'Sens aigu du positionnement entre les lignes et sens du démarquage.';
  }

  // Derive career history from player previous clubs or auto-generate academy progression
  const careerHistory = (player.previousClubs && player.previousClubs.length > 0)
    ? [
        {
          period: '2024 - 2026',
          clubOrSchool: clubName,
          category: 'Senior Élite / Championnat ONGAM',
          roleAndAchievements: `Capitaine et titulaire indiscutable • ${player.appearances || 28} apparitions, ${player.goals || 28} buts`,
        },
        ...player.previousClubs.map((club, idx) => ({
          period: idx === 0 ? '2022 - 2024' : '2020 - 2022',
          clubOrSchool: club,
          category: idx === 0 ? 'Cadets / Compétition Régionale' : 'Minimes / Formation Base',
          roleAndAchievements: idx === 0 ? 'Titulaire et révélation du championnat' : 'Apprentissage et perfectionnement des fondamentaux',
        })),
      ]
    : [
        {
          period: '2024 - 2026',
          clubOrSchool: `${clubName} (Équipe Cadets A)`,
          category: `Cadets / Compétition Officielle ONGAM`,
          roleAndAchievements: `Titulaire régulier • Porteur du Maillot #${player.number}`,
        },
        {
          period: '2022 - 2024',
          clubOrSchool: `Académie Formation ${clubName}`,
          category: `U15 / Cadets Régionaux`,
          roleAndAchievements: `Capitaine et révélation du tournoi inter-quartiers de Mbacké.`,
        },
        {
          period: '2020 - 2022',
          clubOrSchool: `École de Football de Touba-Mbacké`,
          category: `U13 / Minimes`,
          roleAndAchievements: `Apprentissage des gammes techniques et initiation tactique.`,
        },
      ];

  // Distinctions
  const keyDistinctions = (player.honors && player.honors.length > 0)
    ? [...player.honors]
    : [
        `Vainqueur de la Coupe de la Zone ONGAM Mbacké (2025)`,
        `Sélectionné dans l'équipe type du tournoi de détection départemental`,
        `Homme du Match lors des phases éliminatoires territoriales`,
      ];

  const overall = player.attributes
    ? Math.round(
        (player.attributes.pace +
          player.attributes.shooting +
          player.attributes.passing +
          player.attributes.dribbling +
          player.attributes.defending +
          player.attributes.physical) /
          6
      )
    : 84;

  return {
    playerId: player.id,
    generatedAt: new Date().toISOString(),
    isCustomized: false,
    title: `CV Sportif Officiel • ${player.name} (#${player.number})`,
    summary:
      player.bio ||
      `${player.name} est un ${player.positionDetail || player.position} talentueux et prometteur de l'${clubName}. Réputé pour sa rigueur, son professionnalisme et son engagement sur le terrain de Teriann École Ndiagalak.`,
    dominantFoot: player.preferredFoot || 'Droit',
    secondaryPositions,
    careerHistory,
    strengths: defaultStrengths,
    areasOfImprovement: defaultWorkAreas,
    physicalMetrics: {
      speedKmH: speedKmH,
      verticalJumpCm: verticalJump,
      staminaVma: staminaVma,
      bodyFatPercent: '9.4 %',
    },
    coachEvaluation: {
      evaluator: `Coach Gagne (Entraîneur Principal ${clubName})`,
      ratingOutOf100: Math.min(96, Math.max(75, overall + 3)),
      technicalComments: technicalSummary,
      tacticalMaturity: tacticalMaturity,
      attitudeAndDiscipline: 'Exemplaire. Assidu aux entraînements matin et soir, respectueux de ses coéquipiers et du corps arbitral.',
    },
    educationAndLanguages: {
      schoolLevel: `Enseignement Général (Mbacké) • Éducation sportive continue`,
      languages: ['Wolof (Maternel)', 'Français (Courant)', 'Anglais (Notions sportives)'],
    },
    keyDistinctions,
    contactReferent: {
      clubName: `${clubName} (${city})`,
      officialEmail: 'direction@ascdiallore.sn',
      officialPhone: '+221 77 500 12 34 / +221 77 249 76 64',
      licenceNumber: `ONGAM-MBK-${player.number.toString().padStart(3, '0')}-${birthYear.toString().slice(-2)}`,
    },
  };
};
