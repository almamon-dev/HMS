import { Eye, SquarePen, Trash2 } from 'lucide-react';

export interface TableActionButtonsProps {
  onView?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  viewTitle?: string;
  editTitle?: string;
  deleteTitle?: string;
  className?: string;
  size?: 'sm' | 'md';
}

/**
 * Enterprise square action buttons matching hospital workstation tables
 * (Green View, Blue Edit, Red Delete)
 */
export function TableActionButtons({
  onView,
  onEdit,
  onDelete,
  viewTitle = 'View record',
  editTitle = 'Edit record',
  deleteTitle = 'Delete record',
  className = '',
  size = 'md',
}: TableActionButtonsProps) {
  // Enhanced dimensions for maximum clarity and visibility on hospital workstations
  const btnSize = size === 'sm' ? 'w-6 h-6' : 'w-7 h-7';
  const iconSize = size === 'sm' ? 'w-3.5 h-3.5' : 'w-4 h-4';

  return (
    <div
      className={`inline-flex items-center gap-1.5 whitespace-nowrap ${className}`}
      onClick={(e) => e.stopPropagation()}
    >
      {onView && (
        <button
          type="button"
          onClick={onView}
          title={viewTitle}
          aria-label={viewTitle}
          className={`${btnSize} rounded-[3px] bg-[#16a34a] hover:bg-[#15803d] text-white flex items-center justify-center transition-all cursor-pointer shadow-xs border border-emerald-700/20 shrink-0`}
        >
          <Eye className={iconSize} strokeWidth={2.2} />
        </button>
      )}

      {onEdit && (
        <button
          type="button"
          onClick={onEdit}
          title={editTitle}
          aria-label={editTitle}
          className={`${btnSize} rounded-[3px] bg-[#2563eb] hover:bg-[#1d4ed8] text-white flex items-center justify-center transition-all cursor-pointer shadow-xs border border-blue-700/20 shrink-0`}
        >
          <SquarePen className={iconSize} strokeWidth={2.2} />
        </button>
      )}

      {onDelete && (
        <button
          type="button"
          onClick={onDelete}
          title={deleteTitle}
          aria-label={deleteTitle}
          className={`${btnSize} rounded-[3px] bg-[#dc2626] hover:bg-[#b91c1c] text-white flex items-center justify-center transition-all cursor-pointer shadow-xs border border-rose-700/20 shrink-0`}
        >
          <Trash2 className={iconSize} strokeWidth={2.2} />
        </button>
      )}
    </div>
  );
}

export default TableActionButtons;
