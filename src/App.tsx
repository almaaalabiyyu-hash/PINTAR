/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { AnnouncementFeed } from './components/announcements/AnnouncementFeed';
import { QuizAssignmentView } from './components/quizzes/QuizAssignmentView';
import { AcademicCalendar } from './components/calendar/AcademicCalendar';
import { AcademicChat } from './components/chat/AcademicChat';
import { CerdasCermatGame } from './components/cerdas-cermat/CerdasCermatGame';
import { AdminSurveyView } from './components/admin/AdminSurveyView';
import { AdminPanel } from './components/admin/AdminPanel';
import { AuthModal } from './components/auth/AuthModal';
import { NotificationDrawer } from './components/notifications/NotificationDrawer';
import { ProfileModal } from './components/profile/ProfileModal';
import { MutualFriendModal } from './components/common/MutualFriendModal';
import { LoginPage } from './components/auth/LoginPage';
import {
  Bell,
  CheckCircle2,
  AlertCircle,
  Info,
  ShieldCheck,
  GraduationCap
} from 'lucide-react';

const MainAppContent: React.FC = () => {
  const {
    activeTab,
    quickToast,
    branding,
    currentUser,
  } = useApp();

  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [notifDrawerOpen, setNotifDrawerOpen] = useState(false);
  const [profileModalOpen, setProfileModalOpen] = useState(false);

  // Tampilan awal banget masuk harus loginnya
  if (!currentUser) {
    return <LoginPage />;
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      
      {/* Header */}
      <Header
        onOpenNotifications={() => setNotifDrawerOpen(true)}
        onOpenAuth={() => setAuthModalOpen(true)}
        onOpenProfile={() => setProfileModalOpen(true)}
      />

      {/* Real-time Toast Alert Notification */}
      {quickToast && (
        <div className="fixed top-20 right-4 z-50 max-w-sm animate-in slide-in-from-top-5 duration-300">
          <div
            className={`p-3.5 rounded-2xl shadow-xl border flex items-center space-x-3 text-xs ${
              quickToast.type === 'success'
                ? 'bg-emerald-900/90 text-white border-emerald-700'
                : quickToast.type === 'warning'
                ? 'bg-amber-900/90 text-white border-amber-700'
                : 'bg-slate-900/90 text-white border-slate-700'
            }`}
          >
            <div className="shrink-0">
              {quickToast.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              ) : quickToast.type === 'warning' ? (
                <AlertCircle className="w-4 h-4 text-amber-400" />
              ) : (
                <Info className="w-4 h-4 text-blue-400" />
              )}
            </div>
            <p className="font-semibold leading-snug flex-1">{quickToast.message}</p>
          </div>
        </div>
      )}

      {/* Main Layout Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col lg:flex-row gap-6">
          
          {/* Left Sidebar */}
          <Sidebar />

          {/* Right Main Content */}
          <section className="flex-1 min-w-0">
            {activeTab === 'pengumuman' && <AnnouncementFeed />}
            {activeTab === 'chat' && <AcademicChat />}
            {activeTab === 'cerdas-cermat' && <CerdasCermatGame />}
            {activeTab === 'kuis-tugas' && <QuizAssignmentView />}
            {activeTab === 'kalender' && <AcademicCalendar />}
            {activeTab === 'survei-admin' && <AdminSurveyView />}
            {activeTab === 'panel-admin' && <AdminPanel />}
          </section>

        </div>
      </main>

      {/* School Footer */}
      <footer className="mt-auto border-t border-slate-200 bg-white py-6 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <div className="flex items-center space-x-2">
            <div
              className="w-5 h-5 rounded-md flex items-center justify-center text-white text-[10px] font-bold"
              style={{ backgroundColor: branding.primaryColor }}
            >
              P
            </div>
            <span className="font-extrabold text-slate-800">PINTAR - SMPI AL-AKBAR</span>
            <span>— Beriman, Berbudi, Berprestasi</span>
          </div>
          <p className="text-[11px] text-slate-400">
            Sistem Informasi Sekolah Terintegrasi • Komunikasi Aman Tanpa Nomor Telepon
          </p>
        </div>
      </footer>

      {/* Global Modals */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
      />

      <NotificationDrawer
        isOpen={notifDrawerOpen}
        onClose={() => setNotifDrawerOpen(false)}
      />

      <ProfileModal
        isOpen={profileModalOpen}
        onClose={() => setProfileModalOpen(false)}
      />

      {/* Gemes Mutual Friends Celebration Modal */}
      <MutualFriendModal />

    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainAppContent />
    </AppProvider>
  );
}
