import { GameObjects, Scene } from 'phaser'

import { EventBus } from '../EventBus'
import SceneKey from '../const/SceneKey'

export class ScratchScene extends Scene {
  constructor() {
    super(SceneKey.ScratchScene)
  }

  create() {
    const gameWidth = this.scale.width
    const gameHeight = this.scale.height

    this.add
      .text(gameWidth / 2, gameHeight / 2, 'ScratchScene', {
        fontFamily: 'Arial Black',
        fontSize: 64,
        color: '#ffffff',
        stroke: '#000000',
        strokeThickness: 8,
        align: 'center'
      })
      .setOrigin(0.5)
      .setDepth(100)

    EventBus.emit('current-scene-ready', this)
  }
}
