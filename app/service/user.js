'use strict'

const Service = require('egg').Service

class UserService extends Service {
  async register(req) {
    const { ctx } = this
    const { User } = ctx.model
    const { username, password } = req
    const res = await User.findAll({
      where: {
        username,
      },
    })
    if (res && res.length > 0) {
      return { state: 1000, msg: '用户已存在' }
    }
    await User.create({
      username,
      password,
    })
    return { state: 1000, msg: '注册成功' }
  }

  async login(req) {
    const { ctx, config, app: { redis } } = this
    const { User } = ctx.model
    const { username, password } = req
    const existUser = await User.findOne({
      where: {
        username,
      },
    })
    // 用户不存在
    if (!existUser) {
      return { state: 1001, msg: '用户不存在' }
    }

    const equal = existUser.authenticate(password)
    // 密码不匹配
    if (!equal) {
      return { state: 1001, msg: '验证失败' }
    }

    const { token } = config
    const { expiresIn: expire } = token
    const userToken = ctx.helper.signToken(existUser, token)

    const key = 'user_' + existUser.id
    await redis.set(key, userToken, 'EX', expire)

    // 验证通过
    return {
      state: 1000,
      msg: '登陆成功',
      data: { token: userToken, expire },
    }
  }


  async info() {
    const { ctx } = this
    const { User } = ctx.model
    const { user: { id } } = ctx.request
    const user = await User.findById(id)
    return { state: 1000, user }
  }


  async logout() {
    const { app: { redis }, ctx } = this
    const { user: { id } } = ctx.request
    const key = 'user_' + id
    await redis.del(key)
    return { state: 1000, msg: '退出用户登录' }
  }
}

module.exports = UserService
