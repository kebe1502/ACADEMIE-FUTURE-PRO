import React from 'react';
import { X, Bell, Volume2, Flame, Trophy, Ticket, Newspaper, Check, Shield } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { getAccentStyles } from '../utils/theme';

export const NotificationSettingsModal: React.FC = () => {
  const {
    isNotifModalOpen,
    setIsNotifModalOpen,
    notifications,
    updateNotificationSettings,
    sendTestNotification,
    themeAccent,
    t,
  } = useApp();

  if (!isNotifModalOpen) return null;

  const accent = getAccentStyles(themeAccent);

  const toggleItems: {
    key: keyof typeof notifications;
    titleKey: string;
    icon: React.FC<{ className?: string }>;
    desc: string;
  }[] = [
    {
      key: 'liveScores',
      titleKey: 'notif_live_goals',
      icon: Flame,
      desc: 'Recevez un pop-up instantané à chaque but avec le nom du buteur et le score en temps réel.',
    },
    {
      key: 'transfers',
      titleKey: 'notif_transfers',
      icon: Trophy,
      desc: 'Officialisations de recrues estivales/hivernales et départs majeurs validés par la direction.',
    },
    {
      key: 'ticketSales',
      titleKey: 'notif_ticket_open',
      icon: Ticket,
      desc: 'Alerte d’ouverture prioritaire des ventes pour les abonnés et matchs de prestige (Real, PSG, OM).',
    },
    {
      key: 'redCards',
      titleKey: 'notif_red_cards',
      icon: Shield,
      desc: 'Cartons rouges, expulsions et décisions VAR clés en direct.',
    },
    {
      key: 'clubNews',
      titleKey: 'notif_club_news',
      icon: Newspaper,
      desc: 'Compositions officielles publiées 1h avant le coup d’envoi et communiqués de presse.',
    },
    {
      key: 'soundEnabled',
      titleKey: 'notif_sound',
      icon: Volume2,
      desc: 'Joue une brève fanfare et signal sonore immersif lorsqu’un but est marqué.',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-in fade-in">
      <div className="w-full max-w-lg rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 shadow-2xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800 flex-shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-500">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                {t('notifications_title')}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Alertes push en temps réel & scores en direct
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsNotifModalOpen(false)}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Toggle List */}
        <div className="mt-4 space-y-3 overflow-y-auto pr-1 flex-1">
          {toggleItems.map(item => {
            const Icon = item.icon;
            const isEnabled = notifications[item.key];
            return (
              <div
                key={item.key}
                onClick={() => updateNotificationSettings({ [item.key]: !isEnabled })}
                className="flex items-start justify-between p-3 rounded-xl border border-slate-200/80 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-850/50 cursor-pointer transition gap-3"
              >
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 mt-0.5">
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                      {t(item.titleKey)}
                    </h4>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                </div>

                {/* Switch Graphic */}
                <div
                  className={`w-11 h-6 rounded-full transition-colors p-0.5 flex items-center flex-shrink-0 mt-1 ${
                    isEnabled ? 'bg-amber-500' : 'bg-slate-300 dark:bg-slate-700'
                  }`}
                >
                  <div
                    className={`w-5 h-5 rounded-full bg-white shadow-sm transform transition-transform ${
                      isEnabled ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* Test Alert Button */}
        <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center gap-3 flex-shrink-0">
          <button
            id="btn-test-notif-push"
            onClick={sendTestNotification}
            className="w-full sm:w-auto flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-bold transition shadow-md"
          >
            <Volume2 className="w-4 h-4" />
            <span>{t('test_push_notif')}</span>
          </button>

          <button
            onClick={() => setIsNotifModalOpen(false)}
            className="w-full sm:w-auto py-2.5 px-5 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            {t('save')}
          </button>
        </div>
      </div>
    </div>
  );
};
