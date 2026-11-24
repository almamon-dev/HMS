import React, { useState } from 'react';
import {
  AlertTriangle,
  Barcode,
  CheckCircle,
  FileText,
  Microscope,
  Printer,
  RefreshCw,
  TestTube2,
  X,
} from 'lucide-react';
import { DataTable, DataTableColumn } from '../common/DataTable';
import {
  LAB_PATIENT_REQUESTS_DATA,
  LAB_SAMPLE_TRACKING_DATA,
  LabPatientRequest,
  LabSampleItem,
} from '../../data/pathologistPortalData';

interface PathologistWorklistViewProps {
  initialSubTab?: 'requests' | 'processing' | 'samples';
}

export const PathologistWorklistView: React.FC<PathologistWorklistViewProps> = ({
  initialSubTab = 'requests',
}) => {
  const [selectedBarcodeSample, setSelectedBarcodeSample] = useState<LabSampleItem | null>(null);

  // Tab 1: Patient Requests Columns
  const requestColumns: DataTableColumn<LabPatientRequest>[] = [
    {
      key: 'orderNo',
      header: 'Order No & Date',
      sortable: true,
      sortValue: (r) => r.orderNo,
      render: (r) => (
        <div>
          <span className="font-mono font-bold text-teal-800 text-xs block">{r.orderNo}</span>
          <div className="text-[10.5px] text-slate-500 font-mono mt-0.5">
            <span>{r.requestedAt}</span> · <span>BC: {r.sampleBarcode}</span>
          </div>
        </div>
      ),
    },
    {
      key: 'patientName',
      header: 'Patient & UHID',
      sortable: true,
      sortValue: (r) => r.patientName,
      render: (r) => (
        <div>
          <div className="flex items-center gap-1.5">
            <span className="font-bold text-slate-900 text-xs">{r.patientName}</span>
            <span className="px-1.5 py-0.2 rounded font-mono text-[10px] font-semibold bg-slate-100 text-slate-700">
              {r.uhid}
            </span>
          </div>
          <div className="text-[11px] text-slate-500 font-medium mt-0.5">
            <span>{r.ageGender}</span> · <span className="text-[#006a4e] font-semibold">{r.source}</span>
          </div>
        </div>
      ),
    },
    {
      key: 'testsOrdered',
      header: 'Tests Ordered',
      render: (r) => (
        <div className="flex flex-wrap gap-1 max-w-xs">
          {r.testsOrdered.map((t, idx) => (
            <span
              key={idx}
              className="px-2 py-0.5 bg-teal-50 border border-teal-200 text-teal-900 text-[10.5px] rounded font-medium"
            >
              {t}
            </span>
          ))}
        </div>
      ),
    },
    {
      key: 'referringDoctor',
      header: 'Referring Doctor & Clinical Indication',
      sortable: true,
      sortValue: (r) => r.referringDoctor,
      render: (r) => (
        <div className="max-w-xs">
          <span className="font-semibold text-slate-800 text-xs block">{r.referringDoctor}</span>
          <span className="text-slate-600 text-[11px] italic line-clamp-1">
            "{r.clinicalIndication}"
          </span>
        </div>
      ),
    },
    {
      key: 'sampleStatus',
      header: 'Specimen Status',
      sortable: true,
      sortValue: (r) => r.sampleStatus,
      render: (r) => (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
          <CheckCircle size={11} />
          {r.sampleStatus}
        </span>
      ),
    },
    {
      key: 'priority',
      header: 'Priority',
      align: 'right',
      sortable: true,
      sortValue: (r) => (r.priority === 'STAT / Emergency' ? 0 : 1),
      render: (r) => (
        <span
          className={`inline-block px-2 py-0.5 rounded text-[10.5px] font-bold ${
            r.priority === 'STAT / Emergency'
              ? 'bg-rose-100 text-rose-700 border border-rose-200'
              : 'bg-amber-50 text-amber-700 border border-amber-200'
          }`}
        >
          {r.priority}
        </span>
      ),
    },
  ];

  // Tab 2: Processing Queue Columns
  const processingColumns: DataTableColumn<LabSampleItem>[] = [
    {
      key: 'barcode',
      header: 'Barcode & Tube Type',
      sortable: true,
      sortValue: (r) => r.barcode,
      render: (r) => (
        <div>
          <span className="font-mono font-bold text-slate-900 text-xs block">{r.barcode}</span>
          <span className="text-[10.5px] text-slate-500 font-mono">{r.tubeType}</span>
        </div>
      ),
    },
    {
      key: 'patientName',
      header: 'Patient & UHID',
      sortable: true,
      sortValue: (r) => r.patientName,
      render: (r) => (
        <div>
          <span className="font-bold text-slate-900 text-xs block">{r.patientName}</span>
          <span className="text-[11px] text-slate-500 font-mono">{r.uhid}</span>
        </div>
      ),
    },
    {
      key: 'testName',
      header: 'Assay Investigation',
      sortable: true,
      sortValue: (r) => r.testName,
      render: (r) => (
        <div>
          <span className="font-semibold text-slate-800 text-xs block">{r.testName}</span>
          <span className="text-[11px] text-slate-500">{r.sampleType}</span>
        </div>
      ),
    },
    {
      key: 'analyzer',
      header: 'Target Analyzer Machine',
      render: (_, idx = 0) => (
        <div>
          <span className="font-medium text-slate-800 text-xs block">
            {idx === 0
              ? 'Sysmex XN-1000 Automated Hematology'
              : idx === 1
              ? 'Roche Cobas e411 ECLIA'
              : idx === 2
              ? 'Beckman AU480 Clinical Chemistry'
              : 'Stago Compact Max Coagulation'}
          </span>
          <span className="text-[10.5px] text-teal-700 font-mono">Channel Calibrated</span>
        </div>
      ),
    },
    {
      key: 'progress',
      header: 'Assay Progress',
      render: (_, idx = 0) => (
        <div className="flex items-center gap-2">
          <div className="w-24 bg-slate-100 rounded-full h-1.5 overflow-hidden">
            <div
              className="bg-[#006a4e] h-full rounded-full"
              style={{ width: `${(idx + 1) * 25}%` }}
            />
          </div>
          <span className="text-[10.5px] font-mono text-slate-500">
            {(idx + 1) * 25}%
          </span>
        </div>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      align: 'right',
      render: () => (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-[11px] font-semibold bg-sky-50 text-sky-700 border border-sky-200">
          <RefreshCw size={11} className="animate-spin" />
          In Automated Run
        </span>
      ),
    },
  ];

  // Tab 3: Sample Tracking Columns
  const sampleColumns: DataTableColumn<LabSampleItem>[] = [
    {
      key: 'barcode',
      header: 'Barcode & Tube Type',
      sortable: true,
      sortValue: (r) => r.barcode,
      render: (r) => (
        <div>
          <span className="font-mono font-bold text-teal-900 text-xs block">{r.barcode}</span>
          <span className="inline-block mt-0.5 px-2 py-0.2 rounded text-[10px] font-medium bg-slate-100 text-slate-700">
            {r.tubeType}
          </span>
        </div>
      ),
    },
    {
      key: 'patientName',
      header: 'Patient & UHID',
      sortable: true,
      sortValue: (r) => r.patientName,
      render: (r) => (
        <div>
          <span className="font-bold text-slate-900 text-xs block">{r.patientName}</span>
          <span className="text-[11px] text-slate-500 font-mono">{r.uhid}</span>
        </div>
      ),
    },
    {
      key: 'testName',
      header: 'Assay Specimen',
      sortable: true,
      sortValue: (r) => r.testName,
      render: (r) => (
        <div>
          <span className="font-semibold text-slate-800 text-xs block">{r.testName}</span>
          <span className="text-[11px] text-slate-500 font-medium">{r.sampleType}</span>
        </div>
      ),
    },
    {
      key: 'collectedBy',
      header: 'Collection Info',
      sortable: true,
      sortValue: (r) => r.collectedBy,
      render: (r) => (
        <div>
          <span className="text-slate-800 font-medium text-xs block">{r.collectedBy}</span>
          <span className="text-[11px] text-slate-400 font-mono">{r.collectedAt}</span>
        </div>
      ),
    },
    {
      key: 'condition',
      header: 'Specimen Quality Condition',
      sortable: true,
      sortValue: (r) => r.condition,
      render: (r) => (
        <span
          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-[11px] font-semibold ${
            r.condition === 'Optimal'
              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
              : r.condition === 'Mildly Lipemic'
              ? 'bg-amber-50 text-amber-700 border border-amber-200'
              : 'bg-rose-50 text-rose-700 border border-rose-200'
          }`}
        >
          {r.condition === 'Optimal' ? <CheckCircle size={11} /> : <AlertTriangle size={11} />}
          {r.condition}
        </span>
      ),
    },
    {
      key: 'actions',
      header: 'Barcode Action',
      align: 'right',
      render: (r) => (
        <button
          type="button"
          onClick={() => setSelectedBarcodeSample(r)}
          className="px-3 py-1.5 rounded-lg bg-white border border-slate-300 hover:bg-slate-50 font-semibold text-slate-700 text-xs transition-colors shadow-xs inline-flex items-center gap-1 cursor-pointer"
        >
          <Barcode size={14} className="text-teal-700" />
          <span>Print Barcode</span>
        </button>
      ),
    },
  ];

  return (
    <div className="space-y-6 font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Dynamic Dedicated Header based on the active sidebar menu (No duplicate tabs) */}
      {initialSubTab === 'requests' && (
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-slate-900 flex items-center gap-2.5">
              <FileText size={24} className="text-[#006a4e]" />
              <span>Patient Test Requests & Clinical Indications</span>
            </h1>
            <p className="text-xs md:text-sm text-slate-500 mt-1">
              Patient demographics, clinical indication notes, ordered investigations, and requisition status.
            </p>
          </div>
        </div>
      )}

      {initialSubTab === 'processing' && (
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-slate-900 flex items-center gap-2.5">
              <Microscope size={24} className="text-[#006a4e]" />
              <span>Automated Test Processing Queue</span>
            </h1>
            <p className="text-xs md:text-sm text-slate-500 mt-1">
              Live automated analyzer queues (Sysmex, Cobas, Beckman, Stago) and run execution status.
            </p>
          </div>
        </div>
      )}

      {initialSubTab === 'samples' && (
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-slate-900 flex items-center gap-2.5">
              <TestTube2 size={24} className="text-[#006a4e]" />
              <span>Sample Management & Barcode Tracking</span>
            </h1>
            <p className="text-xs md:text-sm text-slate-500 mt-1">
              Vacutainer tube accessioning, specimen condition verification, and thermal label generation.
            </p>
          </div>
        </div>
      )}

      {/* Main Single-Layer Surface: Standard Hospital DataTable (Clean, no duplicate submenu tabs) */}
      {initialSubTab === 'requests' && (
        <DataTable<LabPatientRequest>
          data={LAB_PATIENT_REQUESTS_DATA}
          columns={requestColumns}
          showSerial={true}
          searchPlaceholder="Search by patient, UHID, barcode, doctor..."
          searchFilter={(r, q) =>
            r.patientName.toLowerCase().includes(q) ||
            r.uhid.toLowerCase().includes(q) ||
            r.sampleBarcode.toLowerCase().includes(q) ||
            r.referringDoctor.toLowerCase().includes(q)
          }
        />
      )}

      {initialSubTab === 'processing' && (
        <DataTable<LabSampleItem>
          data={LAB_SAMPLE_TRACKING_DATA}
          columns={processingColumns}
          showSerial={true}
          searchPlaceholder="Search analyzer queue by barcode, test, patient..."
          searchFilter={(r, q) =>
            r.patientName.toLowerCase().includes(q) ||
            r.barcode.toLowerCase().includes(q) ||
            r.testName.toLowerCase().includes(q)
          }
        />
      )}

      {initialSubTab === 'samples' && (
        <DataTable<LabSampleItem>
          data={LAB_SAMPLE_TRACKING_DATA}
          columns={sampleColumns}
          showSerial={true}
          searchPlaceholder="Search samples by barcode, patient, tube..."
          searchFilter={(r, q) =>
            r.patientName.toLowerCase().includes(q) ||
            r.barcode.toLowerCase().includes(q) ||
            r.uhid.toLowerCase().includes(q) ||
            r.testName.toLowerCase().includes(q)
          }
        />
      )}

      {/* Barcode Print Preview Modal */}
      {selectedBarcodeSample && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <span className="font-bold text-slate-800 text-sm flex items-center gap-2">
                <Barcode size={18} className="text-[#006a4e]" />
                <span>Thermal Tube Label</span>
              </span>
              <button
                type="button"
                onClick={() => setSelectedBarcodeSample(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X size={18} />
              </button>
            </div>

            {/* Label Simulation */}
            <div className="bg-white p-4 border-2 border-dashed border-slate-300 rounded-xl space-y-2 text-center">
              <div className="text-[11px] font-bold text-slate-800 uppercase tracking-wider">
                GREEN LIFE HOSPITAL LAB
              </div>
              <div className="font-mono text-xl font-extrabold tracking-widest py-2 bg-slate-100 rounded">
                |||||| | ||||| |||
              </div>
              <div className="font-mono font-bold text-sm text-slate-900">
                {selectedBarcodeSample.barcode}
              </div>
              <div className="text-xs font-bold text-slate-800 text-left pt-1 border-t border-slate-200">
                {selectedBarcodeSample.patientName}
              </div>
              <div className="flex justify-between text-[11px] font-mono text-slate-500">
                <span>{selectedBarcodeSample.uhid}</span>
                <span>{selectedBarcodeSample.tubeType.split(' ')[0]}</span>
              </div>
              <div className="text-left text-[11px] text-teal-800 font-semibold truncate">
                Test: {selectedBarcodeSample.testName}
              </div>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => setSelectedBarcodeSample(null)}
                className="flex-1 py-2 border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-xl"
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => {
                  alert('Barcode sent to Zebra thermal lab printer.');
                  setSelectedBarcodeSample(null);
                }}
                className="flex-1 py-2 bg-[#006a4e] hover:bg-[#00523c] text-white text-xs font-bold rounded-xl flex items-center justify-center gap-1.5"
              >
                <Printer size={13} />
                <span>Print Label</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
