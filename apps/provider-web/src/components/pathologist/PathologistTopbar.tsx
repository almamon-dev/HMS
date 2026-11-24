import React from 'react';
import {
  AlertCircle,
  Bell,
  CheckCircle,
  ChevronRight,
  Menu,
  PanelLeftClose,
  PanelLeftOpen,
  Search,
} from 'lucide-react';
import { CURRENT_PATHOLOGIST } from '../../data/pathologistPortalData';

interface PathologistTopbarProps {
  currentModule: string;
  onSelectModule: (moduleId: string) => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
  onOpenMobile: () => void;
  onQuickVerifyNext?: () => void;
  criticalCount?: number;
}

export const PathologistTopbar: React.FC<PathologistTopbarProps> = ({
  currentModule,
  onSelectModule,
  collapsed,
  onToggleCollapse,
  onOpenMobile,
  onQuickVerifyNext,
  criticalCount = 4,
}) => {
  const getModuleTitle = () => {
    switch (currentModule) {
      case 'dashboard':
        return 'Laboratory Overview';
      case 'verification-pending':
        return 'Result Verification & Clinical Review';
      case 'critical-results':
        return 'Critical / Panic Value Alert Management';
      case 'reports-signed':
        return 'Signed Laboratory Reports & QR Verification';
      case 'worklist-requests':
        return 'Patient Test Requests & Clinical Indications';
      case 'worklist-processing':
        return 'Automated Test Processing Queue';
      case 'worklist-samples':
        return 'Sample Tracking & Accessioning';
      case 'masters-tests':
        return 'Laboratory Test Master Catalog';
      case 'masters-qc':
        return 'Internal QC & Westgard Rules';
      case 'masters-analytics':
        return 'Laboratory Analytics & Turnaround Time';
      case 'profile-settings':
        return 'Pathologist Profile & Digital Signature';
      default:
        return 'Laboratory Diagnostic Suite';
    }
  };

  return (
    <header className="h-16 bg-white border-b border-slate-200/80 sticky top-0 z-30 px-4 flex items-center justify-between font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Left: Toggles & Breadcrumbs */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onOpenMobile}
          className="lg:hidden p-2 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100"
          title="Open Menu"
        >
          <Menu size={20} />
        </button>

        <button
          type="button"
          onClick={onToggleCollapse}
          className="hidden lg:flex p-2 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          title={collapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
        >
          {collapsed ? <PanelLeftOpen size={18} /> : <PanelLeftClose size={18} />}
        </button>

        <div className="hidden sm:flex items-center gap-2 text-[13px] text-slate-500">
          <span className="font-medium text-slate-400">Pathology</span>
          <ChevronRight size={14} className="text-slate-300" />
          <span className="font-semibold text-slate-800">{getModuleTitle()}</span>
        </div>
      </div>

      {/* Right: Quick Actions, Panic Badge, Search & Profile */}
      <div className="flex items-center gap-3">
        {/* Search Bar */}
        <div className="hidden md:flex items-center relative w-56 lg:w-64">
          <Search size={15} className="absolute left-3 text-slate-400" />
          <input
            type="text"
            placeholder="Search patient, UHID, barcode..."
            className="w-full bg-slate-50 hover:bg-slate-100/80 focus:bg-white text-xs pl-9 pr-14 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#006a4e]/20 focus:border-[#006a4e] transition-all"
          />
          <kbd className="absolute right-2 px-1.5 py-0.5 text-[10px] font-mono text-slate-400 bg-white border border-slate-200 rounded">
            ⌘K
          </kbd>
        </div>

        {/* Critical Panic Value Alert Pill */}
        {criticalCount > 0 && (
          <button
            type="button"
            onClick={() => onSelectModule('critical-results')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold hover:bg-rose-100/80 transition-colors shadow-xs animate-pulse cursor-pointer"
            title="Critical Panic Value Alerts requiring immediate ordering doctor notification"
          >
            <AlertCircle size={15} className="text-rose-600 shrink-0" />
            <span className="hidden sm:inline">Critical Panic:</span>
            <span className="bg-rose-600 text-white text-[11px] font-bold px-1.5 py-0.2 rounded-full">
              {criticalCount}
            </span>
          </button>
        )}

        {/* Quick Review Next Button */}
        <button
          type="button"
          onClick={() => {
            if (onQuickVerifyNext) {
              onQuickVerifyNext();
            } else {
              onSelectModule('verification-pending');
            }
          }}
          className="hidden sm:flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#006a4e] text-white hover:bg-[#00523c] text-xs font-semibold transition-all shadow-xs cursor-pointer"
        >
          <CheckCircle size={15} />
          <span>Review Next Result</span>
        </button>

        {/* Notification Bell */}
        <button
          type="button"
          onClick={() => onSelectModule('verification-pending')}
          className="relative p-2 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors"
          title="Verification Queue Notifications"
        >
          <Bell size={18} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#FF4A1F]" />
        </button>

        {/* Doctor Info Pill */}
        <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
          <div className="w-8 h-8 rounded-full bg-teal-100 border border-teal-200 text-[#006a4e] flex items-center justify-center font-bold text-xs">
            NJ
          </div>
          <div className="hidden xl:flex flex-col text-left">
            <span className="text-[12.5px] font-bold text-slate-800 leading-tight">
              {CURRENT_PATHOLOGIST.name}
            </span>
            <span className="text-[10px] text-teal-700 font-medium">
              Consultant Pathologist
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};
