import { GameObjects } from 'phaser'
import ImageButton from '../../components/ImageButton'
import TextureKey from '../../const/TextureKey'

export default class ResultContainer extends Phaser.GameObjects.Group {
  private static instance: ResultContainer

  private gameCenterX = 0
  private gameCenterY = 0

  resultBg!: GameObjects.Image
  zResultText!: GameObjects.Text
  xResultText!: GameObjects.Text
  yResultText!: GameObjects.Text

  private resultNextButton!: ImageButton

  constructor(scene: Phaser.Scene, gameCenterX: number, gameCenterY: number) {
    super(scene)
    this.gameCenterX = gameCenterX
    this.gameCenterY = gameCenterY

    ResultContainer.instance = this
  }

  // シングルトンの取得
  // ほかのクラスでも同じインスタンスを使いたい場合はこれを使う
  public static getInstance(): ResultContainer {
    if (!this.instance) {
      this.instance = new ResultContainer(this.instance, 200, 200)
    }
    return this.instance
  }

  init(onClickFunc?: Function) {
    this.resultBg = this.scene.add
      .image(this.gameCenterX, this.gameCenterY, TextureKey.ShootResult)
      .setScale(0.3)
      .setVisible(false)

    this.zResultText = this.scene.add
      .text(this.gameCenterX + 60, this.gameCenterY - 85, '', {
        fontFamily: 'Cambria',
        fontSize: 30,
        color: '#ffffff',
        stroke: '#000000',
        strokeThickness: 8
      })
      .setDepth(100)

    this.xResultText = this.scene.add
      .text(this.gameCenterX + 60, this.gameCenterY - 35, '', {
        fontFamily: 'Cambria',
        fontSize: 30,
        color: '#ffffff',
        stroke: '#000000',
        strokeThickness: 8
      })
      .setDepth(100)

    this.yResultText = this.scene.add
      .text(this.gameCenterX + 60, this.gameCenterY + 10, '', {
        fontFamily: 'Cambria',
        fontSize: 30,
        color: '#ffffff',
        stroke: '#000000',
        strokeThickness: 8
      })
      .setDepth(100)

    this.resultNextButton = new ImageButton(
      this.scene,
      this.gameCenterX + 120,
      this.gameCenterY + 80,
      TextureKey.ShootResultNextOff,
      TextureKey.ShootResultNextOn,
      () => {
        this.resultBg.setVisible(false)
        this.resultNextButton.setScale(0.2).setVisible(false)
        this.zResultText.setX(this.gameCenterX + 60).setVisible(false)
        this.xResultText.setX(this.gameCenterX + 60).setVisible(false)
        this.yResultText.setX(this.gameCenterX + 60).setVisible(false)
        if (onClickFunc != null) {
          onClickFunc()
        }
      }
    )
      .setScale(0)
      .setVisible(false)
  }

  /**
   * おみくじの結果の設定
   * @param resultImage
   */
  public setResult(z: number, x: number, y: number) {
    this.resultBg.setVisible(true)
    this.zResultText.setText(z.toFixed(1).toString() + 'M').setVisible(true)
    this.xResultText.setText(x.toFixed(1).toString() + 'M').setVisible(true)
    this.yResultText.setText(y.toFixed(1).toString() + 'M').setVisible(true)

    this.animation()
  }

  /**
   * アニメーション再生
   * @param resultImage
   */
  public animation() {
    this.resultNextButton.setVisible(true)
    this.resultNextButton.inactiveButton()
    this.scene.tweens.add({
      targets: [this.resultNextButton],
      scale: 0.1,
      ease: 'Power2',
      duration: 200,
      onComplete: () => {
        this.zResultTextAnimation()
      }
    })
  }

  /**
   * アニメーション再生
   * @param resultImage
   */
  public zResultTextAnimation() {
    this.scene.tweens.add({
      targets: this.zResultText,
      x: this.zResultText.x - 100,
      duration: 100,
      ease: 'Power2',
      onComplete: () => {
        this.xResultTextAnimation()
      }
    })
  }

  public xResultTextAnimation() {
    this.scene.tweens.add({
      targets: this.xResultText,
      x: this.xResultText.x - 100,
      duration: 100,
      ease: 'Power2',
      onComplete: () => {
        this.yResultTextAnimation()
      }
    })
  }

  public yResultTextAnimation() {
    this.scene.tweens.add({
      targets: this.yResultText,
      x: this.yResultText.x - 100,
      duration: 100,
      ease: 'Power2',
      onComplete: () => {
        this.resultNextButton.activeButton()
      }
    })
  }
}
