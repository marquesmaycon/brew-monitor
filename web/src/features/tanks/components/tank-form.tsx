import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'
import { toast } from 'sonner'

import { Field, FieldGroup } from '@/components/ui/field'
import { useAppForm } from '@/hooks/form'
import type { Tank } from '@/types/api'

import {
  createTankOptions,
  listTanksOptions,
  updateTankOptions,
} from '../api/options'
import { tankFormOptions } from '../validation/tank.validation'

type TankFormProps = {
  tank?: Tank
}

export function TankForm({ tank }: TankFormProps) {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const isEditing = Boolean(tank)

  const { mutateAsync: create } = useMutation(createTankOptions())
  const { mutateAsync: update } = useMutation(updateTankOptions(tank?.id ?? ''))

  const form = useAppForm({
    ...tankFormOptions(tank),
    onSubmit: async ({ value }) => {
      try {
        if (tank) {
          await update(value)
        } else {
          await create(value)
        }

        toast.success(
          `Tanque ${isEditing ? 'atualizado' : 'criado'} com sucesso`,
        )

        await queryClient.invalidateQueries(listTanksOptions())
        await navigate({ to: '/tanks' })
      } catch (err) {
        toast.error(`Erro ao ${isEditing ? 'atualizar' : 'criar'} tanque`, {
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
        <form.AppField name="name">
          {({ InputField }) => (
            <InputField
              label="Nome"
              type="text"
              placeholder="Ex.: Tanque 01"
            />
          )}
        </form.AppField>
        <form.AppField name="capacityLiters">
          {({ InputField }) => (
            <InputField
              label="Capacidade (litros)"
              type="number"
              min={1}
              step={1}
              placeholder="Ex.: 1000"
            />
          )}
        </form.AppField>
        <Field>
          <form.AppForm>
            <form.SubmitButton
              label={isEditing ? 'Atualizar tanque' : 'Criar tanque'}
            />
          </form.AppForm>
        </Field>
      </FieldGroup>
    </form>
  )
}
