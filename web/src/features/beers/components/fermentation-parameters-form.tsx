import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'
import { toast } from 'sonner'

import { Field, FieldGroup } from '@/components/ui/field'
import { useAppForm } from '@/hooks/form'
import type {
  FermentationParameter,
  FermentationParameterPayload,
} from '@/types/api'

import {
  beerKeys,
  createBeerFermentationParameterOptions,
  listBeersOptions,
  updateBeerFermentationParameterOptions,
} from '../api/options'
import type { FermentationParametersSchema } from '../validation/fermentation-parameters.validation'
import { fermentationParametersFormOptions } from '../validation/fermentation-parameters.validation'

type FermentationParametersFormProps = {
  beerId: string
  parameters?: FermentationParameter
}

export function FermentationParametersForm({
  beerId,
  parameters,
}: FermentationParametersFormProps) {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const isEditing = Boolean(parameters)

  const form = useAppForm({
    ...fermentationParametersFormOptions(parameters),
    onSubmit: async ({ value }) => {
      try {
        if (parameters) {
          await update(toPayload(value))
        } else {
          await create(toPayload(value))
        }

        toast.success(
          `Parametros de fermentacao ${
            isEditing ? 'atualizados' : 'criados'
          } com sucesso`,
        )

        await queryClient.invalidateQueries(listBeersOptions())
        await queryClient.invalidateQueries({
          queryKey: beerKeys.fermentationParameter(beerId),
        })
        await queryClient.invalidateQueries({
          queryKey: beerKeys.detail(beerId),
        })
        await navigate({ to: '/beers' })
      } catch (err) {
        toast.error(
          `Erro ao ${
            isEditing ? 'atualizar' : 'criar'
          } parametros de fermentacao`,
          { description: err instanceof Error && err.message },
        )
      }
    },
  })

  const { mutateAsync: create } = useMutation(
    createBeerFermentationParameterOptions(beerId),
  )
  const { mutateAsync: update } = useMutation(
    updateBeerFermentationParameterOptions(beerId),
  )

  return (
    <form
      className="w-full lg:max-w-3xl"
      onSubmit={(ev) => {
        ev.preventDefault()
        form.handleSubmit()
      }}
    >
      <FieldGroup>
        <div className="grid gap-4 sm:grid-cols-2">
          <form.AppField name="minTemperature">
            {({ InputField }) => (
              <InputField
                label="Temperatura minima"
                type="number"
                step="0.1"
                min="0"
                placeholder="Ex.: 18"
              />
            )}
          </form.AppField>
          <form.AppField name="maxTemperature">
            {({ InputField }) => (
              <InputField
                label="Temperatura maxima"
                type="number"
                step="0.1"
                min="0"
                placeholder="Ex.: 22"
              />
            )}
          </form.AppField>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <form.AppField name="minPh">
            {({ InputField }) => (
              <InputField
                label="pH minimo"
                type="number"
                step="0.01"
                min="0"
                max="14"
                placeholder="Ex.: 4.1"
              />
            )}
          </form.AppField>
          <form.AppField name="maxPh">
            {({ InputField }) => (
              <InputField
                label="pH maximo"
                type="number"
                step="0.01"
                min="0"
                max="14"
                placeholder="Ex.: 4.6"
              />
            )}
          </form.AppField>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <form.AppField name="minExtract">
            {({ InputField }) => (
              <InputField
                label="Extrato minimo"
                type="number"
                step="0.1"
                min="0"
                placeholder="Ex.: 2.5"
              />
            )}
          </form.AppField>
          <form.AppField name="maxExtract">
            {({ InputField }) => (
              <InputField
                label="Extrato maximo"
                type="number"
                step="0.1"
                min="0"
                placeholder="Ex.: 4"
              />
            )}
          </form.AppField>
        </div>
        <Field>
          <form.AppForm>
            <form.SubmitButton
              label={isEditing ? 'Atualizar parametros' : 'Criar parametros'}
            />
          </form.AppForm>
        </Field>
      </FieldGroup>
    </form>
  )
}

function toPayload(
  values: FermentationParametersSchema,
): FermentationParameterPayload {
  return {
    minTemperature: Number(values.minTemperature),
    maxTemperature: Number(values.maxTemperature),
    minPh: Number(values.minPh),
    maxPh: Number(values.maxPh),
    minExtract: Number(values.minExtract),
    maxExtract: Number(values.maxExtract),
  }
}
