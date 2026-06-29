import { formOptions } from '@tanstack/react-form'
import z from 'zod'

import type { FermentationParameter } from '@/types/api'

export const fermentationParametersSchema = z
  .object({
    minTemperature: z.coerce.number<number>().min(0),
    maxTemperature: z.coerce.number<number>().min(0),
    minPh: z.coerce.number<number>().min(0).max(14),
    maxPh: z.coerce.number<number>().min(0).max(14),
    minExtract: z.coerce.number<number>().min(0),
    maxExtract: z.coerce.number<number>().min(0),
  })
  .refine((values) => values.minTemperature <= values.maxTemperature, {
    message: 'A temperatura minima deve ser menor ou igual a maxima',
    path: ['minTemperature'],
  })
  .refine((values) => values.minPh <= values.maxPh, {
    message: 'O pH minimo deve ser menor ou igual ao maximo',
    path: ['minPh'],
  })
  .refine((values) => values.minExtract <= values.maxExtract, {
    message: 'O extrato minimo deve ser menor ou igual ao maximo',
    path: ['minExtract'],
  })

export type FermentationParametersSchema = z.input<
  typeof fermentationParametersSchema
>

const fermentationParametersDefaultValues: FermentationParametersSchema = {
  minTemperature: 0,
  maxTemperature: 0,
  minPh: 0,
  maxPh: 0,
  minExtract: 0,
  maxExtract: 0,
}

export const fermentationParametersFormOptions = (
  parameters?: FermentationParameter,
) =>
  formOptions({
    defaultValues: parameters ?? fermentationParametersDefaultValues,
    validators: { onSubmit: fermentationParametersSchema },
  })
