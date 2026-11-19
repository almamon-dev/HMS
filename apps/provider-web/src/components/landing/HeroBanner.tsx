import React from 'react';
import { Award, ShieldCheck, CheckCircle2, Calendar, ArrowRight } from 'lucide-react';

interface HeroBannerProps {
  onOpenPortals: () => void;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({ onOpenPortals }) => {
  return (
    <section className="relative bg-white border-b border-slate-200/80 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Column: Ranking & Institutional Accreditations (Matching screenshot layout) */}
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-[#006a4e] text-xs font-bold uppercase tracking-wider">
              <Award className="w-4 h-4 text-amber-500" />
              Clinical Healthcare Excellence & Quality 2026
            </div>

            <div className="bg-gradient-to-r from-emerald-50/80 via-white to-slate-50 border-2 border-emerald-600/30 rounded-3xl p-6 sm:p-8 shadow-xs relative overflow-hidden">
              <div className="flex flex-col sm:flex-row items-center gap-6">
                {/* Ranking Emblem (like the GUB Ranked 3rd circle in screenshot) */}
                <div className="w-32 h-32 rounded-full bg-gradient-to-tr from-[#006a4e] to-emerald-500 border-4 border-amber-400 flex flex-col items-center justify-center text-white text-center shadow-lg shrink-0">
                  <span className="text-[11px] font-extrabold uppercase tracking-widest text-emerald-100">
                    GCH RANKED
                  </span>
                  <span className="text-4xl font-black text-amber-300 leading-none my-0.5">
                    1st
                  </span>
                  <span className="text-[10px] font-bold text-white px-2 leading-tight">
                    In Bangladesh
                  </span>
                </div>

                <div className="text-center sm:text-left space-y-2">
                  <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight leading-snug">
                    Among Specialized Hospitals & Research Centers
                  </h2>
                  <p className="text-xs sm:text-sm font-semibold text-emerald-800">
                    Ranked <span className="text-amber-600 font-extrabold">Top 500 Globally</span> in Patient Safety & Clinical Outcomes
                  </p>
                </div>
              </div>

              {/* Accreditations Badges (matching green pills in screenshot) */}
              <div className="mt-6 pt-5 border-t border-emerald-100 grid grid-cols-3 gap-2 text-center">
                <div className="bg-[#006a4e] text-white py-1.5 px-2 rounded-xl text-[11px] font-bold shadow-xs">
                  BMDC Certified
                </div>
                <div className="bg-[#007a53] text-white py-1.5 px-2 rounded-xl text-[11px] font-bold shadow-xs">
                  JCI Quality Care
                </div>
                <div className="bg-[#008f5d] text-white py-1.5 px-2 rounded-xl text-[11px] font-bold shadow-xs">
                  ISO 9001:2015
                </div>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <a
                href="#appointments"
                className="px-6 py-3.5 bg-[#006a4e] hover:bg-[#00553e] text-white text-sm font-bold rounded-2xl shadow-md shadow-emerald-900/20 transition-all flex items-center gap-2 cursor-pointer"
              >
                <Calendar className="w-4 h-4 text-emerald-300" />
                <span>Book Doctor Consultation</span>
                <ArrowRight className="w-4 h-4" />
              </a>

              <button
                onClick={onOpenPortals}
                className="px-5 py-3.5 bg-white hover:bg-slate-50 border-2 border-slate-200 text-slate-800 text-sm font-bold rounded-2xl transition-all flex items-center gap-2 cursor-pointer shadow-xs"
              >
                <ShieldCheck className="w-4 h-4 text-teal-600" />
                <span>Role Login Portals</span>
              </button>
            </div>
          </div>

          {/* Right Column: High Quality Network Photo of Hospital Campus */}
          <div className="lg:col-span-6 relative">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white aspect-16/10">
              <img
                src="https://images.unsplash.com/photo-1586773860418-d37222d8fce3?auto=format&fit=crop&w=1200&q=80"
                alt="Green Care Hospital & Medical Research Campus"
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent flex flex-col justify-end p-6 text-white">
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-xs font-bold tracking-wider text-emerald-300 uppercase">
                    Main Clinical Campus • Dhaka
                  </span>
                </div>
                <h3 className="text-lg sm:text-xl font-bold">
                  State-of-the-Art 500-Bed Tertiary Care Medical Facility
                </h3>
              </div>
            </div>

            {/* Floating Trust Badge */}
            <div className="absolute -bottom-4 -left-4 bg-white/95 backdrop-blur-md border border-slate-200/90 rounded-2xl p-3.5 shadow-xl flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-[#006a4e] flex items-center justify-center font-bold">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div>
                <div className="text-xs font-black text-slate-900">99.4% Survival & Cure</div>
                <div className="text-[10px] text-slate-500 font-medium">Critical Care & Surgery Benchmark</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroBanner;
