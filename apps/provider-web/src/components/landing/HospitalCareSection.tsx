import React from 'react';
import { Heart, ArrowRight } from 'lucide-react';

export const HospitalCareSection: React.FC = () => {
  return (
    <section id="facilities" className="py-16 bg-[#f7faf8] border-b border-emerald-100/70">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-10 text-center sm:text-left">
          <div className="text-xs font-bold text-[#006a4e] uppercase tracking-wider mb-1 flex items-center justify-center sm:justify-start gap-1.5">
            <Heart className="w-4 h-4 text-rose-500 fill-rose-500" />
            Comfort & Patient Dignity
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Hospital Facilities & Patient Life
          </h2>
          <p className="text-slate-500 text-xs sm:text-sm mt-1">
            Healing environments designed to minimize hospital stress and maximize speedy recovery.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Left Column: Big Feature Image (like the students in the screenshot) */}
          <div className="lg:col-span-5 relative rounded-3xl overflow-hidden shadow-lg border-2 border-white group">
            <img
              src="https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?auto=format&fit=crop&w=800&q=80"
              alt="Caring Nursing & Patient Support"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 min-h-[350px]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent flex flex-col justify-end p-6 text-white">
              <span className="text-xs font-bold text-emerald-300 uppercase tracking-wider mb-1">
                24/7 Compassionate Care
              </span>
              <h3 className="text-lg font-bold">
                1-on-1 Dedicated Nursing & Bedside Monitoring
              </h3>
              <p className="text-xs text-slate-300 mt-1">
                Our nursing team is certified in BLS, ACLS and pediatric trauma support.
              </p>
            </div>
          </div>

          {/* Right Column: 2 Facility Cards (matching screenshot layout) */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
              <div>
                <div className="rounded-2xl overflow-hidden aspect-16/10 mb-4 border border-slate-100">
                  <img
                    src="https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=600&q=80"
                    alt="Doctor Consultation Chamber"
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <span className="text-[10px] font-bold text-[#006a4e] bg-emerald-50 px-2 py-0.5 rounded-full">
                  Doctor Chambers
                </span>
                <h4 className="font-bold text-slate-900 text-sm mt-2 mb-1">
                  Spacious OPD Consultation Suites
                </h4>
                <p className="text-slate-500 text-xs leading-relaxed">
                  Private doctor chambers equipped with automated digital vitals, electronic prescription generators, and patient confidentiality.
                </p>
              </div>
              <div className="pt-3 mt-3 border-t border-slate-100 text-xs font-bold text-[#006a4e] flex items-center justify-between">
                <span>View Chamber Directory</span>
                <ArrowRight className="w-4 h-4" />
              </div>
            </div>

            <div className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
              <div>
                <div className="rounded-2xl overflow-hidden aspect-16/10 mb-4 border border-slate-100">
                  <img
                    src="https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=600&q=80"
                    alt="Modern Inpatient Deluxe Ward"
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <span className="text-[10px] font-bold text-cyan-800 bg-cyan-50 px-2 py-0.5 rounded-full">
                  Deluxe Inpatient
                </span>
                <h4 className="font-bold text-slate-900 text-sm mt-2 mb-1">
                  Air-Conditioned Cabins & VIP Suites
                </h4>
                <p className="text-slate-500 text-xs leading-relaxed">
                  Inpatient rooms with motorized hospital beds, attendant accommodation, nurse call systems, and hygienic dietary meal service.
                </p>
              </div>
              <div className="pt-3 mt-3 border-t border-slate-100 text-xs font-bold text-[#006a4e] flex items-center justify-between">
                <span>Cabin Booking Details</span>
                <ArrowRight className="w-4 h-4" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HospitalCareSection;
