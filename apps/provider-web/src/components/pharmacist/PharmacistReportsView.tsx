import React, { useState } from 'react';
import {
  Boxes,
  DollarSign,
  Download,
  Layers,
  Printer,
  Search,
  TrendingUp,
} from 'lucide-react';
import { SummaryCard, SummaryCardGrid } from '../common/SummaryCard';
import { DataTable, DataTableColumn } from '../common/DataTable';
import { DropdownSelect } from '../common/DropdownSelect';

interface BranchReport {
  id: string;
  branch: string;
  type: string;
  transactions: string;
  revenue: string;
  margin: string;
  status: string;
}

export const PharmacistReportsView: React.FC = () => {
  const [timeDuration, setTimeDuration] = useState('This Month');
  const [appliedDuration, setAppliedDuration] = useState('This Month');
  const [dateFrom, setDateFrom] = useState('2026-11-01');
  const [dateTo, setDateTo] = useState('2026-11-30');

  const handleSearch = () => {
    setAppliedDuration(timeDuration);
  };

  const branchPerformances: BranchReport[] = [
    { id: '1', branch: 'Central Medical Store (CMS)', type: 'Central Hub', transactions: '1,420 Issues', revenue: '৳ 38,40,000', margin: '22%', status: 'Operational' },
    { id: '2', branch: 'Dhanmondi OPD Pharmacy', type: 'Outpatient Dispensary', transactions: '4,850 Bills', revenue: '৳ 42,90,000', margin: '26%', status: 'High Turnover' },
    { id: '3', branch: 'Uttara Branch Pharmacy', type: 'Satellite Store', transactions: '2,910 Bills', revenue: '৳ 26,10,000', margin: '24%', status: 'Operational' },
    { id: '4', branch: 'Mirpur Branch Pharmacy', type: 'Satellite Store', transactions: '1,890 Bills', revenue: '৳ 16,80,000', margin: '25%', status: 'Operational' },
  ];

  const abcAnalysis = [
    {
      category: 'Category A (High Value)',
      skuCount: '150 SKUs (10%)',
      valueShare: '70% Capital (৳ 86.9 Lakh)',
      controlLevel: 'Strict Daily FEFO & Perpetual Audit',
      color: 'bg-rose-50 text-rose-800 border-rose-200',
    },
    {
      category: 'Category B (Moderate Value)',
      skuCount: '300 SKUs (20%)',
      valueShare: '20% Capital (৳ 24.8 Lakh)',
      controlLevel: 'Weekly Stock Monitoring',
      color: 'bg-amber-50 text-amber-800 border-amber-200',
    },
    {
      category: 'Category C (Low Value)',
      skuCount: '1,050 SKUs (70%)',
      valueShare: '10% Capital (৳ 12.4 Lakh)',
      controlLevel: 'Monthly Bulk Ordering Buffer',
      color: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    },
  ];

  const columns: DataTableColumn<BranchReport>[] = [
    {
      key: 'branch',
      header: 'Pharmacy Branch Location',
      sortable: true,
      sortValue: (r) => r.branch,
      render: (r) => (
        <div>
          <span className="font-bold text-slate-900 text-xs block">
            {r.branch}
          </span>
          <span className="text-[11px] text-slate-500 font-medium">
            {r.type}
          </span>
        </div>
      ),
    },
    {
      key: 'transactions',
      header: 'Transaction Count',
      align: 'center',
      sortable: true,
      sortValue: (r) => r.transactions,
      render: (r) => (
        <span className="text-xs font-semibold text-slate-800">
          {r.transactions}
        </span>
      ),
    },
    {
      key: 'revenue',
      header: 'Gross Sales Turnover',
      align: 'right',
      sortable: true,
      sortValue: (r) => r.revenue,
      render: (r) => (
        <span className="font-bold text-slate-900 text-xs">
          {r.revenue}
        </span>
      ),
    },
    {
      key: 'margin',
      header: 'Gross Margin %',
      align: 'center',
      sortable: true,
      sortValue: (r) => r.margin,
      render: (r) => (
        <span className="font-bold text-[#006a4e] text-xs">
          {r.margin}
        </span>
      ),
    },
    {
      key: 'status',
      header: 'Operating Status',
      align: 'center',
      render: (r) => (
        <span className="px-2 py-0.5 rounded-[3px] text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
          {r.status}
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-2">
      {/* 4 Summary Metric Cards matching Doctor Portal format */}
      <SummaryCardGrid>
        <SummaryCard
          title="Gross Monthly Turnover"
          icon={DollarSign}
          iconColor="text-[#006a4e]"
          value="৳ 1,24,20,000"
          subtitle="+18.4% vs last month"
          badge={
            <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
              Profit
            </span>
          }
        />
        <SummaryCard
          title="Formulary Inventory Asset"
          icon={Boxes}
          iconColor="text-[#006a4e]"
          value="৳ 1,24,10,000"
          subtitle="CMS Central + 3 Satellite Stores"
        />
        <SummaryCard
          title="Inventory Turnover Rate"
          icon={TrendingUp}
          iconColor="text-[#006a4e]"
          value="8.4x / Year"
          subtitle="Optimal working capital liquidity"
        />
        <SummaryCard
          title="Category A Capital Share"
          icon={Layers}
          iconColor="text-rose-600"
          value="70% Capital"
          valueColor="text-rose-700"
          subtitle="150 vital & high-value SKUs"
        />
      </SummaryCardGrid>

      {/* Filter Card matching Doctor Reports format */}
      <div className="bg-white rounded-[3px] p-2.5 shadow-xs space-y-2 border border-slate-200/90">
        <div className="flex items-center justify-between border-b border-slate-100 pb-2">
          <div className="flex items-center gap-2">
            <h3 className="text-xs font-bold text-slate-800">
              Pharmacy Revenue & Consumption Analytics
            </h3>
            <span className="px-2 py-0.5 rounded-[3px] bg-[#edf6f2] text-[#006a4e] text-[11px] font-semibold border border-[#006a4e]/20">
              {appliedDuration}
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => window.print()}
              className="h-7 px-2.5 rounded-[3px] border border-slate-200 bg-white hover:bg-slate-50 text-[11px] font-semibold text-slate-700 flex items-center gap-1.5 cursor-pointer"
            >
              <Printer className="w-3 h-3 text-slate-500" />
              <span>Print</span>
            </button>
            <button
              type="button"
              onClick={() => window.print()}
              className="h-7 px-2.5 rounded-[3px] bg-[#006a4e] hover:bg-[#00523c] text-white text-[11px] font-semibold flex items-center gap-1.5 cursor-pointer shadow-2xs"
            >
              <Download className="w-3 h-3" />
              <span>Export CSV</span>
            </button>
          </div>
        </div>

        <div className="flex flex-wrap items-end gap-3 pt-0.5">
          <div>
            <label className="block text-[11px] font-bold text-slate-700 mb-1">
              Time Duration <span className="text-rose-500">*</span>
            </label>
            <DropdownSelect
              value={timeDuration}
              onChange={(val) => setTimeDuration(val)}
              width="w-52"
              options={[
                { label: 'Today', value: 'Today' },
                { label: 'This Week', value: 'This Week' },
                { label: 'Last Week', value: 'Last Week' },
                { label: 'This Month', value: 'This Month' },
                { label: 'Last Month', value: 'Last Month' },
                { label: 'Last 3 Months', value: 'Last 3 Months' },
                { label: 'Last 6 Months', value: 'Last 6 Months' },
                { label: 'Last 12 Months', value: 'Last 12 Months' },
                { label: 'This Year', value: 'This Year' },
                { label: 'Period', value: 'Period' },
              ]}
            />
          </div>

          {timeDuration === 'Period' && (
            <>
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  Date From <span className="text-rose-500">*</span>
                </label>
                <input
                  type="date"
                  value={dateFrom}
                  onChange={(e) => setDateFrom(e.target.value)}
                  className="h-8 px-2.5 rounded-[3px] border border-slate-300 bg-white text-xs text-slate-700 focus:outline-hidden focus:border-[#006a4e]"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  Date To <span className="text-rose-500">*</span>
                </label>
                <input
                  type="date"
                  value={dateTo}
                  onChange={(e) => setDateTo(e.target.value)}
                  className="h-8 px-2.5 rounded-[3px] border border-slate-300 bg-white text-xs text-slate-700 focus:outline-hidden focus:border-[#006a4e]"
                />
              </div>
            </>
          )}

          <button
            type="button"
            onClick={handleSearch}
            className="h-8 px-4 rounded-[3px] bg-[#006a4e] hover:bg-[#00523c] text-white text-xs font-semibold flex items-center gap-1.5 cursor-pointer shadow-2xs transition-colors"
          >
            <Search className="w-3.5 h-3.5" />
            <span>Search</span>
          </button>
        </div>
      </div>

      {/* Multi-Branch Performance DataTable */}
      <DataTable<BranchReport>
        data={branchPerformances}
        columns={columns}
        keyExtractor={(item) => item.id}
        searchPlaceholder="Search branch name..."
        searchFilter={(item, query) =>
          item.branch.toLowerCase().includes(query.toLowerCase()) ||
          item.type.toLowerCase().includes(query.toLowerCase())
        }
        showSerial={true}
      />

      {/* ABC Inventory Classification Matrix */}
      <div className="bg-white rounded-[3px] border border-slate-200/90 shadow-xs p-3 space-y-2">
        <div className="flex items-center justify-between border-b border-slate-100 pb-2">
          <div>
            <h3 className="text-xs font-bold text-slate-900 tracking-wide">
              ABC Inventory Capital Classification Matrix
            </h3>
            <p className="text-[11px] text-slate-500">
              Categorized by capital consumption to optimize procurement working capital and ensure zero stock-outs of vital medicines.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
          {abcAnalysis.map((item, idx) => (
            <div key={idx} className={`p-3 rounded-[3px] border ${item.color} space-y-1`}>
              <div className="text-xs font-bold">{item.category}</div>
              <div className="text-base font-extrabold text-slate-900">{item.valueShare}</div>
              <div className="text-xs font-medium text-slate-700">{item.skuCount}</div>
              <div className="pt-1.5 border-t border-slate-200/60 text-[10.5px] font-semibold text-slate-600">
                Audit Rule: {item.controlLevel}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
