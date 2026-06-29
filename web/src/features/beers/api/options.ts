import { mutationOptions, queryOptions } from '@tanstack/react-query'

import type { FermentationParameterPayload } from '@/types/api'

import type { BeerSchema } from '../validation/beer.validation'
import {
  createBeer,
  createBeerFermentationParameter,
  deleteBeer,
  deleteBeerFermentationParameter,
  getBeer,
  getBeerFermentationParameter,
  listBeers,
  updateBeer,
  updateBeerFermentationParameter,
} from './requests'

export const beerKeys = {
  root: ['beers'] as const,
  detail: function (id: string) {
    return [...beerKeys.root, id] as const
  },
  fermentationParameter: function (beerId: string) {
    return [...beerKeys.detail(beerId), 'fermentation-parameter'] as const
  },
}

export function listBeersOptions() {
  return queryOptions({
    queryKey: beerKeys.root,
    queryFn: function () {
      return listBeers()
    },
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
  })
}

export function updateBeerOptions(id: string) {
  return mutationOptions({
    mutationFn: function (beer: BeerSchema) {
      return updateBeer(id, beer)
    },
  })
}

export function deleteBeerOptions() {
  return mutationOptions({
    mutationFn: function (id: string) {
      return deleteBeer(id)
    },
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
  })
}

export function updateBeerFermentationParameterOptions(beerId: string) {
  return mutationOptions({
    mutationFn: function (parameter: FermentationParameterPayload) {
      return updateBeerFermentationParameter(beerId, parameter)
    },
  })
}

export function deleteBeerFermentationParameterOptions() {
  return mutationOptions({
    mutationFn: function (beerId: string) {
      return deleteBeerFermentationParameter(beerId)
    },
  })
}
