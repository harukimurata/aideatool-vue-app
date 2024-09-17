import axios from 'axios'
import { type GachaResponse } from '@/interface/Gacha'
const API_URL = import.meta.env.VITE_APP_URL

/**
 * 年賀状おみくじ
 * @returns
 */
export async function omikuji(): Promise<GachaResponse> {
  const result = await axios.get(`${API_URL}/gacha`)
  return result.data
}
