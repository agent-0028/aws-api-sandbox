const message = require('./message')

module.exports.handler = function (event, context, callback) {
  message().then((body) => {
    const response = {
      statusCode: 200,
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
      },
      body
    };
    callback(null, response)
  })
}
