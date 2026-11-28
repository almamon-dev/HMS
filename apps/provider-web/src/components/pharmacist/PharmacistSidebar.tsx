import React from 'react';
import {
  ArrowRightLeft,
  BarChart3,
  Boxes,
  CalendarClock,
  ChevronLeft,
  LayoutDashboard,
  LogOut,
  Receipt,
  RotateCcw,
  ShoppingCart,
  Users,
  X,
} from 'lucide-react';
import { HospitalLogo } from '../common/HospitalLogo';
import { CURRENT_PHARMACIST } from '../../data/pharmacistPortalData';
import {
  PharmacistNavGroup,
  SidebarGroupItem,
} from './PharmacistNavGroup';

export interface SidebarSingleItem {
  category?: string;
  id: string;
  name: string;
  path: string;
  active: boolean;
  icon: React.ElementType;
  badge?: number | string;
}

export type SidebarEntry =
  | SidebarSingleItem
  | (SidebarGroupItem & { category?: string });

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
 * Clean SaaS Sidebar matching pharmacy-saas layout:
 * - Direct static flex child on desktop (no fixed offset gap)
 * - Inter font family, text-[13.5px], rounded-lg nav links
 * - Only Dispensing & Stock has tree branch connector accordion
 * - Other items are clean single direct links (no unnecessary nested submenus)
 * - Signature #FF4A1F brand logo & orange-50 active state
 * - Clean Title Case categories without uppercase
 * - Compact spacing without huge vertical gaps
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
  const navEntries: SidebarEntry[] = [
    {
      category: 'Main Menu',
      id: 'dashboard',
      name: 'Dashboard',
      path: '/dashboard/pharmacist',
      active: currentModule === 'dashboard',
      icon: LayoutDashboard,
    },
    {
      category: 'Main Menu',
      id: 'pos-billing',
      name: 'Point of Sale',
      path: '/dashboard/pharmacist/pos',
      active: currentModule === 'pos-billing',
      icon: Receipt,
    },
    {
      category: 'Main Menu',
      id: 'inventory-master',
      name: 'Inventory & Stock',
      path: '/dashboard/pharmacist/inventory',
      active: currentModule === 'inventory-master',
      icon: Boxes,
    },
    {
      category: 'Main Menu',
      id: 'batch-expiry',
      name: 'Batches & Expiry',
      path: '/dashboard/pharmacist/batches',
      active: currentModule === 'batch-expiry',
      icon: CalendarClock,
      badge: 3,
    },
    {
      category: 'Main Menu',
      id: 'stock-transfers',
      name: 'Stock Movements',
      path: '/dashboard/pharmacist/transfers',
      active: currentModule === 'stock-transfers',
      icon: ArrowRightLeft,
    },
    {
      category: 'Orders & Reports',
      id: 'returns-refunds',
      name: 'Returns & Refunds',
      path: '/dashboard/pharmacist/returns',
      active: currentModule === 'returns-refunds',
      icon: RotateCcw,
    },
    {
      category: 'Orders & Reports',
      id: 'purchase-orders',
      name: 'Purchase Orders',
      path: '/dashboard/pharmacist/purchases',
      active: currentModule === 'purchase-orders',
      icon: ShoppingCart,
    },
    {
      category: 'Orders & Reports',
      group: 'Sales & Reports',
      icon: BarChart3,
      items: [
        {
          id: 'reports-branch',
          name: 'Branch Performance',
          path: '/dashboard/pharmacist/reports',
          active:
            currentModule === 'reports-branch' ||
            currentModule === 'pharmacy-reports' ||
            currentModule === 'reports',
        },
        {
          id: 'reports-sales',
          name: 'Sales & Dispensing',
          path: '/dashboard/pharmacist/reports/sales',
          active: currentModule === 'reports-sales',
        },
        {
          id: 'reports-inventory',
          name: 'Inventory Valuation',
          path: '/dashboard/pharmacist/reports/inventory',
          active: currentModule === 'reports-inventory',
        },
      ],
    },
    {
      category: 'Administration',
      group: 'Staff & RBAC',
      icon: Users,
      items: [
        {
          id: 'staff-directory',
          name: 'Staff Directory',
          path: '/dashboard/pharmacist/staff',
          active:
            currentModule === 'staff-directory' ||
            currentModule === 'staff-management' ||
            currentModule === 'staff',
          badge: 10,
        },
        {
          id: 'staff-roles',
          name: 'Role & Permissions',
          path: '/dashboard/pharmacist/staff/roles',
          active: currentModule === 'staff-roles',
          badge: 9,
        },
        {
          id: 'staff-audit',
          name: 'Audit Logs',
          path: '/dashboard/pharmacist/staff/audit',
          active: currentModule === 'staff-audit',
          badge: 6,
        },
      ],
    },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-xs lg:hidden transition-opacity"
        />
      )}

      {/* Main SaaS Sidebar Container */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 lg:z-auto bg-white border-r border-slate-200/90 shadow-2xl lg:shadow-none transform transition-all duration-300 ease-in-out flex flex-col shrink-0 overflow-hidden font-['Inter',sans-serif] ${collapsed
          ? 'w-[72px] translate-x-0'
          : 'w-64 translate-x-0'
          } ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
      >
        {/* Brand Header (h-16 matching pharmacy-saas) */}
        <div className="h-16 flex items-center justify-between px-4 sm:px-5 border-b border-slate-200/80 shrink-0 whitespace-nowrap">
          <a
            href="/dashboard/pharmacist"
            onClick={(e) => {
              e.preventDefault();
              onSelectModule('dashboard');
              if (isOpen) onCloseMobile();
            }}
            className="flex items-center gap-2.5 min-w-0 text-left cursor-pointer group"
          >
            <HospitalLogo
              size="sm"
              showText={!collapsed}
              title="Green Life Hospital"
              subtitle="Pharmacy & Supply Chain"
            />
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

        {/* Navigation Items */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden py-3 px-2 custom-scrollbar">
          {navEntries.map((item, idx) => {
            const prevCategory = idx > 0 ? navEntries[idx - 1].category : null;
            const showCategory = item.category && item.category !== prevCategory;

            return (
              <React.Fragment key={idx}>
                {showCategory && (
                  <div
                    className={`px-3 mb-1.5 text-[11px] font-bold text-slate-400/90 select-none transition-opacity duration-300 ${idx > 0 ? 'mt-3.5' : 'mt-0.5'
                      } ${collapsed ? 'lg:hidden' : ''}`}
                  >
                    {item.category}
                  </div>
                )}

                {'group' in item ? (
                  <PharmacistNavGroup
                    item={item}
                    isOpen={!collapsed}
                    onSelectModule={onSelectModule}
                    onClose={onCloseMobile}
                  />
                ) : (
                  <a
                    href={item.path}
                    title={collapsed ? item.name : undefined}
                    onClick={(e) => {
                      e.preventDefault();
                      onSelectModule(item.id);
                      if (isOpen) onCloseMobile();
                    }}
                    className={`flex items-center px-3 py-2 text-[13px] rounded-[3px] transition-all mb-0.5 whitespace-nowrap group relative overflow-hidden cursor-pointer select-none ${collapsed ? 'lg:justify-center lg:px-0' : ''
                      } ${item.active
                        ? 'text-[#FF4A1F] font-semibold bg-orange-50/70'
                        : 'font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
                      }`}
                  >
                    <item.icon
                      size={18}
                      strokeWidth={1.7}
                      className={`shrink-0 transition-transform duration-300 ${!collapsed ? 'mr-3' : 'mr-3 lg:mr-0'
                        } ${item.active
                          ? 'text-[#FF4A1F]'
                          : 'text-slate-400 group-hover:text-slate-600'
                        }`}
                    />
                    <span
                      className={`transition-all duration-300 ${!collapsed
                        ? 'opacity-100 max-w-[160px]'
                        : 'opacity-0 max-w-0 lg:hidden'
                        } truncate text-left flex-1`}
                    >
                      {item.name}
                    </span>

                    {!collapsed && item.badge !== undefined && (
                      <span className="ml-auto text-[10px] px-1.5 py-0.5 rounded-full font-bold bg-slate-100 text-slate-600 border border-slate-200 shrink-0">
                        {item.badge}
                      </span>
                    )}
                  </a>
                )}
              </React.Fragment>
            );
          })}
        </div>

        {/* Bottom Profile / Switch Role / Logout Card (matching pharmacy-saas) */}
        <div className="p-2 border-t border-slate-200/80 shrink-0 bg-white">
          {collapsed ? (
            <button
              type="button"
              onClick={onExpandDesktop}
              className="w-full flex justify-center py-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg cursor-pointer transition-colors"
              title="Expand Sidebar"
            >
              <ChevronLeft className="w-5 h-5 rotate-180" />
            </button>
          ) : (
            <div className="flex items-center justify-between gap-2 px-2.5 py-2 rounded-lg bg-slate-50 border border-slate-200/80">
              <div className="flex items-center gap-2 min-w-0 flex-1">
                <div className="w-7 h-7 rounded-full bg-orange-50 border border-orange-200 flex items-center justify-center font-bold text-xs text-[#FF4A1F] shrink-0">
                  RI
                </div>
                <div className="min-w-0 flex-1 leading-snug">
                  <div className="text-slate-900 text-xs font-semibold leading-tight break-words">
                    {CURRENT_PHARMACIST.name}
                  </div>
                  <div className="text-[10.5px] text-slate-400 font-mono mt-0.5">
                    {CURRENT_PHARMACIST.registrationNo}
                  </div>
                </div>
              </div>

              {onSwitchRole && (
                <button
                  type="button"
                  onClick={onSwitchRole}
                  title="Switch Role / Sign Out"
                  className="p-1 rounded-md text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer shrink-0"
                >
                  <LogOut size={16} />
                </button>
              )}
            </div>
          )}
        </div>
      </aside>
    </>
  );
};
