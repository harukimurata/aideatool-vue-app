export interface RestaurantResponse {
  id: number
  name: string
  value: number
}

export interface RestaurantCart {
  product: RestaurantResponse
  num: number
}
