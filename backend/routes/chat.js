const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chatController');
const { auth } = require('../middleware/auth');

router.get('/conversations', auth, chatController.getConversations);
router.get('/conversations/:conversationId/messages', auth, chatController.getMessages);
router.post('/conversations/:conversationId/messages', auth, chatController.sendMessage);
router.post('/conversations', auth, chatController.createConversation);

module.exports = router;