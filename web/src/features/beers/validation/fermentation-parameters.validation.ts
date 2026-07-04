import { formOptions } from '@tanstack/react-form'
import z from 'zod'

import type { FermentationParameter } from '@/types/api'

export const fermentationParametersSchema = z
  .object({
    minTemperature: z.coerce
      .number<number>('A temperatura mínima deve ser um número')
      .min(0, 'A temperatura mínima deve ser maior ou igual a zero'),
    maxTemperature: z.coerce
      .number<number>('A temperatura máxima deve ser um número')
      .min(0, 'A temperatura máxima deve ser maior ou igual a zero'),
    minPh: z.coerce
      .number<number>('O pH mínimo deve ser um número')
      .min(0, 'O pH mínimo deve ser maior ou igual a zero')
      .max(14, 'O pH mínimo deve ser menor ou igual a 14'),
    maxPh: z.coerce
      .number<number>('O pH máximo deve ser um número')
      .min(0, 'O pH máximo deve ser maior ou igual a zero')
      .max(14, 'O pH máximo deve ser menor ou igual a 14'),
    minExtract: z.coerce
      .number<number>('O extrato mínimo deve ser um número')
      .min(0, 'O extrato mínimo deve ser maior ou igual a zero'),
    maxExtract: z.coerce
      .number<number>('O extrato máximo deve ser um número')
      .min(0, 'O extrato máximo deve ser maior ou igual a zero'),
  })
  .refine((values) => values.minTemperature <= values.maxTemperature, {
    message: 'A temperatura mínima deve ser menor ou igual à máxima',
    path: ['minTemperature'],
  })
  .refine((values) => values.minPh <= values.maxPh, {
    message: 'O pH mínimo deve ser menor ou igual ao máximo',
    path: ['minPh'],
  })
  .refine((values) => values.minExtract <= values.maxExtract, {
    message: 'O extrato mínimo deve ser menor ou igual ao máximo',
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
