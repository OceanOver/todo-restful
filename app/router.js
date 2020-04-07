'use strict'

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  // this plugin (egg-router-plus) will auto load router define at app/router/**/*.js
  // require('./router/web')(app)
  // require('./router/user')(app)
  // require('./router/item')(app)

  // all sub routers will be loaded before app/router.js
  const { router } = app
  router.resources('/api', ctx => {
    ctx.status = 404
    ctx.body = {
      state: 1004,
      msg: 'Not Found',
    }
    return
  })
}
