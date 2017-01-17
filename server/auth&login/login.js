var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var auth = require('./auth');
var mongoose = require('mongoose');
var User = mongoose.model('User');

exports.setup = function () {
	passport.use(new LocalStrategy({
		usernameField: 'username',
		passwordField: 'password'
	}, function (username, password, done) {
		var promise = User.findOne({username: username}).exec();
		promise.then(function (user) {
				if (!user) {
					return done(null, false, '用户名不存在');
				}
				if (!user.verifyPassword(password)) {
					return done(null, false, '密码错误');
				}
				return done(null, user);
			})
			.catch(function (err) {
				if (err) {
					return done(err);
				}
			});
	}));
}

exports.login = function (req, res, next) {
	//valid captcha
	var captcha = req.body.captcha;
	var sessionCaptcha = req.session.captcha;
	var error_msg;
	if (!captcha) {
		error_msg = "验证码不能为空";
	} else if (!sessionCaptcha) {
		error_msg = "请重新生成验证码";
	} else if (captcha !== sessionCaptcha) {
		error_msg = "验证码错误";
	}
	if (error_msg) {
		return res.json({state: 1002, msg: error_msg});
	}
	passport.authenticate('local', function (err, user, message) {
			if (err) {
				next(err);
			}
			if (!user) {
				return res.json({state: 1001, msg: message});
			}
			var token = auth.generateToken(user._id);
			req.session.token = token;
			req.session.captcha = null;
			return res.json({state: 1000});
		}
	)(req, res, next);
}
