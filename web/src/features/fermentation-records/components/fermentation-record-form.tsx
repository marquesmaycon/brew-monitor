import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'
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
import { fermentationRecordFormOptions } from '../validation/fermentation-record.validation'

type FermentationRecordFormProps = {
  record?: FermentationRecord
}

export function FermentationRecordForm({ record }: FermentationRecordFormProps) {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const isEditing = Boolean(record)

  const { data: beers } = useQuery(listBeersOptions({ limit: 100, page: 1 }))
  const { data: tanks } = useQuery(listTanksOptions({ limit: 100, page: 1 }))
  const { mutateAsync: create } = useMutation(createFermentationRecordOptions())
  const { mutateAsync: update } = useMutation(
    updateFermentationRecordOptions(record?.id ?? ''),
  )

  const form = useAppForm({
    ...fermentationRecordFormOptions(record),
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
        await navigate({ to: '/fermentation-records' })
      } catch (err) {
        toast.error(`Erro ao ${isEditing ? 'atualizar' : 'criar'} registro`, {
          description: err instanceof Error && err.message,
        })
      }
    },
  })

  return (
    <form
      className="w-full max-w-3xl"
      onSubmit={(ev) => {
        ev.preventDefault()
        form.handleSubmit()
      }}
    >
      <FieldGroup>
        <form.AppField name="registeredAt">
          {({ InputField }) => (
            <InputField label="Data e hora" type="datetime-local" />
          )}
        </form.AppField>
        <form.AppField name="beerId">
          {({ SelectField }) => (
            <SelectField
              label="Cerveja"
              placeholder="Selecione a cerveja"
              options={(beers?.data ?? []).map((beer) => ({
                label: `${beer.name} - ${beer.style}`,
                value: beer.id,
              }))}
            />
          )}
        </form.AppField>
        <form.AppField name="tankId">
          {({ SelectField }) => (
            <SelectField
              label="Tanque"
              placeholder="Selecione o tanque"
              options={(tanks?.data ?? []).map((tank) => ({
                label: `${tank.name} (${tank.capacityLiters} L)`,
                value: tank.id,
              }))}
            />
          )}
        </form.AppField>
        <form.AppField name="batchNumber">
          {({ InputField }) => (
            <InputField label="Lote" type="text" placeholder="Ex.: IPA-001" />
          )}
        </form.AppField>
        <div className="grid gap-4 sm:grid-cols-3">
          <form.AppField name="temperature">
            {({ InputField }) => (
              <InputField
                label="Temperatura (C)"
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
  )
}
