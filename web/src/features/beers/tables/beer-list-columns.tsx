import { Link } from '@tanstack/react-router'
import { createColumnHelper } from '@tanstack/react-table'
import { SquarePen } from 'lucide-react'

import { sortableHeader } from '@/components/table/sortable-header'
import { Button } from '@/components/ui/button'
import { formatDate } from '@/lib/date-format'
import type { Beer } from '@/types/api'

const columnHelper = createColumnHelper<Beer>()

export const columns = [
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
    cell: ({ row }) => formatDate(row.original.createdAt),
  }),
  columnHelper.accessor('fermentationParameter', {
    header: () => 'Parâmetros (Temperatura | PH | Extrato)',
    cell: ({ row }) => {
      const params = row.original.fermentationParameter
      const temp = `${params?.minTemperature} - ${params?.maxTemperature}`
      const pH = `${params?.minPh} - ${params?.maxPh}`
      const extract = `${params?.minExtract} - ${params?.maxExtract}`

      return (
        <Button asChild variant="link" aria-label="Editar parâmetros">
          <Link
            to="/beers/$beerId/parameters"
            params={{ beerId: row.original.id }}
            title="Editar parâmetros"
          >
            {temp} | {pH} | {extract}
            <span className="sr-only">Editar parâmetros</span>
          </Link>
        </Button>
      )
    },
    enableSorting: false,
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
