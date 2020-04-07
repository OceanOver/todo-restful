'use strict'

// had enabled by egg
// exports.static = true

exports.nunjucks = {
  enable: true,
  package: 'egg-view-nunjucks',
}

exports.sequelize = {
  enable: true,
  package: 'egg-sequelize',
}

exports.redis = {
  enable: true,
  package: 'egg-redis',
}

exports.sessionRedis = {
  enable: true,
  package: 'egg-session-redis',
}

exports.routerPlus = {
  enable: true,
  package: 'egg-router-plus',
}
