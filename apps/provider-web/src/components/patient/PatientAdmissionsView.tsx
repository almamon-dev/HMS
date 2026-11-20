import {
  Bed,
  CheckCircle2,
  Download,
  Eye,
  FileText,
  Printer,
  User,
  X,
} from 'lucide-react';
import React, { useMemo, useState } from 'react';
import {
  CURRENT_PATIENT,
  PATIENT_ADMISSIONS,
  PatientAdmissionItem,
} from '../../data/patientPortalData';
import { DataTable, DataTableColumn } from '../common/DataTable';
import { SummaryCard, SummaryCardGrid } from '../common/SummaryCard';

export const PatientAdmissionsView: React.FC = () => {
  const [admissions] = useState<PatientAdmissionItem[]>(PATIENT_ADMISSIONS);
  const [selectedAdmission, setSelectedAdmission] = useState<PatientAdmissionItem | null>(null);
  const [isSummaryModalOpen, setIsSummaryModalOpen] = useState(false);

  const stats = useMemo(() => {
    const total = admissions.length;
    const discharged = admissions.filter((a) => a.status === 'Discharged').length;
    const lastStay = admissions[0] || null;
    return {
      total,
      discharged,
      lastRoom: lastStay?.wardRoom || 'N/A',
      consultant: lastStay?.attendingConsultant || 'N/A',
    };
  }, [admissions]);

  const columns: DataTableColumn<PatientAdmissionItem>[] = [
    {
      key: 'admissionNo',
      header: 'Admission No',
      sortable: true,
      sortValue: (r) => r.admissionNo,
      render: (r) => (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setSelectedAdmission(r);
            setIsSummaryModalOpen(true);
          }}
          className="font-bold text-[#006a4e] hover:underline text-left cursor-pointer whitespace-nowrap"
        >
          {r.admissionNo}
        </button>
      ),
    },
    {
      key: 'wardRoom',
      header: 'Ward / Cabin',
      sortable: true,
      sortValue: (r) => r.wardRoom,
      render: (r) => (
        <span className="font-semibold text-slate-900 text-xs">{r.wardRoom}</span>
      ),
    },
    {
      key: 'primaryDiagnosis',
      header: 'Primary Diagnosis & Condition',
      render: (r) => (
        <span className="text-slate-800 font-medium block truncate max-w-sm" title={r.primaryDiagnosis}>
          {r.primaryDiagnosis}
        </span>
      ),
    },
    {
      key: 'attendingConsultant',
      header: 'Attending Consultant',
      sortable: true,
      sortValue: (r) => r.attendingConsultant,
      render: (r) => (
        <span className="text-slate-800 text-xs font-semibold">
          {r.attendingConsultant}
        </span>
      ),
    },
    {
      key: 'admissionDate',
      header: 'Admitted',
      sortable: true,
      sortValue: (r) => r.admissionDate,
      render: (r) => (
        <span className="text-slate-700 whitespace-nowrap text-xs font-medium">
          {r.admissionDate}
        </span>
      ),
    },
    {
      key: 'dischargeDate',
      header: 'Discharged',
      sortable: true,
      sortValue: (r) => r.dischargeDate,
      render: (r) => (
        <span className="text-slate-700 whitespace-nowrap text-xs font-medium">
          {r.dischargeDate}
        </span>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      sortable: true,
      sortValue: (r) => r.status,
      render: (r) => (
        <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-semibold bg-slate-100 text-slate-700">
          <CheckCircle2 className="w-2.5 h-2.5 text-[#006a4e]" />
          {r.status}
        </span>
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      align: 'right',
      render: (r) => (
        <div className="flex items-center justify-end gap-1" onClick={(e) => e.stopPropagation()}>
          <button
            type="button"
            onClick={() => {
              setSelectedAdmission(r);
              setIsSummaryModalOpen(true);
            }}
            className="p-1 hover:bg-[#edf6f2] text-[#006a4e] rounded transition-colors cursor-pointer"
            title="View Discharge Summary"
          >
            <Eye className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => alert(`Downloading Discharge Summary PDF for ${r.admissionNo}`)}
            className="p-1 hover:bg-slate-100 text-slate-600 rounded transition-colors cursor-pointer"
            title="Download Discharge Summary"
          >
            <Download className="w-3.5 h-3.5" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-2">
      {/* 4 Summary Metric Cards */}
      <SummaryCardGrid>
        <SummaryCard
          title="Total Inpatient Stays"
          icon={Bed}
          iconColor="text-[#006a4e]"
          value={`${stats.total} Admissions`}
          subtitle="Historical IPD episodes"
        />
        <SummaryCard
          title="Last Ward / Cabin"
          icon={Bed}
          iconColor="text-cyan-600"
          value={stats.lastRoom}
          valueColor="text-cyan-700"
          subtitle="Cardiology Inpatient Wing"
        />
        <SummaryCard
          title="Attending Consultant"
          icon={User}
          iconColor="text-[#006a4e]"
          value={stats.consultant}
          subtitle="Department of Cardiology"
        />
        <SummaryCard
          title="Discharge Status"
          icon={CheckCircle2}
          iconColor="text-emerald-600"
          value="Discharged Stable"
          valueColor="text-emerald-700"
          subtitle="All summaries signed"
        />
      </SummaryCardGrid>

      {/* Main Table Card */}
      <div className="bg-white border border-slate-300 rounded-[3px] shadow-xs">
        <div className="p-2 sm:p-2.5 border-b border-slate-200 flex flex-wrap items-center justify-between gap-2">
          <span className="text-xs font-bold text-slate-800">Inpatient Admission Records:</span>
          <span className="text-[11px] text-slate-500">
            Showing {admissions.length} historical hospital admissions
          </span>
        </div>

        <DataTable<PatientAdmissionItem>
          columns={columns}
          data={admissions}
          keyExtractor={(item) => item.id}
          searchPlaceholder="Search by admission number, diagnosis or consultant..."
          searchFilter={(item, query) =>
            item.admissionNo.toLowerCase().includes(query.toLowerCase()) ||
            item.primaryDiagnosis.toLowerCase().includes(query.toLowerCase()) ||
            item.attendingConsultant.toLowerCase().includes(query.toLowerCase())
          }
          defaultSort={{ key: 'admissionDate', order: 'desc' }}
          showSerial={true}
          emptyMessage="No inpatient admissions found on record."
          onRowClick={(item) => {
            setSelectedAdmission(item);
            setIsSummaryModalOpen(true);
          }}
        />
      </div>

      {/* Discharge Summary Modal */}
      {isSummaryModalOpen && selectedAdmission && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/50 backdrop-blur-xs">
          <div className="bg-white rounded-[3px] shadow-2xl max-w-2xl w-full p-4 border border-slate-200 space-y-3 max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-200 pb-2">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-[#006a4e]" />
                <h3 className="text-sm font-bold text-slate-900">
                  Hospital Discharge Summary ({selectedAdmission.admissionNo})
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsSummaryModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Letterhead Summary */}
            <div className="border border-slate-200 rounded p-3 space-y-3 bg-slate-50/50 text-xs">
              <div className="flex justify-between items-center pb-2 border-b border-slate-200">
                <div>
                  <h4 className="font-extrabold text-[#006a4e] text-sm">GreenHospital Medical Center</h4>
                  <p className="text-[10px] text-slate-500">Department of Inpatient Clinical Services</p>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-slate-500 block">IPD Episode No</span>
                  <span className="font-mono font-bold text-slate-800">{selectedAdmission.admissionNo}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-slate-500 block text-[10px]">Patient Name:</span>
                  <span className="font-bold text-slate-900">{CURRENT_PATIENT.name}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px]">UHID:</span>
                  <span className="font-bold text-slate-900 font-mono">{CURRENT_PATIENT.uhid}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px]">Admitted On:</span>
                  <span className="font-medium text-slate-800">{selectedAdmission.admissionDate}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px]">Discharged On:</span>
                  <span className="font-medium text-slate-800">{selectedAdmission.dischargeDate}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px]">Ward / Room:</span>
                  <span className="font-medium text-slate-800">{selectedAdmission.wardRoom}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px]">Attending Consultant:</span>
                  <span className="font-medium text-slate-800">{selectedAdmission.attendingConsultant}</span>
                </div>
              </div>

              <div>
                <span className="text-slate-500 block text-[10px]">Primary Clinical Diagnosis:</span>
                <p className="font-bold text-slate-900 bg-white p-2 border border-slate-200 rounded mt-0.5">
                  {selectedAdmission.primaryDiagnosis}
                </p>
              </div>

              <div>
                <span className="text-slate-500 block text-[10px]">Hospital Stay Course &amp; Treatment:</span>
                <p className="text-slate-700 bg-white p-2 border border-slate-200 rounded mt-0.5 leading-relaxed">
                  Patient presented with chest tightness and exertional dyspnea. Underwent diagnostic coronary angiogram which revealed moderate LAD disease managed medically. Hemodynamics remained stable throughout stay. Vital signs at discharge: BP 130/80 mmHg, Pulse 76 bpm regular.
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-200">
              <button
                type="button"
                onClick={() => window.print()}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded cursor-pointer transition-colors"
              >
                <Printer className="w-3.5 h-3.5" />
                Print Summary
              </button>
              <button
                type="button"
                onClick={() => setIsSummaryModalOpen(false)}
                className="px-4 py-1.5 bg-[#006a4e] hover:bg-[#00523d] text-white text-xs font-bold rounded cursor-pointer transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
