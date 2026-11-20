import {
  AlertTriangle,
  Bed,
  CalendarCheck,
  Clock,
  FileText,
  Phone,
  Pill,
  Stethoscope,
  Video,
  X,
} from 'lucide-react';
import React, { useState } from 'react';
import {
  CURRENT_DOCTOR,
  DOCTOR_APPOINTMENTS,
  DOCTOR_LAB_ORDERS,
  DOCTOR_LIVE_QUEUE,
  DoctorAppointment,
} from '../../data/doctorPortalData';
import { DataTable, DataTableColumn } from '../common/DataTable';
import { SummaryCard, SummaryCardGrid } from '../common/SummaryCard';
import { TableActionButtons } from '../common/TableActionButtons';

interface DoctorDashboardHomeProps {
  onNavigate: (moduleId: string) => void;
  onOpenPrescriptionModal?: () => void;
  onOpenPrescription?: (appointment: any) => void;
}

export const DoctorDashboardHome: React.FC<DoctorDashboardHomeProps> = ({
  onNavigate,
  onOpenPrescriptionModal,
  onOpenPrescription,
}) => {
  const currentInChamber = DOCTOR_LIVE_QUEUE.find((q) => q.status === 'In Chamber');
  const waitingPatients = DOCTOR_LIVE_QUEUE.filter((q) => q.status === 'Waiting');
  const criticalLabAlerts = DOCTOR_LAB_ORDERS.filter((l) => l.status === 'Critical Alert');
  const [selectedAppointment, setSelectedAppointment] = useState<DoctorAppointment | null>(null);

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
            className="text-slate-900 font-bold hover:text-[#0c2e4b] hover:underline text-left cursor-pointer whitespace-nowrap block text-xs"
          >
            {r.patientName}
          </button>
          <span className="text-[11px] text-slate-600 font-medium">
            {r.uhid} • {r.age} yrs • {r.gender}
          </span>
        </div>
      ),
    },
    {
      key: 'chiefComplaint',
      header: 'Chief Complaint',
      render: (r) => (
        <span className="text-slate-800 line-clamp-1 max-w-xs block text-xs" title={r.chiefComplaint}>
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
          className={`px-2 py-0.5 rounded-[3px] text-xs font-semibold border whitespace-nowrap ${r.type === 'Emergency Priority'
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
      key: 'status',
      header: 'Status',
      align: 'center',
      sortable: true,
      sortValue: (r) => r.status,
      render: (r) => {
        let cls = 'bg-slate-100 text-slate-700 border-slate-200';
        if (r.status === 'In Chamber') cls = 'bg-emerald-50 text-emerald-800 border-emerald-300 font-bold';
        else if (r.status === 'Waiting') cls = 'bg-amber-50 text-amber-800 border-amber-200 font-semibold';
        else if (r.status === 'Checked In') cls = 'bg-cyan-50 text-cyan-800 border-cyan-200 font-semibold';
        else if (r.status === 'Completed') cls = 'bg-slate-100 text-slate-700 border-slate-200';

        return (
          <span className={`px-2 py-0.5 rounded-[3px] text-xs border whitespace-nowrap ${cls}`}>
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
        <div className="flex items-center justify-end gap-1.5 whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
          <button
            type="button"
            onClick={() => onNavigate('consultations')}
            className="px-2 py-1 rounded-[3px] bg-[#0c2e4b] hover:bg-[#081e31] text-white text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer shadow-xs"
            title="Start Patient Consultation"
          >
            <Stethoscope className="w-3 h-3" />
            <span>Consult</span>
          </button>
          <button
            type="button"
            onClick={() => (onOpenPrescription ? onOpenPrescription(r) : onNavigate('prescriptions'))}
            className="px-2 py-1 rounded-[3px] bg-[#006a4e] hover:bg-[#00523c] text-white text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer shadow-xs"
            title="Write E-Prescription for patient"
          >
            <Pill className="w-3 h-3" />
            <span>℞ Prescribe</span>
          </button>
          <TableActionButtons
            onView={() => setSelectedAppointment(r)}
            onEdit={() => (onOpenPrescription ? onOpenPrescription(r) : setSelectedAppointment(r))}
            onDelete={() => {}}
            viewTitle="View appointment details"
            editTitle="Write E-Prescription"
            deleteTitle="Cancel appointment"
          />
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-2">
      {/* 4 Summary Metric Cards matching Appointment format */}
      <SummaryCardGrid>
        <SummaryCard
          title="Today's Appointments"
          icon={CalendarCheck}
          iconColor="text-[#006a4e]"
          value={`${DOCTOR_APPOINTMENTS.length} Consultations`}
          subtitle="5 in-person • 2 teleconsultations"
        />
        <SummaryCard
          title="Queue Waiting"
          icon={Clock}
          iconColor="text-amber-600"
          value={`${waitingPatients.length} Patients`}
          valueColor="text-amber-600"
          subtitle={`Inside chamber: ${currentInChamber?.tokenNo || '#06'}`}
        />
        <SummaryCard
          title="Inpatient Rounds"
          icon={Bed}
          iconColor="text-cyan-600"
          value="3 Patients"
          valueColor="text-cyan-700"
          subtitle="Cardiac ward 3 & ICU rounds"
        />
        <SummaryCard
          title="Critical Lab Alerts"
          icon={AlertTriangle}
          iconColor="text-rose-600"
          value={`${criticalLabAlerts.length} Action Items`}
          valueColor="text-rose-700"
          subtitle="Troponin-I high alert flagged"
        />
      </SummaryCardGrid>

      {/* Active Chamber Bar & Quick Action */}
      <div className="bg-white p-3 rounded-[4px] border border-slate-200/90 border-l-4 border-l-[#0c2e4b] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-[3px] bg-slate-100 text-slate-800 flex items-center justify-center font-bold text-sm border border-slate-200 shrink-0">
            {currentInChamber?.tokenNo || '#06'}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs font-bold text-slate-900">
                {CURRENT_DOCTOR.name} • {CURRENT_DOCTOR.room}
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-[3px] bg-slate-100 text-slate-700 font-semibold border border-slate-200">
                Active Session
              </span>
            </div>
            <div className="text-[11px] text-slate-500 mt-0.5">
              {currentInChamber
                ? `Currently Inside: ${currentInChamber.patientName} (${currentInChamber.uhid}) • Visit Type: ${currentInChamber.visitType} • Wait: ${currentInChamber.waitTime}`
                : 'Chamber is ready • Next patient waiting outside'}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => onNavigate('patient-queue')}
            className="px-3 py-1.5 rounded-[3px] bg-[#0c2e4b] hover:bg-[#081e31] text-white text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Open Live Queue ({waitingPatients.length} waiting)</span>
          </button>

          {(onOpenPrescription || onOpenPrescriptionModal) && (
            <button
              type="button"
              onClick={() => {
                if (onOpenPrescription && currentInChamber) {
                  onOpenPrescription(currentInChamber);
                } else if (onOpenPrescriptionModal) {
                  onOpenPrescriptionModal();
                }
              }}
              className="px-3 py-1.5 rounded-[3px] bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Pill className="w-3.5 h-3.5 text-slate-600" />
              <span>Create E-Rx</span>
            </button>
          )}
        </div>
      </div>

      {/* Critical STAT Alerts (If any) */}
      {criticalLabAlerts.length > 0 && (
        <div className="bg-white border border-slate-200/90 border-l-4 border-l-rose-500 rounded-[4px] p-2.5 sm:p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 shadow-xs">
          <div className="flex items-center gap-2.5">
            <AlertTriangle className="w-4 h-4 text-rose-500 shrink-0" />
            <div className="text-xs">
              <span className="font-extrabold text-slate-900">
                STAT Critical Lab Alert:
              </span>{' '}
              <span className="text-slate-700">
                {criticalLabAlerts[0].patientName} ({criticalLabAlerts[0].uhid}) — {criticalLabAlerts[0].testName}:{' '}
                <strong className="font-bold text-rose-700">
                  {criticalLabAlerts[0].parameterSummary || 'Flagged Critical High'}
                </strong>
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={() => onNavigate('lab-investigations')}
            className="px-3 py-1 rounded-[3px] bg-white border border-rose-300 hover:bg-rose-50 text-rose-700 text-xs font-semibold transition-colors cursor-pointer shrink-0"
          >
            Review STAT
          </button>
        </div>
      )}

      {/* Selected Appointment Quick View Card matching Appointment format */}
      {selectedAppointment && (
        <div className="bg-white border border-slate-200/90 rounded-[4px] p-4 shadow-xs">
          <div className="flex flex-wrap items-start justify-between gap-3 border-b border-slate-100 pb-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-[3px] bg-slate-100 text-slate-800 border border-slate-200 font-bold text-sm flex items-center justify-center shrink-0">
                {selectedAppointment.tokenNo}
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="text-sm font-semibold text-slate-900">
                    {selectedAppointment.patientName}
                  </h3>
                  <span className="px-2 py-0.5 rounded-[3px] bg-slate-100 text-slate-700 text-[11px] font-medium border border-slate-200">
                    {selectedAppointment.uhid}
                  </span>
                  <span className="text-xs text-slate-500">
                    {selectedAppointment.age} yrs • {selectedAppointment.gender}
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  Slot: <span className="font-medium text-slate-800">{selectedAppointment.slotTime}</span> • Type: {selectedAppointment.type}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => onNavigate('consultations')}
                className="px-3 py-1.5 rounded-[3px] bg-[#0c2e4b] hover:bg-[#081e31] text-white text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
              >
                <Stethoscope className="w-3.5 h-3.5" />
                <span>Start Consultation</span>
              </button>
              {onOpenPrescription && (
                <button
                  type="button"
                  onClick={() => onOpenPrescription(selectedAppointment)}
                  className="px-3 py-1.5 rounded-[3px] bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Pill className="w-3.5 h-3.5 text-slate-600" />
                  <span>Write E-Rx</span>
                </button>
              )}
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
              <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <div>
                <p className="text-[11px] text-slate-400">Contact</p>
                <p className="font-medium text-slate-800">{selectedAppointment.contact}</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <div>
                <p className="text-[11px] text-slate-400">Scheduled Time</p>
                <p className="font-medium text-slate-800">{selectedAppointment.slotTime}</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <FileText className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <div>
                <p className="text-[11px] text-slate-400">Chief Complaint</p>
                <p className="font-medium text-slate-800 truncate max-w-xs">{selectedAppointment.chiefComplaint}</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Video className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <div>
                <p className="text-[11px] text-slate-400">Fee Status</p>
                <p className="font-semibold text-emerald-700">{selectedAppointment.feeStatus}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Appointment-Styled Enterprise DataTable */}
      <DataTable<DoctorAppointment>
        data={DOCTOR_APPOINTMENTS}
        columns={columns}
        keyExtractor={(item) => item.id}
        searchPlaceholder="Search token, patient name, UHID, or complaint..."
        searchFilter={(item, query) =>
          item.patientName.toLowerCase().includes(query.toLowerCase()) ||
          item.uhid.toLowerCase().includes(query.toLowerCase()) ||
          item.tokenNo.toLowerCase().includes(query.toLowerCase()) ||
          item.chiefComplaint.toLowerCase().includes(query.toLowerCase())
        }
        emptyMessage="No appointments scheduled for today."
        onRowClick={(item) => setSelectedAppointment(item)}
        showSerial={true}
      />
    </div>
  );
};
