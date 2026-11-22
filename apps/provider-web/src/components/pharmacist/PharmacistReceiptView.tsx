import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  Printer,
} from 'lucide-react';

export interface ReceiptItem {
  medicine: {
    id: string;
    name: string;
    generic_name?: string;
    dosage_form: string;
    strength: string;
    selling_price?: number;
    unit_price?: number;
    box_selling_price?: number;
    units_per_strip?: number;
    units_per_box?: number;
    pieces_per_strip?: number;
    strips_per_box?: number;
  };
  saleUnit: string;
  qty: number;
}

export interface ReceiptData {
  billNo: string;
  date: string;
  time: string;
  customerName: string;
  customerPhone?: string;
  uhid?: string;
  bedNo?: string;
  ward?: string;
  doctor?: string;
  counter?: string;
  pharmacist?: string;
  paymentMethod: string;
  items: ReceiptItem[];
  subtotal: number;
  discount: number;
  vat: number;
  total: number;
  tendered: number;
  change: number;
  isLive?: boolean;
}

export interface PharmacistReceiptViewProps {
  receiptData?: ReceiptData | null;
  onBackToPos: () => void;
  onProceedToCheckout?: () => void;
}

const DEFAULT_RECEIPT_DATA: ReceiptData = {
  billNo: 'INV-2026-8492',
  date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
  time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
  customerName: 'Kazi Nazrul Islam',
  customerPhone: '01712-345678',
  uhid: 'UHID-2026-8812',
  bedNo: '402-A',
  ward: 'Cardiology HDU (4th Floor)',
  doctor: 'Prof. Dr. M. A. Hasan, FCPS (Cardiology)',
  counter: 'Counter 02 (CMS Central Dispenser)',
  pharmacist: 'Md. Rafiqul Islam (Reg No: A-12948)',
  paymentMethod: 'cash',
  items: [
    {
      medicine: {
        id: 'med-1',
        name: 'Napa Extra',
        generic_name: 'Paracetamol + Caffeine',
        dosage_form: 'Tablet',
        strength: '500mg+65mg',
        unit_price: 3.5,
        pieces_per_strip: 10,
        strips_per_box: 20,
      },
      saleUnit: 'strip',
      qty: 2,
    },
    {
      medicine: {
        id: 'med-2',
        name: 'Maxpro 20mg',
        generic_name: 'Esomeprazole Magnesium Trihydrate',
        dosage_form: 'Capsule',
        strength: '20mg',
        unit_price: 9.0,
        pieces_per_strip: 14,
        strips_per_box: 5,
      },
      saleUnit: 'strip',
      qty: 1,
    },
    {
      medicine: {
        id: 'med-3',
        name: 'Sergel 20mg',
        generic_name: 'Esomeprazole Magnesium',
        dosage_form: 'Capsule',
        strength: '20mg',
        unit_price: 8.0,
        pieces_per_strip: 10,
        strips_per_box: 10,
      },
      saleUnit: 'strip',
      qty: 1,
    },
  ],
  subtotal: 276.0,
  discount: 16.0,
  vat: 13.0,
  total: 273.0,
  tendered: 500.0,
  change: 227.0,
  isLive: false,
};

function getPackUnitPrice(med: any, unit: any): number {
  if (!med) return 0;
  const unitPrice = Number(med.selling_price ?? med.unit_price ?? 0);
  const unitsPerStrip = Number(med.units_per_strip ?? med.pieces_per_strip ?? 10);
  const unitsPerBox = Number(
    med.units_per_box ?? (med.strips_per_box ? med.strips_per_box * unitsPerStrip : 100)
  );

  const normalizedUnit = (unit || '').toLowerCase();
  if (normalizedUnit === 'box') {
    if (med.box_selling_price && Number(med.box_selling_price) > 0) {
      return Number(med.box_selling_price);
    }
    return Math.round(unitPrice * unitsPerBox * 100) / 100;
  }
  if (normalizedUnit === 'strip') {
    return Math.round(unitPrice * unitsPerStrip * 100) / 100;
  }
  return unitPrice;
}

function formatMoney(val: any): string {
  const num = Number(val);
  return isNaN(num) ? '0.00' : num.toFixed(2);
}

function formatMoneyInt(val: any): string {
  const num = Number(val);
  return isNaN(num) ? '0' : num.toLocaleString();
}

function numberToWordsBDT(num: number | undefined | null): string {
  if (num == null || isNaN(Number(num))) return 'Taka Zero Only';
  const a = [
    '', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine',
    'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen',
    'Seventeen', 'Eighteen', 'Nineteen',
  ];
  const b = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

  const intPart = Math.floor(Math.abs(Number(num)));
  if (intPart === 0) return 'Taka Zero Only';

  function convertGroup(n: number): string {
    let str = '';
    if (n >= 100) {
      str += a[Math.floor(n / 100)] + ' Hundred ';
      n %= 100;
    }
    if (n >= 20) {
      str += b[Math.floor(n / 10)] + (n % 10 ? ' ' + a[n % 10] : '');
    } else if (n > 0) {
      str += a[n];
    }
    return str.trim();
  }

  let words = '';
  const crore = Math.floor(intPart / 10000000);
  const lakh = Math.floor((intPart % 10000000) / 100000);
  const thousand = Math.floor((intPart % 100000) / 1000);
  const remainder = intPart % 1000;

  if (crore > 0) words += convertGroup(crore) + ' Crore ';
  if (lakh > 0) words += convertGroup(lakh) + ' Lakh ';
  if (thousand > 0) words += convertGroup(thousand) + ' Thousand ';
  if (remainder > 0) words += convertGroup(remainder);

  return `Taka ${words.trim()} Only`;
}

export const PharmacistReceiptView: React.FC<PharmacistReceiptViewProps> = ({
  receiptData,
  onBackToPos,
}) => {
  const [format, setFormat] = useState<'standard' | 'thermal'>('standard');
  const [data, setData] = useState<ReceiptData>(() => {
    if (receiptData) return receiptData;
    try {
      const stored = sessionStorage.getItem('pharmacy_active_receipt');
      if (stored) {
        return JSON.parse(stored);
      }
    } catch {
      // fallback
    }
    return DEFAULT_RECEIPT_DATA;
  });

  useEffect(() => {
    if (receiptData) {
      setData(receiptData);
    }
  }, [receiptData]);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-3 font-['Inter',sans-serif] text-xs">
      {/* 1. Clean & Uncluttered Header (Hidden on Print) */}
      <div className="flex items-center justify-between pb-2 border-b border-slate-200 print:hidden text-xs max-w-2xl mx-auto">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onBackToPos}
            className="inline-flex items-center gap-1 font-semibold text-slate-600 hover:text-slate-900 cursor-pointer text-xs"
            title="Return to Point of Sale Terminal"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>POS</span>
          </button>
          <span className="text-slate-300">/</span>
          <h1 className="font-bold text-sm text-slate-900 leading-none">
            Money Receipt
          </h1>
          <span className="px-1.5 py-0.5 rounded-[2px] bg-slate-100 text-slate-600 font-medium text-xs">
            {data.billNo}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Format Switcher */}
          <div className="inline-flex rounded-[3px] border border-slate-200 p-0.5 bg-slate-50 text-[11px]">
            <button
              type="button"
              onClick={() => setFormat('standard')}
              className={`px-2 py-0.5 rounded-[2px] font-semibold transition-colors cursor-pointer ${
                format === 'standard'
                  ? 'bg-[#006a4e] text-white shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              A4/A5 Memo
            </button>
            <button
              type="button"
              onClick={() => setFormat('thermal')}
              className={`px-2 py-0.5 rounded-[2px] font-semibold transition-colors cursor-pointer ${
                format === 'thermal'
                  ? 'bg-[#006a4e] text-white shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Thermal Slip
            </button>
          </div>

          <button
            type="button"
            onClick={handlePrint}
            className="px-3 py-1 rounded-[3px] bg-[#006a4e] hover:bg-[#00523c] text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-2xs transition-colors"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print</span>
          </button>
        </div>
      </div>

      {/* 2. Main Page Receipt Canvas */}
      {format === 'standard' ? (
        /* COMPACT CLEAN WHITE OFFICIAL MONEY RECEIPT */
        <div className="max-w-2xl mx-auto space-y-3">
          <div className="bg-white border border-slate-200 rounded-[4px] p-6 sm:p-7 shadow-xs space-y-4 print:border-none print:shadow-none print:p-0 print:max-w-none text-slate-800">
            {/* Hospital Branding Header */}
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-3">
                {/* Green Hospital Plus Icon */}
                <div className="w-10 h-10 rounded-[4px] bg-[#006a4e] text-white flex items-center justify-center font-bold text-xl shrink-0 shadow-2xs">
                  +
                </div>
                <div>
                  <h2 className="font-bold text-base text-[#006a4e] leading-snug">
                    Green Life Hospital Ltd.
                  </h2>
                  <h3 className="font-semibold text-xs text-slate-800 leading-tight">
                    Central Pharmacy
                  </h3>
                  <p className="text-[11px] text-slate-500 mt-1 leading-normal">
                    32, Green Road, Dhanmondi, Dhaka-1205
                  </p>
                  <p className="text-[11px] text-slate-500 leading-normal">
                    +880 1711-000005 • pharmacy@greenlifehospital.com.bd
                  </p>
                  <p className="text-[10px] text-slate-400 mt-0.5 leading-normal">
                    Drug Lic: DL-DHK-2024-09812 • BIN: 002918274-0101
                  </p>
                </div>
              </div>

              {/* Right Side Header Info */}
              <div className="text-right shrink-0">
                <span className="inline-block px-3 py-0.5 rounded-full bg-emerald-50 text-[#006a4e] border border-emerald-200/80 font-semibold text-[11px] mb-1.5">
                  Official Money Receipt
                </span>
                <div className="text-xs text-slate-700 space-y-0.5">
                  <p className="font-bold text-slate-900">No: {data.billNo}</p>
                  <p className="text-[11px] text-slate-500">{data.date}, {data.time}</p>
                  <p className="text-[11px] text-slate-500">Counter 02</p>
                </div>
              </div>
            </div>

            {/* Divider Line */}
            <div className="border-b border-slate-200 my-3" />

            {/* 3-Column Metadata Row (Customer / Patient ID / Billed by) */}
            <div className="grid grid-cols-3 gap-4 text-xs">
              <div>
                <span className="text-slate-400 text-[11px] font-medium block mb-0.5">Customer</span>
                <span className="font-bold text-slate-900 block text-xs">{data.customerName || 'Md. Rahim Uddin'}</span>
                <span className="text-slate-500 text-[11px] block">{data.customerPhone || '+880 1819-234567'}</span>
              </div>

              <div>
                <span className="text-slate-400 text-[11px] font-medium block mb-0.5">Patient ID</span>
                <span className="font-bold text-slate-900 block text-xs">{data.uhid || 'UHID-2024-8841'}</span>
                <span className="text-slate-500 text-[11px] block">General OPD</span>
              </div>

              <div>
                <span className="text-slate-400 text-[11px] font-medium block mb-0.5">Billed by</span>
                <span className="font-bold text-slate-900 block text-xs">{data.pharmacist || 'Md. Rafiqul Islam'}</span>
                <span className="text-slate-500 text-[11px] block">Chief Pharmacist • Counter 02</span>
              </div>
            </div>

            {/* Medicine Table */}
            <div className="overflow-x-auto pt-2">
              <table className="w-full text-left text-xs min-w-[500px]">
                <thead className="border-b border-slate-200 text-slate-400 text-[11px] font-medium">
                  <tr>
                    <th className="pb-2 text-left">Medicine</th>
                    <th className="pb-2 text-left">Batch / Exp</th>
                    <th className="pb-2 text-center w-12">Qty</th>
                    <th className="pb-2 text-right w-16">Rate</th>
                    <th className="pb-2 text-right w-16">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {(data.items || []).map((it, idx) => {
                    const packPrice = getPackUnitPrice(it?.medicine, it?.saleUnit);
                    const lineTotal = packPrice * (Number(it?.qty) || 0);
                    return (
                      <tr key={idx} className="hover:bg-slate-50/50">
                        <td className="py-2.5 pr-2">
                          <div className="font-semibold text-slate-900 text-xs">{it?.medicine?.name || 'Medicine'}</div>
                          <div className="text-[10.5px] text-slate-400 leading-tight mt-0.5">
                            {it?.medicine?.generic_name || 'Pharmaceutical'}, {it?.medicine?.dosage_form} {it?.medicine?.strength}
                          </div>
                        </td>
                        <td className="py-2.5 pr-2">
                          <div className="text-slate-700 font-medium text-xs">B-99{idx + 1}2</div>
                          <div className="text-[10px] text-slate-400">11/2027</div>
                        </td>
                        <td className="py-2.5 text-center text-slate-800 font-medium text-xs">
                          {it?.qty || 1}
                        </td>
                        <td className="py-2.5 text-right text-slate-600 text-xs">
                          {formatMoney(packPrice)}
                        </td>
                        <td className="py-2.5 text-right font-medium text-slate-900 text-xs">
                          {formatMoney(lineTotal)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Financial Summary */}
            <div className="flex justify-end pt-3 border-t border-slate-200">
              <div className="w-56 space-y-1.5 text-xs text-slate-600">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="text-slate-900 font-medium">৳ {formatMoney(data.subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Discount</span>
                  <span className={Number(data.discount || 0) > 0 ? 'text-rose-600 font-medium' : 'text-slate-900 font-medium'}>
                    {Number(data.discount || 0) > 0 ? `-৳ ${formatMoney(data.discount)}` : '৳ 0.00'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>VAT (5%)</span>
                  <span className="text-slate-900 font-medium">৳ {formatMoney(data.vat)}</span>
                </div>

                <div className="border-t border-slate-200 my-1.5 pt-1.5 flex justify-between items-center">
                  <span className="font-bold text-[#006a4e] text-sm">Total</span>
                  <span className="font-extrabold text-[#006a4e] text-base">৳ {formatMoneyInt(data.total)}</span>
                </div>

                <div className="flex justify-between text-[11px] text-slate-500 pt-0.5">
                  <span>Cash received</span>
                  <span className="text-slate-800 font-medium">৳ {formatMoneyInt(data.tendered)}</span>
                </div>
                <div className="flex justify-between text-[11px] text-slate-500">
                  <span>Change</span>
                  <span className="text-slate-800 font-medium">৳ {formatMoneyInt(data.change)}</span>
                </div>
              </div>
            </div>

            {/* Paid Status Banner */}
            <div className="p-3 rounded-[4px] bg-slate-50 border border-slate-200/80 flex items-center justify-between">
              <div>
                <div className="font-bold text-slate-900 text-xs capitalize">
                  Paid in {data.paymentMethod}
                </div>
                <div className="text-[11px] text-slate-500 mt-0.5">
                  {numberToWordsBDT(data.total)}
                </div>
              </div>
              <span className="px-2.5 py-0.5 rounded-full bg-[#006a4e] text-white font-bold text-[10px] tracking-wide uppercase shadow-2xs">
                Paid
              </span>
            </div>

            {/* Return / Exchange Policy */}
            <div className="text-[10.5px] text-slate-400 space-y-0.5 leading-relaxed pt-1">
              <p>Medicines may be exchanged within 7 days with this receipt.</p>
              <p>Blister strips and cold-chain items (insulin, vaccines) cannot be returned.</p>
              <p>Please check medicines, quantity and labels before leaving the counter.</p>
            </div>

            {/* Signatures */}
            <div className="pt-6 grid grid-cols-2 gap-8 items-end text-xs">
              {/* Customer signature */}
              <div>
                <div className="w-44 border-b border-slate-300 mb-1" />
                <p className="text-slate-500 text-[11px]">Customer signature</p>
              </div>

              {/* Pharmacist signature */}
              <div className="text-right flex flex-col items-end">
                <div className="w-44 border-b border-slate-300 mb-1" />
                <p className="font-bold text-slate-900 text-xs">{data.pharmacist || 'Md. Rafiqul Islam'}</p>
                <p className="text-slate-500 text-[10px]">Chief Pharmacist, Reg. A-12948</p>
              </div>
            </div>
          </div>

          {/* Bottom Print Action Button (Matches Screenshot Position) */}
          <div className="flex justify-end print:hidden">
            <button
              type="button"
              onClick={handlePrint}
              className="px-4 py-1.5 rounded-[3px] bg-[#006a4e] hover:bg-[#00523c] text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-2xs transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print</span>
            </button>
          </div>
        </div>
      ) : (
        /* 80mm THERMAL SLIP FORMAT (FOR POS RECEIPT PRINTERS) */
        <div className="max-w-[340px] mx-auto bg-white border border-slate-300 rounded-[3px] p-4 shadow-sm space-y-2.5 text-xs text-slate-800 print:border-none print:shadow-none print:p-0 print:max-w-none">
          <div className="text-center border-b border-dashed border-slate-300 pb-2.5 space-y-0.5">
            <h3 className="font-bold text-sm text-slate-900 leading-tight">
              Green Life Hospital Ltd.
            </h3>
            <p className="text-[11px] text-slate-600 font-medium">Pharmacy Department</p>
            <p className="text-[10px] text-slate-500">32, Green Road, Dhanmondi, Dhaka</p>
            <p className="text-[10px] text-slate-500">Tel: +880 1711-000005</p>
            <p className="text-[10px] text-slate-400">DL: DL-DHK-2024-09812 • BIN: 002918274-0101</p>
            <div className="pt-1.5">
              <span className="font-bold text-[11px] uppercase tracking-wider text-slate-900">
                CASH MEMO / MONEY RECEIPT
              </span>
            </div>
          </div>

          <div className="text-[11px] text-slate-600 space-y-0.5 border-b border-dashed border-slate-300 pb-2">
            <p>Invoice : <strong className="text-slate-900">{data.billNo}</strong></p>
            <p>Date : {data.date} {data.time}</p>
            <p>Paid by (ক্রেতা) : <strong className="text-slate-900">{data.customerName || 'Md. Rahim Uddin'}</strong></p>
            <p>Prepared by : <strong className="text-slate-900">{data.pharmacist || 'Md. Rafiqul Islam, M.Pharm'}</strong></p>
            {data.customerPhone && <p>Phone : {data.customerPhone}</p>}
            {data.uhid && <p>Patient UHID : {data.uhid}</p>}
            <p>Counter : Counter 02 • Station : Dispensary</p>
          </div>

          {/* Items */}
          <div className="border-b border-dashed border-slate-300 py-1.5 space-y-1 text-xs">
            {(data.items || []).map((it, idx) => {
              const packPrice = getPackUnitPrice(it?.medicine, it?.saleUnit);
              const lineTotal = packPrice * (Number(it?.qty) || 0);
              return (
                <div key={idx} className="flex justify-between items-start gap-1">
                  <div className="truncate max-w-[200px]">
                    <span className="font-semibold text-slate-900">{it?.medicine?.name || 'Medicine'}</span>
                    <span className="text-[10px] text-slate-500 block">
                      {it?.qty || 1} {it?.saleUnit || 'piece'} × ৳{formatMoney(packPrice)}
                    </span>
                  </div>
                  <span className="font-bold text-slate-900 shrink-0">
                    ৳ {formatMoney(lineTotal)}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Totals */}
          <div className="space-y-1 text-xs border-b border-dashed border-slate-300 pb-2">
            <div className="flex justify-between text-slate-600">
              <span>Subtotal:</span>
              <span>৳ {formatMoney(data.subtotal)}</span>
            </div>
            {Number(data.discount || 0) > 0 && (
              <div className="flex justify-between text-rose-600">
                <span>Discount:</span>
                <span>-৳ {formatMoney(data.discount)}</span>
              </div>
            )}
            <div className="flex justify-between text-slate-600">
              <span>Govt VAT (5%):</span>
              <span>৳ {formatMoney(data.vat)}</span>
            </div>
            <div className="flex justify-between font-bold text-sm text-slate-900 border-t border-slate-200 pt-1">
              <span>Total Paid:</span>
              <span className="text-[#006a4e] font-extrabold">৳ {formatMoneyInt(data.total)}</span>
            </div>
            <div className="flex justify-between text-slate-600 text-[11px]">
              <span>Tendered ({data.paymentMethod}):</span>
              <span>৳ {formatMoneyInt(data.tendered)}</span>
            </div>
            <div className="flex justify-between text-slate-600 text-[11px]">
              <span>Change Returned:</span>
              <span className="font-bold text-emerald-700">৳ {formatMoneyInt(data.change)}</span>
            </div>
          </div>

          <div className="text-center text-[10px] text-slate-400 pt-1 space-y-0.5">
            <p>Thank you for choosing Green Life Hospital!</p>
            <p>Medicines returnable within 7 days with receipt.</p>
            <p className="font-mono text-xs pt-1">* {data.billNo} *</p>
          </div>
        </div>
      )}
    </div>
  );
};
