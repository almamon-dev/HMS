import {
  AlertCircle,
  ChevronDown,
  Coins,
  CreditCard,
  Eye,
  FileSpreadsheet,
  Menu,
  MoreVertical,
  Pill,
  Plus,
  Printer,
  Receipt,
  RotateCcw,
  Trash2,
  User,
  X,
} from 'lucide-react';
import React, { useEffect, useMemo, useState } from 'react';
import {
  PHARMACY_MEDICINE_INVENTORY,
  SMART_PHARMACY_BILLS,
  SmartPharmacyBillRecord,
} from '../../../data/superadminPharmacyData';
import { DataTable, DataTableColumn } from '../../common/DataTable';

type PharmacyViewMode = 'all' | 'return-bills';
type PaymentStatusFilter = 'all' | 'paid' | 'due';

export const PharmacyDirectory: React.FC = () => {
  const [bills, setBills] = useState<SmartPharmacyBillRecord[]>(SMART_PHARMACY_BILLS);
  const [viewMode, setViewMode] = useState<PharmacyViewMode>('all');
  const [statusFilter, setStatusFilter] = useState<PaymentStatusFilter>('all');
  const [selectedBill, setSelectedBill] = useState<SmartPharmacyBillRecord | null>(null);
  const [showGenerateModal, setShowGenerateModal] = useState(false);
  const [showReturnModal, setShowReturnModal] = useState(false);
  const [showMedicinesDrawer, setShowMedicinesDrawer] = useState(false);
  const [activeActionId, setActiveActionId] = useState<string | null>(null);

  // Generate Bill Form State
  const [formPatientName, setFormPatientName] = useState('');
  const [formCaseId, setFormCaseId] = useState('7495');
  const [formDoctorName, setFormDoctorName] = useState('Reyan Jain (9011)');
  const [selectedMedicineId, setSelectedMedicineId] = useState('med-01');
  const [selectedMedicineQty, setSelectedMedicineQty] = useState(10);
  const [formDiscountPercent, setFormDiscountPercent] = useState(0);
  const [formTaxPercent, setFormTaxPercent] = useState(5);
  const [formPaidAmount, setFormPaidAmount] = useState(150);

  // Return Bill Form State
  const [returnBillNo, setReturnBillNo] = useState('');
  const [returnReason, setReturnReason] = useState('Patient prescribed alternative medicine');
  const [returnAmount, setReturnAmount] = useState(50);

  useEffect(() => {
    const handleOutside = () => setActiveActionId(null);
    window.addEventListener('click', handleOutside);
    return () => window.removeEventListener('click', handleOutside);
  }, []);

  // Summary statistics matching PatientDirectory 4-Card format
  const stats = useMemo(() => {
    const total = bills.length;
    const totalRevenue = bills.reduce((sum, b) => sum + b.netAmount, 0);
    const pendingBalance = bills.reduce((sum, b) => sum + b.balanceAmount, 0);
    const returnsCount = bills.filter((b) => b.isReturn || b.refundAmount > 0).length;
    return { total, totalRevenue, pendingBalance, returnsCount };
  }, [bills]);

  const filteredBills = useMemo(() => {
    return bills.filter((b) => {
      const matchView = viewMode === 'all' || (b.isReturn || b.refundAmount > 0);
      const matchStatus =
        statusFilter === 'all'
          ? true
          : statusFilter === 'paid'
            ? b.balanceAmount <= 0
            : b.balanceAmount > 0;
      return matchView && matchStatus;
    });
  }, [bills, viewMode, statusFilter]);

  const handleGenerateBillSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formPatientName.trim()) return;

    const medStock =
      PHARMACY_MEDICINE_INVENTORY.find((m) => m.id === selectedMedicineId) ||
      PHARMACY_MEDICINE_INVENTORY[0];

    const itemAmount = Number((medStock.salePrice * selectedMedicineQty).toFixed(2));
    const discountVal = Number(((itemAmount * formDiscountPercent) / 100).toFixed(2));
    const taxableAmount = itemAmount - discountVal;
    const taxVal = Number(((taxableAmount * formTaxPercent) / 100).toFixed(2));
    const netTotal = Number((taxableAmount + taxVal).toFixed(2));
    const paidVal = Math.min(netTotal, formPaidAmount);
    const balanceVal = Number((netTotal - paidVal).toFixed(2));

    const nextBillNum = 621 + bills.length;
    const now = new Date();
    const dateFormatted = `${String(now.getDate()).padStart(2, '0')}/${String(
      now.getMonth() + 1
    ).padStart(2, '0')}/${now.getFullYear()} ${now.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    })}`;

    const newBill: SmartPharmacyBillRecord = {
      id: `pharm-${Date.now()}`,
      billNo: `PHARMAB ${nextBillNum}`,
      caseId: formCaseId || '-',
      date: dateFormatted,
      patientName: formPatientName.trim(),
      patientId: `${1170 + bills.length}`,
      generatedBy: 'Super Admin (9001)',
      doctorName: formDoctorName,
      amount: itemAmount,
      discountAmount: discountVal,
      discountPercent: formDiscountPercent,
      taxAmount: taxVal,
      taxPercent: formTaxPercent,
      netAmount: netTotal,
      paidAmount: paidVal,
      refundAmount: 0.0,
      balanceAmount: balanceVal,
      items: [
        {
          medicineName: medStock.name,
          batchNo: medStock.batchNo,
          expiryDate: medStock.expiry,
          quantity: selectedMedicineQty,
          unitPrice: medStock.salePrice,
          amount: itemAmount,
        },
      ],
    };

    setBills((prev) => [newBill, ...prev]);
    setSelectedBill(newBill);
    setShowGenerateModal(false);
    setFormPatientName('');
  };

  const handleReturnSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!returnBillNo.trim()) return;

    setBills((prev) =>
      prev.map((b) => {
        if (b.billNo.toLowerCase().includes(returnBillNo.trim().toLowerCase())) {
          return {
            ...b,
            refundAmount: returnAmount,
            netAmount: Number((b.netAmount - returnAmount).toFixed(2)),
            isReturn: true,
          };
        }
        return b;
      })
    );

    setShowReturnModal(false);
    setReturnBillNo('');
  };

  const handleDeleteBill = (id: string) => {
    setBills((prev) => prev.filter((b) => b.id !== id));
    if (selectedBill?.id === id) {
      setSelectedBill(null);
    }
  };

  // Columns matching Patient standard and reference image
  const columns: DataTableColumn<SmartPharmacyBillRecord>[] = [
    {
      key: 'billNo',
      header: 'Bill No',
      sortable: true,
      sortValue: (r) => r.billNo,
      render: (r: SmartPharmacyBillRecord) => (
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
      render: (r: SmartPharmacyBillRecord) => (
        <span className="text-slate-700 font-semibold">{r.caseId}</span>
      ),
    },
    {
      key: 'date',
      header: 'Date',
      sortable: true,
      sortValue: (r) => r.date,
      render: (r: SmartPharmacyBillRecord) => (
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
      render: (r: SmartPharmacyBillRecord) => (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setSelectedBill(r);
          }}
          className="text-slate-900 font-medium hover:text-[#0094b6] hover:underline text-left cursor-pointer whitespace-nowrap"
        >
          {r.patientName}
        </button>
      ),
    },
    {
      key: 'generatedBy',
      header: 'Generated By',
      render: (r: SmartPharmacyBillRecord) => (
        <span className="text-slate-700 whitespace-nowrap">{r.generatedBy}</span>
      ),
    },
    {
      key: 'doctorName',
      header: 'Doctor Name',
      sortable: true,
      sortValue: (r) => r.doctorName,
      render: (r: SmartPharmacyBillRecord) => (
        <span className="text-slate-800 font-medium whitespace-nowrap">{r.doctorName}</span>
      ),
    },
    {
      key: 'amount',
      header: 'Amount ($)',
      align: 'right',
      sortable: true,
      sortValue: (r) => r.amount,
      render: (r: SmartPharmacyBillRecord) => r.amount.toFixed(2),
    },
    {
      key: 'discount',
      header: 'Discount ($)',
      align: 'right',
      render: (r: SmartPharmacyBillRecord) =>
        `${r.discountAmount.toFixed(2)} (${r.discountPercent.toFixed(2)}%)`,
    },
    {
      key: 'tax',
      header: 'Tax ($)',
      align: 'right',
      render: (r: SmartPharmacyBillRecord) =>
        `${r.taxAmount.toFixed(2)} (${r.taxPercent.toFixed(2)}%)`,
    },
    {
      key: 'netAmount',
      header: 'Net Amount ($)',
      align: 'right',
      sortable: true,
      sortValue: (r) => r.netAmount,
      render: (r: SmartPharmacyBillRecord) => (
        <span className="font-bold text-slate-900">{r.netAmount.toFixed(2)}</span>
      ),
    },
    {
      key: 'paidAmount',
      header: 'Paid Amount ($)',
      align: 'right',
      sortable: true,
      sortValue: (r) => r.paidAmount,
      render: (r: SmartPharmacyBillRecord) => (
        <span className="font-semibold text-emerald-700">{r.paidAmount.toFixed(2)}</span>
      ),
    },
    {
      key: 'refundAmount',
      header: 'Refund ($)',
      align: 'right',
      render: (r: SmartPharmacyBillRecord) => r.refundAmount.toFixed(2),
    },
    {
      key: 'balanceAmount',
      header: 'Balance ($)',
      align: 'right',
      sortable: true,
      sortValue: (r) => r.balanceAmount,
      render: (r: SmartPharmacyBillRecord) => (
        <span
          className={`font-semibold ${r.balanceAmount > 0 ? 'text-rose-600' : 'text-slate-700'
            }`}
        >
          {r.balanceAmount.toFixed(2)}
        </span>
      ),
    },
    {
      key: 'action',
      header: 'Action',
      align: 'center',
      render: (r: SmartPharmacyBillRecord, idx?: number) => {
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
                    <span>View Bill</span>
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
                    <span>Print Bill</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setReturnBillNo(r.billNo);
                      setShowReturnModal(true);
                      setActiveActionId(null);
                    }}
                    className="w-full text-left px-2.5 py-1.5 text-[11px] text-slate-700 hover:bg-amber-50 hover:text-amber-700 font-medium flex items-center gap-2 cursor-pointer transition-colors"
                  >
                    <RotateCcw className="w-3.5 h-3.5 text-amber-500" />
                    <span>Sale Return</span>
                  </button>
                </div>
                <div className="py-0.5">
                  <button
                    type="button"
                    onClick={() => {
                      handleDeleteBill(r.id);
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

  // Toolbar Filters matching PatientDirectory dropdowns
  const toolbarFilters = (
    <>
      <div className="relative">
        <select
          aria-label="Filter by invoice type"
          value={viewMode}
          onChange={(e) => setViewMode(e.target.value as PharmacyViewMode)}
          className="h-8 pl-2.5 pr-7 rounded-[3px] border border-slate-200 bg-white text-xs font-medium text-slate-700 appearance-none focus:outline-none focus:border-[#0094b6] cursor-pointer"
        >
          <option value="all">All Pharmacy Bills</option>
          <option value="return-bills">Sale Return Bills</option>
        </select>
        <ChevronDown className="w-3.5 h-3.5 text-slate-400 pointer-events-none absolute right-2 top-1/2 -translate-y-1/2" />
      </div>

      <div className="relative">
        <select
          aria-label="Filter by payment status"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as PaymentStatusFilter)}
          className="h-8 pl-2.5 pr-7 rounded-[3px] border border-slate-200 bg-white text-xs font-medium text-slate-700 appearance-none focus:outline-none focus:border-[#0094b6] cursor-pointer"
        >
          <option value="all">All Payment Status</option>
          <option value="paid">Fully Paid</option>
          <option value="due">Has Balance Due</option>
        </select>
        <ChevronDown className="w-3.5 h-3.5 text-slate-400 pointer-events-none absolute right-2 top-1/2 -translate-y-1/2" />
      </div>
    </>
  );

  // Toolbar Actions matching PatientDirectory style and Smart Hospital Reference
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
        onClick={() => setShowReturnModal(true)}
        className="h-8 px-2.5 rounded-[3px] bg-amber-500 hover:bg-amber-600 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
      >
        <RotateCcw className="w-3.5 h-3.5" />
        <span>Sale Return</span>
      </button>

      <button
        type="button"
        onClick={() => setViewMode((prev) => (prev === 'return-bills' ? 'all' : 'return-bills'))}
        className={`h-8 px-2.5 rounded-[3px] text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${viewMode === 'return-bills'
          ? 'bg-slate-900 text-white'
          : 'bg-slate-700 hover:bg-slate-800 text-white'
          }`}
      >
        <FileSpreadsheet className="w-3.5 h-3.5" />
        <span>Sale Return Bills</span>
      </button>

      <button
        type="button"
        onClick={() => setShowMedicinesDrawer(true)}
        className="h-8 px-2.5 rounded-[3px] bg-[#0094b6] hover:bg-[#007f9c] text-white text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
      >
        <Menu className="w-3.5 h-3.5" />
        <span>Medicines</span>
      </button>
    </div>
  );

  return (
    <div className="space-y-2">
      {/* 4 Summary Metric Cards matching PatientDirectory format */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
        <div className="bg-white rounded-[3px] p-2.5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[10.5px] font-bold text-slate-700">Total Pharmacy Bills</span>
            <Receipt className="w-3.5 h-3.5 text-[#0094b6]" />
          </div>
          <div className="my-1">
            <span className="text-base font-extrabold text-slate-900 leading-none">
              {stats.total} Bills
            </span>
          </div>
          <p className="text-[10px] text-slate-500">Dispensed counter invoices today</p>
        </div>

        <div className="bg-white rounded-[3px] p-2.5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[10.5px] font-bold text-slate-700">Net Pharmacy Revenue</span>
            <Coins className="w-3.5 h-3.5 text-emerald-600" />
          </div>
          <div className="my-1">
            <span className="text-base font-extrabold text-emerald-700 leading-none">
              ${stats.totalRevenue.toFixed(2)}
            </span>
          </div>
          <p className="text-[10px] text-slate-500">Gross billings after discounts &amp; tax</p>
        </div>

        <div className="bg-white rounded-[3px] p-2.5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[10.5px] font-bold text-slate-700">Pending Balance Due</span>
            <AlertCircle className="w-3.5 h-3.5 text-rose-600" />
          </div>
          <div className="my-1">
            <span className="text-base font-extrabold text-rose-600 leading-none">
              ${stats.pendingBalance.toFixed(2)}
            </span>
          </div>
          <p className="text-[10px] text-slate-500">Patient credit &amp; receivable balances</p>
        </div>

        <div className="bg-white rounded-[3px] p-2.5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[10.5px] font-bold text-slate-700">Approved Sale Returns</span>
            <RotateCcw className="w-3.5 h-3.5 text-amber-500" />
          </div>
          <div className="my-1">
            <span className="text-base font-extrabold text-amber-600 leading-none">
              {stats.returnsCount} Returns
            </span>
          </div>
          <p className="text-[10px] text-slate-500">Refunded and restocked medicines</p>
        </div>
      </div>

      {/* Selected Bill Quick View Card matching Patient quick view styling */}
      {selectedBill && (
        <div className="bg-white border border-[#0094b6]/30 rounded-md p-4">
          <div className="flex flex-wrap items-start justify-between gap-3 border-b border-slate-100 pb-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-[3px] bg-[#f0f8fa] text-[#0094b6] font-bold text-sm flex items-center justify-center">
                <Pill className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="text-sm font-semibold text-slate-900">{selectedBill.billNo}</h3>
                  <span className="px-2 py-0.5 rounded-[3px] bg-slate-100 text-slate-700 text-[11px] font-medium">
                    Case #{selectedBill.caseId}
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded-[3px] border text-[11px] font-semibold ${selectedBill.balanceAmount <= 0
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                      : 'bg-rose-50 text-rose-700 border-rose-200'
                      }`}
                  >
                    {selectedBill.balanceAmount <= 0 ? 'Fully Paid' : `Due: $${selectedBill.balanceAmount.toFixed(2)}`}
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  Patient: <strong className="text-slate-800">{selectedBill.patientName}</strong> · Bill Date: {selectedBill.date}
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
                <span>Print Bill</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedBill(null)}
                className="w-8 h-8 rounded-[3px] border border-slate-200 text-slate-500 hover:text-slate-800 hover:bg-slate-50 flex items-center justify-center cursor-pointer"
                aria-label="Close invoice quick view"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 text-xs">
            <div className="flex items-center gap-2">
              <User className="w-3.5 h-3.5 text-[#0094b6] shrink-0" />
              <div>
                <p className="text-[11px] text-slate-400">Prescribing Doctor</p>
                <p className="font-medium text-slate-800">{selectedBill.doctorName}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <CreditCard className="w-3.5 h-3.5 text-[#0094b6] shrink-0" />
              <div>
                <p className="text-[11px] text-slate-400">Net Billed Amount</p>
                <p className="font-bold text-slate-900">${selectedBill.netAmount.toFixed(2)}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Coins className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <div>
                <p className="text-[11px] text-slate-400">Paid Amount</p>
                <p className="font-bold text-emerald-700">${selectedBill.paidAmount.toFixed(2)}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <AlertCircle className="w-3.5 h-3.5 text-rose-500 shrink-0" />
              <div>
                <p className="text-[11px] text-slate-400">Balance Outstanding</p>
                <p className={`font-bold ${selectedBill.balanceAmount > 0 ? 'text-rose-600' : 'text-slate-700'}`}>
                  ${selectedBill.balanceAmount.toFixed(2)}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Reusable DataTable matching PatientDirectory */}
      <DataTable<SmartPharmacyBillRecord>
        title="Pharmacy Billing Registry"
        subtitle="Dispensed prescription bills, counter sales, and return invoices"
        data={filteredBills}
        columns={columns}
        rowKey={(row) => row.id}
        searchable
        searchPlaceholder="Search by bill no, patient name, doctor, or case id..."
        searchFilter={(r, q) =>
          r.billNo.toLowerCase().includes(q) ||
          r.patientName.toLowerCase().includes(q) ||
          r.doctorName.toLowerCase().includes(q) ||
          r.caseId.toLowerCase().includes(q) ||
          r.generatedBy.toLowerCase().includes(q)
        }
        toolbarFilters={toolbarFilters}
        toolbarActions={toolbarActions}
        defaultPageSize={30}
        pageSizeOptions={[10, 20, 30, 50, 100]}
        emptyTitle="No pharmacy bills found"
        emptyDescription="There are currently no billing records matching the selected view or search query."
      />

      {/* Generate Bill Modal */}
      {showGenerateModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/40 backdrop-blur-xs flex items-center justify-center p-3">
          <div className="bg-white rounded-[3px] border border-slate-300 shadow-xl w-full max-w-xl p-3.5 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-200 pb-2">
              <div className="flex items-center gap-1.5">
                <Pill className="w-4 h-4 text-[#0094b6]" />
                <h3 className="text-xs font-bold text-slate-900">
                  Generate Pharmacy Bill
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
                    Patient Name *
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
                    placeholder="7490"
                    className="w-full h-7 px-2 border border-slate-300 rounded-[3px] text-[11px] focus:outline-none focus:border-[#0094b6]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10.5px] font-semibold text-slate-700 mb-0.5">
                  Consultant Doctor
                </label>
                <select
                  value={formDoctorName}
                  onChange={(e) => setFormDoctorName(e.target.value)}
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

              {/* Medicine Selection Row */}
              <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-[3px] space-y-2">
                <div className="text-[10.5px] font-bold text-slate-700">
                  Select Prescribed Medicine
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <div className="col-span-2">
                    <select
                      value={selectedMedicineId}
                      onChange={(e) => setSelectedMedicineId(e.target.value)}
                      className="w-full h-7 px-2 border border-slate-300 rounded-[3px] bg-white text-[11px] focus:outline-none"
                    >
                      {PHARMACY_MEDICINE_INVENTORY.map((m) => (
                        <option key={m.id} value={m.id}>
                          {m.name} (${m.salePrice.toFixed(2)}) - Stock: {m.qty}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <input
                      type="number"
                      min={1}
                      max={100}
                      value={selectedMedicineQty}
                      onChange={(e) => setSelectedMedicineQty(Number(e.target.value))}
                      className="w-full h-7 px-2 border border-slate-300 rounded-[3px] text-[11px] focus:outline-none"
                      placeholder="Qty"
                    />
                  </div>
                </div>
              </div>

              {/* Financial Calculation */}
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-[10.5px] font-semibold text-slate-700 mb-0.5">
                    Discount (%)
                  </label>
                  <input
                    type="number"
                    min={0}
                    max={100}
                    value={formDiscountPercent}
                    onChange={(e) => setFormDiscountPercent(Number(e.target.value))}
                    className="w-full h-7 px-2 border border-slate-300 rounded-[3px] text-[11px] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[10.5px] font-semibold text-slate-700 mb-0.5">
                    Tax (%)
                  </label>
                  <input
                    type="number"
                    min={0}
                    max={20}
                    value={formTaxPercent}
                    onChange={(e) => setFormTaxPercent(Number(e.target.value))}
                    className="w-full h-7 px-2 border border-slate-300 rounded-[3px] text-[11px] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[10.5px] font-semibold text-slate-700 mb-0.5">
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
                  Generate Bill &amp; Print
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Sale Return Modal */}
      {showReturnModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/40 backdrop-blur-xs flex items-center justify-center p-3">
          <div className="bg-white rounded-[3px] border border-slate-300 shadow-xl w-full max-w-md p-3.5 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-200 pb-2">
              <div className="flex items-center gap-1.5">
                <RotateCcw className="w-4 h-4 text-amber-500" />
                <h3 className="text-xs font-bold text-slate-900">
                  Process Medicine Sale Return
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowReturnModal(false)}
                className="w-5 h-5 rounded-[3px] text-slate-400 hover:text-slate-700 flex items-center justify-center cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            <form onSubmit={handleReturnSubmit} className="space-y-2.5 text-[11px]">
              <div>
                <label className="block text-[10.5px] font-semibold text-slate-700 mb-0.5">
                  Pharmacy Bill No *
                </label>
                <input
                  type="text"
                  required
                  value={returnBillNo}
                  onChange={(e) => setReturnBillNo(e.target.value)}
                  placeholder="e.g. PHARMAB 620"
                  className="w-full h-7 px-2 border border-slate-300 rounded-[3px] text-[11px] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[10.5px] font-semibold text-slate-700 mb-0.5">
                  Refund Amount ($)
                </label>
                <input
                  type="number"
                  min={1}
                  value={returnAmount}
                  onChange={(e) => setReturnAmount(Number(e.target.value))}
                  className="w-full h-7 px-2 border border-slate-300 rounded-[3px] text-[11px] focus:outline-none font-bold text-amber-600"
                />
              </div>

              <div>
                <label className="block text-[10.5px] font-semibold text-slate-700 mb-0.5">
                  Return Reason
                </label>
                <textarea
                  rows={2}
                  value={returnReason}
                  onChange={(e) => setReturnReason(e.target.value)}
                  className="w-full p-2 border border-slate-300 rounded-[3px] text-[11px] focus:outline-none"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-1.5 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setShowReturnModal(false)}
                  className="h-7 px-2.5 border border-slate-300 rounded-[3px] text-[11px] text-slate-700 hover:bg-slate-100 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="h-7 px-3 bg-amber-500 hover:bg-amber-600 text-white rounded-[3px] text-[11px] font-semibold cursor-pointer shadow-xs"
                >
                  Approve Return
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Medicines Inventory Stock Drawer / Modal */}
      {showMedicinesDrawer && (
        <div className="fixed inset-0 z-50 bg-slate-950/40 backdrop-blur-xs flex items-center justify-center p-3">
          <div className="bg-white rounded-[3px] border border-slate-300 shadow-xl w-full max-w-2xl p-3.5 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-200 pb-2">
              <div className="flex items-center gap-1.5">
                <Pill className="w-4 h-4 text-[#0094b6]" />
                <h3 className="text-xs font-bold text-slate-900">
                  Pharmacy Medicine Inventory Stock
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowMedicinesDrawer(false)}
                className="w-5 h-5 rounded-[3px] text-slate-400 hover:text-slate-700 flex items-center justify-center cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="overflow-x-auto table-hover-scrollbar max-h-96">
              <table className="w-full text-left text-[11px] border-collapse min-w-[500px]">
                <thead>
                  <tr className="bg-[#f1f5f9] text-slate-700 font-bold border-b border-slate-200 text-[10.5px]">
                    <th className="py-1.5 px-2 border-r border-slate-200/60">Medicine Name</th>
                    <th className="py-1.5 px-2 border-r border-slate-200/60">Category</th>
                    <th className="py-1.5 px-2 border-r border-slate-200/60">Batch</th>
                    <th className="py-1.5 px-2 border-r border-slate-200/60">Expiry</th>
                    <th className="py-1.5 px-2 w-16 border-r border-slate-200/60 text-center">Stock Qty</th>
                    <th className="py-1.5 px-2 w-20 text-right">Unit Price</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {PHARMACY_MEDICINE_INVENTORY.map((m) => (
                    <tr key={m.id} className="hover:bg-slate-50 transition-colors">
                      <td className="py-1.5 px-2 border-r border-slate-200/60 font-semibold text-slate-900">
                        {m.name}
                      </td>
                      <td className="py-1.5 px-2 border-r border-slate-200/60 text-slate-600">
                        {m.category}
                      </td>
                      <td className="py-1.5 px-2 border-r border-slate-200/60 text-slate-500">
                        {m.batchNo}
                      </td>
                      <td className="py-1.5 px-2 border-r border-slate-200/60 text-slate-500">
                        {m.expiry}
                      </td>
                      <td className="py-1.5 px-2 border-r border-slate-200/60 text-center font-bold text-slate-800">
                        {m.qty}
                      </td>
                      <td className="py-1.5 px-2 text-right font-semibold text-emerald-700">
                        ${m.salePrice.toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="pt-2 flex items-center justify-end border-t border-slate-200">
              <button
                type="button"
                onClick={() => setShowMedicinesDrawer(false)}
                className="h-7 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-[3px] text-[11px] font-semibold cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PharmacyDirectory;
