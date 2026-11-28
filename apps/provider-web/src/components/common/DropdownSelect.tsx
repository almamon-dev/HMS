import { Check, ChevronDown } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';

export interface DropdownOption {
  label: string;
  value: string;
  badge?: string | number;
  badgeColor?: string;
  icon?: React.ReactNode;
}

export interface DropdownSelectProps {
  label?: string;
  ariaLabel?: string;
  name?: string;
  options: (DropdownOption | string)[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  width?: string;
  size?: 'sm' | 'md';
  disabled?: boolean;
  variant?: 'custom' | 'native';
  native?: boolean;
}

/**
 * Reusable GreenHospital-styled dropdown component matching Superadmin / PatientDirectory standards.
 * Supports both clean Superadmin native select mode (perfect for forms & modals) and custom popover mode (for toolbars).
 */
export const DropdownSelect: React.FC<DropdownSelectProps> = ({
  label,
  ariaLabel,
  name,
  options,
  value,
  onChange,
  placeholder = 'Select option',
  className = '',
  width = 'min-w-[150px]',
  size = 'sm',
  disabled = false,
  variant = 'custom',
  native = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Normalize options to object format
  const normalizedOptions: DropdownOption[] = options.map((opt) =>
    typeof opt === 'string' ? { label: opt, value: opt } : opt
  );

  const selectedOption = normalizedOptions.find((opt) => opt.value === value);

  // Click outside listener for custom popover
  useEffect(() => {
    const handleOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      window.addEventListener('click', handleOutside);
    }
    return () => window.removeEventListener('click', handleOutside);
  }, [isOpen]);

  const heightClass = size === 'sm' ? 'h-8' : 'h-9';
  const textClass = 'text-xs';
  const isFullWidth = width.includes('w-full') || className.includes('w-full');

  // NATIVE SUPERADMIN SELECT MODE (Identical to PatientDirectory / Superadmin modals)
  if (variant === 'native' || native) {
    return (
      <div className={`relative ${isFullWidth ? 'block w-full' : 'inline-block'} ${width} ${className}`}>
        {label && (
          <label className="block text-[11px] font-semibold text-slate-700 mb-1">
            {label}
          </label>
        )}
        <div className="relative">
          <select
            name={name}
            disabled={disabled}
            aria-label={ariaLabel || label || placeholder}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className={`w-full ${heightClass} pl-2.5 pr-7 rounded-[3px] border border-slate-300 bg-white ${textClass} font-medium text-slate-800 appearance-none focus:outline-hidden focus:border-[#006a4e] cursor-pointer transition-colors ${
              disabled ? 'opacity-50 cursor-not-allowed bg-slate-50' : 'hover:border-slate-400'
            }`}
          >
            {placeholder && !value && (
              <option value="" disabled>
                {placeholder}
              </option>
            )}
            {normalizedOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          <ChevronDown className="w-3.5 h-3.5 text-slate-400 pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2" />
        </div>
      </div>
    );
  }

  // CUSTOM TOOLBAR DROPDOWN MODE
  return (
    <div className={`relative ${isFullWidth ? 'block w-full' : 'inline-block'} ${width} ${className}`} ref={containerRef}>
      {label && (
        <label className="block text-[11px] font-semibold text-slate-700 mb-1">
          {label}
        </label>
      )}

      {/* Dropdown Trigger Button */}
      <button
        type="button"
        disabled={disabled}
        aria-label={ariaLabel || label || placeholder}
        aria-expanded={isOpen}
        onClick={(e) => {
          e.stopPropagation();
          if (!disabled) setIsOpen((prev) => !prev);
        }}
        className={`w-full ${heightClass} ${textClass} pl-2.5 pr-7 rounded-[3px] border border-slate-300 bg-white font-medium text-slate-800 hover:border-slate-400 text-left flex items-center justify-between transition-colors cursor-pointer focus:outline-hidden focus:border-[#006a4e] focus:ring-1 focus:ring-[#006a4e]/20 ${
          disabled ? 'opacity-50 cursor-not-allowed bg-slate-50' : ''
        } ${isOpen ? 'border-[#006a4e] ring-1 ring-[#006a4e]/20' : ''}`}
      >
        <span className="truncate flex items-center gap-1.5 min-w-0 pr-1">
          {selectedOption?.icon && (
            <span className="shrink-0">{selectedOption.icon}</span>
          )}
          <span className="truncate">
            {selectedOption ? selectedOption.label : placeholder}
          </span>
        </span>

        <span className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400">
          <ChevronDown
            className={`w-3.5 h-3.5 transition-transform duration-150 ${
              isOpen ? 'rotate-180 text-[#006a4e]' : ''
            }`}
          />
        </span>
      </button>

      {/* Floating Menu */}
      {isOpen && (
        <div
          className="absolute left-0 mt-1 w-full min-w-[170px] bg-white border border-slate-200 rounded-[3px] shadow-lg py-1 z-50 text-left max-h-56 overflow-y-auto animate-in fade-in zoom-in-95 duration-100"
          onClick={(e) => e.stopPropagation()}
        >
          {normalizedOptions.map((opt) => {
            const isSelected = opt.value === value;
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => {
                  onChange(opt.value);
                  setIsOpen(false);
                }}
                className={`w-full text-left px-2.5 py-1.5 ${textClass} flex items-center justify-between transition-colors cursor-pointer group ${
                  isSelected
                    ? 'bg-[#edf6f2] text-[#006a4e] font-semibold'
                    : 'text-slate-700 hover:bg-slate-50 hover:text-slate-900 font-medium'
                }`}
              >
                <div className="flex items-center gap-2 truncate">
                  {opt.icon && <span className="shrink-0">{opt.icon}</span>}
                  <span className="truncate">{opt.label}</span>
                </div>

                <div className="flex items-center gap-1.5 shrink-0 ml-2">
                  {opt.badge !== undefined && (
                    <span
                      className={`text-[10px] px-1.5 py-0.2 rounded-full font-medium ${
                        opt.badgeColor || 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {opt.badge}
                    </span>
                  )}
                  {isSelected && (
                    <Check className="w-3.5 h-3.5 text-[#006a4e] shrink-0" />
                  )}
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};
