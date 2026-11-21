import React, { useMemo, useState } from 'react';
import {
  AlertCircle,
  AlertOctagon,
  CheckCircle,
  CheckCircle2,
  PackageCheck,
  Pill,
  Printer,
  ShieldAlert,
  ShieldCheck,
  X,
} from 'lucide-react';
import { SummaryCard, SummaryCardGrid } from '../common/SummaryCard';
import { DataTable, DataTableColumn } from '../common/DataTable';
import { DropdownSelect } from '../common/DropdownSelect';
import { PageHeader } from '../common/PageHeader';

interface PrescriptionItem {
  name: string;
  generic: string;
  dosage: string;
  duration: string;
  instructions: string;
  quantity: number;
  allocatedBatch: string;
  batchExpiry: string;
  stockAvailable: number;
}

interface EPrescription {
  id: string;
  rxNumber: string;
  patientName: string;
  uhid: string;
  age: number;
  gender: string;
  doctorName: string;
  department: string;
  date: string;
  priority: 'STAT' | 'Urgent' | 'Routine';
  status: 'Pending' | 'Dispensed' | 'Interaction Review';
  interactionWarning?: string;
  items: PrescriptionItem[];
}

export const PharmacistDispenseView: React.FC = () => {
  const [filterPriority, setFilterPriority] = useState<string>('All');

  const [prescriptions, setPrescriptions] = useState<EPrescription[]>([
    {
      id: 'rx-1',
      rxNumber: 'RX-2026-8941',
      patientName: 'Md. Anwar Hossain',
      uhid: 'UHID-08421',
      age: 58,
      gender: 'Male',
      doctorName: 'Prof. Dr. M. A. Hasan',
      department: 'Cardiology (OPD-2)',
      date: 'Today, 11:42 AM',
      priority: 'STAT',
      status: 'Pending',
      items: [
        {
          name: 'Tab. Clopidogrel 75mg (Plagrin)',
          generic: 'Clopidogrel Bisulfate',
          dosage: '1+0+0',
          duration: '30 Days',
          instructions: 'After breakfast',
          quantity: 30,
          allocatedBatch: 'CL-2026-03',
          batchExpiry: '2027-02',
          stockAvailable: 240,
        },
        {
          name: 'Tab. Rosuvastatin 10mg (Rovista)',
          generic: 'Rosuvastatin Calcium',
          dosage: '0+0+1',
          duration: '30 Days',
          instructions: 'At bedtime',
          quantity: 30,
          allocatedBatch: 'RV-2026-09',
          batchExpiry: '2026-12',
          stockAvailable: 310,
        },
        {
          name: 'Cap. Pantoprazole 20mg (Pantobex)',
          generic: 'Pantoprazole Sodium',
          dosage: '1+0+1',
          duration: '15 Days',
          instructions: '30 mins before meal',
          quantity: 30,
          allocatedBatch: 'PT-2026-11',
          batchExpiry: '2027-05',
          stockAvailable: 500,
        },
      ],
    },
    {
      id: 'rx-2',
      rxNumber: 'RX-2026-8940',
      patientName: 'Begum Rokeya',
      uhid: 'UHID-08392',
      age: 46,
      gender: 'Female',
      doctorName: 'Dr. Nusrat Jahan',
      department: 'Internal Medicine (OPD-1)',
      date: 'Today, 11:20 AM',
      priority: 'Urgent',
      status: 'Interaction Review',
      interactionWarning: 'CDSS Alert: High risk concurrent prescription of Ciprofloxacin + Theophylline. Serum theophylline levels may increase significantly.',
      items: [
        {
          name: 'Tab. Ciprofloxacin 500mg (Neofloxin)',
          generic: 'Ciprofloxacin HCl',
          dosage: '1+0+1',
          duration: '7 Days',
          instructions: 'After meal',
          quantity: 14,
          allocatedBatch: 'CF-2026-04',
          batchExpiry: '2026-10',
          stockAvailable: 180,
        },
        {
          name: 'Tab. Theophylline 400mg (Theo-400)',
          generic: 'Theophylline SR',
          dosage: '0+0+1',
          duration: '14 Days',
          instructions: 'After dinner',
          quantity: 14,
          allocatedBatch: 'TH-2025-08',
          batchExpiry: '2026-07',
          stockAvailable: 85,
        },
      ],
    },
    {
      id: 'rx-3',
      rxNumber: 'RX-2026-8938',
      patientName: 'Farhan Kabir',
      uhid: 'UHID-07914',
      age: 32,
      gender: 'Male',
      doctorName: 'Dr. Tanvir Ahmed',
      department: 'Orthopedics (OPD-4)',
      date: 'Today, 10:55 AM',
      priority: 'Routine',
      status: 'Pending',
      items: [
        {
          name: 'Tab. Aceclofenac 100mg (Flexi)',
          generic: 'Aceclofenac',
          dosage: '1+0+1',
          duration: '5 Days',
          instructions: 'After meals with water',
          quantity: 10,
          allocatedBatch: 'FL-2026-01',
          batchExpiry: '2027-03',
          stockAvailable: 420,
        },
        {
          name: 'Cap. Esomeprazole 20mg (Maxpro)',
          generic: 'Esomeprazole Magnesium',
          dosage: '1+0+1',
          duration: '7 Days',
          instructions: 'Before meals',
          quantity: 14,
          allocatedBatch: 'MX-2026-E2',
          batchExpiry: '2026-11',
          stockAvailable: 340,
        },
      ],
    },
  ]);

  const [selectedRx, setSelectedRx] = useState<EPrescription | null>(prescriptions[0]);
  const [dispensedAnimation, setDispensedAnimation] = useState<boolean>(false);

  const handleDispense = (rxId: string) => {
    setDispensedAnimation(true);
    setTimeout(() => {
      setPrescriptions((prev) =>
        prev.map((r) => (r.id === rxId ? { ...r, status: 'Dispensed' } : r))
      );
      if (selectedRx?.id === rxId) {
        setSelectedRx((prev) => (prev ? { ...prev, status: 'Dispensed' } : null));
      }
      setDispensedAnimation(false);
    }, 1000);
  };

  const filteredRx = useMemo(() => {
    return prescriptions.filter((r) => {
      if (filterPriority !== 'All' && r.priority !== filterPriority) return false;
      return true;
    });
  }, [prescriptions, filterPriority]);

  const stats = useMemo(() => {
    const total = prescriptions.length;
    const stat = prescriptions.filter((r) => r.priority === 'STAT').length;
    const alerts = prescriptions.filter((r) => r.interactionWarning).length;
    const dispensed = prescriptions.filter((r) => r.status === 'Dispensed').length;
    return { total, stat, alerts, dispensed };
  }, [prescriptions]);

  const columns: DataTableColumn<EPrescription>[] = [
    {
      key: 'rxNumber',
      header: 'Rx Number',
      sortable: true,
      sortValue: (r) => r.rxNumber,
      render: (r) => (
        <span className="font-extrabold text-[#006a4e]">
          {r.rxNumber}
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
              setSelectedRx(r);
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
      key: 'doctorName',
      header: 'Doctor & Department',
      sortable: true,
      sortValue: (r) => r.doctorName,
      render: (r) => (
        <div>
          <span className="font-semibold text-slate-800 text-xs block">
            {r.doctorName}
          </span>
          <span className="text-[11px] text-slate-500 font-medium">
            {r.department}
          </span>
        </div>
      ),
    },
    {
      key: 'itemsCount',
      header: 'Meds Count',
      align: 'center',
      sortable: true,
      sortValue: (r) => r.items.length,
      render: (r) => (
        <span className="font-bold text-slate-800 text-xs">
          {r.items.length} Medicines
        </span>
      ),
    },
    {
      key: 'priority',
      header: 'Priority',
      sortable: true,
      sortValue: (r) => r.priority,
      render: (r) => (
        <span
          className={`px-2 py-0.5 rounded-[3px] text-xs font-semibold border whitespace-nowrap ${
            r.priority === 'STAT'
              ? 'bg-rose-50 text-rose-700 border-rose-200 animate-pulse'
              : r.priority === 'Urgent'
              ? 'bg-amber-50 text-amber-700 border-amber-200'
              : 'bg-slate-100 text-slate-700 border-slate-200'
          }`}
        >
          {r.priority}
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
        if (r.status === 'Dispensed') cls = 'bg-emerald-50 text-emerald-800 border-emerald-300 font-bold';
        else if (r.status === 'Interaction Review') cls = 'bg-rose-50 text-rose-800 border-rose-300 font-bold';
        else if (r.status === 'Pending') cls = 'bg-cyan-50 text-cyan-800 border-cyan-200 font-semibold';

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
            onClick={() => setSelectedRx(r)}
            className="px-2 py-1 rounded-[3px] bg-[#0c2e4b] hover:bg-[#081e31] text-white text-xs font-semibold transition-colors cursor-pointer shadow-xs"
          >
            Review & Dispense
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-2">
      <PageHeader
        title="Prescription Dispense Queue"
        description="Clinical prescription verification, doctor order fulfillment, and patient medication dispensing."
      />
      {/* 4 Summary Metric Cards matching Doctor Portal format */}
      <SummaryCardGrid>
        <SummaryCard
          title="Waiting in Queue"
          icon={Pill}
          iconColor="text-[#006a4e]"
          value={`${stats.total} Prescriptions`}
          subtitle="Doctor prescriptions received"
          badge={
            <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
              Live Sync
            </span>
          }
        />
        <SummaryCard
          title="STAT Emergency"
          icon={AlertOctagon}
          iconColor="text-rose-600"
          value={`${stats.stat} Orders`}
          valueColor="text-rose-700"
          subtitle="Immediate bedside priority"
        />
        <SummaryCard
          title="CDSS Drug Alerts"
          icon={ShieldAlert}
          iconColor="text-amber-600"
          value={`${stats.alerts} Alerts`}
          valueColor="text-amber-700"
          subtitle="Drug interaction reviews"
        />
        <SummaryCard
          title="Dispensed Today"
          icon={CheckCircle2}
          iconColor="text-[#006a4e]"
          value={`${stats.dispensed + 284} Completed`}
          subtitle="Stock automatically deducted"
        />
      </SummaryCardGrid>

      {/* Selected Rx Detailed Verification Card */}
      {selectedRx && (
        <div className="bg-white border border-[#006a4e]/25 rounded-md p-4 space-y-4 shadow-xs">
          <div className="flex flex-wrap items-start justify-between gap-3 border-b border-slate-100 pb-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-[3px] bg-[#edf6f2] text-[#006a4e] font-bold text-xs flex items-center justify-center shrink-0">
                {selectedRx.rxNumber.slice(-4)}
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="text-sm font-semibold text-slate-900">
                    {selectedRx.patientName}
                  </h3>
                  <span className="px-2 py-0.5 rounded-[3px] bg-slate-100 text-slate-700 text-[11px] font-medium">
                    {selectedRx.uhid}
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded-[3px] text-[11px] font-bold border ${
                      selectedRx.priority === 'STAT'
                        ? 'bg-rose-50 text-rose-700 border-rose-200'
                        : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                    }`}
                  >
                    {selectedRx.priority} Priority
                  </span>
                  <span className="text-xs text-slate-500">
                    {selectedRx.age} yrs • {selectedRx.gender}
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  Prescribing Physician: <span className="font-semibold text-slate-800">{selectedRx.doctorName}</span> ({selectedRx.department}) • Date: {selectedRx.date}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => window.print()}
                className="px-2.5 py-1.5 rounded-[3px] bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Slip</span>
              </button>

              {selectedRx.status === 'Dispensed' ? (
                <span className="px-3 py-1.5 rounded-[3px] bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold flex items-center gap-1.5">
                  <CheckCircle className="w-4 h-4 text-emerald-600" />
                  <span>Dispensed & Signed</span>
                </span>
              ) : (
                <button
                  type="button"
                  disabled={dispensedAnimation}
                  onClick={() => handleDispense(selectedRx.id)}
                  className="px-3.5 py-1.5 rounded-[3px] bg-[#006a4e] hover:bg-[#00523c] text-white text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs disabled:bg-slate-400"
                >
                  <PackageCheck className="w-3.5 h-3.5" />
                  <span>{dispensedAnimation ? 'Signing & Deducting...' : 'Verify & Dispense'}</span>
                </button>
              )}

              <button
                type="button"
                onClick={() => setSelectedRx(null)}
                className="w-8 h-8 rounded-[3px] border border-slate-200 text-slate-500 hover:text-slate-800 hover:bg-slate-50 flex items-center justify-center cursor-pointer"
                title="Close inspection"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* CDSS Clinical Alert Box */}
          {selectedRx.interactionWarning && (
            <div className="bg-rose-50 border border-rose-200 rounded-[3px] p-3 flex items-start gap-2.5 text-xs">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-extrabold text-rose-900 block">
                  Clinical Decision Support Alert (CDSS):
                </span>
                <span className="text-rose-700 block mt-0.5">
                  {selectedRx.interactionWarning}
                </span>
              </div>
            </div>
          )}

          {/* Medicine Items List */}
          <div className="border border-slate-200 rounded-[3px] overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#0c2e4b] text-white font-semibold">
                <tr>
                  <th className="py-2.5 px-3">Prescribed Medicine</th>
                  <th className="py-2.5 px-2">Dose / Frequency</th>
                  <th className="py-2.5 px-2">Duration</th>
                  <th className="py-2.5 px-2 text-center">Qty</th>
                  <th className="py-2.5 px-3">Allocated FEFO Lot</th>
                  <th className="py-2.5 px-3 text-right">Verification</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {selectedRx.items.map((it, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/70">
                    <td className="py-2.5 px-3">
                      <div className="font-bold text-slate-900">{it.name}</div>
                      <div className="text-[11px] text-slate-500">{it.generic}</div>
                      <div className="text-[10px] text-[#006a4e] font-semibold mt-0.5">{it.instructions}</div>
                    </td>
                    <td className="py-2.5 px-2 font-mono text-slate-700 font-bold">{it.dosage}</td>
                    <td className="py-2.5 px-2 text-slate-600">{it.duration}</td>
                    <td className="py-2.5 px-2 text-center font-extrabold text-slate-900">{it.quantity}</td>
                    <td className="py-2.5 px-3">
                      <div className="font-mono font-bold text-[#006a4e]">{it.allocatedBatch}</div>
                      <div className="text-[10px] text-slate-400">Exp: {it.batchExpiry} • Stock: {it.stockAvailable}</div>
                    </td>
                    <td className="py-2.5 px-3 text-right">
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-[3px] border border-emerald-100">
                        <ShieldCheck className="w-3 h-3 text-emerald-600" />
                        FEFO Valid
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Enterprise DataTable for Prescription Queue */}
      <DataTable<EPrescription>
        title="Electronic Prescription Dispense Queue"
        subtitle="Connected to OPD and Emergency Chamber consultations with clinical safety validation"
        data={filteredRx}
        columns={columns}
        keyExtractor={(item) => item.id}
        searchPlaceholder="Search Rx#, patient name, UHID, or doctor..."
        searchFilter={(item, query) =>
          item.rxNumber.toLowerCase().includes(query.toLowerCase()) ||
          item.patientName.toLowerCase().includes(query.toLowerCase()) ||
          item.uhid.toLowerCase().includes(query.toLowerCase()) ||
          item.doctorName.toLowerCase().includes(query.toLowerCase())
        }
        toolbarFilters={
          <DropdownSelect
            value={filterPriority}
            onChange={(val) => setFilterPriority(val)}
            options={['All', 'STAT', 'Urgent', 'Routine']}
            width="w-36"
          />
        }
        emptyTitle="No prescriptions found"
        emptyDescription="No prescriptions match the selected priority filter."
        onRowClick={(item) => setSelectedRx(item)}
        showSerial={true}
      />
    </div>
  );
};
