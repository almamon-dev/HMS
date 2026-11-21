import React from 'react';
import {
  Building2,
  ChevronLeft,
  LogOut,
  Sparkles,
  X,
} from 'lucide-react';
import { PHARMACIST_NAV_SECTIONS, CURRENT_PHARMACIST } from '../../data/pharmacistPortalData';
import { PharmacistNavIcon } from './PharmacistNavIcon';

interface PharmacistSidebarProps {
  currentModule: string;
  onSelectModule: (moduleId: string) => void;
  collapsed: boolean;
  onToggleCollapse?: () => void;
  onExpandDesktop: () => void;
  isOpen: boolean;
  onCloseMobile: () => void;
  onSwitchRole?: () => void;
  onGoHome?: () => void;
}

/**
 * Modern Clean SaaS Pharmacy Sidebar (inspired by pharmacy-saas layout)
 * Features:
 * - Crisp pure-white background with subtle border-r (border-slate-200/90)
 * - Brand logo with pharmacy cross badge (#FF4A1F)
 * - Store hub active badge with live online indicator
 * - Title Case clean categories (Workspace, Inventory & Warehouse, etc.)
 * - Rounded-lg nav links with signature #FF4A1F active highlight & soft orange-50/70 tint
 * - Bottom user profile card & role switcher
 */
export const PharmacistSidebar: React.FC<PharmacistSidebarProps> = ({
  currentModule,
  onSelectModule,
  collapsed,
  onExpandDesktop,
  isOpen,
  onCloseMobile,
  onSwitchRole,
}) => {
  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 z-40 bg-slate-950/60 backdrop-blur-xs lg:hidden transition-opacity"
        />
      )}

      {/* Main SaaS Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 bg-white text-slate-600 flex flex-col border-r border-slate-200/90 shadow-2xl lg:shadow-none transition-all duration-300 ease-in-out ${
          collapsed ? 'lg:w-[72px]' : 'lg:w-64'
        } w-64 ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
      >
        {/* Brand Header */}
        <div
          className={`h-16 flex items-center border-b border-slate-200/80 shrink-0 whitespace-nowrap ${
            collapsed
              ? 'lg:justify-center lg:px-2 px-4 justify-between'
              : 'px-4 sm:px-5 justify-between'
          }`}
        >
          <a
            href="/dashboard/pharmacist"
            onClick={(e) => {
              e.preventDefault();
              onSelectModule('dashboard');
              if (isOpen) onCloseMobile();
            }}
            className="flex items-center gap-2.5 min-w-0 text-left cursor-pointer group"
          >
            {/* Pharmacy Cross Brand Logo (from pharmacy-saas) */}
            <div className="h-8 w-8 rounded-[4px] bg-[#FF4A1F] text-white flex shrink-0 items-center justify-center shadow-xs group-hover:scale-105 transition-transform">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                className="h-4.5 w-4.5"
                stroke="currentColor"
                strokeWidth="2.4"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 5v14M5 12h14" />
              </svg>
            </div>

            {!collapsed && (
              <div className="min-w-0 leading-tight">
                <span className="font-bold text-[15px] text-slate-900 tracking-tight truncate block">
                  GreenHospital
                </span>
                <span className="text-[11px] text-slate-400 font-medium truncate block mt-0.5">
                  Pharmacy & Supply Chain
                </span>
              </div>
            )}
          </a>

          {/* Mobile close button */}
          <button
            type="button"
            onClick={onCloseMobile}
            className="lg:hidden p-1.5 rounded-full border border-slate-200 bg-slate-50 text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
            title="Close menu"
          >
            <X size={17} strokeWidth={2} />
          </button>
        </div>

        {/* Active Store Hub Card (from pharmacy-saas multi-branch standard) */}
        {!collapsed && (
          <div className="mx-3 mt-3 px-3 py-2 rounded-lg bg-slate-50 border border-slate-200/90 flex items-center gap-2 text-xs">
            <div className="h-7 w-7 rounded-[4px] bg-orange-50 border border-orange-200/80 flex items-center justify-center shrink-0">
              <Building2 className="w-3.5 h-3.5 text-[#FF4A1F]" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-[10px] font-bold text-slate-400 leading-none">
                Active Branch Hub
              </div>
              <div className="text-slate-800 text-[11.5px] font-semibold truncate mt-0.5">
                Central Medical Store
              </div>
            </div>
            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Live
            </span>
          </div>
        )}

        {/* Navigation Sections */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden py-3 px-2 custom-scrollbar space-y-4">
          {PHARMACIST_NAV_SECTIONS.map((section, sIdx) => (
            <div key={sIdx} className="space-y-0.5">
              {!collapsed && (
                <div className="px-3 pt-2 pb-1 text-[11px] font-bold text-slate-400 select-none">
                  {section.title}
                </div>
              )}
              {collapsed && sIdx > 0 && (
                <div className="my-2 border-t border-slate-200/80 mx-2" />
              )}

              <div className="space-y-0.5">
                {section.items.map((item) => {
                  const isActive = currentModule === item.id;

                  return (
                    <a
                      key={item.id}
                      href={item.path}
                      onClick={(e) => {
                        e.preventDefault();
                        onSelectModule(item.id);
                        if (isOpen) onCloseMobile();
                      }}
                      title={collapsed ? item.title : undefined}
                      className={`flex items-center px-3 py-2 text-[13px] rounded-lg transition-all mb-0.5 whitespace-nowrap group relative overflow-hidden cursor-pointer select-none ${
                        collapsed ? 'lg:justify-center lg:px-0' : 'gap-3'
                      } ${
                        isActive
                          ? 'text-[#FF4A1F] font-semibold bg-orange-50/70 shadow-2xs'
                          : 'font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
                      }`}
                    >
                      <div
                        className={`shrink-0 transition-colors ${
                          isActive
                            ? 'text-[#FF4A1F]'
                            : 'text-slate-400 group-hover:text-slate-600'
                        }`}
                      >
                        <PharmacistNavIcon name={item.icon} className="w-[17px] h-[17px]" />
                      </div>

                      {!collapsed && (
                        <>
                          <span className="truncate flex-1 text-left">{item.title}</span>

                          {item.badge !== undefined && (
                            <span
                              className={`text-[10.5px] px-1.5 py-0.5 rounded-full font-semibold border border-transparent shrink-0 ${
                                item.badgeColor || 'bg-slate-100 text-slate-600'
                              }`}
                            >
                              {item.badge}
                            </span>
                          )}
                        </>
                      )}

                      {/* Tooltip on collapsed desktop */}
                      {collapsed && (
                        <div className="absolute left-full ml-2 px-2.5 py-1 bg-slate-900 text-white text-xs rounded-md shadow-lg whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-opacity z-50">
                          {item.title}
                          {item.badge !== undefined && ` (${item.badge})`}
                        </div>
                      )}
                    </a>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Collapsed expand trigger or Bottom Pharmacist Profile Card */}
        {collapsed ? (
          <div className="p-2 border-t border-slate-200 flex justify-center shrink-0">
            <button
              type="button"
              onClick={onExpandDesktop}
              className="p-2 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
              title="Expand Sidebar"
            >
              <ChevronLeft className="w-5 h-5 rotate-180" />
            </button>
          </div>
        ) : (
          <div className="p-2.5 border-t border-slate-200 shrink-0 bg-white">
            <div className="p-2 rounded-lg bg-slate-50 border border-slate-200/80 flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-orange-50 border border-orange-200/80 flex items-center justify-center font-bold text-xs text-[#FF4A1F] shrink-0">
                RI
              </div>
              <div className="min-w-0 flex-1 leading-tight">
                <div className="text-slate-900 text-xs font-semibold truncate flex items-center gap-1">
                  <span>{CURRENT_PHARMACIST.name}</span>
                  <Sparkles className="w-3 h-3 text-[#FF4A1F]" />
                </div>
                <div className="text-[10.5px] text-slate-400 truncate mt-0.5 font-mono">
                  {CURRENT_PHARMACIST.registrationNo}
                </div>
              </div>

              {onSwitchRole && (
                <button
                  type="button"
                  onClick={onSwitchRole}
                  title="Switch Role / Sign Out"
                  className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer shrink-0"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        )}
      </aside>
    </>
  );
};
