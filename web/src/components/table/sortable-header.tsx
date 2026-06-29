import type { HeaderContext } from '@tanstack/react-table'
import { ArrowUpDown } from 'lucide-react'

import { Button } from '../ui/button'

export const sortableHeader = (label: string) =>
  function Header<TData, TValue>({ column }: HeaderContext<TData, TValue>) {
    return (
      <div className="flex items-center gap-2">
        {label}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          <ArrowUpDown />
        </Button>
      </div>
    )
  }
