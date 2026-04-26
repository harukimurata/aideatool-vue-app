<template>
  <footer class="footer has-background-grey-light">
    <div class="content has-text-centered">
      <p>&copy; {{ currentYear }} harumaki</p>
    </div>
  </footer>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

const currentYear = ref(new Date().getFullYear())
</script>
