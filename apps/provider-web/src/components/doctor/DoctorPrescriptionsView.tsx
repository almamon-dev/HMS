import {
  Activity,
  AlertTriangle,
  ArrowLeft,
  Calendar,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  ClipboardList,
  Clock,
  Download,
  Eye,
  FileText,
  FlaskConical,
  Heart,
  Info,
  Monitor,
  PenTool,
  Pill,
  Plus,
  Printer,
  Save,
  Search,
  Stethoscope,
  Trash2,
  User,
  UserCheck,
  X
} from 'lucide-react';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  CURRENT_DOCTOR,
  DOCTOR_PATIENTS,
  DOCTOR_PRESCRIPTIONS,
  EPrescription,
  HOSPITAL_LAB_TEST_CATALOG,
  PrescribedTest,
  PrescriptionMedicine
} from '../../data/doctorPortalData';
import { DataTable, DataTableColumn } from '../common/DataTable';
import { DropdownSelect } from '../common/DropdownSelect';
import { SummaryCard, SummaryCardGrid } from '../common/SummaryCard';
import { TableActionButtons } from '../common/TableActionButtons';

interface DoctorPrescriptionsViewProps {
  initialPatient?: { name: string; uhid: string; age: number; gender: string } | null;
}

type ViewMode = 'list' | 'create' | 'print-slip';

export const DoctorPrescriptionsView: React.FC<DoctorPrescriptionsViewProps> = ({
  initialPatient,
}) => {
  const [prescriptions, setPrescriptions] = useState<EPrescription[]>(DOCTOR_PRESCRIPTIONS);
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedRx, setSelectedRx] = useState<EPrescription | null>(null);

  // Full page viewMode: 'list' (all records), 'create' (full page write form), 'print-slip' (full page print sheet)
  const [viewMode, setViewMode] = useState<ViewMode>(initialPatient ? 'create' : 'list');

  // Prescription Mode: 'computer' (digital typed & print) vs 'handwritten' (physical pad)
  const [rxMode, setRxMode] = useState<'computer' | 'handwritten'>('computer');

  // Form State for New E-Rx
  const [rxPatientName, setRxPatientName] = useState(initialPatient?.name || 'Md. Rahim Uddin');
  const [rxUhid, setRxUhid] = useState(initialPatient?.uhid || 'UHID-2024-8841');
  const [rxAge, setRxAge] = useState(initialPatient?.age?.toString() || '54');
  const [rxGender, setRxGender] = useState(initialPatient?.gender || 'Male');
  const [rxDiagnosis, setRxDiagnosis] = useState('Unstable Angina (I20.0)');
  const [diagnosisInput, setDiagnosisInput] = useState('');
  const [showDiagnosisDropdown, setShowDiagnosisDropdown] = useState(false);

  // Patient Clinical Case Study & History State
  const [rxChiefComplaints, setRxChiefComplaints] = useState(
    'Chest tightness on exertion, intermittent palpitation.'
  );
  const [rxCaseStudy, setRxCaseStudy] = useState(
    '54-year-old male with 7-year history of Stage 2 HTN and T2DM presenting with recurrent retrosternal discomfort on moderate exertion, relieved by rest. Patient reports good medication adherence. Denies syncope, palpitations, or orthopnea.'
  );
  const [rxPastHistory, setRxPastHistory] = useState('Hypertension (7 yrs), Type 2 Diabetes (4 yrs)');
  const [rxAllergies, setRxAllergies] = useState('Penicillin, Sulfa drugs');
  const [rxClinicalFindings, setRxClinicalFindings] = useState(
    'Chest clear bilaterally, S1+S2 regular, no murmur'
  );
  const [isHistoryAccordionOpen, setIsHistoryAccordionOpen] = useState(false);

  // Vitals matching compact layout
  const [rxBp, setRxBp] = useState('120/80');
  const [rxPulse, setRxPulse] = useState('76');
  const [rxTemp, setRxTemp] = useState('36.8');
  const [rxSpo2, setRxSpo2] = useState('98');
  const [rxWeight, setRxWeight] = useState('68');
  const [rxNotes, setRxNotes] = useState('Patient presented with mild chest tightness and fatigue. Advised rest.');

  const [followUp, setFollowUp] = useState('27 Nov 2026');
  const [followUpInstructions, setFollowUpInstructions] = useState('Review with reports and BP control.');
  const [previewTab, setPreviewTab] = useState<'preview' | 'history'>('preview');
  const [previewZoom, setPreviewZoom] = useState(100);
  const [showPatientDetailsModal, setShowPatientDetailsModal] = useState(false);

  // Reactively sync when initialPatient changes (e.g. clicking Create E-Rx or from appointment row)
  useEffect(() => {
    if (initialPatient) {
      setRxPatientName(initialPatient.name || 'Md. Rahim Uddin');
      setRxUhid(initialPatient.uhid || 'UHID-2024-8841');
      setRxAge(initialPatient.age?.toString() || '54');
      setRxGender(initialPatient.gender || 'Male');

      const matched = DOCTOR_PATIENTS.find(
        (p) =>
          p.uhid === initialPatient.uhid ||
          p.name.toLowerCase() === (initialPatient.name || '').toLowerCase()
      );
      if (matched) {
        setRxDiagnosis(matched.diagnosis || 'Unstable Angina (I20.0)');
        setRxAllergies(matched.allergies ? matched.allergies.join(', ') : 'Penicillin, Sulfa drugs');
        setRxPastHistory(matched.chronicDiseases ? matched.chronicDiseases.join(', ') : 'Hypertension (7 yrs)');
        setRxChiefComplaints('Chest tightness on exertion, intermittent palpitation.');
        setRxCaseStudy(
          `Patient presented for comprehensive OPD evaluation. Primary diagnosis: ${matched.diagnosis}. Known co-morbidities: ${matched.chronicDiseases?.join(', ') || 'None'}. Clinical vitals at triage: ${matched.vitalsSummary || 'Stable'}.`
        );
      }
      setViewMode('create');
    }
  }, [initialPatient]);

  const [medicines, setMedicines] = useState<PrescriptionMedicine[]>([
    {
      medicineName: 'Tab. Aspirin (Ecosprin)',
      dosage: '75 mg',
      route: 'Oral',
      frequency: '1-0-0 (Morning)',
      duration: '30 Days',
      instruction: 'After breakfast',
    },
    {
      medicineName: 'Tab. Atorvastatin (Atova)',
      dosage: '20 mg',
      route: 'Oral',
      frequency: '0-0-1 (Night)',
      duration: '30 Days',
      instruction: 'At bedtime',
    },
  ]);

  // Prescribed Diagnostic Tests (In-House Hospital Lab vs Others / External Lab)
  const [prescribedTests, setPrescribedTests] = useState<PrescribedTest[]>([
    {
      id: 'test-1',
      name: 'ECG (12-Lead)',
      source: 'in-house',
      department: 'Cardiology',
    },
    {
      id: 'test-2',
      name: 'Lipid Profile',
      source: 'in-house',
      department: 'Biochemistry',
    },
    {
      id: 'test-3',
      name: 'Renal Function Test',
      source: 'in-house',
      department: 'Biochemistry',
    },
  ]);

  const [adviceText, setAdviceText] = useState(
    '• Low salt, low fat diet.\n• Regular walking (≥ 30 minutes daily).\n• Avoid smoking and alcohol.'
  );

  // Autocomplete Live Search State
  const [testSearchInput, setTestSearchInput] = useState('');
  const [showTestDropdown, setShowTestDropdown] = useState(false);
  const testSearchDeptFilter = 'All';
  const testDropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (testDropdownRef.current && !testDropdownRef.current.contains(e.target as Node)) {
        setShowTestDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  // Filter in-house hospital catalog based on live typing
  const matchingHospitalTests = useMemo(() => {
    const q = testSearchInput.trim().toLowerCase();
    if (!q) return [];
    return HOSPITAL_LAB_TEST_CATALOG.filter((item) => {
      const matchQ =
        item.name.toLowerCase().includes(q) ||
        item.code.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q);
      const matchDept = testSearchDeptFilter === 'All' || item.category === testSearchDeptFilter;
      return matchQ && matchDept;
    });
  }, [testSearchInput, testSearchDeptFilter]);

  const handleAddCatalogTest = (item: (typeof HOSPITAL_LAB_TEST_CATALOG)[0]) => {
    // Avoid exact duplicate
    if (!prescribedTests.some((t) => t.name.toLowerCase() === item.name.toLowerCase())) {
      setPrescribedTests([
        ...prescribedTests,
        {
          id: `test-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
          name: item.name,
          source: 'in-house',
          department: item.category,
          notes: `TAT: ${item.turnaroundTime} • Approx: ${item.charge}`,
        },
      ]);
    }
    setTestSearchInput('');
    setShowTestDropdown(false);
  };

  const handleAddCustomTest = (source: 'in-house' | 'others') => {
    const trimmed = testSearchInput.trim();
    if (!trimmed) return;
    setPrescribedTests([
      ...prescribedTests,
      {
        id: `test-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
        name: trimmed,
        source,
        department: source === 'in-house' ? 'Hospital Lab' : 'External Referral Lab',
        notes: source === 'others' ? 'Outside Diagnostic Center' : 'Hospital In-House Lab',
      },
    ]);
    setTestSearchInput('');
    setShowTestDropdown(false);
  };

  const handleToggleTestSource = (id?: string) => {
    if (!id) return;
    setPrescribedTests(
      prescribedTests.map((t) =>
        t.id === id ? { ...t, source: t.source === 'in-house' ? 'others' : 'in-house' } : t
      )
    );
  };

  const handleRemovePrescribedTest = (id?: string) => {
    if (!id) return;
    setPrescribedTests(prescribedTests.filter((t) => t.id !== id));
  };

  // 4 Superadmin-Styled KPI Cards
  const stats = useMemo(() => {
    const total = prescriptions.length;
    const active = prescriptions.filter((p) => p.status === 'Active E-Rx').length;
    const dispensed = prescriptions.filter((p) => p.status === 'Signed & Dispensed').length;
    const totalMeds = prescriptions.reduce((acc, p) => acc + p.medicines.length, 0);
    return { total, active, dispensed, totalMeds };
  }, [prescriptions]);

  const filteredRx = useMemo(() => {
    return prescriptions.filter((p) => {
      if (statusFilter === 'All') return true;
      if (statusFilter === 'Handwritten Pad') return p.status === 'Handwritten Pad' || p.mode === 'handwritten';
      if (statusFilter === 'Active E-Rx') return p.mode !== 'handwritten' && p.status !== 'Handwritten Pad';
      return p.status === statusFilter;
    });
  }, [prescriptions, statusFilter]);

  const handleAddMedicineRow = () => {
    setMedicines([
      ...medicines,
      {
        medicineName: '',
        dosage: '500 mg',
        route: 'Oral',
        frequency: '1-0-1 (Twice)',
        duration: '7 Days',
        instruction: 'After meals',
      },
    ]);
  };

  const handleRemoveMedicineRow = (index: number) => {
    setMedicines(medicines.filter((_, idx) => idx !== index));
  };

  const handleUpdateMedicineRow = (index: number, field: keyof PrescriptionMedicine, value: string) => {
    setMedicines(
      medicines.map((m, idx) => (idx === index ? { ...m, [field]: value } : m))
    );
  };

  const handleCreatePrescription = (e: React.FormEvent, shouldPrint = false) => {
    e.preventDefault();
    if (!rxPatientName.trim()) return;

    const isHandwritten = rxMode === 'handwritten';

    const newRx: EPrescription = {
      id: `rx-${Date.now()}`,
      rxNumber: `RX-2026-${Math.floor(100000 + Math.random() * 900000)}`,
      uhid: rxUhid || `UHID-2024-${Math.floor(1000 + Math.random() * 9000)}`,
      patientName: rxPatientName.trim(),
      age: Number(rxAge) || 54,
      gender: rxGender,
      date: '20 Nov 2026',
      diagnosis: rxDiagnosis || (isHandwritten ? 'General Medical Consultation' : 'Unstable Angina (I20.0)'),
      medicines: isHandwritten ? [] : medicines.filter((m) => m.medicineName.trim().length > 0),
      advice: isHandwritten ? [rxNotes] : adviceText.split('\n').filter((a) => a.trim().length > 0),
      testsAdvised: isHandwritten ? [] : prescribedTests,
      followUp: isHandwritten ? 'As needed' : followUp,
      status: isHandwritten ? 'Handwritten Pad' : 'Active E-Rx',
      mode: rxMode,
      vitals: {
        bp: rxBp,
        pulse: rxPulse,
        weight: rxWeight,
        temp: rxTemp,
        spo2: rxSpo2,
      },
      caseStudy: {
        chiefComplaints: rxChiefComplaints,
        caseHistory: rxCaseStudy,
        pastMedicalHistory: rxPastHistory,
        allergies: rxAllergies.split(',').map((a) => a.trim()).filter(Boolean),
        clinicalFindings: rxClinicalFindings,
      },
    };

    setPrescriptions([newRx, ...prescriptions]);
    setSelectedRx(newRx);

    if (shouldPrint) {
      setTimeout(() => {
        window.print();
      }, 350);
    } else {
      setViewMode('list');
    }
  };

  const columns: DataTableColumn<EPrescription>[] = [
    {
      key: 'rxNumber',
      header: 'Rx Number',
      sortable: true,
      sortValue: (r) => r.rxNumber,
      render: (r) => (
        <span className="font-extrabold text-[#0c2e4b] whitespace-nowrap">
          {r.rxNumber}
        </span>
      ),
    },
    {
      key: 'mode',
      header: 'Prescription Type',
      render: (r) => (
        <span
          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-[3px] text-xs font-semibold border whitespace-nowrap ${r.mode === 'handwritten' || r.status === 'Handwritten Pad'
            ? 'bg-amber-50 text-amber-800 border-amber-200'
            : 'bg-blue-50 text-blue-800 border-blue-200'
            }`}
        >
          {r.mode === 'handwritten' || r.status === 'Handwritten Pad' ? (
            <>
              <PenTool className="w-3 h-3 text-amber-700" />
              <span>Handwritten</span>
            </>
          ) : (
            <>
              <Monitor className="w-3 h-3 text-blue-700" />
              <span>Computer (Print)</span>
            </>
          )}
        </span>
      ),
    },
    {
      key: 'date',
      header: 'Date',
      sortable: true,
      sortValue: (r) => r.date,
      render: (r) => (
        <span className="text-slate-600 whitespace-nowrap">
          {r.date}
        </span>
      ),
    },
    {
      key: 'patientName',
      header: 'Patient Name & UHID',
      sortable: true,
      sortValue: (r) => r.patientName,
      render: (r) => (
        <div>
          <div className="font-bold text-slate-900 leading-tight text-xs">{r.patientName}</div>
          <div className="text-[11px] text-slate-500">
            {r.uhid} • {r.age}y / {r.gender}
          </div>
        </div>
      ),
    },
    {
      key: 'diagnosis',
      header: 'Clinical Diagnosis',
      render: (r) => (
        <div className="text-slate-800 font-medium max-w-xs truncate text-xs" title={r.diagnosis}>
          {r.diagnosis}
        </div>
      ),
    },
    {
      key: 'medicines',
      header: 'Prescribed Drugs',
      render: (r) => (
        r.mode === 'handwritten' || r.status === 'Handwritten Pad' ? (
          <span className="text-slate-400 italic text-xs">Written on Pad</span>
        ) : (
          <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 font-semibold text-xs whitespace-nowrap">
            {r.medicines.length} Medicines
          </span>
        )
      ),
    },
    {
      key: 'status',
      header: 'Status',
      sortable: true,
      sortValue: (r) => r.status,
      render: (r) => (
        <span
          className={`px-2 py-0.5 rounded-[3px] text-xs font-semibold whitespace-nowrap ${r.status === 'Signed & Dispensed'
            ? 'bg-slate-100 text-slate-700 border border-slate-200'
            : r.status === 'Handwritten Pad'
              ? 'bg-amber-50 text-amber-800 border border-amber-200'
              : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
            }`}
        >
          {r.status}
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
            onClick={() => {
              setSelectedRx(r);
              setViewMode('print-slip');
              setTimeout(() => window.print(), 350);
            }}
            className="px-2.5 py-1 rounded-[3px] bg-[#0c2e4b] hover:bg-[#081e31] text-white text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer shadow-xs mr-1"
            title="Print copy for customer"
          >
            <Printer className="w-3 h-3" />
            <span>Print Slip</span>
          </button>
          <TableActionButtons
            onView={() => {
              setSelectedRx(r);
              setViewMode('print-slip');
            }}
            onEdit={() => {
              setRxPatientName(r.patientName);
              setRxUhid(r.uhid);
              setRxAge(r.age.toString());
              setRxGender(r.gender);
              setRxDiagnosis(r.diagnosis);
              setRxChiefComplaints(
                r.caseStudy?.chiefComplaints ||
                'Chest tightness on exertion, intermittent palpitation.'
              );
              setRxCaseStudy(r.caseStudy?.caseHistory || '');
              setRxPastHistory(r.caseStudy?.pastMedicalHistory || '');
              setRxAllergies(r.caseStudy?.allergies?.join(', ') || '');
              setRxClinicalFindings(r.caseStudy?.clinicalFindings || '');
              if (r.vitals) {
                setRxBp(r.vitals.bp || '120/80');
                setRxPulse(r.vitals.pulse || '76');
                setRxTemp(r.vitals.temp || '36.8');
                setRxSpo2(r.vitals.spo2 || '98');
                setRxWeight(r.vitals.weight || '68');
              }
              setMedicines(r.medicines || []);
              if (r.testsAdvised) {
                setPrescribedTests(
                  r.testsAdvised.map((t, idx) =>
                    typeof t === 'string'
                      ? { id: `test-${idx}`, name: t, source: 'in-house', department: 'General Lab' }
                      : t
                  )
                );
              }
              setAdviceText(r.advice.join('\n'));
              setFollowUp(r.followUp || '27 Nov 2026');
              setRxMode(r.mode || (r.status === 'Handwritten Pad' ? 'handwritten' : 'computer'));
              setSelectedRx(r);
              setViewMode('create');
            }}
            onDelete={() => {
              setPrescriptions(prescriptions.filter((p) => p.id !== r.id));
            }}
            viewTitle="View prescription slip"
            editTitle="Edit prescription in workstation"
            deleteTitle="Delete prescription record"
          />
        </div>
      ),
    },
  ];

  const toolbarFilters = (
    <DropdownSelect
      value={statusFilter}
      onChange={(val) => setStatusFilter(val)}
      width="w-48"
      options={[
        { label: 'All Prescriptions', value: 'All' },
        { label: 'Active E-Rx', value: 'Active E-Rx' },
        { label: 'Signed & Dispensed', value: 'Signed & Dispensed' },
      ]}
    />
  );

  const toolbarActions = (
    <button
      type="button"
      onClick={() => {
        setRxMode('computer');
        setViewMode('create');
      }}
      className="h-8 px-3 rounded-[3px] bg-[#0c2e4b] hover:bg-[#081e31] text-white text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shrink-0 shadow-xs"
    >
      <Plus className="w-3.5 h-3.5" />
      <span>New Prescription</span>
    </button>
  );

  // -------------------------------------------------------------
  // VIEW MODE 1: FULL PAGE OFFICIAL PRESCRIPTION PAD SLIP (PRINT)
  // -------------------------------------------------------------
  if (viewMode === 'print-slip' && selectedRx) {
    const rxMeds = selectedRx.medicines || [];
    const rxTests = selectedRx.testsAdvised || [];
    const rxAdvice = selectedRx.advice || [];

    // Overflow threshold for A4 paper: > 5 medicines, or 5 meds + extensive tests/advice
    const isMultiPage =
      rxMeds.length > 5 ||
      (rxMeds.length > 4 && rxTests.length + rxAdvice.length > 5) ||
      rxTests.length + rxAdvice.length > 8;

    const page1Medicines = isMultiPage ? rxMeds.slice(0, 5) : rxMeds;
    const page2Medicines = isMultiPage ? rxMeds.slice(5) : [];

    return (
      <div className="max-w-[794px] mx-auto space-y-4 font-['Plus_Jakarta_Sans',sans-serif] px-4 sm:px-0 pb-12">
        {/* Print Stylesheet for Authentic A4 Paper Dimensions & Clean Multi-page Breaks */}
        <style>{`
          @media print {
            @page {
              size: A4 portrait;
              margin: 10mm 12mm 12mm 12mm;
            }
            body {
              background: white !important;
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
            }
            .a4-print-sheet {
              width: 100% !important;
              min-height: 272mm !important;
              max-height: none !important;
              padding: 0 !important;
              margin: 0 !important;
              border: none !important;
              box-shadow: none !important;
              page-break-after: always !important;
              break-after: page !important;
              display: flex !important;
              flex-direction: column !important;
              justify-content: space-between !important;
            }
            .a4-print-sheet:last-child {
              page-break-after: auto !important;
              break-after: auto !important;
            }
            .avoid-print-break {
              break-inside: avoid !important;
              page-break-inside: avoid !important;
            }
          }
        `}</style>

        {/* Navigation & Action Bar (Same width as A4 Sheet - 794px) */}
        <div className="w-full bg-white p-3 rounded-[4px] border border-slate-200/90 shadow-xs flex flex-wrap items-center justify-between gap-3 print:hidden">
          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={() => setViewMode('list')}
              className="px-2.5 py-1.5 rounded-[3px] border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Prescriptions</span>
            </button>
            <div className="h-4 w-px bg-slate-300" />
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-bold text-slate-900">
                  Official E-Prescription Slip ({selectedRx.rxNumber})
                </h2>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-[#0c2e4b] border border-slate-200">
                  {isMultiPage ? '2 Pages (A4)' : '1 Page (A4)'}
                </span>
              </div>
              <p className="text-[11px] text-slate-500">
                Patient: <span className="font-semibold text-slate-800">{selectedRx.patientName}</span> ({selectedRx.uhid}) • Date: {selectedRx.date}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => window.print()}
              className="px-4 py-1.5 rounded-[3px] bg-[#0c2e4b] hover:bg-[#081e31] text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <Printer className="w-4 h-4" />
              <span>Print for Customer</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setRxMode('computer');
                setViewMode('create');
              }}
              className="px-3 py-1.5 rounded-[3px] border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Write New Rx</span>
            </button>
          </div>
        </div>

        {/* ========================================================= */}
        {/* A4 PAPER SHEET 1 (Standard A4 Dimensions: 794px × 1123px) */}
        {/* ========================================================= */}
        <div className="a4-print-sheet w-full max-w-[794px] min-h-[1123px] bg-white border border-slate-300/80 rounded-[4px] p-8 sm:p-11 shadow-sm flex flex-col justify-between text-xs print:p-0 print:border-none print:shadow-none print:max-w-full">
          <div className="space-y-5">
            {/* 1) Doctor & Hospital Brand Header */}
            <div className="pb-3 flex items-start justify-between">
              <div>
                <h1 className="text-xl font-extrabold text-slate-900 leading-tight">
                  {CURRENT_DOCTOR.name}
                </h1>
                <div className="text-xs text-[#0c2e4b] font-bold mt-0.5">
                  {CURRENT_DOCTOR.qualification}
                </div>
                <div className="text-[11px] text-slate-600 font-medium">
                  {CURRENT_DOCTOR.designation} • {CURRENT_DOCTOR.department}
                </div>
                <div className="text-[11px] text-slate-500">
                  BMDC Reg: <span className="font-semibold text-slate-800">{CURRENT_DOCTOR.bmdcReg}</span> • {CURRENT_DOCTOR.room}
                </div>
              </div>

              <div className="text-right">
                <div className="text-xl font-black text-[#0c2e4b] tracking-tight">
                  GreenHospital
                </div>
                <div className="text-[11px] font-semibold text-slate-700">
                  Dhaka Central Healthcare Wing
                </div>
                <div className="text-[10px] text-slate-500 mt-0.5">
                  Emergency: 10666 • www.greenhospital.local
                </div>
              </div>
            </div>

            {/* 2) Patient Demographics & Vitals Strip (Horizontal with border-y) */}
            <div className="border-y border-slate-300 py-2.5 my-1 text-xs space-y-1.5">
              <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-1 text-slate-900">
                <div>
                  <span className="font-bold text-slate-900">Patient Name: </span>
                  <span className="font-semibold text-slate-800">{selectedRx.patientName}</span>
                </div>
                <div>
                  <span className="font-bold text-slate-900">Gender: </span>
                  <span className="font-semibold text-slate-800">{selectedRx.gender}</span>
                </div>
                <div>
                  <span className="font-bold text-slate-900">Age: </span>
                  <span className="font-semibold text-slate-800">{selectedRx.age} Y</span>
                </div>
                <div>
                  <span className="font-bold text-slate-900">Weight: </span>
                  <span className="font-semibold text-slate-800">{selectedRx.vitals?.weight || '68 kg'}</span>
                </div>
                <div>
                  <span className="font-bold text-slate-900">UHID: </span>
                  <span className="font-semibold text-slate-800">{selectedRx.uhid}</span>
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-1 text-slate-900">
                <div>
                  <span className="font-bold text-slate-900">Date: </span>
                  <span className="font-semibold text-slate-800">{selectedRx.date}</span>
                </div>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-slate-600">
                  <span>
                    <strong className="text-slate-800">Blood Pressure:</strong>{' '}
                    {selectedRx.vitals?.bp || '120/80 mmHg'}
                  </span>
                  <span>•</span>
                  <span>
                    <strong className="text-slate-800">Pulse Rate:</strong>{' '}
                    {selectedRx.vitals?.pulse || '76 bpm'}
                  </span>
                  <span>•</span>
                  <span>
                    <strong className="text-slate-800">Body Temp:</strong>{' '}
                    {selectedRx.vitals?.temp || '98.4 °F'}
                  </span>
                  {selectedRx.vitals?.spo2 && (
                    <>
                      <span>•</span>
                      <span>
                        <strong className="text-slate-800">SpO₂:</strong>{' '}
                        {selectedRx.vitals.spo2} %
                      </span>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* 3) Main Clinical Middle Body: Two Column Split */}
            <div className="grid grid-cols-12 gap-6 min-h-[300px] items-start pt-2">
              {/* Left Column (~30%): Provisional Diagnosis & Clinical Findings */}
              <div className="col-span-12 md:col-span-4 pr-3 border-r border-slate-200 space-y-3">
                <div>
                  <span className="text-xs font-bold text-slate-600 block mb-0.5">
                    Provisional Diagnosis:
                  </span>
                  <div className="text-sm font-bold text-slate-900 leading-snug">
                    {selectedRx.diagnosis}
                  </div>
                </div>

                {selectedRx.caseStudy?.chiefComplaints && (
                  <div className="text-xs pt-1">
                    <span className="font-bold text-slate-600 block mb-0.5">
                      Chief Complaints:
                    </span>
                    <div className="text-slate-700 leading-relaxed">
                      {selectedRx.caseStudy.chiefComplaints}
                    </div>
                  </div>
                )}

                {selectedRx.caseStudy?.pastMedicalHistory && (
                  <div className="text-xs pt-1">
                    <span className="font-bold text-slate-600 block mb-0.5">
                      Past History:
                    </span>
                    <div className="text-slate-700 leading-relaxed">
                      {selectedRx.caseStudy.pastMedicalHistory}
                    </div>
                  </div>
                )}

                {selectedRx.caseStudy?.allergies && selectedRx.caseStudy.allergies.length > 0 && (
                  <div className="text-xs pt-1">
                    <span className="font-bold text-rose-700 block mb-0.5">
                      Known Allergies:
                    </span>
                    <div className="text-rose-800 font-semibold leading-relaxed">
                      {selectedRx.caseStudy.allergies.join(', ')}
                    </div>
                  </div>
                )}

                {selectedRx.caseStudy?.clinicalFindings && (
                  <div className="text-xs pt-1">
                    <span className="font-bold text-slate-600 block mb-0.5">
                      Clinical Examination:
                    </span>
                    <div className="text-slate-700 leading-relaxed">
                      {selectedRx.caseStudy.clinicalFindings}
                    </div>
                  </div>
                )}
              </div>

              {/* Right Column (~70%): ℞ Prescribed Medications */}
              <div className="col-span-12 md:col-span-8 pl-1 space-y-3">
                <div className="flex items-center gap-2 border-b border-slate-200 pb-1">
                  <span className="text-3xl font-serif font-black text-[#0c2e4b]">℞</span>
                  <span className="text-xs font-bold text-slate-800">
                    Prescribed Medications {isMultiPage && <span className="text-slate-500 font-normal">(Page 1: Items 1-5)</span>}
                  </span>
                </div>

                <div className="space-y-2.5">
                  {page1Medicines.map((med, idx) => (
                    <div
                      key={idx}
                      className="avoid-print-break flex flex-wrap items-center justify-between gap-x-4 gap-y-1 border-b border-slate-100 pb-2.5"
                    >
                      <div className="min-w-0 flex-1">
                        <div className="font-bold text-slate-900 text-sm">
                          {idx + 1}. {med.medicineName}{' '}
                          <span className="font-normal text-slate-500 text-xs">({med.dosage})</span>
                        </div>
                        <div className="text-xs text-slate-600 font-medium pl-3.5 mt-0.5 flex flex-wrap items-center gap-x-2">
                          <span className="font-bold text-[#0c2e4b] text-[13px] tracking-wide">
                            {med.frequency}
                          </span>
                          <span className="text-slate-300">•</span>
                          <span className="italic text-slate-700">{med.instruction}</span>
                        </div>
                      </div>

                      {/* Duration placed at the END */}
                      <div className="text-right ml-auto self-center shrink-0 text-xs">
                        <span className="font-bold text-[#0c2e4b] text-xs">
                          {med.duration}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Single Page Mode: Diagnostic Investigations & Special Clinical Advice on Page 1 */}
            {!isMultiPage && (
              <div className="avoid-print-break grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t border-slate-200 text-xs items-start">
                <div className="space-y-1">
                  <span className="font-bold text-slate-900 block text-xs">
                    Diagnostic Investigations Advised
                    {rxTests.length > 0 ? ` (Total: ${rxTests.length}):` : ':'}
                  </span>
                  {rxTests.length > 0 ? (
                    <ul className="list-disc list-inside space-y-1 text-slate-700 pl-1">
                      {rxTests.map((t, idx) => {
                        const name = typeof t === 'string' ? t : t.name;
                        const source = typeof t === 'string' ? 'in-house' : t.source;
                        const notes = typeof t === 'string' ? '' : t.notes;
                        return (
                          <li key={idx} className="leading-relaxed">
                            <span className="font-semibold text-slate-900">{name}</span>
                            {source === 'others' && (
                              <span className="text-[10.5px] text-amber-800 ml-2 font-medium italic">
                                (Outside Referral)
                              </span>
                            )}
                            {notes && (
                              <span className="text-slate-500 text-[11px] ml-1.5 italic">
                                - {notes}
                              </span>
                            )}
                          </li>
                        );
                      })}
                    </ul>
                  ) : (
                    <div className="text-slate-400 italic pl-1">None</div>
                  )}
                </div>

                <div className="space-y-1">
                  <span className="font-bold text-slate-900 block text-xs">
                    Special Clinical Advice:
                  </span>
                  {rxAdvice.length > 0 ? (
                    <ul className="list-disc list-inside space-y-1 text-slate-700 pl-1">
                      {rxAdvice.map((adv, idx) => (
                        <li key={idx} className="leading-relaxed">
                          {adv}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <div className="text-slate-400 italic pl-1">Standard clinical follow-up</div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Page 1 Bottom Section */}
          {isMultiPage ? (
            /* Multi-Page Mode: Page 1 Continuation Alert Footer */
            <div className="space-y-3 pt-6">
              <div className="border-t border-dashed border-slate-300 pt-3 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#0c2e4b] animate-pulse" />
                  <span className="font-semibold text-slate-700">
                    Continued on Page 2 for Remaining Medications, Investigations, Advice &amp; Doctor Sign-off →
                  </span>
                </div>
                <span className="font-bold text-slate-800 bg-slate-100 px-2.5 py-0.5 rounded text-[11px] border border-slate-200">
                  Page 1 of 2
                </span>
              </div>
              <div className="pt-2 border-t border-slate-100 text-[10px] text-slate-400 flex items-center justify-between">
                <span>Green Hospital of Bangladesh • 24/7 Helpline: 10666 • www.greenhospital.local</span>
                <span>Page 1 of 2 (A4 Standard)</span>
              </div>
            </div>
          ) : (
            /* Single Page Mode: Full Doctor Sign-off & Hospital Stamp */
            <div className="avoid-print-break space-y-3 pt-4">
              <div className="pt-4 border-t border-slate-200 flex flex-wrap items-end justify-between gap-4">
                <div className="space-y-1">
                  <div className="text-xs">
                    <span className="text-slate-500 font-medium">Next Consultation Review: </span>
                    <span className="font-bold text-slate-900">{selectedRx.followUp}</span>
                  </div>
                  <div className="text-[10px] text-slate-400 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                    <span>System Generated Digital E-Prescription • Valid at all accredited hospital pharmacies</span>
                  </div>
                </div>

                <div className="text-right space-y-1">
                  {/* Minimal Authentic Doctor Signature Stroke */}
                  <div className="flex justify-end mb-0.5">
                    <svg
                      className="w-24 h-6 text-slate-800"
                      viewBox="0 0 140 32"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                    >
                      <path d="M 8 22 C 24 8, 36 28, 48 12 C 60 -2, 64 26, 88 14 C 100 8, 110 20, 132 12" />
                    </svg>
                  </div>

                  {/* Minimal Thin Signature Line & Credentials */}
                  <div className="border-t border-slate-300 w-36 ml-auto pt-1">
                    <div className="font-bold text-slate-900 text-xs leading-tight">
                      {CURRENT_DOCTOR.name}
                    </div>
                    <div className="text-[10px] text-slate-500 font-medium mt-0.5">
                      Consultant Physician • Cardiology
                    </div>
                    <div className="text-[9.5px] text-slate-400 mt-0.5 flex items-center justify-end gap-1">
                      <CheckCircle2 className="w-2.5 h-2.5 text-emerald-600 inline shrink-0" />
                      <span>BMDC: {CURRENT_DOCTOR.bmdcReg} • Verified</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 text-[10px] text-slate-400 flex items-center justify-between">
                <span>Green Hospital of Bangladesh • 24/7 Helpline: 10666 • www.greenhospital.local</span>
                <span>Page 1 of 1 (A4 Standard)</span>
              </div>
            </div>
          )}
        </div>

        {/* ========================================================= */}
        {/* A4 PAPER SHEET 2 (Multi-page Flow when content overflows)  */}
        {/* ========================================================= */}
        {isMultiPage && (
          <>
            {/* Visual Screen Page Break Indicator (Hidden when Printing) */}
            <div className="flex items-center justify-center gap-3 my-4 print:hidden">
              <div className="h-px bg-slate-300 flex-1 max-w-[200px]" />
              <div className="text-[11px] font-bold text-slate-600 bg-slate-100 px-3.5 py-1.5 rounded-full border border-slate-200 flex items-center gap-2 shadow-2xs">
                <FileText className="w-3.5 h-3.5 text-[#0c2e4b]" />
                <span>Page Break • Next Page: Page 2 of 2 (A4 Standard - 210 × 297 mm)</span>
              </div>
              <div className="h-px bg-slate-300 flex-1 max-w-[200px]" />
            </div>

            {/* Page 2 Sheet */}
            <div className="a4-print-sheet w-full max-w-[794px] min-h-[1123px] bg-white border border-slate-300/80 rounded-[4px] p-8 sm:p-11 shadow-sm flex flex-col justify-between text-xs print:p-0 print:border-none print:shadow-none print:max-w-full">
              <div className="space-y-5">
                {/* 1) Page 2 Official Continuation Header */}
                <div className="pb-3 border-b border-slate-300 flex items-start justify-between">
                  <div>
                    <div className="text-lg font-black text-[#0c2e4b] tracking-tight flex items-center gap-2">
                      <span>GreenHospital</span>
                      <span className="text-[10px] font-bold text-cyan-800 bg-cyan-50 border border-cyan-200 px-2 py-0.5 rounded uppercase tracking-wider">
                        Prescription Continuation
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-600 font-semibold mt-0.5">
                      {CURRENT_DOCTOR.name} • {CURRENT_DOCTOR.designation} • BMDC: {CURRENT_DOCTOR.bmdcReg}
                    </div>
                    <div className="text-[10.5px] text-slate-500">
                      {CURRENT_DOCTOR.department} • Dhaka Central Healthcare Wing
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-xs font-bold text-slate-900">
                      Patient: <span className="text-slate-800 font-extrabold">{selectedRx.patientName}</span>
                    </div>
                    <div className="text-[11px] text-slate-600 font-medium mt-0.5">
                      UHID: <span className="font-semibold text-slate-800">{selectedRx.uhid}</span> • Age: {selectedRx.age} Y • {selectedRx.gender}
                    </div>
                    <div className="text-[10.5px] text-slate-500 mt-0.5 flex items-center justify-end gap-1.5">
                      <span>Date: {selectedRx.date}</span>
                      <span>•</span>
                      <span className="bg-[#0c2e4b] text-white font-bold text-[10px] px-2 py-0.5 rounded">
                        Page 2 of 2
                      </span>
                    </div>
                  </div>
                </div>

                {/* 2) Page 2 Remaining Medications (Items 6+) */}
                {page2Medicines.length > 0 && (
                  <div className="space-y-3 pt-1">
                    <div className="flex items-center gap-2 border-b border-slate-200 pb-1">
                      <span className="text-2xl font-serif font-black text-[#0c2e4b]">℞</span>
                      <span className="text-xs font-bold text-slate-800">
                        Prescribed Medications (Continued from Page 1)
                      </span>
                    </div>

                    <div className="space-y-2.5">
                      {page2Medicines.map((med, idx) => (
                        <div
                          key={idx}
                          className="avoid-print-break flex flex-wrap items-center justify-between gap-x-4 gap-y-1 border-b border-slate-100 pb-2.5"
                        >
                          <div className="min-w-0 flex-1">
                            <div className="font-bold text-slate-900 text-sm">
                              {5 + idx + 1}. {med.medicineName}{' '}
                              <span className="font-normal text-slate-500 text-xs">({med.dosage})</span>
                            </div>
                            <div className="text-xs text-slate-600 font-medium pl-3.5 mt-0.5 flex flex-wrap items-center gap-x-2">
                              <span className="font-bold text-[#0c2e4b] text-[13px] tracking-wide">
                                {med.frequency}
                              </span>
                              <span className="text-slate-300">•</span>
                              <span className="italic text-slate-700">{med.instruction}</span>
                            </div>
                          </div>

                          <div className="text-right ml-auto self-center shrink-0 text-xs">
                            <span className="font-bold text-[#0c2e4b] text-xs">
                              {med.duration}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 3) Diagnostic Investigations & Special Clinical Advice on Page 2 */}
                {(rxTests.length > 0 || rxAdvice.length > 0) && (
                  <div className="avoid-print-break grid grid-cols-1 sm:grid-cols-2 gap-6 pt-3 border-t border-slate-200 text-xs items-start">
                    <div className="space-y-1.5">
                      <span className="font-bold text-slate-900 block text-xs">
                        Diagnostic Investigations Advised
                        {rxTests.length > 0 ? ` (Total: ${rxTests.length}):` : ':'}
                      </span>
                      {rxTests.length > 0 ? (
                        <ul className="list-disc list-inside space-y-1 text-slate-700 pl-1">
                          {rxTests.map((t, idx) => {
                            const name = typeof t === 'string' ? t : t.name;
                            const source = typeof t === 'string' ? 'in-house' : t.source;
                            const notes = typeof t === 'string' ? '' : t.notes;
                            return (
                              <li key={idx} className="leading-relaxed">
                                <span className="font-semibold text-slate-900">{name}</span>
                                {source === 'others' && (
                                  <span className="text-[10.5px] text-amber-800 ml-2 font-medium italic">
                                    (Outside Referral)
                                  </span>
                                )}
                                {notes && (
                                  <span className="text-slate-500 text-[11px] ml-1.5 italic">
                                    - {notes}
                                  </span>
                                )}
                              </li>
                            );
                          })}
                        </ul>
                      ) : (
                        <div className="text-slate-400 italic pl-1">None</div>
                      )}
                    </div>

                    <div className="space-y-1.5">
                      <span className="font-bold text-slate-900 block text-xs">
                        Special Clinical Advice:
                      </span>
                      {rxAdvice.length > 0 ? (
                        <ul className="list-disc list-inside space-y-1 text-slate-700 pl-1">
                          {rxAdvice.map((adv, idx) => (
                            <li key={idx} className="leading-relaxed">
                              {adv}
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <div className="text-slate-400 italic pl-1">Standard clinical follow-up</div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* 4) Doctor Signature block & Review date on Page 2 */}
              <div className="avoid-print-break space-y-3 pt-6">
                <div className="pt-4 border-t border-slate-200 flex flex-wrap items-end justify-between gap-4">
                  <div className="space-y-1">
                    <div className="text-xs">
                      <span className="text-slate-500 font-medium">Next Consultation Review: </span>
                      <span className="font-bold text-slate-900">{selectedRx.followUp}</span>
                    </div>
                    <div className="text-[10px] text-slate-400 flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                      <span>System Generated Digital E-Prescription • Valid at all accredited hospital pharmacies</span>
                    </div>
                  </div>

                  <div className="text-right space-y-1">
                    {/* Minimal Authentic Doctor Signature Stroke */}
                    <div className="flex justify-end mb-0.5">
                      <svg
                        className="w-24 h-6 text-slate-800"
                        viewBox="0 0 140 32"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.6"
                        strokeLinecap="round"
                      >
                        <path d="M 8 22 C 24 8, 36 28, 48 12 C 60 -2, 64 26, 88 14 C 100 8, 110 20, 132 12" />
                      </svg>
                    </div>

                    {/* Minimal Thin Signature Line & Credentials */}
                    <div className="border-t border-slate-300 w-36 ml-auto pt-1">
                      <div className="font-bold text-slate-900 text-xs leading-tight">
                        {CURRENT_DOCTOR.name}
                      </div>
                      <div className="text-[10px] text-slate-500 font-medium mt-0.5">
                        Consultant Physician • Cardiology
                      </div>
                      <div className="text-[9.5px] text-slate-400 mt-0.5 flex items-center justify-end gap-1">
                        <CheckCircle2 className="w-2.5 h-2.5 text-emerald-600 inline shrink-0" />
                        <span>BMDC: {CURRENT_DOCTOR.bmdcReg} • Verified</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 text-[10px] text-slate-400 flex items-center justify-between">
                  <span>Green Hospital of Bangladesh • 24/7 Helpline: 10666 • www.greenhospital.local</span>
                  <span>Page 2 of 2 (A4 Standard)</span>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    );
  }


  // -------------------------------------------------------------
  // VIEW MODE 2: FULL DEDICATED COMPACT WORKSTATION FOR PRESCRIPTIONS
  // -------------------------------------------------------------
  if (viewMode === 'create') {
    return (
      <div className="space-y-3 font-['Plus_Jakarta_Sans',sans-serif]">
        {/* Top Patient Demographics Bar (Compact Horizontal Workstation Header) */}
        <div className="bg-white p-3 rounded-[4px] border border-slate-200/90 shadow-xs flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            {/* Patient Avatar Icon */}
            <div className="w-10 h-10 rounded-[4px] bg-slate-100 border border-slate-200 flex items-center justify-center shrink-0">
              <User className="w-5 h-5 text-slate-600" />
            </div>

            {/* Patient Identity */}
            <div className="min-w-0">
              <div className="text-sm font-bold text-slate-900 truncate">
                {rxPatientName}
              </div>
              <div className="text-[11px] text-slate-500 font-medium">
                UHID: <span className="font-semibold text-slate-700">{rxUhid}</span> | MRN: GLH-0009823
              </div>
            </div>
          </div>

          <div className="hidden md:block h-8 w-px bg-slate-200" />

          {/* Appointment Shift & Time */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-[4px] bg-slate-50 border border-slate-200 flex items-center justify-center shrink-0">
              <Calendar className="w-4 h-4 text-slate-600" />
            </div>
            <div>
              <div className="text-xs font-semibold text-slate-800">
                20 Nov 2026, 04:00 PM
              </div>
              <div className="text-[11px] text-slate-500 font-medium">
                (OPD Consultation)
              </div>
            </div>
          </div>

          <div className="hidden md:block h-8 w-px bg-slate-200" />

          {/* Age & Gender */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-[4px] bg-slate-50 border border-slate-200 flex items-center justify-center shrink-0">
              <UserCheck className="w-4 h-4 text-slate-600" />
            </div>
            <div>
              <div className="text-xs font-semibold text-slate-800">
                {rxAge} Years
              </div>
              <div className="text-[11px] text-slate-500 font-medium">
                {rxGender}
              </div>
            </div>
          </div>

          <div className="hidden md:block h-8 w-px bg-slate-200" />

          {/* Department & Visit Type */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-[4px] bg-slate-50 border border-slate-200 flex items-center justify-center shrink-0">
              <Heart className="w-4 h-4 text-slate-600" />
            </div>
            <div>
              <div className="text-xs font-semibold text-slate-800">
                Cardiology
              </div>
              <div className="text-[11px] text-slate-500 font-medium">
                OPD Clinical Visit
              </div>
            </div>
          </div>

          {/* Patient Info Action Button */}
          <button
            type="button"
            onClick={() => setShowPatientDetailsModal(true)}
            className="w-8 h-8 rounded-[4px] border border-slate-300 bg-white hover:bg-slate-50 text-slate-600 hover:text-slate-900 flex items-center justify-center transition-colors cursor-pointer ml-auto"
            title="View full patient clinical file and demographics"
          >
            <Info className="w-4 h-4" />
          </button>
        </div>

        {/* Split Screen 2-Column Workstation Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-3.5 items-start">
          {/* ========================================================= */}
          {/* LEFT COLUMN (~60%): Clinical Inputs, Rx Table, Tests     */}
          {/* ========================================================= */}
          <div className="lg:col-span-7 space-y-3">
            {/* Prescription Mode Badge */}
            <div className="flex items-center gap-2">
              <div className="px-3.5 py-1.5 rounded-[4px] text-xs font-bold flex items-center gap-2 bg-[#0c2e4b] text-white shadow-xs">
                <Monitor className="w-4 h-4" />
                <span>Computer Prescription</span>
              </div>
            </div>

            {/* Clinical Information Card */}
            <div className="bg-white p-3 rounded-[4px] border border-slate-200/90 shadow-xs space-y-2.5">
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900">
                <FileText className="w-4 h-4 text-slate-600" />
                <span>Clinical Information</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                {/* Chief Complaints Input */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Chief Complaints *
                  </label>
                  <input
                    type="text"
                    value={rxChiefComplaints}
                    onChange={(e) => setRxChiefComplaints(e.target.value)}
                    placeholder="Chest tightness on exertion, intermittent palpitation."
                    className="w-full px-2.5 py-1.5 border border-slate-300 rounded-[3px] text-xs text-slate-800 focus:outline-none focus:border-[#0c2e4b] bg-white"
                  />
                </div>

                {/* Diagnosis with Token Pill & Dropdown */}
                <div className="relative">
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Diagnosis *
                  </label>
                  {rxDiagnosis ? (
                    <div className="flex items-center justify-between px-2.5 py-1 border border-slate-300 rounded-[3px] bg-white min-h-[31px]">
                      <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-[3px] bg-slate-100 text-slate-800 text-xs font-semibold border border-slate-200">
                        <span>{rxDiagnosis}</span>
                        <button
                          type="button"
                          onClick={() => setRxDiagnosis('')}
                          className="hover:text-rose-600 text-slate-400 cursor-pointer"
                          title="Clear diagnosis"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                      <button
                        type="button"
                        onClick={() => setShowDiagnosisDropdown(!showDiagnosisDropdown)}
                        className="text-slate-400 hover:text-slate-700 cursor-pointer p-0.5"
                      >
                        <ChevronDown className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ) : (
                    <div className="relative">
                      <input
                        type="text"
                        value={diagnosisInput}
                        onChange={(e) => {
                          setDiagnosisInput(e.target.value);
                          setShowDiagnosisDropdown(true);
                        }}
                        onFocus={() => setShowDiagnosisDropdown(true)}
                        placeholder="Type diagnosis or select below..."
                        className="w-full px-2.5 py-1.5 border border-slate-300 rounded-[3px] text-xs text-slate-800 focus:outline-none focus:border-[#0c2e4b] bg-white"
                      />
                      <button
                        type="button"
                        onClick={() => setShowDiagnosisDropdown(!showDiagnosisDropdown)}
                        className="absolute right-2 top-2 text-slate-400 hover:text-slate-700 cursor-pointer"
                      >
                        <ChevronDown className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}

                  {/* Dropdown options for diagnosis */}
                  {showDiagnosisDropdown && (
                    <div className="absolute left-0 right-0 top-full mt-1 bg-white border border-slate-200 rounded-[4px] shadow-lg z-20 max-h-48 overflow-y-auto py-1 text-xs">
                      {[
                        'Unstable Angina (I20.0)',
                        'Essential (Primary) Hypertension (I10)',
                        'Coronary Artery Disease (CAD) (I25.1)',
                        'Type 2 Diabetes Mellitus with HTN (E11.9)',
                        'Atrial Fibrillation (I48.0)',
                        'Congestive Heart Failure (I50.9)',
                        'Dyslipidemia / Hypercholesterolemia (E78.0)',
                        'Acute Bronchitis / Viral Infection (J20.9)',
                      ]
                        .filter(
                          (item) =>
                            !diagnosisInput ||
                            item.toLowerCase().includes(diagnosisInput.toLowerCase())
                        )
                        .map((diag) => (
                          <button
                            key={diag}
                            type="button"
                            onClick={() => {
                              setRxDiagnosis(diag);
                              setDiagnosisInput('');
                              setShowDiagnosisDropdown(false);
                            }}
                            className="w-full text-left px-3 py-1.5 hover:bg-slate-50 text-slate-800 font-medium flex items-center justify-between cursor-pointer"
                          >
                            <span>{diag}</span>
                            <span className="text-[10px] text-slate-400">ICD-10</span>
                          </button>
                        ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* History & Examination Collapsible Accordion */}
            <div className="bg-white rounded-[4px] border border-slate-200/90 shadow-xs overflow-hidden">
              <button
                type="button"
                onClick={() => setIsHistoryAccordionOpen(!isHistoryAccordionOpen)}
                className="w-full p-2.5 flex items-center justify-between text-left hover:bg-slate-50 transition-colors cursor-pointer bg-white"
              >
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900">
                  <Stethoscope className="w-4 h-4 text-slate-600" />
                  <span>History & Examination</span>
                  {rxAllergies && (
                    <span className="ml-2 px-1.5 py-0.5 rounded-[3px] bg-rose-50 text-rose-700 border border-rose-200 text-[10px] font-bold inline-flex items-center gap-1">
                      <AlertTriangle className="w-3 h-3 text-rose-600" />
                      <span>Allergies: {rxAllergies}</span>
                    </span>
                  )}
                </div>
                {isHistoryAccordionOpen ? (
                  <ChevronUp className="w-4 h-4 text-slate-500" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-slate-500" />
                )}
              </button>

              {isHistoryAccordionOpen && (
                <div className="p-3 border-t border-slate-200 space-y-3 bg-slate-50/40 text-xs">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">
                        Past Medical & Surgical History
                      </label>
                      <input
                        type="text"
                        value={rxPastHistory}
                        onChange={(e) => setRxPastHistory(e.target.value)}
                        placeholder="e.g. Hypertension (7 yrs), T2DM (4 yrs)"
                        className="w-full px-2.5 py-1.5 border border-slate-300 rounded-[3px] text-xs text-slate-800 bg-white focus:outline-none focus:border-[#0c2e4b]"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">
                        Known Drug Allergies
                      </label>
                      <input
                        type="text"
                        value={rxAllergies}
                        onChange={(e) => setRxAllergies(e.target.value)}
                        placeholder="e.g. Penicillin, Sulfa drugs"
                        className="w-full px-2.5 py-1.5 border border-slate-300 rounded-[3px] text-xs text-slate-800 bg-white focus:outline-none focus:border-[#0c2e4b]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      Systemic Physical Findings
                    </label>
                    <input
                      type="text"
                      value={rxClinicalFindings}
                      onChange={(e) => setRxClinicalFindings(e.target.value)}
                      placeholder="e.g. Chest clear bilaterally, S1+S2 regular, no murmur"
                      className="w-full px-2.5 py-1.5 border border-slate-300 rounded-[3px] text-xs text-slate-800 bg-white focus:outline-none focus:border-[#0c2e4b]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      HPI Clinical Case Study Narrative
                    </label>
                    <textarea
                      rows={2}
                      value={rxCaseStudy}
                      onChange={(e) => setRxCaseStudy(e.target.value)}
                      placeholder="Narrative clinical history of presenting complaints..."
                      className="w-full px-2.5 py-1.5 border border-slate-300 rounded-[3px] text-xs text-slate-800 bg-white focus:outline-none focus:border-[#0c2e4b]"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Vitals Card: 5 Inline Compact Boxes in a Single Row */}
            <div className="bg-white p-3 rounded-[4px] border border-slate-200/90 shadow-xs space-y-2">
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900">
                <Activity className="w-4 h-4 text-slate-600" />
                <span>Vitals</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-0.5 text-center">
                    BP (mmHg)
                  </label>
                  <input
                    type="text"
                    value={rxBp}
                    onChange={(e) => setRxBp(e.target.value)}
                    placeholder="120/80"
                    className="w-full px-2 py-1 border border-slate-300 rounded-[3px] text-xs text-center font-bold text-slate-800 bg-white focus:outline-none focus:border-[#0c2e4b]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-0.5 text-center">
                    Pulse (bpm)
                  </label>
                  <input
                    type="text"
                    value={rxPulse}
                    onChange={(e) => setRxPulse(e.target.value)}
                    placeholder="76"
                    className="w-full px-2 py-1 border border-slate-300 rounded-[3px] text-xs text-center font-bold text-slate-800 bg-white focus:outline-none focus:border-[#0c2e4b]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-0.5 text-center">
                    Temp (°C)
                  </label>
                  <input
                    type="text"
                    value={rxTemp}
                    onChange={(e) => setRxTemp(e.target.value)}
                    placeholder="36.8"
                    className="w-full px-2 py-1 border border-slate-300 rounded-[3px] text-xs text-center font-bold text-slate-800 bg-white focus:outline-none focus:border-[#0c2e4b]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-0.5 text-center">
                    SpO₂ (%)
                  </label>
                  <input
                    type="text"
                    value={rxSpo2}
                    onChange={(e) => setRxSpo2(e.target.value)}
                    placeholder="98"
                    className="w-full px-2 py-1 border border-slate-300 rounded-[3px] text-xs text-center font-bold text-slate-800 bg-white focus:outline-none focus:border-[#0c2e4b]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-0.5 text-center">
                    Weight (kg)
                  </label>
                  <input
                    type="text"
                    value={rxWeight}
                    onChange={(e) => setRxWeight(e.target.value)}
                    placeholder="68"
                    className="w-full px-2 py-1 border border-slate-300 rounded-[3px] text-xs text-center font-bold text-slate-800 bg-white focus:outline-none focus:border-[#0c2e4b]"
                  />
                </div>
              </div>
            </div>

            {/* Prescribed Medications (Rx) Card */}
            {rxMode === 'computer' ? (
              <div className="bg-white p-3 rounded-[4px] border border-slate-200/90 shadow-xs space-y-2.5">
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900">
                  <ClipboardList className="w-4 h-4 text-slate-600" />
                  <span>Prescribed Medications (Rx)</span>
                </div>

                <div className="overflow-x-auto border border-slate-200 rounded-[3px]">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead className="bg-slate-50 text-[11px] font-bold text-slate-700 border-b border-slate-200">
                      <tr>
                        <th className="py-1.5 px-2 w-8 text-center">#</th>
                        <th className="py-1.5 px-2 min-w-[170px]">Medicine</th>
                        <th className="py-1.5 px-2 w-20">Dose</th>
                        <th className="py-1.5 px-2 w-20">Route</th>
                        <th className="py-1.5 px-2 min-w-[130px]">Frequency</th>
                        <th className="py-1.5 px-2 w-24">Duration</th>
                        <th className="py-1.5 px-2 min-w-[130px]">Instructions</th>
                        <th className="py-1.5 px-2 w-8 text-center"></th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {medicines.map((m, idx) => (
                        <tr key={idx} className="hover:bg-slate-50/60">
                          <td className="py-1.5 px-2 text-center font-bold text-slate-500">
                            {idx + 1}
                          </td>
                          <td className="py-1.5 px-2">
                            <input
                              type="text"
                              value={m.medicineName}
                              onChange={(e) =>
                                handleUpdateMedicineRow(idx, 'medicineName', e.target.value)
                              }
                              placeholder="e.g. Tab. Aspirin (Ecosprin)"
                              className="w-full px-2 py-1 border border-slate-300 rounded-[2px] text-xs text-slate-900 font-medium focus:outline-none focus:border-[#0c2e4b] bg-white"
                            />
                          </td>
                          <td className="py-1.5 px-2">
                            <select
                              value={m.dosage}
                              onChange={(e) =>
                                handleUpdateMedicineRow(idx, 'dosage', e.target.value)
                              }
                              className="w-full px-1.5 py-1 border border-slate-300 rounded-[2px] text-xs text-slate-800 bg-white focus:outline-none focus:border-[#0c2e4b]"
                            >
                              <option value="75 mg">75 mg</option>
                              <option value="20 mg">20 mg</option>
                              <option value="10 mg">10 mg</option>
                              <option value="5 mg">5 mg</option>
                              <option value="2.5 mg">2.5 mg</option>
                              <option value="50 mg">50 mg</option>
                              <option value="100 mg">100 mg</option>
                              <option value="500 mg">500 mg</option>
                              <option value="1 gm">1 gm</option>
                            </select>
                          </td>
                          <td className="py-1.5 px-2">
                            <select
                              value={m.route || 'Oral'}
                              onChange={(e) =>
                                handleUpdateMedicineRow(idx, 'route', e.target.value)
                              }
                              className="w-full px-1.5 py-1 border border-slate-300 rounded-[2px] text-xs text-slate-800 bg-white focus:outline-none focus:border-[#0c2e4b]"
                            >
                              <option value="Oral">Oral</option>
                              <option value="IV">IV</option>
                              <option value="IM">IM</option>
                              <option value="Sublingual">Sublingual</option>
                              <option value="Topical">Topical</option>
                              <option value="Inhalation">Inhalation</option>
                            </select>
                          </td>
                          <td className="py-1.5 px-2">
                            <select
                              value={m.frequency}
                              onChange={(e) =>
                                handleUpdateMedicineRow(idx, 'frequency', e.target.value)
                              }
                              className="w-full px-1.5 py-1 border border-slate-300 rounded-[2px] text-xs text-slate-800 bg-white focus:outline-none focus:border-[#0c2e4b]"
                            >
                              <option value="1-0-0 (Morning)">1-0-0 (Morning)</option>
                              <option value="0-0-1 (Night)">0-0-1 (Night)</option>
                              <option value="1-0-1 (Twice)">1-0-1 (Twice)</option>
                              <option value="1-1-1 (Thrice)">1-1-1 (Thrice)</option>
                              <option value="1-1-1-1 (Four times)">1-1-1-1 (Four times)</option>
                              <option value="1-0-0-1 (BD)">1-0-0-1 (BD)</option>
                              <option value="0-1-0 (Afternoon)">0-1-0 (Afternoon)</option>
                              <option value="As needed (PRN)">As needed (PRN)</option>
                            </select>
                          </td>
                          <td className="py-1.5 px-2">
                            <select
                              value={m.duration}
                              onChange={(e) =>
                                handleUpdateMedicineRow(idx, 'duration', e.target.value)
                              }
                              className="w-full px-1.5 py-1 border border-slate-300 rounded-[2px] text-xs text-slate-800 bg-white focus:outline-none focus:border-[#0c2e4b]"
                            >
                              <option value="5 Days">5 Days</option>
                              <option value="7 Days">7 Days</option>
                              <option value="10 Days">10 Days</option>
                              <option value="14 Days">14 Days</option>
                              <option value="30 Days">30 Days</option>
                              <option value="60 Days">60 Days</option>
                              <option value="90 Days">90 Days</option>
                              <option value="Continue">Continue</option>
                            </select>
                          </td>
                          <td className="py-1.5 px-2">
                            <input
                              type="text"
                              value={m.instruction}
                              onChange={(e) =>
                                handleUpdateMedicineRow(idx, 'instruction', e.target.value)
                              }
                              placeholder="After breakfast"
                              className="w-full px-2 py-1 border border-slate-300 rounded-[2px] text-xs text-slate-800 focus:outline-none focus:border-[#0c2e4b] bg-white"
                            />
                          </td>
                          <td className="py-1.5 px-2 text-center">
                            <button
                              type="button"
                              onClick={() => handleRemoveMedicineRow(idx)}
                              className="p-1 rounded text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                              title="Delete medicine row"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <button
                  type="button"
                  onClick={handleAddMedicineRow}
                  className="px-3 py-1 rounded-[3px] border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold inline-flex items-center gap-1.5 cursor-pointer shadow-xs transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Medicine</span>
                </button>
              </div>
            ) : (
              /* Handwritten Pad Note Box */
              <div className="bg-white p-3 rounded-[4px] border border-slate-200/90 shadow-xs space-y-2">
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900">
                  <PenTool className="w-4 h-4 text-slate-600" />
                  <span>Doctor&apos;s Initial Assessment &amp; Handwriting Note</span>
                </div>
                <textarea
                  rows={3}
                  value={rxNotes}
                  onChange={(e) => setRxNotes(e.target.value)}
                  placeholder="Enter initial clinical assessment notes for physical pad..."
                  className="w-full px-2.5 py-1.5 border border-slate-300 rounded-[3px] text-xs text-slate-800 focus:outline-none focus:border-[#0c2e4b] bg-white"
                />
              </div>
            )}

            {/* Investigations and Advice Columns Side-by-Side */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
              {/* Investigations Box with Token Tags & Live Autocomplete */}
              <div className="bg-white p-3 rounded-[4px] border border-slate-200/90 shadow-xs space-y-2">
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900">
                  <FlaskConical className="w-4 h-4 text-slate-600" />
                  <span>Investigations</span>
                </div>

                {/* Token Tags Container */}
                <div className="p-2 border border-slate-300 rounded-[3px] min-h-[46px] flex flex-wrap gap-1.5 items-center bg-white">
                  {prescribedTests.map((t) => (
                    <span
                      key={t.id}
                      className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-[3px] text-xs font-semibold border ${t.source === 'in-house'
                        ? 'bg-slate-100 text-slate-800 border-slate-200'
                        : 'bg-amber-50 text-amber-900 border-amber-200'
                        }`}
                    >
                      <button
                        type="button"
                        onClick={() => handleToggleTestSource(t.id)}
                        className="hover:underline cursor-pointer"
                        title="Click to toggle between In-House Lab and Outside Referral"
                      >
                        {t.name}
                      </button>
                      <button
                        type="button"
                        onClick={() => handleRemovePrescribedTest(t.id)}
                        className="text-slate-400 hover:text-rose-600 cursor-pointer"
                        title="Remove test"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                  {prescribedTests.length === 0 && (
                    <span className="text-slate-400 text-xs italic">
                      No tests added yet
                    </span>
                  )}
                </div>

                {/* Live Autocomplete Search Input */}
                <div className="relative" ref={testDropdownRef}>
                  <div className="relative">
                    <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                    <input
                      type="text"
                      value={testSearchInput}
                      onChange={(e) => {
                        setTestSearchInput(e.target.value);
                        setShowTestDropdown(true);
                      }}
                      onFocus={() => setShowTestDropdown(true)}
                      placeholder="Type test name to search in-house or add outside..."
                      className="w-full pl-8 pr-3 py-1.5 border border-slate-300 rounded-[3px] text-xs text-slate-800 focus:outline-none focus:border-[#0c2e4b] bg-white"
                    />
                  </div>

                  {/* Autocomplete Dropdown List */}
                  {showTestDropdown && (
                    <div className="absolute left-0 right-0 top-full mt-1 bg-white border border-slate-200 rounded-[4px] shadow-lg z-30 max-h-56 overflow-y-auto py-1 text-xs">
                      {matchingHospitalTests.length > 0 && (
                        <div>
                          <div className="px-2.5 py-1 text-[10px] font-bold text-slate-400 tracking-wide bg-slate-50 border-b border-slate-100">
                            Hospital In-House Lab Catalog
                          </div>
                          {matchingHospitalTests.map((t) => (
                            <button
                              key={t.code}
                              type="button"
                              onClick={() => handleAddCatalogTest(t)}
                              className="w-full text-left px-3 py-1.5 hover:bg-slate-50 text-slate-800 flex items-center justify-between cursor-pointer border-b border-slate-50 last:border-0"
                            >
                              <div>
                                <span className="font-semibold">{t.name}</span>
                                <span className="text-[10px] text-slate-400 ml-1.5">
                                  ({t.category})
                                </span>
                              </div>
                              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                                In-House Lab
                              </span>
                            </button>
                          ))}
                        </div>
                      )}

                      {/* Option to Add Custom External Test */}
                      {testSearchInput.trim() && (
                        <div className="border-t border-slate-100 pt-1">
                          <button
                            type="button"
                            onClick={() => handleAddCustomTest('others')}
                            className="w-full text-left px-3 py-1.5 hover:bg-amber-50 text-amber-900 flex items-center justify-between cursor-pointer font-medium"
                          >
                            <span>
                              Add &quot;{testSearchInput.trim()}&quot; as Outside Referral Test
                            </span>
                            <span className="text-[10px] font-bold text-amber-800 bg-amber-100 px-1.5 py-0.5 rounded border border-amber-300">
                              Others (External)
                            </span>
                          </button>
                          <button
                            type="button"
                            onClick={() => handleAddCustomTest('in-house')}
                            className="w-full text-left px-3 py-1.5 hover:bg-emerald-50 text-emerald-900 flex items-center justify-between cursor-pointer font-medium"
                          >
                            <span>
                              Add &quot;{testSearchInput.trim()}&quot; as In-House Lab Test
                            </span>
                            <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-1.5 py-0.5 rounded border border-emerald-300">
                              In-House Lab
                            </span>
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Advice & Instructions Box */}
              <div className="bg-white p-3 rounded-[4px] border border-slate-200/90 shadow-xs space-y-2">
                <div className="text-xs font-bold text-slate-900">
                  Advice &amp; Instructions
                </div>
                <textarea
                  rows={4}
                  value={adviceText}
                  onChange={(e) => setAdviceText(e.target.value)}
                  placeholder="• Low salt, low fat diet.
• Regular walking (≥ 30 minutes daily).
• Avoid smoking and alcohol."
                  className="w-full p-2 border border-slate-300 rounded-[3px] text-xs text-slate-800 leading-relaxed font-sans focus:outline-none focus:border-[#0c2e4b] bg-white resize-y"
                />
              </div>
            </div>

            {/* Follow-up Row: 2 Columns */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-2.5">
              <div className="md:col-span-5">
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Follow-up
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={followUp}
                    onChange={(e) => setFollowUp(e.target.value)}
                    placeholder="27 Nov 2026"
                    className="w-full pl-8 pr-3 py-1.5 border border-slate-300 rounded-[3px] text-xs text-slate-800 focus:outline-none focus:border-[#0c2e4b] bg-white"
                  />
                  <Calendar className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                </div>
              </div>
              <div className="md:col-span-7">
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Follow-up Instructions
                </label>
                <input
                  type="text"
                  value={followUpInstructions}
                  onChange={(e) => setFollowUpInstructions(e.target.value)}
                  placeholder="Review with reports and BP control."
                  className="w-full px-3 py-1.5 border border-slate-300 rounded-[3px] text-xs text-slate-800 focus:outline-none focus:border-[#0c2e4b] bg-white"
                />
              </div>
            </div>
          </div>

          {/* ========================================================= */}
          {/* RIGHT COLUMN (~40%): Live Preview & Previous Prescriptions */}
          {/* ========================================================= */}
          <div className="lg:col-span-5 space-y-2.5 lg:sticky lg:top-3">
            {/* Top Switcher Tabs */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setPreviewTab('preview')}
                className={`px-3.5 py-1.5 rounded-[4px] text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-colors ${previewTab === 'preview'
                  ? 'bg-[#0c2e4b] text-white shadow-xs'
                  : 'bg-white text-slate-700 border border-slate-300 hover:bg-slate-50'
                  }`}
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Prescription Preview</span>
              </button>

              <button
                type="button"
                onClick={() => setPreviewTab('history')}
                className={`px-3.5 py-1.5 rounded-[4px] text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-colors ${previewTab === 'history'
                  ? 'bg-[#0c2e4b] text-white shadow-xs'
                  : 'bg-white text-slate-700 border border-slate-300 hover:bg-slate-50'
                  }`}
              >
                <Clock className="w-3.5 h-3.5" />
                <span>Previous Prescriptions</span>
              </button>
            </div>

            {previewTab === 'preview' ? (() => {
              const activeMedicines = medicines.filter((m) => m.medicineName.trim().length > 0);
              const adviceList = adviceText.split('\n').filter((l) => l.trim().length > 0);
              const isCreateMultiPage =
                activeMedicines.length > 5 ||
                (activeMedicines.length > 4 && prescribedTests.length + adviceList.length > 5) ||
                prescribedTests.length + adviceList.length > 8;

              const createPage1Meds = isCreateMultiPage ? activeMedicines.slice(0, 5) : activeMedicines;
              const createPage2Meds = isCreateMultiPage ? activeMedicines.slice(5) : [];

              return (
                <>
                  <div
                    className="space-y-4"
                    style={{
                      transform: `scale(${previewZoom / 100})`,
                      transformOrigin: 'top center',
                    }}
                  >
                    {/* ========================================================= */}
                    {/* A4 PREVIEW SHEET 1 (Standard A4 Dimensions)               */}
                    {/* ========================================================= */}
                    <div className="a4-print-sheet bg-white rounded-[4px] border border-slate-300 shadow-md p-6 text-slate-800 text-xs leading-snug relative min-h-[950px] flex flex-col justify-between print:min-h-0 print:border-none print:shadow-none print:p-0">
                      <div className="space-y-4">
                        {/* 1) Doctor & Hospital Brand Header */}
                        <div className="flex items-start justify-between pb-3">
                          <div>
                            <h1 className="text-xl font-extrabold text-slate-900 leading-tight">
                              {CURRENT_DOCTOR.name}
                            </h1>
                            <div className="text-xs text-[#0c2e4b] font-bold mt-0.5">
                              {CURRENT_DOCTOR.qualification}
                            </div>
                            <div className="text-[11px] text-slate-600 font-medium mt-0.5">
                              {CURRENT_DOCTOR.designation} • {CURRENT_DOCTOR.department}
                            </div>
                            <div className="text-[11px] text-slate-500 mt-0.5">
                              BMDC Reg: <span className="font-semibold text-slate-800">{CURRENT_DOCTOR.bmdcReg}</span> • {CURRENT_DOCTOR.room}
                            </div>
                          </div>

                          <div className="text-right">
                            <div className="text-xl font-black text-[#0c2e4b] tracking-tight">
                              GreenHospital
                            </div>
                            <div className="text-[11px] font-semibold text-slate-700 mt-0.5">
                              Dhaka Central Healthcare Wing
                            </div>
                            <div className="text-[10px] text-slate-500 mt-0.5">
                              Emergency: 10666 • www.greenhospital.local
                            </div>
                          </div>
                        </div>

                        {/* 2) Patient Demographics & Vitals Strip (Horizontal with border-y) */}
                        <div className="border-y border-slate-300 py-2.5 my-1 text-xs space-y-1.5">
                          <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1 text-slate-900">
                            <div>
                              <span className="font-bold text-slate-900">Patient Name: </span>
                              <span className="font-semibold text-slate-800">{rxPatientName}</span>
                            </div>
                            <div>
                              <span className="font-bold text-slate-900">Gender: </span>
                              <span className="font-semibold text-slate-800">{rxGender}</span>
                            </div>
                            <div>
                              <span className="font-bold text-slate-900">Age: </span>
                              <span className="font-semibold text-slate-800">{rxAge} Y</span>
                            </div>
                            <div>
                              <span className="font-bold text-slate-900">Weight: </span>
                              <span className="font-semibold text-slate-800">{rxWeight ? `${rxWeight} kg` : '68 kg'}</span>
                            </div>
                            <div>
                              <span className="font-bold text-slate-900">UHID: </span>
                              <span className="font-semibold text-slate-800">{rxUhid}</span>
                            </div>
                          </div>

                          <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1 text-slate-900">
                            <div>
                              <span className="font-bold text-slate-900">Date: </span>
                              <span className="font-semibold text-slate-800">20 Nov 2026</span>
                            </div>
                            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-slate-600">
                              <span>
                                <strong className="text-slate-800">Blood Pressure:</strong>{' '}
                                {rxBp ? `${rxBp} mmHg` : '120/80 mmHg'}
                              </span>
                              <span>•</span>
                              <span>
                                <strong className="text-slate-800">Pulse Rate:</strong>{' '}
                                {rxPulse ? `${rxPulse} bpm` : '76 bpm'}
                              </span>
                              <span>•</span>
                              <span>
                                <strong className="text-slate-800">Body Temp:</strong>{' '}
                                {rxTemp ? `${rxTemp} °F` : '98.4 °F'}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* 3) Main Clinical Middle Body: Two Column Split */}
                        <div className="grid grid-cols-12 gap-5 min-h-[260px] items-start pt-2">
                          {/* Left Column (~30%): Provisional Diagnosis & Complaints */}
                          <div className="col-span-12 md:col-span-4 pr-3 border-r border-slate-200 space-y-3">
                            <div>
                              <span className="text-xs font-semibold text-slate-500 block mb-0.5">
                                Provisional Diagnosis:
                              </span>
                              <div className="text-sm font-bold text-slate-900 leading-snug">
                                {rxDiagnosis || 'Unstable Angina, Essential HTN'}
                              </div>
                            </div>

                            {rxChiefComplaints && (
                              <div className="text-xs pt-1">
                                <span className="font-semibold text-slate-500 block mb-0.5">
                                  Chief Complaints:
                                </span>
                                <div className="text-slate-700 leading-relaxed text-[11px]">
                                  {rxChiefComplaints}
                                </div>
                              </div>
                            )}

                            {rxPastHistory && (
                              <div className="text-xs pt-1">
                                <span className="font-semibold text-slate-500 block mb-0.5">
                                  Past History:
                                </span>
                                <div className="text-slate-700 leading-relaxed text-[11px]">
                                  {rxPastHistory}
                                </div>
                              </div>
                            )}

                            {rxAllergies && (
                              <div className="text-xs pt-1">
                                <span className="font-semibold text-rose-600 block mb-0.5">
                                  Allergies:
                                </span>
                                <div className="text-rose-700 font-medium leading-relaxed text-[11px]">
                                  {rxAllergies}
                                </div>
                              </div>
                            )}
                          </div>

                          {/* Right Column (~70%): ℞ Prescribed Medications */}
                          <div className="col-span-12 md:col-span-8 pl-1 space-y-3">
                            <div className="flex items-center gap-2 border-b border-slate-200 pb-1.5">
                              <span className="text-2xl font-serif font-black text-[#0c2e4b]">℞</span>
                              <span className="text-xs font-bold text-slate-800">
                                Prescribed Medications {isCreateMultiPage && <span className="text-slate-500 font-normal">(Page 1: Items 1-5)</span>}
                              </span>
                            </div>

                            <div className="space-y-3">
                              {createPage1Meds.map((med, idx) => (
                                <div
                                  key={idx}
                                  className="avoid-print-break flex items-start justify-between gap-x-4 border-b border-slate-100 pb-2.5 last:border-b-0"
                                >
                                  <div className="min-w-0 flex-1">
                                    <div className="font-bold text-slate-900 text-[13px] leading-tight">
                                      {idx + 1}. {med.medicineName}{' '}
                                      <span className="font-normal text-slate-500 text-xs">
                                        ({med.dosage})
                                      </span>
                                    </div>
                                    <div className="text-xs text-slate-600 font-medium mt-1 flex flex-wrap items-center gap-x-2">
                                      <span className="font-bold text-[#0c2e4b] text-xs tracking-wide">
                                        {med.frequency}
                                      </span>
                                      <span className="text-slate-300">•</span>
                                      <span className="italic text-slate-700 text-xs">
                                        {med.instruction}
                                      </span>
                                    </div>
                                  </div>

                                  <div className="text-right shrink-0">
                                    <span className="font-bold text-slate-900 text-xs">
                                      {med.duration}
                                    </span>
                                  </div>
                                </div>
                              ))}
                              {createPage1Meds.length === 0 && (
                                <div className="text-slate-400 italic text-xs py-4 text-center">
                                  No medicines added yet. Use the prescription form on the left.
                                </div>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Single Page Mode: Lower Section (Investigations & Advice) on Page 1 */}
                        {!isCreateMultiPage && (
                          <div className="avoid-print-break border-t border-slate-200 pt-3 grid grid-cols-1 md:grid-cols-2 gap-5 text-xs">
                            <div>
                              <div className="font-bold text-slate-900 mb-1.5">
                                Diagnostic Investigations Advised (Total: {prescribedTests.length}):
                              </div>
                              <ul className="space-y-1 text-slate-700">
                                {prescribedTests.map((t) => (
                                  <li key={t.id} className="flex items-start gap-1.5">
                                    <span className="text-slate-400 font-bold">•</span>
                                    <span className="font-medium text-slate-900">{t.name}</span>
                                  </li>
                                ))}
                                {prescribedTests.length === 0 && (
                                  <li className="text-slate-400 italic text-[11px]">None</li>
                                )}
                              </ul>
                            </div>

                            <div>
                              <div className="font-bold text-slate-900 mb-1.5">
                                Special Clinical Advice:
                              </div>
                              <ul className="space-y-1 text-slate-700">
                                {adviceList.map((line, aIdx) => (
                                  <li key={aIdx} className="flex items-start gap-1.5">
                                    <span className="text-slate-400 font-bold">•</span>
                                    <span className="text-slate-700">{line}</span>
                                  </li>
                                ))}
                                {adviceList.length === 0 && (
                                  <li className="text-slate-400 italic text-[11px]">Standard clinical follow-up</li>
                                )}
                              </ul>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Bottom Section */}
                      {isCreateMultiPage ? (
                        /* Multi-page continuation footer for Page 1 */
                        <div className="space-y-2 pt-4">
                          <div className="border-t border-dashed border-slate-300 pt-2.5 flex items-center justify-between text-xs">
                            <div className="flex items-center gap-1.5">
                              <span className="w-1.5 h-1.5 rounded-full bg-[#0c2e4b] animate-pulse" />
                              <span className="font-semibold text-slate-700 text-[11px]">
                                Continued on Page 2 for Remaining Medications, Investigations, Advice &amp; Doctor Sign-off →
                              </span>
                            </div>
                            <span className="font-bold text-slate-800 bg-slate-100 px-2 py-0.5 rounded text-[10px] border border-slate-200">
                              Page 1 of 2
                            </span>
                          </div>
                          <div className="pt-1.5 border-t border-slate-100 text-[10px] text-slate-400 flex items-center justify-between">
                            <span>Green Hospital of Bangladesh • 24/7 Helpline: 10666</span>
                            <span>Page 1 of 2 (A4 Standard)</span>
                          </div>
                        </div>
                      ) : (
                        /* Single page footer & Doctor Signature for Page 1 */
                        <div className="avoid-print-break space-y-2 pt-4">
                          <div className="pt-3 border-t border-slate-200 flex flex-wrap items-end justify-between gap-4">
                            <div className="space-y-1">
                              <div className="text-xs">
                                <span className="text-slate-500 font-medium">Next Consultation Review: </span>
                                <span className="font-bold text-slate-900">{followUp || '7 Days later with report'}</span>
                              </div>
                              <div className="text-[10px] text-slate-400 flex items-center gap-1.5">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                                <span>System Generated Digital E-Prescription • Valid at accredited pharmacies</span>
                              </div>
                            </div>

                            <div className="text-right space-y-1">
                              <div className="flex justify-end mb-0.5">
                                <svg
                                  className="w-24 h-6 text-slate-800"
                                  viewBox="0 0 140 32"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="1.6"
                                  strokeLinecap="round"
                                >
                                  <path d="M 8 22 C 24 8, 36 28, 48 12 C 60 -2, 64 26, 88 14 C 100 8, 110 20, 132 12" />
                                </svg>
                              </div>

                              <div className="border-t border-slate-300 w-36 ml-auto pt-1">
                                <div className="font-bold text-slate-900 text-xs leading-tight">
                                  {CURRENT_DOCTOR.name}
                                </div>
                                <div className="text-[10px] text-slate-500 font-medium mt-0.5">
                                  Consultant Physician • Cardiology
                                </div>
                                <div className="text-[9.5px] text-slate-400 mt-0.5 flex items-center justify-end gap-1">
                                  <CheckCircle2 className="w-2.5 h-2.5 text-emerald-600 inline shrink-0" />
                                  <span>BMDC: {CURRENT_DOCTOR.bmdcReg} • Verified</span>
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="pt-1.5 border-t border-slate-100 text-[10px] text-slate-400 flex items-center justify-between">
                            <span>Green Hospital of Bangladesh • 24/7 Helpline: 10666</span>
                            <span>Page 1 of 1 (A4 Standard)</span>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* ========================================================= */}
                    {/* A4 PREVIEW SHEET 2 (Multi-page Flow when content overflows) */}
                    {/* ========================================================= */}
                    {isCreateMultiPage && (
                      <>
                        {/* Visual Screen Page Break Indicator (Hidden when Printing) */}
                        <div className="flex items-center justify-center gap-2 py-2 print:hidden">
                          <div className="h-px bg-slate-300 flex-1" />
                          <div className="text-[10.5px] font-bold text-slate-600 bg-slate-100 px-3 py-1 rounded-full border border-slate-200 flex items-center gap-1.5 shadow-2xs">
                            <FileText className="w-3 h-3 text-[#0c2e4b]" />
                            <span>Page Break • Next Page: Page 2 of 2 (A4 Standard - 210 × 297 mm)</span>
                          </div>
                          <div className="h-px bg-slate-300 flex-1" />
                        </div>

                        {/* Page 2 Sheet Container */}
                        <div className="a4-print-sheet bg-white rounded-[4px] border border-slate-300 shadow-md p-6 text-slate-800 text-xs leading-snug relative min-h-[950px] flex flex-col justify-between print:min-h-0 print:border-none print:shadow-none print:p-0">
                          <div className="space-y-4">
                            {/* Page 2 Continuation Header */}
                            <div className="pb-3 border-b border-slate-300 flex items-start justify-between">
                              <div>
                                <div className="text-lg font-black text-[#0c2e4b] tracking-tight flex items-center gap-2">
                                  <span>GreenHospital</span>
                                  <span className="text-[10px] font-bold text-cyan-800 bg-cyan-50 border border-cyan-200 px-2 py-0.5 rounded uppercase tracking-wider">
                                    Prescription Continuation
                                  </span>
                                </div>
                                <div className="text-[11px] text-slate-600 font-semibold mt-0.5">
                                  {CURRENT_DOCTOR.name} • {CURRENT_DOCTOR.designation} • BMDC: {CURRENT_DOCTOR.bmdcReg}
                                </div>
                                <div className="text-[10.5px] text-slate-500">
                                  {CURRENT_DOCTOR.department} • Dhaka Central Healthcare Wing
                                </div>
                              </div>

                              <div className="text-right">
                                <div className="text-xs font-bold text-slate-900">
                                  Patient: <span className="text-slate-800 font-extrabold">{rxPatientName}</span>
                                </div>
                                <div className="text-[11px] text-slate-600 font-medium mt-0.5">
                                  UHID: <span className="font-semibold text-slate-800">{rxUhid}</span> • Age: {rxAge} Y • {rxGender}
                                </div>
                                <div className="text-[10.5px] text-slate-500 mt-0.5 flex items-center justify-end gap-1.5">
                                  <span>Date: 20 Nov 2026</span>
                                  <span>•</span>
                                  <span className="bg-[#0c2e4b] text-white font-bold text-[10px] px-2 py-0.5 rounded">
                                    Page 2 of 2
                                  </span>
                                </div>
                              </div>
                            </div>

                            {/* Page 2 Remaining Medications (Items 6+) */}
                            {createPage2Meds.length > 0 && (
                              <div className="space-y-3 pt-1">
                                <div className="flex items-center gap-2 border-b border-slate-200 pb-1">
                                  <span className="text-2xl font-serif font-black text-[#0c2e4b]">℞</span>
                                  <span className="text-xs font-bold text-slate-800">
                                    Prescribed Medications (Continued from Page 1)
                                  </span>
                                </div>

                                <div className="space-y-2.5">
                                  {createPage2Meds.map((med, idx) => (
                                    <div
                                      key={idx}
                                      className="avoid-print-break flex items-start justify-between gap-x-4 border-b border-slate-100 pb-2.5 last:border-b-0"
                                    >
                                      <div className="min-w-0 flex-1">
                                        <div className="font-bold text-slate-900 text-[13px] leading-tight">
                                          {5 + idx + 1}. {med.medicineName}{' '}
                                          <span className="font-normal text-slate-500 text-xs">
                                            ({med.dosage})
                                          </span>
                                        </div>
                                        <div className="text-xs text-slate-600 font-medium mt-1 flex flex-wrap items-center gap-x-2">
                                          <span className="font-bold text-[#0c2e4b] text-xs tracking-wide">
                                            {med.frequency}
                                          </span>
                                          <span className="text-slate-300">•</span>
                                          <span className="italic text-slate-700 text-xs">
                                            {med.instruction}
                                          </span>
                                        </div>
                                      </div>

                                      <div className="text-right shrink-0">
                                        <span className="font-bold text-slate-900 text-xs">
                                          {med.duration}
                                        </span>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}

                            {/* Diagnostic Investigations & Special Clinical Advice on Page 2 */}
                            {(prescribedTests.length > 0 || adviceList.length > 0) && (
                              <div className="avoid-print-break border-t border-slate-200 pt-3 grid grid-cols-1 md:grid-cols-2 gap-5 text-xs">
                                <div>
                                  <div className="font-bold text-slate-900 mb-1.5">
                                    Diagnostic Investigations Advised (Total: {prescribedTests.length}):
                                  </div>
                                  <ul className="space-y-1 text-slate-700">
                                    {prescribedTests.map((t) => (
                                      <li key={t.id} className="flex items-start gap-1.5">
                                        <span className="text-slate-400 font-bold">•</span>
                                        <span className="font-medium text-slate-900">{t.name}</span>
                                      </li>
                                    ))}
                                    {prescribedTests.length === 0 && (
                                      <li className="text-slate-400 italic text-[11px]">None</li>
                                    )}
                                  </ul>
                                </div>

                                <div>
                                  <div className="font-bold text-slate-900 mb-1.5">
                                    Special Clinical Advice:
                                  </div>
                                  <ul className="space-y-1 text-slate-700">
                                    {adviceList.map((line, aIdx) => (
                                      <li key={aIdx} className="flex items-start gap-1.5">
                                        <span className="text-slate-400 font-bold">•</span>
                                        <span className="text-slate-700">{line}</span>
                                      </li>
                                    ))}
                                    {adviceList.length === 0 && (
                                      <li className="text-slate-400 italic text-[11px]">Standard clinical follow-up</li>
                                    )}
                                  </ul>
                                </div>
                              </div>
                            )}
                          </div>

                          {/* Page 2 Doctor Signature block & Review date */}
                          <div className="avoid-print-break space-y-2 pt-4">
                            <div className="pt-3 border-t border-slate-200 flex flex-wrap items-end justify-between gap-4">
                              <div className="space-y-1">
                                <div className="text-xs">
                                  <span className="text-slate-500 font-medium">Next Consultation Review: </span>
                                  <span className="font-bold text-slate-900">{followUp || '7 Days later with report'}</span>
                                </div>
                                <div className="text-[10px] text-slate-400 flex items-center gap-1.5">
                                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                                  <span>System Generated Digital E-Prescription • Valid at accredited pharmacies</span>
                                </div>
                              </div>

                              <div className="text-right space-y-1">
                                <div className="flex justify-end mb-0.5">
                                  <svg
                                    className="w-24 h-6 text-slate-800"
                                    viewBox="0 0 140 32"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="1.6"
                                    strokeLinecap="round"
                                  >
                                    <path d="M 8 22 C 24 8, 36 28, 48 12 C 60 -2, 64 26, 88 14 C 100 8, 110 20, 132 12" />
                                  </svg>
                                </div>

                                <div className="border-t border-slate-300 w-36 ml-auto pt-1">
                                  <div className="font-bold text-slate-900 text-xs leading-tight">
                                    {CURRENT_DOCTOR.name}
                                  </div>
                                  <div className="text-[10px] text-slate-500 font-medium mt-0.5">
                                    Consultant Physician • Cardiology
                                  </div>
                                  <div className="text-[9.5px] text-slate-400 mt-0.5 flex items-center justify-end gap-1">
                                    <CheckCircle2 className="w-2.5 h-2.5 text-emerald-600 inline shrink-0" />
                                    <span>BMDC: {CURRENT_DOCTOR.bmdcReg} • Verified</span>
                                  </div>
                                </div>
                              </div>
                            </div>

                            <div className="pt-1.5 border-t border-slate-100 text-[10px] text-slate-400 flex items-center justify-between">
                              <span>Green Hospital of Bangladesh • 24/7 Helpline: 10666</span>
                              <span>Page 2 of 2 (A4 Standard)</span>
                            </div>
                          </div>
                        </div>
                      </>
                    )}
                  </div>

                  {/* Bottom Controls Bar for Preview */}
                  <div className="flex items-center justify-between text-xs bg-white p-2 rounded-[4px] border border-slate-200/90 shadow-xs">
                    <div className="text-slate-600 font-semibold text-[11px] flex items-center gap-1.5">
                      <span>Page: {isCreateMultiPage ? '1 of 2' : '1 of 1'}</span>
                      <span className="text-slate-300">•</span>
                      <span className="text-[10px] font-bold text-slate-600 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200">
                        {isCreateMultiPage ? '2 Pages (A4 Standard)' : '1 Page (A4 Standard)'}
                      </span>
                    </div>

                    {/* Zoom Controls */}
                    <div className="flex items-center gap-1.5 text-xs text-slate-600">
                      <button
                        type="button"
                        onClick={() => setPreviewZoom((z) => Math.max(z - 10, 70))}
                        className="w-6 h-6 rounded border border-slate-300 hover:bg-slate-50 flex items-center justify-center cursor-pointer text-slate-700 font-bold"
                      >
                        -
                      </button>
                      <span className="font-semibold text-slate-800 w-12 text-center text-[11px]">
                        {previewZoom}%
                      </span>
                      <button
                        type="button"
                        onClick={() => setPreviewZoom((z) => Math.min(z + 10, 130))}
                        className="w-6 h-6 rounded border border-slate-300 hover:bg-slate-50 flex items-center justify-center cursor-pointer text-slate-700 font-bold"
                      >
                        +
                      </button>
                    </div>

                    {/* Print and Download Actions */}
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => window.print()}
                        className="px-2.5 py-1 rounded-[3px] border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                      >
                        <Printer className="w-3.5 h-3.5" />
                        <span>Print</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => window.print()}
                        className="px-2.5 py-1 rounded-[3px] border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Download</span>
                      </button>
                    </div>
                  </div>
                </>
              );
            })() : (
              /* Previous Prescriptions History Tab Content */
              <div className="bg-white p-4 rounded-[4px] border border-slate-200/90 shadow-xs space-y-3">
                <div className="flex items-center justify-between">
                  <div className="text-xs font-bold text-slate-900">
                    Prior E-Prescriptions for {rxPatientName}
                  </div>
                  <span className="text-[11px] text-slate-500 font-medium">
                    UHID: {rxUhid}
                  </span>
                </div>

                <div className="space-y-2.5">
                  {DOCTOR_PRESCRIPTIONS.slice(0, 3).map((item) => (
                    <div
                      key={item.id}
                      className="p-3 rounded-[3px] border border-slate-200 bg-slate-50/50 hover:bg-slate-50 transition-colors space-y-1.5"
                    >
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-extrabold text-[#0c2e4b]">
                          {item.rxNumber}
                        </span>
                        <span className="text-[11px] text-slate-500">{item.date}</span>
                      </div>
                      <div className="text-xs font-semibold text-slate-800">
                        {item.diagnosis}
                      </div>
                      <div className="text-[11px] text-slate-600 flex items-center justify-between pt-1">
                        <span>{item.medicines.length} Medicines Prescribed</span>
                        <button
                          type="button"
                          onClick={() => {
                            setMedicines(item.medicines);
                            setRxDiagnosis(item.diagnosis);
                            setPreviewTab('preview');
                          }}
                          className="text-[#0c2e4b] hover:underline font-bold text-xs cursor-pointer"
                        >
                          Copy / Re-Prescribe &rarr;
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Bottom Sticky Action Footer */}
        <div className="bg-white p-3 rounded-[4px] border border-slate-200/90 shadow-xs flex flex-wrap items-center justify-between gap-3 sticky bottom-3 z-10">
          <button
            type="button"
            onClick={() => setViewMode('list')}
            className="px-3.5 py-1.5 rounded-[3px] border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold cursor-pointer transition-colors"
          >
            Cancel
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={(e) => handleCreatePrescription(e, false)}
              className="px-3 py-1.5 rounded-[3px] border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-colors"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save Draft</span>
            </button>

            <button
              type="button"
              onClick={() => {
                const draftRx: EPrescription = {
                  id: `rx-draft-${Date.now()}`,
                  rxNumber: `RX-2026-DRAFT`,
                  uhid: rxUhid,
                  patientName: rxPatientName,
                  age: Number(rxAge) || 54,
                  gender: rxGender,
                  date: '20 Nov 2026',
                  diagnosis: rxDiagnosis || 'General Clinical Consultation',
                  medicines: medicines,
                  advice: adviceText.split('\n'),
                  testsAdvised: prescribedTests,
                  followUp: followUp,
                  status: 'Active E-Rx',
                  mode: rxMode,
                  vitals: {
                    bp: rxBp,
                    pulse: rxPulse,
                    temp: rxTemp,
                    spo2: rxSpo2,
                    weight: rxWeight,
                  },
                };
                setSelectedRx(draftRx);
                setViewMode('print-slip');
              }}
              className="px-3 py-1.5 rounded-[3px] border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-colors"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Preview</span>
            </button>

            <button
              type="button"
              onClick={(e) => handleCreatePrescription(e, true)}
              className="px-3.5 py-1.5 rounded-[3px] border border-slate-300 bg-white hover:bg-slate-50 text-slate-800 text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Save &amp; Print</span>
            </button>

            <button
              type="button"
              onClick={(e) => handleCreatePrescription(e, true)}
              className="px-4 py-1.5 rounded-[3px] bg-[#0c2e4b] hover:bg-[#081e31] text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs transition-colors"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Complete Consultation</span>
            </button>
          </div>
        </div>

        {/* Patient Details Modal */}
        {showPatientDetailsModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4">
            <div className="bg-white rounded-[6px] shadow-xl border border-slate-200 max-w-lg w-full p-4 space-y-3 font-['Plus_Jakarta_Sans',sans-serif]">
              <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-[4px] bg-[#0c2e4b] text-white flex items-center justify-center font-bold text-xs">
                    {rxPatientName.charAt(0)}
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">{rxPatientName}</h3>
                    <p className="text-[11px] text-slate-500 font-medium">UHID: {rxUhid}</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setShowPatientDetailsModal(false)}
                  className="p-1 rounded text-slate-400 hover:text-slate-700 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-2.5 text-xs">
                <div className="grid grid-cols-2 gap-2 p-2 bg-slate-50 rounded border border-slate-200">
                  <div>
                    <span className="text-slate-500 block text-[11px]">Age &amp; Gender</span>
                    <span className="font-semibold text-slate-800">{rxAge} Years / {rxGender}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[11px]">Blood Group</span>
                    <span className="font-semibold text-rose-700">B+ (Positive)</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[11px]">Emergency Contact</span>
                    <span className="font-semibold text-slate-800">+880 1712-998877</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[11px]">National ID / NID</span>
                    <span className="font-semibold text-slate-800">59182390182</span>
                  </div>
                </div>

                <div>
                  <span className="text-slate-700 font-bold block mb-1">Known Drug Allergies</span>
                  <div className="p-2 rounded bg-rose-50 border border-rose-200 text-rose-800 font-semibold flex items-center gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
                    <span>{rxAllergies || 'No documented drug allergies'}</span>
                  </div>
                </div>

                <div>
                  <span className="text-slate-700 font-bold block mb-1">Chronic Co-morbidities</span>
                  <p className="text-slate-600 p-2 bg-slate-50 rounded border border-slate-200">
                    {rxPastHistory || 'Hypertension, Type-2 Diabetes Mellitus'}
                  </p>
                </div>
              </div>

              <div className="flex justify-end pt-2 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setShowPatientDetailsModal(false)}
                  className="px-4 py-1.5 rounded-[3px] bg-[#0c2e4b] text-white text-xs font-semibold cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }


  // -------------------------------------------------------------
  // VIEW MODE 3: DEFAULT LIST OF ALL PRESCRIPTIONS
  // -------------------------------------------------------------
  return (
    <div className="space-y-2 font-['Plus_Jakarta_Sans',sans-serif]">
      {/* 4 Summary Metric Cards matching Appointment format */}
      <SummaryCardGrid>
        <SummaryCard
          title="Total Prescriptions"
          icon={FileText}
          iconColor="text-[#0c2e4b]"
          value={`${stats.total} E-Rx`}
          subtitle="Documented digital prescriptions"
        />
        <SummaryCard
          title="Active Digital E-Rx"
          icon={Pill}
          iconColor="text-cyan-600"
          value={`${stats.active} Regimens`}
          valueColor="text-cyan-700"
          subtitle="Currently active pharmacy therapy"
        />
        <SummaryCard
          title="Dispensed by Pharmacy"
          icon={CheckCircle2}
          iconColor="text-emerald-600"
          value={`${stats.dispensed} Fulfilled`}
          valueColor="text-emerald-700"
          subtitle="Collected from outpatient pharmacy"
        />
        <SummaryCard
          title="Prescribed Drug Items"
          icon={Clock}
          iconColor="text-amber-600"
          value={`${stats.totalMeds} Items`}
          valueColor="text-amber-700"
          subtitle="Individual prescribed medicine doses"
        />
      </SummaryCardGrid>

      {/* Appointment-Styled Enterprise DataTable */}
      <DataTable<EPrescription>
        data={filteredRx}
        columns={columns}
        keyExtractor={(item) => item.id}
        searchPlaceholder="Search by Rx number, patient name, UHID, or diagnosis..."
        searchFilter={(item, query) =>
          item.rxNumber.toLowerCase().includes(query.toLowerCase()) ||
          item.patientName.toLowerCase().includes(query.toLowerCase()) ||
          item.uhid.toLowerCase().includes(query.toLowerCase()) ||
          item.diagnosis.toLowerCase().includes(query.toLowerCase())
        }
        filters={toolbarFilters}
        actionButton={toolbarActions}
        emptyMessage="No prescriptions found for the selected status."
        onRowClick={(item) => {
          setSelectedRx(item);
          setViewMode('print-slip');
        }}
        showSerial={true}
      />
    </div>
  );
};

export default DoctorPrescriptionsView;
