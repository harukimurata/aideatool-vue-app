import { Scene } from 'phaser'
import TextureKey from '../const/TextureKey'

export class Preloader extends Scene {
  constructor() {
    super('Preloader')
  }

  init() {
    //  We loaded this image in our Boot Scene, so we can display it here
    this.add.image(512, 384, 'background')

    const gameWidth = this.scale.width
    const gameHeight = this.scale.height

    //  A simple progress bar. This is the outline of the bar.
    this.add.rectangle(gameWidth / 2, gameHeight / 2, 468, 32).setStrokeStyle(1, 0xffffff)

    //  This is the progress bar itself. It will increase in size from the left based on the % of progress.
    const bar = this.add.rectangle(gameWidth / 2 - 230, gameHeight / 2, 4, 28, 0xffffff)

    //  Use the 'progress' event emitted by the LoaderPlugin to update the loading bar
    this.load.on('progress', (progress: number) => {
      //  Update the progress bar (our bar is 464px wide, so 100% = 464px)
      bar.width = 4 + 460 * progress
    })
  }

  preload() {
    //  Load the assets for the game - Replace with your own assets
    this.load.setPath('assets')

    this.load.image('star', 'star.png')
    this.load.image(TextureKey.SlotMachineOver, 'image/slot/slot_machine_over.png')
    this.load.image(TextureKey.SlotMachineUnder, 'image/slot/slot_machine_under.png')
    this.load.image(TextureKey.SlotStartA, 'image/slot/button/slot_start_a.png')
    this.load.image(TextureKey.SlotStartB, 'image/slot/button/slot_start_b.png')
    this.load.image(TextureKey.SlotBetA, 'image/slot/button/bet_button_a.png')
    this.load.image(TextureKey.SlotBetB, 'image/slot/button/bet_button_b.png')
    this.load.image(TextureKey.SlotButtonA, 'image/slot/button/slot_button_a.png')
    this.load.image(TextureKey.SlotButtonB, 'image/slot/button/slot_button_b.png')
    this.load.image(TextureKey.SlotButtonC, 'image/slot/button/slot_button_c.png')
    this.load.image(TextureKey.SlotButtonD, 'image/slot/button/slot_button_d.png')
    this.load.image(TextureKey.SlotButtonE, 'image/slot/button/slot_button_e.png')
    this.load.image(TextureKey.SlotButtonF, 'image/slot/button/slot_button_f.png')
    this.load.image(TextureKey.SlotNumber0, 'image/slot/number/slot_number_0.png')
    this.load.image(TextureKey.SlotNumber1, 'image/slot/number/slot_number_1.png')
    this.load.image(TextureKey.SlotNumber2, 'image/slot/number/slot_number_2.png')
    this.load.image(TextureKey.SlotNumber3, 'image/slot/number/slot_number_3.png')
    this.load.image(TextureKey.SlotNumber4, 'image/slot/number/slot_number_4.png')
    this.load.image(TextureKey.SlotNumber5, 'image/slot/number/slot_number_5.png')
    this.load.image(TextureKey.SlotNumber6, 'image/slot/number/slot_number_6.png')
    this.load.image(TextureKey.SlotNumber7, 'image/slot/number/slot_number_7.png')
    this.load.image(TextureKey.SlotNumber8, 'image/slot/number/slot_number_8.png')
    this.load.image(TextureKey.SlotNumber9, 'image/slot/number/slot_number_9.png')
  }

  create() {
    //  When all the assets have loaded, it's often worth creating global objects here that the rest of the game can use.
    //  For example, you can define global animations here, so we can use them in other scenes.

    //  Move to the MainMenu. You could also swap this for a Scene Transition, such as a camera fade.
    this.scene.start('MainMenu')
  }
}
