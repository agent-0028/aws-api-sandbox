const handler = () => {
  const instructions = [
    'Do this',
    'Do that'
  ]

  const response = {
    statusCode: 200,
    body: JSON.stringify(instructions)
  }

  return Promise.resolve(response)
}

module.exports = handler
