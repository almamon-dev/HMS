import {
  Activity,
  AlertTriangle,
  CheckCircle2,
  Heart,
  Plus,
  TrendingUp,
  X,
} from 'lucide-react';
import React, { useMemo, useState } from 'react';
import {
  PATIENT_VITALS,
  PatientVitalItem,
} from '../../data/patientPortalData';
import { DataTable, DataTableColumn } from '../common/DataTable';
import { DropdownSelect } from '../common/DropdownSelect';
import { SummaryCard, SummaryCardGrid } from '../common/SummaryCard';

export const PatientVitalsView: React.FC = () => {
  const [vitals, setVitals] = useState<PatientVitalItem[]>(PATIENT_VITALS);
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedVital, setSelectedVital] = useState<PatientVitalItem | null>(null);
  const [isLogModalOpen, setIsLogModalOpen] = useState(false);

  // New Vital Form State
  const [bpSystolic, setBpSystolic] = useState('125');
  const [bpDiastolic, setBpDiastolic] = useState('82');
  const [heartRate, setHeartRate] = useState('76');
  const [glucose, setGlucose] = useState('6.0');
  const [spo2, setSpo2] = useState('99');
  const [weight, setWeight] = useState('76');

  const latestVital = vitals[0] || {
    bp: '--/--',
    heartRate: 0,
    glucose: '--',
    spo2: 0,
    weight: 0,
  };

  const filteredVitals = useMemo(() => {
    if (statusFilter === 'All') return vitals;
    return vitals.filter((v) => v.status === statusFilter);
  }, [vitals, statusFilter]);

  const handleLogVital = (e: React.FormEvent) => {
    e.preventDefault();
    const newVital: PatientVitalItem = {
      id: `v-${Date.now()}`,
      date: 'Today (20 Nov 2026)',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      bp: `${bpSystolic}/${bpDiastolic} mmHg`,
      heartRate: parseInt(heartRate, 10) || 75,
      glucose: `${glucose} mmol/L (Self-logged)`,
      spo2: parseInt(spo2, 10) || 98,
      weight: parseFloat(weight) || 76,
      status: parseInt(bpSystolic, 10) > 135 || parseInt(bpDiastolic, 10) > 85 ? 'Elevated' : 'Normal',
    };

    setVitals([newVital, ...vitals]);
    setIsLogModalOpen(false);
  };

  const columns: DataTableColumn<PatientVitalItem>[] = [
    {
      key: 'date',
      header: 'Recorded Date',
      sortable: true,
      sortValue: (r) => r.date,
      render: (r) => (
        <div>
          <span className="font-bold text-[#006a4e] block text-xs">{r.date}</span>
          <span className="text-[10px] text-slate-500">{r.time}</span>
        </div>
      ),
    },
    {
      key: 'bp',
      header: 'Blood Pressure',
      sortable: true,
      sortValue: (r) => r.bp,
      render: (r) => {
        const isElevated = r.status === 'Elevated';
        return (
          <span
            className={`inline-flex items-center gap-1 font-mono font-bold text-xs px-2 py-0.5 rounded ${isElevated
              ? 'bg-rose-50 text-rose-700 border border-rose-200'
              : 'bg-emerald-50 text-[#006a4e] border border-[#006a4e]/20'
              }`}
          >
            {r.bp}
          </span>
        );
      },
    },
    {
      key: 'heartRate',
      header: 'Heart Rate',
      sortable: true,
      sortValue: (r) => r.heartRate,
      render: (r) => (
        <span className="font-semibold text-slate-800 text-xs">
          {r.heartRate} <span className="text-[10px] text-slate-500 font-normal">bpm</span>
        </span>
      ),
    },
    {
      key: 'glucose',
      header: 'Blood Glucose',
      sortable: true,
      sortValue: (r) => r.glucose,
      render: (r) => (
        <span className="text-slate-800 text-xs font-medium">
          {r.glucose}
        </span>
      ),
    },
    {
      key: 'spo2',
      header: 'SpO2 Saturation',
      sortable: true,
      sortValue: (r) => r.spo2,
      render: (r) => (
        <span className="text-slate-800 text-xs font-semibold">
          {r.spo2}%
        </span>
      ),
    },
    {
      key: 'weight',
      header: 'Weight',
      sortable: true,
      sortValue: (r) => r.weight,
      render: (r) => (
        <span className="text-slate-700 text-xs font-medium">
          {r.weight} <span className="text-[10px] text-slate-500 font-normal">kg</span>
        </span>
      ),
    },
    {
      key: 'status',
      header: 'Clinical Status',
      sortable: true,
      sortValue: (r) => r.status,
      render: (r) => (
        <span
          className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-semibold ${r.status === 'Elevated'
            ? 'bg-rose-50 text-rose-700'
            : 'bg-emerald-50 text-[#006a4e]'
            }`}
        >
          {r.status === 'Elevated' ? (
            <AlertTriangle className="w-2.5 h-2.5 text-rose-600" />
          ) : (
            <CheckCircle2 className="w-2.5 h-2.5 text-[#006a4e]" />
          )}
          {r.status}
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-2">
      {/* 4 Summary Metric Cards */}
      <SummaryCardGrid>
        <SummaryCard
          title="Latest Blood Pressure"
          icon={Activity}
          iconColor="text-rose-600"
          value={latestVital.bp}
          subtitle={<span className="text-rose-600 font-semibold">{latestVital.status} · Monitored</span>}
        />
        <SummaryCard
          title="Resting Pulse Rate"
          icon={Heart}
          iconColor="text-[#006a4e]"
          value={`${latestVital.heartRate} bpm`}
          valueColor="text-[#006a4e]"
          subtitle="Normal sinus rhythm"
        />
        <SummaryCard
          title="Blood Glucose"
          icon={TrendingUp}
          iconColor="text-amber-600"
          value={`${latestVital.glucose.split(' ')[0]} mmol/L`}
          valueColor="text-amber-700"
          subtitle="Target diabetic range"
        />
        <SummaryCard
          title="Oxygen Saturation"
          icon={CheckCircle2}
          iconColor="text-emerald-600"
          value={`${latestVital.spo2}% SpO2`}
          valueColor="text-emerald-700"
          subtitle="Adequate room air"
        />
      </SummaryCardGrid>

      {/* Main Table Card */}
      <div className="bg-white border border-slate-300 rounded-[3px] shadow-xs">
        <div className="p-2 sm:p-2.5 border-b border-slate-200 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-800">Filter Status:</span>
            <DropdownSelect
              options={[
                { value: 'All', label: 'All Readings' },
                { value: 'Normal', label: 'Normal' },
                { value: 'Elevated', label: 'Elevated' },
              ]}
              value={statusFilter}
              onChange={setStatusFilter}
              className="w-40"
            />
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsLogModalOpen(true)}
              className="inline-flex items-center gap-1 px-3 py-1 bg-[#006a4e] hover:bg-[#00523d] text-white text-xs font-bold rounded cursor-pointer transition-colors shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              Log New Vitals
            </button>
          </div>
        </div>

        <DataTable
          columns={columns}
          data={filteredVitals}
          keyExtractor={(item) => item.id}
          searchPlaceholder="Search vitals history..."
          searchFilter={(item, query) =>
            item.date.toLowerCase().includes(query.toLowerCase()) ||
            item.bp.toLowerCase().includes(query.toLowerCase()) ||
            item.status.toLowerCase().includes(query.toLowerCase())
          }
          defaultSort={{ key: 'date', order: 'desc' }}
          showSerial={true}
          emptyMessage="No vitals records logged yet."
          onRowClick={(item) => setSelectedVital(item)}
        />
      </div>

      {/* Quick View Details Card */}
      {selectedVital && (
        <div className="bg-white border border-[#006a4e]/25 rounded-[3px] p-3 shadow-xs">
          <div className="flex items-center justify-between border-b border-slate-200 pb-2 mb-2">
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-[#006a4e]" />
              <h4 className="text-xs font-bold text-slate-900">
                Vital Signs Reading: {selectedVital.date} ({selectedVital.time})
              </h4>
            </div>
            <button
              type="button"
              onClick={() => setSelectedVital(null)}
              className="text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-xs">
            <div className="p-2 bg-slate-50 border border-slate-200 rounded">
              <span className="text-[10px] text-slate-500 block">Blood Pressure</span>
              <span className="font-extrabold text-slate-900 font-mono text-sm">{selectedVital.bp}</span>
            </div>
            <div className="p-2 bg-slate-50 border border-slate-200 rounded">
              <span className="text-[10px] text-slate-500 block">Heart Rate</span>
              <span className="font-extrabold text-slate-900 text-sm">{selectedVital.heartRate} bpm</span>
            </div>
            <div className="p-2 bg-slate-50 border border-slate-200 rounded">
              <span className="text-[10px] text-slate-500 block">Blood Glucose</span>
              <span className="font-extrabold text-slate-900 text-sm">{selectedVital.glucose}</span>
            </div>
            <div className="p-2 bg-slate-50 border border-slate-200 rounded">
              <span className="text-[10px] text-slate-500 block">Oxygen SpO2</span>
              <span className="font-extrabold text-slate-900 text-sm">{selectedVital.spo2}%</span>
            </div>
            <div className="p-2 bg-slate-50 border border-slate-200 rounded">
              <span className="text-[10px] text-slate-500 block">Body Weight</span>
              <span className="font-extrabold text-slate-900 text-sm">{selectedVital.weight} kg</span>
            </div>
          </div>
        </div>
      )}

      {/* Log New Vitals Modal */}
      {isLogModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/50 backdrop-blur-xs">
          <div className="bg-white rounded-[3px] shadow-2xl max-w-lg w-full p-4 border border-slate-200 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-200 pb-2">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-[#006a4e]" />
                <h3 className="text-sm font-bold text-slate-900">Log Daily Vital Signs</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsLogModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleLogVital} className="space-y-3">
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">
                    Systolic BP (mmHg) *
                  </label>
                  <input
                    type="number"
                    value={bpSystolic}
                    onChange={(e) => setBpSystolic(e.target.value)}
                    required
                    className="w-full px-2.5 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-[#006a4e]"
                    placeholder="e.g. 120"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">
                    Diastolic BP (mmHg) *
                  </label>
                  <input
                    type="number"
                    value={bpDiastolic}
                    onChange={(e) => setBpDiastolic(e.target.value)}
                    required
                    className="w-full px-2.5 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-[#006a4e]"
                    placeholder="e.g. 80"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">
                    Heart Rate (bpm)
                  </label>
                  <input
                    type="number"
                    value={heartRate}
                    onChange={(e) => setHeartRate(e.target.value)}
                    className="w-full px-2.5 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-[#006a4e]"
                    placeholder="e.g. 75"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">
                    Blood Glucose (mmol/L)
                  </label>
                  <input
                    type="text"
                    value={glucose}
                    onChange={(e) => setGlucose(e.target.value)}
                    className="w-full px-2.5 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-[#006a4e]"
                    placeholder="e.g. 5.8"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">
                    Oxygen SpO2 (%)
                  </label>
                  <input
                    type="number"
                    value={spo2}
                    onChange={(e) => setSpo2(e.target.value)}
                    className="w-full px-2.5 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-[#006a4e]"
                    placeholder="e.g. 98"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">
                    Weight (kg)
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                    className="w-full px-2.5 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-[#006a4e]"
                    placeholder="e.g. 76"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsLogModalOpen(false)}
                  className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-[#006a4e] hover:bg-[#00523d] text-white text-xs font-bold rounded cursor-pointer transition-colors shadow-xs"
                >
                  Save Reading
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
