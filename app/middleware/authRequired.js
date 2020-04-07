'use strict'

/*
  need login
 */
module.exports = app => {
  const { redis, config } = app
  return async function(ctx, next) {
    const { authToken } = ctx.helper
    const { authorization } = ctx.header
    if (!authorization) {
      ctx.body = { state: 1004, msg: '用户未登录或登录过期' }
      return
    }
    const array = authorization.split(' ')
    if (array && array.length <= 1) {
      ctx.body = { state: 1004, msg: '用户未登录或登录过期' }
      return
    }
    const token = array[1]
    const res = authToken(token, config.token)
    const { result, data, msg } = res
    if (result) {
      const { id } = data
      const key = 'user_' + id
      const cacheToken = await redis.get(key)
      if (!cacheToken || cacheToken !== token) {
        ctx.body = {
          state: 1004,
          msg: 'token已失效',
        }
        return
      }
      ctx.request.user = data
      await next()

    } else {
      ctx.body = {
        state: 1004,
        msg,
      }
    }
  }
}
