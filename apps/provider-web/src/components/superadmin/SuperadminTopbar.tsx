import React, { useEffect, useRef, useState } from 'react';
import {
  ArrowLeftRight,
  Bell,
  ChevronDown,
  Globe,
  LogOut,
  Menu,
  MessageSquare,
  Search,
} from 'lucide-react';
import { SUPERADMIN_NAV_SECTIONS } from '../../data/superadminNavigation';

interface SuperadminTopbarProps {
  currentModule: string;
  onToggleCollapse: () => void;
  onToggleMobileSidebar: () => void;
  onSelectModule: (moduleId: string) => void;
  onExitSuperadmin: () => void;
  onSwitchRole?: () => void;
}

const MODULE_HEADER_TITLES: Record<string, string> = {
  patient: 'Patient List',
  appointment: 'Appointment List',
  opd: 'OPD - Out Patient',
  pharmacy: 'Pharmacy Bill',
  'blood-bank': 'Blood Bank',
  ambulance: 'Ambulance Call List',
  radiology: 'Radiology',
  'duty-roster': 'Duty Roster',
};

const resolveModuleLabel = (moduleId: string): string => {
  if (MODULE_HEADER_TITLES[moduleId]) return MODULE_HEADER_TITLES[moduleId];
  for (const section of SUPERADMIN_NAV_SECTIONS) {
    for (const item of section.items) {
      if (item.id === moduleId) return item.title;
      const sub = item.subItems?.find((s) => s.id === moduleId);
      if (sub) return sub.title;
    }
  }
  return moduleId.replace(/-/g, ' ');
};

/**
 * Minimal white CareerDirect-style header featuring a bare sidebar toggle,
 * inline module title, Cmd/Ctrl+K quick search, notification triggers, and user pill.
 */
export const SuperadminTopbar: React.FC<SuperadminTopbarProps> = ({
  currentModule,
  onToggleCollapse,
  onToggleMobileSidebar,
  onSelectModule,
  onExitSuperadmin,
  onSwitchRole,
}) => {
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
    ? SUPERADMIN_NAV_SECTIONS.flatMap((section) =>
        section.items.flatMap((item) => {
          const list = item.subItems?.length
            ? item.subItems.map((s) => ({ id: s.id, title: s.title, parent: item.title }))
            : [{ id: item.id, title: item.title, parent: section.title }];
          return list;
        })
      )
        .filter((entry) =>
          entry.title.toLowerCase().includes(searchQuery.trim().toLowerCase())
        )
        .slice(0, 6)
    : [];

  const moduleTitle = resolveModuleLabel(currentModule);

  return (
    <header className="h-14 sm:h-[60px] bg-white border-b border-slate-200/80 sticky top-0 z-30 flex items-center justify-between px-4 sm:px-5 gap-4">
      {/* Left: Clean Hamburger Toggle + Title + Inline Search Bar */}
      <div className="flex items-center gap-3.5 min-w-0 flex-1">
        <button
          type="button"
          onClick={onToggleCollapse}
          aria-label="Toggle sidebar"
          className="hidden lg:flex p-1.5 rounded-md text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors cursor-pointer"
        >
          <Menu className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={onToggleMobileSidebar}
          aria-label="Open menu"
          className="lg:hidden p-1.5 rounded-md text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors cursor-pointer"
        >
          <Menu className="w-4 h-4" />
        </button>

        <h1 className="text-sm font-semibold text-slate-800 truncate capitalize">
          {moduleTitle}
        </h1>

        {/* CarrierDirect-Style Search Bar with ⌘K shortcut */}
        <div className="hidden md:block relative w-full max-w-[270px] ml-2">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            ref={searchInputRef}
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search modules, patients..."
            className="w-full h-9 bg-slate-50/90 border border-slate-200 rounded-full pl-8 pr-11 text-xs text-slate-700 placeholder:text-slate-400 focus:outline-hidden focus:bg-white focus:border-[#0094b6]"
          />
          <kbd className="absolute right-2.5 top-1/2 -translate-y-1/2 px-1.5 py-0.5 text-[10px] font-semibold text-slate-400 bg-white border border-slate-200 rounded">
            ⌘K
          </kbd>

          {searchMatches.length > 0 && (
            <div className="absolute left-0 right-0 mt-1.5 bg-white border border-slate-200 rounded-md shadow-lg py-1 z-50">
              {searchMatches.map((match) => (
                <button
                  key={match.id}
                  type="button"
                  onClick={() => {
                    onSelectModule(match.id);
                    setSearchQuery('');
                  }}
                  className="w-full px-3 py-2 text-left hover:bg-[#edf6f2] flex items-center justify-between text-xs cursor-pointer"
                >
                  <span className="font-semibold text-slate-800">
                    {match.title}
                  </span>
                  <span className="text-[10px] text-slate-400">
                    {match.parent}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Right: Notification, Messages & User Pill */}
      <div className="flex items-center gap-2 shrink-0">
        <button
          type="button"
          aria-label="Notifications"
          className="relative w-9 h-9 rounded-full border border-slate-200 text-slate-500 hover:text-slate-800 hover:bg-slate-50 flex items-center justify-center transition-colors cursor-pointer"
        >
          <Bell className="w-4 h-4" />
          <span className="absolute top-2 right-2.5 w-1.5 h-1.5 rounded-full bg-[#006a4e]" />
        </button>

        <button
          type="button"
          onClick={() => onSelectModule('messaging')}
          aria-label="Messages"
          className="w-9 h-9 rounded-full border border-slate-200 text-slate-500 hover:text-slate-800 hover:bg-slate-50 flex items-center justify-center transition-colors cursor-pointer"
        >
          <MessageSquare className="w-4 h-4" />
        </button>

        {/* User Profile Pill Dropdown */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowProfileMenu((prev) => !prev)}
            className="flex items-center gap-2 rounded-full border border-slate-200 hover:border-slate-300 bg-white pl-1 pr-2.5 py-1 transition-colors cursor-pointer"
          >
            <div className="w-7 h-7 rounded-full bg-[#006a4e] flex items-center justify-center text-white font-bold text-[11px]">
              SA
            </div>
            <span className="hidden sm:inline text-xs font-semibold text-slate-800">
              Super Admin
            </span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>

          {showProfileMenu && (
            <>
              <div
                onClick={() => setShowProfileMenu(false)}
                className="fixed inset-0 z-40"
              />
              <div className="absolute right-0 mt-1.5 w-48 bg-white border border-slate-200 rounded-md shadow-lg py-1.5 z-50 text-xs">
                <div className="px-3 py-1.5 border-b border-slate-100">
                  <div className="font-bold text-slate-900">Super Admin</div>
                  <div className="text-[11px] text-slate-400">
                    superadmin@hospital.local
                  </div>
                </div>

                {onSwitchRole && (
                  <button
                    type="button"
                    onClick={() => {
                      setShowProfileMenu(false);
                      onSwitchRole();
                    }}
                    className="w-full px-3 py-2 text-left text-slate-700 hover:bg-slate-50 flex items-center gap-2 cursor-pointer"
                  >
                    <ArrowLeftRight className="w-3.5 h-3.5 text-[#0094b6]" />
                    <span>Switch Role</span>
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => {
                    setShowProfileMenu(false);
                    onExitSuperadmin();
                  }}
                  className="w-full px-3 py-2 text-left text-slate-700 hover:bg-slate-50 flex items-center gap-2 cursor-pointer"
                >
                  <Globe className="w-3.5 h-3.5 text-[#006a4e]" />
                  <span>Public Website</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setShowProfileMenu(false);
                    (onSwitchRole ?? onExitSuperadmin)();
                  }}
                  className="w-full px-3 py-2 text-left text-rose-600 hover:bg-rose-50 flex items-center gap-2 cursor-pointer border-t border-slate-100 mt-1 pt-2"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Logout</span>
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default SuperadminTopbar;
