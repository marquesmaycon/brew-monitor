import { useQuery } from '@tanstack/react-query'
import type { PaginationState, SortingState } from '@tanstack/react-table'
import {
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table'
import { useState } from 'react'

import { DataTable } from '@/components/table/data-table'

import { listBatchFermentationRecordsOptions } from '../api/options'
import { columns } from '../tables/batch-fermentation-record-columns'

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
