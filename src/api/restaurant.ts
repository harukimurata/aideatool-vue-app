import axios from 'axios'
import { type RestaurantResponse } from '@/interface/Restaurant'
const API_URL = import.meta.env.VITE_APP_URL
const RESTAURANT_API_URL = API_URL + '/restaurant'

/**
 * 商品検索
 * @returns
 */
export async function productGet(productNumber: string): Promise<RestaurantResponse> {
  const result = await axios.get(`${RESTAURANT_API_URL}/?id=${productNumber}`)
  return result.data
}
