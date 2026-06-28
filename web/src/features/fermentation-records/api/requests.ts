import { api } from '@/lib/api'
import type {
  FermentationRecord,
  FermentationRecordPayload,
} from '@/types/api'

const resource = 'fermentation-records'

export function listFermentationRecords() {
  return api.get(resource).json<Array<FermentationRecord>>()
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
