import { GameObjects, Scene } from 'phaser'

import { EventBus } from '../EventBus'
import SceneKey from '../const/SceneKey'
import TextureKey from '../const/TextureKey'
import ImageButton from '../components/ImageButton'

const BASE_POS_X = 130
const BASE_POS_Y = 230
const ADD_BASE_POS_X = 170
const ADD_BASE_POS_Y = 170
const NUM_IMAGES = 9
const HIT_NUMBER = 0
const MAX_HIT_COUNT = 5
const MAX_OPEN_SCRATCH_COUNT = 5
const RESULT_IMAGE_KEYS = [
  {
    value: 3,
    imageKey: TextureKey.NengaAtari_1
  },
  {
    value: 4,
    imageKey: TextureKey.NengaAtari_2
  },
  {
    value: 5,
    imageKey: TextureKey.NengaAtari_3
  }
]

interface IMAGE_POS {
  x: number
  y: number
}

export class ScratchScene extends Scene {
  private gameWidth = 0
  private gameHeight = 0

  private slotNumberArray: string[] = [
    TextureKey.NengaSnake, //み
    TextureKey.NengaHose, //うま
    TextureKey.NengaSheep, //ひつじ
    TextureKey.NengaMonkey, //さる
    TextureKey.NengaChicken //とり
  ]

  private scratchResult!: GameObjects.Image
  initButton!: ImageButton
  private openScratchNum = MAX_OPEN_SCRATCH_COUNT
  private imagePos: IMAGE_POS[] = []
  private selectButtonBox: ImageButton[] = []
  private imageBox: GameObjects.Image[] = []
  private numberBox: number[] = []
  private openedScratchNumberBox: number[] = []

  constructor() {
    super(SceneKey.ScratchScene)
  }

  create() {
    this.gameWidth = this.scale.width
    this.gameHeight = this.scale.height

    this.add.image(this.gameWidth / 2, this.gameHeight / 2, TextureKey.NengaBase)

    //スクラッチ番号ボックス生成
    this.createNumberBox()
    for (let i = 0; i < NUM_IMAGES; i++) {
      this.imageBox[i] = this.add
        .image(BASE_POS_X, BASE_POS_X, this.slotNumberArray[0])
        .setScale(0.9)
      this.selectButtonBox[i] = new ImageButton(
        this,
        BASE_POS_X,
        BASE_POS_Y,
        TextureKey.NengaSilver,
        TextureKey.NengaSilver,
        () => {
          if (this.openScratchNum > 0) {
            this.tweens.add({
              targets: this.selectButtonBox[i],
              alphaTopRight: { value: 0, duration: 300, ease: 'Power1' },
              alphaBottomRight: { value: 0, duration: 300, ease: 'Power1' },
              alphaTopLeft: { value: 0, duration: 200, ease: 'Power1', delay: 100 },
              alphaBottomLeft: { value: 0, duration: 200, ease: 'Power1', delay: 100 }
            })
            this.selectButtonBox[i].inactiveButton()
            this.openScratch(this.numberBox[i])
          }
        }
      )
      this.add.existing(this.selectButtonBox[i])
    }

    this.scratchResult = this.add
      .image(this.gameWidth / 2, this.gameHeight / 2, RESULT_IMAGE_KEYS[0].imageKey)
      .setAlpha(0)
      .setVisible(false)

    //初期化ボタン
    this.initButton = new ImageButton(
      this,
      this.gameWidth / 2,
      this.gameHeight / 2,
      TextureKey.NengaRetry,
      TextureKey.NengaRetry,
      () => {
        this.createNumberBox()
        this.initNumberBox()
      }
    ).setScale(0.2)
    this.initButton.setVisible(false)
    this.add.existing(this.initButton)

    //スクラッチ番号ボックスの初期化
    this.initNumberBox()
    EventBus.emit('current-scene-ready', this)
  }

  //スクラッチ番号ボックスの初期化
  private initNumberBox() {
    this.openScratchNum = MAX_OPEN_SCRATCH_COUNT
    this.openedScratchNumberBox = []
    this.scratchResult.setAlpha(0).setScale(0.2).setVisible(false)
    this.initButton.setScale(0.2).setVisible(false)

    let boxNumber = 0
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        this.imagePos[boxNumber] = {
          x: BASE_POS_X + ADD_BASE_POS_X * i,
          y: BASE_POS_Y + ADD_BASE_POS_Y * j
        }
        this.imageBox[boxNumber].setPosition(BASE_POS_X, BASE_POS_Y)
        this.imageBox[boxNumber].setTexture(this.slotNumberArray[this.numberBox[boxNumber]])

        this.selectButtonBox[boxNumber].activeButton()
        this.selectButtonBox[boxNumber].setAlpha(1)
        this.selectButtonBox[boxNumber].setPosition(BASE_POS_X, BASE_POS_Y)
        boxNumber++
      }
    }

    this.initImagePos()
  }

  //スクラッチ番号ボックス生成
  private createNumberBox() {
    for (let i = 0; i < NUM_IMAGES; i++) {
      if (i < MAX_HIT_COUNT) {
        this.numberBox[i] = 0
      } else {
        this.numberBox[i] = Math.floor(Math.random() * 4) + 1
      }
    }

    this.numberBox = this.shuffleNumberBox(this.numberBox)
  }

  //スクラッチ番号ボックスをランダムに並び替える
  private shuffleNumberBox(array: number[]) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[array[i], array[j]] = [array[j], array[i]]
    }
    return array
  }

  //スクラッチ番号ボックスの移動処理
  private initImagePos() {
    for (let i = 0; i < NUM_IMAGES; i++) {
      this.tweens.add({
        targets: [this.imageBox[i], this.selectButtonBox[i]],
        x: this.imagePos[i].x,
        y: this.imagePos[i].y,
        ease: 'Bounce',
        duration: 500
      })
    }
  }

  //スクラッチ削り処理
  private openScratch(openNumber: number) {
    this.openScratchNum--
    this.openedScratchNumberBox.push(openNumber)
    if (this.openScratchNum <= 0) {
      this.result()
    }
  }

  //結果表示処理
  private result() {
    const hitCount = this.openedScratchNumberBox.filter((number) => number == HIT_NUMBER).length
    const resultImageLKey =
      RESULT_IMAGE_KEYS.find((key) => key.value == hitCount)?.imageKey || TextureKey.NengaHazure
    if (resultImageLKey == TextureKey.NengaHazure) {
      this.initButton.setPosition(this.gameWidth / 2, this.gameHeight / 2 + 80)
    } else {
      this.initButton.setPosition(this.gameWidth / 2, this.gameHeight / 2 + 220)
    }
    this.scratchResult.setTexture(resultImageLKey).setVisible(true)
    this.initButton.setVisible(true)
    this.initButton.inactiveButton()
    this.tweens.add({
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

  //あたりの発生確率を変える
  private weightedRandom() {
    const random = Math.random() // 0 <= random < 1

    if (random < 0.5) {
      return 3 // 50%
    } else if (random < 0.8) {
      return 4 // 30%
    } else {
      return 5 // 20%
    }
  }
}
