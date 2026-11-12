import React from 'react';
import {
  Bell,
  X,
  CheckCheck,
  BookOpenCheck,
  Megaphone,
  Award,
  MessageSquare,
  Clock,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface NotificationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NotificationDrawer: React.FC<NotificationDrawerProps> = ({
  isOpen,
  onClose,
}) => {
  const {
    notifications,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    setActiveTab,
    branding,
    currentUser,
  } = useApp();

  if (!isOpen) return null;

  // Filter for current user or ALL
  const userNotifications = notifications.filter(
    n => n.userId === 'ALL' || (currentUser && n.userId === currentUser.id)
  );

  const getIcon = (type: string) => {
    switch (type) {
      case 'tugas_baru':
        return <BookOpenCheck className="w-4 h-4 text-purple-600" />;
      case 'kuis_baru':
        return <Sparkles className="w-4 h-4 text-blue-600" />;
      case 'pengumuman':
        return <Megaphone className="w-4 h-4 text-emerald-600" />;
      case 'nilai_keluar':
        return <Award className="w-4 h-4 text-amber-600" />;
      case 'chat_baru':
        return <MessageSquare className="w-4 h-4 text-indigo-600" />;
      default:
        return <Bell className="w-4 h-4 text-slate-600" />;
    }
  };

  const handleNotificationClick = (id: string, type: string) => {
    markNotificationAsRead(id);
    if (type === 'tugas_baru' || type === 'kuis_baru' || type === 'nilai_keluar') {
      setActiveTab('kuis-tugas');
    } else if (type === 'pengumuman') {
      setActiveTab('pengumuman');
    } else if (type === 'chat_baru') {
      setActiveTab('chat');
    } else if (type === 'admin_status') {
      setActiveTab('panel-admin');
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex justify-end">
      <div className="bg-white w-full max-w-sm h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-200">
        
        {/* Header */}
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div
              className="w-8 h-8 rounded-xl flex items-center justify-center text-white"
              style={{ backgroundColor: branding.primaryColor }}
            >
              <Bell className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-extrabold text-slate-900">Notifikasi Otomatis</h3>
              <p className="text-[10px] text-slate-400">Tugas baru & pengumuman terkini</p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Action bar */}
        <div className="px-4 py-2 bg-slate-50 border-b border-slate-100 flex items-center justify-between text-xs">
          <span className="text-slate-500 font-medium">
            {userNotifications.filter(n => !n.isRead).length} Belum Dibaca
          </span>
          <button
            type="button"
            onClick={markAllNotificationsAsRead}
            className="text-blue-600 hover:text-blue-700 font-bold flex items-center gap-1 text-[11px]"
          >
            <CheckCheck className="w-3.5 h-3.5" />
            <span>Tandai Semua Dibaca</span>
          </button>
        </div>

        {/* Notifications List */}
        <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
          {userNotifications.length === 0 ? (
            <div className="py-16 text-center text-slate-400 text-xs">
              <Bell className="w-10 h-10 mx-auto mb-2 text-slate-300" />
              <span>Belum ada notifikasi baru</span>
            </div>
          ) : (
            userNotifications.map(n => (
              <div
                key={n.id}
                onClick={() => handleNotificationClick(n.id, n.type)}
                className={`p-4 text-xs cursor-pointer transition-colors hover:bg-slate-50 flex items-start gap-3 ${
                  !n.isRead ? 'bg-blue-50/40' : ''
                }`}
              >
                <div className="w-8 h-8 rounded-xl bg-white border border-slate-200 flex items-center justify-center shrink-0 shadow-xs mt-0.5">
                  {getIcon(n.type)}
                </div>

                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-extrabold text-slate-900 leading-tight">
                      {n.title}
                    </span>
                    {!n.isRead && (
                      <span className="w-2 h-2 rounded-full bg-blue-600 shrink-0" />
                    )}
                  </div>
                  <p className="text-slate-600 mt-1 leading-relaxed text-[11px]">
                    {n.message}
                  </p>
                  <p className="text-[10px] text-slate-400 mt-1.5 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {new Date(n.createdAt).toLocaleTimeString('id-ID', {
                      hour: '2-digit',
                      minute: '2-digit',
                      day: 'numeric',
                      month: 'short',
                    })}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-slate-100 text-center bg-slate-50">
          <p className="text-[10px] text-slate-400">
            PINTAR School Automated Push Engine
          </p>
        </div>

      </div>
    </div>
  );
};
