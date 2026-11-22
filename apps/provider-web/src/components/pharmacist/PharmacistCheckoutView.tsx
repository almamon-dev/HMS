import React from 'react';
import {
  ArrowLeft,
  Building2,
  AlertTriangle,
  Receipt,
  ShoppingCart,
  User,
  Plus,
  Minus,
  Trash2,
  CreditCard,
  Banknote,
  Smartphone,
  Wallet,
  Check,
} from 'lucide-react';
import { PosMedicine, SaleUnit, CartItem, CrmCustomer, DiscountType } from './PharmacistPosView';

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
  const selectedCustomer = customers.find((c) => c.id === customerId);

  if (cart.length === 0) {
    return (
      <div className="bg-white border border-slate-200 rounded-[3px] p-8 text-center space-y-4 max-w-lg mx-auto my-12 text-xs font-['Inter',sans-serif]">
        <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
          <ShoppingCart className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-base font-bold text-slate-800">Your POS Cart is Empty</h2>
          <p className="text-slate-500 mt-1">Please select medicines from the POS catalog first to proceed with checkout.</p>
        </div>
        <button
          type="button"
          onClick={onBackToPos}
          className="px-4 py-2 rounded-[3px] bg-[#006a4e] hover:bg-[#00523c] text-white font-bold text-xs inline-flex items-center gap-1.5 cursor-pointer shadow-sm transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to POS Terminal</span>
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-3 font-['Inter',sans-serif] text-xs">
      {/* 1. Checkout Page Header & Navigation Bar */}
      <div className="bg-white border border-slate-200/90 rounded-[3px] p-2.5 sm:p-3 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={onBackToPos}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[3px] border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 font-semibold cursor-pointer transition-colors shadow-2xs"
            title="Return to Point of Sale Terminal"
          >
            <ArrowLeft className="w-4 h-4 text-slate-600" />
            <span>Back to POS</span>
          </button>

          <div className="h-5 w-px bg-slate-200 hidden sm:block" />

          <div>
            <div className="flex items-center gap-2">
              <Receipt className="w-4 h-4 text-[#006a4e]" />
              <h1 className="font-bold text-sm text-slate-900 leading-tight">
                Order Checkout &amp; Bill Settlement
              </h1>
              <span className="px-2 py-0.5 rounded-[2px] bg-emerald-50 text-[#006a4e] border border-emerald-200 font-bold text-[11px]">
                {billNo}
              </span>
            </div>
            <p className="text-[11px] text-slate-500">
              Counter 02 • Central Medical Store • {cart.reduce((s, it) => s + it.qty, 0)} items in cart
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onBackToPos}
            className="px-3.5 py-1.5 rounded-[3px] border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 font-semibold cursor-pointer transition-colors text-xs"
          >
            Add More Medicines
          </button>
          <button
            type="button"
            onClick={onCompleteSale}
            className="px-4 py-1.5 rounded-[3px] bg-[#006a4e] hover:bg-[#00523c] text-white font-bold cursor-pointer transition-colors text-xs flex items-center gap-1.5 shadow-sm"
          >
            <Check className="w-4 h-4" />
            <span>Complete Checkout (৳ {grandTotal.toLocaleString()})</span>
          </button>
        </div>
      </div>

      {/* 2. Main Two-Column Checkout Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3.5 items-start">
        {/* Left Column (7 cols): Customer & Prescriber Form + Order Line Items Review */}
        <div className="lg:col-span-7 space-y-3">
          {/* Customer / Patient Section (Moved here from POS Sidebar!) */}
          <div className="bg-white border border-slate-200/90 rounded-[3px] p-3.5 shadow-2xs space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <div className="flex items-center gap-1.5">
                <User className="w-4 h-4 text-[#006a4e]" />
                <h3 className="font-bold text-xs text-slate-900">Customer / Patient Information</h3>
              </div>

              {/* Walk-in (Manual) vs Registered Member Switch */}
              <button
                type="button"
                role="switch"
                aria-checked={customerType === 'member'}
                onClick={() => {
                  if (customerType === 'walkin') {
                    setCustomerType('member');
                  } else {
                    setCustomerType('walkin');
                    setCustomerId('');
                  }
                }}
                className="flex items-center gap-2 cursor-pointer focus:outline-none group select-none"
                title="Toggle between Walk-in (Manual) and Registered Member"
              >
                <span
                  className={`text-[11px] font-semibold transition-colors ${
                    customerType === 'member' ? 'text-[#006a4e]' : 'text-slate-500'
                  }`}
                >
                  {customerType === 'member' ? 'Member' : 'Walk-in'}
                </span>
                <div
                  className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full transition-colors duration-200 ease-in-out ${
                    customerType === 'member' ? 'bg-[#006a4e]' : 'bg-slate-300'
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-xs transition duration-200 ease-in-out mt-0.5 ml-0.5 ${
                      customerType === 'member' ? 'translate-x-4' : 'translate-x-0'
                    }`}
                  />
                </div>
              </button>
            </div>

            {/* Mode 1: Walk-in Manual Entry */}
            {customerType === 'walkin' && (
              <div className="space-y-2">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <div>
                    <label className="text-[11px] font-semibold text-slate-700 block mb-1">
                      Customer / Patient Name (Optional)
                    </label>
                    <input
                      type="text"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      placeholder="Customer Name (Optional)"
                      className="w-full text-xs px-2.5 py-1.5 bg-white border border-slate-300 rounded-[3px] focus:outline-none focus:border-[#006a4e] text-slate-800 placeholder:text-slate-400"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-semibold text-slate-700 block mb-1">
                      Phone Number (Optional)
                    </label>
                    <input
                      type="text"
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      placeholder="Phone (e.g. 01711-xxxxxx)"
                      className="w-full text-xs px-2.5 py-1.5 bg-white border border-slate-300 rounded-[3px] focus:outline-none focus:border-[#006a4e] text-slate-800 placeholder:text-slate-400"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Mode 2: Registered Membership Selection */}
            {customerType === 'member' && (
              <div className="space-y-2.5">
                <div>
                  <label className="text-[11px] font-semibold text-slate-700 block mb-1">
                    Select Hospital Patient / Registered Member
                  </label>
                  <select
                    value={customerId}
                    onChange={(e) => {
                      const val = e.target.value;
                      setCustomerId(val);
                      const found = customers.find((c) => c.id === val);
                      if (found) {
                        setCustomerName(found.name);
                        setCustomerPhone(found.phone || '');
                      } else {
                        setCustomerName('');
                        setCustomerPhone('');
                      }
                    }}
                    className="w-full text-xs px-2.5 py-1.5 bg-white border border-slate-300 rounded-[3px] focus:outline-none focus:border-[#006a4e] font-medium text-slate-800"
                  >
                    <option value="">-- Choose Member / Patient --</option>
                    {customers.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name} {c.phone ? `(${c.phone})` : ''} • {c.loyalty_points} Points ({c.uhid || 'Member'})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Selected Member Detail Banner */}
                {selectedCustomer && (
                  <div className="p-2.5 rounded-[3px] bg-emerald-50/70 border border-emerald-200/90 space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-slate-900">{selectedCustomer.name}</span>
                      <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-[#006a4e] text-white font-bold text-[10px]">
                        ★ {selectedCustomer.loyalty_points} Loyalty Points
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-[11px] text-slate-600">
                      <span>{selectedCustomer.phone}</span>
                      <span>•</span>
                      <span className="font-semibold text-[#006a4e]">{selectedCustomer.uhid}</span>
                      {selectedCustomer.bedNo && (
                        <>
                          <span>•</span>
                          <span>Bed {selectedCustomer.bedNo} ({selectedCustomer.ward})</span>
                        </>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Inpatient Reference Badge */}
            {selectedCustomer?.bedNo && (
              <div className="flex items-center gap-2 p-2 rounded-[3px] bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs">
                <Building2 className="w-3.5 h-3.5 shrink-0" />
                <span>
                  Inpatient: <strong>{selectedCustomer.bedNo}</strong> ({selectedCustomer.ward}) • Consultant: {selectedCustomer.doctor}
                </span>
              </div>
            )}

            {/* Allergy Alert Banner */}
            {selectedCustomer?.allergies && (
              <div className="flex items-center gap-2 rounded-[3px] border border-rose-200 bg-rose-50 p-2 text-xs font-medium text-rose-700">
                <AlertTriangle className="h-3.5 w-3.5 shrink-0 text-rose-600" />
                <span>Allergy Alert: {selectedCustomer.allergies}</span>
              </div>
            )}

            {/* Prescriber & Care Location Inputs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1 border-t border-slate-100">
              <div>
                <label className="text-[11px] font-semibold text-slate-700 block mb-1">
                  Prescribing Doctor / Consultant
                </label>
                <input
                  type="text"
                  value={selectedCustomer?.doctor || doctorName}
                  onChange={(e) => setDoctorName && setDoctorName(e.target.value)}
                  placeholder="Dr. Name / OTC"
                  className="w-full text-xs px-2.5 py-1.5 bg-white border border-slate-300 rounded-[3px] focus:outline-none focus:border-[#006a4e] text-slate-800"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-700 block mb-1">
                  Care Location / Ward / Counter
                </label>
                <input
                  type="text"
                  value={selectedCustomer?.ward ? `Ward: ${selectedCustomer.ward} (Bed ${selectedCustomer.bedNo})` : careLocation}
                  onChange={(e) => setCareLocation && setCareLocation(e.target.value)}
                  placeholder="OPD / Ward Location"
                  className="w-full text-xs px-2.5 py-1.5 bg-white border border-slate-300 rounded-[3px] focus:outline-none focus:border-[#006a4e] text-slate-800"
                />
              </div>
            </div>
          </div>

          {/* Order Review Table */}
          <div className="bg-white border border-slate-200/90 rounded-[3px] p-3.5 shadow-2xs space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <ShoppingCart className="w-4 h-4 text-[#006a4e]" />
                <h3 className="font-bold text-xs text-slate-900">
                  Items in Order ({cart.length} medicines, {cart.reduce((s, it) => s + it.qty, 0)} units)
                </h3>
              </div>
              <button
                type="button"
                onClick={onBackToPos}
                className="text-[11px] font-semibold text-[#006a4e] hover:underline cursor-pointer"
              >
                + Add / Modify in POS
              </button>
            </div>

            <div className="border border-slate-200 rounded-[3px] overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs min-w-[500px]">
                  <thead className="bg-slate-50 text-slate-700 border-b border-slate-200 font-semibold">
                    <tr>
                      <th className="py-2 px-2.5 text-center w-8">#</th>
                      <th className="py-2 px-3">Medicine Description</th>
                      <th className="py-2 px-2 text-center">Unit</th>
                      <th className="py-2 px-2 text-center w-28">Quantity</th>
                      <th className="py-2 px-2.5 text-right">Unit Rate</th>
                      <th className="py-2 px-3 text-right">Line Total</th>
                      {onRemoveCartItem && <th className="py-2 px-2 text-center w-8" />}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {cart.map((it, idx) => {
                      const packPrice = getPackUnitPrice(it.medicine, it.saleUnit);
                      const lineTotal = packPrice * it.qty;
                      return (
                        <tr key={it.medicine.id} className="hover:bg-slate-50/70">
                          <td className="py-2 px-2.5 text-center text-slate-400 text-[11px]">{idx + 1}</td>
                          <td className="py-2 px-3">
                            <div className="font-semibold text-slate-900">{it.medicine.name}</div>
                            <div className="text-[11px] text-slate-500">
                              {it.medicine.dosage_form} • {it.medicine.strength}
                            </div>
                          </td>
                          <td className="py-2 px-2 text-center capitalize text-slate-700 text-[11px]">
                            {it.saleUnit}
                          </td>
                          <td className="py-2 px-2 text-center">
                            {onUpdateCartQty ? (
                              <div className="inline-flex items-center gap-1 border border-slate-200 rounded-[3px] p-0.5 bg-slate-50">
                                <button
                                  type="button"
                                  onClick={() => onUpdateCartQty(it.medicine.id, -1)}
                                  className="w-5 h-5 flex items-center justify-center rounded-[2px] bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 cursor-pointer"
                                >
                                  <Minus className="w-3 h-3" />
                                </button>
                                <span className="w-6 text-center font-bold text-slate-900 text-xs">
                                  {it.qty}
                                </span>
                                <button
                                  type="button"
                                  onClick={() => onUpdateCartQty(it.medicine.id, 1)}
                                  className="w-5 h-5 flex items-center justify-center rounded-[2px] bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 cursor-pointer"
                                >
                                  <Plus className="w-3 h-3" />
                                </button>
                              </div>
                            ) : (
                              <span className="font-bold text-slate-900">{it.qty}</span>
                            )}
                          </td>
                          <td className="py-2 px-2.5 text-right text-slate-600">৳ {packPrice.toFixed(2)}</td>
                          <td className="py-2 px-3 text-right font-bold text-slate-900">৳ {lineTotal.toFixed(2)}</td>
                          {onRemoveCartItem && (
                            <td className="py-2 px-2 text-center">
                              <button
                                type="button"
                                onClick={() => onRemoveCartItem(it.medicine.id)}
                                className="text-slate-400 hover:text-rose-600 cursor-pointer p-0.5"
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
        </div>

        {/* Right Column (5 cols): Settlement, Discounts, Payment Tender & Checkout */}
        <div className="lg:col-span-5 space-y-3">
          {/* Prominent Kotu Hoice / Total Amount Banner */}
          <div className="p-3.5 rounded-[3px] bg-emerald-50 border border-emerald-300 flex items-center justify-between shadow-2xs">
            <div>
              <span className="text-[11px] font-bold text-emerald-900 uppercase tracking-wide">
                সর্বমোট প্রদেয় বিল / Total Payable
              </span>
              <p className="text-xs text-emerald-700">
                {cart.reduce((sum, it) => sum + it.qty, 0)} items in order • Tax &amp; Discount applied
              </p>
            </div>
            <div className="text-right">
              <span className="text-2xl font-extrabold text-[#006a4e]">
                ৳ {grandTotal.toLocaleString()}
              </span>
            </div>
          </div>

          {/* Payment & Financial Settlement Details */}
          <div className="bg-white border border-slate-200/90 rounded-[3px] p-3.5 shadow-2xs space-y-3">
            <h3 className="font-bold text-xs text-slate-900 border-b border-slate-100 pb-2">
              Payment &amp; Settlement Details
            </h3>

            {/* Subtotal & Discount Calculation */}
            <div className="space-y-2 p-2.5 rounded-[3px] bg-slate-50 border border-slate-200 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Subtotal (মোট মূল্য):</span>
                <span className="font-semibold text-slate-800">৳ {subtotal.toFixed(2)}</span>
              </div>

              {/* Dual Discount Input Control */}
              <div className="flex items-center justify-between gap-2 pt-1 border-t border-slate-200/70">
                <div className="flex items-center gap-1.5">
                  <span className="text-slate-700 font-semibold">Special Discount:</span>
                  <div className="inline-flex rounded-[2px] border border-slate-200 overflow-hidden bg-white text-[10px]">
                    <button
                      type="button"
                      onClick={() => setDiscountType('fixed')}
                      className={`px-1.5 py-0.5 font-bold cursor-pointer transition-colors ${
                        discountType === 'fixed'
                          ? 'bg-[#006a4e] text-white'
                          : 'text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      ৳
                    </button>
                    <button
                      type="button"
                      onClick={() => setDiscountType('percent')}
                      className={`px-1.5 py-0.5 font-bold cursor-pointer transition-colors ${
                        discountType === 'percent'
                          ? 'bg-[#006a4e] text-white'
                          : 'text-slate-600 hover:bg-slate-100'
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
                    className="w-16 text-right px-2 py-0.5 rounded-[2px] border border-slate-300 bg-white font-bold text-slate-900 text-xs focus:outline-none"
                    placeholder="0"
                  />
                  <span className="font-semibold text-rose-600 text-xs w-16 text-right">
                    {discountAmount > 0 ? `-৳${discountAmount.toFixed(2)}` : '৳0.00'}
                  </span>
                </div>
              </div>

              <div className="flex justify-between text-slate-600">
                <span>Govt Tax (5% VAT):</span>
                <span className="font-semibold text-slate-800">৳ {vatAmount.toFixed(2)}</span>
              </div>

              <div className="flex justify-between border-t border-slate-200 pt-1 text-sm font-extrabold text-slate-900">
                <span>Net Payable:</span>
                <span className="text-[#006a4e]">৳ {grandTotal.toLocaleString()}</span>
              </div>
            </div>

            {/* Payment Method Switcher */}
            <div>
              <label className="text-[11px] font-semibold text-slate-700 block mb-1.5">
                Payment Method
              </label>
              <div className="grid grid-cols-4 gap-1.5">
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
                      className={`py-1.5 px-2 rounded-[3px] border font-bold text-[11px] flex flex-col items-center justify-center gap-1 cursor-pointer transition-colors ${
                        active
                          ? 'bg-[#006a4e] text-white border-[#006a4e] shadow-2xs'
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
            <div className="p-2.5 rounded-[3px] bg-slate-50 border border-slate-200 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-slate-700 font-semibold text-xs">Cash Received / Tendered:</span>
                <div className="flex gap-1">
                  <button
                    type="button"
                    onClick={() => {
                      setIsTenderCustom(false);
                      setTenderCash(grandTotal.toString());
                    }}
                    className="px-2 py-0.5 rounded-[2px] bg-emerald-100 hover:bg-emerald-200 text-emerald-900 font-bold text-[10px] cursor-pointer"
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
                      className="px-2 py-0.5 rounded-[2px] bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 font-bold text-[10px] cursor-pointer"
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

              <div className="flex items-center justify-between pt-1 border-t border-slate-200">
                <span className="text-slate-700 font-bold text-xs">Change to Return (ফেরত টাকা):</span>
                <span className="font-extrabold text-[#006a4e] text-base">
                  ৳ {changeDue.toLocaleString()}
                </span>
              </div>
            </div>

            {/* Bottom Primary Confirm Button */}
            <div className="space-y-2 pt-1">
              <button
                type="button"
                onClick={onCompleteSale}
                className="w-full py-2.5 rounded-[3px] bg-[#006a4e] hover:bg-[#00523c] text-white font-bold text-xs flex items-center justify-center gap-2 cursor-pointer shadow-sm transition-all"
              >
                <Check className="w-4 h-4" />
                <span>Complete Sale &amp; View Official Money Receipt (৳ {grandTotal.toLocaleString()})</span>
              </button>

              <button
                type="button"
                onClick={onBackToPos}
                className="w-full py-2 rounded-[3px] border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 font-semibold text-xs flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Return to POS Terminal</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
