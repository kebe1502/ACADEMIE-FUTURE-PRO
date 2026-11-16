/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { OfflineBanner } from './components/OfflineBanner';
import { LiveScoreTicker } from './components/LiveScoreTicker';
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { Footer } from './components/Footer';
import { HomeDashboard } from './components/HomeDashboard';
import { MatchCalendar } from './components/MatchCalendar';
import { TeamRoster } from './components/TeamRoster';
import { GalleryView } from './components/GalleryView';
import { MemberArea } from './components/MemberArea';
import { NewsSection } from './components/NewsSection';
import { MatchDetailModal } from './components/MatchDetailModal';
import { PlayerDetailModal } from './components/PlayerDetailModal';
import { NewsDetailModal } from './components/NewsDetailModal';
import { TwoFactorAuthModal } from './components/TwoFactorAuthModal';
import { NotificationSettingsModal } from './components/NotificationSettingsModal';
import { SocialShareModal } from './components/SocialShareModal';
import { ToastContainer } from './components/ToastContainer';
import { AdminDashboard } from './components/AdminDashboard';
import { ScrollToTopButton } from './components/ScrollToTopButton';

const MainContent: React.FC = () => {
  const { activeTab } = useApp();

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8 min-h-[75vh]">
      {activeTab === 'home' && <HomeDashboard />}
      {activeTab === 'matches' && <MatchCalendar />}
      {activeTab === 'team' && <TeamRoster />}
      {activeTab === 'gallery' && <GalleryView />}
      {activeTab === 'member' && <MemberArea />}
      {activeTab === 'news' && <NewsSection />}
      {activeTab === 'admin' && <AdminDashboard />}
    </main>
  );
};

const AppLayout: React.FC = () => {
  const { clubInfo } = useApp();
  const globalBg = clubInfo.backgroundUrls?.appGlobalBg;

  return (
    <div
      className="min-h-screen w-full max-w-full overflow-x-hidden bg-slate-100 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors selection:bg-amber-500 selection:text-slate-950 relative"
      style={
        globalBg
          ? {
              backgroundImage: `linear-gradient(to bottom, rgba(15, 23, 42, 0.88), rgba(15, 23, 42, 0.95)), url("${globalBg}")`,
              backgroundAttachment: 'fixed',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }
          : undefined
      }
    >
      {/* Offline Status Warning */}
      <OfflineBanner />

      {/* Real-time Match Score Ticker */}
      <LiveScoreTicker />

      {/* Global Responsive Navigation Header */}
      <Header />

      {/* Dynamic Main Body Content based on activeTab */}
      <MainContent />

      {/* Global Footer with Stadium info & Links */}
      <Footer />

      {/* Mobile Bottom Navigation Bar */}
      <BottomNav />

      {/* Global Interactive Modals */}
      <MatchDetailModal />
      <PlayerDetailModal />
      <NewsDetailModal />
      <TwoFactorAuthModal />
      <NotificationSettingsModal />
      <SocialShareModal />
      <ToastContainer />

      {/* Floating Scroll Navigation Arrow */}
      <ScrollToTopButton />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppLayout />
    </AppProvider>
  );
}
