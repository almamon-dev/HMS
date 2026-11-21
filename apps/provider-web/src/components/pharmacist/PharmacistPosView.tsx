import React, { useState } from 'react';
import {
  Minus,
  Plus,
  Printer,
  QrCode,
  Receipt,
  Search,
  ShoppingCart,
  Trash2,
  Zap,
} from 'lucide-react';

interface CartItem {
  id: string;
  name: string;
  generic: string;
  batch: string;
  expiry: string;
  unitPrice: number;
  quantity: number;
  stock: number;
}

export const PharmacistPosView: React.FC = () => {
  const [barcodeInput, setBarcodeInput] = useState('');
  const [customerName, setCustomerName] = useState('Walk-in Customer');
  const [customerPhone, setCustomerPhone] = useState('');
  const [paymentMode, setPaymentMode] = useState<'cash' | 'card' | 'mfs'>('cash');
  const [discountPercent, setDiscountPercent] = useState<number>(0);
  const [paidSuccess, setPaidSuccess] = useState<boolean>(false);

  const availableItems: CartItem[] = [
    { id: 'MED-01', name: 'Napa Extra 500mg/65mg', generic: 'Paracetamol + Caffeine', batch: 'NP-2026-A1', expiry: '2026-12', unitPrice: 3.5, quantity: 1, stock: 450 },
    { id: 'MED-02', name: 'Monas 10mg Tab', generic: 'Montelukast Sodium', batch: 'MN-2025-C4', expiry: '2027-04', unitPrice: 17.0, quantity: 1, stock: 220 },
    { id: 'MED-03', name: 'Maxpro 20mg Capsule', generic: 'Esomeprazole Magnesium', batch: 'MX-2026-E2', expiry: '2026-11', unitPrice: 9.0, quantity: 1, stock: 340 },
    { id: 'MED-04', name: 'Azithrocin 500mg', generic: 'Azithromycin Dihydrate', batch: 'AZ-2025-B9', expiry: '2026-08', unitPrice: 35.0, quantity: 1, stock: 95 },
    { id: 'MED-05', name: 'Bextram Gold Tab', generic: 'Multivitamin & Minerals', batch: 'BX-2026-G1', expiry: '2027-01', unitPrice: 12.0, quantity: 1, stock: 180 },
    { id: 'MED-06', name: 'Sergel 20mg Cap', generic: 'Esomeprazole Trihydrate', batch: 'SG-2025-X7', expiry: '2026-09', unitPrice: 8.0, quantity: 1, stock: 500 },
  ];

  const [cart, setCart] = useState<CartItem[]>([
    { id: 'MED-01', name: 'Napa Extra 500mg/65mg', generic: 'Paracetamol + Caffeine', batch: 'NP-2026-A1', expiry: '2026-12', unitPrice: 3.5, quantity: 10, stock: 450 },
    { id: 'MED-03', name: 'Maxpro 20mg Capsule', generic: 'Esomeprazole Magnesium', batch: 'MX-2026-E2', expiry: '2026-11', unitPrice: 9.0, quantity: 14, stock: 340 },
  ]);

  const addToCart = (item: CartItem) => {
    const existing = cart.find((c) => c.id === item.id);
    if (existing) {
      setCart(cart.map((c) => (c.id === item.id ? { ...c, quantity: c.quantity + 1 } : c)));
    } else {
      setCart([...cart, { ...item, quantity: 1 }]);
    }
  };

  const updateQuantity = (id: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.id === id) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const removeItem = (id: string) => {
    setCart(cart.filter((c) => c.id !== id));
  };

  const handleBarcodeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!barcodeInput) return;
    const found = availableItems.find(
      (m) =>
        m.name.toLowerCase().includes(barcodeInput.toLowerCase()) ||
        m.generic.toLowerCase().includes(barcodeInput.toLowerCase()) ||
        m.id.toLowerCase() === barcodeInput.toLowerCase()
    );
    if (found) {
      addToCart(found);
      setBarcodeInput('');
    }
  };

  const subtotal = cart.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
  const discountAmount = (subtotal * discountPercent) / 100;
  const vat = (subtotal - discountAmount) * 0.05; // 5% VAT
  const grandTotal = Math.round(subtotal - discountAmount + vat);

  const handleCheckout = () => {
    setPaidSuccess(true);
    setTimeout(() => {
      setCart([]);
      setPaidSuccess(false);
    }, 2500);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Receipt className="w-5 h-5 text-teal-700" />
            Pharmacy Point of Sale (POS Terminal)
          </h2>
          <p className="text-xs text-slate-500">
            Rapid barcode billing, FEFO batch selection, OTC dispensing, and instant thermal receipt printing.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-1 rounded bg-teal-50 text-teal-700 text-xs font-semibold border border-teal-200 flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
            Fast Scanner Mode Active
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Product Selection & Barcode Scan (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          {/* Barcode Search Box */}
          <form onSubmit={handleBarcodeSubmit} className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-xs">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Scan Barcode / Search Formulary
            </label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  value={barcodeInput}
                  onChange={(e) => setBarcodeInput(e.target.value)}
                  placeholder="Scan medicine barcode or type brand / generic name..."
                  className="w-full pl-9 pr-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-teal-600 focus:bg-white"
                  autoFocus
                />
              </div>
              <button
                type="submit"
                className="px-4 py-2 bg-[#0c2e4b] hover:bg-[#0e4778] text-white text-xs font-bold rounded-lg flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <QrCode className="w-4 h-4 text-[#00c2cb]" />
                <span>Add Item</span>
              </button>
            </div>
          </form>

          {/* Quick Select Grid */}
          <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-xs space-y-3">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Popular OTC & Rapid Dispense Medicines
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {availableItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => addToCart(item)}
                  className="p-3 text-left border border-slate-200 rounded-lg hover:border-teal-500 hover:bg-teal-50/40 transition-all flex flex-col justify-between group cursor-pointer"
                >
                  <div>
                    <div className="text-xs font-bold text-slate-900 group-hover:text-teal-800">
                      {item.name}
                    </div>
                    <div className="text-[11px] text-slate-500 truncate">{item.generic}</div>
                  </div>
                  <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                    <span className="font-semibold text-teal-800">৳ {item.unitPrice.toFixed(2)}</span>
                    <span className="text-[10px] text-slate-400">Stock: {item.stock}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Checkout Cart & Bill Summary (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white rounded-xl border border-slate-200/90 shadow-xs flex flex-col">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShoppingCart className="w-4 h-4 text-teal-700" />
                <h3 className="font-bold text-sm text-slate-900">Current Order Cart</h3>
              </div>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                {cart.length} items
              </span>
            </div>

            {/* Customer Inputs */}
            <div className="p-3 bg-slate-50/70 border-b border-slate-100 grid grid-cols-2 gap-2">
              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase">Customer Name</label>
                <input
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full text-xs px-2.5 py-1.5 bg-white border border-slate-200 rounded"
                />
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase">Phone (Optional)</label>
                <input
                  type="text"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  placeholder="017XXXXXXXX"
                  className="w-full text-xs px-2.5 py-1.5 bg-white border border-slate-200 rounded"
                />
              </div>
            </div>

            {/* Cart Items List */}
            <div className="p-3 divide-y divide-slate-100 max-h-[300px] overflow-y-auto">
              {cart.length === 0 ? (
                <div className="text-center py-8 text-xs text-slate-400">
                  Cart is empty. Scan barcode or select medicines to begin.
                </div>
              ) : (
                cart.map((item) => (
                  <div key={item.id} className="py-2.5 flex items-center justify-between gap-2">
                    <div className="min-w-0 flex-1">
                      <div className="text-xs font-bold text-slate-900 truncate">{item.name}</div>
                      <div className="text-[10px] text-slate-400">
                        Batch: {item.batch} • Exp: {item.expiry}
                      </div>
                      <div className="text-xs font-semibold text-teal-700 mt-0.5">
                        ৳ {item.unitPrice.toFixed(2)} × {item.quantity} = ৳ {(item.unitPrice * item.quantity).toFixed(2)}
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        onClick={() => updateQuantity(item.id, -1)}
                        className="p-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="w-6 text-center text-xs font-bold">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, 1)}
                        className="p-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="p-1 text-slate-400 hover:text-rose-600 ml-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Calculations & Bill */}
            <div className="p-4 bg-slate-50 border-t border-slate-100 space-y-2 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Subtotal</span>
                <span className="font-semibold">৳ {subtotal.toFixed(2)}</span>
              </div>
              <div className="flex items-center justify-between text-slate-600">
                <span>Special Discount (%)</span>
                <div className="flex items-center gap-1">
                  {[0, 5, 10].map((d) => (
                    <button
                      key={d}
                      onClick={() => setDiscountPercent(d)}
                      className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                        discountPercent === d
                          ? 'bg-teal-700 text-white'
                          : 'bg-white border border-slate-200 text-slate-600'
                      }`}
                    >
                      {d}%
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Govt VAT (5%)</span>
                <span>৳ {vat.toFixed(2)}</span>
              </div>
              <div className="pt-2 border-t border-slate-200 flex justify-between text-sm font-bold text-slate-900">
                <span>Grand Total</span>
                <span className="text-teal-800 text-base">৳ {grandTotal}</span>
              </div>

              {/* Payment Mode Selector */}
              <div className="pt-2">
                <div className="text-[10px] font-bold text-slate-400 uppercase mb-1.5">Payment Method</div>
                <div className="grid grid-cols-3 gap-1.5">
                  {(['cash', 'card', 'mfs'] as const).map((mode) => (
                    <button
                      key={mode}
                      onClick={() => setPaymentMode(mode)}
                      className={`py-1.5 text-xs font-semibold rounded border uppercase tracking-wider ${
                        paymentMode === mode
                          ? 'bg-teal-800 text-white border-teal-800'
                          : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {mode}
                    </button>
                  ))}
                </div>
              </div>

              {/* Checkout Button */}
              {paidSuccess ? (
                <div className="mt-3 p-3 bg-emerald-600 text-white text-center rounded-lg font-bold flex items-center justify-center gap-2">
                  <Printer className="w-4 h-4 animate-bounce" />
                  <span>Payment Complete! Printing Invoice...</span>
                </div>
              ) : (
                <button
                  disabled={cart.length === 0}
                  onClick={handleCheckout}
                  className="mt-3 w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-300 text-white rounded-lg font-bold text-sm shadow-sm flex items-center justify-center gap-2 cursor-pointer transition-all"
                >
                  <Receipt className="w-4 h-4" />
                  <span>Pay & Print Invoice (৳ {grandTotal})</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
