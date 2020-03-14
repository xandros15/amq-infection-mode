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
  const $gameChatInput = document.querySelector('#gcInput')

  //checkup if game chat input exist
  if (!$gameChatInput) {
    return
  }

  //commands
  const COMMAND_ROLL = 'infect'

  $gameChatInput.addEventListener('keydown', ({key}) => {
    if (key !== 'Enter') {
      return
    }
    const msg = $gameChatInput.value.trim()
    if (msg.substr(0, 1) === '/') {
      const cmd = msg.substr(1)
      switch (cmd) {
        case COMMAND_ROLL:
          infect();
          break
        default:
      }
    }
  })
  function infect() {
    var players = document.querySelectorAll('.lobbyAvatarNameContainer');
    var random = Math.floor(Math.random() * players.length);
    gameChat.$chatInputField.val("The infected is: @" + players[random].innerText.trim());
    gameChat.sendMessage();
}
})()

