'use strict'

const userStore = require('../store')
const api = require('./api')
const logic = require('./logic')
const gameStore = require('./game-store')
const online = require('./online')
// const config = require('../config')
const watcher = require('../watcher')

const onSignUpSuccess = function () {
  $('#alert-div').html('<p>You have successfully registered!<p>')
  $('#alert-div').removeClass('hidden')
  $('#alert-div').addClass('alert-success')
  $('#alert-div').removeClass('alert-danger')
}

const onSignUpFailure = function () {
  $('#alert-div').html('<p>Something went wrong. Either you have already registered or your passwords don\'t match!</p>')
  $('#alert-div').removeClass('hidden')
  $('#alert-div').addClass('alert-danger')
  $('#alert-div').removeClass('alert-success')
}

const onSignInSuccess = function (data) {
  userStore.userSession = data
  $('.login-view').addClass('hidden')
  $('.game-view').removeClass('hidden')
  $('.jumbotron-text').text('Welcome ' + userStore.userSession.user.email + '!')
  const token = userStore.userSession.user.token

  // Create New Game, Send to API
  api.createGame(token)
    .then(createGameSuccess)
    .catch(createGameFailure)

  // Get Games From API

  api.getGames(token)
    .then(getGamesSuccess)
    .catch(getGamesFailure)

  // Set up Game Join Watcher

  // const gameJoinWatcher = watcher.resourceWatcher(config.apiOrigin + '/games/' + userStore.gameId + 'watch', {
  //   Authorization: 'Token token=' + token
  // })
  //
  // gameJoinWatcher.on('change', function (data) {
  //   console.log(data)
  //   $('.jumbotron-text').text(data.user + ' has joined your game!')
  // })

  // Update Turn Indicator
  $('.now-up').html('X')
}

const onSignInFailure = function () {
  $('#alert-div').html('<p>Something went wrong. Either you haven\'t registered or your password is incorrect.')
  $('#alert-div').removeClass('hidden')
  $('#alert-div').addClass('alert-danger')
  $('#alert-div').removeClass('alert-success')
}

const onLogoutSuccess = function () {
  $('#alert-div').html('<p>Logged Out Successfully!</p>')
  $('#alert-div').removeClass('hidden')
  $('#alert-div').addClass('alert-success')
  $('#alert-div').removeClass('alert-danger')
  $('#reset-btn').addClass('hidden')
}

const onLogoutFailure = function () {
  $('.jumbotron-text').text('Unable to log out. Please try again.')
}

const onChangePassSuccess = function () {
  $('.jumbotron-text').text('Password successfully changed.')
}

const onChangePassFailure = function () {
  $('.jumbotron-text').text('Something went wrong. Please try again.')
}

const createGameSuccess = function (data) {
  userStore.gameId = data.game.id
  gameStore.isOnlineGame = false
  $('.game-id').text('Game ID is ' + userStore.gameId)
}

const createGameFailure = function () {
  $('.jumbotron-text').text('Unable to register game with server.')
}

const getGamesSuccess = function (data) {
  userStore.gameHistory = data
  const gameHistory = userStore.gameHistory.games
  const winningBoards = []
  for (let i = 0; i < gameHistory.length; i++) {
    winningBoards.push(gameHistory[i].cells)
  }
  let xWins = 0
  let oWins = 0
  let ties = 0

  // const test = winningBoards.map(function (value, index) {
  //   return logic.isWinOrTie(value)
  // })
  // console.log(test)

  winningBoards.forEach(function (value, index) {
    const boardString = winningBoards[index].toString().replace(/,/g, '')
    const countX = (boardString.match(/x/g) || []).length
    const countO = (boardString.match(/o/g) || []).length
    if (boardString.length === 9) {
      const isWinner = logic.isWinOrTie(winningBoards[index]) // Check if complete board is tie or win
      isWinner ? xWins++ : ties++
    } else if (countX > countO) {
      xWins++
    } else if (countX === countO) {
      oWins++
    }
  })

  // Update Scoreboard
  $('#x-wins').html(xWins)
  $('#x-losses').html(oWins)
  $('#x-ties').html(ties)
  $('#o-wins').html(oWins)
  $('#o-losses').html(xWins)
  $('#o-ties').html(ties)

  gameStore.winningNumbers = [] // Reset winning numbers array so checkForWinner works
}

const getGamesFailure = function () {
  $('.jumbotron-text').text('Unable to retrieve game data.')
}

const updateGameSuccess = function (data) {
}

const updateGameFailure = function () {
  $('.jumbotron-text').text('Unable to register move with server.')
}

const onJoinGameSuccess = function (data) {
  $('.jumbotron-text').text('Successfully joined game!')
  $('#online-play-btn').addClass('hidden')
  const newGame = data
  console.log(newGame)
  const newGameId = newGame.game.id
  const token = userStore.userSession.user.token
  $('.game-id').text('Online Game ID: ' + newGameId)
  gameStore.isOnlineGame = true
  userStore.onlineGameId = newGameId
  userStore.onlineMove = 'x'
  setTimeout(function () {
    $('.jumbotron-text').text('Your Turn!')
    $('.now-up').text('X')
  }, 2000)

  // Set up Watcher
  watcher.setGameWatcher(newGameId, token)

  $('.board-square').on('click', function () {
    const index = this.id
    if ($('.jumbotron-text').text() === 'Your Turn!') {
      online.playMove(index, userStore.onlineMove)
    }
  })
}

const onJoinGameFailure = function () {
  $('.jumbotron-text').text('Unable to join game.')
}

module.exports = {
  onSignUpSuccess,
  onSignUpFailure,
  onSignInSuccess,
  onSignInFailure,
  onLogoutSuccess,
  onLogoutFailure,
  onChangePassSuccess,
  onChangePassFailure,
  updateGameSuccess,
  updateGameFailure,
  createGameSuccess,
  createGameFailure,
  onJoinGameSuccess,
  onJoinGameFailure
}
