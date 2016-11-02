var jwt = require('jsonwebtoken');
var expressjwt = require('express-jwt');
var mongoose = require('mongoose');
var User = mongoose.model('User');
var compose = require('composable-middleware');
var config = require('../config/env')

/*
 生成 token
 */
function generateToken(id) {
    return jwt.sign({_id: id}, config.session.secret, {expiresIn: '24h'});
}

/*
 验证 token
 */
function verifyToken() {
    return compose()
        .use(function (req, res, next) {
            var token = req.cookies.token;
            if (!token) {
                return res.json({message:'用户未登录或登录过期',state:1005});
            }
            next();
        })
        .use(expressjwt({
            secret: config.session.secret
        }));
}

/*
 验证用户权限
 */
function authenticate() {
    return compose()
        .use(verifyToken())
        .use(function (err, req, res, next) {
            //expressJwt 错误处理中间件
            if (err.name === 'UnauthorizedError') {
                return res.send({'state':1004,'message':'未通过验证'});
            }
            next();
        })
        .use(function (req, res, next) {
            User.findById(req.user._id, function (err, user) {
                if (err) return res.status(500).send();
                if (!user) return res.send({'state':1003,'message':'用户不存在'});
                req.user = user;
                next();
            });
        });
}

exports.generateToken = generateToken;
exports.verifyToken = verifyToken;
exports.authenticate = authenticate;

