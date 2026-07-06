import type { Beer } from './beers'
import type { EntityTimestamps } from './common'
import type { Tank } from './tanks'

export type FermentationRecordClassification =
  'WITHIN_STANDARD' | 'ATTENTION' | 'OUT_OF_STANDARD'

export type FermentationRecordBeer = Pick<
  Beer,
  'id' | 'name' | 'style' | 'fermentationParameter'
>

export type FermentationRecordTank = Pick<
  Tank,
  'id' | 'name' | 'capacityLiters'
>

export type FermentationRecord = EntityTimestamps & {
  id: string
  registeredAt: string
  beerId: string
  beer: FermentationRecordBeer
  tankId: string
  tank: FermentationRecordTank
  batchNumber: string
  temperature: number
  ph: number
  extract: number
  notes: string | null
  classification: FermentationRecordClassification
}

export type FermentationRecordPayload = Pick<
  FermentationRecord,
  | 'registeredAt'
  | 'beerId'
  | 'tankId'
  | 'batchNumber'
  | 'temperature'
  | 'ph'
  | 'extract'
  | 'notes'
>
