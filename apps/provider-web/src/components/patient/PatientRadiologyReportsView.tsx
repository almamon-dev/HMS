import {
  CheckCircle2,
  Download,
  Eye,
  Printer,
  Scan,
  X,
  ZoomIn,
} from 'lucide-react';
import React, { useMemo, useState } from 'react';
import {
  CURRENT_PATIENT,
  PATIENT_RADIOLOGY_REPORTS,
  PatientRadiologyItem,
} from '../../data/patientPortalData';
import { DataTable, DataTableColumn } from '../common/DataTable';
import { DropdownSelect } from '../common/DropdownSelect';
import { SummaryCard, SummaryCardGrid } from '../common/SummaryCard';

export const PatientRadiologyReportsView: React.FC = () => {
  const [reports] = useState<PatientRadiologyItem[]>(PATIENT_RADIOLOGY_REPORTS);
  const [modalityFilter, setModalityFilter] = useState('All');
  const [selectedReport, setSelectedReport] = useState<PatientRadiologyItem | null>(null);

  const stats = useMemo(() => {
    const total = reports.length;
    const echo = reports.filter((r) => r.modality === 'Echocardiogram').length;
    const xray = reports.filter((r) => r.modality === 'X-Ray').length;
    const ready = reports.filter((r) => r.status === 'Report Ready').length;
    return { total, echo, xray, ready };
  }, [reports]);

  const filteredReports = useMemo(() => {
    if (modalityFilter === 'All') return reports;
    return reports.filter((r) => r.modality === modalityFilter);
  }, [reports, modalityFilter]);

  const columns: DataTableColumn<PatientRadiologyItem>[] = [
    {
      key: 'studyId',
      header: 'Study ID',
      sortable: true,
      sortValue: (r) => r.studyId,
      render: (r) => (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setSelectedReport(r);
          }}
          className="font-bold text-[#006a4e] hover:underline text-left cursor-pointer whitespace-nowrap"
        >
          {r.studyId}
        </button>
      ),
    },
    {
      key: 'scanName',
      header: 'Radiological Examination',
      sortable: true,
      sortValue: (r) => r.scanName,
      render: (r) => (
        <div>
          <div className="font-semibold text-slate-900">{r.scanName}</div>
          <div className="text-[10px] text-slate-500">Performed by {r.performingDoctor}</div>
        </div>
      ),
    },
    {
      key: 'modality',
      header: 'Modality',
      sortable: true,
      sortValue: (r) => r.modality,
      render: (r) => (
        <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold bg-emerald-50 text-[#006a4e] border border-[#006a4e]/20">
          {r.modality}
        </span>
      ),
    },
    {
      key: 'date',
      header: 'Exam Date',
      sortable: true,
      sortValue: (r) => r.date,
      render: (r) => (
        <span className="text-slate-700 whitespace-nowrap text-xs font-medium">
          {r.date}
        </span>
      ),
    },
    {
      key: 'impression',
      header: 'Radiologist Impression',
      render: (r) => (
        <span className="text-slate-800 font-medium block truncate max-w-sm" title={r.impression}>
          {r.impression}
        </span>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      sortable: true,
      sortValue: (r) => r.status,
      render: (r) => (
        <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-semibold bg-emerald-50 text-[#006a4e]">
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
            onClick={() => setSelectedReport(r)}
            className="p-1 hover:bg-[#edf6f2] text-[#006a4e] rounded transition-colors cursor-pointer"
            title="View PACS Study & Impression"
          >
            <Eye className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => alert(`Downloading PDF report: ${r.studyId}`)}
            className="p-1 hover:bg-slate-100 text-slate-600 rounded transition-colors cursor-pointer"
            title="Download Official Report"
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
          title="Total Imaging Studies"
          icon={Scan}
          iconColor="text-[#006a4e]"
          value={`${stats.total} Scans`}
          subtitle="Digital PACS archived"
        />
        <SummaryCard
          title="Echocardiography"
          icon={Scan}
          iconColor="text-[#006a4e]"
          value={`${stats.echo} 2D Doppler`}
          valueColor="text-[#006a4e]"
          subtitle="Cardiology imaging"
        />
        <SummaryCard
          title="Digital X-Ray"
          icon={Scan}
          iconColor="text-cyan-600"
          value={`${stats.xray} PA Views`}
          valueColor="text-cyan-700"
          subtitle="High-resolution digital"
        />
        <SummaryCard
          title="PACS DICOM Ready"
          icon={CheckCircle2}
          iconColor="text-emerald-600"
          value="100% Available"
          valueColor="text-emerald-700"
          subtitle="Instant cloud viewer"
        />
      </SummaryCardGrid>

      {/* Main Table Card */}
      <div className="bg-white border border-slate-300 rounded-[3px] shadow-xs">
        <div className="p-2 sm:p-2.5 border-b border-slate-200 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-800">Filter Modality:</span>
            <DropdownSelect
              options={[
                { value: 'All', label: 'All Modalities' },
                { value: 'Echocardiogram', label: 'Echocardiogram' },
                { value: 'X-Ray', label: 'Digital X-Ray' },
                { value: 'CT Scan', label: 'CT Scan' },
                { value: 'MRI', label: 'MRI' },
                { value: 'Ultrasound', label: 'Ultrasound' },
              ]}
              value={modalityFilter}
              onChange={setModalityFilter}
              className="w-44"
            />
          </div>
          <span className="text-[11px] text-slate-500">
            Showing {filteredReports.length} of {reports.length} radiology studies
          </span>
        </div>

        <DataTable
          columns={columns}
          data={filteredReports}
          keyExtractor={(item) => item.id}
          searchPlaceholder="Search by study id, test name or doctor..."
          searchFilter={(item, query) =>
            item.studyId.toLowerCase().includes(query.toLowerCase()) ||
            item.scanName.toLowerCase().includes(query.toLowerCase()) ||
            item.performingDoctor.toLowerCase().includes(query.toLowerCase())
          }
          defaultSort={{ key: 'date', order: 'desc' }}
          showSerial={true}
          emptyMessage="No radiology studies found."
          onRowClick={(item) => setSelectedReport(item)}
        />
      </div>

      {/* Quick View Details Card */}
      {selectedReport && (
        <div className="bg-white border border-[#006a4e]/25 rounded-[3px] p-3 shadow-xs">
          <div className="flex items-center justify-between border-b border-slate-200 pb-2 mb-2">
            <div className="flex items-center gap-2">
              <Scan className="w-4 h-4 text-[#006a4e]" />
              <h4 className="text-xs font-bold text-slate-900">
                Imaging Study: {selectedReport.scanName} ({selectedReport.studyId})
              </h4>
            </div>
            <button
              type="button"
              onClick={() => setSelectedReport(null)}
              className="text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="space-y-1.5 text-xs">
              <div>
                <span className="text-slate-500 block text-[10px]">Patient:</span>
                <span className="font-bold text-slate-800">{CURRENT_PATIENT.name} ({CURRENT_PATIENT.uhid})</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px]">Exam Date:</span>
                <span className="font-semibold text-slate-800">{selectedReport.date}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px]">Reporting Specialist:</span>
                <span className="font-semibold text-slate-800">{selectedReport.performingDoctor}</span>
              </div>
            </div>

            <div className="md:col-span-2 space-y-2">
              <div>
                <span className="text-slate-500 block text-[10px]">Clinical Impression &amp; Findings:</span>
                <div className="p-2.5 bg-slate-50 border border-slate-200 rounded text-xs text-slate-800 leading-relaxed font-mono">
                  {selectedReport.impression}
                </div>
              </div>
              <div className="flex items-center gap-2 justify-end pt-1">
                <button
                  type="button"
                  onClick={() => alert(`Opening PACS DICOM Viewer for ${selectedReport.studyId}`)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#006a4e] hover:bg-[#00523d] text-white text-xs font-bold rounded cursor-pointer transition-colors"
                >
                  <ZoomIn className="w-3.5 h-3.5" />
                  Launch Web PACS Viewer
                </button>
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded cursor-pointer transition-colors"
                >
                  <Printer className="w-3.5 h-3.5" />
                  Print Study Slip
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
