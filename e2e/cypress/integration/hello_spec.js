describe('API Sandbox', function() {
  it('finds a message', function() {
    cy.visit(' https://z08lso0ic4.execute-api.us-west-2.amazonaws.com/sandbox-development/rhymes/?words=food')

    cy.contains('rhyme')
  })
})
