import React from 'react';

export interface PageHeaderBreadcrumb {
  label: string;
  href?: string;
  onClick?: () => void;
}

export interface PageHeaderProps {
  title: string;
  description?: string;
  badge?: React.ReactNode;
  actions?: React.ReactNode;
  breadcrumbs?: PageHeaderBreadcrumb[];
  className?: string;
}

/**
 * Universal Page Header Component across all portals (Pharmacist, Doctor, Patient, Superadmin):
 * - Clean Title Case title (text-base sm:text-lg font-bold)
 * - Concise subtitle / description (text-xs text-slate-500)
 * - Optional status badge next to title
 * - Optional action buttons on the right
 * - Optional breadcrumb path navigation
 * - No uppercase, compact spacing matching SaaS design
 */
export const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  description,
  badge,
  actions,
  breadcrumbs,
  className = '',
}) => {
  return (
    <div className={`mb-3 select-none ${className}`}>
      {/* Optional Breadcrumb Path */}
      {breadcrumbs && breadcrumbs.length > 0 && (
        <nav className="flex items-center gap-1.5 text-[11px] font-medium text-slate-400 mb-1">
          {breadcrumbs.map((b, idx) => (
            <React.Fragment key={idx}>
              {idx > 0 && <span className="text-slate-300">/</span>}
              {b.onClick ? (
                <button
                  type="button"
                  onClick={b.onClick}
                  className="hover:text-slate-700 transition-colors cursor-pointer"
                >
                  {b.label}
                </button>
              ) : b.href ? (
                <a href={b.href} className="hover:text-slate-700 transition-colors">
                  {b.label}
                </a>
              ) : (
                <span className="text-slate-600 font-semibold">{b.label}</span>
              )}
            </React.Fragment>
          ))}
        </nav>
      )}

      {/* Main Header Row: Title & Description on Left, Actions on Right */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2.5">
        <div className="min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="text-base sm:text-lg font-bold tracking-tight text-slate-900 leading-tight">
              {title}
            </h1>
            {badge && <div className="shrink-0">{badge}</div>}
          </div>
          {description && (
            <p className="text-xs text-slate-500 font-normal mt-0.5 leading-relaxed">
              {description}
            </p>
          )}
        </div>

        {actions && (
          <div className="flex items-center gap-2 flex-wrap shrink-0">
            {actions}
          </div>
        )}
      </div>
    </div>
  );
};
