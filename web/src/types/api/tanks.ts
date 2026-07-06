import type { EntityTimestamps } from './common'

export type Tank = EntityTimestamps & {
  id: string
  name: string
  capacityLiters: number
}

export type TankPayload = Pick<Tank, 'name' | 'capacityLiters'>
