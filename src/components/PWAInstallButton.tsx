import React, { useState } from 'react';
import { Download, Share, X, Smartphone } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { useApp } from '../context/AppContext';
import { getAccentStyles } from '../utils/theme';

export const PWAInstallButton: React.FC = () => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);
  const { themeAccent, t } = useApp();
  const accent = getAccentStyles(themeAccent);

  // If already installed in standalone mode, hide
  if (isInstalled) {
    return null;
  }

  // Chromium / Android / Desktop flow
  if (isInstallable) {
    return (
      <button
        id="btn-install-pwa"
        onClick={install}
        className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold shadow-md transition-all duration-200 active:scale-95 ${accent.bg}`}
      >
        <Download className="w-3.5 h-3.5" />
        <span>{t('install_app')}</span>
      </button>
    );
  }

  // iOS Safari flow
  if (isIOS) {
    return (
      <>
        <button
          id="btn-install-ios"
          onClick={() => setShowIOSGuide(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition"
        >
          <Smartphone className="w-3.5 h-3.5 text-amber-500" />
          <span>{t('install_app')}</span>
        </button>

        {showIOSGuide && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
            <div className="w-full max-w-sm rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 shadow-2xl animate-in fade-in duration-200">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Smartphone className="w-5 h-5 text-amber-500" />
                  Installer sur iPhone / iPad
                </h3>
                <button
                  onClick={() => setShowIOSGuide(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="mt-4 space-y-3 text-sm text-slate-600 dark:text-slate-300">
                <div className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-amber-500/20 text-amber-500 text-xs font-bold flex items-center justify-center">1</span>
                  <p>Appuyez sur le bouton <strong>Partager</strong> <Share className="inline w-3.5 h-3.5 text-blue-500" /> dans Safari.</p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-amber-500/20 text-amber-500 text-xs font-bold flex items-center justify-center">2</span>
                  <p>Faites défiler puis touchez <strong>Sur l'écran d'accueil</strong>.</p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-amber-500/20 text-amber-500 text-xs font-bold flex items-center justify-center">3</span>
                  <p>Profitez du mode hors ligne et des alertes de score en direct !</p>
                </div>
              </div>
              <button
                onClick={() => setShowIOSGuide(false)}
                className="mt-5 w-full py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-sm font-semibold text-slate-800 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 transition"
              >
                Fermer
              </button>
            </div>
          </div>
        )}
      </>
    );
  }

  // Fallback button on standard desktop browser to simulate / guide install
  return (
    <button
      id="btn-install-fallback"
      onClick={() => install()}
      title="Installer comme application locale"
      className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-slate-300 dark:border-slate-700 text-xs text-slate-600 dark:text-slate-300 hover:border-amber-500/50 hover:text-amber-500 transition"
    >
      <Download className="w-3.5 h-3.5" />
      <span className="text-[11px] font-medium">PWA</span>
    </button>
  );
};
