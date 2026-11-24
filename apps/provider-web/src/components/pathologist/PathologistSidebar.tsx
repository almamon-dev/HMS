import React from 'react';
import {
  CheckCircle2,
  FlaskConical,
  LayoutDashboard,
  LogOut,
  Microscope,
  Sliders,
  UserCog,
  X,
} from 'lucide-react';
import { CURRENT_PATHOLOGIST } from '../../data/pathologistPortalData';
import {
  PathologistNavGroup,
  PathologistSidebarGroupItem,
} from './PathologistNavGroup';

export interface PathologistSidebarSingleItem {
  category?: string;
  id: string;
  name: string;
  path: string;
  active: boolean;
  icon: React.ElementType;
  badge?: number | string;
}

export type PathologistSidebarEntry =
  | PathologistSidebarSingleItem
  | (PathologistSidebarGroupItem & { category?: string });

interface PathologistSidebarProps {
  currentModule: string;
  onSelectModule: (moduleId: string) => void;
  collapsed: boolean;
  onToggleCollapse?: () => void;
  onExpandDesktop?: () => void;
  isOpen: boolean;
  onCloseMobile: () => void;
  onSwitchRole?: () => void;
  onGoHome?: () => void;
}

export const PathologistSidebar: React.FC<PathologistSidebarProps> = ({
  currentModule,
  onSelectModule,
  collapsed,
  isOpen,
  onCloseMobile,
  onSwitchRole,
}) => {
  const navEntries: PathologistSidebarEntry[] = [
    {
      category: 'Overview',
      id: 'dashboard',
      name: 'Dashboard',
      path: '/dashboard/pathologist',
      active: currentModule === 'dashboard',
      icon: LayoutDashboard,
    },
    {
      category: 'Diagnostic Review',
      group: 'Clinical Verification',
      icon: CheckCircle2,
      items: [
        {
          id: 'verification-pending',
          name: 'Result Verification',
          path: '/dashboard/pathologist/verification',
          active: currentModule === 'verification-pending',
          badge: 6,
        },
        {
          id: 'critical-results',
          name: 'Critical Results',
          path: '/dashboard/pathologist/critical',
          active: currentModule === 'critical-results',
          badge: 4,
        },
        {
          id: 'reports-signed',
          name: 'Laboratory Reports',
          path: '/dashboard/pathologist/reports',
          active: currentModule === 'reports-signed',
          badge: 4,
        },
      ],
    },
    {
      category: 'Operations',
      group: 'Testing & Worklist',
      icon: FlaskConical,
      items: [
        {
          id: 'worklist-requests',
          name: 'Patient Requests',
          path: '/dashboard/pathologist/requests',
          active: currentModule === 'worklist-requests',
          badge: 4,
        },
        {
          id: 'worklist-processing',
          name: 'Test Processing',
          path: '/dashboard/pathologist/processing',
          active: currentModule === 'worklist-processing',
        },
        {
          id: 'worklist-samples',
          name: 'Sample Tracking',
          path: '/dashboard/pathologist/samples',
          active: currentModule === 'worklist-samples',
        },
      ],
    },
    {
      category: 'Quality & Setup',
      group: 'Lab Master & QC',
      icon: Sliders,
      items: [
        {
          id: 'masters-tests',
          name: 'Laboratory Master',
          path: '/dashboard/pathologist/catalog',
          active: currentModule === 'masters-tests',
        },
        {
          id: 'masters-qc',
          name: 'Quality Control',
          path: '/dashboard/pathologist/qc',
          active: currentModule === 'masters-qc',
        },
        {
          id: 'masters-analytics',
          name: 'Reports & Analytics',
          path: '/dashboard/pathologist/analytics',
          active: currentModule === 'masters-analytics',
        },
      ],
    },
    {
      category: 'Administration',
      id: 'profile-settings',
      name: 'Profile & Settings',
      path: '/dashboard/pathologist/profile',
      active: currentModule === 'profile-settings',
      icon: UserCog,
    },
  ];

  // Group entries by category
  const categories = Array.from(
    new Set(navEntries.map((e) => e.category || 'General'))
  );

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-40 lg:hidden"
          onClick={onCloseMobile}
        />
      )}

      {/* Main Sidebar */}
      <aside
        className={`fixed lg:sticky top-0 left-0 z-40 h-screen transition-all duration-300 ease-in-out bg-white border-r border-slate-200/80 flex flex-col shrink-0 ${
          collapsed ? 'w-[76px]' : 'w-[260px]'
        } ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Header / Logo */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-slate-100 shrink-0">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="w-9 h-9 rounded-xl bg-teal-50 border border-teal-200/80 flex items-center justify-center shrink-0 text-[#006a4e]">
              <Microscope size={20} strokeWidth={2} />
            </div>
            {!collapsed && (
              <div className="flex flex-col truncate">
                <span className="font-bold text-slate-800 text-[14.5px] tracking-tight truncate">
                  Green Life Hospital
                </span>
                <span className="text-[11px] font-medium text-teal-700 truncate">
                  Pathology & Lab Medicine
                </span>
              </div>
            )}
          </div>
          <button
            type="button"
            onClick={onCloseMobile}
            className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
          >
            <X size={18} />
          </button>
        </div>

        {/* Navigation Items */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-4 select-none scrollbar-thin">
          {categories.map((category) => {
            const entriesInCat = navEntries.filter(
              (e) => (e.category || 'General') === category
            );
            return (
              <div key={category} className="space-y-1">
                {!collapsed && (
                  <div className="px-3 pb-1 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    {category}
                  </div>
                )}
                {entriesInCat.map((entry, idx) => {
                  if ('items' in entry) {
                    return (
                      <PathologistNavGroup
                        key={`${entry.group}-${idx}`}
                        item={entry}
                        isOpen={!collapsed}
                        onSelectModule={onSelectModule}
                        onClose={onCloseMobile}
                      />
                    );
                  }

                  const Icon = entry.icon;
                  const isActive = entry.active;

                  return (
                    <button
                      key={entry.id}
                      type="button"
                      onClick={() => {
                        onSelectModule(entry.id);
                        if (window.innerWidth < 1024) onCloseMobile();
                      }}
                      title={collapsed ? entry.name : undefined}
                      className={`w-full flex items-center ${
                        collapsed ? 'justify-center px-0' : 'justify-between px-3'
                      } py-2 rounded-lg text-[13.5px] font-medium transition-colors cursor-pointer ${
                        isActive
                          ? 'text-[#FF4A1F] font-semibold bg-orange-50/70'
                          : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50/70'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <Icon
                          size={18}
                          strokeWidth={1.5}
                          className={
                            isActive
                              ? 'text-[#FF4A1F]'
                              : 'text-slate-400 group-hover:text-slate-600'
                          }
                        />
                        {!collapsed && (
                          <span className="truncate">{entry.name}</span>
                        )}
                      </div>
                      {!collapsed && entry.badge && (
                        <span
                          className={`text-[10.5px] px-1.5 py-0.5 rounded-full font-mono font-bold ${
                            isActive
                              ? 'bg-[#FF4A1F] text-white'
                              : 'bg-slate-100 text-slate-600'
                          }`}
                        >
                          {entry.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            );
          })}
        </div>

        {/* User Profile / Switch Role Footer */}
        <div className="p-3 border-t border-slate-100 shrink-0 bg-slate-50/50">
          {!collapsed ? (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-8 h-8 rounded-full bg-[#006a4e] text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-xs">
                  NJ
                </div>
                <div className="truncate">
                  <div className="text-[12.5px] font-semibold text-slate-800 truncate">
                    {CURRENT_PATHOLOGIST.name}
                  </div>
                  <div className="text-[10.5px] font-mono text-teal-700 truncate">
                    {CURRENT_PATHOLOGIST.bmdcRegNo}
                  </div>
                </div>
              </div>
              {onSwitchRole && (
                <button
                  type="button"
                  onClick={onSwitchRole}
                  title="Switch Role or Logout"
                  className="p-1.5 rounded-md text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                >
                  <LogOut size={16} />
                </button>
              )}
            </div>
          ) : (
            <div className="flex justify-center">
              <button
                type="button"
                onClick={onSwitchRole}
                title="Switch Role or Logout"
                className="w-9 h-9 rounded-lg flex items-center justify-center text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
              >
                <LogOut size={18} />
              </button>
            </div>
          )}
        </div>
      </aside>
    </>
  );
};
