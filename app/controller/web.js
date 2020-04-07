'use strict'

const Controller = require('egg').Controller

class WebController extends Controller {
  async index() {
    const { ctx } = this
    await ctx.render('signin.nj', {
      pageName: 'index',
    })
  }

  async register() {
    const { ctx } = this
    await ctx.render('register.nj', {
      pageName: 'register',
    })
  }

  async main() {
    const { ctx } = this
    await ctx.render('main.nj', {
      pageName: 'main',
    })
  }
}

module.exports = WebController
