<template>
  <div v-if="isInitFinished">
    <h1 class="title pt-3">{{ title }}</h1>
    <div class="columns is-mobile mx-2">
      <div class="column has-text-left">
        <button class="button is-light mr-2" @click="toLink('MatchTableLogin')">ログアウト</button>
      </div>
      <div class="column has-text-right">
        <button class="button is-info mr-2" @click="localUpdate">サーバーと同期</button>
      </div>
    </div>

    <h2 class="title mb-0">対戦結果</h2>
    <div class="columns is-mobile is-centered mx-2">
      <div class="column is-12 px-0">
        <div class="table-width">
          <table class="table is-striped is-bordered">
            <thead>
              <tr>
                <th>Player</th>
                <th v-for="(player, index) in playerList" :key="index" class="text-nowrap">
                  {{ player.name }}
                </th>
                <th>勝ち数</th>
                <th>勝率</th>
                <th>順位</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(player_vertical, vertical_index) in playerList" :key="vertical_index">
                <th class="text-nowrap">{{ player_vertical.name }}</th>
                <td
                  v-for="(player_horizontal, horizontal_index) in playerList"
                  :key="horizontal_index"
                >
                  <div v-if="vertical_index == horizontal_index">―</div>
                  <div v-else>
                    <div v-show="!isButtonView" class="columns is-mobile is-centered mb-0">
                      <div class="column is-half">
                        <button
                          class="button is-danger is-small"
                          @click="setResult(player_vertical.id, player_horizontal.id, 1)"
                        >
                          勝ち
                        </button>
                      </div>
                      <div class="column is-half">
                        <button
                          class="button is-info is-small"
                          @click="setResult(player_vertical.id, player_horizontal.id, 0)"
                        >
                          負け
                        </button>
                      </div>
                    </div>
                    <p class="mt-1" :class="textColor(player_vertical.id, player_horizontal.id)">
                      {{ resultConvert(player_vertical.id, player_horizontal.id) }}
                    </p>
                  </div>
                </td>
                <td>
                  <p class="table-cell-width-mediun">
                    {{ countWinner(player_vertical.id) }}
                  </p>
                </td>
                <td>
                  <p class="table-cell-width-mediun">
                    {{ calcWinningPercentage(player_vertical.id) }}%
                  </p>
                </td>
                <td>
                  <p class="table-cell-width-mediun">{{ calcRank(player_vertical.id) }}位</p>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="has-text-left ml-2">
          <label class="checkbox">
            <input type="checkbox" v-model="isButtonView" />
            ボタン非表示
          </label>
        </div>

        <h2 class="title mt-3 mb-0">対戦カード</h2>
        <p class="has-text-left ml-2">全 {{ orderList.length }}試合</p>

        <table class="table is-striped is-bordered">
          <thead>
            <tr>
              <th>対戦カード</th>
              <th>対戦状況</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(order, index) in orderList" :key="index">
              <th>
                {{ findPlayerName(order.playerA_id) }} vs {{ findPlayerName(order.playerB_id) }}
              </th>
              <td>
                <button
                  class="button"
                  :class="battleState(order.status).color"
                  @click="battleFlow(index)"
                >
                  {{ battleState(order.status).state }}
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <button class="button is-primary is-large mb-3" @click="updateModalIsActive()">
      変更を送信する
    </button>

    <div class="modal" :class="{ 'is-active': isAuthPasswordModal }">
      <div class="modal-background"></div>
      <div class="modal-card px-3">
        <header class="modal-card-head">
          <p class="modal-card-title">認証パスワードが設定されています。</p>
          <button class="delete" aria-label="close" @click="isAuthPasswordModal = false"></button>
        </header>
        <section class="modal-card-body">
          <p>認証パスワードを入力してください。</p>
          <input class="input" type="password" v-model="authPassword" />
        </section>
        <footer class="modal-card-foot">
          <button class="button is-success" @click="serverUpdate">送信</button>
          <button class="button" @click="isAuthPasswordModal = false">やめる</button>
        </footer>
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
import { onMounted, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { getMatchTable, updateMatchTable } from '../../api/matchTable'
import { useMatchTableDataStore } from '../../stores/matchTableData'
import { useMatchTableLoginInfoStore } from '../../stores/matchTableLoginInfo'
import { type MatchTableUpdateRequest } from '../../interface/MatchTable'
import { type MatchTablePlayerEntity } from '../../interface/entity/matchTablePlayer'
import { type MatchTableOrderEntity } from '../../interface/entity/matchTableOrder'
import { type MatchTableResultEntity } from '../../interface/entity/matchTableResult'

const router = useRouter()
const matchTableDataStore = useMatchTableDataStore()
const matchTableLoginInfoStore = useMatchTableLoginInfoStore()

const title = ref<string>('')
const playerList = ref<MatchTablePlayerEntity[]>([])
const resultList = ref<MatchTableResultEntity[]>([])
const orderList = ref<MatchTableOrderEntity[]>([])
const authPassword = ref('')

//初期化終了フラグ
const isInitFinished = ref(false)
//汎用モーダル
const isCommonModal = ref(false)
const modalTitle = ref('')
const modalText = ref('')
//エラーモーダル
const isErrorModal = ref(false)
const errorModalText = ref('予期せぬエラーが発生しましました。')
//その他制御系
const isUpdateRequest = ref(false)
const isAuthPasswordModal = ref(false)
const isButtonView = ref(false)

onMounted(() => {
  init()
})

/**
 * 初期化
 */
const init = () => {
  if (matchTableDataStore.matchTableData == null) {
    errorModalText.value = '大会情報が見つかりませんでした。'
    isErrorModal.value = true
  } else {
    console.log('matchTableDataStore', matchTableDataStore)
    //タイトル生成
    title.value = matchTableDataStore.matchTableData.matchTable.title

    //プレイヤー生成
    playerList.value = matchTableDataStore.matchTableData.matchTablePlayer

    //結果生成
    resultList.value = matchTableDataStore.matchTableData.matchTableResult

    //対戦表生成
    orderList.value = matchTableDataStore.matchTableData.matchTableOrder

    isInitFinished.value = true
  }
}

/**
 * 勝ち数計算
 */
const countWinner = (playerA_id: number) => {
  let resultNum = 0
  for (const val of resultList.value) {
    if (val.playerA_id == playerA_id) {
      resultNum = resultNum + val.result
    }
  }
  return resultNum
}

/**
 * 勝率計算
 */
const calcWinningPercentage = (playerA_id: number) => {
  let resultNum = 0
  for (const val of resultList.value) {
    if (val.playerA_id == playerA_id) {
      resultNum = resultNum + val.result
    }
  }
  const winPercentage = resultNum / (resultNum + (playerList.value.length - 1 - resultNum))
  return (winPercentage * 100).toFixed(1)
}

/**
 * 順位計算
 */
const calcRank = (playerA_id: number) => {
  let rankList = []

  for (const player of playerList.value) {
    rankList.push({ player_id: player.id, winCount: countWinner(player.id) })
  }

  const sortRankList = rankList.sort((a, b) => {
    return b.winCount - a.winCount
  })

  let rank = 0
  sortRankList.forEach((list, index) => {
    if (playerA_id == list.player_id) {
      rank = index + 1
    }
  })

  return rank
}

/**
 * 勝敗投入
 * @param verti
 * @param hori
 * @param value
 */
const setResult = (playerA_id: number, playerB_id: number, value: number) => {
  resultList.value.forEach((result) => {
    if (result.playerA_id == playerA_id && result.playerB_id == playerB_id) {
      result.result = value == 1 ? 1 : 0
    }

    if (result.playerB_id == playerA_id && result.playerA_id == playerB_id) {
      result.result = value !== 1 ? 1 : 0
    }
  })
}

/**
 * 勝ち負け表示
 * @param value
 */
const resultConvert = (playerA_id: number, playerB_id: number) => {
  const result = resultList.value.find((value) => {
    return value.playerA_id == playerA_id && value.playerB_id == playerB_id
  })
  return result?.result == 1 ? '勝ち' : '負け'
}

/**
 * フォントカラー変更
 * @param value
 */
const textColor = (playerA_id: number, playerB_id: number) => {
  const result = resultList.value.find((value) => {
    return value.playerA_id == playerA_id && value.playerB_id == playerB_id
  })
  return result?.result == 1 ? 'has-text-danger' : 'has-text-info'
}

/**
 * プレイヤー名表示
 * @param index
 */
const findPlayerName = (index: number) => {
  const player = playerList.value.find((value) => {
    return value.id == index
  })

  return player?.name
}

/**
 * 対戦状況更新
 * @param index
 */
const battleFlow = (index: number) => {
  if (orderList.value[index].status == 2) {
    orderList.value[index].status = 0
  } else {
    orderList.value[index].status = orderList.value[index].status + 1
  }
}

/**
 * 対戦状況管理
 * @param value
 */
const battleState = (value: number) => {
  switch (value) {
    case 0:
      return { state: '対戦前', color: 'is-light' }
    case 1:
      return { state: '対戦中', color: 'is-info' }
    case 2:
      return { state: '終了', color: 'is-success' }
    default:
      return { state: '対戦前', color: 'is-light' }
  }
}

/**
 * ローカルデータの更新
 * サーバーと同期
 */
const localUpdate = async () => {
  try {
    if (!matchTableLoginInfoStore.matchTableLoginInfo) {
      return
    }
    const result = await getMatchTable(matchTableLoginInfoStore.matchTableLoginInfo)
    matchTableDataStore.update(result)
    init()
  } catch (e: any) {
    errorModalText.value = e.response
      ? e.response.data.message
      : '予期せぬエラーが発生しましました。'
    isErrorModal.value = true
  }
}

/**
 * データ送信時のモーダル表示判定
 */
const updateModalIsActive = async () => {
  isUpdateRequest.value = true
  if (!matchTableDataStore.matchTableData) {
    return
  }

  if (matchTableDataStore.matchTableData.matchTable.auth_password) {
    isAuthPasswordModal.value = true
  } else {
    await serverUpdate()
  }
}

/**
 * ローカルデータ送信
 */
const serverUpdate = async () => {
  if (!matchTableLoginInfoStore.matchTableLoginInfo) {
    return
  }
  try {
    const reqData: MatchTableUpdateRequest = {
      match_id: matchTableLoginInfoStore.matchTableLoginInfo.match_id,
      auth_password: authPassword.value,
      matchTableResult: resultList.value,
      matchTableOrder: orderList.value
    }
    console.log('reqData', reqData)
    const result = await updateMatchTable(reqData)
    modalTitle.value = ''
    modalText.value = result.message
    isCommonModal.value = true
  } catch (e: any) {
    errorModalText.value = e.response
      ? e.response.data.message
      : '予期せぬエラーが発生しましました。'
    isErrorModal.value = true
  }
}

const handler = {
  onCommonModalClose: () => {
    isCommonModal.value = false
    isAuthPasswordModal.value = false
  },
  onErrorModalClose: () => {
    isErrorModal.value = false
    if (!isUpdateRequest.value) {
      toLink('MatchTableLogin')
    }
    isUpdateRequest.value = false
  }
}

const toLink = (toLinkName: string) => {
  router.push({ name: toLinkName })
}
</script>

<style scope>
.table-width {
  max-width: 840px;
  overflow: scroll;
}

.table-cell-width-mediun {
  width: 50px;
}

.text-nowrap {
  white-space: nowrap;
}
</style>
