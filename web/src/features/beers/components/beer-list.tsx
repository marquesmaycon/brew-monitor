import { useQuery } from '@tanstack/react-query'
import type {
  ColumnFiltersState,
  PaginationState,
  SortingState,
} from '@tanstack/react-table'
import {
  createColumnHelper,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table'
import { ArrowUpDown } from 'lucide-react'
import { useState } from 'react'

import { DataTable } from '#/components/data-table'
import { Button } from '#/components/ui/button'
import { Input } from '#/components/ui/input'
import type { Beer } from '#/types/api'

import { listBeersOptions } from '../api/options'

export function BeerList() {
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 20,
  })

  const page = pagination.pageIndex + 1
  const limit = pagination.pageSize

  const { data: beers, isFetching } = useQuery(
    listBeersOptions({ limit, page }),
  )

  const table = useReactTable({
    data: beers?.data ?? [],
    columns,
    rowCount: beers?.meta.total,
    state: { pagination, sorting, columnFilters },
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    manualPagination: true,
    debugTable: true,
  })

  return (
    <div className="flex flex-1 flex-col gap-4">
      <div className="flex items-center py-4">
        <Input
          placeholder="Filter products..."
          value={table.getColumn('name')?.getFilterValue() as string}
          onChange={(event) =>
            table.getColumn('name')?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
      </div>
      <DataTable table={table} isFetching={isFetching} />
    </div>
  )
}

const columnHelper = createColumnHelper<Beer>()

const columns = [
  columnHelper.accessor('name', {
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
      >
        Product
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: (info) => info.row.original.name,
  }),
  columnHelper.accessor('style', {
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
      >
        Style
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: (info) => info.row.original.style,
  }),
  columnHelper.accessor('createdAt', {
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
      >
        Created At
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const isoDate = row.original.createdAt
      return isoDate ? new Date(isoDate).toLocaleDateString() : null
    },
  }),
]
