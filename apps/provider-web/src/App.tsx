import { useEffect, useState } from 'react';
import { ROLES_DATA, RoleCard } from './data/rolesData';
import { AppointmentBookingContext } from './data/appointmentData';
import {
  AuthSession,
  clearAuthSession,
  getAuthSession,
  saveAuthSession,
} from './utils/auth';
import { HeaderNavbar } from './components/landing/HeaderNavbar';
import { FloatingSideTabs } from './components/landing/FloatingSideTabs';
import { HeroBanner } from './components/landing/HeroBanner';
import { StatsRibbon } from './components/landing/StatsRibbon';
import { QuickServiceHub } from './components/landing/QuickServiceHub';
import { LeadershipMessage } from './components/landing/LeadershipMessage';
import { DepartmentsSection } from './components/landing/DepartmentsSection';
import { InnovationBanner } from './components/landing/InnovationBanner';
import { HospitalCareSection } from './components/landing/HospitalCareSection';
import { HealthPackagesSection } from './components/landing/HealthPackagesSection';
import { NewsEventsSection } from './components/landing/NewsEventsSection';
import { ResearchAwardsSection } from './components/landing/ResearchAwardsSection';
import { AppointmentSection } from './components/landing/AppointmentSection';
import { AppointmentPage } from './components/landing/AppointmentPage';
import { LoginPage } from './components/landing/LoginPage';
import { HospitalFooter } from './components/landing/HospitalFooter';
import { SuperadminDashboard } from './components/superadmin/SuperadminDashboard';
import { DoctorDashboard } from './components/doctor/DoctorDashboard';
import { PatientDashboard } from './components/patient/PatientDashboard';
import { PharmacistDashboard } from './components/pharmacist/PharmacistDashboard';
import { RoleDashboard } from './components/dashboard/RoleDashboard';
import { LogOut, ShieldCheck, Users } from 'lucide-react';

type ViewMode = 'public' | 'appointment' | 'login' | 'dashboard' | 'superadmin';

interface RouteState {
  viewMode: ViewMode;
  activeRole: RoleCard | null;
  authNotice?: string;
  targetRoleId?: string;
  subModule?: string;
}

const PORTAL_ROLE_IDS = new Set(
  ROLES_DATA.filter(
    (r) => r.id !== 'front_website' && r.id !== 'mobile_app'
  ).map((r) => r.id)
);

const resolveRouteState = (pathname: string): RouteState => {
  if (pathname === '/appointment') {
    return { viewMode: 'appointment', activeRole: null };
  }
  if (pathname === '/login') {
    return { viewMode: 'login', activeRole: null };
  }
  if (pathname === '/superadmin' || pathname === '/dashboard/superadmin') {
    const session = getAuthSession();
    if (!session || session.role.id !== 'superadmin') {
      return {
        viewMode: 'login',
        activeRole: null,
        authNotice:
          'Superadmin credentials required to access the executive command center.',
        targetRoleId: 'superadmin',
      };
    }
    return { viewMode: 'superadmin', activeRole: session.role };
  }
  if (pathname.startsWith('/dashboard/')) {
    const raw = pathname.slice('/dashboard/'.length);
    const slashIdx = raw.indexOf('/');
    const roleId = slashIdx === -1 ? raw : raw.slice(0, slashIdx);
    const subModule = slashIdx === -1 ? undefined : raw.slice(slashIdx + 1);

    if (PORTAL_ROLE_IDS.has(roleId)) {
      const session = getAuthSession();
      if (!session) {
        return {
          viewMode: 'login',
          activeRole: null,
          authNotice: `Authentication required. Please sign in to access the ${roleId} portal.`,
          targetRoleId: roleId,
        };
      }
      const matched = ROLES_DATA.find((r) => r.id === roleId) ?? session.role;
      if (session.role.id === 'superadmin' || session.role.id === roleId) {
        return {
          viewMode: roleId === 'superadmin' ? 'superadmin' : 'dashboard',
          activeRole: matched,
          subModule,
        };
      }
      return {
        viewMode: 'dashboard',
        activeRole: session.role,
        subModule,
      };
    }
    return { viewMode: 'login', activeRole: null };
  }
  return { viewMode: 'public', activeRole: null };
};

export function App() {
  const initialRoute = resolveRouteState(window.location.pathname);

  const [viewMode, setViewMode] = useState<ViewMode>(initialRoute.viewMode);
  const [activeRole, setActiveRole] = useState<RoleCard | null>(
    initialRoute.activeRole
  );
  const [authNotice, setAuthNotice] = useState<string | undefined>(
    initialRoute.authNotice
  );
  const [targetRoleId, setTargetRoleId] = useState<string | undefined>(
    initialRoute.targetRoleId
  );
  const [subModule, setSubModule] = useState<string | undefined>(
    initialRoute.subModule
  );
  const [currentSession, setCurrentSession] = useState<AuthSession | null>(() =>
    getAuthSession()
  );
  const [appointmentContext, setAppointmentContext] =
    useState<AppointmentBookingContext>({});

  useEffect(() => {
    if (initialRoute.authNotice && window.location.pathname !== '/login') {
      window.history.replaceState(null, '', '/login');
    }
  }, []);

  useEffect(() => {
    const handlePopState = () => {
      const next = resolveRouteState(window.location.pathname);
      setViewMode(next.viewMode);
      setActiveRole(next.activeRole);
      setAuthNotice(next.authNotice);
      setTargetRoleId(next.targetRoleId);
      setSubModule(next.subModule);
      setCurrentSession(getAuthSession());
      if (next.authNotice && window.location.pathname !== '/login') {
        window.history.replaceState(null, '', '/login');
      }
    };
    const handleHashChange = () => {
      if (
        window.location.hash &&
        (window.location.pathname === '/appointment' ||
          window.location.pathname === '/login')
      ) {
        const hash = window.location.hash;
        window.history.replaceState(null, '', `/${hash}`);
        setViewMode('public');
        setActiveRole(null);
        setAuthNotice(undefined);
        setTargetRoleId(undefined);
      }
    };
    window.addEventListener('popstate', handlePopState);
    window.addEventListener('hashchange', handleHashChange);
    return () => {
      window.removeEventListener('popstate', handlePopState);
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, []);

  useEffect(() => {
    if (viewMode === 'public' && window.location.hash) {
      const target = document.getElementById(window.location.hash.slice(1));
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  }, [viewMode]);

  const navigatePath = (path: string) => {
    if (window.location.pathname !== path) {
      window.history.pushState(null, '', path);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const openAppointment = (context: AppointmentBookingContext = {}) => {
    setAppointmentContext(context);
    setViewMode('appointment');
    navigatePath('/appointment');
  };

  const openLogin = (roleId?: string, notice?: string) => {
    setAuthNotice(notice);
    setTargetRoleId(roleId);
    setViewMode('login');
    navigatePath('/login');
  };

  const handleLoginSuccess = (card: RoleCard, token?: string) => {
    const session = saveAuthSession(card, card.email, token);
    setCurrentSession(session);
    setActiveRole(card);
    setAuthNotice(undefined);
    setTargetRoleId(undefined);
    if (card.id === 'superadmin') {
      setViewMode('superadmin');
      navigatePath('/dashboard/superadmin');
    } else {
      setViewMode('dashboard');
      navigatePath(`/dashboard/${card.id}`);
    }
  };

  const handleLogout = () => {
    clearAuthSession();
    setCurrentSession(null);
    setActiveRole(null);
    setAuthNotice(undefined);
    setTargetRoleId(undefined);
    setViewMode('login');
    navigatePath('/login');
  };

  const openRoleDashboard = (card: RoleCard) => {
    if (card.id === 'front_website') {
      goHome();
      return;
    }
    const session = getAuthSession();
    if (
      !session ||
      (session.role.id !== card.id && session.role.id !== 'superadmin')
    ) {
      openLogin(
        card.id,
        `Please sign in to access the ${card.title} portal.`
      );
      return;
    }
    setActiveRole(card);
    setAuthNotice(undefined);
    setTargetRoleId(undefined);
    if (card.id === 'superadmin') {
      setViewMode('superadmin');
      navigatePath('/dashboard/superadmin');
    } else {
      setViewMode('dashboard');
      navigatePath(`/dashboard/${card.id}`);
    }
  };

  const openSuperadminDirect = () => {
    const session = getAuthSession();
    if (session && session.role.id === 'superadmin') {
      setActiveRole(session.role);
      setViewMode('superadmin');
      navigatePath('/dashboard/superadmin');
    } else {
      openLogin(
        'superadmin',
        'Superadmin credentials required to access the executive command center.'
      );
    }
  };

  const goHome = () => {
    setViewMode('public');
    setAuthNotice(undefined);
    setTargetRoleId(undefined);
    navigatePath('/');
  };

  if (viewMode === 'login') {
    return (
      <LoginPage
        onBack={goHome}
        onLoginSuccess={handleLoginSuccess}
        authNotice={authNotice}
        initialRoleId={targetRoleId}
      />
    );
  }

  if (viewMode === 'superadmin') {
    return (
      <SuperadminDashboard
        onExitSuperadmin={goHome}
        onSwitchRole={handleLogout}
      />
    );
  }

  if (viewMode === 'dashboard' && activeRole) {
    if (activeRole.id === 'doctor') {
      return (
        <DoctorDashboard
          role={activeRole}
          initialModule={subModule}
          onSwitchRole={handleLogout}
          onGoHome={goHome}
        />
      );
    }
    if (activeRole.id === 'pharmacist') {
      return (
        <PharmacistDashboard
          role={activeRole}
          initialModule={subModule}
          onSwitchRole={handleLogout}
          onGoHome={goHome}
        />
      );
    }
    if (activeRole.id === 'patient') {
      return (
        <PatientDashboard
          role={activeRole}
          onSwitchRole={handleLogout}
          onGoHome={goHome}
        />
      );
    }
    return (
      <RoleDashboard
        role={activeRole}
        onSwitchRole={handleLogout}
        onGoHome={goHome}
      />
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-['Plus_Jakarta_Sans',sans-serif]">
      {/* 1. Main Institutional Navbar */}
      <HeaderNavbar
        onOpenPortals={() => openLogin()}
        onOpenAppointment={() => openAppointment({ visitType: 'opd' })}
        onOpenSuperadmin={openSuperadminDirect}
        onGoHome={viewMode !== 'public' ? goHome : undefined}
      />

      {viewMode === 'appointment' ? (
        <AppointmentPage initialContext={appointmentContext} onBack={goHome} />
      ) : (
        <>
          {/* Floating Side Tabs Pinned to Right Edge */}
          <FloatingSideTabs
            onOpenAppointment={() => openAppointment({ visitType: 'opd' })}
          />

          {/* 2. Hero Banner Carousel */}
          <HeroBanner
            onOpenPortals={() => openLogin()}
            onOpenAppointment={() => openAppointment({ visitType: 'opd' })}
          />

          {/* 3. Quick Doctor Finder, Booking & Test Prices Section */}
          <QuickServiceHub onOpenAppointment={openAppointment} />

          {/* 4. Message from Medical Director / Board of Trustees */}
          <LeadershipMessage />

          {/* 5. Clinical Departments & Centers of Excellence */}
          <DepartmentsSection
            onSelectDepartment={(department) =>
              openAppointment({ visitType: 'opd', department })
            }
          />

          {/* 6. Innovation & High-Tech Robotic Surgery Banner */}
          <InnovationBanner />

          {/* 7. Hospital Life & Patient Facilities */}
          <HospitalCareSection />

          {/* 8. Institutional Key Scale Stats Ribbon */}
          <StatsRibbon />

          {/* 9. Health Checkup & Diagnostic Packages */}
          <HealthPackagesSection
            onBookPackage={(packageName) =>
              openAppointment({ visitType: 'diagnostic', packageName })
            }
          />

          {/* 10. News, CME & Medical Events */}
          <NewsEventsSection />

          {/* 11. Medical Research & Publications */}
          <ResearchAwardsSection />

          {/* 12. Compact Appointment CTA Banner */}
          <AppointmentSection
            onOpenAppointment={() => openAppointment({ visitType: 'opd' })}
          />
        </>
      )}

      {/* 13. Institutional Deep Green Footer */}
      <HospitalFooter
        onOpenPortals={() => openLogin()}
        onOpenAppointment={() => openAppointment({ visitType: 'opd' })}
        onOpenSuperadmin={openSuperadminDirect}
      />

      {/* Floating Quick Action Launcher */}
      <div className="fixed bottom-6 right-6 z-40 flex items-center gap-2.5 bg-slate-900/90 backdrop-blur-md text-white p-1.5 pl-3 rounded-full shadow-2xl border border-white/20">
        {currentSession ? (
          <>
            <div className="flex items-center gap-1.5 text-xs text-slate-300 pr-1">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="font-semibold text-white">
                {currentSession.role.title}
              </span>
            </div>
            <button
              onClick={() => openRoleDashboard(currentSession.role)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-full text-xs font-bold transition-all shadow-xs cursor-pointer"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Go to Dashboard</span>
            </button>
            <button
              onClick={handleLogout}
              title="Sign Out"
              className="flex items-center gap-1 px-2.5 py-1.5 bg-slate-800 hover:bg-rose-700 text-slate-300 hover:text-white rounded-full text-xs font-bold transition-all shadow-xs cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </>
        ) : (
          <>
            <span className="text-xs font-bold text-slate-300 hidden sm:inline">
              Portals:
            </span>
            <button
              onClick={() => openLogin()}
              className="flex items-center gap-1.5 px-3.5 py-1.5 bg-teal-600 hover:bg-teal-500 text-white rounded-full text-xs font-bold transition-all shadow-xs cursor-pointer"
            >
              <Users className="w-3.5 h-3.5" />
              <span>Portal Sign In</span>
            </button>
            <button
              onClick={openSuperadminDirect}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-full text-xs font-bold transition-all shadow-xs cursor-pointer"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Superadmin</span>
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default App;
