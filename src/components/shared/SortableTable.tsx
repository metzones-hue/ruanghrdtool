import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
import { ChevronLeft, ChevronRight, Search, ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Column<T> {
  key: string;
  header: string;
  sortable?: boolean;
  render?: (item: T) => React.ReactNode;
  className?: string;
}

interface SortableTableProps<T> {
  columns: Column<T>[];
  data: T[];
  searchPlaceholder?: string;
  searchFields?: (keyof T)[];
  pageSize?: number;
  actions?: (item: T) => React.ReactNode;
  bulkActions?: { label: string; onClick: (ids: number[]) => void; variant?: 'default' | 'destructive' }[];
  emptyMessage?: string;
  emptyIcon?: React.ReactNode;
  onSelectionChange?: (selected: number[]) => void;
}

export function SortableTable<T extends { id: number }>({
  columns,
  data,
  searchPlaceholder = 'Cari...',
  searchFields = [],
  pageSize = 10,
  actions,
  bulkActions,
  emptyMessage = 'Tidak ada data',
  emptyIcon,
  onSelectionChange,
}: SortableTableProps<T>) {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');
  const [selected, setSelected] = useState<Set<number>>(new Set());

  const handleSort = (key: string) => {
    if (sortKey === key) {
      setSortDir(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortDir('asc');
    }
  };

  const toggleSelect = (id: number) => {
    setSelected(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      if (onSelectionChange) onSelectionChange([...next]);
      return next;
    });
  };

  const toggleSelectAll = () => {
    setSelected(prev => {
      const filteredIds = filtered.map(f => f.id);
      const allSelected = filteredIds.every(id => prev.has(id));
      const next = new Set(prev);
      if (allSelected) {
        filteredIds.forEach(id => next.delete(id));
      } else {
        filteredIds.forEach(id => next.add(id));
      }
      if (onSelectionChange) onSelectionChange([...next]);
      return next;
    });
  };

  let filtered = search && searchFields.length > 0
    ? data.filter(item =>
        searchFields.some(field => {
          const val = item[field];
          return val?.toString().toLowerCase().includes(search.toLowerCase());
        })
      )
    : data;

  // Sort
  if (sortKey) {
    filtered = [...filtered].sort((a, b) => {
      const aVal = (a as Record<string, unknown>)[sortKey];
      const bVal = (b as Record<string, unknown>)[sortKey];
      if (typeof aVal === 'number' && typeof bVal === 'number') {
        return sortDir === 'asc' ? aVal - bVal : bVal - aVal;
      }
      const aStr = String(aVal || '').toLowerCase();
      const bStr = String(bVal || '').toLowerCase();
      return sortDir === 'asc' ? aStr.localeCompare(bStr) : bStr.localeCompare(aStr);
    });
  }

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const start = (page - 1) * pageSize;
  const paginated = filtered.slice(start, start + pageSize);
  const allSelectedOnPage = paginated.length > 0 && paginated.every(f => selected.has(f.id));

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3">
        {searchFields.length > 0 && (
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-neutral-500" />
            <Input
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              placeholder={searchPlaceholder}
              className="pl-10 bg-white dark:bg-neutral-900 border-gray-200 dark:border-neutral-800 text-gray-900 dark:text-neutral-200 placeholder:text-gray-400 dark:placeholder:text-neutral-500 focus-visible:ring-amber-500"
            />
          </div>
        )}
        {bulkActions && selected.size > 0 && (
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500 dark:text-neutral-400">{selected.size} dipilih</span>
            {bulkActions.map((ba, i) => (
              <Button
                key={i}
                size="sm"
                variant={ba.variant === 'destructive' ? 'destructive' : 'default'}
                onClick={() => ba.onClick([...selected])}
                className={ba.variant !== 'destructive' ? 'bg-amber-500 hover:bg-amber-600 text-black' : ''}
              >
                {ba.label}
              </Button>
            ))}
          </div>
        )}
      </div>

      <div className="rounded-lg border border-gray-200 dark:border-neutral-800 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="border-gray-200 dark:border-neutral-800 hover:bg-transparent">
              {bulkActions && (
                <TableHead className="w-[40px]">
                  <Checkbox checked={allSelectedOnPage} onCheckedChange={toggleSelectAll} />
                </TableHead>
              )}
              {columns.map(col => (
                <TableHead
                  key={col.key}
                  className={cn("font-medium text-xs cursor-pointer select-none",
                    col.sortable && "hover:text-amber-500 transition-colors",
                    col.className,
                    sortKey === col.key ? "text-amber-500" : "text-gray-500 dark:text-neutral-500"
                  )}
                  onClick={() => col.sortable && handleSort(col.key)}
                >
                  <div className="flex items-center gap-1">
                    {col.header}
                    {col.sortable && (
                      sortKey === col.key
                        ? (sortDir === 'asc' ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />)
                        : <ArrowUpDown className="w-3 h-3 opacity-30" />
                    )}
                  </div>
                </TableHead>
              ))}
              {actions && <TableHead className="w-[100px] font-medium text-xs text-gray-500 dark:text-neutral-500">Aksi</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginated.length > 0 ? (
              paginated.map(item => (
                <TableRow key={item.id} className="border-gray-200 dark:border-neutral-800 hover:bg-gray-50 dark:hover:bg-neutral-900/50">
                  {bulkActions && (
                    <TableCell>
                      <Checkbox checked={selected.has(item.id)} onCheckedChange={() => toggleSelect(item.id)} />
                    </TableCell>
                  )}
                  {columns.map(col => (
                    <TableCell key={col.key} className="text-gray-800 dark:text-neutral-300 text-sm">
                      {col.render ? col.render(item) : (item as Record<string, unknown>)[col.key] as React.ReactNode}
                    </TableCell>
                  ))}
                  {actions && (
                    <TableCell>
                      <div className="flex items-center gap-1">{actions(item)}</div>
                    </TableCell>
                  )}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length + (actions ? 1 : 0) + (bulkActions ? 1 : 0)} className="text-center py-12">
                  {emptyIcon && <div className="mb-3">{emptyIcon}</div>}
                  <p className="text-gray-400 dark:text-neutral-600 text-sm">{emptyMessage}</p>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {filtered.length > pageSize && (
        <div className="flex items-center justify-between">
          <p className="text-gray-400 dark:text-neutral-600 text-xs">
            {start + 1}-{Math.min(start + pageSize, filtered.length)} dari {filtered.length}
          </p>
          <div className="flex items-center gap-1">
            <Button variant="outline" size="sm" onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
              className="bg-white dark:bg-neutral-900 border-gray-200 dark:border-neutral-800 text-gray-700 dark:text-neutral-300 hover:bg-gray-100 dark:hover:bg-neutral-800">
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <span className="text-gray-400 dark:text-neutral-500 text-xs px-2">{page} / {totalPages}</span>
            <Button variant="outline" size="sm" onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}
              className="bg-white dark:bg-neutral-900 border-gray-200 dark:border-neutral-800 text-gray-700 dark:text-neutral-300 hover:bg-gray-100 dark:hover:bg-neutral-800">
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

export default SortableTable;
