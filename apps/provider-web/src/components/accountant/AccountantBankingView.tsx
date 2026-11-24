import React, { useState } from 'react';
import {
  Banknote,
  CheckCircle2,
  Landmark,
  Printer,
  RefreshCw,
  Scale,
  ShieldCheck,
  TrendingUp,
  Wallet,
  X,
} from 'lucide-react';
import { SummaryCard, SummaryCardGrid } from '../common/SummaryCard';
import { DataTable, DataTableColumn } from '../common/DataTable';
import {
  BANK_ACCOUNTS_DATA,
  BankAccountRecord,
} from '../../data/accountantPortalData';

export interface BankReconciliationItem {
  id: string;
  bankName: string;
  accountNo: string;
  statementDate: string;
  balancePerBank: number;
  uncreditedDeposits: number;
  unpresentedCheques: number;
  balancePerBooks: number;
  reconciledDifference: number;
  status: 'Reconciled (Zero Diff)' | 'Pending Verification';
}

export interface VaultDenominationRecord {
  denomination: string;
  count: number;
  total: number;
}

export const BANK_RECONCILIATION_DATA: BankReconciliationItem[] = [
  {
    id: 'BRS-01',
    bankName: 'The City Bank PLC (Dhanmondi Br.)',
    accountNo: '110-2849104-001',
    statementDate: '2026-11-23',
    balancePerBank: 34570000,
    uncreditedDeposits: 450000,
    unpresentedCheques: 380000,
    balancePerBooks: 34500000,
    reconciledDifference: 0,
    status: 'Reconciled (Zero Diff)',
  },
  {
    id: 'BRS-02',
    bankName: 'Dutch-Bangla Bank PLC (Satmasjid Br.)',
    accountNo: '108-110-098273',
    statementDate: '2026-11-23',
    balancePerBank: 18670000,
    uncreditedDeposits: 620000,
    unpresentedCheques: 150000,
    balancePerBooks: 18200000,
    reconciledDifference: 0,
    status: 'Reconciled (Zero Diff)',
  },
  {
    id: 'BRS-03',
    bankName: 'BRAC Bank PLC (Gulshan Br.)',
    accountNo: '150-120-482910',
    statementDate: '2026-11-23',
    balancePerBank: 13960000,
    uncreditedDeposits: 0,
    unpresentedCheques: 840000,
    balancePerBooks: 14800000,
    reconciledDifference: 0,
    status: 'Reconciled (Zero Diff)',
  },
];

export const VAULT_CASH_DENOMINATIONS: VaultDenominationRecord[] = [
  { denomination: '৳ 1,000 Note', count: 350, total: 350000 },
  { denomination: '৳ 500 Note', count: 180, total: 90000 },
  { denomination: '৳ 200 Note', count: 150, total: 30000 },
  { denomination: '৳ 100 Note', count: 120, total: 12000 },
  { denomination: '৳ 50 Note', count: 60, total: 3000 },
];

interface AccountantBankingViewProps {
  initialTab?: 'accounts' | 'reconcile' | 'vault';
}

export const AccountantBankingView: React.FC<AccountantBankingViewProps> = ({
  initialTab = 'accounts',
}) => {
  const [activeTab, setActiveTab] = useState<'accounts' | 'reconcile' | 'vault'>(initialTab);
  const [bankAccounts] = useState<BankAccountRecord[]>(BANK_ACCOUNTS_DATA);
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

  const totalVaultCash = VAULT_CASH_DENOMINATIONS.reduce((sum, d) => sum + d.total, 0);

  // Bank Account Columns
  const bankColumns: DataTableColumn<BankAccountRecord>[] = [
    {
      key: 'bankName',
      header: 'Banking Institution & Account',
      sortable: true,
      sortValue: (r) => r.bankName,
      render: (r) => (
        <div>
          <span className="font-bold text-slate-900 text-xs block">{r.bankName}</span>
          <span className="text-[11px] text-slate-500 font-medium">
            A/C: <span className="font-mono text-slate-700">{r.accountNumber}</span> · Branch: {r.branch}
          </span>
        </div>
      ),
    },
    {
      key: 'accountName',
      header: 'Account Purpose & Routing',
      render: (r) => (
        <div>
          <span className="text-xs font-semibold text-slate-800 block">{r.accountName}</span>
          <span className="text-[10px] text-slate-400 font-mono">Routing: {r.routingNumber}</span>
        </div>
      ),
    },
    {
      key: 'currentBookBalance',
      header: 'General Ledger (Books)',
      align: 'right',
      sortable: true,
      sortValue: (r) => r.currentBookBalance,
      render: (r) => (
        <span className="font-mono font-bold text-slate-800 text-xs">
          ৳ {r.currentBookBalance.toLocaleString()}
        </span>
      ),
    },
    {
      key: 'reconciledBankBalance',
      header: 'Live Bank Balance',
      align: 'right',
      sortable: true,
      sortValue: (r) => r.reconciledBankBalance,
      render: (r) => (
        <span className="font-mono font-extrabold text-[#006a4e] text-xs">
          ৳ {r.reconciledBankBalance.toLocaleString()}
        </span>
      ),
    },
    {
      key: 'uncreditedDeposits',
      header: 'Float (Deposits / Cheques)',
      align: 'right',
      render: (r) => (
        <div className="text-right">
          <span className="font-mono text-xs text-emerald-700 block">+ ৳ {r.uncreditedDeposits.toLocaleString()}</span>
          <span className="font-mono text-[10px] text-rose-500">- ৳ {r.unpresentedCheques.toLocaleString()}</span>
        </div>
      ),
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
    {
      key: 'id',
      header: 'Action',
      align: 'center',
      render: (r) => (
        <button
          type="button"
          onClick={() => showToast(`Fetched electronic live statement from ${r.bankName}`)}
          className="h-7 px-2.5 rounded-[3px] border border-slate-300 hover:bg-slate-50 text-slate-700 text-[11px] font-semibold inline-flex items-center gap-1 cursor-pointer shadow-2xs"
        >
          <RefreshCw className="w-3 h-3 text-slate-400" />
          <span>Sync</span>
        </button>
      ),
    },
  ];

  // BRS Columns
  const brsColumns: DataTableColumn<BankReconciliationItem>[] = [
    {
      key: 'bankName',
      header: 'Account / Statement Date',
      sortable: true,
      sortValue: (r) => r.bankName,
      render: (r) => (
        <div>
          <span className="font-bold text-slate-900 text-xs block">{r.bankName}</span>
          <span className="text-[11px] text-slate-500 font-mono">
            A/C: {r.accountNo} · Statement Date: {r.statementDate}
          </span>
        </div>
      ),
    },
    {
      key: 'balancePerBank',
      header: 'Balance per Bank',
      align: 'right',
      render: (r) => (
        <span className="font-mono font-bold text-slate-800 text-xs">
          ৳ {r.balancePerBank.toLocaleString()}
        </span>
      ),
    },
    {
      key: 'uncreditedDeposits',
      header: '+ Uncredited Deposits',
      align: 'right',
      render: (r) => (
        <span className="font-mono text-emerald-700 text-xs">
          ৳ {r.uncreditedDeposits.toLocaleString()}
        </span>
      ),
    },
    {
      key: 'unpresentedCheques',
      header: '- Unpresented Cheques',
      align: 'right',
      render: (r) => (
        <span className="font-mono text-rose-500 text-xs">
          - ৳ {r.unpresentedCheques.toLocaleString()}
        </span>
      ),
    },
    {
      key: 'balancePerBooks',
      header: '= Balance per Books',
      align: 'right',
      render: (r) => (
        <span className="font-mono font-extrabold text-[#006a4e] text-xs">
          ৳ {r.balancePerBooks.toLocaleString()}
        </span>
      ),
    },
    {
      key: 'status',
      header: 'Audit Match',
      align: 'center',
      render: (r) => (
        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
          {r.status}
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
          onClick={() => setActiveTab('accounts')}
          className={`px-3.5 py-2 text-xs font-semibold cursor-pointer border-b-2 transition-colors flex items-center gap-1.5 -mb-[1px] ${
            activeTab === 'accounts'
              ? 'border-[#006a4e] text-[#006a4e]'
              : 'border-transparent text-slate-600 hover:text-slate-900'
          }`}
        >
          <Landmark className="w-3.5 h-3.5" />
          <span>Bank Accounts &amp; Liquid Cash ({bankAccounts.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('reconcile')}
          className={`px-3.5 py-2 text-xs font-semibold cursor-pointer border-b-2 transition-colors flex items-center gap-1.5 -mb-[1px] ${
            activeTab === 'reconcile'
              ? 'border-[#006a4e] text-[#006a4e]'
              : 'border-transparent text-slate-600 hover:text-slate-900'
          }`}
        >
          <Scale className="w-3.5 h-3.5" />
          <span>Bank Reconciliation (BRS) ({BANK_RECONCILIATION_DATA.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('vault')}
          className={`px-3.5 py-2 text-xs font-semibold cursor-pointer border-b-2 transition-colors flex items-center gap-1.5 -mb-[1px] ${
            activeTab === 'vault'
              ? 'border-[#006a4e] text-[#006a4e]'
              : 'border-transparent text-slate-600 hover:text-slate-900'
          }`}
        >
          <Banknote className="w-3.5 h-3.5" />
          <span>Hospital Vault &amp; Cash Float (৳ 4.85L)</span>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: BANK ACCOUNTS                                                      */}
      {/* ========================================================================= */}
      {activeTab === 'accounts' && (
        <div className="space-y-3">
          <SummaryCardGrid>
            <SummaryCard
              title="Total Hospital Liquid Bank Balance"
              icon={Landmark}
              iconColor="text-[#006a4e]"
              value="৳ 6.75 Cr"
              subtitle="City Bank · DBBL · BRAC Bank Accounts"
            />
            <SummaryCard
              title="Daily Deposit Cleared"
              icon={CheckCircle2}
              iconColor="text-[#006a4e]"
              value="৳ 12,50,000"
              subtitle="Counter collections banked today"
            />
            <SummaryCard
              title="BRS Reconciliation Status"
              icon={Scale}
              iconColor="text-blue-600"
              value="0 Variance"
              subtitle="100% matched with general ledger"
            />
          </SummaryCardGrid>

          <div className="bg-white rounded-[4px] border border-slate-200/90 p-3 shadow-xs">
            <h3 className="text-xs font-bold text-slate-900 mb-2">
              Hospital Primary Operating &amp; Escrow Bank Accounts Master
            </h3>
            <DataTable<BankAccountRecord>
              data={bankAccounts}
              columns={bankColumns}
              keyExtractor={(item) => item.id}
              searchPlaceholder="Search bank accounts by institution or account #..."
              searchFilter={(item, query) =>
                item.bankName.toLowerCase().includes(query.toLowerCase()) ||
                item.accountNumber.includes(query)
              }
              showSerial={true}
            />
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: BANK RECONCILIATION STATEMENT (BRS)                                */}
      {/* ========================================================================= */}
      {activeTab === 'reconcile' && (
        <div className="space-y-3">
          <SummaryCardGrid>
            <SummaryCard
              title="Reconciled Bank Accounts"
              icon={CheckCircle2}
              iconColor="text-[#006a4e]"
              value="3 of 3 Accounts"
              subtitle="All accounts balanced to zero variance"
            />
            <SummaryCard
              title="Uncredited In-Transit Deposits"
              icon={TrendingUp}
              iconColor="text-blue-600"
              value="৳ 10,70,000"
              subtitle="Clearing in tomorrow's BACPS batch"
            />
            <SummaryCard
              title="Unpresented Vendor Cheques"
              icon={Wallet}
              iconColor="text-amber-600"
              value="৳ 13,70,000"
              subtitle="Cheques issued, not yet debited"
            />
          </SummaryCardGrid>

          <div className="bg-white rounded-[4px] border border-slate-200/90 p-3 shadow-xs">
            <h3 className="text-xs font-bold text-slate-900 mb-2">
              Monthly Bank Reconciliation Statement (BRS) &amp; Float Analysis
            </h3>
            <DataTable<BankReconciliationItem>
              data={BANK_RECONCILIATION_DATA}
              columns={brsColumns}
              keyExtractor={(item) => item.id}
              searchPlaceholder="Search bank reconciliation statements..."
              searchFilter={(item, query) =>
                item.bankName.toLowerCase().includes(query.toLowerCase()) ||
                item.accountNo.includes(query)
              }
              showSerial={true}
            />
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: HOSPITAL VAULT CASH FLOAT                                          */}
      {/* ========================================================================= */}
      {activeTab === 'vault' && (
        <div className="space-y-3">
          <SummaryCardGrid>
            <SummaryCard
              title="Total Cash in Vault Safe"
              icon={Banknote}
              iconColor="text-[#006a4e]"
              value={`৳ ${totalVaultCash.toLocaleString()}`}
              subtitle="Counted & dual-signed by Accounts Lead"
            />
            <SummaryCard
              title="Daily Emergency Float Reserved"
              icon={ShieldCheck}
              iconColor="text-blue-600"
              value="৳ 1,50,000"
              subtitle="For rapid patient refunds & night purchases"
            />
            <SummaryCard
              title="Security Deposit in Transit"
              icon={Wallet}
              iconColor="text-emerald-700"
              value="৳ 3,35,000"
              subtitle="Ready for armored cash pickup"
            />
          </SummaryCardGrid>

          <div className="bg-white rounded-[4px] border border-slate-200/90 p-4 shadow-xs space-y-3">
            <div className="flex items-center justify-between border-b pb-2">
              <div>
                <h3 className="text-xs font-bold text-slate-900">
                  Physical Vault Cash Denomination &amp; Audit Breakdown
                </h3>
                <p className="text-[11px] text-slate-500">
                  Daily physical currency note audit in hospital main safe vault.
                </p>
              </div>
              <button
                type="button"
                onClick={() => showToast('Printed Bank Cash Deposit Slip')}
                className="h-8 px-3 rounded-[3px] bg-[#006a4e] hover:bg-[#00553e] text-white text-xs font-semibold inline-flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Deposit Slip</span>
              </button>
            </div>

            <div className="border border-slate-200 rounded-[3px] overflow-hidden text-xs">
              <table className="w-full text-left">
                <thead className="bg-[#0c2e4b] text-white text-[11px]">
                  <tr>
                    <th className="py-2.5 px-3">Currency Note Denomination</th>
                    <th className="py-2.5 px-3 text-center">Physical Note Count</th>
                    <th className="py-2.5 px-3 text-right">Subtotal Value (BDT)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-mono text-[11.5px]">
                  {VAULT_CASH_DENOMINATIONS.map((row, idx) => (
                    <tr key={idx} className="hover:bg-slate-50">
                      <td className="py-2 px-3 font-sans font-medium text-slate-800">{row.denomination}</td>
                      <td className="py-2 px-3 text-center font-bold text-slate-700">{row.count} Notes</td>
                      <td className="py-2 px-3 text-right font-bold text-slate-900">৳ {row.total.toLocaleString()}</td>
                    </tr>
                  ))}
                  <tr className="bg-[#edf6f2] text-[#006a4e] font-extrabold text-sm">
                    <td className="py-2.5 px-3 font-sans">Total Certified Cash-in-Vault</td>
                    <td className="py-2.5 px-3 text-center font-bold">
                      {VAULT_CASH_DENOMINATIONS.reduce((sum, r) => sum + r.count, 0)} Total Notes
                    </td>
                    <td className="py-2.5 px-3 text-right">৳ {totalVaultCash.toLocaleString()}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
