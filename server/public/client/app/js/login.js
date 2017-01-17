var $ = require('jquery');
var CryptoJS = require("crypto-js");
var ajaxHandler = require('./request');
var toastr = require('toastr');

var todoLogin = {
	bindEvent: function () {
		//captcha
		$('.captcha-image').click(function (e) {
			var img = e.target;
			var src = '/user/captcha?rc='+Math.random();
			img.setAttribute('src',src);
		});
		// login
		$('.login-button').click(function (e) {
			/* replace whitespace with '' */
			var username = $('.login-username').val().replace(/(^\s+)|(\s+$)/g, '');
			var password = $('.login-password').val().replace(/(^\s+)|(\s+$)/g, '');
			var captcha = $('.login-captcha').val();
			var alertMsg;
			if (!username || username.length === 0) {
				alertMsg = '请输入用户名';
			}else if (!password || password.length === 0) {
				alertMsg = '请输入密码';
			}else if (!captcha || captcha.length === 0) {
				alertMsg = '请输入验证码';
			}
			if (alertMsg) {
				toastr['warning'](alertMsg);
				return;
			}
			var passwordMD5 = CryptoJS.MD5(password) + '';
			$('.login-button').addClass('am-disabled');
			ajaxHandler.request('POST', '/user/login', {
				username: username,
				password: passwordMD5,
				captcha:captcha
			}, function (err,data) {
				$('.login-button').removeClass('am-disabled');
				if (data) {
					/*optional stuff to do after success */
					if (data.state === 1000) {
						// swal("登陆成功", "点击进入主页", "success")；
						swal({
							title: "登陆成功",
							type: "success",
							confirmButtonText: "OK",
							closeOnConfirm: true
						}, function () {
							setTimeout("javascript:location.href='./main.html'", 1000);
						});
					} else {
						swal(data.msg);
					}
				}
			});
		});
	}
}

module.exports = todoLogin;
