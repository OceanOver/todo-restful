'use strict'

const moment = require('moment')
const Sequelize = require('sequelize')
const Op = Sequelize.Op

const Service = require('egg').Service

class ItemService extends Service {
  async list() {
    const { ctx } = this
    const { query, request } = ctx
    const { Item } = ctx.model
    const { user: { id: userId, username } } = request
    // type: 0 全部 1 未完成 2 已完成
    const { type, page, startDate, endDate } = query
    let condition = {}
    if (type === '0') {
      condition = {
        userId,
      }
    } else if (type === '1') {
      condition = {
        userId,
        completed: false,
      }
    } else if (type === '2') {
      condition = {
        userId,
        completed: true,
      }
    }
    if (startDate && endDate) {
      condition = Object.assign({
        createTime: {
          [Op.gte]: startDate,
          [Op.lte]: endDate,
        },
      }, condition)
    }
    const count = await Item.count({
      where: condition,
    })
    // debug(count)
    if (count === 0) {
      return {
        state: 1000,
        username,
        list: [],
      }
    }
    let items = []
    if (page) {
      const offset = (parseInt(page) - 1) * 10
      items = await Item.findAll({
        where: condition,
        order: [[ 'createTime', 'DESC' ]],
        offset,
        limit: 10,
      })
    } else {
      items = await Item.findAll({
        where: condition,
        order: [[ 'createTime', 'DESC' ]],
      })
    }
    return {
      state: 1000, msg: '成功获取列表', list: items, username,
    }
  }

  async statistics() {
    const { ctx } = this
    const { request } = ctx
    const { Item } = ctx.model
    const { user: { id: userId } } = request
    const currentString = moment()
      .format('YYYY-MM-DD HH:mm')
    const condition1 = {
      userId,
    }
    const condition2 = {
      userId,
      completed: true,
    }
    const condition3 = {
      userId,
      completed: false,
      expireTime: {
        [Op.lte]: currentString,
      },
    }

    const action1 = Item.count({
      where: condition1,
    })
    const action2 = Item.count({
      where: condition2,
    })
    const action3 = Item.count({
      where: condition3,
    })

    const count1 = await action1
    const count2 = await action2
    const count3 = await action3
    return {
      state: 1000, msg: '成功获取列表', data: {
        all: count1,
        complete: count2,
        expire: count3,
      },
    }
  }

  async addItem() {
    const { ctx } = this
    const { request } = ctx
    const { Item } = ctx.model
    const { user: { id: userId }, body } = request
    const { content } = body
    let { note } = body
    note = note ? note : ''
    const expireTime = moment()
      .add(1, 'days')
      .toDate()
    const completed = false
    const item = await Item.create({
      userId, content, note, expireTime, completed,
    })
    return {
      state: 1000, msg: '添加成功', item,
    }
  }

  async modifyItem() {
    const { ctx } = this
    const { request } = ctx
    const { Item } = ctx.model
    const { body, user: { id: userId } } = request
    const { content, expireTime, id, completed } = body
    const modifyItem = { id, userId }
    if (content && content !== '') {
      modifyItem.content = content
    }
    if (expireTime && expireTime !== '') {
      modifyItem.expireTime = moment(expireTime, 'YYYYMMDDHHmmss')
        .toDate()
    }
    if (typeof (completed) !== 'undefined') {
      modifyItem.completed = completed
    }
    await Item.upsert(modifyItem)
    return {
      state: 1000, msg: '修改成功',
    }
  }

  async clearAll() {
    const { ctx } = this
    const { request } = ctx
    const { Item } = ctx.model
    const { user: { id: userId }, body } = request
    const { completed, type } = body
    let condition = {}
    if (type === '0') {
      condition = {
        userId,
      }
    } else if (type === '1') {
      condition = {
        userId,
        completed: false,
      }
    } else if (type === '2') {
      condition = {
        userId,
        completed: true,
      }
    }
    await Item.update({
      completed,
    }, {
      where: condition,
    })
    return {
      state: 1000, msg: '修改成功',
    }
  }

  async completeItem() {
    const { ctx } = this
    const { request } = ctx
    const { Item } = ctx.model
    const { body } = request
    const { id } = body
    const completeTime = moment()
      .toDate()
    // update
    await Item.update({
      completeTime,
      completed: true,
    }, {
      where: {
        id,
      },
    })
    return { state: 1000, msg: '完成任务！', completeTime }
  }

  async deleteItems() {
    const { ctx } = this
    const { request } = ctx
    const { Item } = ctx.model
    const { body } = request
    const { ids } = body
    // destroy
    await Item.destroy({
      where: {
        id: { [Op.in]: ids },
      },
    })
    return { state: 1000, msg: '删除任务成功！' }
  }

  async deleteItem() {
    const { ctx } = this
    const { params } = ctx
    const { Item } = ctx.model
    const { id } = params

    // destroy
    await Item.destroy({
      where: {
        id,
      },
    })
    return { state: 1000, msg: '删除任务成功！' }
  }

  async deleteComplete() {
    const { ctx } = this
    const { request } = ctx
    const { Item } = ctx.model
    const { user: { id: userId } } = request
    const condition = { userId, completed: true }
    // destroy
    await Item.destroy({
      where: condition,
    })
    return { state: 1000, msg: '删除成功' }
  }

  async deleteExpire() {
    const { ctx } = this
    const { request } = ctx
    const { Item } = ctx.model
    const { user: { id: userId } } = request
    const currentString = moment()
      .format('YYYY-MM-DD HH:mm')
    const condition = {
      userId,
      completed: false,
      expireTime: {
        [Op.lte]: currentString,
      },
    }
    // destroy
    await Item.destroy({
      where: condition,
    })
    const items = await Item.find({
      where: {
        userId,
      },
    })
    return { state: 1000, list: items }
  }
}

module.exports = ItemService
