import type { Table as TableType } from '@tanstack/react-table'
import { flexRender } from '@tanstack/react-table'
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Loader2,
} from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { cn } from '@/lib/utils'

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select'

interface DataTableProps<TData> {
  table: TableType<TData>
  isFetching: boolean
}

export function DataTable<TData>({ table, isFetching }: DataTableProps<TData>) {
  return (
    <>
      <div className="bg-card/33 h-full overflow-hidden rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={table._getColumnDefs().length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <nav className="mt-auto flex flex-wrap items-center justify-between gap-8 pt-2 sm:flex-nowrap">
        <div className="flex flex-1 items-center gap-1">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.firstPage()}
            disabled={!table.getCanPreviousPage()}
          >
            <ChevronsLeft />
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            <ChevronLeft />
          </Button>

          <div className="mx-auto px-9 sm:mx-4">
            <p className="flex items-center gap-1 text-sm font-semibold text-nowrap">
              {table.getState().pagination.pageIndex + 1} /{' '}
              {table.getPageCount().toLocaleString()}
            </p>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            <ChevronRight />
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => table.lastPage()}
            disabled={!table.getCanNextPage()}
          >
            <ChevronsRight />
          </Button>

          <Loader2
            className={cn(
              'text-muted-foreground ml-2 size-4 animate-spin',
              isFetching ? 'inline-block' : 'hidden',
            )}
          />
        </div>
        <Select
          value={table.getState().pagination.pageSize.toString()}
          onValueChange={(val) => table.setPageSize(Number(val))}
        >
          <SelectTrigger className="min-w-40 flex-1 sm:w-52 sm:flex-none">
            <SelectValue placeholder="Por página" />
          </SelectTrigger>
          <SelectContent position="item-aligned">
            {['5', '10', '20', '50'].map((pageSize) => (
              <SelectItem key={pageSize} value={pageSize}>
                Mostrar {pageSize}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </nav>
    </>
  )
}
