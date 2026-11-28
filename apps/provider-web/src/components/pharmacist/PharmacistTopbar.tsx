import React, { useEffect, useRef, useState } from 'react';
import {
  ArrowLeftRight,
  Bell,
  ChevronDown,
  Globe,
  LogOut,
  Menu,
  Receipt,
  Search,
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
      if (item.subItems) {
        for (const sub of item.subItems) {
          if (sub.id === moduleId) return sub.title;
        }
      }
    }
  }
  return moduleId.replace(/-/g, ' ');
};

/**
 * Superadmin / Doctor - matching header featuring sidebar toggle, module title,
 * Cmd+K quick search, notification triggers, and user pill.
 */
export const PharmacistTopbar: React.FC<PharmacistTopbarProps> = ({
  currentModule,
  onToggleCollapse,
  onToggleMobileSidebar,
  onSelectModule,
  onSwitchRole,
  onGoHome,
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
    ? PHARMACIST_NAV_SECTIONS.flatMap((section) =>
        section.items.map((item) => ({
          id: item.id,
          title: item.title,
          parent: section.title,
        }))
      )
        .filter((entry) =>
          entry.title.toLowerCase().includes(searchQuery.trim().toLowerCase())
        )
        .slice(0, 6)
    : [];

  const moduleTitle = resolvePharmacistModuleTitle(currentModule);

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

        <h1 className="text-sm font-semibold text-slate-800 truncate">
          {moduleTitle}
        </h1>

        {/* CarrierDirect / Doctor Style Search Bar with ⌘K shortcut */}
        <div className="hidden md:block relative w-full max-w-[270px] ml-2">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            ref={searchInputRef}
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search pharmacy modules..."
            className="w-full h-9 bg-slate-50/90 border border-slate-200 rounded-full pl-8 pr-11 text-xs text-slate-700 placeholder:text-slate-400 focus:outline-hidden focus:bg-white focus:border-[#006a4e]"
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

      {/* Right: Notifications, Quick POS & User Profile Pill */}
      <div className="flex items-center gap-2 shrink-0">
        <button
          type="button"
          onClick={() => onSelectModule('batch-expiry')}
          aria-label="Expiry Alerts"
          className="relative w-9 h-9 rounded-full border border-slate-200 text-slate-500 hover:text-slate-800 hover:bg-slate-50 flex items-center justify-center transition-colors cursor-pointer"
        >
          <Bell className="w-4 h-4" />
          <span className="absolute top-2 right-2.5 w-1.5 h-1.5 rounded-full bg-[#006a4e]" />
        </button>

        <button
          type="button"
          onClick={() => onSelectModule('pos-billing')}
          aria-label="POS Terminal"
          className="w-9 h-9 rounded-full border border-slate-200 text-slate-500 hover:text-slate-800 hover:bg-slate-50 flex items-center justify-center transition-colors cursor-pointer"
          title="Open POS Terminal"
        >
          <Receipt className="w-4 h-4" />
        </button>

        {/* User Profile Pill Dropdown */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowProfileMenu((prev) => !prev)}
            className="flex items-center gap-2 p-1 pl-1.5 pr-2.5 rounded-full border border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition-colors cursor-pointer"
          >
            <div className="w-7 h-7 rounded-full bg-[#006a4e] text-white flex items-center justify-center font-bold text-xs ring-2 ring-[#006a4e]/20">
              RI
            </div>
            <div className="hidden sm:block text-left">
              <div className="text-xs font-semibold text-slate-800 leading-tight">
                {CURRENT_PHARMACIST.name.split(',')[0]}
              </div>
              <div className="text-[10px] text-slate-400 leading-tight">
                Pharmacist
              </div>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>

          {showProfileMenu && (
            <div className="absolute right-0 mt-2 w-56 bg-white border border-slate-200 rounded-lg shadow-lg py-1.5 z-50 animate-in fade-in duration-100">
              <div className="px-3 py-2 border-b border-slate-100">
                <div className="text-xs font-bold text-slate-900 truncate">
                  {CURRENT_PHARMACIST.name}
                </div>
                <div className="text-[11px] text-slate-500 truncate">
                  {CURRENT_PHARMACIST.registrationNo}
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  onSelectModule('inventory-master');
                  setShowProfileMenu(false);
                }}
                className="w-full flex items-center gap-2 px-3 py-2 text-xs text-slate-700 hover:bg-[#edf6f2] hover:text-[#006a4e] transition-colors cursor-pointer"
              >
                <UserCog className="w-3.5 h-3.5" />
                <span>Formulary Master</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setShowProfileMenu(false);
                  onSwitchRole();
                }}
                className="w-full flex items-center gap-2 px-3 py-2 text-xs text-slate-700 hover:bg-[#edf6f2] hover:text-[#006a4e] transition-colors cursor-pointer"
              >
                <ArrowLeftRight className="w-3.5 h-3.5" />
                <span>Switch Role / Portal</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setShowProfileMenu(false);
                  onGoHome();
                }}
                className="w-full flex items-center gap-2 px-3 py-2 text-xs text-slate-700 hover:bg-[#edf6f2] hover:text-[#006a4e] transition-colors cursor-pointer"
              >
                <Globe className="w-3.5 h-3.5" />
                <span>Visit Hospital Website</span>
              </button>

              <div className="border-t border-slate-100 my-1" />

              <button
                type="button"
                onClick={() => {
                  setShowProfileMenu(false);
                  onSwitchRole();
                }}
                className="w-full flex items-center gap-2 px-3 py-2 text-xs text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sign Out</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
