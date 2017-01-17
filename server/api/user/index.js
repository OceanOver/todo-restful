var express = require('express');
var router = express.Router();
var controller = require('./user.controller');
var auth = require('../../auth&login/auth');

router.post('/register',controller.register);
router.post('/login',controller.login);
router.get('/captcha',controller.getCaptcha);
router.post('/logout',auth.authenticate(),controller.logout);

module.exports = router;