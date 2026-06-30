import { useQuery } from '@tanstack/react-query'
import type { PaginationState, SortingState } from '@tanstack/react-table'
import {
  createColumnHelper,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table'
import { useState } from 'react'

import { DataTable } from '@/components/table/data-table'
import { sortableHeader } from '@/components/table/sortable-header'
import { Badge } from '@/components/ui/badge'
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
    cell: ({ row }) => new Date(row.original.registeredAt).toLocaleString(),
  }),
  columnHelper.accessor('tankName', {
    header: sortableHeader('Tanque'),
    cell: ({ row }) =>
      `${row.original.tankName} (${row.original.tankCapacityLiters} L)`,
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
]
