import { GameObjects, Scene } from 'phaser'

import { EventBus } from '../EventBus'
import TextureKey from '../const/TextureKey'
import ImageButton from '../components/ImageButton'
import { fadeOut } from '../components/SceneFade'

export class MainMenu extends Scene {
  background!: GameObjects.Image
  logo!: GameObjects.Image
  title!: GameObjects.Text
  logoTween!: Phaser.Tweens.Tween | null

  private pushButton!: ImageButton
  private sceneButton!: ImageButton

  private clickNum = 0

  constructor() {
    super('MainMenu')
  }

  create() {
    const gameWidth = this.scale.width
    const gameHeight = this.scale.height
    this.background = this.add.image(512, 384, 'background')

    this.logo = this.add.image(gameWidth / 2, 300, 'logo').setDepth(100)

    this.title = this.add
      .text(gameWidth / 2, 500, 'Main Menu', {
        fontFamily: 'Arial Black',
        fontSize: 38,
        color: '#ffffff',
        stroke: '#000000',
        strokeThickness: 8,
        align: 'center'
      })
      .setOrigin(0.5)
      .setDepth(100)

    this.pushButton = new ImageButton(
      this,
      gameWidth / 2,
      400,
      TextureKey.PushButton,
      TextureKey.PushHoverButton,
      () => {
        this.clickNum++
        this.title.setText('Main Menu' + this.clickNum)
        console.log('button Click')
      },
      () => {
        console.log('button Hover')
      }
    )
    this.add.existing(this.pushButton)

    this.sceneButton = new ImageButton(
      this,
      gameWidth / 2,
      550,
      TextureKey.PushButton,
      TextureKey.PushHoverButton,
      () => {
        fadeOut(this, null, () => {
          this.scene.start('Game')
        })
      }
    )
    this.add.existing(this.sceneButton)

    EventBus.emit('current-scene-ready', this)
  }

  changeScene() {
    if (this.logoTween) {
      this.logoTween.stop()
      this.logoTween = null
    }

    this.scene.start('Game')
  }

  moveLogo(vueCallback: ({ x, y }: { x: number; y: number }) => void) {
    if (this.logoTween) {
      if (this.logoTween.isPlaying()) {
        this.logoTween.pause()
      } else {
        this.logoTween.play()
      }
    } else {
      this.logoTween = this.tweens.add({
        targets: this.logo,
        x: { value: 750, duration: 3000, ease: 'Back.easeInOut' },
        y: { value: 80, duration: 1500, ease: 'Sine.easeOut' },
        yoyo: true,
        repeat: -1,
        onUpdate: () => {
          if (vueCallback) {
            vueCallback({
              x: Math.floor(this.logo.x),
              y: Math.floor(this.logo.y)
            })
          }
        }
      })
    }
  }
}
