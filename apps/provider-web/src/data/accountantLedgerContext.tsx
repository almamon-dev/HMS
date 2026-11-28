import React, { createContext, useContext, useMemo, useState } from 'react';
import {
  AccountingMode,
  AccountingParty,
  AccountingSettingsState,
  CoaAccount,
  CoaAccountType,
  CoaReportGroup,
  CURRENT_ACCOUNTANT,
  DEFAULT_ACCOUNTING_SETTINGS,
  FiscalPeriod,
  INITIAL_ACCOUNTING_PARTIES,
  INITIAL_COA_ACCOUNTS,
  INITIAL_FISCAL_PERIODS,
  INITIAL_LEDGER_VOUCHERS,
  LedgerVoucher,
  LedgerVoucherLine,
  SIMPLE_ENTRY_CATEGORIES,
} from './accountantPortalData';

export interface SingleEntryInput {
  kind: 'income' | 'expense';
  categoryId: string;
  amount: number;
  paymentChannel: 'Cash' | 'Bank' | 'bKash / Nagad';
  date: string;
  partyName?: string;
  narration: string;
  branchName?: string;
}

export interface MultiEntryRowInput {
  kind: 'income' | 'expense';
  categoryId: string;
  amount: number;
  paymentChannel: 'Cash' | 'Bank' | 'bKash / Nagad';
  partyName?: string;
  narration: string;
}

export interface DoubleEntryLineInput {
  accountCode: string;
  partyName?: string;
  debit: number;
  credit: number;
  narration?: string;
}

export interface DoubleEntryVoucherInput {
  type: 'journal' | 'receipt' | 'payment' | 'contra';
  date: string;
  narration: string;
  partyName?: string;
  branchName?: string;
  saveAsDraft?: boolean;
  lines: DoubleEntryLineInput[];
}

export interface TrialBalanceRow {
  account: CoaAccount;
  openingDebit: number;
  openingCredit: number;
  periodDebit: number;
  periodCredit: number;
  closingDebit: number;
  closingCredit: number;
}

export interface ComputedAccountingStats {
  cashInHand: number;
  bankBalance: number;
  walletBalance: number;
  totalCashAndBank: number;
  totalReceivables: number;
  totalPayables: number;
  periodIncome: number;
  periodCogs: number;
  grossProfit: number;
  periodOperatingExpense: number;
  netProfit: number;
  totalAssets: number;
  totalLiabilities: number;
  totalEquity: number;
  balanceSheetBalanced: boolean;
  balanceSheetDiff: number;
  trialBalanceRows: TrialBalanceRow[];
  trialTotals: {
    openingDebit: number;
    openingCredit: number;
    periodDebit: number;
    periodCredit: number;
    closingDebit: number;
    closingCredit: number;
  };
  trialBalanced: boolean;
  pendingApprovalCount: number;
  draftCount: number;
}

interface AccountantLedgerContextValue {
  settings: AccountingSettingsState;
  mode: AccountingMode;
  setMode: (mode: AccountingMode) => void;
  updateSettings: (next: Partial<AccountingSettingsState>) => void;
  coaAccounts: CoaAccount[];
  addCoaAccount: (input: {
    code: string;
    nameEn: string;
    nameBn: string;
    type: CoaAccountType;
    reportGroup: CoaReportGroup;
    isContra?: boolean;
    openingBalance?: number;
  }) => { ok: boolean; error?: string };
  vouchers: LedgerVoucher[];
  addSingleEntry: (input: SingleEntryInput) => LedgerVoucher | null;
  addMultiEntries: (rows: MultiEntryRowInput[], date: string, branchName?: string) => LedgerVoucher[];
  addDoubleEntryVoucher: (input: DoubleEntryVoucherInput) => { ok: boolean; voucher?: LedgerVoucher; error?: string };
  approveVoucher: (voucherId: string) => void;
  reverseVoucher: (voucherId: string, reason: string) => void;
  parties: AccountingParty[];
  fiscalPeriods: FiscalPeriod[];
  closeFiscalPeriod: (periodId: string) => void;
  reopenFiscalPeriod: (periodId: string, reason: string) => void;
  stats: ComputedAccountingStats;
  toastMessage: string | null;
  notify: (msg: string) => void;
}

const MODE_STORAGE_KEY = 'green_hospital_accounting_mode';

const AccountantLedgerContext = createContext<AccountantLedgerContextValue | null>(null);

export const AccountantLedgerProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [settings, setSettings] = useState<AccountingSettingsState>(() => {
    let savedMode: AccountingMode = DEFAULT_ACCOUNTING_SETTINGS.mode;
    if (typeof window !== 'undefined') {
      const stored = window.localStorage.getItem(MODE_STORAGE_KEY);
      if (stored === 'simple' || stored === 'advanced') {
        savedMode = stored;
      }
    }
    return { ...DEFAULT_ACCOUNTING_SETTINGS, mode: savedMode };
  });

  const [coaAccounts, setCoaAccounts] = useState<CoaAccount[]>(INITIAL_COA_ACCOUNTS);
  const [vouchers, setVouchers] = useState<LedgerVoucher[]>(INITIAL_LEDGER_VOUCHERS);
  const [parties] = useState<AccountingParty[]>(INITIAL_ACCOUNTING_PARTIES);
  const [fiscalPeriods, setFiscalPeriods] = useState<FiscalPeriod[]>(INITIAL_FISCAL_PERIODS);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const notify = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
    }, 4500);
  };

  const setMode = (mode: AccountingMode) => {
    setSettings((prev) => ({ ...prev, mode }));
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(MODE_STORAGE_KEY, mode);
    }
    notify(
      mode === 'simple'
        ? 'Switched to Simple Mode (Single-Entry) — Plain-language Income & Expense tracking active.'
        : 'Switched to Advanced Mode (Full Double-Entry) — Journal, Trial Balance, GL, Balance Sheet & COA unlocked.'
    );
  };

  const updateSettings = (next: Partial<AccountingSettingsState>) => {
    setSettings((prev) => {
      const merged = { ...prev, ...next };
      if (next.mode && typeof window !== 'undefined') {
        window.localStorage.setItem(MODE_STORAGE_KEY, next.mode);
      }
      return merged;
    });
    notify('Accounting settings & mode configuration saved successfully.');
  };

  const resolveChannelAccount = (channel: 'Cash' | 'Bank' | 'bKash / Nagad'): CoaAccount => {
    const code =
      channel === 'Cash'
        ? settings.defaultCashCode
        : channel === 'bKash / Nagad'
        ? settings.defaultWalletCode
        : settings.defaultBankCode;
    return (
      coaAccounts.find((a) => a.code === code) ||
      coaAccounts.find((a) => a.reportGroup === 'cash') ||
      coaAccounts[0]
    );
  };

  const generateVoucherNo = (prefix: string) => {
    const seq = Math.floor(1000 + Math.random() * 9000);
    return `${prefix}-2026-${seq}`;
  };

  const addSingleEntry = (input: SingleEntryInput): LedgerVoucher | null => {
    const category = SIMPLE_ENTRY_CATEGORIES.find((c) => c.id === input.categoryId);
    if (!category || input.amount <= 0) return null;

    const channelAcc = resolveChannelAccount(input.paymentChannel);
    const targetAcc =
      coaAccounts.find((a) => a.code === category.targetAccountCode) || coaAccounts[0];

    const isExpenseAboveThreshold =
      input.kind === 'expense' &&
      settings.approvalThresholdBdt > 0 &&
      input.amount >= settings.approvalThresholdBdt;

    const lines: LedgerVoucherLine[] =
      input.kind === 'income'
        ? [
            {
              id: `ln-${Date.now()}-1`,
              accountCode: channelAcc.code,
              accountNameEn: channelAcc.nameEn,
              debit: input.amount,
              credit: 0,
              partyName: input.partyName,
            },
            {
              id: `ln-${Date.now()}-2`,
              accountCode: targetAcc.code,
              accountNameEn: targetAcc.nameEn,
              debit: 0,
              credit: input.amount,
              partyName: input.partyName,
            },
          ]
        : [
            {
              id: `ln-${Date.now()}-1`,
              accountCode: targetAcc.code,
              accountNameEn: targetAcc.nameEn,
              debit: input.amount,
              credit: 0,
              partyName: input.partyName,
            },
            {
              id: `ln-${Date.now()}-2`,
              accountCode: channelAcc.code,
              accountNameEn: channelAcc.nameEn,
              debit: 0,
              credit: input.amount,
              partyName: input.partyName,
            },
          ];

    const newVoucher: LedgerVoucher = {
      id: `vch-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      voucherNo: generateVoucherNo(input.kind === 'income' ? 'INC' : 'EXP'),
      type: input.kind,
      entryMethod: 'single',
      date: input.date,
      status: isExpenseAboveThreshold ? 'pending_approval' : 'posted',
      direction: input.kind === 'income' ? 'in' : 'out',
      amount: input.amount,
      categoryEn: category.nameEn,
      categoryBn: category.nameBn,
      paymentChannel: input.paymentChannel,
      partyName: input.partyName?.trim() || undefined,
      narration: input.narration.trim() || category.nameEn,
      branchName: input.branchName || 'Dhanmondi Central',
      createdBy: CURRENT_ACCOUNTANT.name,
      lines,
    };

    setVouchers((prev) => [newVoucher, ...prev]);
    notify(
      isExpenseAboveThreshold
        ? `Voucher ${newVoucher.voucherNo} saved as Pending Approval (exceeds ৳${settings.approvalThresholdBdt.toLocaleString()} limit).`
        : `${input.kind === 'income' ? 'Income' : 'Expense'} ${newVoucher.voucherNo} (৳${input.amount.toLocaleString()}) posted to ledger.`
    );
    return newVoucher;
  };

  const addMultiEntries = (
    rows: MultiEntryRowInput[],
    date: string,
    branchName = 'Dhanmondi Central'
  ): LedgerVoucher[] => {
    const created: LedgerVoucher[] = [];
    const batchVouchers: LedgerVoucher[] = [];

    rows.forEach((row, idx) => {
      const category = SIMPLE_ENTRY_CATEGORIES.find((c) => c.id === row.categoryId);
      if (!category || row.amount <= 0) return;
      const channelAcc = resolveChannelAccount(row.paymentChannel);
      const targetAcc =
        coaAccounts.find((a) => a.code === category.targetAccountCode) || coaAccounts[0];

      const lines: LedgerVoucherLine[] =
        row.kind === 'income'
          ? [
              { id: `ln-m-${Date.now()}-${idx}-1`, accountCode: channelAcc.code, accountNameEn: channelAcc.nameEn, debit: row.amount, credit: 0, partyName: row.partyName },
              { id: `ln-m-${Date.now()}-${idx}-2`, accountCode: targetAcc.code, accountNameEn: targetAcc.nameEn, debit: 0, credit: row.amount, partyName: row.partyName },
            ]
          : [
              { id: `ln-m-${Date.now()}-${idx}-1`, accountCode: targetAcc.code, accountNameEn: targetAcc.nameEn, debit: row.amount, credit: 0, partyName: row.partyName },
              { id: `ln-m-${Date.now()}-${idx}-2`, accountCode: channelAcc.code, accountNameEn: channelAcc.nameEn, debit: 0, credit: row.amount, partyName: row.partyName },
            ];

      const v: LedgerVoucher = {
        id: `vch-m-${Date.now()}-${idx}`,
        voucherNo: generateVoucherNo(row.kind === 'income' ? 'INC' : 'EXP'),
        type: row.kind,
        entryMethod: 'multi',
        date,
        status: 'posted',
        direction: row.kind === 'income' ? 'in' : 'out',
        amount: row.amount,
        categoryEn: category.nameEn,
        categoryBn: category.nameBn,
        paymentChannel: row.paymentChannel,
        partyName: row.partyName?.trim() || undefined,
        narration: row.narration.trim() || `${category.nameEn} (Batch Multi-Entry)`,
        branchName,
        createdBy: CURRENT_ACCOUNTANT.name,
        lines,
      };
      batchVouchers.push(v);
      created.push(v);
    });

    if (batchVouchers.length > 0) {
      setVouchers((prev) => [...batchVouchers, ...prev]);
      notify(`Posted ${batchVouchers.length} multi-entry vouchers with balanced Dr/Cr ledger lines.`);
    }
    return created;
  };

  const addDoubleEntryVoucher = (
    input: DoubleEntryVoucherInput
  ): { ok: boolean; voucher?: LedgerVoucher; error?: string } => {
    if (input.lines.length < 2) {
      return { ok: false, error: 'Double-entry voucher requires at least 2 ledger lines.' };
    }

    let totalDr = 0;
    let totalCr = 0;
    const mappedLines: LedgerVoucherLine[] = [];

    for (let i = 0; i < input.lines.length; i++) {
      const l = input.lines[i];
      if (l.debit > 0 && l.credit > 0) {
        return { ok: false, error: `Line #${i + 1} cannot have both Debit and Credit.` };
      }
      const acc = coaAccounts.find((a) => a.code === l.accountCode);
      if (!acc) {
        return { ok: false, error: `Invalid COA account on line #${i + 1}.` };
      }
      totalDr += l.debit;
      totalCr += l.credit;
      mappedLines.push({
        id: `ln-de-${Date.now()}-${i}`,
        accountCode: acc.code,
        accountNameEn: acc.nameEn,
        debit: l.debit,
        credit: l.credit,
        partyName: l.partyName?.trim() || undefined,
        narration: l.narration?.trim() || undefined,
      });
    }

    if (totalDr <= 0 || Math.abs(totalDr - totalCr) > 0.01) {
      return {
        ok: false,
        error: `Out of balance: Debit (৳${totalDr.toLocaleString()}) must equal Credit (৳${totalCr.toLocaleString()}).`,
      };
    }

    const prefixMap: Record<DoubleEntryVoucherInput['type'], string> = {
      journal: 'JV',
      receipt: 'RCT',
      payment: 'PMT',
      contra: 'CNT',
    };

    const newVoucher: LedgerVoucher = {
      id: `vch-de-${Date.now()}`,
      voucherNo: generateVoucherNo(prefixMap[input.type]),
      type: input.type,
      entryMethod: 'double',
      date: input.date,
      status: input.saveAsDraft ? 'draft' : 'posted',
      direction:
        input.type === 'receipt' ? 'in' : input.type === 'payment' ? 'out' : 'transfer',
      amount: totalDr,
      categoryEn:
        input.type === 'journal'
          ? 'Double-Entry Journal Voucher'
          : input.type === 'contra'
          ? 'Cash/Bank Contra Transfer'
          : input.type === 'receipt'
          ? 'Double-Entry Receipt Voucher'
          : 'Double-Entry Payment Voucher',
      categoryBn: 'ডাবল-এন্ট্রি ভাউচার',
      paymentChannel: 'Journal Ledger',
      partyName: input.partyName?.trim() || undefined,
      narration: input.narration.trim(),
      branchName: input.branchName || 'Dhanmondi Central',
      createdBy: CURRENT_ACCOUNTANT.name,
      approvedBy: input.saveAsDraft ? undefined : CURRENT_ACCOUNTANT.name,
      lines: mappedLines,
    };

    setVouchers((prev) => [newVoucher, ...prev]);
    notify(
      input.saveAsDraft
        ? `Draft voucher ${newVoucher.voucherNo} saved (not yet posted to GL).`
        : `Balanced double-entry voucher ${newVoucher.voucherNo} (৳${totalDr.toLocaleString()}) posted to GL.`
    );
    return { ok: true, voucher: newVoucher };
  };

  const approveVoucher = (voucherId: string) => {
    setVouchers((prev) =>
      prev.map((v) =>
        v.id === voucherId
          ? { ...v, status: 'posted', approvedBy: CURRENT_ACCOUNTANT.name }
          : v
      )
    );
    notify('Voucher approved and posted to General Ledger.');
  };

  const reverseVoucher = (voucherId: string, reason: string) => {
    const target = vouchers.find((v) => v.id === voucherId);
    if (!target || target.status !== 'posted' || target.isReversal) return;

    const revNo = `REV-${target.voucherNo}`;
    const reversalVoucher: LedgerVoucher = {
      id: `vch-rev-${Date.now()}`,
      voucherNo: revNo,
      type: 'journal',
      entryMethod: 'double',
      date: new Date().toISOString().slice(0, 10),
      status: 'posted',
      direction: target.direction === 'in' ? 'out' : target.direction === 'out' ? 'in' : 'transfer',
      amount: target.amount,
      categoryEn: `Reversal of ${target.voucherNo}`,
      categoryBn: `রিভার্সাল (${target.voucherNo})`,
      paymentChannel: target.paymentChannel,
      partyName: target.partyName,
      narration: `REVERSAL: ${reason.trim()} (Original: ${target.narration})`,
      branchName: target.branchName,
      createdBy: CURRENT_ACCOUNTANT.name,
      approvedBy: CURRENT_ACCOUNTANT.name,
      isReversal: true,
      reversalOfNo: target.voucherNo,
      lines: target.lines.map((l, idx) => ({
        ...l,
        id: `ln-rev-${Date.now()}-${idx}`,
        debit: l.credit, // Flip Debit <-> Credit
        credit: l.debit,
        narration: `Reversal line for ${target.voucherNo}`,
      })),
    };

    setVouchers((prev) => [
      reversalVoucher,
      ...prev.map((v) =>
        v.id === voucherId ? { ...v, status: 'reversed' as const, reversedByNo: revNo } : v
      ),
    ]);
    notify(`Immutable Reversal ${revNo} posted. Original ${target.voucherNo} marked Reversed.`);
  };

  const addCoaAccount = (input: {
    code: string;
    nameEn: string;
    nameBn: string;
    type: CoaAccountType;
    reportGroup: CoaReportGroup;
    isContra?: boolean;
    openingBalance?: number;
  }): { ok: boolean; error?: string } => {
    const trimmedCode = input.code.trim();
    if (!trimmedCode || !input.nameEn.trim()) {
      return { ok: false, error: 'Account Code and English Title are required.' };
    }
    if (coaAccounts.some((a) => a.code.toLowerCase() === trimmedCode.toLowerCase())) {
      return { ok: false, error: `Account code ${trimmedCode} already exists.` };
    }
    const isCreditNormal =
      input.type === 'liability' || input.type === 'equity' || input.type === 'income';
    const normalBalance: 'Debit' | 'Credit' = input.isContra
      ? isCreditNormal
        ? 'Debit'
        : 'Credit'
      : isCreditNormal
      ? 'Credit'
      : 'Debit';

    const newAcc: CoaAccount = {
      id: `coa-${Date.now()}`,
      code: trimmedCode,
      nameEn: input.nameEn.trim(),
      nameBn: input.nameBn.trim() || input.nameEn.trim(),
      type: input.type,
      reportGroup: input.reportGroup,
      normalBalance,
      openingBalance: input.openingBalance || 0,
      isSystem: false,
      isContra: Boolean(input.isContra),
      isActive: true,
    };

    setCoaAccounts((prev) =>
      [...prev, newAcc].sort((a, b) => a.code.localeCompare(b.code))
    );
    notify(`Account ${newAcc.code} — ${newAcc.nameEn} added to Chart of Accounts.`);
    return { ok: true };
  };

  const closeFiscalPeriod = (periodId: string) => {
    setFiscalPeriods((prev) =>
      prev.map((p) =>
        p.id === periodId
          ? {
              ...p,
              status: 'closed',
              closedAt: new Date().toISOString().slice(0, 10),
              closedBy: CURRENT_ACCOUNTANT.name,
            }
          : p
      )
    );
    notify('Fiscal period closed and locked against backdated voucher posting.');
  };

  const reopenFiscalPeriod = (periodId: string, reason: string) => {
    setFiscalPeriods((prev) =>
      prev.map((p) =>
        p.id === periodId
          ? { ...p, status: 'open', reopenedReason: reason.trim() }
          : p
      )
    );
    notify('Fiscal period reopened with audit trail justification.');
  };

  // Compute live Trial Balance, P&L, Balance Sheet, Cash & Bank directly from COA + Posted Vouchers
  const stats = useMemo<ComputedAccountingStats>(() => {
    const activeVouchers = vouchers.filter(
      (v) => v.status === 'posted' || v.status === 'reversed'
    );

    const periodDrMap: Record<string, number> = {};
    const periodCrMap: Record<string, number> = {};

    for (const v of activeVouchers) {
      for (const l of v.lines) {
        periodDrMap[l.accountCode] = (periodDrMap[l.accountCode] || 0) + l.debit;
        periodCrMap[l.accountCode] = (periodCrMap[l.accountCode] || 0) + l.credit;
      }
    }

    const trialBalanceRows: TrialBalanceRow[] = coaAccounts.map((acc) => {
      const openingDebit = acc.normalBalance === 'Debit' ? acc.openingBalance : 0;
      const openingCredit = acc.normalBalance === 'Credit' ? acc.openingBalance : 0;
      const periodDebit = periodDrMap[acc.code] || 0;
      const periodCredit = periodCrMap[acc.code] || 0;

      const net = openingDebit - openingCredit + (periodDebit - periodCredit);
      const closingDebit = net > 0 ? net : 0;
      const closingCredit = net < 0 ? Math.abs(net) : 0;

      return {
        account: acc,
        openingDebit,
        openingCredit,
        periodDebit,
        periodCredit,
        closingDebit,
        closingCredit,
      };
    });

    const trialTotals = trialBalanceRows.reduce(
      (acc, r) => ({
        openingDebit: acc.openingDebit + r.openingDebit,
        openingCredit: acc.openingCredit + r.openingCredit,
        periodDebit: acc.periodDebit + r.periodDebit,
        periodCredit: acc.periodCredit + r.periodCredit,
        closingDebit: acc.closingDebit + r.closingDebit,
        closingCredit: acc.closingCredit + r.closingCredit,
      }),
      {
        openingDebit: 0,
        openingCredit: 0,
        periodDebit: 0,
        periodCredit: 0,
        closingDebit: 0,
        closingCredit: 0,
      }
    );

    const getClosingBalance = (acc: CoaAccount): number => {
      const dr = (acc.normalBalance === 'Debit' ? acc.openingBalance : 0) + (periodDrMap[acc.code] || 0);
      const cr = (acc.normalBalance === 'Credit' ? acc.openingBalance : 0) + (periodCrMap[acc.code] || 0);
      return acc.normalBalance === 'Debit' ? dr - cr : cr - dr;
    };

    let cashInHand = 0;
    let bankBalance = 0;
    let walletBalance = 0;
    let totalReceivables = 0;
    let totalPayables = 0;
    let periodIncome = 0;
    let periodCogs = 0;
    let periodOperatingExpense = 0;
    let totalAssets = 0;
    let totalLiabilities = 0;
    let baseEquity = 0;

    for (const acc of coaAccounts) {
      const bal = getClosingBalance(acc);
      if (acc.reportGroup === 'cash') cashInHand += bal;
      if (acc.reportGroup === 'bank') bankBalance += bal;
      if (acc.reportGroup === 'wallet') walletBalance += bal;
      if (acc.reportGroup === 'receivable') totalReceivables += bal;
      if (acc.reportGroup === 'payable') totalPayables += bal;

      if (acc.type === 'income') periodIncome += bal;
      if (acc.type === 'expense') {
        if (acc.reportGroup === 'cogs') periodCogs += bal;
        else periodOperatingExpense += bal;
      }
      if (acc.type === 'asset') totalAssets += bal;
      if (acc.type === 'liability') totalLiabilities += bal;
      if (acc.type === 'equity') baseEquity += bal;
    }

    const grossProfit = periodIncome - periodCogs;
    const netProfit = grossProfit - periodOperatingExpense;
    const totalEquity = baseEquity + netProfit;
    const balanceSheetDiff = totalAssets - (totalLiabilities + totalEquity);

    return {
      cashInHand,
      bankBalance,
      walletBalance,
      totalCashAndBank: cashInHand + bankBalance + walletBalance,
      totalReceivables,
      totalPayables,
      periodIncome,
      periodCogs,
      grossProfit,
      periodOperatingExpense,
      netProfit,
      totalAssets,
      totalLiabilities,
      totalEquity,
      balanceSheetBalanced: Math.abs(balanceSheetDiff) < 0.01,
      balanceSheetDiff,
      trialBalanceRows,
      trialTotals,
      trialBalanced: Math.abs(trialTotals.closingDebit - trialTotals.closingCredit) < 0.01,
      pendingApprovalCount: vouchers.filter((v) => v.status === 'pending_approval').length,
      draftCount: vouchers.filter((v) => v.status === 'draft').length,
    };
  }, [coaAccounts, vouchers]);

  return (
    <AccountantLedgerContext.Provider
      value={{
        settings,
        mode: settings.mode,
        setMode,
        updateSettings,
        coaAccounts,
        addCoaAccount,
        vouchers,
        addSingleEntry,
        addMultiEntries,
        addDoubleEntryVoucher,
        approveVoucher,
        reverseVoucher,
        parties,
        fiscalPeriods,
        closeFiscalPeriod,
        reopenFiscalPeriod,
        stats,
        toastMessage,
        notify,
      }}
    >
      {children}
    </AccountantLedgerContext.Provider>
  );
};

export function useAccountantLedger(): AccountantLedgerContextValue {
  const ctx = useContext(AccountantLedgerContext);
  if (!ctx) {
    throw new Error('useAccountantLedger must be used inside AccountantLedgerProvider');
  }
  return ctx;
}

