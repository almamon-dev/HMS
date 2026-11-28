import React, { useEffect, useRef, useState } from 'react';
import {
  Bell,
  ChevronDown,
  FileCheck2,
  Globe,
  LogOut,
  Menu,
  Plus,
  Search,
  UserCog,
} from 'lucide-react';
import {
  CURRENT_ACCOUNTANT,
  ACCOUNTANT_NAV_SECTIONS,
  AccountantNavSection,
  AccountantNavItem,
} from '../../data/accountantPortalData';
import { useAccountantLedger } from '../../data/accountantLedgerContext';

interface AccountantTopbarProps {
  currentModule: string;
  onToggleCollapse: () => void;
  onToggleMobileSidebar: () => void;
  onSelectModule: (moduleId: string) => void;
  onSwitchRole: () => void;
  onGoHome: () => void;
}

const resolveAccountantModuleTitle = (moduleId: string): string => {
  for (const section of ACCOUNTANT_NAV_SECTIONS) {
    for (const item of section.items) {
      if (item.id === moduleId) return item.title;
      if (item.subItems) {
        for (const sub of item.subItems) {
          if (sub.id === moduleId) return sub.title;
        }
      }
    }
  }
  return moduleId.replace(/-/g, ' ');
};

export const AccountantTopbar: React.FC<AccountantTopbarProps> = ({
  currentModule,
  onToggleCollapse,
  onToggleMobileSidebar,
  onSelectModule,
  onSwitchRole,
  onGoHome,
}) => {
  const { mode, setMode, stats } = useAccountantLedger();
  const [searchQuery, setSearchQuery] = useState('');
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

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

  const searchMatches = searchQuery.trim()
    ? ACCOUNTANT_NAV_SECTIONS.flatMap((section: AccountantNavSection) =>
        section.items.flatMap((item: AccountantNavItem) => {
          const list = [{ id: item.id, title: item.title, parent: section.title }];
          if (item.subItems) {
            item.subItems.forEach((sub: { id: string; title: string; path: string }) => {
              list.push({ id: sub.id, title: sub.title, parent: item.title });
            });
          }
          return list;
        })
      )
        .filter((entry: { id: string; title: string; parent: string }) =>
          entry.title.toLowerCase().includes(searchQuery.trim().toLowerCase())
        )
        .slice(0, 6)
    : [];

  const moduleTitle = resolveAccountantModuleTitle(currentModule);

  return (
    <header className="min-h-[56px] sm:min-h-[60px] bg-white border-b border-slate-200/80 sticky top-0 z-30 flex items-center justify-between px-3 sm:px-5 py-1.5 gap-2 sm:gap-3 font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Left: Hamburger + Module Title + Command Search */}
      <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
        <button
          type="button"
          onClick={onToggleCollapse}
          aria-label="Toggle sidebar"
          className="hidden lg:flex p-1.5 rounded-md text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors cursor-pointer shrink-0"
        >
          <Menu className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={onToggleMobileSidebar}
          aria-label="Open menu"
          className="lg:hidden p-1.5 rounded-md text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors cursor-pointer shrink-0"
        >
          <Menu className="w-4 h-4" />
        </button>

        <div className="flex flex-col min-w-0">
          <div className="hidden md:flex items-center gap-1.5 text-[10px] text-slate-400 font-semibold tracking-wider uppercase whitespace-nowrap">
            <span>Accounts &amp; Finance</span>
            <span>·</span>
            <span className="text-[#006a4e] font-mono">
              {mode === 'simple' ? 'Simple Mode' : 'Double-Entry ERP'}
            </span>
          </div>
          <h1 className="text-xs sm:text-sm md:text-base font-extrabold text-slate-900 tracking-tight leading-tight truncate capitalize">
            {moduleTitle}
          </h1>
        </div>

        {/* Search Command Input */}
        <div className="relative hidden xl:block w-64 ml-3">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            ref={searchInputRef}
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search accounts & books... (Ctrl+K)"
            className="w-full h-8 pl-8 pr-12 rounded-[4px] bg-slate-50 border border-slate-200/90 text-xs text-slate-800 placeholder-slate-400 focus:outline-hidden focus:bg-white focus:border-[#006a4e] focus:ring-1 focus:ring-[#006a4e]/20 transition-all font-medium"
          />
          <kbd className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] font-mono text-slate-400 bg-white border border-slate-200 px-1 py-0.5 rounded shadow-2xs pointer-events-none">
            Ctrl+K
          </kbd>

          {searchMatches.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-slate-200 rounded-[4px] shadow-lg overflow-hidden z-50">
              <div className="px-3 py-1.5 text-[10.5px] font-bold text-slate-400 uppercase tracking-wider bg-slate-50 border-b border-slate-100">
                Accounting Modules
              </div>
              {searchMatches.map((match: { id: string; title: string; parent: string }) => (
                <button
                  key={match.id}
                  type="button"
                  onClick={() => {
                    onSelectModule(match.id);
                    setSearchQuery('');
                  }}
                  className="w-full text-left px-3 py-2 hover:bg-slate-50 text-xs flex items-center justify-between transition-colors cursor-pointer border-b border-slate-50 last:border-b-0"
                >
                  <span className="font-semibold text-slate-800">{match.title}</span>
                  <span className="text-[10px] text-slate-400 font-medium">{match.parent}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Right: Single-Entry ↔ Double-Entry Mode Toggle + Quick Actions + Profile */}
      <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
        {/* Instant Mode Switcher (pharmacy-care template) */}
        <div
          className="inline-flex items-center bg-slate-100 p-0.5 rounded-[4px] border border-slate-200/90 text-[10.5px] sm:text-[11px] font-bold shrink-0"
          title="Switch between Single-Entry (Simple) and Double-Entry (Advanced) Ledger Mode"
        >
          <button
            type="button"
            onClick={() => setMode('simple')}
            className={`px-2 sm:px-2.5 py-1 rounded-[3px] transition-all cursor-pointer whitespace-nowrap ${
              mode === 'simple'
                ? 'bg-white text-[#006a4e] shadow-2xs'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <span className="sm:hidden">Single</span>
            <span className="hidden sm:inline">Single-Entry</span>
          </button>
          <button
            type="button"
            onClick={() => setMode('advanced')}
            className={`px-2 sm:px-2.5 py-1 rounded-[3px] transition-all cursor-pointer whitespace-nowrap ${
              mode === 'advanced'
                ? 'bg-white text-[#FF4A1F] shadow-2xs'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <span className="sm:hidden">Double</span>
            <span className="hidden sm:inline">Double-Entry</span>
          </button>
        </div>

        {/* Mode-Aware Quick Entry Trigger */}
        <button
          type="button"
          onClick={() =>
            onSelectModule(mode === 'simple' ? 'entry-multi' : 'journal-entry')
          }
          className="hidden md:inline-flex items-center gap-1 h-8 px-3 rounded-[3px] bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 hover:text-slate-900 text-xs font-semibold cursor-pointer shadow-2xs transition-colors whitespace-nowrap"
        >
          <Plus className="w-3.5 h-3.5 text-slate-500" />
          <span>{mode === 'simple' ? 'Multi Entry' : 'Journal (Dr/Cr)'}</span>
        </button>

        {/* Discharge Bill Clearance */}
        <button
          type="button"
          onClick={() => onSelectModule('billing-invoices')}
          className="hidden xl:inline-flex items-center gap-1.5 h-8 px-3 rounded-[3px] bg-[#006a4e] hover:bg-[#00553e] text-white text-xs font-semibold cursor-pointer shadow-xs transition-colors whitespace-nowrap"
          title="Discharge Bill Clearance"
        >
          <FileCheck2 className="w-3.5 h-3.5" />
          <span>IPD Clearance</span>
        </button>

        {/* Pending Approvals / Alerts Badge */}
        <button
          type="button"
          onClick={() => onSelectModule('expenses-vouchers')}
          className="w-8 h-8 rounded-[4px] border border-slate-200 bg-white hover:bg-slate-50 flex items-center justify-center text-slate-500 hover:text-slate-800 transition-colors cursor-pointer relative shrink-0"
          title={`${stats.pendingApprovalCount} Voucher Approvals Pending`}
        >
          <Bell className="w-4 h-4" />
          {stats.pendingApprovalCount > 0 && (
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-rose-500 text-white rounded-full text-[9px] font-bold flex items-center justify-center border-2 border-white shadow-xs">
              {stats.pendingApprovalCount}
            </span>
          )}
        </button>

        {/* User Profile Dropdown */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowProfileMenu((prev) => !prev)}
            className="flex items-center gap-2 p-1 rounded-[4px] hover:bg-slate-50 border border-transparent hover:border-slate-200 transition-all cursor-pointer shrink-0"
          >
            <div className="w-7 h-7 rounded-full bg-[#006a4e] text-white font-bold text-xs flex items-center justify-center shrink-0 shadow-2xs">
              RI
            </div>
            <div className="hidden xl:flex flex-col text-left leading-tight">
              <span className="text-xs font-bold text-slate-900">
                {CURRENT_ACCOUNTANT.name.split(',')[0]}
              </span>
              <span className="text-[10px] text-slate-500 font-medium">
                Chief Accountant
              </span>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden sm:block" />
          </button>

          {showProfileMenu && (
            <div className="absolute right-0 top-full mt-1.5 w-60 bg-white border border-slate-200 rounded-[4px] shadow-xl py-1 z-50">
              <div className="px-3.5 py-2.5 border-b border-slate-100">
                <span className="block text-xs font-bold text-slate-900">
                  {CURRENT_ACCOUNTANT.name}
                </span>
                <span className="block text-[11px] text-slate-500 font-mono mt-0.5">
                  {CURRENT_ACCOUNTANT.certNo}
                </span>
              </div>
              <div className="py-1">
                <button
                  type="button"
                  onClick={() => {
                    setShowProfileMenu(false);
                    onGoHome();
                  }}
                  className="w-full text-left px-3.5 py-2 text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2 cursor-pointer font-medium"
                >
                  <Globe className="w-3.5 h-3.5 text-slate-400" />
                  <span>Public Hospital Portal</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowProfileMenu(false);
                    onSwitchRole();
                  }}
                  className="w-full text-left px-3.5 py-2 text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2 cursor-pointer font-medium"
                >
                  <UserCog className="w-3.5 h-3.5 text-slate-400" />
                  <span>Switch User Role</span>
                </button>
              </div>
              <div className="pt-1 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => {
                    setShowProfileMenu(false);
                    onSwitchRole();
                  }}
                  className="w-full text-left px-3.5 py-2 text-xs text-rose-600 hover:bg-rose-50 flex items-center gap-2 cursor-pointer font-semibold"
                >
                  <LogOut className="w-3.5 h-3.5 text-rose-500" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
