import React from 'react';
import {
  LayoutDashboard,
  UserCheck,
  FileText,
  CalendarCheck2,
  Stethoscope,
  BedDouble,
  Pill,
  FlaskConical,
  Scan,
  Droplets,
  Ambulance,
  Building2,
  FileHeart,
  GitBranch,
  Users,
  QrCode,
  Clock4,
  CalendarDays,
  Share2,
  ShieldAlert,
  Receipt,
  ClipboardList,
  MessageSquareText,
  Package,
  Download,
  Award,
  Globe2,
  Video,
  BarChart3,
  Sliders,
  ChevronRight,
  ChevronDown,
} from 'lucide-react';

interface SuperadminNavIconProps {
  name: string;
  className?: string;
}

export const SuperadminNavIcon: React.FC<SuperadminNavIconProps> = ({
  name,
  className = 'w-4 h-4',
}) => {
  switch (name) {
    case 'LayoutDashboard':
      return <LayoutDashboard className={className} />;
    case 'UserCheck':
      return <UserCheck className={className} />;
    case 'FileText':
      return <FileText className={className} />;
    case 'CalendarCheck2':
      return <CalendarCheck2 className={className} />;
    case 'Stethoscope':
      return <Stethoscope className={className} />;
    case 'BedDouble':
      return <BedDouble className={className} />;
    case 'Pill':
      return <Pill className={className} />;
    case 'FlaskConical':
      return <FlaskConical className={className} />;
    case 'Scan':
      return <Scan className={className} />;
    case 'Droplets':
      return <Droplets className={className} />;
    case 'Ambulance':
      return <Ambulance className={className} />;
    case 'Building2':
      return <Building2 className={className} />;
    case 'FileHeart':
      return <FileHeart className={className} />;
    case 'GitBranch':
      return <GitBranch className={className} />;
    case 'Users':
      return <Users className={className} />;
    case 'QrCode':
      return <QrCode className={className} />;
    case 'Clock4':
      return <Clock4 className={className} />;
    case 'CalendarDays':
      return <CalendarDays className={className} />;
    case 'Share2':
      return <Share2 className={className} />;
    case 'ShieldAlert':
      return <ShieldAlert className={className} />;
    case 'Receipt':
      return <Receipt className={className} />;
    case 'ClipboardList':
      return <ClipboardList className={className} />;
    case 'MessageSquareText':
      return <MessageSquareText className={className} />;
    case 'Package':
      return <Package className={className} />;
    case 'Download':
      return <Download className={className} />;
    case 'Award':
      return <Award className={className} />;
    case 'Globe2':
      return <Globe2 className={className} />;
    case 'Video':
      return <Video className={className} />;
    case 'BarChart3':
      return <BarChart3 className={className} />;
    case 'Sliders':
      return <Sliders className={className} />;
    case 'ChevronRight':
      return <ChevronRight className={className} />;
    case 'ChevronDown':
      return <ChevronDown className={className} />;
    default:
      return <LayoutDashboard className={className} />;
  }
};

