import { Boot } from './scenes/Boot'
import { SlotScene } from './scenes/SlotScene'
import { ScratchScene } from './scenes/ScratchScene'
import { PinpointShooterScene } from './scenes/PinpointShooterScene'
import { Game } from 'phaser'
import { Preloader } from './scenes/Preloader'

//  Find out more information about the Game Config at:
//  https://newdocs.phaser.io/docs/3.70.0/Phaser.Types.Core.GameConfig
const config: Phaser.Types.Core.GameConfig = {
  width: 600,
  input: {
    touch: true
  },
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.NONE,
    autoRound: true
  },
  parent: 'game-container',
  backgroundColor: '#028af8',
  scene: [Boot, Preloader, SlotScene, ScratchScene, PinpointShooterScene]
}

const StartGame = (parent: string) => {
  return new Game({ ...config, parent })
}

export default StartGame
