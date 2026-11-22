import {
  ChevronDown,
  ChevronRight,
  LogOut,
  X,
} from 'lucide-react';
import React, { useState } from 'react';
import { HospitalLogo } from '../common/HospitalLogo';
import {
  NavItem,
  SUPERADMIN_NAV_SECTIONS,
} from '../../data/superadminNavigation';
import { SuperadminNavIcon } from './SuperadminNavIcon';

interface SuperadminSidebarProps {
  currentModule: string;
  onSelectModule: (moduleId: string) => void;
  collapsed: boolean;
  onExpandDesktop: () => void;
  isOpen: boolean;
  onCloseMobile: () => void;
  onExitSuperadmin: () => void;
  onSwitchRole?: () => void;
}

/**
 * Clean white CarrierDirect-inspired Superadmin sidebar with soft pastel active
 * highlight, tree-line + dot submenu connectors, desktop collapse, and bottom logout.
 */
export const SuperadminSidebar: React.FC<SuperadminSidebarProps> = ({
  currentModule,
  onSelectModule,
  collapsed,
  onExpandDesktop,
  isOpen,
  onCloseMobile,
  onExitSuperadmin,
  onSwitchRole,
}) => {
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>(
    {}
  );

  const toggleExpand = (itemId: string) => {
    setExpandedItems((prev) => ({
      ...prev,
      [itemId]: !prev[itemId],
    }));
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 z-40 bg-slate-950/40 backdrop-blur-xs lg:hidden transition-opacity"
        />
      )}

      {/* White Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 bg-white text-slate-700 flex flex-col border-r border-slate-200/80 transition-all duration-200 ease-in-out ${collapsed ? 'lg:w-[60px]' : 'lg:w-60'
          } w-60 ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
      >
        {/* Clean Brand Header */}
        <div
          className={`h-14 sm:h-[60px] border-b border-slate-200/80 flex items-center shrink-0 ${collapsed
              ? 'lg:justify-center lg:px-2 px-4 justify-between'
              : 'px-4 justify-between'
            }`}
        >
          <button
            type="button"
            onClick={() => onSelectModule('dashboard')}
            className="flex items-center gap-2.5 min-w-0 text-left cursor-pointer"
          >
            <HospitalLogo
              size="sm"
              showText={!collapsed}
              title="GreenHospital"
              subtitle="Superadmin Hub"
            />
          </button>

          <button
            type="button"
            onClick={onCloseMobile}
            aria-label="Close sidebar"
            className="lg:hidden p-1.5 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Navigation Sections (Scrollbar hidden) */}
        <nav className="flex-1 overflow-y-auto px-2 pt-2 pb-2 space-y-2.5 text-[12px] scrollbar-none no-scrollbar">
          {SUPERADMIN_NAV_SECTIONS.map((section) => (
            <div key={section.title}>
              {!collapsed && (
                <div className="px-2 pb-0.5 text-[11px] font-medium text-slate-400">
                  {section.title}
                </div>
              )}

              <div className="space-y-0.5">
                {section.items.map((item: NavItem) => {
                  const hasSub = Boolean(
                    item.subItems && item.subItems.length > 0
                  );
                  const hasActiveChild =
                    item.subItems?.some((s) => s.id === currentModule) ?? false;
                  const isSelfActive = currentModule === item.id;
                  const isExpanded =
                    !collapsed && (expandedItems[item.id] || hasActiveChild);

                  return (
                    <div key={item.id}>
                      <button
                        type="button"
                        title={collapsed ? item.title : undefined}
                        onClick={() => {
                          if (hasSub) {
                            if (collapsed) {
                              onExpandDesktop();
                              setExpandedItems((prev) => ({
                                ...prev,
                                [item.id]: true,
                              }));
                            } else {
                              toggleExpand(item.id);
                            }
                          } else {
                            onSelectModule(item.id);
                            onCloseMobile();
                          }
                        }}
                        className={`w-full flex items-center rounded-[3px] transition-colors cursor-pointer group ${collapsed
                            ? 'lg:justify-center lg:px-0 py-2 px-2 justify-between'
                            : 'justify-between px-2 py-1.5'
                          } ${isSelfActive
                            ? 'bg-[#edf6f2] text-[#006a4e] font-semibold'
                            : hasActiveChild
                              ? 'text-slate-900 font-semibold'
                              : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900 font-medium'
                          }`}
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <SuperadminNavIcon
                            name={item.icon}
                            className={`w-3.5 h-3.5 shrink-0 ${isSelfActive
                                ? 'text-[#006a4e]'
                                : hasActiveChild
                                  ? 'text-slate-800'
                                  : 'text-slate-400 group-hover:text-slate-700'
                              }`}
                          />
                          {!collapsed && (
                            <span className="truncate">{item.title}</span>
                          )}
                        </div>

                        {!collapsed && hasSub && (
                          <span
                            className={
                              hasActiveChild ? 'text-slate-700' : 'text-slate-400'
                            }
                          >
                            {isExpanded ? (
                              <ChevronDown className="w-3 h-3" />
                            ) : (
                              <ChevronRight className="w-3 h-3" />
                            )}
                          </span>
                        )}
                      </button>

                      {/* CareerDirect-Style Tree Connector + Bullet Dot Submenu */}
                      {hasSub && isExpanded && (
                        <div className="relative pl-4 ml-3.5 mt-0.5 mb-0.5 space-y-0.5 before:content-[''] before:absolute before:left-0 before:top-0 before:bottom-2.5 before:w-px before:bg-slate-200">
                          {item.subItems?.map((sub) => {
                            const isSubActive = currentModule === sub.id;
                            return (
                              <button
                                key={sub.id}
                                type="button"
                                onClick={() => {
                                  onSelectModule(sub.id);
                                  onCloseMobile();
                                }}
                                className={`relative w-full text-left pl-3 pr-2 py-1 rounded-[3px] text-[11.5px] flex items-center gap-1.5 transition-colors cursor-pointer before:content-[''] before:absolute before:-left-4 before:top-1/2 before:w-3 before:h-px before:bg-slate-200 ${isSubActive
                                    ? 'bg-[#edf6f2] text-[#006a4e] font-semibold'
                                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50 font-medium'
                                  }`}
                              >
                                <span
                                  className={`w-1.5 h-1.5 rounded-full shrink-0 ${isSubActive ? 'bg-[#006a4e]' : 'bg-slate-400'
                                    }`}
                                />
                                <span className="truncate">{sub.title}</span>
                              </button>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* Minimal Bottom Logout Row (Matching CarrierDirect) */}
        <div className="p-2 border-t border-slate-200/80 shrink-0 bg-white">
          <button
            type="button"
            title={collapsed ? 'Logout' : undefined}
            onClick={onSwitchRole ?? onExitSuperadmin}
            className={`w-full flex items-center gap-2 py-1.5 rounded-[3px] text-xs font-medium text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer ${collapsed ? 'lg:justify-center lg:px-0 px-2' : 'px-2'
              }`}
          >
            <LogOut className="w-3.5 h-3.5 shrink-0" />
            {!collapsed && <span>Logout</span>}
          </button>
        </div>
      </aside>
    </>
  );
};

export default SuperadminSidebar;
