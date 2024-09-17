<template>
  <header-component title="レストラン"></header-component>
  <div class="columns is-mobile is-centered mx-2">
    <div class="column is-11 mt-3">
      <div class="card">
        <div class="card-content">
          <div class="has-text-weight-bold has-text-white has-background-success py-1">
            <p>履歴</p>
          </div>
          <div v-if="historyStore.historyList.length" class="my-3">
            <div class="history-height">
              <table class="table is-bordered">
                <thead>
                  <tr>
                    <th></th>
                    <th class="text-nowrap">商品名</th>
                    <th class="text-nowrap">商品番号</th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="(history, index) in historyStore.historyList"
                    :key="history.product.id"
                  >
                    <td>{{ index + 1 }}</td>
                    <td class="table-product-name has-text-left pl-2 pr-0">
                      {{ history.product.name }}
                    </td>
                    <td class="table-product-name has-text-right">
                      {{ history.product.id }}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          <div v-else class="mt-3 list-void">履歴はありません</div>

          <restaurant-footer></restaurant-footer>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useRestaurantHistoryStore } from '../../stores/restaurantHistory'

const historyStore = useRestaurantHistoryStore()
</script>

<style scope>
.list-void {
  height: 65vh;
}

.table-product-name {
  width: 100%;
}
.history-height {
  max-height: 55vh;
  overflow-y: scroll;
}

.text-nowrap {
  white-space: nowrap;
}
</style>
