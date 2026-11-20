import {
  Award,
  CheckCircle2,
  Clock,
  DollarSign,
  KeyRound,
  Lock,
  Save,
  User,
} from 'lucide-react';
import React, { useState } from 'react';
import { CURRENT_DOCTOR, DoctorProfile } from '../../data/doctorPortalData';
import { SummaryCard, SummaryCardGrid } from '../common/SummaryCard';

export const DoctorProfileSettingsView: React.FC = () => {
  const [profile, setProfile] = useState<DoctorProfile>(CURRENT_DOCTOR);
  const [opdFee, setOpdFee] = useState(profile.opdFee);
  const [videoFee, setVideoFee] = useState(profile.videoFee);
  const [followupFee, setFollowupFee] = useState(profile.followupFee);
  const [phone, setPhone] = useState(profile.phone);
  const [email, setEmail] = useState(profile.email);
  const [biography, setBiography] = useState(profile.biography);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Security Form
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [securitySuccess, setSecuritySuccess] = useState(false);

  const [activeTab, setActiveTab] = useState<'profile' | 'fees' | 'security'>('profile');

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setProfile({
      ...profile,
      opdFee,
      videoFee,
      followupFee,
      phone,
      email,
      biography,
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleSavePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPassword || newPassword !== confirmPassword) return;
    setSecuritySuccess(true);
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setTimeout(() => setSecuritySuccess(false), 3000);
  };

  return (
    <div className="space-y-2">
      {/* 4 Summary Metric Cards matching Appointment format */}
      <SummaryCardGrid>
        <SummaryCard
          title="BMDC Registration"
          icon={Award}
          iconColor="text-[#006a4e]"
          value={profile.bmdcReg}
          subtitle={
            <span className="text-[10px] text-[#006a4e] font-semibold flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" />
              <span>Verified & Active</span>
            </span>
          }
        />
        <SummaryCard
          title="OPD Consultation Fee"
          icon={DollarSign}
          iconColor="text-cyan-600"
          value={opdFee}
          valueColor="text-cyan-700"
          subtitle="Physical OPD chamber"
        />
        <SummaryCard
          title="Teleconsultation Fee"
          icon={DollarSign}
          iconColor="text-amber-600"
          value={videoFee}
          valueColor="text-amber-700"
          subtitle="Video consultation slot"
        />
        <SummaryCard
          title="Chamber Location"
          icon={Clock}
          iconColor="text-[#006a4e]"
          value={profile.room}
          subtitle={profile.department}
        />
      </SummaryCardGrid>

      {/* Tab Navigation matching Superadmin */}
      <div className="flex items-center gap-1.5 border-b border-slate-200 pb-2">
        <button
          type="button"
          onClick={() => setActiveTab('profile')}
          className={`px-3 py-1.5 rounded-[3px] text-xs font-semibold transition-colors cursor-pointer flex items-center gap-1.5 ${activeTab === 'profile'
            ? 'bg-[#006a4e] text-white shadow-2xs'
            : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}
        >
          <User className="w-3.5 h-3.5" />
          <span>Profile &amp; Credentials</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('fees')}
          className={`px-3 py-1.5 rounded-[3px] text-xs font-semibold transition-colors cursor-pointer flex items-center gap-1.5 ${activeTab === 'fees'
            ? 'bg-[#006a4e] text-white shadow-2xs'
            : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}
        >
          <DollarSign className="w-3.5 h-3.5" />
          <span>Consultation Fees</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('security')}
          className={`px-3 py-1.5 rounded-[3px] text-xs font-semibold transition-colors cursor-pointer flex items-center gap-1.5 ${activeTab === 'security'
            ? 'bg-[#006a4e] text-white shadow-2xs'
            : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}
        >
          <KeyRound className="w-3.5 h-3.5" />
          <span>Portal Security</span>
        </button>
      </div>

      {/* Profile Form */}
      {activeTab === 'profile' && (
        <form onSubmit={handleSaveProfile} className="bg-white rounded-md border border-slate-200/80 shadow-2xs p-4 space-y-4">
          {savedSuccess && (
            <div className="p-2.5 rounded-md bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Doctor credentials &amp; contact details updated successfully.</span>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">
                Full Doctor Name &amp; Title
              </label>
              <input
                type="text"
                disabled
                value={profile.name}
                className="w-full h-8 px-2.5 rounded-[3px] border border-slate-200 bg-slate-50 text-slate-600 cursor-not-allowed font-semibold"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">
                Designation &amp; Qualifications
              </label>
              <input
                type="text"
                disabled
                value={profile.qualification}
                className="w-full h-8 px-2.5 rounded-[3px] border border-slate-200 bg-slate-50 text-slate-600 cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">
                Clinical Department
              </label>
              <input
                type="text"
                disabled
                value={profile.department}
                className="w-full h-8 px-2.5 rounded-[3px] border border-slate-200 bg-slate-50 text-slate-600 cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">
                BMDC Registration Number
              </label>
              <input
                type="text"
                disabled
                value={profile.bmdcReg}
                className="w-full h-8 px-2.5 rounded-[3px] border border-slate-200 bg-slate-50 text-slate-600 cursor-not-allowed font-semibold"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">
                Official Contact Phone <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full h-8 px-2.5 rounded-[3px] border border-slate-300 bg-white text-slate-800 focus:outline-hidden focus:border-[#006a4e]"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">
                Hospital Email ID <span className="text-rose-500">*</span>
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full h-8 px-2.5 rounded-[3px] border border-slate-300 bg-white text-slate-800 focus:outline-hidden focus:border-[#006a4e]"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-[11px] font-bold text-slate-700 mb-1">
                Doctor Biography &amp; Clinical Background
              </label>
              <textarea
                rows={3}
                value={biography}
                onChange={(e) => setBiography(e.target.value)}
                className="w-full p-2.5 rounded-[3px] border border-slate-300 bg-white text-slate-800 focus:outline-hidden focus:border-[#006a4e]"
              />
            </div>
          </div>

          <div className="flex items-center justify-end pt-2 border-t border-slate-100">
            <button
              type="submit"
              className="h-8 px-4 rounded-[3px] bg-[#006a4e] hover:bg-[#00523c] text-white text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save Changes</span>
            </button>
          </div>
        </form>
      )}

      {/* Fees Form */}
      {activeTab === 'fees' && (
        <form onSubmit={handleSaveProfile} className="bg-white rounded-md border border-slate-200/80 shadow-2xs p-4 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">
                New OPD Consultation Fee
              </label>
              <input
                type="text"
                value={opdFee}
                onChange={(e) => setOpdFee(e.target.value)}
                className="w-full h-8 px-2.5 rounded-[3px] border border-slate-300 bg-white text-slate-800 focus:outline-hidden focus:border-[#006a4e] font-semibold"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">
                Follow-up Consultation Fee
              </label>
              <input
                type="text"
                value={followupFee}
                onChange={(e) => setFollowupFee(e.target.value)}
                className="w-full h-8 px-2.5 rounded-[3px] border border-slate-300 bg-white text-slate-800 focus:outline-hidden focus:border-[#006a4e] font-semibold"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">
                Teleconsultation / Video Fee
              </label>
              <input
                type="text"
                value={videoFee}
                onChange={(e) => setVideoFee(e.target.value)}
                className="w-full h-8 px-2.5 rounded-[3px] border border-slate-300 bg-white text-slate-800 focus:outline-hidden focus:border-[#006a4e] font-semibold"
              />
            </div>
          </div>

          <div className="flex items-center justify-end pt-2 border-t border-slate-100">
            <button
              type="submit"
              className="h-8 px-4 rounded-[3px] bg-[#006a4e] hover:bg-[#00523c] text-white text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Update Fee Schedule</span>
            </button>
          </div>
        </form>
      )}

      {/* Security Form */}
      {activeTab === 'security' && (
        <form onSubmit={handleSavePassword} className="bg-white rounded-md border border-slate-200/80 shadow-2xs p-4 space-y-4 max-w-xl">
          {securitySuccess && (
            <div className="p-2.5 rounded-md bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Password updated successfully.</span>
            </div>
          )}

          <div className="space-y-3 text-xs">
            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">
                Current Password <span className="text-rose-500">*</span>
              </label>
              <input
                type="password"
                required
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full h-8 px-2.5 rounded-[3px] border border-slate-300 bg-white text-slate-800 focus:outline-hidden focus:border-[#006a4e]"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">
                New Password <span className="text-rose-500">*</span>
              </label>
              <input
                type="password"
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full h-8 px-2.5 rounded-[3px] border border-slate-300 bg-white text-slate-800 focus:outline-hidden focus:border-[#006a4e]"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">
                Confirm New Password <span className="text-rose-500">*</span>
              </label>
              <input
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full h-8 px-2.5 rounded-[3px] border border-slate-300 bg-white text-slate-800 focus:outline-hidden focus:border-[#006a4e]"
              />
            </div>
          </div>

          <div className="flex items-center justify-end pt-2 border-t border-slate-100">
            <button
              type="submit"
              className="h-8 px-4 rounded-[3px] bg-[#006a4e] hover:bg-[#00523c] text-white text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Change Password</span>
            </button>
          </div>
        </form>
      )}
    </div>
  );
};
