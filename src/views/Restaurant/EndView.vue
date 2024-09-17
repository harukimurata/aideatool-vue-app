<template>
  <header-component title="レストラン"></header-component>
  <div class="columns is-mobile is-centered mx-2">
    <div class="column is-11 mt-3">
      <div class="card">
        <div class="card-content">
          <div class="has-text-weight-bold has-text-white has-background-success py-1">
            <p>おなかいっぱいになりましたか</p>
          </div>

          <div v-if="historyStore.cashList.length > 0 && isShow" class="mt-3">
            {{ currentTime() }}
            <div
              v-for="history in historyStore.cashList"
              :key="history.product.id"
              class="columns is-mobile"
            >
              <div class="column has-text-left">{{ history.product.id }}</div>
              <div class="column is-two-thirds has-text-left">
                {{ history.product.name }}
                <p v-if="history.num > 1">@{{ history.product.value }} × {{ history.num }}個</p>
              </div>
              <div class="column pl-0">{{ history.product.value * history.num }}</div>
            </div>
            <div class="columns is-mobile">
              <div class="column is-one-fifth has-text-left text-nowrap">{{ productNum() }} 点</div>
              <div class="column has-text-right text-nowrap">
                合計 {{ productPriceNum() }} 円(税込み)
              </div>
            </div>

            <hr />
            ☆ありがとうございました☆
            <button class="button is-danger is-fullwidth has-text-weight-bold my-3" @click="end()">
              終わる
            </button>
          </div>
          <div v-else class="mt-3 list-void">
            <p>まだまだ食べられますよ</p>
          </div>

          <restaurant-footer></restaurant-footer>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { useRestaurantCartStore } from '../../stores/restaurantCart'
import { useRestaurantHistoryStore } from '../../stores/restaurantHistory'
import { currentTime } from '../../logic/utils'
const cartStore = useRestaurantCartStore()
const historyStore = useRestaurantHistoryStore()

const isShow = ref(true)

//追加件数
const productNum = () => {
  if (historyStore.cashList.length) {
    let num = 0
    historyStore.cashList.forEach((history) => {
      num = num + history.num
    })
    return num
  } else {
    return 0
  }
}

//合計金額
const productPriceNum = () => {
  if (historyStore.cashList.length) {
    let num = 0
    historyStore.cashList.forEach((history) => {
      num = num + history.product.value * history.num
    })
    return num
  } else {
    return 0
  }
}

function end() {
  cartStore.deleteAllItem()
  historyStore.deleteAllItem()
  isShow.value = false
}
</script>

<style scope>
.list-void {
  height: 65vh;
}
</style>
