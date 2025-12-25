//ダブルクリックの制御
const doubleClickTime = 100

export default class ImageButton extends Phaser.GameObjects.Sprite {
  private isButtonActive: boolean = true
  private isHoverActive: boolean = true
  private lastClickTime = 0

  // ホールド関連
  private isHolding = false
  private holdTimer?: Phaser.Time.TimerEvent
  private holdIntervalMs = 100
  private onHoldFunc?: Function

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    texture: string,
    hoverTexture: string,
    onClickFunc?: Function,
    onPointerFunc?: Function,
    onHoldFunc?: Function, // 押下中に繰り返し呼ばれるコールバック
    holdIntervalMs: number = 100
  ) {
    super(scene, x, y, texture)
    this.onHoldFunc = onHoldFunc
    this.holdIntervalMs = holdIntervalMs
    this.init(texture, hoverTexture, onClickFunc, onPointerFunc)
    scene.add.existing(this)
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

          // 押下中（ホールド）開始
          if (this.onHoldFunc) {
            this.isHolding = true
            // 即時呼び出し（必要なら）と間隔での繰り返し呼び出し
            this.onHoldFunc()
            this.holdTimer = this.scene.time.addEvent({
              delay: this.holdIntervalMs,
              loop: true,
              callback: () => {
                if (this.isHolding && this.onHoldFunc) {
                  this.onHoldFunc()
                }
              }
            })
          }
        },
        this
      )
    }

    // 押下を離したとき（オブジェクト内／外）にホールド停止
    this.on(
      'pointerup',
      () => {
        this.stopHold()
      },
      this
    )
    this.on(
      'pointerupoutside',
      () => {
        this.stopHold()
      },
      this
    )

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
        // pointerout 時にもホールドを止める（押下中にカーソルが外れた場合）
        this.stopHold()
        this.setTexture(texture)
      },
      this
    )
  }

  // ホールド停止の共通処理
  private stopHold() {
    this.isHolding = false
    if (this.holdTimer) {
      this.holdTimer.remove()
      this.holdTimer = undefined
    }
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
