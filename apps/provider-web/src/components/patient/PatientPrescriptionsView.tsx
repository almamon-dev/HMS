import {
  CheckCircle2,
  Clock,
  Eye,
  FileText,
  Pill,
  Printer,
  X,
} from 'lucide-react';
import React, { useMemo, useState } from 'react';
import {
  CURRENT_PATIENT,
  PATIENT_PRESCRIPTIONS,
  PatientPrescriptionItem,
} from '../../data/patientPortalData';
import { DataTable, DataTableColumn } from '../common/DataTable';
import { DropdownSelect } from '../common/DropdownSelect';
import { SummaryCard, SummaryCardGrid } from '../common/SummaryCard';

export const PatientPrescriptionsView: React.FC = () => {
  const [prescriptions] = useState<PatientPrescriptionItem[]>(PATIENT_PRESCRIPTIONS);
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedRx, setSelectedRx] = useState<PatientPrescriptionItem | null>(null);
  const [printModalRx, setPrintModalRx] = useState<PatientPrescriptionItem | null>(null);

  const stats = useMemo(() => {
    const total = prescriptions.length;
    const active = prescriptions.filter((r) => r.status === 'Active E-Rx').length;
    const totalMeds = prescriptions.reduce((acc, r) => acc + r.medicines.length, 0);
    return { total, active, totalMeds };
  }, [prescriptions]);

  const filteredRx = useMemo(() => {
    if (statusFilter === 'All') return prescriptions;
    return prescriptions.filter((r) => r.status === statusFilter);
  }, [prescriptions, statusFilter]);

  const columns: DataTableColumn<PatientPrescriptionItem>[] = [
    {
      key: 'rxNumber',
      header: 'E-Rx Number',
      sortable: true,
      sortValue: (r) => r.rxNumber,
      render: (r) => (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setSelectedRx(r);
          }}
          className="font-bold text-[#006a4e] hover:underline text-left cursor-pointer whitespace-nowrap"
        >
          {r.rxNumber}
        </button>
      ),
    },
    {
      key: 'doctorName',
      header: 'Prescribing Physician',
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
      key: 'diagnosis',
      header: 'Clinical Diagnosis',
      render: (r) => (
        <span className="text-slate-800 font-medium block truncate max-w-xs" title={r.diagnosis}>
          {r.diagnosis}
        </span>
      ),
    },
    {
      key: 'medicines',
      header: 'Medicines Prescribed',
      render: (r) => (
        <div className="flex flex-wrap items-center gap-1 max-w-md">
          {r.medicines.map((m, idx) => (
            <span
              key={idx}
              className="px-1.5 py-0.5 rounded-[3px] bg-slate-100 text-slate-700 text-[10px] font-medium border border-slate-200 truncate max-w-[150px]"
              title={`${m.name} - ${m.dosage}`}
            >
              {m.name.split(' ')[1] || m.name}
            </span>
          ))}
          <span className="text-[10px] text-[#006a4e] font-bold">
            ({r.medicines.length} items)
          </span>
        </div>
      ),
    },
    {
      key: 'followUp',
      header: 'Follow-up Advice',
      render: (r) => (
        <span className="text-slate-600 text-xs whitespace-nowrap font-medium">
          {r.followUp}
        </span>
      ),
    },
    {
      key: 'status',
      header: 'Rx Status',
      align: 'center',
      render: (r) => (
        <span
          className={`px-2 py-0.5 rounded-[3px] text-[11px] font-semibold border whitespace-nowrap ${r.status === 'Active E-Rx'
            ? 'bg-[#edf6f2] text-[#006a4e] border-[#006a4e]/20'
            : 'bg-slate-100 text-slate-600 border-slate-200'
            }`}
        >
          {r.status}
        </span>
      ),
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
              setPrintModalRx(r);
            }}
            className="px-2 py-1 rounded-[3px] bg-[#006a4e] hover:bg-[#00553e] text-white text-[11px] font-semibold flex items-center gap-1 transition-colors cursor-pointer shadow-2xs"
          >
            <Printer className="w-3 h-3" />
            <span>Print E-Rx</span>
          </button>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setSelectedRx(r);
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

  return (
    <div className="space-y-2">
      {/* 4 Summary Metric Cards matching PatientDirectory format */}
      <SummaryCardGrid>
        <SummaryCard
          title="Total Prescriptions"
          icon={FileText}
          iconColor="text-[#006a4e]"
          value={`${stats.total} Records`}
          subtitle="Digital hospital outpatient history"
        />
        <SummaryCard
          title="Active Regimens"
          icon={CheckCircle2}
          iconColor="text-[#006a4e]"
          value={`${stats.active} Active E-Rx`}
          valueColor="text-[#006a4e]"
          subtitle="Currently valid medications"
        />
        <SummaryCard
          title="Prescribed Medicines"
          icon={Pill}
          iconColor="text-cyan-600"
          value={`${stats.totalMeds} Drugs`}
          valueColor="text-cyan-700"
          subtitle="Cardiac, anti-hypertensive & oral"
        />
        <SummaryCard
          title="Follow-up Schedule"
          icon={Clock}
          iconColor="text-amber-600"
          value="7 Days"
          valueColor="text-amber-600"
          subtitle="Next review with lab reports"
        />
      </SummaryCardGrid>

      {/* Selected Prescription Quick View Card matching PatientDirectory */}
      {selectedRx && (
        <div className="bg-white border border-[#006a4e]/25 rounded-md p-4">
          <div className="flex flex-wrap items-start justify-between gap-3 border-b border-slate-100 pb-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-[3px] bg-[#edf6f2] text-[#006a4e] font-bold text-sm flex items-center justify-center shrink-0">
                Rx
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="text-sm font-semibold text-slate-900">
                    {selectedRx.rxNumber} · {selectedRx.diagnosis}
                  </h3>
                  <span className="px-2 py-0.5 rounded-[3px] bg-[#edf6f2] text-[#006a4e] border border-[#006a4e]/20 text-[11px] font-semibold">
                    {selectedRx.status}
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  Prescribed by {selectedRx.doctorName} ({selectedRx.department}) on {selectedRx.date} · Follow-up: {selectedRx.followUp}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setPrintModalRx(selectedRx)}
                className="h-8 px-3 rounded-[3px] bg-[#006a4e] hover:bg-[#00553e] text-white text-xs font-semibold inline-flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Official Prescription</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedRx(null)}
                className="w-8 h-8 rounded-[3px] border border-slate-200 text-slate-500 hover:text-slate-800 hover:bg-slate-50 flex items-center justify-center cursor-pointer"
                aria-label="Close prescription view"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="pt-3 space-y-2 text-xs">
            <div className="font-bold text-slate-800">Prescribed Dosages &amp; Instructions:</div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {selectedRx.medicines.map((m, idx) => (
                <div key={idx} className="p-2 rounded-[3px] bg-slate-50 border border-slate-100">
                  <div className="font-semibold text-slate-900">{m.name} ({m.dosage})</div>
                  <div className="text-[11px] text-slate-600 mt-0.5">
                    Schedule: <strong className="text-slate-800">{m.frequency}</strong> · Duration: {m.duration} · {m.instruction}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* CarrierDirect-Style Reusable DataTable matching PatientDirectory */}
      <DataTable<PatientPrescriptionItem>
        data={filteredRx}
        columns={columns}
        rowKey={(row) => row.id}
        searchable
        searchPlaceholder="Search by Rx number, medicine name, diagnosis, or doctor..."
        searchFilter={(row, query) =>
          row.rxNumber.toLowerCase().includes(query) ||
          row.doctorName.toLowerCase().includes(query) ||
          row.diagnosis.toLowerCase().includes(query) ||
          row.medicines.some((m) => m.name.toLowerCase().includes(query))
        }
        toolbarFilters={
          <DropdownSelect
            value={statusFilter}
            onChange={(val) => setStatusFilter(val)}
            width="w-36"
            options={['All', 'Active E-Rx', 'Completed Refill']}
          />
        }
        defaultPageSize={30}
        pageSizeOptions={[15, 30, 50, 100]}
        emptyTitle="No prescriptions found"
        emptyDescription="There are no prescriptions recorded under the selected criteria."
        onRowClick={(row) => setSelectedRx(row)}
        showSerial={true}
      />

      {/* Printable Prescription Modal */}
      {printModalRx && (
        <div className="fixed inset-0 z-50 bg-slate-950/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-2xl rounded-md border border-slate-200 shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200 bg-slate-50">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-[#006a4e]" />
                <h3 className="text-xs font-bold text-slate-800">
                  Official GreenHospital E-Prescription
                </h3>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="px-2.5 py-1 rounded-[3px] bg-[#006a4e] hover:bg-[#00553e] text-white text-xs font-semibold flex items-center gap-1 cursor-pointer shadow-2xs"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print Document</span>
                </button>
                <button
                  type="button"
                  onClick={() => setPrintModalRx(null)}
                  className="text-slate-400 hover:text-slate-700 cursor-pointer"
                >
                  ✕
                </button>
              </div>
            </div>

            <div className="p-6 space-y-4 text-xs bg-white text-slate-800" id="printable-rx">
              <div className="border-b-2 border-[#006a4e] pb-3 flex justify-between items-start">
                <div>
                  <h2 className="text-base font-extrabold text-slate-900 tracking-tight">
                    GREENHOSPITAL &amp; RESEARCH CENTER
                  </h2>
                  <p className="text-[11px] text-slate-500">
                    Plot #32, Road #4, Dhanmondi, Dhaka-1205 · Hotline: 10616
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-sm font-bold text-[#006a4e]">{printModalRx.rxNumber}</div>
                  <div className="text-[11px] text-slate-400">Date: {printModalRx.date}</div>
                </div>
              </div>

              <div className="bg-slate-50 p-3 rounded-md grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] border border-slate-200">
                <div>
                  <span className="text-slate-400 block">Patient Name:</span>
                  <span className="font-bold text-slate-900">{CURRENT_PATIENT.name}</span>
                </div>
                <div>
                  <span className="text-slate-400 block">UHID / ID:</span>
                  <span className="font-bold text-[#006a4e]">{CURRENT_PATIENT.uhid}</span>
                </div>
                <div>
                  <span className="text-slate-400 block">Age / Gender:</span>
                  <span className="font-medium text-slate-800">{CURRENT_PATIENT.age}y / {CURRENT_PATIENT.gender}</span>
                </div>
                <div>
                  <span className="text-slate-400 block">Blood Group:</span>
                  <span className="font-bold text-slate-900">{CURRENT_PATIENT.bloodGroup}</span>
                </div>
              </div>

              <div>
                <span className="text-slate-400 block text-[11px]">Primary Clinical Diagnosis:</span>
                <span className="font-bold text-slate-900 text-sm">{printModalRx.diagnosis}</span>
              </div>

              <div className="border-t border-slate-200 pt-3 space-y-2">
                <div className="text-base font-serif italic font-bold text-[#006a4e]">Rx</div>
                <div className="divide-y divide-slate-100">
                  {printModalRx.medicines.map((m, idx) => (
                    <div key={idx} className="py-2 flex items-start justify-between">
                      <div>
                        <div className="font-bold text-slate-900 text-xs">
                          {idx + 1}. {m.name} ({m.dosage})
                        </div>
                        <div className="text-[11px] text-slate-600 pl-4 mt-0.5">
                          {m.instruction} · Duration: {m.duration}
                        </div>
                      </div>
                      <div className="text-xs font-mono font-bold text-slate-800">{m.frequency}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-t border-slate-200 pt-3 flex justify-between items-end text-[11px]">
                <div>
                  <span className="text-slate-400 block">Next Follow-up Review:</span>
                  <span className="font-bold text-slate-900">{printModalRx.followUp}</span>
                </div>
                <div className="text-right">
                  <div className="font-bold text-slate-900">{printModalRx.doctorName}</div>
                  <div className="text-slate-500">{printModalRx.department}</div>
                  <div className="text-[10px] text-emerald-700 font-semibold mt-1">Digitally Signed &amp; Verified</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
