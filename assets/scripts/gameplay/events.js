'use strict'
const logic = require('./logic')
const store = require('./game-store')
const getFormFields = require('../../../lib/get-form-fields')
const gameApi = require('./api')
const gameUi = require('./ui')
const userStore = require('../store')

const gameReset = function () {
  $('.board-square').removeClass('played').html('') // Reset board status
  $('.board-square').on('click', onClickSquare) // Reset event listeners
  $('#0, #1, #2, #3, #4, #5, #6, #7, #8').each(function () {
    $(this).css('background-color', '#e4e4e4')
  }) // Reset square background color
  store.boardData = ['', '', '', '', '', '', '', '', ''] // Reset Board Store Data
  store.whoseTurn = 'x'
  store.winningNumbers = []
}

const onClickSquare = function () {
  if (!$(this).hasClass('played')) {
    const squareId = this.id
    const letterToPlay = store.whoseTurn
    $(this).html('<p class="move">' + letterToPlay + '</p>')
    store.boardData[squareId] = letterToPlay
    store.whoseTurn = (letterToPlay === 'x' ? 'o' : 'x')
    $(this).addClass('played')
    const winner = logic.checkForWinner()
    if (winner === 0) {
      $('.board-square').off() // No more moves allowed
      $('.jumbotron-text').text("It's a tie...")
    }
    if (winner.length === 3) { // If a Winner is Detected
      $('.board-square').off() // No more moves allowed
      $('#' + winner[0]).css('background-color', '#00335D')
      $('#' + winner[1]).css('background-color', '#00335D')
      $('#' + winner[2]).css('background-color', '#00335D')
      $('.jumbotron-text').text('').html('<h3>WINNER:<br>' + letterToPlay.toUpperCase() + '!</h3>')
    }
  }
}

const onLogin = function (event) {
  event.preventDefault()
  const data = getFormFields(event.target)
  gameApi.login(data)
    .then(gameUi.onSignInSuccess)
    .catch(gameUi.onSignInFailure)
}

const onLogout = function () {
  gameReset()
  const data = userStore.userSession
  gameApi.logout(data)
    .then(gameUi.onLogoutSuccess)
    .catch(gameUi.onLogoutFailure)
  userStore.userSession = null
  $('.game-view').addClass('hidden')
  $('.login-view').removeClass('hidden')
}

const onSignup = function (event) {
  event.preventDefault()
  const data = getFormFields(event.target)
  gameApi.signUp(data)
    .then(gameUi.onSignUpSuccess)
    .catch(gameUi.onSignUpFailure)
}

const setEventListeners = function () {
  $('.board-square').on('click', onClickSquare)
  $('#login-form').on('submit', onLogin)
  $('.logout-btn').on('click', onLogout)
  $('#signup-form').on('submit', onSignup)
}

module.exports = {
  setEventListeners
}
