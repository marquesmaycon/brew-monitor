import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'
import { useEffect, useMemo, useState } from 'react'
import { toast } from 'sonner'

import { Field, FieldGroup } from '@/components/ui/field'
import { listBeersOptions } from '@/features/beers/api/options'
import { listTanksOptions } from '@/features/tanks/api/options'
import { useAppForm } from '@/hooks/form'
import type { FermentationRecord, FermentationRecordPayload } from '@/types/api'

import {
  createFermentationRecordOptions,
  fermentationRecordKeys,
  updateFermentationRecordOptions,
} from '../api/options'
import type { FermentationRecordSchema } from '../validation/fermentation-record.validation'
import { fermentationRecordFormOptions } from '../validation/fermentation-record.validation'

type FermentationRecordFormProps = {
  record?: FermentationRecord
  defaultValues?: Partial<FermentationRecordSchema>
  onSuccess?: () => Promise<void> | void
}

export function FermentationRecordForm({
  record,
  defaultValues,
  onSuccess,
}: FermentationRecordFormProps) {
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const [beerSearch, setBeerSearch] = useState('')
  const [debouncedBeerSearch, setDebouncedBeerSearch] = useState('')
  const [tankSearch, setTankSearch] = useState('')
  const [debouncedTankSearch, setDebouncedTankSearch] = useState('')

  const isEditing = Boolean(record)

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setDebouncedBeerSearch(beerSearch.trim())
    }, 300)

    return () => window.clearTimeout(timeoutId)
  }, [beerSearch])

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setDebouncedTankSearch(tankSearch.trim())
    }, 300)

    return () => window.clearTimeout(timeoutId)
  }, [tankSearch])

  const { data: beers, isFetching: isFetchingBeers } = useQuery(
    listBeersOptions({
      limit: 100,
      page: 1,
      search: debouncedBeerSearch || undefined,
    }),
  )
  const { data: tanks, isFetching: isFetchingTanks } = useQuery(
    listTanksOptions({
      limit: 100,
      page: 1,
      search: debouncedTankSearch || undefined,
    }),
  )
  const { mutateAsync: create } = useMutation(createFermentationRecordOptions())
  const { mutateAsync: update } = useMutation(
    updateFermentationRecordOptions(record?.id ?? ''),
  )
  const formOptions = fermentationRecordFormOptions(record)
  const isBeerReadonly = Boolean(defaultValues?.beerId)
  const isBatchReadonly = Boolean(defaultValues?.batchNumber)

  const beerOptions = useMemo(() => {
    const options = (beers?.data ?? []).map((beer) => ({
      label: beer.name,
      value: beer.id,
      description: beer.style,
    }))

    if (
      !record?.beer ||
      options.some((option) => option.value === record.beer.id)
    ) {
      return options
    }

    return [
      {
        label: record.beer.name,
        value: record.beer.id,
        description: record.beer.style,
      },
      ...options,
    ]
  }, [beers?.data, record?.beer])

  const tankOptions = useMemo(() => {
    const options = (tanks?.data ?? []).map((tank) => ({
      label: `${tank.name} (${tank.capacityLiters} L)`,
      value: tank.id,
    }))

    if (
      !record?.tank ||
      options.some((option) => option.value === record.tank.id)
    ) {
      return options
    }

    return [
      {
        label: `${record.tank.name} (${record.tank.capacityLiters} L)`,
        value: record.tank.id,
      },
      ...options,
    ]
  }, [record?.tank, tanks?.data])

  const form = useAppForm({
    ...formOptions,
    defaultValues: {
      ...formOptions.defaultValues,
      ...defaultValues,
    },
    onSubmit: async ({ value }) => {
      const payload: FermentationRecordPayload = {
        ...value,
        registeredAt: new Date(value.registeredAt).toISOString(),
        notes: value.notes.trim() || null,
      }

      try {
        if (record) {
          await update(payload)
        } else {
          await create(payload)
        }

        toast.success(
          `Registro ${isEditing ? 'atualizado' : 'criado'} com sucesso`,
        )

        await queryClient.invalidateQueries({
          queryKey: fermentationRecordKeys.root,
        })

        if (onSuccess) {
          await onSuccess()
        } else {
          await navigate({ to: '/fermentation-records' })
        }
      } catch (err) {
        toast.error(`Erro ao ${isEditing ? 'atualizar' : 'criar'} registro`, {
          description: err instanceof Error && err.message,
        })
      }
    },
  })

  return (
    <div className="flex w-full max-w-3xl flex-col gap-6">
      <form
        className="w-full"
        onSubmit={(ev) => {
          ev.preventDefault()
          form.handleSubmit()
        }}
      >
        <FieldGroup>
          <form.AppField name="registeredAt">
            {({ DateTimePickerField }) => (
              <DateTimePickerField label="Data e hora" />
            )}
          </form.AppField>
          <form.AppField name="beerId">
            {({ ComboboxField }) => (
              <ComboboxField
                label="Cerveja"
                placeholder="Busque por nome ou estilo"
                disabled={isBeerReadonly}
                emptyMessage="Nenhuma cerveja encontrada."
                isLoading={isFetchingBeers}
                onSearchChange={setBeerSearch}
                options={beerOptions}
                shouldFilter={false}
              />
            )}
          </form.AppField>
          <form.AppField name="tankId">
            {({ ComboboxField }) => (
              <ComboboxField
                label="Tanque"
                placeholder="Busque por nome do tanque"
                emptyMessage="Nenhum tanque encontrado."
                isLoading={isFetchingTanks}
                onSearchChange={setTankSearch}
                options={tankOptions}
                shouldFilter={false}
              />
            )}
          </form.AppField>
          <form.AppField name="batchNumber">
            {({ InputField }) => (
              <InputField
                label="Lote"
                type="text"
                placeholder="Ex.: IPA-001"
                readOnly={isBatchReadonly}
              />
            )}
          </form.AppField>
          <div className="grid gap-4 sm:grid-cols-3">
            <form.AppField name="temperature">
              {({ InputField }) => (
                <InputField
                  label="Temperatura"
                  type="number"
                  step="0.1"
                  placeholder="Ex.: 18.5"
                />
              )}
            </form.AppField>
            <form.AppField name="ph">
              {({ InputField }) => (
                <InputField
                  label="pH"
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="Ex.: 4.2"
                />
              )}
            </form.AppField>
            <form.AppField name="extract">
              {({ InputField }) => (
                <InputField
                  label="Extrato"
                  type="number"
                  min="0"
                  step="0.1"
                  placeholder="Ex.: 12.5"
                />
              )}
            </form.AppField>
          </div>
          <form.AppField name="notes">
            {({ TextareaField }) => (
              <TextareaField
                label="Observacoes"
                placeholder="Notas sobre a coleta, ajustes ou ocorrencias."
              />
            )}
          </form.AppField>
          <Field>
            <form.AppForm>
              <form.SubmitButton
                label={isEditing ? 'Atualizar registro' : 'Criar registro'}
              />
            </form.AppForm>
          </Field>
        </FieldGroup>
      </form>
    </div>
  )
}
