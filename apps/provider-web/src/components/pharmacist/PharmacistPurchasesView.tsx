import React, { useMemo, useState } from 'react';
import {
  CheckCircle,
  CheckCircle2,
  DollarSign,
  Plus,
  ShoppingCart,
  Truck,
} from 'lucide-react';
import { SummaryCard, SummaryCardGrid } from '../common/SummaryCard';
import { DataTable, DataTableColumn } from '../common/DataTable';
import { DropdownSelect } from '../common/DropdownSelect';
import { PageHeader } from '../common/PageHeader';

interface PurchaseOrder {
  id: string;
  poNumber: string;
  vendorName: string;
  orderDate: string;
  expectedDelivery: string;
  totalAmount: number;
  itemCount: number;
  status: 'Draft' | 'Sent to Vendor' | 'Partially Received' | 'GRN Completed & Closed';
  threeWayMatch: boolean;
}

export const PharmacistPurchasesView: React.FC = () => {
  const [statusFilter, setStatusFilter] = useState('All');

  const [purchaseOrders] = useState<PurchaseOrder[]>([
    {
      id: 'PO-01',
      poNumber: 'PO-2026-0192',
      vendorName: 'Square Pharmaceuticals Ltd.',
      orderDate: '2026-11-18',
      expectedDelivery: '2026-11-22',
      totalAmount: 1850000,
      itemCount: 24,
      status: 'Sent to Vendor',
      threeWayMatch: false,
    },
    {
      id: 'PO-02',
      poNumber: 'PO-2026-0188',
      vendorName: 'Beximco Pharmaceuticals Ltd.',
      orderDate: '2026-11-14',
      expectedDelivery: '2026-11-19',
      totalAmount: 1240000,
      itemCount: 18,
      status: 'GRN Completed & Closed',
      threeWayMatch: true,
    },
    {
      id: 'PO-03',
      poNumber: 'PO-2026-0185',
      vendorName: 'Incepta Pharmaceuticals Ltd.',
      orderDate: '2026-11-10',
      expectedDelivery: '2026-11-15',
      totalAmount: 980000,
      itemCount: 12,
      status: 'GRN Completed & Closed',
      threeWayMatch: true,
    },
    {
      id: 'PO-04',
      poNumber: 'PO-2026-0182',
      vendorName: 'Renata Limited',
      orderDate: '2026-11-06',
      expectedDelivery: '2026-11-12',
      totalAmount: 760000,
      itemCount: 10,
      status: 'GRN Completed & Closed',
      threeWayMatch: true,
    },
    {
      id: 'PO-05',
      poNumber: 'PO-2026-0180',
      vendorName: 'Acme Laboratories Ltd.',
      orderDate: '2026-11-01',
      expectedDelivery: '2026-11-08',
      totalAmount: 540000,
      itemCount: 8,
      status: 'GRN Completed & Closed',
      threeWayMatch: true,
    },
  ]);

  const filteredOrders = useMemo(() => {
    return purchaseOrders.filter((po) => {
      if (statusFilter !== 'All' && !po.status.includes(statusFilter)) return false;
      return true;
    });
  }, [purchaseOrders, statusFilter]);

  const stats = useMemo(() => {
    const total = purchaseOrders.length;
    const pendingGrn = purchaseOrders.filter((p) => !p.threeWayMatch).length;
    const verified = purchaseOrders.filter((p) => p.threeWayMatch).length;
    const totalSpend = purchaseOrders.reduce((sum, p) => sum + p.totalAmount, 0);
    return { total, pendingGrn, verified, totalSpend };
  }, [purchaseOrders]);

  const columns: DataTableColumn<PurchaseOrder>[] = [
    {
      key: 'poNumber',
      header: 'PO Number',
      sortable: true,
      sortValue: (r) => r.poNumber,
      render: (r) => (
        <span className="font-mono font-bold text-[#006a4e] text-xs">
          {r.poNumber}
        </span>
      ),
    },
    {
      key: 'vendorName',
      header: 'Manufacturer / Vendor',
      sortable: true,
      sortValue: (r) => r.vendorName,
      render: (r) => (
        <span className="font-semibold text-slate-800 text-xs">
          {r.vendorName}
        </span>
      ),
    },
    {
      key: 'orderDate',
      header: 'Order Date',
      sortable: true,
      sortValue: (r) => r.orderDate,
      render: (r) => (
        <span className="text-xs text-slate-600 font-mono">
          {r.orderDate}
        </span>
      ),
    },
    {
      key: 'expectedDelivery',
      header: 'Expected Delivery',
      sortable: true,
      sortValue: (r) => r.expectedDelivery,
      render: (r) => (
        <span className="text-xs text-slate-600 font-mono">
          {r.expectedDelivery}
        </span>
      ),
    },
    {
      key: 'itemCount',
      header: 'SKUs Count',
      align: 'center',
      sortable: true,
      sortValue: (r) => r.itemCount,
      render: (r) => (
        <span className="text-xs font-bold text-slate-800">
          {r.itemCount} SKUs
        </span>
      ),
    },
    {
      key: 'totalAmount',
      header: 'PO Value (৳)',
      align: 'right',
      sortable: true,
      sortValue: (r) => r.totalAmount,
      render: (r) => (
        <span className="font-bold text-slate-900 text-xs">
          ৳ {r.totalAmount.toLocaleString()}
        </span>
      ),
    },
    {
      key: 'threeWayMatch',
      header: '3-Way Match',
      align: 'center',
      sortable: true,
      sortValue: (r) => (r.threeWayMatch ? 1 : 0),
      render: (r) =>
        r.threeWayMatch ? (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-[3px] border border-emerald-100">
            <CheckCircle className="w-3 h-3 text-emerald-600" />
            Verified
          </span>
        ) : (
          <span className="text-[11px] font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-[3px] border border-amber-200">
            Pending GRN
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
        <span
          className={`px-2 py-0.5 rounded-[3px] text-xs font-semibold border whitespace-nowrap ${
            r.status.includes('Completed')
              ? 'bg-emerald-50 text-emerald-800 border-emerald-300 font-bold'
              : 'bg-sky-50 text-sky-800 border-sky-300 font-semibold'
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
      render: () => (
        <div className="flex items-center justify-end gap-1.5 whitespace-nowrap">
          <button
            type="button"
            className="px-2 py-1 rounded-[3px] bg-[#0c2e4b] hover:bg-[#081e31] text-white text-xs font-semibold transition-colors cursor-pointer shadow-xs"
          >
            Inspect GRN
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-2">
      <PageHeader
        title="Purchase Orders"
        description="Central Medical Store · Supplier procurement orders & GRN"
      />
      {/* 4 Summary Metric Cards matching Doctor Portal format */}
      <SummaryCardGrid>
        <SummaryCard
          title="Active Purchase Orders"
          icon={ShoppingCart}
          iconColor="text-[#006a4e]"
          value={`${stats.total} Orders`}
          subtitle="Procurement pipeline"
        />
        <SummaryCard
          title="Pending GRN Receipts"
          icon={Truck}
          iconColor="text-amber-600"
          value={`${stats.pendingGrn} Shipments`}
          valueColor="text-amber-700"
          subtitle="Awaiting warehouse intake"
        />
        <SummaryCard
          title="3-Way Match Verified"
          icon={CheckCircle2}
          iconColor="text-[#006a4e]"
          value={`${stats.verified} Verified`}
          subtitle="PO vs Invoice vs Physical GRN"
        />
        <SummaryCard
          title="Total Procurement Value"
          icon={DollarSign}
          iconColor="text-[#006a4e]"
          value={`৳ ${(stats.totalSpend / 100000).toFixed(1)} Lakh`}
          subtitle="Audited supplier invoices"
        />
      </SummaryCardGrid>

      {/* Enterprise DataTable matching Doctor Portal */}
      <DataTable<PurchaseOrder>
        title="Procurement, Purchase Orders (PO) & GRN 3-Way Match"
        subtitle="Automated Reorder Level triggers, Goods Received Notes, and invoice reconciliation"
        data={filteredOrders}
        columns={columns}
        keyExtractor={(item) => item.id}
        searchPlaceholder="Search PO number or vendor..."
        searchFilter={(item, query) =>
          item.poNumber.toLowerCase().includes(query.toLowerCase()) ||
          item.vendorName.toLowerCase().includes(query.toLowerCase())
        }
        toolbarFilters={
          <DropdownSelect
            value={statusFilter}
            onChange={(val) => setStatusFilter(val)}
            options={['All', 'Sent', 'Completed']}
            width="w-36"
          />
        }
        headerActions={
          <button
            type="button"
            className="px-2.5 py-1 rounded-[3px] bg-[#006a4e] hover:bg-[#00523c] text-white text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Create Purchase Order</span>
          </button>
        }
        emptyTitle="No purchase orders found"
        emptyDescription="No purchase orders match the selected filter."
        showSerial={true}
      />
    </div>
  );
};
