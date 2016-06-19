var express = require('express');
var router = express.Router();
var controller = require('./item.controller');

router.all('/list',controller.list);
router.all('/addItem',controller.addItem);
router.all('/modifyItem',controller.modifyItem);
router.all('/deleteComplete',controller.deleteComplete);
router.all('/deleteItems',controller.deleteItems);
router.all('/deleteItem',controller.deleteItem);
router.all('/clearItem',controller.clearItem);
router.all('/clearAll',controller.clearAll);
router.all('/completeItem',controller.completeItem);
router.all('/itemLeft',controller.itemLeft);

module.exports = router;