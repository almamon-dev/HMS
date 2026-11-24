import React, { useState } from 'react';
import {
  CheckCircle2,
  Layers,
  Lock,
  Scale,
  Settings,
  ShieldCheck,
  Wallet,
  X,
} from 'lucide-react';
import { SummaryCard, SummaryCardGrid } from '../common/SummaryCard';
import { DataTable, DataTableColumn } from '../common/DataTable';
import {
  FINANCIAL_AUDIT_LOGS_DATA,
  FinancialAuditLogRecord,
} from '../../data/accountantPortalData';

export interface CoaAccountRecord {
  code: string;
  name: string;
  classGroup: '1000 Assets' | '2000 Liabilities' | '3000 Equity' | '4000 Revenue' | '5000 Expenses';
  normalBalance: 'Debit' | 'Credit';
  balance: number;
  status: 'Active Ledger' | 'Restricted';
}

export const CHART_OF_ACCOUNTS_DATA: CoaAccountRecord[] = [
  // Assets
  { code: '1010-01', name: 'Main Hospital Safe Vault (Liquid Cash Float)', classGroup: '1000 Assets', normalBalance: 'Debit', balance: 485000, status: 'Active Ledger' },
  { code: '1020-01', name: 'City Bank Ltd - Corporate Collection Account', classGroup: '1000 Assets', normalBalance: 'Debit', balance: 42500000, status: 'Active Ledger' },
  { code: '1020-02', name: 'Dutch-Bangla Bank - Operational Disbursement Account', classGroup: '1000 Assets', normalBalance: 'Debit', balance: 28500000, status: 'Active Ledger' },
  { code: '1030-01', name: 'Pharmacy Formulary Inventory Stock Assets', classGroup: '1000 Assets', normalBalance: 'Debit', balance: 24500000, status: 'Active Ledger' },
  { code: '1040-01', name: 'Accounts Receivable (IPD & Corporate Billing)', classGroup: '1000 Assets', normalBalance: 'Debit', balance: 3715000, status: 'Active Ledger' },
  { code: '1050-01', name: 'Medical Equipment & OT Machinery (Capitalized)', classGroup: '1000 Assets', normalBalance: 'Debit', balance: 32000000, status: 'Active Ledger' },

  // Liabilities
  { code: '2010-01', name: 'Accounts Payable to Pharmaceutical Suppliers (AP)', classGroup: '2000 Liabilities', normalBalance: 'Credit', balance: 32450000, status: 'Active Ledger' },
  { code: '2020-01', name: 'Patient IPD Advance Security Deposits', classGroup: '2000 Liabilities', normalBalance: 'Credit', balance: 2240000, status: 'Active Ledger' },
  { code: '2030-01', name: 'Withholding Tax (TDS) Payable to NBR', classGroup: '2000 Liabilities', normalBalance: 'Credit', balance: 1450000, status: 'Active Ledger' },
  { code: '2030-02', name: 'Mushak 6.3 VAT Payable to Government Treasury', classGroup: '2000 Liabilities', normalBalance: 'Credit', balance: 1400000, status: 'Active Ledger' },

  // Equity
  { code: '3010-01', name: 'Hospital Capital Reserves & Retained Operating Surplus', classGroup: '3000 Equity', normalBalance: 'Credit', balance: 264515000, status: 'Active Ledger' },

  // Revenue
  { code: '4010-01', name: 'Inpatient (IPD) Admissions, Bed & OT Revenue', classGroup: '4000 Revenue', normalBalance: 'Credit', balance: 9650000, status: 'Active Ledger' },
  { code: '4020-01', name: 'Outpatient (OPD) & Specialist Consultation Fees', classGroup: '4000 Revenue', normalBalance: 'Credit', balance: 1850000, status: 'Active Ledger' },
  { code: '4030-01', name: 'Biochemistry & Radiology Diagnostic Revenue', classGroup: '4000 Revenue', normalBalance: 'Credit', balance: 1860000, status: 'Active Ledger' },
  { code: '4040-01', name: 'Hospital Pharmacy Dispensing & Consumable Sales', classGroup: '4000 Revenue', normalBalance: 'Credit', balance: 1480000, status: 'Active Ledger' },

  // Expenses
  { code: '5010-01', name: 'Cost of Goods Sold (Medicines & Surgical Consumables)', classGroup: '5000 Expenses', normalBalance: 'Debit', balance: 3450000, status: 'Active Ledger' },
  { code: '5020-01', name: 'Senior Consultant & Visiting Surgeon Honorarium', classGroup: '5000 Expenses', normalBalance: 'Debit', balance: 1265000, status: 'Active Ledger' },
  { code: '5030-01', name: 'Hospital Staff Salaries & Nursing Allowances', classGroup: '5000 Expenses', normalBalance: 'Debit', balance: 4250000, status: 'Active Ledger' },
  { code: '5040-01', name: 'Medical Equipment AMC Maintenance & Oxygen Refill', classGroup: '5000 Expenses', normalBalance: 'Debit', balance: 980000, status: 'Active Ledger' },
];

interface AccountantSettingsViewProps {
  initialTab?: 'coa' | 'audit' | 'fiscal';
}

export const AccountantSettingsView: React.FC<AccountantSettingsViewProps> = ({
  initialTab = 'coa',
}) => {
  const [activeTab, setActiveTab] = useState<'coa' | 'audit' | 'fiscal'>(initialTab);
  const [coaAccounts] = useState<CoaAccountRecord[]>(CHART_OF_ACCOUNTS_DATA);
  const [auditLogs] = useState<FinancialAuditLogRecord[]>(FINANCIAL_AUDIT_LOGS_DATA);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  React.useEffect(() => {
    if (initialTab) setActiveTab(initialTab);
  }, [initialTab]);

  // COA Columns
  const coaColumns: DataTableColumn<CoaAccountRecord>[] = [
    {
      key: 'code',
      header: 'Account Code',
      sortable: true,
      sortValue: (r) => r.code,
      render: (r) => (
        <span className="font-mono font-bold text-slate-900 text-xs px-2 py-0.5 rounded bg-slate-100">
          {r.code}
        </span>
      ),
    },
    {
      key: 'name',
      header: 'Account Title & Ledger Description',
      sortable: true,
      sortValue: (r) => r.name,
      render: (r) => (
        <div>
          <span className="font-bold text-slate-900 text-xs block">{r.name}</span>
          <span className="text-[10px] text-slate-400 font-sans">Normal Balance: {r.normalBalance}</span>
        </div>
      ),
    },
    {
      key: 'classGroup',
      header: 'COA Classification',
      sortable: true,
      sortValue: (r) => r.classGroup,
      render: (r) => (
        <span
          className={`px-2 py-0.5 rounded text-[10.5px] font-bold border ${
            r.classGroup.includes('Assets')
              ? 'bg-blue-50 text-blue-700 border-blue-200'
              : r.classGroup.includes('Liabilities')
              ? 'bg-rose-50 text-rose-700 border-rose-200'
              : r.classGroup.includes('Revenue')
              ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
              : r.classGroup.includes('Expenses')
              ? 'bg-amber-50 text-amber-700 border-amber-200'
              : 'bg-purple-50 text-purple-700 border-purple-200'
          }`}
        >
          {r.classGroup}
        </span>
      ),
    },
    {
      key: 'balance',
      header: 'Ledger Balance (BDT)',
      align: 'right',
      sortable: true,
      sortValue: (r) => r.balance,
      render: (r) => (
        <span className="font-mono font-extrabold text-slate-900 text-xs">
          ৳ {r.balance.toLocaleString()}
        </span>
      ),
    },
    {
      key: 'status',
      header: 'Audit Status',
      align: 'center',
      render: (r) => (
        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
          {r.status}
        </span>
      ),
    },
  ];

  // Audit Columns
  const auditColumns: DataTableColumn<FinancialAuditLogRecord>[] = [
    {
      key: 'timestamp',
      header: 'Timestamp',
      sortable: true,
      sortValue: (r) => r.timestamp,
      render: (r) => (
        <span className="font-mono text-slate-700 text-xs block">
          {r.timestamp}
        </span>
      ),
    },
    {
      key: 'action',
      header: 'Event & Action',
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
      header: 'Staff Auditor',
      sortable: true,
      sortValue: (r) => r.staffName,
      render: (r) => (
        <div>
          <span className="font-semibold text-slate-800 text-xs block">{r.staffName} ({r.staffRole})</span>
          <span className="text-[10px] text-slate-400 font-mono">IP: {r.ipAddress}</span>
        </div>
      ),
    },
    {
      key: 'module',
      header: 'Module Head',
      render: (r) => (
        <span className="px-2 py-0.5 rounded text-[10.5px] font-semibold bg-slate-100 text-slate-700">
          {r.module}
        </span>
      ),
    },
    {
      key: 'amount',
      header: 'Transaction Amount',
      align: 'right',
      sortable: true,
      sortValue: (r) => r.amount,
      render: (r) => (
        <span className="font-mono font-extrabold text-[#006a4e] text-xs">
          ৳ {r.amount.toLocaleString()}
        </span>
      ),
    },
    {
      key: 'id',
      header: 'Hash Status',
      align: 'center',
      render: () => (
        <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1 justify-center">
          <Lock className="w-3 h-3 text-emerald-600" />
          <span>Verified</span>
        </span>
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
          onClick={() => setActiveTab('coa')}
          className={`px-3.5 py-2 text-xs font-semibold cursor-pointer border-b-2 transition-colors flex items-center gap-1.5 -mb-[1px] ${
            activeTab === 'coa'
              ? 'border-[#006a4e] text-[#006a4e]'
              : 'border-transparent text-slate-600 hover:text-slate-900'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>Chart of Accounts (COA) ({coaAccounts.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('audit')}
          className={`px-3.5 py-2 text-xs font-semibold cursor-pointer border-b-2 transition-colors flex items-center gap-1.5 -mb-[1px] ${
            activeTab === 'audit'
              ? 'border-[#006a4e] text-[#006a4e]'
              : 'border-transparent text-slate-600 hover:text-slate-900'
          }`}
        >
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Financial Audit Logs ({auditLogs.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('fiscal')}
          className={`px-3.5 py-2 text-xs font-semibold cursor-pointer border-b-2 transition-colors flex items-center gap-1.5 -mb-[1px] ${
            activeTab === 'fiscal'
              ? 'border-[#006a4e] text-[#006a4e]'
              : 'border-transparent text-slate-600 hover:text-slate-900'
          }`}
        >
          <Settings className="w-3.5 h-3.5" />
          <span>Fiscal Year &amp; Tax Configuration</span>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: CHART OF ACCOUNTS (COA)                                            */}
      {/* ========================================================================= */}
      {activeTab === 'coa' && (
        <div className="space-y-3">
          <SummaryCardGrid>
            <SummaryCard
              title="Active Ledger Heads"
              icon={Layers}
              iconColor="text-[#006a4e]"
              value={`${coaAccounts.length} Accounts`}
              subtitle="5 Primary Balance Sheet & P&L Groups"
            />
            <SummaryCard
              title="Audit Trial Balance Match"
              icon={Scale}
              iconColor="text-[#006a4e]"
              value="Balanced (0 Diff)"
              subtitle="Debits equal Credits perfectly"
            />
            <SummaryCard
              title="ICAB Standard Coding"
              icon={CheckCircle2}
              iconColor="text-blue-600"
              value="4-Digit Numerical"
              subtitle="Compliant with National Accounting Rules"
            />
          </SummaryCardGrid>

          <div className="space-y-1.5">
            <h3 className="text-xs font-bold text-slate-800 px-0.5">
              Green Life Hospital General Ledger Master Chart of Accounts (COA)
            </h3>
            <DataTable<CoaAccountRecord>
              data={coaAccounts}
              columns={coaColumns}
              keyExtractor={(item) => item.code}
              searchPlaceholder="Search account code, title, or classification group..."
              searchFilter={(item, query) =>
                item.code.includes(query) ||
                item.name.toLowerCase().includes(query.toLowerCase()) ||
                item.classGroup.toLowerCase().includes(query.toLowerCase())
              }
              showSerial={true}
            />
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: FINANCIAL AUDIT LOGS                                               */}
      {/* ========================================================================= */}
      {activeTab === 'audit' && (
        <div className="space-y-3">
          <SummaryCardGrid>
            <SummaryCard
              title="Immutable Audit Records"
              icon={ShieldCheck}
              iconColor="text-[#006a4e]"
              value={`${auditLogs.length} Events Logged`}
              subtitle="SHA-256 Tamper-Proof Cryptographic Hash"
            />
            <SummaryCard
              title="Cash & Disbursement Verifications"
              icon={Wallet}
              iconColor="text-blue-600"
              value="100% Verified"
              subtitle="Dual sign-off on IPD discharges & AP"
            />
            <SummaryCard
              title="System Integrity Status"
              icon={Lock}
              iconColor="text-emerald-700"
              value="Clean Audit Trail"
              subtitle="Zero unverified ledger tampering detected"
            />
          </SummaryCardGrid>

          <div className="space-y-1.5">
            <h3 className="text-xs font-bold text-slate-800 px-0.5">
              Financial Operation Access Logs &amp; Immutable Transaction Trail
            </h3>
            <DataTable<FinancialAuditLogRecord>
              data={auditLogs}
              columns={auditColumns}
              keyExtractor={(item) => item.id}
              searchPlaceholder="Search audit events by action, staff name, or module..."
              searchFilter={(item, query) =>
                item.action.toLowerCase().includes(query.toLowerCase()) ||
                item.staffName.toLowerCase().includes(query.toLowerCase()) ||
                item.module.toLowerCase().includes(query.toLowerCase()) ||
                item.referenceNo.toLowerCase().includes(query.toLowerCase())
              }
              showSerial={true}
            />
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: FISCAL YEAR & TAX SETTINGS                                         */}
      {/* ========================================================================= */}
      {activeTab === 'fiscal' && (
        <div className="space-y-3">
          <div className="px-0.5">
            <h3 className="text-xs font-bold text-slate-900">
              Institutional Fiscal Year &amp; Government Tax Settings
            </h3>
            <p className="text-[11px] text-slate-500">
              Master parameters configured for National Board of Revenue (NBR) compliance and audit standards.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
            <div className="p-3.5 bg-white border border-slate-300/80 rounded-[3px] shadow-xs space-y-2">
              <span className="font-bold text-slate-900 block text-xs border-b pb-1">
                Active Hospital Fiscal Term
              </span>
              <div className="flex justify-between py-1 border-b border-slate-200/60">
                <span className="text-slate-600">Fiscal Year Range:</span>
                <strong className="text-slate-900 font-mono">July 01, 2026 - June 30, 2027</strong>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200/60">
                <span className="text-slate-600">Current Accounting Period:</span>
                <strong className="text-slate-900 font-mono">Month 5 (November 2026)</strong>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200/60">
                <span className="text-slate-600">Statutory Base Currency:</span>
                <strong className="text-slate-900">Bangladeshi Taka (BDT / ৳)</strong>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-600">Accounting Convention:</span>
                <strong className="text-[#006a4e]">Accrual Basis (IAS 1 &amp; IFRS)</strong>
              </div>
            </div>

            <div className="p-3.5 bg-white border border-slate-300/80 rounded-[3px] shadow-xs space-y-2">
              <span className="font-bold text-slate-900 block text-xs border-b pb-1">
                Tax &amp; NBR Registration Credentials
              </span>
              <div className="flex justify-between py-1 border-b border-slate-200/60">
                <span className="text-slate-600">Hospital VAT BIN:</span>
                <strong className="text-slate-900 font-mono">00142941-0102</strong>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200/60">
                <span className="text-slate-600">Tax Identification Number (e-TIN):</span>
                <strong className="text-slate-900 font-mono">8841-2094-1102-GLH</strong>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200/60">
                <span className="text-slate-600">Doctor Share TDS Rate:</span>
                <strong className="text-rose-600 font-mono">10.0% Under Section 52A</strong>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-600">Vendor AP TDS Withholding:</span>
                <strong className="text-slate-900 font-mono">5.0% - 7.5% Category-based</strong>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
