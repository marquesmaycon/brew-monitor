import { keepPreviousData, queryOptions } from '@tanstack/react-query'

import type { Pagination } from '@/types/api'

import {
  getBatchOverview,
  listBatches,
  listBatchFermentationRecords,
} from './requests'

export const batchKeys = {
  root: ['batches'] as const,
  list: function (pagination: Pagination) {
    return [...batchKeys.root, pagination] as const
  },
  overview: function (batchNumber: string) {
    return [...batchKeys.root, batchNumber, 'overview'] as const
  },
  fermentationRecords: function (batchNumber: string, pagination: Pagination) {
    return [
      ...batchKeys.root,
      batchNumber,
      'fermentation-records',
      pagination,
    ] as const
  },
}

export function listBatchesOptions(
  pagination: Pagination = { limit: 20, page: 1 },
) {
  return queryOptions({
    queryKey: batchKeys.list(pagination),
    queryFn: function () {
      return listBatches(pagination)
    },
    placeholderData: keepPreviousData,
  })
}

export function getBatchOptions(batchNumber: string) {
  return queryOptions({
    queryKey: batchKeys.overview(batchNumber),
    queryFn: function () {
      return getBatchOverview(batchNumber)
    },
  })
}

export function listBatchFermentationRecordsOptions(
  batchNumber: string,
  pagination: Pagination = { limit: 20, page: 1 },
) {
  return queryOptions({
    queryKey: batchKeys.fermentationRecords(batchNumber, pagination),
    queryFn: function () {
      return listBatchFermentationRecords(batchNumber, pagination)
    },
    placeholderData: keepPreviousData,
  })
}
