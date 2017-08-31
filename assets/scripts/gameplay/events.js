'use strict'
const logic = require('./logic')

const onClickSquare = function () {
  if (!$(this).hasClass('played')) {
    const squareId = this.id
    const letterToPlay = logic.whoseTurn
    $(this).html('<p class="move">' + letterToPlay + '</p>')
    logic.boardData[squareId] = letterToPlay
    logic.whoseTurn = (letterToPlay === 'x' ? 'o' : 'x')
  }
  $(this).addClass('played')
  const winner = logic.checkForWinner()
  if (winner.length > 0) {
    $('.board-square').off() // No more moves allowed
    $('#' + winner[0]).css('background-color', 'gold')
    $('#' + winner[1]).css('background-color', 'gold')
    $('#' + winner[2]).css('background-color', 'gold')
  }
}
const setEventListeners = function () {
  $('.board-square').on('click', onClickSquare)
}

module.exports = {
  setEventListeners
}
