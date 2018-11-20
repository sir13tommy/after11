/* globals __DEV__ */
import Phaser from 'phaser'
import Mushroom from '../sprites/Mushroom'
import lang from '../lang'

export default class extends Phaser.State {
  init () { }
  preload () { }

  create (game) {
    // header
    this.header = game.make.group(game.stage, 'header')

    this.headerBg = game.make.graphics(0, 0)
    this.headerBg.beginFill(0x3c3c3c)
    this.headerBg.drawRect(0, 0, game.width, 48)
    this.header.add(this.headerBg)

    let closeBtnFrame = 'close@2x.png'
    this.closeBtn = game.make.button(null, null, 'assets', () => {}, null, closeBtnFrame, closeBtnFrame, closeBtnFrame)
    this.header.add(this.closeBtn)
    this.closeBtn.alignIn(this.headerBg, Phaser.RIGHT_CENTER, -10, 0)

    this.backBtn = game.make.image(null, null, 'assets', 'arrow-left-small@2x.png')
    this.header.add(this.backBtn)
    this.backBtn.alignIn(this.headerBg, Phaser.LEFT_CENTER, -10, 0)
  }

  render() {
    if (__DEV__) {
      // dev logs
    }
  }
}
