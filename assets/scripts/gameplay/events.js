'use strict'
const logic = require('./logic')
const store = require('./game-store')
const getFormFields = require('../../../lib/get-form-fields')
const gameApi = require('./api')
const gameUi = require('./ui')

const gameReset = function () {
  $('.board-square').removeClass('played').html('') // Reset board status
  $('.board-square').on('click', onClickSquare) // Reset event listeners
  $('#0, #1, #2, #3, #4, #5, #6, #7, #8').each(function () {
    $(this).css('background-color', '#54796d')
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
    if (winner.length > 0) {
      $('.board-square').off() // No more moves allowed
      $('#' + winner[0]).css('background-color', 'gold')
      $('#' + winner[1]).css('background-color', 'gold')
      $('#' + winner[2]).css('background-color', 'gold')
    }
  }
}

const onLogin = function (event) {
  event.preventDefault()
  $('.login-view').addClass('hidden')
  $('.game-view').removeClass('hidden')
}

const onLogout = function () {
  gameReset()
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
