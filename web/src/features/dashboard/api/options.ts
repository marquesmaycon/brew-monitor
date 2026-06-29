import { queryOptions } from '@tanstack/react-query'

import { getDashboardMetrics, getFermentationHistory } from './requests'

export const dashboardKeys = {
  root: ['dashboard'] as const,
  metrics: function () {
    return [...dashboardKeys.root, 'metrics'] as const
  },
  fermentationHistory: function (batchNumber?: string) {
    return [...dashboardKeys.root, 'fermentation-history', batchNumber] as const
  },
}

export function getDashboardMetricsOptions() {
  return queryOptions({
    queryKey: dashboardKeys.metrics(),
    queryFn: getDashboardMetrics,
  })
}

export function getFermentationHistoryOptions(batchNumber?: string) {
  return queryOptions({
    queryKey: dashboardKeys.fermentationHistory(batchNumber),
    queryFn: function () {
      return getFermentationHistory(batchNumber)
    },
  })
}
