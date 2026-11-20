import {
  CheckCircle2,
  Clock,
  Download,
  FlaskConical,
  Mic,
  Pill,
  Receipt,
  Video,
  Volume2,
} from 'lucide-react';
import React, { useMemo, useState } from 'react';
import {
  PATIENT_APPOINTMENTS,
} from '../../data/patientPortalData';
import { DataTable, DataTableColumn } from '../common/DataTable';
import { DropdownSelect } from '../common/DropdownSelect';
import { SummaryCard, SummaryCardGrid } from '../common/SummaryCard';

interface DownloadableFileItem {
  id: string;
  title: string;
  refNo: string;
  category: 'Prescription' | 'Lab Report' | 'Radiology' | 'Billing Receipt';
  date: string;
  format: 'PDF' | 'ZIP';
  size: string;
}

const DOWNLOADABLE_FILES: DownloadableFileItem[] = [
  {
    id: 'dl-01',
    title: 'Cardiology E-Prescription (Prof. Dr. Tanvir Ahmed)',
    refNo: 'RX-2026-118841',
    category: 'Prescription',
    date: '20 Nov 2026',
    format: 'PDF',
    size: '142 KB',
  },
  {
    id: 'dl-02',
    title: 'Complete Blood Count (CBC) with ESR Official Lab Report',
    refNo: 'LAB-ORD-9902',
    category: 'Lab Report',
    date: '20 Nov 2026',
    format: 'PDF',
    size: '215 KB',
  },
  {
    id: 'dl-03',
    title: '2D & Color Doppler Transthoracic Echocardiogram Report',
    refNo: 'RAD-2026-4412',
    category: 'Radiology',
    date: '20 Nov 2026',
    format: 'PDF',
    size: '520 KB',
  },
  {
    id: 'dl-04',
    title: 'Hospital OPD Consultation Payment Receipt ($50.00)',
    refNo: 'RCP-8841-01',
    category: 'Billing Receipt',
    date: '20 Nov 2026',
    format: 'PDF',
    size: '95 KB',
  },
  {
    id: 'dl-05',
    title: 'Diabetology Follow-up E-Prescription (Dr. Farhana Yasmin)',
    refNo: 'RX-2026-107712',
    category: 'Prescription',
    date: '10 Oct 2026',
    format: 'PDF',
    size: '138 KB',
  },
  {
    id: 'dl-06',
    title: 'Comprehensive Lipid & Fasting Blood Glucose Lab Panel',
    refNo: 'LAB-ORD-9884',
    category: 'Lab Report',
    date: '15 Oct 2026',
    format: 'PDF',
    size: '190 KB',
  },
];

interface PatientServicesViewProps {
  mode?: 'teleconsultation' | 'download-center';
}

export const PatientServicesView: React.FC<PatientServicesViewProps> = ({
  mode = 'teleconsultation',
}) => {
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [teleconsultJoined, setTeleconsultJoined] = useState(false);

  const teleAppointment = PATIENT_APPOINTMENTS.find((a) => a.type === 'Video Teleconsult') || {
    doctorName: 'Dr. Farhana Yasmin',
    department: 'Endocrinology & Diabetology',
    date: '02 Dec 2026',
    slotTime: '06:30 PM',
    appointmentNo: 'APPNO7712',
    room: 'Virtual Room 1',
  };

  const filteredDownloads = useMemo(() => {
    if (categoryFilter === 'All') return DOWNLOADABLE_FILES;
    return DOWNLOADABLE_FILES.filter((f) => f.category === categoryFilter);
  }, [categoryFilter]);

  const downloadColumns: DataTableColumn<DownloadableFileItem>[] = [
    {
      key: 'title',
      header: 'Document Name & Description',
      sortable: true,
      sortValue: (r) => r.title,
      render: (r) => (
        <div>
          <span className="font-bold text-slate-900 block text-xs">{r.title}</span>
          <span className="text-[10px] text-slate-500 font-mono">Ref: {r.refNo}</span>
        </div>
      ),
    },
    {
      key: 'category',
      header: 'Category',
      sortable: true,
      sortValue: (r) => r.category,
      render: (r) => (
        <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold bg-emerald-50 text-[#006a4e] border border-[#006a4e]/20">
          {r.category}
        </span>
      ),
    },
    {
      key: 'date',
      header: 'Date Issued',
      sortable: true,
      sortValue: (r) => r.date,
      render: (r) => (
        <span className="text-slate-700 whitespace-nowrap text-xs font-medium">
          {r.date}
        </span>
      ),
    },
    {
      key: 'size',
      header: 'Size & Format',
      sortable: true,
      sortValue: (r) => r.size,
      render: (r) => (
        <span className="text-slate-600 text-xs font-mono">
          {r.format} · {r.size}
        </span>
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      align: 'right',
      render: (r) => (
        <div className="flex items-center justify-end gap-1.5">
          <button
            type="button"
            onClick={() => alert(`Downloading ${r.title}`)}
            className="inline-flex items-center gap-1 px-2.5 py-1 bg-[#006a4e] hover:bg-[#00523d] text-white text-[11px] font-bold rounded cursor-pointer transition-colors shadow-xs"
          >
            <Download className="w-3 h-3" />
            Download
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-2">
      {/* 4 Summary Metric Cards */}
      <SummaryCardGrid>
        {mode === 'teleconsultation' ? (
          <>
            <SummaryCard
              title="Next Video Call"
              icon={Video}
              iconColor="text-[#006a4e]"
              value="02 Dec 06:30 PM"
              subtitle="Dr. Farhana Yasmin"
            />
            <SummaryCard
              title="Virtual Room"
              icon={Video}
              iconColor="text-cyan-600"
              value={teleAppointment.room}
              valueColor="text-cyan-700"
              subtitle="Encrypted WebRTC Chamber"
            />
            <SummaryCard
              title="Clinical Specialty"
              icon={Clock}
              iconColor="text-amber-600"
              value="Diabetology"
              valueColor="text-amber-700"
              subtitle="Quarterly glycemic review"
            />
            <SummaryCard
              title="Call Readiness"
              icon={CheckCircle2}
              iconColor="text-emerald-600"
              value="HD 1080p Ready"
              valueColor="text-emerald-700"
              subtitle="Audio/video hardware checked"
            />
          </>
        ) : (
          <>
            <SummaryCard
              title="Total Downloads"
              icon={Download}
              iconColor="text-[#006a4e]"
              value={`${DOWNLOADABLE_FILES.length} Files`}
              subtitle="Certified official copies"
            />
            <SummaryCard
              title="Prescriptions"
              icon={Pill}
              iconColor="text-cyan-600"
              value="2 Signed PDFs"
              valueColor="text-cyan-700"
              subtitle="Pharmacy refill ready"
            />
            <SummaryCard
              title="Lab Reports"
              icon={FlaskConical}
              iconColor="text-amber-600"
              value="3 Lab Sheets"
              valueColor="text-amber-700"
              subtitle="Pathology & imaging"
            />
            <SummaryCard
              title="Payment Slips"
              icon={Receipt}
              iconColor="text-emerald-600"
              value="3 Tax Invoices"
              valueColor="text-emerald-700"
              subtitle="Insurance reimbursement"
            />
          </>
        )}
      </SummaryCardGrid>

      {mode === 'teleconsultation' ? (
        /* Video Consultation Chamber Hub */
        <div className="bg-white border border-slate-300 rounded-[3px] p-4 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200 pb-2">
            <div className="flex items-center gap-2">
              <Video className="w-4 h-4 text-[#006a4e]" />
              <h3 className="text-sm font-bold text-slate-900">
                GreenHospital Telehealth Live Chamber
              </h3>
            </div>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-[#006a4e]">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              Secure HIPAA/GDPR Channel
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2 space-y-3">
              <div className="bg-slate-900 rounded-[3px] aspect-video flex flex-col items-center justify-center text-white p-6 relative overflow-hidden">
                {teleconsultJoined ? (
                  <div className="text-center space-y-3">
                    <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-400 flex items-center justify-center mx-auto animate-pulse">
                      <Video className="w-8 h-8 text-emerald-400" />
                    </div>
                    <div>
                      <h4 className="font-bold text-sm">Consultation In Progress</h4>
                      <p className="text-xs text-slate-400">Connected with {teleAppointment.doctorName}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setTeleconsultJoined(false)}
                      className="px-4 py-1.5 bg-rose-600 hover:bg-rose-500 text-white rounded text-xs font-bold cursor-pointer transition-colors"
                    >
                      End Call
                    </button>
                  </div>
                ) : (
                  <div className="text-center space-y-3 max-w-sm">
                    <Video className="w-12 h-12 text-slate-500 mx-auto" />
                    <h4 className="font-bold text-sm text-slate-200">
                      Virtual Chamber Waiting Room
                    </h4>
                    <p className="text-xs text-slate-400">
                      Appointment scheduled on {teleAppointment.date} at {teleAppointment.slotTime}.
                    </p>
                    <button
                      type="button"
                      onClick={() => setTeleconsultJoined(true)}
                      className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#006a4e] hover:bg-[#00523d] text-white rounded text-xs font-bold cursor-pointer transition-colors shadow-xs"
                    >
                      <Video className="w-3.5 h-3.5" />
                      Enter Video Consultation Chamber
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 bg-slate-50 border border-slate-200 rounded space-y-2">
                <h4 className="font-bold text-slate-900">Pre-Consultation Device Check</h4>
                <div className="space-y-1.5 text-slate-700">
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <Video className="w-3.5 h-3.5 text-[#006a4e]" />
                      Web Camera
                    </span>
                    <span className="text-emerald-700 font-bold">Connected</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <Mic className="w-3.5 h-3.5 text-[#006a4e]" />
                      Microphone
                    </span>
                    <span className="text-emerald-700 font-bold">Active (48kHz)</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <Volume2 className="w-3.5 h-3.5 text-[#006a4e]" />
                      Speakers
                    </span>
                    <span className="text-emerald-700 font-bold">Tested</span>
                  </div>
                </div>
              </div>

              <div className="p-3 bg-emerald-50/50 border border-emerald-200 rounded space-y-1.5 text-slate-700">
                <h4 className="font-bold text-[#006a4e]">Consultant Specialist</h4>
                <p className="font-bold text-slate-900">{teleAppointment.doctorName}</p>
                <p className="text-[11px] text-slate-600">{teleAppointment.department}</p>
                <p className="text-[10px] text-slate-500 font-mono">Token Ref: {teleAppointment.appointmentNo}</p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Download Center DataTable Card */
        <div className="bg-white border border-slate-300 rounded-[3px] shadow-xs">
          <div className="p-2 sm:p-2.5 border-b border-slate-200 flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-800">Filter Downloads:</span>
              <DropdownSelect
                options={[
                  { value: 'All', label: 'All Document Categories' },
                  { value: 'Prescription', label: 'E-Prescriptions' },
                  { value: 'Lab Report', label: 'Lab Reports' },
                  { value: 'Radiology', label: 'Radiology Studies' },
                  { value: 'Billing Receipt', label: 'Payment Receipts' },
                ]}
                value={categoryFilter}
                onChange={setCategoryFilter}
                className="w-48"
              />
            </div>

            <span className="text-[11px] text-slate-500">
              Showing {filteredDownloads.length} of {DOWNLOADABLE_FILES.length} official documents
            </span>
          </div>

          <DataTable
            columns={downloadColumns}
            data={filteredDownloads}
            keyExtractor={(item) => item.id}
            searchPlaceholder="Search files by document title or reference number..."
            searchFilter={(item, query) =>
              item.title.toLowerCase().includes(query.toLowerCase()) ||
              item.refNo.toLowerCase().includes(query.toLowerCase())
            }
            defaultSort={{ key: 'date', order: 'desc' }}
            showSerial={true}
            emptyMessage="No documents found."
          />
        </div>
      )}
    </div>
  );
};
