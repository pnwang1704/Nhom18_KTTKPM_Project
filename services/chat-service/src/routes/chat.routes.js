const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chat.controller');
const { authMiddleware, adminMiddleware } = require('../middlewares/auth.middleware');

// router.use(authMiddleware); // Không dùng chung cho cả router

// User & Admin
router.get('/my-conversation', authMiddleware, chatController.getMyConversation);
router.get('/messages/:conversationId', authMiddleware, chatController.getMessages);
router.post('/read/:conversationId', authMiddleware, chatController.readMessages);

// Admin only
router.get('/admin/conversations', authMiddleware, adminMiddleware, chatController.getAllConversations);

module.exports = router;
