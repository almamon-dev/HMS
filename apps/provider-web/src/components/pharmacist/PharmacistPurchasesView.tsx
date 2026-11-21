import React, { useState } from 'react';
import {
  CheckCircle,
  Plus,
  ShoppingCart,
} from 'lucide-react';

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
  ]);

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <ShoppingCart className="w-5 h-5 text-teal-700" />
            Procurement, Purchase Orders (PO) & GRN 3-Way Match
          </h2>
          <p className="text-xs text-slate-500">
            Automated Reorder Level triggers, Goods Received Notes (GRN) with batch allocation, and 3-way match audit.
          </p>
        </div>
        <button className="px-4 py-2 bg-teal-700 hover:bg-teal-800 text-white rounded-lg text-xs font-semibold flex items-center gap-2 shadow-xs cursor-pointer">
          <Plus className="w-4 h-4" />
          <span>Create Purchase Order</span>
        </button>
      </div>

      {/* PO Table */}
      <div className="bg-white rounded-xl border border-slate-200/90 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 border-b border-slate-200 font-semibold">
              <tr>
                <th className="py-3 px-4">PO Number</th>
                <th className="py-3 px-3">Manufacturer / Vendor</th>
                <th className="py-3 px-3">Order Date</th>
                <th className="py-3 px-3">Expected Date</th>
                <th className="py-3 px-3 text-center">Items</th>
                <th className="py-3 px-3 text-right">Total Amount (৳)</th>
                <th className="py-3 px-3 text-center">3-Way Match</th>
                <th className="py-3 px-4 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {purchaseOrders.map((po) => (
                <tr key={po.id} className="hover:bg-slate-50/70">
                  <td className="py-3 px-4 font-mono font-bold text-slate-900">{po.poNumber}</td>
                  <td className="py-3 px-3 font-semibold text-slate-800">{po.vendorName}</td>
                  <td className="py-3 px-3 text-slate-500">{po.orderDate}</td>
                  <td className="py-3 px-3 text-slate-500">{po.expectedDelivery}</td>
                  <td className="py-3 px-3 text-center font-bold text-slate-700">{po.itemCount} SKUs</td>
                  <td className="py-3 px-3 text-right font-bold text-slate-900">
                    ৳ {po.totalAmount.toLocaleString()}
                  </td>
                  <td className="py-3 px-3 text-center">
                    {po.threeWayMatch ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">
                        <CheckCircle className="w-3 h-3 text-emerald-600" />
                        Verified
                      </span>
                    ) : (
                      <span className="text-[11px] font-semibold text-slate-400 bg-slate-100 px-2 py-0.5 rounded">
                        Pending GRN
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-right">
                    <span
                      className={`inline-block px-2.5 py-1 rounded-md text-[11px] font-semibold ${
                        po.status.includes('Completed')
                          ? 'bg-emerald-50 text-emerald-700'
                          : 'bg-sky-50 text-sky-700'
                      }`}
                    >
                      {po.status}
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
