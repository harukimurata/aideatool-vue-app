import { GameObjects, Scene } from 'phaser'

import { EventBus } from '../EventBus'
import SceneKey from '../const/SceneKey'
import TextureKey from '../const/TextureKey'
import ImageButton from '../components/ImageButton'

const BASE_POS_X = 100
const BASE_POS_Y = 100
const BASE_WIDTH = 100
const BASE_HEIGHT = 100
const ADD_BASE_POS_X = 100
const ADD_BASE_POS_Y = 100
const NUM_IMAGES = 9

export class ScratchScene extends Scene {
  private slotNumberArray: string[] = [
    TextureKey.SlotNumber0, //辰
    TextureKey.SlotNumber1, //巳
    TextureKey.SlotNumber2, //午
    TextureKey.SlotNumber3, //未
    TextureKey.SlotNumber4 //申
  ]

  initButton!: ImageButton
  private imageBox: GameObjects.Image[] = []
  private numberBox: number[] = []

  constructor() {
    super(SceneKey.ScratchScene)
  }

  create() {
    const gameWidth = this.scale.width
    const gameHeight = this.scale.height

    this.add
      .text(gameWidth / 2, gameHeight / 2, 'ScratchScene', {
        fontFamily: 'Arial Black',
        fontSize: 64,
        color: '#ffffff',
        stroke: '#000000',
        strokeThickness: 8,
        align: 'center'
      })
      .setOrigin(0.5)
      .setDepth(100)

    this.initButton = new ImageButton(
      this,
      gameWidth / 2,
      gameHeight / 2 + 100,
      TextureKey.SlotStartA,
      TextureKey.SlotStartB,
      () => {
        this.initNumberBox()
      }
    ).setScale(0.6)
    this.add.existing(this.initButton)

    for (let i = 0; i < NUM_IMAGES; i++) {
      this.imageBox[i] = this.add.image(BASE_POS_X, BASE_POS_X, this.slotNumberArray[0])
    }

    this.initNumberBox()

    EventBus.emit('current-scene-ready', this)
  }

  private initNumberBox() {
    const maxNumber = this.weightedRandom()
    console.log('maxNumber', maxNumber)

    for (let i = 0; i < NUM_IMAGES; i++) {
      if (i < maxNumber) {
        this.numberBox[i] = 0
      } else {
        this.numberBox[i] = Math.floor(Math.random() * 4) + 1
      }
    }

    this.numberBox = this.shuffleNumberBox(this.numberBox)

    console.log('shuffle this.numberBox', this.numberBox)

    let boxNumber = 0
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        this.imageBox[boxNumber].setPosition(
          BASE_POS_X + ADD_BASE_POS_X * i,
          BASE_POS_Y + ADD_BASE_POS_Y * j
        )
        this.imageBox[boxNumber].setTexture(this.slotNumberArray[this.numberBox[boxNumber]])

        boxNumber++
      }
    }
  }

  private shuffleNumberBox(array: number[]) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[array[i], array[j]] = [array[j], array[i]]
    }
    return array
  }

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
