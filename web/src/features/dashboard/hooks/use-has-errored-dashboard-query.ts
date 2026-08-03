import { useQueryClient } from '@tanstack/react-query'
import { useSyncExternalStore } from 'react'

import { dashboardKeys } from '../api/options'

export function useHasErroredDashboardQuery() {
  const queryClient = useQueryClient()
  const queryCache = queryClient.getQueryCache()

  return useSyncExternalStore(
    (onStoreChange) => queryCache.subscribe(onStoreChange),
    () =>
      queryCache
        .findAll({ queryKey: dashboardKeys.root })
        .some((query) => query.state.status === 'error'),
    () =>
      queryCache
        .findAll({ queryKey: dashboardKeys.root })
        .some((query) => query.state.status === 'error'),
  )
}
