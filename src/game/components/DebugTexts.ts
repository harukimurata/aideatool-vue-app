import UiText from './UiText'

export default class DebugTexts {
  private texts!: UiText[]

  constructor() {
    this.texts = []
  }

  public init(scene: Phaser.Scene, text: string) {
    const y = 10 + this.texts.length * 22
    const uiText = new UiText(scene, 10, y, text, 'Arial', '20px', '#000000', 100)
    this.texts.push(uiText)
  }

  /**
   * 指定した番号のテキストを変更する
   * @param index
   * @param text
   */
  public setTextString(index: number, text: string) {
    if (this.texts[index]) {
      this.texts[index].setTextString(text)
    }
  }
}
