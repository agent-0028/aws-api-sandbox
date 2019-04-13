const rhymes = require('rhymes')

const rhymeIt = (word = '') => {
  const results = rhymes(word)
  return results.map(result => result.word)
}

module.exports = rhymeIt
