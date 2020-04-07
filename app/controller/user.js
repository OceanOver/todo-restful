'use strict'

const Controller = require('egg').Controller

class UserController extends Controller {
  // 注册
  async register() {
    const { ctx, service } = this
    const { body } = ctx.request
    let { username, password } = body
    // 替换全部空格为空
    username = username ? username.replace(/(^\s+)|(\s+$)/g, '') : ''
    password = password ? password.replace(/(^\s+)|(\s+$)/g, '') : ''
    let message
    if ((username += '') === '') {
      message = '用户名不能为空'
    } else if ((password += '') === '') {
      message = '密码不能为空'
    }
    if (message) {
      return { state: 1001, msg: message }
    }
    const result = await service.user.register(body)
    ctx.body = result
  }

  // 登录
  async login() {
    const { ctx, service } = this
    const { body } = ctx.request
    let { username, password } = body
    // 替换全部空格为空
    username = username ? username.replace(/(^\s+)|(\s+$)/g, '') : ''
    password = password ? password.replace(/(^\s+)|(\s+$)/g, '') : ''
    let message
    if ((username += '') === '') {
      message = '用户名不能为空'
    } else if ((password += '') === '') {
      message = '密码不能为空'
    }
    if (message) {
      return { state: 1001, msg: message }
    }
    const result = await service.user.login(body)
    ctx.body = result
  }

  // 用户信息
  async info() {
    const { ctx, service } = this
    const result = await service.user.info()
    ctx.body = result
  }

  // 注册
  async logout() {
    const { ctx, service } = this
    const result = await service.user.logout()
    ctx.body = result
  }
}

module.exports = UserController
