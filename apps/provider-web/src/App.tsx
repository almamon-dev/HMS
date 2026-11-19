import { useState } from 'react';
import { RoleCard } from './data/rolesData';
import { HeaderNavbar } from './components/landing/HeaderNavbar';
import { FloatingSideTabs } from './components/landing/FloatingSideTabs';
import { HeroBanner } from './components/landing/HeroBanner';
import { StatsRibbon } from './components/landing/StatsRibbon';
import { LeadershipMessage } from './components/landing/LeadershipMessage';
import { DepartmentsSection } from './components/landing/DepartmentsSection';
import { InnovationBanner } from './components/landing/InnovationBanner';
import { HospitalCareSection } from './components/landing/HospitalCareSection';
import { NewsEventsSection } from './components/landing/NewsEventsSection';
import { ResearchAwardsSection } from './components/landing/ResearchAwardsSection';
import { HospitalFooter } from './components/landing/HospitalFooter';
import { PortalRolesDrawer } from './components/landing/PortalRolesDrawer';
import { LoginModal } from './components/LoginModal';
import { SuperadminDashboard } from './components/superadmin/SuperadminDashboard';
import { ShieldCheck, Users } from 'lucide-react';

export function App() {
  const [viewMode, setViewMode] = useState<'public' | 'superadmin'>('public');
  const [portalsDrawerOpen, setPortalsDrawerOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState<RoleCard | null>(null);

  const handleSelectRole = (card: RoleCard) => {
    if (card.id === 'superadmin') {
      setViewMode('superadmin');
    } else {
      setSelectedRole(card);
    }
  };

  // If in Superadmin view mode, render the full Smart Hospital Superadmin workspace
  if (viewMode === 'superadmin') {
    return <SuperadminDashboard onExitSuperadmin={() => setViewMode('public')} />;
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-['Plus_Jakarta_Sans',sans-serif]">
      {/* 1. Main Institutional Navbar (Divided cyan top bar + white main bar, matching screenshot) */}
      <HeaderNavbar
        onOpenPortals={() => setPortalsDrawerOpen(true)}
        onOpenSuperadmin={() => setViewMode('superadmin')}
      />

      {/* Floating Yellow Side Tabs Pinned to Right Edge (Matching media_1795095936212_ad87e1f9.jpg) */}
      <FloatingSideTabs
        onOpenAppointment={() => setPortalsDrawerOpen(true)}
      />

      {/* 2. Hero Banner with Ranking & Campus Network Photo */}
      <HeroBanner onOpenPortals={() => setPortalsDrawerOpen(true)} />

      {/* 3. Stats Ribbon (4 Circular badges on blue/teal bar) */}
      <StatsRibbon />

      {/* 4. Message from Medical Director / Board of Trustees */}
      <LeadershipMessage />

      {/* 5. Clinical Departments & Centers of Excellence */}
      <DepartmentsSection />

      {/* 6. Innovation & High-Tech Robotic Surgery Banner */}
      <InnovationBanner />

      {/* 7. Hospital Life & Patient Facilities */}
      <HospitalCareSection />

      {/* 8. News, CME & Medical Events */}
      <NewsEventsSection />

      {/* 9. Medical Research, Publications & Faculty Awards */}
      <ResearchAwardsSection />

      {/* 10. Institutional Deep Green Footer */}
      <HospitalFooter
        onOpenPortals={() => setPortalsDrawerOpen(true)}
        onOpenSuperadmin={() => setViewMode('superadmin')}
      />

      {/* Floating Quick Action Launcher for Instant 1-Click Access to Superadmin & 12 Roles */}
      <div className="fixed bottom-6 right-6 z-40 flex items-center gap-2.5 bg-slate-900/90 backdrop-blur-md text-white p-1.5 pl-3 rounded-full shadow-2xl border border-white/20">
        <span className="text-xs font-bold text-slate-300 hidden sm:inline">Portals:</span>
        <button
          onClick={() => setPortalsDrawerOpen(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-teal-600 hover:bg-teal-500 text-white rounded-full text-xs font-bold transition-all shadow-xs cursor-pointer"
        >
          <Users className="w-3.5 h-3.5" />
          <span>12 Roles</span>
        </button>
        <button
          onClick={() => setViewMode('superadmin')}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-full text-xs font-bold transition-all shadow-xs cursor-pointer"
        >
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Superadmin</span>
        </button>
      </div>

      {/* Interactive 12-Role Portals Drawer */}
      <PortalRolesDrawer
        isOpen={portalsDrawerOpen}
        onClose={() => setPortalsDrawerOpen(false)}
        onSelectRole={handleSelectRole}
      />

      {/* Role Login Modal with Demo Credentials */}
      <LoginModal
        card={selectedRole}
        onClose={() => setSelectedRole(null)}
      />
    </div>
  );
}

export default App;
