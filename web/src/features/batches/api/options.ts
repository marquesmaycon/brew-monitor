import { queryOptions } from '@tanstack/react-query'

import { getBatch, listBatches } from './requests'

export const batchKeys = {
  root: ['batches'] as const,
  list: function () {
    return [...batchKeys.root, 'list'] as const
  },
  detail: function (batchNumber: string) {
    return [...batchKeys.root, 'detail', batchNumber] as const
  },
}

export function listBatchesOptions() {
  return queryOptions({
    queryKey: batchKeys.list(),
    queryFn: listBatches,
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
