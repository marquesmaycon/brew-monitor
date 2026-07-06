import type { EntityTimestamps } from './common'
import type { BeerFermentationParameter } from './fermentation-parameters'

export type Beer = EntityTimestamps & {
  id: string
  name: string
  style: string
  fermentationParameter: BeerFermentationParameter | null
}

export type BeerPayload = Pick<Beer, 'name' | 'style'>
