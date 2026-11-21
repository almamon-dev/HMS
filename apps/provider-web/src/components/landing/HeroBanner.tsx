import {
  Ambulance,
  Bed,
  Calendar,
  ChevronDown,
  ClipboardCheck,
  FlaskConical,
  Search,
  Stethoscope,
  Users
} from 'lucide-react';
import React, { useEffect, useState } from 'react';
import {
  AppointmentBookingContext,
  DEPARTMENT_DOCTORS
} from '../../data/appointmentData';

interface HeroBannerProps {
  onOpenPortals?: () => void;
  onOpenAppointment: (context?: AppointmentBookingContext) => void;
}

interface BannerSlide {
  id: string;
  badge: string;
  title: string;
  subtitle: string;
  image: string;
}

const BANNER_SLIDES: BannerSlide[] = [
  {
    id: 'slide-building',
    badge: 'TRUSTED MULTISPECIALITY HOSPITAL',
    title: 'Comprehensive Healthcare for You and Your Family',
    subtitle:
      'World-class treatment, experienced specialists and modern facilities dedicated to your health and well-being.',
    image: '/Banner/banner-1.jpg',
  },
  {
    id: 'slide-inpatient',
    badge: '24/7 INPATIENT & CRITICAL CARE',
    title: 'Compassionate Care Backed by Modern Medical Science',
    subtitle:
      'Dedicated nursing, round-the-clock intensive care, and personalized bedside monitoring for faster recovery.',
    image: '/Banner/banner-2.jpg',
  },
  {
    id: 'slide-lobby',
    badge: 'WORLD-CLASS OUTPATIENT FACILITIES',
    title: 'State-of-the-Art Hospital Environment & Rapid Services',
    subtitle:
      'Seamless digital registration, comfortable patient lounges, and rapid automated diagnostic results.',
    image: '/Banner/banner-3.jpg',
  },
  {
    id: 'slide-consultation',
    badge: 'LEADING SPECIALIST CONSULTANTS',
    title: 'Expert Doctors Listening to Every Detail of Your Health',
    subtitle:
      'Book appointments with over 120+ senior professors and consultants across all major clinical disciplines.',
    image: '/Banner/banner-4.jpg',
  },
];

type BottomTab = 'appointment' | 'doctor' | 'prices' | 'checkup';

export const HeroBanner: React.FC<HeroBannerProps> = ({
  onOpenPortals: _onOpenPortals,
  onOpenAppointment,
}) => {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Search & Booking card state
  const [activeTab, setActiveTab] = useState<BottomTab>('appointment');
  const [selectedDept, setSelectedDept] = useState('');
  const [selectedDoctor, setSelectedDoctor] = useState('');
  const [selectedDate, setSelectedDate] = useState('');

  // Auto-cycle through the 4 photos
  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      setCurrentSlideIndex((prev) => (prev + 1) % BANNER_SLIDES.length);
    }, 5500);
    return () => clearInterval(interval);
  }, [isPaused]);

  const activeSlide = BANNER_SLIDES[currentSlideIndex];

  // Department list
  const departments = Object.keys(DEPARTMENT_DOCTORS);

  // Filtered doctors by selected department
  const availableDoctors = selectedDept
    ? DEPARTMENT_DOCTORS[selectedDept] || []
    : Object.values(DEPARTMENT_DOCTORS).flat();

  const handleSearch = () => {
    onOpenAppointment({
      visitType: activeTab === 'prices' || activeTab === 'checkup' ? 'diagnostic' : 'opd',
      department: selectedDept || undefined,
      doctorName: selectedDoctor || undefined,
      date: selectedDate || undefined,
      packageName: activeTab === 'checkup' ? 'Executive Health Checkup Package' : undefined,
    });
  };

  const handleTabClick = (tab: BottomTab) => {
    setActiveTab(tab);
    if (tab === 'prices') {
      onOpenAppointment({ visitType: 'diagnostic' });
    } else if (tab === 'checkup') {
      onOpenAppointment({ visitType: 'diagnostic', packageName: 'Executive Health Checkup Package' });
    }
  };

  return (
    <div
      className="relative w-full bg-[#f0f7f9] select-none font-['Plus_Jakarta_Sans',sans-serif]"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* ════════════════════ HERO BANNER MAIN AREA ════════════════════ */}
      <div className="relative min-h-[500px] sm:min-h-[540px] lg:min-h-[580px] xl:min-h-[600px] flex items-center overflow-hidden">
        {/* Background Images with Crossfade */}
        {BANNER_SLIDES.map((slide, idx) => {
          const isActive = idx === currentSlideIndex;
          return (
            <div
              key={slide.id}
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                isActive ? 'opacity-100' : 'opacity-0 pointer-events-none'
              }`}
            >
              <img
                src={slide.image}
                alt={slide.title}
                className="w-full h-full object-cover object-right md:object-center"
              />
            </div>
          );
        })}

        {/* ── Soft Hospital Light-Ice-Blue / White Opacity Overlay on Left matching Mockup ── */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'linear-gradient(90deg, #f0f7f9 0%, #f0f7f9 35%, rgba(240, 247, 249, 0.96) 48%, rgba(240, 247, 249, 0.78) 62%, rgba(240, 247, 249, 0.25) 78%, rgba(240, 247, 249, 0) 90%)',
          }}
        />

        {/* Subtle geometric cut accent in top-left matching reference image */}
        <div
          className="hidden lg:block absolute left-0 top-0 bottom-0 w-[42%] pointer-events-none opacity-40"
          style={{
            background:
              'linear-gradient(135deg, rgba(255, 255, 255, 0.8) 0%, rgba(224, 242, 247, 0.4) 60%, transparent 100%)',
          }}
        />

        {/* Mobile Full Fade Overlay */}
        <div
          className="md:hidden absolute inset-0 pointer-events-none"
          style={{
            background:
              'linear-gradient(180deg, rgba(240, 247, 249, 0.98) 0%, rgba(240, 247, 249, 0.92) 65%, rgba(240, 247, 249, 0.7) 100%)',
          }}
        />

        {/* ════════════════════ FOREGROUND LEFT TEXT CONTENT ════════════════════ */}
        <div className="relative z-10 w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
          <div className="max-w-[680px] lg:max-w-[720px] space-y-4 sm:space-y-5">
            {/* Top Subtitle / Tag */}
            <div className="text-[11px] sm:text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-1.5">
              <span>{activeSlide.badge}</span>
            </div>

            {/* Main Headline (Exact phrasing & proportions from reference image) */}
            <h1 className="text-3xl sm:text-4xl lg:text-[44px] xl:text-[46px] font-black text-[#0c2e4b] tracking-tight leading-[1.12]">
              {activeSlide.title}
            </h1>

            {/* Subtitle description */}
            <p className="text-sm sm:text-[15px] text-slate-600 leading-relaxed font-medium max-w-xl">
              {activeSlide.subtitle}
            </p>

            {/* Primary Action Buttons */}
            <div className="pt-1 flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => onOpenAppointment({ visitType: 'opd' })}
                className="px-5 sm:px-6 py-2.5 sm:py-3 rounded-[4px] bg-[#006a4e] hover:bg-[#00553e] text-white text-xs sm:text-sm font-bold flex items-center gap-2 shadow-xs transition-colors cursor-pointer"
              >
                <Calendar className="w-4 h-4 text-emerald-200" />
                <span>Book Appointment</span>
              </button>

              <button
                type="button"
                onClick={() => onOpenAppointment({ visitType: 'opd' })}
                className="px-5 sm:px-6 py-2.5 sm:py-3 rounded-[4px] bg-white hover:bg-slate-50 text-[#0c2e4b] border border-slate-300 text-xs sm:text-sm font-bold flex items-center gap-2 shadow-2xs transition-colors cursor-pointer"
              >
                <Stethoscope className="w-4 h-4 text-[#006a4e]" />
                <span>Find a Doctor</span>
              </button>
            </div>

            {/* 4 Key Feature Metrics with Icons (24/7 Emergency, Advanced Diagnostics, Expert Doctors, Inpatient & ICU Care) */}
            <div className="pt-3 sm:pt-4 grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 border-t border-slate-300/60 max-w-xl">
              {/* Feature 1 */}
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-full bg-emerald-100/70 text-[#006a4e] flex items-center justify-center shrink-0">
                  <Ambulance className="w-5 h-5 stroke-[2]" />
                </div>
                <div className="leading-tight">
                  <span className="font-extrabold text-slate-900 text-xs sm:text-[13px] block">
                    24/7
                  </span>
                  <span className="font-semibold text-slate-600 text-[11px] block">
                    Emergency
                  </span>
                </div>
              </div>

              {/* Feature 2 */}
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-full bg-emerald-100/70 text-[#006a4e] flex items-center justify-center shrink-0">
                  <FlaskConical className="w-5 h-5 stroke-[2]" />
                </div>
                <div className="leading-tight">
                  <span className="font-extrabold text-slate-900 text-xs sm:text-[13px] block">
                    Advanced
                  </span>
                  <span className="font-semibold text-slate-600 text-[11px] block">
                    Diagnostics
                  </span>
                </div>
              </div>

              {/* Feature 3 */}
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-full bg-emerald-100/70 text-[#006a4e] flex items-center justify-center shrink-0">
                  <Users className="w-5 h-5 stroke-[2]" />
                </div>
                <div className="leading-tight">
                  <span className="font-extrabold text-slate-900 text-xs sm:text-[13px] block">
                    Expert
                  </span>
                  <span className="font-semibold text-slate-600 text-[11px] block">
                    Doctors
                  </span>
                </div>
              </div>

              {/* Feature 4 */}
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-full bg-emerald-100/70 text-[#006a4e] flex items-center justify-center shrink-0">
                  <Bed className="w-5 h-5 stroke-[2]" />
                </div>
                <div className="leading-tight">
                  <span className="font-extrabold text-slate-900 text-xs sm:text-[13px] block">
                    Inpatient
                  </span>
                  <span className="font-semibold text-slate-600 text-[11px] block">
                    &amp; ICU Care
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Carousel Navigation Dots (Bottom Right) */}
        <div className="absolute right-6 sm:right-10 bottom-16 sm:bottom-20 z-20 flex items-center gap-2">
          {BANNER_SLIDES.map((slide, idx) => {
            const isActive = idx === currentSlideIndex;
            return (
              <button
                key={slide.id}
                onClick={() => setCurrentSlideIndex(idx)}
                aria-label={`Go to slide ${idx + 1}`}
                className={`transition-all duration-300 cursor-pointer rounded-full ${
                  isActive
                    ? 'w-6 h-2 bg-[#006a4e]'
                    : 'w-2 h-2 bg-slate-300 hover:bg-slate-400'
                }`}
              />
            );
          })}
        </div>
      </div>

      {/* ════════════════════ 3) FLOATING SEARCH & BOOKING CARD AT BOTTOM ════════════════════ */}
      <div className="relative z-20 max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 -mt-8 sm:-mt-10 lg:-mt-12 pb-8 sm:pb-10">
        <div className="bg-white rounded-[6px] sm:rounded-lg shadow-xl border border-slate-200/90 p-2 sm:p-2.5 flex flex-wrap xl:flex-nowrap items-center justify-between gap-3">
          {/* Left Service Tabs (Pills) */}
          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
            {/* Tab 1: Book Appointment */}
            <button
              type="button"
              onClick={() => handleTabClick('appointment')}
              className={`px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-[4px] text-xs sm:text-[13px] font-bold flex items-center gap-2 transition-all cursor-pointer ${
                activeTab === 'appointment'
                  ? 'bg-[#006a4e] text-white shadow-xs'
                  : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200/80'
              }`}
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Book Appointment</span>
            </button>

            {/* Tab 2: Find a Doctor */}
            <button
              type="button"
              onClick={() => handleTabClick('doctor')}
              className={`px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-[4px] text-xs sm:text-[13px] font-bold flex items-center gap-2 transition-all cursor-pointer ${
                activeTab === 'doctor'
                  ? 'bg-[#006a4e] text-white shadow-xs'
                  : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200/80'
              }`}
            >
              <Stethoscope className="w-3.5 h-3.5" />
              <span>Find a Doctor</span>
            </button>

            {/* Tab 3: Test Prices */}
            <button
              type="button"
              onClick={() => handleTabClick('prices')}
              className={`px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-[4px] text-xs sm:text-[13px] font-bold flex items-center gap-2 transition-all cursor-pointer ${
                activeTab === 'prices'
                  ? 'bg-[#006a4e] text-white shadow-xs'
                  : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200/80'
              }`}
            >
              <FlaskConical className="w-3.5 h-3.5" />
              <span>Test Prices</span>
            </button>

            {/* Tab 4: Health Checkup */}
            <button
              type="button"
              onClick={() => handleTabClick('checkup')}
              className={`px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-[4px] text-xs sm:text-[13px] font-bold flex items-center gap-2 transition-all cursor-pointer ${
                activeTab === 'checkup'
                  ? 'bg-[#006a4e] text-white shadow-xs'
                  : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200/80'
              }`}
            >
              <ClipboardCheck className="w-3.5 h-3.5" />
              <span>Health Checkup</span>
            </button>
          </div>

          {/* Vertical Divider */}
          <div className="hidden xl:block h-9 w-px bg-slate-200" />

          {/* Right Form Dropdowns & Search Button */}
          <div className="w-full xl:w-auto flex-1 flex flex-wrap sm:flex-nowrap items-center gap-2.5 sm:gap-3">
            {/* Department Dropdown */}
            <div className="w-full sm:w-auto flex-1 min-w-[140px] px-2.5 py-1 rounded bg-slate-50 border border-slate-200/90 hover:border-slate-300">
              <label className="block text-[9.5px] font-bold text-slate-500 uppercase tracking-wider leading-none mb-0.5">
                Department
              </label>
              <div className="relative flex items-center">
                <select
                  value={selectedDept}
                  onChange={(e) => {
                    setSelectedDept(e.target.value);
                    setSelectedDoctor('');
                  }}
                  className="w-full appearance-none bg-transparent pr-5 text-xs font-bold text-slate-800 cursor-pointer focus:outline-hidden"
                >
                  <option value="">Select Department</option>
                  {departments.map((dept) => (
                    <option key={dept} value={dept}>
                      {dept}
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-0 pointer-events-none" />
              </div>
            </div>

            {/* Doctor Dropdown */}
            <div className="w-full sm:w-auto flex-1 min-w-[140px] px-2.5 py-1 rounded bg-slate-50 border border-slate-200/90 hover:border-slate-300">
              <label className="block text-[9.5px] font-bold text-slate-500 uppercase tracking-wider leading-none mb-0.5">
                Doctor
              </label>
              <div className="relative flex items-center">
                <select
                  value={selectedDoctor}
                  onChange={(e) => setSelectedDoctor(e.target.value)}
                  className="w-full appearance-none bg-transparent pr-5 text-xs font-bold text-slate-800 cursor-pointer focus:outline-hidden"
                >
                  <option value="">Select Doctor</option>
                  {availableDoctors.map((doc, idx) => (
                    <option key={`${doc.name}-${idx}`} value={doc.name}>
                      {doc.name}
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-0 pointer-events-none" />
              </div>
            </div>

            {/* Date Picker */}
            <div className="w-full sm:w-auto flex-1 min-w-[130px] px-2.5 py-1 rounded bg-slate-50 border border-slate-200/90 hover:border-slate-300">
              <label className="block text-[9.5px] font-bold text-slate-500 uppercase tracking-wider leading-none mb-0.5">
                Date
              </label>
              <div className="relative flex items-center">
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-full bg-transparent text-xs font-bold text-slate-800 cursor-pointer focus:outline-hidden"
                />
              </div>
            </div>

            {/* Search Button */}
            <button
              type="button"
              onClick={handleSearch}
              className="w-full sm:w-auto px-5 py-2.5 rounded-[4px] bg-[#006a4e] hover:bg-[#00553e] text-white text-xs sm:text-sm font-bold flex items-center justify-center gap-1.5 shadow-xs transition-colors cursor-pointer shrink-0"
            >
              <Search className="w-4 h-4" />
              <span>Search</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroBanner;
