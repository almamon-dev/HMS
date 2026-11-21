import React, { useState } from 'react';
import {
  AlertCircle,
  CheckCircle,
  CheckCircle2,
  PackageCheck,
  Pill,
  Printer,
  Search,
  ShieldCheck,
} from 'lucide-react';

interface PrescriptionItem {
  name: string;
  generic: string;
  dosage: string;
  duration: string;
  instructions: string;
  quantity: number;
  allocatedBatch: string;
  batchExpiry: string;
  stockAvailable: number;
}

interface EPrescription {
  id: string;
  rxNumber: string;
  patientName: string;
  uhid: string;
  age: number;
  gender: string;
  doctorName: string;
  department: string;
  date: string;
  priority: 'STAT' | 'Urgent' | 'Routine';
  status: 'Pending' | 'Dispensed' | 'Interaction Review';
  interactionWarning?: string;
  items: PrescriptionItem[];
}

export const PharmacistDispenseView: React.FC = () => {
  const [filterPriority, setFilterPriority] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const [prescriptions, setPrescriptions] = useState<EPrescription[]>([
    {
      id: 'rx-1',
      rxNumber: 'RX-2026-8941',
      patientName: 'Md. Anwar Hossain',
      uhid: 'UHID-08421',
      age: 58,
      gender: 'Male',
      doctorName: 'Prof. Dr. M. A. Hasan',
      department: 'Cardiology (OPD-2)',
      date: 'Today, 11:42 AM',
      priority: 'STAT',
      status: 'Pending',
      items: [
        {
          name: 'Tab. Clopidogrel 75mg (Plagrin)',
          generic: 'Clopidogrel Bisulfate',
          dosage: '1+0+0',
          duration: '30 Days',
          instructions: 'After breakfast',
          quantity: 30,
          allocatedBatch: 'CL-2026-03',
          batchExpiry: '2027-02',
          stockAvailable: 240,
        },
        {
          name: 'Tab. Rosuvastatin 10mg (Rovista)',
          generic: 'Rosuvastatin Calcium',
          dosage: '0+0+1',
          duration: '30 Days',
          instructions: 'At bedtime',
          quantity: 30,
          allocatedBatch: 'RV-2026-09',
          batchExpiry: '2026-12',
          stockAvailable: 310,
        },
        {
          name: 'Cap. Pantoprazole 20mg (Pantobex)',
          generic: 'Pantoprazole Sodium',
          dosage: '1+0+1',
          duration: '15 Days',
          instructions: '30 mins before meal',
          quantity: 30,
          allocatedBatch: 'PT-2026-11',
          batchExpiry: '2027-05',
          stockAvailable: 500,
        },
      ],
    },
    {
      id: 'rx-2',
      rxNumber: 'RX-2026-8940',
      patientName: 'Begum Rokeya',
      uhid: 'UHID-08392',
      age: 46,
      gender: 'Female',
      doctorName: 'Dr. Nusrat Jahan',
      department: 'Internal Medicine (OPD-1)',
      date: 'Today, 11:20 AM',
      priority: 'Urgent',
      status: 'Interaction Review',
      interactionWarning: 'CDSS Alert: High risk concurrent prescription of Ciprofloxacin + Theophylline. Serum theophylline levels may increase significantly.',
      items: [
        {
          name: 'Tab. Ciprofloxacin 500mg (Neofloxin)',
          generic: 'Ciprofloxacin HCl',
          dosage: '1+0+1',
          duration: '7 Days',
          instructions: 'After meal',
          quantity: 14,
          allocatedBatch: 'CF-2026-04',
          batchExpiry: '2026-10',
          stockAvailable: 180,
        },
        {
          name: 'Tab. Theophylline 400mg (Theo-400)',
          generic: 'Theophylline SR',
          dosage: '0+0+1',
          duration: '14 Days',
          instructions: 'After dinner',
          quantity: 14,
          allocatedBatch: 'TH-2025-08',
          batchExpiry: '2026-07',
          stockAvailable: 85,
        },
      ],
    },
    {
      id: 'rx-3',
      rxNumber: 'RX-2026-8938',
      patientName: 'Farhan Kabir',
      uhid: 'UHID-07914',
      age: 32,
      gender: 'Male',
      doctorName: 'Dr. Tanvir Ahmed',
      department: 'Orthopedics (OPD-4)',
      date: 'Today, 10:55 AM',
      priority: 'Routine',
      status: 'Pending',
      items: [
        {
          name: 'Tab. Aceclofenac 100mg (Flexi)',
          generic: 'Aceclofenac',
          dosage: '1+0+1',
          duration: '5 Days',
          instructions: 'After meals with water',
          quantity: 10,
          allocatedBatch: 'FL-2026-01',
          batchExpiry: '2027-03',
          stockAvailable: 420,
        },
        {
          name: 'Cap. Esomeprazole 20mg (Maxpro)',
          generic: 'Esomeprazole Magnesium',
          dosage: '1+0+1',
          duration: '7 Days',
          instructions: 'Before meals',
          quantity: 14,
          allocatedBatch: 'MX-2026-E2',
          batchExpiry: '2026-11',
          stockAvailable: 340,
        },
      ],
    },
  ]);

  const [selectedRx, setSelectedRx] = useState<EPrescription>(prescriptions[0]);
  const [dispensedAnimation, setDispensedAnimation] = useState<boolean>(false);

  const handleDispense = (rxId: string) => {
    setDispensedAnimation(true);
    setTimeout(() => {
      setPrescriptions((prev) =>
        prev.map((r) => (r.id === rxId ? { ...r, status: 'Dispensed' } : r))
      );
      if (selectedRx.id === rxId) {
        setSelectedRx((prev) => ({ ...prev, status: 'Dispensed' }));
      }
      setDispensedAnimation(false);
    }, 1200);
  };

  const filteredRx = prescriptions.filter((rx) => {
    if (filterPriority !== 'all' && rx.priority.toLowerCase() !== filterPriority.toLowerCase()) {
      return false;
    }
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        rx.patientName.toLowerCase().includes(q) ||
        rx.uhid.toLowerCase().includes(q) ||
        rx.rxNumber.toLowerCase().includes(q) ||
        rx.doctorName.toLowerCase().includes(q)
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
            <Pill className="w-5 h-5 text-teal-700" />
            E-Prescription Dispense Queue & Clinical Decision Support (CDSS)
          </h2>
          <p className="text-xs text-slate-500">
            Real-time synchronization with Doctor OPD consultation modules, automated FEFO batch allocation, and drug-drug interaction safety screening.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Queue List (5 cols) */}
        <div className="lg:col-span-5 space-y-3">
          {/* Filters & Search */}
          <div className="bg-white p-3 rounded-xl border border-slate-200/90 shadow-xs space-y-2">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search Patient, UHID, Rx#..."
                className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-teal-600 focus:bg-white"
              />
            </div>
            <div className="flex items-center gap-1.5 text-xs">
              <span className="text-slate-400 font-medium text-[11px]">Priority:</span>
              {(['all', 'STAT', 'Urgent', 'Routine'] as const).map((pri) => (
                <button
                  key={pri}
                  onClick={() => setFilterPriority(pri)}
                  className={`px-2 py-0.5 rounded text-[11px] font-semibold capitalize cursor-pointer transition-colors ${
                    filterPriority === pri
                      ? 'bg-teal-800 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {pri}
                </button>
              ))}
            </div>
          </div>

          {/* Rx Cards */}
          <div className="space-y-2.5">
            {filteredRx.map((rx) => {
              const isSelected = selectedRx.id === rx.id;
              return (
                <div
                  key={rx.id}
                  onClick={() => setSelectedRx(rx)}
                  className={`p-3.5 bg-white rounded-xl border transition-all cursor-pointer shadow-xs ${
                    isSelected
                      ? 'border-teal-600 ring-2 ring-teal-600/20 bg-teal-50/10'
                      : 'border-slate-200/90 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-mono text-xs font-bold text-slate-900">{rx.rxNumber}</span>
                    <span
                      className={`px-2 py-0.5 text-[10px] font-bold rounded-full ${
                        rx.priority === 'STAT'
                          ? 'bg-rose-50 text-rose-700 border border-rose-200 animate-pulse'
                          : rx.priority === 'Urgent'
                          ? 'bg-amber-50 text-amber-700 border border-amber-200'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {rx.priority}
                    </span>
                  </div>

                  <div className="mt-1.5 flex items-center justify-between">
                    <div>
                      <div className="text-xs font-bold text-slate-800">{rx.patientName}</div>
                      <div className="text-[10px] text-slate-400">
                        {rx.uhid} • {rx.gender}, {rx.age}y
                      </div>
                    </div>
                    <span
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
                        rx.status === 'Dispensed'
                          ? 'bg-emerald-50 text-emerald-700'
                          : rx.status === 'Interaction Review'
                          ? 'bg-rose-50 text-rose-700 font-bold'
                          : 'bg-teal-50 text-teal-800'
                      }`}
                    >
                      {rx.status}
                    </span>
                  </div>

                  <div className="mt-2 pt-2 border-t border-slate-100 text-[11px] text-slate-500 flex items-center justify-between">
                    <span>{rx.doctorName}</span>
                    <span>{rx.items.length} meds</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Selected Prescription Details & Dispense Actions (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-white rounded-xl border border-slate-200/90 shadow-xs p-5 space-y-5">
            {/* Header Details */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-base font-bold text-slate-900">{selectedRx.patientName}</span>
                  <span className="text-xs px-2 py-0.5 rounded bg-slate-100 text-slate-600 font-mono">
                    {selectedRx.uhid}
                  </span>
                </div>
                <div className="text-xs text-slate-500 mt-1">
                  Age: {selectedRx.age} Years • Gender: {selectedRx.gender} • Prescribed: {selectedRx.date}
                </div>
              </div>

              <div className="text-left sm:text-right">
                <div className="text-xs font-semibold text-teal-800">{selectedRx.doctorName}</div>
                <div className="text-[11px] text-slate-400">{selectedRx.department}</div>
              </div>
            </div>

            {/* CDSS Drug Safety Alert (If Any) */}
            {selectedRx.interactionWarning && (
              <div className="p-3.5 rounded-lg bg-rose-50 border border-rose-200 flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                <div className="text-xs">
                  <div className="font-bold text-rose-900">Clinical Decision Support Alert (CDSS)</div>
                  <div className="text-rose-700 mt-0.5 leading-relaxed">{selectedRx.interactionWarning}</div>
                  <div className="mt-1.5 flex items-center gap-2">
                    <button className="text-[10px] font-bold px-2 py-0.5 bg-rose-600 text-white rounded hover:bg-rose-700">
                      Override with Clinical Justification
                    </button>
                    <button className="text-[10px] font-bold px-2 py-0.5 bg-white border border-rose-300 text-rose-800 rounded hover:bg-rose-50">
                      Call Doctor (Intercom #204)
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Prescribed Items Table with FEFO Allocation */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  Prescribed Medicines & Allocated FEFO Batches
                </h4>
                <span className="text-[11px] text-emerald-700 font-semibold flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Auto-allocated from CMS Main Store
                </span>
              </div>

              <div className="border border-slate-200 rounded-lg overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-600 border-b border-slate-200 font-semibold">
                    <tr>
                      <th className="py-2.5 px-3">Medicine & Generic</th>
                      <th className="py-2.5 px-2">Dosage & Days</th>
                      <th className="py-2.5 px-2">Qty</th>
                      <th className="py-2.5 px-2">FEFO Batch</th>
                      <th className="py-2.5 px-3 text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {selectedRx.items.map((item, idx) => (
                      <tr key={idx} className="hover:bg-slate-50/50">
                        <td className="py-2.5 px-3">
                          <div className="font-bold text-slate-900">{item.name}</div>
                          <div className="text-[10px] text-slate-400">{item.generic}</div>
                          <div className="text-[10px] text-teal-700 mt-0.5 italic">{item.instructions}</div>
                        </td>
                        <td className="py-2.5 px-2 text-slate-700 font-mono">
                          {item.dosage}
                          <div className="text-[10px] text-slate-400">{item.duration}</div>
                        </td>
                        <td className="py-2.5 px-2 font-bold text-slate-900">{item.quantity}</td>
                        <td className="py-2.5 px-2">
                          <span className="font-mono font-semibold text-slate-800">{item.allocatedBatch}</span>
                          <div className="text-[10px] text-slate-400">Exp: {item.batchExpiry}</div>
                        </td>
                        <td className="py-2.5 px-3 text-right">
                          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                            Verified
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="text-xs text-slate-500">
                Dispensing Pharmacist: <span className="font-semibold text-slate-800">Md. Rafiqul Islam (Reg: B-12948)</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
                >
                  <Printer className="w-4 h-4" />
                  <span>Print Dispense Slip</span>
                </button>

                {selectedRx.status === 'Dispensed' ? (
                  <div className="px-4 py-2 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-lg text-xs font-bold flex items-center gap-1.5">
                    <CheckCircle className="w-4 h-4 text-emerald-600" />
                    <span>Dispensed & Stock Deducted</span>
                  </div>
                ) : (
                  <button
                    disabled={dispensedAnimation}
                    onClick={() => handleDispense(selectedRx.id)}
                    className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold flex items-center gap-2 shadow-sm cursor-pointer transition-all disabled:bg-slate-400"
                  >
                    <PackageCheck className="w-4 h-4" />
                    <span>{dispensedAnimation ? 'Deducting Stock & Signing...' : 'Verify & Dispense'}</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
