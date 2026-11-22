import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  Printer,
  CheckCircle2,
  Phone,
  Mail,
  MapPin,
} from 'lucide-react';
import { HospitalLogo } from '../common/HospitalLogo';

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
      <div className="flex items-center justify-between pb-2 border-b border-slate-200 print:hidden text-xs">
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
        /* STANDARD OFFICIAL HOSPITAL CASH MEMO / MONEY RECEIPT */
        <div className="max-w-4xl mx-auto bg-white border border-slate-300 rounded-[3px] p-6 sm:p-8 shadow-sm space-y-5 print:border-none print:shadow-none print:p-0 print:max-w-none text-slate-800">
          {/* Hospital Branding Header */}
          <div className="flex flex-col sm:flex-row sm:items-start justify-between border-b-2 border-slate-900 pb-4 gap-3">
            <div className="flex items-start gap-3.5">
              <HospitalLogo size="md" showText={false} />
              <div>
                <h2 className="font-extrabold text-base sm:text-lg text-[#006a4e] tracking-tight leading-snug">
                  GREEN LIFE HOSPITAL LTD.
                </h2>
                <h3 className="font-bold text-xs text-slate-800">
                  Department of Pharmacy & Central Medical Store
                </h3>
                <div className="text-[11px] text-slate-600 space-y-0.5 mt-1">
                  <p className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>32, Green Road, Dhanmondi, Dhaka-1205, Bangladesh</span>
                  </p>
                  <p className="flex items-center gap-3">
                    <span className="flex items-center gap-1">
                      <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>Hotline: +880 1711-000005, 02-9669750</span>
                    </span>
                    <span className="flex items-center gap-1">
                      <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>pharmacy@greenlifehospital.com.bd</span>
                    </span>
                  </p>
                  <p className="text-[10px] text-slate-500 pt-0.5">
                    DGDA Drug Lic: <strong className="text-slate-700">DL-DHK-2024-09812</strong> • BIN / VAT Reg: <strong className="text-slate-700">002918274-0101</strong>
                  </p>
                </div>
              </div>
            </div>

            {/* Official Money Receipt Badge & Metadata */}
            <div className="text-left sm:text-right shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-200">
              <span className="inline-block px-3 py-1 rounded-[2px] bg-[#006a4e] text-white font-extrabold text-xs tracking-wider mb-1.5 uppercase shadow-2xs">
                OFFICIAL MONEY RECEIPT
              </span>
              <div className="text-[11px] text-slate-600 space-y-0.5">
                <p>Invoice No: <strong className="text-slate-900 font-bold text-xs">{data.billNo}</strong></p>
                <p>Issue Date: <strong className="text-slate-900">{data.date}</strong></p>
                <p>Issue Time: <strong className="text-slate-900">{data.time}</strong></p>
                <p>Counter: <span className="font-semibold text-slate-800">Counter 02 (CMS)</span></p>
              </div>
            </div>
          </div>

          {/* Patient, Doctor & Dispensing Information Grid in Key : Value format */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 p-3 rounded-[3px] bg-slate-50/80 border border-slate-200 text-xs">
            <div className="flex items-start gap-1.5">
              <span className="text-slate-500 font-medium min-w-[95px] shrink-0">Paid by (ক্রেতা) :</span>
              <div>
                <span className="font-bold text-slate-900 block">{data.customerName || 'Md. Rahim Uddin'}</span>
                {data.customerPhone && (
                  <span className="text-slate-500 text-[11px] block">Cell: {data.customerPhone}</span>
                )}
              </div>
            </div>

            <div className="flex items-start gap-1.5">
              <span className="text-slate-500 font-medium min-w-[95px] shrink-0">Prepared by :</span>
              <div>
                <span className="font-bold text-slate-900 block">{data.pharmacist || 'Md. Rafiqul Islam, M.Pharm'}</span>
                <span className="text-slate-500 text-[11px] block">Chief Pharmacist (Reg. A-12948)</span>
              </div>
            </div>

            <div className="flex items-start gap-1.5">
              <span className="text-slate-500 font-medium min-w-[95px] shrink-0">Patient UHID :</span>
              <div>
                <span className="font-bold text-[#006a4e] block">{data.uhid || 'UHID-2024-8841'}</span>
                <span className="text-slate-500 text-[11px] block">General OPD</span>
              </div>
            </div>

            <div className="flex items-start gap-1.5">
              <span className="text-slate-500 font-medium min-w-[95px] shrink-0">Prescribed by :</span>
              <div>
                <span className="font-semibold text-slate-800 block">{data.doctor || 'Dr. Tariqul Islam (Cardiology)'}</span>
                <span className="text-slate-500 text-[11px] block">Verified Dispensing</span>
              </div>
            </div>

            <div className="flex items-start gap-1.5">
              <span className="text-slate-500 font-medium min-w-[95px] shrink-0">Care Location :</span>
              <div>
                <span className="font-semibold text-slate-800 block">
                  {data.bedNo ? `Bed ${data.bedNo} (${data.ward})` : 'Outpatient Dispensary'}
                </span>
                <span className="text-slate-500 text-[11px] block">Counter 02 (CMS)</span>
              </div>
            </div>

            <div className="flex items-start gap-1.5">
              <span className="text-slate-500 font-medium min-w-[95px] shrink-0">Payment Mode :</span>
              <div>
                <span className="font-bold text-emerald-800 uppercase block">{data.paymentMethod} (PAID IN FULL)</span>
                <span className="text-slate-500 text-[11px] block">Settled on {data.date}</span>
              </div>
            </div>
          </div>

          {/* Itemized Medicine Table */}
          <div className="border border-slate-300 rounded-[3px] overflow-hidden bg-white">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs min-w-[620px]">
                <thead className="bg-slate-100/90 text-slate-800 border-b border-slate-300 font-bold">
                  <tr>
                    <th className="py-2 px-2.5 text-center w-10">#</th>
                    <th className="py-2 px-3">Medicine Description & Generic</th>
                    <th className="py-2 px-2.5 text-center">Batch / Exp</th>
                    <th className="py-2 px-2 text-center">Unit</th>
                    <th className="py-2 px-2.5 text-center">Qty</th>
                    <th className="py-2 px-3 text-right">Unit Rate (৳)</th>
                    <th className="py-2 px-3 text-right">Total (৳)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {(data.items || []).map((it, idx) => {
                    const packPrice = getPackUnitPrice(it?.medicine, it?.saleUnit);
                    const lineTotal = packPrice * (Number(it?.qty) || 0);
                    return (
                      <tr key={idx} className="hover:bg-slate-50/80">
                        <td className="py-2 px-2.5 text-center text-slate-400 text-[11px]">{idx + 1}</td>
                        <td className="py-2 px-3">
                          <div className="font-bold text-slate-900 text-xs">
                            {it?.medicine?.name || 'Medicine'}
                          </div>
                          <div className="text-[11px] text-slate-500">
                            {it?.medicine?.generic_name || 'Standard Pharmaceutical'} • {it?.medicine?.dosage_form} ({it?.medicine?.strength})
                          </div>
                        </td>
                        <td className="py-2 px-2.5 text-center text-slate-600 text-[11px]">
                          <span className="font-medium text-slate-800">B-99{idx + 1}2</span>
                          <span className="text-slate-400 block text-[10px]">11/2027</span>
                        </td>
                        <td className="py-2 px-2 text-center capitalize text-slate-700 text-[11px]">
                          {it?.saleUnit || 'piece'}
                        </td>
                        <td className="py-2 px-2.5 text-center font-bold text-slate-900 text-xs">
                          {it?.qty || 1}
                        </td>
                        <td className="py-2 px-3 text-right text-slate-700">
                          ৳ {formatMoney(packPrice)}
                        </td>
                        <td className="py-2 px-3 text-right font-bold text-slate-900">
                          ৳ {formatMoney(lineTotal)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Settlement, Summary and Payment Conditions */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-5 pt-1">
            {/* Left 7 cols: In Words, Payment Status, & Return Policy */}
            <div className="md:col-span-7 space-y-3">
              {/* Payment Status Pill */}
              <div className="p-2.5 rounded-[3px] bg-emerald-50 border border-emerald-200 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-[#006a4e]" />
                  <div>
                    <span className="font-bold text-emerald-950 text-xs">
                      Payment Status: PAID
                    </span>
                    <p className="text-[11px] text-emerald-800">
                      Settled via <strong className="uppercase">{data.paymentMethod}</strong> • Counter 02
                    </p>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded-[2px] bg-emerald-600 text-white font-extrabold text-[10px] tracking-wide uppercase">
                  PAID IN FULL
                </span>
              </div>

              {/* In Words */}
              <div className="p-2.5 rounded-[3px] bg-slate-50 border border-slate-200 text-xs">
                <span className="text-slate-400 font-bold text-[10px] uppercase block tracking-wider">
                  Amount in Words:
                </span>
                <span className="font-bold text-slate-800 italic block mt-0.5">
                  {numberToWordsBDT(data.total)}
                </span>
              </div>

              {/* Official Hospital Return Policy */}
              <div className="text-[10.5px] text-slate-500 space-y-1 p-2.5 rounded-[3px] border border-dashed border-slate-300 bg-slate-50/50">
                <p className="font-bold text-slate-700 text-[11px]">Important Terms & Conditions:</p>
                <ol className="list-decimal list-inside space-y-0.5">
                  <li>Medicines once sold may only be exchanged/returned within 7 days upon producing this original receipt.</li>
                  <li>Blister foils, strips, and cold-chain items (e.g. insulin, vaccines, drops) are strictly non-returnable once leaving the counter.</li>
                  <li>Check all medications, dosage quantities, and labels before leaving the dispensing desk.</li>
                </ol>
              </div>
            </div>

            {/* Right 5 cols: Financial Totals Breakdown */}
            <div className="md:col-span-5 p-3.5 rounded-[3px] bg-slate-50/90 border border-slate-200 space-y-2 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Subtotal (মোট মূল্য):</span>
                <span className="font-semibold text-slate-900">৳ {formatMoney(data.subtotal)}</span>
              </div>

              <div className="flex justify-between text-slate-600">
                <span>Special Discount (ছাড়):</span>
                <span className="font-semibold text-rose-600">
                  {Number(data.discount || 0) > 0 ? `-৳ ${formatMoney(data.discount)}` : '৳ 0.00'}
                </span>
              </div>

              <div className="flex justify-between text-slate-600">
                <span>Govt Tax (5% VAT / মূসক):</span>
                <span className="font-semibold text-slate-900">৳ {formatMoney(data.vat)}</span>
              </div>

              <div className="border-t-2 border-slate-300 pt-2 flex justify-between items-center text-sm font-extrabold text-slate-900">
                <span>Total Payable (সর্বমোট প্রদেয়):</span>
                <span className="text-base font-extrabold text-[#006a4e]">
                  ৳ {formatMoneyInt(data.total)}
                </span>
              </div>

              <div className="border-t border-slate-200 pt-1.5 space-y-1 text-[11.5px] text-slate-600">
                <div className="flex justify-between">
                  <span>Cash Received (গৃহীত টাকা):</span>
                  <span className="font-bold text-slate-900">৳ {formatMoneyInt(data.tendered)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Change Returned (ফেরত টাকা):</span>
                  <span className="font-bold text-emerald-700">৳ {formatMoneyInt(data.change)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Signatures & Barcode Verification Block */}
          <div className="pt-6 border-t border-dashed border-slate-300 grid grid-cols-1 sm:grid-cols-3 items-end gap-4 text-xs">
            {/* Customer Signature */}
            <div className="text-left">
              <div className="w-44 border-b border-slate-400 mb-1" />
              <p className="font-medium text-slate-700 text-[11px]">Customer / Receiver Signature</p>
              <p className="text-[10px] text-slate-400">Date: {data.date}</p>
            </div>

            {/* Barcode & Verification */}
            <div className="text-center space-y-1">
              <div className="font-mono text-base tracking-[0.25em] text-slate-700 select-all font-bold">
                * {data.billNo} *
              </div>
              <p className="text-[10px] text-slate-400">POS Verification Code</p>
            </div>

            {/* Pharmacist Signature & Official Seal */}
            <div className="text-left sm:text-right">
              <div className="w-48 border-b border-slate-400 mb-1 ml-auto" />
              <p className="font-bold text-slate-900 text-xs">Md. Rafiqul Islam</p>
              <p className="text-[11px] text-slate-600 font-medium">Chief Pharmacist (Reg. A-12948)</p>
              <p className="text-[10px] text-slate-400">Authorized Signature & Seal</p>
            </div>
          </div>

          {/* Footer Thank You */}
          <div className="text-center text-[10.5px] text-slate-400 pt-2 border-t border-slate-100">
            Green Life Hospital Central Pharmacy • 24/7 Service • Hotline: +880 1711-000005 • www.greenlifehospital.com.bd
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
