import Phaser from 'phaser'
import { centerGameObjects } from '../utils'

export default class extends Phaser.State {
  init () {}

  preload () {
    this.loaderBg = this.add.sprite(this.game.world.centerX, this.game.world.centerY, 'loaderBg')
    this.loaderBar = this.add.sprite(this.game.world.centerX, this.game.world.centerY, 'loaderBar')
    centerGameObjects([this.loaderBg, this.loaderBar])

    this.load.setPreloadSprite(this.loaderBar)
    //
    // load your assets
    //
    this.load.atlas('assets', require('../../assets/images/sprite.png'), null, require('../../assets/images/sprite.json'))
    this.load.audio('after11pm', require('../../assets/sounds/.dist/after11pm.mp3'))
  }

  create () {
    this.state.start('Game')
  }
}
