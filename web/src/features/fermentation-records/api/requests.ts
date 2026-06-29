import { api } from '@/lib/api'
import type {
  FermentationRecord,
  FermentationRecordPayload,
  Paginated,
  Pagination,
} from '@/types/api'

const resource = 'fermentation-records'

export function listFermentationRecords(pagination: Pagination) {
  return api
    .get(resource, { searchParams: pagination })
    .json<Paginated<FermentationRecord>>()
}

export function getFermentationRecord(id: string) {
  return api.get(`${resource}/${id}`).json<FermentationRecord>()
}

export function createFermentationRecord(record: FermentationRecordPayload) {
  return api.post(resource, { json: record }).json<FermentationRecord>()
}

export function updateFermentationRecord(
  id: string,
  record: FermentationRecordPayload,
) {
  return api.put(`${resource}/${id}`, { json: record }).json<FermentationRecord>()
}

export function deleteFermentationRecord(id: string) {
  return api.delete(`${resource}/${id}`)
}
