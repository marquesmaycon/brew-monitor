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

export type EntityTimestamps = {
  createdAt: string
  updatedAt: string | null
}

export type Beer = EntityTimestamps & {
  id: string
  name: string
  style: string
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

export type FermentationParameterPayload = Omit<
  FermentationParameter,
  'id' | 'beerId' | keyof EntityTimestamps
>

export type FermentationRecordClassification =
  'WithinStandard' | 'Attention' | 'OutOfStandard'

export type FermentationRecord = EntityTimestamps & {
  id: string
  registeredAt: string
  beerId: string
  tankId: string
  batchNumber: string
  temperature: number
  ph: number
  extract: number
  notes: string | null
  classification: FermentationRecordClassification
}

export type FermentationRecordPayload = Omit<
  FermentationRecord,
  'id' | keyof EntityTimestamps
>
