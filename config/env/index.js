//环境配置
var path = require('path');
var _ = require('lodash');
var fs = require('fs');

var params = {
    env: process.env.NODE_ENV,
    root: path.normalize(__dirname + '/../../..'),
    port: process.env.PORT || 3000,
    //mongodb数据库配置
    database: {
        options: {
            db: {
                safe: true
            }
        }
    },
    session:{
        secret:'todo-secret'
    }
};

var config = _.merge(params,require('./' + process.env.NODE_ENV + '.js') || {});

module.exports = config;