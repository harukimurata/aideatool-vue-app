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
import UiContainer from '../sceneLogic/pinpointShoot/ui'
import FortuneSlip from '../sceneLogic/fortuneSlip'
import GameStep from '../logic/gameStep'

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
const PARABOLA_GRAPH_BASE_X = 70 // グラフの基準Y座標
const PARABOLA_GRAPH_BASE_Y = 120 // グラフの基準Y座標
const TARGET_POS_Z = 40 // m
const TARGET_POS_X = 0 // m
const TARGET_POS_Y = 2 // m
const TARGET_SIZE_W = 2 // m
const TARGET_SIZE_H = 2 // m
const TARGET_SIZE_D = 0.1 // m
const ANGLE_MATER_POS_X = 100 // px
const ANGLE_MATER_POS_Y = 300 // px
const ANGLE_MATER_ARROW_POS_X = 20 // px
const ANGLE_MATER_ARROW_POS_Y = 380 // px
const BOW_DRAW_DISTANCE_MOVE_SPEED = 1 // degree per frame
const BOW_DRAW_POWER_BAR_POS_Y_MIN = 220 // px
const BOW_DRAW_POWER_BAR_POS_Y_MAX = -155 // px
const BOW_DRAW_POWER_BAR_MOVE_VALUE = 3.75 // px
const SCOPE_MOVE_SPEED = 1

//発射までの状態
const SHOOT_STEP_NAMES = ['INIT', 'SET_POWER', 'SHOOT', 'RESULT', 'FINISH']
enum SHOOT_STEP {
  INIT,
  SET_POWER,
  SHOOT,
  RESULT,
  FINISH
}

const RESULT_IMAGE_KEYS: string[] = [
  TextureKey.NengaAtari_1,
  TextureKey.NengaAtari_2,
  TextureKey.NengaAtari_3
]

export class PinpointShooterScene extends Scene {
  private gameWidth = 0
  private gameHeight = 0
  private gameCenterX = 0
  private gameCenterY = 0

  uiContainer!: UiContainer
  fortuneSlip!: FortuneSlip

  pinpointShooterBg!: GameObjects.Image
  hitArea!: GameObjects.Image
  hitAreaHut!: GameObjects.Image
  hitSample!: GameObjects.Image

  //発射までのステップ
  gameStep!: GameStep

  //矢を発射させる角度
  arrowVerticalAngle = 0 // 矢の垂直方向の角度
  arrowHorizontalAngle = 0 // 矢の水平方向の角度

  //弓を引く強さ
  bowDrawDistance = 0
  bowDrawDistanceMoveSpeed = BOW_DRAW_DISTANCE_MOVE_SPEED
  bowDrawPowerBarImg!: GameObjects.Image
  bowDrawPowerBarImg_posY = 0

  //風の方向
  windDirectionZ = 0
  windDirectionX = 0
  windDirectionImg!: GameObjects.Image
  windForceText!: UiText

  //スコープ移動ボタン
  scopeMoveButtonUp!: ImageButton
  scopeMoveButtonDown!: ImageButton
  scopeMoveButtonLeft!: ImageButton
  scopeMoveButtonRight!: ImageButton
  scopePosX = 0
  scopePosY = 0

  //矢を発射させる速度
  v_0 = 0

  // 矢の状態
  arrowState: ArrowState = {
    z: 0,
    x: 0,
    y: 0,
    vz: 0,
    vx: 0,
    vy: 0
  }

  // 開始位置
  moveState: MoveState = { z: 0, x: 0, y: 0 }
  lastArrowPosZ = 0

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

    // 画面サイズ
    this.gameWidth = this.scale.width
    this.gameHeight = this.scale.height
    this.gameCenterX = this.gameWidth / 2
    this.gameCenterY = this.gameHeight / 2

    this.pinpointShooterBg = this.add
      .image(this.gameCenterX, this.gameCenterY, TextureKey.PinpointShooterBg)
      .setScale(0.26)

    this.hitAreaHut = this.add
      .image(this.gameCenterX, this.gameCenterY, TextureKey.HitAreaHut)
      .setScale(0.25)

    this.hitArea = this.add
      .image(this.gameCenterX, this.gameCenterY, TextureKey.HitArea)
      .setScale(0.02)

    //ゲームステップ管理
    this.gameStep = new GameStep(SHOOT_STEP_NAMES)

    //UIをまとめているクラス
    this.uiContainer = new UiContainer(this)
    this.uiContainer.init()

    //おみくじの管理
    this.fortuneSlip = new FortuneSlip(this)
    this.fortuneSlip.init(() => {
      console.log('おみくじ')
      this.gameStep.initStep()
    })

    //風の方向と強さの表示
    this.windDirectionImg = this.add
      .image(this.gameCenterX + 250, this.gameCenterY - 190, TextureKey.WindVector)
      .setScale(0.1)
    this.windForceText = new UiText(
      this,
      this.gameCenterX + 235,
      this.gameCenterY - 160,
      '',
      'Arial',
      '16px',
      '#000000',
      100
    )

    //スコープ
    this.scopeMoveButtonUp = new ImageButton(
      this,
      100,
      this.gameCenterY / 2 + 350,
      TextureKey.ScopeArrowOff,
      TextureKey.ScopeArrowOn,
      () => {},
      () => {},
      () => {
        this.setArrowVerticalAngle(true)
      }
    ).setScale(0.2)

    this.scopeMoveButtonDown = new ImageButton(
      this,
      100,
      this.gameCenterY / 2 + 450,
      TextureKey.ScopeArrowOff,
      TextureKey.ScopeArrowOn,
      () => {},
      () => {},
      () => {
        this.setArrowVerticalAngle(false)
      }
    )
      .setScale(0.2)
      .setAngle(180)

    this.scopeMoveButtonRight = new ImageButton(
      this,
      160,
      this.gameCenterY / 2 + 400,
      TextureKey.ScopeArrowOff,
      TextureKey.ScopeArrowOn,
      () => {},
      () => {},
      () => {
        this.setArrowDirection(true)
      }
    )
      .setScale(0.2)
      .setAngle(90)

    this.scopeMoveButtonLeft = new ImageButton(
      this,
      40,
      this.gameCenterY / 2 + 400,
      TextureKey.ScopeArrowOff,
      TextureKey.ScopeArrowOn,
      () => {},
      () => {},
      () => {
        this.setArrowDirection(false)
      }
    )
      .setScale(0.2)
      .setAngle(270)

    //パワーバーの範囲-155 ~ 220
    this.bowDrawPowerBarImg_posY = this.gameCenterY + 250
    this.bowDrawPowerBarImg = this.add
      .image(this.gameCenterX + 250, this.bowDrawPowerBarImg_posY, TextureKey.PowerBar)
      .setScale(0.2)

    //矢の初期化
    this.initArrowState()

    //矢を飛ばすときに必要な要素のUIの初期化
    this.initArrowShootUi()

    this.gameStep.nextStep()
  }

  /**
   * 矢の状態の初期化
   */
  private initArrowState() {
    //矢の開始位置の初期化
    this.moveState.z = 0
    this.moveState.x = 0
    this.moveState.y = START_ARROW_HEIGHT

    //矢の初速の初期化
    this.v_0 = 0

    //矢の状態を初期化
    this.arrowState.z = 0
    this.arrowState.x = 0
    this.arrowState.y = 0
    this.arrowState.vz = 0
    this.arrowState.vx = 0
    this.arrowState.vy = 0

    //発射ステップを初期化
    this.gameStep.initStep()
  }

  //矢を飛ばすときに必要な要素のUIの初期化
  private initArrowShootUi() {
    this.arrowVerticalAngle = 0
    this.arrowHorizontalAngle = 0
    this.bowDrawDistance = 0

    //パワーバーの位置初期化
    this.bowDrawPowerBarImg_posY = this.gameCenterY + 250
    this.bowDrawPowerBarImg.setY(this.bowDrawPowerBarImg_posY)

    //スコープ位置の初期化
    this.scopePosX = this.gameCenterX
    this.scopePosY = this.gameCenterY

    this.pinpointShooterBg.setX(this.scopePosX)
    this.pinpointShooterBg.setY(this.scopePosY)
    this.hitArea.setX(this.scopePosX)
    this.hitArea.setY(this.scopePosY)
    this.hitAreaHut.setX(this.scopePosX)
    this.hitAreaHut.setY(this.scopePosY)

    //風の影響を計算
    this.calcWindDirection()
  }

  //ゲームメインループ
  update(time: number, delta: number): void {
    this.updateShootStep(delta)
  }

  //ゲーム初期化
  private initGame() {
    this.initArrowState()

    // グラフィックスのクリア
    this.uiContainer.arrowMoveParabolaGraphClear()

    //矢を飛ばすときに必要な要素のUIの初期化
    this.initArrowShootUi()

    this.isTargetHit = false

    this.gameStep.nextStep()
  }

  /**
   * 各ステータスの更新処理
   */
  private updateShootStep(delta: number) {
    switch (this.gameStep.getCurrentStep()) {
      case SHOOT_STEP.INIT:
        this.initGame()
        break
      case SHOOT_STEP.SET_POWER:
        this.setBowDrawDistance()
        break
      case SHOOT_STEP.SHOOT:
        this.shoot()
      case SHOOT_STEP.RESULT:
        this.shootResult(delta)
      case SHOOT_STEP.FINISH:
        //何もしない 結果表示
        break
    }
  }

  /**
   * 発射トリガー
   */
  private shoot() {
    this.setShootParam()

    //矢の発射位置
    this.arrowState.z = this.moveState.z
    this.arrowState.x = this.moveState.x
    this.arrowState.y = this.moveState.y

    // 風の影響を初速に加算
    this.arrowState.vx += this.windDirectionX
    this.arrowState.vz += this.windDirectionZ
    this.gameStep.nextStep()

    //飛んでいる矢の放物線グラフの開始位置
    this.uiContainer.arrowMoveParabolaGraphInit(this.arrowState.z, this.arrowState.y)
  }

  /**
   * 放たれた矢の結果処理
   * @param delta
   */
  private shootResult(delta: number) {
    const dt = delta / 1000 // Phaser のフレーム時間
    //飛んでいる矢の状態の更新
    this.arrowState = stepAirResistanceArrowFlight(
      this.arrowState,
      ARROW_MASS,
      AIR_RESISTANCE_COEFFICIENT,
      ARROW_CROSS_SECTIONAL_AREA,
      AIR_DENSITY,
      dt
    )

    // 矢の放物線のグラフ描画更新
    this.uiContainer.arrowMoveParabolaGraphUpdate(this.arrowState.z, this.arrowState.y)

    let result = is3DBoxCollision(
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
    if (result.collision) {
      console.log(result)
      this.isTargetHit = true
      this.gameStep.nextStep()

      this.fortuneSlip.setResult(TextureKey.NengaAtari_1)
      this.fortuneSlip.animation()
    }

    if (this.arrowState.z > 45) {
      this.gameStep.nextStep()
      console.log(result)

      this.fortuneSlip.setResult()
      this.fortuneSlip.animation()
    }

    if (this.arrowState.y <= 0) {
      this.gameStep.nextStep()
      console.log(result)

      this.fortuneSlip.setResult()
      this.fortuneSlip.animation()
    }
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

    //垂直方向の速度成分
    const theta = (this.arrowVerticalAngle * -1 * Math.PI) / 180
    //水平方向の速度成分
    const phi = (this.arrowHorizontalAngle * Math.PI) / 180

    this.arrowState.vz = this.v_0 * Math.cos(theta) * Math.cos(phi)
    this.arrowState.vx = this.v_0 * Math.cos(theta) * Math.sin(phi)
    this.arrowState.vy = this.v_0 * Math.sin(theta)
  }

  /**
   * 矢を発射させる　垂直方向の角度
   */
  private setArrowVerticalAngle(isUp: boolean) {
    this.arrowVerticalAngle += isUp ? -SCOPE_MOVE_SPEED : SCOPE_MOVE_SPEED

    if (this.arrowVerticalAngle <= -60) {
      this.arrowVerticalAngle = -60
    } else if (this.arrowVerticalAngle > 20) {
      this.arrowVerticalAngle = 20
    }

    this.scopePosY = this.gameCenterY + this.arrowVerticalAngle * SCOPE_MOVE_SPEED * -1
    this.pinpointShooterBg.setY(this.scopePosY)
    this.hitAreaHut.setY(this.scopePosY)
    this.hitArea.setY(this.scopePosY)
  }

  /**
   * 矢を発射させる　水平方向の角度
   */
  private setArrowDirection(isRight: boolean) {
    this.arrowHorizontalAngle += isRight ? SCOPE_MOVE_SPEED : -SCOPE_MOVE_SPEED

    if (this.arrowHorizontalAngle <= -20) {
      this.arrowHorizontalAngle = -20
    } else if (this.arrowHorizontalAngle > 20) {
      this.arrowHorizontalAngle = 20
    }

    this.scopePosX = this.gameCenterX + this.arrowHorizontalAngle * SCOPE_MOVE_SPEED * -1
    this.pinpointShooterBg.setX(this.scopePosX)
    this.hitAreaHut.setX(this.scopePosX)
    this.hitArea.setX(this.scopePosX)
  }

  /**
   * 弓を引く強さ
   */
  private setBowDrawDistance() {
    this.bowDrawDistance += this.bowDrawDistanceMoveSpeed

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
    const F = Number(generateRandomFloat(0.1, 3.0).toFixed(2)) // N 風の力の大きさ
    const angleDeg = generateRandomInt(0, 360) // degrees 風の向き

    this.windDirectionImg.setAngle(angleDeg)
    this.windForceText.setTextString(`${F}`)

    const angle = ((angleDeg - 90) * Math.PI) / 180 // 度→ラジアン変換
    const Fx = F * Math.cos(angle) // x方向
    const Fz = F * Math.sin(angle) * -1 // z方向

    this.windDirectionZ = Fz
    this.windDirectionX = Fx
    console.log('windDirectionX', this.windDirectionX, 'windDirectionZ', this.windDirectionZ)
  }
}
