var mongoose = require('mongoose');
var User = mongoose.model('User');
var loginHandle = require('../../auth&login/login').login;
var ccap = require('ccap');

/*
 user register
 */
exports.register = function (req, res, next) {
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
		return res.status(422).json({state: 1001, msg: message});
	}
	var newUser = new User();
	newUser.username = username;
	newUser.password = password;
	newUser.save().then(function (user) {
		return res.json({state: 1000, user: user});
	}).catch(function (err) {
		var message = err.message;
		if (message.indexOf('duplicate')) {
			return res.json({state: 1002, msg: '用户名已存在'});
		}
		return next(err);
	});
}

exports.login = function (req, res, next) {
	loginHandle(req, res, next);
}

exports.logout = function (req, res, next) {
	req.session.token = null;
	return res.json({state: 1000});
}

function generateCaptcha() {
	var text = Math.random().toString(16).slice(2, 6);
	var captcha = ccap({
		width: 130,//set width
		height: 50,//set height
		offset: 30,//set text spacing
		quality: 100,//set pic quality
		fontsize: 50,//set font size
		generate: function(){
			return text;
		}
	});
	//[0] is captcha's text, [1] is captcha picture buffer.
	var array = captcha.get();
	return array;
}

exports.getCaptcha = function (req, res, next) {
	var array = generateCaptcha();
	var captchaImg = array[1];
	var captchaText = array[0];
	req.session.captcha = captchaText;
	res.set('Content-Type','image/jpeg');
	return res.send(captchaImg);
}
