import { GameObjects } from 'phaser'
import ImageButton from '../../components/ImageButton'
import TextureKey from '../../const/TextureKey'
import GameStep from '../../logic/gameStep'

const POINT_GRAPH_SCALE = 10 // グラフのスケール
const PARABOLA_GRAPH_BASE_X = 70 // グラフの基準Y座標
const PARABOLA_GRAPH_BASE_Y = 120 // グラフの基準Y座標

export default class UiContainer extends Phaser.GameObjects.Group {
  private gameWidth = 0
  private gameHeight = 0
  private gameCenterX = 0
  private gameCenterY = 0

  pinpointShooterBg!: GameObjects.Image
  hitArea!: GameObjects.Image
  hitAreaHut!: GameObjects.Image
  hitSample!: GameObjects.Image

  //放物線のグラフ
  arrowMoveParabolaGraph!: GameObjects.Graphics

  constructor(scene: Phaser.Scene) {
    super(scene)
    this.gameWidth = this.scene.scale.width
    this.gameHeight = this.scene.scale.height
    this.gameCenterX = this.gameWidth / 2
    this.gameCenterY = this.gameHeight / 2
  }

  init() {
    console.log('UI初期化')

    //グラフ背景
    this.scene.add.image(this.gameCenterX, 80, TextureKey.ParabolaGraphBg).setScale(0.25)

    //グラフ上のヒットエリア
    this.scene.add.image(470, 98, TextureKey.HitSample).setScale(0.1)

    //中央の照準
    this.scene.add.image(this.gameCenterX, this.gameCenterY, TextureKey.Scope).setScale(0.25)

    //矢のパワーバー
    this.scene.add
      .image(this.gameCenterX + 250, this.gameCenterY + 60, TextureKey.PowerLevel)
      .setScale(0.2)

    //飛距離のポイント
    const graphics = this.scene.add.graphics()
    graphics.fillStyle(0x000000, 1) // 緑色、透明度1

    const points = [
      { x: 70, y: 120 }, //0
      { x: 120, y: 120 }, //5
      { x: 170, y: 120 }, //10
      { x: 220, y: 120 }, //15
      { x: 270, y: 120 }, //20
      { x: 320, y: 120 }, //25
      { x: 370, y: 120 }, //30
      { x: 420, y: 120 }, //35
      { x: 470, y: 120 }, //40
      { x: 520, y: 120 } //45
    ]

    points.forEach((p) => {
      graphics.fillCircle(p.x, p.y, 4) // 半径4pxの円
    })

    //放物線グラフの初期化
    this.arrowMoveParabolaGraph = this.scene.add.graphics()
    this.arrowMoveParabolaGraph.lineStyle(2, 0xff0000, 1)

    const gameStep = GameStep.getInstance()

    new ImageButton(
      this.scene,
      this.gameCenterX,
      this.gameCenterY + 300,
      TextureKey.SlotStartA,
      TextureKey.SlotStartB,
      () => {
        gameStep.nextStep()
      }
    ).setScale(0.7)
  }

  //飛んでいる矢の放物線グラフの開始位置
  arrowMoveParabolaGraphInit(posX: number, posY: number) {
    this.arrowMoveParabolaGraph.beginPath()
    this.arrowMoveParabolaGraph.moveTo(
      PARABOLA_GRAPH_BASE_X + posX * POINT_GRAPH_SCALE,
      PARABOLA_GRAPH_BASE_Y - posY * POINT_GRAPH_SCALE
    )
  }

  // 矢の放物線のグラフ描画更新
  arrowMoveParabolaGraphUpdate(posX: number, posY: number) {
    this.arrowMoveParabolaGraph.lineTo(
      PARABOLA_GRAPH_BASE_X + posX * POINT_GRAPH_SCALE,
      PARABOLA_GRAPH_BASE_Y - posY * POINT_GRAPH_SCALE
    )
    this.arrowMoveParabolaGraph.strokePath()
  }

  // 矢の放物線のグラフクリア
  arrowMoveParabolaGraphClear() {
    this.arrowMoveParabolaGraph.clear()
    this.arrowMoveParabolaGraph.lineStyle(2, 0xff0000, 1)
  }
}
