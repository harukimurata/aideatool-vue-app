import { GameObjects, Scene } from 'phaser'

import { EventBus } from '../EventBus'
import SceneKey from '../const/SceneKey'
import TextureKey from '../const/TextureKey'
import ImageButton from '../components/ImageButton'
import SlotReelNumber from '../components/SlotReelNumber'
import ImageManager from '../components/ImageManager'
import { calcSlotHand } from '../logic/slot'
import { isEvenNumber } from '../utils'
import { delayPromise } from '../helper'
import { SPECIAL_HANDS } from '../const/SlotHand'

const SLOT_REEL_NUM = 3
const STOP_BUTTON_NUM = 3
const BET_VALUE = 2
const MAX_SLOT_BET = 3
const MAX_BONUS_STAR = 5
const SLOT_REEL_POS_X = 170
const SLOT_REEL_POS_X_SPACE = 170
const STOP_BUTTON_POS_X = 120
const STOP_BUTTON_POS_X_SPACE = 120
const STOP_BUTTON_POS_Y = 70
const DOUBLE_UP_ICON_POS_X = 80
const DOUBLE_UP_ICON_POS_Y = 80
const DOUBLE_UP_TEXT_POS_X = 135
const DOUBLE_UP_TEXT_POS_Y = 90
const BET_PLUS_ICON_POS_X = 80
const BET_PLUS_ICON_POS_Y = 130
const BET_PLUS_TEXT_POS_X = 135
const BET_PLUS_TEXT_POS_Y = 140
const BONUS_POS_X = 100
const BONUS_POS_X_SPACE = 50
const BET_NUM_TEXT_POS_X = 165
const BET_NUM_TEXT_POS_Y = 175
const BET_LUMP_POS_X = 80
const BET_LUMP_POS_Y = 163
const BET_LUMP_POS_Y_SPACE = 11
const ADD_DOUBLE_UP = 11
const ADD_BET_PLUS = 11
const COIN_NUM_POS_X = 450
const COIN_NUM_POS_Y = 175
const SLOT_MACHINE_NUMBER_Y_POS = 85

export class SlotScene extends Scene {
  gameWidth!: number
  gameHeight!: number

  background!: GameObjects.Image
  slotMachineUnder!: GameObjects.Image
  slotMachineOver!: GameObjects.Image
  betNumText!: GameObjects.Text
  addCoinText!: GameObjects.Text
  coinNumText!: GameObjects.Text

  doubleUpIcon!: GameObjects.Image
  doubleUpNumText!: GameObjects.Text

  betPlusIcon!: GameObjects.Image
  betPlusNumText!: GameObjects.Text

  slotBetButton!: ImageButton
  slotStartButton!: ImageButton

  bonusStars: ImageManager[] = []
  betLamps: ImageManager[] = []

  slotReels: SlotReelNumber[] = []
  slotStopButtons: ImageButton[] = []

  private betCount = 0
  private betValue = 0
  private isBet = false
  private addCoinNum = 0
  private coinNum = 1000
  private isStartReel = false
  private doubleUpCount = 0
  private betPlusCount = 0
  private isBonusMax = false
  private bonusCount = 0
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
      .image(gameWidth / 2, gameHeight / 2, TextureKey.SlotMachineUnder)
      .setScale(1.2)

    for (let i = 0; i < SLOT_REEL_NUM; i++) {
      this.slotReels[i] = new SlotReelNumber(
        this,
        gameWidth / 2 - SLOT_REEL_POS_X + SLOT_REEL_POS_X_SPACE * i,
        gameHeight / 2 - SLOT_MACHINE_NUMBER_Y_POS,
        TextureKey.SlotNumber0,
        gameWidth,
        gameHeight
      ).setScale(1.5)
      this.add.existing(this.slotReels[i])
    }

    this.slotMachineOver = this.add
      .image(gameWidth / 2, gameHeight / 2, TextureKey.SlotMachineOver)
      .setScale(1.2)

    for (let i = 0; i < MAX_SLOT_BET; i++) {
      this.betLamps[i] = new ImageManager(
        this,
        BET_LUMP_POS_X,
        BET_LUMP_POS_Y + BET_LUMP_POS_Y_SPACE * i,
        [TextureKey.SlotBetLumpB, TextureKey.SlotBetLumpA],
        0.4
      )
      this.add.existing(this.betLamps[i])
    }

    for (let i = 0; i < MAX_BONUS_STAR; i++) {
      this.bonusStars[i] = new ImageManager(
        this,
        gameWidth / 2 - BONUS_POS_X + BONUS_POS_X_SPACE * i,
        80,
        [TextureKey.SlotStarB, TextureKey.SlotStarA, TextureKey.SlotStarC],
        0.7
      )
      this.add.existing(this.bonusStars[i])
    }

    this.doubleUpIcon = this.add
      .image(DOUBLE_UP_ICON_POS_X, DOUBLE_UP_ICON_POS_Y, TextureKey.DoubleUpIconA)
      .setScale(0.8)

    this.betPlusIcon = this.add
      .image(BET_PLUS_ICON_POS_X, BET_PLUS_ICON_POS_Y, TextureKey.BetPlusIcon)
      .setScale(0.8)

    this.betNumText = this.add
      .text(BET_NUM_TEXT_POS_X, BET_NUM_TEXT_POS_Y, 'Bet: ' + this.betCount, {
        fontFamily: 'Arial Black',
        fontSize: 32,
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

    this.doubleUpNumText = this.add
      .text(DOUBLE_UP_TEXT_POS_X, DOUBLE_UP_TEXT_POS_Y, '× ' + this.doubleUpCount, {
        fontFamily: 'Cambria',
        fontSize: 30,
        color: '#ffffff',
        stroke: '#000000',
        strokeThickness: 8
      })
      .setOrigin(0.5)
      .setDepth(100)

    this.betPlusNumText = this.add
      .text(BET_PLUS_TEXT_POS_X, BET_PLUS_TEXT_POS_Y, '× ' + this.betPlusCount, {
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
          this.slotStartButton.inactiveButton()
          this.startReel()
        }
      }
    ).setScale(0.7)
    this.add.existing(this.slotStartButton)

    for (let i = 0; i < STOP_BUTTON_NUM; i++) {
      this.slotStopButtons[i] = new ImageButton(
        this,
        gameWidth / 2 - STOP_BUTTON_POS_X + STOP_BUTTON_POS_X_SPACE * i,
        gameHeight / 2 + STOP_BUTTON_POS_Y,
        TextureKey.SlotButtonA,
        TextureKey.SlotButtonB,
        () => {
          if (this.isStartReel && !this.slotReels[i].getIsStop()) {
            this.slotReels[i].setIsStop(true)

            if (this.isBonusMax) {
              this.slotReels[i].setBonusNumber()
            }

            this.slotResult()
            this.slotReels[i].stopAnimation(this)
          }
        }
      ).setScale(0.9)
      this.add.existing(this.slotStopButtons[i])
    }

    EventBus.emit('current-scene-ready', this)

    for (let i = 0; i < SLOT_REEL_NUM; i++) {
      this.slotReels[i].init(this)
    }
  }

  /**
   * ゲームループ
   */
  update(time: number, delta: number) {
    if (!this.isBet) {
      if (this.betCount < 1) {
        this.slotStartButton.setTexture(TextureKey.SlotStartB)
      } else {
        this.isBet = true
        this.slotStartButton.setTexture(TextureKey.SlotStartA)
      }
    }

    if (this.isStartReel) {
      this.slotReels[0].update(delta)
      this.slotReels[1].update(delta)
      this.slotReels[2].update(delta)
    }
  }

  /**
   * ベット
   */
  private slotBet() {
    if (this.betCount < MAX_SLOT_BET) {
      this.betCount = this.betCount + 1
      let addBet = 0
      if (this.betPlusCount > 0) {
        addBet = this.betCount * (BET_VALUE + 1)
      } else {
        addBet = this.betCount * BET_VALUE
      }
      this.betValue = addBet
      this.betNumText.setText('Bet: ' + this.betValue)

      //持ちコイン更新
      this.coinNum = this.coinNum - BET_VALUE
      this.coinNumText.setText('COIN: ' + this.coinNum)

      if (this.betCount == 1) {
        this.betLamps[2].addCount()
      } else if (this.betCount == 2) {
        this.betLamps[1].addCount()
      } else if (this.betCount == 3) {
        this.betLamps[0].addCount()
      }
    }
  }

  /**
   * リール回転開始
   */
  private async startReel() {
    for (let i = 0; i < SLOT_REEL_NUM; i++) {
      this.slotReels[i].init(this)
    }

    await delayPromise(this, 300)
    this.isStartReel = true
    this.isReplay = false
  }

  /**
   * スロット結果処理
   * @param object
   */
  private slotResult() {
    if (
      this.slotReels[0].getIsStop() &&
      this.slotReels[1].getIsStop() &&
      this.slotReels[2].getIsStop()
    ) {
      if (this.isBonusMax) {
        this.bonusModeCountDowner()
      } else {
        this.bonusCharger()
      }
      this.bonusImageManager()
      const addCoin = calcSlotHand(
        this.slotReels[0].getStopNumber(),
        this.slotReels[1].getStopNumber(),
        this.slotReels[2].getStopNumber()
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
        for (let i = 0; i < MAX_SLOT_BET; i++) {
          this.betLamps[i].setImage(1)
        }
        break

      case SPECIAL_HANDS.DOUBLE_UP:
        //ダブルアップ
        this.doubleUpCount = this.doubleUpCount + ADD_DOUBLE_UP
        break
      case SPECIAL_HANDS.BET_PLUS:
        //BET量加算
        this.betPlusCount = this.betPlusCount + ADD_BET_PLUS
        break

      default:
        let newCoinNum = 0
        if (this.doubleUpCount > 0) {
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
    this.coinNum = newCoin
    let addCoinNum = 0
    while (oldValue !== newCoin) {
      addCoinNum += addValue
      if (addCoinNum < 50) {
        oldValue = oldValue + addValue
        await delayPromise(this, duration)
        this.coinNumText.setText('COIN: ' + oldValue)
      } else {
        this.coinNumText.setText('COIN: ' + this.coinNum)
        break
      }
    }
  }

  /**
   * ボーナスのチャージ処理
   */
  private bonusCharger() {
    if (
      isEvenNumber(
        this.slotReels[0].getStopNumber(),
        this.slotReels[1].getStopNumber(),
        this.slotReels[2].getStopNumber()
      )
    ) {
      this.bonusCount++
      if (this.bonusCount > MAX_BONUS_STAR) {
        this.bonusCount = 5
        this.isBonusMax = true
      }
    } else {
      this.bonusCount--
      if (this.bonusCount < 0) {
        this.bonusCount = 0
      }
    }
  }

  /**
   * ボーナスモードのカウント処理
   */
  private bonusModeCountDowner() {
    this.bonusCount--
    if (this.bonusCount == 0) {
      this.isBonusMax = false
    }
  }

  /**
   * ボーナスの画像更新処理
   */
  private bonusImageManager() {
    if (this.isBonusMax) {
      for (let i = 0; i < MAX_BONUS_STAR; i++) {
        if (i < this.bonusCount) {
          this.bonusStars[i].setImage(2)
        } else {
          this.bonusStars[i].setImage(0)
        }
      }
    } else {
      for (let i = 0; i < MAX_BONUS_STAR; i++) {
        if (i < this.bonusCount) {
          this.bonusStars[i].setImage(1)
        } else {
          this.bonusStars[i].setImage(0)
        }
      }
    }
  }

  /**
   * スロット初期化
   */
  private initSlot() {
    if (
      this.slotReels[0].getIsStop() &&
      this.slotReels[1].getIsStop() &&
      this.slotReels[2].getIsStop()
    ) {
      this.time.delayedCall(500, () => {
        if (!this.isReplay) {
          for (let i = 0; i < MAX_SLOT_BET; i++) {
            this.betLamps[i].setInit()
          }
          this.betCount = 0
          this.betValue = 0
          this.isBet = false
          this.addCoinNum = 0
          this.betNumText.setText('Bet: ' + this.betCount)
        }

        this.slotStartButton.activeButton()
        this.isStartReel = false

        //ダブルアップのカウント減算
        if (this.doubleUpCount > 0) {
          this.doubleUpCount = this.doubleUpCount - 1
          if (this.doubleUpCount < 0) {
            this.doubleUpCount = 0
          }
        }

        //ベットプラスカウント減算
        if (this.betPlusCount > 0) {
          this.betPlusCount = this.betPlusCount - 1
          if (this.betPlusCount < 0) {
            this.betPlusCount = 0
          }
        }

        this.doubleUpNumText.setText('× ' + this.doubleUpCount)
        this.betPlusNumText.setText('× ' + this.betPlusCount)
      })
    }
  }
}
