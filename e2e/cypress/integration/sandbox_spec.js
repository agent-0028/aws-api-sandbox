describe('API Sandbox', function() {
  it('finds a rhyme', () => {
    return cy.request({
      url: 'https://66f4ko9t89.execute-api.us-west-2.amazonaws.com/sandbox-development/ryhmes/',
      qs: { words: 'run' }
    }).then((response) => {
      expect(response.status).to.eq(200)
      expect(response.body).to.contain('run')
    })
  })

  describe('when the path is invalid', function() {
    it('returns an error', () => {
      cy.request({
        url: 'https://66f4ko9t89.execute-api.us-west-2.amazonaws.com/sandbox-development/invalid/',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.eq(404)
        expect(response.body).to.have.property('error')
      })
    })
  })
})
