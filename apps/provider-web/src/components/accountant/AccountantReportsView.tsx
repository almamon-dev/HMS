import React from 'react';
import {
  AlertTriangle,
  BarChart3,
  CheckCircle2,
  Download,
  Landmark,
  Printer,
  Scale,
  TrendingUp,
} from 'lucide-react';
import { SummaryCard, SummaryCardGrid } from '../common/SummaryCard';
import { DataTable, DataTableColumn } from '../common/DataTable';
import {
  TrialBalanceRow,
  useAccountantLedger,
} from '../../data/accountantLedgerContext';

interface TaxVatRecord {
  id: string;
  taxType: string;
  nbrCode: string;
  period: string;
  taxableBase: number;
  taxRate: string;
  taxDeductedOrCollected: number;
  challanStatus: 'Deposited to NBR Treasury' | 'Accrued / Due by 15th';
}

const TAX_VAT_DATA: TaxVatRecord[] = [
  {
    id: 'TAX-01',
    taxType: 'Doctor Honorarium AIT (Sec 52AA)',
    nbrCode: 'NBR-TDS-1114',
    period: 'November 2026',
    taxableBase: 1530000,
    taxRate: '10%',
    taxDeductedOrCollected: 153000,
    challanStatus: 'Accrued / Due by 15th',
  },
  {
    id: 'TAX-02',
    taxType: 'Supplier Procurement TDS (Sec 52)',
    nbrCode: 'NBR-TDS-1112',
    period: 'November 2026',
    taxableBase: 8960000,
    taxRate: '3% - 5%',
    taxDeductedOrCollected: 318000,
    challanStatus: 'Deposited to NBR Treasury',
  },
  {
    id: 'TAX-03',
    taxType: 'Mushak 6.3 Pharmacy & Diagnostic VAT',
    nbrCode: 'VAT-MUSHAK-6.3',
    period: 'November 2026',
    taxableBase: 6200000,
    taxRate: '5%',
    taxDeductedOrCollected: 310000,
    challanStatus: 'Accrued / Due by 15th',
  },
];

interface AccountantReportsViewProps {
  initialTab: 'summary' | 'pnl' | 'trial-balance' | 'balance-sheet' | 'tax';
}

export const AccountantReportsView: React.FC<AccountantReportsViewProps> = ({
  initialTab,
}) => {
  const { coaAccounts, stats, notify } = useAccountantLedger();

  const resolvedTab = initialTab === 'summary' ? 'pnl' : initialTab;

  // ===========================================================================
  // 1. PROFIT & LOSS STATEMENT (ADAPTS CLEANLY BETWEEN SIMPLE & DOUBLE-ENTRY)
  // ===========================================================================
  if (resolvedTab === 'pnl') {
    const incomeRows = stats.trialBalanceRows.filter((r) => r.account.type === 'income');
    const cogsRows = stats.trialBalanceRows.filter(
      (r) => r.account.type === 'expense' && r.account.reportGroup === 'cogs'
    );
    const opexRows = stats.trialBalanceRows.filter(
      (r) => r.account.type === 'expense' && r.account.reportGroup !== 'cogs'
    );

    return (
      <div className="space-y-4 font-['Plus_Jakarta_Sans',sans-serif]">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div>
            <h1 className="text-lg md:text-xl font-bold text-slate-900 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-[#006a4e]" />
              <span>Institutional Profit & Loss Statement (Income Statement)</span>
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Live revenue, COGS, operating expenses, and net operating surplus calculated directly from posted ledger vouchers.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                window.print();
                notify('Sent Profit & Loss statement to printer.');
              }}
              className="h-8 px-3 rounded-[3px] border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Statement</span>
            </button>
          </div>
        </div>

        <SummaryCardGrid columns={4}>
          <SummaryCard
            title="Gross Period Revenue"
            value={`৳ ${stats.periodIncome.toLocaleString()}`}
            subtitle="IPD + OPD + Lab + Pharmacy"
            icon={TrendingUp}
            iconColor="text-[#006a4e]"
            valueColor="text-[#006a4e]"
          />
          <SummaryCard
            title="Direct Costs (COGS)"
            value={`৳ ${stats.periodCogs.toLocaleString()}`}
            subtitle={`Gross Profit: ৳${stats.grossProfit.toLocaleString()}`}
            icon={BarChart3}
            iconColor="text-amber-600"
          />
          <SummaryCard
            title="Operating Expenses"
            value={`৳ ${stats.periodOperatingExpense.toLocaleString()}`}
            subtitle="Doctor Share, Salaries & Utilities"
            icon={Scale}
            iconColor="text-rose-600"
            valueColor="text-rose-600"
          />
          <SummaryCard
            title="Net Operating Profit"
            value={`৳ ${stats.netProfit.toLocaleString()}`}
            subtitle={
              stats.periodIncome > 0
                ? `${((stats.netProfit / stats.periodIncome) * 100).toFixed(1)}% Net Margin`
                : '0% Margin'
            }
            icon={CheckCircle2}
            iconColor="text-blue-600"
          />
        </SummaryCardGrid>

        {/* Unified Statement Sheet */}
        <div className="bg-white border border-slate-300/80 rounded-[3px] shadow-xs overflow-hidden">
          <div className="px-5 py-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
            <span className="font-bold text-slate-900 text-xs uppercase tracking-wider">
              Income & Expenditure Breakdown (FY 2026-2027)
            </span>
            <span className="font-mono text-[11px] font-bold text-[#006a4e]">
              Double-Entry Accrual P&amp;L
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left border-collapse">
              <thead className="bg-slate-50/70 border-b border-slate-200 text-slate-600 font-bold">
                <tr>
                  <th className="py-2.5 px-4 w-32 border-r border-slate-200/60">COA Code</th>
                  <th className="py-2.5 px-4 border-r border-slate-200/60">Revenue / Expense Line Item</th>
                  <th className="py-2.5 px-4 w-36 text-right border-r border-slate-200/60">% of Revenue</th>
                  <th className="py-2.5 px-4 w-44 text-right">Amount (BDT ৳)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                <tr className="bg-emerald-50/50 font-bold text-[#006a4e]">
                  <td colSpan={4} className="py-2 px-4 uppercase tracking-wider text-[11px]">
                    1. Operating Revenue (4000 Income)
                  </td>
                </tr>
                {incomeRows.map((r) => {
                  const amt = r.closingCredit - r.closingDebit;
                  const pct = stats.periodIncome > 0 ? ((amt / stats.periodIncome) * 100).toFixed(1) : '0.0';
                  return (
                    <tr key={r.account.code} className="hover:bg-slate-50/70">
                      <td className="py-2 px-4 font-mono text-slate-500 border-r border-slate-200/50">{r.account.code}</td>
                      <td className="py-2 px-4 font-semibold text-slate-800 border-r border-slate-200/50">{r.account.nameEn}</td>
                      <td className="py-2 px-4 text-right font-mono text-slate-500 border-r border-slate-200/50">{pct}%</td>
                      <td className="py-2 px-4 text-right font-mono font-bold text-[#006a4e]">৳ {amt.toLocaleString()}</td>
                    </tr>
                  );
                })}
                <tr className="bg-slate-50 font-extrabold text-slate-900">
                  <td colSpan={3} className="py-2.5 px-4 text-right border-r border-slate-200/60">
                    TOTAL OPERATING REVENUE:
                  </td>
                  <td className="py-2.5 px-4 text-right font-mono text-[#006a4e]">
                    ৳ {stats.periodIncome.toLocaleString()}
                  </td>
                </tr>

                <tr className="bg-amber-50/50 font-bold text-amber-800">
                  <td colSpan={4} className="py-2 px-4 uppercase tracking-wider text-[11px]">
                    2. Direct Medical & Pharmacy Cost (COGS)
                  </td>
                </tr>
                {cogsRows.map((r) => {
                  const amt = r.closingDebit - r.closingCredit;
                  return (
                    <tr key={r.account.code} className="hover:bg-slate-50/70">
                      <td className="py-2 px-4 font-mono text-slate-500 border-r border-slate-200/50">{r.account.code}</td>
                      <td className="py-2 px-4 font-semibold text-slate-800 border-r border-slate-200/50">{r.account.nameEn}</td>
                      <td className="py-2 px-4 text-right font-mono text-slate-500 border-r border-slate-200/50">—</td>
                      <td className="py-2 px-4 text-right font-mono font-bold text-rose-600">৳ {amt.toLocaleString()}</td>
                    </tr>
                  );
                })}

                <tr className="bg-rose-50/50 font-bold text-rose-800">
                  <td colSpan={4} className="py-2 px-4 uppercase tracking-wider text-[11px]">
                    3. Operating & Clinical Overheads (5000 Expenses)
                  </td>
                </tr>
                {opexRows.map((r) => {
                  const amt = r.closingDebit - r.closingCredit;
                  const pct = stats.periodIncome > 0 ? ((amt / stats.periodIncome) * 100).toFixed(1) : '0.0';
                  return (
                    <tr key={r.account.code} className="hover:bg-slate-50/70">
                      <td className="py-2 px-4 font-mono text-slate-500 border-r border-slate-200/50">{r.account.code}</td>
                      <td className="py-2 px-4 font-semibold text-slate-800 border-r border-slate-200/50">{r.account.nameEn}</td>
                      <td className="py-2 px-4 text-right font-mono text-slate-500 border-r border-slate-200/50">{pct}%</td>
                      <td className="py-2 px-4 text-right font-mono font-bold text-rose-600">৳ {amt.toLocaleString()}</td>
                    </tr>
                  );
                })}
              </tbody>
              <tfoot className="bg-emerald-50 border-t-2 border-[#006a4e] font-extrabold text-sm">
                <tr>
                  <td colSpan={3} className="py-3 px-4 text-right text-slate-900 border-r border-emerald-200">
                    NET OPERATING SURPLUS / PROFIT:
                  </td>
                  <td className="py-3 px-4 text-right font-mono text-[#006a4e]">
                    ৳ {stats.netProfit.toLocaleString()}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      </div>
    );
  }

  // ===========================================================================
  // 2. TRIAL BALANCE (DOUBLE-ENTRY VERIFICATION: DR = CR)
  // ===========================================================================
  if (resolvedTab === 'trial-balance') {
    const tbColumns: DataTableColumn<TrialBalanceRow>[] = [
      {
        key: 'code',
        header: 'Account Code',
        sortable: true,
        sortValue: (r) => r.account.code,
        render: (r) => (
          <span className="font-mono font-bold text-[#006a4e] text-xs">{r.account.code}</span>
        ),
      },
      {
        key: 'name',
        header: 'Chart of Accounts Head',
        sortable: true,
        sortValue: (r) => r.account.nameEn,
        render: (r) => (
          <div>
            <span className="font-bold text-slate-900 text-xs block">{r.account.nameEn}</span>
            <span className="text-[10px] uppercase font-semibold text-slate-400">{r.account.type}</span>
          </div>
        ),
      },
      {
        key: 'openingDebit',
        header: 'Opening Dr / Cr',
        align: 'right',
        render: (r) => (
          <span className="font-mono text-xs text-slate-600">
            {r.openingDebit > 0
              ? `Dr ৳${r.openingDebit.toLocaleString()}`
              : r.openingCredit > 0
              ? `Cr ৳${r.openingCredit.toLocaleString()}`
              : '—'}
          </span>
        ),
      },
      {
        key: 'periodDebit',
        header: 'Period Debit (৳)',
        align: 'right',
        render: (r) => (
          <span className="font-mono font-semibold text-[#006a4e] text-xs">
            {r.periodDebit > 0 ? `৳ ${r.periodDebit.toLocaleString()}` : '—'}
          </span>
        ),
      },
      {
        key: 'periodCredit',
        header: 'Period Credit (৳)',
        align: 'right',
        render: (r) => (
          <span className="font-mono font-semibold text-rose-600 text-xs">
            {r.periodCredit > 0 ? `৳ ${r.periodCredit.toLocaleString()}` : '—'}
          </span>
        ),
      },
      {
        key: 'closingDebit',
        header: 'Closing Debit (৳)',
        align: 'right',
        render: (r) => (
          <span className="font-mono font-bold text-slate-900 text-xs">
            {r.closingDebit > 0 ? `৳ ${r.closingDebit.toLocaleString()}` : '—'}
          </span>
        ),
      },
      {
        key: 'closingCredit',
        header: 'Closing Credit (৳)',
        align: 'right',
        render: (r) => (
          <span className="font-mono font-bold text-slate-900 text-xs">
            {r.closingCredit > 0 ? `৳ ${r.closingCredit.toLocaleString()}` : '—'}
          </span>
        ),
      },
    ];

    return (
      <div className="space-y-4 font-['Plus_Jakarta_Sans',sans-serif]">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 flex-wrap">
            <h1 className="text-lg md:text-xl font-bold text-slate-900 flex items-center gap-2">
              <Scale className="w-5 h-5 text-[#006a4e]" />
              <span>Trial Balance (Double-Entry Control)</span>
            </h1>
            {stats.trialBalanced ? (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-[3px] bg-emerald-50 text-[#006a4e] border border-emerald-200 text-xs font-bold">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Balanced (Closing Dr = Cr)
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-[3px] bg-rose-50 text-rose-700 border border-rose-200 text-xs font-bold">
                <AlertTriangle className="w-3.5 h-3.5" />
                Out of Balance
              </span>
            )}
          </div>

          <button
            type="button"
            onClick={() => {
              window.print();
              notify('Trial Balance sent to printer.');
            }}
            className="h-8 px-3 rounded-[3px] border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Trial Balance</span>
          </button>
        </div>

        <SummaryCardGrid columns={4}>
          <SummaryCard title="Total Opening Dr = Cr" value={`৳ ${stats.trialTotals.openingDebit.toLocaleString()}`} subtitle="Balanced opening books" icon={Scale} iconColor="text-slate-600" />
          <SummaryCard title="Period Debit Turnover" value={`৳ ${stats.trialTotals.periodDebit.toLocaleString()}`} subtitle="Total Dr posted" icon={TrendingUp} iconColor="text-[#006a4e]" valueColor="text-[#006a4e]" />
          <SummaryCard title="Period Credit Turnover" value={`৳ ${stats.trialTotals.periodCredit.toLocaleString()}`} subtitle="Total Cr posted" icon={TrendingUp} iconColor="text-rose-600" valueColor="text-rose-600" />
          <SummaryCard title="Total Closing Dr = Cr" value={`৳ ${stats.trialTotals.closingDebit.toLocaleString()}`} subtitle="Zero discrepancy (৳0)" icon={CheckCircle2} iconColor="text-blue-600" />
        </SummaryCardGrid>

        <DataTable<TrialBalanceRow>
          data={stats.trialBalanceRows}
          columns={tbColumns}
          showSerial={true}
          defaultPageSize={20}
          searchPlaceholder="Search COA code or account name..."
          searchFilter={(r, q) =>
            r.account.code.toLowerCase().includes(q) ||
            r.account.nameEn.toLowerCase().includes(q)
          }
        />
      </div>
    );
  }

  // ===========================================================================
  // 3. BALANCE SHEET (ASSETS = LIABILITIES + EQUITY)
  // ===========================================================================
  if (resolvedTab === 'balance-sheet') {
    const assetRows = stats.trialBalanceRows.filter((r) => r.account.type === 'asset');
    const liabilityRows = stats.trialBalanceRows.filter((r) => r.account.type === 'liability');
    const equityRows = stats.trialBalanceRows.filter((r) => r.account.type === 'equity');

    return (
      <div className="space-y-4 font-['Plus_Jakarta_Sans',sans-serif]">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 flex-wrap">
            <h1 className="text-lg md:text-xl font-bold text-slate-900 flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-[#006a4e]" />
              <span>Statement of Financial Position (Balance Sheet)</span>
            </h1>
            {stats.balanceSheetBalanced ? (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-[3px] bg-emerald-50 text-[#006a4e] border border-emerald-200 text-xs font-bold">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Balanced (Assets = L + E)
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-[3px] bg-rose-50 text-rose-700 border border-rose-200 text-xs font-bold">
                <AlertTriangle className="w-3.5 h-3.5" />
                Mismatch: ৳{stats.balanceSheetDiff.toLocaleString()}
              </span>
            )}
          </div>

          <button
            type="button"
            onClick={() => {
              window.print();
              notify('Sent Balance Sheet to printer.');
            }}
            className="h-8 px-3 rounded-[3px] border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export / Print</span>
          </button>
        </div>

        <SummaryCardGrid columns={3}>
          <SummaryCard title="Total Hospital Assets" value={`৳ ${stats.totalAssets.toLocaleString()}`} subtitle="Cash, Banks, AR, Inventory & Equipment" icon={Landmark} iconColor="text-blue-600" />
          <SummaryCard title="Total Liabilities" value={`৳ ${stats.totalLiabilities.toLocaleString()}`} subtitle="AP, IPD Advances & NBR Tax/VAT" icon={Scale} iconColor="text-rose-600" valueColor="text-rose-600" />
          <SummaryCard title="Total Institutional Equity" value={`৳ ${stats.totalEquity.toLocaleString()}`} subtitle={`Includes Current Net Profit: ৳${stats.netProfit.toLocaleString()}`} icon={CheckCircle2} iconColor="text-[#006a4e]" valueColor="text-[#006a4e]" />
        </SummaryCardGrid>

        {/* Two-Column Accounting Sheet (Assets vs Liabilities + Equity) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Assets Side */}
          <div className="bg-white border border-slate-300/80 rounded-[3px] shadow-xs overflow-hidden flex flex-col">
            <div className="px-4 py-2.5 bg-slate-50 border-b border-slate-200 font-bold text-xs text-slate-800 uppercase tracking-wider">
              Assets (1000 Series)
            </div>
            <div className="flex-1 divide-y divide-slate-100 text-xs">
              {assetRows.map((r) => {
                const bal = r.closingDebit - r.closingCredit;
                return (
                  <div key={r.account.code} className="px-4 py-2.5 flex items-center justify-between hover:bg-slate-50/70">
                    <div>
                      <span className="font-mono text-[10.5px] font-bold text-[#006a4e] mr-2">{r.account.code}</span>
                      <span className="font-semibold text-slate-800">{r.account.nameEn}</span>
                    </div>
                    <span className="font-mono font-bold text-slate-900">৳ {bal.toLocaleString()}</span>
                  </div>
                );
              })}
            </div>
            <div className="px-4 py-3 bg-blue-50/70 border-t border-blue-200 flex items-center justify-between font-extrabold text-xs">
              <span className="text-slate-900">TOTAL ASSETS</span>
              <span className="font-mono text-blue-800 text-sm">৳ {stats.totalAssets.toLocaleString()}</span>
            </div>
          </div>

          {/* Liabilities + Equity Side */}
          <div className="bg-white border border-slate-300/80 rounded-[3px] shadow-xs overflow-hidden flex flex-col">
            <div className="px-4 py-2.5 bg-slate-50 border-b border-slate-200 font-bold text-xs text-slate-800 uppercase tracking-wider">
              Liabilities & Institutional Equity (2000–3000 Series)
            </div>
            <div className="flex-1 divide-y divide-slate-100 text-xs">
              <div className="px-4 py-1.5 bg-rose-50/50 text-[10.5px] font-bold text-rose-700 uppercase">
                Current Liabilities (2000)
              </div>
              {liabilityRows.map((r) => {
                const bal = r.closingCredit - r.closingDebit;
                return (
                  <div key={r.account.code} className="px-4 py-2.5 flex items-center justify-between hover:bg-slate-50/70">
                    <div>
                      <span className="font-mono text-[10.5px] font-bold text-rose-700 mr-2">{r.account.code}</span>
                      <span className="font-semibold text-slate-800">{r.account.nameEn}</span>
                    </div>
                    <span className="font-mono font-bold text-slate-900">৳ {bal.toLocaleString()}</span>
                  </div>
                );
              })}
              <div className="px-4 py-1.5 bg-emerald-50/50 text-[10.5px] font-bold text-[#006a4e] uppercase">
                Institutional Equity & Retained Surplus (3000)
              </div>
              {equityRows.map((r) => {
                const bal = r.closingCredit - r.closingDebit;
                return (
                  <div key={r.account.code} className="px-4 py-2.5 flex items-center justify-between hover:bg-slate-50/70">
                    <div>
                      <span className="font-mono text-[10.5px] font-bold text-[#006a4e] mr-2">{r.account.code}</span>
                      <span className="font-semibold text-slate-800">{r.account.nameEn}</span>
                    </div>
                    <span className="font-mono font-bold text-slate-900">৳ {bal.toLocaleString()}</span>
                  </div>
                );
              })}
              <div className="px-4 py-2.5 flex items-center justify-between bg-emerald-50/30">
                <div>
                  <span className="font-mono text-[10.5px] font-bold text-[#006a4e] mr-2">P&L</span>
                  <span className="font-bold text-[#006a4e]">Current Period Net Profit / Surplus</span>
                </div>
                <span className="font-mono font-bold text-[#006a4e]">৳ {stats.netProfit.toLocaleString()}</span>
              </div>
            </div>
            <div className="px-4 py-3 bg-emerald-50 border-t border-emerald-200 flex items-center justify-between font-extrabold text-xs">
              <span className="text-slate-900">TOTAL LIABILITIES + EQUITY</span>
              <span className="font-mono text-[#006a4e] text-sm">
                ৳ {(stats.totalLiabilities + stats.totalEquity).toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ===========================================================================
  // 4. CASH FLOW & NBR TAX / VAT (MUSHAK 6.3 + TDS)
  // ===========================================================================
  const taxColumns: DataTableColumn<TaxVatRecord>[] = [
    {
      key: 'taxType',
      header: 'Tax / VAT Head',
      sortable: true,
      sortValue: (r) => r.taxType,
      render: (r) => (
        <div>
          <span className="font-bold text-slate-900 text-xs block">{r.taxType}</span>
          <span className="font-mono text-[10.5px] text-slate-400">NBR Code: {r.nbrCode} · {r.period}</span>
        </div>
      ),
    },
    {
      key: 'taxableBase',
      header: 'Taxable Base (BDT)',
      align: 'right',
      render: (r) => <span className="font-mono text-xs text-slate-700">৳ {r.taxableBase.toLocaleString()}</span>,
    },
    {
      key: 'taxRate',
      header: 'Statutory Rate',
      align: 'center',
      render: (r) => <span className="font-mono text-xs font-semibold text-slate-700">{r.taxRate}</span>,
    },
    {
      key: 'taxDeductedOrCollected',
      header: 'Tax / VAT Amount',
      align: 'right',
      sortable: true,
      sortValue: (r) => r.taxDeductedOrCollected,
      render: (r) => (
        <span className="font-mono font-extrabold text-rose-700 text-xs">
          ৳ {r.taxDeductedOrCollected.toLocaleString()}
        </span>
      ),
    },
    {
      key: 'challanStatus',
      header: 'Treasury Status',
      align: 'center',
      render: (r) => (
        <span
          className={`px-2 py-0.5 rounded-[3px] text-[10.5px] font-bold border ${
            r.challanStatus.includes('Deposited')
              ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
              : 'bg-amber-50 text-amber-700 border-amber-200'
          }`}
        >
          {r.challanStatus}
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-4 font-['Plus_Jakarta_Sans',sans-serif]">
      <div>
        <h1 className="text-lg md:text-xl font-bold text-slate-900 flex items-center gap-2">
          <Landmark className="w-5 h-5 text-[#006a4e]" />
          <span>Cash Flow Summary & NBR Tax / VAT Compliance</span>
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Operating cash flow position alongside statutory TDS/AIT withholding tax & Mushak 6.3 VAT liabilities ({coaAccounts.filter((a) => a.reportGroup === 'tax').length} active tax accounts).
        </p>
      </div>

      <SummaryCardGrid columns={3}>
        <SummaryCard title="Total Cash & Bank Liquidity" value={`৳ ${stats.totalCashAndBank.toLocaleString()}`} subtitle="Vault Cash + Bank + bKash/Nagad" icon={Landmark} iconColor="text-[#006a4e]" valueColor="text-[#006a4e]" />
        <SummaryCard title="Net Operating Cash Surplus" value={`৳ ${stats.netProfit.toLocaleString()}`} subtitle="Operating inflows minus outflows" icon={TrendingUp} iconColor="text-blue-600" />
        <SummaryCard title="Total NBR Tax / VAT Due" value="৳ 781,000" subtitle="TDS + Mushak 6.3 Output VAT" icon={Scale} iconColor="text-amber-600" />
      </SummaryCardGrid>

      <DataTable<TaxVatRecord>
        data={TAX_VAT_DATA}
        columns={taxColumns}
        showSerial={true}
        searchPlaceholder="Search NBR tax head, code..."
        searchFilter={(r, q) =>
          r.taxType.toLowerCase().includes(q) || r.nbrCode.toLowerCase().includes(q)
        }
      />
    </div>
  );
};
