import React, { useState } from 'react';
import { HospitalLogo } from '../common/HospitalLogo';
import {
  ChevronDown,
  ChevronLeft,
  X,
} from 'lucide-react';
import { DOCTOR_NAV_SECTIONS, DoctorNavItem } from '../../data/doctorPortalData';
import { DoctorNavIcon } from './DoctorNavIcon';

interface DoctorSidebarProps {
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
 * Hospital ERP-styled Deep Navy Doctor Sidebar (#0c2e4b)
 * Clean full-height navigation with 44px item height, #0e4778 active blue,
 * #3a9f00 vivid lime green left indicator, < chevron-left arrows only for submenus, and hidden scrollbar.
 */
export const DoctorSidebar: React.FC<DoctorSidebarProps> = ({
  currentModule,
  onSelectModule,
  collapsed,
  onExpandDesktop,
  isOpen,
  onCloseMobile,
}) => {
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({});

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
            href="/dashboard/doctor"
            onClick={(e) => {
              e.preventDefault();
              onSelectModule('dashboard');
              if (isOpen) onCloseMobile();
            }}
            className="flex items-center gap-3 min-w-0 text-left cursor-pointer"
          >
            <HospitalLogo
              size="sm"
              theme="dark"
              showText={!collapsed}
              title="GreenHospital"
              subtitle="Doctor Portal"
            />
          </a>

          <button
            type="button"
            onClick={onCloseMobile}
            aria-label="Close sidebar"
            className="lg:hidden p-1.5 rounded text-[#8fa3ba] hover:text-white hover:bg-[#133758] cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* User Mini Status Bar (as seen in screenshot: green status dot) */}
        {!collapsed && (
          <div className="px-4 py-2 border-b border-[#0f3556] bg-[#0a2742] flex items-center gap-2 text-xs">
            <span className="w-2 h-2 rounded-full bg-[#3a9f00] ring-2 ring-[#3a9f00]/30 shrink-0" />
            <span className="text-slate-300 font-medium truncate">Doctor Panel</span>
            <span className="ml-auto text-[10.5px] text-[#3a9f00] font-semibold">Online</span>
          </div>
        )}

        {/* Scrollable Navigation Items (Hidden Scrollbar) */}
        <nav className="flex-1 overflow-y-auto py-1 text-[13.5px] scrollbar-none no-scrollbar">
          {DOCTOR_NAV_SECTIONS.map((section) => (
            <div key={section.title}>
              {!collapsed && (
                <div className="px-4 pt-3 pb-1 text-[10.5px] font-semibold text-[#5a7694] tracking-wider select-none">
                  {section.title}
                </div>
              )}

              <div className="space-y-0.5">
                {section.items.map((item: DoctorNavItem) => {
                  const hasSub = Boolean(item.subItems && item.subItems.length > 0);
                  const hasActiveChild = item.subItems?.some((s) => s.id === currentModule) ?? false;
                  const isSelfActive = currentModule === item.id;
                  const isExpanded = !collapsed && (expandedItems[item.id] || hasActiveChild);

                  return (
                    <div key={item.id}>
                      <a
                        href={item.path}
                        title={collapsed ? item.title : undefined}
                        onClick={(e) => {
                          e.preventDefault();
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
                        className={`w-full h-[44px] flex items-center transition-colors duration-150 cursor-pointer group ${
                          collapsed
                            ? 'lg:justify-center lg:px-0 px-4 justify-between'
                            : 'justify-between px-4'
                        } ${
                          isSelfActive
                            ? 'bg-[#0e4778] text-white font-medium border-l-[3.5px] border-[#3a9f00] pl-[calc(1rem-3.5px)] shadow-xs'
                            : hasActiveChild
                              ? 'text-white font-medium bg-[#0e4778]/80'
                              : 'text-[#9fb2c8] hover:text-white hover:bg-[#0e4778]/60 font-normal'
                        }`}
                      >
                        <div className="flex items-center gap-3.5 min-w-0">
                          <DoctorNavIcon
                            name={item.icon}
                            className={`w-4 h-4 shrink-0 transition-colors ${
                              isSelfActive
                                ? 'text-white'
                                : hasActiveChild
                                  ? 'text-white'
                                  : 'text-[#8fa3ba] group-hover:text-white'
                            }`}
                          />
                          {!collapsed && (
                            <span className="truncate leading-tight text-[13.5px]">{item.title}</span>
                          )}
                        </div>

                        {!collapsed && (
                          <div className="flex items-center gap-1.5 shrink-0 ml-2">
                            {item.badge !== undefined && (
                              <span
                                className={`text-[10px] font-semibold px-1.5 py-0.2 rounded-full shrink-0 ${
                                  item.badgeColor || 'bg-[#184570] text-cyan-200'
                                }`}
                              >
                                {item.badge}
                              </span>
                            )}
                            {hasSub && (
                              <span
                                className={
                                  hasActiveChild ? 'text-white' : 'text-[#5e7c99] group-hover:text-slate-200 transition-colors'
                                }
                              >
                                {isExpanded ? (
                                  <ChevronDown className="w-3.5 h-3.5" />
                                ) : (
                                  <ChevronLeft className="w-3.5 h-3.5" />
                                )}
                              </span>
                            )}
                          </div>
                        )}
                      </a>

                      {/* Tree Submenu for items with subItems */}
                      {hasSub && isExpanded && (
                        <div className="relative pl-6 ml-4 mt-0.5 mb-0.5 space-y-0.5 before:content-[''] before:absolute before:left-0 before:top-0 before:bottom-2 before:w-px before:bg-[#1b4166]">
                          {item.subItems?.map((sub) => {
                            const isSubActive = currentModule === sub.id;
                            return (
                              <a
                                key={sub.id}
                                href={sub.path}
                                onClick={(e) => {
                                  e.preventDefault();
                                  onSelectModule(sub.id);
                                  onCloseMobile();
                                }}
                                className={`relative w-full text-left pl-3 pr-2 h-9 rounded text-[12.5px] flex items-center gap-2 transition-colors cursor-pointer before:content-[''] before:absolute before:-left-6 before:top-1/2 before:w-4 before:h-px before:bg-[#1b4166] ${
                                  isSubActive
                                    ? 'bg-[#0e4778] text-white font-medium border-l-2 border-[#3a9f00]'
                                    : 'text-[#8fa3ba] hover:text-white hover:bg-[#0e4778]/50 font-normal'
                                }`}
                              >
                                <span
                                  className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                                    isSubActive ? 'bg-[#3a9f00]' : 'bg-[#5a7694]'
                                  }`}
                                />
                                <span className="truncate">{sub.title}</span>
                                {sub.badge !== undefined && (
                                  <span className="ml-auto text-[10px] px-1 py-0.2 rounded-full bg-[#184570] text-cyan-200 font-medium">
                                    {sub.badge}
                                  </span>
                                )}
                              </a>
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
      </aside>
    </>
  );
};
