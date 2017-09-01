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
    let isOver = false
    const winningNumbers = logic.checkForWinner(store.boardData)
    if (winningNumbers === 0) { // If there is a Tie
      $('.board-square').off() // No more moves allowed
      $('.jumbotron-text').text("It's a tie...")
      $('.jumbotron-text').fadeIn(200).fadeOut(200).fadeIn(200).fadeOut(200).fadeIn(200)
      $('#reset-btn').removeClass('hidden')
      isOver = true

      // Update Scoreboard
      let xTies = parseInt($('#x-ties').html())
      let oTies = parseInt($('#o-ties').html())
      xTies++
      oTies++
      $('#x-ties').html(xTies)
      $('#o-ties').html(oTies)
    }
    if (winningNumbers.length === 3) { // If a Winner is Detected
      $('.board-square').off() // No more moves allowed
      $('#' + winningNumbers[0]).css('background-color', '#00335D')
      $('#' + winningNumbers[1]).css('background-color', '#00335D')
      $('#' + winningNumbers[2]).css('background-color', '#00335D')
      $('.jumbotron-text').text('').html('<h3>WINNER:<br>' + letterToPlay.toUpperCase() + '!</h3>')
      $('.jumbotron-text').fadeIn(200).fadeOut(200).fadeIn(200).fadeOut(200).fadeIn(200)
      $('#reset-btn').removeClass('hidden')
      isOver = true

      // Update Scoreboard
      let xWins = parseInt($('#x-wins').html())
      let oWins = parseInt($('#o-wins').html())
      let xLosses = parseInt($('#x-losses').html())
      let oLosses = parseInt($('#o-losses').html())
      const winner = letterToPlay
      const loser = winner === 'x' ? 'o' : 'x'

      winner === 'x' ? xWins++ : oWins++
      loser === 'x' ? xLosses++ : oLosses++

      $('#x-wins').html(xWins)
      $('#o-wins').html(oWins)
      $('#x-losses').html(xLosses)
      $('#o-losses').html(oLosses)
    }
    // Update Game Status to API

    gameApi.updateGame(squareId, letterToPlay, isOver)
      .then(gameUi.updateGameSuccess)
      .catch(gameUi.updateGameFailure)
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

const onChangePass = function (event) {
  event.preventDefault()
  const data = getFormFields(event.target)
  gameApi.changePass(data)
    .then(gameUi.onChangePassSuccess)
    .catch(gameUi.onChangePassFailure)
  $('#changePassModal').modal('hide')
}

const setEventListeners = function () {
  $('.board-square').on('click', onClickSquare)
  $('#login-form').on('submit', onLogin)
  $('.logout-btn').on('click', onLogout)
  $('#signup-form').on('submit', onSignup)
  $('#change-pass').on('submit', onChangePass)
  $('#reset-btn').on('click', function () {
    gameReset()
    $('#reset-btn').addClass('hidden')
    const token = userStore.userSession.user.token
    // Create New Game on API
    gameApi.createGame(token)
      .then(gameUi.createGameSuccess)
      .catch(gameUi.createGameFailure)
  })
}

module.exports = {
  setEventListeners
}
