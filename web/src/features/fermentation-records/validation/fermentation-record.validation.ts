import { formOptions } from '@tanstack/react-form'
import z from 'zod'

import type { FermentationRecord } from '@/types/api'

function toDatetimeLocalValue(value?: string) {
  if (!value) {
    return new Date().toISOString().slice(0, 16)
  }

  return new Date(value).toISOString().slice(0, 16)
}

export const fermentationRecordSchema = z.object({
  registeredAt: z.string().min(1),
  beerId: z.guid(),
  tankId: z.guid(),
  batchNumber: z.string().min(1),
  temperature: z.coerce.number<number>(),
  ph: z.coerce.number<number>().positive(),
  extract: z.coerce.number<number>().nonnegative(),
  notes: z.string(),
})

export type FermentationRecordSchema = z.infer<
  typeof fermentationRecordSchema
>

const fermentationRecordDefaultValues: FermentationRecordSchema = {
  registeredAt: toDatetimeLocalValue(),
  beerId: '',
  tankId: '',
  batchNumber: '',
  temperature: 0,
  ph: 0,
  extract: 0,
  notes: '',
}

export const fermentationRecordFormOptions = (
  record?: FermentationRecord,
) =>
  formOptions({
    defaultValues: record
      ? {
          registeredAt: toDatetimeLocalValue(record.registeredAt),
          beerId: record.beerId,
          tankId: record.tankId,
          batchNumber: record.batchNumber,
          temperature: record.temperature,
          ph: record.ph,
          extract: record.extract,
          notes: record.notes ?? '',
        }
      : fermentationRecordDefaultValues,
    validators: { onSubmit: fermentationRecordSchema },
  })
