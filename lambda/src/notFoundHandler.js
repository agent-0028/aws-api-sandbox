const handler = () => Promise.resolve({ statusCode: 404, body: JSON.stringify({ error: 'There was an error.' }) })

module.exports = handler
