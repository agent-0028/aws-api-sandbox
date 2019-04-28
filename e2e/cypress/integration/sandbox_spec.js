
// TODO: pull this into an environment var
const baseUrl = 'https://kv83oe1hm5.execute-api.us-west-2.amazonaws.com/sandbox-development'

describe('API Sandbox', function() {
  it('finds a rhyme', () => {
    return cy.request({
      url: baseUrl + '/rhymes/',
      qs: { words: 'orange' }
    }).then((response) => {
      expect(response.status).to.eq(200)
      expect(response.body).to.contain('orange')
    })
  })

  describe('when the path is invalid', function() {
    it('returns an error', () => {
      cy.request({
        url: baseUrl + '/invalid/',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.eq(404)
        expect(response.body).to.have.property('error')
      })
    })
  })
})
