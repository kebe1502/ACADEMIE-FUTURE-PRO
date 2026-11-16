import { ThemeAccent } from '../types';

export const getAccentStyles = (accent: ThemeAccent) => {
  switch (accent) {
    case 'blue':
      return {
        bg: 'bg-blue-600 hover:bg-blue-700 text-white',
        bgLight: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20',
        text: 'text-blue-600 dark:text-blue-400',
        border: 'border-blue-500',
        ring: 'focus:ring-blue-500',
        gradient: 'from-blue-600 to-indigo-700',
        glow: 'shadow-blue-500/20',
      };
    case 'crimson':
      return {
        bg: 'bg-rose-600 hover:bg-rose-700 text-white',
        bgLight: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20',
        text: 'text-rose-600 dark:text-rose-400',
        border: 'border-rose-500',
        ring: 'focus:ring-rose-500',
        gradient: 'from-rose-600 to-red-800',
        glow: 'shadow-rose-500/20',
      };
    case 'emerald':
      return {
        bg: 'bg-emerald-600 hover:bg-emerald-700 text-white',
        bgLight: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
        text: 'text-emerald-600 dark:text-emerald-400',
        border: 'border-emerald-500',
        ring: 'focus:ring-emerald-500',
        gradient: 'from-emerald-600 to-teal-800',
        glow: 'shadow-emerald-500/20',
      };
    case 'gold':
    default:
      return {
        bg: 'bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold',
        bgLight: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20',
        text: 'text-amber-500 dark:text-amber-400',
        border: 'border-amber-500',
        ring: 'focus:ring-amber-500',
        gradient: 'from-amber-500 to-yellow-600',
        glow: 'shadow-amber-500/20',
      };
  }
};
