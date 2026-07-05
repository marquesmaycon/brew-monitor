import { formOptions } from '@tanstack/react-form'
import z from 'zod'

export const tankSchema = z.object({
  name: z
    .string('O nome deve ser um texto')
    .trim()
    .min(2, 'O nome deve ter pelo menos 2 caracteres')
    .max(120, 'O nome deve ter no maximo 120 caracteres'),
  capacityLiters: z.coerce
    .number<number>('A capacidade deve ser um número')
    .positive('A capacidade deve ser maior que zero'),
})

export type TankSchema = z.infer<typeof tankSchema>

const tankDefaultValues: TankSchema = {
  name: '',
  capacityLiters: 0,
}

export const tankFormOptions = (tank?: TankSchema) =>
  formOptions({
    defaultValues: tank ?? tankDefaultValues,
    validators: { onSubmit: tankSchema },
  })
