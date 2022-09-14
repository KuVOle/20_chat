const { Router } = require('express');
const MessageController = require('../controllers/message.controller');

const router = Router();

router.get('/', MessageController.get.bind(MessageController));
router.post('/', MessageController.add.bind(MessageController));

router.get('/:id', MessageController.add.bind(MessageController));
router.post('/:id', MessageController.add.bind(MessageController));

module.exports = router;