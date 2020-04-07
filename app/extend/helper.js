'use strict'

const jwt = require('jsonwebtoken')

// generate token
exports.signToken = (user, options) => {
  const { secret, expiresIn } = options
  return jwt.sign(
    { id: user.id, username: user.username },
    secret,
    { expiresIn }
  )
}

// verify token
exports.authToken = (token, options) => {
  const { secret } = options
  try {
    const decoded = jwt.verify(token, secret)
    if (!decoded) {
      return {
        result: false,
        msg: 'token已失效',
      }
    }
    return {
      result: true,
      data: decoded,
    }
  } catch (err) {
    return {
      result: false,
      msg: 'token已失效',
    }
  }
}

