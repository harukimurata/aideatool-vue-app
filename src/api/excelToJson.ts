import axios from 'axios'
const API_URL = import.meta.env.VITE_APP_URL

/**
 * エクセルからjson生成
 * @param file
 * @returns
 */
export async function excelToJson(file: any): Promise<any> {
  const formData = new FormData()
  formData.append('file', file)
  const config = {
    headers: {
      'content-type': 'multipart/form-data'
    }
  }
  const result = await axios.post(`${API_URL}/excelToJson`, formData, config)
  return result.data
}
