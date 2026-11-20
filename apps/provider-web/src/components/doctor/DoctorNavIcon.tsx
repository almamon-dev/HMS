import React from 'react';
import {
  Accessibility,
  BarChart3,
  Bed,
  Bell,
  BookOpen,
  Calendar,
  ClipboardCheck,
  Clock,
  FileText,
  FlaskConical,
  Home,
  Network,
  ScanLine,
  Settings,
  Share2,
  SquarePen,
  Stethoscope,
  Users,
} from 'lucide-react';

interface DoctorNavIconProps {
  name: string;
  className?: string;
}

export const DoctorNavIcon: React.FC<DoctorNavIconProps> = ({
  name,
  className = 'w-4 h-4',
}) => {
  switch (name) {
    case 'Home':
    case 'Dashboard':
    case 'LayoutDashboard':
      return <Home className={className} strokeWidth={1.75} />;
    case 'Department':
    case 'Network':
      return <Network className={className} strokeWidth={1.75} />;
    case 'Doctor':
    case 'Stethoscope':
    case 'Consultations':
      return <Stethoscope className={className} strokeWidth={1.75} />;
    case 'Accessibility':
    case 'Patient':
    case 'Patients':
    case 'my-patients':
      return <Accessibility className={className} strokeWidth={1.75} />;
    case 'Users':
      return <Users className={className} strokeWidth={1.75} />;
    case 'Calendar':
    case 'Schedule':
    case 'my-schedule':
    case 'CalendarDays':
      return <Calendar className={className} strokeWidth={1.75} />;
    case 'SquarePen':
    case 'Appointment':
    case 'my-appointments':
    case 'FilePenLine':
    case 'CalendarCheck':
      return <SquarePen className={className} strokeWidth={1.75} />;
    case 'BookOpen':
    case 'Prescription':
    case 'Prescriptions':
    case 'prescriptions':
    case 'Pill':
      return <BookOpen className={className} strokeWidth={1.75} />;
    case 'Clock':
    case 'Queue':
      return <Clock className={className} strokeWidth={1.75} />;
    case 'FileText':
    case 'Records':
      return <FileText className={className} strokeWidth={1.75} />;
    case 'FlaskConical':
    case 'Lab':
      return <FlaskConical className={className} strokeWidth={1.75} />;
    case 'ScanLine':
    case 'Radiology':
      return <ScanLine className={className} strokeWidth={1.75} />;
    case 'Bed':
    case 'Inpatients':
      return <Bed className={className} strokeWidth={1.75} />;
    case 'Share2':
    case 'Referrals':
      return <Share2 className={className} strokeWidth={1.75} />;
    case 'ClipboardCheck':
    case 'Tasks':
      return <ClipboardCheck className={className} strokeWidth={1.75} />;
    case 'Bell':
    case 'Notifications':
      return <Bell className={className} strokeWidth={1.75} />;
    case 'BarChart3':
    case 'Reports':
      return <BarChart3 className={className} strokeWidth={1.75} />;
    case 'Settings':
    case 'UserCog':
    case 'Profile':
      return <Settings className={className} strokeWidth={1.75} />;
    default:
      return <FileText className={className} strokeWidth={1.75} />;
  }
};
