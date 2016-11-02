var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var itemSchema = new Schema({
    owner_id:{
        type:Schema.Types.ObjectId,
        ref:'User'
    },
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
var promise = require('bluebird');
promise.promisifyAll(Item);
promise.promisifyAll(Item.prototype);

module.exports = Item;

