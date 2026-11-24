import React, { useState } from 'react';
import {
  Bell,
  Save,
  ShieldCheck,
  Upload,
  UserCheck,
  UserCog,
} from 'lucide-react';
import { CURRENT_PATHOLOGIST } from '../../data/pathologistPortalData';

export const PathologistProfileView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'credentials' | 'signature' | 'notifications'>('credentials');
  const [isSaved, setIsSaved] = useState<boolean>(false);

  return (
    <div className="space-y-6 font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-slate-900 flex items-center gap-2.5">
            <UserCog size={24} className="text-[#006a4e]" />
            <span>Pathologist Profile & Authorizations</span>
          </h1>
          <p className="text-xs md:text-sm text-slate-500 mt-1">
            BMDC medical registration, specialization credentials, digital cryptographic signature, and panic alert routing.
          </p>
        </div>
      </div>

      {/* Horizontal Sub-tabs (Image 1 reference styling) */}
      <div className="flex items-center gap-6 border-b border-slate-200 text-xs md:text-sm font-semibold select-none overflow-x-auto">
        <button
          type="button"
          onClick={() => setActiveTab('credentials')}
          className={`flex items-center gap-2 pb-3 cursor-pointer whitespace-nowrap transition-colors ${
            activeTab === 'credentials'
              ? 'text-[#006a4e] border-b-2 border-[#006a4e] -mb-[1px] font-bold'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <UserCheck size={16} />
          <span>Doctor Credentials & License</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('signature')}
          className={`flex items-center gap-2 pb-3 cursor-pointer whitespace-nowrap transition-colors ${
            activeTab === 'signature'
              ? 'text-[#006a4e] border-b-2 border-[#006a4e] -mb-[1px] font-bold'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <ShieldCheck size={16} />
          <span>Digital Signature & Stamp</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('notifications')}
          className={`flex items-center gap-2 pb-3 cursor-pointer whitespace-nowrap transition-colors ${
            activeTab === 'notifications'
              ? 'text-[#006a4e] border-b-2 border-[#006a4e] -mb-[1px] font-bold'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <Bell size={16} />
          <span>Critical Alert Preferences</span>
        </button>
      </div>

      {/* Main Single-Layer Surface (NO nested cards) */}
      <div className="bg-white rounded-xl border border-slate-200/80 shadow-xs p-6">
        {/* Tab 1: Doctor Credentials */}
        {activeTab === 'credentials' && (
          <div className="space-y-6 max-w-4xl">
            <div className="flex items-start gap-4 pb-6 border-b border-slate-100">
              <div className="w-16 h-16 rounded-2xl bg-teal-50 border border-teal-200 text-[#006a4e] flex items-center justify-center font-bold text-xl shrink-0">
                NJ
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">
                  {CURRENT_PATHOLOGIST.name}
                </h3>
                <p className="text-xs text-teal-800 font-semibold mt-0.5">
                  {CURRENT_PATHOLOGIST.designation}
                </p>
                <div className="flex items-center gap-2 mt-2">
                  <span className="px-2 py-0.5 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded font-mono text-xs font-bold">
                    BMDC Reg: {CURRENT_PATHOLOGIST.bmdcRegNo}
                  </span>
                  <span className="text-xs text-slate-500">
                    Valid until {CURRENT_PATHOLOGIST.licenseValidUntil}
                  </span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block text-slate-500 font-semibold mb-1">
                  Medical Qualifications
                </label>
                <input
                  type="text"
                  readOnly
                  value={CURRENT_PATHOLOGIST.qualification}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 font-medium"
                />
              </div>

              <div>
                <label className="block text-slate-500 font-semibold mb-1">
                  Diagnostic Specialization
                </label>
                <input
                  type="text"
                  readOnly
                  value={CURRENT_PATHOLOGIST.specialization}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 font-medium"
                />
              </div>

              <div>
                <label className="block text-slate-500 font-semibold mb-1">
                  Official Email Address
                </label>
                <input
                  type="email"
                  readOnly
                  value={CURRENT_PATHOLOGIST.email}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-500 font-semibold mb-1">
                  Direct Duty Phone
                </label>
                <input
                  type="text"
                  readOnly
                  value={CURRENT_PATHOLOGIST.phone}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 font-mono"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-slate-500 font-semibold mb-1">
                  Department & Hospital Facility
                </label>
                <input
                  type="text"
                  readOnly
                  value={`${CURRENT_PATHOLOGIST.department} — ${CURRENT_PATHOLOGIST.hospitalBranch}`}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 font-medium"
                />
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Digital Signature & Stamp */}
        {activeTab === 'signature' && (
          <div className="space-y-6 max-w-2xl">
            <div>
              <h3 className="font-bold text-slate-900 text-sm">
                Authorized Cryptographic Digital Signature
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Appended to all official PDF reports and verified through the Green Life Public QR Verification portal.
              </p>
            </div>

            {/* Stamp Simulation Card */}
            <div className="p-6 border-2 border-dashed border-teal-300 rounded-2xl bg-teal-50/40 text-center space-y-3">
              <div className="font-serif italic text-2xl text-[#006a4e] font-bold">
                Dr. Nusrat Jahan
              </div>
              <div className="text-xs font-bold text-slate-800">
                {CURRENT_PATHOLOGIST.name}
              </div>
              <div className="text-[11px] text-slate-600">
                {CURRENT_PATHOLOGIST.qualification}
              </div>
              <div className="font-mono text-xs font-bold text-teal-800">
                BMDC Reg: {CURRENT_PATHOLOGIST.bmdcRegNo}
              </div>
              <div className="text-[10px] font-mono text-slate-400">
                Hash: 0x9f82b7c4a1e94812f00a... (ECDSA Secp256k1)
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => alert('Please select a PNG signature image with transparent background.')}
                className="px-4 py-2 border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-xl flex items-center gap-1.5 cursor-pointer"
              >
                <Upload size={14} />
                <span>Upload Fresh Signature Image</span>
              </button>
            </div>
          </div>
        )}

        {/* Tab 3: Critical Alert Preferences */}
        {activeTab === 'notifications' && (
          <div className="space-y-4 max-w-2xl text-xs">
            <div>
              <h3 className="font-bold text-slate-900 text-sm">
                Critical Value Emergency Notification Rules
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Configure immediate delivery channels when automated analyzers report panic levels.
              </p>
            </div>

            <div className="space-y-3 pt-2">
              <label className="flex items-start gap-3 p-3.5 bg-slate-50 rounded-xl border border-slate-200 cursor-pointer">
                <input
                  type="checkbox"
                  defaultChecked
                  className="mt-0.5 rounded text-[#006a4e] focus:ring-[#006a4e]"
                />
                <div>
                  <span className="font-bold text-slate-900 block">
                    Immediate SMS Alert to Pathologist Mobile
                  </span>
                  <span className="text-slate-500 block mt-0.5">
                    Receive urgent SMS whenever Troponin, Potassium, or Platelet panic limits are triggered.
                  </span>
                </div>
              </label>

              <label className="flex items-start gap-3 p-3.5 bg-slate-50 rounded-xl border border-slate-200 cursor-pointer">
                <input
                  type="checkbox"
                  defaultChecked
                  className="mt-0.5 rounded text-[#006a4e] focus:ring-[#006a4e]"
                />
                <div>
                  <span className="font-bold text-slate-900 block">
                    Auto-Prompt Ordering Physician Direct Dial
                  </span>
                  <span className="text-slate-500 block mt-0.5">
                    Open telephonic logging modal automatically upon opening the critical alerts tab.
                  </span>
                </div>
              </label>
            </div>

            <div className="pt-4">
              <button
                type="button"
                onClick={() => {
                  setIsSaved(true);
                  setTimeout(() => setIsSaved(false), 1500);
                }}
                className="px-5 py-2 bg-[#006a4e] hover:bg-[#00523c] text-white text-xs font-bold rounded-xl transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
              >
                <Save size={14} />
                <span>{isSaved ? 'Settings Saved!' : 'Save Notification Rules'}</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
