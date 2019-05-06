describe('controller', function () {
  let subject

  beforeEach(() => {
    subject = require('../../src/controller')
  })

  context('when there is a valid handler configuration', () => {
    let method, path, params, mockHandlers, mockNotFoundHandler, handler

    beforeEach(() => {
      path = '/handler/'
      method = 'GET'
      params = ['word']

      handler = td.func('handler')
      td.when(handler(params)).thenResolve({ statusCode: 200, body: 'body' })
      mockHandlers = {
        'GET': {
          '/handler/': handler
        }
      }
      mockNotFoundHandler = td.func('not found handler')
      td.when(mockNotFoundHandler(params)).thenResolve({ statusCode: 404, body: 'error' })
    })

    it('routes requests to the appropriate handler', function () {
      return subject(mockHandlers, mockNotFoundHandler)(method, path, params).then((result) => {
        expect(result).toEqual({
          statusCode: 200,
          headers: {
            'Content-Type': 'application/json; charset=utf-8',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Credentials': true
          },
          body: 'body' })
      })
    })

    context('when there is no handler for the method', () => {
      it('responds with the error handler', function () {
        return subject(mockHandlers, mockNotFoundHandler)(path, 'WHATEV', params).then((result) => {
          expect(result).toEqual({
            statusCode: 404,
            headers: {
              'Content-Type': 'application/json; charset=utf-8',
              'Access-Control-Allow-Origin': '*',
              'Access-Control-Allow-Credentials': true
            },
            body: 'error'
          })
        })
      })
    })

    context('when there is no handler for the path', () => {
      it('responds with the error handler', function () {
        return subject(mockHandlers, mockNotFoundHandler)('/does/not/exist/', method, params).then((result) => {
          expect(result).toEqual({
            statusCode: 404,
            headers: {
              'Content-Type': 'application/json; charset=utf-8',
              'Access-Control-Allow-Origin': '*',
              'Access-Control-Allow-Credentials': true
            },
            body: 'error'
          })
        })
      })
    })
  })
})
