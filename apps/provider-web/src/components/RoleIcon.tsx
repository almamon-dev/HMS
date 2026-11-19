import React from 'react';
import {
  Crown,
  Target,
  Stethoscope,
  Syringe,
  Pill,
  Microscope,
  Scan,
  BadgeDollarSign,
  PhoneCall,
  Bed,
  Globe,
  Smartphone,
} from 'lucide-react';

interface RoleIconProps {
  name: string;
  className?: string;
}

export const RoleIcon: React.FC<RoleIconProps> = ({ name, className = 'w-6 h-6' }) => {
  switch (name) {
    case 'Crown':
      return <Crown className={className} />;
    case 'Target':
      return <Target className={className} />;
    case 'Stethoscope':
      return <Stethoscope className={className} />;
    case 'Syringe':
      return <Syringe className={className} />;
    case 'Pill':
      return <Pill className={className} />;
    case 'Microscope':
      return <Microscope className={className} />;
    case 'Scan':
      return <Scan className={className} />;
    case 'BadgeDollarSign':
      return <BadgeDollarSign className={className} />;
    case 'PhoneCall':
      return <PhoneCall className={className} />;
    case 'Bed':
      return <Bed className={className} />;
    case 'Globe':
      return <Globe className={className} />;
    case 'Smartphone':
      return <Smartphone className={className} />;
    default:
      return <Stethoscope className={className} />;
  }
};

