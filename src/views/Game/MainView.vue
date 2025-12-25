<template>
  <header-component title="Game"></header-component>
  <div :class="isPc ? 'pc-game-window' : 'mobile-game-window'">
    <div id="game-container"></div>
  </div>

  <div class="buttons is-centered mt-3">
    <div v-for="item in SceneKey" :key="item.scene_name">
      <button class="button" @click="changeScene(item.scene_name)">{{ item.name }}</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref, computed } from 'vue'
import Phaser from 'phaser'
import { EventBus } from '@/game/EventBus'
import StartGame from '@/game/main'
import { SceneKey } from '@/game/const/SceneKey'

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

function changeScene(sceneName: string) {
  scene.value.scene.start(sceneName)
}

const isPc = computed(() => {
  return window.innerWidth >= 1024
})
</script>

<style>
.pc-game-window {
  width: 100%;
  height: 80vh;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
}

.mobile-game-window {
  width: 100%;
  height: 60vh;
  margin-top: 10%;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
