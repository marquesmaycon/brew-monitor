import { keepPreviousData, useQuery } from '@tanstack/react-query'
import type { PaginationState } from '@tanstack/react-table'
import { getCoreRowModel, useReactTable } from '@tanstack/react-table'
import { useMemo, useState } from 'react'

import { DataTable } from '@/components/table/data-table'
import { beerKeys } from '@/features/beers/api/options'
import { listBeerFermentationRecords } from '@/features/beers/api/requests'
import { tankKeys } from '@/features/tanks/api/options'
import { listTankFermentationRecords } from '@/features/tanks/api/requests'

import type { AssociatedFermentationRecordEntityType } from '../tables/associated-fermentation-record-columns'
import { buildAssociatedFermentationRecordColumns } from '../tables/associated-fermentation-record-columns'

type AssociatedFermentationRecordTableProps = {
  entityId: string
  entityType: AssociatedFermentationRecordEntityType
}

export function AssociatedFermentationRecordTable({
  entityId,
  entityType,
}: AssociatedFermentationRecordTableProps) {
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 20,
  })

  const page = pagination.pageIndex + 1
  const limit = pagination.pageSize
  const paginationParams = { limit, page }

  const queryKey =
    entityType === 'beer'
      ? beerKeys.fermentationRecords(entityId, paginationParams)
      : tankKeys.fermentationRecords(entityId, paginationParams)

  const { data: records, isFetching } = useQuery({
    queryKey,
    queryFn: function () {
      return entityType === 'beer'
        ? listBeerFermentationRecords(entityId, paginationParams)
        : listTankFermentationRecords(entityId, paginationParams)
    },
    placeholderData: keepPreviousData,
  })
  const columns = useMemo(
    () => buildAssociatedFermentationRecordColumns(entityType),
    [entityType],
  )

  const table = useReactTable({
    data: records?.data ?? [],
    columns,
    rowCount: records?.meta.total,
    state: { pagination },
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
  })

  return (
    <section className="flex w-full flex-col gap-4">
      <div>
        <h2 className="text-xl font-semibold">Registros associados</h2>
        <p className="text-muted-foreground text-sm">
          Historico fermentativo vinculado a este cadastro.
        </p>
      </div>

      <DataTable table={table} isFetching={isFetching} />
    </section>
  )
}
