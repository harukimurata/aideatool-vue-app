<template>
  <div class="has-background-grey-light main-height">
    <div class="is-main-center" :class="{ 'pc-window': isPc }">
      <router-view />
    </div>
  </div>
  <footer-component></footer-component>
</template>

<script lang="ts" setup>
import { computed } from 'vue'

document.addEventListener(
  'dblclick',
  function (e) {
    e.preventDefault()
  },
  { passive: false }
)

const isPc = computed(() => {
  return window.innerWidth >= 1024
})
</script>

<style lang="scss">
@import '../node_modules/bulma/bulma.sass';
.is-main-center {
  margin: auto;
}

.pc-window {
  width: 900px;
}

.main-height {
  min-height: 100vh;
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>
