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
import { generateRandomInt, generateRandomFloat } from '../utils'
import UiText from '../components/UiText'

const BOW_SPRING_CONSTANT = 300 // N/m
const ARROW_HEAD_SIZE = 0.03 // m
const ARROW_MASS = 0.05 // kg
const BOW_DRAW_DISTANCE = 0.005 // m 変数で決めるようにする
const SHOOTING_ANGLE_DEG = 8 // degrees 変数で決めるようにする
const START_ARROW_HEIGHT = 1.5 // m
const AIR_RESISTANCE_COEFFICIENT = 1.0 // 空気抵抗係数
const ARROW_CROSS_SECTIONAL_AREA = 0.0005 // m^2
const AIR_DENSITY = 1.225 // kg/m^3
const MOVE_SPEED_X = 0 // km/h
const GRAVITY = 9.8 // m/s^2
const POINT_GRAPH_SCALE = 10 // グラフのスケール
const PARABOLA_GRAPH_BASE_X = 50 // グラフの基準Y座標
const PARABOLA_GRAPH_BASE_Y = 150 // グラフの基準Y座標
const TARGET_POS_Z = 38 // m
const TARGET_POS_X = 0 // m
const TARGET_POS_Y = 1 // m
const TARGET_SIZE_W = 2 // m
const TARGET_SIZE_H = 2 // m
const TARGET_SIZE_D = 0.1 // m
const ANGLE_MATER_POS_X = 100 // px
const ANGLE_MATER_POS_Y = 300 // px
const ANGLE_MATER_ARROW_POS_X = 20 // px
const ANGLE_MATER_ARROW_POS_Y = 380 // px
const ANGLE_MATER_ARROW_MOVE_SPEED = 2 // degree per frame
const BOW_DRAW_DISTANCE_MOVE_SPEED = 1 // degree per frame
const BOW_DRAW_POWER_BAR_POS_Y_MIN = 220 // px
const BOW_DRAW_POWER_BAR_POS_Y_MAX = -155 // px
const BOW_DRAW_POWER_BAR_MOVE_VALUE = 3.75 // px
const SCOPE_MOVE_SPEED = 2

//発射までの状態
const SHOOT_STEP = {
  INIT: 0,
  SET_POWER: 1,
  SET_ANGLE: 2,
  SHOOT: 3
}

export class PinpointShooterScene extends Scene {
  // ゲーム内時間
  private worldTime = 0

  private stop = false

  private gameWidth = 0
  private gameHeight = 0
  private gameCenterX = 0
  private gameCenterY = 0

  // デバッグ用テキスト
  private debugTexts!: DebugTexts

  slotResetButton!: ImageButton
  slotPauseButton!: ImageButton

  //発射までのステップ
  shootStep: number = SHOOT_STEP.INIT

  //矢を発射させる角度
  angleMaterImg!: GameObjects.Image
  angleMaterArrowImg!: GameObjects.Image
  angleMaterArrowMoveSpeed = ANGLE_MATER_ARROW_MOVE_SPEED
  angleMaterArrowAngle = 0

  //弓を引く強さ
  bowDrawDistance = 0
  bowDrawDistanceMoveSpeed = BOW_DRAW_DISTANCE_MOVE_SPEED
  bowDrawPowerBarImg!: GameObjects.Image
  bowDrawPowerBarImg_posY = 0

  //風の方向
  windDirectionZ = 0
  windDirectionX = 0
  windDirectionImg!: GameObjects.Image
  windForce = 0
  windForceText!: UiText

  //スコープ移動ボタン
  scopeImg!: GameObjects.Image
  scopeMoveButtonUp!: ImageButton
  scopeMoveButtonDown!: ImageButton
  scopeMoveButtonLeft!: ImageButton
  scopeMoveButtonRight!: ImageButton
  scopeDirection = 0
  scopeMoveSpeed = SCOPE_MOVE_SPEED

  //矢を発射させる速度
  v_0 = 0

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
  moveState: MoveState = { z: 0, x: 0, y: 0 }

  arrowMoveParabolaGraph!: GameObjects.Graphics

  graphics!: GameObjects.Graphics

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
    this.gameCenterX = this.gameWidth / 2
    this.gameCenterY = this.gameHeight / 2

    this.add.image(this.gameWidth / 2, this.gameHeight / 2, TextureKey.DefaultBg)

    //デバッグテキスト
    this.debugTexts = new DebugTexts()
    this.debugTexts.init(this, [
      'Pinpoint Shooter Scene',
      'flightDistance: {1}',
      'px arrowFlightDistance: {1}',
      `Target z:${TARGET_POS_Z}, x:${TARGET_POS_X}, y:${TARGET_POS_Y}`,
      'WindAngle: {1}',
      'Shoot Angle: {1}',
      'Shoot Power: {1}',
      'Target is : {1}',
      'Arrow Mater Angle: {1}',
      'Bow Draw Distance: {1}',
      'Shoot Step: {1}'
    ])

    this.slotResetButton = new ImageButton(
      this,
      this.gameWidth / 2,
      this.gameHeight / 2 + 200,
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
      this.gameHeight / 2 + 300,
      TextureKey.SlotStartA,
      TextureKey.SlotStartB,
      () => {
        this.incrementShootStep()
      }
    ).setScale(0.7)
    this.add.existing(this.slotPauseButton)

    this.angleMaterImg = this.add.image(ANGLE_MATER_POS_X, ANGLE_MATER_POS_Y, TextureKey.AngleMater)
    this.angleMaterArrowImg = this.add
      .image(ANGLE_MATER_ARROW_POS_X, ANGLE_MATER_ARROW_POS_Y, TextureKey.AngleMaterArrow)
      .setScale(0.9)
      .setOrigin(0.15, 0.5)
      .setAngle(this.angleMaterArrowAngle)

    //風の方向と強さ
    this.windDirectionImg = this.add
      .image(this.gameCenterX + 250, this.gameCenterY - 250, TextureKey.WindVector)
      .setScale(0.1)
    this.windForceText = new UiText(
      this,
      this.gameCenterX + 230,
      this.gameCenterY - 220,
      '',
      'Arial',
      '16px',
      '#000000',
      100
    )
    this.calcWindDirection()

    //スコープ
    this.scopeImg = this.add
      .image(this.gameCenterX, this.gameCenterY, TextureKey.Scope)
      .setScale(0.25)

    this.scopeMoveButtonUp = new ImageButton(
      this,
      100,
      this.gameCenterY / 2 + 350,
      TextureKey.ScopeArrowOff,
      TextureKey.ScopeArrowOn,
      () => {
        console.log('up')
      },
      () => {},
      () => {
        console.log('hold up')
        this.setAngleMaterArrowAngle(true)
      }
    ).setScale(0.2)
    this.add.existing(this.scopeMoveButtonUp)

    this.scopeMoveButtonDown = new ImageButton(
      this,
      100,
      this.gameCenterY / 2 + 450,
      TextureKey.ScopeArrowOff,
      TextureKey.ScopeArrowOn,
      () => {
        console.log('down')
      },
      () => {},
      () => {
        console.log('hold down')
        this.setAngleMaterArrowAngle(false)
      }
    )
      .setScale(0.2)
      .setAngle(180)
    this.add.existing(this.scopeMoveButtonDown)

    this.scopeMoveButtonRight = new ImageButton(
      this,
      160,
      this.gameCenterY / 2 + 400,
      TextureKey.ScopeArrowOff,
      TextureKey.ScopeArrowOn,
      () => {
        console.log('right')
      },
      () => {},
      () => {
        console.log('hold right')
        this.setArrowDirection(true)
      }
    )
      .setScale(0.2)
      .setAngle(90)
    this.add.existing(this.scopeMoveButtonRight)

    this.scopeMoveButtonLeft = new ImageButton(
      this,
      40,
      this.gameCenterY / 2 + 400,
      TextureKey.ScopeArrowOff,
      TextureKey.ScopeArrowOn,
      () => {
        console.log('left')
      },
      () => {},
      () => {
        console.log('hold left')
        this.setArrowDirection(false)
      }
    )
      .setScale(0.2)
      .setAngle(270)
    this.add.existing(this.scopeMoveButtonLeft)

    //矢のパワーバー
    this.add
      .image(this.gameCenterX + 250, this.gameCenterY + 30, TextureKey.PowerLevel)
      .setScale(0.2)

    //パワーバーの範囲-155 ~ 220
    this.bowDrawPowerBarImg_posY = this.gameCenterY + 220
    this.bowDrawPowerBarImg = this.add
      .image(this.gameCenterX + 250, this.bowDrawPowerBarImg_posY, TextureKey.PowerBar)
      .setScale(0.2)

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

    this.graphics = this.add.graphics()
    this.graphics.fillStyle(0x00ff00, 1) // 緑色、透明度1

    const points = [
      { x: 50, y: 150 }, //0
      { x: 100, y: 150 }, //5      { x: 150, y: 150 },
      { x: 150, y: 150 }, //5      { x: 150, y: 150 },
      { x: 200, y: 150 }, //10
      { x: 250, y: 150 }, //15
      { x: 300, y: 150 }, //20
      { x: 350, y: 150 }, //25
      { x: 400, y: 150 }, //30
      { x: 450, y: 150 }, //35
      { x: 500, y: 150 } //40
    ]

    points.forEach((p) => {
      this.graphics.fillCircle(p.x, p.y, 4) // 半径4pxの円
    })

    this.shootStep = SHOOT_STEP.SET_POWER
    this.debugTexts.replaceVariable(10, this.shootStep)
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
        )}, vx: ${this.arrowState.vx.toFixed(2)}, vy: ${this.arrowState.vy.toFixed(2)}`
      )

      this.debugTexts.replaceVariable(
        2,
        `z: ${(this.arrowState.z * 10).toFixed(2)}, x: ${(this.arrowState.x * 10).toFixed(
          2
        )}, y: ${(this.arrowState.y * 10).toFixed(2)}`
      )

      this.debugTexts.replaceVariable(5, this.angleMaterArrowAngle * -1)
      this.debugTexts.replaceVariable(6, this.bowDrawDistance * BOW_DRAW_DISTANCE)

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
        this.debugTexts.replaceVariable(7, 'HIT!!!!')
        console.log(this.arrowState)
      }

      if (this.arrowState.y <= 0) {
        this.stop = false
        this.debugTexts.replaceVariable(7, 'Failure')
        console.log(this.arrowState)
      }
    } else {
      this.updateShootStep()
    }
  }

  //リセット処理
  private reset() {
    this.initArrowState()
    this.debugTexts.replaceVariable(
      1,
      `z: ${this.arrowState.z.toFixed(2)}, x: ${this.arrowState.x.toFixed(
        2
      )}, y: ${this.arrowState.y.toFixed(2)}, vz: ${this.arrowState.vz.toFixed(
        2
      )}, vx: ${this.arrowState.vx.toFixed(2)}, vy: ${this.arrowState.vy.toFixed(2)}`
    )

    this.debugTexts.replaceVariable(
      2,
      `z: ${(this.arrowState.z * POINT_GRAPH_SCALE).toFixed(2)}, x: ${(
        this.arrowState.x * POINT_GRAPH_SCALE
      ).toFixed(2)}, y: ${(this.arrowState.y * POINT_GRAPH_SCALE).toFixed(2)}`
    )

    this.arrowMoveParabolaGraph.clear()
    this.arrowMoveParabolaGraph.lineStyle(2, 0xff0000, 1)

    this.isTargetHit = false
    this.debugTexts.replaceVariable(5, '')
    this.debugTexts.replaceVariable(6, '')

    this.shootStep = SHOOT_STEP.SET_POWER
    this.debugTexts.replaceVariable(10, this.shootStep)
  }

  /**
   * 発射までのステップを進める
   */
  private incrementShootStep() {
    if (!this.stop) {
      this.shootStep++
      this.debugTexts.replaceVariable(10, this.shootStep)
    }
  }

  /**
   * 各ステータスの更新処理
   */
  private updateShootStep() {
    switch (this.shootStep) {
      case SHOOT_STEP.SET_POWER:
        this.setBowDrawDistance()
        break
      case SHOOT_STEP.SET_ANGLE:
        //this.setAngleMaterArrowAngle()
        break
      case SHOOT_STEP.SHOOT:
        this.start()
        console.log(this.arrowState)
        break
    }
  }

  /**
   * 発射トリガー
   */
  private start() {
    this.stop = true
    this.setShootParam()
    // 風の影響を初速に加算
    this.arrowState.x = this.scopeDirection * 0.1
    this.arrowState.vx += this.windDirectionX
    this.arrowState.vz += this.windDirectionZ
    this.shootStep = SHOOT_STEP.INIT
  }

  /**
   * 矢の状態の初期化
   */
  private initArrowState() {
    this.bowDrawPowerBarImg_posY = this.gameCenterY + 220
    this.bowDrawPowerBarImg.setY(this.bowDrawPowerBarImg_posY)
    this.angleMaterArrowAngle = 0
    this.angleMaterArrowImg.setAngle(this.angleMaterArrowAngle)
    this.bowDrawDistance = 0
    this.v_0 = 0

    this.scopeImg.setY(this.gameCenterY)
    this.scopeImg.setX(this.gameCenterX)

    //矢の状態を初期化
    this.arrowState.z = 0
    this.arrowState.x = 0
    this.arrowState.y = START_ARROW_HEIGHT
    this.arrowState.vz = 0
    this.arrowState.vx = 0
    this.arrowState.vy = 0

    //風の影響を計算
    this.calcWindDirection()

    //発射ステップを初期化
    this.shootStep = SHOOT_STEP.INIT
  }

  /**
   * 矢を発射させる角度と弓を引く強さ
   */
  private setShootParam() {
    this.v_0 = arrowInitialVelocity(
      BOW_SPRING_CONSTANT,
      this.bowDrawDistance * BOW_DRAW_DISTANCE,
      ARROW_MASS
    )

    const theta = (this.angleMaterArrowAngle * -1 * Math.PI) / 180
    this.arrowState.vz = this.v_0 * Math.cos(theta)
    this.arrowState.vy = this.v_0 * Math.sin(theta)
  }

  /**
   * 矢を発射させる角度
   */
  private setAngleMaterArrowAngle(isUp: boolean) {
    this.angleMaterArrowAngle += isUp
      ? -this.angleMaterArrowMoveSpeed
      : this.angleMaterArrowMoveSpeed

    if (this.angleMaterArrowAngle <= -60) {
      this.angleMaterArrowAngle = -60
    } else if (this.angleMaterArrowAngle > 20) {
      this.angleMaterArrowAngle = 20
    }
    this.angleMaterArrowImg.setAngle(this.angleMaterArrowAngle)

    this.debugTexts.replaceVariable(8, this.angleMaterArrowAngle * -1)
    const scopePosY = this.gameCenterY + this.angleMaterArrowAngle * SCOPE_MOVE_SPEED
    this.scopeImg.setY(scopePosY)
  }

  /**
   * 矢を発射させる方向
   */
  private setArrowDirection(isRight: boolean) {
    this.scopeDirection += isRight ? SCOPE_MOVE_SPEED : -SCOPE_MOVE_SPEED

    if (this.scopeDirection <= -20) {
      this.scopeDirection = -20
    } else if (this.scopeDirection > 20) {
      this.scopeDirection = 20
    }

    const scopePosX = this.gameCenterX + this.scopeDirection * SCOPE_MOVE_SPEED
    this.scopeImg.setX(scopePosX)
  }

  /**
   * 弓を引く強さ
   */
  private setBowDrawDistance() {
    this.bowDrawDistance += this.bowDrawDistanceMoveSpeed
    this.debugTexts.replaceVariable(9, this.bowDrawDistance)

    this.bowDrawPowerBarImg_posY -= BOW_DRAW_POWER_BAR_MOVE_VALUE * this.bowDrawDistanceMoveSpeed
    this.bowDrawPowerBarImg.setY(this.bowDrawPowerBarImg_posY)
    if (this.bowDrawDistance >= 100 || this.bowDrawDistance < 0) {
      this.bowDrawDistanceMoveSpeed = this.bowDrawDistanceMoveSpeed * -1
    }
  }

  /**
   * 風の強さ・方向をランダムに決める
   */
  private calcWindDirection() {
    const F = Number(generateRandomFloat(0.1, 2.0).toFixed(2)) // N 風の力の大きさ
    const angleDeg = generateRandomInt(0, 360) // degrees 風の向き

    this.windDirectionImg.setAngle(angleDeg)
    this.windForceText.setTextString(`${F}`)

    const angle = ((angleDeg - 90) * Math.PI) / 180 // 度→ラジアン変換
    const Fx = F * Math.cos(angle) // x方向
    const Fz = F * Math.sin(angle) * -1 // z方向

    this.debugTexts.replaceVariable(
      4,
      `${angleDeg} deg (Fx[wD_X] ${Fx.toFixed(2)}, Fz[wD_Z] ${Fz.toFixed(2)})`
    )

    this.windDirectionZ = Fz
    this.windDirectionX = Fx
  }
}
