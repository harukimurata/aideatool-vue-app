import UiText from './UiText'

export default class DebugTexts {
  private texts!: {
    baseText: string
    uiText: UiText
  }[]

  constructor() {
    this.texts = []
  }

  /**
   * デバッグ用テキストの初期化
   * {1}を変数部分として扱うことができる
   * @param scene
   * @param texts
   */
  public init(scene: Phaser.Scene, texts: string[]) {
    let index = 0
    for (const text of texts) {
      const baseText = `[${index}]` + text
      const y = 10 + this.texts.length * 22
      const uiText = new UiText(scene, 10, y, baseText, 'Arial', '20px', '#000000', 100)
      this.texts.push({ baseText: baseText, uiText })
      index++
    }
  }

  /**
   * 指定した番号のテキストを変更する
   * @param index
   * @param text
   */
  public setTextString(index: number, text: string) {
    if (this.texts[index]) {
      this.texts[index].uiText.setTextString(text)
    }
  }

  /**
   * 指定した番号のテキストの変数部分を置換する
   * @param index
   * @param variable
   */
  public replaceVariable(index: number, variable: string | number) {
    if (this.texts[index]) {
      const nowText = this.texts[index].baseText
      const newText = nowText.replace('{1}', variable.toString())
      this.texts[index].uiText.setTextString(newText)
    }
  }
}
