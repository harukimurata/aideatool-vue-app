import { GameObjects, Scene } from 'phaser'

import { EventBus } from '../EventBus'
import { SceneKey, SceneKeyIndex } from '../const/SceneKey'
import TextureKey from '../const/TextureKey'
import ImageButton from '../components/ImageButton'
import DebugTexts from '../components/DebugTexts'
import { is3DBoxCollision } from '../logic/collision'
import {
  type ArrowState,
  type MoveState,
  arrowInitialVelocity,
  stepAirResistanceArrowFlight
} from '../logic/physics'

const BOW_SPRING_CONSTANT = 300 // N/m
const ARROW_HEAD_SIZE = 0.03 // m
const ARROW_MASS = 0.05 // kg
const BOW_DRAW_DISTANCE = 0.5 // m 変数で決めるようにする
const SHOOTING_ANGLE_DEG = 8 // degrees 変数で決めるようにする
const START_ARROW_HEIGHT = 1.5 // m
const AIR_RESISTANCE_COEFFICIENT = 1.0 // 空気抵抗係数
const ARROW_CROSS_SECTIONAL_AREA = 0.0005 // m^2
const AIR_DENSITY = 1.225 // kg/m^3
const MOVE_SPEED_X = 0 // km/h
const GRAVITY = 9.8 // m/s^2
const POINT_GRAPH_SCALE = 6 // グラフのスケール
const PARABOLA_GRAPH_BASE_X = 50 // グラフの基準Y座標
const PARABOLA_GRAPH_BASE_Y = 150 // グラフの基準Y座標
const TARGET_POS_Z = 38 // m
const TARGET_POS_X = 0 // m
const TARGET_POS_Y = 1 // m
const TARGET_SIZE_W = 0.6 // m
const TARGET_SIZE_H = 0.6 // m
const TARGET_SIZE_D = 0.1 // m

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

  // 矢の状態
  arrowState: ArrowState = {
    z: 0,
    x: 0,
    y: START_ARROW_HEIGHT,
    vz: 0,
    vx: 0,
    vy: 0
  }
  // 移動状態
  moveState: MoveState = { z: 0, x: MOVE_SPEED_X / 3.6, y: 0 }

  arrowMoveParabolaGraph!: GameObjects.Graphics

  targetPosition = {
    z: TARGET_POS_Z,
    x: TARGET_POS_X,
    y: TARGET_POS_Y
  }
  isTargetHit = false

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
      'arrowFlightDistance: {1}',
      'px arrowFlightDistance: {1}',
      `Target z:${TARGET_POS_Z}, x:${TARGET_POS_X}, y:${TARGET_POS_Y}`,
      'Target is : {1}'
    ])

    this.slotResetButton = new ImageButton(
      this,
      this.gameWidth / 2,
      this.gameHeight / 2,
      TextureKey.SlotBetA,
      TextureKey.SlotBetB,
      () => {
        this.reset()
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
        this.start()
      }
    ).setScale(0.7)
    this.add.existing(this.slotPauseButton)

    //矢の初期化
    this.initArrowState()
    this.debugTexts.replaceVariable(
      1,
      `z: ${this.arrowState.z.toFixed(2)}, x: ${this.arrowState.x.toFixed(
        2
      )}, y: ${this.arrowState.y.toFixed(2)}, vz: ${this.arrowState.vz.toFixed(
        2
      )}, vx: ${this.arrowState.vz.toFixed(2)}, vy: ${this.arrowState.vy.toFixed(2)}`
    )

    this.arrowMoveParabolaGraph = this.add.graphics()
    this.arrowMoveParabolaGraph.clear()
    this.arrowMoveParabolaGraph.lineStyle(2, 0xff0000, 1)

    this.arrowMoveParabolaGraph.moveTo(
      PARABOLA_GRAPH_BASE_X + this.arrowState.z * POINT_GRAPH_SCALE,
      PARABOLA_GRAPH_BASE_Y - this.arrowState.y * POINT_GRAPH_SCALE
    )
  }

  update(time: number, delta: number): void {
    if (this.stop) {
      const dt = delta / 1000 // Phaser のフレーム時間
      this.arrowState = stepAirResistanceArrowFlight(
        this.arrowState,
        ARROW_MASS,
        AIR_RESISTANCE_COEFFICIENT,
        ARROW_CROSS_SECTIONAL_AREA,
        AIR_DENSITY,
        dt
      )

      this.debugTexts.replaceVariable(
        1,
        `z: ${this.arrowState.z.toFixed(2)}, x: ${this.arrowState.x.toFixed(
          2
        )}, y: ${this.arrowState.y.toFixed(2)}, vz: ${this.arrowState.vz.toFixed(
          2
        )}, vx: ${this.arrowState.vz.toFixed(2)}, vy: ${this.arrowState.vy.toFixed(2)}`
      )

      this.debugTexts.replaceVariable(
        2,
        `z: ${(this.arrowState.z * 10).toFixed(2)}, x: ${(this.arrowState.x * 10).toFixed(
          2
        )}, y: ${(this.arrowState.y * 10).toFixed(2)}`
      )

      this.arrowMoveParabolaGraph.lineTo(
        PARABOLA_GRAPH_BASE_X + this.arrowState.z * POINT_GRAPH_SCALE,
        PARABOLA_GRAPH_BASE_Y - this.arrowState.y * POINT_GRAPH_SCALE
      )
      this.arrowMoveParabolaGraph.strokePath()

      if (
        !this.isTargetHit &&
        is3DBoxCollision(
          {
            x: this.arrowState.x - ARROW_HEAD_SIZE / 2,
            y: this.arrowState.y - ARROW_HEAD_SIZE / 2,
            z: this.arrowState.z - ARROW_HEAD_SIZE / 2,
            width: ARROW_HEAD_SIZE,
            height: ARROW_HEAD_SIZE,
            depth: ARROW_HEAD_SIZE
          },
          {
            x: this.targetPosition.x - TARGET_SIZE_W / 2,
            y: this.targetPosition.y - TARGET_SIZE_H / 2,
            z: this.targetPosition.z - TARGET_SIZE_D / 2,
            width: TARGET_SIZE_W,
            height: TARGET_SIZE_H,
            depth: TARGET_SIZE_D
          }
        )
      ) {
        this.isTargetHit = true
        this.stop = false
        this.debugTexts.replaceVariable(4, 'HIT!!!!')
      }

      if (this.arrowState.y <= 0) {
        this.stop = false
        this.debugTexts.replaceVariable(4, 'Failure')
      }
    }
  }

  private reset() {
    this.initArrowState()
    this.debugTexts.replaceVariable(
      1,
      `z: ${this.arrowState.z.toFixed(2)}, x: ${this.arrowState.x.toFixed(
        2
      )}, y: ${this.arrowState.y.toFixed(2)}, vz: ${this.arrowState.vz.toFixed(
        2
      )}, vx: ${this.arrowState.vz.toFixed(2)}, vy: ${this.arrowState.vy.toFixed(2)}`
    )

    this.debugTexts.replaceVariable(
      2,
      `z: ${(this.arrowState.z * 10).toFixed(2)}, x: ${(this.arrowState.x * 10).toFixed(2)}, y: ${(
        this.arrowState.y * 10
      ).toFixed(2)}`
    )

    this.arrowMoveParabolaGraph.clear()
    this.arrowMoveParabolaGraph.lineStyle(2, 0xff0000, 1)

    this.isTargetHit = false
    this.debugTexts.replaceVariable(4, '')
  }

  private start() {
    this.stop = true
    this.arrowState.vx = this.moveState.x
  }

  /**
   * 矢の状態の初期化
   */
  private initArrowState() {
    const v_0 = arrowInitialVelocity(BOW_SPRING_CONSTANT, BOW_DRAW_DISTANCE, ARROW_MASS)

    const theta = (SHOOTING_ANGLE_DEG * Math.PI) / 180

    this.arrowState.z = 0
    this.arrowState.x = 0
    this.arrowState.y = START_ARROW_HEIGHT
    this.arrowState.vz = v_0 * Math.cos(theta)
    this.arrowState.vx = 0
    this.arrowState.vy = v_0 * Math.sin(theta)
  }
}
