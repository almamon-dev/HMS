import {
  ArrowLeftRight,
  Globe,
  LogOut,
  Menu,
  Search,
  ShieldCheck,
  X,
} from 'lucide-react';
import React, { useMemo, useState } from 'react';
import { ROLE_WORKSPACES } from '../../data/roleDashboardsData';
import { RoleCard } from '../../data/rolesData';
import { RoleIcon } from '../RoleIcon';

interface RoleDashboardProps {
  role: RoleCard;
  onSwitchRole: () => void;
  onGoHome: () => void;
}

/**
 * Role-scoped operational dashboard rendered for authenticated non-superadmin
 * hospital roles (Admin, Doctor, Nurse, Pharmacist, Lab, Accounts, Reception, Patient).
 */
export const RoleDashboard: React.FC<RoleDashboardProps> = ({
  role,
  onSwitchRole,
  onGoHome,
}) => {
  const workspace = ROLE_WORKSPACES[role.id] ?? ROLE_WORKSPACES.admin;

  const [activeNav, setActiveNav] = useState<string>(
    workspace.navItems[0]?.id ?? 'overview'
  );
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
  const [query, setQuery] = useState<string>('');

  const activeNavLabel =
    workspace.navItems.find((n) => n.id === activeNav)?.label ??
    workspace.navItems[0]?.label ??
    'Workspace';

  const filteredRows = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return workspace.rows;
    return workspace.rows.filter(
      (row) =>
        row.code.toLowerCase().includes(q) ||
        row.subject.toLowerCase().includes(q) ||
        row.meta.toLowerCase().includes(q) ||
        row.status.toLowerCase().includes(q)
    );
  }, [workspace.rows, query]);

  return (
    <div className="min-h-screen bg-[#F1F3F6] flex font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Mobile Sidebar Backdrop */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 bg-slate-950/50 z-40 lg:hidden"
        />
      )}

      {/* Role Sidebar */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-[#003b2a] text-white flex flex-col transition-transform duration-200 shrink-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
          }`}
      >
        <div className="h-16 px-4 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-9 h-9 rounded-[3px] bg-white/15 flex items-center justify-center shrink-0">
              <RoleIcon name={role.iconName} className="w-5 h-5 text-cyan-200" />
            </div>
            <div className="min-w-0">
              <div className="text-sm font-bold truncate">
                {role.title} Portal
              </div>
              <div className="text-[11px] text-emerald-200/80 truncate">
                {role.role}
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-1.5 text-white/80 hover:text-white cursor-pointer"
            aria-label="Close sidebar"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          <div className="px-2.5 py-1.5 text-[11px] font-medium text-emerald-200/80">
            {role.title} Modules
          </div>
          {workspace.navItems.map((item) => {
            const active = item.id === activeNav;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  setActiveNav(item.id);
                  setSidebarOpen(false);
                }}
                className={`w-full text-left px-3 py-2.5 rounded-[3px] text-xs font-semibold transition-colors cursor-pointer ${active
                    ? 'bg-[#0094b6] text-white'
                    : 'text-emerald-50/85 hover:bg-white/10 hover:text-white'
                  }`}
              >
                {item.label}
              </button>
            );
          })}
        </nav>

        <div className="p-3 border-t border-white/10 space-y-2">
          <button
            type="button"
            onClick={onSwitchRole}
            className="w-full px-3 py-2 rounded-[3px] bg-white/10 hover:bg-white/20 text-xs font-semibold flex items-center gap-2 transition-colors cursor-pointer"
          >
            <ArrowLeftRight className="w-3.5 h-3.5 text-cyan-200" />
            <span>Switch Role (Login)</span>
          </button>

          <button
            type="button"
            onClick={onGoHome}
            className="w-full px-3 py-2 rounded-[3px] border border-white/15 hover:bg-white/10 text-xs font-semibold flex items-center gap-2 transition-colors cursor-pointer"
          >
            <Globe className="w-3.5 h-3.5 text-emerald-200" />
            <span>Visit Public Site</span>
          </button>
        </div>
      </aside>

      {/* Main Workspace */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 bg-white border-b border-slate-200 px-4 sm:px-6 flex items-center justify-between gap-4 sticky top-0 z-30">
          <div className="flex items-center gap-3 min-w-0">
            <button
              type="button"
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-[3px] border border-slate-200 text-slate-700 hover:bg-slate-50 cursor-pointer"
              aria-label="Open menu"
            >
              <Menu className="w-4 h-4" />
            </button>
            <div className="min-w-0">
              <h1 className="text-sm sm:text-base font-bold text-slate-900 truncate">
                {activeNavLabel}
              </h1>
              <p className="text-[11px] text-slate-500 truncate">
                Signed in as{' '}
                <span className="font-semibold text-[#006a4e]">
                  {role.email || `${role.id}@hospital.local`}
                </span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-[3px] bg-[#edf6f2] text-[#006a4e] text-xs font-bold border border-emerald-200/80">
              <ShieldCheck className="w-3.5 h-3.5 text-[#0094b6]" />
              <span>{role.title}</span>
            </span>

            <button
              type="button"
              onClick={onSwitchRole}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[3px] border border-slate-200 hover:border-[#0094b6] text-xs font-semibold text-slate-700 hover:text-[#006a4e] transition-colors cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        </header>

        <main className="flex-1 p-4 sm:p-6 space-y-6 max-w-[1400px] w-full mx-auto">
          {/* 4 Role KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
            {workspace.kpis.map((kpi) => (
              <div
                key={kpi.label}
                className="bg-white rounded-[3px] shadow-xs p-4 space-y-1"
              >
                <div className="text-xs font-semibold text-slate-500">
                  {kpi.label}
                </div>
                <div className="text-xl font-extrabold text-slate-900">
                  {kpi.value}
                </div>
                <div className="text-[11px] font-medium text-[#006a4e]">
                  {kpi.note}
                </div>
              </div>
            ))}
          </div>

          {/* Searchable Role Worklist */}
          <section className="bg-white rounded-[3px] border border-slate-200 overflow-hidden">
            <div className="px-4 sm:px-5 py-3.5 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-sm font-bold text-slate-900">
                  {workspace.tableTitle}
                </h2>
                <p className="text-[11px] text-slate-500">
                  Active section: {activeNavLabel}
                </p>
              </div>

              <div className="relative sm:w-72">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Filter records..."
                  className="w-full h-9 bg-slate-50 border border-slate-200 rounded-[3px] pl-8 pr-3 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-hidden focus:bg-white focus:border-[#0094b6]"
                />
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-600">
                    {workspace.columns.map((col, idx) => (
                      <th
                        key={col}
                        className={`px-4 py-2.5 font-bold ${idx === workspace.columns.length - 1
                            ? 'text-right'
                            : ''
                          }`}
                      >
                        {col}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredRows.length > 0 ? (
                    filteredRows.map((row) => (
                      <tr key={row.code} className="hover:bg-slate-50/70">
                        <td className="px-4 py-3 font-bold text-[#006a4e] whitespace-nowrap">
                          {row.code}
                        </td>
                        <td className="px-4 py-3 font-semibold text-slate-900">
                          {row.subject}
                        </td>
                        <td className="px-4 py-3 text-slate-600">{row.meta}</td>
                        <td className="px-4 py-3 text-slate-500 whitespace-nowrap">
                          {row.time}
                        </td>
                        <td className="px-4 py-3 text-right whitespace-nowrap">
                          <span className="inline-block px-2.5 py-0.5 rounded-[3px] bg-[#edf6f2] text-[#006a4e] font-bold text-[11px]">
                            {row.status}
                          </span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={5}
                        className="px-4 py-8 text-center text-slate-500"
                      >
                        No records matched &quot;{query}&quot;.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
};

export default RoleDashboard;
