'use strict'

module.exports = app => {
  const { controller } = app
  const router = app.router.namespace('')
  router.get('/', controller.web.index)
  router.get('/register', controller.web.register)
  router.get('/main', controller.web.main)
}
