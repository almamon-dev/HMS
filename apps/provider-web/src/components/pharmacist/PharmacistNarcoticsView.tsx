import React, { useMemo, useState } from 'react';
import {
  CheckCircle2,
  FileCheck,
  Lock,
  ShieldAlert,
  UserCheck,
} from 'lucide-react';
import { SummaryCard, SummaryCardGrid } from '../common/SummaryCard';
import { DataTable, DataTableColumn } from '../common/DataTable';
import { PageHeader } from '../common/PageHeader';

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

  const stats = useMemo(() => {
    const schedB = narcotics.filter((n) => n.schedule.includes('Schedule B')).length;
    const schedC = narcotics.filter((n) => n.schedule.includes('Schedule C')).length;
    return { schedB, schedC, total: narcotics.length };
  }, [narcotics]);

  const columns: DataTableColumn<NarcoticItem>[] = [
    {
      key: 'drugName',
      header: 'Controlled Drug & Schedule',
      sortable: true,
      sortValue: (r) => r.drugName,
      render: (r) => (
        <div>
          <span className="font-bold text-slate-900 text-xs block">
            {r.drugName}
          </span>
          <div className="flex items-center gap-1.5 mt-0.5">
            <span className="text-[10px] font-bold text-rose-700 bg-rose-50 px-1.5 py-0.2 rounded border border-rose-200">
              {r.schedule}
            </span>
            <span className="text-[10px] text-slate-400 font-mono">{r.dosageForm}</span>
          </div>
        </div>
      ),
    },
    {
      key: 'vaultLocation',
      header: 'Biometric Safe Vault',
      sortable: true,
      sortValue: (r) => r.vaultLocation,
      render: (r) => (
        <span className="text-xs text-slate-600 font-mono">
          {r.vaultLocation}
        </span>
      ),
    },
    {
      key: 'currentStock',
      header: 'System Stock',
      align: 'center',
      sortable: true,
      sortValue: (r) => r.currentStock,
      render: (r) => (
        <span className="font-mono font-bold text-slate-900 text-xs">
          {r.currentStock} Units
        </span>
      ),
    },
    {
      key: 'physicalCount',
      header: 'Physical Audit',
      align: 'center',
      sortable: true,
      sortValue: (r) => r.physicalCount,
      render: (r) => (
        <span className="font-mono font-bold text-[#006a4e] text-xs">
          {r.physicalCount} Units
        </span>
      ),
    },
    {
      key: 'authorizedDoctor',
      header: 'Authorizing Doctor',
      sortable: true,
      sortValue: (r) => r.authorizedDoctor,
      render: (r) => (
        <div>
          <span className="font-semibold text-slate-800 text-xs block">
            {r.authorizedDoctor}
          </span>
          <span className="text-[11px] text-slate-500 font-medium">
            {r.lastIssuedTo}
          </span>
        </div>
      ),
    },
    {
      key: 'pharmacistSign',
      header: 'Pharmacist Sign-Off',
      render: (r) => (
        <div>
          <span className="text-slate-800 font-medium text-xs block">
            {r.pharmacistSign}
          </span>
          <span className="text-[10px] text-emerald-600 font-semibold flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" /> Digitally Verified
          </span>
        </div>
      ),
    },
    {
      key: 'status',
      header: 'Variance Audit',
      align: 'center',
      sortable: true,
      sortValue: (r) => r.status,
      render: () => (
        <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-[3px] bg-emerald-50 text-emerald-700 border border-emerald-200">
          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
          Zero Variance
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
            Audit Log
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-2">
      <PageHeader
        title="Narcotics Register"
        description="Regulated controlled substances register, strict dual-pharmacist signoff, and DGDA audit logs."
      />
      {/* 4 Summary Metric Cards matching Doctor Portal format */}
      <SummaryCardGrid>
        <SummaryCard
          title="Schedule B (Narcotics)"
          icon={ShieldAlert}
          iconColor="text-rose-600"
          value={`${stats.schedB} Registered Drugs`}
          valueColor="text-rose-700"
          subtitle="Morphine, Pethidine, Fentanyl"
          badge={
            <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
              DGDA
            </span>
          }
        />
        <SummaryCard
          title="Schedule C (Controlled)"
          icon={Lock}
          iconColor="text-amber-600"
          value={`${stats.schedC} Controlled`}
          valueColor="text-amber-700"
          subtitle="Midazolam & Sedatives"
        />
        <SummaryCard
          title="Dual-Sign Compliance"
          icon={UserCheck}
          iconColor="text-[#006a4e]"
          value="100% Verified"
          subtitle="Physician + Pharmacist"
        />
        <SummaryCard
          title="Reconciliation Variance"
          icon={CheckCircle2}
          iconColor="text-[#006a4e]"
          value="0 Discrepancy"
          subtitle="Daily physical vault count"
        />
      </SummaryCardGrid>

      {/* Enterprise DataTable matching Doctor Portal */}
      <DataTable<NarcoticItem>
        title="DGDA Schedule Narcotics & High-Alert Controlled Register"
        subtitle="Perpetual double-sign audit log complying with DGDA Bangladesh Narcotics Control Act"
        data={narcotics}
        columns={columns}
        keyExtractor={(item) => item.id}
        searchPlaceholder="Search controlled drug or authorizing doctor..."
        searchFilter={(item, query) =>
          item.drugName.toLowerCase().includes(query.toLowerCase()) ||
          item.authorizedDoctor.toLowerCase().includes(query.toLowerCase()) ||
          item.vaultLocation.toLowerCase().includes(query.toLowerCase())
        }
        headerActions={
          <button
            type="button"
            className="px-2.5 py-1 rounded-[3px] bg-[#006a4e] hover:bg-[#00523c] text-white text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
          >
            <FileCheck className="w-3.5 h-3.5" />
            <span>Generate DGDA Audit Sheet</span>
          </button>
        }
        emptyTitle="No narcotics records found"
        showSerial={true}
      />
    </div>
  );
};
