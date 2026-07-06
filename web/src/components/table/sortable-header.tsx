import type { HeaderContext } from '@tanstack/react-table'
import { ArrowDownAz, ArrowUpAz, ArrowUpDown } from 'lucide-react'

import { cn } from '@/lib/utils'

import { Button } from '../ui/button'

export const sortableHeader = (label: string) =>
  function Header<TData, TValue>({ column }: HeaderContext<TData, TValue>) {
    const sort = column.getIsSorted()

    const Icon =
      sort === 'asc' ? ArrowDownAz : sort === 'desc' ? ArrowUpAz : ArrowUpDown

    return (
      <Button
        variant="ghost"
        className={cn(
          'group gap-1.5',
          !!sort && 'dark:text-primary text-secondary font-semibold',
        )}
        aria-label={
          sort
            ? `${label}, ordenado ${sort === 'asc' ? 'ascendente' : 'descendente'}`
            : `${label}, ordenar coluna`
        }
        onClick={() => column.toggleSorting(sort === 'asc')}
      >
        <span>{label}</span>
        <Icon
          className={cn(
            'size-4 transition-opacity',
            sort
              ? 'opacity-100'
              : 'opacity-33 group-hover:opacity-75 group-focus-visible:opacity-75',
          )}
        />
      </Button>
    )
  }