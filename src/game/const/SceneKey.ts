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
    name: 'スクラッチ',
    scene_name: 'ScratchScene'
  },
  {
    name: 'ピンポイントシューター',
    scene_name: 'PinpointShooterScene'
  }
]
