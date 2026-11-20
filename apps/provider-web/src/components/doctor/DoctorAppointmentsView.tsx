import {
  CalendarCheck,
  CheckCircle2,
  Clock,
  FileText,
  Phone,
  Pill,
  Plus,
  Stethoscope,
  Video,
  X,
} from 'lucide-react';
import React, { useMemo, useState } from 'react';
import {
  DOCTOR_APPOINTMENTS,
  DoctorAppointment,
} from '../../data/doctorPortalData';
import { DataTable, DataTableColumn } from '../common/DataTable';
import { DropdownSelect } from '../common/DropdownSelect';
import { SummaryCard, SummaryCardGrid } from '../common/SummaryCard';
import { TableActionButtons } from '../common/TableActionButtons';

interface DoctorAppointmentsViewProps {
  onStartConsultation: (appointment: DoctorAppointment) => void;
  onOpenPrescription: (appointment: DoctorAppointment) => void;
}

export const DoctorAppointmentsView: React.FC<DoctorAppointmentsViewProps> = ({
  onStartConsultation,
  onOpenPrescription,
}) => {
  const [appointments, setAppointments] = useState<DoctorAppointment[]>(DOCTOR_APPOINTMENTS);
  const [typeFilter, setTypeFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedAppointment, setSelectedAppointment] = useState<DoctorAppointment | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);

  // New slot form state
  const [newPatientName, setNewPatientName] = useState('');
  const [newUhid, setNewUhid] = useState('');
  const [newAge, setNewAge] = useState('');
  const [newGender, setNewGender] = useState<'Male' | 'Female' | 'Other'>('Male');
  const [newSlotTime, setNewSlotTime] = useState('05:30 PM');
  const [newType, setNewType] = useState<DoctorAppointment['type']>('In-Person OPD');
  const [newChiefComplaint, setNewChiefComplaint] = useState('');
  const [newContact, setNewContact] = useState('');

  // 4 KPI Summary Cards matching PatientDirectory style
  const stats = useMemo(() => {
    const total = appointments.length;
    const inChamber = appointments.filter((a) => a.status === 'In Chamber').length;
    const waiting = appointments.filter((a) => a.status === 'Waiting').length;
    const completed = appointments.filter((a) => a.status === 'Completed').length;
    return { total, inChamber, waiting, completed };
  }, [appointments]);

  const filteredAppointments = useMemo(() => {
    return appointments.filter((apt) => {
      const matchesType = typeFilter === 'All' || apt.type === typeFilter;
      const matchesStatus = statusFilter === 'All' || apt.status === statusFilter;
      return matchesType && matchesStatus;
    });
  }, [appointments, typeFilter, statusFilter]);

  const handleAddNewAppointment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPatientName.trim()) return;

    const newApt: DoctorAppointment = {
      id: `apt-${Date.now()}`,
      tokenNo: `#${appointments.length + 1}`,
      uhid: newUhid || `UHID-2024-${Math.floor(1000 + Math.random() * 9000)}`,
      patientName: newPatientName.trim(),
      age: Number(newAge) || 40,
      gender: newGender,
      slotTime: newSlotTime,
      type: newType,
      status: 'Scheduled',
      chiefComplaint: newChiefComplaint || 'Routine cardiac consultation',
      contact: newContact || '+880 1700-000000',
      feeStatus: 'Paid',
    };

    setAppointments([newApt, ...appointments]);
    setShowAddModal(false);
    setNewPatientName('');
    setNewUhid('');
    setNewAge('');
    setNewChiefComplaint('');
    setNewContact('');
  };

  const handleUpdateStatus = (id: string, newStatus: DoctorAppointment['status']) => {
    setAppointments((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status: newStatus } : a))
    );
    if (selectedAppointment && selectedAppointment.id === id) {
      setSelectedAppointment((prev) => (prev ? { ...prev, status: newStatus } : null));
    }
  };

  const columns: DataTableColumn<DoctorAppointment>[] = [
    {
      key: 'tokenNo',
      header: 'Token',
      sortable: true,
      sortValue: (r) => r.tokenNo,
      render: (r) => (
        <span className="font-extrabold text-[#006a4e]">
          {r.tokenNo}
        </span>
      ),
    },
    {
      key: 'slotTime',
      header: 'Slot Time',
      sortable: true,
      sortValue: (r) => r.slotTime,
      render: (r) => (
        <span className="font-semibold text-slate-800 whitespace-nowrap">
          {r.slotTime}
        </span>
      ),
    },
    {
      key: 'patientName',
      header: 'Patient Name & UHID',
      sortable: true,
      sortValue: (r) => r.patientName,
      render: (r) => (
        <div>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setSelectedAppointment(r);
            }}
            className="text-slate-900 font-bold hover:text-[#006a4e] hover:underline text-left cursor-pointer whitespace-nowrap block"
          >
            {r.patientName}
          </button>
          <span className="text-[10px] text-slate-500">
            {r.uhid} • {r.age} yrs • {r.gender}
          </span>
        </div>
      ),
    },
    {
      key: 'chiefComplaint',
      header: 'Chief Complaint',
      render: (r) => (
        <span className="text-slate-600 line-clamp-1 max-w-xs block" title={r.chiefComplaint}>
          {r.chiefComplaint}
        </span>
      ),
    },
    {
      key: 'type',
      header: 'Consultation Type',
      sortable: true,
      sortValue: (r) => r.type,
      render: (r) => (
        <span
          className={`px-2 py-0.5 rounded-[3px] text-[11px] font-semibold border whitespace-nowrap ${r.type === 'Emergency Priority'
            ? 'bg-rose-50 text-rose-700 border-rose-200'
            : r.type === 'Video Teleconsult'
              ? 'bg-cyan-50 text-cyan-700 border-cyan-200'
              : 'bg-slate-100 text-slate-700 border-slate-200'
            }`}
        >
          {r.type}
        </span>
      ),
    },
    {
      key: 'feeStatus',
      header: 'Fee Status',
      align: 'center',
      render: (r) => (
        <span
          className={`px-1.5 py-0.5 rounded-[3px] text-[10px] font-bold ${r.feeStatus === 'Paid'
            ? 'bg-emerald-50 text-emerald-700'
            : 'bg-amber-50 text-amber-700'
            }`}
        >
          {r.feeStatus}
        </span>
      ),
    },
    {
      key: 'status',
      header: 'Queue Status',
      align: 'center',
      sortable: true,
      sortValue: (r) => r.status,
      render: (r) => {
        let cls = 'bg-slate-100 text-slate-700 border-slate-200';
        if (r.status === 'In Chamber') cls = 'bg-[#edf6f2] text-[#006a4e] border-[#006a4e]/30 font-bold';
        else if (r.status === 'Waiting') cls = 'bg-amber-50 text-amber-700 border-amber-200';
        else if (r.status === 'Checked In') cls = 'bg-cyan-50 text-cyan-700 border-cyan-200';
        else if (r.status === 'Completed') cls = 'bg-emerald-50 text-emerald-700 border-emerald-200';

        return (
          <span className={`px-2 py-0.5 rounded-[3px] text-[11px] border whitespace-nowrap ${cls}`}>
            {r.status}
          </span>
        );
      },
    },
    {
      key: 'actions',
      header: 'Action',
      align: 'right',
      render: (r) => (
        <div className="flex items-center justify-end gap-1.5 whitespace-nowrap">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onStartConsultation(r);
            }}
            className="px-2 py-1 rounded-[3px] bg-[#0c2e4b] hover:bg-[#081e31] text-white text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer shadow-xs"
            title="Start Patient Consultation"
          >
            <Stethoscope className="w-3 h-3" />
            <span>Consult</span>
          </button>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onOpenPrescription(r);
            }}
            className="px-2 py-1 rounded-[3px] bg-[#006a4e] hover:bg-[#00523c] text-white text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer shadow-xs"
            title="Write E-Prescription for patient"
          >
            <Pill className="w-3 h-3" />
            <span>℞ Prescribe</span>
          </button>

          <TableActionButtons
            onView={() => setSelectedAppointment(r)}
            onEdit={() => onOpenPrescription(r)}
            onDelete={() => {}}
            viewTitle="View appointment details"
            editTitle="Write prescription"
            deleteTitle="Cancel appointment"
          />
        </div>
      ),
    },
  ];

  const toolbarFilters = (
    <>
      <DropdownSelect
        value={typeFilter}
        onChange={(val) => setTypeFilter(val)}
        width="w-40"
        options={[
          { label: 'All Visit Types', value: 'All' },
          { label: 'In-Person OPD', value: 'In-Person OPD' },
          { label: 'Follow-up', value: 'Follow-up' },
          { label: 'Video Teleconsult', value: 'Video Teleconsult' },
          { label: 'Emergency Priority', value: 'Emergency Priority' },
        ]}
      />

      <DropdownSelect
        value={statusFilter}
        onChange={(val) => setStatusFilter(val)}
        width="w-36"
        options={[
          { label: 'All Statuses', value: 'All' },
          { label: 'In Chamber', value: 'In Chamber' },
          { label: 'Waiting', value: 'Waiting' },
          { label: 'Checked In', value: 'Checked In' },
          { label: 'Scheduled', value: 'Scheduled' },
          { label: 'Completed', value: 'Completed' },
        ]}
      />
    </>
  );

  return (
    <div className="space-y-2">
      {/* 4 Summary Metric Cards matching PatientDirectory format */}
      <SummaryCardGrid>
        <SummaryCard
          title="Total Bookings"
          icon={CalendarCheck}
          iconColor="text-[#006a4e]"
          value={stats.total}
          subtitle="Today's outpatient schedule"
        />
        <SummaryCard
          title="Inside Chamber"
          icon={Stethoscope}
          iconColor="text-[#006a4e]"
          value={stats.inChamber}
          valueColor="text-[#006a4e]"
          subtitle="Currently in consultation"
        />
        <SummaryCard
          title="Waiting in Hall"
          icon={Clock}
          iconColor="text-amber-600"
          value={stats.waiting}
          valueColor="text-amber-600"
          subtitle="Arrived & ready in queue"
        />
        <SummaryCard
          title="Completed Visits"
          icon={CheckCircle2}
          iconColor="text-emerald-600"
          value={stats.completed}
          valueColor="text-slate-900"
          subtitle="Prescription dispensed / finished"
        />
      </SummaryCardGrid>

      {/* Selected Appointment Quick View Card matching PatientDirectory */}
      {selectedAppointment && (
        <div className="bg-white border border-[#006a4e]/25 rounded-md p-4">
          <div className="flex flex-wrap items-start justify-between gap-3 border-b border-slate-100 pb-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-[3px] bg-[#edf6f2] text-[#006a4e] font-bold text-sm flex items-center justify-center shrink-0">
                {selectedAppointment.tokenNo}
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="text-sm font-semibold text-slate-900">
                    {selectedAppointment.patientName}
                  </h3>
                  <span className="px-2 py-0.5 rounded-[3px] bg-slate-100 text-slate-700 text-[11px] font-medium">
                    {selectedAppointment.uhid}
                  </span>
                  <span className="px-2 py-0.5 rounded-[3px] bg-emerald-50 text-emerald-700 border border-emerald-200 text-[11px] font-semibold">
                    {selectedAppointment.status}
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  Slot: {selectedAppointment.slotTime} · {selectedAppointment.age} yrs · {selectedAppointment.gender} · {selectedAppointment.type}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <DropdownSelect
                value={selectedAppointment.status}
                onChange={(val) =>
                  handleUpdateStatus(selectedAppointment.id, val as DoctorAppointment['status'])
                }
                options={['In Chamber', 'Waiting', 'Checked In', 'Scheduled', 'Completed']}
                width="w-32"
              />

              <button
                type="button"
                onClick={() => onStartConsultation(selectedAppointment)}
                className="h-8 px-3 rounded-[3px] bg-[#006a4e] hover:bg-[#00523c] text-white text-xs font-semibold inline-flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
              >
                <Stethoscope className="w-3.5 h-3.5" />
                <span>Start Consultation</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedAppointment(null)}
                className="w-8 h-8 rounded-[3px] border border-slate-200 text-slate-500 hover:text-slate-800 hover:bg-slate-50 flex items-center justify-center cursor-pointer"
                aria-label="Close details"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 text-xs">
            <div className="flex items-center gap-2">
              <Phone className="w-3.5 h-3.5 text-[#006a4e] shrink-0" />
              <div>
                <p className="text-[11px] text-slate-400">Contact</p>
                <p className="font-medium text-slate-800">{selectedAppointment.contact}</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Clock className="w-3.5 h-3.5 text-[#006a4e] shrink-0" />
              <div>
                <p className="text-[11px] text-slate-400">Scheduled Time</p>
                <p className="font-medium text-slate-800">{selectedAppointment.slotTime}</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <FileText className="w-3.5 h-3.5 text-[#006a4e] shrink-0" />
              <div>
                <p className="text-[11px] text-slate-400">Chief Complaint</p>
                <p className="font-medium text-slate-800 truncate max-w-xs">{selectedAppointment.chiefComplaint}</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Video className="w-3.5 h-3.5 text-[#006a4e] shrink-0" />
              <div>
                <p className="text-[11px] text-slate-400">Fee Status</p>
                <p className="font-semibold text-emerald-700">{selectedAppointment.feeStatus}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CarrierDirect-Style Reusable DataTable matching PatientDirectory */}
      <DataTable<DoctorAppointment>
        data={filteredAppointments}
        columns={columns}
        rowKey={(r) => r.id}
        searchable
        searchPlaceholder="Search patient, UHID, or token..."
        searchFilter={(row, query) =>
          row.patientName.toLowerCase().includes(query) ||
          row.uhid.toLowerCase().includes(query) ||
          row.tokenNo.toLowerCase().includes(query) ||
          row.chiefComplaint.toLowerCase().includes(query)
        }
        toolbarFilters={toolbarFilters}
        headerActions={
          <button
            type="button"
            onClick={() => setShowAddModal(true)}
            className="h-8 px-3 rounded-[3px] bg-[#006a4e] hover:bg-[#00553e] text-white text-xs font-semibold inline-flex items-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap shadow-2xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Slot</span>
          </button>
        }
        defaultPageSize={30}
        pageSizeOptions={[15, 30, 50, 100]}
        emptyTitle="No matching appointments found"
        emptyDescription="Try clearing the search query or selecting a different status filter."
        onRowClick={(r) => setSelectedAppointment(r)}
        showSerial={true}
      />

      {/* Add Appointment Slot Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-md border border-slate-200 shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200 bg-slate-50">
              <div className="flex items-center gap-2">
                <CalendarCheck className="w-4 h-4 text-[#006a4e]" />
                <h3 className="text-xs font-bold text-slate-800">
                  Book Walk-in / Urgent Chamber Slot
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddNewAppointment} className="p-4 space-y-3 text-xs">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  Patient Full Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={newPatientName}
                  onChange={(e) => setNewPatientName(e.target.value)}
                  placeholder="e.g. Al-Amin Sikder"
                  className="w-full h-8 px-2.5 rounded-[3px] border border-slate-300 text-slate-800 focus:outline-hidden focus:border-[#006a4e]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Existing UHID (Optional)
                  </label>
                  <input
                    type="text"
                    value={newUhid}
                    onChange={(e) => setNewUhid(e.target.value)}
                    placeholder="UHID-2024-XXXX"
                    className="w-full h-8 px-2.5 rounded-[3px] border border-slate-300 text-slate-800 focus:outline-hidden focus:border-[#006a4e]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Contact Phone
                  </label>
                  <input
                    type="text"
                    value={newContact}
                    onChange={(e) => setNewContact(e.target.value)}
                    placeholder="+880 17XX-XXXXXX"
                    className="w-full h-8 px-2.5 rounded-[3px] border border-slate-300 text-slate-800 focus:outline-hidden focus:border-[#006a4e]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Age</label>
                  <input
                    type="number"
                    value={newAge}
                    onChange={(e) => setNewAge(e.target.value)}
                    placeholder="45"
                    className="w-full h-8 px-2.5 rounded-[3px] border border-slate-300 text-slate-800 focus:outline-hidden focus:border-[#006a4e]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Gender</label>
                  <DropdownSelect
                    value={newGender}
                    onChange={(val) => setNewGender(val as any)}
                    options={['Male', 'Female', 'Other']}
                    width="w-full"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Slot Time</label>
                  <input
                    type="text"
                    value={newSlotTime}
                    onChange={(e) => setNewSlotTime(e.target.value)}
                    className="w-full h-8 px-2.5 rounded-[3px] border border-slate-300 text-slate-800 focus:outline-hidden focus:border-[#006a4e]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  Consultation Type
                </label>
                <DropdownSelect
                  value={newType}
                  onChange={(val) => setNewType(val as any)}
                  options={['In-Person OPD', 'Follow-up', 'Video Teleconsult', 'Emergency Priority']}
                  width="w-full"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  Chief Complaint
                </label>
                <textarea
                  rows={2}
                  value={newChiefComplaint}
                  onChange={(e) => setNewChiefComplaint(e.target.value)}
                  placeholder="Primary clinical symptom or reason for visit..."
                  className="w-full p-2.5 rounded-[3px] border border-slate-300 text-slate-800 focus:outline-hidden focus:border-[#006a4e]"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="h-8 px-3 rounded-[3px] border border-slate-200 text-slate-600 hover:bg-slate-50 font-medium cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="h-8 px-4 rounded-[3px] bg-[#006a4e] hover:bg-[#00523c] text-white font-semibold cursor-pointer transition-colors shadow-2xs"
                >
                  Book Slot
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
