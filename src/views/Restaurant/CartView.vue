<template>
  <header-component title="レストラン"></header-component>
  <div class="columns is-mobile is-centered mx-2">
    <div class="column is-11 mt-3">
      <div class="card">
        <div class="card-content">
          <div class="has-text-weight-bold has-text-white has-background-success py-1">
            <p>内容を確認して「確定」</p>
          </div>
          <div v-if="cartStore.items.length > 0">
            <div class="cart-height">
              <div v-for="(cart, index) in cartStore.items" :key="cart.product.id">
                <p class="has-text-left has-text-weight-bold py-1 my-0 pl-2">
                  {{ cart.product.name }}
                </p>
                <p class="has-text-right has-text-weight-bold py-1 mt-0 pl-2">
                  {{ cart.product.value }} 円
                </p>
                <div class="buttons mb-2">
                  <button class="button has-text-weight-bold mx-0" @click="productNumSub(index)">
                    -
                  </button>
                  <p class="has-text-centered has-text-weight-bold mx-2">{{ cart.num }}</p>
                  <button class="button has-text-weight-bold" @click="productNumAdd(index)">
                    +
                  </button>
                </div>
              </div>
            </div>

            <div class="columns is-mobile">
              <div class="column is-one-fifth has-text-left text-nowrap">{{ productNum() }} 点</div>
              <div class="column has-text-right text-nowrap">
                合計 {{ productPriceNum() }} 円(税込み)
              </div>
            </div>
            <div class="columns is-mobile">
              <div class="column is-half">
                <button
                  class="button is-success is-fullwidth has-text-weight-bold"
                  @click="toLink('Restaurant')"
                >
                  追加
                </button>
              </div>
              <div class="column is-half">
                <button
                  class="button is-danger is-fullwidth has-text-weight-bold"
                  @click="submit()"
                >
                  確定
                </button>
              </div>
            </div>
          </div>
          <div v-else class="mt-3 list-void">商品を追加してください</div>

          <restaurant-footer></restaurant-footer>
        </div>
      </div>
    </div>
  </div>

  <common-modal
    v-if="isCommonModal"
    :title="modalTitle"
    :text="modalText"
    :on-close="handler.onCommonModalClose"
  ></common-modal>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { useRestaurantCartStore } from '../../stores/restaurantCart'
import { useRestaurantHistoryStore } from '@/stores/restaurantHistory'
import { useRouter } from 'vue-router'

const router = useRouter()
const cartStore = useRestaurantCartStore()
const historyStore = useRestaurantHistoryStore()

//汎用モーダル
const isCommonModal = ref(false)
const modalTitle = ref('確定しました')
const modalText = ref('検索画面に戻ります')

//注文数加算
function productNumAdd(index: number) {
  cartStore.items[index].num++
  if (cartStore.items[index].num > 99) {
    cartStore.items[index].num = 99
  } else {
    cartStore.items[index].num = cartStore.items[index].num
  }
}

//注文数減算
function productNumSub(index: number) {
  cartStore.items[index].num--
  if (cartStore.items[index].num < 0) {
    cartStore.items[index].num = 0
  } else {
    cartStore.items[index].num = cartStore.items[index].num
  }
}

//追加件数
const productNum = () => {
  if (cartStore.items.length) {
    let num = 0
    cartStore.items.forEach((cart) => {
      num = num + Number(cart.num)
    })
    return num
  } else {
    return 0
  }
}

//合計金額
const productPriceNum = () => {
  if (cartStore.items.length) {
    let num = 0
    cartStore.items.forEach((cart) => {
      num = num + cart.product.value * Number(cart.num)
    })
    return num
  } else {
    return 0
  }
}

function submit() {
  const filterCart = cartStore.items.filter((cart) => Number(cart.num) !== 0)
  console.log('filterCart', filterCart)
  historyStore.addHistoryItem(filterCart)
  historyStore.addCashItem(filterCart)

  isCommonModal.value = true
}

const handler = {
  onCommonModalClose: () => {
    isCommonModal.value = false
    cartStore.deleteAllItem()
    toLink('Restaurant')
  }
}

const toLink = (toLinkName: string) => {
  router.push({ name: toLinkName })
}
</script>

<style scope>
.list-void {
  height: 65vh;
}

.cart-height {
  max-height: 55vh;
  overflow-y: scroll;
}

.text-nowrap {
  white-space: nowrap;
}
</style>
