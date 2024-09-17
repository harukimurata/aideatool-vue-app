<template>
  <header-component title="レストラン"></header-component>
  <div class="columns is-mobile is-centered mx-2">
    <div class="column is-11 mt-3">
      <div class="card">
        <div class="card-content">
          <div v-if="!isNext">
            <div class="has-text-weight-bold has-text-white has-background-success py-1">
              <p>番号を入力してください</p>
            </div>

            <div v-if="restaurantResult">
              <p
                class="has-text-left has-text-weight-bold has-text-success has-background-success-light py-1 my-2 pl-2"
              >
                {{ restaurantResult.name }}
              </p>
              <div class="has-text-right mb-2">
                <button
                  class="button has-text-weight-bold has-text-white is-danger"
                  @click="isNext = true"
                >
                  次へ進む
                </button>
              </div>
            </div>
            <h1 v-else class="title has-text-center has-text-success pt-3">レストラン</h1>

            <div class="field has-addons">
              <div class="control">
                <input class="input is-primary" type="text" v-model="productNumber" readonly />
              </div>
              <div class="control">
                <button v-if="productNumber.length" class="button is-success" @click="send()">
                  検索
                </button>
                <button v-else class="button is-success" disabled>検索</button>
              </div>
            </div>

            <div class="columns is-mobile mt-2 mb-0">
              <div class="column is-one-third">
                <button class="button is-fullwidth has-text-weight-bold" @click="inputNumber(1)">
                  1
                </button>
              </div>
              <div class="column is-one-third">
                <button class="button is-fullwidth has-text-weight-bold" @click="inputNumber(2)">
                  2
                </button>
              </div>
              <div class="column is-one-third">
                <button class="button is-fullwidth has-text-weight-bold" @click="inputNumber(3)">
                  3
                </button>
              </div>
            </div>
            <div class="columns is-mobile mb-0">
              <div class="column is-one-third">
                <button class="button is-fullwidth has-text-weight-bold" @click="inputNumber(4)">
                  4
                </button>
              </div>
              <div class="column is-one-third">
                <button class="button is-fullwidth has-text-weight-bold" @click="inputNumber(5)">
                  5
                </button>
              </div>
              <div class="column is-one-third">
                <button class="button is-fullwidth has-text-weight-bold" @click="inputNumber(6)">
                  6
                </button>
              </div>
            </div>
            <div class="columns is-mobile mb-0">
              <div class="column is-one-third">
                <button class="button is-fullwidth has-text-weight-bold" @click="inputNumber(7)">
                  7
                </button>
              </div>
              <div class="column is-one-third">
                <button class="button is-fullwidth has-text-weight-bold" @click="inputNumber(8)">
                  8
                </button>
              </div>
              <div class="column is-one-third">
                <button class="button is-fullwidth has-text-weight-bold" @click="inputNumber(9)">
                  9
                </button>
              </div>
            </div>
            <div class="columns is-mobile">
              <div class="column is-one-third"></div>
              <div class="column is-one-third">
                <button class="button is-fullwidth has-text-weight-bold" @click="inputNumber(0)">
                  0
                </button>
              </div>
              <div class="column is-one-third">
                <button
                  class="button is-fullwidth has-text-weight-bold"
                  @click="deleteInputNumber()"
                >
                  削除
                </button>
              </div>
            </div>
          </div>
          <div v-else>
            <div class="has-text-weight-bold has-text-white has-background-success py-1">
              <p>数量を入力してください</p>
            </div>
            <div v-if="restaurantResult">
              <p class="has-text-left has-text-weight-bold py-1 my-0 pl-2">
                {{ restaurantResult.name }}
              </p>
              <p class="has-text-right has-text-weight-bold py-1 mt-0 pl-2">
                {{ restaurantResult.value }} 円
              </p>
              <div class="buttons mb-2">
                <button class="button has-text-weight-bold mx-0" @click="productNumSub()">-</button>
                <p class="has-text-centered has-text-weight-bold mx-2">{{ productNum }}</p>
                <button class="button has-text-weight-bold" @click="productNumAdd()">+</button>
              </div>

              <div class="columns is-mobile">
                <div class="column is-half">
                  <button
                    class="button is-success is-fullwidth has-text-weight-bold"
                    @click="isNext = false"
                  >
                    戻る
                  </button>
                </div>
                <div class="column is-half">
                  <button
                    class="button is-danger is-fullwidth has-text-weight-bold"
                    @click="addCart()"
                  >
                    カートに追加
                  </button>
                </div>
              </div>
            </div>
          </div>

          <restaurant-footer></restaurant-footer>
        </div>
      </div>
    </div>
  </div>

  <router-view></router-view>

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
import { ref } from 'vue'
import { type RestaurantResponse, type RestaurantCart } from '@/interface/Restaurant'
import { productGet } from '../../api/restaurant'
import { useRestaurantCartStore } from '../../stores/restaurantCart'

const cartStore = useRestaurantCartStore()

const isNext = ref(false)
const productNum = ref(1)
const productNumber = ref<string>('')
const restaurantResult = ref<RestaurantResponse | null>(null)
//汎用モーダル
const isCommonModal = ref(false)
const modalTitle = ref('カートに追加しました')
const modalText = ref('検索画面に戻ります')
//エラーモーダル
const isErrorModal = ref(false)
const errorModalText = ref('予期せぬエラーが発生しましました。')

//送信処理
const send = async () => {
  try {
    const result = await productGet(productNumber.value)
    restaurantResult.value = result
  } catch (e: any) {
    errorModalText.value = e.response
      ? e.response.data.message
      : '予期せぬエラーが発生しましました。'
    isErrorModal.value = true
  }
}

//数値入力
function inputNumber(value: number) {
  productNumber.value = productNumber.value + value
}

//入力した数値を削除
function deleteInputNumber() {
  productNumber.value = ''
  restaurantResult.value = null
}

//注文数加算
function productNumAdd() {
  productNum.value++
  if (productNum.value > 99) {
    productNum.value = 99
  }
}

//注文数減算
function productNumSub() {
  productNum.value--

  if (productNum.value < 0) {
    productNum.value = 0
  }
}

//カートに追加
function addCart() {
  const product: RestaurantCart = {
    product: restaurantResult.value!,
    num: productNum.value
  }

  cartStore.addItem(product)
  isCommonModal.value = true
}

const handler = {
  onErrorModalClose: () => {
    isErrorModal.value = false
  },
  onCommonModalClose: () => {
    isCommonModal.value = false
    productNum.value = 1
    productNumber.value = ''
    restaurantResult.value = null
    isNext.value = false
  }
}
</script>

<style scope>
.buttons {
  display: flex;
  justify-content: flex-end;
  align-items: center;
}
</style>
