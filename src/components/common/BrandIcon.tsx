import React from 'react';
import {
  GraduationCap,
  BookOpen,
  School,
  Sparkles,
  Award,
  Brain,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface BrandIconProps {
  className?: string;
  size?: number;
}

export const BrandIcon: React.FC<BrandIconProps> = ({ className = 'w-6 h-6', size }) => {
  const { branding } = useApp();

  const logoSrc = branding.customLogoUrl || '/assets/aistudio/Logo_APK_PINTAR_302be987.png';

  if (logoSrc) {
    return (
      <img
        src={logoSrc}
        alt={branding.schoolName || 'Logo APK PINTAR'}
        className={`${className} object-contain rounded-md`}
        onError={(e) => {
          (e.currentTarget as HTMLImageElement).style.display = 'none';
        }}
      />
    );
  }

  const iconProps = { className, size };

  switch (branding.appIconPreset) {
    case 'book-open':
      return <BookOpen {...iconProps} />;
    case 'school':
      return <School {...iconProps} />;
    case 'sparkles':
      return <Sparkles {...iconProps} />;
    case 'award':
      return <Award {...iconProps} />;
    case 'brain':
      return <Brain {...iconProps} />;
    case 'graduation-cap':
    default:
      // Custom Official Emblem SMPI AL-AKBAR (Bintang Islami 8 Sudut Rub-el-Hizb + Kubah & Kitab Al-Qur'an Emas)
      return (
        <svg
          viewBox="0 0 48 48"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={className}
        >
          {/* Islamic Star Background (Rub el Hizb) */}
          <rect
            x="8"
            y="8"
            width="32"
            height="32"
            rx="6"
            fill="url(#emblemGrad)"
            stroke="#FDE047"
            strokeWidth="1.5"
          />
          <rect
            x="8"
            y="8"
            width="32"
            height="32"
            rx="6"
            transform="rotate(45 24 24)"
            fill="url(#emblemGrad)"
            stroke="#FDE047"
            strokeWidth="1.5"
            fillOpacity="0.85"
          />

          {/* Dome & Minaret Silhouette */}
          <path
            d="M24 11C23 13 20 15 20 19C20 22 22 23 24 23C26 23 28 22 28 19C28 15 25 13 24 11Z"
            fill="#FEF08A"
          />
          {/* Crescent Star Top */}
          <circle cx="24" cy="9.5" r="1.5" fill="#FDE047" />

          {/* Open Quran / Book of Wisdom */}
          <path
            d="M17 26.5C19.5 25.5 22 26 24 27.5C26 26 28.5 25.5 31 26.5V34C28.5 33 26 33.5 24 35C22 33.5 19.5 33 17 34V26.5Z"
            fill="#FFFFFF"
          />
          <path
            d="M24 27.5V35"
            stroke="#059669"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          {/* Book Spine Golden Base */}
          <path
            d="M21 34.5L24 36.5L27 34.5"
            stroke="#F59E0B"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          <defs>
            <linearGradient id="emblemGrad" x1="8" y1="8" x2="40" y2="40" gradientUnits="userSpaceOnUse">
              <stop stopColor="#047857" />
              <stop offset="1" stopColor="#065F46" />
            </linearGradient>
          </defs>
        </svg>
      );
  }
};
