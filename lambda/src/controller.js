const rhymesHandler = require('./rhymesHandler')
const notFoundHandler = require('./notFoundHandler')

const injectedHandlers = {
  'GET': {
    '/rhymes/': rhymesHandler
  }
}
const injectedNotFoundHandler = notFoundHandler

module.exports = (handlers = injectedHandlers, notFoundHandler = injectedNotFoundHandler) => (method, path, params) => {
  const { [method]: { [path]: handler = notFoundHandler } = {} } = handlers

  return handler(params).then(({ statusCode, body }) => {
    return {
      statusCode,
      headers: {
        'Content-Type': 'application/json; charset=utf-8'
      },
      body
    }
  })
}
