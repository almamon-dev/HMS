import React from 'react';
import { Calendar, ArrowRight, Phone } from 'lucide-react';

interface AppointmentSectionProps {
  onOpenAppointment: () => void;
}

export const AppointmentSection: React.FC<AppointmentSectionProps> = ({
  onOpenAppointment,
}) => {
  return (
    <section
      id="appointments"
      className="py-10 bg-slate-50 border-b border-slate-200/80"
    >
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-md bg-gradient-to-r from-[#006a4e] to-[#0094b6] p-6 sm:p-8 text-white shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white/15 text-emerald-100 text-[11px] font-bold uppercase tracking-wider">
              <Calendar className="w-3.5 h-3.5 text-cyan-200" />
              <span>Instant OPD & Telemedicine Serial</span>
            </span>

            <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight leading-snug">
              Need a Doctor Consultation or Health Checkup?
            </h2>

            <p className="text-xs sm:text-sm text-emerald-50/90 leading-relaxed">
              Book your specialist chamber slot, video consultation, or diagnostic package online in
              seconds—with instant serial confirmation.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={onOpenAppointment}
              className="px-5 py-3 rounded-md bg-white hover:bg-emerald-50 text-[#006a4e] text-xs sm:text-sm font-extrabold shadow-xs transition-colors flex items-center gap-2 cursor-pointer"
            >
              <Calendar className="w-4 h-4" />
              <span>Book Doctor Consultation</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <a
              href="tel:10678"
              className="px-4 py-3 rounded-md bg-white/15 hover:bg-white/25 border border-white/25 text-white text-xs sm:text-sm font-bold transition-colors flex items-center gap-2"
            >
              <Phone className="w-4 h-4 text-emerald-200" />
              <span>Hotline: 10678</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AppointmentSection;
