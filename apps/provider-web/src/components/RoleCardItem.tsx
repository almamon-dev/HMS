import { ArrowRight } from 'lucide-react';
import React from 'react';
import { RoleCard } from '../data/rolesData';
import { RoleIcon } from './RoleIcon';

interface RoleCardItemProps {
  card: RoleCard;
  onSelectRole: (card: RoleCard) => void;
}

/** Displays an individual hospital role portal card with 1-click access. */
export const RoleCardItem: React.FC<RoleCardItemProps> = ({
  card,
  onSelectRole,
}) => {
  return (
    <button
      type="button"
      onClick={() => onSelectRole(card)}
      className="group text-left w-full bg-white border border-slate-200/90 hover:border-[#006a4e]/50 rounded-md p-5 shadow-2xs hover:shadow-sm transition-all duration-200 cursor-pointer flex flex-col justify-between"
    >
      <div>
        <div className="flex items-center gap-3.5 mb-3">
          <div
            className={`w-11 h-11 rounded-[3px] flex items-center justify-center shrink-0 border ${card.badgeBg} group-hover:scale-105 transition-transform duration-200`}
          >
            <RoleIcon name={card.iconName} className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <h3 className="font-bold text-slate-900 text-[15px] tracking-tight group-hover:text-[#006a4e] transition-colors truncate">
              {card.title}
            </h3>
            <span className="text-[11px] font-medium text-slate-400 block truncate">
              {card.role}
            </span>
          </div>
        </div>

        <p className="text-slate-500 text-xs leading-relaxed line-clamp-2">
          {card.description}
        </p>
      </div>

      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
        <span className="text-[#006a4e] font-bold text-xs flex items-center gap-1.5 group-hover:translate-x-0.5 transition-transform">
          <span>{card.actionText}</span>
          <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
        </span>
      </div>
    </button>
  );
};

export default RoleCardItem;
