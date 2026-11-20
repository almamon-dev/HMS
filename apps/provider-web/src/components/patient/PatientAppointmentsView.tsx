import {
  CalendarCheck,
  CheckCircle2,
  Clock,
  Eye,
  MapPin,
  Plus,
  Printer,
  Stethoscope,
  Video,
  X,
} from 'lucide-react';
import React, { useMemo, useState } from 'react';
import {
  PATIENT_APPOINTMENTS,
  PatientAppointmentItem,
} from '../../data/patientPortalData';
import { DataTable, DataTableColumn } from '../common/DataTable';
import { DropdownSelect } from '../common/DropdownSelect';
import { SummaryCard, SummaryCardGrid } from '../common/SummaryCard';

export const PatientAppointmentsView: React.FC = () => {
  const [appointments, setAppointments] =
    useState<PatientAppointmentItem[]>(PATIENT_APPOINTMENTS);
  const [typeFilter, setTypeFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedAppointment, setSelectedAppointment] =
    useState<PatientAppointmentItem | null>(null);
  const [showBookModal, setShowBookModal] = useState(false);

  // Booking Form State
  const [selectedDoctor, setSelectedDoctor] = useState('Prof. Dr. Tanvir Ahmed (Cardiology)');
  const [selectedBranch, setSelectedBranch] = useState('Dhanmondi Main Wing');
  const [visitType, setVisitType] = useState<PatientAppointmentItem['type']>('In-Person OPD');
  const [preferredDate, setPreferredDate] = useState('2026-11-28');
  const [preferredTime, setPreferredTime] = useState('04:30 PM');
  const [reason, setReason] = useState('');

  const stats = useMemo(() => {
    return {
      total: appointments.length,
      confirmed: appointments.filter((a) => a.status === 'Confirmed').length,
      completed: appointments.filter((a) => a.status === 'Completed').length,
      tele: appointments.filter((a) => a.type === 'Video Teleconsult').length,
    };
  }, [appointments]);

  const filteredAppointments = useMemo(() => {
    return appointments.filter((a) => {
      const matchType = typeFilter === 'All' || a.type === typeFilter;
      const matchStatus = statusFilter === 'All' || a.status === statusFilter;
      return matchType && matchStatus;
    });
  }, [appointments, typeFilter, statusFilter]);

  const handleBookAppointment = (e: React.FormEvent) => {
    e.preventDefault();
    const docName = selectedDoctor.split(' (')[0];
    const dept = selectedDoctor.split(' (')[1]?.replace(')', '') || 'Specialist OPD';
    const nextSeq = 7900 + appointments.length;

    const newBooking: PatientAppointmentItem = {
      id: `p-apt-${Date.now()}`,
      tokenNo: `#${appointments.length + 1}`,
      appointmentNo: `APPNO${nextSeq}`,
      doctorName: docName,
      department: dept,
      room: visitType === 'Video Teleconsult' ? 'Virtual Consultation Room' : 'Room 302, Level 3',
      branch: selectedBranch,
      slotTime: preferredTime,
      date: preferredDate,
      type: visitType,
      status: 'Confirmed',
      fee: 50.0,
      feeStatus: 'Paid',
      teleconsultLink:
        visitType === 'Video Teleconsult'
          ? `https://telehealth.greenhospital.org/meet/apt-${nextSeq}`
          : undefined,
    };

    setAppointments([newBooking, ...appointments]);
    setSelectedAppointment(newBooking);
    setShowBookModal(false);
    setReason('');
  };

  const handleCancelBooking = (id: string) => {
    setAppointments((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status: 'Cancelled' } : a))
    );
    if (selectedAppointment && selectedAppointment.id === id) {
      setSelectedAppointment((prev) => (prev ? { ...prev, status: 'Cancelled' } : null));
    }
  };

  const columns: DataTableColumn<PatientAppointmentItem>[] = [
    {
      key: 'tokenNo',
      header: 'Token',
      sortable: true,
      sortValue: (r) => r.tokenNo,
      render: (r) => (
        <span className="font-extrabold text-[#006a4e]">{r.tokenNo}</span>
      ),
    },
    {
      key: 'appointmentNo',
      header: 'Booking No',
      sortable: true,
      sortValue: (r) => r.appointmentNo,
      render: (r) => (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setSelectedAppointment(r);
          }}
          className="font-bold text-slate-900 hover:text-[#006a4e] hover:underline text-left cursor-pointer whitespace-nowrap block"
        >
          {r.appointmentNo}
        </button>
      ),
    },
    {
      key: 'doctorName',
      header: 'Physician & Department',
      sortable: true,
      sortValue: (r) => r.doctorName,
      render: (r) => (
        <div>
          <div className="font-semibold text-slate-900">{r.doctorName}</div>
          <div className="text-[10px] text-slate-500">{r.department}</div>
        </div>
      ),
    },
    {
      key: 'slotTime',
      header: 'Date & Time',
      sortable: true,
      sortValue: (r) => `${r.date} ${r.slotTime}`,
      render: (r) => (
        <div>
          <span className="font-medium text-slate-800 block whitespace-nowrap">
            {r.slotTime}
          </span>
          <span className="text-[10px] text-slate-400 block whitespace-nowrap">{r.date}</span>
        </div>
      ),
    },
    {
      key: 'branch',
      header: 'Location / Room',
      render: (r) => (
        <div>
          <span className="text-slate-800 font-medium block whitespace-nowrap">{r.room}</span>
          <span className="text-[10px] text-slate-500 block whitespace-nowrap">{r.branch}</span>
        </div>
      ),
    },
    {
      key: 'type',
      header: 'Consultation Mode',
      render: (r) => (
        <span
          className={`px-2 py-0.5 rounded-[3px] text-[11px] font-semibold border whitespace-nowrap ${r.type === 'Video Teleconsult'
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
        <span className="px-1.5 py-0.5 rounded-[3px] text-[10px] font-bold bg-emerald-50 text-[#006a4e] border border-emerald-200">
          ${r.fee.toFixed(2)} · {r.feeStatus}
        </span>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      align: 'center',
      sortable: true,
      sortValue: (r) => r.status,
      render: (r) => {
        let cls = 'bg-slate-100 text-slate-700 border-slate-200';
        if (r.status === 'Confirmed') cls = 'bg-[#edf6f2] text-[#006a4e] border-[#006a4e]/20 font-semibold';
        else if (r.status === 'Completed') cls = 'bg-slate-50 text-slate-500 border-slate-200';
        else if (r.status === 'Cancelled') cls = 'bg-rose-50 text-rose-700 border-rose-200';

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
          {r.type === 'Video Teleconsult' && r.status === 'Confirmed' && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                if (r.teleconsultLink) window.open(r.teleconsultLink, '_blank');
              }}
              className="px-2 py-1 rounded-[3px] bg-cyan-600 hover:bg-cyan-700 text-white text-[11px] font-semibold flex items-center gap-1 transition-colors cursor-pointer"
            >
              <Video className="w-3 h-3" />
              <span>Join</span>
            </button>
          )}

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setSelectedAppointment(r);
              setTimeout(() => window.print(), 150);
            }}
            className="px-2 py-1 rounded-[3px] bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-[11px] font-semibold flex items-center gap-1 transition-colors cursor-pointer"
            title="Print Appointment Slip"
          >
            <Printer className="w-3 h-3 text-slate-500" />
            <span>Slip</span>
          </button>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setSelectedAppointment(r);
            }}
            className="p-1 rounded-[3px] hover:bg-slate-100 text-slate-400 hover:text-slate-700 cursor-pointer"
            title="View Details"
          >
            <Eye className="w-3.5 h-3.5" />
          </button>
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
          { label: 'All Modes', value: 'All' },
          { label: 'In-Person OPD', value: 'In-Person OPD' },
          { label: 'Video Teleconsult', value: 'Video Teleconsult' },
          { label: 'Follow-up', value: 'Follow-up' },
        ]}
      />

      <DropdownSelect
        value={statusFilter}
        onChange={(val) => setStatusFilter(val)}
        width="w-36"
        options={[
          { label: 'All Statuses', value: 'All' },
          { label: 'Confirmed', value: 'Confirmed' },
          { label: 'Completed', value: 'Completed' },
          { label: 'Cancelled', value: 'Cancelled' },
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
          subtitle="Scheduled outpatient & video visits"
        />
        <SummaryCard
          title="Upcoming Confirmed"
          icon={CheckCircle2}
          iconColor="text-[#006a4e]"
          value={stats.confirmed}
          valueColor="text-[#006a4e]"
          subtitle="Chamber tokens ready for consult"
        />
        <SummaryCard
          title="Video Consultations"
          icon={Video}
          iconColor="text-cyan-600"
          value={stats.tele}
          valueColor="text-cyan-700"
          subtitle="Online video rooms scheduled"
        />
        <SummaryCard
          title="Completed Visits"
          icon={Clock}
          iconColor="text-slate-600"
          value={stats.completed}
          valueColor="text-slate-800"
          subtitle="Past doctor encounters"
        />
      </SummaryCardGrid>

      {/* Selected Appointment Slip Quick View Card matching PatientDirectory */}
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
                    {selectedAppointment.doctorName}
                  </h3>
                  <span className="px-2 py-0.5 rounded-[3px] bg-slate-100 text-slate-700 text-[11px] font-medium">
                    {selectedAppointment.appointmentNo}
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded-[3px] border text-[11px] font-semibold ${selectedAppointment.status === 'Confirmed'
                      ? 'bg-[#edf6f2] text-[#006a4e] border-[#006a4e]/20'
                      : 'bg-slate-100 text-slate-700 border-slate-200'
                      }`}
                  >
                    {selectedAppointment.status}
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  Slot: {selectedAppointment.date} · {selectedAppointment.slotTime} · {selectedAppointment.room} ({selectedAppointment.branch})
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => window.print()}
                className="h-8 px-2.5 rounded-[3px] border border-slate-200 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-700 inline-flex items-center gap-1.5 cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5 text-slate-500" />
                <span>Print Slip</span>
              </button>

              {selectedAppointment.status === 'Confirmed' && (
                <button
                  type="button"
                  onClick={() => handleCancelBooking(selectedAppointment.id)}
                  className="h-8 px-2.5 rounded-[3px] border border-rose-200 bg-rose-50 hover:bg-rose-100 text-xs font-semibold text-rose-700 inline-flex items-center gap-1 cursor-pointer"
                >
                  <span>Cancel Booking</span>
                </button>
              )}

              <button
                type="button"
                onClick={() => setSelectedAppointment(null)}
                className="w-8 h-8 rounded-[3px] border border-slate-200 text-slate-500 hover:text-slate-800 hover:bg-slate-50 flex items-center justify-center cursor-pointer"
                aria-label="Close appointment quick view"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 text-xs">
            <div className="flex items-center gap-2">
              <Stethoscope className="w-3.5 h-3.5 text-[#006a4e] shrink-0" />
              <div>
                <p className="text-[11px] text-slate-400">Department</p>
                <p className="font-medium text-slate-800">{selectedAppointment.department}</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Clock className="w-3.5 h-3.5 text-[#006a4e] shrink-0" />
              <div>
                <p className="text-[11px] text-slate-400">Time &amp; Token</p>
                <p className="font-medium text-slate-800">
                  {selectedAppointment.slotTime} ({selectedAppointment.tokenNo})
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <MapPin className="w-3.5 h-3.5 text-[#006a4e] shrink-0" />
              <div>
                <p className="text-[11px] text-slate-400">Room &amp; Campus</p>
                <p className="font-medium text-slate-800">
                  {selectedAppointment.room} · {selectedAppointment.branch}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <div>
                <p className="text-[11px] text-slate-400">Fee Status</p>
                <p className="font-bold text-emerald-700">
                  ${selectedAppointment.fee.toFixed(2)} · {selectedAppointment.feeStatus}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CarrierDirect-Style Reusable DataTable matching PatientDirectory */}
      <DataTable<PatientAppointmentItem>
        data={filteredAppointments}
        columns={columns}
        rowKey={(row) => row.id}
        searchable
        searchPlaceholder="Search doctor, booking no, or department..."
        searchFilter={(row, query) =>
          row.doctorName.toLowerCase().includes(query) ||
          row.appointmentNo.toLowerCase().includes(query) ||
          row.department.toLowerCase().includes(query)
        }
        toolbarFilters={toolbarFilters}
        headerActions={
          <button
            type="button"
            onClick={() => setShowBookModal(true)}
            className="h-8 px-3 rounded-[3px] bg-[#006a4e] hover:bg-[#00553e] text-white text-xs font-semibold inline-flex items-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap shadow-2xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Book New Appointment</span>
          </button>
        }
        defaultPageSize={30}
        pageSizeOptions={[15, 30, 50, 100]}
        emptyTitle="No matching appointments found"
        emptyDescription="Try clearing the search query or changing the filter mode."
        onRowClick={(row) => setSelectedAppointment(row)}
        showSerial={true}
      />

      {/* Book New Appointment Modal */}
      {showBookModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-md border border-slate-200 shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200 bg-slate-50">
              <div className="flex items-center gap-2">
                <CalendarCheck className="w-4 h-4 text-[#006a4e]" />
                <h3 className="text-xs font-bold text-slate-800">
                  Book Specialist Consultation Appointment
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowBookModal(false)}
                className="text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleBookAppointment} className="p-4 space-y-3 text-xs">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  Select Specialist Doctor <span className="text-rose-500">*</span>
                </label>
                <DropdownSelect
                  value={selectedDoctor}
                  onChange={(val) => setSelectedDoctor(val)}
                  options={[
                    'Prof. Dr. Tanvir Ahmed (Cardiology)',
                    'Dr. Farhana Rahman (Cardiac Surgery)',
                    'Dr. Mahmudul Hasan (Internal Medicine)',
                    'Dr. Farhana Yasmin (Endocrinology & Diabetology)',
                    'Dr. Kamrul Islam (Nephrology)',
                  ]}
                  width="w-full"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Hospital Campus Branch
                  </label>
                  <DropdownSelect
                    value={selectedBranch}
                    onChange={(val) => setSelectedBranch(val)}
                    options={['Dhanmondi Main Wing', 'Uttara Campus Wing', 'Mirpur Satellite']}
                    width="w-full"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Consultation Mode
                  </label>
                  <DropdownSelect
                    value={visitType}
                    onChange={(val) => setVisitType(val as any)}
                    options={['In-Person OPD', 'Video Teleconsult', 'Follow-up']}
                    width="w-full"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Preferred Date <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="date"
                    required
                    value={preferredDate}
                    onChange={(e) => setPreferredDate(e.target.value)}
                    className="w-full h-8 px-2.5 rounded-[3px] border border-slate-300 text-slate-800 focus:outline-hidden focus:border-[#006a4e]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Preferred Slot Time
                  </label>
                  <DropdownSelect
                    value={preferredTime}
                    onChange={(val) => setPreferredTime(val)}
                    options={['10:00 AM', '11:30 AM', '04:00 PM', '04:30 PM', '05:00 PM', '06:00 PM']}
                    width="w-full"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  Reason for Visit / Symptoms
                </label>
                <textarea
                  rows={2}
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="Describe your health symptoms or consultation query..."
                  className="w-full p-2.5 rounded-[3px] border border-slate-300 text-slate-800 focus:outline-hidden focus:border-[#006a4e]"
                />
              </div>

              <div className="p-2.5 rounded-md bg-slate-50 border border-slate-200 flex items-center justify-between text-xs">
                <span className="text-slate-600 font-medium">Standard Specialist Fee:</span>
                <span className="font-bold text-slate-900">$50.00 (Payable at desk or online)</span>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowBookModal(false)}
                  className="h-8 px-3 rounded-[3px] border border-slate-200 text-slate-600 hover:bg-slate-50 font-medium cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="h-8 px-4 rounded-[3px] bg-[#006a4e] hover:bg-[#00523c] text-white font-semibold cursor-pointer transition-colors shadow-2xs"
                >
                  Confirm Booking
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
