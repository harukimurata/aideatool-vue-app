<template>
  <header-component title="Human"></header-component>
  <div v-if="!limitLife" class="has-text-centered mx-5">
    <h1 class="title pt-3">Human</h1>
    <div class="columns is-mobile is-vcentered mb-0">
      <div class="column is-half pl-0 pr-1">
        人気な名前:{{ name }}
        <div class="field is-grouped">
          <p class="control is-expanded">
            <input
              class="input"
              type="text"
              v-model="formName"
              maxlength="20"
              @change="isLength(formName, 20)"
              placeholder="最大20文字"
            />
          </p>
          <p class="control margin-auto">
            <button class="button is-small is-info" @click="sendName">送信</button>
          </p>
        </div>
      </div>
      <div class="column is-half pl-1 pr-0">
        人気な年齢:{{ age }}
        <div class="field is-grouped">
          <p class="control is-expanded">
            <input
              class="input"
              type="number"
              v-model="formAge"
              min="1"
              max="1000"
              placeholder="最大1000"
            />
          </p>
          <p class="control margin-auto">
            <button class="button is-small is-info" @click="sendAge">送信</button>
          </p>
        </div>
      </div>
    </div>

    <div class="my-3">
      <p>体の状態:{{ bodyStatus(body) }}</p>
      <p>メンタル:{{ bodyStatus(mental) }}</p>
    </div>

    <div class="columns is-mobile is-centered mb-0">
      <div class="column is-one-third">
        <button
          class="button is-fullwidth is-danger is-light"
          @click="sendCommand(COMMAND.HARDHIT)"
        >
          強く殴る
        </button>
        <button
          class="button is-fullwidth is-danger is-light mt-3"
          @click="sendCommand(COMMAND.HIT)"
        >
          殴る
        </button>
      </div>
      <div class="column is-one-third">
        <button class="button is-fullwidth is-link is-light" @click="sendCommand(COMMAND.CURE)">
          治す
        </button>
        <button
          class="button is-fullwidth is-link is-light mt-3"
          @click="sendCommand(COMMAND.HEAL)"
        >
          癒す
        </button>
      </div>
    </div>

    <div v-for="(logs, index) in commandLog" :key="index" class="has-text-left">
      <span class="mr-1">{{ commandLogView(logs.command) }}</span> {{ logs.time }}
    </div>
  </div>
  <div v-else class="my-6">
    <p>遊んでくれてありがとう</p>
    <p>さようなら</p>
  </div>

  <div class="field is-grouped mt-6 mx-5">
    <div class="control">
      <button class="button is-link is-light" @click="toLink('Main')">おわる</button>
    </div>
  </div>

  <error-modal
    v-if="isErrorModal"
    :text="errorModalText"
    :on-close="handler.onErrorModalClose"
  ></error-modal>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import {
  type HumanStatusRequest,
  type HumanNameUpdateRequest,
  type HumanAgeUpdateRequest,
  COMMAND
} from '../../interface/Human'
import { get, updateAge, updateName, updateStatus } from '../../api/human'
import { isLength, currentTime } from '../../logic/utils'

const router = useRouter()

//送信
const formName = ref('')
const formAge = ref()

//表示
const name = ref('ヒータ')
const age = ref(18)
const body = ref(300)
const mental = ref(300)
const limitLife = ref(false)

interface COMMANDLOG {
  command: number
  time: string
}

//行動履歴
const commandLog = ref<COMMANDLOG[]>([])

//エラーモーダル
const isErrorModal = ref(false)
const errorModalText = ref('予期せぬエラーが発生しましました。')

onMounted(async () => {
  await init()
})

const init = async () => {
  try {
    const humanData = await get()
    name.value = humanData.name
    age.value = humanData.age
    body.value = humanData.body
    mental.value = humanData.mental

    limitLife.value = body.value < 0 && mental.value < 0
  } catch (e: any) {
    errorModalText.value = e.response
      ? e.response.data.message
      : '予期せぬエラーが発生しましました。'
    isErrorModal.value = true
  }
}

//名前更新
const sendName = async () => {
  const reqData: HumanNameUpdateRequest = {
    name: formName.value
  }

  try {
    const result = await updateName(reqData)
    name.value = result.name
    commandLogUpdate(COMMAND.NAME_SEND)
  } catch (e: any) {
    errorModalText.value = e.response
      ? e.response.data.message
      : '予期せぬエラーが発生しましました。'
    isErrorModal.value = true
  }
}

//年齢更新
const sendAge = async () => {
  const reqData: HumanAgeUpdateRequest = {
    age: formAge.value
  }

  try {
    const result = await updateAge(reqData)
    age.value = result.age
    commandLogUpdate(COMMAND.AGE_SEND)
  } catch (e: any) {
    errorModalText.value = e.response
      ? e.response.data.message
      : '予期せぬエラーが発生しましました。'
    isErrorModal.value = true
  }
}

//ステータス更新
const sendCommand = async (command: number) => {
  const reqData: HumanStatusRequest = {
    command: command
  }

  try {
    const result = await updateStatus(reqData)
    body.value = result.body
    mental.value = result.mental

    limitLife.value = body.value < 0 && mental.value < 0
    commandLogUpdate(command)
  } catch (e: any) {
    errorModalText.value = e.response
      ? e.response.data.message
      : '予期せぬエラーが発生しましました。'
    isErrorModal.value = true
  }
}

//身体ステータス表示
const bodyStatus = (value: number) => {
  if (value <= 0) {
    return 'すごく悪い'
  } else if (value > 1 && value <= 199) {
    return '悪い'
  } else if (value >= 200 && value <= 299) {
    return 'すこし悪い'
  } else if (value >= 300 && value <= 399) {
    return 'ふつう'
  } else if (value >= 400 && value <= 699) {
    return 'すこし良い'
  } else if (value >= 700 && value <= 999) {
    return '良い'
  } else if (value >= 1000) {
    return 'すごく良い'
  }
}

const commandLogUpdate = (command: number) => {
  if (commandLog.value.length <= 10) {
    commandLog.value.push({ command: command, time: currentTime() })
  } else {
    commandLog.value.shift()
    commandLog.value.push({ command: command, time: currentTime() })
  }
}

const commandLogView = (value: number) => {
  switch (value) {
    case COMMAND.HARDHIT:
      return '強く殴る'
    case COMMAND.HIT:
      return '殴る'
    case COMMAND.CURE:
      return '治す'
    case COMMAND.HEAL:
      return '癒す'
    case COMMAND.NAME_SEND:
      return '名前を送信'
    case COMMAND.AGE_SEND:
      return '年齢を送信'

    default:
      return '強く殴る'
  }
}

const toLink = (toLinkName: string) => {
  router.push({ name: toLinkName })
}

const handler = {
  onErrorModalClose: () => {
    isErrorModal.value = false
  }
}
</script>

<style scope>
.textarea-height {
  height: 300px;
  overflow: scroll;
}

.table-cell-width-mediun {
  width: 50px;
}

.text-nowrap {
  white-space: nowrap;
}

.margin-auto {
  margin: auto;
}
</style>
