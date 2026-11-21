import React, { useState } from 'react';
import {
  CheckCircle2,
  ArrowRight,
  FlaskConical,
  ChevronDown,
  ChevronUp,
  Calendar,
} from 'lucide-react';

interface HealthPackagesSectionProps {
  onBookPackage: (packageName: string) => void;
}

type PackageCategory = 'all' | 'preventive' | 'specialty';

interface HealthPackage {
  id: string;
  name: string;
  category: Exclude<PackageCategory, 'all'>;
  categoryLabel: string;
  badge?: string;
  price: string;
  regularPrice: string;
  testCount: string;
  turnaround: string;
  accent: 'green' | 'teal';
  tests: string[];
}

const HEALTH_PACKAGES: HealthPackage[] = [
  {
    id: 'master-checkup',
    name: 'Master Health Checkup',
    category: 'preventive',
    categoryLabel: 'General Screening',
    badge: 'Most Popular',
    price: '৳ 3,800',
    regularPrice: '৳ 4,800',
    testCount: '18 Tests',
    turnaround: 'Same-day report',
    accent: 'green',
    tests: [
      'CBC with ESR & Blood Grouping',
      'Fasting Blood Glucose & HbA1c',
      'Lipid Profile & Liver Function (SGPT)',
      'Serum Creatinine, ECG & Chest X-Ray',
    ],
  },
  {
    id: 'executive-full-body',
    name: 'Executive Full-Body Checkup',
    category: 'preventive',
    categoryLabel: 'Comprehensive',
    badge: 'Best Value',
    price: '৳ 7,500',
    regularPrice: '৳ 9,200',
    testCount: '32 Tests',
    turnaround: 'Report within 6 hrs',
    accent: 'teal',
    tests: [
      'Complete Cardiac, Renal & Hepatic Panel',
      'Thyroid (TSH, FT4), Vitamin D & B12',
      'Whole Abdomen Ultrasonography (USG)',
      'Senior Physician Consultation Included',
    ],
  },
  {
    id: 'cardiac-wellness',
    name: 'Cardiac Wellness Screening',
    category: 'specialty',
    categoryLabel: 'Heart Care',
    badge: 'Cardiology Team',
    price: '৳ 5,900',
    regularPrice: '৳ 7,200',
    testCount: '14 Tests',
    turnaround: 'Priority reporting',
    accent: 'teal',
    tests: [
      '2D Echocardiogram (Color Doppler)',
      'Exercise Tolerance Test (ETT) & 12-Lead ECG',
      'Fasting Lipid Profile & hs-Troponin-I',
      'Interventional Cardiologist Review',
    ],
  },
  {
    id: 'diabetic-renal',
    name: 'Diabetic & Renal Care Panel',
    category: 'specialty',
    categoryLabel: 'Metabolic Care',
    badge: 'Specialist Panel',
    price: '৳ 2,900',
    regularPrice: '৳ 3,600',
    testCount: '12 Tests',
    turnaround: 'Same-day report',
    accent: 'green',
    tests: [
      'Fasting & 2-Hour Post-Meal Glucose',
      'HbA1c (3-Month Glycemic Control)',
      'Urine Microalbumin, eGFR & Electrolytes',
      'Clinical Nutritionist Diet Counseling',
    ],
  },
];

export const HealthPackagesSection: React.FC<HealthPackagesSectionProps> = ({
  onBookPackage,
}) => {
  const [filter, setFilter] = useState<PackageCategory>('all');
  const [openPackageIds, setOpenPackageIds] = useState<string[]>([
    'master-checkup',
  ]);

  const togglePackage = (id: string) => {
    setOpenPackageIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const visiblePackages =
    filter === 'all'
      ? HEALTH_PACKAGES
      : HEALTH_PACKAGES.filter((pkg) => pkg.category === filter);

  const filterTabs: { id: PackageCategory; label: string }[] = [
    { id: 'all', label: 'All Packages' },
    { id: 'preventive', label: 'Preventive Checkups' },
    { id: 'specialty', label: 'Cardiac & Diabetic' },
  ];

  return (
    <section id="diagnostic" className="py-14 bg-white border-b border-slate-200/80">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-8 gap-4">
          <div>
            <div className="text-xs font-bold text-[#006a4e] uppercase tracking-wider mb-1 flex items-center gap-1.5">
              <FlaskConical className="w-4 h-4 text-[#0094b6]" />
              <span>Preventive Diagnostics</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Health Checkup & Diagnostic Packages
            </h2>
            <p className="text-slate-600 text-xs sm:text-sm mt-1">
              Transparent diagnostic bundles with automated lab testing and fast online reports. Click any package to view details.
            </p>
          </div>

          {/* Filter Tabs */}
          <div className="inline-flex flex-wrap items-center gap-1.5 bg-[#f2f8f5] p-1 rounded-md border border-emerald-200/70 self-start lg:self-auto">
            {filterTabs.map((tab) => {
              const isActive = filter === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setFilter(tab.id)}
                  className={`px-3 py-1.5 rounded-md text-xs font-bold transition-colors cursor-pointer ${
                    isActive
                      ? 'bg-[#006a4e] text-white shadow-2xs'
                      : 'text-slate-700 hover:text-[#006a4e]'
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Clean Stacked Accordion List (Matching User Reference Image) */}
        <div className="space-y-3.5">
          {visiblePackages.map((pkg) => {
            const isGreen = pkg.accent === 'green';
            const isOpen = openPackageIds.includes(pkg.id);

            return (
              <div
                key={pkg.id}
                className="bg-white rounded-md border border-slate-200 shadow-2xs overflow-hidden transition-all"
              >
                {/* Accordion Header Row (Click to toggle) */}
                <button
                  type="button"
                  onClick={() => togglePackage(pkg.id)}
                  aria-expanded={isOpen}
                  className="w-full p-4 sm:p-5 flex items-center justify-between gap-4 text-left cursor-pointer hover:bg-slate-50/80 transition-colors"
                >
                  <div className="flex flex-wrap sm:flex-nowrap items-center gap-3 sm:gap-4 min-w-0 flex-1">
                    {/* Category Label */}
                    <span
                      className={`text-[10.5px] font-bold px-2.5 py-1 rounded-md shrink-0 ${
                        isGreen
                          ? 'bg-[#006a4e]/10 text-[#006a4e]'
                          : 'bg-[#0094b6]/10 text-[#0094b6]'
                      }`}
                    >
                      {pkg.categoryLabel}
                    </span>

                    {/* Title */}
                    <span className="text-sm sm:text-base font-extrabold text-slate-900 tracking-tight">
                      {pkg.name}
                    </span>

                    {/* Badge */}
                    {pkg.badge && (
                      <span className="hidden sm:inline-block text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-50 text-[#006a4e] border border-emerald-200/60 shrink-0">
                        {pkg.badge}
                      </span>
                    )}

                    {/* Metadata */}
                    <div className="hidden md:flex items-center gap-2 text-xs text-slate-500 font-semibold ml-auto mr-4">
                      <span className="text-slate-700 font-bold">{pkg.testCount}</span>
                      <span>•</span>
                      <span>{pkg.turnaround}</span>
                    </div>
                  </div>

                  {/* Right: Price & Chevron */}
                  <div className="flex items-center gap-3.5 sm:gap-5 shrink-0">
                    <div className="text-right">
                      <div
                        className={`text-base sm:text-lg font-black tracking-tight leading-none ${
                          isGreen ? 'text-[#006a4e]' : 'text-[#0094b6]'
                        }`}
                      >
                        {pkg.price}
                      </div>
                      <div className="text-[11px] text-slate-400 line-through font-medium mt-0.5">
                        {pkg.regularPrice}
                      </div>
                    </div>

                    <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-[#0094b6] transition-transform">
                      {isOpen ? (
                        <ChevronUp className="w-4 h-4 text-[#0094b6] stroke-[2.5]" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-slate-500 stroke-[2.5]" />
                      )}
                    </div>
                  </div>
                </button>

                {/* Expanded Accordion Body (Matching User Reference Image divider & content) */}
                {isOpen && (
                  <div className="px-5 pb-5 pt-4 border-t border-slate-100 bg-[#fafcfb] space-y-4">
                    {/* Mobile visible metadata */}
                    <div className="md:hidden flex items-center gap-2 text-xs text-slate-600 font-semibold">
                      <span className="text-slate-800 font-bold">{pkg.testCount}</span>
                      <span>•</span>
                      <span>{pkg.turnaround}</span>
                      {pkg.badge && (
                        <span className="ml-auto text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-50 text-[#006a4e] border border-emerald-200/60">
                          {pkg.badge}
                        </span>
                      )}
                    </div>

                    <div>
                      <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2.5">
                        Included Diagnostic Tests & Clinical Screenings ({pkg.testCount}):
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
                        {pkg.tests.map((test) => (
                          <div
                            key={test}
                            className="flex items-start gap-2 text-xs text-slate-700 bg-white p-3 rounded-md border border-slate-200/80 shadow-2xs"
                          >
                            <CheckCircle2
                              className={`w-4 h-4 mt-0.5 shrink-0 ${
                                isGreen ? 'text-[#006a4e]' : 'text-[#0094b6]'
                              }`}
                            />
                            <span className="font-semibold leading-snug">{test}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-200/70">
                      <p className="text-xs text-slate-500 font-medium">
                        Automated diagnostic pathology • Home sample collection available across Dhaka
                      </p>
                      <button
                        type="button"
                        onClick={() => onBookPackage(pkg.name)}
                        className={`px-5 py-2.5 rounded-md text-white text-xs sm:text-sm font-bold flex items-center gap-2 shadow-xs cursor-pointer transition-colors ${
                          isGreen
                            ? 'bg-[#006a4e] hover:bg-[#00553e]'
                            : 'bg-[#0094b6] hover:bg-[#007f9c]'
                        }`}
                      >
                        <Calendar className="w-4 h-4" />
                        <span>Book {pkg.name}</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default HealthPackagesSection;
