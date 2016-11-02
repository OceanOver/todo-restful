var $ = require('jquery');
var progress = $.AMUI.progress;
var CryptoJS = require("crypto-js");

var todoRegister = {
    bindEvent:function() {
        $('.register-button').click(function(event) {
            /* Act on the event */
            var username = $('.register-username').val().replace(/(^\s+)|(\s+$)/g, '');
            var password = $('.register-password').val().replace(/(^\s+)|(\s+$)/g, '');
            var confirmPas = $('.register-confirm').val().replace(/(^\s+)|(\s+$)/g, '');
            if (!username || username.length === 0) {
                return;
            }
            if (!password || password.length === 0) {
                return;
            }
            if (confirmPas != password) {
                $('.group-register-confirm').addClass('am-form-warning');
                $('.register-confirm').attr('placeholder', '密码输入不一致');
                $('.register-confirm').val('');
                return;
            }
            var passwordMD5 = CryptoJS.MD5(password) + '';
            progress.start();
            $.post('/user/register', {username:username,password:passwordMD5}, function(data) {
                progress.done();
                /*optional stuff to do after success */
                if (data.state === 1000) {
                    swal('注册成功');
                }else if (data.state === 1002) {
                    swal('用户名已存在');
                } else {
                    swal("注册失败");
                }
            });
        });

        $('.register-confirm').focus(function(event) {
            /* Act on the event */
            if ($('.group-register-confirm').hasClass('am-form-warning')) {
                $('.group-register-confirm').removeClass('am-form-warning');
                $('.register-confirm').attr('placeholder', '输入密码');
            }
        });
    }
}

module.exports = todoRegister;
