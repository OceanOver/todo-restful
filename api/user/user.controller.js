var mongoose = require('mongoose');
var User = mongoose.model('User');

/*
 user register
 */
exports.register = function (req, res,next) {
    //替换全部空格为空
    var username = req.body.username ? req.body.username.replace(/(^\s+)|(\s+$)/g, '') : '';
    var password = req.body.password ? req.body.password.replace(/(^\s+)|(\s+$)/g, '') : '';
    var message;
    if (username === '') {
        message = '用户名不能为空';
    } else if (password === '') {
        message = '密码不能为空';
    }
    if (message) {
        return res.status(422).json({state:1001,message:message});
    }
    var newUser = new User();
    newUser.username = username;
    newUser.password = password;
    newUser.saveAsync().then(function (user) {
        return res.status(200).json({state:1000,user:user});
    }).catch(function (err) {
        var message = err.message;
        if (message.indexOf('duplicate')) {
            return res.status(200).json({state:1002,message:'用户名已存在'});
        }
        return next(err);
    });
}