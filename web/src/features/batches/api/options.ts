import { queryOptions } from '@tanstack/react-query'

import type { Pagination } from '@/types/api'

import { getBatch, listBatches } from './requests'

export const batchKeys = {
  root: ['batches'] as const,
  list: function (pagination: Pagination) {
    return [...batchKeys.root, pagination] as const
  },
  detail: function (batchNumber: string) {
    return [...batchKeys.root, 'detail', batchNumber] as const
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
  })
}

export function getBatchOptions(batchNumber: string) {
  return queryOptions({
    queryKey: batchKeys.detail(batchNumber),
    queryFn: function () {
      return getBatch(batchNumber)
    },
  })
}
