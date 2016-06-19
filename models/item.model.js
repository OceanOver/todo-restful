var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var itemSchema = new Schema({
    content: String,
    createTime: {
        type: Date,
        default: Date.now
    },
    modifyTime: Date,
    completeTime: Date,
    completed: {
        type: Boolean,
        default: false
    },
    note: String
});

var Item = mongoose.model('Item', itemSchema);
var Promise = require('bluebird');
Promise.promisifyAll(Item);
Promise.promisifyAll(Item.prototype);

module.exports = Item;

