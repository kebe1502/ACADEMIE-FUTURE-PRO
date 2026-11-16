import React from 'react';
import {
  Share2,
  ShieldCheck,
  Globe,
  MapPin,
  Heart,
  Download,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { PWAInstallButton } from './PWAInstallButton';
import { NavTab } from '../types';

export const Footer: React.FC = () => {
  const { setActiveTab, triggerShare, t, clubInfo } = useApp();

  const handleShareClub = () => {
    triggerShare({
      title: `${clubInfo.name} - Touba Mbacké`,
      text: `Site officiel de l'${clubInfo.name} (Touba-Mbacké, Sénégal) : calendrier des matchs, résultats, effectif et actualités du club.`,
      url: window.location.href,
    });
  };

  return (
    <footer className="relative overflow-hidden bg-slate-950 border-t border-slate-800/80 text-white mt-16 pb-20 lg:pb-10 pt-12">
      {/* Dynamic Background Image */}
      {clubInfo.backgroundUrls?.footerBg && (
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          <img
            src={clubInfo.backgroundUrls.footerBg}
            alt=""
            className="w-full h-full object-cover opacity-15"
          />
          <div className="absolute inset-0 bg-slate-950/90" />
        </div>
      )}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Top Branding & Links */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Brand Col */}
          <div className="space-y-4 md:col-span-2">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-white border-2 border-red-500/50 flex items-center justify-center p-1">
                <img src={clubInfo.logoUrl || '/icon.svg'} alt={clubInfo.name} className="w-full h-full object-contain" />
              </div>
              <div>
                <span className="font-extrabold text-lg tracking-wider uppercase font-serif">
                  {clubInfo.name}
                </span>
                <p className="text-[10px] text-red-400 tracking-widest uppercase font-bold">
                  {clubInfo.city} • Stade {clubInfo.stadium}
                </p>
              </div>
            </div>

            <p className="text-xs text-slate-400 max-w-sm leading-relaxed">
              <strong>ASC Dialloré</strong> • « Du talent à la victoire • Le Football unit les cœurs ❤️ • Ensemble pour la jeunesse ! ». Pépinière d'élite de Mbacké et Touba formant les futurs talents du football sénégalais et international. Capitaine & Meilleur Buteur : Pape Modou Cissé.
            </p>

            <div className="flex items-center gap-2 pt-2">
              <button
                onClick={handleShareClub}
                className="px-3 py-1.5 rounded-lg bg-slate-850 hover:bg-slate-800 text-slate-300 text-xs font-semibold flex items-center gap-1.5 border border-slate-700 transition"
              >
                <Share2 className="w-3.5 h-3.5 text-amber-400" />
                <span>Partager l'application</span>
              </button>

              <PWAInstallButton />
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400">
              Navigation
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <button onClick={() => setActiveTab('matches')} className="hover:text-white transition">
                  {t('nav_matches')}
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('team')} className="hover:text-white transition">
                  {t('nav_team')} (Effectif & Staff)
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('gallery')} className="hover:text-white transition">
                  Galerie Photos
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('member')} className="hover:text-white transition">
                  Membres & Adhérents
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('admin')} className="hover:text-white transition">
                  Administration
                </button>
              </li>
            </ul>
          </div>

          {/* Info & Stadium */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-400">
              Complexe & Siège
            </h4>
            <div className="text-xs text-slate-400 space-y-1.5">
              <p className="font-semibold text-slate-200">Complexe Sportif de Touba-Mbacké</p>
              <p className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                Touba, Département de Mbacké, Région de Diourbel, Sénégal 🇸🇳
              </p>
              <p>Centre de Formation & Terrains d'entraînement</p>
              <p className="pt-2 text-amber-400 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                Statut actuel : Vacances d'intersaison
              </p>
            </div>
          </div>

        </div>

        {/* Partners & Sponsors bar */}
        <div className="pt-6 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex flex-wrap items-center gap-6 font-bold tracking-wider text-slate-400 uppercase text-[11px]">
            <span>Académie Future Pro</span>
            <span>Touba Mbacké</span>
            <span>Fédération Sénégalaise de Football</span>
            <span>Élite Baol</span>
          </div>

          <p className="text-[11px] text-slate-500">
            © 2026 Académie Future Pro (Touba, Sénégal). Tous droits réservés.
          </p>
        </div>

      </div>
    </footer>
  );
};
