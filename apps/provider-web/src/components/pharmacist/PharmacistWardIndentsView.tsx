import React, { useMemo, useState } from 'react';
import {
  AlertTriangle,
  Bed,
  CheckCircle,
  Clock,
  PackageCheck,
  X,
} from 'lucide-react';
import { SummaryCard, SummaryCardGrid } from '../common/SummaryCard';
import { DataTable, DataTableColumn } from '../common/DataTable';
import { DropdownSelect } from '../common/DropdownSelect';
import { PageHeader } from '../common/PageHeader';

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
  const [wardFilter, setWardFilter] = useState('All');
  const [selectedIndent, setSelectedIndent] = useState<WardIndent | null>(null);

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
    {
      id: 'WI-04',
      indentNo: 'IND-2026-435',
      wardName: 'Neonatal ICU (NICU)',
      bedNo: 'NICU Incubator 03',
      patientName: 'Baby of Farzana',
      uhid: 'UHID-08340',
      nurseRequester: 'Sr. Ananya Paul (RN)',
      items: [
        { name: 'Inj. Amikacin 100mg/2ml', requestedQty: 1, approvedQty: 1, unit: 'Vials' },
        { name: 'Dextrose 10% Infusion 500ml', requestedQty: 2, approvedQty: 2, unit: 'Bags' },
      ],
      time: '3 hours ago',
      status: 'Dispensed',
    },
  ]);

  const handleApprove = (id: string) => {
    setIndents((prev) =>
      prev.map((i) => (i.id === id ? { ...i, status: 'Dispensed' } : i))
    );
    if (selectedIndent?.id === id) {
      setSelectedIndent((prev) => (prev ? { ...prev, status: 'Dispensed' } : null));
    }
  };

  const filteredIndents = useMemo(() => {
    return indents.filter((ind) => {
      if (wardFilter !== 'All' && !ind.wardName.includes(wardFilter)) return false;
      return true;
    });
  }, [indents, wardFilter]);

  const stats = useMemo(() => {
    const total = indents.length;
    const pending = indents.filter((i) => i.status === 'Pending').length;
    const icu = indents.filter((i) => i.wardName.includes('ICU') || i.wardName.includes('CCU')).length;
    const dispensed = indents.filter((i) => i.status === 'Dispensed').length;
    return { total, pending, icu, dispensed };
  }, [indents]);

  const columns: DataTableColumn<WardIndent>[] = [
    {
      key: 'indentNo',
      header: 'Indent Number',
      sortable: true,
      sortValue: (r) => r.indentNo,
      render: (r) => (
        <span className="font-mono font-bold text-[#006a4e] text-xs">
          {r.indentNo}
        </span>
      ),
    },
    {
      key: 'wardName',
      header: 'Ward & Bed Location',
      sortable: true,
      sortValue: (r) => r.wardName,
      render: (r) => (
        <div>
          <span className="font-semibold text-slate-800 text-xs block">
            {r.wardName}
          </span>
          <span className="text-[11px] text-slate-500 font-medium">
            {r.bedNo}
          </span>
        </div>
      ),
    },
    {
      key: 'patientName',
      header: 'Inpatient (UHID)',
      sortable: true,
      sortValue: (r) => r.patientName,
      render: (r) => (
        <div>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setSelectedIndent(r);
            }}
            className="text-slate-900 font-bold hover:text-[#0c2e4b] hover:underline text-left cursor-pointer whitespace-nowrap block text-xs"
          >
            {r.patientName}
          </button>
          <span className="text-[11px] text-slate-600 font-medium">
            {r.uhid}
          </span>
        </div>
      ),
    },
    {
      key: 'nurseRequester',
      header: 'Requesting Nurse',
      sortable: true,
      sortValue: (r) => r.nurseRequester,
      render: (r) => (
        <span className="text-xs text-slate-700 font-medium whitespace-nowrap">
          {r.nurseRequester}
        </span>
      ),
    },
    {
      key: 'items',
      header: 'Meds Requested',
      align: 'center',
      sortable: true,
      sortValue: (r) => r.items.length,
      render: (r) => (
        <span className="font-bold text-slate-800 text-xs">
          {r.items.length} Medications
        </span>
      ),
    },
    {
      key: 'time',
      header: 'Elapsed',
      align: 'center',
      render: (r) => (
        <span className="text-xs text-slate-500 whitespace-nowrap">
          {r.time}
        </span>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      align: 'center',
      sortable: true,
      sortValue: (r) => r.status,
      render: (r) => {
        let cls = 'bg-slate-100 text-slate-700 border-slate-200';
        if (r.status === 'Dispensed') cls = 'bg-emerald-50 text-emerald-800 border-emerald-300 font-bold';
        else if (r.status === 'Pending') cls = 'bg-amber-50 text-amber-800 border-amber-300 font-semibold';

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
          {r.status === 'Pending' ? (
            <button
              type="button"
              onClick={() => handleApprove(r.id)}
              className="px-2 py-1 rounded-[3px] bg-[#006a4e] hover:bg-[#00523c] text-white text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer shadow-xs"
            >
              <PackageCheck className="w-3 h-3" />
              <span>Issue to Ward</span>
            </button>
          ) : (
            <span className="px-2 py-1 rounded-[3px] bg-slate-100 text-slate-600 text-xs font-medium">
              Issued
            </span>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-2">
      <PageHeader
        title="Ward Indents"
        description="Central Medical Store · Inpatient ward requisitions & dispatch"
      />
      {/* 4 Summary Metric Cards matching Doctor Portal format */}
      <SummaryCardGrid>
        <SummaryCard
          title="Pending Ward Indents"
          icon={Clock}
          iconColor="text-amber-600"
          value={`${stats.pending} Requisitions`}
          valueColor="text-amber-700"
          subtitle="Awaiting pharmacist issue"
          badge={
            <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
              Active
            </span>
          }
        />
        <SummaryCard
          title="ICU & CCU Requisitions"
          icon={AlertTriangle}
          iconColor="text-rose-600"
          value={`${stats.icu} Emergency`}
          valueColor="text-rose-700"
          subtitle="Critical ward priority"
        />
        <SummaryCard
          title="Completed Indents"
          icon={CheckCircle}
          iconColor="text-[#006a4e]"
          value={`${stats.dispensed + 38} Indents`}
          subtitle="Delivered to IPD wards"
        />
        <SummaryCard
          title="Unit Dose Packaging"
          icon={Bed}
          iconColor="text-[#006a4e]"
          value="142 Doses"
          subtitle="Patient-specific blisters"
        />
      </SummaryCardGrid>

      {/* Selected Indent Quick Inspection Card */}
      {selectedIndent && (
        <div className="bg-white border border-[#006a4e]/25 rounded-md p-3.5 space-y-3 shadow-xs">
          <div className="flex flex-wrap items-start justify-between gap-3 border-b border-slate-100 pb-2.5">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold text-[#006a4e]">{selectedIndent.indentNo}</span>
                <span className="text-xs font-bold text-slate-900">{selectedIndent.wardName}</span>
                <span className="px-2 py-0.5 rounded-[3px] bg-slate-100 text-slate-700 text-[11px] font-semibold">
                  {selectedIndent.bedNo}
                </span>
                <span className="text-xs text-slate-500">
                  Patient: <strong className="text-slate-800">{selectedIndent.patientName}</strong> ({selectedIndent.uhid})
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Requested by: <span className="font-semibold text-slate-800">{selectedIndent.nurseRequester}</span> • {selectedIndent.time}
              </p>
            </div>

            <div className="flex items-center gap-2">
              {selectedIndent.status === 'Pending' ? (
                <button
                  type="button"
                  onClick={() => handleApprove(selectedIndent.id)}
                  className="px-3 py-1.5 rounded-[3px] bg-[#006a4e] hover:bg-[#00523c] text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <PackageCheck className="w-3.5 h-3.5" />
                  <span>Approve & Issue to Ward</span>
                </button>
              ) : (
                <span className="px-3 py-1.5 rounded-[3px] bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold">
                  Issued to Floor Stock
                </span>
              )}
              <button
                type="button"
                onClick={() => setSelectedIndent(null)}
                className="w-8 h-8 rounded-[3px] border border-slate-200 text-slate-500 hover:text-slate-800 hover:bg-slate-50 flex items-center justify-center cursor-pointer"
                title="Close inspection"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="border border-slate-200 rounded-[3px] overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#0c2e4b] text-white font-semibold">
                <tr>
                  <th className="py-2 px-3">Requested Medication</th>
                  <th className="py-2 px-3 text-center">Requested Qty</th>
                  <th className="py-2 px-3 text-center">Approved Qty</th>
                  <th className="py-2 px-3">Unit</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {selectedIndent.items.map((it, idx) => (
                  <tr key={idx}>
                    <td className="py-2 px-3 font-semibold text-slate-800">{it.name}</td>
                    <td className="py-2 px-3 text-center font-bold text-slate-700">{it.requestedQty}</td>
                    <td className="py-2 px-3 text-center font-bold text-[#006a4e]">{it.approvedQty}</td>
                    <td className="py-2 px-3 text-slate-500">{it.unit}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Enterprise DataTable matching Doctor Portal */}
      <DataTable<WardIndent>
        data={filteredIndents}
        columns={columns}
        keyExtractor={(item) => item.id}
        searchPlaceholder="Search indent #, ward name, patient, or nurse..."
        searchFilter={(item, query) =>
          item.indentNo.toLowerCase().includes(query.toLowerCase()) ||
          item.wardName.toLowerCase().includes(query.toLowerCase()) ||
          item.patientName.toLowerCase().includes(query.toLowerCase()) ||
          item.nurseRequester.toLowerCase().includes(query.toLowerCase())
        }
        toolbarFilters={
          <DropdownSelect
            value={wardFilter}
            onChange={(val) => setWardFilter(val)}
            options={['All', 'ICU', 'CCU', 'Surgery', 'NICU']}
            width="w-36"
          />
        }
        emptyTitle="No ward indents found"
        emptyDescription="No requisitions match the selected ward filter."
        onRowClick={(item) => setSelectedIndent(item)}
        showSerial={true}
      />
    </div>
  );
};
