import {
  AlertCircle,
  CalendarCheck2,
  Check,
  Clock,
  DollarSign,
  Eye,
  List,
  MoreVertical,
  Phone,
  Plus,
  Printer,
  Stethoscope,
  Trash2,
  User,
  UserCheck,
  Users,
  X,
} from 'lucide-react';
import React, { useEffect, useMemo, useState } from 'react';
import {
  AppointmentTab,
  SMART_APPOINTMENT_RECORDS,
  SmartAppointmentPriority,
  SmartAppointmentRecord,
  SmartAppointmentSource,
  SmartAppointmentStatus,
} from '../../../data/superadminAppointmentsData';
import { DataTable, DataTableColumn } from '../../common/DataTable';
import { DropdownSelect } from '../../common/DropdownSelect';

const DOCTOR_OPTIONS = [
  { name: 'Reyan Jain', staffId: '9011', fee: 147.60 },
  { name: 'Dr. Mahmudul Hasan', staffId: '9012', fee: 150.00 },
  { name: 'Dr. Farhana Yasmin', staffId: '9013', fee: 120.00 },
  { name: 'Dr. Kamrul Islam', staffId: '9014', fee: 120.00 },
  { name: 'Dr. Tariqul Anwar', staffId: '9015', fee: 100.00 },
  { name: 'Dr. Nafisa Chowdhury', staffId: '9016', fee: 150.00 },
  { name: 'Dr. Sabrina Karim', staffId: '9017', fee: 100.00 },
  { name: 'Dr. Rubina Parvin', staffId: '9018', fee: 120.00 },
  { name: 'Dr. Sajjad Hossain', staffId: '9019', fee: 100.00 },
  { name: 'Dr. Zakir Hossain', staffId: '9020', fee: 150.00 },
];

const STATUS_BADGE_MAP: Record<SmartAppointmentStatus, string> = {
  Approved: 'bg-[#edf6f2] text-[#006a4e] border-[#006a4e]/20',
  Pending: 'bg-amber-50 text-amber-700 border-amber-200',
  Cancel: 'bg-rose-50 text-rose-700 border-rose-200',
};

const PRIORITY_BADGE_MAP: Record<SmartAppointmentPriority, string> = {
  Normal: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
  Urgent: 'bg-amber-50 text-amber-700 border border-amber-200',
  'Very Urgent': 'bg-rose-50 text-rose-700 border border-rose-200',
  Low: 'bg-slate-100 text-slate-600 border border-slate-200',
};

export const AppointmentDirectory: React.FC = () => {
  const [activeTab, setActiveTab] = useState<AppointmentTab>('today');
  const [selectedDoctorFilter, setSelectedDoctorFilter] = useState<string>('All');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [priorityFilter, setPriorityFilter] = useState<string>('All');
  const [viewMode, setViewMode] = useState<'table' | 'doctor-wise' | 'queue'>('table');
  const [appointments, setAppointments] =
    useState<SmartAppointmentRecord[]>(SMART_APPOINTMENT_RECORDS);
  const [selectedRecord, setSelectedRecord] =
    useState<SmartAppointmentRecord | null>(null);
  const [activeActionId, setActiveActionId] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);

  // New appointment form state
  const [patientName, setPatientName] = useState('');
  const [phone, setPhone] = useState('+880 17');
  const [gender, setGender] = useState<'Male' | 'Female'>('Female');
  const [doctorIndex, setDoctorIndex] = useState(0);
  const [source, setSource] = useState<SmartAppointmentSource>('Offline');
  const [priority, setPriority] = useState<SmartAppointmentPriority>('Normal');
  const [liveConsultant, setLiveConsultant] = useState<'Yes' | 'No'>('No');
  const [date, setDate] = useState('20/11/2026 02:00 PM');
  const [alternateAddress, setAlternateAddress] = useState('');
  const [fees, setFees] = useState('147.60');

  useEffect(() => {
    const handleOutside = () => setActiveActionId(null);
    window.addEventListener('click', handleOutside);
    return () => window.removeEventListener('click', handleOutside);
  }, []);

  // 4 Top Metrics exactly matching PatientDirectory format
  const stats = useMemo(() => {
    return {
      total: appointments.length,
      approved: appointments.filter((a) => a.status === 'Approved').length,
      pending: appointments.filter((a) => a.status === 'Pending').length,
      cancelled: appointments.filter((a) => a.status === 'Cancel').length,
    };
  }, [appointments]);

  const filteredAppointments = useMemo(() => {
    return appointments.filter((a) => {
      const matchTab = a.tab === activeTab;
      const matchDoc =
        selectedDoctorFilter === 'All' || a.doctorStaffId === selectedDoctorFilter;
      const matchStatus =
        statusFilter === 'All' || a.status === statusFilter;
      const matchPriority =
        priorityFilter === 'All' || a.priority === priorityFilter;
      return matchTab && matchDoc && matchStatus && matchPriority;
    });
  }, [appointments, activeTab, selectedDoctorFilter, statusFilter, priorityFilter]);

  const handleCreateAppointment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!patientName.trim()) return;

    const doc = DOCTOR_OPTIONS[doctorIndex];
    const nextSeq = 7893 + appointments.length;
    const feeNum = Number(fees) || doc.fee;
    const newRecord: SmartAppointmentRecord = {
      id: `apt-${Date.now()}`,
      patientName: `${patientName.trim()} (${1070 + appointments.length})`,
      patientRawName: patientName.trim(),
      patientId: `${1070 + appointments.length}`,
      appointmentNo: `APPNO${nextSeq}`,
      date,
      phone: phone.trim() || '+880 1711-223344',
      gender,
      doctor: `${doc.name} (${doc.staffId})`,
      doctorRawName: doc.name,
      doctorStaffId: doc.staffId,
      source,
      priority,
      liveConsultant,
      alternateAddress,
      fees: feeNum,
      status: 'Approved',
      discountPercent: 0,
      discountAmount: 0,
      paid: feeNum,
      tab: activeTab,
      createdBy: 'Super Admin (9001)',
    };

    setAppointments((prev) => [newRecord, ...prev]);
    setSelectedRecord(newRecord);
    setShowAddForm(false);
    setPatientName('');
    setPhone('+880 17');
  };

  const handleStatusChange = (
    appointmentId: string,
    nextStatus: SmartAppointmentStatus
  ) => {
    setAppointments((prev) =>
      prev.map((item) =>
        item.id === appointmentId ? { ...item, status: nextStatus } : item
      )
    );
    setSelectedRecord((prev) =>
      prev && prev.id === appointmentId ? { ...prev, status: nextStatus } : prev
    );
  };

  const handleDelete = (appointmentId: string) => {
    setAppointments((prev) => prev.filter((a) => a.id !== appointmentId));
    if (selectedRecord && selectedRecord.id === appointmentId) {
      setSelectedRecord(null);
    }
  };

  const columns: DataTableColumn<SmartAppointmentRecord>[] = [
    {
      key: 'appointmentNo',
      header: 'Appointment No',
      sortable: true,
      sortValue: (r) => r.appointmentNo,
      render: (r) => (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setSelectedRecord(r);
          }}
          className="text-[#006a4e] hover:underline font-bold text-left cursor-pointer whitespace-nowrap"
        >
          {r.appointmentNo}
        </button>
      ),
    },
    {
      key: 'patientName',
      header: 'Patient Name',
      sortable: true,
      sortValue: (r) => r.patientName,
      render: (r) => (
        <div>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setSelectedRecord(r);
            }}
            className="text-slate-900 font-semibold hover:text-[#006a4e] hover:underline text-left cursor-pointer whitespace-nowrap block"
          >
            {r.patientName}
          </button>
          <span className="text-[10px] text-slate-500">ID: {r.patientId}</span>
        </div>
      ),
    },
    {
      key: 'date',
      header: 'Date & Time',
      sortable: true,
      sortValue: (r) => r.date,
      render: (r) => (
        <span className="text-slate-700 whitespace-nowrap font-medium text-xs">
          {r.date}
        </span>
      ),
    },
    {
      key: 'phone',
      header: 'Mobile Contact',
      render: (r) => (
        <span className="text-slate-600 whitespace-nowrap">{r.phone}</span>
      ),
    },
    {
      key: 'gender',
      header: 'Gender',
      align: 'center',
      sortable: true,
      sortValue: (r) => r.gender,
      render: (r) => r.gender,
    },
    {
      key: 'doctor',
      header: 'Consultant Doctor',
      sortable: true,
      sortValue: (r) => r.doctor,
      render: (r) => (
        <span className="text-slate-800 font-medium whitespace-nowrap">
          {r.doctor}
        </span>
      ),
    },
    {
      key: 'source',
      header: 'Source',
      align: 'center',
      render: (r) => (
        <span className="px-1.5 py-0.5 rounded-[3px] text-[10.5px] bg-slate-100 text-slate-700 font-medium">
          {r.source}
        </span>
      ),
    },
    {
      key: 'priority',
      header: 'Priority',
      align: 'center',
      sortable: true,
      sortValue: (r) => r.priority,
      render: (r) => (
        <span
          className={`px-1.5 py-0.5 rounded-[3px] text-[10px] font-semibold ${PRIORITY_BADGE_MAP[r.priority] || PRIORITY_BADGE_MAP.Normal
            }`}
        >
          {r.priority}
        </span>
      ),
    },
    {
      key: 'liveConsultant',
      header: 'Live Teleconsult',
      align: 'center',
      render: (r) => (
        <span
          className={`px-1.5 py-0.5 rounded-[3px] text-[10px] font-semibold ${r.liveConsultant === 'Yes'
            ? 'bg-cyan-50 text-cyan-700 border border-cyan-200'
            : 'text-slate-400'
            }`}
        >
          {r.liveConsultant}
        </span>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      align: 'center',
      sortable: true,
      sortValue: (r) => r.status,
      render: (r) => (
        <span
          className={`px-2 py-0.5 rounded-[3px] border text-[11px] font-semibold whitespace-nowrap ${STATUS_BADGE_MAP[r.status] || STATUS_BADGE_MAP.Pending
            }`}
        >
          {r.status}
        </span>
      ),
    },
    {
      key: 'fees',
      header: 'Fees ($)',
      align: 'right',
      sortable: true,
      sortValue: (r) => r.fees,
      render: (r) => (
        <span className="font-semibold text-slate-900">${r.fees.toFixed(2)}</span>
      ),
    },
    {
      key: 'paid',
      header: 'Paid ($)',
      align: 'right',
      sortable: true,
      sortValue: (r) => r.paid,
      render: (r) => (
        <span className="font-semibold text-emerald-700">${r.paid.toFixed(2)}</span>
      ),
    },
    {
      key: 'actions',
      header: 'Action',
      align: 'center',
      render: (r, idx?: number) => {
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
                      setSelectedRecord(r);
                      setActiveActionId(null);
                    }}
                    className="w-full text-left px-2.5 py-1.5 text-[11px] text-slate-700 hover:bg-[#edf6f2] hover:text-[#006a4e] font-medium flex items-center gap-2 cursor-pointer transition-colors"
                  >
                    <Eye className="w-3.5 h-3.5 text-[#006a4e]" />
                    <span>View Slip</span>
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
                    <span>Print Token</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      const next: SmartAppointmentStatus =
                        r.status === 'Approved' ? 'Pending' : 'Approved';
                      handleStatusChange(r.id, next);
                      setActiveActionId(null);
                    }}
                    className="w-full text-left px-2.5 py-1.5 text-[11px] text-slate-700 hover:bg-slate-50 font-medium flex items-center gap-2 cursor-pointer transition-colors"
                  >
                    <Check className="w-3.5 h-3.5 text-slate-500" />
                    <span>Toggle Status</span>
                  </button>
                </div>
                <div className="py-0.5">
                  <button
                    type="button"
                    onClick={() => {
                      handleDelete(r.id);
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

  // Toolbar Filters with DropdownSelect component matching PatientDirectory
  const toolbarFilters = (
    <>
      <DropdownSelect
        value={activeTab}
        onChange={(val) => setActiveTab(val as AppointmentTab)}
        width="w-44"
        options={[
          { label: "Today's Appointments", value: 'today' },
          { label: 'Upcoming Appointments', value: 'upcoming' },
          { label: 'Old / Past Appointments', value: 'old' },
        ]}
      />

      <DropdownSelect
        value={selectedDoctorFilter}
        onChange={(val) => setSelectedDoctorFilter(val)}
        width="w-48"
        options={[
          { label: 'All Doctors', value: 'All' },
          ...DOCTOR_OPTIONS.map((d) => ({
            label: d.name,
            value: d.staffId,
          })),
        ]}
      />

      <DropdownSelect
        value={statusFilter}
        onChange={(val) => setStatusFilter(val)}
        width="w-36"
        options={[
          { label: 'All Statuses', value: 'All' },
          { label: 'Approved', value: 'Approved' },
          { label: 'Pending', value: 'Pending' },
          { label: 'Cancel', value: 'Cancel' },
        ]}
      />

      <DropdownSelect
        value={priorityFilter}
        onChange={(val) => setPriorityFilter(val)}
        width="w-36"
        options={[
          { label: 'All Priorities', value: 'All' },
          { label: 'Normal', value: 'Normal' },
          { label: 'Urgent', value: 'Urgent' },
          { label: 'Very Urgent', value: 'Very Urgent' },
        ]}
      />
    </>
  );

  return (
    <div className="space-y-2">
      {/* 4 Summary Metric Cards matching PatientDirectory layout and style */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
        <div className="bg-white rounded-[3px] p-2.5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[10.5px] font-bold text-slate-700">Total Appointments</span>
            <CalendarCheck2 className="w-3.5 h-3.5 text-[#006a4e]" />
          </div>
          <div className="my-1">
            <span className="text-base font-extrabold text-slate-900 leading-none">
              {stats.total}
            </span>
          </div>
          <p className="text-[10px] text-slate-500">Across today, upcoming &amp; past bookings</p>
        </div>

        <div className="bg-white rounded-[3px] p-2.5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[10.5px] font-bold text-slate-700">Approved Appointments</span>
            <UserCheck className="w-3.5 h-3.5 text-[#006a4e]" />
          </div>
          <div className="my-1">
            <span className="text-base font-extrabold text-[#006a4e] leading-none">
              {stats.approved}
            </span>
          </div>
          <p className="text-[10px] text-slate-500">Confirmed specialist visits</p>
        </div>

        <div className="bg-white rounded-[3px] p-2.5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[10.5px] font-bold text-slate-700">Pending Verification</span>
            <Clock className="w-3.5 h-3.5 text-amber-600" />
          </div>
          <div className="my-1">
            <span className="text-base font-extrabold text-amber-600 leading-none">
              {stats.pending}
            </span>
          </div>
          <p className="text-[10px] text-slate-500">Awaiting front desk verification</p>
        </div>

        <div className="bg-white rounded-[3px] p-2.5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[10.5px] font-bold text-slate-700">Cancelled / Dropped</span>
            <AlertCircle className="w-3.5 h-3.5 text-rose-500" />
          </div>
          <div className="my-1">
            <span className="text-base font-extrabold text-slate-900 leading-none">
              {stats.cancelled}
            </span>
          </div>
          <p className="text-[10px] text-slate-500">Rescheduled or patient dropped visits</p>
        </div>
      </div>

      {/* Inline Register New Appointment Form matching PatientDirectory showAddForm */}
      {showAddForm && (
        <form
          onSubmit={handleCreateAppointment}
          className="bg-white border border-slate-200/90 rounded-md p-4 space-y-3.5"
        >
          <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
            <div className="flex items-center gap-2">
              <span className="w-7 h-7 rounded-[3px] bg-[#edf6f2] text-[#006a4e] flex items-center justify-center">
                <CalendarCheck2 className="w-4 h-4" />
              </span>
              <div>
                <h3 className="text-sm font-semibold text-slate-900">Add New Appointment</h3>
                <p className="text-[11px] text-slate-500">
                  Assigns a new token and adds the booking directly to the specialist queue
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="w-7 h-7 rounded-[3px] text-slate-400 hover:text-slate-600 hover:bg-slate-100 flex items-center justify-center cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
            <div className="lg:col-span-2">
              <label className="block text-[11px] font-medium text-slate-600 mb-1">
                Patient Full Name *
              </label>
              <input
                type="text"
                required
                value={patientName}
                onChange={(e) => setPatientName(e.target.value)}
                placeholder="e.g. Tanvir Ahmed"
                className="w-full h-9 px-2.5 rounded-[3px] border border-slate-200 text-xs text-slate-800 focus:outline-hidden focus:border-[#006a4e]"
              />
            </div>

            <div>
              <label className="block text-[11px] font-medium text-slate-600 mb-1">
                Phone Number *
              </label>
              <input
                type="text"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+880 17XX-XXXXXX"
                className="w-full h-9 px-2.5 rounded-[3px] border border-slate-200 text-xs text-slate-800 focus:outline-hidden focus:border-[#006a4e]"
              />
            </div>

            <div>
              <label className="block text-[11px] font-medium text-slate-600 mb-1">Gender</label>
              <DropdownSelect
                value={gender}
                onChange={(val) => setGender(val as 'Male' | 'Female')}
                options={['Male', 'Female']}
                size="md"
                width="w-full"
              />
            </div>

            <div>
              <label className="block text-[11px] font-medium text-slate-600 mb-1">
                Consultant Doctor *
              </label>
              <DropdownSelect
                value={String(doctorIndex)}
                onChange={(val) => {
                  const idx = Number(val);
                  setDoctorIndex(idx);
                  setFees(DOCTOR_OPTIONS[idx].fee.toFixed(2));
                }}
                options={DOCTOR_OPTIONS.map((d, i) => ({
                  label: `${d.name} (${d.staffId})`,
                  value: String(i),
                }))}
                size="md"
                width="w-full"
              />
            </div>

            <div>
              <label className="block text-[11px] font-medium text-slate-600 mb-1">
                Appointment Date &amp; Time
              </label>
              <input
                type="text"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full h-9 px-2.5 rounded-[3px] border border-slate-200 text-xs text-slate-800 focus:outline-hidden focus:border-[#006a4e]"
              />
            </div>

            <div>
              <label className="block text-[11px] font-medium text-slate-600 mb-1">Source</label>
              <DropdownSelect
                value={source}
                onChange={(val) => setSource(val as SmartAppointmentSource)}
                options={['Offline', 'Online']}
                size="md"
                width="w-full"
              />
            </div>

            <div>
              <label className="block text-[11px] font-medium text-slate-600 mb-1">Priority</label>
              <DropdownSelect
                value={priority}
                onChange={(val) => setPriority(val as SmartAppointmentPriority)}
                options={['Normal', 'Urgent', 'Very Urgent', 'Low']}
                size="md"
                width="w-full"
              />
            </div>

            <div>
              <label className="block text-[11px] font-medium text-slate-600 mb-1">
                Live Consultant
              </label>
              <DropdownSelect
                value={liveConsultant}
                onChange={(val) => setLiveConsultant(val as 'Yes' | 'No')}
                options={['No', 'Yes']}
                size="md"
                width="w-full"
              />
            </div>

            <div>
              <label className="block text-[11px] font-medium text-slate-600 mb-1">
                Consultation Fees ($)
              </label>
              <input
                type="text"
                value={fees}
                onChange={(e) => setFees(e.target.value)}
                className="w-full h-9 px-2.5 rounded-[3px] border border-slate-200 text-xs text-slate-800 focus:outline-hidden focus:border-[#006a4e] font-semibold"
              />
            </div>

            <div>
              <label className="block text-[11px] font-medium text-slate-600 mb-1">
                Address / Remarks
              </label>
              <input
                type="text"
                value={alternateAddress}
                onChange={(e) => setAlternateAddress(e.target.value)}
                placeholder="e.g. Dhanmondi, Dhaka"
                className="w-full h-9 px-2.5 rounded-[3px] border border-slate-200 text-xs text-slate-800 focus:outline-hidden focus:border-[#006a4e]"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-1 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="h-9 px-3 rounded-[3px] border border-slate-200 text-xs font-medium text-slate-600 hover:bg-slate-50 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="h-9 px-4 rounded-[3px] bg-[#006a4e] hover:bg-[#00553e] text-white text-xs font-semibold cursor-pointer transition-colors"
            >
              Save Appointment
            </button>
          </div>
        </form>
      )}

      {/* Selected Appointment Quick View Card matching Patient Directory */}
      {selectedRecord && (
        <div className="bg-white border border-[#006a4e]/25 rounded-md p-4">
          <div className="flex flex-wrap items-start justify-between gap-3 border-b border-slate-100 pb-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-[3px] bg-[#edf6f2] text-[#006a4e] font-bold text-sm flex items-center justify-center shrink-0">
                {selectedRecord.patientName.slice(0, 2)}
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="text-sm font-semibold text-slate-900">
                    {selectedRecord.patientName}
                  </h3>
                  <span className="px-2 py-0.5 rounded-[3px] bg-slate-100 text-slate-700 text-[11px] font-medium">
                    {selectedRecord.appointmentNo}
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded-[3px] border text-[11px] font-semibold ${STATUS_BADGE_MAP[selectedRecord.status] || STATUS_BADGE_MAP.Pending
                      }`}
                  >
                    {selectedRecord.status}
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  Slot: {selectedRecord.date} · Consultant: {selectedRecord.doctor} · Priority: {selectedRecord.priority}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <DropdownSelect
                value={selectedRecord.status}
                onChange={(val) =>
                  handleStatusChange(selectedRecord.id, val as SmartAppointmentStatus)
                }
                options={['Approved', 'Pending', 'Cancel']}
                width="w-32"
              />

              <button
                type="button"
                onClick={() => window.print()}
                className="h-8 px-2.5 rounded-[3px] border border-slate-200 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-700 inline-flex items-center gap-1.5 cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5 text-slate-500" />
                <span>Print Slip</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedRecord(null)}
                className="w-8 h-8 rounded-[3px] border border-slate-200 text-slate-500 hover:text-slate-800 hover:bg-slate-50 flex items-center justify-center cursor-pointer"
                aria-label="Close appointment quick view"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 text-xs">
            <div className="flex items-center gap-2">
              <Phone className="w-3.5 h-3.5 text-[#006a4e] shrink-0" />
              <div>
                <p className="text-[11px] text-slate-400">Mobile Contact</p>
                <p className="font-medium text-slate-800">{selectedRecord.phone}</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Stethoscope className="w-3.5 h-3.5 text-[#006a4e] shrink-0" />
              <div>
                <p className="text-[11px] text-slate-400">Consultant</p>
                <p className="font-medium text-slate-800">{selectedRecord.doctor}</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <DollarSign className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <div>
                <p className="text-[11px] text-slate-400">Fees / Paid</p>
                <p className="font-bold text-slate-900">
                  ${selectedRecord.fees.toFixed(2)} ·{' '}
                  <span className="text-emerald-700 font-bold">
                    Paid: ${selectedRecord.paid.toFixed(2)}
                  </span>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <User className="w-3.5 h-3.5 text-[#006a4e] shrink-0" />
              <div>
                <p className="text-[11px] text-slate-400">Source &amp; Priority</p>
                <p className="font-semibold text-slate-800">
                  {selectedRecord.source} · {selectedRecord.priority}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Doctor-wise grouped view */}
      {viewMode === 'doctor-wise' && (
        <div className="bg-white rounded-md border border-slate-200/80 shadow-2xs p-3 space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <h3 className="text-xs font-bold text-slate-800">
              Doctor-Wise Scheduled Consultations
            </h3>
            <span className="text-[11px] text-slate-500">
              Showing active bookings grouped by physician
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2.5">
            {DOCTOR_OPTIONS.map((doc) => {
              const docApts = appointments.filter(
                (a) => a.doctorStaffId === doc.staffId && a.tab === activeTab
              );
              return (
                <div
                  key={doc.staffId}
                  className="p-3 rounded-md border border-slate-200/80 hover:border-[#006a4e]/30 bg-slate-50/50 space-y-2 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">{doc.name}</h4>
                      <p className="text-[10px] text-slate-400">Staff ID: {doc.staffId} · Fee: ${doc.fee}</p>
                    </div>
                    <span className="px-2 py-0.5 rounded-full bg-[#edf6f2] text-[#006a4e] text-[11px] font-bold">
                      {docApts.length} slots
                    </span>
                  </div>

                  <div className="space-y-1 text-xs">
                    {docApts.slice(0, 3).map((a) => (
                      <div
                        key={a.id}
                        onClick={() => setSelectedRecord(a)}
                        className="p-1.5 rounded-[3px] bg-white border border-slate-100 hover:border-slate-300 flex items-center justify-between cursor-pointer"
                      >
                        <div className="truncate">
                          <span className="font-semibold text-slate-800 block truncate">
                            {a.patientName}
                          </span>
                          <span className="text-[10px] text-slate-400">{a.date}</span>
                        </div>
                        <span
                          className={`text-[10px] px-1.5 py-0.2 rounded-full font-semibold border ${STATUS_BADGE_MAP[a.status]
                            }`}
                        >
                          {a.status}
                        </span>
                      </div>
                    ))}
                    {docApts.length === 0 && (
                      <p className="text-[11px] text-slate-400 italic py-1">
                        No appointments booked for this doctor.
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Queue Token Mode */}
      {viewMode === 'queue' && (
        <div className="bg-white rounded-md border border-slate-200/80 shadow-2xs p-3 space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <h3 className="text-xs font-bold text-slate-800">
              Live Token Waiting Queue
            </h3>
            <span className="text-[11px] text-slate-500">
              Real-time sequence of arriving outpatients
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
            {filteredAppointments.map((a, idx) => (
              <div
                key={a.id}
                onClick={() => setSelectedRecord(a)}
                className="p-2.5 rounded-md border border-slate-200 hover:border-[#006a4e] bg-white shadow-2xs cursor-pointer text-center space-y-1 transition-colors"
              >
                <div className="text-[10px] text-slate-400 font-semibold">Token #{idx + 1}</div>
                <div className="text-sm font-bold text-[#006a4e] truncate">{a.appointmentNo}</div>
                <div className="text-xs font-semibold text-slate-800 truncate">{a.patientName}</div>
                <div className="text-[10px] text-slate-500 truncate">{a.doctorRawName}</div>
                <span
                  className={`inline-block px-1.5 py-0.2 rounded-[3px] text-[10px] font-semibold border ${STATUS_BADGE_MAP[a.status]
                    }`}
                >
                  {a.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* CarrierDirect-Style Reusable DataTable matching PatientDirectory */}
      {viewMode === 'table' && (
        <DataTable<SmartAppointmentRecord>
          data={filteredAppointments}
          columns={columns}
          rowKey={(row) => row.id}
          searchable
          searchPlaceholder="Search by appointment no, patient name, doctor, or phone..."
          searchFilter={(r, q) =>
            r.appointmentNo.toLowerCase().includes(q) ||
            r.patientName.toLowerCase().includes(q) ||
            r.doctor.toLowerCase().includes(q) ||
            r.phone.toLowerCase().includes(q)
          }
          toolbarFilters={toolbarFilters}
          headerActions={
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => setViewMode('doctor-wise')}
                className="h-8 px-2.5 rounded-[3px] border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold inline-flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <List className="w-3.5 h-3.5 text-slate-500" />
                <span>Doctor Wise</span>
              </button>

              <button
                type="button"
                onClick={() => setViewMode('queue')}
                className="h-8 px-2.5 rounded-[3px] border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold inline-flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Users className="w-3.5 h-3.5 text-slate-500" />
                <span>Queue</span>
              </button>

              <button
                type="button"
                onClick={() => setShowAddForm((prev) => !prev)}
                className="h-8 px-3 rounded-[3px] bg-[#006a4e] hover:bg-[#00553e] text-white text-xs font-semibold inline-flex items-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap shadow-2xs"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Appointment</span>
              </button>
            </div>
          }
          defaultPageSize={30}
          pageSizeOptions={[15, 30, 50, 100]}
          emptyTitle="No matching appointments found"
          emptyDescription="Try clearing the search query or selecting a different tab / doctor filter."
          onRowClick={(row) => setSelectedRecord(row)}
          showSerial={true}
        />
      )}
    </div>
  );
};
