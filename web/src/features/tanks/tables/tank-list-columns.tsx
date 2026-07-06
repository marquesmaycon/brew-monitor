import { Link } from '@tanstack/react-router'
import { createColumnHelper } from '@tanstack/react-table'
import { SquarePen } from 'lucide-react'

import { sortableHeader } from '@/components/table/sortable-header'
import { Button } from '@/components/ui/button'
import { formatDate } from '@/lib/date-format'
import type { Tank } from '@/types/api'

const columnHelper = createColumnHelper<Tank>()

export const columns = [
  columnHelper.accessor('name', {
    header: sortableHeader('Nome'),
    cell: (info) => info.row.original.name,
  }),
  columnHelper.accessor('capacityLiters', {
    header: sortableHeader('Capacidade'),
    cell: (info) => `${info.row.original.capacityLiters} L`,
  }),
  columnHelper.accessor('createdAt', {
    header: sortableHeader('Criado em'),
    cell: ({ row }) => formatDate(row.original.createdAt),
  }),
  columnHelper.display({
    id: 'actions',
    header: () => <div className="text-right">Ações</div>,
    cell: ({ row }) => (
      <div className="flex justify-end">
        <Button asChild variant="link" aria-label="Editar tanque">
          <Link
            to="/tanks/$tankId/edit"
            params={{ tankId: row.original.id }}
            title="Editar tanque"
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
