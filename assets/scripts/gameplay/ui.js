'use strict'

const userStore = require('../store')
const api = require('./api')
const logic = require('./logic')
const gameStore = require('./game-store')

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
}

const onLogoutFailure = function () {
  console.log('uh oh.')
}

const onChangePassSuccess = function () {
  $('.jumbotron-text').text('Password successfully changed.')
}

const onChangePassFailure = function () {
  $('.jumbotron-text').text('Something went wrong. Please try again.')
}

const createGameSuccess = function (data) {
  console.log('game created!')
  userStore.gameId = data.game.id
}

const createGameFailure = function () {
  console.log('failed')
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

  for (let i = 0; i < winningBoards.length; i++) {
    const boardString = winningBoards[i].toString().replace(/,/g, '')
    const countX = (boardString.match(/x/g) || []).length
    const countO = (boardString.match(/o/g) || []).length
    if (boardString.length === 9) { // Check if complete board is tie or win
      const isWinner = logic.checkForWinner(winningBoards[i])
      isWinner.length > 0 ? ties++ : xWins++
    } else if (countX > countO) {
      xWins++
    } else if (countX === countO) {
      oWins++
    }
  }
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
  console.log('fail.')
}

const updateGameSuccess = function (data) {
  // console.log('This is what your game looks like now:' + JSON.stringify(data))
}

const updateGameFailure = function (error) {
  console.log(error)
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
  createGameFailure
}
