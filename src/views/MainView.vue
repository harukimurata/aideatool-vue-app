<template>
  <header-component></header-component>

  <div class="columns is-mobile is-centered mx-2">
    <div class="column is-11 mt-3">
      <div class="card">
        <div class="card-content">
          <h1 class="title pt-3">aideaTool</h1>
          <div class="columns">
            <div class="column is-half is-offset-one-quarter">
              <button class="button is-fullwidth" @click="toLink('Blog')">後日談</button>
            </div>
          </div>
          <div class="columns">
            <div class="column is-half is-offset-one-quarter">
              <button class="button is-fullwidth" @click="toLink('MatchTableModeSelect')">
                対戦表つくーる
              </button>
            </div>
          </div>
          <div class="columns">
            <div class="column is-half is-offset-one-quarter">
              <button class="button is-fullwidth" @click="toLink('Human')">Human</button>
            </div>
          </div>
          <div class="columns">
            <div class="column is-half is-offset-one-quarter">
              <button class="button is-fullwidth" @click="toLink('Restaurant')">レストラン</button>
            </div>
          </div>
          <div class="columns">
            <div class="column is-half is-offset-one-quarter">
              <button class="button is-fullwidth" @click="toLink('Game')">ゲーム</button>
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
