import {
  Activity,
  Calendar,
  ChevronDown,
  Eye,
  History,
  MoreVertical,
  Plus,
  Printer,
  Stethoscope,
  Trash2,
  Users,
  X,
} from 'lucide-react';
import React, { useEffect, useMemo, useState } from 'react';
import { SMART_OPD_RECORDS, SmartOpdRecord } from '../../../data/superadminOpdData';
import { DataTable, DataTableColumn } from '../../common/DataTable';

type OpdTab = 'today' | 'upcoming' | 'old' | 'patient-view';

export const OpdDirectory: React.FC = () => {
  const [records, setRecords] = useState<SmartOpdRecord[]>(SMART_OPD_RECORDS);
  const [activeTab, setActiveTab] = useState<OpdTab>('today');
  const [selectedRecord, setSelectedRecord] = useState<SmartOpdRecord | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [activeActionId, setActiveActionId] = useState<string | null>(null);

  // Form state for adding an OPD patient
  const [formPatientName, setFormPatientName] = useState('');
  const [formCaseId, setFormCaseId] = useState('7960');
  const [formConsultant, setFormConsultant] = useState('Reyan Jain (9011)');
  const [formAppointmentDate, setFormAppointmentDate] = useState('20/11/2026 10:00 AM');
  const [formSymptoms, setFormSymptoms] = useState('');
  const [formIsAntenatal, setFormIsAntenatal] = useState<'Yes' | 'No'>('No');
  const [formPreviousIssue, setFormPreviousIssue] = useState('-');
  const [formReference, setFormReference] = useState('-');

  useEffect(() => {
    const handleOutside = () => setActiveActionId(null);
    window.addEventListener('click', handleOutside);
    return () => window.removeEventListener('click', handleOutside);
  }, []);

  // Summary statistics matching PatientDirectory 4-Card format
  const stats = useMemo(() => {
    const total = records.length;
    const todayCount = records.filter((r) => r.tab === 'today').length;
    const upcomingCount = records.filter((r) => r.tab === 'upcoming').length;
    const oldCount = records.filter((r) => r.tab === 'old').length;
    return { total, todayCount, upcomingCount, oldCount };
  }, [records]);

  // Filter records by tab
  const filteredRecords = useMemo(() => {
    if (activeTab === 'patient-view') return records;
    return records.filter((r) => r.tab === activeTab);
  }, [records, activeTab]);

  const handleAddPatientSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formPatientName.trim()) return;

    const nextOpdNum = 7895 + records.length;
    const newRecord: SmartOpdRecord = {
      id: `opd-${Date.now()}`,
      opdNo: `OPDN${nextOpdNum}`,
      patientName: formPatientName.trim(),
      patientId: `${1035 + records.length}`,
      caseId: formCaseId || '-',
      appointmentDate: formAppointmentDate,
      generatedBy: 'Super Admin (9001)',
      consultant: formConsultant,
      reference: formReference || '-',
      symptoms: formSymptoms.trim() || 'General physical checkup requested.',
      isAntenatal: formIsAntenatal,
      previousMedicalIssue: formPreviousIssue || '-',
      tab: 'today',
    };

    setRecords((prev) => [newRecord, ...prev]);
    setSelectedRecord(newRecord);
    setShowAddModal(false);
    setFormPatientName('');
    setFormSymptoms('');
  };

  const handleDeleteRecord = (id: string) => {
    setRecords((prev) => prev.filter((r) => r.id !== id));
    if (selectedRecord?.id === id) {
      setSelectedRecord(null);
    }
  };

  // Columns definition
  const columns: DataTableColumn<SmartOpdRecord>[] = [
    {
      key: 'opdNo',
      header: 'OPD No',
      sortable: true,
      sortValue: (r) => r.opdNo,
      render: (r: SmartOpdRecord) => (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setSelectedRecord(r);
          }}
          className="text-[#0094b6] hover:underline font-bold text-left cursor-pointer whitespace-nowrap"
        >
          {r.opdNo}
        </button>
      ),
    },
    {
      key: 'patientName',
      header: 'Patient Name',
      sortable: true,
      sortValue: (r) => r.patientName,
      render: (r: SmartOpdRecord) => (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setSelectedRecord(r);
          }}
          className="text-slate-900 font-semibold hover:text-[#0094b6] hover:underline text-left cursor-pointer whitespace-nowrap"
        >
          {r.patientName}
        </button>
      ),
    },
    {
      key: 'caseId',
      header: 'Case ID',
      align: 'center',
      sortable: true,
      sortValue: (r) => r.caseId,
      render: (r: SmartOpdRecord) => (
        <span className="text-slate-700 font-semibold">{r.caseId}</span>
      ),
    },
    {
      key: 'appointmentDate',
      header: 'Appointment Date',
      sortable: true,
      sortValue: (r) => r.appointmentDate,
      render: (r: SmartOpdRecord) => (
        <span className="text-slate-800 whitespace-nowrap font-medium text-[10.5px]">
          {r.appointmentDate}
        </span>
      ),
    },
    {
      key: 'generatedBy',
      header: 'Generated By',
      render: (r: SmartOpdRecord) => (
        <span className="text-slate-700 whitespace-nowrap">{r.generatedBy}</span>
      ),
    },
    {
      key: 'consultant',
      header: 'Consultant',
      sortable: true,
      sortValue: (r) => r.consultant,
      render: (r: SmartOpdRecord) => (
        <span className="text-slate-800 font-medium whitespace-nowrap">{r.consultant}</span>
      ),
    },
    {
      key: 'reference',
      header: 'Reference',
      align: 'center',
      render: (r: SmartOpdRecord) => (
        <span className="text-slate-500">{r.reference}</span>
      ),
    },
    {
      key: 'symptoms',
      header: 'Symptoms',
      render: (r: SmartOpdRecord) => (
        <span className="text-slate-600 line-clamp-2 max-w-sm text-[10.5px] leading-tight block">
          {r.symptoms}
        </span>
      ),
    },
    {
      key: 'isAntenatal',
      header: 'Is Antenatal',
      align: 'center',
      render: (r: SmartOpdRecord) => (
        <span
          className={`px-1.5 py-0.5 rounded-[3px] font-semibold text-[10px] ${r.isAntenatal === 'Yes'
            ? 'bg-rose-50 text-rose-700 border border-rose-200'
            : 'bg-slate-100 text-slate-600'
            }`}
        >
          {r.isAntenatal}
        </span>
      ),
    },
    {
      key: 'previousMedicalIssue',
      header: 'Previous Medical Issue',
      render: (r: SmartOpdRecord) => (
        <span className="text-slate-600 text-[10.5px] whitespace-nowrap">
          {r.previousMedicalIssue}
        </span>
      ),
    },
    {
      key: 'action',
      header: 'Action',
      align: 'center',
      render: (r: SmartOpdRecord, idx?: number) => {
        const isNearBottom = (idx ?? 0) >= 5;
        return (
          <div className="relative inline-block text-left">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setActiveActionId((prev) => (prev === r.id ? null : r.id));
              }}
              className="w-5 h-5 rounded-[3px] hover:bg-slate-200/80 text-slate-500 hover:text-slate-800 flex items-center justify-center transition-colors cursor-pointer mx-auto"
              title="More actions"
              aria-label="Actions"
            >
              <MoreVertical className="w-3.5 h-3.5" />
            </button>

            {activeActionId === r.id && (
              <div
                className={`absolute right-0 ${isNearBottom ? 'bottom-full mb-1' : 'top-full mt-1'
                  } w-36 bg-white border border-slate-200 rounded-[3px] shadow-lg py-1 z-40 text-left divide-y divide-slate-100`}
                onClick={(e) => e.stopPropagation()}
              >
                <div className="py-0.5">
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedRecord(r);
                      setActiveActionId(null);
                    }}
                    className="w-full text-left px-2.5 py-1.5 text-[11px] text-slate-700 hover:bg-[#f0f8fa] hover:text-[#0094b6] font-medium flex items-center gap-2 cursor-pointer transition-colors"
                  >
                    <Eye className="w-3.5 h-3.5 text-[#0094b6]" />
                    <span>View Details</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedRecord(r);
                      setActiveActionId(null);
                      setTimeout(() => window.print(), 150);
                    }}
                    className="w-full text-left px-2.5 py-1.5 text-[11px] text-slate-700 hover:bg-slate-50 font-medium flex items-center gap-2 cursor-pointer transition-colors"
                  >
                    <Printer className="w-3.5 h-3.5 text-slate-500" />
                    <span>Print OPD Card</span>
                  </button>
                </div>
                <div className="py-0.5">
                  <button
                    type="button"
                    onClick={() => {
                      handleDeleteRecord(r.id);
                      setActiveActionId(null);
                    }}
                    className="w-full text-left px-2.5 py-1.5 text-[11px] text-rose-600 hover:bg-rose-50 font-medium flex items-center gap-2 cursor-pointer transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5 text-rose-500" />
                    <span>Delete</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        );
      },
    },
  ];

  // Toolbar filters matching PatientDirectory dropdowns
  const toolbarFilters = (
    <div className="relative">
      <select
        aria-label="Filter by OPD queue"
        value={activeTab}
        onChange={(e) => setActiveTab(e.target.value as OpdTab)}
        className="h-8 pl-2.5 pr-7 rounded-[3px] border border-slate-200 bg-white text-xs font-medium text-slate-700 appearance-none focus:outline-none focus:border-[#0094b6] cursor-pointer"
      >
        <option value="today">Today OPD Queue ({stats.todayCount})</option>
        <option value="upcoming">Upcoming OPD ({stats.upcomingCount})</option>
        <option value="old">Old Consultations ({stats.oldCount})</option>
        <option value="patient-view">All OPD Patients ({stats.total})</option>
      </select>
      <ChevronDown className="w-3.5 h-3.5 text-slate-400 pointer-events-none absolute right-2 top-1/2 -translate-y-1/2" />
    </div>
  );

  // Toolbar actions matching PatientDirectory style
  const toolbarActions = (
    <button
      type="button"
      onClick={() => setShowAddModal(true)}
      className="h-8 px-3 rounded-[3px] bg-[#0094b6] hover:bg-[#007f9c] text-white text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
    >
      <Plus className="w-3.5 h-3.5" />
      <span>Add Patient</span>
    </button>
  );

  return (
    <div className="space-y-2">
      {/* 4 Summary Metric Cards matching PatientDirectory format */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
        <div className="bg-white border border-slate-300 rounded-[3px] p-2.5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[10.5px] font-bold text-slate-700">Total OPD Visits</span>
            <Users className="w-3.5 h-3.5 text-[#0094b6]" />
          </div>
          <div className="my-1">
            <span className="text-base font-extrabold text-slate-900 leading-none">
              {stats.total} Patients
            </span>
          </div>
          <p className="text-[10px] text-slate-500">Registered outpatient consultations</p>
        </div>

        <div className="bg-white border border-slate-300 rounded-[3px] p-2.5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[10.5px] font-bold text-slate-700">Today's Queue</span>
            <Activity className="w-3.5 h-3.5 text-emerald-600" />
          </div>
          <div className="my-1">
            <span className="text-base font-extrabold text-emerald-700 leading-none">
              {stats.todayCount} Scheduled
            </span>
          </div>
          <p className="text-[10px] text-slate-500">Active tokens for today</p>
        </div>

        <div className="bg-white border border-slate-300 rounded-[3px] p-2.5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[10.5px] font-bold text-slate-700">Upcoming Visits</span>
            <Calendar className="w-3.5 h-3.5 text-amber-600" />
          </div>
          <div className="my-1">
            <span className="text-base font-extrabold text-amber-600 leading-none">
              {stats.upcomingCount} Booked
            </span>
          </div>
          <p className="text-[10px] text-slate-500">Advance booked consultations</p>
        </div>

        <div className="bg-white border border-slate-300 rounded-[3px] p-2.5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[10.5px] font-bold text-slate-700">Past Consultations</span>
            <History className="w-3.5 h-3.5 text-slate-500" />
          </div>
          <div className="my-1">
            <span className="text-base font-extrabold text-slate-700 leading-none">
              {stats.oldCount} Completed
            </span>
          </div>
          <p className="text-[10px] text-slate-500">Historical case records</p>
        </div>
      </div>

      {/* Selected OPD Quick View Card matching Patient quick view styling */}
      {selectedRecord && (
        <div className="bg-white border border-[#0094b6]/30 rounded-md p-4">
          <div className="flex flex-wrap items-start justify-between gap-3 border-b border-slate-100 pb-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-[3px] bg-[#f0f8fa] text-[#0094b6] font-bold text-sm flex items-center justify-center">
                <Stethoscope className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="text-sm font-semibold text-slate-900">{selectedRecord.patientName}</h3>
                  <span className="px-2 py-0.5 rounded-[3px] bg-[#f0f8fa] text-[#0094b6] font-bold text-[11px]">
                    {selectedRecord.opdNo}
                  </span>
                  <span className="px-2 py-0.5 rounded-[3px] bg-slate-100 text-slate-700 text-[11px] font-medium">
                    Case #{selectedRecord.caseId}
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  Consultant: <strong className="text-slate-800">{selectedRecord.consultant}</strong> · Appointment: {selectedRecord.appointmentDate}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => window.print()}
                className="h-8 px-3 rounded-[3px] border border-slate-200 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-700 inline-flex items-center gap-1.5 cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5 text-slate-500" />
                <span>Print OPD Slip</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedRecord(null)}
                className="w-8 h-8 rounded-[3px] border border-slate-200 text-slate-500 hover:text-slate-800 hover:bg-slate-50 flex items-center justify-center cursor-pointer"
                aria-label="Close OPD quick view"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 text-xs">
            <div>
              <p className="text-[11px] text-slate-400">Chief Symptoms / Complaint</p>
              <p className="font-medium text-slate-800 mt-0.5 line-clamp-2">{selectedRecord.symptoms}</p>
            </div>
            <div>
              <p className="text-[11px] text-slate-400">Previous Medical History</p>
              <p className="font-medium text-slate-800 mt-0.5">{selectedRecord.previousMedicalIssue}</p>
            </div>
            <div>
              <p className="text-[11px] text-slate-400">Antenatal Status &amp; Reference</p>
              <p className="font-medium text-slate-800 mt-0.5">
                Antenatal: {selectedRecord.isAntenatal} · Ref: {selectedRecord.reference}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Reusable DataTable matching PatientDirectory */}
      <DataTable<SmartOpdRecord>
        title="OPD Out-Patient Directory"
        subtitle="Consultation queues, appointment dates, and consultant assignments"
        data={filteredRecords}
        columns={columns}
        rowKey={(row) => row.id}
        searchable
        searchPlaceholder="Search by OPD no, patient name, consultant, symptoms..."
        searchFilter={(r, q) =>
          r.opdNo.toLowerCase().includes(q) ||
          r.patientName.toLowerCase().includes(q) ||
          r.consultant.toLowerCase().includes(q) ||
          r.symptoms.toLowerCase().includes(q) ||
          r.caseId.toLowerCase().includes(q)
        }
        toolbarFilters={toolbarFilters}
        toolbarActions={toolbarActions}
        defaultPageSize={30}
        pageSizeOptions={[10, 20, 30, 50, 100]}
        emptyTitle="No OPD records found"
        emptyDescription="There are currently no outpatient records matching the selected queue filter or search query."
      />

      {/* Add Patient Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/40 backdrop-blur-xs flex items-center justify-center p-3">
          <div className="bg-white rounded-[3px] border border-slate-300 shadow-xl w-full max-w-xl p-3.5 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-200 pb-2">
              <div className="flex items-center gap-1.5">
                <Stethoscope className="w-4 h-4 text-[#0094b6]" />
                <h3 className="text-xs font-bold text-slate-900">
                  Register OPD Patient Consultation
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="w-5 h-5 rounded-[3px] text-slate-400 hover:text-slate-700 flex items-center justify-center cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            <form onSubmit={handleAddPatientSubmit} className="space-y-2.5 text-[11px]">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[10.5px] font-semibold text-slate-700 mb-0.5">
                    Patient Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formPatientName}
                    onChange={(e) => setFormPatientName(e.target.value)}
                    placeholder="e.g. Jonathan Hibbins"
                    className="w-full h-7 px-2 border border-slate-300 rounded-[3px] text-[11px] focus:outline-none focus:border-[#0094b6]"
                  />
                </div>

                <div>
                  <label className="block text-[10.5px] font-semibold text-slate-700 mb-0.5">
                    Case ID
                  </label>
                  <input
                    type="text"
                    value={formCaseId}
                    onChange={(e) => setFormCaseId(e.target.value)}
                    placeholder="7938"
                    className="w-full h-7 px-2 border border-slate-300 rounded-[3px] text-[11px] focus:outline-none focus:border-[#0094b6]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[10.5px] font-semibold text-slate-700 mb-0.5">
                    Consultant Doctor *
                  </label>
                  <select
                    value={formConsultant}
                    onChange={(e) => setFormConsultant(e.target.value)}
                    className="w-full h-7 px-2 border border-slate-300 rounded-[3px] bg-white text-[11px] focus:outline-none focus:border-[#0094b6]"
                  >
                    <option value="Reyan Jain (9011)">Reyan Jain (9011)</option>
                    <option value="Amit Singh (9009)">Amit Singh (9009)</option>
                    <option value="Dr. Farhana Yasmin (9013)">Dr. Farhana Yasmin (9013)</option>
                    <option value="Dr. Kamrul Islam (9014)">Dr. Kamrul Islam (9014)</option>
                    <option value="Dr. Tariqul Anwar (9015)">Dr. Tariqul Anwar (9015)</option>
                    <option value="Prof. Dr. Tanvir Ahmed (9010)">Prof. Dr. Tanvir Ahmed (9010)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10.5px] font-semibold text-slate-700 mb-0.5">
                    Appointment Date &amp; Time
                  </label>
                  <input
                    type="text"
                    value={formAppointmentDate}
                    onChange={(e) => setFormAppointmentDate(e.target.value)}
                    className="w-full h-7 px-2 border border-slate-300 rounded-[3px] text-[11px] focus:outline-none focus:border-[#0094b6]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10.5px] font-semibold text-slate-700 mb-0.5">
                  Symptoms &amp; Clinical Notes
                </label>
                <textarea
                  rows={2}
                  value={formSymptoms}
                  onChange={(e) => setFormSymptoms(e.target.value)}
                  placeholder="Constant abdominal pain, vomiting, fever..."
                  className="w-full p-2 border border-slate-300 rounded-[3px] text-[11px] focus:outline-none focus:border-[#0094b6]"
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-[10.5px] font-semibold text-slate-700 mb-0.5">
                    Is Antenatal?
                  </label>
                  <select
                    value={formIsAntenatal}
                    onChange={(e) => setFormIsAntenatal(e.target.value as 'Yes' | 'No')}
                    className="w-full h-7 px-2 border border-slate-300 rounded-[3px] bg-white text-[11px] focus:outline-none focus:border-[#0094b6]"
                  >
                    <option value="No">No</option>
                    <option value="Yes">Yes</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10.5px] font-semibold text-slate-700 mb-0.5">
                    Previous Medical Issue
                  </label>
                  <input
                    type="text"
                    value={formPreviousIssue}
                    onChange={(e) => setFormPreviousIssue(e.target.value)}
                    placeholder="e.g. Hypertension"
                    className="w-full h-7 px-2 border border-slate-300 rounded-[3px] text-[11px] focus:outline-none focus:border-[#0094b6]"
                  />
                </div>

                <div>
                  <label className="block text-[10.5px] font-semibold text-slate-700 mb-0.5">
                    Reference
                  </label>
                  <input
                    type="text"
                    value={formReference}
                    onChange={(e) => setFormReference(e.target.value)}
                    placeholder="Doctor / Agent"
                    className="w-full h-7 px-2 border border-slate-300 rounded-[3px] text-[11px] focus:outline-none focus:border-[#0094b6]"
                  />
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end gap-1.5 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="h-7 px-2.5 border border-slate-300 rounded-[3px] text-[11px] text-slate-700 hover:bg-slate-100 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="h-7 px-3 bg-[#0094b6] hover:bg-[#007f9c] text-white rounded-[3px] text-[11px] font-semibold cursor-pointer shadow-xs"
                >
                  Save OPD Consultation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default OpdDirectory;
