import {
  Calendar,
  CheckCircle2,
  Eye,
  Plus,
  Printer,
  Stethoscope,
  Users,
  X,
} from 'lucide-react';
import React, { useMemo, useState } from 'react';
import {
  ConsultationNote,
  DOCTOR_CONSULTATIONS,
} from '../../data/doctorPortalData';
import { DataTable, DataTableColumn } from '../common/DataTable';
import { DropdownSelect } from '../common/DropdownSelect';
import { SummaryCard, SummaryCardGrid } from '../common/SummaryCard';

export const DoctorConsultationsView: React.FC = () => {
  const [notes, setNotes] = useState<ConsultationNote[]>(DOCTOR_CONSULTATIONS);
  const [selectedNote, setSelectedNote] = useState<ConsultationNote | null>(null);
  const [showNewModal, setShowNewModal] = useState(false);
  const [filterFollowUp, setFilterFollowUp] = useState('All');

  // New Consultation Note Form State
  const [patientName, setPatientName] = useState('');
  const [uhid, setUhid] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('Male');
  const [chiefComplaints, setChiefComplaints] = useState('');
  const [historyIllness, setHistoryIllness] = useState('');
  const [bp, setBp] = useState('130/80 mmHg');
  const [pulse, setPulse] = useState('76 bpm');
  const [temp] = useState('98.4 °F');
  const [spo2] = useState('98%');
  const [weight] = useState('70 kg');
  const [clinicalFindings, setClinicalFindings] = useState('');
  const [diagnosis, setDiagnosis] = useState('');
  const [investigations, setInvestigations] = useState('');
  const [treatmentPlan, setTreatmentPlan] = useState('');
  const [followUpDays] = useState('7 Days');

  // 4 Summary Metric Cards matching Appointment format
  const stats = useMemo(() => {
    const total = notes.length;
    const distinctPatients = new Set(notes.map((n) => n.uhid)).size;
    const followUps = notes.filter((n) => n.followUpDays.includes('Days')).length;
    return { total, distinctPatients, followUps };
  }, [notes]);

  const filteredNotes = useMemo(() => {
    if (filterFollowUp === 'All') return notes;
    return notes.filter((n) => n.followUpDays.includes(filterFollowUp));
  }, [notes, filterFollowUp]);

  const handleCreateNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!patientName.trim()) return;

    const newNote: ConsultationNote = {
      id: `con-${Date.now()}`,
      uhid: uhid.trim() || `UHID-2024-${Math.floor(1000 + Math.random() * 9000)}`,
      patientName: patientName.trim(),
      age: Number(age) || 45,
      gender,
      date: '20 Nov 2026',
      time: '04:45 PM',
      chiefComplaints,
      historyOfPresentIllness: historyIllness,
      vitals: {
        bp,
        pulse,
        temperature: temp,
        spo2,
        weight,
        bmi: '24.5',
      },
      clinicalFindings,
      diagnosis,
      investigationsOrdered: investigations ? investigations.split(',').map((s) => s.trim()) : [],
      treatmentPlan,
      followUpDays,
    };

    setNotes([newNote, ...notes]);
    setShowNewModal(false);
    setPatientName('');
    setUhid('');
    setAge('');
    setChiefComplaints('');
    setHistoryIllness('');
    setClinicalFindings('');
    setDiagnosis('');
    setInvestigations('');
    setTreatmentPlan('');
  };

  const columns: DataTableColumn<ConsultationNote>[] = [
    {
      key: 'date',
      header: 'Date & Time',
      sortable: true,
      sortValue: (r) => r.date,
      render: (r) => (
        <div className="whitespace-nowrap">
          <div className="font-semibold text-slate-900">{r.date}</div>
          <div className="text-[10px] text-slate-500">{r.time}</div>
        </div>
      ),
    },
    {
      key: 'patientName',
      header: 'Patient Name & UHID',
      sortable: true,
      sortValue: (r) => r.patientName,
      render: (r) => (
        <div>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setSelectedNote(r);
            }}
            className="font-bold text-slate-900 hover:text-[#006a4e] hover:underline text-left cursor-pointer whitespace-nowrap block"
          >
            {r.patientName}
          </button>
          <span className="text-[10px] text-slate-500">
            {r.uhid} • {r.age} yrs • {r.gender}
          </span>
        </div>
      ),
    },
    {
      key: 'chiefComplaints',
      header: 'Chief Complaints',
      render: (r) => (
        <div className="text-slate-700 font-medium max-w-xs truncate" title={r.chiefComplaints}>
          {r.chiefComplaints}
        </div>
      ),
    },
    {
      key: 'diagnosis',
      header: 'Provisional Diagnosis',
      render: (r) => (
        <span className="font-semibold text-slate-900 block max-w-xs truncate" title={r.diagnosis}>
          {r.diagnosis}
        </span>
      ),
    },
    {
      key: 'vitals',
      header: 'Key Vitals',
      render: (r) => (
        <div className="text-[11px] text-slate-600 whitespace-nowrap">
          BP: <strong className="font-semibold text-slate-800">{r.vitals.bp}</strong> • HR: {r.vitals.pulse}
        </div>
      ),
    },
    {
      key: 'followUpDays',
      header: 'Follow-up',
      sortable: true,
      sortValue: (r) => r.followUpDays,
      render: (r) => (
        <span className="px-1.5 py-0.5 rounded bg-emerald-50 text-[#006a4e] border border-[#006a4e]/20 text-[10px] font-semibold whitespace-nowrap">
          {r.followUpDays}
        </span>
      ),
    },
    {
      key: 'actions',
      header: 'Action',
      align: 'right',
      render: (r) => (
        <div className="flex items-center justify-end gap-1.5 whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
          <button
            type="button"
            onClick={() => setSelectedNote(r)}
            className="px-2 py-1 rounded-[3px] bg-[#006a4e] hover:bg-[#00553e] text-white text-[11px] font-semibold flex items-center gap-1 transition-colors cursor-pointer shadow-xs"
            title="View Full Consultation Slip"
          >
            <Eye className="w-3 h-3" />
            <span>View</span>
          </button>
          <button
            type="button"
            onClick={() => window.print()}
            className="p-1 rounded-[3px] hover:bg-slate-100 text-slate-500 hover:text-slate-800 cursor-pointer"
            title="Print Note"
          >
            <Printer className="w-3.5 h-3.5" />
          </button>
        </div>
      ),
    },
  ];

  const toolbarFilters = (
    <DropdownSelect
      value={filterFollowUp}
      onChange={(val) => setFilterFollowUp(val)}
      width="w-44"
      options={[
        { label: 'All Follow-ups', value: 'All' },
        { label: '7 Days', value: '7 Days' },
        { label: '14 Days', value: '14 Days' },
        { label: '1 Month', value: '1 Month' },
      ]}
    />
  );

  const toolbarActions = (
    <button
      type="button"
      onClick={() => setShowNewModal(true)}
      className="h-8 px-3 rounded-[3px] bg-[#006a4e] hover:bg-[#00523c] text-white text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shrink-0 shadow-xs"
    >
      <Plus className="w-3.5 h-3.5" />
      <span>New Consultation Note</span>
    </button>
  );

  return (
    <div className="space-y-2">
      {/* 4 Summary Metric Cards matching Appointment format */}
      <SummaryCardGrid>
        <SummaryCard
          title="Total Consultations"
          icon={Stethoscope}
          iconColor="text-[#006a4e]"
          value={`${stats.total} Notes`}
          subtitle="Documented clinical encounters"
        />
        <SummaryCard
          title="Distinct Patients"
          icon={Users}
          iconColor="text-cyan-600"
          value={`${stats.distinctPatients} Individuals`}
          valueColor="text-cyan-700"
          subtitle="Unique patient health records"
        />
        <SummaryCard
          title="Follow-up Protocols"
          icon={Calendar}
          iconColor="text-amber-600"
          value={`${stats.followUps} Scheduled`}
          valueColor="text-amber-700"
          subtitle="Assigned review schedules"
        />
        <SummaryCard
          title="Documented EMR Slips"
          icon={CheckCircle2}
          iconColor="text-emerald-600"
          value="100% Signed"
          valueColor="text-emerald-700"
          subtitle="Verified digital signatures"
        />
      </SummaryCardGrid>

      {/* Selected Consultation Quick View Card matching Appointment format */}
      {selectedNote && (
        <div className="bg-white border border-[#006a4e]/25 rounded-md p-4 shadow-xs">
          <div className="flex flex-wrap items-start justify-between gap-3 border-b border-slate-100 pb-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-[3px] bg-[#edf6f2] text-[#006a4e] font-bold text-sm flex items-center justify-center shrink-0">
                EMR
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="text-sm font-semibold text-slate-900">
                    {selectedNote.patientName}
                  </h3>
                  <span className="px-2 py-0.5 rounded-[3px] bg-slate-100 text-slate-700 text-[11px] font-medium">
                    {selectedNote.uhid}
                  </span>
                  <span className="text-xs text-slate-500">
                    {selectedNote.age} yrs • {selectedNote.gender}
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  Diagnosis: <span className="font-medium text-slate-800">{selectedNote.diagnosis}</span> • Date: {selectedNote.date} ({selectedNote.time})
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => window.print()}
                className="px-3 py-1.5 rounded-[3px] bg-[#006a4e] hover:bg-[#00523c] text-white text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Case Note</span>
              </button>
              <button
                type="button"
                onClick={() => setSelectedNote(null)}
                className="w-8 h-8 rounded-[3px] border border-slate-200 text-slate-500 hover:text-slate-800 hover:bg-slate-50 flex items-center justify-center cursor-pointer"
                aria-label="Close details"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-3 text-xs">
            <div className="p-2.5 bg-slate-50 rounded border border-slate-200">
              <span className="text-[10px] text-slate-500 block">Chief Complaints</span>
              <p className="font-semibold text-slate-800 mt-0.5">{selectedNote.chiefComplaints}</p>
            </div>
            <div className="p-2.5 bg-slate-50 rounded border border-slate-200">
              <span className="text-[10px] text-slate-500 block">History of Present Illness</span>
              <p className="text-slate-700 mt-0.5">{selectedNote.historyOfPresentIllness}</p>
            </div>
            <div className="p-2.5 bg-slate-50 rounded border border-slate-200">
              <span className="text-[10px] text-slate-500 block">Treatment &amp; Plan</span>
              <p className="font-semibold text-[#006a4e] mt-0.5">{selectedNote.treatmentPlan}</p>
            </div>
          </div>
        </div>
      )}

      {/* Appointment-Styled Enterprise DataTable */}
      <DataTable<ConsultationNote>
        data={filteredNotes}
        columns={columns}
        keyExtractor={(item) => item.id}
        searchPlaceholder="Search by patient name, UHID, or clinical diagnosis..."
        searchFilter={(item, query) =>
          item.patientName.toLowerCase().includes(query.toLowerCase()) ||
          item.uhid.toLowerCase().includes(query.toLowerCase()) ||
          item.diagnosis.toLowerCase().includes(query.toLowerCase()) ||
          item.chiefComplaints.toLowerCase().includes(query.toLowerCase())
        }
        filters={toolbarFilters}
        actionButton={toolbarActions}
        emptyMessage="No consultation notes found."
        onRowClick={(item) => setSelectedNote(item)}
        showSerial={true}
      />

      {/* New Consultation Note Modal */}
      {showNewModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-3">
          <div className="bg-white rounded-[3px] shadow-2xl border border-slate-200 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-3 bg-white border-b border-slate-200 flex items-center justify-between sticky top-0 z-10">
              <div className="flex items-center gap-2">
                <Stethoscope className="w-4 h-4 text-[#006a4e]" />
                <h3 className="text-sm font-bold text-slate-900">
                  New Clinical Consultation Note
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowNewModal(false)}
                className="text-slate-400 hover:text-slate-700 p-1 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateNote} className="p-4 space-y-3 text-xs">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <div className="sm:col-span-2">
                  <label className="block text-slate-700 font-bold mb-1">Patient Name *</label>
                  <input
                    type="text"
                    value={patientName}
                    onChange={(e) => setPatientName(e.target.value)}
                    required
                    placeholder="e.g. Md. Rahim Uddin"
                    className="w-full px-2.5 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-[#006a4e]"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">UHID</label>
                  <input
                    type="text"
                    value={uhid}
                    onChange={(e) => setUhid(e.target.value)}
                    placeholder="Auto-generated if empty"
                    className="w-full px-2.5 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-[#006a4e]"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Age &amp; Gender</label>
                  <div className="flex gap-1">
                    <input
                      type="number"
                      value={age}
                      onChange={(e) => setAge(e.target.value)}
                      placeholder="Age"
                      className="w-16 px-2 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-[#006a4e]"
                    />
                    <select
                      value={gender}
                      onChange={(e) => setGender(e.target.value)}
                      className="flex-1 px-1 py-1.5 border border-slate-300 rounded text-xs bg-white"
                    >
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Chief Complaints *</label>
                <input
                  type="text"
                  value={chiefComplaints}
                  onChange={(e) => setChiefComplaints(e.target.value)}
                  required
                  placeholder="e.g. Exertional chest tightness for 3 weeks"
                  className="w-full px-2.5 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-[#006a4e]"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">History of Present Illness</label>
                <textarea
                  rows={2}
                  value={historyIllness}
                  onChange={(e) => setHistoryIllness(e.target.value)}
                  placeholder="Clinical progression, aggravating/relieving factors..."
                  className="w-full px-2.5 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-[#006a4e]"
                />
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">BP (mmHg)</label>
                  <input
                    type="text"
                    value={bp}
                    onChange={(e) => setBp(e.target.value)}
                    className="w-full px-2.5 py-1.5 border border-slate-300 rounded text-xs font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Pulse (bpm)</label>
                  <input
                    type="text"
                    value={pulse}
                    onChange={(e) => setPulse(e.target.value)}
                    className="w-full px-2.5 py-1.5 border border-slate-300 rounded text-xs font-mono"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-slate-700 font-bold mb-1">Provisional Diagnosis *</label>
                  <input
                    type="text"
                    value={diagnosis}
                    onChange={(e) => setDiagnosis(e.target.value)}
                    required
                    placeholder="e.g. Stable Angina Pectoris (ICD-10 I20.9)"
                    className="w-full px-2.5 py-1.5 border border-slate-300 rounded text-xs font-semibold focus:ring-1 focus:ring-[#006a4e]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Clinical Findings &amp; Examination</label>
                <input
                  type="text"
                  value={clinicalFindings}
                  onChange={(e) => setClinicalFindings(e.target.value)}
                  placeholder="Auscultation, heart sounds, S1+S2, chest clear..."
                  className="w-full px-2.5 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-[#006a4e]"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Investigations Ordered (Comma separated)</label>
                <input
                  type="text"
                  value={investigations}
                  onChange={(e) => setInvestigations(e.target.value)}
                  placeholder="e.g. CBC, Lipid Profile, 12-lead ECG, Echo 2D"
                  className="w-full px-2.5 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-[#006a4e]"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Treatment Plan &amp; Advice</label>
                <textarea
                  rows={2}
                  value={treatmentPlan}
                  onChange={(e) => setTreatmentPlan(e.target.value)}
                  placeholder="Medical therapy, lifestyle modification, diet..."
                  className="w-full px-2.5 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-[#006a4e]"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setShowNewModal(false)}
                  className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-[#006a4e] hover:bg-[#00523d] text-white text-xs font-bold rounded cursor-pointer transition-colors shadow-xs"
                >
                  Save &amp; Sign Note
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
