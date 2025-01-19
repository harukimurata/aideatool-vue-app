import type KeyCodes from '../const/KeyCode'

export default class KeyBoardManager {
  private isFunction = false
  private key!: Phaser.Input.Keyboard.Key
  private downFunction?: Function
  private upFunction?: Function
  private chatteringFunction?: Function

  /**
   * キーボード入力マネージャー
   * @param scene
   * @param keyCode
   * @param downFunction
   * @param upFunction
   * @param chatteringFunction
   */
  constructor(
    scene: Phaser.Scene,
    keyCode: KeyCodes,
    downFunction?: Function,
    upFunction?: Function,
    chatteringFunction?: Function
  ) {
    this.key = scene.input.keyboard!.addKey(keyCode)
    this.downFunction = downFunction
    this.upFunction = upFunction
    this.chatteringFunction = chatteringFunction
  }

  /**
   * 離脱処理
   * 押された時だけ反応
   */
  public down() {
    if (this.isFunction && Phaser.Input.Keyboard.JustDown(this.key) && this.downFunction) {
      //console.log('down')
      this.downFunction()
    }
  }

  /**
   * 押下後処理
   * 離された時だけ反応
   */
  public up() {
    if (this.isFunction && Phaser.Input.Keyboard.JustUp(this.key) && this.upFunction) {
      //console.log('up')
      this.upFunction()
    }
  }

  /**
   * 押下中処理
   * 押されている限り反応
   */
  public chattering() {
    if (this.isFunction && this.key.isDown && this.chatteringFunction) {
      //console.log('chattering')
      this.chatteringFunction()
    }
  }

  /**
   * キーボード有効フラグセット
   * @param value
   */
  public setIsFunction(value: boolean) {
    this.isFunction = value
  }
}
