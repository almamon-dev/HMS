import {
  Activity,
  ArrowLeft,
  ArrowRight,
  Eye,
  EyeOff,
  Lock,
  Mail,
  Phone,
  ShieldCheck,
} from 'lucide-react';
import React, { useState } from 'react';
import { ROLES_DATA, RoleCard } from '../../data/rolesData';

interface LoginPageProps {
  initialEmail?: string;
  initialRoleId?: string;
  authNotice?: string;
  onBack: () => void;
  onLoginSuccess: (card: RoleCard) => void;
}

interface QuickDemoRoleButton {
  roleId: string;
  label: string;
  bgClass: string;
}

const QUICK_DEMO_BUTTONS: QuickDemoRoleButton[] = [
  {
    roleId: 'superadmin',
    label: 'Super Admin',
    bgClass: 'bg-[#0277a8] hover:bg-[#01648e]',
  },
  {
    roleId: 'admin',
    label: 'Admin',
    bgClass: 'bg-[#12b5cf] hover:bg-[#0ea0b8]',
  },
  {
    roleId: 'doctor',
    label: 'Doctor',
    bgClass: 'bg-[#8f9195] hover:bg-[#7b7d81]',
  },
  {
    roleId: 'pharmacist',
    label: 'Pharmacist',
    bgClass: 'bg-[#8f9195] hover:bg-[#7b7d81]',
  },
  {
    roleId: 'pathologist',
    label: 'Pathologist',
    bgClass: 'bg-[#de1c5a] hover:bg-[#c5174f]',
  },
  {
    roleId: 'radiologist',
    label: 'Radiologist',
    bgClass: 'bg-[#4a9c46] hover:bg-[#3d833a]',
  },
  {
    roleId: 'accountant',
    label: 'Accountant',
    bgClass: 'bg-[#0090a8] hover:bg-[#007a8f]',
  },
  {
    roleId: 'receptionist',
    label: 'Receptionist',
    bgClass: 'bg-[#0277a8] hover:bg-[#01648e]',
  },
  {
    roleId: 'nurse',
    label: 'Nurse',
    bgClass: 'bg-[#12b5cf] hover:bg-[#0ea0b8]',
  },
];

/**
 * Standalone split-screen portal login view matching the CareerDirect layout:
 * institutional brand showcase panel on the left and sign-in form with a
 * 3x3 QUICK DEMO LOGIN role matrix on the right.
 */
export const LoginPage: React.FC<LoginPageProps> = ({
  initialEmail = '',
  initialRoleId = '',
  authNotice,
  onBack,
  onLoginSuccess,
}) => {
  const [email, setEmail] = useState<string>(initialEmail);
  const [password, setPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [rememberMe, setRememberMe] = useState<boolean>(true);
  const [showResetHelp, setShowResetHelp] = useState<boolean>(false);
  const [selectedDemoRoleId, setSelectedDemoRoleId] = useState<string>(initialRoleId);
  const [formError, setFormError] = useState<string>('');

  React.useEffect(() => {
    if (initialRoleId) {
      handlePrefillDemoRole(initialRoleId);
    }
  }, [initialRoleId]);

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const normalizedEmail = email.trim().toLowerCase();

    if (!normalizedEmail) {
      setFormError('Please enter your hospital portal email address.');
      return;
    }
    if (password.trim().length < 4) {
      setFormError('Please enter a password (at least 4 characters).');
      return;
    }

    const matchedRole = ROLES_DATA.find(
      (role) => role.email && role.email.toLowerCase() === normalizedEmail
    );

    if (!matchedRole) {
      setFormError(
        'Unrecognized email. Use a portal email (e.g. superadmin@hospital.local) or click a Quick Demo Login button below.'
      );
      return;
    }

    setFormError('');
    onLoginSuccess(matchedRole);
  };

  const handlePrefillDemoRole = (roleId: string) => {
    const matched = ROLES_DATA.find((role) => role.id === roleId);
    if (!matched) return;
    setEmail(matched.email || `${matched.id}@hospital.local`);
    setPassword('password123');
    setSelectedDemoRoleId(matched.id);
    setFormError('');
  };

  return (
    <div className="min-h-screen bg-[#f8faf9] grid grid-cols-1 lg:grid-cols-12 font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Left Column: Hospital Brand Showcase */}
      <aside className="hidden lg:flex lg:col-span-5 bg-gradient-to-br from-[#003b2a] via-[#006a4e] to-[#008ba8] text-white p-10 xl:p-12 flex-col justify-between relative overflow-hidden">
        <div
          aria-hidden="true"
          className="absolute -right-24 -bottom-24 w-80 h-80 rounded-full bg-white/5 pointer-events-none"
        />

        {/* Top Navigation + Brand Logo */}
        <div className="space-y-10 relative z-10">
          <button
            type="button"
            onClick={onBack}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-100 hover:text-white transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Hospital Website</span>
          </button>

          <div className="flex items-center gap-3.5">
            <svg
              className="w-11 h-11 shrink-0"
              viewBox="0 0 48 48"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M7 11C13 10 19 14 21 21C13 19 8 15 7 11Z"
                fill="#ffffff"
              />
              <path
                d="M6 19C13 18 19 22 21 29C13 27 7 23 6 19Z"
                fill="#ffffff"
              />
              <path
                d="M7 27C13 26 19 30 21 37C13 35 8 31 7 27Z"
                fill="#ffffff"
              />
              <path
                d="M10 35C15 34 19 37 21 42C15 41 11 38 10 35Z"
                fill="#ffffff"
              />
              <path
                d="M41 11C35 10 29 14 27 21C35 19 40 15 41 11Z"
                fill="#ffffff"
              />
              <path
                d="M42 19C35 18 29 22 27 29C35 27 41 23 42 19Z"
                fill="#ffffff"
              />
              <path
                d="M41 27C35 26 29 30 27 37C35 35 40 31 41 27Z"
                fill="#ffffff"
              />
              <path
                d="M38 35C33 34 29 37 27 42C33 41 37 38 38 35Z"
                fill="#ffffff"
              />
              <path
                d="M23 9C23 9 25 9 25 43C25 43 23 43 23 9Z"
                fill="#ffffff"
              />
            </svg>
            <div className="leading-tight">
              <div className="font-extrabold text-2xl tracking-tight text-white leading-none">
                GREEN
              </div>
              <div className="font-bold text-base tracking-tight text-emerald-100 leading-tight">
                HOSPITAL
              </div>
              <div className="text-[9px] font-bold text-cyan-200 uppercase tracking-[0.22em] leading-none mt-0.5">
                OF BANGLADESH
              </div>
            </div>
          </div>

          <div className="space-y-4 max-w-md pt-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-[3px] bg-white/15 text-emerald-100 text-[11px] font-bold uppercase tracking-wider">
              <ShieldCheck className="w-3.5 h-3.5 text-cyan-200" />
              <span>Unified HMS Portal Suite</span>
            </div>

            <h1 className="text-3xl font-extrabold tracking-tight leading-snug">
              Role-Based Hospital &amp; Clinical Workspace
            </h1>

            <p className="text-sm text-emerald-50/85 leading-relaxed">
              Sign in once to access dedicated dashboards across administration,
              OPD consultations, nursing stations, pharmacy, pathology, imaging,
              accounts, and front-desk reception.
            </p>
          </div>
        </div>

        {/* Bottom Highlights */}
        <div className="space-y-4 relative z-10 pt-8 border-t border-white/15">
          <div className="grid grid-cols-2 gap-4 text-xs">
            <div className="bg-white/10 rounded-[3px] p-3.5 space-y-1">
              <div className="flex items-center gap-1.5 font-bold text-cyan-200">
                <Activity className="w-3.5 h-3.5" />
                <span>Real-Time HMS</span>
              </div>
              <p className="text-[11px] text-emerald-100/85">
                OPD, IPD, PACS &amp; Pharmacy synchronized
              </p>
            </div>

            <div className="bg-white/10 rounded-[3px] p-3.5 space-y-1">
              <div className="flex items-center gap-1.5 font-bold text-cyan-200">
                <Phone className="w-3.5 h-3.5" />
                <span>Hotline 10678</span>
              </div>
              <p className="text-[11px] text-emerald-100/85">
                Dhanmondi • Uttara • Mirpur Campuses
              </p>
            </div>
          </div>

          <p className="text-[11px] text-emerald-100/70">
            &copy; {new Date().getFullYear()} Green Hospital of Bangladesh. All
            rights reserved.
          </p>
        </div>
      </aside>

      {/* Right Column: Clean Login Form + Quick Demo Login Grid */}
      <main className="lg:col-span-7 flex flex-col justify-center px-6 py-8 sm:px-12 bg-white lg:bg-[#f8faf9]">
        <div className="w-full max-w-[580px] mx-auto bg-white lg:rounded-[3px] lg:border lg:border-slate-200/90 lg:shadow-xs sm:p-8 lg:p-9 space-y-6">
          {/* Mobile Back & Mini Brand */}
          <div className="flex items-center justify-between lg:hidden pb-2 border-b border-slate-100">
            <button
              type="button"
              onClick={onBack}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#006a4e]"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Home</span>
            </button>
            <span className="text-xs font-extrabold text-[#006a4e]">
              GREEN HOSPITAL
            </span>
          </div>

          {/* Login Heading */}
          <div>
            <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              Portal Sign In
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Sign in with your institutional account or choose a demo role
              below.
            </p>
          </div>

          {/* Auth Notice Banner */}
          {authNotice && (
            <div className="p-3.5 bg-amber-50 border border-amber-300 rounded-[4px] text-xs text-amber-900 flex items-start gap-2.5 shadow-xs">
              <Lock className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-amber-950">Access Restricted</p>
                <p className="text-[11.5px] text-amber-800 mt-0.5">{authNotice}</p>
              </div>
            </div>
          )}

          {/* Standard Sign-In Form */}
          <form onSubmit={handleFormSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="login-email"
                className="block text-xs font-semibold text-slate-700 mb-1.5"
              >
                Email Address *
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  id="login-email"
                  type="email"
                  required
                  placeholder="superadmin@hospital.local"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setSelectedDemoRoleId('');
                    setFormError('');
                  }}
                  className="w-full h-11 bg-white border border-slate-200 rounded-[3px] pl-10 pr-3.5 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-hidden focus:border-[#0094b6]"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="login-password"
                className="block text-xs font-semibold text-slate-700 mb-1.5"
              >
                Password *
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  id="login-password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setFormError('');
                  }}
                  className="w-full h-11 bg-white border border-slate-200 rounded-[3px] pl-10 pr-10 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-hidden focus:border-[#0094b6]"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1.5 text-slate-400 hover:text-slate-700 cursor-pointer"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs">
              <label className="inline-flex items-center gap-2 text-slate-600 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-3.5 h-3.5 rounded-sm border-slate-300 text-[#006a4e] focus:ring-[#0094b6]"
                />
                <span>Remember me</span>
              </label>

              <button
                type="button"
                onClick={() => setShowResetHelp((prev) => !prev)}
                className="font-semibold text-[#0094b6] hover:underline cursor-pointer"
              >
                Forgot password?
              </button>
            </div>

            {showResetHelp && (
              <p className="text-[11px] text-slate-600 bg-slate-50 border border-slate-200 rounded-[3px] px-3 py-2">
                Contact the Superadmin IT Desk (Ext. 101) for password reset, or
                click any role under Quick Demo Login.
              </p>
            )}

            {formError && (
              <p className="text-xs font-semibold text-red-600 bg-red-50 border border-red-200 rounded-[3px] px-3 py-2">
                {formError}
              </p>
            )}

            <button
              type="submit"
              className="w-full h-11 px-5 rounded-[3px] bg-[#006a4e] hover:bg-[#00553e] text-white text-sm font-bold transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Sign In</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* QUICK DEMO LOGIN 3x3 Grid */}
          <div className="pt-5 border-t border-slate-200 space-y-3.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold tracking-wider uppercase text-slate-500">
                Quick Demo Login
              </span>
              <span className="text-xs font-medium text-[#006a4e]">
                {selectedDemoRoleId
                  ? `Filled: ${ROLES_DATA.find((r) => r.id === selectedDemoRoleId)?.title
                  }`
                  : 'Click a role to auto-fill'}
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2.5">
              {QUICK_DEMO_BUTTONS.map((btn) => {
                const isSelected = selectedDemoRoleId === btn.roleId;
                return (
                  <button
                    key={btn.roleId}
                    type="button"
                    onClick={() => handlePrefillDemoRole(btn.roleId)}
                    className={`h-10 px-2.5 rounded-[3px] text-white text-xs sm:text-[13px] font-bold transition-all flex items-center justify-center truncate cursor-pointer ${btn.bgClass} ${isSelected ? 'ring-2 ring-offset-1 ring-slate-900/40' : ''
                      }`}
                  >
                    {btn.label}
                  </button>
                );
              })}
            </div>

            <div className="pt-2 flex items-center justify-between text-xs text-slate-500">
              <button
                type="button"
                onClick={() => handlePrefillDemoRole('patient')}
                className={`font-semibold hover:underline cursor-pointer ${selectedDemoRoleId === 'patient'
                    ? 'text-[#0094b6] underline'
                    : 'text-[#006a4e]'
                  }`}
              >
                Fill Patient Portal Credentials →
              </button>
              <button
                type="button"
                onClick={onBack}
                className="font-medium text-slate-500 hover:text-slate-800 cursor-pointer"
              >
                Public Website →
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default LoginPage;
