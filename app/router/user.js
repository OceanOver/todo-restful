'use strict'

module.exports = app => {
  const { controller: { user }, middleware } = app
  const router = app.router.namespace('/api/user')
  const authRequired = middleware.authRequired(app)

  router.post('/login', user.login)
  router.post('/register', user.register)
  router.get('/info', authRequired, user.info)
  router.post('/logout', authRequired, user.logout)
}

