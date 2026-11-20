import {
  CheckCircle2,
  ChevronDown,
  Clock,
  Eye,
  FileText,
  FlaskConical,
  MoreVertical,
  Plus,
  Printer,
  Scan,
  Trash2,
  X,
} from 'lucide-react';
import React, { useEffect, useMemo, useState } from 'react';
import {
  RADIOLOGY_TEST_CATALOG,
  RadiologyBillRecord,
  RadiologyModality,
  RadiologyTestCatalog,
  SMART_RADIOLOGY_BILLS,
} from '../../../data/superadminRadiologyData';
import { DataTable, DataTableColumn } from '../../common/DataTable';

type RadiologyTab = 'bills' | 'tests';

export const RadiologyDirectory: React.FC = () => {
  const [activeTab, setActiveTab] = useState<RadiologyTab>('bills');
  const [bills, setBills] = useState<RadiologyBillRecord[]>(SMART_RADIOLOGY_BILLS);
  const [tests, setTests] = useState<RadiologyTestCatalog[]>(RADIOLOGY_TEST_CATALOG);
  const [selectedBill, setSelectedBill] = useState<RadiologyBillRecord | null>(null);
  const [activeActionId, setActiveActionId] = useState<string | null>(null);

  // Modals state
  const [showGenerateModal, setShowGenerateModal] = useState(false);
  const [showAddTestModal, setShowAddTestModal] = useState(false);

  // Generate Bill Form State
  const [formPatientName, setFormPatientName] = useState('');
  const [formCaseId, setFormCaseId] = useState('7498');
  const [formDoctorName, setFormDoctorName] = useState('Dr. Reyan Jain (9011)');
  const [formRadiologistName, setFormRadiologistName] = useState('Dr. Sabrina Karim (Radiologist)');
  const [selectedTestId, setSelectedTestId] = useState('rad-cat-01');
  const [formDiscount, setFormDiscount] = useState(0);
  const [formPaidAmount, setFormPaidAmount] = useState(47.25);

  // Add Test Form State
  const [newTestCode, setNewTestCode] = useState('');
  const [newTestName, setNewTestName] = useState('');
  const [newModality, setNewModality] = useState<RadiologyModality>('X-Ray');
  const [newSubCategory, setNewSubCategory] = useState('General Radiology');
  const [newTAT, setNewTAT] = useState('2 Hours');
  const [newMachine, setNewMachine] = useState('Digital X-Ray Suite 101');
  const [newCharge, setNewCharge] = useState(50);

  useEffect(() => {
    const handleOutside = () => setActiveActionId(null);
    window.addEventListener('click', handleOutside);
    return () => window.removeEventListener('click', handleOutside);
  }, []);

  // Operational Telemetry Metrics
  const telemetry = useMemo(() => {
    const totalOrders = bills.length;
    const completed = bills.filter((b) => b.reportStatus === 'Completed & Signed').length;
    const inProcess = bills.filter((b) => b.reportStatus === 'In Process').length;
    const pendingReview = bills.filter((b) => b.reportStatus === 'Pending Review').length;
    return { totalOrders, completed, inProcess, pendingReview };
  }, [bills]);

  const handleGenerateBillSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formPatientName.trim()) return;

    const matchedTest = tests.find((t) => t.id === selectedTestId) || tests[0];
    const amountVal = matchedTest.standardCharge;
    const taxVal = Number(((amountVal - formDiscount) * 0.05).toFixed(2));
    const netVal = Number((amountVal - formDiscount + taxVal).toFixed(2));
    const paidVal = Math.min(netVal, formPaidAmount);
    const balanceVal = Number((netVal - paidVal).toFixed(2));

    const now = new Date();
    const dateFormatted = `${String(now.getDate()).padStart(2, '0')}/${String(
      now.getMonth() + 1
    ).padStart(2, '0')}/${now.getFullYear()} ${now.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    })}`;

    const newBill: RadiologyBillRecord = {
      id: `rad-bill-${Date.now()}`,
      billNo: `RADIOB ${843 + bills.length}`,
      caseId: formCaseId || '-',
      date: dateFormatted,
      patientName: formPatientName.trim(),
      patientId: `${1170 + bills.length}`,
      doctorName: formDoctorName,
      radiologistName: formRadiologistName,
      testName: matchedTest.testName,
      testCode: matchedTest.testCode,
      modality: matchedTest.modality,
      amount: amountVal,
      discountAmount: formDiscount,
      discountPercent: amountVal > 0 ? Number(((formDiscount / amountVal) * 100).toFixed(1)) : 0,
      taxAmount: taxVal,
      taxPercent: 5,
      netAmount: netVal,
      paidAmount: paidVal,
      balanceAmount: balanceVal,
      reportStatus: 'In Process',
      filmUploaded: false,
    };

    setBills((prev) => [newBill, ...prev]);
    setShowGenerateModal(false);
    setFormPatientName('');
  };

  const handleAddTestSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTestName.trim() || !newTestCode.trim()) return;

    const newTest: RadiologyTestCatalog = {
      id: `rad-cat-${Date.now()}`,
      testCode: newTestCode.trim(),
      testName: newTestName.trim(),
      modality: newModality,
      subCategory: newSubCategory,
      turnaroundTime: newTAT,
      roomOrMachine: newMachine,
      standardCharge: newCharge,
    };

    setTests((prev) => [...prev, newTest]);
    setShowAddTestModal(false);
    setNewTestCode('');
    setNewTestName('');
  };

  // Columns for Radiology Bill Table
  const billColumns: DataTableColumn<RadiologyBillRecord>[] = [
    {
      key: 'billNo',
      header: 'Bill No',
      sortable: true,
      sortValue: (r) => r.billNo,
      render: (r: RadiologyBillRecord) => (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setSelectedBill(r);
          }}
          className="text-[#0094b6] hover:underline font-bold text-left cursor-pointer whitespace-nowrap"
        >
          {r.billNo}
        </button>
      ),
    },
    {
      key: 'caseId',
      header: 'Case ID',
      align: 'center',
      sortable: true,
      sortValue: (r) => r.caseId,
      render: (r: RadiologyBillRecord) => (
        <span className="text-slate-700 font-semibold">{r.caseId}</span>
      ),
    },
    {
      key: 'date',
      header: 'Date',
      sortable: true,
      sortValue: (r) => r.date,
      render: (r: RadiologyBillRecord) => (
        <span className="text-slate-800 whitespace-nowrap font-medium text-[10.5px]">
          {r.date}
        </span>
      ),
    },
    {
      key: 'patientName',
      header: 'Patient Name',
      sortable: true,
      sortValue: (r) => r.patientName,
      render: (r: RadiologyBillRecord) => (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setSelectedBill(r);
          }}
          className="text-slate-900 font-semibold hover:text-[#0094b6] hover:underline text-left cursor-pointer whitespace-nowrap"
        >
          {r.patientName}
        </button>
      ),
    },
    {
      key: 'testInfo',
      header: 'Test Name & Code',
      sortable: true,
      sortValue: (r) => r.testName,
      render: (r: RadiologyBillRecord) => (
        <div className="leading-tight">
          <div className="font-semibold text-slate-800 text-[11px]">{r.testName}</div>
          <div className="text-[10px] text-slate-500 font-mono">{r.testCode}</div>
        </div>
      ),
    },
    {
      key: 'modality',
      header: 'Modality',
      align: 'center',
      sortable: true,
      sortValue: (r) => r.modality,
      render: (r: RadiologyBillRecord) => (
        <span
          className={`px-1.5 py-0.5 rounded-[3px] font-bold text-[10px] ${r.modality === 'MRI'
            ? 'bg-purple-50 text-purple-800 border border-purple-200'
            : r.modality === 'CT Scan'
              ? 'bg-amber-50 text-amber-800 border border-amber-200'
              : r.modality === 'Ultrasound'
                ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                : 'bg-sky-50 text-sky-800 border border-sky-200'
            }`}
        >
          {r.modality}
        </span>
      ),
    },
    {
      key: 'doctorName',
      header: 'Consultant',
      render: (r: RadiologyBillRecord) => (
        <span className="text-slate-700 whitespace-nowrap">{r.doctorName}</span>
      ),
    },
    {
      key: 'netAmount',
      header: 'Net Amount ($)',
      align: 'right',
      sortable: true,
      sortValue: (r) => r.netAmount,
      render: (r: RadiologyBillRecord) => (
        <span className="font-bold text-slate-900">{r.netAmount.toFixed(2)}</span>
      ),
    },
    {
      key: 'paidAmount',
      header: 'Paid Amount ($)',
      align: 'right',
      sortable: true,
      sortValue: (r) => r.paidAmount,
      render: (r: RadiologyBillRecord) => (
        <span className="font-semibold text-emerald-700">{r.paidAmount.toFixed(2)}</span>
      ),
    },
    {
      key: 'balanceAmount',
      header: 'Balance ($)',
      align: 'right',
      sortable: true,
      sortValue: (r) => r.balanceAmount,
      render: (r: RadiologyBillRecord) => (
        <span
          className={`font-semibold ${r.balanceAmount > 0 ? 'text-rose-600' : 'text-slate-700'
            }`}
        >
          {r.balanceAmount.toFixed(2)}
        </span>
      ),
    },
    {
      key: 'reportStatus',
      header: 'Report Status',
      align: 'center',
      sortable: true,
      sortValue: (r) => r.reportStatus,
      render: (r: RadiologyBillRecord) => (
        <span
          className={`px-1.5 py-0.5 rounded-[3px] font-semibold text-[10px] ${r.reportStatus === 'Completed & Signed'
            ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
            : r.reportStatus === 'In Process'
              ? 'bg-amber-50 text-amber-800 border border-amber-200'
              : 'bg-sky-50 text-sky-800 border border-sky-200'
            }`}
        >
          {r.reportStatus}
        </span>
      ),
    },
    {
      key: 'action',
      header: 'Action',
      align: 'center',
      render: (r: RadiologyBillRecord, idx?: number) => {
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
                      setSelectedBill(r);
                      setActiveActionId(null);
                    }}
                    className="w-full text-left px-2.5 py-1.5 text-[11px] text-slate-700 hover:bg-[#f0f8fa] hover:text-[#0094b6] font-medium flex items-center gap-2 cursor-pointer transition-colors"
                  >
                    <Eye className="w-3.5 h-3.5 text-[#0094b6]" />
                    <span>View Report</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedBill(r);
                      setActiveActionId(null);
                      setTimeout(() => window.print(), 150);
                    }}
                    className="w-full text-left px-2.5 py-1.5 text-[11px] text-slate-700 hover:bg-slate-50 font-medium flex items-center gap-2 cursor-pointer transition-colors"
                  >
                    <Printer className="w-3.5 h-3.5 text-slate-500" />
                    <span>Print Bill / Slip</span>
                  </button>
                  {r.reportStatus !== 'Completed & Signed' && (
                    <button
                      type="button"
                      onClick={() => {
                        setBills((prev) =>
                          prev.map((item) =>
                            item.id === r.id
                              ? { ...item, reportStatus: 'Completed & Signed', filmUploaded: true }
                              : item
                          )
                        );
                        setActiveActionId(null);
                      }}
                      className="w-full text-left px-2.5 py-1.5 text-[11px] text-emerald-700 hover:bg-emerald-50 font-medium flex items-center gap-2 cursor-pointer transition-colors"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Sign-off Report</span>
                    </button>
                  )}
                </div>
                <div className="py-0.5">
                  <button
                    type="button"
                    onClick={() => {
                      setBills((prev) => prev.filter((item) => item.id !== r.id));
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

  // Columns for Radiology Tests Catalog Table
  const testColumns: DataTableColumn<RadiologyTestCatalog>[] = [
    {
      key: 'testCode',
      header: 'Test Code',
      sortable: true,
      sortValue: (r) => r.testCode,
      render: (r: RadiologyTestCatalog) => (
        <span className="font-bold text-[#0094b6] font-mono text-[11px]">{r.testCode}</span>
      ),
    },
    {
      key: 'testName',
      header: 'Test Name',
      sortable: true,
      sortValue: (r) => r.testName,
      render: (r: RadiologyTestCatalog) => (
        <span className="font-semibold text-slate-900">{r.testName}</span>
      ),
    },
    {
      key: 'modality',
      header: 'Modality',
      align: 'center',
      sortable: true,
      sortValue: (r) => r.modality,
      render: (r: RadiologyTestCatalog) => (
        <span
          className={`px-1.5 py-0.5 rounded-[3px] font-bold text-[10px] ${r.modality === 'MRI'
            ? 'bg-purple-50 text-purple-800 border border-purple-200'
            : r.modality === 'CT Scan'
              ? 'bg-amber-50 text-amber-800 border border-amber-200'
              : 'bg-sky-50 text-sky-800 border border-sky-200'
            }`}
        >
          {r.modality}
        </span>
      ),
    },
    {
      key: 'subCategory',
      header: 'Sub Category',
      render: (r: RadiologyTestCatalog) => r.subCategory,
    },
    {
      key: 'roomOrMachine',
      header: 'Imaging Suite / Equipment',
      render: (r: RadiologyTestCatalog) => (
        <span className="text-slate-600 truncate max-w-xs block">{r.roomOrMachine}</span>
      ),
    },
    {
      key: 'turnaroundTime',
      header: 'TAT (Report)',
      render: (r: RadiologyTestCatalog) => r.turnaroundTime,
    },
    {
      key: 'standardCharge',
      header: 'Standard Charge ($)',
      align: 'right',
      sortable: true,
      sortValue: (r) => r.standardCharge,
      render: (r: RadiologyTestCatalog) => (
        <span className="font-bold text-slate-900">${r.standardCharge.toFixed(2)}</span>
      ),
    },
    {
      key: 'action',
      header: 'Action',
      align: 'center',
      render: (r: RadiologyTestCatalog) => (
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

  // Toolbar Filters matching PatientDirectory
  const toolbarFilters = (
    <div className="relative">
      <select
        aria-label="Filter by radiology section"
        value={activeTab}
        onChange={(e) => setActiveTab(e.target.value as RadiologyTab)}
        className="h-8 pl-2.5 pr-7 rounded-[3px] border border-slate-200 bg-white text-xs font-medium text-slate-700 appearance-none focus:outline-none focus:border-[#0094b6] cursor-pointer"
      >
        <option value="bills">Radiology Bills Registry</option>
        <option value="tests">Radiology Tests Catalog</option>
      </select>
      <ChevronDown className="w-3.5 h-3.5 text-slate-400 pointer-events-none absolute right-2 top-1/2 -translate-y-1/2" />
    </div>
  );

  // Toolbar Actions matching PatientDirectory
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
        <span>Add Radiology Test</span>
      </button>
    </div>
  );

  return (
    <div className="space-y-2 min-w-0 w-full overflow-hidden">
      {/* 4 Summary Metric Cards matching PatientDirectory format */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
        <div className="bg-white border border-slate-300 rounded-[3px] p-2.5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[10.5px] font-bold text-slate-700">Total Scans Today</span>
            <Scan className="w-3.5 h-3.5 text-[#0094b6]" />
          </div>
          <div className="my-1">
            <span className="text-base font-extrabold text-slate-900 leading-none">
              {telemetry.totalOrders} Orders
            </span>
          </div>
          <p className="text-[10px] text-slate-500">X-Ray, CT 128, 3T MRI, USG scans</p>
        </div>

        <div className="bg-white border border-slate-300 rounded-[3px] p-2.5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[10.5px] font-bold text-slate-700">Signed Reports</span>
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
          </div>
          <div className="my-1">
            <span className="text-base font-extrabold text-emerald-700 leading-none">
              {telemetry.completed} Delivered
            </span>
          </div>
          <p className="text-[10px] text-slate-500">DICOM PACS film &amp; verified report ready</p>
        </div>

        <div className="bg-white border border-slate-300 rounded-[3px] p-2.5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[10.5px] font-bold text-slate-700">Scanning In Process</span>
            <Clock className="w-3.5 h-3.5 text-amber-500" />
          </div>
          <div className="my-1">
            <span className="text-base font-extrabold text-amber-600 leading-none">
              {telemetry.inProcess} In Suite
            </span>
          </div>
          <p className="text-[10px] text-slate-500">Currently active on diagnostic imaging suites</p>
        </div>

        <div className="bg-white border border-slate-300 rounded-[3px] p-2.5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[10.5px] font-bold text-slate-700">Pending Radiologist</span>
            <FileText className="w-3.5 h-3.5 text-sky-600" />
          </div>
          <div className="my-1">
            <span className="text-base font-extrabold text-sky-700 leading-none">
              {telemetry.pendingReview} Awaiting
            </span>
          </div>
          <p className="text-[10px] text-slate-500">Diagnostic reading and digital signature</p>
        </div>
      </div>

      {/* Selected Radiology Report Quick View Card matching Patient quick view styling */}
      {selectedBill && (
        <div className="bg-white border border-[#0094b6]/30 rounded-md p-4">
          <div className="flex flex-wrap items-start justify-between gap-3 border-b border-slate-100 pb-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-[3px] bg-[#f0f8fa] text-[#0094b6] font-bold text-sm flex items-center justify-center">
                <Scan className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="text-sm font-semibold text-slate-900">{selectedBill.billNo}</h3>
                  <span className="px-2 py-0.5 rounded-[3px] bg-slate-100 text-slate-700 text-[11px] font-medium">
                    Case #{selectedBill.caseId}
                  </span>
                  <span className="px-2 py-0.5 rounded-[3px] bg-purple-50 text-purple-700 border border-purple-200 text-[11px] font-semibold">
                    {selectedBill.modality}
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded-[3px] border text-[11px] font-semibold ${selectedBill.reportStatus === 'Completed & Signed'
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                      : 'bg-amber-50 text-amber-700 border-amber-200'
                      }`}
                  >
                    {selectedBill.reportStatus}
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  Patient: <strong className="text-slate-800">{selectedBill.patientName}</strong> · Test: {selectedBill.testName}
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
                <span>Print Report Slip</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedBill(null)}
                className="w-8 h-8 rounded-[3px] border border-slate-200 text-slate-500 hover:text-slate-800 hover:bg-slate-50 flex items-center justify-center cursor-pointer"
                aria-label="Close radiology report view"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 text-xs">
            <div>
              <p className="text-[11px] text-slate-400">Consultant Radiologist</p>
              <p className="font-semibold text-slate-800">{selectedBill.radiologistName}</p>
            </div>
            <div>
              <p className="text-[11px] text-slate-400">Prescribing Doctor</p>
              <p className="font-medium text-slate-800">{selectedBill.doctorName}</p>
            </div>
            <div>
              <p className="text-[11px] text-slate-400">Net Scan Charge</p>
              <p className="font-bold text-slate-900">${selectedBill.netAmount.toFixed(2)}</p>
            </div>
            <div>
              <p className="text-[11px] text-slate-400">Paid Amount</p>
              <p className="font-bold text-emerald-700">${selectedBill.paidAmount.toFixed(2)}</p>
            </div>
          </div>
        </div>
      )}

      {/* Active Tab Table with Reusable DataTable */}
      {activeTab === 'bills' ? (
        <DataTable<RadiologyBillRecord>
          title="Radiology Bills Registry"
          subtitle="Imaging test orders, procedure billings, PACS image records, and radiologist reports"
          data={bills}
          columns={billColumns}
          rowKey={(r) => r.id}
          searchable
          searchPlaceholder="Search by bill no, patient, doctor, test, or modality..."
          searchFilter={(r, q) =>
            r.billNo.toLowerCase().includes(q) ||
            r.patientName.toLowerCase().includes(q) ||
            r.doctorName.toLowerCase().includes(q) ||
            r.testName.toLowerCase().includes(q) ||
            r.testCode.toLowerCase().includes(q) ||
            r.modality.toLowerCase().includes(q)
          }
          toolbarFilters={toolbarFilters}
          toolbarActions={toolbarActions}
          defaultPageSize={8}
          pageSizeOptions={[8, 12, 20, 30, 50, 100]}
          emptyTitle="No radiology bills found"
          emptyDescription="No radiology imaging test orders matching the filter."
        />
      ) : (
        <DataTable<RadiologyTestCatalog>
          title="Radiology Tests Directory"
          subtitle="Hospital standard diagnostic radiology test catalog, modalities, and machines"
          data={tests}
          columns={testColumns}
          rowKey={(r) => r.id}
          searchable
          searchPlaceholder="Search by test code, name, modality, or suite..."
          searchFilter={(r, q) =>
            r.testCode.toLowerCase().includes(q) ||
            r.testName.toLowerCase().includes(q) ||
            r.modality.toLowerCase().includes(q) ||
            r.roomOrMachine.toLowerCase().includes(q)
          }
          toolbarFilters={toolbarFilters}
          toolbarActions={toolbarActions}
          defaultPageSize={8}
          pageSizeOptions={[8, 12, 20, 30, 50, 100]}
          emptyTitle="No radiology tests catalogued"
          emptyDescription="No test procedures registered in catalog."
        />
      )}

      {/* Modal: Generate Radiology Bill */}
      {showGenerateModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/40 backdrop-blur-xs flex items-center justify-center p-3">
          <div className="bg-white rounded-[3px] border border-slate-300 shadow-xl w-full max-w-xl p-3.5 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-200 pb-2">
              <div className="flex items-center gap-1.5">
                <Scan className="w-4 h-4 text-[#0094b6]" />
                <h3 className="text-xs font-bold text-slate-900">
                  Generate Radiology Bill &amp; Scan Order
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowGenerateModal(false)}
                className="w-5 h-5 rounded-[3px] text-slate-400 hover:text-slate-700 flex items-center justify-center cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            <form onSubmit={handleGenerateBillSubmit} className="space-y-2.5 text-[11px]">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[10.5px] font-semibold text-slate-700 mb-0.5">
                    Patient Name (UHID) *
                  </label>
                  <input
                    type="text"
                    required
                    value={formPatientName}
                    onChange={(e) => setFormPatientName(e.target.value)}
                    placeholder="e.g. Rachel Priest (1162)"
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
                    className="w-full h-7 px-2 border border-slate-300 rounded-[3px] text-[11px] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10.5px] font-semibold text-slate-700 mb-0.5">
                  Select Radiology Test *
                </label>
                <select
                  value={selectedTestId}
                  onChange={(e) => setSelectedTestId(e.target.value)}
                  className="w-full h-7 px-2 border border-slate-300 rounded-[3px] bg-white text-[11px] focus:outline-none"
                >
                  {tests.map((t) => (
                    <option key={t.id} value={t.id}>
                      [{t.modality}] {t.testName} (${t.standardCharge.toFixed(2)}) - {t.turnaroundTime}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[10.5px] font-semibold text-slate-700 mb-0.5">
                    Consultant Doctor
                  </label>
                  <select
                    value={formDoctorName}
                    onChange={(e) => setFormDoctorName(e.target.value)}
                    className="w-full h-7 px-2 border border-slate-300 rounded-[3px] bg-white text-[11px] focus:outline-none"
                  >
                    <option value="Dr. Reyan Jain (9011)">Dr. Reyan Jain (9011)</option>
                    <option value="Dr. Kamrul Islam (9014)">Dr. Kamrul Islam (9014)</option>
                    <option value="Dr. Farhana Yasmin (9013)">Dr. Farhana Yasmin (9013)</option>
                    <option value="Dr. Tariqul Anwar (9015)">Dr. Tariqul Anwar (9015)</option>
                    <option value="Prof. Dr. Tanvir Ahmed (9010)">Prof. Dr. Tanvir Ahmed (9010)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10.5px] font-semibold text-slate-700 mb-0.5">
                    Assigned Radiologist
                  </label>
                  <select
                    value={formRadiologistName}
                    onChange={(e) => setFormRadiologistName(e.target.value)}
                    className="w-full h-7 px-2 border border-slate-300 rounded-[3px] bg-white text-[11px] focus:outline-none"
                  >
                    <option value="Dr. Sabrina Karim (Radiologist)">Dr. Sabrina Karim (Radiologist)</option>
                    <option value="Dr. Mahmudul Hasan (Consultant)">Dr. Mahmudul Hasan (Consultant)</option>
                  </select>
                </div>
              </div>

              {/* Financial Calculation Row */}
              <div className="grid grid-cols-3 gap-2 p-2 bg-slate-50 border border-slate-200 rounded-[3px]">
                <div>
                  <label className="block text-[10px] font-semibold text-slate-700 mb-0.5">
                    Discount ($)
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={formDiscount}
                    onChange={(e) => setFormDiscount(Number(e.target.value))}
                    className="w-full h-7 px-2 border border-slate-300 rounded-[3px] text-[11px] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-semibold text-slate-700 mb-0.5">
                    Tax Rate
                  </label>
                  <input
                    type="text"
                    disabled
                    value="5.00% VAT"
                    className="w-full h-7 px-2 border border-slate-200 rounded-[3px] text-[11px] bg-slate-100 text-slate-500"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-semibold text-slate-700 mb-0.5">
                    Paid Amount ($)
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={formPaidAmount}
                    onChange={(e) => setFormPaidAmount(Number(e.target.value))}
                    className="w-full h-7 px-2 border border-slate-300 rounded-[3px] text-[11px] focus:outline-none font-bold text-emerald-700"
                  />
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end gap-1.5 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setShowGenerateModal(false)}
                  className="h-7 px-2.5 border border-slate-300 rounded-[3px] text-[11px] text-slate-700 hover:bg-slate-100 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="h-7 px-3 bg-[#0094b6] hover:bg-[#007f9c] text-white rounded-[3px] text-[11px] font-semibold cursor-pointer shadow-xs"
                >
                  Confirm Scan Order &amp; Print
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Add Radiology Test */}
      {showAddTestModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/40 backdrop-blur-xs flex items-center justify-center p-3">
          <div className="bg-white rounded-[3px] border border-slate-300 shadow-xl w-full max-w-md p-3.5 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-200 pb-2">
              <div className="flex items-center gap-1.5">
                <FlaskConical className="w-4 h-4 text-[#006a4e]" />
                <h3 className="text-xs font-bold text-slate-900">
                  Register New Radiology Procedure
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowAddTestModal(false)}
                className="w-5 h-5 rounded-[3px] text-slate-400 hover:text-slate-700 flex items-center justify-center cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            <form onSubmit={handleAddTestSubmit} className="space-y-2.5 text-[11px]">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[10.5px] font-semibold text-slate-700 mb-0.5">
                    Test Code *
                  </label>
                  <input
                    type="text"
                    required
                    value={newTestCode}
                    onChange={(e) => setNewTestCode(e.target.value)}
                    placeholder="e.g. MRI-KNEE"
                    className="w-full h-7 px-2 border border-slate-300 rounded-[3px] text-[11px] focus:outline-none font-mono"
                  />
                </div>

                <div>
                  <label className="block text-[10.5px] font-semibold text-slate-700 mb-0.5">
                    Modality *
                  </label>
                  <select
                    value={newModality}
                    onChange={(e) => setNewModality(e.target.value as any)}
                    className="w-full h-7 px-2 border border-slate-300 rounded-[3px] bg-white text-[11px] focus:outline-none"
                  >
                    <option value="X-Ray">X-Ray</option>
                    <option value="CT Scan">CT Scan</option>
                    <option value="MRI">MRI</option>
                    <option value="Ultrasound">Ultrasound</option>
                    <option value="Echocardiography">Echocardiography</option>
                    <option value="Mammography">Mammography</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[10.5px] font-semibold text-slate-700 mb-0.5">
                  Test Name *
                </label>
                <input
                  type="text"
                  required
                  value={newTestName}
                  onChange={(e) => setNewTestName(e.target.value)}
                  placeholder="e.g. MRI Knee Joint with Contrast"
                  className="w-full h-7 px-2 border border-slate-300 rounded-[3px] text-[11px] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[10.5px] font-semibold text-slate-700 mb-0.5">
                    Sub Category
                  </label>
                  <input
                    type="text"
                    value={newSubCategory}
                    onChange={(e) => setNewSubCategory(e.target.value)}
                    className="w-full h-7 px-2 border border-slate-300 rounded-[3px] text-[11px] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[10.5px] font-semibold text-slate-700 mb-0.5">
                    Standard Charge ($)
                  </label>
                  <input
                    type="number"
                    min={1}
                    value={newCharge}
                    onChange={(e) => setNewCharge(Number(e.target.value))}
                    className="w-full h-7 px-2 border border-slate-300 rounded-[3px] text-[11px] focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[10.5px] font-semibold text-slate-700 mb-0.5">
                    Turnaround Time
                  </label>
                  <input
                    type="text"
                    value={newTAT}
                    onChange={(e) => setNewTAT(e.target.value)}
                    className="w-full h-7 px-2 border border-slate-300 rounded-[3px] text-[11px] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[10.5px] font-semibold text-slate-700 mb-0.5">
                    Imaging Suite / Machine
                  </label>
                  <input
                    type="text"
                    value={newMachine}
                    onChange={(e) => setNewMachine(e.target.value)}
                    className="w-full h-7 px-2 border border-slate-300 rounded-[3px] text-[11px] focus:outline-none"
                  />
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end gap-1.5 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setShowAddTestModal(false)}
                  className="h-7 px-2.5 border border-slate-300 rounded-[3px] text-[11px] text-slate-700 hover:bg-slate-100 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="h-7 px-3 bg-[#006a4e] hover:bg-[#00523c] text-white rounded-[3px] text-[11px] font-semibold cursor-pointer shadow-xs"
                >
                  Add Test Procedure
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default RadiologyDirectory;
