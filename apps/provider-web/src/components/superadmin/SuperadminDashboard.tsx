import React, { useState } from 'react';
import { SuperadminSidebar } from './SuperadminSidebar';
import { SuperadminTopbar } from './SuperadminTopbar';
import { PatientDirectory } from './patients/PatientDirectory';
import { AppointmentDirectory } from './appointments/AppointmentDirectory';
import { OpdDirectory } from './opd/OpdDirectory';
import { PharmacyDirectory } from './pharmacy/PharmacyDirectory';
import { BloodBankDirectory } from './bloodbank/BloodBankDirectory';
import { AmbulanceDirectory } from './ambulance/AmbulanceDirectory';
import { RadiologyDirectory } from './radiology/RadiologyDirectory';
import { PathologyDirectory } from './pathology/PathologyDirectory';
import { DutyRosterDirectory } from './dutyroster/DutyRosterDirectory';
import { BirthDeathDirectory } from './birthdeath/BirthDeathDirectory';
import { MultiBranchDirectory } from './branch/MultiBranchDirectory';
import { QrAttendanceDirectory } from './attendance/QrAttendanceDirectory';
import { SuperadminOverview } from './dashboard/SuperadminOverview';

interface SuperadminDashboardProps {
  onExitSuperadmin: () => void;
  onSwitchRole?: () => void;
}

/**
 * Superadmin Hospital Command Workstation.
 * Java-desktop inspired high-density clinical workstation layout.
 */
export const SuperadminDashboard: React.FC<SuperadminDashboardProps> = ({
  onExitSuperadmin,
  onSwitchRole,
}) => {
  const [currentModule, setCurrentModule] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div className="min-h-screen bg-[#F1F3F6] flex font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Sidebar Navigation */}
      <SuperadminSidebar
        currentModule={currentModule}
        onSelectModule={setCurrentModule}
        collapsed={sidebarCollapsed}
        onExpandDesktop={() => setSidebarCollapsed(false)}
        isOpen={sidebarOpen}
        onCloseMobile={() => setSidebarOpen(false)}
        onExitSuperadmin={onExitSuperadmin}
        onSwitchRole={onSwitchRole}
      />

      {/* Full-Width Content Wrapper */}
      <div
        className={`flex-1 flex flex-col min-w-0 transition-all duration-200 ${
          sidebarCollapsed ? 'lg:pl-[60px]' : 'lg:pl-60'
        }`}
      >
        <SuperadminTopbar
          currentModule={currentModule}
          onToggleCollapse={() => setSidebarCollapsed((prev) => !prev)}
          onToggleMobileSidebar={() => setSidebarOpen((prev) => !prev)}
          onSelectModule={setCurrentModule}
          onExitSuperadmin={onExitSuperadmin}
          onSwitchRole={onSwitchRole}
        />

        {/* Full-Width Main Workstation Body */}
        <main className="w-full max-w-none p-2 sm:p-2.5 space-y-2 min-w-0 overflow-x-hidden flex-1">
          {currentModule === 'patient' ? (
            <PatientDirectory />
          ) : currentModule === 'appointment' ? (
            <AppointmentDirectory />
          ) : currentModule === 'opd' ? (
            <OpdDirectory />
          ) : currentModule === 'pharmacy' ? (
            <PharmacyDirectory />
          ) : currentModule === 'blood-bank' ? (
            <BloodBankDirectory />
          ) : currentModule === 'ambulance' ? (
            <AmbulanceDirectory />
          ) : currentModule === 'radiology' ? (
            <RadiologyDirectory />
          ) : currentModule === 'pathology' ? (
            <PathologyDirectory />
          ) : currentModule === 'duty-roster' ? (
            <DutyRosterDirectory />
          ) : currentModule === 'birth-death' ||
            currentModule === 'birth-record' ||
            currentModule === 'death-record' ? (
            <BirthDeathDirectory initialSubTab={currentModule} />
          ) : currentModule === 'multi-branch' ||
            currentModule === 'branch-overview' ||
            currentModule === 'branch-report' ||
            currentModule === 'branch-settings' ? (
            <MultiBranchDirectory initialSubTab={currentModule} />
          ) : currentModule === 'qr-attendance' ||
            currentModule === 'attendance-logs' ||
            currentModule === 'attendance-settings' ? (
            <QrAttendanceDirectory initialSubTab={currentModule} />
          ) : (
            <SuperadminOverview onSelectModule={setCurrentModule} />
          )}
        </main>
      </div>
    </div>
  );
};

export default SuperadminDashboard;
