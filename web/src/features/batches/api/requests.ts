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
  const { search, sortBy, sortDirection, ...pageParams } = pagination
  const searchParams = {
    ...pageParams,
    ...(search?.trim() ? { search: search.trim() } : {}),
    ...(sortBy ? { sortBy } : {}),
    ...(sortDirection ? { sortDirection } : {}),
  }

  return api
    .get(resource, { searchParams })
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
  const { search, sortBy, sortDirection, classification, ...pageParams } =
    pagination
  const searchParams = {
    ...pageParams,
    ...(search?.trim() ? { search: search.trim() } : {}),
    ...(sortBy ? { sortBy } : {}),
    ...(sortDirection ? { sortDirection } : {}),
    ...(classification ? { classification } : {}),
  }

  return api
    .get(`${resource}/${encodeURIComponent(batchNumber)}/fermentation-records`, {
      searchParams,
    })
    .json<Paginated<BatchFermentationRecord>>()
}
