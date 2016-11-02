
module.exports = function (app) {
    app.use('/login',require('../auth&login'));
    app.use('/user',require('../api/user'));
    app.use('/items',require('../api/item'));
}