import {
  Activity,
  AlertTriangle,
  Eye,
  FileText,
  Heart,
  ShieldAlert,
  X,
} from 'lucide-react';
import React, { useMemo, useState } from 'react';
import { DOCTOR_PATIENTS, DoctorPatient } from '../../data/doctorPortalData';
import { DataTable, DataTableColumn } from '../common/DataTable';
import { DropdownSelect } from '../common/DropdownSelect';
import { SummaryCard, SummaryCardGrid } from '../common/SummaryCard';
import { TableActionButtons } from '../common/TableActionButtons';

export const DoctorClinicalRecordsView: React.FC = () => {
  const [patients] = useState<DoctorPatient[]>(DOCTOR_PATIENTS);
  const [selectedRecord, setSelectedRecord] = useState<DoctorPatient | null>(null);
  const [comorbidityFilter, setComorbidityFilter] = useState('All');

  // 4 Summary Metric Cards matching Appointment format
  const stats = useMemo(() => {
    const total = patients.length;
    const hypertensive = patients.filter((p) =>
      p.chronicDiseases.some((cd) => cd.toLowerCase().includes('hypertension'))
    ).length;
    const allergies = patients.filter(
      (p) => p.allergies.length > 0 && p.allergies[0] !== 'None' && p.allergies[0] !== 'None known'
    ).length;
    const admitted = patients.filter((p) => p.status === 'Admitted IPD').length;
    return { total, hypertensive, allergies, admitted };
  }, [patients]);

  const filteredPatients = useMemo(() => {
    if (comorbidityFilter === 'All') return patients;
    return patients.filter((p) =>
      p.chronicDiseases.some((cd) => cd.toLowerCase().includes(comorbidityFilter.toLowerCase()))
    );
  }, [patients, comorbidityFilter]);

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
      header: 'Patient Dossier',
      sortable: true,
      sortValue: (r) => r.name,
      render: (r) => (
        <div>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setSelectedRecord(r);
            }}
            className="font-bold text-slate-900 hover:text-[#006a4e] hover:underline text-left cursor-pointer whitespace-nowrap block"
          >
            {r.name}
          </button>
          <div className="text-[10px] text-slate-500">
            {r.age} yrs • {r.gender} • Blood: <span className="font-bold text-rose-700">{r.bloodGroup}</span>
          </div>
        </div>
      ),
    },
    {
      key: 'diagnosis',
      header: 'Primary Clinical Diagnosis',
      render: (r) => (
        <span className="text-slate-800 font-semibold max-w-xs truncate block" title={r.diagnosis}>
          {r.diagnosis}
        </span>
      ),
    },
    {
      key: 'chronicDiseases',
      header: 'Documented Comorbidities',
      render: (r) => (
        <div className="flex flex-wrap gap-1 max-w-xs">
          {r.chronicDiseases.map((cd) => (
            <span
              key={cd}
              className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 text-[10px] font-medium"
            >
              {cd}
            </span>
          ))}
        </div>
      ),
    },
    {
      key: 'allergies',
      header: 'Allergy Alerts',
      render: (r) => (
        <div>
          {r.allergies.length > 0 && r.allergies[0] !== 'None' && r.allergies[0] !== 'None known' ? (
            <span className="px-1.5 py-0.5 rounded bg-rose-50 text-rose-700 border border-rose-200 text-[10px] font-semibold inline-flex items-center gap-1">
              <AlertTriangle className="w-2.5 h-2.5" />
              {r.allergies[0]}
            </span>
          ) : (
            <span className="text-[11px] text-slate-400">None</span>
          )}
        </div>
      ),
    },
    {
      key: 'lastVisit',
      header: 'Last Encounter',
      render: (r) => (
        <span className="text-slate-600 whitespace-nowrap text-xs">
          {r.lastVisit}
        </span>
      ),
    },
    {
      key: 'actions',
      header: 'Action',
      align: 'right',
      render: (r) => (
        <div className="flex items-center justify-end gap-1.5 whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
          <button
            type="button"
            onClick={() => setSelectedRecord(r)}
            className="px-2.5 py-1 rounded-[3px] bg-[#0c2e4b] hover:bg-[#081e31] text-white text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer shadow-xs mr-1"
          >
            <Eye className="w-3 h-3" />
            <span>EMR Dossier</span>
          </button>
          <TableActionButtons
            onEdit={() => setSelectedRecord(r)}
            onDelete={() => {}}
            editTitle="Edit clinical record"
            deleteTitle="Archive record"
          />
        </div>
      ),
    },
  ];

  const toolbarFilters = (
    <DropdownSelect
      value={comorbidityFilter}
      onChange={(val) => setComorbidityFilter(val)}
      width="w-48"
      options={[
        { label: 'All Comorbidities', value: 'All' },
        { label: 'Hypertension', value: 'hypertension' },
        { label: 'Diabetes', value: 'diabetes' },
        { label: 'Asthma / COPD', value: 'asthma' },
      ]}
    />
  );

  return (
    <div className="space-y-2">
      {/* 4 Summary Metric Cards matching Appointment format */}
      <SummaryCardGrid>
        <SummaryCard
          title="Longitudinal EMRs"
          icon={FileText}
          iconColor="text-[#006a4e]"
          value={`${stats.total} Records`}
          subtitle="Archived digital clinical dossiers"
        />
        <SummaryCard
          title="Cardiovascular Risks"
          icon={Heart}
          iconColor="text-rose-600"
          value={`${stats.hypertensive} Diagnoses`}
          valueColor="text-rose-700"
          subtitle="Hypertension & Type 2 DM"
        />
        <SummaryCard
          title="Documented Drug Allergies"
          icon={ShieldAlert}
          iconColor="text-amber-600"
          value={`${stats.allergies} Alerts`}
          valueColor="text-amber-700"
          subtitle="High sensitivity penicillin/sulfa"
        />
        <SummaryCard
          title="Current Inpatients"
          icon={Activity}
          iconColor="text-emerald-600"
          value={`${stats.admitted} Inpatients`}
          valueColor="text-emerald-700"
          subtitle="Active CCU & ward beds"
        />
      </SummaryCardGrid>

      {/* Selected EMR Dossier Quick View Card matching Appointment format */}
      {selectedRecord && (
        <div className="bg-white border border-[#006a4e]/25 rounded-md p-4 shadow-xs">
          <div className="flex flex-wrap items-start justify-between gap-3 border-b border-slate-100 pb-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-[3px] bg-[#edf6f2] text-[#006a4e] font-bold text-sm flex items-center justify-center shrink-0">
                {selectedRecord.bloodGroup}
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="text-sm font-semibold text-slate-900">
                    {selectedRecord.name}
                  </h3>
                  <span className="px-2 py-0.5 rounded-[3px] bg-slate-100 text-slate-700 text-[11px] font-medium">
                    {selectedRecord.uhid}
                  </span>
                  <span className="text-xs text-slate-500">
                    {selectedRecord.age} yrs • {selectedRecord.gender}
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  Diagnosis: <span className="font-medium text-slate-800">{selectedRecord.diagnosis}</span> • Status: {selectedRecord.status}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setSelectedRecord(null)}
                className="w-8 h-8 rounded-[3px] border border-slate-200 text-slate-500 hover:text-slate-800 hover:bg-slate-50 flex items-center justify-center cursor-pointer"
                aria-label="Close details"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-3 text-xs">
            <div className="p-2.5 bg-slate-50 rounded border border-slate-200 space-y-1">
              <span className="text-[10px] text-slate-500 block">Chronic Conditions</span>
              <div className="flex flex-wrap gap-1">
                {selectedRecord.chronicDiseases.map((cd) => (
                  <span key={cd} className="px-1.5 py-0.5 rounded bg-white border border-slate-200 text-slate-700 text-[10px] font-semibold">
                    {cd}
                  </span>
                ))}
              </div>
            </div>

            <div className="p-2.5 bg-slate-50 rounded border border-slate-200 space-y-1">
              <span className="text-[10px] text-slate-500 block">Reported Drug Allergies</span>
              <p className="font-bold text-rose-700">{selectedRecord.allergies.join(', ') || 'None'}</p>
            </div>

            <div className="p-2.5 bg-slate-50 rounded border border-slate-200 space-y-1">
              <span className="text-[10px] text-slate-500 block">Emergency Contact</span>
              <p className="font-semibold text-slate-800">{selectedRecord.phone}</p>
            </div>
          </div>
        </div>
      )}

      {/* Appointment-Styled Enterprise DataTable */}
      <DataTable<DoctorPatient>
        data={filteredPatients}
        columns={columns}
        keyExtractor={(item) => item.uhid}
        searchPlaceholder="Search EMR files by patient name, UHID, or comorbidity..."
        searchFilter={(item, query) =>
          item.name.toLowerCase().includes(query.toLowerCase()) ||
          item.uhid.toLowerCase().includes(query.toLowerCase()) ||
          item.diagnosis.toLowerCase().includes(query.toLowerCase()) ||
          item.chronicDiseases.some((cd) => cd.toLowerCase().includes(query.toLowerCase()))
        }
        filters={toolbarFilters}
        emptyMessage="No clinical records found."
        onRowClick={(item) => setSelectedRecord(item)}
        showSerial={true}
      />
    </div>
  );
};
