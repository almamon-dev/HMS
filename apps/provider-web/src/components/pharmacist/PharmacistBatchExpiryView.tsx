import React, { useState } from 'react';
import {
  AlertOctagon,
  AlertTriangle,
  CalendarClock,
  CheckCircle2,
  Search,
} from 'lucide-react';

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
  const [filterRange, setFilterRange] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

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
      location: 'Uttara Branch Pharmacy',
      mfgDate: '2025-02',
      expDate: '2027-02-05',
      daysRemaining: 76,
      quantity: 210,
      unitCost: 165.0,
      status: 'Notice',
    },
    {
      id: 'B-04',
      medicineName: 'Pantoprazole 40mg IV (Pantobex)',
      batchNo: 'PTB-2025-14',
      location: 'Mirpur Branch Pharmacy',
      mfgDate: '2025-04',
      expDate: '2027-04-30',
      daysRemaining: 160,
      quantity: 450,
      unitCost: 65.0,
      status: 'Safe',
    },
    {
      id: 'B-05',
      medicineName: 'Amoxicillin + Clavulanic 625mg (Moxaclav)',
      batchNo: 'MXC-2025-42',
      location: 'Central Medical Store (CMS)',
      mfgDate: '2025-03',
      expDate: '2027-01-28',
      daysRemaining: 68,
      quantity: 600,
      unitCost: 28.0,
      status: 'Notice',
    },
  ]);

  const toggleQuarantine = (id: string) => {
    setBatches((prev) =>
      prev.map((b) => (b.id === id ? { ...b, isQuarantined: !b.isQuarantined } : b))
    );
  };

  const filteredBatches = batches.filter((b) => {
    if (filterRange === 'critical' && b.daysRemaining > 30) return false;
    if (filterRange === 'warning' && (b.daysRemaining <= 30 || b.daysRemaining > 60)) return false;
    if (filterRange === 'notice' && (b.daysRemaining <= 60 || b.daysRemaining > 90)) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        b.medicineName.toLowerCase().includes(q) ||
        b.batchNo.toLowerCase().includes(q) ||
        b.location.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <CalendarClock className="w-5 h-5 text-amber-600" />
            FEFO Batch Expiry & Stock Ageing Ledger
          </h2>
          <p className="text-xs text-slate-500">
            Automated First-Expiry-First-Out enforcement, near-expiry alerts, quarantine protocol, and Return to Vendor (RTV) pipeline.
          </p>
        </div>
      </div>

      {/* Expiry Alarm Badges */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
        <button
          onClick={() => setFilterRange('critical')}
          className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
            filterRange === 'critical'
              ? 'bg-rose-50 border-rose-500 ring-2 ring-rose-500/20'
              : 'bg-white border-slate-200/90 hover:border-slate-300'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-rose-700 uppercase">Critical Expiry</span>
            <AlertOctagon className="w-4 h-4 text-rose-600" />
          </div>
          <div className="text-2xl font-bold text-slate-900 mt-2">&lt; 30 Days</div>
          <div className="text-[11px] text-slate-500 mt-0.5">1 Batch requires immediate transfer</div>
        </button>

        <button
          onClick={() => setFilterRange('warning')}
          className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
            filterRange === 'warning'
              ? 'bg-amber-50 border-amber-500 ring-2 ring-amber-500/20'
              : 'bg-white border-slate-200/90 hover:border-slate-300'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-amber-700 uppercase">Warning Window</span>
            <AlertTriangle className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl font-bold text-slate-900 mt-2">30 - 60 Days</div>
          <div className="text-[11px] text-slate-500 mt-0.5">1 Batch in Cold Chain store</div>
        </button>

        <button
          onClick={() => setFilterRange('notice')}
          className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
            filterRange === 'notice'
              ? 'bg-yellow-50 border-yellow-500 ring-2 ring-yellow-500/20'
              : 'bg-white border-slate-200/90 hover:border-slate-300'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-yellow-700 uppercase">Early Notice</span>
            <CalendarClock className="w-4 h-4 text-yellow-600" />
          </div>
          <div className="text-2xl font-bold text-slate-900 mt-2">60 - 90 Days</div>
          <div className="text-[11px] text-slate-500 mt-0.5">2 Batches under surveillance</div>
        </button>

        <button
          onClick={() => setFilterRange('all')}
          className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
            filterRange === 'all'
              ? 'bg-teal-50 border-teal-600 ring-2 ring-teal-600/20'
              : 'bg-white border-slate-200/90 hover:border-slate-300'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-teal-700 uppercase">All Tracked Batches</span>
            <CheckCircle2 className="w-4 h-4 text-teal-600" />
          </div>
          <div className="text-2xl font-bold text-slate-900 mt-2">{batches.length} Batches</div>
          <div className="text-[11px] text-slate-500 mt-0.5">Total audited lots in ERP</div>
        </button>
      </div>

      {/* Batch Table */}
      <div className="bg-white rounded-xl border border-slate-200/90 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row gap-3 justify-between items-center">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search batch # or medicine..."
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg"
            />
          </div>
          <span className="text-xs text-slate-500">
            Showing <span className="font-bold text-slate-800">{filteredBatches.length}</span> batch records
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 border-b border-slate-200 font-semibold">
              <tr>
                <th className="py-3 px-4">Medicine & Lot</th>
                <th className="py-3 px-3">Location Storage</th>
                <th className="py-3 px-3">Quantity</th>
                <th className="py-3 px-3">Expiry Date</th>
                <th className="py-3 px-3 text-center">Countdown</th>
                <th className="py-3 px-3 text-right">Value (৳)</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredBatches.map((b) => (
                <tr key={b.id} className={b.isQuarantined ? 'bg-rose-50/40' : 'hover:bg-slate-50/60'}>
                  <td className="py-3 px-4">
                    <div className="font-bold text-slate-900">{b.medicineName}</div>
                    <div className="font-mono text-[11px] text-teal-800 mt-0.5 font-semibold">
                      Batch: {b.batchNo}
                    </div>
                  </td>
                  <td className="py-3 px-3 text-slate-600 text-[11px]">{b.location}</td>
                  <td className="py-3 px-3 font-bold text-slate-800">{b.quantity} Units</td>
                  <td className="py-3 px-3 font-mono text-slate-700">{b.expDate}</td>
                  <td className="py-3 px-3 text-center">
                    <span
                      className={`inline-block px-2.5 py-1 rounded-full text-[11px] font-bold ${
                        b.daysRemaining <= 30
                          ? 'bg-rose-100 text-rose-800 animate-pulse'
                          : b.daysRemaining <= 60
                          ? 'bg-amber-100 text-amber-800'
                          : b.daysRemaining <= 90
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-emerald-100 text-emerald-800'
                      }`}
                    >
                      {b.daysRemaining} Days
                    </span>
                  </td>
                  <td className="py-3 px-3 text-right font-semibold text-slate-800">
                    ৳ {(b.quantity * b.unitCost).toLocaleString()}
                  </td>
                  <td className="py-3 px-4 text-right space-x-2">
                    <button
                      onClick={() => toggleQuarantine(b.id)}
                      className={`px-2.5 py-1 rounded text-[11px] font-bold cursor-pointer transition-colors ${
                        b.isQuarantined
                          ? 'bg-rose-600 text-white'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      {b.isQuarantined ? 'Quarantined' : 'Quarantine'}
                    </button>
                    <button className="px-2.5 py-1 rounded text-[11px] font-bold bg-teal-50 text-teal-700 hover:bg-teal-100 cursor-pointer">
                      Transfer
                    </button>
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
