import React, { useState } from 'react';
import {
  ArrowLeftRight,
  ArrowRight,
  CheckCircle,
  Clock,
  Plus,
  Truck,
} from 'lucide-react';

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
  const [transfers, setTransfers] = useState<TransferOrder[]>([
    {
      id: 'TR-01',
      transferNo: 'TR-2026-0842',
      sourceBranch: 'Central Medical Store (CMS)',
      destBranch: 'Dhanmondi OPD Pharmacy',
      itemName: 'Napa Extra 500mg/65mg (5,000 tabs)',
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
      itemName: 'Ceftron 1g Inj. (200 vials)',
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
      itemName: 'Meropenem 1g (Batch: MRP-2024-X8 Near Expiry Rebalance)',
      batchNo: 'MRP-2024-X8',
      quantity: 80,
      requestDate: 'Yesterday',
      status: 'Received & Verified',
      urgency: 'Emergency',
    },
  ]);

  const markReceived = (id: string) => {
    setTransfers((prev) =>
      prev.map((t) => (t.id === id ? { ...t, status: 'Received & Verified' } : t))
    );
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <ArrowLeftRight className="w-5 h-5 text-teal-700" />
            Inter-Branch Stock Transfers & Goods Movement
          </h2>
          <p className="text-xs text-slate-500">
            Real-time stock rebalancing, transfer challans, transit tracking, and GRN receipt between hospital branches.
          </p>
        </div>
        <button className="px-4 py-2 bg-teal-700 hover:bg-teal-800 text-white rounded-lg text-xs font-semibold flex items-center gap-2 shadow-xs cursor-pointer">
          <Plus className="w-4 h-4" />
          <span>New Transfer Requisition</span>
        </button>
      </div>

      {/* Grid summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 bg-white rounded-xl border border-slate-200/90 shadow-xs flex items-center gap-3">
          <div className="p-3 bg-amber-50 text-amber-700 rounded-lg">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xl font-bold text-slate-900">1 Pending</div>
            <div className="text-xs text-slate-500">Awaiting dispatch packing</div>
          </div>
        </div>

        <div className="p-4 bg-white rounded-xl border border-slate-200/90 shadow-xs flex items-center gap-3">
          <div className="p-3 bg-teal-50 text-teal-700 rounded-lg">
            <Truck className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xl font-bold text-slate-900">1 In-Transit</div>
            <div className="text-xs text-slate-500">On hospital delivery van</div>
          </div>
        </div>

        <div className="p-4 bg-white rounded-xl border border-slate-200/90 shadow-xs flex items-center gap-3">
          <div className="p-3 bg-emerald-50 text-emerald-700 rounded-lg">
            <CheckCircle className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xl font-bold text-slate-900">24 Completed</div>
            <div className="text-xs text-slate-500">Successfully received this month</div>
          </div>
        </div>
      </div>

      {/* Transfer Orders List */}
      <div className="bg-white rounded-xl border border-slate-200/90 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900">Active Branch Transfers</h3>
        </div>

        <div className="divide-y divide-slate-100">
          {transfers.map((item) => (
            <div key={item.id} className="p-4 hover:bg-slate-50/70 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1.5 min-w-0 flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-mono text-xs font-bold text-slate-900">{item.transferNo}</span>
                  <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full ${
                    item.urgency === 'Emergency'
                      ? 'bg-rose-50 text-rose-700 border border-rose-200'
                      : item.urgency === 'Urgent'
                      ? 'bg-amber-50 text-amber-700 border border-amber-200'
                      : 'bg-slate-100 text-slate-600'
                  }`}>
                    {item.urgency}
                  </span>
                  <span className="text-[11px] text-slate-400">{item.requestDate}</span>
                </div>

                <div className="text-sm font-bold text-slate-800">{item.itemName}</div>

                <div className="flex items-center gap-2 text-xs text-slate-600">
                  <span className="font-medium text-slate-700">{item.sourceBranch}</span>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                  <span className="font-medium text-teal-800">{item.destBranch}</span>
                </div>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <span
                  className={`px-3 py-1 rounded-md text-xs font-semibold ${
                    item.status === 'Received & Verified'
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      : item.status === 'In-Transit'
                      ? 'bg-sky-50 text-sky-700 border border-sky-200'
                      : 'bg-amber-50 text-amber-700 border border-amber-200'
                  }`}
                >
                  {item.status}
                </span>

                {item.status === 'In-Transit' && (
                  <button
                    onClick={() => markReceived(item.id)}
                    className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg cursor-pointer transition-colors"
                  >
                    Receive & Verify GRN
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
