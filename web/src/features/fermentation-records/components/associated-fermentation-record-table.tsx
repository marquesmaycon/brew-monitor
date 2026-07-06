import { keepPreviousData, useQuery } from '@tanstack/react-query'
import type { PaginationState, SortingState } from '@tanstack/react-table'
import { getCoreRowModel, useReactTable } from '@tanstack/react-table'
import { useEffect, useMemo, useState } from 'react'

import { DataTable } from '@/components/table/data-table'
import { Input } from '@/components/ui/input'
import { beerKeys } from '@/features/beers/api/options'
import { listBeerFermentationRecords } from '@/features/beers/api/requests'
import { tankKeys } from '@/features/tanks/api/options'
import { listTankFermentationRecords } from '@/features/tanks/api/requests'
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
import type { FermentationRecordClassification, Pagination } from '#/types/api'

import { classificationLabels } from '../constants'
import type { AssociatedFermentationRecordEntityType } from '../tables/associated-fermentation-record-columns'
import { buildAssociatedFermentationRecordColumns } from '../tables/associated-fermentation-record-columns'

type AssociatedFermentationRecordTableProps = {
  entityId: string
  entityType: AssociatedFermentationRecordEntityType
}

const items = [
  {
    label: 'Registro',
    value: 'registeredAt',
  },
  {
    label: 'Lote',
    value: 'batchNumber',
  },
]

const classifications: Array<FermentationRecordClassification> = [
  'WITHIN_STANDARD',
  'ATTENTION',
  'OUT_OF_STANDARD',
]

export function AssociatedFermentationRecordTable({
  entityId,
  entityType,
}: AssociatedFermentationRecordTableProps) {
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

  useEffect(() => {
    setPagination((current) => ({ ...current, pageIndex: 0 }))
  }, [debouncedSearch, classification, sorting])

  const page = pagination.pageIndex + 1
  const limit = pagination.pageSize
  const paginationParams: Pagination = {
    limit,
    page,
    search: debouncedSearch,
    sortBy: sort.id,
    sortDirection: sort.desc ? 'desc' : 'asc',
    classification: classification === 'all' ? undefined : classification,
  }

  const queryKey =
    entityType === 'beer'
      ? beerKeys.fermentationRecords(entityId, paginationParams)
      : tankKeys.fermentationRecords(entityId, paginationParams)

  const { data: records, isFetching } = useQuery({
    queryKey,
    queryFn: function () {
      return entityType === 'beer'
        ? listBeerFermentationRecords(entityId, paginationParams)
        : listTankFermentationRecords(entityId, paginationParams)
    },
    placeholderData: keepPreviousData,
  })
  const columns = useMemo(
    () => buildAssociatedFermentationRecordColumns(entityType),
    [entityType],
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
    <section className="flex w-full flex-col gap-4">
      <div>
        <h2 className="text-xl font-semibold">Registros associados</h2>
        <p className="text-muted-foreground text-sm">
          Historico fermentativo vinculado a este cadastro.
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-4 sm:flex-nowrap">
        <Field>
          <FieldLabel htmlFor={`${entityType}-record-search`}>
            Buscar
          </FieldLabel>
          <Input
            id={`${entityType}-record-search`}
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder={
              entityType === 'beer'
                ? 'Busque por lote ou tanque'
                : 'Busque por lote, cerveja ou estilo'
            }
            className="max-w-sm"
          />
        </Field>
        <Field>
          <FieldLabel htmlFor={`${entityType}-record-classification`}>
            Classificacao
          </FieldLabel>
          <Select value={classification} onValueChange={setClassification}>
            <SelectTrigger
              id={`${entityType}-record-classification`}
              className="max-w-sm min-w-44"
            >
              <SelectValue placeholder="Selecione a classificacao" />
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
          <FieldLabel htmlFor={`${entityType}-record-sort`}>
            Ordenar por
          </FieldLabel>
          <Select
            value={sort.id}
            onValueChange={(value) =>
              setSorting(([current]) => [{ ...current, id: value }])
            }
          >
            <SelectTrigger
              id={`${entityType}-record-sort`}
              className="max-w-sm min-w-32"
            >
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
    </section>
  )
}
