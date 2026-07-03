import { useMutation } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'

import { Field, FieldGroup } from '@/components/ui/field'
import { useAppForm } from '@/hooks/form'
import type { Beer } from '@/types/api'

import { createBeerOptions, updateBeerOptions } from '../api/options'
import { beerFormOptions } from '../validation/beer.validation'

type BeerFormProps = {
  beer?: Beer
}

export function BeerForm({ beer }: BeerFormProps) {
  const navigate = useNavigate()
  const isEditing = Boolean(beer)

  const form = useAppForm({
    ...beerFormOptions(beer),
    onSubmit: async ({ value }) => {
      if (beer) {
        await update(value)
      } else {
        await create(value)
      }

      await navigate({ to: '/beers' })
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
