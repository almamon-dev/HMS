import React from 'react';
import { Award, BookOpen, Microscope, GraduationCap, CheckCircle2 } from 'lucide-react';

export const ResearchAwardsSection: React.FC = () => {
  const recognitionCards = [
    {
      name: 'Dr. Rehana Parveen, PhD',
      designation: 'Associate Professor of Oncology',
      achievement: 'Winner of BMDC Excellence Award 2026',
      paperTitle: 'Breakthrough Study on Targeted Gene Therapy in Solid Carcinomas',
      photo: 'https://images.unsplash.com/photo-1594824813501-4475510255c2?auto=format&fit=crop&w=400&q=80',
    },
    {
      name: 'Dr. Tanvir Ahmed, FCPS',
      designation: 'Senior Consultant, Interventional Cardiology',
      achievement: 'Global Young Investigator Fellowship Award',
      paperTitle: 'Novel Drug-Eluting Stent Outcomes in South Asian Diabetic Cohort',
      photo: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=400&q=80',
    },
    {
      name: 'Prof. Dr. Kabir Hossain, MS',
      designation: 'Chief of Neurosurgery & Spine Center',
      achievement: 'International Fellowship from Royal College of Surgeons',
      paperTitle: 'Minimally Invasive Endoscopic Brain Tumor Resection Protocol',
      photo: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&w=400&q=80',
    },
  ];

  return (
    <section id="research" className="bg-[#f2f8f5] py-14 border-b border-emerald-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Green Ribbon Header (matching screenshot) */}
        <div className="inline-block bg-[#006a4e] text-white px-5 py-2 rounded-2xl font-black text-sm uppercase tracking-wider mb-8 shadow-xs">
          Medical Research & Publications
        </div>

        {/* 3 Circular Research Counters (matching screenshot layout) */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12">
          <div className="bg-white rounded-3xl p-5 border border-emerald-200/70 shadow-xs flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-emerald-100 text-[#006a4e] flex items-center justify-center shrink-0 border border-emerald-200">
              <BookOpen className="w-7 h-7" />
            </div>
            <div>
              <div className="text-2xl font-black text-slate-900">250+</div>
              <div className="text-xs font-bold text-slate-600">PubMed & Scopus Papers</div>
              <div className="text-[10px] text-slate-400">Peer-reviewed clinical trials</div>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-5 border border-emerald-200/70 shadow-xs flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-teal-100 text-teal-800 flex items-center justify-center shrink-0 border border-teal-200">
              <Microscope className="w-7 h-7" />
            </div>
            <div>
              <div className="text-2xl font-black text-slate-900">120+</div>
              <div className="text-xs font-bold text-slate-600">Active Clinical Research</div>
              <div className="text-[10px] text-slate-400">Molecular & diagnostic labs</div>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-5 border border-emerald-200/70 shadow-xs flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-cyan-100 text-cyan-800 flex items-center justify-center shrink-0 border border-cyan-200">
              <GraduationCap className="w-7 h-7" />
            </div>
            <div>
              <div className="text-2xl font-black text-slate-900">Lancet & BMJ</div>
              <div className="text-xs font-bold text-slate-600">Tier-1 Journal Citations</div>
              <div className="text-[10px] text-slate-400">Global academic recognition</div>
            </div>
          </div>
        </div>

        {/* 3 Recognition / Congratulations Cards (Matching screenshot bottom certificates layout) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {recognitionCards.map((rec) => (
            <div
              key={rec.name}
              className="bg-white rounded-3xl p-6 border-2 border-emerald-600/30 shadow-md flex flex-col justify-between relative overflow-hidden group hover:border-[#006a4e] transition-all"
            >
              {/* Green Corner Crest */}
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-emerald-500/20 to-transparent rounded-bl-full pointer-events-none" />

              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[10px] font-black uppercase tracking-widest text-[#006a4e] bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                    Congratulations
                  </span>
                  <Award className="w-5 h-5 text-amber-500" />
                </div>

                {/* Circular Portrait with Green Ring */}
                <div className="w-24 h-24 rounded-full border-4 border-emerald-600 p-0.5 mx-auto mb-4 overflow-hidden shadow-md">
                  <img
                    src={rec.photo}
                    alt={rec.name}
                    className="w-full h-full object-cover rounded-full group-hover:scale-110 transition-transform duration-300"
                  />
                </div>

                <div className="text-center space-y-1 mb-4">
                  <h4 className="font-extrabold text-slate-900 text-sm">{rec.name}</h4>
                  <p className="text-[11px] font-semibold text-emerald-800">{rec.designation}</p>
                  <p className="text-[10px] font-bold text-amber-600">{rec.achievement}</p>
                </div>

                <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 text-[11px] text-slate-600 leading-snug">
                  <span className="font-bold text-slate-800">Published Article: </span>
                  "{rec.paperTitle}"
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] font-bold text-[#006a4e] flex items-center justify-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Verified Faculty Achievement</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};


export default ResearchAwardsSection;
