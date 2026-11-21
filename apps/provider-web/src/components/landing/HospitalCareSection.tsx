import React from 'react';
import { Heart, ArrowRight } from 'lucide-react';

export const HospitalCareSection: React.FC = () => {
  return (
    <section id="facilities" className="py-14 bg-white border-b border-slate-200/80">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8 text-center sm:text-left">
          <div className="text-xs font-bold text-[#006a4e] mb-1 flex items-center justify-center sm:justify-start gap-1.5">
            <Heart className="w-4 h-4 text-[#0094b6]" />
            <span>Comfort & Patient Dignity</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Hospital Facilities & Patient Life
          </h2>
          <p className="text-slate-600 text-xs sm:text-sm mt-1">
            Healing environments designed to minimize hospital stress and maximize speedy recovery.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
          {/* Left Column: Featured Nursing Support Image */}
          <div className="lg:col-span-5 relative rounded-md overflow-hidden border border-emerald-200/70 shadow-xs group">
            <img
              src="https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?auto=format&fit=crop&w=800&q=80"
              alt="Caring Nursing & Patient Support"
              className="w-full h-full object-cover min-h-[340px]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#002d22]/90 via-[#002d22]/25 to-transparent flex flex-col justify-end p-6 text-white">
              <span className="text-xs font-bold text-emerald-300 mb-1">
                24/7 Compassionate Care
              </span>
              <h3 className="text-lg font-extrabold leading-snug">
                1-on-1 Dedicated Nursing & Bedside Monitoring
              </h3>
              <p className="text-xs text-slate-200 mt-1">
                Our nursing team is certified in BLS, ACLS and pediatric trauma support.
              </p>
            </div>
          </div>

          {/* Right Column: 2 Facility Cards (rounded-md matching system cards) */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-white rounded-md p-5 border border-emerald-200/70 shadow-xs flex flex-col justify-between">
              <div>
                <div className="rounded-md overflow-hidden aspect-16/10 mb-4 border border-slate-100">
                  <img
                    src="https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=600&q=80"
                    alt="Doctor Consultation Chamber"
                    className="w-full h-full object-cover"
                  />
                </div>
                <span className="inline-block text-[10px] font-bold text-[#006a4e] bg-[#006a4e]/10 px-2.5 py-1 rounded-md">
                  Doctor Chambers
                </span>
                <h4 className="font-extrabold text-slate-900 text-sm mt-2.5 mb-1">
                  Spacious OPD Consultation Suites
                </h4>
                <p className="text-slate-600 text-xs leading-relaxed">
                  Private doctor chambers equipped with automated digital vitals, electronic
                  prescription generators, and patient confidentiality.
                </p>
              </div>
              <div className="pt-3 mt-4 border-t border-slate-100 text-xs font-bold text-[#006a4e] flex items-center justify-between">
                <span>View Chamber Directory</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>

            <div className="bg-white rounded-md p-5 border border-emerald-200/70 shadow-xs flex flex-col justify-between">
              <div>
                <div className="rounded-md overflow-hidden aspect-16/10 mb-4 border border-slate-100">
                  <img
                    src="https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=600&q=80"
                    alt="Modern Inpatient Deluxe Ward"
                    className="w-full h-full object-cover"
                  />
                </div>
                <span className="inline-block text-[10px] font-bold text-[#0094b6] bg-[#0094b6]/10 px-2.5 py-1 rounded-md">
                  Deluxe Inpatient
                </span>
                <h4 className="font-extrabold text-slate-900 text-sm mt-2.5 mb-1">
                  Air-Conditioned Cabins & VIP Suites
                </h4>
                <p className="text-slate-600 text-xs leading-relaxed">
                  Inpatient rooms with motorized hospital beds, attendant accommodation, nurse call
                  systems, and hygienic dietary meal service.
                </p>
              </div>
              <div className="pt-3 mt-4 border-t border-slate-100 text-xs font-bold text-[#006a4e] flex items-center justify-between">
                <span>Cabin Booking Details</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HospitalCareSection;
