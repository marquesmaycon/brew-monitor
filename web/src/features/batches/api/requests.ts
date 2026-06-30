import { api } from '@/lib/api'
import type { Batch, BatchDetail } from '@/types/api'

const resource = 'batches'

export function listBatches() {
  return api.get(resource).json<Array<Batch>>()
}

export function getBatch(batchNumber: string) {
  return api
    .get(`${resource}/${encodeURIComponent(batchNumber)}`)
    .json<BatchDetail>()
}
