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
 * Green Life Hospital Logo (matches official Green Life Hospital architectural signage):
 * - Vivid Medical Green Cross (+ symbol) with rounded corners
 * - Organic Leaf motif curving through the cross center with central vein & twin-petal (chartreuse lime & rich green)
 * - Two-line bold hospital typography ("Green Life" / "Hospital" or portal subtitle) in deep forest teal (#014737)
 * - Adapts seamlessly to Light and Dark backgrounds
 */
export const HospitalLogo: React.FC<HospitalLogoProps> = ({
  size = 'md',
  theme = 'light',
  showText = true,
  title = 'Green Life',
  subtitle = 'Hospital',
  className = '',
  iconClassName = '',
}) => {
  const sizeMap = {
    xs: { icon: 'w-6 h-6', title: 'text-xs', sub: 'text-[9px]' },
    sm: { icon: 'w-8 h-8', title: 'text-[14px]', sub: 'text-[10.5px]' },
    md: { icon: 'w-10 h-10 sm:w-11 sm:h-11', title: 'text-[17px] sm:text-[18px]', sub: 'text-[12px] sm:text-[13px]' },
    lg: { icon: 'w-12 h-12', title: 'text-xl', sub: 'text-xs' },
    xl: { icon: 'w-14 h-14', title: 'text-2xl', sub: 'text-sm' },
  };

  const currentSize = sizeMap[size] || sizeMap.md;

  // Check if this is the signature 2-line lockup ("Green Life" / "Hospital")
  const isSignatureBrand =
    (title === 'Green Life' && subtitle === 'Hospital') ||
    (!subtitle && title === 'Green Life Hospital');

  return (
    <div className={`flex items-center gap-2.5 sm:gap-3 shrink-0 select-none ${className}`}>
      {/* Green Life Cross & Leaf Emblem SVG */}
      <svg
        className={`${currentSize.icon} shrink-0 ${iconClassName} transition-transform duration-200 group-hover:scale-105 drop-shadow-xs`}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <defs>
          {/* Medical Green Cross Gradient */}
          <linearGradient id="glh-cross-bg" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#3cd058" />
            <stop offset="50%" stopColor="#28b446" />
            <stop offset="100%" stopColor="#199234" />
          </linearGradient>

          {/* Vivid Chartreuse / Lime Leaf Gradient */}
          <linearGradient id="glh-leaf-lime" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#84cc16" />
            <stop offset="60%" stopColor="#a3e635" />
            <stop offset="100%" stopColor="#bef264" />
          </linearGradient>

          {/* Fresh Green Leaf Gradient */}
          <linearGradient id="glh-leaf-green" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#15803d" />
            <stop offset="60%" stopColor="#16a34a" />
            <stop offset="100%" stopColor="#22c55e" />
          </linearGradient>

          {/* Cross Clip Path with soft rounded corners */}
          <clipPath id="glh-cross-clip">
            <path d="M 38 8 L 62 8 A 6 6 0 0 1 68 14 L 68 32 L 86 32 A 6 6 0 0 1 92 38 L 92 62 A 6 6 0 0 1 86 68 L 68 68 L 68 86 A 6 6 0 0 1 62 92 L 38 92 A 6 6 0 0 1 32 86 L 32 68 L 14 68 A 6 6 0 0 1 8 62 L 8 38 A 6 6 0 0 1 14 32 L 32 32 L 32 14 A 6 6 0 0 1 38 8 Z" />
          </clipPath>
        </defs>

        {/* Cross Body Base */}
        <path
          d="M 38 8 L 62 8 A 6 6 0 0 1 68 14 L 68 32 L 86 32 A 6 6 0 0 1 92 38 L 92 62 A 6 6 0 0 1 86 68 L 68 68 L 68 86 A 6 6 0 0 1 62 92 L 38 92 A 6 6 0 0 1 32 86 L 32 68 L 14 68 A 6 6 0 0 1 8 62 L 8 38 A 6 6 0 0 1 14 32 L 32 32 L 32 14 A 6 6 0 0 1 38 8 Z"
          fill="url(#glh-cross-bg)"
        />

        {/* Inside Cross: Signature Organic Leaf */}
        <g clipPath="url(#glh-cross-clip)">
          {/* Left Leaf Petal (Chartreuse / Fresh Lime) */}
          <path
            d="M 44 82 C 40 64, 48 44, 72 26 C 54 36, 42 54, 44 82 Z"
            fill="url(#glh-leaf-lime)"
          />

          {/* Right Leaf Petal (Vivid Emerald Green) */}
          <path
            d="M 44 82 C 48 64, 62 44, 72 26 C 66 48, 54 68, 44 82 Z"
            fill="url(#glh-leaf-green)"
          />

          {/* Center Curved Leaf Vein */}
          <path
            d="M 44 82 C 46 64, 56 44, 72 26"
            stroke="#054437"
            strokeWidth="2.4"
            strokeLinecap="round"
            fill="none"
          />

          {/* Left Leaf Contour Outline */}
          <path
            d="M 44 82 C 42 54, 54 36, 72 26"
            stroke="#054437"
            strokeWidth="1.6"
            strokeLinecap="round"
            fill="none"
          />

          {/* Right Leaf Contour Outline */}
          <path
            d="M 44 82 C 54 68, 66 48, 72 26"
            stroke="#054437"
            strokeWidth="1.6"
            strokeLinecap="round"
            fill="none"
          />
        </g>
      </svg>

      {/* Brand Typography */}
      {showText && (
        <div className="flex flex-col justify-center leading-none min-w-0">
          {isSignatureBrand ? (
            <>
              <span
                className={`font-black tracking-tight ${currentSize.title} ${
                  theme === 'dark' ? 'text-white' : 'text-[#014737]'
                }`}
              >
                Green Life
              </span>
              <span
                className={`font-extrabold tracking-tight mt-0.5 ${currentSize.sub} ${
                  theme === 'dark' ? 'text-emerald-300' : 'text-[#014737]'
                }`}
              >
                Hospital
              </span>
            </>
          ) : (
            <>
              <span
                className={`font-black tracking-tight ${currentSize.title} ${
                  theme === 'dark' ? 'text-white' : 'text-[#014737]'
                }`}
              >
                {title}
              </span>
              {subtitle && (
                <span
                  className={`font-medium tracking-normal mt-0.5 truncate ${currentSize.sub} ${
                    theme === 'dark' ? 'text-emerald-400' : 'text-slate-500'
                  }`}
                >
                  {subtitle}
                </span>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
};
