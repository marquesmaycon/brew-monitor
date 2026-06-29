import { api } from '@/lib/api'
import type { Paginated, Pagination, Tank, TankPayload } from '@/types/api'

const resource = 'tanks'

export function listTanks(pagination: Pagination) {
  return api
    .get(resource, { searchParams: pagination })
    .json<Paginated<Tank>>()
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
