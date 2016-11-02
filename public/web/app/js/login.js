var $ = require('jquery');
var progress = $.AMUI.progress;
var CryptoJS = require("crypto-js");

var todoLogin = {
    bindEvent: function() {
        $('.login-button').click(function(event) {
            /* Act on the event */
            var username = $('.login-username').val().replace(/(^\s+)|(\s+$)/g, '');
            var password = $('.login-password').val().replace(/(^\s+)|(\s+$)/g, '');
            if (!username || username.length === 0) {
                return;
            }
            if (!password || password.length === 0) {
                return;
            }
            var passwordMD5 = CryptoJS.MD5(password) + '';
            progress.start();
            $('.login-button').addClass('am-disabled');
            $.post('/login', {
                username: username,
                password: passwordMD5
            }, function(data) {
                progress.done();
                $('.login-button').removeClass('am-disabled');
                /*optional stuff to do after success */
                if (data.state === 1000) {
                    // swal("登陆成功", "点击进入主页", "success")；
                    swal({
                        title: "登陆成功",
                        type: "success",
                        confirmButtonText: "OK",
                        closeOnConfirm: true
                    }, function() {
                        // window.location.href='./main.html';
                        setTimeout("javascript:location.href='./main.html'", 1000);
                    });
                } else {
                    swal(data.message);
                }
            });
        });
    }
}

module.exports = todoLogin;
