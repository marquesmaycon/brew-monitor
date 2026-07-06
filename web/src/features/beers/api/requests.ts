import { api } from '@/lib/api'
import type {
  Beer,
  FermentationParameter,
  FermentationParameterPayload,
  FermentationRecord,
  Paginated,
  Pagination,
} from '@/types/api'

import type { BeerSchema } from '../validation/beer.validation'

const resource = 'beers'

export function listBeers(pagination: Pagination) {
  const { search, sortBy, sortDirection, ...pageParams } = pagination
  const searchParams = {
    ...pageParams,
    ...(search?.trim() ? { search: search.trim() } : {}),
    ...(sortBy ? { sortBy } : {}),
    ...(sortDirection ? { sortDirection } : {}),
  }

  return api.get(resource, { searchParams }).json<Paginated<Beer>>()
}

export function getBeer(id: string) {
  return api.get(`${resource}/${id}`).json<Beer>()
}

export function createBeer(beer: BeerSchema) {
  return api.post(resource, { json: beer }).json<Beer>()
}

export function updateBeer(id: string, beer: BeerSchema) {
  return api.put(`${resource}/${id}`, { json: beer }).json<Beer>()
}

export function deleteBeer(id: string) {
  return api.delete(`${resource}/${id}`)
}

export function listBeerFermentationRecords(
  beerId: string,
  pagination: Pagination,
) {
  const { search, sortBy, sortDirection, classification, ...pageParams } =
    pagination
  const searchParams = {
    ...pageParams,
    ...(search?.trim() ? { search: search.trim() } : {}),
    ...(sortBy ? { sortBy } : {}),
    ...(sortDirection ? { sortDirection } : {}),
    ...(classification ? { classification } : {}),
  }

  return api
    .get(`${resource}/${beerId}/fermentation-records`, {
      searchParams,
    })
    .json<Paginated<FermentationRecord>>()
}

export function getBeerFermentationParameter(beerId: string) {
  return api
    .get(`${resource}/${beerId}/fermentation-parameters`)
    .json<FermentationParameter>()
}

export function createBeerFermentationParameter(
  beerId: string,
  parameter: FermentationParameterPayload,
) {
  return api
    .post(`${resource}/${beerId}/fermentation-parameters`, {
      json: parameter,
    })
    .json<FermentationParameter>()
}

export function updateBeerFermentationParameter(
  beerId: string,
  parameter: FermentationParameterPayload,
) {
  return api
    .put(`${resource}/${beerId}/fermentation-parameters`, { json: parameter })
    .json<FermentationParameter>()
}

export function deleteBeerFermentationParameter(beerId: string) {
  return api.delete(`${resource}/${beerId}/fermentation-parameters`)
}
