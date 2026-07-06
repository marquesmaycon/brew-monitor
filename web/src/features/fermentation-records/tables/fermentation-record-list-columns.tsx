import { Link } from '@tanstack/react-router'
import { createColumnHelper } from '@tanstack/react-table'
import { SquarePen } from 'lucide-react'

import { sortableHeader } from '#/components/table/sortable-header'
import { Badge } from '#/components/ui/badge'
import { Button } from '#/components/ui/button'
import { formatDateTime } from '#/lib/date-format'
import type { FermentationRecord } from '#/types/api'

import {
  classificationClasses,
  classificationLabels,
  getClassificationIcon,
} from '../constants'

const columnHelper = createColumnHelper<FermentationRecord>()

export const columns = [
  columnHelper.accessor('batchNumber', {
    header: sortableHeader('Lote'),
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
    header: sortableHeader('Registro'),
    cell: ({ row }) => formatDateTime(row.original.registeredAt),
  }),
  columnHelper.accessor('beer.name', {
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
    enableSorting: false,
  }),
  columnHelper.accessor('tank.name', {
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
    enableSorting: false,
  }),
  columnHelper.accessor('temperature', {
    header: 'Temp.',
    cell: (info) => `${info.row.original.temperature} ºC`,
    enableSorting: false,
  }),
  columnHelper.accessor('ph', {
    header: 'pH',
    cell: (info) => info.row.original.ph,
    enableSorting: false,
  }),
  columnHelper.accessor('extract', {
    header: 'Extrato',
    cell: (info) => `${info.row.original.extract} ºP`,
    enableSorting: false,
  }),
  columnHelper.accessor('classification', {
    header: 'Classificação',
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
    enableSorting: false,
  }),
  columnHelper.display({
    id: 'actions',
    header: () => <div className="text-right">Ações</div>,
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
