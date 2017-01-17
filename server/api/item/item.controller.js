var mongoose = require('mongoose');
var Item = mongoose.model('Item');

/*
 * items of user
 */
function itemsOfUser(userId, callback) {
	return Item.findAsync({'owner_id': userId}).then(function (users) {
		callback(null, users);
	}).catch(function (err) {
		callback(err);
	});
}
var Promise = require('bluebird');
var itemsOfUserAsync = Promise.promisify(itemsOfUser);

/*
 * item list
 */
exports.list = function (req, res, next) {
	var userId = req.user._id;
	// 0:all 1:active 2:completed
	var type = req.body.type;
	var condition = {};
	if (type === '1') {
		condition = {'owner_id': userId, 'completed': false};
	} else if (type === '2') {
		condition = {'owner_id': userId, 'completed': true};
	}
	// _id 生成算法中已经包含了创建的时间，按时间倒序
	var username = req.user.username;
	Item.findAsync(condition).then(function (items) {
		result = {'state': 1000, 'msg': '成功获取列表', 'list': items, username: username};
		if (items.length === 0) {
			var result = {'state': 1001, 'msg': '暂无内容', username: username};
		}
		return res.json(result);
	}).catch(function (err) {
		return next(err);
	});
}

/*
 * add item
 */
exports.addItem = function (req, res, next) {
	var owner_id = req.user._id;
	var content = req.body.content;
	var note = req.body.note ? req.body.note : '';
	var error_msg;
	if (!content) {
		error_msg = '内容不能为空.';
	}
	if (error_msg) {
		return res.status(422).send({error_msg: error_msg});
	}
	var item = new Item({
		owner_id: owner_id,
		content: content,
		note: note
	});
	Item.createAsync(item).then(function (item) {
		var result = {'state': 1000, 'msg': '添加成功', 'item': item};
		return res.status(200).json(result);
	}).catch(function (err) {
		return next(err);
	});
}

/*
 * modify item
 */
exports.modifyItem = function (req, res, next) {
	var itemId = req.body.id;
	var content = req.body.content;
	var modifyTime = new Date();
	var modifyItem = {'content': content, 'modifyTime': modifyTime};
	Item.findByIdAndUpdateAsync(itemId, modifyItem).then(function () {
		var result = {'state': 1000, 'msg': '修改成功！'};
		return res.status(200).json(result);
	}).catch(function (err) {
		return next(err);
	});
}

/*
 * complet items(item)
 */
exports.completeItem = function (req, res, next) {
	var itemIds = req.body.ids; //id数组
	var items = [];
	var length = itemIds.length;
	for (var i = 0; i < length; i++) {
		var id = itemIds[i];
		var item = {_id: id, completed: true};
		items.push(item);
	}
	//batch update
	Item.update({'_id': {$in: itemIds}}, {$set: {completed: true}}, {multi: true}).then(function (raw) {
		var result = {'state': 1000, 'msg': '完成任务！'};
		return res.status(200).json(result);
	}).catch(function (err) {
		return next(err);
	});
}

/**
 * clear item
 */
exports.clearItem = function (req, res, next) {
	var itemId = req.body.id;
	var completed = req.body.completed;
	Item.update({'_id': itemId}, {completed: completed}, {multi: true}).then(function (raw) {
		var result = {'state': 1000, 'msg': '完成任务！'};
		return res.status(200).json(result);
	}).catch(function (err) {
		return next(err);
	});
}

/**
 * clear all item
 */
exports.clearAll = function (req, res, next) {
	var userId = req.user._id;
	var completed = req.body.completed;
	if (!completed) {
		return res.status(400).json({state: 1002, msg: '请求参数格式有误'});
	}
	//batch update
	Item.updateAsync({owner_id: userId}, {$set: {completed: completed}}, {multi: true}).then(function (raw) {
		var result = {'state': 1000, 'msg': '完成任务！', list: raw};
		return res.status(200).json(result);
	}).catch(function (err) {
		return next(err);
	});
}

/*
 * delete items(item)
 */
exports.deleteItems = function (req, res, next) {
	var itemIds = req.body.ids; //id数组
	Item.removeAsync({_id: {$in: itemIds}}).then(function () {
		var result = {'state': 1000, 'msg': '删除任务成功！'};
		return res.status(200).json(result);
	}).catch(function (err) {
		return next(err);
	});
}

/*
 * delete item
 */
exports.deleteItem = function (req, res, next) {
	var itemId = req.body.id;
	Item.findByIdAndRemoveAsync(itemId).then(function () {
		var result = {'state': 1000, 'msg': '删除任务成功！'};
		return res.status(200).json(result);
	}).catch(function (err) {
		return next(err);
	});
}

/*
 * delete complete item
 */
exports.deleteComplete = function (req, res, next) {
	var userId = req.user._id;
	Item.countAsync({owner_id: userId, completed: true}).then(function (count) {
		if (count > 0) {
			return Item.removeAsync({owner_id: userId, completed: true}).then(function () {
				var result = {'state': 1000, 'msg': '已删除完成任务！'};
				return res.status(200).json(result);
			}).catch(function (err) {
				return next(err);
			});
		} else {
			var result = {'state': 1001, 'msg': '暂无未完成的项目'};
			return res.status(200).json(result);
		}
	}).catch(function (err) {
		return next(err);
	});
}

/*
 * item left
 */
exports.itemLeft = function (req, res, next) {
	var userId = req.user._id;
	Item.countAsync({owner_id: userId, completed: false}).then(function (count) {
		var result = {'state': 1000, 'msg': '请求成功！', 'count': count};
		return res.status(200).json(result);
	}).catch(function (err) {
		return next(err);
	});
}
