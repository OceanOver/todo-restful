var express = require('express');
var router = express.Router();
var loginHandle  = require('./login');

loginHandle.setup();
router.post('/',loginHandle.login);

module.exports = router;