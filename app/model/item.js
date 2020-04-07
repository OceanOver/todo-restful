'use strict'

/**
 * item
 */

const moment = require('moment')

module.exports = app => {
  const { STRING, INTEGER, DATE, BOOLEAN } = app.Sequelize

  const Item = app.model.define('Item', {
    id: {
      type: INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    userId: {
      type: INTEGER,
      allowNull: false,
    },
    content: {
      type: STRING,
    },
    expireTime: {
      type: DATE,
    },
    completeTime: {
      type: DATE,
    },
    note: {
      type: STRING,
    },
    completed: {
      type: BOOLEAN,
    },
  }, {
    getterMethods: {
      expired: () => {
        const currentString = moment()
          .format('YYYYMMDDHHmmss')
        const expireTime = moment(this.expireTime)
          .format('YYYYMMDDHHmmss')
        return currentString > expireTime
      },
    },
    setterMethods: {},
    instanceMethods: {},
    timestamps: true,
    createdAt: 'createTime',
    updatedAt: 'updateTime',
    freezeTableName: true,
    tableName: 'items',
  })

  return Item
}
