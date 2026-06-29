import { queryOptions } from '@tanstack/react-query'

import { getDashboardMetrics } from './requests'

export const dashboardKeys = {
  root: ['dashboard'] as const,
  metrics: function () {
    return [...dashboardKeys.root, 'metrics'] as const
  },
}

export function getDashboardMetricsOptions() {
  return queryOptions({
    queryKey: dashboardKeys.metrics(),
    queryFn: getDashboardMetrics,
  })
}
