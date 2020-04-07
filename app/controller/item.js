'use strict'

const Controller = require('egg').Controller

class ItemController extends Controller {
  async list() {
    const { ctx, service } = this
    const result = await service.item.list()
    ctx.body = result
  }

  async statistics() {
    const { ctx, service } = this
    const result = await service.item.statistics()
    ctx.body = result
  }

  async addItem() {
    const { ctx, service } = this
    const result = await service.item.addItem()
    ctx.body = result
  }

  async modifyItem() {
    const { ctx, service } = this
    const result = await service.item.modifyItem()
    ctx.body = result
  }

  async clearAll() {
    const { ctx, service } = this
    const result = await service.item.clearAll()
    ctx.body = result
  }

  async deleteComplete() {
    const { ctx, service } = this
    const result = await service.item.deleteComplete()
    ctx.body = result
  }

  async deleteItems() {
    const { ctx, service } = this
    const result = await service.item.deleteItems()
    ctx.body = result
  }

  async deleteItem() {
    const { ctx, service } = this
    const result = await service.item.deleteItem()
    ctx.body = result
  }

  async completeItem() {
    const { ctx, service } = this
    const result = await service.item.completeItem()
    ctx.body = result
  }

  async deleteExpire() {
    const { ctx, service } = this
    const result = await service.item.deleteExpire()
    ctx.body = result
  }
}

module.exports = ItemController
