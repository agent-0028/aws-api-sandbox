describe('API Sandbox', function() {
  it('returns an array of instructions', () => {
    return cy.request({
      url: '/'
    }).then((response) => {
      expect(response.status).to.eq(200)
      expect(response.body).to.contain('Do that')
    })
  })

  it('finds a rhyme', () => {
    return cy.request({
      url: '/rhymes/',
      qs: { words: 'orange' }
    }).then((response) => {
      expect(response.status).to.eq(200)
      expect(response.body).to.contain('orange')
    })
  })

  describe('when the path is invalid', function() {
    it('returns an error', () => {
      cy.request({
        url: '/invalid/',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.eq(404)
        expect(response.body).to.have.property('error')
      })
    })
  })
})
