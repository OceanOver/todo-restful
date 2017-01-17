'use strict';

var $ = require('jquery');
var toastr = require('toastr');
require('sweetalert');
var login = require('./login');
var register = require('./register');
var main = require('./main');


$(function() {
	//toastr option
	toastr.options = {
		"closeButton": true,
		"newestOnTop": false,
		"positionClass": "toast-bottom-right",
		"timeOut": "3000"
	}
    var pageName = $('body').attr('name');
    if (pageName === 'index') {
        login.bindEvent();
    } else if (pageName === 'register') {
        register.bindEvent();
    } else if (pageName === 'main') {
        main.initMain();
    }
});
