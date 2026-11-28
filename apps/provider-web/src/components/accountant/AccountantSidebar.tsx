import React from 'react';
import {
  BarChart3,
  BookOpen,
  ChevronLeft,
  Layers,
  LayoutDashboard,
  LogOut,
  PlusCircle,
  Receipt,
  Settings,
  Wallet,
  X,
} from 'lucide-react';
import { HospitalLogo } from '../common/HospitalLogo';
import { CURRENT_ACCOUNTANT } from '../../data/accountantPortalData';
import { useAccountantLedger } from '../../data/accountantLedgerContext';
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
 * Organized Hospital Accountant Sidebar (pharmacy-care Dual-Mode Template):
 * - Adapts seamlessly between Simple Mode (Single-Entry) & Advanced Mode (Full Double-Entry)
 * - 6 clean groups: Overview & Entry, Hospital Billing, Vouchers & Payables, Books & Ledgers, Financial Reports, Accounting Setup
 * - Continuous #FF4A1F tree-branch connector lines & stationary bullseye active indicator
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
  const { mode, stats } = useAccountantLedger();
  const isAdvanced = mode === 'advanced';

  const navEntries: AccountantSidebarEntry[] = [
    ...(isAdvanced
      ? [
          {
            category: 'Overview & Entry',
            id: 'dashboard',
            name: 'Overview',
            path: '/dashboard/accountant',
            active: currentModule === 'dashboard',
            icon: LayoutDashboard,
          },
          {
            category: 'Overview & Entry',
            id: 'entry-quick',
            name: 'Quick Entry',
            path: '/dashboard/accountant/quick-entry',
            active: currentModule === 'entry-quick',
            icon: PlusCircle,
            badge: '1x',
          },
          {
            category: 'Overview & Entry',
            id: 'entry-multi',
            name: 'Multi Entry',
            path: '/dashboard/accountant/multi-entry',
            active: currentModule === 'entry-multi',
            icon: Layers,
          },
        ]
      : [
          {
            category: 'Simple Cashbook',
            id: 'dashboard',
            name: 'Dashboard',
            path: '/dashboard/accountant',
            active: currentModule === 'dashboard' || currentModule === 'entry-quick',
            icon: LayoutDashboard,
          },
          {
            category: 'Simple Cashbook',
            id: 'entry-multi',
            name: 'Multi Entry',
            path: '/dashboard/accountant/multi-entry',
            active: currentModule === 'entry-multi',
            icon: Layers,
          },
        ]),
    {
      category: 'Hospital Operations',
      group: 'Hospital Billing',
      icon: Receipt,
      items: [
        {
          id: 'billing-invoices',
          name: 'Patient Invoices',
          path: '/dashboard/accountant/invoices',
          active: currentModule === 'billing-invoices',
          badge: 'IPD',
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
      category: 'Accounting Core',
      group: isAdvanced ? 'Vouchers & Journal' : 'Vouchers & Payables',
      icon: Wallet,
      items: [
        {
          id: 'expenses-vouchers',
          name: 'Vouchers Hub',
          path: '/dashboard/accountant/vouchers',
          active: currentModule === 'expenses-vouchers',
          badge: stats.pendingApprovalCount > 0 ? stats.pendingApprovalCount : undefined,
        },
        ...(isAdvanced
          ? [
              {
                id: 'journal-entry',
                name: 'Journal (Dr/Cr)',
                path: '/dashboard/accountant/journal',
                active: currentModule === 'journal-entry',
              },
            ]
          : []),
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
      category: 'Accounting Core',
      group: 'Books & Ledgers',
      icon: BookOpen,
      items: [
        {
          id: 'books-day',
          name: 'Day Book',
          path: '/dashboard/accountant/day-book',
          active: currentModule === 'books-day',
        },
        {
          id: 'banking-accounts',
          name: 'Cash & Bank Book',
          path: '/dashboard/accountant/cash-book',
          active: currentModule === 'banking-accounts',
        },
        ...(isAdvanced
          ? [
              {
                id: 'banking-reconcile',
                name: 'Bank Recon',
                path: '/dashboard/accountant/reconciliation',
                active: currentModule === 'banking-reconcile',
              },
              {
                id: 'books-ledger',
                name: 'General Ledger',
                path: '/dashboard/accountant/ledger',
                active: currentModule === 'books-ledger',
              },
            ]
          : []),
        {
          id: 'books-parties',
          name: 'Parties & Ageing',
          path: '/dashboard/accountant/parties',
          active: currentModule === 'books-parties',
        },
      ],
    },
    {
      category: 'Reports & Setup',
      group: 'Financial Reports',
      icon: BarChart3,
      items: [
        {
          id: 'reports-pnl',
          name: 'Profit & Loss',
          path: '/dashboard/accountant/reports/pnl',
          active: currentModule === 'reports-pnl' || currentModule === 'reports-summary',
        },
        ...(isAdvanced
          ? [
              {
                id: 'reports-trial-balance',
                name: 'Trial Balance',
                path: '/dashboard/accountant/reports/trial-balance',
                active: currentModule === 'reports-trial-balance',
              },
              {
                id: 'reports-balance-sheet',
                name: 'Balance Sheet',
                path: '/dashboard/accountant/reports/balance-sheet',
                active: currentModule === 'reports-balance-sheet',
              },
            ]
          : []),
        {
          id: 'reports-tax',
          name: 'Cash Flow & VAT',
          path: '/dashboard/accountant/reports/tax',
          active: currentModule === 'reports-tax',
        },
      ],
    },
    {
      category: 'Reports & Setup',
      group: 'Accounting Setup',
      icon: Settings,
      items: [
        ...(isAdvanced
          ? [
              {
                id: 'settings-coa',
                name: 'Chart of Accounts',
                path: '/dashboard/accountant/coa',
                active: currentModule === 'settings-coa',
              },
              {
                id: 'settings-periods',
                name: 'Fiscal Periods',
                path: '/dashboard/accountant/periods',
                active: currentModule === 'settings-periods',
              },
              {
                id: 'settings-audit',
                name: 'Audit Logs',
                path: '/dashboard/accountant/audit-logs',
                active: currentModule === 'settings-audit',
              },
            ]
          : []),
        {
          id: 'settings-mode',
          name: 'Settings & Mode',
          path: '/dashboard/accountant/settings',
          active: currentModule === 'settings-mode',
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
                {isAdvanced ? 'Double-Entry Ledger' : 'Single-Entry Simple'}
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
      <aside
        className={`hidden md:flex flex-col shrink-0 border-r border-slate-200/80 bg-white transition-all duration-200 select-none font-['Plus_Jakarta_Sans',sans-serif] ${
          collapsed ? 'w-[68px]' : 'w-[260px]'
        }`}
        style={{ height: '100vh', position: 'sticky', top: 0 }}
      >
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

        {renderNavList()}
        {renderProfileFooter()}
      </aside>

      {isOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          <div
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs animate-in fade-in"
            onClick={onCloseMobile}
          />
          <div className="relative w-72 max-w-[85vw] h-full bg-white shadow-2xl flex flex-col animate-in slide-in-from-left duration-200">
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
            {renderNavList()}
            {renderProfileFooter()}
          </div>
        </div>
      )}
    </>
  );
};
