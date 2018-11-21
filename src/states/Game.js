/* globals __DEV__ */
import Phaser from 'phaser'
import Mushroom from '../sprites/Mushroom'
import lang from '../lang'
import { finished } from 'stream';

const startMessages = [
  {author: 'Lisa', text: 'mommy my tummy hurts'},
  {author: 'Lisa', text: 'you coming soon?'},
  {author: 'Lisa', text: 'can’t feel my legs'},
  
  {author: 'Mommy', text: 'oh my God Lisa..'}
]

const messages = [
  { author: 'Mommy', text: 'I’m leaving the office right now'},
  { author: 'Mommy', text: 'I want you to lie down'},
  { author: 'Mommy', text: 'roll yourself in a blanket and wait for me, okay Lisa?'},
  { author: 'Mommy', text: 'mommy’s gonna be there soon'},
  
  {author: 'Lisa', text: 'okay'},
  {author: 'Lisa', text: 'no worries mommy'},
  {author: 'Lisa', text: 'Tommy is here'},
  {author: 'Lisa', text: 'he says I’ll be alright'},

  {author: 'Lisa', text: 'WHO SAYS?'},
  {author: 'Lisa', text: 'WHO\'S TOMMY LISA??'},
  {author: 'Lisa', text: 'LISA DID YOU INVITE SOMEONE IN OUR HOUSE??'},
  {author: 'Lisa', text: 'ANSWER ME'},
]

export default class extends Phaser.State {
  init () {
    game.stage.disableVisibilityChange = true
  }
  preload () { }

  create (game) {
    // header
    let messenger = game.add.group(game.world, 'messenger')
    this.messenger = messenger

    let header = game.make.group(game.stage, 'header')

    let headerBg = game.make.graphics(0, 0)
    headerBg.beginFill(0x3c3c3c)
    headerBg.drawRect(0, 0, game.width, 48)
    header.add(headerBg)

    let closeBtnFrame = 'close@2x.png'
    let closeBtn = game.make.button(null, null, 'assets', () => {}, null, closeBtnFrame, closeBtnFrame, closeBtnFrame)
    closeBtn.scale.set(0.5)
    header.add(closeBtn)
    closeBtn.alignIn(headerBg, Phaser.RIGHT_CENTER, -16, 0)

    let backBtn = game.make.image(null, null, 'assets', 'arrow-left-small@2x.png')
    backBtn.scale.set(0.5)
    header.add(backBtn)
    backBtn.alignIn(headerBg, Phaser.LEFT_CENTER, -16, 0)

    let rectBlock = game.make.graphics(0, 0)
    rectBlock.beginFill(0x000000)
    rectBlock.drawRect(0, 0, game.width, 366)
    
    let stepBtn = game.make.button(0, 0, rectBlock.generateTexture(), step, this)
    stepBtn.alpha = 0
    game.stage.add(stepBtn)
    stepBtn.alignIn(game.camera.view, Phaser.BOTTOM_CENTER, 0, 0)

    let actionBtnContent = game.make.text(0, 0, 'Tap to continue reading'.toUpperCase(), {
      font: 'normal 14px sf_pro_textregular',
      fill: '#ffffff'
    })
    game.stage.add(actionBtnContent)
    actionBtnContent.alignIn(stepBtn, Phaser.CENTER, 0, 0)
    game.add.tween(actionBtnContent)
      .to({alpha: 0.5})
      .repeat(-1)
      .yoyo(true)
      .start()

    let hand = game.make.image(0, 0, 'assets', 'hand.png')
    hand.anchor.set(0.5)
    game.stage.add(hand)
    hand.alignTo(actionBtnContent, Phaser.BOTTOM_CENTER, 0, 0)
    let targetScaleFactor = 0.7
    game.make.tween(hand.scale)
      .to({x: targetScaleFactor, y: targetScaleFactor})
      .repeat(-1)
      .yoyo(true)
      .start()

    let gameMessages = []

    // write message on screen
    function write(message) {
      const viewPaddings = {
        top: 0,
        right: 48,
        bottom: 0,
        left: 48
      }
      const textPaddings = {
        top: 12,
        right: 12,
        left: 12,
        bottom: 12
      }

      let color, avatarFrame, align
      switch (message.author) {
        case 'Lisa':
          color = 0x3c3c3c
          avatarFrame = 'lisa@2x.png'
          align = 'right'
          break
        case 'Mommy':
          color = 0xd032ff
          avatarFrame = 'mommy@2x.png'
          align = 'left'
          break
        default: 
          color = 0x3c3c3c
          avatarFrame = 'lisa@2x.png'
          align = 'right'
          break
      }

      // draw text
      let maxTextWidth = game.width - viewPaddings.right - viewPaddings.left - 107
      if (maxTextWidth < 256) {
        maxTextWidth = game.width - viewPaddings.right - viewPaddings.left
      }

      let content = game.make.text(null, null, message.text, {
        font: 'normal 16px sf_pro_textregular',
        fill: '#ffffff',
        wordWrap: true,
        wordWrapWidth: maxTextWidth - textPaddings.left - textPaddings.right
      })

      // draw text holder
      let holder = game.make.graphics(0, 0)
      holder.beginFill(color)
      holder.drawRoundedRect(0, 0,
        content.width + textPaddings.left + textPaddings.right, // width
        content.height + textPaddings.top + textPaddings.bottom, // height
        3
      )
      messenger.add(holder)
      let holderX, holderY
      if (align === 'right') {
        holderX = game.width - viewPaddings.right - holder.width
      } else {
        holderX = viewPaddings.left
      }
      if (gameMessages.length) {
        holderY = gameMessages[gameMessages.length - 1].holder.bottom + 52
      } else {
        holderY = header.height + 48
      }
      holder.position.set(holderX, holderY)

      content.alignIn(holder, Phaser.TOP_LEFT, -textPaddings.left, -textPaddings.top)
      messenger.add(content)

      // draw avatar
      let avatar = game.make.image(0, 0, 'assets', avatarFrame)
      avatar.scale.set(0.5)
      if (align === 'right') {
        avatar.alignTo(holder, Phaser.RIGHT_BOTTOM, 8, 0)
      } else {
        avatar.alignTo(holder, Phaser.LEFT_BOTTOM, 8, 0)
      }
      messenger.add(avatar)

      gameMessages.push({
        holder,
        content,
        avatar
      })
    }
    this.write = write

    let showHint = true
    // start game function
    function startGame () {
      fadeOutCamera()
      startMessages.forEach(write)
      game.inputEnabled = true
    }

    let isFinish = false
    // finish game function
    function finishGame () {
      if (isFinish) {
        return
      }

      fadeOutCamera()

      let ctaBtnFrame = 'cta-button.png'
      let ctaBtn = game.make.button(0, 0, 'assets', ctaAction, this, ctaBtnFrame, ctaBtnFrame, ctaBtnFrame, ctaBtnFrame)
      game.stage.add(ctaBtn)
      ctaBtn.alignIn(game.camera.view, Phaser.CENTER, 0, 0)

      let ctaContent = game.make.text(0, 0, 'Continue reading', {
        font: 'normal 20px sf_pro_textregular',
        fill: '#ffffff'
      })
      game.stage.add(ctaContent)
      ctaContent.alignIn(ctaBtn, Phaser.CENTER, 0, 0)

      isFinish = true
    }

    // step game function
    let messageIdx = 0
    function step () {
      if (messages[messageIdx]) {
        write(messages[messageIdx])
        messageIdx++
      }
      if (messageIdx >= messages.length) {
        stepBtn.visible = false
        finishGame()
      }
      if (showHint) {
        fadeInCamera()
        hand.visible = false
        actionBtnContent.visible = false
        showHint = false
      }
    }

    function ctaAction () {
      console.log('cta-action')
    }

    function fadeOutCamera () {
      game.camera.fade(0x000000, Phaser.Timer.SECOND * 0.5, true, 0.6);
    }
    function fadeInCamera () {
      game.camera.fade(0x000000, Phaser.Timer.SECOND * 0.5, true, 0);
    }

    startGame()
  }

  update () {
    const viewPaddingBottom = 48
    if (this.messenger.bottom > game.height - viewPaddingBottom) {
      this.messenger.y-=5
    }
  }

  render() {
    if (__DEV__) {
      // dev logs
    }
  }
}
