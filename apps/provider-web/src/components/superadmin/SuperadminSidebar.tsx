import React, { useState, useMemo } from 'react';
import {
  Hospital,
  Search,
  X,
  ChevronDown,
  ChevronRight,
  LogOut,
  ShieldCheck,
} from 'lucide-react';
import { SUPERADMIN_NAV_SECTIONS, NavItem } from '../../data/superadminNavigation';
import { SuperadminNavIcon } from './SuperadminNavIcon';

interface SuperadminSidebarProps {
  currentModule: string;
  onSelectModule: (moduleId: string) => void;
  isOpen: boolean;
  onCloseMobile: () => void;
  onExitSuperadmin: () => void;
}

export const SuperadminSidebar: React.FC<SuperadminSidebarProps> = ({
  currentModule,
  onSelectModule,
  isOpen,
  onCloseMobile,
  onExitSuperadmin,
}) => {
  const [filterQuery, setFilterQuery] = useState('');
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({
    'birth-death': false,
    'multi-branch': false,
    'qr-attendance': false,
    finance: false,
    'survey-forms': false,
    'download-center': false,
    certificate: false,
    'live-consultation': false,
    reports: false,
    setup: false,
  });

  const toggleExpand = (itemId: string) => {
    setExpandedItems((prev) => ({
      ...prev,
      [itemId]: !prev[itemId],
    }));
  };

  // Filter sections and items based on search query
  const filteredSections = useMemo(() => {
    if (!filterQuery.trim()) {
      return SUPERADMIN_NAV_SECTIONS;
    }
    const q = filterQuery.toLowerCase();
    return SUPERADMIN_NAV_SECTIONS.map((section) => {
      const matchingItems = section.items.filter((item) => {
        const itemMatch = item.title.toLowerCase().includes(q);
        const subMatch = item.subItems?.some((sub) =>
          sub.title.toLowerCase().includes(q)
        );
        return itemMatch || subMatch;
      });
      return {
        ...section,
        items: matchingItems,
      };
    }).filter((section) => section.items.length > 0);
  }, [filterQuery]);

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 z-40 bg-slate-950/60 backdrop-blur-xs lg:hidden transition-opacity"
        />
      )}

      {/* Sidebar container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-72 bg-[#0f172a] text-slate-300 flex flex-col border-r border-slate-800/80 shadow-2xl transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="h-16 px-5 border-b border-slate-800 flex items-center justify-between shrink-0 bg-slate-900/50">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-teal-500 to-emerald-400 flex items-center justify-center text-white shadow-xs">
              <Hospital className="w-5 h-5" />
            </div>
            <div>
              <span className="font-extrabold text-base text-white tracking-tight">
                Smart Hospital
              </span>
              <p className="text-[10px] text-teal-400 font-semibold uppercase tracking-wider">
                Super Admin Panel
              </p>
            </div>
          </div>
          <button
            onClick={onCloseMobile}
            className="lg:hidden w-8 h-8 rounded-lg bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Superadmin User Profile Card */}
        <div className="p-3.5 mx-3 mt-3 bg-slate-900/90 rounded-2xl border border-slate-800/90 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-600 to-cyan-700 flex items-center justify-center text-white font-bold text-sm shadow-xs">
                SA
              </div>
              <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 border-2 border-slate-900 rounded-full" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-white leading-tight">Super Admin</h4>
              <span className="inline-flex items-center gap-1 text-[10px] text-teal-400 font-medium">
                <ShieldCheck className="w-3 h-3" /> System Master
              </span>
            </div>
          </div>
          <button
            onClick={onExitSuperadmin}
            title="Switch back to Public Portal"
            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition-colors"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>

        {/* Live Menu Filter Input (Exact feature from Smart Hospital) */}
        <div className="px-3.5 pt-3 pb-2 shrink-0">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Filter Menu..."
              value={filterQuery}
              onChange={(e) => setFilterQuery(e.target.value)}
              className="w-full bg-slate-900/80 border border-slate-800/90 rounded-xl pl-9 pr-8 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-hidden focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-all"
            />
            {filterQuery && (
              <button
                onClick={() => setFilterQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Scrollable Navigation Items */}
        <div className="flex-1 overflow-y-auto px-3 py-2 space-y-6 custom-scrollbar text-xs">
          {filteredSections.map((section) => (
            <div key={section.title} className="space-y-1">
              <div className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                {section.title}
              </div>

              {section.items.map((item: NavItem) => {
                const isActive = currentModule === item.id;
                const hasSub = item.subItems && item.subItems.length > 0;
                const isExpanded =
                  expandedItems[item.id] || filterQuery.trim().length > 0;

                return (
                  <div key={item.id} className="space-y-0.5">
                    <button
                      onClick={() => {
                        if (hasSub) {
                          toggleExpand(item.id);
                        } else {
                          onSelectModule(item.id);
                          onCloseMobile();
                        }
                      }}
                      className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl font-medium transition-all group ${
                        isActive
                          ? 'bg-teal-600 text-white font-semibold shadow-xs shadow-teal-500/20'
                          : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <SuperadminNavIcon
                          name={item.icon}
                          className={`w-4 h-4 transition-colors ${
                            isActive
                              ? 'text-white'
                              : 'text-slate-400 group-hover:text-teal-400'
                          }`}
                        />
                        <span className="truncate">{item.title}</span>
                      </div>

                      <div className="flex items-center gap-1.5">
                        {item.badge && (
                          <span
                            className={`px-1.5 py-0.5 text-[10px] font-semibold rounded-md ${
                              item.badgeColor ||
                              'bg-slate-800 text-slate-300 border border-slate-700/60'
                            }`}
                          >
                            {item.badge}
                          </span>
                        )}

                        {hasSub && (
                          <span className="text-slate-400">
                            {isExpanded ? (
                              <ChevronDown className="w-3.5 h-3.5" />
                            ) : (
                              <ChevronRight className="w-3.5 h-3.5" />
                            )}
                          </span>
                        )}
                      </div>
                    </button>

                    {/* Submenu accordion */}
                    {hasSub && isExpanded && (
                      <div className="pl-9 pr-2 py-1 space-y-1 border-l border-slate-800/80 ml-5 my-0.5 animate-in slide-in-from-top-1 duration-150">
                        {item.subItems?.map((sub) => {
                          const isSubActive = currentModule === sub.id;
                          return (
                            <button
                              key={sub.id}
                              onClick={() => {
                                onSelectModule(sub.id);
                                onCloseMobile();
                              }}
                              className={`w-full text-left px-2.5 py-1.5 rounded-lg text-[11px] transition-colors flex items-center justify-between ${
                                isSubActive
                                  ? 'text-teal-400 font-semibold bg-teal-500/10'
                                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                              }`}
                            >
                              <span>{sub.title}</span>
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </div>

        {/* Footer info */}
        <div className="p-3 border-t border-slate-800 shrink-0 bg-slate-900/60 text-[11px] text-slate-500 flex items-center justify-between">
          <span>Smart Hospital v4.2</span>
          <span className="text-emerald-400 font-semibold flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            Online
          </span>
        </div>
      </aside>
    </>
  );
};

