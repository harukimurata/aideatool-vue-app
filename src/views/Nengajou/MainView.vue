<template>
  <header-component title="年賀状"></header-component>
  <div class="columns is-mobile is-centered mx-2">
    <div class="column is-11 mt-3">
      <div class="card">
        <div class="card-content">
          <h1 class="title pt-3">年賀状 ver.2024</h1>
          <div class="has-text-center">
            <p>あけましておめでとうございます。</p>
            <p>今年もいい一年にしましょう！</p>
            <p>ハイレートおみくじが出来るので</p>
            <p>遊んで行ってください！</p>
          </div>
          <div v-if="omikujiResult == null">
            <button v-if="!isloading" class="button is-success is-large mt-3" @click="omikujiSend">
              おみくじを引く
            </button>
            <p v-else>ガラ．．．ガラ．．．ガラ．．．</p>
          </div>
          <div v-else>
            <div class="card has-background-warning-light mt-3">
              <div class="card-content">
                <div class="media">
                  <div class="media-content">
                    <p class="title is-4">{{ omikujiResult!.value }}</p>
                  </div>
                </div>

                <div class="content">
                  <div class="mb-2">
                    <p class="has-text-weight-bold mb-1">運勢</p>
                    {{ omikujiResult!.text }}
                  </div>
                  <div>
                    <p class="has-text-weight-bold mb-1">ラッキーアイテム</p>
                    {{ omikujiResult!.item }}
                  </div>
                </div>
              </div>
            </div>
            <button class="button is-success is-large mt-3" @click="omikujiSend">
              もう一度引く
            </button>
          </div>
        </div>
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
import { ref } from 'vue'
import { type GachaResponse } from '@/interface/Gacha'
import { omikuji } from '../../api/omikuji'

const isloading = ref(false)
const omikujiResult = ref<GachaResponse | null>(null)
//エラーモーダル
const isErrorModal = ref(false)
const errorModalText = ref('予期せぬエラーが発生しましました。')

//送信処理
const omikujiSend = async () => {
  try {
    isloading.value = true
    const result = await omikuji()
    omikujiResult.value = result
  } catch (e: any) {
    errorModalText.value = e.response
      ? e.response.data.message
      : '予期せぬエラーが発生しましました。'
    isErrorModal.value = true
  } finally {
    isloading.value = false
  }
}

const handler = {
  onErrorModalClose: () => {
    isErrorModal.value = false
  }
}
</script>

<style scope></style>
