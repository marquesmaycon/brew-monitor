import { mutationOptions, queryOptions } from '@tanstack/react-query'

import type { FermentationRecordPayload } from '@/types/api'

import {
  createFermentationRecord,
  deleteFermentationRecord,
  getFermentationRecord,
  listFermentationRecords,
  updateFermentationRecord,
} from './requests'

export const fermentationRecordKeys = {
  all: ['fermentation-records'] as const,
  lists: function () {
    return [...fermentationRecordKeys.all, 'list'] as const
  },
  details: function () {
    return [...fermentationRecordKeys.all, 'detail'] as const
  },
  detail: function (id: string) {
    return [...fermentationRecordKeys.details(), id] as const
  },
}

export function listFermentationRecordsOptions() {
  return queryOptions({
    queryKey: fermentationRecordKeys.lists(),
    queryFn: function () {
      return listFermentationRecords()
    },
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
