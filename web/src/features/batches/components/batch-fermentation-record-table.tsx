import { useQuery } from '@tanstack/react-query'
import type { PaginationState, SortingState } from '@tanstack/react-table'
import { getCoreRowModel, useReactTable } from '@tanstack/react-table'
import { useEffect, useState } from 'react'

import {
  DataTable,
  DataTableFilters,
  DataTableRoot,
} from '@/components/table/data-table'
import { Input } from '@/components/ui/input'
import { classificationLabels } from '@/features/fermentation-records/constants'
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

import { listBatchFermentationRecordsOptions } from '../api/options'
import { columns } from '../tables/batch-fermentation-record-columns'

type BatchFermentationRecordTableProps = {
  batchNumber: string
}

const items = [
  {
    label: 'Registro',
    value: 'registeredAt',
  },
  {
    label: 'Tanque',
    value: 'tankName',
  },
  {
    label: 'Temperatura',
    value: 'temperature',
  },
  {
    label: 'pH',
    value: 'ph',
  },
  {
    label: 'Extrato',
    value: 'extract',
  },
]

const classifications: Array<FermentationRecordClassification> = [
  'WITHIN_STANDARD',
  'ATTENTION',
  'OUT_OF_STANDARD',
]

export function BatchFermentationRecordTable({
  batchNumber,
}: BatchFermentationRecordTableProps) {
  const [sorting, setSorting] = useState<SortingState>([
    { id: 'registeredAt', desc: false },
  ])
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 20,
  })
  const [classification, setClassification] = useState('all')
  const [debouncedSearch, search, setSearch] = useDebouncedSearch()
  const [sort] = sorting

  useEffect(() => {
    setPagination((current) => ({ ...current, pageIndex: 0 }))
  }, [debouncedSearch, classification, sorting])

  const page = pagination.pageIndex + 1
  const limit = pagination.pageSize

  const { data: records, isFetching } = useQuery(
    listBatchFermentationRecordsOptions(batchNumber, {
      limit,
      page,
      search: debouncedSearch,
      sortBy: sort.id,
      sortDirection: sort.desc ? 'desc' : 'asc',
      classification: classification === 'all' ? undefined : classification,
    }),
  )

  const table = useReactTable({
    data: records?.data ?? [],
    columns,
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
          <FieldLabel htmlFor="batch-record-search">Buscar</FieldLabel>
          <Input
            id="batch-record-search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Busque por tanque ou observacao"
            className="max-w-sm"
          />
        </Field>
        <Field>
          <FieldLabel htmlFor="batch-record-classification">
            Classificação
          </FieldLabel>
          <Select value={classification} onValueChange={setClassification}>
            <SelectTrigger
              id="batch-record-classification"
              className="max-w-sm min-w-44"
            >
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
          <FieldLabel htmlFor="batch-record-sort">Ordenar por</FieldLabel>
          <Select
            value={sort.id}
            onValueChange={(value) =>
              setSorting(([current]) => [{ ...current, id: value }])
            }
          >
            <SelectTrigger id="batch-record-sort" className="max-w-sm min-w-32">
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
      </DataTableFilters>
      <DataTable table={table} isFetching={isFetching} />
    </DataTableRoot>
  )
}
