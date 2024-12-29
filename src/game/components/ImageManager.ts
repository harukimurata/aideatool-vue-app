export default class ImageManager extends Phaser.GameObjects.Image {
  private imageCount = 0
  private indexNum!: number
  private textures!: string[]

  /**
   * イメージマネージャー
   * 切り替えが発生するimageオブジェクトの管理
   * @param scene
   * @param x
   * @param y
   * @param textures
   * @param scale
   * @param initTextureIndex
   */
  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    textures: string[],
    scale = 1,
    initTextureIndex = 0
  ) {
    super(scene, x, y, textures[initTextureIndex])
    this.setScale(scale)
    this.init(textures, initTextureIndex)
  }

  /**
   * 初期化
   * @param texture
   * @param hoverTexture
   * @param onClickFunc
   * @param onPointerFunc
   */
  private init(texture: string[], initTextureIndex: number) {
    this.textures = texture
    this.indexNum = texture.length
    this.setTexture(texture[initTextureIndex])
  }

  public setInit() {
    this.imageCount = 0
    this.setImage(this.imageCount)
    this.isVisible
  }

  /**
   * 画像の変更
   * @param index
   */
  public setImage(index: number) {
    this.setTexture(this.textures[index])
  }

  /**
   * 画像番号をを進める
   */
  public addCount() {
    this.imageCount++
    if (this.imageCount > this.getImageNum()) {
      this.imageCount = 0
    }
    this.setTexture(this.textures[this.imageCount])
  }

  /**
   * 画像番号をを戻す
   */
  public subCount() {
    this.imageCount--
    if (this.imageCount < 0) {
      this.imageCount = this.getImageNum()
    }
    this.setTexture(this.textures[this.imageCount])
  }

  /**
   * 登録されている画像の総数を取得
   * @returns
   */
  public getImageNum() {
    return this.indexNum
  }

  /**
   * 画像を表示する
   */
  public isVisible() {
    this.setVisible(true)
  }

  /**
   * 画像を非表示にする
   */
  public isInvisible() {
    this.setVisible(false)
  }
}
