import React, { useState } from 'react';
import {
  CheckCircle2,
  FileCheck,
  Lock,
  ShieldAlert,
} from 'lucide-react';

interface NarcoticItem {
  id: string;
  drugName: string;
  dosageForm: string;
  schedule: 'Schedule B (Narcotic)' | 'Schedule C (Controlled)' | 'High-Alert';
  currentStock: number;
  physicalCount: number;
  lastIssuedTo: string;
  authorizedDoctor: string;
  pharmacistSign: string;
  vaultLocation: string;
  status: 'Reconciled' | 'Discrepancy';
}

export const PharmacistNarcoticsView: React.FC = () => {
  const [narcotics] = useState<NarcoticItem[]>([
    {
      id: 'NAR-01',
      drugName: 'Morphine Sulfate 15mg Inj.',
      dosageForm: 'Ampoule 1ml',
      schedule: 'Schedule B (Narcotic)',
      currentStock: 45,
      physicalCount: 45,
      lastIssuedTo: 'ICU Bed 03 (Post-Op CABG)',
      authorizedDoctor: 'Prof. Dr. M. A. Hasan (Reg: A-28190)',
      pharmacistSign: 'Md. Rafiqul Islam (B-12948)',
      vaultLocation: 'Double-Locked Vault Safe #1',
      status: 'Reconciled',
    },
    {
      id: 'NAR-02',
      drugName: 'Pethidine HCl 100mg/2ml Inj.',
      dosageForm: 'Ampoule 2ml',
      schedule: 'Schedule B (Narcotic)',
      currentStock: 30,
      physicalCount: 30,
      lastIssuedTo: 'OT-2 Emergency Laparotomy',
      authorizedDoctor: 'Dr. Tanvir Ahmed (Reg: A-39401)',
      pharmacistSign: 'Md. Rafiqul Islam (B-12948)',
      vaultLocation: 'Double-Locked Vault Safe #1',
      status: 'Reconciled',
    },
    {
      id: 'NAR-03',
      drugName: 'Fentanyl Citrate 50mcg/ml (2ml)',
      dosageForm: 'Ampoule 2ml',
      schedule: 'Schedule B (Narcotic)',
      currentStock: 60,
      physicalCount: 60,
      lastIssuedTo: 'Cardiothoracic OT',
      authorizedDoctor: 'Dr. Shahinur Rahman (Reg: A-31298)',
      pharmacistSign: 'Md. Rafiqul Islam (B-12948)',
      vaultLocation: 'Double-Locked Vault Safe #2',
      status: 'Reconciled',
    },
    {
      id: 'NAR-04',
      drugName: 'Midazolam 5mg/ml Inj. (Dormicum)',
      dosageForm: 'Ampoule 1ml',
      schedule: 'Schedule C (Controlled)',
      currentStock: 110,
      physicalCount: 110,
      lastIssuedTo: 'Endoscopy Suite',
      authorizedDoctor: 'Dr. Nusrat Jahan (Reg: A-42091)',
      pharmacistSign: 'Md. Rafiqul Islam (B-12948)',
      vaultLocation: 'Controlled Cabinet Locker #3',
      status: 'Reconciled',
    },
  ]);

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-rose-600" />
            DGDA Schedule Narcotics & High-Alert Controlled Register
          </h2>
          <p className="text-xs text-slate-500">
            Perpetual double-sign audit log complying with DGDA Bangladesh Narcotics Control Act, requiring attending physician & licensed pharmacist verification.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded bg-rose-50 text-rose-700 text-xs font-bold border border-rose-200 flex items-center gap-1.5">
            <Lock className="w-3.5 h-3.5" />
            Biometric Dual Vault Safe
          </span>
        </div>
      </div>

      {/* Audit Banner */}
      <div className="p-4 rounded-xl bg-slate-900 text-white flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500 text-white uppercase">
              100% Balanced
            </span>
            <span className="text-xs text-slate-300">Daily Physical vs System Count Reconciliation</span>
          </div>
          <div className="text-sm font-semibold text-slate-200">
            Physical Vault Count matches electronic ledger with 0 discrepancy.
          </div>
        </div>

        <button className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 cursor-pointer">
          <FileCheck className="w-4 h-4" />
          <span>Generate DGDA Inspection Audit Sheet</span>
        </button>
      </div>

      {/* Narcotics Table */}
      <div className="bg-white rounded-xl border border-slate-200/90 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#0c2e4b] text-white font-semibold">
              <tr>
                <th className="py-3 px-4">Controlled Drug & Schedule</th>
                <th className="py-3 px-3">Storage Safe Vault</th>
                <th className="py-3 px-2 text-center">System Ledger</th>
                <th className="py-3 px-2 text-center">Physical Audit</th>
                <th className="py-3 px-3">Last Authorized Doctor</th>
                <th className="py-3 px-3">Licensed Pharmacist</th>
                <th className="py-3 px-4 text-center">Reconciliation</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {narcotics.map((nar) => (
                <tr key={nar.id} className="hover:bg-slate-50/70">
                  <td className="py-3 px-4">
                    <div className="font-bold text-slate-900">{nar.drugName}</div>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <span className="text-[10px] font-bold text-rose-700 bg-rose-50 px-1.5 py-0.5 rounded border border-rose-200">
                        {nar.schedule}
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">{nar.dosageForm}</span>
                    </div>
                  </td>
                  <td className="py-3 px-3 text-slate-600 text-[11px] font-mono">{nar.vaultLocation}</td>
                  <td className="py-3 px-2 text-center font-bold text-slate-900 font-mono">{nar.currentStock}</td>
                  <td className="py-3 px-2 text-center font-bold text-teal-800 font-mono">{nar.physicalCount}</td>
                  <td className="py-3 px-3">
                    <div className="text-slate-800 font-semibold">{nar.authorizedDoctor}</div>
                    <div className="text-[10px] text-slate-400">{nar.lastIssuedTo}</div>
                  </td>
                  <td className="py-3 px-3">
                    <div className="text-slate-700 font-medium">{nar.pharmacistSign}</div>
                    <div className="text-[10px] text-emerald-600 font-semibold flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> Digitally Signed
                    </div>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      Zero Variance
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
