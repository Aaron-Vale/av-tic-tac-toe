'use strict'

const config = require('../config')
const store = require('../store')

const signUp = function (data) {
  return $.ajax({
    url: config.apiOrigin + '/sign-up/',
    method: 'POST',
    data
  })
}

const login = function (data) {
  return $.ajax({
    url: config.apiOrigin + '/sign-in/',
    method: 'POST',
    data
  })
}

const logout = function (data) {
  const id = data.user.id
  const token = data.user.token
  return $.ajax({
    url: config.apiOrigin + '/sign-out/' + id,
    method: 'DELETE',
    headers: {
      Authorization: 'Token token=' + token
    }
  })
}

const changePass = function (data) {
  const id = store.userSession.user.id
  const token = store.userSession.user.token
  return $.ajax({
    url: config.apiOrigin + '/change-password/' + id,
    method: 'PATCH',
    headers: {
      Authorization: 'Token token=' + token
    },
    data
  })
}

const createGame = function (token) {
  return $.ajax({
    url: config.apiOrigin + '/games',
    method: 'POST',
    headers: {
      Authorization: 'Token token=' + token
    },
    data: {}
  })
}

const getGames = function (token) {
  return $.ajax({
    url: config.apiOrigin + '/games?over=true',
    method: 'GET',
    headers: {
      Authorization: 'Token token=' + token
    }
  })
}

const updateGame = function (index, value, isOver) {
  const gameId = store.gameId
  const token = store.userSession.user.token
  return $.ajax({
    url: config.apiOrigin + '/games/' + gameId,
    method: 'PATCH',
    headers: {
      Authorization: 'Token token=' + token
    },
    data: {
      "game": {
        "cell": {
          "index": index,
          "value": value
        },
        "over": isOver
      }
    }
  })
}

module.exports = {
  signUp,
  login,
  logout,
  changePass,
  createGame,
  getGames,
  updateGame
}
