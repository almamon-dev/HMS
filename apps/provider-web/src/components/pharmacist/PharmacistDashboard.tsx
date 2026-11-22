import React, { useEffect, useState } from 'react';
import { RoleCard } from '../../data/rolesData';
import {
  PHARMACIST_MODULE_ROUTE_MAP,
  PHARMACIST_ROUTE_TO_MODULE_MAP,
} from '../../data/pharmacistPortalData';
import { PharmacistSidebar } from './PharmacistSidebar';
import { PharmacistTopbar } from './PharmacistTopbar';
import { PharmacistDashboardHome } from './PharmacistDashboardHome';
import { PharmacistPosView } from './PharmacistPosView';
import { PharmacistReceiptView } from './PharmacistReceiptView';
import { PharmacistDispenseView } from './PharmacistDispenseView';
import { PharmacistInventoryView } from './PharmacistInventoryView';
import { PharmacistBatchExpiryView } from './PharmacistBatchExpiryView';
import { PharmacistWardIndentsView } from './PharmacistWardIndentsView';
import { PharmacistTransfersView } from './PharmacistTransfersView';
import { PharmacistPurchasesView } from './PharmacistPurchasesView';
import { PharmacistNarcoticsView } from './PharmacistNarcoticsView';
import { PharmacistReturnsView } from './PharmacistReturnsView';
import { PharmacistReportsView } from './PharmacistReportsView';

interface PharmacistDashboardProps {
  role?: RoleCard;
  initialModule?: string;
  onSwitchRole: () => void;
  onGoHome: () => void;
}

export const PharmacistDashboard: React.FC<PharmacistDashboardProps> = ({
  initialModule,
  onSwitchRole,
  onGoHome,
}) => {
  const resolveInitial = (slug?: string) => {
    if (!slug) {
      const pathSlug = window.location.pathname.replace(/^\/dashboard\/pharmacist\/?/, '').trim();
      return PHARMACIST_ROUTE_TO_MODULE_MAP[pathSlug] || 'dashboard';
    }
    return PHARMACIST_ROUTE_TO_MODULE_MAP[slug] || slug;
  };

  const [currentModule, setCurrentModule] = useState<string>(() => resolveInitial(initialModule));
  const [sidebarCollapsed, setSidebarCollapsed] = useState<boolean>(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState<boolean>(false);

  // Synchronize when initialModule prop changes
  useEffect(() => {
    if (initialModule) {
      const matched = PHARMACIST_ROUTE_TO_MODULE_MAP[initialModule] || initialModule;
      setCurrentModule(matched);
    }
  }, [initialModule]);

  // Handle browser back and forward button popstate
  useEffect(() => {
    const handlePopState = () => {
      const pathname = window.location.pathname;
      if (pathname.startsWith('/dashboard/pharmacist')) {
        const slug = pathname.replace(/^\/dashboard\/pharmacist\/?/, '').trim();
        const matched = PHARMACIST_ROUTE_TO_MODULE_MAP[slug] || 'dashboard';
        setCurrentModule(matched);
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigateToModule = (modId: string) => {
    setCurrentModule(modId);
    const targetRoute = PHARMACIST_MODULE_ROUTE_MAP[modId] || `/dashboard/pharmacist/${modId}`;
    if (window.location.pathname !== targetRoute) {
      window.history.pushState(null, '', targetRoute);
    }
  };

  const renderModuleView = () => {
    switch (currentModule) {
      case 'dashboard':
        return <PharmacistDashboardHome onNavigate={navigateToModule} />;
      case 'pos-billing':
      case 'pos-checkout':
        return <PharmacistPosView onNavigate={navigateToModule} />;
      case 'pos-receipt':
        return (
          <PharmacistReceiptView
            onBackToPos={() => navigateToModule('pos-billing')}
            onProceedToCheckout={() => navigateToModule('pos-billing')}
          />
        );
      case 'e-prescriptions':
        return <PharmacistDispenseView />;
      case 'inventory-master':
        return <PharmacistInventoryView />;
      case 'batch-expiry':
        return <PharmacistBatchExpiryView />;
      case 'ward-indents':
        return <PharmacistWardIndentsView />;
      case 'stock-transfers':
        return <PharmacistTransfersView />;
      case 'purchase-orders':
        return <PharmacistPurchasesView />;
      case 'returns-refunds':
        return <PharmacistReturnsView />;
      case 'narcotics-register':
        return <PharmacistNarcoticsView />;
      case 'pharmacy-reports':
        return <PharmacistReportsView />;
      default:
        return <PharmacistDashboardHome onNavigate={navigateToModule} />;
    }
  };

  return (
    <div className="h-screen bg-[#f8fafc] flex overflow-hidden font-['Inter',sans-serif]">
      {/* Clean SaaS Pharmacist Sidebar (matching pharmacy-saas) */}
      <PharmacistSidebar
        currentModule={currentModule}
        onSelectModule={navigateToModule}
        collapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        onExpandDesktop={() => setSidebarCollapsed(false)}
        isOpen={mobileSidebarOpen}
        onCloseMobile={() => setMobileSidebarOpen(false)}
        onSwitchRole={onSwitchRole}
        onGoHome={onGoHome}
      />

      {/* Main Content Area (natural flex layout without manual padding gaps) */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Topbar Header (Doctor-style consistent header) */}
        <PharmacistTopbar
          currentModule={currentModule}
          onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
          onToggleMobileSidebar={() => setMobileSidebarOpen(!mobileSidebarOpen)}
          onSelectModule={navigateToModule}
          onSwitchRole={onSwitchRole}
          onGoHome={onGoHome}
        />

        {/* Workstation Body */}
        <main className="flex-1 overflow-y-auto overflow-x-hidden p-2 sm:p-2.5 flex flex-col">
          {renderModuleView()}
        </main>
      </div>
    </div>
  );
};
