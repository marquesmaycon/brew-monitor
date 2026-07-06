import {
  keepPreviousData,
  mutationOptions,
  queryOptions,
} from '@tanstack/react-query'
import { toast } from 'sonner'

import type { FermentationParameterPayload, Pagination } from '@/types/api'
import { getErrorDescription } from '#/lib/utils'

import type { BeerSchema } from '../validation/beer.validation'
import {
  createBeer,
  createBeerFermentationParameter,
  deleteBeer,
  deleteBeerFermentationParameter,
  getBeer,
  getBeerFermentationParameter,
  listBeerFermentationRecords,
  listBeers,
  updateBeer,
  updateBeerFermentationParameter,
} from './requests'

export const beerKeys = {
  root: ['beers'] as const,
  list: function (pagination: Pagination) {
    return [...beerKeys.root, pagination] as const
  },
  detail: function (id: string) {
    return [...beerKeys.root, id] as const
  },
  fermentationParameter: function (beerId: string) {
    return [...beerKeys.detail(beerId), 'fermentation-parameter'] as const
  },
  fermentationRecords: function (beerId: string, pagination: Pagination) {
    return [
      ...beerKeys.detail(beerId),
      'fermentation-records',
      pagination,
    ] as const
  },
}

export function listBeersOptions(
  pagination: Pagination = { page: 1, limit: 20 },
) {
  return queryOptions({
    queryKey: beerKeys.list(pagination),
    queryFn: function () {
      return listBeers(pagination)
    },
    placeholderData: keepPreviousData,
    refetchOnMount: false,
  })
}

export function getBeerOptions(id: string) {
  return queryOptions({
    queryKey: beerKeys.detail(id),
    queryFn: function () {
      return getBeer(id)
    },
  })
}

export function createBeerOptions() {
  return mutationOptions({
    mutationFn: function (beer: BeerSchema) {
      return createBeer(beer)
    },
    onSuccess: async (_, __, ___, { client }) => {
      toast.success('Cerveja criada com sucesso')
      await client.invalidateQueries({ queryKey: beerKeys.root })
    },
    onError: async (err) => {
      toast.error('Erro ao criar nova cerveja', {
        description: await getErrorDescription(err),
      })
    },
  })
}

export function updateBeerOptions(id: string) {
  return mutationOptions({
    mutationFn: function (beer: BeerSchema) {
      return updateBeer(id, beer)
    },
    onSuccess: async (_, __, ___, { client }) => {
      toast.success('Cerveja atualizada com sucesso')
      await client.invalidateQueries({ queryKey: beerKeys.root })
      await client.invalidateQueries({ queryKey: beerKeys.detail(id) })
    },
    onError: async (err) => {
      toast.error('Erro ao atualizar cerveja', {
        description: await getErrorDescription(err),
      })
    },
  })
}

export function deleteBeerOptions() {
  return mutationOptions({
    mutationFn: function (id: string) {
      return deleteBeer(id)
    },
    onSuccess: async (_, id, ___, { client }) => {
      toast.success('Cerveja excluida com sucesso')
      await client.invalidateQueries({ queryKey: beerKeys.root })
      client.removeQueries({ queryKey: beerKeys.detail(id) })
    },
    onError: async (err) => {
      toast.error('Erro ao excluir cerveja', {
        description: await getErrorDescription(err),
      })
    },
  })
}

export function listBeerFermentationRecordsOptions(
  beerId: string,
  pagination: Pagination = { limit: 20, page: 1 },
) {
  return queryOptions({
    queryKey: beerKeys.fermentationRecords(beerId, pagination),
    queryFn: function () {
      return listBeerFermentationRecords(beerId, pagination)
    },
    placeholderData: keepPreviousData,
  })
}

export function getBeerFermentationParameterOptions(beerId: string) {
  return queryOptions({
    queryKey: beerKeys.fermentationParameter(beerId),
    queryFn: function () {
      return getBeerFermentationParameter(beerId)
    },
  })
}

export function createBeerFermentationParameterOptions(beerId: string) {
  return mutationOptions({
    mutationFn: function (parameter: FermentationParameterPayload) {
      return createBeerFermentationParameter(beerId, parameter)
    },
    onSuccess: async (_, __, ___, { client }) => {
      toast.success('Parâmetros de fermentação criados com sucesso')
      await client.invalidateQueries({ queryKey: beerKeys.root })
      await client.invalidateQueries({
        queryKey: beerKeys.fermentationParameter(beerId),
      })
      await client.invalidateQueries({ queryKey: beerKeys.detail(beerId) })
    },
    onError: async (err) => {
      toast.error('Erro ao criar parâmetros de fermentação', {
        description: await getErrorDescription(err),
      })
    },
  })
}

export function updateBeerFermentationParameterOptions(beerId: string) {
  return mutationOptions({
    mutationFn: function (parameter: FermentationParameterPayload) {
      return updateBeerFermentationParameter(beerId, parameter)
    },
    onSuccess: async (_, __, ___, { client }) => {
      toast.success('Parâmetros de fermentação atualizados com sucesso')
      await client.invalidateQueries({ queryKey: beerKeys.root })
      await client.invalidateQueries({
        queryKey: beerKeys.fermentationParameter(beerId),
      })
      await client.invalidateQueries({ queryKey: beerKeys.detail(beerId) })
    },
    onError: async (err) => {
      toast.error('Erro ao atualizar parâmetros de fermentação', {
        description: await getErrorDescription(err),
      })
    },
  })
}

export function deleteBeerFermentationParameterOptions() {
  return mutationOptions({
    mutationFn: function (beerId: string) {
      return deleteBeerFermentationParameter(beerId)
    },
    onSuccess: async (_, beerId, ___, { client }) => {
      toast.success('Parâmetros de fermentação excluidos com sucesso')
      await client.invalidateQueries({ queryKey: beerKeys.root })
      client.removeQueries({
        queryKey: beerKeys.fermentationParameter(beerId),
      })
      await client.invalidateQueries({ queryKey: beerKeys.detail(beerId) })
    },
    onError: async (err) => {
      toast.error('Erro ao excluir parâmetros de fermentação', {
        description: await getErrorDescription(err),
      })
    },
  })
}
