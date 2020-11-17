const rhymesHandler = require('./rhymesHandler')
const rootHandler = require('./rootHandler')
const notFoundHandler = require('./notFoundHandler')

const injectedHandlers = {
  GET: {
    '/rhymes/': rhymesHandler,
    '/': rootHandler
  }
}
const injectedNotFoundHandler = notFoundHandler

module.exports = (handlers = injectedHandlers, notFoundHandler = injectedNotFoundHandler) => (method, path, params) => {
  const { [method]: { [path]: handler = notFoundHandler } = {} } = handlers

  return handler(params).then(({ statusCode, body }) => {
    return {
      statusCode,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
        'Content-Type': 'application/json; charset=utf-8'
      },
      body
    }
  })
}
