import React, { useState } from 'react';
import {
  RotateCcw,
} from 'lucide-react';

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
  ]);

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <RotateCcw className="w-5 h-5 text-teal-700" />
            Customer Medicine Returns & Return-to-Vendor (RTV)
          </h2>
          <p className="text-xs text-slate-500">
            Intact blister seal inspection, invoice verification, FEFO restocking protocol, and vendor return debit notes.
          </p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200/90 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900">Recent Customer Sales Returns</h3>
          <span className="text-xs text-slate-500">Strict cold-chain & controlled drugs are non-returnable</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 border-b border-slate-200 font-semibold">
              <tr>
                <th className="py-3 px-4">Return ID</th>
                <th className="py-3 px-3">Original Invoice</th>
                <th className="py-3 px-3">Customer</th>
                <th className="py-3 px-3">Medicine & Lot</th>
                <th className="py-3 px-2 text-center">Qty</th>
                <th className="py-3 px-3 text-right">Refund (৳)</th>
                <th className="py-3 px-3">Physical Condition</th>
                <th className="py-3 px-4 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {returnRecords.map((ret) => (
                <tr key={ret.id} className="hover:bg-slate-50/70">
                  <td className="py-3 px-4 font-mono font-bold text-slate-900">{ret.returnNo}</td>
                  <td className="py-3 px-3 font-mono text-teal-700 font-semibold">{ret.originalBillNo}</td>
                  <td className="py-3 px-3 text-slate-800 font-medium">{ret.customerName}</td>
                  <td className="py-3 px-3">
                    <div className="font-bold text-slate-800">{ret.medicineName}</div>
                    <div className="text-[10px] text-slate-400 font-mono">Lot: {ret.batchNo}</div>
                  </td>
                  <td className="py-3 px-2 text-center font-bold text-slate-800">{ret.quantityReturned}</td>
                  <td className="py-3 px-3 text-right font-bold text-slate-900">৳ {ret.refundAmount.toFixed(2)}</td>
                  <td className="py-3 px-3">
                    <span className="text-[11px] text-emerald-700 font-medium bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">
                      {ret.condition}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <span className="inline-block px-2.5 py-1 rounded text-[11px] font-semibold bg-emerald-50 text-emerald-700">
                      {ret.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
