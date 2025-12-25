<template>
  <header-component title="レストラン"></header-component>
  <div class="columns is-mobile is-centered mx-2">
    <div class="column is-11 mt-3">
      <div class="card">
        <div class="card-content">
          <div class="has-text-weight-bold has-text-white has-background-success py-1">
            <p>一覧</p>
          </div>
          <div v-if="restaurantResult" class="my-3">
            <div class="history-height">
              <table class="table is-bordered">
                <thead>
                  <tr>
                    <th class="text-nowrap">商品番号</th>
                    <th class="text-nowrap">商品名</th>
                    <th class="text-nowrap">値段</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(data, index) in restaurantResult.data" :key="data.id">
                    <td class="has-text-right">
                      {{ data.id }}
                    </td>
                    <td class="has-text-left pl-2 pr-0">
                      {{ data.name }}
                    </td>
                    <td class="has-text-right">{{ data.value }} 円</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          <restaurant-footer></restaurant-footer>
        </div>
      </div>
    </div>
  </div>

  <router-view></router-view>

  <error-modal
    v-if="isErrorModal"
    :text="errorModalText"
    :on-close="handler.onErrorModalClose"
  ></error-modal>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import { type RestaurantAllResponse } from '@/interface/Restaurant'
import { productGetAll } from '@/api/restaurant'

const restaurantResult = ref<RestaurantAllResponse | null>(null)
//エラーモーダル
const isErrorModal = ref(false)
const errorModalText = ref('予期せぬエラーが発生しましました。')

onMounted(async () => {
  await get()
})

//送信処理
const get = async () => {
  try {
    const result = await productGetAll()
    restaurantResult.value = result
  } catch (e: any) {
    errorModalText.value = e.response
      ? e.response.data.message
      : '予期せぬエラーが発生しましました。'
    isErrorModal.value = true
  }
}

const handler = {
  onErrorModalClose: () => {
    isErrorModal.value = false
  }
}
</script>

<style scope>
.buttons {
  display: flex;
  justify-content: flex-end;
  align-items: center;
}

.history-height {
  max-height: 55vh;
  overflow-y: scroll;
}

.text-nowrap {
  white-space: nowrap;
}
</style>
