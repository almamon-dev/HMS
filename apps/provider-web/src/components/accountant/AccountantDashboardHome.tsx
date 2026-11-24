import React, { useState } from 'react';
import {
  CheckCircle2,
  DollarSign,
  FileCheck2,
  Landmark,
  Printer,
  Receipt,
  RefreshCw,
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

interface AccountantDashboardHomeProps {
  onSelectModule: (moduleId: string) => void;
}

export const AccountantDashboardHome: React.FC<AccountantDashboardHomeProps> = ({
  onSelectModule,
}) => {
  const [ipdQueue, setIpdQueue] = useState<IpdDischargeQueueItem[]>(IPD_DISCHARGE_QUEUE_DATA);
  const [selectedDischargeItem, setSelectedDischargeItem] = useState<IpdDischargeQueueItem | null>(null);
  const [isClearanceModalOpen, setIsClearanceModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4500);
  };

  const handleOpenClearance = (item: IpdDischargeQueueItem) => {
    setSelectedDischargeItem(item);
    setIsClearanceModalOpen(true);
  };

  const handleConfirmClearance = () => {
    if (!selectedDischargeItem) return;
    setIpdQueue((prev) =>
      prev.map((item) =>
        item.id === selectedDischargeItem.id
          ? { ...item, status: 'Cleared' }
          : item
      )
    );
    setIsClearanceModalOpen(false);
    showToast(`Discharge Clearance Approved for ${selectedDischargeItem.patientName} (${selectedDischargeItem.invoiceNo})`);
  };

  // Table 1: IPD Discharge Billing Queue Columns
  const ipdColumns: DataTableColumn<IpdDischargeQueueItem>[] = [
    {
      key: 'patientName',
      header: 'Patient MRN & Information',
      sortable: true,
      sortValue: (r) => r.patientName,
      render: (r) => (
        <div>
          <div className="flex items-center gap-1.5">
            <span className="font-bold text-slate-900 text-xs">{r.patientName}</span>
            <span className="px-1.5 py-0.2 rounded font-mono text-[10px] font-semibold bg-slate-100 text-slate-700">
              {r.uhid}
            </span>
          </div>
          <div className="text-[11px] text-slate-500 font-medium flex items-center gap-1 mt-0.5">
            <span className="font-mono text-emerald-700">{r.invoiceNo}</span>
            <span>·</span>
            <span>{r.bedNumber} ({r.department})</span>
          </div>
        </div>
      ),
    },
    {
      key: 'consultantName',
      header: 'Consultant & Admitted',
      render: (r) => (
        <div>
          <span className="text-xs font-semibold text-slate-800 block">{r.consultantName}</span>
          <span className="text-[10px] text-slate-400 font-mono">
            {r.admissionDate} to {r.dischargeDate}
          </span>
        </div>
      ),
    },
    {
      key: 'grossAmount',
      header: 'Gross Bill & Charges',
      align: 'right',
      sortable: true,
      sortValue: (r) => r.grossAmount,
      render: (r) => (
        <div className="text-right">
          <span className="font-bold text-slate-900 text-xs font-mono">
            ৳ {r.grossAmount.toLocaleString()}
          </span>
          <div className="text-[10px] text-slate-400">
            Bed ৳{r.bedCharges.toLocaleString()} · OT ৳{r.otCharges.toLocaleString()}
          </div>
        </div>
      ),
    },
    {
      key: 'advancePaid',
      header: 'Advance Adjusted',
      align: 'right',
      sortable: true,
      sortValue: (r) => r.advancePaid,
      render: (r) => (
        <div className="text-right">
          <span className="font-semibold text-slate-700 text-xs font-mono">
            ৳ {r.advancePaid.toLocaleString()}
          </span>
          {r.discountApproved > 0 && (
            <div className="text-[10px] text-rose-500">
              Disc: ৳{r.discountApproved.toLocaleString()}
            </div>
          )}
        </div>
      ),
    },
    {
      key: 'netPayable',
      header: 'Net Due / Payable',
      align: 'right',
      sortable: true,
      sortValue: (r) => r.netPayable,
      render: (r) => (
        <div className="text-right">
          <span className="font-mono font-extrabold text-[#006a4e] text-xs block">
            ৳ {r.netPayable.toLocaleString()}
          </span>
          <span className="text-[10px] text-slate-400">Final Settlement</span>
        </div>
      ),
    },
    {
      key: 'status',
      header: 'Clearance Status',
      align: 'center',
      render: (r) => (
        <span
          className={`px-2 py-0.5 rounded-[3px] text-[10.5px] font-bold border ${
            r.status === 'Cleared'
              ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
              : 'bg-amber-50 text-amber-700 border-amber-200'
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
        <div className="flex items-center justify-center gap-1.5">
          {r.status !== 'Cleared' ? (
            <button
              type="button"
              onClick={() => handleOpenClearance(r)}
              className="h-7 px-2.5 rounded-[3px] bg-[#006a4e] hover:bg-[#00553e] text-white text-[11px] font-semibold inline-flex items-center gap-1 cursor-pointer shadow-2xs transition-colors"
            >
              <FileCheck2 className="w-3 h-3" />
              <span>Clear Bill</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={() => showToast(`Reprinted Discharge Slip for ${r.patientName}`)}
              className="h-7 px-2 rounded-[3px] border border-slate-300 hover:bg-slate-50 text-slate-600 text-[11px] font-medium inline-flex items-center gap-1 cursor-pointer"
            >
              <Printer className="w-3 h-3 text-slate-400" />
              <span>Slip</span>
            </button>
          )}
        </div>
      ),
    },
  ];

  // Table 2: Daily Counter Cash Collections Columns
  const counterColumns: DataTableColumn<DailyCounterCollectionRecord>[] = [
    {
      key: 'counterName',
      header: 'Cash Collection Counter',
      sortable: true,
      sortValue: (r) => r.counterName,
      render: (r) => (
        <div>
          <div className="flex items-center gap-1.5">
            <span className="font-bold text-slate-900 text-xs">{r.counterName}</span>
            <span className="px-1.5 py-0.2 rounded font-mono text-[10px] font-semibold bg-slate-100 text-slate-700">
              {r.counterCode}
            </span>
          </div>
          <div className="text-[11px] text-slate-500 font-medium">
            Cashier: <strong className="text-slate-800">{r.cashierName}</strong> · Shift: {r.shift}
          </div>
        </div>
      ),
    },
    {
      key: 'billsCount',
      header: 'Transactions',
      align: 'center',
      sortable: true,
      sortValue: (r) => r.billsCount,
      render: (r) => (
        <span className="font-mono font-semibold text-slate-800 text-xs">
          {r.billsCount.toLocaleString()} Invoices
        </span>
      ),
    },
    {
      key: 'cashCollected',
      header: 'Cash in Hand',
      align: 'right',
      sortable: true,
      sortValue: (r) => r.cashCollected,
      render: (r) => (
        <span className="font-mono font-bold text-slate-800 text-xs">
          ৳ {r.cashCollected.toLocaleString()}
        </span>
      ),
    },
    {
      key: 'cardCollected',
      header: 'Card (POS)',
      align: 'right',
      sortable: true,
      sortValue: (r) => r.cardCollected,
      render: (r) => (
        <span className="font-mono text-slate-700 text-xs">
          ৳ {r.cardCollected.toLocaleString()}
        </span>
      ),
    },
    {
      key: 'mfsCollected',
      header: 'MFS (bKash/Nagad)',
      align: 'right',
      sortable: true,
      sortValue: (r) => r.mfsCollected,
      render: (r) => (
        <span className="font-mono text-slate-700 text-xs">
          ৳ {r.mfsCollected.toLocaleString()}
        </span>
      ),
    },
    {
      key: 'totalCollection',
      header: 'Total Collection',
      align: 'right',
      sortable: true,
      sortValue: (r) => r.totalCollection,
      render: (r) => (
        <span className="font-mono font-extrabold text-[#006a4e] text-xs block">
          ৳ {r.totalCollection.toLocaleString()}
        </span>
      ),
    },
    {
      key: 'status',
      header: 'Closing Status',
      align: 'center',
      render: (r) => (
        <span
          className={`px-2 py-0.5 rounded-[3px] text-[10.5px] font-bold border ${
            r.status === 'Deposited to Vault'
              ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
              : r.status === 'Open / Collecting'
              ? 'bg-blue-50 text-blue-700 border-blue-200'
              : 'bg-amber-50 text-amber-700 border-amber-200'
          }`}
        >
          {r.status}
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-4 font-['Plus_Jakarta_Sans',sans-serif]">
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

      {/* Top Banner / Executive Financial Summary Header */}
      <div className="bg-white rounded-[4px] border border-slate-200/90 p-4 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-extrabold text-slate-900 tracking-tight">
              Hospital Financial Command Center
            </h2>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-[#006a4e] border border-emerald-200">
              FY 2026-2027 Active
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Central Medical Center · Real-time patient billing, shift cash collections, vendor payables &amp; treasury
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500 hidden sm:inline font-mono">
            Audit Date: <strong>Nov 24, 2026</strong>
          </span>
          <button
            type="button"
            onClick={() => showToast('Financial ledgers synchronized with Core Banking & Vault Cash')}
            className="h-8 px-3 rounded-[3px] bg-slate-50 border border-slate-300 hover:bg-slate-100 text-slate-700 text-xs font-semibold inline-flex items-center gap-1.5 cursor-pointer shadow-2xs transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5 text-slate-500" />
            <span>Sync Accounts</span>
          </button>
        </div>
      </div>

      {/* 4 Executive Financial KPI Cards */}
      <SummaryCardGrid>
        <SummaryCard
          title="Today's Gross Collection"
          icon={DollarSign}
          iconColor="text-[#006a4e]"
          value="৳ 14,85,420"
          subtitle="Cash ৳ 6.20L · Card ৳ 5.10L · MFS ৳ 3.55L"
          badge={
            <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
              +12.4% vs Avg
            </span>
          }
        />
        <SummaryCard
          title="Liquid Vault & Bank Treasury"
          icon={Landmark}
          iconColor="text-[#006a4e]"
          value="৳ 8.46 Cr"
          subtitle="Vault: ৳ 4.85L · City/DBBL/BRAC Banks"
          badge={
            <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
              Reconciled
            </span>
          }
        />
        <SummaryCard
          title="Pending IPD Clearances"
          icon={Receipt}
          iconColor="text-[#006a4e]"
          value="3 Patients"
          subtitle="Discharge bill approval pending (৳ 2.01L)"
          badge={
            <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
              Action Req.
            </span>
          }
        />
        <SummaryCard
          title="Due Vendor Payables (AP)"
          icon={Wallet}
          iconColor="text-[#006a4e]"
          value="৳ 32,45,000"
          subtitle="Next due: Tomorrow (Linde Oxygen ৳ 4.85L)"
          badge={
            <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-purple-50 text-purple-700 border border-purple-200">
              3-Way Match OK
            </span>
          }
        />
      </SummaryCardGrid>

      {/* ========================================================================= */}
      {/* 3-CARD WORKING CAPITAL & REVENUE CLASSIFICATION MATRIX (Image 2 Reference)  */}
      {/* ========================================================================= */}
      <div className="bg-white rounded-[4px] border border-slate-200/90 shadow-xs p-3.5 space-y-2.5">
        <div className="flex items-center justify-between border-b border-slate-100 pb-2">
          <div>
            <h3 className="text-xs font-bold text-slate-900 tracking-wide">
              Hospital Operating Revenue &amp; Working Capital Classification
            </h3>
            <p className="text-[11px] text-slate-500">
              Segmented by billing stream to safeguard liquidity, optimize collections, and guarantee zero discharge revenue leakage.
            </p>
          </div>
          <span className="text-[11px] font-bold text-[#006a4e] hidden sm:inline">
            Standard Hospital Accounting Practice
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {/* Category A Card */}
          <div className="p-3.5 rounded-[4px] border border-rose-200 bg-rose-50/40 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-rose-900">
                Category A (Inpatient IPD Admissions &amp; OT)
              </span>
              <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-white text-rose-700 border border-rose-200 shadow-2xs">
                Class A
              </span>
            </div>
            <div className="text-base font-extrabold text-slate-900 font-mono">
              65% Revenue (৳ 96.5 Lakh/mo)
            </div>
            <div className="text-xs font-medium text-slate-700">
              Cabin &amp; Bed Charges, OT Surgeries, ICU Critical Care &amp; Implants
            </div>
            <div className="pt-2 border-t border-rose-200/60 text-[10.5px] font-semibold text-emerald-800 flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span>Audit Rule: Mandatory discharge bill clearance &amp; deposit adjustment</span>
            </div>
          </div>

          {/* Category B Card */}
          <div className="p-3.5 rounded-[4px] border border-amber-200 bg-amber-50/40 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-amber-900">
                Category B (Outpatient Diagnostics &amp; Lab OPD)
              </span>
              <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-white text-amber-700 border border-amber-200 shadow-2xs">
                Class B
              </span>
            </div>
            <div className="text-base font-extrabold text-slate-900 font-mono">
              25% Revenue (৳ 37.1 Lakh/mo)
            </div>
            <div className="text-xs font-medium text-slate-700">
              Pathology Biochemistry, MRI/CT Radiology, Specialist Consultations
            </div>
            <div className="pt-2 border-t border-amber-200/60 text-[10.5px] font-semibold text-emerald-800 flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span>Audit Rule: Daily counter cash handover &amp; shift closing reconciliation</span>
            </div>
          </div>

          {/* Category C Card */}
          <div className="p-3.5 rounded-[4px] border border-emerald-200 bg-emerald-50/40 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-emerald-900">
                Category C (Pharmacy POS &amp; Emergency 24/7)
              </span>
              <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-white text-emerald-700 border border-emerald-200 shadow-2xs">
                Class C
              </span>
            </div>
            <div className="text-base font-extrabold text-slate-900 font-mono">
              10% Revenue (৳ 14.8 Lakh/mo)
            </div>
            <div className="text-xs font-medium text-slate-700">
              24/7 Triage Emergency Medicine, OTC Dispensing &amp; Disposables
            </div>
            <div className="pt-2 border-t border-emerald-200/60 text-[10.5px] font-semibold text-emerald-800 flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span>Audit Rule: Perpetual cash drawer audit &amp; automated MFS settlement</span>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* SECTION 1: INPATIENT (IPD) DISCHARGE BILLING & CLEARANCE QUEUE             */}
      {/* ========================================================================= */}
      <div className="space-y-2">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <h3 className="text-sm font-bold text-slate-900">
              Inpatient (IPD) Discharge Billing &amp; Clearance Queue
            </h3>
            <p className="text-[11px] text-slate-500">
              Active patient discharge authorizations requiring accounts verification, deposit adjustment, and clearance voucher
            </p>
          </div>
          <button
            type="button"
            onClick={() => onSelectModule('billing-invoices')}
            className="text-xs font-bold text-[#006a4e] hover:underline cursor-pointer"
          >
            View All Patient Bills &rarr;
          </button>
        </div>

        <DataTable<IpdDischargeQueueItem>
          data={ipdQueue}
          columns={ipdColumns}
          keyExtractor={(item) => item.id}
          searchPlaceholder="Search patient name, MRN, invoice #, consultant..."
          searchFilter={(item, query) =>
            item.patientName.toLowerCase().includes(query.toLowerCase()) ||
            item.uhid.toLowerCase().includes(query.toLowerCase()) ||
            item.invoiceNo.toLowerCase().includes(query.toLowerCase()) ||
            item.consultantName.toLowerCase().includes(query.toLowerCase()) ||
            item.bedNumber.toLowerCase().includes(query.toLowerCase())
          }
          showSerial={true}
        />
      </div>

      {/* ========================================================================= */}
      {/* SECTION 2: DAILY COUNTER CASH COLLECTIONS & SHIFT CLOSING                  */}
      {/* ========================================================================= */}
      <div className="space-y-2 pt-2">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <h3 className="text-sm font-bold text-slate-900">
              Daily Counter Cash Collections &amp; Shift Closing
            </h3>
            <p className="text-[11px] text-slate-500">
              Hospital counter cash registers, POS terminal batches, and treasury vault handovers
            </p>
          </div>
          <button
            type="button"
            onClick={() => onSelectModule('billing-collections')}
            className="text-xs font-bold text-[#006a4e] hover:underline cursor-pointer"
          >
            Open Counter Collections Hub &rarr;
          </button>
        </div>

        <DataTable<DailyCounterCollectionRecord>
          data={DAILY_COUNTER_COLLECTIONS_DATA}
          columns={counterColumns}
          keyExtractor={(item) => item.id}
          searchPlaceholder="Search counter name, code, cashier..."
          searchFilter={(item, query) =>
            item.counterName.toLowerCase().includes(query.toLowerCase()) ||
            item.counterCode.toLowerCase().includes(query.toLowerCase()) ||
            item.cashierName.toLowerCase().includes(query.toLowerCase())
          }
          showSerial={true}
        />
      </div>

      {/* ========================================================================= */}
      {/* MODAL: IPD DISCHARGE BILL CLEARANCE & SETTLEMENT                           */}
      {/* ========================================================================= */}
      {isClearanceModalOpen && selectedDischargeItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-[4px] shadow-2xl border border-slate-200 w-full max-w-xl overflow-hidden font-['Plus_Jakarta_Sans',sans-serif] p-6 max-h-[90vh] flex flex-col animate-in zoom-in-95">
            <div className="flex items-start justify-between border-b pb-3 mb-3">
              <div>
                <h3 className="text-base font-extrabold text-slate-900">
                  Hospital Discharge Clearance Authorization
                </h3>
                <p className="text-xs text-slate-500">
                  Patient: <strong className="text-slate-800">{selectedDischargeItem.patientName}</strong> ({selectedDischargeItem.uhid})
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsClearanceModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 cursor-pointer p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Bill Breakdown Details */}
            <div className="space-y-3 flex-1 overflow-y-auto">
              <div className="grid grid-cols-2 gap-2 bg-slate-50 p-3 rounded-[3px] border border-slate-200 text-xs">
                <div>
                  <span className="text-slate-500 block text-[11px]">Invoice / Admission ID:</span>
                  <span className="font-mono font-bold text-slate-900">{selectedDischargeItem.invoiceNo}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[11px]">Bed / Ward:</span>
                  <span className="font-bold text-slate-900">{selectedDischargeItem.bedNumber} ({selectedDischargeItem.department})</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[11px]">Primary Consultant:</span>
                  <span className="font-semibold text-slate-900">{selectedDischargeItem.consultantName}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[11px]">Stay Duration:</span>
                  <span className="font-mono text-slate-800">{selectedDischargeItem.admissionDate} to {selectedDischargeItem.dischargeDate}</span>
                </div>
              </div>

              {/* Itemized Calculation */}
              <div className="border border-slate-200 rounded-[3px] overflow-hidden text-xs">
                <table className="w-full text-left">
                  <thead className="bg-[#0c2e4b] text-white text-[11px]">
                    <tr>
                      <th className="py-2 px-3">Service / Department Item</th>
                      <th className="py-2 px-3 text-right">Amount (BDT)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-mono text-[11.5px]">
                    <tr>
                      <td className="py-2 px-3 font-sans text-slate-700">Bed &amp; Nursing Charges</td>
                      <td className="py-2 px-3 text-right">৳ {selectedDischargeItem.bedCharges.toLocaleString()}</td>
                    </tr>
                    <tr>
                      <td className="py-2 px-3 font-sans text-slate-700">Operation Theatre (OT) &amp; Anaesthesia</td>
                      <td className="py-2 px-3 text-right">৳ {selectedDischargeItem.otCharges.toLocaleString()}</td>
                    </tr>
                    <tr>
                      <td className="py-2 px-3 font-sans text-slate-700">Inpatient Medicine &amp; Consumables</td>
                      <td className="py-2 px-3 text-right">৳ {selectedDischargeItem.medicineCharges.toLocaleString()}</td>
                    </tr>
                    <tr>
                      <td className="py-2 px-3 font-sans text-slate-700">Doctor &amp; Specialist Visiting Fees</td>
                      <td className="py-2 px-3 text-right">৳ {selectedDischargeItem.doctorCharges.toLocaleString()}</td>
                    </tr>
                    <tr className="bg-slate-50 font-bold text-slate-900">
                      <td className="py-2 px-3 font-sans">Gross Total Bill</td>
                      <td className="py-2 px-3 text-right">৳ {selectedDischargeItem.grossAmount.toLocaleString()}</td>
                    </tr>
                    <tr className="text-emerald-700 font-semibold">
                      <td className="py-2 px-3 font-sans">Less: Advance Deposit Adjusted</td>
                      <td className="py-2 px-3 text-right">- ৳ {selectedDischargeItem.advancePaid.toLocaleString()}</td>
                    </tr>
                    {selectedDischargeItem.discountApproved > 0 && (
                      <tr className="text-rose-600 font-semibold">
                        <td className="py-2 px-3 font-sans">Less: Approved Medical Discount</td>
                        <td className="py-2 px-3 text-right">- ৳ {selectedDischargeItem.discountApproved.toLocaleString()}</td>
                      </tr>
                    )}
                    <tr className="bg-[#edf6f2] text-[#006a4e] font-extrabold text-sm">
                      <td className="py-2.5 px-3 font-sans">Net Cash / Card Payable Upon Discharge</td>
                      <td className="py-2.5 px-3 text-right">৳ {selectedDischargeItem.netPayable.toLocaleString()}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-100 mt-4 shrink-0">
              <span className="text-[11px] text-slate-400">
                Audited by Md. Rashedul Islam, ACA (Chief Accountant)
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsClearanceModalOpen(false)}
                  className="h-8 px-3 rounded-[3px] border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleConfirmClearance}
                  className="h-8 px-4 rounded-[3px] bg-[#006a4e] hover:bg-[#00553e] text-white text-xs font-semibold inline-flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Approve &amp; Print Slip</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
