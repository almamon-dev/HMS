import React from 'react';
import { Phone, Calendar } from 'lucide-react';

interface FloatingSideTabsProps {
  onOpenAppointment: () => void;
}

export const FloatingSideTabs: React.FC<FloatingSideTabsProps> = ({
  onOpenAppointment,
}) => {
  return (
    <div
      className="fixed right-0 top-[38%] -translate-y-1/2 z-40 flex flex-col gap-2 items-end select-none pointer-events-auto"
      role="complementary"
      aria-label="Quick Access Floating Tabs"
    >
      {/* ════════════════════ TOP TAB: Emergency Hotline (Running Glowing Border) ════════════════════ */}
      <a
        href="tel:10678"
        className="group relative overflow-hidden p-[2px] pr-0 w-9 sm:w-10 hover:w-10 sm:hover:w-11 rounded-l-xl bg-emerald-300/30 shadow-lg shadow-emerald-950/30 transition-all duration-200 cursor-pointer active:scale-95"
        title="Emergency 24/7 Hotline: 10678"
        aria-label="Call Hospital Hotline 10678"
      >
        {/* Animated running border beam */}
        <span
          aria-hidden="true"
          className="absolute inset-0 flex items-center justify-center pointer-events-none"
        >
          <span
            className="w-[260px] h-[260px] shrink-0 animate-[spin_2.8s_linear_infinite]"
            style={{
              background:
                'conic-gradient(from 0deg, transparent 0deg 235deg, #34d399 285deg, #ffffff 325deg, #6ee7b7 355deg, transparent 360deg)',
            }}
          />
        </span>

        {/* Inner surface */}
        <span className="relative z-10 w-full py-3.5 bg-[#006a4e] group-hover:bg-[#00553e] text-white rounded-l-[10px] flex flex-col items-center justify-center gap-2 transition-colors">
          <span className="w-2 h-2 rounded-full bg-rose-400 animate-pulse shrink-0" />
          <span className="[writing-mode:vertical-rl] rotate-180 font-bold text-[11px] sm:text-[12px] tracking-wider whitespace-nowrap">
            Hotline: 10678
          </span>
          <Phone className="w-3.5 h-3.5 text-emerald-200 shrink-0 group-hover:scale-110 transition-transform" />
        </span>
      </a>

      {/* ════════════════════ BOTTOM TAB: Online Appointment (Running Glowing Border) ════════════════════ */}
      <button
        onClick={onOpenAppointment}
        className="group relative overflow-hidden p-[2px] pr-0 w-9 sm:w-10 hover:w-10 sm:hover:w-11 rounded-l-xl bg-cyan-300/30 shadow-lg shadow-cyan-950/30 transition-all duration-200 cursor-pointer active:scale-95"
        title="Book Online Doctor Appointment"
        aria-label="Book Online Doctor Appointment"
      >
        {/* Animated running border beam */}
        <span
          aria-hidden="true"
          className="absolute inset-0 flex items-center justify-center pointer-events-none"
        >
          <span
            className="w-[280px] h-[280px] shrink-0 animate-[spin_2.8s_linear_infinite]"
            style={{
              background:
                'conic-gradient(from 180deg, transparent 0deg 235deg, #22d3ee 285deg, #ffffff 325deg, #67e8f9 355deg, transparent 360deg)',
            }}
          />
        </span>

        {/* Inner surface */}
        <span className="relative z-10 w-full py-4 bg-[#0094b6] group-hover:bg-[#007a96] text-white rounded-l-[10px] flex flex-col items-center justify-center gap-2 transition-colors">
          <span className="[writing-mode:vertical-rl] rotate-180 font-bold text-[11px] sm:text-[12px] tracking-wider whitespace-nowrap">
            Online Appointment
          </span>
          <Calendar className="w-3.5 h-3.5 text-cyan-100 shrink-0 group-hover:scale-110 transition-transform" />
        </span>
      </button>
    </div>
  );
};

export default FloatingSideTabs;
