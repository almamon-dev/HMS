import React from 'react';
import {
  ArrowLeftRight,
  BarChart3,
  Boxes,
  CalendarClock,
  Clock,
  FileText,
  Home,
  Receipt,
  RotateCcw,
  ShoppingCart,
} from 'lucide-react';

interface PharmacistNavIconProps {
  name: string;
  className?: string;
}

export const PharmacistNavIcon: React.FC<PharmacistNavIconProps> = ({
  name,
  className = 'w-4 h-4',
}) => {
  switch (name) {
    case 'Home':
    case 'dashboard':
      return <Home className={className} strokeWidth={1.75} />;
    case 'Receipt':
    case 'pos-billing':
      return <Receipt className={className} strokeWidth={1.75} />;
    case 'Boxes':
    case 'inventory-master':
      return <Boxes className={className} strokeWidth={1.75} />;
    case 'CalendarClock':
    case 'batch-expiry':
      return <CalendarClock className={className} strokeWidth={1.75} />;
    case 'ArrowLeftRight':
    case 'stock-transfers':
      return <ArrowLeftRight className={className} strokeWidth={1.75} />;
    case 'ShoppingCart':
    case 'purchase-orders':
      return <ShoppingCart className={className} strokeWidth={1.75} />;
    case 'RotateCcw':
    case 'returns-refunds':
      return <RotateCcw className={className} strokeWidth={1.75} />;
    case 'BarChart3':
    case 'pharmacy-reports':
      return <BarChart3 className={className} strokeWidth={1.75} />;
    case 'Clock':
      return <Clock className={className} strokeWidth={1.75} />;
    default:
      return <FileText className={className} strokeWidth={1.75} />;
  }
};

