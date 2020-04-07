'use strict'

/**
 * 用户
 */

const crypto = require('crypto')

module.exports = app => {
  const { STRING, INTEGER } = app.Sequelize
  const User = app.model.define(
    'User',
    {
      id: {
        type: INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      username: {
        type: STRING,
        allowNull: true,
        unique: true,
      },
      headIcon: {
        type: STRING,
      },
      hashedPassword: {
        type: STRING,
      },
      salt: {
        type: STRING,
      },
    },
    {
      getterMethods: {},
      setterMethods: {
        // 不要使用箭头函数，会导致 this 指向错误
        password(value) {
          const salt = this.makeSalt()
          this.setDataValue('salt', salt)
          const hashedPassword = this.encryptPassword(value)
          this.setDataValue('hashedPassword', hashedPassword)
        },
      },
      timestamps: true,
      createdAt: 'createTime',
      updatedAt: 'updateTime',
      freezeTableName: true,
      tableName: 'users',
    }
  )

  // Instance Method
  // 验证用户密码
  User.prototype.authenticate = function(password) {
    return this.encryptPassword(password) === this.hashedPassword
  }
  // 生成盐
  User.prototype.makeSalt = function() {
    return crypto.randomBytes(16)
      .toString('base64')
  }
  // 生成密码
  User.prototype.encryptPassword = function(password) {
    if (!password || !this.salt) return ''
    const salt = new Buffer(this.salt, 'base64')
    return crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha1')
      .toString('base64')
  }

  return User
}
