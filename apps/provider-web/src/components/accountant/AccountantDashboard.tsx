import React, { useState, useEffect } from 'react';
import { CheckCircle2 } from 'lucide-react';
import { RoleCard } from '../../data/rolesData';
import {
  ACCOUNTANT_MODULE_ROUTE_MAP,
  ACCOUNTANT_ROUTE_TO_MODULE_MAP,
} from '../../data/accountantPortalData';
import {
  AccountantLedgerProvider,
  useAccountantLedger,
} from '../../data/accountantLedgerContext';
import { AccountantSidebar } from './AccountantSidebar';
import { AccountantTopbar } from './AccountantTopbar';
import { AccountantDashboardHome } from './AccountantDashboardHome';
import { AccountantSingleEntryView } from './AccountantSingleEntryView';
import { AccountantJournalVouchersView } from './AccountantJournalVouchersView';
import { AccountantBooksLedgerView } from './AccountantBooksLedgerView';
import { AccountantBillingView } from './AccountantBillingView';
import { AccountantExpensesView } from './AccountantExpensesView';
import { AccountantReportsView } from './AccountantReportsView';
import { AccountantSettingsView } from './AccountantSettingsView';

interface AccountantDashboardProps {
  role?: RoleCard;
  initialModule?: string;
  onSwitchRole: () => void;
  onGoHome: () => void;
}

const AccountantDashboardShell: React.FC<AccountantDashboardProps> = ({
  initialModule,
  onSwitchRole,
  onGoHome,
}) => {
  const { toastMessage } = useAccountantLedger();

  const resolveInitial = (slug?: string) => {
    if (slug) {
      if (ACCOUNTANT_ROUTE_TO_MODULE_MAP[slug]) return ACCOUNTANT_ROUTE_TO_MODULE_MAP[slug];
      if (ACCOUNTANT_ROUTE_TO_MODULE_MAP[`/dashboard/accountant/${slug}`]) {
        return ACCOUNTANT_ROUTE_TO_MODULE_MAP[`/dashboard/accountant/${slug}`];
      }
      return slug;
    }
    const path = window.location.pathname;
    return ACCOUNTANT_ROUTE_TO_MODULE_MAP[path] || 'dashboard';
  };

  const [currentModule, setCurrentModule] = useState<string>(() => resolveInitial(initialModule));
  const [sidebarCollapsed, setSidebarCollapsed] = useState<boolean>(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState<boolean>(false);

  useEffect(() => {
    if (initialModule) {
      setCurrentModule(resolveInitial(initialModule));
    }
  }, [initialModule]);

  const handleSelectModule = (moduleId: string) => {
    setCurrentModule(moduleId);
    const route = ACCOUNTANT_MODULE_ROUTE_MAP[moduleId] || '/dashboard/accountant';
    if (window.location.pathname !== route) {
      window.history.pushState(null, '', route);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    const onPop = () => {
      const path = window.location.pathname;
      const mod = ACCOUNTANT_ROUTE_TO_MODULE_MAP[path] || 'dashboard';
      setCurrentModule(mod);
    };
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, []);

  const renderModuleView = () => {
    switch (currentModule) {
      case 'dashboard':
        return <AccountantDashboardHome onSelectModule={handleSelectModule} />;

      // Single-Entry & Batch Entry (pharmacy-care Simple Mode workflows)
      case 'entry-quick':
        return <AccountantSingleEntryView viewMode="quick" onSelectModule={handleSelectModule} />;
      case 'entry-multi':
        return <AccountantSingleEntryView viewMode="multi" onSelectModule={handleSelectModule} />;

      // Hospital Billing & Collections
      case 'billing-invoices':
        return <AccountantBillingView initialTab="invoices" />;
      case 'billing-collections':
        return <AccountantBillingView initialTab="collections" />;
      case 'billing-due':
        return <AccountantBillingView initialTab="due" />;
      case 'billing-refunds':
        return <AccountantBillingView initialTab="refunds" />;

      // Vouchers, Double-Entry Journal & Operational Payables
      case 'expenses-vouchers':
        return <AccountantJournalVouchersView viewMode="vouchers" />;
      case 'journal-entry':
        return <AccountantJournalVouchersView viewMode="journal" />;
      case 'expenses-suppliers':
        return <AccountantExpensesView initialTab="suppliers" />;
      case 'expenses-doctors':
        return <AccountantExpensesView initialTab="doctors" />;
      case 'expenses-payroll':
        return <AccountantExpensesView initialTab="payroll" />;

      // Books, Cash/Bank Registers & Double-Entry GL
      case 'books-day':
        return <AccountantBooksLedgerView initialTab="day-book" />;
      case 'banking-accounts':
        return <AccountantBooksLedgerView initialTab="cash-book" />;
      case 'banking-reconcile':
        return <AccountantBooksLedgerView initialTab="reconciliation" />;
      case 'books-ledger':
        return <AccountantBooksLedgerView initialTab="ledger" />;
      case 'books-parties':
        return <AccountantBooksLedgerView initialTab="parties" />;

      // Financial Statements
      case 'reports-summary':
        return <AccountantReportsView initialTab="pnl" />;
      case 'reports-pnl':
        return <AccountantReportsView initialTab="pnl" />;
      case 'reports-trial-balance':
        return <AccountantReportsView initialTab="trial-balance" />;
      case 'reports-balance-sheet':
        return <AccountantReportsView initialTab="balance-sheet" />;
      case 'reports-tax':
        return <AccountantReportsView initialTab="tax" />;

      // Administration & Mode Setup
      case 'settings-coa':
        return <AccountantSettingsView initialTab="coa" />;
      case 'settings-periods':
        return <AccountantSettingsView initialTab="periods" />;
      case 'settings-audit':
        return <AccountantSettingsView initialTab="audit" />;
      case 'settings-mode':
        return <AccountantSettingsView initialTab="mode" />;

      default:
        return <AccountantDashboardHome onSelectModule={handleSelectModule} />;
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50 font-['Plus_Jakarta_Sans',sans-serif] text-slate-800">
      {toastMessage && (
        <div className="fixed bottom-4 right-4 z-50 bg-slate-900 text-white px-4 py-2.5 rounded-[4px] shadow-xl text-xs font-medium flex items-center gap-2 border border-slate-700 animate-in fade-in slide-in-from-bottom-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      <AccountantSidebar
        currentModule={currentModule}
        onSelectModule={handleSelectModule}
        collapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed((prev) => !prev)}
        onExpandDesktop={() => setSidebarCollapsed(false)}
        isOpen={mobileSidebarOpen}
        onCloseMobile={() => setMobileSidebarOpen(false)}
        onSwitchRole={onSwitchRole}
        onGoHome={onGoHome}
      />

      <div className="flex-1 flex flex-col min-w-0">
        <AccountantTopbar
          currentModule={currentModule}
          onToggleCollapse={() => setSidebarCollapsed((prev) => !prev)}
          onToggleMobileSidebar={() => setMobileSidebarOpen((prev) => !prev)}
          onSelectModule={handleSelectModule}
          onSwitchRole={onSwitchRole}
          onGoHome={onGoHome}
        />

        <main className="flex-1 p-3.5 sm:p-5 max-w-[1600px] w-full mx-auto space-y-4">
          {renderModuleView()}
        </main>
      </div>
    </div>
  );
};

export const AccountantDashboard: React.FC<AccountantDashboardProps> = (props) => (
  <AccountantLedgerProvider>
    <AccountantDashboardShell {...props} />
  </AccountantLedgerProvider>
);
