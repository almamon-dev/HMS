import React, { useState, useEffect } from 'react';
import {
  Award,
  ShieldCheck,
  Globe,
  Calendar,
  ArrowRight,
  UserCheck,
} from 'lucide-react';
import { AppointmentBookingContext } from '../../data/appointmentData';

interface HeroBannerProps {
  onOpenPortals: () => void;
  onOpenAppointment: (context?: AppointmentBookingContext) => void;
}

interface HeroSlide {
  id: string;
  badge: string;
  titlePrefix: string;
  titleHighlight: string;
  subtitle: string;
  bgImage: string;
  pills: { icon: 'award' | 'shield' | 'globe'; label: string }[];
}

const HERO_SLIDES: HeroSlide[] = [
  {
    id: 'comprehensive-care',
    badge: 'Clinical Healthcare Excellence & Quality 2026',
    titlePrefix: 'Comprehensive Healthcare',
    titleHighlight: 'One Roof',
    subtitle:
      'World-class treatment, experienced specialists, and modern tertiary facilities dedicated to your health and well-being.',
    bgImage: '/Banner/banner-1.jpg',
    pills: [
      { icon: 'award', label: 'BMDC Certified' },
      { icon: 'shield', label: 'JCI Quality Care' },
      { icon: 'globe', label: 'ISO 9001:2015' },
    ],
  },
  {
    id: 'surgical-precision',
    badge: '24/7 Cardiac Cath Lab & Modular OTs',
    titlePrefix: 'Precision Surgical Suites',
    titleHighlight: 'Critical ICU',
    subtitle:
      'Minimally invasive robotic procedures, neuro-navigation theatres, and Level-3 intensive care backed by 120+ consultants.',
    bgImage: '/Banner/banner-2.jpg',
    pills: [
      { icon: 'award', label: '18 Modular OTs' },
      { icon: 'shield', label: '110+ ICU & NICU Beds' },
      { icon: 'globe', label: '24/7 Cath Lab' },
    ],
  },
  {
    id: 'rapid-diagnostics',
    badge: '3T MRI • 128-Slice CT • Automated Lab',
    titlePrefix: 'Rapid Lab Diagnostics',
    titleHighlight: 'Digital EMR',
    subtitle:
      'High-accuracy automated pathology and advanced imaging with online patient & doctor report portals in under 2 hours.',
    bgImage: '/Banner/banner-3.jpg',
    pills: [
      { icon: 'award', label: '450+ Lab Tests' },
      { icon: 'shield', label: '3T MRI & 128-CT' },
      { icon: 'globe', label: 'Online Reports' },
    ],
  },
  {
    id: 'emergency-trauma',
    badge: 'Emergency Hotline: 10678 • Always Open',
    titlePrefix: '24/7 Emergency Trauma',
    titleHighlight: 'Every Hour',
    subtitle:
      'Round-the-clock emergency response, mobile ICU ambulance fleet, and deluxe patient cabins designed for rapid recovery.',
    bgImage: '/Banner/banner-4.jpg',
    pills: [
      { icon: 'award', label: 'Hotline: 10678' },
      { icon: 'shield', label: 'Mobile ICU Fleet' },
      { icon: 'globe', label: '28+ Specialties' },
    ],
  },
];

export const HeroBanner: React.FC<HeroBannerProps> = ({
  onOpenPortals,
  onOpenAppointment,
}) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 5500);
    return () => clearInterval(timer);
  }, [isPaused]);

  const currentSlide = HERO_SLIDES[activeIndex];

  const renderPillIcon = (icon: 'award' | 'shield' | 'globe') => {
    const cls = 'w-3.5 h-3.5 text-emerald-300 shrink-0';
    if (icon === 'award') return <Award className={cls} />;
    if (icon === 'shield') return <ShieldCheck className={cls} />;
    return <Globe className={cls} />;
  };

  return (
    <section
      className="relative min-h-[460px] sm:min-h-[500px] lg:min-h-[520px] xl:min-h-[540px] flex flex-col justify-between overflow-hidden bg-[#003329]"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      aria-roledescription="carousel"
      aria-label="Hospital Highlights Carousel"
    >
      {/* ════════════════════ BACKGROUND PHOTO SLIDES ════════════════════ */}
      {HERO_SLIDES.map((slide, idx) => {
        const isActive = idx === activeIndex;
        return (
          <div
            key={slide.id}
            aria-hidden={!isActive}
            className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
              isActive ? 'opacity-100' : 'opacity-0 pointer-events-none'
            }`}
          >
            <img
              src={slide.bgImage}
              alt={slide.titlePrefix}
              className="w-full h-full object-cover object-top sm:object-[right_top] contrast-[1.03] saturate-[1.05]"
            />

            {/* Translucent System Green-to-Teal Left Tint */}
            <div
              className="hidden md:block absolute inset-0"
              style={{
                background:
                  'linear-gradient(90deg, rgba(0, 56, 44, 0.88) 0%, rgba(0, 92, 75, 0.72) 34%, rgba(0, 128, 152, 0.36) 52%, rgba(0, 148, 182, 0) 68%)',
              }}
            />
            {/* Mobile readability overlay */}
            <div
              className="md:hidden absolute inset-0"
              style={{
                background:
                  'linear-gradient(180deg, rgba(0, 56, 44, 0.86) 0%, rgba(0, 96, 86, 0.82) 100%)',
              }}
            />
          </div>
        );
      })}

      {/* Subtle Bottom Fade Into Page Background */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 h-14 sm:h-18 z-[5]"
        style={{
          background:
            'linear-gradient(180deg, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 0.5) 60%, #ffffff 100%)',
        }}
      />

      {/* ════════════════════ FOREGROUND LEFT CONTENT ════════════════════ */}
      <div className="relative z-10 w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 pt-10 lg:pt-12 pb-4 flex-1 flex items-center">
        <div className="max-w-[680px] space-y-4">
          {/* Top Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/15 backdrop-blur-sm border border-white/25 text-emerald-100 text-xs font-bold shadow-2xs">
            <Award className="w-3.5 h-3.5 text-amber-300 shrink-0" />
            <span>{currentSlide.badge}</span>
          </div>

          {/* 2-Line Crisp Headline */}
          <h1 className="text-3xl sm:text-4xl lg:text-[46px] font-black text-white tracking-tight leading-[1.14] drop-shadow-xs">
            {currentSlide.titlePrefix}
            <br />
            <span>
              {currentSlide.id === 'comprehensive-care' && 'Under '}
              {currentSlide.id === 'surgical-precision' && '& '}
              {currentSlide.id === 'rapid-diagnostics' && '& '}
              {currentSlide.id === 'emergency-trauma' && 'Care '}
              <span className="relative inline-block text-emerald-300">
                {currentSlide.titleHighlight}
                <svg
                  className="absolute left-0 -bottom-1.5 w-full h-3 text-cyan-300"
                  viewBox="0 0 220 14"
                  fill="none"
                  preserveAspectRatio="none"
                  aria-hidden="true"
                >
                  <path
                    d="M3 10.5C62 3.5 148 2.5 217 8.5"
                    stroke="currentColor"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                  />
                </svg>
              </span>
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-sm sm:text-[15.5px] text-white/90 leading-relaxed max-w-xl font-medium pt-1">
            {currentSlide.subtitle}
          </p>

          {/* Primary CTA Buttons */}
          <div className="pt-2 flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => onOpenAppointment({ visitType: 'opd' })}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-md bg-[#0094b6] hover:bg-[#00a4ca] text-white text-xs sm:text-sm font-extrabold shadow-lg shadow-cyan-950/30 border border-cyan-300/30 transition-colors cursor-pointer"
            >
              <Calendar className="w-4 h-4 text-cyan-100" />
              <span>Book Doctor Consultation</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={onOpenPortals}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-md bg-white hover:bg-emerald-50 text-[#006a4e] text-xs sm:text-sm font-extrabold shadow-md transition-colors cursor-pointer"
            >
              <UserCheck className="w-4 h-4 text-[#0094b6]" />
              <span>Patient Portal Login</span>
            </button>
          </div>

          {/* Clean Single-Row Trust Strip */}
          <div className="inline-flex flex-wrap items-center gap-x-4 gap-y-1.5 px-3.5 py-2 rounded-md bg-black/20 backdrop-blur-sm border border-white/15 text-xs font-semibold text-white/95">
            {currentSlide.pills.map((pill) => (
              <div key={pill.label} className="inline-flex items-center gap-1.5">
                {renderPillIcon(pill.icon)}
                <span>{pill.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ════════════════════ CAROUSEL DOTS ════════════════════ */}
      <div className="relative z-10 w-full pb-14 sm:pb-16 flex items-center justify-center gap-2">
        {HERO_SLIDES.map((slide, idx) => {
          const isActive = idx === activeIndex;
          return (
            <button
              key={slide.id}
              onClick={() => setActiveIndex(idx)}
              aria-label={`Go to slide ${idx + 1}: ${slide.titlePrefix}`}
              className={`h-2 rounded-full transition-all duration-300 cursor-pointer shadow-sm ${
                isActive
                  ? 'w-7 bg-emerald-400 ring-2 ring-white/80'
                  : 'w-2 bg-white/75 hover:bg-white'
              }`}
            />
          );
        })}
      </div>
    </section>
  );
};

export default HeroBanner;
