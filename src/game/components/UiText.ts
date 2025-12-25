export default class UiText extends Phaser.GameObjects.Text {
  private textString: string = ''
  /**
   *
   * @param scene
   * @param x
   * @param y
   * @param text
   * @param fontFamily
   * @param fontSize
   * @param color
   */
  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    text: string,
    fontFamily: string = 'Arial',
    fontSize: string = '16px',
    color: string = '#ffffff',
    depth: number
  ) {
    super(scene, x, y, text, {
      fontFamily: fontFamily,
      fontSize: fontSize,
      color: color
    })
    this.setDepth(depth)
    scene.add.existing(this)
  }

  /**
   * テキストの変更
   * @param text
   */
  public setTextString(text: string) {
    this.textString = text
    this.setText(this.textString)
  }

  /**
   * テキストを空白にする
   */
  public deleteTextString() {
    this.textString = ''
    this.setText(this.textString)
  }
}
