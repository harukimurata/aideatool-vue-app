import { GameObjects } from 'phaser'
import ImageButton from '../components/ImageButton'
import TextureKey from '../const/TextureKey'

export default class FortuneSlip extends Phaser.GameObjects.Group {
  private static instance: FortuneSlip

  private gameCenterX = 0
  private gameCenterY = 0

  private scratchResult!: GameObjects.Image
  private initButton!: ImageButton

  /**
   * おみくじの管理
   * @param scene
   */
  constructor(scene: Phaser.Scene, gameCenterX: number, gameCenterY: number) {
    super(scene)
    this.gameCenterX = gameCenterX
    this.gameCenterY = gameCenterY

    FortuneSlip.instance = this
  }

  // シングルトンの取得
  // ほかのクラスでも同じインスタンスを使いたい場合はこれを使う
  public static getInstance(): FortuneSlip {
    if (!this.instance) {
      this.instance = new FortuneSlip(this.instance, 200, 200)
    }
    return this.instance
  }

  /**
   * 初期化とおみくじ引いた後のボタン設定
   */
  public init(onClickFunc?: Function) {
    this.scratchResult = this.scene.add
      .image(this.gameCenterX, this.gameCenterY, '')
      .setAlpha(0)
      .setDepth(98)
      .setVisible(false)

    //初期化ボタン
    this.initButton = new ImageButton(
      this.scene,
      this.gameCenterX,
      this.gameCenterY,
      TextureKey.NengaRetry,
      TextureKey.NengaRetry,
      () => {
        this.scratchResult.setAlpha(0).setScale(0.2).setVisible(false)
        this.initButton.setScale(0.2).setVisible(false)
        if (onClickFunc != null) {
          onClickFunc()
        }
      }
    )
      .setDepth(99)
      .setScale(0.2)
    this.initButton.setVisible(false)
    this.scene.add.existing(this.initButton)
  }

  /**
   * おみくじの結果の設定
   * @param resultImage
   */
  public setResult(resultImage: string = TextureKey.NengaHazure) {
    if (resultImage == TextureKey.NengaHazure) {
      this.initButton.setPosition(this.gameCenterX, this.gameCenterY + 80)
    } else {
      this.initButton.setPosition(this.gameCenterX, this.gameCenterY + 220)
    }

    this.scratchResult.setTexture(resultImage).setVisible(true)
  }

  /**
   * アニメーション再生
   * @param resultImage
   */
  public animation() {
    this.initButton.setVisible(true)
    this.initButton.inactiveButton()
    this.scene.tweens.add({
      targets: [this.scratchResult, this.initButton],
      alpha: 1,
      scale: 1,
      ease: 'Bounce',
      duration: 800,
      onComplete: () => {
        this.initButton.activeButton()
      }
    })
  }
}
