import React, { useState, useEffect } from 'react';
import { RoleCard } from '../../data/rolesData';
import {
  ACCOUNTANT_MODULE_ROUTE_MAP,
  ACCOUNTANT_ROUTE_TO_MODULE_MAP,
} from '../../data/accountantPortalData';
import { AccountantSidebar } from './AccountantSidebar';
import { AccountantTopbar } from './AccountantTopbar';
import { AccountantDashboardHome } from './AccountantDashboardHome';
import { AccountantBillingView } from './AccountantBillingView';
import { AccountantExpensesView } from './AccountantExpensesView';
import { AccountantBankingView } from './AccountantBankingView';
import { AccountantReportsView } from './AccountantReportsView';
import { AccountantSettingsView } from './AccountantSettingsView';

interface AccountantDashboardProps {
  role?: RoleCard;
  initialModule?: string;
  onSwitchRole: () => void;
  onGoHome: () => void;
}

export const AccountantDashboard: React.FC<AccountantDashboardProps> = ({
  initialModule,
  onSwitchRole,
  onGoHome,
}) => {
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

  // Sync URL on module change
  const handleSelectModule = (moduleId: string) => {
    setCurrentModule(moduleId);
    const route = ACCOUNTANT_MODULE_ROUTE_MAP[moduleId] || '/dashboard/accountant';
    if (window.location.pathname !== route) {
      window.history.pushState(null, '', route);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Listen to popstate (browser back/forward)
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

      // Income & Billing
      case 'billing-invoices':
        return <AccountantBillingView initialTab="invoices" />;
      case 'billing-collections':
        return <AccountantBillingView initialTab="collections" />;
      case 'billing-due':
        return <AccountantBillingView initialTab="due" />;
      case 'billing-refunds':
        return <AccountantBillingView initialTab="refunds" />;

      // Expenses & Payables
      case 'expenses-vouchers':
        return <AccountantExpensesView initialTab="vouchers" />;
      case 'expenses-suppliers':
        return <AccountantExpensesView initialTab="suppliers" />;
      case 'expenses-doctors':
        return <AccountantExpensesView initialTab="doctors" />;
      case 'expenses-payroll':
        return <AccountantExpensesView initialTab="payroll" />;

      // Treasury & Banking
      case 'banking-accounts':
        return <AccountantBankingView initialTab="accounts" />;
      case 'banking-reconcile':
        return <AccountantBankingView initialTab="reconcile" />;

      // Reports & Tax
      case 'reports-summary':
        return <AccountantReportsView initialTab="summary" />;
      case 'reports-pnl':
        return <AccountantReportsView initialTab="pnl" />;
      case 'reports-balance-sheet':
        return <AccountantReportsView initialTab="balance-sheet" />;
      case 'reports-tax':
        return <AccountantReportsView initialTab="tax" />;

      // Administration & Settings
      case 'settings-coa':
        return <AccountantSettingsView initialTab="coa" />;
      case 'settings-audit':
        return <AccountantSettingsView initialTab="audit" />;

      default:
        return <AccountantDashboardHome onSelectModule={handleSelectModule} />;
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50 font-['Plus_Jakarta_Sans',sans-serif] text-slate-800">
      {/* 1. SaaS Accountant Sidebar (Tree branch connectors like Pharmacist reference) */}
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

      {/* 2. Main Financial Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <AccountantTopbar
          currentModule={currentModule}
          onToggleCollapse={() => setSidebarCollapsed((prev) => !prev)}
          onToggleMobileSidebar={() => setMobileSidebarOpen((prev) => !prev)}
          onSelectModule={handleSelectModule}
          onSwitchRole={onSwitchRole}
          onGoHome={onGoHome}
        />

        <main className="flex-1 p-3.5 sm:p-5 max-w-7xl w-full mx-auto space-y-4">
          {renderModuleView()}
        </main>
      </div>
    </div>
  );
};
