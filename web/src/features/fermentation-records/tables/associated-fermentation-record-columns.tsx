import { Link } from '@tanstack/react-router'
import { createColumnHelper } from '@tanstack/react-table'
import { SquarePen } from 'lucide-react'

import { sortableHeader } from '@/components/table/sortable-header'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { formatDateTime } from '@/lib/date-format'
import type { FermentationRecord } from '@/types/api'

import {
  classificationClasses,
  classificationLabels,
  getClassificationIcon,
} from '../constants'

export type AssociatedFermentationRecordEntityType = 'beer' | 'tank'

const columnHelper = createColumnHelper<FermentationRecord>()

/**
 * Constrói a definição de colunas da tabela de registros associados.
 * Alterna dinamicamente a exibição da coluna de relacionamento (mostrando o Tanque caso a entidade pai
 * seja uma Cerveja, ou a Cerveja caso a entidade pai seja um Tanque) para evitar redundâncias na tela.
 */
export function buildAssociatedFermentationRecordColumns(
  entityType: AssociatedFermentationRecordEntityType,
) {
  return [
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
    entityType === 'beer'
      ? columnHelper.accessor('tank.name', {
          header: 'Tanque',
          enableSorting: false,
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
          enableSorting: false,
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
      enableSorting: false,
    }),
    columnHelper.accessor('ph', {
      header: 'pH',
      cell: ({ row }) => row.original.ph,
      enableSorting: false,
    }),
    columnHelper.accessor('extract', {
      header: 'Extrato',
      cell: ({ row }) => `${row.original.extract} P`,
      enableSorting: false,
    }),
    columnHelper.accessor('classification', {
      header: 'Classificação',
      enableSorting: false,
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
      header: () => <div className="text-right">Ações</div>,
      enableSorting: false,
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
