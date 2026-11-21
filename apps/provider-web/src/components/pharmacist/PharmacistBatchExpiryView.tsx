import React, { useMemo, useState } from 'react';
import {
  AlertOctagon,
  AlertTriangle,
  CalendarClock,
  CheckCircle2,
} from 'lucide-react';
import { SummaryCard, SummaryCardGrid } from '../common/SummaryCard';
import { DataTable, DataTableColumn } from '../common/DataTable';
import { DropdownSelect } from '../common/DropdownSelect';
import { PageHeader } from '../common/PageHeader';

interface BatchRecord {
  id: string;
  medicineName: string;
  batchNo: string;
  location: string;
  mfgDate: string;
  expDate: string;
  daysRemaining: number;
  quantity: number;
  unitCost: number;
  status: 'Critical' | 'Warning' | 'Notice' | 'Safe';
  isQuarantined?: boolean;
}

export const PharmacistBatchExpiryView: React.FC = () => {
  const [filterRange, setFilterRange] = useState<string>('All');

  const [batches, setBatches] = useState<BatchRecord[]>([
    {
      id: 'B-01',
      medicineName: 'Meropenem 1g IV (Meronem)',
      batchNo: 'MRP-2024-X8',
      location: 'Dhanmondi OPD Pharmacy (Shelf B-4)',
      mfgDate: '2024-12',
      expDate: '2026-12-15',
      daysRemaining: 24,
      quantity: 80,
      unitCost: 950.0,
      status: 'Critical',
    },
    {
      id: 'B-02',
      medicineName: 'Insulin Glargine 100IU/ml (Lantus)',
      batchNo: 'LAN-2025-01',
      location: 'Central Medical Store (Cold Chain 2-8°C)',
      mfgDate: '2025-01',
      expDate: '2027-01-10',
      daysRemaining: 50,
      quantity: 120,
      unitCost: 820.0,
      status: 'Warning',
    },
    {
      id: 'B-03',
      medicineName: 'Ceftriaxone 1g Inj. (Ceftron)',
      batchNo: 'CFT-2025-99',
      location: 'Uttara Branch Pharmacy (Aisle 2)',
      mfgDate: '2025-02',
      expDate: '2027-02-05',
      daysRemaining: 76,
      quantity: 210,
      unitCost: 165.0,
      status: 'Notice',
    },
    {
      id: 'B-04',
      medicineName: 'Amoxicillin + Clavulanic 625mg (Moxaclav)',
      batchNo: 'MXC-2025-42',
      location: 'Central Medical Store (Shelf C-1)',
      mfgDate: '2025-03',
      expDate: '2027-01-28',
      daysRemaining: 68,
      quantity: 600,
      unitCost: 28.0,
      status: 'Notice',
    },
    {
      id: 'B-05',
      medicineName: 'Pantoprazole 40mg IV (Pantobex)',
      batchNo: 'PTB-2025-14',
      location: 'Mirpur Branch Pharmacy (Shelf A-3)',
      mfgDate: '2025-04',
      expDate: '2027-04-30',
      daysRemaining: 160,
      quantity: 450,
      unitCost: 65.0,
      status: 'Safe',
    },
  ]);

  const toggleQuarantine = (id: string) => {
    setBatches((prev) =>
      prev.map((b) => (b.id === id ? { ...b, isQuarantined: !b.isQuarantined } : b))
    );
  };

  const filteredBatches = useMemo(() => {
    return batches.filter((b) => {
      if (filterRange === 'Critical (<30d)' && b.daysRemaining > 30) return false;
      if (filterRange === 'Warning (30-60d)' && (b.daysRemaining <= 30 || b.daysRemaining > 60)) return false;
      if (filterRange === 'Notice (60-90d)' && (b.daysRemaining <= 60 || b.daysRemaining > 90)) return false;
      if (filterRange === 'Safe (>90d)' && b.daysRemaining <= 90) return false;
      return true;
    });
  }, [batches, filterRange]);

  const stats = useMemo(() => {
    const critical = batches.filter((b) => b.daysRemaining <= 30).length;
    const warning = batches.filter((b) => b.daysRemaining > 30 && b.daysRemaining <= 60).length;
    const notice = batches.filter((b) => b.daysRemaining > 60 && b.daysRemaining <= 90).length;
    const safe = batches.filter((b) => b.daysRemaining > 90).length;
    return { critical, warning, notice, safe, total: batches.length };
  }, [batches]);

  const columns: DataTableColumn<BatchRecord>[] = [
    {
      key: 'medicineName',
      header: 'Medicine & Batch Lot',
      sortable: true,
      sortValue: (r) => r.medicineName,
      render: (r) => (
        <div>
          <span className="font-bold text-slate-900 text-xs block">
            {r.medicineName}
          </span>
          <span className="font-mono text-[11px] text-[#006a4e] font-semibold">
            Lot: {r.batchNo}
          </span>
        </div>
      ),
    },
    {
      key: 'location',
      header: 'Storage Location',
      sortable: true,
      sortValue: (r) => r.location,
      render: (r) => (
        <span className="text-xs text-slate-600 font-medium">
          {r.location}
        </span>
      ),
    },
    {
      key: 'quantity',
      header: 'Stock Qty',
      align: 'center',
      sortable: true,
      sortValue: (r) => r.quantity,
      render: (r) => (
        <span className="font-mono font-bold text-slate-800 text-xs">
          {r.quantity} Units
        </span>
      ),
    },
    {
      key: 'expDate',
      header: 'Expiry Date',
      align: 'center',
      sortable: true,
      sortValue: (r) => r.expDate,
      render: (r) => (
        <span className="font-mono text-xs font-semibold text-slate-700">
          {r.expDate}
        </span>
      ),
    },
    {
      key: 'daysRemaining',
      header: 'Countdown Window',
      align: 'center',
      sortable: true,
      sortValue: (r) => r.daysRemaining,
      render: (r) => (
        <span
          className={`inline-block px-2 py-0.5 rounded-[3px] text-xs font-bold ${
            r.daysRemaining <= 30
              ? 'bg-rose-50 text-rose-700 border border-rose-200 animate-pulse'
              : r.daysRemaining <= 60
              ? 'bg-amber-50 text-amber-700 border border-amber-200'
              : r.daysRemaining <= 90
              ? 'bg-yellow-50 text-yellow-700 border border-yellow-200'
              : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
          }`}
        >
          {r.daysRemaining} Days
        </span>
      ),
    },
    {
      key: 'unitCost',
      header: 'Lot Valuation (৳)',
      align: 'right',
      sortable: true,
      sortValue: (r) => r.quantity * r.unitCost,
      render: (r) => (
        <span className="font-bold text-slate-900 text-xs">
          ৳ {(r.quantity * r.unitCost).toLocaleString()}
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
            onClick={() => toggleQuarantine(r.id)}
            className={`px-2 py-1 rounded-[3px] text-xs font-semibold transition-colors cursor-pointer ${
              r.isQuarantined
                ? 'bg-rose-600 text-white'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200'
            }`}
          >
            {r.isQuarantined ? 'Quarantined' : 'Quarantine'}
          </button>
          <button
            type="button"
            className="px-2 py-1 rounded-[3px] bg-[#006a4e] hover:bg-[#00523c] text-white text-xs font-semibold transition-colors cursor-pointer shadow-xs"
          >
            Transfer FEFO
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-2">
      <PageHeader
        title="Batches & Expiry Tracker"
        description="FEFO batch traceability, quarantine controls, and expiration countdown monitor."
      />
      {/* 4 Summary Metric Cards matching Doctor Portal format */}
      <SummaryCardGrid>
        <SummaryCard
          title="Critical (< 30 Days)"
          icon={AlertOctagon}
          iconColor="text-rose-600"
          value={`${stats.critical} Batches`}
          valueColor="text-rose-700"
          subtitle="Immediate ICU transfer required"
          onClick={() => setFilterRange('Critical (<30d)')}
          badge={
            <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
              Urgent
            </span>
          }
        />
        <SummaryCard
          title="Warning (30 - 60 Days)"
          icon={AlertTriangle}
          iconColor="text-amber-600"
          value={`${stats.warning} Batches`}
          valueColor="text-amber-700"
          subtitle="Cold chain & inpatient surveillance"
          onClick={() => setFilterRange('Warning (30-60d)')}
        />
        <SummaryCard
          title="Early Notice (60 - 90 Days)"
          icon={CalendarClock}
          iconColor="text-yellow-600"
          value={`${stats.notice} Batches`}
          valueColor="text-yellow-700"
          subtitle="Prioritized for OPD dispensing"
          onClick={() => setFilterRange('Notice (60-90d)')}
        />
        <SummaryCard
          title="Total Monitored Batches"
          icon={CheckCircle2}
          iconColor="text-[#006a4e]"
          value={`${stats.total} Lots`}
          subtitle="Audited in hospital ERP ledger"
          onClick={() => setFilterRange('All')}
        />
      </SummaryCardGrid>

      {/* Enterprise DataTable matching Doctor Portal */}
      <DataTable<BatchRecord>
        title="FEFO Batch Expiry & Ageing Ledger"
        subtitle="Automated First-Expiry-First-Out surveillance with quarantine protocols"
        data={filteredBatches}
        columns={columns}
        keyExtractor={(item) => item.id}
        searchPlaceholder="Search medicine name, batch number, or location..."
        searchFilter={(item, query) =>
          item.medicineName.toLowerCase().includes(query.toLowerCase()) ||
          item.batchNo.toLowerCase().includes(query.toLowerCase()) ||
          item.location.toLowerCase().includes(query.toLowerCase())
        }
        toolbarFilters={
          <DropdownSelect
            value={filterRange}
            onChange={(val) => setFilterRange(val)}
            options={['All', 'Critical (<30d)', 'Warning (30-60d)', 'Notice (60-90d)', 'Safe (>90d)']}
            width="w-44"
          />
        }
        emptyTitle="No expiring batches found"
        emptyDescription="All medicine batches within this filter range are within safe shelf life."
        showSerial={true}
      />
    </div>
  );
};
