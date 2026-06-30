import { useQuery } from '@tanstack/react-query'
import { Link } from '@tanstack/react-router'
import type { PaginationState, SortingState } from '@tanstack/react-table'
import {
  createColumnHelper,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table'
import { SquarePen } from 'lucide-react'
import { useState } from 'react'

import { DataTable } from '@/components/table/data-table'
import { sortableHeader } from '@/components/table/sortable-header'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { formatDateTime } from '@/lib/date-format'
import type { BatchFermentationRecord } from '@/types/api'
import {
  classificationClasses,
  classificationLabels,
  getClassificationIcon,
} from '#/features/fermentation-records/utils/constants'

import { listBatchFermentationRecordsOptions } from '../api/options'

type BatchFermentationRecordTableProps = {
  batchNumber: string
}

export function BatchFermentationRecordTable({
  batchNumber,
}: BatchFermentationRecordTableProps) {
  const [sorting, setSorting] = useState<SortingState>([])
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 20,
  })

  const page = pagination.pageIndex + 1
  const limit = pagination.pageSize

  const { data: records, isFetching } = useQuery(
    listBatchFermentationRecordsOptions(batchNumber, { limit, page }),
  )

  const table = useReactTable({
    data: records?.data ?? [],
    columns,
    rowCount: records?.meta.total,
    state: { pagination, sorting },
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    manualPagination: true,
  })

  return <DataTable table={table} isFetching={isFetching} />
}

const columnHelper = createColumnHelper<BatchFermentationRecord>()

const columns = [
  columnHelper.accessor('registeredAt', {
    header: sortableHeader('Registro'),
    cell: ({ row }) => formatDateTime(row.original.registeredAt),
  }),
  columnHelper.accessor('tankName', {
    header: sortableHeader('Tanque'),
    cell: ({ row }) => (
      <Button asChild variant="link" className="px-0">
        <Link
          to="/tanks/$tankId/edit"
          params={{ tankId: row.original.tankId }}
          aria-label="Abrir tanque"
        >
          {`${row.original.tankName} (${row.original.tankCapacityLiters} L)`}
        </Link>
      </Button>
    ),
  }),
  columnHelper.accessor('temperature', {
    header: sortableHeader('Temp.'),
    cell: ({ row }) => `${row.original.temperature} C`,
  }),
  columnHelper.accessor('ph', {
    header: sortableHeader('pH'),
    cell: ({ row }) => row.original.ph,
  }),
  columnHelper.accessor('extract', {
    header: sortableHeader('Extrato'),
    cell: ({ row }) => `${row.original.extract} P`,
  }),
  columnHelper.accessor('classification', {
    header: 'Classificacao',
    cell: ({ row }) => {
      const classification = row.original.classification
      const Icon = getClassificationIcon(classification)

      return (
        <Badge
          variant="outline"
          className={classificationClasses[classification]}
        >
          <Icon />
          {classificationLabels[classification]}
        </Badge>
      )
    },
  }),
  columnHelper.accessor('notes', {
    header: 'Observacoes',
    cell: ({ row }) => (
      <span className="text-muted-foreground line-clamp-2 max-w-sm">
        {row.original.notes || '-'}
      </span>
    ),
    enableSorting: false,
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
