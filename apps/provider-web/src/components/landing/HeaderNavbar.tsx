import {
  ChevronDown,
  Globe,
  Menu,
  Phone,
  Search,
  Sparkles,
  Stethoscope,
  X,
} from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';

interface HeaderNavbarProps {
  onOpenPortals: () => void;
  onOpenAppointment: () => void;
  onOpenSuperadmin: () => void;
  onGoHome?: () => void;
}

type Language = 'en' | 'bn';

interface MegaMenuSection {
  title: string;
  titleBn: string;
  links: {
    label: string;
    labelBn: string;
    href?: string;
    action?: () => void;
    highlight?: boolean;
    badge?: string;
  }[];
}

interface MegaMenuColumn {
  sections: MegaMenuSection[];
}

interface MainNavItem {
  id: string;
  label: string;
  labelBn: string;
  columns: MegaMenuColumn[];
}

export const HeaderNavbar: React.FC<HeaderNavbarProps> = ({
  onOpenPortals,
  onOpenAppointment,
  onOpenSuperadmin,
  onGoHome,
}) => {
  const [lang, setLang] = useState<Language>('en');
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileAccordion, setMobileAccordion] = useState<string | null>(null);
  const [activeNavId, setActiveNavId] = useState<string>('about');

  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const navRef = useRef<HTMLElement>(null);

  // Close dropdown on outside click or Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setActiveDropdown(null);
        setSearchOpen(false);
        setMobileMenuOpen(false);
      }
    };

    const handleClickOutside = (e: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(e.target as Node)) {
        setActiveDropdown(null);
        setSearchOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleMouseEnter = (id: string) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setActiveDropdown(id);
    setActiveNavId(id);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setActiveDropdown(null);
    }, 150);
  };

  const handleToggleMenu = (id: string) => {
    setActiveDropdown((prev) => (prev === id ? null : id));
    setActiveNavId(id);
  };

  // 1) TOP UTILITY BAR ITEMS (Compact, Clean & Essential Hospital Links)
  const topNavItems = [
    { label: 'Patients', labelBn: 'পেশেন্ট', action: onOpenPortals },
    { label: 'OPD Admission', labelBn: 'বহির্বিভাগ ভর্তি', action: onOpenAppointment },
    { label: 'Doctors & Staff', labelBn: 'ডাক্তার ও স্টাফ', action: onOpenPortals },
    { label: 'Medical Reports', labelBn: 'মেডিকেল রিপোর্ট', action: onOpenPortals },
    { label: 'Hospital Notices', labelBn: 'হাসপাতাল নোটিশ', href: '#news' },
    { label: 'Doctor Verification', labelBn: 'ডাক্তার যাচাই', action: onOpenPortals },
  ];

  // 2) MAIN NAVBAR DROPDOWNS (100% Hospital Data in 4-Column Mega-Menus)
  const mainNavItems: MainNavItem[] = [
    {
      id: 'about',
      label: 'About Us',
      labelBn: 'আমাদের সম্পর্কে',
      columns: [
        {
          sections: [
            {
              title: 'Overview',
              titleBn: 'হাসপাতাল পরিচিতি',
              links: [
                { label: 'Green Hospital Overview', labelBn: 'হাসপাতাল পরিচিতি', href: '#about' },
                { label: 'Mission & Vision', labelBn: 'লক্ষ্য ও উদ্দেশ্য', href: '#about' },
                { label: '500-Bed Tertiary Care Infrastructure', labelBn: '৫০০ শয্যার অবকাঠামো', href: '#about' },
                { label: 'Strategic Plan 2030', labelBn: 'ক্লিনিক্যাল কৌশল ২০৩০', href: '#about' },
              ],
            },
          ],
        },
        {
          sections: [
            {
              title: 'Leadership',
              titleBn: 'নেতৃত্ব',
              links: [
                { label: "Chairman's Message", labelBn: 'চেয়ারম্যানের বার্তা', href: '#about' },
                { label: 'Board of Directors', labelBn: 'পরিচালনা পর্ষদ', href: '#about' },
                { label: 'Medical Superintendent Message', labelBn: 'মেডিকেল সুপারিনটেনডেন্ট বার্তা', href: '#about' },
                { label: 'Chief Nursing Officer (CNO)', labelBn: 'চিফ নার্সিং অফিসার', href: '#about' },
              ],
            },
          ],
        },
        {
          sections: [
            {
              title: 'History & Accreditations',
              titleBn: 'ঐতিহ্য ও স্বীকৃতি',
              links: [
                { label: 'Hospital History & Milestones', labelBn: 'ঐতিহ্য ও ইতিহাস', href: '#about' },
                { label: 'BMDC Consultant Recognition', labelBn: 'বিএমডিসি নিবন্ধন', href: '#about' },
                { label: 'DGHS Ministry of Health License', labelBn: 'স্বাস্থ্য অধিদপ্তর লাইসেন্স', href: '#about' },
                { label: 'JCI & ISO 9001 Standards', labelBn: 'জেসিআই ও আইএসও সনদ', href: '#about' },
              ],
            },
          ],
        },
        {
          sections: [
            {
              title: 'Complex & Location',
              titleBn: 'ক্যাম্পাস ও অবস্থান',
              links: [
                { label: 'Tertiary Hospital Complex Purbachal', labelBn: 'প্রধান হাসপাতাল কমপ্লেক্স', href: '#facilities' },
                { label: '24/7 Emergency Trauma Bay', labelBn: 'জরুরি ট্রমা ও হেলিপ্যাড', href: '#facilities' },
                { label: 'Location Map & Driving Directions', labelBn: 'মানচিত্র ও দিকনির্দেশনা', href: '#facilities' },
              ],
            },
          ],
        },
      ],
    },
    {
      id: 'admission',
      label: 'Admission',
      labelBn: 'রোগী ভর্তি',
      columns: [
        {
          sections: [
            {
              title: 'OPD Admission',
              titleBn: 'আউটডোর ভর্তি ও বুকিং',
              links: [
                { label: 'OPD Doctor Consultation Booking', labelBn: 'আউটডোর ডাক্তার অ্যাপয়েন্টমেন্ট', action: onOpenAppointment, highlight: true },
                { label: 'Doctor Chamber Schedules', labelBn: 'ডাক্তার চেম্বার সময়সূচি', action: onOpenAppointment },
                { label: 'OPD Ticket & Live Token Counter', labelBn: 'লাইভ টোকেন ট্র্যাকিং', action: onOpenAppointment },
                { label: 'Telemedicine Consultation', labelBn: 'টেলিমেডিসিন সেবা', action: onOpenAppointment },
              ],
            },
          ],
        },
        {
          sections: [
            {
              title: 'IPD Admission',
              titleBn: 'ইনডোর ও কেবিন ভর্তি',
              links: [
                { label: 'Indoor Patient Admission Desk', labelBn: 'ইনডোর ভর্তি কাউন্টার', href: '#facilities' },
                { label: 'Deluxe Cabins & VIP Suites', labelBn: 'ভিআইপি কেবিন ও স্যুট', href: '#facilities' },
                { label: 'General Wards & Semi-Cabins', labelBn: 'সাধারণ ওয়ার্ড ও সেমি-কেবিন', href: '#facilities' },
                { label: 'Day-Care Surgery Admissions', labelBn: 'ডে-কেয়ার সার্জারি ইউনিট', href: '#facilities' },
              ],
            },
          ],
        },
        {
          sections: [
            {
              title: 'Emergency Admission',
              titleBn: 'জরুরি ভর্তি ২৪/৭',
              links: [
                { label: 'Emergency 24/7 Trauma Center', labelBn: 'জরুরি ট্রমা সেন্টার ২৪/৭', href: 'tel:10678', highlight: true },
                { label: 'Cardiac & Stroke Fast-Track', labelBn: 'হার্ট অ্যাটাক ও স্ট্রোক কেয়ার', href: '#facilities' },
                { label: 'Ambulance Dispatch (10678)', labelBn: 'জরুরি অ্যাম্বুলেন্স ১০৬৭৮', href: 'tel:10678' },
              ],
            },
          ],
        },
        {
          sections: [
            {
              title: 'Process & Visiting Hours',
              titleBn: 'প্রক্রিয়া ও সময়সূচি',
              links: [
                { label: 'Admission Process & Guidelines', labelBn: 'ভর্তি প্রক্রিয়া ও নিয়মাবলী', href: '#facilities' },
                { label: 'Visitor & Attendant Hours', labelBn: 'দর্শনার্থী প্রবেশের সময়সূচি', href: '#facilities' },
                { label: 'Cashless Health Insurance / TPA', labelBn: 'ক্যাশলেস স্বাস্থ্য বীমা', href: '#facilities' },
                { label: 'Executive Health Screening', labelBn: 'হেলথ চেকআপ প্যাকেজ', href: '#departments' },
              ],
            },
          ],
        },
      ],
    },
    {
      id: 'specialties',
      label: 'Specialties',
      labelBn: 'চিকিৎসাসেবা',
      columns: [
        {
          sections: [
            {
              title: 'Clinical Specialties',
              titleBn: 'ক্লিনিক্যাল বিভাগসমূহ',
              links: [
                { label: 'Cardiology & Cath Lab', labelBn: 'কার্ডিওলজি ও ক্যাথ ল্যাব', href: '#departments' },
                { label: 'Cardiac Surgery & Bypass', labelBn: 'কার্ডিয়াক সার্জারি', href: '#departments' },
                { label: 'Neurology & Stroke Unit', labelBn: 'নিউরোমেডিসিন ও স্ট্রোক কেয়ার', href: '#departments' },
                { label: 'Neurosurgery & Spine Center', labelBn: 'নিউরোসার্জারি ও স্পাইন কেয়ার', href: '#departments' },
              ],
            },
          ],
        },
        {
          sections: [
            {
              title: 'Surgery & Ortho',
              titleBn: 'সার্জারি ও অর্থোপেডিকস',
              links: [
                { label: 'Orthopedics & Joint Replacement', labelBn: 'অর্থোপেডিকস ও জয়েন্ট রিপ্লেসমেন্ট', href: '#departments' },
                { label: 'General & Laparoscopic Surgery', labelBn: 'ল্যাপারোস্কোপিক সার্জারি', href: '#departments' },
                { label: 'Robotic Minimally Invasive Surgery', labelBn: 'রোবোটিক সার্জারি সেন্টার', href: '#departments' },
                { label: 'Urology & Kidney Transplant', labelBn: 'ইউরোলজি ও কিডনি প্রতিস্থাপন', href: '#departments' },
              ],
            },
          ],
        },
        {
          sections: [
            {
              title: 'Mother & Child',
              titleBn: 'মা ও শিশু স্বাস্থ্য',
              links: [
                { label: 'Gynecology & Obstetrics', labelBn: 'গাইনি ও প্রসূতি বিভাগ', href: '#departments' },
                { label: 'Pediatrics & Child Health', labelBn: 'শিশু বিভাগ ও চাইল্ড কেয়ার', href: '#departments' },
                { label: 'Level-3 Neonatal ICU (NICU)', labelBn: 'লেভেল-৩ এনআইসিইউ', href: '#facilities', highlight: true },
                { label: 'Pediatric Surgery', labelBn: 'পেডিয়াট্রিক সার্জারি', href: '#departments' },
              ],
            },
          ],
        },
        {
          sections: [
            {
              title: 'Critical Care & Labs',
              titleBn: 'আইসিইউ ও ডায়াগনস্টিকস',
              links: [
                { label: 'ICU & Critical Care Units', labelBn: 'আইসিইউ ও সিসিইউ কেয়ার', href: '#facilities', highlight: true },
                { label: '24/7 Automated Pathology Lab', labelBn: 'স্বয়ংক্রিয় প্যাথলজি ল্যাব', href: '#departments' },
                { label: '3 Tesla MRI & 128-Slice CT', labelBn: '৩ টেসলা এমআরআই ও সিটি স্ক্যান', href: '#departments' },
                { label: 'Nephrology & 24/7 Hemodialysis', labelBn: 'ডায়ালাইসিস ও কিডনি কেয়ার', href: '#departments' },
              ],
            },
          ],
        },
      ],
    },
    {
      id: 'administration',
      label: 'Administration',
      labelBn: 'প্রশাসন',
      columns: [
        {
          sections: [
            {
              title: 'Command Center',
              titleBn: 'কমান্ড সেন্টার',
              links: [
                { label: 'Superadmin Command Center', labelBn: 'সুপারএডমিন কমান্ড সেন্টার', action: onOpenSuperadmin, highlight: true },
                { label: '12 Role Login Portals', labelBn: '১২ রোল লগইন পোর্টাল', action: onOpenPortals, highlight: true },
                { label: 'Live Ward & Bed Matrix', labelBn: 'রিয়েল-টাইম বেড স্ট্যাটাস', action: onOpenSuperadmin },
              ],
            },
          ],
        },
        {
          sections: [
            {
              title: 'Management Team',
              titleBn: 'ব্যবস্থাপনা দল',
              links: [
                { label: 'Hospital Director Office', labelBn: 'হাসপাতাল পরিচালক', href: '#about' },
                { label: 'Chief Medical Officer', labelBn: 'চিফ মেডিকেল অফিসার', href: '#about' },
                { label: 'Nursing Directorate', labelBn: 'নার্সিং পরিদপ্তর', href: '#facilities' },
              ],
            },
          ],
        },
        {
          sections: [
            {
              title: 'Notices & Careers',
              titleBn: 'নোটিশ ও ক্যারিয়ার',
              links: [
                { label: 'Official Notices & Circulars', labelBn: 'অফিসিয়াল নোটিশ ও আদেশ', href: '#news' },
                { label: 'Tenders & Procurement', labelBn: 'দরপত্র ও প্রকিউরমেন্ট', href: '#news' },
                { label: 'Careers & Job Openings', labelBn: 'ক্যারিয়ার ও নিয়োগ বিজ্ঞপ্তি', href: '#news' },
              ],
            },
          ],
        },
        {
          sections: [
            {
              title: 'Hospital Policies',
              titleBn: 'নীতিমালা',
              links: [
                { label: 'Clinical Protocols & SOPs', labelBn: 'ক্লিনিক্যাল প্রটোকল ও এসওপি', href: '#about' },
                { label: 'Infection Control Committee', labelBn: 'ইনফেকশন কন্ট্রোল কমিটি', href: '#about' },
                { label: 'Patient Rights & Ethics Charter', labelBn: 'রোগীর অধিকার নীতিমালা', href: '#about' },
              ],
            },
          ],
        },
      ],
    },
    {
      id: 'research',
      label: 'Research',
      labelBn: 'গবেষণা',
      columns: [
        {
          sections: [
            {
              title: 'Publications',
              titleBn: 'প্রকাশনা ও জার্নাল',
              links: [
                { label: 'Green Journal of Medicine', labelBn: 'গ্রিন জার্নাল অব মেডিসিন', href: '#research' },
                { label: 'PubMed Indexed Papers', labelBn: 'পাবমেড ইনডেক্সড পেপার', href: '#research' },
                { label: 'Doctor Citations & Research', labelBn: 'চিকিৎসক সাইটেশন ম্যাট্রিক্স', href: '#research' },
              ],
            },
          ],
        },
        {
          sections: [
            {
              title: 'Clinical Trials',
              titleBn: 'ক্লিনিক্যাল ট্রায়াল',
              links: [
                { label: 'Clinical Trials Unit', labelBn: 'ক্লিনিক্যাল ট্রায়াল সেন্টার', href: '#research' },
                { label: 'Vaccine & Immunology Research', labelBn: 'ইমিউনোলজি গবেষণা', href: '#research' },
                { label: 'Genomics & Oncology Lab', labelBn: 'অনকোলজি জিনোমিক্স', href: '#research' },
              ],
            },
          ],
        },
        {
          sections: [
            {
              title: 'Ethics Committee',
              titleBn: 'এথিক্স কমিটি',
              links: [
                { label: 'Institutional Review Board (IRB)', labelBn: 'আইআরবি এথিক্স বোর্ড', href: '#research' },
                { label: 'Bioethics Guidelines', labelBn: 'বায়োএথিক্স গাইডলাইন', href: '#research' },
                { label: 'Research Grants Registry', labelBn: 'গবেষণা অনুদান ফান্ড', href: '#research' },
              ],
            },
          ],
        },
        {
          sections: [
            {
              title: 'Training & Education',
              titleBn: 'প্রশিক্ষণ ও শিক্ষা',
              links: [
                { label: 'CME Medical Seminars', labelBn: 'সিএমই প্রশিক্ষণ সেমিনার', href: '#news' },
                { label: 'Resident Doctors Training', labelBn: 'রেসিডেন্ট ডাক্তার ট্রেনিং', href: '#research' },
                { label: 'Emergency Trauma Life Support', labelBn: 'ট্রমা লাইফ সাপোর্ট কোর্স', href: '#news' },
              ],
            },
          ],
        },
      ],
    },
    {
      id: 'hospital-life',
      label: 'Hospital Life',
      labelBn: 'হাসপাতাল জীবন',
      columns: [
        {
          sections: [
            {
              title: 'Gallery & Facilities',
              titleBn: 'গ্যালারি ও সুযোগ-সুবিধা',
              links: [
                { label: 'Hospital Photo Gallery', labelBn: 'ফটো গ্যালারি', href: '#facilities' },
                { label: 'Virtual 360 Campus Tour', labelBn: 'ভার্চুয়াল ট্যুর', href: '#facilities' },
                { label: 'Patient & Attendant Lounges', labelBn: 'রোগী ও স্বজনদের লাউঞ্জ', href: '#facilities' },
              ],
            },
          ],
        },
        {
          sections: [
            {
              title: 'Cafeteria & Nutrition',
              titleBn: 'ক্যাফেটেরিয়া ও ডায়েট',
              links: [
                { label: 'Hospital Cafeteria & Dining', labelBn: 'ক্যাফেটেরিয়া ও ফুড কোর্ট', href: '#facilities' },
                { label: 'Clinical Nutrition Service', labelBn: 'ক্লিনিক্যাল ডায়েট প্ল্যান', href: '#facilities' },
                { label: '24/7 Patient Meal Delivery', labelBn: 'কেবিন মিল সার্ভিস', href: '#facilities' },
              ],
            },
          ],
        },
        {
          sections: [
            {
              title: 'Events & Health Camps',
              titleBn: 'ইভেন্ট ও হেলথ ক্যাম্প',
              links: [
                { label: 'Free Health Screening Camps', labelBn: 'বিনামূল্যে স্বাস্থ্য ক্যাম্প', href: '#news' },
                { label: 'World Heart Day Campaigns', labelBn: 'হার্ট ডে সচেতনতা কর্মসূচি', href: '#news' },
                { label: 'Blood Donation Drives', labelBn: 'রক্তদান কর্মসূচি', href: '#news' },
              ],
            },
          ],
        },
        {
          sections: [
            {
              title: 'Patient Stories',
              titleBn: 'রোগীর গল্প',
              links: [
                { label: 'Cardiac Recovery Testimonials', labelBn: 'হার্ট সার্জারির সুস্থতার গল্প', href: '#news' },
                { label: 'Orthopedic Patient Journeys', labelBn: 'অর্থোপেডিক সুস্থতার অভিজ্ঞতা', href: '#news' },
                { label: 'Patient Feedback Desk', labelBn: 'মতামত ও পরামর্শ ডেস্ক', href: '#about' },
              ],
            },
          ],
        },
      ],
    },
    {
      id: 'quick-links',
      label: 'Quick Link',
      labelBn: 'দ্রুত লিঙ্ক',
      columns: [
        {
          sections: [
            {
              title: 'Appointment & Reports',
              titleBn: 'অ্যাপয়েন্টমেন্ট ও রিপোর্ট',
              links: [
                { label: 'Book Doctor Appointment', labelBn: 'অনলাইন ডাক্তার অ্যাপয়েন্টমেন্ট', action: onOpenAppointment, highlight: true },
                { label: 'Download Online Reports', labelBn: 'অনলাইন টেস্ট রিপোর্ট ডাউনলোড', action: onOpenPortals, highlight: true },
                { label: 'Pay Hospital Bill Online', labelBn: 'অনলাইন বিল পরিশোধ', action: onOpenPortals },
              ],
            },
          ],
        },
        {
          sections: [
            {
              title: 'Find Doctors & Portals',
              titleBn: 'ডাক্তার খুঁজুন ও পোর্টাল',
              links: [
                { label: 'Find a Specialist Doctor', labelBn: 'বিশেষজ্ঞ ডাক্তার খুঁজুন', action: onOpenAppointment },
                { label: '12 Role Login Portals', labelBn: '১২ রোল লগইন পোর্টাল', action: onOpenPortals, highlight: true },
                { label: 'Superadmin Command Center', labelBn: 'সুপারএডমিন ড্যাশবোর্ড', action: onOpenSuperadmin, highlight: true },
              ],
            },
          ],
        },
        {
          sections: [
            {
              title: 'Contact & Helplines',
              titleBn: 'যোগাযোগ ও হেল্পলাইন',
              links: [
                { label: '24/7 Hotline: 10678', labelBn: 'জরুরি হেল্পলাইন: ১০৬৭৮', href: 'tel:10678', highlight: true },
                { label: 'Ambulance Dispatch', labelBn: 'অ্যাম্বুলেন্স ডিসপ্যাচ', href: 'tel:10678' },
                { label: 'Contact Us & Location', labelBn: 'যোগাযোগ ও ঠিকানা', href: '#about' },
              ],
            },
          ],
        },
        {
          sections: [
            {
              title: 'FAQ & Support',
              titleBn: 'সাধারণ জিজ্ঞাসা',
              links: [
                { label: 'Frequently Asked Questions (FAQ)', labelBn: 'সাধারণ প্রশ্নোত্তর (FAQ)', href: '#about' },
                { label: 'Doctor Credential Verification', labelBn: 'ডাক্তার নিবন্ধন যাচাই', action: onOpenPortals },
                { label: 'Patient Support Concierge', labelBn: 'পেশেন্ট হেল্পডেস্ক', href: '#about' },
              ],
            },
          ],
        },
      ],
    },
  ];

  const activeItem = mainNavItems.find((item) => item.id === activeDropdown);

  return (
    <header
      ref={navRef}
      className="sticky top-0 z-50 w-full font-['Plus_Jakarta_Sans',sans-serif] select-none shadow-md"
      role="banner"
    >
      {/* ════════════════════ TOP 2.5PX DARK TEAL LINE ════════════════════ */}
      <div className="h-[2.5px] bg-[#073642] w-full" />

      {/* ════════════════════ 1) TOP UTILITY BAR (Segmented Cells with Vertical Dividers from screenshot) ════════════════════ */}
      <div
        className="bg-[#0094b6] text-white text-[12px] font-bold select-none"
        role="navigation"
        aria-label="Top Utility Navigation"
      >
        <div className="max-w-[1360px] mx-auto flex items-center justify-between h-8.5 px-4 sm:px-6">
          {/* Left Segmented Cells with full-height vertical white dividers */}
          <div className="h-full flex items-center border-l border-white/30 overflow-x-auto scrollbar-none">
            {topNavItems.map((item) => (
              <div
                key={item.label}
                className="h-full flex items-center justify-center border-r border-white/30 hover:bg-black/10 transition-colors shrink-0"
              >
                {item.action ? (
                  <button
                    onClick={item.action}
                    className="h-full px-3.5 sm:px-4 flex items-center justify-center text-center whitespace-nowrap text-white hover:text-cyan-100 cursor-pointer font-bold text-[12px] leading-none tracking-tight focus-visible:outline-hidden"
                  >
                    {lang === 'en' ? item.label : item.labelBn}
                  </button>
                ) : (
                  <a
                    href={item.href}
                    className="h-full px-3.5 sm:px-4 flex items-center justify-center text-center whitespace-nowrap text-white hover:text-cyan-100 font-bold text-[12px] leading-none tracking-tight focus-visible:outline-hidden"
                  >
                    {lang === 'en' ? item.label : item.labelBn}
                  </a>
                )}
              </div>
            ))}
          </div>

          {/* Right Segmented Utility Icons & Search (Search | f | phone | youtube | Language) */}
          <div className="h-full flex items-center shrink-0 border-l border-white/30">
            {/* Search Box Trigger Cell */}
            <div className="relative h-full flex items-center justify-center border-r border-white/30 hover:bg-black/10 transition-colors">
              <button
                onClick={() => setSearchOpen(!searchOpen)}
                className="h-full px-3 flex items-center justify-center gap-1.5 text-white hover:text-cyan-100 cursor-pointer font-bold text-[12px] leading-none tracking-tight focus-visible:outline-hidden"
                title={lang === 'en' ? 'Search Hospital' : 'অনুসন্ধান'}
              >
                <Search className="w-3.5 h-3.5 stroke-[2]" />
                <span>{lang === 'en' ? 'Search' : 'খুঁজুন'}</span>
              </button>

              {/* Popup Search Bar */}
              {searchOpen && (
                <>
                  <div
                    onClick={() => setSearchOpen(false)}
                    className="fixed inset-0 z-40 bg-transparent"
                  />
                  <div className="absolute right-0 top-full mt-1 w-80 bg-white text-slate-800 p-2.5 rounded-2xl shadow-xl border border-slate-200 z-50 animate-in fade-in zoom-in-95 duration-150">
                    <div className="relative">
                      <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        placeholder={
                          lang === 'en'
                            ? 'Search doctors, specialties, tests...'
                            : 'ডাক্তার, বিভাগ বা পরীক্ষা অনুসন্ধান করুন...'
                        }
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-8 py-2 text-xs font-medium focus:outline-hidden focus:border-[#0094b6]"
                        autoFocus
                      />
                      {searchQuery && (
                        <button
                          onClick={() => setSearchQuery('')}
                          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Facebook Cell */}
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noreferrer"
              className="h-full px-3 flex items-center justify-center border-r border-white/30 hover:bg-black/10 text-white hover:text-cyan-100 transition-colors"
              title="Facebook"
            >
              <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
            </a>

            {/* Helpline Phone Cell */}
            <a
              href="tel:10678"
              className="h-full px-3 flex items-center justify-center border-r border-white/30 hover:bg-black/10 text-white hover:text-cyan-100 transition-colors"
              title="Call Hotline: 10678"
            >
              <Phone className="w-3.5 h-3.5" />
            </a>

            {/* YouTube Cell */}
            <a
              href="https://youtube.com"
              target="_blank"
              rel="noreferrer"
              className="h-full px-3 flex items-center justify-center border-r border-white/30 hover:bg-black/10 text-white hover:text-cyan-100 transition-colors"
              title="YouTube"
            >
              <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
              </svg>
            </a>

            {/* Language Switcher Cell */}
            <div className="h-full flex items-center justify-center px-3 border-r border-white/30 hover:bg-black/10 transition-colors">
              <button
                onClick={() => setLang(lang === 'en' ? 'bn' : 'en')}
                className="h-full flex items-center justify-center gap-1 text-[11px] font-bold text-white cursor-pointer select-none"
                title="Toggle Language"
              >
                <Globe className="w-3 h-3 text-cyan-200" />
                <span>{lang === 'en' ? 'বাংলা' : 'EN'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ════════════════════ 2) MAIN NAVBAR (Exact typography, emblem & chevrons from screenshot) ════════════════════ */}
      <div className="bg-white border-b border-slate-200/90 relative">
        <div className="max-w-[1360px] mx-auto px-4 sm:px-6 h-20 flex items-center justify-between">
          {/* Institutional Green Palm / Tree Leaves Logo */}
          <a
            href="#"
            onClick={(e) => {
              if (onGoHome) {
                e.preventDefault();
                onGoHome();
              }
            }}
            className="flex items-center gap-3 shrink-0 focus-visible:outline-hidden"
          >
            {/* Custom SVG Institutional Green Palm Emblem matching screenshot */}
            <svg
              className="w-12 h-12 text-[#006a4e] shrink-0"
              viewBox="0 0 48 48"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Left leaves */}
              <path d="M7 11C13 10 19 14 21 21C13 19 8 15 7 11Z" fill="#006a4e" />
              <path d="M6 19C13 18 19 22 21 29C13 27 7 23 6 19Z" fill="#006a4e" />
              <path d="M7 27C13 26 19 30 21 37C13 35 8 31 7 27Z" fill="#006a4e" />
              <path d="M10 35C15 34 19 37 21 42C15 41 11 38 10 35Z" fill="#006a4e" />
              {/* Right leaves */}
              <path d="M41 11C35 10 29 14 27 21C35 19 40 15 41 11Z" fill="#006a4e" />
              <path d="M42 19C35 18 29 22 27 29C35 27 41 23 42 19Z" fill="#006a4e" />
              <path d="M41 27C35 26 29 30 27 37C35 35 40 31 41 27Z" fill="#006a4e" />
              <path d="M38 35C33 34 29 37 27 42C33 41 37 38 38 35Z" fill="#006a4e" />
              {/* Central stem */}
              <path d="M23 9C23 9 25 9 25 43C25 43 23 43 23 9Z" fill="#006a4e" />
            </svg>

            <div className="flex flex-col justify-center leading-tight">
              <span className="font-extrabold text-[22px] tracking-tight text-[#006a4e] leading-none">
                GREEN
              </span>
              <span className="font-bold text-[15px] tracking-tight text-[#006a4e] leading-tight">
                HOSPITAL
              </span>
              <span className="text-[9px] font-bold text-[#006a4e] uppercase tracking-[0.22em] leading-none">
                OF BANGLADESH
              </span>
            </div>
          </a>

          {/* Desktop Nav Items with down chevron (Bold typography matching user request) */}
          <nav
            className="hidden xl:flex items-center gap-6 2xl:gap-8 text-[15px] font-bold text-slate-800 h-full"
            role="navigation"
            aria-label="Main Navigation"
          >
            {mainNavItems.map((item) => {
              const isOpen = activeDropdown === item.id;
              const isActive = activeNavId === item.id;

              return (
                <div
                  key={item.id}
                  className="relative h-full flex items-center justify-center"
                  onMouseEnter={() => handleMouseEnter(item.id)}
                  onMouseLeave={handleMouseLeave}
                >
                  <button
                    onClick={() => handleToggleMenu(item.id)}
                    className={`flex items-center justify-center gap-1.5 transition-colors cursor-pointer select-none py-2 px-1 focus-visible:outline-hidden font-bold ${
                      isOpen || isActive
                        ? 'text-[#006a4e]'
                        : 'text-slate-800 hover:text-[#006a4e]'
                    }`}
                    aria-haspopup="true"
                    aria-expanded={isOpen}
                  >
                    <span>{lang === 'en' ? item.label : item.labelBn}</span>
                    <ChevronDown
                      className={`w-3.5 h-3.5 text-slate-500 group-hover:text-[#006a4e] transition-transform duration-200 stroke-[2] ${
                        isOpen ? 'rotate-180 text-[#006a4e]' : ''
                      }`}
                    />
                  </button>

                  {/* Active Indicator Arrow / Notch */}
                  {isOpen && (
                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-2 bg-[#0094b6] z-50">
                      <div className="w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-b-[6px] border-b-[#0094b6] mx-auto -mt-1" />
                    </div>
                  )}
                </div>
              );
            })}
          </nav>

          {/* Mobile Hamburger Button */}
          <div className="xl:hidden flex items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 cursor-pointer"
              aria-label="Toggle Mobile Navigation"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* ════════════════════ FULL-WIDTH CYAN MEGA-DROPDOWN (100% Hospital Content) ════════════════════ */}
        {activeItem && (
          <>
            {/* Backdrop for outside click dismissal */}
            <div
              onClick={() => setActiveDropdown(null)}
              className="fixed inset-0 top-[125px] z-30 bg-black/30 backdrop-blur-xs animate-in fade-in duration-150"
            />

            {/* Mega Dropdown Panel */}
            <div
              className="absolute left-0 right-0 top-full z-40 bg-[#0094b6] text-white shadow-2xl border-t border-white/20 animate-in fade-in slide-in-from-top-2 duration-200"
              onMouseEnter={() => {
                if (timeoutRef.current) clearTimeout(timeoutRef.current);
              }}
              onMouseLeave={handleMouseLeave}
            >
              <div className="max-w-[1360px] mx-auto px-6 sm:px-8 lg:px-10 py-7">
                {/* 4 Distinct Mega Columns */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10">
                  {activeItem.columns.map((column, colIdx) => (
                    <div key={colIdx} className="space-y-6">
                      {column.sections.map((section, secIdx) => (
                        <div key={secIdx}>
                          {/* Section Header with crisp white bottom divider */}
                          <h4 className="text-[14.5px] font-bold text-white border-b border-white/30 pb-2 mb-3 tracking-wide flex items-center justify-between">
                            <span>{lang === 'en' ? section.title : section.titleBn}</span>
                          </h4>

                          {/* Link Items */}
                          <ul className="space-y-1.5">
                            {section.links.map((link, linkIdx) => (
                              <li key={linkIdx}>
                                {link.action ? (
                                  <button
                                    onClick={() => {
                                      setActiveDropdown(null);
                                      link.action!();
                                    }}
                                    className={`text-left text-[13px] font-medium transition-all block py-1 leading-snug cursor-pointer group ${
                                      link.highlight
                                        ? 'text-amber-200 font-bold hover:text-white flex items-center gap-1.5'
                                        : 'text-white/95 hover:text-white hover:underline'
                                    }`}
                                  >
                                    {link.highlight && (
                                      <Sparkles className="w-3.5 h-3.5 text-amber-300 inline shrink-0" />
                                    )}
                                    <span>{lang === 'en' ? link.label : link.labelBn}</span>
                                  </button>
                                ) : (
                                  <a
                                    href={link.href || '#'}
                                    onClick={() => setActiveDropdown(null)}
                                    className={`text-[13px] font-medium transition-all block py-1 leading-snug ${
                                      link.highlight
                                        ? 'text-amber-200 font-bold hover:text-white flex items-center gap-1.5'
                                        : 'text-white/95 hover:text-white hover:underline'
                                    }`}
                                  >
                                    {link.highlight && (
                                      <Sparkles className="w-3.5 h-3.5 text-amber-300 inline shrink-0" />
                                    )}
                                    <span>{lang === 'en' ? link.label : link.labelBn}</span>
                                  </a>
                                )}
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </>
        )}

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="xl:hidden bg-white border-t border-slate-200 px-4 py-4 space-y-3 text-sm font-bold text-slate-800 animate-in slide-in-from-top duration-200 max-h-[75vh] overflow-y-auto">
            {/* Language Switcher in Mobile Drawer */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <span className="text-xs font-bold text-slate-500">
                {lang === 'en' ? 'Language:' : 'ভাষা:'}
              </span>
              <div className="flex items-center bg-slate-100 p-1 rounded-lg text-xs font-bold">
                <button
                  onClick={() => setLang('en')}
                  className={`px-3 py-1 rounded-md transition-all ${
                    lang === 'en' ? 'bg-[#0094b6] text-white shadow-xs' : 'text-slate-600'
                  }`}
                >
                  English
                </button>
                <button
                  onClick={() => setLang('bn')}
                  className={`px-3 py-1 rounded-md transition-all ${
                    lang === 'bn' ? 'bg-[#0094b6] text-white shadow-xs' : 'text-slate-600'
                  }`}
                >
                  বাংলা
                </button>
              </div>
            </div>

            {/* Accordion Menu */}
            {mainNavItems.map((item) => (
              <div key={item.id} className="border-b border-slate-100 py-1.5">
                <button
                  onClick={() =>
                    setMobileAccordion(mobileAccordion === item.id ? null : item.id)
                  }
                  className="w-full flex items-center justify-between text-slate-900 font-bold py-1"
                >
                  <span>{lang === 'en' ? item.label : item.labelBn}</span>
                  <ChevronDown
                    className={`w-4 h-4 transition-transform ${
                      mobileAccordion === item.id ? 'rotate-180 text-teal-600' : ''
                    }`}
                  />
                </button>

                {mobileAccordion === item.id && (
                  <div className="pl-3 mt-2 space-y-4 bg-teal-50/70 p-3 rounded-xl border border-teal-100">
                    {item.columns.map((col, cIdx) => (
                      <div key={cIdx} className="space-y-3">
                        {col.sections.map((sec, sIdx) => (
                          <div key={sIdx}>
                            <div className="text-xs font-bold text-teal-900 uppercase tracking-wider mb-1 border-b border-teal-200/60 pb-1">
                              {lang === 'en' ? sec.title : sec.titleBn}
                            </div>
                            <div className="space-y-1">
                              {sec.links.map((link, lIdx) => (
                                <button
                                  key={lIdx}
                                  onClick={() => {
                                    setMobileMenuOpen(false);
                                    if (link.action) link.action();
                                  }}
                                  className="block text-left text-xs font-medium text-slate-700 hover:text-teal-700 py-0.5"
                                >
                                  {lang === 'en' ? link.label : link.labelBn}
                                </button>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}

            <div className="pt-3 flex flex-col gap-2">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenPortals();
                }}
                className="w-full py-2.5 bg-teal-50 border border-teal-200 text-teal-800 font-bold rounded-xl text-xs flex items-center justify-center gap-1.5"
              >
                <Stethoscope className="w-4 h-4" />
                <span>12 Role Login Portals</span>
              </button>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenSuperadmin();
                }}
                className="w-full py-2.5 bg-[#006a4e] text-white font-bold rounded-xl text-xs shadow-xs"
              >
                Superadmin Dashboard
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default HeaderNavbar;
