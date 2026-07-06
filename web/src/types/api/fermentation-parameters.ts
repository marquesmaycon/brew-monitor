import type { EntityTimestamps } from './common'

export type FermentationParameter = EntityTimestamps & {
  id: string
  beerId: string
  minTemperature: number
  maxTemperature: number
  minPh: number
  maxPh: number
  minExtract: number
  maxExtract: number
}

export type BeerFermentationParameter = Pick<
  FermentationParameter,
  | 'minTemperature'
  | 'maxTemperature'
  | 'minPh'
  | 'maxPh'
  | 'minExtract'
  | 'maxExtract'
>

export type FermentationParameterPayload = Omit<
  FermentationParameter,
  'id' | 'beerId' | keyof EntityTimestamps
>
