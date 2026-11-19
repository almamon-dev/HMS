import React, { useState } from 'react';
import { X, Lock, Mail, ShieldCheck, ArrowRight, CheckCircle2 } from 'lucide-react';
import { RoleCard } from '../data/rolesData';
import { RoleIcon } from './RoleIcon';

interface LoginModalProps {
  card: RoleCard | null;
  onClose: () => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({ card, onClose }) => {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  if (!card) return null;

  const handleDemoLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
    }, 700);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden">
        {/* Header decoration */}
        <div className="bg-gradient-to-r from-teal-600 to-emerald-600 px-6 py-5 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center backdrop-blur-xs text-white">
              <RoleIcon name={card.iconName} className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="font-bold text-lg leading-tight">{card.actionText}</h2>
              <p className="text-teal-100 text-xs">Direct Portal Access & Session</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6">
          {success ? (
            <div className="text-center py-6">
              <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="font-bold text-xl text-slate-800">Welcome to {card.title} Portal</h3>
              <p className="text-slate-500 text-sm mt-1.5 mb-6">
                Authenticated successfully as <span className="font-semibold text-slate-700">{card.email || 'demo@hospital.local'}</span>.
              </p>
              <button
                onClick={onClose}
                className="w-full py-3 bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-xl transition-all shadow-xs"
              >
                Continue to Dashboard
              </button>
            </div>
          ) : (
            <form onSubmit={handleDemoLogin} className="space-y-4">
              <div className="bg-slate-50 border border-slate-200/70 rounded-xl p-3.5 text-xs text-slate-600 flex items-start gap-2.5">
                <ShieldCheck className="w-5 h-5 text-teal-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-slate-800">Demo Quick Access:</span> Credentials for{' '}
                  <span className="font-semibold text-teal-700">{card.title}</span> are pre-loaded below for testing.
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Email Address</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    readOnly
                    value={card.email || `${card.id}@hospital.local`}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-800 font-medium focus:outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Password</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    readOnly
                    value="••••••••••••"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-800 font-medium focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-xl transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer"
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <span>{card.actionText}</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>

              <p className="text-center text-[11px] text-slate-400 mt-2">
                Protected by Provider RBAC & Token Auth
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

