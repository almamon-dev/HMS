import {
  AlertCircle,
  CheckCircle2,
  ChevronDown,
  Clock,
  Eye,
  MapPin,
  MoreVertical,
  Plus,
  Printer,
  QrCode,
  RefreshCw,
  Scan,
  ShieldCheck,
  Trash2,
  UserCheck,
  Users,
  X,
} from 'lucide-react';
import React, { useEffect, useMemo, useState } from 'react';
import {
  QR_ATTENDANCE_LOGS,
  QrAttendanceRecord,
} from '../../../data/superadminAttendanceData';
import { DataTable, DataTableColumn } from '../../common/DataTable';

type QrAttendanceTab = 'attendance' | 'settings';

interface QrAttendanceDirectoryProps {
  initialSubTab?: 'attendance-logs' | 'attendance-settings' | string;
}

export const QrAttendanceDirectory: React.FC<QrAttendanceDirectoryProps> = ({
  initialSubTab,
}) => {
  const initialTab: QrAttendanceTab =
    initialSubTab === 'attendance-settings' ? 'settings' : 'attendance';

  const [activeTab, setActiveTab] = useState<QrAttendanceTab>(initialTab);
  const [logs, setLogs] = useState<QrAttendanceRecord[]>(QR_ATTENDANCE_LOGS);
  const [deptFilter, setDeptFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedLog, setSelectedLog] = useState<QrAttendanceRecord | null>(null);
  const [activeActionId, setActiveActionId] = useState<string | null>(null);
  const [showManualModal, setShowManualModal] = useState(false);
  const [showQrDisplayModal, setShowQrDisplayModal] = useState(false);
  const [qrCountdown, setQrCountdown] = useState(30);

  // Manual Check-in Form
  const [manualStaffName, setManualStaffName] = useState('');
  const [manualStaffId, setManualStaffId] = useState('DOC-9025');
  const [manualRole, setManualRole] = useState('Consultant Physician');
  const [manualDept, setManualDept] = useState('Medicine');
  const [manualCampus, setManualCampus] = useState('Dhanmondi');

  useEffect(() => {
    if (initialSubTab === 'attendance-settings') setActiveTab('settings');
    else if (initialSubTab === 'attendance-logs') setActiveTab('attendance');
  }, [initialSubTab]);

  useEffect(() => {
    const handleOutside = () => setActiveActionId(null);
    window.addEventListener('click', handleOutside);
    return () => window.removeEventListener('click', handleOutside);
  }, []);

  // Simulating live dynamic QR token refresh
  useEffect(() => {
    const timer = setInterval(() => {
      setQrCountdown((prev) => (prev <= 1 ? 30 : prev - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // 4 Top Metrics matching PatientDirectory style
  const stats = useMemo(() => {
    const totalPresent = logs.filter((l) => l.status !== 'Absent').length;
    const onTime = logs.filter((l) => l.status === 'On Time').length;
    const late = logs.filter((l) => l.status === 'Late').length;
    const absent = logs.filter((l) => l.status === 'Absent').length;
    return { totalPresent, onTime, late, absent };
  }, [logs]);

  const departments = useMemo(() => {
    const list = Array.from(new Set(logs.map((l) => l.department)));
    return ['All', ...list];
  }, [logs]);

  const filteredLogs = useMemo(() => {
    return logs.filter((l) => {
      const matchDept = deptFilter === 'All' || l.department === deptFilter;
      const matchStatus = statusFilter === 'All' || l.status === statusFilter;
      return matchDept && matchStatus;
    });
  }, [logs, deptFilter, statusFilter]);

  const handleManualCheckIn = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualStaffName.trim()) return;

    const now = new Date();
    const timeFormatted = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const today = now.toISOString().slice(0, 10);

    const created: QrAttendanceRecord = {
      id: `att-${Date.now()}`,
      staffId: manualStaffId,
      staffName: manualStaffName.trim(),
      role: manualRole,
      department: manualDept,
      campus: manualCampus,
      date: today,
      scanTime: timeFormatted,
      checkoutTime: '--:--',
      deviceTerminal: 'Admin Desk Manual Terminal (Superadmin Override)',
      qrToken: `MAN-OVERRIDE-${Date.now().toString().slice(-4)}`,
      status: 'On Time',
      verificationMethod: 'Manual Override',
    };

    setLogs((prev) => [created, ...prev]);
    setSelectedLog(created);
    setShowManualModal(false);
    setManualStaffName('');
  };

  const columns: DataTableColumn<QrAttendanceRecord>[] = [
    {
      key: 'staffId',
      header: 'Staff ID',
      sortable: true,
      sortValue: (r) => r.staffId,
      render: (r) => (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setSelectedLog(r);
          }}
          className="text-[#0094b6] hover:underline font-bold text-left cursor-pointer whitespace-nowrap"
        >
          {r.staffId}
        </button>
      ),
    },
    {
      key: 'staffName',
      header: 'Staff Name',
      sortable: true,
      sortValue: (r) => r.staffName,
      render: (r) => (
        <div>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setSelectedLog(r);
            }}
            className="text-slate-900 font-semibold hover:text-[#0094b6] hover:underline text-left cursor-pointer whitespace-nowrap block"
          >
            {r.staffName}
          </button>
          <span className="text-[10px] text-slate-500">{r.role}</span>
        </div>
      ),
    },
    {
      key: 'department',
      header: 'Department',
      sortable: true,
      sortValue: (r) => r.department,
      render: (r) => r.department,
    },
    {
      key: 'campus',
      header: 'Branch Campus',
      sortable: true,
      sortValue: (r) => r.campus,
      render: (r) => r.campus,
    },
    {
      key: 'scanTime',
      header: 'QR Scan Clock-in',
      align: 'center',
      sortable: true,
      sortValue: (r) => r.scanTime,
      render: (r) => (
        <span className="font-semibold text-slate-900 whitespace-nowrap">
          {r.scanTime}
        </span>
      ),
    },
    {
      key: 'deviceTerminal',
      header: 'Terminal / Gate Scanner',
      render: (r) => (
        <span className="text-slate-700 whitespace-nowrap text-[10.5px]">
          {r.deviceTerminal}
        </span>
      ),
    },
    {
      key: 'verificationMethod',
      header: 'Auth Method',
      align: 'center',
      render: (r) => (
        <span className="px-1.5 py-0.5 rounded-[3px] bg-slate-100 text-slate-700 text-[10px] font-medium inline-flex items-center gap-1">
          <QrCode className="w-3 h-3 text-[#006a4e]" />
          {r.verificationMethod}
        </span>
      ),
    },
    {
      key: 'status',
      header: 'Attendance Status',
      align: 'center',
      sortable: true,
      sortValue: (r) => r.status,
      render: (r) => (
        <span
          className={`px-1.5 py-0.5 rounded-[3px] text-[10px] font-semibold border ${r.status === 'On Time'
            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
            : r.status === 'Late'
              ? 'bg-amber-50 text-amber-700 border-amber-200'
              : r.status === 'Half Day'
                ? 'bg-sky-50 text-sky-700 border-sky-200'
                : 'bg-rose-50 text-rose-700 border-rose-200'
            }`}
        >
          {r.status}
        </span>
      ),
    },
    {
      key: 'actions',
      header: 'Action',
      align: 'center',
      render: (r, idx?: number) => {
        const isNearBottom = (idx ?? 0) >= 4;
        return (
          <div className="relative inline-block text-left">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setActiveActionId((prev) => (prev === r.id ? null : r.id));
              }}
              className="w-5 h-5 rounded-[3px] hover:bg-slate-200/80 text-slate-500 hover:text-slate-800 flex items-center justify-center transition-colors cursor-pointer mx-auto"
              title="Actions"
              aria-label="Actions"
            >
              <MoreVertical className="w-3.5 h-3.5" />
            </button>

            {activeActionId === r.id && (
              <div
                className={`absolute right-0 ${isNearBottom ? 'bottom-full mb-1' : 'top-full mt-1'
                  } w-36 bg-white border border-slate-200 rounded-[3px] shadow-lg py-1 z-40 text-left divide-y divide-slate-100`}
                onClick={(e) => e.stopPropagation()}
              >
                <div className="py-0.5">
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedLog(r);
                      setActiveActionId(null);
                    }}
                    className="w-full text-left px-2.5 py-1.5 text-[11px] text-slate-700 hover:bg-[#edf6f2] hover:text-[#006a4e] font-medium flex items-center gap-2 cursor-pointer transition-colors"
                  >
                    <Eye className="w-3.5 h-3.5 text-[#006a4e]" />
                    <span>View Pass</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedLog(r);
                      setActiveActionId(null);
                      setTimeout(() => window.print(), 150);
                    }}
                    className="w-full text-left px-2.5 py-1.5 text-[11px] text-slate-700 hover:bg-slate-50 font-medium flex items-center gap-2 cursor-pointer transition-colors"
                  >
                    <Printer className="w-3.5 h-3.5 text-slate-500" />
                    <span>Print Slip</span>
                  </button>
                </div>
                <div className="py-0.5">
                  <button
                    type="button"
                    onClick={() => {
                      setLogs((prev) => prev.filter((item) => item.id !== r.id));
                      setActiveActionId(null);
                    }}
                    className="w-full text-left px-2.5 py-1.5 text-[11px] text-rose-600 hover:bg-rose-50 font-medium flex items-center gap-2 cursor-pointer transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5 text-rose-500" />
                    <span>Delete</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        );
      },
    },
  ];

  // Toolbar Filters matching PatientDirectory
  const toolbarFilters = (
    <>
      <div className="relative">
        <select
          aria-label="Filter by attendance view"
          value={activeTab}
          onChange={(e) => setActiveTab(e.target.value as QrAttendanceTab)}
          className="h-8 pl-2.5 pr-7 rounded-[3px] border border-slate-200 bg-white text-xs font-medium text-slate-700 appearance-none focus:outline-none focus:border-[#0094b6] cursor-pointer"
        >
          <option value="attendance">Daily QR Attendance Logs</option>
          <option value="settings">Dynamic QR Scanner &amp; Terminal Settings</option>
        </select>
        <ChevronDown className="w-3.5 h-3.5 text-slate-400 pointer-events-none absolute right-2 top-1/2 -translate-y-1/2" />
      </div>

      {activeTab === 'attendance' && (
        <>
          <div className="relative">
            <select
              aria-label="Filter by department"
              value={deptFilter}
              onChange={(e) => setDeptFilter(e.target.value)}
              className="h-8 pl-2.5 pr-7 rounded-[3px] border border-slate-200 bg-white text-xs font-medium text-slate-700 appearance-none focus:outline-none focus:border-[#0094b6] cursor-pointer"
            >
              {departments.map((d) => (
                <option key={d} value={d}>
                  {d === 'All' ? 'All Departments' : d}
                </option>
              ))}
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 pointer-events-none absolute right-2 top-1/2 -translate-y-1/2" />
          </div>

          <div className="relative">
            <select
              aria-label="Filter by status"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="h-8 pl-2.5 pr-7 rounded-[3px] border border-slate-200 bg-white text-xs font-medium text-slate-700 appearance-none focus:outline-none focus:border-[#0094b6] cursor-pointer"
            >
              <option value="All">All Attendance Status</option>
              <option value="On Time">On Time</option>
              <option value="Late">Late (Grace Period)</option>
              <option value="Half Day">Half Day</option>
              <option value="Absent">Absent</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 pointer-events-none absolute right-2 top-1/2 -translate-y-1/2" />
          </div>
        </>
      )}
    </>
  );

  // Toolbar Actions matching PatientDirectory
  const toolbarActions = (
    <div className="flex items-center gap-1.5">
      <button
        type="button"
        onClick={() => setShowManualModal(true)}
        className="h-8 px-3 rounded-[3px] bg-[#0094b6] hover:bg-[#007f9c] text-white text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
      >
        <Plus className="w-3.5 h-3.5" />
        <span>Manual Clock-In</span>
      </button>

      <button
        type="button"
        onClick={() => setShowQrDisplayModal(true)}
        className="h-8 px-2.5 rounded-[3px] bg-[#006a4e] hover:bg-[#00523c] text-white text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
      >
        <QrCode className="w-3.5 h-3.5" />
        <span>Live Gate QR</span>
      </button>
    </div>
  );

  return (
    <div className="space-y-2">
      {/* 4 Summary Metric Cards matching PatientDirectory format */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
        <div className="bg-white rounded-[3px] p-2.5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[10.5px] font-bold text-slate-700">Total Staff Present</span>
            <Users className="w-3.5 h-3.5 text-[#0094b6]" />
          </div>
          <div className="my-1">
            <span className="text-base font-extrabold text-slate-900 leading-none">
              {stats.totalPresent} Checked-In
            </span>
          </div>
          <p className="text-[10px] text-slate-500">QR scanned across entrance turnstiles</p>
        </div>

        <div className="bg-white rounded-[3px] p-2.5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[10.5px] font-bold text-slate-700">On Time Clock-ins</span>
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
          </div>
          <div className="my-1">
            <span className="text-base font-extrabold text-emerald-700 leading-none">
              {stats.onTime} On Time
            </span>
          </div>
          <p className="text-[10px] text-slate-500">Clocked in before 08:00 AM shift start</p>
        </div>

        <div className="bg-white rounded-[3px] p-2.5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[10.5px] font-bold text-slate-700">Late Arrivals</span>
            <Clock className="w-3.5 h-3.5 text-amber-500" />
          </div>
          <div className="my-1">
            <span className="text-base font-extrabold text-amber-600 leading-none">
              {stats.late} Within Grace
            </span>
          </div>
          <p className="text-[10px] text-slate-500">15-minute grace period allowed</p>
        </div>

        <div className="bg-white rounded-[3px] p-2.5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[10.5px] font-bold text-slate-700">Absent / Unmarked</span>
            <AlertCircle className="w-3.5 h-3.5 text-rose-500" />
          </div>
          <div className="my-1">
            <span className="text-base font-extrabold text-rose-600 leading-none">
              {stats.absent} Staff
            </span>
          </div>
          <p className="text-[10px] text-slate-500">Pending leave approval or missed scan</p>
        </div>
      </div>

      {/* Selected Attendance Record Quick View Card matching Patient quick view styling */}
      {selectedLog && (
        <div className="bg-white border border-[#0094b6]/30 rounded-md p-4">
          <div className="flex flex-wrap items-start justify-between gap-3 border-b border-slate-100 pb-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-[3px] bg-[#f0f8fa] text-[#0094b6] font-bold text-sm flex items-center justify-center">
                <QrCode className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="text-sm font-semibold text-slate-900">
                    {selectedLog.staffName}
                  </h3>
                  <span className="px-2 py-0.5 rounded-[3px] bg-slate-100 text-slate-700 text-[11px] font-medium">
                    {selectedLog.staffId}
                  </span>
                  <span className="px-2 py-0.5 rounded-[3px] bg-slate-100 text-slate-700 text-[11px] font-medium">
                    {selectedLog.department}
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded-[3px] border text-[11px] font-semibold ${selectedLog.status === 'On Time'
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                      : selectedLog.status === 'Late'
                        ? 'bg-amber-50 text-amber-700 border-amber-200'
                        : 'bg-rose-50 text-rose-700 border-rose-200'
                      }`}
                  >
                    {selectedLog.status}
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  Role: <strong className="text-slate-800">{selectedLog.role}</strong> · Scanned: {selectedLog.scanTime} ({selectedLog.campus} Campus)
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => window.print()}
                className="h-8 px-3 rounded-[3px] border border-slate-200 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-700 inline-flex items-center gap-1.5 cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5 text-slate-500" />
                <span>Print Pass</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedLog(null)}
                className="w-8 h-8 rounded-[3px] border border-slate-200 text-slate-500 hover:text-slate-800 hover:bg-slate-50 flex items-center justify-center cursor-pointer"
                aria-label="Close attendance quick view"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 text-xs">
            <div>
              <p className="text-[11px] text-slate-400">Terminal Gate</p>
              <p className="font-semibold text-slate-800">{selectedLog.deviceTerminal}</p>
            </div>
            <div>
              <p className="text-[11px] text-slate-400">Security QR Token</p>
              <p className="font-mono text-slate-800 text-[10.5px]">{selectedLog.qrToken}</p>
            </div>
            <div>
              <p className="text-[11px] text-slate-400">Authentication Method</p>
              <p className="font-medium text-emerald-700">{selectedLog.verificationMethod}</p>
            </div>
            <div>
              <p className="text-[11px] text-slate-400">Log Timestamp</p>
              <p className="font-medium text-slate-800">{selectedLog.date} {selectedLog.scanTime}</p>
            </div>
          </div>
        </div>
      )}

      {/* Main Tab View with Reusable DataTable */}
      {activeTab === 'attendance' && (
        <DataTable<QrAttendanceRecord>
          title="Daily QR Code Attendance Registry"
          subtitle="Hospital staff turnstile check-ins, dynamic anti-spoofing QR scans, and punctuality tracking"
          data={filteredLogs}
          columns={columns}
          rowKey={(r) => r.id}
          searchable
          searchPlaceholder="Search by staff ID, name, department, or terminal..."
          searchFilter={(r, q) =>
            r.staffId.toLowerCase().includes(q) ||
            r.staffName.toLowerCase().includes(q) ||
            r.department.toLowerCase().includes(q) ||
            r.role.toLowerCase().includes(q) ||
            r.deviceTerminal.toLowerCase().includes(q)
          }
          toolbarFilters={toolbarFilters}
          toolbarActions={toolbarActions}
          defaultPageSize={8}
          pageSizeOptions={[8, 12, 20, 30, 50, 100]}
          emptyTitle="No attendance records found"
          emptyDescription="No staff check-in entries matching the selected filters."
        />
      )}

      {activeTab === 'settings' && (
        <div className="bg-white border border-slate-300 rounded-[3px] p-4 space-y-4">
          <div className="border-b border-slate-200 pb-3 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Dynamic QR Attendance Scanner &amp; Terminal Configuration
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Configure rotating dynamic QR tokens, entrance tablet kiosks, GPS radius fencing, and grace periods.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setShowQrDisplayModal(true)}
              className="h-8 px-3 rounded-[3px] bg-[#006a4e] hover:bg-[#00523c] text-white text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
            >
              <Scan className="w-3.5 h-3.5" />
              <span>Launch Kiosk Display</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="p-3 border border-slate-200 rounded-[3px] bg-slate-50/60 space-y-2">
              <div className="flex items-center gap-2 font-bold text-slate-800">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Anti-Spoofing Dynamic Tokens</span>
              </div>
              <p className="text-slate-600">
                Dynamic QR code refreshes automatically every 30 seconds. Prevents photo sharing or proxy check-ins between colleagues.
              </p>
              <div className="pt-2 border-t border-slate-200 text-[11px] text-emerald-700 font-semibold flex items-center justify-between">
                <span>Auto-Refresh Cycle:</span>
                <span className="font-mono bg-emerald-100 px-1.5 py-0.5 rounded-[3px]">{qrCountdown}s remaining</span>
              </div>
            </div>

            <div className="p-3 border border-slate-200 rounded-[3px] bg-slate-50/60 space-y-2">
              <div className="flex items-center gap-2 font-bold text-slate-800">
                <MapPin className="w-4 h-4 text-[#0094b6]" />
                <span>Geofence &amp; IP Binding</span>
              </div>
              <p className="text-slate-600">
                Turnstiles only accept scans originating from hospital local Wi-Fi or within 50 meters of the campus perimeter GPS coordinates.
              </p>
              <div className="pt-2 border-t border-slate-200 text-[11px] text-slate-700 font-semibold flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Radius: 50m Strict Geofence</span>
              </div>
            </div>

            <div className="p-3 border border-slate-200 rounded-[3px] bg-slate-50/60 space-y-2">
              <div className="flex items-center gap-2 font-bold text-slate-800">
                <Clock className="w-4 h-4 text-amber-600" />
                <span>Shift Grace Rules</span>
              </div>
              <p className="text-slate-600">
                15-minute standard grace period allowed. Clock-ins after 08:15 AM for morning shifts are automatically tagged as Late. 3 late clock-ins trigger an HR notification.
              </p>
              <div className="pt-2 border-t border-slate-200 text-[11px] text-[#006a4e] font-semibold flex items-center gap-1.5">
                <UserCheck className="w-3.5 h-3.5" />
                <span>Policy Auto-Deduction Configured</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Manual Clock-in Modal */}
      {showManualModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-md border border-slate-200 shadow-xl w-full max-w-xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="px-4 py-3 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-2">
                <QrCode className="w-4 h-4 text-[#0094b6]" />
                <h3 className="text-sm font-bold text-slate-900">Manual Staff Clock-In Override</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowManualModal(false)}
                className="w-7 h-7 rounded-sm text-slate-400 hover:text-slate-700 hover:bg-slate-200 flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleManualCheckIn} className="p-4 space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    Staff Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={manualStaffName}
                    onChange={(e) => setManualStaffName(e.target.value)}
                    placeholder="Enter staff full name"
                    className="w-full h-8 px-2.5 rounded-[3px] border border-slate-300 text-xs focus:outline-hidden focus:border-[#0094b6]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    Staff ID Code *
                  </label>
                  <input
                    type="text"
                    required
                    value={manualStaffId}
                    onChange={(e) => setManualStaffId(e.target.value)}
                    className="w-full h-8 px-2.5 rounded-[3px] border border-slate-300 text-xs focus:outline-hidden focus:border-[#0094b6]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    Department
                  </label>
                  <select
                    value={manualDept}
                    onChange={(e) => setManualDept(e.target.value)}
                    className="w-full h-8 px-2 rounded-[3px] border border-slate-300 text-xs focus:outline-hidden focus:border-[#0094b6]"
                  >
                    <option value="Cardiology">Cardiology</option>
                    <option value="Medicine">Medicine</option>
                    <option value="Orthopedics">Orthopedics</option>
                    <option value="Pharmacy">Pharmacy</option>
                    <option value="ICU / CCU">ICU / CCU</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    Role Title
                  </label>
                  <input
                    type="text"
                    value={manualRole}
                    onChange={(e) => setManualRole(e.target.value)}
                    className="w-full h-8 px-2.5 rounded-[3px] border border-slate-300 text-xs focus:outline-hidden focus:border-[#0094b6]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    Hospital Campus
                  </label>
                  <select
                    value={manualCampus}
                    onChange={(e) => setManualCampus(e.target.value)}
                    className="w-full h-8 px-2 rounded-[3px] border border-slate-300 text-xs focus:outline-hidden focus:border-[#0094b6]"
                  >
                    <option value="Dhanmondi">Dhanmondi</option>
                    <option value="Uttara">Uttara</option>
                    <option value="Mirpur">Mirpur</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setShowManualModal(false)}
                  className="h-8 px-3 rounded-[3px] border border-slate-300 text-slate-700 hover:bg-slate-100 font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="h-8 px-4 rounded-[3px] bg-[#0094b6] hover:bg-[#007f9c] text-white font-semibold cursor-pointer"
                >
                  Register Check-In
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Live QR Kiosk Display Modal */}
      {showQrDisplayModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-md border border-slate-200 shadow-2xl w-full max-w-md overflow-hidden text-center animate-in fade-in zoom-in-95 duration-150">
            <div className="px-4 py-3 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-2">
                <QrCode className="w-4 h-4 text-[#006a4e]" />
                <h3 className="text-xs font-bold text-slate-900">Entrance Kiosk QR Scanner</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowQrDisplayModal(false)}
                className="w-7 h-7 rounded-sm text-slate-400 hover:text-slate-700 hover:bg-slate-200 flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <p className="text-xs text-slate-600">
                Scan this dynamic QR code with your GreenHospital Staff App to register your clock-in.
              </p>

              {/* Simulated Authentic Dynamic QR Code */}
              <div className="mx-auto w-52 h-52 bg-white border-4 border-slate-900 rounded-lg p-2.5 flex flex-col items-center justify-center relative shadow-md">
                <div className="grid grid-cols-6 gap-1 w-full h-full p-2 bg-slate-100 rounded">
                  {Array.from({ length: 36 }).map((_, i) => (
                    <div
                      key={i}
                      className={`rounded-xs ${(i % 7 === 0 || i % 5 === 0 || i % 3 === 0)
                        ? 'bg-slate-900'
                        : 'bg-white'
                        }`}
                    />
                  ))}
                </div>
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="w-10 h-10 bg-[#006a4e] text-white rounded-md flex items-center justify-center shadow-lg border-2 border-white">
                    <QrCode className="w-5 h-5" />
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-center gap-2 text-xs text-slate-600 font-semibold">
                <RefreshCw className="w-3.5 h-3.5 animate-spin text-[#0094b6]" />
                <span>Rotating security token in </span>
                <span className="font-bold text-[#006a4e]">{qrCountdown} seconds</span>
              </div>

              <div className="pt-2 text-[11px] text-slate-400 border-t border-slate-100">
                Device Terminal: Dhanmondi Gate-01 Kiosk · Geofence Verified
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
