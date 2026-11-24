import React, { useState } from 'react';
import {
  BarChart3,
  CheckCircle2,
  DollarSign,
  Download,
  Landmark,
  Layers,
  Printer,
  Scale,
  ShieldCheck,
  TrendingUp,
  Wallet,
  X,
} from 'lucide-react';
import { SummaryCard, SummaryCardGrid } from '../common/SummaryCard';
import { DataTable, DataTableColumn } from '../common/DataTable';

export interface PnLItem {
  id: string;
  category: 'Revenue' | 'Direct Cost' | 'Operating Expense' | 'Net Profit';
  lineItem: string;
  monthlyAmount: number;
  ytdAmount: number;
  percentageOfRevenue: number;
}

export interface BalanceSheetItem {
  id: string;
  classification: 'Current Asset' | 'Fixed Asset' | 'Current Liability' | 'Equity';
  accountTitle: string;
  amount: number;
  sharePercent: number;
}

export interface VatMushakItem {
  id: string;
  mushakNo: string;
  date: string;
  patientOrVendor: string;
  natureOfService: string;
  baseAmount: number;
  vatRatePercent: number;
  vatAmount: number;
  challanStatus: 'Challan Deposited' | 'Queued for NBR Return';
}

export const PNL_STATEMENT_DATA: PnLItem[] = [
  // Revenue
  { id: 'REV-01', category: 'Revenue', lineItem: 'Inpatient (IPD) Admissions & Bed Charges', monthlyAmount: 9650000, ytdAmount: 48250000, percentageOfRevenue: 65.0 },
  { id: 'REV-02', category: 'Revenue', lineItem: 'Outpatient (OPD) & Specialist Consultation', monthlyAmount: 1850000, ytdAmount: 9250000, percentageOfRevenue: 12.5 },
  { id: 'REV-03', category: 'Revenue', lineItem: 'Clinical Diagnostic Pathology & Radiology', monthlyAmount: 1860000, ytdAmount: 9300000, percentageOfRevenue: 12.5 },
  { id: 'REV-04', category: 'Revenue', lineItem: 'Hospital Pharmacy Sales & Disposables', monthlyAmount: 1480000, ytdAmount: 7400000, percentageOfRevenue: 10.0 },

  // Direct Cost
  { id: 'EXP-01', category: 'Direct Cost', lineItem: 'Cost of Medicine & Surgical Consumables (COGS)', monthlyAmount: 3450000, ytdAmount: 17250000, percentageOfRevenue: 23.2 },
  { id: 'EXP-02', category: 'Direct Cost', lineItem: 'Visiting Consultant & Surgeon Honorarium', monthlyAmount: 1265000, ytdAmount: 6325000, percentageOfRevenue: 8.5 },

  // Operating Expenses
  { id: 'EXP-03', category: 'Operating Expense', lineItem: 'Hospital Staff Salaries & Allowances', monthlyAmount: 4250000, ytdAmount: 21250000, percentageOfRevenue: 28.6 },
  { id: 'EXP-04', category: 'Operating Expense', lineItem: 'Medical Equipment Maintenance & Utilities (Oxygen/Electricity)', monthlyAmount: 980000, ytdAmount: 4900000, percentageOfRevenue: 6.6 },
  { id: 'EXP-05', category: 'Operating Expense', lineItem: 'Administrative, Dietary & Linen Sanitation', monthlyAmount: 420000, ytdAmount: 2100000, percentageOfRevenue: 2.8 },
];

export const BALANCE_SHEET_DATA: BalanceSheetItem[] = [
  { id: 'BS-01', classification: 'Current Asset', accountTitle: 'Cash in Vault & Liquid Banks', amount: 84600000, sharePercent: 28.2 },
  { id: 'BS-02', classification: 'Current Asset', accountTitle: 'Hospital Pharmacy Inventory Assets', amount: 24500000, sharePercent: 8.2 },
  { id: 'BS-03', classification: 'Current Asset', accountTitle: 'Accounts Receivable (Patient & Corporate)', amount: 3715000, sharePercent: 1.2 },
  { id: 'BS-04', classification: 'Fixed Asset', accountTitle: 'Hospital Land, Buildings & OT Complex', amount: 155000000, sharePercent: 51.7 },
  { id: 'BS-05', classification: 'Fixed Asset', accountTitle: 'Medical Equipment (MRI, CT, Ventilators)', amount: 32000000, sharePercent: 10.7 },
  { id: 'BS-06', classification: 'Current Liability', accountTitle: 'Accounts Payable to Vendors (AP)', amount: 32450000, sharePercent: 10.8 },
  { id: 'BS-07', classification: 'Current Liability', accountTitle: 'Withholding Tax & VAT Payable to NBR', amount: 2850000, sharePercent: 0.9 },
  { id: 'BS-08', classification: 'Equity', accountTitle: 'Retained Hospital Earnings & Capital Reserves', amount: 264515000, sharePercent: 88.3 },
];

export const VAT_MUSHAK_DATA: VatMushakItem[] = [
  { id: 'MSH-01', mushakNo: 'MUSHAK-6.3-0891', date: '2026-11-24', patientOrVendor: 'Siemens Healthineers Bangladesh', natureOfService: 'Medical Equipment Annual Maintenance', baseAmount: 185000, vatRatePercent: 7.5, vatAmount: 13875, challanStatus: 'Challan Deposited' },
  { id: 'MSH-02', mushakNo: 'MUSHAK-6.3-0892', date: '2026-11-24', patientOrVendor: 'Linde Bangladesh Ltd', natureOfService: 'Medical Liquid Oxygen & Cylinders', baseAmount: 485000, vatRatePercent: 5.0, vatAmount: 24250, challanStatus: 'Challan Deposited' },
  { id: 'MSH-03', mushakNo: 'MUSHAK-6.3-0893', date: '2026-11-23', patientOrVendor: 'Executive Health Checkup Corporate', natureOfService: 'Corporate Health Screening Package', baseAmount: 320000, vatRatePercent: 5.0, vatAmount: 16000, challanStatus: 'Queued for NBR Return' },
  { id: 'MSH-04', mushakNo: 'MUSHAK-6.3-0894', date: '2026-11-23', patientOrVendor: 'CleanTex Linen Services', natureOfService: 'Hospital Autoclaving & Laundry', baseAmount: 42000, vatRatePercent: 15.0, vatAmount: 6300, challanStatus: 'Challan Deposited' },
];

interface AccountantReportsViewProps {
  initialTab?: 'summary' | 'pnl' | 'balance-sheet' | 'tax';
}

export const AccountantReportsView: React.FC<AccountantReportsViewProps> = ({
  initialTab = 'summary',
}) => {
  const [activeTab, setActiveTab] = useState<'summary' | 'pnl' | 'balance-sheet' | 'tax'>(initialTab);
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);
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

  const grossMonthlyRevenue = PNL_STATEMENT_DATA.filter((p) => p.category === 'Revenue').reduce((sum, p) => sum + p.monthlyAmount, 0);
  const totalMonthlyExpenses = PNL_STATEMENT_DATA.filter((p) => p.category !== 'Revenue').reduce((sum, p) => sum + p.monthlyAmount, 0);
  const netMonthlySurplus = grossMonthlyRevenue - totalMonthlyExpenses;
  const netMarginPercent = ((netMonthlySurplus / grossMonthlyRevenue) * 100).toFixed(1);

  // P&L Columns
  const pnlColumns: DataTableColumn<PnLItem>[] = [
    {
      key: 'lineItem',
      header: 'Line Item & Financial Classification',
      sortable: true,
      sortValue: (r) => r.lineItem,
      render: (r) => (
        <div>
          <span className="font-bold text-slate-900 text-xs block">{r.lineItem}</span>
          <span className="text-[11px] text-slate-500 font-medium">{r.category}</span>
        </div>
      ),
    },
    {
      key: 'category',
      header: 'Classification',
      render: (r) => (
        <span
          className={`px-2 py-0.5 rounded text-[10.5px] font-bold border ${
            r.category === 'Revenue'
              ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
              : r.category === 'Direct Cost'
              ? 'bg-amber-50 text-amber-700 border-amber-200'
              : 'bg-rose-50 text-rose-700 border-rose-200'
          }`}
        >
          {r.category}
        </span>
      ),
    },
    {
      key: 'monthlyAmount',
      header: 'Monthly (BDT)',
      align: 'right',
      sortable: true,
      sortValue: (r) => r.monthlyAmount,
      render: (r) => (
        <span
          className={`font-mono font-bold text-xs ${
            r.category === 'Revenue' ? 'text-[#006a4e]' : 'text-slate-800'
          }`}
        >
          ৳ {r.monthlyAmount.toLocaleString()}
        </span>
      ),
    },
    {
      key: 'ytdAmount',
      header: 'YTD (5 Months)',
      align: 'right',
      sortable: true,
      sortValue: (r) => r.ytdAmount,
      render: (r) => (
        <span className="font-mono text-slate-700 text-xs">
          ৳ {r.ytdAmount.toLocaleString()}
        </span>
      ),
    },
    {
      key: 'percentageOfRevenue',
      header: '% of Revenue',
      align: 'center',
      render: (r) => (
        <span className="font-mono text-xs font-semibold text-slate-700">
          {r.percentageOfRevenue}%
        </span>
      ),
    },
  ];

  // Mushak Columns
  const mushakColumns: DataTableColumn<VatMushakItem>[] = [
    {
      key: 'mushakNo',
      header: 'Challan # & Date',
      sortable: true,
      sortValue: (r) => r.mushakNo,
      render: (r) => (
        <div>
          <span className="font-mono font-bold text-slate-900 text-xs block">{r.mushakNo}</span>
          <span className="text-[10.5px] text-slate-400 font-mono">{r.date}</span>
        </div>
      ),
    },
    {
      key: 'patientOrVendor',
      header: 'Taxable Entity & Description',
      sortable: true,
      sortValue: (r) => r.patientOrVendor,
      render: (r) => (
        <div>
          <span className="font-bold text-slate-900 text-xs block">{r.patientOrVendor}</span>
          <span className="text-[11px] text-slate-500">{r.natureOfService}</span>
        </div>
      ),
    },
    {
      key: 'baseAmount',
      header: 'Assessable Value',
      align: 'right',
      render: (r) => (
        <span className="font-mono text-slate-800 text-xs">
          ৳ {r.baseAmount.toLocaleString()}
        </span>
      ),
    },
    {
      key: 'vatRatePercent',
      header: 'VAT Rate',
      align: 'center',
      render: (r) => (
        <span className="font-mono font-bold text-slate-700 text-xs">
          {r.vatRatePercent}%
        </span>
      ),
    },
    {
      key: 'vatAmount',
      header: 'VAT Amount',
      align: 'right',
      sortable: true,
      sortValue: (r) => r.vatAmount,
      render: (r) => (
        <span className="font-mono font-extrabold text-[#006a4e] text-xs">
          ৳ {r.vatAmount.toLocaleString()}
        </span>
      ),
    },
    {
      key: 'challanStatus',
      header: 'NBR Status',
      align: 'center',
      render: (r) => (
        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
          {r.challanStatus}
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

      {/* Top Filter and Actions Bar */}
      <div className="bg-white rounded-[4px] border border-slate-200/90 p-3 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded bg-emerald-50 text-[#006a4e] flex items-center justify-center font-bold">
            <BarChart3 className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-900">
              Hospital Financial Reporting &amp; Tax Compliance Engine
            </h2>
            <p className="text-[11px] text-slate-500">
              Audited Profit &amp; Loss, Statement of Financial Position (Balance Sheet), and NBR VAT Mushak 6.3
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsPrintModalOpen(true)}
            className="h-8 px-3 rounded-[3px] bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-semibold inline-flex items-center gap-1.5 cursor-pointer shadow-2xs"
          >
            <Printer className="w-3.5 h-3.5 text-slate-500" />
            <span>Print Official Statement</span>
          </button>
          <button
            type="button"
            onClick={() => showToast('Exported Financial Report CSV for Nov 2026')}
            className="h-8 px-3 rounded-[3px] bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-semibold inline-flex items-center gap-1.5 cursor-pointer shadow-2xs"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* HORIZONTAL TABS BAR (Image 1 Reference)                                   */}
      {/* ========================================================================= */}
      <div className="flex items-center gap-1 border-b border-slate-200 bg-white px-3 pt-1.5 rounded-[4px] shadow-2xs overflow-x-auto scrollbar-none">
        <button
          type="button"
          onClick={() => setActiveTab('summary')}
          className={`px-3.5 py-2 text-xs font-semibold cursor-pointer border-b-2 transition-colors flex items-center gap-1.5 -mb-[1px] ${
            activeTab === 'summary'
              ? 'border-[#006a4e] text-[#006a4e]'
              : 'border-transparent text-slate-600 hover:text-slate-900'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>Financial Statements Hub</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('pnl')}
          className={`px-3.5 py-2 text-xs font-semibold cursor-pointer border-b-2 transition-colors flex items-center gap-1.5 -mb-[1px] ${
            activeTab === 'pnl'
              ? 'border-[#006a4e] text-[#006a4e]'
              : 'border-transparent text-slate-600 hover:text-slate-900'
          }`}
        >
          <TrendingUp className="w-3.5 h-3.5" />
          <span>Profit &amp; Loss (P&amp;L) Statement</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('balance-sheet')}
          className={`px-3.5 py-2 text-xs font-semibold cursor-pointer border-b-2 transition-colors flex items-center gap-1.5 -mb-[1px] ${
            activeTab === 'balance-sheet'
              ? 'border-[#006a4e] text-[#006a4e]'
              : 'border-transparent text-slate-600 hover:text-slate-900'
          }`}
        >
          <Scale className="w-3.5 h-3.5" />
          <span>Balance Sheet &amp; Cash Flow</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('tax')}
          className={`px-3.5 py-2 text-xs font-semibold cursor-pointer border-b-2 transition-colors flex items-center gap-1.5 -mb-[1px] ${
            activeTab === 'tax'
              ? 'border-[#006a4e] text-[#006a4e]'
              : 'border-transparent text-slate-600 hover:text-slate-900'
          }`}
        >
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Tax &amp; NBR VAT (Mushak 6.3)</span>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: FINANCIAL OVERVIEW HUB                                             */}
      {/* ========================================================================= */}
      {activeTab === 'summary' && (
        <div className="space-y-3">
          <SummaryCardGrid>
            <SummaryCard
              title="Gross Hospital Revenue"
              icon={DollarSign}
              iconColor="text-[#006a4e]"
              value={`৳ ${(grossMonthlyRevenue / 100000).toFixed(2)} Lakh`}
              subtitle="IPD Admissions + OPD + Pharmacy"
            />
            <SummaryCard
              title="Total Operating Cost"
              icon={Wallet}
              iconColor="text-rose-600"
              value={`৳ ${(totalMonthlyExpenses / 100000).toFixed(2)} Lakh`}
              subtitle="COGS, Salaries, Maintenance, Doctors"
            />
            <SummaryCard
              title="Net Operating Surplus"
              icon={TrendingUp}
              iconColor="text-[#006a4e]"
              value={`৳ ${(netMonthlySurplus / 100000).toFixed(2)} Lakh`}
              subtitle={`${netMarginPercent}% Net Operating Margin`}
              badge={
                <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  Profitable
                </span>
              }
            />
          </SummaryCardGrid>

          <div className="space-y-1.5">
            <h3 className="text-xs font-bold text-slate-800 px-0.5">
              Monthly Hospital Performance Summary &amp; Audited P&amp;L Aggregate
            </h3>
            <DataTable<PnLItem>
              data={PNL_STATEMENT_DATA}
              columns={pnlColumns}
              keyExtractor={(item) => item.id}
              searchPlaceholder="Search line items or financial classifications..."
              searchFilter={(item, query) =>
                item.lineItem.toLowerCase().includes(query.toLowerCase()) ||
                item.category.toLowerCase().includes(query.toLowerCase())
              }
              showSerial={true}
            />
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: PROFIT & LOSS (P&L) STATEMENT                                      */}
      {/* ========================================================================= */}
      {activeTab === 'pnl' && (
        <div className="bg-white border border-slate-300/80 rounded-[3px] shadow-xs overflow-hidden">
          <div className="px-3 py-2 border-b border-slate-200/80 flex items-center justify-between">
            <div>
              <h3 className="text-xs font-bold text-slate-900">
                Detailed Statement of Comprehensive Income (Profit &amp; Loss)
              </h3>
              <p className="text-[11px] text-slate-500">
                For the month ended November 30, 2026 (Currency: Bangladeshi Taka)
              </p>
            </div>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
              Audited by ICAB Standards
            </span>
          </div>

          <table className="w-full text-left text-xs">
              <thead className="bg-[#0c2e4b] text-white text-[11px]">
                <tr>
                  <th className="py-2.5 px-3">Revenue &amp; Cost Category</th>
                  <th className="py-2.5 px-3 text-right">November 2026 (BDT)</th>
                  <th className="py-2.5 px-3 text-right">YTD FY 2026-27 (BDT)</th>
                  <th className="py-2.5 px-3 text-center">% of Revenue</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-mono text-[11.5px]">
                <tr className="bg-slate-50 font-bold text-slate-900">
                  <td colSpan={4} className="py-2 px-3 font-sans uppercase text-[10.5px] tracking-wider text-[#006a4e]">
                    1. Operating Revenue Streams
                  </td>
                </tr>
                {PNL_STATEMENT_DATA.filter((p) => p.category === 'Revenue').map((row) => (
                  <tr key={row.id} className="hover:bg-slate-50">
                    <td className="py-2 px-3 pl-6 font-sans text-slate-800">{row.lineItem}</td>
                    <td className="py-2 px-3 text-right font-bold text-[#006a4e]">৳ {row.monthlyAmount.toLocaleString()}</td>
                    <td className="py-2 px-3 text-right text-slate-700">৳ {row.ytdAmount.toLocaleString()}</td>
                    <td className="py-2 px-3 text-center font-sans text-slate-600">{row.percentageOfRevenue}%</td>
                  </tr>
                ))}
                <tr className="bg-[#edf6f2] font-bold text-[#006a4e]">
                  <td className="py-2 px-3 font-sans">Gross Hospital Revenue Total</td>
                  <td className="py-2 px-3 text-right text-sm">৳ {grossMonthlyRevenue.toLocaleString()}</td>
                  <td className="py-2 px-3 text-right text-sm">৳ {(grossMonthlyRevenue * 5).toLocaleString()}</td>
                  <td className="py-2 px-3 text-center">100.0%</td>
                </tr>

                <tr className="bg-slate-50 font-bold text-slate-900">
                  <td colSpan={4} className="py-2 px-3 font-sans uppercase text-[10.5px] tracking-wider text-rose-700">
                    2. Direct Costs &amp; Operating Expenses
                  </td>
                </tr>
                {PNL_STATEMENT_DATA.filter((p) => p.category !== 'Revenue').map((row) => (
                  <tr key={row.id} className="hover:bg-slate-50">
                    <td className="py-2 px-3 pl-6 font-sans text-slate-800">{row.lineItem}</td>
                    <td className="py-2 px-3 text-right text-slate-800">৳ {row.monthlyAmount.toLocaleString()}</td>
                    <td className="py-2 px-3 text-right text-slate-700">৳ {row.ytdAmount.toLocaleString()}</td>
                    <td className="py-2 px-3 text-center font-sans text-slate-600">{row.percentageOfRevenue}%</td>
                  </tr>
                ))}
                <tr className="bg-rose-50/50 font-bold text-rose-800">
                  <td className="py-2 px-3 font-sans">Total Operating Expenditures</td>
                  <td className="py-2 px-3 text-right text-sm">৳ {totalMonthlyExpenses.toLocaleString()}</td>
                  <td className="py-2 px-3 text-right text-sm">৳ {(totalMonthlyExpenses * 5).toLocaleString()}</td>
                  <td className="py-2 px-3 text-center">
                    {((totalMonthlyExpenses / grossMonthlyRevenue) * 100).toFixed(1)}%
                  </td>
                </tr>

                <tr className="bg-[#006a4e] text-white font-extrabold text-sm">
                  <td className="py-2.5 px-3 font-sans">Net Operating Surplus (Profit Before Tax)</td>
                  <td className="py-2.5 px-3 text-right">৳ {netMonthlySurplus.toLocaleString()}</td>
                  <td className="py-2.5 px-3 text-right">৳ {(netMonthlySurplus * 5).toLocaleString()}</td>
                  <td className="py-2.5 px-3 text-center">{netMarginPercent}%</td>
                </tr>
              </tbody>
            </table>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: BALANCE SHEET & CASH FLOW                                          */}
      {/* ========================================================================= */}
      {activeTab === 'balance-sheet' && (
        <div className="space-y-2">
          <div className="flex items-center justify-between px-0.5">
            <div>
              <h3 className="text-xs font-bold text-slate-900">
                Statement of Financial Position (Balance Sheet)
              </h3>
              <p className="text-[11px] text-slate-500">
                Green Life Hospital Healthcare System as at November 30, 2026
              </p>
            </div>
            <span className="font-mono text-xs font-bold text-slate-700">
              Total Assets = Total Liabilities &amp; Equity
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {/* Assets */}
            <div className="bg-white border border-slate-300/80 rounded-[3px] shadow-xs overflow-hidden">
              <div className="bg-[#0c2e4b] text-white text-xs font-bold px-3 py-2">
                HOSPITAL ASSETS
              </div>
              <table className="w-full text-xs">
                <tbody className="divide-y divide-slate-100 font-mono text-[11px]">
                  {BALANCE_SHEET_DATA.filter((b) => b.classification.includes('Asset')).map((row) => (
                    <tr key={row.id} className="hover:bg-slate-50">
                      <td className="py-2 px-3 font-sans text-slate-800">
                        {row.accountTitle}
                        <span className="block text-[10px] text-slate-400 font-sans">{row.classification}</span>
                      </td>
                      <td className="py-2 px-3 text-right font-bold text-slate-900">৳ {row.amount.toLocaleString()}</td>
                    </tr>
                  ))}
                  <tr className="bg-[#edf6f2] text-[#006a4e] font-extrabold text-xs">
                    <td className="py-2.5 px-3 font-sans">Total Hospital Assets</td>
                    <td className="py-2.5 px-3 text-right">
                      ৳ {BALANCE_SHEET_DATA.filter((b) => b.classification.includes('Asset')).reduce((sum, b) => sum + b.amount, 0).toLocaleString()}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Liabilities & Equity */}
            <div className="bg-white border border-slate-300/80 rounded-[3px] shadow-xs overflow-hidden">
              <div className="bg-[#0c2e4b] text-white text-xs font-bold px-3 py-2">
                LIABILITIES &amp; CAPITAL RESERVES
              </div>
              <table className="w-full text-xs">
                <tbody className="divide-y divide-slate-100 font-mono text-[11px]">
                  {BALANCE_SHEET_DATA.filter((b) => !b.classification.includes('Asset')).map((row) => (
                    <tr key={row.id} className="hover:bg-slate-50">
                      <td className="py-2 px-3 font-sans text-slate-800">
                        {row.accountTitle}
                        <span className="block text-[10px] text-slate-400 font-sans">{row.classification}</span>
                      </td>
                      <td className="py-2 px-3 text-right font-bold text-slate-900">৳ {row.amount.toLocaleString()}</td>
                    </tr>
                  ))}
                  <tr className="bg-[#edf6f2] text-[#006a4e] font-extrabold text-xs">
                    <td className="py-2.5 px-3 font-sans">Total Liabilities &amp; Equity</td>
                    <td className="py-2.5 px-3 text-right">
                      ৳ {BALANCE_SHEET_DATA.filter((b) => !b.classification.includes('Asset')).reduce((sum, b) => sum + b.amount, 0).toLocaleString()}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 4: TAX & NBR VAT (MUSHAK 6.3)                                         */}
      {/* ========================================================================= */}
      {activeTab === 'tax' && (
        <div className="space-y-3">
          <SummaryCardGrid>
            <SummaryCard
              title="Total VAT Mushak 6.3 Collected"
              icon={ShieldCheck}
              iconColor="text-[#006a4e]"
              value="৳ 60,425"
              subtitle="4 Taxable Transactions Logged"
            />
            <SummaryCard
              title="Treasury Challan Deposited"
              icon={CheckCircle2}
              iconColor="text-[#006a4e]"
              value="৳ 44,425"
              subtitle="Bangladesh Bank Code 1-1133"
            />
            <SummaryCard
              title="Upcoming Return Filing"
              icon={Landmark}
              iconColor="text-blue-600"
              value="Dec 15, 2026"
              subtitle="Monthly VAT Return (Mushak 9.1)"
            />
          </SummaryCardGrid>

          <div className="space-y-1.5">
            <h3 className="text-xs font-bold text-slate-800 px-0.5">
              National Board of Revenue (NBR) VAT Tax Invoice (Mushak 6.3) Register
            </h3>
            <DataTable<VatMushakItem>
              data={VAT_MUSHAK_DATA}
              columns={mushakColumns}
              keyExtractor={(item) => item.id}
              searchPlaceholder="Search Mushak # or entity..."
              searchFilter={(item, query) =>
                item.mushakNo.toLowerCase().includes(query.toLowerCase()) ||
                item.patientOrVendor.toLowerCase().includes(query.toLowerCase())
              }
              showSerial={true}
            />
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* FORMAL PRINTABLE OFFICIAL STATEMENT MODAL                                  */}
      {/* ========================================================================= */}
      {isPrintModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs">
          <div className="bg-white rounded-[4px] shadow-2xl border border-slate-200 w-full max-w-3xl overflow-hidden font-['Plus_Jakarta_Sans',sans-serif] p-6 max-h-[92vh] flex flex-col animate-in fade-in zoom-in-95">
            <div className="flex items-start justify-between border-b pb-4 mb-3">
              <div>
                <h2 className="text-base font-extrabold text-[#006a4e] tracking-tight">
                  GREEN LIFE HOSPITAL HEALTHCARE SYSTEM
                </h2>
                <p className="text-xs font-semibold text-slate-800">
                  Directorate of Finance, Accounts &amp; Treasury Operations
                </p>
                <p className="text-[11px] text-slate-500 font-mono">
                  NBR VAT BIN: 00142941-0102 · ICAB Audit Compliance: ACA-21408
                </p>
              </div>
              <div className="text-right">
                <span className="px-2 py-0.5 rounded bg-emerald-50 text-[#006a4e] font-mono text-xs font-bold border border-emerald-200 block">
                  OFFICIAL AUDIT STATEMENT
                </span>
                <span className="text-[11px] text-slate-500 block mt-1 font-mono">
                  Date: {new Date().toISOString().split('T')[0]}
                </span>
              </div>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-[3px] p-3 mb-3 text-xs grid grid-cols-2 gap-2">
              <div>
                <span className="text-slate-500 block text-[11px]">Audit Period / Term:</span>
                <strong className="text-slate-900 font-mono">Month of November 2026</strong>
              </div>
              <div>
                <span className="text-slate-500 block text-[11px]">Reporting Currency:</span>
                <strong className="text-slate-900 font-mono">Bangladeshi Taka (BDT)</strong>
              </div>
              <div>
                <span className="text-slate-500 block text-[11px]">Gross Revenue Audited:</span>
                <strong className="text-[#006a4e] font-mono">৳ {grossMonthlyRevenue.toLocaleString()}</strong>
              </div>
              <div>
                <span className="text-slate-500 block text-[11px]">Lead Hospital Auditor:</span>
                <strong className="text-slate-900">Md. Rashedul Islam, ACA (Chief Accountant)</strong>
              </div>
            </div>

            <div className="overflow-y-auto flex-1 min-h-[200px] mb-3">
              <table className="w-full text-xs text-left border-collapse border border-slate-200">
                <thead className="bg-[#0c2e4b] text-white text-[11px]">
                  <tr>
                    <th className="py-2 px-3">Revenue / Expenditure Stream</th>
                    <th className="py-2 px-3 text-right">Audited Amount (BDT)</th>
                    <th className="py-2 px-3 text-center">Share %</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700 font-mono text-[11px]">
                  {PNL_STATEMENT_DATA.map((row) => (
                    <tr key={row.id}>
                      <td className="py-2 px-3 font-sans">{row.lineItem}</td>
                      <td className="py-2 px-3 text-right">৳ {row.monthlyAmount.toLocaleString()}</td>
                      <td className="py-2 px-3 text-center">{row.percentageOfRevenue}%</td>
                    </tr>
                  ))}
                  <tr className="bg-[#edf6f2] font-bold text-[#006a4e]">
                    <td className="py-2 px-3 font-sans">Net Hospital Operating Surplus</td>
                    <td className="py-2 px-3 text-right">৳ {netMonthlySurplus.toLocaleString()}</td>
                    <td className="py-2 px-3 text-center">{netMarginPercent}%</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Tripartite Signatures Block */}
            <div className="grid grid-cols-3 gap-4 pt-3 border-t border-slate-200 text-center text-[10.5px] text-slate-500 mb-4 shrink-0">
              <div>
                <div className="border-b border-slate-300 pb-1 mb-1 font-semibold text-slate-800">
                  Md. Rashedul Islam, ACA
                </div>
                <span>Prepared By (Chief Accountant)</span>
              </div>
              <div>
                <div className="border-b border-slate-300 pb-1 mb-1 font-semibold text-slate-800">
                  Engr. M.A. Samad, FCA
                </div>
                <span>Verified By (Chief Financial Officer)</span>
              </div>
              <div>
                <div className="border-b border-slate-300 pb-1 mb-1 font-semibold text-slate-800">
                  Prof. Dr. A.K. Azad
                </div>
                <span>Approved By (Medical Director)</span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-slate-100 shrink-0">
              <span className="text-[11px] text-slate-400">
                Official Electronic Financial Audit Document · Valid without physical hospital seal.
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsPrintModalOpen(false)}
                  className="h-8 px-3 rounded-[3px] border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold cursor-pointer"
                >
                  Close Statement
                </button>
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="h-8 px-3.5 rounded-[3px] bg-[#006a4e] hover:bg-[#00553e] text-white text-xs font-semibold inline-flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print Document</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
