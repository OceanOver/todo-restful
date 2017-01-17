var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var crypto = require('crypto');

var UserSchema = new Schema({
    username: {
        type: String,
        unique: true
    },
    hashedPassword: String,
    salt: String
});

UserSchema.virtual('password')
    .set(function (password) {
        this._password = password;
        this.salt = this.makeSalt();
        this.hashedPassword = this.generatePassword(password);
    })
    .get(function () {
        return this._password;
    });

UserSchema.methods = {
    //加盐
    makeSalt: function () {
        return crypto.randomBytes(16).toString('hex');
    },
    //加盐加密生成密码
    generatePassword: function (password) {
        if (!password || !this.salt)
            return '';
        var salt = new Buffer(this.salt, 'hex');
        return crypto.pbkdf2Sync(password, salt, 1000, 64,'sha1').toString('hex');
    },
    //验证密码
    verifyPassword:function (password) {
        return this.generatePassword(password) === this.hashedPassword;
    }
}

var User = mongoose.model('User', UserSchema);
var promise = require('bluebird');
promise.promisifyAll(User);
promise.promisifyAll(User.prototype);

module.exports = User;