import React, { useState, useEffect } from 'react';
import { ArrowUp, ArrowDown } from 'lucide-react';

export const ScrollToTopButton: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      
      // Afficher le bouton dès que l'utilisateur a défilé plus de 250px
      if (scrollTop > 250) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }

      if (scrollHeight > 0) {
        const progress = Math.min(100, Math.max(0, (scrollTop / scrollHeight) * 100));
        setScrollProgress(progress);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  const scrollToBottom = () => {
    window.scrollTo({
      top: document.documentElement.scrollHeight,
      behavior: 'smooth',
    });
  };

  return (
    <div
      className={`fixed right-4 sm:right-6 bottom-20 sm:bottom-8 z-40 flex flex-col items-center gap-2 transition-all duration-300 ease-out ${
        isVisible ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 translate-y-6 pointer-events-none'
      }`}
      aria-label="Navigation de défilement rapide"
    >
      {/* Bouton Scroll to Top avec indicateur circulaire de progression */}
      <button
        onClick={scrollToTop}
        className="group relative flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-tr from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white shadow-xl shadow-emerald-950/40 hover:shadow-emerald-500/30 transition-all duration-200 transform hover:scale-110 active:scale-95 border-2 border-white/20 focus:outline-none focus:ring-4 focus:ring-emerald-400/50 cursor-pointer"
        title="Remonter en haut de page"
        aria-label="Remonter en haut de page"
      >
        {/* SVG Progress Ring */}
        <svg className="absolute inset-0 w-full h-full -rotate-90 pointer-events-none p-0.5">
          <circle
            cx="22"
            cy="22"
            r="19"
            className="stroke-emerald-950/30 fill-none"
            strokeWidth="2.5"
          />
          <circle
            cx="22"
            cy="22"
            r="19"
            className="stroke-amber-400 fill-none transition-all duration-150"
            strokeWidth="2.5"
            strokeDasharray={119.38}
            strokeDashoffset={119.38 - (119.38 * scrollProgress) / 100}
            strokeLinecap="round"
          />
        </svg>

        <ArrowUp className="w-5 h-5 transition-transform duration-200 group-hover:-translate-y-0.5 drop-shadow" />

        {/* Tooltip on hover */}
        <span className="absolute right-full mr-3 px-2.5 py-1 rounded-lg bg-slate-900/90 text-slate-100 text-[11px] font-semibold tracking-wide whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none shadow-md border border-slate-700/50 backdrop-blur-sm">
          Haut de page
        </span>
      </button>

      {/* Option discrète pour descendre tout en bas si l'utilisateur est au milieu */}
      {scrollProgress < 85 && (
        <button
          onClick={scrollToBottom}
          className="group relative flex items-center justify-center w-9 h-9 rounded-full bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-white shadow-md border border-slate-700/60 transition-all duration-200 transform hover:scale-105 active:scale-95 cursor-pointer backdrop-blur-sm"
          title="Descendre en bas de page"
          aria-label="Descendre en bas de page"
        >
          <ArrowDown className="w-4 h-4 transition-transform duration-200 group-hover:translate-y-0.5" />
          
          <span className="absolute right-full mr-3 px-2 py-0.5 rounded-lg bg-slate-900/90 text-slate-200 text-[10px] font-medium whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none shadow-md border border-slate-700/50 backdrop-blur-sm">
            Bas de page
          </span>
        </button>
      )}
    </div>
  );
};
