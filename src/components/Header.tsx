import React, { useState } from 'react';
import {
  Bell,
  LogOut,
  User as UserIcon,
  ChevronDown,
  Sparkles,
  ShieldCheck,
  GraduationCap,
  BookOpen,
  Download,
  Menu
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { BrandIcon } from './common/BrandIcon';
import { UserBadgeList, UserBadgeItem } from './common/UserBadge';
import { DownloadInstallModal } from './common/DownloadInstallModal';

interface HeaderProps {
  onOpenNotifications: () => void;
  onOpenAuth: () => void;
  onOpenProfile: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenNotifications,
  onOpenAuth,
  onOpenProfile,
}) => {
  const {
    currentUser,
    users,
    branding,
    logout,
    unreadNotificationsCount,
    setActiveTab,
    isNavDrawerOpen,
    setIsNavDrawerOpen,
  } = useApp();

  const [downloadModalOpen, setDownloadModalOpen] = useState(false);

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Left: 3-line Hamburger Menu Button + School Brand Identity */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* 3 Garis Hamburger Navigation */}
            <button
              type="button"
              onClick={() => setIsNavDrawerOpen(!isNavDrawerOpen)}
              className="p-2 -ml-1 sm:-ml-2 rounded-xl text-slate-700 hover:bg-emerald-50 hover:text-emerald-700 border border-slate-200 transition-colors shrink-0 shadow-2xs"
              title="Menu Navigasi Sekolah"
              aria-label="Buka Menu Navigasi"
            >
              <Menu className="w-5 h-5 text-emerald-800" />
            </button>

            <div
              className="flex items-center space-x-2.5 cursor-pointer group"
              onClick={() => setActiveTab('pengumuman')}
            >
              <div
                className="w-11 h-11 rounded-2xl flex items-center justify-center p-0.5 shadow-xs transition-all duration-300 group-hover:scale-105 shrink-0 bg-white border border-amber-300 shadow-2xs overflow-hidden"
              >
                <BrandIcon className="w-10 h-10 object-contain drop-shadow-2xs" />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <span className="font-extrabold text-base sm:text-xl tracking-tight text-slate-900 flex items-center">
                    PINTAR - SMPI AL-AKBAR
                  </span>
                </div>
                <p className="text-xs text-emerald-700 font-bold truncate max-w-[170px] sm:max-w-xs md:max-w-md">
                  Beriman, Berbudi, Berprestasi
                </p>
              </div>
            </div>
          </div>

          {/* Right: Actions, Demo Switcher, Notification, Profile */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            
            {/* Tombol Unduh APK / Download App */}
            <button
              type="button"
              onClick={() => setDownloadModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs transition-transform active:scale-95"
              title="Unduh / Pasang Aplikasi PINTAR di HP atau Komputer"
            >
              <Download className="w-3.5 h-3.5 text-amber-300" />
              <span className="hidden sm:inline">Unduh</span>
              <span>APK PINTAR</span>
            </button>

            {/* Notification Bell */}
            <button
              type="button"
              onClick={onOpenNotifications}
              className="relative p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
              title="Notifikasi Sekolah"
            >
              <Bell className="w-5 h-5" />
              {unreadNotificationsCount > 0 && (
                <span
                  className="absolute top-1.5 right-1.5 flex h-4 min-w-4 px-1 items-center justify-center rounded-full text-[10px] font-bold text-white shadow-xs animate-pulse"
                  style={{ backgroundColor: branding.primaryColor }}
                >
                  {unreadNotificationsCount > 9 ? '9+' : unreadNotificationsCount}
                </span>
              )}
            </button>

            {/* Current user / Auth button */}
            {currentUser ? (
              <div className="flex items-center space-x-2 pl-2 border-l border-slate-200">
                <button
                  type="button"
                  onClick={onOpenProfile}
                  className="flex items-center space-x-2 text-left group hover:opacity-90 transition-opacity"
                  title="Lihat Profil Saya"
                >
                  <img
                    src={currentUser.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=80&q=80'}
                    alt={currentUser.name}
                    className="w-8 h-8 rounded-full object-cover ring-2 ring-emerald-300 group-hover:ring-emerald-500"
                  />
                  <div className="hidden lg:block">
                    <div className="flex items-center gap-1.5">
                      <p className="text-xs font-bold text-slate-900 leading-tight truncate max-w-[140px]">
                        {currentUser.displayName || currentUser.name}
                      </p>
                    </div>
                    <div className="flex items-center gap-1 mt-0.5">
                      <span className="text-[10px] font-semibold text-slate-500 truncate max-w-[140px]">
                        {currentUser.usn || currentUser.name}
                      </span>
                      {currentUser.isAdmin && (
                        <span className="text-[9px] font-extrabold px-1.5 py-0.2 rounded-full bg-amber-100 text-amber-900 border border-amber-300">
                          Admin
                        </span>
                      )}
                    </div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={logout}
                  className="p-1.5 text-slate-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                  title="Keluar"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={onOpenAuth}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-white shadow-sm transition-transform active:scale-95"
                style={{ backgroundColor: branding.primaryColor }}
              >
                <UserIcon className="w-4 h-4" />
                <span>Masuk / Daftar</span>
              </button>
            )}

          </div>

        </div>
      </div>

      <DownloadInstallModal
        isOpen={downloadModalOpen}
        onClose={() => setDownloadModalOpen(false)}
      />
    </header>
  );
};
