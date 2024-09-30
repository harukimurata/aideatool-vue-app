import { GameObjects, Scene } from 'phaser'

import { EventBus } from '../EventBus'
import SceneKey from '../const/SceneKey'
import TextureKey from '../const/TextureKey'
import ImageButton from '../components/ImageButton'
import { delayPromise } from '../helper'

const MAX_SLOT_BET = 3

enum REEL_NUMBER {
  LEFT,
  CENTER,
  RIGHT
}

export class SlotScene extends Scene {
  background!: GameObjects.Image
  betNumText!: GameObjects.Text
  addCoinText!: GameObjects.Text
  coinNumText!: GameObjects.Text

  slotMachineUnder!: GameObjects.Image
  slotMachineOver!: GameObjects.Image
  slotMachineNumber1!: GameObjects.Image
  slotMachineNumber2!: GameObjects.Image
  slotMachineNumber3!: GameObjects.Image

  slotBetButton!: ImageButton
  slotStartButton!: ImageButton
  slotStopButton1!: ImageButton
  slotStopButton2!: ImageButton
  slotStopButton3!: ImageButton
  slotChargeButton1!: GameObjects.Image
  slotChargeButton2!: GameObjects.Image
  slotChargeButton3!: GameObjects.Image

  private betCount = 0
  private addCoinNum = 0
  private coinNum = 1000
  private saveStopNumber: number | null = null
  private saveStopNumber1: number | null = null
  private saveStopNumber2: number | null = null
  private saveStopNumber3: number | null = null
  private isSlotStart = false
  private isStopNumber1 = false
  private isStopNumber2 = false
  private isStopNumber3 = false

  private slotNumberArray: string[] = [
    TextureKey.SlotNumber0,
    TextureKey.SlotNumber1,
    TextureKey.SlotNumber2,
    TextureKey.SlotNumber3,
    TextureKey.SlotNumber4,
    TextureKey.SlotNumber5,
    TextureKey.SlotNumber6,
    TextureKey.SlotNumber7,
    TextureKey.SlotNumber8,
    TextureKey.SlotNumber9
  ]

  constructor() {
    super(SceneKey.SlotScene)
  }

  /**
   * アセット初期化
   */
  create() {
    const gameWidth = this.scale.width
    const gameHeight = this.scale.height
    this.background = this.add.image(gameWidth / 2, gameHeight / 2, TextureKey.SlotBG)
    this.slotMachineUnder = this.add
      .image(gameWidth / 2, gameHeight / 2 - 86, TextureKey.SlotMachineUnder)
      .setScale(1.15)
    this.slotMachineNumber1 = this.add
      .image(gameWidth / 2 - 170, gameHeight / 2 - 86, TextureKey.SlotNumber0)
      .setScale(1.5)
    this.slotMachineNumber2 = this.add
      .image(gameWidth / 2, gameHeight / 2 - 86, TextureKey.SlotNumber0)
      .setScale(1.5)
    this.slotMachineNumber3 = this.add
      .image(gameWidth / 2 + 175, gameHeight / 2 - 86, TextureKey.SlotNumber0)
      .setScale(1.5)
    this.slotMachineOver = this.add
      .image(gameWidth / 2, gameHeight / 2, TextureKey.SlotMachineOver)
      .setScale(1.15)
    this.slotChargeButton1 = this.add
      .image(gameWidth / 2 - 170, 190, TextureKey.SlotButtonC)
      .setScale(0.6)
    this.slotChargeButton2 = this.add
      .image(gameWidth / 2, 190, TextureKey.SlotButtonC)
      .setScale(0.6)
    this.slotChargeButton3 = this.add
      .image(gameWidth / 2 + 170, 190, TextureKey.SlotButtonC)
      .setScale(0.6)

    this.betNumText = this.add
      .text(100, 140, 'Bet: ' + this.betCount, {
        fontFamily: 'Arial Black',
        fontSize: 28,
        color: '#ffffff',
        stroke: '#000000',
        strokeThickness: 8
      })
      .setOrigin(0.5)
      .setDepth(100)

    this.addCoinText = this.add
      .text(500, 85, '+ ' + this.addCoinNum, {
        fontFamily: 'Cambria',
        fontSize: 38,
        color: '#ff0000',
        stroke: '#000000',
        strokeThickness: 8
      })
      .setOrigin(0.5)
      .setDepth(100)
      .setAlpha(0)

    this.coinNumText = this.add
      .text(450, 140, 'COIN: ' + this.coinNum, {
        fontFamily: 'Cambria',
        fontSize: 38,
        color: '#ffffff',
        stroke: '#000000',
        strokeThickness: 8
      })
      .setOrigin(0.5)
      .setDepth(100)

    this.slotBetButton = new ImageButton(
      this,
      80,
      gameHeight / 2 + 70,
      TextureKey.SlotBetA,
      TextureKey.SlotBetB,
      () => {
        if (!this.isSlotStart) {
          this.slotBet()
        }
      }
    ).setScale(0.6)
    this.add.existing(this.slotBetButton)

    this.slotStartButton = new ImageButton(
      this,
      gameWidth / 2 + 220,
      gameHeight / 2 + 70,
      TextureKey.SlotStartA,
      TextureKey.SlotStartB,
      () => {
        if (!this.isSlotStart) {
          this.slotStart()
        }
      }
    ).setScale(0.7)
    this.add.existing(this.slotStartButton)

    this.slotStopButton1 = new ImageButton(
      this,
      gameWidth / 2 - 120,
      gameHeight / 2 + 70,
      TextureKey.SlotButtonA,
      TextureKey.SlotButtonB,
      () => {
        if (this.isSlotStart && !this.isStopNumber1) {
          this.stopReel(REEL_NUMBER.LEFT)
        }
      }
    ).setScale(0.9)
    this.add.existing(this.slotStopButton1)

    this.slotStopButton2 = new ImageButton(
      this,
      gameWidth / 2,
      gameHeight / 2 + 70,
      TextureKey.SlotButtonA,
      TextureKey.SlotButtonB,
      () => {
        if (this.isSlotStart && !this.isStopNumber2) {
          this.stopReel(REEL_NUMBER.CENTER)
        }
      }
    ).setScale(0.9)
    this.add.existing(this.slotStopButton2)

    this.slotStopButton3 = new ImageButton(
      this,
      gameWidth / 2 + 120,
      gameHeight / 2 + 70,
      TextureKey.SlotButtonA,
      TextureKey.SlotButtonB,
      () => {
        if (this.isSlotStart && !this.isStopNumber3) {
          this.stopReel(REEL_NUMBER.RIGHT)
        }
      }
    ).setScale(0.9)
    this.add.existing(this.slotStopButton3)

    EventBus.emit('current-scene-ready', this)
  }

  /**
   * ゲームループ
   */
  update() {
    if (this.isSlotStart) {
      const slotNumber1 = Math.floor(Math.random() * 9) + 1
      const slotNumber2 = Math.floor(Math.random() * 9) + 1
      const slotNumber3 = Math.floor(Math.random() * 9) + 1

      if (!this.isStopNumber1) {
        const slotNumber = this.expectedValue(slotNumber1)
        this.saveStopNumber1 = slotNumber
        this.slotMachineNumber1.setTexture(this.slotNumberArray[slotNumber])
      }
      if (!this.isStopNumber2) {
        const slotNumber = this.expectedValue(slotNumber2)
        this.saveStopNumber2 = slotNumber
        this.slotMachineNumber2.setTexture(this.slotNumberArray[slotNumber])
      }
      if (!this.isStopNumber3) {
        const slotNumber = this.expectedValue(slotNumber3)
        this.saveStopNumber3 = slotNumber
        this.slotMachineNumber3.setTexture(this.slotNumberArray[slotNumber])
      }
    }
  }

  /**
   * ベット
   */
  private slotBet() {
    if (this.betCount < MAX_SLOT_BET) {
      this.betCount = this.betCount + 1
      this.betNumText.setText('Bet: ' + this.betCount * 2)
      this.coinNum = this.coinNum - 2
      this.coinNumText.setText('COIN: ' + this.coinNum)

      if (this.betCount == 1) {
        this.slotChargeButton1.setTexture(TextureKey.SlotButtonD)
      } else if (this.betCount == 2) {
        this.slotChargeButton2.setTexture(TextureKey.SlotButtonD)
      } else if (this.betCount == 3) {
        this.slotChargeButton3.setTexture(TextureKey.SlotButtonD)
      }
    }
  }

  /**
   * スロット開始
   */
  private slotStart() {
    this.isSlotStart = true
  }

  /**
   * ストップ処理
   */
  private stopReel(reelNumber: number) {
    switch (reelNumber) {
      case REEL_NUMBER.LEFT:
        this.isStopNumber1 = true
        this.slotResult(this.slotMachineNumber1)
        break

      case REEL_NUMBER.CENTER:
        this.isStopNumber2 = true
        this.slotResult(this.slotMachineNumber2)
        break

      case REEL_NUMBER.RIGHT:
        this.isStopNumber3 = true
        this.slotResult(this.slotMachineNumber3)
        break
    }
  }

  /**
   * スロット停止処理
   * @param object
   */
  private slotResult(object: GameObjects.Image) {
    this.stopAnimation(object)
    if (this.isStopNumber1 && this.isStopNumber2 && this.isStopNumber3) {
      if (
        this.saveStopNumber1 &&
        this.saveStopNumber2 &&
        this.saveStopNumber3 &&
        this.saveStopNumber
      ) {
        if (
          this.saveStopNumber1 == this.saveStopNumber2 &&
          this.saveStopNumber2 == this.saveStopNumber3
        ) {
          const addCoin = this.betCount * 2 * this.saveStopNumber
          this.addCoinNum = addCoin
          const newCoinNum = this.coinNum + addCoin
          this.addCoinAnimation(newCoinNum)
        }
      }
    }
    this.initSlot()
  }

  /**
   * ストップアニメーション
   * @param object
   */
  private stopAnimation(object: GameObjects.Image) {
    this.tweens.add({
      targets: object,
      scale: 1.8,
      duration: 100,
      onComplete: () => {
        this.tweens.add({
          targets: object,
          scale: 1.5,
          duration: 100
        })
      }
    })
  }

  /**
   * 加算アニメーション
   * @param newCoin
   */
  private async addCoinAnimation(newCoin: number) {
    this.addCoinText.setText('+ ' + this.addCoinNum)
    this.tweens.add({
      targets: this.addCoinText,
      y: 100,
      alpha: 1,
      duration: 300,
      onComplete: async () => {
        await delayPromise(this, 700)
        this.addCoinText.setAlpha(0)
      }
    })
    let oldValue = this.coinNum
    const duration = 30
    const addValue = 1
    this.tweens.add({
      targets: this.coinNumText,
      x: {
        from: this.coinNumText.x,
        to: this.coinNumText.x - 3
      },
      y: {
        from: this.coinNumText.y,
        to: this.coinNumText.y - 3
      },
      duration: 100,
      repeat: 10
    })
    while (oldValue !== newCoin) {
      oldValue = oldValue + addValue
      await delayPromise(this, duration)
      this.coinNumText.setText('COIN: ' + oldValue)
    }
    this.coinNum = newCoin
  }

  /**
   * スロット初期化
   */
  private initSlot() {
    if (this.isStopNumber1 && this.isStopNumber2 && this.isStopNumber3) {
      this.time.delayedCall(500, () => {
        this.slotChargeButton1.setTexture(TextureKey.SlotButtonC)
        this.slotChargeButton2.setTexture(TextureKey.SlotButtonC)
        this.slotChargeButton3.setTexture(TextureKey.SlotButtonC)
        this.isStopNumber1 = false
        this.isStopNumber2 = false
        this.isStopNumber3 = false
        this.isSlotStart = false
        this.saveStopNumber = null
        this.saveStopNumber1 = null
        this.saveStopNumber2 = null
        this.saveStopNumber3 = null
        this.betCount = 0
        this.addCoinNum = 0
        this.betNumText.setText('Bet: ' + this.betCount)
      })
    }
  }

  /**
   * ベット量に合わせた期待値の操作
   * @param saveNumber
   * @returns
   */
  private expectedValue(saveNumber: number): number {
    if (this.saveStopNumber == null) {
      this.saveStopNumber = saveNumber
    }

    if (this.betCount == 2) {
      if (Math.floor(Math.random() * 5) === 0) {
        return this.saveStopNumber
      }
    } else if (this.betCount == 3) {
      if (Math.floor(Math.random() * 2) === 0) {
        return this.saveStopNumber
      }
    }
    return saveNumber
  }
}
