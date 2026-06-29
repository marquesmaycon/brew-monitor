import {
  keepPreviousData,
  mutationOptions,
  queryOptions,
} from '@tanstack/react-query'

import type { FermentationRecordPayload, Pagination } from '@/types/api'

import {
  createFermentationRecord,
  deleteFermentationRecord,
  getFermentationRecord,
  listFermentationRecords,
  updateFermentationRecord,
} from './requests'

export const fermentationRecordKeys = {
  root: ['fermentation-records'] as const,
  list: function (pagination: Pagination) {
    return [...fermentationRecordKeys.root, pagination] as const
  },
  detail: function (id: string) {
    return [...fermentationRecordKeys.root, id] as const
  },
}

export function listFermentationRecordsOptions(
  pagination: Pagination = { limit: 20, page: 1 },
) {
  return queryOptions({
    queryKey: fermentationRecordKeys.list(pagination),
    queryFn: function () {
      return listFermentationRecords(pagination)
    },
    placeholderData: keepPreviousData,
  })
}

export function getFermentationRecordOptions(id: string) {
  return queryOptions({
    queryKey: fermentationRecordKeys.detail(id),
    queryFn: function () {
      return getFermentationRecord(id)
    },
  })
}

export function createFermentationRecordOptions() {
  return mutationOptions({
    mutationFn: function (record: FermentationRecordPayload) {
      return createFermentationRecord(record)
    },
  })
}

export function updateFermentationRecordOptions(id: string) {
  return mutationOptions({
    mutationFn: function (record: FermentationRecordPayload) {
      return updateFermentationRecord(id, record)
    },
  })
}

export function deleteFermentationRecordOptions() {
  return mutationOptions({
    mutationFn: function (id: string) {
      return deleteFermentationRecord(id)
    },
  })
}
