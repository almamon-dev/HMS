import React from 'react';
import { Phone, Mail, Clock, ShieldCheck, HeartHandshake } from 'lucide-react';

interface TopBarProps {
  onOpenPortals: () => void;
  onOpenSuperadmin: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({ onOpenPortals, onOpenSuperadmin }) => {
  return (
    <div className="bg-[#004d36] text-white text-[11px] py-1.5 border-b border-emerald-800/60">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 flex flex-wrap items-center justify-between gap-3">
        {/* Left: Emergency & Contact info */}
        <div className="flex items-center gap-4 flex-wrap">
          <span className="flex items-center gap-1.5 font-bold text-amber-300">
            <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping inline-block" />
            Emergency Hotline: 10678 / +880 1800-000000
          </span>
          <span className="hidden sm:inline text-emerald-300/40">|</span>
          <span className="hidden md:flex items-center gap-1 text-emerald-100">
            <Phone className="w-3 h-3 text-emerald-300" />
            Ambulance: +880 1711-000999
          </span>
          <span className="hidden sm:inline text-emerald-300/40">|</span>
          <span className="hidden lg:flex items-center gap-1 text-emerald-100">
            <Mail className="w-3 h-3 text-emerald-300" />
            info@greencare-hospital.org
          </span>
        </div>

        {/* Right: Hours, Language & Portals quick link */}
        <div className="flex items-center gap-3">
          <span className="hidden sm:flex items-center gap-1 text-emerald-200">
            <Clock className="w-3 h-3 text-emerald-300" />
            24/7 Outdoor, IPD & Trauma
          </span>
          <span className="text-emerald-300/40">|</span>
          <button
            onClick={onOpenPortals}
            className="flex items-center gap-1 text-emerald-100 hover:text-white font-semibold cursor-pointer transition-colors"
          >
            <HeartHandshake className="w-3.5 h-3.5 text-amber-300" />
            <span>Staff & Patient Portals</span>
          </button>
          <span className="text-emerald-300/40">|</span>
          <button
            onClick={onOpenSuperadmin}
            className="flex items-center gap-1 text-amber-300 hover:text-amber-200 font-bold cursor-pointer transition-colors"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-amber-300" />
            <span>Superadmin</span>
          </button>
        </div>
      </div>
    </div>
  );
};


export default TopBar;
