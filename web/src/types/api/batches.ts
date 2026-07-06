import type {
  FermentationRecord,
  FermentationRecordClassification,
} from './fermentation-records'

export type Batch = {
  batchNumber: string
  beerId: string
  beerName: string
  beerStyle: string
  fermentationRecordCount: number
}

export type BatchFermentationRecord = Pick<
  FermentationRecord,
  | 'id'
  | 'registeredAt'
  | 'temperature'
  | 'ph'
  | 'extract'
  | 'notes'
  | 'classification'
  | 'tankId'
> & {
  tankName: string
  tankCapacityLiters: number
}

export type BatchFermentationMetricPoint = Pick<
  FermentationRecord,
  'registeredAt' | 'temperature' | 'ph' | 'extract'
>

export type BatchClassificationCount = {
  classification: FermentationRecordClassification
  count: number
}

export type BatchOverview = Pick<
  Batch,
  'batchNumber' | 'beerId' | 'beerName' | 'beerStyle'
> & {
  metricPoints: Array<BatchFermentationMetricPoint>
  classificationCounts: Array<BatchClassificationCount>
}
