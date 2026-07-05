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
  registeredAt: z
    .string('A data e hora devem ser um texto')
    .min(1, 'Informe a data e hora'),
  beerId: z.guid('Selecione uma cerveja valida'),
  tankId: z.guid('Selecione um tanque valido'),
  batchNumber: z
    .string('O lote deve ser um texto')
    .trim()
    .min(1, 'Informe o lote')
    .max(80, 'O lote deve ter no maximo 80 caracteres'),
  temperature: z.coerce.number<number>('A temperatura deve ser um numero'),
  ph: z.coerce
    .number<number>('O pH deve ser um numero')
    .positive('O pH deve ser maior que zero'),
  extract: z.coerce
    .number<number>('O extrato deve ser um numero')
    .nonnegative('O extrato deve ser maior ou igual a zero'),
  notes: z
    .string('As observacoes devem ser um texto')
    .trim()
    .max(1000, 'As observacoes devem ter no maximo 1000 caracteres'),
})

export type FermentationRecordSchema = z.infer<typeof fermentationRecordSchema>

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

export const fermentationRecordFormOptions = (record?: FermentationRecord) =>
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
