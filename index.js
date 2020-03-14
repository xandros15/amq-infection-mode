// ==UserScript==
// @name         AMQ Infected Mode
// @namespace    amq-infected-mode
// @version      1
// @description  script allow to play in custom mode in anime music quiz
// @author       xandros and Supersj1997
// @match        https://animemusicquiz.com/*
// @grant        none
// ==/UserScript==

(function () {
  'use strict'
  //checkup if game is init
  if (!GameChat instanceof Object) {
    return
  }

  //commands
  const COMMAND_ROLL = 'roll'

  //override
  GameChat.prototype.sendMessage = function () {
    let msg = this.$chatInputField.val().trim()
    if (msg.length > 0) {
      if (this.slowModeActive && this.lastMessageCooldown >= (new Date()).getTime()) {
        this.displaySlowModeMessage('Chat in slowmode')
      } else if (this.slowModeActive && this.messageRepeated(msg)) {
        this.displaySlowModeMessage('Repeated message too soon')
      } else if (this.slowModeActive && xpBar.level < this.MINIMUM_LEVEL_TO_CHAT_IN_SLOW_MODE) {
        this.displaySlowModeMessage('Level 15 required to use ranked chat')
      } else {
        if (msg.substr(0, 1) === '/') {
          const cmd = msg.substr(1)
          switch (cmd) {
            case COMMAND_ROLL:
              break
            default:
          }
        }
        socket.sendCommand({
          type: 'lobby',
          command: 'game chat message',
          data: {
            msg: msg
          }
        })
        this.$chatInputField.val('')
        this.lastChatCursorPosition = 0

        if (this.slowModeActive) {
          let now = (new Date()).getTime()
          this.$cooldownBar.addClass('active')
          this.lastMessageCooldown = now + this.CHAT_COOLDOWN_LENGTH
          setTimeout(() => {
            this.$cooldownBar.removeClass('active')
            this.$cooldownBarContainer.popover('hide')
          }, this.CHAT_COOLDOWN_LENGTH)

          this.lastMessageInfo = {
            msg,
            cooldownUntil: now + this.SPAM_COOLDOWN
          }
        }
      }
    }
  }
})()
