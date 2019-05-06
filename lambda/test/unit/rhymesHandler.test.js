describe('message', function () {
  let subject, rhymeIt

  beforeEach(() => {
    rhymeIt = td.replace('../../src/rhymeIt')
    subject = require('../../src/rhymesHandler')
  })

  it('finds rhymes for a word', function () {
    const fakeRhymesMoon = ['moon', 'soon', 'boon']
    const fakeRhymesFood = ['good', 'wood']
    td.when(rhymeIt('moon')).thenReturn(fakeRhymesMoon)
    td.when(rhymeIt('food')).thenReturn(fakeRhymesFood)

    return subject({ words: [ 'moon', 'food' ] }).then((result) => {
      expect(result.statusCode).toEqual(200)
      expect(result.body).toEqual(`["moon","soon","boon","good","wood"]`)
    })
  })

  describe('when the word is not found', function () {
    it('resolves with an empty array', function () {
      td.when(rhymeIt('sdfgwtp')).thenReturn([])
      td.when(rhymeIt('xdfglh')).thenReturn([])

      return subject({ words: [ 'sdfgwtp', 'xdfglh' ] }).then((result) => {
        expect(result.statusCode).toEqual(200)
        expect(result.body).toEqual(`[]`)
      })
    })
  })

  describe('when called with an empty object', function () {
    it('resolves with an empty array', function () {
      return subject({ }).then((result) => {
        expect(result.statusCode).toEqual(200)
        expect(result.body).toEqual(`[]`)
      })
    })
  })

  describe('when called with no arguments', function () {
    it('resolves with an empty array', function () {
      return subject().then((result) => {
        expect(result.statusCode).toEqual(200)
        expect(result.body).toEqual(`[]`)
      })
    })
  })
})
