<template>
  <div class="columns is-mobile">
    <div class="column is-one-quarter px-1">
      <button
        class="button is-fullwidth has-text-success has-text-weight-bold"
        @click="toLink('Restaurant')"
      >
        追加
      </button>
    </div>
    <div class="column is-one-quarter px-1">
      <button
        class="button is-fullwidth has-text-success has-text-weight-bold"
        @click="toLink('RestaurantCart')"
      >
        カート
      </button>
    </div>
    <div class="column is-one-quarter px-1">
      <button
        class="button is-fullwidth has-text-success has-text-weight-bold"
        @click="toLink('RestaurantHistory')"
      >
        履歴
      </button>
    </div>
    <div class="column is-one-quarter px-1">
      <button
        class="button is-fullwidth has-text-success has-text-weight-bold"
        @click="toLink('RestaurantEnd')"
      >
        詳細
      </button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useRouter } from 'vue-router'

const router = useRouter()
const toLink = (toLinkName: string) => {
  router.push({ name: toLinkName })
}
</script>
