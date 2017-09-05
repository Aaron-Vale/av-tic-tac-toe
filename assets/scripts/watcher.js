'use strict'

const config = require('./config')
const online = require('./gameplay/online')

const resourceWatcher = function (url, conf) {
  const token = function (conf) {
    return conf && (conf = conf.Authorization) &&
      (conf = typeof conf === 'string' &&
        conf.split('=')) &&
      Array.isArray(conf) && conf[1]
  }

  url += '?token=' + token(conf)
  url += conf.timeout ? '&timeout=' + conf.timeout : ''
  const es = new EventSource(url)// jshint ignore: line
  const close = function () {
    es.close()
  }

  const makeHandler = function (handler, close) {
    return function (e) {
      if (close) {
        close()
      }

      return handler(e.data ? JSON.parse(e.data) : e)
    }
  }

  const on = function (event, handler) {
    switch (event) {
      case 'connect':
        es.onopen = makeHandler(handler)
        break
      case 'change':
        es.onmessage = makeHandler(handler)
        break
      case 'error':
        es.onerror = makeHandler(handler, close)
        break
      default:
        console.error('Unknown event type:' + event)
        break
    }
  }

  return {
    close: close,
    on: on
  }
}

const setGameWatcher = function (id, token) {
  const gameWatcher = resourceWatcher(config.apiOrigin + '/games/' + id + '/watch', {
    Authorization: 'Token token=' + token
  })

  gameWatcher.on('change', function (data) {
    console.log(data)
    if (data.game && data.game.cells) {
      const diff = changes => {
        const before = changes[0]
        const after = changes[1]
        for (let i = 0; i < after.length; i++) {
          if (before[i] !== after[i]) {
            return {
              index: i,
              value: after[i]
            }
          }
        }

        return { index: -1, value: '' }
      }

      const cell = diff(data.game.cells)
      online.playMove(cell.index, cell.value)
    } else if (data.timeout) { // not an error
      gameWatcher.close()
    }
  })

  gameWatcher.on('error', function (e) {
    console.error('an error has occurred with the stream', e)
  })
}

module.exports = {
  resourceWatcher,
  setGameWatcher
}
