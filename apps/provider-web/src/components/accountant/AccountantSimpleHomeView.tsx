import React, { useState } from 'react';
import {
  ArrowDownLeft,
  ArrowUpRight,
  Building2,
  Landmark,
  Layers,
  Plus,
  RotateCcw,
  TrendingUp,
  Users,
  Wallet,
  X,
} from 'lucide-react';
import { SummaryCard, SummaryCardGrid } from '../common/SummaryCard';
import { DataTable, DataTableColumn } from '../common/DataTable';
import {
  LedgerVoucher,
  SIMPLE_ENTRY_CATEGORIES,
} from '../../data/accountantPortalData';
import { useAccountantLedger } from '../../data/accountantLedgerContext';

interface AccountantSimpleHomeViewProps {
  onSelectModule: (moduleId: string) => void;
}

/**
 * Simple Mode (Single-Entry) Landing Dashboard
 * Modeled directly on pharmacy-care SimpleDashboard:
 * - Zero Debit / Credit / Trial Balance / GL jargon
 * - Direct "+ Add Income", "+ Add Expense", "+ Multi Entry" actions
 * - Plain-language Income, Expense, Net Profit, Cash, Bank, Receivables & Payables
 * - Recent Cash & Expense Entries list with immutable reversal
 */
export const AccountantSimpleHomeView: React.FC<AccountantSimpleHomeViewProps> = ({
  onSelectModule,
}) => {
  const { vouchers, stats, settings, addSingleEntry, reverseVoucher } = useAccountantLedger();

  const [entryModalKind, setEntryModalKind] = useState<'income' | 'expense' | null>(null);
  const [categoryId, setCategoryId] = useState<string>(SIMPLE_ENTRY_CATEGORIES[0].id);
  const [amount, setAmount] = useState<string>('');
  const [paymentChannel, setPaymentChannel] = useState<'Cash' | 'Bank' | 'bKash / Nagad'>('Cash');
  const [entryDate, setEntryDate] = useState<string>(() => new Date().toISOString().slice(0, 10));
  const [partyName, setPartyName] = useState<string>('');
  const [narration, setNarration] = useState<string>('');

  const [reverseTarget, setReverseTarget] = useState<LedgerVoucher | null>(null);
  const [reverseReason, setReverseReason] = useState<string>('');

  const openModal = (kind: 'income' | 'expense') => {
    const first = SIMPLE_ENTRY_CATEGORIES.find((c) => c.kind === kind);
    setEntryModalKind(kind);
    setCategoryId(first?.id || '');
    setAmount('');
    setPaymentChannel('Cash');
    setPartyName('');
    setNarration('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!entryModalKind) return;
    const numericAmt = Number(amount.replace(/,/g, '').trim());
    if (!Number.isFinite(numericAmt) || numericAmt <= 0) return;

    addSingleEntry({
      kind: entryModalKind,
      categoryId,
      amount: numericAmt,
      paymentChannel,
      date: entryDate,
      partyName,
      narration,
      branchName: 'Dhanmondi Central',
    });
    setEntryModalKind(null);
  };

  const handleConfirmReverse = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reverseTarget || !reverseReason.trim()) return;
    reverseVoucher(reverseTarget.id, reverseReason);
    setReverseTarget(null);
    setReverseReason('');
  };

  const recentColumns: DataTableColumn<LedgerVoucher>[] = [
    {
      key: 'voucherNo',
      header: 'Date & Slip #',
      sortable: true,
      sortValue: (r) => r.date,
      render: (r) => (
        <div className="whitespace-nowrap">
          <span className="font-mono font-bold text-slate-900 text-xs block">{r.voucherNo}</span>
          <span className="font-mono text-[10.5px] text-slate-400">{r.date}</span>
        </div>
      ),
    },
    {
      key: 'categoryEn',
      header: 'Income / Expense Category & Note',
      sortable: true,
      sortValue: (r) => r.categoryEn,
      render: (r) => (
        <div className="max-w-[330px]">
          <span className="font-bold text-slate-900 text-xs block truncate">{r.categoryEn}</span>
          <span className="text-[11px] text-slate-500 line-clamp-1 block" title={r.narration}>
            {r.partyName ? `${r.partyName} — ` : ''}
            {r.narration}
          </span>
        </div>
      ),
    },
    {
      key: 'paymentChannel',
      header: 'Paid / Received Via',
      sortable: true,
      sortValue: (r) => r.paymentChannel,
      render: (r) => (
        <span className="px-2 py-0.5 rounded-[3px] text-[10.5px] font-semibold bg-slate-100 text-slate-700 whitespace-nowrap">
          {r.paymentChannel}
        </span>
      ),
    },
    {
      key: 'amount',
      header: 'Amount (BDT)',
      align: 'right',
      sortable: true,
      sortValue: (r) => r.amount,
      render: (r) => (
        <span
          className={`font-mono font-extrabold text-xs whitespace-nowrap ${
            r.direction === 'in'
              ? 'text-[#006a4e]'
              : r.direction === 'out'
              ? 'text-rose-600'
              : 'text-slate-800'
          }`}
        >
          {r.direction === 'in' ? '+' : r.direction === 'out' ? '-' : ''}৳ {r.amount.toLocaleString()}
        </span>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      align: 'center',
      render: (r) => (
        <div className="inline-flex items-center gap-1.5 whitespace-nowrap">
          <span
            className={`px-2 py-0.5 rounded-[3px] text-[10.5px] font-bold border whitespace-nowrap ${
              r.status === 'reversed'
                ? 'bg-rose-50 text-rose-700 border-rose-200'
                : r.status === 'pending_approval'
                ? 'bg-amber-50 text-amber-700 border-amber-200'
                : 'bg-emerald-50 text-emerald-700 border-emerald-200'
            }`}
          >
            {r.isReversal
              ? 'Cancelled / Reversal'
              : r.status === 'pending_approval'
              ? 'Pending Approval'
              : r.status === 'reversed'
              ? 'Reversed'
              : 'Recorded'}
          </span>
          {r.status === 'posted' && !r.isReversal && (
            <button
              type="button"
              onClick={() => {
                setReverseTarget(r);
                setReverseReason('');
              }}
              title="Reverse Entry"
              className="p-1 rounded border border-slate-200 text-slate-500 hover:text-rose-600 hover:border-rose-300 cursor-pointer"
            >
              <RotateCcw className="w-3 h-3" />
            </button>
          )}
        </div>
      ),
    },
  ];

  const todayStr = new Date().toISOString().slice(0, 10);
  const todayIncome = vouchers
    .filter((v) => v.status === 'posted' && v.direction === 'in' && v.date >= '2026-11-28')
    .reduce((sum, v) => sum + v.amount, 0);
  const todayExpense = vouchers
    .filter((v) => v.status === 'posted' && v.direction === 'out' && v.date >= '2026-11-28')
    .reduce((sum, v) => sum + v.amount, 0);

  return (
    <div className="space-y-4 font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Simple Mode Header Bar */}
      <div className="bg-white rounded-[4px] border border-slate-200/90 p-4 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <h2 className="text-base font-extrabold text-slate-900 tracking-tight">
              Income, Expense &amp; Cash Overview
            </h2>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-[#006a4e] border border-emerald-200">
              Simple Mode (Single-Entry)
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Fast plain-language daily hospital Income &amp; Expense book — zero Debit/Credit jargon required.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => openModal('income')}
            className="h-8 px-3 rounded-[3px] bg-[#006a4e] hover:bg-[#00553e] text-white text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer shadow-xs transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Income</span>
          </button>
          <button
            type="button"
            onClick={() => openModal('expense')}
            className="h-8 px-3 rounded-[3px] bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer shadow-xs transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Expense</span>
          </button>
          <button
            type="button"
            onClick={() => onSelectModule('entry-multi')}
            className="h-8 px-3 rounded-[3px] bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-semibold inline-flex items-center gap-1.5 cursor-pointer shadow-2xs transition-colors"
          >
            <Layers className="w-3.5 h-3.5 text-slate-500" />
            <span>Multi Entry</span>
          </button>
        </div>
      </div>

      {/* Row 1: Period & Today Income, Expense, Net Profit */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        <div className="bg-white rounded-[4px] border border-slate-200/90 p-4 shadow-2xs">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
            <span>Period Cash &amp; Bank Income</span>
            <ArrowDownLeft className="w-4 h-4 text-[#006a4e] shrink-0" />
          </div>
          <div className="mt-2 font-mono text-xl sm:text-2xl font-extrabold text-[#006a4e] whitespace-nowrap">
            ৳ {stats.periodIncome.toLocaleString()}
          </div>
          <div className="mt-1 text-[11px] text-slate-500">
            Today ({todayStr}): <strong className="font-mono text-slate-800 whitespace-nowrap">৳ {todayIncome.toLocaleString()}</strong>
          </div>
        </div>

        <div className="bg-white rounded-[4px] border border-slate-200/90 p-4 shadow-2xs">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
            <span>Period Operating Expenses</span>
            <ArrowUpRight className="w-4 h-4 text-rose-600 shrink-0" />
          </div>
          <div className="mt-2 font-mono text-xl sm:text-2xl font-extrabold text-rose-600 whitespace-nowrap">
            ৳ {stats.periodOperatingExpense.toLocaleString()}
          </div>
          <div className="mt-1 text-[11px] text-slate-500">
            Today ({todayStr}): <strong className="font-mono text-slate-800 whitespace-nowrap">৳ {todayExpense.toLocaleString()}</strong>
          </div>
        </div>

        <div className="bg-white rounded-[4px] border border-[#006a4e]/35 p-4 shadow-2xs sm:col-span-2 lg:col-span-1">
          <div className="flex items-center justify-between text-xs font-semibold text-[#006a4e]">
            <span>Net Profit This Period</span>
            <TrendingUp className="w-4 h-4 text-[#006a4e] shrink-0" />
          </div>
          <div
            className={`mt-2 font-mono text-xl sm:text-2xl font-extrabold whitespace-nowrap ${
              stats.netProfit >= 0 ? 'text-[#006a4e]' : 'text-rose-600'
            }`}
          >
            ৳ {stats.netProfit.toLocaleString()}
          </div>
          <div className="mt-1 flex items-center justify-between gap-2 text-[11px]">
            <span className="text-slate-500">Based on recorded entries</span>
            <button
              type="button"
              onClick={() => onSelectModule('reports-pnl')}
              className="font-bold text-[#006a4e] hover:underline cursor-pointer whitespace-nowrap"
            >
              See Profit &amp; Loss &rarr;
            </button>
          </div>
        </div>
      </div>

      {/* Row 2: Cash in Hand, Bank & MFS, Patients Owe, Owed to Suppliers */}
      <SummaryCardGrid columns={4}>
        <SummaryCard
          title="Cash in Hand (Vault)"
          value={`৳ ${stats.cashInHand.toLocaleString()}`}
          subtitle="Hospital physical safe drawer"
          icon={Wallet}
          iconColor="text-[#006a4e]"
        />
        <SummaryCard
          title="Bank & bKash / Nagad"
          value={`৳ ${(stats.bankBalance + stats.walletBalance).toLocaleString()}`}
          subtitle={`Bank ৳${stats.bankBalance.toLocaleString()} · Wallet ৳${stats.walletBalance.toLocaleString()}`}
          icon={Landmark}
          iconColor="text-sky-600"
        />
        <SummaryCard
          title="Patients & Corporate Owe"
          value={`৳ ${stats.totalReceivables.toLocaleString()}`}
          subtitle="Pending credit & corporate dues"
          icon={Users}
          iconColor="text-amber-600"
          valueColor="text-amber-700"
        />
        <SummaryCard
          title="Owed to Suppliers"
          value={`৳ ${stats.totalPayables.toLocaleString()}`}
          subtitle="Pending pharma & vendor bills"
          icon={Building2}
          iconColor="text-rose-600"
          valueColor="text-rose-600"
        />
      </SummaryCardGrid>

      {/* Plain-Language Recent Cash & Expense Entries */}
      <div className="space-y-2 pt-1">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900">
              Recent Income &amp; Expense Entries
            </h3>
            <p className="text-[11px] text-slate-500">
              Plain-language transaction register. Entries above ৳ {settings.approvalThresholdBdt.toLocaleString()} await controller sign-off.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => onSelectModule('books-day')}
              className="text-xs font-bold text-[#006a4e] hover:underline cursor-pointer"
            >
              Open Full Day Book &rarr;
            </button>
          </div>
        </div>

        <DataTable<LedgerVoucher>
          data={vouchers}
          columns={recentColumns}
          keyExtractor={(item) => item.id}
          showSerial={true}
          searchPlaceholder="Search slip #, category, party or note..."
          searchFilter={(r, q) =>
            r.voucherNo.toLowerCase().includes(q) ||
            r.categoryEn.toLowerCase().includes(q) ||
            r.narration.toLowerCase().includes(q) ||
            (r.partyName || '').toLowerCase().includes(q)
          }
        />
      </div>

      {/* Add Income / Add Expense Modal */}
      {entryModalKind && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs">
          <form
            onSubmit={handleSubmit}
            className="bg-white rounded-[4px] border border-slate-200 shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto p-5 space-y-4"
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-base font-extrabold text-slate-900">
                  {entryModalKind === 'income' ? 'Add Hospital Income' : 'Add Hospital Expense'}
                </h3>
                <p className="text-[11px] text-slate-500">
                  Enter details in plain language — cashbook and P&amp;L update automatically.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setEntryModalKind(null)}
                className="text-slate-400 hover:text-slate-700 cursor-pointer p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              <div className="md:col-span-2">
                <label className="block font-bold text-slate-700 mb-1">
                  {entryModalKind === 'income' ? 'Income Source *' : 'Expense Category *'}
                </label>
                <select
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                  className="w-full h-9 px-2.5 rounded-[3px] border border-slate-300 text-xs font-medium bg-white"
                  required
                >
                  {SIMPLE_ENTRY_CATEGORIES.filter((c) => c.kind === entryModalKind).map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.nameEn} ({c.nameBn})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Amount (৳ BDT) *</label>
                <input
                  type="number"
                  min="1"
                  step="0.01"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="e.g. 25000"
                  className="w-full h-9 px-2.5 rounded-[3px] border border-slate-300 font-mono text-xs"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Channel *</label>
                <select
                  value={paymentChannel}
                  onChange={(e) =>
                    setPaymentChannel(e.target.value as 'Cash' | 'Bank' | 'bKash / Nagad')
                  }
                  className="w-full h-9 px-2.5 rounded-[3px] border border-slate-300 text-xs font-medium bg-white"
                >
                  <option value="Cash">Cash Vault</option>
                  <option value="Bank">Bank Account</option>
                  <option value="bKash / Nagad">bKash / Nagad</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Date *</label>
                <input
                  type="date"
                  value={entryDate}
                  onChange={(e) => setEntryDate(e.target.value)}
                  className="w-full h-9 px-2.5 rounded-[3px] border border-slate-300 font-mono text-xs"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Patient / Vendor</label>
                <input
                  type="text"
                  value={partyName}
                  onChange={(e) => setPartyName(e.target.value)}
                  placeholder="Optional name"
                  className="w-full h-9 px-2.5 rounded-[3px] border border-slate-300 text-xs"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block font-bold text-slate-700 mb-1">Description / Slip Note *</label>
                <textarea
                  rows={2}
                  value={narration}
                  onChange={(e) => setNarration(e.target.value)}
                  placeholder="e.g. Emergency ward generator fuel slip #481"
                  className="w-full p-2 rounded-[3px] border border-slate-300 text-xs"
                  required
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setEntryModalKind(null)}
                className="h-8 px-3 rounded-[3px] border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className={`h-8 px-4 rounded-[3px] text-white text-xs font-bold cursor-pointer ${
                  entryModalKind === 'income'
                    ? 'bg-[#006a4e] hover:bg-[#00553e]'
                    : 'bg-rose-600 hover:bg-rose-700'
                }`}
              >
                Save {entryModalKind === 'income' ? 'Income' : 'Expense'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Reverse Entry Modal */}
      {reverseTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs">
          <form
            onSubmit={handleConfirmReverse}
            className="bg-white rounded-[4px] border border-slate-200 shadow-2xl w-full max-w-md p-5 space-y-3"
          >
            <h3 className="text-sm font-extrabold text-slate-900">
              Reverse Slip #{reverseTarget.voucherNo}
            </h3>
            <p className="text-xs text-slate-500">
              Creates a counter reversal entry to cancel <strong>৳ {reverseTarget.amount.toLocaleString()}</strong> safely.
            </p>
            <div>
              <label className="block font-bold text-slate-700 text-xs mb-1">Reason for Reversal *</label>
              <input
                type="text"
                value={reverseReason}
                onChange={(e) => setReverseReason(e.target.value)}
                placeholder="e.g. Wrong amount entered"
                className="w-full h-9 px-2.5 rounded-[3px] border border-slate-300 text-xs"
                required
              />
            </div>
            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setReverseTarget(null)}
                className="h-8 px-3 rounded-[3px] border border-slate-300 text-xs font-semibold text-slate-700 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="h-8 px-4 rounded-[3px] bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold cursor-pointer"
              >
                Confirm Reversal
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

