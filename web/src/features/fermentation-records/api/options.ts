import {
  keepPreviousData,
  mutationOptions,
  queryOptions,
} from '@tanstack/react-query'
import { toast } from 'sonner'

import { beerKeys } from '@/features/beers/api/options'
import { tankKeys } from '@/features/tanks/api/options'
import type { FermentationRecordPayload, Pagination } from '@/types/api'
import { getErrorDescription } from '#/lib/utils'

import {
  createFermentationRecord,
  deleteFermentationRecord,
  getFermentationRecord,
  listFermentationRecords,
  updateFermentationRecord,
} from './requests'

/**
 * Fábrica de chaves de cache (Query Keys) para os registros de fermentação.
 * Adota a convenção estruturada dividida em prefixo geral (root), listas parametrizadas (list) 
 * e chaves de identificação individual (detail) para otimizar invalidações.
 */
export const fermentationRecordKeys = {
  root: ['fermentation-records'] as const,
  list: function (pagination: Pagination) {
    return [...fermentationRecordKeys.root, pagination] as const
  },
  detail: function (id: string) {
    return [...fermentationRecordKeys.root, id] as const
  },
}

export function listFermentationRecordsOptions(
  pagination: Pagination = { limit: 20, page: 1 },
) {
  return queryOptions({
    queryKey: fermentationRecordKeys.list(pagination),
    queryFn: function () {
      return listFermentationRecords(pagination)
    },
    placeholderData: keepPreviousData,
  })
}

export function getFermentationRecordOptions(id: string) {
  return queryOptions({
    queryKey: fermentationRecordKeys.detail(id),
    queryFn: function () {
      return getFermentationRecord(id)
    },
  })
}

export function createFermentationRecordOptions() {
  return mutationOptions({
    mutationFn: function (record: FermentationRecordPayload) {
      return createFermentationRecord(record)
    },
    onSuccess: async (_, __, ___, { client }) => {
      toast.success('Registro criado com sucesso')
      await client.invalidateQueries({ queryKey: fermentationRecordKeys.root })
      await client.invalidateQueries({ queryKey: beerKeys.root })
      await client.invalidateQueries({ queryKey: tankKeys.root })
    },
    onError: async (err) => {
      toast.error('Erro ao criar registro', {
        description: await getErrorDescription(err),
      })
    },
  })
}

export function updateFermentationRecordOptions(id: string) {
  return mutationOptions({
    mutationFn: function (record: FermentationRecordPayload) {
      return updateFermentationRecord(id, record)
    },
    onSuccess: async (_, __, ___, { client }) => {
      toast.success('Registro atualizado com sucesso')
      await client.invalidateQueries({ queryKey: fermentationRecordKeys.root })
      await client.invalidateQueries({
        queryKey: fermentationRecordKeys.detail(id),
      })
      await client.invalidateQueries({ queryKey: beerKeys.root })
      await client.invalidateQueries({ queryKey: tankKeys.root })
    },
    onError: async (err) => {
      toast.error('Erro ao atualizar registro', {
        description: await getErrorDescription(err),
      })
    },
  })
}

export function deleteFermentationRecordOptions() {
  return mutationOptions({
    mutationFn: function (id: string) {
      return deleteFermentationRecord(id)
    },
    onSuccess: async (_, id, ___, { client }) => {
      toast.success('Registro excluido com sucesso')
      await client.invalidateQueries({ queryKey: fermentationRecordKeys.root })
      await client.invalidateQueries({ queryKey: beerKeys.root })
      await client.invalidateQueries({ queryKey: tankKeys.root })
      client.removeQueries({
        queryKey: fermentationRecordKeys.detail(id),
      })
    },
    onError: async (err) => {
      toast.error('Erro ao excluir registro', {
        description: await getErrorDescription(err),
      })
    },
  })
}
