import {
  CheckCircle2,
  ChevronDown,
  Clock,
  Eye,
  FileText,
  FlaskConical,
  Microscope,
  MoreVertical,
  Plus,
  Printer,
  ShieldCheck,
  Trash2,
  X,
} from 'lucide-react';
import React, { useEffect, useMemo, useState } from 'react';
import {
  PATHOLOGY_PARAMETERS,
  PATHOLOGY_TEST_CATALOG,
  PathologyBillRecord,
  PathologyCategory,
  PathologyParameter,
  PathologyTestCatalog,
  SMART_PATHOLOGY_BILLS,
  TestResultItem,
} from '../../../data/superadminPathologyData';
import { DataTable, DataTableColumn } from '../../common/DataTable';

type PathologyTab = 'bills' | 'tests' | 'parameters';

export const PathologyDirectory: React.FC = () => {
  const [activeTab, setActiveTab] = useState<PathologyTab>('bills');
  const [bills, setBills] = useState<PathologyBillRecord[]>(SMART_PATHOLOGY_BILLS);
  const [tests, setTests] = useState<PathologyTestCatalog[]>(PATHOLOGY_TEST_CATALOG);
  const [parameters, setParameters] = useState<PathologyParameter[]>(PATHOLOGY_PARAMETERS);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const [selectedBill, setSelectedBill] = useState<PathologyBillRecord | null>(null);
  const [activeActionId, setActiveActionId] = useState<string | null>(null);

  // Modals state
  const [showGenerateModal, setShowGenerateModal] = useState(false);
  const [showAddTestModal, setShowAddTestModal] = useState(false);
  const [showResultModal, setShowResultModal] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [activeModalBill, setActiveModalBill] = useState<PathologyBillRecord | null>(null);

  // Generate Bill Form State
  const [formPatientName, setFormPatientName] = useState('');
  const [formCaseId, setFormCaseId] = useState('7499');
  const [formDoctorName, setFormDoctorName] = useState('Dr. Reyan Jain (9011)');
  const [formPathologistName, setFormPathologistName] = useState('Dr. Nusrat Jahan (Pathologist)');
  const [selectedTestId, setSelectedTestId] = useState('path-cat-01');
  const [formDiscount, setFormDiscount] = useState(0);
  const [formPaidAmount, setFormPaidAmount] = useState(29.4);

  // Add Test Form State
  const [newTestCode, setNewTestCode] = useState('');
  const [newTestName, setNewTestName] = useState('');
  const [newShortName, setNewShortName] = useState('');
  const [newCategory, setNewCategory] = useState<PathologyCategory>('Hematology');
  const [newSubCategory, setNewSubCategory] = useState('Automated Profiling');
  const [newSampleType, setNewSampleType] = useState('Whole Blood (EDTA)');
  const [newTAT, setNewTAT] = useState('2 Hours');
  const [newMethod, setNewMethod] = useState('Automated Analyzer');
  const [newCharge, setNewCharge] = useState(30);

  // Result Entry Form State
  const [editableResults, setEditableResults] = useState<TestResultItem[]>([]);
  const [technicianNotes, setTechnicianNotes] = useState('');

  useEffect(() => {
    const handleOutside = () => setActiveActionId(null);
    window.addEventListener('click', handleOutside);
    return () => window.removeEventListener('click', handleOutside);
  }, []);

  // Filtered Bills by Category
  const filteredBills = useMemo(() => {
    if (selectedCategory === 'All') return bills;
    return bills.filter((b) => b.category === selectedCategory);
  }, [bills, selectedCategory]);

  // Filtered Tests by Category
  const filteredTests = useMemo(() => {
    if (selectedCategory === 'All') return tests;
    return tests.filter((t) => t.category === selectedCategory);
  }, [tests, selectedCategory]);

  // Telemetry KPIs
  const telemetry = useMemo(() => {
    const totalOrders = bills.length;
    const completed = bills.filter((b) => b.reportStatus === 'Completed & Signed').length;
    const inProcess = bills.filter((b) => b.reportStatus === 'In Process').length;
    const totalBilled = bills.reduce((acc, b) => acc + b.netAmount, 0);
    const totalCollected = bills.reduce((acc, b) => acc + b.paidAmount, 0);

    return {
      totalOrders,
      completed,
      inProcess,
      totalBilled,
      totalCollected,
    };
  }, [bills]);

  // Handle open Result Entry Modal
  const handleOpenResultEntry = (bill: PathologyBillRecord) => {
    setActiveModalBill(bill);
    if (bill.results && bill.results.length > 0) {
      setEditableResults([...bill.results]);
    } else {
      // Default parameters based on test
      setEditableResults([
        {
          parameterName: 'Observed Parameter 1',
          observedValue: 'Normal',
          referenceRange: 'Normal',
          unit: 'Index',
          flag: 'Normal',
        },
      ]);
    }
    setTechnicianNotes(bill.technicianNotes || '');
    setShowResultModal(true);
    setActiveActionId(null);
  };

  // Save Lab Results
  const handleSaveResults = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeModalBill) return;

    setBills((prev) =>
      prev.map((b) => {
        if (b.id === activeModalBill.id) {
          return {
            ...b,
            results: editableResults,
            technicianNotes,
            reportStatus: 'Completed & Signed',
            sampleStatus: 'Collected',
          };
        }
        return b;
      })
    );

    if (selectedBill?.id === activeModalBill.id) {
      setSelectedBill((prev) =>
        prev
          ? {
            ...prev,
            results: editableResults,
            technicianNotes,
            reportStatus: 'Completed & Signed',
            sampleStatus: 'Collected',
          }
          : null
      );
    }

    setShowResultModal(false);
  };

  // Open Full Lab Report Modal
  const handleOpenReport = (bill: PathologyBillRecord) => {
    setActiveModalBill(bill);
    setShowReportModal(true);
    setActiveActionId(null);
  };

  // Handle Bill Creation
  const handleCreateBill = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formPatientName.trim()) return;

    const matchedTest = tests.find((t) => t.id === selectedTestId) || tests[0];
    const amount = matchedTest.standardCharge;
    const discountAmount = Number(formDiscount) || 0;
    const taxableAmount = Math.max(0, amount - discountAmount);
    const taxAmount = Number((taxableAmount * 0.05).toFixed(2));
    const netAmount = Number((taxableAmount + taxAmount).toFixed(2));
    const paid = Math.min(netAmount, Number(formPaidAmount) || 0);
    const balance = Number((netAmount - paid).toFixed(2));

    const newBill: PathologyBillRecord = {
      id: `path-bill-${Date.now()}`,
      billNo: `PATHOB${640 + bills.length + 1}`,
      caseId: formCaseId || `${7490 + bills.length + 1}`,
      date: new Date().toLocaleDateString('en-GB') + ' ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      patientName: formPatientName.trim(),
      patientId: `1${Math.floor(100 + Math.random() * 900)}`,
      doctorName: formDoctorName,
      pathologistName: formPathologistName,
      testName: matchedTest.testName,
      testCode: matchedTest.testCode,
      category: matchedTest.category,
      sampleType: matchedTest.sampleType,
      sampleStatus: 'In Lab',
      reportStatus: 'In Process',
      amount,
      discountAmount,
      discountPercent: discountAmount > 0 ? Math.round((discountAmount / amount) * 100) : 0,
      taxAmount,
      taxPercent: 5.0,
      netAmount,
      paidAmount: paid,
      balanceAmount: balance,
      results: [
        {
          parameterName: 'Standard Diagnostic Screen',
          observedValue: 'Under Processing',
          referenceRange: 'Normative Values',
          unit: 'Units',
          flag: 'Normal',
        },
      ],
      technicianNotes: 'Sample received in laboratory; automated run queued.',
    };

    setBills([newBill, ...bills]);
    setShowGenerateModal(false);
    setFormPatientName('');
  };

  // Handle Add Test to Catalog
  const handleCreateTest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTestName.trim() || !newTestCode.trim()) return;

    const created: PathologyTestCatalog = {
      id: `path-cat-${Date.now()}`,
      testCode: newTestCode.trim(),
      testName: newTestName.trim(),
      shortName: newShortName.trim() || newTestCode.trim(),
      category: newCategory,
      subCategory: newSubCategory.trim() || 'General Pathology',
      sampleType: newSampleType.trim() || 'Whole Blood (EDTA)',
      turnaroundTime: newTAT.trim() || '2 Hours',
      method: newMethod.trim() || 'Automated Clinical Chemistry',
      standardCharge: Number(newCharge) || 25,
      parameterCount: 4,
    };

    setTests([...tests, created]);
    setShowAddTestModal(false);
    setNewTestCode('');
    setNewTestName('');
    setNewShortName('');
  };

  // Bills Columns
  const billColumns: DataTableColumn<PathologyBillRecord>[] = [
    {
      key: 'billNo',
      header: 'Bill No',
      sortable: true,
      sortValue: (r) => r.billNo,
      render: (r) => (
        <button
          type="button"
          onClick={() => setSelectedBill(r)}
          className="font-bold text-[#0094b6] hover:underline cursor-pointer text-left whitespace-nowrap"
        >
          {r.billNo}
        </button>
      ),
    },
    {
      key: 'caseId',
      header: 'Case ID',
      sortable: true,
      sortValue: (r) => r.caseId,
      render: (r) => (
        <span className="font-semibold text-slate-800 whitespace-nowrap">{r.caseId}</span>
      ),
    },
    {
      key: 'date',
      header: 'Date & Time',
      sortable: true,
      sortValue: (r) => r.date,
      render: (r) => <span className="whitespace-nowrap text-slate-700">{r.date}</span>,
    },
    {
      key: 'patientName',
      header: 'Patient Name',
      sortable: true,
      sortValue: (r) => r.patientName,
      render: (r) => (
        <div>
          <span className="font-semibold text-slate-900 block leading-tight">{r.patientName}</span>
          <span className="text-[10px] text-slate-500 font-mono">UHID-{r.patientId}</span>
        </div>
      ),
    },
    {
      key: 'doctorName',
      header: 'Referred By',
      render: (r) => <span className="text-slate-700 whitespace-nowrap">{r.doctorName}</span>,
    },
    {
      key: 'testName',
      header: 'Test Name & Category',
      render: (r) => (
        <div className="max-w-xs">
          <span className="font-medium text-slate-900 block truncate" title={r.testName}>
            {r.testName}
          </span>
          <span className="inline-block mt-0.5 px-1.5 py-0.2 rounded-[3px] bg-slate-100 text-slate-600 text-[10px] font-medium">
            {r.category} · {r.sampleType}
          </span>
        </div>
      ),
    },
    {
      key: 'sampleStatus',
      header: 'Sample Status',
      align: 'center',
      render: (r) => {
        const isCollected = r.sampleStatus === 'Collected';
        const isInLab = r.sampleStatus === 'In Lab';
        return (
          <span
            className={`px-1.5 py-0.5 rounded-[3px] font-bold text-[10px] whitespace-nowrap ${isCollected
              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
              : isInLab
                ? 'bg-sky-50 text-sky-800 border border-sky-200'
                : 'bg-amber-50 text-amber-800 border border-amber-200'
              }`}
          >
            {r.sampleStatus}
          </span>
        );
      },
    },
    {
      key: 'reportStatus',
      header: 'Report Status',
      align: 'center',
      render: (r) => {
        const isDone = r.reportStatus === 'Completed & Signed';
        return (
          <span
            className={`px-1.5 py-0.5 rounded-[3px] font-bold text-[10px] whitespace-nowrap ${isDone
              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
              : 'bg-amber-50 text-amber-800 border border-amber-200'
              }`}
          >
            {r.reportStatus}
          </span>
        );
      },
    },
    {
      key: 'netAmount',
      header: 'Net ($)',
      align: 'right',
      sortable: true,
      sortValue: (r) => r.netAmount,
      render: (r) => (
        <span className="font-semibold text-slate-900">${r.netAmount.toFixed(2)}</span>
      ),
    },
    {
      key: 'paidAmount',
      header: 'Paid ($)',
      align: 'right',
      sortable: true,
      sortValue: (r) => r.paidAmount,
      render: (r) => (
        <span className="font-semibold text-emerald-700">${r.paidAmount.toFixed(2)}</span>
      ),
    },
    {
      key: 'balanceAmount',
      header: 'Balance ($)',
      align: 'right',
      sortable: true,
      sortValue: (r) => r.balanceAmount,
      render: (r) => (
        <span
          className={`font-semibold ${r.balanceAmount > 0 ? 'text-rose-600 font-bold' : 'text-slate-500'
            }`}
        >
          ${r.balanceAmount.toFixed(2)}
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
                    setSelectedBill(r);
                    setActiveActionId(null);
                  }}
                  className="w-full text-left px-3 py-1.5 text-slate-700 hover:bg-slate-50 font-medium flex items-center gap-2 cursor-pointer"
                >
                  <Eye className="w-3.5 h-3.5 text-slate-500" />
                  <span>View Details</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleOpenResultEntry(r)}
                  className="w-full text-left px-3 py-1.5 text-[#0094b6] hover:bg-teal-50 font-medium flex items-center gap-2 cursor-pointer"
                >
                  <Microscope className="w-3.5 h-3.5 text-[#0094b6]" />
                  <span>Enter Lab Results</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleOpenReport(r)}
                  className="w-full text-left px-3 py-1.5 text-slate-700 hover:bg-slate-50 font-medium flex items-center gap-2 cursor-pointer"
                >
                  <FileText className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Print Lab Report</span>
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
                  <span>Print Invoice</span>
                </button>

                <div className="border-t border-slate-100 my-1" />

                <button
                  type="button"
                  onClick={() => {
                    setBills((prev) => prev.filter((b) => b.id !== r.id));
                    setActiveActionId(null);
                  }}
                  className="w-full text-left px-3 py-1.5 text-rose-600 hover:bg-rose-50 font-medium flex items-center gap-2 cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5 text-rose-500" />
                  <span>Delete Bill</span>
                </button>
              </div>
            )}
          </div>
        );
      },
    },
  ];

  // Tests Columns
  const testColumns: DataTableColumn<PathologyTestCatalog>[] = [
    {
      key: 'testCode',
      header: 'Test Code',
      sortable: true,
      sortValue: (r) => r.testCode,
      render: (r) => <span className="font-bold text-[#0094b6]">{r.testCode}</span>,
    },
    {
      key: 'testName',
      header: 'Test Name',
      sortable: true,
      sortValue: (r) => r.testName,
      render: (r) => <span className="font-semibold text-slate-900">{r.testName}</span>,
    },
    {
      key: 'category',
      header: 'Category',
      align: 'center',
      sortable: true,
      sortValue: (r) => r.category,
      render: (r) => (
        <span className="px-1.5 py-0.5 rounded-[3px] bg-slate-100 text-slate-700 font-bold text-[10px]">
          {r.category}
        </span>
      ),
    },
    {
      key: 'sampleType',
      header: 'Sample Tube / Type',
      render: (r) => <span className="text-slate-700">{r.sampleType}</span>,
    },
    {
      key: 'turnaroundTime',
      header: 'TAT (Report)',
      render: (r) => <span className="text-slate-600">{r.turnaroundTime}</span>,
    },
    {
      key: 'method',
      header: 'Analytical Method',
      render: (r) => <span className="text-slate-600 truncate max-w-xs block">{r.method}</span>,
    },
    {
      key: 'standardCharge',
      header: 'Standard Charge ($)',
      align: 'right',
      sortable: true,
      sortValue: (r) => r.standardCharge,
      render: (r) => <span className="font-bold text-slate-900">${r.standardCharge.toFixed(2)}</span>,
    },
    {
      key: 'action',
      header: 'Action',
      align: 'center',
      render: (r) => (
        <button
          type="button"
          onClick={() => setTests((prev) => prev.filter((t) => t.id !== r.id))}
          className="w-5 h-5 rounded-[3px] border border-slate-300 text-slate-400 hover:text-rose-600 hover:border-rose-300 hover:bg-rose-50 flex items-center justify-center cursor-pointer mx-auto"
          title="Delete test"
        >
          <Trash2 className="w-3 h-3" />
        </button>
      ),
    },
  ];

  // Parameters Columns
  const parameterColumns: DataTableColumn<PathologyParameter>[] = [
    {
      key: 'name',
      header: 'Parameter Name',
      sortable: true,
      sortValue: (r) => r.name,
      render: (r) => <span className="font-semibold text-slate-900">{r.name}</span>,
    },
    {
      key: 'category',
      header: 'Category',
      render: (r) => (
        <span className="px-1.5 py-0.5 rounded-[3px] bg-slate-100 text-slate-700 font-bold text-[10px]">
          {r.category}
        </span>
      ),
    },
    {
      key: 'referenceRange',
      header: 'Normal Reference Range',
      render: (r) => <span className="font-medium text-emerald-800">{r.referenceRange}</span>,
    },
    {
      key: 'unit',
      header: 'Unit',
      render: (r) => (
        <span className="px-1.5 py-0.5 rounded-[3px] bg-slate-50 border border-slate-200 text-slate-700 font-mono text-[10px]">
          {r.unit}
        </span>
      ),
    },
    {
      key: 'description',
      header: 'Clinical Significance',
      render: (r) => <span className="text-slate-600 truncate max-w-sm block">{r.description}</span>,
    },
    {
      key: 'action',
      header: 'Action',
      align: 'center',
      render: (r) => (
        <button
          type="button"
          onClick={() => setParameters((prev) => prev.filter((p) => p.id !== r.id))}
          className="w-5 h-5 rounded-[3px] border border-slate-300 text-slate-400 hover:text-rose-600 hover:border-rose-300 hover:bg-rose-50 flex items-center justify-center cursor-pointer mx-auto"
          title="Delete parameter"
        >
          <Trash2 className="w-3 h-3" />
        </button>
      ),
    },
  ];

  // Toolbar Filters matching Pharmacy & Radiology
  const toolbarFilters = (
    <div className="flex items-center gap-2">
      <div className="relative">
        <select
          aria-label="Filter by pathology tab"
          value={activeTab}
          onChange={(e) => setActiveTab(e.target.value as PathologyTab)}
          className="h-8 pl-2.5 pr-7 rounded-[3px] border border-slate-200 bg-white text-xs font-medium text-slate-700 appearance-none focus:outline-hidden focus:border-[#0094b6] cursor-pointer"
        >
          <option value="bills">Pathology Bills Registry</option>
          <option value="tests">Pathology Tests Catalog</option>
          <option value="parameters">Diagnostic Parameters</option>
        </select>
        <ChevronDown className="w-3.5 h-3.5 text-slate-400 pointer-events-none absolute right-2 top-1/2 -translate-y-1/2" />
      </div>

      <div className="relative">
        <select
          aria-label="Filter by Category"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="h-8 pl-2.5 pr-7 rounded-[3px] border border-slate-200 bg-white text-xs font-medium text-slate-700 appearance-none focus:outline-hidden focus:border-[#0094b6] cursor-pointer"
        >
          <option value="All">All Categories</option>
          <option value="Hematology">Hematology</option>
          <option value="Biochemistry">Biochemistry</option>
          <option value="Microbiology">Microbiology</option>
          <option value="Immunology">Immunology</option>
          <option value="Serology">Serology</option>
        </select>
        <ChevronDown className="w-3.5 h-3.5 text-slate-400 pointer-events-none absolute right-2 top-1/2 -translate-y-1/2" />
      </div>
    </div>
  );

  // Toolbar Actions matching Pharmacy & Radiology
  const toolbarActions = (
    <div className="flex items-center gap-1.5">
      <button
        type="button"
        onClick={() => setShowGenerateModal(true)}
        className="h-8 px-3 rounded-[3px] bg-[#0094b6] hover:bg-[#007f9c] text-white text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
      >
        <Plus className="w-3.5 h-3.5" />
        <span>Generate Bill</span>
      </button>

      <button
        type="button"
        onClick={() => setShowAddTestModal(true)}
        className="h-8 px-2.5 rounded-[3px] bg-[#006a4e] hover:bg-[#00523c] text-white text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
      >
        <FlaskConical className="w-3.5 h-3.5" />
        <span>Add Pathology Test</span>
      </button>
    </div>
  );

  return (
    <div className="space-y-2 min-w-0 w-full overflow-hidden">
      {/* 4 Summary Metric Cards matching PatientDirectory format */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
        <div className="bg-white rounded-[3px] p-2.5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[10.5px] font-bold text-slate-700">Total Pathology Orders</span>
            <FlaskConical className="w-3.5 h-3.5 text-[#0094b6]" />
          </div>
          <div className="my-1">
            <span className="text-base font-extrabold text-slate-900 leading-none">
              {telemetry.totalOrders} Orders
            </span>
          </div>
          <p className="text-[10px] text-slate-500">Hematology, Biochemistry &amp; Serology</p>
        </div>

        <div className="bg-white rounded-[3px] p-2.5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[10.5px] font-bold text-slate-700">Under Analysis</span>
            <Clock className="w-3.5 h-3.5 text-amber-500" />
          </div>
          <div className="my-1">
            <span className="text-base font-extrabold text-amber-700 leading-none">
              {telemetry.inProcess} Processing
            </span>
          </div>
          <p className="text-[10px] text-slate-500">Samples currently queued in automated analyzers</p>
        </div>

        <div className="bg-white rounded-[3px] p-2.5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[10.5px] font-bold text-slate-700">Verified &amp; Signed</span>
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
          </div>
          <div className="my-1">
            <span className="text-base font-extrabold text-emerald-700 leading-none">
              {telemetry.completed} Verified
            </span>
          </div>
          <p className="text-[10px] text-slate-500">Approved by Consultant Pathologist</p>
        </div>

        <div className="bg-white rounded-[3px] p-2.5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[10.5px] font-bold text-slate-700">Total Lab Collection</span>
            <ShieldCheck className="w-3.5 h-3.5 text-sky-600" />
          </div>
          <div className="my-1">
            <span className="text-base font-extrabold text-sky-700 leading-none">
              ${telemetry.totalCollected.toFixed(2)}
            </span>
          </div>
          <p className="text-[10px] text-slate-500">Out of ${telemetry.totalBilled.toFixed(2)} billed today</p>
        </div>
      </div>

      {/* Selected Bill Quick View Card matching PatientDirectory format */}
      {selectedBill && (
        <div className="bg-white border border-[#0094b6]/30 rounded-md p-3.5 space-y-3">
          <div className="flex flex-wrap items-start justify-between gap-3 border-b border-slate-100 pb-2.5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-[3px] bg-[#f0f8fa] text-[#0094b6] flex items-center justify-center font-bold">
                <Microscope className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="text-sm font-semibold text-slate-900">{selectedBill.patientName}</h3>
                  <span className="px-2 py-0.5 rounded-[3px] bg-slate-100 text-slate-700 text-[11px] font-mono font-medium">
                    UHID-{selectedBill.patientId}
                  </span>
                  <span className="px-2 py-0.5 rounded-[3px] bg-emerald-50 text-emerald-700 border border-emerald-200 text-[11px] font-semibold">
                    {selectedBill.billNo}
                  </span>
                  <span className="px-2 py-0.5 rounded-[3px] bg-sky-50 text-sky-700 border border-sky-200 text-[11px] font-semibold">
                    Case #{selectedBill.caseId}
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  Test: <strong className="text-slate-800">{selectedBill.testName}</strong> · Prescribed by: {selectedBill.doctorName}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => handleOpenResultEntry(selectedBill)}
                className="h-8 px-2.5 rounded-[3px] bg-[#0094b6] hover:bg-[#007f9c] text-white text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
              >
                <Microscope className="w-3.5 h-3.5" />
                <span>Enter Results</span>
              </button>

              <button
                type="button"
                onClick={() => handleOpenReport(selectedBill)}
                className="h-8 px-2.5 rounded-[3px] border border-slate-200 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-700 flex items-center gap-1.5 cursor-pointer"
              >
                <FileText className="w-3.5 h-3.5 text-emerald-600" />
                <span>Print Report</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedBill(null)}
                className="w-8 h-8 rounded-[3px] border border-slate-200 text-slate-500 hover:text-slate-800 hover:bg-slate-50 flex items-center justify-center cursor-pointer"
                aria-label="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Sample Tracking Progress Timeline */}
          <div className="bg-slate-50 border border-slate-200 rounded-[3px] p-2.5 text-xs">
            <span className="block font-bold text-slate-700 text-[11px] mb-1.5">
              Laboratory Specimen Lifecycle:
            </span>
            <div className="grid grid-cols-4 gap-2 text-center text-[10.5px]">
              <div className="p-1.5 bg-white border border-emerald-300 rounded-[3px] text-emerald-800 font-semibold flex items-center justify-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>1. Specimen Collected</span>
              </div>
              <div className="p-1.5 bg-white border border-emerald-300 rounded-[3px] text-emerald-800 font-semibold flex items-center justify-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>2. Received in Lab</span>
              </div>
              <div className={`p-1.5 bg-white border rounded-[3px] font-semibold flex items-center justify-center gap-1 ${selectedBill.reportStatus === 'Completed & Signed' ? 'border-emerald-300 text-emerald-800' : 'border-amber-300 text-amber-800'}`}>
                <Clock className="w-3.5 h-3.5 text-amber-600" />
                <span>3. Automated Analysis</span>
              </div>
              <div className={`p-1.5 bg-white border rounded-[3px] font-semibold flex items-center justify-center gap-1 ${selectedBill.reportStatus === 'Completed & Signed' ? 'border-emerald-300 text-emerald-800' : 'border-slate-300 text-slate-500'}`}>
                {selectedBill.reportStatus === 'Completed & Signed' ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                ) : (
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                )}
                <span>4. Pathologist Signed</span>
              </div>
            </div>
          </div>

          {/* Parameter Values Preview Table if available */}
          {selectedBill.results && selectedBill.results.length > 0 && (
            <div className="border border-slate-200 rounded-[3px] overflow-hidden">
              <table className="w-full text-xs text-left">
                <thead className="bg-[#edf2f7] text-slate-700 text-[11px]">
                  <tr>
                    <th className="py-1 px-2.5 font-bold border-r border-slate-200">Parameter</th>
                    <th className="py-1 px-2.5 font-bold border-r border-slate-200">Observed Value</th>
                    <th className="py-1 px-2.5 font-bold border-r border-slate-200">Reference Range</th>
                    <th className="py-1 px-2.5 font-bold border-r border-slate-200">Unit</th>
                    <th className="py-1 px-2.5 font-bold text-center">Diagnostic Flag</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {selectedBill.results.map((r, i) => (
                    <tr key={i} className="hover:bg-slate-50/70">
                      <td className="py-1 px-2.5 font-medium text-slate-900 border-r border-slate-100">
                        {r.parameterName}
                      </td>
                      <td className="py-1 px-2.5 font-bold text-slate-900 border-r border-slate-100">
                        {r.observedValue}
                      </td>
                      <td className="py-1 px-2.5 text-slate-600 border-r border-slate-100">
                        {r.referenceRange}
                      </td>
                      <td className="py-1 px-2.5 font-mono text-slate-500 border-r border-slate-100">
                        {r.unit}
                      </td>
                      <td className="py-1 px-2.5 text-center">
                        <span
                          className={`px-1.5 py-0.2 rounded-[3px] font-bold text-[10px] ${r.flag === 'High'
                            ? 'bg-rose-50 text-rose-700 border border-rose-200'
                            : r.flag === 'Low'
                              ? 'bg-amber-50 text-amber-700 border border-amber-200'
                              : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            }`}
                        >
                          {r.flag || 'Normal'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Main DataTable View */}
      {activeTab === 'bills' && (
        <DataTable<PathologyBillRecord>
          title="Pathology Bill"
          data={filteredBills}
          columns={billColumns}
          rowKey={(r) => r.id}
          searchable
          searchPlaceholder="Search by bill no, patient name, case id, or test..."
          searchFilter={(r, q) =>
            r.billNo.toLowerCase().includes(q) ||
            r.caseId.toLowerCase().includes(q) ||
            r.patientName.toLowerCase().includes(q) ||
            r.testName.toLowerCase().includes(q) ||
            r.doctorName.toLowerCase().includes(q)
          }
          toolbarFilters={toolbarFilters}
          toolbarActions={toolbarActions}
          defaultPageSize={10}
          pageSizeOptions={[10, 25, 50, 100]}
          emptyTitle="No pathology bills found"
          emptyDescription="There are no pathology diagnostic bills matching your criteria."
        />
      )}

      {activeTab === 'tests' && (
        <DataTable<PathologyTestCatalog>
          title="Pathology Test Directory"
          data={filteredTests}
          columns={testColumns}
          rowKey={(r) => r.id}
          searchable
          searchPlaceholder="Search by test code, test name, or method..."
          searchFilter={(r, q) =>
            r.testCode.toLowerCase().includes(q) ||
            r.testName.toLowerCase().includes(q) ||
            r.category.toLowerCase().includes(q) ||
            r.sampleType.toLowerCase().includes(q)
          }
          toolbarFilters={toolbarFilters}
          toolbarActions={toolbarActions}
          defaultPageSize={10}
          pageSizeOptions={[10, 25, 50, 100]}
          emptyTitle="No pathology tests found"
          emptyDescription="No diagnostic laboratory tests configured in this category."
        />
      )}

      {activeTab === 'parameters' && (
        <DataTable<PathologyParameter>
          title="Diagnostic Parameters &amp; Reference Ranges"
          data={parameters}
          columns={parameterColumns}
          rowKey={(r) => r.id}
          searchable
          searchPlaceholder="Search by parameter name, unit, or category..."
          searchFilter={(r, q) =>
            r.name.toLowerCase().includes(q) ||
            r.category.toLowerCase().includes(q) ||
            r.unit.toLowerCase().includes(q)
          }
          toolbarFilters={toolbarFilters}
          toolbarActions={toolbarActions}
          defaultPageSize={10}
          pageSizeOptions={[10, 25, 50, 100]}
          emptyTitle="No parameters found"
          emptyDescription="No diagnostic parameters found."
        />
      )}

      {/* 1. Generate Bill Modal */}
      {showGenerateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-md border border-slate-200 shadow-xl w-full max-w-xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="px-4 py-3 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-2">
                <FlaskConical className="w-4 h-4 text-[#0094b6]" />
                <h3 className="text-sm font-bold text-slate-900">Generate Pathology Bill</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowGenerateModal(false)}
                className="w-7 h-7 rounded-sm text-slate-400 hover:text-slate-700 hover:bg-slate-200 flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateBill} className="p-4 space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    Patient Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formPatientName}
                    onChange={(e) => setFormPatientName(e.target.value)}
                    placeholder="e.g. Rachel Priest"
                    className="w-full h-8 px-2.5 rounded-[3px] border border-slate-300 text-xs focus:outline-hidden focus:border-[#0094b6]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    Hospital Case ID *
                  </label>
                  <input
                    type="text"
                    required
                    value={formCaseId}
                    onChange={(e) => setFormCaseId(e.target.value)}
                    className="w-full h-8 px-2.5 rounded-[3px] border border-slate-300 text-xs focus:outline-hidden focus:border-[#0094b6]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    Referred By (Doctor)
                  </label>
                  <select
                    value={formDoctorName}
                    onChange={(e) => setFormDoctorName(e.target.value)}
                    className="w-full h-8 px-2 rounded-[3px] border border-slate-300 text-xs focus:outline-hidden focus:border-[#0094b6]"
                  >
                    <option value="Dr. Reyan Jain (9011)">Dr. Reyan Jain (9011)</option>
                    <option value="Dr. Amit Singh (9009)">Dr. Amit Singh (9009)</option>
                    <option value="Dr. Farhana Yasmin (9013)">Dr. Farhana Yasmin (9013)</option>
                    <option value="Dr. Mahmudul Hasan (9008)">Dr. Mahmudul Hasan (9008)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    Reporting Pathologist
                  </label>
                  <input
                    type="text"
                    value={formPathologistName}
                    onChange={(e) => setFormPathologistName(e.target.value)}
                    className="w-full h-8 px-2.5 rounded-[3px] border border-slate-300 text-xs focus:outline-hidden focus:border-[#0094b6]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  Select Pathology Test *
                </label>
                <select
                  value={selectedTestId}
                  onChange={(e) => {
                    setSelectedTestId(e.target.value);
                    const t = tests.find((x) => x.id === e.target.value);
                    if (t) {
                      const net = Number((t.standardCharge * 1.05).toFixed(2));
                      setFormPaidAmount(net);
                    }
                  }}
                  className="w-full h-8 px-2 rounded-[3px] border border-slate-300 text-xs focus:outline-hidden focus:border-[#0094b6]"
                >
                  {tests.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.testCode} - {t.testName} (${t.standardCharge.toFixed(2)})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-1">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    Discount Amount ($)
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="0.5"
                    value={formDiscount}
                    onChange={(e) => setFormDiscount(Number(e.target.value))}
                    className="w-full h-8 px-2.5 rounded-[3px] border border-slate-300 text-xs focus:outline-hidden focus:border-[#0094b6]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    Paid Amount ($)
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="0.5"
                    value={formPaidAmount}
                    onChange={(e) => setFormPaidAmount(Number(e.target.value))}
                    className="w-full h-8 px-2.5 rounded-[3px] border border-slate-300 text-xs focus:outline-hidden focus:border-[#0094b6]"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setShowGenerateModal(false)}
                  className="h-8 px-3 rounded-[3px] border border-slate-300 text-slate-700 hover:bg-slate-100 font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="h-8 px-4 rounded-[3px] bg-[#0094b6] hover:bg-[#007f9c] text-white font-semibold cursor-pointer"
                >
                  Confirm &amp; Generate Bill
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 2. Add Test Modal */}
      {showAddTestModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-md border border-slate-200 shadow-xl w-full max-w-xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="px-4 py-3 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-2">
                <FlaskConical className="w-4 h-4 text-[#006a4e]" />
                <h3 className="text-sm font-bold text-slate-900">Add New Pathology Test</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowAddTestModal(false)}
                className="w-7 h-7 rounded-sm text-slate-400 hover:text-slate-700 hover:bg-slate-200 flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateTest} className="p-4 space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    Test Code *
                  </label>
                  <input
                    type="text"
                    required
                    value={newTestCode}
                    onChange={(e) => setNewTestCode(e.target.value)}
                    placeholder="e.g. SER-FERRITIN"
                    className="w-full h-8 px-2.5 rounded-[3px] border border-slate-300 text-xs focus:outline-hidden focus:border-[#0094b6]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    Category *
                  </label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as PathologyCategory)}
                    className="w-full h-8 px-2 rounded-[3px] border border-slate-300 text-xs focus:outline-hidden focus:border-[#0094b6]"
                  >
                    <option value="Hematology">Hematology</option>
                    <option value="Biochemistry">Biochemistry</option>
                    <option value="Microbiology">Microbiology</option>
                    <option value="Immunology">Immunology</option>
                    <option value="Serology">Serology</option>
                    <option value="Histopathology">Histopathology</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    Full Test Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={newTestName}
                    onChange={(e) => setNewTestName(e.target.value)}
                    placeholder="e.g. Serum Ferritin Assay"
                    className="w-full h-8 px-2.5 rounded-[3px] border border-slate-300 text-xs focus:outline-hidden focus:border-[#0094b6]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    Sub-Category
                  </label>
                  <input
                    type="text"
                    value={newSubCategory}
                    onChange={(e) => setNewSubCategory(e.target.value)}
                    placeholder="e.g. Automated Profiling"
                    className="w-full h-8 px-2.5 rounded-[3px] border border-slate-300 text-xs focus:outline-hidden focus:border-[#0094b6]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    Sample Type / Tube
                  </label>
                  <input
                    type="text"
                    value={newSampleType}
                    onChange={(e) => setNewSampleType(e.target.value)}
                    placeholder="e.g. Serum (Yellow Top Gel)"
                    className="w-full h-8 px-2.5 rounded-[3px] border border-slate-300 text-xs focus:outline-hidden focus:border-[#0094b6]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    Turnaround Time (TAT)
                  </label>
                  <input
                    type="text"
                    value={newTAT}
                    onChange={(e) => setNewTAT(e.target.value)}
                    placeholder="e.g. 3 Hours"
                    className="w-full h-8 px-2.5 rounded-[3px] border border-slate-300 text-xs focus:outline-hidden focus:border-[#0094b6]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    Analytical Method
                  </label>
                  <input
                    type="text"
                    value={newMethod}
                    onChange={(e) => setNewMethod(e.target.value)}
                    placeholder="e.g. Chemiluminescence (CLIA)"
                    className="w-full h-8 px-2.5 rounded-[3px] border border-slate-300 text-xs focus:outline-hidden focus:border-[#0094b6]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    Standard Charge ($) *
                  </label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={newCharge}
                    onChange={(e) => setNewCharge(Number(e.target.value))}
                    className="w-full h-8 px-2.5 rounded-[3px] border border-slate-300 text-xs focus:outline-hidden focus:border-[#0094b6]"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setShowAddTestModal(false)}
                  className="h-8 px-3 rounded-[3px] border border-slate-300 text-slate-700 hover:bg-slate-100 font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="h-8 px-4 rounded-[3px] bg-[#006a4e] hover:bg-[#00523c] text-white font-semibold cursor-pointer"
                >
                  Add Test to Directory
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 3. Enter Results Modal */}
      {showResultModal && activeModalBill && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-md border border-slate-200 shadow-xl w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="px-4 py-3 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-2">
                <Microscope className="w-4 h-4 text-[#0094b6]" />
                <h3 className="text-sm font-bold text-slate-900">
                  Enter Laboratory Results · {activeModalBill.testName}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowResultModal(false)}
                className="w-7 h-7 rounded-sm text-slate-400 hover:text-slate-700 hover:bg-slate-200 flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveResults} className="p-4 space-y-3 text-xs">
              <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-[3px] flex items-center justify-between">
                <div>
                  <span className="text-[11px] text-slate-500">Patient:</span>
                  <strong className="text-slate-800 ml-1">{activeModalBill.patientName} (UHID-{activeModalBill.patientId})</strong>
                </div>
                <div>
                  <span className="text-[11px] text-slate-500">Bill No:</span>
                  <strong className="text-slate-800 ml-1">{activeModalBill.billNo}</strong>
                </div>
                <div>
                  <span className="text-[11px] text-slate-500">Sample:</span>
                  <strong className="text-slate-800 ml-1">{activeModalBill.sampleType}</strong>
                </div>
              </div>

              <div className="border border-slate-200 rounded-[3px] overflow-hidden">
                <table className="w-full text-xs text-left">
                  <thead className="bg-[#edf2f7] text-slate-700 text-[11px]">
                    <tr>
                      <th className="py-1.5 px-2.5 font-bold border-r border-slate-200">Parameter</th>
                      <th className="py-1.5 px-2.5 font-bold border-r border-slate-200">Observed Value *</th>
                      <th className="py-1.5 px-2.5 font-bold border-r border-slate-200">Reference Range</th>
                      <th className="py-1.5 px-2.5 font-bold border-r border-slate-200">Unit</th>
                      <th className="py-1.5 px-2.5 font-bold text-center">Flag</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {editableResults.map((param, index) => (
                      <tr key={index}>
                        <td className="py-1 px-2.5 font-medium text-slate-900 border-r border-slate-100">
                          {param.parameterName}
                        </td>
                        <td className="py-1 px-2 border-r border-slate-100">
                          <input
                            type="text"
                            required
                            value={param.observedValue}
                            onChange={(e) => {
                              const val = e.target.value;
                              const updated = [...editableResults];
                              updated[index].observedValue = val;
                              setEditableResults(updated);
                            }}
                            className="w-full h-7 px-2 border border-slate-300 rounded-[3px] text-xs font-bold text-slate-900 focus:outline-hidden focus:border-[#0094b6]"
                          />
                        </td>
                        <td className="py-1 px-2.5 text-slate-600 border-r border-slate-100">
                          {param.referenceRange}
                        </td>
                        <td className="py-1 px-2.5 text-slate-500 font-mono border-r border-slate-100">
                          {param.unit}
                        </td>
                        <td className="py-1 px-2 text-center">
                          <select
                            value={param.flag || 'Normal'}
                            onChange={(e) => {
                              const updated = [...editableResults];
                              updated[index].flag = e.target.value as 'Normal' | 'High' | 'Low';
                              setEditableResults(updated);
                            }}
                            className="h-7 px-1.5 rounded-[3px] border border-slate-300 text-[10px] font-bold"
                          >
                            <option value="Normal">Normal</option>
                            <option value="High">High</option>
                            <option value="Low">Low</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  Pathologist &amp; Technician Observations / Remarks
                </label>
                <textarea
                  rows={2}
                  value={technicianNotes}
                  onChange={(e) => setTechnicianNotes(e.target.value)}
                  placeholder="Specimen quality satisfactory. No significant morphological abnormalities."
                  className="w-full p-2 border border-slate-300 rounded-[3px] text-xs focus:outline-hidden focus:border-[#0094b6]"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setShowResultModal(false)}
                  className="h-8 px-3 rounded-[3px] border border-slate-300 text-slate-700 hover:bg-slate-100 font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="h-8 px-4 rounded-[3px] bg-[#0094b6] hover:bg-[#007f9c] text-white font-semibold cursor-pointer"
                >
                  Authorize &amp; Sign Report
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 4. Lab Report Printable Modal */}
      {showReportModal && activeModalBill && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-md border border-slate-200 shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in-95 duration-150">
            <div className="p-6 space-y-4">
              {/* Report Header */}
              <div className="flex items-start justify-between border-b-2 border-[#0094b6] pb-3">
                <div>
                  <h2 className="text-lg font-bold text-slate-900 tracking-tight">GREEN HOSPITAL CENTRAL</h2>
                  <p className="text-[11px] text-slate-600">Department of Pathology &amp; Laboratory Medicine</p>
                  <p className="text-[10px] text-slate-500">ISO 15189 Certified Diagnostic Facility · Dhanmondi Campus</p>
                </div>
                <div className="text-right">
                  <span className="font-mono text-xs font-bold text-[#0094b6] block">{activeModalBill.billNo}</span>
                  <span className="text-[10px] text-slate-500 font-mono">LAB-BARCODE-98214</span>
                </div>
              </div>

              {/* Patient Demographics */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 bg-slate-50 p-2.5 border border-slate-200 text-xs">
                <div>
                  <span className="text-[10px] text-slate-400 block">Patient Name:</span>
                  <strong className="text-slate-900">{activeModalBill.patientName}</strong>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block">UHID / Age / Gender:</span>
                  <strong className="text-slate-900">UHID-{activeModalBill.patientId} · 38y/F</strong>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block">Referred Doctor:</span>
                  <strong className="text-slate-900">{activeModalBill.doctorName}</strong>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block">Report Date:</span>
                  <strong className="text-slate-900">{activeModalBill.date}</strong>
                </div>
              </div>

              {/* Test Title */}
              <div className="border-b border-slate-200 pb-1">
                <h3 className="text-sm font-bold text-slate-900">{activeModalBill.testName}</h3>
                <span className="text-[10px] text-slate-500">
                  Specimen: {activeModalBill.sampleType} · Analytical Category: {activeModalBill.category}
                </span>
              </div>

              {/* Parameters Table */}
              <div className="border border-slate-200 rounded-[3px] overflow-hidden">
                <table className="w-full text-xs text-left">
                  <thead className="bg-[#edf2f7] text-slate-700 text-[11px]">
                    <tr>
                      <th className="py-1.5 px-3 font-bold border-r border-slate-200">Investigation</th>
                      <th className="py-1.5 px-3 font-bold border-r border-slate-200">Result</th>
                      <th className="py-1.5 px-3 font-bold border-r border-slate-200">Reference Interval</th>
                      <th className="py-1.5 px-3 font-bold border-r border-slate-200">Unit</th>
                      <th className="py-1.5 px-3 font-bold text-center">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {(activeModalBill.results || []).map((r, i) => (
                      <tr key={i}>
                        <td className="py-1.5 px-3 font-semibold text-slate-900 border-r border-slate-100">{r.parameterName}</td>
                        <td className="py-1.5 px-3 font-extrabold text-slate-900 border-r border-slate-100">{r.observedValue}</td>
                        <td className="py-1.5 px-3 text-slate-600 border-r border-slate-100">{r.referenceRange}</td>
                        <td className="py-1.5 px-3 font-mono text-slate-500 border-r border-slate-100">{r.unit}</td>
                        <td className="py-1.5 px-3 text-center">
                          <span
                            className={`px-1.5 py-0.2 rounded-[3px] font-bold text-[10px] ${r.flag === 'High'
                              ? 'bg-rose-50 text-rose-700 border border-rose-200'
                              : r.flag === 'Low'
                                ? 'bg-amber-50 text-amber-700 border border-amber-200'
                                : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              }`}
                          >
                            {r.flag || 'Normal'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Observations */}
              {activeModalBill.technicianNotes && (
                <div className="bg-slate-50 border border-slate-200 p-2.5 rounded-[3px] text-xs">
                  <span className="font-bold text-slate-700 block text-[11px]">Diagnostic Remarks:</span>
                  <p className="text-slate-600 text-[11.5px] mt-0.5">{activeModalBill.technicianNotes}</p>
                </div>
              )}

              {/* Footer & Digital Signature */}
              <div className="pt-6 border-t border-slate-200 flex items-end justify-between text-xs">
                <div>
                  <p className="text-[10px] text-slate-400">Electronic report verified against automated clinical analyzers.</p>
                  <p className="text-[10px] text-slate-400">This diagnostic document is digitally authenticated.</p>
                </div>
                <div className="text-right">
                  <div className="inline-block border-b border-slate-400 pb-0.5 mb-1 px-4 text-center">
                    <span className="font-serif italic text-sm text-[#0094b6]">Dr. Nusrat Jahan</span>
                  </div>
                  <p className="font-bold text-slate-900 text-[11px]">{activeModalBill.pathologistName}</p>
                  <p className="text-[10px] text-slate-500">Consultant Pathologist &amp; Lab Director</p>
                </div>
              </div>

              {/* Buttons */}
              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setShowReportModal(false)}
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
                  <span>Print Official Report</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
