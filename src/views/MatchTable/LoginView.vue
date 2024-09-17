<template>
  <header-component title="対戦表つくーる"></header-component>

  <h1 class="title pt-3">対戦表つくーる</h1>
  <h2 class="title">ログイン</h2>

  <div class="mx-3">
    <div class="field">
      <label class="label has-text-left">大会ID</label>
      <div class="control">
        <input
          class="input"
          type="text"
          v-model="formData.match_id"
          maxlength="30"
          @change="isLength(formData.match_id, 30)"
          placeholder="最大30文字"
        />
      </div>
      <p v-show="isMatchIdEmpty" class="help has-text-left is-danger">大会IDが記入されていません</p>
    </div>

    <div class="field">
      <label class="label has-text-left">大会パスワード</label>
      <div class="control">
        <input
          class="input"
          type="password"
          v-model="formData.password"
          maxlength="30"
          @change="isLength(formData.password, 30)"
          placeholder="最大30文字"
        />
      </div>
      <p v-show="isPasswordEmpty" class="help has-text-left is-danger">
        大会パスワードが記入されていません
      </p>
    </div>

    <div class="field is-grouped mt-6">
      <div class="control">
        <button class="button is-link" @click="handler.onConfirm">ログイン</button>
      </div>
      <div class="control">
        <button class="button is-link is-light" @click="toLink('MatchTableModeSelect')">
          戻る
        </button>
      </div>
    </div>
  </div>

  <error-modal
    v-if="isErrorModal"
    :text="errorModalText"
    :on-close="handler.onErrorModalClose"
  ></error-modal>
</template>

<script lang="ts" setup>
import { onMounted, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { type MathTableGetRequest } from '../../interface/MatchTable'
import { getMatchTable } from '../../api/matchTable'
import { useMatchTableDataStore } from '../../stores/matchTableData'
import { useMatchTableLoginInfoStore } from '../../stores/matchTableLoginInfo'
import { isLength } from '../../logic/utils'

const router = useRouter()
const MatchTableDataStore = useMatchTableDataStore()
const matchTableLoginInfoStore = useMatchTableLoginInfoStore()

const formData = reactive<MathTableGetRequest>({
  match_id: '',
  password: ''
})

const isMatchIdEmpty = ref(false)
const isPasswordEmpty = ref(false)
//エラーモーダル
const isErrorModal = ref(false)
const errorModalText = ref('予期せぬエラーが発生しましました。')

onMounted(() => {
  MatchTableDataStore.update(null)
  matchTableLoginInfoStore.update(null)
})

/**
 * ログイン
 */
const login = async () => {
  try {
    const result = await getMatchTable(formData)
    MatchTableDataStore.update(result)
    if (MatchTableDataStore.matchTableData !== null) {
      matchTableLoginInfoStore.update(formData)
      toLink('MatchTable')
    }
  } catch (e: any) {
    errorModalText.value = e.response
      ? e.response.data.message
      : '予期せぬエラーが発生しましました。'
    isErrorModal.value = true
  }
}

const toLink = (toLinkName: string) => {
  router.push({ name: toLinkName })
}

const handler = {
  onConfirm: async () => {
    if (formData.match_id == '' || formData.match_id == null) {
      isMatchIdEmpty.value = true
      return
    } else {
      isMatchIdEmpty.value = false
    }

    if (formData.password == '' || formData.password == null) {
      isPasswordEmpty.value = true
      return
    } else {
      isPasswordEmpty.value = false
    }

    await login()
  },
  onErrorModalClose: () => {
    isErrorModal.value = false
  }
}
</script>
