'use strict'

const userStore = require('../store')

const onSignUpSuccess = function () {
  $('#alert-div').html('<p>You have successfully registered!<p>')
  $('#alert-div').removeClass('hidden')
  $('#alert-div').addClass('alert-success')
  $('#alert-div').removeClass('alert-danger')
}

const onSignUpFailure = function () {
  $('#alert-div').html('<p>Something went wrong. Either you have already registered or your passwords don\'t match!</p>')
  $('#alert-div').removeClass('hidden')
  $('#alert-div').addClass('alert-danger')
  $('#alert-div').removeClass('alert-success')
}

const onSignInSuccess = function (data) {
  userStore.userSession = data
  $('.login-view').addClass('hidden')
  $('.game-view').removeClass('hidden')
  $('.jumbotron-text').text('Welcome ' + userStore.userSession.user.email + '!')
}

const onSignInFailure = function () {
  $('#alert-div').html('<p>Something went wrong. Either you haven\'t registered or your password is incorrect.')
  $('#alert-div').removeClass('hidden')
  $('#alert-div').addClass('alert-danger')
  $('#alert-div').removeClass('alert-success')
}

const onLogoutSuccess = function () {
  $('#alert-div').html('<p>Logged Out Successfully!</p>')
  $('#alert-div').removeClass('hidden')
  $('#alert-div').addClass('alert-success')
  $('#alert-div').removeClass('alert-danger')
}

const onLogoutFailure = function () {
  console.log('uh oh.')
}

const onChangePassSuccess = function () {
  $('.jumbotron-text').text('Password successfully changed.')
}

const onChangePassFailure = function () {
  $('.jumbotron-text').text('Something went wrong. Please try again.')
}

module.exports = {
  onSignUpSuccess,
  onSignUpFailure,
  onSignInSuccess,
  onSignInFailure,
  onLogoutSuccess,
  onLogoutFailure,
  onChangePassSuccess,
  onChangePassFailure
}
