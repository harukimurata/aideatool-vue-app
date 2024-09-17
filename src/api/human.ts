import axios from 'axios'
import {
  type HumanFullResponse,
  type HumanNameUpdateRequest,
  type HumanNameResponse,
  type HumanAgeUpdateRequest,
  type HumanAgeResponse,
  type HumanStatusRequest,
  type HumanStatusResponse
} from '../interface/Human'
const API_URL = import.meta.env.VITE_APP_URL
const HUMAN_API_URL = API_URL + '/human'

/**
 * 名前、年齢、ステータスを取得
 * @returns
 */
export async function get(): Promise<HumanFullResponse> {
  const result = await axios.get(`${HUMAN_API_URL}/`)
  return result.data
}

/**
 * 名前更新
 * @returns
 */
export async function updateName(data: HumanNameUpdateRequest): Promise<HumanNameResponse> {
  const result = await axios.post(`${HUMAN_API_URL}/name`, data)
  return result.data
}

/**
 * 年齢更新
 * @returns
 */
export async function updateAge(data: HumanAgeUpdateRequest): Promise<HumanAgeResponse> {
  const result = await axios.post(`${HUMAN_API_URL}/age`, data)
  return result.data
}

/**
 * ステータス更新
 * @returns
 */
export async function updateStatus(data: HumanStatusRequest): Promise<HumanStatusResponse> {
  const result = await axios.post(`${HUMAN_API_URL}/status`, data)
  return result.data
}
