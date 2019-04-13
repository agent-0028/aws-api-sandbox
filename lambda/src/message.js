const rhymeIt = require('./rhymeIt')

const message = (wordsToRhyme = []) => {
  const allRhymes = wordsToRhyme.reduce((result, wordToRhyme) => {
    const rhymesOfWord = rhymeIt(wordToRhyme)
    return result.concat(rhymesOfWord)
  }, [])

  const words = wordsToRhyme.join(', ')
  const rhymed = allRhymes.join(', ')

  return Promise.resolve(`<p>The words "${rhymed}" rhyme with "${words}"</p>`)
}

module.exports = message
