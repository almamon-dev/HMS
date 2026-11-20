import React, { useState } from 'react';
import { Activity, CheckCircle2, ArrowRight, FlaskConical } from 'lucide-react';

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
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
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
              Transparent diagnostic bundles with automated lab testing and fast online reports.
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

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {visiblePackages.map((pkg) => {
            const isGreen = pkg.accent === 'green';
            return (
              <div
                key={pkg.id}
                className="group bg-white rounded-md p-5 border border-emerald-200/70 shadow-xs hover:shadow-md hover:border-[#0094b6]/40 transition-all duration-200 flex flex-col justify-between gap-4"
              >
                <div className="space-y-3.5">
                  {/* Top Category & Badge */}
                  <div className="flex items-center justify-between gap-2">
                    <span
                      className={`text-[10px] font-bold px-2.5 py-1 rounded-md ${
                        isGreen
                          ? 'bg-[#006a4e]/10 text-[#006a4e]'
                          : 'bg-[#0094b6]/10 text-[#0094b6]'
                      }`}
                    >
                      {pkg.categoryLabel}
                    </span>

                    {pkg.badge ? (
                      <span className="text-[10px] font-bold px-2 py-1 rounded-md bg-slate-100 text-slate-700">
                        {pkg.badge}
                      </span>
                    ) : (
                      <Activity className="w-4 h-4 text-[#0094b6]" />
                    )}
                  </div>

                  {/* Package Title & Transparent Pricing */}
                  <div>
                    <h3 className="text-sm font-extrabold text-slate-900 leading-snug">
                      {pkg.name}
                    </h3>

                    <div className="mt-2 flex items-baseline gap-2">
                      <span
                        className={`text-2xl font-black tracking-tight ${
                          isGreen ? 'text-[#006a4e]' : 'text-[#0094b6]'
                        }`}
                      >
                        {pkg.price}
                      </span>
                      <span className="text-xs text-slate-400 line-through font-medium">
                        {pkg.regularPrice}
                      </span>
                    </div>

                    <div className="mt-1.5 flex items-center gap-2 text-[11px] font-semibold text-slate-500">
                      <span className="text-slate-700 font-bold">{pkg.testCount}</span>
                      <span>•</span>
                      <span>{pkg.turnaround}</span>
                    </div>
                  </div>

                  {/* Included Tests Checklist */}
                  <ul className="space-y-2 pt-2 border-t border-slate-100">
                    {pkg.tests.map((test) => (
                      <li
                        key={test}
                        className="flex items-start gap-2 text-xs text-slate-600 leading-snug"
                      >
                        <CheckCircle2
                          className={`w-3.5 h-3.5 mt-0.5 shrink-0 ${
                            isGreen ? 'text-[#006a4e]' : 'text-[#0094b6]'
                          }`}
                        />
                        <span>{test}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Book CTA */}
                <button
                  onClick={() => onBookPackage(pkg.name)}
                  className="w-full pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-[#006a4e] group-hover:text-[#0094b6] transition-colors cursor-pointer"
                >
                  <span>Book Checkup Package</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default HealthPackagesSection;

