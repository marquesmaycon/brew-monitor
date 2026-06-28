import { api } from '@/lib/api'
import type {
  Beer,
  FermentationParameter,
  FermentationParameterPayload,
} from '@/types/api'

import type { BeerSchema } from '../validation/beer.validation'

const resource = 'beers'

export function listBeers() {
  return api.get(resource).json<Array<Beer>>()
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
