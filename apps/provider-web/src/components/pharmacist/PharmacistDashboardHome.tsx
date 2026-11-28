import React, { useState } from 'react';
import {
  AlertTriangle,
  ArrowRight,
  ArrowRightLeft,
  Boxes,
  DollarSign,
  PackageCheck,
  Pill,
  Receipt,
} from 'lucide-react';
import { SummaryCard, SummaryCardGrid } from '../common/SummaryCard';
import { DataTable, DataTableColumn } from '../common/DataTable';
import { PageHeader } from '../common/PageHeader';

interface PharmacistDashboardHomeProps {
  onNavigate: (moduleId: string) => void;
}

interface EPrescriptionSummary {
  id: string;
  rxNumber: string;
  patientName: string;
  uhid: string;
  age: number;
  gender: string;
  doctorName: string;
  department: string;
  itemsCount: number;
  priority: 'STAT / Emergency' | 'Urgent' | 'Routine';
  status: 'Ready to Dispense' | 'Checking Interactions' | 'Waiting Patient';
  time: string;
}

export const PharmacistDashboardHome: React.FC<PharmacistDashboardHomeProps> = ({
  onNavigate,
}) => {
  const [selectedRx, setSelectedRx] = useState<EPrescriptionSummary | null>(null);

  const prescriptionsQueue: EPrescriptionSummary[] = [
    {
      id: 'rx-01',
      rxNumber: 'RX-2026-8941',
      patientName: 'Md. Anwar Hossain',
      uhid: 'UHID-08421',
      age: 58,
      gender: 'Male',
      doctorName: 'Prof. Dr. M. A. Hasan',
      department: 'Cardiology (OPD-2)',
      itemsCount: 4,
      priority: 'STAT / Emergency',
      status: 'Ready to Dispense',
      time: '5 mins ago',
    },
    {
      id: 'rx-02',
      rxNumber: 'RX-2026-8940',
      patientName: 'Begum Rokeya',
      uhid: 'UHID-08392',
      age: 46,
      gender: 'Female',
      doctorName: 'Dr. Nusrat Jahan',
      department: 'Internal Medicine (OPD-1)',
      itemsCount: 3,
      priority: 'Urgent',
      status: 'Checking Interactions',
      time: '12 mins ago',
    },
    {
      id: 'rx-03',
      rxNumber: 'RX-2026-8938',
      patientName: 'Farhan Kabir',
      uhid: 'UHID-07914',
      age: 32,
      gender: 'Male',
      doctorName: 'Dr. Tanvir Ahmed',
      department: 'Orthopedics (OPD-4)',
      itemsCount: 5,
      priority: 'Routine',
      status: 'Waiting Patient',
      time: '24 mins ago',
    },
    {
      id: 'rx-04',
      rxNumber: 'RX-2026-8935',
      patientName: 'Salma Khatun',
      uhid: 'UHID-08290',
      age: 39,
      gender: 'Female',
      doctorName: 'Dr. Shahinur Rahman',
      department: 'Pulmonology (OPD-3)',
      itemsCount: 3,
      priority: 'Routine',
      status: 'Ready to Dispense',
      time: '35 mins ago',
    },
    {
      id: 'rx-05',
      rxNumber: 'RX-2026-8930',
      patientName: 'Kazi Mahbubul Alam',
      uhid: 'UHID-07923',
      age: 64,
      gender: 'Male',
      doctorName: 'Prof. Dr. M. A. Hasan',
      department: 'Cardiology (CCU-2)',
      itemsCount: 6,
      priority: 'STAT / Emergency',
      status: 'Ready to Dispense',
      time: '48 mins ago',
    },
  ];

  const columns: DataTableColumn<EPrescriptionSummary>[] = [
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
      header: 'Prescribing Doctor',
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
      sortValue: (r) => r.itemsCount,
      render: (r) => (
        <span className="font-bold text-slate-800 text-xs">
          {r.itemsCount} Items
        </span>
      ),
    },
    {
      key: 'priority',
      header: 'Dispense Priority',
      sortable: true,
      sortValue: (r) => r.priority,
      render: (r) => (
        <span
          className={`px-2 py-0.5 rounded-[3px] text-xs font-semibold border whitespace-nowrap ${
            r.priority.includes('STAT')
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
      header: 'Queue Status',
      align: 'center',
      sortable: true,
      sortValue: (r) => r.status,
      render: (r) => {
        let cls = 'bg-slate-100 text-slate-700 border-slate-200';
        if (r.status === 'Ready to Dispense') cls = 'bg-emerald-50 text-emerald-800 border-emerald-300 font-bold';
        else if (r.status === 'Checking Interactions') cls = 'bg-amber-50 text-amber-800 border-amber-200 font-semibold';
        else if (r.status === 'Waiting Patient') cls = 'bg-cyan-50 text-cyan-800 border-cyan-200 font-semibold';

        return (
          <span className={`px-2 py-0.5 rounded-[3px] text-xs border whitespace-nowrap ${cls}`}>
            {r.status}
          </span>
        );
      },
    },
    {
      key: 'time',
      header: 'Wait Time',
      align: 'center',
      render: (r) => (
        <span className="text-xs text-slate-500 whitespace-nowrap">
          {r.time}
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
            onClick={() => onNavigate('pos-billing')}
            className="px-2 py-1 rounded-[3px] bg-[#006a4e] hover:bg-[#00523c] text-white text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer shadow-xs"
            title="Dispense in POS"
          >
            <PackageCheck className="w-3 h-3" />
            <span>Dispense</span>
          </button>
          <button
            type="button"
            onClick={() => setSelectedRx(r)}
            className="px-2 py-1 rounded-[3px] bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 text-xs font-semibold transition-colors cursor-pointer"
            title="View details"
          >
            Details
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-2">
      <PageHeader
        title="Pharmacy Dashboard"
        description="Central Medical Store · Real-time operations & dispensary overview"
      />
      {/* 4 Summary Metric Cards matching Doctor Portal format */}
      <SummaryCardGrid>
        <SummaryCard
          title="Today's Dispensations"
          icon={Pill}
          iconColor="text-[#006a4e]"
          value="284 Rx"
          subtitle="+14% higher than yesterday"
          onClick={() => onNavigate('pos-billing')}
          badge={
            <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
              Live
            </span>
          }
        />
        <SummaryCard
          title="POS Retail Revenue"
          icon={DollarSign}
          iconColor="text-[#006a4e]"
          value="৳ 3,42,850"
          subtitle="412 walk-in & OTC sales"
          onClick={() => onNavigate('pos-billing')}
        />
        <SummaryCard
          title="Stock Transfers"
          icon={ArrowRightLeft}
          iconColor="text-blue-600"
          value="2 Orders"
          valueColor="text-blue-700"
          subtitle="Central Depot -> Dhanmondi (In-Transit)"
          onClick={() => onNavigate('stock-transfers')}
        />
        <SummaryCard
          title="Near-Expiry Batches"
          icon={AlertTriangle}
          iconColor="text-rose-600"
          value="3 Batches"
          valueColor="text-rose-700"
          subtitle="< 60 days FEFO surveillance"
          onClick={() => onNavigate('batch-expiry')}
        />
      </SummaryCardGrid>

      {/* Critical STAT Prescription & High-Alert Alert Strip */}
      <div className="bg-white border border-slate-200/90 border-l-4 border-l-rose-500 rounded-[4px] p-2.5 sm:p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 shadow-xs">
        <div className="flex items-center gap-2.5">
          <AlertTriangle className="w-4 h-4 text-rose-500 shrink-0" />
          <div className="text-xs">
            <span className="font-extrabold text-slate-900">
              STAT Emergency Dispense Order:
            </span>{' '}
            <span className="text-slate-700">
              Md. Anwar Hossain (UHID-08421) — Prescribed by Prof. Dr. M. A. Hasan (Cardiology):{' '}
              <strong className="font-bold text-rose-700">
                Tab. Clopidogrel 75mg + Rosuvastatin 10mg (STAT Priority)
              </strong>
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => onNavigate('pos-billing')}
            className="px-2.5 py-1 rounded-[3px] bg-[#0c2e4b] hover:bg-[#081e31] text-white text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer shadow-xs"
          >
            <span>Review in POS</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Selected Rx Quick Inspection Card */}
      {selectedRx && (
        <div className="bg-white border border-[#006a4e]/25 rounded-md p-3.5 shadow-xs">
          <div className="flex flex-wrap items-start justify-between gap-3 border-b border-slate-100 pb-2.5">
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
                  <span className="px-2 py-0.5 rounded-[3px] bg-emerald-50 text-emerald-700 border border-emerald-200 text-[11px] font-semibold">
                    {selectedRx.status}
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  Prescribed by {selectedRx.doctorName} ({selectedRx.department}) • {selectedRx.age} yrs • {selectedRx.gender}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => onNavigate('pos-billing')}
                className="px-3 py-1.5 rounded-[3px] bg-[#006a4e] hover:bg-[#00523c] text-white text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
              >
                <PackageCheck className="w-3.5 h-3.5" />
                <span>Open in POS</span>
              </button>
              <button
                type="button"
                onClick={() => setSelectedRx(null)}
                className="px-2.5 py-1.5 rounded-[3px] border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs font-semibold transition-colors cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Enterprise DataTable for E-Prescriptions */}
      <DataTable<EPrescriptionSummary>
        data={prescriptionsQueue}
        columns={columns}
        keyExtractor={(item) => item.id}
        searchPlaceholder="Search Rx#, patient name, UHID, or doctor..."
        searchFilter={(item, query) =>
          item.rxNumber.toLowerCase().includes(query.toLowerCase()) ||
          item.patientName.toLowerCase().includes(query.toLowerCase()) ||
          item.uhid.toLowerCase().includes(query.toLowerCase()) ||
          item.doctorName.toLowerCase().includes(query.toLowerCase())
        }
        toolbarActions={
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => onNavigate('pos-billing')}
              className="px-2.5 py-1 rounded-[3px] bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Receipt className="w-3.5 h-3.5 text-slate-600" />
              <span>POS Billing</span>
            </button>
            <button
              type="button"
              onClick={() => onNavigate('inventory-master')}
              className="px-2.5 py-1 rounded-[3px] bg-[#0c2e4b] hover:bg-[#081e31] text-white text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
            >
              <Boxes className="w-3.5 h-3.5 text-[#00c2cb]" />
              <span>Formulary Stock</span>
            </button>
          </div>
        }
        emptyTitle="No prescriptions in queue"
        emptyDescription="All patient prescriptions for this shift have been dispensed."
        onRowClick={(item) => setSelectedRx(item)}
        showSerial={true}
      />
    </div>
  );
};
