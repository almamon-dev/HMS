import React, { useMemo, useState } from 'react';
import {
  ArrowRight,
  Building2,
  CheckCircle,
  Clock,
  Plus,
  Truck,
} from 'lucide-react';
import { SummaryCard, SummaryCardGrid } from '../common/SummaryCard';
import { DataTable, DataTableColumn } from '../common/DataTable';
import { DropdownSelect } from '../common/DropdownSelect';

interface TransferOrder {
  id: string;
  transferNo: string;
  sourceBranch: string;
  destBranch: string;
  itemName: string;
  batchNo: string;
  quantity: number;
  requestDate: string;
  status: 'Pending Dispatch' | 'In-Transit' | 'Received & Verified';
  urgency: 'Normal' | 'Urgent' | 'Emergency';
}

export const PharmacistTransfersView: React.FC = () => {
  const [urgencyFilter, setUrgencyFilter] = useState('All');

  const [transfers, setTransfers] = useState<TransferOrder[]>([
    {
      id: 'TR-01',
      transferNo: 'TR-2026-0842',
      sourceBranch: 'Central Medical Store (CMS)',
      destBranch: 'Dhanmondi OPD Pharmacy',
      itemName: 'Napa Extra 500mg/65mg',
      batchNo: 'NP-2026-A1',
      quantity: 5000,
      requestDate: 'Today, 09:30 AM',
      status: 'In-Transit',
      urgency: 'Normal',
    },
    {
      id: 'TR-02',
      transferNo: 'TR-2026-0841',
      sourceBranch: 'Central Medical Store (CMS)',
      destBranch: 'Uttara Branch Pharmacy',
      itemName: 'Ceftron 1g Inj.',
      batchNo: 'CFT-2025-99',
      quantity: 200,
      requestDate: 'Today, 10:15 AM',
      status: 'Pending Dispatch',
      urgency: 'Urgent',
    },
    {
      id: 'TR-03',
      transferNo: 'TR-2026-0839',
      sourceBranch: 'Dhanmondi OPD Pharmacy',
      destBranch: 'Central Medical Store (CMS)',
      itemName: 'Meropenem 1g (FEFO Rebalance)',
      batchNo: 'MRP-2024-X8',
      quantity: 80,
      requestDate: 'Yesterday',
      status: 'Received & Verified',
      urgency: 'Emergency',
    },
    {
      id: 'TR-04',
      transferNo: 'TR-2026-0835',
      sourceBranch: 'Central Medical Store (CMS)',
      destBranch: 'Mirpur Branch Pharmacy',
      itemName: 'Maxpro 20mg Capsule',
      batchNo: 'MX-2026-E2',
      quantity: 2000,
      requestDate: 'Yesterday',
      status: 'Received & Verified',
      urgency: 'Normal',
    },
  ]);

  const markReceived = (id: string) => {
    setTransfers((prev) =>
      prev.map((t) => (t.id === id ? { ...t, status: 'Received & Verified' } : t))
    );
  };

  const filteredTransfers = useMemo(() => {
    return transfers.filter((t) => {
      if (urgencyFilter !== 'All' && t.urgency !== urgencyFilter) return false;
      return true;
    });
  }, [transfers, urgencyFilter]);

  const stats = useMemo(() => {
    const pending = transfers.filter((t) => t.status === 'Pending Dispatch').length;
    const inTransit = transfers.filter((t) => t.status === 'In-Transit').length;
    const received = transfers.filter((t) => t.status === 'Received & Verified').length;
    return { pending, inTransit, received, total: transfers.length };
  }, [transfers]);

  const columns: DataTableColumn<TransferOrder>[] = [
    {
      key: 'transferNo',
      header: 'Transfer Challan #',
      sortable: true,
      sortValue: (r) => r.transferNo,
      render: (r) => (
        <span className="font-mono font-bold text-[#006a4e] text-xs">
          {r.transferNo}
        </span>
      ),
    },
    {
      key: 'itemName',
      header: 'Medicine & Lot',
      sortable: true,
      sortValue: (r) => r.itemName,
      render: (r) => (
        <div>
          <span className="font-bold text-slate-900 text-xs block">
            {r.itemName}
          </span>
          <span className="font-mono text-[11px] text-slate-500 font-semibold">
            Lot: {r.batchNo}
          </span>
        </div>
      ),
    },
    {
      key: 'route',
      header: 'Movement Route (Source → Dest)',
      render: (r) => (
        <div className="flex items-center gap-1.5 text-xs">
          <span className="font-medium text-slate-700">{r.sourceBranch.split(' ')[0]}</span>
          <ArrowRight className="w-3 h-3 text-slate-400" />
          <span className="font-bold text-[#0c2e4b]">{r.destBranch.split(' ')[0]}</span>
        </div>
      ),
    },
    {
      key: 'quantity',
      header: 'Qty Units',
      align: 'center',
      sortable: true,
      sortValue: (r) => r.quantity,
      render: (r) => (
        <span className="font-mono font-bold text-slate-800 text-xs">
          {r.quantity.toLocaleString()}
        </span>
      ),
    },
    {
      key: 'urgency',
      header: 'Urgency',
      align: 'center',
      sortable: true,
      sortValue: (r) => r.urgency,
      render: (r) => (
        <span
          className={`px-2 py-0.5 rounded-[3px] text-xs font-semibold border whitespace-nowrap ${
            r.urgency === 'Emergency'
              ? 'bg-rose-50 text-rose-700 border-rose-200'
              : r.urgency === 'Urgent'
              ? 'bg-amber-50 text-amber-700 border-amber-200'
              : 'bg-slate-100 text-slate-700 border-slate-200'
          }`}
        >
          {r.urgency}
        </span>
      ),
    },
    {
      key: 'status',
      header: 'Challan Status',
      align: 'center',
      sortable: true,
      sortValue: (r) => r.status,
      render: (r) => {
        let cls = 'bg-slate-100 text-slate-700 border-slate-200';
        if (r.status === 'Received & Verified') cls = 'bg-emerald-50 text-emerald-800 border-emerald-300 font-bold';
        else if (r.status === 'In-Transit') cls = 'bg-sky-50 text-sky-800 border-sky-300 font-semibold';
        else if (r.status === 'Pending Dispatch') cls = 'bg-amber-50 text-amber-800 border-amber-300 font-semibold';

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
          {r.status === 'In-Transit' ? (
            <button
              type="button"
              onClick={() => markReceived(r.id)}
              className="px-2 py-1 rounded-[3px] bg-[#006a4e] hover:bg-[#00523c] text-white text-xs font-semibold transition-colors cursor-pointer shadow-xs"
            >
              Verify & Receive
            </button>
          ) : (
            <button
              type="button"
              className="px-2 py-1 rounded-[3px] bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 text-xs font-semibold transition-colors cursor-pointer"
            >
              View Challan
            </button>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-2">
      {/* 4 Summary Metric Cards matching Doctor Portal format */}
      <SummaryCardGrid>
        <SummaryCard
          title="Pending Dispatch"
          icon={Clock}
          iconColor="text-amber-600"
          value={`${stats.pending} Requisitions`}
          valueColor="text-amber-700"
          subtitle="Packing at warehouse"
        />
        <SummaryCard
          title="In-Transit Shipments"
          icon={Truck}
          iconColor="text-sky-600"
          value={`${stats.inTransit} Van`}
          valueColor="text-sky-700"
          subtitle="En route between branches"
        />
        <SummaryCard
          title="Received This Month"
          icon={CheckCircle}
          iconColor="text-[#006a4e]"
          value={`${stats.received + 22} Challans`}
          subtitle="Stock balances updated"
        />
        <SummaryCard
          title="Inter-Branch Network"
          icon={Building2}
          iconColor="text-[#006a4e]"
          value="4 Connected Hubs"
          subtitle="Real-time multi-branch ERP"
        />
      </SummaryCardGrid>

      {/* Enterprise DataTable matching Doctor Portal */}
      <DataTable<TransferOrder>
        title="Inter-Branch Stock Transfers & Goods Movement"
        subtitle="Live transfer requisitions, dispatch delivery tracking, and GRN verification across satellite stores"
        data={filteredTransfers}
        columns={columns}
        keyExtractor={(item) => item.id}
        searchPlaceholder="Search transfer challan # or medicine..."
        searchFilter={(item, query) =>
          item.transferNo.toLowerCase().includes(query.toLowerCase()) ||
          item.itemName.toLowerCase().includes(query.toLowerCase()) ||
          item.sourceBranch.toLowerCase().includes(query.toLowerCase()) ||
          item.destBranch.toLowerCase().includes(query.toLowerCase())
        }
        toolbarFilters={
          <DropdownSelect
            value={urgencyFilter}
            onChange={(val) => setUrgencyFilter(val)}
            options={['All', 'Emergency', 'Urgent', 'Normal']}
            width="w-36"
          />
        }
        headerActions={
          <button
            type="button"
            className="px-2.5 py-1 rounded-[3px] bg-[#006a4e] hover:bg-[#00523c] text-white text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Transfer Order</span>
          </button>
        }
        emptyTitle="No transfer orders found"
        emptyDescription="No transfer orders match the selected filter."
        showSerial={true}
      />
    </div>
  );
};
