import React from 'react';

export interface HospitalLogoProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  theme?: 'light' | 'dark';
  showText?: boolean;
  title?: string;
  subtitle?: string;
  className?: string;
  iconClassName?: string;
}

/**
 * Universal Hospital Management System Logo:
 * - Iconic Medical Cross with integrated ECG Heartbeat Rhythm Pulse
 * - Emerald & Teal healthcare gradient with vital cyan accent
 * - Adapts seamlessly to Light and Dark backgrounds
 * - Used across Landing Page Navbar, Footer, and all Portal Sidebars
 */
export const HospitalLogo: React.FC<HospitalLogoProps> = ({
  size = 'md',
  theme = 'light',
  showText = true,
  title = 'GreenHospital',
  subtitle = 'Healthcare & Tertiary Center',
  className = '',
  iconClassName = '',
}) => {
  const sizeMap = {
    xs: { icon: 'w-6 h-6', title: 'text-xs', sub: 'text-[9px]' },
    sm: { icon: 'w-8 h-8', title: 'text-[15px]', sub: 'text-[10px]' },
    md: { icon: 'w-10 h-10', title: 'text-lg', sub: 'text-xs' },
    lg: { icon: 'w-12 h-12', title: 'text-xl', sub: 'text-xs' },
    xl: { icon: 'w-14 h-14', title: 'text-2xl', sub: 'text-sm' },
  };

  const currentSize = sizeMap[size] || sizeMap.md;

  return (
    <div className={`flex items-center gap-2.5 sm:gap-3 shrink-0 select-none ${className}`}>
      {/* Hospital Emblem SVG */}
      <svg
        className={`${currentSize.icon} shrink-0 ${iconClassName} transition-transform duration-200 group-hover:scale-105`}
        viewBox="0 0 64 64"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="gh-logo-bg" x1="0" y1="0" x2="64" y2="64" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#006a4e" />
            <stop offset="55%" stopColor="#008a66" />
            <stop offset="100%" stopColor="#0284c7" />
          </linearGradient>
          <linearGradient id="gh-logo-pulse" x1="16" y1="32" x2="48" y2="32" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#006a4e" />
            <stop offset="50%" stopColor="#0284c7" />
            <stop offset="100%" stopColor="#006a4e" />
          </linearGradient>
        </defs>

        {/* Badge container with smooth rounded corners */}
        <rect width="64" height="64" rx="16" fill="url(#gh-logo-bg)" />

        {/* Crisp White Medical Cross */}
        <rect x="25" y="12" width="14" height="40" rx="5" fill="#ffffff" />
        <rect x="12" y="25" width="40" height="14" rx="5" fill="#ffffff" />

        {/* Center ECG Heartbeat Rhythm Pulse */}
        <path
          d="M15 32 H25 L28 22 L32 42 L36 26 L39 32 H49"
          stroke="url(#gh-logo-pulse)"
          strokeWidth="3.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Top-Right Vital Spark Dot */}
        <circle cx="47" cy="17" r="3.5" fill="#38bdf8" />
      </svg>

      {/* Hospital Name & Subtitle Typography */}
      {showText && (
        <div className="flex flex-col justify-center leading-tight min-w-0">
          <div className="flex items-center gap-1 leading-none">
            <span
              className={`font-black tracking-tight ${currentSize.title} ${
                theme === 'dark' ? 'text-white' : 'text-[#006a4e]'
              }`}
            >
              {title}
            </span>
          </div>
          {subtitle && (
            <span
              className={`font-semibold tracking-normal mt-0.5 truncate ${currentSize.sub} ${
                theme === 'dark' ? 'text-emerald-400' : 'text-slate-500'
              }`}
            >
              {subtitle}
            </span>
          )}
        </div>
      )}
    </div>
  );
};
