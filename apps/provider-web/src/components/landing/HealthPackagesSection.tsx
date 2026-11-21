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
  description: string;
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
    description:
      'The Master Health Checkup is a comprehensive primary screening bundle designed for general well-being and early detection of lifestyle health issues. It includes complete blood count with ESR and blood grouping, fasting blood sugar & HbA1c for 3-month glycemic control, lipid and liver profiles (SGPT), serum creatinine for renal function, ECG, and digital chest radiography. Ideal for annual routine wellness evaluations with same-day digital report delivery.',
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
    categoryLabel: 'Comprehensive Panel',
    badge: 'Best Value',
    price: '৳ 7,500',
    regularPrice: '৳ 9,200',
    testCount: '32 Tests',
    turnaround: 'Report within 6 hrs',
    accent: 'teal',
    description:
      'Our flagship tertiary evaluation for corporate executives and individuals requiring in-depth whole-body diagnostic assessment. Encompasses comprehensive cardiac, renal, hepatic, and metabolic panels, full thyroid profiling (TSH, FT4), essential vitamins (Vitamin D & B12), whole abdomen ultrasound (USG), and a complete clinical evaluation with a Senior Consultant Physician with priority report turnaround within 6 hours.',
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
    description:
      'Designed by our Interventional Cardiology team to detect ischemic heart disease, hypertension, and arrhythmias before clinical symptoms appear. Features high-resolution 2D Echocardiogram with Color Doppler, Exercise Tolerance Test (ETT / TMT), 12-lead resting ECG, fasting lipid profiling, and ultra-sensitive cardiac biomarkers (hs-Troponin-I), followed by an in-person consultation with a Cardiologist.',
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
    description:
      'Specialized metabolic panel formulated for individuals diagnosed with diabetes, pre-diabetes, or related metabolic syndromes. Covers fasting & 2-hour postprandial glucose, HbA1c monitoring, urine microalbumin-to-creatinine ratio, estimated GFR with serum electrolytes, and individualized clinical nutrition counseling to prevent diabetic nephropathy and cardiovascular complications.',
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
    'executive-full-body',
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
    <section
      id="diagnostic"
      className="py-14 border-b border-slate-200/80"
      style={{ backgroundColor: '#ecf4fd' }}
    >
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
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
          <div className="inline-flex flex-wrap items-center gap-1.5 bg-white p-1 rounded-md border border-[#dae9ff] shadow-2xs self-start lg:self-auto">
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

        {/* Clean Stacked Accordion List (Matching Exact Reference Screenshot: #ecf4fd bg, white cards, #dae9ff divider, blue chevron) */}
        <div className="space-y-3.5">
          {visiblePackages.map((pkg) => {
            const isOpen = openPackageIds.includes(pkg.id);

            return (
              <div
                key={pkg.id}
                className="bg-white rounded-[4px] border border-[#dae9ff] shadow-xs overflow-hidden transition-all"
              >
                {/* Accordion Header Row (Click to toggle) */}
                <button
                  type="button"
                  onClick={() => togglePackage(pkg.id)}
                  aria-expanded={isOpen}
                  className="w-full px-6 py-4 flex items-center justify-between gap-4 text-left cursor-pointer hover:bg-slate-50/60 transition-colors"
                >
                  <div className="flex items-center gap-2.5 min-w-0 flex-1">
                    <span className="font-bold text-slate-900 text-sm sm:text-base">
                      {pkg.name}
                    </span>
                    <span className="text-xs font-bold text-[#0094b6]">
                      ({pkg.price})
                    </span>
                    <span className="hidden sm:inline-block text-xs font-semibold text-slate-500">
                      • {pkg.testCount} ({pkg.categoryLabel})
                    </span>
                  </div>

                  <div className="shrink-0">
                    {isOpen ? (
                      <ChevronUp className="w-5 h-5 text-[#2563eb] stroke-[2.5]" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-slate-700 stroke-[2.5]" />
                    )}
                  </div>
                </button>

                {/* Expanded Accordion Body (Matching User Reference Image: #dae9ff divider line & readable description) */}
                {isOpen && (
                  <div>
                    {/* Divider line matching exact screenshot */}
                    <div className="border-t border-[#dae9ff]" />

                    <div className="px-6 py-5 space-y-4 text-slate-700 text-xs sm:text-sm leading-relaxed bg-white">
                      {/* Package Description Paragraph */}
                      <p className="text-slate-600 leading-relaxed">
                        {pkg.description}
                      </p>

                      {/* Included Diagnostic Tests List (Clean 2-Column List) */}
                      <div className="pt-2">
                        <div className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2.5">
                          Included Tests & Screenings ({pkg.testCount}):
                        </div>
                        <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2">
                          {pkg.tests.map((test) => (
                            <li
                              key={test}
                              className="flex items-start gap-2.5 text-xs sm:text-[13px] text-slate-700 leading-snug"
                            >
                              <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                              <span className="font-medium">{test}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Package Pricing & Action Button */}
                      <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100">
                        <div className="text-xs text-slate-500">
                          Regular: <span className="line-through">{pkg.regularPrice}</span>{' '}
                          • Package Price:{' '}
                          <span className="font-extrabold text-[#006a4e] text-sm">
                            {pkg.price}
                          </span>{' '}
                          • Delivery:{' '}
                          <span className="font-semibold text-slate-700">
                            {pkg.turnaround}
                          </span>
                        </div>

                        <button
                          type="button"
                          onClick={() => onBookPackage(pkg.name)}
                          className="px-5 py-2.5 rounded bg-[#006a4e] hover:bg-[#00553e] text-white text-xs sm:text-sm font-bold flex items-center gap-1.5 cursor-pointer shadow-xs transition-colors"
                        >
                          <Calendar className="w-4 h-4" />
                          <span>Book {pkg.name}</span>
                          <ArrowRight className="w-4 h-4" />
                        </button>
                      </div>
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
