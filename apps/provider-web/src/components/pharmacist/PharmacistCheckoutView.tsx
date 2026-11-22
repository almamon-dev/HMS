import React, { useMemo } from 'react';
import {
  FileText,
  Check,
  CreditCard,
  Banknote,
  Smartphone,
  Wallet,
  Minus,
  Plus,
  Trash2,
  ArrowLeft,
} from 'lucide-react';
import { PosMedicine, SaleUnit, CartItem, CrmCustomer, DiscountType } from './PharmacistPosView';
import { getAuthSession } from '../../utils/auth';
import { CURRENT_PATIENT } from '../../data/patientPortalData';
import { CURRENT_PHARMACIST } from '../../data/pharmacistPortalData';

export interface PharmacistCheckoutViewProps {
  billNo: string;
  cart: CartItem[];
  customers: CrmCustomer[];
  customerType: 'walkin' | 'member';
  setCustomerType: (type: 'walkin' | 'member') => void;
  customerId: string;
  setCustomerId: (id: string) => void;
  customerName: string;
  setCustomerName: (name: string) => void;
  customerPhone: string;
  setCustomerPhone: (phone: string) => void;
  doctorName?: string;
  setDoctorName?: (doc: string) => void;
  careLocation?: string;
  setCareLocation?: (loc: string) => void;
  paymentMethod: 'cash' | 'card' | 'mfs' | 'credit';
  setPaymentMethod: (method: 'cash' | 'card' | 'mfs' | 'credit') => void;
  discountType: DiscountType;
  setDiscountType: (type: DiscountType) => void;
  discount: string;
  setDiscount: (val: string) => void;
  tenderCash: string;
  setTenderCash: (val: string) => void;
  isTenderCustom: boolean;
  setIsTenderCustom: (val: boolean) => void;
  subtotal: number;
  discountAmount: number;
  vatAmount: number;
  grandTotal: number;
  changeDue: number;
  onBackToPos: () => void;
  onCompleteSale: () => void;
  onUpdateCartQty?: (medId: string, delta: number) => void;
  onRemoveCartItem?: (medId: string) => void;
}

function getPackSize(med: PosMedicine, unit: SaleUnit): number {
  if (unit === 'box') return Math.max(1, med.units_per_box || 1);
  if (unit === 'strip') return Math.max(1, med.units_per_strip || 1);
  return 1;
}

function getPackUnitPrice(med: PosMedicine, unit: SaleUnit): number {
  if (unit === 'box') {
    if (med.box_selling_price && med.box_selling_price > 0) {
      return med.box_selling_price;
    }
    return Math.round(med.selling_price * getPackSize(med, 'box') * 100) / 100;
  }
  if (unit === 'strip') {
    return Math.round(med.selling_price * getPackSize(med, 'strip') * 100) / 100;
  }
  return med.selling_price;
}

export const PharmacistCheckoutView: React.FC<PharmacistCheckoutViewProps> = ({
  billNo,
  cart,
  customers,
  customerType,
  setCustomerType,
  customerId,
  setCustomerId,
  customerName,
  setCustomerName,
  customerPhone,
  setCustomerPhone,
  doctorName = 'Dr. Tariqul Islam (Cardiology)',
  setDoctorName,
  careLocation = 'Outpatient Dispensary (Counter 02)',
  setCareLocation,
  paymentMethod,
  setPaymentMethod,
  discountType,
  setDiscountType,
  discount,
  setDiscount,
  tenderCash,
  setTenderCash,
  setIsTenderCustom,
  subtotal,
  discountAmount,
  vatAmount,
  grandTotal,
  changeDue,
  onBackToPos,
  onCompleteSale,
  onUpdateCartQty,
  onRemoveCartItem,
}) => {
  // Read authenticated session for cashier and payer identity
  const authSession = useMemo(() => getAuthSession(), []);

  // Cashier name resolved from authentication
  const cashierDisplayName = useMemo(() => {
    if (!authSession) return CURRENT_PHARMACIST.name;
    if (authSession.role.id === 'pharmacist') return CURRENT_PHARMACIST.name;
    return `${authSession.role.title} (${authSession.email})`;
  }, [authSession]);

  // Auth payer details
  const authPayerName = useMemo(() => {
    if (!authSession) return CURRENT_PATIENT.name;
    if (authSession.role.id === 'patient') return CURRENT_PATIENT.name;
    return CURRENT_PATIENT.name;
  }, [authSession]);

  const authPayerPhone = useMemo(() => {
    if (!authSession) return CURRENT_PATIENT.phone;
    if (authSession.role.id === 'patient') return CURRENT_PATIENT.phone;
    return CURRENT_PATIENT.phone;
  }, [authSession]);

  const activeCustomerName = customerName || authPayerName;
  const activeCustomerPhone = customerPhone || authPayerPhone;

  const selectedCustomer = customers.find((c) => c.id === customerId);

  if (cart.length === 0) {
    return (
      <div className="bg-white border border-slate-200 rounded-[3px] p-8 text-center space-y-4 max-w-md mx-auto my-12 text-xs font-['Inter',sans-serif]">
        <h2 className="text-sm font-bold text-slate-800">Your POS Cart is Empty</h2>
        <p className="text-slate-500">Please select medicines from the POS catalog first to proceed with checkout.</p>
        <button
          type="button"
          onClick={onBackToPos}
          className="px-3.5 py-1.5 rounded-[3px] bg-[#006a4e] hover:bg-[#00523c] text-white font-bold text-xs inline-flex items-center gap-1.5 cursor-pointer transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Return to POS Terminal</span>
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-3 font-['Inter',sans-serif] text-xs">
      {/* 1. Clean & Uncluttered Header */}
      <div className="flex items-center justify-between py-2 border-b border-slate-200 text-xs">
        {/* Left Side: Back to POS & Page Title */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onBackToPos}
            className="inline-flex items-center gap-1 font-semibold text-slate-600 hover:text-slate-900 cursor-pointer text-xs transition-colors"
            title="Return to Point of Sale Terminal"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>POS</span>
          </button>
          <span className="text-slate-300">/</span>
          <h1 className="font-bold text-sm text-slate-900 leading-none">
            Checkout &amp; Settlement
          </h1>
          <span className="px-1.5 py-0.5 rounded-[2px] bg-slate-100 text-slate-600 font-medium text-xs">
            {billNo}
          </span>
        </div>

        {/* Right Side: Simple Clean Total */}
        <div className="flex items-center gap-1.5">
          <span className="text-xs text-slate-500 font-medium">Total:</span>
          <span className="font-extrabold text-slate-900 text-sm">৳ {grandTotal.toLocaleString()}</span>
        </div>
      </div>

      {/* 2. Main Two-Column Layout (Flat Minimal Design, No Nested Cards) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3.5 items-start">
        {/* Left Column (7 cols): Customer / Payer Information & Order Medicines */}
        <div className="lg:col-span-7 bg-white border border-slate-200 rounded-[3px] p-3.5 space-y-3.5 shadow-2xs">
          {/* Billing & Customer Information Section */}
          <div className="space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="font-bold text-xs text-slate-900">Billing &amp; Customer Information</h3>

              {/* Minimal Type Switcher (Walk-in vs Member) */}
              <div className="inline-flex rounded-[3px] border border-slate-200 p-0.5 bg-slate-50 text-[11px]">
                <button
                  type="button"
                  onClick={() => {
                    setCustomerType('walkin');
                    if (!customerName) setCustomerName(authPayerName);
                    if (!customerPhone) setCustomerPhone(authPayerPhone);
                  }}
                  className={`px-2 py-0.5 rounded-[2px] font-semibold cursor-pointer transition-colors ${
                    customerType === 'walkin'
                      ? 'bg-[#006a4e] text-white shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Walk-in
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setCustomerType('member');
                    if (!customerName) setCustomerName(authPayerName);
                    if (!customerPhone) setCustomerPhone(authPayerPhone);
                  }}
                  className={`px-2 py-0.5 rounded-[2px] font-semibold cursor-pointer transition-colors ${
                    customerType === 'member'
                      ? 'bg-[#006a4e] text-white shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Hospital Member
                </button>
              </div>
            </div>

            {/* Optional Member Selection Dropdown */}
            {customerType === 'member' && (
              <div className="flex items-center gap-2 pb-1 border-b border-slate-100">
                <span className="text-slate-500 font-medium text-xs min-w-[110px] shrink-0">Select Member :</span>
                <select
                  value={customerId}
                  onChange={(e) => {
                    const val = e.target.value;
                    setCustomerId(val);
                    const found = customers.find((c) => c.id === val);
                    if (found) {
                      setCustomerName(found.name);
                      setCustomerPhone(found.phone || '');
                    }
                  }}
                  className="flex-1 text-xs px-2 py-1 bg-white border border-slate-200 rounded-[3px] focus:outline-none focus:border-[#006a4e] font-medium text-slate-800"
                >
                  <option value="">-- {authPayerName} ({CURRENT_PATIENT.uhid}) --</option>
                  {customers.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} • {c.uhid || 'Member'} ({c.phone || 'N/A'})
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Flat Key : Value Grid (No Card-in-Card Nesting) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2.5 text-xs">
              {/* 1. Paid by (কে বিল পে করছে) */}
              <div className="flex items-center gap-2">
                <span className="text-slate-500 font-medium text-xs min-w-[110px] shrink-0">Paid by (ক্রেতা) :</span>
                <input
                  type="text"
                  value={activeCustomerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="Customer / Patient Name"
                  className="flex-1 px-2 py-1 bg-slate-50/60 hover:bg-white focus:bg-white border border-slate-200 hover:border-slate-300 focus:border-[#006a4e] rounded-[3px] font-bold text-slate-900 text-xs focus:outline-none transition-colors"
                />
              </div>

              {/* 2. Prepared by (কে প্রস্তুত করছে) */}
              <div className="flex items-center gap-2">
                <span className="text-slate-500 font-medium text-xs min-w-[110px] shrink-0">Prepared by :</span>
                <span className="font-bold text-slate-900 text-xs">
                  {cashierDisplayName}
                </span>
              </div>

              {/* 3. Phone */}
              <div className="flex items-center gap-2">
                <span className="text-slate-500 font-medium text-xs min-w-[110px] shrink-0">Phone :</span>
                <input
                  type="text"
                  value={activeCustomerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  placeholder="017xx-xxxxxx"
                  className="flex-1 px-2 py-1 bg-slate-50/60 hover:bg-white focus:bg-white border border-slate-200 hover:border-slate-300 focus:border-[#006a4e] rounded-[3px] text-slate-800 text-xs focus:outline-none transition-colors"
                />
              </div>

              {/* 4. Patient UHID */}
              <div className="flex items-center gap-2">
                <span className="text-slate-500 font-medium text-xs min-w-[110px] shrink-0">Patient UHID :</span>
                <span className="font-bold text-[#006a4e] text-xs">
                  {selectedCustomer?.uhid || CURRENT_PATIENT.uhid}
                </span>
              </div>

              {/* 5. Prescribed by */}
              <div className="flex items-center gap-2">
                <span className="text-slate-500 font-medium text-xs min-w-[110px] shrink-0">Prescribed by :</span>
                <input
                  type="text"
                  value={doctorName}
                  onChange={(e) => setDoctorName && setDoctorName(e.target.value)}
                  placeholder="Dr. Tariqul Islam"
                  className="flex-1 px-2 py-1 bg-slate-50/60 hover:bg-white focus:bg-white border border-slate-200 hover:border-slate-300 focus:border-[#006a4e] rounded-[3px] text-slate-800 text-xs focus:outline-none transition-colors"
                />
              </div>

              {/* 6. Care Location */}
              <div className="flex items-center gap-2">
                <span className="text-slate-500 font-medium text-xs min-w-[110px] shrink-0">Care Location :</span>
                <input
                  type="text"
                  value={careLocation}
                  onChange={(e) => setCareLocation && setCareLocation(e.target.value)}
                  placeholder="Counter 02"
                  className="flex-1 px-2 py-1 bg-slate-50/60 hover:bg-white focus:bg-white border border-slate-200 hover:border-slate-300 focus:border-[#006a4e] rounded-[3px] text-slate-800 text-xs focus:outline-none transition-colors"
                />
              </div>
            </div>
          </div>

          {/* Simple Clean Dividing Line */}
          <div className="border-t border-slate-100" />

          {/* Order Medicines Review Table */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between pb-1.5 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-xs text-slate-900">Order Medicines</h3>
                <span className="px-1.5 py-0.2 rounded-[2px] bg-slate-100 text-slate-600 font-semibold text-[11px]">
                  {cart.length} items ({cart.reduce((s, it) => s + it.qty, 0)} units)
                </span>
              </div>
              <button
                type="button"
                onClick={onBackToPos}
                className="text-[11px] font-semibold text-[#006a4e] hover:underline cursor-pointer flex items-center gap-1"
              >
                + Add More in POS
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs min-w-[480px]">
                <thead className="text-slate-500 border-b border-slate-200 font-semibold text-[11px]">
                  <tr>
                    <th className="pb-2 text-center w-6">#</th>
                    <th className="pb-2">Medicine Description</th>
                    <th className="pb-2 text-center">Packaging Unit</th>
                    <th className="pb-2 text-center w-28">Quantity</th>
                    <th className="pb-2 text-right">Unit Rate</th>
                    <th className="pb-2 text-right pr-2">Total</th>
                    {onRemoveCartItem && <th className="pb-2 text-center w-8" />}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {cart.map((it, idx) => {
                    const packPrice = getPackUnitPrice(it.medicine, it.saleUnit);
                    const lineTotal = packPrice * it.qty;
                    const unitLabel =
                      it.saleUnit === 'strip'
                        ? `Strip (${it.medicine.units_per_strip || 10})`
                        : it.saleUnit === 'box'
                          ? `Box (${it.medicine.units_per_box || 100})`
                          : 'Piece';

                    return (
                      <tr key={it.medicine.id} className="hover:bg-slate-50/60">
                        <td className="py-2.5 text-center text-slate-400 text-[11px]">{idx + 1}</td>
                        <td className="py-2.5">
                          <div className="font-semibold text-slate-900 leading-snug">{it.medicine.name}</div>
                          <div className="text-[10px] text-slate-400 leading-none mt-0.5">
                            {it.medicine.generic_name} • {it.medicine.dosage_form} {it.medicine.strength}
                          </div>
                        </td>
                        <td className="py-2.5 text-center text-slate-700 font-medium text-[11px]">
                          {unitLabel}
                        </td>
                        <td className="py-2.5 text-center">
                          {onUpdateCartQty ? (
                            <div className="inline-flex items-center justify-center gap-1.5">
                              <button
                                type="button"
                                onClick={() => onUpdateCartQty(it.medicine.id, -1)}
                                className="w-5 h-5 flex items-center justify-center rounded-[2px] border border-slate-300 hover:border-slate-400 text-slate-600 hover:text-slate-900 cursor-pointer transition-colors"
                                title="Decrease quantity"
                              >
                                <Minus className="w-3 h-3" />
                              </button>
                              <span className="w-6 text-center font-bold text-slate-900 text-xs select-none">
                                {it.qty}
                              </span>
                              <button
                                type="button"
                                onClick={() => onUpdateCartQty(it.medicine.id, 1)}
                                className="w-5 h-5 flex items-center justify-center rounded-[2px] border border-slate-300 hover:border-slate-400 text-slate-600 hover:text-slate-900 cursor-pointer transition-colors"
                                title="Increase quantity"
                              >
                                <Plus className="w-3 h-3" />
                              </button>
                            </div>
                          ) : (
                            <span className="font-bold text-slate-900">{it.qty}</span>
                          )}
                        </td>
                        <td className="py-2.5 text-right text-slate-600">৳ {packPrice.toFixed(2)}</td>
                        <td className="py-2.5 text-right pr-2 font-bold text-slate-900">৳ {lineTotal.toFixed(2)}</td>
                        {onRemoveCartItem && (
                          <td className="py-2.5 text-center">
                            <button
                              type="button"
                              onClick={() => onRemoveCartItem(it.medicine.id)}
                              className="text-slate-300 hover:text-rose-600 cursor-pointer p-1 transition-colors"
                              title="Remove item"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        )}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Column (5 cols): Bill Summary Header Exactly as in Screenshot */}
        <div className="lg:col-span-5 bg-white border border-slate-200 rounded-[3px] p-3.5 space-y-3.5 shadow-2xs">
          {/* Bill Summary Section Header Exactly as in Screenshot */}
          <div className="flex items-center gap-1.5 pb-2 border-b border-slate-100">
            <FileText className="w-4 h-4 text-slate-700" />
            <h3 className="font-bold text-xs text-slate-900">Bill Summary</h3>
          </div>

          {/* Key : Value Identity Info */}
          <div className="p-2.5 rounded-[3px] bg-slate-50 border border-slate-200/80 space-y-1.5 text-xs">
            <div className="flex justify-between items-center">
              <span className="text-slate-500 font-medium">Paid by (ক্রেতা) :</span>
              <span className="font-bold text-slate-900">{activeCustomerName}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-500 font-medium">Prepared by :</span>
              <span className="font-semibold text-slate-800">{cashierDisplayName}</span>
            </div>
          </div>

          {/* Breakdown Key-Values */}
          <div className="space-y-1.5 text-xs">
            <div className="flex justify-between text-slate-600">
              <span>Subtotal (মোট মূল্য) :</span>
              <span className="font-semibold text-slate-800">৳ {subtotal.toFixed(2)}</span>
            </div>

            {/* Discount Control */}
            <div className="flex items-center justify-between text-slate-600">
              <div className="flex items-center gap-1.5">
                <span>Special Discount :</span>
                <div className="inline-flex rounded-[2px] border border-slate-200 overflow-hidden text-[10px]">
                  <button
                    type="button"
                    onClick={() => setDiscountType('fixed')}
                    className={`px-1.5 py-0.5 font-bold cursor-pointer transition-colors ${
                      discountType === 'fixed' ? 'bg-[#006a4e] text-white' : 'bg-white text-slate-600'
                    }`}
                  >
                    ৳
                  </button>
                  <button
                    type="button"
                    onClick={() => setDiscountType('percent')}
                    className={`px-1.5 py-0.5 font-bold cursor-pointer transition-colors ${
                      discountType === 'percent' ? 'bg-[#006a4e] text-white' : 'bg-white text-slate-600'
                    }`}
                  >
                    %
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-1">
                <input
                  type="number"
                  min="0"
                  value={discount}
                  onChange={(e) => setDiscount(e.target.value)}
                  className="w-14 text-right px-1.5 py-0.5 rounded-[2px] border border-slate-300 font-bold text-slate-900 text-xs focus:outline-none"
                  placeholder="0"
                />
                <span className="font-semibold text-rose-600 text-xs w-14 text-right">
                  {discountAmount > 0 ? `-৳${discountAmount.toFixed(2)}` : '৳0.00'}
                </span>
              </div>
            </div>

            <div className="flex justify-between text-slate-600">
              <span>Govt VAT (5%) :</span>
              <span className="font-semibold text-slate-800">৳ {vatAmount.toFixed(2)}</span>
            </div>

            <div className="flex justify-between border-t border-slate-100 pt-1.5 font-extrabold text-slate-900 text-sm">
              <span>Total Payable (সর্বমোট প্রদেয়) :</span>
              <span className="text-[#006a4e]">৳ {grandTotal.toLocaleString()}</span>
            </div>
          </div>

          {/* Payment Method Switcher */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-semibold text-slate-600 block">
              Payment Method (পরিশোধের মাধ্যম) :
            </label>
            <div className="grid grid-cols-4 gap-1">
              {(
                [
                  { id: 'cash', label: 'Cash', icon: Banknote },
                  { id: 'card', label: 'Card', icon: CreditCard },
                  { id: 'mfs', label: 'bKash/MFS', icon: Smartphone },
                  { id: 'credit', label: 'Credit', icon: Wallet },
                ] as const
              ).map((m) => {
                const Icon = m.icon;
                const active = paymentMethod === m.id;
                return (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => setPaymentMethod(m.id)}
                    className={`py-1.5 px-1 rounded-[3px] border font-bold text-[11px] flex flex-col items-center justify-center gap-0.5 cursor-pointer transition-colors ${
                      active
                        ? 'bg-[#006a4e] text-white border-[#006a4e]'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{m.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Cash Tendered & Change Return */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold text-slate-600">Cash Received / Tendered :</span>
              <div className="flex gap-1 text-[10px]">
                <button
                  type="button"
                  onClick={() => {
                    setIsTenderCustom(false);
                    setTenderCash(grandTotal.toString());
                  }}
                  className="px-1.5 py-0.5 rounded-[2px] bg-emerald-50 text-[#006a4e] border border-emerald-200 font-bold cursor-pointer"
                >
                  Exact
                </button>
                {[500, 1000].map((note) => (
                  <button
                    key={note}
                    type="button"
                    onClick={() => {
                      setIsTenderCustom(true);
                      setTenderCash(note.toString());
                    }}
                    className="px-1.5 py-0.5 rounded-[2px] bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold cursor-pointer"
                  >
                    ৳{note}
                  </button>
                ))}
              </div>
            </div>

            <div className="relative">
              <span className="absolute left-2.5 top-1/2 -translate-y-1/2 font-bold text-slate-400 text-sm">৳</span>
              <input
                type="number"
                value={tenderCash}
                onChange={(e) => {
                  setIsTenderCustom(true);
                  setTenderCash(e.target.value);
                }}
                className="w-full text-right pr-3 pl-7 py-1.5 font-extrabold text-slate-900 bg-white border border-slate-300 rounded-[3px] text-sm focus:outline-none focus:border-[#006a4e]"
              />
            </div>

            <div className="flex items-center justify-between pt-1 text-xs">
              <span className="text-slate-600 font-semibold">Change to Return (ফেরত টাকা) :</span>
              <span className="font-extrabold text-[#006a4e] text-base">
                ৳ {changeDue.toLocaleString()}
              </span>
            </div>
          </div>

          {/* Primary Action Buttons */}
          <div className="space-y-1.5 pt-0.5">
            <button
              type="button"
              onClick={onCompleteSale}
              className="w-full py-2.5 rounded-[3px] bg-[#006a4e] hover:bg-[#00523c] text-white font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs transition-colors"
            >
              <Check className="w-4 h-4" />
              <span>Complete Sale &amp; View Official Receipt (৳ {grandTotal.toLocaleString()})</span>
            </button>

            <button
              type="button"
              onClick={onBackToPos}
              className="w-full py-1.5 rounded-[3px] border border-slate-300 bg-white hover:bg-slate-50 text-slate-600 font-semibold text-xs flex items-center justify-center gap-1 cursor-pointer transition-colors"
            >
              <ArrowLeft className="w-3 h-3" />
              <span>Return to POS Terminal</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
