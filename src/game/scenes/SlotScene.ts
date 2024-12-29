import { GameObjects, Scene } from 'phaser'

import { EventBus } from '../EventBus'
import SceneKey from '../const/SceneKey'
import TextureKey from '../const/TextureKey'
import ImageButton from '../components/ImageButton'
import SlotReelNumber from '../components/SlotReelNumber'
import ImageManager from '../components/ImageManager'
import { calcSlotHand, isEvenNumber } from '../utils'
import { delayPromise } from '../helper'
import { SPECIAL_HANDS } from '../const/SlotHand'

const MAX_SLOT_BET = 3
const ADD_DOUBLE_UP_CHANCE = 11
const COIN_NUM_POS_X = 450
const COIN_NUM_POS_Y = 140
const SLOT_MACHINE_NUMBER_Y_POS = 86

export class SlotScene extends Scene {
  gameWidth!: number
  gameHeight!: number

  background!: GameObjects.Image
  slotMachineUnder!: GameObjects.Image
  slotMachineOver!: GameObjects.Image
  betNumText!: GameObjects.Text
  addCoinText!: GameObjects.Text
  coinNumText!: GameObjects.Text

  doubleChanceIcon!: GameObjects.Image
  doubleUpChanceNumText!: GameObjects.Text

  slotReel1!: SlotReelNumber
  slotReel2!: SlotReelNumber
  slotReel3!: SlotReelNumber

  slotBetButton!: ImageButton
  slotStartButton!: ImageButton
  slotStopButton1!: ImageButton
  slotStopButton2!: ImageButton
  slotStopButton3!: ImageButton
  betLamp1!: ImageManager
  betLamp2!: ImageManager
  betLamp3!: ImageManager

  private betCount = 0
  private isBet = false
  private addCoinNum = 0
  private coinNum = 1000
  private isStartReel = false
  private doubleUpChanceCount = 0
  private isReplay = false

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
      .image(gameWidth / 2, gameHeight / 2 - SLOT_MACHINE_NUMBER_Y_POS, TextureKey.SlotMachineUnder)
      .setScale(1.15)

    this.slotReel1 = new SlotReelNumber(
      this,
      gameWidth / 2 - 170,
      gameHeight / 2 - SLOT_MACHINE_NUMBER_Y_POS,
      TextureKey.SlotNumber0,
      gameWidth,
      gameHeight
    ).setScale(1.5)
    this.add.existing(this.slotReel1)

    this.slotReel2 = new SlotReelNumber(
      this,
      gameWidth / 2,
      gameHeight / 2 - SLOT_MACHINE_NUMBER_Y_POS,
      TextureKey.SlotNumber0,
      gameWidth,
      gameHeight
    ).setScale(1.5)
    this.add.existing(this.slotReel2)

    this.slotReel3 = new SlotReelNumber(
      this,
      gameWidth / 2 + 175,
      gameHeight / 2 - SLOT_MACHINE_NUMBER_Y_POS,
      TextureKey.SlotNumber0,
      gameWidth,
      gameHeight
    ).setScale(1.5)
    this.add.existing(this.slotReel3)

    this.slotMachineOver = this.add
      .image(gameWidth / 2, gameHeight / 2, TextureKey.SlotMachineOver)
      .setScale(1.15)

    this.betLamp1 = new ImageManager(
      this,
      gameWidth / 2 - 170,
      190,
      [TextureKey.SlotButtonC, TextureKey.SlotButtonD],
      0.6
    )
    this.add.existing(this.betLamp1)

    this.betLamp2 = new ImageManager(
      this,
      gameWidth / 2,
      190,
      [TextureKey.SlotButtonC, TextureKey.SlotButtonD],
      0.6
    )
    this.add.existing(this.betLamp2)

    this.betLamp3 = new ImageManager(
      this,
      gameWidth / 2 + 170,
      190,
      [TextureKey.SlotButtonC, TextureKey.SlotButtonD],
      0.6
    )
    this.add.existing(this.betLamp3)

    this.doubleChanceIcon = this.add.image(80, 90, TextureKey.DoubleUpIconA).setScale(0.8)

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
      .text(400, 85, '+ ' + this.addCoinNum, {
        fontFamily: 'Cambria',
        fontSize: 38,
        color: '#ff0000',
        stroke: '#000000',
        strokeThickness: 8
      })
      .setOrigin(0.5)
      .setDepth(100)
      .setAlpha(0)

    this.doubleUpChanceNumText = this.add
      .text(125, 100, '× ' + this.doubleUpChanceCount, {
        fontFamily: 'Cambria',
        fontSize: 30,
        color: '#ffffff',
        stroke: '#000000',
        strokeThickness: 8
      })
      .setOrigin(0.5)
      .setDepth(100)

    this.coinNumText = this.add
      .text(COIN_NUM_POS_X, COIN_NUM_POS_Y, 'COIN: ' + this.coinNum, {
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
        if (!this.isStartReel && this.coinNum > 0) {
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
        if (!this.isStartReel && this.betCount >= 1) {
          this.startReel()
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
        if (this.isStartReel && !this.slotReel1.getIsStop()) {
          this.slotReel1.setIsStop(true)
          this.slotResult()
          this.slotReel1.stopAnimation(this)
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
        if (this.isStartReel && !this.slotReel2.getIsStop()) {
          this.slotReel2.setIsStop(true)
          this.slotResult()
          this.slotReel2.stopAnimation(this)
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
        if (this.isStartReel && !this.slotReel3.getIsStop()) {
          this.slotReel3.setIsStop(true)
          this.slotResult()
          this.slotReel3.stopAnimation(this)
        }
      }
    ).setScale(0.9)
    this.add.existing(this.slotStopButton3)

    EventBus.emit('current-scene-ready', this)

    this.slotReel1.init(this)
    this.slotReel2.init(this)
    this.slotReel3.init(this)
  }

  /**
   * ゲームループ
   */
  update() {
    if (!this.isBet) {
      if (this.betCount < 1) {
        this.slotStartButton.setTexture(TextureKey.SlotStartB)
      } else {
        this.isBet = true
        this.slotStartButton.setTexture(TextureKey.SlotStartA)
      }
    }

    if (this.isStartReel) {
      this.slotReel1.update()
      this.slotReel2.update()
      this.slotReel3.update()
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
        this.betLamp1.setImage(1)
      } else if (this.betCount == 2) {
        this.betLamp2.setImage(1)
      } else if (this.betCount == 3) {
        this.betLamp3.setImage(1)
      }
    }
  }

  /**
   * リール回転開始
   */
  private startReel() {
    this.isStartReel = true
    if (this.isReplay) {
      this.isReplay = false
    }
  }

  /**
   * スロット結果処理
   * @param object
   */
  private slotResult() {
    if (this.slotReel1.getIsStop() && this.slotReel2.getIsStop() && this.slotReel3.getIsStop()) {
      const addCoin = calcSlotHand(
        this.slotReel1.getStopNumber(),
        this.slotReel2.getStopNumber(),
        this.slotReel3.getStopNumber()
      )
      if (addCoin > 0) {
        this.calcSpecialHands(addCoin)
      }
      this.initSlot()
    }
  }

  /**
   * 役の決定処理
   * @param hand
   */
  private calcSpecialHands(hand: number) {
    switch (hand) {
      case SPECIAL_HANDS.REPLAY:
        //リプレイ
        this.isReplay = true
        this.betCount = 3
        this.betNumText.setText('Bet: ' + this.betCount * 2)
        this.betLamp1.setImage(1)
        this.betLamp2.setImage(1)
        this.betLamp3.setImage(1)
        break

      case SPECIAL_HANDS.DOUBLE_UP:
        //ダブルアップチャンス
        this.doubleUpChanceCount = this.doubleUpChanceCount + ADD_DOUBLE_UP_CHANCE
        break

      default:
        let newCoinNum = 0
        if (this.doubleUpChanceCount > 0) {
          this.addCoinNum = hand * 2
          newCoinNum = this.coinNum + this.addCoinNum
        } else {
          this.addCoinNum = hand
          newCoinNum = this.coinNum + this.addCoinNum
        }

        this.addCoinAnimation(newCoinNum)
        break
    }
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
      repeat: 10,
      onComplete: () => {
        this.coinNumText.setPosition(COIN_NUM_POS_X, COIN_NUM_POS_Y)
      }
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
    if (this.slotReel1.getIsStop() && this.slotReel2.getIsStop() && this.slotReel3.getIsStop()) {
      this.time.delayedCall(500, () => {
        if (!this.isReplay) {
          this.betLamp1.setInit()
          this.betLamp2.setInit()
          this.betLamp3.setInit()
          this.betCount = 0
          this.isBet = false
          this.addCoinNum = 0
          this.betNumText.setText('Bet: ' + this.betCount)
        }

        this.slotReel1.init(this)
        this.slotReel2.init(this)
        this.slotReel3.init(this)
        this.isStartReel = false

        this.doubleUpChanceCount = this.doubleUpChanceCount - 1
        if (this.doubleUpChanceCount < 0) {
          this.doubleUpChanceCount = 0
          this.doubleUpChanceNumText.setText('× ' + this.doubleUpChanceCount)
        } else {
          this.doubleUpChanceNumText.setText('× ' + this.doubleUpChanceCount)
        }
      })
    }
  }
}
