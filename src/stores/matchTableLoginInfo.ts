import { ref } from 'vue'
import { defineStore } from 'pinia'
import { type MathTableGetRequest } from '@/interface/MatchTable'

export const useMatchTableLoginInfoStore = defineStore(
  'matchTableLoginInfo',
  () => {
    const matchTableLoginInfo = ref<MathTableGetRequest | null>(null)
    function update(data: MathTableGetRequest | null) {
      matchTableLoginInfo.value = data
    }
    return { matchTableLoginInfo, update }
  },
  {
    persist: true
  }
)
