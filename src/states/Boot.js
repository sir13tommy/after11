/* globals __DEV__ */
import Phaser from 'phaser'
import WebFont from 'webfontloader'
import config from '../config';
import Debug from 'phaser-debug/dist/phaser-debug'

export default class extends Phaser.State {
  init() {
    this.stage.backgroundColor = '#242424'
    this.fontsReady = false
    this.fontsLoaded = this.fontsLoaded.bind(this)
    if (__DEV__) {
      this.game.add.plugin(Debug)
    }
  }

  preload() {
    if (config.webfonts.length) {
      WebFont.load({
        custom: { 
          families: config.webfonts
        },
        active: this.fontsLoaded
      })
    }

    let text = this.add.text(this.world.centerX, this.world.centerY, 'loading fonts', { font: '16px Arial', fill: '#dddddd', align: 'center' })
    text.anchor.setTo(0.5, 0.5)

    this.load.image('loaderBg', require('../../assets/images/loader-bg.png'))
    this.load.image('loaderBar', require('../../assets/images/loader-bar.png'))
  }

  render() {
    if (config.webfonts.length && this.fontsReady) {
      this.state.start('Splash')
    }
    if (!config.webfonts.length) {
      this.state.start('Splash')
    }
  }

  fontsLoaded() {
    this.fontsReady = true
  }
}
