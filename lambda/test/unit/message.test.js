describe('message', function () {
  let subject, rhymeIt

  beforeEach(() => {
    rhymeIt = td.replace('../../src/rhymeIt')
    subject = require('../../src/message')
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
})
