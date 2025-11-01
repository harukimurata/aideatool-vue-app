import type { RestaurantEntity } from './entity/restaurant'

export interface RestaurantResponse {
  id: number
  name: string
  value: number
}

export interface RestaurantAllResponse {
  data: RestaurantEntity[]
}

export interface RestaurantCart {
  product: RestaurantResponse
  num: number
}
