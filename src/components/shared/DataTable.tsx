import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ChevronLeft, ChevronRight, Search } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Column<T> {
  key: string;
  header: string;
  render?: (item: T) => React.ReactNode;
  className?: string;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  searchPlaceholder?: string;
  searchFields?: (keyof T)[];
  pageSize?: number;
  actions?: (item: T) => React.ReactNode;
  emptyMessage?: string;
  emptyIcon?: React.ReactNode;
}

export function DataTable<T extends { id: number }>({
  columns,
  data,
  searchPlaceholder = 'Cari...',
  searchFields = [],
  pageSize = 10,
  actions,
  emptyMessage = 'Tidak ada data',
  emptyIcon,
}: DataTableProps<T>) {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);

  const filtered = search && searchFields.length > 0
    ? data.filter(item =>
        searchFields.some(field => {
          const val = item[field];
          return val?.toString().toLowerCase().includes(search.toLowerCase());
        })
      )
    : data;

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const start = (page - 1) * pageSize;
  const paginated = filtered.slice(start, start + pageSize);

  return (
    <div className="space-y-3">
      {searchFields.length > 0 && (
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-neutral-500" />
          <Input
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            placeholder={searchPlaceholder}
            className="pl-10 bg-gray-100 dark:bg-neutral-900 border-gray-300 dark:border-neutral-700 text-gray-800 dark:text-neutral-200 placeholder:text-gray-400 dark:text-neutral-500 focus-visible:ring-amber-500 dark:focus-visible:ring-amber-400"
          />
        </div>
      )}

      <div className="rounded-lg border border-gray-200 dark:border-neutral-800 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="border-gray-200 dark:border-neutral-800 hover:bg-transparent">
              {columns.map(col => (
                <TableHead key={col.key} className={cn("text-gray-500 dark:text-neutral-400 font-medium text-xs", col.className)}>
                  {col.header}
                </TableHead>
              ))}
              {actions && <TableHead className="text-gray-500 dark:text-neutral-400 font-medium text-xs w-[100px]">Aksi</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginated.length > 0 ? (
              paginated.map(item => (
                <TableRow key={item.id} className="border-gray-200 dark:border-neutral-800 hover:bg-gray-100 dark:bg-gray-100/80 dark:bg-neutral-900/50">
                  {columns.map(col => (
                    <TableCell key={col.key} className="text-gray-600 dark:text-neutral-300 text-sm">
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
                <TableCell colSpan={columns.length + (actions ? 1 : 0)} className="text-center py-12">
                  {emptyIcon && <div className="mb-3">{emptyIcon}</div>}
                  <p className="text-gray-400 dark:text-neutral-500 text-sm">{emptyMessage}</p>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {filtered.length > pageSize && (
        <div className="flex items-center justify-between">
          <p className="text-gray-400 dark:text-neutral-500 text-xs">
            Menampilkan {start + 1}-{Math.min(start + pageSize, filtered.length)} dari {filtered.length}
          </p>
          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="bg-gray-100 dark:bg-neutral-900 border-gray-300 dark:border-neutral-700 text-gray-600 dark:text-neutral-300 hover:bg-gray-200 dark:bg-neutral-800"
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <span className="text-gray-500 dark:text-neutral-400 text-xs px-2">
              {page} / {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="bg-gray-100 dark:bg-neutral-900 border-gray-300 dark:border-neutral-700 text-gray-600 dark:text-neutral-300 hover:bg-gray-200 dark:bg-neutral-800"
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

export default DataTable;
