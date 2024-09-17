<template>
  <div v-if="inputData" class="card-content">
    <h1 class="title pt-3">対戦表作成確認</h1>
    <div class="field">
      <label class="label has-text-left">大会名</label>
      <p class="has-text-left">{{ inputData.title }}</p>
    </div>

    <div class="field">
      <label class="label has-text-left">大会ID</label>
      <p class="has-text-left">{{ inputData.match_id }}</p>
    </div>

    <div class="field">
      <label class="label has-text-left">大会パスワード</label>
      <p class="has-text-left">{{ passwordCover(inputData.password) }}</p>
    </div>

    <div class="field">
      <label class="label has-text-left"
        >編集権限パスワード<span class="tag is-info"> 任意</span></label
      >
      <p class="has-text-left">{{ passwordCover(inputData.auth_password) }}</p>
    </div>

    <label class="label has-text-left">参加プレイヤー</label>

    <div v-for="(player, index) in inputData.player" :key="index">
      <div class="field mx-2">
        <label class="label has-text-left">プレイヤー {{ index + 1 }}</label>
        <p class="has-text-left">{{ player }}</p>
      </div>
    </div>

    <div class="field is-grouped">
      <div class="control">
        <button class="button is-link" @click="onCreate">作成する</button>
      </div>
      <div class="control">
        <button class="button is-link is-light" @click="onBack">戻る</button>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { type PropType, defineProps } from 'vue'
import { type MatchTableCreateRequest } from '../../interface/MatchTable'
defineProps({
  inputData: {
    type: Object as PropType<MatchTableCreateRequest>,
    requirerd: true
  },
  onCreate: {
    type: Function as PropType<() => void>,
    requirerd: true
  },
  onBack: {
    type: Function as PropType<() => void>,
    requirerd: true
  }
})

const passwordCover = (value: string | undefined | null) => {
  if (!value) {
    return '設定なし'
  }
  let password = ''
  for (let i = 0; i < value.length; i++) {
    password = password + '*'
  }
  return password
}
</script>
