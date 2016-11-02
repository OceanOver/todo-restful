'use strict';

var $ = require('jquery');
require('sweetalert');
var login = require('./login');
var register = require('./register');
var main = require('./main');
var progress = $.AMUI.progress;
var toastr = require('toastr');


$(function() {

    var pageName = $('body').attr('name');
    //request timeout
    $.ajaxSetup({
            type:'POST',
            timeout:100000,
            error:function(xhr,status,error) {
                progress.done();
                toastr.warning('请求超时');
            }
        });
    if (pageName === 'index') {
        login.bindEvent();
    } else if (pageName === 'register') {
        register.bindEvent();
    } else if (pageName === 'main') {
        main.initMain();
    }
});
