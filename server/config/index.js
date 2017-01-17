//环境配置
var path = require('path');
var _ = require('lodash');
var fs = require('fs');

var params = {
    env: process.env.NODE_ENV,
    root: path.normalize(__dirname + '/../../..'),
    port: process.env.PORT || 3000,
    //mongodb configuration
    database: {
        options: {
            db: {
                safe: true
            }
        }
    },
	redis: {
		port: 6379,          // Redis port
		host: '127.0.0.1',   // Redis host
		family: 4,           // 4 (IPv4) or 6 (IPv6)
		db: 1               // Database index to use
	},
    session:{
        //random string
        secret:'PeS9hWTDUiGiLFUFKUorYm6mVz3gPad0',
		store: {
			url: 'redis://127.0.0.1:6379/1',
			ttl: 24 * 60 * 60, //one day,
		}
    },
	jwtSecret:'PeS9hWTDUiGiLFUFKUorYm6mVz3gPad0'
};

var config = _.merge(params,require('./' + process.env.NODE_ENV + '.js') || {});

module.exports = config;
