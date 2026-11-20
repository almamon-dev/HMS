import {
  Activity,
  Bed,
  CheckCircle2,
  Clock,
  Heart,
  Phone,
  Pill,
  ShieldAlert,
  Stethoscope,
  Users,
  X,
} from 'lucide-react';
import React, { useMemo, useState } from 'react';
import { DOCTOR_PATIENTS, DoctorPatient } from '../../data/doctorPortalData';
import { DataTable, DataTableColumn } from '../common/DataTable';
import { DropdownSelect } from '../common/DropdownSelect';
import { SummaryCard, SummaryCardGrid } from '../common/SummaryCard';
import { TableActionButtons } from '../common/TableActionButtons';

interface DoctorPatientsViewProps {
  onOpenConsultation: (patient: DoctorPatient) => void;
  onOpenPrescription: (patient: DoctorPatient) => void;
}

export const DoctorPatientsView: React.FC<DoctorPatientsViewProps> = ({
  onOpenConsultation,
  onOpenPrescription,
}) => {
  const [patients] = useState<DoctorPatient[]>(DOCTOR_PATIENTS);
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedPatient, setSelectedPatient] = useState<DoctorPatient | null>(null);

  // 4 Summary Metric Cards matching Appointment format
  const stats = useMemo(() => {
    const total = patients.length;
    const active = patients.filter((p) => p.status === 'Active Outpatient').length;
    const ipd = patients.filter((p) => p.status === 'Admitted IPD').length;
    const followUp = patients.filter((p) => p.status === 'Stable Follow-up').length;
    return { total, active, ipd, followUp };
  }, [patients]);

  const filteredPatients = useMemo(() => {
    return patients.filter((p) => {
      const matchesStatus = statusFilter === 'All' || p.status === statusFilter;
      return matchesStatus;
    });
  }, [patients, statusFilter]);

  const columns: DataTableColumn<DoctorPatient>[] = [
    {
      key: 'uhid',
      header: 'UHID',
      sortable: true,
      sortValue: (r) => r.uhid,
      render: (r) => (
        <span className="font-extrabold text-[#006a4e] whitespace-nowrap">
          {r.uhid}
        </span>
      ),
    },
    {
      key: 'name',
      header: 'Patient Name & Contact',
      sortable: true,
      sortValue: (r) => r.name,
      render: (r) => (
        <div>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setSelectedPatient(r);
            }}
            className="font-bold text-slate-900 hover:text-[#006a4e] hover:underline text-left cursor-pointer whitespace-nowrap block"
          >
            {r.name}
          </button>
          <div className="text-[10px] text-slate-500">
            {r.age} yrs • {r.gender} • {r.phone}
          </div>
        </div>
      ),
    },
    {
      key: 'bloodGroup',
      header: 'Blood',
      sortable: true,
      sortValue: (r) => r.bloodGroup,
      render: (r) => (
        <span className="font-extrabold text-rose-700 whitespace-nowrap">
          {r.bloodGroup}
        </span>
      ),
    },
    {
      key: 'diagnosis',
      header: 'Primary Clinical Diagnosis',
      render: (r) => (
        <div className="text-slate-800 font-medium max-w-xs truncate" title={r.diagnosis}>
          {r.diagnosis}
        </div>
      ),
    },
    {
      key: 'allergies',
      header: 'Allergy Alerts',
      render: (r) => (
        <div>
          {r.allergies.length > 0 && r.allergies[0] !== 'None' && r.allergies[0] !== 'None known' ? (
            <span className="px-1.5 py-0.5 rounded bg-rose-50 text-rose-700 border border-rose-200 text-[10px] font-semibold">
              {r.allergies[0]}
            </span>
          ) : (
            <span className="text-[11px] text-slate-400">None known</span>
          )}
        </div>
      ),
    },
    {
      key: 'lastVisit',
      header: 'Last Visit',
      sortable: true,
      sortValue: (r) => r.lastVisit,
      render: (r) => (
        <span className="text-slate-600 whitespace-nowrap text-xs">
          {r.lastVisit}
        </span>
      ),
    },
    {
      key: 'status',
      header: 'Care Status',
      sortable: true,
      sortValue: (r) => r.status,
      render: (r) => {
        let cls = 'bg-slate-100 text-slate-700 border-slate-200';
        if (r.status === 'Active Outpatient') cls = 'bg-[#edf6f2] text-[#006a4e] border-[#006a4e]/30 font-semibold';
        else if (r.status === 'Admitted IPD') cls = 'bg-rose-50 text-rose-700 border-rose-200 font-semibold';
        else if (r.status === 'Stable Follow-up') cls = 'bg-sky-50 text-sky-700 border-sky-200 font-semibold';

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
        <div className="flex items-center justify-end gap-1.5 whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
          <button
            type="button"
            onClick={() => onOpenConsultation(r)}
            className="px-2 py-1 rounded-[3px] bg-[#0c2e4b] hover:bg-[#081e31] text-white text-xs font-semibold transition-colors cursor-pointer inline-flex items-center gap-1 shadow-xs"
            title="Start Consultation"
          >
            <Stethoscope className="w-3 h-3" />
            <span>Consult</span>
          </button>
          <button
            type="button"
            onClick={() => onOpenPrescription(r)}
            className="px-2 py-1 rounded-[3px] bg-[#006a4e] hover:bg-[#00523c] text-white text-xs font-semibold transition-colors cursor-pointer inline-flex items-center gap-1 shadow-xs"
            title="Write E-Prescription for patient"
          >
            <Pill className="w-3 h-3" />
            <span>℞ Prescribe</span>
          </button>
          <TableActionButtons
            onView={() => setSelectedPatient(r)}
            onEdit={() => onOpenPrescription(r)}
            onDelete={() => {}}
            viewTitle="View patient record"
            editTitle="Write prescription"
            deleteTitle="Remove patient"
          />
        </div>
      ),
    },
  ];

  const toolbarFilters = (
    <DropdownSelect
      value={statusFilter}
      onChange={(val) => setStatusFilter(val)}
      width="w-44"
      options={[
        { label: 'All Statuses', value: 'All' },
        { label: 'Active Outpatient', value: 'Active Outpatient' },
        { label: 'Admitted IPD', value: 'Admitted IPD' },
        { label: 'Stable Follow-up', value: 'Stable Follow-up' },
      ]}
    />
  );

  return (
    <div className="space-y-2">
      {/* 4 Summary Metric Cards matching Appointment format */}
      <SummaryCardGrid>
        <SummaryCard
          title="Total Under Care"
          icon={Users}
          iconColor="text-[#006a4e]"
          value={`${stats.total} Patients`}
          subtitle="Registered hospital patients"
        />
        <SummaryCard
          title="Active Outpatients"
          icon={Activity}
          iconColor="text-cyan-600"
          value={`${stats.active} OPD Care`}
          valueColor="text-cyan-700"
          subtitle="Regular clinical reviews"
        />
        <SummaryCard
          title="Admitted IPD"
          icon={Bed}
          iconColor="text-rose-600"
          value={`${stats.ipd} Inpatients`}
          valueColor="text-rose-700"
          subtitle="Hospital ward & CCU stay"
        />
        <SummaryCard
          title="Stable Follow-up"
          icon={Heart}
          iconColor="text-emerald-600"
          value={`${stats.followUp} Under Monitor`}
          valueColor="text-emerald-700"
          subtitle="Scheduled for surveillance"
        />
      </SummaryCardGrid>

      {/* Selected Patient Quick View Card matching Appointment format */}
      {selectedPatient && (
        <div className="bg-white border border-[#006a4e]/25 rounded-md p-4 shadow-xs">
          <div className="flex flex-wrap items-start justify-between gap-3 border-b border-slate-100 pb-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-[3px] bg-[#edf6f2] text-[#006a4e] font-bold text-sm flex items-center justify-center shrink-0">
                {selectedPatient.bloodGroup}
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="text-sm font-semibold text-slate-900">
                    {selectedPatient.name}
                  </h3>
                  <span className="px-2 py-0.5 rounded-[3px] bg-slate-100 text-slate-700 text-[11px] font-medium">
                    {selectedPatient.uhid}
                  </span>
                  <span className="text-xs text-slate-500">
                    {selectedPatient.age} yrs • {selectedPatient.gender}
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  Diagnosis: <span className="font-medium text-slate-800">{selectedPatient.diagnosis}</span> • Last Visit: {selectedPatient.lastVisit}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => onOpenConsultation(selectedPatient)}
                className="px-3 py-1.5 rounded-[3px] bg-[#006a4e] hover:bg-[#00523c] text-white text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Stethoscope className="w-3.5 h-3.5" />
                <span>Open File</span>
              </button>
              <button
                type="button"
                onClick={() => setSelectedPatient(null)}
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
                <p className="text-[11px] text-slate-400">Phone</p>
                <p className="font-medium text-slate-800">{selectedPatient.phone}</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Clock className="w-3.5 h-3.5 text-[#006a4e] shrink-0" />
              <div>
                <p className="text-[11px] text-slate-400">Last Encounter</p>
                <p className="font-medium text-slate-800">{selectedPatient.lastVisit}</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <ShieldAlert className="w-3.5 h-3.5 text-rose-600 shrink-0" />
              <div>
                <p className="text-[11px] text-slate-400">Allergies</p>
                <p className="font-medium text-rose-700 truncate max-w-xs">{selectedPatient.allergies.join(', ')}</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <div>
                <p className="text-[11px] text-slate-400">Care Status</p>
                <p className="font-semibold text-slate-800">{selectedPatient.status}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Appointment-Styled Enterprise DataTable */}
      <DataTable<DoctorPatient>
        data={filteredPatients}
        columns={columns}
        keyExtractor={(item) => item.uhid}
        searchPlaceholder="Search by UHID, patient name, blood group, or diagnosis..."
        searchFilter={(item, query) =>
          item.name.toLowerCase().includes(query.toLowerCase()) ||
          item.uhid.toLowerCase().includes(query.toLowerCase()) ||
          item.diagnosis.toLowerCase().includes(query.toLowerCase()) ||
          item.bloodGroup.toLowerCase().includes(query.toLowerCase()) ||
          item.chronicDiseases.some((cd) => cd.toLowerCase().includes(query.toLowerCase()))
        }
        filters={toolbarFilters}
        emptyMessage="No patients found matching the selected criteria."
        onRowClick={(item) => setSelectedPatient(item)}
        showSerial={true}
      />
    </div>
  );
};
