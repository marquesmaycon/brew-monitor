import { Link } from '@tanstack/react-router'
import { createColumnHelper } from '@tanstack/react-table'
import { Eye } from 'lucide-react'

import { sortableHeader } from '@/components/table/sortable-header'
import { Button } from '@/components/ui/button'
import type { Batch } from '@/types/api'

const columnHelper = createColumnHelper<Batch>()

export const columns = [
  columnHelper.accessor('batchNumber', {
    header: sortableHeader('Lote'),
    cell: (info) => info.row.original.batchNumber,
  }),
  columnHelper.accessor('beerName', {
    header: sortableHeader('Cerveja'),
    cell: ({ row }) => (
      <Button asChild variant="link" className="px-0">
        <Link
          to="/beers/$beerId/edit"
          params={{ beerId: row.original.beerId }}
          aria-label="Abrir cerveja"
        >
          {`${row.original.beerName} - ${row.original.beerStyle}`}
        </Link>
      </Button>
    ),
  }),
  columnHelper.accessor('fermentationRecordCount', {
    header: sortableHeader('Registros'),
    cell: ({ row }) => row.original.fermentationRecordCount,
  }),
  columnHelper.display({
    id: 'actions',
    header: () => <div className="text-right">Ações</div>,
    cell: ({ row }) => (
      <div className="flex justify-end">
        <Button asChild variant="link" aria-label="Ver lote">
          <Link
            to="/batches/$batchNumber"
            params={{ batchNumber: row.original.batchNumber }}
            title="Ver lote"
          >
            <Eye />
            <span>Ver lote</span>
          </Link>
        </Button>
      </div>
    ),
    enableSorting: false,
    enableColumnFilter: false,
  }),
]
