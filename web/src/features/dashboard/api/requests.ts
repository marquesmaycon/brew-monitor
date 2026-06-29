import { api } from '@/lib/api'
import type { DashboardMetrics } from '@/types/api'

const resource = 'dashboard'

export function getDashboardMetrics() {
  return api.get(resource).json<DashboardMetrics>()
}
