export type Pagination = {
  limit: number
  page: number
}

export type Paginated<T> = {
  data: Array<T>
  meta: {
    total: number
  }
}

export type DashboardMetrics = {
  totalFermentationRecords: number
  withinStandardRecords: number
  attentionRecords: number
  outOfStandardRecords: number
}

export type FermentationHistoryBatch = {
  batchNumber: string
  beerName: string
  beerStyle: string
  lastRegisteredAt: string
}

export type FermentationHistoryPoint = {
  registeredAt: string
  temperature: number
  ph: number
  extract: number
}

export type FermentationHistory = {
  selectedBatchNumber: string | null
  batches: Array<FermentationHistoryBatch>
  data: Array<FermentationHistoryPoint>
}

export type Batch = {
  batchNumber: string
  beerId: string
  beerName: string
  beerStyle: string
  fermentationRecordCount: number
}

export type EntityTimestamps = {
  createdAt: string
  updatedAt: string | null
}

export type Beer = EntityTimestamps & {
  id: string
  name: string
  style: string
  fermentationParameter: BeerFermentationParameter | null
}

export type BeerPayload = Pick<Beer, 'name' | 'style'>

export type Tank = EntityTimestamps & {
  id: string
  name: string
  capacityLiters: number
}

export type TankPayload = Pick<Tank, 'name' | 'capacityLiters'>

export type FermentationParameter = EntityTimestamps & {
  id: string
  beerId: string
  minTemperature: number
  maxTemperature: number
  minPh: number
  maxPh: number
  minExtract: number
  maxExtract: number
}

export type BeerFermentationParameter = Pick<
  FermentationParameter,
  | 'minTemperature'
  | 'maxTemperature'
  | 'minPh'
  | 'maxPh'
  | 'minExtract'
  | 'maxExtract'
>

export type FermentationParameterPayload = Omit<
  FermentationParameter,
  'id' | 'beerId' | keyof EntityTimestamps
>

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

export type BatchFermentationRecord = Pick<
  FermentationRecord,
  | 'id'
  | 'registeredAt'
  | 'temperature'
  | 'ph'
  | 'extract'
  | 'notes'
  | 'classification'
> & {
  tankName: string
  tankCapacityLiters: number
}

export type BatchDetail = Batch & {
  fermentationRecords: Array<BatchFermentationRecord>
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
