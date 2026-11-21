import React from 'react';
import {
  AlertTriangle,
  ArrowRight,
  ArrowUpRight,
  Boxes,
  CheckCircle2,
  Clock,
  DollarSign,
  PackageCheck,
  Pill,
  Receipt,
  ShieldAlert,
  ShoppingCart,
} from 'lucide-react';

interface PharmacistDashboardHomeProps {
  onNavigate: (moduleId: string) => void;
}

export const PharmacistDashboardHome: React.FC<PharmacistDashboardHomeProps> = ({
  onNavigate,
}) => {
  const kpiCards = [
    {
      title: "Today's Dispensations",
      value: '284',
      subtext: '+14% vs yesterday',
      icon: Pill,
      iconBg: 'bg-emerald-50 text-emerald-600',
      actionText: 'View Queue',
      moduleId: 'e-prescriptions',
    },
    {
      title: 'POS Retail Revenue',
      value: '৳ 3,42,850',
      subtext: '412 OTC & Walk-in bills',
      icon: DollarSign,
      iconBg: 'bg-cyan-50 text-cyan-600',
      actionText: 'Open POS',
      moduleId: 'pos-billing',
    },
    {
      title: 'Pending Ward Indents',
      value: '5',
      subtext: 'ICU (2), CCU (1), Ward 4B (2)',
      icon: Clock,
      iconBg: 'bg-sky-50 text-sky-600',
      actionText: 'Review Indents',
      moduleId: 'ward-indents',
    },
    {
      title: 'Near-Expiry Batches (<60d)',
      value: '3 Batches',
      subtext: 'Action required (FEFO)',
      icon: AlertTriangle,
      iconBg: 'bg-amber-50 text-amber-600',
      actionText: 'Inspect Batches',
      moduleId: 'batch-expiry',
    },
  ];

  const recentPrescriptions = [
    {
      rxNumber: 'RX-2026-8941',
      patient: 'Md. Anwar Hossain (UHID-08421)',
      doctor: 'Prof. Dr. M. A. Hasan (Cardiology)',
      itemsCount: 4,
      priority: 'STAT / Emergency',
      status: 'Ready to Dispense',
      time: '5 mins ago',
    },
    {
      rxNumber: 'RX-2026-8940',
      patient: 'Begum Rokeya (UHID-08392)',
      doctor: 'Dr. Nusrat Jahan (Internal Med)',
      itemsCount: 3,
      priority: 'Routine',
      status: 'Checking Interactions',
      time: '12 mins ago',
    },
    {
      rxNumber: 'RX-2026-8938',
      patient: 'Farhan Kabir (UHID-07914)',
      doctor: 'Dr. Tanvir Ahmed (Orthopedics)',
      itemsCount: 5,
      priority: 'Urgent',
      status: 'Waiting Patient',
      time: '24 mins ago',
    },
  ];

  const urgentAlerts = [
    {
      id: 1,
      title: 'Ceftriaxone 1g Inj. Low Stock in Main Hub',
      desc: 'Current stock: 45 vials. Reorder threshold: 100 vials. Consumption rate: 40 vials/day.',
      action: 'Create PO',
      moduleId: 'purchase-orders',
    },
    {
      id: 2,
      title: 'Batch Expiring in 28 Days: Meropenem 1g (Batch: MRP-2024-X)',
      desc: '80 vials remaining at Dhanmondi Store. Recommend immediate inter-branch transfer to ICU/CCU.',
      action: 'Transfer Batch',
      moduleId: 'stock-transfers',
    },
    {
      id: 3,
      title: 'DGDA Narcotics Physical Audit Due (Schedule B/C)',
      desc: 'Morphine Sulfate 15mg Tab count reconciliation required for today end-of-shift register.',
      action: 'Open Narcotics Log',
      moduleId: 'narcotics-register',
    },
  ];

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-[#0c2e4b] via-[#0e4778] to-[#133758] rounded-2xl p-6 text-white shadow-md relative overflow-hidden">
        <div className="absolute -right-10 -bottom-10 opacity-10 pointer-events-none">
          <Pill className="w-64 h-64" />
        </div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#3a9f00] text-white">
                Live Central Hub
              </span>
              <span className="text-xs text-slate-300">Central Medical Store & Dispensary</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight">
              Hospital Pharmacy & Supply Chain Command Center
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl">
              Connected across 4 branch stores and 6 inpatient wards with live FEFO batch auto-allocation, CDSS drug safety checks, and e-Rx synchronization.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <button
              onClick={() => onNavigate('pos-billing')}
              className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg text-xs font-semibold flex items-center gap-2 shadow-sm transition-all cursor-pointer"
            >
              <Receipt className="w-4 h-4" />
              <span>POS Billing</span>
            </button>
            <button
              onClick={() => onNavigate('e-prescriptions')}
              className="px-4 py-2 bg-white text-[#0c2e4b] hover:bg-slate-100 rounded-lg text-xs font-semibold flex items-center gap-2 shadow-sm transition-all cursor-pointer"
            >
              <PackageCheck className="w-4 h-4 text-emerald-600" />
              <span>Dispense Queue (19)</span>
            </button>
          </div>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpiCards.map((kpi, idx) => {
          const Icon = kpi.icon;
          return (
            <div
              key={idx}
              className="bg-white rounded-xl border border-slate-200/90 p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-500">{kpi.title}</span>
                  <div className={`p-2 rounded-lg ${kpi.iconBg}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                </div>
                <div className="mt-3">
                  <div className="text-2xl font-bold text-slate-900 tracking-tight">{kpi.value}</div>
                  <div className="text-xs text-slate-500 mt-0.5">{kpi.subtext}</div>
                </div>
              </div>
              <button
                onClick={() => onNavigate(kpi.moduleId)}
                className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-teal-700 hover:text-teal-900 group cursor-pointer"
              >
                <span>{kpi.actionText}</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </button>
            </div>
          );
        })}
      </div>

      {/* Operational Highlights Split */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Realtime E-Rx Dispensing Queue */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200/90 shadow-xs flex flex-col">
          <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Pill className="w-5 h-5 text-teal-700" />
              <h3 className="font-bold text-sm text-slate-900">Active E-Prescriptions Waiting Queue</h3>
            </div>
            <button
              onClick={() => onNavigate('e-prescriptions')}
              className="text-xs font-semibold text-teal-700 hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>View All 19 Waiting</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="divide-y divide-slate-100 flex-1">
            {recentPrescriptions.map((rx, idx) => (
              <div key={idx} className="p-4 hover:bg-slate-50/80 transition-colors flex items-center justify-between gap-4">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-mono text-xs font-bold text-slate-900">{rx.rxNumber}</span>
                    <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full ${
                      rx.priority.includes('STAT') ? 'bg-rose-50 text-rose-700 border border-rose-200' : 'bg-slate-100 text-slate-600'
                    }`}>
                      {rx.priority}
                    </span>
                    <span className="text-[11px] text-slate-400">{rx.time}</span>
                  </div>
                  <div className="text-xs font-semibold text-slate-800 mt-1 truncate">
                    {rx.patient}
                  </div>
                  <div className="text-[11px] text-slate-500 mt-0.5">
                    Prescribed by {rx.doctor} • <span className="font-medium text-slate-700">{rx.itemsCount} medicines</span>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <span className="text-xs px-2.5 py-1 rounded-md bg-teal-50 text-teal-800 font-medium border border-teal-200 hidden sm:inline-block">
                    {rx.status}
                  </span>
                  <button
                    onClick={() => onNavigate('e-prescriptions')}
                    className="px-3 py-1.5 rounded-lg bg-teal-700 text-white text-xs font-semibold hover:bg-teal-800 transition-colors cursor-pointer"
                  >
                    Dispense
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="p-4 bg-slate-50/60 rounded-b-xl border-t border-slate-100 text-xs text-slate-500 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              Automatic FEFO Batch Allocation & Allergen Warning enabled
            </span>
            <span className="font-medium text-slate-700">Average dispense time: 2.4 mins</span>
          </div>
        </div>

        {/* Right 1 Col: Urgent Alerts & Compliance */}
        <div className="bg-white rounded-xl border border-slate-200/90 shadow-xs flex flex-col">
          <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-amber-600" />
              <h3 className="font-bold text-sm text-slate-900">Priority Alerts & Compliance</h3>
            </div>
          </div>

          <div className="p-4 space-y-3 flex-1 overflow-y-auto">
            {urgentAlerts.map((alt) => (
              <div
                key={alt.id}
                className="p-3.5 rounded-lg border border-slate-200 bg-slate-50/50 hover:bg-slate-50 transition-colors space-y-2"
              >
                <div className="flex items-start justify-between gap-2">
                  <h4 className="text-xs font-bold text-slate-900 leading-snug">{alt.title}</h4>
                </div>
                <p className="text-[11px] text-slate-600 leading-relaxed">{alt.desc}</p>
                <button
                  onClick={() => onNavigate(alt.moduleId)}
                  className="inline-flex items-center gap-1 text-xs font-bold text-teal-700 hover:text-teal-900 cursor-pointer"
                >
                  <span>{alt.action}</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>

          {/* Quick Shortcuts */}
          <div className="p-4 border-t border-slate-100 bg-slate-50/70 rounded-b-xl">
            <div className="text-[11px] font-bold uppercase text-slate-400 tracking-wider mb-2">
              SCM Multi-Branch Actions
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => onNavigate('stock-transfers')}
                className="p-2 rounded-lg bg-white border border-slate-200 text-xs font-medium text-slate-700 hover:bg-slate-100 text-left transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <Boxes className="w-3.5 h-3.5 text-teal-600" />
                <span>Inter-Branch Transfer</span>
              </button>
              <button
                onClick={() => onNavigate('purchase-orders')}
                className="p-2 rounded-lg bg-white border border-slate-200 text-xs font-medium text-slate-700 hover:bg-slate-100 text-left transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <ShoppingCart className="w-3.5 h-3.5 text-teal-600" />
                <span>Purchase Order & GRN</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
