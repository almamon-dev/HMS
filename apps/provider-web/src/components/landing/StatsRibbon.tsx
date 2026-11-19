import React from 'react';
import { Bed, Users, HeartPulse, Ambulance } from 'lucide-react';

export const StatsRibbon: React.FC = () => {
  const stats = [
    {
      value: '500+',
      label: 'Hospital Beds & ICU',
      sublabel: 'Equipped with Level-3 Ventilators',
      icon: Bed,
    },
    {
      value: '120+',
      label: 'Specialist Doctors',
      sublabel: 'Professors, Surgeons & Consultants',
      icon: Users,
    },
    {
      value: '50,000+',
      label: 'Successful Treatments',
      sublabel: 'Happy Patient Recoveries Yearly',
      icon: HeartPulse,
    },
    {
      value: '24/7',
      label: 'ICU & Ambulance Fleet',
      sublabel: 'Life Support Mobile Trauma Units',
      icon: Ambulance,
    },
  ];

  return (
    <section className="bg-gradient-to-r from-[#007799] via-[#008ba8] to-[#009cb8] text-white py-8 px-4 sm:px-6 border-y border-cyan-800/50 shadow-inner">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
          {stats.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.label}
                className="flex flex-col items-center text-center group cursor-default"
              >
                {/* Circular Badge with white ring (Exact styling from screenshot) */}
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full border-2 border-white/40 bg-white/10 backdrop-blur-xs flex items-center justify-center text-white mb-3 shadow-md group-hover:scale-110 group-hover:bg-white/20 transition-all duration-300">
                  <Icon className="w-7 h-7 sm:w-9 sm:h-9 text-white" />
                </div>

                <div className="text-2xl sm:text-3xl font-black tracking-tight text-white">
                  {item.value}
                </div>
                <div className="text-xs sm:text-sm font-bold text-cyan-100 mt-0.5">
                  {item.label}
                </div>
                <div className="text-[10px] text-cyan-200/80 font-medium hidden sm:block mt-0.5">
                  {item.sublabel}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};


export default StatsRibbon;
