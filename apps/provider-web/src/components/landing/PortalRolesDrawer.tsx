import React from 'react';
import { X, ShieldCheck, Sparkles } from 'lucide-react';
import { ROLES_DATA, RoleCard } from '../../data/rolesData';
import { RoleCardItem } from '../RoleCardItem';

interface PortalRolesDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectRole: (card: RoleCard) => void;
}

export const PortalRolesDrawer: React.FC<PortalRolesDrawerProps> = ({
  isOpen,
  onClose,
  onSelectRole,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-6xl max-h-[90vh] bg-slate-50 rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-[#004d36] text-white px-6 py-5 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center text-amber-300">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h2 className="font-extrabold text-lg sm:text-xl tracking-tight">
                Hospital Role Portals & Demo Logins
              </h2>
              <p className="text-emerald-200 text-xs">
                Select any of the 12 clinical or administrative roles to sign in directly.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body with 12 Role Cards */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          <div className="flex items-center justify-between bg-emerald-50 border border-emerald-200 rounded-2xl p-4 text-xs text-[#006a4e]">
            <span className="flex items-center gap-2 font-bold">
              <Sparkles className="w-4 h-4 text-amber-500" />
              Pre-loaded Test Sessions: Superadmin, Doctor, Nurse, Pharmacy, Pathology, Radiology, Accounts, Reception & Patient.
            </span>
            <span className="text-[11px] font-semibold text-slate-500">12 Roles Ready</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {ROLES_DATA.map((card) => (
              <RoleCardItem
                key={card.id}
                card={card}
                onSelectRole={(c) => {
                  onClose();
                  onSelectRole(c);
                }}
              />
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-white border-t border-slate-200 shrink-0 text-center text-xs text-slate-500 flex items-center justify-between">
          <span>Enterprise Hospital Management Platform</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs transition-colors"
          >
            Close Window
          </button>
        </div>
      </div>
    </div>
  );
};


export default PortalRolesDrawer;
