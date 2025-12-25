import { Scene } from 'phaser'
import { SceneKey, SceneKeyIndex } from '../const/SceneKey'
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

    this.load.image(TextureKey.DefaultBg, '/defaultBg.png')

    //スロット関連画像
    this.load.image(TextureKey.HeightCheck, '/heightCheck.png')
    this.load.image(TextureKey.SlotBG, 'image/slot/slot_bg.png')
    this.load.image(TextureKey.SlotMachineOver, 'image/slot/slot_machine_over-02.png')
    this.load.image(TextureKey.SlotMachineUnder, 'image/slot/slot_machine_under-01.png')
    this.load.image(TextureKey.SlotTitle, 'image/slot/slot_title_0.png')
    this.load.image(TextureKey.SlotStartA, 'image/slot/button/slot_start_a.png')
    this.load.image(TextureKey.SlotStartB, 'image/slot/button/slot_start_b.png')
    this.load.image(TextureKey.SlotBetA, 'image/slot/button/bet_button_a.png')
    this.load.image(TextureKey.SlotBetB, 'image/slot/button/bet_button_b.png')
    this.load.image(TextureKey.SlotBetLumpA, 'image/slot/button/bet_lump_a2.png')
    this.load.image(TextureKey.SlotBetLumpB, 'image/slot/button/bet_lump_b2.png')
    this.load.image(TextureKey.SlotButtonA, 'image/slot/button/slot_button_a.png')
    this.load.image(TextureKey.SlotButtonB, 'image/slot/button/slot_button_b.png')
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
    this.load.image(TextureKey.SlotReplay, 'image/slot/number/replay.png')
    this.load.image(TextureKey.DoubleUp, 'image/slot/number/double_up.png')
    this.load.image(TextureKey.DoubleUpIconA, 'image/slot/button/double_up_icon_a.png')
    this.load.image(TextureKey.BetPlus, 'image/slot/number/bet_plus.png')
    this.load.image(TextureKey.BetPlusIcon, 'image/slot/button/bet_plus_icon.png')
    this.load.image(TextureKey.SlotStarA, 'image/slot/button/star_a.png')
    this.load.image(TextureKey.SlotStarB, 'image/slot/button/star_b.png')
    this.load.image(TextureKey.SlotStarC, 'image/slot/button/star_c.png')

    //年賀状2025関連画像
    this.load.image(TextureKey.NengaBase, 'image/nenga2025/base.png')
    this.load.image(TextureKey.NengaSnake, 'image/nenga2025/animal/snake.png')
    this.load.image(TextureKey.NengaHose, 'image/nenga2025/animal/hose.png')
    this.load.image(TextureKey.NengaSheep, 'image/nenga2025/animal/sheep.png')
    this.load.image(TextureKey.NengaMonkey, 'image/nenga2025/animal/monkey.png')
    this.load.image(TextureKey.NengaChicken, 'image/nenga2025/animal/chicken.png')
    this.load.image(TextureKey.NengaSilver, 'image/nenga2025/silver.png')
    this.load.image(TextureKey.NengaRetry, 'image/nenga2025/retry_.png')
    this.load.image(TextureKey.NengaAtari_1, 'image/nenga2025/atari/atari_sho_0.png')
    this.load.image(TextureKey.NengaAtari_2, 'image/nenga2025/atari/atari_chu_0.png')
    this.load.image(TextureKey.NengaAtari_3, 'image/nenga2025/atari/atari_dai_0.png')
    this.load.image(TextureKey.NengaHazure, 'image/nenga2025/hazure.png')

    //ピンポイントシューター関連画像
    this.load.image(TextureKey.AngleMater, 'image/pinpointShooter/angle_mater.png')
    this.load.image(TextureKey.AngleMaterArrow, 'image/pinpointShooter/angle_mater_arrow.png')
    this.load.image(TextureKey.PowerBar, 'image/pinpointShooter/power_bar.png')
    this.load.image(TextureKey.PowerLevel, 'image/pinpointShooter/power_level.png')
    this.load.image(TextureKey.Scope, 'image/pinpointShooter/scope.png')
    this.load.image(TextureKey.ScopeArrowOff, 'image/pinpointShooter/modern_arrow_off.png')
    this.load.image(TextureKey.ScopeArrowOn, 'image/pinpointShooter/modern_arrow_on.png')
    this.load.image(TextureKey.PinpointShooterBg, 'image/pinpointShooter/pinpoint_shooter_bg.png')
    this.load.image(TextureKey.ParabolaGraphBg, 'image/pinpointShooter/parabola_graph_bg.png')
    this.load.image(TextureKey.HitArea, 'image/pinpointShooter/hit_area.png')
    this.load.image(TextureKey.HitAreaHut, 'image/pinpointShooter/hit_area_hut.png')
    this.load.image(TextureKey.HitSample, 'image/pinpointShooter/hit_sample.png')
    this.load.image(TextureKey.HitSamplePedestal, 'image/pinpointShooter/hit_sample_pedestal.png')
    this.load.image(TextureKey.HitObject, 'image/pinpointShooter/hit_object.png')
    this.load.image(TextureKey.ShootOn, 'image/pinpointShooter/shoot_on.png')
    this.load.image(TextureKey.ShootOff, 'image/pinpointShooter/shoot_off.png')
    this.load.image(TextureKey.WindDirection, 'image/pinpointShooter/wind_direction.png')
    this.load.image(TextureKey.NewYear2026Sho, 'image/pinpointShooter/atari_sho_0.png')
    this.load.image(TextureKey.NewYear2026Chu, 'image/pinpointShooter/atari_chu_0.png')
    this.load.image(TextureKey.NewYear2026Dai, 'image/pinpointShooter/atari_dai_0.png')
  }

  create() {
    //  When all the assets have loaded, it's often worth creating global objects here that the rest of the game can use.
    //  For example, you can define global animations here, so we can use them in other scenes.

    //  Move to the MainMenu. You could also swap this for a Scene Transition, such as a camera fade.
    this.scene.start(SceneKey[SceneKeyIndex.PinpointShooterScene].scene_name)
  }
}
