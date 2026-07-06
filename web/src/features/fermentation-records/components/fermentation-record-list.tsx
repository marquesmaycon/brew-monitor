import { useQuery } from '@tanstack/react-query'
import type { PaginationState, SortingState } from '@tanstack/react-table'
import { getCoreRowModel, useReactTable } from '@tanstack/react-table'
import { useState } from 'react'

import { Input } from '@/components/ui/input'
import {
  DataTable,
  DataTableFilters,
  DataTableRoot,
} from '#/components/table/data-table'
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
import type { FermentationRecordClassification } from '#/types/api'

import { listFermentationRecordsOptions } from '../api/options'
import { classificationLabels } from '../constants'
import { columns } from '../tables/fermentation-record-list-columns'

const items = [
  {
    label: 'Lote',
    value: 'batchNumber',
  },
  {
    label: 'Registro',
    value: 'registeredAt',
  },
]

const classifications: Array<FermentationRecordClassification> = [
  'WITHIN_STANDARD',
  'ATTENTION',
  'OUT_OF_STANDARD',
]

export function FermentationRecordList() {
  const [sorting, setSorting] = useState<SortingState>([
    { id: 'registeredAt', desc: true },
  ])
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 20,
  })
  const [classification, setClassification] = useState('all')
  const [debouncedSearch, search, setSearch] = useDebouncedSearch()
  const [sort] = sorting

  const { data: records, isFetching } = useQuery(
    listFermentationRecordsOptions({
      limit: pagination.pageSize,
      page: pagination.pageIndex + 1,
      search: debouncedSearch,
      sortBy: sort.id,
      sortDirection: sort.desc ? 'desc' : 'asc',
      classification: classification === 'all' ? undefined : classification,
    }),
  )

  const table = useReactTable({
    data: records?.data ?? [],
    columns: columns,
    rowCount: records?.meta.total,
    state: { pagination, sorting },
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting,
    manualPagination: true,
    manualSorting: true,
  })

  return (
    <DataTableRoot>
      <DataTableFilters>
        <Field>
          <FieldLabel htmlFor="search">Buscar</FieldLabel>
          <Input
            id="search"
            placeholder="Busque por lote"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            className="max-w-sm"
          />
        </Field>
        <Field>
          <FieldLabel htmlFor="classification">Classificação</FieldLabel>
          <Select value={classification} onValueChange={setClassification}>
            <SelectTrigger id="classification" className="max-w-sm min-w-44">
              <SelectValue placeholder="Selecione a classificação" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="all">Todas</SelectItem>
                {classifications.map((item) => (
                  <SelectItem key={item} value={item}>
                    {classificationLabels[item]}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
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
