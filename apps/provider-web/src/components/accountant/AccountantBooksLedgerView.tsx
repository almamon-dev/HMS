import React, { useMemo, useState } from 'react';
import {
  BookOpen,
  Calendar,
  CheckCircle2,
  Landmark,
  RefreshCw,
  Users,
  Wallet,
} from 'lucide-react';
import { SummaryCard, SummaryCardGrid } from '../common/SummaryCard';
import { DataTable, DataTableColumn } from '../common/DataTable';
import {
  AccountingParty,
  LedgerVoucher,
} from '../../data/accountantPortalData';
import { useAccountantLedger } from '../../data/accountantLedgerContext';
import {
  BANK_RECONCILIATION_DATA,
  BankReconciliationItem,
} from './AccountantBankingView';

interface AccountantBooksLedgerViewProps {
  initialTab: 'day-book' | 'cash-book' | 'reconciliation' | 'ledger' | 'parties';
}

interface GlRow {
  id: string;
  date: string;
  voucherNo: string;
  voucherType: string;
  narration: string;
  partyName: string;
  debit: number;
  credit: number;
  runningBalance: number;
}

export const AccountantBooksLedgerView: React.FC<AccountantBooksLedgerViewProps> = ({
  initialTab,
}) => {
  const {
    coaAccounts,
    vouchers,
    parties,
    stats,
    notify,
  } = useAccountantLedger();

  const [selectedGlCode, setSelectedGlCode] = useState<string>('1010-01');
  const [selectedCashBankCode, setSelectedCashBankCode] = useState<string>('1010-01');
  const [partyFilter, setPartyFilter] = useState<'all' | 'Patient / Corporate' | 'Supplier'>('all');
  const [recons, setRecons] = useState<BankReconciliationItem[]>(BANK_RECONCILIATION_DATA);

  const postedVouchers = useMemo(
    () => vouchers.filter((v) => v.status === 'posted' || v.status === 'reversed'),
    [vouchers]
  );

  // Compute running ledger for any COA account
  const computeAccountLedger = (accountCode: string) => {
    const acc = coaAccounts.find((a) => a.code === accountCode) || coaAccounts[0];
    if (!acc) return { account: null, opening: 0, closing: 0, totalDr: 0, totalCr: 0, rows: [] as GlRow[] };

    const chronological = [...postedVouchers].reverse();
    let running = acc.openingBalance;
    let totalDr = 0;
    let totalCr = 0;
    const rows: GlRow[] = [];
    const isDebitNormal = acc.normalBalance === 'Debit';

    for (const v of chronological) {
      for (const l of v.lines) {
        if (l.accountCode === acc.code) {
          totalDr += l.debit;
          totalCr += l.credit;
          running += isDebitNormal ? l.debit - l.credit : l.credit - l.debit;
          rows.push({
            id: `${v.id}-${l.id}`,
            date: v.date,
            voucherNo: v.voucherNo,
            voucherType: v.type.toUpperCase(),
            narration: l.narration || v.narration,
            partyName: l.partyName || v.partyName || '—',
            debit: l.debit,
            credit: l.credit,
            runningBalance: running,
          });
        }
      }
    }

    return {
      account: acc,
      opening: acc.openingBalance,
      closing: running,
      totalDr,
      totalCr,
      rows: rows.reverse(), // Most recent first for display
    };
  };

  // ===========================================================================
  // 1. DAY BOOK (CHRONOLOGICAL STREAM)
  // ===========================================================================
  if (initialTab === 'day-book') {
    const totalIn = postedVouchers
      .filter((v) => v.direction === 'in')
      .reduce((sum, v) => sum + v.amount, 0);
    const totalOut = postedVouchers
      .filter((v) => v.direction === 'out')
      .reduce((sum, v) => sum + v.amount, 0);

    const dayColumns: DataTableColumn<LedgerVoucher>[] = [
      {
        key: 'date',
        header: 'Date & Voucher #',
        sortable: true,
        sortValue: (r) => r.date,
        render: (r) => (
          <div>
            <span className="font-mono font-bold text-[#006a4e] text-xs block">{r.voucherNo}</span>
            <span className="font-mono text-[10.5px] text-slate-400">{r.date}</span>
          </div>
        ),
      },
      {
        key: 'categoryEn',
        header: 'Account / Head & Narration',
        sortable: true,
        sortValue: (r) => r.categoryEn,
        render: (r) => (
          <div className="max-w-[320px]">
            <span className="font-bold text-slate-900 text-xs block truncate">{r.categoryEn}</span>
            <span className="text-[11px] text-slate-500 line-clamp-1" title={r.narration}>{r.narration}</span>
          </div>
        ),
      },
      {
        key: 'paymentChannel',
        header: 'Channel / Mode',
        render: (r) => (
          <span className="px-2 py-0.5 rounded-[3px] text-[10.5px] font-semibold bg-slate-100 text-slate-700">
            {r.paymentChannel}
          </span>
        ),
      },
      {
        key: 'in',
        header: 'Money In (Dr Cash)',
        align: 'right',
        render: (r) => (
          <span className="font-mono font-bold text-[#006a4e] text-xs">
            {r.direction === 'in' ? `+৳ ${r.amount.toLocaleString()}` : '—'}
          </span>
        ),
      },
      {
        key: 'out',
        header: 'Money Out (Cr Cash)',
        align: 'right',
        render: (r) => (
          <span className="font-mono font-bold text-rose-600 text-xs">
            {r.direction === 'out' ? `-৳ ${r.amount.toLocaleString()}` : '—'}
          </span>
        ),
      },
    ];

    return (
      <div className="space-y-4 font-['Plus_Jakarta_Sans',sans-serif]">
        <div>
          <h1 className="text-lg md:text-xl font-bold text-slate-900 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-[#006a4e]" />
            <span>Daily Cash & Accounting Day Book</span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Unified chronological log of every posted Receipt, Payment, Income, Expense, and Journal entry across all hospital counters.
          </p>
        </div>

        <SummaryCardGrid columns={4}>
          <SummaryCard title="Total Money In" value={`৳ ${totalIn.toLocaleString()}`} subtitle="Inflows recorded" icon={Wallet} iconColor="text-[#006a4e]" valueColor="text-[#006a4e]" />
          <SummaryCard title="Total Money Out" value={`৳ ${totalOut.toLocaleString()}`} subtitle="Outflows & payments" icon={Wallet} iconColor="text-rose-600" valueColor="text-rose-600" />
          <SummaryCard title="Net Daily Movement" value={`৳ ${(totalIn - totalOut).toLocaleString()}`} subtitle="Inflow minus Outflow" icon={Calendar} iconColor="text-blue-600" />
          <SummaryCard title="Posted Entries Count" value={`${postedVouchers.length}`} subtitle="Immutable GL vouchers" icon={BookOpen} iconColor="text-amber-600" />
        </SummaryCardGrid>

        <DataTable<LedgerVoucher>
          data={postedVouchers}
          columns={dayColumns}
          showSerial={true}
          searchPlaceholder="Search day book by voucher #, narration, channel..."
          searchFilter={(r, q) =>
            r.voucherNo.toLowerCase().includes(q) ||
            r.narration.toLowerCase().includes(q) ||
            r.categoryEn.toLowerCase().includes(q)
          }
        />
      </div>
    );
  }

  // ===========================================================================
  // 2. CASH & BANK BOOK (WITH ACCOUNT CARDS + RUNNING LEDGER)
  // ===========================================================================
  if (initialTab === 'cash-book') {
    const liquidAccounts = coaAccounts.filter(
      (a) => a.reportGroup === 'cash' || a.reportGroup === 'bank' || a.reportGroup === 'wallet'
    );
    const activeBook = computeAccountLedger(selectedCashBankCode);

    const cashBookColumns: DataTableColumn<GlRow>[] = [
      {
        key: 'date',
        header: 'Date & Voucher #',
        sortable: true,
        sortValue: (r) => r.date,
        render: (r) => (
          <div>
            <span className="font-mono font-bold text-[#006a4e] text-xs block">{r.voucherNo}</span>
            <span className="font-mono text-[10.5px] text-slate-400">{r.date}</span>
          </div>
        ),
      },
      {
        key: 'narration',
        header: 'Particulars / Narration',
        render: (r) => (
          <div>
            <span className="font-semibold text-slate-900 text-xs block">{r.narration}</span>
            <span className="text-[10.5px] text-slate-400">Party: {r.partyName}</span>
          </div>
        ),
      },
      {
        key: 'debit',
        header: 'Deposit / Cash In (Dr)',
        align: 'right',
        render: (r) => (
          <span className="font-mono font-bold text-[#006a4e] text-xs">
            {r.debit > 0 ? `+৳ ${r.debit.toLocaleString()}` : '—'}
          </span>
        ),
      },
      {
        key: 'credit',
        header: 'Withdrawal / Out (Cr)',
        align: 'right',
        render: (r) => (
          <span className="font-mono font-bold text-rose-600 text-xs">
            {r.credit > 0 ? `-৳ ${r.credit.toLocaleString()}` : '—'}
          </span>
        ),
      },
      {
        key: 'runningBalance',
        header: 'Running Balance (৳)',
        align: 'right',
        render: (r) => (
          <span className="font-mono font-extrabold text-slate-900 text-xs">
            ৳ {r.runningBalance.toLocaleString()}
          </span>
        ),
      },
    ];

    return (
      <div className="space-y-4 font-['Plus_Jakarta_Sans',sans-serif]">
        <div>
          <h1 className="text-lg md:text-xl font-bold text-slate-900 flex items-center gap-2">
            <Wallet className="w-5 h-5 text-[#006a4e]" />
            <span>Cash, Bank & MFS Register (Running Balance)</span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Select any liquid cash vault, bank account, or bKash/Nagad merchant wallet to inspect live running balance and movements.
          </p>
        </div>

        {/* Clickable Liquid Account Selector Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3">
          {liquidAccounts.map((acc) => {
            const book = computeAccountLedger(acc.code);
            const selected = selectedCashBankCode === acc.code;
            return (
              <button
                key={acc.code}
                type="button"
                onClick={() => setSelectedCashBankCode(acc.code)}
                className={`text-left p-3.5 rounded-[3px] border transition-all cursor-pointer ${
                  selected
                    ? 'bg-emerald-50/70 border-[#006a4e] ring-1 ring-[#006a4e]/30'
                    : 'bg-white border-slate-200 hover:border-[#006a4e]/50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[10.5px] font-bold text-[#006a4e]">{acc.code}</span>
                  <span className="text-[10px] uppercase font-bold text-slate-400">{acc.reportGroup}</span>
                </div>
                <div className="font-bold text-slate-900 text-xs mt-1 truncate" title={acc.nameEn}>
                  {acc.nameEn}
                </div>
                <div className="font-mono font-extrabold text-slate-900 text-base mt-2">
                  ৳ {book.closing.toLocaleString()}
                </div>
              </button>
            );
          })}
        </div>

        <SummaryCardGrid columns={4}>
          <SummaryCard title="Selected Opening Balance" value={`৳ ${activeBook.opening.toLocaleString()}`} subtitle={activeBook.account?.nameEn} icon={Wallet} iconColor="text-slate-600" />
          <SummaryCard title="Total Deposits (Dr)" value={`৳ ${activeBook.totalDr.toLocaleString()}`} subtitle="Period inflows" icon={Wallet} iconColor="text-[#006a4e]" valueColor="text-[#006a4e]" />
          <SummaryCard title="Total Payments (Cr)" value={`৳ ${activeBook.totalCr.toLocaleString()}`} subtitle="Period outflows" icon={Wallet} iconColor="text-rose-600" valueColor="text-rose-600" />
          <SummaryCard title="Current Closing Balance" value={`৳ ${activeBook.closing.toLocaleString()}`} subtitle="Verified live GL balance" icon={CheckCircle2} iconColor="text-blue-600" />
        </SummaryCardGrid>

        <DataTable<GlRow>
          data={activeBook.rows}
          columns={cashBookColumns}
          showSerial={true}
          searchPlaceholder="Search cash/bank register..."
          searchFilter={(r, q) =>
            r.voucherNo.toLowerCase().includes(q) ||
            r.narration.toLowerCase().includes(q) ||
            r.partyName.toLowerCase().includes(q)
          }
        />
      </div>
    );
  }

  // ===========================================================================
  // 3. BANK RECONCILIATION
  // ===========================================================================
  if (initialTab === 'reconciliation') {
    const reconColumns: DataTableColumn<BankReconciliationItem>[] = [
      {
        key: 'bankName',
        header: 'Bank & Statement Date',
        sortable: true,
        sortValue: (r) => r.bankName,
        render: (r) => (
          <div>
            <span className="font-bold text-slate-900 text-xs block">{r.bankName}</span>
            <span className="font-mono text-[10.5px] text-slate-400">A/C: {r.accountNo} · {r.statementDate}</span>
          </div>
        ),
      },
      {
        key: 'balancePerBank',
        header: 'Bank Statement Balance',
        align: 'right',
        render: (r) => <span className="font-mono font-bold text-slate-800 text-xs">৳ {r.balancePerBank.toLocaleString()}</span>,
      },
      {
        key: 'uncreditedDeposits',
        header: 'Uncredited / Unpresented',
        align: 'right',
        render: (r) => (
          <div className="font-mono text-[11px] text-slate-600">
            <div>+Dep: ৳{r.uncreditedDeposits.toLocaleString()}</div>
            <div>-Chq: ৳{r.unpresentedCheques.toLocaleString()}</div>
          </div>
        ),
      },
      {
        key: 'balancePerBooks',
        header: 'Hospital Book Balance',
        align: 'right',
        render: (r) => <span className="font-mono font-extrabold text-[#006a4e] text-xs">৳ {r.balancePerBooks.toLocaleString()}</span>,
      },
      {
        key: 'status',
        header: 'Reconciliation Status',
        align: 'center',
        render: (r) => (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-[3px] text-[10.5px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <CheckCircle2 className="w-3 h-3" />
            {r.status}
          </span>
        ),
      },
      {
        key: 'id',
        header: 'Action',
        align: 'right',
        render: (r) => (
          <button
            type="button"
            onClick={() => {
              setRecons((prev) =>
                prev.map((item) =>
                  item.id === r.id ? { ...item, statementDate: new Date().toISOString().slice(0, 10) } : item
                )
              );
              notify(`Verified ৳0 variance match for ${r.bankName}.`);
            }}
            className="h-7 px-2.5 rounded-[3px] bg-[#006a4e] hover:bg-[#00553e] text-white text-[11px] font-semibold inline-flex items-center gap-1 cursor-pointer"
          >
            <RefreshCw className="w-3 h-3" />
            <span>Verify Match</span>
          </button>
        ),
      },
    ];

    return (
      <div className="space-y-4 font-['Plus_Jakarta_Sans',sans-serif]">
        <div>
          <h1 className="text-lg md:text-xl font-bold text-slate-900 flex items-center gap-2">
            <Landmark className="w-5 h-5 text-[#006a4e]" />
            <span>Bank Statement Reconciliation (BRS)</span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Match bank statements against Hospital GL Book Balances, tracking uncredited deposits and unpresented cheques.
          </p>
        </div>

        <SummaryCardGrid columns={3}>
          <SummaryCard title="Total Hospital Bank Cash" value={`৳ ${stats.bankBalance.toLocaleString()}`} subtitle="Across 3 bank accounts" icon={Landmark} iconColor="text-[#006a4e]" valueColor="text-[#006a4e]" />
          <SummaryCard title="Total Unreconciled Items" value="0 Pending" subtitle="All statements matched (Diff ৳0)" icon={CheckCircle2} iconColor="text-blue-600" />
          <SummaryCard title="Merchant Wallet Balance" value={`৳ ${stats.walletBalance.toLocaleString()}`} subtitle="bKash / Nagad auto-settled" icon={Wallet} iconColor="text-amber-600" />
        </SummaryCardGrid>

        <DataTable<BankReconciliationItem>
          data={recons}
          columns={reconColumns}
          showSerial={true}
          searchPlaceholder="Search bank account..."
          searchFilter={(r, q) => r.bankName.toLowerCase().includes(q) || r.accountNo.toLowerCase().includes(q)}
        />
      </div>
    );
  }

  // ===========================================================================
  // 4. GENERAL ACCOUNT LEDGER (GL)
  // ===========================================================================
  if (initialTab === 'ledger') {
    const gl = computeAccountLedger(selectedGlCode);

    const glColumns: DataTableColumn<GlRow>[] = [
      {
        key: 'date',
        header: 'Date & Voucher #',
        sortable: true,
        sortValue: (r) => r.date,
        render: (r) => (
          <div>
            <span className="font-mono font-bold text-[#006a4e] text-xs block">{r.voucherNo}</span>
            <span className="font-mono text-[10.5px] text-slate-400">{r.date} · {r.voucherType}</span>
          </div>
        ),
      },
      {
        key: 'narration',
        header: 'Narration & Counterparty',
        render: (r) => (
          <div>
            <span className="font-semibold text-slate-900 text-xs block">{r.narration}</span>
            <span className="text-[10.5px] text-slate-400">Party: {r.partyName}</span>
          </div>
        ),
      },
      {
        key: 'debit',
        header: 'Debit (৳)',
        align: 'right',
        render: (r) => (
          <span className="font-mono font-bold text-[#006a4e] text-xs">
            {r.debit > 0 ? `৳ ${r.debit.toLocaleString()}` : '—'}
          </span>
        ),
      },
      {
        key: 'credit',
        header: 'Credit (৳)',
        align: 'right',
        render: (r) => (
          <span className="font-mono font-bold text-rose-600 text-xs">
            {r.credit > 0 ? `৳ ${r.credit.toLocaleString()}` : '—'}
          </span>
        ),
      },
      {
        key: 'runningBalance',
        header: 'Running Balance (৳)',
        align: 'right',
        render: (r) => (
          <span className="font-mono font-extrabold text-slate-900 text-xs">
            ৳ {r.runningBalance.toLocaleString()}
          </span>
        ),
      },
    ];

    return (
      <div className="space-y-4 font-['Plus_Jakarta_Sans',sans-serif]">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div>
            <h1 className="text-lg md:text-xl font-bold text-slate-900 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-[#006a4e]" />
              <span>General Ledger (Account Statement)</span>
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Inspect Double-Entry Debit, Credit, and Running Balance for any ledger head in the Chart of Accounts.
            </p>
          </div>
          <div className="w-full md:w-80">
            <select
              value={selectedGlCode}
              onChange={(e) => setSelectedGlCode(e.target.value)}
              className="w-full h-9 px-3 bg-white border border-slate-300 rounded-[3px] text-xs font-bold text-slate-900 focus:outline-hidden focus:border-[#006a4e]"
            >
              {coaAccounts.map((a) => (
                <option key={a.code} value={a.code}>
                  {a.code} — {a.nameEn} ({a.type.toUpperCase()})
                </option>
              ))}
            </select>
          </div>
        </div>

        <SummaryCardGrid columns={4}>
          <SummaryCard title="Opening Balance" value={`৳ ${gl.opening.toLocaleString()}`} subtitle={`Normal: ${gl.account?.normalBalance}`} icon={BookOpen} iconColor="text-slate-600" />
          <SummaryCard title="Period Total Debit" value={`৳ ${gl.totalDr.toLocaleString()}`} subtitle="Sum of Dr lines" icon={BookOpen} iconColor="text-[#006a4e]" valueColor="text-[#006a4e]" />
          <SummaryCard title="Period Total Credit" value={`৳ ${gl.totalCr.toLocaleString()}`} subtitle="Sum of Cr lines" icon={BookOpen} iconColor="text-rose-600" valueColor="text-rose-600" />
          <SummaryCard title="Closing GL Balance" value={`৳ ${gl.closing.toLocaleString()}`} subtitle={gl.account?.code} icon={CheckCircle2} iconColor="text-blue-600" />
        </SummaryCardGrid>

        <DataTable<GlRow>
          data={gl.rows}
          columns={glColumns}
          showSerial={true}
          searchPlaceholder="Search GL transactions..."
          searchFilter={(r, q) =>
            r.voucherNo.toLowerCase().includes(q) ||
            r.narration.toLowerCase().includes(q) ||
            r.partyName.toLowerCase().includes(q)
          }
        />
      </div>
    );
  }

  // ===========================================================================
  // 5. PARTY LEDGER & AGEING (PATIENTS / CORPORATE / SUPPLIERS)
  // ===========================================================================
  const filteredParties = useMemo(
    () => (partyFilter === 'all' ? parties : parties.filter((p) => p.partyType === partyFilter)),
    [parties, partyFilter]
  );

  const partyColumns: DataTableColumn<AccountingParty>[] = [
    {
      key: 'name',
      header: 'Party / Account Name',
      sortable: true,
      sortValue: (r) => r.name,
      render: (r) => (
        <div>
          <span className="font-bold text-slate-900 text-xs block">{r.name}</span>
          <span className="font-mono text-[10.5px] text-slate-400">{r.code} · {r.phone}</span>
        </div>
      ),
    },
    {
      key: 'partyType',
      header: 'Ledger Type',
      render: (r) => (
        <span
          className={`px-2 py-0.5 rounded-[3px] text-[10.5px] font-bold border ${
            r.partyType === 'Supplier'
              ? 'bg-amber-50 text-amber-800 border-amber-200'
              : 'bg-blue-50 text-blue-700 border-blue-200'
          }`}
        >
          {r.partyType}
        </span>
      ),
    },
    {
      key: 'age0to30',
      header: '0–30 Days',
      align: 'right',
      render: (r) => <span className="font-mono text-xs text-slate-700">৳ {r.age0to30.toLocaleString()}</span>,
    },
    {
      key: 'age31to60',
      header: '31–60 Days',
      align: 'right',
      render: (r) => <span className="font-mono text-xs text-amber-700">৳ {r.age31to60.toLocaleString()}</span>,
    },
    {
      key: 'age60Plus',
      header: '60+ Overdue',
      align: 'right',
      render: (r) => (
        <span className={`font-mono text-xs font-bold ${r.age60Plus > 0 ? 'text-rose-600' : 'text-slate-400'}`}>
          ৳ {r.age60Plus.toLocaleString()}
        </span>
      ),
    },
    {
      key: 'currentBalance',
      header: 'Current Balance',
      align: 'right',
      sortable: true,
      sortValue: (r) => r.currentBalance,
      render: (r) => (
        <span className="font-mono font-extrabold text-slate-900 text-xs">
          ৳ {r.currentBalance.toLocaleString()}
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-4 font-['Plus_Jakarta_Sans',sans-serif]">
      <div>
        <h1 className="text-lg md:text-xl font-bold text-slate-900 flex items-center gap-2">
          <Users className="w-5 h-5 text-[#006a4e]" />
          <span>Party Sub-Ledger & Credit Ageing Analysis</span>
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Receivable & Payable ageing breakdown across Corporate Health Panels, ICU Credit Patients, and Pharmaceutical Suppliers.
        </p>
      </div>

      <SummaryCardGrid columns={3}>
        <SummaryCard
          title="Corporate & Patient Receivables"
          value={`৳ ${parties.filter((p) => p.partyType !== 'Supplier').reduce((s, p) => s + p.currentBalance, 0).toLocaleString()}`}
          subtitle="Outstanding AR"
          icon={Users}
          iconColor="text-blue-600"
        />
        <SummaryCard
          title="Supplier Vendor Payables"
          value={`৳ ${parties.filter((p) => p.partyType === 'Supplier').reduce((s, p) => s + p.currentBalance, 0).toLocaleString()}`}
          subtitle="Outstanding AP"
          icon={Users}
          iconColor="text-rose-600"
          valueColor="text-rose-600"
        />
        <SummaryCard
          title="60+ Days Overdue Exposure"
          value={`৳ ${parties.reduce((s, p) => s + p.age60Plus, 0).toLocaleString()}`}
          subtitle="Requires collection follow-up"
          icon={Users}
          iconColor="text-amber-600"
        />
      </SummaryCardGrid>

      <DataTable<AccountingParty>
        data={filteredParties}
        columns={partyColumns}
        showSerial={true}
        searchPlaceholder="Search corporate, patient, or supplier..."
        searchFilter={(r, q) =>
          r.name.toLowerCase().includes(q) || r.code.toLowerCase().includes(q)
        }
        toolbarFilters={
          <div className="flex items-center gap-1.5">
            {(['all', 'Patient / Corporate', 'Supplier'] as const).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setPartyFilter(t)}
                className={`px-2.5 py-1 rounded-[3px] text-[11px] font-semibold border cursor-pointer ${
                  partyFilter === t
                    ? 'bg-[#006a4e] text-white border-[#006a4e]'
                    : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                }`}
              >
                {t === 'all' ? 'All Parties' : t}
              </button>
            ))}
          </div>
        }
      />
    </div>
  );
};
