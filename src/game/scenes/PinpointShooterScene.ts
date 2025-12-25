import { GameObjects, Scene } from 'phaser'

import { EventBus } from '../EventBus'
import { SceneKey, SceneKeyIndex } from '../const/SceneKey'
import GameStep from '../logic/gameStep'
import GameMain from '../sceneLogic/pinpointShoot/game'
import UiContainer from '../sceneLogic/pinpointShoot/ui'
import FortuneSlip from '../sceneLogic/fortuneSlip'

//発射までの状態
const SHOOT_STEP_NAMES = ['INIT', 'SET_POWER', 'SHOOT', 'RESULT', 'FINISH']
enum SHOOT_STEP {
  INIT,
  SET_POWER,
  SHOOT,
  RESULT,
  FINISH
}

export class PinpointShooterScene extends Scene {
  //発射までのステップ
  gameStep!: GameStep

  //ゲームメインロジック
  gameMain!: GameMain

  //UIをまとめているクラス
  uiContainer!: UiContainer

  //おみくじ管理
  fortuneSlip!: FortuneSlip

  constructor() {
    super(SceneKey[SceneKeyIndex.PinpointShooterScene].scene_name)
  }

  create() {
    EventBus.emit('current-scene-ready', this)

    // 画面サイズ
    const gameCenterX = this.scale.width / 2
    const gameCenterY = this.scale.height / 2

    //ゲームステップ管理
    this.gameStep = new GameStep(SHOOT_STEP_NAMES)

    //おみくじの管理
    this.fortuneSlip = new FortuneSlip(this, gameCenterX, gameCenterY)

    //ゲームメインロジック
    this.gameMain = new GameMain(this, gameCenterX, gameCenterY)

    //UIをまとめているクラス
    this.uiContainer = new UiContainer(this, gameCenterX, gameCenterY)

    //ゲームメインUI初期化
    this.gameMain.initGameUi()

    //UI初期化
    this.uiContainer.init()

    //ゲーム内の状態が変化するUIの初期化
    this.gameMain.initGameVariableUi()

    //おみくじ初期化
    this.fortuneSlip.init(() => {
      console.log('おみくじ')
      this.gameStep.initStep()
    })

    //ゲームの進捗初期化
    this.gameStep.initStep()
  }

  //ゲームメインループ
  update(time: number, delta: number): void {
    this.updateShootStep(delta)
  }

  /**
   * 各ステータスの更新処理
   */
  private updateShootStep(delta: number) {
    switch (this.gameStep.getCurrentStep()) {
      case SHOOT_STEP.INIT:
        this.gameMain.resetGame()
        break
      case SHOOT_STEP.SET_POWER:
        this.gameMain.setBowDrawDistance()
        break
      case SHOOT_STEP.SHOOT:
        this.gameMain.shoot()
        break
      case SHOOT_STEP.RESULT:
        this.gameMain.shootResult(delta)
        break
      case SHOOT_STEP.FINISH:
        //何もしない 結果表示
        break
    }
  }
}
