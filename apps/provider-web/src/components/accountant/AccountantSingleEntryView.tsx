import React, { useState } from 'react';
import {
  ArrowDownLeft,
  ArrowUpRight,
  CheckCircle2,
  Copy,
  Layers,
  Plus,
  RotateCcw,
  Trash2,
  Wallet,
  X,
} from 'lucide-react';
import { SummaryCard, SummaryCardGrid } from '../common/SummaryCard';
import { DataTable, DataTableColumn } from '../common/DataTable';
import {
  LedgerVoucher,
  SIMPLE_ENTRY_CATEGORIES,
} from '../../data/accountantPortalData';
import {
  MultiEntryRowInput,
  useAccountantLedger,
} from '../../data/accountantLedgerContext';

interface AccountantSingleEntryViewProps {
  viewMode: 'quick' | 'multi';
  onSelectModule?: (moduleId: string) => void;
}

interface MultiRowDraft {
  key: string;
  kind: 'income' | 'expense';
  categoryId: string;
  amount: string;
  paymentChannel: 'Cash' | 'Bank' | 'bKash / Nagad';
  partyName: string;
  narration: string;
}

export const AccountantSingleEntryView: React.FC<AccountantSingleEntryViewProps> = ({
  viewMode,
  onSelectModule,
}) => {
  const {
    vouchers,
    stats,
    settings,
    addSingleEntry,
    addMultiEntries,
    reverseVoucher,
  } = useAccountantLedger();

  // Single-Entry Form Modal State
  const [entryModalKind, setEntryModalKind] = useState<'income' | 'expense' | null>(null);
  const [categoryId, setCategoryId] = useState<string>(SIMPLE_ENTRY_CATEGORIES[0].id);
  const [amount, setAmount] = useState<string>('');
  const [paymentChannel, setPaymentChannel] = useState<'Cash' | 'Bank' | 'bKash / Nagad'>('Cash');
  const [entryDate, setEntryDate] = useState<string>(() => new Date().toISOString().slice(0, 10));
  const [partyName, setPartyName] = useState<string>('');
  const [narration, setNarration] = useState<string>('');

  // Reversal Modal State
  const [reverseTarget, setReverseTarget] = useState<LedgerVoucher | null>(null);
  const [reverseReason, setReverseReason] = useState<string>('');

  // Multi-Entry Spreadsheet Draft State
  const makeRow = (kind: 'income' | 'expense' = 'expense', seed?: Partial<MultiRowDraft>): MultiRowDraft => {
    const firstCat = SIMPLE_ENTRY_CATEGORIES.find((c) => c.kind === kind);
    return {
      key: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      kind,
      categoryId: seed?.categoryId ?? (firstCat?.id || ''),
      amount: seed?.amount ?? '',
      paymentChannel: seed?.paymentChannel ?? 'Cash',
      partyName: seed?.partyName ?? '',
      narration: seed?.narration ?? '',
    };
  };

  const [multiDate, setMultiDate] = useState<string>(() => new Date().toISOString().slice(0, 10));
  const [multiBranch, setMultiBranch] = useState<string>('Dhanmondi Central');
  const [multiRows, setMultiRows] = useState<MultiRowDraft[]>(() => [
    makeRow('income'),
    makeRow('expense'),
    makeRow('expense'),
  ]);

  const openQuickModal = (kind: 'income' | 'expense') => {
    const firstCat = SIMPLE_ENTRY_CATEGORIES.find((c) => c.kind === kind);
    setEntryModalKind(kind);
    setCategoryId(firstCat?.id || '');
    setAmount('');
    setPaymentChannel('Cash');
    setPartyName('');
    setNarration('');
  };

  const handleQuickSubmit = (e: React.FormEvent) => {
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

  const updateMultiRow = (key: string, patch: Partial<MultiRowDraft>) => {
    setMultiRows((prev) =>
      prev.map((row) => {
        if (row.key !== key) return row;
        const next = { ...row, ...patch };
        if (patch.kind && patch.kind !== row.kind) {
          const first = SIMPLE_ENTRY_CATEGORIES.find((c) => c.kind === patch.kind);
          next.categoryId = first?.id || '';
        }
        return next;
      })
    );
  };

  const duplicateMultiRow = (idx: number) => {
    setMultiRows((prev) => {
      if (prev.length >= 50) return prev;
      const src = prev[idx];
      if (!src) return prev;
      return [...prev.slice(0, idx + 1), makeRow(src.kind, { ...src }), ...prev.slice(idx + 1)];
    });
  };

  const removeMultiRow = (key: string) => {
    setMultiRows((prev) => (prev.length <= 1 ? prev : prev.filter((r) => r.key !== key)));
  };

  const multiTotals = multiRows.reduce(
    (acc, r) => {
      const val = Number(r.amount.replace(/,/g, '').trim());
      const amt = Number.isFinite(val) && val > 0 ? val : 0;
      if (r.kind === 'income') acc.income += amt;
      else acc.expense += amt;
      if (amt > 0 && r.categoryId) acc.validCount += 1;
      return acc;
    },
    { income: 0, expense: 0, validCount: 0 }
  );

  const handleMultiSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validInputs: MultiEntryRowInput[] = [];
    for (const r of multiRows) {
      const val = Number(r.amount.replace(/,/g, '').trim());
      if (Number.isFinite(val) && val > 0 && r.categoryId) {
        validInputs.push({
          kind: r.kind,
          categoryId: r.categoryId,
          amount: val,
          paymentChannel: r.paymentChannel,
          partyName: r.partyName,
          narration: r.narration,
        });
      }
    }
    if (validInputs.length === 0) return;
    addMultiEntries(validInputs, multiDate, multiBranch);
    setMultiRows([makeRow('income'), makeRow('expense')]);
  };

  const handleReverseSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reverseTarget || reverseReason.trim().length < 4) return;
    reverseVoucher(reverseTarget.id, reverseReason);
    setReverseTarget(null);
    setReverseReason('');
  };

  const recentColumns: DataTableColumn<LedgerVoucher>[] = [
    {
      key: 'voucherNo',
      header: 'Voucher # & Date',
      sortable: true,
      sortValue: (r) => r.date,
      render: (r) => (
        <div>
          <span className="font-mono font-bold text-slate-900 text-xs block">{r.voucherNo}</span>
          <span className="font-mono text-[10.5px] text-slate-400">{r.date}</span>
        </div>
      ),
    },
    {
      key: 'categoryEn',
      header: 'Plain Category & Description',
      sortable: true,
      sortValue: (r) => r.categoryEn,
      render: (r) => (
        <div>
          <div className="flex items-center gap-1.5">
            <span className="font-bold text-slate-900 text-xs">{r.categoryEn}</span>
            <span className="text-[9.5px] font-mono px-1.5 py-0.2 rounded bg-slate-100 text-slate-600 uppercase">
              {r.entryMethod}
            </span>
          </div>
          <span className="text-[11px] text-slate-500 line-clamp-1 block" title={r.narration}>
            {r.partyName ? `${r.partyName} — ` : ''}{r.narration}
          </span>
        </div>
      ),
    },
    {
      key: 'paymentChannel',
      header: 'Channel',
      sortable: true,
      sortValue: (r) => r.paymentChannel,
      render: (r) => (
        <span className="px-2 py-0.5 rounded-[3px] text-[10.5px] font-semibold bg-slate-100 text-slate-700">
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
          className={`font-mono font-extrabold text-xs ${
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
      header: 'Status & Audit',
      align: 'center',
      render: (r) => (
        <div className="inline-flex items-center gap-1.5">
          <span
            className={`px-2 py-0.5 rounded-[3px] text-[10.5px] font-bold border ${
              r.status === 'reversed'
                ? 'bg-rose-50 text-rose-700 border-rose-200'
                : r.status === 'pending_approval'
                ? 'bg-amber-50 text-amber-700 border-amber-200'
                : r.status === 'draft'
                ? 'bg-slate-100 text-slate-600 border-slate-200'
                : 'bg-emerald-50 text-emerald-700 border-emerald-200'
            }`}
          >
            {r.isReversal ? 'Reversal' : r.status === 'pending_approval' ? 'Pending Approval' : r.status === 'reversed' ? 'Reversed' : 'Posted'}
          </span>
          {r.status === 'posted' && !r.isReversal && (
            <button
              type="button"
              onClick={() => {
                setReverseTarget(r);
                setReverseReason('');
              }}
              title="Reverse Entry (Immutable Ledger)"
              className="p-1 rounded border border-slate-200 text-slate-500 hover:text-rose-600 hover:border-rose-300 cursor-pointer"
            >
              <RotateCcw className="w-3 h-3" />
            </button>
          )}
        </div>
      ),
    },
  ];

  // ===========================================================================
  // VIEW 1: MULTI-ENTRY BATCH SPREADSHEET WORKSPACE
  // ===========================================================================
  if (viewMode === 'multi') {
    return (
      <div className="space-y-4 font-['Plus_Jakarta_Sans',sans-serif]">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div>
            <h1 className="text-lg md:text-xl font-bold text-slate-900 flex items-center gap-2">
              <Layers className="w-5 h-5 text-[#006a4e]" />
              <span>Multi-Entry Batch Cash & Expense Console</span>
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Rapidly punch multiple Income & Expense entries in one sheet. Each valid row automatically posts a balanced Double-Entry voucher to GL.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setMultiRows((prev) => [...prev, makeRow('income')])}
              className="h-8 px-3 rounded-[3px] bg-emerald-50 text-[#006a4e] border border-emerald-200 hover:bg-emerald-100 text-xs font-bold flex items-center gap-1 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>+ Income Row</span>
            </button>
            <button
              type="button"
              onClick={() => setMultiRows((prev) => [...prev, makeRow('expense')])}
              className="h-8 px-3 rounded-[3px] bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100 text-xs font-bold flex items-center gap-1 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>+ Expense Row</span>
            </button>
          </div>
        </div>

        {/* Batch Form Container (Single Clean Layer) */}
        <form
          onSubmit={handleMultiSubmit}
          className="bg-white border border-slate-300/80 rounded-[3px] shadow-xs overflow-hidden"
        >
          {/* Batch Date & Branch Controls */}
          <div className="px-4 py-3 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-4 text-xs">
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-600">Posting Date:</span>
                <input
                  type="date"
                  value={multiDate}
                  onChange={(e) => setMultiDate(e.target.value)}
                  className="h-8 px-2.5 bg-white border border-slate-300 rounded-[3px] font-mono text-xs focus:outline-hidden focus:border-[#006a4e]"
                />
              </div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-600">Campus / Branch:</span>
                <select
                  value={multiBranch}
                  onChange={(e) => setMultiBranch(e.target.value)}
                  className="h-8 px-2.5 bg-white border border-slate-300 rounded-[3px] text-xs font-medium focus:outline-hidden focus:border-[#006a4e]"
                >
                  <option value="Dhanmondi Central">Dhanmondi Central</option>
                  <option value="Uttara Diagnostic Wing">Uttara Diagnostic Wing</option>
                  <option value="Mirpur OPD Satellite">Mirpur OPD Satellite</option>
                </select>
              </div>
            </div>

            <div className="flex items-center gap-4 font-mono">
              <span className="text-[#006a4e] font-bold">
                Income Total: +৳{multiTotals.income.toLocaleString()}
              </span>
              <span className="text-rose-600 font-bold">
                Expense Total: -৳{multiTotals.expense.toLocaleString()}
              </span>
              <span className="px-2 py-0.5 rounded bg-slate-200/80 text-slate-800 font-bold">
                Valid Rows: {multiTotals.validCount} / {multiRows.length}
              </span>
            </div>
          </div>

          {/* Batch Entry Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left border-collapse">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 font-semibold">
                <tr>
                  <th className="py-2.5 px-3 w-10 text-center border-r border-slate-200/60">SL</th>
                  <th className="py-2.5 px-3 w-32 border-r border-slate-200/60">Type</th>
                  <th className="py-2.5 px-3 min-w-[200px] border-r border-slate-200/60">Income / Expense Category</th>
                  <th className="py-2.5 px-3 w-36 border-r border-slate-200/60">Amount (৳)</th>
                  <th className="py-2.5 px-3 w-36 border-r border-slate-200/60">Channel</th>
                  <th className="py-2.5 px-3 min-w-[150px] border-r border-slate-200/60">Party / Vendor</th>
                  <th className="py-2.5 px-3 min-w-[180px] border-r border-slate-200/60">Narration / Note</th>
                  <th className="py-2.5 px-3 w-20 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {multiRows.map((row, idx) => {
                  const catOptions = SIMPLE_ENTRY_CATEGORIES.filter((c) => c.kind === row.kind);
                  return (
                    <tr key={row.key} className="hover:bg-slate-50/70">
                      <td className="py-2 px-3 text-center font-mono text-slate-400 border-r border-slate-200/50">
                        {idx + 1}
                      </td>
                      <td className="py-2 px-2 border-r border-slate-200/50">
                        <select
                          value={row.kind}
                          onChange={(e) =>
                            updateMultiRow(row.key, { kind: e.target.value as 'income' | 'expense' })
                          }
                          className={`w-full h-8 px-2 rounded-[3px] border text-xs font-bold focus:outline-hidden ${
                            row.kind === 'income'
                              ? 'bg-emerald-50 border-emerald-200 text-[#006a4e]'
                              : 'bg-rose-50 border-rose-200 text-rose-700'
                          }`}
                        >
                          <option value="income">Income (+)</option>
                          <option value="expense">Expense (-)</option>
                        </select>
                      </td>
                      <td className="py-2 px-2 border-r border-slate-200/50">
                        <select
                          value={row.categoryId}
                          onChange={(e) => updateMultiRow(row.key, { categoryId: e.target.value })}
                          className="w-full h-8 px-2 bg-white border border-slate-300 rounded-[3px] text-xs font-medium focus:outline-hidden focus:border-[#006a4e]"
                        >
                          {catOptions.map((c) => (
                            <option key={c.id} value={c.id}>
                              {c.nameEn}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="py-2 px-2 border-r border-slate-200/50">
                        <input
                          type="number"
                          min="0"
                          step="1"
                          value={row.amount}
                          onChange={(e) => updateMultiRow(row.key, { amount: e.target.value })}
                          placeholder="0.00"
                          className="w-full h-8 px-2.5 bg-white border border-slate-300 rounded-[3px] font-mono font-bold text-right focus:outline-hidden focus:border-[#006a4e]"
                        />
                      </td>
                      <td className="py-2 px-2 border-r border-slate-200/50">
                        <select
                          value={row.paymentChannel}
                          onChange={(e) =>
                            updateMultiRow(row.key, {
                              paymentChannel: e.target.value as 'Cash' | 'Bank' | 'bKash / Nagad',
                            })
                          }
                          className="w-full h-8 px-2 bg-white border border-slate-300 rounded-[3px] text-xs focus:outline-hidden focus:border-[#006a4e]"
                        >
                          <option value="Cash">Cash Vault</option>
                          <option value="Bank">Bank Account</option>
                          <option value="bKash / Nagad">bKash / Nagad</option>
                        </select>
                      </td>
                      <td className="py-2 px-2 border-r border-slate-200/50">
                        <input
                          type="text"
                          value={row.partyName}
                          onChange={(e) => updateMultiRow(row.key, { partyName: e.target.value })}
                          placeholder="Patient / Supplier"
                          className="w-full h-8 px-2 bg-white border border-slate-300 rounded-[3px] text-xs focus:outline-hidden focus:border-[#006a4e]"
                        />
                      </td>
                      <td className="py-2 px-2 border-r border-slate-200/50">
                        <input
                          type="text"
                          value={row.narration}
                          onChange={(e) => updateMultiRow(row.key, { narration: e.target.value })}
                          placeholder="Description / Slip #"
                          className="w-full h-8 px-2 bg-white border border-slate-300 rounded-[3px] text-xs focus:outline-hidden focus:border-[#006a4e]"
                        />
                      </td>
                      <td className="py-2 px-2 text-center">
                        <div className="inline-flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => duplicateMultiRow(idx)}
                            title="Duplicate row"
                            className="p-1.5 rounded text-slate-500 hover:bg-slate-100 hover:text-slate-900 cursor-pointer"
                          >
                            <Copy className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => removeMultiRow(row.key)}
                            title="Remove row"
                            className="p-1.5 rounded text-slate-400 hover:bg-rose-50 hover:text-rose-600 cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Submit Footer */}
          <div className="px-4 py-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-3">
            <span className="text-[11px] text-slate-500">
              All posted rows automatically map to the configured Chart of Accounts ({settings.defaultCashCode} / {settings.defaultBankCode} / {settings.defaultWalletCode}).
            </span>
            <button
              type="submit"
              disabled={multiTotals.validCount === 0}
              className="h-9 px-5 rounded-[3px] bg-[#006a4e] hover:bg-[#00553e] disabled:opacity-50 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs transition-colors"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Post {multiTotals.validCount} Batch Entries to Ledger</span>
            </button>
          </div>
        </form>
      </div>
    );
  }

  // ===========================================================================
  // VIEW 2: QUICK SINGLE-ENTRY WORKSPACE (PLAIN-LANGUAGE INCOME & EXPENSE)
  // ===========================================================================
  return (
    <div className="space-y-4 font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Header + Quick Entry Triggers */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div>
          <h1 className="text-lg md:text-xl font-bold text-slate-900 flex items-center gap-2">
            <Wallet className="w-5 h-5 text-[#006a4e]" />
            <span>Quick Single-Entry Cashbook (Income & Expense)</span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Record hospital daily Income & Expenses in plain language without Debit/Credit jargon — balanced Double-Entry ledger lines are automatically generated underneath.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => openQuickModal('income')}
            className="h-9 px-4 rounded-[3px] bg-[#006a4e] hover:bg-[#00553e] text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs transition-colors"
          >
            <ArrowDownLeft className="w-4 h-4" />
            <span>+ Add Income</span>
          </button>
          <button
            type="button"
            onClick={() => openQuickModal('expense')}
            className="h-9 px-4 rounded-[3px] bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs transition-colors"
          >
            <ArrowUpRight className="w-4 h-4" />
            <span>+ Add Expense</span>
          </button>
          {onSelectModule && (
            <button
              type="button"
              onClick={() => onSelectModule('entry-multi')}
              className="h-9 px-3.5 rounded-[3px] bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
            >
              <Layers className="w-3.5 h-3.5 text-[#006a4e]" />
              <span>Multi-Row Batch</span>
            </button>
          )}
        </div>
      </div>

      {/* KPI Summary Strip */}
      <SummaryCardGrid columns={4}>
        <SummaryCard
          title="Period Income Posted"
          value={`৳ ${stats.periodIncome.toLocaleString()}`}
          subtitle="All IPD/OPD/Lab/Pharmacy entries"
          icon={ArrowDownLeft}
          iconColor="text-[#006a4e]"
          valueColor="text-[#006a4e]"
        />
        <SummaryCard
          title="Period Operating Expenses"
          value={`৳ ${(stats.periodCogs + stats.periodOperatingExpense).toLocaleString()}`}
          subtitle="Includes COGS, Doctor Share & Utilities"
          icon={ArrowUpRight}
          iconColor="text-rose-600"
          valueColor="text-rose-600"
        />
        <SummaryCard
          title="Vault Cash + Merchant Wallet"
          value={`৳ ${(stats.cashInHand + stats.walletBalance).toLocaleString()}`}
          subtitle={`Cash ৳${stats.cashInHand.toLocaleString()} · bKash ৳${stats.walletBalance.toLocaleString()}`}
          icon={Wallet}
          iconColor="text-blue-600"
        />
        <SummaryCard
          title="Net Operating Surplus"
          value={`৳ ${stats.netProfit.toLocaleString()}`}
          subtitle="Live auto-calculated from ledger"
          icon={CheckCircle2}
          iconColor={stats.netProfit >= 0 ? 'text-[#006a4e]' : 'text-amber-600'}
        />
      </SummaryCardGrid>

      {/* Single-Layer DataTable */}
      <DataTable<LedgerVoucher>
        data={vouchers}
        columns={recentColumns}
        showSerial={true}
        searchPlaceholder="Search voucher #, category, party, note..."
        searchFilter={(r, q) =>
          r.voucherNo.toLowerCase().includes(q) ||
          r.categoryEn.toLowerCase().includes(q) ||
          r.narration.toLowerCase().includes(q) ||
          (r.partyName || '').toLowerCase().includes(q)
        }
      />

      {/* Quick Income / Expense Modal */}
      {entryModalKind && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <form
            onSubmit={handleQuickSubmit}
            className="bg-white rounded-[4px] border border-slate-200 max-w-xl w-full shadow-2xl overflow-hidden animate-in zoom-in-95"
          >
            <div
              className={`px-5 py-3.5 border-b border-slate-200 flex items-center justify-between ${
                entryModalKind === 'income' ? 'bg-emerald-50/70' : 'bg-rose-50/70'
              }`}
            >
              <div className="flex items-center gap-2">
                {entryModalKind === 'income' ? (
                  <ArrowDownLeft className="w-5 h-5 text-[#006a4e]" />
                ) : (
                  <ArrowUpRight className="w-5 h-5 text-rose-600" />
                )}
                <h3 className="font-bold text-slate-900 text-sm">
                  {entryModalKind === 'income' ? 'Record Single-Entry Income (+)' : 'Record Single-Entry Expense (-)'}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setEntryModalKind(null)}
                className="p-1 rounded text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Entry Date *</label>
                <input
                  type="date"
                  required
                  value={entryDate}
                  onChange={(e) => setEntryDate(e.target.value)}
                  className="w-full h-9 px-3 border border-slate-300 rounded-[3px] font-mono focus:outline-hidden focus:border-[#006a4e]"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Payment Channel *</label>
                <select
                  value={paymentChannel}
                  onChange={(e) =>
                    setPaymentChannel(e.target.value as 'Cash' | 'Bank' | 'bKash / Nagad')
                  }
                  className="w-full h-9 px-3 border border-slate-300 rounded-[3px] bg-white focus:outline-hidden focus:border-[#006a4e]"
                >
                  <option value="Cash">Cash Vault ({settings.defaultCashCode})</option>
                  <option value="Bank">Bank Account ({settings.defaultBankCode})</option>
                  <option value="bKash / Nagad">bKash / Nagad ({settings.defaultWalletCode})</option>
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className="block font-bold text-slate-700 mb-1">Category *</label>
                <select
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                  className="w-full h-9 px-3 border border-slate-300 rounded-[3px] bg-white font-medium focus:outline-hidden focus:border-[#006a4e]"
                >
                  {SIMPLE_ENTRY_CATEGORIES.filter((c) => c.kind === entryModalKind).map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.nameEn} ({c.nameBn})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Amount (BDT ৳) *</label>
                <input
                  type="number"
                  required
                  min="1"
                  step="1"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="e.g. 25000"
                  className="w-full h-9 px-3 border border-slate-300 rounded-[3px] font-mono font-bold text-slate-900 focus:outline-hidden focus:border-[#006a4e]"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Patient / Vendor / Party</label>
                <input
                  type="text"
                  value={partyName}
                  onChange={(e) => setPartyName(e.target.value)}
                  placeholder="Optional reference name"
                  className="w-full h-9 px-3 border border-slate-300 rounded-[3px] focus:outline-hidden focus:border-[#006a4e]"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block font-bold text-slate-700 mb-1">Description / Memo</label>
                <textarea
                  rows={2}
                  value={narration}
                  onChange={(e) => setNarration(e.target.value)}
                  placeholder="Write slip no, purpose, or doctor reference..."
                  className="w-full p-2.5 border border-slate-300 rounded-[3px] focus:outline-hidden focus:border-[#006a4e]"
                />
              </div>
            </div>

            <div className="px-5 py-3 bg-slate-50 border-t border-slate-200 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setEntryModalKind(null)}
                className="h-8 px-4 rounded-[3px] border border-slate-300 text-slate-700 text-xs font-semibold hover:bg-slate-100 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className={`h-8 px-4 rounded-[3px] text-white text-xs font-bold cursor-pointer shadow-xs ${
                  entryModalKind === 'income'
                    ? 'bg-[#006a4e] hover:bg-[#00553e]'
                    : 'bg-rose-600 hover:bg-rose-700'
                }`}
              >
                Save & Post Entry
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Reversal Modal */}
      {reverseTarget && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <form
            onSubmit={handleReverseSubmit}
            className="bg-white rounded-[4px] border border-rose-200 max-w-md w-full shadow-2xl overflow-hidden"
          >
            <div className="px-5 py-3 bg-rose-50 border-b border-rose-200 flex items-center justify-between">
              <h3 className="font-bold text-rose-900 text-sm flex items-center gap-2">
                <RotateCcw className="w-4 h-4 text-rose-600" />
                <span>Reverse Voucher {reverseTarget.voucherNo}</span>
              </h3>
              <button
                type="button"
                onClick={() => setReverseTarget(null)}
                className="p-1 text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-5 space-y-3 text-xs">
              <p className="text-slate-600 leading-relaxed">
                Posted ledger vouchers are immutable for audit compliance. Reversing <strong>{reverseTarget.voucherNo}</strong> (৳{reverseTarget.amount.toLocaleString()}) creates a linked reversal entry with flipped Debit/Credit lines.
              </p>
              <div>
                <label className="block font-bold text-slate-700 mb-1">Reason for Reversal *</label>
                <textarea
                  required
                  minLength={4}
                  rows={2}
                  value={reverseReason}
                  onChange={(e) => setReverseReason(e.target.value)}
                  placeholder="Enter audit justification (minimum 4 chars)..."
                  className="w-full p-2.5 border border-slate-300 rounded-[3px] focus:outline-hidden focus:border-rose-500"
                />
              </div>
            </div>
            <div className="px-5 py-3 bg-slate-50 border-t border-slate-200 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setReverseTarget(null)}
                className="h-8 px-3 rounded-[3px] border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-100 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={reverseReason.trim().length < 4}
                className="h-8 px-4 rounded-[3px] bg-rose-600 hover:bg-rose-700 disabled:opacity-50 text-white text-xs font-bold cursor-pointer"
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
