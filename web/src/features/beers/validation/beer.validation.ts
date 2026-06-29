import { formOptions } from '@tanstack/react-form'
import z from 'zod'

export const beerSchema = z.object({
  name: z.string().min(2),
  style: z.string().min(8),
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
