'use strict'

const onClickSquare = function () {
  if (!$(this).hasClass('played')) {
    $(this).html('<p class="move">X</p>')
  }
  $(this).addClass('played')
}
const setEventListeners = function () {
  $('.board-square').on('click', onClickSquare)
}

module.exports = {
  setEventListeners
}
