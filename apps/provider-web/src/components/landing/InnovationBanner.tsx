import React, { useState } from 'react';
import { Play, Sparkles, X, Activity } from 'lucide-react';

export const InnovationBanner: React.FC = () => {
  const [showVideoModal, setShowVideoModal] = useState(false);

  return (
    <section className="relative bg-[#002d22] text-white overflow-hidden py-14 lg:py-20">
      {/* Background High-Tech Surgery / Medical Tech Photo */}
      <div className="absolute inset-0 opacity-40">
        <img
          src="https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=1600&q=80"
          alt="Advanced Robotic Surgical Suite"
          className="w-full h-full object-cover"
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(90deg, rgba(0, 45, 34, 0.92) 0%, rgba(0, 77, 60, 0.78) 50%, rgba(0, 118, 140, 0.45) 100%)',
          }}
        />
      </div>

      <div className="relative z-10 max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-8 space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-white/10 border border-white/20 text-emerald-200 text-xs font-bold">
              <Sparkles className="w-3.5 h-3.5 text-cyan-300" />
              <span>Next-Generation Healthcare</span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight">
              Inspire Healing for <br />
              <span className="text-emerald-300">
                Innovation & Transformation
              </span>
            </h2>

            <p className="text-slate-100/90 text-xs sm:text-sm max-w-2xl leading-relaxed">
              Equipped with 4th Generation Da Vinci Robotic Surgery, 3 Tesla Silent MRI,
              AI-assisted pathology and digital critical care telemetry—redefining patient recovery.
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-6">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-100">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>Zero-Infection Modular OTs</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-bold text-slate-100">
                <span className="w-2.5 h-2.5 rounded-full bg-cyan-400" />
                <span>Real-Time Vital Telemetry</span>
              </div>
            </div>
          </div>

          {/* Right Column: Play Video Button */}
          <div className="lg:col-span-4 flex items-center justify-center lg:justify-end">
            <button
              onClick={() => setShowVideoModal(true)}
              className="group relative w-24 h-24 rounded-full bg-white/10 hover:bg-white/20 border-2 border-white/50 backdrop-blur-md flex items-center justify-center transition-all duration-300 shadow-2xl cursor-pointer"
              title="Watch Hospital Technology Tour"
            >
              <span className="absolute -inset-2 rounded-full border border-cyan-300/40 animate-ping pointer-events-none" />
              <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-[#006a4e] to-[#0094b6] flex items-center justify-center text-white shadow-lg">
                <Play className="w-7 h-7 fill-white translate-x-0.5" />
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Video Preview Modal */}
      {showVideoModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="relative w-full max-w-3xl bg-slate-900 rounded-md overflow-hidden border border-slate-700 shadow-2xl">
            <div className="p-4 bg-[#004232] flex items-center justify-between text-white border-b border-white/10">
              <span className="font-bold text-sm flex items-center gap-2">
                <Activity className="w-4 h-4 text-emerald-300" />
                <span>Green Care Hospital Robotic Surgery & Campus Tour</span>
              </span>
              <button
                onClick={() => setShowVideoModal(false)}
                className="p-1.5 rounded-md hover:bg-white/10 text-slate-200 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="relative aspect-16/9 bg-black flex items-center justify-center">
              <img
                src="https://images.unsplash.com/photo-1551076805-e1869033e561?auto=format&fit=crop&w=1200&q=80"
                alt="Hospital tour preview"
                className="w-full h-full object-cover opacity-80"
              />
              <div className="absolute text-center text-white p-6">
                <Play className="w-12 h-12 fill-white mx-auto mb-2 opacity-90" />
                <p className="font-bold text-sm">Interactive Virtual Medical Tour Loaded</p>
                <p className="text-xs text-slate-300 mt-1">Hospital OT Suite & ICU Ward Live Feed</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default InnovationBanner;
