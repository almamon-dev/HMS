import {
  Activity,
  Bed,
  Building2,
  ChevronDown,
  Clock,
  Droplets,
  Eye,
  FileText,
  MoreVertical,
  Phone,
  Plus,
  Stethoscope,
  UserCheck,
  Users,
  X,
} from 'lucide-react';
import React, { useEffect, useMemo, useState } from 'react';
import type {
  HospitalCampus,
  PatientRecord,
  PatientStatus,
  PatientVisitType,
} from '../../../data/patientsData';
import { PATIENT_RECORDS } from '../../../data/patientsData';
import type { DataTableColumn } from '../../common/DataTable';
import { DataTable } from '../../common/DataTable';

const STATUS_BADGE_MAP: Record<PatientStatus, string> = {
  'Active OPD': 'bg-[#edf6f2] text-[#006a4e] border-[#006a4e]/20',
  Admitted: 'bg-[#e6f6fa] text-[#0094b6] border-[#0094b6]/20',
  'Under Review': 'bg-amber-50 text-amber-700 border-amber-200',
  Discharged: 'bg-slate-100 text-slate-600 border-slate-200',
};


const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'];
const CAMPUSES: HospitalCampus[] = ['Dhanmondi', 'Uttara', 'Mirpur'];
const STATUS_OPTIONS: PatientStatus[] = [
  'Active OPD',
  'Admitted',
  'Under Review',
  'Discharged',
];

export const PatientDirectory: React.FC = () => {
  const [patients, setPatients] = useState<PatientRecord[]>(PATIENT_RECORDS);
  const [campusFilter, setCampusFilter] = useState<'All' | HospitalCampus>('All');
  const [statusFilter, setStatusFilter] = useState<'All' | PatientStatus>('All');
  const [selectedPatient, setSelectedPatient] = useState<PatientRecord | null>(null);
  const [activeActionId, setActiveActionId] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);

  useEffect(() => {
    const handleOutside = () => setActiveActionId(null);
    window.addEventListener('click', handleOutside);
    return () => window.removeEventListener('click', handleOutside);
  }, []);

  // Add patient form state
  const [newName, setNewName] = useState('');
  const [newAge, setNewAge] = useState('30');
  const [newGender, setNewGender] = useState<'Male' | 'Female'>('Male');
  const [newBloodGroup, setNewBloodGroup] = useState('B+');
  const [newPhone, setNewPhone] = useState('+880 17');
  const [newCampus, setNewCampus] = useState<HospitalCampus>('Dhanmondi');
  const [newDepartment, setNewDepartment] = useState('Medicine');
  const [newConsultant, setNewConsultant] = useState('Dr. Mahmudul Hasan');
  const [newVisitType, setNewVisitType] = useState<PatientVisitType>('OPD');
  const [newStatus, setNewStatus] = useState<PatientStatus>('Active OPD');

  const stats = useMemo(() => {
    return {
      total: patients.length,
      activeOpd: patients.filter((p) => p.status === 'Active OPD').length,
      admitted: patients.filter((p) => p.status === 'Admitted').length,
      underReview: patients.filter((p) => p.status === 'Under Review').length,
    };
  }, [patients]);

  const filteredPatients = useMemo(() => {
    return patients.filter((p) => {
      const matchCampus = campusFilter === 'All' || p.campus === campusFilter;
      const matchStatus = statusFilter === 'All' || p.status === statusFilter;
      return matchCampus && matchStatus;
    });
  }, [patients, campusFilter, statusFilter]);

  const handleRegisterPatient = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newPhone.trim()) return;

    const nextSeq = 1001 + patients.length;
    const today = new Date().toISOString().slice(0, 10);
    const created: PatientRecord = {
      id: `pat-${Date.now()}`,
      uhid: `UHID-2026-${nextSeq}`,
      name: newName.trim(),
      age: Math.max(1, Number(newAge) || 30),
      gender: newGender,
      bloodGroup: newBloodGroup,
      phone: newPhone.trim(),
      campus: newCampus,
      department: newDepartment.trim() || 'Medicine',
      consultant: newConsultant.trim() || 'Dr. Mahmudul Hasan',
      visitType: newVisitType,
      lastVisit: today,
      status: newStatus,
      wardOrRoom: newVisitType === 'IPD' ? 'General Ward 02' : 'OPD Front Desk',
    };

    setPatients((prev) => [created, ...prev]);
    setSelectedPatient(created);
    setShowAddForm(false);
    setNewName('');
    setNewAge('30');
    setNewPhone('+880 17');
  };

  const handleStatusChange = (patientId: string, nextStatus: PatientStatus) => {
    setPatients((prev) =>
      prev.map((item) => (item.id === patientId ? { ...item, status: nextStatus } : item))
    );
    setSelectedPatient((prev) =>
      prev && prev.id === patientId ? { ...prev, status: nextStatus } : prev
    );
  };

  const columns: DataTableColumn<PatientRecord>[] = [
    { key: 'uhid', header: 'Patient ID', sortable: true, sortValue: (r) => r.uhid, render: (r) => r.uhid },
    { key: 'name', header: 'Patient Name', sortable: true, sortValue: (r) => r.name, render: (r) => r.name },
    { key: 'age', header: 'Age', align: 'center', sortable: true, sortValue: (r) => r.age, render: (r) => r.age },
    { key: 'gender', header: 'Gender', sortable: true, sortValue: (r) => r.gender, render: (r) => r.gender },
    { key: 'bloodGroup', header: 'Blood Group', align: 'center', render: (r) => r.bloodGroup },
    { key: 'phone', header: 'Mobile No', render: (r) => r.phone },
    { key: 'department', header: 'Department', sortable: true, sortValue: (r) => r.department, render: (r) => r.department },
    { key: 'consultant', header: 'Consultant', sortable: true, sortValue: (r) => r.consultant, render: (r) => r.consultant },
    { key: 'visitType', header: 'Patient Type', sortable: true, sortValue: (r) => r.visitType, render: (r) => r.visitType },
    { key: 'campus', header: 'Branch', sortable: true, sortValue: (r) => r.campus, render: (r) => r.campus },
    { key: 'wardOrRoom', header: 'Ward / Room', render: (r) => r.wardOrRoom ?? '-' },
    { key: 'lastVisit', header: 'Visit Date', sortable: true, sortValue: (r) => r.lastVisit, render: (r) => r.lastVisit },
    { key: 'status', header: 'Status', sortable: true, sortValue: (r) => r.status, render: (r) => r.status },
    {
      key: 'actions',
      header: 'Action',
      align: 'center',
      render: (r) => (
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
            <MoreVertical className="w-3 h-3" />
          </button>

          {activeActionId === r.id && (
            <div
              className="absolute right-0 mt-1 w-32 bg-white border border-slate-200 rounded-[3px] shadow-lg py-1 z-30 text-left"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                onClick={() => {
                  setSelectedPatient(r);
                  setActiveActionId(null);
                }}
                className="w-full text-left px-2.5 py-1.5 text-[11.5px] text-slate-700 hover:bg-[#edf6f2] hover:text-[#006a4e] font-medium flex items-center gap-2 cursor-pointer"
              >
                <Eye className="w-3 h-3" />
                View Details
              </button>
              <button
                type="button"
                onClick={() => {
                  const next: PatientStatus = r.status === 'Active OPD' ? 'Admitted' : 'Active OPD';
                  handleStatusChange(r.id, next);
                  setActiveActionId(null);
                }}
                className="w-full text-left px-2.5 py-1.5 text-[11.5px] text-slate-700 hover:bg-slate-50 font-medium flex items-center gap-2 cursor-pointer"
              >
                <FileText className="w-3 h-3" />
                Toggle Status
              </button>
            </div>
          )}
        </div>
      ),
    },
  ];

  const toolbarFilters = (
    <>
      <div className="relative">
        <select
          aria-label="Filter by campus"
          value={campusFilter}
          onChange={(e) => setCampusFilter(e.target.value as 'All' | HospitalCampus)}
          className="h-8 pl-2.5 pr-7 rounded-[3px] border border-slate-200 bg-white text-xs font-medium text-slate-700 appearance-none focus:outline-none focus:border-[#006a4e] cursor-pointer"
        >
          <option value="All">All Branches</option>
          {CAMPUSES.map((campus) => (
            <option key={campus} value={campus}>
              {campus}
            </option>
          ))}
        </select>
        <ChevronDown className="w-3.5 h-3.5 text-slate-400 pointer-events-none absolute right-2 top-1/2 -translate-y-1/2" />
      </div>

      <div className="relative">
        <select
          aria-label="Filter by status"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as 'All' | PatientStatus)}
          className="h-8 pl-2.5 pr-7 rounded-[3px] border border-slate-200 bg-white text-xs font-medium text-slate-700 appearance-none focus:outline-none focus:border-[#006a4e] cursor-pointer"
        >
          <option value="All">All Statuses</option>
          {STATUS_OPTIONS.map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>
        <ChevronDown className="w-3.5 h-3.5 text-slate-400 pointer-events-none absolute right-2 top-1/2 -translate-y-1/2" />
      </div>
    </>
  );

  return (
    <div className="space-y-2">
      {/* 4 Summary Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
        <div className="bg-white border border-slate-300 rounded-[3px] p-2.5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[10.5px] font-bold text-slate-700">Total Patients</span>
            <Users className="w-3.5 h-3.5 text-[#006a4e]" />
          </div>
          <div className="my-1">
            <span className="text-base font-extrabold text-slate-900 leading-none">{stats.total}</span>
          </div>
          <p className="text-[10px] text-slate-500">Across Dhanmondi, Uttara & Mirpur</p>
        </div>

        <div className="bg-white border border-slate-300 rounded-[3px] p-2.5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[10.5px] font-bold text-slate-700">Active OPD</span>
            <Activity className="w-3.5 h-3.5 text-[#006a4e]" />
          </div>
          <div className="my-1">
            <span className="text-base font-extrabold text-slate-900 leading-none">{stats.activeOpd}</span>
          </div>
          <p className="text-[10px] text-slate-500">Outpatient queue today</p>
        </div>

        <div className="bg-white border border-slate-300 rounded-[3px] p-2.5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[10.5px] font-bold text-slate-700">Admitted (IPD)</span>
            <Bed className="w-3.5 h-3.5 text-[#0094b6]" />
          </div>
          <div className="my-1">
            <span className="text-base font-extrabold text-slate-900 leading-none">{stats.admitted}</span>
          </div>
          <p className="text-[10px] text-slate-500">Current ward & cabin occupancy</p>
        </div>

        <div className="bg-white border border-slate-300 rounded-[3px] p-2.5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[10.5px] font-bold text-slate-700">Under Review</span>
            <Clock className="w-3.5 h-3.5 text-amber-600" />
          </div>
          <div className="my-1">
            <span className="text-base font-extrabold text-slate-900 leading-none">{stats.underReview}</span>
          </div>
          <p className="text-[10px] text-slate-500">Pending diagnostic evaluation</p>
        </div>
      </div>

      {/* Inline Register New Patient Form */}
      {showAddForm && (
        <form
          onSubmit={handleRegisterPatient}
          className="bg-white border border-slate-200/90 rounded-md p-4 space-y-3.5"
        >
          <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
            <div className="flex items-center gap-2">
              <span className="w-7 h-7 rounded-[3px] bg-[#edf6f2] text-[#006a4e] flex items-center justify-center">
                <UserCheck className="w-4 h-4" />
              </span>
              <div>
                <h3 className="text-sm font-semibold text-slate-900">Register New Patient</h3>
                <p className="text-[11px] text-slate-500">
                  Assigns a new UHID and adds the record directly to the patient registry
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="w-7 h-7 rounded-[3px] text-slate-400 hover:text-slate-600 hover:bg-slate-100 flex items-center justify-center cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
            <div className="lg:col-span-2">
              <label className="block text-[11px] font-medium text-slate-600 mb-1">
                Patient Full Name
              </label>
              <input
                type="text"
                required
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="e.g. Tanvir Ahmed"
                className="w-full h-9 px-2.5 rounded-[3px] border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-[#006a4e]"
              />
            </div>

            <div>
              <label className="block text-[11px] font-medium text-slate-600 mb-1">Age</label>
              <input
                type="number"
                min={1}
                max={120}
                required
                value={newAge}
                onChange={(e) => setNewAge(e.target.value)}
                className="w-full h-9 px-2.5 rounded-[3px] border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-[#006a4e]"
              />
            </div>

            <div>
              <label className="block text-[11px] font-medium text-slate-600 mb-1">Gender</label>
              <div className="relative">
                <select
                  value={newGender}
                  onChange={(e) => setNewGender(e.target.value as 'Male' | 'Female')}
                  className="w-full h-9 pl-2.5 pr-7 rounded-[3px] border border-slate-200 bg-white text-xs text-slate-800 appearance-none focus:outline-none focus:border-[#006a4e]"
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 pointer-events-none absolute right-2 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-medium text-slate-600 mb-1">
                Blood Group
              </label>
              <div className="relative">
                <select
                  value={newBloodGroup}
                  onChange={(e) => setNewBloodGroup(e.target.value)}
                  className="w-full h-9 pl-2.5 pr-7 rounded-[3px] border border-slate-200 bg-white text-xs text-slate-800 appearance-none focus:outline-none focus:border-[#006a4e]"
                >
                  {BLOOD_GROUPS.map((bg) => (
                    <option key={bg} value={bg}>
                      {bg}
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 pointer-events-none absolute right-2 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-medium text-slate-600 mb-1">
                Phone Number
              </label>
              <input
                type="text"
                required
                value={newPhone}
                onChange={(e) => setNewPhone(e.target.value)}
                placeholder="+880 17XX-XXXXXX"
                className="w-full h-9 px-2.5 rounded-[3px] border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-[#006a4e]"
              />
            </div>

            <div>
              <label className="block text-[11px] font-medium text-slate-600 mb-1">Campus</label>
              <div className="relative">
                <select
                  value={newCampus}
                  onChange={(e) => setNewCampus(e.target.value as HospitalCampus)}
                  className="w-full h-9 pl-2.5 pr-7 rounded-[3px] border border-slate-200 bg-white text-xs text-slate-800 appearance-none focus:outline-none focus:border-[#006a4e]"
                >
                  {CAMPUSES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 pointer-events-none absolute right-2 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-medium text-slate-600 mb-1">
                Department
              </label>
              <input
                type="text"
                value={newDepartment}
                onChange={(e) => setNewDepartment(e.target.value)}
                className="w-full h-9 px-2.5 rounded-[3px] border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-[#006a4e]"
              />
            </div>

            <div>
              <label className="block text-[11px] font-medium text-slate-600 mb-1">
                Consultant Doctor
              </label>
              <input
                type="text"
                value={newConsultant}
                onChange={(e) => setNewConsultant(e.target.value)}
                className="w-full h-9 px-2.5 rounded-[3px] border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-[#006a4e]"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-[11px] font-medium text-slate-600 mb-1">
                  Visit Type
                </label>
                <div className="relative">
                  <select
                    value={newVisitType}
                    onChange={(e) => setNewVisitType(e.target.value as PatientVisitType)}
                    className="w-full h-9 pl-2 pr-6 rounded-[3px] border border-slate-200 bg-white text-xs text-slate-800 appearance-none focus:outline-none focus:border-[#006a4e]"
                  >
                    <option value="OPD">OPD</option>
                    <option value="IPD">IPD</option>
                    <option value="Emergency">Emergency</option>
                  </select>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400 pointer-events-none absolute right-1.5 top-1/2 -translate-y-1/2" />
                </div>
              </div>
              <div>
                <label className="block text-[11px] font-medium text-slate-600 mb-1">Status</label>
                <div className="relative">
                  <select
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value as PatientStatus)}
                    className="w-full h-9 pl-2 pr-6 rounded-[3px] border border-slate-200 bg-white text-xs text-slate-800 appearance-none focus:outline-none focus:border-[#006a4e]"
                  >
                    {STATUS_OPTIONS.map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400 pointer-events-none absolute right-1.5 top-1/2 -translate-y-1/2" />
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-1">
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="h-9 px-3 rounded-[3px] border border-slate-200 text-xs font-medium text-slate-600 hover:bg-slate-50 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="h-9 px-4 rounded-[3px] bg-[#006a4e] hover:bg-[#00553e] text-white text-xs font-semibold cursor-pointer transition-colors"
            >
              Save Patient Record
            </button>
          </div>
        </form>
      )}

      {/* Selected Patient Quick View Card */}
      {selectedPatient && (
        <div className="bg-white border border-[#006a4e]/25 rounded-md p-4">
          <div className="flex flex-wrap items-start justify-between gap-3 border-b border-slate-100 pb-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-[3px] bg-[#edf6f2] text-[#006a4e] font-bold text-sm flex items-center justify-center">
                {selectedPatient.name
                  .split(' ')
                  .slice(0, 2)
                  .map((w) => w[0])
                  .join('')}
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="text-sm font-semibold text-slate-900">{selectedPatient.name}</h3>
                  <span className="px-2 py-0.5 rounded-[3px] bg-slate-100 text-slate-700 text-[11px] font-medium">
                    {selectedPatient.uhid}
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded-[3px] border text-[11px] font-semibold ${STATUS_BADGE_MAP[selectedPatient.status]
                      }`}
                  >
                    {selectedPatient.status}
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  {selectedPatient.age} yrs · {selectedPatient.gender} · Last visited on{' '}
                  {selectedPatient.lastVisit}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="relative">
                <select
                  aria-label="Update patient status"
                  value={selectedPatient.status}
                  onChange={(e) =>
                    handleStatusChange(selectedPatient.id, e.target.value as PatientStatus)
                  }
                  className="h-8 pl-2.5 pr-7 rounded-[3px] border border-slate-200 bg-white text-xs font-medium text-slate-700 appearance-none focus:outline-none focus:border-[#006a4e] cursor-pointer"
                >
                  {STATUS_OPTIONS.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 pointer-events-none absolute right-2 top-1/2 -translate-y-1/2" />
              </div>

              <button
                type="button"
                onClick={() => setSelectedPatient(null)}
                className="w-8 h-8 rounded-[3px] border border-slate-200 text-slate-500 hover:text-slate-800 hover:bg-slate-50 flex items-center justify-center cursor-pointer"
                aria-label="Close patient quick view"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 text-xs">
            <div className="flex items-center gap-2">
              <Phone className="w-3.5 h-3.5 text-[#006a4e] shrink-0" />
              <div>
                <p className="text-[11px] text-slate-400">Contact</p>
                <p className="font-medium text-slate-800">{selectedPatient.phone}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Droplets className="w-3.5 h-3.5 text-rose-500 shrink-0" />
              <div>
                <p className="text-[11px] text-slate-400">Blood Group</p>
                <p className="font-medium text-slate-800">{selectedPatient.bloodGroup}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Building2 className="w-3.5 h-3.5 text-[#0094b6] shrink-0" />
              <div>
                <p className="text-[11px] text-slate-400">Campus & Location</p>
                <p className="font-medium text-slate-800">
                  {selectedPatient.campus} · {selectedPatient.wardOrRoom || 'General Desk'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Stethoscope className="w-3.5 h-3.5 text-[#006a4e] shrink-0" />
              <div>
                <p className="text-[11px] text-slate-400">Consultant</p>
                <p className="font-medium text-slate-800">
                  {selectedPatient.consultant} ({selectedPatient.department})
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CarrierDirect-Style Reusable DataTable */}
      <DataTable<PatientRecord>
        data={filteredPatients}
        columns={columns}
        rowKey={(row) => row.id}
        searchable
        searchPlaceholder="Search by UHID, patient name, phone, or consultant..."
        searchFilter={(row, query) =>
          row.name.toLowerCase().includes(query) ||
          row.uhid.toLowerCase().includes(query) ||
          row.phone.toLowerCase().includes(query) ||
          row.consultant.toLowerCase().includes(query) ||
          row.department.toLowerCase().includes(query)
        }
        toolbarFilters={toolbarFilters}
        headerActions={
          <button
            type="button"
            onClick={() => setShowAddForm((prev) => !prev)}
            className="h-8 px-3 rounded-[3px] bg-[#006a4e] hover:bg-[#00553e] text-white text-xs font-semibold inline-flex items-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap"
          >
            <Plus className="w-3.5 h-3.5" />
            Register Patient
          </button>
        }
        defaultPageSize={30}
        pageSizeOptions={[15, 30, 50, 100]}
        emptyTitle="No matching patients found"
        emptyDescription="Try clearing the search query, campus filter, or status filter."
        onRowClick={(row) => setSelectedPatient(row)}
      />
    </div>
  );
};
