'use strict'

/*
  线上生产环境
 */
module.exports = () => {
  const config = exports = {}

  // sequelize (database)
  config.sequelize = {
    // support: mysql, mariadb, postgres, mssql
    dialect: 'mysql',
    database: 'todo',
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
      db: 2,
      password: '',
    },
  }

  return config
}
