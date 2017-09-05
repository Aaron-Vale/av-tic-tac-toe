'use strict'
const logic = require('./logic')
const store = require('./game-store')
const getFormFields = require('../../../lib/get-form-fields')
const gameApi = require('./api')
const gameUi = require('./ui')
const userStore = require('../store')
const watcher = require('../watcher')
const online = require('./online')

const gameReset = function () {
  $('.board-square').removeClass('played').html('') // Reset board status
  $('.board-square').on('click', onClickSquare) // Reset event listeners
  $('#0, #1, #2, #3, #4, #5, #6, #7, #8').each(function () {
    $(this).css('background-color', '#424743') // Reset square background color
  })
  store.boardData = ['', '', '', '', '', '', '', '', ''] // Reset Board Store Data
  store.whoseTurn = 'x'
  store.winningNumbers = []
}

const onClickSquare = function () {
  if (!store.isOnlineGame) {
    if (!$(this).hasClass('played')) {
      $('#online-play-btn').addClass('hidden') // Disable online play once game has started
      const squareId = this.id
      const letterToPlay = store.whoseTurn
      letterToPlay === 'x' ? $(this).html(userStore.xToken) : $(this).html(userStore.oToken) // Play the token selected in the settings menu
      store.boardData[squareId] = letterToPlay // Save the move in a local array
      store.whoseTurn = (letterToPlay === 'x' ? 'o' : 'x') // Switch turns
      $(this).addClass('played') // Prevents square from being played again

      // Begin to Check for Winner

      let isOver = false
      const winningNumbers = logic.checkForWinner(store.boardData) // Check the current board for winner
      if (winningNumbers === 0) { // If there is a Tie
        $('.board-square').off() // No more moves allowed
        $('.jumbotron-text').text("It's a tie...")
        $('.jumbotron-text').fadeIn(200).fadeOut(200).fadeIn(200).fadeOut(200).fadeIn(200)
        $('#reset-btn').removeClass('hidden')
        $('#online-play-btn').addClass('hidden')
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
        $('.jumbotron-text').text('').html('<h3>WINNER: ' + letterToPlay.toUpperCase() + '!</h3>')
        $('.jumbotron-text').fadeIn(200).fadeOut(200).fadeIn(200).fadeOut(200).fadeIn(200).fadeIn(200).fadeOut(200).fadeIn(200)
        if ((($('#o-token').text()) === 'Evil Empire')) { // Easter egg ;)
          $('.jumbotron-text').text('Ugh.')
        }
        $('#reset-btn').removeClass('hidden')
        $('#online-play-btn').addClass('hidden')
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
      // Update Turn Indicator
      $('.now-up').html('' + store.whoseTurn.toUpperCase())

      // Update Game Status to API

      gameApi.updateGame(squareId, letterToPlay, isOver)
        .then(gameUi.updateGameSuccess)
        .catch(gameUi.updateGameFailure)
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
  gameReset() // Resets game board and game variables
  const data = userStore.userSession
  gameApi.logout(data)
    .then(gameUi.onLogoutSuccess)
    .catch(gameUi.onLogoutFailure)
  userStore.userSession = null // Clear current user session data
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

const onJoinGame = function (event) {
  event.preventDefault()
  const data = getFormFields(event.target)
  gameApi.joinGame(data.id)
    .then(gameUi.onJoinGameSuccess)
    .catch(gameUi.onJoinGameFailure)
  $('#onlinePlayModal').modal('hide')
}

const onHostGame = function (event) {
  event.preventDefault()
  store.isOnlineGame = true
  userStore.onlineMove = 'o'
  $('#onlinePlayModal').modal('hide')
  $('.jumbotron-text').text('Waiting for Opponent...')
  $('.now-up').text('X')
  $('#settings-btn').addClass('hidden')
  $('#online-play-btn').addClass('hidden')
  $('.settings-div').addClass('hidden')
  $('.game-info').removeClass('hidden')
  // Set up Watcher
  const id = userStore.gameId
  userStore.onlineGameId = id
  const token = userStore.userSession.user.token
  watcher.setGameWatcher(id, token)
  $('.board-square').on('click', function () {
    const index = this.id
    if ($('.jumbotron-text').text() === 'Your Turn!') { // Only allow move if player turn
      online.playMove(index, userStore.onlineMove)
    }
  })
}

const onOpenChat = function () {
  $('.chat-div').removeClass('hidden')
  $('.game-info').addClass('hidden')
  $('.settings-div').addClass('hidden')
}

const onCloseChat = function () {
  $('.chat-div').addClass('hidden')
  $('.game-info').removeClass('hidden')
}

const onSendChat = function (event) {
  event.preventDefault()
  const data = getFormFields(event.target)
  $('.chat-area').append('<p class="chat-text"><strong>' + userStore.userSession.user.email + ':</strong> ' + data.comment + '</p>')
}

const onOpenSettings = function () {
  $('.settings-div').removeClass('hidden')
  $('.game-info').addClass('hidden')
  $('.chat-div').addClass('hidden')
}

const onSaveSettings = function () {
  if (($('#x-token').text()) === 'X (Default)') {
    userStore.xToken = '<p class="move">X</p>'
  } else if (($('#x-token').text()) === 'Crossed Bats') {
    userStore.xToken = '<img src="https://farm5.staticflickr.com/4441/36649849830_7c243fbb17_z.jpg">'
  } else if (($('#x-token').text()) === 'Hanging Sox Logo') {
    userStore.xToken = '<img src="https://farm5.staticflickr.com/4344/36858417126_2f50e54702_z.jpg">'
  }
  if (($('#o-token').text()) === 'O (Default)') {
    userStore.oToken = '<p class="move">O</p>'
  } else if (($('#o-token').text()) === 'Red Sox Logo') {
    userStore.oToken = '<img src="https://farm5.staticflickr.com/4368/36238837593_710b10816a_z.jpg">'
  } else if (($('#o-token').text()) === 'Hanging Sox Logo') {
    userStore.oToken = '<img src="https://farm5.staticflickr.com/4344/36858417126_2f50e54702_z.jpg">'
  } else if (($('#o-token').text()) === 'Baseball') {
    userStore.oToken = '<img src="https://farm5.staticflickr.com/4415/36879882432_593a76f1f4_z.jpg">'
  } else if (($('#o-token').text()) === 'Evil Empire') {
    userStore.oToken = '<img src="https://farm5.staticflickr.com/4366/36879935272_9d2a50c5e1_z.jpg">'
  }

  $('.settings-div').addClass('hidden')
  $('.game-info').removeClass('hidden')
  $('.jumbotron-text').text('Settings Updated.')
}

const setEventListeners = function () {
  $('.board-square').on('click', onClickSquare)
  $('#login-form').on('submit', onLogin)
  $('.logout-btn').on('click', onLogout)
  $('#signup-form').on('submit', onSignup)
  $('#change-pass').on('submit', onChangePass)
  $('#join-game-form').on('submit', onJoinGame)
  $('#host-game-btn').on('click', onHostGame)
  $('#chat-btn').on('click', onOpenChat)
  $('#close-chat-btn').on('click', onCloseChat)
  $('#chat-form').on('submit', onSendChat)
  $('#settings-btn').on('click', onOpenSettings)
  $('.save-settings-btn').on('click', onSaveSettings)
  $('.x-item').on('click', function () {
    const value = $(this).text()
    $('#x-token').text(value)
  })
  $('.o-item').on('click', function () {
    const value = $(this).text()
    $('#o-token').text(value)
  })
  $('#reset-btn').on('click', function () {
    gameReset() // Reset Board and Game Variables
    $('#reset-btn').addClass('hidden')
    $('#online-play-btn').removeClass('hidden')
    $('#settings-btn').removeClass('hidden')
    const token = userStore.userSession.user.token

    $('.now-up').html('X') // Reset turn indicator
    // Create New Game on API
    gameApi.createGame(token)
      .then(gameUi.createGameSuccess)
      .catch(gameUi.createGameFailure)
  })
}

module.exports = {
  setEventListeners
}
