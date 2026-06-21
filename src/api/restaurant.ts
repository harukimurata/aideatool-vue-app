import { PRODUCTS } from '@/localData/products'
import { type RestaurantResponse, type RestaurantAllResponse } from '@/interface/Restaurant'

/**
 * 商品全取得
 * @returns
 */
export async function productGetAll(): Promise<RestaurantAllResponse> {
  return { data: PRODUCTS }
}

/**
 * 商品検索
 * @returns
 */
export async function productGet(productNumber: string): Promise<RestaurantResponse> {
  const product = PRODUCTS.find((p) => p.id === parseInt(productNumber))
  if (!product) {
    throw new Error(`Product with id ${productNumber} not found`)
  }
  return product
}
