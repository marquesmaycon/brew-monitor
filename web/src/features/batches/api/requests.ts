import { api } from '@/lib/api'
import type { Batch, BatchDetail, Paginated, Pagination } from '@/types/api'

const resource = 'batches'

export function listBatches(pagination: Pagination) {
  return api
    .get(resource, { searchParams: pagination })
    .json<Paginated<Batch>>()
}

export function getBatch(batchNumber: string) {
  return api
    .get(`${resource}/${encodeURIComponent(batchNumber)}`)
    .json<BatchDetail>()
}
