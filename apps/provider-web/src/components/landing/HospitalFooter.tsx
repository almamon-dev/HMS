import React from 'react';
import { Hospital, Phone, Mail, MapPin, ShieldCheck, Heart } from 'lucide-react';

interface HospitalFooterProps {
  onOpenPortals: () => void;
  onOpenAppointment: () => void;
  onOpenSuperadmin: () => void;
}

export const HospitalFooter: React.FC<HospitalFooterProps> = ({
  onOpenPortals,
  onOpenAppointment,
  onOpenSuperadmin,
}) => {
  return (
    <footer className="bg-[#003827] text-slate-300 text-xs border-t border-emerald-900/60 pt-14 pb-8">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 pb-12 border-b border-emerald-900/50">
          {/* Col 1 & 2: Hospital Identity */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-md bg-[#0094b6] flex items-center justify-center text-white font-bold shadow-md">
                <Hospital className="w-6 h-6 text-white" />
              </div>
              <div>
                <span className="font-extrabold text-lg text-white tracking-tight">
                  GREEN CARE <span className="text-emerald-400">HOSPITAL</span>
                </span>
                <p className="text-[10px] text-emerald-300 font-semibold tracking-wider uppercase">
                  Research & Tertiary Healthcare Center
                </p>
              </div>
            </div>

            <p className="text-slate-400 text-xs leading-relaxed max-w-sm">
              Committed to affordable excellence in patient care, advanced clinical medicine, and surgical innovation. 500-bed multidisciplinary tertiary hospital accredited by BMDC and JCI quality guidelines.
            </p>

            <div className="space-y-2 text-xs text-slate-300">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Sector 11, Mirpur Road / Uttara, Dhaka-1230, Bangladesh</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>24/7 Hotline: 10678 / +880 1800-000000</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>info@greencare-hospital.org</span>
              </div>
            </div>
          </div>

          {/* Col 3: Clinical Centers */}
          <div className="space-y-3">
            <h4 className="text-white font-extrabold text-sm tracking-tight border-b border-emerald-800/60 pb-2">
              Clinical Centers
            </h4>
            <ul className="space-y-2 text-slate-300">
              <li><a href="#departments" className="hover:text-emerald-400 transition-colors">Cardiology & Cardiac Surgery</a></li>
              <li><a href="#departments" className="hover:text-emerald-400 transition-colors">Neurology & Stroke Center</a></li>
              <li><a href="#departments" className="hover:text-emerald-400 transition-colors">Orthopedics & Joint Care</a></li>
              <li><a href="#departments" className="hover:text-emerald-400 transition-colors">Pediatrics & Level-3 NICU</a></li>
              <li><a href="#departments" className="hover:text-emerald-400 transition-colors">Oncology & Chemotherapy</a></li>
              <li><a href="#departments" className="hover:text-emerald-400 transition-colors">Nephrology & Dialysis Unit</a></li>
            </ul>
          </div>

          {/* Col 4: Patient Services */}
          <div className="space-y-3">
            <h4 className="text-white font-extrabold text-sm tracking-tight border-b border-emerald-800/60 pb-2">
              Patient Services
            </h4>
            <ul className="space-y-2 text-slate-300">
              <li>
                <button
                  onClick={onOpenAppointment}
                  className="hover:text-emerald-400 transition-colors cursor-pointer text-left"
                >
                  Book Doctor Appointment
                </button>
              </li>
              <li><a href="#facilities" className="hover:text-emerald-400 transition-colors">IPD Bed & Cabin Booking</a></li>
              <li><a href="#diagnostic" className="hover:text-emerald-400 transition-colors">Online Pathology Reports</a></li>
              <li><a href="#ambulance" className="hover:text-emerald-400 transition-colors">24/7 ICU Ambulance</a></li>
              <li><a href="#blood" className="hover:text-emerald-400 transition-colors">Blood Bank Donor Registry</a></li>
              <li><a href="#tele" className="hover:text-emerald-400 transition-colors">Tele-Medicine & EMR Records</a></li>
            </ul>
          </div>

          {/* Col 5: Portal Access & Management */}
          <div className="space-y-3">
            <h4 className="text-white font-extrabold text-sm tracking-tight border-b border-emerald-800/60 pb-2">
              Portals & System
            </h4>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={onOpenSuperadmin}
                  className="text-amber-300 hover:text-amber-200 font-bold flex items-center gap-1 cursor-pointer"
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Superadmin Panel</span>
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenPortals}
                  className="text-emerald-300 hover:text-emerald-200 font-semibold cursor-pointer"
                >
                  Staff & Role Logins (12 Roles)
                </button>
              </li>
              <li><a href="#doctor-portal" onClick={onOpenPortals} className="text-slate-300 hover:text-emerald-400 transition-colors">Doctor Workspace</a></li>
              <li><a href="#nurse-portal" onClick={onOpenPortals} className="text-slate-300 hover:text-emerald-400 transition-colors">Nurse Station</a></li>
              <li><a href="#pharmacy-portal" onClick={onOpenPortals} className="text-slate-300 hover:text-emerald-400 transition-colors">Pharmacy & Billing</a></li>
              <li><a href="#patient-portal" onClick={onOpenPortals} className="text-slate-300 hover:text-emerald-400 transition-colors">Patient EMR Portal</a></li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-emerald-300/70">
          <p>© {new Date().getFullYear()} Green Care Hospital & Medical Research Center. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <span>BMDC Reg. No: H-89410</span>
            <span>•</span>
            <span>FHIR R4 & Clean Architecture</span>
            <span>•</span>
            <span className="flex items-center gap-1 text-emerald-400 font-semibold">
              <Heart className="w-3 h-3 fill-emerald-400 text-emerald-400" />
              Healing Bangladesh
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};


export default HospitalFooter;
