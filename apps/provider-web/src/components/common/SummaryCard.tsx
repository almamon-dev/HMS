import { LucideIcon } from 'lucide-react';
import React from 'react';

export interface SummaryCardProps {
  title: string;
  value: string | number | React.ReactNode;
  subtitle?: string | React.ReactNode;
  icon?: LucideIcon | React.ComponentType<{ className?: string }> | React.ReactNode;
  iconColor?: string;
  valueColor?: string;
  onClick?: () => void;
  className?: string;
  badge?: React.ReactNode;
}

/**
 * Reusable Hospital ERP Summary Card Component.
 * Pure white card with no borders, subtle elevation shadow, and crisp typography
 * designed specifically for high contrast against the #F1F3F6 workspace background.
 */
export const SummaryCard: React.FC<SummaryCardProps> = ({
  title,
  value,
  subtitle,
  icon: Icon,
  iconColor = 'text-[#006a4e]',
  valueColor = 'text-slate-900',
  onClick,
  className = '',
  badge,
}) => {
  const isClickable = typeof onClick === 'function';

  const renderIcon = () => {
    if (!Icon) return null;
    if (React.isValidElement(Icon)) return Icon;
    const IconComponent = Icon as React.ComponentType<{ className?: string }>;
    return <IconComponent className={`w-3.5 h-3.5 ${iconColor}`} />;
  };

  return (
    <div
      onClick={onClick}
      className={`bg-white rounded-[3px] p-2.5 shadow-xs transition-shadow ${isClickable ? 'cursor-pointer hover:shadow-sm' : ''
        } ${className}`}
    >
      <div className="flex items-center justify-between">
        <span className="text-[10.5px] font-bold text-slate-700 truncate">{title}</span>
        <div className="flex items-center gap-1.5 shrink-0">
          {badge}
          {renderIcon()}
        </div>
      </div>
      <div className="my-1">
        <span className={`text-base font-extrabold ${valueColor} leading-none block truncate`}>
          {value}
        </span>
      </div>
      {subtitle && (
        <p className="text-[10px] text-slate-500 truncate" title={typeof subtitle === 'string' ? subtitle : undefined}>
          {subtitle}
        </p>
      )}
    </div>
  );
};

export const SummaryCardGrid: React.FC<{
  children: React.ReactNode;
  columns?: 2 | 3 | 4 | 5 | 6;
  className?: string;
}> = ({ children, columns = 4, className = '' }) => {
  const colClass =
    columns === 2
      ? 'grid grid-cols-1 sm:grid-cols-2 gap-2.5'
      : columns === 3
        ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5'
        : columns === 5
          ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-2.5'
          : 'grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-2.5';

  return <div className={`${colClass} ${className}`}>{children}</div>;
};

export default SummaryCard;
