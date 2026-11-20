import React from 'react';
import {
  Accessibility,
  Activity,
  Bed,
  Bell,
  BookOpen,
  Calendar,
  Download,
  FileText,
  FlaskConical,
  FolderArchive,
  Home,
  MessageSquareText,
  Receipt,
  Scan,
  Search,
  Settings,
  SquarePen,
  Stethoscope,
  User,
  Video,
} from 'lucide-react';

interface PatientNavIconProps {
  name: string;
  className?: string;
}

export const PatientNavIcon: React.FC<PatientNavIconProps> = ({
  name,
  className = 'w-4 h-4',
}) => {
  switch (name) {
    case 'Home':
    case 'Dashboard':
    case 'LayoutDashboard':
      return <Home className={className} strokeWidth={1.75} />;
    case 'User':
    case 'Profile':
      return <User className={className} strokeWidth={1.75} />;
    case 'Accessibility':
    case 'Patient':
      return <Accessibility className={className} strokeWidth={1.75} />;
    case 'SquarePen':
    case 'FilePenLine':
    case 'Appointment':
    case 'CalendarCheck':
      return <SquarePen className={className} strokeWidth={1.75} />;
    case 'Search':
      return <Search className={className} strokeWidth={1.75} />;
    case 'Stethoscope':
      return <Stethoscope className={className} strokeWidth={1.75} />;
    case 'Calendar':
      return <Calendar className={className} strokeWidth={1.75} />;
    case 'FileText':
      return <FileText className={className} strokeWidth={1.75} />;
    case 'BookOpen':
    case 'Prescriptions':
    case 'Pill':
      return <BookOpen className={className} strokeWidth={1.75} />;
    case 'FlaskConical':
      return <FlaskConical className={className} strokeWidth={1.75} />;
    case 'Scan':
      return <Scan className={className} strokeWidth={1.75} />;
    case 'Activity':
      return <Activity className={className} strokeWidth={1.75} />;
    case 'FolderArchive':
      return <FolderArchive className={className} strokeWidth={1.75} />;
    case 'Bed':
      return <Bed className={className} strokeWidth={1.75} />;
    case 'Video':
      return <Video className={className} strokeWidth={1.75} />;
    case 'Receipt':
      return <Receipt className={className} strokeWidth={1.75} />;
    case 'Download':
      return <Download className={className} strokeWidth={1.75} />;
    case 'Bell':
      return <Bell className={className} strokeWidth={1.75} />;
    case 'MessageSquareText':
      return <MessageSquareText className={className} strokeWidth={1.75} />;
    case 'Settings':
      return <Settings className={className} strokeWidth={1.75} />;
    default:
      return <FileText className={className} strokeWidth={1.75} />;
  }
};
