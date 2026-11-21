import {
  Activity,
  Bold,
  Calendar,
  CheckCircle2,
  ChevronLeft,
  ClipboardList,
  Clock,
  Download,
  Eye,
  FileText,
  FlaskConical,
  Heart,
  Italic,
  List,
  ListOrdered,
  Pill,
  Plus,
  Printer,
  RotateCcw,
  Save,
  Search,
  Trash2,
  Underline,
  User,
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

  // Form State for E-Rx
  const [rxPatientName, setRxPatientName] = useState(initialPatient?.name || 'Md. Rahim Uddin');
  const [rxUhid, setRxUhid] = useState(initialPatient?.uhid || 'UHID-2024-8841');
  const [rxAge, setRxAge] = useState(initialPatient?.age?.toString() || '54');
  const [rxGender, setRxGender] = useState(initialPatient?.gender || 'Male');
  const [rxChiefComplaints, setRxChiefComplaints] = useState(
    'Chest tightness on exertion, intermittent palpitation.'
  );
  const [rxDiagnosis, setRxDiagnosis] = useState('Unstable Angina, Essential HTN');

  // Vitals
  const [rxBp, setRxBp] = useState('120/80');
  const [rxPulse, setRxPulse] = useState('76');
  const [rxTemp, setRxTemp] = useState('98.4');
  const [rxSpo2, setRxSpo2] = useState('98');
  const [rxWeight, setRxWeight] = useState('68');

  // Follow-up
  const [followUpDate, setFollowUpDate] = useState('2026-11-27');
  const [followUpTime, setFollowUpTime] = useState('04:00 PM');
  const [followUp, setFollowUp] = useState('27 Nov 2026, 04:00 PM');
  const [followUpInstructions, setFollowUpInstructions] = useState('Review with reports and BP control.');

  const [previewTab, setPreviewTab] = useState<'preview' | 'history'>('preview');
  const [previewZoom, setPreviewZoom] = useState(100);

  const adviceTextRef = useRef<HTMLTextAreaElement>(null);

  const applyRichFormat = (
    textarea: HTMLTextAreaElement | null,
    value: string,
    setValue: (val: string) => void,
    type: 'bold' | 'italic' | 'underline' | 'bullet' | 'number' | 'clear' | 'preset',
    presetText?: string
  ) => {
    if (!textarea) {
      if (type === 'preset' && presetText) {
        setValue(value ? `${value}\n• ${presetText}` : `• ${presetText}`);
      }
      return;
    }

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selected = value.substring(start, end);

    let newText = value;
    let newCursorPos = start;

    if (type === 'bold') {
      const wrapped = selected ? `**${selected}**` : `**bold text**`;
      newText = value.substring(0, start) + wrapped + value.substring(end);
      newCursorPos = start + wrapped.length;
    } else if (type === 'italic') {
      const wrapped = selected ? `*${selected}*` : `*italic text*`;
      newText = value.substring(0, start) + wrapped + value.substring(end);
      newCursorPos = start + wrapped.length;
    } else if (type === 'underline') {
      const wrapped = selected ? `<u>${selected}</u>` : `<u>underlined</u>`;
      newText = value.substring(0, start) + wrapped + value.substring(end);
      newCursorPos = start + wrapped.length;
    } else if (type === 'bullet') {
      if (selected) {
        const lines = selected.split('\n').map((l) => (l.startsWith('• ') ? l : `• ${l}`)).join('\n');
        newText = value.substring(0, start) + lines + value.substring(end);
        newCursorPos = start + lines.length;
      } else {
        const prefix = (start > 0 && value[start - 1] !== '\n') ? '\n• ' : '• ';
        newText = value.substring(0, start) + prefix + value.substring(end);
        newCursorPos = start + prefix.length;
      }
    } else if (type === 'number') {
      if (selected) {
        const lines = selected.split('\n').map((l, i) => `${i + 1}. ${l.replace(/^\d+\.\s*/, '')}`).join('\n');
        newText = value.substring(0, start) + lines + value.substring(end);
        newCursorPos = start + lines.length;
      } else {
        const prefix = (start > 0 && value[start - 1] !== '\n') ? '\n1. ' : '1. ';
        newText = value.substring(0, start) + prefix + value.substring(end);
        newCursorPos = start + prefix.length;
      }
    } else if (type === 'clear') {
      newText = value.replace(/[*_~`]|<u>|<\/u>/g, '');
      newCursorPos = 0;
    } else if (type === 'preset' && presetText) {
      const addition = (value.length > 0 && !value.endsWith('\n')) ? `\n• ${presetText}` : `• ${presetText}`;
      newText = value + addition;
      newCursorPos = newText.length;
    }

    setValue(newText);
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(newCursorPos, newCursorPos);
    }, 10);
  };

  const updateFollowUpValue = (dateStr: string, timeStr: string) => {
    if (!dateStr) {
      setFollowUp('7 Days later with report');
      return;
    }
    try {
      const [y, m, d] = dateStr.split('-');
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const monthName = months[parseInt(m, 10) - 1] || m;
      const formatted = `${parseInt(d, 10)} ${monthName} ${y}${timeStr ? `, ${timeStr}` : ''}`;
      setFollowUp(formatted);
    } catch {
      setFollowUp(`${dateStr}${timeStr ? `, ${timeStr}` : ''}`);
    }
  };

  const setQuickFollowUpDays = (days: number | 'sos') => {
    if (days === 'sos') {
      setFollowUp('SOS / Immediately if chest pain or distress occurs');
      return;
    }
    const target = new Date();
    target.setDate(target.getDate() + days);
    const yyyy = target.getFullYear();
    const mm = String(target.getMonth() + 1).padStart(2, '0');
    const dd = String(target.getDate()).padStart(2, '0');
    const dateFormatted = `${yyyy}-${mm}-${dd}`;
    setFollowUpDate(dateFormatted);
    updateFollowUpValue(dateFormatted, followUpTime);
  };

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
        setRxDiagnosis(matched.diagnosis || 'Unstable Angina, Essential HTN');
        setRxChiefComplaints('Chest tightness on exertion, intermittent palpitation.');
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
      return (
        item.name.toLowerCase().includes(q) ||
        item.code.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q)
      );
    });
  }, [testSearchInput]);

  const handleAddCatalogTest = (item: (typeof HOSPITAL_LAB_TEST_CATALOG)[0]) => {
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

  // Summary Metrics
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

    const newRx: EPrescription = {
      id: `rx-${Date.now()}`,
      rxNumber: `RX-2026-${Math.floor(100000 + Math.random() * 900000)}`,
      uhid: rxUhid || `UHID-2024-${Math.floor(1000 + Math.random() * 9000)}`,
      patientName: rxPatientName.trim(),
      age: Number(rxAge) || 54,
      gender: rxGender,
      date: '20 Nov 2026',
      diagnosis: rxDiagnosis || 'Unstable Angina, Essential HTN',
      medicines: medicines.filter((m) => m.medicineName.trim().length > 0),
      advice: adviceText.split('\n').filter((a) => a.trim().length > 0),
      testsAdvised: prescribedTests,
      followUp: followUp || '7 Days later with report',
      followUpInstructions: followUpInstructions,
      status: 'Active E-Rx',
      vitals: {
        bp: rxBp,
        pulse: rxPulse,
        weight: rxWeight,
        temp: rxTemp,
        spo2: rxSpo2,
      },
      caseStudy: {
        chiefComplaints: rxChiefComplaints,
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
        <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 font-semibold text-xs whitespace-nowrap">
          {r.medicines.length} Medicines
        </span>
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
              if (r.vitals) {
                setRxBp(r.vitals.bp || '120/80');
                setRxPulse(r.vitals.pulse || '76');
                setRxTemp(r.vitals.temp || '98.4');
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
              setFollowUpInstructions(r.followUpInstructions || 'Review with reports and blood pressure control.');
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
    return (
      <div className="max-w-[794px] mx-auto space-y-4 font-['Plus_Jakarta_Sans',sans-serif] px-4 sm:px-0 pb-12">
        {/* Standard A4 Print Stylesheet */}
        <style>{`
          @media print {
            @page {
              size: A4 portrait;
              margin: 12mm 15mm 15mm 15mm;
            }
            body {
              background: white !important;
              color: #1e293b !important;
              print-color-adjust: exact !important;
            }
            .a4-print-sheet {
              width: 100% !important;
              min-height: 270mm !important;
              padding: 0 !important;
              margin: 0 !important;
              border: none !important;
              box-shadow: none !important;
              display: flex !important;
              flex-direction: column !important;
              justify-content: space-between !important;
            }
            .avoid-print-break {
              break-inside: avoid !important;
              page-break-inside: avoid !important;
            }
          }
        `}</style>

        {/* Navigation & Action Bar (Exact match to user reference media_1795241563489_35bd3b37.png) */}
        <div className="w-full bg-white px-3.5 py-2.5 rounded-[3px] border border-slate-200/90 shadow-xs flex items-center justify-between gap-3 print:hidden">
          <div className="flex items-center gap-3 min-w-0">
            <button
              type="button"
              onClick={() => setViewMode('list')}
              className="w-9 h-9 rounded-full bg-slate-100/90 hover:bg-slate-200/90 flex items-center justify-center text-slate-700 transition-colors cursor-pointer shrink-0"
              title="Back to Prescriptions"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <div className="h-5 w-px bg-slate-200 shrink-0" />
            <div className="flex flex-wrap items-center gap-2 text-xs truncate">
              <span className="font-extrabold text-slate-900 text-[13px]">
                {selectedRx.rxNumber}
              </span>
              <span className="font-bold text-slate-900">
                {selectedRx.patientName}
              </span>
              <span className="text-slate-500 font-normal">
                ({selectedRx.uhid})
              </span>
              <span className="text-slate-300">•</span>
              <span className="text-slate-500">
                {selectedRx.date}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => window.print()}
              className="w-9 h-9 rounded-full bg-[#0c2e4b] hover:bg-[#081e31] text-white flex items-center justify-center transition-colors cursor-pointer shadow-xs"
              title="Print Prescription Slip"
            >
              <Printer className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => {
                setViewMode('create');
              }}
              className="w-9 h-9 rounded-full border border-slate-200 hover:bg-slate-50 text-slate-700 flex items-center justify-center transition-colors cursor-pointer"
              title="Write New Prescription"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* ========================================================= */}
        {/* ONE CLEAN A4 PRESCRIPTION SHEET (Standard 210 × 297 mm)     */}
        {/* ========================================================= */}
        <div className="a4-print-sheet w-full max-w-[794px] min-h-[1123px] bg-white border border-slate-300/80 rounded-[4px] p-8 sm:p-12 shadow-sm flex flex-col justify-between text-xs print:p-0 print:border-none print:shadow-none print:max-w-full">
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

            {/* 2) Patient Demographics & Vitals Strip */}
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
                  <span className="font-semibold text-slate-800">{selectedRx.vitals?.weight ? `${selectedRx.vitals.weight} kg` : '68 kg'}</span>
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
                    {selectedRx.vitals?.bp ? `${selectedRx.vitals.bp} mmHg` : '120/80 mmHg'}
                  </span>
                  <span>•</span>
                  <span>
                    <strong className="text-slate-800">Pulse Rate:</strong>{' '}
                    {selectedRx.vitals?.pulse ? `${selectedRx.vitals.pulse} bpm` : '76 bpm'}
                  </span>
                  <span>•</span>
                  <span>
                    <strong className="text-slate-800">Body Temp:</strong>{' '}
                    {selectedRx.vitals?.temp ? `${selectedRx.vitals.temp} °F` : '98.4 °F'}
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
            <div className="grid grid-cols-12 gap-6 min-h-[280px] items-start pt-2">
              {/* Left Column (~30%): Provisional Diagnosis & Chief Complaints */}
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
                    <div className="text-slate-700 leading-relaxed font-medium">
                      {selectedRx.caseStudy.chiefComplaints}
                    </div>
                  </div>
                )}
              </div>

              {/* Right Column (~70%): ℞ Prescribed Medications */}
              <div className="col-span-12 md:col-span-8 pl-1 space-y-3">
                <div className="flex items-center gap-2 border-b border-slate-200 pb-1">
                  <span className="text-3xl font-serif font-black text-[#0c2e4b]">℞</span>
                  <span className="text-xs font-bold text-slate-800">
                    Prescribed Medications
                  </span>
                </div>

                <div className="space-y-2.5">
                  {selectedRx.medicines.map((med, idx) => (
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

            {/* 4) Diagnostic Investigations Advised & Special Clinical Advice */}
            {((selectedRx.testsAdvised && selectedRx.testsAdvised.length > 0) ||
              (selectedRx.advice && selectedRx.advice.length > 0)) && (
                <div className="avoid-print-break grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t border-slate-200 text-xs items-start">
                  <div className="space-y-1">
                    <span className="font-bold text-slate-900 block text-xs">
                      Diagnostic Investigations Advised :

                    </span>
                    {selectedRx.testsAdvised && selectedRx.testsAdvised.length > 0 ? (
                      <ul className="list-disc list-inside space-y-1 text-slate-700 pl-1">
                        {selectedRx.testsAdvised.map((t, idx) => {
                          const name = typeof t === 'string' ? t : t.name;
                          return (
                            <li key={idx} className="leading-relaxed">
                              <span className="font-medium text-slate-900">{name}</span>
                            </li>
                          );
                        })}
                      </ul>
                    ) : (
                      <div className="text-slate-400 italic text-[11px]">None</div>
                    )}
                  </div>

                  <div className="space-y-1">
                    <span className="font-bold text-slate-900 block text-xs">
                      Special Clinical Advice:
                    </span>
                    {selectedRx.advice && selectedRx.advice.length > 0 ? (
                      <ul className="list-disc list-inside space-y-1 text-slate-700 pl-1">
                        {selectedRx.advice.map((adv, idx) => (
                          <li key={idx} className="leading-relaxed text-slate-700">
                            {adv.replace(/^[•\-\*]\s*/, '')}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <div className="text-slate-400 italic text-[11px]">
                        Regular follow-up as advised
                      </div>
                    )}
                  </div>
                </div>
              )}
          </div>

          {/* 5) Prescription Footer (Exact match to user reference media_1795242669111_4ea1ea57.png) */}
          <div className="avoid-print-break space-y-3 pt-6">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div className="space-y-1 text-xs text-slate-800">
                <div>
                  <span>Next review: </span>
                  <span className="font-bold text-slate-900">
                    {selectedRx.followUp || '27 Nov 2026, 04:00 PM'}
                  </span>
                </div>
                <div className="text-slate-600 text-[11px]">
                  {selectedRx.followUpInstructions || 'Review with reports and BP control.'}
                </div>
              </div>

              <div className="flex flex-col items-end shrink-0">
                {/* Signature stroke & solid line container matching doctor name width */}
                <div className="w-[140px] flex flex-col items-end">
                  <div className="pr-2 mb-0.5">
                    <svg
                      className="w-14 h-3.5 text-slate-900"
                      viewBox="0 0 60 12"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                    >
                      <path d="M 12 9 C 18 3, 24 3, 30 8 C 36 12, 42 2, 54 4" />
                    </svg>
                  </div>
                  <div className="w-full border-t border-slate-900 pt-1 text-right">
                    <div className="font-bold text-slate-900 text-xs sm:text-[13px] leading-tight whitespace-nowrap">
                      {CURRENT_DOCTOR.name}
                    </div>
                  </div>
                </div>

                {/* Designation row aligned to the right edge */}
                <div className="text-[11px] text-slate-600 font-medium mt-1 flex items-center justify-end gap-1 whitespace-nowrap">
                  <span>Consultant, Cardiology</span>
                  <span className="text-slate-400">·</span>
                  <span className="text-slate-800 font-bold">✓</span>
                  <span>BMDC {CURRENT_DOCTOR.bmdcReg}</span>
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-dashed border-slate-200 text-[10.5px] text-slate-400 flex items-center justify-between">
              <span>Green Hospital of Bangladesh · 24/7: 10666 · Digital e-Rx, valid at accredited pharmacies</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // VIEW MODE 2: WRITE / EDIT FULL PAGE WORKSTATION
  // -------------------------------------------------------------
  if (viewMode === 'create') {
    return (
      <div className="space-y-3.5 font-['Plus_Jakarta_Sans',sans-serif] pb-10">
        {/* Top Header / Context Strip */}
        <div className="bg-white px-3.5 py-2.5 rounded-[3px] border border-slate-200/90 shadow-xs flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setViewMode('list')}
              className="w-9 h-9 rounded-full bg-slate-100/90 hover:bg-slate-200/90 flex items-center justify-center text-slate-700 transition-colors cursor-pointer shrink-0"
              title="Back to Prescriptions"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <div className="h-5 w-px bg-slate-200 shrink-0" />
            <div>
              <h2 className="text-xs font-bold text-slate-900">
                Clinical E-Prescription Workstation
              </h2>
              <p className="text-[11px] text-slate-500">
                Official Digital Prescription Pad • Green Hospital of Bangladesh
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Patient Quick Vitals Pill */}
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-slate-50 border border-slate-200 flex items-center justify-center shrink-0">
                <User className="w-4 h-4 text-slate-600" />
              </div>
              <div>
                <div className="text-xs font-semibold text-slate-800">
                  {rxPatientName}
                </div>
                <div className="text-[11px] text-slate-500 font-medium">
                  {rxUhid} • {rxAge} Y / {rxGender}
                </div>
              </div>
            </div>

            <div className="hidden md:block h-6 w-px bg-slate-200" />

            {/* Department & Visit Type */}
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-slate-50 border border-slate-200 flex items-center justify-center shrink-0">
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
          </div>
        </div>

        {/* Split Screen 2-Column Workstation Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-3.5 items-start">
          {/* ========================================================= */}
          {/* LEFT COLUMN (~60%): Clinical Inputs, Rx Table, Tests     */}
          {/* ========================================================= */}
          <div className="lg:col-span-7 space-y-3">
            {/* Vitals Card: 5 Inline Compact Boxes in a Single Row */}
            <div className="bg-white p-3 rounded-[4px] border border-slate-200/90 shadow-xs space-y-2">
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900">
                <Activity className="w-4 h-4 text-slate-600" />
                <span>Patient Vitals</span>
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
                    Temp (°F)
                  </label>
                  <input
                    type="text"
                    value={rxTemp}
                    onChange={(e) => setRxTemp(e.target.value)}
                    placeholder="98.4"
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

            {/* Clinical Information Card */}
            <div className="bg-white p-3 rounded-[4px] border border-slate-200/90 shadow-xs space-y-2.5">
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900">
                <FileText className="w-4 h-4 text-slate-600" />
                <span>Clinical Information</span>
              </div>

              <div className="space-y-2.5">
                {/* Row 1: Chief Complaints */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Chief Complaints *
                  </label>
                  <input
                    type="text"
                    value={rxChiefComplaints}
                    onChange={(e) => setRxChiefComplaints(e.target.value)}
                    placeholder="e.g. Chest tightness on exertion, intermittent palpitation."
                    className="w-full px-3 py-1.5 border border-slate-300 rounded-[3px] text-xs text-slate-800 focus:outline-none focus:border-[#0c2e4b] bg-white"
                  />
                </div>

                {/* Row 2: Diagnosis */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Diagnosis *
                  </label>
                  <input
                    type="text"
                    value={rxDiagnosis}
                    onChange={(e) => setRxDiagnosis(e.target.value)}
                    placeholder="e.g. Unstable Angina, Essential HTN"
                    className="w-full px-3 py-1.5 border border-slate-300 rounded-[3px] text-xs text-slate-800 font-medium focus:outline-none focus:border-[#0c2e4b] bg-white"
                  />
                </div>
              </div>
            </div>

            {/* Prescribed Medications (Rx) Card */}
            <div className="bg-white p-3 rounded-[4px] border border-slate-200/90 shadow-xs space-y-2.5">
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900">
                <ClipboardList className="w-4 h-4 text-slate-600" />
                <span>Prescribed Medications (Rx)</span>
              </div>

              <div className="overflow-x-auto border border-slate-200 rounded-[3px]">
                <table className="w-full text-left text-xs border-collapse">
                  <thead className="bg-slate-50 text-[10.5px] font-bold text-slate-700 border-b border-slate-200">
                    <tr>
                      <th className="py-1 px-1.5 w-7 text-center">#</th>
                      <th className="py-1 px-2 min-w-[175px]">Medicine</th>
                      <th className="py-1 px-1.5 w-[88px] min-w-[88px]">Dose</th>
                      <th className="py-1 px-1.5 w-[82px] min-w-[82px]">Route</th>
                      <th className="py-1 px-1.5 w-[148px] min-w-[148px]">Frequency</th>
                      <th className="py-1 px-1.5 w-[96px] min-w-[96px]">Duration</th>
                      <th className="py-1 px-2 min-w-[130px]">Instructions</th>
                      <th className="py-1 px-1.5 w-7 text-center"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {medicines.map((m, idx) => (
                      <tr key={idx} className="hover:bg-slate-50/60">
                        <td className="py-1 px-1.5 text-center font-bold text-slate-500 text-[11px]">
                          {idx + 1}
                        </td>
                        <td className="py-1 px-1.5">
                          <input
                            type="text"
                            value={m.medicineName}
                            onChange={(e) =>
                              handleUpdateMedicineRow(idx, 'medicineName', e.target.value)
                            }
                            placeholder="e.g. Tab. Aspirin (Ecosprin)"
                            className="w-full px-2 py-1 border border-slate-300 rounded-[2px] text-[11px] text-slate-900 font-medium focus:outline-none focus:border-[#0c2e4b] bg-white"
                          />
                        </td>
                        <td className="py-1 px-1">
                          <select
                            value={m.dosage}
                            onChange={(e) =>
                              handleUpdateMedicineRow(idx, 'dosage', e.target.value)
                            }
                            className="w-full px-1.5 py-1 pr-3 border border-slate-300 rounded-[2px] text-[11px] text-slate-800 bg-white focus:outline-none focus:border-[#0c2e4b]"
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
                        <td className="py-1 px-1">
                          <select
                            value={m.route || 'Oral'}
                            onChange={(e) =>
                              handleUpdateMedicineRow(idx, 'route', e.target.value)
                            }
                            className="w-full px-1.5 py-1 pr-3 border border-slate-300 rounded-[2px] text-[11px] text-slate-800 bg-white focus:outline-none focus:border-[#0c2e4b]"
                          >
                            <option value="Oral">Oral</option>
                            <option value="IV">IV</option>
                            <option value="IM">IM</option>
                            <option value="Sublingual">Sublingual</option>
                            <option value="Topical">Topical</option>
                            <option value="Inhalation">Inhalation</option>
                          </select>
                        </td>
                        <td className="py-1 px-1">
                          <select
                            value={m.frequency}
                            onChange={(e) =>
                              handleUpdateMedicineRow(idx, 'frequency', e.target.value)
                            }
                            className="w-full px-1.5 py-1 pr-3 border border-slate-300 rounded-[2px] text-[11px] text-slate-800 bg-white focus:outline-none focus:border-[#0c2e4b]"
                          >
                            <option value="1-0-0 (Morning)">1-0-0 (Morning)</option>
                            <option value="0-0-1 (Night)">0-0-1 (Night)</option>
                            <option value="1-0-1 (Twice)">1-0-1 (Twice)</option>
                            <option value="1-1-1 (Thrice)">1-1-1 (Thrice)</option>
                            <option value="1-1-1-1 (Four times)">1-1-1-1 (Four times)</option>
                            <option value="1-0-0-1 (BD)">1-0-0-1 (BD)</option>
                            <option value="0-1-0 (Afternoon)">0-1-0 (Afternoon)</option>
                            <option value="SOS">SOS (As needed)</option>
                          </select>
                        </td>
                        <td className="py-1 px-1">
                          <select
                            value={m.duration}
                            onChange={(e) =>
                              handleUpdateMedicineRow(idx, 'duration', e.target.value)
                            }
                            className="w-full px-1.5 py-1 pr-3 border border-slate-300 rounded-[2px] text-[11px] text-slate-800 bg-white focus:outline-none focus:border-[#0c2e4b]"
                          >
                            <option value="5 Days">5 Days</option>
                            <option value="7 Days">7 Days</option>
                            <option value="10 Days">10 Days</option>
                            <option value="14 Days">14 Days</option>
                            <option value="30 Days">30 Days</option>
                            <option value="1 Month">1 Month</option>
                            <option value="3 Months">3 Months</option>
                            <option value="As needed">As needed</option>
                            <option value="Continue">Continue</option>
                          </select>
                        </td>
                        <td className="py-1 px-1.5">
                          <input
                            type="text"
                            value={m.instruction}
                            onChange={(e) =>
                              handleUpdateMedicineRow(idx, 'instruction', e.target.value)
                            }
                            placeholder="After breakfast"
                            className="w-full px-2 py-1 border border-slate-300 rounded-[2px] text-[11px] text-slate-800 focus:outline-none focus:border-[#0c2e4b] bg-white"
                          />
                        </td>
                        <td className="py-1 px-1 text-center">
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
                      placeholder="Search investigations..."
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

              {/* Advice & Instructions Box with Clean Formatting Toolbar */}
              <div className="bg-white rounded-[4px] border border-slate-200/90 shadow-xs overflow-hidden">
                <div className="p-2.5 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-2">
                  <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                    <span>Advice &amp; Instructions</span>
                  </div>
                  {/* Toolbar formatting buttons */}
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => applyRichFormat(adviceTextRef.current, adviceText, setAdviceText, 'bold')}
                      className="w-6 h-6 rounded hover:bg-white hover:shadow-xs border border-transparent hover:border-slate-300 flex items-center justify-center text-slate-700 cursor-pointer text-xs transition-colors"
                      title="Bold"
                    >
                      <Bold className="w-3 h-3" />
                    </button>
                    <button
                      type="button"
                      onClick={() => applyRichFormat(adviceTextRef.current, adviceText, setAdviceText, 'italic')}
                      className="w-6 h-6 rounded hover:bg-white hover:shadow-xs border border-transparent hover:border-slate-300 flex items-center justify-center text-slate-700 cursor-pointer text-xs transition-colors"
                      title="Italic"
                    >
                      <Italic className="w-3 h-3" />
                    </button>
                    <button
                      type="button"
                      onClick={() => applyRichFormat(adviceTextRef.current, adviceText, setAdviceText, 'underline')}
                      className="w-6 h-6 rounded hover:bg-white hover:shadow-xs border border-transparent hover:border-slate-300 flex items-center justify-center text-slate-700 cursor-pointer text-xs transition-colors"
                      title="Underline"
                    >
                      <Underline className="w-3 h-3" />
                    </button>
                    <div className="h-3.5 w-px bg-slate-300 mx-0.5" />
                    <button
                      type="button"
                      onClick={() => applyRichFormat(adviceTextRef.current, adviceText, setAdviceText, 'bullet')}
                      className="w-6 h-6 rounded hover:bg-white hover:shadow-xs border border-transparent hover:border-slate-300 flex items-center justify-center text-slate-700 cursor-pointer text-xs transition-colors"
                      title="Bullet List"
                    >
                      <List className="w-3 h-3" />
                    </button>
                    <button
                      type="button"
                      onClick={() => applyRichFormat(adviceTextRef.current, adviceText, setAdviceText, 'number')}
                      className="w-6 h-6 rounded hover:bg-white hover:shadow-xs border border-transparent hover:border-slate-300 flex items-center justify-center text-slate-700 cursor-pointer text-xs transition-colors"
                      title="Numbered List"
                    >
                      <ListOrdered className="w-3 h-3" />
                    </button>
                    <button
                      type="button"
                      onClick={() => applyRichFormat(adviceTextRef.current, adviceText, setAdviceText, 'clear')}
                      className="w-6 h-6 rounded hover:bg-white hover:shadow-xs border border-transparent hover:border-slate-300 flex items-center justify-center text-slate-500 hover:text-slate-800 cursor-pointer text-xs transition-colors"
                      title="Clear formatting"
                    >
                      <RotateCcw className="w-3 h-3" />
                    </button>
                  </div>
                </div>

                <textarea
                  ref={adviceTextRef}
                  rows={4}
                  value={adviceText}
                  onChange={(e) => setAdviceText(e.target.value)}
                  placeholder="• Low salt, low fat diet.&#10;• Regular walking (≥ 30 minutes daily).&#10;• Avoid smoking and alcohol."
                  className="w-full p-2.5 text-xs text-slate-800 leading-relaxed font-sans focus:outline-none bg-white resize-y"
                />
              </div>
            </div>

            {/* Follow-up Component: Clean, Minimal, DocTime Style */}
            <div className="bg-white p-3 rounded-[4px] border border-slate-200/90 shadow-xs space-y-2.5">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-[#0c2e4b]" />
                  <span>Next Consultation / Follow-up *</span>
                </label>
                <span className="text-[11px] font-semibold text-[#0c2e4b] bg-cyan-50 border border-cyan-200 px-2 py-0.5 rounded">
                  {followUp || 'Select Date & Time'}
                </span>
              </div>

              {/* Date & Time Picker */}
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-2">
                <div className="sm:col-span-7">
                  <input
                    type="date"
                    value={followUpDate}
                    onChange={(e) => {
                      setFollowUpDate(e.target.value);
                      updateFollowUpValue(e.target.value, followUpTime);
                    }}
                    className="w-full px-2.5 py-1.5 border border-slate-300 rounded-[3px] text-xs text-slate-800 focus:outline-none focus:border-[#0c2e4b] bg-white font-medium cursor-pointer"
                  />
                </div>

                <div className="sm:col-span-5">
                  <select
                    value={followUpTime}
                    onChange={(e) => {
                      setFollowUpTime(e.target.value);
                      updateFollowUpValue(followUpDate, e.target.value);
                    }}
                    className="w-full px-2 py-1.5 border border-slate-300 rounded-[3px] text-xs text-slate-800 focus:outline-none focus:border-[#0c2e4b] bg-white font-medium cursor-pointer"
                  >
                    <option value="09:00 AM">09:00 AM (Morning)</option>
                    <option value="10:00 AM">10:00 AM (Morning)</option>
                    <option value="11:30 AM">11:30 AM (Morning)</option>
                    <option value="12:30 PM">12:30 PM (Noon)</option>
                    <option value="04:00 PM">04:00 PM (Evening)</option>
                    <option value="05:30 PM">05:30 PM (Evening)</option>
                    <option value="07:00 PM">07:00 PM (Night)</option>
                    <option value="08:30 PM">08:30 PM (Night)</option>
                  </select>
                </div>
              </div>

              {/* Quick Presets */}
              <div className="flex flex-wrap items-center gap-1.5 pt-0.5 text-[11px]">
                <span className="text-slate-400 font-medium text-[10.5px]">Quick:</span>
                <button
                  type="button"
                  onClick={() => setQuickFollowUpDays(7)}
                  className="px-2 py-0.5 rounded bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold border border-slate-200 cursor-pointer transition-colors"
                >
                  +7 Days
                </button>
                <button
                  type="button"
                  onClick={() => setQuickFollowUpDays(14)}
                  className="px-2 py-0.5 rounded bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold border border-slate-200 cursor-pointer transition-colors"
                >
                  +14 Days
                </button>
                <button
                  type="button"
                  onClick={() => setQuickFollowUpDays(30)}
                  className="px-2 py-0.5 rounded bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold border border-slate-200 cursor-pointer transition-colors"
                >
                  +1 Month
                </button>
                <button
                  type="button"
                  onClick={() => setQuickFollowUpDays(90)}
                  className="px-2 py-0.5 rounded bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold border border-slate-200 cursor-pointer transition-colors"
                >
                  +3 Months
                </button>
                <button
                  type="button"
                  onClick={() => setQuickFollowUpDays('sos')}
                  className="px-2 py-0.5 rounded bg-rose-50 hover:bg-rose-100 text-rose-800 font-bold border border-rose-200 cursor-pointer transition-colors"
                >
                  SOS / Need basis
                </button>
              </div>

              {/* Review Note / Instruction */}
              <div>
                <input
                  type="text"
                  value={followUpInstructions}
                  onChange={(e) => setFollowUpInstructions(e.target.value)}
                  placeholder="e.g. Review with reports and blood pressure log."
                  className="w-full px-2.5 py-1.5 border border-slate-300 rounded-[3px] text-xs text-slate-800 bg-white focus:outline-none focus:border-[#0c2e4b]"
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

              return (
                <>
                  <div
                    style={{
                      transform: `scale(${previewZoom / 100})`,
                      transformOrigin: 'top center',
                    }}
                  >
                    {/* Clean Single A4 Prescription Sheet */}
                    <div className="a4-print-sheet bg-white rounded-[4px] border border-slate-300 shadow-md p-6 sm:p-8 text-slate-800 text-xs leading-snug relative min-h-[920px] flex flex-col justify-between print:min-h-0 print:border-none print:shadow-none print:p-0">
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

                        {/* 2) Patient Demographics & Vitals Strip */}
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
                                <div className="text-slate-700 leading-relaxed text-[11px] font-medium">
                                  {rxChiefComplaints}
                                </div>
                              </div>
                            )}
                          </div>

                          {/* Right Column (~70%): ℞ Prescribed Medications */}
                          <div className="col-span-12 md:col-span-8 pl-1 space-y-3">
                            <div className="flex items-center gap-2 border-b border-slate-200 pb-1.5">
                              <span className="text-2xl font-serif font-black text-[#0c2e4b]">℞</span>
                              <span className="text-xs font-bold text-slate-800">
                                Prescribed Medications
                              </span>
                            </div>

                            <div className="space-y-3">
                              {activeMedicines.map((med, idx) => (
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
                              {activeMedicines.length === 0 && (
                                <div className="text-slate-400 italic text-xs py-4 text-center">
                                  No medicines added yet. Use the prescription form on the left.
                                </div>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Lower Section: Investigations & Advice */}
                        <div className="avoid-print-break border-t border-slate-200 pt-3 grid grid-cols-1 md:grid-cols-2 gap-5 text-xs">
                          <div>
                            <div className="font-bold text-slate-900 mb-1.5">
                              Diagnostic Investigations Advised :
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
                                  <span className="text-slate-700">{line.replace(/^[•\-\*]\s*/, '')}</span>
                                </li>
                              ))}
                              {adviceList.length === 0 && (
                                <li className="text-slate-400 italic text-[11px]">Standard clinical follow-up</li>
                              )}
                            </ul>
                          </div>
                        </div>
                      </div>

                      {/* Prescription Footer (Exact match to user reference media_1795242669111_4ea1ea57.png) */}
                      <div className="avoid-print-break space-y-3 pt-6">
                        <div className="flex flex-wrap items-end justify-between gap-4">
                          <div className="space-y-1 text-xs text-slate-800">
                            <div>
                              <span>Next review: </span>
                              <span className="font-bold text-slate-900">
                                {followUp || '27 Nov 2026, 04:00 PM'}
                              </span>
                            </div>
                            <div className="text-slate-600 text-[11px]">
                              {followUpInstructions || 'Review with reports and BP control.'}
                            </div>
                          </div>

                          <div className="flex flex-col items-end shrink-0">
                            {/* Signature stroke & solid line container matching doctor name width */}
                            <div className="w-[140px] flex flex-col items-end">
                              <div className="pr-2 mb-0.5">
                                <svg
                                  className="w-14 h-3.5 text-slate-900"
                                  viewBox="0 0 60 12"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="1.6"
                                  strokeLinecap="round"
                                >
                                  <path d="M 12 9 C 18 3, 24 3, 30 8 C 36 12, 42 2, 54 4" />
                                </svg>
                              </div>
                              <div className="w-full border-t border-slate-900 pt-1 text-right">
                                <div className="font-bold text-slate-900 text-xs sm:text-[13px] leading-tight whitespace-nowrap">
                                  {CURRENT_DOCTOR.name}
                                </div>
                              </div>
                            </div>

                            {/* Designation row aligned to the right edge */}
                            <div className="text-[11px] text-slate-600 font-medium mt-1 flex items-center justify-end gap-1 whitespace-nowrap">
                              <span>Consultant, Cardiology</span>
                              <span className="text-slate-400">·</span>
                              <span className="text-slate-800 font-bold">✓</span>
                              <span>BMDC {CURRENT_DOCTOR.bmdcReg}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Bottom Controls Bar for Preview */}
                  <div className="flex items-center justify-between text-xs bg-white p-2 rounded-[4px] border border-slate-200/90 shadow-xs">
                    {/* Zoom Controls */}
                    <div className="flex items-center gap-1.5 text-xs text-slate-600">
                      <button
                        type="button"
                        onClick={() => setPreviewZoom((z) => Math.max(z - 10, 70))}
                        className="w-6 h-6 rounded border border-slate-300 hover:bg-slate-50 flex items-center justify-center cursor-pointer text-slate-700 font-bold"
                        title="Zoom Out"
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
                        title="Zoom In"
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

                <div className="space-y-2.5 max-h-[500px] overflow-y-auto">
                  {prescriptions.map((rx) => (
                    <div
                      key={rx.id}
                      className="p-3 rounded-[4px] border border-slate-200 bg-slate-50/50 hover:bg-slate-50 space-y-2 text-xs transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-[#0c2e4b]">{rx.rxNumber}</span>
                        <span className="text-[11px] text-slate-500">{rx.date}</span>
                      </div>
                      <div>
                        <span className="text-slate-500 font-medium text-[11px]">Diagnosis: </span>
                        <span className="font-semibold text-slate-800">{rx.diagnosis}</span>
                      </div>
                      <div className="flex items-center justify-between pt-1 border-t border-slate-200/60">
                        <span className="text-slate-600 text-[11px]">
                          {rx.medicines.length} Medicines prescribed
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            setMedicines(rx.medicines);
                            setRxDiagnosis(rx.diagnosis);
                            setAdviceText(rx.advice.join('\n'));
                            setPreviewTab('preview');
                          }}
                          className="text-[#0c2e4b] font-semibold hover:underline cursor-pointer text-[11px]"
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
            className="px-3 py-1.5 rounded-[3px] border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold cursor-pointer"
          >
            Discard Changes
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={(e) => handleCreatePrescription(e, false)}
              className="px-3 py-1.5 rounded-[3px] border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save as Draft</span>
            </button>

            <button
              type="button"
              onClick={() => {
                const draftRx: EPrescription = {
                  id: `rx-draft-${Date.now()}`,
                  rxNumber: `RX-2026-${Math.floor(100000 + Math.random() * 900000)}`,
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
                  followUpInstructions: followUpInstructions,
                  status: 'Active E-Rx',
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
              className="px-3 py-1.5 rounded-[3px] border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Save &amp; Print</span>
            </button>

            <button
              type="button"
              onClick={(e) => handleCreatePrescription(e, false)}
              className="px-4 py-1.5 rounded-[3px] bg-[#0c2e4b] hover:bg-[#081e31] text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Issue &amp; Sign E-Prescription</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // VIEW MODE 3: DEFAULT LIST OF ALL PRESCRIPTIONS
  // -------------------------------------------------------------
  return (
    <div className="space-y-2 font-['Plus_Jakarta_Sans',sans-serif]">
      {/* 4 Summary Metric Cards */}
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

      {/* Enterprise DataTable */}
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
