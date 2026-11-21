import React from 'react';
import { Quote, ShieldCheck, HeartPulse, Receipt, FileText } from 'lucide-react';

export const LeadershipMessage: React.FC = () => {
  const pillars = [
    {
      title: 'Patient Safety First',
      description: 'BMDC & JCI aligned clinical protocols across every ward and surgical suite.',
      icon: ShieldCheck,
      accent: 'green' as const,
    },
    {
      title: 'Ethical & Transparent Billing',
      description: 'Itemized digital invoicing with clear estimates and zero hidden charges.',
      icon: Receipt,
      accent: 'teal' as const,
    },
    {
      title: '24/7 Critical & Trauma Care',
      description: 'Round-the-clock emergency triage, ICU monitoring, and senior consultants.',
      icon: HeartPulse,
      accent: 'teal' as const,
    },
    {
      title: 'Unified Digital EMR',
      description: 'Instant online pathology reports, e-prescriptions, and lifetime health records.',
      icon: FileText,
      accent: 'green' as const,
    },
  ];

  return (
    <section id="about" className="py-12 lg:py-14 bg-white border-b border-slate-200/80">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Column: Quote & Message */}
          <div className="lg:col-span-6 space-y-4">
            <div className="inline-flex items-center gap-2 text-[#006a4e] font-bold text-xs">
              <Quote className="w-4 h-4 text-[#0094b6] inline" />
              <span>Leadership Statement</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight leading-tight">
              Message from the Medical Director & Board of Trustees
            </h2>

            <div className="space-y-3 text-slate-600 text-xs sm:text-sm leading-relaxed">
              <p>
                At Green Care Hospital & Research Center, our mission is anchored in compassionate,
                evidence-based healthcare and continuous clinical innovation. We have unified
                world-class professors, advanced diagnostic laboratories, and robotic surgical
                suites to deliver uncompromising patient care.
              </p>
              <p>
                Every treatment journey is monitored with precision—ensuring ethical medical
                standards, transparent billing, and maximum comfort for patients and their families
                across Bangladesh.
              </p>
            </div>

            <div className="pt-3 border-t border-emerald-200/80 flex flex-wrap items-center justify-between gap-3">
              <div>
                <div className="font-extrabold text-slate-900 text-base">
                  Prof. Dr. Mohammad A. Rahman,{' '}
                  <span className="text-xs font-semibold text-[#006a4e]">
                    MBBS, FCPS, FRCP (Edin)
                  </span>
                </div>
                <div className="text-xs font-semibold text-[#0094b6]">
                  Chairman & Chief Medical Director • Green Care Hospital & Medical College
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Clean 2x2 Hospital Value & Governance Cards */}
          <div className="lg:col-span-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {pillars.map((pillar) => {
                const Icon = pillar.icon;
                const isGreen = pillar.accent === 'green';
                return (
                  <div
                    key={pillar.title}
                    className="bg-white rounded-md p-5 border border-emerald-200/70 shadow-xs flex flex-col gap-3"
                  >
                    <div
                      className={`w-10 h-10 rounded-md flex items-center justify-center shrink-0 ${
                        isGreen
                          ? 'bg-[#006a4e]/10 text-[#006a4e]'
                          : 'bg-[#0094b6]/10 text-[#0094b6]'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                    </div>

                    <div>
                      <h3 className="text-sm font-extrabold text-slate-900 tracking-tight">
                        {pillar.title}
                      </h3>
                      <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                        {pillar.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LeadershipMessage;
