import { formOptions } from '@tanstack/react-form'
import z from 'zod'

export const tankSchema = z.object({
  name: z.string().min(2),
  capacityLiters: z.coerce.number<number>().positive(),
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
