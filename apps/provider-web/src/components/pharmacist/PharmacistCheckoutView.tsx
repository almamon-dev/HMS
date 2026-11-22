import React, { useMemo } from 'react';
import {
  ArrowLeft,
  Check,
  CreditCard,
  Banknote,
  Smartphone,
  Wallet,
  Minus,
  Plus,
  Trash2,
  User,
  ShieldCheck,
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
    <div className="space-y-2.5 font-['Inter',sans-serif] text-xs">
      {/* 1. Ultra-Minimal Header Design */}
      <div className="flex items-center justify-between pb-2 border-b border-slate-200">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onBackToPos}
            className="inline-flex items-center gap-1 px-2 py-1 rounded-[3px] text-slate-600 hover:text-slate-900 hover:bg-slate-100 font-semibold cursor-pointer transition-colors text-xs"
            title="Return to POS Terminal"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>POS</span>
          </button>
          <span className="text-slate-300">/</span>
          <h1 className="font-bold text-sm text-slate-900">Checkout &amp; Settlement</h1>
          <span className="text-[11px] font-semibold text-[#006a4e] bg-emerald-50 px-1.5 py-0.2 rounded-[2px] border border-emerald-200">
            {billNo}
          </span>
        </div>

        <div className="flex items-center gap-2.5">
          <span className="text-xs text-slate-500 font-medium hidden sm:inline">
            Total Payable: <strong className="text-slate-900 font-extrabold">৳ {grandTotal.toLocaleString()}</strong>
          </span>
          <button
            type="button"
            onClick={onCompleteSale}
            className="px-3.5 py-1.5 rounded-[3px] bg-[#006a4e] hover:bg-[#00523c] text-white font-bold text-xs inline-flex items-center gap-1.5 cursor-pointer shadow-2xs transition-colors"
          >
            <Check className="w-3.5 h-3.5" />
            <span>Complete Sale &amp; Receipt</span>
          </button>
        </div>
      </div>

      {/* 2. Flat Two-Column Layout (NO NESTED CARDS!) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 items-start">
        {/* Left Column (7 cols): Single Flat Card for Payer & Order Items */}
        <div className="lg:col-span-7 bg-white border border-slate-200 rounded-[3px] p-3.5 space-y-3.5 shadow-2xs">
          {/* Payer / Customer Section (Auto-populated from Auth) */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-[#006a4e]" />
                <h3 className="font-bold text-xs text-slate-900">Payer / Customer (বিল গ্রহীতা)</h3>
                <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-[2px] bg-emerald-50 text-[#006a4e] border border-emerald-200 text-[10px] font-semibold">
                  <ShieldCheck className="w-3 h-3" />
                  <span>Auth Verified</span>
                </span>
              </div>

              {/* Payer Mode Switcher */}
              <div className="inline-flex rounded-[2px] border border-slate-200 overflow-hidden text-[11px]">
                <button
                  type="button"
                  onClick={() => {
                    setCustomerType('member');
                    setCustomerName(authPayerName);
                    setCustomerPhone(authPayerPhone);
                    setCustomerId('');
                  }}
                  className={`px-2 py-0.5 font-semibold cursor-pointer transition-colors ${
                    customerType === 'member' && !customerId
                      ? 'bg-[#006a4e] text-white'
                      : 'bg-white text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  Auth Payer
                </button>
                <button
                  type="button"
                  onClick={() => setCustomerType('walkin')}
                  className={`px-2 py-0.5 font-semibold cursor-pointer transition-colors ${
                    customerType === 'walkin'
                      ? 'bg-[#006a4e] text-white'
                      : 'bg-white text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  Walk-in
                </button>
                <button
                  type="button"
                  onClick={() => setCustomerType('member')}
                  className={`px-2 py-0.5 font-semibold cursor-pointer transition-colors ${
                    customerType === 'member' && customerId
                      ? 'bg-[#006a4e] text-white'
                      : 'bg-white text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  Member List
                </button>
              </div>
            </div>

            {/* Payer Input Fields (Flat, no nested card) */}
            {customerType === 'member' && customerId ? (
              <div>
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
                  className="w-full text-xs px-2.5 py-1.5 bg-white border border-slate-300 rounded-[3px] focus:outline-none focus:border-[#006a4e] font-medium text-slate-800"
                >
                  <option value="">-- Choose Hospital Member --</option>
                  {customers.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} {c.phone ? `(${c.phone})` : ''} • {c.loyalty_points} Pts ({c.uhid || 'Member'})
                    </option>
                  ))}
                </select>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <div>
                  <label className="text-[11px] font-semibold text-slate-500 block mb-0.5">
                    Customer / Payer Name
                  </label>
                  <input
                    type="text"
                    value={activeCustomerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="Customer Name"
                    className="w-full text-xs px-2.5 py-1.5 bg-white border border-slate-300 rounded-[3px] focus:outline-none focus:border-[#006a4e] font-semibold text-slate-800"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-slate-500 block mb-0.5">
                    Phone Number
                  </label>
                  <input
                    type="text"
                    value={activeCustomerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    placeholder="Phone (017xx-xxxxxx)"
                    className="w-full text-xs px-2.5 py-1.5 bg-white border border-slate-300 rounded-[3px] focus:outline-none focus:border-[#006a4e] text-slate-800"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-slate-500 block mb-0.5">
                    UHID / Member Reference
                  </label>
                  <div className="w-full text-xs px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-[3px] font-semibold text-[#006a4e]">
                    {selectedCustomer?.uhid || CURRENT_PATIENT.uhid}
                  </div>
                </div>
              </div>
            )}

            {/* Prescriber & Care Location Fields (Flat row) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
              <div>
                <label className="text-[11px] font-semibold text-slate-500 block mb-0.5">
                  Prescribing Doctor / Consultant
                </label>
                <input
                  type="text"
                  value={doctorName}
                  onChange={(e) => setDoctorName && setDoctorName(e.target.value)}
                  placeholder="Dr. Name / OTC"
                  className="w-full text-xs px-2.5 py-1.5 bg-white border border-slate-300 rounded-[3px] focus:outline-none focus:border-[#006a4e] text-slate-800"
                />
              </div>
              <div>
                <label className="text-[11px] font-semibold text-slate-500 block mb-0.5">
                  Care Location / Counter
                </label>
                <input
                  type="text"
                  value={careLocation}
                  onChange={(e) => setCareLocation && setCareLocation(e.target.value)}
                  placeholder="OPD / Ward Counter"
                  className="w-full text-xs px-2.5 py-1.5 bg-white border border-slate-300 rounded-[3px] focus:outline-none focus:border-[#006a4e] text-slate-800"
                />
              </div>
            </div>
          </div>

          {/* Simple Dividing Line */}
          <div className="border-t border-slate-100" />

          {/* Order Review Items (Direct table, no nested card wrapper) */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-xs text-slate-900">
                Order Medicines ({cart.length} lines, {cart.reduce((s, it) => s + it.qty, 0)} units)
              </h3>
              <button
                type="button"
                onClick={onBackToPos}
                className="text-[11px] font-semibold text-[#006a4e] hover:underline cursor-pointer"
              >
                + Add More in POS
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs min-w-[460px]">
                <thead className="text-slate-500 border-b border-slate-200 font-semibold text-[11px]">
                  <tr>
                    <th className="pb-1.5 text-center w-6">#</th>
                    <th className="pb-1.5">Medicine</th>
                    <th className="pb-1.5 text-center">Unit</th>
                    <th className="pb-1.5 text-center w-24">Qty</th>
                    <th className="pb-1.5 text-right">Price</th>
                    <th className="pb-1.5 text-right">Total</th>
                    {onRemoveCartItem && <th className="pb-1.5 text-center w-6" />}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {cart.map((it, idx) => {
                    const packPrice = getPackUnitPrice(it.medicine, it.saleUnit);
                    const lineTotal = packPrice * it.qty;
                    return (
                      <tr key={it.medicine.id} className="hover:bg-slate-50/60">
                        <td className="py-2 text-center text-slate-400 text-[11px]">{idx + 1}</td>
                        <td className="py-2">
                          <span className="font-semibold text-slate-900">{it.medicine.name}</span>
                          <span className="text-[10px] text-slate-400 block">
                            {it.medicine.dosage_form} • {it.medicine.strength}
                          </span>
                        </td>
                        <td className="py-2 text-center capitalize text-slate-600 text-[11px]">
                          {it.saleUnit}
                        </td>
                        <td className="py-2 text-center">
                          {onUpdateCartQty ? (
                            <div className="inline-flex items-center gap-1 border border-slate-200 rounded-[2px] bg-slate-50 p-0.5">
                              <button
                                type="button"
                                onClick={() => onUpdateCartQty(it.medicine.id, -1)}
                                className="w-4 h-4 flex items-center justify-center rounded-[2px] bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 cursor-pointer"
                              >
                                <Minus className="w-2.5 h-2.5" />
                              </button>
                              <span className="w-5 text-center font-bold text-slate-900 text-xs">
                                {it.qty}
                              </span>
                              <button
                                type="button"
                                onClick={() => onUpdateCartQty(it.medicine.id, 1)}
                                className="w-4 h-4 flex items-center justify-center rounded-[2px] bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 cursor-pointer"
                              >
                                <Plus className="w-2.5 h-2.5" />
                              </button>
                            </div>
                          ) : (
                            <span className="font-bold text-slate-900">{it.qty}</span>
                          )}
                        </td>
                        <td className="py-2 text-right text-slate-600">৳ {packPrice.toFixed(2)}</td>
                        <td className="py-2 text-right font-bold text-slate-900">৳ {lineTotal.toFixed(2)}</td>
                        {onRemoveCartItem && (
                          <td className="py-2 text-center">
                            <button
                              type="button"
                              onClick={() => onRemoveCartItem(it.medicine.id)}
                              className="text-slate-300 hover:text-rose-600 cursor-pointer p-0.5"
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

        {/* Right Column (5 cols): Single Flat Summary & Payment Card */}
        <div className="lg:col-span-5 bg-white border border-slate-200 rounded-[3px] p-3.5 space-y-3.5 shadow-2xs">
          {/* Total Payable Summary Banner */}
          <div className="flex items-baseline justify-between border-b border-slate-100 pb-2">
            <div>
              <span className="text-[11px] font-semibold text-slate-500 block">Total Payable (সর্বমোট প্রদেয়)</span>
              <span className="text-2xl font-extrabold text-[#006a4e]">
                ৳ {grandTotal.toLocaleString()}
              </span>
            </div>
            <span className="text-[11px] text-slate-400 font-medium">
              Net after VAT &amp; discount
            </span>
          </div>

          {/* Breakdown Key-Values (Flat, no nested card) */}
          <div className="space-y-1.5 text-xs">
            <div className="flex justify-between text-slate-600">
              <span>Subtotal (মোট মূল্য)</span>
              <span className="font-semibold text-slate-800">৳ {subtotal.toFixed(2)}</span>
            </div>

            {/* Discount Control */}
            <div className="flex items-center justify-between text-slate-600">
              <div className="flex items-center gap-1.5">
                <span>Special Discount</span>
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
              <span>Govt VAT (5%)</span>
              <span className="font-semibold text-slate-800">৳ {vatAmount.toFixed(2)}</span>
            </div>

            <div className="flex justify-between border-t border-slate-100 pt-1.5 font-extrabold text-slate-900 text-sm">
              <span>Net Payable</span>
              <span className="text-[#006a4e]">৳ {grandTotal.toLocaleString()}</span>
            </div>
          </div>

          {/* Payment Method Switcher */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-semibold text-slate-600 block">
              Payment Method (মূল্য পরিশোধের মাধ্যম)
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
              <span className="text-[11px] font-semibold text-slate-600">Cash Received / Tendered:</span>
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
              <span className="text-slate-600 font-semibold">Change to Return (ফেরত টাকা):</span>
              <span className="font-extrabold text-[#006a4e] text-base">
                ৳ {changeDue.toLocaleString()}
              </span>
            </div>
          </div>

          {/* Billed By / Cashier (Auth Sourced) */}
          <div className="text-[11px] text-slate-400 text-center pt-2 border-t border-slate-100 flex items-center justify-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-[#006a4e]" />
            <span>Billed by (Auth): <strong className="text-slate-700">{cashierDisplayName}</strong></span>
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
