import React from 'react';
import { Quote } from 'lucide-react';

export const LeadershipMessage: React.FC = () => {
  return (
    <section id="about" className="py-14 bg-[#eef7f3] border-b border-emerald-100/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Left Column: Quote & Message */}
          <div className="lg:col-span-7 space-y-4">
            <div className="flex items-center gap-2 text-[#006a4e] font-bold text-xs uppercase tracking-wider">
              <Quote className="w-4 h-4 text-emerald-600 inline" />
              Leadership Statement
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight leading-tight">
              Message from the Medical Director & Board of Trustees
            </h2>

            <div className="space-y-3 text-slate-600 text-xs sm:text-sm leading-relaxed">
              <p>
                At Green Care Hospital & Research Center, our mission is anchored in compassionate,
                evidence-based healthcare and continuous clinical innovation. We have unified world-class
                professors, advanced diagnostic laboratories, and robotic surgical suites to deliver
                uncompromising patient care.
              </p>
              <p>
                Every treatment journey is monitored with precision—ensuring ethical medical standards,
                transparent billing, and maximum comfort for patients and their families across Bangladesh.
              </p>
            </div>

            <div className="pt-3 border-t border-emerald-200/80">
              <div className="font-extrabold text-slate-900 text-base">
                Prof. Dr. Mohammad A. Rahman, <span className="text-xs font-semibold text-emerald-800">MBBS, FCPS, FRCP (Edin)</span>
              </div>
              <div className="text-xs font-semibold text-[#006a4e]">
                Chairman & Chief Medical Director • Green Care Hospital & Medical College
              </div>
            </div>
          </div>

          {/* Right Column: Overlapping Circular Doctor Photos (Exact visual layout from screenshot) */}
          <div className="lg:col-span-5 flex items-center justify-center lg:justify-end">
            <div className="relative flex items-center">
              {/* Main Circular Director Image */}
              <div className="relative z-20 w-44 h-44 sm:w-52 sm:h-52 rounded-full border-4 border-white shadow-xl overflow-hidden bg-white">
                <img
                  src="https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&w=500&q=80"
                  alt="Prof. Dr. Mohammad A. Rahman"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Overlapping Secondary Consultant Image */}
              <div className="relative z-10 -ml-12 w-32 h-32 sm:w-36 sm:h-36 rounded-full border-4 border-white shadow-lg overflow-hidden bg-white">
                <img
                  src="https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=500&q=80"
                  alt="Dr. Tariqul Islam, Head of Surgery"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Overlapping Third Doctor Image */}
              <div className="relative z-0 -ml-8 w-24 h-24 sm:w-28 sm:h-28 rounded-full border-4 border-white shadow-md overflow-hidden bg-white hidden sm:block">
                <img
                  src="https://images.unsplash.com/photo-1594824813501-4475510255c2?auto=format&fit=crop&w=500&q=80"
                  alt="Prof. Dr. Farhana Khan, Head of Medicine"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};


export default LeadershipMessage;
