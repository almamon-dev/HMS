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
    <div className="font-['Inter',sans-serif] text-xs py-2">
      {/* COMPACT CLEAN WHITE OFFICIAL MONEY RECEIPT */}
      <div className="max-w-[440px] mx-auto space-y-2.5">
        {/* Actions Bar at Top (Return to POS & Print) */}
        <div className="flex items-center justify-between pb-0.5 print:hidden">
          <button
            type="button"
            onClick={onBackToPos}
            className="inline-flex items-center gap-1 text-slate-600 hover:text-slate-900 font-semibold text-xs cursor-pointer transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to POS</span>
          </button>

          <button
            type="button"
            onClick={handlePrint}
            className="px-3.5 py-1.5 rounded-[3px] bg-[#006a4e] hover:bg-[#00523c] text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-2xs transition-colors"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Receipt</span>
          </button>
        </div>

        <div className="bg-white border border-slate-200 rounded-[4px] p-4 sm:p-5 shadow-xs space-y-3 print:border-none print:shadow-none print:p-0 print:max-w-none text-slate-800">
          {/* Hospital Minimal Branding Header */}
          <div className="flex items-center justify-between border-b border-slate-200 pb-2.5">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-[3px] bg-[#006a4e] text-white flex items-center justify-center font-bold text-sm shrink-0">
                +
              </div>
              <div>
                <h2 className="font-bold text-xs text-[#006a4e] leading-tight">
                  Green Life Hospital Ltd.
                </h2>
                <p className="text-[10px] text-slate-500">Central Pharmacy • Counter 02</p>
              </div>
            </div>

            <div className="text-right">
              <span className="font-bold text-slate-900 text-xs block leading-tight">{data.billNo}</span>
              <span className="text-[10px] text-slate-500 block">{data.date}, {data.time}</span>
            </div>
          </div>

          {/* 3-Column Metadata Row (Customer / Patient ID / Billed by) */}
          <div className="grid grid-cols-3 gap-2 text-xs py-1 border-b border-slate-100">
            <div>
              <span className="text-slate-400 text-[10px] font-medium block">Customer</span>
              <span className="font-bold text-slate-900 text-[11px] block truncate">{data.customerName || 'Md. Rahim Uddin'}</span>
              <span className="text-slate-500 text-[10px] block truncate">{data.customerPhone || '+880 1819-234567'}</span>
            </div>

            <div>
              <span className="text-slate-400 text-[10px] font-medium block">Patient ID</span>
              <span className="font-bold text-slate-900 text-[11px] block">{data.uhid || 'UHID-2024-8841'}</span>
              <span className="text-slate-500 text-[10px] block">General OPD</span>
            </div>

            <div>
              <span className="text-slate-400 text-[10px] font-medium block">Billed by</span>
              <span className="font-bold text-slate-900 text-[11px] block truncate">{data.pharmacist || 'Md. Rafiqul Islam'}</span>
              <span className="text-slate-500 text-[10px] block truncate">Pharmacist • C-02</span>
            </div>
          </div>

          {/* Medicine Table */}
          <div className="overflow-x-auto py-0.5">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-slate-200 text-slate-400 text-[10px] font-medium">
                <tr>
                  <th className="pb-1.5 text-left">Medicine</th>
                  <th className="pb-1.5 text-center w-10">Qty</th>
                  <th className="pb-1.5 text-right w-14">Rate</th>
                  <th className="pb-1.5 text-right w-14">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {(data.items || []).map((it, idx) => {
                  const packPrice = getPackUnitPrice(it?.medicine, it?.saleUnit);
                  const lineTotal = packPrice * (Number(it?.qty) || 0);
                  return (
                    <tr key={idx} className="hover:bg-slate-50/50">
                      <td className="py-1.5 pr-1.5">
                        <div className="font-semibold text-slate-900 text-[11px] leading-tight">{it?.medicine?.name || 'Medicine'}</div>
                        <div className="text-[9.5px] text-slate-400 leading-tight">
                          {it?.medicine?.dosage_form} {it?.medicine?.strength}
                        </div>
                      </td>
                      <td className="py-1.5 text-center text-slate-800 font-medium text-[11px]">
                        {it?.qty || 1}
                      </td>
                      <td className="py-1.5 text-right text-slate-600 text-[11px]">
                        {formatMoney(packPrice)}
                      </td>
                      <td className="py-1.5 text-right font-medium text-slate-900 text-[11px]">
                        {formatMoney(lineTotal)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Financial Summary */}
          <div className="flex justify-end pt-2 border-t border-slate-200">
            <div className="w-48 space-y-1 text-xs text-slate-600">
              <div className="flex justify-between text-[11px]">
                <span>Subtotal</span>
                <span className="text-slate-900 font-medium">৳ {formatMoney(data.subtotal)}</span>
              </div>
              {Number(data.discount || 0) > 0 && (
                <div className="flex justify-between text-[11px] text-rose-600">
                  <span>Discount</span>
                  <span className="font-medium">-৳ {formatMoney(data.discount)}</span>
                </div>
              )}
              <div className="flex justify-between text-[11px]">
                <span>VAT (5%)</span>
                <span className="text-slate-900 font-medium">৳ {formatMoney(data.vat)}</span>
              </div>

              <div className="border-t border-slate-200 my-1 pt-1 flex justify-between items-center">
                <span className="font-bold text-[#006a4e] text-xs">Total</span>
                <span className="font-extrabold text-[#006a4e] text-sm">৳ {formatMoneyInt(data.total)}</span>
              </div>

              <div className="flex justify-between text-[10.5px] text-slate-500">
                <span>Cash received</span>
                <span className="text-slate-800 font-medium">৳ {formatMoneyInt(data.tendered)}</span>
              </div>
              <div className="flex justify-between text-[10.5px] text-slate-500">
                <span>Change</span>
                <span className="text-slate-800 font-medium">৳ {formatMoneyInt(data.change)}</span>
              </div>
            </div>
          </div>

          {/* Paid Status Banner */}
          <div className="p-2 rounded-[3px] bg-slate-50 border border-slate-200/80 flex items-center justify-between">
            <div>
              <div className="font-bold text-slate-900 text-[11px] capitalize">
                Paid in {data.paymentMethod}
              </div>
              <div className="text-[10px] text-slate-500">
                {numberToWordsBDT(data.total)}
              </div>
            </div>
            <span className="px-2 py-0.5 rounded-full bg-[#006a4e] text-white font-bold text-[9px] tracking-wide uppercase shadow-2xs">
              Paid
            </span>
          </div>

          {/* Return / Exchange Policy */}
          <div className="text-[9.5px] text-slate-400 space-y-0.5 leading-tight pt-0.5">
            <p>Medicines may be exchanged within 7 days with this receipt.</p>
            <p>Blister strips and cold-chain items cannot be returned.</p>
          </div>

          {/* Signatures */}
          <div className="pt-4 grid grid-cols-2 gap-4 items-end text-xs">
            {/* Customer signature */}
            <div>
              <div className="w-32 border-b border-slate-300 mb-1" />
              <p className="text-slate-500 text-[10px]">Customer signature</p>
            </div>

            {/* Pharmacist signature */}
            <div className="text-right flex flex-col items-end">
              <div className="w-32 border-b border-slate-300 mb-1" />
              <p className="font-bold text-slate-900 text-[11px]">{data.pharmacist || 'Md. Rafiqul Islam'}</p>
              <p className="text-slate-500 text-[9.5px]">Chief Pharmacist (Reg. A-12948)</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
