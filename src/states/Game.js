/* globals __DEV__, FbPlayableAd */
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

  {author: 'Mommy', text: 'WHO SAYS?'},
  {author: 'Mommy', text: 'WHO\'S TOMMY LISA??'},
  {author: 'Mommy', text: 'LISA DID YOU INVITE SOMEONE IN OUR HOUSE??'},
  {author: 'Mommy', text: 'ANSWER ME'}
]

export default class extends Phaser.State {
  init () {
    game.stage.disableVisibilityChange = true
  }
  preload () { }

  create (game) {
    const viewPaddings = {
      top: 0,
      right: 48,
      bottom: 0,
      left: 48
    }

    let mainFx = game.add.audio('after11pm')
    // header
    let messenger = game.add.group(game.world, 'messenger')
    this.messenger = messenger

    let header = game.make.group(game.stage, 'header')

    let headerBg = game.make.graphics(0, 0)
    headerBg.beginFill(0x3c3c3c)
    headerBg.drawRect(0, 0, game.width, 48)
    header.add(headerBg)

    let backBtn = game.make.image(null, null, 'assets', 'arrow-left-small@2x.png')
    backBtn.scale.set(0.5)
    header.add(backBtn)
    backBtn.alignIn(headerBg, Phaser.LEFT_CENTER, -16, 0)

    let interlocutor = game.make.group(game.stage, 'interlocutor')

    let interlocutorAvatar = game.make.image(0, 0, 'assets', 'mommy@2x.png')
    interlocutorAvatar.scale.set(0.5)
    interlocutor.add(interlocutorAvatar)

    let interlocutorName = game.make.text(0, 0, 'Mommy', {
      font: 'normal 16px sf_pro_textregular',
      fill: '#ffffff'
    })
    interlocutor.add(interlocutorName)
    interlocutorName.alignTo(interlocutorAvatar, Phaser.RIGHT_CENTER, 8, 3)

    interlocutor.alignIn(header, Phaser.CENTER, 0, 0)

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
    this.hand = hand
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
      let gameMessage = {}

      let lastMessage = gameMessages[gameMessages.length - 1]
      let pinToLastMessage = false
      if (lastMessage && lastMessage.author === message.author) {
        pinToLastMessage = true
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

      let content = game.make.text(null, null, message.isTyping ? '.' : message.text, {
        font: 'normal 16px sf_pro_textregular',
        fill: '#ffffff',
        wordWrap: true,
        wordWrapWidth: maxTextWidth - textPaddings.left - textPaddings.right
      })
      gameMessage.content = content

      if (message.isTyping) {
        let timer = game.time.create()
        timer.loop(Phaser.Timer.HALF, () => {
          if (content.text.length >= 3) {
            content.text = ''
          } else {
            content.text += '.'
          }
        }, this)
        timer.start()
      }

      // draw text holder
      let minHolderWidth = 98
      let holderWidth = content.width + textPaddings.left + textPaddings.right
      if (holderWidth < minHolderWidth) {
        holderWidth = minHolderWidth
      }
      let holder = game.make.graphics(0, 0)
      holder.beginFill(color)
      holder.drawRoundedRect(0, 0,
        holderWidth, // width
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
        let topMargin = 52
        if (pinToLastMessage) {
          topMargin = 16
        }
        holderY = gameMessages[gameMessages.length - 1].holder.bottom + topMargin
      } else {
        holderY = header.height + 48
      }
      holder.position.set(holderX, holderY)
      gameMessage.holder = holder

      // draw author
      if (!pinToLastMessage) {
        let author = game.make.text(null, null, message.author, {
          font: 'normal 12px sf_pro_textregular',
          fill: "#ffffff"
        })
        author.alpha = 0.6
        messenger.add(author)
        if (align === 'right') {
          author.alignTo(holder, Phaser.TOP_RIGHT, 0, 8)
        } else {
          author.alignTo(holder, Phaser.TOP_LEFT, 0, 8)
        }
        gameMessage.author = message.author
      } else {
        gameMessage.author = lastMessage.author
      }

      content.alignIn(holder, Phaser.TOP_LEFT, -textPaddings.left, -textPaddings.top)
      messenger.add(content)

      if (!pinToLastMessage) {
        // draw avatar
        let avatar = game.make.image(0, 0, 'assets', avatarFrame)
        avatar.scale.set(0.5)
        if (align === 'right') {
          avatar.alignTo(holder, Phaser.RIGHT_BOTTOM, 8, 0)
        } else {
          avatar.alignTo(holder, Phaser.LEFT_BOTTOM, 8, 0)
        }
        messenger.add(avatar)
        gameMessage.avatar = avatar
      } else {
        gameMessage.avatar = lastMessage.avatar
      }

      gameMessages.push(gameMessage)
    }
    this.write = write

    let showHint = true
    // start game function
    function startGame () {
      fadeOutCamera()
      startMessages.forEach(write)
      mainFx.onDecoded.addOnce(() => {
        mainFx.play('', 0, 1, true)
      })
      game.inputEnabled = true
    }

    let isFinish = false
    // finish game function
    function finishGame () {
      if (isFinish) {
        return
      }

      fadeOutCamera(0.85)

      let ctaBtnFrame = 'cta-button.png'
      let ctaBtn = game.make.button(0, 0, 'assets', ctaAction, this, ctaBtnFrame, ctaBtnFrame, ctaBtnFrame, ctaBtnFrame)
      ctaBtn.anchor.set(0.5)
      game.stage.add(ctaBtn)
      ctaBtn.alignIn(game.camera.view, Phaser.CENTER, 0, 60)

      let ctaContent = game.make.text(0, 3, 'Continue reading', {
        font: 'normal 25px sf_pro_textregular',
        fill: '#ffffff'
      })
      ctaContent.anchor.set(0.5)
      ctaBtn.addChild(ctaContent)

      // text: Want to know what happened next?
      // Alt text: Figure out what heppened next
      let text = game.make.text(0, 0, 'Figure out what heppened next', {
        font: 'normal 30px sf_pro_textregular',
        fill: '#ffffff',
        align: 'center',
        wordWrap: true,
        wordWrapWidth: game.width - viewPaddings.left - viewPaddings.right
      })
      text.alignTo(ctaBtn, Phaser.TOP_CENTER, 0, 0)
      game.stage.add(text)

      game.add.tween(text)
        .to({alpha: 0.5})
        .repeat(-1)
        .yoyo(true)
        .start()

      let pulseBtn = game.add.tween(ctaBtn.scale)
        .to({x: 0.8, y: 0.8})
        .repeat(-1)
        .yoyo(true)

      game.add.tween(ctaBtn.scale)
        .from({x: 0, y: 0})
        .easing(Phaser.Easing.Bounce.Out)
        .chain(pulseBtn)
        .start()

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
        setTimeout(() => {
          write({author: 'Lisa', text: '', isTyping: true})
        }, Phaser.Timer.SECOND)
        setTimeout(finishGame, Phaser.Timer.SECOND * 3)
      }
      if (showHint) {
        fadeInCamera()
        hand.visible = false
        actionBtnContent.visible = false
        showHint = false
      }
    }

    function ctaAction () {
      if (typeof FbPlayableAd !== 'undefined' && FbPlayableAd.onCTAClick) {
        FbPlayableAd.onCTAClick()
      } else {
        console.log('CTA click')
      }
    }

    function fadeOutCamera (opacity) {
      if (typeof opacity !== 'undefined') {
        opacity = opacity
      } else {
        opacity = 0.6
      }
      game.camera.fade(0x000000, Phaser.Timer.SECOND * 0.5, true, opacity);
    }
    function fadeInCamera () {
      game.camera.fade(0x000000, Phaser.Timer.SECOND * 0.5, true, 0);
    }

    startGame()
  }

  update () {
    const viewPaddingBottom = 48
    if (this.messenger.bottom > game.height - viewPaddingBottom) {
      this.messenger.bottom = game.height - viewPaddingBottom
    }
  }

  render() {
    if (__DEV__) {
      // dev logs
    }
  }
}
