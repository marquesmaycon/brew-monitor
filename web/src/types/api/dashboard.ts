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
