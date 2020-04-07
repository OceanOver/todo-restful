'use strict'

const { app, assert } = require('egg-mock/bootstrap')

describe('test/app/controller/user.test.js', () => {

  it('register', () => {
    return app.httpRequest()
      .post('/api/user/register')
      .send({ username: 'oceanover', password: '123456' })
      .set('Accept', 'application/json')
      .expect(200)
      .then(response => {
        assert(response.body.state, 1000)
      })
  })

})
