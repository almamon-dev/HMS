import React, { useMemo, useState } from 'react';
import {
  Calendar,
  CheckCircle2,
  Lock,
  Plus,
  ShieldCheck,
  SlidersHorizontal,
  Unlock,
  Wallet,
  X,
} from 'lucide-react';
import { SummaryCard, SummaryCardGrid } from '../common/SummaryCard';
import { DataTable, DataTableColumn } from '../common/DataTable';
import {
  AccountingMode,
  CoaAccount,
  CoaAccountType,
  CoaReportGroup,
  FINANCIAL_AUDIT_LOGS_DATA,
  FinancialAuditLogRecord,
  FiscalPeriod,
} from '../../data/accountantPortalData';
import { useAccountantLedger } from '../../data/accountantLedgerContext';

interface AccountantSettingsViewProps {
  initialTab: 'coa' | 'periods' | 'audit' | 'mode';
}

export const AccountantSettingsView: React.FC<AccountantSettingsViewProps> = ({
  initialTab,
}) => {
  const {
    settings,
    mode,
    updateSettings,
    coaAccounts,
    addCoaAccount,
    fiscalPeriods,
    closeFiscalPeriod,
    reopenFiscalPeriod,
    stats,
  } = useAccountantLedger();

  // COA Filter & Add Modal
  const [coaTypeFilter, setCoaTypeFilter] = useState<'all' | CoaAccountType>('all');
  const [coaModalOpen, setCoaModalOpen] = useState(false);
  const [newCode, setNewCode] = useState('');
  const [newNameEn, setNewNameEn] = useState('');
  const [newNameBn, setNewNameBn] = useState('');
  const [newType, setNewType] = useState<CoaAccountType>('expense');
  const [newGroup, setNewGroup] = useState<CoaReportGroup>('operating_expense');
  const [newOpening, setNewOpening] = useState('0');
  const [coaError, setCoaError] = useState<string | null>(null);

  // Fiscal Period Reopen Modal
  const [reopenTarget, setReopenTarget] = useState<FiscalPeriod | null>(null);
  const [reopenReason, setReopenReason] = useState('');

  // Settings Local Form State (pharmacy-care Settings template)
  const [draftMode, setDraftMode] = useState<AccountingMode>(mode);
  const [fyStart, setFyStart] = useState<number>(settings.fiscalYearStartMonth);
  const [vatEnabled, setVatEnabled] = useState<boolean>(settings.vatEnabled);
  const [vatRate, setVatRate] = useState<string>(String(settings.vatRatePercent));
  const [threshold, setThreshold] = useState<string>(String(settings.approvalThresholdBdt));
  const [cashCode, setCashCode] = useState<string>(settings.defaultCashCode);
  const [bankCode, setBankCode] = useState<string>(settings.defaultBankCode);
  const [walletCode, setWalletCode] = useState<string>(settings.defaultWalletCode);

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings({
      mode: draftMode,
      fiscalYearStartMonth: fyStart,
      vatEnabled,
      vatRatePercent: Number(vatRate) || 0,
      approvalThresholdBdt: Number(threshold) || 0,
      defaultCashCode: cashCode,
      defaultBankCode: bankCode,
      defaultWalletCode: walletCode,
    });
  };

  const handleCreateAccount = (e: React.FormEvent) => {
    e.preventDefault();
    setCoaError(null);
    const res = addCoaAccount({
      code: newCode,
      nameEn: newNameEn,
      nameBn: newNameBn,
      type: newType,
      reportGroup: newGroup,
      openingBalance: Number(newOpening) || 0,
    });
    if (!res.ok) {
      setCoaError(res.error || 'Could not create account.');
      return;
    }
    setCoaModalOpen(false);
    setNewCode('');
    setNewNameEn('');
    setNewNameBn('');
    setNewOpening('0');
  };

  // ===========================================================================
  // 1. CHART OF ACCOUNTS (COA MASTER)
  // ===========================================================================
  const filteredCoa = useMemo(
    () => (coaTypeFilter === 'all' ? coaAccounts : coaAccounts.filter((a) => a.type === coaTypeFilter)),
    [coaAccounts, coaTypeFilter]
  );

  if (initialTab === 'coa') {
    const coaColumns: DataTableColumn<CoaAccount>[] = [
      {
        key: 'code',
        header: 'Account Code',
        sortable: true,
        sortValue: (r) => r.code,
        render: (r) => (
          <span className="font-mono font-bold text-[#006a4e] text-xs px-2 py-0.5 rounded bg-emerald-50 border border-emerald-200/70">
            {r.code}
          </span>
        ),
      },
      {
        key: 'nameEn',
        header: 'Ledger Head (English / বাংলা)',
        sortable: true,
        sortValue: (r) => r.nameEn,
        render: (r) => (
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-slate-900 text-xs">{r.nameEn}</span>
              {r.isSystem && (
                <span className="inline-flex items-center gap-0.5 px-1.5 py-0.2 rounded bg-slate-100 text-slate-500 text-[9.5px] font-semibold border border-slate-200">
                  <Lock className="w-2.5 h-2.5" />
                  System
                </span>
              )}
            </div>
            <span className="text-[11px] text-slate-400">{r.nameBn}</span>
          </div>
        ),
      },
      {
        key: 'type',
        header: 'Account Class',
        sortable: true,
        sortValue: (r) => r.type,
        render: (r) => (
          <span
            className={`px-2 py-0.5 rounded-[3px] text-[10.5px] font-bold uppercase border ${
              r.type === 'asset'
                ? 'bg-blue-50 text-blue-700 border-blue-200'
                : r.type === 'liability'
                ? 'bg-rose-50 text-rose-700 border-rose-200'
                : r.type === 'income'
                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                : r.type === 'expense'
                ? 'bg-amber-50 text-amber-800 border-amber-200'
                : 'bg-purple-50 text-purple-700 border-purple-200'
            }`}
          >
            {r.type}
          </span>
        ),
      },
      {
        key: 'normalBalance',
        header: 'Normal',
        align: 'center',
        render: (r) => <span className="font-mono text-xs text-slate-600">{r.normalBalance}</span>,
      },
      {
        key: 'balance',
        header: 'Live Closing Balance',
        align: 'right',
        render: (r) => {
          const tbRow = stats.trialBalanceRows.find((t) => t.account.code === r.code);
          const bal = tbRow
            ? r.normalBalance === 'Debit'
              ? tbRow.closingDebit - tbRow.closingCredit
              : tbRow.closingCredit - tbRow.closingDebit
            : r.openingBalance;
          return (
            <span className="font-mono font-extrabold text-slate-900 text-xs">
              ৳ {bal.toLocaleString()}
            </span>
          );
        },
      },
    ];

    return (
      <div className="space-y-4 font-['Plus_Jakarta_Sans',sans-serif]">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div>
            <h1 className="text-lg md:text-xl font-bold text-slate-900 flex items-center gap-2">
              <Wallet className="w-5 h-5 text-[#006a4e]" />
              <span>Chart of Accounts (Hospital COA Master)</span>
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              5-Class standardized hospital ledger structure (Assets, Liabilities, Equity, Revenue, Expenses) powering both Single-Entry and Double-Entry modes.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setCoaModalOpen(true)}
            className="h-8 px-3.5 rounded-[3px] bg-[#006a4e] hover:bg-[#00553e] text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Ledger Account</span>
          </button>
        </div>

        <DataTable<CoaAccount>
          data={filteredCoa}
          columns={coaColumns}
          showSerial={true}
          defaultPageSize={20}
          searchPlaceholder="Search COA code, English or Bangla name..."
          searchFilter={(r, q) =>
            r.code.toLowerCase().includes(q) ||
            r.nameEn.toLowerCase().includes(q) ||
            r.nameBn.toLowerCase().includes(q)
          }
          toolbarFilters={
            <div className="flex items-center gap-1.5 flex-wrap">
              {(['all', 'asset', 'liability', 'equity', 'income', 'expense'] as const).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setCoaTypeFilter(t)}
                  className={`px-2.5 py-1 rounded-[3px] text-[11px] font-semibold capitalize border cursor-pointer ${
                    coaTypeFilter === t
                      ? 'bg-[#006a4e] text-white border-[#006a4e]'
                      : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          }
        />

        {/* Add Custom Account Modal */}
        {coaModalOpen && (
          <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
            <form
              onSubmit={handleCreateAccount}
              className="bg-white rounded-[4px] border border-slate-200 max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl"
            >
              <div className="px-5 py-3.5 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
                <h3 className="font-bold text-slate-900 text-sm">Create Custom COA Account</h3>
                <button
                  type="button"
                  onClick={() => setCoaModalOpen(false)}
                  className="p-1 text-slate-400 hover:text-slate-700 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="p-5 space-y-3 text-xs">
                {coaError && (
                  <div className="p-2.5 bg-rose-50 border border-rose-200 rounded text-rose-700 font-semibold">
                    {coaError}
                  </div>
                )}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Account Code *</label>
                    <input
                      type="text"
                      required
                      value={newCode}
                      onChange={(e) => setNewCode(e.target.value)}
                      placeholder="e.g. 5060-01"
                      className="w-full h-8 px-2.5 border border-slate-300 rounded-[3px] font-mono"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Classification *</label>
                    <select
                      value={newType}
                      onChange={(e) => setNewType(e.target.value as CoaAccountType)}
                      className="w-full h-8 px-2.5 border border-slate-300 rounded-[3px] bg-white capitalize"
                    >
                      <option value="asset">Asset</option>
                      <option value="liability">Liability</option>
                      <option value="equity">Equity</option>
                      <option value="income">Income</option>
                      <option value="expense">Expense</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Account Name (English) *</label>
                  <input
                    type="text"
                    required
                    value={newNameEn}
                    onChange={(e) => setNewNameEn(e.target.value)}
                    placeholder="e.g. Ambulance Maintenance & Fuel"
                    className="w-full h-8 px-2.5 border border-slate-300 rounded-[3px]"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Account Name (বাংলা)</label>
                  <input
                    type="text"
                    value={newNameBn}
                    onChange={(e) => setNewNameBn(e.target.value)}
                    placeholder="ঐচ্ছিক বাংলা নাম"
                    className="w-full h-8 px-2.5 border border-slate-300 rounded-[3px]"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Report Group</label>
                    <select
                      value={newGroup}
                      onChange={(e) => setNewGroup(e.target.value as CoaReportGroup)}
                      className="w-full h-8 px-2.5 border border-slate-300 rounded-[3px] bg-white"
                    >
                      <option value="operating_expense">operating_expense</option>
                      <option value="revenue">revenue</option>
                      <option value="cash">cash</option>
                      <option value="bank">bank</option>
                      <option value="receivable">receivable</option>
                      <option value="payable">payable</option>
                      <option value="fixed_asset">fixed_asset</option>
                    </select>
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Opening Balance (৳)</label>
                    <input
                      type="number"
                      min="0"
                      value={newOpening}
                      onChange={(e) => setNewOpening(e.target.value)}
                      className="w-full h-8 px-2.5 border border-slate-300 rounded-[3px] font-mono"
                    />
                  </div>
                </div>
              </div>
              <div className="px-5 py-3 bg-slate-50 border-t border-slate-200 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setCoaModalOpen(false)}
                  className="h-8 px-3 rounded-[3px] border border-slate-300 text-xs font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="h-8 px-4 rounded-[3px] bg-[#006a4e] text-white text-xs font-bold cursor-pointer"
                >
                  Add Account
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    );
  }

  // ===========================================================================
  // 2. FISCAL PERIODS (OPEN / CLOSE / REOPEN LOCKING)
  // ===========================================================================
  if (initialTab === 'periods') {
    const periodColumns: DataTableColumn<FiscalPeriod>[] = [
      {
        key: 'periodNumber',
        header: 'Period #',
        align: 'center',
        render: (r) => <span className="font-mono font-bold text-slate-500">P{r.periodNumber}</span>,
      },
      {
        key: 'name',
        header: 'Accounting Month & FY',
        render: (r) => (
          <div>
            <span className="font-bold text-slate-900 text-xs block">{r.name}</span>
            <span className="text-[10.5px] font-mono text-slate-400">{r.yearName}</span>
          </div>
        ),
      },
      {
        key: 'startDate',
        header: 'Period Date Range',
        render: (r) => (
          <span className="font-mono text-xs text-slate-700">
            {r.startDate} → {r.endDate}
          </span>
        ),
      },
      {
        key: 'status',
        header: 'Lock Status',
        align: 'center',
        render: (r) => (
          <span
            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-[3px] text-[10.5px] font-bold border ${
              r.status === 'open'
                ? 'bg-emerald-50 text-[#006a4e] border-emerald-200'
                : 'bg-slate-100 text-slate-600 border-slate-300'
            }`}
          >
            {r.status === 'open' ? <Unlock className="w-3 h-3" /> : <Lock className="w-3 h-3" />}
            {r.status === 'open' ? 'Open for Posting' : 'Closed & Locked'}
          </span>
        ),
      },
      {
        key: 'closedBy',
        header: 'Closed / Audit Info',
        render: (r) => (
          <span className="text-[11px] text-slate-500">
            {r.status === 'closed'
              ? `${r.closedBy || 'Chief Accountant'} (${r.closedAt || ''})`
              : r.reopenedReason
              ? `Reopened: ${r.reopenedReason}`
              : 'Active accounting period'}
          </span>
        ),
      },
      {
        key: 'id',
        header: 'Control',
        align: 'right',
        render: (r) =>
          r.status === 'open' ? (
            <button
              type="button"
              onClick={() => closeFiscalPeriod(r.id)}
              className="h-7 px-2.5 rounded-[3px] border border-slate-300 bg-white hover:bg-slate-100 text-slate-700 text-[11px] font-semibold inline-flex items-center gap-1 cursor-pointer"
            >
              <Lock className="w-3 h-3" />
              <span>Close Period</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={() => {
                setReopenTarget(r);
                setReopenReason('');
              }}
              className="h-7 px-2.5 rounded-[3px] border border-amber-300 bg-amber-50 hover:bg-amber-100 text-amber-800 text-[11px] font-semibold inline-flex items-center gap-1 cursor-pointer"
            >
              <Unlock className="w-3 h-3" />
              <span>Reopen</span>
            </button>
          ),
      },
    ];

    return (
      <div className="space-y-4 font-['Plus_Jakarta_Sans',sans-serif]">
        <div>
          <h1 className="text-lg md:text-xl font-bold text-slate-900 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-[#006a4e]" />
            <span>Fiscal Years & Monthly Period Locking</span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Prevent backdated voucher tampering by locking closed accounting months. Reopening a closed period records mandatory audit justification.
          </p>
        </div>

        <DataTable<FiscalPeriod>
          data={fiscalPeriods}
          columns={periodColumns}
          showSerial={false}
          searchPlaceholder="Search month or fiscal year..."
          searchFilter={(r, q) => r.name.toLowerCase().includes(q) || r.yearName.toLowerCase().includes(q)}
        />

        {reopenTarget && (
          <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (reopenReason.trim().length < 4) return;
                reopenFiscalPeriod(reopenTarget.id, reopenReason);
                setReopenTarget(null);
              }}
              className="bg-white rounded-[4px] border border-amber-200 max-w-md w-full shadow-2xl overflow-hidden"
            >
              <div className="px-5 py-3 bg-amber-50 border-b border-amber-200 flex items-center justify-between">
                <h3 className="font-bold text-amber-900 text-sm">Reopen {reopenTarget.name}</h3>
                <button
                  type="button"
                  onClick={() => setReopenTarget(null)}
                  className="p-1 text-slate-400 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="p-5 space-y-3 text-xs">
                <p className="text-slate-600">
                  Provide an audit reason for reopening <strong>{reopenTarget.name}</strong> to allow backdated adjustments.
                </p>
                <textarea
                  required
                  minLength={4}
                  rows={2}
                  value={reopenReason}
                  onChange={(e) => setReopenReason(e.target.value)}
                  placeholder="Reason for reopening..."
                  className="w-full p-2 border border-slate-300 rounded-[3px]"
                />
              </div>
              <div className="px-5 py-3 bg-slate-50 border-t border-slate-200 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setReopenTarget(null)}
                  className="h-8 px-3 rounded-[3px] border border-slate-300 text-xs font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="h-8 px-4 rounded-[3px] bg-amber-600 text-white text-xs font-bold cursor-pointer"
                >
                  Confirm Reopen
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    );
  }

  // ===========================================================================
  // 3. FINANCIAL AUDIT LOGS
  // ===========================================================================
  if (initialTab === 'audit') {
    const auditColumns: DataTableColumn<FinancialAuditLogRecord>[] = [
      {
        key: 'timestamp',
        header: 'Timestamp',
        sortable: true,
        sortValue: (r) => r.timestamp,
        render: (r) => <span className="font-mono text-slate-700 text-xs">{r.timestamp}</span>,
      },
      {
        key: 'action',
        header: 'Event & Voucher Reference',
        sortable: true,
        sortValue: (r) => r.action,
        render: (r) => (
          <div>
            <span className="font-bold text-slate-900 text-xs block">{r.action}</span>
            <span className="text-[11px] text-slate-500 font-mono">Ref: {r.referenceNo}</span>
          </div>
        ),
      },
      {
        key: 'staffName',
        header: 'Staff Auditor & IP',
        render: (r) => (
          <div>
            <span className="font-semibold text-slate-800 text-xs block">{r.staffName} ({r.staffRole})</span>
            <span className="text-[10px] text-slate-400 font-mono">IP: {r.ipAddress}</span>
          </div>
        ),
      },
      {
        key: 'module',
        header: 'Module',
        render: (r) => (
          <span className="px-2 py-0.5 rounded-[3px] text-[10.5px] font-semibold bg-slate-100 text-slate-700">
            {r.module}
          </span>
        ),
      },
      {
        key: 'amount',
        header: 'Amount (BDT)',
        align: 'right',
        render: (r) => (
          <span className="font-mono font-extrabold text-[#006a4e] text-xs">
            ৳ {r.amount.toLocaleString()}
          </span>
        ),
      },
    ];

    return (
      <div className="space-y-4 font-['Plus_Jakarta_Sans',sans-serif]">
        <div>
          <h1 className="text-lg md:text-xl font-bold text-slate-900 flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-[#006a4e]" />
            <span>Financial Audit Trail & Compliance Logs</span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Tamper-evident chronological audit log recording every clearance, voucher authorization, reversal, and fiscal period action.
          </p>
        </div>

        <SummaryCardGrid columns={3}>
          <SummaryCard title="Audit Log Retention" value="7 Years WORM" subtitle="ICAB & NBR statutory archive" icon={ShieldCheck} iconColor="text-[#006a4e]" />
          <SummaryCard title="Pending Voucher Approvals" value={`${stats.pendingApprovalCount}`} subtitle="Awaiting controller sign-off" icon={Lock} iconColor="text-amber-600" />
          <SummaryCard title="Active Fiscal Period" value="November 2026" subtitle="Posting unlocked" icon={Calendar} iconColor="text-blue-600" />
        </SummaryCardGrid>

        <DataTable<FinancialAuditLogRecord>
          data={FINANCIAL_AUDIT_LOGS_DATA}
          columns={auditColumns}
          showSerial={true}
          searchPlaceholder="Search audit log by event, staff, reference..."
          searchFilter={(r, q) =>
            r.action.toLowerCase().includes(q) ||
            r.staffName.toLowerCase().includes(q) ||
            r.referenceNo.toLowerCase().includes(q)
          }
        />
      </div>
    );
  }

  // ===========================================================================
  // 4. ACCOUNTING SETTINGS (PHARMACY-CARE SIMPLE ↔ ADVANCED DOUBLE-ENTRY SWITCHER)
  // ===========================================================================
  return (
    <div className="space-y-4 font-['Plus_Jakarta_Sans',sans-serif]">
      <div>
        <h1 className="text-lg md:text-xl font-bold text-slate-900 flex items-center gap-2">
          <SlidersHorizontal className="w-5 h-5 text-[#006a4e]" />
          <span>Accounting Mode & ERP Configuration</span>
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          The ledger is always double-entry internally. Switching Simple (Single-Entry) ↔ Advanced (Double-Entry) requires zero data migration and never deletes data.
        </p>
      </div>

      <form
        onSubmit={handleSaveSettings}
        className="bg-white border border-slate-300/80 rounded-[3px] shadow-xs overflow-hidden"
      >
        <div className="p-5 space-y-5">
          {/* Mode Switcher Cards (pharmacy-care template) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            <button
              type="button"
              onClick={() => setDraftMode('simple')}
              className={`text-left p-4 rounded-[3px] border transition-all cursor-pointer ${
                draftMode === 'simple'
                  ? 'border-[#006a4e] bg-emerald-50/70 ring-1 ring-[#006a4e]/30'
                  : 'border-slate-200 hover:border-slate-300 bg-white'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-sm text-slate-900">
                  Simple Mode (Single-Entry / Quick Entry)
                </span>
                {draftMode === 'simple' && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-[#006a4e] text-white text-[10px] font-bold">
                    <CheckCircle2 className="w-3 h-3" /> Active
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                Plain-language Income & Expense entry, Multi-Row Batch Entry, Day Book, Cash & Bank Book, and Simple P&L without Debit/Credit jargon.
              </p>
            </button>

            <button
              type="button"
              onClick={() => setDraftMode('advanced')}
              className={`text-left p-4 rounded-[3px] border transition-all cursor-pointer ${
                draftMode === 'advanced'
                  ? 'border-[#006a4e] bg-emerald-50/70 ring-1 ring-[#006a4e]/30'
                  : 'border-slate-200 hover:border-slate-300 bg-white'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-sm text-slate-900">
                  Advanced Mode (Full Double-Entry)
                </span>
                {draftMode === 'advanced' && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-[#006a4e] text-white text-[10px] font-bold">
                    <CheckCircle2 className="w-3 h-3" /> Active
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                Unlocks Chart of Accounts, Balanced Journal Vouchers (Dr/Cr), General Ledger, Trial Balance, Balance Sheet, Fiscal Period closing, and Bank Reconciliation.
              </p>
            </button>
          </div>

          {/* Institutional Defaults Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs pt-2 border-t border-slate-100">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Fiscal Year Start Month</label>
              <select
                value={fyStart}
                onChange={(e) => setFyStart(Number(e.target.value))}
                className="w-full h-9 px-3 border border-slate-300 rounded-[3px] bg-white"
              >
                <option value={7}>July (Bangladesh Standard FY)</option>
                <option value={1}>January (Calendar Year)</option>
                <option value={4}>April</option>
                <option value={10}>October</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Default VAT Rate (%)</label>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={vatEnabled}
                  onChange={(e) => setVatEnabled(e.target.checked)}
                  className="rounded text-[#006a4e]"
                />
                <input
                  type="number"
                  step="0.5"
                  min="0"
                  max="30"
                  disabled={!vatEnabled}
                  value={vatRate}
                  onChange={(e) => setVatRate(e.target.value)}
                  className="flex-1 h-9 px-3 border border-slate-300 rounded-[3px] font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Controller Approval Threshold (৳)</label>
              <input
                type="number"
                min="0"
                value={threshold}
                onChange={(e) => setThreshold(e.target.value)}
                className="w-full h-9 px-3 border border-slate-300 rounded-[3px] font-mono font-bold"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Default Cash Vault Account</label>
              <select
                value={cashCode}
                onChange={(e) => setCashCode(e.target.value)}
                className="w-full h-9 px-3 border border-slate-300 rounded-[3px] bg-white"
              >
                {coaAccounts
                  .filter((a) => a.reportGroup === 'cash')
                  .map((a) => (
                    <option key={a.code} value={a.code}>
                      {a.code} — {a.nameEn}
                    </option>
                  ))}
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Default Bank Account</label>
              <select
                value={bankCode}
                onChange={(e) => setBankCode(e.target.value)}
                className="w-full h-9 px-3 border border-slate-300 rounded-[3px] bg-white"
              >
                {coaAccounts
                  .filter((a) => a.reportGroup === 'bank')
                  .map((a) => (
                    <option key={a.code} value={a.code}>
                      {a.code} — {a.nameEn}
                    </option>
                  ))}
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Default bKash / Nagad Account</label>
              <select
                value={walletCode}
                onChange={(e) => setWalletCode(e.target.value)}
                className="w-full h-9 px-3 border border-slate-300 rounded-[3px] bg-white"
              >
                {coaAccounts
                  .filter((a) => a.reportGroup === 'wallet' || a.reportGroup === 'bank')
                  .map((a) => (
                    <option key={a.code} value={a.code}>
                      {a.code} — {a.nameEn}
                    </option>
                  ))}
              </select>
            </div>
          </div>
        </div>

        <div className="px-5 py-3 bg-slate-50 border-t border-slate-200 flex items-center justify-end">
          <button
            type="submit"
            className="h-9 px-5 rounded-[3px] bg-[#006a4e] hover:bg-[#00553e] text-white text-xs font-bold cursor-pointer shadow-xs"
          >
            Save Accounting Mode & Settings
          </button>
        </div>
      </form>
    </div>
  );
};
