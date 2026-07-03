import { api } from '@/lib/api'
import type {
  Batch,
  BatchFermentationRecord,
  BatchOverview,
  Paginated,
  Pagination,
} from '@/types/api'

const resource = 'batches'

export function listBatches(pagination: Pagination) {
  return api
    .get(resource, { searchParams: pagination })
    .json<Paginated<Batch>>()
}

export function getBatchOverview(batchNumber: string) {
  return api
    .get(`${resource}/${encodeURIComponent(batchNumber)}/overview`)
    .json<BatchOverview>()
}

export function listBatchFermentationRecords(
  batchNumber: string,
  pagination: Pagination,
) {
  return api
    .get(`${resource}/${encodeURIComponent(batchNumber)}/fermentation-records`, {
      searchParams: pagination,
    })
    .json<Paginated<BatchFermentationRecord>>()
}
