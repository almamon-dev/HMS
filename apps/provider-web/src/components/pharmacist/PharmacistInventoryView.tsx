import React, { useState } from 'react';
import {
  AlertTriangle,
  Boxes,
  Download,
  Filter,
  Plus,
  Search,
} from 'lucide-react';

interface MedicineItem {
  id: string;
  code: string;
  brandName: string;
  genericName: string;
  dosageForm: string;
  strength: string;
  manufacturer: string;
  category: string;
  centralStock: number;
  dhanmondiStock: number;
  uttaraStock: number;
  mirpurStock: number;
  unitPrice: number;
  reorderLevel: number;
  status: 'In Stock' | 'Low Stock' | 'Critical';
}

export const PharmacistInventoryView: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const medicines: MedicineItem[] = [
    {
      id: 'MED-101',
      code: 'PAR-EXTRA',
      brandName: 'Napa Extra',
      genericName: 'Paracetamol + Caffeine',
      dosageForm: 'Tablet',
      strength: '500mg + 65mg',
      manufacturer: 'Beximco Pharmaceuticals Ltd.',
      category: 'Analgesics & Antipyretic',
      centralStock: 12500,
      dhanmondiStock: 1400,
      uttaraStock: 850,
      mirpurStock: 620,
      unitPrice: 3.5,
      reorderLevel: 1000,
      status: 'In Stock',
    },
    {
      id: 'MED-102',
      code: 'ESO-MAX',
      brandName: 'Maxpro',
      genericName: 'Esomeprazole Magnesium',
      dosageForm: 'Capsule',
      strength: '20mg',
      manufacturer: 'Square Pharmaceuticals Ltd.',
      category: 'Gastrointestinal (PPI)',
      centralStock: 8400,
      dhanmondiStock: 920,
      uttaraStock: 480,
      mirpurStock: 310,
      unitPrice: 9.0,
      reorderLevel: 800,
      status: 'In Stock',
    },
    {
      id: 'MED-103',
      code: 'CEF-1G',
      brandName: 'Ceftron 1g IV/IM',
      genericName: 'Ceftriaxone Sodium',
      dosageForm: 'Injection (Vial)',
      strength: '1g',
      manufacturer: 'Square Pharmaceuticals Ltd.',
      category: 'Antibiotics & Cephalosporins',
      centralStock: 140,
      dhanmondiStock: 25,
      uttaraStock: 15,
      mirpurStock: 10,
      unitPrice: 195.0,
      reorderLevel: 300,
      status: 'Critical',
    },
    {
      id: 'MED-104',
      code: 'MER-1G',
      brandName: 'Meronem 1g IV',
      genericName: 'Meropenem Trihydrate',
      dosageForm: 'Injection (Vial)',
      strength: '1g',
      manufacturer: 'Incepta Pharmaceuticals',
      category: 'Antibiotics & Carbapenems',
      centralStock: 320,
      dhanmondiStock: 45,
      uttaraStock: 30,
      mirpurStock: 20,
      unitPrice: 1100.0,
      reorderLevel: 150,
      status: 'In Stock',
    },
    {
      id: 'MED-105',
      code: 'MON-10',
      brandName: 'Monas 10mg',
      genericName: 'Montelukast Sodium',
      dosageForm: 'Chewable Tablet',
      strength: '10mg',
      manufacturer: 'Acme Laboratories Ltd.',
      category: 'Respiratory & Antiasthmatic',
      centralStock: 2100,
      dhanmondiStock: 180,
      uttaraStock: 90,
      mirpurStock: 40,
      unitPrice: 17.0,
      reorderLevel: 400,
      status: 'Low Stock',
    },
    {
      id: 'MED-106',
      code: 'CLO-75',
      brandName: 'Plagrin 75mg',
      genericName: 'Clopidogrel Bisulfate',
      dosageForm: 'Tablet',
      strength: '75mg',
      manufacturer: 'Square Pharmaceuticals Ltd.',
      category: 'Cardiovascular (Antiplatelet)',
      centralStock: 4600,
      dhanmondiStock: 540,
      uttaraStock: 320,
      mirpurStock: 210,
      unitPrice: 14.0,
      reorderLevel: 500,
      status: 'In Stock',
    },
  ];

  const categories = ['All', 'Analgesics & Antipyretic', 'Gastrointestinal (PPI)', 'Antibiotics & Cephalosporins', 'Antibiotics & Carbapenems', 'Respiratory & Antiasthmatic', 'Cardiovascular (Antiplatelet)'];

  const filtered = medicines.filter((m) => {
    if (selectedCategory !== 'All' && m.category !== selectedCategory) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        m.brandName.toLowerCase().includes(q) ||
        m.genericName.toLowerCase().includes(q) ||
        m.manufacturer.toLowerCase().includes(q) ||
        m.code.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Boxes className="w-5 h-5 text-teal-700" />
            Enterprise Multi-Branch Medicine Formulary Master
          </h2>
          <p className="text-xs text-slate-500">
            Real-time unified inventory ledger across Central Medical Store and retail satellite branch pharmacies.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold flex items-center gap-1.5 cursor-pointer">
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>
          <button className="px-3.5 py-1.5 bg-teal-700 hover:bg-teal-800 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-xs cursor-pointer">
            <Plus className="w-3.5 h-3.5" />
            <span>Add Medicine</span>
          </button>
        </div>
      </div>

      {/* Filter Ribbon */}
      <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-xs space-y-3">
        <div className="flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by brand name, generic formulation, manufacturer, or item code..."
              className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-teal-600 focus:bg-white"
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-1 [scrollbar-width:none]">
            <Filter className="w-4 h-4 text-slate-400 shrink-0" />
            {categories.slice(0, 4).map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap cursor-pointer transition-colors ${
                  selectedCategory === cat
                    ? 'bg-teal-800 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Inventory Table */}
      <div className="bg-white rounded-xl border border-slate-200/90 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#0c2e4b] text-white border-b border-[#082136] font-semibold">
              <tr>
                <th className="py-3 px-4">Medicine Item</th>
                <th className="py-3 px-3">Manufacturer & Category</th>
                <th className="py-3 px-3 text-center bg-[#08233a]">CMS Central</th>
                <th className="py-3 px-2 text-center">Dhanmondi</th>
                <th className="py-3 px-2 text-center">Uttara</th>
                <th className="py-3 px-2 text-center">Mirpur</th>
                <th className="py-3 px-3 text-right">Unit MRP</th>
                <th className="py-3 px-4 text-center">Health Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3 px-4">
                    <div className="font-bold text-slate-900 text-sm">{item.brandName}</div>
                    <div className="text-[11px] text-slate-500">{item.genericName} ({item.strength})</div>
                    <div className="text-[10px] text-teal-700 font-mono mt-0.5">{item.dosageForm} • {item.code}</div>
                  </td>
                  <td className="py-3 px-3">
                    <div className="text-slate-800 font-medium">{item.manufacturer}</div>
                    <div className="text-[10px] text-slate-400 mt-0.5">{item.category}</div>
                  </td>
                  <td className="py-3 px-3 text-center font-bold text-slate-900 bg-slate-50/70 font-mono">
                    {item.centralStock.toLocaleString()}
                  </td>
                  <td className="py-3 px-2 text-center font-mono text-slate-700">
                    {item.dhanmondiStock.toLocaleString()}
                  </td>
                  <td className="py-3 px-2 text-center font-mono text-slate-700">
                    {item.uttaraStock.toLocaleString()}
                  </td>
                  <td className="py-3 px-2 text-center font-mono text-slate-700">
                    {item.mirpurStock.toLocaleString()}
                  </td>
                  <td className="py-3 px-3 text-right font-bold text-slate-800">
                    ৳ {item.unitPrice.toFixed(2)}
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold ${
                        item.status === 'In Stock'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : item.status === 'Low Stock'
                          ? 'bg-amber-50 text-amber-700 border border-amber-200'
                          : 'bg-rose-50 text-rose-700 border border-rose-200 animate-pulse'
                      }`}
                    >
                      {item.status === 'Critical' && <AlertTriangle className="w-3 h-3" />}
                      {item.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="p-3 bg-slate-50 border-t border-slate-100 text-xs text-slate-500 flex items-center justify-between">
          <span>Showing {filtered.length} products across 4 branches</span>
          <span className="font-semibold text-slate-700">Total Enterprise SKUs: 1,480 Active</span>
        </div>
      </div>
    </div>
  );
};
