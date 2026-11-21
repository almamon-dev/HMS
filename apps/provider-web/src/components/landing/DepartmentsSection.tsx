import React from 'react';
import { HeartPulse, Brain, Bone, Baby, Stethoscope } from 'lucide-react';

interface DepartmentsSectionProps {
  onSelectDepartment: (department: string) => void;
}

export const DepartmentsSection: React.FC<DepartmentsSectionProps> = ({
  onSelectDepartment,
}) => {
  const departments = [
    {
      key: 'Cardiology',
      title: 'Department of Cardiology',
      subtitle: '& Cardiac Surgery Center',
      description:
        '24/7 Digital Cath Lab, primary angioplasty, open-heart bypass surgery and cardiac ICU.',
      icon: HeartPulse,
      badge: '24/7 Emergency Cath Lab',
      accent: 'teal' as const,
    },
    {
      key: 'Neurology',
      title: 'Department of Neurology',
      subtitle: '& Comprehensive Stroke Unit',
      description:
        'Advanced neuro-navigation, microscopic brain surgery, epilepsy clinic and spine care.',
      icon: Brain,
      badge: 'Acute Stroke Protocol',
      accent: 'green' as const,
    },
    {
      key: 'Orthopedics',
      title: 'Department of Orthopedics',
      subtitle: '& Trauma Joint Replacement',
      description:
        'Minimally invasive knee/hip replacement, sports arthroscopy, fracture trauma center.',
      icon: Bone,
      badge: 'Robotic Joint Surgery',
      accent: 'teal' as const,
    },
    {
      key: 'Pediatrics',
      title: 'Pediatrics & Neonatology',
      subtitle: '& Level-3 NICU Care',
      description:
        'Specialized neonatal intensive care, pediatric surgery, developmental therapy.',
      icon: Baby,
      badge: 'Level-3 Advanced NICU',
      accent: 'green' as const,
    },
  ];

  return (
    <section id="departments" className="py-14 bg-white border-b border-slate-200/80">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-3">
          <div>
            <div className="text-xs font-bold text-[#006a4e] mb-1 flex items-center gap-1.5">
              <Stethoscope className="w-4 h-4 text-[#0094b6]" />
              <span>Specialized Healthcare</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Clinical Departments & Centers of Excellence
            </h2>
          </div>
          <a
            href="#all-departments"
            className="text-xs font-bold text-[#006a4e] hover:text-[#0094b6] transition-colors"
          >
            <span>Explore All 28 Specialties</span>
          </a>
        </div>

        {/* 4 Department Cards (Matching Leadership Card Design: rounded-md & clean system accents) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {departments.map((dept) => {
            const Icon = dept.icon;
            const isGreen = dept.accent === 'green';
            return (
              <div
                key={dept.title}
                className="bg-white rounded-md p-5 border border-emerald-200/70 shadow-xs flex flex-col justify-between gap-4"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div
                      className={`w-10 h-10 rounded-md flex items-center justify-center shrink-0 ${
                        isGreen
                          ? 'bg-[#006a4e]/10 text-[#006a4e]'
                          : 'bg-[#0094b6]/10 text-[#0094b6]'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                    </div>

                    <span className="text-[10px] font-bold text-slate-700 bg-slate-50 border border-slate-200/80 px-2 py-1 rounded-md">
                      {dept.badge}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-sm font-extrabold text-slate-900 leading-snug">
                      {dept.title}
                    </h3>
                    <p
                      className={`text-[11px] font-semibold mt-0.5 ${
                        isGreen ? 'text-[#006a4e]' : 'text-[#0094b6]'
                      }`}
                    >
                      {dept.subtitle}
                    </p>
                    <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                      {dept.description}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => onSelectDepartment(dept.key)}
                  className="w-full pt-3 border-t border-slate-100 text-xs font-bold text-[#006a4e] text-center cursor-pointer"
                >
                  <span>Consult Specialists</span>
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default DepartmentsSection;
