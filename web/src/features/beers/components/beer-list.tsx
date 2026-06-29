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
import {
  FlaskConical,
  Pipette,
  SquarePen,
  ThermometerSnowflake,
} from 'lucide-react'
import { useState } from 'react'

import { DataTable } from '@/components/data-table'
import { sortableHeader } from '@/components/table/sortable-header'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import type { Beer } from '@/types/api'

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
    header: sortableHeader('Nome'),
    cell: (info) => info.row.original.name,
  }),
  columnHelper.accessor('style', {
    header: sortableHeader('Estilo'),
    cell: (info) => info.row.original.style,
  }),
  columnHelper.accessor('createdAt', {
    header: sortableHeader('Criado em'),
    cell: ({ row }) => {
      const isoDate = row.original.createdAt
      return isoDate ? new Date(isoDate).toLocaleDateString() : null
    },
  }),
  columnHelper.accessor('fermentationParameter', {
    header: () => 'Parâmetros (Temperatura | PH | Extrato)',
    cell: ({ row }) => {
      const params = row.original.fermentationParameter

      return (
        <Button asChild variant="secondary" aria-label="Editar parâmetros">
          <Link
            to="/beers/$beerId/parameters"
            params={{ beerId: row.original.id }}
            title="Editar parâmetros"
          >
            <ThermometerSnowflake /> {params?.minTemperature} -{' '}
            {params?.maxTemperature} | <Pipette /> {params?.minPh} -{' '}
            {params?.maxPh} | <FlaskConical />
            {params?.minExtract} - {params?.maxExtract}
            <span className="sr-only">Editar parâmetros</span>
          </Link>
        </Button>
      )
    },
  }),
  columnHelper.display({
    id: 'actions',
    header: () => <div className="text-right">Ações</div>,
    cell: ({ row }) => (
      <div className="flex justify-end">
        <Button asChild variant="link" aria-label="Editar cerveja">
          <Link
            to="/beers/$beerId/edit"
            params={{ beerId: row.original.id }}
            title="Editar cerveja"
          >
            <SquarePen />
            <span>Editar</span>
          </Link>
        </Button>
      </div>
    ),
    enableSorting: false,
    enableColumnFilter: false,
  }),
]
