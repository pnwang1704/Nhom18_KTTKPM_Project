const chatService = require('../services/chat.service');

const getMyConversation = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    let conversation = await chatService.getConversations({ userId, status: 'open' });
    
    if (conversation.length === 0) {
      return res.status(200).json({ success: true, data: null });
    }
    
    res.status(200).json({ success: true, data: conversation[0] });
  } catch (error) {
    next(error);
  }
};

const getMessages = async (req, res, next) => {
  try {
    const { conversationId } = req.params;
    const { limit, offset } = req.query;
    const messages = await chatService.getMessages(conversationId, parseInt(limit), parseInt(offset));
    res.status(200).json({ success: true, data: messages.reverse() });
  } catch (error) {
    next(error);
  }
};

const getAllConversations = async (req, res, next) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Forbidden' });
    }
    const conversations = await chatService.getConversations();
    res.status(200).json({ success: true, data: conversations });
  } catch (error) {
    next(error);
  }
};

const readMessages = async (req, res, next) => {
  try {
    const { conversationId } = req.params;
    await chatService.markAsRead(conversationId);
    res.status(200).json({ success: true });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getMyConversation,
  getMessages,
  getAllConversations,
  readMessages
};
