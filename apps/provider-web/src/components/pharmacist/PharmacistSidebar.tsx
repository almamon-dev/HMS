import React from 'react';
import {
  ChevronLeft,
  X,
  Building2,
  LogOut,
  Sparkles,
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
 * Hospital ERP-styled Deep Navy Pharmacist Sidebar (#0c2e4b)
 * Multi-branch navigation with 44px item height, #0e4778 active blue,
 * #3a9f00 vivid lime green left indicator, real URL links, and responsive collapse.
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

      {/* Navy Sidebar Container (#0c2e4b) w-64 / w-[68px] */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 bg-[#0c2e4b] text-[#9fb2c8] flex flex-col border-r border-[#082136] shadow-xl transition-all duration-200 ease-in-out ${
          collapsed ? 'lg:w-[68px]' : 'lg:w-64'
        } w-64 ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
      >
        {/* Brand Header */}
        <div
          className={`h-14 sm:h-[60px] bg-[#08233a] border-b border-[#133b5c] flex items-center shrink-0 ${
            collapsed
              ? 'lg:justify-center lg:px-2 px-4 justify-between'
              : 'px-4 justify-between'
          }`}
        >
          <a
            href="/dashboard/pharmacist"
            onClick={(e) => {
              e.preventDefault();
              onSelectModule('dashboard');
              if (isOpen) onCloseMobile();
            }}
            className="flex items-center gap-3 min-w-0 text-left cursor-pointer"
          >
            <div className="w-8 h-8 rounded bg-[#133758] flex items-center justify-center shrink-0 border border-[#1d4c78]">
              <svg
                className="w-5 h-5 text-[#00c2cb]"
                viewBox="0 0 48 48"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M7 11C13 10 19 14 21 21C13 19 8 15 7 11Z" fill="currentColor" />
                <path d="M6 19C13 18 19 22 21 29C13 27 7 23 6 19Z" fill="currentColor" />
                <path d="M7 27C13 26 19 30 21 37C13 35 8 31 7 27Z" fill="currentColor" />
                <path d="M10 35C15 34 19 37 21 42C15 41 11 38 10 35Z" fill="currentColor" />
                <path d="M41 11C35 10 29 14 27 21C35 19 40 15 41 11Z" fill="currentColor" />
                <path d="M42 19C35 18 29 22 27 29C35 27 41 23 42 19Z" fill="currentColor" />
                <path d="M41 27C35 26 29 30 27 37C35 35 40 31 41 27Z" fill="currentColor" />
                <path d="M38 35C33 34 29 37 27 42C33 41 37 38 38 35Z" fill="currentColor" />
                <path d="M23 9C23 9 25 9 25 43C25 43 23 43 23 9Z" fill="currentColor" />
              </svg>
            </div>
            {!collapsed && (
              <div className="min-w-0">
                <span className="font-bold text-[15px] text-white tracking-tight truncate block leading-tight">
                  GreenHospital
                </span>
                <span className="text-[10.5px] text-[#00c2cb] font-semibold leading-none block mt-0.5">
                  PHARMACY & SCM
                </span>
              </div>
            )}
          </a>

          {/* Mobile close button */}
          <button
            onClick={onCloseMobile}
            className="lg:hidden p-1.5 rounded-md text-[#9fb2c8] hover:text-white hover:bg-[#133b5c] transition-colors"
            title="Close sidebar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Branch Multi-Location Badge (When expanded) */}
        {!collapsed && (
          <div className="mx-3 mt-3 px-3 py-2 rounded-lg bg-[#08233a]/80 border border-[#133b5c]/70 flex items-center gap-2 text-xs">
            <Building2 className="w-4 h-4 text-[#00c2cb] shrink-0" />
            <div className="min-w-0 flex-1">
              <div className="text-[10px] uppercase font-bold text-[#6284a6] tracking-wider leading-none">
                Active Store Hub
              </div>
              <div className="text-white text-xs font-medium truncate mt-0.5">
                Central Medical Store (CMS)
              </div>
            </div>
            <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold bg-emerald-950/80 text-emerald-400 border border-emerald-800">
              Online
            </span>
          </div>
        )}

        {/* Navigation Sections */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden py-3 px-2 space-y-4 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
          {PHARMACIST_NAV_SECTIONS.map((section, sIdx) => (
            <div key={sIdx} className="space-y-1">
              {!collapsed && (
                <div className="px-3 pt-2 pb-1 text-[11px] font-bold text-[#6284a6] uppercase tracking-wider">
                  {section.title}
                </div>
              )}
              {collapsed && sIdx > 0 && (
                <div className="my-2 border-t border-[#133b5c]/50 mx-2" />
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
                      className={`relative flex items-center gap-3 w-full h-11 rounded-md text-[13.5px] transition-colors cursor-pointer group select-none ${
                        collapsed ? 'justify-center px-0' : 'px-3'
                      } ${
                        isActive
                          ? 'bg-[#0e4778] text-white font-medium shadow-xs'
                          : 'text-[#9fb2c8] hover:bg-[#0e4778]/50 hover:text-white'
                      }`}
                    >
                      {/* Active Indicator: #3a9f00 vivid lime green left strip */}
                      {isActive && (
                        <span className="absolute left-0 top-1.5 bottom-1.5 w-[3.5px] rounded-r-md bg-[#3a9f00]" />
                      )}

                      <div
                        className={`shrink-0 transition-colors ${
                          isActive
                            ? 'text-[#00c2cb]'
                            : 'text-[#7d99b6] group-hover:text-white'
                        }`}
                      >
                        <PharmacistNavIcon name={item.icon} className="w-[18px] h-[18px]" />
                      </div>

                      {!collapsed && (
                        <>
                          <span className="truncate flex-1 text-left">{item.title}</span>

                          {item.badge !== undefined && (
                            <span
                              className={`text-[11px] px-1.5 py-0.5 rounded-full font-semibold border border-transparent shrink-0 ${
                                item.badgeColor || 'bg-[#184268] text-[#00c2cb]'
                              }`}
                            >
                              {item.badge}
                            </span>
                          )}
                        </>
                      )}

                      {/* Floating tooltip when collapsed */}
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
          <div className="p-2 border-t border-[#082136] flex justify-center">
            <button
              onClick={onExpandDesktop}
              className="p-2 rounded-md text-[#7d99b6] hover:text-white hover:bg-[#133b5c] transition-colors cursor-pointer"
              title="Expand Sidebar"
            >
              <ChevronLeft className="w-5 h-5 rotate-180" />
            </button>
          </div>
        ) : (
          <div className="p-3 border-t border-[#082136] bg-[#08233a]/90 shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-[#133758] border border-[#1d4c78] flex items-center justify-center font-bold text-sm text-[#00c2cb] shrink-0">
                RI
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-white text-xs font-semibold truncate leading-tight flex items-center gap-1.5">
                  {CURRENT_PHARMACIST.name}
                  <Sparkles className="w-3 h-3 text-[#3a9f00]" />
                </div>
                <div className="text-[11px] text-[#00c2cb] truncate mt-0.5 font-mono">
                  {CURRENT_PHARMACIST.registrationNo}
                </div>
              </div>
              {onSwitchRole && (
                <button
                  onClick={onSwitchRole}
                  title="Switch Role / Sign Out"
                  className="p-1.5 rounded text-[#7d99b6] hover:text-rose-400 hover:bg-[#133b5c] transition-colors cursor-pointer shrink-0"
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
