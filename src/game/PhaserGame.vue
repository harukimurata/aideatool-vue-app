<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import { EventBus } from './EventBus'
import StartGame from './main'
import Phaser from 'phaser'

// Save the current scene instance
const scene = ref()
const game = ref()

const emit = defineEmits(['current-active-scene'])

onMounted(() => {
  game.value = StartGame('game-container')

  EventBus.on('current-scene-ready', (scene_instance: Phaser.Scene) => {
    emit('current-active-scene', scene_instance)

    scene.value = scene_instance
  })
})

onUnmounted(() => {
  if (game.value) {
    game.value.destroy(true)
    game.value = null
  }
})

defineExpose({ scene, game })
</script>

<template>
  <div class="game-window">
    <div id="game-container"></div>
  </div>
</template>

<style>
.game-window {
  width: 100%;
  height: 80vh;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
