import React from 'react';
import { ChevronRight, Volume2, Trophy, Star, Calendar } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { MATCHES_DATA } from '../data/clubData';

export const LiveScoreTicker: React.FC = () => {
  const { setSelectedMatchId, setSelectedPlayerId, setActiveTab, sendTestNotification, matches, clubInfo } = useApp();
  const ongamMatch = matches.find(m => m.id === 'm-ongam-1') || MATCHES_DATA.find(m => m.id === 'm-ongam-1') || matches[0];

  // Contenu officiel enrichi pour le ticker défilant
  const tickerItems = [
    // 1. 🏆 VICTOIRE PAR FORFAIT (3 - 0) • 3 PTS HOMOLOGUÉS
    {
      id: 'forfeit-headline',
      isInteractive: true,
      onClick: () => setSelectedMatchId(ongamMatch?.id),
      render: () => (
        <div
          className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-600 text-white font-black tracking-wide text-xs shadow-sm whitespace-nowrap cursor-pointer hover:bg-emerald-500 transition"
          title="Consulter la feuille de match officielle du forfait (3-0)"
        >
          <Trophy className="w-3.5 h-3.5 text-amber-300 flex-shrink-0" />
          <span>🏆 VICTOIRE PAR FORFAIT (3 - 0)</span>
          <span className="text-emerald-200 text-[10px] font-semibold">• 3 PTS HOMOLOGUÉS</span>
        </div>
      ),
    },

    // 2. 🔥 QUART DE FINALE : ASC Dialloré 3 : 0 ASC ESCALE DE MBACKÉ (avec les blasons officiels des deux équipes et mention Forfait)
    {
      id: 'ongam-result',
      isInteractive: true,
      onClick: () => setSelectedMatchId(ongamMatch?.id),
      render: () => (
        <div
          className="flex items-center gap-2 bg-slate-900/95 hover:bg-slate-800 px-3 py-1 rounded-xl border border-slate-800 hover:border-amber-500/40 transition text-xs whitespace-nowrap cursor-pointer group shadow-sm"
          title="Voir la feuille de match détaillée du Quart de Finale ONGAM"
        >
          <span className="text-amber-400 font-black text-xs flex items-center gap-1">
            🔥 QUART DE FINALE :
          </span>
          <span className="font-extrabold text-white flex items-center gap-1.5">
            {/* Blason officiel ASC Dialloré */}
            <span className="w-4 h-4 rounded-sm bg-white p-0.5 inline-flex items-center justify-center flex-shrink-0 shadow">
              <img src={clubInfo.logoUrl || '/icon.svg'} alt="ASC Dialloré" className="w-full h-full object-contain" />
            </span>
            <span className="text-white group-hover:text-emerald-300 transition">ASC Dialloré</span>
            <span className="px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-400 font-mono font-black text-xs border border-emerald-500/30">
              3 : 0
            </span>
            <span className="text-white group-hover:text-emerald-300 transition">ASC ESCALE DE MBACKÉ</span>
            {/* Blason officiel ASC ESCALE DE MBACKÉ */}
            <span className="w-4 h-4 rounded-sm bg-white p-0.5 inline-flex items-center justify-center flex-shrink-0 shadow">
              <img src="/asc-escale.svg" alt="ASC ESCALE DE MBACKÉ" className="w-full h-full object-contain" />
            </span>
          </span>
          <span className="text-[10px] text-amber-400 font-black bg-amber-500/10 px-1.5 py-0.2 rounded border border-amber-500/20">
            FORFAIT
          </span>
          <ChevronRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-amber-400 group-hover:translate-x-0.5 transition" />
        </div>
      ),
    },

    // 3. ⚡ CHAMPIONNAT ONGAM 2026 : phase de Qualification en demi-finale
    {
      id: 'ongam-qualification',
      isInteractive: true,
      onClick: () => setActiveTab?.('calendar'),
      render: () => (
        <div
          className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-800 text-xs text-slate-300 font-medium whitespace-nowrap cursor-pointer transition"
          title="Voir le calendrier du Championnat ONGAM"
        >
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse flex-shrink-0" />
          <span className="font-extrabold text-amber-400">⚡ CHAMPIONNAT ONGAM 2026 :</span>
          <span className="text-white font-semibold">phase de Qualification en demi-finale</span>
        </div>
      ),
    },

    // 4. ⭐ Capitaine N°10 : Pape Modou Cissé (28 buts)
    {
      id: 'captain-cisse',
      isInteractive: true,
      onClick: () => setSelectedPlayerId?.('p1'),
      render: () => (
        <div
          className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900 hover:bg-slate-850 border border-slate-800 hover:border-amber-500/50 text-xs whitespace-nowrap cursor-pointer transition shadow-sm"
          title="Consulter la fiche détaillée du Capitaine Pape Modou Cissé"
        >
          <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400 flex-shrink-0" />
          <span className="text-slate-400 font-medium">⭐ Capitaine N°10 :</span>
          <span className="text-white font-black">Pape Modou Cissé</span>
          <span className="text-[11px] text-amber-400 font-mono font-bold">(28 buts)</span>
        </div>
      ),
    },

    // 5. ⚽ Amical : ASC Dialloré 3 : 1 ASC Manko
    {
      id: 'friendly-manko',
      isInteractive: true,
      onClick: () => setSelectedMatchId('m-last-manko'),
      render: () => (
        <div
          className="flex items-center gap-2 bg-slate-900/95 hover:bg-slate-850 px-3 py-1 rounded-xl border border-slate-800 hover:border-blue-500/40 transition text-xs whitespace-nowrap cursor-pointer group shadow-sm"
          title="Voir la feuille du match amical : ASC Dialloré 3 : 1 ASC Manko"
        >
          <span className="px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 font-extrabold text-[10px] uppercase border border-blue-500/30">
            ⚽ Amical
          </span>
          <span className="font-extrabold text-white flex items-center gap-1.5">
            <span className="text-white group-hover:text-blue-300 transition">ASC Dialloré</span>
            <span className="px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-400 font-mono font-black text-xs border border-emerald-500/30">
              3 : 1
            </span>
            <span className="text-white group-hover:text-blue-300 transition">ASC Manko</span>
          </span>
          <span className="text-[10px] text-slate-400 font-semibold">(Terminé)</span>
          <ChevronRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-blue-400 group-hover:translate-x-0.5 transition" />
        </div>
      ),
    },

    // 6. 📢 Prochain Match : Mardi prochain
    {
      id: 'next-match-tuesday',
      isInteractive: true,
      onClick: () => setActiveTab?.('calendar'),
      render: () => (
        <div
          className="flex items-center gap-2 bg-slate-900/95 hover:bg-slate-850 px-3 py-1 rounded-xl border border-slate-800 hover:border-amber-500/40 transition text-xs whitespace-nowrap cursor-pointer group shadow-sm"
          title="Consulter le calendrier des rencontres"
        >
          <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-400 font-black text-[10px] uppercase border border-amber-500/30 flex items-center gap-1">
            <Calendar className="w-3 h-3 text-amber-400" />
            <span>📢 Prochain Match</span>
          </span>
          <span className="text-white font-extrabold group-hover:text-amber-300 transition">
            Mardi prochain
          </span>
          <span className="text-[10px] text-emerald-400 font-semibold">• Demi-Finale ONGAM</span>
          <ChevronRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-amber-400 group-hover:translate-x-0.5 transition" />
        </div>
      ),
    },
  ];

  return (
    <div className="w-full max-w-full bg-slate-950 border-b border-slate-800 text-white text-xs select-none relative overflow-x-hidden overflow-y-hidden flex items-center h-9 sm:h-11">
      
      {/* Label Épinglé Gauche : FLASH DIRECT */}
      <div className="z-20 bg-slate-950/95 backdrop-blur px-2.5 sm:px-4 flex items-center gap-1.5 sm:gap-2 h-full border-r border-slate-800 flex-shrink-0 shadow-lg">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500" />
        </span>
        <span className="font-black text-[9px] sm:text-xs tracking-wider uppercase bg-gradient-to-r from-amber-400 via-yellow-300 to-emerald-400 bg-clip-text text-transparent whitespace-nowrap">
          <span className="hidden sm:inline">FLASH DIRECT</span>
          <span className="sm:hidden">FLASH</span>
        </span>
      </div>

      {/* BANDEAU DÉFILANT AUTOMATIQUE - min-w-0 empêche tout débordement de flex child */}
      <div className="relative flex-1 min-w-0 overflow-hidden h-full flex items-center">
        {/* Dégradé d'estompage gauche automatique */}
        <div className="absolute left-0 top-0 bottom-0 w-6 sm:w-10 bg-gradient-to-r from-slate-950 to-transparent z-10 pointer-events-none" />

        <div
          className="ticker-track flex items-center gap-4 sm:gap-6"
          title="Défilement automatique en boucle (survoler pour mettre en pause)"
        >
          {/* Série 1 */}
          {tickerItems.map(item => (
            <div
              key={`tick-1-${item.id}`}
              onClick={item.onClick}
              className="flex-shrink-0"
            >
              {item.render()}
            </div>
          ))}

          {/* Série 2 identique pour une boucle infinie continue et fluide */}
          {tickerItems.map(item => (
            <div
              key={`tick-2-${item.id}`}
              onClick={item.onClick}
              className="flex-shrink-0"
            >
              {item.render()}
            </div>
          ))}
        </div>

        {/* Dégradé d'estompage droite automatique */}
        <div className="absolute right-0 top-0 bottom-0 w-6 sm:w-10 bg-gradient-to-l from-slate-950 to-transparent z-10 pointer-events-none" />
      </div>

      {/* Bouton Audio Test Notification Épinglé Droite */}
      <div className="z-20 bg-slate-950/95 backdrop-blur px-1.5 sm:px-3 flex items-center h-full border-l border-slate-800 flex-shrink-0">
        <button
          type="button"
          onClick={sendTestNotification}
          title="Tester une alerte de but avec signal sonore"
          className="flex items-center gap-1 sm:gap-1.5 px-1.5 sm:px-2 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-amber-400 hover:text-amber-300 transition text-[10px] sm:text-[11px] font-bold border border-slate-800"
        >
          <Volume2 className="w-3.5 h-3.5 flex-shrink-0" />
          <span className="hidden sm:inline">Son but</span>
        </button>
      </div>

    </div>
  );
};
