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

module.exports = {
  signUp,
  login,
  logout,
  changePass
}
