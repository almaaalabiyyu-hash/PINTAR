import React, { useState } from 'react';
import {
  Megaphone,
  BookOpenCheck,
  CalendarDays,
  MessageSquare,
  FileCheck2,
  Sliders,
  UserCheck,
  Shield,
  Sparkles,
  Brain,
  Trophy,
  X,
  Compass,
  Download
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { DownloadInstallModal } from './common/DownloadInstallModal';

export const Sidebar: React.FC = () => {
  const [showDownloadModal, setShowDownloadModal] = useState(false);
  const {
    currentUser,
    activeTab,
    setActiveTab,
    branding,
    quizzes,
    assignments,
    adminSurveys,
    isNavDrawerOpen,
    setIsNavDrawerOpen,
  } = useApp();

  const isTeacher = currentUser?.role === 'guru';
  const isAdmin = currentUser?.isAdmin;

  // Count pending surveys for admin
  const pendingSurveysCount = adminSurveys.filter(s => s.status === 'pending').length;

  const navItems = [
    {
      id: 'pengumuman',
      label: 'Pengumuman & Forum',
      icon: Megaphone,
      badge: null,
      description: 'Beranda stream foto & video',
    },
    {
      id: 'chat',
      label: 'Chat',
      icon: MessageSquare,
      badge: 'Warga Sekolah',
      badgeColor: 'bg-emerald-100 text-emerald-700',
      description: 'hubungi warga sekolah',
    },
    {
      id: 'cerdas-cermat',
      label: 'Game Cerdas Cermat',
      icon: Brain,
      badge: 'Top 3',
      badgeColor: 'bg-amber-100 text-amber-900 border border-amber-300',
      description: 'MTK, B. Indo, IPA, IPS & Umum',
    },
    {
      id: 'kuis-tugas',
      label: 'Kuis & Tugas',
      icon: BookOpenCheck,
      badge: `${quizzes.length + assignments.length}`,
      description: 'Kerjakan soal atau masukkan kode',
    },
    {
      id: 'kalender',
      label: 'Kalender & Tenggat',
      icon: CalendarDays,
      badge: null,
      description: 'Pantau batas waktu tugas',
    },
  ];

  // If user is a teacher and not yet an admin, show the Admin Survey tab
  if (isTeacher && !isAdmin) {
    navItems.push({
      id: 'survei-admin',
      label: 'Survei Calon Admin',
      icon: FileCheck2,
      badge: 'Guru',
      badgeColor: 'bg-amber-100 text-amber-800',
      description: 'Formulir pengajuan hak admin sekolah',
    });
  }

  // If user is an Admin, show the Admin Panel & Customization tab
  if (isAdmin) {
    navItems.push({
      id: 'panel-admin',
      label: 'Panel Admin & Desain',
      icon: Sliders,
      badge: pendingSurveysCount > 0 ? `${pendingSurveysCount} Baru` : 'Admin',
      badgeColor: pendingSurveysCount > 0 ? 'bg-red-500 text-white' : 'bg-purple-100 text-purple-700',
      description: 'Kustomisasi tema & kelola data sandi',
    });
  }

  const renderNavContent = (isDrawer: boolean = false) => (
    <div className="space-y-1">
      {/* School Info Header Card */}
      <div className="p-3 mb-2 rounded-xl bg-slate-50 border border-slate-100">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800">
            SMPI AL-AKBAR
          </span>
          <span className="text-[10px] font-semibold px-2 py-0.5 bg-slate-200 text-slate-700 rounded-full">
            Sem. {branding.semester}
          </span>
        </div>
        <div className="flex items-center justify-between mt-2 pt-1.5 border-t border-slate-200/60">
          <span className="text-[11px] font-bold text-slate-500">Motto Sekolah</span>
          <span className="text-xs font-black text-emerald-800">Beriman, Berbudi, Berprestasi</span>
        </div>
      </div>

      {/* Navigation list */}
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = activeTab === item.id;

        return (
          <button
            key={item.id}
            type="button"
            onClick={() => {
              setActiveTab(item.id);
              if (isDrawer) setIsNavDrawerOpen(false);
            }}
            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-left transition-all group ${
              isActive
                ? 'text-white font-semibold shadow-xs'
                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900 font-medium'
            }`}
            style={isActive ? { backgroundColor: branding.primaryColor } : {}}
          >
            <div className="flex items-center space-x-3 truncate">
              <Icon
                className={`w-5 h-5 shrink-0 transition-transform group-hover:scale-110 ${
                  isActive ? 'text-white' : 'text-slate-400 group-hover:text-slate-600'
                }`}
              />
              <div className="truncate">
                <p className="text-xs leading-none truncate font-bold">{item.label}</p>
                <p className={`text-[10px] mt-1 truncate ${isActive ? 'text-white/80' : 'text-slate-400'}`}>
                  {item.description}
                </p>
              </div>
            </div>

            {item.badge && (
              <span
                className={`text-[10px] px-2 py-0.5 rounded-full font-bold shrink-0 ml-1.5 ${
                  isActive
                    ? 'bg-white/20 text-white'
                    : item.badgeColor || 'bg-slate-100 text-slate-600'
                }`}
              >
                {item.badge}
              </span>
            )}
          </button>
        );
      })}

      {/* Unduh APK PINTAR button */}
      <div className="pt-2">
        <button
          type="button"
          onClick={() => setShowDownloadModal(true)}
          className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white font-black text-xs shadow-xs transition-transform active:scale-95 group"
        >
          <div className="flex items-center space-x-2.5">
            <Download className="w-4 h-4 text-amber-300 animate-pulse shrink-0" />
            <span>Unduh APK PINTAR</span>
          </div>
          <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded-full font-bold">
            Pasang
          </span>
        </button>
      </div>

      {/* Quick Help / Info box */}
      <div className="pt-3 mt-3 border-t border-slate-100">
        <div className="px-3 py-2.5 rounded-xl bg-gradient-to-br from-emerald-50 to-teal-50/50 border border-emerald-100">
          <div className="flex items-center gap-1.5 text-emerald-800">
            <Shield className="w-3.5 h-3.5" />
            <span className="text-[11px] font-bold">Privasi Terjaga</span>
          </div>
          <p className="text-[10px] text-slate-600 mt-1 leading-relaxed">
            Komunikasi sekolah aman dengan nama buatan & nama asli tanpa membagikan nomor telepon pribadi.
          </p>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Persistent Sidebar */}
      <aside className="hidden lg:block w-64 shrink-0">
        <nav className="bg-white rounded-2xl border border-slate-200 p-3 shadow-xs">
          {renderNavContent(false)}
        </nav>
      </aside>

      {/* Slide-over Navigation Drawer (Triggered by 3-line Hamburger Menu) */}
      {isNavDrawerOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex animate-in fade-in duration-200">
          <div className="bg-white w-80 max-w-[85vw] h-full shadow-2xl flex flex-col p-4 animate-in slide-in-from-left duration-300">
            {/* Drawer Header */}
            <div className="flex items-center justify-between pb-3 mb-2 border-b border-slate-100">
              <div className="flex items-center space-x-2">
                <div
                  className="w-7 h-7 rounded-lg flex items-center justify-center text-white text-xs font-black"
                  style={{ backgroundColor: branding.primaryColor }}
                >
                  P
                </div>
                <span className="font-extrabold text-sm text-slate-900">
                  Menu Utama PINTAR
                </span>
              </div>
              <button
                type="button"
                onClick={() => setIsNavDrawerOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Drawer Nav items */}
            <div className="flex-1 overflow-y-auto pr-1">
              {renderNavContent(true)}
            </div>
          </div>

          {/* Clickable Backdrop to close */}
          <div className="flex-1" onClick={() => setIsNavDrawerOpen(false)} />
        </div>
      )}

      <DownloadInstallModal
        isOpen={showDownloadModal}
        onClose={() => setShowDownloadModal(false)}
      />
    </>
  );
};

