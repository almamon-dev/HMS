import {
  ArrowLeftRight,
  Bell,
  ChevronDown,
  Globe,
  LogOut,
  Menu,
  Search,
  ShieldCheck,
  User,
} from 'lucide-react';
import React, { useState } from 'react';
import { CURRENT_PATIENT } from '../../data/patientPortalData';

interface PatientTopbarProps {
  currentModule: string;
  onToggleCollapse: () => void;
  onToggleMobileSidebar: () => void;
  onSelectModule: (mod: string) => void;
  onSwitchRole: () => void;
  onGoHome: () => void;
}

const MODULE_TITLES: Record<string, string> = {
  dashboard: 'Patient Health Dashboard',
  profile: 'My Patient Profile & Demographics',
  appointments: 'My Doctor Appointments & Slips',
  'find-doctor': 'Find Specialist Physician',
  'my-doctors': 'My Primary & Care Physicians',
  'medical-history': 'My Past Medical & Surgical History',
  prescriptions: 'My Prescriptions & E-Rx Archive',
  'lab-reports': 'Diagnostic Pathology Lab Reports',
  'radiology-reports': 'Radiology & Imaging Reports',
  vitals: 'My Vital Signs & Biomarker Log',
  'medical-documents': 'Medical Documents & Scans',
  admissions: 'My Hospital Inpatient Admissions',
  teleconsultation: 'Online Video Teleconsultation',
  billing: 'Hospital Invoices & Payment Receipts',
  'download-center': 'Patient Download Center',
  notifications: 'Health Notifications & Reminders',
  'support-messages': 'Hospital Care Team Support',
  settings: 'Portal Settings & Privacy',
};

export const PatientTopbar: React.FC<PatientTopbarProps> = ({
  currentModule,
  onToggleMobileSidebar,
  onSelectModule,
  onSwitchRole,
  onGoHome,
}) => {
  const [profileOpen, setProfileOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);

  const title = MODULE_TITLES[currentModule] || 'Patient Health Portal';

  return (
    <header className="h-14 sm:h-[60px] bg-white border-b border-slate-200/80 px-2 sm:px-4 flex items-center justify-between sticky top-0 z-30 shrink-0">
      {/* Left: Mobile Toggle + Title */}
      <div className="flex items-center gap-2 sm:gap-3 min-w-0">
        <button
          type="button"
          onClick={onToggleMobileSidebar}
          aria-label="Open navigation menu"
          className="lg:hidden p-1.5 rounded-md text-slate-500 hover:text-slate-800 hover:bg-slate-100 cursor-pointer"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <h1 className="text-sm sm:text-base font-bold text-slate-900 tracking-tight truncate">
              {title}
            </h1>
            <span className="hidden sm:inline-flex items-center px-1.5 py-0.5 rounded-[3px] bg-[#edf6f2] text-[#006a4e] text-[10px] font-bold border border-[#006a4e]/20">
              Patient Portal
            </span>
          </div>
          <p className="hidden md:block text-[11px] text-slate-400 truncate">
            {CURRENT_PATIENT.name} ({CURRENT_PATIENT.uhid}) · Blood: {CURRENT_PATIENT.bloodGroup} · Age: {CURRENT_PATIENT.age}y
          </p>
        </div>
      </div>

      {/* Right: Search, Notifications, Profile Pill */}
      <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
        {/* Search Input matching Superadmin */}
        <div className="hidden md:flex items-center relative">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 pointer-events-none" />
          <input
            type="text"
            placeholder="Search prescriptions, lab, doctors... (⌘K)"
            className="w-56 lg:w-72 h-8 pl-8 pr-3 rounded-full bg-slate-50 border border-slate-200 text-xs text-slate-700 placeholder-slate-400 focus:outline-hidden focus:bg-white focus:border-[#006a4e] focus:ring-1 focus:ring-[#006a4e]/20 transition-all"
          />
        </div>

        {/* Notifications Trigger */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setNotifOpen(!notifOpen)}
            aria-label="Notifications"
            className="relative p-2 rounded-full text-slate-500 hover:text-slate-800 hover:bg-slate-100 cursor-pointer transition-colors"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#006a4e] ring-2 ring-white" />
          </button>

          {notifOpen && (
            <div
              className="absolute right-0 mt-1 w-80 bg-white border border-slate-200 rounded-md shadow-xl py-2 z-50 animate-in fade-in zoom-in-95 duration-100"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="px-3 py-1.5 border-b border-slate-100 flex items-center justify-between">
                <span className="text-xs font-bold text-slate-800">Health Alerts &amp; Updates</span>
                <button
                  type="button"
                  onClick={() => {
                    onSelectModule('notifications');
                    setNotifOpen(false);
                  }}
                  className="text-[11px] text-[#006a4e] font-semibold hover:underline cursor-pointer"
                >
                  View All
                </button>
              </div>

              <div className="divide-y divide-slate-100 max-h-64 overflow-y-auto text-xs">
                <div className="p-2.5 hover:bg-slate-50 cursor-pointer">
                  <div className="font-semibold text-slate-900 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#006a4e]" />
                    <span>Appointment Today 04:00 PM</span>
                  </div>
                  <div className="text-[11px] text-slate-500 mt-0.5">
                    Room 302, Level 3 with Prof. Dr. Tanvir Ahmed. Token #06.
                  </div>
                  <div className="text-[10px] text-slate-400 mt-1">1 hour ago</div>
                </div>

                <div className="p-2.5 hover:bg-slate-50 cursor-pointer">
                  <div className="font-semibold text-slate-900 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#006a4e]" />
                    <span>CBC Lab Report Ready</span>
                  </div>
                  <div className="text-[11px] text-slate-500 mt-0.5">
                    Your complete blood count test results are available online.
                  </div>
                  <div className="text-[10px] text-slate-400 mt-1">2 hours ago</div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Profile Pill Dropdown */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setProfileOpen(!profileOpen)}
            className="flex items-center gap-2 p-1 sm:px-2.5 sm:py-1 rounded-full border border-slate-200/80 hover:bg-slate-50 cursor-pointer transition-colors"
          >
            <div className="w-6 h-6 rounded-full bg-[#edf6f2] text-[#006a4e] font-bold text-xs flex items-center justify-center shrink-0">
              {CURRENT_PATIENT.name.slice(0, 2)}
            </div>
            <div className="hidden sm:block text-left">
              <span className="block text-xs font-semibold text-slate-800 leading-tight">
                {CURRENT_PATIENT.name.split(' ')[0]}
              </span>
              <span className="block text-[10px] text-[#006a4e] font-medium leading-none">
                {CURRENT_PATIENT.uhid}
              </span>
            </div>
            <ChevronDown className="hidden sm:block w-3 h-3 text-slate-400" />
          </button>

          {profileOpen && (
            <div
              className="absolute right-0 mt-1.5 w-60 bg-white border border-slate-200 rounded-md shadow-xl py-1 z-50 text-left text-xs divide-y divide-slate-100 animate-in fade-in zoom-in-95 duration-100"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="px-3 py-2 bg-slate-50/50">
                <p className="font-bold text-slate-900">{CURRENT_PATIENT.name}</p>
                <p className="text-[11px] text-[#006a4e] font-semibold">{CURRENT_PATIENT.uhid}</p>
                <p className="text-[10px] text-slate-500 mt-0.5">{CURRENT_PATIENT.email}</p>
              </div>

              <div className="py-1">
                <button
                  type="button"
                  onClick={() => {
                    onSelectModule('profile');
                    setProfileOpen(false);
                  }}
                  className="w-full text-left px-3 py-1.5 text-slate-700 hover:bg-[#edf6f2] hover:text-[#006a4e] font-medium flex items-center gap-2 cursor-pointer"
                >
                  <User className="w-3.5 h-3.5 text-[#006a4e]" />
                  <span>My Profile &amp; Demographics</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    onSelectModule('settings');
                    setProfileOpen(false);
                  }}
                  className="w-full text-left px-3 py-1.5 text-slate-700 hover:bg-[#edf6f2] hover:text-[#006a4e] font-medium flex items-center gap-2 cursor-pointer"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-[#006a4e]" />
                  <span>Portal Security &amp; Settings</span>
                </button>
              </div>

              <div className="py-1">
                <button
                  type="button"
                  onClick={() => {
                    setProfileOpen(false);
                    onSwitchRole();
                  }}
                  className="w-full text-left px-3 py-1.5 text-slate-700 hover:bg-slate-50 font-medium flex items-center gap-2 cursor-pointer"
                >
                  <ArrowLeftRight className="w-3.5 h-3.5 text-slate-400" />
                  <span>Switch Role</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setProfileOpen(false);
                    onGoHome();
                  }}
                  className="w-full text-left px-3 py-1.5 text-slate-700 hover:bg-slate-50 font-medium flex items-center gap-2 cursor-pointer"
                >
                  <Globe className="w-3.5 h-3.5 text-slate-400" />
                  <span>Hospital Website</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setProfileOpen(false);
                    onSwitchRole();
                  }}
                  className="w-full text-left px-3 py-1.5 text-rose-600 hover:bg-rose-50 font-medium flex items-center gap-2 cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5 text-rose-500" />
                  <span>Logout</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
