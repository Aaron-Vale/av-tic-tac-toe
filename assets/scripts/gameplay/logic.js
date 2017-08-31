'use strict'

const store = require('./game-store')

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
  for (let i = 0; i < winningCombos.length; i++) {
    const val1 = winningCombos[i][0]
    const val2 = winningCombos[i][1]
    const val3 = winningCombos[i][2]
    if (store.boardData[val1] !== '' && store.boardData[val2] !== '' && store.boardData[val3] !== '') {
      if (store.boardData[val1] === store.boardData[val2] && store.boardData[val2] === store.boardData[val3]) {
        store.winningNumbers.push(val1)
        store.winningNumbers.push(val2)
        store.winningNumbers.push(val3)
      }
    }
  }
  let tieIndicator = store.boardData.toString().replace(/,/g, '')
  if (store.winningNumbers.length === 0 && tieIndicator.length === 9) {
    return 0
  }
  return store.winningNumbers
}

module.exports = {
  checkForWinner
}
