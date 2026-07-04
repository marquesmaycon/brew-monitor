import { useQuery } from '@tanstack/react-query'
import { Link } from '@tanstack/react-router'
import type { PaginationState, SortingState } from '@tanstack/react-table'
import {
  createColumnHelper,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table'
import { SquarePen } from 'lucide-react'
import { useState } from 'react'

import { sortableHeader } from '@/components/table/sortable-header'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { formatDate } from '@/lib/date-format'
import type { Tank } from '@/types/api'
import { DataTable } from '#/components/table/data-table'
import { ButtonGroup } from '#/components/ui/button-group'
import { Field, FieldLabel } from '#/components/ui/field'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '#/components/ui/select'
import { ToggleGroup, ToggleGroupItem } from '#/components/ui/toggle-group'
import { useDebouncedSearch } from '#/hooks/use-debounced-search'

import { listTanksOptions } from '../api/options'

const items = [
  {
    label: 'Nome',
    value: 'name',
  },
  {
    label: 'Capacidade',
    value: 'capacityLiters',
  },
  {
    label: 'Criado em',
    value: 'createdAt',
  },
]

export function TankList() {
  const [sorting, setSorting] = useState<SortingState>([
    { id: 'name', desc: false },
  ])
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 20,
  })
  const [debouncedSearch, search, setSearch] = useDebouncedSearch()
  const [sort] = sorting

  const { data: tanks, isFetching } = useQuery(
    listTanksOptions({
      limit: pagination.pageSize,
      page: pagination.pageIndex + 1,
      search: debouncedSearch,
      sortBy: sort.id,
      sortDirection: sort.desc ? 'desc' : 'asc',
    }),
  )

  const table = useReactTable({
    data: tanks?.data ?? [],
    columns,
    rowCount: tanks?.meta.total,
    state: { pagination, sorting },
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting,
    manualPagination: true,
    manualSorting: true,
  })

  return (
    <div className="flex flex-1 flex-col gap-4">
      <div className="flex flex-wrap items-center gap-4 sm:flex-nowrap">
        <Field>
          <FieldLabel htmlFor="search">Buscar</FieldLabel>
          <Input
            id="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Busque por nome ou capacidade"
            className="max-w-sm"
          />
        </Field>
        <Field>
          <FieldLabel htmlFor="sort">Ordenar por</FieldLabel>
          <Select
            value={sort.id}
            onValueChange={(value) =>
              setSorting(([p]) => [{ ...p, id: value }])
            }
          >
            <SelectTrigger id="sort" className="max-w-sm min-w-32">
              <SelectValue placeholder="Selecione a ordenacao" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {items.map((item) => (
                  <SelectItem key={item.value} value={item.value}>
                    {item.label}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </Field>
        <Field>
          <FieldLabel>Direcao</FieldLabel>
          <ToggleGroup
            type="single"
            onValueChange={(val) =>
              setSorting(([p]) => [{ ...p, desc: val === 'desc' }])
            }
            value={sort.desc ? 'desc' : 'asc'}
            variant="outline"
          >
            <ButtonGroup>
              <ToggleGroupItem value="desc">Desc</ToggleGroupItem>
              <ToggleGroupItem value="asc">Asc</ToggleGroupItem>
            </ButtonGroup>
          </ToggleGroup>
        </Field>
      </div>
      <DataTable table={table} isFetching={isFetching} />
    </div>
  )
}

const columnHelper = createColumnHelper<Tank>()

const columns = [
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
