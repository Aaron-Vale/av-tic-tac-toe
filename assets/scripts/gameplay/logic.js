'use strict'

const boardData = ['', '', '', '', '', '', '', '', '']
let whoseTurn = 'x'

const checkForWinner = function () {
  const winningCombos = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ]
  const winningNumbers = []
  for (let i = 0; i < winningCombos.length; i++) {
    const val1 = winningCombos[i][0]
    const val2 = winningCombos[i][1]
    const val3 = winningCombos[i][2]
    if (boardData[val1] !== '' && boardData[val2] !== '' && boardData[val3] !== '') {
      if (boardData[val1] === boardData[val2] && boardData[val2] === boardData[val3]) {
        winningNumbers.push(val1)
        winningNumbers.push(val2)
        winningNumbers.push(val3)
      }
    }
  }
  return winningNumbers
}

module.exports = {
  boardData,
  whoseTurn,
  checkForWinner
}
