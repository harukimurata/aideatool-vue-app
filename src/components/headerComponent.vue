<template>
  <nav class="navbar nav-position" role="navigation" aria-label="main navigation">
    <div class="navbar-brand">
      <h1 class="navbar-item"><router-link :to="{ name: 'Main' }">aideaTool</router-link></h1>
      <span class="navbar-item is-size-7 px-0">{{ subTitle(title) }}</span>
    </div>
  </nav>
</template>

<script lang="ts" setup>
defineProps({
  title: {
    type: String,
    requirerd: true
  }
})

const subTitle = (value: string | undefined) => {
  return value ? `/ ${value}` : ''
}
</script>

<style>
.nav-position {
  position: sticky;
  top: 0px;
}
</style>
