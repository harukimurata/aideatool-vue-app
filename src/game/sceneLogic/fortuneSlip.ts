import { GameObjects } from 'phaser'
import ImageButton from '../components/ImageButton'
import TextureKey from '../const/TextureKey'

export default class FortuneSlip extends Phaser.GameObjects.Group {
  private gameWidth = 0
  private gameHeight = 0
  private gameCenterX = 0
  private gameCenterY = 0

  private scratchResult!: GameObjects.Image
  private initButton!: ImageButton

  /**
   * おみくじの管理
   * @param scene
   */
  constructor(scene: Phaser.Scene) {
    super(scene)
    this.gameWidth = this.scene.scale.width
    this.gameHeight = this.scene.scale.height
    this.gameCenterX = this.gameWidth / 2
    this.gameCenterY = this.gameHeight / 2
  }

  /**
   * 初期化
   */
  public init(fortuneSlipImage: string, onClickFunc?: Function) {
    this.scratchResult = this.scene.add
      .image(this.gameCenterX, this.gameCenterY, fortuneSlipImage)
      .setAlpha(0)
      .setVisible(false)

    //初期化ボタン
    this.initButton = new ImageButton(
      this.scene,
      this.gameCenterX,
      this.gameCenterY,
      TextureKey.NengaRetry,
      TextureKey.NengaRetry,
      () => {
        if (onClickFunc != null) {
          onClickFunc()
          this.scratchResult.setAlpha(0).setScale(0.2).setVisible(false)
          this.initButton.setScale(0.2).setVisible(false)
        }
      }
    ).setScale(0.2)
    this.initButton.setVisible(false)
    this.scene.add.existing(this.initButton)
  }

  /**
   * おみくじの結果の設定
   * @param resultImage
   */
  public setResult(resultImage: string = TextureKey.NengaHazure) {
    if (resultImage == TextureKey.NengaHazure) {
      this.initButton.setPosition(this.gameWidth / 2, this.gameHeight / 2 + 80)
    } else {
      this.initButton.setPosition(this.gameWidth / 2, this.gameHeight / 2 + 220)
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
