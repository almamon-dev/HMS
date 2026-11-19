import React from 'react';

interface FloatingSideTabsProps {
  onOpenAppointment: () => void;
}

export const FloatingSideTabs: React.FC<FloatingSideTabsProps> = ({
  onOpenAppointment,
}) => {
  return (
    <div
      className="fixed right-0 top-1/2 -translate-y-1/2 z-40 flex flex-col gap-1 items-end select-none pointer-events-auto"
      role="complementary"
      aria-label="Quick Access Floating Tabs"
    >
      {/* ════════════════════ TOP TAB: Hotline Number (Replaces 'Waiver' from screenshot) ════════════════════ */}
      <a
        href="tel:10678"
        className="bg-[#f7c000] hover:bg-[#eab308] text-slate-900 font-extrabold text-[12px] sm:text-[13px] tracking-wider py-4 px-2 sm:px-2.5 rounded-l-lg shadow-lg hover:-translate-x-1.5 transition-all duration-200 flex items-center justify-center [writing-mode:vertical-rl] rotate-180 border-t border-b border-l border-amber-400/80 cursor-pointer active:scale-95"
        title="Emergency 24/7 Hotline: 10678"
        aria-label="Call Hospital Hotline 10678"
      >
        Hotline: 10678
      </a>

      {/* ════════════════════ BOTTOM TAB: Online Appointment (Replaces 'Online Admission' from screenshot) ════════════════════ */}
      <button
        onClick={onOpenAppointment}
        className="bg-[#f7c000] hover:bg-[#eab308] text-slate-900 font-extrabold text-[12px] sm:text-[13px] tracking-wider py-5 px-2 sm:px-2.5 rounded-l-lg shadow-lg hover:-translate-x-1.5 transition-all duration-200 flex items-center justify-center [writing-mode:vertical-rl] rotate-180 border-t border-b border-l border-amber-400/80 cursor-pointer active:scale-95"
        title="Book Online Doctor Appointment"
        aria-label="Book Online Doctor Appointment"
      >
        Online Appointment
      </button>
    </div>
  );
};

export default FloatingSideTabs;

