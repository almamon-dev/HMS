import {
  ArrowLeftRight,
  CheckCircle2,
  ChevronDown,
  Clock4,
  Eye,
  MoreVertical,
  Plus,
  Printer,
  Trash2,
  UserCheck,
  UserPlus,
  Users,
  X,
} from 'lucide-react';
import React, { useEffect, useMemo, useState } from 'react';
import {
  DutyRosterRecord,
  DutyShiftType,
  SHIFT_TIMING_CONFIGS,
  SMART_DUTY_ROSTER,
  ShiftTimingConfig,
} from '../../../data/superadminDutyRosterData';
import { DataTable, DataTableColumn } from '../../common/DataTable';

type DutyRosterTab = 'roster' | 'matrix' | 'shifts';

export const DutyRosterDirectory: React.FC = () => {
  const [activeTab, setActiveTab] = useState<DutyRosterTab>('roster');
  const [roster, setRoster] = useState<DutyRosterRecord[]>(SMART_DUTY_ROSTER);
  const [shifts] = useState<ShiftTimingConfig[]>(SHIFT_TIMING_CONFIGS);
  const [selectedDeptFilter, setSelectedDeptFilter] = useState('All');
  const [selectedShiftFilter, setSelectedShiftFilter] = useState('All');
  const [selectedRecord, setSelectedRecord] = useState<DutyRosterRecord | null>(null);
  const [activeActionId, setActiveActionId] = useState<string | null>(null);

  // Modals state
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [showHandoverModal, setShowHandoverModal] = useState(false);

  // Assign Duty Form State
  const [formStaffName, setFormStaffName] = useState('');
  const [formStaffId, setFormStaffId] = useState('DOC-9022');
  const [formRole, setFormRole] = useState<DutyRosterRecord['role']>('Consultant Doctor');
  const [formDept, setFormDept] = useState('Cardiology');
  const [formShift, setFormShift] = useState<DutyShiftType>('Morning (08:00 - 14:00)');
  const [formChamber, setFormChamber] = useState('Ch-103 (Cardio Hub)');
  const [formCampus, setFormCampus] = useState('Dhanmondi');

  // Shift Handover Notes
  const [handoverFrom, setHandoverFrom] = useState('Dr. Reyan Jain (Morning Shift)');
  const [handoverTo, setHandoverTo] = useState('Dr. Mahmudul Hasan (Evening Shift)');
  const [handoverNotes, setHandoverNotes] = useState(
    'CCU Bed 07 post-PCI stable. Triage 2 trauma patients under active observation in Room 02.'
  );

  useEffect(() => {
    const handleOutside = () => setActiveActionId(null);
    window.addEventListener('click', handleOutside);
    return () => window.removeEventListener('click', handleOutside);
  }, []);

  const departments = useMemo(() => {
    const list = Array.from(new Set(roster.map((r) => r.department)));
    return ['All', ...list];
  }, [roster]);

  const filteredRoster = useMemo(() => {
    return roster.filter((r) => {
      const matchDept = selectedDeptFilter === 'All' || r.department === selectedDeptFilter;
      const matchShift = selectedShiftFilter === 'All' || r.shift === selectedShiftFilter;
      return matchDept && matchShift;
    });
  }, [roster, selectedDeptFilter, selectedShiftFilter]);

  // Operational metrics
  const metrics = useMemo(() => {
    const totalStaff = roster.length;
    const onDuty = roster.filter((r) => r.status === 'On Duty').length;
    const upcoming = roster.filter((r) => r.status === 'Upcoming').length;
    const onLeave = roster.filter((r) => r.status === 'On Leave').length;
    const doctors = roster.filter((r) => r.role.includes('Doctor') || r.role.includes('Specialist')).length;
    return { totalStaff, onDuty, upcoming, onLeave, doctors };
  }, [roster]);

  const handleAssignSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formStaffName.trim()) return;

    const newRoster: DutyRosterRecord = {
      id: `rst-${Date.now()}`,
      rosterNo: `RST-${9055 + roster.length}`,
      staffName: formStaffName.trim(),
      staffId: formStaffId,
      role: formRole,
      department: formDept,
      shift: formShift,
      chamberOrWard: formChamber,
      dutyDate: '20/11/2026',
      checkInTime: 'Shift Assigned',
      status: 'On Duty',
      contactNo: '+880 1711-000000',
      campus: formCampus,
    };

    setRoster((prev) => [newRoster, ...prev]);
    setShowAssignModal(false);
    setFormStaffName('');
  };

  // Columns for Duty Roster Table
  const rosterColumns: DataTableColumn<DutyRosterRecord>[] = [
    {
      key: 'rosterNo',
      header: 'Roster No',
      sortable: true,
      sortValue: (r) => r.rosterNo,
      render: (r: DutyRosterRecord) => (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setSelectedRecord(r);
          }}
          className="text-[#0094b6] hover:underline font-bold text-left cursor-pointer whitespace-nowrap font-mono text-[11px]"
        >
          {r.rosterNo}
        </button>
      ),
    },
    {
      key: 'staffInfo',
      header: 'Staff Name & ID',
      sortable: true,
      sortValue: (r) => r.staffName,
      render: (r: DutyRosterRecord) => (
        <div className="leading-tight">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setSelectedRecord(r);
            }}
            className="text-slate-900 font-semibold hover:text-[#0094b6] hover:underline text-left cursor-pointer whitespace-nowrap block"
          >
            {r.staffName}
          </button>
          <span className="text-[10px] text-slate-500 font-mono">{r.staffId}</span>
        </div>
      ),
    },
    {
      key: 'role',
      header: 'Designation / Role',
      sortable: true,
      sortValue: (r) => r.role,
      render: (r: DutyRosterRecord) => (
        <span className="text-slate-700 font-medium whitespace-nowrap">{r.role}</span>
      ),
    },
    {
      key: 'department',
      header: 'Department',
      sortable: true,
      sortValue: (r) => r.department,
      render: (r: DutyRosterRecord) => (
        <span className="text-slate-800 font-semibold whitespace-nowrap">{r.department}</span>
      ),
    },
    {
      key: 'shift',
      header: 'Shift Timings',
      sortable: true,
      sortValue: (r) => r.shift,
      render: (r: DutyRosterRecord) => (
        <span
          className={`px-1.5 py-0.5 rounded-[3px] font-semibold text-[10px] whitespace-nowrap ${r.shift.includes('Morning')
            ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
            : r.shift.includes('Evening')
              ? 'bg-amber-50 text-amber-800 border border-amber-200'
              : r.shift.includes('Night')
                ? 'bg-purple-50 text-purple-800 border border-purple-200'
                : 'bg-sky-50 text-sky-800 border border-sky-200'
            }`}
        >
          {r.shift}
        </span>
      ),
    },
    {
      key: 'chamberOrWard',
      header: 'Station / Chamber',
      render: (r: DutyRosterRecord) => (
        <span className="text-slate-700 font-medium whitespace-nowrap">{r.chamberOrWard}</span>
      ),
    },
    {
      key: 'checkInTime',
      header: 'Check-In Verification',
      render: (r: DutyRosterRecord) => (
        <span className="text-slate-600 text-[10.5px] whitespace-nowrap font-medium">
          {r.checkInTime}
        </span>
      ),
    },
    {
      key: 'status',
      header: 'Duty Status',
      align: 'center',
      sortable: true,
      sortValue: (r) => r.status,
      render: (r: DutyRosterRecord) => (
        <span
          className={`px-1.5 py-0.5 rounded-[3px] font-semibold text-[10px] inline-flex items-center gap-1 ${r.status === 'On Duty'
            ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
            : r.status === 'Upcoming'
              ? 'bg-amber-50 text-amber-800 border border-amber-200'
              : 'bg-slate-100 text-slate-700 border border-slate-200'
            }`}
        >
          <span
            className={`w-1.5 h-1.5 rounded-full ${r.status === 'On Duty'
              ? 'bg-emerald-500'
              : r.status === 'Upcoming'
                ? 'bg-amber-500'
                : 'bg-slate-400'
              }`}
          />
          {r.status}
        </span>
      ),
    },
    {
      key: 'action',
      header: 'Action',
      align: 'center',
      render: (r: DutyRosterRecord, idx?: number) => {
        const isNearBottom = (idx ?? 0) >= 5;
        return (
          <div className="relative inline-block text-left">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setActiveActionId((prev) => (prev === r.id ? null : r.id));
              }}
              className="w-5 h-5 rounded-[3px] hover:bg-slate-200/80 text-slate-500 hover:text-slate-800 flex items-center justify-center transition-colors cursor-pointer mx-auto"
              title="More actions"
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
                      setSelectedRecord(r);
                      setActiveActionId(null);
                    }}
                    className="w-full text-left px-2.5 py-1.5 text-[11px] text-slate-700 hover:bg-[#f0f8fa] hover:text-[#0094b6] font-medium flex items-center gap-2 cursor-pointer transition-colors"
                  >
                    <Eye className="w-3.5 h-3.5 text-[#0094b6]" />
                    <span>View Roster Slip</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedRecord(r);
                      setActiveActionId(null);
                      setTimeout(() => window.print(), 150);
                    }}
                    className="w-full text-left px-2.5 py-1.5 text-[11px] text-slate-700 hover:bg-slate-50 font-medium flex items-center gap-2 cursor-pointer transition-colors"
                  >
                    <Printer className="w-3.5 h-3.5 text-slate-500" />
                    <span>Print Duty Pass</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setRoster((prev) =>
                        prev.map((item) =>
                          item.id === r.id
                            ? {
                              ...item,
                              status: item.status === 'On Duty' ? 'Completed' : 'On Duty',
                              checkInTime: 'Status Updated',
                            }
                            : item
                        )
                      );
                      setActiveActionId(null);
                    }}
                    className="w-full text-left px-2.5 py-1.5 text-[11px] text-emerald-700 hover:bg-emerald-50 font-medium flex items-center gap-2 cursor-pointer transition-colors"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{r.status === 'On Duty' ? 'End Shift' : 'Mark On Duty'}</span>
                  </button>
                </div>
                <div className="py-0.5">
                  <button
                    type="button"
                    onClick={() => {
                      setRoster((prev) => prev.filter((item) => item.id !== r.id));
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
          aria-label="Filter by duty roster section"
          value={activeTab}
          onChange={(e) => setActiveTab(e.target.value as DutyRosterTab)}
          className="h-8 pl-2.5 pr-7 rounded-[3px] border border-slate-200 bg-white text-xs font-medium text-slate-700 appearance-none focus:outline-none focus:border-[#0094b6] cursor-pointer"
        >
          <option value="roster">Staff Duty Roster</option>
          <option value="matrix">Weekly Shift Matrix</option>
          <option value="shifts">Shift Timings &amp; Rules</option>
        </select>
        <ChevronDown className="w-3.5 h-3.5 text-slate-400 pointer-events-none absolute right-2 top-1/2 -translate-y-1/2" />
      </div>

      <div className="relative">
        <select
          aria-label="Filter by department"
          value={selectedDeptFilter}
          onChange={(e) => setSelectedDeptFilter(e.target.value)}
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
          aria-label="Filter by shift"
          value={selectedShiftFilter}
          onChange={(e) => setSelectedShiftFilter(e.target.value)}
          className="h-8 pl-2.5 pr-7 rounded-[3px] border border-slate-200 bg-white text-xs font-medium text-slate-700 appearance-none focus:outline-none focus:border-[#0094b6] cursor-pointer"
        >
          <option value="All">All Shifts</option>
          <option value="Morning (08:00 - 14:00)">Morning Shift</option>
          <option value="Evening (14:00 - 20:00)">Evening Shift</option>
          <option value="Night (20:00 - 08:00)">Night Shift</option>
          <option value="General (09:00 - 17:00)">General Shift</option>
        </select>
        <ChevronDown className="w-3.5 h-3.5 text-slate-400 pointer-events-none absolute right-2 top-1/2 -translate-y-1/2" />
      </div>
    </>
  );

  // Toolbar Actions matching PatientDirectory
  const toolbarActions = (
    <div className="flex items-center gap-1.5">
      <button
        type="button"
        onClick={() => setShowAssignModal(true)}
        className="h-8 px-3 rounded-[3px] bg-[#0094b6] hover:bg-[#007f9c] text-white text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
      >
        <Plus className="w-3.5 h-3.5" />
        <span>Assign Duty</span>
      </button>

      <button
        type="button"
        onClick={() => setShowHandoverModal(true)}
        className="h-8 px-2.5 rounded-[3px] bg-[#006a4e] hover:bg-[#00523c] text-white text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
      >
        <ArrowLeftRight className="w-3.5 h-3.5" />
        <span>Shift Handover</span>
      </button>
    </div>
  );

  return (
    <div className="space-y-2 min-w-0 w-full overflow-hidden">
      {/* 4 Summary Metric Cards matching PatientDirectory format */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
        <div className="bg-white rounded-[3px] p-2.5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[10.5px] font-bold text-slate-700">Total Active Staff</span>
            <Users className="w-3.5 h-3.5 text-[#0094b6]" />
          </div>
          <div className="my-1">
            <span className="text-base font-extrabold text-slate-900 leading-none">
              {metrics.totalStaff} Personnel
            </span>
          </div>
          <p className="text-[10px] text-slate-500">Doctors, nurses, paramedics, technicians</p>
        </div>

        <div className="bg-white rounded-[3px] p-2.5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[10.5px] font-bold text-slate-700">Currently On Duty</span>
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
          </div>
          <div className="my-1">
            <span className="text-base font-extrabold text-emerald-700 leading-none">
              {metrics.onDuty} On Floor
            </span>
          </div>
          <p className="text-[10px] text-slate-500">{metrics.doctors} consultant doctors verified</p>
        </div>

        <div className="bg-white rounded-[3px] p-2.5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[10.5px] font-bold text-slate-700">Upcoming Shift</span>
            <Clock4 className="w-3.5 h-3.5 text-amber-500" />
          </div>
          <div className="my-1">
            <span className="text-base font-extrabold text-amber-600 leading-none">
              {metrics.upcoming} Scheduled
            </span>
          </div>
          <p className="text-[10px] text-slate-500">Handover checklist prepared</p>
        </div>

        <div className="bg-white rounded-[3px] p-2.5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[10.5px] font-bold text-slate-700">Approved Leave</span>
            <UserCheck className="w-3.5 h-3.5 text-slate-500" />
          </div>
          <div className="my-1">
            <span className="text-base font-extrabold text-slate-700 leading-none">
              {metrics.onLeave} On Leave
            </span>
          </div>
          <p className="text-[10px] text-slate-500">Substitutes &amp; cover deployed</p>
        </div>
      </div>

      {/* Selected Roster Detail Quick View Card */}
      {selectedRecord && (
        <div className="bg-white border border-[#0094b6]/30 rounded-md p-4">
          <div className="flex flex-wrap items-start justify-between gap-3 border-b border-slate-100 pb-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-[3px] bg-[#f0f8fa] text-[#0094b6] font-bold text-sm flex items-center justify-center">
                {selectedRecord.staffName.slice(0, 2)}
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="text-sm font-semibold text-slate-900">
                    {selectedRecord.staffName}
                  </h3>
                  <span className="px-2 py-0.5 rounded-[3px] bg-slate-100 text-slate-700 text-[11px] font-medium">
                    {selectedRecord.staffId}
                  </span>
                  <span className="px-2 py-0.5 rounded-[3px] bg-slate-100 text-slate-700 text-[11px] font-medium">
                    {selectedRecord.department}
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded-[3px] border text-[11px] font-semibold ${selectedRecord.status === 'On Duty'
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                      : selectedRecord.status === 'Upcoming'
                        ? 'bg-sky-50 text-sky-700 border-sky-200'
                        : 'bg-slate-100 text-slate-700 border-slate-200'
                      }`}
                  >
                    {selectedRecord.status}
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  Shift: <strong className="text-slate-800">{selectedRecord.shift}</strong> · Station: {selectedRecord.chamberOrWard} ({selectedRecord.campus})
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
                <span>Print Duty Pass</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedRecord(null)}
                className="w-8 h-8 rounded-[3px] border border-slate-200 text-slate-500 hover:text-slate-800 hover:bg-slate-50 flex items-center justify-center cursor-pointer"
                aria-label="Close roster quick view"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 text-xs">
            <div>
              <p className="text-[11px] text-slate-400">Clinical Role</p>
              <p className="font-semibold text-slate-800">{selectedRecord.role}</p>
            </div>
            <div>
              <p className="text-[11px] text-slate-400">Chamber / Ward</p>
              <p className="font-semibold text-slate-800">{selectedRecord.chamberOrWard}</p>
            </div>
            <div>
              <p className="text-[11px] text-slate-400">Biometric Check-in</p>
              <p className="font-medium text-emerald-700">{selectedRecord.checkInTime}</p>
            </div>
            <div>
              <p className="text-[11px] text-slate-400">Hospital Branch</p>
              <p className="font-medium text-slate-800">{selectedRecord.campus} Campus</p>
            </div>
          </div>
        </div>
      )}

      {/* Main Tab View with DataTable */}
      {activeTab === 'roster' && (
        <DataTable<DutyRosterRecord>
          title="Staff Duty Roster"
          subtitle="Hospital clinical and nursing duty rosters, shift schedules, and chamber assignments"
          data={filteredRoster}
          columns={rosterColumns}
          rowKey={(r) => r.id}
          searchable
          searchPlaceholder="Search roster staff, department, station..."
          searchFilter={(r, q) =>
            r.rosterNo.toLowerCase().includes(q) ||
            r.staffName.toLowerCase().includes(q) ||
            r.department.toLowerCase().includes(q) ||
            r.chamberOrWard.toLowerCase().includes(q) ||
            r.role.toLowerCase().includes(q)
          }
          toolbarFilters={toolbarFilters}
          toolbarActions={toolbarActions}
          defaultPageSize={8}
          pageSizeOptions={[8, 12, 20, 30, 50, 100]}
          emptyTitle="No duty roster records found"
          emptyDescription="There are currently no staff roster entries matching your filter."
        />
      )}

      {activeTab === 'matrix' && (
        <div className="bg-white border border-slate-300 rounded-[3px] p-3 space-y-3">
          <div className="flex items-center justify-between border-b border-slate-200 pb-2">
            <div>
              <h3 className="text-xs font-bold text-slate-900">
                Weekly Departmental Roster Distribution Matrix
              </h3>
              <p className="text-[10.5px] text-slate-500">
                Coverage across morning, evening, and night duty stations for key hospital units.
              </p>
            </div>
            <span className="text-xs font-bold text-[#006a4e]">
              20 Nov - 26 Nov 2026
            </span>
          </div>

          <div className="overflow-x-auto table-hover-scrollbar">
            <table className="w-full text-left text-[11px] border-collapse min-w-[700px]">
              <thead>
                <tr className="bg-[#f1f5f9] text-slate-700 font-bold border-b border-slate-200 text-[10.5px]">
                  <th className="py-2 px-2.5 border-r border-slate-200/60">Department</th>
                  <th className="py-2 px-2.5 border-r border-slate-200/60">Morning (08:00-14:00)</th>
                  <th className="py-2 px-2.5 border-r border-slate-200/60">Evening (14:00-20:00)</th>
                  <th className="py-2 px-2.5 border-r border-slate-200/60">Night (20:00-08:00)</th>
                  <th className="py-2 px-2.5 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                <tr className="hover:bg-slate-50 transition-colors">
                  <td className="py-1.5 px-2.5 border-r border-slate-200/60 font-bold text-slate-900">
                    Cardiology &amp; CCU
                  </td>
                  <td className="py-1.5 px-2.5 border-r border-slate-200/60 text-slate-800">
                    Dr. Reyan Jain, Nurse Shikha Rani
                  </td>
                  <td className="py-1.5 px-2.5 border-r border-slate-200/60 text-slate-700">
                    Dr. Mahmudul Hasan
                  </td>
                  <td className="py-1.5 px-2.5 border-r border-slate-200/60 text-slate-700">
                    Dr. Tanvir Ahmed (On-Call)
                  </td>
                  <td className="py-1.5 px-2.5 text-center">
                    <span className="px-1.5 py-0.5 rounded-[3px] bg-emerald-50 text-emerald-800 border border-emerald-200 text-[9.5px] font-semibold">
                      Full Staffed
                    </span>
                  </td>
                </tr>
                <tr className="hover:bg-slate-50 transition-colors">
                  <td className="py-1.5 px-2.5 border-r border-slate-200/60 font-bold text-slate-900">
                    Emergency &amp; Trauma
                  </td>
                  <td className="py-1.5 px-2.5 border-r border-slate-200/60 text-slate-800">
                    Nurse Taslima Akter, TMO Team
                  </td>
                  <td className="py-1.5 px-2.5 border-r border-slate-200/60 text-slate-700">
                    Dr. Sajjad Hossain
                  </td>
                  <td className="py-1.5 px-2.5 border-r border-slate-200/60 text-slate-700">
                    Dr. Tariqul Anwar (Trauma Lead)
                  </td>
                  <td className="py-1.5 px-2.5 text-center">
                    <span className="px-1.5 py-0.5 rounded-[3px] bg-emerald-50 text-emerald-800 border border-emerald-200 text-[9.5px] font-semibold">
                      Full Staffed
                    </span>
                  </td>
                </tr>
                <tr className="hover:bg-slate-50 transition-colors">
                  <td className="py-1.5 px-2.5 border-r border-slate-200/60 font-bold text-slate-900">
                    Orthopedic Surgery &amp; OT
                  </td>
                  <td className="py-1.5 px-2.5 border-r border-slate-200/60 text-slate-800">
                    Dr. Kamrul Islam (OT 02)
                  </td>
                  <td className="py-1.5 px-2.5 border-r border-slate-200/60 text-slate-700">
                    Post-Op Ward Nurse
                  </td>
                  <td className="py-1.5 px-2.5 border-r border-slate-200/60 text-slate-700">
                    Emergency Standby
                  </td>
                  <td className="py-1.5 px-2.5 text-center">
                    <span className="px-1.5 py-0.5 rounded-[3px] bg-emerald-50 text-emerald-800 border border-emerald-200 text-[9.5px] font-semibold">
                      Full Staffed
                    </span>
                  </td>
                </tr>
                <tr className="hover:bg-slate-50 transition-colors">
                  <td className="py-1.5 px-2.5 border-r border-slate-200/60 font-bold text-slate-900">
                    Pediatrics &amp; Neonatal
                  </td>
                  <td className="py-1.5 px-2.5 border-r border-slate-200/60 text-slate-800">
                    NICU Staff On Duty
                  </td>
                  <td className="py-1.5 px-2.5 border-r border-slate-200/60 text-slate-700">
                    Dr. Nafisa Chowdhury
                  </td>
                  <td className="py-1.5 px-2.5 border-r border-slate-200/60 text-slate-700">
                    Night Pediatric MO
                  </td>
                  <td className="py-1.5 px-2.5 text-center">
                    <span className="px-1.5 py-0.5 rounded-[3px] bg-emerald-50 text-emerald-800 border border-emerald-200 text-[9.5px] font-semibold">
                      Full Staffed
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'shifts' && (
        <div className="bg-white border border-slate-300 rounded-[3px] p-3 space-y-3">
          <div className="flex items-center justify-between border-b border-slate-200 pb-2">
            <div>
              <h3 className="text-xs font-bold text-slate-900">
                Hospital Standard Shift Configuration
              </h3>
              <p className="text-[10.5px] text-slate-500">
                Default shift windows, hours calculation, and staff allocation quota.
              </p>
            </div>
            <span className="text-xs font-bold text-[#0094b6]">
              5 Standard Shifts Configured
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            {shifts.map((sh) => (
              <div
                key={sh.id}
                className="p-3 border border-slate-200 rounded-[3px] bg-slate-50/50 flex flex-col justify-between space-y-2"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900">{sh.shiftName}</span>
                  <span className={`px-1.5 py-0.5 rounded-[3px] text-[10px] font-semibold border ${sh.colorClass}`}>
                    {sh.durationHours} Hours
                  </span>
                </div>
                <div className="text-[11px] text-slate-600 font-mono">
                  {sh.startTime} - {sh.endTime}
                </div>
                <div className="pt-2 border-t border-slate-200/80 flex items-center justify-between text-[10.5px]">
                  <span className="text-slate-500">Allocated Staff:</span>
                  <span className="font-bold text-slate-900">{sh.totalAssigned} Personals</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modal: Assign Duty */}
      {showAssignModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/40 backdrop-blur-xs flex items-center justify-center p-3">
          <div className="bg-white rounded-[3px] border border-slate-300 shadow-xl w-full max-w-xl p-3.5 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-200 pb-2">
              <div className="flex items-center gap-1.5">
                <UserPlus className="w-4 h-4 text-[#0094b6]" />
                <h3 className="text-xs font-bold text-slate-900">
                  Assign Staff Duty Shift
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowAssignModal(false)}
                className="w-5 h-5 rounded-[3px] text-slate-400 hover:text-slate-700 flex items-center justify-center cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            <form onSubmit={handleAssignSubmit} className="space-y-2.5 text-[11px]">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[10.5px] font-semibold text-slate-700 mb-0.5">
                    Staff Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formStaffName}
                    onChange={(e) => setFormStaffName(e.target.value)}
                    placeholder="e.g. Dr. Sabrina Karim"
                    className="w-full h-7 px-2 border border-slate-300 rounded-[3px] text-[11px] focus:outline-none focus:border-[#0094b6]"
                  />
                </div>

                <div>
                  <label className="block text-[10.5px] font-semibold text-slate-700 mb-0.5">
                    Staff ID
                  </label>
                  <input
                    type="text"
                    value={formStaffId}
                    onChange={(e) => setFormStaffId(e.target.value)}
                    className="w-full h-7 px-2 border border-slate-300 rounded-[3px] text-[11px] focus:outline-none font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[10.5px] font-semibold text-slate-700 mb-0.5">
                    Designation / Role
                  </label>
                  <select
                    value={formRole}
                    onChange={(e) => setFormRole(e.target.value as any)}
                    className="w-full h-7 px-2 border border-slate-300 rounded-[3px] bg-white text-[11px] focus:outline-none"
                  >
                    <option value="Consultant Doctor">Consultant Doctor</option>
                    <option value="Specialist">Specialist</option>
                    <option value="Senior Medical Officer">Senior Medical Officer</option>
                    <option value="Staff Nurse">Staff Nurse</option>
                    <option value="ICU Incharge">ICU Incharge</option>
                    <option value="Pharmacist">Pharmacist</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10.5px] font-semibold text-slate-700 mb-0.5">
                    Department
                  </label>
                  <select
                    value={formDept}
                    onChange={(e) => setFormDept(e.target.value)}
                    className="w-full h-7 px-2 border border-slate-300 rounded-[3px] bg-white text-[11px] focus:outline-none"
                  >
                    <option value="Cardiology">Cardiology</option>
                    <option value="Gynecology &amp; Obs">Gynecology &amp; Obs</option>
                    <option value="Orthopedic Surgery">Orthopedic Surgery</option>
                    <option value="Neuromedicine">Neuromedicine</option>
                    <option value="Pediatrics">Pediatrics</option>
                    <option value="ICU / CCU">ICU / CCU</option>
                    <option value="Emergency &amp; Trauma">Emergency &amp; Trauma</option>
                    <option value="Radiology &amp; Imaging">Radiology &amp; Imaging</option>
                    <option value="Pharmacy Dispensary">Pharmacy Dispensary</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-[10.5px] font-semibold text-slate-700 mb-0.5">
                    Shift Window *
                  </label>
                  <select
                    value={formShift}
                    onChange={(e) => setFormShift(e.target.value as any)}
                    className="w-full h-7 px-2 border border-slate-300 rounded-[3px] bg-white text-[11px] focus:outline-none"
                  >
                    <option value="Morning (08:00 - 14:00)">Morning (08:00 - 14:00)</option>
                    <option value="Evening (14:00 - 20:00)">Evening (14:00 - 20:00)</option>
                    <option value="Night (20:00 - 08:00)">Night (20:00 - 08:00)</option>
                    <option value="General (09:00 - 17:00)">General (09:00 - 17:00)</option>
                    <option value="24/7 On-Call Emergency">24/7 On-Call Emergency</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10.5px] font-semibold text-slate-700 mb-0.5">
                    Station / Chamber
                  </label>
                  <input
                    type="text"
                    value={formChamber}
                    onChange={(e) => setFormChamber(e.target.value)}
                    placeholder="Ch-101 or ICU Bed"
                    className="w-full h-7 px-2 border border-slate-300 rounded-[3px] text-[11px] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[10.5px] font-semibold text-slate-700 mb-0.5">
                    Hospital Campus
                  </label>
                  <select
                    value={formCampus}
                    onChange={(e) => setFormCampus(e.target.value)}
                    className="w-full h-7 px-2 border border-slate-300 rounded-[3px] bg-white text-[11px] focus:outline-none"
                  >
                    <option value="Dhanmondi">Dhanmondi Main</option>
                    <option value="Uttara">Uttara Annex</option>
                    <option value="Mirpur">Mirpur Hub</option>
                  </select>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end gap-1.5 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setShowAssignModal(false)}
                  className="h-7 px-2.5 border border-slate-300 rounded-[3px] text-[11px] text-slate-700 hover:bg-slate-100 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="h-7 px-3 bg-[#0094b6] hover:bg-[#007f9c] text-white rounded-[3px] text-[11px] font-semibold cursor-pointer shadow-xs"
                >
                  Save Duty Assignment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Shift Handover */}
      {showHandoverModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/40 backdrop-blur-xs flex items-center justify-center p-3">
          <div className="bg-white rounded-[3px] border border-slate-300 shadow-xl w-full max-w-md p-3.5 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-200 pb-2">
              <div className="flex items-center gap-1.5">
                <ArrowLeftRight className="w-4 h-4 text-[#006a4e]" />
                <h3 className="text-xs font-bold text-slate-900">
                  Record Shift Handover Briefing
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowHandoverModal(false)}
                className="w-5 h-5 rounded-[3px] text-slate-400 hover:text-slate-700 flex items-center justify-center cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                setShowHandoverModal(false);
              }}
              className="space-y-2.5 text-[11px]"
            >
              <div>
                <label className="block text-[10.5px] font-semibold text-slate-700 mb-0.5">
                  Outgoing Staff (Current Shift)
                </label>
                <input
                  type="text"
                  value={handoverFrom}
                  onChange={(e) => setHandoverFrom(e.target.value)}
                  className="w-full h-7 px-2 border border-slate-300 rounded-[3px] text-[11px] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[10.5px] font-semibold text-slate-700 mb-0.5">
                  Incoming Staff (Relieving Shift)
                </label>
                <input
                  type="text"
                  value={handoverTo}
                  onChange={(e) => setHandoverTo(e.target.value)}
                  className="w-full h-7 px-2 border border-slate-300 rounded-[3px] text-[11px] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[10.5px] font-semibold text-slate-700 mb-0.5">
                  Clinical Handover Notes / High Alert Patients
                </label>
                <textarea
                  rows={3}
                  value={handoverNotes}
                  onChange={(e) => setHandoverNotes(e.target.value)}
                  className="w-full p-2 border border-slate-300 rounded-[3px] text-[11px] focus:outline-none"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-1.5 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setShowHandoverModal(false)}
                  className="h-7 px-2.5 border border-slate-300 rounded-[3px] text-[11px] text-slate-700 hover:bg-slate-100 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="h-7 px-3 bg-[#006a4e] hover:bg-[#00523c] text-white rounded-[3px] text-[11px] font-semibold cursor-pointer shadow-xs"
                >
                  Confirm Shift Handover
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default DutyRosterDirectory;
