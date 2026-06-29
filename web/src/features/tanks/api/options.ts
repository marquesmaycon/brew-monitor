import { mutationOptions, queryOptions } from '@tanstack/react-query'

import type { Pagination, TankPayload } from '@/types/api'

import {
  createTank,
  deleteTank,
  getTank,
  listTanks,
  updateTank,
} from './requests'

export const tankKeys = {
  root: ['tanks'] as const,
  list: function (pagination: Pagination) {
    return [...tankKeys.root, pagination] as const
  },
  detail: function (id: string) {
    return [...tankKeys.root, id] as const
  },
}

export function listTanksOptions(
  pagination: Pagination = { limit: 20, page: 1 },
) {
  return queryOptions({
    queryKey: tankKeys.list(pagination),
    queryFn: function () {
      return listTanks(pagination)
    },
  })
}

export function getTankOptions(id: string) {
  return queryOptions({
    queryKey: tankKeys.detail(id),
    queryFn: function () {
      return getTank(id)
    },
  })
}

export function createTankOptions() {
  return mutationOptions({
    mutationFn: function (tank: TankPayload) {
      return createTank(tank)
    },
  })
}

export function updateTankOptions(id: string) {
  return mutationOptions({
    mutationFn: function (tank: TankPayload) {
      return updateTank(id, tank)
    },
  })
}

export function deleteTankOptions() {
  return mutationOptions({
    mutationFn: function (id: string) {
      return deleteTank(id)
    },
  })
}
