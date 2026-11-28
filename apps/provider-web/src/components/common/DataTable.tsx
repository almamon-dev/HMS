import {
  ArrowDown,
  ArrowUp,
  ArrowUpDown,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  RotateCcw,
  Search,
  X,
} from 'lucide-react';
import React, { useMemo, useState } from 'react';

export type SortDirection = 'asc' | 'desc';

export interface DataTableColumn<T> {
  key: string;
  header: string;
  sortable?: boolean;
  sortValue?: (row: T) => string | number;
  align?: 'left' | 'center' | 'right';
  className?: string;
  render: (row: T, index?: number) => React.ReactNode;
}

interface DataTableProps<T> {
  title?: string;
  subtitle?: string;
  data: T[];
  columns: DataTableColumn<T>[];
  rowKey?: (row: T) => string;
  keyExtractor?: (row: T) => string;
  searchable?: boolean;
  searchPlaceholder?: string;
  searchFilter?: (row: T, query: string) => boolean;
  toolbarFilters?: React.ReactNode;
  filters?: React.ReactNode;
  headerActions?: React.ReactNode;
  toolbarActions?: React.ReactNode;
  actionButton?: React.ReactNode;
  pageSizeOptions?: number[];
  defaultPageSize?: number;
  emptyTitle?: string;
  emptyDescription?: string;
  emptyMessage?: string;
  defaultSort?: { key: string; order: 'asc' | 'desc' };
  onRowClick?: (row: T) => void;
  showSerial?: boolean;
  stickyHeader?: boolean;
  maxHeight?: string;
  compact?: boolean;
}

/**
 * Reusable CareerDirect-style enterprise data table with live search filtering,
 * typed column sorting, custom filter slots, and configurable pagination.
 */
export function DataTable<T>({
  data,
  columns,
  rowKey,
  keyExtractor,
  searchable = true,
  searchPlaceholder = 'Search records...',
  searchFilter,
  toolbarFilters,
  filters,
  headerActions,
  toolbarActions,
  actionButton,
  pageSizeOptions = [8, 12, 20],
  defaultPageSize = 8,
  emptyTitle,
  emptyDescription = 'Try adjusting your search or filter criteria.',
  emptyMessage,
  defaultSort,
  onRowClick,
  showSerial = true,
  stickyHeader = true,
  maxHeight,
  compact = false,
}: DataTableProps<T>) {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortKey, setSortKey] = useState<string>(defaultSort?.key ?? '');
  const [sortDir, setSortDir] = useState<SortDirection>(defaultSort?.order ?? 'asc');
  const [pageSize, setPageSize] = useState<number>(defaultPageSize);
  const [page, setPage] = useState<number>(1);

  const effectiveEmptyTitle = emptyTitle || emptyMessage || 'No matching records found';
  const effectiveToolbarFilters = toolbarFilters ?? filters;
  const effectiveToolbarActions = toolbarActions ?? actionButton;

  const getRowKey = (row: T, idx: number): string => {
    if (typeof rowKey === 'function') return rowKey(row);
    if (typeof keyExtractor === 'function') return keyExtractor(row);
    if (row && typeof row === 'object') {
      const anyRow = row as Record<string, unknown>;
      if (anyRow.id != null) return String(anyRow.id);
      if (anyRow.uhid != null) return String(anyRow.uhid);
      if (anyRow.tokenNo != null) return String(anyRow.tokenNo);
    }
    return String(idx);
  };

  const searchedData = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q || !searchFilter) return data;
    return data.filter((row) => searchFilter(row, q));
  }, [data, searchQuery, searchFilter]);

  const sortedData = useMemo(() => {
    if (!sortKey) return searchedData;
    const col = columns.find((c) => c.key === sortKey);
    if (!col?.sortValue) return searchedData;
    const getter = col.sortValue;
    return [...searchedData].sort((a, b) => {
      const av = getter(a);
      const bv = getter(b);
      if (typeof av === 'number' && typeof bv === 'number') {
        return sortDir === 'asc' ? av - bv : bv - av;
      }
      const res = String(av).localeCompare(String(bv), undefined, {
        numeric: true,
        sensitivity: 'base',
      });
      return sortDir === 'asc' ? res : -res;
    });
  }, [searchedData, sortKey, sortDir, columns]);

  const totalItems = sortedData.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const safePage = Math.min(page, totalPages);

  const paginatedRows = useMemo(() => {
    const start = (safePage - 1) * pageSize;
    return sortedData.slice(start, start + pageSize);
  }, [sortedData, safePage, pageSize]);

  const handleSort = (key: string) => {
    if (sortKey === key) {
      setSortDir((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(key);
      setSortDir('asc');
    }
    setPage(1);
  };

  const renderSortIcon = (key: string) => {
    if (sortKey !== key) {
      return <ArrowUpDown className="w-3 h-3 text-slate-400" />;
    }
    return sortDir === 'asc' ? (
      <ArrowUp className="w-3 h-3 text-slate-700" />
    ) : (
      <ArrowDown className="w-3 h-3 text-slate-700" />
    );
  };

  const alignClass = (align?: 'left' | 'center' | 'right') => {
    if (align === 'right') return 'text-right justify-end';
    if (align === 'center') return 'text-center justify-center';
    return 'text-left justify-start';
  };

  const startEntry = totalItems === 0 ? 0 : (safePage - 1) * pageSize + 1;
  const endEntry = Math.min(safePage * pageSize, totalItems);

  return (
    <div className="bg-white border border-slate-300/80 rounded-[3px] shadow-xs overflow-hidden w-full">
      {/* Toolbar: Search, Filters, and Actions without redundant table header title & description */}
      <div className="px-3 py-2 border-b border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          {searchable && searchFilter && (
            <div className="relative w-full sm:w-64">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setPage(1);
                }}
                placeholder={searchPlaceholder}
                className="w-full h-8 bg-white border border-slate-300 rounded-[3px] pl-8 pr-7 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-hidden focus:border-[#006a4e]"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery('');
                    setPage(1);
                  }}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 cursor-pointer p-0.5 rounded-full"
                  aria-label="Clear search"
                  title="Clear search"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          )}

          {effectiveToolbarFilters}
        </div>

        <div className="flex flex-wrap items-center gap-2 sm:ml-auto">
          {headerActions}
          {effectiveToolbarActions}
        </div>
      </div>

      {/* Table - clean professional layout with subtle top-to-bottom column borders */}
      <div
        className="overflow-x-auto table-hover-scrollbar"
        style={maxHeight ? { maxHeight, overflowY: 'auto' } : undefined}
      >
        <table className="min-w-full w-full text-xs text-slate-700 border-collapse">
          <thead>
            <tr className={`bg-slate-50 border-b border-slate-200 text-slate-700 font-semibold ${compact ? 'text-[11px]' : 'text-xs'}`}>
              {showSerial && (
                <th
                  className={`${compact ? 'px-2 py-1.5 w-9 text-[11px]' : 'px-3 py-2.5 w-11 text-xs'} font-semibold text-slate-700 text-center whitespace-nowrap border-r border-slate-200/60 ${
                    stickyHeader ? 'sticky top-0 z-10 bg-slate-50 shadow-[0_1px_0_0_#cbd5e1]' : ''
                  }`}
                >
                  SL
                </th>
              )}
              {columns.map((col, cIdx) => {
                const textAlign =
                  col.align === 'right'
                    ? 'text-right'
                    : col.align === 'center'
                      ? 'text-center'
                      : 'text-left';

                const isLast = cIdx === columns.length - 1;

                return (
                  <th
                    key={col.key}
                    className={`${compact ? 'px-2.5 py-1.5 text-[11px]' : 'px-3 py-2.5 text-xs'} font-semibold text-slate-700 whitespace-nowrap ${
                      stickyHeader ? 'sticky top-0 z-10 bg-slate-50 shadow-[0_1px_0_0_#cbd5e1]' : ''
                    } ${textAlign} ${isLast ? '' : 'border-r border-slate-200/60'} ${col.className ?? ''}`}
                  >
                    {col.sortable && col.sortValue ? (
                      <button
                        type="button"
                        onClick={() => handleSort(col.key)}
                        className={`inline-flex items-center gap-1 font-semibold text-slate-700 hover:text-[#006a4e] transition-colors cursor-pointer ${alignClass(
                          col.align
                        )}`}
                      >
                        <span className="font-semibold">{col.header}</span>
                        {renderSortIcon(col.key)}
                      </button>
                    ) : (
                      <span className="font-semibold">{col.header}</span>
                    )}
                  </th>
                );
              })}
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100">
            {paginatedRows.length > 0 ? (
              paginatedRows.map((row, idx) => (
                <tr
                  key={getRowKey(row, idx)}
                  onClick={onRowClick ? () => onRowClick(row) : undefined}
                  className={`text-slate-700 transition-colors ${onRowClick
                      ? 'hover:bg-[#edf6f2]/40 cursor-pointer'
                      : 'hover:bg-slate-50/70'
                    }`}
                >
                  {showSerial && (
                    <td className={`${compact ? 'px-2 py-1 text-[11px]' : 'px-3 py-2 text-xs'} text-center whitespace-nowrap text-slate-500 font-medium border-r border-slate-200/50 leading-normal`}>
                      {(safePage - 1) * pageSize + idx + 1}
                    </td>
                  )}
                  {columns.map((col, cIdx) => {
                    const textAlign =
                      col.align === 'right'
                        ? 'text-right'
                        : col.align === 'center'
                          ? 'text-center'
                          : 'text-left';

                    const isLast = cIdx === columns.length - 1;

                    return (
                      <td
                        key={col.key}
                        className={`${compact ? 'px-2.5 py-1 text-xs' : 'px-3 py-2 text-xs'} whitespace-nowrap leading-normal text-slate-800 ${textAlign} ${isLast ? '' : 'border-r border-slate-200/50'
                          } ${col.className ?? ''}`}
                      >
                        {col.render(row, idx)}
                      </td>
                    );
                  })}
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={columns.length + (showSerial ? 1 : 0)}
                  className="px-3 py-8 text-center text-slate-500"
                >
                  <div className="font-semibold text-slate-700 text-xs">{effectiveEmptyTitle}</div>
                  <div className="text-[11px] text-slate-400 mt-0.5">{emptyDescription}</div>
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => {
                        setSearchQuery('');
                        setPage(1);
                      }}
                      className="mt-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-[3px] bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-semibold shadow-xs cursor-pointer transition-colors"
                    >
                      <RotateCcw className="w-3 h-3 text-slate-500" />
                      <span>Clear Search</span>
                    </button>
                  )}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer - Classic Hospital Desktop / Java Statusbar Style */}
      <div className="px-3 py-2 border-t border-slate-200/90 bg-slate-50 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-700">
        <div className="flex items-center gap-3">
          <span>
            Showing <span className="font-semibold text-slate-900">{startEntry}</span> to{' '}
            <span className="font-semibold text-slate-900">{endEntry}</span> of{' '}
            <span className="font-semibold text-slate-900">{totalItems}</span> records
          </span>

          <div className="flex items-center gap-1.5 text-xs text-slate-600">
            <span>Per page:</span>
            <div className="relative inline-flex items-center">
              <select
                value={pageSize}
                aria-label="Rows per page"
                onChange={(e) => {
                  setPageSize(Number(e.target.value));
                  setPage(1);
                }}
                className="h-6.5 bg-white border border-slate-300 rounded-[3px] pl-2 pr-5 text-xs text-slate-800 appearance-none focus:outline-none focus:border-slate-500 cursor-pointer"
              >
                {pageSizeOptions.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-3 h-3 text-slate-500 absolute right-1.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1 text-xs">
          <span className="text-slate-600 mr-1.5">
            Page <span className="font-semibold text-slate-900">{safePage}</span> of{' '}
            <span className="font-semibold text-slate-900">{totalPages}</span>
          </span>

          <button
            type="button"
            disabled={safePage <= 1}
            onClick={() => setPage(1)}
            aria-label="First page"
            title="First page"
            className="h-6.5 px-1.5 rounded-[3px] border border-slate-300 bg-white text-slate-700 hover:bg-slate-200 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer flex items-center"
          >
            <ChevronsLeft className="w-3.5 h-3.5" />
          </button>

          <button
            type="button"
            disabled={safePage <= 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            aria-label="Previous page"
            title="Previous page"
            className="h-6.5 px-1.5 rounded-[3px] border border-slate-300 bg-white text-slate-700 hover:bg-slate-200 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer flex items-center"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => {
            const active = pageNum === safePage;
            return (
              <button
                key={pageNum}
                type="button"
                onClick={() => setPage(pageNum)}
                className={`h-6.5 min-w-[26px] px-1.5 rounded-[3px] text-xs font-semibold border transition-colors cursor-pointer ${active
                    ? 'bg-slate-200 border-slate-400 text-slate-900 font-bold'
                    : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-200'
                  }`}
              >
                {pageNum}
              </button>
            );
          })}

          <button
            type="button"
            disabled={safePage >= totalPages}
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            aria-label="Next page"
            title="Next page"
            className="h-6.5 px-1.5 rounded-[3px] border border-slate-300 bg-white text-slate-700 hover:bg-slate-200 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer flex items-center"
          >
            <ChevronRight className="w-3.5 h-3.5" />
          </button>

          <button
            type="button"
            disabled={safePage >= totalPages}
            onClick={() => setPage(totalPages)}
            aria-label="Last page"
            title="Last page"
            className="h-6.5 px-1.5 rounded-[3px] border border-slate-300 bg-white text-slate-700 hover:bg-slate-200 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer flex items-center"
          >
            <ChevronsRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default DataTable;
