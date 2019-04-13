describe('response handler', function () {
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

    return subject([ 'moon', 'food' ]).then((result) => {
      expect(result).toEqual('<p>The words "moon, soon, boon, good, wood" rhyme with "moon, food"</p>')
    })
  })
})
