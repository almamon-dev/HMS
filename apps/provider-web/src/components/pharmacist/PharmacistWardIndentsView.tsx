import React, { useState } from 'react';
import {
  Bed,
  PackageCheck,
} from 'lucide-react';

interface WardIndent {
  id: string;
  indentNo: string;
  wardName: string;
  bedNo: string;
  patientName: string;
  uhid: string;
  nurseRequester: string;
  items: { name: string; requestedQty: number; approvedQty: number; unit: string }[];
  time: string;
  status: 'Pending' | 'Dispensed' | 'Partial';
}

export const PharmacistWardIndentsView: React.FC = () => {
  const [indents, setIndents] = useState<WardIndent[]>([
    {
      id: 'WI-01',
      indentNo: 'IND-2026-441',
      wardName: 'Intensive Care Unit (ICU)',
      bedNo: 'ICU Bed 04',
      patientName: 'Ayesha Siddiqua',
      uhid: 'UHID-08112',
      nurseRequester: 'Sr. Nasima Akhter (RN)',
      items: [
        { name: 'Inj. Noradrenaline 4mg/2ml', requestedQty: 4, approvedQty: 4, unit: 'Ampoules' },
        { name: 'Inj. Meropenem 1g IV', requestedQty: 3, approvedQty: 3, unit: 'Vials' },
        { name: 'Normal Saline 0.9% 500ml', requestedQty: 4, approvedQty: 4, unit: 'Bags' },
      ],
      time: '20 mins ago',
      status: 'Pending',
    },
    {
      id: 'WI-02',
      indentNo: 'IND-2026-440',
      wardName: 'Coronary Care Unit (CCU)',
      bedNo: 'CCU Bed 02',
      patientName: 'Kazi Mahbubul Alam',
      uhid: 'UHID-07923',
      nurseRequester: 'Sr. Rebecca Gomez (RN)',
      items: [
        { name: 'Inj. Heparin 5000 IU/ml', requestedQty: 2, approvedQty: 2, unit: 'Vials' },
        { name: 'Tab. Aspirin 75mg (Disprin)', requestedQty: 10, approvedQty: 10, unit: 'Tabs' },
      ],
      time: '45 mins ago',
      status: 'Pending',
    },
    {
      id: 'WI-03',
      indentNo: 'IND-2026-438',
      wardName: 'General Surgery Ward 4B',
      bedNo: 'Bed 412',
      patientName: 'Md. Zahid Hasan',
      uhid: 'UHID-08204',
      nurseRequester: 'Nurse Salma Begum',
      items: [
        { name: 'Inj. Ceftriaxone 1g IV', requestedQty: 2, approvedQty: 2, unit: 'Vials' },
        { name: 'Inj. Ketorolac 30mg/ml', requestedQty: 2, approvedQty: 2, unit: 'Ampoules' },
      ],
      time: '2 hours ago',
      status: 'Dispensed',
    },
  ]);

  const handleApprove = (id: string) => {
    setIndents((prev) =>
      prev.map((i) => (i.id === id ? { ...i, status: 'Dispensed' } : i))
    );
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Bed className="w-5 h-5 text-teal-700" />
            IPD Inpatient Ward Floor Stock & Unit Dose Indents
          </h2>
          <p className="text-xs text-slate-500">
            Requisitions submitted by Ward Nurses, patient-specific 24-hour Unit Dose Dispensing (UDD), and automated ward billing.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {indents.map((ind) => (
          <div key={ind.id} className="bg-white rounded-xl border border-slate-200/90 shadow-xs p-5 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-mono text-xs font-bold text-slate-900">{ind.indentNo}</span>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-teal-50 text-teal-800 border border-teal-200">
                  {ind.wardName}
                </span>
                <span className="text-xs font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
                  {ind.bedNo}
                </span>
                <span className="text-xs text-slate-400">{ind.time}</span>
              </div>

              <div className="text-xs text-slate-500">
                Requested by: <span className="font-semibold text-slate-800">{ind.nurseRequester}</span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs text-slate-400">Patient: </span>
                <span className="text-xs font-bold text-slate-900">{ind.patientName}</span>
                <span className="text-[11px] text-slate-500 ml-1.5">({ind.uhid})</span>
              </div>
            </div>

            {/* Items table */}
            <div className="border border-slate-100 rounded-lg overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-600 font-semibold">
                  <tr>
                    <th className="py-2 px-3">Requested Medication</th>
                    <th className="py-2 px-3 text-center">Requested Qty</th>
                    <th className="py-2 px-3 text-center">Approved Qty</th>
                    <th className="py-2 px-3">Unit</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {ind.items.map((it, idx) => (
                    <tr key={idx}>
                      <td className="py-2 px-3 font-semibold text-slate-800">{it.name}</td>
                      <td className="py-2 px-3 text-center font-bold text-slate-700">{it.requestedQty}</td>
                      <td className="py-2 px-3 text-center font-bold text-teal-800">{it.approvedQty}</td>
                      <td className="py-2 px-3 text-slate-500">{it.unit}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex items-center justify-between pt-2">
              <span className={`text-xs font-semibold px-2.5 py-1 rounded ${
                ind.status === 'Dispensed' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
              }`}>
                {ind.status}
              </span>

              {ind.status === 'Pending' && (
                <button
                  onClick={() => handleApprove(ind.id)}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <PackageCheck className="w-4 h-4" />
                  <span>Approve & Issue to Ward</span>
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
