const controller = require('./controller')

module.exports.handler = function (event, context, callback) {
  const { multiValueQueryStringParameters: params, path, httpMethod } = event

  controller()(httpMethod, path, params).then((response) => {
    callback(null, response)
  })
}
