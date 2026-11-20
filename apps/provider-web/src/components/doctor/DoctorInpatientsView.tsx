import {
  Activity,
  Bed,
  CheckCircle2,
  FileEdit,
  Heart,
  X,
} from 'lucide-react';
import React, { useMemo, useState } from 'react';
import { DOCTOR_INPATIENTS, DoctorInpatient } from '../../data/doctorPortalData';
import { DataTable, DataTableColumn } from '../common/DataTable';
import { DropdownSelect } from '../common/DropdownSelect';
import { SummaryCard, SummaryCardGrid } from '../common/SummaryCard';

export const DoctorInpatientsView: React.FC = () => {
  const [inpatients, setInpatients] = useState<DoctorInpatient[]>(DOCTOR_INPATIENTS);
  const [conditionFilter, setConditionFilter] = useState('All');
  const [selectedPatient, setSelectedPatient] = useState<DoctorInpatient | null>(null);
  const [showProgressModal, setShowProgressModal] = useState(false);
  const [dailyNote, setDailyNote] = useState('');

  // 4 Superadmin-Styled KPI Cards
  const stats = useMemo(() => {
    const total = inpatients.length;
    const critical = inpatients.filter((ip) => ip.condition === 'Critical Monitoring').length;
    const cabins = inpatients.filter((ip) => ip.wardBed.includes('Cabin')).length;
    const ready = inpatients.filter((ip) => ip.condition === 'Discharge Ready').length;
    return { total, critical, cabins, ready };
  }, [inpatients]);

  const filteredInpatients = useMemo(() => {
    return inpatients.filter((ip) => {
      const matchesCondition = conditionFilter === 'All' || ip.condition === conditionFilter;
      return matchesCondition;
    });
  }, [inpatients, conditionFilter]);

  const handleSaveProgressNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPatient || !dailyNote.trim()) return;

    setInpatients((prev) =>
      prev.map((p) =>
        p.id === selectedPatient.id
          ? { ...p, dailyProgressNote: dailyNote.trim() }
          : p
      )
    );
    setSelectedPatient((prev) =>
      prev ? { ...prev, dailyProgressNote: dailyNote.trim() } : null
    );
    setShowProgressModal(false);
    setDailyNote('');
  };

  const handleClearDischarge = (id: string) => {
    setInpatients((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, condition: 'Discharge Ready' } : p
      )
    );
  };

  const columns: DataTableColumn<DoctorInpatient>[] = [
    {
      key: 'wardBed',
      header: 'Bed / Ward Location',
      sortable: true,
      sortValue: (r) => r.wardBed,
      render: (r) => (
        <span className="font-extrabold text-[#006a4e] whitespace-nowrap">
          {r.wardBed}
        </span>
      ),
    },
    {
      key: 'patientName',
      header: 'IPD No. & Patient Name',
      sortable: true,
      sortValue: (r) => r.patientName,
      render: (r) => (
        <div>
          <div className="font-bold text-slate-900 leading-tight">{r.patientName}</div>
          <div className="text-[11px] text-slate-500">
            {r.ipdNumber} • {r.uhid} ({r.age}y/{r.gender})
          </div>
        </div>
      ),
    },
    {
      key: 'admissionDate',
      header: 'Admission Date',
      sortable: true,
      sortValue: (r) => r.admissionDate,
      render: (r) => (
        <span className="text-slate-600 whitespace-nowrap">
          {r.admissionDate}
        </span>
      ),
    },
    {
      key: 'primaryDiagnosis',
      header: 'Primary Clinical Diagnosis',
      render: (r) => (
        <div className="text-slate-800 font-medium max-w-xs truncate" title={r.primaryDiagnosis}>
          {r.primaryDiagnosis}
        </div>
      ),
    },
    {
      key: 'condition',
      header: 'Clinical Condition',
      sortable: true,
      sortValue: (r) => r.condition,
      render: (r) => (
        <span
          className={`px-2 py-0.5 rounded-full text-[10px] font-semibold whitespace-nowrap ${r.condition === 'Critical Monitoring'
            ? 'bg-rose-100 text-rose-800'
            : r.condition === 'Discharge Ready'
              ? 'bg-emerald-100 text-emerald-800'
              : 'bg-sky-100 text-sky-800'
            }`}
        >
          {r.condition}
        </span>
      ),
    },
    {
      key: 'attendingNurse',
      header: 'Attending Nurse',
      render: (r) => (
        <span className="text-slate-500 whitespace-nowrap">
          {r.attendingNurse}
        </span>
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      align: 'right',
      render: (r) => (
        <div className="flex items-center justify-end gap-1.5 whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
          <button
            type="button"
            onClick={() => {
              setSelectedPatient(r);
              setDailyNote(r.dailyProgressNote);
              setShowProgressModal(true);
            }}
            className="px-2 py-0.5 rounded bg-[#006a4e] hover:bg-[#00553e] text-white text-[11px] font-semibold transition-colors cursor-pointer inline-flex items-center gap-1"
          >
            <FileEdit className="w-3 h-3" />
            <span>Round Note</span>
          </button>

          {r.condition !== 'Discharge Ready' && (
            <button
              type="button"
              onClick={() => handleClearDischarge(r.id)}
              className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100 text-[11px] font-semibold transition-colors cursor-pointer"
            >
              Discharge
            </button>
          )}
        </div>
      ),
    },
  ];

  const toolbarFilters = (
    <DropdownSelect
      value={conditionFilter}
      onChange={(val) => setConditionFilter(val)}
      width="w-44"
      options={[
        { label: 'All Conditions', value: 'All' },
        { label: 'Critical Monitoring', value: 'Critical Monitoring' },
        { label: 'Improving', value: 'Improving' },
        { label: 'Stable', value: 'Stable' },
        { label: 'Discharge Ready', value: 'Discharge Ready' },
      ]}
    />
  );

  return (
    <div className="space-y-2">
      {/* 4 Summary Metric Cards matching Appointment format */}
      <SummaryCardGrid>
        <SummaryCard
          title="Total Admitted"
          icon={Bed}
          iconColor="text-[#006a4e]"
          value={`${stats.total} Inpatients`}
          subtitle="Under Dr. Tanvir Ahmed care"
        />
        <SummaryCard
          title="Critical ICU Watch"
          icon={Activity}
          iconColor="text-rose-600"
          value={`${stats.critical} Critical`}
          valueColor="text-rose-700"
          subtitle="Intensive cardiac unit telemetry"
        />
        <SummaryCard
          title="Cabins & Step-Down"
          icon={Heart}
          iconColor="text-cyan-600"
          value={`${stats.cabins} Cabins`}
          valueColor="text-cyan-700"
          subtitle="Post-coronary intervention recovery"
        />
        <SummaryCard
          title="Discharge Ready"
          icon={CheckCircle2}
          iconColor="text-emerald-600"
          value={`${stats.ready} Stable`}
          valueColor="text-emerald-700"
          subtitle="Summaries ready for sign-off"
        />
      </SummaryCardGrid>

      {/* Appointment-Styled Enterprise DataTable */}
      <DataTable<DoctorInpatient>
        data={filteredInpatients}
        columns={columns}
        keyExtractor={(item) => item.id}
        searchPlaceholder="Search by IPD number, patient name, bed location..."
        searchFilter={(item, query) =>
          item.ipdNumber.toLowerCase().includes(query.toLowerCase()) ||
          item.patientName.toLowerCase().includes(query.toLowerCase()) ||
          item.uhid.toLowerCase().includes(query.toLowerCase()) ||
          item.wardBed.toLowerCase().includes(query.toLowerCase()) ||
          item.primaryDiagnosis.toLowerCase().includes(query.toLowerCase())
        }
        filters={toolbarFilters}
        emptyMessage="No inpatients found matching the selected condition."
        onRowClick={(item) => setSelectedPatient(item)}
        showSerial={true}
      />

      {/* Progress Round Note Modal */}
      {showProgressModal && selectedPatient && (
        <div className="fixed inset-0 z-50 bg-slate-950/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl border border-slate-200 w-full max-w-lg overflow-hidden animate-in fade-in duration-150">
            <div className="px-5 py-3.5 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  Daily IPD Round Note: {selectedPatient.patientName}
                </h3>
                <span className="text-[11px] text-slate-500">
                  {selectedPatient.wardBed} • {selectedPatient.ipdNumber}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setShowProgressModal(false)}
                className="p-1 rounded-md text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveProgressNote} className="p-5 space-y-3.5 text-xs">
              <div>
                <span className="text-[11px] font-semibold text-slate-500 block mb-1">
                  Primary Admitting Diagnosis
                </span>
                <p className="p-2 rounded bg-slate-50 border border-slate-200 text-slate-800 font-bold">
                  {selectedPatient.primaryDiagnosis}
                </p>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  Clinical Progress Note (Subjective, Objective, Assessment, Plan) *
                </label>
                <textarea
                  required
                  rows={4}
                  value={dailyNote}
                  onChange={(e) => setDailyNote(e.target.value)}
                  placeholder="Record vitals, fluid balance, auscultation, medications changes..."
                  className="w-full px-3 py-2 border border-slate-200 rounded-md text-xs focus:outline-none focus:border-[#006a4e]"
                />
              </div>

              <div>
                <span className="text-[11px] font-semibold text-slate-500 block mb-1">
                  Diet & Fluid Protocol
                </span>
                <p className="p-2 rounded bg-emerald-50/50 border border-emerald-100 text-emerald-950">
                  {selectedPatient.dietAdvice}
                </p>
              </div>

              <div className="pt-2 border-t border-slate-200 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowProgressModal(false)}
                  className="px-3.5 py-1.5 rounded-md border border-slate-200 text-slate-700 hover:bg-slate-100 text-xs font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-md bg-[#006a4e] hover:bg-[#00553e] text-white text-xs font-bold cursor-pointer shadow-xs"
                >
                  Save Round Note
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
