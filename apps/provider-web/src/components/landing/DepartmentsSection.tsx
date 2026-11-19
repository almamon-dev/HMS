import React from 'react';
import { HeartPulse, Brain, Bone, Baby, ArrowRight, Stethoscope } from 'lucide-react';

export const DepartmentsSection: React.FC = () => {
  const departments = [
    {
      title: 'Department of Cardiology',
      subtitle: '& Cardiac Surgery Center',
      description: '24/7 Digital Cath Lab, primary angioplasty, open-heart bypass surgery and cardiac ICU.',
      icon: HeartPulse,
      badge: '24/7 Emergency Cath Lab',
      gradient: 'from-[#007799] to-[#009cb8]',
    },
    {
      title: 'Department of Neurology',
      subtitle: '& Comprehensive Stroke Unit',
      description: 'Advanced neuro-navigation, microscopic brain surgery, epilepsy clinic and spine care.',
      icon: Brain,
      badge: 'Acute Stroke Protocol',
      gradient: 'from-[#006a4e] to-[#009b72]',
    },
    {
      title: 'Department of Orthopedics',
      subtitle: '& Trauma Joint Replacement',
      description: 'Minimally invasive knee/hip replacement, sports arthroscopy, fracture trauma center.',
      icon: Bone,
      badge: 'Robotic Joint Surgery',
      gradient: 'from-[#0284c7] to-[#0369a1]',
    },
    {
      title: 'Pediatrics & Neonatology',
      subtitle: '& Level-3 NICU Care',
      description: 'Specialized neonatal intensive care, pediatric surgery, developmental therapy.',
      icon: Baby,
      badge: 'Level-3 Advanced NICU',
      gradient: 'from-[#0f766e] to-[#0d9488]',
    },
  ];

  return (
    <section id="departments" className="py-16 bg-white border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-3">
          <div>
            <div className="text-xs font-bold text-[#006a4e] uppercase tracking-wider mb-1 flex items-center gap-1.5">
              <Stethoscope className="w-4 h-4 text-emerald-600" />
              Specialized Healthcare
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Clinical Departments & Centers of Excellence
            </h2>
          </div>
          <a
            href="#all-departments"
            className="text-xs font-bold text-[#006a4e] hover:text-emerald-700 flex items-center gap-1 transition-colors"
          >
            <span>Explore All 28 Specialties</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </a>
        </div>

        {/* 4 Cards with matching layout from the screenshot (White top with emblem + Blue/Green tab base) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {departments.map((dept) => {
            const Icon = dept.icon;
            return (
              <div
                key={dept.title}
                className="group rounded-3xl overflow-hidden border border-slate-200/90 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between bg-white hover:-translate-y-1"
              >
                {/* White Upper Section with Department Icon / Crest */}
                <div className="p-6 flex flex-col items-center text-center">
                  <div className="w-20 h-20 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center text-[#006a4e] shadow-xs group-hover:scale-110 transition-transform mb-4">
                    <Icon className="w-10 h-10 text-teal-700" />
                  </div>

                  <span className="text-[10px] font-bold text-teal-800 bg-teal-50 border border-teal-200 px-2.5 py-1 rounded-full mb-3">
                    {dept.badge}
                  </span>

                  <h3 className="font-extrabold text-slate-900 text-base leading-snug">
                    {dept.title}
                  </h3>
                  <p className="text-xs font-semibold text-slate-500 mt-0.5 mb-2">
                    {dept.subtitle}
                  </p>
                  <p className="text-[11px] text-slate-500 leading-relaxed line-clamp-2">
                    {dept.description}
                  </p>
                </div>

                {/* Colored Bottom Block (matching screenshot blue/green card footer) */}
                <div className={`p-3.5 bg-gradient-to-r ${dept.gradient} text-white flex items-center justify-between text-xs font-bold`}>
                  <span>Consult Specialists</span>
                  <ArrowRight className="w-4 h-4 text-white group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default DepartmentsSection;
