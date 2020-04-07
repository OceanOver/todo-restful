'use strict'

/*
  本地测试环境
 */
module.exports = () => {
  const config = exports = {}

  config.security = {
    xframe: {
      enable: false,
    },
    csrf: {
      enable: false,
    },
  }

  // sequelize (database)
  config.sequelize = {
    // support: mysql, mariadb, postgres, mssql
    dialect: 'mysql',
    database: 'todo_test',
    host: '127.0.0.1',
    port: '3306',
    username: 'root',
    password: '123456',
  }

  // Redis
  config.redis = {
    client: {
      port: 6379, // Redis port
      host: '127.0.0.1', // Redis host
      db: 3,
      password: '',
    },
  }

  return config
}
