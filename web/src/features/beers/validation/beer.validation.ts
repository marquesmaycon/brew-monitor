import { formOptions } from '@tanstack/react-form'
import z from 'zod'

export const beerSchema = z.object({
  name: z
    .string('O nome deve ser um texto')
    .trim()
    .min(2, 'O nome deve ter pelo menos 2 caracteres')
    .max(120, 'O nome deve ter no máximo 120 caracteres'),
  style: z
    .string('O estilo deve ser um texto')
    .trim()
    .min(3, 'O estilo deve ter pelo menos 3 caracteres')
    .max(80, 'O estilo deve ter no máximo 80 caracteres'),
})

export type BeerSchema = z.infer<typeof beerSchema>

const beerDefaultValues: BeerSchema = {
  name: '',
  style: '',
}

export const beerFormOptions = (beer?: BeerSchema) =>
  formOptions({
    defaultValues: beer ?? beerDefaultValues,
    validators: { onSubmit: beerSchema },
  })
