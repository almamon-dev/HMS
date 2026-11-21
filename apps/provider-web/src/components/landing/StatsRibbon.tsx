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
    <section
      aria-label="Hospital Clinical Scale Metrics"
      className="bg-gradient-to-r from-[#007799] via-[#008ba8] to-[#009cb8] text-white py-5 sm:py-6"
    >
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          {stats.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.label}
                className="flex flex-col items-center text-center group cursor-default"
              >
                {/* Compact Circular Badge with white ring */}
                <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-full border border-white/40 bg-white/10 backdrop-blur-xs flex items-center justify-center text-white mb-1.5 shadow-sm">
                  <Icon className="w-5 h-5 sm:w-5.5 sm:h-5.5 text-white" />
                </div>

                <div className="text-xl sm:text-2xl font-black tracking-tight leading-none text-white">
                  {item.value}
                </div>
                <div className="text-xs font-bold text-cyan-100 mt-1 leading-tight">
                  {item.label}
                </div>
                <div className="text-[10px] text-cyan-200/80 font-medium hidden sm:block mt-0.5 leading-tight">
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
