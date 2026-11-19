import React, { useState } from 'react';
import { Play, Sparkles, X, Activity } from 'lucide-react';

export const InnovationBanner: React.FC = () => {
  const [showVideoModal, setShowVideoModal] = useState(false);

  return (
    <section className="relative bg-slate-950 text-white overflow-hidden py-16 lg:py-24 border-y border-slate-800">
      {/* Background High-Tech Surgery / Medical Tech Photo */}
      <div className="absolute inset-0 opacity-35">
        <img
          src="https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=1600&q=80"
          alt="Advanced Robotic Surgical Suite"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/80 to-transparent" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-8 space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              Next-Generation Healthcare
            </div>

            {/* Title styled with Lime-Yellow and White (Exact match from screenshot) */}
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight">
              Inspire Healing for <br />
              <span className="text-[#a3e635] drop-shadow-sm">
                Innovation & Transformation
              </span>
            </h2>

            <p className="text-slate-300 text-xs sm:text-sm max-w-2xl leading-relaxed">
              Equipped with 4th Generation Da Vinci Robotic Surgery, 3 Tesla Silent MRI,
              AI-assisted pathology and digital critical care telemetry—redefining patient recovery.
            </p>

            <div className="pt-2 flex items-center gap-6">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-200">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                Zero-Infection Modular OTs
              </div>
              <div className="flex items-center gap-2 text-xs font-bold text-slate-200">
                <span className="w-2.5 h-2.5 rounded-full bg-cyan-400" />
                Real-Time Vital Telemetry
              </div>
            </div>
          </div>

          {/* Right Column: Play Video Button (Matching screenshot circular play overlay) */}
          <div className="lg:col-span-4 flex items-center justify-center lg:justify-end">
            <button
              onClick={() => setShowVideoModal(true)}
              className="group relative w-24 h-24 rounded-full bg-white/10 hover:bg-white/20 border-2 border-white/60 backdrop-blur-md flex items-center justify-center transition-all duration-300 shadow-2xl hover:scale-110 cursor-pointer"
              title="Watch Hospital Technology Tour"
            >
              <span className="absolute -inset-2 rounded-full border border-emerald-400/40 animate-ping pointer-events-none" />
              <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-[#006a4e] to-emerald-400 flex items-center justify-center text-white shadow-lg">
                <Play className="w-7 h-7 fill-white translate-x-0.5" />
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Video Preview Modal */}
      {showVideoModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="relative w-full max-w-3xl bg-slate-900 rounded-3xl overflow-hidden border border-slate-800 shadow-2xl">
            <div className="p-4 bg-slate-800/80 flex items-center justify-between text-white">
              <span className="font-bold text-sm flex items-center gap-2">
                <Activity className="w-4 h-4 text-emerald-400" />
                Green Care Hospital Robotic Surgery & Campus Tour
              </span>
              <button
                onClick={() => setShowVideoModal(false)}
                className="p-1.5 rounded-lg hover:bg-slate-700 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="aspect-16/9 bg-black flex items-center justify-center">
              <img
                src="https://images.unsplash.com/photo-1551076805-e1869033e561?auto=format&fit=crop&w=1200&q=80"
                alt="Hospital tour preview"
                className="w-full h-full object-cover opacity-80"
              />
              <div className="absolute text-center text-white p-6">
                <Play className="w-12 h-12 fill-white mx-auto mb-2 opacity-90" />
                <p className="font-bold text-sm">Interactive Virtual Medical Tour Loaded</p>
                <p className="text-xs text-slate-400 mt-1">Hospital OT Suite & ICU Ward Live Feed</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};


export default InnovationBanner;
