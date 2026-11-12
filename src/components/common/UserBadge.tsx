import React from 'react';
import { ShieldCheck, Flame, Sparkles, Zap, Award, Crown } from 'lucide-react';
import { UserBadgeType } from '../../types';
import { useApp } from '../../context/AppContext';

interface UserBadgeProps {
  badge: UserBadgeType;
  size?: 'xs' | 'sm' | 'md';
}

export const UserBadgeItem: React.FC<UserBadgeProps> = ({ badge, size = 'xs' }) => {
  const sizeClasses = {
    xs: 'text-[10px] px-2 py-0.5 gap-1',
    sm: 'text-xs px-2.5 py-1 gap-1.5',
    md: 'text-sm px-3 py-1.5 gap-2',
  }[size];

  const iconSizes = {
    xs: 'w-3 h-3',
    sm: 'w-3.5 h-3.5',
    md: 'w-4 h-4',
  }[size];

  switch (badge) {
    case 'Si Pintar':
      return (
        <span
          className={`inline-flex items-center font-bold rounded-full bg-blue-100 text-blue-900 border border-blue-300 shadow-xs ${sizeClasses}`}
          title="Siswa pintar dengan nilai kuis / capaian akademik tinggi"
        >
          <Award className={`${iconSizes} text-blue-600 fill-blue-400`} />
          <span>Si Pintar</span>
        </span>
      );

    case 'Badge Admin':
    case 'Admin':
      return (
        <span
          className={`inline-flex items-center font-bold rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 shadow-xs ${sizeClasses}`}
          title="Badge Administrator Sekolah"
        >
          <Crown className={`${iconSizes} text-amber-500 fill-amber-400`} />
          <span>Badge Admin</span>
        </span>
      );

    case 'Pekerja Keras':
      return (
        <span
          className={`inline-flex items-center font-bold rounded-full bg-orange-100 text-orange-800 border border-orange-300 shadow-xs ${sizeClasses}`}
          title="Santri/Guru yang tekun dan pantang menyerah"
        >
          <Flame className={`${iconSizes} text-orange-600 fill-orange-500`} />
          <span>Pekerja Keras</span>
        </span>
      );

    case 'Si Bijak':
      return (
        <span
          className={`inline-flex items-center font-bold rounded-full bg-amber-100 text-amber-900 border border-amber-300 shadow-xs ${sizeClasses}`}
          title="Berwawasan luas, santun, dan solutif"
        >
          <Sparkles className={`${iconSizes} text-amber-600 fill-amber-400`} />
          <span>Si Bijak</span>
        </span>
      );

    case 'Si Paling Aktif':
      return (
        <span
          className={`inline-flex items-center font-bold rounded-full bg-emerald-50 text-emerald-900 border border-emerald-300 ring-1 ring-emerald-400/40 shadow-xs ${sizeClasses}`}
          title="Aktif berpartisipasi dalam diskusi dan kuis"
        >
          <Zap className={`${iconSizes} text-emerald-600 fill-emerald-500`} />
          <span>Si Paling Aktif</span>
        </span>
      );

    default:
      return (
        <span
          className={`inline-flex items-center font-semibold rounded-full bg-slate-100 text-slate-700 border border-slate-200 ${sizeClasses}`}
        >
          <Award className={`${iconSizes} text-slate-500`} />
          <span>{badge}</span>
        </span>
      );
  }
};

export const UserBadgeList: React.FC<{
  badges?: UserBadgeType[];
  size?: 'xs' | 'sm' | 'md';
  maxDisplay?: number;
  forceShowForAdminOnly?: boolean;
}> = ({ badges, size = 'xs', maxDisplay, forceShowForAdminOnly }) => {
  const { currentUser } = useApp();

  // Intruksi pengguna: "untuk badge nya jangan di tampilkan, biarkan admin aja yg tau"
  // Hanya tampilkan jika user adalah admin atau jika di dalam panel admin
  const isAuthorizedAdmin = currentUser?.isAdmin || forceShowForAdminOnly;
  if (!isAuthorizedAdmin) {
    return null;
  }

  if (!badges || badges.length === 0) return null;

  const displayed = maxDisplay ? badges.slice(0, maxDisplay) : badges;
  const remaining = maxDisplay && badges.length > maxDisplay ? badges.length - maxDisplay : 0;

  return (
    <div className="inline-flex items-center gap-1 flex-wrap">
      {displayed.map((b, idx) => (
        <UserBadgeItem key={`${b}-${idx}`} badge={b} size={size} />
      ))}
      {remaining > 0 && (
        <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
          +{remaining}
        </span>
      )}
    </div>
  );
};
