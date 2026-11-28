import React, { useMemo, useState } from 'react';
import {
  AlertTriangle,
  BookOpen,
  Check,
  CheckCircle2,
  Eye,
  Plus,
  Printer,
  ReceiptText,
  RotateCcw,
  Trash2,
  X,
} from 'lucide-react';
import { DataTable, DataTableColumn } from '../common/DataTable';
import { LedgerVoucher } from '../../data/accountantPortalData';
import { useAccountantLedger } from '../../data/accountantLedgerContext';

interface AccountantJournalVouchersViewProps {
  viewMode: 'vouchers' | 'journal';
}

interface DraftJournalLine {
  accountCode: string;
  partyName: string;
  debit: string;
  credit: string;
  narration: string;
}

export const AccountantJournalVouchersView: React.FC<AccountantJournalVouchersViewProps> = ({
  viewMode,
}) => {
  const {
    vouchers,
    coaAccounts,
    parties,
    addDoubleEntryVoucher,
    approveVoucher,
    reverseVoucher,
    notify,
  } = useAccountantLedger();

  // Vouchers Filter & Inspection State
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [selectedVoucher, setSelectedVoucher] = useState<LedgerVoucher | null>(null);
  const [reverseTarget, setReverseTarget] = useState<LedgerVoucher | null>(null);
  const [reverseReason, setReverseReason] = useState<string>('');

  // Quick Receipt / Payment / Contra Modal inside Vouchers Hub
  const [quickVoucherType, setQuickVoucherType] = useState<'receipt' | 'payment' | 'contra' | null>(null);
  const [qvDate, setQvDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [qvCashBankCode, setQvCashBankCode] = useState('1010-01');
  const [qvCounterCode, setQvCounterCode] = useState('4010-01');
  const [qvAmount, setQvAmount] = useState('');
  const [qvParty, setQvParty] = useState('');
  const [qvNarration, setQvNarration] = useState('');

  // Double-Entry Journal Form State
  const [jDate, setJDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [jNarration, setJNarration] = useState('');
  const [jError, setJError] = useState<string | null>(null);
  const [jLines, setJLines] = useState<DraftJournalLine[]>(() => [
    { accountCode: '5020-01', partyName: '', debit: '', credit: '', narration: '' },
    { accountCode: '1020-01', partyName: '', debit: '', credit: '', narration: '' },
  ]);

  const cashBankAccounts = useMemo(
    () =>
      coaAccounts.filter(
        (a) => a.reportGroup === 'cash' || a.reportGroup === 'bank' || a.reportGroup === 'wallet'
      ),
    [coaAccounts]
  );

  const counterAccounts = useMemo(() => {
    if (quickVoucherType === 'contra') return cashBankAccounts;
    return coaAccounts.filter(
      (a) => a.reportGroup !== 'cash' && a.reportGroup !== 'bank' && a.reportGroup !== 'wallet'
    );
  }, [coaAccounts, cashBankAccounts, quickVoucherType]);

  const journalTotals = useMemo(() => {
    let debit = 0;
    let credit = 0;
    let conflict = false;
    for (const l of jLines) {
      const d = Number(l.debit.replace(/,/g, '').trim()) || 0;
      const c = Number(l.credit.replace(/,/g, '').trim()) || 0;
      if (d > 0 && c > 0) conflict = true;
      debit += d;
      credit += c;
    }
    const diff = debit - credit;
    const balanced = debit > 0 && Math.abs(diff) < 0.01 && !conflict;
    return { debit, credit, diff, balanced, conflict };
  }, [jLines]);

  const updateJournalLine = (idx: number, field: keyof DraftJournalLine, value: string) => {
    setJLines((prev) =>
      prev.map((row, i) => {
        if (i !== idx) return row;
        const next = { ...row, [field]: value };
        if (field === 'debit' && value.trim() !== '') next.credit = '';
        if (field === 'credit' && value.trim() !== '') next.debit = '';
        return next;
      })
    );
  };

  const handleSubmitJournal = (saveAsDraft: boolean) => {
    setJError(null);
    if (!journalTotals.balanced || jNarration.trim().length < 3) {
      setJError('Ensure Total Debit equals Total Credit (> 0) and enter a journal narration.');
      return;
    }
    const res = addDoubleEntryVoucher({
      type: 'journal',
      date: jDate,
      narration: jNarration,
      saveAsDraft,
      lines: jLines.map((l) => ({
        accountCode: l.accountCode,
        partyName: l.partyName,
        debit: Number(l.debit) || 0,
        credit: Number(l.credit) || 0,
        narration: l.narration,
      })),
    });

    if (!res.ok) {
      setJError(res.error || 'Failed to save journal voucher.');
      return;
    }

    setJNarration('');
    setJLines([
      { accountCode: '5020-01', partyName: '', debit: '', credit: '', narration: '' },
      { accountCode: '1020-01', partyName: '', debit: '', credit: '', narration: '' },
    ]);
  };

  const handleQuickVoucherSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickVoucherType) return;
    const amt = Number(qvAmount.replace(/,/g, '').trim());
    if (!Number.isFinite(amt) || amt <= 0) return;

    const lines =
      quickVoucherType === 'receipt'
        ? [
            { accountCode: qvCashBankCode, debit: amt, credit: 0, partyName: qvParty },
            { accountCode: qvCounterCode, debit: 0, credit: amt, partyName: qvParty },
          ]
        : quickVoucherType === 'payment'
        ? [
            { accountCode: qvCounterCode, debit: amt, credit: 0, partyName: qvParty },
            { accountCode: qvCashBankCode, debit: 0, credit: amt, partyName: qvParty },
          ]
        : [
            { accountCode: qvCounterCode, debit: amt, credit: 0 },
            { accountCode: qvCashBankCode, debit: 0, credit: amt },
          ];

    const res = addDoubleEntryVoucher({
      type: quickVoucherType,
      date: qvDate,
      narration: qvNarration || `${quickVoucherType.toUpperCase()} Voucher`,
      partyName: qvParty,
      lines,
    });
    if (res.ok) {
      setQuickVoucherType(null);
      setQvAmount('');
      setQvNarration('');
      setQvParty('');
    }
  };

  const filteredVouchers = useMemo(
    () => (typeFilter === 'all' ? vouchers : vouchers.filter((v) => v.type === typeFilter)),
    [vouchers, typeFilter]
  );

  const voucherColumns: DataTableColumn<LedgerVoucher>[] = [
    {
      key: 'voucherNo',
      header: 'Voucher # & Type',
      sortable: true,
      sortValue: (r) => r.voucherNo,
      render: (r) => (
        <div>
          <div className="flex items-center gap-1.5">
            <span className="font-mono font-bold text-[#006a4e] text-xs">{r.voucherNo}</span>
            <span className="px-1.5 py-0.2 rounded text-[9.5px] font-bold uppercase bg-slate-100 text-slate-700">
              {r.type}
            </span>
          </div>
          <span className="font-mono text-[10px] text-slate-400">{r.date}</span>
        </div>
      ),
    },
    {
      key: 'narration',
      header: 'Double-Entry Ledger Breakdown & Narration',
      render: (r) => (
        <div className="space-y-1">
          <div className="font-semibold text-slate-900 text-xs">{r.narration}</div>
          <div className="flex flex-wrap gap-1">
            {r.lines.map((l) => (
              <span
                key={l.id}
                className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-50 border border-slate-200 text-slate-700"
              >
                {l.debit > 0 ? `Dr ${l.accountCode} ৳${l.debit.toLocaleString()}` : `Cr ${l.accountCode} ৳${l.credit.toLocaleString()}`}
              </span>
            ))}
          </div>
        </div>
      ),
    },
    {
      key: 'amount',
      header: 'Amount (BDT)',
      align: 'right',
      sortable: true,
      sortValue: (r) => r.amount,
      render: (r) => (
        <span className="font-mono font-extrabold text-slate-900 text-xs">
          ৳ {r.amount.toLocaleString()}
        </span>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      align: 'center',
      render: (r) => (
        <span
          className={`px-2 py-0.5 rounded-[3px] text-[10.5px] font-bold border ${
            r.status === 'posted'
              ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
              : r.status === 'pending_approval'
              ? 'bg-amber-50 text-amber-700 border-amber-200'
              : r.status === 'reversed'
              ? 'bg-rose-50 text-rose-700 border-rose-200'
              : 'bg-slate-100 text-slate-600 border-slate-200'
          }`}
        >
          {r.isReversal ? 'Reversal' : r.status.replace('_', ' ').toUpperCase()}
        </span>
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      align: 'right',
      render: (r) => (
        <div className="inline-flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => setSelectedVoucher(r)}
            className="px-2.5 py-1 rounded-[3px] border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-[11px] font-semibold inline-flex items-center gap-1 cursor-pointer"
          >
            <Eye className="w-3 h-3" />
            <span>Inspect</span>
          </button>
          {(r.status === 'pending_approval' || r.status === 'draft') && (
            <button
              type="button"
              onClick={() => approveVoucher(r.id)}
              className="px-2.5 py-1 rounded-[3px] bg-[#006a4e] hover:bg-[#00553e] text-white text-[11px] font-semibold inline-flex items-center gap-1 cursor-pointer"
            >
              <Check className="w-3 h-3" />
              <span>Post</span>
            </button>
          )}
          {r.status === 'posted' && !r.isReversal && (
            <button
              type="button"
              onClick={() => {
                setReverseTarget(r);
                setReverseReason('');
              }}
              title="Reverse voucher"
              className="p-1.5 rounded-[3px] border border-slate-200 text-slate-500 hover:text-rose-600 hover:border-rose-300 cursor-pointer"
            >
              <RotateCcw className="w-3 h-3" />
            </button>
          )}
        </div>
      ),
    },
  ];

  // ===========================================================================
  // VIEW 1: DOUBLE-ENTRY JOURNAL VOUCHER CREATOR + LEDGER HISTORY
  // ===========================================================================
  if (viewMode === 'journal') {
    const journalList = vouchers.filter((v) => v.type === 'journal' || v.entryMethod === 'double');

    return (
      <div className="space-y-4 font-['Plus_Jakarta_Sans',sans-serif]">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div>
            <h1 className="text-lg md:text-xl font-bold text-slate-900 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-[#006a4e]" />
              <span>Double-Entry Journal Voucher (Debit = Credit)</span>
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Create multi-line balanced accounting adjustments, accruals, tax provisions, and inter-account transfers directly against Chart of Accounts.
            </p>
          </div>
          <div className="flex items-center gap-2">
            {journalTotals.balanced ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-[3px] bg-emerald-50 text-[#006a4e] border border-emerald-200 text-xs font-bold">
                <CheckCircle2 className="w-4 h-4" />
                Balanced (Dr = Cr: ৳{journalTotals.debit.toLocaleString()})
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-[3px] bg-amber-50 text-amber-800 border border-amber-200 text-xs font-bold">
                <AlertTriangle className="w-4 h-4" />
                Out of Balance: Diff ৳{Math.abs(journalTotals.diff).toLocaleString()}
              </span>
            )}
          </div>
        </div>

        {/* Double-Entry Journal Builder Surface */}
        <div className="bg-white border border-slate-300/80 rounded-[3px] shadow-xs overflow-hidden">
          <div className="px-4 py-3 bg-slate-50 border-b border-slate-200 grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
            <div>
              <label className="block font-bold text-slate-600 mb-1">Journal Date *</label>
              <input
                type="date"
                value={jDate}
                onChange={(e) => setJDate(e.target.value)}
                className="w-full h-8 px-2.5 bg-white border border-slate-300 rounded-[3px] font-mono focus:outline-hidden focus:border-[#006a4e]"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block font-bold text-slate-600 mb-1">Master Narration / Audit Justification *</label>
              <input
                type="text"
                value={jNarration}
                onChange={(e) => setJNarration(e.target.value)}
                placeholder="e.g. Monthly consultant honorarium accrual & 10% AIT withholding provision..."
                className="w-full h-8 px-3 bg-white border border-slate-300 rounded-[3px] focus:outline-hidden focus:border-[#006a4e]"
              />
            </div>
          </div>

          {jError && (
            <div className="mx-4 mt-3 p-2.5 bg-rose-50 border border-rose-200 rounded-[3px] text-xs text-rose-700 font-semibold">
              {jError}
            </div>
          )}

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left border-collapse">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 font-semibold">
                <tr>
                  <th className="py-2.5 px-3 w-10 text-center border-r border-slate-200/60">SL</th>
                  <th className="py-2.5 px-3 min-w-[240px] border-r border-slate-200/60">Chart of Accounts Head</th>
                  <th className="py-2.5 px-3 w-44 border-r border-slate-200/60">Party / Sub-Ledger</th>
                  <th className="py-2.5 px-3 w-36 text-right border-r border-slate-200/60">Debit (৳)</th>
                  <th className="py-2.5 px-3 w-36 text-right border-r border-slate-200/60">Credit (৳)</th>
                  <th className="py-2.5 px-3 min-w-[160px] border-r border-slate-200/60">Line Memo</th>
                  <th className="py-2.5 px-3 w-12 text-center">Del</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {jLines.map((line, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/60">
                    <td className="py-2 px-3 text-center font-mono text-slate-400 border-r border-slate-200/50">
                      {idx + 1}
                    </td>
                    <td className="py-2 px-2 border-r border-slate-200/50">
                      <select
                        value={line.accountCode}
                        onChange={(e) => updateJournalLine(idx, 'accountCode', e.target.value)}
                        className="w-full h-8 px-2 bg-white border border-slate-300 rounded-[3px] text-xs font-medium focus:outline-hidden focus:border-[#006a4e]"
                      >
                        {coaAccounts.map((acc) => (
                          <option key={acc.code} value={acc.code}>
                            {acc.code} — {acc.nameEn} ({acc.type.toUpperCase()})
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="py-2 px-2 border-r border-slate-200/50">
                      <select
                        value={line.partyName}
                        onChange={(e) => updateJournalLine(idx, 'partyName', e.target.value)}
                        className="w-full h-8 px-2 bg-white border border-slate-300 rounded-[3px] text-xs focus:outline-hidden focus:border-[#006a4e]"
                      >
                        <option value="">— Optional Party —</option>
                        {parties.map((p) => (
                          <option key={p.id} value={p.name}>
                            {p.name}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="py-2 px-2 border-r border-slate-200/50">
                      <input
                        type="number"
                        min="0"
                        step="1"
                        value={line.debit}
                        onChange={(e) => updateJournalLine(idx, 'debit', e.target.value)}
                        placeholder="0.00"
                        className="w-full h-8 px-2.5 bg-white border border-slate-300 rounded-[3px] font-mono font-bold text-right text-[#006a4e] focus:outline-hidden focus:border-[#006a4e]"
                      />
                    </td>
                    <td className="py-2 px-2 border-r border-slate-200/50">
                      <input
                        type="number"
                        min="0"
                        step="1"
                        value={line.credit}
                        onChange={(e) => updateJournalLine(idx, 'credit', e.target.value)}
                        placeholder="0.00"
                        className="w-full h-8 px-2.5 bg-white border border-slate-300 rounded-[3px] font-mono font-bold text-right text-rose-700 focus:outline-hidden focus:border-[#006a4e]"
                      />
                    </td>
                    <td className="py-2 px-2 border-r border-slate-200/50">
                      <input
                        type="text"
                        value={line.narration}
                        onChange={(e) => updateJournalLine(idx, 'narration', e.target.value)}
                        placeholder="Line detail..."
                        className="w-full h-8 px-2 bg-white border border-slate-300 rounded-[3px] text-xs focus:outline-hidden focus:border-[#006a4e]"
                      />
                    </td>
                    <td className="py-2 px-2 text-center">
                      <button
                        type="button"
                        disabled={jLines.length <= 2}
                        onClick={() => setJLines((prev) => prev.filter((_, i) => i !== idx))}
                        className="p-1.5 rounded text-slate-400 hover:text-rose-600 disabled:opacity-30 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="bg-slate-50 border-t border-slate-200 font-mono text-xs font-extrabold">
                <tr>
                  <td colSpan={3} className="py-2.5 px-3 text-right text-slate-700 border-r border-slate-200/60">
                    TOTAL DOUBLE-ENTRY BALANCE:
                  </td>
                  <td className="py-2.5 px-3 text-right text-[#006a4e] border-r border-slate-200/60">
                    ৳ {journalTotals.debit.toLocaleString()}
                  </td>
                  <td className="py-2.5 px-3 text-right text-rose-700 border-r border-slate-200/60">
                    ৳ {journalTotals.credit.toLocaleString()}
                  </td>
                  <td colSpan={2} className="py-2.5 px-3 text-slate-500 font-sans font-medium">
                    Diff: ৳{Math.abs(journalTotals.diff).toLocaleString()}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>

          <div className="px-4 py-3 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
            <button
              type="button"
              onClick={() =>
                setJLines((prev) => [
                  ...prev,
                  { accountCode: coaAccounts[0].code, partyName: '', debit: '', credit: '', narration: '' },
                ])
              }
              className="h-8 px-3 rounded-[3px] bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 text-xs font-semibold flex items-center gap-1 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Ledger Line</span>
            </button>

            <div className="flex items-center gap-2">
              <button
                type="button"
                disabled={!journalTotals.balanced || jNarration.trim().length < 3}
                onClick={() => handleSubmitJournal(true)}
                className="h-8 px-3.5 rounded-[3px] bg-white border border-slate-300 hover:bg-slate-100 disabled:opacity-40 text-slate-700 text-xs font-semibold cursor-pointer"
              >
                Save as Draft
              </button>
              <button
                type="button"
                disabled={!journalTotals.balanced || jNarration.trim().length < 3}
                onClick={() => handleSubmitJournal(false)}
                className="h-8 px-4 rounded-[3px] bg-[#006a4e] hover:bg-[#00553e] disabled:opacity-40 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Post Balanced Journal</span>
              </button>
            </div>
          </div>
        </div>

        {/* Recent Double-Entry Journal Vouchers */}
        <DataTable<LedgerVoucher>
          data={journalList}
          columns={voucherColumns}
          showSerial={true}
          searchPlaceholder="Search journal #, narration, or account code..."
          searchFilter={(r, q) =>
            r.voucherNo.toLowerCase().includes(q) ||
            r.narration.toLowerCase().includes(q) ||
            r.lines.some((l) => l.accountCode.toLowerCase().includes(q))
          }
        />
      </div>
    );
  }

  // ===========================================================================
  // VIEW 2: UNIFIED VOUCHERS HUB (RECEIPT / PAYMENT / CONTRA / EXPENSE)
  // ===========================================================================
  return (
    <div className="space-y-4 font-['Plus_Jakarta_Sans',sans-serif]">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div>
          <h1 className="text-lg md:text-xl font-bold text-slate-900 flex items-center gap-2">
            <ReceiptText className="w-5 h-5 text-[#006a4e]" />
            <span>Financial Vouchers Hub (Receipt, Payment & Contra)</span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Complete audit register of posted, pending approval, draft, and reversed vouchers with linked Double-Entry Dr/Cr ledger lines.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => {
              setQuickVoucherType('receipt');
              setQvCashBankCode('1010-01');
              setQvCounterCode('4010-01');
            }}
            className="h-8 px-3 rounded-[3px] bg-[#006a4e] hover:bg-[#00553e] text-white text-xs font-bold flex items-center gap-1 cursor-pointer shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Receipt Voucher</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setQuickVoucherType('payment');
              setQvCashBankCode('1020-01');
              setQvCounterCode('2010-01');
            }}
            className="h-8 px-3 rounded-[3px] bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold flex items-center gap-1 cursor-pointer shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Payment Voucher</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setQuickVoucherType('contra');
              setQvCashBankCode('1010-01');
              setQvCounterCode('1020-01');
            }}
            className="h-8 px-3 rounded-[3px] bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center gap-1 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Contra (Cash ↔ Bank)</span>
          </button>
        </div>
      </div>

      <DataTable<LedgerVoucher>
        data={filteredVouchers}
        columns={voucherColumns}
        showSerial={true}
        searchPlaceholder="Search voucher #, account code, narration..."
        searchFilter={(r, q) =>
          r.voucherNo.toLowerCase().includes(q) ||
          r.narration.toLowerCase().includes(q) ||
          r.lines.some((l) => l.accountCode.toLowerCase().includes(q))
        }
        toolbarFilters={
          <div className="flex items-center gap-1.5 flex-wrap">
            {[
              { id: 'all', label: 'All Types' },
              { id: 'income', label: 'Income' },
              { id: 'expense', label: 'Expense' },
              { id: 'receipt', label: 'Receipt' },
              { id: 'payment', label: 'Payment' },
              { id: 'contra', label: 'Contra' },
              { id: 'journal', label: 'Journal' },
            ].map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setTypeFilter(t.id)}
                className={`px-2.5 py-1 rounded-[3px] text-[11px] font-semibold cursor-pointer border transition-colors ${
                  typeFilter === t.id
                    ? 'bg-[#006a4e] text-white border-[#006a4e]'
                    : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        }
      />

      {/* Receipt / Payment / Contra Creation Modal */}
      {quickVoucherType && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <form
            onSubmit={handleQuickVoucherSubmit}
            className="bg-white rounded-[4px] border border-slate-200 max-w-lg w-full shadow-2xl overflow-hidden"
          >
            <div className="px-5 py-3.5 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
              <h3 className="font-bold text-slate-900 text-sm capitalize">
                New Double-Entry {quickVoucherType} Voucher
              </h3>
              <button
                type="button"
                onClick={() => setQuickVoucherType(null)}
                className="p-1 text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-5 space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Voucher Date *</label>
                  <input
                    type="date"
                    required
                    value={qvDate}
                    onChange={(e) => setQvDate(e.target.value)}
                    className="w-full h-8 px-2.5 border border-slate-300 rounded-[3px] font-mono"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Amount (BDT ৳) *</label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={qvAmount}
                    onChange={(e) => setQvAmount(e.target.value)}
                    placeholder="0.00"
                    className="w-full h-8 px-2.5 border border-slate-300 rounded-[3px] font-mono font-bold"
                  />
                </div>
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  {quickVoucherType === 'receipt'
                    ? 'Deposit Into (Debit Cash / Bank)'
                    : quickVoucherType === 'payment'
                    ? 'Paid From (Credit Cash / Bank)'
                    : 'Source Account (Credit)'}
                </label>
                <select
                  value={qvCashBankCode}
                  onChange={(e) => setQvCashBankCode(e.target.value)}
                  className="w-full h-8 px-2.5 border border-slate-300 rounded-[3px] bg-white"
                >
                  {cashBankAccounts.map((a) => (
                    <option key={a.code} value={a.code}>
                      {a.code} — {a.nameEn}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  {quickVoucherType === 'receipt'
                    ? 'Counter Account (Credit Revenue / Receivable)'
                    : quickVoucherType === 'payment'
                    ? 'Counter Account (Debit Expense / Payable)'
                    : 'Destination Account (Debit)'}
                </label>
                <select
                  value={qvCounterCode}
                  onChange={(e) => setQvCounterCode(e.target.value)}
                  className="w-full h-8 px-2.5 border border-slate-300 rounded-[3px] bg-white"
                >
                  {counterAccounts.map((a) => (
                    <option key={a.code} value={a.code}>
                      {a.code} — {a.nameEn}
                    </option>
                  ))}
                </select>
              </div>
              {quickVoucherType !== 'contra' && (
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Party / Reference</label>
                  <input
                    type="text"
                    value={qvParty}
                    onChange={(e) => setQvParty(e.target.value)}
                    placeholder="Optional supplier / corporate patient"
                    className="w-full h-8 px-2.5 border border-slate-300 rounded-[3px]"
                  />
                </div>
              )}
              <div>
                <label className="block font-bold text-slate-700 mb-1">Narration *</label>
                <textarea
                  rows={2}
                  required
                  value={qvNarration}
                  onChange={(e) => setQvNarration(e.target.value)}
                  placeholder="Voucher narration / cheque # / reference..."
                  className="w-full p-2 border border-slate-300 rounded-[3px]"
                />
              </div>
            </div>
            <div className="px-5 py-3 bg-slate-50 border-t border-slate-200 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setQuickVoucherType(null)}
                className="h-8 px-3 rounded-[3px] border border-slate-300 text-xs font-semibold text-slate-700 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="h-8 px-4 rounded-[3px] bg-[#006a4e] hover:bg-[#00553e] text-white text-xs font-bold cursor-pointer"
              >
                Post Voucher
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Inspect Voucher Statement Modal */}
      {selectedVoucher && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-[4px] border border-slate-200 max-w-2xl w-full shadow-2xl overflow-hidden">
            <div className="px-5 py-3.5 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-slate-900 text-sm">
                  Voucher #{selectedVoucher.voucherNo} ({selectedVoucher.type.toUpperCase()})
                </h3>
                <p className="text-[11px] text-slate-500 font-mono">
                  Date: {selectedVoucher.date} · Created by: {selectedVoucher.createdBy}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    window.print();
                    notify(`Sent ${selectedVoucher.voucherNo} to print spooler.`);
                  }}
                  className="h-7 px-2.5 rounded-[3px] border border-slate-300 bg-white hover:bg-slate-100 text-xs font-semibold flex items-center gap-1 cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print</span>
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedVoucher(null)}
                  className="p-1 text-slate-400 hover:text-slate-700 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
            <div className="p-5 space-y-4 text-xs">
              <div className="bg-slate-50 p-3 rounded-[3px] border border-slate-200">
                <span className="font-bold text-slate-700 block">Narration:</span>
                <p className="text-slate-800 mt-0.5">{selectedVoucher.narration}</p>
              </div>
              <table className="w-full text-left border border-slate-200 border-collapse">
                <thead className="bg-slate-100 text-slate-700 font-bold text-[11px]">
                  <tr>
                    <th className="py-2 px-3 border-r border-slate-200">Account Code</th>
                    <th className="py-2 px-3 border-r border-slate-200">Ledger Head</th>
                    <th className="py-2 px-3 text-right border-r border-slate-200">Debit (৳)</th>
                    <th className="py-2 px-3 text-right">Credit (৳)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 font-mono">
                  {selectedVoucher.lines.map((l) => (
                    <tr key={l.id}>
                      <td className="py-2 px-3 font-bold text-[#006a4e] border-r border-slate-200">
                        {l.accountCode}
                      </td>
                      <td className="py-2 px-3 font-sans text-slate-800 border-r border-slate-200">
                        {l.accountNameEn}
                      </td>
                      <td className="py-2 px-3 text-right font-bold text-slate-900 border-r border-slate-200">
                        {l.debit > 0 ? l.debit.toLocaleString() : '—'}
                      </td>
                      <td className="py-2 px-3 text-right font-bold text-slate-900">
                        {l.credit > 0 ? l.credit.toLocaleString() : '—'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Reversal Modal */}
      {reverseTarget && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (reverseReason.trim().length < 4) return;
              reverseVoucher(reverseTarget.id, reverseReason);
              setReverseTarget(null);
            }}
            className="bg-white rounded-[4px] border border-rose-200 max-w-md w-full shadow-2xl overflow-hidden"
          >
            <div className="px-5 py-3 bg-rose-50 border-b border-rose-200 flex items-center justify-between">
              <h3 className="font-bold text-rose-900 text-sm">Reverse Voucher {reverseTarget.voucherNo}</h3>
              <button
                type="button"
                onClick={() => setReverseTarget(null)}
                className="p-1 text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-5 space-y-3 text-xs">
              <p className="text-slate-600">
                Creates an audit-linked reversal voucher swapping all Debit & Credit lines.
              </p>
              <textarea
                required
                minLength={4}
                rows={2}
                value={reverseReason}
                onChange={(e) => setReverseReason(e.target.value)}
                placeholder="Reason for reversal..."
                className="w-full p-2 border border-slate-300 rounded-[3px]"
              />
            </div>
            <div className="px-5 py-3 bg-slate-50 border-t border-slate-200 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setReverseTarget(null)}
                className="h-8 px-3 rounded-[3px] border border-slate-300 text-xs font-semibold cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="h-8 px-4 rounded-[3px] bg-rose-600 text-white text-xs font-bold cursor-pointer"
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

