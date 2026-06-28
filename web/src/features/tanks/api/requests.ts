import { api } from '@/lib/api'
import type { Tank, TankPayload } from '@/types/api'

const resource = 'tanks'

export function listTanks() {
  return api.get(resource).json<Array<Tank>>()
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
