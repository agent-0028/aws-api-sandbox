const rhymeIt = require('./rhymeIt')

const handler = ({ words: wordsToRhyme = [] } = {}) => {
  const allRhymes = wordsToRhyme.reduce((result, wordToRhyme) => {
    const rhymesOfWord = rhymeIt(wordToRhyme)
    return result.concat(rhymesOfWord)
  }, [])

  const response = {
    statusCode: 200,
    body: JSON.stringify(allRhymes)
  }

  return Promise.resolve(response)
}

module.exports = handler
