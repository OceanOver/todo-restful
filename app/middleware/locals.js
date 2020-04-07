'use strict'

module.exports = (options, app) => {
  return async function(ctx, next) {
    const { config } = app
    ctx.locals.config = config
    await next()
  }
}
