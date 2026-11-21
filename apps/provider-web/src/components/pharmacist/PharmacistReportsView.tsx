import React from 'react';
import {
  BarChart3,
  Building2,
  Download,
  TrendingUp,
} from 'lucide-react';

export const PharmacistReportsView: React.FC = () => {
  const branchPerformances = [
    { branch: 'Central Medical Store (CMS)', transactions: '1,420 Issues', revenue: '৳ 38,40,000', margin: '22%' },
    { branch: 'Dhanmondi OPD Pharmacy', transactions: '4,850 Bills', revenue: '৳ 42,90,000', margin: '26%' },
    { branch: 'Uttara Branch Pharmacy', transactions: '2,910 Bills', revenue: '৳ 26,10,000', margin: '24%' },
    { branch: 'Mirpur Branch Pharmacy', transactions: '1,890 Bills', revenue: '৳ 16,80,000', margin: '25%' },
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

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-teal-700" />
            Pharmacy Financial Analytics, ABC/VED Matrix & Stock Audit
          </h2>
          <p className="text-xs text-slate-500">
            Enterprise multi-branch revenue summaries, margin analysis, inventory turnover rates, and vital medicine availability metrics.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold flex items-center gap-1.5 cursor-pointer">
            <Download className="w-3.5 h-3.5" />
            <span>Export Financial Audit</span>
          </button>
        </div>
      </div>

      {/* Financial Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 bg-white rounded-xl border border-slate-200/90 shadow-xs">
          <div className="text-xs font-semibold text-slate-500">Gross Monthly Pharmacy Turnover</div>
          <div className="text-2xl font-bold text-slate-900 mt-2">৳ 1,24,20,000</div>
          <div className="text-xs text-emerald-600 font-semibold mt-1 flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5" />
            +18.4% compared to previous month
          </div>
        </div>

        <div className="p-5 bg-white rounded-xl border border-slate-200/90 shadow-xs">
          <div className="text-xs font-semibold text-slate-500">Total Formulary Inventory Asset Value</div>
          <div className="text-2xl font-bold text-slate-900 mt-2">৳ 1,24,10,000</div>
          <div className="text-xs text-slate-500 mt-1">Across Central Hub + 3 Satellite Stores</div>
        </div>

        <div className="p-5 bg-white rounded-xl border border-slate-200/90 shadow-xs">
          <div className="text-xs font-semibold text-slate-500">Average Inventory Turnover Ratio</div>
          <div className="text-2xl font-bold text-slate-900 mt-2">8.4x / Year</div>
          <div className="text-xs text-teal-700 font-semibold mt-1">Optimal liquidity performance</div>
        </div>
      </div>

      {/* Multi-Branch Performance Table */}
      <div className="bg-white rounded-xl border border-slate-200/90 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900">Branch Revenue & Gross Margin Breakdown</h3>
          <span className="text-xs text-slate-500">Consolidated real-time sync</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#0c2e4b] text-white font-semibold">
              <tr>
                <th className="py-3 px-4">Pharmacy Branch Location</th>
                <th className="py-3 px-3">Transaction Count</th>
                <th className="py-3 px-3 text-right">Gross Sales Turnover</th>
                <th className="py-3 px-3 text-right">Average Gross Margin</th>
                <th className="py-3 px-4 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {branchPerformances.map((b, idx) => (
                <tr key={idx} className="hover:bg-slate-50/70">
                  <td className="py-3 px-4 font-bold text-slate-900 flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-teal-700" />
                    <span>{b.branch}</span>
                  </td>
                  <td className="py-3 px-3 text-slate-600">{b.transactions}</td>
                  <td className="py-3 px-3 text-right font-bold text-slate-900">{b.revenue}</td>
                  <td className="py-3 px-3 text-right font-semibold text-emerald-700">{b.margin}</td>
                  <td className="py-3 px-4 text-center">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      Profitable
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ABC / VED Matrix */}
      <div className="bg-white rounded-xl border border-slate-200/90 shadow-xs p-5 space-y-4">
        <div>
          <h3 className="text-sm font-bold text-slate-900">ABC Inventory Classification Matrix</h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Classified by annual capital consumption value to optimize procurement working capital and avoid stock-outs.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {abcAnalysis.map((item, idx) => (
            <div key={idx} className={`p-4 rounded-xl border ${item.color} space-y-2`}>
              <div className="text-xs font-bold uppercase tracking-wider">{item.category}</div>
              <div className="text-lg font-bold text-slate-900">{item.valueShare}</div>
              <div className="text-xs font-medium text-slate-700">{item.skuCount}</div>
              <div className="pt-2 border-t border-slate-200/60 text-[11px] font-semibold text-slate-600">
                Strategy: {item.controlLevel}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
