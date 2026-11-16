import React from 'react';
import { Home, Calendar, Users, Image as ImageIcon, User, ShieldCheck } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { NavTab } from '../types';
import { getAccentStyles } from '../utils/theme';

export const BottomNav: React.FC = () => {
  const { activeTab, setActiveTab, t, themeAccent, isAdminLoggedIn } = useApp();
  const accent = getAccentStyles(themeAccent);

  // Labels concis et adaptés pour navigation mobile fluide
  const tabs: { id: NavTab; label: string; icon: React.FC<{ className?: string }> }[] = [
    { id: 'home', label: 'Accueil', icon: Home },
    { id: 'matches', label: 'Matchs', icon: Calendar },
    { id: 'team', label: 'Équipe', icon: Users },
    { id: 'gallery', label: 'Galerie', icon: ImageIcon },
    { id: 'member', label: 'Membres', icon: User },
    { id: 'admin', label: 'Admin', icon: ShieldCheck },
  ];

  return (
    <nav className="xl:hidden fixed bottom-0 left-0 right-0 z-40 w-full max-w-full overflow-hidden overflow-x-hidden bg-white/95 dark:bg-slate-950/95 backdrop-blur-lg border-t border-slate-200 dark:border-slate-800 pb-safe shadow-[0_-4px_20px_rgba(0,0,0,0.08)]">
      <div className="flex items-center justify-between h-14 sm:h-15 px-1 max-w-md mx-auto w-full">
        {tabs.map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              id={`bottom-nav-${tab.id}`}
              onClick={() => setActiveTab(tab.id)}
              className={`relative flex flex-col items-center justify-center flex-1 min-w-0 py-1 transition-all ${
                isActive
                  ? `${accent.text} font-bold`
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              <div className="relative flex items-center justify-center">
                <Icon className={`transition-transform duration-200 ${isActive ? 'w-5 h-5 scale-110' : 'w-4 h-4 sm:w-5 sm:h-5'}`} />
                {tab.id === 'admin' && isAdminLoggedIn && (
                  <span className="absolute -top-0.5 -right-1 w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-slate-950 animate-pulse" />
                )}
              </div>

              {/* Label adaptatif */}
              <span className={`text-[9px] sm:text-[10px] mt-0.5 tracking-tight truncate max-w-full px-0.5 text-center transition-all ${
                isActive ? 'font-black opacity-100' : 'opacity-80'
              }`}>
                {tab.label}
              </span>

              {/* Indicateur de page active */}
              {isActive && (
                <span className="absolute bottom-0 w-6 h-0.5 rounded-full bg-current" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
