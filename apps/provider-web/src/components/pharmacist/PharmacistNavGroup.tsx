import React, { useState, useEffect } from 'react';
import { ChevronRight } from 'lucide-react';

export interface SidebarSubItem {
  id: string;
  name: string;
  path: string;
  active: boolean;
  badge?: number | string | null;
}

export interface SidebarGroupItem {
  category?: string;
  group: string;
  icon: React.ElementType;
  items: SidebarSubItem[];
}

interface NavGroupProps {
  item: SidebarGroupItem;
  isOpen: boolean;
  onSelectModule: (moduleId: string) => void;
  onClose?: () => void;
}

/**
 * Tree-branch accordion nav group matching pharmacy-saas layout:
 * - Parent collapsible button with rotate-90 chevron
 * - Vertical connector lines with active orange color (#FF4A1F)
 * - Bullseye halo active indicator for active sub-item
 * - Bold active label with #FF4A1F color
 */
export const PharmacistNavGroup: React.FC<NavGroupProps> = ({
  item,
  isOpen,
  onSelectModule,
  onClose,
}) => {
  const isActiveGroup = item.items.some((sub) => sub.active);
  const [isExpanded, setIsExpanded] = useState<boolean>(isActiveGroup);

  useEffect(() => {
    if (isActiveGroup) {
      setIsExpanded(true);
    }
  }, [isActiveGroup]);

  if (!item.items.length) return null;

  const Icon = item.icon;
  const activeIdx = item.items.findIndex((sub) => sub.active);

  return (
    <div className="mb-0.5">
      {/* Parent Group Header Button */}
      <button
        type="button"
        onClick={() => setIsExpanded((prev) => !prev)}
        title={!isOpen ? item.group : undefined}
        className={`w-full flex items-center ${
          isOpen ? 'justify-between px-3' : 'justify-center'
        } py-2 rounded-lg text-[14px] font-medium transition-colors group cursor-pointer ${
          isActiveGroup
            ? 'text-[#FF4A1F] font-semibold bg-orange-50/70'
            : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50/70'
        }`}
      >
        <div className={`flex items-center ${isOpen ? 'gap-2.5' : 'justify-center'}`}>
          <Icon
            size={20}
            strokeWidth={1.5}
            className={
              isActiveGroup
                ? 'text-[#FF4A1F]'
                : 'text-slate-400 group-hover:text-slate-600'
            }
          />
          {isOpen && <span className="whitespace-nowrap">{item.group}</span>}
        </div>
        {isOpen && (
          <ChevronRight
            size={16}
            strokeWidth={1.5}
            className={`text-slate-400 transition-transform duration-200 shrink-0 ${
              isExpanded ? 'rotate-90' : ''
            }`}
          />
        )}
      </button>

      {/* Expanded Tree-Branch Submenu Items */}
      {isExpanded && (
        <div className={`${isOpen ? 'relative ml-[22px] pr-2' : 'px-1'} mb-1 mt-0.5`}>
          {item.items.map((subItem, sIdx) => {
            const isActive = subItem.active;
            const isLast = sIdx === item.items.length - 1;
            const isBeforeActive = activeIdx !== -1 && sIdx < activeIdx;
            const isCurrentActive = activeIdx !== -1 && sIdx === activeIdx;

            return (
              <a
                key={subItem.id || subItem.path}
                href={subItem.path}
                onClick={(e) => {
                  e.preventDefault();
                  onSelectModule(subItem.id);
                  if (window.innerWidth < 1024) {
                    onClose?.();
                  }
                }}
                title={!isOpen ? subItem.name : undefined}
                className={`relative flex items-center ${
                  isOpen ? 'justify-between py-1.5 pl-[18px] pr-1.5' : 'justify-center py-2'
                } rounded-md text-[13.5px] transition-colors group cursor-pointer ${
                  isActive
                    ? 'text-[#FF4A1F] font-bold'
                    : 'text-slate-600 font-medium hover:text-slate-900'
                }`}
              >
                {/* SVG/CSS Tree Branch Connector Lines (as in pharmacy-saas) */}
                {isOpen && (
                  <>
                    <div
                      className={`absolute left-0 top-0 h-1/2 w-[1.5px] transition-colors ${
                        isBeforeActive || isCurrentActive
                          ? 'bg-[#FF4A1F]'
                          : 'bg-slate-300'
                      }`}
                    />
                    {!isLast && (
                      <div
                        className={`absolute left-0 top-1/2 h-1/2 w-[1.5px] transition-colors ${
                          isBeforeActive ? 'bg-[#FF4A1F]' : 'bg-slate-300'
                        }`}
                      />
                    )}
                    <div
                      className={`absolute left-0 top-1/2 w-[13px] h-[1.5px] transition-colors ${
                        isCurrentActive ? 'bg-[#FF4A1F]' : 'bg-slate-300'
                      }`}
                    />
                  </>
                )}

                {/* Submenu Item Content: Dot + Name */}
                <div
                  className={`flex items-center ${
                    isOpen ? 'gap-2 relative' : 'justify-center'
                  } whitespace-nowrap min-w-0`}
                >
                  {isOpen ? (
                    <>
                      {/* Bullseye Halo Dot for Active, Solid Dot for Inactive */}
                      <div
                        className={`relative flex items-center justify-center shrink-0 w-3.5 h-3.5 rounded-full ${
                          isActive
                            ? 'bg-orange-100 ring-2 ring-[#FF4A1F]/25'
                            : 'bg-transparent'
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                            isActive
                              ? 'bg-[#FF4A1F]'
                              : 'bg-slate-400 group-hover:bg-slate-600'
                          }`}
                        />
                      </div>
                      <span className="truncate">{subItem.name}</span>
                    </>
                  ) : (
                    <span
                      className={`w-2 h-2 rounded-full ${
                        isActive ? 'bg-[#FF4A1F]' : 'bg-slate-300'
                      }`}
                    />
                  )}
                </div>

                {/* Submenu Badge */}
                {isOpen && subItem.badge !== undefined && subItem.badge !== null && (
                  <span className="ml-auto shrink-0 min-w-[18px] h-[18px] px-1 bg-[#FF4A1F] text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-white shadow-xs leading-none">
                    {subItem.badge}
                  </span>
                )}
              </a>
            );
          })}
        </div>
      )}
    </div>
  );
};
