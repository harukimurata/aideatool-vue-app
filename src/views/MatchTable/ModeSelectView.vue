<template>
  <header-component title="対戦表つくーる"></header-component>
  <div class="columns is-mobile is-centered mx-2">
    <div class="column is-11 mt-3">
      <div class="card">
        <div class="card-content">
          <h1 class="title pt-3">対戦表つくーる</h1>
          <div class="columns">
            <div class="column is-half is-offset-one-quarter">
              <button class="button is-fullwidth" @click="toLink('MatchTableCreate')">
                作成する
              </button>
            </div>
          </div>
          <div class="columns">
            <div class="column is-half is-offset-one-quarter">
              <button class="button is-fullwidth" @click="toLink('MatchTableLogin')">
                参加する
              </button>
            </div>
          </div>

          <div class="field is-grouped mt-6">
            <div class="control">
              <button class="button is-link is-light" @click="toLink('Main')">戻る</button>
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
