import { useQuery } from '@tanstack/react-query'
import type { PaginationState, SortingState } from '@tanstack/react-table'
import { getCoreRowModel, useReactTable } from '@tanstack/react-table'
import { useEffect, useState } from 'react'

import { Input } from '@/components/ui/input'
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

import { listBatchesOptions } from '../api/options'
import { columns } from '../tables/batch-list-columns'

const items = [
  {
    label: 'Lote',
    value: 'batchNumber',
  },
  {
    label: 'Cerveja',
    value: 'beerName',
  },
  {
    label: 'Registros',
    value: 'fermentationRecordCount',
  },
]

export function BatchList() {
  const [sorting, setSorting] = useState<SortingState>([
    { id: 'batchNumber', desc: false },
  ])
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 20,
  })
  const [debouncedSearch, search, setSearch] = useDebouncedSearch()
  const [sort] = sorting

  useEffect(() => {
    setPagination((current) => ({ ...current, pageIndex: 0 }))
  }, [debouncedSearch, sorting])

  const page = pagination.pageIndex + 1
  const limit = pagination.pageSize

  const { data: batches, isFetching } = useQuery(
    listBatchesOptions({
      limit,
      page,
      search: debouncedSearch,
      sortBy: sort.id,
      sortDirection: sort.desc ? 'desc' : 'asc',
    }),
  )

  const table = useReactTable({
    data: batches?.data ?? [],
    columns,
    rowCount: batches?.meta.total,
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
            placeholder="Busque por lote, cerveja ou estilo"
            className="max-w-sm"
          />
        </Field>
        <Field>
          <FieldLabel htmlFor="sort">Ordenar por</FieldLabel>
          <Select
            value={sort.id}
            onValueChange={(value) =>
              setSorting(([current]) => [{ ...current, id: value }])
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
            onValueChange={(value) =>
              setSorting(([current]) => [
                { ...current, desc: value === 'desc' },
              ])
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
