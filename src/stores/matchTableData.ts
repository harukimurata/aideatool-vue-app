import { ref } from 'vue'
import { defineStore } from 'pinia'
import { type MatchTableData } from '@/interface/MatchTable'

export const useMatchTableDataStore = defineStore(
  'matchTableData',
  () => {
    const matchTableData = ref<MatchTableData | null>(null)
    function update(data: MatchTableData | null) {
      matchTableData.value = data
    }
    return { matchTableData, update }
  },
  {
    persist: true
  }
)
