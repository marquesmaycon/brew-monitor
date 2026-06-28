import { mutationOptions, queryOptions } from '@tanstack/react-query'

import type { TankPayload } from '@/types/api'

import {
  createTank,
  deleteTank,
  getTank,
  listTanks,
  updateTank,
} from './requests'

export const tankKeys = {
  all: ['tanks'] as const,
  lists: function () {
    return [...tankKeys.all, 'list'] as const
  },
  details: function () {
    return [...tankKeys.all, 'detail'] as const
  },
  detail: function (id: string) {
    return [...tankKeys.details(), id] as const
  },
}

export function listTanksOptions() {
  return queryOptions({
    queryKey: tankKeys.lists(),
    queryFn: function () {
      return listTanks()
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
