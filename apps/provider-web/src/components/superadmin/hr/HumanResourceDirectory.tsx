import {
  Activity,
  Check,
  Edit,
  Eye,
  GitBranch,
  KeyRound,
  MoreVertical,
  Plus,
  Shield,
  ShieldCheck,
  UserCheck,
  UserPlus,
  Users,
  UserX,
  X,
} from 'lucide-react';
import React, { useEffect, useMemo, useState } from 'react';
import {
  ALL_PHARMACY_PERMISSIONS,
  INITIAL_PHARMACY_AUDIT_LOGS,
  INITIAL_PHARMACY_STAFF,
  PHARMACY_BRANCHES,
  PHARMACY_PERMISSION_MODULES,
  PREDEFINED_PHARMACY_ROLES,
  PharmacyAuditLog,
  PharmacyRole,
  PharmacyStaffMember,
  computeStaffPermissions,
} from '../../../data/pharmacyRbacData';
import { DataTable, DataTableColumn } from '../../common/DataTable';
import { DropdownSelect } from '../../common/DropdownSelect';

export type HRTab = 'staff-directory' | 'role-matrix' | 'branch-allocations' | 'audit-logs';

export interface HumanResourceDirectoryProps {
  initialTab?: HRTab;
  onTabChange?: (tab: HRTab) => void;
}

export const HumanResourceDirectory: React.FC<HumanResourceDirectoryProps> = ({
  initialTab = 'staff-directory',
  onTabChange,
}) => {
  const [activeTab, setActiveTab] = useState<HRTab>(initialTab);

  useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab);
    }
  }, [initialTab]);

  const handleTabClick = (tab: HRTab) => {
    setActiveTab(tab);
    onTabChange?.(tab);
  };
  const [staffList, setStaffList] = useState<PharmacyStaffMember[]>(INITIAL_PHARMACY_STAFF);
  const [rolesList, setRolesList] = useState<PharmacyRole[]>(PREDEFINED_PHARMACY_ROLES);
  const [auditLogs, setAuditLogs] = useState<PharmacyAuditLog[]>(INITIAL_PHARMACY_AUDIT_LOGS);

  // Filters
  const [roleFilter, setRoleFilter] = useState('All');
  const [branchFilter, setBranchFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');

  // Selected quick view & Modals
  const [selectedStaff, setSelectedStaff] = useState<PharmacyStaffMember | null>(null);
  const [editingStaff, setEditingStaff] = useState<PharmacyStaffMember | null>(null);
  const [isAddStaffModalOpen, setIsAddStaffModalOpen] = useState(false);
  const [resetPasswordStaff, setResetPasswordStaff] = useState<PharmacyStaffMember | null>(null);
  const [activeActionId, setActiveActionId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Close 3-dot action dropdown on click outside
  useEffect(() => {
    const handleOutside = () => setActiveActionId(null);
    window.addEventListener('click', handleOutside);
    return () => window.removeEventListener('click', handleOutside);
  }, []);

  // Role Management State
  const [selectedRoleSlug, setSelectedRoleSlug] = useState<string>('pharmacy_admin');
  const [isCreateRoleModalOpen, setIsCreateRoleModalOpen] = useState(false);
  const [newRoleName, setNewRoleName] = useState('');
  const [newRoleDesc, setNewRoleDesc] = useState('');

  // Password reset state
  const [newPassword, setNewPassword] = useState('Hospital@2026');

  // Trigger Toast
  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // KPI Summary Statistics
  const stats = useMemo(() => {
    const totalStaff = staffList.length;
    const activeStaff = staffList.filter((s) => s.status === 'active').length;
    const totalRoles = rolesList.length;
    const totalBranches = PHARMACY_BRANCHES.length;
    const auditCount = auditLogs.length;
    return { totalStaff, activeStaff, totalRoles, totalBranches, auditCount };
  }, [staffList, rolesList, auditLogs]);

  // Filtered Staff (Live search handled by DataTable)
  const filteredStaff = useMemo(() => {
    return staffList.filter((s) => {
      if (roleFilter !== 'All' && s.roleSlug !== roleFilter) return false;
      if (branchFilter !== 'All' && !s.branchIds.includes(branchFilter)) return false;
      if (statusFilter !== 'All' && s.status !== statusFilter.toLowerCase()) return false;
      return true;
    });
  }, [staffList, roleFilter, branchFilter, statusFilter]);

  // Active Role in Role Matrix Tab
  const activeRole = useMemo(() => {
    return rolesList.find((r) => r.slug === selectedRoleSlug) || rolesList[0];
  }, [rolesList, selectedRoleSlug]);

  // Handle Toggle Permission in Matrix for Active Role
  const handleTogglePermission = (permName: string) => {
    setRolesList((prev) =>
      prev.map((r) => {
        if (r.slug !== selectedRoleSlug) return r;
        const exists = r.permissions.includes(permName);
        const updated = exists
          ? r.permissions.filter((p) => p !== permName)
          : [...r.permissions, permName];
        return { ...r, permissions: updated };
      })
    );
  };

  // Handle Select All / Deselect All for a Module
  const handleToggleModulePermissions = (modulePermNames: string[], selectAll: boolean) => {
    setRolesList((prev) =>
      prev.map((r) => {
        if (r.slug !== selectedRoleSlug) return r;
        let perms = [...r.permissions];
        if (selectAll) {
          modulePermNames.forEach((pn) => {
            if (!perms.includes(pn)) perms.push(pn);
          });
        } else {
          perms = perms.filter((pn) => !modulePermNames.includes(pn));
        }
        return { ...r, permissions: perms };
      })
    );
  };

  // Toggle Staff Status (Active / Inactive)
  const handleToggleStaffStatus = (staffId: string) => {
    setStaffList((prev) =>
      prev.map((s) => {
        if (s.id !== staffId) return s;
        const nextStatus = s.status === 'active' ? 'inactive' : 'active';
        triggerToast(`Staff account [${s.fullName}] is now ${nextStatus.toUpperCase()}.`);

        // Record Audit Log
        const newLog: PharmacyAuditLog = {
          id: `aud-${Date.now()}`,
          action: nextStatus === 'active' ? 'staff.activate' : 'staff.deactivate',
          module: 'Staff Management',
          staffName: s.fullName,
          employeeId: s.employeeId,
          branchName: s.primaryBranchName,
          details: { status: nextStatus, updatedBy: 'Superadmin Lead' },
          ipAddress: '192.168.1.1',
          timestamp: 'Just now',
        };
        setAuditLogs((l) => [newLog, ...l]);

        return { ...s, status: nextStatus };
      })
    );

    if (selectedStaff && selectedStaff.id === staffId) {
      setSelectedStaff((prev) =>
        prev ? { ...prev, status: prev.status === 'active' ? 'inactive' : 'active' } : null
      );
    }
  };

  // Handle Password Reset
  const handleResetPasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetPasswordStaff) return;

    triggerToast(`✓ Password for [${resetPasswordStaff.fullName}] reset securely.`);
    const newLog: PharmacyAuditLog = {
      id: `aud-${Date.now()}`,
      action: 'staff.password_reset',
      module: 'Security & Access',
      staffName: resetPasswordStaff.fullName,
      employeeId: resetPasswordStaff.employeeId,
      branchName: resetPasswordStaff.primaryBranchName,
      details: { resetBy: 'Superadmin Officer', temporary: false },
      ipAddress: '192.168.1.1',
      timestamp: 'Just now',
    };
    setAuditLogs((l) => [newLog, ...l]);
    setResetPasswordStaff(null);
  };

  // Create Custom Role Submit
  const handleCreateRoleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRoleName.trim()) return;

    const slug = newRoleName.toLowerCase().replace(/[^a-z0-9]/g, '_');
    const newRole: PharmacyRole = {
      id: `role-custom-${Date.now()}`,
      name: newRoleName.trim(),
      slug,
      description: newRoleDesc.trim() || 'Custom hospital pharmacy role with tailored privileges.',
      isSystem: false,
      permissions: ['prescriptions.view', 'inventory.view'],
    };

    setRolesList((prev) => [...prev, newRole]);
    setSelectedRoleSlug(slug);
    setIsCreateRoleModalOpen(false);
    setNewRoleName('');
    setNewRoleDesc('');
    triggerToast(`✓ Custom role [${newRole.name}] created successfully.`);
  };

  // Dropdown Options
  const roleDropdownOptions = useMemo(() => {
    return [
      { label: 'All Roles (9 Standard)', value: 'All' },
      ...rolesList.map((r) => ({ label: r.name, value: r.slug })),
    ];
  }, [rolesList]);

  const branchDropdownOptions = useMemo(() => {
    return [
      { label: 'All Pharmacy Branches (5)', value: 'All' },
      ...PHARMACY_BRANCHES.map((b) => ({ label: `${b.code} · ${b.name.split('-')[0]}`, value: b.id })),
    ];
  }, []);

  const statusDropdownOptions = [
    { label: 'All Statuses', value: 'All' },
    { label: 'Active Personnel', value: 'active' },
    { label: 'Inactive / On Leave', value: 'inactive' },
    { label: 'Suspended Account', value: 'suspended' },
  ];

  // DataTable Columns for Staff Directory
  const staffColumns: DataTableColumn<PharmacyStaffMember>[] = [
    {
      key: 'employeeId',
      header: 'Employee ID',
      sortable: true,
      sortValue: (r) => r.employeeId,
      className: 'w-28',
      render: (r) => (
        <span className="font-mono text-xs font-semibold text-[#006a4e]">
          {r.employeeId}
        </span>
      ),
    },
    {
      key: 'fullName',
      header: 'Staff Member',
      sortable: true,
      sortValue: (r) => r.fullName,
      render: (r) => (
        <div>
          <span className="font-semibold text-slate-800 text-xs block">{r.fullName}</span>
          <span className="text-[11px] text-slate-400 font-normal block">{r.email}</span>
        </div>
      ),
    },
    {
      key: 'roleName',
      header: 'Role',
      sortable: true,
      sortValue: (r) => r.roleName,
      className: 'w-40',
      render: (r) => {
        const isMgr = r.roleSlug.includes('admin') || r.roleSlug.includes('manager');
        const isAudit = r.roleSlug === 'auditor';
        return (
          <span
            className={`px-2 py-0.5 rounded-[2px] text-[10px] font-medium inline-flex items-center gap-1 whitespace-nowrap ${
              isMgr
                ? 'bg-emerald-50 text-[#006a4e] border border-emerald-200'
                : isAudit
                ? 'bg-purple-50 text-purple-700 border border-purple-200'
                : 'bg-slate-100 text-slate-700 border border-slate-200'
            }`}
          >
            <Shield className="w-3 h-3 text-[#006a4e]" />
            <span>{r.roleName}</span>
          </span>
        );
      },
    },
    {
      key: 'primaryBranchName',
      header: 'Branch',
      className: 'w-48',
      render: (r) => (
        <span className="text-xs text-slate-700 bg-slate-50 px-2 py-0.5 rounded border border-slate-200 inline-block truncate max-w-[180px]" title={r.primaryBranchName}>
          {r.primaryBranchName.replace('Central Medical Store (CMS)', 'CMS Depot').replace(' Pharmacy', '')}
        </span>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      align: 'center',
      className: 'w-24 text-center',
      sortable: true,
      sortValue: (r) => r.status,
      render: (r) => (
        <span
          className={`px-2 py-0.5 rounded-[2px] text-[10px] font-medium inline-flex items-center gap-1 whitespace-nowrap ${
            r.status === 'active'
              ? 'bg-[#edf6f2] text-[#006a4e] border border-[#006a4e]/20'
              : 'bg-slate-100 text-slate-500 border border-slate-200'
          }`}
        >
          <span
            className={`w-1.5 h-1.5 rounded-full ${
              r.status === 'active' ? 'bg-[#006a4e]' : 'bg-slate-400'
            }`}
          />
          <span className="capitalize">{r.status}</span>
        </span>
      ),
    },
    {
      key: 'actions',
      header: 'Action',
      align: 'center',
      className: 'w-14 text-center',
      render: (r, idx) => {
        const isNearBottom = (idx ?? 0) >= 5;
        return (
          <div className="relative inline-block text-left" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setActiveActionId((prev) => (prev === r.id ? null : r.id));
              }}
              className="w-6 h-6 rounded-[3px] hover:bg-slate-200/80 text-slate-500 hover:text-slate-800 flex items-center justify-center transition-colors cursor-pointer mx-auto"
              title="More actions"
              aria-label="Actions"
            >
              <MoreVertical className="w-3.5 h-3.5" />
            </button>

            {activeActionId === r.id && (
              <div
                className={`absolute right-0 ${
                  isNearBottom ? 'bottom-full mb-1' : 'top-full mt-1'
                } w-44 bg-white border border-slate-200 rounded-[3px] shadow-lg py-1 z-40 text-left divide-y divide-slate-100 font-['Plus_Jakarta_Sans',sans-serif]`}
                onClick={(e) => e.stopPropagation()}
              >
                <div className="py-0.5">
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedStaff(r);
                      setActiveActionId(null);
                    }}
                    className="w-full text-left px-2.5 py-1.5 text-[11px] text-slate-700 hover:bg-[#edf6f2] hover:text-[#006a4e] font-medium flex items-center gap-2 cursor-pointer transition-colors"
                  >
                    <Eye className="w-3.5 h-3.5 text-[#006a4e]" />
                    <span>View Details</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setEditingStaff(r);
                      setActiveActionId(null);
                    }}
                    className="w-full text-left px-2.5 py-1.5 text-[11px] text-slate-700 hover:bg-sky-50 hover:text-sky-700 font-medium flex items-center gap-2 cursor-pointer transition-colors"
                  >
                    <Edit className="w-3.5 h-3.5 text-sky-600" />
                    <span>Edit Staff</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setResetPasswordStaff(r);
                      setActiveActionId(null);
                    }}
                    className="w-full text-left px-2.5 py-1.5 text-[11px] text-slate-700 hover:bg-slate-50 font-medium flex items-center gap-2 cursor-pointer transition-colors"
                  >
                    <KeyRound className="w-3.5 h-3.5 text-slate-500" />
                    <span>Reset Password</span>
                  </button>
                </div>

                <div className="py-0.5">
                  <button
                    type="button"
                    onClick={() => {
                      handleToggleStaffStatus(r.id);
                      setActiveActionId(null);
                    }}
                    className={`w-full text-left px-2.5 py-1.5 text-[11px] font-medium flex items-center gap-2 cursor-pointer transition-colors ${
                      r.status === 'active'
                        ? 'text-rose-600 hover:bg-rose-50'
                        : 'text-emerald-700 hover:bg-emerald-50'
                    }`}
                  >
                    {r.status === 'active' ? (
                      <>
                        <UserX className="w-3.5 h-3.5 text-rose-500" />
                        <span>Deactivate Staff</span>
                      </>
                    ) : (
                      <>
                        <UserCheck className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Activate Staff</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>
        );
      },
    },
  ];

  // Audit Logs Columns for DataTable
  const auditColumns: DataTableColumn<PharmacyAuditLog>[] = [
    {
      key: 'action',
      header: 'Event / Action',
      sortable: true,
      sortValue: (r) => r.action,
      render: (r) => (
        <span className="font-mono text-[11px] font-medium text-[#006a4e] bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 inline-block">
          {r.action}
        </span>
      ),
    },
    {
      key: 'staffName',
      header: 'Personnel Involved',
      sortable: true,
      sortValue: (r) => r.staffName,
      render: (r) => (
        <div>
          <span className="font-semibold text-slate-800 text-xs block">{r.staffName}</span>
          <span className="text-[10px] text-slate-400 font-mono">{r.employeeId}</span>
        </div>
      ),
    },
    {
      key: 'module',
      header: 'Module',
      sortable: true,
      sortValue: (r) => r.module,
      render: (r) => (
        <span className="px-2 py-0.5 rounded-[2px] text-[10px] font-medium bg-sky-50 text-sky-800 border border-sky-300 inline-block">
          {r.module}
        </span>
      ),
    },
    {
      key: 'branchName',
      header: 'Depot Branch',
      render: (r) => (
        <span className="text-xs text-slate-600 bg-slate-50 px-1.5 py-0.5 rounded border border-slate-200">
          {r.branchName.replace('Central Medical Store (CMS)', 'CMS Depot').replace(' Pharmacy', '')}
        </span>
      ),
    },
    {
      key: 'details',
      header: 'Details & Changes',
      render: (r) => (
        <span className="text-xs text-slate-600 block max-w-xs truncate" title={JSON.stringify(r.details)}>
          {typeof r.details === 'object' ? Object.entries(r.details).map(([k, v]) => `${k}: ${v}`).join(' · ') : String(r.details)}
        </span>
      ),
    },
    {
      key: 'timestamp',
      header: 'Timestamp & IP',
      align: 'right',
      sortable: true,
      sortValue: (r) => r.timestamp,
      render: (r) => (
        <div className="whitespace-nowrap text-right">
          <span className="font-mono text-xs text-slate-700 block">{r.timestamp}</span>
          <span className="text-[10px] text-slate-400 font-mono">{r.ipAddress}</span>
        </div>
      ),
    },
  ];

  // Toolbar Filters inside DataTable
  const toolbarFilters = (
    <div className="flex flex-wrap items-center gap-2">
      <DropdownSelect
        native
        options={roleDropdownOptions}
        value={roleFilter}
        onChange={(v) => setRoleFilter(v)}
        width="w-44"
      />
      <DropdownSelect
        native
        options={branchDropdownOptions}
        value={branchFilter}
        onChange={(v) => setBranchFilter(v)}
        width="w-48"
      />
      <DropdownSelect
        native
        options={statusDropdownOptions}
        value={statusFilter}
        onChange={(v) => setStatusFilter(v)}
        width="w-32"
      />
    </div>
  );

  // Header Actions inside DataTable
  const headerActions = (
    <div className="flex items-center gap-1.5">
      <button
        type="button"
        onClick={() => setIsAddStaffModalOpen(true)}
        className="h-8 px-3 rounded-[3px] bg-[#006a4e] hover:bg-[#00553e] text-white text-xs font-semibold inline-flex items-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap shadow-xs"
      >
        <UserPlus className="w-3.5 h-3.5" />
        <span>Add Staff Member</span>
      </button>
    </div>
  );

  return (
    <div className="space-y-2 font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-4 right-4 z-50 bg-slate-900 text-white px-4 py-2.5 rounded-[4px] shadow-lg text-xs font-medium flex items-center gap-2 border border-slate-700 animate-in fade-in slide-in-from-top-2">
          <span>{toastMessage}</span>
          <button
            onClick={() => setToastMessage(null)}
            className="text-slate-400 hover:text-white cursor-pointer ml-2"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* 4 Superadmin Summary Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
        <div className="bg-white rounded-[3px] p-2.5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[10.5px] font-bold text-slate-700">Total Pharmacy Personnel</span>
            <Users className="w-3.5 h-3.5 text-[#006a4e]" />
          </div>
          <div className="my-1">
            <span className="text-base font-extrabold text-slate-900 leading-none">
              {stats.totalStaff} Staff
            </span>
          </div>
          <p className="text-[10px] text-slate-500">
            {stats.activeStaff} Active · {stats.totalStaff - stats.activeStaff} Inactive/Suspended
          </p>
        </div>

        <div className="bg-white rounded-[3px] p-2.5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[10.5px] font-bold text-slate-700">Configured RBAC Roles</span>
            <ShieldCheck className="w-3.5 h-3.5 text-purple-700" />
          </div>
          <div className="my-1">
            <span className="text-base font-extrabold text-purple-900 leading-none">
              {stats.totalRoles} Roles
            </span>
          </div>
          <p className="text-[10px] text-slate-500">9 Standard Predefined + Custom Matrix</p>
        </div>

        <div className="bg-white rounded-[3px] p-2.5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[10.5px] font-bold text-slate-700">Pharmacy Branches</span>
            <GitBranch className="w-3.5 h-3.5 text-sky-600" />
          </div>
          <div className="my-1">
            <span className="text-base font-extrabold text-sky-900 leading-none">
              {stats.totalBranches} Depots
            </span>
          </div>
          <p className="text-[10px] text-slate-500">Central Medical Store + 4 Satellite Hubs</p>
        </div>

        <div className="bg-white rounded-[3px] p-2.5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[10.5px] font-bold text-slate-700">Audit & Security Events</span>
            <Activity className="w-3.5 h-3.5 text-amber-600" />
          </div>
          <div className="my-1">
            <span className="text-base font-extrabold text-amber-800 leading-none">
              {stats.auditCount} Logged
            </span>
          </div>
          <p className="text-[10px] text-slate-500">100% Immutable Separation of Duties</p>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: STAFF DIRECTORY                                                    */}
      {/* ========================================================================= */}
      {activeTab === 'staff-directory' && (
        <div className="space-y-2">
          {/* Staff Profile & Full RBAC Details Modal (Keeps Table Ultra Clean) */}
          {selectedStaff && (
            <div
              className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-[1px]"
              onClick={() => setSelectedStaff(null)}
            >
              <div
                className="bg-white rounded-md shadow-2xl max-w-2xl w-full border border-slate-200 overflow-hidden font-['Plus_Jakarta_Sans',sans-serif] animate-in fade-in zoom-in-95 duration-150"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Header */}
                <div className="px-5 py-3.5 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#edf6f2] text-[#006a4e] font-bold text-sm flex items-center justify-center border border-[#006a4e]/20 shrink-0">
                      {selectedStaff.fullName
                        .split(' ')
                        .map((n) => n[0])
                        .filter(Boolean)
                        .slice(0, 2)
                        .join('')}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="text-sm font-bold text-slate-900">{selectedStaff.fullName}</h3>
                        <span className="font-mono text-[11px] font-bold px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
                          {selectedStaff.employeeId}
                        </span>
                        <span
                          className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
                            selectedStaff.status === 'active'
                              ? 'bg-emerald-50 text-[#006a4e] border border-emerald-200'
                              : 'bg-slate-100 text-slate-600 border border-slate-300'
                          }`}
                        >
                          {selectedStaff.status.toUpperCase()}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">
                        <span className="font-semibold text-slate-700">{selectedStaff.roleName}</span> · Joined on {selectedStaff.joiningDate}
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setSelectedStaff(null)}
                    className="w-8 h-8 rounded-[3px] hover:bg-slate-200 text-slate-400 hover:text-slate-700 flex items-center justify-center transition-colors cursor-pointer"
                    aria-label="Close details"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Modal Body */}
                <div className="p-5 space-y-4 max-h-[75vh] overflow-y-auto">
                  {/* Personal & Professional Credentials */}
                  <div>
                    <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-2">
                      Professional Credentials & Contact
                    </h4>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 bg-slate-50 border border-slate-200/80 rounded-[3px] p-3 text-xs">
                      <div>
                        <span className="text-[10.5px] text-slate-400 block">Email Address</span>
                        <span className="font-mono font-medium text-slate-800 break-all">{selectedStaff.email}</span>
                      </div>
                      <div>
                        <span className="text-[10.5px] text-slate-400 block">Phone Number</span>
                        <span className="font-mono font-medium text-slate-800">{selectedStaff.phone}</span>
                      </div>
                      <div>
                        <span className="text-[10.5px] text-slate-400 block">Joining Date</span>
                        <span className="font-medium text-slate-800">{selectedStaff.joiningDate}</span>
                      </div>
                      <div>
                        <span className="text-[10.5px] text-slate-400 block">Academic Credential</span>
                        <span className="font-semibold text-slate-800">{selectedStaff.qualification || 'Pharmacy Professional'}</span>
                      </div>
                      <div>
                        <span className="text-[10.5px] text-slate-400 block">Pharmacy Board License</span>
                        <span className="font-mono font-medium text-slate-800">{selectedStaff.licenseNumber || 'Not Required for Role'}</span>
                      </div>
                      <div>
                        <span className="text-[10.5px] text-slate-400 block">Account Status</span>
                        <span className="font-semibold capitalize text-slate-800">{selectedStaff.status}</span>
                      </div>
                    </div>
                  </div>

                  {/* Branch Allocation */}
                  <div>
                    <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-2">
                      Branch Depots & Multi-Location Access
                    </h4>
                    <div className="bg-slate-50 border border-slate-200/80 rounded-[3px] p-3 text-xs space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-slate-500">Primary Assigned Depot:</span>
                        <span className="font-bold text-[#006a4e]">{selectedStaff.primaryBranchName}</span>
                      </div>
                      <div className="pt-2 border-t border-slate-200 flex items-start justify-between gap-2 flex-wrap">
                        <span className="text-slate-500 shrink-0">Authorized Branch Access:</span>
                        <div className="flex flex-wrap gap-1.5 justify-end">
                          {selectedStaff.branchNames.map((bn) => (
                            <span
                              key={bn}
                              className="px-2 py-0.5 bg-white border border-slate-200 rounded text-[11px] font-medium text-slate-700"
                            >
                              {bn}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* RBAC Privileges & Module Access */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                        Granular RBAC Privileges
                      </h4>
                      <span className="font-mono text-xs font-bold text-[#006a4e]">
                        {computeStaffPermissions(selectedStaff, rolesList).length} / {ALL_PHARMACY_PERMISSIONS.length} Permissions Active
                      </span>
                    </div>
                    <div className="bg-slate-50 border border-slate-200/80 rounded-[3px] p-3 text-xs">
                      <p className="text-slate-600 mb-2.5">
                        <span className="font-semibold text-slate-800">Role Designation:</span> {selectedStaff.roleName} (
                        {selectedStaff.roleSlug === 'pharmacy_admin' ? 'Unrestricted Administration' : 'Scoped Role Profile'})
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {PHARMACY_PERMISSION_MODULES.map((mod) => {
                          const staffPerms = computeStaffPermissions(selectedStaff, rolesList);
                          const permsInMod = mod.permissions.filter((p) => staffPerms.includes(p.name));
                          const totalInMod = mod.permissions.length;
                          const hasAny = permsInMod.length > 0;
                          return (
                            <span
                              key={mod.module}
                              className={`px-2 py-1 rounded text-[11px] font-medium border ${
                                hasAny
                                  ? 'bg-emerald-50 text-[#006a4e] border-emerald-200'
                                  : 'bg-slate-100 text-slate-400 border-slate-200'
                              }`}
                            >
                              {mod.title} ({permsInMod.length}/{totalInMod})
                            </span>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Footer Actions */}
                <div className="px-5 py-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-2 flex-wrap">
                  <div>
                    <button
                      type="button"
                      onClick={() => handleToggleStaffStatus(selectedStaff.id)}
                      className={`h-8 px-3 rounded-[3px] text-xs font-semibold inline-flex items-center gap-1.5 transition-colors cursor-pointer border ${
                        selectedStaff.status === 'active'
                          ? 'border-rose-200 bg-rose-50 text-rose-700 hover:bg-rose-100'
                          : 'border-emerald-300 bg-emerald-50 text-emerald-800 hover:bg-emerald-100'
                      }`}
                    >
                      {selectedStaff.status === 'active' ? (
                        <>
                          <UserX className="w-3.5 h-3.5" />
                          <span>Deactivate Account</span>
                        </>
                      ) : (
                        <>
                          <UserCheck className="w-3.5 h-3.5" />
                          <span>Activate Account</span>
                        </>
                      )}
                    </button>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setResetPasswordStaff(selectedStaff);
                        setSelectedStaff(null);
                      }}
                      className="h-8 px-3 rounded-[3px] bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold inline-flex items-center gap-1.5 transition-colors cursor-pointer border border-slate-300"
                    >
                      <KeyRound className="w-3.5 h-3.5 text-slate-600" />
                      <span>Reset Password</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setEditingStaff(selectedStaff);
                        setSelectedStaff(null);
                      }}
                      className="h-8 px-3 rounded-[3px] bg-sky-600 hover:bg-sky-700 text-white text-xs font-semibold inline-flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
                    >
                      <Edit className="w-3.5 h-3.5" />
                      <span>Edit Staff</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setSelectedStaff(null)}
                      className="h-8 px-3 rounded-[3px] border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 text-xs font-semibold inline-flex items-center gap-1 cursor-pointer transition-colors"
                    >
                      <span>Close</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Superadmin Enterprise DataTable */}
          <DataTable<PharmacyStaffMember>
            data={filteredStaff}
            columns={staffColumns}
            keyExtractor={(item) => item.id}
            searchPlaceholder="Search staff by name, email, employee ID, role, or branch..."
            searchFilter={(item, query) =>
              item.fullName.toLowerCase().includes(query.toLowerCase()) ||
              item.employeeId.toLowerCase().includes(query.toLowerCase()) ||
              item.email.toLowerCase().includes(query.toLowerCase()) ||
              item.roleName.toLowerCase().includes(query.toLowerCase()) ||
              item.primaryBranchName.toLowerCase().includes(query.toLowerCase()) ||
              item.branchNames.some((b) => b.toLowerCase().includes(query.toLowerCase()))
            }
            toolbarFilters={toolbarFilters}
            headerActions={headerActions}
            pageSizeOptions={[10, 20, 50, 100]}
            defaultPageSize={20}
            showSerial={true}
            onRowClick={(row) => setSelectedStaff(row)}
            emptyTitle="No staff members found"
            emptyDescription="No pharmacy staff members match the selected filter parameters."
          />
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: ROLE & PERMISSION MATRIX                                           */}
      {/* ========================================================================= */}
      {activeTab === 'role-matrix' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-3">
          {/* Roles Selector Column */}
          <div className="lg:col-span-4 space-y-2">
            <div className="bg-white rounded-[3px] p-3 shadow-xs border border-slate-200">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100 mb-2 gap-2">
                <div>
                  <span className="text-xs font-bold text-slate-800">Available Roles ({rolesList.length})</span>
                  <span className="text-[10px] text-slate-400 block">Click to edit matrix</span>
                </div>
                <button
                  type="button"
                  onClick={() => setIsCreateRoleModalOpen(true)}
                  className="h-7 px-2.5 rounded-[3px] bg-[#006a4e] hover:bg-[#00553e] text-white text-[11px] font-semibold inline-flex items-center gap-1 cursor-pointer shadow-xs transition-colors shrink-0"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Create Custom Role</span>
                </button>
              </div>

              <div className="space-y-1.5 max-h-[640px] overflow-y-auto pr-1">
                {rolesList.map((role) => {
                  const staffCount = staffList.filter((s) => s.roleSlug === role.slug).length;
                  const isSelected = role.slug === selectedRoleSlug;
                  return (
                    <div
                      key={role.id}
                      onClick={() => setSelectedRoleSlug(role.slug)}
                      className={`p-2.5 rounded-[3px] border cursor-pointer transition-all ${
                        isSelected
                          ? 'border-[#006a4e] bg-emerald-50/40 shadow-2xs ring-1 ring-[#006a4e]/20'
                          : 'border-slate-200 bg-white hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-800">{role.name}</span>
                        <div className="flex items-center gap-1.5">
                          {role.isSystem ? (
                            <span className="text-[9.5px] px-1.5 py-0.2 rounded bg-slate-100 text-slate-600 font-mono">
                              System
                            </span>
                          ) : (
                            <span className="text-[9.5px] px-1.5 py-0.2 rounded bg-amber-50 text-amber-800 border border-amber-200 font-mono">
                              Custom
                            </span>
                          )}
                          <span className="text-[10px] font-semibold px-1.5 py-0.2 rounded bg-slate-100 text-slate-700">
                            {staffCount} Staff
                          </span>
                        </div>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-1 line-clamp-2">{role.description}</p>
                      <div className="mt-2 flex items-center justify-between text-[10px] text-slate-400 pt-1.5 border-t border-slate-100">
                        <span>Privileges: {role.permissions.length} granted</span>
                        <span className="font-mono text-[#006a4e] font-semibold">
                          {Math.round((role.permissions.length / ALL_PHARMACY_PERMISSIONS.length) * 100)}%
                          Coverage
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Granular Permission Matrix Column */}
          <div className="lg:col-span-8 space-y-2">
            <div className="bg-white rounded-[3px] p-3 shadow-xs border border-slate-200">
              <div className="flex items-center justify-between pb-2 border-b border-slate-200 mb-3">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-slate-900">{activeRole.name}</h3>
                    {activeRole.isSystem ? (
                      <span className="text-[10px] px-2 py-0.5 rounded bg-slate-100 text-slate-600 font-medium">
                        Predefined Standard
                      </span>
                    ) : (
                      <span className="text-[10px] px-2 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-200 font-medium">
                        Custom Hospital Role
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">{activeRole.description}</p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      triggerToast(`✓ Permissions saved for role [${activeRole.name}].`);
                    }}
                    className="h-8 px-3 rounded-[3px] bg-[#006a4e] hover:bg-[#00553e] text-white text-xs font-semibold inline-flex items-center gap-1.5 cursor-pointer shadow-xs"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>Save Role Matrix</span>
                  </button>
                </div>
              </div>

              {/* Permission Matrix Table Grouped by Module */}
              <div className="space-y-4 max-h-[640px] overflow-y-auto pr-1">
                {PHARMACY_PERMISSION_MODULES.map((mod) => {
                  const modPermNames = mod.permissions.map((p) => p.name);
                  const selectedCount = modPermNames.filter((pn) =>
                    activeRole.permissions.includes(pn)
                  ).length;
                  const allSelected = selectedCount === modPermNames.length;

                  return (
                    <div key={mod.module} className="border border-slate-200 rounded-[3px] overflow-hidden">
                      {/* Module Header Strip */}
                      <div className="bg-slate-100/80 px-3 py-2 flex items-center justify-between border-b border-slate-200">
                        <div>
                          <span className="text-xs font-bold text-slate-800">{mod.title}</span>
                          <span className="text-[10.5px] text-slate-500 ml-2">
                            ({selectedCount}/{modPermNames.length} granted)
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => handleToggleModulePermissions(modPermNames, !allSelected)}
                            className="text-[11px] font-semibold text-[#006a4e] hover:underline cursor-pointer"
                          >
                            {allSelected ? 'Deselect All' : 'Select All'}
                          </button>
                        </div>
                      </div>

                      {/* Permission Rows */}
                      <div className="divide-y divide-slate-100 bg-white">
                        {mod.permissions.map((perm) => {
                          const isChecked = activeRole.permissions.includes(perm.name);
                          return (
                            <label
                              key={perm.id}
                              className={`flex items-start gap-2.5 px-3 py-2 cursor-pointer hover:bg-slate-50 transition-colors ${
                                isChecked ? 'bg-emerald-50/20' : ''
                              }`}
                            >
                              <input
                                type="checkbox"
                                checked={isChecked}
                                onChange={() => handleTogglePermission(perm.name)}
                                className="mt-0.5 rounded text-[#006a4e] focus:ring-[#006a4e]"
                              />
                              <div className="min-w-0 flex-1">
                                <div className="flex items-center gap-2">
                                  <span className="text-xs font-semibold text-slate-800">
                                    {perm.displayName}
                                  </span>
                                  <span className="font-mono text-[10px] text-slate-400">
                                    {perm.name}
                                  </span>
                                </div>
                                <p className="text-[11px] text-slate-500">{perm.description}</p>
                              </div>
                            </label>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: BRANCH ALLOCATIONS                                                 */}
      {/* ========================================================================= */}
      {activeTab === 'branch-allocations' && (
        <div className="space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {PHARMACY_BRANCHES.map((b) => {
              const primaryStaff = staffList.filter((s) => s.primaryBranchId === b.id);
              const crossStaff = staffList.filter(
                (s) => s.primaryBranchId !== b.id && s.branchIds.includes(b.id)
              );
              return (
                <div
                  key={b.id}
                  className="bg-white rounded-[3px] p-3.5 shadow-xs border border-slate-200 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                      <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-mono text-[11px] font-bold">
                        {b.code}
                      </span>
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-emerald-50 text-[#006a4e] border border-emerald-200">
                        {b.type.toUpperCase().replace('_', ' ')}
                      </span>
                    </div>

                    <h4 className="text-xs font-bold text-slate-900 mt-2">{b.name}</h4>
                    <p className="text-[11px] text-slate-500 mt-0.5">{b.address}</p>

                    <div className="mt-3 space-y-1 text-xs">
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="text-slate-400">In-Charge Lead:</span>
                        <span className="font-semibold text-slate-800">{b.inchargeName}</span>
                      </div>
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="text-slate-400">Primary Resident Staff:</span>
                        <span className="font-mono font-bold text-[#006a4e]">{primaryStaff.length}</span>
                      </div>
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="text-slate-400">Cross-Branch Authorized:</span>
                        <span className="font-mono text-slate-700">{crossStaff.length}</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 pt-2.5 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-[10px] text-slate-400 font-mono">{b.phone}</span>
                    <button
                      type="button"
                      onClick={() => {
                        setBranchFilter(b.id);
                        handleTabClick('staff-directory');
                      }}
                      className="text-xs font-semibold text-[#006a4e] hover:underline cursor-pointer"
                    >
                      View Staff ({primaryStaff.length + crossStaff.length}) →
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 4: AUDIT & COMPLIANCE LOGS                                            */}
      {/* ========================================================================= */}
      {activeTab === 'audit-logs' && (
        <DataTable<PharmacyAuditLog>
          data={auditLogs}
          columns={auditColumns}
          keyExtractor={(item) => item.id}
          searchPlaceholder="Search audit events by action, personnel, employee ID, or module..."
          searchFilter={(item, query) =>
            item.action.toLowerCase().includes(query.toLowerCase()) ||
            item.staffName.toLowerCase().includes(query.toLowerCase()) ||
            item.employeeId.toLowerCase().includes(query.toLowerCase()) ||
            item.module.toLowerCase().includes(query.toLowerCase()) ||
            item.branchName.toLowerCase().includes(query.toLowerCase())
          }
          pageSizeOptions={[10, 20, 50, 100]}
          defaultPageSize={20}
          showSerial={true}
          emptyTitle="No audit log entries"
          emptyDescription="No pharmacy security or RBAC audit records match the selected criteria."
        />
      )}

      {/* ========================================================================= */}
      {/* MODAL: RESET PASSWORD                                                     */}
      {/* ========================================================================= */}
      {resetPasswordStaff && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-[4px] shadow-2xl max-w-md w-full p-5 border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-[3px] bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-700">
                  <KeyRound className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Reset Staff Password</h3>
                  <p className="text-[11px] text-slate-500">Security credential reissue</p>
                </div>
              </div>
              <button
                onClick={() => setResetPasswordStaff(null)}
                className="text-slate-400 hover:text-slate-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleResetPasswordSubmit} className="space-y-3 text-xs">
              <div className="bg-slate-50 p-3 rounded border border-slate-200">
                <div className="font-bold text-slate-800">{resetPasswordStaff.fullName}</div>
                <div className="text-slate-500 font-mono text-[11px]">{resetPasswordStaff.email}</div>
                <div className="text-[#006a4e] font-semibold text-[11px]">{resetPasswordStaff.roleName}</div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  New Temporary Password *
                </label>
                <input
                  type="text"
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full h-8 px-2.5 rounded-[3px] border border-slate-300 font-mono text-xs focus:outline-hidden focus:border-[#006a4e]"
                />
              </div>

              <div className="text-[11px] text-slate-500">
                Password must be at least 6 characters. Mandatory password change on next login will be enforced.
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setResetPasswordStaff(null)}
                  className="h-8 px-3 rounded-[3px] border border-slate-300 text-slate-700 text-xs font-semibold hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="h-8 px-3 rounded-[3px] bg-[#006a4e] hover:bg-[#00553e] text-white text-xs font-semibold cursor-pointer shadow-xs"
                >
                  Confirm & Reset Password
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: ADD / EDIT PHARMACY STAFF                                          */}
      {/* ========================================================================= */}
      {(isAddStaffModalOpen || editingStaff) && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-[4px] shadow-2xl max-w-xl w-full p-5 border border-slate-200 max-h-[92vh] flex flex-col">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3 shrink-0">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-[3px] bg-emerald-50 border border-emerald-200 flex items-center justify-center text-[#006a4e]">
                  <UserPlus className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    {editingStaff ? 'Edit Pharmacy Staff Information' : 'Register New Pharmacy Staff'}
                  </h3>
                  <p className="text-[11px] text-slate-500">Assign roles, branches, and credentials</p>
                </div>
              </div>
              <button
                onClick={() => {
                  setIsAddStaffModalOpen(false);
                  setEditingStaff(null);
                }}
                className="text-slate-400 hover:text-slate-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                const form = e.target as HTMLFormElement;
                const fd = new FormData(form);
                const fullName = fd.get('fullName') as string;
                const email = fd.get('email') as string;
                const phone = fd.get('phone') as string;
                const employeeId = fd.get('employeeId') as string;
                const roleSlug = fd.get('roleSlug') as string;
                const primaryBranchId = fd.get('primaryBranchId') as string;
                const qualification = fd.get('qualification') as string;
                const licenseNumber = fd.get('licenseNumber') as string;
                const status = (fd.get('status') as 'active' | 'inactive') || 'active';

                const role = rolesList.find((r) => r.slug === roleSlug) || rolesList[0];
                const primaryBranch =
                  PHARMACY_BRANCHES.find((b) => b.id === primaryBranchId) || PHARMACY_BRANCHES[0];

                if (editingStaff) {
                  setStaffList((prev) =>
                    prev.map((s) =>
                      s.id === editingStaff.id
                        ? {
                            ...s,
                            fullName,
                            email,
                            phone,
                            employeeId,
                            roleSlug: role.slug,
                            roleName: role.name,
                            primaryBranchId: primaryBranch.id,
                            primaryBranchName: primaryBranch.name,
                            qualification,
                            licenseNumber,
                            status,
                          }
                        : s
                    )
                  );
                  triggerToast(`✓ Staff member [${fullName}] updated.`);
                } else {
                  const newMember: PharmacyStaffMember = {
                    id: `staff-${Date.now()}`,
                    employeeId,
                    fullName,
                    email,
                    phone,
                    roleSlug: role.slug,
                    roleName: role.name,
                    primaryBranchId: primaryBranch.id,
                    primaryBranchName: primaryBranch.name,
                    branchIds: [primaryBranch.id],
                    branchNames: [primaryBranch.name.split(' ')[0]],
                    status,
                    joiningDate: new Date().toISOString().split('T')[0],
                    qualification,
                    licenseNumber,
                  };
                  setStaffList((prev) => [newMember, ...prev]);
                  triggerToast(`✓ New staff member [${fullName}] registered successfully.`);
                }

                setIsAddStaffModalOpen(false);
                setEditingStaff(null);
              }}
              className="space-y-3 text-xs overflow-y-auto pr-1 flex-1"
            >
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    Full Name *
                  </label>
                  <input
                    name="fullName"
                    required
                    defaultValue={editingStaff?.fullName || ''}
                    placeholder="e.g. Dr. Mahmudur Rahman"
                    className="w-full h-8 px-2.5 rounded-[3px] border border-slate-300 text-xs focus:outline-hidden focus:border-[#006a4e]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    Employee ID *
                  </label>
                  <input
                    name="employeeId"
                    required
                    defaultValue={
                      editingStaff?.employeeId || `EMP-PH-${1010 + staffList.length}`
                    }
                    className="w-full h-8 px-2.5 rounded-[3px] border border-slate-300 text-xs font-mono uppercase focus:outline-hidden focus:border-[#006a4e]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    Official Email *
                  </label>
                  <input
                    name="email"
                    type="email"
                    required
                    defaultValue={editingStaff?.email || ''}
                    placeholder="staff@hospital.local"
                    className="w-full h-8 px-2.5 rounded-[3px] border border-slate-300 text-xs font-mono focus:outline-hidden focus:border-[#006a4e]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    Phone Number *
                  </label>
                  <input
                    name="phone"
                    required
                    defaultValue={editingStaff?.phone || '+880 17'}
                    className="w-full h-8 px-2.5 rounded-[3px] border border-slate-300 text-xs font-mono focus:outline-hidden focus:border-[#006a4e]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <DropdownSelect
                    native
                    label="Assigned Role *"
                    name="roleSlug"
                    options={rolesList.map((r) => ({ label: r.name, value: r.slug }))}
                    value={editingStaff?.roleSlug || 'pharmacist'}
                    onChange={() => {}}
                    width="w-full"
                  />
                </div>

                <div>
                  <DropdownSelect
                    native
                    label="Primary Branch Depot *"
                    name="primaryBranchId"
                    options={PHARMACY_BRANCHES.map((b) => ({
                      label: `${b.code} · ${b.name.split('-')[0]}`,
                      value: b.id,
                    }))}
                    value={editingStaff?.primaryBranchId || PHARMACY_BRANCHES[1].id}
                    onChange={() => {}}
                    width="w-full"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    Qualifications & Degrees
                  </label>
                  <input
                    name="qualification"
                    defaultValue={editingStaff?.qualification || 'B.Pharm (Hons)'}
                    className="w-full h-8 px-2.5 rounded-[3px] border border-slate-300 text-xs focus:outline-hidden focus:border-[#006a4e]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    Pharmacy Board License
                  </label>
                  <input
                    name="licenseNumber"
                    defaultValue={editingStaff?.licenseNumber || 'PCB Reg: B-'}
                    className="w-full h-8 px-2.5 rounded-[3px] border border-slate-300 text-xs font-mono focus:outline-hidden focus:border-[#006a4e]"
                  />
                </div>
              </div>

              <div>
                <DropdownSelect
                  native
                  label="Account Status *"
                  name="status"
                  options={[
                    { label: 'Active', value: 'active' },
                    { label: 'Inactive / On Leave', value: 'inactive' },
                  ]}
                  value={editingStaff?.status || 'active'}
                  onChange={() => {}}
                  width="w-full"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => {
                    setIsAddStaffModalOpen(false);
                    setEditingStaff(null);
                  }}
                  className="h-8 px-3 rounded-[3px] border border-slate-300 text-slate-700 text-xs font-semibold hover:bg-slate-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="h-8 px-3 rounded-[3px] bg-[#006a4e] hover:bg-[#00553e] text-white text-xs font-semibold cursor-pointer shadow-xs"
                >
                  {editingStaff ? 'Update Staff Member' : 'Register Staff Member'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: CREATE CUSTOM ROLE                                                 */}
      {/* ========================================================================= */}
      {isCreateRoleModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-[4px] shadow-2xl max-w-md w-full p-5 border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-[3px] bg-purple-50 border border-purple-200 flex items-center justify-center text-purple-700">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Create Custom Pharmacy Role</h3>
                  <p className="text-[11px] text-slate-500">Tailor permissions to your organization</p>
                </div>
              </div>
              <button
                onClick={() => setIsCreateRoleModalOpen(false)}
                className="text-slate-400 hover:text-slate-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateRoleSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  Role Name *
                </label>
                <input
                  type="text"
                  required
                  value={newRoleName}
                  onChange={(e) => setNewRoleName(e.target.value)}
                  placeholder="e.g. Clinical Drug Safety Officer"
                  className="w-full h-8 px-2.5 rounded-[3px] border border-slate-300 text-xs focus:outline-hidden focus:border-[#006a4e]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  Description
                </label>
                <textarea
                  rows={2}
                  value={newRoleDesc}
                  onChange={(e) => setNewRoleDesc(e.target.value)}
                  placeholder="Summary of responsibilities and scope..."
                  className="w-full p-2 rounded-[3px] border border-slate-300 text-xs focus:outline-hidden focus:border-[#006a4e]"
                />
              </div>

              <div className="text-[11px] text-slate-500 bg-slate-50 p-2.5 rounded border border-slate-200">
                You can configure the exact granular permissions for this role in the Role Matrix tab right after creating it.
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsCreateRoleModalOpen(false)}
                  className="h-8 px-3 rounded-[3px] border border-slate-300 text-slate-700 text-xs font-semibold hover:bg-slate-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="h-8 px-3 rounded-[3px] bg-[#006a4e] hover:bg-[#00553e] text-white text-xs font-semibold cursor-pointer shadow-xs"
                >
                  Create Custom Role
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
