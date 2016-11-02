var express = require('express');
var router = express.Router();
var login  = require('./login').login;

require('./login').setup();

router.post('/',login);

module.exports = router;