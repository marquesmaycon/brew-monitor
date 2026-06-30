import { useQuery } from '@tanstack/react-query'
import { Link } from '@tanstack/react-router'
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
import { Eye } from 'lucide-react'
import { useState } from 'react'

import { sortableHeader } from '@/components/table/sortable-header'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import type { Batch } from '@/types/api'
import { DataTable } from '#/components/table/data-table'

import { listBatchesOptions } from '../api/options'

export function BatchList() {
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 20,
  })

  const page = pagination.pageIndex + 1
  const limit = pagination.pageSize

  const { data: batches, isFetching } = useQuery(
    listBatchesOptions({ limit, page }),
  )

  const table = useReactTable({
    data: batches?.data ?? [],
    columns,
    rowCount: batches?.meta.total,
    state: { pagination, sorting, columnFilters },
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    manualPagination: true,
  })

  return (
    <div className="flex flex-1 flex-col gap-4">
      <div className="flex items-center py-4">
        <Input
          placeholder="Filtrar por lote..."
          value={table.getColumn('batchNumber')?.getFilterValue() as string}
          onChange={(event) =>
            table.getColumn('batchNumber')?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
      </div>
      <DataTable table={table} isFetching={isFetching} />
    </div>
  )
}

const columnHelper = createColumnHelper<Batch>()

const columns = [
  columnHelper.accessor('batchNumber', {
    header: sortableHeader('Lote'),
    cell: (info) => info.row.original.batchNumber,
  }),
  columnHelper.accessor('beerName', {
    header: sortableHeader('Cerveja'),
    cell: ({ row }) => (
      <Button asChild variant="link" className="px-0">
        <Link
          to="/beers/$beerId/edit"
          params={{ beerId: row.original.beerId }}
          aria-label="Abrir cerveja"
        >
          {`${row.original.beerName} - ${row.original.beerStyle}`}
        </Link>
      </Button>
    ),
  }),
  columnHelper.accessor('fermentationRecordCount', {
    header: sortableHeader('Registros'),
    cell: ({ row }) => row.original.fermentationRecordCount,
  }),
  columnHelper.display({
    id: 'actions',
    header: () => <div className="text-right">Acoes</div>,
    cell: ({ row }) => (
      <div className="flex justify-end">
        <Button asChild variant="link" aria-label="Ver lote">
          <Link
            to="/batches/$batchNumber"
            params={{ batchNumber: row.original.batchNumber }}
            title="Ver lote"
          >
            <Eye />
            <span>Ver lote</span>
          </Link>
        </Button>
      </div>
    ),
    enableSorting: false,
    enableColumnFilter: false,
  }),
]
