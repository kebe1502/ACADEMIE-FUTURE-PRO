export type Language = 'fr' | 'en' | 'es' | 'de';

export type ThemeAccent = 'gold' | 'blue' | 'crimson' | 'emerald';

export type NavTab = 'home' | 'matches' | 'team' | 'gallery' | 'member' | 'news' | 'stats' | 'admin';

export interface ClubMember {
  id: string;
  fullName: string;
  email?: string;
  phone?: string;
  membershipNumber: string;
  tier: 'Supporter' | 'Adhérent' | 'Gold VIP' | 'Membre d’Honneur' | 'Socio';
  joinedDate: string;
  city: string;
  avatarUrl: string;
  status: 'Actif' | 'En attente' | 'Suspendu';
  notes?: string;
}

export interface StaffMember {
  id: string;
  name: string;
  title: string;       // e.g. "Président de l'ASC Dialloré" ou "Présidente"
  role: string;        // e.g. "Présidence & Direction", "Entraîneur Principal", "Direction Technique"
  category: 'president' | 'technical' | 'medical' | 'administration';
  photoUrl: string;
  bio?: string;
  phone?: string;
  email?: string;
  order: number;
  diploma?: string;
  nationality?: string;
  flag?: string;
  status?: 'Actif' | 'En mission' | 'Honoraire';
  joinedDate?: string;
}

export interface GalleryPhoto {
  id: string;
  title: string;
  category: 'joueurs' | 'staff' | 'equipe' | 'matchs' | 'evenements';
  imageUrl: string;
  date: string;
  description?: string;
  photographer?: string;
  mediaType?: 'photo' | 'video';
  videoUrl?: string;
  duration?: string;
}

export interface ClubInfo {
  name: string;
  academyName?: string;
  formerName?: string;
  shortName: string;
  initials: string;
  logoUrl?: string;
  slogan: string;
  founded: number;
  history: string;
  city: string;
  department: string;
  region: string;
  country: string;
  stadium: string;
  capacity: string;
  president: string;
  presidentTitle?: string; // "Président" ou "Présidente"
  presidentPhotoUrl?: string;
  presidentWord?: string;
  director: string;
  currentStatus: string;
  isHolidayPeriod: boolean;
  currentTournament: string;
  tournamentStatus: string;
  coach: string;
  coachRole: string;
  coachBio: string;
  coachPhotoUrl?: string;
  captain: string;
  topScorer: string;
  colors: string[];
  bannerBackgroundUrl?: string; // Image d'arrière-plan de la section Institut de Formation & Football (Accueil)
  headerBackgroundUrl?: string; // Image d'arrière-plan alternative ou bannière du stade
  backgroundUrls?: {
    homeHero?: string;        // Bannière d'accueil « Institut de Formation & Football »
    homeNextMatch?: string;   // Arrière-plan du Prochain Grand Rendez-vous
    homeOngamEvent?: string;  // Bannière spéciale Victoire par Forfait ONGAM
    headerBg?: string;        // En-tête de navigation du site (Header)
    matchesBanner?: string;   // Bannière de l'onglet Matchs & Calendrier
    teamBanner?: string;      // Bannière de l'onglet Effectif & Joueurs
    galleryBanner?: string;   // Bannière de la Galerie Photos
    ticketsBanner?: string;   // Bannière de l'onglet Billetterie
    shopBanner?: string;      // Bannière de l'onglet Boutique Officielle
    memberBanner?: string;    // Bannière de l'Espace Membre
    newsBanner?: string;      // Bannière des Actualités
    footerBg?: string;        // Arrière-plan du Footer / Bas de page
    modalMatchBg?: string;    // Fond de la modale Détails du Match & Statistiques
    modalPlayerBg?: string;   // Fond de la modale Fiche Joueur
    appGlobalBg?: string;     // Arrière-plan global de l'application
  };
  trophies: { name: string; count: number; years: string }[];
  nextBigMatchInfo?: {
    match: string;
    competition: string;
    date: string;
    time: string;
    venue: string;
    slogans: string[];
  };
  lastMatchInfo?: {
    opponent: string;
    score: string;
    homeScore: number;
    awayScore: number;
    scorers: string;
  };
}

export type PlayerPosition = 'all' | 'GK' | 'DEF' | 'MID' | 'ATT' | 'Gardien' | 'Défenseur' | 'Milieu' | 'Attaquant' | string;

export interface PlayerAttributes {
  pace: number;
  shooting: number;
  passing: number;
  dribbling: number;
  defending: number;
  physical: number;
}

export interface Player {
  id: string;
  name: string;
  firstName: string;
  lastName: string;
  fullName?: string;
  number: number;
  position: 'GK' | 'DEF' | 'MID' | 'ATT' | string;
  positionDetail: string;
  nationality: string;
  countryCode: string;
  flag?: string;
  age: number;
  birthDate: string;
  height: string;
  weight: string;
  preferredFoot: 'Droit' | 'Gauche' | 'Ambidextre' | 'Right' | 'Left' | 'Both' | string;
  marketValue: string;
  contractUntil: string;
  joinedYear: number;
  photoUrl: string;
  appearances: number;
  minutesPlayed: number;
  goals: number;
  assists: number;
  cleanSheets?: number;
  passAccuracy: number;
  tacklesPerGame: number;
  yellowCards: number;
  redCards: number;
  attributes: PlayerAttributes;
  bio: string;
  previousClubs: string[];
  honors: string[];
  trophies?: string[];
  isCaptain?: boolean;
  isTopScorer?: boolean;
  status?: string;
  stats?: {
    matches: number;
    goals: number;
    assists: number;
    minutesPlayed: number;
    passAccuracy: number;
    yellowCards: number;
    redCards: number;
  };
}

export interface CareerMilestone {
  period: string;             // e.g. "2022 - 2024"
  clubOrSchool: string;       // e.g. "Académie Touba Foot"
  category: string;           // e.g. "Cadets / U17"
  roleAndAchievements?: string; // e.g. "Capitaine • Champion Régional"
}

export interface PlayerCV {
  playerId: string;
  generatedAt: string;
  lastModifiedAt?: string;
  lastModifiedBy?: string;
  isCustomized: boolean; // false if auto-generated, true if modified by admin
  title: string;         // e.g. "Curriculum Vitae Sportif Officiel"
  summary: string;       // Overview / scouting bio
  dominantFoot: string;  // e.g. "Gauche" | "Droit" | "Ambidextre"
  secondaryPositions: string[]; // e.g. ["Ailier Droit", "Milieu Offensif"]
  careerHistory: CareerMilestone[];
  strengths: string[];   // e.g. ["Explosivité", "Vision du jeu", "Finition pied gauche"]
  areasOfImprovement?: string[]; // e.g. ["Jeu de tête", "Puissance physique en duel"]
  physicalMetrics: {
    speedKmH: string;       // e.g. "33.2 km/h"
    verticalJumpCm?: string; // e.g. "68 cm"
    staminaVma?: string;     // e.g. "19.5 km/h"
    bodyFatPercent?: string; // e.g. "9.8 %"
  };
  coachEvaluation: {
    evaluator: string; // e.g. "Coach Gagne (Entraîneur Principal)"
    ratingOutOf100: number; // e.g. 88
    technicalComments: string;
    tacticalMaturity: string;
    attitudeAndDiscipline: string;
  };
  educationAndLanguages: {
    schoolLevel?: string;
    languages: string[];
  };
  keyDistinctions: string[];
  contactReferent: {
    clubName: string;
    officialEmail: string;
    officialPhone: string;
    licenceNumber: string;
  };
}

export interface MatchEvent {
  minute: number;
  type: 'goal' | 'yellow_card' | 'red_card' | 'substitution' | 'var' | 'penalty';
  team: 'home' | 'away';
  player: string;
  assistOrDetail?: string;
}

export interface LineupPlayer {
  id: string;
  name: string;
  number: number;
  position: string;
  x: number; // percentage on pitch (0 - 100)
  y: number; // percentage on pitch (0 - 100)
  rating: number;
  isCaptain?: boolean;
}

export interface MatchStats {
  possessionHome: number;
  possessionAway: number;
  xGHome: number;
  xGAway: number;
  shotsHome: number;
  shotsAway: number;
  shotsOnTargetHome: number;
  shotsOnTargetAway: number;
  passAccuracyHome: number;
  passAccuracyAway: number;
  cornersHome: number;
  cornersAway: number;
  foulsHome: number;
  foulsAway: number;
  offsidesHome: number;
  offsidesAway: number;
  yellowCardsHome: number;
  yellowCardsAway: number;
  redCardsHome: number;
  redCardsAway: number;
  savesHome: number;
  savesAway: number;
}

export interface Match {
  id: string;
  competition: string;
  competitionBadge: string;
  round: string;
  date: string;
  time: string;
  timestamp: number;
  isHome: boolean;
  opponent: string;
  opponentShort: string;
  opponentLogo: string;
  venue: string;
  status: 'upcoming' | 'live' | 'finished';
  liveMinute?: number;
  homeScore?: number;
  awayScore?: number;
  homeTeamName: string;
  awayTeamName: string;
  attendance?: string;
  referee?: string;
  ticketPriceFrom?: number;
  ticketsAvailable?: boolean;
  isForfeit?: boolean;
  forfeitWinner?: 'home' | 'away';
  forfeitReason?: string;
  forfeitNote?: string;
  stats?: MatchStats;
  events?: MatchEvent[];
  lineupHome?: LineupPlayer[];
  lineupAway?: LineupPlayer[];
  formationHome?: string;
  formationAway?: string;
}

export interface StadiumZone {
  id: string;
  name: string;
  category: 'VIP' | 'Cat 1' | 'Cat 2' | 'Cat 3';
  basePrice: number;
  description: string;
  availableSeats: number;
  color: string;
}

export interface Ticket {
  id: string;
  matchId: string;
  matchTitle: string;
  matchDate: string;
  matchTime: string;
  venue: string;
  zoneName: string;
  category: string;
  seat: string;
  row: string;
  price: number;
  holderName: string;
  qrCodeData: string;
  barcode: string;
  purchasedAt: string;
  isOfflineAvailable: boolean;
}

export interface NewsArticle {
  id: string;
  title: string;
  summary: string;
  content: string;
  category: 'Transferts' | 'Matchs' | 'Club' | 'Académie' | 'Interviews';
  publishedAt: string;
  author: string;
  readTime: string;
  imageUrl: string;
  tags: string[];
  isBreaking?: boolean;
}

export interface Product {
  id: string;
  name: string;
  category: 'jerseys' | 'training' | 'accessories' | 'lifestyle' | string;
  price: number;
  originalPrice?: number;
  imageUrl: string;
  description: string;
  isCustomizable: boolean;
  sizes: string[];
  isNew?: boolean;
  badge?: string;
  rating: number;
  reviewsCount: number;
}

export interface CartItem {
  id: string;
  product: Product;
  size: string;
  quantity: number;
  customName?: string;
  customNumber?: number;
  patchBadge?: boolean;
}

export interface MemberProfile {
  id: string;
  email: string;
  fullName: string;
  memberTier: 'Supporter' | 'Silver' | 'Gold VIP';
  membershipNumber: string;
  memberSince: string;
  fidelityPoints: number;
  avatarUrl: string;
  phone: string;
  isTwoFactorEnabled: boolean;
  twoFactorSecret?: string;
  twoFactorBackupCodes: string[];
  savedTickets: Ticket[];
  orderHistory: {
    id: string;
    date: string;
    total: number;
    itemsCount: number;
    status: 'Livrée' | 'En préparation' | 'Expédiée';
  }[];
}

export interface NotificationSettings {
  liveScores: boolean;
  halfTimeFullTime: boolean;
  redCards: boolean;
  transfers: boolean;
  ticketSales: boolean;
  clubNews: boolean;
  matchReminders: boolean;
  soundEnabled: boolean;
}

export interface CloudSyncState {
  status: 'synced' | 'syncing' | 'offline' | 'error';
  lastSyncedAt: string;
  pendingChangesCount: number;
}

export interface SocialShareData {
  title: string;
  text: string;
  url: string;
}

// ==============================================================
// GESTION DU CLASSEMENT DU CHAMPIONNAT (STANDINGS)
// ==============================================================
export interface StandingsRow {
  id: string;
  position: number;
  teamName: string;
  logoUrl?: string;
  played: number;        // J (Matchs Joués)
  won: number;           // V (Victoires)
  drawn: number;         // N (Matchs Nuls)
  lost: number;          // D (Défaites)
  goalsFor: number;      // BP (Buts Pour)
  goalsAgainst: number;  // BC (Buts Contre)
  goalDifference: number;// DIFF (Différence)
  points: number;        // PTS (Points)
  competition: string;   // ex: "Championnat ONGAM Cadets 2026 - Poule A"
  isOurClub?: boolean;   // true for ASC Dialloré
  form?: ('V' | 'N' | 'D')[]; // Forme récente (ex: ['V', 'V', 'N'])
  notes?: string;        // ex: "Victoire par forfait (3-0)"
}

// ==============================================================
// GESTION DES SCHÉMAS TACTIQUES & FORMATIONS DE L'ÉQUIPE
// ==============================================================
export interface TacticalStarter {
  id: string;
  positionIndex: number;  // 1 to 11
  role: string;           // 'GK' | 'DC' | 'DD' | 'DG' | 'MD' | 'MC' | 'MO' | 'AD' | 'AG' | 'BU'
  label: string;          // Nom du poste (ex: "Ailier Droit")
  playerId?: string;      // ID du joueur lié (ex: 'p1')
  playerName: string;     // Nom affiché (ex: "Pape Modou Cissé")
  playerNumber: number;   // Maillot (ex: 10)
  x: number;              // Position X sur le terrain en % (0 = gauche, 100 = droite)
  y: number;              // Position Y sur le terrain en % (0 = bas/gardien, 100 = haut/attaque)
}

export interface TacticalFormation {
  id: string;
  name: string;           // ex: "4-3-3 Offensif Élite"
  system: string;         // "4-3-3" | "4-2-3-1" | "3-5-2" | "4-4-2" | string
  style: 'offensif' | 'equilibre' | 'defensif' | 'possession' | 'contre-attaque';
  description: string;    // Description tactique de Coach Gagne
  isDefault?: boolean;    // Formation titulaire active du club
  coachNotes?: string;    // Consignes de vestiaire
  keyPrinciples: string[];// Principes clés de jeu
  starters: TacticalStarter[];
  updatedAt?: string;
}
