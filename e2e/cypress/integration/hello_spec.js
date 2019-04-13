describe('API Sandbox', function() {
  it('finds a message', function() {
    cy.visit('https://5ic1s599s0.execute-api.us-west-2.amazonaws.com/sandbox-development/rhymes/?words=food')

    cy.contains('rhyme')
  })
})
