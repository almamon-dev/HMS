import React, { useState } from 'react';
import { RoleCard } from '../../data/rolesData';
import { PatientSidebar } from './PatientSidebar';
import { PatientTopbar } from './PatientTopbar';
import { PatientDashboardHome } from './PatientDashboardHome';
import { PatientAppointmentsView } from './PatientAppointmentsView';
import { PatientPrescriptionsView } from './PatientPrescriptionsView';
import { PatientLabReportsView } from './PatientLabReportsView';
import { PatientRadiologyReportsView } from './PatientRadiologyReportsView';
import { PatientVitalsView } from './PatientVitalsView';
import { PatientAdmissionsView } from './PatientAdmissionsView';
import { PatientBillingView } from './PatientBillingView';
import { PatientDoctorsView } from './PatientDoctorsView';
import { PatientMedicalRecordsView } from './PatientMedicalRecordsView';
import { PatientServicesView } from './PatientServicesView';
import { PatientSupportView } from './PatientSupportView';

interface PatientDashboardProps {
  role?: RoleCard;
  onSwitchRole: () => void;
  onGoHome: () => void;
}

export const PatientDashboard: React.FC<PatientDashboardProps> = ({
  onSwitchRole,
  onGoHome,
}) => {
  const [currentModule, setCurrentModule] = useState<string>('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState<boolean>(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState<boolean>(false);

  const renderModuleContent = () => {
    switch (currentModule) {
      case 'dashboard':
        return (
          <PatientDashboardHome
            onNavigate={(mod) => setCurrentModule(mod)}
          />
        );

      case 'profile':
        return <PatientSupportView mode="profile" />;

      case 'appointments':
        return <PatientAppointmentsView />;

      case 'find-doctor':
        return (
          <PatientDoctorsView
            mode="find"
            onBookDoctor={() => setCurrentModule('appointments')}
          />
        );

      case 'my-doctors':
        return (
          <PatientDoctorsView
            mode="my"
            onBookDoctor={() => setCurrentModule('appointments')}
          />
        );

      case 'medical-history':
        return <PatientMedicalRecordsView mode="history" />;

      case 'prescriptions':
        return <PatientPrescriptionsView />;

      case 'lab-reports':
        return <PatientLabReportsView />;

      case 'radiology-reports':
        return <PatientRadiologyReportsView />;

      case 'vitals':
        return <PatientVitalsView />;

      case 'medical-documents':
        return <PatientMedicalRecordsView mode="documents" />;

      case 'admissions':
        return <PatientAdmissionsView />;

      case 'teleconsultation':
        return <PatientServicesView mode="teleconsultation" />;

      case 'billing':
        return <PatientBillingView />;

      case 'download-center':
        return <PatientServicesView mode="download-center" />;

      case 'notifications':
        return <PatientSupportView mode="notifications" />;

      case 'support-messages':
        return <PatientSupportView mode="support-messages" />;

      case 'settings':
        return <PatientSupportView mode="settings" />;

      default:
        return (
          <PatientDashboardHome
            onNavigate={(mod) => setCurrentModule(mod)}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-[#F1F3F6] flex font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Superadmin-Style Patient Portal Sidebar */}
      <PatientSidebar
        currentModule={currentModule}
        onSelectModule={(mod) => setCurrentModule(mod)}
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
        <PatientTopbar
          currentModule={currentModule}
          onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
          onToggleMobileSidebar={() => setMobileSidebarOpen(true)}
          onSelectModule={(mod) => setCurrentModule(mod)}
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
