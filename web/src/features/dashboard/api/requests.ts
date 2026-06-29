import { api } from '@/lib/api'
import type { DashboardMetrics, FermentationHistory } from '@/types/api'

const resource = 'dashboard'

export function getDashboardMetrics() {
  return api.get(resource).json<DashboardMetrics>()
}

export function getFermentationHistory(batchNumber?: string) {
  return api
    .get(`${resource}/fermentation-history`, {
      searchParams: batchNumber ? { batchNumber } : undefined,
    })
    .json<FermentationHistory>()
}
