import {
  Baby,
  ChevronDown,
  Eye,
  FileHeart,
  FileText,
  HeartCrack,
  MoreVertical,
  Plus,
  Printer,
  ShieldAlert,
  ShieldCheck,
  Stethoscope,
  Trash2,
  Users,
  X,
} from 'lucide-react';
import React, { useEffect, useMemo, useState } from 'react';
import {
  BirthRecord,
  DeathRecord,
  Gender,
  SMART_BIRTH_RECORDS,
  SMART_DEATH_RECORDS,
} from '../../../data/superadminBirthDeathData';
import { DataTable, DataTableColumn } from '../../common/DataTable';

type BirthDeathTab = 'birth' | 'death';

interface BirthDeathDirectoryProps {
  initialSubTab?: 'birth-death' | 'birth-record' | 'death-record' | string;
}

export const BirthDeathDirectory: React.FC<BirthDeathDirectoryProps> = ({
  initialSubTab,
}) => {
  const initialTab: BirthDeathTab = initialSubTab === 'death-record' ? 'death' : 'birth';
  const [activeTab, setActiveTab] = useState<BirthDeathTab>(initialTab);

  const [birthRecords, setBirthRecords] = useState<BirthRecord[]>(SMART_BIRTH_RECORDS);
  const [deathRecords, setDeathRecords] = useState<DeathRecord[]>(SMART_DEATH_RECORDS);

  const [deliveryFilter, setDeliveryFilter] = useState<string>('All');
  const [genderFilter, setGenderFilter] = useState<string>('All');

  const [selectedBirth, setSelectedBirth] = useState<BirthRecord | null>(null);
  const [selectedDeath, setSelectedDeath] = useState<DeathRecord | null>(null);
  const [activeActionId, setActiveActionId] = useState<string | null>(null);

  // Modals state
  const [showAddBirthModal, setShowAddBirthModal] = useState(false);
  const [showAddDeathModal, setShowAddDeathModal] = useState(false);
  const [showBirthCertModal, setShowBirthCertModal] = useState(false);
  const [showDeathCertModal, setShowDeathCertModal] = useState(false);

  const [activeBirthCert, setActiveBirthCert] = useState<BirthRecord | null>(null);
  const [activeDeathCert, setActiveDeathCert] = useState<DeathRecord | null>(null);

  // Add Birth Record Form State
  const [formChildName, setFormChildName] = useState('');
  const [formBirthGender, setFormBirthGender] = useState<Gender>('Male');
  const [formBirthDate, setFormBirthDate] = useState(new Date().toLocaleDateString('en-GB'));
  const [formBirthTime, setFormBirthTime] = useState('08:30 AM');
  const [formMotherName, setFormMotherName] = useState('');
  const [formMotherUhid, setFormMotherUhid] = useState('UHID-2026-');
  const [formFatherName, setFormFatherName] = useState('');
  const [formBirthWeight, setFormBirthWeight] = useState(3.2);
  const [formDeliveryType, setFormDeliveryType] = useState<
    'Normal Vaginal Delivery' | 'Cesarean Section (C-Section)' | 'Assisted Vacuum Delivery'
  >('Normal Vaginal Delivery');
  const [formBirthWard, setFormBirthWard] = useState('Labor Suite 01 · Maternity Ward');
  const [formBirthDoctor, setFormBirthDoctor] = useState('Dr. Farhana Yasmin (Obs/Gyn)');
  const [formBirthPhone, setFormBirthPhone] = useState('+880 171 ');
  const [formBirthAddress, setFormBirthAddress] = useState('Dhaka, Bangladesh');

  // Add Death Record Form State
  const [formDeathPatientName, setFormDeathPatientName] = useState('');
  const [formDeathUhid, setFormDeathUhid] = useState('UHID-2026-');
  const [formDeathAge, setFormDeathAge] = useState(65);
  const [formDeathGender, setFormDeathGender] = useState<Gender>('Male');
  const [formDeathDate, setFormDeathDate] = useState(new Date().toLocaleDateString('en-GB'));
  const [formDeathTime, setFormDeathTime] = useState('02:15 PM');
  const [formGuardianName, setFormGuardianName] = useState('');
  const [formGuardianRelation, setFormGuardianRelation] = useState('Son');
  const [formGuardianPhone, setFormGuardianPhone] = useState('+880 181 ');
  const [formDeathWard, setFormDeathWard] = useState('ICU Bed 02 · Critical Care Unit');
  const [formImmediateCause, setFormImmediateCause] = useState('Cardiopulmonary Arrest');
  const [formAntecedentCause, setFormAntecedentCause] = useState('Septic Shock');
  const [formUnderlyingCause, setFormUnderlyingCause] = useState('Multi-Organ Dysfunction');
  const [formDeathDoctor, setFormDeathDoctor] = useState('Dr. Mahmudul Hasan (Consultant)');
  const [formAutopsyRequired, setFormAutopsyRequired] = useState(false);

  useEffect(() => {
    if (initialSubTab === 'death-record') setActiveTab('death');
    else if (initialSubTab === 'birth-record' || initialSubTab === 'birth-death') setActiveTab('birth');
  }, [initialSubTab]);

  useEffect(() => {
    const handleOutside = () => setActiveActionId(null);
    window.addEventListener('click', handleOutside);
    return () => window.removeEventListener('click', handleOutside);
  }, []);

  // Filtered Birth Records
  const filteredBirths = useMemo(() => {
    return birthRecords.filter((b) => {
      const matchDelivery = deliveryFilter === 'All' || b.deliveryType === deliveryFilter;
      const matchGender = genderFilter === 'All' || b.gender === genderFilter;
      return matchDelivery && matchGender;
    });
  }, [birthRecords, deliveryFilter, genderFilter]);

  // Filtered Death Records
  const filteredDeaths = useMemo(() => {
    return deathRecords.filter((d) => {
      const matchGender = genderFilter === 'All' || d.gender === genderFilter;
      return matchGender;
    });
  }, [deathRecords, genderFilter]);

  // Telemetry KPIs
  const birthStats = useMemo(() => {
    const total = birthRecords.length;
    const male = birthRecords.filter((b) => b.gender === 'Male').length;
    const female = birthRecords.filter((b) => b.gender === 'Female').length;
    const normal = birthRecords.filter((b) => b.deliveryType === 'Normal Vaginal Delivery').length;
    const cSection = birthRecords.filter((b) => b.deliveryType === 'Cesarean Section (C-Section)').length;
    const issued = birthRecords.filter((b) => b.certificateStatus === 'Issued').length;

    return { total, male, female, normal, cSection, issued };
  }, [birthRecords]);

  const deathStats = useMemo(() => {
    const total = deathRecords.length;
    const icu = deathRecords.filter((d) => d.wardLocation.includes('ICU') || d.wardLocation.includes('CCU')).length;
    const autopsy = deathRecords.filter((d) => d.autopsyRequired).length;
    const issued = deathRecords.filter((d) => d.certificateStatus === 'Issued').length;

    return { total, icu, autopsy, issued };
  }, [deathRecords]);

  // Handlers for Birth Record
  const handleCreateBirth = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formChildName.trim() || !formMotherName.trim()) return;

    const newRec: BirthRecord = {
      id: `bth-${Date.now()}`,
      referenceNo: `BTH-2026-${1040 + birthRecords.length + 1}`,
      caseId: `${7490 + birthRecords.length + 1}`,
      childName: formChildName.trim(),
      gender: formBirthGender,
      birthDate: formBirthDate,
      birthTime: formBirthTime,
      motherName: formMotherName.trim(),
      motherUhid: formMotherUhid.trim(),
      fatherName: formFatherName.trim() || 'N/A',
      birthWeightKg: Number(formBirthWeight) || 3.0,
      deliveryType: formDeliveryType,
      wardLocation: formBirthWard,
      attendingDoctor: formBirthDoctor,
      contactPhone: formBirthPhone,
      permanentAddress: formBirthAddress,
      certificateStatus: 'Issued',
      certificateIssueDate: new Date().toLocaleDateString('en-GB'),
    };

    setBirthRecords([newRec, ...birthRecords]);
    setShowAddBirthModal(false);
    setFormChildName('');
    setFormMotherName('');
    setFormFatherName('');
  };

  // Handlers for Death Record
  const handleCreateDeath = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formDeathPatientName.trim()) return;

    const newRec: DeathRecord = {
      id: `dth-${Date.now()}`,
      referenceNo: `DTH-2026-${80 + deathRecords.length + 1}`,
      caseId: `${7430 + deathRecords.length + 1}`,
      patientName: formDeathPatientName.trim(),
      patientUhid: formDeathUhid.trim(),
      age: Number(formDeathAge) || 50,
      gender: formDeathGender,
      deathDate: formDeathDate,
      deathTime: formDeathTime,
      guardianName: formGuardianName.trim() || 'N/A',
      guardianRelation: formGuardianRelation,
      guardianContact: formGuardianPhone,
      wardLocation: formDeathWard,
      immediateCause: formImmediateCause.trim(),
      antecedentCause: formAntecedentCause.trim(),
      underlyingCause: formUnderlyingCause.trim(),
      attendingDoctor: formDeathDoctor,
      autopsyRequired: formAutopsyRequired,
      certificateStatus: formAutopsyRequired ? 'Under Legal Review' : 'Issued',
      certificateIssueDate: formAutopsyRequired ? '-' : new Date().toLocaleDateString('en-GB'),
    };

    setDeathRecords([newRec, ...deathRecords]);
    setShowAddDeathModal(false);
    setFormDeathPatientName('');
  };

  // Birth Record Columns
  const birthColumns: DataTableColumn<BirthRecord>[] = [
    {
      key: 'referenceNo',
      header: 'Reference No',
      sortable: true,
      sortValue: (r) => r.referenceNo,
      render: (r) => (
        <button
          type="button"
          onClick={() => {
            setSelectedBirth(r);
            setSelectedDeath(null);
          }}
          className="font-bold text-[#0094b6] hover:underline cursor-pointer text-left whitespace-nowrap"
        >
          {r.referenceNo}
        </button>
      ),
    },
    {
      key: 'caseId',
      header: 'Case ID',
      sortable: true,
      sortValue: (r) => r.caseId,
      render: (r) => <span className="font-semibold text-slate-800">{r.caseId}</span>,
    },
    {
      key: 'childName',
      header: 'Child Name',
      sortable: true,
      sortValue: (r) => r.childName,
      render: (r) => (
        <div>
          <span className="font-semibold text-slate-900 block leading-tight">{r.childName}</span>
          <span className="text-[10px] text-slate-500 font-medium">Weight: {r.birthWeightKg} kg</span>
        </div>
      ),
    },
    {
      key: 'gender',
      header: 'Gender',
      align: 'center',
      sortable: true,
      sortValue: (r) => r.gender,
      render: (r) => (
        <span
          className={`px-1.5 py-0.5 rounded-[3px] font-bold text-[10px] ${r.gender === 'Male'
            ? 'bg-sky-50 text-sky-700 border border-sky-200'
            : 'bg-rose-50 text-rose-700 border border-rose-200'
            }`}
        >
          {r.gender}
        </span>
      ),
    },
    {
      key: 'birthDate',
      header: 'Birth Date & Time',
      sortable: true,
      sortValue: (r) => r.birthDate,
      render: (r) => (
        <div>
          <span className="text-slate-800 font-medium block whitespace-nowrap">{r.birthDate}</span>
          <span className="text-[10px] text-slate-500">{r.birthTime}</span>
        </div>
      ),
    },
    {
      key: 'motherName',
      header: 'Mother Name',
      render: (r) => (
        <div>
          <span className="font-semibold text-slate-900 block leading-tight">{r.motherName}</span>
          <span className="text-[10px] text-slate-500 font-mono">{r.motherUhid}</span>
        </div>
      ),
    },
    {
      key: 'fatherName',
      header: 'Father Name',
      render: (r) => <span className="text-slate-700">{r.fatherName}</span>,
    },
    {
      key: 'deliveryType',
      header: 'Delivery Type',
      render: (r) => (
        <span className="px-1.5 py-0.5 rounded-[3px] bg-slate-100 text-slate-700 text-[10px] font-medium whitespace-nowrap">
          {r.deliveryType}
        </span>
      ),
    },
    {
      key: 'wardLocation',
      header: 'Ward / Suite',
      render: (r) => <span className="text-slate-600 truncate max-w-xs block">{r.wardLocation}</span>,
    },
    {
      key: 'attendingDoctor',
      header: 'Attending Doctor',
      render: (r) => <span className="text-slate-700 whitespace-nowrap">{r.attendingDoctor}</span>,
    },
    {
      key: 'certificateStatus',
      header: 'Certificate',
      align: 'center',
      render: (r) => (
        <span
          className={`px-1.5 py-0.5 rounded-[3px] font-bold text-[10px] ${r.certificateStatus === 'Issued'
            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
            : 'bg-amber-50 text-amber-700 border border-amber-200'
            }`}
        >
          {r.certificateStatus}
        </span>
      ),
    },
    {
      key: 'action',
      header: 'Action',
      align: 'center',
      render: (r) => {
        const isOpen = activeActionId === r.id;
        return (
          <div className="relative inline-block text-left" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              onClick={() => setActiveActionId(isOpen ? null : r.id)}
              className="w-6 h-6 rounded-[3px] border border-slate-300 hover:bg-slate-100 flex items-center justify-center text-slate-600 cursor-pointer"
              title="Actions"
            >
              <MoreVertical className="w-3.5 h-3.5" />
            </button>

            {isOpen && (
              <div className="absolute right-0 mt-1 w-44 rounded-md bg-white border border-slate-200 shadow-lg z-50 py-1 text-xs animate-in fade-in zoom-in-95 duration-100">
                <button
                  type="button"
                  onClick={() => {
                    setSelectedBirth(r);
                    setSelectedDeath(null);
                    setActiveActionId(null);
                  }}
                  className="w-full text-left px-3 py-1.5 text-slate-700 hover:bg-slate-50 font-medium flex items-center gap-2 cursor-pointer"
                >
                  <Eye className="w-3.5 h-3.5 text-slate-500" />
                  <span>View Details</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setActiveBirthCert(r);
                    setShowBirthCertModal(true);
                    setActiveActionId(null);
                  }}
                  className="w-full text-left px-3 py-1.5 text-emerald-700 hover:bg-emerald-50 font-medium flex items-center gap-2 cursor-pointer"
                >
                  <FileText className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Birth Certificate</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    window.print();
                    setActiveActionId(null);
                  }}
                  className="w-full text-left px-3 py-1.5 text-slate-700 hover:bg-slate-50 font-medium flex items-center gap-2 cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5 text-slate-500" />
                  <span>Print Record</span>
                </button>

                <div className="border-t border-slate-100 my-1" />

                <button
                  type="button"
                  onClick={() => {
                    setBirthRecords((prev) => prev.filter((b) => b.id !== r.id));
                    setActiveActionId(null);
                  }}
                  className="w-full text-left px-3 py-1.5 text-rose-600 hover:bg-rose-50 font-medium flex items-center gap-2 cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5 text-rose-500" />
                  <span>Delete Record</span>
                </button>
              </div>
            )}
          </div>
        );
      },
    },
  ];

  // Death Record Columns
  const deathColumns: DataTableColumn<DeathRecord>[] = [
    {
      key: 'referenceNo',
      header: 'Reference No',
      sortable: true,
      sortValue: (r) => r.referenceNo,
      render: (r) => (
        <button
          type="button"
          onClick={() => {
            setSelectedDeath(r);
            setSelectedBirth(null);
          }}
          className="font-bold text-[#0094b6] hover:underline cursor-pointer text-left whitespace-nowrap"
        >
          {r.referenceNo}
        </button>
      ),
    },
    {
      key: 'caseId',
      header: 'Case ID',
      sortable: true,
      sortValue: (r) => r.caseId,
      render: (r) => <span className="font-semibold text-slate-800">{r.caseId}</span>,
    },
    {
      key: 'patientName',
      header: 'Patient Name',
      sortable: true,
      sortValue: (r) => r.patientName,
      render: (r) => (
        <div>
          <span className="font-semibold text-slate-900 block leading-tight">{r.patientName}</span>
          <span className="text-[10px] text-slate-500 font-mono">
            {r.patientUhid} · {r.age}y/{r.gender}
          </span>
        </div>
      ),
    },
    {
      key: 'deathDate',
      header: 'Date & Time of Death',
      sortable: true,
      sortValue: (r) => r.deathDate,
      render: (r) => (
        <div>
          <span className="text-slate-800 font-medium block whitespace-nowrap">{r.deathDate}</span>
          <span className="text-[10px] text-slate-500">{r.deathTime}</span>
        </div>
      ),
    },
    {
      key: 'guardianName',
      header: 'Next of Kin / Relative',
      render: (r) => (
        <div>
          <span className="font-medium text-slate-900 block leading-tight">{r.guardianName}</span>
          <span className="text-[10px] text-slate-500">
            {r.guardianRelation} · {r.guardianContact}
          </span>
        </div>
      ),
    },
    {
      key: 'wardLocation',
      header: 'Location of Demise',
      render: (r) => <span className="text-slate-700 truncate max-w-xs block">{r.wardLocation}</span>,
    },
    {
      key: 'immediateCause',
      header: 'Immediate Cause of Death',
      render: (r) => (
        <div className="max-w-xs">
          <span className="font-semibold text-slate-900 block truncate" title={r.immediateCause}>
            {r.immediateCause}
          </span>
          <span className="text-[10px] text-slate-500 truncate block" title={r.underlyingCause}>
            Underlying: {r.underlyingCause}
          </span>
        </div>
      ),
    },
    {
      key: 'attendingDoctor',
      header: 'Certifying Physician',
      render: (r) => <span className="text-slate-700 whitespace-nowrap">{r.attendingDoctor}</span>,
    },
    {
      key: 'autopsyRequired',
      header: 'Autopsy / Post-Mortem',
      align: 'center',
      render: (r) => (
        <span
          className={`px-1.5 py-0.5 rounded-[3px] font-bold text-[10px] ${r.autopsyRequired
            ? 'bg-rose-50 text-rose-700 border border-rose-200'
            : 'bg-slate-100 text-slate-600'
            }`}
        >
          {r.autopsyRequired ? 'Required (Medico-Legal)' : 'Not Required'}
        </span>
      ),
    },
    {
      key: 'certificateStatus',
      header: 'MCCD Status',
      align: 'center',
      render: (r) => (
        <span
          className={`px-1.5 py-0.5 rounded-[3px] font-bold text-[10px] ${r.certificateStatus === 'Issued'
            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
            : 'bg-amber-50 text-amber-700 border border-amber-200'
            }`}
        >
          {r.certificateStatus}
        </span>
      ),
    },
    {
      key: 'action',
      header: 'Action',
      align: 'center',
      render: (r) => {
        const isOpen = activeActionId === r.id;
        return (
          <div className="relative inline-block text-left" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              onClick={() => setActiveActionId(isOpen ? null : r.id)}
              className="w-6 h-6 rounded-[3px] border border-slate-300 hover:bg-slate-100 flex items-center justify-center text-slate-600 cursor-pointer"
              title="Actions"
            >
              <MoreVertical className="w-3.5 h-3.5" />
            </button>

            {isOpen && (
              <div className="absolute right-0 mt-1 w-44 rounded-md bg-white border border-slate-200 shadow-lg z-50 py-1 text-xs animate-in fade-in zoom-in-95 duration-100">
                <button
                  type="button"
                  onClick={() => {
                    setSelectedDeath(r);
                    setSelectedBirth(null);
                    setActiveActionId(null);
                  }}
                  className="w-full text-left px-3 py-1.5 text-slate-700 hover:bg-slate-50 font-medium flex items-center gap-2 cursor-pointer"
                >
                  <Eye className="w-3.5 h-3.5 text-slate-500" />
                  <span>View Details</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setActiveDeathCert(r);
                    setShowDeathCertModal(true);
                    setActiveActionId(null);
                  }}
                  className="w-full text-left px-3 py-1.5 text-[#0094b6] hover:bg-teal-50 font-medium flex items-center gap-2 cursor-pointer"
                >
                  <FileText className="w-3.5 h-3.5 text-[#0094b6]" />
                  <span>Death Certificate</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    window.print();
                    setActiveActionId(null);
                  }}
                  className="w-full text-left px-3 py-1.5 text-slate-700 hover:bg-slate-50 font-medium flex items-center gap-2 cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5 text-slate-500" />
                  <span>Print Record</span>
                </button>

                <div className="border-t border-slate-100 my-1" />

                <button
                  type="button"
                  onClick={() => {
                    setDeathRecords((prev) => prev.filter((d) => d.id !== r.id));
                    setActiveActionId(null);
                  }}
                  className="w-full text-left px-3 py-1.5 text-rose-600 hover:bg-rose-50 font-medium flex items-center gap-2 cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5 text-rose-500" />
                  <span>Delete Record</span>
                </button>
              </div>
            )}
          </div>
        );
      },
    },
  ];

  // Toolbar Filters
  const toolbarFilters = (
    <div className="flex items-center gap-2">
      <div className="relative">
        <select
          aria-label="Filter by register section"
          value={activeTab}
          onChange={(e) => {
            const next = e.target.value as BirthDeathTab;
            setActiveTab(next);
            setSelectedBirth(null);
            setSelectedDeath(null);
          }}
          className="h-8 pl-2.5 pr-7 rounded-[3px] border border-slate-200 bg-white text-xs font-medium text-slate-700 appearance-none focus:outline-hidden focus:border-[#0094b6] cursor-pointer"
        >
          <option value="birth">Birth Record Registry</option>
          <option value="death">Death Record Registry</option>
        </select>
        <ChevronDown className="w-3.5 h-3.5 text-slate-400 pointer-events-none absolute right-2 top-1/2 -translate-y-1/2" />
      </div>

      <div className="relative">
        <select
          aria-label="Filter by Gender"
          value={genderFilter}
          onChange={(e) => setGenderFilter(e.target.value)}
          className="h-8 pl-2.5 pr-7 rounded-[3px] border border-slate-200 bg-white text-xs font-medium text-slate-700 appearance-none focus:outline-hidden focus:border-[#0094b6] cursor-pointer"
        >
          <option value="All">All Genders</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
        </select>
        <ChevronDown className="w-3.5 h-3.5 text-slate-400 pointer-events-none absolute right-2 top-1/2 -translate-y-1/2" />
      </div>

      {activeTab === 'birth' && (
        <div className="relative">
          <select
            aria-label="Filter by delivery type"
            value={deliveryFilter}
            onChange={(e) => setDeliveryFilter(e.target.value)}
            className="h-8 pl-2.5 pr-7 rounded-[3px] border border-slate-200 bg-white text-xs font-medium text-slate-700 appearance-none focus:outline-hidden focus:border-[#0094b6] cursor-pointer"
          >
            <option value="All">All Delivery Types</option>
            <option value="Normal Vaginal Delivery">Normal Vaginal Delivery</option>
            <option value="Cesarean Section (C-Section)">Cesarean Section (C-Section)</option>
            <option value="Assisted Vacuum Delivery">Assisted Vacuum Delivery</option>
          </select>
          <ChevronDown className="w-3.5 h-3.5 text-slate-400 pointer-events-none absolute right-2 top-1/2 -translate-y-1/2" />
        </div>
      )}
    </div>
  );

  // Toolbar Actions
  const toolbarActions = (
    <div className="flex items-center gap-1.5">
      {activeTab === 'birth' ? (
        <button
          type="button"
          onClick={() => setShowAddBirthModal(true)}
          className="h-8 px-3 rounded-[3px] bg-[#0094b6] hover:bg-[#007f9c] text-white text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Birth Record</span>
        </button>
      ) : (
        <button
          type="button"
          onClick={() => setShowAddDeathModal(true)}
          className="h-8 px-3 rounded-[3px] bg-[#006a4e] hover:bg-[#00523c] text-white text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Death Record</span>
        </button>
      )}

      <button
        type="button"
        onClick={() => window.print()}
        className="h-8 px-2.5 rounded-[3px] border border-slate-200 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-700 flex items-center gap-1.5 cursor-pointer"
      >
        <Printer className="w-3.5 h-3.5 text-slate-500" />
        <span>Print Register</span>
      </button>
    </div>
  );

  return (
    <div className="space-y-2 min-w-0 w-full overflow-hidden">
      {/* Sub-tabs Switcher */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 pb-2">
        <div className="flex flex-wrap items-center gap-1.5">
          <button
            type="button"
            onClick={() => {
              setActiveTab('birth');
              setSelectedDeath(null);
            }}
            className={`px-3 py-1.5 rounded-[3px] text-xs font-semibold transition-colors cursor-pointer flex items-center gap-1.5 ${activeTab === 'birth'
              ? 'bg-[#0094b6] text-white shadow-xs'
              : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
              }`}
          >
            <Baby className="w-3.5 h-3.5" />
            <span>Birth Record Registry</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveTab('death');
              setSelectedBirth(null);
            }}
            className={`px-3 py-1.5 rounded-[3px] text-xs font-semibold transition-colors cursor-pointer flex items-center gap-1.5 ${activeTab === 'death'
              ? 'bg-[#0094b6] text-white shadow-xs'
              : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
              }`}
          >
            <HeartCrack className="w-3.5 h-3.5" />
            <span>Death Record Registry</span>
          </button>
        </div>
      </div>

      {/* 4 Summary Metric Cards */}
      {activeTab === 'birth' ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
          <div className="bg-white rounded-[3px] p-2.5 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-[10.5px] font-bold text-slate-700">Total Registered Births</span>
              <Baby className="w-3.5 h-3.5 text-[#0094b6]" />
            </div>
            <div className="my-1">
              <span className="text-base font-extrabold text-slate-900 leading-none">
                {birthStats.total} Newborns
              </span>
            </div>
            <p className="text-[10px] text-slate-500">Live births registered across all campuses</p>
          </div>

          <div className="bg-white rounded-[3px] p-2.5 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-[10.5px] font-bold text-slate-700">Gender Ratio</span>
              <Users className="w-3.5 h-3.5 text-sky-600" />
            </div>
            <div className="my-1">
              <span className="text-base font-extrabold text-sky-700 leading-none">
                {birthStats.male} Male · {birthStats.female} Female
              </span>
            </div>
            <p className="text-[10px] text-slate-500">Balanced neonate distribution</p>
          </div>

          <div className="bg-white rounded-[3px] p-2.5 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-[10.5px] font-bold text-slate-700">Delivery Modality</span>
              <Stethoscope className="w-3.5 h-3.5 text-emerald-600" />
            </div>
            <div className="my-1">
              <span className="text-base font-extrabold text-emerald-700 leading-none">
                {birthStats.normal} Normal · {birthStats.cSection} C-Section
              </span>
            </div>
            <p className="text-[10px] text-slate-500">Labor suites &amp; maternity operating suites</p>
          </div>

          <div className="bg-white rounded-[3px] p-2.5 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-[10.5px] font-bold text-slate-700">Birth Certificates</span>
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            </div>
            <div className="my-1">
              <span className="text-base font-extrabold text-emerald-700 leading-none">
                {birthStats.issued} Issued
              </span>
            </div>
            <p className="text-[10px] text-slate-500">Official live birth certificates issued</p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
          <div className="bg-white rounded-[3px] p-2.5 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-[10.5px] font-bold text-slate-700">Total Mortalities Logged</span>
              <HeartCrack className="w-3.5 h-3.5 text-rose-600" />
            </div>
            <div className="my-1">
              <span className="text-base font-extrabold text-slate-900 leading-none">
                {deathStats.total} Records
              </span>
            </div>
            <p className="text-[10px] text-slate-500">Clinical inpatient mortalities recorded</p>
          </div>

          <div className="bg-white rounded-[3px] p-2.5 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-[10.5px] font-bold text-slate-700">Critical Care Demise</span>
              <ShieldAlert className="w-3.5 h-3.5 text-amber-600" />
            </div>
            <div className="my-1">
              <span className="text-base font-extrabold text-amber-700 leading-none">
                {deathStats.icu} ICU / CCU
              </span>
            </div>
            <p className="text-[10px] text-slate-500">Advanced multi-organ failure &amp; cardiopulmonary arrest</p>
          </div>

          <div className="bg-white rounded-[3px] p-2.5 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-[10.5px] font-bold text-slate-700">Medico-Legal / Autopsy</span>
              <FileHeart className="w-3.5 h-3.5 text-purple-600" />
            </div>
            <div className="my-1">
              <span className="text-base font-extrabold text-purple-700 leading-none">
                {deathStats.autopsy} Cases
              </span>
            </div>
            <p className="text-[10px] text-slate-500">Police investigation or forensic protocols</p>
          </div>

          <div className="bg-white rounded-[3px] p-2.5 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-[10.5px] font-bold text-slate-700">MCCD Certificates Issued</span>
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            </div>
            <div className="my-1">
              <span className="text-base font-extrabold text-emerald-700 leading-none">
                {deathStats.issued} Issued
              </span>
            </div>
            <p className="text-[10px] text-slate-500">Official medical cause of death certificates</p>
          </div>
        </div>
      )}

      {/* Selected Birth Quick View Card */}
      {selectedBirth && activeTab === 'birth' && (
        <div className="bg-white border border-[#0094b6]/30 rounded-md p-3.5 space-y-3">
          <div className="flex flex-wrap items-start justify-between gap-3 border-b border-slate-100 pb-2.5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-[3px] bg-[#f0f8fa] text-[#0094b6] flex items-center justify-center font-bold">
                <Baby className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="text-sm font-semibold text-slate-900">{selectedBirth.childName}</h3>
                  <span className="px-2 py-0.5 rounded-[3px] bg-slate-100 text-slate-700 text-[11px] font-medium">
                    {selectedBirth.referenceNo}
                  </span>
                  <span className="px-2 py-0.5 rounded-[3px] bg-emerald-50 text-emerald-700 border border-emerald-200 text-[11px] font-semibold">
                    Case #{selectedBirth.caseId}
                  </span>
                  <span className="px-2 py-0.5 rounded-[3px] bg-sky-50 text-sky-700 border border-sky-200 text-[11px] font-semibold">
                    {selectedBirth.gender} · {selectedBirth.birthWeightKg} kg
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  Mother: <strong className="text-slate-800">{selectedBirth.motherName} ({selectedBirth.motherUhid})</strong> · Father: {selectedBirth.fatherName}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => {
                  setActiveBirthCert(selectedBirth);
                  setShowBirthCertModal(true);
                }}
                className="h-8 px-3 rounded-[3px] bg-[#0094b6] hover:bg-[#007f9c] text-white text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Birth Certificate</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedBirth(null)}
                className="w-8 h-8 rounded-[3px] border border-slate-200 text-slate-500 hover:text-slate-800 hover:bg-slate-50 flex items-center justify-center cursor-pointer"
                aria-label="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div>
              <p className="text-[11px] text-slate-400">Date &amp; Time of Birth</p>
              <p className="font-semibold text-slate-800">
                {selectedBirth.birthDate} at {selectedBirth.birthTime}
              </p>
            </div>
            <div>
              <p className="text-[11px] text-slate-400">Delivery Modality</p>
              <p className="font-bold text-slate-900">{selectedBirth.deliveryType}</p>
            </div>
            <div>
              <p className="text-[11px] text-slate-400">Attending Consultant</p>
              <p className="font-medium text-slate-800">{selectedBirth.attendingDoctor}</p>
            </div>
            <div>
              <p className="text-[11px] text-slate-400">Ward Location</p>
              <p className="font-medium text-slate-800">{selectedBirth.wardLocation}</p>
            </div>
          </div>
        </div>
      )}

      {/* Selected Death Quick View Card */}
      {selectedDeath && activeTab === 'death' && (
        <div className="bg-white border border-[#0094b6]/30 rounded-md p-3.5 space-y-3">
          <div className="flex flex-wrap items-start justify-between gap-3 border-b border-slate-100 pb-2.5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-[3px] bg-rose-50 text-rose-600 flex items-center justify-center font-bold">
                <HeartCrack className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="text-sm font-semibold text-slate-900">{selectedDeath.patientName}</h3>
                  <span className="px-2 py-0.5 rounded-[3px] bg-slate-100 text-slate-700 text-[11px] font-mono font-medium">
                    {selectedDeath.patientUhid}
                  </span>
                  <span className="px-2 py-0.5 rounded-[3px] bg-rose-50 text-rose-700 border border-rose-200 text-[11px] font-semibold">
                    {selectedDeath.referenceNo}
                  </span>
                  <span className="px-2 py-0.5 rounded-[3px] bg-slate-100 text-slate-700 text-[11px] font-semibold">
                    Age: {selectedDeath.age}y/{selectedDeath.gender}
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  Demise Date: <strong className="text-slate-800">{selectedDeath.deathDate} ({selectedDeath.deathTime})</strong> · Location: {selectedDeath.wardLocation}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => {
                  setActiveDeathCert(selectedDeath);
                  setShowDeathCertModal(true);
                }}
                className="h-8 px-3 rounded-[3px] bg-[#006a4e] hover:bg-[#00523c] text-white text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Death Certificate (MCCD)</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedDeath(null)}
                className="w-8 h-8 rounded-[3px] border border-slate-200 text-slate-500 hover:text-slate-800 hover:bg-slate-50 flex items-center justify-center cursor-pointer"
                aria-label="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-[3px] p-2.5 text-xs space-y-1.5">
            <div>
              <span className="text-[11px] text-slate-500">Immediate Cause of Death:</span>
              <p className="font-bold text-slate-900">{selectedDeath.immediateCause}</p>
            </div>
            <div>
              <span className="text-[11px] text-slate-500">Antecedent / Intermediate Cause:</span>
              <p className="font-medium text-slate-800">{selectedDeath.antecedentCause}</p>
            </div>
            <div>
              <span className="text-[11px] text-slate-500">Underlying Cause:</span>
              <p className="text-slate-700">{selectedDeath.underlyingCause}</p>
            </div>
          </div>
        </div>
      )}

      {/* Main DataTable View */}
      {activeTab === 'birth' ? (
        <DataTable<BirthRecord>
          title="Birth Record"
          data={filteredBirths}
          columns={birthColumns}
          rowKey={(r) => r.id}
          searchable
          searchPlaceholder="Search by reference no, child name, mother name, or case id..."
          searchFilter={(r, q) =>
            r.referenceNo.toLowerCase().includes(q) ||
            r.childName.toLowerCase().includes(q) ||
            r.motherName.toLowerCase().includes(q) ||
            r.fatherName.toLowerCase().includes(q) ||
            r.caseId.toLowerCase().includes(q)
          }
          toolbarFilters={toolbarFilters}
          toolbarActions={toolbarActions}
          defaultPageSize={10}
          pageSizeOptions={[10, 25, 50, 100]}
          emptyTitle="No birth records found"
          emptyDescription="There are no birth registration records matching your filter criteria."
        />
      ) : (
        <DataTable<DeathRecord>
          title="Death Record"
          data={filteredDeaths}
          columns={deathColumns}
          rowKey={(r) => r.id}
          searchable
          searchPlaceholder="Search by reference no, patient name, case id, or cause..."
          searchFilter={(r, q) =>
            r.referenceNo.toLowerCase().includes(q) ||
            r.patientName.toLowerCase().includes(q) ||
            r.patientUhid.toLowerCase().includes(q) ||
            r.immediateCause.toLowerCase().includes(q) ||
            r.caseId.toLowerCase().includes(q)
          }
          toolbarFilters={toolbarFilters}
          toolbarActions={toolbarActions}
          defaultPageSize={10}
          pageSizeOptions={[10, 25, 50, 100]}
          emptyTitle="No death records found"
          emptyDescription="There are no mortality registration records matching your filter criteria."
        />
      )}

      {/* 1. Add Birth Record Modal */}
      {showAddBirthModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-md border border-slate-200 shadow-xl w-full max-w-xl max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in-95 duration-150">
            <div className="px-4 py-3 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-2">
                <Baby className="w-4 h-4 text-[#0094b6]" />
                <h3 className="text-sm font-bold text-slate-900">Add New Birth Record</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowAddBirthModal(false)}
                className="w-7 h-7 rounded-sm text-slate-400 hover:text-slate-700 hover:bg-slate-200 flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateBirth} className="p-4 space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    Child Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formChildName}
                    onChange={(e) => setFormChildName(e.target.value)}
                    placeholder="e.g. Baby of Farhana / Aarav"
                    className="w-full h-8 px-2.5 rounded-[3px] border border-slate-300 text-xs focus:outline-hidden focus:border-[#0094b6]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    Gender *
                  </label>
                  <select
                    value={formBirthGender}
                    onChange={(e) => setFormBirthGender(e.target.value as Gender)}
                    className="w-full h-8 px-2 rounded-[3px] border border-slate-300 text-xs focus:outline-hidden focus:border-[#0094b6]"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    Date of Birth *
                  </label>
                  <input
                    type="text"
                    required
                    value={formBirthDate}
                    onChange={(e) => setFormBirthDate(e.target.value)}
                    placeholder="DD/MM/YYYY"
                    className="w-full h-8 px-2.5 rounded-[3px] border border-slate-300 text-xs focus:outline-hidden focus:border-[#0094b6]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    Time of Birth *
                  </label>
                  <input
                    type="text"
                    required
                    value={formBirthTime}
                    onChange={(e) => setFormBirthTime(e.target.value)}
                    placeholder="HH:MM AM/PM"
                    className="w-full h-8 px-2.5 rounded-[3px] border border-slate-300 text-xs focus:outline-hidden focus:border-[#0094b6]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    Mother Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formMotherName}
                    onChange={(e) => setFormMotherName(e.target.value)}
                    placeholder="e.g. Farhana Sultana"
                    className="w-full h-8 px-2.5 rounded-[3px] border border-slate-300 text-xs focus:outline-hidden focus:border-[#0094b6]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    Mother UHID
                  </label>
                  <input
                    type="text"
                    value={formMotherUhid}
                    onChange={(e) => setFormMotherUhid(e.target.value)}
                    className="w-full h-8 px-2.5 rounded-[3px] border border-slate-300 text-xs focus:outline-hidden focus:border-[#0094b6]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    Father Full Name
                  </label>
                  <input
                    type="text"
                    value={formFatherName}
                    onChange={(e) => setFormFatherName(e.target.value)}
                    placeholder="e.g. Kamal Hossain"
                    className="w-full h-8 px-2.5 rounded-[3px] border border-slate-300 text-xs focus:outline-hidden focus:border-[#0094b6]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    Birth Weight (kg)
                  </label>
                  <input
                    type="number"
                    step="0.05"
                    min="0.5"
                    value={formBirthWeight}
                    onChange={(e) => setFormBirthWeight(Number(e.target.value))}
                    className="w-full h-8 px-2.5 rounded-[3px] border border-slate-300 text-xs focus:outline-hidden focus:border-[#0094b6]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    Delivery Modality
                  </label>
                  <select
                    value={formDeliveryType}
                    onChange={(e) =>
                      setFormDeliveryType(
                        e.target.value as
                        | 'Normal Vaginal Delivery'
                        | 'Cesarean Section (C-Section)'
                        | 'Assisted Vacuum Delivery'
                      )
                    }
                    className="w-full h-8 px-2 rounded-[3px] border border-slate-300 text-xs focus:outline-hidden focus:border-[#0094b6]"
                  >
                    <option value="Normal Vaginal Delivery">Normal Vaginal Delivery</option>
                    <option value="Cesarean Section (C-Section)">Cesarean Section (C-Section)</option>
                    <option value="Assisted Vacuum Delivery">Assisted Vacuum Delivery</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    Attending Obstetrician
                  </label>
                  <input
                    type="text"
                    value={formBirthDoctor}
                    onChange={(e) => setFormBirthDoctor(e.target.value)}
                    className="w-full h-8 px-2.5 rounded-[3px] border border-slate-300 text-xs focus:outline-hidden focus:border-[#0094b6]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    Ward / Delivery Suite
                  </label>
                  <input
                    type="text"
                    value={formBirthWard}
                    onChange={(e) => setFormBirthWard(e.target.value)}
                    className="w-full h-8 px-2.5 rounded-[3px] border border-slate-300 text-xs focus:outline-hidden focus:border-[#0094b6]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    Contact Telephone
                  </label>
                  <input
                    type="text"
                    value={formBirthPhone}
                    onChange={(e) => setFormBirthPhone(e.target.value)}
                    className="w-full h-8 px-2.5 rounded-[3px] border border-slate-300 text-xs focus:outline-hidden focus:border-[#0094b6]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  Permanent Address
                </label>
                <input
                  type="text"
                  value={formBirthAddress}
                  onChange={(e) => setFormBirthAddress(e.target.value)}
                  className="w-full h-8 px-2.5 rounded-[3px] border border-slate-300 text-xs focus:outline-hidden focus:border-[#0094b6]"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setShowAddBirthModal(false)}
                  className="h-8 px-3 rounded-[3px] border border-slate-300 text-slate-700 hover:bg-slate-100 font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="h-8 px-4 rounded-[3px] bg-[#0094b6] hover:bg-[#007f9c] text-white font-semibold cursor-pointer"
                >
                  Save Birth Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 2. Add Death Record Modal */}
      {showAddDeathModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-md border border-slate-200 shadow-xl w-full max-w-xl max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in-95 duration-150">
            <div className="px-4 py-3 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-2">
                <HeartCrack className="w-4 h-4 text-rose-600" />
                <h3 className="text-sm font-bold text-slate-900">Add New Death Record</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowAddDeathModal(false)}
                className="w-7 h-7 rounded-sm text-slate-400 hover:text-slate-700 hover:bg-slate-200 flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateDeath} className="p-4 space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    Deceased Patient Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formDeathPatientName}
                    onChange={(e) => setFormDeathPatientName(e.target.value)}
                    placeholder="e.g. Kazi Nurul Huda"
                    className="w-full h-8 px-2.5 rounded-[3px] border border-slate-300 text-xs focus:outline-hidden focus:border-[#0094b6]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    Patient UHID
                  </label>
                  <input
                    type="text"
                    value={formDeathUhid}
                    onChange={(e) => setFormDeathUhid(e.target.value)}
                    className="w-full h-8 px-2.5 rounded-[3px] border border-slate-300 text-xs focus:outline-hidden focus:border-[#0094b6]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-4 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    Age
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="120"
                    value={formDeathAge}
                    onChange={(e) => setFormDeathAge(Number(e.target.value))}
                    className="w-full h-8 px-2.5 rounded-[3px] border border-slate-300 text-xs focus:outline-hidden focus:border-[#0094b6]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    Gender
                  </label>
                  <select
                    value={formDeathGender}
                    onChange={(e) => setFormDeathGender(e.target.value as Gender)}
                    className="w-full h-8 px-2 rounded-[3px] border border-slate-300 text-xs focus:outline-hidden focus:border-[#0094b6]"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    Date of Demise *
                  </label>
                  <input
                    type="text"
                    required
                    value={formDeathDate}
                    onChange={(e) => setFormDeathDate(e.target.value)}
                    placeholder="DD/MM/YYYY"
                    className="w-full h-8 px-2.5 rounded-[3px] border border-slate-300 text-xs focus:outline-hidden focus:border-[#0094b6]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    Time of Demise *
                  </label>
                  <input
                    type="text"
                    required
                    value={formDeathTime}
                    onChange={(e) => setFormDeathTime(e.target.value)}
                    placeholder="HH:MM AM/PM"
                    className="w-full h-8 px-2.5 rounded-[3px] border border-slate-300 text-xs focus:outline-hidden focus:border-[#0094b6]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    Next of Kin / Relative
                  </label>
                  <input
                    type="text"
                    value={formGuardianName}
                    onChange={(e) => setFormGuardianName(e.target.value)}
                    placeholder="Name"
                    className="w-full h-8 px-2.5 rounded-[3px] border border-slate-300 text-xs focus:outline-hidden focus:border-[#0094b6]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    Relationship
                  </label>
                  <input
                    type="text"
                    value={formGuardianRelation}
                    onChange={(e) => setFormGuardianRelation(e.target.value)}
                    placeholder="e.g. Son, Spouse"
                    className="w-full h-8 px-2.5 rounded-[3px] border border-slate-300 text-xs focus:outline-hidden focus:border-[#0094b6]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    Contact Number
                  </label>
                  <input
                    type="text"
                    value={formGuardianPhone}
                    onChange={(e) => setFormGuardianPhone(e.target.value)}
                    className="w-full h-8 px-2.5 rounded-[3px] border border-slate-300 text-xs focus:outline-hidden focus:border-[#0094b6]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    Ward / Critical Care Location
                  </label>
                  <input
                    type="text"
                    value={formDeathWard}
                    onChange={(e) => setFormDeathWard(e.target.value)}
                    className="w-full h-8 px-2.5 rounded-[3px] border border-slate-300 text-xs focus:outline-hidden focus:border-[#0094b6]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    Certifying Consultant Physician
                  </label>
                  <input
                    type="text"
                    value={formDeathDoctor}
                    onChange={(e) => setFormDeathDoctor(e.target.value)}
                    className="w-full h-8 px-2.5 rounded-[3px] border border-slate-300 text-xs focus:outline-hidden focus:border-[#0094b6]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  Immediate Cause of Death (Part I-A) *
                </label>
                <input
                  type="text"
                  required
                  value={formImmediateCause}
                  onChange={(e) => setFormImmediateCause(e.target.value)}
                  placeholder="e.g. Cardiopulmonary Arrest"
                  className="w-full h-8 px-2.5 rounded-[3px] border border-slate-300 text-xs focus:outline-hidden focus:border-[#0094b6]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    Antecedent Cause (Part I-B)
                  </label>
                  <input
                    type="text"
                    value={formAntecedentCause}
                    onChange={(e) => setFormAntecedentCause(e.target.value)}
                    placeholder="e.g. Septic Shock"
                    className="w-full h-8 px-2.5 rounded-[3px] border border-slate-300 text-xs focus:outline-hidden focus:border-[#0094b6]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    Underlying Cause (Part I-C)
                  </label>
                  <input
                    type="text"
                    value={formUnderlyingCause}
                    onChange={(e) => setFormUnderlyingCause(e.target.value)}
                    placeholder="e.g. Severe Bilateral Pneumonia"
                    className="w-full h-8 px-2.5 rounded-[3px] border border-slate-300 text-xs focus:outline-hidden focus:border-[#0094b6]"
                  />
                </div>
              </div>

              <div className="pt-1">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formAutopsyRequired}
                    onChange={(e) => setFormAutopsyRequired(e.target.checked)}
                    className="w-4 h-4 text-[#006a4e] rounded border-slate-300"
                  />
                  <span className="text-[11px] font-semibold text-slate-700">
                    Medico-Legal Case / Autopsy Required (Police Protocol)
                  </span>
                </label>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setShowAddDeathModal(false)}
                  className="h-8 px-3 rounded-[3px] border border-slate-300 text-slate-700 hover:bg-slate-100 font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="h-8 px-4 rounded-[3px] bg-[#006a4e] hover:bg-[#00523c] text-white font-semibold cursor-pointer"
                >
                  Save Death Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 3. Printable Birth Certificate Modal */}
      {showBirthCertModal && activeBirthCert && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-md border border-slate-200 shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in-95 duration-150">
            <div className="p-6 space-y-4">
              <div className="flex items-start justify-between border-b-2 border-emerald-600 pb-3">
                <div>
                  <h2 className="text-lg font-bold text-slate-900 tracking-tight">GREEN HOSPITAL HEALTHCARE</h2>
                  <p className="text-[11px] text-slate-600">Department of Obstetrics &amp; Neonatal Medicine</p>
                  <p className="text-[10px] text-slate-500">Official Certificate of Live Birth · Registered Registry</p>
                </div>
                <div className="text-right">
                  <span className="font-mono text-xs font-bold text-emerald-700 block">{activeBirthCert.referenceNo}</span>
                  <span className="text-[10px] text-slate-500">Ref Case #{activeBirthCert.caseId}</span>
                </div>
              </div>

              <div className="bg-emerald-50/50 border border-emerald-200 p-3 rounded-[3px] text-center">
                <span className="text-xs font-serif italic text-emerald-900 block mb-1">
                  This certifies that a live birth occurred at Green Hospital on the date and time recorded below:
                </span>
                <h3 className="text-base font-bold text-slate-900 tracking-wide">{activeBirthCert.childName}</h3>
                <span className="text-xs font-semibold text-emerald-800">
                  {activeBirthCert.gender} · Birth Weight: {activeBirthCert.birthWeightKg} Kilograms
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs bg-slate-50 p-3 border border-slate-200">
                <div>
                  <span className="text-[10px] text-slate-400 block">Mother Full Name:</span>
                  <strong className="text-slate-900">{activeBirthCert.motherName} ({activeBirthCert.motherUhid})</strong>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block">Father Full Name:</span>
                  <strong className="text-slate-900">{activeBirthCert.fatherName}</strong>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block">Date &amp; Time of Birth:</span>
                  <strong className="text-slate-900">{activeBirthCert.birthDate} at {activeBirthCert.birthTime}</strong>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block">Delivery Suite / Ward:</span>
                  <strong className="text-slate-900">{activeBirthCert.wardLocation}</strong>
                </div>
              </div>

              <div className="text-xs text-slate-600 bg-slate-50 p-2.5 border border-slate-200">
                <span className="text-[10px] text-slate-400 block">Permanent Residence:</span>
                <p className="text-slate-800 font-medium">{activeBirthCert.permanentAddress}</p>
              </div>

              <div className="pt-6 border-t border-slate-200 flex items-end justify-between text-xs">
                <div>
                  <p className="text-[10px] text-slate-400">Authenticated birth record registered under National Vital Statistics.</p>
                  <p className="text-[10px] text-slate-400">Issued Date: {activeBirthCert.certificateIssueDate}</p>
                </div>
                <div className="text-right">
                  <div className="inline-block border-b border-slate-400 pb-0.5 mb-1 px-4 text-center">
                    <span className="font-serif italic text-sm text-emerald-700">{activeBirthCert.attendingDoctor}</span>
                  </div>
                  <p className="font-bold text-slate-900 text-[11px]">Attending Obstetrician &amp; Gynecologist</p>
                  <p className="text-[10px] text-slate-500">Medical Superintendent Seal</p>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setShowBirthCertModal(false)}
                  className="h-8 px-3 rounded-[3px] border border-slate-300 text-slate-700 hover:bg-slate-100 font-semibold cursor-pointer text-xs"
                >
                  Close
                </button>
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="h-8 px-4 rounded-[3px] bg-[#0094b6] hover:bg-[#007f9c] text-white font-semibold flex items-center gap-1.5 cursor-pointer text-xs"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print Official Certificate</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 4. Printable Death Certificate Modal */}
      {showDeathCertModal && activeDeathCert && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-md border border-slate-200 shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in-95 duration-150">
            <div className="p-6 space-y-4">
              <div className="flex items-start justify-between border-b-2 border-slate-800 pb-3">
                <div>
                  <h2 className="text-lg font-bold text-slate-900 tracking-tight">GREEN HOSPITAL HEALTHCARE</h2>
                  <p className="text-[11px] text-slate-600">Medical Certificate of Cause of Death (MCCD)</p>
                  <p className="text-[10px] text-slate-500">Form No. 4 · Hospital Inpatient Mortality Record</p>
                </div>
                <div className="text-right">
                  <span className="font-mono text-xs font-bold text-slate-900 block">{activeDeathCert.referenceNo}</span>
                  <span className="text-[10px] text-slate-500">Case #{activeDeathCert.caseId}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 bg-slate-50 p-2.5 border border-slate-200 text-xs">
                <div>
                  <span className="text-[10px] text-slate-400 block">Deceased Name:</span>
                  <strong className="text-slate-900">{activeDeathCert.patientName}</strong>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block">Age &amp; Gender:</span>
                  <strong className="text-slate-900">{activeDeathCert.age} Years · {activeDeathCert.gender}</strong>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block">Patient UHID:</span>
                  <strong className="text-slate-900 font-mono">{activeDeathCert.patientUhid}</strong>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block">Date of Demise:</span>
                  <strong className="text-slate-900">{activeDeathCert.deathDate} ({activeDeathCert.deathTime})</strong>
                </div>
              </div>

              <div className="border border-slate-200 rounded-[3px] p-3 text-xs space-y-2 bg-slate-50/70">
                <span className="font-bold text-slate-800 text-[11px] block border-b border-slate-200 pb-1">
                  Cause of Death Certification:
                </span>
                <div>
                  <span className="text-[10px] text-slate-500 block font-semibold">
                    I. (a) Immediate Cause (Final disease condition resulting in death):
                  </span>
                  <p className="font-bold text-slate-900 mt-0.5">{activeDeathCert.immediateCause}</p>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 block font-semibold">
                    I. (b) Antecedent Cause (Morbid conditions giving rise to above cause):
                  </span>
                  <p className="font-medium text-slate-800 mt-0.5">{activeDeathCert.antecedentCause}</p>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 block font-semibold">
                    I. (c) Underlying Cause (Disease/injury initiating train of morbid events):
                  </span>
                  <p className="text-slate-700 mt-0.5">{activeDeathCert.underlyingCause}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs bg-slate-50 p-2.5 border border-slate-200">
                <div>
                  <span className="text-[10px] text-slate-400 block">Informant / Relative:</span>
                  <strong className="text-slate-900">{activeDeathCert.guardianName} ({activeDeathCert.guardianRelation})</strong>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block">Autopsy Status:</span>
                  <strong className="text-slate-900">
                    {activeDeathCert.autopsyRequired ? 'Required for Forensic Investigation' : 'Not Required'}
                  </strong>
                </div>
              </div>

              <div className="pt-6 border-t border-slate-200 flex items-end justify-between text-xs">
                <div>
                  <p className="text-[10px] text-slate-400">Authenticated medical certificate of death issued under Hospital By-laws.</p>
                  <p className="text-[10px] text-slate-400">Issued Date: {activeDeathCert.certificateIssueDate}</p>
                </div>
                <div className="text-right">
                  <div className="inline-block border-b border-slate-400 pb-0.5 mb-1 px-4 text-center">
                    <span className="font-serif italic text-sm text-slate-800">{activeDeathCert.attendingDoctor}</span>
                  </div>
                  <p className="font-bold text-slate-900 text-[11px]">Certifying Physician &amp; In-Charge</p>
                  <p className="text-[10px] text-slate-500">BMDC Reg. Certified Consultant</p>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setShowDeathCertModal(false)}
                  className="h-8 px-3 rounded-[3px] border border-slate-300 text-slate-700 hover:bg-slate-100 font-semibold cursor-pointer text-xs"
                >
                  Close
                </button>
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="h-8 px-4 rounded-[3px] bg-[#006a4e] hover:bg-[#00523c] text-white font-semibold flex items-center gap-1.5 cursor-pointer text-xs"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print Official MCCD</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
