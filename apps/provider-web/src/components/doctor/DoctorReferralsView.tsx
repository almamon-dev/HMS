import {
  ArrowDownLeft,
  ArrowUpRight,
  Eye,
  Plus,
  Share2,
  Users,
  X,
} from 'lucide-react';
import React, { useMemo, useState } from 'react';
import { DOCTOR_REFERRALS, DoctorReferral } from '../../data/doctorPortalData';
import { DataTable, DataTableColumn } from '../common/DataTable';
import { DropdownSelect } from '../common/DropdownSelect';
import { SummaryCard, SummaryCardGrid } from '../common/SummaryCard';

export const DoctorReferralsView: React.FC = () => {
  const [referrals, setReferrals] = useState<DoctorReferral[]>(DOCTOR_REFERRALS);
  const [typeFilter, setTypeFilter] = useState('All');
  const [showModal, setShowModal] = useState(false);
  const [selectedReferral, setSelectedReferral] = useState<DoctorReferral | null>(null);

  // New Referral Form
  const [patientName, setPatientName] = useState('');
  const [uhid, setUhid] = useState('');
  const [department, setDepartment] = useState('Cardiac Surgery & Cath Lab');
  const [targetDoctor, setTargetDoctor] = useState('Prof. Dr. M. A. Hasan');
  const [urgency, setUrgency] = useState<DoctorReferral['urgency']>('Urgent');
  const [reason, setReason] = useState('');

  // 4 Superadmin-Styled KPI Cards
  const stats = useMemo(() => {
    const total = referrals.length;
    const outbound = referrals.filter((r) => r.referralType === 'Outbound Referral').length;
    const inbound = referrals.filter((r) => r.referralType === 'Inbound Consult').length;
    const urgent = referrals.filter((r) => r.urgency === 'STAT Emergency' || r.urgency === 'Urgent').length;
    return { total, outbound, inbound, urgent };
  }, [referrals]);

  const filteredReferrals = useMemo(() => {
    return referrals.filter((r) => {
      const matchesType = typeFilter === 'All' || r.referralType === typeFilter;
      return matchesType;
    });
  }, [referrals, typeFilter]);

  const handleCreateReferral = (e: React.FormEvent) => {
    e.preventDefault();
    if (!patientName.trim()) return;

    const newRef: DoctorReferral = {
      id: `ref-${Date.now()}`,
      uhid: uhid || `UHID-2024-${Math.floor(1000 + Math.random() * 9000)}`,
      patientName: patientName.trim(),
      age: 50,
      referralType: 'Outbound Referral',
      department,
      targetDoctor,
      urgency,
      date: '20 Nov 2026',
      reason,
      status: 'Pending Review',
    };

    setReferrals([newRef, ...referrals]);
    setShowModal(false);
  };

  const columns: DataTableColumn<DoctorReferral>[] = [
    {
      key: 'date',
      header: 'Referral Date',
      sortable: true,
      sortValue: (r) => r.date,
      render: (r) => (
        <span className="text-slate-600 whitespace-nowrap">
          {r.date}
        </span>
      ),
    },
    {
      key: 'referralType',
      header: 'Direction',
      sortable: true,
      sortValue: (r) => r.referralType,
      render: (r) => (
        <span
          className={`inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full whitespace-nowrap ${r.referralType === 'Outbound Referral'
            ? 'bg-indigo-50 text-indigo-700'
            : 'bg-emerald-50 text-emerald-800'
            }`}
        >
          {r.referralType === 'Outbound Referral' ? (
            <ArrowUpRight className="w-3 h-3" />
          ) : (
            <ArrowDownLeft className="w-3 h-3" />
          )}
          {r.referralType}
        </span>
      ),
    },
    {
      key: 'patientName',
      header: 'Patient & UHID',
      sortable: true,
      sortValue: (r) => r.patientName,
      render: (r) => (
        <div>
          <div className="font-bold text-slate-900 leading-tight">{r.patientName}</div>
          <div className="text-[11px] text-slate-400">{r.uhid}</div>
        </div>
      ),
    },
    {
      key: 'department',
      header: 'Referred Department & Specialist',
      sortable: true,
      sortValue: (r) => r.department,
      render: (r) => (
        <div>
          <div className="font-bold text-slate-800 leading-tight">{r.department}</div>
          <div className="text-[11px] text-slate-500">{r.targetDoctor}</div>
        </div>
      ),
    },
    {
      key: 'reason',
      header: 'Clinical Reason / Finding',
      render: (r) => (
        <div className="text-slate-600 max-w-xs truncate" title={r.reason}>
          {r.reason}
        </div>
      ),
    },
    {
      key: 'urgency',
      header: 'Urgency',
      sortable: true,
      sortValue: (r) => r.urgency,
      render: (r) => (
        <span
          className={`px-2 py-0.5 rounded-full text-[10px] font-semibold whitespace-nowrap ${r.urgency === 'STAT Emergency'
            ? 'bg-rose-100 text-rose-800'
            : r.urgency === 'Urgent'
              ? 'bg-amber-100 text-amber-800'
              : 'bg-slate-100 text-slate-600'
            }`}
        >
          {r.urgency}
        </span>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      sortable: true,
      sortValue: (r) => r.status,
      render: (r) => (
        <span
          className={`px-2 py-0.5 rounded-full text-[10px] font-semibold whitespace-nowrap ${r.status === 'Completed'
            ? 'bg-emerald-100 text-emerald-800'
            : r.status === 'Accepted'
              ? 'bg-sky-100 text-sky-800'
              : 'bg-slate-100 text-slate-700'
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
      render: (r) => (
        <div className="flex items-center justify-end whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
          <button
            type="button"
            onClick={() => setSelectedReferral(r)}
            className="p-1 rounded text-slate-500 hover:text-slate-800 hover:bg-slate-100 cursor-pointer"
            title="View Details"
          >
            <Eye className="w-3.5 h-3.5" />
          </button>
        </div>
      ),
    },
  ];

  const toolbarFilters = (
    <DropdownSelect
      value={typeFilter}
      onChange={(val) => setTypeFilter(val)}
      width="w-44"
      options={[
        { label: 'All Referrals', value: 'All' },
        { label: 'Outbound Referral', value: 'Outbound Referral' },
        { label: 'Inbound Consult', value: 'Inbound Consult' },
      ]}
    />
  );

  const toolbarActions = (
    <button
      type="button"
      onClick={() => setShowModal(true)}
      className="h-8 px-3 rounded-[3px] bg-[#006a4e] hover:bg-[#00553e] text-white text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shrink-0 shadow-xs"
    >
      <Plus className="w-3.5 h-3.5" />
      <span>New Cross Referral</span>
    </button>
  );

  return (
    <div className="space-y-2">
      {/* 4 Summary Metric Cards matching Appointment format */}
      <SummaryCardGrid>
        <SummaryCard
          title="Total Referrals"
          icon={Share2}
          iconColor="text-[#006a4e]"
          value={`${stats.total} Patients`}
          subtitle="Cross-departmental consultations"
        />
        <SummaryCard
          title="Outbound Referrals"
          icon={ArrowUpRight}
          iconColor="text-indigo-600"
          value={`${stats.outbound} Sent Out`}
          valueColor="text-indigo-700"
          subtitle="Transferred to surgery & nephrology"
        />
        <SummaryCard
          title="Inbound Consults"
          icon={ArrowDownLeft}
          iconColor="text-emerald-600"
          value={`${stats.inbound} Incoming`}
          valueColor="text-emerald-700"
          subtitle="Cardiac evaluation requested"
        />
        <SummaryCard
          title="Urgent & Emergency"
          icon={Users}
          iconColor="text-rose-600"
          value={`${stats.urgent} Urgent Cases`}
          valueColor="text-rose-700"
          subtitle="Same-day surgical clearance"
        />
      </SummaryCardGrid>

      {/* Appointment-Styled Enterprise DataTable */}
      <DataTable<DoctorReferral>
        data={filteredReferrals}
        columns={columns}
        keyExtractor={(item) => item.id}
        searchPlaceholder="Search referrals by patient name, department, or clinical reason..."
        searchFilter={(item, query) =>
          item.patientName.toLowerCase().includes(query.toLowerCase()) ||
          item.uhid.toLowerCase().includes(query.toLowerCase()) ||
          item.department.toLowerCase().includes(query.toLowerCase()) ||
          item.reason.toLowerCase().includes(query.toLowerCase())
        }
        filters={toolbarFilters}
        actionButton={toolbarActions}
        emptyMessage="No clinical cross referrals found."
        onRowClick={(item) => setSelectedReferral(item)}
        showSerial={true}
      />

      {/* Referral Detail Modal */}
      {selectedReferral && (
        <div className="fixed inset-0 z-50 bg-slate-950/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl border border-slate-200 w-full max-w-lg overflow-hidden animate-in fade-in duration-150">
            <div className="px-5 py-3.5 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Share2 className="w-5 h-5 text-[#006a4e]" />
                <h3 className="text-sm font-bold text-slate-900">
                  Clinical Referral Note
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedReferral(null)}
                className="p-1 rounded-md text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3 pb-3 border-b border-slate-100">
                <div>
                  <span className="text-slate-400 block text-[10px]">Patient Name</span>
                  <span className="font-bold text-slate-900">{selectedReferral.patientName}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">UHID</span>
                  <span className="font-semibold text-slate-800">{selectedReferral.uhid}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Referred Department</span>
                  <span className="font-bold text-emerald-950">{selectedReferral.department}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Consultant Specialist</span>
                  <span className="font-semibold text-slate-800">{selectedReferral.targetDoctor}</span>
                </div>
              </div>

              <div>
                <span className="text-slate-400 block text-[10px] mb-1">
                  Clinical Referral Reason & Medical Findings
                </span>
                <p className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-slate-800 leading-relaxed font-medium">
                  {selectedReferral.reason}
                </p>
              </div>

              <div className="flex items-center justify-between text-xs pt-1">
                <span className="text-slate-500">
                  Urgency: <span className="font-bold text-rose-700">{selectedReferral.urgency}</span>
                </span>
                <span className="text-slate-500">
                  Current Status: <span className="font-bold text-emerald-800">{selectedReferral.status}</span>
                </span>
              </div>
            </div>

            <div className="px-5 py-3 bg-slate-50 border-t border-slate-200 flex items-center justify-end">
              <button
                type="button"
                onClick={() => setSelectedReferral(null)}
                className="px-3.5 py-1.5 rounded-md border border-slate-200 text-slate-700 hover:bg-slate-100 text-xs font-semibold cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* New Referral Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl border border-slate-200 w-full max-w-md overflow-hidden animate-in fade-in duration-150">
            <div className="px-5 py-3.5 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900">
                Create Clinical Cross Referral
              </h3>
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="p-1 rounded-md text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateReferral} className="p-5 space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  Patient Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={patientName}
                  onChange={(e) => setPatientName(e.target.value)}
                  placeholder="e.g. Shahina Akter"
                  className="w-full px-3 py-1.5 border border-slate-200 rounded-md text-xs focus:outline-none focus:border-[#006a4e]"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  Patient UHID
                </label>
                <input
                  type="text"
                  value={uhid}
                  onChange={(e) => setUhid(e.target.value)}
                  placeholder="UHID-2024-..."
                  className="w-full px-3 py-1.5 border border-slate-200 rounded-md text-xs focus:outline-none focus:border-[#006a4e]"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  Referral Department *
                </label>
                <select
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="w-full px-2.5 py-1.5 border border-slate-200 rounded-md text-xs bg-white focus:outline-none focus:border-[#006a4e]"
                >
                  <option value="Cardiac Surgery & Cath Lab">Cardiac Surgery & Cath Lab</option>
                  <option value="Nephrology & Renal Medicine">Nephrology & Renal Medicine</option>
                  <option value="Endocrinology & Diabetology">Endocrinology & Diabetology</option>
                  <option value="Neurology & Neuro-Surgery">Neurology & Neuro-Surgery</option>
                  <option value="Pulmonology & Chest Medicine">Pulmonology & Chest Medicine</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  Target Consultant Specialist
                </label>
                <input
                  type="text"
                  value={targetDoctor}
                  onChange={(e) => setTargetDoctor(e.target.value)}
                  placeholder="e.g. Prof. Dr. M. A. Hasan"
                  className="w-full px-3 py-1.5 border border-slate-200 rounded-md text-xs focus:outline-none focus:border-[#006a4e]"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  Clinical Urgency
                </label>
                <select
                  value={urgency}
                  onChange={(e) => setUrgency(e.target.value as any)}
                  className="w-full px-2.5 py-1.5 border border-slate-200 rounded-md text-xs bg-white focus:outline-none focus:border-[#006a4e]"
                >
                  <option value="Routine">Routine</option>
                  <option value="Urgent">Urgent</option>
                  <option value="STAT Emergency">STAT Emergency</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  Clinical Reason & Notes *
                </label>
                <textarea
                  required
                  rows={3}
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="State the clinical problem, findings, and why referral is requested..."
                  className="w-full px-3 py-1.5 border border-slate-200 rounded-md text-xs focus:outline-none focus:border-[#006a4e]"
                />
              </div>

              <div className="pt-2 border-t border-slate-200 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-3.5 py-1.5 rounded-md border border-slate-200 text-slate-700 hover:bg-slate-100 text-xs font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-md bg-[#006a4e] hover:bg-[#00553e] text-white text-xs font-bold cursor-pointer shadow-xs"
                >
                  Send Referral
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
