const message = require('../../src/message')

describe('response handler', function () {
  it('resolves with a message', function () {
    return message().then((result) => {
      expect(result).toEqual('<p>API Sandbox v0.0.1</p>')
    })
  })
})
