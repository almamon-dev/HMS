import React from 'react';
import { Award, BookOpen, ArrowUpRight } from 'lucide-react';

export const ResearchAwardsSection: React.FC = () => {
  const publications = [
    {
      journal: 'Oncology • PubMed Indexed',
      year: '2026',
      paperTitle: 'Targeted Gene Therapy Outcomes in Solid Carcinomas',
      summary:
        'Multi-center clinical trial evaluating precision biomarker response rates in Stage II–III patients.',
      author: 'Dr. Rehana Parveen, PhD',
      designation: 'Associate Professor of Oncology',
      photo:
        'https://images.unsplash.com/photo-1594824476967-48c8b964273f?auto=format&fit=crop&w=400&q=80',
      accent: 'green' as const,
    },
    {
      journal: 'Cardiology • BMJ Open',
      year: '2026',
      paperTitle: 'Drug-Eluting Stent Outcomes in South Asian Diabetic Cohort',
      summary:
        '3-year follow-up study across 420 interventional cardiology cases with 98.6% vessel patency.',
      author: 'Dr. Tanvir Ahmed, FCPS',
      designation: 'Senior Consultant, Interventional Cardiology',
      photo:
        'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=400&q=80',
      accent: 'teal' as const,
    },
    {
      journal: 'Neurosurgery • Clinical Study',
      year: '2026',
      paperTitle: 'Minimally Invasive Endoscopic Brain Tumor Resection Protocol',
      summary:
        'Neuro-navigation guided microsurgical workflow reducing post-op ICU recovery duration by 35%.',
      author: 'Prof. Dr. Kabir Hossain, MS',
      designation: 'Chief of Neurosurgery & Spine Center',
      photo:
        'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&w=400&q=80',
      accent: 'green' as const,
    },
  ];

  return (
    <section id="research" className="bg-white py-14 border-b border-slate-200/80">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header with Compact Inline Research Metrics */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-8 gap-4">
          <div>
            <div className="text-xs font-bold text-[#006a4e] uppercase tracking-wider mb-1 flex items-center gap-1.5">
              <Award className="w-4 h-4 text-[#0094b6]" />
              <span>Academic Excellence</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Medical Research & Publications
            </h2>
            <p className="text-slate-600 text-xs sm:text-sm mt-1">
              Peer-reviewed clinical studies and medical breakthroughs led by our senior faculty.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 text-xs font-bold">
            <span className="px-3 py-1.5 rounded-md bg-white border border-emerald-200/80 text-slate-800 shadow-2xs">
              <span className="text-[#006a4e] font-black">250+</span> PubMed Papers
            </span>
            <span className="px-3 py-1.5 rounded-md bg-white border border-emerald-200/80 text-slate-800 shadow-2xs">
              <span className="text-[#0094b6] font-black">120+</span> Clinical Trials
            </span>
            <span className="px-3 py-1.5 rounded-md bg-white border border-emerald-200/80 text-slate-800 shadow-2xs">
              <span className="text-[#006a4e] font-black">Lancet & BMJ</span> Indexed
            </span>
          </div>
        </div>

        {/* Single Row of 3 Clean Research Publication Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {publications.map((pub) => {
            const isGreen = pub.accent === 'green';
            return (
              <div
                key={pub.paperTitle}
                className="group bg-white rounded-md p-5 border border-emerald-200/70 shadow-xs hover:shadow-md hover:border-[#0094b6]/40 transition-all duration-200 flex flex-col justify-between gap-4"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <span
                      className={`inline-flex items-center gap-1.5 text-[10px] font-bold px-2.5 py-1 rounded-md ${
                        isGreen
                          ? 'text-[#006a4e] bg-[#006a4e]/10'
                          : 'text-[#0094b6] bg-[#0094b6]/10'
                      }`}
                    >
                      <BookOpen className="w-3 h-3" />
                      <span>{pub.journal}</span>
                    </span>
                    <span className="text-[11px] font-bold text-slate-400">{pub.year}</span>
                  </div>

                  <div>
                    <h3 className="font-extrabold text-slate-900 text-sm leading-snug group-hover:text-[#006a4e] transition-colors">
                      {pub.paperTitle}
                    </h3>
                    <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                      {pub.summary}
                    </p>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <img
                      src={pub.photo}
                      alt={pub.author}
                      className="w-9 h-9 rounded-md object-cover object-top border border-emerald-100 shrink-0"
                    />
                    <div className="min-w-0">
                      <div className="text-xs font-bold text-slate-900 truncate">
                        {pub.author}
                      </div>
                      <div className="text-[10px] font-semibold text-[#0094b6] truncate">
                        {pub.designation}
                      </div>
                    </div>
                  </div>
                  <ArrowUpRight className="w-4 h-4 text-[#006a4e] group-hover:text-[#0094b6] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all shrink-0" />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ResearchAwardsSection;
