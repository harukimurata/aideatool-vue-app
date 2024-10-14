<template>
  <header-component title="Game"></header-component>
  <div class="game-window">
    <div id="game-container"></div>
  </div>

  <div class="buttons is-centered mt-3">
    <button class="button" @click="changeScene(SceneKey.SlotScene)">スロット</button>
    <button class="button" @click="changeScene(SceneKey.ScratchScene)">スクラッチ</button>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import Phaser from 'phaser'
import { EventBus } from '@/game/EventBus'
import StartGame from '@/game/main'
import SceneKey from '@/game/const/SceneKey'

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
</script>

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
