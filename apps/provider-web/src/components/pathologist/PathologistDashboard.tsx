import React, { useState, useEffect } from 'react';
import { RoleCard } from '../../data/rolesData';
import {
  PATHOLOGIST_MODULE_ROUTE_MAP,
  PATHOLOGIST_ROUTE_TO_MODULE_MAP,
} from '../../data/pathologistPortalData';
import { PathologistSidebar } from './PathologistSidebar';
import { PathologistTopbar } from './PathologistTopbar';
import { PathologistDashboardHome } from './PathologistDashboardHome';
import { PathologistVerificationView } from './PathologistVerificationView';
import { PathologistCriticalView } from './PathologistCriticalView';
import { PathologistReportsView } from './PathologistReportsView';
import { PathologistWorklistView } from './PathologistWorklistView';
import { PathologistMastersView } from './PathologistMastersView';
import { PathologistProfileView } from './PathologistProfileView';

interface PathologistDashboardProps {
  role: RoleCard;
  initialModule?: string;
  onSwitchRole?: () => void;
  onGoHome?: () => void;
}

export const PathologistDashboard: React.FC<PathologistDashboardProps> = ({
  role: _role,
  initialModule,
  onSwitchRole,
  onGoHome,
}) => {
  const resolveInitialModule = (): string => {
    if (initialModule) {
      if (PATHOLOGIST_ROUTE_TO_MODULE_MAP[initialModule]) {
        return PATHOLOGIST_ROUTE_TO_MODULE_MAP[initialModule];
      }
      return initialModule;
    }
    const path = window.location.pathname;
    if (PATHOLOGIST_ROUTE_TO_MODULE_MAP[path]) {
      return PATHOLOGIST_ROUTE_TO_MODULE_MAP[path];
    }
    return 'dashboard';
  };

  const [currentModule, setCurrentModule] = useState<string>(resolveInitialModule());
  const [collapsed, setCollapsed] = useState<boolean>(false);
  const [isMobileOpen, setIsMobileOpen] = useState<boolean>(false);

  useEffect(() => {
    if (initialModule) {
      const resolved = PATHOLOGIST_ROUTE_TO_MODULE_MAP[initialModule] || initialModule;
      setCurrentModule(resolved);
    }
  }, [initialModule]);

  // Handle browser back/forward buttons
  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname;
      const matched = PATHOLOGIST_ROUTE_TO_MODULE_MAP[path];
      if (matched) {
        setCurrentModule(matched);
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const handleSelectModule = (moduleId: string) => {
    setCurrentModule(moduleId);
    const targetRoute = PATHOLOGIST_MODULE_ROUTE_MAP[moduleId];
    if (targetRoute && window.location.pathname !== targetRoute) {
      window.history.pushState(null, '', targetRoute);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const renderActiveView = () => {
    switch (currentModule) {
      case 'dashboard':
        return <PathologistDashboardHome onSelectModule={handleSelectModule} />;
      case 'verification-pending':
        return <PathologistVerificationView />;
      case 'critical-results':
        return <PathologistCriticalView />;
      case 'reports-signed':
        return <PathologistReportsView />;
      case 'worklist-requests':
        return <PathologistWorklistView initialSubTab="requests" />;
      case 'worklist-processing':
        return <PathologistWorklistView initialSubTab="processing" />;
      case 'worklist-samples':
        return <PathologistWorklistView initialSubTab="samples" />;
      case 'masters-tests':
        return <PathologistMastersView initialSubTab="catalog" />;
      case 'masters-qc':
        return <PathologistMastersView initialSubTab="qc" />;
      case 'masters-analytics':
        return <PathologistMastersView initialSubTab="analytics" />;
      case 'profile-settings':
        return <PathologistProfileView />;
      default:
        return <PathologistDashboardHome onSelectModule={handleSelectModule} />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Sidebar Navigation */}
      <PathologistSidebar
        currentModule={currentModule}
        onSelectModule={handleSelectModule}
        collapsed={collapsed}
        onToggleCollapse={() => setCollapsed((prev) => !prev)}
        isOpen={isMobileOpen}
        onCloseMobile={() => setIsMobileOpen(false)}
        onSwitchRole={onSwitchRole}
        onGoHome={onGoHome}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Topbar */}
        <PathologistTopbar
          currentModule={currentModule}
          onSelectModule={handleSelectModule}
          collapsed={collapsed}
          onToggleCollapse={() => setCollapsed((prev) => !prev)}
          onOpenMobile={() => setIsMobileOpen(true)}
          onQuickVerifyNext={() => handleSelectModule('verification-pending')}
          criticalCount={4}
        />

        {/* View Surface */}
        <main className="flex-1 p-3.5 sm:p-5 lg:p-6 w-full max-w-[1600px] mx-auto">
          {renderActiveView()}
        </main>
      </div>
    </div>
  );
};
