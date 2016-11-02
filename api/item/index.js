var express = require('express');
var router = express.Router();
var controller = require('./item.controller');
var auth = require('../../auth&login/auth');

router.all('/list',auth.authenticate(),controller.list);
router.all('/addItem',auth.authenticate(),controller.addItem);
router.all('/modifyItem',auth.authenticate(),controller.modifyItem);
router.all('/deleteComplete',auth.authenticate(),controller.deleteComplete);
router.all('/deleteItems',auth.authenticate(),controller.deleteItems);
router.all('/deleteItem',auth.authenticate(),controller.deleteItem);
router.all('/clearItem',auth.authenticate(),controller.clearItem);
router.all('/clearAll',auth.authenticate(),controller.clearAll);
router.all('/completeItem',auth.authenticate(),controller.completeItem);
router.all('/itemLeft',auth.authenticate(),controller.itemLeft);

module.exports = router;