import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'
import { toast } from 'sonner'

import { Field, FieldGroup } from '@/components/ui/field'
import { useAppForm } from '@/hooks/form'
import type { Beer } from '@/types/api'
import { getErrorDescription } from '#/lib/utils'

import {
  createBeerOptions,
  listBeersOptions,
  updateBeerOptions,
} from '../api/options'
import { beerFormOptions } from '../validation/beer.validation'

type BeerFormProps = {
  beer?: Beer
}

export function BeerForm({ beer }: BeerFormProps) {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const isEditing = Boolean(beer)

  const form = useAppForm({
    ...beerFormOptions(beer),
    onSubmit: async ({ value }) => {
      try {
        if (beer) {
          await update(value)
        } else {
          await create(value)
        }

        toast.success(
          `Cerveja ${isEditing ? 'atualizada' : 'criada'} com sucesso`,
        )

        await queryClient.invalidateQueries(listBeersOptions())
        await navigate({ to: '/beers' })
      } catch (err) {
        toast.error(
          `Erro ao ${isEditing ? 'atualizar' : 'criar'} nova cerveja`,
          { description: await getErrorDescription(err) },
        )
      }
    },
  })

  const { mutateAsync: create } = useMutation(createBeerOptions())
  const { mutateAsync: update } = useMutation(updateBeerOptions(beer?.id ?? ''))

  return (
    <form
      className="w-full max-w-3xl"
      onSubmit={(ev) => {
        ev.preventDefault()
        form.handleSubmit()
      }}
    >
      <FieldGroup>
        <form.AppField name="name">
          {({ InputField }) => (
            <InputField
              label="Nome"
              type="text"
              placeholder="Ex.: American IPA"
            />
          )}
        </form.AppField>
        <form.AppField name="style">
          {({ InputField }) => (
            <InputField
              label="Estilo"
              type="text"
              placeholder="Ex.: India Pale Ale"
            />
          )}
        </form.AppField>
        <Field>
          <form.AppForm>
            <form.SubmitButton
              label={isEditing ? 'Atualizar cerveja' : 'Criar cerveja'}
            />
          </form.AppForm>
        </Field>
      </FieldGroup>
    </form>
  )
}
