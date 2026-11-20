import {
  AlertCircle,
  CheckCircle2,
  CreditCard,
  Download,
  Eye,
  Printer,
  Receipt,
  X,
} from 'lucide-react';
import React, { useMemo, useState } from 'react';
import {
  CURRENT_PATIENT,
  PATIENT_BILLS,
  PatientBillItem,
} from '../../data/patientPortalData';
import { DataTable, DataTableColumn } from '../common/DataTable';
import { DropdownSelect } from '../common/DropdownSelect';
import { SummaryCard, SummaryCardGrid } from '../common/SummaryCard';

export const PatientBillingView: React.FC = () => {
  const [bills] = useState<PatientBillItem[]>(PATIENT_BILLS);
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedBill, setSelectedBill] = useState<PatientBillItem | null>(null);
  const [isReceiptModalOpen, setIsReceiptModalOpen] = useState(false);
  const [isPayModalOpen, setIsPayModalOpen] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('card');

  const stats = useMemo(() => {
    const totalBilled = bills.reduce((acc, b) => acc + b.amount, 0);
    const totalPaid = bills.reduce((acc, b) => acc + b.paid, 0);
    const totalDue = bills.reduce((acc, b) => acc + b.due, 0);
    const settledCount = bills.filter((b) => b.status === 'Paid').length;
    return { totalBilled, totalPaid, totalDue, settledCount };
  }, [bills]);

  const filteredBills = useMemo(() => {
    if (statusFilter === 'All') return bills;
    return bills.filter((b) => b.status === statusFilter);
  }, [bills, statusFilter]);

  const handleSimulatePayment = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Payment processed successfully! Official receipt generated.');
    setIsPayModalOpen(false);
  };

  const columns: DataTableColumn<PatientBillItem>[] = [
    {
      key: 'invoiceNo',
      header: 'Invoice No',
      sortable: true,
      sortValue: (r) => r.invoiceNo,
      render: (r) => (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setSelectedBill(r);
            setIsReceiptModalOpen(true);
          }}
          className="font-bold text-[#006a4e] hover:underline text-left cursor-pointer whitespace-nowrap"
        >
          {r.invoiceNo}
        </button>
      ),
    },
    {
      key: 'date',
      header: 'Invoice Date',
      sortable: true,
      sortValue: (r) => r.date,
      render: (r) => (
        <span className="text-slate-700 whitespace-nowrap text-xs font-medium">
          {r.date}
        </span>
      ),
    },
    {
      key: 'serviceDescription',
      header: 'Service / Item Description',
      sortable: true,
      sortValue: (r) => r.serviceDescription,
      render: (r) => (
        <div>
          <div className="font-semibold text-slate-900">{r.serviceDescription}</div>
          <div className="text-[10px] text-slate-500">{r.department}</div>
        </div>
      ),
    },
    {
      key: 'amount',
      header: 'Billed Amount',
      sortable: true,
      sortValue: (r) => r.amount,
      render: (r) => (
        <span className="font-bold text-slate-900 text-xs">
          ${r.amount.toFixed(2)}
        </span>
      ),
    },
    {
      key: 'paid',
      header: 'Amount Paid',
      sortable: true,
      sortValue: (r) => r.paid,
      render: (r) => (
        <span className="font-semibold text-[#006a4e] text-xs">
          ${r.paid.toFixed(2)}
        </span>
      ),
    },
    {
      key: 'due',
      header: 'Balance Due',
      sortable: true,
      sortValue: (r) => r.due,
      render: (r) => (
        <span
          className={`font-semibold text-xs ${r.due > 0 ? 'text-rose-600' : 'text-slate-500'
            }`}
        >
          ${r.due.toFixed(2)}
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
          className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-semibold ${r.status === 'Paid'
            ? 'bg-emerald-50 text-[#006a4e]'
            : 'bg-rose-50 text-rose-700'
            }`}
        >
          <CheckCircle2 className="w-2.5 h-2.5 text-[#006a4e]" />
          {r.status}
        </span>
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      align: 'right',
      render: (r) => (
        <div className="flex items-center justify-end gap-1" onClick={(e) => e.stopPropagation()}>
          <button
            type="button"
            onClick={() => {
              setSelectedBill(r);
              setIsReceiptModalOpen(true);
            }}
            className="p-1 hover:bg-[#edf6f2] text-[#006a4e] rounded transition-colors cursor-pointer"
            title="View Official Receipt"
          >
            <Eye className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => alert(`Downloading Receipt PDF: ${r.receiptNo}`)}
            className="p-1 hover:bg-slate-100 text-slate-600 rounded transition-colors cursor-pointer"
            title="Download Receipt"
          >
            <Download className="w-3.5 h-3.5" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-2">
      {/* 4 Summary Metric Cards */}
      <SummaryCardGrid>
        <SummaryCard
          title="Total Invoiced"
          icon={Receipt}
          iconColor="text-[#006a4e]"
          value={`$${stats.totalBilled.toFixed(2)}`}
          subtitle={`${bills.length} Hospital invoices`}
        />
        <SummaryCard
          title="Total Settled"
          icon={CheckCircle2}
          iconColor="text-emerald-600"
          value={`$${stats.totalPaid.toFixed(2)}`}
          valueColor="text-emerald-700"
          subtitle="Fully paid online/cash"
        />
        <SummaryCard
          title="Outstanding Due"
          icon={AlertCircle}
          iconColor="text-slate-400"
          value={`$${stats.totalDue.toFixed(2)}`}
          subtitle="Zero pending charges"
        />
        <SummaryCard
          title="Cleared Invoices"
          icon={Receipt}
          iconColor="text-[#006a4e]"
          value={`${stats.settledCount} / ${bills.length}`}
          valueColor="text-[#006a4e]"
          subtitle="100% Account clear"
        />
      </SummaryCardGrid>

      {/* Main Table Card */}
      <div className="bg-white border border-slate-300 rounded-[3px] shadow-xs">
        <div className="p-2 sm:p-2.5 border-b border-slate-200 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-800">Filter Invoices:</span>
            <DropdownSelect
              options={[
                { value: 'All', label: 'All Invoices' },
                { value: 'Paid', label: 'Paid Invoices' },
                { value: 'Pending', label: 'Pending Dues' },
              ]}
              value={statusFilter}
              onChange={setStatusFilter}
              className="w-40"
            />
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsPayModalOpen(true)}
              className="inline-flex items-center gap-1 px-3 py-1 bg-[#006a4e] hover:bg-[#00523d] text-white text-xs font-bold rounded cursor-pointer transition-colors shadow-xs"
            >
              <CreditCard className="w-3.5 h-3.5" />
              Pay Hospital Bill Online
            </button>
          </div>
        </div>

        <DataTable<PatientBillItem>
          columns={columns}
          data={filteredBills}
          keyExtractor={(item) => item.id}
          searchPlaceholder="Search invoices by id, service or department..."
          searchFilter={(item, query) =>
            item.invoiceNo.toLowerCase().includes(query.toLowerCase()) ||
            item.serviceDescription.toLowerCase().includes(query.toLowerCase()) ||
            item.department.toLowerCase().includes(query.toLowerCase())
          }
          defaultSort={{ key: 'date', order: 'desc' }}
          showSerial={true}
          emptyMessage="No billing invoices found."
          onRowClick={(item) => {
            setSelectedBill(item);
            setIsReceiptModalOpen(true);
          }}
        />
      </div>

      {/* Official Receipt Modal */}
      {isReceiptModalOpen && selectedBill && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/50 backdrop-blur-xs">
          <div className="bg-white rounded-[3px] shadow-2xl max-w-lg w-full p-4 border border-slate-200 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-200 pb-2">
              <div className="flex items-center gap-2">
                <Receipt className="w-4 h-4 text-[#006a4e]" />
                <h3 className="text-sm font-bold text-slate-900">
                  Official Payment Receipt ({selectedBill.receiptNo})
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsReceiptModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Receipt Body */}
            <div className="border border-slate-200 rounded p-3 space-y-3 bg-slate-50/50 text-xs">
              <div className="flex justify-between items-start border-b border-slate-200 pb-2">
                <div>
                  <h4 className="font-extrabold text-[#006a4e] text-sm">GreenHospital Medical Center</h4>
                  <p className="text-[10px] text-slate-500">Dhaka Main Campus · Cash &amp; Accounts Dept</p>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-slate-500 block">Receipt No</span>
                  <span className="font-mono font-bold text-slate-800">{selectedBill.receiptNo}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-slate-500 block text-[10px]">Patient Name:</span>
                  <span className="font-bold text-slate-900">{CURRENT_PATIENT.name}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px]">UHID:</span>
                  <span className="font-mono font-bold text-slate-900">{CURRENT_PATIENT.uhid}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px]">Payment Date:</span>
                  <span className="font-semibold text-slate-800">{selectedBill.date}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px]">Invoice Ref:</span>
                  <span className="font-mono text-slate-800">{selectedBill.invoiceNo}</span>
                </div>
              </div>

              <div className="border-t border-b border-slate-200 py-2">
                <div className="flex justify-between font-bold text-slate-800 pb-1">
                  <span>Particulars</span>
                  <span>Amount</span>
                </div>
                <div className="flex justify-between text-slate-700">
                  <span>{selectedBill.serviceDescription} ({selectedBill.department})</span>
                  <span className="font-mono">${selectedBill.amount.toFixed(2)}</span>
                </div>
              </div>

              <div className="space-y-1 text-right">
                <div className="flex justify-between text-slate-600">
                  <span>Total Payable:</span>
                  <span className="font-mono font-bold">${selectedBill.amount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-[#006a4e] font-bold">
                  <span>Amount Settled:</span>
                  <span className="font-mono">${selectedBill.paid.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-slate-500 text-[10px]">
                  <span>Outstanding Balance:</span>
                  <span className="font-mono font-bold">${selectedBill.due.toFixed(2)}</span>
                </div>
              </div>

              <div className="pt-2 border-t border-dashed border-slate-300 flex items-center justify-between text-[10px] text-slate-500">
                <span>Status: Fully Cleared · Authorized Computer Generated Receipt</span>
                <span className="font-bold text-[#006a4e]">PAID</span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-200">
              <button
                type="button"
                onClick={() => window.print()}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded cursor-pointer transition-colors"
              >
                <Printer className="w-3.5 h-3.5" />
                Print Receipt
              </button>
              <button
                type="button"
                onClick={() => setIsReceiptModalOpen(false)}
                className="px-4 py-1.5 bg-[#006a4e] hover:bg-[#00523d] text-white text-xs font-bold rounded cursor-pointer transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Online Payment Modal */}
      {isPayModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/50 backdrop-blur-xs">
          <div className="bg-white rounded-[3px] shadow-2xl max-w-md w-full p-4 border border-slate-200 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-200 pb-2">
              <div className="flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-[#006a4e]" />
                <h3 className="text-sm font-bold text-slate-900">Hospital Online Payment Gateway</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsPayModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSimulatePayment} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 font-bold mb-1">
                  Select Payment Method:
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('card')}
                    className={`p-2 border rounded text-center cursor-pointer transition-colors ${paymentMethod === 'card'
                      ? 'border-[#006a4e] bg-[#edf6f2] text-[#006a4e] font-bold'
                      : 'border-slate-300 text-slate-700 hover:bg-slate-50'
                      }`}
                  >
                    Credit / Debit Card
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('bkash')}
                    className={`p-2 border rounded text-center cursor-pointer transition-colors ${paymentMethod === 'bkash'
                      ? 'border-pink-600 bg-pink-50 text-pink-700 font-bold'
                      : 'border-slate-300 text-slate-700 hover:bg-slate-50'
                      }`}
                  >
                    bKash / Nagad
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('bank')}
                    className={`p-2 border rounded text-center cursor-pointer transition-colors ${paymentMethod === 'bank'
                      ? 'border-cyan-600 bg-cyan-50 text-cyan-700 font-bold'
                      : 'border-slate-300 text-slate-700 hover:bg-slate-50'
                      }`}
                  >
                    Net Banking
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">
                  Payment Amount ($ USD):
                </label>
                <input
                  type="number"
                  defaultValue="50.00"
                  step="1"
                  className="w-full px-2.5 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-[#006a4e]"
                />
              </div>

              <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded text-[11px] text-emerald-800">
                🔒 256-Bit SSL Encrypted PCI-DSS Level 1 Compliant Healthcare Payment Gateway.
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsPayModalOpen(false)}
                  className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-[#006a4e] hover:bg-[#00523d] text-white text-xs font-bold rounded cursor-pointer transition-colors shadow-xs"
                >
                  Confirm &amp; Pay
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
