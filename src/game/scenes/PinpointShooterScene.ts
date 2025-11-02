import { GameObjects, Scene } from 'phaser'

import { EventBus } from '../EventBus'
import { SceneKey, SceneKeyIndex } from '../const/SceneKey'
import TextureKey from '../const/TextureKey'
import ImageButton from '../components/ImageButton'
import DebugTexts from '../components/DebugTexts'
import { arrowFlightDistance } from '../logic/physics'

const BOW_SPRING_CONSTANT = 300 // N/m
const ARROW_MASS = 0.05 // kg
const BOW_DRAW_DISTANCE = 0.5 // m 変数で決めるようにする
const SHOOTING_ANGLE_DEG = 45 // degrees 変数で決めるようにする

export class PinpointShooterScene extends Scene {
  // ゲーム内時間
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

    // 画面サイズ
    this.gameWidth = this.scale.width
    this.gameHeight = this.scale.height

    this.add.image(this.gameWidth / 2, this.gameHeight / 2, TextureKey.DefaultBg)

    this.debugTexts = new DebugTexts()
    this.debugTexts.init(this, [
      'Pinpoint Shooter Scene',
      'World Time: {1} sec',
      'arrowFlightDistance: {1} m'
    ])

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

    const flightDistance = arrowFlightDistance(
      BOW_SPRING_CONSTANT,
      BOW_DRAW_DISTANCE,
      ARROW_MASS,
      SHOOTING_ANGLE_DEG
    )
    this.debugTexts.replaceVariable(2, flightDistance.toFixed(2))
  }

  update(time: number, delta: number): void {
    if (!this.stop) {
      const worldTime = (this.time.now - this.worldTime) / 1000
      this.debugTexts.replaceVariable(1, worldTime.toFixed(1))
    }
  }

  public worldReset() {
    this.worldTime = this.time.now
  }

  public worldStop() {
    this.stop = !this.stop
  }
}
