import { Player } from '../types';

export const getPlayerFullName = (player: Player): string => {
  if (player.fullName) return player.fullName;
  if (player.name) return player.name;
  return `${player.firstName || ''} ${player.lastName || ''}`.trim();
};

export const getPlayerFlag = (player: Player): string => {
  if (player.flag) return player.flag;
  switch (player.countryCode) {
    case 'FR':
      return '🇫🇷';
    case 'BR':
      return '🇧🇷';
    case 'ES':
      return '🇪🇸';
    case 'IT':
      return '🇮🇹';
    case 'SN':
      return '🇸🇳';
    case 'PT':
      return '🇵🇹';
    case 'DE':
      return '🇩🇪';
    case 'NL':
      return '🇳🇱';
    case 'AR':
      return '🇦🇷';
    case 'MA':
      return '🇲🇦';
    case 'CI':
      return '🇨🇮';
    default:
      return '⚽';
  }
};

export const getPlayerStats = (player: Player) => {
  return {
    matches: player.stats?.matches ?? player.appearances ?? 0,
    goals: player.stats?.goals ?? player.goals ?? 0,
    assists: player.stats?.assists ?? player.assists ?? 0,
    minutesPlayed: player.stats?.minutesPlayed ?? player.minutesPlayed ?? 0,
    passAccuracy: player.stats?.passAccuracy ?? player.passAccuracy ?? 85,
    yellowCards: player.stats?.yellowCards ?? player.yellowCards ?? 0,
    redCards: player.stats?.redCards ?? player.redCards ?? 0,
  };
};

export const getPlayerTrophies = (player: Player): string[] => {
  if (player.trophies && player.trophies.length > 0) return player.trophies;
  if (player.honors && player.honors.length > 0) return player.honors;
  return ['Ligue 1 McDonald\'s (2024, 2025)', 'Coupe de France (2024)'];
};
