import {
  keepPreviousData,
  mutationOptions,
  queryOptions,
} from '@tanstack/react-query'
import { toast } from 'sonner'

import type { Pagination, TankPayload } from '@/types/api'
import { getErrorDescription } from '#/lib/utils'

import {
  createTank,
  deleteTank,
  getTank,
  listTankFermentationRecords,
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
  fermentationRecords: function (tankId: string, pagination: Pagination) {
    return [
      ...tankKeys.detail(tankId),
      'fermentation-records',
      pagination,
    ] as const
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
    placeholderData: keepPreviousData,
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

export function listTankFermentationRecordsOptions(
  tankId: string,
  pagination: Pagination = { limit: 20, page: 1 },
) {
  return queryOptions({
    queryKey: tankKeys.fermentationRecords(tankId, pagination),
    queryFn: function () {
      return listTankFermentationRecords(tankId, pagination)
    },
    placeholderData: keepPreviousData,
  })
}

export function createTankOptions() {
  return mutationOptions({
    mutationFn: function (tank: TankPayload) {
      return createTank(tank)
    },
    onSuccess: async (_, __, ___, { client }) => {
      toast.success('Tanque criado com sucesso')
      await client.invalidateQueries({ queryKey: tankKeys.root })
    },
    onError: async (err) => {
      toast.error('Erro ao criar tanque', {
        description: await getErrorDescription(err),
      })
    },
  })
}

export function updateTankOptions(id: string) {
  return mutationOptions({
    mutationFn: function (tank: TankPayload) {
      return updateTank(id, tank)
    },
    onSuccess: async (_, __, ___, { client }) => {
      toast.success('Tanque atualizado com sucesso')
      await client.invalidateQueries({ queryKey: tankKeys.root })
      await client.invalidateQueries({ queryKey: tankKeys.detail(id) })
    },
    onError: async (err) => {
      toast.error('Erro ao atualizar tanque', {
        description: await getErrorDescription(err),
      })
    },
  })
}

export function deleteTankOptions() {
  return mutationOptions({
    mutationFn: function (id: string) {
      return deleteTank(id)
    },
    onSuccess: async (_, id, ___, { client }) => {
      toast.success('Tanque excluido com sucesso')
      await client.invalidateQueries({ queryKey: tankKeys.root })
      client.removeQueries({ queryKey: tankKeys.detail(id) })
    },
    onError: async (err) => {
      toast.error('Erro ao excluir tanque', {
        description: await getErrorDescription(err),
      })
    },
  })
}
