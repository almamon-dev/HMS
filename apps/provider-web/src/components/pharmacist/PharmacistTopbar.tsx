import React, { useEffect, useRef, useState } from 'react';
import {
  Bell,
  Building2,
  ChevronDown,
  Globe,
  LogOut,
  Menu,
  QrCode,
  Search,
  ShieldCheck,
  UserCog,
} from 'lucide-react';
import {
  CURRENT_PHARMACIST,
  PHARMACIST_NAV_SECTIONS,
} from '../../data/pharmacistPortalData';

interface PharmacistTopbarProps {
  currentModule: string;
  onToggleCollapse: () => void;
  onToggleMobileSidebar: () => void;
  onSelectModule: (moduleId: string) => void;
  onSwitchRole: () => void;
  onGoHome: () => void;
}

const resolvePharmacistModuleTitle = (moduleId: string): string => {
  for (const section of PHARMACIST_NAV_SECTIONS) {
    for (const item of section.items) {
      if (item.id === moduleId) return item.title;
    }
  }
  return moduleId.replace(/-/g, ' ');
};

export const PharmacistTopbar: React.FC<PharmacistTopbarProps> = ({
  currentModule,
  onToggleCollapse,
  onToggleMobileSidebar,
  onSelectModule,
  onSwitchRole,
  onGoHome,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBranch, setSelectedBranch] = useState('Central Medical Store');
  const [showBranchMenu, setShowBranchMenu] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const branches = [
    { id: 'cms', name: 'Central Medical Store', type: 'Central Warehouse' },
    { id: 'dhanmondi', name: 'Dhanmondi Outpatient Pharmacy', type: 'Retail & Outpatient' },
    { id: 'uttara', name: 'Uttara Branch Pharmacy', type: 'Emergency & Inpatient' },
    { id: 'mirpur', name: 'Mirpur Branch Pharmacy', type: 'Retail Store' },
  ];

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  return (
    <header className="sticky top-0 z-30 h-14 sm:h-[60px] bg-white border-b border-slate-200/80 px-3 sm:px-6 flex items-center justify-between gap-3 shadow-xs">
      {/* Left: Mobile Toggle / Desktop Collapse & Module Title */}
      <div className="flex items-center gap-2 sm:gap-3 min-w-0">
        <button
          onClick={onToggleMobileSidebar}
          className="lg:hidden p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
          title="Open Menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <button
          onClick={onToggleCollapse}
          className="hidden lg:flex p-2 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
          title="Toggle Sidebar Width"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 min-w-0 font-['Inter',sans-serif]">
          <span className="text-[11px] font-semibold tracking-wide text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 hidden sm:inline-block">
            Pharmacy Portal
          </span>
          <span className="text-slate-300 hidden sm:inline">/</span>
          <h1 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight truncate">
            {resolvePharmacistModuleTitle(currentModule)}
          </h1>
        </div>
      </div>

      {/* Center: Branch Selector */}
      <div className="relative hidden md:block">
        <button
          onClick={() => setShowBranchMenu(!showBranchMenu)}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors border border-slate-200"
        >
          <Building2 className="w-3.5 h-3.5 text-teal-600" />
          <span className="truncate max-w-[200px]">{selectedBranch}</span>
          <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
        </button>

        {showBranchMenu && (
          <div className="absolute left-0 mt-1 w-64 bg-white rounded-lg shadow-xl border border-slate-200 py-1.5 z-50">
            <div className="px-3 py-1.5 text-[11px] font-semibold text-slate-500 border-b border-slate-100">
              Select Pharmacy Branch
            </div>
            {branches.map((b) => (
              <button
                key={b.id}
                onClick={() => {
                  setSelectedBranch(b.name);
                  setShowBranchMenu(false);
                }}
                className={`w-full text-left px-3 py-2 text-xs flex flex-col hover:bg-slate-50 transition-colors ${
                  selectedBranch === b.name ? 'bg-teal-50/70 font-semibold text-teal-900' : 'text-slate-700'
                }`}
              >
                <span>{b.name}</span>
                <span className="text-[10px] text-slate-400">{b.type}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-2 sm:gap-3 shrink-0">
        {/* Search Input */}
        <div className="relative hidden xl:block w-64">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            ref={searchInputRef}
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search medicine, batch, Rx (Ctrl+K)..."
            className="w-full pl-9 pr-8 py-1.5 bg-slate-100/80 hover:bg-slate-100 focus:bg-white text-xs rounded-lg border border-slate-200 focus:border-teal-500 focus:outline-none transition-all placeholder:text-slate-400"
          />
          <kbd className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] font-semibold text-slate-400 bg-white px-1.5 py-0.5 rounded border border-slate-200">
            ⌘K
          </kbd>
        </div>

        {/* Barcode Fast Action */}
        <button
          onClick={() => onSelectModule('pos-billing')}
          className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-emerald-600 text-white hover:bg-emerald-700 transition-colors shadow-xs cursor-pointer"
          title="Open POS Terminal"
        >
          <QrCode className="w-3.5 h-3.5" />
          <span>Quick POS</span>
        </button>

        {/* Notifications */}
        <button
          onClick={() => onSelectModule('batch-expiry')}
          className="relative p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
          title="Expiry & Reorder Alerts"
        >
          <Bell className="w-4 h-4" />
          <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-amber-500 animate-ping" />
          <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-amber-500" />
        </button>

        {/* Pharmacist Profile Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="flex items-center gap-2 p-1.5 sm:px-2.5 sm:py-1.5 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer border border-transparent hover:border-slate-200"
          >
            <div className="w-7 h-7 rounded-full bg-teal-800 text-white flex items-center justify-center font-bold text-xs ring-2 ring-teal-600/30">
              RI
            </div>
            <div className="hidden md:block text-left">
              <div className="text-xs font-semibold text-slate-800 leading-none">
                {CURRENT_PHARMACIST.name.split(',')[0]}
              </div>
              <div className="text-[10px] text-teal-700 font-medium leading-none mt-1">
                Chief Pharmacist
              </div>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden sm:block" />
          </button>

          {showProfileMenu && (
            <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in slide-in-from-top-1 duration-150">
              <div className="px-4 py-2 border-b border-slate-100">
                <p className="text-xs font-bold text-slate-900">{CURRENT_PHARMACIST.name}</p>
                <p className="text-[11px] text-teal-700 font-medium">{CURRENT_PHARMACIST.designation}</p>
                <div className="mt-1 flex items-center gap-1.5 text-[10px] text-slate-500">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>{CURRENT_PHARMACIST.registrationNo}</span>
                </div>
              </div>

              <div className="p-1">
                <button
                  onClick={() => {
                    setShowProfileMenu(false);
                    onGoHome();
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-xs text-slate-700 hover:bg-slate-50 rounded-lg transition-colors cursor-pointer"
                >
                  <Globe className="w-4 h-4 text-slate-400" />
                  <span>Hospital Home Portal</span>
                </button>

                <button
                  onClick={() => {
                    setShowProfileMenu(false);
                    onSelectModule('inventory-master');
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-xs text-slate-700 hover:bg-slate-50 rounded-lg transition-colors cursor-pointer"
                >
                  <UserCog className="w-4 h-4 text-slate-400" />
                  <span>Store Formulary Master</span>
                </button>

                <div className="my-1 border-t border-slate-100" />

                <button
                  onClick={() => {
                    setShowProfileMenu(false);
                    onSwitchRole();
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-xs text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                >
                  <LogOut className="w-4 h-4 text-rose-500" />
                  <span>Sign Out / Switch Role</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

