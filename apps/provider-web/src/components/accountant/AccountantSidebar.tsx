import React from 'react';
import {
  BarChart3,
  ChevronLeft,
  Landmark,
  LayoutDashboard,
  LogOut,
  Receipt,
  Settings,
  Wallet,
  X,
} from 'lucide-react';
import { HospitalLogo } from '../common/HospitalLogo';
import { CURRENT_ACCOUNTANT } from '../../data/accountantPortalData';
import {
  AccountantNavGroup,
  AccountantSidebarGroupItem,
} from './AccountantNavGroup';

export interface SidebarSingleItem {
  category?: string;
  id: string;
  name: string;
  path: string;
  active: boolean;
  icon: React.ElementType;
  badge?: number | string;
}

export type AccountantSidebarEntry =
  | SidebarSingleItem
  | (AccountantSidebarGroupItem & { category?: string });

interface AccountantSidebarProps {
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
 * Enterprise Hospital Accountant Sidebar:
 * - 6 Institutional financial categories (Overview, Income & Billing, Expenses & Payables, Treasury & Banking, Reports & Tax, Administration)
 * - Exact tree-branch connector lines & bullseye indicator matching Pharmacist reference (Image 3)
 * - Sticky top-0 h-screen desktop sidebar (no fixed offset gaps)
 * - Signature #FF4A1F brand highlight & orange-50 active states
 */
export const AccountantSidebar: React.FC<AccountantSidebarProps> = ({
  currentModule,
  onSelectModule,
  collapsed,
  onToggleCollapse,
  onExpandDesktop,
  isOpen,
  onCloseMobile,
  onSwitchRole,
}) => {
  const navEntries: AccountantSidebarEntry[] = [
    {
      category: 'Financial Operations',
      id: 'dashboard',
      name: 'Dashboard',
      path: '/dashboard/accountant',
      active: currentModule === 'dashboard',
      icon: LayoutDashboard,
    },
    {
      category: 'Financial Operations',
      group: 'Income & Billing',
      icon: Receipt,
      items: [
        {
          id: 'billing-invoices',
          name: 'Patient Invoices',
          path: '/dashboard/accountant/invoices',
          active: currentModule === 'billing-invoices',
          badge: 'IPD/OPD',
        },
        {
          id: 'billing-collections',
          name: 'Daily Collections',
          path: '/dashboard/accountant/collections',
          active: currentModule === 'billing-collections',
          badge: 6,
        },
        {
          id: 'billing-due',
          name: 'Due Payments',
          path: '/dashboard/accountant/receivables',
          active: currentModule === 'billing-due',
          badge: 5,
        },
        {
          id: 'billing-refunds',
          name: 'Refund Clearance',
          path: '/dashboard/accountant/refunds',
          active: currentModule === 'billing-refunds',
        },
      ],
    },
    {
      category: 'Financial Operations',
      group: 'Expenses & Payables',
      icon: Wallet,
      items: [
        {
          id: 'expenses-vouchers',
          name: 'Expense Vouchers',
          path: '/dashboard/accountant/vouchers',
          active: currentModule === 'expenses-vouchers',
        },
        {
          id: 'expenses-suppliers',
          name: 'Supplier Bills',
          path: '/dashboard/accountant/payables',
          active: currentModule === 'expenses-suppliers',
          badge: 5,
        },
        {
          id: 'expenses-doctors',
          name: 'Doctor Share',
          path: '/dashboard/accountant/doctor-share',
          active: currentModule === 'expenses-doctors',
          badge: 4,
        },
        {
          id: 'expenses-payroll',
          name: 'Staff Payroll',
          path: '/dashboard/accountant/payroll',
          active: currentModule === 'expenses-payroll',
        },
      ],
    },
    {
      category: 'Financial Operations',
      group: 'Banking & Treasury',
      icon: Landmark,
      items: [
        {
          id: 'banking-accounts',
          name: 'Bank Accounts',
          path: '/dashboard/accountant/banking',
          active: currentModule === 'banking-accounts',
          badge: 3,
        },
        {
          id: 'banking-reconcile',
          name: 'Reconciliation',
          path: '/dashboard/accountant/reconciliation',
          active: currentModule === 'banking-reconcile',
        },
      ],
    },
    {
      category: 'Reports & Audit',
      group: 'Financial Reports',
      icon: BarChart3,
      items: [
        {
          id: 'reports-summary',
          name: 'Statements Hub',
          path: '/dashboard/accountant/reports',
          active: currentModule === 'reports-summary',
        },
        {
          id: 'reports-pnl',
          name: 'Profit & Loss',
          path: '/dashboard/accountant/reports/pnl',
          active: currentModule === 'reports-pnl',
        },
        {
          id: 'reports-balance-sheet',
          name: 'Balance Sheet',
          path: '/dashboard/accountant/reports/balance-sheet',
          active: currentModule === 'reports-balance-sheet',
        },
        {
          id: 'reports-tax',
          name: 'Tax & VAT',
          path: '/dashboard/accountant/reports/tax',
          active: currentModule === 'reports-tax',
        },
      ],
    },
    {
      category: 'Reports & Audit',
      group: 'Administration',
      icon: Settings,
      items: [
        {
          id: 'settings-coa',
          name: 'Chart of Accounts',
          path: '/dashboard/accountant/settings',
          active: currentModule === 'settings-coa',
        },
        {
          id: 'settings-audit',
          name: 'Audit Logs',
          path: '/dashboard/accountant/audit-logs',
          active: currentModule === 'settings-audit',
          badge: 7,
        },
      ],
    },
  ];

  const renderNavList = () => (
    <div className="flex-1 overflow-y-auto overflow-x-hidden py-3 px-2 custom-scrollbar">
      {navEntries.map((item, idx) => {
        const prevCategory = idx > 0 ? navEntries[idx - 1].category : null;
        const showCategory = item.category && item.category !== prevCategory;

        return (
          <React.Fragment key={idx}>
            {showCategory && (
              <div
                className={`px-3 mb-1.5 text-[11px] font-bold text-slate-400/90 select-none transition-opacity duration-300 ${
                  idx > 0 ? 'mt-3.5' : 'mt-0.5'
                } ${collapsed ? 'lg:hidden' : ''}`}
              >
                {item.category}
              </div>
            )}

            {'group' in item ? (
              <AccountantNavGroup
                item={item}
                isOpen={!collapsed || isOpen}
                onSelectModule={onSelectModule}
                onClose={isOpen ? onCloseMobile : undefined}
              />
            ) : (
              <a
                href={item.path}
                title={collapsed && !isOpen ? item.name : undefined}
                onClick={(e) => {
                  e.preventDefault();
                  onSelectModule(item.id);
                  if (isOpen) onCloseMobile();
                }}
                className={`flex items-center px-3 py-1.5 text-[13px] rounded-lg transition-all mb-0.5 whitespace-nowrap group relative overflow-hidden cursor-pointer select-none ${
                  collapsed && !isOpen ? 'lg:justify-center lg:px-0' : ''
                } ${
                  item.active
                    ? 'text-[#FF4A1F] font-semibold bg-orange-50/70'
                    : 'font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
                }`}
              >
                <item.icon
                  size={18}
                  strokeWidth={1.6}
                  className={`shrink-0 transition-transform duration-300 ${
                    !collapsed || isOpen ? 'mr-3' : 'mr-3 lg:mr-0'
                  } ${
                    item.active
                      ? 'text-[#FF4A1F]'
                      : 'text-slate-400 group-hover:text-slate-600'
                  }`}
                />
                <span
                  className={`transition-all duration-300 ${
                    !collapsed || isOpen
                      ? 'opacity-100 max-w-[190px]'
                      : 'opacity-0 max-w-0 lg:hidden'
                  }`}
                >
                  {item.name}
                </span>

                {(!collapsed || isOpen) && item.badge !== undefined && (
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
  );

  const renderProfileFooter = () => (
    <div className="p-2 border-t border-slate-200/80 shrink-0 bg-white">
      {collapsed && !isOpen ? (
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
            <div className="w-8 h-8 rounded-full bg-orange-50 border border-orange-200 flex items-center justify-center font-bold text-xs text-[#FF4A1F] shrink-0">
              RI
            </div>
            <div className="min-w-0 flex-1 leading-snug">
              <div className="text-slate-900 text-xs font-semibold leading-tight truncate">
                {CURRENT_ACCOUNTANT.name}
              </div>
              <div className="text-[10px] text-slate-400 font-mono truncate">
                {CURRENT_ACCOUNTANT.certNo}
              </div>
            </div>
          </div>

          {onSwitchRole && (
            <button
              type="button"
              onClick={onSwitchRole}
              title="Switch Role / Sign Out"
              className="p-1.5 rounded-md text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer shrink-0"
            >
              <LogOut size={16} />
            </button>
          )}
        </div>
      )}
    </div>
  );

  return (
    <>
      {/* Desktop Persistent Sidebar */}
      <aside
        className={`hidden md:flex flex-col shrink-0 border-r border-slate-200/80 bg-white transition-all duration-200 select-none font-['Plus_Jakarta_Sans',sans-serif] ${
          collapsed ? 'w-[68px]' : 'w-[260px]'
        }`}
        style={{ height: '100vh', position: 'sticky', top: 0 }}
      >
        {/* Top Branding Header */}
        <div className="h-14 px-3 flex items-center justify-between border-b border-slate-200/80 bg-white shrink-0">
          <a
            href="/dashboard/accountant"
            onClick={(e) => {
              e.preventDefault();
              onSelectModule('dashboard');
            }}
            className="flex items-center gap-2.5 min-w-0 text-left cursor-pointer group"
          >
            <HospitalLogo
              size="sm"
              showText={!collapsed}
              title="Green Life Hospital"
              subtitle="Accounts & Finance"
            />
          </a>

          {onToggleCollapse && (
            <button
              type="button"
              onClick={onToggleCollapse}
              className="hidden lg:flex p-1.5 rounded-md hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
              title={collapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
            >
              <ChevronLeft
                className={`w-4 h-4 transition-transform duration-200 ${
                  collapsed ? 'rotate-180' : ''
                }`}
              />
            </button>
          )}
        </div>

        {/* Navigation Entries */}
        {renderNavList()}

        {/* Profile Card Footer */}
        {renderProfileFooter()}
      </aside>

      {/* Mobile Drawer */}
      {isOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          <div
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs animate-in fade-in"
            onClick={onCloseMobile}
          />
          <div className="relative w-72 max-w-[85vw] h-full bg-white shadow-2xl flex flex-col animate-in slide-in-from-left duration-200">
            {/* Top Branding Header in Mobile */}
            <div className="h-14 px-3.5 flex items-center justify-between border-b border-slate-200/80 bg-white shrink-0">
              <div className="flex items-center gap-2">
                <HospitalLogo
                  size="sm"
                  showText={true}
                  title="Green Life Hospital"
                  subtitle="Accounts & Finance"
                />
              </div>
              <button
                type="button"
                onClick={onCloseMobile}
                className="p-1.5 rounded-full border border-slate-200 bg-slate-50 text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <X size={17} strokeWidth={2} />
              </button>
            </div>

            {/* Navigation Entries in Mobile */}
            {renderNavList()}

            {/* Profile Card Footer in Mobile */}
            {renderProfileFooter()}
          </div>
        </div>
      )}
    </>
  );
};
