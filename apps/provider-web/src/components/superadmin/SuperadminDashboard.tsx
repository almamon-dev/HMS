import React, { useState } from 'react';
import {
  Activity,
  Bed,
  Stethoscope,
  Pill,
  TrendingUp,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';
import { SuperadminSidebar } from './SuperadminSidebar';
import { SuperadminTopbar } from './SuperadminTopbar';

interface SuperadminDashboardProps {
  onExitSuperadmin: () => void;
}

export const SuperadminDashboard: React.FC<SuperadminDashboardProps> = ({
  onExitSuperadmin,
}) => {
  const [currentModule, setCurrentModule] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // High-level KPI widgets matching Smart Hospital Dashboard
  const kpis = [
    {
      title: 'OPD Income',
      amount: '৳ 1,48,500',
      change: '+14% from yesterday',
      icon: Stethoscope,
      bg: 'from-cyan-500/10 to-teal-500/10 text-teal-700 border-teal-200/60',
    },
    {
      title: 'IPD Inpatient',
      amount: '84 / 120 Beds',
      change: '70% Bed Occupancy',
      icon: Bed,
      bg: 'from-blue-500/10 to-cyan-500/10 text-blue-700 border-blue-200/60',
    },
    {
      title: 'Pharmacy Sales',
      amount: '৳ 92,400',
      change: '142 prescriptions filled',
      icon: Pill,
      bg: 'from-amber-500/10 to-orange-500/10 text-amber-700 border-amber-200/60',
    },
    {
      title: 'Pathology & Radiology',
      amount: '৳ 64,800',
      change: '68 reports ready',
      icon: Activity,
      bg: 'from-emerald-500/10 to-teal-500/10 text-emerald-700 border-emerald-200/60',
    },
  ];

  const recentPatients = [
    {
      id: 'OPD-1082',
      name: 'Rahim Ullah',
      phone: '+880 1711-234567',
      department: 'Cardiology',
      doctor: 'Dr. Nurul Hasan',
      status: 'In Consultation',
      statusColor: 'bg-teal-50 text-teal-700 border-teal-200',
      time: '10:15 AM',
    },
    {
      id: 'IPD-4091',
      name: 'Fatema Begum',
      phone: '+880 1819-876543',
      department: 'General Surgery',
      doctor: 'Dr. Farhana Khan',
      status: 'Admitted (Bed #304)',
      statusColor: 'bg-cyan-50 text-cyan-700 border-cyan-200',
      time: '09:40 AM',
    },
    {
      id: 'OPD-1083',
      name: 'Ashraf Ali',
      phone: '+880 1912-345678',
      department: 'Orthopedics',
      doctor: 'Dr. Tariq Mahmud',
      status: 'Prescription Ready',
      statusColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      time: '10:30 AM',
    },
    {
      id: 'LAB-8902',
      name: 'Salma Akter',
      phone: '+880 1610-987654',
      department: 'Pathology Lab',
      doctor: 'Dr. Sonia Akhtar',
      status: 'Sample Processing',
      statusColor: 'bg-amber-50 text-amber-700 border-amber-200',
      time: '11:05 AM',
    },
  ];

  return (
    <div className="min-h-screen bg-slate-100/90 flex font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Superadmin Sidebar with Smart Hospital Structure */}
      <SuperadminSidebar
        currentModule={currentModule}
        onSelectModule={(mod) => setCurrentModule(mod)}
        isOpen={sidebarOpen}
        onCloseMobile={() => setSidebarOpen(false)}
        onExitSuperadmin={onExitSuperadmin}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col lg:pl-72 transition-all">
        {/* Topbar */}
        <SuperadminTopbar
          currentModule={currentModule}
          onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
          onExitSuperadmin={onExitSuperadmin}
        />

        {/* Dashboard Body */}
        <main className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl w-full mx-auto">
          {/* Header Banner */}
          <div className="bg-gradient-to-r from-slate-900 via-teal-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-md relative overflow-hidden border border-slate-800">
            <div className="relative z-10 max-w-2xl">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-500/20 border border-teal-400/30 text-teal-300 text-xs font-semibold mb-3">
                <ShieldCheck className="w-3.5 h-3.5" />
                Super Admin Master Control
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                Hospital Command Center
              </h2>
              <p className="text-slate-300 text-xs sm:text-sm mt-2 leading-relaxed">
                Full administrative visibility over OPD, IPD, Diagnostics, Pharmacy, Staff Attendance, and Multi-Branch Operations.
              </p>
            </div>
            <div className="absolute -right-8 -bottom-8 w-60 h-60 bg-teal-500/10 rounded-full blur-2xl pointer-events-none" />
          </div>

          {/* KPI Statistics */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {kpis.map((kpi) => {
              const Icon = kpi.icon;
              return (
                <div
                  key={kpi.title}
                  className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-semibold text-slate-500">
                      {kpi.title}
                    </span>
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center border bg-gradient-to-br ${kpi.bg}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="text-xl sm:text-2xl font-extrabold text-slate-900">
                    {kpi.amount}
                  </div>
                  <div className="text-[11px] font-medium text-slate-500 mt-1 flex items-center gap-1">
                    <TrendingUp className="w-3 h-3 text-teal-600 inline" />
                    {kpi.change}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Operational Quick Summary Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Live Today's Consultations */}
            <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs">
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
                <div>
                  <h3 className="font-bold text-slate-900 text-sm sm:text-base">
                    Today's OPD / IPD Clinical Activity
                  </h3>
                  <p className="text-slate-500 text-xs">
                    Live patient queue and doctor chamber workflow
                  </p>
                </div>
                <span className="text-xs font-semibold text-teal-700 bg-teal-50 border border-teal-200 px-2.5 py-1 rounded-lg">
                  Real-time
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-slate-100 text-slate-400 font-semibold uppercase text-[10px] tracking-wider">
                      <th className="pb-2.5">Patient / ID</th>
                      <th className="pb-2.5">Department</th>
                      <th className="pb-2.5">Doctor</th>
                      <th className="pb-2.5">Status</th>
                      <th className="pb-2.5 text-right">Time</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {recentPatients.map((p) => (
                      <tr key={p.id} className="hover:bg-slate-50/70 transition-colors">
                        <td className="py-3">
                          <div className="font-bold text-slate-800">{p.name}</div>
                          <div className="text-[11px] text-slate-400">{p.id} • {p.phone}</div>
                        </td>
                        <td className="py-3 text-slate-600 font-medium">{p.department}</td>
                        <td className="py-3 text-slate-700 font-semibold">{p.doctor}</td>
                        <td className="py-3">
                          <span className={`px-2 py-0.5 rounded-md text-[10px] font-semibold border ${p.statusColor}`}>
                            {p.status}
                          </span>
                        </td>
                        <td className="py-3 text-right font-medium text-slate-400">{p.time}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Quick System Status & Department Capacity */}
            <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs space-y-5">
              <div>
                <h3 className="font-bold text-slate-900 text-sm sm:text-base">
                  Hospital Quick Metrics
                </h3>
                <p className="text-slate-500 text-xs">Real-time capacity stats</p>
              </div>

              <div className="space-y-3.5 text-xs">
                <div>
                  <div className="flex justify-between font-semibold mb-1">
                    <span className="text-slate-600">IPD Bed Occupancy</span>
                    <span className="text-slate-900 font-bold">70% (84/120)</span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-teal-500 rounded-full" style={{ width: '70%' }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between font-semibold mb-1">
                    <span className="text-slate-600">Blood Bank Inventory</span>
                    <span className="text-slate-900 font-bold">142 Units</span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-rose-500 rounded-full" style={{ width: '85%' }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between font-semibold mb-1">
                    <span className="text-slate-600">Ambulance Readiness</span>
                    <span className="text-slate-900 font-bold">6/8 Available</span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-cyan-500 rounded-full" style={{ width: '75%' }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between font-semibold mb-1">
                    <span className="text-slate-600">Daily Pharmacy Stock Turnover</span>
                    <span className="text-slate-900 font-bold">94%</span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500 rounded-full" style={{ width: '94%' }} />
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100">
                <div className="bg-slate-50 rounded-xl p-3 border border-slate-200/70 text-xs text-slate-600 flex items-center justify-between">
                  <span className="font-semibold text-slate-700">Multi-Branch Sync:</span>
                  <span className="text-emerald-600 font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    All 3 Branches Active
                  </span>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};
