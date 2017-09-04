'use strict'

const gameStore = require('./game-store')
const logic = require('./logic')
const gameApi = require('./api')
const gameUi = require('./ui')

const playMove = function (index, value) {
  if (!$('#' + index).hasClass('played')) {
    // $('.jumbotron-text').text('Waiting for opponent...')
    $('#' + index).html('<p class="move">' + value.toUpperCase() + '</p>')
    gameStore.boardData[index] = value
    gameStore.whoseTurn = (value === 'x' ? 'o' : 'x')
    $('#' + index).addClass('played')
    let isOver = false
    const winningNumbers = logic.checkForWinner(gameStore.boardData)
    if (winningNumbers === 0) { // If there is a Tie
      $('.board-square').off() // No more moves allowed
      $('.jumbotron-text').text("It's a tie...")
      $('.jumbotron-text').fadeIn(200).fadeOut(200).fadeIn(200).fadeOut(200).fadeIn(200)
      $('#reset-btn').removeClass('hidden')
      isOver = true
    }
    if (winningNumbers.length === 3) { // If a Winner is Detected
      $('.board-square').off() // No more moves allowed
      $('#' + winningNumbers[0]).css('background-color', '#00335D')
      $('#' + winningNumbers[1]).css('background-color', '#00335D')
      $('#' + winningNumbers[2]).css('background-color', '#00335D')
      $('.jumbotron-text').text('').html('<h3>WINNER: ' + value.toUpperCase() + '!</h3>')
      $('.jumbotron-text').fadeIn(200).fadeOut(200).fadeIn(200).fadeOut(200).fadeIn(200).fadeIn(200).fadeOut(200).fadeIn(200)
      $('#reset-btn').removeClass('hidden')
      isOver = true
    }
    // Update Turn Indicator
    $('.now-up').html('' + gameStore.whoseTurn.toUpperCase())

    // Update Game Status to API
    gameApi.updateGame(index, value, isOver)
      .then(gameUi.updateGameSuccess)
      .catch(gameUi.updateGameFailure)
  }
}

module.exports = {
  playMove
}
