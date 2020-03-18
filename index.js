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
  if (typeof GameChat !== 'function') {
    return
  }
  if (typeof Listener !== 'function') {
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
          infect()
          break
        default:
      }
    }
  })
  let lastInfectedPlayer = ''
  let infectedPlayerId = null
  let players = []

  function infect () {
    const $players = document.querySelectorAll('.lobbyAvatarNameContainer')
    let playerNames = []
    for (const $player of $players) {
      const name = $player.innerText.trim()
      playerNames.push(name)
    }
    const playersThatCanBeInfected = playerNames.filter(name => lastInfectedPlayer !== name)
    const random = Math.floor(Math.random() * playersThatCanBeInfected.length)
    lastInfectedPlayer = playersThatCanBeInfected[random]
    gameChat.$chatInputField.val('The infected is: @' + lastInfectedPlayer)
    gameChat.sendMessage()
  }

  function sendMessage (message) {
    gameChat.$chatInputField.val(message)
    gameChat.sendMessage()
  }

  function setPlayers (newPlayers) {
    players = []
    infectedPlayerId = null
    for (const player of newPlayers) {
      if (player._name === lastInfectedPlayer) {
        player.isInfected = true
        infectedPlayerId = player.gamePlayerId
      }
      players.push(player)
    }
  }

  function updateInfection (data) {
    const doesInfectedCorrect = data.players.some(player => player.correct && player.gamePlayerId === infectedPlayerId)

    for (const playerData of data.players) {
      for (const player of players) {
        if (player.gamePlayerId === playerData.gamePlayerId) {
          if (doesInfectedCorrect && playerData.correct && !player.isInfected) {
            player.score = 0
            player.isInfected = true
            sendMessage(`@${player._name} is infected now`)
          } else {
            player.score = playerData.score
          }
        }
      }
    }

    const isSomeoneAlive = players.some(player => !player.isInfected)
    if (!isSomeoneAlive) {
      sendMessage(`@${lastInfectedPlayer} wins because everyone is infected`)
    }
  }

  function cleanUp () {
    const alivePlayers = players.filter(player => !player.isInfected)
    alivePlayers.sort((a, b) => b.score - a.score)
    const topPlayers = players.filter(player => player.score === players[0].score)
    for (const player of topPlayers) {
      sendMessage(`@${player._name} wins`)
    }
  }

  const list1 = new Listener('quiz ready', () => setPlayers(Object.values(quiz.players)))
  const list2 = new Listener('answer results', data => updateInfection(data))
  const list3 = new Listener('quiz over', () => cleanUp())
  list1.bindListener()
  list2.bindListener()
  list3.bindListener()
})()
