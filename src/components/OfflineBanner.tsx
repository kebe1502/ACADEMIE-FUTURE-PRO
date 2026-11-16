import React from 'react';
import { WifiOff, RefreshCw, CloudCheck, AlertCircle } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const OfflineBanner: React.FC = () => {
  const { isOnline, cloudSync, triggerCloudSync, t } = useApp();

  if (isOnline && cloudSync.status === 'synced') {
    return null;
  }

  if (!isOnline) {
    return (
      <div id="offline-banner" className="bg-amber-600 text-white px-4 py-2 text-xs sm:text-sm font-medium flex items-center justify-between shadow-md sticky top-0 z-40">
        <div className="flex items-center gap-2 max-w-4xl mx-auto w-full justify-between">
          <div className="flex items-center gap-2">
            <WifiOff className="w-4 h-4 animate-pulse flex-shrink-0" />
            <span>{t('offline_mode_active')}</span>
          </div>
          <span className="text-[11px] bg-amber-700/60 px-2 py-0.5 rounded-full border border-amber-400/30">
            Effectif & stats accessibles
          </span>
        </div>
      </div>
    );
  }

  if (cloudSync.status === 'syncing') {
    return (
      <div className="bg-blue-600 text-white px-4 py-1.5 text-xs font-medium flex items-center justify-center gap-2 shadow-sm">
        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
        <span>Synchronisation des données avec le cloud en cours...</span>
      </div>
    );
  }

  return null;
};
