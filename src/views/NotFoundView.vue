<template>
  <header-component></header-component>

  <div class="columns is-mobile is-centered mx-2">
    <div class="column is-11 mt-3">
      <div class="card">
        <div class="card-content">
          <h1 class="title pt-3">aideaTool</h1>
          <p class="my-3">ページが見つかりませんでした。</p>
          <div class="columns">
            <div class="column is-half is-offset-one-quarter">
              <button class="button is-fullwidth" @click="toLink('Main')">TOPにもどる</button>
            </div>
          </div>
        </div>
      </div>
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
