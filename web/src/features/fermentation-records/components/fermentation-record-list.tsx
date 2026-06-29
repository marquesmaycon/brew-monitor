import { useQuery } from '@tanstack/react-query'
import { Link } from '@tanstack/react-router'
import type {
  ColumnFiltersState,
  HeaderContext,
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
  ArrowUpDown,
  CircleAlert,
  CircleCheck,
  CircleX,
  SquarePen,
} from 'lucide-react'
import { useState } from 'react'

import { DataTable } from '@/components/data-table'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import type {
  FermentationRecord,
  FermentationRecordClassification,
} from '@/types/api'

import { listFermentationRecordsOptions } from '../api/options'

const classificationLabels: Record<FermentationRecordClassification, string> = {
  WITHIN_STANDARD: 'Dentro do padrao',
  ATTENTION: 'Atencao',
  OUT_OF_STANDARD: 'Fora do padrao',
}

export function FermentationRecordList() {
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 20,
  })

  const page = pagination.pageIndex + 1
  const limit = pagination.pageSize

  const { data: records, isFetching } = useQuery(
    listFermentationRecordsOptions({ limit, page }),
  )

  const table = useReactTable({
    data: records?.data ?? [],
    columns,
    rowCount: records?.meta.total,
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

const columnHelper = createColumnHelper<FermentationRecord>()

const sortableHeader = (label: string) =>
  function Header({
    column,
  }: HeaderContext<FermentationRecord, unknown>) {
    return (
      <div className="flex items-center gap-2">
        {label}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          <ArrowUpDown />
        </Button>
      </div>
    )
  }

const columns = [
  columnHelper.accessor('registeredAt', {
    header: sortableHeader('Registro'),
    cell: ({ row }) => new Date(row.original.registeredAt).toLocaleString(),
  }),
  columnHelper.accessor('batchNumber', {
    header: sortableHeader('Lote'),
    cell: (info) => info.row.original.batchNumber,
  }),
  columnHelper.accessor('beerName', {
    header: sortableHeader('Cerveja'),
    cell: ({ row }) => `${row.original.beerName} - ${row.original.beerStyle}`,
  }),
  columnHelper.accessor('tankName', {
    header: sortableHeader('Tanque'),
    cell: ({ row }) =>
      `${row.original.tankName} (${row.original.tankCapacityLiters} L)`,
  }),
  columnHelper.accessor('temperature', {
    header: sortableHeader('Temp.'),
    cell: (info) => `${info.row.original.temperature} C`,
  }),
  columnHelper.accessor('ph', {
    header: sortableHeader('pH'),
    cell: (info) => info.row.original.ph,
  }),
  columnHelper.accessor('extract', {
    header: sortableHeader('Extrato'),
    cell: (info) => info.row.original.extract,
  }),
  columnHelper.accessor('classification', {
    header: 'Classificacao',
    cell: ({ row }) => {
      const classification = row.original.classification
      const Icon =
        classification === 'WITHIN_STANDARD'
          ? CircleCheck
          : classification === 'ATTENTION'
            ? CircleAlert
            : CircleX

      return (
        <span className="inline-flex items-center gap-2 text-sm font-medium">
          <Icon className="size-4" />
          {classificationLabels[classification]}
        </span>
      )
    },
  }),
  columnHelper.display({
    id: 'actions',
    header: () => <div className="text-right">Acoes</div>,
    cell: ({ row }) => (
      <div className="flex justify-end">
        <Button asChild variant="link" aria-label="Editar registro">
          <Link
            to="/fermentation-records/$recordId/edit"
            params={{ recordId: row.original.id }}
            title="Editar registro"
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
