var express = require('express');
var router = express.Router();
var controller = require('./user.controller');

router.post('/register',controller.register);

module.exports = router;