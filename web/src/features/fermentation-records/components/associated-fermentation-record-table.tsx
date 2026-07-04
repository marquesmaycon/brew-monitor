import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { Link } from '@tanstack/react-router'
import type { PaginationState } from '@tanstack/react-table'
import {
  createColumnHelper,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table'
import { SquarePen } from 'lucide-react'
import { useMemo, useState } from 'react'

import { DataTable } from '@/components/table/data-table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { beerKeys } from '@/features/beers/api/options'
import { listBeerFermentationRecords } from '@/features/beers/api/requests'
import { tankKeys } from '@/features/tanks/api/options'
import { listTankFermentationRecords } from '@/features/tanks/api/requests'
import { formatDateTime } from '@/lib/date-format'
import type { FermentationRecord } from '@/types/api'

import {
  classificationClasses,
  classificationLabels,
  getClassificationIcon,
} from '../utils/constants'

type AssociatedFermentationRecordTableProps = {
  entityId: string
  entityType: 'beer' | 'tank'
}

const columnHelper = createColumnHelper<FermentationRecord>()

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
  const columns = useMemo(() => buildColumns(entityType), [entityType])

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

function buildColumns(
  entityType: AssociatedFermentationRecordTableProps['entityType'],
) {
  return [
    columnHelper.accessor('batchNumber', {
      header: 'Lote',
      cell: ({ row }) => (
        <Button asChild variant="link" className="px-0">
          <Link
            to="/batches/$batchNumber"
            params={{ batchNumber: row.original.batchNumber }}
            aria-label="Detalhar lote"
          >
            {row.original.batchNumber}
          </Link>
        </Button>
      ),
    }),
    columnHelper.accessor('registeredAt', {
      header: 'Registro',
      cell: ({ row }) => formatDateTime(row.original.registeredAt),
    }),
    entityType === 'beer'
      ? columnHelper.accessor('tank.name', {
          header: 'Tanque',
          cell: ({ row }) => (
            <Button asChild variant="link" className="px-0">
              <Link
                to="/tanks/$tankId/edit"
                params={{ tankId: row.original.tankId }}
                aria-label="Abrir tanque"
              >
                {`${row.original.tank.name} (${row.original.tank.capacityLiters} L)`}
              </Link>
            </Button>
          ),
        })
      : columnHelper.accessor('beer.name', {
          header: 'Cerveja',
          cell: ({ row }) => (
            <Button asChild variant="link" className="px-0">
              <Link
                to="/beers/$beerId/edit"
                params={{ beerId: row.original.beerId }}
                aria-label="Abrir cerveja"
              >
                {`${row.original.beer.name} - ${row.original.beer.style}`}
              </Link>
            </Button>
          ),
        }),
    columnHelper.accessor('temperature', {
      header: 'Temp.',
      cell: ({ row }) => `${row.original.temperature} C`,
    }),
    columnHelper.accessor('ph', {
      header: 'pH',
      cell: ({ row }) => row.original.ph,
    }),
    columnHelper.accessor('extract', {
      header: 'Extrato',
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
    }),
  ]
}
