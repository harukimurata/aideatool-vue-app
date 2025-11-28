type SceneKeyType = {
  name: string
  scene_name: string
}

export const SceneKeyIndex = {
  SlotScene: 0,
  ScratchScene: 1,
  PinpointShooterScene: 2
}

export const SceneKey: SceneKeyType[] = [
  {
    name: 'スロット',
    scene_name: 'SlotScene'
  },
  {
    name: '年賀状企画 2025 -銀削-',
    scene_name: 'ScratchScene'
  },
  {
    name: '年賀状企画 2026 -的屋-',
    scene_name: 'PinpointShooterScene'
  }
]
