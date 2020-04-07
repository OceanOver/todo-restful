'use strict'

module.exports = appInfo => {
  const config = exports = {}

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1543663162360_4558'

  config.name = 'TODOS'

  config.description = 'ssr todo edit by egg'

  // add your config here
  config.middleware = [ 'locals' ]

  // view
  config.view = {
    defaultViewEngine: 'nunjucks',
    mapping: {
      '.nj': 'nunjucks',
    },
  }

  // view cache
  config.nunjucks = {
    cache: true,
  }

  // security
  config.security = {
    xframe: {
      enable: false,
    },
    csrf: {
      headerName: 'x-csrf-token',
    },
  }

  // session
  config.session = {
    key: 'SSR_TODO',
    maxAge: 24 * 3600 * 1000, // 1 天
    httpOnly: true,
    encrypt: true,
  }

  // session store
  config.sessionRedis = {
    name: 'session', // specific instance `session` as the session store
  }

  // token
  config.token = {
    secret: 'todo_token_087987682123',
    expiresIn: 24 * 3600 * 1000, // 1 天
  }

  return config
}
