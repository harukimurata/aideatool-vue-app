<template>
  <div class="modal is-active">
    <div class="modal-background"></div>
    <div class="modal-card px-3">
      <header class="modal-card-head">
        <p class="modal-card-title">エラーが発生しました</p>
        <button class="delete" aria-label="close" @click="onClose"></button>
      </header>
      <section class="modal-card-body">
        {{ props.text }}
      </section>
      <footer class="modal-card-foot">
        <button class="button" @click="onClose">とじる</button>
      </footer>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { type PropType, defineProps } from 'vue'

const props = defineProps({
  text: {
    type: String,
    requirerd: true
  },
  onClose: {
    type: Function as PropType<() => void>,
    requirerd: true
  }
})
</script>

<style scoped>
.main-heght {
  height: 100vh;
}
</style>
