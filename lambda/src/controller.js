const message = require('./message')

const injectedHandlers = {
  'GET': {
    '/ryhmes/': message
  }
}
const injectedNotFoundHandler = () => Promise.resolve({ statusCode: 404, body: JSON.stringify({ error: 'There was an error.' }) })

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
