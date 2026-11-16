import React, { useState } from 'react';
import { Calendar, Clock, MapPin, Ticket, Shield, Heart, Trophy, Sparkles, Share2, Check } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const MatchPosterBanner: React.FC = () => {
  const { setActiveTab, setTicketingMatchId, setSelectedMatchId, clubInfo, matches } = useApp();
  const [copied, setCopied] = useState(false);

  const ongamMatch = matches.find(m => m.id === 'm-ongam-1') || matches[0];
  const opponentName = ongamMatch?.opponent || 'ASC ESCALE DE MBACKÉ';
  const opponentLogo = ongamMatch?.opponentLogo || '/asc-escale.svg';

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `${clubInfo.name} 3 - 0 ${opponentName} (Victoire par Forfait)`,
        text: `1ère Journée Championnat ONGAM/Cadets 2026 : Victoire par forfait (3 - 0) de ${clubInfo.name} face à ${opponentName} qui ne s’est pas présentée au Teriann École Ndiagalak !`,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="relative rounded-3xl overflow-hidden shadow-2xl border-2 border-emerald-500/50 bg-[#0B0F19] text-white">
      {/* Background Stadium Glow & Ambience */}
      <div className="absolute inset-0 bg-gradient-to-b from-emerald-950/40 via-slate-950/80 to-[#070A10] pointer-events-none" />
      <div className="absolute -top-24 -left-24 w-80 h-80 bg-red-600/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -right-24 w-80 h-80 bg-emerald-600/20 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 p-5 sm:p-8 lg:p-10 flex flex-col items-center text-center">
        
        {/* Top Badges / Slogans from Official Poster */}
        <div className="w-full flex items-center justify-between gap-2 flex-wrap mb-4 text-xs">
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 font-bold uppercase tracking-wider text-[11px]">
            <Trophy className="w-3.5 h-3.5 text-amber-400" />
            <span>Victoire par Forfait (3 - 0)</span>
          </div>

          <div className="flex items-center gap-1 px-3 py-1 rounded-full bg-pink-500/20 border border-pink-500/40 text-pink-300 font-semibold italic text-[11px]">
            <span>Le Football unit les cœurs</span>
            <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500" />
          </div>
        </div>

        {/* Main Title Header */}
        <div className="space-y-1 my-2">
          <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black uppercase tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-100 to-amber-200 drop-shadow-md">
            CHAMPIONNAT ONGAM / CADETS 2026
          </h2>
          <div className="inline-flex items-center gap-2 flex-wrap justify-center">
            <span className="px-4 py-1 rounded-lg bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 font-black text-xs sm:text-sm uppercase tracking-widest shadow-lg transform -rotate-1 inline-block">
              ⚡ 1ÈRE JOURNÉE ⚡
            </span>
            <span className="px-3 py-1 rounded-lg bg-emerald-600 text-white font-black text-xs uppercase tracking-wider shadow">
              RÉSULTAT HOMOLOGUÉ : 3 - 0
            </span>
          </div>
        </div>

        {/* Forfeit Notice Alert */}
        <div className="w-full max-w-2xl mt-4 px-4 py-2.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-200 text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 shadow-inner">
          <Sparkles className="w-4 h-4 text-amber-400 flex-shrink-0" />
          <span>{clubInfo.name} gagne par forfait : {opponentName} ne s'est pas présentée au terrain.</span>
        </div>

        {/* The Big Match Face-Off: Teams and Score on the exact same line */}
        <div className="w-full max-w-4xl flex flex-row items-center justify-between sm:justify-around gap-2 sm:gap-6 my-6 py-6 border-y border-slate-800/80">
          
          {/* Left: ASC Dialloré */}
          <div className="flex-1 flex flex-col items-center text-center min-w-0 group">
            <div className="relative w-16 h-16 sm:w-28 sm:h-28 rounded-2xl sm:rounded-3xl bg-white p-2 shadow-2xl border-2 sm:border-4 border-red-500 transition-transform group-hover:scale-105 flex items-center justify-center flex-shrink-0">
              <img
                src={clubInfo.logoUrl || '/icon.svg'}
                alt={clubInfo.name}
                className="w-full h-full object-contain"
              />
              <span className="absolute -bottom-2 px-1.5 sm:px-2 py-0.5 rounded-full bg-red-600 text-white text-[8px] sm:text-[9px] font-black uppercase tracking-wider shadow whitespace-nowrap">
                Vainqueur (3 pts)
              </span>
            </div>
            <h3 className="text-xs sm:text-xl font-black text-white mt-2.5 sm:mt-3 uppercase tracking-tight truncate max-w-full">
              {clubInfo.name}
            </h3>
            <p className="text-[10px] sm:text-xs text-emerald-400 font-bold tracking-wide mt-0.5 whitespace-nowrap">
              3 Buts • Domicile
            </p>
          </div>

          {/* Center: Score Clash (ALWAYS on the same line) */}
          <div className="flex flex-col items-center justify-center px-2 sm:px-6 flex-shrink-0">
            <div className="flex items-center gap-1.5 sm:gap-3 whitespace-nowrap">
              <span className="text-3xl sm:text-5xl font-mono font-black text-emerald-400 tracking-wider drop-shadow-[0_0_15px_rgba(52,211,153,0.6)]">
                3
              </span>
              <span className="text-2xl sm:text-4xl font-light text-slate-500 font-mono">
                -
              </span>
              <span className="text-3xl sm:text-5xl font-mono font-black text-emerald-400 tracking-wider drop-shadow-[0_0_15px_rgba(52,211,153,0.6)]">
                0
              </span>
            </div>
            <span className="mt-1 px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[9px] sm:text-[10px] font-extrabold uppercase tracking-widest whitespace-nowrap">
              FORFAIT
            </span>
          </div>

          {/* Right: Opponent Team */}
          <div className="flex-1 flex flex-col items-center text-center min-w-0 group">
            <div className="relative w-16 h-16 sm:w-28 sm:h-28 rounded-2xl sm:rounded-3xl bg-white p-2 shadow-2xl border-2 sm:border-4 border-slate-700 transition-transform group-hover:scale-105 flex items-center justify-center flex-shrink-0">
              <img
                src={opponentLogo}
                alt={opponentName}
                className="w-full h-full object-contain"
              />
              <span className="absolute -bottom-2 px-1.5 sm:px-2 py-0.5 rounded-full bg-slate-700 text-slate-300 text-[8px] sm:text-[9px] font-black uppercase tracking-wider shadow whitespace-nowrap">
                Forfait (Absent)
              </span>
            </div>
            <h3 className="text-xs sm:text-xl font-black text-slate-300 mt-2.5 sm:mt-3 uppercase tracking-tight truncate max-w-full">
              {opponentName}
            </h3>
            <p className="text-[10px] sm:text-xs text-slate-400 font-bold tracking-wide mt-0.5 whitespace-nowrap">
              0 But • Extérieur
            </p>
          </div>
        </div>

        {/* Date, Location & Time Bar (Matching the official poster) */}
        <div className="w-full max-w-2xl grid grid-cols-1 sm:grid-cols-3 gap-3 my-2 text-xs">
          
          <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-amber-500/20 text-amber-400 flex-shrink-0">
              <Calendar className="w-5 h-5" />
            </div>
            <div className="text-left">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Date du Match</span>
              <span className="text-xs sm:text-sm font-black text-white">VENDREDI 25 SEPTEMBRE 2026</span>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-red-500/20 text-red-400 flex-shrink-0">
              <MapPin className="w-5 h-5" />
            </div>
            <div className="text-left">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Terrain Officiel</span>
              <span className="text-xs sm:text-sm font-black text-white">TERIANN ÉCOLE NDIAGALAK</span>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-emerald-500/20 text-emerald-400 flex-shrink-0">
              <Clock className="w-5 h-5" />
            </div>
            <div className="text-left">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Statut</span>
              <span className="text-xs sm:text-sm font-black text-emerald-400">FORFAIT CONSTATAÉ À 09H00</span>
            </div>
          </div>

        </div>

        {/* Footer Slogan & CTAs */}
        <div className="mt-4 flex flex-col sm:flex-row items-center justify-between w-full max-w-2xl gap-4 pt-3 border-t border-slate-800/80">
          <p className="text-xs sm:text-sm font-serif italic text-amber-300 flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-amber-400" />
            « Du talent à la victoire • Ensemble pour la jeunesse ! »
          </p>

          <div className="flex items-center gap-2.5 flex-wrap">
            <button
              onClick={() => setSelectedMatchId('m-ongam-1')}
              className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs transition shadow-lg flex items-center gap-2 active:scale-95"
            >
              <Trophy className="w-4 h-4" />
              <span>Feuille de Match & Forfait (3 - 0)</span>
            </button>

            <button
              onClick={() => setActiveTab('matches')}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs border border-slate-700 transition"
            >
              Calendrier ONGAM
            </button>

            <button
              onClick={handleShare}
              className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition"
              title="Partager le résultat"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4" />}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
