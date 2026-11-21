import React, { useEffect, useState } from 'react';
import { RoleCard } from '../../data/rolesData';
import {
  DOCTOR_MODULE_ROUTE_MAP,
  DOCTOR_ROUTE_TO_MODULE_MAP,
} from '../../data/doctorPortalData';
import { DoctorSidebar } from './DoctorSidebar';
import { DoctorTopbar } from './DoctorTopbar';
import { DoctorDashboardHome } from './DoctorDashboardHome';
import { DoctorAppointmentsView } from './DoctorAppointmentsView';
import { DoctorPatientsView } from './DoctorPatientsView';
import { DoctorQueueView } from './DoctorQueueView';
import { DoctorConsultationsView } from './DoctorConsultationsView';
import { DoctorClinicalRecordsView } from './DoctorClinicalRecordsView';
import { DoctorPrescriptionsView } from './DoctorPrescriptionsView';
import { DoctorLabInvestigationsView } from './DoctorLabInvestigationsView';
import { DoctorRadiologyResultsView } from './DoctorRadiologyResultsView';
import { DoctorInpatientsView } from './DoctorInpatientsView';
import { DoctorReferralsView } from './DoctorReferralsView';
import { DoctorScheduleView } from './DoctorScheduleView';
import { DoctorTasksView } from './DoctorTasksView';
import { DoctorNotificationsView } from './DoctorNotificationsView';
import { DoctorReportsView } from './DoctorReportsView';
import { DoctorProfileSettingsView } from './DoctorProfileSettingsView';

interface DoctorDashboardProps {
  role?: RoleCard;
  initialModule?: string;
  onSwitchRole: () => void;
  onGoHome: () => void;
}

export const DoctorDashboard: React.FC<DoctorDashboardProps> = ({
  initialModule,
  onSwitchRole,
  onGoHome,
}) => {
  const resolveInitial = (slug?: string) => {
    if (!slug) {
      const pathSlug = window.location.pathname.replace(/^\/dashboard\/doctor\/?/, '').trim();
      return DOCTOR_ROUTE_TO_MODULE_MAP[pathSlug] || 'dashboard';
    }
    return DOCTOR_ROUTE_TO_MODULE_MAP[slug] || slug;
  };

  const [currentModule, setCurrentModule] = useState<string>(() => resolveInitial(initialModule));
  const [sidebarCollapsed, setSidebarCollapsed] = useState<boolean>(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState<boolean>(false);

  // Synchronize when initialModule prop changes
  useEffect(() => {
    if (initialModule) {
      const matched = DOCTOR_ROUTE_TO_MODULE_MAP[initialModule] || initialModule;
      setCurrentModule(matched);
    }
  }, [initialModule]);

  // Handle browser back and forward button popstate
  useEffect(() => {
    const handlePopState = () => {
      const pathname = window.location.pathname;
      if (pathname.startsWith('/dashboard/doctor')) {
        const slug = pathname.replace(/^\/dashboard\/doctor\/?/, '').trim();
        const matched = DOCTOR_ROUTE_TO_MODULE_MAP[slug] || 'dashboard';
        setCurrentModule(matched);
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigateToModule = (modId: string) => {
    setCurrentModule(modId);
    const targetRoute = DOCTOR_MODULE_ROUTE_MAP[modId] || `/dashboard/doctor/${modId}`;
    if (window.location.pathname !== targetRoute) {
      window.history.pushState(null, '', targetRoute);
    }
  };

  // Cross-screen selected patient for starting consultation / prescription
  const [activePatientForRx, setActivePatientForRx] = useState<{
    name: string;
    uhid: string;
    age: number;
    gender: string;
  } | null>(null);

  const handleStartConsultation = (_patientOrApt?: any) => {
    navigateToModule('consultations');
  };

  const handleOpenPrescription = (patientOrApt: any) => {
    setActivePatientForRx({
      name: patientOrApt.patientName || patientOrApt.name || '',
      uhid: patientOrApt.uhid || '',
      age: patientOrApt.age || 45,
      gender: patientOrApt.gender || 'Male',
    });
    navigateToModule('prescriptions');
  };

  const renderModuleContent = () => {
    switch (currentModule) {
      case 'dashboard':
        return (
          <DoctorDashboardHome
            onNavigate={(mod) => navigateToModule(mod)}
            onOpenPrescriptionModal={() => navigateToModule('prescriptions')}
            onOpenPrescription={handleOpenPrescription}
          />
        );

      case 'my-appointments':
        return (
          <DoctorAppointmentsView
            onStartConsultation={handleStartConsultation}
            onOpenPrescription={handleOpenPrescription}
          />
        );

      case 'my-patients':
        return (
          <DoctorPatientsView
            onOpenConsultation={handleStartConsultation}
            onOpenPrescription={handleOpenPrescription}
          />
        );

      case 'patient-queue':
        return (
          <DoctorQueueView
            onStartConsultation={handleStartConsultation}
          />
        );

      case 'consultations':
        return <DoctorConsultationsView />;

      case 'clinical-records':
        return <DoctorClinicalRecordsView />;

      case 'prescriptions':
        return (
          <DoctorPrescriptionsView
            initialPatient={activePatientForRx}
          />
        );

      case 'lab-investigations':
        return <DoctorLabInvestigationsView />;

      case 'radiology-results':
        return <DoctorRadiologyResultsView />;

      case 'my-inpatients':
        return <DoctorInpatientsView />;

      case 'referrals':
        return <DoctorReferralsView />;

      case 'my-schedule':
        return <DoctorScheduleView />;

      case 'clinical-tasks':
        return <DoctorTasksView />;

      case 'notifications':
        return <DoctorNotificationsView />;

      case 'my-reports':
        return <DoctorReportsView />;

      case 'profile-settings':
        return <DoctorProfileSettingsView />;

      default:
        return (
          <DoctorDashboardHome
            onNavigate={(mod) => navigateToModule(mod)}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-[#F1F3F6] flex font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Superadmin-Style Doctor Portal Sidebar */}
      <DoctorSidebar
        currentModule={currentModule}
        onSelectModule={(mod) => navigateToModule(mod)}
        collapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        onExpandDesktop={() => setSidebarCollapsed(false)}
        isOpen={mobileSidebarOpen}
        onCloseMobile={() => setMobileSidebarOpen(false)}
        onSwitchRole={onSwitchRole}
        onGoHome={onGoHome}
      />

      {/* Main Content Area matching Superadmin Full-Width layout */}
      <div
        className={`flex-1 flex flex-col min-w-0 transition-all duration-200 ${
          sidebarCollapsed ? 'lg:pl-[68px]' : 'lg:pl-64'
        }`}
      >
        <DoctorTopbar
          currentModule={currentModule}
          onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
          onToggleMobileSidebar={() => setMobileSidebarOpen(true)}
          onSelectModule={(mod) => navigateToModule(mod)}
          onSwitchRole={onSwitchRole}
          onGoHome={onGoHome}
        />

        {/* Full-Width Main Workstation Body without any max-width constraints */}
        <main className="w-full max-w-none p-2 sm:p-2.5 space-y-2 min-w-0 overflow-x-hidden flex-1">
          {renderModuleContent()}
        </main>
      </div>
    </div>
  );
};
