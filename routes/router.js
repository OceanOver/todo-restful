
module.exports = function (app) {
    app.use('/items',require('./../api/item'));
}