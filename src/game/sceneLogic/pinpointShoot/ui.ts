import { GameObjects } from 'phaser'
import TextureKey from '../../const/TextureKey'

export default class UiContainer extends Phaser.GameObjects.Group {
  private static instance: UiContainer

  private gameCenterX = 0
  private gameCenterY = 0

  pinpointShooterBg!: GameObjects.Image
  hitArea!: GameObjects.Image
  hitAreaHut!: GameObjects.Image
  hitSample!: GameObjects.Image

  constructor(scene: Phaser.Scene, gameCenterX: number, gameCenterY: number) {
    super(scene)
    this.gameCenterX = gameCenterX
    this.gameCenterY = gameCenterY

    UiContainer.instance = this
  }

  // シングルトンの取得
  // ほかのクラスでも同じインスタンスを使いたい場合はこれを使う
  public static getInstance(): UiContainer {
    if (!this.instance) {
      this.instance = new UiContainer(this.instance, 200, 200)
    }
    return this.instance
  }

  init() {
    //グラフ背景
    this.scene.add.image(this.gameCenterX, 80, TextureKey.ParabolaGraphBg).setScale(0.25)

    //グラフ上のヒットエリア
    this.hitSample = this.scene.add.image(470, 98, TextureKey.HitSample).setScale(0.1)

    //中央の照準
    this.scene.add.image(this.gameCenterX, this.gameCenterY, TextureKey.Scope).setScale(0.25)

    //ゲームの説明
    this.scene.add
      .image(this.gameCenterX, this.gameCenterY + 330, TextureKey.ShootDescription)
      .setScale(0.4)

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
  }

  // ヒットサンプルのZインデックス更新
  public updateHitSampleZIndex(depth: number) {
    this.hitSample.setDepth(depth)
  }
}
