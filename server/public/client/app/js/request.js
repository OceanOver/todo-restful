/**
 * Created by YT on 2017/1/11.
 */
var $ = require('jquery');
var progress = $.AMUI.progress;
var toastr = require('toastr');

$.ajaxSetup({
	timeout: 10000
});

exports.request = function (type, path, prams, cb) {
	var url = path;
	progress.start();
	var ajaxRequest = $.ajax({
		method: type,
		url: url,
		dataType: 'json',
		data: prams,
	});
	ajaxRequest.done(function (result) {
		progress.done();
		cb(null, result);
	});
	ajaxRequest.fail(function (jqXHR, textStatus) {
		progress.done();
		if (textStatus == 'timeout') {
			toastr['warning']('请求超时');
		} else {
			toastr['warning']('请求失败');
		}
		cb(textStatus, null);
	});
}
