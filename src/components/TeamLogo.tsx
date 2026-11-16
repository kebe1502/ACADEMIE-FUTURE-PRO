import React, { useState } from 'react';
import { Shield } from 'lucide-react';

interface TeamLogoProps {
  src?: string;
  teamName: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  isHomeClub?: boolean;
}

export const TeamLogo: React.FC<TeamLogoProps> = ({
  src,
  teamName,
  className = '',
  size = 'md',
  isHomeClub = false,
}) => {
  const [imageError, setImageError] = useState(false);

  // Normalize team names to match official logos reliably
  const normalized = (teamName || '').toLowerCase().trim();

  // Pick the most accurate logo URL based on team name or provided src
  let resolvedSrc = src;

  if (isHomeClub || normalized.includes('diallor') || normalized.includes('future pro') || normalized.includes('ascd')) {
    resolvedSrc = src || '/icon.svg';
  } else if (normalized.includes('escale')) {
    resolvedSrc = '/asc-escale.svg';
  } else if (normalized.includes('manko')) {
    resolvedSrc = '/asc-manko.svg';
  }

  // Size styles
  const sizeClasses = {
    sm: 'w-7 h-7 min-w-[28px]',
    md: 'w-10 h-10 sm:w-12 sm:h-12 min-w-[40px]',
    lg: 'w-14 h-14 sm:w-16 sm:h-16 min-w-[56px]',
    xl: 'w-20 h-20 sm:w-24 sm:h-24 min-w-[80px]',
  }[size];

  // If valid image and not errored
  if (resolvedSrc && (resolvedSrc.startsWith('/') || resolvedSrc.startsWith('http') || resolvedSrc.startsWith('data:')) && !imageError) {
    return (
      <div
        className={`${sizeClasses} rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-center p-1.5 shadow-sm overflow-hidden flex-shrink-0 ${className}`}
      >
        <img
          src={resolvedSrc}
          alt={teamName}
          className="w-full h-full object-contain pointer-events-none"
          onError={() => setImageError(true)}
          loading="lazy"
        />
      </div>
    );
  }

  // Fallback badge if image fails or is absent: professional crest styling with initials
  const initials = teamName
    ? teamName
        .split(' ')
        .filter(w => w.length > 0 && !['de', 'du', 'la', 'le', 'les', 'et'].includes(w.toLowerCase()))
        .slice(0, 2)
        .map(w => w[0].toUpperCase())
        .join('')
    : 'FC';

  const isDiallore = normalized.includes('diallor') || isHomeClub;
  const isEscale = normalized.includes('escale');
  const isManko = normalized.includes('manko');

  const bgColor = isDiallore
    ? 'bg-red-600 text-white border-red-500'
    : isEscale
    ? 'bg-blue-700 text-white border-amber-400'
    : isManko
    ? 'bg-emerald-700 text-amber-300 border-amber-400'
    : 'bg-slate-800 text-amber-400 border-slate-700';

  return (
    <div
      className={`${sizeClasses} rounded-2xl ${bgColor} border-2 flex flex-col items-center justify-center shadow-md flex-shrink-0 font-black tracking-wider ${className}`}
      title={teamName}
    >
      <Shield className="w-3.5 h-3.5 opacity-40 mb-0.5" />
      <span className="text-xs sm:text-sm font-black leading-none">{initials}</span>
    </div>
  );
};
