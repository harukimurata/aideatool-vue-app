import { GameObjects, Scene } from 'phaser'

import { EventBus } from '../EventBus'
import { SceneKey, SceneKeyIndex } from '../const/SceneKey'
import TextureKey from '../const/TextureKey'
import ImageButton from '../components/ImageButton'
import DebugTexts from '../components/DebugTexts'

export class PinpointShooterScene extends Scene {
  private worldTime = 0

  private stop = false

  private gameWidth = 0
  private gameHeight = 0

  // デバッグ用テキスト
  private debugTexts!: DebugTexts

  slotResetButton!: ImageButton
  slotPauseButton!: ImageButton

  constructor() {
    super(SceneKey[SceneKeyIndex.PinpointShooterScene].scene_name)
  }

  create() {
    EventBus.emit('current-scene-ready', this)

    //ゲーム内の時間
    this.worldTime = this.time.now

    this.gameWidth = this.scale.width
    this.gameHeight = this.scale.height

    this.add.image(this.gameWidth / 2, this.gameHeight / 2, TextureKey.DefaultBg)

    this.debugTexts = new DebugTexts()
    this.debugTexts.init(this, 'Pinpoint Shooter Scene')
    this.debugTexts.init(this, 'World Time: 0 sec')

    this.slotResetButton = new ImageButton(
      this,
      this.gameWidth / 2,
      this.gameHeight / 2,
      TextureKey.SlotStartA,
      TextureKey.SlotStartB,
      () => {
        this.worldReset()
      }
    ).setScale(0.7)
    this.add.existing(this.slotResetButton)

    this.slotPauseButton = new ImageButton(
      this,
      this.gameWidth / 2,
      this.gameHeight / 2 + 100,
      TextureKey.SlotStartA,
      TextureKey.SlotStartB,
      () => {
        this.worldStop()
      }
    ).setScale(0.7)
    this.add.existing(this.slotPauseButton)
  }

  update(time: number, delta: number): void {
    if (!this.stop) {
      const worldTime = (this.time.now - this.worldTime) / 1000
      this.debugTexts.setTextString(1, `World Time: ${worldTime.toFixed(1)} sec`)
    }
  }

  public worldReset() {
    this.worldTime = this.time.now
  }

  public worldStop() {
    this.stop = !this.stop
  }
}
