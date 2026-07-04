import { api } from '@/lib/api'
import type {
  FermentationRecord,
  Paginated,
  Pagination,
  Tank,
  TankPayload,
} from '@/types/api'

const resource = 'tanks'

export function listTanks(pagination: Pagination) {
  const { search, sortBy, sortDirection, ...pageParams } = pagination
  const searchParams = {
    ...pageParams,
    ...(search?.trim() ? { search: search.trim() } : {}),
    ...(sortBy ? { sortBy } : {}),
    ...(sortDirection ? { sortDirection } : {}),
  }

  return api.get(resource, { searchParams }).json<Paginated<Tank>>()
}

export function getTank(id: string) {
  return api.get(`${resource}/${id}`).json<Tank>()
}

export function createTank(tank: TankPayload) {
  return api.post(resource, { json: tank }).json<Tank>()
}

export function updateTank(id: string, tank: TankPayload) {
  return api.put(`${resource}/${id}`, { json: tank }).json<Tank>()
}

export function deleteTank(id: string) {
  return api.delete(`${resource}/${id}`)
}

export function listTankFermentationRecords(
  tankId: string,
  pagination: Pagination,
) {
  return api
    .get(`${resource}/${tankId}/fermentation-records`, {
      searchParams: pagination,
    })
    .json<Paginated<FermentationRecord>>()
}
