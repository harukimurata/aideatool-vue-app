import TextureKey from '../const/TextureKey'
import { shuffleArray } from '../helper'

const BONUS_NUMBER = 7
const START_REEL_POS_Y = 200
const END_REEL_POS_Y = 370
const SLOT_MACHINE_NUMBER_Y_POS = 86
//回転スピード
const REEL_SPEED = 700

export interface SlotReel {
  textureName: string
  value: number
}

export default class SlotReelNumber extends Phaser.GameObjects.Image {
  private slotNumberArray: SlotReel[] = [
    {
      textureName: TextureKey.SlotNumber1,
      value: 1
    },
    {
      textureName: TextureKey.SlotNumber2,
      value: 2
    },
    {
      textureName: TextureKey.SlotNumber3,
      value: 3
    },
    {
      textureName: TextureKey.SlotNumber4,
      value: 4
    },
    {
      textureName: TextureKey.SlotNumber5,
      value: 5
    },
    {
      textureName: TextureKey.SlotNumber6,
      value: 6
    },
    {
      textureName: TextureKey.SlotNumber7,
      value: 7
    },
    {
      textureName: TextureKey.SlotReplay,
      value: 8
    },
    {
      textureName: TextureKey.DoubleUp,
      value: 9
    },
    {
      textureName: TextureKey.BetPlus,
      value: 10
    }
  ]

  private gameWidth!: number
  private gameHeight!: number
  private stopNumber!: number
  private imageCount = 0
  private imageCountMax = this.slotNumberArray.length
  private isStop = false

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    texture: string,
    gameWidth: number,
    gameHeight: number
  ) {
    super(scene, x, y, texture)

    this.gameWidth = gameWidth
    this.gameHeight = gameHeight
  }

  /**
   * 初期化
   * @param scene
   */
  public init(scene: Phaser.Scene) {
    this.setIsStop(false)
    this.initAnimation(scene)
  }

  /**
   * 更新処理
   */
  public update(delta: number) {
    if (!this.isStop) {
      this.setY((this.y += REEL_SPEED * (delta / 1000)))

      if (this.y >= END_REEL_POS_Y) {
        this.setY(START_REEL_POS_Y)

        this.imageCount++
        if (this.imageCount >= this.imageCountMax) {
          this.imageCount = 0
        }

        this.setReelNumber(this.imageCount)
      }
    } else {
      this.setY(this.gameHeight / 2 - SLOT_MACHINE_NUMBER_Y_POS)
    }
  }

  /**
   * ストップアニメーション
   * @param scene
   */
  public stopAnimation(scene: Phaser.Scene) {
    scene.tweens.add({
      targets: this,
      scale: 1.8,
      duration: 100,
      onComplete: () => {
        scene.tweens.add({
          targets: this,
          scale: 1.5,
          duration: 100
        })
      }
    })
  }

  /**
   * 初期化アニメーション
   * @param scene
   */
  public initAnimation(scene: Phaser.Scene) {
    this.imageCount = Math.floor(Math.random() * (this.imageCountMax - 1)) + 1
    this.slotNumberArray = shuffleArray(this.slotNumberArray)
    this.setTexture(this.slotNumberArray[this.imageCount].textureName)
    scene.tweens.add({
      targets: this,
      rotation: 2 * Math.PI,
      duration: 200,
      ease: 'Linear'
    })
  }

  /**
   * リールの画像と値セット
   * @param value
   */
  public setReelNumber(value: number) {
    this.setTexture(this.slotNumberArray[value].textureName)
    this.stopNumber = this.slotNumberArray[value].value
  }

  /**
   * ボーナス時にセットする値
   */
  public setBonusNumber() {
    this.setTexture(TextureKey.SlotNumber7)
    this.stopNumber = BONUS_NUMBER
  }

  /**
   * 止めた時の番号取得
   * @returns
   */
  public getStopNumber() {
    return this.stopNumber
  }

  /**
   * リールストップフラグセット
   * @param value
   */
  public setIsStop(value: boolean) {
    this.isStop = value
  }

  /**
   * リールストップフラグ取得
   * @param value
   */
  public getIsStop() {
    return this.isStop
  }
}
