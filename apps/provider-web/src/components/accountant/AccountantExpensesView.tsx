import React, { useState } from 'react';
import {
  CheckCircle2,
  Landmark,
  Printer,
  Receipt,
  Scale,
  ShieldCheck,
  Stethoscope,
  Users,
  Wallet,
  X,
} from 'lucide-react';
import { SummaryCard, SummaryCardGrid } from '../common/SummaryCard';
import { DataTable, DataTableColumn } from '../common/DataTable';
import {
  EXPENSE_VOUCHERS_DATA,
  SUPPLIER_PAYABLES_DATA,
  DOCTOR_HONORARIUM_DATA,
  ExpenseVoucherRecord,
  SupplierPayableRecord,
  DoctorHonorariumRecord,
} from '../../data/accountantPortalData';

export interface PayrollSalaryRecord {
  id: string;
  employeeId: string;
  employeeName: string;
  designation: string;
  department: string;
  bankAccountNo: string;
  bankName: string;
  basicSalary: number;
  allowances: number;
  pfDeduction: number;
  taxDeduction: number;
  netPayable: number;
  paymentStatus: 'Disbursed (BEFTN)' | 'Processing' | 'On Hold';
}

export const PAYROLL_SALARY_DATA: PayrollSalaryRecord[] = [
  {
    id: 'PAY-01',
    employeeId: 'EMP-3041',
    employeeName: 'Dr. Tahmina Begum',
    designation: 'Senior Registrar (ICU)',
    department: 'Critical Care',
    bankAccountNo: '110-245-88912',
    bankName: 'City Bank Ltd',
    basicSalary: 85000,
    allowances: 35000,
    pfDeduction: 8500,
    taxDeduction: 6500,
    netPayable: 105000,
    paymentStatus: 'Disbursed (BEFTN)',
  },
  {
    id: 'PAY-02',
    employeeId: 'EMP-4412',
    employeeName: 'Sister Rehana Parveen',
    designation: 'Head Nurse (OT Complex)',
    department: 'Nursing Administration',
    bankAccountNo: '205-110-33491',
    bankName: 'Dutch-Bangla Bank',
    basicSalary: 42000,
    allowances: 18000,
    pfDeduction: 4200,
    taxDeduction: 1800,
    netPayable: 54000,
    paymentStatus: 'Disbursed (BEFTN)',
  },
  {
    id: 'PAY-03',
    employeeId: 'EMP-5520',
    employeeName: 'Md. Kamrul Hasan',
    designation: 'Senior Medical Technologist',
    department: 'Laboratory & Pathology',
    bankAccountNo: '150-101-77823',
    bankName: 'BRAC Bank Ltd',
    basicSalary: 38000,
    allowances: 14000,
    pfDeduction: 3800,
    taxDeduction: 1200,
    netPayable: 47000,
    paymentStatus: 'Disbursed (BEFTN)',
  },
  {
    id: 'PAY-04',
    employeeId: 'EMP-6019',
    employeeName: 'Sharmin Sultana',
    designation: 'Senior Pharmacist',
    department: 'Hospital Pharmacy',
    bankAccountNo: '110-884-22104',
    bankName: 'City Bank Ltd',
    basicSalary: 45000,
    allowances: 15000,
    pfDeduction: 4500,
    taxDeduction: 2000,
    netPayable: 53500,
    paymentStatus: 'Disbursed (BEFTN)',
  },
];

interface AccountantExpensesViewProps {
  initialTab?: 'vouchers' | 'suppliers' | 'doctors' | 'payroll';
}

export const AccountantExpensesView: React.FC<AccountantExpensesViewProps> = ({
  initialTab = 'vouchers',
}) => {
  const [activeTab, setActiveTab] = useState<'vouchers' | 'suppliers' | 'doctors' | 'payroll'>(initialTab);
  const [vouchers] = useState<ExpenseVoucherRecord[]>(EXPENSE_VOUCHERS_DATA);
  const [suppliers, setSuppliers] = useState<SupplierPayableRecord[]>(SUPPLIER_PAYABLES_DATA);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  React.useEffect(() => {
    if (initialTab) setActiveTab(initialTab);
  }, [initialTab]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4500);
  };

  const handlePaySupplier = (id: string) => {
    setSuppliers((prev) =>
      prev.map((s) => (s.id === id ? { ...s, status: 'Settled' } : s))
    );
    showToast('BEFTN Vendor Electronic Payment advice queued for bank transmission.');
  };

  // Voucher Columns
  const voucherColumns: DataTableColumn<ExpenseVoucherRecord>[] = [
    {
      key: 'voucherNo',
      header: 'Voucher # & Date',
      sortable: true,
      sortValue: (r) => r.voucherNo,
      render: (r) => (
        <div>
          <span className="font-mono font-bold text-slate-900 text-xs block">{r.voucherNo}</span>
          <span className="text-[10.5px] text-slate-400 font-mono">{r.date}</span>
        </div>
      ),
    },
    {
      key: 'payee',
      header: 'Beneficiary & Payee',
      sortable: true,
      sortValue: (r) => r.payee,
      render: (r) => (
        <div>
          <span className="font-bold text-slate-900 text-xs block">{r.payee}</span>
          <span className="text-[11px] text-slate-500 font-medium">Head: {r.category}</span>
        </div>
      ),
    },
    {
      key: 'costCenter',
      header: 'Hospital Cost Center',
      sortable: true,
      sortValue: (r) => r.costCenter,
      render: (r) => (
        <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-slate-100 text-slate-700">
          {r.costCenter}
        </span>
      ),
    },
    {
      key: 'amount',
      header: 'Disbursed Amount',
      align: 'right',
      sortable: true,
      sortValue: (r) => r.amount,
      render: (r) => (
        <div>
          <span className="font-mono font-extrabold text-[#006a4e] text-xs block">
            ৳ {r.amount.toLocaleString()}
          </span>
          <span className="text-[10px] text-slate-400 font-mono">{r.paymentMethod}</span>
        </div>
      ),
    },
    {
      key: 'approvedBy',
      header: 'Approval Authority',
      render: (r) => (
        <span className="text-xs text-slate-700 block truncate max-w-xs">
          {r.approvedBy}
        </span>
      ),
    },
    {
      key: 'status',
      header: 'Approval',
      align: 'center',
      render: (r) => (
        <span className="px-2 py-0.5 rounded text-[10.5px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
          {r.status}
        </span>
      ),
    },
    {
      key: 'id',
      header: 'Action',
      align: 'center',
      render: (r) => (
        <button
          type="button"
          onClick={() => showToast(`Printed Expense Voucher #${r.voucherNo}`)}
          className="h-7 px-2.5 rounded-[3px] border border-slate-300 hover:bg-slate-50 text-slate-700 text-[11px] font-semibold inline-flex items-center gap-1 cursor-pointer shadow-2xs"
        >
          <Printer className="w-3 h-3 text-slate-400" />
          <span>Print</span>
        </button>
      ),
    },
  ];

  // Supplier Columns
  const supplierColumns: DataTableColumn<SupplierPayableRecord>[] = [
    {
      key: 'supplierName',
      header: 'Vendor & Company',
      sortable: true,
      sortValue: (r) => r.supplierName,
      render: (r) => (
        <div>
          <span className="font-bold text-slate-900 text-xs block">{r.supplierName}</span>
          <span className="text-[11px] text-slate-500">
            Bill: <strong className="font-mono text-slate-800">{r.taxInvoiceNo}</strong> · PO: {r.poNumber}
          </span>
        </div>
      ),
    },
    {
      key: 'grnNumber',
      header: '3-Way Match Verification',
      align: 'center',
      render: (r) => (
        <div>
          <span
            className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
              r.status === 'Approved for Payment'
                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                : 'bg-amber-50 text-amber-700 border-amber-200'
            }`}
          >
            {r.status === 'Approved for Payment' ? 'Matched (PO+GRN+Bill)' : 'Reviewing GRN'}
          </span>
          <div className="text-[10px] text-slate-400 font-mono mt-0.5">{r.grnNumber}</div>
        </div>
      ),
    },
    {
      key: 'netPayable',
      header: 'Net Payable',
      align: 'right',
      sortable: true,
      sortValue: (r) => r.netPayable,
      render: (r) => (
        <div>
          <span className="font-mono font-extrabold text-slate-900 text-xs block">
            ৳ {r.netPayable.toLocaleString()}
          </span>
          <span className="text-[10px] text-slate-400">Balance: ৳{r.balanceDue.toLocaleString()}</span>
        </div>
      ),
    },
    {
      key: 'dueDate',
      header: 'Due Date',
      align: 'center',
      sortable: true,
      sortValue: (r) => r.dueDate,
      render: (r) => (
        <span className="font-mono font-semibold text-slate-800 text-xs">
          {r.dueDate}
        </span>
      ),
    },
    {
      key: 'status',
      header: 'Pay Status',
      align: 'center',
      render: (r) => (
        <span
          className={`px-2 py-0.5 rounded text-[10.5px] font-bold border ${
            r.status === 'Settled'
              ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
              : r.status === 'Approved for Payment'
              ? 'bg-blue-50 text-blue-700 border-blue-200'
              : 'bg-amber-50 text-amber-700 border-amber-200'
          }`}
        >
          {r.status}
        </span>
      ),
    },
    {
      key: 'id',
      header: 'Action',
      align: 'center',
      render: (r) => (
        <div className="flex items-center justify-center gap-1.5">
          {r.status !== 'Settled' ? (
            <button
              type="button"
              onClick={() => handlePaySupplier(r.id)}
              className="h-7 px-2.5 rounded-[3px] bg-[#006a4e] hover:bg-[#00553e] text-white text-[11px] font-semibold inline-flex items-center gap-1 cursor-pointer shadow-2xs"
            >
              <Landmark className="w-3 h-3" />
              <span>BEFTN Pay</span>
            </button>
          ) : (
            <span className="text-[11px] font-bold text-emerald-700">Settled</span>
          )}
        </div>
      ),
    },
  ];

  // Doctor Honorarium Columns
  const doctorColumns: DataTableColumn<DoctorHonorariumRecord>[] = [
    {
      key: 'doctorName',
      header: 'Consultant & Speciality',
      sortable: true,
      sortValue: (r) => r.doctorName,
      render: (r) => (
        <div>
          <span className="font-bold text-slate-900 text-xs block">{r.doctorName}</span>
          <span className="text-[11px] text-slate-500 font-medium">{r.qualification} · {r.department}</span>
        </div>
      ),
    },
    {
      key: 'opdVisitsCount',
      header: 'OPD Patients & Surgeries',
      align: 'center',
      render: (r) => (
        <div>
          <span className="font-mono font-bold text-slate-800 text-xs">
            {r.opdVisitsCount} OPD
          </span>
          <div className="text-[10px] text-emerald-700 font-semibold">{r.otSurgeriesCount} OT Surgeries</div>
        </div>
      ),
    },
    {
      key: 'grossEarnings',
      header: 'Gross Honorarium',
      align: 'right',
      sortable: true,
      sortValue: (r) => r.grossEarnings,
      render: (r) => (
        <span className="font-mono font-bold text-slate-800 text-xs">
          ৳ {r.grossEarnings.toLocaleString()}
        </span>
      ),
    },
    {
      key: 'taxWithholdingAit',
      header: '10% AIT Tax (Withheld)',
      align: 'right',
      render: (r) => (
        <span className="font-mono text-xs text-rose-600 font-semibold">
          - ৳ {r.taxWithholdingAit.toLocaleString()}
        </span>
      ),
    },
    {
      key: 'netDisbursement',
      header: 'Net Bank Transfer',
      align: 'right',
      sortable: true,
      sortValue: (r) => r.netDisbursement,
      render: (r) => (
        <span className="font-mono font-extrabold text-[#006a4e] text-xs block">
          ৳ {r.netDisbursement.toLocaleString()}
        </span>
      ),
    },
    {
      key: 'status',
      header: 'Disbursement Status',
      align: 'center',
      render: (r) => (
        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
          {r.status}
        </span>
      ),
    },
    {
      key: 'id',
      header: 'Action',
      align: 'center',
      render: (r) => (
        <button
          type="button"
          onClick={() => showToast(`Generated Tax Deduction Certificate for ${r.doctorName}`)}
          className="h-7 px-2 rounded-[3px] border border-slate-300 hover:bg-slate-50 text-slate-700 text-[11px] font-medium cursor-pointer shadow-2xs"
        >
          AIT Cert
        </button>
      ),
    },
  ];

  // Payroll Columns
  const payrollColumns: DataTableColumn<PayrollSalaryRecord>[] = [
    {
      key: 'employeeName',
      header: 'Employee & Role',
      sortable: true,
      sortValue: (r) => r.employeeName,
      render: (r) => (
        <div>
          <span className="font-bold text-slate-900 text-xs block">{r.employeeName}</span>
          <span className="text-[11px] text-slate-500 font-medium">
            {r.designation} · <span className="font-mono">{r.employeeId}</span>
          </span>
        </div>
      ),
    },
    {
      key: 'bankName',
      header: 'Bank & Account',
      render: (r) => (
        <div>
          <span className="text-xs font-semibold text-slate-800 block">{r.bankName}</span>
          <span className="font-mono text-[10.5px] text-slate-400">{r.bankAccountNo}</span>
        </div>
      ),
    },
    {
      key: 'basicSalary',
      header: 'Basic + Allowances',
      align: 'right',
      render: (r) => (
        <div className="text-right">
          <span className="font-mono text-slate-800 text-xs">৳ {(r.basicSalary + r.allowances).toLocaleString()}</span>
          <div className="text-[10px] text-slate-400 font-mono">Basic ৳{r.basicSalary.toLocaleString()}</div>
        </div>
      ),
    },
    {
      key: 'pfDeduction',
      header: 'PF & Tax Deductions',
      align: 'right',
      render: (r) => (
        <div className="text-right">
          <span className="font-mono text-rose-500 text-xs">- ৳ {(r.pfDeduction + r.taxDeduction).toLocaleString()}</span>
          <div className="text-[10px] text-slate-400">PF ৳{r.pfDeduction.toLocaleString()}</div>
        </div>
      ),
    },
    {
      key: 'netPayable',
      header: 'Net Salary',
      align: 'right',
      sortable: true,
      sortValue: (r) => r.netPayable,
      render: (r) => (
        <span className="font-mono font-extrabold text-[#006a4e] text-xs block">
          ৳ {r.netPayable.toLocaleString()}
        </span>
      ),
    },
    {
      key: 'paymentStatus',
      header: 'Transfer Status',
      align: 'center',
      render: (r) => (
        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
          {r.paymentStatus}
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-3 font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-4 right-4 z-50 bg-slate-900 text-white px-4 py-2.5 rounded-[4px] shadow-lg text-xs font-medium flex items-center gap-2 border border-slate-700 animate-in fade-in slide-in-from-top-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
          <button
            type="button"
            onClick={() => setToastMessage(null)}
            className="text-slate-400 hover:text-white ml-2 cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Dedicated Clean Header per Sidebar Item (No duplicate horizontal tabs) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-1">
        <div>
          <h1 className="text-lg md:text-xl font-bold text-slate-900 flex items-center gap-2">
            {activeTab === 'vouchers' && <Receipt className="w-5 h-5 text-[#006a4e]" />}
            {activeTab === 'suppliers' && <Wallet className="w-5 h-5 text-[#006a4e]" />}
            {activeTab === 'doctors' && <Stethoscope className="w-5 h-5 text-[#006a4e]" />}
            {activeTab === 'payroll' && <Users className="w-5 h-5 text-[#006a4e]" />}
            <span>
              {activeTab === 'vouchers'
                ? 'Expense Vouchers & Petty Cash'
                : activeTab === 'suppliers'
                ? 'Supplier & Pharmaceutical Vendor Bills (AP)'
                : activeTab === 'doctors'
                ? 'Doctor Honorarium & Consultant Share'
                : 'Hospital Staff Payroll & BEFTN Salary Sheet'}
            </span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            {activeTab === 'vouchers'
              ? 'Authorize petty cash vouchers and operational hospital disbursements.'
              : activeTab === 'suppliers'
              ? 'Track pharmaceutical & diagnostic supplier invoices, TDS deductions, and payable settlements.'
              : activeTab === 'doctors'
              ? 'OPD consultation & OT surgery share calculations with statutory 10% AIT withholding.'
              : 'Monthly hospital staff, nursing, and medical technologist payroll disbursement register.'}
          </p>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: EXPENSE VOUCHERS                                                   */}
      {/* ========================================================================= */}
      {activeTab === 'vouchers' && (
        <div className="space-y-3">
          <SummaryCardGrid>
            <SummaryCard
              title="Today's Approved Expenses"
              icon={Receipt}
              iconColor="text-[#006a4e]"
              value="৳ 3,65,700"
              subtitle="Oxygen, linen, diesel & maintenance"
            />
            <SummaryCard
              title="Petty Cash Vault Balance"
              icon={Wallet}
              iconColor="text-blue-600"
              value="৳ 1,26,500"
              subtitle="Replenished daily float"
            />
            <SummaryCard
              title="TDS Withheld at Source"
              icon={ShieldCheck}
              iconColor="text-emerald-700"
              value="৳ 16,800"
              subtitle="Payable to NBR tax treasury"
            />
          </SummaryCardGrid>

          <div className="space-y-1.5">
            <h3 className="text-xs font-bold text-slate-800 px-0.5">
              Hospital Operating Expense Vouchers &amp; Cost Ledger
            </h3>
            <DataTable<ExpenseVoucherRecord>
              data={vouchers}
              columns={voucherColumns}
              keyExtractor={(item) => item.id}
              searchPlaceholder="Search voucher #, payee, or cost center..."
              searchFilter={(item, query) =>
                item.voucherNo.toLowerCase().includes(query.toLowerCase()) ||
                item.payee.toLowerCase().includes(query.toLowerCase()) ||
                item.costCenter.toLowerCase().includes(query.toLowerCase())
              }
              showSerial={true}
            />
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: SUPPLIER BILLS (AP)                                                */}
      {/* ========================================================================= */}
      {activeTab === 'suppliers' && (
        <div className="space-y-3">
          <SummaryCardGrid>
            <SummaryCard
              title="Total Accounts Payable (AP)"
              icon={Wallet}
              iconColor="text-rose-600"
              value="৳ 28,10,000"
              subtitle="5 Verified Pharmaceutical Invoices"
            />
            <SummaryCard
              title="3-Way Matched & Approved"
              icon={CheckCircle2}
              iconColor="text-[#006a4e]"
              value="100% Verified"
              subtitle="PO, GRN & Bill quantities align"
            />
            <SummaryCard
              title="Due Tomorrow"
              icon={Landmark}
              iconColor="text-amber-600"
              value="৳ 4,85,000"
              subtitle="Linde Bangladesh Ltd"
            />
          </SummaryCardGrid>

          <div className="space-y-1.5">
            <h3 className="text-xs font-bold text-slate-800 px-0.5">
              Pharmaceutical &amp; Medical Equipment Accounts Payable Roster
            </h3>
            <DataTable<SupplierPayableRecord>
              data={suppliers}
              columns={supplierColumns}
              keyExtractor={(item) => item.id}
              searchPlaceholder="Search vendor name, bill #, PO reference..."
              searchFilter={(item, query) =>
                item.supplierName.toLowerCase().includes(query.toLowerCase()) ||
                item.taxInvoiceNo.toLowerCase().includes(query.toLowerCase()) ||
                item.poNumber.toLowerCase().includes(query.toLowerCase())
              }
              showSerial={true}
            />
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: DOCTOR HONORARIUM & SHARE                                          */}
      {/* ========================================================================= */}
      {activeTab === 'doctors' && (
        <div className="space-y-3">
          <SummaryCardGrid>
            <SummaryCard
              title="Monthly Doctor Honorarium"
              icon={Stethoscope}
              iconColor="text-[#006a4e]"
              value="৳ 15,30,000"
              subtitle="Surgeon fees & OPD patient share"
            />
            <SummaryCard
              title="10% AIT Tax Withholding"
              icon={Scale}
              iconColor="text-rose-600"
              value="৳ 1,53,000"
              subtitle="Deposited via NBR Treasury Challan"
            />
            <SummaryCard
              title="Net Disbursed via BEFTN"
              icon={Landmark}
              iconColor="text-[#006a4e]"
              value="৳ 13,77,000"
              subtitle="Direct to Doctors' bank accounts"
            />
          </SummaryCardGrid>

          <div className="space-y-1.5">
            <h3 className="text-xs font-bold text-slate-800 px-0.5">
              Senior Consultant &amp; Visiting Surgeon Share Disbursement Register
            </h3>
            <DataTable<DoctorHonorariumRecord>
              data={DOCTOR_HONORARIUM_DATA}
              columns={doctorColumns}
              keyExtractor={(item) => item.id}
              searchPlaceholder="Search doctor by name or speciality..."
              searchFilter={(item, query) =>
                item.doctorName.toLowerCase().includes(query.toLowerCase()) ||
                item.department.toLowerCase().includes(query.toLowerCase())
              }
              showSerial={true}
            />
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 4: PAYROLL & STAFF SALARY                                             */}
      {/* ========================================================================= */}
      {activeTab === 'payroll' && (
        <div className="space-y-3">
          <SummaryCardGrid>
            <SummaryCard
              title="Hospital Monthly Payroll"
              icon={Users}
              iconColor="text-[#006a4e]"
              value="৳ 68,50,000"
              subtitle="Clinical & Administrative Staff"
            />
            <SummaryCard
              title="Provident Fund (PF) Deduction"
              icon={Wallet}
              iconColor="text-blue-600"
              value="৳ 5,48,000"
              subtitle="Employee + Hospital matching"
            />
            <SummaryCard
              title="Bank Disbursement Status"
              icon={CheckCircle2}
              iconColor="text-[#006a4e]"
              value="100% Completed"
              subtitle="City Bank Corporate Salary Batch"
            />
          </SummaryCardGrid>

          <div className="space-y-1.5">
            <h3 className="text-xs font-bold text-slate-800 px-0.5">
              Hospital Staff Salary &amp; Allowance Electronic Disbursement Master
            </h3>
            <DataTable<PayrollSalaryRecord>
              data={PAYROLL_SALARY_DATA}
              columns={payrollColumns}
              keyExtractor={(item) => item.id}
              searchPlaceholder="Search employee name, designation, department..."
              searchFilter={(item, query) =>
                item.employeeName.toLowerCase().includes(query.toLowerCase()) ||
                item.designation.toLowerCase().includes(query.toLowerCase()) ||
                item.department.toLowerCase().includes(query.toLowerCase())
              }
              showSerial={true}
            />
          </div>
        </div>
      )}
    </div>
  );
};
