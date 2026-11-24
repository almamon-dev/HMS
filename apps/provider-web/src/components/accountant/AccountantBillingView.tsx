import React, { useState } from 'react';
import {
  Banknote,
  CheckCircle2,
  Clock,
  DollarSign,
  FileCheck2,
  Printer,
  Receipt,
  RotateCcw,
  Wallet,
  X,
} from 'lucide-react';
import { SummaryCard, SummaryCardGrid } from '../common/SummaryCard';
import { DataTable, DataTableColumn } from '../common/DataTable';
import {
  IPD_DISCHARGE_QUEUE_DATA,
  DAILY_COUNTER_COLLECTIONS_DATA,
  IpdDischargeQueueItem,
  DailyCounterCollectionRecord,
} from '../../data/accountantPortalData';

export interface PatientDueRecord {
  id: string;
  patientId: string;
  patientName: string;
  phone: string;
  billingType: 'IPD Discharge' | 'Corporate Credit' | 'OPD Diagnostic';
  totalBill: number;
  paidAmount: number;
  dueAmount: number;
  agingDays: number;
  guarantor: string;
  lastFollowUp: string;
  status: 'Current (0-30d)' | 'Overdue (31-60d)' | 'Critical (>60d)';
}

export interface RefundClearanceRecord {
  id: string;
  refundNo: string;
  dateTime: string;
  patientId: string;
  patientName: string;
  department: string;
  originalBillNo: string;
  refundAmount: number;
  reason: string;
  approvedByDoctor: string;
  paymentMode: 'Cash' | 'bKash MFS' | 'Bank Transfer';
  clearanceStatus: 'Pending Approval' | 'Cleared & Paid' | 'Rejected';
}

export const PATIENT_DUE_DATA: PatientDueRecord[] = [
  {
    id: 'DUE-01',
    patientId: 'P-10821',
    patientName: 'Kazi Nurul Alam',
    phone: '01712-449102',
    billingType: 'IPD Discharge',
    totalBill: 145000,
    paidAmount: 110000,
    dueAmount: 35000,
    agingDays: 14,
    guarantor: 'Personal Guarantor (Son)',
    lastFollowUp: '2026-11-20',
    status: 'Current (0-30d)',
  },
  {
    id: 'DUE-02',
    patientId: 'P-10765',
    patientName: 'Begum Laila Arjumand',
    phone: '01819-338190',
    billingType: 'Corporate Credit',
    totalBill: 285000,
    paidAmount: 150000,
    dueAmount: 135000,
    agingDays: 42,
    guarantor: 'Biman Bangladesh Airlines Corp',
    lastFollowUp: '2026-11-18',
    status: 'Overdue (31-60d)',
  },
  {
    id: 'DUE-03',
    patientId: 'P-10901',
    patientName: 'Engr. Mahbubul Haque',
    phone: '01911-884102',
    billingType: 'IPD Discharge',
    totalBill: 92000,
    paidAmount: 60000,
    dueAmount: 32000,
    agingDays: 22,
    guarantor: 'Self Employed',
    lastFollowUp: '2026-11-21',
    status: 'Current (0-30d)',
  },
  {
    id: 'DUE-04',
    patientId: 'P-10452',
    patientName: 'Mustafizur Rahman',
    phone: '01552-991204',
    billingType: 'Corporate Credit',
    totalBill: 340000,
    paidAmount: 180000,
    dueAmount: 160000,
    agingDays: 68,
    guarantor: 'Grameenphone Corporate Health',
    lastFollowUp: '2026-11-15',
    status: 'Critical (>60d)',
  },
  {
    id: 'DUE-05',
    patientId: 'P-10940',
    patientName: 'Shamim Ara Begum',
    phone: '01614-228193',
    billingType: 'OPD Diagnostic',
    totalBill: 24500,
    paidAmount: 15000,
    dueAmount: 9500,
    agingDays: 12,
    guarantor: 'Direct Walk-in',
    lastFollowUp: '2026-11-22',
    status: 'Current (0-30d)',
  },
];

export const REFUND_CLEARANCE_DATA: RefundClearanceRecord[] = [
  {
    id: 'REF-01',
    refundNo: 'RF-2026-0891',
    dateTime: '2026-11-24 10:15',
    patientId: 'P-10892',
    patientName: 'Nazmul Hossain',
    department: 'Pharmacy POS Counter 2',
    originalBillNo: 'PH-INV-88210',
    refundAmount: 2450,
    reason: 'Returned unconsumed IV infusion vial (intact cold chain)',
    approvedByDoctor: 'Dr. Shahed Kamal (Pharmacy Mgr)',
    paymentMode: 'Cash',
    clearanceStatus: 'Pending Approval',
  },
  {
    id: 'REF-02',
    refundNo: 'RF-2026-0892',
    dateTime: '2026-11-24 09:40',
    patientId: 'P-10744',
    patientName: 'Fatema Khatun',
    department: 'Radiology & Imaging',
    originalBillNo: 'RAD-2026-4410',
    refundAmount: 6500,
    reason: 'Patient allergy contraindication for MRI Contrast',
    approvedByDoctor: 'Prof. Dr. Anwarul Karim',
    paymentMode: 'bKash MFS',
    clearanceStatus: 'Pending Approval',
  },
  {
    id: 'REF-03',
    refundNo: 'RF-2026-0888',
    dateTime: '2026-11-23 16:30',
    patientId: 'P-10651',
    patientName: 'Kamal Uddin Ahmed',
    department: 'Cardiology OPD Lab',
    originalBillNo: 'LAB-2026-9912',
    refundAmount: 3800,
    reason: 'Duplicate lab bill billing error on Echocardiogram',
    approvedByDoctor: 'Dr. Farhana Yasmin',
    paymentMode: 'Cash',
    clearanceStatus: 'Cleared & Paid',
  },
  {
    id: 'REF-04',
    refundNo: 'RF-2026-0885',
    dateTime: '2026-11-23 14:10',
    patientId: 'P-10520',
    patientName: 'Shahadat Hossain',
    department: 'Emergency Observation',
    originalBillNo: 'EMR-2026-1209',
    refundAmount: 1800,
    reason: 'Cancelled ECG investigation after rapid discharge',
    approvedByDoctor: 'Dr. Tariqul Islam (EMO)',
    paymentMode: 'Cash',
    clearanceStatus: 'Cleared & Paid',
  },
];

interface AccountantBillingViewProps {
  initialTab?: 'invoices' | 'collections' | 'due' | 'refunds';
}

export const AccountantBillingView: React.FC<AccountantBillingViewProps> = ({
  initialTab = 'invoices',
}) => {
  const [activeTab, setActiveTab] = useState<'invoices' | 'collections' | 'due' | 'refunds'>(initialTab);
  const [invoices] = useState<IpdDischargeQueueItem[]>(IPD_DISCHARGE_QUEUE_DATA);
  const [refunds, setRefunds] = useState<RefundClearanceRecord[]>(REFUND_CLEARANCE_DATA);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  React.useEffect(() => {
    if (initialTab) setActiveTab(initialTab);
  }, [initialTab]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4500);
  };

  const handleApproveRefund = (refundId: string) => {
    setRefunds((prev) =>
      prev.map((r) =>
        r.id === refundId ? { ...r, clearanceStatus: 'Cleared & Paid' } : r
      )
    );
    showToast('Refund payment approved and cleared from Petty Cash Vault.');
  };

  // Due Table Columns
  const dueColumns: DataTableColumn<PatientDueRecord>[] = [
    {
      key: 'patientName',
      header: 'Patient & Guarantor',
      sortable: true,
      sortValue: (r) => r.patientName,
      render: (r) => (
        <div>
          <div className="flex items-center gap-1.5">
            <span className="font-bold text-slate-900 text-xs">{r.patientName}</span>
            <span className="px-1.5 py-0.2 rounded font-mono text-[10px] font-semibold bg-slate-100 text-slate-700">
              {r.patientId}
            </span>
          </div>
          <div className="text-[11px] text-slate-500 font-medium mt-0.5">
            <span>{r.phone}</span> · <span className="text-[#006a4e]">{r.guarantor}</span>
          </div>
        </div>
      ),
    },
    {
      key: 'billingType',
      header: 'Billing Type',
      sortable: true,
      sortValue: (r) => r.billingType,
      render: (r) => (
        <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-slate-100 text-slate-700">
          {r.billingType}
        </span>
      ),
    },
    {
      key: 'totalBill',
      header: 'Total Bill',
      align: 'right',
      sortable: true,
      sortValue: (r) => r.totalBill,
      render: (r) => (
        <span className="font-mono text-slate-800 text-xs font-semibold">
          ৳ {r.totalBill.toLocaleString()}
        </span>
      ),
    },
    {
      key: 'paidAmount',
      header: 'Paid Amount',
      align: 'right',
      sortable: true,
      sortValue: (r) => r.paidAmount,
      render: (r) => (
        <span className="font-mono text-emerald-700 text-xs font-semibold">
          ৳ {r.paidAmount.toLocaleString()}
        </span>
      ),
    },
    {
      key: 'dueAmount',
      header: 'Outstanding Due',
      align: 'right',
      sortable: true,
      sortValue: (r) => r.dueAmount,
      render: (r) => (
        <span className="font-mono font-extrabold text-rose-600 text-xs block">
          ৳ {r.dueAmount.toLocaleString()}
        </span>
      ),
    },
    {
      key: 'agingDays',
      header: 'Aging & Term',
      align: 'center',
      sortable: true,
      sortValue: (r) => r.agingDays,
      render: (r) => (
        <div>
          <span className="font-mono font-bold text-slate-900 text-xs">{r.agingDays} Days</span>
          <div className="text-[10px] text-slate-400">Follow-up: {r.lastFollowUp}</div>
        </div>
      ),
    },
    {
      key: 'status',
      header: 'Recovery Risk',
      align: 'center',
      render: (r) => (
        <span
          className={`px-2 py-0.5 rounded-[3px] text-[10.5px] font-bold border ${
            r.status === 'Current (0-30d)'
              ? 'bg-blue-50 text-blue-700 border-blue-200'
              : r.status === 'Overdue (31-60d)'
              ? 'bg-amber-50 text-amber-700 border-amber-200'
              : 'bg-rose-50 text-rose-700 border-rose-200'
          }`}
        >
          {r.status}
        </span>
      ),
    },
    {
      key: 'id',
      header: 'Action',
      align: 'center',
      render: (r) => (
        <button
          type="button"
          onClick={() => showToast(`Sent SMS Payment Reminder to ${r.patientName} (${r.phone})`)}
          className="h-7 px-2.5 rounded-[3px] bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 text-[11px] font-semibold cursor-pointer shadow-2xs"
        >
          Send Notice
        </button>
      ),
    },
  ];

  // Refund Columns
  const refundColumns: DataTableColumn<RefundClearanceRecord>[] = [
    {
      key: 'refundNo',
      header: 'Refund Voucher & Date',
      sortable: true,
      sortValue: (r) => r.refundNo,
      render: (r) => (
        <div>
          <span className="font-mono font-bold text-slate-900 text-xs block">{r.refundNo}</span>
          <span className="text-[10.5px] text-slate-400 font-mono">{r.dateTime}</span>
        </div>
      ),
    },
    {
      key: 'patientName',
      header: 'Patient & Department',
      sortable: true,
      sortValue: (r) => r.patientName,
      render: (r) => (
        <div>
          <span className="font-bold text-slate-900 text-xs block">{r.patientName} ({r.patientId})</span>
          <span className="text-[11px] text-slate-500">{r.department}</span>
        </div>
      ),
    },
    {
      key: 'reason',
      header: 'Clinical Reason / Justification',
      render: (r) => (
        <div className="max-w-xs">
          <span className="text-xs text-slate-800 line-clamp-1 block">{r.reason}</span>
          <span className="text-[10px] text-slate-500 font-medium">Auth: {r.approvedByDoctor}</span>
        </div>
      ),
    },
    {
      key: 'refundAmount',
      header: 'Refund Amount',
      align: 'right',
      sortable: true,
      sortValue: (r) => r.refundAmount,
      render: (r) => (
        <div>
          <span className="font-mono font-extrabold text-rose-600 text-xs block">
            ৳ {r.refundAmount.toLocaleString()}
          </span>
          <span className="text-[10px] text-slate-400 font-mono">{r.paymentMode}</span>
        </div>
      ),
    },
    {
      key: 'clearanceStatus',
      header: 'Accounts Status',
      align: 'center',
      render: (r) => (
        <span
          className={`px-2 py-0.5 rounded-[3px] text-[10.5px] font-bold border ${
            r.clearanceStatus === 'Cleared & Paid'
              ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
              : 'bg-amber-50 text-amber-700 border-amber-200'
          }`}
        >
          {r.clearanceStatus}
        </span>
      ),
    },
    {
      key: 'id',
      header: 'Action',
      align: 'center',
      render: (r) => (
        <div className="flex items-center justify-center gap-1.5">
          {r.clearanceStatus !== 'Cleared & Paid' ? (
            <button
              type="button"
              onClick={() => handleApproveRefund(r.id)}
              className="h-7 px-2.5 rounded-[3px] bg-[#006a4e] hover:bg-[#00553e] text-white text-[11px] font-semibold inline-flex items-center gap-1 cursor-pointer shadow-2xs"
            >
              <CheckCircle2 className="w-3 h-3" />
              <span>Approve &amp; Pay</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={() => showToast(`Reprinted Refund Voucher #${r.refundNo}`)}
              className="h-7 px-2 rounded-[3px] border border-slate-300 hover:bg-slate-50 text-slate-600 text-[11px] font-medium inline-flex items-center gap-1 cursor-pointer"
            >
              <Printer className="w-3 h-3 text-slate-400" />
              <span>Voucher</span>
            </button>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-3 font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-4 right-4 z-50 bg-slate-900 text-white px-4 py-2.5 rounded-[4px] shadow-lg text-xs font-medium flex items-center gap-2 border border-slate-700 animate-in fade-in slide-in-from-top-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
          <button
            type="button"
            onClick={() => setToastMessage(null)}
            className="text-slate-400 hover:text-white ml-2 cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* ========================================================================= */}
      {/* HORIZONTAL TABS BAR (Image 1 Reference)                                   */}
      {/* ========================================================================= */}
      <div className="flex items-center gap-1 border-b border-slate-200 bg-white px-3 pt-1.5 rounded-[4px] shadow-2xs overflow-x-auto scrollbar-none">
        <button
          type="button"
          onClick={() => setActiveTab('invoices')}
          className={`px-3.5 py-2 text-xs font-semibold cursor-pointer border-b-2 transition-colors flex items-center gap-1.5 -mb-[1px] ${
            activeTab === 'invoices'
              ? 'border-[#006a4e] text-[#006a4e]'
              : 'border-transparent text-slate-600 hover:text-slate-900'
          }`}
        >
          <Receipt className="w-3.5 h-3.5" />
          <span>Patient Billing &amp; Invoices ({invoices.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('collections')}
          className={`px-3.5 py-2 text-xs font-semibold cursor-pointer border-b-2 transition-colors flex items-center gap-1.5 -mb-[1px] ${
            activeTab === 'collections'
              ? 'border-[#006a4e] text-[#006a4e]'
              : 'border-transparent text-slate-600 hover:text-slate-900'
          }`}
        >
          <Banknote className="w-3.5 h-3.5" />
          <span>Daily Counter Collections (6)</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('due')}
          className={`px-3.5 py-2 text-xs font-semibold cursor-pointer border-b-2 transition-colors flex items-center gap-1.5 -mb-[1px] ${
            activeTab === 'due'
              ? 'border-[#006a4e] text-[#006a4e]'
              : 'border-transparent text-slate-600 hover:text-slate-900'
          }`}
        >
          <Clock className="w-3.5 h-3.5" />
          <span>Due &amp; Outstanding Ledger ({PATIENT_DUE_DATA.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('refunds')}
          className={`px-3.5 py-2 text-xs font-semibold cursor-pointer border-b-2 transition-colors flex items-center gap-1.5 -mb-[1px] ${
            activeTab === 'refunds'
              ? 'border-[#006a4e] text-[#006a4e]'
              : 'border-transparent text-slate-600 hover:text-slate-900'
          }`}
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Refund Clearance &amp; Approvals ({refunds.length})</span>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: PATIENT BILLING & INVOICES                                         */}
      {/* ========================================================================= */}
      {activeTab === 'invoices' && (
        <div className="space-y-3">
          <SummaryCardGrid>
            <SummaryCard
              title="Total Billed (This Month)"
              icon={Receipt}
              iconColor="text-[#006a4e]"
              value="৳ 1.34 Cr"
              subtitle="IPD Admissions + OPD Diagnostics"
            />
            <SummaryCard
              title="Discharge Clearances"
              icon={FileCheck2}
              iconColor="text-[#006a4e]"
              value="5 Active"
              subtitle="2 Cleared · 3 Awaiting Sign-off"
            />
            <SummaryCard
              title="Advance Deposits in Hand"
              icon={Wallet}
              iconColor="text-[#006a4e]"
              value="৳ 22,40,000"
              subtitle="Security deposits on admitted beds"
            />
          </SummaryCardGrid>

          <div className="bg-white rounded-[4px] border border-slate-200/90 p-3 shadow-xs">
            <h3 className="text-xs font-bold text-slate-900 mb-2">
              Patient Inpatient &amp; Outpatient Master Invoice Records
            </h3>
            <DataTable<IpdDischargeQueueItem>
              data={invoices}
              columns={[
                {
                  key: 'invoiceNo',
                  header: 'Invoice # / Admission',
                  sortable: true,
                  sortValue: (r) => r.invoiceNo,
                  render: (r) => (
                    <div>
                      <span className="font-mono font-bold text-slate-900 text-xs block">{r.invoiceNo}</span>
                      <span className="text-[10.5px] text-slate-400 font-mono">{r.dischargeDate}</span>
                    </div>
                  ),
                },
                {
                  key: 'patientName',
                  header: 'Patient Name & Bed',
                  sortable: true,
                  sortValue: (r) => r.patientName,
                  render: (r) => (
                    <div>
                      <span className="font-bold text-slate-900 text-xs block">{r.patientName}</span>
                      <span className="text-[11px] text-slate-500">{r.bedNumber} · {r.department}</span>
                    </div>
                  ),
                },
                {
                  key: 'grossAmount',
                  header: 'Gross Bill',
                  align: 'right',
                  sortable: true,
                  sortValue: (r) => r.grossAmount,
                  render: (r) => <span className="font-mono font-bold text-slate-800 text-xs">৳ {r.grossAmount.toLocaleString()}</span>,
                },
                {
                  key: 'advancePaid',
                  header: 'Advance Paid',
                  align: 'right',
                  sortable: true,
                  sortValue: (r) => r.advancePaid,
                  render: (r) => <span className="font-mono text-emerald-700 text-xs">৳ {r.advancePaid.toLocaleString()}</span>,
                },
                {
                  key: 'netPayable',
                  header: 'Net Settled',
                  align: 'right',
                  sortable: true,
                  sortValue: (r) => r.netPayable,
                  render: (r) => <span className="font-mono font-extrabold text-[#006a4e] text-xs">৳ {r.netPayable.toLocaleString()}</span>,
                },
                {
                  key: 'status',
                  header: 'Status',
                  align: 'center',
                  render: (r) => (
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      {r.status}
                    </span>
                  ),
                },
              ]}
              keyExtractor={(item) => item.id}
              searchPlaceholder="Search invoices by patient or invoice #..."
              searchFilter={(item, query) =>
                item.patientName.toLowerCase().includes(query.toLowerCase()) ||
                item.invoiceNo.toLowerCase().includes(query.toLowerCase())
              }
              showSerial={true}
            />
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: DAILY COUNTER COLLECTIONS                                          */}
      {/* ========================================================================= */}
      {activeTab === 'collections' && (
        <div className="space-y-3">
          <SummaryCardGrid>
            <SummaryCard
              title="Today's Shift Cash Total"
              icon={Banknote}
              iconColor="text-[#006a4e]"
              value="৳ 6,20,000"
              subtitle="6 Hospital Counters Combined"
            />
            <SummaryCard
              title="Card Terminal Collections"
              icon={DollarSign}
              iconColor="text-[#006a4e]"
              value="৳ 5,10,000"
              subtitle="POS Merchant Settlement"
            />
            <SummaryCard
              title="Mobile Financial Services (MFS)"
              icon={Wallet}
              iconColor="text-[#006a4e]"
              value="৳ 3,55,420"
              subtitle="bKash & Nagad QR Scans"
            />
          </SummaryCardGrid>

          <div className="bg-white rounded-[4px] border border-slate-200/90 p-3 shadow-xs">
            <h3 className="text-xs font-bold text-slate-900 mb-2">
              All Hospital Collection Booths &amp; Real-Time Cashier Registers
            </h3>
            <DataTable<DailyCounterCollectionRecord>
              data={DAILY_COUNTER_COLLECTIONS_DATA}
              columns={[
                {
                  key: 'counterName',
                  header: 'Booth & Cashier',
                  sortable: true,
                  sortValue: (r) => r.counterName,
                  render: (r) => (
                    <div>
                      <span className="font-bold text-slate-900 text-xs block">{r.counterName} ({r.counterCode})</span>
                      <span className="text-[11px] text-slate-500">Cashier: {r.cashierName} · {r.shift}</span>
                    </div>
                  ),
                },
                {
                  key: 'cashCollected',
                  header: 'Cash in Hand',
                  align: 'right',
                  sortable: true,
                  sortValue: (r) => r.cashCollected,
                  render: (r) => <span className="font-mono font-bold text-slate-800 text-xs">৳ {r.cashCollected.toLocaleString()}</span>,
                },
                {
                  key: 'cardCollected',
                  header: 'Card POS',
                  align: 'right',
                  sortable: true,
                  sortValue: (r) => r.cardCollected,
                  render: (r) => <span className="font-mono text-slate-700 text-xs">৳ {r.cardCollected.toLocaleString()}</span>,
                },
                {
                  key: 'mfsCollected',
                  header: 'bKash / Nagad',
                  align: 'right',
                  sortable: true,
                  sortValue: (r) => r.mfsCollected,
                  render: (r) => <span className="font-mono text-slate-700 text-xs">৳ {r.mfsCollected.toLocaleString()}</span>,
                },
                {
                  key: 'totalCollection',
                  header: 'Gross Total',
                  align: 'right',
                  sortable: true,
                  sortValue: (r) => r.totalCollection,
                  render: (r) => <span className="font-mono font-extrabold text-[#006a4e] text-xs">৳ {r.totalCollection.toLocaleString()}</span>,
                },
                {
                  key: 'status',
                  header: 'Vault Status',
                  align: 'center',
                  render: (r) => (
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      {r.status}
                    </span>
                  ),
                },
              ]}
              keyExtractor={(item) => item.id}
              searchPlaceholder="Search counter registers..."
              searchFilter={(item, query) => item.counterName.toLowerCase().includes(query.toLowerCase())}
              showSerial={true}
            />
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: DUE & OUTSTANDING RECEIVABLES LEDGER                                */}
      {/* ========================================================================= */}
      {activeTab === 'due' && (
        <div className="space-y-3">
          <SummaryCardGrid>
            <SummaryCard
              title="Total Accounts Receivable"
              icon={Clock}
              iconColor="text-rose-600"
              value="৳ 3,71,500"
              subtitle="Patient & Corporate Outstanding"
            />
            <SummaryCard
              title="Current Receivables (0-30d)"
              icon={CheckCircle2}
              iconColor="text-blue-600"
              value="৳ 76,500"
              subtitle="Healthy credit cycle"
            />
            <SummaryCard
              title="Overdue Receivables (>30d)"
              icon={Wallet}
              iconColor="text-rose-600"
              value="৳ 2,95,000"
              subtitle="Recovery actions initiated"
            />
          </SummaryCardGrid>

          <div className="bg-white rounded-[4px] border border-slate-200/90 p-3 shadow-xs">
            <h3 className="text-xs font-bold text-slate-900 mb-2">
              Patient Due &amp; Corporate Credit Recovery Roster
            </h3>
            <DataTable<PatientDueRecord>
              data={PATIENT_DUE_DATA}
              columns={dueColumns}
              keyExtractor={(item) => item.id}
              searchPlaceholder="Search due records by patient name or phone..."
              searchFilter={(item, query) =>
                item.patientName.toLowerCase().includes(query.toLowerCase()) ||
                item.phone.includes(query) ||
                item.guarantor.toLowerCase().includes(query.toLowerCase())
              }
              showSerial={true}
            />
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 4: REFUND CLEARANCE & APPROVALS                                       */}
      {/* ========================================================================= */}
      {activeTab === 'refunds' && (
        <div className="space-y-3">
          <SummaryCardGrid>
            <SummaryCard
              title="Today's Refund Applications"
              icon={RotateCcw}
              iconColor="text-amber-600"
              value="৳ 14,550"
              subtitle="4 Vouchers submitted"
            />
            <SummaryCard
              title="Pending Doctor Verification"
              icon={Clock}
              iconColor="text-blue-600"
              value="2 Vouchers"
              subtitle="Awaiting final accounts payout"
            />
            <SummaryCard
              title="Settled Refunds"
              icon={CheckCircle2}
              iconColor="text-[#006a4e]"
              value="৳ 5,600"
              subtitle="Disbursed via Cash/MFS"
            />
          </SummaryCardGrid>

          <div className="bg-white rounded-[4px] border border-slate-200/90 p-3 shadow-xs">
            <h3 className="text-xs font-bold text-slate-900 mb-2">
              Clinical Refund Authorizations &amp; Accounts Payout Log
            </h3>
            <DataTable<RefundClearanceRecord>
              data={refunds}
              columns={refundColumns}
              keyExtractor={(item) => item.id}
              searchPlaceholder="Search refund vouchers, patients, or departments..."
              searchFilter={(item, query) =>
                item.refundNo.toLowerCase().includes(query.toLowerCase()) ||
                item.patientName.toLowerCase().includes(query.toLowerCase()) ||
                item.department.toLowerCase().includes(query.toLowerCase())
              }
              showSerial={true}
            />
          </div>
        </div>
      )}
    </div>
  );
};
