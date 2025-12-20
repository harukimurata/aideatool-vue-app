import { GameObjects } from 'phaser'
import ImageButton from '../../components/ImageButton'
import UiText from '../../components/UiText'
import TextureKey from '../../const/TextureKey'
import { is3DBoxCollision } from '../../logic/collision'
import GameStep from '../../logic/gameStep'
import FortuneSlip from '../../sceneLogic/fortuneSlip'
import {
  type ArrowState,
  type MoveState,
  arrowInitialVelocity,
  stepAirResistanceArrowFlight
} from '../../logic/physics'

import { generateRandomInt, generateRandomFloat } from '../../utils'

const BOW_DRAW_POWER_BAR_MOVE_VALUE = 3.75 // px
const BOW_SPRING_CONSTANT = 300 // N/m
const BOW_DRAW_DISTANCE = 0.005 // m 変数で決めるようにする
const ARROW_MASS = 0.05 // kg
const ARROW_HEAD_SIZE = 0.03 // m

const TARGET_POS_Z = 40 // m
const TARGET_POS_X = 0 // m
const TARGET_POS_Y = 2 // m
const TARGET_SIZE_W = 2 // m
const TARGET_SIZE_H = 2 // m
const TARGET_SIZE_D = 0.1 // m

const START_ARROW_HEIGHT = 1.5 // m
const BOW_DRAW_DISTANCE_MOVE_SPEED = 1 // degree per frame
const SCOPE_MOVE_SPEED = 1

const AIR_RESISTANCE_COEFFICIENT = 1.0 // 空気抵抗係数
const ARROW_CROSS_SECTIONAL_AREA = 0.0005 // m^2
const AIR_DENSITY = 1.225 // kg/m^3

const POINT_GRAPH_SCALE = 10 // グラフのスケール
const PARABOLA_GRAPH_BASE_X = 70 // グラフの基準Y座標
const PARABOLA_GRAPH_BASE_Y = 120 // グラフの基準Y座標

export default class GameMain extends Phaser.GameObjects.Group {
  // ゲーム画面サイズ関連
  private gameCenterX = 0
  private gameCenterY = 0

  //発射までのステップ
  gameStep!: GameStep

  //おみくじ管理
  fortuneSlip!: FortuneSlip

  //ゲームの背景
  pinpointShooterBg!: GameObjects.Image
  hitAreaHut!: GameObjects.Image
  hitArea!: GameObjects.Image

  //放物線のグラフ(飛距離と高さ)
  arrowSampleParabolaGraph!: GameObjects.Graphics

  //矢を発射させる角度
  arrowVerticalAngle = 0 // 矢の垂直方向の角度
  arrowHorizontalAngle = 0 // 矢の水平方向の角度

  //弓を引く強さ
  bowDrawDistance = 0
  bowDrawDistanceMoveSpeed = BOW_DRAW_DISTANCE_MOVE_SPEED
  bowDrawPowerBarImg_posY = 0
  bowDrawPowerBarImg!: GameObjects.Image

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
  //的の位置
  targetPosition = {
    z: TARGET_POS_Z,
    x: TARGET_POS_X,
    y: TARGET_POS_Y
  }

  //矢を発射させる速度
  v_0 = 0

  //発射ボタン
  shootButton!: ImageButton

  constructor(scene: Phaser.Scene, gameCenterX: number, gameCenterY: number) {
    super(scene)
    this.gameCenterX = gameCenterX
    this.gameCenterY = gameCenterY
  }

  public initGameUi() {
    this.gameStep = GameStep.getInstance()
    this.fortuneSlip = FortuneSlip.getInstance()

    //背景
    this.pinpointShooterBg = this.scene.add
      .image(this.gameCenterX, this.gameCenterY, TextureKey.PinpointShooterBg)
      .setScale(0.26)

    //的の入っている小屋
    this.hitAreaHut = this.scene.add
      .image(this.gameCenterX, this.gameCenterY, TextureKey.HitAreaHut)
      .setScale(0.25)

    //的
    this.hitArea = this.scene.add
      .image(this.gameCenterX, this.gameCenterY, TextureKey.HitArea)
      .setScale(0.02)

    //風の方向と強さの表示
    this.windDirectionImg = this.scene.add
      .image(this.gameCenterX + 250, this.gameCenterY - 190, TextureKey.WindDirection)
      .setScale(0.1)
    this.windForceText = new UiText(
      this.scene,
      this.gameCenterX + 235,
      this.gameCenterY - 160,
      '',
      'Arial',
      '16px',
      '#000000',
      100
    )

    this.initGameButtons()
  }

  //ゲーム内のボタン初期化
  private initGameButtons() {
    //照準の移動ボタン
    this.scopeMoveButtonUp = new ImageButton(
      this.scene,
      105,
      this.gameCenterY / 2 + 400,
      TextureKey.ScopeArrowOff,
      TextureKey.ScopeArrowOn,
      () => {},
      () => {},
      () => {
        this.setArrowVerticalAngle(true)
      }
    ).setScale(0.2)

    this.scopeMoveButtonDown = new ImageButton(
      this.scene,
      105,
      this.gameCenterY / 2 + 500,
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
      this.scene,
      160,
      this.gameCenterY / 2 + 450,
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
      this.scene,
      50,
      this.gameCenterY / 2 + 450,
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

    //発射ボタン
    this.shootButton = new ImageButton(
      this.scene,
      this.gameCenterX,
      this.gameCenterY + 255,
      TextureKey.ShootOn,
      TextureKey.ShootOff,
      () => {
        this.gameStep.nextStep()
      }
    ).setScale(0.15)
  }

  //ゲーム内の状態が変化するUIの初期化
  public initGameVariableUi() {
    //パワーバーの範囲-155 ~ 220
    this.bowDrawPowerBarImg_posY = this.gameCenterY + 250
    this.bowDrawPowerBarImg = this.scene.add
      .image(this.gameCenterX + 250, this.bowDrawPowerBarImg_posY, TextureKey.PowerBar)
      .setScale(0.2)

    //放物線グラフの初期化(飛距離と高さ)
    this.arrowSampleParabolaGraph = this.scene.add.graphics()
    this.arrowSampleParabolaGraph.lineStyle(2, 0xff0000, 1)
  }

  //ゲームの初期化・リセット
  public resetGame() {
    this.resetGameUi()
    this.resetGameParams()

    //発射ステップを初期化
    this.gameStep.nextStep()
  }

  // ゲームUIの初期化
  public resetGameUi() {
    //パワーバーの位置初期化
    this.bowDrawPowerBarImg_posY = this.gameCenterY + 250
    this.bowDrawPowerBarImg.setY(this.bowDrawPowerBarImg_posY)

    //背景位置の初期化
    this.pinpointShooterBg.setX(this.gameCenterX)
    this.pinpointShooterBg.setY(this.gameCenterY)
    this.hitArea.setX(this.gameCenterX)
    this.hitArea.setY(this.gameCenterY)
    this.hitAreaHut.setX(this.gameCenterX)
    this.hitAreaHut.setY(this.gameCenterY)

    // グラフィックスのクリア
    this.arrowSampleParabolaGraphClear()

    //ボタンの有効化
    this.activeGameButtons()
  }

  // ゲームパラメータの初期化
  public resetGameParams() {
    //スコープ位置の初期化
    this.scopePosX = this.gameCenterX
    this.scopePosY = this.gameCenterY

    //矢の状態の初期化
    this.resetArrowState()

    //風の影響を計算
    this.calcWindDirection()
  }

  /**
   * 矢の状態の初期化
   */
  private resetArrowState() {
    //矢の開始位置の初期化
    this.moveState.z = 0
    this.moveState.x = 0
    this.moveState.y = START_ARROW_HEIGHT

    //矢の初速の初期化
    this.v_0 = 0

    //矢の状態を初期化
    this.arrowVerticalAngle = 0
    this.arrowHorizontalAngle = 0

    this.arrowState.z = 0
    this.arrowState.x = 0
    this.arrowState.y = 0
    this.arrowState.vz = 0
    this.arrowState.vx = 0
    this.arrowState.vy = 0

    //弓を引く強さの初期化
    this.bowDrawDistance = 0
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

    this.scopePosY = this.gameCenterY + this.arrowVerticalAngle * -1
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

    this.scopePosX = this.gameCenterX + this.arrowHorizontalAngle * -1
    this.pinpointShooterBg.setX(this.scopePosX)
    this.hitAreaHut.setX(this.scopePosX)
    this.hitArea.setX(this.scopePosX)
  }

  /**
   * 弓を引く強さ
   */
  public setBowDrawDistance() {
    this.bowDrawDistance += this.bowDrawDistanceMoveSpeed

    this.bowDrawPowerBarImg_posY -= BOW_DRAW_POWER_BAR_MOVE_VALUE * this.bowDrawDistanceMoveSpeed
    this.bowDrawPowerBarImg.setY(this.bowDrawPowerBarImg_posY)
    if (this.bowDrawDistance >= 100 || this.bowDrawDistance < 0) {
      this.bowDrawDistanceMoveSpeed = this.bowDrawDistanceMoveSpeed * -1
    }
  }

  /**
   * 発射トリガー
   */
  public shoot() {
    this.setShootParam()

    //矢の発射位置
    this.arrowState.z = this.moveState.z
    this.arrowState.x = this.moveState.x
    this.arrowState.y = this.moveState.y

    // 風の影響を初速に加算
    this.arrowState.vx += this.windDirectionX
    this.arrowState.vz += this.windDirectionZ

    //飛んでいる矢の放物線グラフの開始位置
    this.arrowSampleParabolaGraphInit(this.arrowState.z, this.arrowState.y)
    this.gameStep.nextStep()
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
   * 放たれた矢の結果処理
   * @param delta
   */
  public shootResult(delta: number) {
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
    this.arrowSampleParabolaGraphUpdate(this.arrowState.z, this.arrowState.y)

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
      this.showResult(TextureKey.NengaAtari_1)
    }

    if (this.arrowState.z > 45) {
      console.log(result)
      this.showResult(TextureKey.NengaHazure)
    }

    if (this.arrowState.y <= 0) {
      console.log(result)
      this.showResult(TextureKey.NengaHazure)
    }
  }

  //飛んでいる矢の放物線グラフの開始位置
  arrowSampleParabolaGraphInit(posX: number, posY: number) {
    this.arrowSampleParabolaGraph.beginPath()
    this.arrowSampleParabolaGraph.moveTo(
      PARABOLA_GRAPH_BASE_X + posX * POINT_GRAPH_SCALE,
      PARABOLA_GRAPH_BASE_Y - posY * POINT_GRAPH_SCALE
    )
  }

  // 矢の放物線のグラフ描画更新
  arrowSampleParabolaGraphUpdate(posX: number, posY: number) {
    this.arrowSampleParabolaGraph.lineTo(
      PARABOLA_GRAPH_BASE_X + posX * POINT_GRAPH_SCALE,
      PARABOLA_GRAPH_BASE_Y - posY * POINT_GRAPH_SCALE
    )
    this.arrowSampleParabolaGraph.strokePath()
  }

  // 矢の放物線のグラフクリア
  arrowSampleParabolaGraphClear() {
    this.arrowSampleParabolaGraph.clear()
    this.arrowSampleParabolaGraph.lineStyle(2, 0xff0000, 1)
  }

  //結果表示
  private showResult(resultImage?: string) {
    this.inactiveGameButtons()
    this.fortuneSlip.setResult(resultImage)
    this.fortuneSlip.animation()
    this.gameStep.nextStep()
  }

  //ゲーム内ボタンの有効化
  public activeGameButtons() {
    this.shootButton.activeButton()
    this.scopeMoveButtonUp.activeButton()
    this.scopeMoveButtonDown.activeButton()
    this.scopeMoveButtonLeft.activeButton()
    this.scopeMoveButtonRight.activeButton()
  }

  //ゲーム内ボタンの無効化
  public inactiveGameButtons() {
    this.shootButton.inactiveButton()
    this.scopeMoveButtonUp.inactiveButton()
    this.scopeMoveButtonDown.inactiveButton()
    this.scopeMoveButtonLeft.inactiveButton()
    this.scopeMoveButtonRight.inactiveButton()
  }
}
