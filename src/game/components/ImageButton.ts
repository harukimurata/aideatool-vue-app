//ダブルクリックの制御
const doubleClickTime = 100

export default class ImageButton extends Phaser.GameObjects.Sprite {
  private isButtonActive: boolean = true
  private isHoverActive: boolean = true
  private lastClickTime = 0

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    texture: string,
    hoverTexture: string,
    onClickFunc?: Function,
    onPointerFunc?: Function
  ) {
    super(scene, x, y, texture)
    this.init(texture, hoverTexture, onClickFunc, onPointerFunc)
  }

  /**
   * ImageButton初期化
   * @param texture
   * @param hoverTexture
   * @param onClickFunc
   * @param onPointerFunc
   */
  private init(
    texture: string,
    hoverTexture: string,
    onClickFunc?: Function,
    onPointerFunc?: Function
  ) {
    if (onClickFunc != null) {
      //ボタン押下処理
      this.setInteractive().on(
        'pointerdown',
        () => {
          if (!this.isButtonActive) {
            return
          }

          const currentTime = new Date().getTime()
          const elapsedTime = currentTime - this.lastClickTime
          if (elapsedTime < doubleClickTime) {
            return
          } else {
            onClickFunc()
            this.lastClickTime = currentTime
          }
        },
        this
      )
    }

    //ボタンホバー処理
    this.on(
      'pointerover',
      () => {
        if (!this.isHoverActive) {
          return
        }
        if (onPointerFunc != null) {
          onPointerFunc()
        }

        this.setTexture(hoverTexture)
      },
      this
    )

    //ボタンアウト処理
    this.on(
      'pointerout',
      () => {
        if (!this.isHoverActive) {
          return
        }
        this.setTexture(texture)
      },
      this
    )
  }

  //ボタン有効化
  public activeButton() {
    this.isButtonActive = true
  }

  //ボタン無効化
  public inactiveButton() {
    this.isButtonActive = false
  }

  //ボタン有効化
  public activeButtonHover() {
    this.isHoverActive = true
  }

  //ボタン無効化
  public inactiveButtonHover() {
    this.isHoverActive = false
  }
}
