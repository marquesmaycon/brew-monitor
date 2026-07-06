import { Link } from '@tanstack/react-router'
import { createColumnHelper } from '@tanstack/react-table'
import { SquarePen } from 'lucide-react'

import { sortableHeader } from '@/components/table/sortable-header'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  classificationClasses,
  classificationLabels,
  getClassificationIcon,
} from '@/features/fermentation-records/constants'
import { formatDateTime } from '@/lib/date-format'
import type { BatchFermentationRecord } from '@/types/api'

const columnHelper = createColumnHelper<BatchFermentationRecord>()

export const columns = [
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
  }),
  columnHelper.accessor('notes', {
    header: 'Observações',
    cell: ({ row }) => (
      <span className="text-muted-foreground line-clamp-2 max-w-sm">
        {row.original.notes || '-'}
      </span>
    ),
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
