<template>
  <header-component title="対戦表つくーる"></header-component>

  <div class="columns is-mobile is-centered mx-2">
    <div class="column is-11 mt-3">
      <div class="card">
        <div v-if="!isConfirm" class="card-content">
          <h1 class="title pt-3">対戦表作成画面</h1>
          <div class="field">
            <label class="label has-text-left">大会名</label>
            <div class="control">
              <input
                class="input"
                type="text"
                v-model="formData.title"
                maxlength="30"
                @change="isLength(formData.title, 30)"
                placeholder="最大30文字"
              />
            </div>
            <p v-show="isTitleEmpty" class="help has-text-left is-danger">
              大会名が記入されていません
            </p>
          </div>

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
            <p v-show="isMatchIdEmpty" class="help has-text-left is-danger">
              大会IDが記入されていません
            </p>
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

          <div class="field">
            <label class="label has-text-left"
              >編集権限パスワード<span class="tag is-info"> 任意</span></label
            >
            <p class="has-text-left">編集権限パスワードは任意です。</p>
            <div class="control">
              <input
                class="input"
                type="password"
                v-model="formData.auth_password"
                maxlength="30"
                @change="isLength(formData.auth_password, 30)"
                placeholder="最大30文字"
              />
            </div>
          </div>

          <label class="label has-text-left">参加プレイヤー</label>

          <div v-for="(player, index) in formData.player" :key="index" class="field mx-2">
            <label class="label has-text-left">プレイヤー {{ index + 1 }}</label>
            <div class="control">
              <input
                class="input"
                type="text"
                v-model="formData.player[index]"
                maxlength="20"
                @change="isLength(formData.player[index], 20)"
                placeholder="最大20文字"
              />
            </div>
          </div>

          <div class="field is-grouped mt-2 mx-2">
            <p class="control">
              <button class="button is-link mr-2" @click="playerAdd">追加</button>
              <button class="button is-danger" @click="playerDelete">削除</button>
            </p>
          </div>

          <div class="field is-grouped mt-6">
            <div class="control">
              <button class="button is-link" @click="handler.onConfirm">確認する</button>
            </div>
            <div class="control">
              <button class="button is-link is-light" @click="toLink('MatchTableModeSelect')">
                やめる
              </button>
            </div>
          </div>
        </div>
        <create-confirm
          v-if="isConfirm"
          :input-data="formData"
          :on-create="handler.onCreate"
          :on-back="handler.onBack"
        ></create-confirm>
      </div>
    </div>
  </div>

  <common-modal
    v-if="isCommonModal"
    :title="modalTitle"
    :text="modalText"
    :on-close="handler.onCommonModalClose"
  ></common-modal>

  <error-modal
    v-if="isErrorModal"
    :text="errorModalText"
    :on-close="handler.onErrorModalClose"
  ></error-modal>
</template>

<script lang="ts" setup>
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { type MatchTableCreateRequest } from '../../interface/MatchTable'
import { createMatchTable } from '../../api/matchTable'
import { isLength } from '../../logic/utils'

const router = useRouter()

const formData = reactive<MatchTableCreateRequest>({
  title: '',
  match_id: '',
  password: '',
  player: ['player_A', 'player_B'],
  auth_password: null
})
const isTitleEmpty = ref(false)
const isMatchIdEmpty = ref(false)
const isPasswordEmpty = ref(false)
//入力確認切り替えフラグ
const isConfirm = ref(false)
//汎用モーダル
const isCommonModal = ref(false)
const modalTitle = ref('')
const modalText = ref('')
//エラーモーダル
const isErrorModal = ref(false)
const errorModalText = ref('予期せぬエラーが発生しましました。')

/**
 * 大会作成リクエスト
 */
const create = async () => {
  try {
    const result = await createMatchTable(formData)
    modalTitle.value = result.message
    modalText.value = '参加画面に移動します。'
    isCommonModal.value = true
  } catch (e: any) {
    errorModalText.value = e.response
      ? e.response.data.message
      : '予期せぬエラーが発生しましました。'
    isErrorModal.value = true
  }
}

/**
 * プレイヤー追加
 */
const playerAdd = () => {
  formData.player.push('player' + (formData.player.length + 1))
}

/**
 * プレイヤー削除
 */
const playerDelete = () => {
  if (formData.player.length <= 2) {
    return
  }
  formData.player.pop()
}

const toLink = (toLinkName: string) => {
  router.push({ name: toLinkName })
}

const handler = {
  onConfirm: () => {
    if (formData.title == '' || formData.title == null) {
      isTitleEmpty.value = true
      return
    } else {
      isTitleEmpty.value = false
    }

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

    isConfirm.value = true
  },
  onBack: () => {
    isConfirm.value = false
  },
  onCreate: async () => {
    await create()
  },
  onCommonModalClose: () => {
    isCommonModal.value = false
    toLink('MatchTableLogin')
  },
  onErrorModalClose: () => {
    isErrorModal.value = false
  }
}
</script>
