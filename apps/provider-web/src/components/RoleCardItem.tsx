import React from 'react';
import { ArrowRight } from 'lucide-react';
import { RoleCard } from '../data/rolesData';
import { RoleIcon } from './RoleIcon';

interface RoleCardItemProps {
  card: RoleCard;
  onSelectRole: (card: RoleCard) => void;
}

export const RoleCardItem: React.FC<RoleCardItemProps> = ({ card, onSelectRole }) => {
  return (
    <div
      onClick={() => onSelectRole(card)}
      className="group relative bg-white border border-slate-200/90 hover:border-teal-300 rounded-2xl p-5 shadow-xs hover:shadow-md transition-all duration-200 cursor-pointer flex flex-col justify-between"
    >
      <div>
        <div className="flex items-center gap-3.5 mb-3">
          <div
            className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 border ${card.badgeBg} group-hover:scale-105 transition-transform duration-200 shadow-xs`}
          >
            <RoleIcon name={card.iconName} className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-bold text-slate-800 text-base tracking-tight group-hover:text-teal-700 transition-colors">
              {card.title}
            </h3>
            <span className="text-[11px] font-medium text-slate-400">
              {card.role}
            </span>
          </div>
        </div>

        <p className="text-slate-500 text-xs sm:text-[13px] leading-relaxed line-clamp-2">
          {card.description}
        </p>
      </div>

      <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between">
        <span className="text-teal-700 font-semibold text-xs sm:text-[13px] flex items-center gap-1.5 group-hover:translate-x-0.5 transition-transform">
          {card.actionText}
          <ArrowRight className="w-3.5 h-3.5 text-teal-600 transition-transform group-hover:translate-x-1" />
        </span>
      </div>
    </div>
  );
};

