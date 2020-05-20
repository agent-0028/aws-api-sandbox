describe('rootHandler', function () {
  let subject

  beforeEach(() => {
    subject = require('../../src/rootHandler')
  })

  it('does not blow up', function () {
    return subject().then((result) => {
      expect(result.statusCode).toEqual(200)
      expect(result.body).toEqual('["Do this","Do that"]')
    })
  })
})
