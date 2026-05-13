const Conversation = require('../models/Conversation');
const Message = require('../models/Message');
const { getIO } = require('../sockets/io');

const sendMessage = async ({ conversationId, senderId, senderRole, content, messageType, attachments, userName }) => {
  let conversation;

  // 1. Tìm hoặc tạo hội thoại nếu chưa có ID
  if (!conversationId) {
    conversation = await Conversation.findOne({ userId: senderId, status: 'open' });
    if (!conversation) {
      conversation = await Conversation.create({ 
        userId: senderId,
        userName: userName || 'Khách hàng'
      });
    }
  } else {
    conversation = await Conversation.findById(conversationId);
  }

  if (!conversation) throw new Error('Conversation not found');

  // Debug tên nhận được từ frontend
  console.log(`[Chat] Received message from ${senderId}. Name: ${userName}`);

  // Cập nhật tên nếu đang là mặc định hoặc chưa có (áp dụng cho cả hội thoại cũ và mới)
  if (senderRole === 'user' && userName && (conversation.userName === 'Khách hàng' || !conversation.userName)) {
    console.log(`[Chat] Updating conversation name for ${senderId} to ${userName}`);
    conversation.userName = userName;
    await conversation.save();
  }

  // 2. Lưu tin nhắn
  const message = await Message.create({
    conversationId,
    senderId,
    senderRole,
    content,
    messageType,
    attachments
  });

  // 3. Cập nhật hội thoại
  conversation.lastMessage = messageType === 'image' ? '[Hình ảnh]' : (messageType === 'file' ? '[Tệp tin]' : content);
  conversation.lastMessageAt = new Date();
  if (senderRole === 'user') {
    conversation.unreadCount += 1;
  }
  await conversation.save();

  // 4. Emit realtime events
  const io = getIO();
  
  // Gửi tới phòng hội thoại
  io.to(`conv:${conversationId}`).emit('receive_message', message);

  // Gửi tới admin
  io.to('admins').emit('conversation_updated', {
    conversation,
    lastMessage: message
  });

  return message;
};

const getMessages = async (conversationId, limit = 50, offset = 0) => {
  return await Message.find({ conversationId })
    .sort({ createdAt: -1 })
    .skip(offset)
    .limit(limit);
};

const getConversations = async (query = {}) => {
  return await Conversation.find(query).sort({ lastMessageAt: -1 });
};

const markAsRead = async (conversationId) => {
  await Conversation.findByIdAndUpdate(conversationId, { unreadCount: 0 });
  await Message.updateMany({ conversationId, isRead: false }, { isRead: true });
  
  const io = getIO();
  io.to(`conv:${conversationId}`).emit('messages_read', { conversationId });
};

module.exports = {
  sendMessage,
  getMessages,
  getConversations,
  markAsRead
};
