import { useQuery } from '@tanstack/react-query'
import type { PaginationState, SortingState } from '@tanstack/react-table'
import { getCoreRowModel, useReactTable } from '@tanstack/react-table'
import { useState } from 'react'

import {
  DataTable,
  DataTableFilters,
  DataTableRoot,
} from '#/components/table/data-table'
import { ButtonGroup } from '#/components/ui/button-group'
import { Field, FieldLabel } from '#/components/ui/field'
import { Input } from '#/components/ui/input'
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

import { listBeersOptions } from '../api/options'
import { columns } from '../tables/beer-list-columns'

const items = [
  {
    label: 'Nome',
    value: 'name',
  },
  {
    label: 'Estilo',
    value: 'style',
  },
  {
    label: 'Criado em',
    value: 'createdAt',
  },
]

export function BeerList() {
  const [sorting, setSorting] = useState<SortingState>([
    { id: 'name', desc: false },
  ])
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 20,
  })
  const [debouncedSearch, search, setSearch] = useDebouncedSearch()
  const [sort] = sorting

  const { data: beers, isFetching } = useQuery(
    listBeersOptions({
      limit: pagination.pageSize,
      page: pagination.pageIndex + 1,
      search: debouncedSearch,
      sortBy: sort.id,
      sortDirection: sort.desc ? 'desc' : 'asc',
    }),
  )

  const table = useReactTable({
    columns,
    data: beers?.data ?? [],
    rowCount: beers?.meta.total,
    state: { pagination, sorting },
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting,
    manualPagination: true,
    manualSorting: true,
    debugTable: true,
  })

  return (
    <DataTableRoot>
      <DataTableFilters>
        <Field>
          <FieldLabel htmlFor="search">Ordenar por</FieldLabel>
          <Input
            id="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Busque por nome ou estilo"
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
              <SelectValue placeholder="Selecione a ordenação" />
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
          <FieldLabel>Direção</FieldLabel>
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
      </DataTableFilters>
      <DataTable table={table} isFetching={isFetching} />
    </DataTableRoot>
  )
}

