import React, { useState } from 'react';
import {
  AlertTriangle,
  CheckCircle2,
  DollarSign,
  Printer,
  RotateCcw,
} from 'lucide-react';
import { SummaryCard, SummaryCardGrid } from '../common/SummaryCard';
import { DataTable, DataTableColumn } from '../common/DataTable';
import { PageHeader } from '../common/PageHeader';

interface ReturnRecord {
  id: string;
  returnNo: string;
  originalBillNo: string;
  customerName: string;
  medicineName: string;
  batchNo: string;
  quantityReturned: number;
  refundAmount: number;
  reason: string;
  condition: 'Foil Intact & Resalable' | 'Damaged / Spoiled';
  status: 'Approved & Refunded' | 'Pending Pharmacist Inspection';
}

export const PharmacistReturnsView: React.FC = () => {
  const [returnRecords] = useState<ReturnRecord[]>([
    {
      id: 'RET-01',
      returnNo: 'RET-2026-092',
      originalBillNo: 'POS-2026-9812',
      customerName: 'Md. Tariqul Islam',
      medicineName: 'Tab. Monas 10mg',
      batchNo: 'MN-2025-C4',
      quantityReturned: 10,
      refundAmount: 170.0,
      reason: 'Doctor changed prescription to inhaler',
      condition: 'Foil Intact & Resalable',
      status: 'Approved & Refunded',
    },
    {
      id: 'RET-02',
      returnNo: 'RET-2026-091',
      originalBillNo: 'POS-2026-9799',
      customerName: 'Sharmeen Akhter',
      medicineName: 'Cap. Maxpro 20mg',
      batchNo: 'MX-2026-E2',
      quantityReturned: 14,
      refundAmount: 126.0,
      reason: 'Excess purchase',
      condition: 'Foil Intact & Resalable',
      status: 'Approved & Refunded',
    },
    {
      id: 'RET-03',
      returnNo: 'RET-2026-088',
      originalBillNo: 'POS-2026-9740',
      customerName: 'Kamal Uddin',
      medicineName: 'Tab. Napa Extra',
      batchNo: 'NP-2026-A1',
      quantityReturned: 20,
      refundAmount: 70.0,
      reason: 'Course completed early',
      condition: 'Foil Intact & Resalable',
      status: 'Approved & Refunded',
    },
  ]);

  const columns: DataTableColumn<ReturnRecord>[] = [
    {
      key: 'returnNo',
      header: 'Return Voucher #',
      sortable: true,
      sortValue: (r) => r.returnNo,
      render: (r) => (
        <span className="font-mono font-bold text-[#006a4e] text-xs">
          {r.returnNo}
        </span>
      ),
    },
    {
      key: 'originalBillNo',
      header: 'Original Invoice',
      sortable: true,
      sortValue: (r) => r.originalBillNo,
      render: (r) => (
        <span className="font-mono text-slate-700 font-semibold text-xs">
          {r.originalBillNo}
        </span>
      ),
    },
    {
      key: 'customerName',
      header: 'Customer Name',
      sortable: true,
      sortValue: (r) => r.customerName,
      render: (r) => (
        <span className="font-semibold text-slate-800 text-xs">
          {r.customerName}
        </span>
      ),
    },
    {
      key: 'medicineName',
      header: 'Medicine & Lot',
      sortable: true,
      sortValue: (r) => r.medicineName,
      render: (r) => (
        <div>
          <span className="font-bold text-slate-900 text-xs block">
            {r.medicineName}
          </span>
          <span className="font-mono text-[11px] text-slate-400">
            Lot: {r.batchNo}
          </span>
        </div>
      ),
    },
    {
      key: 'quantityReturned',
      header: 'Qty Returned',
      align: 'center',
      sortable: true,
      sortValue: (r) => r.quantityReturned,
      render: (r) => (
        <span className="font-bold text-slate-800 text-xs">
          {r.quantityReturned} Units
        </span>
      ),
    },
    {
      key: 'refundAmount',
      header: 'Refund Amount (৳)',
      align: 'right',
      sortable: true,
      sortValue: (r) => r.refundAmount,
      render: (r) => (
        <span className="font-bold text-slate-900 text-xs">
          ৳ {r.refundAmount.toFixed(2)}
        </span>
      ),
    },
    {
      key: 'condition',
      header: 'Blister Seal Audit',
      render: (r) => (
        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-[3px] border border-emerald-100">
          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
          {r.condition}
        </span>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      align: 'center',
      sortable: true,
      sortValue: (r) => r.status,
      render: (r) => (
        <span className="px-2 py-0.5 rounded-[3px] text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-300">
          {r.status}
        </span>
      ),
    },
    {
      key: 'actions',
      header: 'Action',
      align: 'right',
      render: () => (
        <div className="flex items-center justify-end gap-1.5 whitespace-nowrap">
          <button
            type="button"
            className="px-2 py-1 rounded-[3px] bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold flex items-center gap-1 border border-slate-200 cursor-pointer"
          >
            <Printer className="w-3 h-3" />
            <span>Slip</span>
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-2">
      <PageHeader
        title="Returns & Refunds"
        description="Customer medicine returns, batch reverse restock, and patient cash/ledger refund audit."
      />
      {/* 4 Summary Metric Cards matching Doctor Portal format */}
      <SummaryCardGrid>
        <SummaryCard
          title="Today's Returns"
          icon={RotateCcw}
          iconColor="text-amber-600"
          value="3 Vouchers"
          subtitle="Processed at dispensary"
        />
        <SummaryCard
          title="Total Refund Disbursed"
          icon={DollarSign}
          iconColor="text-[#006a4e]"
          value="৳ 366.00"
          subtitle="Restocked under FEFO"
        />
        <SummaryCard
          title="Blister Inspection Passed"
          icon={CheckCircle2}
          iconColor="text-[#006a4e]"
          value="100% Passed"
          subtitle="Strict cold chain excluded"
        />
        <SummaryCard
          title="Supplier RTV Claims"
          icon={AlertTriangle}
          iconColor="text-slate-700"
          value="1 Debit Note"
          subtitle="Vendor credit note issued"
        />
      </SummaryCardGrid>

      {/* Enterprise DataTable matching Doctor Portal */}
      <DataTable<ReturnRecord>
        title="Customer Sales Returns & Restocking Ledger"
        subtitle="Intact foil verification, invoice matching, and automated FEFO inventory adjustments"
        data={returnRecords}
        columns={columns}
        keyExtractor={(item) => item.id}
        searchPlaceholder="Search voucher #, invoice #, customer, or medicine..."
        searchFilter={(item, query) =>
          item.returnNo.toLowerCase().includes(query.toLowerCase()) ||
          item.originalBillNo.toLowerCase().includes(query.toLowerCase()) ||
          item.customerName.toLowerCase().includes(query.toLowerCase()) ||
          item.medicineName.toLowerCase().includes(query.toLowerCase())
        }
        emptyTitle="No returns found"
        showSerial={true}
      />
    </div>
  );
};
